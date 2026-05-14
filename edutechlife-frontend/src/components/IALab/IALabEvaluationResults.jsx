import React, { useState, useEffect } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import { useActivityTracker } from '../../hooks/useActivityTracker';

const IALabEvaluationResults = ({ evaluation, onClose, activityType = 'challenge', onRetry }) => {
    const { activeMod } = useIALabContext();
    const { trackActivity } = useActivityTracker();
    const [gradeSaved, setGradeSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [remainingAttempts, setRemainingAttempts] = useState(3);

    useEffect(() => {
        if (activityType !== 'challenge') return;
        const today = new Date().toISOString().split('T')[0];
        const key = `challenge_attempts_m${activeMod}_${today}`;
        const current = useIALabStore.getState().storageGetInt(key, 3);
        setRemainingAttempts(current);
    }, [activityType, activeMod]);

    const handleRetry = () => {
        if (activityType !== 'challenge' || remainingAttempts <= 0) return;
        const today = new Date().toISOString().split('T')[0];
        const key = `challenge_attempts_m${activeMod}_${today}`;
        const current = useIALabStore.getState().storageGetInt(key, 3);
        const newVal = Math.max(0, current - 1);
        useIALabStore.getState().storageSetString(key, newVal);
        setRemainingAttempts(newVal);
        if (onRetry) onRetry();
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setGradeSaved(true);
            if (evaluation?.notaGlobal) {
                trackActivity({
                    moduleId: activeMod,
                    type: activityType,
                    resourceId: `m${activeMod}_${activityType}`,
                    title: `${activityType === 'exam' ? 'Examen' : 'Desafío'} Módulo ${activeMod}`,
                    score: evaluation.notaGlobal,
                    metadata: {
                        nota_ej1: evaluation.nota_ej1,
                        nota_ej2: evaluation.nota_ej2,
                        nota_ej3: evaluation.nota_ej3,
                        feedback_ej1: evaluation.feedback_ej1,
                        feedback_ej2: evaluation.feedback_ej2,
                        feedback_ej3: evaluation.feedback_ej3,
                    }
                });
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!evaluation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <Icon name="fa-exclamation-triangle" className="text-red-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No hay resultados disponibles</h3>
                <p className="text-slate-500 text-center max-w-md mb-6">
                    Ocurrió un error al procesar tu evaluación. Por favor, intenta nuevamente.
                </p>
                <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
                >
                    <Icon name="fa-arrow-left" className="mr-2" />
                    Volver al inicio
                </button>
            </div>
        );
    }

    const isApproved = evaluation.notaGlobal >= 80;
    const scoreColor = isApproved ? 'text-emerald-600' : 'text-red-600';
    const scoreBgColor = isApproved ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200';
    const scoreBarColor = isApproved ? 'from-emerald-500 to-emerald-400' : 'from-red-500 to-red-400';

    const percentage = evaluation.notaGlobal;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex-1 overflow-y-auto dark:bg-slate-900">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
                                <Icon name="fa-trophy" className="text-white text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                    {isApproved ? `Resultado del Desafío del Módulo ${activeMod}` : `Resultado del Desafío del Módulo ${activeMod}`}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400">
                                    Edutechlife ha analizado tus respuestas y proporcionado feedback detallado
                                </p>
                            </div>
                        </div>

                        <div className={`px-4 py-2 rounded-lg flex items-center gap-2 border ${gradeSaved ? 'bg-emerald-50 border-emerald-200' : 'bg-petroleum/5 border-petroleum/10'}`}>
                            {gradeSaved ? (
                                <>
                                    <Icon name="fa-check-circle" className="text-emerald-500" />
                                    <span className="text-sm text-emerald-600 font-medium">
                                        Nota registrada oficialmente
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 border-2 border-petroleum border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm text-petroleum font-medium">
                                        Registrando tu nota oficial...
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-petroleum/10 to-corporate/10 rounded-xl p-5 border border-corporate/20 dark:from-petroleum/20 dark:to-corporate/20 dark:border-corporate/40">
                        <div className="flex items-center gap-3">
                            <Icon name="fa-chart-line" className="text-petroleum text-xl" />
                            <div>
                                <h3 className="text-lg font-bold text-petroleum dark:text-[#4DA8C4] mb-1">
                                    Este desafío equivale al 30% de tu nota del Módulo {activeMod}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm">
                                    Tu desempeño en esta evaluación impacta directamente en tu progreso general del curso.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabs */}
                        <div className="border-b border-slate-200">
                            <div className="flex space-x-1">
                                {['overview', 'feedback'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                                            activeTab === tab
                                                ? 'bg-white text-petroleum border-b-2 border-corporate dark:bg-slate-800 dark:text-[#4DA8C4]'
                                                : 'text-slate-600 hover:text-petroleum hover:bg-slate-50 dark:text-slate-400 dark:hover:text-[#4DA8C4] dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Icon 
                                            name={tab === 'overview' ? 'fa-chart-bar' : 'fa-comment-dots'} 
                                            className="mr-2" 
                                        />
                                        {tab === 'overview' ? 'Resumen' : 'Feedback por Ejercicio'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Score circular */}
                                <div className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6">
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="relative w-48 h-48">
                                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                                <circle
                                                    cx="50" cy="50" r="45" fill="none"
                                                    stroke={isApproved ? "var(--color-success)" : "#ef4444"}
                                                    strokeWidth="8"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={strokeDashoffset}
                                                    strokeLinecap="round"
                                                    transform="rotate(-90 50 50)"
                                                />
                                                <text x="50" y="46" textAnchor="middle" className="text-2xl font-bold fill-slate-800">
                                                    {evaluation.notaGlobal}%
                                                </text>
                                                <text x="50" y="60" textAnchor="middle" className="text-xs fill-slate-500">
                                                    Nota Final
                                                </text>
                                            </svg>
                                        </div>

                                        <div className="flex-1 w-full">
                                            <h3 className="text-xl font-bold text-slate-800 mb-4">Análisis de Desempeño</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-slate-500">Estado (mínimo 80%)</span>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                        }`}>
                                                            <Icon name={isApproved ? "fa-check-circle" : "fa-xmark-circle"} className="mr-1" />
                                                            {isApproved ? 'Aprobado' : 'En progreso'}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full bg-gradient-to-r ${scoreBarColor}`}
                                                            style={{ width: `${evaluation.notaGlobal}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                 <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                                                            {isApproved ? 'Alto' : 'Medio'}
                                                        </div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">Nivel de dominio</div>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                                                            3/3
                                                        </div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">Ejercicios completados</div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-slate-100">
                                                    <h4 className="text-sm font-semibold text-slate-600 mb-3">Desglose por Ejercicio</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-slate-500">Ej 1: Identificar</span>
                                                            <span className={`font-semibold ${
                                                                (evaluation.nota_ej1 || 0) >= 80 ? 'text-emerald-600' :
                                                                (evaluation.nota_ej1 || 0) >= 60 ? 'text-amber-600' : 'text-red-600'
                                                            }`}>{evaluation.nota_ej1 || 0}%</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-slate-500">Ej 2: Optimizar</span>
                                                            <span className={`font-semibold ${
                                                                (evaluation.nota_ej2 || 0) >= 80 ? 'text-emerald-600' :
                                                                (evaluation.nota_ej2 || 0) >= 60 ? 'text-amber-600' : 'text-red-600'
                                                            }`}>{evaluation.nota_ej2 || 0}%</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-slate-500">Ej 3: Crear</span>
                                                            <span className={`font-semibold ${
                                                                (evaluation.nota_ej3 || 0) >= 80 ? 'text-emerald-600' :
                                                                (evaluation.nota_ej3 || 0) >= 60 ? 'text-amber-600' : 'text-red-600'
                                                            }`}>{evaluation.nota_ej3 || 0}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recomendaciones personalizadas */}
                                <div className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Recomendaciones Personalizadas</h3>
                                    <div className="space-y-4">
                                        {isApproved ? (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Icon name="fa-star" className="text-emerald-500" />
                                                    <h4 className="font-semibold text-slate-800">¡Felicitaciones! Desafío Aprobado</h4>
                                                </div>
                                                <p className="text-slate-600">
                                                    {evaluation.notaGlobal >= 90 
                                                        ? 'Desempeño excepcional. Dominas los principios de diseño de prompts. Estás listo para casos más complejos.'
                                                        : evaluation.notaGlobal >= 85
                                                        ? 'Muy buen trabajo. Tienes una base sólida. Practica con casos más complejos para alcanzar el nivel experto.'
                                                        : 'Aprobaste el desafío. Revisa el feedback de cada ejercicio para identificar áreas de mejora y perfeccionar tus habilidades.'
                                                    }
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Icon name="fa-lightbulb" className="text-red-600" />
                                                    <h4 className="font-semibold text-slate-800">No te desanimes, puedes mejorar</h4>
                                                </div>
                                                <p className="text-slate-600 mb-3">
                                                    Necesitas 80% para aprobar. Aquí tienes recomendaciones específicas basadas en tu desempeño:
                                                </p>
                                                <div className="space-y-2">
                                                    {(evaluation.nota_ej1 || 0) < 80 && (
                                                        <div className="flex items-start gap-2 text-sm text-slate-600">
                                                            <Icon name="fa-search" className="text-corporate mt-0.5" />
                                                            <span><strong>Ejercicio 1:</strong> Practica identificando Rol, Contexto y Tarea en cualquier texto. Busca "Eres un..." para el Rol, "trabajando para..." para Contexto, y "debes/crear..." para Tarea.</span>
                                                        </div>
                                                    )}
                                                    {(evaluation.nota_ej2 || 0) < 80 && (
                                                        <div className="flex items-start gap-2 text-sm text-slate-600">
                                                            <Icon name="fa-magic" className="text-emerald-500 mt-0.5" />
                                                            <span><strong>Ejercicio 2:</strong> Usa la estructura ## Rol + ## Contexto + ## Objetivo + ## Audiencia + ## Formato. Agrega métricas específicas y ejemplos concretos.</span>
                                                        </div>
                                                    )}
                                                    {(evaluation.nota_ej3 || 0) < 80 && (
                                                        <div className="flex items-start gap-2 text-sm text-slate-600">
                                                            <Icon name="fa-plus-circle" className="text-petroleum mt-0.5" />
                                                            <span><strong>Ejercicio 3:</strong> Construye prompts completos desde cero. Incluye restricciones claras, ejemplos de lo que esperas, y el formato exacto de respuesta.</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Icon name="fa-book" className="text-corporate" />
                                                    <h4 className="font-medium text-slate-800 dark:text-slate-100">Próximos pasos</h4>
                                                </div>
                                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                                    <li className="flex items-start gap-2">
                                                        <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                                                        <span>Completa el siguiente módulo del curso</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                                                        <span>Practica con el sintetizador de prompts</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                                                        <span>Participa en el foro de la comunidad</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Icon name="fa-calendar" className="text-petroleum" />
                                                    <h4 className="font-medium text-slate-800 dark:text-slate-100">Siguiente evaluación</h4>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-2">
                                                    Puedes intentar este desafío nuevamente en:
                                                </p>
                                                <div className="px-3 py-2 bg-petroleum/10 border border-petroleum/20 rounded-lg">
                                                    <div className="text-petroleum font-medium">24 horas</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'feedback' && (
                            <div className="space-y-6">
                                {[
                                    { 
                                        title: 'Ejercicio 1: Identificar', 
                                        feedback: evaluation.feedback_ej1,
                                        nota: evaluation.nota_ej1,
                                        icon: 'fa-search',
                                        color: 'text-corporate',
                                        bgColor: 'bg-corporate/10'
                                    },
                                    { 
                                        title: 'Ejercicio 2: Optimizar', 
                                        feedback: evaluation.feedback_ej2,
                                        nota: evaluation.nota_ej2,
                                        icon: 'fa-magic',
                                        color: 'text-emerald-500',
                                        bgColor: 'bg-emerald-500/10'
                                    },
                                    { 
                                        title: 'Ejercicio 3: Crear', 
                                        feedback: evaluation.feedback_ej3,
                                        nota: evaluation.nota_ej3,
                                        icon: 'fa-plus-circle',
                                        color: 'text-petroleum',
                                        bgColor: 'bg-petroleum/10'
                                    }
                                ].map((exercise, index) => (
                                    <div key={index} className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-12 h-12 rounded-xl ${exercise.bgColor} flex items-center justify-center`}>
                                                <Icon name={exercise.icon} className={`${exercise.color} text-lg`} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{exercise.title}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm">Análisis detallado de Edutechlife</p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-lg text-lg font-bold ${
                                                exercise.nota >= 80 ? 'bg-emerald-50 text-emerald-600' :
                                                exercise.nota >= 60 ? 'bg-amber-50 text-amber-600' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                                {exercise.nota}%
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        exercise.nota >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                                                        exercise.nota >= 60 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                                                        'bg-gradient-to-r from-red-500 to-red-400'
                                                    }`}
                                                    style={{ width: `${exercise.nota}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
                                            <div className="flex items-start gap-3">
                                                <Icon name="fa-comment" className="text-slate-400 mt-1" />
                                                <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                                                    {exercise.feedback}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Columna derecha */}
                    <div className="space-y-8">
                        <div className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Estadísticas</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-slate-500">Puntuación Global</span>
                                        <span className={`text-lg font-bold ${scoreColor}`}>
                                            {evaluation.notaGlobal}/100
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full bg-gradient-to-r ${scoreBarColor}`}
                                            style={{ width: `${evaluation.notaGlobal}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <h4 className="text-sm font-semibold text-slate-600 mb-3">Notas por Ejercicio</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-slate-500">Ej 1: Identificar</span>
                                                <span className={`text-sm font-bold ${
                                                    (evaluation.nota_ej1 || 0) >= 80 ? 'text-emerald-600' :
                                                    (evaluation.nota_ej1 || 0) >= 60 ? 'text-amber-600' : 'text-red-600'
                                                }`}>{evaluation.nota_ej1 || 0}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${
                                                        (evaluation.nota_ej1 || 0) >= 80 ? 'bg-emerald-500' :
                                                        (evaluation.nota_ej1 || 0) >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${evaluation.nota_ej1 || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-slate-500">Ej 2: Optimizar</span>
                                                <span className={`text-sm font-bold ${
                                                    (evaluation.nota_ej2 || 0) >= 80 ? 'text-emerald-600' :
                                                    (evaluation.nota_ej2 || 0) >= 60 ? 'text-amber-600' : 'text-red-600'
                                                }`}>{evaluation.nota_ej2 || 0}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${
                                                        (evaluation.nota_ej2 || 0) >= 80 ? 'bg-emerald-500' :
                                                        (evaluation.nota_ej2 || 0) >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${evaluation.nota_ej2 || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-slate-500">Ej 3: Crear</span>
                                                <span className={`text-sm font-bold ${
                                                    (evaluation.nota_ej3 || 0) >= 80 ? 'text-emerald-600' :
                                                    (evaluation.nota_ej3 || 0) >= 60 ? 'text-amber-600' : 'text-red-600'
                                                }`}>{evaluation.nota_ej3 || 0}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${
                                                        (evaluation.nota_ej3 || 0) >= 80 ? 'bg-emerald-500' :
                                                        (evaluation.nota_ej3 || 0) >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${evaluation.nota_ej3 || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`rounded-xl p-4 border ${scoreBgColor}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon 
                                            name={isApproved ? "fa-trophy" : "fa-certificate"} 
                                            className={isApproved ? 'text-emerald-500' : 'text-petroleum'}
                                        />
                                        <h4 className={`font-semibold ${isApproved ? 'text-emerald-700' : 'text-petroleum'}`}>
                                            {isApproved ? '¡Desafío Aprobado!' : 'No alcanzaste el 80% mínimo'}
                                        </h4>
                                    </div>
                                    <p className={`text-sm ${isApproved ? 'text-emerald-600' : 'text-slate-600'}`}>
                                        {isApproved 
                                            ? 'Has demostrado dominio en diseño de prompts. ¡Excelente trabajo!'
                                            : 'Necesitas 80% para aprobar. Revisa el feedback de cada ejercicio y vuelve a intentarlo.'
                                        }
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center bg-slate-50 rounded-lg p-3">
                                        <div className="text-2xl font-bold text-slate-800">{remainingAttempts}</div>
                                        <div className="text-xs text-slate-500">Ejercicios</div>
                                    </div>
                                    {isApproved && (
                                        <div className="text-center bg-slate-50 rounded-lg p-3">
                                            <div className="text-2xl font-bold text-slate-800">80%+</div>
                                            <div className="text-xs text-slate-500">Aprobado</div>
                                        </div>
                                    )}
                                </div>
                                {!isApproved && remainingAttempts > 0 && (
                                    <button onClick={handleRetry} className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white font-bold text-sm hover:shadow-lg hover:shadow-petroleum/20 transition-all duration-300 flex items-center justify-center gap-2">
                                        <Icon name="fa-rocket" className="text-base" />
                                        Reintentar desafío
                                    </button>
                                )}
                                {!isApproved && remainingAttempts <= 0 && (
                                    <p className="text-xs text-center text-slate-400 mt-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">Has agotado tus intentos para este desafío.</p>
                                )}
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default IALabEvaluationResults;
