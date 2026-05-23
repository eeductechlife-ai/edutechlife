/**
 * ialabStore — Zustand store principal del módulo IALab
 *
 * Composición: 6 slices (persistence, gamification, lesson, progress, evaluation, ui)
 * + 7 funciones cross-cutting que dependen de múltiples slices
 *   (getCurrentModule, checkCourseCompletion, generateModuleActivityList,
 *    determinePrimaryAction, getDailyRoute, getWeeklyXP, getDetailedRecommendations)
 *
 * Las funciones cross-cutting se mantienen aquí porque leen/escriben en 3+ slices.
 * Los slices se importan como createXxxSlice(set, get) y se spread en el objeto final.
 *
 * Store total: ~333 líneas (antes 1104 antes del refactor)
 *
 * @see src/store/ARCHITECTURE.md
 */
import { create } from 'zustand';
import { MODULE_QUESTIONS, modules, ALL_LESSONS } from '@/data/ialab';
import { LAST_MODULE_ID } from '@/constants/ialab';
import { analyzeQuizFailures, generateRecommendations } from '@/utils/ialab';
import { createPersistenceSlice } from './slices/persistenceSlice';
import { createGamificationSlice } from './slices/gamificationSlice';
import { createLessonSlice } from './slices/lessonSlice';
import { createProgressSlice } from './slices/progressSlice';
import { createEvaluationSlice } from './slices/evaluationSlice';
import { createUiSlice } from './slices/uiSlice';
import { createNavigationSlice } from './slices/navigationSlice';
import { createSynthesizerSlice } from './slices/synthesizerSlice';
import { createCertificateSlice } from './slices/certificateSlice';
import { createSeguridadSlice } from './slices/seguridadSlice';

