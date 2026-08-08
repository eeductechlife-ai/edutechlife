const VAK_STYLES_ES = [
  {
    key: "visual",
    icon: "fa-eye",
    title: "Visual",
    color: "#4DA8C4",
    description:
      "Aprende mejor viendo: imágenes, videos, mapas mentales y diagramas. Su cerebro procesa la información a través del canal visual con alta retención.",
    traits: [
      "Mapas mentales",
      "Videos educativos",
      "Esquemas de color",
      "Flashcards con imágenes",
    ],
  },
  {
    key: "auditivo",
    icon: "fa-headphones",
    title: "Auditivo",
    color: "#66CCCC",
    description:
      "Aprende mejor escuchando: podcasts, debates, explicaciones en voz alta. Retiene información a través de conversaciones y audio.",
    traits: [
      "Podcasts educativos",
      "Debates guiados",
      "Audiolibros",
      "Grabaciones de clase",
    ],
  },
  {
    key: "kinestesico",
    icon: "fa-hand-pointer",
    title: "Kinestésico",
    color: "#00BCD4",
    description:
      "Aprende mejor haciendo: experimentos, movimiento, proyectos manuales. Necesita tocar y experimentar para comprender.",
    traits: [
      "Experimentos prácticos",
      "Juegos de rol",
      "Pausas activas",
      "Proyectos manuales",
    ],
  },
];

const VAK_STYLES_EN = [
  {
    key: "visual",
    icon: "fa-eye",
    title: "Visual",
    color: "#4DA8C4",
    description:
      "Learns best by seeing: images, videos, mind maps, and diagrams. Their brain processes information through the visual channel with high retention.",
    traits: [
      "Mind maps",
      "Educational videos",
      "Color schemes",
      "Image flashcards",
    ],
  },
  {
    key: "auditivo",
    icon: "fa-headphones",
    title: "Auditory",
    color: "#66CCCC",
    description:
      "Learns best by listening: podcasts, debates, verbal explanations. Retains information through conversations and audio.",
    traits: [
      "Educational podcasts",
      "Guided debates",
      "Audiobooks",
      "Class recordings",
    ],
  },
  {
    key: "kinestesico",
    icon: "fa-hand-pointer",
    title: "Kinesthetic",
    color: "#00BCD4",
    description:
      "Learns best by doing: experiments, movement, hands-on projects. Needs to touch and experience to understand.",
    traits: [
      "Hands-on experiments",
      "Role-playing",
      "Active breaks",
      "Crafts projects",
    ],
  },
];

const VAK_STYLES_PT = [
  {
    key: "visual",
    icon: "fa-eye",
    title: "Visual",
    color: "#4DA8C4",
    description:
      "Aprende melhor vendo: imagens, vídeos, mapas mentais e diagramas. O cérebro dele(a) processa a informação pelo canal visual com alta retenção.",
    traits: [
      "Mapas mentais",
      "Vídeos educativos",
      "Esquemas coloridos",
      "Flashcards com imagens",
    ],
  },
  {
    key: "auditivo",
    icon: "fa-headphones",
    title: "Auditivo",
    color: "#66CCCC",
    description:
      "Aprende melhor ouvindo: podcasts, debates, explicações em voz alta. Retém informação por meio de conversas e áudio.",
    traits: [
      "Podcasts educativos",
      "Debates guiados",
      "Audiobooks",
      "Gravações de aula",
    ],
  },
  {
    key: "kinestesico",
    icon: "fa-hand-pointer",
    title: "Cinestésico",
    color: "#00BCD4",
    description:
      "Aprende melhor fazendo: experimentos, movimento, projetos manuais. Precisa tocar e experimentar para compreender.",
    traits: [
      "Experimentos práticos",
      "Jogos de interpretação",
      "Pausas ativas",
      "Projetos manuais",
    ],
  },
];

