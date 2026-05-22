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
import { motion, AnimatePresence } from 'framer-motion';
import useFocusTrap from '../../hooks/useFocusTrap';

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
const IALabEvaluationModal = ({ isOpen, onClose, isPremium = false, moduleId, onComplete }) => {
    const { user } = useAuth();
    const {
        state,
        generateExercises,
        evaluateAnswers,
        saveGradeToSupabase,
        setStep,
        setResponse,
        resetEvaluation
    } = useIALabEvaluation();

    const [securityWarning, setSecurityWarning] = useState('');
    const [securityAlert, setSecurityAlert] = useState(null);
    const [printWarning, setPrintWarning] = useState(null);
    const [formError, setFormError] = useState(null);
    const [isSavingGrade, setIsSavingGrade] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [securityViolations, setSecurityViolations] = useState(0);
    const MAX_SECURITY_VIOLATIONS = 3;
    const saveDraftTimerRef = useRef(null);

    const isChallengeActive = isVisible && state.step !== 'results';
    const { showOverlay } = useScreenshotProtection(isChallengeActive, {
      onMaxViolations: () => {
        setSecurityAlert({ message: 'Has excedido el máximo de infracciones de seguridad. El desafío se cerrará.', level: 3, onClose: () => {
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
        if (isOpen && !state.exercises && !state.loading) {
            generateExercises();
        }
    }, [isOpen, state.exercises, state.loading, generateExercises]);

    // Restaurar borrador guardado al abrir el modal
    useEffect(() => {
        if (isOpen && user?.id && moduleId && !hasRestoredDraftRef.current) {
            hasRestoredDraftRef.current = true;
            const restoreDraft = async () => {
                try {
                    const { data, error } = await supabase
                        .from('user_progress')
                        .select('completed_lessons')
                        .eq('user_id', user.id)
                        .eq('module_id', moduleId)
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
    }, [isOpen, user?.id, moduleId]);

    // Auto-save de borradores con debounce
    useEffect(() => {
        if (!isOpen || !user?.id || !moduleId) return;
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
                        module_id: moduleId,
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
    }, [state.responses, isOpen, user?.id, moduleId]);

    // Limpiar borrador al completar el desafío
    useEffect(() => {
        if (state.step === 'results' && user?.id && moduleId) {
            const clearDraft = async () => {
                try {
                    await supabase
                        .from('user_progress')
                        .delete()
                        .eq('user_id', user.id)
                        .eq('module_id', moduleId)
                        .eq('activity_type', 'challenge_draft')
                        .is('resource_id', null);
                } catch (err) {
                    console.warn('⚠️ Error limpiando borrador:', err);
                }
            };
            clearDraft();
        }
    }, [state.step, user?.id, moduleId]);

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
        if (!isVisible || state.step === 'results' || state.loading) return;
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setSecurityViolations(prev => {
                    const newCount = prev + 1;
                    if (newCount >= MAX_SECURITY_VIOLATIONS) {
                        setSecurityAlert({ message: 'Has excedido el máximo de infracciones por cambio de ventana. El desafío se cerrará.', level: 3, onClose: () => {
                            setSecurityAlert(null);
                            resetEvaluation();
                            onClose();
                        }});
                    } else {
                        setSecurityWarning(`⚠️ Alerta ${newCount}/${MAX_SECURITY_VIOLATIONS}: No cambies de ventana durante el desafío`);
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
        if (!isVisible || state.step === 'results') return;
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
        if (!isVisible || state.step === 'results') return;
        const handleBeforePrint = () => {
            setPrintWarning('Capturas de pantalla e impresión bloqueadas por seguridad.');
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
                setSecurityAlert({ message: 'Has excedido el máximo de infracciones de seguridad. El desafío se cerrará.', level: 3, onClose: () => {
                    setSecurityAlert(null);
                    resetEvaluation();
                    onClose();
                }});
            } else {
                setSecurityWarning(`⚠️ Advertencia ${newCount}/${MAX_SECURITY_VIOLATIONS}: Escribe tus propias respuestas`);
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
        if (state.step < 3) {
            setStep(state.step + 1);
        }
    }, [state.step, setStep]);

    // Handler para retroceder al paso anterior
    const handlePrevStep = useCallback(() => {
        if (state.step > 1) {
            setStep(state.step - 1);
        }
    }, [state.step, setStep]);

    // Handler para enviar evaluación final
    const handleSubmitEvaluation = useCallback(async () => {
        if (!state.responses.ej1 || !state.responses.ej2 || !state.responses.ej3) {
            setFormError('Debes completar todos los ejercicios antes de enviar.');
            setTimeout(() => setFormError(null), 4000);
            return;
        }

        try {
            // Evaluar respuestas con DeepSeek
            const evaluation = await evaluateAnswers(state.responses);
            
            if (evaluation) {
                // Guardar nota en Supabase
                setIsSavingGrade(true);
                const saveResult = await saveGradeToSupabase(evaluation, moduleId);
                
                if (saveResult.success) {
                    if (onComplete) {
                        onComplete(evaluation.notaGlobal || 0);
                    }
                    setStep('results');
                } else {
                    setFormError(`Error al guardar tu nota: ${saveResult.error}`);
                    setTimeout(() => setFormError(null), 6000);
                }
            }
        } catch (error) {
            console.error('Error en evaluación:', error);
            setFormError('Error al evaluar tus respuestas. Intenta nuevamente.');
            setTimeout(() => setFormError(null), 6000);
        } finally {
            setIsSavingGrade(false);
        }
    }, [state.responses, evaluateAnswers, saveGradeToSupabase, setStep, moduleId, onComplete]);

    // Render header con progreso
    const renderHeader = () => (
        <div className="bg-gradient-to-r from-petroleum to-corporate border-b border-white/10 px-6 py-4 flex items-center justify-between z-50">
            <button 
                onClick={handleCloseModal}
                className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                disabled={state.loading || isSavingGrade}
            >
                <Icon name="fa-arrow-left" className="text-sm" />
                <span className="text-sm font-medium">Salir</span>
            </button>

            <div className="flex items-center gap-6">
                {/* Barra de progreso */}
                <div className="flex items-center gap-3">
                    <div className="text-sm text-white/80">Paso {state.step} de 3</div>
                    <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-petroleum transition-all duration-500"
                            style={{ width: `${(state.step / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

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
                {state.step === 'loading' ? 'La IA está diseñando tu desafío...' : 'Edutechlife está evaluando tus respuestas...'}
            </h3>
            <p className="text-slate-500 text-center max-w-md">
                Esto puede tomar unos segundos. Por favor, espera mientras procesamos tu evaluación.
            </p>
        </div>
    );

    // Render error state
    const renderError = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                <Icon name="fa-exclamation-triangle" className="text-red-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Error al cargar la evaluación</h3>
            <p className="text-slate-500 text-center max-w-md mb-6">{state.error}</p>
            <button
                onClick={generateExercises}
                className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
            >
                <Icon name="fa-redo" className="mr-2" />
                Reintentar
            </button>
        </div>
    );

    // Render contenido principal (pasos)
    const renderContent = () => {
        if (!state.exercises) return null;

        return (
            <div className="max-w-4xl mx-auto p-6 pb-20">
                    {/* Título del paso actual */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
                                <Icon name="fa-clipboard-check" className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                    {state.step === 1 && 'Paso 1: Identificar'}
                                    {state.step === 2 && 'Paso 2: Optimizar'}
                                    {state.step === 3 && 'Paso 3: Crear'}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400">
                                    {state.step === 1 && 'Analiza el escenario y clasifica los elementos clave'}
                                    {state.step === 2 && 'Mejora el prompt mal redactado'}
                                    {state.step === 3 && 'Crea un prompt desde cero para el caso de uso'}
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
                        {state.step === 1 && (
                            <IALabEvaluationStep1
                                exercise={state.exercises.ejercicio1}
                                response={state.responses.ej1}
                                onResponseChange={(response) => setResponse('ej1', response)}
                            />
                        )}
                        {state.step === 2 && (
                            <IALabEvaluationStep2
                                exercise={state.exercises.ejercicio2}
                                response={state.responses.ej2}
                                onResponseChange={(response) => setResponse('ej2', response)}
                            />
                        )}
                        {state.step === 3 && (
                            <IALabEvaluationStep3
                                exercise={state.exercises.ejercicio3}
                                response={state.responses.ej3}
                                onResponseChange={(response) => setResponse('ej3', response)}
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
                            Anterior
                        </button>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500">
                                Paso {state.step} de 3
                            </span>
                            
                            {state.step < 3 ? (
                                <button
                                    onClick={handleNextStep}
                                    disabled={!state.responses[`ej${state.step}`] || state.loading}
                                    className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Siguiente
                                    <Icon name="fa-arrow-right" className="ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitEvaluation}
                                    disabled={!state.responses.ej3 || state.loading || isSavingGrade}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSavingGrade ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Guardando nota...
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="fa-paper-plane" />
                                            Enviar Evaluación
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
                        {state.step !== 'results' && (
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
                                    ) : state.error ? (
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
                                            initial={{ opacity: 0, x: state.step > prevStepRef.current ? 50 : -50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: state.step > prevStepRef.current ? -50 : 50 }}
                                            transition={{ duration: 0.3 }}
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