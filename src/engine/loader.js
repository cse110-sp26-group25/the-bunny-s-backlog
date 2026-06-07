/**
 * Loads level content from the levels/ folder: fetches and validates each level's
 * level.json, resolves its asset paths, and reads the level manifest.
 */
class LevelLoader {
  /**
   * Creates a loader rooted at the folder where level data lives.
   *
   * @param {string} [basePath] - where level folders live, relative to game.html
   */
  constructor(basePath) {
    this.basePath = basePath || "levels/";
  }

  /**
   * Builds the URL of a level's folder from its folder name.
   *
   * @param {string} folder
   * @returns {string}
   */
  levelFolderUrl(folder) {
    return this.basePath + folder + "/";
  }

  /**
   * Loads, validates, and asset-resolves a level by its folder name, producing
   * the level object passed to {@link Game}.
   *
   * @param {string} folder
   * @returns {Promise<object>}
   */
  async loadLevel(folder) {
    const folderUrl = this.levelFolderUrl(folder);
    const level = await LevelLoader.fetchJson(folderUrl + folder + ".json");
    LevelLoader.validateLevel(level, folder);

    return LevelLoader.resolveAssets(level, folderUrl);
  }

  /**
   * Loads the level registry, the ordered list of available levels that the
   * menu uses to know which levels exist and in what order.
   *
   * @returns {Promise<Array<{id:string, folder:string, title:string}>>}
   */
  async loadManifest() {
    return LevelLoader.fetchJson(this.basePath + "manifest.json");
  }

  /**
   * Fetches a URL and parses the body as JSON, throwing a readable error on a
   * non-OK response.
   *
   * @param {string} url
   * @returns {Promise<object>}
   */
  static async fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        "Could not load " + url + " (HTTP " + response.status + ").",
      );
    }

    return response.json();
  }

  /**
   * Asserts a level has the required top-level fields and a non-empty phases
   * array in which every phase defines an answer; throws a descriptive error
   * naming the level and offending field otherwise.
   *
   * @param {object} level
   * @param {string} folder
   * @returns {object}
   */
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

  /**
   * Prefixes a relative asset path with its level folder, leaving absolute URLs,
   * data URIs, and root-relative paths untouched.
   *
   * @param {string} assetPath
   * @param {string} baseUrl
   * @returns {string}
   */
  static absoluteAsset(assetPath, baseUrl) {
    if (/^(https?:|data:|\/)/.test(assetPath)) {
      return assetPath;
    }

    return baseUrl + assetPath;
  }

  /**
   * Rewrites each scene's relative background path so it resolves from the level
   * folder rather than from game.html.
   *
   * @param {object} level
   * @param {string} baseUrl
   * @returns {object}
   */
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
