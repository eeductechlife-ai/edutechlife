export const learningObjectives = [
  "Comprender el concepto de IA basada en fuentes propias",
  "Aprender a crear y gestionar notebooks en Gemini Notebook",
  "Diferenciar Gemini Notebook de chatbots tradicionales",
  "Aplicar estrategias de investigación con documentos propios",
];

export const furtherReading = [
  {
    title: "Guía de Gemini Notebook — Google",
    url: "https://notebooklm.google.com/",
    description: "Plataforma oficial de Gemini Notebook de Google.",
  },
  {
    title: "Cómo usar Gemini Notebook para investigar",
    url: "https://blog.google/technology/ai/notebooklm/",
    description: "Guía oficial de Google sobre cómo usar Gemini Notebook.",
  },
];

export const contentScreens = [
  {
    id: "intro",
    title: "¿Qué es Gemini Notebook y para qué sirve?",
    subtitle:
      "Exploración guiada de Gemini Notebook: crea tu primer cuaderno con documentos propios",
    objective:
      "Entender el concepto de IA basada en fuentes propias y crear tu primer notebook",
    maxText:
      "Gemini Notebook es una herramienta de Google que revoluciona la gestión del conocimiento personal. A diferencia de los chatbots tradicionales, trabaja exclusivamente con los documentos que tú le entregas. Esto significa que sus respuestas están fundamentadas en tus fuentes, lo que reduce el riesgo de alucinaciones (no lo elimina). Tu objetivo es comprender cómo funciona y por qué es diferente a los chatbots genéricos.",
    achievements: [
      { text: "Entender el concepto de IA basada en fuentes propias" },
      { text: "Crear tu primer notebook con documentos" },
      { text: "Diferenciar Gemini Notebook de chatbots genéricos" },
    ],
    warnings: [
      { text: "Subir documentos sin curar ni organizar" },
      { text: "Esperar que funcione sin fuentes de calidad" },
      { text: "No entender que solo responde basado en tus fuentes" },
    ],
    example: {
      weak: "Notebook vacío: Sin fuentes subidas, sin contexto",
      strong:
        "Notebook potente: 5 PDFs de investigación académica + 3 artículos de industria = Asistente experto que responde con citas textuales de tus documentos",
    },
    image:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "features",
    title: "Curaduría de Fuentes y Síntesis de Documentos",
    subtitle: "Calidad sobre cantidad en tu investigación",
    objective:
      "Aprender a seleccionar, organizar y sintetizar documentos para maximizar el valor de tu notebook",
    maxText:
      "La curaduría de fuentes es la clave para sacar el máximo provecho a Gemini Notebook. No se trata de subir la mayor cantidad de documentos, sino de seleccionar los más relevantes y organizarlos estratégicamente. Aprenderás a elegir fuentes confiables, categorizarlas por temas y generar síntesis cruzadas que te den una visión integral de tu investigación.",
    achievements: [
      { text: "Seleccionar fuentes relevantes y confiables" },
      { text: "Organizar documentos por categorías temáticas" },
      { text: "Generar síntesis cruzadas entre múltiples fuentes" },
    ],
    warnings: [
      { text: "Subir documentos sin filtro de calidad" },
      { text: "Mezclar fuentes contradictorias sin contexto" },
      { text: "No actualizar las fuentes regularmente" },
    ],
    example: {
      weak: "Subir todo lo que encuentro sobre IA sin ningún criterio",
      strong:
        "10 papers seleccionados por relevancia, organizados por tema (ética, técnica, aplicaciones), con notas de contexto para cada grupo",
    },
    image:
      "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "practices",
    title: "Audio Overviews y Gestión Documental con IA",
    subtitle: "Tu conocimiento en formato podcast",
    objective:
      "Transformar documentos complejos en conversaciones de audio con dos presentadores virtuales",
    maxText:
      "Una de las funciones más impresionantes de Gemini Notebook es Audio Overview. Esta herramienta convierte tus documentos en conversaciones de podcast generadas por IA, con dos presentadores virtuales que discuten los hallazgos clave. Es ideal para repasar contenido mientras te desplazas, pero recuerda complementarlo con resúmenes escritos y siempre revisar el contenido generado.",
    achievements: [
      { text: "Generar Audio Overviews desde tus documentos" },
      { text: "Personalizar el tono y enfoque del podcast" },
      { text: "Usar audio para repaso y aprendizaje móvil" },
    ],
    warnings: [
      { text: "Esperar audio perfecto con documentos cortos" },
      { text: "No revisar el contenido generado antes de compartir" },
      { text: "Usar solo audio sin complementar con resúmenes escritos" },
    ],
    example: {
      weak: "Conversación vaga y genérica sobre el tema sin profundidad",
      strong:
        "Podcast de 15 minutos donde dos presentadores discuten los hallazgos clave de 5 papers sobre neuroplasticidad, con ejemplos prácticos y analogías claras",
    },
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
  },
];

