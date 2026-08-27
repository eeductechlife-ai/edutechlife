export const getSubjects = (t) => [
  {
    id: "matematicas",
    label: t("oral.subject_matematicas"),
    icon: "🔢",
    color: "#4DA8C4",
  },
  {
    id: "lenguaje",
    label: t("oral.subject_lenguaje"),
    icon: "📖",
    color: "#FF6B9D",
  },
  {
    id: "ciencias",
    label: t("oral.subject_ciencias"),
    icon: "🔬",
    color: "#66CCCC",
  },
  {
    id: "sociales",
    label: t("oral.subject_sociales"),
    icon: "🌍",
    color: "#FFD166",
  },
  {
    id: "ingles",
    label: t("oral.subject_ingles"),
    icon: "🇬🇧",
    color: "#A855F7",
  },
];

export const getDifficulties = (t) => [
  {
    id: "facil",
    label: t("oral.difficulty_facil"),
    color: "#22C55E",
    icon: "🌱",
  },
  {
    id: "medio",
    label: t("oral.difficulty_medio"),
    color: "#EAB308",
    icon: "🔥",
  },
  {
    id: "dificil",
    label: t("oral.difficulty_dificil"),
    color: "#EF4444",
    icon: "💀",
  },
];

// Dark-mode color helper
export const dc = (dm, light, dark) => (dm ? dark : light);
