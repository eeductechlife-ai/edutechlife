import { SUBJECT_CATALOG } from "../../../config/subjectCatalog";

// Un solo catálogo (config/subjectCatalog.js); aquí solo se indexa por id y
// por los nombres alternos con los que llegan las materias del servidor.
const metaOf = (subject) => ({
  emoji: subject.emoji,
  color: subject.color,
  label: subject.label,
  challengeId: subject.challengeId,
});

export const SUBJECT_META = {
  ...Object.fromEntries(SUBJECT_CATALOG.map((s) => [s.id, metaOf(s)])),
  ciencias_naturales: metaOf(SUBJECT_CATALOG.find((s) => s.id === "ciencias")),
  ciencias_sociales: metaOf(SUBJECT_CATALOG.find((s) => s.id === "sociales")),
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
