/**
 * Evaluador de prompts - Genera feedback educativo y métricas
 */

import { getQualityLevel } from './promptAnalyzer.js';
import { explainTechniqueSelection } from './promptOptimizer.js';

// Consejos educativos por categoría
const EDUCATIONAL_TIPS = {
  clarity: [
    'Usa verbos de acción específicos: "analiza", "crea", "compara", "evalúa"',
    'Formula preguntas directas en lugar de declaraciones vagas',
    'Especifica exactamente qué información necesitas',
    'Evita lenguaje ambiguo como "algo sobre" o "cosas relacionadas con"'
  ],
  specificity: [
    'Incluye números y cantidades: "3 ejemplos", "500 palabras", "5 pasos"',
    'Define el formato de salida: "lista", "tabla", "párrafos", "diagrama"',
    'Establece límites claros: "máximo 300 palabras", "al menos 2 fuentes"',
    'Menciona criterios de éxito: "debe incluir estadísticas", "necesito casos reales"'
  ],
  context: [
    'Especifica un rol: "Como experto en...", "Actúa como..."',
    'Define la audiencia: "Para estudiantes universitarios", "Para ejecutivos"',
    'Proporciona antecedentes: "En el contexto de...", "Considerando que..."',
    'Menciona restricciones: "Sin usar tecnicismos", "Para principiantes"'
  ],
  structure: [
    'Usa numeración o viñetas para pasos secuenciales',
    'Divide en secciones claras: "Introducción", "Desarrollo", "Conclusión"',
    'Emplea conectores: "Primero", "Luego", "Además", "Finalmente"',
    'Organiza la información de más a menos importante'
  ]
};

// Ejemplos de prompts bien optimizados
const EXAMPLE_PROMPTS = {
  analytical: {
    original: 'Haz un análisis',
    optimized: 'Como analista de datos con 5 años de experiencia, analiza las tendencias de ventas del último trimestre. Proporciona:\n1. Crecimiento por producto\n2. Comparación con el trimestre anterior\n3. 3 recomendaciones accionables\nFormato: Reporte ejecutivo de 300 palabras',
    improvements: ['Especificó rol profesional', 'Definió métricas concretas', 'Estableció formato y longitud']
  },
  creative: {
    original: 'Escribe algo creativo',
    optimized: 'Actúa como un escritor de ciencia ficción premiado. Escribe un relato corto (500 palabras) sobre una IA que descubre emociones. Incluye:\n• Un conflicto moral\n• Un giro inesperado\n• Diálogo natural\nTono: Suspenso filosófico',
    improvements: ['Definió género y estilo', 'Especificó elementos narrativos', 'Estableció tono y longitud']
  },
  instructional: {
    original: 'Explica cómo hacerlo',
    optimized: 'Como instructor de programación para principiantes, explica paso a paso cómo crear una función en Python que calcule el promedio de una lista. Incluye:\n1. Sintaxis básica\n2. Ejemplo con código\n3. Error común a evitar\n4. Ejercicio práctico\nNivel: Principiante absoluto',
    improvements: ['Especificó audiencia y nivel', 'Estructuró en pasos claros', 'Incluyó ejemplos y ejercicios']
  }
};

/**
 * Genera feedback educativo completo
 */
export const generateEducationalFeedback = (originalPrompt, optimizedPrompt, technique, analysis) => {
  const qualityLevel = getQualityLevel(analysis.score);
  const techniqueExplanation = explainTechniqueSelection(originalPrompt, technique, analysis);
  
  // Consejos específicos basados en análisis
  const specificTips = [];
  if (analysis.clarity < 60) {
    specificTips.push(...EDUCATIONAL_TIPS.clarity.slice(0, 2));
  }
  if (analysis.specificity < 50) {
    specificTips.push(...EDUCATIONAL_TIPS.specificity.slice(0, 2));
  }
  if (analysis.context < 40) {
    specificTips.push(...EDUCATIONAL_TIPS.context.slice(0, 2));
  }
  if (analysis.structure < 30) {
    specificTips.push(...EDUCATIONAL_TIPS.structure.slice(0, 2));
  }
  
  // Si no hay tips específicos, dar tips generales
  if (specificTips.length === 0) {
    specificTips.push(
      '¡Buen trabajo! Tu prompt ya tiene buena calidad base.',
      'Considera experimentar con diferentes técnicas para ver qué funciona mejor',
      'Prueba el prompt optimizado y compara resultados con el original'
    );
  }
  
  // Encontrar ejemplo similar
  let similarExample = null;
  if (analysis.clarity < 50) similarExample = EXAMPLE_PROMPTS.analytical;
  else if (analysis.specificity < 40) similarExample = EXAMPLE_PROMPTS.instructional;
  else if (analysis.context < 30) similarExample = EXAMPLE_PROMPTS.creative;
  
  return {
    qualityAssessment: {
      level: qualityLevel.level,
      score: analysis.score,
      color: qualityLevel.color,
      emoji: qualityLevel.emoji,
      breakdown: {
        clarity: analysis.clarity,
        specificity: analysis.specificity,
        context: analysis.context,
        structure: analysis.structure
      }
    },
    
    techniqueApplied: {
      name: technique.name,
      description: technique.description,
      explanation: techniqueExplanation,
      icon: technique.icon,
      color: technique.color
    },
    
    improvementsMade: generateImprovementsList(originalPrompt, optimizedPrompt, analysis),
    
    educationalTips: [...new Set(specificTips)].slice(0, 5), // Eliminar duplicados
    
    similarExample: similarExample,
    
    nextSteps: [
      'Prueba este prompt optimizado en ChatGPT o Claude',
      'Compara los resultados con tu prompt original',
      'Itera basándote en lo que aprendiste',
      'Experimenta con otras técnicas para el mismo prompt',
      'Guarda este prompt en tu biblioteca personal'
    ],
    
    learningResources: [
      'Template MasterPrompt: /public/ialab-resources/templates/module1/masterprompt-template.md',
      'Módulo 1 - Lección 3: Técnicas de Prompt Engineering',
      'Infográfico: Chain-of-Thought vs Few-Shot Learning',
      'Ejercicio práctico: Optimiza 5 prompts diferentes'
    ]
  };
};

