import { callDeepseek } from "../../utils/api";
import { GRADE_LEVELS } from "./config";
import { buildSystemPrompt } from "./promptBuilder";
import { detectCardIcon } from "./iconDetection";

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

  const result = await callDeepseek(messages, {
    isJson: true,
    temperature: 0.7,
    maxTokens: 2500,
  });

  if (!Array.isArray(result) || result.length === 0) {
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
