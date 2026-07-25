import {
  Home,
  BookOpen,
  PencilRuler,
  BarChart3,
  Gamepad2,
} from "lucide-react";

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
    Icon: Home,
    label: "Inicio",
    color: "#0096C7",
    gradient: "linear-gradient(135deg, #0077B6 0%, #00B4D8 60%, #48CAE4 100%)",
    glowColor: "#00B4D8",
    tabs: ["inicio"],
    premium: false,
  },
  {
    id: "learn",
    icon: "📚",
    Icon: BookOpen,
    label: "Aprender",
    color: "#06D6A0",
    gradient: "linear-gradient(135deg, #06D6A0 0%, #1B9AAA 60%, #118AB2 100%)",
    glowColor: "#06D6A0",
    tabs: ["materias", "curriculo", "libros", "podcast"],
    premium: false,
  },
  {
    id: "practice",
    icon: "✏️",
    Icon: PencilRuler,
    label: "Practicar",
    color: "#FF6B9D",
    gradient: "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)",
    glowColor: "#EF476F",
    tabs: ["escaner", "flashcards", "oral", "examenes"],
    premium: false,
  },
  {
    id: "progress",
    icon: "📊",
    Icon: BarChart3,
    label: "Progreso",
    color: "#FB8500",
    gradient: "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)",
    glowColor: "#FFB703",
    tabs: ["vak", "progreso", "analitica", "calendario"],
    premium: false,
  },
  {
    id: "explore",
    icon: "🎮",
    Icon: Gamepad2,
    label: "Explorar",
    color: "#9D4EDD",
    gradient: "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)",
    glowColor: "#C77DFF",
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
