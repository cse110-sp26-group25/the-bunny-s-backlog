/* global LevelLoader, LevelStorage, LevelUI, Game */

class LevelPlayer {
  constructor() {
    this.loader = new LevelLoader();
    this.storage = new LevelStorage();
    this.ui = new LevelUI();
    this.level = null;
    this.game = null;
    this.itemsById = {};
  }

  currentCommand() {
    const phaseDef = this.game.currentPhaseDef;
    return phaseDef ? phaseDef.answer : "";
  }

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

  inventoryLabel(itemId) {
    return (this.itemsById[itemId] && this.itemsById[itemId].label) || itemId;
  }

  displayPhase() {
    return Math.min(this.game.state.phase, this.game.phaseCount);
  }

  refreshScene() {
    const phaseDef = this.game.phaseDefAt(this.displayPhase());
    if (!phaseDef) {
      return;
    }
    this.ui.setScene(this.level.scenes[phaseDef.scene]);
    this.ui.updateHotspots(this.currentCommand(), phaseDef.highlight);
  }

  refreshDialogue() {
    this.ui.renderDialogue(
      this.game.dialogue(),
      this.level.speaker || "Guide",
      this.level.avatar || "🐰",
      this.displayPhase(),
    );
  }

  refreshHud() {
    this.ui.setHud(
      this.game.wordsProgress(),
      this.game.cluesProgress(),
      this.displayPhase(),
    );
  }

  log(text, cssClass) {
    this.ui.appendTerminalLine(text, cssClass);
    this.game.state.terminalHistory.push({ text: text, cls: cssClass });
  }

  persist() {
    this.storage.save(this.level.id, this.game.state);
  }

  handleSubmit(rawInput) {
    const command = (rawInput || "").trim();
    if (!command) {
      return;
    }
    this.log("> " + command, "cmd");

    const result = this.game.validate(command);
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

  async init() {
    try {
      const level = await this.loader.loadLevel(LevelPlayer.currentLevelFolder());
      this.level = level;
      this.buildItemIndex();
      this.ui.setTitle(level.title + " — The Bunny's Backlog");
      this.ui.setPhaseTotal(level.phases.length);
      this.game = new Game(level, this.storage.load(level.id));
      this.ui.renderHotspots(level.hotspots || [], this.currentCommand(), () => {
        const command = this.currentCommand();
        if (command) {
          this.ui.fillInput(command);
        } else {
          this.ui.focusInput();
        }
      });
      this.ui.renderWinOverlay(Object.assign({ subtitle: level.title }, level.win));
      this.ui.bindEvents({
        onSubmit: (raw) => this.handleSubmit(raw),
        onReset: () => this.reset(),
        onProceed: () =>
          this.ui.showToast((level.win && level.win.nextToast) || "Onward!"),
      });
      this.restoreProgress();
      this.ui.focusInput();
    } catch (error) {
      this.ui.showFatal(error && error.message ? error.message : String(error));
    }
  }

  static currentLevelFolder() {
    return new URLSearchParams(location.search).get("level") || "tutorial";
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LevelPlayer };
}
