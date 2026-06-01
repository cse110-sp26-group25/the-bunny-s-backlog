// ============================================================
// SOLVE TERMINAL & LEVEL MANAGER — Task 3
// Handles the final-solve flow once the player is ready:
//   1. Opening the solve terminal
//   2. Receiving the player's final solution
//   3. Comparing it against the level's true_story
//   4. Triggering pass / retry behavior
//
// This module is intentionally framework-light. All game-state
// logic lives here; integration with ct.js (rendering, input
// routing) is done through the hook functions at the bottom.
// That separation lets the logic be unit-tested in plain JS,
// which the project spec specifically rewards.
//
// Depends on:
//   - level_001.js  (for checkSolution and a level data object
//                    like level_genesis_001)
// ============================================================


// ------------------------------------------------------------
// GAME STATE
// Tracks which phase of the level the player is in.
// Task 1's input handler should read levelManager.state on
// every Enter-press to decide whether the input goes to the
// clue checker (Task 2) or to submitSolution() (Task 3).
// ------------------------------------------------------------
const GameState = Object.freeze({
  INVESTIGATING: "investigating", // Looking for clues, typing target strings
  SOLVING:       "solving",       // Solve terminal is open, typing final answer
  PASSED:        "passed"         // Level complete
});


// ------------------------------------------------------------
// LEVEL MANAGER
// Singleton-style controller for the current level's state.
// Call levelManager.loadLevel(level_genesis_001) when the
// scene starts.
// ------------------------------------------------------------
const levelManager = {
  currentLevel: null,
  state:        GameState.INVESTIGATING,
  attempts:     0,

  /**
   * Load a level data object (e.g. level_genesis_001) and
   * reset state. Call this once per level on scene start.
   * @param {Object} levelData
   */
  loadLevel(levelData) {
    this.currentLevel = levelData;
    this.state        = GameState.INVESTIGATING;
    this.attempts     = 0;
  },

  /**
   * Returns only the clues the player has already discovered.
   * Useful for rendering the Word Box inside the solve terminal.
   * @returns {Array<Object>}
   */
  getFoundClues() {
    if (!this.currentLevel) return [];
    return this.currentLevel.clues.filter(c => c.isFound);
  },

  /**
   * True if every clue in the level has been found.
   * Not required to open the terminal — the spec allows a
   * partial-info solve attempt — but useful for hints or UI.
   * @returns {boolean}
   */
  allCluesFound() {
    if (!this.currentLevel) return false;
    return this.currentLevel.clues.every(c => c.isFound);
  },

  // ----------------------------------------------------------
  // SOLVE TERMINAL — OPEN / CLOSE
  // The player opens the terminal whenever they feel ready.
  // Not gated on all clues being found.
  // ----------------------------------------------------------

  /**
   * Open the solve terminal. Returns false if the level is
   * already passed (nothing to solve).
   * @returns {boolean}
   */
  openSolveTerminal() {
    if (this.state === GameState.PASSED) return false;
    this.state = GameState.SOLVING;
    this.onTerminalOpened();
    return true;
  },

  /** Dismiss the terminal without submitting. */
  closeSolveTerminal() {
    if (this.state !== GameState.SOLVING) return;
    this.state = GameState.INVESTIGATING;
    this.onTerminalClosed();
  },

  // ----------------------------------------------------------
  // SUBMIT SOLUTION
  // Called when the player presses Enter inside the solve
  // terminal. Delegates the actual string check to
  // checkSolution() from level_001.js so the comparison rule
  // (whitespace-insensitive equality) lives in one place.
  // ----------------------------------------------------------

  /**
   * @param {string} playerInput  The string the player typed.
   * @returns {{passed: boolean, attempts: number, reason?: string}}
   */
  submitSolution(playerInput) {
    if (this.state !== GameState.SOLVING) {
      return { passed: false, attempts: this.attempts, reason: "terminal-not-open" };
    }
    if (!this.currentLevel) {
      return { passed: false, attempts: this.attempts, reason: "no-level-loaded" };
    }

    this.attempts++;
    const passed = checkSolution(playerInput, this.currentLevel.true_story);

    if (passed) {
      this.state = GameState.PASSED;
      this.onLevelPassed(playerInput);
    } else {
      this.onSolutionRejected(playerInput);
    }

    return { passed, attempts: this.attempts };
  },

  // ----------------------------------------------------------
  // HOOKS
  // Fill these in once Task 1's input field and the ct.js
  // scene rendering are wired up. For now they just log so
  // the flow is testable from the browser console.
  // ----------------------------------------------------------

  /** Solve terminal opened — UI should show snippet + wordbox + input. */
  onTerminalOpened() {
    console.log("[Solve Terminal] OPENED");
    console.log("[Snippet]\n" + (this.currentLevel.snippet || "(no snippet field on level data yet)"));
    console.log("[Word Box]", this.getFoundClues().map(c => c.clue));
  },

  /** Terminal dismissed without solving. */
  onTerminalClosed() {
    console.log("[Solve Terminal] CLOSED");
  },

  /** Correct solution — play pass animation, advance to next level, etc. */
  onLevelPassed(playerInput) {
    console.log(`[Level PASSED] After ${this.attempts} attempt(s). Input: "${playerInput}"`);
  },

  /** Wrong solution — play "denied" feedback, leave terminal open for retry. */
  onSolutionRejected(playerInput) {
    console.log(`[Solution Rejected] Attempt #${this.attempts}. Input: "${playerInput}"`);
  }
};


// ============================================================
// QUICK MANUAL SMOKE TEST (run from the browser console after
// level_001.js and this file are loaded):
//
//   levelManager.loadLevel(level_genesis_001);
//   // Simulate clues being found by Task 2:
//   level_genesis_001.clues.forEach(c => c.isFound = true);
//
//   levelManager.openSolveTerminal();
//   levelManager.submitSolution('deployFirewall("Phantom", 8080, "Admin");');
//   // -> { passed: true, attempts: 1 }
//
//   // Whitespace-insensitive, so this also passes:
//   levelManager.submitSolution('deployFirewall ( "Phantom" , 8080 , "Admin" ) ;');
//
// Once you have real unit tests (Jest/Vitest), port these.
// ============================================================
