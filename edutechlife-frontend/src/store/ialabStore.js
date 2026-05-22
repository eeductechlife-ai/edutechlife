import { create } from 'zustand';

// localStorage keys centralizados
const LS_KEYS = {
  VIEWED_RESOURCES: 'ialab_viewed_resources',
  COMPLETED_VIDEOS: 'ialab_completed_videos',
  COMPLETED_MODULES: 'ialab_completed_modules',
  COMPLETED_EXAMS: 'ialab_completed_exams',
  COMPLETED_INFOGRAPHICS: 'ialab_completed_infographics',
  COMPLETED_ACTIVITIES: 'ialab_completed_activities',
  OVERALL_PROGRESS: 'ialab_overall_progress',
  SYNC_QUEUE: 'ialab_sync_queue',
  ACTIVITY_LOG: 'ialab_activity_log',
  RESOURCE_STATUS: 'ialab_resource_status',
  NOTIFICATIONS: 'ialab_notifications',
  NOTIFIED_CERTIFICATION: 'ialab_notified_certification',
  VALERIO_WELCOMED: 'ialab_valerio_welcomed',
  SIDEBAR_STATE: 'ialab-sidebar-state',
  PROGRESS_CACHE: 'ialab_progress_cache',
  SECURITY_WARNINGS_RESET: 'securityWarningsResetDate',
  SETTINGS: 'edutechlife_settings',
  LESSON_PROGRESS: 'ialab_lesson_progress',
  XP: 'ialab_xp',
  STREAK: 'ialab_streak',
  LAST_ACTIVITY_DATE: 'ialab_last_activity_date',
  BADGES: 'ialab_badges',
  CHECKPOINT_ANSWERS: 'ialab_checkpoint_answers',
  FORUM_POST_COUNT: 'ialab_forum_post_count',
  FORUM_COMMENT_COUNT: 'ialab_forum_comment_count',
  BOOKMARKED_RESOURCES: 'ialab_bookmarked_resources',
  START_DATE: 'ialab_start_date',
};

const ls = {
  _pending: null,
  _flush: () => {
    if (!ls._pending) return;
    const batch = ls._pending;
    ls._pending = null;
    try {
      for (const [key, value] of batch) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {}
  },
  get: (key, fallback = null) => {
    // Check pending batch first (write-then-read in same tick)
    if (ls._pending?.has(key)) return ls._pending.get(key);
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    if (!ls._pending) {
      ls._pending = new Map();
      queueMicrotask(ls._flush);
    }
    ls._pending.set(key, value);
  },
  remove: (key) => {
    try { localStorage.removeItem(key); } catch {}
  },
};

// Simple memoization cache for expensive calculations
const memoCache = new Map();
const memoize = (key, fn, ttl = 500) => {
  const cached = memoCache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) return cached.value;
  const value = fn();
  memoCache.set(key, { value, timestamp: Date.now() });
  return value;
};
const clearMemoCache = () => memoCache.clear();

// Pesos: Examen 35% + Desafío 30% + Recursos 30% + Comunidad 5% = 100%
const WEIGHTS = { exam: 35, challenge: 30, resources: 30, community: 5 };

// Helper: calcular score de un módulo a partir de su progreso
const calcModuleScore = (mod) => {
  if (!mod) return 0;
  let score = 0;
  score += mod.examEarned || (mod.exam ? WEIGHTS.exam : 0);
  score += mod.challengeEarned || (mod.challenge ? WEIGHTS.challenge : 0);
  if (mod.resourcesCompleted) score += WEIGHTS.resources;
  if (mod.community) score += WEIGHTS.community;
  return Math.min(100, Math.round(score * 10) / 10);
};

// Helper: recalcular courseProgress desde todos los módulos
const calcGlobalProgress = (moduleProgress) => {
  let total = 0;
  for (let i = 1; i <= 5; i++) {
    const mp = moduleProgress[i];
    if (mp) total += (calcModuleScore(mp) / 100) * 20;
  }
  return Math.min(100, Math.round(total));
};

const INITIAL_MODULE_PROGRESS = {
  1: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true },
  2: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
  3: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
  4: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
  5: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
};

const INITIAL_SIDEBAR_DROPDOWNS = { videos: false, recursos: false };
const INITIAL_OPEN_ACCORDIONS = {};

const modules = [
  { id: 1, title: 'Ingeniería de Prompts', icon: 'fa-terminal', color: '#4DA8C4', topics: ['Dar instrucciones claras a la IA', 'Mejorar cualquier pregunta para obtener mejores respuestas', 'Entender por qué la IA falla y cómo corregirlo', 'Obtener resultados útiles en menos tiempo', 'Aplicar la IA en estudio, trabajo y vida diaria', 'Pedir exactamente lo que necesita, sin rodeos'], challenge: '¡Llegó el momento de la práctica! Aplica todo lo aprendido en este módulo resolviendo un caso real. Atrévete a consolidar tu aprendizaje, supera el reto y lleva tus conocimientos al siguiente nivel.', desc: 'En este módulo, hemos diseñado una ruta estratégica que te llevará desde los fundamentos de la Inteligencia Artificial Generativa hasta la creación de instrucciones de alto impacto. Tu misión: Explorar cada tema y sus recursos multimedia (videos, guías y laboratorios). Notarás que tu barra de progreso cobrará vida con cada paso que des. No te detengas: cada recurso completado te acerca un 20% más a tu certificación global. ¡El poder de las instrucciones claras está en tus manos!', duration: '2h', level: 'Avanzado', videos: 12, projects: 3 },
  { id: 2, title: 'Potencia ChatGPT', icon: 'fa-robot', color: '#66CCCC', topics: ['Análisis Predictivo', 'GPTs Personalizados', 'Function Calling', 'System Prompts'], challenge: 'Crea un GPT personalizado para automatizar una tarea de tu área profesional y conéctalo con una API externa usando Function Calling.', desc: 'Conviértete en un experto en ChatGPT: domina system prompts, crea GPTs personalizados y automatiza tu trabajo.', duration: '2h', level: 'Avanzado', videos: 15, projects: 4 },
  { id: 3, title: 'Rastreo Profundo', icon: 'fa-search', color: '#B2D8E5', topics: ['Razonamiento Multimodal', 'Grounding Real-Time', 'Deep Research', 'Fact-Checking IA'], challenge: 'Usa Gemini Deep Research para investigar un tema de actualidad, verifica cada fuente citada y presenta un informe profesional con conclusiones propias.', desc: 'Domina Google Gemini para investigar, verificar datos y analizar información como un profesional.', duration: '2h', level: 'Intermedio', videos: 10, projects: 2 },
  { id: 4, title: 'Inmersión NotebookLM', icon: 'fa-microphone', color: '#004B63', topics: ['Curaduría de Fuentes', 'Síntesis de Conocimiento', 'Audio Overviews', 'Gestión Documental'], challenge: 'Genera un podcast analizando 5 papers sobre neuro-plasticidad.', desc: 'Transforma PDFs y documentos en resúmenes inteligentes, podcasts y asistentes de investigación personalizados.', duration: '2h', level: 'Intermedio', videos: 8, projects: 3 },
  { id: 5, title: 'Proyecto Disruptivo', icon: 'fa-trophy', color: '#FFD166', topics: ['Integración Total', 'MVP Inteligente', 'Pitch Deck IA', 'Roadmap Estratégico'], challenge: 'Analiza un caso real de sesgo algorítmico en IA y propón un protocolo ético para prevenir y mitigar este tipo de discriminación.', desc: 'Aplica todo lo aprendido en un proyecto de impacto real.', duration: '2h', level: 'Experto', videos: 6, projects: 5 },
];

const LAST_MODULE_ID = 5;

const MODULE_RESOURCE_COUNTS = { 1: 8, 2: 8, 3: 8, 4: 8, 5: 8 };

