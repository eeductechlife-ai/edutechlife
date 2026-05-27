import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import es from './es.json';
import en from './en.json';

const LOCALES = { es, en };
const STORAGE_KEY = 'edutechlife_locale';

const getInitialLocale = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'es' || stored === 'en') return stored;
    const browserLang = navigator.language?.startsWith('es') ? 'es' : 'en';
    return browserLang;
  } catch {
    return 'es';
  }
};

const interpolate = (str, params) => {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
};

export const I18nContext = createContext(null);

export const useTranslation = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation debe usarse dentro de I18nProvider');
  }
  return ctx;
};

export const I18nProvider = ({ children }) => {
  const [locale, setLocaleState] = useState(getInitialLocale);

  const setLocale = useCallback((lang) => {
    setLocaleState(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }, []);

  const translations = LOCALES[locale] || es;

  const t = useCallback((key, params) => {
    const value = translations[key];
    if (value === undefined) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] Missing translation key: ${key} for locale: ${locale}`);
      }
      return key;
    }
    return interpolate(value, params);
  }, [translations, locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};
