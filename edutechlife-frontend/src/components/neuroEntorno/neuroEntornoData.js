export const contentByStyle = {
    visual: {
        title: "Estilo Visual",
        icon: "fa-eye",
        color: "#4DA8C4",
        strategies: [
            "Usa mapas mentales y diagramas de colores",
            "Graba videos o screencasts de tus clases",
            "Utiliza tarjetas con imágenes y palabras clave",
            "Resalta con colores diferentes según importancia",
            "Crea infografías para resumir temas",
        ],
        tools: ["Canva", "Miro", "Notion", "Genially"],
    },
    auditory: {
        title: "Estilo Auditivo",
        icon: "fa-ear-listen",
        color: "#66CCCC",
        strategies: [
            "Graba tus explicaciones y escúchalas después",
            "Participa en debates y discusiones",
            "Usa podcasts educativos mientras haces otras tareas",
            "Explica los temas en voz alta a alguien",
            "Utiliza música instrumental mientras estudias",
        ],
        tools: ["Audacity", "Spotify", "YouTube", "Podcasts"],
    },
    kinesthetic: {
        title: "Estilo Kinestésico",
        icon: "fa-hand",
        color: "#004B63",
        strategies: [
            "Toma notas a mano, no en laptop",
            "Usa fichas físicas para memorizar",
            "Incluye pausas activas y movimiento",
            "Simula situaciones reales de aplicación",
            "Usa modelos 3D o réplicas físicas",
        ],
        tools: ["Anki", "Quizlet", "Tinkercad", "Figma"],
    },
};

export const testimoniosVAK = [
    {
        nombre: 'María Elena Gómez',
        rol: 'Docente I.E. San José - Bogotá',
        texto: 'Gracias a la metodología VAK y el test del Neuro-Entorno pude transformar mis clases. Ahora llegan a estudiantes que antes no conectaban con el contenido. Mis resultados en pruebas Saber mejoraron un 35%.',
        img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
        perfil: 'Auditivo',
        resultado: '+35% desempeño'
    },
    {
        nombre: 'Carlos Andrés Ríos',
        rol: 'Estudiante - Medellín',
        texto: 'El Diagnóstico VAK me reveló que soy kinestésico. Nunca lo había considerado, pero ahora estudio de forma completamente diferente y mis calificaciones subieron notablemente.',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        perfil: 'Kinestésico',
        resultado: '+2 puntos GPA'
    },
    {
        nombre: 'Laura Patricia Vega',
        rol: 'Rectora I.E. Normal Superior - Cali',
        texto: 'Implementamos el programa en toda la institución. Los docentes ahora comprenden cómo aprenden sus estudiantes y adaptan sus metodologías. Es revolucionario.',
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
        perfil: 'Visual',
        resultado: '200+ docentes'
    },
    {
        nombre: 'Juan Sebastián Martínez',
        rol: 'Estudiante Universidad Nacional',
        texto: 'Como estudiante universitario, el coaching con Valerio me ayudó a organizar mi tiempo y descubrir que soy un aprendiz multimodal. Las estrategias personalizadas marcaron la diferencia.',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        perfil: 'Multimodal',
        resultado: 'Graduación honrosa'
    },
];

export const features = [
    { icon: 'fa-brain', title: 'Diagnóstico VAK Automatizado', desc: '10 preguntas científico-pedagógicas que determinan tu perfil de aprendizaje' },
    { icon: 'fa-user-check', title: 'Perfil Personalizado', desc: 'Análisis profundo con porcentajes de cada estilo de aprendizaje' },
    { icon: 'fa-book-open', title: 'Contenido Adaptado', desc: 'Recursos educativos diseñados para tu perfil específico' },
    { icon: 'fa-chart-line', title: 'Seguimiento Neuro', desc: 'Métricas de progreso basadas en indicadores neurocognitivos' },
];
