/**
 * leaderboardPeriod.js — Ranking por período (Fase 4)
 *
 * Función pura para ordenar las entradas del leaderboard por XP global o por
 * XP de la semana. Aditiva: no altera el fetch ni el render existente.
 */

export const LEADERBOARD_PERIODS = ["global", "weekly"];

const xpFor = (entry, period) => {
  const raw = period === "weekly" ? entry?.weeklyXp : entry?.xp;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * @param {Array<object>} entries
 * @param {"global"|"weekly"} period
 * @returns {Array<object>} copia ordenada con `rank` y `rankedXp`
 */
export function rankEntries(entries, period = "global") {
  const list = Array.isArray(entries) ? entries : [];
  const safePeriod = LEADERBOARD_PERIODS.includes(period) ? period : "global";
  return list
    .map((entry) => ({ ...entry, rankedXp: xpFor(entry, safePeriod) }))
    .sort((a, b) => b.rankedXp - a.rankedXp)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
