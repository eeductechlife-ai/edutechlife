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
import {
  LS_KEYS,
  MODULE_RESOURCE_COUNTS,
  RESOURCE_MODULE_MAP,
} from "@/constants/ialab";
import { ls, calcModuleScore } from "@/utils/ialab";

function resolveProgressConflict(local, remote) {
  if (!local) return remote || local;
  if (!remote) return local;

  const localTime = local.lastSyncedAt
    ? new Date(local.lastSyncedAt).getTime()
    : 0;
  const remoteTime = remote.lastSyncedAt
    ? new Date(remote.lastSyncedAt).getTime()
    : 0;

  if (localTime > remoteTime) return local;
  if (remoteTime > localTime) return remote;

  const localScore = local.courseProgress || 0;
  const remoteScore = remote.courseProgress || 0;

  return localScore >= remoteScore ? local : remote;
}

/**
 * Fusión MONÓTONA: el progreso de un estudiante nunca debe retroceder. Un
 * remoto vacío (RLS, cold start, timeout) o un estado inicial (0) no puede
 * borrar lo que ya existe localmente. Arrays → unión; números → máximo;
 * booleanos/objetos → OR/merge.
 */
function mergeMonotonic(local, incoming) {
  if (incoming === null || incoming === undefined) return local;
  if (Array.isArray(local) || Array.isArray(incoming)) {
    const localArr = Array.isArray(local) ? local : [];
    const incomingArr = Array.isArray(incoming) ? incoming : [];
    return Array.from(new Set([...localArr, ...incomingArr]));
  }
  if (typeof local === "object" || typeof incoming === "object") {
    const out = { ...(local || {}) };
    Object.entries(incoming || {}).forEach(([key, value]) => {
      const prev = out[key];
      if (typeof value === "number" && typeof prev === "number") {
        out[key] = Math.max(prev, value);
      } else if (typeof value === "boolean" && typeof prev === "boolean") {
        out[key] = prev || value;
      } else {
        out[key] = value === undefined || value === null ? prev : value;
      }
    });
    return out;
  }
  if (typeof local === "number" && typeof incoming === "number") {
    return Math.max(local, incoming);
  }
  return incoming;
}

