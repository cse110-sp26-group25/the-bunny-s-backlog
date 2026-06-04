(function startGame() {
  function start() {
    new LevelPlayer().init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
