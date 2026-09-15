/**
 * Puntaje ponderado por dificultad para los retos (examen).
 *
 * Regla: las preguntas más difíciles valen más puntos. La nota se normaliza
 * sobre el peso total del intento, así que "acertar la difícil" sube más la
 * nota que "acertar la fácil" — y fallarla la baja más.
 *
 * Pesos: fácil=1, medio=2, difícil=3. Se normaliza el texto de la dificultad
 * para tolerar es/en/pt y acentos ("fácil", "médio", "hard", ...).
 */

const WEIGHT_BY_KEY = {
  facil: 1,
  easy: 1,
  medio: 2,
  medium: 2,
  dificil: 3,
  hard: 3,
};

const normalizeDifficulty = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const DEFAULT_QUESTION_WEIGHT = 1;

export function questionWeight(question) {
  return WEIGHT_BY_KEY[normalizeDifficulty(question?.difficulty)] ??
    DEFAULT_QUESTION_WEIGHT;
}

/**
 * Elige `count` preguntas al azar del banco (sin repetir), para la "ruleta".
 * Si el banco es más pequeño que `count`, devuelve todo el banco.
 * `rng` es inyectable para poder testear de forma determinista.
 */
export function pickRandomQuestions(bank = [], count = 10, rng = Math.random) {
  const pool = [...bank];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

export function calculateWeightedScore(questions, answers = {}, passingScore = 80) {
  let earned = 0;
  let total = 0;
  let correctCount = 0;
  const failedQuestions = [];

  for (const question of questions || []) {
    const weight = questionWeight(question);
    total += weight;
    if (answers[question.id] === question.correctAnswer) {
      earned += weight;
      correctCount += 1;
    } else {
      failedQuestions.push(question.id);
    }
  }

  const percentage = total > 0 ? (earned / total) * 100 : 0;

  return {
    score: Math.round(percentage),
    correctCount,
    passed: percentage >= passingScore,
    failedQuestions,
    earned,
    total,
    neededToPass: Math.ceil((passingScore / 100) * (questions?.length || 0)),
  };
}
