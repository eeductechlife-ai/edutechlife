export const CATEGORY_MAP = {
  inicio: "home",
  materias: "learn",
  curriculo: "learn",
  libros: "learn",
  podcast: "learn",
  examenes: "practice",
  flashcards: "practice",
  oral: "practice",
  escaner: "practice",
  vak: "progress",
  progreso: "progress",
  analitica: "progress",
  calendario: "progress",
  misiones: "explore",
  actividades: "explore",
  noticias: "explore",
};

export const CATEGORIES = [
  {
    id: "home",
    icon: "🏠",
    label: "Inicio",
    color: "#4DA8C4",
    tabs: ["inicio"],
    premium: false,
  },
  {
    id: "learn",
    icon: "📚",
    label: "Aprender",
    color: "#66CCCC",
    tabs: ["materias", "curriculo", "libros", "podcast"],
    premium: false,
  },
  {
    id: "practice",
    icon: "✏️",
    label: "Practicar",
    color: "#FF6B9D",
    tabs: ["escaner", "flashcards", "oral", "examenes"],
    premium: false,
  },
  {
    id: "progress",
    icon: "📊",
    label: "Progreso",
    color: "#FFD166",
    tabs: ["vak", "progreso", "analitica", "calendario"],
    premium: false,
  },
  {
    id: "explore",
    icon: "🎮",
    label: "Explorar",
    color: "#A855F7",
    tabs: ["misiones", "actividades", "noticias"],
    premium: false,
  },
];

export const CATEGORY_TAB_LABELS = {
  materias: "Materias",
  curriculo: "Currículo",
  libros: "Libros",
  podcast: "Podcast",
  examenes: "Exámenes",
  flashcards: "Flashcards",
  oral: "Oral",
  escaner: "Escáner",
  vak: "VAK",
  progreso: "Progreso",
  analitica: "Analítica",
  calendario: "Calendario",
  misiones: "Misiones",
  actividades: "Actividades",
  noticias: "Noticias",
  inicio: "Inicio",
};

export const PREMIUM_TABS = ["libros", "noticias", "analitica"];

export const TOP_BAR_LABELS = {
  inicio: "Inicio",
  materias: "Materias",
  curriculo: "Currículo",
  libros: "Libros Intel.",
  podcast: "Podcast",
  examenes: "Exámenes",
  flashcards: "Flashcards",
  oral: "Oral",
  escaner: "Escáner",
  vak: "Diagnóstico VAK",
  progreso: "Progreso",
  analitica: "Analítica",
  calendario: "Calendario",
  misiones: "Misiones",
  actividades: "Actividades",
  noticias: "Noticias",
};

export const PREMIUM_FEATURES = {
  libros: {
    icon: "📖",
    title: "SmartBook Reader",
    description:
      "Analiza textos con IA, extrae conceptos clave y organiza tu aprendizaje visualmente. Disponible solo en plan Premium.",
  },
  noticias: {
    icon: "📰",
    title: "Noticias Tech",
    description:
      "Mantente al día con noticias personalizadas de tecnología, ciencia e innovación. Disponible solo en plan Premium.",
  },
  padres: {
    icon: "👨‍👩‍👧",
    title: "Panel para Padres",
    description:
      "Seguimiento en tiempo real del progreso académico y emocional de tu hijo. Disponible solo en plan Premium.",
  },
  analitica: {
    icon: "📈",
    title: "Analítica Avanzada",
    description:
      "Métricas detalladas de rendimiento, predicciones y hábitos de estudio. Disponible solo en plan Premium.",
  },
};
