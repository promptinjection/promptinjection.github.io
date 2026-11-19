(() => {
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preference;

  try {
    const saved = localStorage.getItem('dark-mode') ?? localStorage.getItem('darkMode');
    if (saved === 'true' || saved === 'false') preference = saved === 'true';
  } catch {
    // The theme can still be switched when storage is unavailable.
  }

  function applyTheme() {
    const dark = preference ?? systemTheme.matches;
    document.body.classList.toggle('dark-mode', dark);
    document.body.classList.toggle('light-mode', !dark);

    const button = document.querySelector('.research-theme-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(dark));
      button.querySelector('.sun-icon').style.display = dark ? 'none' : '';
      button.querySelector('.moon-icon').style.display = dark ? '' : 'none';
    }
  }

  window.toggleDarkMode = () => {
    preference = !document.body.classList.contains('dark-mode');
    try {
      localStorage.setItem('dark-mode', String(preference));
    } catch {
      // The current page can still use the selected theme.
    }
    applyTheme();
  };

  document.body.classList.add((preference ?? systemTheme.matches) ? 'dark-mode' : 'light-mode');
  document.addEventListener('DOMContentLoaded', applyTheme);
  systemTheme.addEventListener('change', applyTheme);
})();
