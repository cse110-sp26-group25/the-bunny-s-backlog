// ---------------------------------------------------------
// LevelStorage
// ---------------------------------------------------------
// This class handles saving, loading, and clearing progress
// for the current level. It is separate from local_storage.js,
// which is used for settings and level-select progress.
// ---------------------------------------------------------
class LevelStorage {
  constructor(storage, progressStorage) {
    this.storage = storage || LevelStorage.browserStorage();
    this.progressStorage = progressStorage || LevelStorage.progressStorageApi();
  }

  // ---------------------------------------------------------
  // browserStorage()
  // ---------------------------------------------------------
  // Gets the browser's localStorage object when the game is
  // running in a browser. Jest can pass a mock storage object
  // into the constructor, so tests do not need a browser.
  // ---------------------------------------------------------
  static browserStorage() {
    if (typeof localStorage === "undefined") {
      return null;
    }
    return localStorage;
  }

  // ---------------------------------------------------------
  // keyFor(levelId)
  // ---------------------------------------------------------
  // Builds the localStorage key for one level's in-level
  // progress. Example:
  // bunnysBacklog.level.tutorial_morning_routine
  // ---------------------------------------------------------
  static keyFor(levelId) {
    return "bunnysBacklog.level." + levelId;
  }

  // ---------------------------------------------------------
  // progressStorageApi()
  // ---------------------------------------------------------
  // Finds shared progress helpers from local_storage.js when
  // that file is loaded in the browser. This keeps current
  // level resume data in LevelStorage, while completed levels
  // still update level-select progress.
  // ---------------------------------------------------------
  static progressStorageApi() {
    const root = typeof globalThis === "undefined" ? {} : globalThis;
    if (typeof root.markLevelComplete !== "function") {
      return null;
    }

    return {
      markLevelComplete: root.markLevelComplete,
    };
  }

  // ---------------------------------------------------------
  // defaultLevelState()
  // ---------------------------------------------------------
  // Creates a fresh state object for the refactored Game
  // class. This is the shape LevelPlayer saves after commands.
  // ---------------------------------------------------------
  static defaultLevelState() {
    return {
      phase: 1,
      inventory: [],
      unlocked: {},
      errors: 0,
      complete: false,
      terminalHistory: [],
    };
  }

  // ---------------------------------------------------------
  // normalize(levelState)
  // ---------------------------------------------------------
  // Creates a clean level state object with only the fields
  // the current game needs to restore progress.
  // ---------------------------------------------------------
  static normalize(levelState) {
    if (!levelState || typeof levelState !== "object") {
      return null;
    }

    const phase = Number(levelState.phase);
    const errors = Number(levelState.errors);

    return {
      phase: Number.isFinite(phase) && phase > 0 ? phase : 1,
      inventory: Array.isArray(levelState.inventory)
        ? levelState.inventory.slice()
        : [],
      unlocked:
        levelState.unlocked && typeof levelState.unlocked === "object"
          ? Object.assign({}, levelState.unlocked)
          : {},
      errors: Number.isFinite(errors) && errors >= 0 ? errors : 0,
      complete: Boolean(levelState.complete),
      terminalHistory: Array.isArray(levelState.terminalHistory)
        ? levelState.terminalHistory
            .filter((line) => line && typeof line === "object")
            .map((line) => ({
              text: String(line.text || ""),
              cls: String(line.cls || ""),
            }))
        : [],
    };
  }

  // ---------------------------------------------------------
  // load(levelId)
  // ---------------------------------------------------------
  // Loads saved progress for one level. If no save exists, it
  // returns null so the Game can start fresh.
  // ---------------------------------------------------------
  load(levelId) {
    if (!this.storage || !levelId) {
      return null;
    }

    try {
      const savedState = this.storage.getItem(LevelStorage.keyFor(levelId));
      return savedState ? LevelStorage.normalize(JSON.parse(savedState)) : null;
    } catch {
      this.clear(levelId);
      return null;
    }
  }

  // ---------------------------------------------------------
  // save(levelId, levelState)
  // ---------------------------------------------------------
  // Saves the current level's progress. When a level is
  // complete, this also notifies local_storage.js so
  // level-select progress is updated.
  // ---------------------------------------------------------
  save(levelId, levelState) {
    if (!this.storage || !levelId) {
      return;
    }

    const state = LevelStorage.normalize(levelState);
    if (!state) {
      return;
    }

    this.storage.setItem(LevelStorage.keyFor(levelId), JSON.stringify(state));

    if (state.complete && this.progressStorage) {
      this.progressStorage.markLevelComplete(levelId);
    }
  }

  // ---------------------------------------------------------
  // clear(levelId)
  // ---------------------------------------------------------
  // Deletes the current level's saved progress. This is used
  // when the player resets the level.
  // ---------------------------------------------------------
  clear(levelId) {
    if (!this.storage || !levelId) {
      return;
    }

    this.storage.removeItem(LevelStorage.keyFor(levelId));
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LevelStorage };
}
