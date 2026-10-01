/**
 * Banco de preguntas del ADN de Aprendizaje del sitio.
 *
 * Usa el mismo motor que IngenIA (kids-dashboard/vak/vakQuestions): una
 * situación real por pregunta, tres opciones (una por estilo) y orden
 * rotativo, de modo que el resultado del sitio y el de la plataforma
 * coincidan para la misma persona.
 */
import {
  KIDS_QUESTIONS,
  TEEN_QUESTIONS,
  answerOrder,
  CHANNEL_STYLE,
} from "../components/kids-dashboard/vak/vakQuestions";

const toSiteQuestion = (item, index) => ({
  emoji: item.emoji,
  context: item.contexto,
  text: item.pregunta,
  options: answerOrder(index).map((channel) => ({
    text: item.opciones[channel].texto,
    emoji: item.opciones[channel].emoji,
    type: CHANNEL_STYLE[channel],
  })),
});

const KIDS = KIDS_QUESTIONS.map(toSiteQuestion);
const TEEN = TEEN_QUESTIONS.map(toSiteQuestion);

export const QUESTIONS_BY_GROUP = { kids: KIDS, teen: TEEN };

/** Mismo corte que IngenIA: hasta 8 años usan el banco infantil. */
export function getQuestionsByAge(age) {
  const ageNum = parseInt(age, 10) || 12;
  return ageNum <= 8 ? KIDS : TEEN;
}

/**
 * Modo de la experiencia: "explorer" (8 a 11 años, tarjetas grandes y voz
 * activa) o "pro" (12 a 16 años, más directo y voz opcional).
 */
export function getVakMode(age) {
  const ageNum = parseInt(age, 10) || 12;
  return ageNum <= 11 ? "explorer" : "pro";
}

export default QUESTIONS_BY_GROUP;
