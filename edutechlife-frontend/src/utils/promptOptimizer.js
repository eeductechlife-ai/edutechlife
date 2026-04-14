/**
 * Optimizador de prompts - Aplica técnicas reales de prompt engineering
 */

import { identifyPromptType, extractKeywords } from './promptAnalyzer.js';

// Técnicas disponibles con sus configuraciones
const TECHNIQUES = {
  'CHAIN_OF_THOUGHT': {
    name: 'Chain-of-Thought',
    description: 'Para prompts analíticos que requieren razonamiento paso a paso',
    icon: '🔍',
    color: '#3B82F6',
    apply: applyChainOfThought
  },
  'FEW_SHOT': {
    name: 'Few-Shot Learning',
    description: 'Para tareas que se benefician de ejemplos concretos',
    icon: '📚',
    color: '#10B981',
    apply: applyFewShot
  },
  'ROLE_PLAY': {
    name: 'Role Play',
    description: 'Para contenido que requiere perspectiva profesional o creativa',
    icon: '🎭',
    color: '#8B5CF6',
    apply: applyRolePlay
  },
  'STRUCTURED_OUTPUT': {
    name: 'Structured Output',
    description: 'Para respuestas que necesitan formato específico',
    icon: '📋',
    color: '#F59E0B',
    apply: applyStructuredOutput
  },
  'META_PROMPTING': {
    name: 'Meta-Prompting',
    description: 'Para prompts sobre prompts o análisis de calidad',
    icon: '🎯',
    color: '#EF4444',
    apply: applyMetaPrompting
  }
};

// Ejemplos predefinidos para Few-Shot
const FEW_SHOT_EXAMPLES = {
  'analítico': [
    {
      input: 'Analiza las ventas del último trimestre',
      output: '1. Crecimiento trimestral: +15%\n2. Producto líder: Software Educativo\n3. Región más fuerte: Latinoamérica\n4. Recomendación: Expandir campañas digitales'
    },
    {
      input: 'Explica cómo funciona la fotosíntesis',
      output: 'La fotosíntesis es el proceso donde las plantas convierten luz solar en energía. Pasos:\n1. Absorción de luz\n2. Conversión de CO2\n3. Producción de glucosa\n4. Liberación de oxígeno'
    }
  ],
  'creativo': [
    {
      input: 'Escribe un poema sobre la primavera',
      output: 'La primavera llega con su manto verde,\nflores que al viento su fragancia ceden,\npájaros cantan en el amanecer,\nrenace la vida en cada mujer.'
    },
    {
      input: 'Crea una historia corta de ciencia ficción',
      output: 'En el año 2150, la IA "Eureka" descubrió cómo revertir el cambio climático. Pero su solución requería un sacrificio: desconectar todas las redes sociales por un año. La humanidad debía elegir entre conveniencia y supervivencia.'
    }
  ],
  'instruccional': [
    {
      input: 'Cómo hacer una presentación efectiva',
      output: '1. Comienza con un dato impactante\n2. Estructura en 3 partes: problema, solución, acción\n3. Usa imágenes, no texto denso\n4. Practica el timing\n5. Prepara Q&A'
    },
    {
      input: 'Pasos para aprender programación',
      output: '1. Elige un lenguaje (Python recomendado)\n2. Aprende sintaxis básica\n3. Practica con ejercicios pequeños\n4. Construye un proyecto personal\n5. Contribuye a código abierto'
    }
  ]
};

/**
 * Selecciona la técnica más apropiada para un prompt
 */
export const selectAppropriateTechnique = (prompt, analysis) => {
  const promptType = identifyPromptType(prompt);
  const { type } = promptType;
  
  // Basado en el tipo de prompt
  switch (type) {
    case 'Analítico':
      return TECHNIQUES.CHAIN_OF_THOUGHT;
    case 'Creativo':
      return TECHNIQUES.ROLE_PLAY;
    case 'Instruccional':
      return TECHNIQUES.FEW_SHOT;
    case 'Comparativo':
      return TECHNIQUES.STRUCTURED_OUTPUT;
    default:
      // Basado en análisis de calidad
      if (analysis.clarity < 50) return TECHNIQUES.STRUCTURED_OUTPUT;
      if (analysis.specificity < 40) return TECHNIQUES.FEW_SHOT;
      if (analysis.context < 30) return TECHNIQUES.ROLE_PLAY;
      return TECHNIQUES.CHAIN_OF_THOUGHT;
  }
};

