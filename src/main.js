/**
 * Entry point loaded by game.html. It boots the game once the DOM is
 * ready by constructing a {@link LevelPlayer} object and running its init.
 */

/**
 * Self-invoking bootstrap: starts the player immediately if the document is
 * already parsed, otherwise waits for DOMContentLoaded so the elements the UI
 * reaches for exist.
 */
(function startGame() {
  /**
   * Constructs the level player and begins loading the current level.
   */
  function start() {
    new LevelPlayer().init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
