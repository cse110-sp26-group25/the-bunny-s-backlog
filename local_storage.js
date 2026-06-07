/**
 * Shared local storage helpers for The Bunny's Backlog. This file owns the
 * game-wide save array used for settings and level-select progress.
 */

/** The browser localStorage key for the shared save array. */
const SAVE_KEY = "bunnysBacklogSave";

/** Default settings stored at index 8 in the shared save array. */
const DEFAULT_SETTINGS = {
  masterVolume: 80,
  musicVolume: 60,
  effectsVolume: 75,
  hardMode: false
};

const TUTORIAL_LEVEL_ID = "tutorial_morning_routine";

/** Stable level ids used by level-select progress. */
const LEVEL_IDS = {
  TUTORIAL: TUTORIAL_LEVEL_ID,
  LEVEL_1: "level_1_bakery",
  LEVEL_2: "level_2_police_station",
  LEVEL_3: "level_3_placeholder",
  LEVEL_4: "level_4_placeholder",
  LEVEL_5: "level_5_placeholder"
};

/** The order used to unlock the next level after completion. */
const LEVEL_ORDER = [
  LEVEL_IDS.TUTORIAL,
  LEVEL_IDS.LEVEL_1,
  LEVEL_IDS.LEVEL_2,
  LEVEL_IDS.LEVEL_3,
  LEVEL_IDS.LEVEL_4,
  LEVEL_IDS.LEVEL_5
];

/**
 * Creates a fresh settings object so callers can edit it without combining
 * DEFAULT_SETTINGS.
 *
 * @returns {{masterVolume:number, musicVolume:number, effectsVolume:number,
 *            hardMode:boolean}}
 */
function createDefaultSettings() {
  return Object.assign({}, DEFAULT_SETTINGS);
}

/**
 * Returns only valid settings values, with defaults for missing or old saves.
 *
 * @param {object} settings
 * @returns {{masterVolume:number, musicVolume:number, effectsVolume:number,
 *            hardMode:boolean}}
 */
function normalizeSettings(settings) {
  const defaults = createDefaultSettings();
  const source = settings && typeof settings === "object" ? settings : {};

  return {
    masterVolume: normalizeVolumeSetting(source.masterVolume, defaults.masterVolume),
    musicVolume: normalizeVolumeSetting(source.musicVolume, defaults.musicVolume),
    effectsVolume: normalizeVolumeSetting(source.effectsVolume, defaults.effectsVolume),
    hardMode: Boolean(source.hardMode)
  };
}

/**
 * Keeps saved volume values inside the slider's 0-100 range.
 *
 * @param {*} value
 * @param {number} fallback
 * @returns {number}
 */
function normalizeVolumeSetting(value, fallback) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, numberValue));
}

/**
 * Creates the default progress map for the tutorial plus future levels.
 *
 * @returns {object}
 */
function createDefaultLevelProgress() {
  return {
    [LEVEL_IDS.TUTORIAL]: { unlocked: true, completed: false },
    [LEVEL_IDS.LEVEL_1]: { unlocked: true, completed: false },
    [LEVEL_IDS.LEVEL_2]: { unlocked: true, completed: false },
    [LEVEL_IDS.LEVEL_3]: { unlocked: false, completed: false },
    [LEVEL_IDS.LEVEL_4]: { unlocked: false, completed: false },
    [LEVEL_IDS.LEVEL_5]: { unlocked: false, completed: false }
  };
}

/**
 * Creates the full shared save array used by local_storage.js.
 *
 * @returns {Array}
 */
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

/**
 * Reads browser localStorage when available. Some browser modes can throw even
 * when localStorage exists, so screens should treat that like no save file.
 *
 * @param {string} key
 * @returns {?string}
 */
function getStoredItem(key) {
  if (typeof localStorage === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

/**
 * Writes browser localStorage when available.
 *
 * @param {string} key
 * @param {string} value
 */
function setStoredItem(key, value) {
  if (typeof localStorage === "undefined") {
    return;
  }

  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Keep UI screens usable when storage is blocked.
  }
}

/**
 * Removes a browser localStorage key when available.
 *
 * @param {string} key
 */
function removeStoredItem(key) {
  if (typeof localStorage === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    // Keep UI screens usable when storage is blocked.
  }
}

/**
 * Saves the shared save array into browser localStorage.
 *
 * @param {Array} saveData
 */
function saveGame(saveData) {
  setStoredItem(SAVE_KEY, JSON.stringify(saveData));
}

/**
 * Loads the shared save array from browser localStorage.
 *
 * @returns {Array}
 */
function loadGame() {
  const savedString = getStoredItem(SAVE_KEY);

  // if no save data start new save file
  if (savedString === null) {
    return createDefaultSaveData();
  }
  
  // Convert saved JSON string back in array
  return JSON.parse(savedString);
}

/**
 * Deletes the shared save array from browser localStorage.
 */
function clearSave() {
  removeStoredItem(SAVE_KEY);
}

/**
 * Loads the shared save array safely. Corrupted JSON is cleared and replaced
 * with default save data.
 *
 * @returns {Array}
 */
function loadSafeGame() {
  try {
    return loadGame();
  } catch (error) {
    clearSave();
    return createDefaultSaveData();
  }
}

/**
 * Loads player settings from index 8 of the shared save array.
 *
 * @returns {object}
 */
function loadSettings() {
  const saveData = loadSafeGame();
  return normalizeSettings(saveData[8]);
}

/**
 * Saves player settings into index 8 without overwriting other save data.
 *
 * @param {object} settings
 */
function saveSettingsData(settings) {
  const saveData = loadSafeGame();
  saveData[8] = normalizeSettings(settings);
  saveGame(saveData);
}

/**
 * Converts a percentage setting into the browser media volume scale.
 *
 * @param {number|string} value
 * @returns {number}
 */
function volumePercentToScale(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return 0;
  }

  return Math.min(1, Math.max(0, numberValue / 100));
}

