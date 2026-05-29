import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useIALabStore } from '../../store/ialabStore';
import { useSupabase } from '../../hooks/useSupabase';
import { getBadgeInfo } from '../../data/ialab';
import { Icon } from '../../utils/iconMapping';
import BadgeCard from './BadgeCard';
import { getWeekDays } from './useWeekDays';
import { useTranslation } from '../../i18n/I18nProvider';

const FIRE_GRADIENTS = {
  low: 'from-corporate to-cyan-400',
  mid: 'from-petroleum to-corporate',
  high: 'from-petroleum to-cyan-400',
};

const POSITION_ICONS = {
  1: { icon: 'fa-trophy', color: 'text-amber-400', bg: 'bg-amber-50' },
  2: { icon: 'fa-medal', color: 'text-slate-400', bg: 'bg-slate-50' },
  3: { icon: 'fa-medal', color: 'text-amber-700', bg: 'bg-amber-50/50' },
};

const SECTION_HEADER = 'flex items-center gap-2 mb-3';
const SECTION_ICON_WRAPPER = 'w-6 h-6 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0';
const SECTION_TITLE = 'text-sm font-bold text-petroleum';

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, type: 'spring', stiffness: 250, damping: 22 },
  }),
};

const StreakCircle = ({ filled, label, isToday, index, prefersReducedMotion }) => (
  <motion.div
    initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1, transition: prefersReducedMotion ? {} : { delay: 0.3 + index * 0.06, type: 'spring', stiffness: 300, damping: 15 } }}
    className="relative flex flex-col items-center gap-0.5"
  >
    <motion.div
      animate={!prefersReducedMotion && filled && isToday ? { scale: [1, 1.15, 1] } : filled ? { scale: 1 } : { scale: 0.9 }}
      transition={prefersReducedMotion ? {} : { repeat: filled && isToday ? Infinity : 0, duration: 2, ease: 'easeInOut' }}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
        filled
          ? 'bg-gradient-to-br from-petroleum to-corporate shadow-md shadow-petroleum/30'
          : 'bg-slate-100 border border-slate-200'
      }`}
    >
      {filled && (
        <motion.div initial={prefersReducedMotion ? {} : { scale: 0 }} animate={{ scale: 1 }} transition={prefersReducedMotion ? {} : { delay: 0.4 + index * 0.06, type: 'spring', stiffness: 400, damping: 12 }}>
          <Icon name="fa-check" className="text-white text-[10px]" />
        </motion.div>
      )}
    </motion.div>
    <span className={`text-[10px] font-medium ${filled ? 'text-slate-600' : 'text-slate-400'}`}>
      {label}
    </span>
  </motion.div>
);

const StreakDetailsModal = ({ isOpen, onClose }) => {
  const prefersReducedMotion = useReducedMotion();
  const { t, locale } = useTranslation();
  const BADGE_INFO = getBadgeInfo(locale);
  const xp = useIALabStore(s => s.xp);
  const streak = useIALabStore(s => s.streak);
  const level = useIALabStore(s => s.getLevel());
  const levelProgress = useIALabStore(s => s.getLevelProgress());
  const isAtRisk = useIALabStore(s => s.isStreakAtRisk());
  const badges = useIALabStore(s => s.badges);
  const badgesDates = useIALabStore(s => s.badgesDates);
  const myXp = useIALabStore(s => s.xp);
  const myStreak = useIALabStore(s => s.streak);

  const { supabase, userId } = useSupabase();
  const [entries, setEntries] = useState([]);
  const [loadingLb, setLoadingLb] = useState(false);

  const weekDays = getWeekDays(streak);

  const fireGradient = streak >= 7 ? FIRE_GRADIENTS.high : streak >= 3 ? FIRE_GRADIENTS.mid : FIRE_GRADIENTS.low;
  const tierKey = streak >= 7 ? 'streak.tier_imparable' : streak >= 3 ? 'streak.tier_encendida' : 'streak.tier_activa';

  const { earned, locked, total } = useMemo(() => {
    const earnedList = [];
    const lockedList = [];
    Object.entries(BADGE_INFO).forEach(([id, info]) => {
      if (badges.includes(id)) {
        earnedList.push({ id, ...info, dateEarned: badgesDates[id] || null });
      } else {
        lockedList.push({ id, ...info });
      }
    });
    return { earned: earnedList, locked: lockedList, total: Object.keys(BADGE_INFO).length };
  }, [badges, badgesDates]);

  const fetchLeaderboard = useCallback(async () => {
    if (!supabase) return;
    setLoadingLb(true);
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('user_id, gamification_data')
        .eq('activity_type', 'gamification')
        .eq('resource_id', 'state')
        .not('gamification_data', 'is', null)
        .limit(100);
      if (error) throw error;
      const processed = (data || [])
        .filter(row => row.gamification_data?.xp > 0)
        .sort((a, b) => (b.gamification_data?.xp || 0) - (a.gamification_data?.xp || 0))
        .slice(0, 50);
      const userIds = processed.map(row => row.user_id);
      let profiles = {};
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, email')
          .in('id', userIds);
        if (profileData) profileData.forEach(p => { profiles[p.id] = p; });
      } catch {}
      const enriched = processed.map((row, idx) => ({
        rank: idx + 1,
        userId: row.user_id,
        name: profiles[row.user_id]?.full_name || row.user_id?.slice(0, 8) || 'Usuario',
        avatar: profiles[row.user_id]?.avatar_url || null,
        xp: row.gamification_data?.xp || 0,
        streak: row.gamification_data?.streak || 0,
        badges: (row.gamification_data?.badges || []).length,
      }));
      setEntries(enriched);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoadingLb(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (isOpen) fetchLeaderboard();
  }, [isOpen, fetchLeaderboard]);

  const myEntry = entries.find(e => e.userId === userId);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm">
                  <Icon name="fa-chart-line" className="text-white text-sm" />
                </div>
                <h2 className="text-lg font-bold text-petroleum">{t('modal.progress_title')}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40"
                aria-label={t('common.close')}
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6" style={{ maxHeight: 'calc(85vh - 73px)' }}>
              {/* Level Progress Bar */}
              <motion.div
                custom={0}
                variants={sectionVariants}
                initial={prefersReducedMotion ? {} : 'hidden'}
                animate="visible"
                className="bg-gradient-to-br from-petroleum/[0.04] to-corporate/[0.02] rounded-xl border border-petroleum/10 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm">
                      <Icon name="fa-bolt" className="text-white text-xs" />
                    </div>
                    <span className="text-sm font-bold text-petroleum">{t('streak.level')} {level}</span>
                  </div>
                  <span className="text-xs font-semibold text-corporate">{xp.toLocaleString()} {t('streak.xp')}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={prefersReducedMotion ? { width: `${levelProgress}%` } : { width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={prefersReducedMotion ? {} : { duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full"
                  />
                </div>
              </motion.div>

              {/* Seccion Racha */}
              <motion.div
                custom={1}
                variants={sectionVariants}
                initial={prefersReducedMotion ? {} : 'hidden'}
                animate="visible"
              >
                <div className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
                  isAtRisk && streak > 0
                    ? 'border-amber-200/60 bg-gradient-to-br from-amber-50/40 to-white'
                    : streak >= 3
                      ? 'border-corporate/20 bg-gradient-to-br from-corporate/[0.04] to-white'
                      : 'border-slate-200/60 bg-white'
                }`}>
                  {!prefersReducedMotion && isAtRisk && streak > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                      className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-transparent pointer-events-none"
                    />
                  )}
                  {!prefersReducedMotion && !isAtRisk && streak >= 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      className="absolute inset-0 bg-gradient-to-r from-corporate/[0.04] to-transparent pointer-events-none"
                    />
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      animate={!prefersReducedMotion && streak > 0 ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] } : { scale: 1 }}
                      transition={{ repeat: streak > 0 ? Infinity : 0, duration: 2.5, ease: 'easeInOut' }}
                      className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${fireGradient} flex items-center justify-center shadow-lg shrink-0`}
                    >
                      <Icon name="fa-fire" className="text-white text-base" />
                      {!prefersReducedMotion && streak > 0 && (
                        <motion.div
                          custom={0}
                          variants={{ initial: { opacity: 0, scale: 0, rotate: -45 }, animate: (i) => ({ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: 0, transition: { delay: i * 0.12, duration: 0.8, ease: 'easeOut' } }) }}
                          initial="initial"
                          animate="animate"
                          className="absolute w-1.5 h-1.5 rounded-full bg-corporate"
                          style={{ top: '14px', left: '20px' }}
                        />
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-slate-800 leading-none">{streak}</span>
                        <span className="text-sm font-semibold text-slate-400">{t('streak.days')}</span>
                      </div>
                      <p className={`text-xs font-medium leading-tight ${
                        streak >= 7 ? 'text-corporate' : streak >= 3 ? 'text-petroleum' : 'text-slate-400'
                      }`}>
                        {t('streak.racha', { tier: t(tierKey) })}
                        {isAtRisk && streak > 0 && <span className="ml-1.5 text-amber-500 font-semibold">{t('streak.study_today')}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    {weekDays.map((day, i) => (
                      <StreakCircle key={i} {...day} index={i} prefersReducedMotion={prefersReducedMotion} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Seccion Insignias */}
              <motion.div
                custom={2}
                variants={sectionVariants}
                initial={prefersReducedMotion ? {} : 'hidden'}
                animate="visible"
              >
                <div className={SECTION_HEADER}>
                  <div className={SECTION_ICON_WRAPPER}>
                    <Icon name="fa-award" className="text-white text-[10px]" />
                  </div>
                  <h3 className={SECTION_TITLE}>{t('modal.badges_title')}</h3>
                  <span className="text-xs font-medium text-slate-400 ml-auto">{earned.length}/{total}</span>
                </div>
                {earned.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-[11px] font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {t('badge.obtained')}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {earned.map(badge => (
                        <BadgeCard key={badge.id} badge={badge} earned dateEarned={badge.dateEarned} />
                      ))}
                    </div>
                  </div>
                )}
                {locked.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      {t('badge.locked')}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {locked.map(badge => (
                        <BadgeCard key={badge.id} badge={badge} earned={false} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Seccion Leaderboard */}
              <motion.div
                custom={3}
                variants={sectionVariants}
                initial={prefersReducedMotion ? {} : 'hidden'}
                animate="visible"
              >
                <div className={SECTION_HEADER}>
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm flex-shrink-0">
                    <Icon name="fa-trophy" className="text-white text-[10px]" />
                  </div>
                  <h3 className={SECTION_TITLE}>{t('modal.leaderboard_title')}</h3>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
                  {loadingLb ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 text-petroleum animate-spin" />
                    </div>
                  ) : entries.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-slate-400">
                      <Icon name="fa-trophy" className="text-2xl mb-2 opacity-30" />
                      <p className="text-sm font-medium">{t('leaderboard.empty')}</p>
                      <p className="text-xs mt-1">{t('leaderboard.empty_hint')}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {entries.slice(0, 10).map((entry) => {
                        const isMe = entry.userId === userId;
                        const positionStyle = POSITION_ICONS[entry.rank];
                        return (
                          <div
                            key={entry.userId}
                            className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                              isMe
                                ? 'bg-petroleum/[0.03] ring-1 ring-inset ring-petroleum/10'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              positionStyle?.bg || 'bg-slate-100'
                            }`}>
                              {entry.rank <= 3 ? (
                                <Icon name={positionStyle.icon} className={`text-sm ${positionStyle.color}`} />
                              ) : (
                                <span className="text-xs font-bold text-slate-400">#{entry.rank}</span>
                              )}
                            </div>
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold overflow-hidden">
                              {entry.avatar ? <img src={entry.avatar} alt="" className="w-full h-full object-cover" /> : entry.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-700 truncate">
                                {entry.name}
                                {isMe && <span className="text-[10px] text-petroleum font-medium ml-1">({t('streak.you')})</span>}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span>{t('streak.leaderboard_streak', { days: entry.streak })}</span>
                                <span>·</span>
                                <span>{t('streak.leaderboard_badges', { count: entry.badges })}</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold text-petroleum">{entry.xp.toLocaleString()}</p>
                              <p className="text-[10px] text-slate-400">{t('streak.xp')}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Tu posicion si no está en top 10 */}
                  {!myEntry && !loadingLb && entries.length > 0 && (
                    <div className="border-t border-slate-100 p-3 bg-petroleum/[0.02]">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-slate-400">—</span>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">
                          <Icon name="fa-user" className="text-white text-[10px]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700">{t('streak.position')}</p>
                          <p className="text-[11px] text-slate-400">{t('streak.position_line', { xp: myXp.toLocaleString(), days: myStreak })}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-petroleum">{myXp.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400">XP</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StreakDetailsModal;
