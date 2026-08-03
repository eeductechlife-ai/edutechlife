import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { safeStorage } from '../utils/storage';

const THEME_KEY = 'edutechlife-theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [forceLightMode, setForceLightMode] = useState(false);

  useEffect(() => {
    const storedTheme = safeStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(storedTheme === 'dark' || (!storedTheme && prefersDark));
  }, []);

  useEffect(() => {
    const shouldApplyDark = isDarkMode && !forceLightMode;
    document.documentElement.classList.toggle('dark', shouldApplyDark);
  }, [isDarkMode, forceLightMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      safeStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, forceLightMode, setForceLightMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

export function useLightModeOnly() {
  const { setForceLightMode } = useTheme();

  useEffect(() => {
    setForceLightMode(true);
    return () => setForceLightMode(false);
  }, [setForceLightMode]);
}
