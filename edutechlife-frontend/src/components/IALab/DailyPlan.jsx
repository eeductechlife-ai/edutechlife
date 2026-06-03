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

const MAX_ITEMS = 8;

const DailyPlan = ({ onAction, isLoading }) => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const setActiveModAction = useIALabStore(s => s.setActiveMod);
  const setVisitedModules = useIALabStore(s => s.setVisitedModules);
  const addXp = useIALabStore(s => s.addXp);
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
    activeChallenges.forEach(c => {
      items.push({
        id: c.id,
        type: 'challenge',
        priority: 1,
        icon: c.icon,
        title: c.title,
        description: c.description,
        xpReward: c.xp,
        completed: false,
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
          className="w-full flex items-center gap-1.5 text-left cursor-pointer group"
          aria-expanded={isOpen}
        >
          <Icon name="fa-check-circle" className="w-3.5 h-3.5 text-emerald-400" />
          <h4 className="text-xs font-bold text-petroleum uppercase tracking-wider">
            {t('ialab.daily_plan.title')}
          </h4>
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
        className="w-full flex items-center gap-1.5 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Icon name="fa-lightbulb" className="w-3.5 h-3.5 text-corporate group-hover:text-corporate/80 transition-colors" />
        </motion.div>
        <h4 className="text-xs font-bold text-petroleum uppercase tracking-wider group-hover:text-corporate transition-colors">
          {t('ialab.daily_plan.title')}
        </h4>
        <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-1">
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-corporate/10 text-corporate font-semibold">
              {pendingCount}
            </span>
          )}
          {completedCount > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[9px]">
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
            <div className="flex flex-col gap-1.5 pt-2">
              {mergedItems.map((item, i) => {
                if (item.type === 'challenge') {
                  return (
                    <motion.div
                      key={item.id}
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      className="group bg-white rounded-xl border border-corporate/20 hover:border-corporate/40 hover:shadow-sm p-2.5 transition-all duration-200"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg bg-corporate/10 border border-corporate/20 flex items-center justify-center flex-shrink-0">
                          <Icon name={item.icon} className="text-sm text-corporate" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                            <button
                              onClick={() => completeChallenge(item.id, item.xpReward)}
                              className="flex-shrink-0 text-[10px] font-medium text-corporate bg-corporate/10 px-2 py-0.5 rounded-md border border-corporate/20 hover:bg-corporate/20 transition-colors active:scale-95"
                            >
                              <Icon name="fa-check" className="text-[8px] mr-0.5" />Completar
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Icon name="fa-star" className="text-[9px] text-corporate" />
                              <span className="text-[10px] font-semibold text-corporate">+{item.xpReward} XP</span>
                            </span>
                            <span className="text-[9px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              Desafío
                            </span>
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
                    className={`group bg-white rounded-xl border ${cfg.borderClass} ${cfg.hoverBorder} p-2.5 transition-all duration-200`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cfg.gradientFrom} ${cfg.gradientTo} flex items-center justify-center flex-shrink-0`}>
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
