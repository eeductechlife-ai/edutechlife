import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import useIALabEvaluation from '../../hooks/IALab/useIALabEvaluation';
import IALabEvaluationStep1 from './IALabEvaluationStep1';
import IALabEvaluationStep2 from './IALabEvaluationStep2';
import IALabEvaluationStep3 from './IALabEvaluationStep3';
import IALabEvaluationResults from './IALabEvaluationResults';
import SecurityWarningModal from './SecurityWarningModal';
import ScreenshotProtectionOverlay from './ScreenshotProtectionOverlay';
import useScreenshotProtection from '../../hooks/IALab/useScreenshotProtection';
import ValerioChallengeIntro from './challenges/challengeIntro/ValerioChallengeIntro';
import ChatGPTStep1 from './challenges/module2/ChatGPTStep1';
import ChatGPTStep2 from './challenges/module2/ChatGPTStep2';
import ChatGPTStep3 from './challenges/module2/ChatGPTStep3';
import GeminiStep1 from './challenges/module3/GeminiStep1';
import GeminiStep2 from './challenges/module3/GeminiStep2';
import GeminiStep3 from './challenges/module3/GeminiStep3';
import GeminiStep4 from './challenges/module3/GeminiStep4';
import AutoSaveIndicator from './challenges/shared/AutoSaveIndicator';
import NotebookStep1 from './challenges/module4/NotebookStep1';
import NotebookStep2 from './challenges/module4/NotebookStep2';
import NotebookStep3 from './challenges/module4/NotebookStep3';
import EthicsStep1 from './challenges/module5/EthicsStep1';
import EthicsStep2 from './challenges/module5/EthicsStep2';
import EthicsStep3 from './challenges/module5/EthicsStep3';
import { motion, AnimatePresence } from 'framer-motion';
import useFocusTrap from '../../hooks/useFocusTrap';
import { useTranslation } from '../../i18n/I18nProvider';

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
 * Componente premium para evaluación inmersiva de IALab con DeepSeek API
 * Modal pantalla completa con 3 pasos interactivos y persistencia en Supabase
 * 
 * Características:
 * - Modal fixed inset-0 con backdrop blur
 * - 3 pasos: Identificar, Optimizar, Crear
 * - Generación dinámica de ejercicios por DeepSeek
 * - Evaluación automática por DeepSeek
 * - Persistencia de notas en Supabase con Clerk auth
 * - Auto-save de borradores con debounce
 * - Medidas de seguridad estrictas (no copy/paste)
 * - Diseño Edutechlife premium (#004B63, #00BCD4)
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Handler para cerrar modal
 * @param {boolean} props.isPremium - Indica si es el modal premium del desafío
 * @param {number} props.moduleId - ID del módulo actual para auto-save
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
        config
    } = useIALabEvaluation(effectiveModuleId, locale);

    const displayStep = typeof state.step === 'number' ? state.step : 0;

    const [securityWarning, setSecurityWarning] = useState('');
    const [securityAlert, setSecurityAlert] = useState(null);
    const [printWarning, setPrintWarning] = useState(null);
    const [formError, setFormError] = useState(null);
    const [isSavingGrade, setIsSavingGrade] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [securityViolations, setSecurityViolations] = useState(0);
    const MAX_SECURITY_VIOLATIONS = 3;
    const saveDraftTimerRef = useRef(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    const isChallengeActive = isVisible && state.step !== 'results' && state.step !== 'intro';
    const { showOverlay } = useScreenshotProtection(isChallengeActive, {
      onMaxViolations: () => {
        setSecurityAlert({ message: t('ialab.evaluation.modal.max_security_violations'), level: 3, onClose: () => {
          setSecurityAlert(null);
          resetEvaluation();
          onClose();
        }});
      },
      maxViolations: 3,
    });
    const hasRestoredDraftRef = useRef(false);

    // Inicializar evaluación cuando se abre el modal
    useEffect(() => {
        if (isOpen && !state.exercises && !state.loading && state.step !== 'intro') {
            setStep('intro');
        }
    }, [isOpen, state.exercises, state.loading, setStep]);

    // Restaurar borrador guardado al abrir el modal
    useEffect(() => {
        if (isOpen && user?.id && effectiveModuleId && !hasRestoredDraftRef.current) {
            hasRestoredDraftRef.current = true;
            const restoreDraft = async () => {
                try {
                    const { data, error } = await supabase
                        .from('user_progress')
                        .select('completed_lessons')
                        .eq('user_id', user.id)
                        .eq('module_id', effectiveModuleId)
                        .eq('activity_type', 'challenge_draft')
                        .is('resource_id', null)
                        .maybeSingle();

                    if (error) throw error;
                    if (data?.completed_lessons) {
                        const draft = data.completed_lessons;
                        if (draft.ej1) setResponse('ej1', draft.ej1);
                        if (draft.ej2) setResponse('ej2', draft.ej2);
                        if (draft.ej3) setResponse('ej3', draft.ej3);
                    }
                } catch (err) {
                    console.warn('⚠️ Error restaurando borrador:', err);
                }
            };
            restoreDraft();
        }
    }, [isOpen, user?.id, effectiveModuleId]);

    // Auto-save de borradores con debounce
    useEffect(() => {
        if (!isOpen || !user?.id || !effectiveModuleId) return;
        if (!state.responses.ej1 && !state.responses.ej2 && !state.responses.ej3) return;

        if (saveDraftTimerRef.current) {
            clearTimeout(saveDraftTimerRef.current);
        }

        saveDraftTimerRef.current = setTimeout(async () => {
            try {
                await supabase
                    .from('user_progress')
                    .upsert({
                        user_id: user.id,
                        module_id: effectiveModuleId,
                        activity_type: 'challenge_draft',
                        resource_id: null,
                        completed_lessons: { ...state.responses },
                        is_completed: false,
                        updated_at: new Date().toISOString(),
                    }, {
                        onConflict: 'user_id,module_id,activity_type,resource_id',
                    });
            } catch (err) {
                console.warn('⚠️ Error auto-guardando borrador:', err);
            }
        }, 1500);

        return () => {
            if (saveDraftTimerRef.current) {
                clearTimeout(saveDraftTimerRef.current);
            }
        };
    }, [state.responses, isOpen, user?.id, effectiveModuleId]);

    // Limpiar borrador al completar el desafío
    useEffect(() => {
        if (state.step === 'results' && user?.id && effectiveModuleId) {
            const clearDraft = async () => {
                try {
                    await supabase
                        .from('user_progress')
                        .delete()
                        .eq('user_id', user.id)
                        .eq('module_id', effectiveModuleId)
                        .eq('activity_type', 'challenge_draft')
                        .is('resource_id', null);
                } catch (err) {
                    console.warn('⚠️ Error limpiando borrador:', err);
                }
            };
            clearDraft();
        }
    }, [state.step, user?.id, effectiveModuleId]);

    // Animación de entrada/salida
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Reset violaciones y error al abrir el modal
    useEffect(() => {
        if (isOpen) {
            setSecurityViolations(0);
            setFormError(null);
        }
    }, [isOpen]);

    // Seguridad: detección de cambio de ventana
    useEffect(() => {
        if (!isVisible || state.step === 'results' || state.loading || state.step === 'intro') return;
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setSecurityViolations(prev => {
                    const newCount = prev + 1;
                    if (newCount >= MAX_SECURITY_VIOLATIONS) {
                        setSecurityAlert({ message: t('ialab.evaluation.modal.max_window_violations'), level: 3, onClose: () => {
                            setSecurityAlert(null);
                            resetEvaluation();
                            onClose();
                        }});
                    } else {
                        setSecurityWarning(t('ialab.evaluation.modal.window_warning', { count: newCount, max: MAX_SECURITY_VIOLATIONS }));
                        setTimeout(() => setSecurityWarning(''), 3000);
                    }
                    return newCount;
                });
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isVisible, state.step, state.loading, resetEvaluation, onClose]);

    // Seguridad: bloquear atajos de teclado
    useEffect(() => {
        if (!isVisible || state.step === 'results' || state.step === 'intro') return;
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'p' || e.key === 's' || e.key === 'u')) {
                e.preventDefault(); e.stopPropagation();
            }
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, state.step]);

    // Seguridad: bloquear capturas de pantalla e impresión
    useEffect(() => {
        if (!isVisible || state.step === 'results' || state.step === 'intro') return;
        const handleBeforePrint = () => {
            setPrintWarning(t('ialab.evaluation.modal.print_blocked'));
            setSecurityViolations(prev => prev + 1);
            setTimeout(() => setPrintWarning(null), 4000);
        };
        window.addEventListener('beforeprint', handleBeforePrint);
        return () => window.removeEventListener('beforeprint', handleBeforePrint);
    }, [isVisible, state.step]);

    // Medidas de seguridad: prevenir copy/paste/context menu
    const handleSecurityEvent = useCallback((e) => {
        e.preventDefault();
        setSecurityViolations(prev => {
            const newCount = prev + 1;
            if (newCount >= MAX_SECURITY_VIOLATIONS) {
        setSecurityAlert({ message: t('ialab.evaluation.modal.max_security_violations'), level: 3, onClose: () => {
                    setSecurityAlert(null);
                    resetEvaluation();
                    onClose();
                }});
            } else {
                setSecurityWarning(t('ialab.evaluation.modal.write_own_warning', { count: newCount, max: MAX_SECURITY_VIOLATIONS }));
                setTimeout(() => setSecurityWarning(''), 3000);
            }
            return newCount;
        });
    }, [resetEvaluation, onClose]);

    // Handler para cerrar modal
    const handleCloseModal = useCallback(() => {
        resetEvaluation();
        hasRestoredDraftRef.current = false;
        onClose();
    }, [resetEvaluation, onClose]);

    // Handler para avanzar al siguiente paso
    const handleNextStep = useCallback(() => {
        if (typeof state.step === 'number' && state.step < totalSteps) {
            setStep(state.step + 1);
        }
    }, [state.step, setStep, totalSteps]);

    // Handler para retroceder al paso anterior
    const handlePrevStep = useCallback(() => {
        if (typeof state.step === 'number' && state.step > 1) {
            setStep(state.step - 1);
        }
    }, [state.step, setStep]);

    // Handler para enviar evaluación final
    const handleSubmitEvaluation = useCallback(async () => {
        const keys = Array.from({ length: totalSteps }, (_, i) => `ej${i + 1}`);
        const allFilled = keys.every(k => state.responses[k]);
        if (!allFilled) {
            setFormError(t('ialab.evaluation.modal.form_error_incomplete'));
            setTimeout(() => setFormError(null), 4000);
            return;
        }

        try {
            // Evaluar respuestas con DeepSeek
            const evaluation = await evaluateAnswers(state.responses);
            
            if (evaluation) {
                // Guardar nota en Supabase
                setIsSavingGrade(true);
                const saveResult = await saveGradeToSupabase(evaluation, effectiveModuleId);
                
                if (saveResult.success) {
                    if (onComplete) {
                        onComplete(evaluation.notaGlobal || 0);
                    }
                    setStep('results');
                } else {
                    setFormError(t('ialab.evaluation.modal.form_error_save', { error: saveResult.error }));

                    setTimeout(() => setFormError(null), 6000);
                }
            }
        } catch (error) {
            console.error('Error en evaluación:', error);
            setFormError(t('ialab.evaluation.modal.form_error_evaluation'));
            setTimeout(() => setFormError(null), 6000);
        } finally {
            setIsSavingGrade(false);
        }
    }, [state.responses, evaluateAnswers, saveGradeToSupabase, setStep, effectiveModuleId, onComplete, totalSteps]);

    // Render header con progreso
    const renderHeader = () => (
        <div className="bg-gradient-to-r from-petroleum to-corporate border-b border-white/10 px-6 py-4 flex items-center justify-between z-50">
            <button 
                onClick={handleCloseModal}
                className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                disabled={state.loading || isSavingGrade}
            >
                <Icon name="fa-arrow-left" className="text-sm" />
                <span className="text-sm font-medium">{t('ialab.evaluation.modal.exit')}</span>
            </button>

            <div className="flex items-center gap-6">
                {/* Barra de progreso */}
                {typeof state.step === 'number' && (
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-white/80">{t('ialab.evaluation.modal.step_of', { step: state.step, total: totalSteps })}</div>
                        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-petroleum transition-all duration-500"
                                style={{ width: `${(displayStep / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Indicador de seguridad */}
                {securityWarning && (
                    <div className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                        <span className="text-xs text-amber-200">{securityWarning}</span>
                    </div>
                )}
            </div>
        </div>
    );

    // Render loading state
    const renderLoading = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-petroleum/20 to-corporate/20 flex items-center justify-center mb-6">
                <div className="w-10 h-10 border-3 border-corporate border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
                {state.step === 'loading' ? t('ialab.evaluation.modal.ai_designing') : t('ialab.evaluation.modal.evaluating')}
            </h3>
            <p className="text-slate-500 text-center max-w-md">
                {t('ialab.evaluation.modal.loading_desc')}
            </p>
        </div>
    );

    // Render error state
    const renderError = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                <Icon name="fa-exclamation-triangle" className="text-red-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">{t('ialab.evaluation.modal.load_error_title')}</h3>
            <p className="text-slate-500 text-center max-w-md mb-6">{state.error}</p>
            <button
                onClick={generateExercises}
                className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
            >
                <Icon name="fa-redo" className="mr-2" />
                {t('ialab.evaluation.modal.retry')}
            </button>
        </div>
    );

    // Render contenido principal (pasos)
    const renderContent = () => {
        if (!state.exercises) return null;
        const StepComponent = steps[state.step - 1];
        const exerciseKeys = Object.keys(state.exercises);
        const currentExercise = state.step <= exerciseKeys.length ? state.exercises[exerciseKeys[state.step - 1]] : state.exercises;
        const responseKey = `ej${state.step}`;
        const exercises = state.exercises;

        const ej1Parsed = (() => {
            try { return JSON.parse(state.responses.ej1 || '{}'); }
            catch { return {}; }
        })();
        const selectedCase = ej1Parsed.selectedCase || '';
        const researchTopic = ej1Parsed.topic || currentExercise?.temaInvestigacion || currentExercise?.documentos?.[0]?.tema || '';
        const selectedDocCount = (() => {
            try { return JSON.parse(state.responses.ej1 || '{}').documents?.length || 0; }
            catch { return 0; }
        })();

        const selectedDocs = (() => {
            try {
                const ej1 = JSON.parse(state.responses.ej1 || '{}');
                const docs = ej1.documents || [];
                return docs.map(d => {
                    const docObj = currentExercise?.documentos?.[d.index];
                    return docObj ? { index: d.index, title: docObj.titulo, tipo: docObj.tipo } : null;
                }).filter(Boolean);
            } catch {
                return [];
            }
        })();

        const step1Biases = (() => {
            try {
                const ej1 = JSON.parse(state.responses.ej1 || '{}');
                const rawBiases = ej1.biases || [];
                const tiposSesgo = exercises?.tiposSesgo || [];
                return rawBiases.map(b => ({
                    index: b.index,
                    label: typeof tiposSesgo[b.index] === 'string' ? tiposSesgo[b.index] : (tiposSesgo[b.index]?.nombre || `Bias #${b.index}`),
                    pipeline: b.pipeline
                }));
            } catch { return []; }
        })();

        return (
            <div className="max-w-4xl mx-auto p-6 pb-20">
                    {state.fallbackMode && (
                        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <Icon name="fa-wifi-slash" className="text-amber-600 text-sm" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-amber-800">{t('ialab.evaluation.modal.offline_title')}</p>
                                <p className="text-[10px] text-amber-600">{t('ialab.evaluation.modal.offline_desc')}</p>
                            </div>
                            <button
                                onClick={() => generateExercises(locale)}
                                className="text-[10px] font-semibold text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                            >
                                <Icon name="fa-redo" className="mr-1" />
                                {t('ialab.evaluation.modal.retry')}
                            </button>
                        </div>
                    )}
                    {/* Título del paso actual */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
                                <Icon name="fa-clipboard-check" className="text-white text-xl" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                        {t(titleKeys[state.step - 1] || 'ialab.evaluation.modal.step1_title')}
                                    </h2>
                                    <AutoSaveIndicator response={state.responses[responseKey] || ''} />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400">
                                    {t(descKeys[state.step - 1] || '')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contenido del paso actual */}
                    <div 
                        className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6 mb-8"
                        onCopy={handleSecurityEvent}
                        onPaste={handleSecurityEvent}
                        onCut={handleSecurityEvent}
                        onContextMenu={handleSecurityEvent}
                    >
                        {StepComponent && (
                            <StepComponent
                                exercise={currentExercise}
                                response={state.responses[responseKey] || ''}
                                onResponseChange={(response) => setResponse(responseKey, response)}
                                t={t}
                                selectedCase={selectedCase}
                                topic={researchTopic}
                                docCount={selectedDocCount}
                                selectedDocs={selectedDocs}
                                exercises={exercises}
                                biases={step1Biases}
                            />
                        )}
                    </div>

                    {/* Mensaje de error del formulario */}
                    {formError && (
                        <div className="mb-4 px-4 py-3 bg-red-500/90 text-white rounded-xl text-sm font-medium flex items-center gap-2">
                            <Icon name="fa-exclamation-circle" />
                            {formError}
                        </div>
                    )}

                    {/* Navegación entre pasos */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrevStep}
                            disabled={state.step === 1 || state.loading}
                            className="px-6 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon name="fa-arrow-left" className="mr-2" />
                            {t('ialab.evaluation.modal.previous')}
                        </button>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500">
                                {t('ialab.evaluation.modal.step_of', { step: state.step, total: totalSteps })}
                            </span>
                            
                            {state.step < totalSteps ? (
                                <button
                                    onClick={handleNextStep}
                                    disabled={!state.responses[responseKey] || state.loading}
                                    className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t('ialab.evaluation.modal.next')}
                                    <Icon name="fa-arrow-right" className="ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitEvaluation}
                                    disabled={!state.responses[responseKey] || state.loading || isSavingGrade}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSavingGrade ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            {t('ialab.evaluation.modal.saving_grade')}
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="fa-paper-plane" />
                                            {t('ialab.evaluation.modal.submit_evaluation')}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
        );
    };

    // Track previous step for animation direction
    const prevStepRef = useRef(state.step);

    useEffect(() => {
        prevStepRef.current = state.step;
    }, [state.step]);

    const focusTrapRef = useFocusTrap(isVisible);

    return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div 
                        ref={focusTrapRef}
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
                        <div 
                            className="absolute inset-0"
                            onCopy={handleSecurityEvent}
                            onPaste={handleSecurityEvent}
                            onCut={handleSecurityEvent}
                            onContextMenu={handleSecurityEvent}
                        />

                        {/* Watermark de seguridad anti-screenshot */}
                        {state.step !== 'results' && state.step !== 'intro' && (
                            <div className="fixed inset-0 pointer-events-none z-[101] opacity-[0.03] select-none" style={{
                                background: `repeating-linear-gradient(45deg, var(--color-petroleum), var(--color-petroleum) 2px, transparent 2px, transparent 60px)`,
                            }}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-petroleum text-8xl font-bold transform -rotate-12 select-none" style={{ whiteSpace: 'nowrap' }}>
                                        EDUTECHLIFE
                                    </span>
                                </div>
                            </div>
                        )}

                        <div aria-live="polite" className="sr-only">
                            {typeof state.step === 'number' ? `${state.step} de ${totalSteps}` : ''}
                        </div>
                        <div className="relative flex flex-col min-h-0 flex-1">
                            {renderHeader()}

                            <div className="flex-1 overflow-y-auto min-h-0">
                                <AnimatePresence mode="wait">
                                    {state.loading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full"
                                        >
                                            {renderLoading()}
                                        </motion.div>
                                    ) : state.error && !state.exercises ? (
                                        <motion.div
                                            key="error"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full"
                                        >
                                            {renderError()}
                                        </motion.div>
                                    ) : state.step === 'intro' ? (
                                        <motion.div
                                            key="intro"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full"
                                        >
                                            <ValerioChallengeIntro
                                                moduleId={effectiveModuleId}
                                                onStart={() => {
                                                    setStep(1);
                                                    generateExercises(locale);
                                                }}
                                                t={t}
                                            />
                                        </motion.div>
                                    ) : state.step === 'results' ? (
                                        <motion.div
                                            key="results"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full"
                                        >
                                            <IALabEvaluationResults
                                                evaluation={state.evaluation}
                                                onClose={handleCloseModal}
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={`step-${state.step}`}
                                            initial={prefersReducedMotion ? false : { opacity: 0, x: state.step > prevStepRef.current ? 50 : -50 }}
                                            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                                            exit={prefersReducedMotion ? false : { opacity: 0, x: state.step > prevStepRef.current ? -50 : 50 }}
                                            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                                            className="h-fit"
                                        >
                                            {renderContent()}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {securityWarning && (
                            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-3 bg-amber-500/90 text-white rounded-xl shadow-lg animate-fade-in">
                                <div className="flex items-center gap-2">
                                    <Icon name="fa-shield-alt" />
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

export default IALabEvaluationModal;