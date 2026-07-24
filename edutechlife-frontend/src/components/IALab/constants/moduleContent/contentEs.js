/**
 * CONSTANTES: contentEs.js
 *
 * Datos de contenido educativo en español para los módulos 2-5 del IALab
 * El Módulo 1 permanece intacto con sus datos hardcodeados originales
 *
 * Estructura por módulo:
 * - objective: Objetivo central del módulo
 * - learningPoints: 4 puntos de aprendizaje { text, icon }
 * - overviewData: { title, description, mission, topics[] }
 * - lessons: 3 lecciones { id, title, description, detailedDescription, duration, format, icon, badgeColor, themeColor }
 * - accordionContent: { 1: {...}, 2: {...}, 3: {...} }
 */

const CONTENT_ES = {
  // ============================================================================
  // MÓDULO 1: EL ARTESANO DIGITAL — INGENIERÍA DE PROMPTS
  // ============================================================================
  1: {
    objective:
      "Domina el arte de forjar instrucciones precisas con la IA como aprendiz de artesano digital, creando prompts que cualquier modelo entienda a la perfección.",
    learningPoints: [
      { text: "Forjar instrucciones claras como un maestro artesano", icon: "fa-bullseye" },
      {
        text: "Perfeccionar preguntas y respuestas con precisión milimétrica",
        icon: "fa-wand-magic-sparkles",
      },
      { text: "Detectar y corregir imperfecciones en tus creaciones", icon: "fa-exclamation-triangle" },
      { text: "Aplicar tu oficio artesanal en estudio y trabajo", icon: "fa-rocket" },
    ],
    overviewData: {
      title: "El Taller del Artesano Digital",
      description:
        "Todo artesano comienza con las herramientas básicas y, con práctica, se convierte en maestro. Aquí aprenderás a esculpir instrucciones que la IA entiende a la perfección. Desde los fundamentos hasta técnicas avanzadas que transformarán tu forma de trabajar con inteligencia artificial.",
      mission:
        "Tu misión como artesano: completa cada lección y recurso multimedia (videos, guías y laboratorios). Cada herramienta que domines te acerca un 20% más a tu certificación. ¡Las instrucciones precisas son tu sello de calidad!",
      topics: [
        {
          title: "Los Fundamentos del Artesano: ¿Qué es la IA Generativa?",
          icon: "fa-brain",
          resources: 2,
          duration: "20 min",
        },
        {
          title: "El Cincel del Artesano: ¿Qué es un Prompt?",
          icon: "fa-comments",
          resources: 3,
          duration: "20 min",
        },
      ],
    },
    lessons: [],
    accordionContent: {},
  },

  // ============================================================================
  // MÓDULO 2: EL ARQUITECTO DE AUTOMATIZACIÓN — POTENCIA CHATGPT
  // ============================================================================
  2: {
    objective:
      "Diseña y construye sistemas inteligentes con ChatGPT: desde los cimientos hasta la automatización completa de tu trabajo diario como un verdadero arquitecto digital.",
    learningPoints: [
      { text: "Diseñar planos maestros con System Prompts avanzados", icon: "fa-sliders" },
      { text: "Conectar estructuras con APIs externas", icon: "fa-code" },
      { text: "Construir tu propio GPT como un módulo arquitectónico", icon: "fa-robot" },
      { text: "Automatizar flujos de obra completos", icon: "fa-cog" },
    ],
    overviewData: {
      title: "La Obra del Arquitecto Digital",
      description:
        "Bienvenido a la obra maestra de la automatización. Aquí no solo usarás ChatGPT — construirás con él. Aprenderás a diseñar prompts de sistema como si trazaras planos, a usar herramientas integradas como andamios, a crear GPTs como módulos de construcción y a conectar todo con APIs externas para levantar estructuras digitales que trabajan solas.",
      mission:
        "Tu misión como arquitecto: completa cada lección y domina el arte de construir con ChatGPT. Cada estructura que diseñes te acerca a tu certificación como arquitecto de automatización. ¡Construye tu obra maestra digital!",
      topics: [
        {
          title: "Los Planos del Arquitecto: Guía Completa de ChatGPT",
          icon: "fa-book-open",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "El Andamio del Arquitecto: Herramientas Integradas",
          icon: "fa-layer-group",
          resources: 2,
          duration: "20 min",
        },
        {
          title: "La Fachada del Edificio: GPTs y Function Calling",
          icon: "fa-code",
          resources: 2,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "Los Planos del Arquitecto: Guía Completa de ChatGPT",
        description: "Los cimientos de toda gran construcción digital",
        detailedDescription:
          "Todo edificio comienza con un plano. En esta lección, conocerás la arquitectura completa de ChatGPT: desde los modelos disponibles hasta las mejores prácticas de prompt engineering. Aprende a seleccionar la herramienta correcta para cada fase de tu construcción y sienta las bases de tus proyectos de automatización.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-book-open",
        badgeColor: "bg-cyan-100 text-cyan-800",
        themeColor: "#66CCCC",
      },
      {
        id: 2,
        title: "El Andamio del Arquitecto: Herramientas Integradas",
        description: "Las herramientas que levantan tu construcción digital",
        detailedDescription:
          "Un arquitecto no construye solo con las manos — usa grúas, andamios y herramientas especializadas. Descubre el arsenal de ChatGPT: Búsqueda Web, Análisis de Datos con Python, DALL-E 3, Canvas y Proyectos. Aprende a combinarlos para levantar automatizaciones poderosas que multiplican tu productividad.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-purple-100 text-purple-800",
        themeColor: "#9333EA",
      },
      {
        id: 3,
        title: "La Fachada del Edificio: GPTs y Function Calling",
        description: "Conecta tu obra con el mundo real",
        detailedDescription:
          "La fachada es lo que el mundo ve, pero detrás hay una estructura compleja que la sostiene. Lleva tus construcciones al siguiente nivel: conecta GPTs personalizados con APIs, bases de datos y servicios externos. Crea flujos automatizados que resuelven problemas reales mientras tú diseñas el próximo proyecto.",
        duration: "20 min",
        format: "Video",
        icon: "fa-code",
        badgeColor: "bg-emerald-100 text-emerald-800",
        themeColor: "#10B981",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Los Cimientos del Arquitecto",
        objectiveDesc:
          "Domina los fundamentos de ChatGPT como un arquitecto domina los principios de la construcción: desde los modelos hasta las técnicas profesionales de prompt engineering.",
        achievements: [
          {
            icon: "fa-check",
            text: "Comprender la arquitectura y evolución de los modelos GPT como un plano maestro",
          },
          {
            icon: "fa-check",
            text: "Aplicar técnicas de prompt engineering profesional como herramientas de construcción",
          },
          {
            icon: "fa-check",
            text: "Seleccionar el modelo óptimo según costo y capacidad — el material adecuado para cada obra",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Usar el modelo más caro para tareas simples — como usar un martillo pilón para un cuadro",
          },
          {
            icon: "fa-times",
            text: "Ignorar los límites de contexto — como construir sin medir el terreno",
          },
          {
            icon: "fa-times",
            text: "No conocer las actualizaciones de nuevos modelos — un arquitecto ignorante construye castillos de naipes",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Aficionado: Usar GPT-4 para todo, incluso para tareas que GPT-3.5 resuelve en segundos",
          strong:
            "✅ Arquitecto: GPT-3.5 para borradores rápidos y resúmenes, GPT-4 para análisis estructurales complejos y razonamiento profundo — el material correcto para cada capa de la construcción",
        },
      },
      2: {
        objective:
          "🏗️ El Andamio del Arquitecto: El Ecosistema de Herramientas",
        objectiveDesc:
          "Domina todas las herramientas integradas de ChatGPT como un arquitecto domina su taller: Búsqueda Web, Intérprete de Código, DALL-E 3, Canvas y Proyectos. Aprende a combinarlas en flujos de obra profesionales.",
        achievements: [
          {
            icon: "fa-check",
            text: "Identificar cuándo usar cada herramienta como un arquitecto elige su herramienta precisa",
          },
          {
            icon: "fa-check",
            text: "Combinar múltiples herramientas en un solo flujo de trabajo como fases de una construcción",
          },
          {
            icon: "fa-check",
            text: "Crear automatizaciones que resuelvan problemas reales — tu obra terminada",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Usar DALL-E 3 para texto largo o logos — como usar un cincel para martillar",
          },
          {
            icon: "fa-times",
            text: "Confiar en la base de entrenamiento para datos actuales — como construir con planos desactualizados",
          },
          {
            icon: "fa-times",
            text: "No organizar proyectos por objetivos específicos — como mezclar materiales de 5 obras distintas",
          },
        ],
        example: {
          label: "Ejemplo de flujo integrado",
          weak: "❌ Aislado: Pedir datos actualizados sin activar Búsqueda Web → resultado desactualizado como un edificio sin cimientos",
          strong:
            "✅ Integrado: Buscar datos actuales (Browse) → analizarlos con Python (Code Interpreter) → generar infografía (DALL-E 3) → editar en Canvas — una construcción en 4 fases perfectamente orquestadas",
        },
      },
      3: {
        objective: "⚡ La Fachada del Edificio: Function Calling",
        objectiveDesc:
          "Integra tus construcciones de ChatGPT con el mundo exterior a través de APIs para que puedan consultar datos, ejecutar acciones y automatizar flujos de trabajo completos.",
        achievements: [
          {
            icon: "fa-check",
            text: "Configurar Function Calling con la API de OpenAI como sistemas de fontanería digital",
          },
          {
            icon: "fa-check",
            text: "Definir funciones con esquemas JSON claros — los planos de tus conexiones",
          },
          { icon: "fa-check", text: "Crear flujos automatizados multi-paso que funcionan 24/7" },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "No validar las respuestas de la API antes de usarlas — como no inspeccionar los materiales de construcción",
          },
          {
            icon: "fa-times",
            text: "Enviar datos sensibles sin autenticación — como dejar las puertas abiertas en tu obra",
          },
          {
            icon: "fa-times",
            text: "No manejar errores de conexión adecuadamente — como no tener plan de contingencia sísmica",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Prompt básico: ¿Cuál es el clima hoy? — como preguntar el clima mirando por la ventana",
          strong:
            "✅ Function Calling: ChatGPT detecta la intención, llama a la API del clima, recibe datos JSON y genera: El clima actual en Bogotá es 18°C con 65% de humedad. Te recomendamos llevar paraguas por probabilidad de lluvia del 80% esta tarde. Una fachada elegante que conecta con datos vivos del mundo real.",
        },
      },
    },
  },

  // ============================================================================
  // MÓDULO 3: RASTREO PROFUNDO CON GEMINI
  // ============================================================================
  3: {
    objective:
      "Afilia tu lupa digital: investiga a fondo, verifica cada pista y analiza información con la precisión de un detective profesional.",
    learningPoints: [
      { text: "Analizar texto, imagen y código como un solo cuerpo de evidencia", icon: "fa-cubes" },
      { text: "Obtener pistas frescas del mundo real al instante", icon: "fa-signal" },
      { text: "Excavar hasta la verdad: investigaciones que ningún otro detective hace", icon: "fa-search" },
      { text: "Separar los hechos de las alucinaciones: verificación forense con IA", icon: "fa-shield-alt" },
    ],
    overviewData: {
      title: "El Detective de Datos: Investigación de Élite con Gemini",
      description:
        "Bienvenido a la academia de detectives digitales. Aquí aprenderás a cruzar pistas en tiempo real, analizar cualquier tipo de evidencia (texto, imagen, audio, video) y verificar cada hecho con la precisión de un forense de datos.",
      mission:
        "Tu misión: convertirte en el mejor detective de datos del mundo. Domina Google Gemini para cruzar pistas, verificar cada fuente y presentar informes que cualquier director ejecutivo firmaría. Cada lección te acerca a tu insignia de detective digital.",
      topics: [
        {
          title: "El Despertar del Detective Multimodal",
          icon: "fa-google",
          resources: 2,
          duration: "20 min",
        },
        {
          title: "Grounding: Cuando la Evidencia Toca Tierra",
          icon: "fa-layer-group",
          resources: 2,
          duration: "20 min",
        },
        {
          title: "Deep Research: La Caja de Herramientas Forenses",
          icon: "fa-search",
          resources: 3,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "El Despertar del Detective Multimodal",
        description: "Gemini: tu lupa todoterreno que ve, lee y escucha a la vez",
        detailedDescription:
          "Imagina una lupa que no solo ve imágenes, sino que también lee documentos, escucha audios y analiza videos — todo al mismo tiempo. Esa es Gemini. En esta lección, aprenderás a usar este superpoder multimodal para analizar, crear y resolver casos que antes requerían 4 herramientas diferentes.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-google",
        badgeColor: "bg-blue-100 text-blue-800",
        themeColor: "#4285F4",
      },
      {
        id: 2,
        title: "Grounding: Cuando la IA Toca el Mundo Real",
        description: "Conecta tu lupa con la tierra firme: datos vivos del mundo real",
        detailedDescription:
          "¿De qué sirve una lupa si no puedes verificar lo que ves? El grounding conecta a Gemini con información viva de internet. Aprende a combinar imágenes, documentos y datos en tiempo real para obtener respuestas que no solo son inteligentes — son verificables.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-teal-100 text-teal-800",
        themeColor: "#00BCD4",
      },
      {
        id: 3,
        title: "Deep Research: La Caja de Herramientas Forenses",
        description: "Excava hasta encontrar la verdad con herramientas de investigación profunda",
        detailedDescription:
          "Los casos más complejos requieren las herramientas más poderosas. Domina la investigación profunda con IA: Deep Research para explorar temas en su totalidad, fact-checking automático para verificar cada fuente, y generación de informes técnicos que cualquier experto firmaría.",
        duration: "20 min",
        format: "Video",
        icon: "fa-search",
        badgeColor: "bg-indigo-100 text-indigo-800",
        themeColor: "#6366F1",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Objetivo Principal: Activar tu Lupa Multimodal",
        objectiveDesc:
          "Conoce a tu nueva arma secreta: descubre qué hace a Gemini único, cómo procesa múltiples tipos de evidencia y por qué supera a otros modelos en investigación multimodal.",
        achievements: [
          {
            icon: "fa-check",
            text: "Comprender cómo Gemini procesa texto, imágenes, audio y video como un solo lenguaje",
          },
          {
            icon: "fa-check",
            text: "Configurar tu arsenal: Gemini Advanced, Google AI Studio y todas las herramientas del detective",
          },
          {
            icon: "fa-check",
            text: "Saber exactamente cuándo usar Gemini vs. otros modelos — la herramienta correcta para cada caso",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Tratar a Gemini como un chatbot común — es como usar un bisturí para cortar pan",
          },
          {
            icon: "fa-times",
            text: "Ignorar su capacidad de análisis visual — la evidencia más rica suele estar en las imágenes",
          },
          { icon: "fa-times", text: "No usar el grounding — es como investigar con los ojos cerrados" },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Novato: Preguntar '¿Qué es Gemini?' — como un turista preguntando la hora",
          strong:
            "✅ Detective: Subir un gráfico financiero, pedir análisis de tendencias con correlación de datos históricos, cruzar con búsqueda en tiempo real de indicadores económicos, y recibir un informe ejecutivo listo para presentar a tu junta directiva",
        },
      },
      2: {
        objective: "🔬 Razonamiento Multimodal: El Superpoder del Detective Digital",
        objectiveDesc:
          "Desbloquea la capacidad de procesar múltiples tipos de evidencia a la vez: texto, imágenes, audio y código. Como tener 4 detectives trabajando en paralelo dentro de una sola mente.",
        achievements: [
          {
            icon: "fa-check",
            text: "Analizar imágenes y documentos como un perito forense digital",
          },
          {
            icon: "fa-check",
            text: "Usar grounding para obtener datos frescos de internet — información viva, no conocimiento congelado",
          },
          {
            icon: "fa-check",
            text: "Fusionar texto, imagen, audio y código en un único análisis coherente",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Subir evidencia borrosa sin contexto — los detectives trabajan con pistas claras",
          },
          {
            icon: "fa-times",
            text: "Confiar en grounding sin verificar — hasta la mejor fuente puede equivocarse",
          },
          {
            icon: "fa-times",
            text: "No decirle a Gemini qué tipo de análisis necesitas — es como pedirle a un forense 'mira esto'",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Novato: 'Analiza esta imagen' — sin contexto, sin instrucciones, sin dirección",
          strong:
            "✅ Detective: 'Analiza este diagrama de arquitectura como si fueras un auditor de sistemas. Identifica cada componente, traza el flujo de datos, señala vulnerabilidades de escalabilidad y compáralo con el estándar AWS 2024. Dame un informe ejecutivo de 3 párrafos con prioridades de acción.'",
        },
      },
      3: {
        objective: "🔍 Deep Research: El Arsenal del Investigador Forense",
        objectiveDesc:
          "Cuando los casos simples se vuelven complejos, necesitas Deep Research. Aprende a usar la potencia de Gemini para investigaciones exhaustivas con fuentes verificables, fact-checking automático y generación de informes que cualquier experto respetaría.",
        achievements: [
          {
            icon: "fa-check",
            text: "Ejecutar investigaciones profundas que cruzan decenas de fuentes automáticamente",
          },
          {
            icon: "fa-check",
            text: "Verificar cada hecho al instante — tu red de seguridad contra la desinformación",
          },
          {
            icon: "fa-check",
            text: "Producir informes de nivel consultor con referencias verificables y citas exactas",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Aceptar fuentes sin verificar — hasta el mejor detective verifica dos veces",
          },
          {
            icon: "fa-times",
            text: "Conformarse con la primera respuesta — la verdad suele estar en la segunda capa",
          },
          {
            icon: "fa-times",
            text: "No contrastar con fuentes primarias — la investigación de calidad se hace con documentos originales",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Novato: '¿Cuáles son las tendencias de IA en 2026?' — una pregunta que cualquiera puede responder con Google",
          strong:
            "✅ Detective: 'Realiza una investigación forense de las 5 tendencias principales de IA generativa en 2026. Para cada tendencia: fuente primaria verificada, datos cuantitativos de adopción empresarial, 2 casos de uso reales con nombres de empresas, riesgos identificados con nivel de criticidad, y proyección a 3 años con fuentes. Presenta como informe ejecutivo con enlaces verificables a cada fuente.'",
        },
      },
    },
  },

  // ============================================================================
  // MÓDULO 4: EL ALQUIMISTA DEL CONOCIMIENTO — NOTEBOOKLM
  // ============================================================================
  4: {
    objective:
      "Convierte documentos en oro: podcasts que suenan a radio profesional, resúmenes que van al grano y respuestas que citan cada fuente sin inventar nada.",
    learningPoints: [
      { text: "Curar tus fuentes como un joyero elige gemas", icon: "fa-book-open" },
      { text: "Destilar documentos en conocimiento puro con IA", icon: "fa-file-alt" },
      { text: "Crear podcasts que parecen programa de radio desde tus archivos", icon: "fa-microphone" },
      { text: "Gestionar tu biblioteca digital con inteligencia sobrehumana", icon: "fa-folder-open" },
    ],
    overviewData: {
      title: "Tu Laboratorio de Transformación Documental",
      description:
        "En este módulo, te convertirás en un alquimista digital: tus PDFs, artículos y apuntes tienen un potencial oculto que ni imaginas. Aprende a extraerlo, transformarlo y compartirlo en formatos que cautivan, educan y transforman.",
      mission:
        "Conviértete en un alquimista digital: tus PDFs, artículos y apuntes tienen un potencial oculto que ni imaginas. Aprende a extraerlo, transformarlo y compartirlo en formas que cautivan, educan y transforman.",
      topics: [
        {
          title: "El Alquimista de Documentos: Tu Primer Hechizo con NotebookLM",
          icon: "fa-microphone",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "El Arte de la Curaduría: Cómo Elegir y Sintetizar Fuentes",
          icon: "fa-book-open",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "La Fórmula Secreta: Audio Overviews y Gestión Documental",
          icon: "fa-podcast",
          resources: 3,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "El Alquimista de Documentos: Tu Primer Hechizo con NotebookLM",
        description: "Donde los PDFs cobran vida",
        detailedDescription:
          "Conoce NotebookLM, la herramienta de Google que convierte tus PDFs, artículos y apuntes en un asistente personal que responde con citas exactas. No alucina. No inventa. Es tu bibliotecario con superpoderes.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-microphone",
        badgeColor: "bg-amber-100 text-amber-800",
        themeColor: "#F59E0B",
      },
      {
        id: 2,
        title: "El Arte de la Curaduría: Cómo Elegir y Sintetizar Fuentes",
        description: "Calidad sobre cantidad, siempre",
        detailedDescription:
          "Aprende a seleccionar las mejores fuentes como un joyero elige gemas, organizarlas por temas y conectar ideas entre documentos para crear resúmenes y análisis de nivel profesional.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-book-open",
        badgeColor: "bg-green-100 text-green-800",
        themeColor: "#10B981",
      },
      {
        id: 3,
        title: "La Fórmula Secreta: Audio Overviews y Gestión Documental",
        description: "Tus documentos hablan por sí solos",
        detailedDescription:
          "Transforma tus documentos en conversaciones de podcast con dos voces IA. Una experiencia sonora que parece radio profesional. Ideal para aprender mientras te mueves. Gestiona tu biblioteca digital con inteligencia sobrehumana.",
        duration: "20 min",
        format: "Video",
        icon: "fa-podcast",
        badgeColor: "bg-violet-100 text-violet-800",
        themeColor: "#8B5CF6",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 El Hechizo Inicial",
        objectiveDesc:
          "Descubre el poder oculto de NotebookLM: cómo un asistente que solo habla de lo que sabe está revolucionando la gestión del conocimiento personal.",
        achievements: [
          {
            icon: "fa-check",
            text: "Comprender por qué la IA basada en tus propias fuentes es más confiable",
          },
          { icon: "fa-check", text: "Crear tu primer notebook y ver los documentos cobrar vida" },
          {
            icon: "fa-check",
            text: "Distinguir un bibliotecario experto (NotebookLM) de un chatbot genérico",
          },
        ],
        warnings: [
          { icon: "fa-times", text: "Subir documentos sin orden ni concierto como quien llena un cajón" },
          {
            icon: "fa-times",
            text: "Esperar magia sin poner fuentes de calidad en el caldero",
          },
          {
            icon: "fa-times",
            text: "Olvidar que solo responde con lo que TÚ le das — basura entra, basura sale",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Catalina subió 50 PDFs sin organizar y obtuvo respuestas confusas. Basura entra, basura sale.",
          strong:
            "✅ Felipe seleccionó 5 papers clave, los organizó por tema, añadió contexto — y su notebook se convirtió en un asistente experto que respondía con citas exactas. La diferencia: calidad sobre cantidad.",
        },
      },
      2: {
        objective: "📚 Curaduría: El Arte de Elegir Bien",
        objectiveDesc:
          "Descubre por qué un puñado de fuentes bien seleccionadas vale más que una biblioteca entera sin orden.",
        achievements: [
          {
            icon: "fa-check",
            text: "Seleccionar fuentes como un catador de vinos elige su cosecha",
          },
          {
            icon: "fa-check",
            text: "Organizar documentos por temas para que las conexiones surjan solas",
          },
          {
            icon: "fa-check",
            text: "Crear síntesis que cruzan ideas entre múltiples fuentes como un puente de conocimiento",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Subir 50 documentos sin filtro — más no es mejor, es ruido",
          },
          {
            icon: "fa-times",
            text: "Mezclar fuentes contradictorias sin contexto, como juntar agua y aceite",
          },
          { icon: "fa-times", text: "Dejar las fuentes envejecer sin actualizarlas — el conocimiento caduca" },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Sin curaduría: Subir todo lo que encuentro sobre IA — sin filtro, sin orden, sin criterio",
          strong:
            "✅ Con curaduría: 10 papers seleccionados por relevancia, organizados por tema (ética, técnica, aplicaciones), con notas de contexto para cada grupo — como una biblioteca diseñada por un experto",
        },
      },
      3: {
        objective: "🎙️ Audio Overviews: Tus Documentos en la Radio",
        objectiveDesc:
          "Transforma documentos complejos en conversaciones de audio fascinantes generadas por IA con dos presentadores virtuales que suenan a programa de verdad.",
        achievements: [
          {
            icon: "fa-check",
            text: "Generar Audio Overviews desde tus documentos y escucharlos cobrar vida",
          },
          {
            icon: "fa-check",
            text: "Personalizar el tono: académico profundo o conversación casual, tú eliges",
          },
          {
            icon: "fa-check",
            text: "Convertir el estudio en experiencia auditiva para aprender donde sea",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Esperar un podcast de 30 minutos con solo 2 párrafos de fuente",
          },
          {
            icon: "fa-times",
            text: "No revisar el contenido antes de compartirlo — el alquimista siempre verifica su poción",
          },
          {
            icon: "fa-times",
            text: "Usar solo audio sin complementar con resúmenes escritos — los dos formatos se potencian",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Audio genérico: Dos voces leyendo el documento sin chispa ni estructura",
          strong:
            "✅ Audio enfocado: Podcast de 15 minutos donde dos presentadores discuten los hallazgos clave de 5 papers sobre neuroplasticidad, con ejemplos prácticos, analogías y hasta un momento '¡ahá!' que lo hace inolvidable",
        },
      },
    },
  },

  // ============================================================================
  // MÓDULO 5: ÉTICA APLICADA A IA GENERATIVA
  // ============================================================================
  5: {
    objective:
      "Domina los 4 pilares éticos que las empresas buscan hoy y conviértete en el guardián que asegura que la IA sirva a la humanidad.",
    learningPoints: [
      { text: "Detectar sesgos algorítmicos como un guardián", icon: "fa-shield-check" },
      { text: "Conocer la regulación IA que protege a millones", icon: "fa-briefcase" },
      { text: "Blindar datos y privacidad contra amenazas", icon: "fa-lock" },
      { text: "Crear protocolos éticos que salvan reputaciones", icon: "fa-clipboard-check" },
    ],
    overviewData: {
      title: "El Arte de la Guardia Ética",
      description:
        "Cada vez que usas IA, estás tomando decisiones éticas — aunque no lo sepas. ¿Los datos que subes están protegidos? ¿El resultado es justo para todos? ¿Sabes quién es responsable si algo sale mal? Este módulo no es solo teoría: es tu entrenamiento para convertirte en un guardián de la IA.",
      mission:
        "Convertirte en el guardián que la IA necesita. Este módulo cierra tu certificación con las competencias éticas que separan a los profesionales responsables de los que ponen en riesgo su carrera.",
      topics: [
        {
          title: "El Voto del Guardián: Los 4 Principios Sagrados",
          icon: "fa-balance-scale",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "El Espejo de la Verdad: ¿Tu IA es Justa?",
          icon: "fa-exclamation-triangle",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "El Legado del Guardián: Navegando la Ley",
          icon: "fa-shield-alt",
          resources: 2,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "El Voto del Guardián: Los 4 Principios Sagrados",
        description: "Los fundamentos éticos que todo guardián de IA debe conocer",
        detailedDescription:
          "Bienvenido al entrenamiento de guardianes. Antes de usar cualquier herramienta de IA, hay 4 principios que debes grabar en tu ADN profesional: transparencia, equidad, responsabilidad y privacidad. No son teoría abstracta — son el escudo que protege a tus usuarios, tu organización y tu reputación.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-balance-scale",
        badgeColor: "bg-red-100 text-red-800",
        themeColor: "#EF4444",
      },
      {
        id: 2,
        title: "El Espejo de la Verdad: ¿Tu IA es Justa?",
        description: "Detecta y destruye los sesgos ocultos en los algoritmos",
        detailedDescription:
          "Cada algoritmo hereda los prejuicios de sus creadores y sus datos. En esta lección, te convertirás en un cazador de sesgos: aprenderás a detectar discriminación algorítmica, entender sus causas profundas y aplicar estrategias de justicia que hagan tus sistemas verdaderamente inclusivos.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-exclamation-triangle",
        badgeColor: "bg-orange-100 text-orange-800",
        themeColor: "#F97316",
      },
      {
        id: 3,
        title: "El Legado del Guardián: Navegando la Ley",
        description: "El marco legal y las mejores prácticas que todo guardián debe dominar",
        detailedDescription:
          "No basta con querer hacer lo correcto — hay que conocer la ley. Desde el AI Act de la UE hasta las regulaciones locales, pasando por protección de datos y gobernanza corporativa. Esta lección te da el mapa legal para navegar la IA sin poner en riesgo a nadie.",
        duration: "20 min",
        format: "Video",
        icon: "fa-shield-alt",
        badgeColor: "bg-slate-100 text-slate-800",
        themeColor: "#64748B",
      },
    ],
    accordionContent: {
      1: {
        objective: "🛡️ El Juramento del Guardián Ético",
        objectiveDesc:
          "Desarrollar un marco ético blindado para el uso de IA generativa que proteja a usuarios, organizaciones y la sociedad de los riesgos invisibles de la tecnología.",
        achievements: [
          {
            icon: "fa-check",
            text: "Internalizar los 4 pilares sagrados del guardián de IA",
          },
          {
            icon: "fa-check",
            text: "Detectar dilemas éticos en casos reales antes de que causen daño",
          },
          {
            icon: "fa-check",
            text: "Aplicar un checklist ético infalible antes de cada uso de IA",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Usar IA como un arma sin escudo: ignorar el impacto en las personas",
          },
          {
            icon: "fa-times",
            text: "Creer que la IA es neutral — la tecnología sin vigilancia es peligrosa",
          },
          {
            icon: "fa-times",
            text: "Ignorar las consecuencias no intencionadas hasta que es demasiado tarde",
          },
        ],
        example: {
          label: "El Guardián vs. El Imprudente",
          weak: "❌ El imprudente: Un estudiante usó IA para generar un ensayo completo sin verificar nada. La IA inventó datos, citas falsas y referencias inexistentes. El profesor descubrió todo y el estudiante perdió toda credibilidad académica.",
          strong:
            "✅ El guardián: Un estudiante usó IA como asistente, verificó cada fuente con datos reales, divulgó su uso al profesor y entregó un trabajo impecable. El resultado: aprendizaje profundo + confianza del profesor + nota perfecta.",
        },
      },
      2: {
        objective: "🔍 El Cazador de Sesgos: Encuentra al Enemigo Invisible",
        objectiveDesc:
          "Entrena tu ojo de guardián para detectar, entender y eliminar los sesgos que los sistemas de IA heredan de sus datos de entrenamiento — antes de que hagan daño.",
        achievements: [
          {
            icon: "fa-check",
            text: "Identificar 7 tipos de sesgos algorítmicos como un experto forense",
          },
          {
            icon: "fa-check",
            text: "Analizar casos reales donde la IA discriminó — y entender por qué",
          },
          {
            icon: "fa-check",
            text: "Aplicar técnicas quirúrgicas de mitigación de sesgos",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Confiar ciegamente en resultados de IA sin verificar equidad",
          },
          {
            icon: "fa-times",
            text: "Alimentar la IA con datos de entrenamiento que excluyen a grupos enteros",
          },
          {
            icon: "fa-times",
            text: "Nunca auditar los outputs de IA — el silencio no es seguridad",
          },
        ],
        example: {
          label: "La IA que Discriminaba sin Saberlo",
          weak: "❌ Sesgado: Una IA de contratación aprendió de 10 años de datos históricos donde solo hombres ocupaban ciertos puestos. Automáticamente comenzó a filtrar mujeres — no por malicia, por datos corruptos.",
          strong:
            "✅ Equitativo: El equipo auditor detectó el sesgo en la fase de prueba, reentrenó el modelo con datos balanceados, incluyó variables de equidad y estableció auditorías trimestrales. La IA ahora selecciona sin prejuicios.",
        },
      },
      3: {
        objective: "📜 El Código del Guardián: Leyes que Protegen a Millones",
        objectiveDesc:
          "Conoce las regulaciones que gobiernan la IA en el mundo y aprende a diseñar protocolos de gobernanza que blinden a tu organización contra riesgos legales y reputacionales.",
        achievements: [
          { icon: "fa-check", text: "Dominar el AI Act de la Unión Europea como un experto en cumplimiento" },
          {
            icon: "fa-check",
            text: "Entender las obligaciones legales de privacidad y transparencia",
          },
          {
            icon: "fa-check",
            text: "Diseñar un protocolo ético de IA digno de un guardián",
          },
        ],
        warnings: [
          { icon: "fa-times", text: "Ignorar la regulación vigente — la ignorancia no exime de multas" },
          {
            icon: "fa-times",
            text: "Procesar datos personales con IA sin protección legal",
          },
          {
            icon: "fa-times",
            text: "Implementar IA en tu organización sin políticas de gobernanza",
          },
        ],
        example: {
          label: "Dos Mundos, un Solo Algoritmo",
          weak: "❌ Sin protocolo: Una startup implementó chatbots de atención al cliente sin supervisión ética. En 48 horas, el chatbot había insultado a clientes en 3 idiomas, violado normas de privacidad y generado una crisis de relaciones públicas.",
          strong:
            "✅ Con protocolo: Comité de ética de IA aprobó cada implementación, auditorías trimestrales detectaron problemas antes de que llegaran al público, checklist de privacidad obligatorio antes de cada despliegue y divulgación transparente al usuario final. Resultado: confianza del cliente, cero incidentes.",
        },
      },
    },
  },
};

export { CONTENT_ES };
