/**
 * Constantes para técnicas de prompt engineering
 * Usadas por el sintetizador de prompts educativo
 */

export const PROMPT_TECHNIQUES = {
  CHAIN_OF_THOUGHT: {
    name: 'Chain-of-Thought',
    description: 'Descompone problemas complejos en pasos secuenciales para razonamiento estructurado',
    icon: '🔍',
    color: '#3B82F6',
    bestFor: ['Análisis complejo', 'Problemas matemáticos', 'Razonamiento lógico', 'Toma de decisiones'],
    example: 'En lugar de "Resuelve este problema", usa "Piensa paso a paso: 1. Identifica las variables, 2. Aplica la fórmula, 3. Verifica el resultado"'
  },
  FEW_SHOT: {
    name: 'Few-Shot Learning',
    description: 'Proporciona ejemplos concretos para guiar el formato y contenido de la respuesta',
    icon: '📚',
    color: '#10B981',
    bestFor: ['Tareas repetitivas', 'Formatos específicos', 'Consistencia de estilo', 'Aprendizaje por ejemplos'],
    example: 'Proporciona 2-3 ejemplos del formato deseado antes de pedir la tarea principal'
  },
  ROLE_PLAY: {
    name: 'Role Play',
    description: 'Asigna un rol específico al modelo para contextualizar la respuesta',
    icon: '🎭',
    color: '#8B5CF6',
    bestFor: ['Contenido creativo', 'Perspectiva experta', 'Tono específico', 'Audiencias definidas'],
    example: 'En lugar de "Escribe un artículo", usa "Actúa como un periodista científico y escribe un artículo sobre..."'
  },
  STRUCTURED_OUTPUT: {
    name: 'Structured Output',
    description: 'Define explícitamente el formato y estructura de la respuesta esperada',
    icon: '📋',
    color: '#F59E0B',
    bestFor: ['Reportes formales', 'Listas organizadas', 'Comparaciones', 'Resúmenes ejecutivos'],
    example: 'Especifica: "Formato: 1. Introducción, 2. Puntos clave, 3. Conclusión. Longitud: 300 palabras"'
  },
  META_PROMPTING: {
    name: 'Meta-Prompting',
    description: 'Pide al modelo que analice y optimice prompts (prompts sobre prompts)',
    icon: '🎯',
    color: '#EF4444',
    bestFor: ['Mejora de prompts', 'Análisis de calidad', 'Enseñanza de prompt engineering', 'Iteración'],
    example: 'Pide: "Analiza este prompt y sugiere 3 formas de mejorarlo"'
  }
};

export const PROMPT_QUALITY_LEVELS = {
  EXCELLENT: {
    minScore: 80,
    label: 'Excelente',
    color: '#10B981',
    emoji: '🏆',
    description: 'Prompt claro, específico, con buen contexto y estructura'
  },
  GOOD: {
    minScore: 60,
    label: 'Bueno',
    color: '#3B82F6',
    emoji: '👍',
    description: 'Prompt funcional con algunas áreas de mejora'
  },
  ACCEPTABLE: {
    minScore: 40,
    label: 'Aceptable',
    color: '#F59E0B',
    emoji: '⚠️',
    description: 'Prompt básico que necesita optimización'
  },
  NEEDS_IMPROVEMENT: {
    minScore: 0,
    label: 'Necesita mejora',
    color: '#EF4444',
    emoji: '🔧',
    description: 'Prompt vago o incompleto que requiere trabajo significativo'
  }
};

