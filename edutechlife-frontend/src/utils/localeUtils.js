/**
 * Utilidades de localización compartidas.
 *
 * El idioma original de la plataforma es español. Inglés y portugués son
 * idiomas de soporte. Para el contenido educativo (lecciones, exámenes, OVAs,
 * recursos, prompts) se usa un patrón { es, en, pt }: se elige el idioma
 * activo, y si no existe versión en ese idioma se hace fallback en este orden:
 *   pt → en → es
 */

export const SUPPORTED_LOCALES = ["es", "en", "pt"];
export const DEFAULT_LOCALE = "es";
export const LOCALE_STORAGE_KEY = "edutechlife_locale";

/**
 * Lee el locale activo desde localStorage. Fuera del navegador devuelve "es".
 * Usar esta función en lugar de leer localStorage directamente: es tolerante
 * a errores y al SSR.
 */
export const getCurrentLocale = () => {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (SUPPORTED_LOCALES.includes(stored)) return stored;
  } catch {
    /* localStorage no disponible */
  }
  return DEFAULT_LOCALE;
};

/**
 * Resuelve el contenido localizado con fallback.
 * @param {{ es?: *, en?: *, pt?: * }} contentMap
 * @param {string} [locale] - Locale activo (por defecto el de localStorage)
 * @param {string} [fallbackLocale] - Primera opción de fallback (por defecto "en")
 * @returns {*} Contenido en el idioma activo, o fallback en cascada, o null.
 */
export const resolveLocalized = (contentMap, locale, fallbackLocale = "en") => {
  if (!contentMap) return null;
  const loc = locale || getCurrentLocale();

  if (contentMap[loc] != null) return contentMap[loc];

  // Fallback en cascada: pt → en → es (pt no está siempre traducido).
  const fallbackOrder = [
    fallbackLocale,
    ...SUPPORTED_LOCALES.filter((l) => l !== loc && l !== fallbackLocale),
  ];
  for (const l of fallbackOrder) {
    if (contentMap[l] != null) return contentMap[l];
  }
  return null;
};
