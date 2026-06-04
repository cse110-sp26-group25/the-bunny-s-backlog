// ---------------------------------------------------------
// Local Storage System for The Bunny's Backlog
// ---------------------------------------------------------
// This file handles saving, loading, and clearing player data.
// The data is stored in the browser using localStorage.
// Since localStorage only stores strings, the save array is
// converted into a JSON string when saving, then parsed back
// into an array when loading.
// ---------------------------------------------------------

// name/key used to store the save data 
// must stay same everywhere in project
const SAVE_KEY = "bunnysBacklogSave";

// default settings used by the settings screen
// these values are stored at index 8 in the save array
const DEFAULT_SETTINGS = {
  masterVolume: 80,
  musicVolume: 60,
  effectsVolume: 75,
  hardMode: false
};

const TUTORIAL_LEVEL_ID = "tutorial_morning_routine";

const LEVEL_IDS = {
  TUTORIAL: TUTORIAL_LEVEL_ID,
  LEVEL_1: "level_001",
  LEVEL_2: "level_002",
  LEVEL_3: "level_003",
  LEVEL_4: "level_004",
  LEVEL_5: "level_005"
};

const LEVEL_ORDER = [
  LEVEL_IDS.TUTORIAL,
  LEVEL_IDS.LEVEL_1,
  LEVEL_IDS.LEVEL_2,
  LEVEL_IDS.LEVEL_3,
  LEVEL_IDS.LEVEL_4,
  LEVEL_IDS.LEVEL_5
];

// ---------------------------------------------------------
// createDefaultSettings()
// ---------------------------------------------------------
// Creates a fresh settings object so callers can edit it
// without changing DEFAULT_SETTINGS.
// ---------------------------------------------------------
function createDefaultSettings() {
  return Object.assign({}, DEFAULT_SETTINGS);
}

// ---------------------------------------------------------
// createDefaultLevelProgress()
// ---------------------------------------------------------
// Creates the default progress map for tutorial plus five
// game levels. Level IDs must match the IDs used by level
// selection and the level files.
// ---------------------------------------------------------
function createDefaultLevelProgress() {
  return {
    [LEVEL_IDS.TUTORIAL]: { unlocked: true, completed: false },
    [LEVEL_IDS.LEVEL_1]: { unlocked: true, completed: false },
    [LEVEL_IDS.LEVEL_2]: { unlocked: false, completed: false },
    [LEVEL_IDS.LEVEL_3]: { unlocked: false, completed: false },
    [LEVEL_IDS.LEVEL_4]: { unlocked: false, completed: false },
    [LEVEL_IDS.LEVEL_5]: { unlocked: false, completed: false }
  };
}

function createDefaultSaveData() {
  return [
    1,                  // index 0: save version
    LEVEL_IDS.TUTORIAL, // index 1: current level
    "start",            // index 2: current checkpoint
    [],                 // index 3: inventory
    {},                 // index 4: clues found
    {},                 // index 5: object states
    [],                 // index 6: unlocked notebook pages
    [],                 // index 7: terminal history
    createDefaultSettings(), // index 8: settings
    false,              // index 9: tutorial completed
    createDefaultLevelProgress() // index 10: level progress
  ];
}

// ---------------------------------------------------------
// saveGame(saveData)
// ---------------------------------------------------------
// Saves the current game data into localStorage.
// The saveData array must be converted into a JSON string
// because localStorage cannot directly store arrays or objects.
// ---------------------------------------------------------
function saveGame(saveData) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

// ---------------------------------------------------------
// loadGame()
// ---------------------------------------------------------
// Loads the save data from localStorage.
// If no save file exists, it creates a new default save.
// ---------------------------------------------------------
function loadGame() {
  const savedString = localStorage.getItem(SAVE_KEY);

  // if no save data start new save file
  if (savedString === null) {
    return createDefaultSaveData();
  }
  
  // Convert saved JSON string back in array
  return JSON.parse(savedString);
}

// ---------------------------------------------------------
// clearSave()
// ---------------------------------------------------------
// Deletes the saved game data from localStorage.
// This can be used for a "New Game" or "Reset Save" button.
// ---------------------------------------------------------
function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

// ---------------------------------------------------------
// loadSafeGame()
// ---------------------------------------------------------
// Loads the save data without letting corrupted localStorage
// crash the settings page or game. If the saved JSON is bad,
// the broken save is cleared and default save data is used.
// ---------------------------------------------------------
function loadSafeGame() {
  try {
    return loadGame();
  } catch (error) {
    clearSave();
    return createDefaultSaveData();
  }
}

// ---------------------------------------------------------
// loadSettings()
// ---------------------------------------------------------
// Gets the settings object from index 8 of the save array.
// Missing settings are filled in from DEFAULT_SETTINGS so
// new settings can be added later without breaking old saves.
// ---------------------------------------------------------
function loadSettings() {
  const saveData = loadSafeGame();
  return Object.assign({}, DEFAULT_SETTINGS, saveData[8]);
}

