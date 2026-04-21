import { useState, useEffect, useCallback } from 'react';
import { useIALabContext } from '../../context/IALabContext';

/**
 * HOOK: useIALabQuiz
 * 
 * Responsabilidad: Lógica completa del sistema de evaluación
 * - Preguntas del quiz
 * - Cálculo de puntajes
 * - Manejo de intentos
 * - Feedback personalizado
 * - Solo para modal (eliminado quiz inline)
 */

export const useIALabQuiz = () => {
  const {
    activeMod,
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
    timeElapsed,
    setTimeElapsed,
    isTimerRunning,
    setIsTimerRunning,
    showTimeWarning,
    setShowTimeWarning,
    currentQuestion,
    setCurrentQuestion,
    currentPage,
    setCurrentPage,
    showExamModal,
    setShowExamModal,
    securityWarningCount,
    setSecurityWarningCount,
    securityViolations,
    setSecurityViolations,
    screenshotProtectionActive,
    setScreenshotProtectionActive,
    showSecurityStatus,
    setShowSecurityStatus,
    showSecurityMessage,
    setShowSecurityMessage,
    securityMessage,
    setSecurityMessage,
    attemptsPenalized,
    setAttemptsPenalized
  } = useIALabContext();
  
  // ==================== CONSTANTES ====================
  
  const TOTAL_QUESTIONS = 8;
  const PASSING_SCORE = 70; // 70% mínimo
  const DAILY_ATTEMPTS_LIMIT = 2;
  const SUGGESTED_TIME_MINUTES = 20;
  const SUGGESTED_TIME_SECONDS = SUGGESTED_TIME_MINUTES * 60;
  
  // Constantes de seguridad
  const MAX_SECURITY_WARNINGS = 3;
  const SECURITY_WARNING_MESSAGES = [
    "Advertencia: No cambies de ventana durante el examen",
    "Segunda advertencia: El sistema detectó que abriste otra ventana",
    "Última advertencia: Si vuelves a cambiar de ventana, el examen se cerrará automáticamente"
  ];
  const SECURITY_VIOLATION_PENALTY = 1; // Intentos perdidos por 3 infracciones
  const SCREENSHOT_OVERLAY_DURATION = 5000; // 5 segundos
  const SECURITY_MESSAGE_DURATION = 3000; // 3 segundos
  const SECURITY_LOG_PREFIX = 'exam_security_logs';
  
  // ==================== PREGUNTAS DEL QUIZ ====================
  
  const quizQuestions = [
    {
      id: 'q1',
      question: '¿Cuál es el propósito principal de la ingeniería de prompts?',
      options: [
        { id: 'q1_a', label: 'Hacer preguntas más largas a la IA' },
        { id: 'q1_b', label: 'Dar instrucciones claras y efectivas para obtener resultados útiles' },
        { id: 'q1_c', label: 'Usar palabras técnicas complicadas' },
        { id: 'q1_d', label: 'Hacer que la IA escriba código automáticamente' }
      ],
      correctAnswer: 'q1_b',
      topic: 'Ingeniería de Prompts',
      difficulty: 'fácil',
      feedback: 'Debes volver a interactuar con el tema "Ingeniería de Prompts – Comunícate Mejor con la IA"'
    },
    {
      id: 'q2',
      question: '¿Qué técnica permite guiar el razonamiento de la IA paso a paso?',
      options: [
        { id: 'q2_a', label: 'Zero-Shot Prompting' },
        { id: 'q2_b', label: 'Chain-of-Thought' },
        { id: 'q2_c', label: 'Few-Shot Prompting' },
        { id: 'q2_d', label: 'Contexto Dinámico' }
      ],
      correctAnswer: 'q2_b',
      topic: 'Chain-of-Thought',
      difficulty: 'medio',
      feedback: 'Revisa el tema "Haz que la IA Piense Paso a Paso (Chain-of-Thought)"'
    },
    {
      id: 'q3',
      question: '¿Cuál es una ventaja clave del método RTF (Rol, Tarea, Formato)?',
      options: [
        { id: 'q3_a', label: 'Hace las preguntas más cortas' },
        { id: 'q3_b', label: 'Estructura las instrucciones para obtener respuestas organizadas y alineadas' },
        { id: 'q3_c', label: 'Elimina la necesidad de contexto' },
        { id: 'q3_d', label: 'Automatiza completamente el proceso' }
      ],
      correctAnswer: 'q3_b',
      topic: 'Método Mastery Framework',
      difficulty: 'fácil',
      feedback: 'Repasa "El Método para Dominar la IA (Mastery Framework)"'
    },
    {
      id: 'q4',
      question: '¿Qué es el "Zero-Shot Prompting" y cuándo es más efectivo?',
      options: [
        { id: 'q4_a', label: 'Dar 0 instrucciones a la IA' },
        { id: 'q4_b', label: 'Obtener buenos resultados sin proporcionar ejemplos previos' },
        { id: 'q4_c', label: 'Usar prompts con 0 palabras' },
        { id: 'q4_d', label: 'Reiniciar la conversación con la IA' }
      ],
      correctAnswer: 'q4_b',
      topic: 'Zero-Shot Prompting',
      difficulty: 'medio',
      feedback: 'Consulta "Resultados Rápidos con IA (Zero-Shot Prompting)"'
    },
    {
      id: 'q5',
      question: '¿Cómo se aplica el "Contexto Dinámico" en prompts complejos?',
      options: [
        { id: 'q5_a', label: 'Haciendo prompts más largos automáticamente' },
        { id: 'q5_b', label: 'Personalizando respuestas según necesidades específicas del usuario' },
        { id: 'q5_c', label: 'Eliminando la necesidad de pensar en el contexto' },
        { id: 'q5_d', label: 'Usando siempre el mismo contexto para todas las preguntas' }
      ],
      correctAnswer: 'q5_b',
      topic: 'Contexto Dinámico',
      difficulty: 'difícil',
      feedback: 'Estudia "Adapta la IA a Cada Situación (Contexto Dinámico)"'
    },
    {
      id: 'q6',
      question: '¿Qué consideraciones éticas son clave al usar IA generativa?',
      options: [
        { id: 'q6_a', label: 'Solo la velocidad de respuesta' },
        { id: 'q6_b', label: 'Sesgos, privacidad, transparencia y uso responsable' },
        { id: 'q6_c', label: 'El costo de la API' },
        { id: 'q6_d', label: 'La cantidad de tokens usados' }
      ],
      correctAnswer: 'q6_b',
      topic: 'Ética y Reflexión',
      difficulty: 'medio',
      feedback: 'Reflexiona con "Ejercicio de Reflexión – Más Allá de Usar la IA"'
    },
    {
      id: 'q7',
      question: '¿Cuál es la diferencia entre "Few-Shot" y "Zero-Shot" prompting?',
      options: [
        { id: 'q7_a', label: 'Few-Shot proporciona ejemplos, Zero-Shot no' },
        { id: 'q7_b', label: 'Zero-Shot es más rápido que Few-Shot' },
        { id: 'q7_c', label: 'Few-Shot usa menos palabras' },
        { id: 'q7_d', label: 'No hay diferencia significativa' }
      ],
      correctAnswer: 'q7_a',
      topic: 'Zero-Shot Prompting',
      difficulty: 'difícil',
      feedback: 'Compara técnicas en "Resultados Rápidos con IA (Zero-Shot Prompting)"'
    },
    {
      id: 'q8',
      question: '¿Cómo se estructura un prompt usando RTF para análisis de mercado?',
      options: [
        { id: 'q8_a', label: 'Pidiendo directamente "analiza el mercado"' },
        { id: 'q8_b', label: 'Definiendo Rol: Analista, Tarea: Analizar tendencias, Formato: Reporte estructurado' },
        { id: 'q8_c', label: 'Usando la menor cantidad de palabras posible' },
        { id: 'q8_d', label: 'Copiando prompts de internet' }
      ],
      correctAnswer: 'q8_b',
      topic: 'Método Mastery Framework',
      difficulty: 'difícil',
      feedback: 'Aplica "El Método para Dominar la IA (Mastery Framework)" en casos prácticos'
    }
  ];
  
  // ==================== FUNCIONES DEL QUIZ ====================
  
  // Calcular puntaje del quiz
  const calculateQuizScore = useCallback((answers) => {
    let correct = 0;
    const failedQuestions = [];
    
    quizQuestions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      } else {
        failedQuestions.push(question.id);
      }
    });
    
    const percentage = (correct / TOTAL_QUESTIONS) * 100;
    const passed = percentage >= PASSING_SCORE;
    
    return {
      score: Math.round(percentage),
      correctCount: correct,
      passed,
      failedQuestions,
      neededToPass: Math.ceil((PASSING_SCORE / 100) * TOTAL_QUESTIONS) // = 6
    };
  }, []);
  
  // Verificar si puede intentar el quiz (límite diario)
  const canAttemptQuiz = useCallback(() => {
    const today = new Date().toDateString();
    const lastAttempt = lastAttemptDate ? new Date(lastAttemptDate).toDateString() : null;
    
    // Si es un nuevo día, resetear contador
    if (lastAttempt !== today) {
      setDailyAttemptsCount(0);
      setLastAttemptDate(new Date().toISOString());
      return true;
    }
    
    // Verificar límite diario
    return dailyAttemptsCount < DAILY_ATTEMPTS_LIMIT;
  }, [lastAttemptDate, dailyAttemptsCount, setDailyAttemptsCount, setLastAttemptDate]);
  
  // Generar feedback personalizado por temas
  const generateTopicFeedback = useCallback((failedQuestions) => {
    // Agrupar preguntas falladas por tema
    const topicsNeedingReview = {};
    
    failedQuestions.forEach(questionId => {
      const question = quizQuestions.find(q => q.id === questionId);
      if (question && question.topic) {
        if (!topicsNeedingReview[question.topic]) {
          topicsNeedingReview[question.topic] = [];
        }
        topicsNeedingReview[question.topic].push(question);
      }
    });
    
    // Generar mensajes personalizados
    const feedbackMessages = [];
    
    Object.keys(topicsNeedingReview).forEach(topic => {
      const questions = topicsNeedingReview[topic];
      const count = questions.length;
      
      let message = '';
      if (count === 1) {
        message = `Debes volver a interactuar con el tema "${topic}".`;
      } else if (count === 2) {
        message = `Necesitas reforzar el tema "${topic}" (${count} preguntas falladas).`;
      } else {
        message = `Es prioritario que revises el tema "${topic}" (${count} preguntas falladas).`;
      }
      
      // Agregar feedback específico de cada pregunta
      questions.forEach(question => {
        if (question.feedback) {
          message += ` ${question.feedback}`;
        }
      });
      
      feedbackMessages.push(message);
    });
    
    return feedbackMessages;
  }, []);
  
  // Obtener el último intento del quiz
  const getLatestQuizAttempt = useCallback(() => {
    if (quizAttempts.length === 0) return null;
    return quizAttempts[quizAttempts.length - 1];
  }, [quizAttempts]);
  
  // Resetear quiz para reintento
  const resetQuizForRetry = useCallback(() => {
    setQuizAnswers({});
    setQuizScore(null);
    setQuizPassed(false);
    setQuizResult(null);
    setShowScoreResult(false);
    setDailyAttemptsCount(0);
    setTimeElapsed(0);
    setIsTimerRunning(false);
    setShowTimeWarning(false);
    setCurrentQuestion(0);
    setCurrentPage(1);
    setSecurityWarningCount(0);
    setSecurityViolations(0);
    setScreenshotProtectionActive(false);
    setShowSecurityStatus(false);
    setShowSecurityMessage(false);
  }, [
    setQuizAnswers, setQuizScore, setQuizPassed, setQuizResult, setShowScoreResult,
    setDailyAttemptsCount, setTimeElapsed, setIsTimerRunning, setShowTimeWarning,
    setCurrentQuestion, setCurrentPage, setSecurityWarningCount, setSecurityViolations,
    setScreenshotProtectionActive, setShowSecurityStatus, setShowSecurityMessage
  ]);
  
  // Enviar quiz y calcular resultados
  const submitQuiz = useCallback(async () => {
    try {
      // Calcular puntaje
      const result = calculateQuizScore(quizAnswers);
      
      setQuizScore(result.score);
      setQuizPassed(result.passed);
      setQuizResult(result);
      setShowScoreResult(true);
      
      // Guardar intento en localStorage
      const attempt = {
        id: Date.now(),
        moduleId: activeMod,
        score: result.score,
        passed: result.passed,
        correctCount: result.correctCount,
        totalQuestions: TOTAL_QUESTIONS,
        date: new Date().toISOString(),
        timeElapsed: timeElapsed,
        failedQuestions: result.failedQuestions
      };
      
      // Actualizar intentos
      const updatedAttempts = [...quizAttempts, attempt];
      setQuizAttempts(updatedAttempts);
      
      // Guardar en localStorage
      localStorage.setItem(`quizAttempts_${activeMod}`, JSON.stringify(updatedAttempts));
      
      // Actualizar contador de intentos diarios
      const today = new Date().toDateString();
      const todayAttempts = updatedAttempts.filter(attempt => {
        const attemptDate = new Date(attempt.date).toDateString();
        return attemptDate === today;
      });
      
      setDailyAttemptsCount(todayAttempts.length);
      setLastAttemptDate(new Date().toISOString());
      
      // Detener timer
      setIsTimerRunning(false);
      
      return { success: true, result };
      
    } catch (error) {
      console.error('Error al enviar quiz:', error);
      return { success: false, error: error.message };
    }
  }, [
    quizAnswers, activeMod, quizAttempts, timeElapsed,
    calculateQuizScore, setQuizScore, setQuizPassed, setQuizResult, setShowScoreResult,
    setQuizAttempts, setDailyAttemptsCount, setLastAttemptDate, setIsTimerRunning
  ]);
  
  // Actualizar respuesta del quiz
  const updateQuizAnswer = useCallback((questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, [setQuizAnswers]);
  
  // Abrir evaluación (modal)
  const openEvaluation = useCallback(() => {
    // Verificar si puede intentar
    if (!canAttemptQuiz()) {
      // Mostrar mensaje de límite alcanzado
      setSecurityMessage('Has alcanzado el límite de intentos diarios (2 por día)');
      setShowSecurityMessage(true);
      setTimeout(() => setShowSecurityMessage(false), 3000);
      return false;
    }
    
    // Abrir modal de examen
    setShowExamModal(true);
    
    // Iniciar timer sugerido
    setIsTimerRunning(true);
    
    // Resetear contador de advertencias de seguridad
    setSecurityWarningCount(0);
    
    // Si es un nuevo intento (no hay intentos previos o tiene intentos disponibles)
    const latestAttempt = getLatestQuizAttempt();
    if (!latestAttempt || dailyAttemptsCount < DAILY_ATTEMPTS_LIMIT) {
      resetQuizForRetry();
    }
    
    return true;
  }, [
    canAttemptQuiz, setShowExamModal, setIsTimerRunning, setSecurityWarningCount,
    setSecurityMessage, setShowSecurityMessage, getLatestQuizAttempt, dailyAttemptsCount,
    resetQuizForRetry
  ]);
  
  // Cerrar modal de evaluación
  const closeEvaluationModal = useCallback((forceClose = false) => {
    // Cerrar directamente (sin confirmación de salida)
    setShowExamModal(false);
    resetQuizForRetry();
    return true;
  }, [resetQuizForRetry, setShowExamModal]);
  
  // ==================== FUNCIONES DE SEGURIDAD ====================
  
  // Logger de eventos de seguridad
  const SECURITY_LOGGER = {
    logViolation: (type, details = {}) => {
      const logEntry = {
        id: Date.now(),
        type,
        timestamp: new Date().toISOString(),
        moduleId: activeMod,
        userId: user?.id || 'anonymous',
        details,
        violationCount: securityViolations + 1
      };
      
      // Obtener logs existentes
      const logKey = `${SECURITY_LOG_PREFIX}_${user?.id || 'anonymous'}_${new Date().toDateString()}`;
      const existingLogs = localStorage.getItem(logKey) || '[]';
      const logs = JSON.parse(existingLogs);
      
      // Agregar nuevo log
      logs.push(logEntry);
      
      // Guardar en localStorage (máximo 100 entradas por día)
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem(logKey, JSON.stringify(logs));
      
      // Incrementar contador de violaciones
      setSecurityViolations(prev => prev + 1);
      
      // Mostrar mensaje temporal
      showSecurityMessageTemporary(`Violación de seguridad: ${type}`);
      
      console.log(`[SECURITY] Violación registrada: ${type}`, logEntry);
      return logEntry;
    },
    
    getViolationsToday: () => {
      const logKey = `${SECURITY_LOG_PREFIX}_${user?.id || 'anonymous'}_${new Date().toDateString()}`;
      const existingLogs = localStorage.getItem(logKey) || '[]';
      return JSON.parse(existingLogs);
    },
    
    getViolationCountToday: () => {
      return SECURITY_LOGGER.getViolationsToday().length;
    },
    
    clearOldLogs: () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(SECURITY_LOG_PREFIX)) {
          try {
            const logs = JSON.parse(localStorage.getItem(key) || '[]');
            if (logs.length > 0) {
              const firstLogDate = new Date(logs[0].timestamp);
              if (firstLogDate < thirtyDaysAgo) {
                localStorage.removeItem(key);
              }
            }
          } catch (error) {
            console.error('Error al limpiar logs antiguos:', error);
          }
        }
      }
    }
  };
  
  // Mostrar mensaje de seguridad temporal
  const showSecurityMessageTemporary = useCallback((message) => {
    setSecurityMessage(message);
    setShowSecurityMessage(true);
    
    setTimeout(() => {
      setShowSecurityMessage(false);
    }, SECURITY_MESSAGE_DURATION);
  }, [setSecurityMessage, setShowSecurityMessage]);
  
  // Penalizar intento por violaciones de seguridad
  const penalizeAttempt = useCallback(() => {
    if (dailyAttemptsCount >= DAILY_ATTEMPTS_LIMIT) {
      showSecurityMessageTemporary('Ya has alcanzado el límite de intentos diarios');
      return;
    }
    
    // Incrementar contador de intentos (penalización)
    setDailyAttemptsCount(prev => {
      const newCount = prev + SECURITY_VIOLATION_PENALTY;
      
      // Guardar en localStorage
      const today = new Date().toDateString();
      localStorage.setItem(`dailyAttempts_${activeMod}_${today}`, newCount.toString());
      
      return newCount;
    });
    
    setAttemptsPenalized(prev => prev + SECURITY_VIOLATION_PENALTY);
    
    // Registrar penalización
    SECURITY_LOGGER.logViolation('PENALTY_APPLIED', {
      violations: securityViolations,
      attemptsPenalized: SECURITY_VIOLATION_PENALTY,
      dailyAttemptsCount: dailyAttemptsCount + SECURITY_VIOLATION_PENALTY
    });
    
    showSecurityMessageTemporary(`¡Penalización! Has perdido ${SECURITY_VIOLATION_PENALTY} intento por infracciones de seguridad`);
  }, [
    dailyAttemptsCount, activeMod, securityViolations,
    setDailyAttemptsCount, setAttemptsPenalized, showSecurityMessageTemporary
  ]);
  
  // ==================== FUNCIONES DE UTILIDAD ====================
  
  // Formatear tiempo (minutos:segundos)
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);
  
  // ==================== RETURN ====================
  
  return {
    // Estados (solo lectura)
    quizAnswers,
    quizScore,
    quizPassed,
    quizResult,
    showScoreResult,
    dailyAttemptsCount,
    quizAttempts,
    timeElapsed,
    isTimerRunning,
    showTimeWarning,
    currentQuestion,
    currentPage,
    showExamModal,
    securityWarningCount,
    screenshotProtectionActive,
    showSecurityMessage,
    securityMessage,
    
    // Constantes
    TOTAL_QUESTIONS,
    PASSING_SCORE,
    DAILY_ATTEMPTS_LIMIT,
    SUGGESTED_TIME_MINUTES,
    SUGGESTED_TIME_SECONDS,
    MAX_SECURITY_WARNINGS,
    SECURITY_WARNING_MESSAGES,
    SECURITY_VIOLATION_PENALTY,
    quizQuestions,
    
    // Funciones del quiz
    calculateQuizScore,
    canAttemptQuiz,
    generateTopicFeedback,
    resetQuizForRetry,
    submitQuiz,
    updateQuizAnswer,
    openEvaluation,
    closeEvaluationModal,
    
    // Funciones de seguridad
    SECURITY_LOGGER,
    showSecurityMessageTemporary,
    penalizeAttempt,
    
    // Funciones de utilidad
    formatTime,
    getLatestQuizAttempt,
    
    // Setters (para componentes que los necesiten)
    setQuizAnswers,
    setTimeElapsed,
    setIsTimerRunning,
    setShowTimeWarning,
    setCurrentQuestion,
    setCurrentPage,
    setShowExamModal,
    setSecurityWarningCount,
    setScreenshotProtectionActive,
    setShowSecurityMessage,
    setSecurityMessage,
  };
};

// Nota: user se obtiene del contexto cuando se usa este hook
// Para mantener la independencia del hook, se accede a través del contexto