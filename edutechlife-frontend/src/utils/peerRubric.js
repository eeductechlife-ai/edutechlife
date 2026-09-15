/**
 * peerRubric.js — Rúbrica y puntaje del Peer Review (Fase B)
 *
 * Funciones puras para definir la rúbrica, validar las notas y calcular el
 * puntaje ponderado. Aditivo: no toca Supabase ni la UI.
 */

export const DEFAULT_PEER_RUBRIC = [
  { id: "clarity", label: "Claridad", weight: 25, max: 4 },
  { id: "depth", label: "Profundidad", weight: 30, max: 4 },
  { id: "originality", label: "Originalidad", weight: 25, max: 4 },
  { id: "structure", label: "Estructura", weight: 20, max: 4 },
];

const clamp = (value, max) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(max, n));
};

/**
 * Puntaje ponderado 0..100.
 * @param {Record<string, number>} scores
 * @param {Array<{ id: string, weight: number, max: number }>} [criteria]
 * @returns {number}
 */
export function computePeerScore(scores, criteria = DEFAULT_PEER_RUBRIC) {
  const list = Array.isArray(criteria) ? criteria : [];
  if (list.length === 0) return 0;

  const totalWeight = list.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  if (totalWeight <= 0) return 0;

  const earned = list.reduce((sum, c) => {
    const max = Number(c.max) || 0;
    if (max <= 0) return sum;
    const value = clamp(scores?.[c.id], max);
    return sum + (value / max) * (Number(c.weight) || 0);
  }, 0);

  return Math.round((earned / totalWeight) * 100);
}

/**
 * @param {Record<string, number>} scores
 * @param {Array<{ id: string }>} [criteria]
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validatePeerScores(scores, criteria = DEFAULT_PEER_RUBRIC) {
  const list = Array.isArray(criteria) ? criteria : [];
  const missing = list
    .filter((c) => {
      const n = Number(scores?.[c.id]);
      return !Number.isFinite(n);
    })
    .map((c) => c.id);
  return { valid: missing.length === 0, missing };
}
