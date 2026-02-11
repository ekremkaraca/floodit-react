import { useCallback, useEffect, useState } from 'react';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return saved !== null ? saved === 'true' : prefersDark;
  });
  const [isMounted] = useState(true);

  const applyDarkMode = useCallback((enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, []);

  useEffect(() => {
    applyDarkMode(isDarkMode);
  }, [applyDarkMode, isDarkMode]);

  const toggleDarkMode = () => {
    if (!isMounted) return;

    setIsDarkMode((current) => {
      const next = !current;
      localStorage.setItem('darkMode', next.toString());
      return next;
    });
  };

  return { isDarkMode, toggleDarkMode, isMounted };
}