const PRICING_PLANS_ES = [
  {
    name: "Básico",
    price: "$30.000",
    priceUSD: "$7",
    period: "/mes",
    popular: false,
    trial: "7 días gratis",
    features: [
      "Diagnóstico VAK completo",
      "Tutor IA Dani — chat ilimitado",
      "Preparación de exámenes",
      "Sistema de flashcards",
      "Escáner de problemas con IA",
      "Plan de estudio personalizado",
      "Sistema de puntos y recompensas",
      "Reporte semanal a padres",
    ],
  },
  {
    name: "Premium",
    price: "$50.000",
    priceUSD: "$12",
    period: "/mes",
    popular: true,
    trial: "7 días gratis",
    features: [
      "Todo lo del plan Básico",
      "SmartBook Reader — análisis IA de textos",
      "Modo Socrático — pensamiento crítico",
      "Apoyo emocional con detección de crisis",
      "Noticias tech personalizadas",
      "Panel padres en tiempo real",
      "Reportes mensuales descargables PDF",
      "Avatar 3D de Dani con emociones",
      "Coach humano disponible",
      "Prioridad en soporte",
    ],
  },
];

const PRICING_PLANS_EN = [
  {
    name: "Basic",
    price: "$30.000",
    priceUSD: "$7",
    period: "/mo",
    popular: false,
    trial: "7 days free",
    features: [
      "Complete VAK diagnosis",
      "AI Tutor Dani — unlimited chat",
      "Exam preparation",
      "Flashcard system",
      "AI problem scanner",
      "Personalized study plan",
      "Points and rewards system",
      "Weekly parent report",
    ],
  },
  {
    name: "Premium",
    price: "$50.000",
    priceUSD: "$12",
    period: "/mo",
    popular: true,
    trial: "7 days free",
    features: [
      "Everything in Basic",
      "SmartBook Reader — AI text analysis",
      "Socratic Mode — critical thinking",
      "Emotional support with crisis detection",
      "Personalized tech news feed",
      "Real-time parent dashboard",
      "Monthly downloadable PDF reports",
      "3D Dani avatar with emotions",
      "Human coach available",
      "Priority support",
    ],
  },
];

const PRICING_PLANS_PT = [
  {
    name: "Básico",
    price: "$30.000",
    priceUSD: "$7",
    period: "/mês",
    popular: false,
    trial: "7 dias grátis",
    features: [
      "Diagnóstico VAK completo",
      "Tutor IA Dani — chat ilimitado",
      "Preparação para provas",
      "Sistema de flashcards",
      "Scanner de problemas com IA",
      "Plano de estudos personalizado",
      "Sistema de pontos e recompensas",
      "Relatório semanal para os pais",
    ],
  },
  {
    name: "Premium",
    price: "$50.000",
    priceUSD: "$12",
    period: "/mês",
    popular: true,
    trial: "7 dias grátis",
    features: [
      "Tudo do plano Básico",
      "SmartBook Reader — análise de textos com IA",
      "Modo Socrático — pensamento crítico",
      "Apoio emocional com detecção de crises",
      "Notícias de tecnologia personalizadas",
      "Painel dos pais em tempo real",
      "Relatórios mensais em PDF para download",
      "Avatar 3D da Dani com emoções",
      "Coach humano disponível",
      "Prioridade no suporte",
    ],
  },
];

const TESTIMONIALS_ES = [
  {
    name: "Ana Lucía Romero",
    role: "Mamá de Santiago, 10 años",
    rating: 5,
    text: "Al principio me daba miedo que mi hijo pasara más tiempo en pantallas, pero SmartBoard es diferente. Dani lo guía paso a paso, y en dos meses sus notas en matemáticas pasaron de 3.5 a 4.8. Lo mejor es que ya no tengo que rogarle para que estudie — él solito abre la plataforma.",
  },
  {
    name: "Carlos Rodríguez",
    role: "Papá de Valentina, 12 años",
    rating: 5,
    text: "El diagnóstico VAK nos cambió la perspectiva. Descubrimos que Valentina es kinestésica — toda su vida le dijeron que era distraída, pero en realidad necesita aprender haciendo. Con SmartBoard, sus trabajos de ciencias son los mejores de la clase y hasta ayudó a sus compañeros con un experimento.",
  },
  {
    name: "Laura Méndez",
    role: "Mamá de Mateo, 8 años",
    rating: 5,
    text: "Trabajo hasta tarde y siempre vivía angustiada por las tareas de Mateo. SmartBoard me dio tranquilidad. Recibo un reporte cada semana con su avance, y si algo preocupa a su coach, me llega una alerta al celular. Ya no llego a casa con miedo de revisar la mochila.",
  },
  {
    name: "Fernando Morales",
    role: "Papá de Camila, 14 años",
    rating: 5,
    text: "Camila estaba perdiendo el interés en el colegio, típico de la edad. Desde que usa SmartBoard su motivación cambió por completo. Habla con Dani sobre tecnología, y el sistema de puntos la mantiene enfocada en sus metas. Hasta pidió hacer cursos de programación por su cuenta.",
  },
  {
    name: "Patricia Vega",
    role: "Mamá de Tomás y Lucía, 9 y 11 años",
    rating: 5,
    text: "Tener dos hijos en edad escolar era una locura: tareas distintas, horarios, materias, exámenes. SmartBoard los tiene a ambos organizados con su propio plan de estudio. Yo solo recibo los reportes y veo cómo avanzan cada uno a su ritmo. Mi nivel de estrés se redujo drásticamente.",
  },
];

