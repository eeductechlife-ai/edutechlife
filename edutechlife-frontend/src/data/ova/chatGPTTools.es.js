export const tools = [
  {
    id: "browse",
    title: "Búsqueda web",
    icon: "Globe",
    iconColor: "text-blue-500",
    desc: "Conecta a ChatGPT con información reciente y te muestra las fuentes. Comprueba: abre al menos una fuente y confirma la fecha antes de usar una cifra.",
    pros: [
      "Noticias y precios recientes",
      "Normas y datos vigentes",
      "Fuentes que puedes abrir",
    ],
    cons: [
      "No sirve para conceptos básicos que ya conoces",
      "Una respuesta sin fuentes es solo una hipótesis",
    ],
    prompt:
      "Busca el precio actual de [producto] en mi ciudad y dame los enlaces de las fuentes con la fecha.",
    audio:
      "La búsqueda web permite a ChatGPT consultar información reciente. Pide siempre las fuentes y abre al menos una antes de usar una cifra.",
    useCases: [
      "Comparar precios",
      "Revisar normas vigentes",
      "Confirmar una noticia",
    ],
  },
  {
    id: "files",
    title: "Análisis de archivos y datos",
    icon: "Code",
    iconColor: "text-emerald-500",
    desc: "Lee tus PDF, hojas de cálculo y tablas para resumirlas, ordenarlas o graficarlas. Comprueba: recalcula una fila a mano y pide la página de cada dato.",
    pros: [
      "Resumir documentos largos",
      "Ordenar y graficar una tabla",
      "Responder preguntas sobre tu archivo",
    ],
    cons: [
      "Puede equivocarse con tablas muy desordenadas",
      "No subas datos personales de terceros",
    ],
    prompt:
      "Revisa esta hoja de ventas, hazme una tabla por mes y un gráfico de barras, y dime cómo calculaste cada total.",
    audio:
      "El análisis de archivos permite subir un documento o una tabla y pedir un resumen o un gráfico. Recalcula una fila a mano para comprobar el resultado.",
    useCases: [
      "Resumir un informe",
      "Graficar ventas del mes",
      "Ordenar una lista de contactos sin datos sensibles",
    ],
  },
  {
    id: "images",
    title: "Creación de imágenes",
    icon: "ImageIcon",
    iconColor: "text-purple-500",
    desc: "Transforma una descripción en una ilustración. Comprueba: revisa los textos dentro de la imagen y los derechos; una imagen ilustra, no prueba.",
    pros: ["Ilustrar una idea", "Fondos y portadas", "Ideas visuales rápidas"],
    cons: [
      "Falla con textos largos dentro de la imagen",
      "No copia logos ni marcas con exactitud",
    ],
    prompt:
      "Crea una ilustración sencilla del ciclo del agua con etapas claras y sin texto dentro de la imagen.",
    audio:
      "La creación de imágenes sirve para ilustrar ideas. Revisa los detalles, los textos y los derechos antes de publicar.",
    useCases: [
      "Material didáctico visual",
      "Portadas",
      "Visualizar un concepto",
    ],
  },
  {
    id: "canvas",
    title: "Canvas",
    icon: "Layout",
    iconColor: "text-orange-500",
    desc: "Un panel al lado del chat para editar un texto contigo. Comprueba: lee cada cambio antes de aceptarlo.",
    pros: [
      "Editar solo un párrafo",
      "Ajustar tono y longitud",
      "Mantener el resto del documento",
    ],
    cons: [
      "Útil sobre todo en textos largos",
      "Los cambios hay que revisarlos uno a uno",
    ],
    prompt:
      "Abre Canvas y ayúdame a ordenar un texto sobre mi emprendimiento; cambia solo el segundo párrafo.",
    audio:
      "Canvas abre un panel junto al chat donde tú y ChatGPT trabajan sobre el mismo documento. Revisa cada cambio antes de aceptarlo.",
    useCases: [
      "Reescribir una sección",
      "Mejorar un correo largo",
      "Adaptar un manual",
    ],
  },
  {
    id: "voice",
    title: "Voz",
    icon: "Mic",
    iconColor: "text-indigo-500",
    desc: "Conversa con ChatGPT hablando: sirve para practicar, dictar y pensar en voz alta. Comprueba: confirma la transcripción antes de enviar algo importante.",
    pros: [
      "Practicar un idioma",
      "Dictar ideas mientras caminas",
      "Lluvia de ideas rápida",
    ],
    cons: [
      "Puede entender mal nombres y cifras",
      "Depende de tu plan y dispositivo",
    ],
    prompt:
      "Conversemos en inglés sobre mi día de trabajo y corrígeme cuando me equivoque.",
    audio:
      "La voz permite hablar con ChatGPT. Confirma siempre la transcripción antes de usar algo importante.",
    useCases: [
      "Practicar un idioma",
      "Dictar una idea",
      "Preparar una presentación hablando",
    ],
  },
];

