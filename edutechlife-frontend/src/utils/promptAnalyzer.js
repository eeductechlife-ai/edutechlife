/**
 * Analizador de calidad de prompts
 * Evalúa prompts basándose en criterios objetivos de prompt engineering
 */

// Criterios de evaluación
const EVALUATION_CRITERIA = {
  CLARITY: {
    weight: 0.3,
    indicators: [
      { pattern: /\?$/, score: 20 }, // Termina con pregunta
      { pattern: /^(como|qué|por qué|cómo|cuál)/i, score: 15 }, // Comienza con palabra interrogativa
      { pattern: /(explica|describe|analiza|crea|compara)/i, score: 25 }, // Verbos de acción claros
      { pattern: /\.\s*$/, score: 10 }, // Termina con punto
      { pattern: /\n/, score: -10 }, // Demasiadas líneas sin estructura
    ]
  },
  SPECIFICITY: {
    weight: 0.25,
    indicators: [
      { pattern: /\d+/, score: 20 }, // Incluye números
      { pattern: /(palabras|caracteres|párrafos|puntos)/i, score: 25 }, // Especifica formato
      { pattern: /(ejemplo|ejemplos)/i, score: 15 }, // Pide ejemplos
      { pattern: /(máximo|mínimo|al menos)/i, score: 20 }, // Establece límites
      { pattern: /\b(y|o|pero)\b/gi, score: -5, max: -15 }, // Demasiadas conjunciones (vaguedad)
    ]
  },
  CONTEXT: {
    weight: 0.25,
    indicators: [
      { pattern: /(como|actúa como|eres un|desde la perspectiva)/i, score: 30 }, // Especifica rol
      { pattern: /(para|con el objetivo de|con el fin de)/i, score: 20 }, // Define propósito
      { pattern: /(contexto|antecedentes|información de fondo)/i, score: 25 }, // Menciona contexto
      { pattern: /(audiencia|lector|usuario)/i, score: 15 }, // Define audiencia
      { pattern: /^\w{1,10}$/, score: -30 }, // Demasiado corto para contexto
    ]
  },
  STRUCTURE: {
    weight: 0.2,
    indicators: [
      { pattern: /(\d+\.|\-|\*)\s/, score: 25 }, // Usa listas numeradas o viñetas
      { pattern: /(paso|etapa|fase)/i, score: 20 }, // Estructura paso a paso
      { pattern: /(primero|luego|después|finalmente)/i, score: 15 }, // Secuencia temporal
      { pattern: /(introducción|desarrollo|conclusión)/i, score: 30 }, // Estructura formal
      { pattern: /.{100,}/, score: -10 }, // Párrafo demasiado largo sin estructura
    ]
  }
};

// Problemas comunes identificados
const COMMON_PROBLEMS = [
  {
    pattern: /^.{0,15}$/,
    problem: 'Demasiado corto',
    suggestion: 'Añade más detalles y contexto'
  },
  {
    pattern: /^[^?]*$/,
    problem: 'Falta pregunta clara',
    suggestion: 'Formula una pregunta específica'
  },
  {
    pattern: /\b(haz|hazme|dame)\b/i,
    problem: 'Verbo genérico',
    suggestion: 'Usa verbos específicos como "analiza", "crea", "compara"'
  },
  {
    pattern: /\b(algo|cosas|stuff)\b/i,
    problem: 'Términos vagos',
    suggestion: 'Sé específico sobre lo que necesitas'
  },
  {
    pattern: /^[A-Z][^.!?]{0,50}$/,
    problem: 'Falta puntuación',
    suggestion: 'Usa puntuación adecuada para claridad'
  },
  {
    pattern: /\b(y|o)\b.{0,5}\b(y|o)\b.{0,5}\b(y|o)\b/i,
    problem: 'Demasiadas opciones',
    suggestion: 'Enfócate en una tarea principal'
  }
];

/**
 * Analiza la calidad de un prompt
 * @param {string} prompt - El prompt a analizar
 * @returns {Object} Análisis detallado con scores y sugerencias
 */
