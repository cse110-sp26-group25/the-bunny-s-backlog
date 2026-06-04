document.addEventListener('DOMContentLoaded', function () {

  loadSavedSettings();

  // Sliders
  ['master', 'music', 'effects'].forEach(function (name) {
    const slider = document.getElementById(name + '-slider');
    slider.addEventListener('input', function () {
      updateSlider(name, this.value);
      persistSettings();
    });
  });

  // Hard mode toggle
  document.getElementById('hard-toggle').addEventListener('change', function () {
    updateToggle(this);
    persistSettings();
  });

  // Buttons
  document.getElementById('reset-btn').addEventListener('click', resetDefaults);
  document.getElementById('save-btn').addEventListener('click', saveSettings);

});

function getCurrentSettings() {
  return {
    masterVolume: Number(document.getElementById('master-slider').value),
    musicVolume: Number(document.getElementById('music-slider').value),
    effectsVolume: Number(document.getElementById('effects-slider').value),
    hardMode: document.getElementById('hard-toggle').checked
  };
}

function applySettings(settings) {
  const savedSettings = Object.assign(createDefaultSettings(), settings);
  const toggle = document.getElementById('hard-toggle');

  document.getElementById('master-slider').value = savedSettings.masterVolume;
  document.getElementById('music-slider').value = savedSettings.musicVolume;
  document.getElementById('effects-slider').value = savedSettings.effectsVolume;
  updateSlider('master', savedSettings.masterVolume);
  updateSlider('music', savedSettings.musicVolume);
  updateSlider('effects', savedSettings.effectsVolume);

  toggle.checked = savedSettings.hardMode;
  updateToggle(toggle);
}

function loadSavedSettings() {
  applySettings(loadSettings());
}

function persistSettings() {
  saveSettingsData(getCurrentSettings());
}

function updateSlider(name, value) {
  document.getElementById(name + '-val').textContent = value + '%';
  document.getElementById(name + '-fill').style.width = value + '%';
  document.getElementById(name + '-slider').setAttribute('aria-valuetext', value + '%');
}

function updateToggle(checkbox) {
  const status = document.getElementById('hard-status');
  if (checkbox.checked) {
    status.textContent = 'ENABLED';
    status.style.color = 'var(--green)';
    checkbox.setAttribute('aria-checked', 'true');
  } else {
    status.textContent = 'DISABLED';
    status.style.color = 'var(--red)';
    checkbox.setAttribute('aria-checked', 'false');
  }
}

function resetDefaults() {
  applySettings(createDefaultSettings());
  persistSettings();
}

function saveSettings() {
  persistSettings();

  const btn = document.getElementById('save-btn');
  btn.textContent = 'Saved';
  btn.style.background = 'var(--green)';
  btn.style.boxShadow = '0 0 28px rgba(0,230,118,0.5)';
  setTimeout(function () {
    btn.textContent = 'Apply';
    btn.style.background = '';
    btn.style.boxShadow = '';
  }, 1800);
}

function backToTitle() {
    persistSettings();
    window.location.href = "../titleScreen/title.html";
}
