import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

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
  const { user, isLoading: authLoading, signOut } = useAuth();
  
  // ==================== ESTADOS PRINCIPALES ====================
  
  // Navegación y progreso
  const [activeMod, setActiveMod] = useState(1);
  const [activeTab, setActiveTab] = useState('lab');
  const [completedModules, setCompletedModules] = useState([]);
  const [courseProgress, setCourseProgress] = useState(20);
  const [visitedModules, setVisitedModules] = useState([1]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

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
  const [suggestedTime] = useState(20 * 60); // 20 minutos en segundos
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
    { id: 1, title: 'Ingeniería de Prompts', icon: 'fa-terminal', color: '#4DA8C4', topics: ['Dar instrucciones claras a la IA', 'Mejorar cualquier pregunta para obtener mejores respuestas', 'Entender por qué la IA falla y cómo corregirlo', 'Obtener resultados útiles en menos tiempo', 'Aplicar la IA en estudio, trabajo y vida diaria', 'Pedir exactamente lo que necesita, sin rodeos'], challenge: '¡Llegó el momento de la práctica! Aplica todo lo aprendido en este módulo resolviendo un caso real. Atrévete a consolidar tu aprendizaje, supera el reto y lleva tus conocimientos al siguiente nivel.', desc: 'En este módulo, hemos diseñado una ruta estratégica que te llevará desde los fundamentos de la Inteligencia Artificial Generativa hasta la creación de instrucciones de alto impacto. Tu misión: Explorar cada tema y sus recursos multimedia (videos, guías y laboratorios). Notarás que tu barra de progreso cobrará vida con cada paso que des. No te detengas: cada recurso completado te acerca un 20% más a tu certificación global. ¡El poder de las instrucciones claras está en tus manos!', duration: '4h 30min', level: 'Avanzado', videos: 12, projects: 3 },
    { id: 2, title: 'Potencia ChatGPT', icon: 'fa-robot', color: '#66CCCC', topics: ['Análisis Predictivo', 'GPTs Personalizados', 'Function Calling', 'System Prompts'], challenge: 'Estructura un GPT para análisis de mercados cuánticos.', desc: 'Desbloquea todo el potencial de los modelos GPT con técnicas avanzadas.', duration: '5h 00min', level: 'Avanzado', videos: 15, projects: 4 },
    { id: 3, title: 'Rastreo Profundo', icon: 'fa-search', color: '#B2D8E5', topics: ['Razonamiento Multimodal', 'Grounding Real-Time', 'Deep Research', 'Fact-Checking IA'], challenge: 'Genera una comparativa técnica de latencia entre arquitecturas IA.', desc: 'Técnicas de investigación profunda con IA para resultados de élite.', duration: '3h 45min', level: 'Intermedio', videos: 10, projects: 2 },
    { id: 4, title: 'Inmersión NotebookLM', icon: 'fa-microphone', color: '#004B63', topics: ['Curaduría de Fuentes', 'Síntesis de Conocimiento', 'Audio Overviews', 'Gestión Documental'], challenge: 'Genera un podcast analizando 5 papers sobre neuro-plasticidad.', desc: 'Convierte cualquier documento en conocimiento accionable con IA.', duration: '4h 00min', level: 'Intermedio', videos: 8, projects: 3 },
    { id: 5, title: 'Proyecto Disruptivo', icon: 'fa-trophy', color: '#FFD166', topics: ['Integración Total', 'MVP Inteligente', 'Pitch Deck IA', 'Roadmap Estratégico'], challenge: 'Propón una automatización integral para una industria local de alto nivel.', desc: 'Aplica todo lo aprendido en un proyecto de impacto real.', duration: '6h 00min', level: 'Experto', videos: 6, projects: 5 },
  ];
  
  const LAST_MODULE_ID = 5;
  
  // Lecciones del módulo 1 - Datos extendidos para diseño premium
  const moduleLessons = [
    { 
      id: 1, 
      title: 'Resultados Rápidos con IA (Zero-Shot Prompting)', 
      description: 'Obtén buenos resultados sin ejemplos', 
      detailedDescription: 'Aprende a formular prompts efectivos desde el primer intento, sin necesidad de ejemplos previos. Domina la técnica Zero-Shot para obtener respuestas precisas y útiles en cualquier contexto.',
      duration: '8 min', 
      format: 'Reading', 
      icon: 'fa-bolt', 
      badgeColor: 'bg-yellow-100 text-yellow-800',
      themeColor: '#FFD166'
    },
    { 
      id: 2, 
      title: 'Haz que la IA Piense Paso a Paso (Chain-of-Thought)', 
      description: 'Guía el razonamiento de la IA', 
      detailedDescription: 'Descubre cómo descomponer problemas complejos en pasos lógicos que la IA puede seguir. Aplica la técnica Chain-of-Thought para obtener soluciones detalladas y bien fundamentadas.',
      duration: '18 min', 
      format: 'Lab', 
      icon: 'fa-sitemap', 
      badgeColor: 'bg-indigo-100 text-indigo-800',
      themeColor: '#4F46E5'
    },
    { 
      id: 3, 
      title: 'Tono y Estilo: Personalizando la Voz de la IA', 
      description: 'Personaliza respuestas según necesidades', 
      detailedDescription: 'Aprende a ajustar el tono, estilo y formato de las respuestas de la IA para diferentes audiencias y propósitos. Desde formal hasta casual, domina el arte de la comunicación efectiva.',
      duration: '12 min', 
      format: 'Video', 
      icon: 'fa-comments', 
      badgeColor: 'bg-green-100 text-green-800',
      themeColor: '#10B981'
    },
    { 
      id: 4, 
      title: 'Integridad Académica y Prevención del Plagio con IA', 
      description: 'Asegura la originalidad y ética en el uso de IA', 
      detailedDescription: 'Conoce las mejores prácticas para usar la IA de manera ética en contextos académicos y profesionales. Aprende a citar correctamente, evitar plagio y mantener la integridad intelectual.',
      duration: '15 min', 
      format: 'Lab', 
      icon: 'fa-shield-alt', 
      badgeColor: 'bg-red-100 text-red-800',
      themeColor: '#EF4444'
    },
    { 
      id: 5, 
      title: 'Estructura Perfecta de un Prompt: El Framework Edutechlife', 
      description: 'Estructura tus prompts con estrategia', 
      detailedDescription: 'Domina el framework RTF (Rol, Tarea, Formato) exclusivo de Edutechlife. Aprende a estructurar prompts que generen respuestas consistentes, relevantes y de alta calidad.',
      duration: '10 min', 
      format: 'Video', 
      icon: 'fa-code', 
      badgeColor: 'bg-purple-100 text-purple-800',
      themeColor: '#8B5CF6'
    },
    { 
      id: 6, 
      title: 'Proyecto Final: Diseña tu Solución con IA', 
      description: 'Reflexiona sobre el impacto ético de la IA', 
      detailedDescription: 'Aplica todo lo aprendido en un proyecto práctico que resuelva un problema real. Desarrolla una solución completa usando IA, desde el diseño hasta la implementación.',
      duration: '25 min', 
      format: 'Activity', 
      icon: 'fa-rocket', 
      badgeColor: 'bg-cyan-100 text-cyan-800',
      themeColor: '#06B6D4'
    },
  ];
  
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
  
  const WEIGHTS = { exam: 40, challenge: 30, resources: 20, community: 10 };

  // Calcular score de un módulo basado en actividades completadas
  const calculateModuleScore = useCallback((moduleId) => {
    const mod = moduleProgress[moduleId];
    if (!mod) return 0;
    let score = 0;
    if (mod.exam) score += WEIGHTS.exam;
    if (mod.challenge) score += WEIGHTS.challenge;
    if (mod.resourcesCompleted) score += WEIGHTS.resources;
    if (mod.community) score += WEIGHTS.community;
    return score;
  }, [moduleProgress]);

  // Calcular progreso global (5 módulos x 20% cada uno)
  const calculateGlobalProgress = useCallback(() => {
    let passedModules = 0;
    for (let i = 1; i <= 5; i++) {
      if (calculateModuleScore(i) >= 80) passedModules++;
    }
    return passedModules * 20;
  }, [calculateModuleScore]);

  // Actualizar una actividad del módulo y recalcular score
  const updateModuleActivity = useCallback((moduleId, activity, value) => {
    setModuleProgress(prev => {
      const updated = { ...prev[moduleId], [activity]: value };
      let score = 0;
      if (updated.exam) score += WEIGHTS.exam;
      if (updated.challenge) score += WEIGHTS.challenge;
      if (updated.resourcesCompleted) score += WEIGHTS.resources;
      if (updated.community) score += WEIGHTS.community;
      updated.currentScore = score;
      
      // Auto-unlock siguiente módulo si este se aprueba (>=80%)
      if (moduleId < 5 && score >= 80) {
        return {
          ...prev,
          [moduleId]: updated,
          [moduleId + 1]: { ...prev[moduleId + 1], isUnlocked: true }
        };
      }
      return { ...prev, [moduleId]: updated };
    });
  }, []);
  
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
    msgs,
    
    // Funciones de utilidad
    isModuleLocked,
    isEvaluationLocked,
    getCurrentModule,
    getLatestQuizAttempt,
    toggleSidebarDropdown,
    
    // Auth y navegación
    user,
    authLoading,
    signOut,
    onBack,
  };
  
  return (
    <IALabContext.Provider value={contextValue}>
      {children}
    </IALabContext.Provider>
  );
};