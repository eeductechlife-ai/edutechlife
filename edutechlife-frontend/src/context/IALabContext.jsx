import React, { createContext, useContext, useCallback, useEffect, useMemo, useRef } from 'react';
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/react';
import { useProgressContext } from './ProgressContext';
import { useNotification } from './NotificationContext';
import { useActivityTracker } from '../hooks/useActivityTracker';
import { moduleContent } from '../components/IALab/constants/moduleContent';
import { supabase } from '../lib/supabase';
import { useIALabStore } from '../store/ialabStore';

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

  // Store selectors (single source of truth)
  const store = useIALabStore();

  const user = clerkUser ? {
    id: clerkUser.id,
    full_name: clerkUser.fullName || 'Usuario',
    email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
    fullName: clerkUser.fullName,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
    createdAt: clerkUser.createdAt,
  } : null;

  const signOut = async () => {
    await clerkSignOut();
    store.clearProgressFromStorage();
  };

  const {
    courseProgress: persistentCourseProgress,
    completedModules: persistentCompletedModules,
    completedVideos,
    completedExams,
    completedInfographics,
    completedActivities,
    challengeScores,
    completedCommunity,
    isLoading: progressLoading,
    syncStatus,
    isUsingJWT,
    userId: progressUserId,
    markVideoComplete: syncMarkVideoComplete,
    markModuleComplete: syncMarkModuleComplete,
    markExamComplete: syncMarkExamComplete,
    markInfographicComplete: syncMarkInfographicComplete,
    markActivityComplete: syncMarkActivityComplete,
    markChallengeComplete: syncMarkChallengeComplete,
    markCommunityComplete: syncMarkCommunityComplete,
    refreshProgress,
    setCompletedModules: setPersistentCompletedModules,
    setCourseProgress: setPersistentCourseProgress,
    recordLastTopic,
  } = useProgressContext();

  const { createNotification } = useNotification();
  const { trackActivity, getModuleActivities } = useActivityTracker();

  // Sync ProgressContext → store (store is single source of truth for UI)
  useEffect(() => {
    store.syncFromPersistence({
      completedModules: persistentCompletedModules,
      completedVideos,
      completedExams,
      completedInfographics,
      completedActivities,
      challengeScores,
      courseProgress: persistentCourseProgress,
      syncStatus,
      isUsingJWT,
      userId: progressUserId,
      isLoading: progressLoading,
    });
  }, [
    persistentCompletedModules, completedVideos, completedExams,
    completedInfographics, completedActivities, challengeScores,
    persistentCourseProgress, syncStatus, isUsingJWT, progressUserId, progressLoading,
  ]);

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
          store.setStoredCertificate(data);
          store.setCertName(data.cert_name || '');
          store.setCourseCompleted(true);
        }
      } catch (err) {
        console.error('Error cargando certificado:', err);
      }
    };
    loadExistingCert();
  }, [user?.id]);

  // Función compuesta: actualizar actividad + notificar si se completa el módulo
  const updateModuleActivity = useCallback(async (moduleId, activity, value, score) => {
    const result = store.updateModuleActivity(moduleId, activity, value, score);

    if (result?.justCompleted) {
      const moduleName = store.modules.find(m => m.id === moduleId)?.title || `Modulo ${moduleId}`;
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
  }, [createNotification, trackActivity]);

  const markResourceAsViewed = useCallback((moduleId, resourceId) => {
    store.markResourceAsViewed(moduleId, resourceId);
    if (resourceId) store.addViewedResource(resourceId);
  }, []);

  const markCommunityComment = useCallback((moduleId) => {
    store.markCommunityComment(moduleId);
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
  }, [store.courseCompleted, user?.id, createNotification, checkCourseCompletion]);

  const backfillRef = useRef(false);
  useEffect(() => {
    if (!user?.id || !store.completedModules.length || backfillRef.current) return;
    const backfilledKey = `ialab_notifs_backfilled_${user.id}`;
    if (localStorage.getItem(backfilledKey)) return;

    store.completedModules.forEach(modId => {
      if (modId < 1 || modId > 5) return;
      const moduleName = store.modules.find(m => m.id === modId)?.title || `Modulo ${modId}`;
      const score = Math.max(store.calculateModuleScore(modId), 80);
      createNotification({
        type: 'module_complete',
        title: `✅ ${moduleName} Completado`,
        message: `¡Felicitaciones! Aprobaste con ${score}% de calificacion.`,
        metadata: { moduleId: modId, score, backfilled: true },
      });
    });

    backfillRef.current = true;
    localStorage.setItem(backfilledKey, 'true');
  }, [user?.id, store.completedModules, createNotification]);

  // Notificar al entrar a un nuevo módulo
  const lastModuleNotifiedRef = useRef(0);
  useEffect(() => {
    if (!user?.id || store.activeMod === 1 || store.activeMod === lastModuleNotifiedRef.current) return;

    const mod = store.modules.find(m => m.id === store.activeMod);
    if (!mod) return;

    const prevModuleId = store.activeMod - 1;
    const prevScore = store.calculateModuleScore(prevModuleId);
    const prevPassed = prevScore >= 80;

    let title, message;
    if (prevPassed) {
      title = `🚀 ¡Modulo ${store.activeMod} desbloqueado!`;
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
      metadata: { moduleId: store.activeMod, action: 'module_entered' },
    });

    trackActivity({
      moduleId: store.activeMod,
      type: 'resource',
      resourceId: `m${store.activeMod}_module_entered`,
      title: `${mod.title} - Módulo Iniciado`,
      metadata: { action: 'module_started', prevScore }
    });

    lastModuleNotifiedRef.current = store.activeMod;
  }, [store.activeMod, user?.id, createNotification, store, trackActivity]);

  const generateCertificate = useCallback(async (overrideName) => {
    if (!user?.id) {
      console.error('❌ generateCertificate: user.id no disponible');
      return { success: false, error: 'Usuario no autenticado' };
    }

    store.setCertificateGenerating(true);
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
        store.setStoredCertificate(existingCert.data);
        store.setCertificateGenerating(false);
        return existingCert.data;
      }

      const studentName = (overrideName || store.certName).trim() || user.full_name || 'Estudiante';
      const moduleScores = [1, 2, 3, 4, 5].map(id => store.calculateModuleScore(id));
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

      store.setStoredCertificate(data);
      store.setCourseCompleted(true);

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
      store.setCertificateGenerating(false);
    }
  }, [user, createNotification, trackActivity, store]);

  // Lecciones del módulo
  const moduleLessons = useMemo(() => {
    if (store.activeMod === 1) return store.module1Lessons;
    return moduleContent[store.activeMod]?.lessons || [];
  }, [store.activeMod]);

  const msgs = ['Analizando contexto...', 'Aplicando técnicas élite...', 'Optimizando estructura...', 'Generando masterPrompt...'];

  const contextValue = {
    activeMod: store.activeMod,
    setActiveMod: store.setActiveMod,
    activeTab: store.activeTab,
    setActiveTab: store.setActiveTab,
    completedModules: store.completedModules,
    setCompletedModules: setPersistentCompletedModules,
    courseProgress: store.courseProgress,
    setCourseProgress: setPersistentCourseProgress,
    visitedModules: store.visitedModules,
    setVisitedModules: store.setVisitedModules,
    isLoadingProgress: store.isLoadingProgress,
    setIsLoadingProgress: store.setIsLoadingProgress,

    moduleProgress: store.moduleProgress,
    calculateModuleScore: store.calculateModuleScore,
    calculateModulePoints: store.calculateModulePoints,
    getTotalPoints: store.getTotalPoints,
    getMemoizedModuleScore: store.getMemoizedModuleScore,
    getMemoizedGlobalProgress: store.getMemoizedGlobalProgress,
    calculateGlobalProgress: store.calculateGlobalProgress,
    updateModuleActivity,
    markResourceAsViewed,
    markCommunityComment,

    showExamModal: store.showExamModal,
    setShowExamModal: store.setShowExamModal,
    quizAnswers: store.quizAnswers,
    setQuizAnswers: store.setQuizAnswers,
    quizScore: store.quizScore,
    setQuizScore: store.setQuizScore,
    quizPassed: store.quizPassed,
    setQuizPassed: store.setQuizPassed,
    quizResult: store.quizResult,
    setQuizResult: store.setQuizResult,
    showScoreResult: store.showScoreResult,
    setShowScoreResult: store.setShowScoreResult,
    dailyAttemptsCount: store.dailyAttemptsCount,
    setDailyAttemptsCount: store.setDailyAttemptsCount,
    lastAttemptDate: store.lastAttemptDate,
    setLastAttemptDate: store.setLastAttemptDate,
    quizAttempts: store.quizAttempts,
    setQuizAttempts: store.setQuizAttempts,

    showExitConfirmation: store.showExitConfirmation,
    setShowExitConfirmation: store.setShowExitConfirmation,
    showSecurityWarning: store.showSecurityWarning,
    setShowSecurityWarning: store.setShowSecurityWarning,
    securityWarningCount: store.securityWarningCount,
    setSecurityWarningCount: store.setSecurityWarningCount,
    screenshotProtectionActive: store.screenshotProtectionActive,
    setScreenshotProtectionActive: store.setScreenshotProtectionActive,
    securityViolations: store.securityViolations,
    setSecurityViolations: store.setSecurityViolations,
    attemptsPenalized: store.attemptsPenalized,
    setAttemptsPenalized: store.setAttemptsPenalized,
    keyboardLockActive: store.keyboardLockActive,
    setKeyboardLockActive: store.setKeyboardLockActive,
    showSecurityStatus: store.showSecurityStatus,
    setShowSecurityStatus: store.setShowSecurityStatus,
    securityMessage: store.securityMessage,
    setSecurityMessage: store.setSecurityMessage,
    showSecurityMessage: store.showSecurityMessage,
    setShowSecurityMessage: store.setShowSecurityMessage,

    suggestedTime: store.suggestedTime,
    timeElapsed: store.timeElapsed,
    setTimeElapsed: store.setTimeElapsed,
    isTimerRunning: store.isTimerRunning,
    setIsTimerRunning: store.setIsTimerRunning,
    showTimeWarning: store.showTimeWarning,
    setShowTimeWarning: store.setShowTimeWarning,

    currentQuestion: store.currentQuestion,
    setCurrentQuestion: store.setCurrentQuestion,
    currentPage: store.currentPage,
    setCurrentPage: store.setCurrentPage,

    sidebarDropdowns: store.sidebarDropdowns,
    setSidebarDropdowns: store.setSidebarDropdowns,
    toggleSidebarDropdown: store.toggleSidebarDropdown,

    openAccordions: store.openAccordions,
    setOpenAccordions: store.setOpenAccordions,
    visibleAccordions: store.visibleAccordions,
    setVisibleAccordions: store.setVisibleAccordions,

    insightsExpanded: store.insightsExpanded,
    setInsightsExpanded: store.setInsightsExpanded,

    input: store.input,
    setInput: store.setInput,
    genData: store.genData,
    setGenData: store.setGenData,
    loading: store.loading,
    setLoading: store.setLoading,
    loadMsg: store.loadMsg,
    setLoadMsg: store.setLoadMsg,

    coachQ: store.coachQ,
    setCoachQ: store.setCoachQ,
    coachMsg: store.coachMsg,
    setCoachMsg: store.setCoachMsg,
    coachLoad: store.coachLoad,
    setCoachLoad: store.setCoachLoad,
    isListening: store.isListening,
    setIsListening: store.setIsListening,
    avatarState: store.avatarState,
    setAvatarState: store.setAvatarState,
    showValerioDrawer: store.showValerioDrawer,
    setShowValerioDrawer: store.setShowValerioDrawer,

    showProfileDropdown: store.showProfileDropdown,
    setShowProfileDropdown: store.setShowProfileDropdown,
    showEvaluationTooltip: store.showEvaluationTooltip,
    setShowEvaluationTooltip: store.setShowEvaluationTooltip,

    certName: store.certName,
    setCertName: store.setCertName,
    showNameModal: store.showNameModal,
    setShowNameModal: store.setShowNameModal,
    courseCompleted: store.courseCompleted,
    setCourseCompleted: store.setCourseCompleted,
    showCertificateModal: store.showCertificateModal,
    setShowCertificateModal: store.setShowCertificateModal,
    storedCertificate: store.storedCertificate,
    setStoredCertificate: store.setStoredCertificate,
    certificateGenerating: store.certificateGenerating,
    checkCourseCompletion,
    generateCertificate,

    evalAnswers: store.evalAnswers,
    setEvalAnswers: store.setEvalAnswers,
    evalSubmitted: store.evalSubmitted,
    setEvalSubmitted: store.setEvalSubmitted,
    evalScore: store.evalScore,
    setEvalScore: store.setEvalScore,

    currentLessonIndex: store.currentLessonIndex,
    setCurrentLessonIndex: store.setCurrentLessonIndex,
    isSynthesizerOpen: store.isSynthesizerOpen,
    setIsSynthesizerOpen: store.setIsSynthesizerOpen,
    isMarkingComplete: store.isMarkingComplete,
    setIsMarkingComplete: store.setIsMarkingComplete,
    isSubmittingQuiz: store.isSubmittingQuiz,
    setIsSubmittingQuiz: store.setIsSubmittingQuiz,
    isQuizValid: store.isQuizValid,
    setIsQuizValid: store.setIsQuizValid,

    isStartingChallenge: store.isStartingChallenge,
    setIsStartingChallenge: store.setIsStartingChallenge,
    isButtonDisabled: store.isButtonDisabled,
    setIsButtonDisabled: store.setIsButtonDisabled,
    isChallengeCompleted: store.isChallengeCompleted,
    setIsChallengeCompleted: store.setIsChallengeCompleted,
    challengeScore: store.challengeScore,
    setChallengeScore: store.setChallengeScore,

    showPremiumEvaluationModal: store.showPremiumEvaluationModal,
    setShowPremiumEvaluationModal: store.setShowPremiumEvaluationModal,

    isTouchDevice: store.isTouchDevice,
    setIsTouchDevice: store.setIsTouchDevice,
    isIOS: store.isIOS,
    setIsIOS: store.setIsIOS,
    isAndroid: store.isAndroid,
    setIsAndroid: store.setIsAndroid,

    modules: store.modules,
    LAST_MODULE_ID: store.LAST_MODULE_ID,
    moduleLessons,
    moduleContent,
    msgs,

    isModuleLocked: (id) => store.isModuleLocked(id),
    isEvaluationLocked: (id) => store.isEvaluationLocked(id),
    getCurrentModule: () => store.getCurrentModule(),
    getBadgesSummary: () => store.getBadgesSummary(),
    getUserBadges: () => store.getUserBadges(),
    getLatestQuizAttempt: () => store.getLatestQuizAttempt(),

    syncStatus: store.syncStatus,
    isUsingJWT: store.isUsingJWT,
    userId: store.userId,
    completedVideos: store.completedVideos,
    completedExams: store.completedExams,
    completedInfographics: store.completedInfographics,
    completedActivities: store.completedActivities,
    challengeScores: store.challengeScores,
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

  return (
    <IALabContext.Provider value={contextValue}>
      {children}
    </IALabContext.Provider>
  );
};
