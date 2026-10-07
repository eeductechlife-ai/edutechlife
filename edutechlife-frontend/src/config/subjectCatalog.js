/**
 * Catálogo único de materias de IngenIA.
 *
 * Aprender, Practicar, Retos, Notas, el escáner y el examen leen de aquí:
 * un id, un nombre, un emoji y un color por materia. Antes cada pantalla
 * tenía su propia lista (Historia salía como 🏛️ y como 📜; Inglés como 🌎 y
 * como 🇬🇧) y los retos no ofrecían Lenguaje ni Arte.
 *
 * - `curriculoId`: id en data/curriculo_col.json (DBA del MEN); null si la
 *   materia no tiene DBA (Arte).
 * - `core`: materias que siempre se ofrecen en los retos, haya o no DBA para
 *   el grado. Las demás (Química, Física…) solo si el grado tiene DBA.
 */

export const SUBJECT_CATALOG = [
  {
    id: "matematicas",
    label: "Matemáticas",
    emoji: "🔢",
    color: "#FB8500",
    challengeId: "math",
    curriculoId: "matematicas",
    core: true,
  },
  {
    id: "lenguaje",
    label: "Lenguaje",
    emoji: "📖",
    color: "#9D4EDD",
    challengeId: "language",
    curriculoId: "lenguaje",
    core: true,
  },
  {
    id: "ciencias",
    label: "Ciencias",
    emoji: "🔬",
    color: "#06D6A0",
    challengeId: "science",
    curriculoId: "ciencias",
    core: true,
  },
  {
    id: "sociales",
    label: "Sociales",
    emoji: "🌍",
    color: "#EF476F",
    challengeId: "social",
    curriculoId: "sociales",
    core: true,
  },
  {
    id: "historia",
    label: "Historia",
    emoji: "📜",
    color: "#EF476F",
    challengeId: "social",
    curriculoId: "sociales",
    core: false,
  },
  {
    id: "ingles",
    label: "Inglés",
    emoji: "🇬🇧",
    color: "#E9A800",
    challengeId: "english",
    curriculoId: "ingles",
    core: true,
  },
  {
    id: "arte",
    label: "Arte",
    emoji: "🎨",
    color: "#F72585",
    challengeId: "art",
    curriculoId: null,
    core: true,
  },
  {
    id: "quimica",
    label: "Química",
    emoji: "⚗️",
    color: "#E76F51",
    challengeId: "chemistry",
    curriculoId: "quimica",
    core: false,
  },
  {
    id: "fisica",
    label: "Física",
    emoji: "⚡",
    color: "#2A9D8F",
    challengeId: "physics",
    curriculoId: "fisica",
    core: false,
  },
  {
    id: "informatica",
    label: "Informática",
    emoji: "💻",
    color: "#0E7EA6",
    challengeId: "informatics",
    curriculoId: "informatica",
    core: false,
  },
  {
    id: "filosofia",
    label: "Filosofía",
    emoji: "🦉",
    color: "#6D4C94",
    challengeId: "philosophy",
    curriculoId: "filosofia",
    core: false,
  },
];

/** Otros nombres con los que llegan las materias (servidor, escáner, IA). */
const ALIASES = {
  ciencias_naturales: "ciencias",
  ciencias_sociales: "sociales",
  matematica: "matematicas",
};

const BY_ID = new Map(SUBJECT_CATALOG.map((s) => [s.id, s]));

export function getCatalogSubject(id) {
  if (!id) return null;
  const key = String(id).toLowerCase();
  return BY_ID.get(ALIASES[key] || key) || null;
}

/** Materias del catálogo que se muestran como lista simple (Aprender). */
export const LEARN_SUBJECT_IDS = [
  "matematicas",
  "lenguaje",
  "ciencias",
  "historia",
  "ingles",
  "arte",
];

/** Materias de los retos: id de reto, no de catálogo (math, language…). */
export const CHALLENGE_SUBJECTS = SUBJECT_CATALOG.filter(
  (s) => s.id !== "historia",
).map((s) => ({
  id: s.challengeId,
  label: s.label,
  emoji: s.emoji,
  color: s.color,
  core: s.core,
  curriculoId: s.curriculoId,
}));