export const quizScenarios = [
  {
    question:
      "Eres docente y preparas un manual de laboratorio de 20 páginas. Necesitas reescribir solo la sección «Normas de seguridad» con un tono para adolescentes, sin tocar el resto. ¿Qué herramienta te sirve mejor?",
    options: ["Búsqueda web", "Canvas", "Creación de imágenes", "Voz"],
    correct: 1,
    explanation:
      "Canvas permite editar una sección específica de un documento largo en un panel lateral sin regenerar todo el texto. Revisa cada cambio antes de aceptarlo.",
  },
  {
    question:
      "Tienes una hoja de cálculo con las calificaciones de un curso, desordenadas. Quieres una tabla por materia y un gráfico. ¿Qué herramienta usas?",
    options: [
      "Creación de imágenes",
      "Canvas",
      "Búsqueda web",
      "Análisis de archivos y datos",
    ],
    correct: 3,
    explanation:
      "El análisis de archivos lee tu hoja, la ordena y la grafica. Comprueba el resultado recalculando una fila a mano.",
  },
  {
    question:
      "Un estudiante menciona un cambio de precio que ocurrió hace una hora y quieres un análisis de las causas inmediatas. ¿Qué activas?",
    options: [
      "Canvas",
      "Voz",
      "Búsqueda web, y abres las fuentes",
      "Creación de imágenes",
    ],
    correct: 2,
    explanation:
      "Para hechos recientes necesitas la búsqueda web. Una respuesta sin fuentes es solo una hipótesis: abre al menos una antes de usarla.",
  },
  {
    question:
      "Quieres un póster para la feria de ciencias con un párrafo largo de bases y los logos exactos de los patrocinadores, todo dentro de la imagen. ¿Qué pasará?",
    options: [
      "El póster saldrá perfecto y listo para imprimir.",
      "El análisis de archivos bloqueará la solicitud por privacidad.",
      "La imagen tendrá errores en el texto largo y logos inexactos.",
      "Canvas abrirá un editor gráfico manual.",
    ],
    correct: 2,
    explanation:
      "La creación de imágenes ilustra bien, pero falla con textos largos y con logos exactos. Pon el texto aparte y revisa la imagen antes de publicar.",
  },
  {
    question:
      "Quieres practicar inglés conversando y dictar ideas para un trabajo mientras caminas. ¿Qué herramienta te conviene?",
    options: [
      "Voz",
      "Canvas",
      "Análisis de archivos y datos",
      "Creación de imágenes",
    ],
    correct: 0,
    explanation:
      "La voz sirve para conversar y dictar. Confirma la transcripción antes de usar algo importante, sobre todo nombres y cifras.",
  },
  {
    question:
      "Tienes una encuesta en una hoja de cálculo y necesitas un gráfico y datos de contexto sobre cómo se hacen estas encuestas. ¿Qué combinación es mejor?",
    options: [
      "Solo Canvas para editar la hoja.",
      "Análisis de archivos para la tabla y el gráfico, y búsqueda web para el contexto, revisando una fila a mano y las fuentes.",
      "Creación de imágenes para dibujar los resultados.",
      "Solo voz para dictar los datos.",
    ],
    correct: 1,
    explanation:
      "Combinar herramientas funciona si compruebas cada paso: recalcula una fila del análisis y abre las fuentes de la búsqueda.",
  },
  {
    question:
      "Tienes un PDF de 80 páginas y necesitas las ideas principales con su ubicación. ¿Cómo lo haces?",
    options: [
      "Pego el PDF y acepto el resumen porque suena seguro.",
      "Subo el archivo, pido el resumen con la página de cada idea y abro dos páginas para comprobarlas.",
      "Le pido que invente las páginas.",
      "Lo resumo solo con la búsqueda web.",
    ],
    correct: 1,
    explanation:
      "En archivos largos pide la página de cada dato y abre algunas para comprobar que dicen lo que el resumen afirma.",
  },
];

export const learningObjectives = [
  "Identificar las herramientas de ChatGPT: búsqueda, archivos, imágenes, Canvas y voz",
  "Elegir la herramienta adecuada según la tarea",
  "Reconocer las limitaciones de cada herramienta",
  "Comprobar lo que cada herramienta te entrega antes de usarlo",
];

export const furtherReading = [
  {
    title: "Centro de ayuda de OpenAI",
    url: "https://help.openai.com/",
    description:
      "Documentación oficial: funciones y disponibilidad según tu cuenta.",
  },
  {
    title: "ChatGPT para educación",
    url: "https://openai.com/education/",
    description: "Información oficial sobre el uso educativo de ChatGPT.",
  },
];