const TESTIMONIALS_EN = [
  {
    name: "Ana Lucía Romero",
    role: "Santiago's mom, age 10",
    rating: 5,
    text: "At first I was afraid my son would spend more time on screens, but SmartBoard is different. Dani guides him step by step, and in two months his math grades went from 3.5 to 4.8. The best part is I no longer have to beg him to study — he opens the platform on his own.",
  },
  {
    name: "Carlos Rodríguez",
    role: "Valentina's dad, age 12",
    rating: 5,
    text: "The VAK diagnosis changed our perspective. We discovered Valentina is kinesthetic — her whole life she was told she was distracted, but she actually needs to learn by doing. With SmartBoard, her science projects are the best in class.",
  },
  {
    name: "Laura Méndez",
    role: "Mateo's mom, age 8",
    rating: 5,
    text: "I work late and was always stressed about Mateo's homework. SmartBoard gave me peace of mind. I get a weekly report on his progress, and if something concerns his coach, I get an alert on my phone.",
  },
  {
    name: "Fernando Morales",
    role: "Camila's dad, age 14",
    rating: 5,
    text: "Camila was losing interest in school, typical for her age. Since using SmartBoard, her motivation has completely changed. She talks with Dani about technology, and the points system keeps her focused on her goals.",
  },
  {
    name: "Patricia Vega",
    role: "Tomás & Lucía's mom, ages 9 & 11",
    rating: 5,
    text: "Having two school-age children was chaos: different homework, schedules, subjects, exams. SmartBoard keeps both organized with their own study plan. I just receive the reports and watch them progress at their own pace.",
  },
];

const TESTIMONIALS_PT = [
  {
    name: "Ana Lucía Romero",
    role: "Mãe do Santiago, 10 anos",
    rating: 5,
    text: "No começo eu tinha medo de que meu filho passasse mais tempo nas telas, mas o SmartBoard é diferente. A Dani o guia passo a passo, e em dois meses as notas dele em matemática subiram de 3.5 para 4.8. O melhor é que eu não preciso mais implorar para ele estudar — ele mesmo abre a plataforma.",
  },
  {
    name: "Carlos Rodríguez",
    role: "Pai da Valentina, 12 anos",
    rating: 5,
    text: "O diagnóstico VAK mudou nossa perspectiva. Descobrimos que a Valentina é cinestésica — a vida toda disseram que ela era distraída, mas na verdade ela precisa aprender fazendo. Com o SmartBoard, os trabalhos de ciências dela são os melhores da turma e ela até ajudou os colegas com um experimento.",
  },
  {
    name: "Laura Méndez",
    role: "Mãe do Mateo, 8 anos",
    rating: 5,
    text: "Eu trabalho até tarde e sempre vivia angustiada com as tarefas do Mateo. O SmartBoard me trouxe tranquilidade. Recebo um relatório toda semana com o progresso dele e, se algo preocupa o coach, chega um alerta no meu celular. Não chego mais em casa com medo de conferir a mochila.",
  },
  {
    name: "Fernando Morales",
    role: "Pai da Camila, 14 anos",
    rating: 5,
    text: "A Camila estava perdendo o interesse na escola, típico da idade. Desde que usa o SmartBoard, a motivação dela mudou por completo. Ela conversa com a Dani sobre tecnologia, e o sistema de pontos a mantém focada nas metas. Até pediu para fazer cursos de programação por conta própria.",
  },
  {
    name: "Patricia Vega",
    role: "Mãe do Tomás e da Lucía, 9 e 11 anos",
    rating: 5,
    text: "Ter dois filhos em idade escolar era uma loucura: tarefas diferentes, horários, matérias, provas. O SmartBoard mantém os dois organizados com o próprio plano de estudos. Eu só recebo os relatórios e vejo cada um avançando no seu ritmo. Meu nível de estresse caiu drasticamente.",
  },
];