export const createPersistenceSlice = (set, get) => ({
  syncFromPersistence: (data) => {
    const state = get();

    let persistedExams = {
      ...(data.completedExams || {}),
      ...state.completedExams,
    };
    if (Object.keys(persistedExams).length === 0) {
      persistedExams = ls.get(LS_KEYS.COMPLETED_EXAMS, {});
    }

    const storeProgress = state.courseProgress;
    const incomingProgress = data.courseProgress;
    const resolvedProgress = resolveProgressConflict(
      { courseProgress: storeProgress, lastSyncedAt: state.lastActivityDate },
      {
        courseProgress: incomingProgress,
        lastSyncedAt: data.lastSyncedAt || data.gamification?.lastActivityDate,
      },
    );
    const effectiveProgress = resolvedProgress.courseProgress || 0;
    // Nunca bajar el porcentaje global ya logrado en este dispositivo.
    const safeProgress = Math.max(state.courseProgress || 0, effectiveProgress);

    const localGamification = {
      xp: state.xp,
      streak: state.streak,
      lastActivityDate: state.lastActivityDate,
      badges: state.badges,
      badgesDates: state.badgesDates,
      lessonProgress: state.lessonProgress,
      checkpointAnswers: state.checkpointAnswers,
      forumPostCount: state.forumPostCount,
      forumCommentCount: state.forumCommentCount,
      startDate: state.startDate,
    };
    const remoteGamification = data.gamification;
    const mergedGamification = remoteGamification
      ? {
          xp: Math.max(localGamification.xp, remoteGamification.xp || 0),
          streak: Math.max(
            localGamification.streak,
            remoteGamification.streak || 0,
          ),
          lastActivityDate:
            [
              localGamification.lastActivityDate,
              remoteGamification.lastActivityDate,
            ]
              .filter(Boolean)
              .sort()
              .pop() || null,
          badges: [
            ...new Set([
              ...(localGamification.badges || []),
              ...(remoteGamification.badges || []),
            ]),
          ],
          badgesDates: {
            ...(remoteGamification.badgesDates || {}),
            ...(localGamification.badgesDates || {}),
          },
          lessonProgress: {
            ...(remoteGamification.lessonProgress || {}),
            ...(localGamification.lessonProgress || {}),
          },
          checkpointAnswers: {
            ...(remoteGamification.checkpointAnswers || {}),
            ...(localGamification.checkpointAnswers || {}),
          },
          forumPostCount: Math.max(
            localGamification.forumPostCount || 0,
            remoteGamification.forumPostCount || 0,
          ),
          forumCommentCount: Math.max(
            localGamification.forumCommentCount || 0,
            remoteGamification.forumCommentCount || 0,
          ),
          startDate:
            remoteGamification.startDate || localGamification.startDate,
        }
      : localGamification;
    set({
      completedModules: mergeMonotonic(
        state.completedModules,
        data.completedModules,
      ),
      completedVideos: mergeMonotonic(
        state.completedVideos,
        data.completedVideos,
      ),
      completedExams: mergeMonotonic(persistedExams, data.completedExams),
      completedInfographics: mergeMonotonic(
        state.completedInfographics,
        data.completedInfographics,
      ),
      completedActivities: mergeMonotonic(
        state.completedActivities,
        data.completedActivities,
      ),
      challengeScores: mergeMonotonic(
        state.challengeScores,
        data.challengeScores,
      ),
      completedCommunity: mergeMonotonic(
        state.completedCommunity,
        data.completedCommunity,
      ),
      courseProgress: safeProgress,
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
      startDate:
        mergedGamification.startDate ||
        state.startDate ||
        new Date().toISOString(),
    });

    const currentModuleProgress = get().moduleProgress;
    const hasAnyViewed = Object.values(currentModuleProgress).some(
      (m) => (m.viewedResources?.length || 0) > 0,
    );
    if (!hasAnyViewed) {
      const flatViewed = get().getViewedResources();
      if (Array.isArray(flatViewed) && flatViewed.length > 0) {
        // Se parte del estado ACTUAL (no de INITIAL) para no perder
        // exam/challenge/community/score de otros módulos al reconstruir.
        const rebuiltProgress = JSON.parse(
          JSON.stringify(currentModuleProgress),
        );
        const completedMods = get().completedModules || [];

        flatViewed.forEach((id) => {
          const modId = RESOURCE_MODULE_MAP[id];
          if (modId && rebuiltProgress[modId]) {
            if (!rebuiltProgress[modId].viewedResources.includes(id)) {
              rebuiltProgress[modId].viewedResources.push(id);
            }
          }
        });

        Object.entries(rebuiltProgress).forEach(([modId, mod]) => {
          const mid = Number(modId);
          const viewed = mod.viewedResources || [];
          const total = MODULE_RESOURCE_COUNTS[mid] || 8;
          const pct = Math.round((viewed.length / total) * 100);
          mod.resourcesPct = Math.max(mod.resourcesPct || 0, pct);
          mod.resourcesCompleted =
            mod.resourcesCompleted ||
            completedMods.includes(mid) ||
            viewed.length >= total;
          mod.currentScore = Math.max(
            mod.currentScore || 0,
            calcModuleScore(mod),
          );
        });

        set({ moduleProgress: rebuiltProgress });
      }
    }
  },

  clearProgressFromStorage: () => {
    Object.values(LS_KEYS).forEach((key) => ls.remove(key));
    try {
      localStorage.removeItem("ialab-store");
    } catch {}
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
    ls.set(
      LS_KEYS.BOOKMARKED_RESOURCES,
      bookmarked.filter((b) => b !== id),
    );
  },
  _bookmarkVersion: 0,
  toggleBookmark: (id) => {
    const bookmarked = get().getBookmarkedResources();
    if (bookmarked.includes(id)) {
      get().removeBookmarkedResource(id);
    } else {
      get().addBookmarkedResource(id);
    }
    set({ _bookmarkVersion: Date.now() });
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
  // Política: 3 intentos seguidos (sin espera entre uno y otro). Solo cuando
  // se agotan los 3 se escribe un cooldown de 12h; al cumplirse se recargan los
  // 3 intentos automáticamente. Antes el cooldown se escribía en cada intento,
  // así que el primer reintento quedaba bloqueado para siempre.
  _attemptOps: (prefix) => {
    const isAdmin = () => get().userRole === "admin";
    const remKey = (m) => `${prefix}_attempts_remaining_m${m}`;
    const nextKey = (m) => `${prefix}_next_attempt_m${m}`;

    // Si el cooldown ya expiró, devuelve los 3 intentos y limpia la marca.
    const rechargeIfDue = (moduleId) => {
      const next = ls.get(nextKey(moduleId), null);
      if (next && Date.now() >= next) {
        ls.set(remKey(moduleId), 3);
        ls.remove(nextKey(moduleId));
      }
    };

    const getRemaining = (moduleId) => {
      if (isAdmin()) return 99;
      rechargeIfDue(moduleId);
      return ls.get(remKey(moduleId), 3);
    };

    return {
      getRemainingAttempts: getRemaining,
      getNextAttemptTime: (moduleId) => {
        if (isAdmin()) return null;
        rechargeIfDue(moduleId);
        if (getRemaining(moduleId) > 0) return null;
        return ls.get(nextKey(moduleId), null);
      },
      canAttemptRetry: (moduleId) => {
        if (isAdmin()) return true;
        // Mientras queden intentos no hay espera; canAttempt es true.
        return getRemaining(moduleId) > 0;
      },
      decrementAttempt: (moduleId) => {
        if (isAdmin()) return 99;
        const newVal = Math.max(0, getRemaining(moduleId) - 1);
        ls.set(remKey(moduleId), newVal);
        if (newVal <= 0) {
          // Se agotaron los 3: recién aquí empieza el cooldown de 12h.
          ls.set(nextKey(moduleId), Date.now() + 12 * 60 * 60 * 1000);
        } else {
          ls.remove(nextKey(moduleId));
        }
        return newVal;
      },
    };
  },

  getChallengeRemainingAttempts: (moduleId) =>
    get()._attemptOps("challenge").getRemainingAttempts(moduleId),
  getNextAttemptTime: (moduleId) =>
    get()._attemptOps("challenge").getNextAttemptTime(moduleId),
  canAttemptChallengeRetry: (moduleId) =>
    get()._attemptOps("challenge").canAttemptRetry(moduleId),
  decrementChallengeAttempt: (moduleId) => {
    const result = get()._attemptOps("challenge").decrementAttempt(moduleId);
    if (typeof window !== "undefined")
      window.dispatchEvent(new Event("ialab:attemptsUpdated"));
    return result;
  },

  getExamRemainingAttempts: (moduleId) =>
    get()._attemptOps("exam").getRemainingAttempts(moduleId),
  getExamNextAttemptTime: (moduleId) =>
    get()._attemptOps("exam").getNextAttemptTime(moduleId),
  canAttemptExamRetry: (moduleId) =>
    get()._attemptOps("exam").canAttemptRetry(moduleId),
  decrementExamAttempt: (moduleId) => {
    const result = get()._attemptOps("exam").decrementAttempt(moduleId);
    if (typeof window !== "undefined")
      window.dispatchEvent(new Event("ialab:attemptsUpdated"));
    return result;
  },
});