// ---------------------------------------------------------
// saveSettingsData(settings)
// ---------------------------------------------------------
// Saves the settings object into index 8 of the save array.
// This preserves the rest of the player's save data instead
// of overwriting inventory, level progress, or tutorial state.
// ---------------------------------------------------------
function saveSettingsData(settings) {
  const saveData = loadSafeGame();
  saveData[8] = Object.assign({}, DEFAULT_SETTINGS, settings);
  saveGame(saveData);
}

// ---------------------------------------------------------
// loadLevelProgress()
// ---------------------------------------------------------
// Gets the level progress object from index 10. Missing
// levels are filled in so older saves still work.
// ---------------------------------------------------------
function loadLevelProgress() {
  const saveData = loadSafeGame();
  return Object.assign(createDefaultLevelProgress(), saveData[10]);
}

// ---------------------------------------------------------
// saveLevelProgress(levelProgress)
// ---------------------------------------------------------
// Saves the full level progress object into index 10.
// ---------------------------------------------------------
function saveLevelProgress(levelProgress) {
  const saveData = loadSafeGame();
  saveData[10] = Object.assign(createDefaultLevelProgress(), levelProgress);
  saveGame(saveData);
}

// ---------------------------------------------------------
// saveCurrentLevel(levelId)
// ---------------------------------------------------------
// Saves the level the player should resume from.
// ---------------------------------------------------------
function saveCurrentLevel(levelId) {
  const saveData = loadSafeGame();
  saveData[1] = levelId;
  saveGame(saveData);
}

// ---------------------------------------------------------
// saveCheckpoint(checkpointId)
// ---------------------------------------------------------
// Saves the player's checkpoint inside the current level.
// ---------------------------------------------------------
function saveCheckpoint(checkpointId) {
  const saveData = loadSafeGame();
  saveData[2] = checkpointId;
  saveGame(saveData);
}

// ---------------------------------------------------------
// unlockLevel(levelId)
// ---------------------------------------------------------
// Marks a level as available in the level progress map.
// ---------------------------------------------------------
function unlockLevel(levelId) {
  const levelProgress = loadLevelProgress();
  levelProgress[levelId] = Object.assign(
    { unlocked: false, completed: false },
    levelProgress[levelId],
    { unlocked: true }
  );
  saveLevelProgress(levelProgress);
}

// ---------------------------------------------------------
// markLevelComplete(levelId)
// ---------------------------------------------------------
// Marks a level complete and unlocks the next level in the
// official level order, if one exists.
// ---------------------------------------------------------
function markLevelComplete(levelId) {
  const levelProgress = loadLevelProgress();
  levelProgress[levelId] = Object.assign(
    { unlocked: false, completed: false },
    levelProgress[levelId],
    { unlocked: true, completed: true }
  );

  const nextLevelId = getNextLevelId(levelId);
  if (nextLevelId) {
    levelProgress[nextLevelId] = Object.assign(
      { unlocked: false, completed: false },
      levelProgress[nextLevelId],
      { unlocked: true }
    );
  }

  saveLevelProgress(levelProgress);
}

// ---------------------------------------------------------
// isLevelUnlocked(levelId)
// ---------------------------------------------------------
// Returns true when a level is available to play.
// ---------------------------------------------------------
function isLevelUnlocked(levelId) {
  const levelProgress = loadLevelProgress();
  return Boolean(levelProgress[levelId]?.unlocked);
}

// ---------------------------------------------------------
// isLevelComplete(levelId)
// ---------------------------------------------------------
// Returns true when a level has been completed.
// ---------------------------------------------------------
function isLevelComplete(levelId) {
  const levelProgress = loadLevelProgress();
  return Boolean(levelProgress[levelId]?.completed);
}

// ---------------------------------------------------------
// getNextLevelId(levelId)
// ---------------------------------------------------------
// Finds the next level in the official level order.
// ---------------------------------------------------------
function getNextLevelId(levelId) {
  const index = LEVEL_ORDER.indexOf(levelId);
  return index >= 0 ? LEVEL_ORDER[index + 1] || null : null;
}

// ---------------------------------------------------------
// createDefaultTutorialState()
// ---------------------------------------------------------
// Creates the default saved state for the tutorial level.
// The tutorial screen uses this when no tutorial save exists.
// ---------------------------------------------------------
function createDefaultTutorialState() {
  return {
    phase: 1,
    inventory: [],
    drawerUnlocked: false,
    errors: 0,
    complete: false,
    terminalHistory: []
  };
}

