/**
 * Multiplayer Service — Gestionar leaderboards, competencia y rankings
 * Responsabilidades:
 * - Calcular rankings por criterios
 * - Validar integridad de datos
 * - Implementar fair play (detección de anomalías)
 */

/**
 * Calcula el ranking de un estudiante en un leaderboard
 * @param {object} studentData - Datos del estudiante
 * @param {array} allStudentsData - Datos de todos los estudiantes
 * @param {string} sortBy - Campo para ordenar: 'points', 'streak', 'avgScore'
 * @returns {object} - { rank, total, percentile, score }
 */
export const calculateRank = (
  studentData,
  allStudentsData = [],
  sortBy = "points",
) => {
  if (!Array.isArray(allStudentsData)) {
    return { rank: null, total: 0, percentile: 0, score: 0 };
  }

  if (!studentData) {
    return {
      rank: null,
      total: allStudentsData.length,
      percentile: 0,
      score: 0,
    };
  }

  const scores = allStudentsData
    .map((s) => {
      switch (sortBy) {
        case "streak":
          return s?.streak?.current ?? 0;
        case "avgScore":
          return calculateAverageScore(s);
        case "points":
        default:
          return s?.totalPoints ?? 0;
      }
    })
    .sort((a, b) => b - a);

  const studentScore =
    studentData[
      sortBy === "streak"
        ? "streak"
        : sortBy === "avgScore"
          ? "avgScore"
          : "totalPoints"
    ];
  const actualScore =
    sortBy === "streak" ? (studentScore?.current ?? 0) : (studentScore ?? 0);
  const rank = scores.findIndex((s) => s === actualScore) + 1;
  const percentile = Math.round(
    ((scores.length - rank + 1) / scores.length) * 100,
  );

  return {
    rank: rank > 0 ? rank : null,
    total: allStudentsData.length,
    percentile,
    score: actualScore,
  };
};

/**
 * Calcula el promedio de puntuación de un estudiante
 * @param {object} studentData
 * @returns {number}
 */
export const calculateAverageScore = (studentData = {}) => {
  const quizzes = studentData?.analyzedActivities ?? [];
  if (quizzes.length === 0) return 0;

  const totalScore = quizzes.reduce((sum, q) => sum + (q?.score ?? 0), 0);
  return Math.round(totalScore / quizzes.length);
};

/**
 * Genera un leaderboard ordenado
 * @param {array} allStudentsData
 * @param {string} sortBy - 'points', 'streak', 'avgScore'
 * @param {number} limit - Máximo de estudiantes a retornar
 * @returns {array}
 */
export const generateLeaderboard = (
  allStudentsData = [],
  sortBy = "points",
  limit = 50,
) => {
  if (!Array.isArray(allStudentsData) || allStudentsData.length === 0) {
    return [];
  }

  let sortedStudents = [...allStudentsData];

  switch (sortBy) {
    case "streak":
      sortedStudents.sort(
        (a, b) => (b?.streak?.current ?? 0) - (a?.streak?.current ?? 0),
      );
      break;
    case "avgScore":
      sortedStudents.sort(
        (a, b) => calculateAverageScore(b) - calculateAverageScore(a),
      );
      break;
    case "points":
    default:
      sortedStudents.sort(
        (a, b) => (b?.totalPoints ?? 0) - (a?.totalPoints ?? 0),
      );
  }

  return sortedStudents.slice(0, Math.max(1, limit)).map((student, index) => ({
    rank: index + 1,
    name: student?.name || "Anónimo",
    score:
      sortBy === "streak"
        ? (student?.streak?.current ?? 0)
        : sortBy === "avgScore"
          ? calculateAverageScore(student)
          : (student?.totalPoints ?? 0),
    userId: student?.id,
    avatarUrl: student?.avatarUrl || null,
  }));
};

/**
 * Detecta patrones anómalos en datos (prevención de fraude)
 * @param {object} studentData - Datos nuevos/actualizados
 * @param {object} previousData - Datos previos
 * @returns {object} - { isAnomalous, flags: [] }
 */
export const detectAnomalies = (studentData, previousData = {}) => {
  const flags = [];

  if (!studentData) return { isAnomalous: false, flags };

  const pointsDelta =
    (studentData?.totalPoints ?? 0) - (previousData?.totalPoints ?? 0);
  const pointsPerMinute =
    pointsDelta / Math.max(1, studentData?.totalActiveMinutes ?? 1);

  // Más de 10 puntos por minuto = sospechoso
  if (pointsPerMinute > 10) {
    flags.push("suspicious_point_velocity");
  }

  // Racha imposible: no se puede ganar 100+ días en 1 día
  const streakDelta =
    (studentData?.streak?.current ?? 0) - (previousData?.streak?.current ?? 0);
  if (streakDelta > 7) {
    flags.push("impossible_streak_jump");
  }

  // Todos los quizzes con puntuación perfecta en minutos
  const quizzes = studentData?.analyzedActivities ?? [];
  const perfectQuizzes = quizzes.filter((q) => q?.score === 100).length;
  if (
    perfectQuizzes / Math.max(1, quizzes.length) > 0.8 &&
    quizzes.length > 5
  ) {
    flags.push("all_perfect_scores");
  }

  // Cambios bruscos de VAK
  if (
    previousData?.vakResult &&
    studentData?.vakResult &&
    previousData.vakResult !== studentData.vakResult
  ) {
    flags.push("vak_changed");
  }

  return {
    isAnomalous: flags.length > 0,
    flags,
    riskLevel: flags.length >= 2 ? "high" : flags.length > 0 ? "medium" : "low",
  };
};

/**
 * Valida que el score está dentro de rangos válidos
 * @param {number} score
 * @returns {boolean}
 */
export const isValidScore = (score) => {
  return typeof score === "number" && score >= 0 && score <= 100;
};

/**
 * Calcula tendencia de mejora (últimos N días)
 * @param {object} studentData
 * @param {number} days
 * @returns {number} - Porcentaje de cambio
 */
export const calculateTrend = (studentData = {}, days = 7) => {
  const history = studentData?.pointsHistory ?? [];
  if (history.length < 2) return 0;

  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Get first point within the window (or before it if none exist)
  let firstPoint = null;
  for (let i = 0; i < history.length; i++) {
    const pointDate = new Date(history[i]?.date);
    if (pointDate >= cutoffDate) {
      firstPoint = i > 0 ? history[i - 1] : history[i];
      break;
    }
  }

  if (!firstPoint) firstPoint = history[0];
  const lastPoint = history[history.length - 1];

  const first = firstPoint?.cumulative ?? 0;
  const last = lastPoint?.cumulative ?? 0;

  if (first === 0) return last > 0 ? 100 : 0;
  if (first === last) return 0;

  return Math.round(((last - first) / first) * 100);
};

export default {
  calculateRank,
  calculateAverageScore,
  generateLeaderboard,
  detectAnomalies,
  isValidScore,
  calculateTrend,
};
