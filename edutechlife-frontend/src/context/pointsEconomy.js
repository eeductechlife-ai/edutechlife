/**
 * Economía de puntos de IngenIA: una sola tabla.
 *
 * Antes cada pantalla tenía su propio número (un reto de 3 preguntas daba +15
 * y «3 preguntas a Dani» +90), así que el camino más rápido a un premio era
 * chatear. El orden pedagógico que sigue esta tabla:
 *
 *   reto completado  >  ADN (una vez)  >  práctica repetible  >  conversar
 *
 * Lo que se puede repetir sin fin (retos, EduCards, simulacros, podcasts)
 * tiene un tope diario por categoría para que repetir el mismo mazo no sea la
 * forma de subir de nivel.
 */

export const POINTS = {
  // Una sola vez
  adn: 100,
  uploadActivity: 50,
  analyzeActivity: 100,
  // Repetibles, con tope diario (ver DAILY_CAP)
  challenge: { easy: 50, medium: 100, hard: 200 },
  challengeLowScoreFactor: 0.3, // por debajo de 70 % se paga el 30 %
  educardsPerCard: 2,
  educardsPerUnderstood: 3,
  deckQuizPerCorrect: 15,
  oralPerCorrect: 10,
  podcast: 20,
  // Hábitos
  planActivity: 25,
  gradeAnalysis: 50, // una vez al día
  newsRead: { young: 10, older: 15 }, // tras 15 s de lectura
  activeMinute: 1,
  // Conversar con Dani vale menos que practicar
  daniMission: 40,
};

/**
 * Tope diario de puntos por categoría. Las categorías son las del servidor
 * (points_history.category tiene una lista cerrada): los retos van en
 * `challenge_complete`, la práctica con tarjetas, simulacros y examen oral en
 * `quiz_pass`, y lo creativo (podcast) en `participation`.
 */
export const DAILY_CAP = {
  challenge_complete: 600,
  quiz_pass: 300,
  participation: 100,
};

/** Categoría de servidor para cada tipo de práctica repetible. */
export const CATEGORY = {
  challenge: "challenge_complete",
  educards: "quiz_pass",
  deckQuiz: "quiz_pass",
  oral: "quiz_pass",
  podcast: "participation",
};

const sameDay = (a, b) => a.toDateString() === b.toDateString();

/** Puntos ya ganados hoy en una categoría (solo suman los positivos). */
export function earnedToday(category, history, now = new Date()) {
  return (history || []).reduce((sum, e) => {
    if (!e || e.category !== category || !(e.points > 0)) return sum;
    const when = new Date(e.timestamp);
    return Number.isNaN(when.getTime()) || !sameDay(when, now)
      ? sum
      : sum + e.points;
  }, 0);
}

/**
 * Cuántos de `amount` puntos se pueden dar ahora según el tope diario de la
 * categoría (0 si ya se llegó). Una categoría sin tope da todo.
 */
export function capPoints({ category, amount, history, now = new Date() }) {
  const cap = DAILY_CAP[category];
  if (cap == null || !(amount > 0)) return amount;
  const left = Math.max(0, cap - earnedToday(category, history, now));
  return Math.min(amount, left);
}

/**
 * Premios que la plataforma ya no ofrece porque no puede cumplirlos: «Día
 * Libre» no depende de IngenIA, «Certificado VAK» chocaba con el rediseño del
 * ADN (ya no se presenta como certificado) y el modo oscuro es gratis en
 * Cuenta. Se ocultan de la tienda salvo que la persona ya lo tenga.
 */
const RETIRED_REWARD_NAMES = ["Día Libre", "Certificado VAK", "Tema Oscuro"];

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

export function isRetiredReward(reward) {
  const name = norm(reward?.name);
  return RETIRED_REWARD_NAMES.some((n) => norm(n) === name);
}

/** Lista de la tienda sin los premios retirados (los ya canjeados se quedan). */
export function storeRewards(rewards, unlockedIds = []) {
  return (rewards || []).filter(
    (r) => !isRetiredReward(r) || unlockedIds.includes(r.id),
  );
}

/**
 * Puntos reales de una misión. Las misiones guardadas en cada cuenta traen el
 * valor con el que se crearon; las de «hablar con Dani» se rebajan para todos.
 */
const MISSION_XP_OVERRIDE = {
  3: POINTS.daniMission,
  w_dani3: POINTS.daniMission,
};

export function missionXp(mission) {
  const override = MISSION_XP_OVERRIDE[mission?.id];
  return override != null ? override : mission?.xp || 0;
}
