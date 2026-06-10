import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types';;
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useIALabQuiz } from '../../../hooks/IALab/useIALabQuiz';
import { useIALabProgressContext } from '../../../context/IALabContext';
import { useIALabStore } from '../../../store/ialabStore';
import { useNotification } from '../../../context/NotificationContext';
import { useTranslation } from '../../../i18n/I18nProvider';
import useFocusTrap from '../../../hooks/useFocusTrap';
import SecurityWarningModal from '../SecurityWarningModal';
import ScreenshotProtectionOverlay from '../ScreenshotProtectionOverlay';
import { useQuizSecurity } from './hooks/useQuizSecurity';
import { QuizTimer } from './components/QuizTimer';
import { QuestionProgressBar } from './components/QuestionProgressBar';
import { QuestionRenderer } from './components/QuestionRenderer';
import { NavigationBar } from './components/NavigationBar';
import { QuizResults } from './components/QuizResults';
import { SubmitConfirmDialog } from './components/SubmitConfirmDialog';

/**
 * IALabQuizModal — Modal de pantalla completa para realizar exámenes.
 * Renderiza preguntas, timer, barra de progreso y resultados.
 * Incluye protección anti-captura de pantalla y advertencias de seguridad.
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen  - Controla la visibilidad del modal
 * @param {Function} props.onClose - Callback al cerrar el modal
 */
const IALabQuizModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const userRole = useIALabStore(s => s.userRole);
  const isAdmin = userRole === 'admin';
  const {
    quizQuestions, TOTAL_QUESTIONS, PASSING_SCORE, SUGGESTED_TIME_SECONDS,
    MAX_SECURITY_WARNINGS,
    canAttemptQuiz, submitQuiz, updateQuizAnswer, openEvaluation,
    closeEvaluationModal, generateTopicFeedback, formatTime,
    penalizeAttempt,
  } = useIALabQuiz();

  const { activeMod, markExamComplete } = useIALabProgressContext();

  const quizAnswers = useIALabStore(s => s.quizAnswers);
  const quizScore = useIALabStore(s => s.quizScore);
  const quizPassed = useIALabStore(s => s.quizPassed);
  const quizResult = useIALabStore(s => s.quizResult);
  const showScoreResult = useIALabStore(s => s.showScoreResult);
  const currentQuestion = useIALabStore(s => s.currentQuestion);
  const timeElapsed = useIALabStore(s => s.timeElapsed);
  const isTimerRunning = useIALabStore(s => s.isTimerRunning);
  const setCurrentQuestion = useIALabStore(s => s.setCurrentQuestion);
  const setTimeElapsed = useIALabStore(s => s.setTimeElapsed);
  const { createNotification } = useNotification();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState(new Set());
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const toggleMarkForReview = useCallback((questionId) => {
    setMarkedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  const unansweredCount = quizQuestions.filter(q => !quizAnswers[q.id]).length;

  const {
    securityAlert, setSecurityAlert,
    printWarning, setPrintWarning,
    showSecurityMessage, securityMessage,
    showOverlay,
    preventDefaultEvent,
  } = useQuizSecurity({
    isVisible,
    showScoreResult,
    MAX_SECURITY_WARNINGS,
    onSecurityMaxOut: () => {
      penalizeAttempt();
      closeEvaluationModal();
      onClose();
    },
  });

  const handleClose = useCallback(() => {
    closeEvaluationModal();
    onClose();
  }, [closeEvaluationModal, onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      openEvaluation();
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, openEvaluation]);

  useEffect(() => {
    if (quizAnswers[quizQuestions[currentQuestion]?.id]) {
      setSelectedAnswer(quizAnswers[quizQuestions[currentQuestion]?.id]);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestion, quizAnswers, quizQuestions]);

  const handleSelectAnswer = useCallback((answerId) => {
    const questionId = quizQuestions[currentQuestion]?.id;
    if (questionId) {
      updateQuizAnswer(questionId, answerId);
      setSelectedAnswer(answerId);
    }
  }, [currentQuestion, quizQuestions, updateQuizAnswer]);

  const handleNext = useCallback(() => {
    if (currentQuestion < TOTAL_QUESTIONS - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }, [currentQuestion, TOTAL_QUESTIONS, setCurrentQuestion]);

  const handlePrev = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [currentQuestion, setCurrentQuestion]);

  const performSubmit = useCallback(async () => {
    setIsSubmitting(true);
    const submitResult = await submitQuiz();
    setIsSubmitting(false);

    if (!practiceMode && submitResult?.result) {
      const { score, passed } = submitResult.result;
      const st = useIALabStore.getState();
      st.updateModuleActivity(activeMod, 'exam', passed, score);
      try {
        const key = 'ialab_completed_exams';
        const current = JSON.parse(localStorage.getItem(key) || '{}');
        current[activeMod] = score;
        localStorage.setItem(key, JSON.stringify(current));
      } catch (e) { /* ignore */ }

      if (markExamComplete) {
        markExamComplete(activeMod, score).catch((err) => {
          console.error('Error al sincronizar examen completado:', err);
          createNotification({
            type: 'error', title: t('ialab.quiz.sync_error_title'),
            message: t('ialab.quiz.sync_error_msg'),
            metadata: { moduleId: activeMod, score },
          });
        });
      }

      window.dispatchEvent(new CustomEvent('ialab:examCompleted', {
        detail: { moduleId: activeMod, score, passed },
      }));
    }

    if (!practiceMode && submitResult?.success && submitResult?.result) {
      createNotification({
        type: submitResult.result.passed ? 'success' : 'warning',
        title: submitResult.result.passed ? t('ialab.quiz.exam_passed_notif_title') : t('ialab.quiz.exam_failed_notif_title'),
        message: t('ialab.quiz.exam_notif_message', {
          module: activeMod,
          score: submitResult.result.score,
          result: submitResult.result.passed ? t('ialab.quiz.exam_passed_result') : t('ialab.quiz.exam_failed_result'),
        }),
        metadata: { moduleId: activeMod, score: submitResult.result.score, type: 'exam' },
      });
    }
  }, [practiceMode, submitQuiz, activeMod, markExamComplete, t, createNotification]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (unansweredCount > 0 && !showSubmitConfirm) {
      setShowSubmitConfirm(true);
      return;
    }
    setShowSubmitConfirm(false);
    await performSubmit();
  }, [isSubmitting, unansweredCount, showSubmitConfirm, performSubmit]);

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => { handleSubmitRef.current = handleSubmit; }, [handleSubmit]);

  useEffect(() => {
    if (!isTimerRunning || showScoreResult) return;
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, showScoreResult, setTimeElapsed]);

  useEffect(() => {
    if (isTimerRunning && !showScoreResult && !isSubmitting && timeElapsed >= SUGGESTED_TIME_SECONDS) {
      handleSubmitRef.current();
    }
  }, [timeElapsed, isTimerRunning, showScoreResult, isSubmitting, SUGGESTED_TIME_SECONDS]);

  const handleRetry = useCallback(() => {
    const store = useIALabStore.getState();
    if (!store.canAttemptExamRetry(activeMod)) {
      const remaining = store.getExamRemainingAttempts(activeMod);
      if (remaining <= 0) {
        alert(t('ialab.quiz.exam_retry_alert_attempts'));
        return;
      }
      const nextTime = store.getExamNextAttemptTime(activeMod);
      if (nextTime && Date.now() < nextTime) {
        const hoursLeft = Math.ceil((nextTime - Date.now()) / 3600000);
        alert(t('ialab.quiz.exam_retry_alert_cooldown', { hours: hoursLeft }));
        return;
      }
    }
    store.decrementExamAttempt(activeMod);
    handleClose();
    setTimeout(() => { openEvaluation(); }, 300);
  }, [activeMod, t, handleClose, openEvaluation]);

  const handleSelectQuestion = useCallback((idx) => {
    setCurrentQuestion(idx);
  }, [setCurrentQuestion]);

  const focusTrapRef = useFocusTrap(isVisible);

  const watermarkContent = !showScoreResult && (
    <div
      className="fixed inset-0 pointer-events-none z-[101] opacity-[0.03] select-none"
      style={{
        background: `repeating-linear-gradient(45deg, var(--color-petroleum), var(--color-petroleum) 2px, transparent 2px, transparent 60px)`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-petroleum text-8xl font-bold transform -rotate-12 select-none"
          style={{ whiteSpace: 'nowrap' }}
        >
          {t('ialab.quiz.watermark')}
        </span>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={focusTrapRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('ialab.quiz.dialog_label')}
          className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-900 flex flex-col min-h-0 select-none"
          style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
          onCopy={preventDefaultEvent}
          onPaste={preventDefaultEvent}
          onCut={preventDefaultEvent}
          onContextMenu={preventDefaultEvent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
        >
          <a
            href="#quiz-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[110] focus:px-4 focus:py-2 focus:bg-white focus:text-petroleum focus:rounded-lg focus:text-sm focus:font-bold focus:shadow-lg"
          >
            {t('ialab.skip_link')}
          </a>

          <QuizTimer
            timeElapsed={timeElapsed}
            suggestedTime={SUGGESTED_TIME_SECONDS}
            currentQuestion={currentQuestion}
            totalQuestions={TOTAL_QUESTIONS}
            isTimerRunning={isTimerRunning}
            showSecurityMessage={showSecurityMessage}
            securityMessage={securityMessage}
            practiceMode={practiceMode}
            onTogglePractice={() => setPracticeMode(p => !p)}
            onClose={handleClose}
            formatTime={formatTime}
          />

          <QuestionProgressBar
            quizQuestions={quizQuestions}
            quizAnswers={quizAnswers}
            currentQuestion={currentQuestion}
            markedQuestions={markedQuestions}
            onSelectQuestion={handleSelectQuestion}
            showScoreResult={showScoreResult}
          />

          <div className="flex-1 overflow-y-auto min-h-0">
            {watermarkContent}
            <AnimatePresence mode="wait">
              {showScoreResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  <QuizResults
                    quizQuestions={quizQuestions}
                    quizAnswers={quizAnswers}
                    quizScore={quizScore}
                    quizPassed={quizPassed}
                    quizResult={quizResult}
                    activeMod={activeMod}
                    PASSING_SCORE={PASSING_SCORE}
                    TOTAL_QUESTIONS={TOTAL_QUESTIONS}
                    generateTopicFeedback={generateTopicFeedback}
                    isAdmin={isAdmin}
                    onClose={handleClose}
                    onRetry={handleRetry}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
                >
                  <div id="quiz-content" className="max-w-4xl mx-auto py-6">
                    <QuestionRenderer
                      question={quizQuestions[currentQuestion]}
                      questionIndex={currentQuestion}
                      totalQuestions={TOTAL_QUESTIONS}
                      selectedAnswer={selectedAnswer}
                      markedQuestions={markedQuestions}
                      onSelectAnswer={handleSelectAnswer}
                      onToggleMark={toggleMarkForReview}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!showScoreResult && (
            <NavigationBar
              currentQuestion={currentQuestion}
              totalQuestions={TOTAL_QUESTIONS}
              hasAnsweredCurrent={!!quizAnswers[quizQuestions[currentQuestion]?.id]}
              isSubmitting={isSubmitting}
              answeredCount={Object.keys(quizAnswers).length}
              onPrev={handlePrev}
              onNext={handleNext}
              onSubmit={() => handleSubmit()}
            />
          )}
        </motion.div>
      )}

      <SecurityWarningModal
        isOpen={!!securityAlert}
        message={securityAlert?.message || ''}
        level={securityAlert?.level || 1}
        onClose={securityAlert?.onClose || (() => setSecurityAlert(null))}
      />

      <SecurityWarningModal
        isOpen={!!printWarning}
        message={printWarning || ''}
        level={1}
        onClose={() => setPrintWarning(null)}
      />

      <ScreenshotProtectionOverlay isOpen={showOverlay && !showScoreResult} />

      <SubmitConfirmDialog
        isOpen={showSubmitConfirm}
        unansweredCount={unansweredCount}
        onConfirm={() => {
          setShowSubmitConfirm(false);
          performSubmit();
        }}
        onCancel={() => setShowSubmitConfirm(false)}
      />
    </AnimatePresence>
  );
};


IALabQuizModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default IALabQuizModal;
