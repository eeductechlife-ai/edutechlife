export const toolRules = [
  {
    keywords: [
      "imagen",
      "dibujo",
      "ilustración",
      "diseño",
      "logo",
      "arte",
      "visual",
      "infografía",
      "poster",
      "gráfico",
    ],
    tool: { id: "dalle", title: "DALL-E 3", icon: "fa-image", color: "purple" },
    reason:
      "DALL-E 3 es ideal para generar imágenes y contenido visual original a partir de descripciones textuales.",
    model: "ChatGPT (multimodal)",
    mode: "Fast",
    prompt:
      "Crea una imagen de [descripción detallada] con estilo [realista/ilustración/arte] en formato [horizontal/vertical/cuadrado]. Incluye [elementos específicos].",
    tips: [
      "Sé específico con el estilo visual (realista, ilustración, acuarela)",
      "Describe la composición: colores, iluminación, perspectiva",
      "Para texto largo en imágenes, usa Canvas como complemento",
    ],
    alternatives: ["Canvas: edición y refinamiento de documentos visuales"],
  },
  {
    keywords: [
      "analizar",
      "datos",
      "excel",
      "csv",
      "estadísticas",
      "reporte",
      "gráfico",
      "ventas",
      "presupuesto",
      "numérico",
      "cálculo",
      "matemáticas",
    ],
    tool: {
      id: "code",
      title: "Intérprete de Código",
      icon: "fa-code",
      color: "emerald",
    },
    reason:
      "El Intérprete de Código ejecuta Python real para analizar datos, crear visualizaciones y realizar cálculos complejos.",
    model: "ChatGPT",
    mode: "Thinking",
    prompt:
      "Tengo este archivo de datos [describe los datos]. Necesito que: 1. Limpies los datos 2. Calcules [métrica específica] 3. Generes una visualización de [tipo de gráfico]. Los resultados deben mostrarse como tabla y gráfico.",
    tips: [
      "Sube el archivo directamente al chat para mejor análisis",
      "Especifica qué columnas son relevantes",
      "Pide visualizaciones específicas (barras, dispersión, líneas)",
    ],
    alternatives: ["Búsqueda Web: para datos actualizados en tiempo real"],
  },
  {
    keywords: [
      "código",
      "programar",
      "desarrollar",
      "api",
      "script",
      "depurar",
      "función",
      "algoritmo",
      "software",
      "app",
    ],
    tool: {
      id: "code",
      title: "Intérprete de Código",
      icon: "fa-code",
      color: "emerald",
    },
    reason:
      "El Intérprete de Código puede escribir, ejecutar y depurar código Python en tiempo real dentro del chat.",
    model: "ChatGPT",
    mode: "Thinking",
    prompt:
      "Necesito desarrollar [descripción del código]. Requisitos: [lista de requisitos]. El lenguaje debe ser [lenguaje]. Incluye: 1. Código completo 2. Comentarios explicativos 3. Ejemplo de uso 4. Manejo de errores.",
    tips: [
      "Sé específico sobre el lenguaje y versión",
      "Incluye ejemplos de entrada/salida esperada",
      "Pide pruebas unitarias para validar el código",
    ],
    alternatives: ["Canvas: para edición colaborativa de código largo"],
  },
  {
    keywords: [
      "escribir",
      "ensayo",
      "documento",
      "corregir",
      "editar",
      "redactar",
      "texto",
      "artículo",
      "informe",
      "carta",
      "email",
    ],
    tool: {
      id: "canvas",
      title: "Canvas",
      icon: "fa-file-lines",
      color: "orange",
    },
    reason:
      "Canvas permite editar documentos largos de forma colaborativa, ajustando secciones específicas sin regenerar todo el texto.",
    model: "ChatGPT",
    mode: "Fast",
    prompt:
      "Ayúdame a [escribir/mejorar/editar] un [tipo de documento] sobre [tema]. El tono debe ser [formal/informal/técnico]. La extensión aproximada es [número] páginas. Enfócate en: [puntos clave].",
    tips: [
      "Usa Canvas para editar secciones específicas sin regenerar todo",
      "Pide sugerencias de mejora párrafo por párrafo",
      "Aprovecha el editor lateral para comparar versiones",
    ],
    alternatives: [
      "Intérprete de Código: para documentos con datos y gráficos",
    ],
  },
  {
    keywords: [
      "investigar",
      "buscar",
      "noticias",
      "actualidad",
      "verificar",
      "información reciente",
      "hechos",
      "fuentes",
    ],
    tool: {
      id: "browse",
      title: "Búsqueda Web",
      icon: "fa-globe",
      color: "blue",
    },
    reason:
      "La Búsqueda Web permite a ChatGPT acceder a internet en tiempo real para obtener información actualizada.",
    model: "ChatGPT",
    mode: "Fast",
    prompt:
      "Busca información actualizada sobre [tema]. Necesito: 1. Datos recientes (últimos [período]) 2. Fuentes confiables 3. Estadísticas clave 4. Tendencias principales. Verifica la información con múltiples fuentes.",
    tips: [
      "Siempre verifica las fuentes que proporciona la IA",
      "Pide comparar información de múltiples fuentes",
      "Úsalo para datos que cambian rápido: precios, noticias, clima",
    ],
    alternatives: [
      "Intérprete de Código: para analizar datos descargados de la web",
    ],
  },
  {
    keywords: [
      "aprender",
      "estudiar",
      "resumir",
      "explicar",
      "conceptos",
      "tutorial",
      "guía",
      "educación",
      "clase",
    ],
    tool: {
      id: "multi",
      title: "Browse + Canvas",
      icon: "fa-graduation-cap",
      color: "indigo",
    },
    reason:
      "Combinar Búsqueda Web con Canvas te permite investigar y luego organizar la información en un documento estructurado.",
    model: "ChatGPT",
    mode: "Thinking",
    prompt:
      "Necesito aprender sobre [tema]. Crea una guía de estudio que incluya: 1. Resumen ejecutivo 2. Conceptos clave con explicaciones simples 3. Ejemplos prácticos 4. Preguntas de autoevaluación. El nivel de profundidad debe ser [básico/intermedio/avanzado].",
    tips: [
      "Primero investiga con Browse, luego organiza con Canvas",
      "Pide ejemplos prácticos relacionados con tu campo",
      "Usa el Modo Thinking para explicaciones más profundas",
    ],
    alternatives: ["DALL-E 3: para crear material visual de apoyo"],
  },
  {
    keywords: [
      "automatizar",
      "flujo",
      "workflow",
      "tarea repetitiva",
      "proceso",
      "integrar",
      "conectar",
      "zapier",
      "make",
    ],
    tool: {
      id: "gpts",
      title: "GPTs + Acciones",
      icon: "fa-robot",
      color: "cyan",
    },
    reason:
      "Los GPTs personalizados con Acciones pueden automatizar flujos completos conectándose con APIs externas como Slack, Gmail o Sheets.",
    model: "ChatGPT",
    mode: "Thinking",
    prompt:
      "Quiero automatizar [descripción del proceso]. El flujo actual es: [pasos actuales]. El resultado deseado es: [objetivo]. Las herramientas disponibles son: [herramientas]. Diseña una automatización que incluya: 1. Trigger (evento que inicia) 2. Acción de IA 3. Destino del resultado.",
    tips: [
      "Define claramente el evento que inicia la automatización",
      "Empieza con flujos simples y ve agregando complejidad",
      "Usa GPTs personalizados para tareas específicas recurrentes",
    ],
    alternatives: [
      "Intérprete de Código: para automatizaciones vía API directa",
    ],
  },
  {
    keywords: [
      "recordar",
      "guardar",
      "proyecto",
      "preferencias",
      "perfil",
      "memoria",
      "contexto",
      "persistente",
      "historial",
    ],
    tool: {
      id: "memory",
      title: "Memoria y Proyectos",
      icon: "fa-database",
      color: "indigo",
    },
    reason:
      "La Memoria permite a ChatGPT recordar tus preferencias, y los Proyectos organizan conversaciones y archivos bajo un mismo contexto.",
    model: "ChatGPT",
    mode: "Fast",
    prompt:
      "Configura un Proyecto para [tema/proyecto] con las siguientes instrucciones: [instrucciones específicas]. Los archivos base son: [archivos]. El tono de comunicación debe ser: [tono]. Las preferencias a recordar son: [preferencias].",
    tips: [
      "Configura un Proyecto con instrucciones fijas y archivos base",
      "La Memoria mejora con el uso constante",
      "Usa proyectos separados para temas distintos",
    ],
    alternatives: [
      "GPTs Personalizados: para tareas especializadas con instrucciones fijas",
    ],
  },
];

