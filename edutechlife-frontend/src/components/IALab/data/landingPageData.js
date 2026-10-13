const CATEGORIES_ES = [
  { id: "all", label: "Todos", icon: "fa-bolt" },
  { id: "ia-generativa", label: "IA Generativa", icon: "fa-brain" },
  { id: "automatizaciones", label: "Automatizaciones", icon: "fa-robot" },
  { id: "productividad", label: "Productividad", icon: "fa-chart-line" },
  { id: "desarrollo", label: "Desarrollo", icon: "fa-code" },
];

const CATEGORIES_EN = [
  { id: "all", label: "All", icon: "fa-bolt" },
  { id: "ia-generativa", label: "Generative AI", icon: "fa-brain" },
  { id: "automatizaciones", label: "Automations", icon: "fa-robot" },
  { id: "productividad", label: "Productivity", icon: "fa-chart-line" },
  { id: "desarrollo", label: "Development", icon: "fa-code" },
];

const COURSES_ES = [
  {
    id: "ia-generativa",
    title: "Introducción a la IA Generativa",
    description:
      "Empieza desde cero: prompts, APIs y herramientas de IA explicados paso a paso, sin experiencia previa.",
    category: "ia-generativa",
    modules: 5,
    duration: "10h",
    level: "Principiante",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-brain",
    status: "active",
    features: ["Proyectos reales", "Certificado IA", "Coach MAX"],
    progress: 60,
  },
  {
    id: "prompt-avanzado",
    title: "Prompt Engineering Avanzado",
    description:
      "Escribe prompts que consiguen exactamente el resultado que buscas, cada vez.",
    category: "ia-generativa",
    modules: 4,
    duration: "8h",
    level: "Intermedio",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-wand-magic-sparkles",
    status: "coming-soon",
    features: ["Prompts complejos", "APIs avanzadas", "Automatización"],
    progress: 0,
  },
  {
    id: "chatgpt-productividad",
    title: "ChatGPT para Productividad",
    description:
      "Recupera horas de tu semana automatizando tareas repetitivas con ChatGPT.",
    category: "productividad",
    modules: 4,
    duration: "6h",
    level: "Principiante",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-rocket",
    status: "coming-soon",
    features: ["Automatización", "Plantillas GPT", "Workflows"],
    progress: 0,
  },
  {
    id: "automatizaciones-ia",
    title: "Automatizaciones con IA",
    description:
      "Conecta tus herramientas de trabajo para que la IA haga las tareas repetitivas por ti.",
    category: "automatizaciones",
    modules: 5,
    duration: "12h",
    level: "Intermedio",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-cog",
    status: "coming-soon",
    features: ["Zapier + IA", "APIs sin código", "Flujos multi-paso"],
    progress: 0,
  },
  {
    id: "desarrollo-ia",
    title: "Desarrollo de Apps con IA",
    description:
      "Construye tu propia aplicación con IA integrada, desde la API hasta el despliegue.",
    category: "desarrollo",
    modules: 6,
    duration: "15h",
    level: "Avanzado",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-laptop-code",
    status: "coming-soon",
    features: ["APIs OpenAI", "Frontend + IA", "Despliegue"],
    progress: 0,
  },
  {
    id: "ia-marketing",
    title: "IA para Marketing Digital",
    description:
      "Crea contenido, campañas y estrategias de marketing en una fracción del tiempo, con IA.",
    category: "productividad",
    modules: 4,
    duration: "8h",
    level: "Principiante",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-chart-pie",
    status: "coming-soon",
    features: ["Contenido IA", "SEO inteligente", "Analítica"],
    progress: 0,
  },
  {
    id: "notebooklm-experto",
    title: "NotebookLM Experto",
    description:
      "Convierte cualquier documento en resúmenes, podcasts y respuestas con NotebookLM.",
    category: "ia-generativa",
    modules: 3,
    duration: "6h",
    level: "Intermedio",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-book-open",
    status: "coming-soon",
    features: ["Deep Research", "Podcasts IA", "Fuentes"],
    progress: 0,
  },
  {
    id: "ia-educacion",
    title: "IA para Educadores",
    description:
      "Diseña clases y evaluaciones personalizadas en minutos, no en horas, con IA.",
    category: "productividad",
    modules: 4,
    duration: "8h",
    level: "Principiante",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-graduation-cap",
    status: "coming-soon",
    features: ["Planes clase IA", "Evaluación IA", "Personalización"],
    progress: 0,
  },
];

