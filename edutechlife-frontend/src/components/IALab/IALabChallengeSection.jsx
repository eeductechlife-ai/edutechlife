import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabProgress } from '../../hooks/IALab/useIALabProgress';

const IALabChallengeSection = ({
    className = '',
    style = {},
    ...rest
}) => {
    const { 
        activeMod, 
        modules, 
        user,
        challengeScore,
        setChallengeScore,
        isChallengeCompleted,
        setIsChallengeCompleted,
        isStartingChallenge,
        setIsStartingChallenge,
        isButtonDisabled,
        setIsButtonDisabled,
        setShowPremiumEvaluationModal
    } = useIALabContext();

    const { saveProgress, PROGRESS_STATUS, isLoadingProgress } = useIALabProgress();

    const isApproved = challengeScore >= 70;
    const scoreColor = isApproved ? 'text-emerald-600' : 'text-amber-600';
    const scoreBgColor = isApproved ? 'bg-emerald-100' : 'bg-amber-100';
    const scoreText = isApproved ? 'Aprobado' : 'Reprobado';

    const currentModule = modules.find(m => m.id === activeMod);
    const challengeText = currentModule?.challenge || 'Crea un prompt para resolver un problema complejo de tu industria.';
    const estimatedTime = "45 min";

    const handleStartChallenge = () => {
        setShowPremiumEvaluationModal(true);
    };

    const handleViewSolution = () => {
        alert('La funcionalidad de "Solución Experta" estará disponible próximamente.');
    };

    const handleReviewCompleted = () => {
        const isApproved = challengeScore >= 70;
        const message = `📊 **Resumen del Desafío Completado**\n\n` +
                       `• **Puntuación:** ${challengeScore}%\n` +
                       `• **Estado:** ${isApproved ? '✅ Aprobado' : '⚠️ Reprobado (necesitas 70%)'}\n` +
                       `• **Módulo:** ${currentModule?.title || 'Desafío del Curso'}\n` +
                       `• **Fecha de completado:** ${new Date().toLocaleDateString()}\n\n` +
                       `*La funcionalidad de "Mis Proyectos" estará disponible próximamente.*`;
        alert(message);
    };

    const handleRetryChallenge = async () => {
        if (confirm('¿Quieres realizar una versión avanzada de este desafío?\n\nTu puntuación anterior se conservará como referencia.')) {
            try {
                if (user?.id && challengeScore > 0) {
                    const historyData = {
                        previous_score: challengeScore,
                        previous_completed_at: new Date().toISOString(),
                        retry_initiated_at: new Date().toISOString(),
                        is_advanced_version: true
                    };
                    await saveProgress(activeMod, PROGRESS_STATUS.IN_PROGRESS, historyData);
                }
                setIsChallengeCompleted(false);
                setIsButtonDisabled(false);
                setChallengeScore(0);
                alert('Desafío avanzado iniciado. Demuestra que puedes superar tu puntuación anterior.');
            } catch (error) {
                console.error('Error al iniciar desafío avanzado:', error);
                alert('Error al iniciar el desafío avanzado. Intenta nuevamente.');
            }
        }
    };

    const renderSkeleton = () => (
        <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-2/3"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/3"></div>
                </div>
            </div>
            <div className="h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
            <div className="flex gap-4">
                <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl flex-1"></div>
                <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl flex-1"></div>
            </div>
        </div>
    );

    const renderContent = () => (
        <>
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isChallengeCompleted
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-400'
                        : 'bg-gradient-to-br from-[#004B63] to-[#0A3550]'
                }`}>
                    <Icon
                        name={isChallengeCompleted ? "fa-trophy" : "fa-bolt"}
                        className="text-white text-xl"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg md:text-xl font-bold text-[#004B63]">
                            {isChallengeCompleted ? 'Desafío Completado' : 'Desafío del Curso'}
                        </h3>
                        {isChallengeCompleted && (
                            <span className={`px-3 py-0.5 text-xs font-semibold rounded-full ${scoreBgColor} ${scoreColor}`}>
                                {challengeScore}% - {scoreText}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-600">
                        {isChallengeCompleted
                            ? `Has completado el desafío con ${challengeScore}%${!isApproved ? ' (mínimo 70% para aprobar)' : ''}.`
                            : 'Aplica lo aprendido en un reto práctico'
                        }
                    </p>
                </div>
            </div>

            <div className="bg-[#004B63]/5 border border-[#004B63]/10 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#004B63]/10 rounded-full">
                        <Icon name={isChallengeCompleted ? "fa-check-circle" : "fa-hourglass-half"} className="text-[#004B63] text-sm" />
                        <span className="text-xs font-semibold text-[#004B63]">
                            {isChallengeCompleted ? 'Completado' : `${estimatedTime}`}
                        </span>
                    </div>
                    <span className="text-xs text-slate-500">
                        {isChallengeCompleted ? 'Verificado' : 'Pendiente'}
                    </span>
                </div>

                <div className="mb-3">
                    <h4 className="text-sm font-bold text-[#004B63] mb-2">
                        {isChallengeCompleted ? 'Reto Superado' : 'Desafío del Módulo'}
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed border-l-2 border-[#004B63] pl-4 py-1">
                        &ldquo;{challengeText}&rdquo;
                    </p>
                </div>

                {isChallengeCompleted && challengeScore > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#004B63]/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-500">Puntuación</span>
                            <span className={`text-xs font-semibold ${scoreColor}`}>{challengeScore}%</span>
                        </div>
                        <div className="h-1.5 bg-white rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                    isApproved
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-400'
                                }`}
                                style={{ width: `${challengeScore}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-xs text-slate-400">0%</span>
                            <span className="text-xs text-[#00BCD4] font-medium">70%</span>
                            <span className="text-xs text-slate-400">100%</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#004B63]/10">
                    <div className="flex items-center gap-1.5">
                        <Icon name="fa-brain" className="text-[#004B63] text-sm" />
                        <span className="text-xs text-slate-500">Práctica</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Icon name="fa-chart-line" className="text-[#004B63] text-sm" />
                        <span className="text-xs text-slate-500">
                            {isChallengeCompleted ? 'Avanzado' : 'Intermedio'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                {isChallengeCompleted ? (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className={`flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 font-semibold flex items-center justify-center gap-2 text-sm ${
                                isButtonDisabled ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                            onClick={handleReviewCompleted}
                            disabled={isButtonDisabled}
                        >
                            <Icon name="fa-trophy" className="text-sm" />
                            <span>Ver Resultado</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className={`flex-1 px-6 py-3 border-2 border-[#004B63]/15 text-[#004B63] rounded-xl hover:bg-[#004B63]/5 hover:border-[#004B63]/30 transition-all duration-300 font-semibold flex items-center justify-center gap-2 text-sm ${
                                isButtonDisabled ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                            onClick={handleRetryChallenge}
                            disabled={isButtonDisabled}
                        >
                            <Icon name="fa-rocket" className="text-sm" />
                            <span>Versión Avanzada</span>
                        </motion.button>
                    </>
                ) : (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className={`w-full px-6 py-3 bg-gradient-to-r from-[#004B63] via-[#003A4D] to-[#06B6D4] text-white rounded-xl hover:bg-white hover:text-[#004B63] hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 font-semibold flex items-center justify-center gap-2 text-sm ${
                                isStartingChallenge || isButtonDisabled ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                            onClick={handleStartChallenge}
                            disabled={isStartingChallenge || isButtonDisabled}
                        >
                            {isStartingChallenge ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Preparando...</span>
                                </>
                            ) : (
                                <>
                                    <Icon name="fa-play-circle" className="text-sm text-white hover:text-[#004B63]" />
                                    <span className="text-sm text-white hover:text-[#004B63]">Iniciar Desafío</span>
                                </>
                            )}
                        </motion.button>
                    </>
                )}
            </div>

            <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-[#004B63] rounded-full"></div>
                            <span className="text-xs text-slate-500">Dificultad: {isChallengeCompleted ? 'Dominada' : 'Media-Alta'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-[#004B63] rounded-full"></div>
                            <span className="text-xs text-slate-500">Impacto: Alto</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`relative z-10 bg-white rounded-2xl border border-slate-100 shadow-[0px_4px_16px_rgba(17,17,26,0.05)] p-5 md:p-8 overflow-hidden ${className}`}
            style={style}
            {...rest}
        >
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#004B63]/6 to-[#00BCD4]/4 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#004B63]/4 to-[#00BCD4]/2 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-t-2xl" />

            {isLoadingProgress ? renderSkeleton() : renderContent()}
        </motion.div>
    );
};

export default IALabChallengeSection;
