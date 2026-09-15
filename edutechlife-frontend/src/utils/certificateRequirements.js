/**
 * certificateRequirements.js — Requisitos de certificación (Fase A1)
 *
 * Regla documentada del curso:
 *   1) Completar los 5 módulos.
 *   2) Obtener 80% o más en cada módulo (examen/desafío/recursos/comunidad).
 *   3) Cumplir 80% o más de progreso global.
 *
 * Función pura y aditiva: no altera el estado ni la generación actual; solo
 * evalúa si se cumplen los requisitos.
 */

export const CERT_REQUIREMENTS = {
  requiredModules: 5,
  moduleMinScore: 80,
  globalMinScore: 80,
};

const toScore = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

/**
 * @param {{
 *   moduleScores?: number[],
 *   courseProgress?: number,
 *   completedModules?: Array<number|string>,
 * }} [input]
 * @returns {{
 *   eligible: boolean,
 *   checks: { fiveModules: boolean, allModulesPassed: boolean, globalProgress: boolean },
 *   scores: number[],
 *   globalProgress: number,
 * }}
 */
export function evaluateCertificateRequirements(input = {}) {
  const { moduleScores, courseProgress, completedModules } = input;

  const scores = Array.from({ length: CERT_REQUIREMENTS.requiredModules }, (_, i) =>
    toScore(Array.isArray(moduleScores) ? moduleScores[i] : undefined),
  );

  const completed = new Set(completedModules || []);
  const fiveModules = Array.from(
    { length: CERT_REQUIREMENTS.requiredModules },
    (_, i) => i + 1,
  ).every((id) => completed.has(id));

  const allModulesPassed = scores.every(
    (score) => score >= CERT_REQUIREMENTS.moduleMinScore,
  );

  const globalProgress = toScore(courseProgress);
  const globalProgressOk = globalProgress >= CERT_REQUIREMENTS.globalMinScore;

  return {
    eligible: fiveModules && allModulesPassed && globalProgressOk,
    checks: { fiveModules, allModulesPassed, globalProgress: globalProgressOk },
    scores,
    globalProgress,
  };
}