export const getSuggestions = (t) => [
  {
    icon: "fa-chart-simple",
    label: t("ialab.interaction_advisor.analyze_data"),
    text: "Quiero analizar datos de ventas del último trimestre y generar un reporte con gráficos",
  },
  {
    icon: "fa-image",
    label: t("ialab.interaction_advisor.create_image"),
    text: "Necesito crear una infografía educativa sobre el ciclo del agua para niños",
  },
  {
    icon: "fa-code",
    label: t("ialab.interaction_advisor.write_code"),
    text: "Quiero desarrollar una función en Python que procese archivos CSV y limpie datos",
  },
  {
    icon: "fa-file-lines",
    label: t("ialab.interaction_advisor.write_text"),
    text: "Necesito escribir un ensayo académico sobre el impacto de la IA en la educación",
  },
  {
    icon: "fa-graduation-cap",
    label: t("ialab.interaction_advisor.learn_topic"),
    text: "Quiero aprender los fundamentos del machine learning con ejemplos prácticos",
  },
  {
    icon: "fa-robot",
    label: t("ialab.interaction_advisor.automate"),
    text: "Necesito automatizar el envío de correos de bienvenida cuando un usuario se registra",
  },
];

export const findRecommendation = (text) => {
  if (!text || text.length < 3) return null;
  const lower = text.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;
  toolRules.forEach((rule) => {
    let score = 0;
    rule.keywords.forEach((kw) => {
      if (lower.includes(kw.toLowerCase())) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule;
    }
  });
  return bestMatch;
};

export const getToolColor = (color) => {
  const colors = {
    purple: "purple",
    emerald: "emerald",
    orange: "orange",
    blue: "blue",
    indigo: "indigo",
    cyan: "cyan",
  };
  return colors[color] || "slate";
};
