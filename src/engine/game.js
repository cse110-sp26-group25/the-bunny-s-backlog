/**
 * The core game-logic for a single level, holding the level definition as well as the
 * player's progress state. Handles player input validation and advances progress,
 * while exposing read-only views (dialogue, progress) for the UI to render
 */
class Game {
  /**
   * Creates a game for one level, starting fresh or resuming from previously
   * persisted progress.
   *
   * @param {object} level
   * @param {object} [savedState]
   */
  constructor(level, savedState) {
    this.level = level;
    this.state = Game.normalizeState(savedState);
  }

  /**
   * Builds a blank progress state for a brand-new playthrough.
   *
   * @returns {{phase:number, inventory:string[], unlocked:object, errors:number,
   *            complete:boolean, terminalHistory:string[]}}
   */
  static defaultState() {
    return {
      phase: 1,
      inventory: [],
      unlocked: {},
      errors: 0,
      complete: false,
      terminalHistory: [],
    };
  }

  /**
   * Merges a (possibly partial) saved state onto the defaults, copying
   * the array and object fields so the caller's stored data is never mutated
   * in place. Making loading from local storage safe.
   *
   * @param {object} [savedState]
   * @returns {object}
   */
  static normalizeState(savedState) {
    const state = Object.assign(Game.defaultState(), savedState || {});

    state.inventory = Array.isArray(state.inventory)
      ? state.inventory.slice()
      : [];

    state.unlocked =
      state.unlocked && typeof state.unlocked === "object"
        ? Object.assign({}, state.unlocked)
        : {};

    state.terminalHistory = Array.isArray(state.terminalHistory)
      ? state.terminalHistory.slice()
      : [];

    return state;
  }

  /**
   * Returns the phase definition for a 1-indexed phase number, or null when out
   * of range.
   *
   * @param {number} phaseNumber
   * @returns {?object}
   */
  phaseDefAt(phaseNumber) {
    return this.level.phases[phaseNumber - 1] || null;
  }

  /**
   * The total number of phases in the level.
   *
   * @returns {number}
   */
  get phaseCount() {
    return this.level.phases.length;
  }

  /**
   * The definition of the phase the player is currently on, or null.
   *
   * @returns {?object}
   */
  get currentPhaseDef() {
    return this.phaseDefAt(this.state.phase);
  }

  /**
   * Whether the level has been fully cleared.
   *
   * @returns {boolean}
   */
  get isComplete() {
    return this.state.complete;
  }

  /**
   * Classifies a typed command against the current phase without mutating state,
   * returning a result for {@link Game#resolve} to act on.
   *
   * @param {string} rawInput
   * @returns {{status:('complete'|'empty'|'unknownPhase'|'correct'|'incorrect'),
   *            command:string, phaseDef:?object}}
   */
  validate(rawInput) {
    const command = (rawInput || "").trim();

    if (this.state.complete) {
      return { status: "complete", command: command, phaseDef: null };
    }
    if (!command) {
      return { status: "empty", command: command, phaseDef: null };
    }

    const phaseDef = this.currentPhaseDef;
    if (!phaseDef) {
      return { status: "unknownPhase", command: command, phaseDef: null };
    }

    const status = command === phaseDef.answer ? "correct" : "incorrect";
    return { status: status, command: command, phaseDef: phaseDef };
  }

  /**
   * Acts on the result from {@link Game#validate}, mutating state where needed
   * (advancing on a correct answer, counting the error on a wrong one) and
   * producing the render-ready result the terminal displays.
   *
   * @param {{status:string, command:string, phaseDef:?object}} verdict
   * @returns {{result:string, output:string, advanced:boolean, phase:number,
   *            gainedItem:?object, notes:string[], lesson:?object, complete:boolean}}
   */
  resolve(result) {
    const gameState = this.state;

    switch (result.status) {
      case "complete":
        return Game.simpleResult(
          "info",
          "★ Level complete! " + (this.level.completeHint || ""),
          gameState.phase,
        );

      case "empty":
        return Game.simpleResult(
          "info",
          "→ Type a command and press Enter.",
          gameState.phase,
        );

      case "unknownPhase":
        return Game.simpleResult(
          "err",
          "InternalError: unknown phase. Please reload.",
          gameState.phase,
        );

      case "correct":
        return this.resolveCorrect(result.phaseDef);

      case "incorrect":

      default:
        gameState.errors += 1;
        return Game.simpleResult(
          "warn",
          this.hintFor(result.phaseDef, result.command),
          gameState.phase,
        );
    }
  }

  /**
   * Handles a correct answer: advances the game and builds the success
   * result describing the phase that was just cleared.
   *
   * @param {object} phaseDef
   * @returns {{result:string, output:string, advanced:boolean, phase:number,
   *            gainedItem:?object, notes:string[], lesson:?object, complete:boolean}}
   */
  resolveCorrect(phaseDef) {
    const clearedPhase = this.state.phase;
    const gainedItem = this.advance();

    return {
      result: phaseDef.result || "ok",
      output: phaseDef.output || "",
      advanced: true,
      phase: clearedPhase,
      gainedItem: gainedItem,
      notes: phaseDef.notes || [],
      lesson: phaseDef.lesson || null,
      complete: this.state.complete,
    };
  }

