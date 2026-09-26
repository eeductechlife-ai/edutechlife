export const SUBJECT_META = {
  matematicas: {
    emoji: "🔢",
    color: "#FB8500",
    label: "Matemáticas",
    challengeId: "math",
  },
  lenguaje: {
    emoji: "📖",
    color: "#9D4EDD",
    label: "Lenguaje",
    challengeId: "language",
  },
  ciencias: {
    emoji: "🔬",
    color: "#06D6A0",
    label: "Ciencias",
    challengeId: "science",
  },
  ciencias_naturales: {
    emoji: "🔬",
    color: "#06D6A0",
    label: "Ciencias",
    challengeId: "science",
  },
  sociales: {
    emoji: "🌍",
    color: "#EF476F",
    label: "Sociales",
    challengeId: "social",
  },
  ciencias_sociales: {
    emoji: "🌍",
    color: "#EF476F",
    label: "Sociales",
    challengeId: "social",
  },
  historia: {
    emoji: "📜",
    color: "#EF476F",
    label: "Historia",
    challengeId: "social",
  },
  ingles: {
    emoji: "🇬🇧",
    color: "#E9A800",
    label: "Inglés",
    challengeId: "english",
  },
  arte: { emoji: "🎨", color: "#F72585", label: "Arte" },
  quimica: {
    emoji: "⚗️",
    color: "#E76F51",
    label: "Química",
    challengeId: "chemistry",
  },
  fisica: {
    emoji: "⚡",
    color: "#2A9D8F",
    label: "Física",
    challengeId: "physics",
  },
  informatica: {
    emoji: "💻",
    color: "#118AB2",
    label: "Informática",
    challengeId: "informatics",
  },
  filosofia: {
    emoji: "🦉",
    color: "#6D4C94",
    label: "Filosofía",
    challengeId: "philosophy",
  },
};

export const CONTENT_TYPES = [
  {
    id: "resumen",
    label: "Resumen",
    emoji: "📄",
    desc: "Lo más importante, fácil de leer",
  },
  {
    id: "mapa",
    label: "Mapa mental",
    emoji: "🧠",
    desc: "Una imagen con las ideas",
  },
  {
    id: "infografia",
    label: "Infografía",
    emoji: "🖼️",
    desc: "Un póster para aprender",
  },
  {
    id: "ejercicios",
    label: "Ejercicios",
    emoji: "✏️",
    desc: "Con pistas y respuestas",
  },
  { id: "video", label: "Videos", emoji: "🎬", desc: "Qué buscar en YouTube" },
];

export const WEAK_GRADE = 3.5;
export const WEAK_PROGRESS = 50;

// Normalizes context subjects into what the hub renders; weak subjects first.
export function buildSubjectList(subjectsWithGrades) {
  const list = (subjectsWithGrades || []).map((s) => {
    const id = s.id || s.subject;
    const meta = SUBJECT_META[id] || {};
    const score = s.gradeScore != null ? Number(s.gradeScore) : null;
    const hasData = score != null || (s.progress != null && s.progress > 0);
    const weak =
      (score != null && score < WEAK_GRADE) ||
      (score == null && hasData && s.progress < WEAK_PROGRESS);
    return {
      id,
      label: meta.label || s.name || id,
      emoji: meta.emoji || s.icon || "📚",
      color: meta.color || s.color || "#9D4EDD",
      challengeId: meta.challengeId || null,
      score,
      progress:
        score != null ? Math.round((score / 5) * 100) : (s.progress ?? 0),
      hasData,
      weak,
      trend: s.trend || null,
    };
  });
  return list.sort((a, b) => Number(b.weak) - Number(a.weak));
}
