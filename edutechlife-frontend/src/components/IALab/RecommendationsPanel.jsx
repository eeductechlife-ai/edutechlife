import React, { useState, useCallback, useMemo } from 'react';
import { useIALabStore } from '../../store/ialabStore';
import { Icon } from '../../utils/iconMapping.jsx';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import usePersonalizedRecommendations from '../../hooks/IALab/usePersonalizedRecommendations';
import { useTranslation } from '../../i18n/I18nProvider';

const URGENCY_CONFIG = {
  high: {
    labelKey: 'ialab.recommendations.urgency_high', icon: 'fa-flag',
    textColor: 'text-petroleum', bgColor: 'bg-petroleum/10', iconColor: 'text-petroleum',
    gradientFrom: 'from-petroleum/5', gradientTo: 'to-petroleum/[0.02]',
    borderClass: 'border-petroleum/20', hoverBorder: 'hover:border-petroleum/40',
    btnBg: 'bg-petroleum/10', btnBorder: 'border-petroleum/20', btnText: 'text-petroleum',
    btnHover: 'hover:bg-petroleum/20',
    lineGradient: 'from-petroleum/30 to-transparent',
  },
  medium: {
    labelKey: 'ialab.recommendations.urgency_medium', icon: 'fa-list',
    textColor: 'text-corporate', bgColor: 'bg-corporate/10', iconColor: 'text-corporate',
    gradientFrom: 'from-corporate/5', gradientTo: 'to-corporate/[0.02]',
    borderClass: 'border-corporate/20', hoverBorder: 'hover:border-corporate/40',
    btnBg: 'bg-corporate/10', btnBorder: 'border-corporate/20', btnText: 'text-corporate',
    btnHover: 'hover:bg-corporate/20',
    lineGradient: 'from-corporate/30 to-transparent',
  },
  low: {
    labelKey: 'ialab.recommendations.urgency_low', icon: 'fa-lightbulb',
    textColor: 'text-slate-600', bgColor: 'bg-slate-100', iconColor: 'text-slate-500',
    gradientFrom: 'from-slate-50', gradientTo: 'to-slate-100',
    borderClass: 'border-slate-200/60', hoverBorder: 'hover:border-slate-300/60',
    btnBg: 'bg-slate-100', btnBorder: 'border-slate-200', btnText: 'text-slate-600',
    btnHover: 'hover:bg-slate-200',
    lineGradient: 'from-slate-200 to-transparent',
  },
};

const RecommendationsPanel = ({ onAction, isLoading }) => {
  const { t } = useTranslation();
  const setActiveModAction = useIALabStore(s => s.setActiveMod);
  const setVisitedModules = useIALabStore(s => s.setVisitedModules);
  const prefersReducedMotion = useReducedMotion();
  const personalizedRecs = usePersonalizedRecommendations();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => setIsOpen(v => !v), []);

  const limitedRecs = useMemo(() => ({
    high: personalizedRecs.high.slice(0, 2),
    medium: personalizedRecs.medium.slice(0, 2),
    low: personalizedRecs.low.slice(0, 2),
  }), [personalizedRecs]);

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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 bg-slate-200 rounded w-24 animate-pulse" />
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

  const isEmpty = limitedRecs.high.length === 0 && limitedRecs.medium.length === 0 && limitedRecs.low.length === 0;
  if (isEmpty) return null;

  const totalCount = personalizedRecs.high.length + personalizedRecs.medium.length + personalizedRecs.low.length;

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center gap-1.5 text-left cursor-pointer group"
        aria-expanded={isOpen}
        aria-label={isOpen ? t('ialab.recommendations.toggle_hide') : t('ialab.recommendations.toggle_show')}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Icon name="fa-lightbulb" className="w-3.5 h-3.5 text-corporate group-hover:text-corporate/80 transition-colors" />
        </motion.div>
        <h4 className="text-xs font-bold text-petroleum uppercase tracking-wider group-hover:text-corporate transition-colors">
          {t('ialab.recommendations.title')}
        </h4>
        <span className="text-[10px] text-slate-400 ml-auto">
          {t('ialab.recommendations.pending_count', { count: totalCount })}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 pt-2">
              {(['high', 'medium', 'low']).map(urgency => {
                const recs = limitedRecs[urgency];
                if (recs.length === 0) return null;
                const cfg = URGENCY_CONFIG[urgency];
                return (
                  <div key={urgency}>
                    <div className="flex items-center gap-1.5 mb-2 px-0.5">
                      <div className={`w-4 h-4 rounded ${cfg.bgColor} flex items-center justify-center`}>
                        <Icon name={cfg.icon} className={`text-[8px] ${cfg.textColor}`} />
                      </div>
                      <p className={`text-[10px] font-bold ${cfg.textColor} uppercase tracking-[0.15em]`}>{t(cfg.labelKey)}</p>
                      <div className={`flex-1 h-px bg-gradient-to-r ${cfg.lineGradient}`} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {recs.map((rec, i) => (
                        <motion.div
                          key={rec.id}
                          initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.2 }}
                          className={`group bg-white rounded-xl border ${cfg.borderClass} ${cfg.hoverBorder} p-2.5 transition-all duration-200`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cfg.gradientFrom} ${cfg.gradientTo} flex items-center justify-center flex-shrink-0`}>
                              <Icon name={rec.icon} className={`text-xs ${cfg.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1.5">
                                <p className="text-xs font-semibold text-slate-800">{rec.title}</p>
                                {rec.action && (
                                  <button
                                    onClick={() => handleAction(rec)}
                                    className={`flex-shrink-0 text-[10px] font-medium ${cfg.btnText} ${cfg.btnBg} px-2 py-0.5 rounded-md border ${cfg.btnBorder} ${cfg.btnHover} transition-colors active:scale-95 -mt-0.5`}
                                  >
                                    <Icon name="fa-arrow-right" className="text-[8px] mr-0.5" />{rec.action.label}
                                  </button>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{rec.text}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(RecommendationsPanel);
