import { useState, useEffect } from 'react';
import { motion, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Icon } from '../../utils/iconMapping';
import { getWeekDays } from './useWeekDays';
import { useTranslation } from '../../i18n/I18nProvider';

const STREAK_GRADIENTS = {
  low: 'from-slate-300 to-slate-400',
  mid: 'from-petroleum to-corporate',
  high: 'from-corporate to-cyan-400',
};

const sparkleVariants = {
  initial: { opacity: 0, scale: 0, rotate: -45 },
  animate: (i) => ({
    opacity: [0, 1, 0],
    scale: [0, 1.2, 0],
    rotate: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: 'easeOut' },
  }),
};

const Sparkle = ({ index }) => (
  <motion.div
    custom={index}
    variants={sparkleVariants}
    initial="initial"
    animate="animate"
    className="absolute w-1.5 h-1.5 rounded-full bg-corporate"
    style={{
      top: `${15 + Math.sin(index * 1.2) * 8}px`,
      left: `${15 + Math.cos(index * 1.2) * 8}px`,
    }}
  />
);

const StreakCircle = ({ filled, label, isToday, index, prefersReducedMotion }) => (
  <motion.div
    initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
    animate={{
      scale: 1,
      opacity: 1,
      transition: prefersReducedMotion ? {} : { delay: 0.3 + index * 0.06, type: 'spring', stiffness: 300, damping: 15 },
    }}
    className="relative flex flex-col items-center gap-0.5"
  >
    <motion.div
      animate={
        !prefersReducedMotion && filled && isToday
          ? { scale: [1, 1.15, 1] }
          : filled
            ? { scale: 1 }
            : { scale: 0.9 }
      }
      transition={prefersReducedMotion ? {} : { repeat: filled && isToday ? Infinity : 0, duration: 2, ease: 'easeInOut' }}
      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
        filled
          ? 'bg-gradient-to-br from-petroleum to-corporate shadow-md shadow-corporate/30'
          : 'bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600'
      }`}
    >
      {filled && (
        <motion.div
          initial={prefersReducedMotion ? {} : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={prefersReducedMotion ? {} : { delay: 0.4 + index * 0.06, type: 'spring', stiffness: 400, damping: 12 }}
        >
          <Icon name="fa-check" className="text-white text-[8px]" />
        </motion.div>
      )}
    </motion.div>
    <span className={`text-[8px] font-medium ${filled ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
      {label}
    </span>
  </motion.div>
);

const StreakBadge = ({ streak, xp, isAtRisk, level, onClick }) => {
  const prefersReducedMotion = useReducedMotion();
  const { t } = useTranslation();
  const weekDays = getWeekDays(streak);
  const animatedStreak = useSpring(0, { stiffness: 80, damping: 15 });
  const roundedStreak = useTransform(animatedStreak, (v) => Math.round(v));

  const [prevStreak, setPrevStreak] = useState(streak);
  const [justChanged, setJustChanged] = useState(false);

  useEffect(() => {
    if (streak !== prevStreak && prevStreak !== undefined) {
      setJustChanged(true);
      const timer = setTimeout(() => setJustChanged(false), 600);
      setPrevStreak(streak);
      return () => clearTimeout(timer);
    }
    setPrevStreak(streak);
  }, [streak]);

  useEffect(() => {
    animatedStreak.set(streak);
  }, [streak, animatedStreak]);

  const streakGradient = streak >= 7 ? STREAK_GRADIENTS.high : streak >= 3 ? STREAK_GRADIENTS.mid : STREAK_GRADIENTS.low;
  const tierKey = streak >= 7 ? 'streak.tier_imparable' : streak >= 3 ? 'streak.tier_encendida' : 'streak.tier_activa';

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left focus:outline-none focus-visible:outline-none group"
    >
      <motion.div
        initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 8 }}
        animate={{
          opacity: 1,
          y: 0,
          ...(justChanged && !prefersReducedMotion ? { scale: [1, 1.03, 1] } : {}),
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.4,
          ease: 'easeOut',
          ...(justChanged ? { scale: { duration: 0.6, ease: 'easeInOut' } } : {}),
        }}
        className={`relative overflow-hidden rounded-xl border p-3 transition-all duration-300 cursor-pointer
          group-hover:shadow-md group-hover:-translate-y-0.5
          group-focus-visible:ring-2 group-focus-visible:ring-petroleum/40 group-focus-visible:ring-offset-2
          ${
          isAtRisk && streak > 0
            ? 'border-amber-200 dark:border-amber-700/50 bg-gradient-to-br from-amber-50/80 to-white dark:from-amber-900/10 dark:to-slate-800'
            : streak >= 3
              ? 'border-corporate/20 dark:border-corporate/30 bg-gradient-to-br from-corporate/[0.04] to-white dark:from-corporate/[0.06] dark:to-slate-800'
              : 'border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800'
        }`}
      >
        {!prefersReducedMotion && isAtRisk && streak > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-transparent pointer-events-none"
          />
        )}

        <div className="flex items-center gap-2.5 mb-2.5">
          <motion.div
            animate={
              !prefersReducedMotion && streak > 0
                ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }
                : { scale: 1 }
            }
            transition={{ repeat: streak > 0 ? Infinity : 0, duration: 2.5, ease: 'easeInOut' }}
            className={`relative w-9 h-9 rounded-xl bg-gradient-to-br ${streakGradient} flex items-center justify-center shadow-lg shrink-0`}
          >
            <Icon name="fa-fire" className="text-white text-sm" />
            {!prefersReducedMotion && streak > 0 && <Sparkle index={0} />}
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <motion.span className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none tabular-nums">
                {prefersReducedMotion ? streak : roundedStreak}
              </motion.span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{t('streak.days')}</span>
            </div>
            <p className={`text-[10px] font-medium leading-tight ${
              streak >= 7
                ? 'text-corporate dark:text-corporate'
                : streak >= 3
                  ? 'text-petroleum dark:text-corporate-dark'
                  : 'text-slate-400 dark:text-slate-500'
            }`}>
              {t('streak.racha', { tier: t(tierKey) })}
              {isAtRisk && streak > 0 && (
                <span className="ml-1.5 text-amber-500 font-semibold">{t('streak.study_today')}</span>
              )}
            </p>
          </div>
          {xp > 0 && (
            <div className="text-right shrink-0">
              <p className="text-[10px] font-medium text-slate-400">{t('streak.level')} {level}</p>
              <p className="text-xs font-bold text-corporate">{xp} {t('streak.xp')}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-0.5">
          {weekDays.map((day, i) => (
            <StreakCircle key={i} {...day} index={i} prefersReducedMotion={prefersReducedMotion} />
          ))}
        </div>
      </motion.div>
    </button>
  );
};

export default StreakBadge;