/**
 * Applies saved settings to the current page's media and hard-mode state.
 *
 * Audio/video elements can set `data-volume-type="music"` or
 * `data-volume-type="effects"`; otherwise they use master volume.
 *
 * @param {Document} [doc]
 * @param {object} [settings]
 */
function applyGlobalSettings(doc, settings) {
  try {
    if (typeof document === "undefined" && !doc) {
      return;
    }

    const page = doc || document;
    const savedSettings = settings ? normalizeSettings(settings) : loadSettings();
    const masterVolume = volumePercentToScale(savedSettings.masterVolume);
    const musicVolume = masterVolume * volumePercentToScale(savedSettings.musicVolume);
    const effectsVolume = masterVolume * volumePercentToScale(savedSettings.effectsVolume);

    page.documentElement.style.setProperty("--master-volume", String(masterVolume));
    page.documentElement.style.setProperty("--music-volume", String(musicVolume));
    page.documentElement.style.setProperty("--effects-volume", String(effectsVolume));
    page.documentElement.dataset.hardMode = savedSettings.hardMode ? "true" : "false";

    if (page.body) {
      page.body.classList.toggle("hard-mode", Boolean(savedSettings.hardMode));
    }

    page.querySelectorAll("audio, video").forEach((mediaElement) => {
      const volumeType = mediaElement.dataset.volumeType;
      let volume = masterVolume;

      if (volumeType === "music") {
        volume = musicVolume;
      } else if (volumeType === "effects") {
        volume = effectsVolume;
      }

      mediaElement.volume = volume;
      mediaElement.muted = volume === 0;
    });
  } catch (error) {
    // Never let settings application block page controls.
  }
}

/**
 * Loads level-select progress from index 10, filling missing levels with
 * defaults.
 *
 * @returns {object}
 */
function loadLevelProgress() {
  const saveData = loadSafeGame();
  return Object.assign(createDefaultLevelProgress(), saveData[10]);
}

/**
 * Saves the full level-select progress object into index 10.
 *
 * @param {object} levelProgress
 */
function saveLevelProgress(levelProgress) {
  const saveData = loadSafeGame();
  saveData[10] = Object.assign(createDefaultLevelProgress(), levelProgress);
  saveGame(saveData);
}

/**
 * Saves the current level id into index 1.
 *
 * @param {string} levelId
 */
function saveCurrentLevel(levelId) {
  const saveData = loadSafeGame();
  saveData[1] = levelId;
  saveGame(saveData);
}

/**
 * Saves the current checkpoint id into index 2.
 *
 * @param {string} checkpointId
 */
function saveCheckpoint(checkpointId) {
  const saveData = loadSafeGame();
  saveData[2] = checkpointId;
  saveGame(saveData);
}

/**
 * Marks a level as unlocked in the level-select progress map.
 *
 * @param {string} levelId
 */
function unlockLevel(levelId) {
  const levelProgress = loadLevelProgress();
  levelProgress[levelId] = Object.assign(
    { unlocked: false, completed: false },
    levelProgress[levelId],
    { unlocked: true }
  );
  saveLevelProgress(levelProgress);
}

/**
 * Marks a level complete and unlocks the next level in LEVEL_ORDER, if one
 * exists.
 *
 * @param {string} levelId
 */
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

/**
 * Checks whether a level is available to play.
 *
 * @param {string} levelId
 * @returns {boolean}
 */
function isLevelUnlocked(levelId) {
  const levelProgress = loadLevelProgress();
  return Boolean(levelProgress[levelId]?.unlocked);
}

/**
 * Checks whether a level has been completed.
 *
 * @param {string} levelId
 * @returns {boolean}
 */
function isLevelComplete(levelId) {
  const levelProgress = loadLevelProgress();
  return Boolean(levelProgress[levelId]?.completed);
}

/**
 * Finds the next level id in LEVEL_ORDER.
 *
 * @param {string} levelId
 * @returns {?string}
 */
function getNextLevelId(levelId) {
  const index = LEVEL_ORDER.indexOf(levelId);
  return index >= 0 ? LEVEL_ORDER[index + 1] || null : null;
}

/**
 * Exports helpers for Jest while keeping this file browser-safe.
 */
if (typeof module !== "undefined") {
  module.exports = {
    SAVE_KEY,
    DEFAULT_SETTINGS,
    TUTORIAL_LEVEL_ID,
    LEVEL_IDS,
    LEVEL_ORDER,
    createDefaultSettings,
    normalizeSettings,
    normalizeVolumeSetting,
    createDefaultLevelProgress,
    createDefaultSaveData,
    getStoredItem,
    setStoredItem,
    removeStoredItem,
    saveGame,
    loadGame,
    clearSave,
    loadSafeGame,
    loadSettings,
    saveSettingsData,
    volumePercentToScale,
    applyGlobalSettings,
    loadLevelProgress,
    saveLevelProgress,
    saveCurrentLevel,
    saveCheckpoint,
    unlockLevel,
    markLevelComplete,
    isLevelUnlocked,
    isLevelComplete,
    getNextLevelId
  };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applyGlobalSettings();
    });
  } else {
    applyGlobalSettings();
  }
}
