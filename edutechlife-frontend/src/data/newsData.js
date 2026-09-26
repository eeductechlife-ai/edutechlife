export const CATEGORIES = [
  {
    id: "did-you-know",
    label: "Sabías que...",
    color: "#0EA5E9",
    icon: "fa-lightbulb",
  },
  {
    id: "new-tools",
    label: "Nuevas herramientas",
    color: "#10B981",
    icon: "fa-rocket",
  },
  { id: "dani-tips", label: "Consejo Dani", color: "#F59E0B", icon: "fa-star" },
];

export const CATEGORY_COLORS = {
  "did-you-know": "#0EA5E9",
  "new-tools": "#10B981",
  "dani-tips": "#F59E0B",
};

export const CATEGORY_LABELS = {
  "did-you-know": "Sabías que...",
  "new-tools": "Nuevas herramientas",
  "dani-tips": "Consejo Dani",
};

// Every figure shown to students must be traceable to `source`.
export const fallbackNews = [
  // ==================== SABÍAS QUE... ====================
  {
    id: "dq-1",
    category: "did-you-know",
    title: '¿Tu cerebro ve imágenes "60,000 veces más rápido"? Es un mito',
    summary:
      "Esa cifra circula en internet sin ningún estudio detrás. Lo que sí está comprobado: puedes reconocer una imagen vista durante solo 13 milisegundos.",
    content: `Seguro has leído que "el cerebro procesa imágenes 60,000 veces más rápido que el texto". Suena genial, pero nadie ha encontrado el estudio que lo demuestre. Es un mito que se copió de página en página.\n\nLo que sí dice la ciencia:\n- En 2014, investigadores del MIT mostraron fotos durante apenas 13 milisegundos y las personas podían reconocer lo que habían visto.\n- La teoría de la "codificación dual" explica que recordamos mejor cuando la información llega en palabras Y en imágenes a la vez.\n\nLección de detective: cuando veas una cifra impresionante, pregúntate "¿quién lo midió y dónde lo publicó?". Si no hay respuesta, desconfía.\n\nTip para tu estudio: acompaña tus apuntes con un dibujo o un esquema. Palabras + imágenes = mejor memoria.`,
    imageUrl: "https://picsum.photos/seed/dq1/800/450",
    imageAlt: "Cerebro con conexiones visuales",
    dataPoints: [
      { label: "Ver una imagen", value: "13 ms", icon: "clock" },
      { label: "La cifra de 60,000x", value: "Mito", icon: "zap" },
    ],
    source: "Potter et al., MIT (2014); Paivio, teoría de la codificación dual",
    date: "2026-07-07",
    readTime: "3 min",
  },
  {
    id: "dq-2",
    category: "did-you-know",
    title: "Los árboles están conectados por una red de hongos bajo tierra",
    summary:
      'Hongos microscópicos unen las raíces de muchas plantas y mueven agua y nutrientes entre ellas. Los científicos todavía discuten qué tanto "se ayudan".',
    content: `Bajo el suelo del bosque hay hongos llamados micorrizas que se unen a las raíces de las plantas. Casi todas las plantas terrestres tienen estos hongos aliados.\n\nLo que está comprobado:\n- El hongo ayuda a la planta a conseguir agua y minerales.\n- A cambio, la planta le da azúcares que fabrica con la fotosíntesis.\n- En algunos experimentos se ha medido carbono pasando de un árbol a otro a través del hongo.\n\nLo que todavía se debate:\nIdeas como los "árboles madre" que cuidan a sus hijos se hicieron muy famosas, pero en 2023 un grupo de científicos revisó los estudios y concluyó que aún falta evidencia.\n\nAsí funciona la ciencia: una idea emocionante se pone a prueba una y otra vez antes de darse por cierta.`,
    imageUrl: "https://picsum.photos/seed/dq2/800/450",
    imageAlt: "Raíces de árboles conectadas",
    dataPoints: [
      { label: "Plantas con hongos aliados", value: "~90%", icon: "share-2" },
      { label: '"Árboles madre"', value: "En debate", icon: "clock" },
    ],
    source:
      "Simard et al., Nature (1997); Karst et al., Nature Ecology & Evolution (2023)",
    date: "2026-07-06",
    readTime: "3 min",
  },
  {
    id: "dq-3",
    category: "did-you-know",
    title: "El mundo crea más datos cada año que el anterior",
    summary:
      "Solo en 2023 se crearon alrededor de 120 zettabytes de datos. Un zettabyte es un 1 seguido de 21 ceros bytes.",
    content: `Cada foto, video, mensaje y búsqueda genera datos. Y cada año producimos más.\n\nAlgunas cifras:\n- En 2023 se crearon cerca de 120 zettabytes de datos en el mundo.\n- A YouTube se suben unas 500 horas de video cada minuto.\n\nQuizás has leído que "el 90% de los datos se creó en los últimos 2 años". Esa frase es de 2013 y hoy se sigue repitiendo sin actualizar. Por eso es importante mirar la fecha de una fuente.\n\nTip para tu estudio: con tanta información disponible, el superpoder es saber buscar. Compara al menos dos fuentes y fíjate en quién escribe y cuándo.`,
    imageUrl: "https://picsum.photos/seed/dq3/800/450",
    imageAlt: "Visualización de datos digitales",
    dataPoints: [
      { label: "Datos creados en 2023", value: "~120 ZB", icon: "database" },
      { label: "Video subido a YouTube", value: "500 h/min", icon: "search" },
    ],
    source: "IDC vía Statista (2023); YouTube (2019)",
    date: "2026-07-05",
    readTime: "3 min",
  },
  {
    id: "dq-4",
    category: "did-you-know",
    title: '¿Cuánto "pesa" internet? Un cálculo muy curioso',
    summary:
      "Un físico estimó que la energía que mueve internet equivale a unos 50 gramos, más o menos lo que pesa una fresa. Pero los cables pesan muchísimo más.",
    content: `En 2006, el físico Russell Seitz hizo un cálculo divertido: usando la famosa fórmula de Einstein (E = mc²), estimó que la energía que mueve los datos de internet equivale a unos 50 gramos de masa. ¡Como una fresa!\n\nOjo: es un experimento mental, no una medición. El resultado cambia mucho según lo que decidas contar.\n\nLo que sí es enorme es el internet físico:\n- Más de 1.4 millones de kilómetros de cables submarinos cruzan los océanos.\n- Miles de centros de datos, llenos de computadores, guardan la información.\n\nPregunta para pensar: ¿por qué crees que casi todo internet viaja por cables bajo el mar y no por satélites?`,
    imageUrl: "https://picsum.photos/seed/dq4/800/450",
    imageAlt: "Internet representado con luces",
    dataPoints: [
      { label: "Estimación de Seitz", value: "~50 g", icon: "weight" },
      { label: "Cables submarinos", value: "1.4M km", icon: "file-text" },
    ],
    source: "Russell Seitz (2006), citado en Discover; TeleGeography (2024)",
    date: "2026-07-04",
    readTime: "2 min",
  },
  {
    id: "dq-5",
    category: "did-you-know",
    title: "Tu cerebro sigue trabajando mientras duermes",
    summary:
      "Durante el sueño tu cerebro ordena los recuerdos del día y hace limpieza. Por eso dormir bien ayuda a recordar lo que estudiaste.",
    content: `Dormir no es "perder el tiempo". Tu cerebro trabaja turno nocturno mientras descansas.\n\nDurante el sueño:\n1. Repasa lo que aprendiste y fortalece los recuerdos importantes.\n2. Descarta información que no necesita.\n3. Hace limpieza: en 2013 se descubrió que el líquido que rodea el cerebro fluye más durante el sueño y arrastra desechos.\n\n¿Cuánto dormir?\n- De 6 a 12 años: entre 9 y 12 horas.\n- De 13 a 18 años: entre 8 y 10 horas.\n\nConsejo: antes de un examen, dormir bien vale más que quedarte estudiando hasta tarde.`,
    imageUrl: "https://picsum.photos/seed/dq5/800/450",
    imageAlt: "Cerebro durmiendo con actividad",
    dataPoints: [
      { label: "6 a 12 años", value: "9-12 h", icon: "clock" },
      { label: "13 a 18 años", value: "8-10 h", icon: "brain" },
    ],
    source:
      "Academia Americana de Medicina del Sueño (2016); Xie et al., Science (2013)",
    date: "2026-07-03",
    readTime: "3 min",
  },

  // ==================== NUEVAS HERRAMIENTAS ====================
  {
    id: "nt-1",
    category: "new-tools",
    title:
      "Scratch: crea tus propios videojuegos mientras aprendes a programar",
    summary:
      "Con Scratch puedes crear juegos, animaciones e historias interactivas encajando bloques de colores.",
    content: `Scratch es una herramienta gratuita creada por el MIT (Instituto Tecnológico de Massachusetts) para que niños y jóvenes aprendan a programar.\n\nLo mejor de Scratch es que se programa con bloques de colores que encajan como piezas de Lego. Arrastras, sueltas y ¡tu juego cobra vida!\n\n¿Qué puedes crear?\n- Videojuegos de plataformas\n- Animaciones musicales\n- Historias interactivas\n- Simulaciones científicas\n\nMás de 100 millones de personas se han registrado en Scratch para crear y compartir proyectos. Y es completamente gratis.\n\nURL: https://scratch.mit.edu`,
    imageUrl: "https://picsum.photos/seed/nt1/800/450",
    imageAlt: "Interfaz de Scratch con bloques de programación",
    dataPoints: [
      { label: "Usuarios", value: "100M+", icon: "users" },
      { label: "Precio", value: "Gratis", icon: "coffee" },
      { label: "Edad sugerida", value: "8-16", icon: "star" },
    ],
    source: "scratch.mit.edu/statistics",
    date: "2026-07-07",
    readTime: "3 min",
  },
  {
    id: "nt-2",
    category: "new-tools",
    title: "Canva para Educación: diseña trabajos increíbles sin ser diseñador",
    summary:
      "Canva tiene una versión educativa gratuita con plantillas para tus tareas, exposiciones y proyectos.",
    content: `Canva para Educación es una versión de Canva que colegios, profesores y estudiantes pueden usar gratis.\n\nTiene todo lo que necesitas para:\n- Crear presentaciones llamativas\n- Diseñar infografías para tus tareas\n- Hacer portadas para tus trabajos\n- Editar videos para proyectos\n- Trabajar en equipo en tiempo real\n\n¿Cómo entrar? Normalmente tu profesor o tu colegio te invita a su clase en Canva. Pídeselo.\n\nEs tan fácil de usar que en pocos minutos puedes tener un diseño muy profesional. Ideal para esas exposiciones donde quieres impresionar.`,
    imageUrl: "https://picsum.photos/seed/nt2/800/450",
    imageAlt: "Diseños de Canva para educación",
    dataPoints: [
      { label: "Precio", value: "Gratis", icon: "layout-template" },
      { label: "Cómo entrar", value: "Por tu profe", icon: "graduation-cap" },
    ],
    source: "canva.com/education",
    date: "2026-07-06",
    readTime: "2 min",
  },
  {
    id: "nt-3",
    category: "new-tools",
    title: "Khan Academy: aprendizaje gratuito de clase mundial para todos",
    summary:
      "Accede a miles de lecciones de matemáticas, ciencias, programación y más, gratis y en español.",
    content: `Khan Academy es una organización sin fines de lucro que ofrece educación gratuita para cualquier persona, en cualquier lugar.\n\nSu misión: "proveer educación gratuita de clase mundial para todos, en todas partes".\n\nOfrece cursos de:\n- Matemáticas (desde primaria hasta cálculo)\n- Ciencias (biología, química, física)\n- Programación y computación\n- Economía\n\nCada lección incluye videos, ejercicios interactivos y un registro de tu progreso. Tiene versión en español y es completamente gratis.\n\nURL: https://es.khanacademy.org`,
    imageUrl: "https://picsum.photos/seed/nt3/800/450",
    imageAlt: "Plataforma Khan Academy",
    dataPoints: [
      { label: "Lecciones", value: "Miles", icon: "book-open" },
      { label: "Precio", value: "100% Gratis", icon: "heart" },
      { label: "En español", value: "Sí", icon: "globe" },
    ],
    source: "es.khanacademy.org",
    date: "2026-07-05",
    readTime: "3 min",
  },
  {
    id: "nt-4",
    category: "new-tools",
    title: "Notion: el organizador todo-en-uno para tu vida escolar",
    summary:
      "Notion combina notas, tareas y calendario en una sola herramienta. Pensado para estudiantes de 13 años en adelante.",
    content: `Notion es como tener un cuaderno inteligente, una agenda y una lista de tareas, todo en uno.\n\nLos estudiantes pueden usarlo para:\n- Tomar apuntes de clase\n- Organizar tareas con fechas de entrega\n- Llevar un calendario de exámenes\n- Guardar una lista de libros y recursos\n- Compartir proyectos con compañeros\n\nTiene un plan gratuito, y los estudiantes con correo escolar pueden pedir funciones extra sin costo. Importante: sus reglas piden tener al menos 13 años. Si eres menor, úsalo con ayuda de un adulto o prueba la agenda de IngenIA.\n\nLa clave es empezar simple e ir agregando cosas a medida que las necesites.`,
    imageUrl: "https://picsum.photos/seed/nt4/800/450",
    imageAlt: "Interfaz de Notion con organización escolar",
    dataPoints: [
      { label: "Plan básico", value: "Gratis", icon: "coffee" },
      { label: "Edad mínima", value: "13 años", icon: "layout-template" },
    ],
    source: "notion.com/product/notion-for-education",
    date: "2026-07-04",
    readTime: "3 min",
  },
  {
    id: "nt-5",
    category: "new-tools",
    title: "Google Earth: viaja a cualquier lugar del mundo desde tu pantalla",
    summary:
      "Explora selvas, montañas y ciudades sin moverte de casa, y mira cómo ha cambiado el planeta en casi 40 años.",
    content: `Google Earth te permite viajar a casi cualquier lugar del planeta con solo hacer clic.\n\nPuedes:\n- Sobrevolar el Gran Cañón como si fueras un pájaro\n- Caminar por las calles de Tokio o de Bogotá\n- Ver en "Timelapse" cómo cambiaron ciudades, glaciares y bosques desde 1984\n\nLa función "Voyager" tiene recorridos guiados creados por científicos y exploradores sobre volcanes, culturas del mundo y más.\n\nPerfecto para proyectos de geografía, ciencias sociales o simplemente para alimentar tu curiosidad.\n\nURL: https://earth.google.com (gratis, en tu navegador)`,
    imageUrl: "https://picsum.photos/seed/nt5/800/450",
    imageAlt: "Google Earth mostrando el planeta",
    dataPoints: [
      { label: "Timelapse", value: "1984-hoy", icon: "globe" },
      { label: "Precio", value: "Gratis", icon: "clock" },
    ],
    source: "earth.google.com",
    date: "2026-07-03",
    readTime: "3 min",
  },

  // ==================== CONSEJO DANI ====================
  {
    id: "dt-1",
    category: "dani-tips",
    title: "Técnica Pomodoro: estudia por bloques cortos",
    summary:
      "25 minutos de concentración y 5 de descanso. Un método simple para empezar a estudiar sin sentir que es una montaña.",
    content: `La Técnica Pomodoro la inventó Francesco Cirillo a finales de los años 80, usando un temporizador de cocina con forma de tomate ("pomodoro" en italiano).\n\n¿Cómo funciona?\n1. Elige una sola tarea\n2. Pon un temporizador de 25 minutos\n3. Trabaja sin distracciones hasta que suene\n4. Descansa 5 minutos\n5. Después de 4 rondas, toma un descanso largo de 15 a 30 minutos\n\n¿Por qué ayuda?\n- Empezar es más fácil cuando sabes que son solo 25 minutos\n- Las pausas te ayudan a no agotarte\n- Ves tu avance en bloques\n\nSi 25 minutos te parecen mucho, empieza con 15. Lo importante es el ritmo foco-pausa.`,
    imageUrl: "https://picsum.photos/seed/dt1/800/450",
    imageAlt: "Temporizador Pomodoro con tomates",
    dataPoints: [
      { label: "Bloque de foco", value: "25 min", icon: "target" },
      { label: "Pausa corta", value: "5 min", icon: "shield" },
    ],
    source: "Francesco Cirillo, The Pomodoro Technique",
    date: "2026-07-07",
    readTime: "3 min",
  },
  {
    id: "dt-2",
    category: "dani-tips",
    title: "Mapas mentales: organiza tus ideas en ramas",
    summary:
      "Un tema en el centro, ideas en ramas de colores. Una forma visual de ver cómo se conecta lo que estudias.",
    content: `Los mapas mentales son diagramas que organizan la información alrededor de un tema central, como las ramas de un árbol. Los popularizó el escritor británico Tony Buzan en los años 70.\n\n¿Por qué ayudan?\nTe obligan a elegir las ideas clave y a conectarlas, en lugar de copiar todo. Algunos estudios con estudiantes encontraron que recordaban mejor la información después de hacer mapas mentales.\n\n¿Cómo hacer uno?\n1. Escribe el tema principal en el centro\n2. Dibuja ramas con los subtemas clave\n3. Usa un color distinto para cada rama\n4. Añade dibujos pequeños\n5. Une con flechas las ideas relacionadas\n\nHerramientas: papel y colores es suficiente. También puedes pedirle a IngenIA un mapa mental en Practicar.`,
    imageUrl: "https://picsum.photos/seed/dt2/800/450",
    imageAlt: "Mapa mental colorido",
    dataPoints: [
      { label: "Popularizado por", value: "T. Buzan", icon: "history" },
      { label: "Necesitas", value: "Papel y colores", icon: "brain" },
    ],
    source: "Buzan (1974); Farrand et al., Medical Education (2002)",
    date: "2026-07-06",
    readTime: "3 min",
  },
  {
    id: "dt-3",
    category: "dani-tips",
    title: "Lee mejor, no solo más rápido",
    summary:
      'Los trucos de "lectura súper rápida" suelen hacerte entender menos. Estas estrategias sí te ayudan a comprender.',
    content: `Hay cursos que prometen leer un libro en una hora. La investigación dice otra cosa: cuando lees mucho más rápido de lo normal, entiendes y recuerdas menos.\n\nEstrategias que sí funcionan:\n\n1. Mira antes de leer\nRevisa el título, los subtítulos y las imágenes. Tu cerebro prepara un "mapa" de lo que viene.\n\n2. Hazte preguntas\n¿De qué trata? ¿Qué quiere explicar el autor? Leer buscando respuestas mantiene tu atención.\n\n3. Resume con tus palabras\nAl terminar cada parte, di en una frase lo que entendiste. Si no puedes, vuelve a leerla.\n\n4. Lee un poco todos los días\nLa velocidad llega sola con la práctica y con un vocabulario más grande.`,
    imageUrl: "https://picsum.photos/seed/dt3/800/450",
    imageAlt: "Persona leyendo un libro",
    dataPoints: [
      {
        label: "Lectura adulta promedio",
        value: "~238 ppm",
        icon: "book-open",
      },
      { label: 'Leer "súper rápido"', value: "Entiendes menos", icon: "zap" },
    ],
    source:
      "Brysbaert, Journal of Memory and Language (2019); Rayner et al., Psychological Science in the Public Interest (2016)",
    date: "2026-07-05",
    readTime: "3 min",
  },
  {
    id: "dt-4",
    category: "dani-tips",
    title: "Duerme bien y tu cerebro te lo agradecerá en los exámenes",
    summary:
      "Dormir es cuando tu cerebro guarda lo que aprendiste. Sin sueño suficiente, cuesta más concentrarse y recordar.",
    content: `Dormir bien es parte de estudiar. Cuando duermes poco, te cuesta más concentrarte, controlar el estrés y recordar lo que repasaste.\n\n¿Qué pasa cuando duermes?\n- Tu cerebro repasa lo que aprendiste\n- Los recuerdos se vuelven más firmes\n- Tus emociones se regulan (menos estrés, más enfoque)\n\nConsejos para dormir mejor:\n- Deja las pantallas una hora antes de dormir\n- Acuéstate y levántate siempre a la misma hora\n- Evita bebidas con cafeína en la tarde\n- Tu cuarto debe estar oscuro y fresco\n\n¿Cuánto necesitas?\n- De 6 a 12 años: 9 a 12 horas\n- De 13 a 18 años: 8 a 10 horas`,
    imageUrl: "https://picsum.photos/seed/dt4/800/450",
    imageAlt: "Estudiante durmiendo plácidamente",
    dataPoints: [
      { label: "6 a 12 años", value: "9-12 h", icon: "clock" },
      { label: "13 a 18 años", value: "8-10 h", icon: "trending-up" },
    ],
    source: "Academia Americana de Medicina del Sueño (2016)",
    date: "2026-07-04",
    readTime: "3 min",
  },
  {
    id: "dt-5",
    category: "dani-tips",
    title: "Organiza tu mochila digital y gana tiempo de estudio",
    summary:
      "Tus archivos y carpetas son tu mochila digital. Si está ordenada, encuentras todo rápido y no pierdes tus trabajos.",
    content: `Así como ordenas tu mochila física, tu mochila digital también necesita orden.\n\nPasos para una mochila digital ordenada:\n\n1. Carpetas claras\n  /Colegio\n    /Matematicas\n    /Lenguaje\n    /Ciencias\n\n2. Nombres que digan qué es\n  ❌ "trabajo final.docx"\n  ✅ "Matematicas_Geometria_TrabajoFinal.docx"\n\n3. Limpieza semanal (15 minutos)\n  - Borra lo que ya no necesitas\n  - Mueve lo importante a su carpeta\n\n4. Copia de seguridad automática\n  - Google Drive, OneDrive o iCloud\n  - Así no pierdes nada si tu computador falla\n\nMenos tiempo buscando archivos es más tiempo para aprender (o para jugar).`,
    imageUrl: "https://picsum.photos/seed/dt5/800/450",
    imageAlt: "Escritorio digital organizado",
    dataPoints: [
      { label: "Limpieza semanal", value: "15 min", icon: "clock" },
      { label: "Copia de seguridad", value: "Automática", icon: "shield" },
    ],
    source: "Consejo de estudio de Dani",
    date: "2026-07-02",
    readTime: "2 min",
  },
];
