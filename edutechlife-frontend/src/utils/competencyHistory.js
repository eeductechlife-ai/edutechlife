/**
 * competencyHistory.js — Historial de competencia (Fase C)
 *
 * Persiste una pequeña serie temporal (un punto por cambio relevante de
 * puntaje, máximo uno por día) para graficar la evolución del estudiante.
 * Funciones puras: no tocan localStorage ni el store.
 */

export const COMPETENCY_HISTORY_KEY = "ialab_competency_history";
export const MAX_HISTORY = 60;

export function parseHistory(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Añade/actualiza el punto del día. Un solo punto por fecha; se reemplaza si
 * el promedio cambió. Recorta a MAX_HISTORY (los más recientes al final).
 * @param {Array<object>} history
 * @param {{ date: string, average: number, scores?: number[] }} snapshot
 * @returns {Array<object>}
 */
export function recordSnapshot(history, snapshot) {
  const list = parseHistory(history);
  const entry = {
    date: snapshot.date,
    average: Number.isFinite(Number(snapshot.average)) ? Number(snapshot.average) : 0,
    scores: Array.isArray(snapshot.scores) ? snapshot.scores : [],
  };

  const existingIndex = list.findIndex((item) => item?.date === entry.date);
  if (existingIndex >= 0) {
    const previous = list[existingIndex];
    if (previous?.average === entry.average) return list;
    const next = [...list];
    next[existingIndex] = entry;
    return next;
  }

  const next = [...list, entry];
  return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
}

/**
 * Puntos listos para graficar, en orden cronológico ascendente.
 * @param {Array<object>} history
 * @returns {Array<{ date: string, average: number }>}
 */
export function buildTrend(history) {
  return parseHistory(history)
    .filter((item) => item && item.date)
    .map((item) => ({
      date: item.date,
      average: Number.isFinite(Number(item.average)) ? Number(item.average) : 0,
    }))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}
