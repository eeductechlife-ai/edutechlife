import React, { useState, useEffect } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabQuiz } from '../../hooks/IALab/useIALabQuiz';
import { useIALabTimer } from '../../hooks/IALab/useIALabTimer';

/**
 * Componente premium para modal de evaluación de IALab
 * Sistema de evaluación completo con timer, seguridad y preguntas
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Handler para cerrar modal
 */
const IALabEvaluationModal = ({ isOpen, onClose }) => {
    const { 
        activeMod, 
        modules, 
        showExamModal, 
        setShowExamModal,
        isModuleLocked,
        completedModules
    } = useIALabContext();

    const {
        quizQuestions,
        quizAnswers,
        showScoreResult,
        quizScore,
        isSubmitting,
        dailyAttemptsCount,
        DAILY_ATTEMPTS_LIMIT,
        TOTAL_QUESTIONS,
        handleAnswerSelect,
        handleSubmitQuiz,
        resetQuizForRetry,
        getLatestQuizAttempt
    } = useIALabQuiz();

    const {
        isTimerRunning,
        timeElapsed,
        suggestedTime,
        showTimeWarning,
        startTimer,
        pauseTimer,
        resetTimer,
        formatTime
    } = useIALabTimer();

    const [securityWarningCount, setSecurityWarningCount] = useState(0);
    const [screenshotProtectionActive, setScreenshotProtectionActive] = useState(false);

    // Módulo actual
    const currentModule = modules.find(m => m.id === activeMod);
    const latestAttempt = getLatestQuizAttempt();

    // Inicializar timer cuando se abre el modal
    useEffect(() => {
        if (isOpen && !showScoreResult) {
            startTimer();
        } else {
            pauseTimer();
        }

        return () => {
            pauseTimer();
        };
    }, [isOpen, showScoreResult, startTimer, pauseTimer]);

    // Protección contra screenshots
    useEffect(() => {
        if (isOpen) {
            const handleKeyDown = (e) => {
                // Detectar combinaciones de teclas para screenshots
                if ((e.ctrlKey && e.key === 'p') || (e.metaKey && e.shiftKey && e.key === '4')) {
                    e.preventDefault();
                    setSecurityWarningCount(prev => prev + 1);
                    setScreenshotProtectionActive(true);
                    
                    setTimeout(() => {
                        setScreenshotProtectionActive(false);
                    }, 3000);
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen]);

    // Handler para cerrar modal
    const handleCloseModal = () => {
        if (Object.keys(quizAnswers).length > 0 && !showScoreResult) {
            if (confirm('⚠️ Tienes respuestas sin enviar. ¿Estás seguro de que quieres salir? Tu progreso se perderá.')) {
                resetQuizForRetry();
                resetTimer();
                onClose();
            }
        } else {
            resetTimer();
            onClose();
        }
    };

    // Handler para enviar evaluación
    const handleSubmitEvaluation = async () => {
        if (Object.keys(quizAnswers).length < TOTAL_QUESTIONS) {
            alert(`⚠️ Debes responder todas las ${TOTAL_QUESTIONS} preguntas antes de enviar.`);
            return;
        }

        await handleSubmitQuiz();
        pauseTimer();
    };

    // Render protección anti-screenshot
    const renderScreenshotProtection = () => (
        screenshotProtectionActive && (
            <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center">
                    <Icon name="fa-shield-alt" className="text-red-500 text-4xl mb-4" />
                    <h3 className="text-xl font-bold text-[#00374A] mb-2">⚠️ Protección Activada</h3>
                    <p className="text-slate-600 mb-4">
                        Se detectó un intento de captura de pantalla. Esta acción está prohibida durante la evaluación.
                    </p>
                    <p className="text-sm text-slate-500">
                        Advertencia {securityWarningCount}/3 - Si alcanzas el límite, la evaluación se cancelará automáticamente.
                    </p>
                </div>
            </div>
        )
    );

    // Render sidebar de módulos
    const renderSidebar = () => (
        <div className="w-1/5 border-r border-[#004B63]/10 bg-gradient-to-b from-white via-white/98 to-[#F8FAFC]/95 overflow-y-auto">
            <div className="px-5 py-6 space-y-6">
                {/* Título del Sidebar */}
                <div className="px-2 w-full">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-[#004B63]">
                            <Icon name="fa-layer-group" className="text-sm" />
                        </div>
                        <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
                            MÓDULOS
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
                    </div>
                    
                    {/* Lista de Módulos */}
                    <div className="space-y-2">
                        {modules.map((mod) => (
                            <button
                                key={mod.id}
                                onClick={() => {
                                    if (Object.keys(quizAnswers).length > 0 && !showScoreResult) {
                                        alert("Termina el examen actual primero");
                                    } else if (!isModuleLocked(mod.id)) {
                                        // En una implementación real, esto cambiaría el módulo activo
                                        console.log(`Cambiar a módulo: ${mod.id}`);
                                    }
                                }}
                                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${activeMod === mod.id ? 'bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white' : 'hover:bg-[#004B63]/10'} focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-1`}
                                disabled={isModuleLocked(mod.id) || (Object.keys(quizAnswers).length > 0 && !showScoreResult)}
                                aria-label={`${isModuleLocked(mod.id) ? 'Módulo bloqueado: ' : ''}${mod.title}`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activeMod === mod.id ? 'bg-white/20' : 'bg-[#004B63]/10'}`}>
                                    <Icon name={mod.icon} className={`${activeMod === mod.id ? 'text-white' : 'text-[#004B63]'} text-sm`} />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="font-semibold text-sm truncate">{mod.title}</p>
                                    <p className={`text-xs ${activeMod === mod.id ? 'text-white/80' : 'text-slate-500'}`}>
                                        {mod.duration}
                                    </p>
                                </div>
                                {isModuleLocked(mod.id) && (
                                    <Icon name="fa-lock" className="text-xs text-slate-400" />
                                )}
                                {!isModuleLocked(mod.id) && completedModules.includes(mod.id) && (
                                    <Icon name="fa-check" className="text-xs text-emerald-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Información del Módulo Actual */}
                <div className="px-2 w-full mt-8">
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-600 mb-2">Examen actual:</p>
                        <p className="text-sm font-semibold text-[#004B63]">
                            Módulo {activeMod}: {currentModule?.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {Object.keys(quizAnswers).length}/{TOTAL_QUESTIONS} preguntas respondidas
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render header del modal
    const renderHeader = () => (
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
            <button 
                onClick={handleCloseModal}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
            >
                <Icon name="fa-arrow-left" className="text-sm" />
                <span className="text-sm font-medium">Salir</span>
            </button>

            <div className="flex items-center gap-4">
                {/* Timer */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                    <Icon name="fa-clock" className="text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">
                        {formatTime(timeElapsed)} / {formatTime(suggestedTime)}
                    </span>
                    <button
                        onClick={isTimerRunning ? pauseTimer : startTimer}
                        className="text-xs text-[#00BCD4] hover:text-[#004B63]"
                    >
                        {isTimerRunning ? '⏸️ Pausar' : '▶️ Reanudar'}
                    </button>
                </div>

                {/* Contador de preguntas */}
                <div className="px-3 py-2 bg-[#004B63]/10 rounded-lg">
                    <span className="text-sm font-medium text-[#004B63]">
                        {Object.keys(quizAnswers).length}/{TOTAL_QUESTIONS}
                    </span>
                    <span className="text-xs text-slate-600 ml-1">preguntas</span>
                </div>
            </div>
        </div>
    );

    // Render sección de timer
    const renderTimerSection = () => (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Icon name="fa-clock" className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Tiempo sugerido</span>
                    <span className="text-xs text-blue-500 px-2 py-1 bg-blue-100 rounded-full">
                        Opcional
                    </span>
                </div>
                <button
                    onClick={isTimerRunning ? pauseTimer : startTimer}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    {isTimerRunning ? '⏸️ Pausar' : '▶️ Iniciar'} timer
                </button>
            </div>
            
            <div className="flex items-center justify-between">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">
                        {formatTime(suggestedTime - timeElapsed)}
                    </div>
                    <div className="text-xs text-blue-500 mt-1">Restante</div>
                </div>
                
                <div className="text-center">
                    <div className="text-lg font-medium text-gray-700">
                        {formatTime(timeElapsed)}
                    </div>
                    <div className="text-xs text-gray-500">Transcurrido</div>
                </div>
                
                <div className="text-center">
                    <div className="text-lg font-medium text-gray-700">{formatTime(suggestedTime)}</div>
                    <div className="text-xs text-gray-500">Total sugerido</div>
                </div>
            </div>
            
            {/* Barra de progreso del tiempo */}
            <div className="mt-3 h-2 bg-blue-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000"
                    style={{ width: `${(timeElapsed / suggestedTime) * 100}%` }}
                ></div>
            </div>
            
            {showTimeWarning && (
                <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700 flex items-center gap-1">
                        <Icon name="fa-exclamation-triangle" />
                        Llevas más de 15 minutos. Considera revisar tus respuestas.
                    </p>
                </div>
            )}
        </div>
    );

    // Render contador de intentos
    const renderAttemptsCounter = () => (
        <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon name="fa-rotate-right" className="text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Intentos diarios</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">
                        {dailyAttemptsCount} / {DAILY_ATTEMPTS_LIMIT} usados hoy
                    </span>
                    {dailyAttemptsCount >= DAILY_ATTEMPTS_LIMIT && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                            Límite alcanzado
                        </span>
                    )}
                </div>
            </div>
            
            {dailyAttemptsCount >= DAILY_ATTEMPTS_LIMIT && (
                <p className="text-xs text-slate-600 mt-2">
                    <Icon name="fa-info-circle" className="inline mr-1" />
                    Has agotado tus {DAILY_ATTEMPTS_LIMIT} intentos diarios. Vuelve mañana para intentar nuevamente.
                </p>
            )}
        </div>
    );

    // Render pregunta individual
    const renderQuestion = (question, index) => {
        const isAnswered = quizAnswers[question.id] !== undefined;
        const userAnswer = quizAnswers[question.id];

        return (
            <div key={question.id} className="mb-8 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                {/* Encabezado de pregunta */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-xl flex items-center justify-center text-white font-bold">
                            {index + 1}
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-[#00374A]">Pregunta {index + 1}</h4>
                            <p className="text-sm text-slate-600">{question.points} puntos</p>
                        </div>
                    </div>
                    
                    {isAnswered && (
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                            ✅ Respondida
                        </div>
                    )}
                </div>

                {/* Texto de la pregunta */}
                <div className="mb-6">
                    <p className="text-[#00374A] leading-relaxed">{question.text}</p>
                    {question.code && (
                        <pre className="mt-3 p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
                            <code>{question.code}</code>
                        </pre>
                    )}
                </div>

                {/* Opciones de respuesta */}
                <div className="space-y-3">
                    {question.options.map((option, optIndex) => {
                        const isSelected = userAnswer === optIndex;
                        const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D

                        return (
                            <button
                                key={optIndex}
                                onClick={() => handleAnswerSelect(question.id, optIndex)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                                    isSelected
                                        ? 'bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/10 border-[#00BCD4] shadow-[0_0_0_3px_rgba(0,188,212,0.1)]'
                                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        isSelected 
                                            ? 'bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white' 
                                            : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        <span className="font-bold">{optionLetter}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[#00374A]">{option}</p>
                                    </div>
                                    {isSelected && (
                                        <Icon name="fa-check-circle" className="text-[#00BCD4] flex-shrink-0" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Pista (si existe) */}
                {question.hint && !isAnswered && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Icon name="fa-lightbulb" className="text-amber-600" />
                            <span className="text-sm font-medium text-amber-700">Pista:</span>
                        </div>
                        <p className="text-sm text-amber-600 mt-1">{question.hint}</p>
                    </div>
                )}
            </div>
        );
    };

    // Render resultados
    const renderResults = () => {
        const isApproved = quizScore >= 70;
        const scoreColor = isApproved ? 'text-emerald-600' : 'text-red-600';
        const scoreBgColor = isApproved ? 'bg-emerald-100' : 'bg-red-100';

        return (
            <div className="p-8 text-center">
                <div className="max-w-2xl mx-auto">
                    {/* Icono de resultado */}
                    <div className={`w-24 h-24 rounded-full ${scoreBgColor} flex items-center justify-center mx-auto mb-6`}>
                        <Icon 
                            name={isApproved ? "fa-trophy" : "fa-exclamation-triangle"} 
                            className={`text-4xl ${scoreColor}`}
                        />
                    </div>

                    {/* Título */}
                    <h2 className="text-3xl font-bold text-[#00374A] mb-3">
                        {isApproved ? '🎉 ¡Felicidades!' : '📝 Necesitas practicar más'}
                    </h2>

                    {/* Puntuación */}
                    <div className="mb-6">
                        <div className="text-5xl font-bold mb-2">
                            <span className={scoreColor}>{quizScore}%</span>
                        </div>
                        <p className="text-slate-600">
                            {isApproved ? '¡Has aprobado la evaluación!' : `Necesitas al menos 70% para aprobar (${quizScore}%)`}
                        </p>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-2xl font-bold text-[#004B63]">{TOTAL_QUESTIONS}</div>
                            <div className="text-sm text-slate-600">Preguntas</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-2xl font-bold text-[#00BCD4]">{formatTime(timeElapsed)}</div>
                            <div className="text-sm text-slate-600">Tiempo</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-2xl font-bold text-[#004B63]">
                                {Math.round((Object.keys(quizAnswers).filter(k => quizAnswers[k] === quizQuestions.find(q => q.id === k)?.correctAnswer).length / TOTAL_QUESTIONS) * 100)}%
                            </div>
                            <div className="text-sm text-slate-600">Precisión</div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isApproved ? (
                            <>
                                <button
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
                                >
                                    <Icon name="fa-check" className="mr-2" />
                                    Continuar al siguiente módulo
                                </button>
                                <button
                                    onClick={() => {
                                        resetQuizForRetry();
                                        resetTimer();
                                    }}
                                    className="px-6 py-3 border-2 border-[#00BCD4] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4]/5 transition-all duration-300"
                                >
                                    <Icon name="fa-redo" className="mr-2" />
                                    Repasar contenido
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        resetQuizForRetry();
                                        resetTimer();
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
                                >
                                    <Icon name="fa-redo" className="mr-2" />
                                    Intentar nuevamente
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-300"
                                >
                                    <Icon name="fa-book" className="mr-2" />
                                    Estudiar más
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mensaje adicional */}
                    <p className="text-sm text-slate-500 mt-6">
                        {latestAttempt && `Tu mejor puntuación anterior: ${latestAttempt.score}%`}
                    </p>
                </div>
            </div>
        );
    };

    // Render contenido principal del examen
    const renderExamContent = () => (
        <div className="flex-1 overflow-y-auto p-6">
            {/* Header del examen */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-xl flex items-center justify-center">
                        <Icon name="fa-clipboard-check" className="text-white text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#00374A]">Evaluación del Módulo</h2>
                        <p className="text-slate-600">
                            {currentModule?.title} • Responde las {TOTAL_QUESTIONS} preguntas para validar tu aprendizaje (70% mínimo para aprobar)
                        </p>
                    </div>
                </div>

                {renderTimerSection()}
                {renderAttemptsCounter()}
            </div>

            {/* Lista de preguntas */}
            <div className="space-y-6">
                {quizQuestions.map((question, index) => renderQuestion(question, index))}
            </div>

            {/* Botón de enviar */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 mt-8 -mx-6">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                        {Object.keys(quizAnswers).length === TOTAL_QUESTIONS ? (
                            <span className="text-emerald-600 font-medium">✅ Todas las preguntas respondidas</span>
                        ) : (
                            `Faltan ${TOTAL_QUESTIONS - Object.keys(quizAnswers).length} preguntas por responder`
                        )}
                    </div>
                    
                    <button
                        onClick={handleSubmitEvaluation}
                        disabled={isSubmitting || Object.keys(quizAnswers).length < TOTAL_QUESTIONS}
                        className="px-8 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <Icon name="fa-paper-plane" />
                                Enviar evaluación
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 z-[100] flex bg-white exam-protection-modal"
                style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    WebkitUserDrag: 'none',
                    userDrag: 'none',
                    WebkitTouchCallout: 'none'
                }}
            >
                {renderSidebar()}
                
                <div className="w-4/5 flex flex-col">
                    {renderHeader()}
                    
                    {showScoreResult ? renderResults() : renderExamContent()}
                </div>
            </div>

            {renderScreenshotProtection()}
        </>
    );
};

export default IALabEvaluationModal;