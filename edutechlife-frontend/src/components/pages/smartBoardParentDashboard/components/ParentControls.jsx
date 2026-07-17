import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '../../../../i18n/I18nProvider';

const STORAGE_PREFIX = 'edutechlife';

const loadData = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const getLastActiveText = (lastActive) => {
  if (!lastActive) return '—';
  const diff = Math.floor((Date.now() - new Date(lastActive).getTime()) / 60000);
  if (diff < 1) return 'Ahora';
  if (diff < 60) return `Hace ${diff} min`;
  const hours = Math.floor(diff / 60);
  return `Hace ${hours}h ${diff % 60}min`;
};

const TAB_LABELS = {
  inicio: 'Inicio', materias: 'Materias', curriculo: 'Currículo', libros: 'Libros',
  podcast: 'Podcast', examenes: 'Exámenes', flashcards: 'Flashcards', oral: 'Oral',
  escaner: 'Escáner', vak: 'Diagnóstico VAK', progreso: 'Progreso',
  analitica: 'Analítica', calendario: 'Calendario', misiones: 'Misiones',
  actividades: 'Actividades', noticias: 'Noticias',
};

const TAB_ICONS = {
  inicio: '🏠', materias: '📚', curriculo: '📋', libros: '📖', podcast: '🎙️',
  examenes: '📝', flashcards: '🃏', oral: '🎤', escaner: '📷', vak: '🧠',
  progreso: '📈', analitica: '📊', calendario: '📅', misiones: '🎯',
  actividades: '🎨', noticias: '📰',
};

