/**
 * Orchestrates a single level's playthrough: owns the loader, storage, UI, and
 * Game instances and wires them together. It turns player input into game
 * logic calls and pushes the resulting state out to the UI, while persisting
 * progress.
 */
class LevelPlayer {
  /**
   * Wires up the collaborators (loader, storage, UI) with empty level/game state;
   * the actual level is loaded later by {@link LevelPlayer#init}.
   */
  constructor() {
    this.loader = new LevelLoader();
    this.storage = new LevelStorage();
    this.ui = new LevelUI();
    this.level = null;
    this.game = null;
    this.itemsById = {};
  }

  /**
   * The expected answer for the current phase, used to drive hotspot fills and
   * scene highlights, or "" when there is no current phase.
   *
   * @returns {string}
   */
  currentCommand() {
    const phaseDef = this.game.currentPhaseDef;
    return phaseDef ? phaseDef.answer : "";
  }

  /**
   * Builds a lookup from item id to its full item object by scanning every
   * phase's addItem effect, normalizing bare-string items into objects. Lets the
   * UI show friendly inventory labels from just an id.
   */
  buildItemIndex() {
    const itemsById = {};

    this.level.phases.forEach((phaseDef) => {
      const item = phaseDef.effects && phaseDef.effects.addItem;
      if (item) {
        const itemObject =
          typeof item === "string" ? { id: item, label: item } : item;
        itemsById[itemObject.id] = itemObject;
      }
    });

    this.itemsById = itemsById;
  }

  /**
   * The display label for an inventory item id, falling back to the id itself
   * when the item is unknown.
   *
   * @param {string} itemId
   * @returns {string}
   */
  inventoryLabel(itemId) {
    return (this.itemsById[itemId] && this.itemsById[itemId].label) || itemId;
  }

  /**
   * The phase number to show in the UI: the current phase, clamped to the last
   * phase so a completed level still renders its final scene rather than running
   * off the end.
   *
   * @returns {number}
   */
  displayPhase() {
    return Math.min(this.game.state.phase, this.game.phaseCount);
  }

  /**
   * Repaints the scene background and interactive hotspots to match the phase
   * currently on display.
   */
  refreshScene() {
    const phaseDef = this.game.phaseDefAt(this.displayPhase());
    if (!phaseDef) return;

    this.ui.setScene(this.level.scenes[phaseDef.scene]);
    this.ui.updateHotspots(this.currentCommand(), phaseDef.highlight);
  }

  /**
   * Repaints the dialogue panel with the bunny's current line, speaker, and avatar.
   */
  refreshDialogue() {
    this.ui.renderDialogue(
      this.game.dialogue(),
      this.level.speaker || "Guide",
      this.level.avatar || "🐰",
      this.displayPhase(),
    );
  }

  /**
   * Repaints the HUD progress meters (words and clues) and phase counter.
   */
  refreshHud() {
    this.ui.setHud(
      this.game.wordsProgress(),
      this.game.cluesProgress(),
      this.displayPhase(),
    );
  }

  /**
   * Appends a line to the terminal and records it in the game's terminal history.
   *
   * @param {string} text
   * @param {string} cssClass
   */
  log(text, cssClass) {
    this.ui.appendTerminalLine(text, cssClass);
    this.game.state.terminalHistory.push({ text: text, cls: cssClass });
  }

  /**
   * Persists the current game state for this level to storage.
   */
  persist() {
    this.storage.save(this.level.id, this.game.state);
  }

  /**
   * Handles a submitted terminal command: echoes it, runs it through the game
   * (validate then resolve), prints the outcome, and on a cleared phase applies
   * the visible rewards (inventory, lesson, notes, scene/dialogue refresh, win
   * overlay). Always refreshes the HUD and persists afterwards.
   *
   * @param {string} rawInput
   */
  handleSubmit(rawInput) {
    const command = (rawInput || "").trim();
    if (!command) return;

    this.log("> " + command, "cmd");

    const verdict = this.game.validate(command);
    const result = this.game.resolve(verdict);
    this.log(result.output, result.result);

    if (result.advanced) {
      if (result.gainedItem) {
        this.ui.addInventoryChip(
          this.inventoryLabel(result.gainedItem.id || result.gainedItem),
        );
        this.ui.spawnSparks(result.gainedItem.emoji || "✨");
      }

      this.ui.addLesson(result.lesson);
      this.ui.addNotes(result.notes);
      this.refreshScene();
      this.refreshDialogue();
      this.ui.switchTab("dialogue");
      this.ui.spawnSparks("✨");

      if (this.game.isComplete) {
        this.ui.showWinOverlay(900);
      }
    }

    this.refreshHud();
    this.persist();
  }

