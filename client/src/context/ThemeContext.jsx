import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

/**
 * Resolves the effective theme ('light' | 'dark') from a preference
 * that may include 'system'.
 */
function resolveTheme(preference) {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return preference;
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    return settings.theme || 'dark';
  });

  const effectiveTheme = resolveTheme(preference);

  // Apply the class to <html> so Tailwind `dark:` and CSS vars work
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', effectiveTheme === 'dark');
    root.classList.toggle('light', effectiveTheme === 'light');
  }, [effectiveTheme]);

  // Listen for OS theme changes when preference is 'system'
  useEffect(() => {
    if (preference !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const root = document.documentElement;
      const resolved = mq.matches ? 'dark' : 'light';
      root.classList.toggle('dark', resolved === 'dark');
      root.classList.toggle('light', resolved === 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference]);

  const setTheme = useCallback((newTheme) => {
    setPreference(newTheme);
    // Persist into the same userSettings key the Settings page uses
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    settings.theme = newTheme;
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: preference, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeContext;
