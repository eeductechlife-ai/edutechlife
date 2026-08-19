/**
 * Subject emoji mappings with fallback support
 * Maps subject names (various formats) to emojis
 * Supports both hardcoded and dynamic subjects
 */

const SUBJECT_EMOJI_MAP = {
  // Exact matches (case-insensitive)
  matemática: "🔢",
  matematicas: "🔢",
  "matemática-geometría": "🔢",
  geometría: "📐",
  geometria: "📐",

  lenguaje: "📖",
  "lengua castellana": "📖",
  "lecto-escritura": "📖",
  lectura: "📖",
  escritura: "✍️",

  ciencias: "🔬",
  "ciencias naturales": "🔬",
  "química-física": "⚗️",
  química: "⚗️",
  fisica: "⚛️",
  biología: "🧬",
  biologia: "🧬",

  sociales: "🌍",
  "ciencias sociales": "🌍",
  historia: "📜",
  geografía: "🗺️",
  geografia: "🗺️",

  inglés: "🇬🇧",
  ingles: "🇬🇧",
  english: "🇬🇧",

  arte: "🎨",
  "educación artística": "🎨",
  "educacion artistica": "🎨",
  música: "🎵",
  musica: "🎵",

  "educación física": "⚽",
  "educacion fisica": "⚽",
  "ed. física": "⚽",
  "ed. fisica": "⚽",
  deportes: "🏃",

  tecnología: "💻",
  tecnologia: "💻",
  informática: "💻",
  informatica: "💻",
  sistemas: "⚙️",

  filosofía: "🤔",
  filosofia: "🤔",

  religión: "✝️",
  religion: "✝️",
  "educación religiosa": "✝️",
  "educacion religiosa": "✝️",

  ética: "⚖️",
  etica: "⚖️",
  "educación ética": "⚖️",
  "educacion etica": "⚖️",
  valores: "💎",
  civismo: "🏛️",

  "educación sexual ambiental": "🌱",
  "eco amor": "🌍",
  ecología: "🌲",
  ecologia: "🌲",
  ambiental: "🌿",

  "competencias ciudadanas": "👥",
  ciudadanía: "🏛️",
  ciudadania: "🏛️",

  psicología: "🧠",
  psicologia: "🧠",
};

/**
 * Get emoji for a subject name
 * Returns appropriate emoji or default fallback
 */
export function getSubjectEmoji(subjectName) {
  if (!subjectName) return "📚";

  const normalized = subjectName.toLowerCase().trim();

  // Exact match
  if (SUBJECT_EMOJI_MAP[normalized]) {
    return SUBJECT_EMOJI_MAP[normalized];
  }

  // Partial match (check if normalized is contained in any key)
  for (const [key, emoji] of Object.entries(SUBJECT_EMOJI_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return emoji;
    }
  }

  // Fallback based on keywords
  if (normalized.includes("matemat")) return "🔢";
  if (normalized.includes("lengua") || normalized.includes("lenguaje"))
    return "📖";
  if (normalized.includes("ciencia")) return "🔬";
  if (normalized.includes("social")) return "🌍";
  if (normalized.includes("inglés") || normalized.includes("ingles"))
    return "🇬🇧";
  if (normalized.includes("arte")) return "🎨";
  if (normalized.includes("física") || normalized.includes("fisica"))
    return "⚛️";
  if (normalized.includes("educación") || normalized.includes("educacion"))
    return "🎓";
  if (normalized.includes("tecnolog")) return "💻";
  if (normalized.includes("filosofi")) return "🤔";

  return "📚"; // Default fallback
}

/**
 * Create subject object from name and score
 * Supports dynamic subjects - not limited to predefined list
 */
export function createSubject(name, score = null) {
  return {
    v: name, // keep raw name so grade.subject matches select value directly
    l: name,
    i: getSubjectEmoji(name),
    ...(score !== null && { score }),
  };
}

/**
 * Normalize a list of subjects
 * Removes duplicates, sorts alphabetically
 */
export function normalizeSubjects(subjectNames) {
  if (!Array.isArray(subjectNames)) return [];

  const seen = new Set();
  return subjectNames
    .filter((name) => {
      if (!name || typeof name !== "string") return false;
      const normalized = name.toLowerCase().trim();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    })
    .map((name) => createSubject(name))
    .sort((a, b) => a.l.localeCompare(b.l));
}

export default {
  getSubjectEmoji,
  createSubject,
  normalizeSubjects,
};
