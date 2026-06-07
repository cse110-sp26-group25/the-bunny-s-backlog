document.addEventListener("DOMContentLoaded", function () {
  // Sliders
  ["master", "music", "effects"].forEach(function (name) {
    const slider = document.getElementById(name + "-slider");
    if (!slider) {
      return;
    }

    slider.addEventListener("input", function () {
      updateSlider(name, this.value);
      previewSettings();
    });
  });

  // Hard mode toggle
  const hardToggle = document.getElementById("hard-toggle");
  if (hardToggle) {
    hardToggle.addEventListener("change", function () {
      updateToggle(this);
      previewSettings();
    });
  }

  // Buttons
  const resetButton = document.getElementById("reset-btn");
  const saveButton = document.getElementById("save-btn");
  if (resetButton) {
    resetButton.addEventListener("click", resetDefaults);
  }
  if (saveButton) {
    saveButton.addEventListener("click", saveSettings);
  }

  loadSavedSettings();
});

const FALLBACK_SETTINGS = {
  masterVolume: 80,
  musicVolume: 60,
  effectsVolume: 75,
  hardMode: false,
};
let previewFrameId = null;

function getDefaultSettings() {
  if (typeof createDefaultSettings === "function") {
    return createDefaultSettings();
  }

  return Object.assign({}, FALLBACK_SETTINGS);
}

function getCurrentSettings() {
  return {
    masterVolume: Number(document.getElementById("master-slider").value),
    musicVolume: Number(document.getElementById("music-slider").value),
    effectsVolume: Number(document.getElementById("effects-slider").value),
    hardMode: document.getElementById("hard-toggle").checked,
  };
}

function applySettings(settings) {
  const savedSettings = Object.assign(getDefaultSettings(), settings);
  const toggle = document.getElementById("hard-toggle");

  document.getElementById("master-slider").value = savedSettings.masterVolume;
  document.getElementById("music-slider").value = savedSettings.musicVolume;
  document.getElementById("effects-slider").value = savedSettings.effectsVolume;
  updateSlider("master", savedSettings.masterVolume);
  updateSlider("music", savedSettings.musicVolume);
  updateSlider("effects", savedSettings.effectsVolume);

  if (toggle) {
    toggle.checked = savedSettings.hardMode;
    updateToggle(toggle);
  }

  applySettingsGlobally(savedSettings);
}

function loadSavedSettings() {
  try {
    if (typeof loadSettings === "function") {
      applySettings(loadSettings());
      return;
    }
  } catch (error) {
    console.warn("Could not load saved settings. Using defaults.", error);
  }

  applySettings(getDefaultSettings());
}

function persistSettings() {
  const settings = getCurrentSettings();

  try {
    if (typeof saveSettingsData === "function") {
      saveSettingsData(settings);
    }
  } catch (error) {
    console.warn("Could not save settings.", error);
  }

  applySettingsGlobally(settings);
}

function previewSettings() {
  if (typeof requestAnimationFrame !== "function") {
    applySettingsGlobally(getCurrentSettings());
    return;
  }

  if (previewFrameId !== null) {
    cancelAnimationFrame(previewFrameId);
  }

  previewFrameId = requestAnimationFrame(function () {
    previewFrameId = null;
    applySettingsGlobally(getCurrentSettings());
  });
}

function updateSlider(name, value) {
  const output = document.getElementById(name + "-val");
  const fill = document.getElementById(name + "-fill");
  const slider = document.getElementById(name + "-slider");

  if (output) {
    output.textContent = value + "%";
  }
  if (fill) {
    fill.style.width = value + "%";
  }
  if (slider) {
    slider.setAttribute("aria-valuetext", value + "%");
  }
}

function updateToggle(checkbox) {
  const status = document.getElementById("hard-status");
  if (!status) {
    return;
  }

  if (checkbox.checked) {
    status.textContent = "ENABLED";
    status.style.color = "var(--green)";
    checkbox.setAttribute("aria-checked", "true");
  } else {
    status.textContent = "DISABLED";
    status.style.color = "var(--red)";
    checkbox.setAttribute("aria-checked", "false");
  }
}

function resetDefaults() {
  applySettings(getDefaultSettings());
  persistSettings();
}

function saveSettings() {
  persistSettings();

  const btn = document.getElementById("save-btn");
  btn.textContent = "Saved";
  btn.style.background = "var(--green)";
  btn.style.boxShadow = "0 0 28px rgba(0,230,118,0.5)";
  setTimeout(function () {
    btn.textContent = "Apply";
    btn.style.background = "";
    btn.style.boxShadow = "";
  }, 1800);
}

function backToTitle() {
  window.location.href = "../titleScreen/title.html";
}

function applySettingsGlobally(settings) {
  try {
    if (typeof applyGlobalSettings === "function") {
      applyGlobalSettings(document, settings);
    }
  } catch (error) {
    console.warn("Could not apply global settings.", error);
  }
}

/*Code for sounds if button clicked */
if (localStorage.getItem("playButtonSound") === "true") {
  const sound = new Audio("../../Sounds/buttonPress.mp3");
  sound.volume = 0.5;
  sound.play().catch(() => {});
  localStorage.removeItem("playButtonSound");
}
