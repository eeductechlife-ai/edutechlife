const CATEGORIES_ES = [
  { id: 'all', label: 'Todos', icon: 'fa-bolt' },
  { id: 'ia-generativa', label: 'IA Generativa', icon: 'fa-brain' },
  { id: 'automatizaciones', label: 'Automatizaciones', icon: 'fa-robot' },
  { id: 'productividad', label: 'Productividad', icon: 'fa-chart-line' },
  { id: 'desarrollo', label: 'Desarrollo', icon: 'fa-code' },
];

const CATEGORIES_EN = [
  { id: 'all', label: 'All', icon: 'fa-bolt' },
  { id: 'ia-generativa', label: 'Generative AI', icon: 'fa-brain' },
  { id: 'automatizaciones', label: 'Automations', icon: 'fa-robot' },
  { id: 'productividad', label: 'Productivity', icon: 'fa-chart-line' },
  { id: 'desarrollo', label: 'Development', icon: 'fa-code' },
];

const COURSES_ES = [
  {
    id: 'ia-generativa',
    title: 'Introducción a la I.A Generativa',
    description: 'Domina la inteligencia artificial generativa con prompts, APIs, DeepResearch y NotebookLM.',
    category: 'ia-generativa',
    modules: 5,
    duration: '10h',
    level: 'Principiante',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-brain',
    status: 'active',
    rating: 4.8,
    students: '2,500+',
    features: ['Proyectos reales', 'Certificado IA', 'Soporte 24/7'],
    progress: 60
  },
  {
    id: 'prompt-avanzado',
    title: 'Prompt Engineering Avanzado',
    description: 'Técnicas avanzadas de prompting para maximizar resultados con modelos de IA.',
    category: 'ia-generativa',
    modules: 4,
    duration: '8h',
    level: 'Intermedio',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-wand-magic-sparkles',
    status: 'coming-soon',
    rating: 4.9,
    students: '1,200+',
    features: ['Prompts complejos', 'APIs avanzadas', 'Automatización'],
    progress: 0
  },
  {
    id: 'chatgpt-productividad',
    title: 'ChatGPT para Productividad',
    description: 'Automatiza tareas diarias y aumenta tu productividad con ChatGPT avanzado.',
    category: 'productividad',
    modules: 4,
    duration: '6h',
    level: 'Principiante',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-rocket',
    status: 'coming-soon',
    rating: 4.7,
    students: '3,100+',
    features: ['Automatización', 'Plantillas GPT', 'Workflows'],
    progress: 0
  },
  {
    id: 'automatizaciones-ia',
    title: 'Automatizaciones con IA',
    description: 'Crea flujos de trabajo automatizados usando herramientas de IA avanzadas.',
    category: 'automatizaciones',
    modules: 5,
    duration: '12h',
    level: 'Intermedio',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-cog',
    status: 'coming-soon',
    rating: 4.6,
    students: '890+',
    features: ['Zapier + IA', 'APIs sin código', 'Flujos multi-paso'],
    progress: 0
  },
  {
    id: 'desarrollo-ia',
    title: 'Desarrollo de Apps con IA',
    description: 'Construye aplicaciones inteligentes integrando APIs de modelos de lenguaje.',
    category: 'desarrollo',
    modules: 6,
    duration: '15h',
    level: 'Avanzado',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-laptop-code',
    status: 'coming-soon',
    rating: 4.9,
    students: '650+',
    features: ['APIs OpenAI', 'Frontend + IA', 'Despliegue'],
    progress: 0
  },
  {
    id: 'ia-marketing',
    title: 'IA para Marketing Digital',
    description: 'Genera contenido, campañas y estrategias de marketing con inteligencia artificial.',
    category: 'productividad',
    modules: 4,
    duration: '8h',
    level: 'Principiante',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-chart-pie',
    status: 'coming-soon',
    rating: 4.5,
    students: '1,800+',
    features: ['Contenido IA', 'SEO inteligente', 'Analítica'],
    progress: 0
  },
  {
    id: 'notebooklm-experto',
    title: 'NotebookLM Experto',
    description: 'Domina NotebookLM para investigación, análisis y generación de contenido.',
    category: 'ia-generativa',
    modules: 3,
    duration: '6h',
    level: 'Intermedio',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-book-open',
    status: 'coming-soon',
    rating: 4.8,
    students: '950+',
    features: ['Deep Research', 'Podcasts IA', 'Fuentes'],
    progress: 0
  },
  {
    id: 'ia-educacion',
    title: 'IA para Educadores',
    description: 'Herramientas de IA para crear contenido educativo personalizado y efectivo.',
    category: 'productividad',
    modules: 4,
    duration: '8h',
    level: 'Principiante',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-graduation-cap',
    status: 'coming-soon',
    rating: 4.7,
    students: '1,400+',
    features: ['Planes clase IA', 'Evaluación IA', 'Personalización'],
    progress: 0
  },
];

