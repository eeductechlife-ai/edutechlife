import { motion } from 'framer-motion';
import {
  ChevronLeft,
  TrendingUp,
  Target,
  Clock,
  Star,
  Trophy,
  Rocket,
  Gem,
  Flame,
  Brain,
  Timer,
  Compass,
  BookOpen,
  Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSmartBoardStats } from '../../hooks/useSmartBoardStats';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const LOGRO_ICONS = {
  Trophy,
  Rocket,
  Gem,
  Clock,
  Flame,
  Brain,
  Timer,
  Star,
  Target,
  Compass,
  BookOpen,
};

const SmartBoardStatsPage = () => {
  const navigate = useNavigate();
  const stats = useSmartBoardStats();

  const {
    progresoGeneral,
    misiones,
    tiempoEstudio,
    puntuacion,
    nivel,
    puntos,
    materias,
    actividadSemanal,
    logros,
    racha,
    isLive,
  } = stats;

  const misionesPct = misiones.total > 0
    ? Math.round((misiones.completadas / misiones.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light via-white to-[#F1F5F9] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <button
              onClick={() => navigate('/smartboard/app')}
              className="text-primary-light hover:text-mint flex items-center gap-2 transition-colors mb-2"
              aria-label="Volver a SmartBoard"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver a SmartBoard
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-petroleum">
                Estadísticas SmartBoard
              </h1>
              {isLive && (
                <span className="badge-clay inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  En vivo
                </span>
              )}
            </div>
            <p className="text-text-sub mt-2">
              Progreso, rendimiento y actividad en la plataforma educativa
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge-clay flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-light/10 text-primary-light text-xs font-semibold">
              <Award className="w-3 h-3" />
              Nivel {nivel}
            </span>
            <span className="text-text-sub text-sm font-medium">{puntos} pts</span>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Progreso General */}
          <motion.div
            variants={cardVariants}
            className="card-clay-white bg-white rounded-2xl border border-slate-200/60 shadow-premium p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-petroleum">Progreso General</h3>
              <div className="w-12 h-12 bg-primary-light/10 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-light" />
              </div>
            </div>
            <div className="text-4xl font-bold text-petroleum mb-2">
              {progresoGeneral}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progresoGeneral}%` }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                className="h-2.5 rounded-full bg-gradient-to-r from-primary-light to-mint"
              />
            </div>
            {racha.current > 0 && (
              <p className="text-text-sub text-sm mt-2 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Racha de {racha.current} días
              </p>
            )}
          </motion.div>

          {/* Misiones */}
          <motion.div
            variants={cardVariants}
            className="card-clay-white bg-white rounded-2xl border border-slate-200/60 shadow-premium p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-petroleum">Misiones</h3>
              <div className="w-12 h-12 bg-mint/10 rounded-2xl flex items-center justify-center">
                <Target className="w-5 h-5 text-mint" />
              </div>
            </div>
            <div className="text-4xl font-bold text-petroleum mb-2">
              {misiones.completadas}/{misiones.total}
            </div>
            <p className="text-text-sub text-sm">{misionesPct}% completadas</p>
          </motion.div>

          {/* Tiempo de Estudio */}
          <motion.div
            variants={cardVariants}
            className="card-clay-white bg-white rounded-2xl border border-slate-200/60 shadow-premium p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-petroleum">Tiempo de Estudio</h3>
              <div className="w-12 h-12 bg-[#FF6B9D]/10 rounded-2xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FF6B9D]" />
              </div>
            </div>
            <div className="text-4xl font-bold text-petroleum mb-2">
              {tiempoEstudio.horas}h
            </div>
            <p className="text-text-sub text-sm">
              {tiempoEstudio.totalMinutos} minutos en total
            </p>
          </motion.div>

          {/* Puntuación */}
          <motion.div
            variants={cardVariants}
            className="card-clay-white bg-white rounded-2xl border border-slate-200/60 shadow-premium p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-petroleum">Puntuación</h3>
              <div className="w-12 h-12 bg-[#FFD166]/10 rounded-2xl flex items-center justify-center">
                <Star className="w-5 h-5 text-[#FFD166]" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-petroleum">
                {puntuacion.valor}
              </span>
              <span className="text-text-sub text-lg">/{puntuacion.max}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="badge-clay inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-light/10 text-primary-light text-xs font-semibold">
                <Award className="w-3 h-3" />
                Nivel {nivel}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Progreso por Materia */}
          <motion.div
            variants={cardVariants}
            className="card-clay-white bg-white rounded-2xl border border-slate-200/60 shadow-premium p-6"
          >
            <h3 className="text-lg font-semibold text-petroleum mb-6">
              Progreso por Materia
            </h3>
            <div className="space-y-4">
              {materias.map((m) => (
                <div key={m.nombre} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-petroleum font-medium">{m.nombre}</span>
                    <span className="text-text-sub">{m.progreso}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.progreso}%` }}
                      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                      className="h-2.5 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                  </div>
                </div>
              ))}
              {materias.length === 0 && (
                <p className="text-text-sub text-sm text-center py-8">
                  No hay materias registradas aún
                </p>
              )}
            </div>
          </motion.div>

          {/* Actividad Semanal */}
          <motion.div
            variants={cardVariants}
            className="card-clay-white bg-white rounded-2xl border border-slate-200/60 shadow-premium p-6"
          >
            <h3 className="text-lg font-semibold text-petroleum mb-6">
              Actividad Semanal
            </h3>
            <div className="h-64 flex items-end gap-3">
              {actividadSemanal.map((item) => (
                <div key={item.dia} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.altura}%` }}
                    transition={{
                      duration: 0.6,
                      delay: 0.15,
                      ease: 'easeOut',
                    }}
                    className="w-full bg-gradient-to-t from-primary-light to-mint rounded-t-lg relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-petroleum text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {item.minutos}m
                    </div>
                  </motion.div>
                  <div className="text-xs text-text-sub mt-2">{item.dia}</div>
                  <div className="text-xs font-medium text-petroleum mt-1">
                    {item.minutos}m
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Logros */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={cardVariants}
            className="card-clay-white bg-white rounded-2xl border border-slate-200/60 shadow-premium p-6"
          >
            <h3 className="text-lg font-semibold text-petroleum mb-6">
              Logros y Reconocimientos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {logros.map((logro) => {
                const IconComp = LOGRO_ICONS[logro.icon] || BookOpen;
                const isLocked = logro.icon === 'Lock';
                return (
                  <div
                    key={logro.title}
                    className="text-center p-4 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                        isLocked
                          ? 'bg-slate-100'
                          : 'bg-primary-light/10'
                      }`}
                    >
                      <IconComp
                        className={`w-5 h-5 ${
                          isLocked ? 'text-slate-300' : 'text-primary-light'
                        }`}
                      />
                    </div>
                    <div
                      className={`font-medium text-sm ${
                        isLocked ? 'text-slate-400' : 'text-petroleum'
                      }`}
                    >
                      {logro.title}
                    </div>
                    <div className="text-xs text-text-sub mt-1">
                      {logro.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SmartBoardStatsPage;