export const questionsData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000",
    question:
      "Según la guía, ¿cuál es el 'superpoder' principal de Gemini Notebook?",
    options: [
      "Busca información en todo internet para darte respuestas más largas.",
      "Trabaja exclusivamente con las fuentes y documentos que tú le entregas.",
      "Traduce documentos a más de 100 idiomas automáticamente.",
      "Crea videos animados a partir de tus textos de estudio.",
    ],
    correct: 1,
    explanation:
      "¡Correcto! Gemini Notebook se diferencia porque solo usa la información que tú subes. Así se asegura de no inventar datos que no están en tus apuntes.",
    hint: "Lee bien las opciones; este asistente está diseñado para ser totalmente fiel a tus propios documentos, no a internet.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000",
    question:
      "¿Cuál es la diferencia más importante entre usar ChatGPT y Gemini Notebook para estudiar?",
    options: [
      "ChatGPT usa 'todo el internet' y Gemini Notebook usa 'solo tus fuentes cargadas'.",
      "Usan la misma información: solo cambia el nombre.",
      "Gemini Notebook usa el mismo conocimiento general de internet que ChatGPT.",
      "ChatGPT es para matemáticas y Gemini Notebook es para historia.",
    ],
    correct: 0,
    explanation:
      "Exacto. Mientras ChatGPT tiene conocimiento general de toda la web, Gemini Notebook se enfoca en ser súper preciso y estricto solo con los documentos que tú elegiste.",
    hint: "Piensa en el origen de los datos de cada uno. Uno busca en todo el mundo y el otro solo en lo que tú le das.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    question:
      "¿Qué increíble función tiene Gemini Notebook para ayudarte a 'escuchar' tus documentos?",
    options: [
      "Una canción estilo rap con las palabras clave más importantes.",
      "Un audiolibro monótono narrado por tu propia voz clonada.",
      "Una alarma para despertarte recordando el texto principal.",
      "Un 'Podcast' (Audio Overview) generado por IA con dos voces que conversan sobre tu tema.",
    ],
    correct: 3,
    explanation:
      "¡Muy bien! La herramienta 'Audio Overview' crea una simulación de podcast muy realista donde dos anfitriones discuten tus apuntes, ideal para estudiar escuchando.",
    hint: "Es un formato de audio muy popular hoy en día en el que dos anfitriones conversan sobre un tema.",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
    question:
      "Gemini Notebook suele responder desde tus documentos. ¿Qué significa eso para la verificación?",
    options: [
      "Que no te permite subir documentos sobre temas de ciencia ficción.",
      "Que bloquea automáticamente las páginas web con virus o publicidad engañosa.",
      "Que puede equivocarse igual, así que debes abrir la cita y comprobar el fragmento original.",
      "Que corrige tu ortografía y gramática sin que te des cuenta.",
    ],
    correct: 2,
    explanation:
      "Correcto. Reducir el riesgo no lo elimina: la cita te permite comprobar cada afirmación.",
    hint: "En el mundo de la IA, 'alucinar' significa inventar cosas que no son reales.",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    question:
      "Si estás haciendo un trabajo en grupo para la escuela o universidad, ¿puedes usar Gemini Notebook con tus compañeros?",
    options: [
      "No, es una herramienta estrictamente para uso individual.",
      "Sí, puedes compartir tus 'Cuadernos' con tu equipo igual que un Google Doc.",
      "Solo si todos están conectados a la misma red Wi-Fi en el mismo salón.",
      "Sí, pero la IA solo le responderá las preguntas al creador del grupo.",
    ],
    correct: 1,
    explanation:
      "¡Así es! Puedes colaborar en equipo. Todos pueden leer el mismo cuaderno, hacerle preguntas a las mismas fuentes y escuchar el mismo podcast generado.",
    hint: "Como es una herramienta de Google, su función para grupos se parece mucho a cómo compartes archivos en Google Drive.",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
    question:
      "Según las 'Mejores Prácticas' de la guía, ¿qué debes hacer SIEMPRE que Gemini Notebook te da una respuesta?",
    options: [
      "Verificar siempre la cita o la parte exacta de donde sacó la información.",
      "Borrar el documento original de tu computadora porque ya no lo necesitas.",
      "Pedirle que lo traduzca a otro idioma para asegurar que sea de buena calidad.",
      "Copiar y pegar la respuesta directamente en tu tarea sin necesidad de leerla.",
    ],
    correct: 0,
    explanation:
      "Excelente. Gemini Notebook es un gran asistente, pero tú eres el estudiante. Siempre debes verificar haciendo clic en las citas para ver de qué parte del texto original sacó la idea.",
    hint: "Recuerda que tú eres el estudiante y la máquina es el asistente. Debes asegurarte de revisar las fuentes.",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1000",
    question:
      "Según el manual, ¿cuántos documentos o fuentes diferentes puedes subir a un mismo cuaderno en Gemini Notebook?",
    options: [
      "Solo 1 fuente muy larga a la vez.",
      "Hasta 5 fuentes pequeñas.",
      "Depende de tu cuenta: revisa el límite vigente y sube pocas fuentes del mismo tema.",
      "Subir todas tus fuentes sin elegir, sin importar el tema.",
    ],
    correct: 2,
    explanation:
      "Correcto. Conviene pocas fuentes, del mismo tema y con autor y fecha. El límite de fuentes depende de tu cuenta: revísalo ahí.",
    hint: "Revisa el límite en tu cuenta antes de subir fuentes.",
  },
];
