import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIALabStore } from '../../store/ialabStore';
import { useTranslation } from '../../i18n/I18nProvider';
import { getModules } from '../../data/ialab';
import { Icon } from '../../utils/iconMapping.jsx';
import usePersonalizedRecommendations from '../../hooks/IALab/usePersonalizedRecommendations';
import useActivityTracker from '../../hooks/useActivityTracker';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';

const MODULES = [1, 2, 3, 4, 5];
const IDLE_TIMEOUT = 10000;

const moduleColors = { 1: '#4DA8C4', 2: '#66CCCC', 3: '#B2D8E5', 4: '#004B63', 5: '#FFD166' };
const moduleIcons = { 1: 'fa-terminal', 2: 'fa-robot', 3: 'fa-search', 4: 'fa-microphone', 5: 'fa-trophy' };

function BgPattern() {
  return (
    <>
      <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[length:60px_60px]" />
      <div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(77,168,196,0.12)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(0,75,99,0.06)_0%,rgba(255,255,255,0)_70%)]" />
    </>
  );
}

function MiniStat({ icon, label, value, accent, color }) {
  return (
    <div className={`relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 border-t-4 ${accent} rounded-2xl p-4 shadow-sm`}>
      <motion.div whileHover={{ scale: 1.15, rotateY: 8 }} whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 12 }}
        className="inline-block origin-center" style={{ perspective: 600 }}>
        <Icon name={icon} className={`w-5 h-5 ${color} mb-1.5`} />
      </motion.div>
      <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function ModuleRow({ id, title, icon, color, approved, unlocked, score, examScore, challengeScore, onNavigate }) {
  return (
    <motion.div
      whileHover={unlocked ? { x: 4, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 16 }}
      className={`relative flex items-center gap-3 bg-white dark:bg-slate-800 border ${unlocked ? (approved ? 'border-slate-200/60' : 'border-corporate/40 shadow-[0_4px_16px_rgba(0,188,212,0.08)]') : 'border-slate-100'} rounded-xl p-3.5 shadow-sm`}>
      <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full ${unlocked && !approved ? 'bg-gradient-to-b from-petroleum to-corporate' : ''}`} style={{ backgroundColor: !unlocked || approved ? (unlocked ? color : '#cbd5e1') : undefined }} />

      <motion.div
        whileHover={unlocked ? { scale: 1.2, rotateY: 15 } : {}}
        whileTap={unlocked ? { scale: 0.9 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        style={{ perspective: 600 }}
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${unlocked ? 'bg-gradient-to-br from-petroleum/10 to-corporate/10' : 'bg-slate-50'}`}>
        <Icon name={icon} className="w-3.5 h-3.5" style={{ color: unlocked ? color : '#94a3b8' }} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold truncate ${unlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>M{id}: {title}</span>
          {approved && <span className="text-[10px] font-semibold text-petroleum bg-petroleum/[0.05] border border-petroleum/20 px-1.5 py-0.5 rounded-full flex-shrink-0">✔</span>}
        </div>
        {unlocked && !approved && <div className="mt-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: color }} /></div>}
        {approved && <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">{examScore && <span>Examen: {examScore}%</span>}{challengeScore && <span>Desafío: {challengeScore}%</span>}<span className="font-semibold text-petroleum">{score}%</span></div>}
        {!unlocked && <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5"><Icon name="fa-lock" className="w-2.5 h-2.5 text-slate-300" />Completa el módulo anterior</p>}
      </div>

      {unlocked && (
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 500, damping: 12 }}
          onClick={onNavigate}
          className={`flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm ${
            approved ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60' : 'bg-gradient-to-r from-petroleum to-corporate text-white hover:shadow-[0_0_15px_rgba(0,188,212,0.3)]'
          }`}>
          {approved ? 'Revisar' : 'Continuar'}
        </motion.button>
      )}
    </motion.div>
  );
}

export default function IALabDashboard() {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();

  const moduleProgress = useIALabStore(s => s.moduleProgress);
  const xp = useIALabStore(s => s.xp);
  const streak = useIALabStore(s => s.streak);
  const completedExams = useIALabStore(s => s.completedExams);
  const challengeScores = useIALabStore(s => s.challengeScores);
  const courseProgress = useIALabStore(s => s.courseProgress);
  const courseCompleted = useIALabStore(s => s.courseCompleted);

  const { getTimeTrackingStats } = useActivityTracker();
  const { completionForecast } = usePersonalizedRecommendations();
  const paceClass = completionForecast?.pace === 'fast' ? 'text-petroleum bg-petroleum/[0.05] border border-petroleum/20' : completionForecast?.pace === 'moderate' ? 'text-corporate bg-corporate/[0.05] border border-corporate/20' : 'text-slate-500 bg-slate-50 border border-slate-200/50';
  const paceLabel = completionForecast?.pace === 'fast' ? 'Rápido' : completionForecast?.pace === 'moderate' ? 'Moderado' : 'Lento';
  const modulesData = useMemo(() => getModules(locale), [locale]);

  const [activeTab, setActiveTab] = useState('modules');
  const [idlePct, setIdlePct] = useState(0);
  const idleRef = useRef(null);
  const animRef = useRef(null);

  const moduleTitles = useMemo(() => {
    const m = {};
    modulesData.forEach(x => { m[x.id] = x.title; });
    return m;
  }, [modulesData]);

  const stats = useMemo(() => {
    const completed = MODULES.filter(id => {
      const mod = moduleProgress[id];
      return mod?.exam && mod?.challenge && mod?.resourcesCompleted && (mod?.currentScore || 0) >= 80;
    }).length;
    const scores = MODULES.map(id => completedExams[id]).filter(Boolean);
    return {
      completed,
      avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    };
  }, [moduleProgress, completedExams]);

  const modules = useMemo(() =>
    MODULES.map(id => {
      const mod = moduleProgress[id];
      const approved = mod?.exam && mod?.challenge && mod?.resourcesCompleted && (mod?.currentScore || 0) >= 80;
      return {
        id, approved,
        unlocked: id === 1 || mod?.isUnlocked === true,
        score: mod?.currentScore || 0,
        examScore: completedExams[id],
        challengeScore: challengeScores[id],
      };
    }),
    [moduleProgress, completedExams, challengeScores]
  );

  const firstIncomplete = useMemo(() => modules.find(m => m.unlocked && !m.approved) || null, [modules]);
  const activeModuleId = firstIncomplete?.id || 5;
  const suggestedAction = useMemo(() => useIALabStore.getState().getNextSuggestedAction(), [moduleProgress, courseProgress]);

  const hasNoProgress = useMemo(
    () => !moduleProgress[1] || (!moduleProgress[1]?.resourcesCompleted && !moduleProgress[1]?.exam && !moduleProgress[1]?.challenge),
    [moduleProgress]
  );

  const weeklyData = useMemo(() => {
    const startDate = useIALabStore.getState().startDate;
    if (!startDate) return [];
    const start = new Date(startDate);
    const now = new Date();
    const weeks = Math.max(1, Math.ceil((now - start) / (7 * 86400000)));
    const show = Math.min(weeks, 8);
    const avgXp = Math.max(30, Math.round(xp / weeks));
    return Array.from({ length: show }, (_, i) => {
      const idx = show - 1 - i;
      const ws = new Date(start);
      ws.setDate(ws.getDate() + idx * 7);
      return {
        week: ws.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-CO', { day: 'numeric', month: 'short' }),
        xp: Math.max(0, idx === show - 1 ? xp - (show - 1) * avgXp : avgXp),
      };
    });
  }, [xp, locale]);

  const timeStats = useMemo(() => getTimeTrackingStats(), [getTimeTrackingStats]);
  const doNavigate = useCallback(() => {
    if (hasNoProgress) { navigate('/ialab/1'); return; }
    if (suggestedAction?.moduleId) { navigate(`/ialab/${suggestedAction.moduleId}`); return; }
    if (activeModuleId) { navigate(`/ialab/${activeModuleId}`); }
  }, [navigate, hasNoProgress, suggestedAction, activeModuleId]);

  const resetIdle = useCallback(() => {
    setIdlePct(0);
    clearTimeout(idleRef.current);
    clearInterval(animRef.current);
    if (courseCompleted || hasNoProgress) return;
    const start = Date.now();
    animRef.current = setInterval(() => setIdlePct(Math.min(100, ((Date.now() - start) / IDLE_TIMEOUT) * 100)), 100);
    idleRef.current = setTimeout(doNavigate, IDLE_TIMEOUT);
  }, [courseCompleted, hasNoProgress, doNavigate]);
  useEffect(() => {
    resetIdle();
    const evs = ['click', 'touchstart', 'keydown', 'mousemove'];
    evs.forEach(e => window.addEventListener(e, resetIdle));
    return () => {
      evs.forEach(e => window.removeEventListener(e, resetIdle));
      clearTimeout(idleRef.current);
      clearInterval(animRef.current);
    };
  }, [resetIdle]);

  if (hasNoProgress) {
    return (
      <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-6"><BgPattern /><h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate">IALab</h1><p className="text-sm text-slate-500 dark:text-slate-400 -mt-3">{t('route.continue_learning')}</p>
        <section className="relative overflow-hidden bg-gradient-to-br from-petroleum via-petroleum-dark to-[#003549] rounded-2xl p-8 text-center shadow-xl">
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
            <Icon name="fa-rocket" className="w-6 h-6 text-white" />
          </motion.div>
          <h2 className="text-xl font-bold text-white mb-1">¡Bienvenido a IALab!</h2>
          <p className="text-sm text-white/70 mb-5 max-w-md mx-auto">Comienza tu viaje por la inteligencia artificial.</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 14 }}
            onClick={() => navigate('/ialab/1')}
            className="inline-flex items-center gap-2 bg-white text-petroleum font-bold px-7 py-3.5 rounded-xl shadow-lg">
            <Icon name="fa-play-circle" className="w-5 h-5" />
            {t('route.start')}
          </motion.button>
          <div className="grid grid-cols-3 gap-2.5 mt-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-[14px] py-3.5 px-2 text-center border border-white/[0.06]">
              <div className="w-8 h-8 rounded-xl bg-corporate/15 flex items-center justify-center mx-auto mb-1.5">
                <Icon name="fa-star" className="w-3.5 h-3.5 text-corporate" />
              </div>
              <p className="text-lg font-bold text-white leading-tight">0</p>
              <p className="text-[9px] text-white/50 uppercase tracking-wider">XP Ganados</p>
              <p className="text-[7px] text-white/30 mt-0.5">Tu experiencia acumulada</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-[14px] py-3.5 px-2 text-center border border-white/[0.06]">
              <div className="w-8 h-8 rounded-xl bg-petroleum/20 flex items-center justify-center mx-auto mb-1.5">
                <Icon name="fa-fire" className="w-3.5 h-3.5 text-petroleum" />
              </div>
              <p className="text-lg font-bold text-white leading-tight">0</p>
              <p className="text-[9px] text-white/50 uppercase tracking-wider">Racha Actual</p>
              <p className="text-[7px] text-white/30 mt-0.5">Días consecutivos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-[14px] py-3.5 px-2 text-center border border-white/[0.06]">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-1.5">
                <Icon name="fa-chart-line" className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-lg font-bold text-white leading-tight">—</p>
              <p className="text-[9px] text-white/50 uppercase tracking-wider">Score Promedio</p>
              <p className="text-[7px] text-white/30 mt-0.5">Exámenes completados</p>
            </div>
          </div>
        </section>
      </div>
    );
  }
  if (courseCompleted || stats.completed === 5) {
    return (
      <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-6"><BgPattern /><h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate">IALab</h1><p className="text-sm text-slate-500 dark:text-slate-400 -mt-3">{t('route.continue_learning')}</p>
        <section className="relative overflow-hidden bg-gradient-to-br from-petroleum/[0.03] to-corporate/[0.03] rounded-2xl border border-petroleum/10 p-6 sm:p-8 text-center">
          <motion.div animate={{ y: [0, -4, 0], scale: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center mx-auto mb-3 shadow-lg shadow-corporate/30">
            <Icon name="fa-trophy" className="w-6 h-6 text-white" />
          </motion.div>
          <h2 className="text-xl font-bold text-petroleum">{t('route.course_complete')}</h2>
          <p className="text-sm text-petroleum/70 mt-1">Explora otros cursos o certificaciones</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 14 }}
            onClick={() => navigate('/ialab/certificate')}
            className="mt-4 inline-flex items-center gap-2 bg-white text-petroleum font-semibold px-5 py-2.5 rounded-xl border border-petroleum/20 shadow-sm">
            <Icon name="fa-certificate" className="w-4 h-4" />
            {t('route.view_certificate')}
          </motion.button>
          <div className="grid grid-cols-3 gap-2.5 mt-6">
            <div className="bg-white/80 backdrop-blur rounded-[14px] py-3.5 px-2 text-center border border-petroleum/10 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-corporate/15 flex items-center justify-center mx-auto mb-1.5">
                <Icon name="fa-star" className="w-3.5 h-3.5 text-corporate" />
              </div>
              <p className="text-lg font-bold text-petroleum leading-tight">{xp?.toLocaleString() || '0'}</p>
              <p className="text-[9px] text-petroleum/50 uppercase tracking-wider">XP Ganados</p>
              <p className="text-[7px] text-petroleum/30 mt-0.5">Tu experiencia acumulada</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-[14px] py-3.5 px-2 text-center border border-petroleum/10 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-petroleum/20 flex items-center justify-center mx-auto mb-1.5">
                <Icon name="fa-fire" className="w-3.5 h-3.5 text-petroleum" />
              </div>
              <p className="text-lg font-bold text-petroleum leading-tight">{streak || 0}</p>
              <p className="text-[9px] text-petroleum/50 uppercase tracking-wider">Racha Actual</p>
              <p className="text-[7px] text-petroleum/30 mt-0.5">Días consecutivos</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-[14px] py-3.5 px-2 text-center border border-petroleum/10 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-1.5">
                <Icon name="fa-chart-line" className="w-3.5 h-3.5 text-petroleum" />
              </div>
              <p className="text-lg font-bold text-petroleum leading-tight">{stats.avgScore}%</p>
              <p className="text-[9px] text-petroleum/50 uppercase tracking-wider">Score Promedio</p>
              <p className="text-[7px] text-petroleum/30 mt-0.5">Exámenes completados</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex gap-2 mb-3">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 14 }}
              onClick={() => setActiveTab('modules')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                activeTab === 'modules'
                  ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md'
                  : 'bg-slate-100/80 text-slate-500 hover:text-slate-700'
              }`}>
              <Icon name="fa-layer-group" className="w-4 h-4" />
              {t('dashboard.modules_progress', { completed: stats.completed })}
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 14 }}
              onClick={() => setActiveTab('activity')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                activeTab === 'activity'
                  ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md'
                  : 'bg-slate-100/80 text-slate-500 hover:text-slate-700'
              }`}>
              <Icon name="fa-chart-line" className="w-4 h-4" />
              {t('dashboard.activity_trends')}
            </motion.button>
          </div>
          {activeTab === 'modules' && (
            <div className="space-y-2">
              {modules.map((mod, index) => (
                <motion.div key={mod.id} initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}>
                  <ModuleRow key={mod.id} id={mod.id} title={moduleTitles[mod.id]}
                  icon={moduleIcons[mod.id]} color={moduleColors[mod.id]}
                  approved={mod.approved} unlocked={mod.unlocked} score={mod.score}
                  examScore={mod.examScore} challengeScore={mod.challengeScore}
                  onNavigate={() => navigate(`/ialab/${mod.id}`)} />
                </motion.div>
              ))}
            </div>
          )}
          {activeTab === 'activity' && (
            <div className="text-center py-8 text-sm text-slate-400">Completa módulos para ver estadísticas detalladas.</div>
          )}
        </section>
      </div>
    );
  }
  const actionIcon = ({ exam: 'fa-file-text', challenge: 'fa-trophy', resources: 'fa-video', community: 'fa-comments', certificate: 'fa-certificate' })[suggestedAction.action] || 'fa-play-circle';

  const progressBarColor = courseProgress >= 80 ? 'from-petroleum to-corporate' : courseProgress >= 50 ? 'from-corporate to-petroleum' : 'from-petroleum via-petroleum-dark to-corporate';

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-6"><BgPattern /><h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate">IALab</h1><p className="text-sm text-slate-500 dark:text-slate-400 -mt-3">{t('route.continue_learning')}</p>
      {/* ─── Hero Glass 3D Depth + Stats ────────────── */}
      <motion.section whileHover={{ scale: 1.012, rotateY: 1.8 }} whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 350, damping: 16 }}
        style={{ perspective: 800 }} onClick={doNavigate}
        className="relative overflow-hidden bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate rounded-2xl shadow-lg cursor-pointer group">

        {/* Glass orbs flotantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: 'inherit' }}>
          <motion.div animate={{ x: [0, 15, -10, 0], y: [0, -20, 10, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-[15%] -right-[8%] w-[45%] h-[55%] rounded-full bg-corporate/15" style={{ filter: 'blur(80px)' }} />
          <motion.div animate={{ x: [0, -12, 8, 0], y: [0, 15, -20, 0], scale: [1, 0.95, 1.08, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-[12%] -left-[5%] w-[35%] h-[40%] rounded-full bg-petroleum/20" style={{ filter: 'blur(80px)' }} />
          <motion.div animate={{ x: [0, 10, -15, 0], y: [0, -10, 15, 0], scale: [1, 1.05, 0.92, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute top-[30%] left-[40%] w-[25%] h-[30%] rounded-full bg-white/[0.04]" style={{ filter: 'blur(80px)' }} />
        </div>

        {/* Shine sweep */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 55%, transparent 60%)', backgroundSize: '200% 100%' }}>
          <motion.div className="absolute inset-0" style={{ background: 'inherit', backgroundSize: 'inherit' }}
            animate={{ backgroundPosition: ['200% 0', '0% 0', '200% 0'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.05] transition-colors duration-300 pointer-events-none" />

        <div className="relative z-10 px-6 pt-5 pb-5">
          {/* ── Progress ── */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-white/70">
                <Icon name="fa-graduation-cap" className="w-3 h-3" />
                Progreso del curso
              </span>
              <span className="text-xs font-bold text-white bg-white/10 backdrop-blur px-2.5 py-0.5 rounded-full">{courseProgress}%</span>
            </div>
            <div className="h-1 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full rounded-full relative transition-all duration-1000"
                style={{ width: `${courseProgress}%`, background: 'linear-gradient(to right, #00BCD4, #fff)' }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
              </div>
            </div>
          </div>

          {/* ── Action + Timer Ring ── */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.25, rotateY: 20 }} style={{ perspective: 400 }}
                  className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center group-hover:bg-white/25 transition-colors">
                  <Icon name={actionIcon} className="w-5 h-5 text-white" />
                </motion.div>
                <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-1 rounded-[14px] border-2 border-corporate/30 pointer-events-none" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">{suggestedAction.label}</p>
                <p className="text-xs text-white/55 flex items-center gap-1 mt-0.5">
                  <Icon name="fa-arrow-right" className="w-2.5 h-2.5" />
                  {t('route.continue')}
                </p>
              </div>
            </div>

            {/* Timer SVG Ring */}
            <div className="relative w-[52px] h-[52px] flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="absolute inset-0" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(0,188,212,0.7)" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray="138.23" strokeDashoffset={138.23 * (idlePct / 100)} />
              </svg>
              <div className="flex flex-col items-center">
                <Icon name="fa-clock" className="w-2.5 h-2.5 text-white/40" />
                <span className="text-sm font-bold text-white leading-none mt-0.5">{Math.ceil((1 - idlePct / 100) * (IDLE_TIMEOUT / 1000))}s</span>
              </div>
            </div>
          </div>

          {/* ── Stats Glass Bubbles ── */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: 'fa-star', iconBg: 'bg-corporate/15', iconColor: 'text-corporate', value: xp?.toLocaleString() || '0', label: 'XP Ganados', desc: 'Tu experiencia acumulada', delay: 0 },
              { icon: 'fa-fire', iconBg: 'bg-petroleum/20', iconColor: 'text-petroleum', value: streak || 0, label: 'Racha Actual', desc: 'Días consecutivos', delay: 0.08 },
              { icon: 'fa-chart-line', iconBg: 'bg-white/10', iconColor: 'text-white', value: `${stats.avgScore}%`, label: 'Score Promedio', desc: 'Exámenes completados', delay: 0.16 },
            ].map((s, i) => (
              <motion.div key={s.icon} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: s.delay }} whileHover={{ y: -3, scale: 1.03 }}
                className="bg-white/10 backdrop-blur-xl rounded-[14px] py-3.5 px-2 text-center border border-white/[0.06] cursor-default group/stat">
                <div className={`w-8 h-8 rounded-xl ${s.iconBg} flex items-center justify-center mx-auto mb-1.5 transition-transform duration-300 group-hover/stat:scale-110`}>
                  <Icon name={s.icon} className={`w-3.5 h-3.5 ${s.iconColor}`} />
                </div>
                <p className="text-lg font-bold text-white leading-tight">{s.value}</p>
                <p className="text-[9px] text-white/50 uppercase tracking-wider">{s.label}</p>
                <p className="text-[7px] text-white/30 mt-0.5">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── Tabs: Tu Progreso | Actividad ─────────── */}
      <section>
        <div className="flex gap-2 mb-4">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 14 }}
            onClick={() => setActiveTab('modules')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'modules'
                ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md'
                : 'bg-slate-100/80 text-slate-500 hover:text-slate-700'
            }`}>
            <Icon name="fa-layer-group" className="w-4 h-4" />
            {t('dashboard.modules_progress', { completed: stats.completed })}
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 14 }}
            onClick={() => setActiveTab('activity')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'activity'
                ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-md'
                : 'bg-slate-100/80 text-slate-500 hover:text-slate-700'
            }`}>
            <Icon name="fa-chart-line" className="w-4 h-4" />
            {t('dashboard.activity_trends')}
          </motion.button>
        </div>

        {activeTab === 'modules' && (
          <>
            {modules.filter(m => m.score > 0).length >= 2 && (
              <div className="mb-4 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modules.filter(m => m.score > 0)} layout="vertical"
                    margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="id" type="category" width={28} axisLine={false} tickLine={false}
                      tick={({ x, y, payload }) => (
                        <text x={x - 4} y={y} dy={3} textAnchor="end" fontSize={10} fill="#94a3b8">M{payload.value}</text>
                      )} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                      formatter={(value) => [`${value}%`, 'Score']} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={14}>
                      {modules.filter(m => m.score > 0).map(e => (
                        <Cell key={e.id} fill={moduleColors[e.id] || '#00BCD4'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="space-y-2">
              {modules.map((mod, index) => (
                <motion.div key={mod.id} initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}>
                  <ModuleRow id={mod.id} title={moduleTitles[mod.id]}
                    icon={moduleIcons[mod.id]} color={moduleColors[mod.id]}
                    approved={mod.approved} unlocked={mod.unlocked} score={mod.score}
                    examScore={mod.examScore} challengeScore={mod.challengeScore}
                    onNavigate={() => navigate(`/ialab/${mod.id}`)} />
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'activity' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
            {weeklyData.length > 1 && (
              <div className="relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum/40 via-corporate to-petroleum/40 rounded-t-2xl" />
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm">
                    <Icon name="fa-chart-line" className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Tendencia Semanal</span>
                </div>
                <div className="h-48 sm:h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                      <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '12px' }}
                        labelStyle={{ fontWeight: 600, color: '#004B63', marginBottom: 4 }}
                        formatter={(value) => [`${value} XP`, 'XP Semanal']} />
                      <Line type="monotone" dataKey="xp" stroke="#00BCD4" strokeWidth={2.5}
                        dot={{ fill: '#004B63', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, fill: '#00BCD4', stroke: '#004B63', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {completionForecast && (
              <div className="relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-t-2xl" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center shadow-sm">
                      <Icon name="fa-calendar-check" className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Pronóstico de finalización</span>
                  </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${paceClass}`}>{paceLabel}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-petroleum">{completionForecast.estimatedDate.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="text-sm text-slate-400">({completionForecast.daysRemaining} {locale === 'en' ? 'days' : 'días'})</span>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-400">{locale === 'en' ? 'Optimistic' : 'Optimista'}: {completionForecast.optimistic} {locale === 'en' ? 'days' : 'días'}</span>
                  <span className="text-xs text-slate-400">{locale === 'en' ? 'Conservative' : 'Conservador'}: {completionForecast.conservative} {locale === 'en' ? 'days' : 'días'}</span>
                </div>
              </div>
            )}

            {timeStats.totalDaysActive > 0 && (
              <div className="relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-corporate/40 via-petroleum to-corporate/40 rounded-t-2xl" />
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center shadow-sm">
                    <Icon name="fa-clock" className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Resumen de Actividad</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MiniStat icon="fa-calendar-day" label="Hoy" value={`${timeStats.today} act.`} accent="border-t-corporate" color="text-corporate" />
                  <MiniStat icon="fa-calendar-week" label="Esta semana" value={`${timeStats.weekTotal} act.`} accent="border-t-petroleum" color="text-petroleum" />
                  <MiniStat icon="fa-chart-simple" label="Promedio/día" value={`${timeStats.avgPerDay}`} accent="border-t-petroleum" color="text-petroleum" />
                  <MiniStat icon="fa-calendar-alt" label="Días activos" value={`${timeStats.totalDaysActive}`} accent="border-t-corporate" color="text-corporate" />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
