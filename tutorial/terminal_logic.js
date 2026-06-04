/**
 * terminal_logic.js
 * ─────────────────────────────────────────────────────────────────────────────
 * ES6 Module — "The Morning Routine" Tutorial State Machine
 * Detective game: The Bunny's Backlog  ·  Group 25  ·  CSE 110 Spring 2026
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * EXPORTS
 *   runTutorialValidator(rawInput) → ValidationResult
 *   getBunnyDialogue(phase)        → DialogueLine
 *   getTutorialState()             → TutorialState (read-only snapshot)
 *   resetTutorial()                → void
 *   subscribeToStateChange(fn)     → unsubscribe function
 *
 * TYPES (documented via JSDoc — no TypeScript required)
 *
 * @typedef {Object} ValidationResult
 * @property {"success"|"failure"|"hint"|"already_done"} type
 * @property {string}   terminalOutput   — text to print in the terminal
 * @property {string}   cssClass         — "ok" | "err" | "warn" | "info"
 * @property {number}   phase            — phase that produced this result
 * @property {boolean}  phaseAdvanced    — true when state machine moved forward
 * @property {string[]} notebookUpdates  — new lines to add to the Notebook panel
 * @property {string[]} inventoryUpdates — items added to inventory this tick
 * @property {string|null} hotspot       — CSS selector hint for visual highlight
 *
 * @typedef {Object} DialogueLine
 * @property {number} phase
 * @property {string} speaker
 * @property {string} text     — narrative context/instructions for the player
 * @property {string} hint     — the exact command Bunny tells the player to type
 *
 * @typedef {Object} TutorialState
 * @property {number}   phase         — current phase (1-10, or 11 = complete)
 * @property {string[]} inventory     — items the player is carrying
 * @property {boolean}  drawersLocked — whether the drawers are still locked
 * @property {boolean}  complete      — true once phase 10 is passed
 * @property {string[]} notebookLog   — accumulated notebook entries
 */

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL STATE  (never mutated directly — only through _advance())
// ─────────────────────────────────────────────────────────────────────────────

/** @type {TutorialState} */
let _state = {
  phase:         1,
  inventory:     [],
  drawersLocked: true,
  complete:      false,
  notebookLog:   [],
};

/** @type {Set<Function>} */
const _subscribers = new Set();

// ─────────────────────────────────────────────────────────────────────────────
// PHASE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Each phase entry drives both validation and UI output.
 * Fields:
 *   answer      — the exact string the player must type
 *   success     — terminal output on correct input
 *   lesson      — short JS concept name
 *   notebook    — lines pushed to the Notebook panel on success
 *   hotspot     — CSS selector for the scene element to highlight
 *   inventory   — item added to player inventory on success (optional)
 *   setsUnlocked — if true, marks drawers as unlocked (phase 9)
 */
