import { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIALabStore } from '../../store/ialabStore';
import { Icon } from '../../utils/iconMapping.jsx';
import usePersonalizedRecommendations from '../../hooks/IALab/usePersonalizedRecommendations';
import { useTranslation } from '../../i18n/I18nProvider';
import { DAILY_CHALLENGES, CHALLENGES_STORAGE_KEY } from './constants/dailyChallenges';

const getTodayKey = () => new Date().toISOString().split('T')[0];

const loadCompletion = () => {
  try {
    const raw = localStorage.getItem(CHALLENGES_STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (data.date === getTodayKey()) return data.completed || {};
  } catch {}
  return {};
};

const URGENCY_STYLE = {
  high: { border: 'border-petroleum/30', hover: 'hover:border-petroleum', icon: 'bg-petroleum/10 text-petroleum', badge: 'bg-petroleum/10 text-petroleum' },
  medium: { border: 'border-corporate/30', hover: 'hover:border-corporate', icon: 'bg-corporate/10 text-corporate', badge: 'bg-corporate/10 text-corporate' },
  low: { border: 'border-slate-200', hover: 'hover:border-slate-400', icon: 'bg-slate-100 text-slate-500', badge: 'bg-slate-100 text-slate-500' },
};

function selectTopItems(activeChallenges, recsHigh, recsMedium) {
  const items = [];
  const sortedDCs = [...activeChallenges].sort((a, b) => a.id === 'dc-1' ? -1 : b.id === 'dc-1' ? 1 : 0);
  if (sortedDCs.length > 0) items.push({ ...sortedDCs[0], type: 'challenge' });
  if (items.length < 3 && recsHigh.length > 0) items.push({ ...recsHigh[0], type: 'recommendation' });
  if (items.length < 3 && recsHigh.length > 1) items.push({ ...recsHigh[1], type: 'recommendation' });
  else if (items.length < 3 && recsMedium.length > 0) items.push({ ...recsMedium[0], type: 'recommendation' });
  return items;
}

const DailyPlan = ({ onAction, isLoading }) => {
  const { t } = useTranslation();
  const setActiveModAction = useIALabStore(s => s.setActiveMod);
  const setVisitedModules = useIALabStore(s => s.setVisitedModules);
  const addXp = useIALabStore(s => s.addXp);
  const courseProgress = useIALabStore(s => s.courseProgress);
  const personalizedRecs = usePersonalizedRecommendations();

  const [completed, setCompleted] = useState(loadCompletion);
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => setIsOpen(v => !v), []);

  const completeChallenge = useCallback((id, xpReward) => {
    if (completed[id]) return;
    const next = { ...completed, [id]: true };
    setCompleted(next);
    addXp(xpReward);
    try {
      localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify({ date: getTodayKey(), completed: next }));
    } catch {}
  }, [completed, addXp]);

  const handleAction = useCallback((rec) => {
    if (rec.type === 'exams' || rec.type === 'exam') {
      onAction?.('OPEN_EVALUATION');
    } else if (rec.type === 'challenges' || rec.type === 'challenge') {
      onAction?.('OPEN_CHALLENGE');
    } else if (rec.action?.moduleId) {
      setActiveModAction(rec.action.moduleId);
      setVisitedModules(prev => [...new Set([...prev, rec.action.moduleId])]);
      window.dispatchEvent(new CustomEvent('ialab:switchTab', { detail: 'contenido' }));
    }
  }, [onAction, setActiveModAction, setVisitedModules]);

  const topItems = useMemo(() => {
    const activeChallenges = DAILY_CHALLENGES.filter(c => !completed[c.id]);
    return selectTopItems(activeChallenges, personalizedRecs.high, personalizedRecs.medium);
  }, [completed, personalizedRecs]);

  const completedCount = useMemo(() => DAILY_CHALLENGES.filter(c => completed[c.id]).length, [completed]);
  const pendingCount = topItems.filter(i => i.type === 'challenge').length + personalizedRecs.high.length;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div data-testid="daily-plan" className="flex flex-col gap-2">
      <button
        onClick={toggleOpen}
        className="relative w-full overflow-hidden bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate text-white font-bold py-3 px-5 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center gap-3 group"
        aria-expanded={isOpen}
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
          <Icon name="fa-lightbulb" className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white flex-1 text-left drop-shadow-sm">
          {t('ialab.daily_plan.title')}
        </span>
        <span className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-semibold">
              {pendingCount}
            </span>
          )}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <Icon name="fa-chevron-down" className="w-3 h-3 text-white/70" />
          </motion.div>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {topItems.length === 0 ? (
              <div className="flex flex-col items-center py-8 px-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-3 shadow-inner">
                  <Icon name="fa-check-circle" className="text-emerald-500 text-2xl" />
                </div>
                <p className="text-sm font-bold text-slate-700">{t('ialab.daily_plan.empty_title')}</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">{t('ialab.daily_plan.empty_desc')}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t('ialab.daily_plan.next_action')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(courseProgress || 0, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {Math.round(courseProgress || 0)}%
                    </span>
                  </div>
                </div>

                {topItems.map((item, i) => {
                  if (item.type === 'challenge') {
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.2 }}
                        className="group relative bg-white rounded-2xl border border-slate-200/60 hover:border-petroleum/30 hover:shadow-md transition-all duration-200 overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-petroleum to-corporate" />
                        <div className="p-4 pl-5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                              <Icon name={item.icon} className="text-white text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-sm font-bold text-slate-800">{t(item.titleKey)}</h4>
                                <button
                                  onClick={() => completeChallenge(item.id, item.xpReward)}
                                  className="flex-shrink-0 text-[11px] font-semibold text-white bg-gradient-to-r from-petroleum to-corporate px-3 py-1.5 rounded-lg hover:shadow-md active:scale-95 transition-all"
                                >
                                  <Icon name="fa-check" className="text-[9px] mr-1" />{t('ialab.daily_plan.complete')}
                                </button>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t(item.descriptionKey)}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                                  <Icon name="fa-star" className="text-[10px] text-amber-500" />
                                  +{item.xpReward} XP
                                </span>
                                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {item.id === 'dc-1' ? t('ialab.daily_plan.morning_streak') : t('ialab.daily_plan.challenge_badge')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  const urgency = item.urgency || 'low';
                  const style = URGENCY_STYLE[urgency];

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                      className="group relative bg-white rounded-2xl border border-slate-200/60 hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${urgency === 'high' ? 'from-petroleum to-corporate' : urgency === 'medium' ? 'from-corporate to-corporate/60' : 'from-slate-300 to-slate-200'}`} />
                      <div className="p-4 pl-5">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${style.icon}`}>
                            <Icon name={item.icon} className="text-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-bold text-slate-800 leading-snug">{item.title}</h4>
                              {item.action && (
                                <button
                                  onClick={() => handleAction(item.rec || item)}
                                  className="flex-shrink-0 text-[11px] font-semibold text-white bg-gradient-to-r from-petroleum to-corporate px-3 py-1.5 rounded-lg hover:shadow-md active:scale-95 transition-all whitespace-nowrap"
                                >
                                  {item.action.label} <Icon name="fa-arrow-right" className="text-[9px] ml-1" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description || item.text}</p>
                            <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-md ${style.badge}`}>
                              {urgency === 'high' ? t('ialab.recommendations.urgency_high') : urgency === 'medium' ? t('ialab.recommendations.urgency_medium') : t('ialab.recommendations.urgency_low')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(DailyPlan);
