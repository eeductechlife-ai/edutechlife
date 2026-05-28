import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';
import { useTranslation } from '../../i18n/I18nProvider';

const COLORS = {
  petroleum: '#004B63',
  cyan: '#00BCD4',
  coral: '#4DA8C4',
  mint: '#66CCCC',
  gold: '#FFD166',
  pink: '#FF6B9D',
  slate: '#64748B',
  lightBlue: '#B2D8E5',
};

const REWARDS = [
  { id: 1, name: 'Tema Oscuro', icon: '🌙', cost: 500, description: 'Cambia a modo oscuro el dashboard' },
  { id: 2, name: 'Avatar Dani Animado', icon: '🤖', cost: 750, description: 'Desbloquea avatar animado de Dani' },
  { id: 3, name: 'Fondo Galaxia', icon: '🌌', cost: 1000, description: 'Fondo de pantalla espacial' },
  { id: 4, name: 'Día Libre', icon: '🏖️', cost: 1500, description: 'Un día sin tareas asignadas' },
  { id: 5, name: 'Curso IA Básico', icon: '🤖', cost: 2000, description: 'Acceso a curso introductorio de IA' },
  { id: 6, name: 'Certificado VAK', icon: '📜', cost: 3000, description: 'Certificado oficial de tu perfil VAK' },
];

function getLevel(points) {
  if (points >= 5000) return { name: 'Maestro', icon: '🏆', next: null, progress: 100 };
  if (points >= 2500) return { name: 'Experto', icon: '⭐', next: 5000, progress: ((points - 2500) / 2500) * 100 };
  if (points >= 1000) return { name: 'Avanzado', icon: '📚', next: 2500, progress: ((points - 1000) / 1500) * 100 };
  if (points >= 500) return { name: 'Intermedio', icon: '🌟', next: 1000, progress: ((points - 500) / 500) * 100 };
  return { name: 'Principiante', icon: '🌱', next: 500, progress: (points / 500) * 100 };
}

function getDayStatus(dateStr, streakLog) {
  if (streakLog.some(e => e.date === dateStr)) return 'active';
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date > today) return 'future';
  return 'missed';
}

function getActiveHour(dateStr, streakLog) {
  const entry = streakLog.find(e => e.date === dateStr);
  return entry ? entry.hour : null;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 300 } },
};

