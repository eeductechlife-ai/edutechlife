import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/react';
import { ArrowLeft, TrendingUp, Award, Clock, Brain, Calendar, Trophy, Zap, Activity, BarChart3, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nProvider';
import { createClerkSupabaseClient } from '../../lib/supabase';

const STORAGE_PREFIX = 'edutechlife';

const loadData = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const LEVELS = [
  { min: 5000, name: 'Maestro', emoji: '🏆', color: '#FFD166' },
  { min: 2500, name: 'Experto', emoji: '⭐', color: '#4DA8C4' },
  { min: 1000, name: 'Avanzado', emoji: '📚', color: '#66CCCC' },
  { min: 500, name: 'Intermedio', emoji: '🌟', color: '#B2D8E5' },
  { min: 0, name: 'Principiante', emoji: '🌱', color: '#66CCCC' },
];

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

const LivePresenceBar = ({ streak, sessions, totalActiveMinutes, darkMode }) => {
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

const StatCard = ({ icon, label, value, color, subtitle }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <span className="text-sm text-[#64748B]">{label}</span>
    </div>
    <p className="text-2xl font-black text-[#004B63]">{value}</p>
    {subtitle && <p className="text-xs text-[#94A3B8] mt-1">{subtitle}</p>}
  </motion.div>
);

const PointsChart = ({ history }) => {
  const { t } = useTranslation();
  const chartData = useMemo(() => {
    const daily = {};
    history.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString('es-ES');
      daily[date] = (daily[date] || 0) + entry.points;
    });
    return Object.entries(daily).slice(-14).map(([date, points]) => ({ date, points }));
  }, [history]);

  if (chartData.length === 0) return null;

  const maxPoints = Math.max(...chartData.map(d => d.points), 1);

  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
      <h3 className="text-sm font-bold text-[#004B63] mb-4">{t('smartboard.chart_last_14')}</h3>
      <div className="flex items-end gap-2 h-32">
        {chartData.map((day, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${(day.points / maxPoints) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.03 }}
            className="flex-1 rounded-t-md relative group"
            style={{ backgroundColor: day.points > 0 ? '#4DA8C4' : '#E2E8F0', minHeight: day.points > 0 ? 4 : 2 }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#4DA8C4] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              +{day.points}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {chartData.filter((_, i) => i % 3 === 0 || i === chartData.length - 1).map((day, i) => (
          <span key={i} className="text-[9px] text-[#94A3B8]">{day.date.slice(0, 5)}</span>
        ))}
      </div>
    </div>
  );
};

