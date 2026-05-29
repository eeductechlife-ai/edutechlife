/**
 * @typedef {{ id: number, title: string, description: string, duration: string, type: string, hasMedia: boolean, icon: string, objectives: string[] }} Lesson
 * @typedef {{ id: number, title: string, icon: string, color: string, topics: string[], challenge: string, desc: string, duration: string, level: string, videos: number, projects: number }} Module
 * @typedef {{ id: string, topic: string, correctAnswer: string }} ModuleQuestion
 * @typedef {{ lessonId: number, question: string, options: string[], correct: number }} Checkpoint
 * @typedef {{ icon: string, label: string, desc: string, color: string }} BadgeInfo
 */

/** @type {Module[]} */
export const modules = [
  { id: 1, title: 'Ingeniería de Prompts', icon: 'fa-terminal', color: '#4DA8C4', topics: ['Dar instrucciones claras a la IA', 'Mejorar cualquier pregunta para obtener mejores respuestas', 'Entender por qué la IA falla y cómo corregirlo', 'Obtener resultados útiles en menos tiempo', 'Aplicar la IA en estudio, trabajo y vida diaria', 'Pedir exactamente lo que necesita, sin rodeos'], challenge: '¡Llegó el momento de la práctica! Aplica todo lo aprendido en este módulo resolviendo un caso real. Atrévete a consolidar tu aprendizaje, supera el reto y lleva tus conocimientos al siguiente nivel.', desc: 'En este módulo, hemos diseñado una ruta estratégica que te llevará desde los fundamentos de la Inteligencia Artificial Generativa hasta la creación de instrucciones de alto impacto. Tu misión: Explorar cada tema y sus recursos multimedia (videos, guías y laboratorios). Notarás que tu barra de progreso cobrará vida con cada paso que des. No te detengas: cada recurso completado te acerca un 20% más a tu certificación global. ¡El poder de las instrucciones claras está en tus manos!', duration: '2h', level: 'Avanzado', videos: 12, projects: 3 },
  { id: 2, title: 'Potencia ChatGPT', icon: 'fa-robot', color: '#66CCCC', topics: ['Análisis Predictivo', 'GPTs Personalizados', 'Function Calling', 'System Prompts'], challenge: 'Crea un GPT personalizado para automatizar una tarea de tu área profesional y conéctalo con una API externa usando Function Calling.', desc: 'Conviértete en un experto en ChatGPT: domina system prompts, crea GPTs personalizados y automatiza tu trabajo.', duration: '2h', level: 'Avanzado', videos: 15, projects: 4 },
  { id: 3, title: 'Rastreo Profundo', icon: 'fa-search', color: '#B2D8E5', topics: ['Razonamiento Multimodal', 'Grounding Real-Time', 'Deep Research', 'Fact-Checking IA'], challenge: 'Usa Gemini Deep Research para investigar un tema de actualidad, verifica cada fuente citada y presenta un informe profesional con conclusiones propias.', desc: 'Domina Google Gemini para investigar, verificar datos y analizar información como un profesional.', duration: '2h', level: 'Intermedio', videos: 10, projects: 2 },
  { id: 4, title: 'Inmersión NotebookLM', icon: 'fa-microphone', color: '#004B63', topics: ['Curaduría de Fuentes', 'Síntesis de Conocimiento', 'Audio Overviews', 'Gestión Documental'], challenge: 'Genera un podcast analizando 5 papers sobre neuro-plasticidad.', desc: 'Transforma PDFs y documentos en resúmenes inteligentes, podcasts y asistentes de investigación personalizados.', duration: '2h', level: 'Intermedio', videos: 8, projects: 3 },
  { id: 5, title: 'Proyecto Disruptivo', icon: 'fa-trophy', color: '#FFD166', topics: ['Integración Total', 'MVP Inteligente', 'Pitch Deck IA', 'Roadmap Estratégico'], challenge: 'Analiza un caso real de sesgo algorítmico en IA y propón un protocolo ético para prevenir y mitigar este tipo de discriminación.', desc: 'Aplica todo lo aprendido en un proyecto de impacto real.', duration: '2h', level: 'Experto', videos: 6, projects: 5 },
];

