import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import useIALabEvaluation from '../../../hooks/IALab/useIALabEvaluation';
import IALabEvaluationResults from '../IALabEvaluationResults';
import SecurityWarningModal from '../SecurityWarningModal';
import ScreenshotProtectionOverlay from '../ScreenshotProtectionOverlay';
import useScreenshotProtection from '../../../hooks/IALab/useScreenshotProtection';
import ValerioChallengeIntro from '../challenges/challengeIntro/ValerioChallengeIntro';
import IALabEvaluationStep1 from '../IALabEvaluationStep1';
import IALabEvaluationStep2 from '../IALabEvaluationStep2';
import IALabEvaluationStep3 from '../IALabEvaluationStep3';
import ChatGPTStep1 from '../challenges/module2/ChatGPTStep1';
import ChatGPTStep2 from '../challenges/module2/ChatGPTStep2';
import ChatGPTStep3 from '../challenges/module2/ChatGPTStep3';
import GeminiStep1 from '../challenges/module3/GeminiStep1';
import GeminiStep2 from '../challenges/module3/GeminiStep2';
import GeminiStep3 from '../challenges/module3/GeminiStep3';
import GeminiStep4 from '../challenges/module3/GeminiStep4';
import NotebookStep1 from '../challenges/module4/NotebookStep1';
import NotebookStep2 from '../challenges/module4/NotebookStep2';
import NotebookStep3 from '../challenges/module4/NotebookStep3';
import EthicsStep1 from '../challenges/module5/EthicsStep1';
import EthicsStep2 from '../challenges/module5/EthicsStep2';
import EthicsStep3 from '../challenges/module5/EthicsStep3';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { useTranslation } from '../../../i18n/I18nProvider';
import { useEvaluationSecurity } from './hooks/useEvaluationSecurity';
import { useEvaluationDraft } from './hooks/useEvaluationDraft';
import { EvaluationHeader } from './components/EvaluationHeader';
import { LoadingState, ErrorState, StepContent } from './components/EvaluationContent';

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefersReducedMotion;
};

const STEP_COMPONENTS = {
  1: [IALabEvaluationStep1, IALabEvaluationStep2, IALabEvaluationStep3],
  2: [ChatGPTStep1, ChatGPTStep2, ChatGPTStep3],
  3: [GeminiStep1, GeminiStep2, GeminiStep3, GeminiStep4],
  4: [NotebookStep1, NotebookStep2, NotebookStep3],
  5: [EthicsStep1, EthicsStep2, EthicsStep3],
};

const STEP_TITLE_KEYS = {
  1: ['ialab.evaluation.modal.step1_title', 'ialab.evaluation.modal.step2_title', 'ialab.evaluation.modal.step3_title'],
  2: ['ialab.challenge.m2.step1_title', 'ialab.challenge.m2.step2_title', 'ialab.challenge.m2.step3_title'],
  3: ['ialab.challenge.m3.step1_title', 'ialab.challenge.m3.step2_title', 'ialab.challenge.m3.step3_title', 'ialab.challenge.m3.step4_title'],
  4: ['ialab.challenge.m4.step1_title', 'ialab.challenge.m4.step2_title', 'ialab.challenge.m4.step3_title'],
  5: ['ialab.challenge.m5.step1_title', 'ialab.challenge.m5.step2_title', 'ialab.challenge.m5.step3_title'],
};

const STEP_DESC_KEYS = {
  1: ['ialab.evaluation.modal.step1_desc', 'ialab.evaluation.modal.step2_desc', 'ialab.evaluation.modal.step3_desc'],
  2: ['ialab.challenge.m2.step1_desc', 'ialab.challenge.m2.step2_desc', 'ialab.challenge.m2.step3_desc'],
  3: ['ialab.challenge.m3.step1_desc', 'ialab.challenge.m3.step2_desc', 'ialab.challenge.m3.step3_desc', 'ialab.challenge.m3.step4_desc'],
  4: ['ialab.challenge.m4.step1_desc', 'ialab.challenge.m4.step2_desc', 'ialab.challenge.m4.step3_desc'],
  5: ['ialab.challenge.m5.step1_desc', 'ialab.challenge.m5.step2_desc', 'ialab.challenge.m5.step3_desc'],
};

