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
    title: "Completa tu Diagnóstico VAK",
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
  // TODO: conectar en Fase 4 (TechNewsFeed) — reemplazar con misión de noticias tech cuando el feed esté listo
  {
    id: 6,
    title: "Habla 5 minutos con Dani",
    description: "Conversa con tu tutor virtual",
    icon: "💬",
    xp: 80,
    completed: false,
  },
];

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