const BENEFICIOS_HIJO_ES = [
  {
    icon: "fa-brain",
    title: "Plan personalizado",
    desc: "Creamos una ruta de aprendizaje única basada en su estilo VAK. Cada actividad está diseñada para cómo él o ella aprende mejor.",
  },
  {
    icon: "fa-laptop-code",
    title: "Habilidades tecnológicas",
    desc: "Desarrolla competencias digitales reales mientras estudia: pensamiento computacional, IA generativa y creatividad digital.",
  },
  {
    icon: "fa-star",
    title: "Puntos y recompensas",
    desc: "Cada actividad completada le da puntos que puede canjear por premios reales. La motivación se convierte en un juego.",
  },
  {
    icon: "fa-robot",
    title: "Coach virtual Dani",
    desc: "Un tutor con IA disponible 24/7 que lo guía, responde sus preguntas y lo anima en cada paso.",
  },
  {
    icon: "fa-user-graduate",
    title: "Coach humano experto",
    desc: "Un profesional real que supervisa su progreso y ajusta su plan según su evolución académica y emocional.",
  },
  {
    icon: "fa-book-open",
    title: "Recursos premium",
    desc: "Acceso ilimitado a guías, videos, ejercicios interactivos y materiales seleccionados por expertos en educación.",
  },
];

const BENEFICIOS_HIJO_EN = [
  {
    icon: "fa-brain",
    title: "Personalized plan",
    desc: "We create a unique learning path based on their VAK style. Every activity is designed for how they learn best.",
  },
  {
    icon: "fa-laptop-code",
    title: "Tech skills",
    desc: "Develop real digital competencies while studying: computational thinking, generative AI, and digital creativity.",
  },
  {
    icon: "fa-star",
    title: "Points & rewards",
    desc: "Every completed activity earns points they can redeem for real prizes. Motivation becomes a game.",
  },
  {
    icon: "fa-robot",
    title: "Virtual coach Dani",
    desc: "An AI tutor available 24/7 that guides them, answers questions, and encourages them every step of the way.",
  },
  {
    icon: "fa-user-graduate",
    title: "Expert human coach",
    desc: "A real professional who supervises progress and adjusts their plan according to academic and emotional development.",
  },
  {
    icon: "fa-book-open",
    title: "Premium resources",
    desc: "Unlimited access to guides, videos, interactive exercises, and materials selected by education experts.",
  },
];

const BENEFICIOS_HIJO_PT = [
  {
    icon: "fa-brain",
    title: "Plano personalizado",
    desc: "Criamos uma trilha de aprendizagem única baseada no estilo VAK dele(a). Cada atividade é pensada para a forma como ele ou ela aprende melhor.",
  },
  {
    icon: "fa-laptop-code",
    title: "Habilidades tecnológicas",
    desc: "Desenvolve competências digitais reais enquanto estuda: pensamento computacional, IA generativa e criatividade digital.",
  },
  {
    icon: "fa-star",
    title: "Pontos e recompensas",
    desc: "Cada atividade concluída gera pontos que podem ser trocados por prêmios reais. A motivação vira um jogo.",
  },
  {
    icon: "fa-robot",
    title: "Coach virtual Dani",
    desc: "Um tutor com IA disponível 24/7 que o orienta, responde dúvidas e o incentiva em cada etapa.",
  },
  {
    icon: "fa-user-graduate",
    title: "Coach humano especialista",
    desc: "Um profissional real que acompanha o progresso e ajusta o plano conforme a evolução acadêmica e emocional.",
  },
  {
    icon: "fa-book-open",
    title: "Recursos premium",
    desc: "Acesso ilimitado a guias, vídeos, exercícios interativos e materiais selecionados por especialistas em educação.",
  },
];

