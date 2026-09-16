/**
 * evaluationHistory.js — Historial real de evaluaciones (Fase C)
 *
 * Persiste las notas por eje (nota_ej1..4) y global de cada evaluación para
 * poder mostrar el progreso por competencia con datos reales. Funciones puras.
 */

export const EVALUATION_HISTORY_KEY = "ialab_evaluation_history";
export const MAX_EVAL_HISTORY = 60;
export const MAX_AXES = 4;

export function parseEvaluationHistory(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const normalizeAxes = (axes) =>
  Array.from({ length: MAX_AXES }, (_, i) => {
    const raw = Array.isArray(axes) ? axes[i] : undefined;
    if (raw === null || raw === undefined || raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  });

/**
 * Añade/actualiza la evaluación del módulo para una fecha (una por módulo/día).
 * @param {Array<object>} history
 * @param {{ moduleId: number|string, date: string, axes: number[], global: number }} entry
 * @returns {Array<object>}
 */
export function recordEvaluation(history, entry) {
  const list = parseEvaluationHistory(history);
  const record = {
    moduleId: entry.moduleId,
    date: entry.date,
    axes: normalizeAxes(entry.axes),
    global: Number.isFinite(Number(entry.global)) ? Number(entry.global) : 0,
  };

  const index = list.findIndex(
    (item) => item?.moduleId === record.moduleId && item?.date === record.date,
  );
  if (index >= 0) {
    const next = [...list];
    next[index] = record;
    return next;
  }

  const next = [...list, record];
  return next.length > MAX_EVAL_HISTORY
    ? next.slice(next.length - MAX_EVAL_HISTORY)
    : next;
}

/**
 * Promedio por eje (ignorando nulos) sobre todo el historial.
 * @param {Array<object>} history
 * @returns {{ averages: Array<number|null>, samples: number[] }}
 */
export function buildAxisAverages(history) {
  const list = parseEvaluationHistory(history);
  const samples = new Array(MAX_AXES).fill(0);
  const sums = new Array(MAX_AXES).fill(0);

  list.forEach((item) => {
    const axes = normalizeAxes(item?.axes);
    axes.forEach((value, i) => {
      if (value !== null) {
        samples[i] += 1;
        sums[i] += value;
      }
    });
  });

  const averages = sums.map((sum, i) =>
    samples[i] > 0 ? Math.round(sum / samples[i]) : null,
  );

  return { averages, samples };
}
