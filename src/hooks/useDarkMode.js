// Dark mode preference — persisted to localStorage.
// Defaults to false (light mode) regardless of system setting.
// Applies/removes data-theme="dark" on the <html> element.

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'brl_dark_mode';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'true'; // default false if key absent
  } catch { return false; }
}

export function useDarkMode() {
  const [dark, setDark] = useState(load);

  useEffect(() => {
    const el = document.documentElement;
    if (dark) {
      el.setAttribute('data-theme', 'dark');
    } else {
      el.removeAttribute('data-theme');
    }
  }, [dark]);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return [dark, toggle];
}