export const LivePresenceBar = ({ streak, sessions, totalActiveMinutes }) => {
  const currentTab = loadData(`${STORAGE_PREFIX}_current_tab`);
  const lastActivity = loadData(`${STORAGE_PREFIX}_last_activity`);
  const isOnline = lastActivity && (Date.now() - new Date(lastActivity).getTime()) < 600000;
  const todaySessions = sessions.filter(s => {
    const d = new Date(s.start || s.date || s.timestamp);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const todayMinutes = Math.floor(todaySessions.reduce((sum, s) => {
    if (s.duration) return sum + s.duration;
    if (s.start && s.end) return sum + (new Date(s.end) - new Date(s.start)) / 60000;
    return sum + 0;
  }, 0));

  const timeline = todaySessions.slice(-8).map((s, i) => ({
    id: i,
    start: s.start || s.date || s.timestamp,
    label: new Date(s.start || s.date || s.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 border-t-4 border-[#4DA8C4] overflow-hidden relative ${
        isOnline
          ? 'bg-gradient-to-r from-[#4DA8C4]/10 via-[#66CCCC]/5 to-transparent border-x border-b border-[#4DA8C4]/30'
          : 'bg-gradient-to-r from-[#94A3B8]/10 to-transparent border-x border-b border-[#E2E8F0]'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Status + Current Activity */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <motion.span
              animate={{ scale: isOnline ? [1, 1.2, 1] : 1 }}
              transition={{ repeat: isOnline ? Infinity : 0, duration: 2 }}
              className={`text-2xl ${isOnline ? 'opacity-100' : 'opacity-50'}`}
            >{isOnline ? '🟢' : '⚪'}</motion.span>
            <div>
              <span className="text-sm font-bold text-[#004B63]">
                {isOnline ? 'Conectado ahora' : 'Desconectado'}
              </span>
              <p className="text-xs text-[#94A3B8]">
                {isOnline
                  ? `Última actividad: ${getLastActiveText(lastActivity)}`
                  : lastActivity ? `Última conexión: ${new Date(lastActivity).toLocaleString('es-ES')}` : 'Sin actividad registrada'}
              </p>
            </div>
          </div>
          {currentTab && isOnline && (
            <div className="flex items-center gap-2 mt-2 bg-white/50 dark:bg-[#1E293B]/50 rounded-lg px-3 py-1.5 inline-flex">
              <span className="text-base">{TAB_ICONS[currentTab] || '💻'}</span>
              <span className="text-xs font-medium text-[#64748B]">{TAB_LABELS[currentTab] || currentTab}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-4 md:gap-6 flex-wrap">
          <div className="text-center min-w-[60px]">
            <p className="text-lg font-black text-[#4DA8C4]">{todaySessions.length}</p>
            <p className="text-[9px] text-[#94A3B8] uppercase tracking-wider">Sesiones hoy</p>
          </div>
          <div className="text-center min-w-[60px]">
            <p className="text-lg font-black text-[#66CCCC]">{todayMinutes > 0 ? `${todayMinutes}min` : '—'}</p>
            <p className="text-[9px] text-[#94A3B8] uppercase tracking-wider">Tiempo activo</p>
          </div>
          <div className="text-center min-w-[60px]">
            <p className="text-lg font-black text-[#FFD166]">{streak?.current || 0} 🔥</p>
            <p className="text-[9px] text-[#94A3B8] uppercase tracking-wider">Racha</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {timeline.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#E2E8F0]/50">
          <div className="flex items-center gap-1.5">
            {timeline.map((t, i) => (
              <div key={t.id} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#4DA8C4]" />
                <span className="text-[9px] text-[#94A3B8] whitespace-nowrap">{t.label}</span>
                {i < timeline.length - 1 && <div className="w-4 h-px bg-[#E2E8F0]" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const ActivityLog = ({ history, streak, subjects, liveActivities = [], newActivityPulse = false }) => {
  const { t } = useTranslation();
  const recent = history.slice(-20).reverse();

  const alerts = [];
  const todayPoints = history.filter(e => {
    const d = new Date(e.timestamp);
    return d.toDateString() === new Date().toDateString();
  }).reduce((s, e) => s + e.points, 0);

  if (streak?.current > 0) alerts.push({ type: 'streak', emoji: '🔥', text: `${streak.current} días seguidos!` });
  if (todayPoints > 0) alerts.push({ type: 'points', emoji: '💎', text: `Hoy: +${todayPoints} puntos` });
  if (subjects?.filter(s => s.progress === 0).length > 2) alerts.push({ type: 'explore', emoji: '🧭', text: 'Materias sin explorar' });

  return (
    <div className="space-y-4">
      {/* Live Activities */}
      {liveActivities.length > 0 && (
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ scale: newActivityPulse ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.5 }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="text-xs font-bold text-green-700">En vivo</span>
          </div>
          <div className="space-y-1.5">
            {liveActivities.map((a, i) => (
              <div key={a.id || i} className="flex items-center justify-between text-xs">
                <span className="text-green-800 truncate">{a.title || a.activity_type || 'Actividad'}</span>
                <span className="text-green-600">
                  {new Date(a.created_at || a.completed_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
        <h3 className="text-sm font-bold text-[#004B63] mb-4">{t('smartboard.recent_activity')}</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {recent.length === 0 && (
            <p className="text-xs text-[#94A3B8] text-center py-4">Sin actividad registrada</p>
          )}
          {recent.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center justify-between py-1.5 border-b border-[#F8FAFC] last:border-0"
            >
              <span className="text-xs text-[#64748B] truncate mr-2">{entry.reason}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-bold ${entry.points > 0 ? 'text-[#66CCCC]' : 'text-[#FF6B9D]'}`}>
                  {entry.points > 0 ? '+' : ''}{entry.points}
                </span>
                <span className="text-[10px] text-[#CBD5E1]">
                  {new Date(entry.timestamp).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Smart Alerts */}
      {alerts.length > 0 && (
        <div className="bg-gradient-to-r from-[#FFD166]/10 to-[#FF8E53]/10 rounded-xl p-4 border border-[#FFD166]/30">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#FFD166]" />
            <h3 className="text-sm font-bold text-[#004B63]">{t('smartboard.parent_alert_title')}</h3>
          </div>
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span>{a.emoji}</span>
                <span className="text-[#64748B] text-xs">{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
