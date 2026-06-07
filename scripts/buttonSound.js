document.addEventListener("DOMContentLoaded", () => {
  const clickSound = new Audio("../../Sounds/buttonPress.mp3");
  clickSound.preload = "auto";
  clickSound.volume = 0.5;

  document.querySelectorAll("button, a, [onclick]").forEach((element) => {
    element.addEventListener("click", () => {
      localStorage.setItem("playButtonSound", "true");
    });
  });
});
