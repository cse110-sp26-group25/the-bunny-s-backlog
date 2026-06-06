/**
 * Persists the current level's resume state in browser localStorage. This is
 * separate from local_storage.js, which owns settings and level-select progress,
 * but it notifies that shared layer when a level is completed.
 */
class LevelStorage {
  /**
   * Creates a storage adapter for current-level progress.
   *
   * @param {Storage} [storage] - localStorage-compatible storage object.
   * @param {{markLevelComplete:function(string):void}} [progressStorage]
   */
  constructor(storage, progressStorage) {
    this.storage = storage || LevelStorage.browserStorage();
    this.progressStorage = progressStorage || LevelStorage.progressStorageApi();
  }

  /**
   * Gets the browser's localStorage object when available. Tests can pass a
   * mock storage object into the constructor instead.
   *
   * @returns {?Storage}
   */
  static browserStorage() {
    if (typeof localStorage === "undefined") {
      return null;
    }
    return localStorage;
  }

  /**
   * Builds the localStorage key for one level's in-level progress.
   *
   * @param {string} levelId
   * @returns {string}
   */
  static keyFor(levelId) {
    return "bunnysBacklog.level." + levelId;
  }

  /**
   * Finds shared progress helpers from local_storage.js when that file is
   * loaded in the browser before storage.js.
   *
   * @returns {?{markLevelComplete:function(string):void}}
   */
  static progressStorageApi() {
    const root = typeof globalThis === "undefined" ? {} : globalThis;
    if (typeof root.markLevelComplete !== "function") {
      return null;
    }

    return {
      markLevelComplete: root.markLevelComplete,
    };
  }

  /**
   * Builds a fresh state object matching the refactored Game progress shape.
   *
   * @returns {{phase:number, inventory:string[], unlocked:object,
   * errors:number, complete:boolean, terminalHistory:object[]}}
   */
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

  /**
   * Creates a clean level state object with only the fields the current game
   * needs to restore progress. Invalid fields are replaced with defaults.
   *
   * @param {object} levelState
   * @returns {?object}
   */
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

  /**
   * Loads saved progress for one level. If no save exists, returns null so the
   * Game can start fresh. Corrupted JSON is cleared and treated as no save.
   *
   * @param {string} levelId
   * @returns {?object}
   */
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

  /**
   * Saves the current level's progress. When the normalized state is complete,
   * also marks the level complete in the shared level-select progress layer.
   *
   * @param {string} levelId
   * @param {object} levelState
   */
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

  /**
   * Deletes the current level's saved progress. Used when the player resets the
   * level; settings and level-select progress are left untouched.
   *
   * @param {string} levelId
   */
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