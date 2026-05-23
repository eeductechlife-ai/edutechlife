/**
 * progressSlice — Module progress, scoring, exam/challenge/resource tracking
 *
 * Estado: moduleProgress, completedModules, courseProgress, completedExams,
 *         completedVideos, completedInfographics, completedActivities,
 *         challengeScores, isLoadingProgress, syncStatus, isUsingJWT,
 *         userId, userRole
 *
 * Cross-slice calls:
 *   - updateModuleActivity → addXp (gamification), recordActivity,
 *     checkAndAwardBadges
 *   - markCommunityComment → addXp (gamification)
 *
 * Side effects: localStorage persist (completedExams), clearMemoCache()
 *
 * Dependencias: WEIGHTS, INITIAL_MODULE_PROGRESS, MODULE_RESOURCE_COUNTS,
 *   XP_MAP (constants), calcModuleScore, calcGlobalProgress, memoize,
 *   clearMemoCache, ls (utils)
 */
import { LS_KEYS, WEIGHTS, INITIAL_MODULE_PROGRESS, MODULE_RESOURCE_COUNTS, XP_MAP } from '@/constants/ialab';
import { calcModuleScore, calcGlobalProgress, memoize, clearMemoCache } from '@/utils/ialab';
import { ls } from '@/utils/ialab';

const _tryUnlockNextModule = (moduleId, updated, newProgress) => {
  if (moduleId < 5 && updated.resourcesCompleted && (updated.examScore || 0) >= 80 && (updated.challengeScore || 0) >= 80) {
    newProgress[moduleId + 1] = { ...newProgress[moduleId + 1], isUnlocked: true };
  }
};

