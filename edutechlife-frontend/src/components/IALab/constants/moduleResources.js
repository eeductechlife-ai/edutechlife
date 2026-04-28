/**
 * CONSTANTES: moduleResources.js
 * 
 * Datos de recursos educativos para cada tema del módulo
 * Estructura modular que permite escalar a más módulos y temas
 * 
 * Formato:
 * - Módulo 1: Ingeniería de Prompts
 * - 6 temas con recursos variados (video, PDF, imagen, interactivo)
 * - Metadatos completos para cada recurso
 */

export const moduleResources = {
  // MÓDULO 1: INGENIERÍA DE PROMPTS
  "Introducción a la Inteligencia Artificial Generativa": {
    title: "Fundamentos de IA Generativa",
    description: "Conceptos básicos, historia y aplicaciones prácticas de la inteligencia artificial generativa en el mundo moderno.",
    learningObjectives: [
      "Comprender qué es la IA Generativa y cómo funciona",
      "Diferenciar entre IA débil (narrow) y IA fuerte (general)",
      "Identificar aplicaciones prácticas en educación y negocios",
      "Reconocer los límites éticos y técnicos actuales"
    ],
    estimatedTime: "15 minutos",
    difficulty: "Principiante",
    resources: [
      {
        id: "intro-video-1",
        type: "video",
        title: "Explicación Visual: Anatomía de un Prompt",
        url: "https://www.youtube.com/embed/6f-FwOE5wIY",
        duration: "7:15",
        thumbnail: "https://img.youtube.com/vi/6f-FwOE5wIY/maxresdefault.jpg",
        provider: "youtube",
        description: "Desglose visual de las partes que componen un prompt efectivo."
      },
      {
        id: "intro-pdf-1",
        type: "document",
        title: "Guía de Conceptos Básicos (PDF)",
        url: "/documents/ia-fundamentals-guide.pdf",
        pages: 12,
        format: "PDF",
        size: "2.4 MB",
        description: "Documento descargable con definiciones, ejemplos y ejercicios de reflexión."
      },
      {
        id: "intro-infographic-1",
        type: "image",
        title: "Infografía: Evolución de la IA",
        url: "/infographics/ia-evolution-timeline.png",
        interactive: true,
        description: "Línea de tiempo visual desde los primeros algoritmos hasta ChatGPT-4."
      },
      {
        id: "intro-ova-1",
        type: "ova-thumbnail",
        title: "Laboratorio: Ética en la I.A.",
        description: "OVA completo con 5 secciones interactivas y simulador integrado.",
        estimatedTime: "15 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "¿Qué es un Prompt?": {
    title: "Dominando los Prompts",
    description: "Un prompt es la instrucción o mensaje que le damos a la IA para que realice una tarea específica. Es la clave para comunicarnos efectivamente con modelos como ChatGPT y obtener resultados precisos. Explora los recursos disponibles para aprender a dominarlos.",
    learningObjectives: [
      "Comprender qué es un prompt y cómo usarlo para comunicarte efectivamente con la IA"
    ],
    estimatedTime: "18 minutos",
    difficulty: "Principiante",
    resources: [
      {
        id: "prompt-video-1",
        type: "video",
        title: "Video Introductorio: ¿Qué es la IA Generativa?",
        url: "https://www.youtube.com/embed/jnePzCTKEqs?start=3",
        duration: "14:00",
        thumbnail: "https://img.youtube.com/vi/jnePzCTKEqs/maxresdefault.jpg",
        provider: "youtube",
        description: "Explicación visual de los conceptos fundamentales con ejemplos prácticos."
      },
      {
        id: "prompt-guide-1",
        type: "pdf-thumbnail",
        title: "Guía: Anatomía de un Prompt",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 12,
        format: "PDF",
        size: "249 KB",
        description: "Documento completo con estructura detallada de prompts efectivos, técnicas avanzadas y ejemplos prácticos.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "prompt-ova-html-1",
        type: "ova-thumbnail",
        title: "Infografía Interactiva: Prompt Engineering",
        url: "/ovas/prompt-engineering-ova.html",
        description: "Infografía interactiva sobre cómo comunicarte con la IA mediante prompts efectivos.",
        estimatedTime: "10 minutos",
        difficulty: "Principiante",
        fullscreen: true
      }
    ]
  },

  "Estructura Básica de un Prompt Efectivo": {
    title: "Arquitectura de Prompts",
    description: "Patrones y estructuras probadas para crear prompts que generen respuestas precisas y útiles.",
    learningObjectives: [
      "Aplicar la estructura ROL-TAREA-FORMATO-CONTEXTO",
      "Utilizar delimitadores y marcadores de sección",
      "Incorporar ejemplos de few-shot learning",
      "Ajustar el nivel de detalle según el objetivo"
    ],
    estimatedTime: "22 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "structure-video-1",
        type: "video",
        title: "Tutorial: Construyendo Prompts Paso a Paso",
        url: "https://www.youtube.com/embed/8XxSC2L6QoE",
        duration: "9:45",
        thumbnail: "https://img.youtube.com/vi/8XxSC2L6QoE/maxresdefault.jpg",
        provider: "youtube",
        description: "Demostración práctica de construcción de prompts complejos."
      },
      {
        id: "structure-template-1",
        type: "document",
        title: "Plantillas de Estructura Avanzada (JSON)",
        url: "/templates/advanced-prompt-templates.json",
        format: "JSON",
        size: "3.2 MB",
        description: "15 plantillas JSON listas para usar en diferentes escenarios."
      },
      {
        id: "structure-case-1",
        type: "document",
        title: "Case Study: Prompt para Análisis de Datos",
        url: "/case-studies/data-analysis-prompt-case.pdf",
        pages: 8,
        format: "PDF",
        size: "2.1 MB",
        description: "Análisis detallado de un prompt real para análisis de datasets."
      }
    ]
  },

  "Técnicas de Refinamiento": {
    title: "Optimización de Prompts",
    description: "Métodos sistemáticos para iterar y mejorar prompts basados en los resultados obtenidos.",
    learningObjectives: [
      "Aplicar técnicas de chain-of-thought prompting",
      "Utilizar auto-crítica y auto-corrección en prompts",
      "Implementar temperature y top-p sampling",
      "Medir y comparar la efectividad de diferentes versiones"
    ],
    estimatedTime: "25 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "refinement-video-1",
        type: "video",
        title: "Demo: Proceso de Refinamiento Iterativo",
        url: "https://www.youtube.com/embed/3sL3K7pLq8E",
        duration: "11:20",
        thumbnail: "https://img.youtube.com/vi/3sL3K7pLq8E/maxresdefault.jpg",
        provider: "youtube",
        description: "Proceso completo desde prompt inicial hasta versión optimizada."
      },
      {
        id: "refinement-tool-1",
        type: "interactive",
        title: "Herramienta de A/B Testing de Prompts",
        url: "/tools/prompt-ab-testing",
        estimatedTime: "10 minutos",
        description: "Compara diferentes versiones de un prompt y mide su efectividad."
      },
      {
        id: "refinement-guide-1",
        type: "document",
        title: "Guía de Métricas de Calidad (PDF)",
        url: "/documents/prompt-quality-metrics.pdf",
        pages: 10,
        format: "PDF",
        size: "2.7 MB",
        description: "Sistema de evaluación para medir la calidad de respuestas de IA."
      }
    ]
  },

  "Práctica Asistida 1: Modificando Variables": {
    title: "Manipulación de Variables",
    description: "Ejercicio práctico guiado para experimentar con diferentes variables en prompts.",
    learningObjectives: [
      "Identificar y aislar variables clave en un prompt",
      "Experimentar con cambios sistemáticos en tono, formato y complejidad",
      "Analizar el impacto de cada variable en los resultados",
      "Documentar hallazgos para crear un sistema personalizado"
    ],
    estimatedTime: "30 minutos",
    difficulty: "Avanzado",
    resources: [
      {
        id: "practice-video-1",
        type: "video",
        title: "Walkthrough: Experimento de Variables",
        url: "https://www.youtube.com/embed/5L4DQfVIcdg",
        duration: "14:30",
        thumbnail: "https://img.youtube.com/vi/5L4DQfVIcdg/maxresdefault.jpg",
        provider: "youtube",
        description: "Sesión completa de experimentación con variables de prompt."
      },
      {
        id: "practice-worksheet-1",
        type: "document",
        title: "Worksheet de Experimentación (PDF)",
        url: "/worksheets/variable-experimentation-worksheet.pdf",
        pages: 15,
        format: "PDF",
        size: "3.5 MB",
        description: "Plantilla estructurada para documentar experimentos con variables."
      },
      {
        id: "practice-dataset-1",
        type: "document",
        title: "Dataset de Ejemplos para Práctica (JSON)",
        url: "/datasets/practice-variables-dataset.json",
        format: "JSON",
        size: "4.8 MB",
        description: "100 ejemplos categorizados para practicar modificación de variables."
      }
    ]
  },

  "Actividad 1: Crea tu primer Prompt": {
    title: "Proyecto Final Integrador",
    description: "Actividad práctica completa donde aplicas todo lo aprendido para crear un prompt profesional.",
    learningObjectives: [
      "Integrar todas las técnicas aprendidas en un solo prompt",
      "Aplicar el proceso completo desde ideación hasta refinamiento",
      "Presentar el resultado con justificación de cada decisión",
      "Recibir feedback estructurado para mejora continua"
    ],
    estimatedTime: "35 minutos",
    difficulty: "Avanzado",
    resources: [
      {
        id: "activity-video-1",
        type: "video",
        title: "Ejemplo de Proyecto Completo",
        url: "https://www.youtube.com/embed/9bZkp7q19f0",
        duration: "16:45",
        thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
        provider: "youtube",
        description: "Proyecto ejemplo desde cero hasta prompt profesional finalizado."
      },
      {
        id: "activity-template-1",
        type: "document",
        title: "Template de Proyecto Final (PDF)",
        url: "/templates/final-project-template.pdf",
        pages: 20,
        format: "PDF",
        size: "4.2 MB",
        description: "Estructura completa para desarrollar y presentar tu proyecto final."
      },
      {
        id: "activity-rubric-1",
        type: "document",
        title: "Rúbrica de Evaluación (PDF)",
        url: "/rubrics/project-evaluation-rubric.pdf",
        pages: 8,
        format: "PDF",
        size: "2.3 MB",
        description: "Criterios detallados para autoevaluar y mejorar tu trabajo."
      }
    ]
  }
};