const PHASES = {
  1: {
    answer:   'console.log("hello");',
    success:  '"hello"\n→ System Online. Detective Terminal calibrated! ✓',
    lesson:   'Printing Data: console.log() outputs text to the terminal.',
    notebook: [
      'SYSTEM NOTE: Terminal is online.',
      'To print text, use: console.log("your text here");',
    ],
    hotspot:  '#term-input',
  },

  2: {
    answer:   'scan("office");',
    success:  'Room scanned.\n→ 3 interactive zones detected: desk, plant, drawers.',
    lesson:   'Functions & Strings: Passing a string argument to a function.',
    notebook: [
      'ZONES DETECTED: desk, plant, drawers',
      'HINT: Use inspect("target"); to look closer at each zone.',
    ],
    hotspot:  '#scene-vp',
  },

  3: {
    answer:   'inspect("desk");',
    success:  'Inspecting desk...\n→ Desk contains: coffee_mug, open_book, clipboard.',
    lesson:   'Repetition: Using the same function with a different string parameter.',
    notebook: [
      'DESK CONTENTS: coffee_mug, open_book, clipboard',
      'NOTE: Objects have actions! Connect with a dot → object.action();',
    ],
    hotspot:  '#hotspot-desk',
  },

  4: {
    answer:   'desk.read("open_book");',
    success:  'Reading open_book...\n→ It\'s just a dictionary. Nothing useful here.',
    lesson:   'Exploration: Code can execute successfully without solving the puzzle.',
    notebook: [
      'open_book = Webster\'s Dictionary. Not the journal.',
      'BUNNY: "Try reading the clipboard instead!"',
    ],
    hotspot:  '#hotspot-desk',
  },

  5: {
    answer:   'desk.read("clipboard");',
    success:  'Reading clipboard...\n→ Note reads: \'Keep journal locked in drawers. Hide key in foliage.\'',
    lesson:   'Dot Notation: object.method("argument") — calling an action on an object.',
    notebook: [
      'CLUE: Journal is locked in the drawers.',
      'CLUE: Key is hidden in the foliage (plant).',
      'HINT: Inspect the plant next.',
    ],
    hotspot:  '#hotspot-desk',
  },

  6: {
    answer:   'inspect("plant");',
    success:  'Scanning plant...\n→ Glint of metal detected!\n→ A silver key is visible among the leaves.',
    lesson:   'Applying Clues: Using a function you already know on a new target.',
    notebook: [
      'VISUAL: Silver key spotted in plant leaves!',
      'HINT: Use self.take("key"); to pick it up.',
    ],
    hotspot:  '#hotspot-plant',
  },

  7: {
    answer:    'self.take("key");',
    success:   '[Item Acquired: Silver Key] 🗝\n→ Key added to inventory.',
    lesson:    'The self Scope: You are an object too — self refers to the player character.',
    notebook:  [
      'INVENTORY: [Silver Key] added.',
      'NOTE: You have the key. Now target the drawers.',
    ],
    hotspot:   '#hotspot-plant',
    inventory: 'key',
  },

  8: {
    answer:  'drawers.open();',
    // Phase 8 is an INTENTIONAL FAILURE — the answer is expected, but we
    // treat it as a state-dependent error and do NOT advance the phase.
    // See _handlePhase8() for the special-case logic.
    success: '__INTENTIONAL_ERROR__',
    lesson:  'Logic & Sequence: Code runs in order — you cannot skip required steps.',
    notebook: [
      'ERROR LOG: drawers.open() — ACCESS DENIED.',
      'HINT: You must unlock the drawers first!',
      'TRY: drawers.unlock("key");',
    ],
    hotspot: '#hotspot-drawers',
  },

  9: {
    answer:      'drawers.unlock("key");',
    success:     'Click.\n→ Security lock disengaged. 🔓\n→ Padlock status: OPEN.',
    lesson:      'Variables as Arguments: Passing an inventory item name into a method.',
    notebook:    [
      'SYSTEM: Padlock icon → GREEN.',
      'NOTE: Lock disabled. Safe to open.',
    ],
    hotspot:     '#hotspot-drawers',
    setsUnlocked: true,
  },

  10: {
    answer:  'drawers.open();',
    success: 'Drawers opening...\n→ Drawers open...\n→ [Chief Inspector Bunny\'s Journal Acquired] 📓\n\n★ LEVEL COMPLETE — The Morning Routine ★',
    lesson:  'Parameter-less Methods: Some functions take no arguments — just open parentheses and close them.',
    notebook: [
      'MAJOR EVIDENCE: Chief Inspector Bunny\'s Journal.',
      '★ Tutorial complete! Proceeding to the Bakery...',
    ],
    hotspot: '#hotspot-drawers',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BUNNY DIALOGUE  (one entry per phase)
// ─────────────────────────────────────────────────────────────────────────────

/** @type {Record<number, DialogueLine>} */
const BUNNY_DIALOGUE = {
  1: {
    phase:   1,
    speaker: 'Chief Inspector Bunny',
    text:    "Welcome to the agency, Rookie! I'm Chief Inspector Bunny. Before we can solve any mysteries, we need to make sure your Detective Terminal is online. In JavaScript, we make the computer speak using a command called console.log. Let's test it by saying hello!",
    hint:    'console.log("hello");',
  },
  2: {
    phase:   2,
    speaker: 'Chief Inspector Bunny',
    text:    "Perfect, we are online! Now, I have a bit of a problem... I lost my main investigation journal somewhere in this messy office. Let's use the terminal to run a sweep of the room. To use a tool, you type its name, followed by your target inside quotes.",
    hint:    'scan("office");',
  },
  3: {
    phase:   3,
    speaker: 'Chief Inspector Bunny',
    text:    "Great job! The scanner found my desk, a potted plant, and some wooden drawers. I usually leave my journal right on my workspace. Let's use the inspect tool to look closer at it.",
    hint:    'inspect("desk");',
  },
  4: {
    phase:   4,
    speaker: 'Chief Inspector Bunny',
    text:    "Hmm, no journal. But look! There is an open_book and a clipboard. In code, things are called 'objects', and we can make them do actions by connecting them with a dot. Let's try reading that book first to see if it's my journal.",
    hint:    'desk.read("open_book");',
  },
  5: {
    phase:   5,
    speaker: 'Chief Inspector Bunny',
    text:    "Ah, false alarm. That's just my dictionary. Nothing useful there! But that's okay, detectives have to explore! Let's check the clipboard instead. Remember the dot notation!",
    hint:    'desk.read("clipboard");',
  },
  6: {
    phase:   6,
    speaker: 'Chief Inspector Bunny',
    text:    "Aha! The note says I hid the spare key in the foliage... that must mean the potted plant! Use your inspect tool again, but this time change your target to the plant.",
    hint:    'inspect("plant");',
  },
  7: {
    phase:   7,
    speaker: 'Chief Inspector Bunny',
    text:    "There it is! A silver key! In this game, you are an object too, and your code name is self. To pick things up and put them in your inventory, you have to tell yourself to take them.",
    hint:    'self.take("key");',
  },
  8: {
    phase:   8,
    speaker: 'Chief Inspector Bunny',
    text:    "Got it! Now, the note said my journal is in the wooden drawers. Let's head over there and try to open them! Some commands don't need any targets inside the parentheses.",
    hint:    'drawers.open();',
  },
  9: {
    phase:   9,
    speaker: 'Chief Inspector Bunny',
    text:    "Oops! Did you see that red Error? Computers follow exact logic — we can't open a locked door without unlocking it first! We need to use the unlock action and pass the key we found as our target.",
    hint:    'drawers.unlock("key");',
  },
  10: {
    phase:   10,
    speaker: 'Chief Inspector Bunny',
    text:    "Hear that click? The security lock is disabled! Now it is safe to open them. Try that exact same command from earlier, with the empty parentheses.",
    hint:    'drawers.open();',
  },
  11: {
    phase:   11,
    speaker: 'Chief Inspector Bunny',
    text:    "You found it! Fantastic work, Bill. You already know how to use strings, functions, and dot notation! You are going to be a natural JavaScript Developer. Come on, let's head over to the Bakery to catch a thief!",
    hint:    '',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// FAILURE / HINT MESSAGES
// ─────────────────────────────────────────────────────────────────────────────

/** Generic wrong-command responses keyed by recognised-but-wrong patterns. */
function _buildHintMessage(input, currentPhase) {
  const t = input.trim();

  // Early attempts to open locked drawers (any phase before 9 is unlocked)
  if (t === 'drawers.open();' && currentPhase < 10) {
    return {
      type:           'failure',
      terminalOutput: 'ERROR: The drawers are locked. Access denied.\n→ ScopeError: Cannot open a locked container without the correct key.',
      cssClass:       'err',
      hint:           'drawers.unlock("key");',
    };
  }

  // Trying to unlock without having the key
  if (t === 'drawers.unlock("key");' && !_state.inventory.includes('key')) {
    return {
      type:           'failure',
      terminalOutput: 'ERROR: self.inventory does not contain "key".\n→ You need to find the key first!',
      cssClass:       'err',
      hint:           'inspect("plant");',
    };
  }

  // Already completed
  if (_state.complete) {
    return {
      type:           'already_done',
      terminalOutput: '★ Tutorial already complete! Head to the Bakery.',
      cssClass:       'info',
      hint:           '',
    };
  }

  // Common syntax mistakes — helpful nudges
  if (t.startsWith('console.log') && !t.endsWith(';')) {
    return {
      type:           'hint',
      terminalOutput: 'SyntaxError: Missing semicolon at end of statement.\n→ JavaScript statements end with ;',
      cssClass:       'warn',
      hint:           'console.log("hello");',
    };
  }

  if (t === 'console.log(hello);' || t === "console.log('hello');") {
    return {
      type:           'hint',
      terminalOutput: 'SyntaxError: String literals require double quotes in this terminal.\n→ Try: console.log("hello");',
      cssClass:       'warn',
      hint:           'console.log("hello");',
    };
  }

  if (t.includes('console.log') && !t.includes('"')) {
    return {
      type:           'hint',
      terminalOutput: 'SyntaxError: Did you forget the quotes around your text?\n→ Strings must be wrapped in double quotes: "hello"',
      cssClass:       'warn',
      hint:           'console.log("hello");',
    };
  }

  // They skipped ahead
  const currentAnswer = PHASES[currentPhase]?.answer;
  if (currentAnswer && t !== currentAnswer) {
    const expected = PHASES[currentPhase];
    return {
      type:           'hint',
      terminalOutput: `SyntaxError: Unexpected command for this phase.\n→ Bunny says: Try typing: ${expected.answer}`,
      cssClass:       'warn',
      hint:           expected.answer,
    };
  }

  // Fallback
  return {
    type:           'failure',
    terminalOutput: `ReferenceError: "${t}" is not a recognised command.\n→ Check the Notebook for hints.`,
    cssClass:       'err',
    hint:           '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE MACHINE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Deep-clone state to prevent external mutation. */
function _snapshot() {
  return {
    phase:         _state.phase,
    inventory:     [..._state.inventory],
    drawersLocked: _state.drawersLocked,
    complete:      _state.complete,
    notebookLog:   [..._state.notebookLog],
  };
}

/** Advance state and notify subscribers. */
function _advance(phaseDef, newPhase) {
  // Apply side-effects
  if (phaseDef.inventory) {
    _state.inventory.push(phaseDef.inventory);
  }
  if (phaseDef.setsUnlocked) {
    _state.drawersLocked = false;
  }
  if (phaseDef.notebook) {
    _state.notebookLog.push(...phaseDef.notebook);
  }

  _state.phase    = newPhase;
  _state.complete = newPhase > 10;

  // Notify all UI subscribers
  const snap = _snapshot();
  _subscribers.forEach(fn => {
    try { fn(snap); } catch(e) { console.error('[terminal_logic] subscriber error:', e); }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE VALIDATOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Phase 8 special-case: the player MUST type drawers.open() and MUST receive
 * the locked error — that IS the lesson. We advance to phase 9 after the error
 * so Bunny can give the unlock dialogue.
 */
function _handlePhase8(input) {
  const t = input.trim();

  if (t === 'drawers.open();') {
    // Correct command, intentional failure output — advance to phase 9
    const phaseDef = PHASES[8];
    _advance(phaseDef, 9);
    return {
      type:           'failure',   // visually a failure (red output)
      terminalOutput: 'ERROR: The drawers are locked. Access denied.\n→ ScopeError: container.isLocked === true',
      cssClass:       'err',
      phase:          8,
      phaseAdvanced:  true,        // state DID advance
      notebookUpdates: phaseDef.notebook,
      inventoryUpdates: [],
      hotspot:        phaseDef.hotspot,
    };
  }

  // Wrong command for phase 8
  const hint = _buildHintMessage(t, 8);
  return {
    type:            hint.type,
    terminalOutput:  hint.terminalOutput,
    cssClass:        hint.cssClass,
    phase:           8,
    phaseAdvanced:   false,
    notebookUpdates: [],
    inventoryUpdates: [],
    hotspot:         PHASES[8].hotspot,
  };
}

/**
 * runTutorialValidator
 * ──────────────────────────────────────────────────────────────────────────
 * Main entry point. Call this every time the player presses Enter.
 *
 * @param   {string} rawInput  — the raw string from the terminal input field
 * @returns {ValidationResult}
 */
export function runTutorialValidator(rawInput) {
  const input = (rawInput || '').trim();

  // Guard: tutorial finished
  if (_state.complete) {
    return {
      type:            'already_done',
      terminalOutput:  '★ Tutorial complete. Head to the Bakery!',
      cssClass:        'info',
      phase:           11,
      phaseAdvanced:   false,
      notebookUpdates: [],
      inventoryUpdates:[],
      hotspot:         null,
    };
  }

  // Guard: empty input
  if (!input) {
    return {
      type:            'hint',
      terminalOutput:  '→ Type a command and press Enter.',
      cssClass:        'info',
      phase:           _state.phase,
      phaseAdvanced:   false,
      notebookUpdates: [],
      inventoryUpdates:[],
      hotspot:         null,
    };
  }

  const currentPhase = _state.phase;

  // Phase 8 is a special intentional-error phase
  if (currentPhase === 8) {
    return _handlePhase8(input);
  }

  const phaseDef = PHASES[currentPhase];
  if (!phaseDef) {
    return {
      type:            'failure',
      terminalOutput:  'InternalError: Unknown phase. Please refresh.',
      cssClass:        'err',
      phase:           currentPhase,
      phaseAdvanced:   false,
      notebookUpdates: [],
      inventoryUpdates:[],
      hotspot:         null,
    };
  }

  // ── CORRECT ANSWER ──────────────────────────────────────────────────────
  if (input === phaseDef.answer) {
    const newPhase        = currentPhase + 1;
    const inventoryGained = phaseDef.inventory ? [phaseDef.inventory] : [];

    _advance(phaseDef, newPhase);

    return {
      type:            'success',
      terminalOutput:  phaseDef.success,
      cssClass:        'ok',
      phase:           currentPhase,
      phaseAdvanced:   true,
      notebookUpdates: phaseDef.notebook || [],
      inventoryUpdates:inventoryGained,
      hotspot:         phaseDef.hotspot || null,
    };
  }

  // ── WRONG ANSWER — build contextual hints ───────────────────────────────
  const hint = _buildHintMessage(input, currentPhase);
  return {
    type:            hint.type,
    terminalOutput:  hint.terminalOutput,
    cssClass:        hint.cssClass,
    phase:           currentPhase,
    phaseAdvanced:   false,
    notebookUpdates: [],
    inventoryUpdates:[],
    hotspot:         phaseDef.hotspot || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get Bunny's dialogue for a given phase (1-11).
 * Phase 11 is the post-completion celebration dialogue.
 *
 * @param   {number} phase
 * @returns {DialogueLine}
 */
export function getBunnyDialogue(phase) {
  return BUNNY_DIALOGUE[phase] ?? BUNNY_DIALOGUE[1];
}

/**
 * Read-only snapshot of the current tutorial state.
 * @returns {TutorialState}
 */
export function getTutorialState() {
  return _snapshot();
}

/**
 * Subscribe to state changes. The callback receives a TutorialState snapshot
 * every time the state machine advances.
 *
 * @param   {function(TutorialState): void} fn
 * @returns {function(): void}  — call to unsubscribe
 */
export function subscribeToStateChange(fn) {
  _subscribers.add(fn);
  return () => _subscribers.delete(fn);
}

/**
 * Reset the tutorial back to phase 1. Useful for restarting the level.
 */
export function resetTutorial() {
  _state = {
    phase:         1,
    inventory:     [],
    drawersLocked: true,
    complete:      false,
    notebookLog:   [],
  };
  _subscribers.forEach(fn => {
    try { fn(_snapshot()); } catch(e) { /* silent */ }
  });
}

/**
 * Convenience: get the exact answer string for the current phase.
 * Useful for an "auto-fill" or accessibility feature.
 *
 * @returns {string}
 */
export function getCurrentPhaseAnswer() {
  return PHASES[_state.phase]?.answer ?? '';
}

/**
 * Convenience: get the lesson description for the current phase.
 * @returns {string}
 */
export function getCurrentPhaseLesson() {
  return PHASES[_state.phase]?.lesson ?? '';
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPLEMENTATION CHECKLIST  (inline documentation for the integrating developer)
// ─────────────────────────────────────────────────────────────────────────────
/*
╔══════════════════════════════════════════════════════════════════════════════╗
║  IMPLEMENTATION CHECKLIST  —  hooking terminal_logic.js to your UI         ║
╚══════════════════════════════════════════════════════════════════════════════╝

1. IMPORT IN terminal.html
   ──────────────────────────────────────────────────────────────────────────
   In your <script type="module"> tag:

     import {
       runTutorialValidator,
       getBunnyDialogue,
       getTutorialState,
       subscribeToStateChange,
       resetTutorial,
     } from './terminal_logic.js';

2. WIRE THE TERMINAL INPUT
   ──────────────────────────────────────────────────────────────────────────
   const input = document.getElementById('term-input');

   input.addEventListener('keydown', (e) => {
     if (e.key !== 'Enter') return;
     const result = runTutorialValidator(input.value);
     input.value = '';
     renderTerminalLine(result.terminalOutput, result.cssClass);
     if (result.hotspot) highlightHotspot(result.hotspot);
   });

3. SUBSCRIBE TO STATE CHANGES (drives Notebook + Bunny Dialogue)
   ──────────────────────────────────────────────────────────────────────────
   subscribeToStateChange((state) => {
     // a) Update the Notebook panel
     updateNotebook(state.notebookLog);

     // b) Show Bunny's dialogue for the NEW phase
     const dialogue = getBunnyDialogue(state.phase);
     showBunnyDialogue(dialogue.text, dialogue.hint);

     // c) Update inventory display
     updateInventoryBar(state.inventory);

     // d) Swap background image based on phase
     updateSceneBackground(state.phase);

     // e) If level complete:
     if (state.complete) showLevelCompleteOverlay();
   });

4. RENDER TERMINAL OUTPUT
   ──────────────────────────────────────────────────────────────────────────
   function renderTerminalLine(text, cssClass) {
     const line = document.createElement('div');
     line.className = `tlog-line ${cssClass}`;  // ok | err | warn | info
     line.textContent = text;
     document.getElementById('tlog-scroll').appendChild(line);
     document.getElementById('tlog-scroll').scrollTop = Infinity;
   }

5. BACKGROUND IMAGE SWITCHING (3 scene states)
   ──────────────────────────────────────────────────────────────────────────
   function updateSceneBackground(phase) {
     const canvas = document.getElementById('scene-cv');
     let src;
     if      (phase >= 7)  src = BG_CLEAN;  // after key picked up
     else if (phase >= 5)  src = BG_KEY;    // key visible in plant
     else                  src = BG_NOKEY;  // clean room
     // draw to canvas or set as img src
   }

6. HOTSPOT HIGHLIGHTING
   ──────────────────────────────────────────────────────────────────────────
   function highlightHotspot(selector) {
     document.querySelectorAll('.hotspot-active')
             .forEach(el => el.classList.remove('hotspot-active'));
     document.querySelector(selector)
             ?.classList.add('hotspot-active');
   }

7. NOTEBOOK PANEL UPDATE
   ──────────────────────────────────────────────────────────────────────────
   function updateNotebook(entries) {
     const list = document.getElementById('notebook-list');
     list.innerHTML = entries
       .map(e => `<li>${e}</li>`)
       .join('');
   }

8. RESET / REPLAY
   ──────────────────────────────────────────────────────────────────────────
   document.getElementById('btn-restart').addEventListener('click', () => {
     resetTutorial();
     clearTerminalLog();
     showBunnyDialogue(getBunnyDialogue(1).text, getBunnyDialogue(1).hint);
   });
*/
