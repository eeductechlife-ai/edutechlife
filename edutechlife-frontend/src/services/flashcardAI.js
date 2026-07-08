import { callDeepseek } from '../utils/api';

const SYSTEM_PROMPT = `Eres un asistente educativo que genera tarjetas de estudio (flashcards) para estudiantes de 8-16 años en español.

Genera EXACTAMENTE 10 tarjetas sobre el tema solicitado. Cada tarjeta debe tener:
- "front": el término, concepto o palabra clave (máximo 80 caracteres)
- "back": la definición o explicación clara y educativa (máximo 200 caracteres)

Reglas:
- Lenguaje simple y claro, apropiado para niños y jóvenes
- Incluye ejemplos concretos cuando sea posible
- Datos exactos y verificables
- Sin markdown, sin texto adicional ni explicaciones

Responde ÚNICAMENTE con un array JSON válido en este formato:
[{"front": "...", "back": "..."}]`;

export async function generateFlashcards(topic) {
  if (!topic.trim()) {
    throw new Error('Por favor escribe un tema');
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: topic.trim() },
  ];

  const result = await callDeepseek(messages, {
    isJson: true,
    temperature: 0.7,
    maxTokens: 2000,
  });

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('No se pudieron generar flashcards. Intenta con otro tema.');
  }

  return result.slice(0, 10).map((card, i) => ({
    id: `${Date.now().toString(36)}-${i}-${Math.random().toString(36).slice(2, 5)}`,
    front: card.front || card.term || 'Término',
    back: card.back || card.definition || card.description || 'Definición',
  }));
}
