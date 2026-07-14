export const MIN_INPUT_LENGTH = 3;
export const MAX_INPUT_LENGTH = 500;

export const DEEPSEEK_MODEL = "deepseek-chat";
export const DEEPSEEK_TEMPERATURE = 0.7;
export const DEEPSEEK_MAX_TOKENS = 1000;
export const DEEPSEEK_ENDPOINT = "/api/chat";

export const HISTORY_LIMIT = 10;

export const DEEPSEEK_SCORE_DEFAULTS = {
  score: 95,
  clarity: 9,
  specificity: 9,
  context: 9,
  structure: 9,
};

export const BEFORE_COMPARISON_DEFAULTS = {
  score: 40,
  clarity: 3,
  specificity: 2,
  context: 2,
  structure: 1,
};

export const DEEPSEEK_PROCESSING_TIME = 2000;
export const LOCAL_PROCESSING_TIME = 120;

export const DEEPSEEK_MODEL_VERSION = "deepseek-chat";
export const LOCAL_MODEL_VERSION = "v2.0";

export const DEEPSEEK_TECHNIQUE = {
  name: "DeepSeek Prompt Engineering",
  description:
    "Generado con IA avanzada especializada en ingeniería de prompts",
  icon: "fa-brain",
  color: "#06B6D4",
  explanation:
    "Prompt generado automáticamente por DeepSeek AI analizando la estructura óptima para tu idea",
};

export const DEEPSEEK_SOURCE_NAME = "DeepSeek AI";

export const EMPTY_USAGE_STATS = {
  totalOptimizations: 0,
  lastOptimization: null,
  favoriteTechnique: "Ninguna",
  averageScore: 0,
  improvementTrend: 0,
};

export const getSystemPrompt = (
  userIdea,
) => `Eres un profesor experto en Prompt Engineering. El estudiante ingresó esta idea básica: '${userIdea}'. Convierte esta idea en un Prompt Maestro estructurado. Devuelve ÚNICAMENTE un objeto JSON válido con estas claves exactas (sin markdown, solo el JSON):
                                    
                                    rol: El rol para la IA.
                                    tarea: La acción específica.
                                    formato: El formato de salida.
                                    prompt_maestro: El prompt final optimizado.
                                    analisis_tecnico: Un feedback directo al estudiante, explicándole de forma educativa por qué su idea era incompleta y cómo los elementos agregados mejoran el resultado.`;
