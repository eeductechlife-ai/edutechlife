import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabQuiz } from '../../hooks/IALab/useIALabQuiz';
import { motion, AnimatePresence } from 'framer-motion';

const IALabQuizModal = ({ isOpen, onClose }) => {
  const {
    quizQuestions,
    quizAnswers,
    quizScore,
    quizPassed,
    quizResult,
    showScoreResult,
    dailyAttemptsCount,
    DAILY_ATTEMPTS_LIMIT,
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

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
    await submitQuiz();
    setIsSubmitting(false);
  };

  const handleClose = () => {
    closeEvaluationModal();
    onClose();
  };

  const handleRetry = () => {
    handleClose();
    setTimeout(() => {
      if (canAttemptQuiz()) {
        openEvaluation();
      }
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
    <div className="bg-gradient-to-r from-[#004B63] to-[#00BCD4] px-6 py-4 flex items-center justify-between z-50">
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
              className="h-full bg-[#004B63] transition-all duration-500"
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-lg shadow-[#004B63]/20 mt-0.5 flex-shrink-0">
              <span className="text-white font-bold text-sm">{currentQuestion + 1}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed">
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
                    ? 'border-[#00BCD4] bg-[#00BCD4]/5 shadow-[0_0_15px_rgba(0,188,212,0.15)]'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
                  isSelected
                    ? 'border-[#00BCD4] bg-[#00BCD4]'
                    : 'border-slate-300'
                }`}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className={`text-sm md:text-base leading-relaxed ${
                  isSelected ? 'text-[#004B63] font-medium' : 'text-slate-700'
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
    <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
      <button
        onClick={handlePrev}
        disabled={currentQuestion === 0}
        className="px-5 py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Icon name="fa-arrow-left" className="text-sm" />
        <span className="text-sm font-medium">Anterior</span>
      </button>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          {Object.keys(quizAnswers).length} de {TOTAL_QUESTIONS} respondidas
        </span>
      </div>

      {currentQuestion < TOTAL_QUESTIONS - 1 ? (
        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="px-5 py-2.5 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span className="text-sm font-medium">Siguiente</span>
          <Icon name="fa-arrow-right" className="text-sm" />
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

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-1">{quizResult.correctCount}</div>
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

          <div className="flex flex-col gap-3">
            <button
              onClick={handleClose}
              className="w-full py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 font-medium"
            >
              Volver al módulo
            </button>
            {!passed && dailyAttemptsCount < DAILY_ATTEMPTS_LIMIT && (
              <button
                onClick={handleRetry}
                className="w-full py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 font-medium"
              >
                Reintentar examen
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-slate-50 flex flex-col min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderHeader()}

          <div className="flex-1 overflow-y-auto min-h-0">
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
