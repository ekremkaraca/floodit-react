import { useCallback, useEffect, useState } from 'react';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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
    setIsMounted(true);

    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved !== null ? saved === 'true' : prefersDark;

    setIsDarkMode(shouldBeDark);
    applyDarkMode(shouldBeDark);
  }, [applyDarkMode]);

  const toggleDarkMode = () => {
    if (!isMounted) return;

    setIsDarkMode((current) => {
      const next = !current;
      applyDarkMode(next);
      localStorage.setItem('darkMode', next.toString());
      return next;
    });
  };

  return { isDarkMode, toggleDarkMode, isMounted };
}
