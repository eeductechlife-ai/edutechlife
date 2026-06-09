import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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

const URGENCY_CONFIG = {
  high: {
    labelKey: 'ialab.recommendations.urgency_high', icon: 'fa-flag',
    textColor: 'text-petroleum', bgColor: 'bg-petroleum/10', iconColor: 'text-petroleum',
    gradientFrom: 'from-petroleum/5', gradientTo: 'to-petroleum/[0.02]',
    borderClass: 'border-petroleum/20', hoverBorder: 'hover:border-petroleum/40',
    btnBg: 'bg-petroleum/10', btnBorder: 'border-petroleum/20', btnText: 'text-petroleum',
    btnHover: 'hover:bg-petroleum/20',
  },
  medium: {
    labelKey: 'ialab.recommendations.urgency_medium', icon: 'fa-list',
    textColor: 'text-corporate', bgColor: 'bg-corporate/10', iconColor: 'text-corporate',
    gradientFrom: 'from-corporate/5', gradientTo: 'to-corporate/[0.02]',
    borderClass: 'border-corporate/20', hoverBorder: 'hover:border-corporate/40',
    btnBg: 'bg-corporate/10', btnBorder: 'border-corporate/20', btnText: 'text-corporate',
    btnHover: 'hover:bg-corporate/20',
  },
  low: {
    labelKey: 'ialab.recommendations.urgency_low', icon: 'fa-lightbulb',
    textColor: 'text-slate-600', bgColor: 'bg-slate-100', iconColor: 'text-slate-500',
    gradientFrom: 'from-slate-50', gradientTo: 'to-slate-100',
    borderClass: 'border-slate-200/60', hoverBorder: 'hover:border-slate-300/60',
    btnBg: 'bg-slate-100', btnBorder: 'border-slate-200', btnText: 'text-slate-600',
    btnHover: 'hover:bg-slate-200',
  },
};

const MAX_ITEMS = 6;