const SubjectProgress = ({ subjects }) => {
  const active = subjects.filter(s => s.progress > 0);
  if (active.length === 0) return null;
  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
      <h3 className="text-sm font-bold text-[#004B63] mb-4">Progreso por materia</h3>
      <div className="space-y-3">
        {active.map(sub => (
          <div key={sub.id}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#64748B]">{sub.icon} {sub.name}</span>
              <span className="font-bold text-[#004B63]">{sub.progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: sub.color || '#4DA8C4' }}
                initial={{ width: 0 }}
                animate={{ width: `${sub.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActivityLog = ({ history, streak, subjects, liveActivities = [], newActivityPulse = false }) => {
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

const SmartBoardParentDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId, getToken, isLoaded } = useAuth();

  const [data, setData] = useState({
    points: 0, history: [], vakResult: null, minutes: 0,
    missions: [], subjects: [], events: [], streak: { current: 0, longest: 0, lastActive: null },
    sessions: [],
  });
  const [liveActivities, setLiveActivities] = useState([]);
  const [newActivityPulse, setNewActivityPulse] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      navigate('/login');
      return;
    }

    const suffix = `_${userId}`;

    const loadParentData = () => {
      const points = parseInt(localStorage.getItem(`${STORAGE_PREFIX}_points${suffix}`) || '0', 10);
      const history = loadData(`${STORAGE_PREFIX}_points_history${suffix}`) || [];
      const vakResult = loadData(`${STORAGE_PREFIX}_vak${suffix}`);
      const minutes = parseInt(localStorage.getItem(`${STORAGE_PREFIX}_minutes${suffix}`) || '0', 10);
      const missions = loadData(`${STORAGE_PREFIX}_missions${suffix}`) || [];
      const subjects = loadData(`${STORAGE_PREFIX}_subjects${suffix}`) || [];
      const events = loadData(`${STORAGE_PREFIX}_calendar${suffix}`) || [];
      const streak = loadData(`${STORAGE_PREFIX}_streak${suffix}`) || { current: 0, longest: 0, lastActive: null };
      const sessions = loadData(`${STORAGE_PREFIX}_sessions${suffix}`) || [];
      return { points, history, vakResult, minutes, missions, subjects, events, streak, sessions };
    };

    const update = () => setData(loadParentData());
    update();

    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [userId, isLoaded, navigate, getToken]);

  useEffect(() => {
    if (!isLoaded || !userId || !getToken) return;

    let channel;
    let supabaseClient;

    const setupRealtime = async () => {
      try {
        const token = await getToken();
        supabaseClient = createClerkSupabaseClient(token);

        channel = supabaseClient
          .channel('parent-activity-live')
          .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'activity_log', filter: `user_id=eq.${userId}` },
            (payload) => {
              const activity = payload.new;
              setLiveActivities(prev => {
                const updated = [activity, ...prev];
                return updated.slice(0, 10);
              });
              setNewActivityPulse(true);
              setTimeout(() => setNewActivityPulse(false), 2000);
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('[ParentDashboard] Realtime not available:', err.message);
      }
    };

    setupRealtime();

    return () => {
      if (channel && supabaseClient) {
        supabaseClient.removeChannel(channel);
      }
    };
  }, [isLoaded, userId, getToken]);

  const level = LEVELS.find(l => data.points >= l.min) || LEVELS[LEVELS.length - 1];
  const completedMissions = data.missions.filter(m => m.completed).length;
  const totalMissions = data.missions.length;
  const averageProgress = data.subjects.length > 0
    ? Math.round(data.subjects.reduce((s, sub) => s + sub.progress, 0) / data.subjects.length)
    : 0;

  const kpiVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const kpiItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] border-t-4 border-[#004B63]">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <button
            onClick={() => navigate('/smartboard')}
            className="flex items-center gap-2 text-[#64748B] hover:text-[#004B63] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{t('smartboard.back_dashboard')}</span>
          </button>
          <h1 className="text-3xl font-black text-[#004B63]">{t('smartboard.parent_panel')}</h1>
          <p className="text-[#64748B] mt-1">{t('smartboard.parent_desc')}</p>
        </motion.div>

        {/* Live Presence */}
        <div className="mb-6">
          <LivePresenceBar streak={data.streak} sessions={data.sessions} totalActiveMinutes={data.minutes} />
        </div>

        {/* KPI Cards */}
        <motion.div
          variants={kpiVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
        >
          {[
            { icon: <Trophy className="w-5 h-5 text-[#FFD166]" />, label: "Puntos", value: data.points.toLocaleString(), color: "#FFD166", subtitle: `${level.emoji} ${level.name}` },
            { icon: <Award className="w-5 h-5 text-[#4DA8C4]" />, label: "Misiones", value: `${completedMissions}/${totalMissions}`, color: "#4DA8C4", subtitle: `${totalMissions - completedMissions} pendientes` },
            { icon: <Clock className="w-5 h-5 text-[#66CCCC]" />, label: "Tiempo activo", value: `${data.minutes} min`, color: "#66CCCC", subtitle: `${Math.floor(data.minutes / 60)}h totales` },
            { icon: <TrendingUp className="w-5 h-5" style={{ color: '#B2D8E5' }} />, label: "Progreso", value: `${averageProgress}%`, color: "#B2D8E5", subtitle: "Promedio" },
            { icon: <Zap className="w-5 h-5 text-[#FF6B9D]" />, label: "Racha", value: `${data.streak?.current || 0} 🔥`, color: "#FF6B9D", subtitle: data.streak?.current > 0 ? `Máx: ${data.streak.longest}` : 'Sin racha' },
            { icon: <BarChart3 className="w-5 h-5 text-[#A855F7]" />, label: "Materias", value: `${data.subjects.filter(s => s.progress > 0).length}/${data.subjects.length}`, color: "#A855F7", subtitle: "Activas" },
          ].map((stat, i) => (
            <motion.div key={i} variants={kpiItemVariants}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* VAK Profile */}
        {data.vakResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#4DA8C4]/10 to-[#66CCCC]/10 rounded-xl p-5 border border-[#4DA8C4]/20 mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-[#4DA8C4]" />
              <h3 className="font-bold text-[#004B63]">{t('smartboard.vak_profile')}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(data.vakResult.scores || {}).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#64748B] capitalize">{key}</span>
                    <span className="font-bold text-[#004B63]">{value}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: key === 'visual' ? '#4DA8C4' : key === 'auditivo' ? '#66CCCC' : '#FFD166',
                        width: `${value}%`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {data.vakResult.predominantStyle && (
              <p className="text-sm text-[#4DA8C4] mt-3 font-semibold">
                {t('smartboard.predominant_style', { style: data.vakResult.predominantStyle })}
              </p>
            )}
          </motion.div>
        )}

        {/* Analytics + Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PointsChart history={data.history} />
          <SubjectProgress subjects={data.subjects} />
        </div>

        {/* Activity + Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
          <ActivityLog history={data.history} streak={data.streak} subjects={data.subjects} liveActivities={liveActivities} newActivityPulse={newActivityPulse} />
          <div>
            {/* Sessions Today */}
            <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
              <h3 className="text-sm font-bold text-[#004B63] mb-4">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#4DA8C4]" />
                  Sesiones de hoy
                </span>
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.sessions.filter(s => {
                  const d = new Date(s.start || s.date || s.timestamp);
                  return d.toDateString() === new Date().toDateString();
                }).length === 0 && (
                  <p className="text-xs text-[#94A3B8] text-center py-4">No hay sesiones registradas hoy</p>
                )}
                {data.sessions.filter(s => {
                  const d = new Date(s.start || s.date || s.timestamp);
                  return d.toDateString() === new Date().toDateString();
                }).reverse().slice(0, 10).map((s, i) => {
                  const start = new Date(s.start || s.date || s.timestamp);
                  const duration = s.duration || (s.end ? Math.floor((new Date(s.end) - start) / 60000) : 0);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between py-2 border-b border-[#F8FAFC] last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#66CCCC]" />
                        <span className="text-xs text-[#64748B]">
                          {start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-[#004B63]">
                        {duration > 0 ? `${duration} min` : 'En curso'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Calendar Events */}
            {data.events.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-[#FF6B9D]" />
                  <h3 className="text-sm font-bold text-[#004B63]">{t('smartboard.upcoming_events', { count: data.events.length })}</h3>
                </div>
                <div className="space-y-2">
                  {data.events.slice(-5).reverse().map((event, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-[#94A3B8]">{new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                      <span className="font-medium text-[#004B63]">{event.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-[#94A3B8]">
            {t('smartboard.auto_update')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartBoardParentDashboard;
