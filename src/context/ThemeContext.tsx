import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('qaswa_theme') as ThemeMode;
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light'; // Default: The website should initially use Light Mode
    } catch (e) {
      return 'light';
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('qaswa_theme') as ThemeMode;
      return saved === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let isDark = false;
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'light') {
        isDark = false;
      } else {
        isDark = mediaQuery.matches;
      }

      setResolvedTheme(isDark ? 'dark' : 'light');
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    try {
      localStorage.setItem('qaswa_theme', theme);
    } catch (e) {}

    const listener = () => {
      if (theme === 'system') applyTheme();
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem('qaswa_theme', mode);
    } catch (e) {}
  };

  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark') || resolvedTheme === 'dark';
    const nextTheme: ThemeMode = isCurrentlyDark ? 'light' : 'dark';
    const root = document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('qaswa_theme', nextTheme);
    } catch (e) {}
    setThemeState(nextTheme);
    setResolvedTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
