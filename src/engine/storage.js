/* eslint-disable no-unused-vars */
/**
   Implemented with local storage, loads, saves, and clears a single
 * level's state keyed by level id.
 */
class LevelStorage {
  /** @returns {?object} the saved LevelState */
  load(levelId) {
    return null;
  }

  /** Persist a level's state. */
  save(levelId, levelState) {}

  /** Reset a level's saved state. */
  clear(levelId) {}
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LevelStorage };
}