/** @type {Module[]} */
export const modules_en = [
  { id: 1, title: 'Prompt Engineering', icon: 'fa-terminal', color: '#4DA8C4', topics: ['Giving clear instructions to AI', 'Improving any question for better answers', 'Understanding why AI fails and how to fix it', 'Getting useful results faster', 'Applying AI in study, work, and daily life', 'Asking exactly what you need, no beating around the bush'], challenge: "It's practice time! Apply everything you've learned in this module by solving a real-world case. Consolidate your knowledge, overcome the challenge, and take your skills to the next level.", desc: 'In this module, we have designed a strategic path that will take you from the fundamentals of Generative AI to creating high-impact prompts. Your mission: Explore each topic and its multimedia resources (videos, guides, and labs). Your progress bar will come to life with every step you take. Keep going: each completed resource brings you 20% closer to your global certification. The power of clear instructions is in your hands!', duration: '2h', level: 'Advanced', videos: 12, projects: 3 },
  { id: 2, title: 'Power Up ChatGPT', icon: 'fa-robot', color: '#66CCCC', topics: ['Predictive Analytics', 'Custom GPTs', 'Function Calling', 'System Prompts'], challenge: 'Create a custom GPT to automate a task from your professional field and connect it with an external API using Function Calling.', desc: 'Become a ChatGPT expert: master system prompts, create custom GPTs, and automate your workflow.', duration: '2h', level: 'Advanced', videos: 15, projects: 4 },
  { id: 3, title: 'Deep Research', icon: 'fa-search', color: '#B2D8E5', topics: ['Multimodal Reasoning', 'Real-Time Grounding', 'Deep Research', 'AI Fact-Checking'], challenge: 'Use Gemini Deep Research to investigate a current topic, verify every cited source, and present a professional report with your own conclusions.', desc: 'Master Google Gemini to research, verify data, and analyze information like a professional.', duration: '2h', level: 'Intermediate', videos: 10, projects: 2 },
  { id: 4, title: 'NotebookLM Immersion', icon: 'fa-microphone', color: '#004B63', topics: ['Source Curation', 'Knowledge Synthesis', 'Audio Overviews', 'Document Management'], challenge: 'Generate a podcast analyzing 5 papers about neuroplasticity.', desc: 'Transform PDFs and documents into smart summaries, podcasts, and personalized research assistants.', duration: '2h', level: 'Intermediate', videos: 8, projects: 3 },
  { id: 5, title: 'Disruptive Project', icon: 'fa-trophy', color: '#FFD166', topics: ['Total Integration', 'Smart MVP', 'AI Pitch Deck', 'Strategic Roadmap'], challenge: 'Analyze a real case of algorithmic bias in AI and propose an ethical protocol to prevent and mitigate this type of discrimination.', desc: 'Apply everything you have learned in a real-impact project.', duration: '2h', level: 'Expert', videos: 6, projects: 5 },
];