const TRANQUILIDAD_ES = [
  {
    icon: "fa-chart-line",
    title: "Reportes en tiempo real",
    desc: "¿Está conectado? ¿Cuánto estudió hoy? ¿En qué tema va? Recibe datos actualizados al instante desde tu celular.",
  },
  {
    icon: "fa-clock",
    title: "Recupera tu tiempo",
    desc: "No más horas ayudando con tareas que no entiendes. Nuestros coaches se encargan del proceso académico.",
  },
  {
    icon: "fa-shield-halved",
    title: "Tu hijo en buenas manos",
    desc: "Profesionales supervisan su progreso. Tú recibes alertas solo cuando es necesario tu apoyo.",
  },
  {
    icon: "fa-face-smile",
    title: "Adiós al estrés escolar",
    desc: "Se acabaron las discusiones por las tareas. Tu hijo estudia motivado y recuperas la armonía en casa.",
  },
];

const TRANQUILIDAD_EN = [
  {
    icon: "fa-chart-line",
    title: "Real-time reports",
    desc: "Are they online? How much did they study today? What topic are they on? Get instant updates from your phone.",
  },
  {
    icon: "fa-clock",
    title: "Get your time back",
    desc: "No more hours helping with homework you don't understand. Our coaches handle the academic process.",
  },
  {
    icon: "fa-shield-halved",
    title: "Your child in good hands",
    desc: "Professionals supervise their progress. You receive alerts only when your support is needed.",
  },
  {
    icon: "fa-face-smile",
    title: "Goodbye to school stress",
    desc: "No more arguments over homework. Your child studies motivated and you restore harmony at home.",
  },
];

const TRANQUILIDAD_PT = [
  {
    icon: "fa-chart-line",
    title: "Relatórios em tempo real",
    desc: "Está conectado? Quanto estudou hoje? Em qual assunto está? Receba dados atualizados na hora, direto do seu celular.",
  },
  {
    icon: "fa-clock",
    title: "Recupere seu tempo",
    desc: "Chega de horas ajudando com tarefas que você não entende. Nossos coaches cuidam do processo acadêmico.",
  },
  {
    icon: "fa-shield-halved",
    title: "Seu filho em boas mãos",
    desc: "Profissionais acompanham o progresso. Você só recebe alertas quando o seu apoio é realmente necessário.",
  },
  {
    icon: "fa-face-smile",
    title: "Adeus ao estresse escolar",
    desc: "Acabaram as brigas por causa das tarefas. Seu filho estuda motivado e você recupera a harmonia em casa.",
  },
];

const PASOS_ES = [
  {
    step: "01",
    icon: "fa-user-plus",
    title: "Registro",
    desc: "Creas una cuenta en 2 minutos. Solo necesitas sus datos básicos y elegir tu plan.",
  },
  {
    step: "02",
    icon: "fa-chart-bar",
    title: "Diagnóstico VAK",
    desc: "Tu hijo hace un test interactivo de 10 preguntas. En 3 minutos sabemos cómo aprende.",
  },
  {
    step: "03",
    icon: "fa-route",
    title: "Plan personalizado",
    desc: "Nuestra IA crea una ruta de aprendizaje a su medida con actividades, horarios y recursos según su estilo.",
  },
  {
    step: "04",
    icon: "fa-rocket",
    title: "Aprendizaje activo",
    desc: "Tu hijo empieza a estudiar con Dani y nuestros coaches. Tú recibes reportes de su progreso.",
  },
];

const PASOS_EN = [
  {
    step: "01",
    icon: "fa-user-plus",
    title: "Sign Up",
    desc: "Create an account in 2 minutes. Just enter basic details and choose your plan.",
  },
  {
    step: "02",
    icon: "fa-chart-bar",
    title: "VAK Diagnosis",
    desc: "Your child takes a 10-question interactive test. In 3 minutes we know how they learn.",
  },
  {
    step: "03",
    icon: "fa-route",
    title: "Personalized plan",
    desc: "Our AI creates a custom learning path with activities, schedules, and resources based on their style.",
  },
  {
    step: "04",
    icon: "fa-rocket",
    title: "Active learning",
    desc: "Your child starts studying with Dani and our coaches. You receive progress reports.",
  },
];

