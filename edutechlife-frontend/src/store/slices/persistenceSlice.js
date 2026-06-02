/**
 * persistenceSlice — localStorage wrappers, sync orchestration, attempt limits
 *
 * Estado: syncFromPersistence, clearProgressFromStorage, bookmark CRUD,
 *         valerioWelcomed, sidebarState, progressCache, storage get/set,
 *         challenge/exam attempt limits (remaining, cooldown, decrement)
 *
 * LS keys usadas: BOOKMARKED_RESOURCES, COMPLETED_VIDEOS, VALERIO_WELCOMED,
 *   SIDEBAR_STATE, PROGRESS_CACHE, VIEWED_RESOURCES, attempt keys
 *
 * La persistencia de gamificación (xp, streak, badges, etc.) se maneja
 * automáticamente vía Zustand persist middleware en ialabStore.js.
 *
 * Cross-slice: syncFromPersistence escribe en gamification, lesson, progress
 *   (xp, streak, badges, lessonProgress, completedModules, courseProgress, etc.)
 *
 * Side effects: localStorage reads/writes via ls.get/ls.set/ls.remove,
 *   window.dispatchEvent('ialab:attemptsUpdated')
 */
import { LS_KEYS } from '@/constants/ialab';
import { ls } from '@/utils/ialab';

