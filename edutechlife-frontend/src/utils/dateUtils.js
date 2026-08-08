const LOCALE_MAP = { en: "en-US", pt: "pt-BR", es: "es-ES" };

export function formatDate(date, locale = "es", options = {}) {
  const lang = LOCALE_MAP[locale] || "es-ES";
  return new Date(date).toLocaleDateString(lang, options);
}

export function formatDateTime(date, locale = "es", options = {}) {
  const lang = LOCALE_MAP[locale] || "es-ES";
  return new Date(date).toLocaleString(lang, options);
}

export function formatDateShort(date, locale = "es") {
  return formatDate(date, locale, { month: "short", day: "numeric" });
}

export function formatDateFull(date, locale = "es") {
  return formatDate(date, locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
