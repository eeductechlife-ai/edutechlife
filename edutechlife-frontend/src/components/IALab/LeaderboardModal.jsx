import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Loader2 } from 'lucide-react';
import { useSupabase } from '../../hooks/useSupabase';
import { useIALabStore } from '../../store/ialabStore';
import { Icon } from '../../utils/iconMapping';

const POSITION_ICONS = {
  1: { icon: 'fa-trophy', color: 'text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  2: { icon: 'fa-medal', color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/50' },
  3: { icon: 'fa-medal', color: 'text-amber-700', bg: 'bg-amber-50/50 dark:bg-amber-900/10' },
};

const LeaderboardModal = ({ isOpen, onClose }) => {
  const { supabase, userId } = useSupabase();
  const myXp = useIALabStore(s => s.xp);
  const myStreak = useIALabStore(s => s.streak);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
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
        if (profileData) {
          profileData.forEach(p => { profiles[p.id] = p; });
        }
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
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (isOpen) fetchLeaderboard();
  }, [isOpen, fetchLeaderboard]);

  const myEntry = entries.find(e => e.userId === userId);
  const myRank = myEntry?.rank || null;

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
            className="relative w-full max-w-lg max-h-[80vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-petroleum dark:text-corporate">Leaderboard</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40"
                aria-label="Cerrar leaderboard"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 73px)' }}>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 text-petroleum animate-spin" />
                </div>
              ) : entries.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-slate-400">
                  <Trophy className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm font-medium">Aún no hay datos en el leaderboard</p>
                  <p className="text-xs mt-1">Completa lecciones para aparecer aquí</p>
                </div>
              ) : (
                <div className="p-4 space-y-1">
                  {entries.map((entry) => {
                    const isMe = entry.userId === userId;
                    const positionStyle = POSITION_ICONS[entry.rank];
                    return (
                      <div
                        key={entry.userId}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          isMe
                            ? 'bg-petroleum/5 dark:bg-petroleum/10 ring-1 ring-petroleum/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          positionStyle?.bg || 'bg-slate-100 dark:bg-slate-700'
                        }`}>
                          {entry.rank <= 3 ? (
                            <Icon name={positionStyle.icon} className={`text-base ${positionStyle.color}`} />
                          ) : (
                            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">#{entry.rank}</span>
                          )}
                        </div>

                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center flex-shrink-0 text-white text-xs font-bold overflow-hidden">
                          {entry.avatar ? (
                            <img src={entry.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            entry.name.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {entry.name}
                            {isMe && <span className="text-[10px] text-petroleum font-medium ml-1.5">(tú)</span>}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>{entry.streak} días racha</span>
                            <span>·</span>
                            <span>{entry.badges} insignias</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-petroleum dark:text-corporate">{entry.xp.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400">XP</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!myEntry && !loading && (
                <div className="sticky bottom-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-petroleum/5 dark:bg-petroleum/10 ring-1 ring-petroleum/20">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-slate-400">—</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      Y
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tu posición</p>
                      <p className="text-xs text-slate-400">{myXp.toLocaleString()} XP · {myStreak} días racha</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-petroleum dark:text-corporate">{myXp.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">XP</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeaderboardModal;
