/**
 * competencyAnalytics.js — Analítica de aprendizaje por competencia (Fase 6)
 *
 * Agrega el avance por módulo en niveles de competencia (explorador, creador,
 * experto) para dashboards de progreso. Función pura y aditiva: no toca estado.
 */
import { getCompetenceLevel } from "../components/IALab/competenceLevel.js";

const clampScore = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
};

/**
 * @param {Array<{ id: number|string, score: number }>} moduleScores
 * @returns {{
 *   modules: Array<{ id: number|string, score: number, level: string }>,
 *   overall: { average: number, level: string },
 *   distribution: { explorer: number, creator: number, expert: number },
 *   strongest: (null | { id: number|string, score: number, level: string }),
 *   weakest: (null | { id: number|string, score: number, level: string }),
 * }}
 */
export function analyzeCompetence(moduleScores) {
  const list = Array.isArray(moduleScores) ? moduleScores : [];

  const modules = list.map((m) => {
    const score = clampScore(m?.score);
    return { id: m?.id, score, level: getCompetenceLevel(score).key };
  });

  const distribution = { explorer: 0, creator: 0, expert: 0 };
  modules.forEach((m) => {
    if (distribution[m.level] !== undefined) distribution[m.level] += 1;
  });

  const average = modules.length
    ? Math.round(modules.reduce((sum, m) => sum + m.score, 0) / modules.length)
    : 0;

  let strongest = null;
  let weakest = null;
  modules.forEach((m) => {
    if (strongest === null || m.score > strongest.score) strongest = m;
    if (weakest === null || m.score < weakest.score) weakest = m;
  });

  return {
    modules,
    overall: { average, level: getCompetenceLevel(average).key },
    distribution,
    strongest,
    weakest,
  };
}
