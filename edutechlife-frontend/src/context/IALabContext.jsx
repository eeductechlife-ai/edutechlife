import React, { createContext, useContext, useCallback, useEffect, useMemo, useRef } from 'react';
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/react';
import { useProgressContext } from './ProgressContext';
import { useNotification } from './NotificationContext';
import { useActivityTracker } from '../hooks/useActivityTracker';
import { moduleContent } from '../components/IALab/constants/moduleContent';
import { supabase } from '../lib/supabase';
import { useIALabStore } from '../store/ialabStore';

const ANALYZING_MSGS = ['Analizando contexto...', 'Aplicando técnicas élite...', 'Optimizando estructura...', 'Generando masterPrompt...'];

const IALabContext = createContext();

export const useIALabContext = () => {
  const context = useContext(IALabContext);
  if (!context) {
    throw new Error('useIALabContext debe usarse dentro de IALabProvider');
  }
  return context;
};

export const IALabProvider = ({ children, onBack }) => {
  const { user: clerkUser } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const { isLoaded: authLoaded } = useClerkAuth();

  // Store selectors granulares (cada uno solo re-renderiza cuando su valor cambia)
  const activeMod = useIALabStore(s => s.activeMod);
  const setActiveMod = useIALabStore(s => s.setActiveMod);
  const activeTab = useIALabStore(s => s.activeTab);
  const setActiveTab = useIALabStore(s => s.setActiveTab);
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
  const showExamModal = useIALabStore(s => s.showExamModal);
  const setShowExamModal = useIALabStore(s => s.setShowExamModal);
  const quizAnswers = useIALabStore(s => s.quizAnswers);
  const setQuizAnswers = useIALabStore(s => s.setQuizAnswers);
  const quizScore = useIALabStore(s => s.quizScore);
  const setQuizScore = useIALabStore(s => s.setQuizScore);
  const quizPassed = useIALabStore(s => s.quizPassed);
  const setQuizPassed = useIALabStore(s => s.setQuizPassed);
  const quizResult = useIALabStore(s => s.quizResult);
  const setQuizResult = useIALabStore(s => s.setQuizResult);
  const showScoreResult = useIALabStore(s => s.showScoreResult);
  const setShowScoreResult = useIALabStore(s => s.setShowScoreResult);
  const dailyAttemptsCount = useIALabStore(s => s.dailyAttemptsCount);
  const setDailyAttemptsCount = useIALabStore(s => s.setDailyAttemptsCount);
  const lastAttemptDate = useIALabStore(s => s.lastAttemptDate);
  const setLastAttemptDate = useIALabStore(s => s.setLastAttemptDate);
  const quizAttempts = useIALabStore(s => s.quizAttempts);
  const setQuizAttempts = useIALabStore(s => s.setQuizAttempts);
  const showExitConfirmation = useIALabStore(s => s.showExitConfirmation);
  const setShowExitConfirmation = useIALabStore(s => s.setShowExitConfirmation);
  const showSecurityWarning = useIALabStore(s => s.showSecurityWarning);
  const setShowSecurityWarning = useIALabStore(s => s.setShowSecurityWarning);
  const securityWarningCount = useIALabStore(s => s.securityWarningCount);
  const setSecurityWarningCount = useIALabStore(s => s.setSecurityWarningCount);
  const screenshotProtectionActive = useIALabStore(s => s.screenshotProtectionActive);
  const setScreenshotProtectionActive = useIALabStore(s => s.setScreenshotProtectionActive);
  const securityViolations = useIALabStore(s => s.securityViolations);
  const setSecurityViolations = useIALabStore(s => s.setSecurityViolations);
  const attemptsPenalized = useIALabStore(s => s.attemptsPenalized);
  const setAttemptsPenalized = useIALabStore(s => s.setAttemptsPenalized);
  const keyboardLockActive = useIALabStore(s => s.keyboardLockActive);
  const setKeyboardLockActive = useIALabStore(s => s.setKeyboardLockActive);
  const showSecurityStatus = useIALabStore(s => s.showSecurityStatus);
  const setShowSecurityStatus = useIALabStore(s => s.setShowSecurityStatus);
  const securityMessage = useIALabStore(s => s.securityMessage);
  const setSecurityMessage = useIALabStore(s => s.setSecurityMessage);
  const showSecurityMessage = useIALabStore(s => s.showSecurityMessage);
  const setShowSecurityMessage = useIALabStore(s => s.setShowSecurityMessage);
  const suggestedTime = useIALabStore(s => s.suggestedTime);
  const timeElapsed = useIALabStore(s => s.timeElapsed);
  const setTimeElapsed = useIALabStore(s => s.setTimeElapsed);
  const isTimerRunning = useIALabStore(s => s.isTimerRunning);
  const setIsTimerRunning = useIALabStore(s => s.setIsTimerRunning);
  const showTimeWarning = useIALabStore(s => s.showTimeWarning);
  const setShowTimeWarning = useIALabStore(s => s.setShowTimeWarning);
  const currentQuestion = useIALabStore(s => s.currentQuestion);
  const setCurrentQuestion = useIALabStore(s => s.setCurrentQuestion);
  const currentPage = useIALabStore(s => s.currentPage);
  const setCurrentPage = useIALabStore(s => s.setCurrentPage);
  const sidebarDropdowns = useIALabStore(s => s.sidebarDropdowns);
  const setSidebarDropdowns = useIALabStore(s => s.setSidebarDropdowns);
  const toggleSidebarDropdown = useIALabStore(s => s.toggleSidebarDropdown);
  const openAccordions = useIALabStore(s => s.openAccordions);
  const setOpenAccordions = useIALabStore(s => s.setOpenAccordions);
  const visibleAccordions = useIALabStore(s => s.visibleAccordions);
  const setVisibleAccordions = useIALabStore(s => s.setVisibleAccordions);
  const insightsExpanded = useIALabStore(s => s.insightsExpanded);
  const setInsightsExpanded = useIALabStore(s => s.setInsightsExpanded);
  const input = useIALabStore(s => s.input);
  const setInput = useIALabStore(s => s.setInput);
  const genData = useIALabStore(s => s.genData);
  const setGenData = useIALabStore(s => s.setGenData);
  const loading = useIALabStore(s => s.loading);
  const setLoading = useIALabStore(s => s.setLoading);
  const loadMsg = useIALabStore(s => s.loadMsg);
  const setLoadMsg = useIALabStore(s => s.setLoadMsg);
  const coachQ = useIALabStore(s => s.coachQ);
  const setCoachQ = useIALabStore(s => s.setCoachQ);
  const coachMsg = useIALabStore(s => s.coachMsg);
  const setCoachMsg = useIALabStore(s => s.setCoachMsg);
  const coachLoad = useIALabStore(s => s.coachLoad);
  const setCoachLoad = useIALabStore(s => s.setCoachLoad);
  const isListening = useIALabStore(s => s.isListening);
  const setIsListening = useIALabStore(s => s.setIsListening);
  const avatarState = useIALabStore(s => s.avatarState);
  const setAvatarState = useIALabStore(s => s.setAvatarState);
  const showValerioDrawer = useIALabStore(s => s.showValerioDrawer);
  const setShowValerioDrawer = useIALabStore(s => s.setShowValerioDrawer);
  const showProfileDropdown = useIALabStore(s => s.showProfileDropdown);
  const setShowProfileDropdown = useIALabStore(s => s.setShowProfileDropdown);
  const showEvaluationTooltip = useIALabStore(s => s.showEvaluationTooltip);
  const setShowEvaluationTooltip = useIALabStore(s => s.setShowEvaluationTooltip);
  const certName = useIALabStore(s => s.certName);
  const setCertName = useIALabStore(s => s.setCertName);
  const showNameModal = useIALabStore(s => s.showNameModal);
  const setShowNameModal = useIALabStore(s => s.setShowNameModal);
  const courseCompleted = useIALabStore(s => s.courseCompleted);
  const setCourseCompleted = useIALabStore(s => s.setCourseCompleted);
  const showCertificateModal = useIALabStore(s => s.showCertificateModal);
  const setShowCertificateModal = useIALabStore(s => s.setShowCertificateModal);
  const storedCertificate = useIALabStore(s => s.storedCertificate);
  const setStoredCertificate = useIALabStore(s => s.setStoredCertificate);
  const certificateGenerating = useIALabStore(s => s.certificateGenerating);
  const setCertificateGenerating = useIALabStore(s => s.setCertificateGenerating);
  const evalAnswers = useIALabStore(s => s.evalAnswers);
  const setEvalAnswers = useIALabStore(s => s.setEvalAnswers);
  const evalSubmitted = useIALabStore(s => s.evalSubmitted);
  const setEvalSubmitted = useIALabStore(s => s.setEvalSubmitted);
  const evalScore = useIALabStore(s => s.evalScore);
  const setEvalScore = useIALabStore(s => s.setEvalScore);
  const currentLessonIndex = useIALabStore(s => s.currentLessonIndex);
  const setCurrentLessonIndex = useIALabStore(s => s.setCurrentLessonIndex);
  const isSynthesizerOpen = useIALabStore(s => s.isSynthesizerOpen);
  const setIsSynthesizerOpen = useIALabStore(s => s.setIsSynthesizerOpen);
  const isMarkingComplete = useIALabStore(s => s.isMarkingComplete);
  const setIsMarkingComplete = useIALabStore(s => s.setIsMarkingComplete);
  const isSubmittingQuiz = useIALabStore(s => s.isSubmittingQuiz);
  const setIsSubmittingQuiz = useIALabStore(s => s.setIsSubmittingQuiz);
  const isQuizValid = useIALabStore(s => s.isQuizValid);
  const setIsQuizValid = useIALabStore(s => s.setIsQuizValid);
  const isStartingChallenge = useIALabStore(s => s.isStartingChallenge);
  const setIsStartingChallenge = useIALabStore(s => s.setIsStartingChallenge);
  const isButtonDisabled = useIALabStore(s => s.isButtonDisabled);
  const setIsButtonDisabled = useIALabStore(s => s.setIsButtonDisabled);
  const isChallengeCompleted = useIALabStore(s => s.isChallengeCompleted);
  const setIsChallengeCompleted = useIALabStore(s => s.setIsChallengeCompleted);
  const challengeScore = useIALabStore(s => s.challengeScore);
  const setChallengeScore = useIALabStore(s => s.setChallengeScore);
  const showPremiumEvaluationModal = useIALabStore(s => s.showPremiumEvaluationModal);
  const setShowPremiumEvaluationModal = useIALabStore(s => s.setShowPremiumEvaluationModal);
  const isTouchDevice = useIALabStore(s => s.isTouchDevice);
  const setIsTouchDevice = useIALabStore(s => s.setIsTouchDevice);
  const isIOS = useIALabStore(s => s.isIOS);
  const setIsIOS = useIALabStore(s => s.setIsIOS);
  const isAndroid = useIALabStore(s => s.isAndroid);
  const setIsAndroid = useIALabStore(s => s.setIsAndroid);
  const modules = useIALabStore(s => s.modules);
  const LAST_MODULE_ID = useIALabStore(s => s.LAST_MODULE_ID);
  const isModuleLocked = useIALabStore(s => s.isModuleLocked);
  const isEvaluationLocked = useIALabStore(s => s.isEvaluationLocked);
  const getCurrentModule = useIALabStore(s => s.getCurrentModule);
  const getBadgesSummary = useIALabStore(s => s.getBadgesSummary);
  const getUserBadges = useIALabStore(s => s.getUserBadges);
  const getLatestQuizAttempt = useIALabStore(s => s.getLatestQuizAttempt);
  const syncStatus = useIALabStore(s => s.syncStatus);
  const isUsingJWT = useIALabStore(s => s.isUsingJWT);
  const userId = useIALabStore(s => s.userId);
  const completedVideos = useIALabStore(s => s.completedVideos);
  const completedExams = useIALabStore(s => s.completedExams);
  const completedInfographics = useIALabStore(s => s.completedInfographics);
  const completedActivities = useIALabStore(s => s.completedActivities);
  const challengeScores = useIALabStore(s => s.challengeScores);
  const xp = useIALabStore(s => s.xp);
  const streak = useIALabStore(s => s.streak);
  const lastActivityDate = useIALabStore(s => s.lastActivityDate);
  const badges = useIALabStore(s => s.badges);
  const lessonProgress = useIALabStore(s => s.lessonProgress);
  const clearProgressFromStorage = useIALabStore(s => s.clearProgressFromStorage);

  const clerkRole = clerkUser?.publicMetadata?.role || 'student';
  const user = useMemo(() => clerkUser ? {
    id: clerkUser.id,
    full_name: clerkUser.fullName || 'Usuario',
    email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
    fullName: clerkUser.fullName,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
    createdAt: clerkUser.createdAt,
    role: clerkRole,
  } : null, [clerkUser, clerkRole]);

  const signOut = async () => {
    await clerkSignOut();
    clearProgressFromStorage();
  };

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
  const { trackActivity, getModuleActivities } = useActivityTracker();

  // Sync ProgressContext → store (store is single source of truth for UI)
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
    persistentCourseProgress, progressSyncStatus, progressIsUsingJWT, progressUserId, clerkRole, progressLoading,
  ]);

  // Auto-sync gamificación a Supabase cuando cambia XP/streak/badges
  const gamificationSyncRef = useRef(null);
  useEffect(() => {
    if (!user?.id || !syncGamificationToSupabase) return;
    clearTimeout(gamificationSyncRef.current);
    gamificationSyncRef.current = setTimeout(() => {
      const s = useIALabStore.getState();
      syncGamificationToSupabase({
        xp: s.xp,
        streak: s.streak,
        lastActivityDate: s.lastActivityDate,
        badges: s.badges,
        lessonProgress: s.lessonProgress,
        checkpointAnswers: s.checkpointAnswers,
        forumPostCount: s.forumPostCount,
        forumCommentCount: s.forumCommentCount,
        startDate: s.startDate,
      });
    }, 2000);
    return () => clearTimeout(gamificationSyncRef.current);
  }, [xp, streak, badges, lessonProgress, user?.id, syncGamificationToSupabase]);

  // Cargar certificado existente al iniciar
  useEffect(() => {
    if (!user?.id) return;
    const loadExistingCert = async () => {
      try {
        const { data } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        if (data) {
          setStoredCertificate(data);
          setCertName(data.cert_name || '');
          setCourseCompleted(true);
        }
      } catch (err) {
        console.error('Error cargando certificado:', err);
      }
    };
    loadExistingCert();
  }, [user?.id]);

  // Función compuesta: actualizar actividad + notificar si se completa el módulo
  const updateModuleActivity = useCallback(async (moduleId, activity, value, score) => {
    const result = useIALabStore.getState().updateModuleActivity(moduleId, activity, value, score);

    // Sincronizar con ProgressContext para persistencia local + Supabase (cross-device)
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
      const moduleName = modules.find(m => m.id === moduleId)?.title || `Modulo ${moduleId}`;
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
    // Sincronizar con ProgressContext para persistencia cross-device
    const mod = moduleProgress[moduleId];
    if (mod?.resourcesCompleted) {
      try { syncMarkActivityComplete(`m${moduleId}_resources`); } catch (e) {}
    }
  }, [moduleProgress, syncMarkActivityComplete]);

  const markCommunityComment = useCallback((moduleId) => {
    useIALabStore.getState().markCommunityComment(moduleId);
  }, []);

  // Verificar completitud del curso
  const checkCourseCompletion = useCallback(() => {
    const s = useIALabStore.getState();
    const modulesApprovedByScore = [1, 2, 3, 4, 5].filter(
      id => s.calculateModuleScore(id) >= 80
    ).length;
    const effectiveModulesCompleted = Math.max(modulesApprovedByScore, s.completedModules.length);
    const examsInContext = Object.values(s.completedExams).filter(v => typeof v === 'number' ? v >= 80 : v).length;
    const examsByScore = [1, 2, 3, 4, 5].filter(
      id => s.moduleProgress[id]?.exam
    ).length;
    const effectiveExamsCompleted = Math.max(examsInContext, examsByScore);
    const progressThreshold = s.courseProgress >= 80;
    const isCompleted = effectiveModulesCompleted >= 5 && progressThreshold;
    s.setCourseCompleted(isCompleted);
    return isCompleted;
  }, []);

  useEffect(() => {
    checkCourseCompletion();
  }, [checkCourseCompletion]);

  // Notificar certificación
  useEffect(() => {
    if (!user?.id) return;
    const s = useIALabStore.getState();
    const isFullyComplete = checkCourseCompletion();
    const hasNotified = localStorage.getItem('ialab_notified_certification');

    if (isFullyComplete && !hasNotified) {
      localStorage.setItem('ialab_notified_certification', 'true');
      createNotification({
        type: 'certificate_earned',
        title: '🎓 ¡Curso Completado y Certificado!',
        message: `Felicitaciones, has aprobado los 5 modulos con ${Math.round(s.courseProgress)}% de progreso general. Tu certificado ya esta disponible para descargar.`,
        metadata: { progress: s.courseProgress, allModulesApproved: true },
      });

      trackActivity({
        moduleId: 0,
        type: 'resource',
        resourceId: 'course_completed',
        title: 'Curso Completado y Certificado',
        score: Math.round(s.courseProgress),
        metadata: { action: 'course_certified', progress: s.courseProgress }
      });
    }
  }, [courseCompleted, user?.id, createNotification, checkCourseCompletion]);

  const backfillRef = useRef(false);
  useEffect(() => {
    if (!user?.id || !completedModules.length || backfillRef.current) return;
    const backfilledKey = `ialab_notifs_backfilled_${user.id}`;
    if (localStorage.getItem(backfilledKey)) return;

    completedModules.forEach(modId => {
      if (modId < 1 || modId > 5) return;
      const moduleName = modules.find(m => m.id === modId)?.title || `Modulo ${modId}`;
      const score = Math.max(calculateModuleScore(modId), 80);
      createNotification({
        type: 'module_complete',
        title: `✅ ${moduleName} Completado`,
        message: `¡Felicitaciones! Aprobaste con ${score}% de calificacion.`,
        metadata: { moduleId: modId, score, backfilled: true },
      });
    });

    backfillRef.current = true;
    localStorage.setItem(backfilledKey, 'true');
  }, [user?.id, completedModules, createNotification]);

  // Notificar al entrar a un nuevo módulo
  const lastModuleNotifiedRef = useRef(0);
  useEffect(() => {
    if (!user?.id || activeMod === 1 || activeMod === lastModuleNotifiedRef.current) return;

    const mod = modules.find(m => m.id === activeMod);
    if (!mod) return;

    const prevModuleId = activeMod - 1;
    const prevScore = calculateModuleScore(prevModuleId);
    const prevPassed = prevScore >= 80;

    let title, message;
    if (prevPassed) {
      title = `🚀 ¡Modulo ${activeMod} desbloqueado!`;
      message = `${mod.title} ya esta disponible. ${prevModuleId < 5 ? `Superaste el modulo anterior con ${prevScore}%. ¡Sigue avanzando!` : '¡Ultimo modulo del curso!'}`;
    } else if (prevModuleId >= 1) {
      title = `📖 ${mod.title}`;
      message = `Explora el contenido de este modulo. Recuerda completar todas las actividades para aprobar.`;
    } else {
      title = `📖 ${mod.title}`;
      message = `Nuevo modulo disponible. Explora los recursos y completa las actividades.`;
    }

    createNotification({
      type: 'course_update',
      title,
      message,
      metadata: { moduleId: activeMod, action: 'module_entered' },
    });

    trackActivity({
      moduleId: activeMod,
      type: 'resource',
      resourceId: `m${activeMod}_module_entered`,
      title: `${mod.title} - Módulo Iniciado`,
      metadata: { action: 'module_started', prevScore }
    });

    lastModuleNotifiedRef.current = activeMod;
  }, [activeMod, user?.id, createNotification, trackActivity, calculateModuleScore]);

  const generateCertificate = useCallback(async (overrideName) => {
    if (!user?.id) {
      console.error('❌ generateCertificate: user.id no disponible');
      return { success: false, error: 'Usuario no autenticado' };
    }

    setCertificateGenerating(true);
    try {
      const existingCert = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingCert.error) {
        console.error('❌ Error buscando certificado existente:', existingCert.error.message);
      }

      if (existingCert.data) {
        setStoredCertificate(existingCert.data);
        setCertificateGenerating(false);
        return existingCert.data;
      }

      const studentName = (overrideName || certName).trim() || user.full_name || 'Estudiante';
      const moduleScores = [1, 2, 3, 4, 5].map(id => calculateModuleScore(id));
      const overallScore = Math.round(moduleScores.reduce((a, b) => a + b, 0) / 5);

      const certData = {
        user_id: user.id,
        cert_name: studentName,
        overall_score: Math.max(overallScore, 80),
        modules_completed: 5
      };

      const { data, error } = await supabase
        .from('certificates')
        .insert(certData)
        .select()
        .single();

      if (error) throw new Error(error.message || 'Error al generar certificado');

      setStoredCertificate(data);
      setCourseCompleted(true);

      await createNotification({
        type: 'certificate_earned',
        title: '🎓 ¡Certificado Generado!',
        message: `Felicitaciones ${studentName}, has completado el curso con ${Math.max(overallScore, 80)}% de calificacion. Tu certificado ya esta disponible.`,
        metadata: { score: Math.max(overallScore, 80), certId: data.id, studentName },
      });

      await trackActivity({
        moduleId: 0,
        type: 'resource',
        resourceId: `certificate_${data.id}`,
        title: `Certificado Generado - ${studentName}`,
        score: Math.max(overallScore, 80),
        metadata: { action: 'certificate_generated', certId: data.id, studentName }
      });

      return data;
    } catch (err) {
      console.error('❌ Error generando certificado:', err);
      return { success: false, error: err.message || 'Error desconocido' };
    } finally {
      setCertificateGenerating(false);
    }
  }, [user, createNotification, trackActivity, certName]);

  // Lecciones del módulo
  const moduleLessons = useMemo(() => {
    if (activeMod === 1) return useIALabStore.getState().module1Lessons;
    return moduleContent[activeMod]?.lessons || [];
  }, [activeMod]);

  const msgs = ANALYZING_MSGS;

  const contextValue = useMemo(() => {
    const $ = useIALabStore.getState();
    return {
      activeMod: $.activeMod,
      setActiveMod: $.setActiveMod,
      activeTab: $.activeTab,
      setActiveTab: $.setActiveTab,
      completedModules,
      setCompletedModules: setPersistentCompletedModules,
      courseProgress: $.courseProgress,
      setCourseProgress: setPersistentCourseProgress,
      visitedModules: $.visitedModules,
      setVisitedModules: $.setVisitedModules,
      isLoadingProgress: $.isLoadingProgress,
      setIsLoadingProgress: $.setIsLoadingProgress,

      moduleProgress,
      calculateModuleScore: $.calculateModuleScore,
      calculateModulePoints: $.calculateModulePoints,
      getTotalPoints: $.getTotalPoints,
      getMemoizedModuleScore: $.getMemoizedModuleScore,
      getMemoizedGlobalProgress: $.getMemoizedGlobalProgress,
      calculateGlobalProgress: $.calculateGlobalProgress,
      updateModuleActivity,
      markResourceAsViewed,
      markCommunityComment,

      showExamModal: $.showExamModal,
      setShowExamModal: $.setShowExamModal,
      quizAnswers: $.quizAnswers,
      setQuizAnswers: $.setQuizAnswers,
      quizScore: $.quizScore,
      setQuizScore: $.setQuizScore,
      quizPassed: $.quizPassed,
      setQuizPassed: $.setQuizPassed,
      quizResult: $.quizResult,
      setQuizResult: $.setQuizResult,
      showScoreResult: $.showScoreResult,
      setShowScoreResult: $.setShowScoreResult,
      dailyAttemptsCount: $.dailyAttemptsCount,
      setDailyAttemptsCount: $.setDailyAttemptsCount,
      lastAttemptDate: $.lastAttemptDate,
      setLastAttemptDate: $.setLastAttemptDate,
      quizAttempts: $.quizAttempts,
      setQuizAttempts: $.setQuizAttempts,

      showExitConfirmation: $.showExitConfirmation,
      setShowExitConfirmation: $.setShowExitConfirmation,
      showSecurityWarning: $.showSecurityWarning,
      setShowSecurityWarning: $.setShowSecurityWarning,
      securityWarningCount: $.securityWarningCount,
      setSecurityWarningCount: $.setSecurityWarningCount,
      screenshotProtectionActive: $.screenshotProtectionActive,
      setScreenshotProtectionActive: $.setScreenshotProtectionActive,
      securityViolations: $.securityViolations,
      setSecurityViolations: $.setSecurityViolations,
      attemptsPenalized: $.attemptsPenalized,
      setAttemptsPenalized: $.setAttemptsPenalized,
      keyboardLockActive: $.keyboardLockActive,
      setKeyboardLockActive: $.setKeyboardLockActive,
      showSecurityStatus: $.showSecurityStatus,
      setShowSecurityStatus: $.setShowSecurityStatus,
      securityMessage: $.securityMessage,
      setSecurityMessage: $.setSecurityMessage,
      showSecurityMessage: $.showSecurityMessage,
      setShowSecurityMessage: $.setShowSecurityMessage,

      suggestedTime: $.suggestedTime,
      timeElapsed: $.timeElapsed,
      setTimeElapsed: $.setTimeElapsed,
      isTimerRunning: $.isTimerRunning,
      setIsTimerRunning: $.setIsTimerRunning,
      showTimeWarning: $.showTimeWarning,
      setShowTimeWarning: $.setShowTimeWarning,

      currentQuestion: $.currentQuestion,
      setCurrentQuestion: $.setCurrentQuestion,
      currentPage: $.currentPage,
      setCurrentPage: $.setCurrentPage,

      sidebarDropdowns: $.sidebarDropdowns,
      setSidebarDropdowns: $.setSidebarDropdowns,
      toggleSidebarDropdown: $.toggleSidebarDropdown,

      openAccordions: $.openAccordions,
      setOpenAccordions: $.setOpenAccordions,
      visibleAccordions: $.visibleAccordions,
      setVisibleAccordions: $.setVisibleAccordions,

      insightsExpanded: $.insightsExpanded,
      setInsightsExpanded: $.setInsightsExpanded,

      input: $.input,
      setInput: $.setInput,
      genData: $.genData,
      setGenData: $.setGenData,
      loading: $.loading,
      setLoading: $.setLoading,
      loadMsg: $.loadMsg,
      setLoadMsg: $.setLoadMsg,

      coachQ: $.coachQ,
      setCoachQ: $.setCoachQ,
      coachMsg: $.coachMsg,
      setCoachMsg: $.setCoachMsg,
      coachLoad: $.coachLoad,
      setCoachLoad: $.setCoachLoad,
      isListening: $.isListening,
      setIsListening: $.setIsListening,
      avatarState: $.avatarState,
      setAvatarState: $.setAvatarState,
      showValerioDrawer: $.showValerioDrawer,
      setShowValerioDrawer: $.setShowValerioDrawer,

      showProfileDropdown: $.showProfileDropdown,
      setShowProfileDropdown: $.setShowProfileDropdown,
      showEvaluationTooltip: $.showEvaluationTooltip,
      setShowEvaluationTooltip: $.setShowEvaluationTooltip,

      certName,
      setCertName: $.setCertName,
      showNameModal: $.showNameModal,
      setShowNameModal: $.setShowNameModal,
      courseCompleted: $.courseCompleted,
      setCourseCompleted: $.setCourseCompleted,
      showCertificateModal: $.showCertificateModal,
      setShowCertificateModal: $.setShowCertificateModal,
      storedCertificate: $.storedCertificate,
      setStoredCertificate: $.setStoredCertificate,
      certificateGenerating: $.certificateGenerating,
      checkCourseCompletion,
      generateCertificate,

      evalAnswers: $.evalAnswers,
      setEvalAnswers: $.setEvalAnswers,
      evalSubmitted: $.evalSubmitted,
      setEvalSubmitted: $.setEvalSubmitted,
      evalScore: $.evalScore,
      setEvalScore: $.setEvalScore,

      currentLessonIndex: $.currentLessonIndex,
      setCurrentLessonIndex: $.setCurrentLessonIndex,
      isSynthesizerOpen: $.isSynthesizerOpen,
      setIsSynthesizerOpen: $.setIsSynthesizerOpen,
      isMarkingComplete: $.isMarkingComplete,
      setIsMarkingComplete: $.setIsMarkingComplete,
      isSubmittingQuiz: $.isSubmittingQuiz,
      setIsSubmittingQuiz: $.setIsSubmittingQuiz,
      isQuizValid: $.isQuizValid,
      setIsQuizValid: $.setIsQuizValid,

      isStartingChallenge: $.isStartingChallenge,
      setIsStartingChallenge: $.setIsStartingChallenge,
      isButtonDisabled: $.isButtonDisabled,
      setIsButtonDisabled: $.setIsButtonDisabled,
      isChallengeCompleted: $.isChallengeCompleted,
      setIsChallengeCompleted: $.setIsChallengeCompleted,
      challengeScore: $.challengeScore,
      setChallengeScore: $.setChallengeScore,

      showPremiumEvaluationModal: $.showPremiumEvaluationModal,
      setShowPremiumEvaluationModal: $.setShowPremiumEvaluationModal,

      isTouchDevice: $.isTouchDevice,
      setIsTouchDevice: $.setIsTouchDevice,
      isIOS: $.isIOS,
      setIsIOS: $.setIsIOS,
      isAndroid: $.isAndroid,
      setIsAndroid: $.setIsAndroid,

      modules,
      LAST_MODULE_ID: $.LAST_MODULE_ID,
      moduleLessons,
      moduleContent,
      msgs,

      isModuleLocked: (id) => $.isModuleLocked(id),
      isEvaluationLocked: (id) => $.isEvaluationLocked(id),
      getCurrentModule: () => $.getCurrentModule(),
      getBadgesSummary: () => $.getBadgesSummary(),
      getUserBadges: () => $.getUserBadges(),
      getLatestQuizAttempt: () => $.getLatestQuizAttempt(),

      syncStatus: $.syncStatus,
      isUsingJWT: $.isUsingJWT,
      userId: $.userId,
      completedVideos: $.completedVideos,
      completedExams,
      completedInfographics: $.completedInfographics,
      completedActivities: $.completedActivities,
      challengeScores: $.challengeScores,
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

      user,
      isLoaded: authLoaded,
      signOut,
      onBack,
    };
  }, [
    activeMod, courseProgress, completedModules, visitedModules,
    isLoadingProgress, moduleProgress, showExamModal, quizAnswers,
    quizScore, quizPassed, quizResult, showScoreResult,
    dailyAttemptsCount, lastAttemptDate, quizAttempts,
    showExitConfirmation, showSecurityWarning, securityWarningCount,
    screenshotProtectionActive, securityViolations, attemptsPenalized,
    keyboardLockActive, showSecurityStatus, securityMessage, showSecurityMessage,
    suggestedTime, timeElapsed, isTimerRunning, showTimeWarning,
    currentQuestion, currentPage,
    sidebarDropdowns, openAccordions, visibleAccordions,
    insightsExpanded, input, genData, loading, loadMsg,
    coachQ, coachMsg, coachLoad, isListening, avatarState, showValerioDrawer,
    showProfileDropdown, showEvaluationTooltip,
    certName, showNameModal, courseCompleted, showCertificateModal,
    storedCertificate, certificateGenerating,
    evalAnswers, evalSubmitted, evalScore,
    currentLessonIndex, isSynthesizerOpen, isMarkingComplete, isSubmittingQuiz, isQuizValid,
    isStartingChallenge, isButtonDisabled, isChallengeCompleted, challengeScore,
    showPremiumEvaluationModal, isTouchDevice, isIOS, isAndroid,
    modules, LAST_MODULE_ID,
    syncStatus, isUsingJWT, userId, completedVideos, completedExams,
    completedInfographics, completedActivities, challengeScores,
    user, authLoaded, signOut, onBack,
    moduleLessons, moduleContent, msgs,
    setPersistentCompletedModules, setPersistentCourseProgress,
    updateModuleActivity, markResourceAsViewed, markCommunityComment,
    checkCourseCompletion, generateCertificate,
    syncMarkVideoComplete, syncMarkModuleComplete, syncMarkExamComplete,
    syncMarkInfographicComplete, syncMarkActivityComplete, syncMarkChallengeComplete,
    syncMarkCommunityComplete, refreshProgress, recordLastTopic,
    completedCommunity,
  ]);

  return (
    <IALabContext.Provider value={contextValue}>
      {children}
    </IALabContext.Provider>
  );
};