export const createPersistenceSlice = (set, get) => ({
  syncFromPersistence: (data) => {
    const state = get();

    let persistedExams = { ...(data.completedExams || {}), ...state.completedExams };
    if (Object.keys(persistedExams).length === 0) {
      persistedExams = ls.get(LS_KEYS.COMPLETED_EXAMS, {});
    }

    const storeProgress = state.courseProgress;
    const incomingProgress = data.courseProgress;
    const effectiveProgress = (storeProgress > 0 && incomingProgress > 0)
      ? Math.max(storeProgress, incomingProgress)
      : (storeProgress > 0 ? storeProgress : (incomingProgress > 0 ? incomingProgress : 0));

    const localGamification = {
      xp: state.xp, streak: state.streak,
      lastActivityDate: state.lastActivityDate,
      badges: state.badges, badgesDates: state.badgesDates,
      lessonProgress: state.lessonProgress,
      checkpointAnswers: state.checkpointAnswers,
      forumPostCount: state.forumPostCount,
      forumCommentCount: state.forumCommentCount,
      startDate: state.startDate,
    };
    const remoteGamification = data.gamification;
    const mergedGamification = remoteGamification ? {
      xp: Math.max(localGamification.xp, remoteGamification.xp || 0),
      streak: Math.max(localGamification.streak, remoteGamification.streak || 0),
      lastActivityDate: [localGamification.lastActivityDate, remoteGamification.lastActivityDate].filter(Boolean).sort().pop() || null,
      badges: [...new Set([...(localGamification.badges || []), ...(remoteGamification.badges || [])])],
      badgesDates: { ...(remoteGamification.badgesDates || {}), ...(localGamification.badgesDates || {}) },
      lessonProgress: { ...(remoteGamification.lessonProgress || {}), ...(localGamification.lessonProgress || {}) },
      checkpointAnswers: { ...(remoteGamification.checkpointAnswers || {}), ...(localGamification.checkpointAnswers || {}) },
      forumPostCount: Math.max(localGamification.forumPostCount || 0, remoteGamification.forumPostCount || 0),
      forumCommentCount: Math.max(localGamification.forumCommentCount || 0, remoteGamification.forumCommentCount || 0),
      startDate: remoteGamification.startDate || localGamification.startDate,
    } : localGamification;
    set({
      completedModules: data.completedModules ?? state.completedModules,
      completedVideos: data.completedVideos ?? state.completedVideos,
      completedExams: persistedExams,
      completedInfographics: data.completedInfographics ?? state.completedInfographics,
      completedActivities: data.completedActivities ?? state.completedActivities,
      challengeScores: data.challengeScores ?? state.challengeScores,
      courseProgress: effectiveProgress,
      syncStatus: data.syncStatus ?? state.syncStatus,
      isUsingJWT: data.isUsingJWT ?? state.isUsingJWT,
      userId: data.userId ?? state.userId,
      userRole: data.userRole ?? state.userRole,
      isLoadingProgress: data.isLoading ?? state.isLoadingProgress,
      lessonProgress: mergedGamification.lessonProgress,
      xp: mergedGamification.xp,
      streak: mergedGamification.streak,
      lastActivityDate: mergedGamification.lastActivityDate,
      badges: mergedGamification.badges,
      badgesDates: mergedGamification.badgesDates,
      checkpointAnswers: mergedGamification.checkpointAnswers,
      forumPostCount: mergedGamification.forumPostCount,
      forumCommentCount: mergedGamification.forumCommentCount,
      startDate: mergedGamification.startDate || state.startDate || new Date().toISOString(),
    });
  },

  clearProgressFromStorage: () => {
    Object.values(LS_KEYS).forEach(key => ls.remove(key));
    try { localStorage.removeItem('ialab-store'); } catch {}
  },

  getBookmarkedResources: () => ls.get(LS_KEYS.BOOKMARKED_RESOURCES, []),
  setBookmarkedResources: (ids) => ls.set(LS_KEYS.BOOKMARKED_RESOURCES, ids),
  addBookmarkedResource: (id) => {
    const bookmarked = get().getBookmarkedResources();
    if (!bookmarked.includes(id)) {
      ls.set(LS_KEYS.BOOKMARKED_RESOURCES, [...bookmarked, id]);
    }
  },
  removeBookmarkedResource: (id) => {
    const bookmarked = get().getBookmarkedResources();
    ls.set(LS_KEYS.BOOKMARKED_RESOURCES, bookmarked.filter((b) => b !== id));
  },
  toggleBookmark: (id) => {
    const bookmarked = get().getBookmarkedResources();
    if (bookmarked.includes(id)) {
      get().removeBookmarkedResource(id);
    } else {
      get().addBookmarkedResource(id);
    }
  },

  getValerioWelcomed: () => ls.get(LS_KEYS.VALERIO_WELCOMED, false),
  setValerioWelcomed: () => ls.set(LS_KEYS.VALERIO_WELCOMED, true),

  getSidebarState: (fallback) => ls.get(LS_KEYS.SIDEBAR_STATE, fallback),
  setSidebarState: (data) => ls.set(LS_KEYS.SIDEBAR_STATE, data),
  removeSidebarState: () => ls.remove(LS_KEYS.SIDEBAR_STATE),

  getProgressCache: () => ls.get(LS_KEYS.PROGRESS_CACHE, null),
  setProgressCache: (data) => ls.set(LS_KEYS.PROGRESS_CACHE, data),
  removeProgressCache: () => ls.remove(LS_KEYS.PROGRESS_CACHE),

  storageGet: (key, fallback = null) => ls.get(key, fallback),
  storageSet: (key, value) => ls.set(key, value),
  storageRemove: (key) => ls.remove(key),
  storageGetInt: (key, fallback = 0) => {
    const val = ls.get(key, null);
    return val !== null ? parseInt(val, 10) : fallback;
  },
  storageSetString: (key, value) => {
    ls.set(key, value);
  },

  // ==================== LÍMITE DE INTENTOS ====================
  _attemptOps: (prefix) => {
    const isAdmin = get().userRole === 'admin';
    return {
      getRemainingAttempts: (moduleId) => {
        if (isAdmin) return 99;
        const key = `${prefix}_attempts_remaining_m${moduleId}`;
        return ls.get(key, 3);
      },
      getNextAttemptTime: (moduleId) => {
        if (isAdmin) return null;
        const key = `${prefix}_next_attempt_m${moduleId}`;
        return ls.get(key, null);
      },
      canAttemptRetry: (moduleId) => {
        if (isAdmin) return true;
        const key = `${prefix}_attempts_remaining_m${moduleId}`;
        const remaining = ls.get(key, 3);
        if (remaining <= 0) return false;
        const nextKey = `${prefix}_next_attempt_m${moduleId}`;
        const nextTime = ls.get(nextKey, null);
        if (nextTime && Date.now() < nextTime) return false;
        return true;
      },
      decrementAttempt: (moduleId) => {
        if (isAdmin) return 99;
        const key = `${prefix}_attempts_remaining_m${moduleId}`;
        const current = ls.get(key, 3);
        const newVal = Math.max(0, current - 1);
        ls.set(key, newVal);
        const nextKey = `${prefix}_next_attempt_m${moduleId}`;
        ls.set(nextKey, Date.now() + 12 * 60 * 60 * 1000);
        return newVal;
      },
    };
  },

  getChallengeRemainingAttempts: (moduleId) => get()._attemptOps('challenge').getRemainingAttempts(moduleId),
  getNextAttemptTime: (moduleId) => get()._attemptOps('challenge').getNextAttemptTime(moduleId),
  canAttemptChallengeRetry: (moduleId) => get()._attemptOps('challenge').canAttemptRetry(moduleId),
  decrementChallengeAttempt: (moduleId) => {
    const result = get()._attemptOps('challenge').decrementAttempt(moduleId);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('ialab:attemptsUpdated'));
    return result;
  },

  getExamRemainingAttempts: (moduleId) => get()._attemptOps('exam').getRemainingAttempts(moduleId),
  getExamNextAttemptTime: (moduleId) => get()._attemptOps('exam').getNextAttemptTime(moduleId),
  canAttemptExamRetry: (moduleId) => get()._attemptOps('exam').canAttemptRetry(moduleId),
  decrementExamAttempt: (moduleId) => {
    const result = get()._attemptOps('exam').decrementAttempt(moduleId);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('ialab:attemptsUpdated'));
    return result;
  },
});
