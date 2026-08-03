import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

const localeModules = {
  es: () => import("./es.json"),
  en: () => import("./en.json"),
  pt: () => import("./pt.json"),
};
const STORAGE_KEY = "edutechlife_locale";
const SUPPORTED_LOCALES = ["es", "en", "pt"];

const getInitialLocale = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED_LOCALES.includes(stored)) return stored;
    return "es";
  } catch {
    return "es";
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
    throw new Error("useTranslation debe usarse dentro de I18nProvider");
  }
  return ctx;
};

export const I18nProvider = ({ children }) => {
  const [locale, setLocaleState] = useState(getInitialLocale);
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    localeModules[locale]()
      .then((mod) => setTranslations(mod.default || mod))
      .catch(() => setTranslations(null));
  }, [locale]);

  const setLocale = useCallback((lang) => {
    setLocaleState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, []);

  const t = useCallback(
    (key, params) => {
      if (!translations) return key;
      const value = translations[key];
      if (value === undefined) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[i18n] Missing translation key: ${key} for locale: ${locale}`,
          );
        }
        return key;
      }
      return interpolate(value, params);
    },
    [translations, locale],
  );

  const pluralize = useCallback(
    (key, count, params) => {
      if (!translations) return key;
      const pluralKey = count === 1 ? key : `${key}_plural`;
      const value = translations[pluralKey];
      if (value === undefined) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[i18n] Missing translation key: ${pluralKey} for locale: ${locale}`,
          );
        }
        return `${key}:${count}`;
      }
      return interpolate(value, { ...params, count });
    },
    [translations, locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, pluralize }),
    [locale, setLocale, t, pluralize],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
