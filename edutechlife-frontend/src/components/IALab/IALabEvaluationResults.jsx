import React, { useState, useEffect } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabProgressContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import { useActivityTracker } from '../../hooks/useActivityTracker';
import { useTranslation } from '../../i18n/I18nProvider';

const IALabEvaluationResults = ({ evaluation, onClose, activityType = 'challenge', onRetry }) => {
    const { t } = useTranslation();
    const { activeMod } = useIALabProgressContext();
    const { trackActivity } = useActivityTracker();
    const [gradeSaved, setGradeSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [remainingAttempts, setRemainingAttempts] = useState(3);

    useEffect(() => {
        if (activityType !== 'challenge') return;
        const state = useIALabStore.getState();
        const current = state.getChallengeRemainingAttempts(activeMod);
        setRemainingAttempts(current);
    }, [activityType, activeMod]);

    const handleRetry = () => {
        if (activityType !== 'challenge') return;
        const state = useIALabStore.getState();
        if (!state.canAttemptChallengeRetry(activeMod)) {
            const nextTime = state.getNextAttemptTime(activeMod);
            if (nextTime && Date.now() < nextTime) {
                const hoursLeft = Math.ceil((nextTime - Date.now()) / 3600000);
                alert(t('ialab.challenge.notification_retry_wait', { hours: hoursLeft }));
            }
            return;
        }
        const newVal = state.decrementChallengeAttempt(activeMod);
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
                    title: `${activityType === 'exam' ? t('ialab.module_actions.exam') : t('ialab.challenge.title_pending')} ${t('ialab.module_header.module')} ${activeMod}`,
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
                <h3 className="text-xl font-bold text-slate-800 mb-2">{t('ialab.evaluation.results.no_results_title')}</h3>
                <p className="text-slate-500 text-center max-w-md mb-6">
                    {t('ialab.evaluation.results.no_results_desc')}
                </p>
                <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
                >
                    <Icon name="fa-arrow-left" className="mr-2" />
                    {t('ialab.evaluation.results.back_to_start')}
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
                                    {t('ialab.evaluation.results.result_title', { module: activeMod })}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400">
                                    {t('ialab.evaluation.results.result_subtitle')}
                                </p>
                            </div>
                        </div>

                        <div className={`px-4 py-2 rounded-lg flex items-center gap-2 border ${gradeSaved ? 'bg-emerald-50 border-emerald-200' : 'bg-petroleum/5 border-petroleum/10'}`}>
                            {gradeSaved ? (
                                <>
                                    <Icon name="fa-check-circle" className="text-emerald-500" />
                                    <span className="text-sm text-emerald-600 font-medium">
                                        {t('ialab.evaluation.results.grade_registered')}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 border-2 border-petroleum border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm text-petroleum font-medium">
                                        {t('ialab.evaluation.results.registering_grade')}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-petroleum/10 to-corporate/10 rounded-xl p-5 border border-corporate/20 dark:from-petroleum/20 dark:to-corporate/20 dark:border-corporate/40">
                        <div className="flex items-center gap-3">
                            <Icon name="fa-chart-line" className="text-petroleum text-xl" />
                            <div>
                                <h3 className="text-lg font-bold text-petroleum mb-1">
                                    {t('ialab.evaluation.results.score_weight_info', { module: activeMod })}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm">
                                    {t('ialab.evaluation.results.score_weight_desc')}
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
                                                ? 'bg-white text-petroleum border-b-2 border-corporate dark:bg-slate-800 dark:text-petroleum'
                                                : 'text-slate-600 hover:text-petroleum hover:bg-slate-50 dark:text-slate-400 dark:hover:text-petroleum dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Icon 
                                            name={tab === 'overview' ? 'fa-chart-bar' : 'fa-comment-dots'} 
                                            className="mr-2" 
                                        />
                                        {tab === 'overview' ? t('ialab.evaluation.results.tab_overview') : t('ialab.evaluation.results.tab_feedback')}
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
                                                    {t('ialab.evaluation.results.final_grade')}
                                                </text>
                                            </svg>
                                        </div>

                                        <div className="flex-1 w-full">
                                            <h3 className="text-xl font-bold text-slate-800 mb-4">{t('ialab.evaluation.results.performance_analysis')}</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-slate-500">{t('ialab.evaluation.results.status_label')}</span>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                        }`}>
                                                            <Icon name={isApproved ? "fa-check-circle" : "fa-xmark-circle"} className="mr-1" />
                                                            {isApproved ? t('ialab.evaluation.results.status_approved') : t('ialab.evaluation.results.status_in_progress')}
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
                                                            {isApproved ? t('ialab.evaluation.results.mastery_high') : t('ialab.evaluation.results.mastery_medium')}
                                                        </div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">{t('ialab.evaluation.results.mastery_level')}</div>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                                                            3/3
                                                        </div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">{t('ialab.evaluation.results.exercises_completed')}</div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-slate-100">
                                                    <h4 className="text-sm font-semibold text-slate-600 mb-3">{t('ialab.evaluation.results.exercise_breakdown')}</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-slate-500">{t('ialab.evaluation.results.exercise_1')}</span>
                                                            <span className={`font-semibold ${
                                                                (evaluation.nota_ej1 || 0) >= 80 ? 'text-emerald-600' :
                                                                (evaluation.nota_ej1 || 0) >= 60 ? 'text-amber-600' : 'text-red-600'
                                                            }`}>{evaluation.nota_ej1 || 0}%</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-slate-500">{t('ialab.evaluation.results.exercise_2')}</span>
                                                            <span className={`font-semibold ${
                                                                (evaluation.nota_ej2 || 0) >= 80 ? 'text-emerald-600' :
                                                                (evaluation.nota_ej2 || 0) >= 60 ? 'text-amber-600' : 'text-red-600'
                                                            }`}>{evaluation.nota_ej2 || 0}%</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-slate-500">{t('ialab.evaluation.results.exercise_3')}</span>
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
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('ialab.evaluation.results.personalized_recommendations')}</h3>
                                    <div className="space-y-4">
                                        {isApproved ? (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Icon name="fa-star" className="text-emerald-500" />
                                                    <h4 className="font-semibold text-slate-800">{t('ialab.evaluation.results.congrats_approved')}</h4>
                                                </div>
                                                <p className="text-slate-600">
                                                    {evaluation.notaGlobal >= 90 
                                                        ? t('ialab.evaluation.results.feedback_exceptional')
                                                        : evaluation.notaGlobal >= 85
                                                        ? t('ialab.evaluation.results.feedback_good')
                                                        : t('ialab.evaluation.results.feedback_passing')
                                                    }
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Icon name="fa-lightbulb" className="text-red-600" />
                                                    <h4 className="font-semibold text-slate-800">{t('ialab.evaluation.results.encouragement')}</h4>
                                                </div>
                                                <p className="text-slate-600 mb-3">
                                                    {t('ialab.evaluation.results.need_80')}
                                                </p>
                                                <div className="space-y-2">
                                                    {(evaluation.nota_ej1 || 0) < 80 && (
                                                        <div className="flex items-start gap-2 text-sm text-slate-600">
                                                            <Icon name="fa-search" className="text-corporate mt-0.5" />
                                                            <span dangerouslySetInnerHTML={{ __html: t('ialab.evaluation.results.retry_exercise1_hint') }} />
                                                        </div>
                                                    )}
                                                    {(evaluation.nota_ej2 || 0) < 80 && (
                                                        <div className="flex items-start gap-2 text-sm text-slate-600">
                                                            <Icon name="fa-magic" className="text-emerald-500 mt-0.5" />
                                                            <span dangerouslySetInnerHTML={{ __html: t('ialab.evaluation.results.retry_exercise2_hint') }} />
                                                        </div>
                                                    )}
                                                    {(evaluation.nota_ej3 || 0) < 80 && (
                                                        <div className="flex items-start gap-2 text-sm text-slate-600">
                                                            <Icon name="fa-plus-circle" className="text-petroleum mt-0.5" />
                                                            <span dangerouslySetInnerHTML={{ __html: t('ialab.evaluation.results.retry_exercise3_hint') }} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Icon name="fa-book" className="text-corporate" />
                                                    <h4 className="font-medium text-slate-800 dark:text-slate-100">{t('ialab.evaluation.results.next_steps')}</h4>
                                                </div>
                                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                                    <li className="flex items-start gap-2">
                                                        <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                                                        <span>{t('ialab.evaluation.results.next_step_1')}</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                                                        <span>{t('ialab.evaluation.results.next_step_2')}</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                                                        <span>{t('ialab.evaluation.results.next_step_3')}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Icon name="fa-calendar" className="text-petroleum" />
                                                    <h4 className="font-medium text-slate-800 dark:text-slate-100">{t('ialab.evaluation.results.next_evaluation')}</h4>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-2">
                                                    {t('ialab.evaluation.results.next_attempt_label')}
                                                </p>
                                                <div className="px-3 py-2 bg-petroleum/10 border border-petroleum/20 rounded-lg">
                                                    <div className="text-petroleum font-medium">{t('ialab.evaluation.results.cooldown_24h')}</div>
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
                                        title: t('ialab.evaluation.results.exercise_1'),
                                        feedback: evaluation.feedback_ej1,
                                        nota: evaluation.nota_ej1,
                                        icon: 'fa-search',
                                        color: 'text-corporate',
                                        bgColor: 'bg-corporate/10'
                                    },
                                    { 
                                        title: t('ialab.evaluation.results.exercise_2'),
                                        feedback: evaluation.feedback_ej2,
                                        nota: evaluation.nota_ej2,
                                        icon: 'fa-magic',
                                        color: 'text-emerald-500',
                                        bgColor: 'bg-emerald-500/10'
                                    },
                                    { 
                                        title: t('ialab.evaluation.results.exercise_3'),
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
                                                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('ialab.evaluation.results.detailed_analysis')}</p>
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
                                                <Icon name="fa-comment" className="text-slate-600 mt-1" />
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
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{t('ialab.evaluation.results.stats_title')}</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-slate-500">{t('ialab.evaluation.results.global_score')}</span>
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
                                    <h4 className="text-sm font-semibold text-slate-600 mb-3">{t('ialab.evaluation.results.exercise_scores')}</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-slate-500">{t('ialab.evaluation.results.exercise_1')}</span>
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
                                                <span className="text-sm text-slate-500">{t('ialab.evaluation.results.exercise_2')}</span>
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
                                                <span className="text-sm text-slate-500">{t('ialab.evaluation.results.exercise_3')}</span>
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
                                            {isApproved ? t('ialab.evaluation.results.challenge_passed') : t('ialab.evaluation.results.challenge_failed')}
                                        </h4>
                                    </div>
                                    <p className={`text-sm ${isApproved ? 'text-emerald-600' : 'text-slate-600'}`}>
                                        {isApproved 
                                            ? t('ialab.evaluation.results.mastery_message')
                                            : t('ialab.evaluation.results.need_80_retry')
                                        }
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center bg-slate-50 rounded-lg p-3">
                                        <div className="text-2xl font-bold text-slate-800">{remainingAttempts}</div>
                                        <div className="text-xs text-slate-500">{t('ialab.evaluation.results.remaining_attempts')}</div>
                                    </div>
                                    {isApproved && (
                                        <div className="text-center bg-slate-50 rounded-lg p-3">
                                            <div className="text-2xl font-bold text-slate-800">80%+</div>
                                            <div className="text-xs text-slate-500">{t('ialab.evaluation.results.passed_status')}</div>
                                        </div>
                                    )}
                                </div>
                                {!isApproved && remainingAttempts > 0 && (
                                    <button onClick={handleRetry} className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white font-bold text-sm hover:shadow-lg hover:shadow-petroleum/20 transition-all duration-300 flex items-center justify-center gap-2">
                                        <Icon name="fa-rocket" className="text-base" />
                                        {t('ialab.evaluation.results.retry_challenge')}
                                    </button>
                                )}
                                {!isApproved && remainingAttempts <= 0 && (
                                    <p className="text-xs text-center text-slate-600 mt-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">{t('ialab.evaluation.results.no_attempts_left')}</p>
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
