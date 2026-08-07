export const LEVEL_CONFIG = [
  { minLevel: 1, maxLevel: 3, rank: "Novato", emoji: "🐣", color: "#94A3B8" },
  { minLevel: 4, maxLevel: 7, rank: "Aprendiz", emoji: "📘", color: "#4DA8C4" },
  {
    minLevel: 8,
    maxLevel: 12,
    rank: "Intermedio",
    emoji: "⚡",
    color: "#F59E0B",
  },
  {
    minLevel: 13,
    maxLevel: 18,
    rank: "Avanzado",
    emoji: "🚀",
    color: "#10B981",
  },
  {
    minLevel: 19,
    maxLevel: 25,
    rank: "Experto",
    emoji: "👑",
    color: "#F97316",
  },
  {
    minLevel: 26,
    maxLevel: Infinity,
    rank: "Mentor",
    emoji: "🧠",
    color: "#8B5CF6",
  },
];

export const LEVEL_CONFIG_PT = [
  { minLevel: 1, maxLevel: 3, rank: "Novato", emoji: "🐣", color: "#94A3B8" },
  { minLevel: 4, maxLevel: 7, rank: "Aprendiz", emoji: "📘", color: "#4DA8C4" },
  {
    minLevel: 8,
    maxLevel: 12,
    rank: "Intermediário",
    emoji: "⚡",
    color: "#F59E0B",
  },
  {
    minLevel: 13,
    maxLevel: 18,
    rank: "Avançado",
    emoji: "🚀",
    color: "#10B981",
  },
  {
    minLevel: 19,
    maxLevel: 25,
    rank: "Especialista",
    emoji: "👑",
    color: "#F97316",
  },
  {
    minLevel: 26,
    maxLevel: Infinity,
    rank: "Mentor",
    emoji: "🧠",
    color: "#8B5CF6",
  },
];

export function getCourseRank(level) {
  const numericLevel = typeof level === "string" ? parseInt(level, 10) : level;
  const safeLevel = Number.isFinite(numericLevel)
    ? Math.max(1, numericLevel)
    : 1;
  const tier = LEVEL_CONFIG.find(
    (t) => safeLevel >= t.minLevel && safeLevel <= t.maxLevel,
  );
  return tier || LEVEL_CONFIG[0];
}
