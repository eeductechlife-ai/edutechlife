// Datos de IALab movidos desde ialab.js para mantener cada archivo bajo 500 líneas.
export const ALL_LESSONS = {
  1: [
    {
      id: 1,
      title: "IA Generativa: Tu Primer Paso",
      description:
        "Descubre qué es la IA generativa, qué hace bien y por qué a veces se equivoca, para usarla con criterio desde hoy.",
      duration: "20 min",
      type: "teoría",
      hasMedia: true,
      icon: "fa-brain",
      objectives: [
        "Comprender qué es la IA generativa y cómo funciona",
        "Identificar aplicaciones prácticas en el ámbito educativo",
        "Reconocer las limitaciones y consideraciones éticas",
      ],
    },
    {
      id: 2,
      title: "El Poder de un Buen Prompt",
      description:
        "Aprende a pedirle a la IA lo que necesitas: el prompt correcto marca la diferencia entre un resultado genérico y uno a tu medida.",
      duration: "20 min",
      type: "práctica",
      hasMedia: true,
      icon: "fa-comments",
      objectives: [
        "Definir qué es un prompt y su rol en la comunicación con IA",
        "Diferenciar entre prompts efectivos y genéricos",
        "Aplicar ejemplos prácticos de prompts en contexto educativo",
      ],
    },
    {
      id: 3,
      title: "Construye Prompts Impecables",
      description:
        "Aprende la fórmula RTF: Rol + Tarea + Formato (con el contexto necesario) = un resultado más útil.",
      duration: "20 min",
      type: "teoría",
      hasMedia: true,
      icon: "fa-sitemap",
      objectives: [
        "Escribir un prompt con la fórmula RTF: Rol + Tarea + Formato",
        "Mejorar un prompt pidiendo ajustes hasta obtener una respuesta útil",
        "Evaluar y refinar la calidad de las respuestas de IA",
      ],
    },
  ],
  2: [
    {
      id: 1,
      title: "Conoce ChatGPT a Fondo",
      description:
        "Qué es ChatGPT, qué puede y qué no puede hacer, y cómo pedirle resultados útiles con menos intentos.",
      duration: "25 min",
      type: "teoría",
      hasMedia: true,
      icon: "fa-chart-line",
      objectives: [
        "Explicar qué puede y qué no puede hacer ChatGPT",
        "Escribir pedidos claros con rol, tarea y formato",
        "Elegir el modo adecuado según la tarea",
      ],
    },
    {
      id: 2,
      title: "Sus Herramientas Integradas",
      description:
        "Busca en la web, analiza archivos, crea imágenes y conversa por voz, verificando cada resultado.",
      duration: "30 min",
      type: "laboratorio",
      hasMedia: true,
      icon: "fa-robot",
      objectives: [
        "Elegir la herramienta integrada adecuada para cada tarea",
        "Verificar fuentes, cálculos e imágenes antes de usarlos",
        "Decidir qué datos no compartir con la IA",
      ],
    },
    {
      id: 3,
      title: "Proyectos, GPTs y Agentes",
      description:
        "Organiza tu trabajo para no repetir el contexto y delega tareas de varios pasos bajo tu supervisión.",
      duration: "25 min",
      type: "práctica",
      hasMedia: false,
      icon: "fa-code",
      objectives: [
        "Distinguir entre un Proyecto, un GPT y un agente",
        "Armar un Proyecto con instrucciones y archivos",
        "Aprobar cada paso cuando un agente trabaja por ti",
      ],
    },
  ],
  3: [
    {
      id: 1,
      title: "Ve, Lee y Analiza con Gemini",
      description:
        "Analiza texto, imágenes y datos en un solo lugar y comprueba lo que la IA entendió.",
      duration: "20 min",
      type: "teoría",
      hasMedia: true,
      icon: "fa-brain",
      objectives: [
        "Combinar texto, imágenes y datos en un solo análisis",
        "Pedir a la IA que lea una imagen o un documento y comprobar lo que entendió",
        "Aplicar razonamiento multimodal a casos de investigación",
      ],
    },
    {
      id: 2,
      title: "Respuestas Siempre Actualizadas",
      description:
        "Pide respuestas con fuentes actuales de la web y ábrelas para comprobar que dicen lo mismo.",
      duration: "25 min",
      type: "práctica",
      hasMedia: true,
      icon: "fa-search",
      objectives: [
        "Conectar la IA con fuentes de datos en vivo",
        "Verificar respuestas con información actualizada",
        "Distinguir una respuesta con fuentes de una que solo suena bien",
      ],
    },
    {
      id: 3,
      title: "El Arte de Investigar con IA",
      description:
        "Encarga una investigación a la IA, revisa su plan y comprueba cada fuente de su informe.",
      duration: "30 min",
      type: "laboratorio",
      hasMedia: false,
      icon: "fa-microscope",
      objectives: [
        "Encargar una investigación profunda y revisar su plan",
        "Verificar hechos y fuentes uno por uno",
        "Estructurar informes de investigación con IA",
      ],
    },
  ],
  4: [
    {
      id: 1,
      title: "Selecciona Fuentes como Experto",
      description:
        "Construye tu biblioteca de fuentes confiables con la ayuda de la IA para investigaciones sólidas.",
      duration: "20 min",
      type: "teoría",
      hasMedia: true,
      icon: "fa-bookmark",
      objectives: [
        "Seleccionar fuentes relevantes para investigación académica",
        "Organizar y categorizar documentos con IA",
        "Evaluar la calidad y credibilidad de las fuentes",
      ],
    },
    {
      id: 2,
      title: "Convierte Datos en Sabiduría",
      description:
        "Convierte documentos densos en resúmenes claros y listos para usar en tus proyectos.",
      duration: "25 min",
      type: "práctica",
      hasMedia: true,
      icon: "fa-compress",
      objectives: [
        "Resumir documentos largos en ideas clave que puedes comprobar",
        "Extraer ideas clave de múltiples fuentes",
        "Convertir un resumen en una guía de estudio o una lista de tareas",
      ],
    },
    {
      id: 3,
      title: "Tus Apuntes se Vuelven Podcast",
      description:
        "Escucha tus documentos y organiza tu biblioteca de conocimiento digital con IA.",
      duration: "25 min",
      type: "laboratorio",
      hasMedia: true,
      icon: "fa-microphone",
      objectives: [
        "Convertir documentos escritos en contenido de audio",
        "Gestionar una biblioteca de conocimiento digital",
        "Nombrar y ordenar tus cuadernos para encontrar cada documento",
      ],
    },
  ],
  5: [
    {
      id: 1,
      title: "Conoce a Claude: la IA que trabaja contigo",
      description: "Cómo pensar y pedir como un director de orquesta",
      duration: "20 min",
      type: "lectura",
      hasMedia: true,
      icon: "fa-comments",
      objectives: [
        "Escribir un pedido con objetivo, audiencia, formato y tono",
        "Controlar qué recuerda Claude entre conversaciones",
        "Elegir el modelo adecuado para cada tarea",
      ],
    },
    {
      id: 2,
      title: "Crea con Claude: Artifacts, documentos y presentaciones",
      description: "De una idea a un documento listo para compartir",
      duration: "25 min",
      type: "laboratorio",
      hasMedia: true,
      icon: "fa-pen-nib",
      objectives: [
        "Describir el resultado final antes de pedir el contenido",
        "Iterar con cambios pequeños y comparar versiones",
        "Verificar cifras, nombres y fechas antes de presentar",
      ],
    },
    {
      id: 3,
      title: "Delega con Claude: Proyectos, conectores y Skills",
      description: "Trabajo recurrente sin perder el control",
      duration: "30 min",
      type: "video",
      hasMedia: true,
      icon: "fa-diagram-project",
      objectives: [
        "Crear un Proyecto con instrucciones y archivos de referencia",
        "Conectar herramientas revisando los permisos",
        "Convertir un procedimiento repetido en una Skill",
      ],
    },
  ],
};
