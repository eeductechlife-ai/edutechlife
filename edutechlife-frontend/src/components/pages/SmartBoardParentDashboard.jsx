import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Award, Clock, Brain, Calendar, Trophy } from 'lucide-react';

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

const StatCard = ({ icon, label, value, color, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm"
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
      <h3 className="text-sm font-bold text-[#004B63] mb-4">📈 Puntos Últimos 14 Días</h3>
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

const ActivityLog = ({ history }) => {
  const recent = history.slice(-20).reverse();
  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
      <h3 className="text-sm font-bold text-[#004B63] mb-4">📜 Actividad Reciente</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
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
  );
};

const SmartBoardParentDashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({ points: 0, history: [], vakResult: null, minutes: 0, missions: [], subjects: [], events: [] });

  useEffect(() => {
    const points = parseInt(localStorage.getItem(`${STORAGE_PREFIX}_points_student`) || '0', 10);
    const history = loadData(`${STORAGE_PREFIX}_points_history_student`) || [];
    const vakResult = loadData(`${STORAGE_PREFIX}_vak_student`);
    const minutes = parseInt(localStorage.getItem(`${STORAGE_PREFIX}_minutes_student`) || '0', 10);
    const missions = loadData('edutechlife_missions') || [];
    const subjects = loadData('edutechlife_subjects') || [];
    const events = loadData(`${STORAGE_PREFIX}_calendar_student`) || [];
    setData({ points, history, vakResult, minutes, missions, subjects, events });

    const interval = setInterval(() => {
      const updated = parseInt(localStorage.getItem(`${STORAGE_PREFIX}_points_student`) || '0', 10);
      setData(prev => ({ ...prev, points: updated }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const level = LEVELS.find(l => data.points >= l.min) || LEVELS[LEVELS.length - 1];
  const completedMissions = data.missions.filter(m => m.completed).length;
  const totalMissions = data.missions.length;
  const averageProgress = data.subjects.length > 0
    ? Math.round(data.subjects.reduce((s, sub) => s + sub.progress, 0) / data.subjects.length)
    : 0;

  const totalEarned = useMemo(
    () => data.history.filter(e => e.points > 0).reduce((s, e) => s + e.points, 0),
    [data.history]
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={() => navigate('/smartboard')}
            className="flex items-center gap-2 text-[#64748B] hover:text-[#004B63] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver al Dashboard</span>
          </button>
          <h1 className="text-3xl font-black text-[#004B63]">Panel para Padres</h1>
          <p className="text-[#64748B] mt-1">Progreso y actividad de tu hijo en SmartBoard</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Trophy className="w-5 h-5 text-[#FFD166]" />} label="Puntos" value={data.points.toLocaleString()} color="#FFD166" subtitle={`${level.emoji} ${level.name}`} />
          <StatCard icon={<Award className="w-5 h-5 text-[#4DA8C4]" />} label="Misiones" value={`${completedMissions}/${totalMissions}`} color="#4DA8C4" subtitle={`${totalMissions - completedMissions} pendientes`} />
          <StatCard icon={<Clock className="w-5 h-5 text-[#66CCCC]" />} label="Tiempo activo" value={`${data.minutes} min`} color="#66CCCC" subtitle={`${Math.floor(data.minutes / 60)}h en total`} />
          <StatCard icon={<TrendingUp className="w-5 h-5" style={{ color: '#B2D8E5' }} />} label="Progreso" value={`${averageProgress}%`} color="#B2D8E5" subtitle="promedio materias" />
        </div>

        {data.vakResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#4DA8C4]/10 to-[#66CCCC]/10 rounded-xl p-5 border border-[#4DA8C4]/20 mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-[#4DA8C4]" />
              <h3 className="font-bold text-[#004B63]">Perfil VAK</h3>
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
            <p className="text-sm text-[#4DA8C4] mt-3 font-semibold">
              Estilo predominante: {data.vakResult.predominantStyle}
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <PointsChart history={data.history} />
          <ActivityLog history={data.history} />
        </div>

        {data.events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-5 border border-[#E2E8F0]"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#FF6B9D]" />
              <h3 className="text-sm font-bold text-[#004B63]">Próximos Eventos ({data.events.length})</h3>
            </div>
            <div className="space-y-2">
              {data.events.slice(-5).reverse().map((event, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-[#94A3B8]">{new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                  <span className="font-medium text-[#004B63]">{event.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="text-center mt-8">
          <p className="text-xs text-[#94A3B8]">
            Los datos se actualizan automáticamente cada 5 segundos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartBoardParentDashboard;
