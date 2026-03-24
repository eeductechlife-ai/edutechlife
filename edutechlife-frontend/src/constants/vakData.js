export const VAK_QUESTIONS = [
  {
    id: 1,
    text: '¿Cómo prefieres aprender a usar una nueva app en tu celular?',
    options: [
      { text: 'Tutoriales en video', type: 'visual', icon: 'fa-video' },
      { text: 'Explicación paso a paso', type: 'auditivo', icon: 'fa-ear-listen' },
      { text: 'Prueba y error', type: 'kinestesico', icon: 'fa-hand-pointer' },
      { text: 'Opiniones de otros usuarios', type: 'visual', icon: 'fa-users' }
    ]
  },
  {
    id: 2,
    text: 'En clase, ¿cómo retienes mejor la información?',
    options: [
      { text: 'Notas con colores y subrayados', type: 'visual', icon: 'fa-pen-fancy' },
      { text: 'Grabo la clase para escuchar después', type: 'auditivo', icon: 'fa-microphone' },
      { text: 'Hago experimentos o actividades prácticas', type: 'kinestesico', icon: 'fa-flask' },
      { text: 'Resúmenes orales explicados en voz alta', type: 'auditivo', icon: 'fa-comment-dots' }
    ]
  },
  {
    id: 3,
    text: '¿Qué haces para memorizar fechas o datos importantes?',
    options: [
      { text: 'Tarjetas visuales y flashcards', type: 'visual', icon: 'fa-layer-group' },
      { text: 'Repetir en voz alta o crear canciones', type: 'auditivo', icon: 'fa-music' },
      { text: 'Caminar mientras recito', type: 'kinestesico', icon: 'fa-person-walking' },
      { text: 'Escribir múltiples veces', type: 'kinestesico', icon: 'fa-pen' }
    ]
  },
  {
    id: 4,
    text: 'Un nuevo control o botón en un video juego. ¿Qué haces?',
    options: [
      { text: 'Leer el manual o instrucciones', type: 'visual', icon: 'fa-book-open' },
      { text: 'Preguntar o escuchar a alguien', type: 'auditivo', icon: 'fa-ear-listen' },
      { text: 'Practicar moviendo los dedos', type: 'kinestesico', icon: 'fa-gamepad' },
      { text: 'Ver un tutorial en pantalla', type: 'visual', icon: 'fa-play-circle' }
    ]
  },
  {
    id: 5,
    text: '¿Cómo explicas una idea compleja a un amigo que no entiende?',
    options: [
      { text: 'Dibujo un esquema o diagrama', type: 'visual', icon: 'fa-palette' },
      { text: 'Le explico verbalmente', type: 'auditivo', icon: 'fa-comments' },
      { text: 'Le demuestro físicamente', type: 'kinestesico', icon: 'fa-hand-holding' },
      { text: 'Grabo un audio explicativo', type: 'auditivo', icon: 'fa-microphone-lines' }
    ]
  },
  {
    id: 6,
    text: 'En redes sociales, ¿qué tipo de contenido consumes más?',
    options: [
      { text: 'Imágenes, infografías y reels', type: 'visual', icon: 'fa-image' },
      { text: 'Podcasts y contenido de audio', type: 'auditivo', icon: 'fa-headphones' },
      { text: 'Tutoriales prácticos y DIY', type: 'kinestesico', icon: 'fa-screwdriver-wrench' },
      { text: 'Memes y contenido visual', type: 'visual', icon: 'fa-face-grin-stars' }
    ]
  },
  {
    id: 7,
    text: 'Para investigar un trabajo o proyecto. ¿Cómo lo haces?',
    options: [
      { text: 'Busco imágenes, diagramas y videos', type: 'visual', icon: 'fa-magnifying-glass' },
      { text: 'Veo documentales o escucho audios', type: 'auditivo', icon: 'fa-tv' },
      { text: 'Hago experimentos o prototipos', type: 'kinestesico', icon: 'fa-flask' },
      { text: 'Leo artículos organizados', type: 'visual', icon: 'fa-newspaper' }
    ]
  },
  {
    id: 8,
    text: '¿Qué te relaja mejor después de un día intenso de clases?',
    options: [
      { text: 'Ver películas, series o videos', type: 'visual', icon: 'fa-tv' },
      { text: 'Escuchar música o podcasts', type: 'auditivo', icon: 'fa-music' },
      { text: 'Hacer deporte o movimiento', type: 'kinestesico', icon: 'fa-person-running' },
      { text: 'Videojuegos o manualidades', type: 'kinestesico', icon: 'fa-gamepad' }
    ]
  },
  {
    id: 9,
    text: 'Un tema completamente nuevo. ¿Cómo lo aprendes mejor?',
    options: [
      { text: 'Con gráficos, mapas mentales y diagramas', type: 'visual', icon: 'fa-sitemap' },
      { text: 'Con explicaciones orales y debates', type: 'auditivo', icon: 'fa-comments' },
      { text: 'Con ejercicios prácticos y ejemplos', type: 'kinestesico', icon: 'fa-calculator' },
      { text: 'Tomando notas coloridas', type: 'visual', icon: 'fa-highlighter' }
    ]
  },
  {
    id: 10,
    text: '¿Cómo te preparas para una presentación o examen importante?',
    options: [
      { text: 'Diapositivas, tarjetas y esquemas visuales', type: 'visual', icon: 'fa-chalkboard' },
      { text: 'Ensayo en voz alta varias veces', type: 'auditivo', icon: 'fa-microphone' },
      { text: 'Practico frente a un espejo', type: 'kinestesico', icon: 'fa-user' },
      { text: 'Grabo mi voz y escucho repetidamente', type: 'auditivo', icon: 'fa-record-vinyl' }
    ]
  }
];