const COURSES_EN = [
  {
    id: "ia-generativa",
    title: "Introduction to Generative AI",
    description:
      "Start from zero: prompts, APIs, and AI tools explained step by step, no experience needed.",
    category: "ia-generativa",
    modules: 5,
    duration: "10h",
    level: "Beginner",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-brain",
    status: "active",
    features: ["Real projects", "AI Certificate", "MAX AI coach"],
    progress: 60,
  },
  {
    id: "prompt-avanzado",
    title: "Advanced Prompt Engineering",
    description:
      "Write prompts that get exactly the result you're looking for, every time.",
    category: "ia-generativa",
    modules: 4,
    duration: "8h",
    level: "Intermediate",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-wand-magic-sparkles",
    status: "coming-soon",
    features: ["Complex prompts", "Advanced APIs", "Automation"],
    progress: 0,
  },
  {
    id: "chatgpt-productividad",
    title: "ChatGPT for Productivity",
    description:
      "Get hours back in your week by automating repetitive tasks with ChatGPT.",
    category: "productividad",
    modules: 4,
    duration: "6h",
    level: "Beginner",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-rocket",
    status: "coming-soon",
    features: ["Automation", "GPT Templates", "Workflows"],
    progress: 0,
  },
  {
    id: "automatizaciones-ia",
    title: "Automations with AI",
    description:
      "Connect your work tools so AI handles the repetitive tasks for you.",
    category: "automatizaciones",
    modules: 5,
    duration: "12h",
    level: "Intermediate",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-cog",
    status: "coming-soon",
    features: ["Zapier + AI", "No-code APIs", "Multi-step flows"],
    progress: 0,
  },
  {
    id: "desarrollo-ia",
    title: "AI App Development",
    description:
      "Build your own AI-powered app, from the API all the way to deployment.",
    category: "desarrollo",
    modules: 6,
    duration: "15h",
    level: "Advanced",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-laptop-code",
    status: "coming-soon",
    features: ["OpenAI APIs", "Frontend + AI", "Deployment"],
    progress: 0,
  },
  {
    id: "ia-marketing",
    title: "AI for Digital Marketing",
    description:
      "Create content, campaigns, and marketing strategies in a fraction of the time, with AI.",
    category: "productividad",
    modules: 4,
    duration: "8h",
    level: "Beginner",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-chart-pie",
    status: "coming-soon",
    features: ["AI Content", "Smart SEO", "Analytics"],
    progress: 0,
  },
  {
    id: "notebooklm-experto",
    title: "NotebookLM Expert",
    description:
      "Turn any document into summaries, podcasts, and answers with NotebookLM.",
    category: "ia-generativa",
    modules: 3,
    duration: "6h",
    level: "Intermediate",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-book-open",
    status: "coming-soon",
    features: ["Deep Research", "AI Podcasts", "Sources"],
    progress: 0,
  },
  {
    id: "ia-educacion",
    title: "AI for Educators",
    description:
      "Design personalized lessons and assessments in minutes, not hours, with AI.",
    category: "productividad",
    modules: 4,
    duration: "8h",
    level: "Beginner",
    hasCertificate: true,
    route: "/ialab",
    icon: "fa-graduation-cap",
    status: "coming-soon",
    features: ["AI Lesson Plans", "AI Assessment", "Personalization"],
    progress: 0,
  },
];

const BENEFITS_ES = [
  {
    icon: "fa-brain",
    title: "Cursos de IA",
    desc: "Certificado profesional al completar cada curso",
  },
  {
    icon: "fa-headset",
    title: "Coach MAX",
    desc: "Asistencia personalizada cuando la necesites",
  },
  {
    icon: "fa-flask",
    title: "100% Práctico",
    desc: "Aprende haciendo con proyectos reales y ejercicios",
  },
  {
    icon: "fa-users",
    title: "Comunidad",
    desc: "Aprende junto a otros estudiantes y profesionales que ya aplican IA en su trabajo",
  },
];

