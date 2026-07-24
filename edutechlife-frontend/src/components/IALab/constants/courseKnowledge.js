/**
 * courseKnowledge.js
 *
 * Base de conocimiento consolidada de todo el curso IALab.
 * Utilizada por Valerio para responder preguntas de los estudiantes
 * con contexto real del contenido del curso.
 *
 * Generado automáticamente desde moduleContent.js + moduleResources.js
 */

const COURSE_KNOWLEDGE = [
  {
    id: 1,
    title: "El Artesano Digital: El Arte de Forjar Prompts",
    objective:
      "Domina el arte de forjar instrucciones precisas con la IA como aprendiz de artesano digital, creando prompts que cualquier modelo entienda a la perfección.",
    description:
      "Bienvenido al taller del artesano digital. Aquí no memorizarás teoría abstracta — aprenderás a esculpir instrucciones con la precisión de un maestro orfebre. Cada prompt es una herramienta, y cada herramienta tiene su técnica. Desde los fundamentos de la IA Generativa hasta el dominio de instrucciones de alto impacto, este módulo es tu banco de trabajo.",
    challenge:
      "MISIÓN DEL ARTESANO: 'La Obra Maestra'. Ha llegado el momento de demostrar tu oficio. Toma un problema real de tu vida profesional o académica y diseña una secuencia de prompts tan precisa que cualquier modelo de IA ejecute la tarea a la perfección sin necesidad de correcciones. El sello del verdadero artesano.",
    topics: [
      {
        title: "Los Fundamentos del Artesano: ¿Qué es la IA Generativa?",
        description:
          "Antes de esculpir, hay que conocer el material. Así como un carpintero entiende la madera o un herrero el acero, tú aprenderás los fundamentos de la IA Generativa: su historia, sus capacidades y sus límites. Este es el primer golpe de cincel en tu viaje como artesano digital.",
        difficulty: "Principiante",
        learningObjectives: [
          "Comprender qué es la IA Generativa y cómo funciona — la materia prima del artesano",
          "Diferenciar entre IA débil (narrow) y IA fuerte (general) como un maestro distingue sus herramientas",
          "Identificar aplicaciones prácticas en educación y negocios para saber dónde aplicar tu oficio",
          "Reconocer los límites éticos y técnicos actuales — todo artesano conoce el alcance de sus herramientas",
        ],
        resources: [
          {
            type: "video",
            title: "Explicación Visual: Anatomía de un Prompt",
            duration: "6:06",
          },
          {
            type: "ova",
            title: "Laboratorio: Ética en la I.A.",
            estimatedTime: "10 minutos",
          },
        ],
      },
      {
        title: "El Cincel del Artesano: ¿Qué es un Prompt?",
        description:
          "Un prompt es tu cincel — la herramienta fundamental con la que das forma a las respuestas de la IA. Así como un escultor no culpa al mármol, un artesano digital no culpa al modelo: aprende a tallar instrucciones con precisión milimétrica para que la IA ejecute exactamente lo que necesitas.",
        difficulty: "Principiante",
        learningObjectives: [
          "Comprender qué es un prompt y cómo usarlo como la herramienta principal del artesano digital",
          "Dominar la anatomía de una instrucción: contexto, intención, formato y restricciones",
          "Practicar el arte de la claridad — menos ambigüedad, más precisión, mejores resultados",
        ],
        resources: [
          {
            type: "video",
            title: "Video Introductorio: ¿Qué es la IA Generativa?",
            duration: "4:30",
          },
          { type: "pdf", title: "Guía: Anatomía de un Prompt", pages: 12 },
          { type: "ova", title: "Infografía Interactiva: Prompt Engineering" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "El Arquitecto de Automatización: Potencia ChatGPT",
    objective:
      "Diseña y construye sistemas inteligentes con ChatGPT: desde los cimientos hasta la automatización completa de tu trabajo diario como un verdadero arquitecto digital.",
    description:
      "Bienvenido a la obra. Aquí no solo usarás ChatGPT — lo construirás. Así como un arquitecto diseña planos antes de levantar un edificio, tú aprenderás a estructurar soluciones de IA desde los cimientos: prompts de sistema profesionales, herramientas integradas, GPTs personalizados y conexiones con el mundo real a través de APIs.",
    challenge:
      "MISIÓN DEL ARQUITECTO: 'El Edificio Inteligente'. Tu misión es diseñar y construir un sistema completo de automatización usando ChatGPT: combina prompts de sistema, herramientas integradas, un GPT personalizado y conexión con API externa. El resultado debe ser un flujo de trabajo autónomo que resuelva un problema real de tu área profesional.",
    topics: [
      {
        title: "Los Planos del Arquitecto: Guía Completa de ChatGPT",
        description:
          "Todo gran edificio comienza con un plano maestro. En esta lección, conocerás los cimientos de ChatGPT: su arquitectura, sus modelos, su interfaz y las mejores prácticas para sentar las bases de tus construcciones digitales.",
        difficulty: "Principiante",
        learningObjectives: [
          "Navegar la interfaz de ChatGPT como un arquitecto conoce su estudio",
          "Configurar conversaciones como planos detallados para cada propósito",
          "Aplicar técnicas de prompt engineering como herramientas de construcción profesional",
        ],
        resources: [
          {
            type: "video",
            title: "Tutorial: Primeros Pasos con ChatGPT",
            duration: "5:43",
          },
          { type: "pdf", title: "Guía Completa de ChatGPT", pages: 25 },
          { type: "ova_interactive", title: "Dominando el Ecosistema ChatGPT" },
        ],
      },
      {
        title: "El Andamio del Arquitecto: Herramientas Integradas",
        description:
          "Un arquitecto no construye solo con sus manos — usa andamios, grúas y herramientas especializadas. Descubre el arsenal de herramientas integradas de ChatGPT: Búsqueda Web, Análisis de Datos, DALL-E 3, Canvas y más. Aprende a combinarlas como un maestro de obra para construir flujos de trabajo que multiplican tu productividad.",
        difficulty: "Intermedio",
        learningObjectives: [
          "Identificar las 5 herramientas clave del ecosistema ChatGPT y cuándo usar cada una",
          "Seleccionar la herramienta correcta como un arquitecto elige el material adecuado",
          "Combinar múltiples herramientas en flujos de trabajo eficientes y automatizados",
        ],
        resources: [
          {
            type: "pdf",
            title: "Las Herramientas Integradas de ChatGPT",
            pages: 20,
          },
          { type: "ova_interactive", title: "Simulador: Crea tu Primer Flujo" },
        ],
      },
      {
        title: "La Fachada del Edificio: GPTs y Function Calling",
        description:
          "La fachada es lo que el mundo ve — pero detrás hay una estructura compleja que la sostiene. Aprende a construir GPTs personalizados con acciones que se conectan al mundo real a través de APIs. Tu obra maestra de arquitectura digital, lista para interactuar con cualquier sistema externo.",
        difficulty: "Avanzado",
        learningObjectives: [
          "Crear GPTs personalizados como módulos de construcción reutilizables",
          "Configurar acciones Function Calling para conectar con APIs externas",
          "Compartir tus creaciones y aprender de la comunidad de arquitectos digitales",
        ],
        resources: [
          {
            type: "video",
            title: "Tutorial: Creando tu Primer GPT",
            duration: "18:45",
          },
          { type: "image", title: "Guía de GPTs y Acciones" },
          { type: "ova", title: "Laboratorio: Construye un GPT" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "El Detective de Datos: Rastreo Profundo con Gemini",
    objective:
      "Empuña la lupa de la IA: investiga, verifica y analiza con Gemini como el mejor detective digital del mundo.",
    description:
      "Gira la lupa de Google Gemini y descubre cómo los datos cobran vida. Aprende a cruzar pistas en tiempo real, analizar cualquier formato y separar la verdad de la ficción con precisión de detective.",
    challenge:
      "MISIÓN: 'La Investigación Definitiva'. El mundo está lleno de información contradictoria. Tu misión: usar Gemini Deep Research para separar los hechos de la ficción, verificar cada fuente y presentar un informe que cualquier CEO firmaría sin dudar.",
    topics: [
      {
        title: "El Superpoder Multimodal: Ve lo que Nadie Más Puede Ver",
        description:
          "¿Qué pasaría si tu lupa pudiera leer, escuchar y ver al mismo tiempo? Gemini procesa texto, imágenes, audio y video como un investigador sobrehumano. Una sola herramienta. Múltiples dimensiones.",
        difficulty: "Principiante",
        learningObjectives: [
          "Desbloquear el poder de procesar texto, imágenes, audio y video en una sola conversación",
          "Interrogar a Gemini con cualquier tipo de evidencia: texto, imagen, audio o video",
          "Descubrir por qué Gemini ve el mundo diferente a ChatGPT, Claude y otros modelos",
        ],
        resources: [
          { type: "video", title: "Gemini en 14 Minutos: Tu Primera Inmersión", duration: "14:10" },
          { type: "pdf", title: "El Compendio del Detective: 16 Páginas de Poder Multimodal", pages: 16 },
          { type: "ova", title: "Laboratorio: Pon a Prueba tu Lupa Multimodal" },
        ],
      },
      {
        title: "Grounding: Cuando la IA Toca el Mundo Real",
        description:
          "Gemini no solo piensa — también toca la tierra firme. Aprende a enraizarlo en Google Docs, Sheets, Gmail y todo Workspace. Datos vivos. Respuestas frescas. Cero conjeturas.",
        difficulty: "Intermedio",
        learningObjectives: [
          "Redactar documentos impecables con Gemini como tu coautor invisible",
          "Convertir hojas de cálculo en pistas visuales que revelan patrones ocultos",
          "Dominar tu bandeja de entrada: Gemini resume, redacta y prioriza por ti",
        ],
        resources: [
          {
            type: "video",
            title: "Gemini en tu Oficina: Tutorial Definitivo de Workspace",
            duration: "20:15",
          },
          { type: "document", title: "Kit de Supervivencia: Plantillas para Google Workspace" },
          { type: "ova", title: "Gemini: Misión Interactiva — Explora y Domina" },
        ],
      },
      {
        title: "El Arte de la Investigación: Convierte Datos en Verdades Ocultas",
        description:
          "Los mejores detectives del mundo digital ya usan Gemini. Descubre casos reales en marketing, programación, educación e investigación donde la IA resolvió lo que parecía imposible.",
        difficulty: "Avanzado",
        learningObjectives: [
          "Diseñar campañas que la competencia no ve venir, respaldadas por datos en tiempo real",
          "Depurar, optimizar y documentar código como si tuvieras un senior desarrollador a tu lado 24/7",
          "Transformar cualquier tema en una investigación interactiva que tus estudiantes recordarán",
        ],
        resources: [
          {
            type: "video",
            title: "Casos que Inspiran: Detectives Reales, Resultados Reales",
            duration: "16:30",
          },
          { type: "pdf", title: "Archivo de Casos: 24 Páginas de Misiones Cumplidas", pages: 24 },
          { type: "ova", title: "Laboratorio: Resuelve el Caso — 6 Desafíos Reales" },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "El Alquimista del Conocimiento: NotebookLM",
    objective:
      "Convierte documentos en oro: podcasts que cautivan, resúmenes que iluminan y un asistente que solo habla de lo que sabe.",
    description:
      "Imagina un bibliotecario que ha leído cada palabra de tus PDFs, los entiende a profundidad y te responde con citas exactas. Sin alucinaciones. Sin inventos. Eso es NotebookLM: la herramienta de Google que transforma documentos en conocimiento vivo.",
    challenge: "MISIÓN: Crea un programa de radio científico. Convierte 5 papers sobre neuroplasticidad en un podcast de 15 minutos que hasta tu abuela entendería.",
    topics: [
      {
        title: "El Alquimista de Documentos: Convierte PDFs en Oro de Conocimiento",
        description:
          "Conoce a tu nuevo superpoder: NotebookLM, el asistente de Google que lee todas tus fuentes y te responde solo con información verificada. No es un chatbot cualquiera — es tu bibliotecario personal con memoria impecable.",
        difficulty: "Principiante",
        learningObjectives: [
          "Construir tu primera biblioteca inteligente donde los documentos cobran vida",
          "Interrogar tus fuentes como un detective que busca la verdad",
          "Destilar montañas de texto en resúmenes que van al grano",
        ],
        resources: [
          {
            type: "video",
            title: "Primeros Pasos con NotebookLM",
            duration: "12:30",
          },
          { type: "pdf", title: "Guía de NotebookLM", pages: 14 },
          { type: "ova", title: "Laboratorio: Crea tu Notebook" },
        ],
      },
      {
        title: "El Arte de la Curaduría: Calidad sobre Cantidad",
        description:
          "Aprende a seleccionar fuentes como un joyero elige gemas, organizarlas por temas y conectar ideas entre documentos para crear resúmenes y análisis de nivel profesional.",
        difficulty: "Intermedio",
        learningObjectives: [
          "Generar resúmenes ejecutivos que parecen escritos por un equipo de analistas",
          "Crear FAQs que anticipan cada pregunta antes de que la formules",
          "Conectar cada respuesta a su fuente original con precisión quirúrgica",
        ],
        resources: [
          {
            type: "video",
            title: "Resúmenes Inteligentes con NotebookLM",
            duration: "3:33",
          },
          { type: "document", title: "Plantillas de Resumen" },
          { type: "ova", title: "Simulador: Análisis de Documentos" },
        ],
      },
      {
        title: "La Magia del Audio: Tus Documentos Hablan por Sí Solos",
        description:
          "Explora la función de Audio Overview que convierte tus notas en conversaciones de podcast generadas por IA. Dos voces, una conversación, cero jerga innecesaria.",
        difficulty: "Avanzado",
        learningObjectives: [
          "Dar vida a tus documentos con Audio Overviews que parecen programa de radio",
          "Afinar el tono: sé académico, conversacional o divulgativo según tu audiencia",
          "Aprender mientras te mueves: convertir el estudio en experiencia auditiva",
        ],
        resources: [
          { type: "video", title: "Crea tu propio podcast", duration: "2:16" },
          { type: "pdf", title: "Notebook LM", pages: 10 },
          { type: "ova", title: "Laboratorio: Crea tu Podcast IA" },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "El Escudo del Guardián: Ética Aplicada a IA Generativa",
    objective:
      "Domina los 4 pilares éticos que las empresas buscan hoy y conviértete en el guardián que asegura que la IA sirva a la humanidad.",
    description:
      "Cada decisión que tomas con IA tiene un impacto real. En este módulo final, te entrenarás para identificar sesgos ocultos, navegar regulaciones complejas y construir frameworks éticos que protejan a usuarios, organizaciones y a ti mismo.",
    challenge:
      "MISIÓN CRÍTICA: El Algoritmo Invisible. En alguna parte del mundo, un algoritmo está tomando decisiones que arruinan vidas — rechazando préstamos, filtrando currículos, decidiendo sentencias. Tu misión: localizar un caso real de sesgo algorítmico, diseccionarlo con evidencia y diseñar un protocolo ético blindado que prevenga que vuelva a ocurrir.",
    topics: [
      {
        title: "El Voto del Guardián: Los 4 Principios Sagrados",
        description:
          "Antes de tocar una línea de código o escribir un prompt, hay 4 principios que separan a un profesional ético de uno imprudente. Transparencia, equidad, responsabilidad y privacidad — no son teoría, son tu escudo.",
        difficulty: "Intermedio",
        learningObjectives: [
          "Internalizar los 4 pilares éticos que definen a un guardián de IA",
          "Detectar dilemas éticos en casos reales antes de que escalen",
          "Aplicar un checklist ético infalible antes de cada uso de IA",
        ],
        resources: [
          { type: "video", title: "Los Pilares de la I.A", duration: "1:56" },
          {
            type: "pdf",
            title: "Etica de la Inteligencia artificial",
            pages: 9,
          },
          { type: "ova", title: "Laboratorio: Detecta el Sesgo" },
        ],
      },
      {
        title: "El Espejo de la Verdad: ¿Tu IA es Justa para Todos?",
        description:
          "Tu IA solo es tan buena como los datos que la alimentan. Y los datos tienen prejuicios. Aprende a proteger tus datos personales y corporativos como un guardián blindaría su fortaleza.",
        difficulty: "Intermedio",
        learningObjectives: [
          "Descifrar cómo las IA procesan y almacenan tus datos",
          "Identificar vulnerabilidades de privacidad antes de que otros las exploten",
          "Implementar blindajes de protección que superen los estándares de la industria",
        ],
        resources: [
          {
            type: "video",
            title: "Privacidad y IA: Lo que Debes Saber",
            duration: "9:20",
          },
          { type: "pdf", title: "Manual de Privacidad en IA", pages: 13 },
          { type: "ova", title: "Simulador: Evaluación de Riesgos" },
        ],
      },
      {
        title: "El Legado del Guardián: Construyendo un Futuro Ético",
        description:
          "La IA no es buena ni mala — es poder. Y el poder sin ética es peligroso. Este marco te enseñará a usar la IA en educación, trabajo y vida con la responsabilidad de quien sabe que sus decisiones importan.",
        difficulty: "Avanzado",
        learningObjectives: [
          "Aplicar principios éticos como un guardián en cada interacción con IA",
          "Reconocer y detener usos inapropiados de IA antes de que causen daño",
          "Liderar con el ejemplo: promover transparencia y rendición de cuentas",
        ],
        resources: [
          {
            type: "video",
            title: "IA Ética: Principios y Práctica",
            duration: "6:05",
          },
          { type: "ova", title: "Laboratorio: Dilemas Éticos" },
        ],
      },
    ],
  },
];

export default COURSE_KNOWLEDGE;
