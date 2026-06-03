import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabStore } from '../../store/ialabStore';
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

const DailyChallenges = () => {
  const [completed, setCompleted] = useState(loadCompletion);
  const [isOpen, setIsOpen] = useState(false);
  const addXp = useIALabStore(s => s.addXp);
  const xp = useIALabStore(s => s.xp);

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

  const progress = useMemo(() => {
    const done = Object.keys(completed).filter(k => completed[k]).length;
    return { done, total: DAILY_CHALLENGES.length, pct: Math.round((done / DAILY_CHALLENGES.length) * 100) };
  }, [completed]);

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center gap-1.5 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Icon name="fa-trophy" className="w-3.5 h-3.5 text-corporate group-hover:text-corporate/80 transition-colors" />
        </motion.div>
        <h4 className="text-xs font-bold text-petroleum uppercase tracking-wider group-hover:text-corporate transition-colors">
          Desafíos diarios
        </h4>
        <span className="text-[10px] font-medium ml-auto flex items-center gap-1">
          <span className={`px-1.5 py-0.5 rounded ${progress.done === progress.total ? 'bg-emerald-50 text-emerald-600' : 'bg-corporate/10 text-corporate'}`}>
            {progress.done}/{progress.total}
          </span>
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
            <div className="flex flex-col gap-2 pt-2">
              {DAILY_CHALLENGES.map((c) => {
                const isDone = !!completed[c.id];
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 ${
                      isDone
                        ? 'bg-emerald-50/50 border-emerald-200/60 opacity-70'
                        : 'bg-white border-slate-200/60 hover:border-corporate/40 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDone ? 'bg-emerald-100' : 'bg-corporate/10 border border-corporate/20'
                    }`}>
                      <Icon name={c.icon} className={`text-sm ${isDone ? 'text-emerald-500' : 'text-corporate'}`} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-semibold ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {c.title}
                        </p>
                        {!isDone && (
                          <button
                            onClick={() => completeChallenge(c.id, c.xp)}
                            className="flex-shrink-0 text-[10px] font-medium text-corporate bg-corporate/10 px-2 py-0.5 rounded-md border border-corporate/20 hover:bg-corporate/20 transition-colors active:scale-95"
                          >
                            <Icon name="fa-check" className="text-[8px] mr-0.5" />Completar
                          </button>
                        )}
                      </div>
                      <p className={`text-[11px] mt-0.5 ${isDone ? 'text-slate-300' : 'text-slate-500'}`}>
                        {c.description}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Icon name="fa-star" className="text-[9px] text-corporate" aria-hidden="true" />
                        <span className="text-[10px] font-semibold text-corporate">+{c.xp} XP</span>
                      </div>
                    </div>
                    {isDone && (
                      <Icon name="fa-check-circle" className="text-emerald-400 text-sm flex-shrink-0" aria-hidden="true" />
                    )}
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

export default React.memo(DailyChallenges);
