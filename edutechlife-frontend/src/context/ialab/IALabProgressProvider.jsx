import { createContext, useContext, useCallback, useEffect, useMemo, useRef } from 'react';
import { useUser } from '@clerk/react';
import { useProgressContext } from '../ProgressContext';
import { useNotification } from '../NotificationContext';
import { useActivityTracker } from '../../hooks/useActivityTracker';
import { moduleContent } from '../../components/IALab/constants/moduleContent';
import { modules as STATIC_MODULES, ALL_LESSONS } from '@/data/ialab';
import { LAST_MODULE_ID } from '@/constants/ialab';
import { useIALabStore } from '../../store/ialabStore';

export const IALabProgressContext = createContext(null);

export const useIALabProgressContext = () => {
  const ctx = useContext(IALabProgressContext);
  if (!ctx) {
    throw new Error('useIALabProgressContext debe usarse dentro de IALabProgressProvider');
  }
  return ctx;
};

export function IALabProgressProvider({ children }) {
  const { user: clerkUser } = useUser();
  const clerkRole = clerkUser?.publicMetadata?.role || 'student';

  const activeMod = useIALabStore(s => s.activeMod);
  const setActiveMod = useIALabStore(s => s.setActiveMod);
  const completedModules = useIALabStore(s => s.completedModules);
  const courseProgress = useIALabStore(s => s.courseProgress);
  const visitedModules = useIALabStore(s => s.visitedModules);
  const setVisitedModules = useIALabStore(s => s.setVisitedModules);
  const isLoadingProgress = useIALabStore(s => s.isLoadingProgress);
  const setIsLoadingProgress = useIALabStore(s => s.setIsLoadingProgress);
  const moduleProgress = useIALabStore(s => s.moduleProgress);
  const calculateModuleScore = useIALabStore(s => s.calculateModuleScore);
  const calculateModulePoints = useIALabStore(s => s.calculateModulePoints);
  const getTotalPoints = useIALabStore(s => s.getTotalPoints);
  const getMemoizedModuleScore = useIALabStore(s => s.getMemoizedModuleScore);
  const getMemoizedGlobalProgress = useIALabStore(s => s.getMemoizedGlobalProgress);
  const calculateGlobalProgress = useIALabStore(s => s.calculateGlobalProgress);
  const isModuleLocked = useIALabStore(s => s.isModuleLocked);
  const isEvaluationLocked = useIALabStore(s => s.isEvaluationLocked);
  const getCurrentModule = useIALabStore(s => s.getCurrentModule);
  const completedVideos = useIALabStore(s => s.completedVideos);
  const completedExams = useIALabStore(s => s.completedExams);
  const completedInfographics = useIALabStore(s => s.completedInfographics);
  const completedActivities = useIALabStore(s => s.completedActivities);
  const challengeScores = useIALabStore(s => s.challengeScores);
  const syncStatus = useIALabStore(s => s.syncStatus);
  const isUsingJWT = useIALabStore(s => s.isUsingJWT);
  const userId = useIALabStore(s => s.userId);

  const {
    courseProgress: persistentCourseProgress,
    gamification: remoteGamification,
    completedModules: persistentCompletedModules,
    completedVideos: progressCompletedVideos,
    completedExams: progressCompletedExams,
    completedInfographics: progressCompletedInfographics,
    completedActivities: progressCompletedActivities,
    challengeScores: progressChallengeScores,
    completedCommunity,
    isLoading: progressLoading,
    syncStatus: progressSyncStatus,
    isUsingJWT: progressIsUsingJWT,
    userId: progressUserId,
    markVideoComplete: syncMarkVideoComplete,
    markModuleComplete: syncMarkModuleComplete,
    markExamComplete: syncMarkExamComplete,
    markInfographicComplete: syncMarkInfographicComplete,
    markActivityComplete: syncMarkActivityComplete,
    markChallengeComplete: syncMarkChallengeComplete,
    markCommunityComplete: syncMarkCommunityComplete,
    refreshProgress,
    syncGamification: syncGamificationToSupabase,
    setCompletedModules: setPersistentCompletedModules,
    setCourseProgress: setPersistentCourseProgress,
    recordLastTopic,
  } = useProgressContext();

  const { createNotification } = useNotification();
  const { trackActivity } = useActivityTracker();

  useEffect(() => {
    useIALabStore.getState().syncFromPersistence({
      completedModules: persistentCompletedModules,
      completedVideos: progressCompletedVideos,
      completedExams: progressCompletedExams,
      completedInfographics: progressCompletedInfographics,
      completedActivities: progressCompletedActivities,
      challengeScores: progressChallengeScores,
      courseProgress: persistentCourseProgress,
      gamification: remoteGamification,
      syncStatus: progressSyncStatus,
      isUsingJWT: progressIsUsingJWT,
      userId: progressUserId,
      userRole: clerkRole,
      isLoading: progressLoading,
    });
  }, [
    persistentCompletedModules, progressCompletedVideos, progressCompletedExams,
    progressCompletedInfographics, progressCompletedActivities, progressChallengeScores,
    persistentCourseProgress, progressSyncStatus, progressIsUsingJWT, progressUserId,
    clerkRole, progressLoading,
  ]);

  const updateModuleActivity = useCallback(async (moduleId, activity, value, score) => {
    const result = useIALabStore.getState().updateModuleActivity(moduleId, activity, value, score);

    switch (activity) {
      case 'exam':
        if (typeof score === 'number') {
          try { syncMarkExamComplete(moduleId, score); } catch (e) {}
        }
        break;
      case 'challenge':
        if (typeof score === 'number' && score >= 80) {
          try { syncMarkChallengeComplete(moduleId, score); } catch (e) {}
        }
        break;
      case 'community':
        if (value) {
          try { syncMarkCommunityComplete(moduleId); } catch (e) {}
        }
        break;
      case 'resourcesCompleted':
        if (value) {
          try { syncMarkActivityComplete(`m${moduleId}_resources`); } catch (e) {}
        }
        break;
    }

    if (result?.justCompleted) {
      const moduleName = STATIC_MODULES.find(m => m.id === moduleId)?.title || `Modulo ${moduleId}`;
      await createNotification({
        type: 'module_complete',
        title: `✅ ${moduleName} Completado`,
        message: `¡Felicitaciones! Completaste el módulo con ${result.newScore}% de nota general. ${moduleId < 5 ? 'El siguiente modulo ya esta desbloqueado.' : '¡Has completado todos los modulos!'}`,
        metadata: { moduleId, score: result.newScore },
      });

      await trackActivity({
        moduleId,
        type: 'resource',
        resourceId: `m${moduleId}_module_complete`,
        title: `${moduleName} - Módulo Completado`,
        score: result.newScore,
        metadata: { action: 'module_approved', score: result.newScore }
      });
    }
  }, [createNotification, trackActivity, syncMarkExamComplete, syncMarkChallengeComplete, syncMarkCommunityComplete, syncMarkActivityComplete]);

  const markResourceAsViewed = useCallback((moduleId, resourceId) => {
    useIALabStore.getState().markResourceAsViewed(moduleId, resourceId);
    if (resourceId) useIALabStore.getState().addViewedResource(resourceId);
    const mod = moduleProgress[moduleId];
    if (mod?.resourcesCompleted) {
      try { syncMarkActivityComplete(`m${moduleId}_resources`); } catch (e) {}
    }
  }, [moduleProgress, syncMarkActivityComplete]);

  const markCommunityComment = useCallback((moduleId) => {
    useIALabStore.getState().markCommunityComment(moduleId);
  }, []);

  const checkCourseCompletion = useCallback(() => {
    return useIALabStore.getState().checkCourseCompletion();
  }, []);

  useEffect(() => {
    checkCourseCompletion();
  }, [checkCourseCompletion]);

  const moduleLessons = useMemo(() => {
    if (activeMod === 1) return ALL_LESSONS[1];
    return moduleContent[activeMod]?.lessons || [];
  }, [activeMod]);

  const contextValue = useMemo(() => ({
    activeMod,
    setActiveMod,
    completedModules,
    setCompletedModules: setPersistentCompletedModules,
    courseProgress,
    setCourseProgress: setPersistentCourseProgress,
    visitedModules,
    setVisitedModules,
    isLoadingProgress,
    setIsLoadingProgress,
    moduleProgress,
    calculateModuleScore,
    calculateModulePoints,
    getTotalPoints,
    getMemoizedModuleScore,
    getMemoizedGlobalProgress,
    calculateGlobalProgress,
    updateModuleActivity,
    markResourceAsViewed,
    markCommunityComment,
    modules: STATIC_MODULES,
    LAST_MODULE_ID,
    moduleLessons,
    moduleContent,
    isModuleLocked,
    isEvaluationLocked,
    getCurrentModule,
    syncStatus,
    isUsingJWT,
    userId,
    completedVideos,
    completedExams,
    completedInfographics,
    completedActivities,
    challengeScores,
    completedCommunity,
    markVideoComplete: syncMarkVideoComplete,
    markModuleComplete: syncMarkModuleComplete,
    markExamComplete: syncMarkExamComplete,
    markInfographicComplete: syncMarkInfographicComplete,
    markActivityComplete: syncMarkActivityComplete,
    markChallengeComplete: syncMarkChallengeComplete,
    markCommunityComplete: syncMarkCommunityComplete,
    refreshProgress,
    recordLastTopic,
    checkCourseCompletion,
  }), [
    activeMod, courseProgress, completedModules, visitedModules, isLoadingProgress,
    moduleProgress, completedVideos, completedExams, completedInfographics,
    completedActivities, challengeScores, syncStatus, isUsingJWT, userId,
    completedCommunity, moduleLessons, moduleContent,
    syncMarkVideoComplete, syncMarkModuleComplete, syncMarkExamComplete,
    syncMarkInfographicComplete, syncMarkActivityComplete, syncMarkChallengeComplete,
    syncMarkCommunityComplete, refreshProgress, recordLastTopic,
    updateModuleActivity, markResourceAsViewed, markCommunityComment,
    checkCourseCompletion,
  ]);

  return (
    <IALabProgressContext.Provider value={contextValue}>
      {children}
    </IALabProgressContext.Provider>
  );
}