/**
 * Aplica Chain-of-Thought para prompts analíticos
 */
function applyChainOfThought(prompt, analysis) {
  const keywords = extractKeywords(prompt);
  
  return `Piensa paso a paso como un experto:

PROBLEMA: "${prompt}"

ANÁLISIS SISTEMÁTICO:

1. **COMPRENSIÓN DEL PROBLEMA**
   • ¿Qué se está pidiendo exactamente?
   • ¿Cuál es el contexto implícito?
   • ¿Qué información clave se necesita?

2. **DESGLOSE DE COMPONENTES**
   • Elementos principales: ${keywords.slice(0, 3).join(', ')}
   • Relaciones entre componentes
   • Supuestos que deben validarse

3. **APLICACIÓN DE MÉTODOS**
   • Enfoque más apropiado para este tipo de problema
   • Herramientas o frameworks relevantes
   • Consideraciones especiales

4. **DESARROLLO DE SOLUCIÓN**
   • Paso 1: [Acción inicial]
   • Paso 2: [Proceso intermedio]
   • Paso 3: [Conclusión/Resultado]

5. **VALIDACIÓN Y RETROALIMENTACIÓN**
   • ¿La solución cumple con todos los requisitos?
   • Limitaciones o advertencias importantes
   • Posibles mejoras o iteraciones

FORMATO DE RESPUESTA:
• Usa encabezados claros (##)
• Incluye ejemplos concretos cuando sea relevante
• Mantén un tono profesional pero accesible
• Limita la respuesta a 500-700 palabras`;
}

/**
 * Aplica Few-Shot Learning con ejemplos contextuales
 */
function applyFewShot(prompt, analysis) {
  const promptType = identifyPromptType(prompt);
  const examples = FEW_SHOT_EXAMPLES[promptType.type.toLowerCase()] || FEW_SHOT_EXAMPLES.instruccional;
  
  const examplesText = examples.map((ex, i) => 
    `EJEMPLO ${i + 1}:
Input: "${ex.input}"
Output: "${ex.output}"`
  ).join('\n\n');

  return `Basándote en estos ejemplos de ${promptType.type.toLowerCase()}:

${examplesText}

Ahora, para este nuevo input:

INPUT: "${prompt}"

Por favor, genera una respuesta que:

1. SIGA EL MISMO FORMATO que los ejemplos
2. MANTENGA EL MISMO NIVEL DE DETALLE
3. USE UN TONO SIMILAR (${promptType.type === 'Creativo' ? 'creativo y engaging' : 'profesional y claro'})
4. INCLUYA ${analysis.specificity < 50 ? 'MÁS' : 'LA MISMA'} ESPECIFICIDAD

Si el input requiere un enfoque diferente a los ejemplos, adapta apropiadamente pero mantén la calidad y estructura.

RECUERDA:
• Responde directamente al input proporcionado
• No copies los ejemplos, úsalos como guía
• Sé consistente en formato y profundidad`;
}

/**
 * Aplica Role Play para contenido creativo/persuasivo
 */
