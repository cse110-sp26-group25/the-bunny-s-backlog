document.addEventListener('DOMContentLoaded', function () {

  // Sliders
  ['master', 'music', 'effects'].forEach(function (name) {
    const slider = document.getElementById(name + '-slider');
    slider.addEventListener('input', function () {
      updateSlider(name, this.value);
    });
  });

  // Hard mode toggle
  document.getElementById('hard-toggle').addEventListener('change', function () {
    updateToggle(this);
  });

  // Buttons
  document.getElementById('reset-btn').addEventListener('click', resetDefaults);
  document.getElementById('save-btn').addEventListener('click', saveSettings);

});

function updateSlider(name, value) {
  document.getElementById(name + '-val').textContent = value + '%';
  document.getElementById(name + '-fill').style.width = value + '%';
}

function updateToggle(checkbox) {
  const status = document.getElementById('hard-status');
  if (checkbox.checked) {
    status.textContent = 'ENABLED';
    status.style.color = 'var(--green)';
  } else {
    status.textContent = 'DISABLED';
    status.style.color = 'var(--red)';
  }
}

function resetDefaults() {
  updateSlider('master', 80);
  updateSlider('music', 60);
  updateSlider('effects', 75);
  document.getElementById('master-slider').value = 80;
  document.getElementById('music-slider').value = 60;
  document.getElementById('effects-slider').value = 75;
  const toggle = document.getElementById('hard-toggle');
  toggle.checked = false;
  updateToggle(toggle);
}

function saveSettings() {
  const btn = document.getElementById('save-btn');
  btn.textContent = 'Saved ✓';
  btn.style.background = 'var(--green)';
  btn.style.boxShadow = '0 0 28px rgba(0,230,118,0.5)';
  setTimeout(function () {
    btn.textContent = 'Apply';
    btn.style.background = '';
    btn.style.boxShadow = '';
  }, 1800);
}

function backToTitle() {
    window.location.href = "/Screens/titleScreen/title.html";
}