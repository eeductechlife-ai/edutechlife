import {
  PRECIOS_INGENIA,
  CONDICIONES_INGENIA,
  formatCOP,
  fechaLimiteFundador,
} from "../config/preciosIngenia";

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
      "EduCard con imágenes",
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
    traits: ["Mind maps", "Educational videos", "Color schemes", "Image cards"],
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
      "EduCard com imagens",
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

// Precios: salen de la configuración compartida (C-005). No escribir montos aquí.
const P = PRECIOS_INGENIA;
const C = CONDICIONES_INGENIA;

const fechaFundador = fechaLimiteFundador;

// Plan Base (el Premium de antes, sin coach humano) y plan Personalizado.
const crearPlanes = (t) => [
  {
    id: "base",
    name: t.base,
    price: formatCOP(P.base.mensual),
    period: t.period,
    popular: true,
    trial: t.trial,
    notes: [
      t.anual(formatCOP(P.base.anual)),
      t.segundoHijo(formatCOP(P.base.segundoHijo)),
      t.fundador(formatCOP(P.fundador.mensual), P.fundador.cupos),
    ],
    features: t.baseFeatures,
  },
  {
    id: "personalizado",
    name: t.personalizado,
    pricePrefix: t.desde,
    price: formatCOP(P.acompanamiento.mensualDesde),
    period: t.period,
    popular: false,
    trial: t.valoracion(C.valoracionGratisMinutos),
    notes: [
      t.intensivo(formatCOP(P.intensivo.mensual), P.intensivo.sesionesMes),
      t.presencial(formatCOP(P.sesionPresencial)),
      t.cupos,
    ],
    features: t.personalizadoFeatures(P.acompanamiento.sesionesMes),
  },
];

const PRICING_PLANS_ES = crearPlanes({
  base: "Base",
  personalizado: "Personalizado",
  desde: "desde",
  period: "/mes",
  trial: `${P.gratis.diasPrueba} días gratis sin tarjeta`,
  valoracion: (min) => `Valoración gratis de ${min} min`,
  anual: (v) => `Plan anual: ${v}`,
  segundoHijo: (v) => `Segundo hijo: ${v}/mes`,
  fundador: (v, cupos) =>
    `Precio Fundador: ${v}/mes congelado mientras sigas activo. Primeras ${cupos} familias o hasta el ${fechaFundador("es-CO")}`,
  intensivo: (v, n) => `Intensivo (${n} sesiones/mes): ${v}/mes`,
  presencial: (v) => `Sesión presencial: +${v}`,
  cupos: "Cupos limitados",
  baseFeatures: [
    "Tutor IA Dani — chat ilimitado",
    "Misiones, puntos y recompensas",
    "ADN de Aprendizaje (Diagnóstico VAK)",
    "Panel para padres en tiempo real",
    "Reporte semanal a padres",
    "Plan de estudio personalizado",
    "Preparación de exámenes",
    "EduCard — tarjetas de estudio con IA",
    "Escáner de problemas con IA",
    "SmartBook Reader — análisis IA de textos",
    "Modo Socrático — pensamiento crítico",
    "Apoyo emocional con detección de crisis",
    "Noticias tech personalizadas",
    "Reportes mensuales descargables PDF",
    "Avatar 3D de Dani con emociones",
    "Prioridad en soporte",
  ],
  personalizadoFeatures: (n) => [
    "Todo lo del plan Base",
    "Valoración inicial de 45 min con revisión del boletín",
    "Plan a la medida de tu hijo",
    `${n} sesiones al mes de 45 min con coach docente`,
    "Seguimiento al colegio (con tu autorización)",
    "Reporte mensual con llamada de 15 min",
  ],
});

const PRICING_PLANS_EN = crearPlanes({
  base: "Base",
  personalizado: "Personalized",
  desde: "from",
  period: "/mo",
  trial: `${P.gratis.diasPrueba} days free, no card`,
  valoracion: (min) => `Free ${min}-min assessment`,
  anual: (v) => `Annual plan: ${v}`,
  segundoHijo: (v) => `Second child: ${v}/mo`,
  fundador: (v, cupos) =>
    `Founder price: ${v}/mo, locked while you stay active. First ${cupos} families or until ${fechaFundador("en-US")}`,
  intensivo: (v, n) => `Intensive (${n} sessions/mo): ${v}/mo`,
  presencial: (v) => `In-person session: +${v}`,
  cupos: "Limited spots",
  baseFeatures: [
    "AI Tutor Dani — unlimited chat",
    "Missions, points and rewards",
    "Complete VAK diagnosis",
    "Real-time parent dashboard",
    "Weekly parent report",
    "Personalized study plan",
    "Exam preparation",
    "EduCard — AI-powered study cards",
    "AI problem scanner",
    "SmartBook Reader — AI text analysis",
    "Socratic Mode — critical thinking",
    "Emotional support with crisis detection",
    "Personalized tech news feed",
    "Monthly downloadable PDF reports",
    "3D Dani avatar with emotions",
    "Priority support",
  ],
  personalizadoFeatures: (n) => [
    "Everything in Base",
    "45-min initial assessment with report card review",
    "Plan tailored to your child",
    `${n} monthly 45-min sessions with a teacher coach`,
    "School follow-up (with your authorization)",
    "Monthly report with a 15-min call",
  ],
});

