import {
  Home,
  BookOpen,
  PencilRuler,
  BarChart3,
  Gamepad2,
  User,
} from "lucide-react";

export const CATEGORY_MAP = {
  inicio: "home",
  // learn — calificaciones, plan, horario are internal MateriasTab sub-views
  materias: "learn",
  calificaciones: "learn",
  plan: "learn",
  horario: "learn",
  // practice — flashcards is internal/hidden; accessible via NBA or retos
  flashcards: "practice",
  retos: "practice",
  examenes: "practice", // hidden; inside ChallengeEngine
  oral: "practice", // hidden; via Dani FAB
  // progress
  progreso: "progress",
  // profile
  perfil: "profile",
  vak: "profile", // hidden; inside perfil
  // explore — noticias is internal ExplorarTab sub-view
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
    minAge: 6,
  },
  {
    id: "learn",
    Icon: BookOpen,
    label: "Aprender",
    color: "#06D6A0",
    gradient: "linear-gradient(135deg, #06D6A0 0%, #1B9AAA 60%, #118AB2 100%)",
    glowColor: "#06D6A0",
    tabs: ["materias"], // calificaciones + plan + horario: internal MateriasTab sub-views
    minAge: 6,
  },
  {
    id: "practice",
    Icon: PencilRuler,
    label: "Practicar",
    color: "#FF6B9D",
    gradient: "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)",
    glowColor: "#EF476F",
    tabs: ["retos"], // flashcards: accessible via NBA or retos
    minAge: 6,
  },
  {
    id: "progress",
    Icon: BarChart3,
    label: "Progreso",
    color: "#FB8500",
    gradient: "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)",
    glowColor: "#FFB703",
    tabs: ["progreso"],
    minAge: 6,
  },
  {
    id: "explore",
    Icon: Gamepad2,
    label: "Explorar",
    color: "#9D4EDD",
    gradient: "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)",
    glowColor: "#C77DFF",
    tabs: ["misiones"], // noticias: internal ExplorarTab sub-view
    minAge: 10, // no visible para grupo 6-9
  },
  {
    id: "profile",
    Icon: User,
    label: "Mi Perfil",
    color: "#7B2FF7",
    gradient: "linear-gradient(135deg, #9D4EDD 0%, #7B2FF7 55%, #5A1DAA 100%)",
    glowColor: "#9D4EDD",
    tabs: ["perfil"],
    minAge: 6,
  },
];

/**
 * Devuelve las categorías visibles para el grupo de edad del estudiante.
 * early (6-9): oculta categorías con minAge > 9
 * middle (10-12) y senior (13-16): acceso completo
 */
export function getTabsForAgeGroup(ageGroup) {
  const ceiling = ageGroup === "early" ? 9 : 99;
  return CATEGORIES.filter((cat) => (cat.minAge ?? 6) <= ceiling);
}

export const CATEGORY_TAB_LABELS = {
  inicio: "Inicio",
  materias: "Materias",
  calificaciones: "Notas",
  plan: "Mi Plan",
  flashcards: "Educards",
  retos: "Retos",
  perfil: "Mi Perfil",
  progreso: "Estadísticas",
  misiones: "Misiones",
  noticias: "Tech & IA",
  horario: "Horario",
  examenes: "Exámenes",
  oral: "Habla con Dani",
  vak: "VAK",
};

export const PREMIUM_TABS = ["oral", "misiones"];

export const TOP_BAR_LABELS = {
  inicio: "Inicio",
  materias: "Materias",
  calificaciones: "Mis Notas",
  plan: "Mi Plan de Mejora",
  flashcards: "Educards",
  retos: "Retos Inteligentes",
  perfil: "Mi Perfil",
  progreso: "Mis Estadísticas",
  misiones: "Misiones Diarias",
  noticias: "Tech & IA",
  // hidden tabs — titles preserved for internal navigation
  horario: "Mi Horario",
  examenes: "Exámenes",
  oral: "Habla con Dani",
  vak: "Diagnóstico VAK",
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
  learning_graph: true,
};
