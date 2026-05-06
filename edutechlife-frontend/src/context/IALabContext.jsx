import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/react';
import { useProgressContext } from './ProgressContext';
import { useNotification } from './NotificationContext';
import { useActivityTracker } from '../hooks/useActivityTracker';
import { moduleContent } from '../components/IALab/constants/moduleContent';
import { supabase } from '../lib/supabase';

/**
 * CONTEXTO GLOBAL IALab - Estado compartido entre componentes
 * 
 * Estados principales:
 * - activeMod: Módulo activo actual (1-5)
 * - modules: Lista de módulos del curso
 * - completedModules: Módulos completados por el usuario
 * - visitedModules: Módulos visitados (para desbloqueo progresivo)
 * - Estados de evaluación: showExamModal, quizAnswers, etc.
 * - Estados de foro: insightsExpanded
 * - Estados de sintetizador: input, genData, loading
 */

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

  // Transform Clerk user to match expected format across IALab components
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
    const progressKeys = [
      'ialab_completed_videos',
      'ialab_completed_modules',
      'ialab_completed_exams',
      'ialab_completed_infographics',
      'ialab_completed_activities',
      'ialab_overall_progress',
      'ialab_sync_queue'
    ];
    progressKeys.forEach(key => localStorage.removeItem(key));
  };

  const {
    courseProgress: persistentCourseProgress,
    completedModules: persistentCompletedModules,
    completedVideos,
    completedExams,
    completedInfographics,
    completedActivities,
    challengeScores,
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
    refreshProgress,
    setCompletedModules: setPersistentCompletedModules,
    setCourseProgress: setPersistentCourseProgress,
    recordLastTopic,
  } = useProgressContext();

  const { createNotification } = useNotification();
  const { trackActivity, getModuleActivities } = useActivityTracker();

  // completedModules y courseProgress vienen del ProgressContext global
  const completedModules = persistentCompletedModules;
  const courseProgress = persistentCourseProgress;
  const setCompletedModules = setPersistentCompletedModules;
  const setCourseProgress = setPersistentCourseProgress;

  // ==================== ESTADOS PRINCIPALES ====================
  
  // Navegación y progreso
  const [activeMod, setActiveMod] = useState(1);
  const [activeTab, setActiveTab] = useState('lab');
  const [visitedModules, setVisitedModules] = useState([1]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Sync loading state from global progress context
  useEffect(() => {
    setIsLoadingProgress(progressLoading);
  }, [progressLoading]);

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

  // Sistema de notas y progreso gamificado por módulo
  const INITIAL_MODULE_PROGRESS = {
    1: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true },
    2: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
    3: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
    4: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
    5: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
  };
  const [moduleProgress, setModuleProgress] = useState(INITIAL_MODULE_PROGRESS);
  
  // Estados de evaluación (solo modal - eliminado quiz inline)
  const [showExamModal, setShowExamModal] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showScoreResult, setShowScoreResult] = useState(false);
  const [dailyAttemptsCount, setDailyAttemptsCount] = useState(0);
  const [lastAttemptDate, setLastAttemptDate] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  
  // Estados de seguridad
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);
  const [securityWarningCount, setSecurityWarningCount] = useState(0);
  const [screenshotProtectionActive, setScreenshotProtectionActive] = useState(false);
  const [securityViolations, setSecurityViolations] = useState(0);
  const [attemptsPenalized, setAttemptsPenalized] = useState(0);
  const [keyboardLockActive, setKeyboardLockActive] = useState(false);
  const [showSecurityStatus, setShowSecurityStatus] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');
  const [showSecurityMessage, setShowSecurityMessage] = useState(false);
  
  // Estados de timer
  const [suggestedTime] = useState(25 * 60); // 25 minutos en segundos
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  
  // Estados de navegación quiz (solo para modal)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estados de sidebar
  const [sidebarDropdowns, setSidebarDropdowns] = useState({
    videos: false,
    recursos: false
  });
  
  // Estados de acordeones
  const [openAccordions, setOpenAccordions] = useState({});
  const [visibleAccordions, setVisibleAccordions] = useState([]);
  
  // Estados de foro
  const [insightsExpanded, setInsightsExpanded] = useState(false);
  
  // Estados de sintetizador
  const [input, setInput] = useState('');
  const [genData, setGenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState('');
  
  // Estados de Valerio (coach IA)
  const [coachQ, setCoachQ] = useState('');
  const [coachMsg, setCoachMsg] = useState('');
  const [coachLoad, setCoachLoad] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [avatarState, setAvatarState] = useState('idle');
  const [showValerioDrawer, setShowValerioDrawer] = useState(false);
  
  // Estados de usuario
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEvaluationTooltip, setShowEvaluationTooltip] = useState(false);
  
  // Estados de certificado
  const [certName, setCertName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [storedCertificate, setStoredCertificate] = useState(null);
  const [certificateGenerating, setCertificateGenerating] = useState(false);
  
  // Estados de evaluación antigua (mantener compatibilidad)
  const [evalAnswers, setEvalAnswers] = useState({});
  const [evalSubmitted, setEvalSubmitted] = useState(false);
  const [evalScore, setEvalScore] = useState(0);
  
  // Estados de botones funcionales
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [isQuizValid, setIsQuizValid] = useState(false);
  
  // Estados de desafío
  const [isStartingChallenge, setIsStartingChallenge] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isChallengeCompleted, setIsChallengeCompleted] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);
  
  // Estados del nuevo modal de evaluación premium
  const [showPremiumEvaluationModal, setShowPremiumEvaluationModal] = useState(false);
  
  // Estados de dispositivo
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  
  // ==================== DATOS ESTÁTICOS ====================
  
  // Módulos del curso (idénticos al original)
  const modules = [
    { id: 1, title: 'Ingeniería de Prompts', icon: 'fa-terminal', color: '#4DA8C4', topics: ['Dar instrucciones claras a la IA', 'Mejorar cualquier pregunta para obtener mejores respuestas', 'Entender por qué la IA falla y cómo corregirlo', 'Obtener resultados útiles en menos tiempo', 'Aplicar la IA en estudio, trabajo y vida diaria', 'Pedir exactamente lo que necesita, sin rodeos'], challenge: '¡Llegó el momento de la práctica! Aplica todo lo aprendido en este módulo resolviendo un caso real. Atrévete a consolidar tu aprendizaje, supera el reto y lleva tus conocimientos al siguiente nivel.', desc: 'En este módulo, hemos diseñado una ruta estratégica que te llevará desde los fundamentos de la Inteligencia Artificial Generativa hasta la creación de instrucciones de alto impacto. Tu misión: Explorar cada tema y sus recursos multimedia (videos, guías y laboratorios). Notarás que tu barra de progreso cobrará vida con cada paso que des. No te detengas: cada recurso completado te acerca un 20% más a tu certificación global. ¡El poder de las instrucciones claras está en tus manos!', duration: '2h', level: 'Avanzado', videos: 12, projects: 3 },
    { id: 2, title: 'Potencia ChatGPT', icon: 'fa-robot', color: '#66CCCC', topics: ['Análisis Predictivo', 'GPTs Personalizados', 'Function Calling', 'System Prompts'], challenge: 'Estructura un GPT para análisis de mercados cuánticos.', desc: 'Desbloquea todo el potencial de los modelos GPT con técnicas avanzadas.', duration: '5h 00min', level: 'Avanzado', videos: 15, projects: 4 },
    { id: 3, title: 'Rastreo Profundo', icon: 'fa-search', color: '#B2D8E5', topics: ['Razonamiento Multimodal', 'Grounding Real-Time', 'Deep Research', 'Fact-Checking IA'], challenge: 'Genera una comparativa técnica de latencia entre arquitecturas IA.', desc: 'Técnicas de investigación profunda con IA para resultados de élite.', duration: '3h 45min', level: 'Intermedio', videos: 10, projects: 2 },
    { id: 4, title: 'Inmersión NotebookLM', icon: 'fa-microphone', color: '#004B63', topics: ['Curaduría de Fuentes', 'Síntesis de Conocimiento', 'Audio Overviews', 'Gestión Documental'], challenge: 'Genera un podcast analizando 5 papers sobre neuro-plasticidad.', desc: 'Convierte cualquier documento en conocimiento accionable con IA.', duration: '4h 00min', level: 'Intermedio', videos: 8, projects: 3 },
    { id: 5, title: 'Proyecto Disruptivo', icon: 'fa-trophy', color: '#FFD166', topics: ['Integración Total', 'MVP Inteligente', 'Pitch Deck IA', 'Roadmap Estratégico'], challenge: 'Propón una automatización integral para una industria local de alto nivel.', desc: 'Aplica todo lo aprendido en un proyecto de impacto real.', duration: '6h 00min', level: 'Experto', videos: 6, projects: 5 },
  ];
  
  const LAST_MODULE_ID = 5;
  
  // Lecciones del módulo 1 - Datos originales (INTACTOS)
  const module1Lessons = [
    { 
      id: 1, 
      title: 'Introducción a la Inteligencia Artificial Generativa', 
      description: 'Comprende los fundamentos de la IA generativa', 
      detailedDescription: 'Comprende los fundamentos de la IA generativa y su aplicación en educación. Aprende cómo los modelos como GPT-4 transforman la creación de contenido educativo.',
      duration: '20 min', 
      format: 'Reading', 
      icon: 'fa-brain', 
      badgeColor: 'bg-yellow-100 text-yellow-800',
      themeColor: '#FFD166'
    },
    { 
      id: 2, 
      title: '¿Qué es un Prompt?', 
      description: 'Domina el arte de comunicarte con IA', 
      detailedDescription: 'Domina el arte de comunicarte con IA. Un prompt efectivo es la diferencia entre resultados genéricos y soluciones personalizadas.',
      duration: '20 min', 
      format: 'Lab', 
      icon: 'fa-comments', 
      badgeColor: 'bg-indigo-100 text-indigo-800',
      themeColor: '#4F46E5'
    },
    { 
      id: 3, 
      title: 'Estructura Básica de un Prompt Efectivo', 
      description: 'Aprende la fórmula mágica de prompts', 
      detailedDescription: 'Aprende la fórmula mágica: Contexto + Instrucción + Formato = Resultado preciso. Desglose paso a paso con ejemplos reales.',
      duration: '20 min', 
      format: 'Video', 
      icon: 'fa-sitemap', 
      badgeColor: 'bg-green-100 text-green-800',
      themeColor: '#10B981'
    },
  ];
  
  // Lecciones dinámicas según módulo activo (Módulo 1 intacto, 2-5 desde moduleContent)
  const moduleLessons = useMemo(() => {
    if (activeMod === 1) return module1Lessons;
    return moduleContent[activeMod]?.lessons || [];
  }, [activeMod]);
  
  // Mensajes de carga para sintetizador
  const msgs = ['Analizando contexto...', 'Aplicando técnicas élite...', 'Optimizando estructura...', 'Generando masterPrompt...'];
  
  // ==================== FUNCIONES DE UTILIDAD ====================
  
  // Determinar si un módulo está bloqueado (sistema gamificado)
  const isModuleLocked = useCallback((moduleId) => {
    if (moduleId === 1) return false;
    return !moduleProgress[moduleId]?.isUnlocked;
  }, [moduleProgress]);
  
  // Determinar si la evaluación está bloqueada
  const isEvaluationLocked = useCallback((moduleId) => {
    if (moduleId === 1) return false;
    const previousModuleId = moduleId - 1;
    return !completedModules.includes(previousModuleId);
  }, [completedModules]);
  
  // Obtener el módulo actual
  const getCurrentModule = useCallback(() => {
    return modules.find(m => m.id === activeMod) || modules[0];
  }, [activeMod]);

  // ==================== SISTEMA DE NOTAS GAMIFICADO ====================
  // Pesos: Examen 35% + Desafío 30% + Recursos 30% + Comunidad 5% = 100%
  const WEIGHTS = { exam: 35, challenge: 30, resources: 30, community: 5 };

  // Calcular score de un módulo basado en actividades completadas (proporcional)
  const calculateModuleScore = useCallback((moduleId) => {
    const mod = moduleProgress[moduleId];
    if (!mod) return 0;
    let score = 0;
    score += mod.examEarned || (mod.exam ? WEIGHTS.exam : 0);
    score += mod.challengeEarned || (mod.challenge ? WEIGHTS.challenge : 0);
    if (mod.resourcesCompleted) score += WEIGHTS.resources;
    if (mod.community) score += WEIGHTS.community;
    return Math.min(100, Math.round(score * 10) / 10);
  }, [moduleProgress]);

  // Calcular progreso global (5 módulos x 20% cada uno)
  const calculateGlobalProgress = useCallback(() => {
    let total = 0;
    for (let i = 1; i <= 5; i++) {
      const score = calculateModuleScore(i);
      total += (score / 100) * 20;
    }
    return Math.min(100, Math.round(total));
  }, [calculateModuleScore]);

  // Nota: courseProgress ahora viene del ProgressContext global (usePersistentProgress)
  // El cálculo gamificado (calculateGlobalProgress) se mantiene para desbloqueo de módulos

  // Actualizar una actividad del modulo y recalcular score
  // activity: 'exam', 'challenge', 'resourcesCompleted', 'community'
  // value: boolean o score numérico
  // score: score numérico real (para calculo proporcional)
  const updateModuleActivity = useCallback(async (moduleId, activity, value, score) => {
    let newScore = 0;
    let justCompleted = false;

    setModuleProgress(prev => {
      const prevMod = prev[moduleId];
      const prevScore = prevMod?.currentScore || 0;
      
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
      
      let scoreCalc = 0;
      scoreCalc += updated.examEarned || (updated.exam ? WEIGHTS.exam : 0);
      scoreCalc += updated.challengeEarned || (updated.challenge ? WEIGHTS.challenge : 0);
      if (updated.resourcesCompleted) scoreCalc += WEIGHTS.resources;
      if (updated.community) scoreCalc += WEIGHTS.community;
      updated.currentScore = Math.min(100, Math.round(scoreCalc * 10) / 10);
      newScore = updated.currentScore;
      
      if (prevScore < 80 && scoreCalc >= 80) {
        justCompleted = true;
      }
      
      // Auto-unlock siguiente modulo si este se aprueba (>=80%)
      if (moduleId < 5 && scoreCalc >= 80) {
        return {
          ...prev,
          [moduleId]: updated,
          [moduleId + 1]: { ...prev[moduleId + 1], isUnlocked: true }
        };
      }
      return { ...prev, [moduleId]: updated };
    });

    if (justCompleted) {
      const moduleName = modules.find(m => m.id === moduleId)?.title || `Modulo ${moduleId}`;
      console.log('[NOTIFICATIONS] Disparando module_complete para:', moduleName, 'score:', newScore);
      const result = await createNotification({
        type: 'module_complete',
        title: `✅ ${moduleName} Completado`,
        message: `¡Felicitaciones! Aprobaste con ${newScore}% de calificacion. ${moduleId < 5 ? 'El siguiente modulo ya esta desbloqueado.' : '¡Has completado todos los modulos!'}`,
        metadata: { moduleId, score: newScore },
      });
      console.log('[NOTIFICATIONS] Resultado module_complete:', result);

      await trackActivity({
        moduleId,
        type: 'resource',
        resourceId: `m${moduleId}_module_complete`,
        title: `${moduleName} - Módulo Completado`,
        score: newScore,
        metadata: { action: 'module_approved', score: newScore }
      });
    }
  }, [createNotification, modules]);
  
  // Marcar recurso como visto (tracking granular)
  const markResourceAsViewed = useCallback((moduleId, resourceId) => {
    setModuleProgress(prev => {
      const mod = prev[moduleId];
      if (!mod) return prev;
      
      const viewedResources = mod.viewedResources || [];
      if (viewedResources.includes(resourceId)) return prev;
      
      const newViewed = [...viewedResources, resourceId];
      const totalResources = 8;
      const resourcesPct = Math.round((newViewed.length / totalResources) * 100);
      const resourcesCompleted = resourcesPct >= 80;
      
      const updated = { ...mod, viewedResources: newViewed, resourcesCompleted, resourcesPct };
      let score = 0;
      score += updated.examEarned || (updated.exam ? WEIGHTS.exam : 0);
      score += updated.challengeEarned || (updated.challenge ? WEIGHTS.challenge : 0);
      if (updated.resourcesCompleted) score += WEIGHTS.resources;
      if (updated.community) score += WEIGHTS.community;
      updated.currentScore = Math.min(100, Math.round(score * 10) / 10);
      
      if (moduleId < 5 && updated.currentScore >= 80) {
        return {
          ...prev,
          [moduleId]: updated,
          [moduleId + 1]: { ...prev[moduleId + 1], isUnlocked: true }
        };
      }
      return { ...prev, [moduleId]: updated };
    });
  }, []);
  
  // Marcar comentario en comunidad
  const markCommunityComment = useCallback((moduleId) => {
    setModuleProgress(prev => {
      const mod = prev[moduleId];
      if (!mod || mod.community) return prev;
      
      const updated = { ...mod, community: true };
      let score = 0;
      score += updated.examEarned || (updated.exam ? WEIGHTS.exam : 0);
      score += updated.challengeEarned || (updated.challenge ? WEIGHTS.challenge : 0);
      if (updated.resourcesCompleted) score += WEIGHTS.resources;
      if (updated.community) score += WEIGHTS.community;
      updated.currentScore = Math.min(100, Math.round(score * 10) / 10);
      
      if (moduleId < 5 && updated.currentScore >= 80) {
        return {
          ...prev,
          [moduleId]: updated,
          [moduleId + 1]: { ...prev[moduleId + 1], isUnlocked: true }
        };
      }
      return { ...prev, [moduleId]: updated };
    });
  }, []);
  
  // Verificar si el curso está completo (80%+ y todos los módulos aprobados)
  // Usa dos fuentes: moduleProgress (sistema gamificado) Y completedModules (ProgressContext)
  const checkCourseCompletion = useCallback(() => {
    // Contar módulos completados vía sistema gamificado (score >= 80%)
    const modulesApprovedByScore = [1, 2, 3, 4, 5].filter(
      id => calculateModuleScore(id) >= 80
    ).length;
    
    // Contar módulos completados vía ProgressContext
    const modulesInContext = completedModules.length;
    
    // Usar el mayor de los dos conteos (para cubrir ambos sistemas de tracking)
    const effectiveModulesCompleted = Math.max(modulesApprovedByScore, modulesInContext);
    
    // Contar exámenes completados (score >= 80%)
    const examsInContext = Object.values(completedExams).filter(s => typeof s === 'number' ? s >= 80 : s).length;
    const examsByScore = [1, 2, 3, 4, 5].filter(
      id => moduleProgress[id]?.exam
    ).length;
    const effectiveExamsCompleted = Math.max(examsInContext, examsByScore);
    
    const progressThreshold = courseProgress >= 80;
    
    // Criterio: progreso >= 80% Y al menos 5 módulos completados (por cualquier sistema)
    const isCompleted = effectiveModulesCompleted >= 5 && progressThreshold;
    setCourseCompleted(isCompleted);
    return isCompleted;
  }, [completedModules, completedExams, courseProgress, moduleProgress, calculateModuleScore]);
  
  // Verificar completitud del curso cuando cambia el progreso
  useEffect(() => {
    checkCourseCompletion();
  }, [checkCourseCompletion]);

  // Notificar cuando el estudiante completa y certifica el curso (5 modulos aprobados + 80% progreso)
  useEffect(() => {
    if (!user?.id) return;

    const isFullyComplete = checkCourseCompletion();
    const hasNotified = localStorage.getItem('ialab_notified_certification');
    
    if (isFullyComplete && !hasNotified) {
      localStorage.setItem('ialab_notified_certification', 'true');
      console.log('[NOTIFICATIONS] Disparando certificate_earned, progress:', courseProgress);
      createNotification({
        type: 'certificate_earned',
        title: '🎓 ¡Curso Completado y Certificado!',
        message: `Felicitaciones, has aprobado los 5 modulos con ${Math.round(courseProgress)}% de progreso general. Tu certificado ya esta disponible para descargar.`,
        metadata: { progress: courseProgress, allModulesApproved: true },
      }).then(result => {
        console.log('[NOTIFICATIONS] Resultado certificate_earned:', result);
      });

      trackActivity({
        moduleId: 0,
        type: 'resource',
        resourceId: 'course_completed',
        title: 'Curso Completado y Certificado',
        score: Math.round(courseProgress),
        metadata: { action: 'course_certified', progress: courseProgress }
      });
    }
  }, [courseCompleted, courseProgress, user?.id, createNotification, checkCourseCompletion]);

  // Backfill: Notificar módulos ya completados antes del sistema de notificaciones
  const backfillRef = React.useRef(false);
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
  }, [user?.id, completedModules, modules, calculateModuleScore, createNotification]);

  // Notificar al entrar a un nuevo modulo (motivacional)
  const lastModuleNotifiedRef = React.useRef(0);
  useEffect(() => {
    if (!user?.id || activeMod === 1 || activeMod === lastModuleNotifiedRef.current) return;

    const mod = modules.find(m => m.id === activeMod);
    if (!mod) return;

    // Calcular score del modulo anterior para dar contexto
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
    console.log('[NOTIFICATIONS] Disparando module_entered para modulo:', activeMod);

    trackActivity({
      moduleId: activeMod,
      type: 'resource',
      resourceId: `m${activeMod}_module_entered`,
      title: `${mod.title} - Módulo Iniciado`,
      metadata: { action: 'module_started', prevScore }
    });

    lastModuleNotifiedRef.current = activeMod;
  }, [activeMod, user?.id, createNotification, modules, calculateModuleScore]);
  
  // Generar y guardar certificado en Supabase
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
      
      console.log('📝 Insertando certificado:', certData);
      
      const { data, error } = await supabase
        .from('certificates')
        .insert(certData)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error de Supabase al insertar certificado:', error);
        console.error('   Detalles:', error.details);
        console.error('   Hint:', error.hint);
        console.error('   Code:', error.code);
        throw new Error(error.message || 'Error al generar certificado');
      }
      
      console.log('✅ Certificado generado exitosamente:', data);
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
  }, [user, certName, calculateModuleScore, createNotification]);
  
  // Obtener el último intento del quiz
  const getLatestQuizAttempt = useCallback(() => {
    if (quizAttempts.length === 0) return null;
    return quizAttempts[quizAttempts.length - 1];
  }, [quizAttempts]);
  
  // Toggle sidebar dropdowns
  const toggleSidebarDropdown = useCallback((section) => {
    setSidebarDropdowns(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);
  
  // ==================== CONTEXTO VALUE ====================

  const contextValue = {
    // Estados
    activeMod,
    setActiveMod,
    activeTab,
    setActiveTab,
    completedModules,
    setCompletedModules,
    courseProgress,
    setCourseProgress,
    visitedModules,
    setVisitedModules,
    isLoadingProgress,
    setIsLoadingProgress,
    
    // Sistema de notas gamificado
    moduleProgress,
    calculateModuleScore,
    calculateGlobalProgress,
    updateModuleActivity,
    markResourceAsViewed,
    markCommunityComment,

    // Estados de evaluación
    showExamModal,
    setShowExamModal,
    quizAnswers,
    setQuizAnswers,
    quizScore,
    setQuizScore,
    quizPassed,
    setQuizPassed,
    quizResult,
    setQuizResult,
    showScoreResult,
    setShowScoreResult,
    dailyAttemptsCount,
    setDailyAttemptsCount,
    lastAttemptDate,
    setLastAttemptDate,
    quizAttempts,
    setQuizAttempts,
    
    // Estados de seguridad
    showExitConfirmation,
    setShowExitConfirmation,
    showSecurityWarning,
    setShowSecurityWarning,
    securityWarningCount,
    setSecurityWarningCount,
    screenshotProtectionActive,
    setScreenshotProtectionActive,
    securityViolations,
    setSecurityViolations,
    attemptsPenalized,
    setAttemptsPenalized,
    keyboardLockActive,
    setKeyboardLockActive,
    showSecurityStatus,
    setShowSecurityStatus,
    securityMessage,
    setSecurityMessage,
    showSecurityMessage,
    setShowSecurityMessage,
    
    // Estados de timer
    suggestedTime,
    timeElapsed,
    setTimeElapsed,
    isTimerRunning,
    setIsTimerRunning,
    showTimeWarning,
    setShowTimeWarning,
    
    // Estados de navegación quiz
    currentQuestion,
    setCurrentQuestion,
    currentPage,
    setCurrentPage,
    
    // Estados de sidebar
    sidebarDropdowns,
    setSidebarDropdowns,
    
    // Estados de acordeones
    openAccordions,
    setOpenAccordions,
    visibleAccordions,
    setVisibleAccordions,
    
    // Estados de foro
    insightsExpanded,
    setInsightsExpanded,
    
    // Estados de sintetizador
    input,
    setInput,
    genData,
    setGenData,
    loading,
    setLoading,
    loadMsg,
    setLoadMsg,
    
    // Estados de Valerio
    coachQ,
    setCoachQ,
    coachMsg,
    setCoachMsg,
    coachLoad,
    setCoachLoad,
    isListening,
    setIsListening,
    avatarState,
    setAvatarState,
    showValerioDrawer,
    setShowValerioDrawer,
    
    // Estados de usuario
    showProfileDropdown,
    setShowProfileDropdown,
    showEvaluationTooltip,
    setShowEvaluationTooltip,
    
    // Estados de certificado
    certName,
    setCertName,
    showNameModal,
    setShowNameModal,
    courseCompleted,
    setCourseCompleted,
    showCertificateModal,
    setShowCertificateModal,
    storedCertificate,
    setStoredCertificate,
    certificateGenerating,
    checkCourseCompletion,
    generateCertificate,
    
    // Estados de evaluación antigua
    evalAnswers,
    setEvalAnswers,
    evalSubmitted,
    setEvalSubmitted,
    evalScore,
    setEvalScore,
    
    // Estados de botones funcionales
    currentLessonIndex,
    setCurrentLessonIndex,
    isSynthesizerOpen,
    setIsSynthesizerOpen,
    isMarkingComplete,
    setIsMarkingComplete,
    isSubmittingQuiz,
    setIsSubmittingQuiz,
    isQuizValid,
    setIsQuizValid,
    
    // Estados de desafío
    isStartingChallenge,
    setIsStartingChallenge,
    isButtonDisabled,
    setIsButtonDisabled,
    isChallengeCompleted,
    setIsChallengeCompleted,
    challengeScore,
    setChallengeScore,
    
    // Estados del nuevo modal de evaluación premium
    showPremiumEvaluationModal,
    setShowPremiumEvaluationModal,
    
    // Estados de dispositivo
    isTouchDevice,
    setIsTouchDevice,
    isIOS,
    setIsIOS,
    isAndroid,
    setIsAndroid,
    
    // Datos estáticos
    modules,
    LAST_MODULE_ID,
    moduleLessons,
    moduleContent,
    msgs,
    
    // Funciones de utilidad
    isModuleLocked,
    isEvaluationLocked,
    getCurrentModule,
    getLatestQuizAttempt,
    toggleSidebarDropdown,
    
    // Persistencia de progreso (Clerk + Supabase)
    syncStatus,
    isUsingJWT,
    userId: progressUserId,
    completedVideos,
    completedExams,
    completedInfographics,
    completedActivities,
    challengeScores,
    markVideoComplete: syncMarkVideoComplete,
    markModuleComplete: syncMarkModuleComplete,
    markExamComplete: syncMarkExamComplete,
    markInfographicComplete: syncMarkInfographicComplete,
    markActivityComplete: syncMarkActivityComplete,
    markChallengeComplete: syncMarkChallengeComplete,
    refreshProgress,
    recordLastTopic,
    
    // Auth y navegación
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