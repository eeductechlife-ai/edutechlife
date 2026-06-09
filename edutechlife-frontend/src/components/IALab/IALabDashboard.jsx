import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { useIALabStore } from '../../store/ialabStore';
import { useTranslation } from '../../i18n/I18nProvider';
import { getModules } from '../../data/ialab';
import { Icon } from '../../utils/iconMapping.jsx';
import useActivityTracker from '../../hooks/useActivityTracker';

const MODULES = [1, 2, 3, 4, 5];
const IDLE_TIMEOUT = 10000;

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

function ModuleRow({ id, title, icon, approved, unlocked, score, examScore, challengeScore, onNavigate }) {
  const isActive = unlocked && !approved;
  const isLocked = !unlocked;
  return (
    <motion.div
      whileHover={unlocked ? { x: 3 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 16 }}
      className={`flex items-center gap-3.5 bg-white rounded-xl p-3.5 shadow-sm border transition-all duration-200 ${
        isActive ? 'border-corporate/60 shadow-[0_0_0_2px_rgba(0,188,212,0.08),0_4px_16px_rgba(0,188,212,0.1)]' : 'border-slate-100'
      } ${isLocked ? 'opacity-65' : ''}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-corporate/10' : 'bg-slate-100'}`}>
        <Icon name={isActive ? 'fa-play' : icon} className={`text-base ${isActive ? 'text-corporate' : 'text-slate-400'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-petroleum">M{id}: {title}</p>
        {isActive && (
          <div className="h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-corporate rounded-full transition-all duration-700" style={{ width: `${score}%` }} />
          </div>
        )}
        {approved && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <Icon name="fa-check-circle" className="w-3 h-3 text-corporate" />
            <span className="text-[11px] text-slate-500">{score}% — Examen {examScore}% · Desafío {challengeScore}%</span>
          </div>
        )}
      </div>
      {unlocked ? (
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 12 }}
          onClick={onNavigate}
          className="flex-shrink-0 bg-corporate text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all">
          {approved ? 'Revisar' : 'Continuar'} <Icon name="fa-arrow-right" className="w-3 h-3" />
        </motion.button>
      ) : (
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] flex-shrink-0">
          <Icon name="fa-lock" className="w-3 h-3 text-slate-300" />
          Completa el módulo anterior
        </div>
      )}
    </motion.div>
  );
}

export default function IALabDashboard() {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();

  const moduleProgress = useIALabStore(s => s.moduleProgress);
  const xp = useIALabStore(s => s.xp);
  const streak = useIALabStore(s => s.streak);
  const completedExams = useIALabStore(s => s.completedExams);
  const challengeScores = useIALabStore(s => s.challengeScores);
  const courseProgress = useIALabStore(s => s.courseProgress);
  const courseCompleted = useIALabStore(s => s.courseCompleted);

  const modulesData = useMemo(() => getModules(locale), [locale]);

  const [idlePct, setIdlePct] = useState(0);
  const [activeTab, setActiveTab] = useState('modules');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const idleRef = useRef(null);
  const animRef = useRef(null);
  const fileInputRef = useRef(null);

  const { getTimeTrackingStats } = useActivityTracker();
  const timeTracking = useMemo(() => getTimeTrackingStats(), [getTimeTrackingStats]);

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

  useEffect(() => {
    const saved = localStorage.getItem('ialab_avatar');
    if (saved) setAvatarUrl(saved);
  }, []);

  const handleAvatarChange = useCallback(e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      setAvatarUrl(dataUrl);
      localStorage.setItem('ialab_avatar', dataUrl);
    };
    reader.readAsDataURL(file);
  }, []);

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

        {/* ─── Tabs funcionales ─── */}
        <div className="flex gap-1 bg-slate-200/70 rounded-xl p-1 w-fit max-md:w-full">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 14 }}
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 max-md:justify-center ${
              activeTab === 'modules'
                ? 'bg-white text-petroleum shadow-sm' : 'text-petroleum/50 hover:text-petroleum/70'}`}>
            <Icon name="fa-layer-group" className="w-3.5 h-3.5" />
            Tu Progreso
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 14 }}
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 max-md:justify-center ${
              activeTab === 'activity'
                ? 'bg-white text-petroleum shadow-sm' : 'text-petroleum/50 hover:text-petroleum/70'}`}>
            <Icon name="fa-chart-line" className="w-3.5 h-3.5" />
            Actividad y Tendencias
          </motion.button>
        </div>

        {activeTab === 'modules' ? (
          <div className="space-y-2.5">
            {modules.map(mod => (
              <ModuleRow key={mod.id} id={mod.id} title={moduleTitles[mod.id]}
                icon={moduleIcons[mod.id]} approved={mod.approved} unlocked={mod.unlocked}
                score={mod.score} examScore={mod.examScore} challengeScore={mod.challengeScore}
                onNavigate={() => navigate(`/ialab/${mod.id}`)} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Hoy', value: timeTracking?.today ?? 0 },
                { label: 'Esta Semana', value: timeTracking?.weekTotal ?? 0 },
                { label: 'Promedio / día', value: timeTracking?.avgPerDay ?? 0 },
              ].map(s => (
                <div key={s.label}
                  className="bg-white rounded-xl py-3.5 px-2 text-center shadow-sm border border-slate-100">
                  <p className="text-lg font-bold text-petroleum">{s.value}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Actividad Semanal</p>
              <div className="flex items-end gap-1.5 h-20">
                {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((day, i) => {
                  const count = timeTracking?.weekDaily?.[i]?.count || 0;
                  const max = Math.max(...(timeTracking?.weekDaily?.map(d => d.count) || [1]), 1);
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] text-slate-400 font-medium">{count}</span>
                      <div className="w-full rounded-md bg-corporate/5 relative overflow-hidden" style={{ height: 48 }}>
                        <div className="absolute bottom-0 w-full bg-corporate rounded-md transition-all duration-500"
                          style={{ height: `${(count / max) * 100}%` }} />
                      </div>
                      <span className="text-[9px] text-slate-400">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Puntaje por Módulo</p>
              <div className="space-y-2">
                {modules.map(m => (
                  <div key={m.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 w-8">M{m.id}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-corporate transition-all duration-500"
                        style={{ width: `${Math.max(0, m.score)}%` }} />
                    </div>
                    <span className="text-xs font-bold text-petroleum w-10 text-right">{m.score || 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  const actionIcon = ({ exam: 'fa-file-text', challenge: 'fa-trophy', resources: 'fa-video', community: 'fa-comments', certificate: 'fa-certificate' })[suggestedAction.action] || 'fa-play-circle';

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-6">
      <BgPattern />
      <h1 className="text-2xl sm:text-3xl font-black text-petroleum">Introducción a la I.A Generativa</h1>
      <p className="text-sm text-slate-500 -mt-3">Continúa tu aprendizaje</p>

      {/* ─── Hero: Donut + Challenge + Stats ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate rounded-3xl shadow-lg"
        style={{ boxShadow: '0 20px 60px rgba(0,75,99,0.25),0 8px 20px rgba(0,0,0,0.08)' }}>
        <div className="grid grid-cols-[280px_1fr] gap-8 p-7 max-md:grid-cols-1 max-md:p-5 max-md:gap-5">
          {/* ── Izquierda: Donut ── */}
          <div className="flex flex-col items-center">
            <div className="relative w-[170px] h-[170px] max-md:w-[140px] max-md:h-[140px]">
              <svg viewBox="0 0 150 150" className="w-full h-full -rotate-90">
                <circle cx="75" cy="75" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle cx="75" cy="75" r="70" fill="none" stroke="#00BCD4" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 70} strokeDashoffset={2 * Math.PI * 70 * (1 - courseProgress / 100)} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <div onClick={() => fileInputRef.current?.click()}
                  className="w-[90px] h-[90px] max-md:w-[76px] max-md:h-[76px] rounded-full bg-white/15 backdrop-blur border-2 border-white/10 flex items-center justify-center cursor-pointer group/avatar overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_24px_rgba(0,188,212,0.4)]">
                  {(clerkUser?.imageUrl || avatarUrl) ? (
                    <img src={clerkUser?.imageUrl || avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <svg viewBox="0 0 64 64" className="w-full h-full">
                      <circle cx="32" cy="22" r="10" fill="rgba(255,255,255,0.85)" />
                      <ellipse cx="32" cy="50" rx="18" ry="14" fill="rgba(255,255,255,0.85)" />
                    </svg>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 rounded-full">
                    <Icon name="fa-camera" className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.08em] mt-2.5">Progreso global del curso: {courseProgress}%</p>
          </div>

          {/* ── Derecha: Challenge + Stats ── */}
          <div className="flex flex-col justify-between gap-4">
            {/* Challenge */}
            <div className="flex items-center justify-between bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/[0.06] max-md:flex-col max-md:items-stretch max-md:gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-[42px] h-[42px] rounded-xl bg-corporate/15 flex items-center justify-center flex-shrink-0">
                  <Icon name={actionIcon} className="w-[18px] h-[18px] text-corporate" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Aceptar desafío del Módulo {suggestedAction.moduleId}</p>
                  <p className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5">
                    <Icon name="fa-arrow-right" className="w-2.5 h-2.5" />
                    {suggestedAction.label}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="relative w-11 h-11 flex items-center justify-center">
                  <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
                    <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(0,188,212,0.6)" strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 18} strokeDashoffset={2 * Math.PI * 18 * (idlePct / 100)} />
                  </svg>
                  <span className="text-xs font-bold text-white">{Math.ceil((1 - idlePct / 100) * (IDLE_TIMEOUT / 1000))}s</span>
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 14 }}
                  onClick={doNavigate}
                  className="bg-corporate text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_4px_14px_rgba(0,188,212,0.3)] hover:shadow-[0_6px_20px_rgba(0,188,212,0.4)] transition-all">
                  Continuar <Icon name="fa-arrow-right" className="w-3 h-3" />
                </motion.button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { icon: 'fa-star', value: xp?.toLocaleString() || '0', label: 'XP GANADOS' },
                { icon: 'fa-fire', value: streak || 0, label: 'RACHA ACTUAL' },
                { icon: 'fa-chart-line', value: `${stats.avgScore}%`, label: 'SCORE PROMEDIO' },
              ].map(s => (
                <motion.div key={s.icon} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
                  className="bg-white/10 backdrop-blur rounded-[14px] py-3.5 px-2 text-center border border-white/[0.06]">
                  <div className="w-[30px] h-[30px] rounded-xl bg-corporate/15 flex items-center justify-center mx-auto mb-1.5">
                    <Icon name={s.icon} className="w-3.5 h-3.5 text-corporate" />
                  </div>
                  <p className="text-lg font-bold text-white leading-tight">{s.value}</p>
                  <p className="text-[8px] text-white/50 uppercase tracking-[0.06em]">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tabs funcionales ─── */}
      <div className="flex gap-1 bg-slate-200/70 rounded-xl p-1 w-fit max-md:w-full">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 14 }}
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 max-md:justify-center ${
            activeTab === 'modules'
              ? 'bg-white text-petroleum shadow-sm' : 'text-petroleum/50 hover:text-petroleum/70'}`}>
          <Icon name="fa-layer-group" className="w-3.5 h-3.5" />
          Tu Progreso
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 14 }}
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 max-md:justify-center ${
            activeTab === 'activity'
              ? 'bg-white text-petroleum shadow-sm' : 'text-petroleum/50 hover:text-petroleum/70'}`}>
          <Icon name="fa-chart-line" className="w-3.5 h-3.5" />
          Actividad y Tendencias
        </motion.button>
      </div>

      {activeTab === 'modules' ? (
        /* ─── Lista de Módulos ─── */
        <div className="space-y-2.5">
          {modules.map(mod => (
            <ModuleRow key={mod.id} id={mod.id} title={moduleTitles[mod.id]}
              icon={moduleIcons[mod.id]} approved={mod.approved} unlocked={mod.unlocked}
              score={mod.score} examScore={mod.examScore} challengeScore={mod.challengeScore}
              onNavigate={() => navigate(`/ialab/${mod.id}`)} />
          ))}
        </div>
      ) : (
        /* ─── Actividad y Tendencias ─── */
        <div className="space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Hoy', value: timeTracking?.today ?? 0 },
              { label: 'Esta Semana', value: timeTracking?.weekTotal ?? 0 },
              { label: 'Promedio / día', value: timeTracking?.avgPerDay ?? 0 },
            ].map(s => (
              <div key={s.label}
                className="bg-white rounded-xl py-3.5 px-2 text-center shadow-sm border border-slate-100">
                <p className="text-lg font-bold text-petroleum">{s.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Weekly bar chart */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Actividad Semanal</p>
            <div className="flex items-end gap-1.5 h-20">
              {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((day, i) => {
                const count = timeTracking?.weekDaily?.[i]?.count || 0;
                const max = Math.max(...(timeTracking?.weekDaily?.map(d => d.count) || [1]), 1);
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-slate-400 font-medium">{count}</span>
                    <div className="w-full rounded-md bg-corporate/5 relative overflow-hidden" style={{ height: 48 }}>
                      <div className="absolute bottom-0 w-full bg-corporate rounded-md transition-all duration-500"
                        style={{ height: `${(count / max) * 100}%` }} />
                    </div>
                    <span className="text-[9px] text-slate-400">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module scores */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Puntaje por Módulo</p>
            <div className="space-y-2">
              {modules.map(m => (
                <div key={m.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 w-8">M{m.id}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-corporate transition-all duration-500"
                      style={{ width: `${Math.max(0, m.score)}%` }} />
                  </div>
                  <span className="text-xs font-bold text-petroleum w-10 text-right">{m.score || 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