const ALL_LESSONS = {
  1: [
    { id: 1, title: 'IA Generativa: Tu Primer Paso', description: 'Descubre cómo la IA generativa está transformando la educación y domina los conceptos clave para aplicarla desde hoy.', duration: '20 min', type: 'teoría', hasMedia: true, icon: 'fa-brain', objectives: ['Comprender qué es la IA generativa y cómo funciona', 'Identificar aplicaciones prácticas en el ámbito educativo', 'Reconocer las limitaciones y consideraciones éticas'] },
    { id: 2, title: 'El Poder de un Buen Prompt', description: 'Aprende a comunicarte con la IA como un experto: el prompt correcto marca la diferencia entre un resultado genérico y una solución a tu medida.', duration: '20 min', type: 'práctica', hasMedia: true, icon: 'fa-comments', objectives: ['Definir qué es un prompt y su rol en la comunicación con IA', 'Diferenciar entre prompts efectivos y genéricos', 'Aplicar ejemplos prácticos de prompts en contexto educativo'] },
    { id: 3, title: 'Construye Prompts Impecables', description: 'Aprende la fórmula mágica: Contexto + Instrucción + Formato = Resultado preciso.', duration: '20 min', type: 'teoría', hasMedia: true, icon: 'fa-sitemap', objectives: ['Dominar la fórmula Contexto + Instrucción + Formato', 'Construir prompts estructurados con resultados precisos', 'Evaluar y refinar la calidad de las respuestas de IA'] },
  ],
  2: [
    { id: 1, title: 'Predice Tendencias con ChatGPT', description: 'Usa GPT para anticipar tendencias y tomar decisiones estratégicas basadas en datos reales.', duration: '25 min', type: 'teoría', hasMedia: true, icon: 'fa-chart-line', objectives: ['Comprender cómo GPT puede analizar datos estructurados', 'Aplicar técnicas de forecasting con IA', 'Identificar patrones y tendencias en datos históricos'] },
    { id: 2, title: 'Crea tu Propio Asistente IA', description: 'Diseña asistentes IA a tu medida, entrenados para tus tareas y necesidades específicas.', duration: '30 min', type: 'laboratorio', hasMedia: true, icon: 'fa-robot', objectives: ['Configurar un GPT especializado para tareas específicas', 'Personalizar instrucciones y base de conocimiento', 'Publicar y compartir GPTs con tu equipo'] },
    { id: 3, title: 'Automatiza con APIs y ChatGPT', description: 'Conecta GPT con tus herramientas y automatiza flujos de trabajo complejos sin esfuerzo.', duration: '25 min', type: 'práctica', hasMedia: false, icon: 'fa-code', objectives: ['Integrar funciones externas con modelos GPT', 'Automatizar flujos de trabajo complejos', 'Gestionar respuestas estructuradas desde la API'] },
  ],
  3: [
    { id: 1, title: 'Ve, Lee y Analiza con Gemini', description: 'Analiza texto, imágenes y datos en un solo lugar con el poder multimodal de la IA.', duration: '20 min', type: 'teoría', hasMedia: true, icon: 'fa-brain', objectives: ['Combinar texto, imágenes y datos en un solo análisis', 'Comprender las capacidades multimodales de la IA actual', 'Aplicar razonamiento multimodal a casos de investigación'] },
    { id: 2, title: 'Respuestas Siempre Actualizadas', description: 'Obtén respuestas siempre actualizadas conectando la IA a fuentes de información en tiempo real.', duration: '25 min', type: 'práctica', hasMedia: true, icon: 'fa-search', objectives: ['Conectar la IA con fuentes de datos en vivo', 'Verificar respuestas con información actualizada', 'Implementar grounding en aplicaciones prácticas'] },
    { id: 3, title: 'El Arte de Investigar con IA', description: 'Investiga a fondo y verifica cualquier hecho con técnicas avanzadas de investigación asistida por IA.', duration: '30 min', type: 'laboratorio', hasMedia: false, icon: 'fa-microscope', objectives: ['Realizar investigaciones profundas asistidas por IA', 'Verificar hechos y fuentes automáticamente', 'Estructurar informes de investigación con IA'] },
  ],
  4: [
    { id: 1, title: 'Selecciona Fuentes como Experto', description: 'Construye tu biblioteca de fuentes confiables con la ayuda de la IA para investigaciones sólidas.', duration: '20 min', type: 'teoría', hasMedia: true, icon: 'fa-bookmark', objectives: ['Seleccionar fuentes relevantes para investigación académica', 'Organizar y categorizar documentos con IA', 'Evaluar la calidad y credibilidad de las fuentes'] },
    { id: 2, title: 'Convierte Datos en Sabiduría', description: 'Convierte documentos densos en resúmenes claros y listos para usar en tus proyectos.', duration: '25 min', type: 'práctica', hasMedia: true, icon: 'fa-compress', objectives: ['Transformar documentos complejos en resúmenes ejecutivos', 'Extraer ideas clave de múltiples fuentes', 'Estructurar conocimiento de forma accionable'] },
    { id: 3, title: 'Tus Apuntes se Vuelven Podcast', description: 'Escucha tus documentos y organiza tu biblioteca de conocimiento digital con IA.', duration: '25 min', type: 'laboratorio', hasMedia: true, icon: 'fa-microphone', objectives: ['Convertir documentos escritos en contenido de audio', 'Gestionar una biblioteca de conocimiento digital', 'Optimizar flujos de documentación con IA'] },
  ],
  5: [
    { id: 1, title: 'Une Todas las IAs en un Solo Flujo', description: 'Integra todo tu stack de IA en un flujo de trabajo unificado y potente.', duration: '30 min', type: 'proyecto', hasMedia: true, icon: 'fa-puzzle-piece', objectives: ['Combinar múltiples herramientas IA en un flujo unificado', 'Diseñar arquitecturas de integración eficientes', 'Resolver problemas complejos con stack IA completo'] },
    { id: 2, title: 'Crea tu Primer Producto con IA', description: 'Crea un MVP con IA integrada para validar tus ideas en tiempo récord.', duration: '35 min', type: 'proyecto', hasMedia: true, icon: 'fa-rocket', objectives: ['Construir un producto mínimo viable con IA integrada', 'Priorizar funcionalidades core para validación rápida', 'Iterar basándose en feedback de usuarios'] },
    { id: 3, title: 'Presenta tu Idea como un Profesional', description: 'Diseña una presentación profesional y una hoja de ruta que vendan tu proyecto disruptivo.', duration: '25 min', type: 'proyecto', hasMedia: false, icon: 'fa-presentation', objectives: ['Preparar una presentación profesional de proyecto IA', 'Diseñar una hoja de ruta estratégica', 'Comunicar el valor del proyecto a stakeholders'] },
  ],
};

const CHECKPOINTS = {
  1: [
    { lessonId: 1, question: '¿Cuál es el propósito principal de la ingeniería de prompts?', options: ['Hacer preguntas más largas a la IA', 'Dar instrucciones claras para obtener resultados útiles', 'Usar palabras técnicas complicadas'], correct: 1 },
    { lessonId: 2, question: '¿Qué componente NO forma parte de la estructura RTF?', options: ['Rol', 'Tarea', 'Resultado'], correct: 2 },
    { lessonId: 3, question: '¿Por qué es importante dar contexto en un prompt?', options: ['Para que la IA sea más rápida', 'Para obtener respuestas más precisas y relevantes', 'Para usar menos tokens'], correct: 1 },
  ],
  2: [
    { lessonId: 1, question: '¿Qué permite el análisis predictivo con GPT?', options: ['Solo generar texto creativo', 'Anticipar tendencias basadas en datos históricos', 'Reemplazar completamente a los analistas'], correct: 1 },
    { lessonId: 2, question: '¿Qué ventaja tiene crear un GPT personalizado?', options: ['Es más rápido que ChatGPT normal', 'Se especializa en una tarea con instrucciones predefinidas', 'No requiere internet'], correct: 1 },
  ],
  3: [
    { lessonId: 1, question: '¿Qué significa razonamiento multimodal en IA?', options: ['Usar solo texto', 'Combinar múltiples tipos de datos (texto, imágenes, audio)', 'Procesar información en paralelo'], correct: 1 },
    { lessonId: 2, question: '¿Para qué sirve el grounding en tiempo real?', options: ['Para que la IA funcione sin internet', 'Para verificar respuestas con fuentes actualizadas', 'Para entrenar la IA más rápido'], correct: 1 },
  ],
  4: [
    { lessonId: 1, question: '¿Qué es la curaduría de fuentes en investigación con IA?', options: ['Eliminar fuentes que no te gustan', 'Seleccionar y organizar las mejores fuentes para análisis', 'Crear fuentes falsas'], correct: 1 },
    { lessonId: 2, question: '¿Qué beneficio tiene la síntesis de conocimiento?', options: ['Hace los documentos más largos', 'Transforma información compleja en resúmenes accionables', 'Elimina la necesidad de leer'], correct: 1 },
  ],
  5: [
    { lessonId: 1, question: '¿Cuál es el primer paso para integrar herramientas IA?', options: ['Comprar todas las herramientas disponibles', 'Identificar el flujo de trabajo y las necesidades específicas', 'Entrenar un modelo desde cero'], correct: 1 },
    { lessonId: 2, question: '¿Qué caracteriza a un MVP inteligente?', options: ['Tiene todas las funciones posibles', 'Resuelve un problema core con lo mínimo indispensable potenciado por IA', 'Es la versión final del producto'], correct: 1 },
  ],
};

