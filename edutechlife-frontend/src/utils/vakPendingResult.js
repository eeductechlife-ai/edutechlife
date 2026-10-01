import { safeStorage } from "./storage";

// Resultado del ADN de Aprendizaje hecho en el sitio, guardado SOLO en este
// dispositivo para que la persona pueda traerlo a IngenIA al entrar. No lleva
// nombre, edad ni datos de contacto, y caduca a los 30 días.
const KEY = "edutechlife_vak_pending";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const STYLES = ["visual", "auditivo", "kinestesico"];

const isPercent = (n) => Number.isFinite(n) && n >= 0 && n <= 100;

const isValid = (r) =>
  !!r &&
  STYLES.includes(r.predominantStyle) &&
  (r.secondaryStyle == null || STYLES.includes(r.secondaryStyle)) &&
  !!r.scores &&
  STYLES.every((s) => isPercent(r.scores[s])) &&
  Number.isFinite(r.savedAt);

export function savePendingVakResult({
  scores,
  predominantStyle,
  secondaryStyle,
}) {
  const record = {
    scores: {
      visual: scores.visual,
      auditivo: scores.auditivo,
      kinestesico: scores.kinestesico,
    },
    predominantStyle,
    secondaryStyle: secondaryStyle || null,
    savedAt: Date.now(),
  };
  if (!isValid(record)) return false;
  return safeStorage.setItem(KEY, JSON.stringify(record));
}

export function readPendingVakResult(now = Date.now()) {
  const raw = safeStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (isValid(parsed) && now - parsed.savedAt < TTL_MS) return parsed;
  } catch {
    // cae al borrado de abajo
  }
  safeStorage.removeItem(KEY);
  return null;
}

export function clearPendingVakResult() {
  safeStorage.removeItem(KEY);
}
