const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const VALERIO_SYSTEM_PROMPT = `Eres Valerio, el tutor experto de Edutechlife. Evalúa el prompt del alumno. Debes responder estrictamente en formato JSON con estas llaves: "score" (0-100), "feedback" (3 consejos breves), "improvedPrompt" (el prompt optimizado) y "level" (Novato, Pro, Maestro). Responde únicamente con JSON válido, sin texto adicional.`;

const MODULE_CONTEXT = {
  1: {
    title: 'Ingeniería de Prompts',
    criteria: [
      'Claridad en la instrucción',
      'Contexto proporcionado',
      'Especificidad de la tarea',
      'Uso de técnicas avanzadas (CoT, Few-shot)',
    ],
  },
  2: {
    title: 'Potencia ChatGPT',
    criteria: [
      'Optimización de System Prompts',
      'Uso de GPTs personalizados',
      'Function Calling efectivo',
      'Integración con herramientas externas',
    ],
  },
  3: {
    title: 'Gemini Deep Research',
    criteria: [
      'Razonamiento multimodal',
      'Calidad de investigación',
      'Fact-checking y validación',
      'Profundidad del análisis',
    ],
  },
  4: {
    title: 'Notebook LM Mastery',
    criteria: [
      'Curaduría de fuentes',
      'Síntesis de conocimiento',
      'Audio Overviews efectivos',
      'Gestión documental',
    ],
  },
  5: {
    title: 'Examen Final Integrador',
    criteria: [
      'Integración de herramientas',
      'Innovación de la solución',
      'Viabilidad del proyecto',
      'Calidad de presentación',
    ],
  },
};

export const EvaluationLevels = {
  NOVICE: 'Novato',
  PRO: 'Pro',
  MASTER: 'Maestro',
};

const getModuleContext = (moduleId) => {
  return MODULE_CONTEXT[moduleId] || MODULE_CONTEXT[1];
};

const buildEvaluationPrompt = (studentPrompt, moduleId) => {
  const context = getModuleContext(moduleId);
  
  return `
Evalúa el siguiente prompt de un estudiante de Edutechlife.

MÓDULO: ${context.title}
CRITERIOS DE EVALUACIÓN:
${context.criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

PROMPT DEL ALUMNO:
---
${studentPrompt}
---

IMPORTANTE: Responde ÚNICAMENTE con JSON válido en este formato exacto:
{
  "score": número entre 0 y 100,
  "feedback": ["consejo 1", "consejo 2", "consejo 3"],
  "improvedPrompt": "versión optimizada del prompt",
  "level": "Novato" | "Pro" | "Maestro"
}
`;
};

export const evaluateWithDeepseek = async (studentPrompt, moduleId = 1) => {
  if (!studentPrompt || studentPrompt.trim().length === 0) {
    return {
      success: false,
      error: 'El prompt no puede estar vacío',
    };
  }

  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'sk-your-deepseek-key-here') {
    console.warn('Deepseek API key no configurada, usando modo demo');
    return generateDemoResponse(studentPrompt, moduleId);
  }

  const evaluationPrompt = buildEvaluationPrompt(studentPrompt, moduleId);

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: VALERIO_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: evaluationPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Respuesta vacía de la API');
    }

    const parsed = JSON.parse(content);
    
    return {
      success: true,
      data: {
        score: Math.min(100, Math.max(0, parsed.score || 0)),
        feedback: Array.isArray(parsed.feedback) ? parsed.feedback.slice(0, 3) : [],
        improvedPrompt: parsed.improvedPrompt || studentPrompt,
        level: parsed.level || EvaluationLevels.NOVICE,
        moduleId,
        evaluatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Error en evaluación Deepseek:', error);
    return {
      success: false,
      error: error.message || 'Error al evaluar el prompt',
    };
  }
};

const generateDemoResponse = (studentPrompt, moduleId) => {
  const context = getModuleContext(moduleId);
  const promptLength = studentPrompt.length;
  
  let score = 50;
  let level = EvaluationLevels.NOVICE;
  
  if (promptLength > 100) score += 15;
  if (promptLength > 200) score += 15;
  if (studentPrompt.includes('por favor') || studentPrompt.includes('Por favor')) score += 10;
  if (studentPrompt.includes('contexto') || studentPrompt.includes('ejemplo')) score += 10;
  
  if (score >= 80) level = EvaluationLevels.MASTER;
  else if (score >= 60) level = EvaluationLevels.PRO;

  return {
    success: true,
    data: {
      score: Math.min(100, score),
      feedback: [
        'Añade contexto específico para mejorar la respuesta',
        'Considera usar ejemplos Few-shot para tareas complejas',
        'Incluye restricciones claras para delimitar el alcance',
      ],
      improvedPrompt: `${studentPrompt}\n\n[Optimizado por Valerio]`,
      level,
      moduleId,
      evaluatedAt: new Date().toISOString(),
      demo: true,
    },
  };
};

export const evaluateAndSave = async (studentPrompt, moduleId, userId = null) => {
  const result = await evaluateWithDeepseek(studentPrompt, moduleId);
  
  if (result.success && result.data) {
    const { saveProgress, PROGRESS_STATUS } = await import('../lib/progress');
    
    const progressResult = await saveProgress(
      moduleId,
      PROGRESS_STATUS.COMPLETED,
      {
        score: result.data.score, // Guardar score en el campo principal
        evaluationScore: result.data.score,
        evaluationLevel: result.data.level,
        evaluatedPrompt: studentPrompt,
        improvedPrompt: result.data.improvedPrompt,
        evaluatedAt: result.data.evaluatedAt,
      }
    );

    return {
      ...result,
      saved: progressResult.success,
      progressSaved: progressResult,
    };
  }

  return result;
};

export const getEvaluationHistory = async (moduleId) => {
  const { supabase } = await import('../lib/supabase');
  
  try {
    // Asegurar que moduleId sea número
    const numericModuleId = Number(moduleId);
    if (isNaN(numericModuleId)) {
      console.error('moduleId debe ser un número:', moduleId);
      return [];
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('completed_lessons, updated_at, score')
      .eq('module_id', numericModuleId)
      .not('completed_lessons', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    
    return data
      ?.filter(item => item.completed_lessons?.evaluationScore || item.score)
      .map(item => ({
        score: item.completed_lessons?.evaluationScore || item.score || 0,
        level: item.completed_lessons?.evaluationLevel || 'Novato',
        evaluatedAt: item.updated_at,
      })) || [];
  } catch (error) {
    console.error('Error getting evaluation history:', error);
    return [];
  }
};

export default {
  evaluateWithDeepseek,
  evaluateAndSave,
  getEvaluationHistory,
  EvaluationLevels,
};
