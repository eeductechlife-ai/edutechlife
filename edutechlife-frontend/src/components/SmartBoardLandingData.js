const VAQ_STYLES_ES = [
  { key: 'visual', icon: 'fa-eye', title: 'Visual', color: '#4DA8C4', description: 'Aprende mejor viendo: imágenes, videos, mapas mentales y diagramas. Su cerebro procesa la información a través del canal visual con alta retención.', traits: ['Mapas mentales', 'Videos educativos', 'Esquemas de color', 'Flashcards con imágenes'] },
  { key: 'auditivo', icon: 'fa-headphones', title: 'Auditivo', color: '#66CCCC', description: 'Aprende mejor escuchando: podcasts, debates, explicaciones en voz alta. Retiene información a través de conversaciones y audio.', traits: ['Podcasts educativos', 'Debates guiados', 'Audiolibros', 'Grabaciones de clase'] },
  { key: 'kinestesico', icon: 'fa-hand-pointer', title: 'Kinestésico', color: '#FF6B9D', description: 'Aprende mejor haciendo: experimentos, movimiento, proyectos manuales. Necesita tocar y experimentar para comprender.', traits: ['Experimentos prácticos', 'Juegos de rol', 'Pausas activas', 'Proyectos manuales'] },
];

const VAQ_STYLES_EN = [
  { key: 'visual', icon: 'fa-eye', title: 'Visual', color: '#4DA8C4', description: 'Learns best by seeing: images, videos, mind maps, and diagrams. Their brain processes information through the visual channel with high retention.', traits: ['Mind maps', 'Educational videos', 'Color schemes', 'Image flashcards'] },
  { key: 'auditivo', icon: 'fa-headphones', title: 'Auditory', color: '#66CCCC', description: 'Learns best by listening: podcasts, debates, verbal explanations. Retains information through conversations and audio.', traits: ['Educational podcasts', 'Guided debates', 'Audiobooks', 'Class recordings'] },
  { key: 'kinestesico', icon: 'fa-hand-pointer', title: 'Kinesthetic', color: '#FF6B9D', description: 'Learns best by doing: experiments, movement, hands-on projects. Needs to touch and experience to understand.', traits: ['Hands-on experiments', 'Role-playing', 'Active breaks', 'Crafts projects'] },
];

const PRICING_PLANS_ES = [
  { name: 'Básico', price: '$30.000', period: '/mes', popular: false, features: ['Diagnóstico VAK completo', 'Plan de estudio personalizado', 'Acceso a recursos académicos', 'Sistema de puntos y recompensas', 'Reportes semanales', 'Coach virtual Dani', 'Soporte por email'] },
  { name: 'Premium', price: '$50.000', period: '/mes', popular: true, features: ['Todo lo del plan Básico', 'Coach humano dedicado', 'Reportes en tiempo real', 'Actividades avanzadas', 'Talleres de tecnología', 'Sesiones mensuales con experto', 'Prioridad en soporte', 'Certificados de logro'] },
];

const PRICING_PLANS_EN = [
  { name: 'Basic', price: '$30.000', period: '/mo', popular: false, features: ['Complete VAK diagnosis', 'Personalized study plan', 'Access to academic resources', 'Points and rewards system', 'Weekly reports', 'Virtual coach Dani', 'Email support'] },
  { name: 'Premium', price: '$50.000', period: '/mo', popular: true, features: ['Everything in Basic', 'Dedicated human coach', 'Real-time reports', 'Advanced activities', 'Tech workshops', 'Monthly expert sessions', 'Priority support', 'Achievement certificates'] },
];