export const VAK_STYLES = {
  visual: { 
    name: 'APRENDIZ VISUAL', 
    color: '#4DA8C4', 
    gradient: 'from-[#4DA8C4]/20 to-[#4DA8C4]/5',
    borderColor: 'border-[#4DA8C4]/30',
    description: 'Tu cerebro procesa mejor la información cuando la ves. Aprendes más fácil con imágenes, gráficos, colores y diagramas.',
    icon: 'fa-eye',
    characteristics: [
      'Aprende mejor viendo imágenes y diagramas',
      'Tiene facilidad para leer y escribir',
      'Piensa en imágenes y mapas mentales',
      'Nota detalles visuales y colores',
      'Prefiere instrucciones escritas'
    ],
    tips: [
      'Estudiar en espacios bien iluminados ayuda a tu concentración',
      'Usar colores diferentes para cada tema mejora la retención',
      'Ver videos antes de leer el material profundiza la comprensión',
      'Crear tus propias infografías consolida el aprendizaje'
    ],
    careers: ['Diseño Gráfico', 'Arquitectura', 'Marketing Digital', 'Fotografía', 'Cine y Video', 'Medicina', 'Ingeniería'],
    strategies: [
      'Usa colores y subrayados en tus notas',
      'Crea mapas mentales y diagramas',
      'Prefiere videos educativos',
      'Usa flashcards con imágenes',
      'Organiza en esquemas'
    ],
    resources: [
      { name: 'Canva', description: 'Crear infografías' },
      { name: 'Notion', description: 'Notas visuales' },
      { name: 'Miro', description: 'Pizarras colaborativas' }
    ]
  },
  auditivo: { 
    name: 'APRENDIZ AUDITIVO', 
    color: '#66CCCC', 
    gradient: 'from-[#66CCCC]/20 to-[#66CCCC]/5',
    borderColor: 'border-[#66CCCC]/30',
    description: 'Aprendes mejor escuchando y hablando. Retienes información a través de conversaciones y audio.',
    icon: 'fa-ear-listen',
    characteristics: [
      'Aprende mejor escuchando explicaciones',
      'Le gusta hablar y discutir temas',
      'Tiene facilidad para expresarse verbalmente',
      'Retiene información con discusiones',
      'Prefiere podcasts y audiolibros'
    ],
    tips: [
      'Explicar en voz alta mejora la comprensión',
      'Grabar y escuchar notas consolida el aprendizaje',
      'Las discusiones grupales profundizan el entendimiento',
      'Los audiolibros aceleran el aprendizaje de idiomas'
    ],
    careers: ['Abogacía', 'Periodismo', 'Docencia', 'Comunicación', 'RRHH', 'Locución', 'Música'],
    strategies: [
      'Graba y escucha tus notas',
      'Explica en voz alta',
      'Escucha podcasts',
      'Participa en debates',
      'Usa grabadora'
    ],
    resources: [
      { name: 'Obsidian', description: 'Audio notes' },
      { name: 'Otter.ai', description: 'Transcripción de audio' },
      { name: 'Podcasts', description: 'Contenido educativo' }
    ]
  },
  kinestesico: { 
    name: 'APRENDIZ KINESTÉSICO', 
    color: '#FF6B9D', 
    gradient: 'from-[#FF6B9D]/20 to-[#FF6B9D]/5',
    borderColor: 'border-[#FF6B9D]/30',
    description: 'Necesitas moverte y practicar para aprender. Tu mejor aprendizaje viene de la experiencia práctica.',
    icon: 'fa-hand-pointer',
    characteristics: [
      'Aprende mejor haciendo y tocando',
      'No puede estar quieto mucho tiempo',
      'Necesita movimiento para concentrarse',
      'Aprende con experiencias prácticas',
      'Prefiere laboratorios y talleres'
    ],
    tips: [
      'Las pausas activas mejoran la concentración',
      'Estudiar de pie o caminando ayuda',
      'Usar objetos físicos facilita el aprendizaje',
      'Los proyectos prácticos consolidan conocimientos'
    ],
    careers: ['Ingeniería', 'Cirugía', 'Deporte', 'Arte', 'Construcción', 'Mecánica', 'Animación 3D'],
    strategies: [
      'Toma notas a mano',
      'Haz pausas activas',
      'Practica con ejercicios',
      'Usa el cuerpo para memorizar',
      'Aprende haciendo proyectos'
    ],
    resources: [
      { name: 'Anki', description: 'Repetición espaciada' },
      { name: 'CodeSandbox', description: 'Programación práctica' },
      { name: 'Duolingo', description: 'Aprendizaje interactivo' }
    ]
  }
};

export const calculateVAKResult = (answers) => {
  const counts = { visual: 0, auditivo: 0, kinestesico: 0 };
  
  answers.forEach(answer => {
    if (answer && answer.type) {
      counts[answer.type]++;
    }
  });
  
  const total = answers.length;
  const percentages = {
    visual: Math.round((counts.visual / total) * 100),
    auditivo: Math.round((counts.auditivo / total) * 100),
    kinestesico: Math.round((counts.kinestesico / total) * 100)
  };
  
  let dominant = 'visual';
  let max = counts.visual;
  if (counts.auditivo > max) { dominant = 'auditivo'; max = counts.auditivo; }
  if (counts.kinestesico > max) { dominant = 'kinestesico'; max = counts.kinestesico; }
  
  return {
    counts,
    percentages,
    dominant,
    percentage: Math.round((max / total) * 100)
  };
};

export const getVAKChartData = (percentages) => [
  { subject: 'Visual', value: percentages.visual, fullMark: 100 },
  { subject: 'Auditivo', value: percentages.auditivo, fullMark: 100 },
  { subject: 'Kinestésico', value: percentages.kinestesico, fullMark: 100 }
];
