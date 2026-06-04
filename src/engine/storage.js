/* eslint-disable no-unused-vars */
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