const DailyPlan = ({ onAction, isLoading }) => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const setActiveModAction = useIALabStore(s => s.setActiveMod);
  const setVisitedModules = useIALabStore(s => s.setVisitedModules);
  const addXp = useIALabStore(s => s.addXp);
  const moduleProgress = useIALabStore(s => s.moduleProgress);
  const courseProgress = useIALabStore(s => s.courseProgress);
  const personalizedRecs = usePersonalizedRecommendations();

  const nextAction = useMemo(() => useIALabStore.getState().getNextSuggestedAction(), [moduleProgress, courseProgress]);

  const [completed, setCompleted] = useState(loadCompletion);
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => setIsOpen(v => !v), []);

  const completeChallenge = useCallback((id, xpReward) => {
    if (completed[id]) return;
    const next = { ...completed, [id]: true };
    setCompleted(next);
    addXp(xpReward);
    try {
      localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify({
        date: getTodayKey(),
        completed: next,
      }));
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

  const mergedItems = useMemo(() => {
    const items = [];

    const activeChallenges = DAILY_CHALLENGES.filter(c => !completed[c.id]);
    const sortedChallenges = [...activeChallenges].sort((a, b) => {
      if (a.id === 'dc-1') return -1;
      if (b.id === 'dc-1') return 1;
      return 0;
    });
    sortedChallenges.forEach(c => {
      if (items.length >= MAX_ITEMS) return;
      items.push({
        id: c.id,
        type: 'challenge',
        priority: 1,
        icon: c.icon,
        title: c.title,
        description: c.description,
        xpReward: c.xp,
        completed: false,
        isMorningStreak: c.id === 'dc-1',
      });
    });

    const addRecs = (recs, priority) => {
      recs.forEach(r => {
        if (items.length >= MAX_ITEMS) return;
        items.push({
          id: r.id,
          type: 'recommendation',
          priority,
          icon: r.icon,
          title: r.title,
          description: r.text,
          urgency: r.urgency,
          action: r.action,
          rec: r,
        });
      });
    };

    addRecs(personalizedRecs.high, 2);
    addRecs(personalizedRecs.medium, 3);
    addRecs(personalizedRecs.low, 4);

    return items.slice(0, MAX_ITEMS);
  }, [completed, personalizedRecs]);

  const completedCount = useMemo(() => {
    return DAILY_CHALLENGES.filter(c => completed[c.id]).length;
  }, [completed]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 bg-slate-200 rounded w-28 animate-pulse" />
        </div>
        <div className="flex flex-col gap-1.5">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-slate-100 animate-pulse">
              <div className="w-6 h-6 rounded-lg bg-slate-200 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-2.5 bg-slate-200 rounded w-3/4" />
                <div className="h-2 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isEmpty = mergedItems.length === 0;
  const pendingCount = mergedItems.filter(i => i.type === 'challenge' && !i.completed).length
    + personalizedRecs.high.length;

  if (isEmpty) {
    return (
      <div className="flex flex-col gap-1">
        <button
          onClick={toggleOpen}
          className="relative w-full overflow-hidden bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate text-white font-bold py-3 px-5 rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 flex items-center gap-3 group"
          aria-expanded={isOpen}
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300" />
          <div className="w-7 h-7 rounded-full bg-white/20 group-hover:bg-emerald-500/20 backdrop-blur flex items-center justify-center flex-shrink-0">
            <Icon name="fa-check-circle" className="w-3.5 h-3.5 text-emerald-300 group-hover:text-petroleum" />
          </div>
          <span className="text-sm font-bold text-white group-hover:text-corporate flex-1 text-left drop-shadow-sm">
            {t('ialab.daily_plan.title')}
          </span>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <div className="flex flex-col items-center py-8 px-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-3 shadow-inner">
                  <Icon name="fa-check-circle" className="text-emerald-500 text-2xl" />
                </div>
                <p className="text-sm font-bold text-slate-700">{t('ialab.daily_plan.empty_title')}</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">{t('ialab.daily_plan.empty_desc')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={toggleOpen}
        className="relative w-full overflow-hidden bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate text-white font-bold py-3 px-5 rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 flex items-center gap-3 group"
        aria-expanded={isOpen}
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300" />
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="w-7 h-7 rounded-full bg-white/20 group-hover:bg-corporate/20 backdrop-blur flex items-center justify-center flex-shrink-0"
        >
          <Icon name="fa-lightbulb" className="w-3.5 h-3.5 text-white group-hover:text-petroleum" />
        </motion.div>
        <span className="text-sm font-bold text-white group-hover:text-corporate flex-1 text-left drop-shadow-sm">
          {t('ialab.daily_plan.title')}
        </span>
        <span className="relative flex items-center gap-1.5">
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-white/20 group-hover:bg-corporate/20 text-white group-hover:text-corporate text-[10px] font-semibold">
              {pendingCount}
            </span>
          )}
          {completedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-emerald-200 text-[10px] font-semibold">
              {completedCount}/{DAILY_CHALLENGES.length}
            </span>
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {nextAction && nextAction.action !== 'start' && nextAction.action !== 'explore' && (
              <div className="mb-2 p-2.5 rounded-xl bg-gradient-to-r from-petroleum/5 to-corporate/5 border border-petroleum/15">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon name={nextAction.action === 'exam' ? 'fa-file-text' : nextAction.action === 'challenge' ? 'fa-trophy' : nextAction.action === 'community' ? 'fa-comments' : nextAction.action === 'certificate' ? 'fa-certificate' : 'fa-play-circle'} className="text-xs text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700">{t('ialab.daily_plan.next_action')}</p>
                    <p className="text-[11px] text-slate-500 truncate">{nextAction.label}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (nextAction.action === 'exam') {
                        onAction?.('OPEN_EVALUATION');
                      } else if (nextAction.action === 'challenge') {
                        onAction?.('OPEN_CHALLENGE');
                      } else if (nextAction.action === 'certificate') {
                        onAction?.('SHOW_CERTIFICATE');
                      } else {
                        if (nextAction.moduleId) {
                          setActiveModAction(nextAction.moduleId);
                          setVisitedModules(prev => [...new Set([...prev, nextAction.moduleId])]);
                        }
                        const tab = nextAction.action === 'community' ? 'comunidad' : 'contenido';
                        window.dispatchEvent(new CustomEvent('ialab:switchTab', { detail: tab }));
                      }
                    }}
                    className="flex-shrink-0 text-[10px] font-semibold text-white bg-gradient-to-r from-petroleum to-corporate px-3 py-1.5 rounded-lg hover:shadow-md transition-all active:scale-95"
                  >
                    {t('ialab.daily_plan.continue')}
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1.5 pt-2">
              {mergedItems.map((item, i) => {
                if (item.type === 'challenge') {
                  const isMorning = item.isMorningStreak;
                  return (
                    <motion.div
                      key={item.id}
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      className={`group relative pl-3 border-l-2 transition-all duration-200 py-1.5 ${
                        isMorning
                          ? 'border-amber-400/40 hover:border-amber-500 bg-gradient-to-r from-amber-50/40 to-transparent'
                          : 'border-corporate/30 hover:border-corporate'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isMorning ? 'bg-gradient-to-br from-amber-400 to-amber-500' : 'bg-corporate/10'
                        }`}>
                          <Icon name={item.icon} className={`text-sm ${isMorning ? 'text-white' : 'text-corporate'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <p className={`text-xs font-semibold ${isMorning ? 'text-amber-800' : 'text-slate-800'}`}>{item.title}</p>
                            <button
                              onClick={() => completeChallenge(item.id, item.xpReward)}
                              className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-md border transition-colors active:scale-95 ${
                                isMorning
                                  ? 'text-amber-700 bg-amber-100 border-amber-300 hover:bg-amber-200'
                                  : 'text-corporate bg-corporate/10 border-corporate/20 hover:bg-corporate/20'
                              }`}
                            >
                              <Icon name="fa-check" className="text-[8px] mr-0.5" />Completar
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Icon name="fa-star" className={`text-[9px] ${isMorning ? 'text-amber-500' : 'text-corporate'}`} />
                              <span className={`text-[10px] font-semibold ${isMorning ? 'text-amber-600' : 'text-corporate'}`}>+{item.xpReward} XP</span>
                            </span>
                            {isMorning && (
                              <span className="text-[9px] font-medium text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                                Mañanero
                              </span>
                            )}
                            {!isMorning && (
                              <span className="text-[9px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                Desafío
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                const cfg = URGENCY_CONFIG[item.urgency || 'low'];
                return (
                  <motion.div
                    key={item.id}
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    className={`group relative pl-3 border-l-2 transition-all duration-200 py-1.5 ${
                      item.urgency === 'high' ? 'border-petroleum/30 hover:border-petroleum' :
                      item.urgency === 'medium' ? 'border-corporate/30 hover:border-corporate' :
                      'border-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bgColor}`}>
                        <Icon name={item.icon} className={`text-xs ${cfg.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1.5">
                          <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                          {item.action && (
                            <button
                              onClick={() => handleAction(item.rec)}
                              className={`flex-shrink-0 text-[10px] font-medium ${cfg.btnText} ${cfg.btnBg} px-2 py-0.5 rounded-md border ${cfg.btnBorder} ${cfg.btnHover} transition-colors active:scale-95 -mt-0.5`}
                            >
                              <Icon name="fa-arrow-right" className="text-[8px] mr-0.5" />{item.action.label}
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.description}</p>
                        <span className={`text-[9px] font-medium ${cfg.textColor} ${cfg.bgColor} px-1.5 py-0.5 rounded inline-block mt-0.5`}>
                          {t(cfg.labelKey)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyPlan;