  /**
   * Applies the current phase's effects (granting items, setting unlocks), then
   * moves to the next phase, marking the level complete once the last phase is cleared.
   *
   * @returns {?object}
   */
  advance() {
    const gameState = this.state;
    const phaseDef = this.currentPhaseDef;
    let gainedItem = null;

    if (phaseDef && phaseDef.effects) {
      if (phaseDef.effects.addItem) {
        const item = phaseDef.effects.addItem;
        const itemId = typeof item === "string" ? item : item.id;
        if (gameState.inventory.indexOf(itemId) === -1) {
          gameState.inventory.push(itemId);
        }
        gainedItem = item;
      }

      if (phaseDef.effects.unlock) {
        gameState.unlocked[phaseDef.effects.unlock] = true;
      }
    }

    gameState.phase += 1;

    if (gameState.phase > this.phaseCount) {
      gameState.complete = true;
    }
    return gainedItem;
  }

  /**
   * Picks the hint to give user for a wrong answer: the first matching per-phase
   * hint rule (`match` exact, then `matchRegex`), else a generic "expected" message
   *
   * @param {object} phaseDef
   * @param {string} command
   * @returns {string}
   */
  hintFor(phaseDef, command) {
    const hintRules = (phaseDef && phaseDef.hints) || [];

    for (const rule of hintRules) {
      if (rule.match && command === rule.match) {
        return rule.message;
      }
      if (rule.matchRegex && new RegExp(rule.matchRegex).test(command)) {
        return rule.message;
      }
    }

    const expectedCommand = phaseDef && phaseDef.answer;

    if (expectedCommand) {
      return (
        "SyntaxError: Unexpected command for Phase " +
        this.state.phase +
        ".\n→ Expected: " +
        expectedCommand +
        "\n→ Check the Bunny tab for instructions!"
      );
    }
    return (
      'ReferenceError: "' +
      command +
      '" is not a recognised command.\n→ Check the Notes tab for hints.'
    );
  }

  /**
   * Lists the 1-indexed phases the player has already cleared.
   *
   * @returns {number[]}
   */
  completedPhases() {
    const lastCleared = this.state.complete
      ? this.phaseCount
      : Math.max(0, this.state.phase - 1);

    const phases = [];

    for (let phaseNumber = 1; phaseNumber <= lastCleared; phaseNumber++) {
      phases.push(phaseNumber);
    }
    return phases;
  }

  /**
   * Totals the notebook entries across the given phase numbers.
   *
   * @param {number[]} phaseNumbers
   * @returns {number}
   */
  countNotesIn(phaseNumbers) {
    return phaseNumbers.reduce((total, phaseNumber) => {
      const phaseDef = this.phaseDefAt(phaseNumber);
      return total + (phaseDef && phaseDef.notes ? phaseDef.notes.length : 0);
    }, 0);
  }

  /**
   * Progress for the "Words" meter: words encountered out of the total available in
   * the level.
   *
   * @returns {{found:number, total:number}}
   */
  wordsProgress() {
    return { found: this.completedPhases().length, total: this.phaseCount };
  }

  /**
   * Progress for the "Clues" meter: notebook entries unlocked across cleared
   * phases out of all entries available in the level.
   *
   * @returns {{found:number, total:number}}
   */
  cluesProgress() {
    const allPhases = [];

    for (let phaseNumber = 1; phaseNumber <= this.phaseCount; phaseNumber++) {
      allPhases.push(phaseNumber);
    }

    return {
      found: this.countNotesIn(this.completedPhases()),
      total: this.countNotesIn(allPhases),
    };
  }

  /**
   * The bunny's current speech and click-to-fill hint for the active phase, or
   * the level's completion dialogue once the level is finished.
   *
   * @returns {{text:string, hint:string}}
   */
  dialogue() {
    if (this.state.complete) {
      return { text: this.level.completeDialogue || "", hint: "" };
    }

    const phaseDef = this.currentPhaseDef;

    return {
      text: phaseDef ? phaseDef.dialogue || "" : "",
      hint: phaseDef ? phaseDef.hint || "" : "",
    };
  }

  /**
   * Builds a non-advancing result (used for guards, hints, and errors), matching
   * the shape {@link Game#resolveCorrect} returns so the terminal renderer stays uniform
   *
   * @param {string} result
   * @param {string} output
   * @param {number} phase
   * @returns {{result:string, output:string, advanced:boolean, phase:number,
   *            gainedItem:?object, notes:string[], lesson:?object, complete:boolean}}
   */
  static simpleResult(result, output, phase) {
    return {
      result: result,
      output: output,
      advanced: false,
      phase: phase,
      gainedItem: null,
      notes: [],
      lesson: null,
      complete: false,
    };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { Game };
}
