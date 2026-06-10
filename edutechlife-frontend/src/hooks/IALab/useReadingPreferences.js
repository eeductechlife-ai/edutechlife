import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ialab_reading_prefs';

const DEFAULTS = {
  fontSize: 16,
  theme: 'light',
  fontFamily: 'sans',
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function persistPrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {}
}

export function useReadingPreferences() {
  const [prefs, setPrefs] = useState(loadPrefs);

  useEffect(() => {
    persistPrefs(prefs);
  }, [prefs]);

  const setFontSize = useCallback((size) => {
    setPrefs(prev => ({ ...prev, fontSize: Math.max(12, Math.min(32, size)) }));
  }, []);

  const setTheme = useCallback((theme) => {
    setPrefs(prev => ({ ...prev, theme }));
  }, []);

  const setFontFamily = useCallback((fontFamily) => {
    setPrefs(prev => ({ ...prev, fontFamily }));
  }, []);

  const resetDefaults = useCallback(() => {
    setPrefs(DEFAULTS);
  }, []);

  return { ...prefs, setFontSize, setTheme, setFontFamily, resetDefaults };
}