const PASOS_PT = [
  {
    step: "01",
    icon: "fa-user-plus",
    title: "Cadastro",
    desc: "Você cria uma conta em 2 minutos. Só precisa dos dados básicos e escolher o seu plano.",
  },
  {
    step: "02",
    icon: "fa-chart-bar",
    title: "Diagnóstico VAK",
    desc: "Seu filho faz um teste interativo de 10 perguntas. Em 3 minutos descobrimos como ele aprende.",
  },
  {
    step: "03",
    icon: "fa-route",
    title: "Plano personalizado",
    desc: "Nossa IA cria uma trilha de aprendizagem sob medida, com atividades, horários e recursos de acordo com o estilo dele.",
  },
  {
    step: "04",
    icon: "fa-rocket",
    title: "Aprendizagem ativa",
    desc: "Seu filho começa a estudar com a Dani e nossos coaches. Você recebe relatórios do progresso dele.",
  },
];

const PAYMENT_METHODS_ES = [
  { icon: "fa-credit-card", name: "Tarjetas débito/crédito" },
  { icon: "fa-building-columns", name: "Transferencia bancaria" },
  { icon: "fa-mobile-screen", name: "Mercado Pago" },
  { icon: "fa-qrcode", name: "Nequi" },
];

const PAYMENT_METHODS_EN = [
  { icon: "fa-credit-card", name: "Debit/Credit cards" },
  { icon: "fa-building-columns", name: "Bank transfer" },
  { icon: "fa-mobile-screen", name: "Mercado Pago" },
  { icon: "fa-qrcode", name: "Nequi / PSE" },
];

const PAYMENT_METHODS_PT = [
  { icon: "fa-credit-card", name: "Cartões de débito/crédito" },
  { icon: "fa-building-columns", name: "Transferência bancária" },
  { icon: "fa-mobile-screen", name: "Mercado Pago" },
  { icon: "fa-qrcode", name: "Nequi / PSE" },
];

const GUARANTEE_ES = {
  icon: "fa-shield-halved",
  title: "Cancela cuando quieras",
  desc: "Sin permanencia. Sin multas. Sin preguntas.",
};

const GUARANTEE_EN = {
  icon: "fa-shield-halved",
  title: "Cancel anytime",
  desc: "No commitment. No penalties. No questions asked.",
};

const GUARANTEE_PT = {
  icon: "fa-shield-halved",
  title: "Cancele quando quiser",
  desc: "Sem fidelidade. Sem multas. Sem perguntas.",
};

const FAQ_ITEMS_ES = [
  {
    q: "¿Desde qué edad pueden usar SmartBoard?",
    a: "SmartBoard está diseñado para niños entre 8 y 16 años. Nuestro sistema adapta el contenido y las actividades según la edad y el estilo de aprendizaje de cada estudiante.",
  },
  {
    q: "¿Necesito estar presente mientras mi hijo estudia?",
    a: "No. SmartBoard está diseñado para que tu hijo aprenda de forma autónoma con el acompañamiento de Dani (coach virtual) y nuestro equipo de coaches humanos. Tú recibes reportes periódicos de su progreso.",
  },
  {
    q: "¿Cómo funciona el diagnóstico VAK?",
    a: "El diagnóstico VAK es un test interactivo de 10 preguntas que identifica el estilo de aprendizaje predominante de tu hijo: Visual, Auditivo o Kinestésico. A partir de los resultados, creamos un plan de estudio totalmente personalizado.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), Mercado Pago, Nequi, transferencia bancaria y PSE. Todos los pagos están protegidos con cifrado SSL de grado bancario.",
  },
  {
    q: "¿Puedo pagar en efectivo o en cuotas?",
    a: "Sí. A través de Mercado Pago y Nequi puedes pagar en efectivo (Efecty, Baloto) y en cuotas sin interés con tarjetas de crédito seleccionadas.",
  },
  {
    q: "¿Hay prueba gratuita?",
    a: "Sí. Ambos planes incluyen 7 días de prueba gratuita sin compromiso. Puedes cancelar antes de que termine el periodo y no se te cobrará nada.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí. No hay permanencia forzada. Puedes cancelar tu suscripción cuando quieras sin penalización. Si cancelas, seguirás teniendo acceso hasta el final del periodo pagado.",
  },
  {
    q: "¿Los datos de mi hijo están seguros?",
    a: "Absolutamente. Todos los datos están cifrados (SSL/TLS), almacenados en servidores seguros con cumplimiento de protección de datos. No compartimos información con terceros. Los reportes solo son visibles para los padres.",
  },
  {
    q: "¿Qué pasa si mi hijo no quiere usarlo?",
    a: "Lo entendemos. Por eso el diagnóstico VAK es el primer paso: cuando un niño descubre cómo aprende mejor, estudiar deja de ser una obligación y se vuelve interesante. Además, el sistema de gamificación (puntos, logros, recompensas) mantiene su motivación alta.",
  },
];

