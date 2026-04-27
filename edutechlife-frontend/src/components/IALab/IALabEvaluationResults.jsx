import React, { useState, useEffect } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';

const IALabEvaluationResults = ({ evaluation, onClose }) => {
    const [gradeSaved, setGradeSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const timer = setTimeout(() => {
            setGradeSaved(true);
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
                    className="px-6 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
                >
                    <Icon name="fa-arrow-left" className="mr-2" />
                    Volver al inicio
                </button>
            </div>
        );
    }

    const isApproved = evaluation.notaGlobal >= 70;
    const scoreColor = isApproved ? 'text-emerald-600' : 'text-[#004B63]';
    const scoreBgColor = isApproved ? 'bg-emerald-50 border-emerald-200' : 'bg-[#004B63]/5 border-[#004B63]/10';
    const scoreBarColor = isApproved ? 'from-emerald-500 to-emerald-400' : 'from-[#004B63] to-[#00BCD4]';

    const percentage = evaluation.notaGlobal;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#004B63] to-[#00BCD4] flex items-center justify-center">
                                <Icon name="fa-trophy" className="text-white text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {isApproved ? 'Resultado del Desafío del Módulo 1' : 'Resultado del Desafío del Módulo 1'}
                                </h2>
                                <p className="text-slate-500">
                                    Edutechlife ha analizado tus respuestas y proporcionado feedback detallado
                                </p>
                            </div>
                        </div>

                        <div className={`px-4 py-2 rounded-lg flex items-center gap-2 border ${gradeSaved ? 'bg-emerald-50 border-emerald-200' : 'bg-[#004B63]/5 border-[#004B63]/10'}`}>
                            {gradeSaved ? (
                                <>
                                    <Icon name="fa-check-circle" className="text-emerald-500" />
                                    <span className="text-sm text-emerald-600 font-medium">
                                        Nota registrada oficialmente
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 border-2 border-[#004B63] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm text-[#004B63] font-medium">
                                        Registrando tu nota oficial...
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/10 rounded-xl p-5 border border-[#00BCD4]/20">
                        <div className="flex items-center gap-3">
                            <Icon name="fa-chart-line" className="text-[#004B63] text-xl" />
                            <div>
                                <h3 className="text-lg font-bold text-[#004B63] mb-1">
                                    Este desafío equivale al 30% de tu nota del Módulo 1
                                </h3>
                                <p className="text-slate-600 text-sm">
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
                                                ? 'bg-white text-[#004B63] border-b-2 border-[#00BCD4]'
                                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
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
                                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="relative w-48 h-48">
                                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                                <circle
                                                    cx="50" cy="50" r="45" fill="none"
                                                    stroke={isApproved ? "#10b981" : "#004B63"}
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
                                                        <span className="text-slate-500">Estado</span>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-[#004B63]/10 text-[#004B63]'
                                                        }`}>
                                                            <Icon name={isApproved ? "fa-check-circle" : "fa-clock"} className="mr-1" />
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
                                                    <div className="bg-slate-50 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-slate-800 mb-1">
                                                            {isApproved ? 'Alto' : 'Medio'}
                                                        </div>
                                                        <div className="text-sm text-slate-500">Nivel de dominio</div>
                                                    </div>
                                                    <div className="bg-slate-50 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-slate-800 mb-1">
                                                            3/3
                                                        </div>
                                                        <div className="text-sm text-slate-500">Ejercicios completados</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recomendaciones */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-slate-800 mb-4">Recomendaciones</h3>
                                    <div className="space-y-4">
                                        {isApproved ? (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Icon name="fa-star" className="text-emerald-500" />
                                                    <h4 className="font-semibold text-slate-800">¡Excelente trabajo!</h4>
                                                </div>
                                                <p className="text-slate-600">
                                                    Has demostrado un entendimiento sólido de los principios de diseño de prompts. 
                                                    Continúa practicando con casos más complejos para alcanzar el nivel experto.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-[#004B63]/5 border border-[#004B63]/10 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Icon name="fa-lightbulb" className="text-[#004B63]" />
                                                    <h4 className="font-semibold text-slate-800">Áreas de mejora</h4>
                                                </div>
                                                <p className="text-slate-600">
                                                    Enfócate en ser más específico en tus prompts y definir métricas claras. 
                                                    Revisa los ejercicios del módulo antes de intentar nuevamente.
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Icon name="fa-book" className="text-[#00BCD4]" />
                                                    <h4 className="font-medium text-slate-800">Próximos pasos</h4>
                                                </div>
                                                <ul className="space-y-2 text-sm text-slate-600">
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
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Icon name="fa-calendar" className="text-[#004B63]" />
                                                    <h4 className="font-medium text-slate-800">Siguiente evaluación</h4>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-2">
                                                    Puedes intentar este desafío nuevamente en:
                                                </p>
                                                <div className="px-3 py-2 bg-[#004B63]/10 border border-[#004B63]/20 rounded-lg">
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
                                    <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-12 h-12 rounded-xl ${exercise.bgColor} flex items-center justify-center`}>
                                                <Icon name={exercise.icon} className={`${exercise.color} text-lg`} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800">{exercise.title}</h3>
                                                <p className="text-slate-500 text-sm">Análisis detallado de Edutechlife</p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                            <div className="flex items-start gap-3">
                                                <Icon name="fa-comment" className="text-slate-400 mt-1" />
                                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
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
                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Estadísticas</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-slate-500">Puntuación</span>
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

                                <div className={`rounded-xl p-4 border ${scoreBgColor}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon 
                                            name={isApproved ? "fa-trophy" : "fa-certificate"} 
                                            className={isApproved ? 'text-emerald-500' : 'text-[#004B63]'}
                                        />
                                        <h4 className={`font-semibold ${isApproved ? 'text-emerald-700' : 'text-[#004B63]'}`}>
                                            {isApproved ? 'Desempeño destacado' : 'Progreso registrado'}
                                        </h4>
                                    </div>
                                    <p className={`text-sm ${isApproved ? 'text-emerald-600' : 'text-slate-600'}`}>
                                        {isApproved 
                                            ? 'Has demostrado dominio en diseño de prompts'
                                            : 'Continúa practicando para mejorar tu puntuación'
                                        }
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center bg-slate-50 rounded-lg p-3">
                                        <div className="text-2xl font-bold text-slate-800">3</div>
                                        <div className="text-xs text-slate-500">Ejercicios</div>
                                    </div>
                                    <div className="text-center bg-slate-50 rounded-lg p-3">
                                        <div className="text-2xl font-bold text-slate-800">
                                            {isApproved ? 'Alto' : 'Medio'}
                                        </div>
                                        <div className="text-xs text-slate-500">Nivel</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Acciones</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={onClose}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Icon name="fa-check" />
                                    Cerrar y Volver al Módulo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IALabEvaluationResults;
