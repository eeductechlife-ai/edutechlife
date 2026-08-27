import { Home, BookOpen, PencilRuler, BarChart3, Gamepad2 } from "lucide-react";

export const CATEGORY_MAP = {
  inicio: "home",
  perfil: "progress",
  materias: "learn",
  horario: "learn",
  flashcards: "practice",
  oral: "practice",
  examenes: "practice",
  vak: "progress",
  progreso: "progress",
  calificaciones: "progress",
  plan: "progress",
  misiones: "explore",
  noticias: "explore",
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
    tabs: ["materias", "horario"],
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
    tabs: ["perfil", "calificaciones", "vak", "progreso", "plan"],
  },
  {
    id: "explore",
    Icon: Gamepad2,
    label: "Explorar",
    color: "#9D4EDD",
    gradient: "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)",
    glowColor: "#C77DFF",
    tabs: ["misiones", "noticias"],
  },
];

export const CATEGORY_TAB_LABELS = {
  materias: "Materias",
  horario: "Horario",
  examenes: "Exámenes",
  flashcards: "Educards",
  oral: "Habla con Dani",
  vak: "VAK",
  progreso: "Progreso",
  calificaciones: "Calificaciones",
  misiones: "Misiones",
  inicio: "Inicio",
  perfil: "Mi Perfil",
  plan: "Mi Plan",
  noticias: "Tech & IA",
};

export const PREMIUM_TABS = ["oral", "misiones"];

export const TOP_BAR_LABELS = {
  inicio: "Inicio",
  perfil: "Mi Perfil",
  materias: "Materias",
  horario: "Mi Horario",
  examenes: "Exámenes",
  flashcards: "Educards",
  oral: "Habla con Dani",
  vak: "Diagnóstico VAK",
  progreso: "Mi Progreso",
  calificaciones: "Mis Calificaciones",
  misiones: "Misiones Diarias",
  plan: "Mi Plan de Mejora",
  noticias: "Tech & IA",
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

/**
 * Feature flags for SmartBoard 3.0 modules.
 * `true` = shipped and enabled for all users. `false` = not yet built / dark.
 * Per-session override via localStorage `sb_flag_<name>` (see useFeatureFlag).
 * These will eventually be driven per-user from a Supabase feature_flags table.
 */
export const FEATURE_FLAGS = {
  // Shipped modules — live in production
  adaptive_engine: true,
  skill_passport: true,
  future_explorer: true,
  early_warning: true,
  // Not yet built / in progress — keep dark
  parent_intelligence_v2: false,
  gamification_v2: false,
  dani_orchestrator_v2: false,
  smart_profile: false,
  learning_graph: false,
};