// ---------------------------------------------------------
// saveTutorialState(tutorialState)
// ---------------------------------------------------------
// Saves tutorial progress into the shared save array.
// This updates level, checkpoint, inventory, object states,
// terminal history, and tutorial completion.
// ---------------------------------------------------------
function saveTutorialState(tutorialState) {
  const saveData = loadSafeGame();
  const state = Object.assign(createDefaultTutorialState(), tutorialState);

  saveData[1] = TUTORIAL_LEVEL_ID;
  saveData[2] = "phase_" + state.phase;
  saveData[3] = state.inventory.slice();
  saveData[5] = Object.assign({}, saveData[5], {
    [TUTORIAL_LEVEL_ID]: {
      drawerUnlocked: state.drawerUnlocked,
      errors: state.errors,
      complete: state.complete
    }
  });
  saveData[6] = getTutorialNotebookPages(state.phase, state.complete);
  saveData[7] = state.terminalHistory.slice();
  saveData[9] = state.complete;
  saveData[10] = Object.assign(createDefaultLevelProgress(), saveData[10]);
  saveData[10][TUTORIAL_LEVEL_ID] = {
    unlocked: true,
    completed: state.complete
  };
  if (state.complete) {
    saveData[10][LEVEL_IDS.LEVEL_1] = Object.assign(
      { unlocked: false, completed: false },
      saveData[10][LEVEL_IDS.LEVEL_1],
      { unlocked: true }
    );
  }

  saveGame(saveData);
}

// ---------------------------------------------------------
// loadTutorialState()
// ---------------------------------------------------------
// Loads tutorial progress from the shared save array.
// Missing fields are filled with the default tutorial state
// so older saves still work.
// ---------------------------------------------------------
function loadTutorialState() {
  const saveData = loadSafeGame();
  const defaultState = createDefaultTutorialState();
  const tutorialObjects = saveData[5]?.[TUTORIAL_LEVEL_ID] || {};
  const checkpointMatch = String(saveData[2] || "").match(/^phase_(\d+)$/);
  const savedPhase = checkpointMatch ? Number(checkpointMatch[1]) : defaultState.phase;

  return Object.assign(defaultState, {
    phase: savedPhase,
    inventory: Array.isArray(saveData[3]) ? saveData[3].slice() : [],
    drawerUnlocked: Boolean(tutorialObjects.drawerUnlocked),
    errors: Number(tutorialObjects.errors) || 0,
    complete: Boolean(saveData[9] || tutorialObjects.complete),
    terminalHistory: Array.isArray(saveData[7]) ? saveData[7].slice() : []
  });
}

// ---------------------------------------------------------
// clearTutorialState()
// ---------------------------------------------------------
// Resets only tutorial progress while preserving other save
// data such as player settings.
// ---------------------------------------------------------
function clearTutorialState() {
  const saveData = loadSafeGame();
  saveData[1] = TUTORIAL_LEVEL_ID;
  saveData[2] = "phase_1";
  saveData[3] = [];
  saveData[5] = Object.assign({}, saveData[5]);
  delete saveData[5][TUTORIAL_LEVEL_ID];
  saveData[6] = [];
  saveData[7] = [];
  saveData[9] = false;
  saveData[10] = Object.assign(createDefaultLevelProgress(), saveData[10]);
  saveData[10][TUTORIAL_LEVEL_ID] = {
    unlocked: true,
    completed: false
  };
  saveGame(saveData);
}

// ---------------------------------------------------------
// getTutorialNotebookPages(phase, complete)
// ---------------------------------------------------------
// Converts tutorial progress into unlocked notebook page IDs.
// Completed phases are stored as stable page strings.
// ---------------------------------------------------------
function getTutorialNotebookPages(phase, complete) {
  const lastCompletedPhase = complete ? 10 : Math.max(0, Number(phase) - 1);
  const pages = [];

  for (let index = 1; index <= lastCompletedPhase; index++) {
    pages.push("tutorial_phase_" + index);
  }

  return pages;
}

// ---------------------------------------------------------
// module.exports
// ---------------------------------------------------------
// Makes the local storage helpers available to Jest tests.
// The typeof check keeps this file safe when it runs directly
// in the browser, where module may not exist.
// ---------------------------------------------------------
if (typeof module !== "undefined") {
  module.exports = {
    SAVE_KEY,
    DEFAULT_SETTINGS,
    TUTORIAL_LEVEL_ID,
    LEVEL_IDS,
    LEVEL_ORDER,
    createDefaultSettings,
    createDefaultLevelProgress,
    createDefaultSaveData,
    saveGame,
    loadGame,
    clearSave,
    loadSafeGame,
    loadSettings,
    saveSettingsData,
    loadLevelProgress,
    saveLevelProgress,
    saveCurrentLevel,
    saveCheckpoint,
    unlockLevel,
    markLevelComplete,
    isLevelUnlocked,
    isLevelComplete,
    getNextLevelId,
    createDefaultTutorialState,
    saveTutorialState,
    loadTutorialState,
    clearTutorialState,
    getTutorialNotebookPages
  };
}