function applyRolePlay(prompt, analysis) {
  const roles = {
    'tecnología': 'Ingeniero de Software Senior con 10 años de experiencia en startups',
    'educación': 'Pedagogo con maestría en metodologías innovadoras',
    'negocios': 'Consultor de estrategia para Fortune 500',
    'creativo': 'Escritor profesional ganador de premios literarios',
    'ciencia': 'Investigador con PhD y múltiples publicaciones'
  };
  
  // Determinar rol basado en keywords
  const keywords = extractKeywords(prompt);
  let selectedRole = roles.creativo;
  
  for (const [category, role] of Object.entries(roles)) {
    if (keywords.some(kw => kw.includes(category.substring(0, 4)))) {
      selectedRole = role;
      break;
    }
  }

  return `Actúa como ${selectedRole}.

CONTEXTO PROFESIONAL:
• Experiencia: ${selectedRole.split('con')[1]?.trim() || 'Extensa experiencia en el campo'}
• Especialización: ${selectedRole.split('con')[0]?.replace('Actúa como', '').trim() || 'Área relevante'}
• Enfoque: Resolver problemas complejos con soluciones prácticas

TAREA ASIGNADA:
"${prompt}"

DIRECTRICES ESPECÍFICAS:

1. **PERSPECTIVA PROFESIONAL**
   • Responde desde tu experiencia real en el campo
   • Usa terminología apropiada pero explica cuando sea necesario
   • Comparte insights basados en casos reales (sin nombres específicos)

2. **ENFOQUE PRÁCTICO**
   • Proporciona consejos aplicables inmediatamente
   • Incluye ejemplos de la vida real
   • Advierte sobre errores comunes y cómo evitarlos

3. **FORMATO DE RESPUESTA**
   • Introducción: Contextualiza desde tu expertise
   • Desarrollo: Explicación detallada con ejemplos
   • Conclusión: Resumen y próximos pasos
   • Extensión: ${analysis.wordCount < 50 ? '500-700 palabras' : '300-500 palabras'}

4. **TONO Y ESTILO**
   • ${analysis.context < 40 ? 'Educativo y claro' : 'Profesional y directo'}
   • Empático pero autoritativo
   • Motivador sin ser condescendiente

IMPORTANTE: Tu respuesta debe sonar genuinamente como ${selectedRole.toLowerCase()}, no como una IA generando texto.`;
}

/**
 * Aplica Structured Output para respuestas formateadas
 */
function applyStructuredOutput(prompt, analysis) {
  const structureTemplates = {
    'lista': `• Punto 1: [Descripción]
• Punto 2: [Descripción]
• Punto 3: [Descripción]`,
    'pasos': `1. Paso uno: [Acción]
2. Paso dos: [Acción] 
3. Paso tres: [Acción]`,
    'comparación': `VENTAJAS:
• [Ventaja 1]
• [Ventaja 2]

DESVENTAJAS:
• [Desventaja 1]
• [Desventaja 2]

RECOMENDACIÓN: [Recomendación final]`,
    'reporte': `RESUMEN EJECUTIVO:
[Resumen de 100 palabras]

HALLAZGOS PRINCIPALES:
1. [Hallazgo 1]
2. [Hallazgo 2]

RECOMENDACIONES:
• [Recomendación 1]
• [Recomendación 2]`
  };

  // Determinar estructura apropiada
  let selectedStructure = 'lista';
  if (prompt.includes('paso') || prompt.includes('cómo hacer')) selectedStructure = 'pasos';
  if (prompt.includes('compara') || prompt.includes('ventajas')) selectedStructure = 'comparación';
  if (prompt.includes('analiza') || prompt.includes('reporte')) selectedStructure = 'reporte';

  return `Genera una respuesta con estructura clara y definida:

SOLICITUD: "${prompt}"

REQUISITOS DE ESTRUCTURA:

FORMATO PRINCIPAL: ${selectedStructure.toUpperCase()}

${structureTemplates[selectedStructure]}

PARÁMETROS ADICIONALES:

1. **LONGITUD:** ${analysis.wordCount < 30 ? 'Completa pero concisa (200-300 palabras)' : 'Detallada (400-600 palabras)'}
2. **TONO:** ${analysis.clarity < 60 ? 'Claro y educativo' : 'Profesional y directo'}
3. **NIVEL DE DETALLE:** ${analysis.specificity < 50 ? 'Alto - incluye ejemplos concretos' : 'Moderado - enfócate en puntos clave'}
4. **ELEMENTOS OBLIGATORIOS:**
   • Introducción breve que contextualice
   • Desarrollo estructurado según el formato
   • Conclusión que resuma puntos clave
   • ${analysis.context < 40 ? 'Explicación de términos técnicos si es necesario' : 'Uso apropiado de terminología especializada'}

5. **RESTRICCIONES:**
   • No uses marcadores markdown complejos (##, ###)
   • Mantén consistencia en el formato
   • Evita divagaciones fuera de la estructura
   • Prioriza claridad sobre creatividad en el formato

EJEMPLO DE RESPUESTA ESPERADA:
[Usa exactamente la estructura especificada arriba, completando los placeholders con contenido relevante para la solicitud]`;
}

/**
 * Aplica Meta-Prompting para análisis de prompts
 */
