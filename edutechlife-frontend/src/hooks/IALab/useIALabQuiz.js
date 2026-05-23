import { useCallback, useMemo } from 'react';
import { useIALabProgressContext, useIALabUIContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import {
  TOTAL_QUESTIONS, PASSING_SCORE, MAX_ATTEMPTS,
  SUGGESTED_TIME_SECONDS,
  MAX_SECURITY_WARNINGS, SECURITY_WARNING_MESSAGES,
  SECURITY_VIOLATION_PENALTY,
  SECURITY_MESSAGE_DURATION, SECURITY_LOG_PREFIX, MODULE_EXAMS,
} from '../../data/ialabQuizData';

export const useIALabQuiz = () => {
  const {
    activeMod, updateModuleActivity, markExamComplete,
  } = useIALabProgressContext();

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
  const timeElapsed = useIALabStore(s => s.timeElapsed);
  const setTimeElapsed = useIALabStore(s => s.setTimeElapsed);
  const isTimerRunning = useIALabStore(s => s.isTimerRunning);
  const setIsTimerRunning = useIALabStore(s => s.setIsTimerRunning);
  const showTimeWarning = useIALabStore(s => s.showTimeWarning);
  const setShowTimeWarning = useIALabStore(s => s.setShowTimeWarning);
  const showExamModal = useIALabStore(s => s.showExamModal);
  const setShowExamModal = useIALabStore(s => s.setShowExamModal);
  const currentQuestion = useIALabStore(s => s.currentQuestion);
  const setCurrentQuestion = useIALabStore(s => s.setCurrentQuestion);
  const securityWarningCount = useIALabStore(s => s.securityWarningCount);
  const setSecurityWarningCount = useIALabStore(s => s.setSecurityWarningCount);
  const securityViolations = useIALabStore(s => s.securityViolations);
  const setSecurityViolations = useIALabStore(s => s.setSecurityViolations);
  const screenshotProtectionActive = useIALabStore(s => s.screenshotProtectionActive);
  const setScreenshotProtectionActive = useIALabStore(s => s.setScreenshotProtectionActive);
  const showSecurityStatus = useIALabStore(s => s.showSecurityStatus);
  const setShowSecurityStatus = useIALabStore(s => s.setShowSecurityStatus);
  const showSecurityMessage = useIALabStore(s => s.showSecurityMessage);
  const setShowSecurityMessage = useIALabStore(s => s.setShowSecurityMessage);
  const securityMessage = useIALabStore(s => s.securityMessage);
  const setSecurityMessage = useIALabStore(s => s.setSecurityMessage);
  const attemptsPenalized = useIALabStore(s => s.attemptsPenalized);
  const setAttemptsPenalized = useIALabStore(s => s.setAttemptsPenalized);

  const { user } = useIALabUIContext();

  const quizQuestions = MODULE_EXAMS[activeMod] || MODULE_EXAMS[1];

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
      neededToPass: Math.ceil((PASSING_SCORE / 100) * TOTAL_QUESTIONS)
    };
  }, [quizQuestions]);

  const canAttemptQuiz = useCallback(() => {
    const remaining = useIALabStore.getState().storageGetInt(`exam_attempts_remaining_m${activeMod}`, MAX_ATTEMPTS);
    if (remaining <= 0) return false;
    const nextTime = useIALabStore.getState().storageGet(`exam_next_attempt_m${activeMod}`, null);
    if (nextTime && Date.now() < nextTime) return false;
    return true;
  }, [activeMod]);

  const generateTopicFeedback = useCallback((failedQuestions) => {
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

      questions.forEach(question => {
        if (question.feedback) {
          message += ` ${question.feedback}`;
        }
      });

      feedbackMessages.push(message);
    });

    return feedbackMessages;
  }, [quizQuestions]);

  const getLatestQuizAttempt = useCallback(() => {
    if (quizAttempts.length === 0) return null;
    return quizAttempts[quizAttempts.length - 1];
  }, [quizAttempts]);

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
    setSecurityWarningCount(0);
    setSecurityViolations(0);
    setScreenshotProtectionActive(false);
    setShowSecurityStatus(false);
    setShowSecurityMessage(false);
  }, [
    setQuizAnswers, setQuizScore, setQuizPassed, setQuizResult, setShowScoreResult,
    setDailyAttemptsCount, setTimeElapsed, setIsTimerRunning, setShowTimeWarning,
    setCurrentQuestion, setSecurityWarningCount, setSecurityViolations,
    setScreenshotProtectionActive, setShowSecurityStatus, setShowSecurityMessage
  ]);

  const submitQuiz = useCallback(async () => {
    let result;
    try {
      result = calculateQuizScore(quizAnswers);

      setQuizScore(result.score);
      setQuizPassed(result.passed);
      setQuizResult(result);
      setShowScoreResult(true);

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

      const updatedAttempts = [...quizAttempts, attempt];
      setQuizAttempts(updatedAttempts);
      useIALabStore.getState().storageSet(`quizAttempts_${activeMod}`, updatedAttempts);

      setIsTimerRunning(false);

      return { success: true, result };

    } catch (error) {
      console.error('Error al enviar quiz:', error);
      return { success: false, error: error.message, result };
    }
  }, [
    quizAnswers, activeMod, quizAttempts, timeElapsed,
    calculateQuizScore, setQuizScore, setQuizPassed, setQuizResult, setShowScoreResult,
    setQuizAttempts, setDailyAttemptsCount, setLastAttemptDate, setIsTimerRunning
  ]);

  const updateQuizAnswer = useCallback((questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, [setQuizAnswers]);

  const openEvaluation = useCallback(() => {
    if (!canAttemptQuiz()) {
      const nextTime = useIALabStore.getState().storageGet(`exam_next_attempt_m${activeMod}`, null);
      const hoursLeft = nextTime ? Math.ceil((nextTime - Date.now()) / 3600000) : 12;
      setSecurityMessage(`Debes esperar ${hoursLeft}h para intentar de nuevo. (${MAX_ATTEMPTS} intentos máximo, 12h entre cada uno).`);
      setShowSecurityMessage(true);
      setTimeout(() => setShowSecurityMessage(false), 4000);
      return false;
    }

    setShowExamModal(true);
    setIsTimerRunning(true);
    setSecurityWarningCount(0);
    resetQuizForRetry();

    return true;
  }, [
    canAttemptQuiz, activeMod, setShowExamModal, setIsTimerRunning, setSecurityWarningCount,
    setSecurityMessage, setShowSecurityMessage, resetQuizForRetry
  ]);

  const closeEvaluationModal = useCallback((forceClose = false) => {
    setShowExamModal(false);
    resetQuizForRetry();
    return true;
  }, [resetQuizForRetry, setShowExamModal]);

  const SECURITY_LOGGER = useMemo(() => ({
    logViolation: (type, details = {}) => {
      const s = useIALabStore.getState();
      const logEntry = {
        id: Date.now(),
        type,
        timestamp: new Date().toISOString(),
        moduleId: s.activeMod,
        userId: s.user?.id || 'anonymous',
        details,
        violationCount: s.securityViolations + 1
      };

      const logKey = `${SECURITY_LOG_PREFIX}_${s.user?.id || 'anonymous'}_${new Date().toDateString()}`;
      const existingLogs = s.storageGet(logKey) || [];
      const logs = existingLogs;

      logs.push(logEntry);

      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      s.storageSet(logKey, logs);

      s.setSecurityViolations((prev) => prev + 1);
      showSecurityMessageTemporary(`Violación de seguridad: ${type}`);

      return logEntry;
    },

    getViolationsToday: () => {
      const s = useIALabStore.getState();
      const logKey = `${SECURITY_LOG_PREFIX}_${s.user?.id || 'anonymous'}_${new Date().toDateString()}`;
      return s.storageGet(logKey) || [];
    },

    getViolationCountToday: () => {
      return SECURITY_LOGGER.getViolationsToday().length;
    },

    clearOldLogs: () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const s = useIALabStore.getState();
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith(SECURITY_LOG_PREFIX)) {
          try {
            const logs = s.storageGet(key) || [];
            if (logs.length > 0) {
              const firstLogDate = new Date(logs[0].timestamp);
              if (firstLogDate < thirtyDaysAgo) {
                s.storageRemove(key);
              }
            }
          } catch (error) {
            console.error('Error al limpiar logs antiguos:', error);
          }
        }
      }
    }
  }), []);

  const showSecurityMessageTemporary = useCallback((message) => {
    setSecurityMessage(message);
    setShowSecurityMessage(true);

    setTimeout(() => {
      setShowSecurityMessage(false);
    }, SECURITY_MESSAGE_DURATION);
  }, [setSecurityMessage, setShowSecurityMessage]);

  const penalizeAttempt = useCallback(() => {
    const remaining = useIALabStore.getState().storageGetInt(`exam_attempts_remaining_m${activeMod}`, MAX_ATTEMPTS);
    if (remaining <= 0) {
      showSecurityMessageTemporary('Ya no te quedan intentos disponibles');
      return;
    }

    const newRemaining = Math.max(0, remaining - SECURITY_VIOLATION_PENALTY);
    useIALabStore.getState().storageSet(`exam_attempts_remaining_m${activeMod}`, newRemaining);
    window.dispatchEvent(new Event('ialab:attemptsUpdated'));

    setAttemptsPenalized(prev => prev + SECURITY_VIOLATION_PENALTY);

    SECURITY_LOGGER.logViolation('PENALTY_APPLIED', {
      violations: securityViolations,
      attemptsPenalized: SECURITY_VIOLATION_PENALTY,
      remainingAttempts: newRemaining
    });

    showSecurityMessageTemporary(`¡Penalización! Has perdido ${SECURITY_VIOLATION_PENALTY} intento por infracciones de seguridad`);
  }, [activeMod, securityViolations, setAttemptsPenalized, showSecurityMessageTemporary]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  return {
    quizQuestions,
    TOTAL_QUESTIONS,
    PASSING_SCORE,
    SUGGESTED_TIME_SECONDS,
    MAX_SECURITY_WARNINGS,
    SECURITY_WARNING_MESSAGES,
    canAttemptQuiz,
    submitQuiz,
    updateQuizAnswer,
    openEvaluation,
    closeEvaluationModal,
    generateTopicFeedback,
    formatTime,
  };
};
