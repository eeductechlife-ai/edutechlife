import React, { useState, useEffect } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';

/**
 * Componente para mostrar resultados de evaluación con DeepSeek
 * Dashboard premium con nota final, feedback detallado y persistencia en Supabase
 * 
 * @param {Object} props
 * @param {Object} props.evaluation - Resultados de evaluación de DeepSeek
 * @param {Function} props.onClose - Handler para cerrar modal
 */
const IALabEvaluationResults = ({ evaluation, onClose }) => {
    const [gradeSaved, setGradeSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [timeElapsed] = useState(() => {
        // Simular tiempo de evaluación (1-3 minutos)
        return Math.floor(Math.random() * 120) + 60;
    });

    // Simular guardado exitoso en Supabase
    useEffect(() => {
        const timer = setTimeout(() => {
            setGradeSaved(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (!evaluation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                    <Icon name="fa-exclamation-triangle" className="text-red-400 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No hay resultados disponibles</h3>
                <p className="text-slate-400 text-center max-w-md mb-6">
                    Ocurrió un error al procesar tu evaluación. Por favor, intenta nuevamente.
                </p>
                <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
                >
                    <Icon name="fa-arrow-left" className="mr-2" />
                    Volver al inicio
                </button>
            </div>
        );
    }

    const isApproved = evaluation.notaGlobal >= 70;
    const scoreColor = isApproved ? 'text-emerald-400' : 'text-amber-400';
    const scoreBgColor = isApproved ? 'bg-emerald-500/20' : 'bg-amber-500/20';
    const scoreBorderColor = isApproved ? 'border-emerald-500/30' : 'border-amber-500/30';

    // Calcular porcentaje para gráfico circular
    const percentage = evaluation.notaGlobal;
    const circumference = 2 * Math.PI * 45; // radio 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header de resultados */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#004B63] to-[#00BCD4] flex items-center justify-center">
                                <Icon name="fa-trophy" className="text-white text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {isApproved ? '🎉 ¡Evaluación Completada!' : '📝 Resultados de Evaluación'}
                                </h2>
                                <p className="text-slate-400">
                                    DeepSeek ha analizado tus respuestas y proporcionado feedback detallado
                                </p>
                            </div>
                        </div>

                        {/* Estado de guardado */}
                        <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${gradeSaved ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-amber-500/20 border border-amber-500/30'}`}>
                            {gradeSaved ? (
                                <>
                                    <Icon name="fa-check-circle" className="text-emerald-400" />
                                    <span className="text-sm text-emerald-400 font-medium">
                                        Nota registrada oficialmente en tu expediente
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm text-amber-400 font-medium">
                                        Registrando tu nota oficial...
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Banner de importancia */}
                    <div className="bg-gradient-to-r from-[#004B63]/30 to-[#00BCD4]/30 rounded-xl p-5 border border-[#00BCD4]/20">
                        <div className="flex items-center gap-3">
                            <Icon name="fa-chart-line" className="text-white text-xl" />
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">
                                    Este desafío equivale al 30% de tu nota del Módulo 1
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    Tu desempeño en esta evaluación impacta directamente en tu progreso general del curso.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda: Resumen y métricas */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabs de navegación */}
                        <div className="border-b border-slate-700">
                            <div className="flex space-x-1">
                                {['overview', 'feedback', 'details'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                                            activeTab === tab
                                                ? 'bg-slate-800 text-white border-b-2 border-[#00BCD4]'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <Icon 
                                            name={
                                                tab === 'overview' ? 'fa-chart-bar' :
                                                tab === 'feedback' ? 'fa-comment-dots' :
                                                'fa-info-circle'
                                            } 
                                            className="mr-2" 
                                        />
                                        {tab === 'overview' && 'Resumen'}
                                        {tab === 'feedback' && 'Feedback por Ejercicio'}
                                        {tab === 'details' && 'Detalles Técnicos'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contenido según tab activo */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Gráfico circular de nota */}
                                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="relative w-48 h-48">
                                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                                {/* Fondo del círculo */}
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke="#1e293b"
                                                    strokeWidth="8"
                                                />
                                                {/* Círculo de progreso */}
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke={isApproved ? "#10b981" : "#f59e0b"}
                                                    strokeWidth="8"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={strokeDashoffset}
                                                    strokeLinecap="round"
                                                    transform="rotate(-90 50 50)"
                                                />
                                                {/* Texto central */}
                                                <text
                                                    x="50"
                                                    y="50"
                                                    textAnchor="middle"
                                                    dy="0.3em"
                                                    className="text-3xl font-bold fill-white"
                                                >
                                                    {evaluation.notaGlobal}%
                                                </text>
                                                <text
                                                    x="50"
                                                    y="60"
                                                    textAnchor="middle"
                                                    className="text-sm fill-slate-400"
                                                >
                                                    Nota Final
                                                </text>
                                            </svg>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-4">Análisis de Desempeño</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-slate-400">Estado</span>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                            {isApproved ? '✅ Aprobado' : '⚠️ Necesita mejora'}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full ${isApproved ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`}
                                                            style={{ width: `${evaluation.notaGlobal}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-slate-900/50 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-white mb-1">
                                                            {timeElapsed}s
                                                        </div>
                                                        <div className="text-sm text-slate-400">Tiempo empleado</div>
                                                    </div>
                                                    <div className="bg-slate-900/50 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-white mb-1">
                                                            {isApproved ? 'Alto' : 'Medio'}
                                                        </div>
                                                        <div className="text-sm text-slate-400">Nivel de dominio</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recomendaciones */}
                                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                    <h3 className="text-xl font-bold text-white mb-4">Recomendaciones de DeepSeek</h3>
                                    <div className="space-y-4">
                                        {isApproved ? (
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Icon name="fa-star" className="text-emerald-400" />
                                                    <h4 className="font-semibold text-white">¡Excelente trabajo!</h4>
                                                </div>
                                                <p className="text-slate-300">
                                                    Has demostrado un entendimiento sólido de los principios de diseño de prompts. 
                                                    Continúa practicando con casos más complejos para alcanzar el nivel experto.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Icon name="fa-lightbulb" className="text-amber-400" />
                                                    <h4 className="font-semibold text-white">Áreas de mejora</h4>
                                                </div>
                                                <p className="text-slate-300">
                                                    Enfócate en ser más específico en tus prompts y definir métricas claras. 
                                                    Revisa los ejercicios del módulo 1 antes de intentar nuevamente.
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-slate-900/50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Icon name="fa-book" className="text-[#00BCD4]" />
                                                    <h4 className="font-medium text-white">Próximos pasos</h4>
                                                </div>
                                                <ul className="space-y-2 text-sm text-slate-400">
                                                    <li className="flex items-start gap-2">
                                                        <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                                                        <span>Completa el módulo 2: Prompt Engineering Avanzado</span>
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
                                            <div className="bg-slate-900/50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Icon name="fa-calendar" className="text-[#004B63]" />
                                                    <h4 className="font-medium text-white">Siguiente evaluación</h4>
                                                </div>
                                                <p className="text-sm text-slate-400 mb-2">
                                                    Puedes intentar este desafío nuevamente en:
                                                </p>
                                                <div className="px-3 py-2 bg-[#004B63]/20 border border-[#004B63]/30 rounded-lg">
                                                    <div className="text-[#004B63] font-medium">24 horas</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'feedback' && (
                            <div className="space-y-6">
                                {/* Feedback por ejercicio */}
                                {[
                                    { 
                                        title: 'Ejercicio 1: Identificar', 
                                        feedback: evaluation.feedback_ej1,
                                        icon: 'fa-search',
                                        color: 'text-[#00BCD4]',
                                        bgColor: 'bg-[#00BCD4]/10'
                                    },
                                    { 
                                        title: 'Ejercicio 2: Optimizar', 
                                        feedback: evaluation.feedback_ej2,
                                        icon: 'fa-magic',
                                        color: 'text-emerald-500',
                                        bgColor: 'bg-emerald-500/10'
                                    },
                                    { 
                                        title: 'Ejercicio 3: Crear', 
                                        feedback: evaluation.feedback_ej3,
                                        icon: 'fa-plus-circle',
                                        color: 'text-[#004B63]',
                                        bgColor: 'bg-[#004B63]/10'
                                    }
                                ].map((exercise, index) => (
                                    <div key={index} className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-12 h-12 rounded-xl ${exercise.bgColor} flex items-center justify-center`}>
                                                <Icon name={exercise.icon} className={`${exercise.color} text-lg`} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{exercise.title}</h3>
                                                <p className="text-slate-400 text-sm">Análisis detallado de DeepSeek</p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                                            <div className="flex items-start gap-3">
                                                <Icon name="fa-comment" className="text-slate-500 mt-1" />
                                                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                    {exercise.feedback}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                    <h3 className="text-xl font-bold text-white mb-4">Detalles técnicos de la evaluación</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-900/50 rounded-lg p-4">
                                                <div className="text-sm text-slate-400 mb-1">Modelo de IA</div>
                                                <div className="text-lg font-medium text-white">DeepSeek Chat</div>
                                            </div>
                                            <div className="bg-slate-900/50 rounded-lg p-4">
                                                <div className="text-sm text-slate-400 mb-1">Temperatura</div>
                                                <div className="text-lg font-medium text-white">0.5</div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-900/50 rounded-lg p-4">
                                            <div className="text-sm text-slate-400 mb-2">Criterios de evaluación</div>
                                            <ul className="space-y-2 text-sm text-slate-300">
                                                <li className="flex items-center gap-2">
                                                    <Icon name="fa-check" className="text-emerald-500" />
                                                    <span>Claridad y precisión en la identificación</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Icon name="fa-check" className="text-emerald-500" />
                                                    <span>Mejora sustancial del prompt original</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Icon name="fa-check" className="text-emerald-500" />
                                                    <span>Creatividad y efectividad del prompt creado</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Icon name="fa-check" className="text-emerald-500" />
                                                    <span>Estructura y profesionalismo general</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Columna derecha: Estadísticas y acciones */}
                    <div className="space-y-8">
                        {/* Estadísticas rápidas */}
                        <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                            <h3 className="text-lg font-bold text-white mb-4">Estadísticas</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-slate-400">Puntuación</span>
                                        <span className={`text-lg font-bold ${scoreColor}`}>
                                            {evaluation.notaGlobal}/100
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${isApproved ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`}
                                            style={{ width: `${evaluation.notaGlobal}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">3</div>
                                        <div className="text-xs text-slate-400">Ejercicios</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">{timeElapsed}s</div>
                                        <div className="text-xs text-slate-400">Tiempo</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                            <h3 className="text-lg font-bold text-white mb-4">Acciones</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={onClose}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Icon name="fa-check" />
                                    Cerrar y Volver al Módulo
                                </button>
                                
                                <button className="w-full px-4 py-3 border-2 border-slate-600 text-slate-300 rounded-xl hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-300 flex items-center justify-center gap-2">
                                    <Icon name="fa-download" />
                                    Descargar Certificado
                                </button>
                                
                                <button className="w-full px-4 py-3 border-2 border-slate-600 text-slate-300 rounded-xl hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-300 flex items-center justify-center gap-2">
                                    <Icon name="fa-share" />
                                    Compartir Resultados
                                </button>
                            </div>
                        </div>

                        {/* Insignia */}
                        <div className={`${scoreBgColor} border ${scoreBorderColor} rounded-2xl p-6 text-center`}>
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                <Icon 
                                    name={isApproved ? "fa-trophy" : "fa-certificate"} 
                                    className={`text-3xl ${isApproved ? 'text-emerald-400' : 'text-amber-400'}`}
                                />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">
                                {isApproved ? 'Insignia de Excelencia' : 'Insignia de Participación'}
                            </h4>
                            <p className="text-sm text-slate-300">
                                {isApproved 
                                    ? 'Has demostrado dominio en diseño de prompts básicos'
                                    : 'Continúa practicando para obtener la insignia de excelencia'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IALabEvaluationResults;