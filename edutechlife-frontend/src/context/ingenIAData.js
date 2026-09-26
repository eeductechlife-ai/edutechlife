export const DEFAULT_NEWS = [
  {
    id: 1,
    title: "¿Sabías que la IA puede ayudarte a estudiar?",
    summary:
      "La inteligencia artificial está cambiando la forma en que aprendemos. ¡Descubre cómo!",
    category: "IA",
    ageRange: "8-16",
    date: "2026-05-04",
    readTime: "2 min",
    icon: "🤖",
  },
  {
    id: 2,
    title: "Nuevas herramientas STEAM para tu colegio",
    summary:
      "Proyectos de ciencia, tecnología, ingeniería, arte y matemáticas que puedes hacer en casa.",
    category: "STEAM",
    ageRange: "8-16",
    date: "2026-05-03",
    readTime: "3 min",
    icon: "🔬",
  },
  {
    id: 3,
    title: "Consejos de Dani: Cómo organizar tu tiempo",
    summary:
      "Tips sencillos para que cumplas con tus tareas y tengas tiempo para jugar.",
    category: "Tips",
    ageRange: "8-16",
    date: "2026-05-02",
    readTime: "2 min",
    icon: "⏰",
  },
];

export const DEFAULT_MISSIONS = [
  {
    id: 1,
    title: "Completa tu ADN de Aprendizaje",
    description: "Descubre cómo aprendes mejor",
    icon: "🧠",
    xp: 100,
    completed: false,
  },
  {
    id: 2,
    title: "Sube tu primera actividad",
    description: "Comparte un trabajo con Dani",
    icon: "📤",
    xp: 50,
    completed: false,
  },
  {
    id: 3,
    title: "Habla con Dani 5 veces",
    description: "Haz preguntas a tu tutor virtual",
    icon: "💬",
    xp: 75,
    completed: false,
  },
  {
    id: 4,
    title: "Agrega 3 eventos al calendario",
    description: "Organiza tu semana de estudio",
    icon: "📅",
    xp: 60,
    completed: false,
  },
  {
    id: 5,
    title: "Gana 500 puntos",
    description: "Acumula puntos canjeables por premios",
    icon: "💎",
    xp: 200,
    completed: false,
  },
  {
    id: 6,
    title: "Haz 3 retos",
    description: "Practica con preguntas de tus materias",
    icon: "🎮",
    xp: 80,
    completed: false,
  },
];

// Pool of rotating weekly missions — 4 sets × 3 missions, cycled by ISO week number
const WEEKLY_MISSION_POOL = [
  // Week A
  [
    {
      id: "w_reto3",
      title: "¡3 Retos esta semana!",
      description: "Haz 3 retos de diferentes materias",
      icon: "⚡",
      xp: 120,
      completed: false,
    },
    {
      id: "w_streak5",
      title: "Racha de 5 días",
      description: "Entra a IngenIA 5 días seguidos",
      icon: "🔥",
      xp: 150,
      completed: false,
    },
    {
      id: "w_flashcard20",
      title: "20 EduCards",
      description: "Repasa 20 tarjetas de estudio esta semana",
      icon: "🃏",
      xp: 80,
      completed: false,
    },
  ],
  // Week B
  [
    {
      id: "w_dani3",
      title: "3 preguntas a Dani",
      description: "Consulta a tu tutora sobre algo que no entiendas",
      icon: "🤖",
      xp: 90,
      completed: false,
    },
    {
      id: "w_scan",
      title: "Sube tu boletín",
      description: "Escanea tus notas para que Dani te ayude mejor",
      icon: "📊",
      xp: 100,
      completed: false,
    },
    {
      id: "w_perfect",
      title: "Reto perfecto",
      description: "Saca 100% en un reto de dificultad Media o Difícil",
      icon: "🏆",
      xp: 200,
      completed: false,
    },
  ],
  // Week C
  [
    {
      id: "w_schedule",
      title: "Organiza tu semana",
      description: "Sube o revisa tu horario de clases",
      icon: "📅",
      xp: 60,
      completed: false,
    },
    {
      id: "w_oral",
      title: "Practica tu expresión oral",
      description: "Completa una sesión de Habla con Dani",
      icon: "🗣️",
      xp: 110,
      completed: false,
    },
    {
      id: "w_points300",
      title: "Colecciona 300 XP",
      description: "Gana 300 puntos en cualquier actividad esta semana",
      icon: "💎",
      xp: 130,
      completed: false,
    },
  ],
  // Week D
  [
    {
      id: "w_vak",
      title: "Confirma tu estilo VAK",
      description: "Revisa o actualiza tu ADN de aprendizaje en Mi Perfil",
      icon: "🧠",
      xp: 80,
      completed: false,
    },
    {
      id: "w_weak",
      title: "Refuerza tu materia difícil",
      description: "Haz un reto de la materia que más te cuesta",
      icon: "💪",
      xp: 140,
      completed: false,
    },
    {
      id: "w_mission",
      title: "Completa una misión pendiente",
      description: "Termina cualquier misión que tengas en Explorar",
      icon: "🎯",
      xp: 100,
      completed: false,
    },
  ],
];

