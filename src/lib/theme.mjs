function initializeTheme() {
  const key = 'portfolio-theme';
  const listeners = new Set();
  const readPreference = () => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  let preference = readPreference();
  let transition;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isDark = () => preference !== 'light';
  function apply() {
    document.documentElement.classList.toggle('dark', isDark());
    listeners.forEach(listener => listener());
  }
  function toggle({ animate = true } = {}) {
    transition?.skipTransition();
    preference = isDark() ? 'light' : 'dark';
    try { localStorage.setItem(key, preference); } catch {}
    if (animate && !reducedMotion.matches && document.startViewTransition) {
      transition = document.startViewTransition(apply);
    } else {
      apply();
    }
  }
  window.portfolioTheme = {
    isDark,
    toggle,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      transition?.skipTransition();
      preference = readPreference();
      apply();
    }
  });
  apply();
}

// Apply the saved preference before the browser paints the page.
export const themeHead = `<meta name="color-scheme" content="dark light"><script>(${initializeTheme.toString()})();</script>`;