export const useIALabStore = create((set, get) => ({
  // ==================== NAVEGACIÓN ====================
  activeMod: 1,
  setActiveMod: (mod) => set({ activeMod: mod }),
  activeTopic: null,
  setActiveTopic: (topic) => set({ activeTopic: topic }),
  activeTab: 'lab',
  setActiveTab: (tab) => set({ activeTab: tab }),
  visitedModules: [1],
  setVisitedModules: (v) => set(typeof v === 'function' ? { visitedModules: v(get().visitedModules) } : { visitedModules: v }),

  // ==================== LECCIONES (FASE 2) ====================
  lessonProgress: {},
  checkpointAnswers: {},
  lastVisitedLesson: null,

  markLessonComplete: (moduleId, lessonId) => {
    const state = get();
    const progress = { ...state.lessonProgress };
    if (!progress[moduleId]) progress[moduleId] = {};
    if (progress[moduleId][lessonId] === 'completed') return;
    progress[moduleId] = { ...progress[moduleId], [lessonId]: 'completed' };
    set({ lessonProgress: progress });
    get().addXp(50);
    get().recordActivity();
    get().checkAndAwardBadges();
    get().persistGamificationState();
  },

  markLessonInProgress: (moduleId, lessonId) => set((state) => {
    const progress = { ...state.lessonProgress };
    if (!progress[moduleId]) progress[moduleId] = {};
    progress[moduleId] = { ...progress[moduleId], [lessonId]: 'in-progress' };
    return { lessonProgress: progress };
  }),

  recordCheckpointAnswer: (moduleId, lessonId, answerIndex) => set((state) => {
    const answers = { ...state.checkpointAnswers };
    if (!answers[moduleId]) answers[moduleId] = {};
    answers[moduleId] = { ...answers[moduleId], [lessonId]: answerIndex };
    return { checkpointAnswers: answers };
  }),

  setLastVisitedLesson: (moduleId, lessonId) => set({ lastVisitedLesson: { moduleId, lessonId } }),

  getCompletedLessonCount: (moduleId) => {
    const progress = get().lessonProgress[moduleId];
    if (!progress) return 0;
    return Object.values(progress).filter(s => s === 'completed').length;
  },

  getModuleLessons: (moduleId) => {
    const lessons = ALL_LESSONS[moduleId] || [];
    const progress = get().lessonProgress[moduleId] || {};
    return lessons.map((lesson, idx) => {
      const prevLessonId = idx > 0 ? lessons[idx - 1].id : null;
      const prevCompleted = prevLessonId ? progress[prevLessonId] === 'completed' : true;
      const isCompleted = progress[lesson.id] === 'completed';
      const isInProgress = progress[lesson.id] === 'in-progress';
      const status = isCompleted ? 'completed' : isInProgress ? 'in-progress' : (idx === 0 || prevCompleted) ? 'available' : 'locked';
      return { ...lesson, status };
    });
  },

  getNextUncompletedLesson: (moduleId) => {
    const lessons = ALL_LESSONS[moduleId] || [];
    const progress = get().lessonProgress[moduleId] || {};
    return lessons.find(l => progress[l.id] !== 'completed') || null;
  },

  // ==================== GAMIFICACIÓN (FASE 3) ====================
  xp: 0,
  streak: 0,
  lastActivityDate: null,
  startDate: ls.get(LS_KEYS.START_DATE, new Date().toISOString()),
  badges: [],
  forumPostCount: 0,
  forumCommentCount: 0,

  addXp: (amount) => {
    set((state) => ({ xp: state.xp + amount }));
    get().persistGamificationState();
  },

  recordActivity: () => {
    const { lastActivityDate, streak } = get();
    const now = new Date();
    const todayDateStr = now.toDateString();
    const lastDateStr = lastActivityDate ? new Date(lastActivityDate).toDateString() : null;
    if (lastDateStr === todayDateStr) {
      // Mismo día: refrescar timestamp sin modificar streak
      set({ lastActivityDate: now.toISOString() });
      get().persistGamificationState();
      return true;
    }
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = lastDateStr === yesterday ? streak + 1 : 1;
    set({ streak: newStreak, lastActivityDate: now.toISOString() });
    get().persistGamificationState();
    if (newStreak === 3) get().addXp(50);
    if (newStreak === 7) get().addXp(100);
    if (newStreak === 30) get().addXp(500);
    return true;
  },

  getDaysSinceStart: () => {
    const start = get().startDate;
    if (!start) return 1;
    const diff = Date.now() - new Date(start).getTime();
    return Math.max(1, Math.floor(diff / 86400000));
  },

  awardBadge: (badgeId) => {
    const state = get();
    if (state.badges.includes(badgeId)) return state;
    set({ badges: [...state.badges, badgeId] });
    get().persistGamificationState();
  },

  checkAndAwardBadges: () => {
    const state = get();
    const totalLessonsCompleted = Object.values(state.lessonProgress)
      .reduce((sum, mod) => sum + Object.values(mod).filter(s => s === 'completed').length, 0);
    const totalModulesCompleted = state.completedModules.length;
    const newBadges = [];

    if (totalLessonsCompleted >= 1 && !state.badges.includes('first_lesson')) newBadges.push('first_lesson');
    if (totalLessonsCompleted >= 5 && !state.badges.includes('five_lessons')) newBadges.push('five_lessons');
    if (totalLessonsCompleted >= 15 && !state.badges.includes('all_lessons')) newBadges.push('all_lessons');
    if (state.streak >= 3 && !state.badges.includes('streak_3')) newBadges.push('streak_3');
    if (state.streak >= 7 && !state.badges.includes('streak_7')) newBadges.push('streak_7');
    if (totalModulesCompleted >= 1 && !state.badges.includes('first_module')) newBadges.push('first_module');
    if (totalModulesCompleted >= 3 && !state.badges.includes('three_modules')) newBadges.push('three_modules');
    if (totalModulesCompleted >= 5 && !state.badges.includes('all_modules')) newBadges.push('all_modules');

    if (newBadges.length > 0) {
      set({ badges: [...state.badges, ...newBadges] });
      get().persistGamificationState();
    }
  },

  getLevel: () => Math.floor(Math.sqrt(get().xp / 100)) + 1,

  getXpForNextLevel: () => {
    const level = get().getLevel();
    return level * level * 100;
  },

  getLevelProgress: () => {
    const xp = get().xp;
    const level = get().getLevel();
    if (level <= 1) return (xp / 100) * 100;
    const currentLevelXp = (level - 1) * (level - 1) * 100;
    const nextLevelXp = level * level * 100;
    return ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  },

  getTotalXpEarned: () => {
    return get().xp;
  },

  BADGE_INFO: {
    first_lesson: { icon: 'fa-star', label: 'Primeros Pasos', desc: 'Completa tu primera lección', color: '#FFD166' },
    five_lessons: { icon: 'fa-book-open', label: 'Estudiante Dedicado', desc: 'Completa 5 lecciones', color: '#00BCD4' },
    all_lessons: { icon: 'fa-graduation-cap', label: 'Sabio de la IA', desc: 'Completa las 15 lecciones', color: '#10B981' },
    streak_3: { icon: 'fa-fire', label: 'Racha Inicial', desc: '3 días consecutivos', color: '#F59E0B' },
    streak_7: { icon: 'fa-fire', label: 'Racha Imparable', desc: '7 días consecutivos', color: '#EF4444' },
    first_module: { icon: 'fa-trophy', label: 'Primer Módulo', desc: 'Completa tu primer módulo', color: '#8B5CF6' },
    three_modules: { icon: 'fa-award', label: 'Maestro en Progreso', desc: 'Completa 3 módulos', color: '#EC4899' },
    all_modules: { icon: 'fa-crown', label: 'Campeón del Curso', desc: 'Completa los 5 módulos', color: '#FFD166' },
  },

  getUserBadges: () => {
    const state = get();
    return state.badges.map(id => {
      const info = state.BADGE_INFO[id];
      return info ? { id, ...info } : null;
    }).filter(Boolean);
  },

  getBadgesSummary: () => {
    const state = get();
    return {
      total: Object.keys(state.BADGE_INFO).length,
      earned: state.badges.length,
      recent: state.badges.slice(-3).reverse().map(id => {
        const info = state.BADGE_INFO[id];
        return info ? { id, ...info } : null;
      }).filter(Boolean),
    };
  },

  // ==================== PROGRESS GLOBAL ====================
  completedModules: [],
  setCompletedModules: (v) => set(typeof v === 'function' ? { completedModules: v(get().completedModules) } : { completedModules: v }),
  courseProgress: 0,
  setCourseProgress: (v) => set({ courseProgress: v }),
  completedVideos: [],
  completedExams: ls.get(LS_KEYS.COMPLETED_EXAMS, {}),
  completedInfographics: [],
  completedActivities: [],
  challengeScores: {},
  isLoadingProgress: true,
  setIsLoadingProgress: (v) => set({ isLoadingProgress: v }),
  syncStatus: null,
  isUsingJWT: false,
  userId: null,
  userRole: 'student',
  setUserRole: (v) => set({ userRole: v }),

  // ==================== MÓDULO PROGRESS (GAMIFICADO) ====================
  moduleProgress: INITIAL_MODULE_PROGRESS,
  setModuleProgress: (updater) => set((state) => ({
    moduleProgress: typeof updater === 'function' ? updater(state.moduleProgress) : updater,
  })),

  calculateModuleScore: (moduleId) => {
    return calcModuleScore(get().moduleProgress[moduleId]);
  },

  getMemoizedModuleScore: (moduleId) => {
    const state = get();
    return memoize(`modScore_${moduleId}`, () => state.calculateModuleScore(moduleId));
  },

  calculateModulePoints: (moduleId) => {
    const score = get().calculateModuleScore(moduleId);
    return Math.round((score / 100) * 200);
  },

  getTotalPoints: () => {
    let total = 0;
    for (let i = 1; i <= 5; i++) total += get().calculateModulePoints(i);
    return Math.min(1000, total);
  },

  calculateGlobalProgress: () => {
    return calcGlobalProgress(get().moduleProgress);
  },

  getMemoizedGlobalProgress: () => {
    const state = get();
    return memoize('globalProgress', () => state.calculateGlobalProgress());
  },

  isModuleFullyApproved: (moduleId) => {
    const mod = get().moduleProgress[moduleId];
    if (!mod) return false;
    return mod.exam === true
        && mod.challenge === true
        && mod.resourcesCompleted === true
        && mod.currentScore >= 80;
  },

  isCourseCompleted: () => {
    return [1, 2, 3, 4, 5].every(id => {
      const mod = get().moduleProgress[id];
      return mod?.exam === true
          && mod?.challenge === true
          && mod?.resourcesCompleted === true
          && mod?.currentScore >= 80;
    });
  },

  updateModuleActivity: (moduleId, activity, value, score) => {
    const state = get();
    const prevMod = state.moduleProgress[moduleId];
    let newScore = 0;
    let justCompleted = false;

    const updated = { ...prevMod };
    if (activity === 'exam' && typeof score === 'number') {
      updated.examScore = score;
      updated.exam = score >= 80;
      updated.examEarned = (score / 100) * WEIGHTS.exam;
    } else if (activity === 'exam') {
      updated.exam = !!value;
      updated.examEarned = value ? WEIGHTS.exam : 0;
    }
    if (activity === 'challenge' && typeof score === 'number') {
      updated.challengeScore = score;
      updated.challenge = score >= 80;
      updated.challengeEarned = (score / 100) * WEIGHTS.challenge;
    } else if (activity === 'challenge') {
      updated.challenge = !!value;
      updated.challengeEarned = value ? WEIGHTS.challenge : 0;
    }
    if (activity === 'resourcesCompleted') {
      updated.resourcesCompleted = !!value;
    }
    if (activity === 'community') {
      updated.community = !!value;
    }

    updated.currentScore = calcModuleScore(updated);
    newScore = updated.currentScore;

    if ((prevMod?.currentScore || 0) < 80 && updated.currentScore >= 80) {
      justCompleted = true;
    }

    set((s) => {
      const newProgress = { ...s.moduleProgress, [moduleId]: updated };
      const canUnlock = moduleId < 5 && updated.resourcesCompleted && (updated.examScore || 0) >= 80 && (updated.challengeScore || 0) >= 80;
      if (canUnlock) {
        newProgress[moduleId + 1] = { ...newProgress[moduleId + 1], isUnlocked: true };
      }
      const newCompletedExams = { ...s.completedExams };
      if (activity === 'exam' && typeof score === 'number') {
        newCompletedExams[moduleId] = score;
      }
      // Recalcular courseProgress desde todos los módulos
      return { moduleProgress: newProgress, completedExams: newCompletedExams, courseProgress: calcGlobalProgress(newProgress) };
    });

    // Persistir completedExams inmediatamente a localStorage
    if (activity === 'exam' && typeof score === 'number') {
      const current = ls.get(LS_KEYS.COMPLETED_EXAMS, {});
      current[moduleId] = score;
      ls.set(LS_KEYS.COMPLETED_EXAMS, current);
    }

    clearMemoCache();
    return { newScore, justCompleted };
  },

  markResourceAsViewed: (moduleId, resourceId) => {
    set((state) => {
      const mod = state.moduleProgress[moduleId];
      if (!mod) return state;
      const viewedResources = mod.viewedResources || [];
      if (viewedResources.includes(resourceId)) return state;
      const newViewed = [...viewedResources, resourceId];
      const totalResources = MODULE_RESOURCE_COUNTS[moduleId] || 8;
      const resourcesCompleted = newViewed.length >= totalResources;
      const resourcesPct = Math.round((newViewed.length / totalResources) * 100);
      const updated = { ...mod, viewedResources: newViewed, resourcesCompleted, resourcesPct };
      updated.currentScore = calcModuleScore(updated);
      const newProgress = { ...state.moduleProgress, [moduleId]: updated };
      const canUnlock = moduleId < 5 && updated.resourcesCompleted && (updated.examScore || 0) >= 80 && (updated.challengeScore || 0) >= 80;
      if (canUnlock) {
        newProgress[moduleId + 1] = { ...newProgress[moduleId + 1], isUnlocked: true };
      }
      // Recalcular courseProgress desde todos los módulos (solo local, sin DB)
      return { moduleProgress: newProgress, courseProgress: calcGlobalProgress(newProgress) };
    });
  },

  markCommunityComment: (moduleId) => {
    set((state) => {
      const mod = state.moduleProgress[moduleId];
      if (!mod || mod.community) return state;
      const updated = { ...mod, community: true };
      updated.currentScore = calcModuleScore(updated);
      const newProgress = { ...state.moduleProgress, [moduleId]: updated };
      const canUnlock = moduleId < 5 && updated.resourcesCompleted && (updated.examScore || 0) >= 80 && (updated.challengeScore || 0) >= 80;
      if (canUnlock) {
        newProgress[moduleId + 1] = { ...newProgress[moduleId + 1], isUnlocked: true };
      }
      // Recalcular courseProgress desde todos los módulos
      return { moduleProgress: newProgress, courseProgress: calcGlobalProgress(newProgress) };
    });
  },

  isModuleLocked: (moduleId) => {
    if (get().userRole === 'admin') return false;
    if (moduleId === 1) return false;
    return !get().moduleProgress[moduleId]?.isUnlocked;
  },

  isEvaluationLocked: (moduleId) => {
    if (get().userRole === 'admin') return false;
    if (moduleId === 1) return false;
    return !get().completedModules.includes(moduleId - 1);
  },

  // ==================== EVALUACIÓN ====================
  showExamModal: false,
  setShowExamModal: (v) => set({ showExamModal: v }),
  quizAnswers: {},
  setQuizAnswers: (v) => set((state) => ({ quizAnswers: typeof v === 'function' ? v(state.quizAnswers) : v })),
  quizScore: null,
  setQuizScore: (v) => set({ quizScore: v }),
  quizPassed: false,
  setQuizPassed: (v) => set({ quizPassed: v }),
  quizResult: null,
  setQuizResult: (v) => set({ quizResult: v }),
  showScoreResult: false,
  setShowScoreResult: (v) => set({ showScoreResult: v }),
  dailyAttemptsCount: 0,
  setDailyAttemptsCount: (v) => set({ dailyAttemptsCount: v }),
  lastAttemptDate: null,
  setLastAttemptDate: (v) => set({ lastAttemptDate: v }),
  quizAttempts: [],
  setQuizAttempts: (v) => set({ quizAttempts: v }),
  showPremiumEvaluationModal: false,
  setShowPremiumEvaluationModal: (v) => set({ showPremiumEvaluationModal: v }),

  // ==================== SEGURIDAD ====================
  showExitConfirmation: false,
  setShowExitConfirmation: (v) => set({ showExitConfirmation: v }),
  showSecurityWarning: false,
  setShowSecurityWarning: (v) => set({ showSecurityWarning: v }),
  securityWarningCount: 0,
  setSecurityWarningCount: (v) => set({ securityWarningCount: v }),
  screenshotProtectionActive: false,
  setScreenshotProtectionActive: (v) => set({ screenshotProtectionActive: v }),
  securityViolations: 0,
  setSecurityViolations: (v) => set({ securityViolations: v }),
  attemptsPenalized: 0,
  setAttemptsPenalized: (v) => set({ attemptsPenalized: v }),
  keyboardLockActive: false,
  setKeyboardLockActive: (v) => set({ keyboardLockActive: v }),
  showSecurityStatus: false,
  setShowSecurityStatus: (v) => set({ showSecurityStatus: v }),
  securityMessage: '',
  setSecurityMessage: (v) => set({ securityMessage: v }),
  showSecurityMessage: false,
  setShowSecurityMessage: (v) => set({ showSecurityMessage: v }),

  // ==================== TIMER ====================
  suggestedTime: 25 * 60,
  timeElapsed: 0,
  setTimeElapsed: (v) => set({ timeElapsed: v }),
  isTimerRunning: false,
  setIsTimerRunning: (v) => set({ isTimerRunning: v }),
  showTimeWarning: false,
  setShowTimeWarning: (v) => set({ showTimeWarning: v }),

  // ==================== NAVEGACIÓN QUIZ ====================
  currentQuestion: 0,
  setCurrentQuestion: (v) => set({ currentQuestion: v }),
  currentPage: 1,
  setCurrentPage: (v) => set({ currentPage: v }),

  // ==================== SIDEBAR ====================
  sidebarDropdowns: { videos: false, recursos: false },
  setSidebarDropdowns: (v) => set({ sidebarDropdowns: v }),
  toggleSidebarDropdown: (section) => set((s) => ({
    sidebarDropdowns: { ...s.sidebarDropdowns, [section]: !s.sidebarDropdowns[section] },
  })),

  // ==================== ACORDEONES ====================
  openAccordions: {},
  setOpenAccordions: (v) => set({ openAccordions: v }),
  visibleAccordions: [],
  setVisibleAccordions: (v) => set({ visibleAccordions: v }),

  // ==================== FORO ====================
  insightsExpanded: false,
  setInsightsExpanded: (v) => set({ insightsExpanded: v }),

  // ==================== SINTETIZADOR ====================
  input: '',
  setInput: (v) => set({ input: v }),
  genData: null,
  setGenData: (v) => set({ genData: v }),
  loading: false,
  setLoading: (v) => set({ loading: v }),
  loadMsg: '',
  setLoadMsg: (v) => set({ loadMsg: v }),

  // ==================== VALERIO (COACH IA) ====================
  coachQ: '',
  setCoachQ: (v) => set({ coachQ: v }),
  coachMsg: '',
  setCoachMsg: (v) => set({ coachMsg: v }),
  coachLoad: false,
  setCoachLoad: (v) => set({ coachLoad: v }),
  isListening: false,
  setIsListening: (v) => set({ isListening: v }),
  avatarState: 'idle',
  setAvatarState: (v) => set({ avatarState: v }),
  showValerioDrawer: false,
  setShowValerioDrawer: (v) => set({ showValerioDrawer: v }),

  // ==================== USUARIO ====================
  showProfileDropdown: false,
  setShowProfileDropdown: (v) => set({ showProfileDropdown: v }),
  showEvaluationTooltip: false,
  setShowEvaluationTooltip: (v) => set({ showEvaluationTooltip: v }),

  // ==================== CERTIFICADO ====================
  certName: '',
  setCertName: (v) => set({ certName: v }),
  showNameModal: false,
  setShowNameModal: (v) => set({ showNameModal: v }),
  courseCompleted: false,
  setCourseCompleted: (v) => set({ courseCompleted: v }),
  showCertificateModal: false,
  setShowCertificateModal: (v) => set({ showCertificateModal: v }),
  storedCertificate: null,
  setStoredCertificate: (v) => set({ storedCertificate: v }),
  certificateGenerating: false,
  setCertificateGenerating: (v) => set({ certificateGenerating: v }),

  // ==================== EVALUACIÓN ANTIGUA ====================
  evalAnswers: {},
  setEvalAnswers: (v) => set({ evalAnswers: v }),
  evalSubmitted: false,
  setEvalSubmitted: (v) => set({ evalSubmitted: v }),
  evalScore: 0,
  setEvalScore: (v) => set({ evalScore: v }),

  // ==================== BOTONES FUNCIONALES ====================
  currentLessonIndex: 0,
  setCurrentLessonIndex: (v) => set({ currentLessonIndex: v }),
  isSynthesizerOpen: false,
  setIsSynthesizerOpen: (v) => set({ isSynthesizerOpen: v }),
  isMarkingComplete: false,
  setIsMarkingComplete: (v) => set({ isMarkingComplete: v }),
  isSubmittingQuiz: false,
  setIsSubmittingQuiz: (v) => set({ isSubmittingQuiz: v }),
  isQuizValid: false,
  setIsQuizValid: (v) => set({ isQuizValid: v }),

  // ==================== DESAFÍO ====================
  isStartingChallenge: false,
  setIsStartingChallenge: (v) => set({ isStartingChallenge: v }),
  isButtonDisabled: false,
  setIsButtonDisabled: (v) => set({ isButtonDisabled: v }),
  isChallengeCompleted: false,
  setIsChallengeCompleted: (v) => set({ isChallengeCompleted: v }),
  challengeScore: 0,
  setChallengeScore: (v) => set({ challengeScore: v }),

  // ==================== DISPOSITIVO ====================
  isTouchDevice: false,
  setIsTouchDevice: (v) => set({ isTouchDevice: v }),
  isIOS: false,
  setIsIOS: (v) => set({ isIOS: v }),
  isAndroid: false,
  setIsAndroid: (v) => set({ isAndroid: v }),

  // ==================== DATOS ESTÁTICOS ====================
  modules,
  LAST_MODULE_ID,
  ALL_LESSONS,
  CHECKPOINTS,
  module1Lessons: [
    { id: 1, title: 'Introducción a la Inteligencia Artificial Generativa', description: 'Comprende los fundamentos de la IA generativa', detailedDescription: 'Comprende los fundamentos de la IA generativa y su aplicación en educación. Aprende cómo los modelos como GPT-4 transforman la creación de contenido educativo.', duration: '20 min', format: 'Reading', icon: 'fa-brain', badgeColor: 'bg-yellow-100 text-yellow-800', themeColor: '#FFD166' },
    { id: 2, title: '¿Qué es un Prompt?', description: 'Domina el arte de comunicarte con IA', detailedDescription: 'Domina el arte de comunicarte con IA. Un prompt efectivo es la diferencia entre resultados genéricos y soluciones personalizadas.', duration: '20 min', format: 'Lab', icon: 'fa-comments', badgeColor: 'bg-indigo-100 text-indigo-800', themeColor: '#4F46E5' },
    { id: 3, title: 'Estructura Básica de un Prompt Efectivo', description: 'Aprende la fórmula mágica de prompts', detailedDescription: 'Aprende la fórmula mágica: Contexto + Instrucción + Formato = Resultado preciso. Desglose paso a paso con ejemplos reales.', duration: '20 min', format: 'Video', icon: 'fa-sitemap', badgeColor: 'bg-green-100 text-green-800', themeColor: '#10B981' },
  ],

  // ==================== LOCALSTORAGE CENTRALIZADO ====================
  getViewedResources: () => ls.get(LS_KEYS.VIEWED_RESOURCES, []),
  setViewedResources: (ids) => ls.set(LS_KEYS.VIEWED_RESOURCES, ids),
  addViewedResource: (id) => {
    const viewed = get().getViewedResources();
    if (!viewed.includes(id)) {
      const updated = [...viewed, id];
      ls.set(LS_KEYS.VIEWED_RESOURCES, updated);
    }
  },

  getCompletedVideos: () => ls.get(LS_KEYS.COMPLETED_VIDEOS, []),
  setCompletedVideos: (ids) => ls.set(LS_KEYS.COMPLETED_VIDEOS, ids),

  hasStartedCourse: () => {
    const state = get();
    const videos = state.getCompletedVideos();
    if (videos.length > 0) return true;
    return Object.values(state.moduleProgress).some(m => m.exam || m.challenge || m.resourcesCompleted);
  },

  markVideoComplete: (id) => {
    const completed = get().getCompletedVideos();
    if (!completed.includes(id)) {
      const updated = [...completed, id];
      ls.set(LS_KEYS.COMPLETED_VIDEOS, updated);
      set({ completedVideos: updated });
    }
  },

  syncFromPersistence: (data) => {
    const state = get();

    // Cargar completedExams: EL STORE SIEMPRE GANA (fuente más reciente)
    let persistedExams = { ...(data.completedExams || {}), ...state.completedExams };
    if (Object.keys(persistedExams).length === 0) {
      persistedExams = ls.get(LS_KEYS.COMPLETED_EXAMS, {});
    }

    // courseProgress: NUNCA sobrescribir con 0 si el store tiene un valor calculado.
    // El store recalcula courseProgress desde moduleProgress en cada mutación,
    // así que su valor es siempre correcto. Solo aceptar el de ProgressContext
    // si el store está en 0 (inicial) y ProgressContext trae un valor positivo.
    const storeProgress = state.courseProgress;
    const incomingProgress = data.courseProgress;
    const effectiveProgress = (storeProgress > 0 && incomingProgress > 0)
      ? Math.max(storeProgress, incomingProgress)
      : (storeProgress > 0 ? storeProgress : (incomingProgress > 0 ? incomingProgress : 0));

    // Cargar estado de gamificación: merge localStorage + Supabase (server wins for cumulative values)
    const localGamification = state.loadGamificationState();
    const remoteGamification = data.gamification;
    const mergedGamification = remoteGamification ? {
      xp: Math.max(localGamification.xp, remoteGamification.xp || 0),
      streak: Math.max(localGamification.streak, remoteGamification.streak || 0),
      lastActivityDate: [localGamification.lastActivityDate, remoteGamification.lastActivityDate].filter(Boolean).sort().pop() || null,
      badges: [...new Set([...(localGamification.badges || []), ...(remoteGamification.badges || [])])],
      lessonProgress: { ...(remoteGamification.lessonProgress || {}), ...(localGamification.lessonProgress || {}) },
      checkpointAnswers: { ...(remoteGamification.checkpointAnswers || {}), ...(localGamification.checkpointAnswers || {}) },
      forumPostCount: Math.max(localGamification.forumPostCount || 0, remoteGamification.forumPostCount || 0),
      forumCommentCount: Math.max(localGamification.forumCommentCount || 0, remoteGamification.forumCommentCount || 0),
      startDate: remoteGamification.startDate || localGamification.startDate,
    } : localGamification;
    set({
      completedModules: data.completedModules ?? state.completedModules,
      completedVideos: data.completedVideos ?? state.completedVideos,
      completedExams: persistedExams,
      completedInfographics: data.completedInfographics ?? state.completedInfographics,
      completedActivities: data.completedActivities ?? state.completedActivities,
      challengeScores: data.challengeScores ?? state.challengeScores,
      courseProgress: effectiveProgress,
      syncStatus: data.syncStatus ?? state.syncStatus,
      isUsingJWT: data.isUsingJWT ?? state.isUsingJWT,
      userId: data.userId ?? state.userId,
      userRole: data.userRole ?? state.userRole,
      isLoadingProgress: data.isLoading ?? state.isLoadingProgress,
      lessonProgress: mergedGamification.lessonProgress,
      xp: mergedGamification.xp,
      streak: mergedGamification.streak,
      lastActivityDate: mergedGamification.lastActivityDate,
      badges: mergedGamification.badges,
      checkpointAnswers: mergedGamification.checkpointAnswers,
      forumPostCount: mergedGamification.forumPostCount,
      forumCommentCount: mergedGamification.forumCommentCount,
      startDate: mergedGamification.startDate || state.loadGamificationState().startDate || new Date().toISOString(),
    });
  },

  clearProgressFromStorage: () => {
    Object.values(LS_KEYS).forEach(key => ls.remove(key));
  },

  getBookmarkedResources: () => ls.get(LS_KEYS.BOOKMARKED_RESOURCES, []),
  setBookmarkedResources: (ids) => ls.set(LS_KEYS.BOOKMARKED_RESOURCES, ids),
  addBookmarkedResource: (id) => {
    const bookmarked = get().getBookmarkedResources();
    if (!bookmarked.includes(id)) {
      ls.set(LS_KEYS.BOOKMARKED_RESOURCES, [...bookmarked, id]);
    }
  },
  removeBookmarkedResource: (id) => {
    const bookmarked = get().getBookmarkedResources();
    ls.set(LS_KEYS.BOOKMARKED_RESOURCES, bookmarked.filter((b) => b !== id));
  },
  toggleBookmark: (id) => {
    const bookmarked = get().getBookmarkedResources();
    if (bookmarked.includes(id)) {
      get().removeBookmarkedResource(id);
    } else {
      get().addBookmarkedResource(id);
    }
  },

  getValerioWelcomed: () => ls.get(LS_KEYS.VALERIO_WELCOMED, false),
  setValerioWelcomed: () => ls.set(LS_KEYS.VALERIO_WELCOMED, true),

  getSidebarState: (fallback) => ls.get(LS_KEYS.SIDEBAR_STATE, fallback),
  setSidebarState: (data) => ls.set(LS_KEYS.SIDEBAR_STATE, data),
  removeSidebarState: () => ls.remove(LS_KEYS.SIDEBAR_STATE),

  getProgressCache: () => ls.get(LS_KEYS.PROGRESS_CACHE, null),
  setProgressCache: (data) => ls.set(LS_KEYS.PROGRESS_CACHE, data),
  removeProgressCache: () => ls.remove(LS_KEYS.PROGRESS_CACHE),

  getSecurityWarningsResetDate: () => ls.get(LS_KEYS.SECURITY_WARNINGS_RESET, null),
  setSecurityWarningsResetDate: (date) => ls.set(LS_KEYS.SECURITY_WARNINGS_RESET, date),

  getSettings: () => ls.get(LS_KEYS.SETTINGS, null),
  setSettings: (data) => ls.set(LS_KEYS.SETTINGS, data),

  // Generic storage helpers for dynamic keys (quizAttempts_m*, challenge_attempts_m*, etc.)
  storageGet: (key, fallback = null) => ls.get(key, fallback),
  storageSet: (key, value) => ls.set(key, value),
  storageRemove: (key) => ls.remove(key),
  storageGetInt: (key, fallback = 0) => {
    const val = ls.get(key, null);
    return val !== null ? parseInt(val, 10) : fallback;
  },
  storageSetString: (key, value) => {
    ls.set(key, value);
  },

  // ==================== PERSISTENCIA DE GAMIFICACIÓN ====================
  persistGamificationState: () => {
    const state = get();
    ls.set(LS_KEYS.LESSON_PROGRESS, state.lessonProgress);
    ls.set(LS_KEYS.XP, state.xp);
    ls.set(LS_KEYS.STREAK, state.streak);
    ls.set(LS_KEYS.LAST_ACTIVITY_DATE, state.lastActivityDate);
    ls.set(LS_KEYS.BADGES, state.badges);
    ls.set(LS_KEYS.CHECKPOINT_ANSWERS, state.checkpointAnswers);
    ls.set(LS_KEYS.FORUM_POST_COUNT, state.forumPostCount);
    ls.set(LS_KEYS.FORUM_COMMENT_COUNT, state.forumCommentCount);
    ls.set(LS_KEYS.START_DATE, state.startDate);
  },

  loadGamificationState: () => {
    const lessonProgress = ls.get(LS_KEYS.LESSON_PROGRESS, {});
    const xp = ls.get(LS_KEYS.XP, 0);
    const streak = ls.get(LS_KEYS.STREAK, 0);
    const lastActivityDate = ls.get(LS_KEYS.LAST_ACTIVITY_DATE, null);
    const badges = ls.get(LS_KEYS.BADGES, []);
    const checkpointAnswers = ls.get(LS_KEYS.CHECKPOINT_ANSWERS, {});
    const forumPostCount = ls.get(LS_KEYS.FORUM_POST_COUNT, 0);
    const forumCommentCount = ls.get(LS_KEYS.FORUM_COMMENT_COUNT, 0);
    const startDate = ls.get(LS_KEYS.START_DATE, null);
    return { lessonProgress, xp, streak, lastActivityDate, badges, checkpointAnswers, forumPostCount, forumCommentCount, startDate };
  },

  // ==================== LÍMITE DE INTENTOS PARA DESAFÍOS ====================
  CHALLENGE_MAX_ATTEMPTS: 3,
  CHALLENGE_COOLDOWN_MS: 12 * 60 * 60 * 1000, // 12 horas

  getChallengeRemainingAttempts: (moduleId) => {
    const key = `challenge_attempts_remaining_m${moduleId}`;
    return ls.get(key, 3);
  },

  getNextAttemptTime: (moduleId) => {
    const key = `challenge_next_attempt_m${moduleId}`;
    return ls.get(key, null);
  },

  canAttemptChallengeRetry: (moduleId) => {
    const key = `challenge_attempts_remaining_m${moduleId}`;
    const remaining = ls.get(key, 3);
    if (remaining <= 0) return false;
    const nextKey = `challenge_next_attempt_m${moduleId}`;
    const nextTime = ls.get(nextKey, null);
    if (nextTime && Date.now() < nextTime) return false;
    return true;
  },

  decrementChallengeAttempt: (moduleId) => {
    const key = `challenge_attempts_remaining_m${moduleId}`;
    const current = ls.get(key, 3);
    const newVal = Math.max(0, current - 1);
    ls.set(key, newVal);
    const nextKey = `challenge_next_attempt_m${moduleId}`;
    ls.set(nextKey, Date.now() + 12 * 60 * 60 * 1000);
    return newVal;
  },

  // ==================== LÍMITE DE INTENTOS PARA EXÁMENES ====================
  EXAM_MAX_ATTEMPTS: 3,
  EXAM_COOLDOWN_MS: 12 * 60 * 60 * 1000, // 12 horas

  getExamRemainingAttempts: (moduleId) => {
    const key = `exam_attempts_remaining_m${moduleId}`;
    return ls.get(key, 3);
  },

  getExamNextAttemptTime: (moduleId) => {
    const key = `exam_next_attempt_m${moduleId}`;
    return ls.get(key, null);
  },

  canAttemptExamRetry: (moduleId) => {
    const key = `exam_attempts_remaining_m${moduleId}`;
    const remaining = ls.get(key, 3);
    if (remaining <= 0) return false;
    const nextKey = `exam_next_attempt_m${moduleId}`;
    const nextTime = ls.get(nextKey, null);
    if (nextTime && Date.now() < nextTime) return false;
    return true;
  },

  decrementExamAttempt: (moduleId) => {
    const key = `exam_attempts_remaining_m${moduleId}`;
    const current = ls.get(key, 3);
    const newVal = Math.max(0, current - 1);
    ls.set(key, newVal);
    const nextKey = `exam_next_attempt_m${moduleId}`;
    ls.set(nextKey, Date.now() + 12 * 60 * 60 * 1000);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('ialab:attemptsUpdated'));
    return newVal;
  },

  canAttemptChallenge: () => { return true; },

  // ==================== FUNCIONES COMPUESTAS ====================
  getCurrentModule: () => {
    const state = get();
    return state.modules.find(m => m.id === state.activeMod) || state.modules[0];
  },

  checkCourseCompletion: () => {
    const state = get();
    const modulesApprovedByScore = [1, 2, 3, 4, 5].filter(id => state.calculateModuleScore(id) >= 80).length;
    const modulesInContext = state.completedModules.length;
    const effectiveModulesCompleted = Math.max(modulesApprovedByScore, modulesInContext);
    const examsInContext = Object.values(state.completedExams).filter(s => typeof s === 'number' ? s >= 80 : s).length;
    const examsByScore = [1, 2, 3, 4, 5].filter(id => state.moduleProgress[id]?.exam).length;
    const effectiveExamsCompleted = Math.max(examsInContext, examsByScore);
    const progressThreshold = state.courseProgress >= 80;
    const isCompleted = effectiveModulesCompleted >= 5 && progressThreshold;
    set({ courseCompleted: isCompleted });
    return isCompleted;
  },

  // ==================== RUTA DIARIA (FASE 7) ====================
  generateModuleActivityList: (moduleId) => {
    const state = get();
    const lessons = ALL_LESSONS[moduleId] || [];
    const lessonProg = state.lessonProgress[moduleId] || {};
    const modProg = state.moduleProgress[moduleId];
    const activities = [];

    lessons.forEach((lesson, idx) => {
      const isCompleted = lessonProg[lesson.id] === 'completed';
      const prevLessonId = idx > 0 ? lessons[idx - 1].id : null;
      const prevCompleted = prevLessonId ? lessonProg[prevLessonId] === 'completed' : true;
      const isInProgress = lessonProg[lesson.id] === 'in-progress';

      let status;
      if (isCompleted) status = 'completed';
      else if (isInProgress) status = 'in-progress';
      else if (idx === 0 || prevCompleted) status = 'available';
      else status = 'locked';

      activities.push({
        type: 'lesson',
        id: `lesson-${lesson.id}`,
        lessonId: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        xp: '+50 XP',
        status,
        icon: lesson.icon,
        description: lesson.description,
        objectives: lesson.objectives,
      });
    });

    const allLessonsDone = lessons.every(l => lessonProg[l.id] === 'completed');
    const examDone = modProg?.exam;
    activities.push({
      type: 'exam',
      id: `exam-${moduleId}`,
      title: 'Examen del Módulo',
      duration: '30 min',
      xp: '+100 XP',
      status: examDone ? 'completed' : (allLessonsDone ? 'available' : 'locked'),
      description: examDone ? 'Completado' : (allLessonsDone ? 'Disponible ahora' : 'Completa todas las lecciones primero'),
    });

    const challengeDone = modProg?.challenge;
    const modScore = state.calculateModuleScore(moduleId);
    const scoreReady = modScore >= 80;
    activities.push({
      type: 'challenge',
      id: `challenge-${moduleId}`,
      title: 'Desafío del Módulo',
      duration: '45 min',
      xp: '+200 XP',
      status: challengeDone ? 'completed' : (scoreReady ? 'available' : 'locked'),
      description: challengeDone ? 'Completado' : (scoreReady ? 'Disponible ahora' : 'Requiere nota ≥80 en el módulo'),
    });

    const communityDone = modProg?.community;
    activities.push({
      type: 'community',
      id: `community-${moduleId}`,
      title: 'Participación en Comunidad',
      duration: '10 min',
      xp: '+15 XP',
      status: communityDone ? 'completed' : 'available',
      description: communityDone ? 'Completado' : 'Participa en el foro del módulo',
    });

    return activities;
  },

  determinePrimaryAction: (moduleId, activities, nextModuleData) => {
    const state = get();
    const lastVisited = state.lastVisitedLesson;

    if (lastVisited && lastVisited.moduleId === moduleId) {
      const lastAct = activities.find(
        a => a.type === 'lesson' && a.lessonId === lastVisited.lessonId && a.status !== 'completed'
      );
      if (lastAct) return { ...lastAct, actionType: 'resume_lesson' };
    }

    const nextLesson = activities.find(
      a => a.type === 'lesson' && (a.status === 'available' || a.status === 'in-progress')
    );
    if (nextLesson) return { ...nextLesson, actionType: 'next_lesson' };

    const exam = activities.find(a => a.type === 'exam' && a.status === 'available');
    if (exam) return { ...exam, actionType: 'take_exam' };

    const challenge = activities.find(a => a.type === 'challenge' && a.status === 'available');
    if (challenge) return { ...challenge, actionType: 'take_challenge' };

    const community = activities.find(a => a.type === 'community' && a.status === 'available');
    if (community) return { ...community, actionType: 'community' };

    if (nextModuleData) {
      return {
        actionType: 'next_module',
        nextModuleId: nextModuleData.id,
        title: nextModuleData.title,
        duration: nextModuleData.duration,
        description: nextModuleData.desc || `Tiene ${nextModuleData.totalLessons} lecciones por completar`,
      };
    }

    return { actionType: 'course_complete' };
  },

  getDailyRoute: () => {
    const state = get();
    const { activeMod, moduleProgress, modules: mods, completedModules, xp, streak, courseProgress, lessonProgress } = state;

    const currentModData = mods.find(m => m.id === activeMod);
    const currentLessons = ALL_LESSONS[activeMod] || [];
    const currentLessonProg = lessonProgress[activeMod] || {};
    const completedCount = Object.values(currentLessonProg).filter(s => s === 'completed').length;
    const totalLessons = currentLessons.length;
    const currentActivities = state.generateModuleActivityList(activeMod);

    let nextModData = null;
    for (let i = activeMod + 1; i <= 5; i++) {
      const mp = moduleProgress[i];
      if (mp?.isUnlocked) {
        const modInfo = mods.find(m => m.id === i);
        const lessonP = lessonProgress[i] || {};
        const lessonsDone = Object.values(lessonP).filter(s => s === 'completed').length;
        const totalLess = (ALL_LESSONS[i] || []).length;
        const modScore = state.calculateModuleScore(i);
        if (lessonsDone < totalLess || modScore < 80) {
          nextModData = { ...modInfo, totalLessons: totalLess, completedLessons: lessonsDone };
          break;
        }
      }
    }

    const allModulesComplete = [1, 2, 3, 4, 5].every(id => state.calculateModuleScore(id) >= 80);
    const primaryAction = state.determinePrimaryAction(activeMod, currentActivities, nextModData);

    return {
      currentModule: {
        id: activeMod,
        title: currentModData?.title || `Módulo ${activeMod}`,
        icon: currentModData?.icon || 'fa-book',
        color: currentModData?.color || '#004B63',
        completedLessons: completedCount,
        totalLessons,
        progressPct: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
        moduleScore: state.calculateModuleScore(activeMod),
        isApproved: state.calculateModuleScore(activeMod) >= 80,
        activities: currentActivities,
      },
      nextModule: nextModData && !allModulesComplete ? {
        id: nextModData.id,
        title: nextModData.title,
        icon: nextModData.icon,
        color: nextModData.color,
        completedLessons: nextModData.completedLessons || 0,
        totalLessons: nextModData.totalLessons,
        duration: nextModData.duration,
        level: nextModData.level,
        description: nextModData.desc,
      } : null,
      primaryAction,
      overview: {
        completedModules: completedModules.length,
        totalModules: 5,
        xp,
        streak,
        courseProgress,
        allModulesComplete,
      },
    };
  },

  getLatestQuizAttempt: () => {
    const attempts = get().quizAttempts;
    return attempts.length > 0 ? attempts[attempts.length - 1] : null;
  },

  // ==================== FASE A: ANALÍTICA AVANZADA ====================

  getWeeklyXP: () => {
    const state = get();
    const xp = state.xp;
    const startDate = state.startDate;
    if (!startDate) return { weekly: xp, weeklyTarget: 500, weeklyPct: Math.min(100, (xp / 500) * 100) };
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const weekStart = start > monday ? start : monday;
    const daysSinceWeekStart = Math.max(0, Math.floor((now - weekStart) / 86400000));
    const dailyAvg = daysSinceWeekStart > 0 ? xp / daysSinceWeekStart : xp;
    const weeklyTarget = 500;
    const weeklyXp = Math.round(Math.min(xp, weeklyTarget));
    const weeklyPct = Math.min(100, (weeklyXp / weeklyTarget) * 100);
    return { weekly: weeklyXp, weeklyTarget, weeklyPct, dailyAvg: Math.round(dailyAvg) };
  },

  getModuleDominanceLevel: (moduleId) => {
    const score = get().calculateModuleScore(moduleId);
    if (score >= 80) return { label: 'Experto', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (score >= 50) return { label: 'Avanzado', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    if (score >= 25) return { label: 'Intermedio', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { label: 'Básico', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' };
  },

  getDetailedRecommendations: () => {
    const state = get();
    const recs = [];
    for (let id = 1; id <= 5; id++) {
      const score = state.calculateModuleScore(id);
      const mod = state.moduleProgress[id];
      if (!mod) continue;
      if (score >= 80) continue;
      const modName = state.modules.find(m => m.id === id)?.title || `Módulo ${id}`;
      const resourcesLeft = mod.viewedResources ? (8 - mod.viewedResources.length) : 8;
      const examScore = mod.examScore || state.completedExams[id] || 0;
      const challengeScore = mod.challengeScore || state.challengeScores[id] || 0;
      if (resourcesLeft > 0) {
        recs.push({ moduleId: id, moduleName: modName, type: 'resources', text: `Te faltan ${resourcesLeft} recursos por ver en ${modName}`, urgency: resourcesLeft > 4 ? 'high' : 'medium' });
      }
      if (examScore > 0 && examScore < 80) {
        recs.push({ moduleId: id, moduleName: modName, type: 'exam', text: `Puedes mejorar tu examen de ${modName} (${examScore}%)`, urgency: 'high' });
      } else if (examScore === 0 && resourcesLeft <= 2) {
        recs.push({ moduleId: id, moduleName: modName, type: 'exam', text: `Rinde el examen de ${modName}`, urgency: 'high' });
      }
      if (challengeScore > 0 && challengeScore < 80) {
        recs.push({ moduleId: id, moduleName: modName, type: 'challenge', text: `Mejora tu desafío de ${modName} (${challengeScore}%)`, urgency: 'medium' });
      } else if (challengeScore === 0 && score >= 60) {
        recs.push({ moduleId: id, moduleName: modName, type: 'challenge', text: `Completa el desafío de ${modName}`, urgency: 'medium' });
      }
    }
    return recs;
  },
}));