/**
 * Returns 3 rotating weekly missions based on the current ISO week number.
 * The set changes every Monday and is the same for all students the same week.
 */
function weekNumber(now = new Date()) {
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
}

export function getWeekKey(now = new Date()) {
  return `${now.getFullYear()}-W${weekNumber(now)}`;
}

export function getRotatingMissions(now = new Date()) {
  const week = getWeekKey(now);
  return WEEKLY_MISSION_POOL[weekNumber(now) % WEEKLY_MISSION_POOL.length].map(
    (m) => ({ ...m, week }),
  );
}

/** Days until the weekly set rotates (next Monday). */
export function daysUntilWeeklyReset(now = new Date()) {
  const day = (now.getDay() + 6) % 7; // Monday = 0
  return 7 - day;
}

const isWeekly = (m) => typeof m?.id === "string" && m.id.startsWith("w_");

// Saved lists freeze whatever weekly set existed when they were first stored;
// swap in this week's set, keeping completion only for the same week.
export function mergeWeeklyMissions(saved, now = new Date()) {
  // Rows saved from the mission engine ({ key, xp_reward }) have no id/xp and
  // rendered as dead cards; drop them so the defaults come back.
  const permanent = (saved || []).filter(
    (m) => m?.id != null && m?.xp != null && !isWeekly(m),
  );
  const week = getWeekKey(now);
  const doneThisWeek = new Set(
    (saved || [])
      .filter((m) => isWeekly(m) && m.week === week && m.completed)
      .map((m) => m.id),
  );
  const weekly = getRotatingMissions(now).map((m) => ({
    ...m,
    completed: doneThisWeek.has(m.id),
  }));
  return [...(permanent.length ? permanent : DEFAULT_MISSIONS), ...weekly];
}

export const DEFAULT_SUBJECTS = [
  {
    id: "matematicas",
    name: "Matemáticas",
    icon: "🔢",
    progress: 0,
    color: "#4DA8C4",
  },
  {
    id: "lenguaje",
    name: "Lenguaje",
    icon: "📖",
    progress: 0,
    color: "#66CCCC",
  },
  {
    id: "ciencias",
    name: "Ciencias",
    icon: "🔬",
    progress: 0,
    color: "#FFD166",
  },
  {
    id: "historia",
    name: "Historia",
    icon: "🏛️",
    progress: 0,
    color: "#FF6B9D",
  },
  { id: "ingles", name: "Inglés", icon: "🌎", progress: 0, color: "#B2D8E5" },
  { id: "arte", name: "Arte", icon: "🎨", progress: 0, color: "#004B63" },
];

export const VAK_RECOMMENDATIONS = {
  visual: [
    {
      type: "activity",
      name: "Mapas mentales",
      description: "Crea mapas conceptuales de tus materias",
    },
    {
      type: "activity",
      name: "Infografías",
      description: "Dibuja resúmenes visuales",
    },
    {
      type: "resource",
      name: "Videos educativos",
      description: "Aprende con contenido visual",
    },
  ],
  auditivo: [
    {
      type: "activity",
      name: "Explicar a otros",
      description: "Enseña lo que aprendiste",
    },
    {
      type: "activity",
      name: "Podcasts educativos",
      description: "Escucha contenido académico",
    },
    { type: "resource", name: "Audiolibros", description: "Lee con tus oídos" },
  ],
  kinestesico: [
    {
      type: "activity",
      name: "Experimentos prácticos",
      description: "Aprende haciendo",
    },
    {
      type: "activity",
      name: "Role-playing",
      description: "Actúa situaciones de aprendizaje",
    },
    {
      type: "resource",
      name: "Manipulativos",
      description: "Usa objetos para aprender",
    },
  ],
};