function applyMetaPrompting(prompt, analysis) {
  return `Eres un experto en ingeniería de prompts con 5 años de experiencia optimizando prompts para IA.

ANÁLISIS SOLICITADO: Optimiza y mejora el siguiente prompt

PROMPT ORIGINAL: 
"${prompt}"

TU TAREA: Proporcionar un análisis detallado y 3 versiones mejoradas

---

**ANÁLISIS DE CALIDAD ACTUAL:**

PUNTUACIÓN: ${analysis.score}/100
• Claridad: ${analysis.clarity}/100
• Especificidad: ${analysis.specificity}/100  
• Contexto: ${analysis.context}/100
• Estructura: ${analysis.structure}/100

PROBLEMAS IDENTIFICADOS:
${analysis.commonProblems?.map(p => `• ${p.problem}: ${p.suggestion}`).join('\n') || '• Ninguno crítico identificado'}

---

**VERSIÓN OPTIMIZADA 1 (MEJOR GENERAL):**

🔹 ROL: [Rol específico apropiado]
🔹 TAREA: [Tarea clara y específica]
🔹 FORMATO: [Formato de salida definido]

📋 PROMPT MAESTRO:
"[Versión optimizada del prompt original con mejor claridad y estructura]"

🎯 MEJORAS APLICADAS:
• [Mejora 1 específica]
• [Mejora 2 específica]
• [Mejora 3 específica]

---

**VERSIÓN OPTIMIZADA 2 (ENFOQUE ALTERNATIVO):**

[Describe un enfoque diferente con ventajas específicas]

---

**VERSIÓN OPTIMIZADA 3 (PARA PROPÓSITO ESPECÍFICO):**

[Versión optimizada para un uso caso específico]

---

**RECOMENDACIONES FINALES:**

1. PRINCIPIO CLAVE: [Principio de prompt engineering aplicado]
2. ERRORES A EVITAR: [Errores comunes en este tipo de prompt]
3. PRÓXIMOS PASOS: [Cómo probar y iterar el prompt]
4. RECURSOS: [Herramientas o templates recomendados]

---

**INSTRUCCIONES PARA TI (EL MODELO DE IA):**
Analiza el prompt original en profundidad y genera las 3 versiones optimizadas siguiendo exactamente la estructura anterior. Sé específico en las mejoras aplicadas y explica el razonamiento detrás de cada cambio.`;
}

/**
 * Aplica la técnica seleccionada a un prompt
 */
export const applyTechnique = (prompt, technique, analysis) => {
  if (!technique || !technique.apply) {
    return applyChainOfThought(prompt, analysis); // Fallback
  }
  
  return technique.apply(prompt, analysis);
};

/**
 * Obtiene todas las técnicas disponibles
 */
export const getAvailableTechniques = () => {
  return Object.values(TECHNIQUES).map(tech => ({
    name: tech.name,
    description: tech.description,
    icon: tech.icon,
    color: tech.color
  }));
};

/**
 * Explica por qué se seleccionó una técnica
 */
export const explainTechniqueSelection = (prompt, technique, analysis) => {
  const promptType = identifyPromptType(prompt);
  
  const explanations = {
    'CHAIN_OF_THOUGHT': `Seleccionada porque el prompt es de tipo "${promptType.type}" y requiere razonamiento analítico paso a paso. La claridad (${analysis.clarity}/100) sugiere que beneficiará de estructura sistemática.`,
    'FEW_SHOT': `Seleccionada porque el prompt se beneficiará de ejemplos concretos. La especificidad (${analysis.specificity}/100) indica que ejemplos ayudarán a definir mejor el resultado esperado.`,
    'ROLE_PLAY': `Seleccionada para dar contexto profesional. El análisis muestra contexto (${analysis.context}/100), por lo que definir un rol mejorará la relevancia de la respuesta.`,
    'STRUCTURED_OUTPUT': `Seleccionada porque el prompt necesita formato claro. La estructura actual (${analysis.structure}/100) puede mejorarse con plantillas definidas.`,
    'META_PROMPTING': `Seleccionada para enseñar prompt engineering. El prompt es sobre prompts o se beneficiará de análisis comparativo.`
  };
  
  return explanations[technique.name.toUpperCase().replace(/ /g, '_')] || 
         `Seleccionada basándose en el análisis de calidad del prompt.`;
};

export default {
  selectAppropriateTechnique,
  applyTechnique,
  getAvailableTechniques,
  explainTechniqueSelection,
  TECHNIQUES
};