export const useIALabStore = create((set, get) => ({
  ...createPersistenceSlice(set, get),
  ...createGamificationSlice(set, get),
  ...createLessonSlice(set, get),
  ...createProgressSlice(set, get),
  ...createEvaluationSlice(set, get),
  ...createNavigationSlice(set, get),
  ...createSynthesizerSlice(set, get),
  ...createCertificateSlice(set, get),
  ...createSeguridadSlice(set, get),
  ...createUiSlice(set, get),

  getCurrentModule: () => {
    const state = get();
    return modules.find(m => m.id === state.activeMod) || modules[0];
  },

  checkCourseCompletion: () => {
    const state = get();
    const modulesApprovedByScore = [1, 2, 3, 4, 5].filter(id => state.calculateModuleScore(id) >= 80).length;
    const modulesInContext = state.completedModules.length;
    const effectiveModulesCompleted = Math.max(modulesApprovedByScore, modulesInContext);
    const examsInContext = Object.values(state.completedExams).filter(s => typeof s === 'number' ? s >= 80 : s).length;
    const examsByScore = [1, 2, 3, 4, 5].filter(id => state.moduleProgress[id]?.exam).length;
    const effectiveExamsCompleted = Math.max(examsInContext, examsByScore);
    const progressThreshold = state.courseProgress >= 80;
    const isCompleted = effectiveModulesCompleted >= 5 && progressThreshold;
    set({ courseCompleted: isCompleted });
    return isCompleted;
  },

  generateModuleActivityList: (moduleId) => {
    const state = get();
    const lessons = ALL_LESSONS[moduleId] || [];
    const lessonProg = state.lessonProgress[moduleId] || {};
    const modProg = state.moduleProgress[moduleId];
    const activities = [];

    lessons.forEach((lesson, idx) => {
      const isCompleted = lessonProg[lesson.id] === 'completed';
      const prevLessonId = idx > 0 ? lessons[idx - 1].id : null;
      const prevCompleted = prevLessonId ? lessonProg[prevLessonId] === 'completed' : true;
      const isInProgress = lessonProg[lesson.id] === 'in-progress';

      let status;
      if (isCompleted) status = 'completed';
      else if (isInProgress) status = 'in-progress';
      else if (idx === 0 || prevCompleted) status = 'available';
      else status = 'locked';

      activities.push({
        type: 'lesson',
        id: `lesson-${lesson.id}`,
        lessonId: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        xp: '+50 XP',
        status,
        icon: lesson.icon,
        description: lesson.description,
        objectives: lesson.objectives,
      });
    });

    const allLessonsDone = lessons.every(l => lessonProg[l.id] === 'completed');
    const examDone = modProg?.exam;
    activities.push({
      type: 'exam',
      id: `exam-${moduleId}`,
      title: 'Examen del Módulo',
      duration: '30 min',
      xp: '+100 XP',
      status: examDone ? 'completed' : (allLessonsDone ? 'available' : 'locked'),
      description: examDone ? 'Completado' : (allLessonsDone ? 'Disponible ahora' : 'Completa todas las lecciones primero'),
    });

    const challengeDone = modProg?.challenge;
    const modScore = state.calculateModuleScore(moduleId);
    const scoreReady = modScore >= 80;
    activities.push({
      type: 'challenge',
      id: `challenge-${moduleId}`,
      title: 'Desafío del Módulo',
      duration: '45 min',
      xp: '+200 XP',
      status: challengeDone ? 'completed' : (scoreReady ? 'available' : 'locked'),
      description: challengeDone ? 'Completado' : (scoreReady ? 'Disponible ahora' : 'Requiere nota ≥80 en el módulo'),
    });

    const communityDone = modProg?.community;
    activities.push({
      type: 'community',
      id: `community-${moduleId}`,
      title: 'Participación en Comunidad',
      duration: '10 min',
      xp: '+15 XP',
      status: communityDone ? 'completed' : 'available',
      description: communityDone ? 'Completado' : 'Participa en el foro del módulo',
    });

    return activities;
  },

  determinePrimaryAction: (moduleId, activities, nextModuleData) => {
    const state = get();
    const lastVisited = state.lastVisitedLesson;

    if (lastVisited && lastVisited.moduleId === moduleId) {
      const lastAct = activities.find(
        a => a.type === 'lesson' && a.lessonId === lastVisited.lessonId && a.status !== 'completed'
      );
      if (lastAct) return { ...lastAct, actionType: 'resume_lesson' };
    }

    const nextLesson = activities.find(
      a => a.type === 'lesson' && (a.status === 'available' || a.status === 'in-progress')
    );
    if (nextLesson) return { ...nextLesson, actionType: 'next_lesson' };

    const exam = activities.find(a => a.type === 'exam' && a.status === 'available');
    if (exam) {
      const attempts = state.storageGet(`quizAttempts_${moduleId}`, []);
      const failedTopics = new Set();
      if (Array.isArray(attempts)) {
        const modQuestions = MODULE_QUESTIONS[moduleId] || [];
        attempts.forEach(a => {
          if (a.failedQuestions) {
            a.failedQuestions.forEach(qId => {
              const q = modQuestions.find(mq => mq.id === qId);
              if (q) failedTopics.add(q.topic);
            });
          }
        });
      }
      if (failedTopics.size > 0) {
        const topicList = [...failedTopics].slice(0, 2).join(', ');
        return {
          ...exam, actionType: 'review_weak_topics',
          weakTopics: [...failedTopics],
          description: `Revisa primero: ${topicList}${failedTopics.size > 2 ? ` y ${failedTopics.size - 2} más` : ''}`,
        };
      }
      return { ...exam, actionType: 'take_exam' };
    }

    const challenge = activities.find(a => a.type === 'challenge' && a.status === 'available');
    if (challenge) return { ...challenge, actionType: 'take_challenge' };

    const community = activities.find(a => a.type === 'community' && a.status === 'available');
    if (community) return { ...community, actionType: 'community' };

    if (nextModuleData) {
      return {
        actionType: 'next_module',
        nextModuleId: nextModuleData.id,
        title: nextModuleData.title,
        duration: nextModuleData.duration,
        description: nextModuleData.desc || `Tiene ${nextModuleData.totalLessons} lecciones por completar`,
      };
    }

    return { actionType: 'course_complete' };
  },

  getDailyRoute: () => {
    const state = get();
    const { activeMod, moduleProgress, completedModules, xp, streak, courseProgress, lessonProgress } = state;

    const currentModData = modules.find(m => m.id === activeMod);
    const currentLessons = ALL_LESSONS[activeMod] || [];
    const currentLessonProg = lessonProgress[activeMod] || {};
    const completedCount = Object.values(currentLessonProg).filter(s => s === 'completed').length;
    const totalLessons = currentLessons.length;
    const currentActivities = state.generateModuleActivityList(activeMod);

    let nextModData = null;
    for (let i = activeMod + 1; i <= 5; i++) {
      const mp = moduleProgress[i];
      if (mp?.isUnlocked) {
        const modInfo = modules.find(m => m.id === i);
        const lessonP = lessonProgress[i] || {};
        const lessonsDone = Object.values(lessonP).filter(s => s === 'completed').length;
        const totalLess = (ALL_LESSONS[i] || []).length;
        const modScore = state.calculateModuleScore(i);
        if (lessonsDone < totalLess || modScore < 80) {
          nextModData = { ...modInfo, totalLessons: totalLess, completedLessons: lessonsDone };
          break;
        }
      }
    }

    const allModulesComplete = [1, 2, 3, 4, 5].every(id => state.calculateModuleScore(id) >= 80);
    const primaryAction = state.determinePrimaryAction(activeMod, currentActivities, nextModData);

    return {
      currentModule: {
        id: activeMod,
        title: currentModData?.title || `Módulo ${activeMod}`,
        icon: currentModData?.icon || 'fa-book',
        color: currentModData?.color || '#004B63',
        completedLessons: completedCount,
        totalLessons,
        progressPct: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
        moduleScore: state.calculateModuleScore(activeMod),
        isApproved: state.calculateModuleScore(activeMod) >= 80,
        activities: currentActivities,
      },
      nextModule: nextModData && !allModulesComplete ? {
        id: nextModData.id,
        title: nextModData.title,
        icon: nextModData.icon,
        color: nextModData.color,
        completedLessons: nextModData.completedLessons || 0,
        totalLessons: nextModData.totalLessons,
        duration: nextModData.duration,
        level: nextModData.level,
        description: nextModData.desc,
      } : null,
      primaryAction,
      overview: {
        completedModules: completedModules.length,
        totalModules: 5,
        xp,
        streak,
        courseProgress,
        allModulesComplete,
      },
    };
  },

  getWeeklyXP: () => {
    const state = get();
    const xp = state.xp;
    const startDate = state.startDate;
    if (!startDate) return { weekly: xp, weeklyTarget: 500, weeklyPct: Math.min(100, (xp / 500) * 100) };
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const weekStart = start > monday ? start : monday;
    const daysSinceWeekStart = Math.max(0, Math.floor((now - weekStart) / 86400000));
    const dailyAvg = daysSinceWeekStart > 0 ? xp / daysSinceWeekStart : xp;
    const weeklyTarget = 500;
    const weeklyXp = Math.round(xp);
    const weeklyPct = Math.min(100, (weeklyXp / weeklyTarget) * 100);
    return { weekly: weeklyXp, weeklyTarget, weeklyPct, dailyAvg: Math.round(dailyAvg) };
  },

  getModuleDominanceLevel: (moduleId) => {
    const score = get().calculateModuleScore(moduleId);
    if (score >= 80) return { label: 'Experto', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (score >= 50) return { label: 'Avanzado', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    if (score >= 25) return { label: 'Intermedio', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { label: 'Básico', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' };
  },

  getDetailedRecommendations: () => {
    const state = get();
    const weakTopicsByModule = analyzeQuizFailures(state.storageGet);
    return generateRecommendations(state.moduleProgress, state.calculateModuleScore, state.completedExams, state.challengeScores, weakTopicsByModule);
  },
}));