const BENEFITS_EN = [
  {
    icon: "fa-brain",
    title: "AI courses",
    desc: "Professional certificate upon completing each course",
  },
  {
    icon: "fa-headset",
    title: "MAX AI coach",
    desc: "Personalized assistance whenever you need it",
  },
  {
    icon: "fa-flask",
    title: "100% Practical",
    desc: "Learn by doing with real projects and exercises",
  },
  {
    icon: "fa-users",
    title: "Community",
    desc: "Learn alongside other students and professionals already applying AI at work",
  },
];

export const statusConfig = {
  active: {
    bg: "from-petroleum via-[#00334A] to-navy",
    badge: "bg-mint text-white",
    badgeText: "Disponible",
    buttonText: (isSignedIn) => (isSignedIn ? "Comenzar" : "Inscríbete"),
    buttonClass:
      "bg-gradient-to-r from-petroleum to-corporate text-white hover:from-corporate hover:to-mint shadow-md hover:shadow-lg hover:shadow-petroleum/20 cursor-pointer",
    disabled: false,
  },
  "coming-soon": {
    bg: "from-[#2A5F73] via-[#1E6B7A] to-[#154F5E]",
    badge: "bg-white/20 backdrop-blur-sm text-white",
    badgeText: "Próximamente",
    buttonText: (isSignedIn) => (isSignedIn ? "Explorar" : "Explorar"),
    buttonClass:
      "bg-white/20 text-white hover:bg-white/30 border border-white/20 cursor-pointer",
    disabled: false,
  },
  new: {
    bg: "from-petroleum via-primary-light to-mint",
    badge: "bg-primary-light text-white",
    badgeText: "Nuevo",
    buttonText: () => "Comenzar",
    buttonClass:
      "bg-gradient-to-r from-petroleum to-corporate text-white hover:from-corporate hover:to-mint shadow-md hover:shadow-lg hover:shadow-petroleum/20 cursor-pointer",
    disabled: false,
  },
};

export const particles = [
  { size: 4, x: "10%", y: "20%", delay: 0, duration: 7 },
  { size: 3, x: "85%", y: "15%", delay: 1.5, duration: 9 },
  { size: 5, x: "50%", y: "70%", delay: 0.8, duration: 8 },
  { size: 3, x: "25%", y: "80%", delay: 2, duration: 6 },
  { size: 4, x: "70%", y: "60%", delay: 0.5, duration: 10 },
];

export const statusConfig_EN = {
  active: {
    ...statusConfig.active,
    badgeText: "Available",
    buttonText: (isSignedIn) => (isSignedIn ? "Start" : "Enroll"),
  },
  "coming-soon": {
    ...statusConfig["coming-soon"],
    badgeText: "Coming Soon",
    buttonText: () => "Explore",
  },
  new: {
    ...statusConfig.new,
    badgeText: "New",
    buttonText: () => "Start",
  },
};

export const getStatusConfig = (locale) =>
  locale === "en" || locale === "pt" ? statusConfig_EN : statusConfig;

const STATS = [
  { icon: "fa-brain", value: "5", label: "Módulos" },
  { icon: "fa-flask", value: "100%", label: "Práctico" },
  { icon: "fa-trophy", value: "Certificados", label: "Profesionales" },
  { icon: "fa-headset", value: "MAX", label: "Coach IA" },
];

const STATS_EN = [
  { icon: "fa-brain", value: "5", label: "Modules" },
  { icon: "fa-flask", value: "100%", label: "Hands-on" },
  { icon: "fa-trophy", value: "Certificates", label: "Professional" },
  { icon: "fa-headset", value: "MAX", label: "AI coach" },
];

export const getStats = (locale) =>
  locale === "en" || locale === "pt" ? STATS_EN : STATS;

// Selector functions
const getData = (locale = "es") =>
  locale === "en" || locale === "pt"
    ? { categories: CATEGORIES_EN, courses: COURSES_EN, benefits: BENEFITS_EN }
    : { categories: CATEGORIES_ES, courses: COURSES_ES, benefits: BENEFITS_ES };

export const getCategories = (locale) => getData(locale).categories;
export const getCourses = (locale) => getData(locale).courses;
export const getBenefits = (locale) => getData(locale).benefits;

// Backward-compatible direct exports (Spanish)
export const categories = CATEGORIES_ES;
export const courses = COURSES_ES;
export const benefits = BENEFITS_ES;
