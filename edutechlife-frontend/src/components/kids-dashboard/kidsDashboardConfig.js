import { Home, BookOpen, PencilRuler, BarChart3, Gamepad2 } from "lucide-react";

export const CATEGORY_MAP = {
  inicio: "home",
  materias: "learn",
  flashcards: "practice",
  oral: "practice",
  examenes: "practice",
  vak: "progress",
  progreso: "progress",
  misiones: "explore",
};

export const CATEGORIES = [
  {
    id: "home",
    Icon: Home,
    label: "Inicio",
    color: "#0096C7",
    gradient: "linear-gradient(135deg, #0077B6 0%, #00B4D8 60%, #48CAE4 100%)",
    glowColor: "#00B4D8",
    tabs: ["inicio"],
  },
  {
    id: "learn",
    Icon: BookOpen,
    label: "Aprender",
    color: "#06D6A0",
    gradient: "linear-gradient(135deg, #06D6A0 0%, #1B9AAA 60%, #118AB2 100%)",
    glowColor: "#06D6A0",
    tabs: ["materias"],
  },
  {
    id: "practice",
    Icon: PencilRuler,
    label: "Practicar",
    color: "#FF6B9D",
    gradient: "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)",
    glowColor: "#EF476F",
    tabs: ["flashcards", "oral", "examenes"],
  },
  {
    id: "progress",
    Icon: BarChart3,
    label: "Progreso",
    color: "#FB8500",
    gradient: "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)",
    glowColor: "#FFB703",
    tabs: ["vak", "progreso"],
  },
  {
    id: "explore",
    Icon: Gamepad2,
    label: "Explorar",
    color: "#9D4EDD",
    gradient: "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)",
    glowColor: "#C77DFF",
    tabs: ["misiones"],
  },
];

export const CATEGORY_TAB_LABELS = {
  materias: "Materias",
  examenes: "Exámenes",
  flashcards: "Flashcards",
  oral: "Oral",
  vak: "VAK",
  progreso: "Progreso",
  misiones: "Misiones",
  inicio: "Inicio",
  padres: "Panel de Padres",
};

export const PREMIUM_TABS = [];

export const TOP_BAR_LABELS = {
  inicio: "Inicio",
  materias: "Materias",
  examenes: "Exámenes",
  flashcards: "Flashcards",
  oral: "Prueba Oral",
  vak: "Diagnóstico VAK",
  progreso: "Mi Progreso",
  misiones: "Misiones Diarias",
  padres: "Panel de Padres",
};

export const PREMIUM_FEATURES = {
  dani_unlimited: {
    icon: "🤖",
    title: "Dani Ilimitado",
    description:
      "Chat sin límite con tu tutor IA. Disponible solo en plan Premium.",
  },
  podcast: {
    icon: "🎧",
    title: "Podcast Educativo",
    description:
      "Aprende con podcasts curados sobre STEM y desarrollo personal. Disponible solo en plan Premium.",
  },
  analytics_parents: {
    icon: "👨‍👩‍👧",
    title: "Panel para Padres",
    description:
      "Seguimiento en tiempo real del progreso académico de tu hijo. Premium Plus.",
  },
};