const FAQ_ITEMS_EN = [
  {
    q: "What age is SmartBoard for?",
    a: "SmartBoard is designed for children ages 8 to 16. Our system adapts content and activities based on each student's age and learning style.",
  },
  {
    q: "Do I need to be present while my child studies?",
    a: "No. SmartBoard is designed for your child to learn independently with Dani (virtual coach) and our human coach team. You receive periodic progress reports.",
  },
  {
    q: "How does the VAK diagnosis work?",
    a: "The VAK diagnosis is a 10-question interactive test that identifies your child's predominant learning style: Visual, Auditory, or Kinesthetic. Based on results, we create a fully personalized study plan.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept credit and debit cards (Visa, Mastercard, American Express), Mercado Pago, Nequi, bank transfer, and PSE. All payments are protected with bank-grade SSL encryption.",
  },
  {
    q: "Can I pay in cash or installments?",
    a: "Yes. Through Mercado Pago and Nequi you can pay in cash (Efecty, Baloto) and in interest-free installments with selected credit cards.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Both plans include a 7-day free trial with no commitment. You can cancel before the trial ends and you won't be charged.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There is no forced commitment. You can cancel your subscription anytime without penalty. If you cancel, you'll still have access until the end of the paid period.",
  },
  {
    q: "Is my child's data safe?",
    a: "Absolutely. All data is encrypted (SSL/TLS), stored in secure servers with data protection compliance. We do not share information with third parties. Reports are only visible to parents.",
  },
  {
    q: "What if my child doesn't want to use it?",
    a: "We understand. That's why the VAK diagnosis is the first step: when a child discovers how they learn best, studying stops being a chore and becomes interesting. Plus, the gamification system (points, achievements, rewards) keeps their motivation high.",
  },
];

const getData = (locale) =>
  locale === "en"
    ? {
        vakStyles: VAK_STYLES_EN,
        pricingPlans: PRICING_PLANS_EN,
        testimonials: TESTIMONIALS_EN,
        beneficios: BENEFICIOS_HIJO_EN,
        tranquilidad: TRANQUILIDAD_EN,
        pasos: PASOS_EN,
        faq: FAQ_ITEMS_EN,
        paymentMethods: PAYMENT_METHODS_EN,
        guarantee: GUARANTEE_EN,
      }
    : locale === "pt"
      ? {
          vakStyles: VAK_STYLES_PT,
          pricingPlans: PRICING_PLANS_PT,
          testimonials: TESTIMONIALS_PT,
          beneficios: BENEFICIOS_HIJO_PT,
          tranquilidad: TRANQUILIDAD_PT,
          pasos: PASOS_PT,
          faq: FAQ_ITEMS_PT,
          paymentMethods: PAYMENT_METHODS_PT,
          guarantee: GUARANTEE_PT,
        }
      : {
          vakStyles: VAK_STYLES_ES,
          pricingPlans: PRICING_PLANS_ES,
          testimonials: TESTIMONIALS_ES,
          beneficios: BENEFICIOS_HIJO_ES,
          tranquilidad: TRANQUILIDAD_ES,
          pasos: PASOS_ES,
          faq: FAQ_ITEMS_ES,
          paymentMethods: PAYMENT_METHODS_ES,
          guarantee: GUARANTEE_ES,
        };

export const getVakStyles = (locale) => getData(locale).vakStyles;
export const getPricingPlans = (locale) => getData(locale).pricingPlans;
export const getTestimonials = (locale) => getData(locale).testimonials;
export const getBeneficios = (locale) => getData(locale).beneficios;
export const getTranquilidad = (locale) => getData(locale).tranquilidad;
export const getPasos = (locale) => getData(locale).pasos;
export const getFaqItems = (locale) => getData(locale).faq;
export const getPaymentMethods = (locale) => getData(locale).paymentMethods;
export const getGuarantee = (locale) => getData(locale).guarantee;
