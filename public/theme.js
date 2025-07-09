function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  const themeRadios = document.querySelectorAll('input[name="theme"]');
  if (themeRadios.length) {
    themeRadios.forEach(radio => {
      radio.checked = radio.value === savedTheme;
      radio.addEventListener('change', () => {
        applyTheme(radio.value);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', initializeTheme);