const TESTIMONIALS_ES = [
  { name: 'Ana Lucía Romero', role: 'Mamá de Santiago, 10 años', rating: 5, text: 'Al principio me daba miedo que mi hijo pasara más tiempo en pantallas, pero SmartBoard es diferente. Dani lo guía paso a paso, y en dos meses sus notas en matemáticas pasaron de 3.5 a 4.8. Lo mejor es que ya no tengo que rogarle para que estudie — él solito abre la plataforma.' },
  { name: 'Carlos Rodríguez', role: 'Papá de Valentina, 12 años', rating: 5, text: 'El diagnóstico VAK nos cambió la perspectiva. Descubrimos que Valentina es kinestésica — toda su vida le dijeron que era distraída, pero en realidad necesita aprender haciendo. Con SmartBoard, sus trabajos de ciencias son los mejores de la clase y hasta ayudó a sus compañeros con un experimento.' },
  { name: 'Laura Méndez', role: 'Mamá de Mateo, 8 años', rating: 5, text: 'Trabajo hasta tarde y siempre vivía angustiada por las tareas de Mateo. SmartBoard me dio tranquilidad. Recibo un reporte cada semana con su avance, y si algo preocupa a su coach, me llega una alerta al celular. Ya no llego a casa con miedo de revisar la mochila.' },
  { name: 'Fernando Morales', role: 'Papá de Camila, 14 años', rating: 5, text: 'Camila estaba perdiendo el interés en el colegio, típico de la edad. Desde que usa SmartBoard su motivación cambió por completo. Habla con Dani sobre tecnología, y el sistema de puntos la mantiene enfocada en sus metas. Hasta pidió hacer cursos de programación por su cuenta.' },
  { name: 'Patricia Vega', role: 'Mamá de Tomás y Lucía, 9 y 11 años', rating: 5, text: 'Tener dos hijos en edad escolar era una locura: tareas distintas, horarios, materias, exámenes. SmartBoard los tiene a ambos organizados con su propio plan de estudio. Yo solo recibo los reportes y veo cómo avanzan cada uno a su ritmo. Mi nivel de estrés se redujo drásticamente.' },
];

const TESTIMONIALS_EN = [
  { name: 'Ana Lucía Romero', role: 'Santiago\'s mom, age 10', rating: 5, text: 'At first I was afraid my son would spend more time on screens, but SmartBoard is different. Dani guides him step by step, and in two months his math grades went from 3.5 to 4.8. The best part is I no longer have to beg him to study — he opens the platform on his own.' },
  { name: 'Carlos Rodríguez', role: 'Valentina\'s dad, age 12', rating: 5, text: 'The VAK diagnosis changed our perspective. We discovered Valentina is kinesthetic — her whole life she was told she was distracted, but she actually needs to learn by doing. With SmartBoard, her science projects are the best in class.' },
  { name: 'Laura Méndez', role: 'Mateo\'s mom, age 8', rating: 5, text: 'I work late and was always stressed about Mateo\'s homework. SmartBoard gave me peace of mind. I get a weekly report on his progress, and if something concerns his coach, I get an alert on my phone.' },
  { name: 'Fernando Morales', role: 'Camila\'s dad, age 14', rating: 5, text: 'Camila was losing interest in school, typical for her age. Since using SmartBoard, her motivation has completely changed. She talks with Dani about technology, and the points system keeps her focused on her goals.' },
  { name: 'Patricia Vega', role: 'Tomás & Lucía\'s mom, ages 9 & 11', rating: 5, text: 'Having two school-age children was chaos: different homework, schedules, subjects, exams. SmartBoard keeps both organized with their own study plan. I just receive the reports and watch them progress at their own pace.' },
];

