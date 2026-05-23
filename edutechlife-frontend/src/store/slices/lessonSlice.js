/**
 * lessonSlice — Lesson progress, checkpoints, video/resource tracking
 *
 * Estado: lessonProgress, checkpointAnswers, lastVisitedLesson
 *
 * Cross-slice calls:
 *   - markLessonComplete → addXp (gamification), recordActivity,
 *     checkAndAwardBadges, persistGamificationState
 *
 * Dependencias: ALL_LESSONS (data), LS_KEYS (constants), ls (utils)
 */
import { LS_KEYS } from '@/constants/ialab';
import { ALL_LESSONS } from '@/data/ialab';
import { ls } from '@/utils/ialab';

export const createLessonSlice = (set, get) => ({
  lessonProgress: {},
  checkpointAnswers: {},
  lastVisitedLesson: null,

  markLessonComplete: (moduleId, lessonId) => {
    const state = get();
    const progress = { ...state.lessonProgress };
    if (!progress[moduleId]) progress[moduleId] = {};
    if (progress[moduleId][lessonId] === 'completed') return;
    progress[moduleId] = { ...progress[moduleId], [lessonId]: 'completed' };
    set({ lessonProgress: progress });
    get().addXp(50);
    get().recordActivity();
    get().checkAndAwardBadges();
    get().persistGamificationState();
  },

  markLessonInProgress: (moduleId, lessonId) => set((state) => {
    const progress = { ...state.lessonProgress };
    if (!progress[moduleId]) progress[moduleId] = {};
    progress[moduleId] = { ...progress[moduleId], [lessonId]: 'in-progress' };
    return { lessonProgress: progress };
  }),

  recordCheckpointAnswer: (moduleId, lessonId, answerIndex) => set((state) => {
    const answers = { ...state.checkpointAnswers };
    if (!answers[moduleId]) answers[moduleId] = {};
    answers[moduleId] = { ...answers[moduleId], [lessonId]: answerIndex };
    return { checkpointAnswers: answers };
  }),

  setLastVisitedLesson: (moduleId, lessonId) => set({ lastVisitedLesson: { moduleId, lessonId } }),

  getCompletedLessonCount: (moduleId) => {
    const progress = get().lessonProgress[moduleId];
    if (!progress) return 0;
    return Object.values(progress).filter(s => s === 'completed').length;
  },

  getModuleLessons: (moduleId) => {
    const lessons = ALL_LESSONS[moduleId] || [];
    const progress = get().lessonProgress[moduleId] || {};
    return lessons.map((lesson, idx) => {
      const prevLessonId = idx > 0 ? lessons[idx - 1].id : null;
      const prevCompleted = prevLessonId ? progress[prevLessonId] === 'completed' : true;
      const isCompleted = progress[lesson.id] === 'completed';
      const isInProgress = progress[lesson.id] === 'in-progress';
      const status = isCompleted ? 'completed' : isInProgress ? 'in-progress' : (idx === 0 || prevCompleted) ? 'available' : 'locked';
      return { ...lesson, status };
    });
  },

  getNextUncompletedLesson: (moduleId) => {
    const lessons = ALL_LESSONS[moduleId] || [];
    const progress = get().lessonProgress[moduleId] || {};
    return lessons.find(l => progress[l.id] !== 'completed') || null;
  },

  getViewedResources: () => ls.get(LS_KEYS.VIEWED_RESOURCES, []),
  setViewedResources: (ids) => ls.set(LS_KEYS.VIEWED_RESOURCES, ids),
  addViewedResource: (id) => {
    const viewed = get().getViewedResources();
    if (!viewed.includes(id)) {
      const updated = [...viewed, id];
      ls.set(LS_KEYS.VIEWED_RESOURCES, updated);
    }
  },

  getCompletedVideos: () => ls.get(LS_KEYS.COMPLETED_VIDEOS, []),
  setCompletedVideos: (ids) => ls.set(LS_KEYS.COMPLETED_VIDEOS, ids),

  hasStartedCourse: () => {
    const state = get();
    const videos = state.getCompletedVideos();
    if (videos.length > 0) return true;
    return Object.values(state.moduleProgress).some(m => m.exam || m.challenge || m.resourcesCompleted);
  },

  markVideoComplete: (id) => {
    const completed = get().getCompletedVideos();
    if (!completed.includes(id)) {
      const updated = [...completed, id];
      ls.set(LS_KEYS.COMPLETED_VIDEOS, updated);
      set({ completedVideos: updated });
    }
  },
});
