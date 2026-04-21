import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import useIALabEvaluation from '../../hooks/IALab/useIALabEvaluation';
import IALabEvaluationStep1 from './IALabEvaluationStep1';
import IALabEvaluationStep2 from './IALabEvaluationStep2';
import IALabEvaluationStep3 from './IALabEvaluationStep3';
import IALabEvaluationResults from './IALabEvaluationResults';
import { motion, AnimatePresence } from 'framer-motion';

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
 * - Medidas de seguridad estrictas (no copy/paste)
 * - Diseño Edutechlife premium (#004B63, #00BCD4)
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Handler para cerrar modal
 * @param {boolean} props.isPremium - Indica si es el modal premium del desafío
 */
const IALabEvaluationModal = ({ isOpen, onClose, isPremium = false }) => {
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
    const [isSavingGrade, setIsSavingGrade] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Debug logging
    console.log('🎯 [DEBUG] IALabEvaluationModal renderizando');
    console.log('🎯 [DEBUG] Props:', { isOpen, isPremium });

    // Inicializar evaluación cuando se abre el modal
    useEffect(() => {
        if (isOpen && !state.exercises && !state.loading) {
            generateExercises();
        }
    }, [isOpen, state.exercises, state.loading, generateExercises]);

    // Animación de entrada/salida
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Medidas de seguridad: prevenir copy/paste/context menu
    const handleSecurityEvent = useCallback((e) => {
        e.preventDefault();
        setSecurityWarning('⚠️ Escribe tus propias respuestas para aprender mejor');
        setTimeout(() => setSecurityWarning(''), 3000);
    }, []);

    // Handler para cerrar modal (con confirmación si hay progreso)
    const handleCloseModal = useCallback(() => {
        if (state.step > 1 || state.responses.ej1 || state.responses.ej2 || state.responses.ej3) {
            if (confirm('⚠️ Tienes progreso sin guardar. ¿Estás seguro de que quieres salir? Tu progreso se perderá.')) {
                resetEvaluation();
                onClose();
            }
        } else {
            resetEvaluation();
            onClose();
        }
    }, [state.step, state.responses, resetEvaluation, onClose]);

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
            alert('⚠️ Debes completar todos los ejercicios antes de enviar.');
            return;
        }

        try {
            // Evaluar respuestas con DeepSeek
            const evaluation = await evaluateAnswers(state.responses);
            
            if (evaluation) {
                // Guardar nota en Supabase
                setIsSavingGrade(true);
                const saveResult = await saveGradeToSupabase(evaluation);
                
                if (saveResult.success) {
                    setStep('results');
                } else {
                    alert(`❌ Error al guardar tu nota: ${saveResult.error}`);
                }
            }
        } catch (error) {
            console.error('Error en evaluación:', error);
            alert('❌ Error al evaluar tus respuestas. Intenta nuevamente.');
        } finally {
            setIsSavingGrade(false);
        }
    }, [state.responses, evaluateAnswers, saveGradeToSupabase, setStep]);

    // Render header con progreso
    const renderHeader = () => (
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 px-6 py-4 flex items-center justify-between z-50">
            <button 
                onClick={handleCloseModal}
                className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-800/50 px-3 py-2 rounded-lg transition-colors"
                disabled={state.loading || isSavingGrade}
            >
                <Icon name="fa-arrow-left" className="text-sm" />
                <span className="text-sm font-medium">Salir</span>
            </button>

            <div className="flex items-center gap-6">
                {/* Barra de progreso */}
                <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-300">Paso {state.step} de 3</div>
                    <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-[#00BCD4] to-[#0097A7] transition-all duration-500"
                            style={{ width: `${(state.step / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Indicador de seguridad */}
                {securityWarning && (
                    <div className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                        <span className="text-xs text-amber-300">{securityWarning}</span>
                    </div>
                )}
            </div>
        </div>
    );

    // Render loading state
    const renderLoading = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#004B63]/20 to-[#00BCD4]/20 flex items-center justify-center mb-6">
                <div className="w-10 h-10 border-3 border-[#00BCD4] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
                {state.step === 'loading' ? 'La IA está diseñando tu desafío...' : 'DeepSeek está evaluando tus respuestas...'}
            </h3>
            <p className="text-slate-400 text-center max-w-md">
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
            <h3 className="text-xl font-bold text-white mb-2">Error al cargar la evaluación</h3>
            <p className="text-slate-400 text-center max-w-md mb-6">{state.error}</p>
            <button
                onClick={generateExercises}
                className="px-6 py-3 bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
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
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6">
                    {/* Título del paso actual */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#004B63] to-[#00BCD4] flex items-center justify-center">
                                <Icon name="fa-clipboard-check" className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {state.step === 1 && 'Paso 1: Identificar'}
                                    {state.step === 2 && 'Paso 2: Optimizar'}
                                    {state.step === 3 && 'Paso 3: Crear'}
                                </h2>
                                <p className="text-slate-400">
                                    {state.step === 1 && 'Analiza el escenario y clasifica los elementos clave'}
                                    {state.step === 2 && 'Mejora el prompt mal redactado'}
                                    {state.step === 3 && 'Crea un prompt desde cero para el caso de uso'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contenido del paso actual */}
                    <div 
                        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8"
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

                    {/* Navegación entre pasos */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrevStep}
                            disabled={state.step === 1 || state.loading}
                            className="px-6 py-3 border-2 border-slate-600 text-slate-300 rounded-xl hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon name="fa-arrow-left" className="mr-2" />
                            Anterior
                        </button>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-400">
                                Paso {state.step} de 3
                            </span>
                            
                            {state.step < 3 ? (
                                <button
                                    onClick={handleNextStep}
                                    disabled={!state.responses[`ej${state.step}`] || state.loading}
                                    className="px-6 py-3 bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
        );
    };

    // Track previous step for animation direction
    const prevStepRef = useRef(state.step);
    
    useEffect(() => {
        prevStepRef.current = state.step;
    }, [state.step]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col"
                    onCopy={handleSecurityEvent}
                    onPaste={handleSecurityEvent}
                    onCut={handleSecurityEvent}
                    onContextMenu={handleSecurityEvent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
            {/* Overlay de seguridad */}
            <div 
                className="absolute inset-0"
                onCopy={handleSecurityEvent}
                onPaste={handleSecurityEvent}
                onCut={handleSecurityEvent}
                onContextMenu={handleSecurityEvent}
            />

            {/* Contenido del modal */}
            <div className="relative min-h-screen flex flex-col">
                {renderHeader()}

                <div className="flex-1 overflow-hidden">
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
                                className="h-full"
                            >
                                {renderContent()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Toast de seguridad */}
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
        </AnimatePresence>
    );
};

export default IALabEvaluationModal;