const BENEFICIOS_HIJO_ES = [
  { icon: 'fa-brain', title: 'Plan personalizado', desc: 'Creamos una ruta de aprendizaje única basada en su estilo VAK. Cada actividad está diseñada para cómo él o ella aprende mejor.' },
  { icon: 'fa-laptop-code', title: 'Habilidades tecnológicas', desc: 'Desarrolla competencias digitales reales mientras estudia: pensamiento computacional, IA generativa y creatividad digital.' },
  { icon: 'fa-star', title: 'Puntos y recompensas', desc: 'Cada actividad completada le da puntos que puede canjear por premios reales. La motivación se convierte en un juego.' },
  { icon: 'fa-robot', title: 'Coach virtual Dani', desc: 'Un tutor con IA disponible 24/7 que lo guía, responde sus preguntas y lo anima en cada paso.' },
  { icon: 'fa-user-graduate', title: 'Coach humano experto', desc: 'Un profesional real que supervisa su progreso y ajusta su plan según su evolución académica y emocional.' },
  { icon: 'fa-book-open', title: 'Recursos premium', desc: 'Acceso ilimitado a guías, videos, ejercicios interactivos y materiales seleccionados por expertos en educación.' },
];

const BENEFICIOS_HIJO_EN = [
  { icon: 'fa-brain', title: 'Personalized plan', desc: 'We create a unique learning path based on their VAK style. Every activity is designed for how they learn best.' },
  { icon: 'fa-laptop-code', title: 'Tech skills', desc: 'Develop real digital competencies while studying: computational thinking, generative AI, and digital creativity.' },
  { icon: 'fa-star', title: 'Points & rewards', desc: 'Every completed activity earns points they can redeem for real prizes. Motivation becomes a game.' },
  { icon: 'fa-robot', title: 'Virtual coach Dani', desc: 'An AI tutor available 24/7 that guides them, answers questions, and encourages them every step of the way.' },
  { icon: 'fa-user-graduate', title: 'Expert human coach', desc: 'A real professional who supervises progress and adjusts their plan according to academic and emotional development.' },
  { icon: 'fa-book-open', title: 'Premium resources', desc: 'Unlimited access to guides, videos, interactive exercises, and materials selected by education experts.' },
];

const TRANQUILIDAD_ES = [
  { icon: 'fa-chart-line', title: 'Reportes en tiempo real', desc: '¿Está conectado? ¿Cuánto estudió hoy? ¿En qué tema va? Recibe datos actualizados al instante desde tu celular.' },
  { icon: 'fa-clock', title: 'Recupera tu tiempo', desc: 'No más horas ayudando con tareas que no entiendes. Nuestros coaches se encargan del proceso académico.' },
  { icon: 'fa-shield-halved', title: 'Tu hijo en buenas manos', desc: 'Profesionales supervisan su progreso. Tú recibes alertas solo cuando es necesario tu apoyo.' },
  { icon: 'fa-face-smile', title: 'Adiós al estrés escolar', desc: 'Se acabaron las discusiones por las tareas. Tu hijo estudia motivado y recuperas la armonía en casa.' },
];

const TRANQUILIDAD_EN = [
  { icon: 'fa-chart-line', title: 'Real-time reports', desc: 'Are they online? How much did they study today? What topic are they on? Get instant updates from your phone.' },
  { icon: 'fa-clock', title: 'Get your time back', desc: 'No more hours helping with homework you don\'t understand. Our coaches handle the academic process.' },
  { icon: 'fa-shield-halved', title: 'Your child in good hands', desc: 'Professionals supervise their progress. You receive alerts only when your support is needed.' },
  { icon: 'fa-face-smile', title: 'Goodbye to school stress', desc: 'No more arguments over homework. Your child studies motivated and you restore harmony at home.' },
];

const PASOS_ES = [
  { step: '01', icon: 'fa-user-plus', title: 'Registro', desc: 'Creas una cuenta en 2 minutos. Solo necesitas sus datos básicos y elegir tu plan.' },
  { step: '02', icon: 'fa-chart-bar', title: 'Diagnóstico VAK', desc: 'Tu hijo hace un test interactivo de 10 preguntas. En 3 minutos sabemos cómo aprende.' },
  { step: '03', icon: 'fa-route', title: 'Plan personalizado', desc: 'Nuestra IA crea una ruta de aprendizaje a su medida con actividades, horarios y recursos según su estilo.' },
  { step: '04', icon: 'fa-rocket', title: 'Aprendizaje activo', desc: 'Tu hijo empieza a estudiar con Dani y nuestros coaches. Tú recibes reportes de su progreso.' },
];