const CalendarMonth = ({ streakLog, darkMode }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = now.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ day: d, dateStr });
  }

  return (
    <motion.div variants={item} className={`rounded-2xl p-5 border transition-colors duration-500 ${
      darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]/50'
    } backdrop-blur-xl`}>
      <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>
        📅 {monthName}
      </h3>
      <div className="grid grid-cols-7 gap-1.5">
        {t('smartboard.calendar_days').split('').map(d => (
          <span key={d} className="text-center text-[10px] font-semibold text-[#64748B] py-1">{d}</span>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const status = getDayStatus(d.dateStr, streakLog);
          const hour = getActiveHour(d.dateStr, streakLog);
          return (
            <motion.div
              key={d.dateStr}
              whileHover={{ scale: 1.2 }}
              className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium cursor-default transition-colors ${
                status === 'active'
                  ? 'bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] text-white shadow-sm'
                  : status === 'missed'
                    ? darkMode ? 'bg-[#334155] text-[#64748B]' : 'bg-[#F1F5F9] text-[#94A3B8]'
                    : 'text-transparent'
              }`}
              title={hour ? t('smartboard.connected_at', { day: d.day, hour }) : `${d.day}`}
            >
              {status !== 'future' && d.day}
              {status === 'active' && hour && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-[10px] text-[#64748B]">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4]" /> {t('smartboard.connected')}</span>
        <span className="flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded-full ${darkMode ? 'bg-[#334155]' : 'bg-[#F1F5F9]'}`} /> {t('smartboard.not_connected')}</span>
      </div>
    </motion.div>
  );
};

const PointsChart = ({ pointsHistory, darkMode }) => {
  const dailyPoints = useMemo(() => {
    const map = {};
    pointsHistory.forEach(p => {
      const day = new Date(p.timestamp).toISOString().split('T')[0];
      if (!map[day]) map[day] = 0;
      map[day] += p.points;
    });
    const days = Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
    return days.slice(-14);
  }, [pointsHistory]);

  const maxVal = Math.max(...dailyPoints.map(([, v]) => Math.abs(v)), 1);

  return (
    <motion.div variants={item} className={`rounded-2xl p-5 border transition-colors duration-500 ${
      darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]/50'
    } backdrop-blur-xl`}>
      <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>
        📈 Puntos por día (últimos 14 días)
      </h3>
      <div className="flex items-end gap-1.5 h-32">
        {dailyPoints.map(([day, pts]) => {
          const height = Math.max((Math.abs(pts) / maxVal) * 100, pts === 0 ? 0 : 5);
          const isNeg = pts < 0;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  isNeg ? 'bg-red-400/60' : 'bg-gradient-to-t from-[#66CCCC] to-[#4DA8C4]'
                }`}
                style={{ height: `${height}%`, minHeight: pts === 0 ? 0 : 4 }}
              />
              <span className="text-[8px] text-[#64748B] rotate-45 origin-left whitespace-nowrap">
                {day.slice(5)}
              </span>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#004B63] text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
                {isNeg ? '-' : '+'}{Math.abs(pts)} pts
              </div>
            </div>
          );
        })}
      </div>
      {dailyPoints.length === 0 && (
        <p className="text-xs text-[#64748B] text-center py-8">{t('smartboard.no_points_data')}</p>
      )}
    </motion.div>
  );
};

const PointsHistory = ({ pointsHistory, darkMode }) => {
  const reversed = useMemo(() => [...pointsHistory].reverse().slice(0, 50), [pointsHistory]);
  let balance = pointsHistory.reduce((sum, p) => sum + p.points, 0);

  if (reversed.length === 0) return null;

  return (
    <motion.div variants={item} className={`rounded-2xl p-5 border transition-colors duration-500 ${
      darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]/50'
    } backdrop-blur-xl`}>
      <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>
        💳 Historial de Puntos
      </h3>
      <div className="max-h-64 overflow-y-auto space-y-1">
        {reversed.map((entry, i) => {
          balance -= entry.points;
          const date = new Date(entry.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
          const isNeg = entry.points < 0;
          return (
            <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
              darkMode ? 'hover:bg-[#334155]' : 'hover:bg-[#F8FAFC]'
            }`}>
              <span className={`w-14 flex-shrink-0 ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{date}</span>
              <span className={`flex-1 px-2 truncate ${darkMode ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>{entry.reason}</span>
              <span className={`w-16 text-right font-bold ${isNeg ? 'text-red-400' : 'text-[#66CCCC]'}`}>
                {isNeg ? '' : '+'}{entry.points}
              </span>
              <span className={`w-14 text-right ${darkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{balance}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const SessionLog = ({ sessions, darkMode }) => {
  const recent = useMemo(() => [...sessions].reverse().slice(0, 20), [sessions]);

  if (recent.length === 0) return null;

  return (
    <motion.div variants={item} className={`rounded-2xl p-5 border transition-colors duration-500 ${
      darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]/50'
    } backdrop-blur-xl`}>
      <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>
        🕐 Sesiones Recientes
      </h3>
      <div className="max-h-64 overflow-y-auto space-y-1">
        <div className={`flex items-center justify-between px-3 py-2 text-[10px] font-semibold ${
          darkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'
        }`}>
          <span className="w-16">{t('smartboard.date')}</span>
          <span className="w-16">{t('smartboard.start')}</span>
          <span className="w-14">{t('smartboard.duration')}</span>
          <span className="flex-1 text-right">{t('smartboard.subject')}</span>
        </div>
        {recent.map((s, i) => {
          const start = s.start ? new Date(s.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '-';
          const date = s.date || (s.start ? new Date(s.start).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }) : '-');
          const dur = s.duration ? `${s.duration} min` : '-';
          const subj = s.subject || t('smartboard.general');
          return (
            <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
              darkMode ? 'hover:bg-[#334155]' : 'hover:bg-[#F8FAFC]'
            }`}>
              <span className={`w-16 ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{date}</span>
              <span className={`w-16 ${darkMode ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>{start}</span>
              <span className={`w-14 ${darkMode ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>{dur}</span>
              <span className={`flex-1 text-right truncate ${darkMode ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}>{subj}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const RewardsGrid = ({ unlockedRewards, totalPoints, darkMode }) => {
  return (
    <motion.div variants={item} className={`rounded-2xl p-5 border transition-colors duration-500 ${
      darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]/50'
    } backdrop-blur-xl`}>
      <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>
        🎁 Recompensas
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {REWARDS.map(r => {
          const unlocked = unlockedRewards.includes(r.id);
          const canAfford = totalPoints >= r.cost;
          return (
            <div
              key={r.id}
              className={`rounded-xl p-3 border text-center transition-all ${
                unlocked
                  ? darkMode ? 'bg-[#334155]/50 border-[#66CCCC]/30' : 'bg-[#F0FDF4] border-[#66CCCC]/30'
                  : darkMode ? 'bg-[#1E293B] border-[#334155]/50 opacity-60' : 'bg-[#F8FAFC] border-[#E2E8F0]/50 opacity-60'
              }`}
            >
              <div className="text-2xl mb-1">{r.icon}</div>
              <div className={`text-[11px] font-bold mb-0.5 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>{r.name}</div>
              <div className={`text-[10px] ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{r.cost} pts</div>
              {unlocked && <div className="text-[10px] text-green-500 font-semibold mt-1">{t('smartboard.unlocked')}</div>}
              {!unlocked && canAfford && <div className="text-[10px] text-[#4DA8C4] font-semibold mt-1">{t('smartboard.available')}</div>}
              {!unlocked && !canAfford && (
                <div className="text-[10px] text-[#64748B] mt-1">
                  {t('smartboard.missing_points', { count: r.cost - totalPoints })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const SummaryCard = memo(function SummaryCard({ icon, label, value, sub, color, delay, darkMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', damping: 20, stiffness: 300 }}
      className={`flex-1 min-w-[140px] rounded-2xl p-5 border transition-colors duration-500 ${
        darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]/50'
      } backdrop-blur-xl shadow-sm`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-2xl">{icon}</div>
        <span className={`text-[11px] font-medium ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{label}</span>
      </div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      {sub && <div className={`text-[10px] mt-0.5 ${darkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{sub}</div>}
    </motion.div>
  );
});

const SmartBoardProgress = () => {
  const { t } = useTranslation();
  const {
    totalPoints, pointsHistory, streak, streakLog, sessions,
    totalActiveMinutes, unlockedRewards, darkMode,
  } = useSmartBoardKids();

  const level = getLevel(totalPoints);

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto space-y-5"
      >
        {/* Summary Cards */}
        <div className="flex flex-wrap gap-4">
          <SummaryCard
            icon="🔥" label={t('smartboard.current_streak')}
            value={`${streak.current} ${t('smartboard.days')}`}
            sub={streak.current > 0 ? t('smartboard.record', { days: streak.longest }) : t('smartboard.start_today')}
            color="text-[#FF8E53]" delay={0}
            darkMode={darkMode}
          />
          <SummaryCard
            icon="💎" label={t('smartboard.total_points')}
            value={totalPoints.toLocaleString()}
            sub={t('smartboard.transactions', { count: pointsHistory.length })}
            color="text-[#FFD166]" delay={0.07}
            darkMode={darkMode}
          />
          <SummaryCard
            icon="⏱" label={t('smartboard.active_time_min')}
            value={`${totalActiveMinutes} ${t('smartboard.minutes')}`}
            sub={totalActiveMinutes >= 60 ? `(${(totalActiveMinutes / 60).toFixed(1)} h)` : ''}
            color="text-[#4DA8C4]" delay={0.14}
            darkMode={darkMode}
          />
          <SummaryCard
            icon="🏆" label={t('smartboard.best_streak')}
            value={`${streak.longest} ${t('smartboard.days')}`}
            sub={level.name}
            color="text-[#66CCCC]" delay={0.21}
            darkMode={darkMode}
          />
        </div>

        {/* Level Bar */}
        <motion.div variants={item} className={`rounded-2xl p-5 border transition-colors duration-500 ${
          darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]/50'
        } backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{level.icon}</span>
              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>
                {t('smartboard.level_name', { name: level.name })}
              </span>
            </div>
            {level.next && (
              <span className={`text-[11px] ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                {t('smartboard.points_progress', { current: totalPoints.toLocaleString(), next: level.next.toLocaleString() })}
              </span>
            )}
          </div>
          <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${level.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CalendarMonth streakLog={streakLog} darkMode={darkMode} />
          <PointsChart pointsHistory={pointsHistory} darkMode={darkMode} />
        </div>

        <PointsHistory pointsHistory={pointsHistory} darkMode={darkMode} />
        <SessionLog sessions={sessions} darkMode={darkMode} />
        <RewardsGrid unlockedRewards={unlockedRewards} totalPoints={totalPoints} darkMode={darkMode} />
      </motion.div>
    </div>
  );
};

export default SmartBoardProgress;
