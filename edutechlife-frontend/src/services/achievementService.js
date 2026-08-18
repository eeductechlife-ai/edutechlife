/**
 * Achievement Service — Gestionar desbloqueos de logros y badges
 * Responsabilidades:
 * - Validar condiciones de desbloqueo
 * - Actualizar estado de achievements
 * - Disparar animaciones y notificaciones
 */

const ACHIEVEMENTS = {
  FIRST_LESSON: { id: 'first_lesson', name: 'Primer Paso', icon: '🎓', points: 10 },
  FIVE_DAY_STREAK: { id: 'five_day_streak', name: 'En Racha', icon: '🔥', points: 50 },
  HUNDRED_POINTS: { id: 'hundred_points', name: 'Centenario', icon: '💯', points: 25 },
  MASTER_SUBJECT: { id: 'master_subject', name: 'Experto', icon: '👑', points: 100 },
  PERFECT_QUIZ: { id: 'perfect_quiz', name: 'Perfección', icon: '✨', points: 30 },
  SOCIAL_BUTTERFLY: { id: 'social_butterfly', name: 'Mariposa Social', icon: '🦋', points: 40 },
};

const UNLOCK_CONDITIONS = {
  first_lesson: (userData) => (userData?.missions?.length ?? 0) > 0,
  five_day_streak: (userData) => (userData?.streak?.current ?? 0) >= 5,
  hundred_points: (userData) => (userData?.totalPoints ?? 0) >= 100,
  master_subject: (userData) => {
    const subjectProgress = userData?.subjectTime ?? {};
    return Object.values(subjectProgress).some((time) => (time ?? 0) >= 60);
  },
  perfect_quiz: (userData) => {
    const quizzes = userData?.analyzedActivities ?? [];
    return quizzes.some((q) => q?.score === 100);
  },
  social_butterfly: (userData) => {
    const friends = userData?.friendsList ?? [];
    return friends.length >= 3;
  },
};

/**
 * Evalúa si un achievement debería desbloquearse basado en userData
 * @param {string} achievementId
 * @param {object} userData
 * @returns {boolean}
 */
export const shouldUnlock = (achievementId, userData) => {
  if (!achievementId || !userData) return false;

  const condition = UNLOCK_CONDITIONS[achievementId];
  if (!condition) return false;

  try {
    return condition(userData);
  } catch (error) {
    console.error(`Error evaluating achievement ${achievementId}:`, error);
    return false;
  }
};

/**
 * Calcula achievements pendientes de desbloquear
 * @param {object} userData
 * @param {array} unlockedIds - IDs de achievements ya desbloqueados
 * @returns {array} - Nuevos achievements desbloqueados
 */
export const calculateNewUnlocks = (userData, unlockedIds = []) => {
  if (!userData) return [];

  const unlockedSet = new Set(unlockedIds || []);
  const newUnlocks = [];

  Object.keys(ACHIEVEMENTS).forEach((key) => {
    const achievementId = ACHIEVEMENTS[key].id;
    if (!unlockedSet.has(achievementId) && shouldUnlock(achievementId, userData)) {
      newUnlocks.push(ACHIEVEMENTS[key]);
    }
  });

  return newUnlocks;
};

/**
 * Genera payload para sincronizar achievements a Supabase
 * @param {array} newUnlocks
 * @param {array} existingUnlocked
 * @returns {object}
 */
export const buildUnlockPayload = (newUnlocks, existingUnlocked = []) => {
  if (!Array.isArray(newUnlocks)) return { unlockedRewards: existingUnlocked };

  const updated = [...(existingUnlocked || [])];

  newUnlocks.forEach((achievement) => {
    if (!updated.some((a) => a.id === achievement.id)) {
      updated.push({
        ...achievement,
        unlockedAt: new Date().toISOString(),
      });
    }
  });

  return { unlockedRewards: updated };
};

/**
 * Valida que un achievement es legítimo (seguridad — prevenir spoofing)
 * @param {string} achievementId
 * @returns {boolean}
 */
export const isValidAchievementId = (achievementId) => {
  return Object.values(ACHIEVEMENTS).some((a) => a.id === achievementId);
};

/**
 * Retorna la lista completa de achievements disponibles
 * @returns {array}
 */
export const getAvailableAchievements = () => {
  return Object.values(ACHIEVEMENTS);
};

/**
 * Calcula puntos totales de achievements
 * @param {array} unlockedAchievements
 * @returns {number}
 */
export const calculateAchievementPoints = (unlockedAchievements = []) => {
  return (unlockedAchievements || []).reduce((sum, a) => sum + (a.points ?? 0), 0);
};

export default {
  ACHIEVEMENTS,
  shouldUnlock,
  calculateNewUnlocks,
  buildUnlockPayload,
  isValidAchievementId,
  getAvailableAchievements,
  calculateAchievementPoints,
};
