/**
 * Prediction Service — Alertas predictivas y análisis de riesgo
 * Responsabilidades:
 * - Detectar riesgo de abandono
 * - Predecir próximos logros
 * - Generar alertas para padres
 */

/**
 * Riesgo de que un estudiante abandone la plataforma (churn prediction)
 * @param {object} studentData
 * @returns {object} - { riskLevel, score, reasons: [] }
 */
export const predictChurnRisk = (studentData = {}) => {
  if (!studentData || Object.keys(studentData).length === 0) {
    return { riskLevel: "unknown", score: 0, reasons: [] };
  }

  let riskScore = 0;
  const reasons = [];

  // Factor: Inactividad (sin actividad en últimos 7 días)
  const lastActive = new Date(studentData?.streak?.lastActive);
  const daysInactive = (Date.now() - lastActive) / (1000 * 60 * 60 * 24);
  if (daysInactive > 7) {
    riskScore += 30;
    reasons.push(`Inactivo por ${Math.round(daysInactive)} días`);
  }

  // Factor: Baja puntuación (< 50 puntos totales)
  const totalPoints = studentData?.totalPoints ?? 0;
  if (totalPoints < 50 && daysInactive > 3) {
    riskScore += 25;
    reasons.push("Baja puntuación acumulada");
  }

  // Factor: Racha rota (streak = 0)
  const currentStreak = studentData?.streak?.current ?? 0;
  if (currentStreak === 0 && daysInactive > 2) {
    riskScore += 20;
    reasons.push("Racha perdida");
  }

  // Factor: Sin misiones completadas
  const missionsCount = studentData?.missions?.length ?? 0;
  if (missionsCount === 0 && daysInactive > 1) {
    riskScore += 15;
    reasons.push("Ninguna misión completada");
  }

  // Factor: Actividad muy baja (< 30 minutos acumulados)
  const activeMinutes = studentData?.totalActiveMinutes ?? 0;
  if (activeMinutes < 30 && daysInactive > 3) {
    riskScore += 10;
    reasons.push(`Solo ${activeMinutes} minutos de uso`);
  }

  return {
    riskLevel: riskScore > 70 ? "high" : riskScore > 40 ? "medium" : "low",
    score: Math.min(100, riskScore),
    reasons,
  };
};

/**
 * Predice qué logro se desbloqueará próximamente
 * @param {object} studentData
 * @param {array} unlockedAchievementIds
 * @returns {object|null} - { achievementId, progress, daysUntilUnlock }
 */
export const predictNextUnlock = (
  studentData = {},
  unlockedAchievementIds = [],
) => {
  if (!studentData) return null;

  const predictions = [];
  const currentPoints = studentData?.totalPoints ?? 0;
  const currentStreak = studentData?.streak?.current ?? 0;

  // Predicción: Hundred Points
  if (!unlockedAchievementIds.includes("hundred_points")) {
    const pointsNeeded = Math.max(0, 100 - currentPoints);
    const pointsPerDay = calculateDailyPoints(studentData);
    const daysNeeded =
      pointsPerDay > 0 ? Math.ceil(pointsNeeded / pointsPerDay) : 999;
    predictions.push({
      achievementId: "hundred_points",
      progress: Math.round((currentPoints / 100) * 100),
      daysUntilUnlock: daysNeeded,
      estimatedDate: new Date(Date.now() + daysNeeded * 24 * 60 * 60 * 1000),
    });
  }

  // Predicción: Five Day Streak
  if (!unlockedAchievementIds.includes("five_day_streak")) {
    const streakNeeded = Math.max(0, 5 - currentStreak);
    predictions.push({
      achievementId: "five_day_streak",
      progress: Math.round((currentStreak / 5) * 100),
      daysUntilUnlock: streakNeeded,
      estimatedDate: new Date(Date.now() + streakNeeded * 24 * 60 * 60 * 1000),
    });
  }

  // Retornar el logro más cercano
  if (predictions.length === 0) return null;

  return predictions.reduce((closest, current) =>
    current.daysUntilUnlock < closest.daysUntilUnlock ? current : closest,
  );
};

/**
 * Calcula puntos promedio por día basado en historial
 * @param {object} studentData
 * @returns {number}
 */
