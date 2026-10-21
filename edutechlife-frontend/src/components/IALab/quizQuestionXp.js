import { useIALabStore } from "../../store/ialabStore";
import { scopedKey } from "../../utils/userScopedStorage";

/** XP por cada respuesta correcta de un quiz calificado (video o examen). */
export const QUESTION_XP = 5;

const AWARDED_KEY = "ialab_question_xp_awarded";

const readAwarded = () => {
  try {
    return JSON.parse(localStorage.getItem(scopedKey(AWARDED_KEY)) || "{}");
  } catch {
    return {};
  }
};

/**
 * Suma XP una sola vez por pregunta y por cuenta. Repetir un quiz no vuelve
 * a sumar: así el ranking refleja aprendizaje nuevo y no repeticiones.
 * @param {string} questionKey identificador estable, p. ej. "video:<id>:<n>"
 * @returns {number} XP otorgado (0 si ya estaba registrada)
 */
export function awardQuestionXp(questionKey) {
  const awarded = readAwarded();
  if (awarded[questionKey]) return 0;
  useIALabStore.getState().addXp(QUESTION_XP);
  try {
    awarded[questionKey] = Date.now();
    localStorage.setItem(scopedKey(AWARDED_KEY), JSON.stringify(awarded));
  } catch {
    /* si el almacenamiento falla, el XP ya se otorgó; no se bloquea el quiz */
  }
  return QUESTION_XP;
}