const PRICING_PLANS_PT = crearPlanes({
  base: "Base",
  personalizado: "Personalizado",
  desde: "a partir de",
  period: "/mês",
  trial: `${P.gratis.diasPrueba} dias grátis sem cartão`,
  valoracion: (min) => `Avaliação grátis de ${min} min`,
  anual: (v) => `Plano anual: ${v}`,
  segundoHijo: (v) => `Segundo filho: ${v}/mês`,
  fundador: (v, cupos) =>
    `Preço Fundador: ${v}/mês congelado enquanto estiver ativo. Primeiras ${cupos} famílias ou até ${fechaFundador("pt-BR")}`,
  intensivo: (v, n) => `Intensivo (${n} sessões/mês): ${v}/mês`,
  presencial: (v) => `Sessão presencial: +${v}`,
  cupos: "Vagas limitadas",
  baseFeatures: [
    "Tutor IA Dani — chat ilimitado",
    "Missões, pontos e recompensas",
    "ADN de Aprendizaje completo",
    "Painel dos pais em tempo real",
    "Relatório semanal para os pais",
    "Plano de estudos personalizado",
    "Preparação para provas",
    "EduCard — tarjetas com IA",
    "Scanner de problemas com IA",
    "SmartBook Reader — análise de textos com IA",
    "Modo Socrático — pensamento crítico",
    "Apoio emocional com detecção de crises",
    "Notícias de tecnologia personalizadas",
    "Relatórios mensais em PDF para download",
    "Avatar 3D da Dani com emoções",
    "Prioridade no suporte",
  ],
  personalizadoFeatures: (n) => [
    "Tudo do plano Base",
    "Avaliação inicial de 45 min com revisão do boletim",
    "Plano sob medida para seu filho",
    `${n} sessões mensais de 45 min com coach docente`,
    "Acompanhamento com a escola (com sua autorização)",
    "Relatório mensal com ligação de 15 min",
  ],
});

const BENEFICIOS_HIJO_ES = [
  {
    icon: "fa-chart-line",
    title: "Mejora de calificaciones",
    desc: "Tu hijo alcanza sus objetivos académicos con un plan diseñado solo para él.",
  },
  {
    icon: "fa-heart",
    title: "Recupera su confianza",
    desc: "Coaches humanos + IA que lo animan en cada paso. De 'no puedo' a 'lo logré' en semanas.",
  },
  {
    icon: "fa-lightbulb",
    title: "Aprende a su ritmo VAK",
    desc: "Sin presión. Si es visual, auditivo o kinestésico, cada clase se adapta a cómo SU CEREBRO aprende mejor.",
  },
  {
    icon: "fa-shield-check",
    title: "Reportes semanales para ti",
    desc: "Sabes exactamente cómo va tu hijo: progreso, fortalezas, áreas de mejora. Transparencia total.",
  },
  {
    icon: "fa-robot",
    title: "Disponible cuando lo necesites",
    desc: "Tutor Dani (IA) + Coach humano. Estudia cuando quiera: mañana, noche o fin de semana. Apoyo constante.",
  },
  {
    icon: "fa-sparkles",
    title: "Preparado para el futuro",
    desc: "Desarrolla pensamiento crítico, creatividad y habilidades digitales. No solo memoriza, entiende.",
  },
];

