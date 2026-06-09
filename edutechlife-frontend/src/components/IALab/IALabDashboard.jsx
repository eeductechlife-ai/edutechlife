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

function TimerBar({ pct }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/30 dark:bg-slate-700/30">
      <div className="h-full bg-white/50 rounded-full transition-all duration-100 ease-linear" style={{ width: `${pct}%` }} />
    </div>
  );
}

function ModuleRow({ id, title, icon, color, approved, unlocked, score, examScore, challengeScore, onNavigate }) {
  return (
    <div className={`relative flex items-center gap-3 bg-white dark:bg-slate-800 border ${unlocked ? 'border-slate-200/60' : 'border-slate-100'} rounded-xl p-3.5 transition-all duration-200 shadow-sm ${unlocked ? 'hover:shadow-md' : ''}`}>
      <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full" style={{ backgroundColor: unlocked ? color : '#cbd5e1' }} />

      <motion.div
        whileHover={{ scale: 1.2, rotateZ: 5 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${unlocked ? 'bg-gradient-to-br from-petroleum/10 to-corporate/10' : 'bg-slate-50'}`}>
        <Icon name={icon} className="w-3.5 h-3.5" style={{ color: unlocked ? color : '#94a3b8' }} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold truncate ${unlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
            M{id}: {title}
          </span>
          {approved && (
            <span className="text-[10px] font-semibold text-petroleum bg-petroleum/[0.05] border border-petroleum/20 px-1.5 py-0.5 rounded-full flex-shrink-0">
              ✔
            </span>
          )}
        </div>

        {unlocked && !approved && (
          <div className="mt-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${score}%`, backgroundColor: color }} />
          </div>
        )}
        {approved && (
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
            {examScore && <span>Examen: {examScore}%</span>}
            {challengeScore && <span>Desafío: {challengeScore}%</span>}
            <span className="font-semibold text-petroleum">{score}%</span>
          </div>
        )}
        {!unlocked && (
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Icon name="fa-lock" className="w-2.5 h-2.5 text-slate-300" />
            Completa el módulo anterior
          </p>
        )}
      </div>

      {unlocked && (
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 500, damping: 12 }}
          onClick={onNavigate}
          className={`flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-xl ${
            approved
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
              : 'bg-gradient-to-r from-petroleum to-corporate text-white hover:shadow-[0_0_15px_rgba(0,188,212,0.2)] shadow-sm'
          }`}>
          {approved ? 'Revisar' : 'Continuar'}
        </motion.button>
      )}
    </div>
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
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-corporate/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
            <Icon name="fa-rocket" className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">¡Bienvenido a IALab!</h2>
          <p className="text-sm text-white/70 mb-5 max-w-md mx-auto">Comienza tu viaje por la inteligencia artificial. Aprende prompts, ChatGPT, búsqueda profunda y más.</p>
          <button onClick={() => navigate('/ialab/1')} className="inline-flex items-center gap-2 bg-white text-petroleum font-bold px-7 py-3.5 rounded-xl hover:bg-slate-50 hover:scale-[1.03] active:scale-[0.96] transition-all shadow-lg">
            <Icon name="fa-play-circle" className="w-5 h-5" />
            {t('route.start')}
          </button>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <MiniStat icon="fa-star" label="XP" value="0" accent="border-t-corporate" color="text-corporate" />
          <MiniStat icon="fa-fire" label={t('streak.days')} value="0" accent="border-t-petroleum" color="text-petroleum" />
          <MiniStat icon="fa-chart-line" label="Score" value="—" accent="border-t-petroleum" color="text-petroleum" />
        </section>

        <p className="text-center text-sm text-slate-400 py-8">Comienza el Módulo 1 para ver tu progreso aquí.</p>
      </div>
    );
  }
  if (courseCompleted || stats.completed === 5) {
    return (
      <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-6"><BgPattern /><h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate">IALab</h1><p className="text-sm text-slate-500 dark:text-slate-400 -mt-3">{t('route.continue_learning')}</p>
        <section className="relative overflow-hidden bg-gradient-to-br from-petroleum/[0.03] to-corporate/[0.03] rounded-2xl border border-petroleum/10 p-6 sm:p-8 text-center">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-petroleum/[0.05] rounded-full blur-3xl" />
          <motion.div
            animate={{ y: [0, -4, 0], scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center mx-auto mb-3 shadow-lg shadow-corporate/30">
            <Icon name="fa-trophy" className="w-6 h-6 text-white" />
          </motion.div>
          <h2 className="text-xl font-bold text-petroleum dark:text-petroleum">{t('route.course_complete')}</h2>
          <p className="text-sm text-petroleum/70 mt-1">Explora otros cursos o certificaciones</p>
          <button onClick={() => navigate('/ialab/certificate')} className="mt-4 inline-flex items-center gap-2 bg-white text-petroleum font-semibold px-5 py-2.5 rounded-xl border border-petroleum/20 hover:bg-petroleum/[0.03] hover:scale-[1.03] active:scale-[0.96] transition-all shadow-sm">
            <Icon name="fa-certificate" className="w-4 h-4" />
            {t('route.view_certificate')}
          </button>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <MiniStat icon="fa-star" label="XP" value={xp?.toLocaleString() || '0'} accent="border-t-corporate" color="text-corporate" />
          <MiniStat icon="fa-fire" label={t('streak.days')} value={`${streak || 0}`} accent="border-t-petroleum" color="text-petroleum" />
          <MiniStat icon="fa-chart-line" label="Score Promedio" value={`${stats.avgScore}%`} accent="border-t-petroleum" color="text-petroleum" />
        </section>

        <section>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit mb-3">
            <button onClick={() => setActiveTab('modules')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.96] ${
                activeTab === 'modules'
                  ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}>
              {t('dashboard.modules_progress', { completed: stats.completed })}
            </button>
            <button onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.96] ${
                activeTab === 'activity'
                  ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}>
              {t('dashboard.activity_trends')}
            </button>
          </div>
          {activeTab === 'modules' && (
            <div className="space-y-2">
              {modules.map(mod => (
                <ModuleRow key={mod.id} id={mod.id} title={moduleTitles[mod.id]}
                  icon={moduleIcons[mod.id]} color={moduleColors[mod.id]}
                  approved={mod.approved} unlocked={mod.unlocked} score={mod.score}
                  examScore={mod.examScore} challengeScore={mod.challengeScore}
                  onNavigate={() => navigate(`/ialab/${mod.id}`)} />
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
      {/* ─── Hero Continue (full card clickable) ────── */}
      <section onClick={doNavigate} className="relative overflow-hidden bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-2xl shadow-lg cursor-pointer group">
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.05] transition-colors duration-300" />
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/[0.06] rounded-full blur-3xl" />

        <div className="px-6 pt-5 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-white/70">Progreso del curso</span>
            <span className="text-xs font-bold text-white">{courseProgress}%</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${progressBarColor} rounded-full transition-all duration-1000`} style={{ width: `${courseProgress}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between px-6 pb-5 pt-2">
          <div className="flex items-center gap-3">
            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.15, rotateY: 15 }}
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/30 transition-colors" style={{ perspective: 800 }}>
              <Icon name={actionIcon} className="w-5 h-5 text-white" />
            </motion.div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">{suggestedAction.label}</p>
              <p className="text-xs text-white/60">{t('route.continue')}</p>
            </div>
          </div>
          <Icon name="fa-arrow-right" className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-1 flex justify-end pointer-events-none">
          <span className="text-[10px] text-white/40 font-medium">{t('dashboard.redirect_seconds', { s: Math.ceil((1 - idlePct / 100) * (IDLE_TIMEOUT / 1000)) })}</span>
        </div>

        <TimerBar pct={idlePct} />
      </section>

      {/* ─── Express Stats ──────────────────────────────── */}
      <section className="grid grid-cols-3 gap-3">
        <MiniStat icon="fa-star" label="XP" value={xp?.toLocaleString() || '0'} accent="border-t-corporate" color="text-corporate" />
        <MiniStat icon="fa-fire" label={t('streak.days')} value={`${streak || 0}`} accent="border-t-petroleum" color="text-petroleum" />
        <MiniStat icon="fa-chart-line" label="Score Promedio" value={`${stats.avgScore}%`} accent="border-t-petroleum" color="text-petroleum" />
      </section>

      {/* ─── Tabs: Tu Progreso | Actividad ─────────── */}
      <section>
        <div className="flex gap-1 mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
          <button onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.96] ${
              activeTab === 'modules'
                ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}>
            <Icon name="fa-layer-group" className="w-3.5 h-3.5" />
            {t('dashboard.modules_progress', { completed: stats.completed })}
          </button>
          <button onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.96] ${
              activeTab === 'activity'
                ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}>
            <Icon name="fa-chart-line" className="w-3.5 h-3.5" />
            {t('dashboard.activity_trends')}
          </button>
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
          <div className="space-y-4">
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
          </div>
        )}
      </section>
    </div>
  );
}