/**
 * Helper functions para trabajar con recursos
 */

// Obtener recursos para un tema específico
export const getResourcesForTopic = (topicTitle) => {
  return moduleResources[topicTitle] || null;
};

// Obtener todos los tipos de recursos disponibles en un tema
export const getResourceTypesForTopic = (topicTitle) => {
  const topic = moduleResources[topicTitle];
  if (!topic) return [];
  
  const types = new Set();
  topic.resources.forEach(resource => types.add(resource.type));
  return Array.from(types);
};

// Contar recursos por tipo
export const countResourcesByType = (topicTitle) => {
  const topic = moduleResources[topicTitle];
  if (!topic) return {};
  
  const counts = {};
  topic.resources.forEach(resource => {
    counts[resource.type] = (counts[resource.type] || 0) + 1;
  });
  return counts;
};

// Formatear duración para display
export const formatDuration = (duration) => {
  if (!duration) return "Duración no especificada";
  return `⏱️ ${duration}`;
};

// Formatear tamaño para display
export const formatFileSize = (size) => {
  if (!size) return "Tamaño no especificado";
  return `📦 ${size}`;
};

// Obtener icono por tipo de recurso
export const getResourceIcon = (type) => {
  const icons = {
    video: "fa-video",
    document: "fa-file-lines",
    image: "fa-image",
    interactive: "fa-puzzle-piece",
    "pdf-thumbnail": "fa-file-pdf",
    "ova-thumbnail": "fa-brain"
  };
  return icons[type] || "fa-file";
};

export const getResourceColor = (type) => {
  const colors = {
    video: "text-[#06B6D4]",
    document: "text-[#004B63]",
    image: "text-[#06B6D4]",
    interactive: "text-[#004B63]",
    "pdf-thumbnail": "text-[#004B63]",
    "ova-thumbnail": "text-[#004B63]"
  };
  return colors[type] || "text-slate-500";
};

export default moduleResources;