const COURSES_EN = [
  {
    id: 'ia-generativa',
    title: 'Introduction to Generative AI',
    description: 'Master generative artificial intelligence with prompts, APIs, DeepResearch, and NotebookLM.',
    category: 'ia-generativa',
    modules: 5,
    duration: '10h',
    level: 'Beginner',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-brain',
    status: 'active',
    rating: 4.8,
    students: '2,500+',
    features: ['Real projects', 'AI Certificate', '24/7 Support'],
    progress: 60
  },
  {
    id: 'prompt-avanzado',
    title: 'Advanced Prompt Engineering',
    description: 'Advanced prompting techniques to maximize results with AI models.',
    category: 'ia-generativa',
    modules: 4,
    duration: '8h',
    level: 'Intermediate',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-wand-magic-sparkles',
    status: 'coming-soon',
    rating: 4.9,
    students: '1,200+',
    features: ['Complex prompts', 'Advanced APIs', 'Automation'],
    progress: 0
  },
  {
    id: 'chatgpt-productividad',
    title: 'ChatGPT for Productivity',
    description: 'Automate daily tasks and boost your productivity with advanced ChatGPT.',
    category: 'productividad',
    modules: 4,
    duration: '6h',
    level: 'Beginner',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-rocket',
    status: 'coming-soon',
    rating: 4.7,
    students: '3,100+',
    features: ['Automation', 'GPT Templates', 'Workflows'],
    progress: 0
  },
  {
    id: 'automatizaciones-ia',
    title: 'Automations with AI',
    description: 'Create automated workflows using advanced AI tools.',
    category: 'automatizaciones',
    modules: 5,
    duration: '12h',
    level: 'Intermediate',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-cog',
    status: 'coming-soon',
    rating: 4.6,
    students: '890+',
    features: ['Zapier + AI', 'No-code APIs', 'Multi-step flows'],
    progress: 0
  },
  {
    id: 'desarrollo-ia',
    title: 'AI App Development',
    description: 'Build intelligent applications by integrating language model APIs.',
    category: 'desarrollo',
    modules: 6,
    duration: '15h',
    level: 'Advanced',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-laptop-code',
    status: 'coming-soon',
    rating: 4.9,
    students: '650+',
    features: ['OpenAI APIs', 'Frontend + AI', 'Deployment'],
    progress: 0
  },
  {
    id: 'ia-marketing',
    title: 'AI for Digital Marketing',
    description: 'Generate content, campaigns, and marketing strategies with artificial intelligence.',
    category: 'productividad',
    modules: 4,
    duration: '8h',
    level: 'Beginner',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-chart-pie',
    status: 'coming-soon',
    rating: 4.5,
    students: '1,800+',
    features: ['AI Content', 'Smart SEO', 'Analytics'],
    progress: 0
  },
  {
    id: 'notebooklm-experto',
    title: 'NotebookLM Expert',
    description: 'Master NotebookLM for research, analysis, and content generation.',
    category: 'ia-generativa',
    modules: 3,
    duration: '6h',
    level: 'Intermediate',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-book-open',
    status: 'coming-soon',
    rating: 4.8,
    students: '950+',
    features: ['Deep Research', 'AI Podcasts', 'Sources'],
    progress: 0
  },
  {
    id: 'ia-educacion',
    title: 'AI for Educators',
    description: 'AI tools to create personalized and effective educational content.',
    category: 'productividad',
    modules: 4,
    duration: '8h',
    level: 'Beginner',
    hasCertificate: true,
    route: '/ialab',
    icon: 'fa-graduation-cap',
    status: 'coming-soon',
    rating: 4.7,
    students: '1,400+',
    features: ['AI Lesson Plans', 'AI Assessment', 'Personalization'],
    progress: 0
  },
];

const BENEFITS_ES = [
  { icon: 'fa-brain', title: '8+ Cursos', desc: 'Más de 200h de contenido con certificación profesional al completar cada curso' },
  { icon: 'fa-headset', title: 'Soporte 24/7', desc: 'Asistencia personalizada cuando la necesites' },
  { icon: 'fa-flask', title: '100% Práctico', desc: 'Aprende haciendo con proyectos reales y ejercicios' },
  { icon: 'fa-users', title: 'Comunidad', desc: 'Conecta con otros estudiantes y profesionales de IA' }
];

