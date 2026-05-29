import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabStore } from '../../store/ialabStore';
import { useTranslation } from '../../i18n/I18nProvider';

const PASSING_SCORE = 80;
const TOTAL_QUESTIONS = 8;
const MAX_ATTEMPTS = 3;
const COOLDOWN_MS = 12 * 60 * 60 * 1000;

const readStore = (key, fallback = null) => {
  try {
    const st = useIALabStore.getState();
    return st.ls?.get(key, fallback) ?? fallback;
  } catch { return fallback; }
};

const ExamResultViewer = ({ moduleId, score, onClose, onRetry }) => {
  const { t } = useTranslation();
  const userRole = useIALabStore(s => s.userRole);
  const isAdmin = userRole === 'admin';
  const passed = score >= PASSING_SCORE;

  let storedAttempt = null;
  try {
    const attempts = useIALabStore.getState().storageGet(`quizAttempts_${moduleId}`, []);
    storedAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;
  } catch {}

  const correctCount = storedAttempt?.correctCount ?? Math.round((score / 100) * TOTAL_QUESTIONS);
  const incorrectCount = TOTAL_QUESTIONS - correctCount;
  const failedTopics = storedAttempt?.failedQuestions || [];

  // Lógica de intentos
  const remaining = (() => {
    if (isAdmin) return 99;
    try { return parseInt(localStorage.getItem(`exam_attempts_remaining_m${moduleId}`) || MAX_ATTEMPTS); }
    catch { return MAX_ATTEMPTS; }
  })();
  const nextAttempt = (() => {
    if (isAdmin) return 0;
    try { return parseInt(localStorage.getItem(`exam_next_attempt_m${moduleId}`) || '0'); }
    catch { return 0; }
  })();
  const inCooldown = nextAttempt > 0 && Date.now() < nextAttempt;
  const hoursLeft = Math.ceil((nextAttempt - Date.now()) / 3600000);

  const handleRetry = () => {
    if (remaining <= 0) return;
    if (inCooldown) return;
    if (!isAdmin) {
      const newRemaining = remaining - 1;
      localStorage.setItem(`exam_attempts_remaining_m${moduleId}`, newRemaining);
      localStorage.setItem(`exam_next_attempt_m${moduleId}`, Date.now() + COOLDOWN_MS);
      window.dispatchEvent(new Event('ialab:attemptsUpdated'));
    }
    if (onRetry) onRetry();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-8">
          {/* Score Circle */}
          <div className="text-center mb-6">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className="relative">
                <Icon 
                  name={passed ? 'fa-trophy' : 'fa-exclamation-circle'} 
                  className={`text-4xl ${passed ? 'text-emerald-500' : 'text-red-500'}`} 
                />
                <div className={`absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${passed ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  {score}%
                </div>
              </div>
            </div>
            <h2 className={`text-xl font-bold mb-1 font-montserrat ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
              {passed ? t('ialab.exam_result.title_passed') : t('ialab.exam_result.title_failed')}
            </h2>
            <p className="text-sm text-slate-500">
              {passed
                ? t('ialab.exam_result.desc_passed')
                : t('ialab.exam_result.desc_failed', { score: PASSING_SCORE })}
            </p>
          </div>

          {/* Stats */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
            <div className="flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-slate-800">{correctCount}</div>
                <div className="text-xs text-slate-500">{t('ialab.exam_result.correct')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{incorrectCount}</div>
                <div className="text-xs text-slate-500">{t('ialab.exam_result.incorrect')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{TOTAL_QUESTIONS}</div>
                <div className="text-xs text-slate-500">{t('ialab.exam_result.total')}</div>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-3">
              <div className={`h-full rounded-full transition-all duration-700 ${passed ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                style={{ width: `${score}%` }} />
            </div>
          </div>

          {/* Feedback de mejora */}
          {!passed && failedTopics.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
              <h4 className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1.5">
                <Icon name="fa-lightbulb" className="text-sm" />
                {t('ialab.exam_result.improvement_areas')}
              </h4>
              <p className="text-xs text-red-600 leading-relaxed">
                {t('ialab.exam_result.improvement_desc')}
              </p>
            </div>
          )}

          {/* Intentos / Retry */}
          {!passed && (
            <div className="mb-4">
              {remaining > 0 && !inCooldown && (
                <>
                  <button onClick={handleRetry}
                    className="w-full py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-lg transition-all duration-200 font-bold text-sm mb-2 flex items-center justify-center gap-2">
                    <Icon name="fa-rocket" />
                    {t('ialab.exam_result.retry')}
                  </button>
                  <p className="text-xs text-center text-slate-600">
                    {t('ialab.exam_result.retry_info', { remaining: remaining - 1, max: MAX_ATTEMPTS })}
                  </p>
                </>
              )}
              {remaining > 0 && inCooldown && (
                <p className="text-xs text-center text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  {t('ialab.exam_result.cooldown', { hours: hoursLeft, max: MAX_ATTEMPTS })}
                </p>
              )}
              {remaining <= 0 && (
                <p className="text-xs text-center text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {t('ialab.exam_result.no_attempts', { max: MAX_ATTEMPTS })}
                </p>
              )}
            </div>
          )}

          {/* Close button */}
          <button onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-lg transition-all duration-200 font-bold text-sm">
            {t('ialab.exam_result.back_to_module')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResultViewer;