/** @type {Record<number, Lesson[]>} */
export const ALL_LESSONS = {
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

/** @type {Record<number, Lesson[]>} */
export const ALL_LESSONS_EN = {
  1: [
    { id: 1, title: 'Generative AI: Your First Step', description: 'Discover how generative AI is transforming education and master the key concepts to apply it starting today.', duration: '20 min', type: 'teoría', hasMedia: true, icon: 'fa-brain', objectives: ['Understand what generative AI is and how it works', 'Identify practical applications in education', 'Recognize limitations and ethical considerations'] },
    { id: 2, title: 'The Power of a Good Prompt', description: 'Learn to communicate with AI like an expert: the right prompt makes the difference between a generic result and a custom solution.', duration: '20 min', type: 'práctica', hasMedia: true, icon: 'fa-comments', objectives: ['Define what a prompt is and its role in AI communication', 'Differentiate between effective and generic prompts', 'Apply practical prompt examples in educational contexts'] },
    { id: 3, title: 'Build Flawless Prompts', description: 'Learn the magic formula: Context + Instruction + Format = Precise Result.', duration: '20 min', type: 'teoría', hasMedia: true, icon: 'fa-sitemap', objectives: ['Master the Context + Instruction + Format formula', 'Build structured prompts with precise results', 'Evaluate and refine AI response quality'] },
  ],
  2: [
    { id: 1, title: 'Predict Trends with ChatGPT', description: 'Use GPT to anticipate trends and make strategic decisions based on real data.', duration: '25 min', type: 'teoría', hasMedia: true, icon: 'fa-chart-line', objectives: ['Understand how GPT can analyze structured data', 'Apply AI forecasting techniques', 'Identify patterns and trends in historical data'] },
    { id: 2, title: 'Create Your Own AI Assistant', description: 'Design custom AI assistants trained for your specific tasks and needs.', duration: '30 min', type: 'laboratorio', hasMedia: true, icon: 'fa-robot', objectives: ['Configure a specialized GPT for specific tasks', 'Customize instructions and knowledge base', 'Publish and share GPTs with your team'] },
    { id: 3, title: 'Automate with APIs and ChatGPT', description: 'Connect GPT with your tools and automate complex workflows effortlessly.', duration: '25 min', type: 'práctica', hasMedia: false, icon: 'fa-code', objectives: ['Integrate external functions with GPT models', 'Automate complex workflows', 'Manage structured responses from the API'] },
  ],
  3: [
    { id: 1, title: 'See, Read, and Analyze with Gemini', description: 'Analyze text, images, and data in one place with the multimodal power of AI.', duration: '20 min', type: 'teoría', hasMedia: true, icon: 'fa-brain', objectives: ['Combine text, images, and data in a single analysis', 'Understand current AI multimodal capabilities', 'Apply multimodal reasoning to research cases'] },
    { id: 2, title: 'Always Up-to-Date Answers', description: 'Get real-time answers by connecting AI to live information sources.', duration: '25 min', type: 'práctica', hasMedia: true, icon: 'fa-search', objectives: ['Connect AI with live data sources', 'Verify answers with up-to-date information', 'Implement grounding in practical applications'] },
    { id: 3, title: 'The Art of Research with AI', description: 'Research deeply and verify any facts with advanced AI-assisted research techniques.', duration: '30 min', type: 'laboratorio', hasMedia: false, icon: 'fa-microscope', objectives: ['Conduct deep AI-assisted research', 'Automatically verify facts and sources', 'Structure research reports with AI'] },
  ],
  4: [
    { id: 1, title: 'Select Sources Like an Expert', description: 'Build your library of trusted sources with the help of AI for solid research.', duration: '20 min', type: 'teoría', hasMedia: true, icon: 'fa-bookmark', objectives: ['Select relevant sources for academic research', 'Organize and categorize documents with AI', 'Evaluate source quality and credibility'] },
    { id: 2, title: 'Turn Data into Wisdom', description: 'Convert dense documents into clear summaries ready to use in your projects.', duration: '25 min', type: 'práctica', hasMedia: true, icon: 'fa-compress', objectives: ['Transform complex documents into executive summaries', 'Extract key insights from multiple sources', 'Structure knowledge in an actionable way'] },
    { id: 3, title: 'Your Notes Become a Podcast', description: 'Listen to your documents and organize your digital knowledge library with AI.', duration: '25 min', type: 'laboratorio', hasMedia: true, icon: 'fa-microphone', objectives: ['Convert written documents into audio content', 'Manage a digital knowledge library', 'Optimize documentation workflows with AI'] },
  ],
  5: [
    { id: 1, title: 'Unite All AIs in One Flow', description: 'Integrate your entire AI stack into a unified and powerful workflow.', duration: '30 min', type: 'proyecto', hasMedia: true, icon: 'fa-puzzle-piece', objectives: ['Combine multiple AI tools in a unified workflow', 'Design efficient integration architectures', 'Solve complex problems with a full AI stack'] },
    { id: 2, title: 'Create Your First AI Product', description: 'Build an MVP with integrated AI to validate your ideas in record time.', duration: '35 min', type: 'proyecto', hasMedia: true, icon: 'fa-rocket', objectives: ['Build a minimum viable product with integrated AI', 'Prioritize core features for rapid validation', 'Iterate based on user feedback'] },
    { id: 3, title: 'Present Your Idea Like a Pro', description: 'Design a professional presentation and roadmap that sells your disruptive project.', duration: '25 min', type: 'proyecto', hasMedia: false, icon: 'fa-presentation', objectives: ['Prepare a professional AI project presentation', 'Design a strategic roadmap', 'Communicate project value to stakeholders'] },
  ],
};

/** @type {Record<number, ModuleQuestion[]>} */
export const MODULE_QUESTIONS = {
  1: [
    { id: 'm1q1', topic: 'Ingeniería de Prompts', correctAnswer: 'm1q1_b' },
    { id: 'm1q2', topic: 'Método RTF', correctAnswer: 'm1q2_a' },
    { id: 'm1q3', topic: 'Mastery Framework', correctAnswer: 'm1q3_b' },
    { id: 'm1q4', topic: 'Estructura de Prompts', correctAnswer: 'm1q4_b' },
    { id: 'm1q5', topic: 'Aplicación RTF', correctAnswer: 'm1q5_b' },
    { id: 'm1q6', topic: 'Ética en IA', correctAnswer: 'm1q6_b' },
    { id: 'm1q7', topic: 'Análisis Comparativo RTF', correctAnswer: 'm1q7_b' },
    { id: 'm1q8', topic: 'Mastery Framework', correctAnswer: 'm1q8_b' },
  ],
  2: [
    { id: 'm2q1', topic: 'Herramientas ChatGPT', correctAnswer: 'm2q1_a' },
    { id: 'm2q2', topic: 'Análisis de Datos', correctAnswer: 'm2q2_b' },
    { id: 'm2q3', topic: 'GPTs Personalizados', correctAnswer: 'm2q3_a' },
    { id: 'm2q4', topic: 'Function Calling', correctAnswer: 'm2q4_a' },
    { id: 'm2q5', topic: 'Function Calling', correctAnswer: 'm2q5_b' },
    { id: 'm2q6', topic: 'Proyectos ChatGPT', correctAnswer: 'm2q6_c' },
    { id: 'm2q7', topic: 'Automatización', correctAnswer: 'm2q7_a' },
    { id: 'm2q8', topic: 'Uso Responsable', correctAnswer: 'm2q8_a' },
  ],
  3: [
    { id: 'm3q1', topic: 'Gemini Multimodal', correctAnswer: 'm3q1_b' },
    { id: 'm3q2', topic: 'Deep Research', correctAnswer: 'm3q2_b' },
    { id: 'm3q3', topic: 'Verificación de Fuentes', correctAnswer: 'm3q3_b' },
    { id: 'm3q4', topic: 'Canvas', correctAnswer: 'm3q4_b' },
    { id: 'm3q5', topic: 'Google Workspace', correctAnswer: 'm3q5_b' },
    { id: 'm3q6', topic: 'Grounding', correctAnswer: 'm3q6_b' },
    { id: 'm3q7', topic: 'Aprendizaje Guiado', correctAnswer: 'm3q7_b' },
    { id: 'm3q8', topic: 'Investigación Profesional', correctAnswer: 'm3q8_b' },
  ],
  4: [
    { id: 'm4q1', topic: 'NotebookLM', correctAnswer: 'm4q1_a' },
    { id: 'm4q2', topic: 'NotebookLM', correctAnswer: 'm4q2_a' },
    { id: 'm4q3', topic: 'Audio Overview', correctAnswer: 'm4q3_a' },
    { id: 'm4q4', topic: 'Precisión', correctAnswer: 'm4q4_a' },
    { id: 'm4q5', topic: 'Curaduría', correctAnswer: 'm4q5_b' },
    { id: 'm4q6', topic: 'Análisis Crítico', correctAnswer: 'm4q6_b' },
    { id: 'm4q7', topic: 'Verificación', correctAnswer: 'm4q7_a' },
    { id: 'm4q8', topic: 'Colaboración', correctAnswer: 'm4q8_a' },
  ],
  5: [
    { id: 'm5q1', topic: 'Sesgos en IA', correctAnswer: 'm5q1_a' },
    { id: 'm5q2', topic: 'Alucinaciones', correctAnswer: 'm5q2_a' },
    { id: 'm5q3', topic: 'Responsabilidad', correctAnswer: 'm5q3_b' },
    { id: 'm5q4', topic: 'Privacidad', correctAnswer: 'm5q4_a' },
    { id: 'm5q5', topic: 'Transparencia', correctAnswer: 'm5q5_a' },
    { id: 'm5q6', topic: 'Uso Responsable', correctAnswer: 'm5q6_a' },
    { id: 'm5q7', topic: 'Sesgo de Automatización', correctAnswer: 'm5q7_a' },
    { id: 'm5q8', topic: 'Protección de Datos', correctAnswer: 'm5q8_b' },
  ],
};

/** @type {Record<string, BadgeInfo>} */
export const BADGE_INFO = {
  first_lesson: { icon: 'fa-star', label: 'Primeros Pasos', desc: 'Completa tu primera lección', color: '#FFD166' },
  five_lessons: { icon: 'fa-book-open', label: 'Estudiante Dedicado', desc: 'Completa 5 lecciones', color: '#00BCD4' },
  all_lessons: { icon: 'fa-graduation-cap', label: 'Sabio de la IA', desc: 'Completa las 15 lecciones', color: '#10B981' },
  streak_3: { icon: 'fa-fire', label: 'Racha Inicial', desc: '3 días consecutivos', color: '#F59E0B' },
  streak_7: { icon: 'fa-fire', label: 'Racha Imparable', desc: '7 días consecutivos', color: '#EF4444' },
  first_module: { icon: 'fa-trophy', label: 'Primer Módulo', desc: 'Completa tu primer módulo', color: '#8B5CF6' },
  three_modules: { icon: 'fa-award', label: 'Maestro en Progreso', desc: 'Completa 3 módulos', color: '#EC4899' },
  all_modules: { icon: 'fa-crown', label: 'Campeón del Curso', desc: 'Completa los 5 módulos', color: '#FFD166' },
};

/** @type {Record<string, BadgeInfo>} */
export const BADGE_INFO_EN = {
  first_lesson: { icon: 'fa-star', label: 'First Steps', desc: 'Complete your first lesson', color: '#FFD166' },
  five_lessons: { icon: 'fa-book-open', label: 'Dedicated Student', desc: 'Complete 5 lessons', color: '#00BCD4' },
  all_lessons: { icon: 'fa-graduation-cap', label: 'AI Sage', desc: 'Complete all 15 lessons', color: '#10B981' },
  streak_3: { icon: 'fa-fire', label: 'Initial Streak', desc: '3 consecutive days', color: '#F59E0B' },
  streak_7: { icon: 'fa-fire', label: 'Unstoppable Streak', desc: '7 consecutive days', color: '#EF4444' },
  first_module: { icon: 'fa-trophy', label: 'First Module', desc: 'Complete your first module', color: '#8B5CF6' },
  three_modules: { icon: 'fa-award', label: 'Master in Progress', desc: 'Complete 3 modules', color: '#EC4899' },
  all_modules: { icon: 'fa-crown', label: 'Course Champion', desc: 'Complete all 5 modules', color: '#FFD166' },
};

export function getModules(locale) {
  return locale === 'en' ? modules_en : modules;
}

export function getAllLessons(locale) {
  return locale === 'en' ? ALL_LESSONS_EN : ALL_LESSONS;
}

export function getBadgeInfo(locale) {
  return locale === 'en' ? BADGE_INFO_EN : BADGE_INFO;
}
