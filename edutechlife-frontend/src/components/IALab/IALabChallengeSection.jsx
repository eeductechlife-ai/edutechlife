import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabProgressContext, useIALabUIContext } from '../../context/IALabContext';
import { useIALabProgress } from '../../hooks/IALab/useIALabProgress';
import { useIALabStore } from '../../store/ialabStore';
import { useTranslation } from '../../i18n/I18nProvider';

const IALabChallengeSection = ({
    className = '',
    style = {},
    ...rest
}) => {
    const { t } = useTranslation();
    const { activeMod, modules } = useIALabProgressContext();
    const challengeScore = useIALabStore(s => s.challengeScore);
    const setChallengeScore = useIALabStore(s => s.setChallengeScore);
    const isChallengeCompleted = useIALabStore(s => s.isChallengeCompleted);
    const setIsChallengeCompleted = useIALabStore(s => s.setIsChallengeCompleted);
    const isStartingChallenge = useIALabStore(s => s.isStartingChallenge);
    const setIsStartingChallenge = useIALabStore(s => s.setIsStartingChallenge);
    const isButtonDisabled = useIALabStore(s => s.isButtonDisabled);
    const setIsButtonDisabled = useIALabStore(s => s.setIsButtonDisabled);
    const setShowPremiumEvaluationModal = useIALabStore(s => s.setShowPremiumEvaluationModal);
    const { user } = useIALabUIContext();

    const [showRetryConfirm, setShowRetryConfirm] = React.useState(false);
    const [notification, setNotification] = React.useState(null);

    React.useEffect(() => {
        if (notification) {
            const t = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(t);
        }
    }, [notification]);

    const { saveProgress, PROGRESS_STATUS, isLoadingProgress } = useIALabProgress();

    const isApproved = challengeScore >= 80;
    const scoreColor = isApproved ? 'text-emerald-600' : 'text-red-600';
    const scoreBgColor = isApproved ? 'bg-emerald-100' : 'bg-red-100';
    const scoreText = isApproved ? t('ialab.challenge.status_passed') : t('ialab.challenge.status_failed');

    const currentModule = modules.find(m => m.id === activeMod);
    const challengeText = currentModule?.challenge || t('ialab.challenge.default_text');
    const estimatedTime = "25 min";

    const handleStartChallenge = () => {
        setShowPremiumEvaluationModal(true);
    };

    const handleViewSolution = () => {
        setNotification({ type: 'info', message: t('ialab.challenge.notification_solution_unavailable') });
    };

    const handleReviewCompleted = () => {
        const approved = challengeScore >= 80;
        const statusText = approved ? t('ialab.challenge.status_passed') : `${t('ialab.challenge.status_failed')} (${t('ialab.challenge.minimum_80')})`;
        const message = `${t('ialab.challenge.summary_title')}\n\n` +
                       `${t('ialab.challenge.score_label')}: ${challengeScore}%\n` +
                       `${t('ialab.challenge.summary_status')}: ${statusText}\n` +
                       `${t('ialab.challenge.summary_module')}: ${currentModule?.title || t('ialab.challenge.title_pending')}\n` +
                       `${t('ialab.challenge.summary_date')}: ${new Date().toLocaleDateString()}\n\n` +
                       `${t('ialab.challenge.summary_projects_unavailable')}`;
        setNotification({ type: approved ? 'success' : 'error', message });
    };

    const handleRetryChallenge = async () => {
        setShowRetryConfirm(true);
    };

    const confirmRetryChallenge = async () => {
        setShowRetryConfirm(false);
        const store = useIALabStore.getState();
        if (!store.canAttemptChallengeRetry(activeMod)) {
            const nextAttemptTime = store.getNextAttemptTime(activeMod);
            const hoursLeft = nextAttemptTime ? Math.ceil((nextAttemptTime - Date.now()) / 3600000) : 12;
            setNotification({ type: 'warning', message: t('ialab.challenge.notification_retry_wait', { hours: hoursLeft }) });
            return;
        }
        store.decrementChallengeAttempt(activeMod);
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
            setNotification({ type: 'success', message: t('ialab.challenge.notification_advanced_started') });
        } catch (error) {
            console.error('Error al iniciar desafío avanzado:', error);
            setNotification({ type: 'error', message: t('ialab.challenge.notification_advanced_error') });
        }
    };

    const cancelRetryChallenge = () => {
        setShowRetryConfirm(false);
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
                    !isChallengeCompleted
                        ? 'bg-gradient-to-br from-petroleum to-petroleum-dark'
                        : isApproved
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-400'
                        : 'bg-gradient-to-br from-red-500 to-red-400'
                }`}>
                    <Icon
                        name={!isChallengeCompleted ? "fa-bolt" : isApproved ? "fa-trophy" : "fa-xmark"}
                        className="text-white text-xl"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg md:text-xl font-bold text-petroleum font-montserrat">
                            {!isChallengeCompleted ? t('ialab.challenge.title_pending') : isApproved ? t('ialab.challenge.title_passed') : t('ialab.challenge.title_failed')}
                        </h3>
                        {isChallengeCompleted && (
                            <span className={`px-3 py-0.5 text-xs font-semibold rounded-full ${scoreBgColor} ${scoreColor}`}>
                                {challengeScore}% - {scoreText}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-600">
                        {!isChallengeCompleted
                            ? t('ialab.challenge.desc_pending')
                            : isApproved
                            ? t('ialab.challenge.desc_passed', { score: challengeScore })
                            : t('ialab.challenge.desc_failed', { score: challengeScore })
                        }
                    </p>
                </div>
            </div>

            <div className={`rounded-xl p-5 mb-6 ${
                !isChallengeCompleted
                    ? 'bg-petroleum/5 border border-petroleum/10'
                    : isApproved
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-red-50 border border-red-200'
            }`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 bg-white rounded-full ${
                        !isChallengeCompleted ? 'border border-petroleum/10' : isApproved ? 'border border-emerald-200' : 'border border-red-200'
                    }`}>
                        <Icon name={!isChallengeCompleted ? "fa-hourglass-half" : isApproved ? "fa-check-circle" : "fa-xmark-circle"} className={`text-sm ${
                            !isChallengeCompleted ? 'text-petroleum' : isApproved ? 'text-emerald-500' : 'text-red-500'
                        }`} />
                        <span className={`text-xs font-semibold ${
                            !isChallengeCompleted ? 'text-petroleum' : isApproved ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                            {!isChallengeCompleted ? estimatedTime : isApproved ? t('ialab.challenge.status_completed') : t('ialab.challenge.status_failed')}
                        </span>
                    </div>
                    <span className={`text-xs ${
                        !isChallengeCompleted ? 'text-slate-500' : isApproved ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                        {!isChallengeCompleted ? t('ialab.challenge.status_pending') : isApproved ? t('ialab.challenge.status_passed') : t('ialab.challenge.status_not_passed')}
                    </span>
                </div>

                <div className="mb-3">
                    <h4 className="text-sm font-bold text-petroleum mb-2 font-montserrat">
                        {!isChallengeCompleted ? t('ialab.challenge.section_label_pending') : isApproved ? t('ialab.challenge.section_label_passed') : t('ialab.challenge.section_label_failed')}
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed border-l-2 border-petroleum pl-4 py-1">
                        &ldquo;{challengeText}&rdquo;
                    </p>
                </div>

                {isChallengeCompleted && challengeScore > 0 && (
                    <div className={`mt-4 pt-4 border-t ${isApproved ? 'border-emerald-200' : 'border-red-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-500">{t('ialab.challenge.score_label')}</span>
                            <span className={`text-xs font-semibold ${scoreColor}`}>{challengeScore}%</span>
                        </div>
                        <div className="h-1.5 bg-white rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                    isApproved
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                        : 'bg-gradient-to-r from-red-500 to-red-400'
                                }`}
                                style={{ width: `${challengeScore}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-xs text-slate-600">0%</span>
                            <span className="text-xs text-corporate font-medium">80%</span>
                            <span className="text-xs text-slate-600">100%</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                        <Icon name="fa-brain" className="text-petroleum text-sm" />
                        <span className="text-xs text-slate-500">{t('ialab.challenge.badge_practice')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Icon name="fa-chart-line" className="text-petroleum text-sm" />
                        <span className="text-xs text-slate-500">
                            {isChallengeCompleted ? t('ialab.challenge.badge_advanced') : t('ialab.challenge.badge_intermediate')}
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
                            className={`flex-1 px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 text-sm ${
                                isButtonDisabled ? 'opacity-70 cursor-not-allowed' : ''
                            } ${
                                isApproved
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                    : 'bg-gradient-to-r from-red-500 to-red-400 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                            }`}
                            onClick={handleReviewCompleted}
                            disabled={isButtonDisabled}
                        >
                            <Icon name={isApproved ? "fa-trophy" : "fa-chart-line"} className="text-sm" />
                            <span>{t('ialab.challenge.btn_view_result')}</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className={`flex-1 px-6 py-3 border-2 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 text-sm ${
                                isButtonDisabled ? 'opacity-70 cursor-not-allowed' : ''
                            } ${
                                isApproved
                                    ? 'border-petroleum/15 text-petroleum hover:bg-petroleum/5 hover:border-petroleum/30'
                                    : 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
                            }`}
                            onClick={handleRetryChallenge}
                            disabled={isButtonDisabled}
                        >
                            <Icon name="fa-rocket" className="text-sm" />
                            <span>{isApproved ? t('ialab.challenge.btn_advanced_version') : t('ialab.challenge.btn_retry')}</span>
                        </motion.button>
                    </>
                ) : (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className={`w-full px-6 py-3 bg-gradient-to-r from-petroleum via-corporate-deep to-[#06B6D4] text-white rounded-xl hover:bg-white hover:text-petroleum hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 font-semibold flex items-center justify-center gap-2 text-sm ${
                                isStartingChallenge || isButtonDisabled ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                            onClick={handleStartChallenge}
                            disabled={isStartingChallenge || isButtonDisabled}
                        >
                            {isStartingChallenge ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>{t('ialab.challenge.btn_preparing')}</span>
                                </>
                            ) : (
                                <>
                                    <Icon name="fa-play-circle" className="text-sm text-white hover:text-petroleum" />
                                    <span className="text-sm text-white hover:text-petroleum">{t('ialab.challenge.btn_start')}</span>
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
                            <div className="w-1.5 h-1.5 bg-petroleum rounded-full"></div>
                            <span className="text-xs text-slate-500">{isChallengeCompleted ? t('ialab.challenge.difficulty_mastered') : t('ialab.challenge.difficulty_medium_high')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-petroleum rounded-full"></div>
                            <span className="text-xs text-slate-500">{t('ialab.challenge.impact_high')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 8px 25px rgba(17,17,26,0.1)" }}
            transition={{ duration: 0.2 }}
            className={`relative z-10 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 md:p-8 overflow-hidden ${className}`}
            style={style}
            {...rest}
        >
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-petroleum/6 to-corporate/4 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-petroleum/4 to-corporate/4 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-t-2xl" />

            {/* Retry confirmation modal */}
            {showRetryConfirm && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
                    <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm shadow-xl border border-slate-200 text-center" role="dialog" aria-modal="true" aria-label={t('ialab.challenge.confirm_title')}>
                        <p className="text-sm text-slate-700 mb-6 leading-relaxed">
                            {t('ialab.challenge.confirm_text')}<br />
                            <span className="text-xs text-slate-500">{t('ialab.challenge.confirm_hint')}</span>
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={cancelRetryChallenge}
                                className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                            >
                                {t('ialab.challenge.confirm_cancel')}
                            </button>
                            <button
                                onClick={confirmRetryChallenge}
                                className="px-5 py-2.5 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl text-sm font-semibold hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate"
                            >
                                {t('ialab.challenge.confirm_accept')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification toast */}
            {notification && (
                <div
                    className={`absolute top-4 right-4 z-20 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-fade-in max-w-[280px] break-words ${
                        notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        notification.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                        notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                        'bg-blue-50 border-blue-200 text-blue-700'
                    }`}
                    role="alert"
                    aria-live="polite"
                >
                    {notification.message}
                </div>
            )}

            {isLoadingProgress ? renderSkeleton() : renderContent()}
        </motion.div>
    );
};

export default IALabChallengeSection;