export const analyzePromptQuality = (prompt) => {
  if (!prompt || prompt.trim().length === 0) {
    return {
      score: 0,
      analysis: {
        clarity: 0,
        specificity: 0,
        context: 0,
        structure: 0
      },
      commonProblems: ['Prompt vacío'],
      suggestions: ['Escribe un prompt para analizar']
    };
  }

  // Calcular scores para cada criterio
  const analysis = {};
  let totalWeightedScore = 0;

  for (const [criterion, config] of Object.entries(EVALUATION_CRITERIA)) {
    let score = 50; // Puntuación base
    
    // Aplicar indicadores
    for (const indicator of config.indicators) {
      const matches = prompt.match(indicator.pattern);
      if (matches) {
        let indicatorScore = indicator.score;
        
        // Aplicar límite máximo si existe
        if (indicator.max && indicatorScore < 0) {
          const maxNegative = indicator.max;
          const matchCount = matches.length;
          indicatorScore = Math.max(indicatorScore * matchCount, maxNegative);
        } else if (matches.length > 1) {
          indicatorScore *= matches.length;
        }
        
        score += indicatorScore;
      }
    }
    
    // Limitar score entre 0-100
    score = Math.max(0, Math.min(100, score));
    analysis[criterion.toLowerCase()] = score;
    totalWeightedScore += score * config.weight;
  }

  // Identificar problemas comunes
  const commonProblems = [];
  for (const problem of COMMON_PROBLEMS) {
    if (prompt.match(problem.pattern)) {
      commonProblems.push({
        problem: problem.problem,
        suggestion: problem.suggestion
      });
    }
  }

  // Calcular score total
  const totalScore = Math.round(totalWeightedScore);

  // Generar sugerencias basadas en el análisis
  const suggestions = generateSuggestions(analysis, commonProblems);

  return {
    score: totalScore,
    analysis,
    commonProblems,
    suggestions,
    wordCount: prompt.split(/\s+/).length,
    charCount: prompt.length
  };
};

/**
 * Genera sugerencias específicas basadas en el análisis
 */
const generateSuggestions = (analysis, commonProblems) => {
  const suggestions = [];

  // Sugerencias basadas en scores bajos
  if (analysis.clarity < 60) {
    suggestions.push('Añade más claridad usando verbos de acción específicos (ej: "analiza", "crea", "compara")');
  }
  
  if (analysis.specificity < 50) {
    suggestions.push('Sé más específico sobre el resultado esperado (ej: "500 palabras", "3 ejemplos", "formato de lista")');
  }
  
  if (analysis.context < 40) {
    suggestions.push('Proporciona más contexto (ej: "Como experto en...", "Para una audiencia de...")');
  }
  
  if (analysis.structure < 30) {
    suggestions.push('Usa una estructura clara (ej: "1. Primero... 2. Luego... 3. Finalmente...")');
  }

  // Sugerencias basadas en problemas comunes
  for (const problem of commonProblems.slice(0, 3)) {
    suggestions.push(problem.suggestion);
  }

  // Sugerencia general si el score es bajo
  if (Object.values(analysis).some(score => score < 30)) {
    suggestions.push('Considera usar el formato RTF: Rol + Tarea + Formato');
  }

  return suggestions.slice(0, 5); // Máximo 5 sugerencias
};

/**
 * Determina el nivel de calidad del prompt
 */
export const getQualityLevel = (score) => {
  if (score >= 80) return { level: 'Excelente', color: '#10B981', emoji: '🏆' };
  if (score >= 60) return { level: 'Bueno', color: '#3B82F6', emoji: '👍' };
  if (score >= 40) return { level: 'Aceptable', color: '#F59E0B', emoji: '⚠️' };
  return { level: 'Necesita mejora', color: '#EF4444', emoji: '🔧' };
};

/**
 * Identifica el tipo de prompt
 */
export const identifyPromptType = (prompt) => {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('analiza') || promptLower.includes('explica') || promptLower.includes('por qué')) {
    return { type: 'Analítico', technique: 'Chain-of-Thought', icon: '🔍' };
  }
  
  if (promptLower.includes('crea') || promptLower.includes('escribe') || promptLower.includes('genera')) {
    return { type: 'Creativo', technique: 'Role Play', icon: '🎨' };
  }
  
  if (promptLower.includes('ejemplo') || promptLower.includes('como hacer') || promptLower.includes('paso a paso')) {
    return { type: 'Instruccional', technique: 'Few-Shot', icon: '📋' };
  }
  
  if (promptLower.includes('compara') || promptLower.includes('diferencias') || promptLower.includes('ventajas')) {
    return { type: 'Comparativo', technique: 'Structured Comparison', icon: '⚖️' };
  }
  
  return { type: 'General', technique: 'Clear Instructions', icon: '💬' };
};

/**
 * Extrae palabras clave del prompt
 */
export const extractKeywords = (prompt) => {
  const stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'y', 'o', 'pero', 'con'];
  const words = prompt.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  // Contar frecuencia
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Ordenar por frecuencia
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};

export default {
  analyzePromptQuality,
  getQualityLevel,
  identifyPromptType,
  extractKeywords
};