export const createProgressSlice = (set, get) => ({
  moduleProgress: INITIAL_MODULE_PROGRESS,
  completedModules: [],
  courseProgress: 0,
  completedVideos: [],
  completedExams: ls.get(LS_KEYS.COMPLETED_EXAMS, {}),
  completedInfographics: [],
  completedActivities: [],
  challengeScores: {},
  isLoadingProgress: true,
  syncStatus: null,
  isUsingJWT: false,
  userId: null,
  userRole: 'student',
  courseCompleted: false,

  setCompletedModules: (v) => set(typeof v === 'function' ? { completedModules: v(get().completedModules) } : { completedModules: v }),
  setCourseProgress: (v) => set({ courseProgress: v }),
  setIsLoadingProgress: (v) => set({ isLoadingProgress: v }),
  setUserRole: (v) => set({ userRole: v }),
  setCourseCompleted: (v) => set({ courseCompleted: v }),

  calculateModuleScore: (moduleId) => {
    return calcModuleScore(get().moduleProgress[moduleId]);
  },

  getMemoizedModuleScore: (moduleId) => {
    const state = get();
    return memoize(`modScore_${moduleId}`, () => state.calculateModuleScore(moduleId));
  },

  calculateModulePoints: (moduleId) => {
    const score = get().calculateModuleScore(moduleId);
    return Math.round((score / 100) * 200);
  },

  getTotalPoints: () => {
    let total = 0;
    for (let i = 1; i <= 5; i++) total += get().calculateModulePoints(i);
    return Math.min(1000, total);
  },

  calculateGlobalProgress: () => {
    return calcGlobalProgress(get().moduleProgress);
  },

  getMemoizedGlobalProgress: () => {
    const state = get();
    return memoize('globalProgress', () => state.calculateGlobalProgress());
  },

  isModuleFullyApproved: (moduleId) => {
    const mod = get().moduleProgress[moduleId];
    if (!mod) return false;
    return mod.exam === true
        && mod.challenge === true
        && mod.resourcesCompleted === true
        && mod.currentScore >= 80;
  },

  isCourseCompleted: () => {
    return [1, 2, 3, 4, 5].every(id => {
      const mod = get().moduleProgress[id];
      return mod?.exam === true
          && mod?.challenge === true
          && mod?.resourcesCompleted === true
          && mod?.currentScore >= 80;
    });
  },

  updateModuleActivity: (moduleId, activity, value, score) => {
    const state = get();
    const prevMod = state.moduleProgress[moduleId];
    let newScore = 0;
    let justCompleted = false;

    const updated = { ...prevMod };
    if (activity === 'exam' && typeof score === 'number') {
      updated.examScore = score;
      updated.exam = score >= 80;
      updated.examEarned = (score / 100) * WEIGHTS.exam;
    } else if (activity === 'exam') {
      updated.exam = !!value;
      updated.examEarned = value ? WEIGHTS.exam : 0;
    }
    if (activity === 'challenge' && typeof score === 'number') {
      updated.challengeScore = score;
      updated.challenge = score >= 80;
      updated.challengeEarned = (score / 100) * WEIGHTS.challenge;
    } else if (activity === 'challenge') {
      updated.challenge = !!value;
      updated.challengeEarned = value ? WEIGHTS.challenge : 0;
    }
    if (activity === 'resourcesCompleted') {
      updated.resourcesCompleted = !!value;
    }
    if (activity === 'community') {
      updated.community = !!value;
    }

    updated.currentScore = calcModuleScore(updated);
    newScore = updated.currentScore;

    if ((prevMod?.currentScore || 0) < 80 && updated.currentScore >= 80) {
      justCompleted = true;
    }

    set((s) => {
      const newProgress = { ...s.moduleProgress, [moduleId]: updated };
      _tryUnlockNextModule(moduleId, updated, newProgress);
      const newCompletedExams = { ...s.completedExams };
      if (activity === 'exam' && typeof score === 'number') {
        newCompletedExams[moduleId] = score;
      }
      const newCompletedModules = [...s.completedModules];
      if (justCompleted && !newCompletedModules.includes(moduleId)) {
        newCompletedModules.push(moduleId);
      }
      return { moduleProgress: newProgress, completedExams: newCompletedExams, completedModules: newCompletedModules, courseProgress: calcGlobalProgress(newProgress) };
    });

    if (XP_MAP[activity]) {
      get().addXp(XP_MAP[activity]);
    }
    if (activity !== 'community') {
      get().recordActivity();
    }
    get().checkAndAwardBadges();

    if (activity === 'exam' && typeof score === 'number') {
      const current = ls.get(LS_KEYS.COMPLETED_EXAMS, {});
      current[moduleId] = score;
      ls.set(LS_KEYS.COMPLETED_EXAMS, current);
    }

    clearMemoCache();
    return { newScore, justCompleted };
  },

  markResourceAsViewed: (moduleId, resourceId) => {
    set((state) => {
      const mod = state.moduleProgress[moduleId];
      if (!mod) return state;
      const viewedResources = mod.viewedResources || [];
      if (viewedResources.includes(resourceId)) return state;
      const newViewed = [...viewedResources, resourceId];
      const totalResources = MODULE_RESOURCE_COUNTS[moduleId] || 8;
      const resourcesCompleted = newViewed.length >= totalResources;
      const resourcesPct = Math.round((newViewed.length / totalResources) * 100);
      const updated = { ...mod, viewedResources: newViewed, resourcesCompleted, resourcesPct };
      updated.currentScore = calcModuleScore(updated);
      const newProgress = { ...state.moduleProgress, [moduleId]: updated };
      _tryUnlockNextModule(moduleId, updated, newProgress);
      return { moduleProgress: newProgress, courseProgress: calcGlobalProgress(newProgress) };
    });
  },

  markCommunityComment: (moduleId) => {
    const state = get();
    const mod = state.moduleProgress[moduleId];
    if (!mod || mod.community) return;
    const updated = { ...mod, community: true };
    updated.currentScore = calcModuleScore(updated);
    const newProgress = { ...state.moduleProgress, [moduleId]: updated };
    _tryUnlockNextModule(moduleId, updated, newProgress);
    set({ moduleProgress: newProgress, courseProgress: calcGlobalProgress(newProgress), forumCommentCount: (state.forumCommentCount || 0) + 1 });
    get().addXp(15);
  },

  isModuleLocked: (moduleId) => {
    if (get().userRole === 'admin') return false;
    if (moduleId === 1) return false;
    return !get().moduleProgress[moduleId]?.isUnlocked;
  },

  isEvaluationLocked: (moduleId) => {
    if (get().userRole === 'admin') return false;
    if (moduleId === 1) return false;
    return !get().completedModules.includes(moduleId - 1);
  },
});