const BENEFICIOS_HIJO_EN = [
  {
    icon: "fa-chart-line",
    title: "Grade improvement",
    desc: "Your child reaches academic goals with a plan designed just for them.",
  },
  {
    icon: "fa-heart",
    title: "Regains confidence",
    desc: "Human coaches + AI that encourages every step. From 'I can't' to 'I did it' in weeks.",
  },
  {
    icon: "fa-lightbulb",
    title: "Learns at their VAK pace",
    desc: "No pressure. Visual, auditory, or kinesthetic—every class adapts to how THEIR BRAIN learns best.",
  },
  {
    icon: "fa-shield-check",
    title: "Weekly reports for you",
    desc: "Know exactly how your child is doing: progress, strengths, improvement areas. Total transparency.",
  },
  {
    icon: "fa-robot",
    title: "Available whenever you need",
    desc: "Tutor Dani (AI) + Human coach. Study whenever: mornings, evenings, weekends. Constant support.",
  },
  {
    icon: "fa-sparkles",
    title: "Ready for the future",
    desc: "Develops critical thinking, creativity, and digital skills. Not just memorizing—truly understanding.",
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
    desc: "Um tutor com IA disponível quando você precisar, que o orienta, responde dúvidas e o incentiva em cada etapa.",
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
    title: "ADN de Aprendizaje",
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
    title: "Learning DNA",
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
    title: "ADN de Aprendizaje",
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
  title: `Garantía de ${C.garantiaDias} días`,
  desc: "Devolución del dinero. Cancela cuando quieras, sin permanencia. Precios finales con IVA incluido (si aplica).",
};

const GUARANTEE_EN = {
  icon: "fa-shield-halved",
  title: `${C.garantiaDias}-day money-back guarantee`,
  desc: "Cancel anytime, no commitment. Final prices include VAT (if applicable).",
};

const GUARANTEE_PT = {
  icon: "fa-shield-halved",
  title: `Garantia de ${C.garantiaDias} dias`,
  desc: "Devolução do dinheiro. Cancele quando quiser, sem fidelidade. Preços finais com IVA incluído (se aplicável).",
};

const FAQ_ITEMS_ES = [
  {
    q: "¿Desde qué edad pueden usar IngenIA?",
    a: "IngenIA está diseñado para niños entre 6 y 16 años. Nuestro sistema adapta el contenido y las actividades según la edad y el estilo de aprendizaje de cada estudiante.",
  },
  {
    q: "¿Necesito estar presente mientras mi hijo estudia?",
    a: "No. IngenIA está diseñado para que tu hijo aprenda de forma autónoma con el acompañamiento de Dani (coach virtual) y nuestro equipo de coaches humanos. Tú recibes reportes periódicos de su progreso.",
  },
  {
    q: "¿Cómo funciona el ADN de Aprendizaje?",
    a: "El ADN de Aprendizaje es un test interactivo de 10 preguntas que identifica el estilo de aprendizaje predominante de tu hijo: Visual, Auditivo o Kinestésico. A partir de los resultados, creamos un plan de estudio totalmente personalizado.",
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
    a: `Sí. El Diagnóstico VAK es gratuito y el plan Base incluye ${P.gratis.diasPrueba} días de prueba sin tarjeta. Para el plan Personalizado ofrecemos una valoración gratis de ${C.valoracionGratisMinutos} minutos.`,
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
    a: "Lo entendemos. Por eso el ADN de Aprendizaje es el primer paso: cuando un niño descubre cómo aprende mejor, estudiar deja de ser una obligación y se vuelve interesante. Además, el sistema de gamificación (puntos, logros, recompensas) mantiene su motivación alta.",
  },
];

const FAQ_ITEMS_EN = [
  {
    q: "What age is IngenIA for?",
    a: "IngenIA is designed for children ages 6 to 16. Our system adapts content and activities based on each student's age and learning style.",
  },
  {
    q: "Do I need to be present while my child studies?",
    a: "No. IngenIA is designed for your child to learn independently with Dani (virtual coach) and our human coach team. You receive periodic progress reports.",
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
    a: `Yes. The VAK diagnosis is free and the Base plan includes a ${P.gratis.diasPrueba}-day trial with no card required. For the Personalized plan we offer a free ${C.valoracionGratisMinutos}-minute assessment.`,
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
          beneficios: BENEFICIOS_HIJO_PT,
          tranquilidad: TRANQUILIDAD_PT,
          pasos: PASOS_PT,
          // Aún no hay FAQ en portugués: se muestra la versión en inglés en vez de
          // romper la portada (FAQ_ITEMS_PT nunca se definió).
          faq: FAQ_ITEMS_EN,
          paymentMethods: PAYMENT_METHODS_PT,
          guarantee: GUARANTEE_PT,
        }
      : {
          vakStyles: VAK_STYLES_ES,
          pricingPlans: PRICING_PLANS_ES,
          beneficios: BENEFICIOS_HIJO_ES,
          tranquilidad: TRANQUILIDAD_ES,
          pasos: PASOS_ES,
          faq: FAQ_ITEMS_ES,
          paymentMethods: PAYMENT_METHODS_ES,
          guarantee: GUARANTEE_ES,
        };

export const getVakStyles = (locale) => getData(locale).vakStyles;
export const getPricingPlans = (locale) => getData(locale).pricingPlans;
export const getBeneficios = (locale) => getData(locale).beneficios;
export const getTranquilidad = (locale) => getData(locale).tranquilidad;
export const getPasos = (locale) => getData(locale).pasos;
export const getFaqItems = (locale) => getData(locale).faq;
export const getPaymentMethods = (locale) => getData(locale).paymentMethods;
export const getGuarantee = (locale) => getData(locale).guarantee;