  /**
   * Rebuilds the full UI from saved state when a level is (re)opened: replays the
   * inventory, lessons, notes, and terminal transcript for every cleared phase,
   * then redraws scene, HUD, and dialogue, showing the win overlay if already done.
   */
  restoreProgress() {
    this.ui.clearInventory();
    this.ui.resetPanels();

    this.game.state.inventory.forEach((itemId) => {
      this.ui.addInventoryChip(this.inventoryLabel(itemId));
    });

    this.game.completedPhases().forEach((phaseNumber) => {
      const phaseDef = this.game.phaseDefAt(phaseNumber);
      if (phaseDef) {
        this.ui.addLesson(phaseDef.lesson);
        this.ui.addNotes(phaseDef.notes);
      }
    });

    this.ui.renderTerminalHistory(this.game.state.terminalHistory);
    this.ui.resetScene();
    this.refreshScene();
    this.refreshHud();
    this.refreshDialogue();
    this.ui.switchTab("dialogue");

    if (this.game.isComplete) {
      this.ui.showWinOverlay();
    }
  }

  /**
   * Restarts the level from scratch: clears saved progress, builds a fresh
   * {@link Game}, wipes the UI, and redraws phase one.
   */
  reset() {
    this.storage.clear(this.level.id);
    this.game = new Game(this.level, this.storage.load(this.level.id));
    this.ui.clearTerminal();
    this.ui.hideWinOverlay();
    this.ui.clearInventory();
    this.ui.resetPanels();
    this.ui.resetScene();
    this.refreshScene();
    this.refreshHud();
    this.refreshDialogue();
    this.ui.switchTab("dialogue");
    this.ui.focusInput();
  }

  /**
   * Boots the player: loads the level named in the URL, indexes its items, sets
   * up the UI (title, hotspots, win overlay, event handlers), constructs the
   * Game object from any saved state, and restores progress. Displays a fatal
   * message in the UI if loading fails.
   *
   * @returns {Promise<void>}
   */
  async init() {
    try {
      const level = await this.loader.loadLevel(
        LevelPlayer.currentLevelFolder(),
      );

      this.level = level;
      this.buildItemIndex();
      this.ui.setTitle(level.title + " — The Bunny's Backlog");
      this.ui.setPhaseTotal(level.phases.length);
      this.game = new Game(level, this.storage.load(level.id));

      this.ui.renderHotspots(
        level.hotspots || [],
        this.currentCommand(),
        () => {
          const command = this.currentCommand();
          if (command) {
            this.ui.fillInput(command);
          } else {
            this.ui.focusInput();
          }
        },
      );

      this.ui.renderWinOverlay(
        Object.assign({ subtitle: level.title }, level.win),
      );

      this.ui.bindEvents({
        onSubmit: (raw) => this.handleSubmit(raw),
        onReset: () => this.reset(),
        onProceed: () => {
          // 1. Fire the visual confirmation toast banner
          this.ui.showToast((level.win && level.win.nextToast) || "Onward!");
          
          // 2. Check if your level's JSON has a 'nextLevel' target directory mapped
          if (level.win && level.win.nextLevel) {
            // Give the user 1 second to see the toast animation before transitioning
            setTimeout(() => {
              window.location.search = `?level=${level.win.nextLevel}`;
            }, 1000);
          } else {
            // Fallback: If no next level is configured, send them back out to your main menu
            setTimeout(() => {
              window.location.href = "../../index.html"; 
            }, 1000);
          }
        }
      });

      this.restoreProgress();
      this.ui.focusInput();
    } catch (error) {
      this.ui.showFatal(error && error.message ? error.message : String(error));
    }
  }

  /**
   * Reads the level folder name from the page's `?level=` query parameter,
   * defaulting to "tutorial".
   *
   * @returns {string}
   */
  static currentLevelFolder() {
    return new URLSearchParams(location.search).get("level") || "tutorial";
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LevelPlayer };
}
