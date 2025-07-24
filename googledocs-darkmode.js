(function() {
  const STORAGE_KEY = 'googledocs-darkmode-enabled';

  // Inject stylesheet immediately, before DOM renders
  const style = document.createElement('style');
  style.id = 'gdocs-darkmode-styles';
  style.textContent = `
    html.gdocs-dark-mode {
      filter: invert(1) hue-rotate(180deg) brightness(0.85);
    }
    html.gdocs-dark-mode img,
    html.gdocs-dark-mode video,
    html.gdocs-dark-mode svg image,
    html.gdocs-dark-mode [style*="background-image"] {
      filter: invert(1) hue-rotate(180deg);
    }
    html.gdocs-dark-mode #gdocs-darkmode-toggle {
      filter: invert(1) hue-rotate(180deg);
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  // Apply dark mode class immediately if previously enabled
  let enabled = false;
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      enabled = true;
      document.documentElement.classList.add('gdocs-dark-mode');
    }
  } catch (e) {}

  // Defer toggle button to when the body exists
  let toggleBtn;

  function createToggle() {
    const btn = document.createElement('button');
    btn.id = 'gdocs-darkmode-toggle';
    btn.textContent = enabled ? '☀️' : '🌙';
    btn.title = 'Toggle Dark Mode';
    btn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: ${enabled ? '#222' : '#444'};
      color: white;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    `;
    btn.addEventListener('mouseenter', () => btn.style.background = '#666');
    btn.addEventListener('mouseleave', () => btn.style.background = enabled ? '#222' : '#444');
    btn.addEventListener('click', () => toggleDarkMode());
    document.body.appendChild(btn);
    return btn;
  }

  function applyDarkMode(on) {
    enabled = on;
    if (on) {
      document.documentElement.classList.add('gdocs-dark-mode');
      if (toggleBtn) {
        toggleBtn.textContent = '☀️';
        toggleBtn.style.background = '#222';
      }
    } else {
      document.documentElement.classList.remove('gdocs-dark-mode');
      if (toggleBtn) {
        toggleBtn.textContent = '🌙';
        toggleBtn.style.background = '#444';
      }
    }
    try {
      localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
    } catch (e) {}
  }

  function toggleDarkMode() {
    applyDarkMode(!enabled);
  }

  document.addEventListener('DOMContentLoaded', () => {
    toggleBtn = createToggle();
  });
})();
