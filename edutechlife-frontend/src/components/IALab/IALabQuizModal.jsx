import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabQuiz } from '../../hooks/IALab/useIALabQuiz';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import { useNotification } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const IALabQuizModal = ({ isOpen, onClose }) => {
  const {
    quizQuestions,
    quizAnswers,
    quizScore,
    quizPassed,
    quizResult,
    showScoreResult,
    generateTopicFeedback,
    TOTAL_QUESTIONS,
    PASSING_SCORE,
    SUGGESTED_TIME_SECONDS,
    currentQuestion,
    timeElapsed,
    isTimerRunning,
    showTimeWarning,
    securityWarningCount,
    MAX_SECURITY_WARNINGS,
    SECURITY_WARNING_MESSAGES,
    showSecurityMessage,
    securityMessage,
    canAttemptQuiz,
    submitQuiz,
    updateQuizAnswer,
    openEvaluation,
    closeEvaluationModal,
    setCurrentQuestion,
    formatTime,
  } = useIALabQuiz();

  const { activeMod } = useIALabContext();
  const { createNotification } = useNotification();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Security handlers
  const preventDefaultEvent = (e) => e.preventDefault();

  // Detectar cambio de ventana/tab y cerrar examen a la 3ra infracción
  useEffect(() => {
    if (!isVisible || showScoreResult) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = (securityWarningCount || 0) + 1;
        if (newCount >= MAX_SECURITY_WARNINGS) {
          alert(SECURITY_WARNING_MESSAGES[2]);
          closeEvaluationModal();
          onClose();
        } else {
          alert(SECURITY_WARNING_MESSAGES[newCount - 1]);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isVisible, showScoreResult, securityWarningCount]);

  // Bloquear atajos de teclado (Ctrl+C, Ctrl+V, Ctrl+P, F12)
  useEffect(() => {
    if (!isVisible || showScoreResult) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'p' || e.key === 's' || e.key === 'u')) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, showScoreResult]);

  // Bloquear capturas de pantalla / impresión
  useEffect(() => {
    if (!isVisible || showScoreResult) return;
    const handleBeforePrint = () => {
      alert('⚠️ Capturas de pantalla e impresión bloqueadas por seguridad del examen.');
    };
    window.addEventListener('beforeprint', handleBeforePrint);
    return () => window.removeEventListener('beforeprint', handleBeforePrint);
  }, [isVisible, showScoreResult]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      openEvaluation();
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (quizAnswers[quizQuestions[currentQuestion]?.id]) {
      setSelectedAnswer(quizAnswers[quizQuestions[currentQuestion]?.id]);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestion, quizAnswers, quizQuestions]);

  const handleSelectAnswer = (answerId) => {
    const questionId = quizQuestions[currentQuestion]?.id;
    if (questionId) {
      updateQuizAnswer(questionId, answerId);
      setSelectedAnswer(answerId);
    }
  };

  const handleNext = () => {
    if (currentQuestion < TOTAL_QUESTIONS - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const submitResult = await submitQuiz();
    setIsSubmitting(false);
    
    // Resultado ya guardado dentro de submitQuiz via updateModuleActivity + markExamComplete
    if (submitResult?.success && submitResult?.result) {
      createNotification({
        type: submitResult.result.passed ? 'success' : 'warning',
        title: submitResult.result.passed ? '📝 Examen Aprobado' : '📝 Examen No Aprobado',
        message: `Tu nota en el examen del Módulo ${activeMod} fue ${submitResult.result.score}%. ${submitResult.result.passed ? '¡Buen trabajo!' : 'Necesitas 80% para aprobar. Revisa los temas y vuelve a intentarlo.'}`,
        metadata: { moduleId: activeMod, score: submitResult.result.score, type: 'exam' }
      });
    }
  };

  const handleClose = () => {
    closeEvaluationModal();
    onClose();
  };

  const handleRetry = () => {
    const store = useIALabStore.getState();
    if (!store.canAttemptChallengeRetry) {
      const remaining = store.storageGetInt(`exam_attempts_remaining_m${activeMod}`, 3);
      if (remaining <= 0) {
        alert('Has agotado tus 3 intentos para este examen.');
        return;
      }
      const nextTime = store.storageGet(`exam_next_attempt_m${activeMod}`, null);
      if (nextTime && Date.now() < nextTime) {
        const hoursLeft = Math.ceil((nextTime - Date.now()) / 3600000);
        alert(`Debes esperar ${hoursLeft}h para intentar de nuevo. (3 intentos máximo, 12h entre cada uno).`);
        return;
      }
    }
    const current = store.storageGetInt(`exam_attempts_remaining_m${activeMod}`, 3);
    store.storageSet(`exam_attempts_remaining_m${activeMod}`, Math.max(0, current - 1));
    store.storageSet(`exam_next_attempt_m${activeMod}`, Date.now() + 12 * 60 * 60 * 1000);
    handleClose();
    setTimeout(() => {
      openEvaluation();
    }, 300);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'fácil': return 'bg-emerald-100 text-emerald-700';
      case 'medio': return 'bg-amber-100 text-amber-700';
      case 'difícil': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const renderHeader = () => (
    <div className="bg-gradient-to-r from-petroleum to-corporate px-6 py-4 flex items-center justify-between z-50">
      <button
        onClick={handleClose}
        className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
      >
        <Icon name="fa-arrow-left" className="text-sm" />
        <span className="text-sm font-medium">Salir</span>
      </button>

      <div className="flex items-center gap-6">
        {isTimerRunning && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
            timeElapsed > SUGGESTED_TIME_SECONDS * 0.8
              ? 'bg-red-50 border border-red-200 text-red-600'
              : 'bg-white/10 border border-white/20 text-white/90'
          }`}>
            <Icon name="fa-clock" className="text-sm" />
            <span className="text-sm font-mono font-bold">{formatTime(timeElapsed)}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="text-sm text-white/80">
            {currentQuestion + 1} de {TOTAL_QUESTIONS}
          </span>
          <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-petroleum transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / TOTAL_QUESTIONS) * 100}%` }}
            ></div>
          </div>
        </div>

        {showSecurityMessage && (
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="text-xs text-amber-700">{securityMessage}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderQuestion = () => {
    const question = quizQuestions[currentQuestion];
    if (!question) return null;

    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center shadow-lg shadow-petroleum/20 mt-0.5 flex-shrink-0">
              <span className="text-white font-bold text-sm">{currentQuestion + 1}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                {question.question}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-500">{question.topic}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 max-w-4xl">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-300 flex items-start gap-3 ${
                  isSelected
                    ? 'border-corporate bg-corporate/5 shadow-[0_0_15px_rgba(0,188,212,0.15)] dark:border-[#66CCCC] dark:bg-[#66CCCC]/10 dark:shadow-[#66CCCC]/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:border-slate-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
                  isSelected
                    ? 'border-corporate bg-corporate'
                    : 'border-slate-300'
                }`}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className={`text-sm md:text-base leading-relaxed ${
                  isSelected ? 'text-petroleum dark:text-[#4DA8C4] font-medium' : 'text-slate-700 dark:text-slate-200'
                }`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderNavigation = () => (
    <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
      <button
        onClick={handlePrev}
        disabled={currentQuestion === 0}
        className="px-5 py-2.5 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
                        <Icon name="fa-arrow-left" className="text-sm" />
                        <span className="hidden sm:inline text-sm font-medium">Anterior</span>
      </button>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          {Object.keys(quizAnswers).length} de {TOTAL_QUESTIONS} respondidas
        </span>
      </div>

      {currentQuestion < TOTAL_QUESTIONS - 1 ? (
        <button
          onClick={handleNext}
          disabled={!quizAnswers[quizQuestions[currentQuestion]?.id]}
          className="px-5 py-2.5 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
                          <span className="text-sm font-medium">Siguiente</span>
                          <Icon name="fa-arrow-right" className="text-sm hidden sm:inline" />
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(quizAnswers).length < TOTAL_QUESTIONS || isSubmitting}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Enviando...</span>
            </>
          ) : (
            <>
              <Icon name="fa-paper-plane" className="text-sm" />
              <span className="text-sm font-medium">Enviar examen</span>
            </>
          )}
        </button>
      )}
    </div>
  );

  const renderResults = () => {
    if (!quizResult) return null;

    const passed = quizPassed;
    const score = quizScore;

    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 ${
              passed
                ? 'bg-emerald-50'
                : 'bg-red-50'
            }`}>
              <div className="relative">
                <Icon
                  name={passed ? 'fa-trophy' : 'fa-exclamation-circle'}
                  className={`text-5xl ${passed ? 'text-emerald-500' : 'text-red-500'}`}
                />
                <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  passed ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {score}%
                </div>
              </div>
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
              {passed ? '¡Examen Aprobado!' : 'Examen No Aprobado'}
            </h2>
            <p className="text-slate-600">
              {passed
                ? 'Has demostrado comprensión de los temas del módulo.'
                : `No alcanzaste el mínimo de ${PASSING_SCORE}%. Revisa los temas y vuelve a intentarlo.`}
            </p>
          </div>

          <div className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">{quizResult.correctCount}</div>
                <div className="text-xs text-slate-500">Correctas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-1">{TOTAL_QUESTIONS - quizResult.correctCount}</div>
                <div className="text-xs text-slate-500">Incorrectas</div>
              </div>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  passed
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : 'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-400">0%</span>
              <span className="text-xs text-slate-400">{PASSING_SCORE}% mínimo</span>
              <span className="text-xs text-slate-400">100%</span>
            </div>
          </div>

          {!passed && quizResult?.failedQuestions?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <h4 className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1.5">
                <Icon name="fa-lightbulb" className="text-sm" />
                Áreas de mejora
              </h4>
              <p className="text-xs text-red-600 leading-relaxed">
                {generateTopicFeedback(quizResult.failedQuestions).map((msg, i) => (
                  <span key={i} className="block mb-1">{msg}</span>
                ))}
              </p>
            </div>
          )}

          {passed && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
              <h4 className="text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1.5">
                <Icon name="fa-check-circle" className="text-sm" />
                  Buen trabajo
                </h4>
                <p className="text-xs text-emerald-600 leading-relaxed">
                  Has demostrado comprensión sólida de los temas. Revisa el feedback de cada pregunta para seguir perfeccionando tus conocimientos.
                </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleClose}
              className="w-full py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 font-medium"
            >
              Volver al módulo
            </button>
            {!passed && (() => {
              const remaining = useIALabStore.getState().storageGetInt(`exam_attempts_remaining_m${activeMod}`, 3);
              const nextTime = useIALabStore.getState().storageGet(`exam_next_attempt_m${activeMod}`, null);
              const inCooldown = nextTime && Date.now() < nextTime;
              const hoursLeft = nextTime ? Math.ceil((nextTime - Date.now()) / 3600000) : 12;
              if (remaining > 0 && !inCooldown) {
                return (
                  <>
                    <button onClick={handleRetry} className="w-full py-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300 font-medium">Reintentar examen</button>
                    <p className="text-xs text-center text-slate-400">Te quedan {remaining - 1} de 3 intentos. Cada intento tiene un cooldown de 12h.</p>
                  </>
                );
              }
              if (remaining > 0 && inCooldown) {
                return <p className="text-xs text-center text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">Espera {hoursLeft}h para tu siguiente intento. (12h entre cada uno, 3 intentos máximo).</p>;
              }
              return <p className="text-xs text-center text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">Has agotado tus 3 intentos para este examen. No puedes volver a intentarlo.</p>;
            })()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-900 flex flex-col min-h-0"
          onCopy={preventDefaultEvent}
          onPaste={preventDefaultEvent}
          onCut={preventDefaultEvent}
          onContextMenu={preventDefaultEvent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderHeader()}

          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Watermark de seguridad - anti-screenshot */}
            {!showScoreResult && (
              <div className="fixed inset-0 pointer-events-none z-[101] opacity-[0.03] select-none" style={{
                background: `repeating-linear-gradient(45deg, var(--color-petroleum), var(--color-petroleum) 2px, transparent 2px, transparent 60px)`,
              }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-petroleum dark:text-[#4DA8C4] text-8xl font-bold transform -rotate-12 select-none" style={{ whiteSpace: 'nowrap' }}>
                    EXAMEN EDUTECHLIFE
                  </span>
                </div>
              </div>
            )}
            <AnimatePresence mode="wait">
              {showScoreResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  {renderResults()}
                </motion.div>
              ) : (
                <motion.div
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="max-w-4xl mx-auto py-6">
                    {renderQuestion()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!showScoreResult && renderNavigation()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IALabQuizModal;
