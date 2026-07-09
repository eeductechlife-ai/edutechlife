import { callDeepseek } from "../utils/api";

// Niveles por edad para adaptar la profundidad del resumen
const AGE_LEVELS = {
  "6-8": {
    label: "6-8 años",
    tone: "muy sencillo, con palabras simples y frases cortas",
    depth: "explicaciones básicas con ejemplos de la vida diaria",
  },
  "9-11": {
    label: "9-11 años",
    tone: "sencillo y claro, con vocabulario apropiado",
    depth: "explicaciones claras con ejemplos concretos",
  },
  "12-14": {
    label: "12-14 años",
    tone: "académico pero accesible",
    depth: "explicaciones con algo de detalle y relaciones entre conceptos",
  },
  "15-17": {
    label: "15-17 años",
    tone: "académico y preciso",
    depth: "explicaciones completas con matices y aplicaciones",
  },
};

const buildSummaryPrompt = (subject, ageKey) => {
  const level = AGE_LEVELS[ageKey] || AGE_LEVELS["12-14"];

  return `Eres un profesor experto${subject ? ` de ${subject}` : ""} que ayuda a estudiantes de ${level.label} a entender material de estudio.

Un estudiante te comparte el texto de un documento, foto o PDF. Tu tarea es leerlo y explicarlo como lo haría un buen profesor: claro, ordenado y con calidad pedagógica, para que el estudiante APRENDA de verdad.

Adapta el lenguaje a la edad: ${level.tone}. ${level.depth}.

Responde ÚNICAMENTE con un objeto JSON válido con esta estructura EXACTA:
{
  "title": "Título claro y específico del tema (máximo 60 caracteres)",
  "overview": "Resumen general del tema en 2-3 frases, como lo introduciría un profesor en clase",
  "keyConcepts": [
    { "term": "Concepto clave", "explanation": "Explicación clara del concepto adaptada a la edad" }
  ],
  "learningPoints": ["Idea importante que el estudiante debe recordar"],
  "example": "Un ejemplo concreto o analogía que ayude a entender el tema, apropiado para la edad",
  "difficulty": "básico"
}

REGLAS IMPORTANTES:
- "keyConcepts": entre 3 y 6 conceptos, los MÁS importantes del material
- "learningPoints": entre 3 y 5 ideas clave para recordar
- "difficulty": debe ser exactamente "básico", "intermedio" o "avanzado"
- Contenido pedagógicamente correcto y verificable
- Si el material está incompleto o poco claro, resume lo que sí se entienda y no inventes datos falsos
- Sin markdown, sin asteriscos, sin formato especial dentro de los textos
- Todo en español`;
};

/**
 * Genera un resumen educativo tipo profesor a partir del texto extraído
 * de una foto, documento o PDF.
 * @param {string} text - Texto extraído del material del estudiante
 * @param {object} opts - { subject, ageKey }
 * @returns {Promise<object>} Resumen estructurado
 */
export async function generateStudySummary(text, opts = {}) {
  const clean = (text || "").trim();
  if (clean.length < 20) {
    throw new Error(
      "No se pudo leer suficiente texto del material. Prueba con una imagen más nítida o un archivo con más contenido.",
    );
  }

  const { subject = "", ageKey = "12-14" } = opts;
  const systemPrompt = buildSummaryPrompt(subject, ageKey);

  // Limitar el texto para no exceder el contexto del modelo
  const material = clean.slice(0, 6000);

  const messages = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Material del estudiante${subject ? ` (materia: ${subject})` : ""}:\n"""\n${material}\n"""\n\nGenera el resumen educativo en JSON.`,
    },
  ];

  const result = await callDeepseek(messages, {
    isJson: true,
    temperature: 0.5,
    maxTokens: 2000,
  });

  if (!result || typeof result !== "object") {
    throw new Error("No se pudo generar el resumen. Intenta de nuevo.");
  }

  // Normalizar la estructura para blindar el render
  return {
    title: result.title || "Resumen del material",
    overview: result.overview || "",
    keyConcepts: Array.isArray(result.keyConcepts)
      ? result.keyConcepts
          .filter((c) => c && (c.term || c.explanation))
          .map((c) => ({
            term: c.term || "Concepto",
            explanation: c.explanation || "",
          }))
      : [],
    learningPoints: Array.isArray(result.learningPoints)
      ? result.learningPoints.filter(Boolean)
      : [],
    example: result.example || "",
    difficulty: ["básico", "intermedio", "avanzado"].includes(result.difficulty)
      ? result.difficulty
      : "intermedio",
  };
}