export const COMMON_PROMPT_PROBLEMS = [
  {
    problem: 'Demasiado corto',
    pattern: /^.{0,15}$/,
    suggestion: 'Añade más detalles y contexto. Los prompts efectivos suelen tener 20+ palabras.',
    fix: 'Expande el prompt describiendo qué necesitas específicamente y por qué.'
  },
  {
    problem: 'Falta pregunta clara',
    pattern: /^[^?]*$/,
    suggestion: 'Formula una pregunta específica. Las preguntas guían mejor a la IA.',
    fix: 'Convierte declaraciones en preguntas: "Explica cómo..." → "¿Cómo funciona...?"'
  },
  {
    problem: 'Verbos genéricos',
    pattern: /\b(haz|hazme|dame|pon)\b/i,
    suggestion: 'Usa verbos específicos como "analiza", "crea", "compara", "evalúa".',
    fix: 'Reemplaza "haz un resumen" por "Analiza el texto y extrae los 3 puntos clave"'
  },
  {
    problem: 'Términos vagos',
    pattern: /\b(algo|cosas|stuff|varias)\b/i,
    suggestion: 'Sé específico sobre lo que necesitas.',
    fix: 'En lugar de "cosas importantes", di "los 5 factores críticos de éxito"'
  },
  {
    problem: 'Falta contexto',
    pattern: /^[A-Z][^.!?]{0,50}$/,
    suggestion: 'Proporciona contexto sobre el propósito y audiencia.',
    fix: 'Añade: "Para estudiantes de secundaria, explica..." o "Como experto en..."'
  },
  {
    problem: 'Sin estructura',
    pattern: /.{100,}/,
    suggestion: 'Organiza el prompt en secciones claras.',
    fix: 'Usa numeración, viñetas o párrafos separados para diferentes partes.'
  }
];

export const PROMPT_TEMPLATES = {
  ANALYTICAL: `Como [ROL/EXPERTISE], analiza [TEMA/PROBLEMA] considerando:

1. CONTEXTO: [Información de fondo relevante]
2. VARIABLES CLAVE: [Factores importantes a considerar]
3. METODOLOGÍA: [Enfoque de análisis]
4. RESULTADOS ESPERADOS: [Qué debe incluir la respuesta]

Formato: [Especificar formato: lista, párrafos, tabla, etc.]
Longitud: [Número de palabras/párrafos]
Tono: [Profesional, educativo, técnico, etc.]`,

  CREATIVE: `Actúa como [ROL CREATIVO] y [ACCIÓN CREATIVA] sobre [TEMA].

Elementos a incluir:
• [Elemento creativo 1]
• [Elemento creativo 2]
• [Elemento creativo 3]

Estilo: [Describir estilo: humorístico, dramático, poético, etc.]
Longitud: [Número de palabras/líneas]
Restricciones: [Límites creativos o requisitos]`,

  INSTRUCTIONAL: `Como [INSTRUCTOR/EXPERTO], explica [PROCESO/CONCEPTO] paso a paso para [AUDIENCIA].

Pasos requeridos:
1. [Paso 1 con detalles]
2. [Paso 2 con detalles]
3. [Paso 3 con detalles]

Ejemplos: [Incluir ejemplos prácticos]
Nivel de dificultad: [Principiante, Intermedio, Avanzado]
Recursos adicionales: [Sugerir recursos para profundizar]`,

  COMPARATIVE: `Compara [ELEMENTO A] vs [ELEMENTO B] desde la perspectiva de [CONTEXTO].

Criterios de comparación:
• [Criterio 1]
• [Criterio 2]
• [Criterio 3]

Formato de salida: [Tabla, lista de pros/contras, análisis narrativo]
Profundidad: [Superficial, moderada, profunda]
Sesgo: [Objetivo, equilibrado, con recomendación]`
};

export const EDUCATIONAL_TIPS = {
  BEGINNER: [
    'Empieza con preguntas simples y directas',
    'Especifica el formato de respuesta que esperas',
    'Proporciona contexto sobre tu nivel de conocimiento',
    'Usa ejemplos cuando pidas algo creativo o complejo'
  ],
  INTERMEDIATE: [
    'Experimenta con diferentes técnicas (Chain-of-Thought, Few-Shot, etc.)',
    'Ajusta el tono según la audiencia objetivo',
    'Define métricas de éxito para evaluar la respuesta',
    'Itera basándote en los resultados obtenidos'
  ],
  ADVANCED: [
    'Combina múltiples técnicas para prompts complejos',
    'Usa meta-prompting para optimizar tus propios prompts',
    'Crea templates reutilizables para tareas frecuentes',
    'Documenta lo que funciona y lo que no para aprendizaje continuo'
  ]
};

export default {
  PROMPT_TECHNIQUES,
  PROMPT_QUALITY_LEVELS,
  COMMON_PROMPT_PROBLEMS,
  PROMPT_TEMPLATES,
  EDUCATIONAL_TIPS
};