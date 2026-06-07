/* Code for levels button */
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".level-button")
    .addEventListener("click", function () {
      window.location.href = "../level_screen/index.html";
    });
});

/* Code for continue button - for now redirects to level selection */
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".continue-button")
    .addEventListener("click", function () {
      window.location.href = "../level_screen/index.html";
    });
});

/* Code for settings button */
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".settings-button")
    .addEventListener("click", function () {
      window.location.href = "../settings/settings.html";
    });
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".credits-button")
    .addEventListener("click", function () {
      window.location.href = "../credits/credits.html";
    });
});

/*Code for sounds if button clicked */
if (localStorage.getItem("playButtonSound") === "true") {
  const sound = new Audio("../../Sounds/buttonPress.mp3");
  sound.volume = 0.5;
  sound.play().catch(() => {});
  localStorage.removeItem("playButtonSound");
}
