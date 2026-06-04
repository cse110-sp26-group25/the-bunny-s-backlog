class Game {
  /**
   * @param {object} level      - parsed level.json
   * @param {object} [savedState] - previously persisted progress, if any
   */
  constructor(level, savedState) {
    this.level = level;
    this.state = Game.normalizeState(savedState);
  }

  /** A fresh, empty progress state. */
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

  /** Merge a (possibly partial/untrusted) saved state onto the defaults. */
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

  get phaseCount() {
    return this.level.phases.length;
  }

  /** The phase definition for a 1-indexed phase number (or null). */
  phaseDefAt(phaseNumber) {
    return this.level.phases[phaseNumber - 1] || null;
  }

  get currentPhaseDef() {
    return this.phaseDefAt(this.state.phase);
  }

  get isComplete() {
    return this.state.complete;
  }

  /**
   * Validate a typed command against the current phase. Mutates state when the
   * answer is correct. Returns a render-ready result describing the outcome.
   *
   * @returns {{result:string, output:string, advanced:boolean, phase:number,
   *            gainedItem:?object, notes:string[], lesson:?object, complete:boolean}}
   */
  validate(rawInput) {
    const gameState = this.state;
    const command = (rawInput || "").trim();

    if (gameState.complete) {
      return Game.simpleResult(
        "info",
        "★ Level complete! " + (this.level.completeHint || ""),
        gameState.phase,
      );
    }
    if (!command) {
      return Game.simpleResult(
        "info",
        "→ Type a command and press Enter.",
        gameState.phase,
      );
    }

    const phaseDef = this.currentPhaseDef;
    if (!phaseDef) {
      return Game.simpleResult(
        "err",
        "InternalError: unknown phase. Please reload.",
        gameState.phase,
      );
    }

    if (command === phaseDef.answer) {
      const clearedPhase = gameState.phase;
      const gainedItem = this.advance();
      return {
        result: phaseDef.result || "ok",
        output: phaseDef.output || "",
        advanced: true,
        phase: clearedPhase,
        gainedItem: gainedItem,
        notes: phaseDef.notes || [],
        lesson: phaseDef.lesson || null,
        complete: gameState.complete,
      };
    }

    gameState.errors += 1;
    return Game.simpleResult(
      "warn",
      this.hintFor(phaseDef, command),
      gameState.phase,
    );
  }

  /**
   * Apply the current phase's side-effects and move to the next phase.
   * @returns {?object} the item gained this step (for the UI), or null.
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
   * Coaching message for a wrong answer: the first matching per-phase hint
   * rule (`match` exact, then `matchRegex`), else a generic "expected" nudge.
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

  /** Phases the player has already cleared (1-indexed). */
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

  /** Total notebook entries across the given phase numbers. */
  countNotesIn(phaseNumbers) {
    return phaseNumbers.reduce((total, phaseNumber) => {
      const phaseDef = this.phaseDefAt(phaseNumber);
      return total + (phaseDef && phaseDef.notes ? phaseDef.notes.length : 0);
    }, 0);
  }

  /** "Words" = JS commands mastered (one teachable command per phase). */
  wordsProgress() {
    return { found: this.completedPhases().length, total: this.phaseCount };
  }

  /** "Clues" = notebook entries unlocked across cleared phases. */
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

  /** Dialogue + click-to-fill hint for the current phase (or completion). */
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

  /** Build a non-advancing result (guards, hints, errors). */
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