/**
 * IALabEvaluationModal — Modal multi-paso para evaluación de desafíos.
 * Guía al usuario a través de los pasos específicos de cada módulo
 * (Valerio, ChatGPT, Gemini, NotebookLM, Ética) y gestiona el envío.
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen     - Controla la visibilidad del modal
 * @param {Function} props.onClose    - Callback al cerrar el modal
 * @param {boolean}  [props.isPremium=false] - Indica si el usuario es premium
 * @param {number}   props.moduleId   - ID del módulo a evaluar
 * @param {Function} props.onComplete - Callback al finalizar la evaluación
 */
const IALabEvaluationModal = ({ isOpen, onClose, isPremium = false, moduleId: propModuleId, onComplete }) => {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const effectiveModuleId = propModuleId || 1;
  const steps = STEP_COMPONENTS[effectiveModuleId] || STEP_COMPONENTS[1];
  const totalSteps = steps.length;
  const titleKeys = STEP_TITLE_KEYS[effectiveModuleId] || STEP_TITLE_KEYS[1];
  const descKeys = STEP_DESC_KEYS[effectiveModuleId] || STEP_DESC_KEYS[1];

  const {
    state,
    generateExercises,
    evaluateAnswers,
    saveGradeToSupabase,
    setStep,
    setResponse,
    resetEvaluation,
  } = useIALabEvaluation(effectiveModuleId, locale);

  const [formError, setFormError] = useState(null);
  const errorTimeoutRef = useRef(null);
  const clearFormError = useCallback(() => {
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    setFormError(null);
  }, []);
  const setTimeoutFormError = useCallback((ms) => {
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setFormError(null), ms);
  }, []);
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const prevStepRef = useRef(state.step);

  const isChallengeActive = isVisible && state.step !== 'results' && state.step !== 'intro';

  const { showOverlay } = useScreenshotProtection(isChallengeActive, {
    onMaxViolations: () => {
      resetEvaluation();
      onClose();
    },
    maxViolations: 3,
  });

  const {
    securityWarning,
    securityAlert, setSecurityAlert,
    printWarning, setPrintWarning,
    handleSecurityEvent,
  } = useEvaluationSecurity({
    isOpen,
    isVisible,
    isActive: isChallengeActive,
    onMaxViolations: () => {
      resetEvaluation();
      onClose();
    },
  });

  const handleSetResponse = useCallback((key, value) => {
    setResponse(key, value);
  }, [setResponse]);

  const { clearDraft, resetDraftFlags } = useEvaluationDraft({
    isOpen,
    userId: user?.id,
    moduleId: effectiveModuleId,
    responses: state.responses,
    onSubmitComplete: handleSetResponse,
  });

  useEffect(() => {
    if (isOpen && !state.exercises && !state.loading && state.step !== 'intro') {
      setStep('intro');
    }
  }, [isOpen, state.exercises, state.loading, setStep]);

  useEffect(() => {
    if (state.step === 'results' && user?.id && effectiveModuleId) {
      clearDraft();
    }
  }, [state.step, user?.id, effectiveModuleId, clearDraft]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCloseModal = useCallback(() => {
    resetEvaluation();
    resetDraftFlags();
    onClose();
  }, [resetEvaluation, onClose, resetDraftFlags]);

  const handleNextStep = useCallback(() => {
    if (typeof state.step === 'number' && state.step < totalSteps) {
      setStep(state.step + 1);
    }
  }, [state.step, setStep, totalSteps]);

  const handlePrevStep = useCallback(() => {
    if (typeof state.step === 'number' && state.step > 1) {
      setStep(state.step - 1);
    }
  }, [state.step, setStep]);

  const handleSubmitEvaluation = useCallback(async () => {
    const keys = Array.from({ length: totalSteps }, (_, i) => `ej${i + 1}`);
    const allFilled = keys.every(k => state.responses[k]);
    if (!allFilled) {
      setFormError(t('ialab.evaluation.modal.form_error_incomplete'));
      setTimeoutFormError(4000);
      return;
    }

    try {
      const evaluation = await evaluateAnswers(state.responses);
      if (evaluation) {
        setIsSavingGrade(true);
        const saveResult = await saveGradeToSupabase(evaluation, effectiveModuleId);
        if (saveResult.success) {
          if (onComplete) onComplete(evaluation.notaGlobal || 0);
          setStep('results');
        } else {
          setFormError(t('ialab.evaluation.modal.form_error_save', { error: saveResult.error }));
          setTimeoutFormError(6000);
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error en evaluación:', error);
      setFormError(t('ialab.evaluation.modal.form_error_evaluation'));
      setTimeoutFormError(6000);
    } finally {
      setIsSavingGrade(false);
    }
  }, [state.responses, evaluateAnswers, saveGradeToSupabase, setStep, effectiveModuleId, onComplete, totalSteps, t]);

  useEffect(() => {
    prevStepRef.current = state.step;
  }, [state.step]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  const focusTrapRef = useFocusTrap(isVisible);

  const renderContent = () => {
    if (state.loading) return <LoadingState loadingType={state.step} />;
    if (state.error && !state.exercises) return <ErrorState error={state.error} onRetry={() => generateExercises(locale)} />;
    if (state.step === 'intro') {
      return (
        <ValerioChallengeIntro
          moduleId={effectiveModuleId}
          onStart={() => { setStep(1); generateExercises(locale); }}
          t={t}
        />
      );
    }
    if (state.step === 'results') {
      return <IALabEvaluationResults evaluation={state.evaluation} onClose={handleCloseModal} />;
    }
    return (
      <StepContent
        steps={steps}
        step={state.step}
        totalSteps={totalSteps}
        exercises={state.exercises}
        responses={state.responses}
        titleKeys={titleKeys}
        descKeys={descKeys}
        setResponse={handleSetResponse}
        formError={formError}
        handlePrevStep={handlePrevStep}
        handleNextStep={handleNextStep}
        handleSubmitEvaluation={handleSubmitEvaluation}
        securityWarning={securityWarning}
        generateExercises={generateExercises}
        locale={locale}
        fallbackMode={state.fallbackMode}
        isSavingGrade={isSavingGrade}
        loading={state.loading}
        handleSecurityEvent={handleSecurityEvent}
        t={t}
      />
    );
  };

  const showWatermark = state.step !== 'results' && state.step !== 'intro';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={focusTrapRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('ialab.evaluation.modal.dialog_label')}
          className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-900 flex flex-col select-none"
          style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
          onCopy={handleSecurityEvent}
          onPaste={handleSecurityEvent}
          onCut={handleSecurityEvent}
          onContextMenu={handleSecurityEvent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <a
            href="#eval-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[110] focus:px-4 focus:py-2 focus:bg-white focus:text-petroleum focus:rounded-lg focus:text-sm focus:font-bold focus:shadow-lg"
          >
            {t('ialab.skip_link')}
          </a>

          <div className="absolute inset-0" onCopy={handleSecurityEvent} onPaste={handleSecurityEvent} onCut={handleSecurityEvent} onContextMenu={handleSecurityEvent} />

          {showWatermark && (
            <div className="fixed inset-0 pointer-events-none z-[101] opacity-[0.03] select-none" style={{
              background: `repeating-linear-gradient(45deg, var(--color-petroleum), var(--color-petroleum) 2px, transparent 2px, transparent 60px)`,
            }}>
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden max-w-full">
                <span className="text-petroleum text-8xl md:text-9xl font-bold -rotate-12 select-none whitespace-nowrap">
                  EDUTECHLIFE
                </span>
              </div>
            </div>
          )}

          <div aria-live="polite" className="sr-only">
            {typeof state.step === 'number' ? `${state.step} de ${totalSteps}` : ''}
          </div>

          <div className="relative flex flex-col min-h-0 flex-1">
            <EvaluationHeader
              step={typeof state.step === 'number' ? state.step : null}
              totalSteps={totalSteps}
              securityWarning={securityWarning}
              onClose={handleCloseModal}
              loading={state.loading}
              isSavingGrade={isSavingGrade}
            />

            <div id="eval-content" className="flex-1 overflow-y-auto min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={state.step === 'intro' ? 'intro' : state.step === 'results' ? 'results' : state.loading ? 'loading' : state.error && !state.exercises ? 'error' : `step-${state.step}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                  className={state.step === 'results' || state.step === 'intro' ? 'h-full' : 'h-fit'}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {securityWarning && !['intro', 'results'].includes(state.step) && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-3 bg-amber-500/90 text-white rounded-xl shadow-lg ialab-animate-fade-in">
              <div className="flex items-center gap-2">
                <i className="fas fa-shield-alt" aria-hidden="true"></i>
                <span className="text-sm font-medium">{securityWarning}</span>
              </div>
            </div>
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

      <ScreenshotProtectionOverlay isOpen={showOverlay && state.step !== 'results'} />
    </AnimatePresence>
  );
};


IALabEvaluationModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  isPremium: PropTypes.bool,
  moduleId: PropTypes.number,
  onComplete: PropTypes.func,
};

export default IALabEvaluationModal;
