class LevelLoader {
  /**
   * @param {string} [basePath] - where level folders live, relative to game.html
   */
  constructor(basePath) {
    this.basePath = basePath || "levels/";
  }

  levelFolderUrl(folder) {
    return this.basePath + folder + "/";
  }

  /** Load, validate, and asset-resolve a level by its folder name. */
  async loadLevel(folder) {
    const folderUrl = this.levelFolderUrl(folder);
    const level = await LevelLoader.fetchJson(folderUrl + "level.json");
    LevelLoader.validateLevel(level, folder);
    return LevelLoader.resolveAssets(level, folderUrl);
  }

  /** Load the level registry (ordered list of { id, folder, title }). */
  async loadManifest() {
    return LevelLoader.fetchJson(this.basePath + "manifest.json");
  }

  static async fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        "Could not load " + url + " (HTTP " + response.status + ").",
      );
    }
    return response.json();
  }

  static validateLevel(level, folder) {
    ["id", "title", "scenes", "phases"].forEach((requiredKey) => {
      if (!(requiredKey in level)) {
        throw new Error(
          'Level "' +
            folder +
            '" is missing required field: "' +
            requiredKey +
            '".',
        );
      }
    });
    if (!Array.isArray(level.phases) || level.phases.length === 0) {
      throw new Error(
        'Level "' + folder + '" must define a non-empty "phases" array.',
      );
    }
    level.phases.forEach((phaseDef, index) => {
      if (!phaseDef.answer) {
        throw new Error(
          'Level "' +
            folder +
            '" phase ' +
            (index + 1) +
            ' is missing "answer".',
        );
      }
    });
    return level;
  }

  /** Prefix relative asset paths with their level folder; leave URLs/data URIs. */
  static absoluteAsset(assetPath, baseUrl) {
    if (/^(https?:|data:|\/)/.test(assetPath)) {
      return assetPath;
    }
    return baseUrl + assetPath;
  }

  /** Resolve scene background paths relative to the level folder. */
  static resolveAssets(level, baseUrl) {
    const resolvedScenes = {};
    Object.keys(level.scenes || {}).forEach((sceneName) => {
      resolvedScenes[sceneName] = LevelLoader.absoluteAsset(
        level.scenes[sceneName],
        baseUrl,
      );
    });
    level.scenes = resolvedScenes;
    return level;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LevelLoader };
}