const PASOS_EN = [
  { step: '01', icon: 'fa-user-plus', title: 'Sign Up', desc: 'Create an account in 2 minutes. Just enter basic details and choose your plan.' },
  { step: '02', icon: 'fa-chart-bar', title: 'VAK Diagnosis', desc: 'Your child takes a 10-question interactive test. In 3 minutes we know how they learn.' },
  { step: '03', icon: 'fa-route', title: 'Personalized plan', desc: 'Our AI creates a custom learning path with activities, schedules, and resources based on their style.' },
  { step: '04', icon: 'fa-rocket', title: 'Active learning', desc: 'Your child starts studying with Dani and our coaches. You receive progress reports.' },
];

const FAQ_ITEMS_ES = [
  { q: '¿Desde qué edad pueden usar SmartBoard?', a: 'SmartBoard está diseñado para niños entre 8 y 16 años. Nuestro sistema adapta el contenido y las actividades según la edad y el estilo de aprendizaje de cada estudiante.' },
  { q: '¿Necesito estar presente mientras mi hijo estudia?', a: 'No. SmartBoard está diseñado para que tu hijo aprenda de forma autónoma con el acompañamiento de Dani (coach virtual) y nuestro equipo de coaches humanos. Tú recibes reportes periódicos de su progreso.' },
  { q: '¿Cómo funciona el diagnóstico VAK?', a: 'El diagnóstico VAK es un test interactivo de 10 preguntas que identifica el estilo de aprendizaje predominante de tu hijo: Visual, Auditivo o Kinestésico. A partir de los resultados, creamos un plan de estudio totalmente personalizado.' },
  { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí. No hay permanencia forzada. Puedes cancelar tu suscripción cuando quieras sin penalización.' },
];

const FAQ_ITEMS_EN = [
  { q: 'What age is SmartBoard for?', a: 'SmartBoard is designed for children ages 8 to 16. Our system adapts content and activities based on each student\'s age and learning style.' },
  { q: 'Do I need to be present while my child studies?', a: 'No. SmartBoard is designed for your child to learn independently with Dani (virtual coach) and our human coach team. You receive periodic progress reports.' },
  { q: 'How does the VAK diagnosis work?', a: 'The VAK diagnosis is a 10-question interactive test that identifies your child\'s predominant learning style: Visual, Auditory, or Kinesthetic. Based on results, we create a fully personalized study plan.' },
  { q: 'Can I cancel anytime?', a: 'Yes. There is no forced commitment. You can cancel your subscription anytime without penalty.' },
];

const getData = (locale) => locale === 'en'
  ? {
      vakStyles: VAQ_STYLES_EN, pricingPlans: PRICING_PLANS_EN, testimonials: TESTIMONIALS_EN,
      beneficios: BENEFICIOS_HIJO_EN, tranquilidad: TRANQUILIDAD_EN, pasos: PASOS_EN, faq: FAQ_ITEMS_EN,
    }
  : {
      vakStyles: VAQ_STYLES_ES, pricingPlans: PRICING_PLANS_ES, testimonials: TESTIMONIALS_ES,
      beneficios: BENEFICIOS_HIJO_ES, tranquilidad: TRANQUILIDAD_ES, pasos: PASOS_ES, faq: FAQ_ITEMS_ES,
    };

export const getVakStyles = (locale) => getData(locale).vakStyles;
export const getPricingPlans = (locale) => getData(locale).pricingPlans;
export const getTestimonials = (locale) => getData(locale).testimonials;
export const getBeneficios = (locale) => getData(locale).beneficios;
export const getTranquilidad = (locale) => getData(locale).tranquilidad;
export const getPasos = (locale) => getData(locale).pasos;
export const getFaqItems = (locale) => getData(locale).faq;