export const calculateDailyPoints = (studentData = {}) => {
  const history = studentData?.pointsHistory ?? [];
  if (history.length < 2) return 0;

  const firstEntry = history[0];
  const lastEntry = history[history.length - 1];

  const firstDate = new Date(firstEntry?.date);
  const lastDate = new Date(lastEntry?.date);

  const daysDiff = Math.max(1, (lastDate - firstDate) / (1000 * 60 * 60 * 24));
  const pointsDiff = Math.max(
    0,
    (lastEntry?.cumulative ?? 0) - (firstEntry?.cumulative ?? 0),
  );

  return Math.round(pointsDiff / daysDiff);
};

/**
 * Genera alerta para padre basada en comportamiento del hijo
 * @param {object} studentData
 * @param {array} previousAlerts - Alertas previas para evitar duplicados
 * @returns {object|null} - { type, severity, message, actionRequired }
 */
export const generateParentAlert = (studentData = {}, previousAlerts = []) => {
  if (!studentData) return null;

  const churnRisk = predictChurnRisk(studentData);

  // Alerta: Alto riesgo de abandono
  if (churnRisk.riskLevel === "high") {
    const lastAlert = previousAlerts.find((a) => a.type === "high_churn_risk");
    const shouldAlert =
      !lastAlert ||
      Date.now() - new Date(lastAlert.createdAt) > 24 * 60 * 60 * 1000;

    if (shouldAlert) {
      return {
        type: "high_churn_risk",
        severity: "high",
        message: `Tu hijo ha estado inactivo. Ayúdalo a retomar la práctica.`,
        actionRequired: true,
        suggestedAction: "Send encouragement message",
        createdAt: new Date().toISOString(),
      };
    }
  }

  // Alerta: Puntuación consistentemente baja
  const avgScore = calculateRecentAverageScore(studentData);
  if (avgScore < 50 && studentData?.missions?.length > 0) {
    const lastAlert = previousAlerts.find((a) => a.type === "low_scores");
    const shouldAlert =
      !lastAlert ||
      Date.now() - new Date(lastAlert.createdAt) > 3 * 24 * 60 * 60 * 1000;

    if (shouldAlert) {
      return {
        type: "low_scores",
        severity: "medium",
        message: `Las puntuaciones de tu hijo están bajas. Considera ofrecerle ayuda adicional.`,
        actionRequired: false,
        suggestedAction: "Review learning topics",
        createdAt: new Date().toISOString(),
      };
    }
  }

  // Alerta: Progreso excepcional (motivación)
  if (
    churnRisk.riskLevel === "low" &&
    (studentData?.streak?.current ?? 0) >= 7 &&
    (studentData?.totalPoints ?? 0) >= 200
  ) {
    const lastAlert = previousAlerts.find(
      (a) => a.type === "outstanding_progress",
    );
    const shouldAlert =
      !lastAlert ||
      Date.now() - new Date(lastAlert.createdAt) > 7 * 24 * 60 * 60 * 1000;

    if (shouldAlert) {
      return {
        type: "outstanding_progress",
        severity: "low",
        message: `¡Tu hijo va muy bien! Mantén el impulso.`,
        actionRequired: false,
        suggestedAction: "Celebrate achievement",
        createdAt: new Date().toISOString(),
      };
    }
  }

  return null;
};

/**
 * Calcula puntuación promedio de los últimos quizzes
 * @param {object} studentData
 * @param {number} limit
 * @returns {number}
 */
export const calculateRecentAverageScore = (studentData = {}, limit = 5) => {
  const quizzes = studentData?.analyzedActivities ?? [];
  if (quizzes.length === 0) return 0;

  const recent = quizzes.slice(-limit);
  const totalScore = recent.reduce((sum, q) => sum + (q?.score ?? 0), 0);

  return Math.round(totalScore / recent.length);
};

/**
 * Valida que una alerta es legítima (no duplicada ni obsoleta)
 * @param {object} alert
 * @param {array} previousAlerts
 * @returns {boolean}
 */
export const isAlertValid = (alert, previousAlerts = []) => {
  if (!alert || !alert.type) return false;

  // No enviar si ya hay una alerta del mismo tipo reciente (< 24h)
  const recent = previousAlerts.find((a) => a.type === alert.type);
  if (recent && Date.now() - new Date(recent.createdAt) < 24 * 60 * 60 * 1000) {
    return false;
  }

  return true;
};

export default {
  predictChurnRisk,
  predictNextUnlock,
  calculateDailyPoints,
  generateParentAlert,
  calculateRecentAverageScore,
  isAlertValid,
};
