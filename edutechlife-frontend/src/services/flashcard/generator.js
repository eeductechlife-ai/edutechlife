import { callDeepseek } from "../../utils/api";
import { GRADE_LEVELS } from "./config";
import { buildSystemPrompt } from "./promptBuilder";
import { detectCardIcon } from "./iconDetection";

const WRAPPER_KEYS = [
  "flashcards",
  "cards",
  "tarjetas",
  "result",
  "data",
  "items",
  "list",
];

function deepFindArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) {
      const found = deepFindArray(child);
      if (found) return found;
    }
  }
  return null;
}

export function normalizeCards(result) {
  if (Array.isArray(result)) return result;
  if (result && typeof result === "object") {
    for (const key of WRAPPER_KEYS) {
      if (Array.isArray(result[key])) return result[key];
    }
    return deepFindArray(result);
  }
  return null;
}

const buildCorrectionPrompt = (broken) => `El siguiente texto debía ser un JSON válido con un array de tarjetas de estudio, pero está malformado:

"""${broken.slice(0, 3000)}"""

Corrige los errores de sintaxis y responde ÚNICAMENTE con un objeto JSON válido con esta estructura:
{"flashcards": [{"keyword": "...", "definition": "...", "example": "...", "relatedTerms": ["..."]}]}`;

export async function generateFlashcards(topic, grade = "4-6") {
  if (!topic.trim()) {
    throw new Error("Por favor escribe un tema");
  }

  if (!GRADE_LEVELS[grade]) {
    throw new Error("Grado inválido");
  }

  const systemPrompt = buildSystemPrompt(grade);
  const userMessage = `Tema: "${topic.trim()}"\nGrado: ${grade} (${GRADE_LEVELS[grade].ages})`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];

  const attempts = [{ messages, temperature: 0.7 }, null];

  let result = null;
  let lastBroken = "";
  for (let i = 0; i < attempts.length; i++) {
    let parsed;
    try {
      if (i === 0) {
        parsed = await callDeepseek(messages, {
          isJson: true,
          temperature: 0.7,
          maxTokens: 2500,
        });
      } else {
        parsed = await callDeepseek(
          [
            { role: "system", content: systemPrompt },
            { role: "user", content: buildCorrectionPrompt(lastBroken) },
          ],
          { isJson: true, temperature: 0.3, maxTokens: 2500 },
        );
      }
    } catch (e) {
      lastBroken = e.raw || "";
      if (i === attempts.length - 1) throw e;
      continue;
    }

    result = normalizeCards(parsed);
    if (result && result.length > 0) break;
  }

  if (!result || result.length === 0) {
    throw new Error(
      "No se pudieron generar flashcards. Intenta con otro tema.",
    );
  }

  return result.slice(0, 10).map((card, i) => ({
    id: `${Date.now().toString(36)}-${i}-${Math.random().toString(36).slice(2, 5)}`,
    front: card.keyword || card.front || "Término",
    back: card.definition || card.back || "Definición",
    example: card.example || "Ejemplo",
    relatedTerms: Array.isArray(card.relatedTerms) ? card.relatedTerms : [],
    grade,
    icon: detectCardIcon(card.keyword || card.front || ""),
  }));
}