const BENEFITS_EN = [
  { icon: 'fa-brain', title: '8+ Courses', desc: 'Over 200h of content with professional certification upon completing each course' },
  { icon: 'fa-headset', title: '24/7 Support', desc: 'Personalized assistance whenever you need it' },
  { icon: 'fa-flask', title: '100% Practical', desc: 'Learn by doing with real projects and exercises' },
  { icon: 'fa-users', title: 'Community', desc: 'Connect with other students and AI professionals' }
];

export const statusConfig = {
  active: {
    bg: 'from-petroleum via-[#00334A] to-navy',
    badge: 'bg-mint text-white',
    badgeText: 'Disponible',
    buttonText: (isSignedIn) => isSignedIn ? 'Comenzar' : 'Inscríbete',
    buttonClass: 'bg-gradient-to-r from-petroleum to-corporate text-white hover:from-corporate hover:to-mint shadow-md hover:shadow-lg hover:shadow-petroleum/20 cursor-pointer',
    disabled: false
  },
  'coming-soon': {
    bg: 'from-[#2A5F73] via-[#1E6B7A] to-[#154F5E]',
    badge: 'bg-white/20 backdrop-blur-sm text-white',
    badgeText: 'Próximamente',
    buttonText: (isSignedIn) => isSignedIn ? 'Explorar' : 'Explorar',
    buttonClass: 'bg-white/20 text-white hover:bg-white/30 border border-white/20 cursor-pointer',
    disabled: false
  },
  new: {
    bg: 'from-petroleum via-primary-light to-mint',
    badge: 'bg-primary-light text-white',
    badgeText: 'Nuevo',
    buttonText: () => 'Comenzar',
    buttonClass: 'bg-gradient-to-r from-petroleum to-corporate text-white hover:from-corporate hover:to-mint shadow-md hover:shadow-lg hover:shadow-petroleum/20 cursor-pointer',
    disabled: false
  }
};

export const particles = [
  { size: 4, x: '10%', y: '20%', delay: 0, duration: 7 },
  { size: 3, x: '85%', y: '15%', delay: 1.5, duration: 9 },
  { size: 5, x: '50%', y: '70%', delay: 0.8, duration: 8 },
  { size: 3, x: '25%', y: '80%', delay: 2, duration: 6 },
  { size: 4, x: '70%', y: '60%', delay: 0.5, duration: 10 },
];

export const statusConfig_EN = {
  active: {
    ...statusConfig.active,
    badgeText: 'Available',
    buttonText: (isSignedIn) => isSignedIn ? 'Start' : 'Enroll',
  },
  'coming-soon': {
    ...statusConfig['coming-soon'],
    badgeText: 'Coming Soon',
    buttonText: () => 'Explore',
  },
  new: {
    ...statusConfig.new,
    badgeText: 'New',
    buttonText: () => 'Start',
  }
};

export const getStatusConfig = (locale) => locale === 'en' ? statusConfig_EN : statusConfig;

const STATS = [
  { icon: 'fa-brain', value: '8+', label: 'Cursos' },
  { icon: 'fa-clock', value: '200h+', label: 'Contenido' },
  { icon: 'fa-trophy', value: 'Certificados', label: 'Profesionales' },
  { icon: 'fa-headset', value: '24/7', label: 'Soporte' }
];

const STATS_EN = [
  { icon: 'fa-brain', value: '8+', label: 'Courses' },
  { icon: 'fa-clock', value: '200h+', label: 'Content' },
  { icon: 'fa-trophy', value: 'Certificates', label: 'Professional' },
  { icon: 'fa-headset', value: '24/7', label: 'Support' }
];

export const getStats = (locale) => locale === 'en' ? STATS_EN : STATS;

// Selector functions
const getData = (locale = 'es') => locale === 'en'
  ? { categories: CATEGORIES_EN, courses: COURSES_EN, benefits: BENEFITS_EN }
  : { categories: CATEGORIES_ES, courses: COURSES_ES, benefits: BENEFITS_ES };

export const getCategories = (locale) => getData(locale).categories;
export const getCourses = (locale) => getData(locale).courses;
export const getBenefits = (locale) => getData(locale).benefits;

// Backward-compatible direct exports (Spanish)
export const categories = CATEGORIES_ES;
export const courses = COURSES_ES;
export const benefits = BENEFITS_ES;
