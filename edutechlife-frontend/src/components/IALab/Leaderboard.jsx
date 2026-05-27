import { useState, useEffect } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { useIALabStore } from '../../store/ialabStore';
import { useTranslation } from '../../i18n/I18nProvider';
import { Icon } from '../../utils/iconMapping';

const MOCK_LEADERS = [
  { id: 'user_1', name: 'Tú', xp: 0, streak: 0, level: 1, isCurrentUser: true },
  { id: 'user_2', name: 'María G.', xp: 3200, streak: 12, level: 6 },
  { id: 'user_3', name: 'Carlos R.', xp: 2800, streak: 8, level: 5 },
  { id: 'user_4', name: 'Ana L.', xp: 1500, streak: 5, level: 4 },
  { id: 'user_5', name: 'Pedro M.', xp: 900, streak: 3, level: 3 },
];

const Leaderboard = () => {
  const { t } = useTranslation();
  const xp = useIALabStore(s => s.xp);
  const streak = useIALabStore(s => s.streak);
  const level = useIALabStore(s => s.getLevel());

  const [leaders, setLeaders] = useState(() => {
    const updated = MOCK_LEADERS.map(l =>
      l.isCurrentUser ? { ...l, xp, streak, level } : l
    ).sort((a, b) => b.xp - a.xp);
    return updated.map((l, i) => ({ ...l, position: i + 1 }));
  });

  useEffect(() => {
    setLeaders(prev => {
      const updated = prev.map(l =>
        l.isCurrentUser ? { ...l, xp, streak, level } : l
      ).sort((a, b) => b.xp - a.xp);
      return updated.map((l, i) => ({ ...l, position: i + 1 }));
    });
  }, [xp, streak, level]);

  const getMedal = (pos) => {
    if (pos === 1) return { icon: 'fa-trophy', color: 'text-[#FFD166]' };
    if (pos === 2) return { icon: 'fa-medal', color: 'text-slate-400' };
    if (pos === 3) return { icon: 'fa-medal', color: 'text-amber-700' };
    return null;
  };

  return (
    <LayoutGroup>
      <div className="space-y-1">
        {leaders.map((user, i) => {
          const medal = getMedal(user.position);
          return (
            <motion.div
              key={user.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 24 }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                user.isCurrentUser
                  ? 'bg-gradient-to-r from-corporate/[0.08] to-transparent border border-corporate/20'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
              }`}
            >
              <div className="w-6 text-center">
                {medal ? (
                  <Icon name={medal.icon} className={`${medal.color} text-sm`} />
                ) : (
                  <span className="text-xs font-medium text-slate-400">{user.position}</span>
                )}
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold truncate ${user.isCurrentUser ? 'text-corporate' : 'text-slate-700 dark:text-slate-200'}`}>
                    {user.name}
                  </span>
                  {user.isCurrentUser && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-corporate/10 text-corporate font-bold uppercase">
                      {t('leaderboard.you_label')}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{user.xp.toLocaleString()}</span>
                <span className="text-[9px] text-slate-400 ml-1">XP</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </LayoutGroup>
  );
};

export default Leaderboard;