/**
 * Genera lista de mejoras específicas aplicadas
 */
function generateImprovementsList(original, optimized, analysis) {
  const improvements = [];
  
  // Comparar longitud
  const originalWords = original.split(/\s+/).length;
  const optimizedWords = optimized.split(/\s+/).length;
  
  if (optimizedWords > originalWords * 1.5) {
    improvements.push('Añadido contexto y especificidad adicional');
  }
  
  // Verificar estructura
  if (!original.includes('\n') && optimized.includes('\n')) {
    improvements.push('Mejorada estructura con formato claro');
  }
  
  // Verificar rol
  if (!original.match(/(como|actúa como|eres)/i) && optimized.match(/(como|actúa como|eres)/i)) {
    improvements.push('Añadida especificación de rol profesional');
  }
  
  // Verificar parámetros
  if (!original.match(/(palabras|caracteres|ejemplos|pasos)/i) && optimized.match(/(palabras|caracteres|ejemplos|pasos)/i)) {
    improvements.push('Definidos parámetros y límites claros');
  }
  
  // Basado en análisis
  if (analysis.clarity < 60 && optimized.includes('?')) {
    improvements.push('Convertido a pregunta clara y directa');
  }
  
  if (analysis.specificity < 50 && optimized.match(/\d+/g)?.length > (original.match(/\d+/g)?.length || 0)) {
    improvements.push('Añadidas cantidades y medidas específicas');
  }
  
  if (analysis.context < 40 && optimized.match(/(contexto|para|considerando)/i)) {
    improvements.push('Proporcionado contexto adicional');
  }
  
  if (analysis.structure < 30 && optimized.match(/(\d+\.|\- |\* )/g)?.length > 0) {
    improvements.push('Estructurado en pasos o secciones claras');
  }
  
  // Si no se identificaron mejoras específicas
  if (improvements.length === 0) {
    improvements.push(
      'Optimizado para mejor comprensión por modelos de IA',
      'Ajustado tono y formato para mayor efectividad',
      'Estructurado para generar respuestas más completas'
    );
  }
  
  return improvements.slice(0, 5);
}

/**
 * Genera métricas visuales para comparación
 */
export const generateComparisonMetrics = (original, optimized) => {
  const analyze = (text) => {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length - 1;
    const paragraphs = text.split(/\n\s*\n/).length;
    const questions = (text.match(/\?/g) || []).length;
    const numbers = (text.match(/\b\d+\b/g) || []).length;
    const structureMarkers = (text.match(/(\d+\.|\- |\* |•)/g) || []).length;
    
    return {
      words,
      sentences,
      paragraphs,
      questions,
      numbers,
      structureMarkers,
      clarityScore: calculateClarityScore(text),
      specificityScore: calculateSpecificityScore(text)
    };
  };
  
  const originalMetrics = analyze(original);
  const optimizedMetrics = analyze(optimized);
  
  return {
    original: originalMetrics,
    optimized: optimizedMetrics,
    improvements: {
      clarity: optimizedMetrics.clarityScore - originalMetrics.clarityScore,
      specificity: optimizedMetrics.specificityScore - originalMetrics.specificityScore,
      structure: optimizedMetrics.structureMarkers - originalMetrics.structureMarkers,
      detail: optimizedMetrics.words - originalMetrics.words
    }
  };
};

/**
 * Calcula score de claridad
 */
function calculateClarityScore(text) {
  let score = 50;
  
  if (text.includes('?')) score += 20;
  if (text.match(/^(como|qué|por qué|cómo|cuál)/i)) score += 15;
  if (text.match(/(explica|describe|analiza|crea|compara)/i)) score += 25;
  if (text.length > 100 && text.length < 500) score += 10;
  if (text.split(/\s+/).length < 10) score -= 30;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calcula score de especificidad
 */
function calculateSpecificityScore(text) {
  let score = 50;
  
  const numbers = (text.match(/\b\d+\b/g) || []).length;
  score += numbers * 5;
  
  if (text.match(/(palabras|caracteres|párrafos|ejemplos)/i)) score += 20;
  if (text.match(/(máximo|mínimo|al menos)/i)) score += 15;
  if (text.match(/(formato|estructura|organiza)/i)) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Genera resumen ejecutivo del feedback
 */
export const generateExecutiveSummary = (feedback) => {
  const { qualityAssessment, techniqueApplied, improvementsMade } = feedback;
  
  return `## 📊 RESUMEN DE OPTIMIZACIÓN
  
**CALIDAD:** ${qualityAssessment.emoji} ${qualityAssessment.level} (${qualityAssessment.score}/100)

**TÉCNICA APLICADA:** ${techniqueApplied.icon} ${techniqueApplied.name}
${techniqueApplied.explanation}

**MEJORAS PRINCIPALES:**
${improvementsMade.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}

**IMPACTO ESPERADO:** Este prompt optimizado debería generar respuestas más precisas, estructuradas y relevantes que el original.

**PRÓXIMO PASO:** Prueba ambas versiones y compara los resultados.`;
};

export default {
  generateEducationalFeedback,
  generateComparisonMetrics,
  generateExecutiveSummary,
  EDUCATIONAL_TIPS,
  EXAMPLE_PROMPTS
};