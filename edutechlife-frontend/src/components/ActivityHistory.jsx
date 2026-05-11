import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useProgressContext } from '../context/ProgressContext';
import { useActivityTracker } from '../hooks/useActivityTracker';
import { useIALabStore } from '../store/ialabStore';
import { Icon } from '../utils/iconMapping.jsx';

const ACTIVITY_CONFIG = {
  video: { icon: 'fa-play-circle', label: 'Video', bg: 'from-[#004B63]/10 to-[#00BCD4]/10', color: '#004B63' },
  infographic: { icon: 'fa-file-image', label: 'Infografía', bg: 'from-[#004B63]/10 to-[#00BCD4]/10', color: '#004B63' },
  exam: { icon: 'fa-file-alt', label: 'Examen', bg: 'from-[#00BCD4]/10 to-[#00BCD4]/20', color: '#00BCD4' },
  challenge: { icon: 'fa-trophy', label: 'Desafío', bg: 'from-emerald-500/10 to-emerald-600/10', color: '#10B981' },
  resource: { icon: 'fa-book', label: 'Recurso', bg: 'from-amber-500/10 to-amber-600/10', color: '#F59E0B' },
  community: { icon: 'fa-comments', label: 'Comunidad', bg: 'from-[#004B63]/10 to-[#00BCD4]/10', color: '#004B63' },
  lesson: { icon: 'fa-check-circle', label: 'Lección', bg: 'from-emerald-500/10 to-emerald-600/10', color: '#10B981' },
};

const MODULE_NAMES = {
  1: 'Ingeniería de Prompts', 2: 'Potencia ChatGPT', 3: 'Rastreo Profundo',
  4: 'Inmersión NotebookLM', 5: 'Proyecto Disruptivo',
};

const MODULE_ICONS = {
  1: 'fa-terminal', 2: 'fa-robot', 3: 'fa-search', 4: 'fa-microphone', 5: 'fa-trophy',
};

const MODULE_RESOURCES = [
  { id: 1, title: MODULE_NAMES[1], icon: MODULE_ICONS[1], videos: 2, infographics: 3, hasExam: true, hasChallenge: true, hasCommunity: true },
  { id: 2, title: MODULE_NAMES[2], icon: MODULE_ICONS[2], videos: 2, infographics: 3, hasExam: true, hasChallenge: true, hasCommunity: true },
  { id: 3, title: MODULE_NAMES[3], icon: MODULE_ICONS[3], videos: 2, infographics: 3, hasExam: true, hasChallenge: true, hasCommunity: true },
  { id: 4, title: MODULE_NAMES[4], icon: MODULE_ICONS[4], videos: 2, infographics: 3, hasExam: true, hasChallenge: true, hasCommunity: true },
  { id: 5, title: MODULE_NAMES[5], icon: MODULE_ICONS[5], videos: 1, infographics: 2, hasExam: true, hasChallenge: true, hasCommunity: true },
];

const formatTimeAgo = (date) => {
  if (!date) return '';
  const now = new Date(); const then = new Date(date);
  const diffMs = now - then; const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60); const diffDays = Math.floor(diffHrs / 24);
  if (diffMin < 1) return 'Ahora mismo';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHrs < 24) return `Hace ${diffHrs}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return then.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatDate = (date) => new Date(date).toLocaleDateString('es-ES', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

const calculateModuleScore = (moduleId, config, completedVideos, completedInfographics, completedExams, challengeScores, completedModules) => {
  let score = 0;
  const moduleVideos = completedVideos.filter(v => v.startsWith(`m${moduleId}`)).length;
  const moduleInfographics = completedInfographics.filter(i => i.startsWith(`i${moduleId}`)).length;
  const totalResources = config.videos + config.infographics;
  if (totalResources > 0 && (moduleVideos + moduleInfographics) / totalResources >= 0.8) score += 30;
  const exam = completedExams[moduleId] || 0;
  score += (exam / 100) * 35;
  const challenge = challengeScores[moduleId] || 0;
  score += (challenge / 100) * 30;
  if (completedModules.includes(moduleId)) score += 5;
  return Math.min(100, Math.round(score * 10) / 10);
};

const ResourceBadge = ({ completed, total, icon }) => (
  <span className={`inline-flex items-center gap-[3px] text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
    completed >= total ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
    completed > 0 ? 'bg-amber-50 text-amber-600 border-amber-200' :
    'bg-slate-50 text-slate-400 border-slate-100'
  }`}>
    <Icon name={icon} className="text-[7px]" /> {completed}/{total}
  </span>
);

const ModuleProgressCard = ({ moduleId, title, icon, score, config, completedVideos, completedInfographics, completedExams, challengeScores, completedModules }) => {
  const { lessonProgress, ALL_LESSONS } = useIALabStore();
  const moduleVideos = completedVideos.filter(v => v.startsWith(`m${moduleId}`)).length;
  const moduleInfographics = completedInfographics.filter(i => i.startsWith(`i${moduleId}`)).length;
  const examScore = completedExams[moduleId] || 0;
  const challengeScore = challengeScores[moduleId] || 0;
  const moduleLessonProgress = lessonProgress?.[moduleId] || {};
  const moduleLessons = ALL_LESSONS?.[moduleId] || [];
  const completedModuleLessons = Object.values(moduleLessonProgress).filter(s => s === 'completed').length;
  const totalModuleLessons = moduleLessons.length;
  const isPassed = score >= 80;
  const barColor = isPassed ? 'from-emerald-500 to-emerald-400' : score >= 60 ? 'from-amber-500 to-amber-400' : 'from-slate-300 to-slate-400';

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300/50 transition-all duration-200 active:scale-[0.99] group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
        isPassed ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 shadow-sm shadow-emerald-500/10' : 'bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10'
      }`}>
        <Icon name={icon} className={`text-sm transition-colors duration-300 ${isPassed ? 'text-emerald-600' : 'text-[#004B63] group-hover:text-[#00BCD4]'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
          <span className={`text-xs font-bold flex-shrink-0 ${isPassed ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-slate-500'}`}>{Math.round(score)}%</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
          <ResourceBadge completed={moduleVideos} total={config.videos} icon="fa-play-circle" />
          <ResourceBadge completed={moduleInfographics} total={config.infographics} icon="fa-file-image" />
          {examScore > 0 && (
            <span className={`inline-flex items-center gap-[3px] text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
              examScore >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}>
              <Icon name="fa-file-alt" className="text-[7px]" /> E:{examScore}%
            </span>
          )}
          {challengeScore > 0 && (
            <span className={`inline-flex items-center gap-[3px] text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
              challengeScore >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}>
              <Icon name="fa-trophy" className="text-[7px]" /> D:{challengeScore}%
            </span>
          )}
          {completedModuleLessons > 0 && (
            <span className="inline-flex items-center gap-[3px] text-[9px] font-bold px-1.5 py-0.5 rounded-md border bg-emerald-50 text-emerald-600 border-emerald-200">
              <Icon name="fa-check-circle" className="text-[7px]" /> L:{completedModuleLessons}/{totalModuleLessons}
            </span>
          )}
          {completedModules.includes(moduleId) && (examScore > 0 || challengeScore > 0) && (
            <span className="inline-flex items-center gap-[3px] text-[9px] font-bold px-1.5 py-0.5 rounded-md border bg-[#004B63]/5 text-[#004B63] border-[#004B63]/10">
              <Icon name="fa-comments" className="text-[7px]" /> Foro
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`} style={{ width: `${Math.round(score)}%` }} />
          </div>
          {isPassed && (
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm shadow-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Icon name="fa-check" className="text-white text-[9px]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TABS = [
  { key: 'modules', icon: 'fa-cubes', label: 'Módulos y Notas' },
  { key: 'activities', icon: 'fa-list', label: 'Actividades' },
  { key: 'stats', icon: 'fa-chart-bar', label: 'Estadísticas' },
];

const FILTER_OPTIONS = [
  { key: 'all', label: 'Todo', icon: 'fa-list' },
  { key: 'exam', label: 'Exámenes', icon: 'fa-file-alt' },
  { key: 'challenge', label: 'Desafíos', icon: 'fa-trophy' },
  { key: 'video', label: 'Videos', icon: 'fa-play-circle' },
  { key: 'lesson', label: 'Lecciones', icon: 'fa-check-circle' },
];

const ActivityHistory = ({ isOpen, onClose }) => {
  const { activities, getStudentStats } = useActivityTracker();
  const { completedModules, completedVideos, completedExams, completedInfographics, completedActivities, challengeScores, courseProgress, syncStatus } = useProgressContext();
  const { lessonProgress, ALL_LESSONS, xp, streak, badges, getLevel, getXpForNextLevel, getLevelProgress, BADGE_INFO, getCompletedLessonCount, moduleProgress, getDaysSinceStart } = useIALabStore();
  const [activeTab, setActiveTab] = useState('modules');
  const [filter, setFilter] = useState('all');
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const activitiesData = useMemo(() => {
    const trackedActivities = activities || [];
    const examActs = Object.entries(completedExams || {}).filter(([_, s]) => s > 0).map(([mid, score]) => ({
      id: `exam_${mid}`, module_id: parseInt(mid), activity_type: 'exam',
      title: `Examen ${MODULE_NAMES[mid] || `Módulo ${mid}`}`, score, completed_at: new Date().toISOString(),
    }));
    const challengeActs = Object.entries(challengeScores || {}).filter(([_, s]) => s > 0).map(([mid, score]) => ({
      id: `challenge_${mid}`, module_id: parseInt(mid), activity_type: 'challenge',
      title: `Desafío ${MODULE_NAMES[mid] || `Módulo ${mid}`}`, score, completed_at: new Date().toISOString(),
    }));
    const moduleActs = (completedModules || []).filter(m => !examActs.some(e => e.module_id === m) || !challengeActs.some(c => c.module_id === m)).map(mid => ({
      id: `module_${mid}`, module_id: mid, activity_type: 'resource',
      title: `${MODULE_NAMES[mid] || `Módulo ${mid}`} Completado`,
      score: Math.round(calculateModuleScore(mid, MODULE_RESOURCES.find(r => r.id === mid) || MODULE_RESOURCES[0], completedVideos, completedInfographics, completedExams, challengeScores, completedModules) || 80),
      completed_at: new Date().toISOString(),
    }));
    const lessonActs = [];
    if (lessonProgress) {
      Object.entries(lessonProgress).forEach(([mid, lessons]) => {
        const moduleId = parseInt(mid);
        const moduleLessons = ALL_LESSONS?.[moduleId] || [];
        Object.entries(lessons).forEach(([lid, status]) => {
          if (status !== 'completed') return;
          const lesson = moduleLessons.find(l => l.id === parseInt(lid));
          if (!lesson) return;
          lessonActs.push({
            id: `lesson_${mid}_${lid}`,
            module_id: moduleId,
            activity_type: 'lesson',
            title: lesson.title,
            score: 100,
            completed_at: new Date().toISOString(),
          });
        });
      });
    }
    const all = [...trackedActivities, ...examActs, ...challengeActs, ...moduleActs, ...lessonActs];
    const seen = new Set();
    return all.filter(a => { const k = `${a.activity_type}_${a.module_id}`; if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
  }, [activities, completedExams, challengeScores, completedModules, completedVideos, completedInfographics, lessonProgress, ALL_LESSONS]);

  if (!isOpen) return null;

  const filteredActivities = activitiesData.filter(a => filter === 'all' || a.activity_type === filter);
  const groupedByDate = {};
  filteredActivities.forEach(a => {
    const date = new Date(a.completed_at).toDateString();
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(a);
  });
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

  const completedCount = completedModules?.length || 0;
  const totalExams = Object.values(completedExams || {}).filter(s => s > 0).length;
  const totalChallenges = Object.values(challengeScores || {}).filter(s => s > 0).length;
  const totalVideos = completedVideos?.length || 0;
  const totalInfographics = completedInfographics?.length || 0;
  const totalVideosTarget = MODULE_RESOURCES.reduce((s, m) => s + m.videos, 0);
  const totalInfographicsTarget = MODULE_RESOURCES.reduce((s, m) => s + m.infographics, 0);
  const totalLessonsCompleted = lessonProgress
    ? Object.values(lessonProgress).reduce((sum, mod) => sum + Object.values(mod).filter(s => s === 'completed').length, 0)
    : 0;
  const totalLessonsCount = ALL_LESSONS ? Object.values(ALL_LESSONS).reduce((sum, arr) => sum + arr.length, 0) : 0;
  const level = getLevel();
  const levelProgress = getLevelProgress();
  const xpForNext = getXpForNextLevel();
  const daysSinceStart = getDaysSinceStart();
  const lessonsPerDay = daysSinceStart > 0 ? (totalLessonsCompleted / daysSinceStart) : 0;
  const daysActive = streak || 1;
  const remainingLessons = totalLessonsCount - totalLessonsCompleted;
  const estimatedDaysRemaining = lessonsPerDay > 0 ? Math.ceil(remainingLessons / lessonsPerDay) : remainingLessons;
  const moduleScores = [1, 2, 3, 4, 5].map(id => ({
    id,
    title: MODULE_NAMES[id],
    score: moduleProgress?.[id]?.currentScore || 0,
    icon: MODULE_ICONS[id],
  }));
  const totalItems = totalVideosTarget + totalInfographicsTarget + 5 + 5 + 5 + totalLessonsCount;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm" ref={panelRef}>
      <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,75,99,0.12)] w-full max-w-3xl max-h-[80vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] px-6 py-5 flex items-center justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-sm ring-1 ring-white/10">
              <Icon name="fa-clock" className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg font-montserrat tracking-tight">Mi Historial de Aprendizaje</h2>
              <p className="text-white/60 text-xs">Progreso sincronizado · {totalLessonsCompleted}/{totalLessonsCount} lecciones · {xp} XP</p>
            </div>
          </div>
          <button onClick={onClose} className="relative z-10 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 active:scale-90 ring-1 ring-white/10">
            <Icon name="fa-times" className="text-white text-sm" />
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-3 px-6 py-5 bg-gradient-to-b from-[#004B63]/[0.02] to-white border-b border-slate-200/40">
          {[
            { icon: 'fa-chart-line', value: `${Math.round(courseProgress || 0)}%`, label: 'Progreso', gradient: 'from-[#004B63]/10 to-[#00BCD4]/10', color: '#004B63' },
            { icon: 'fa-trophy', value: `Nv.${level}`, label: `${xp} XP`, gradient: 'from-[#FFD166]/10 to-[#F59E0B]/10', color: '#F59E0B' },
            { icon: 'fa-check-circle', value: `${totalLessonsCompleted}/${totalLessonsCount}`, label: 'Lecciones', gradient: 'from-emerald-500/10 to-emerald-600/10', color: '#10B981' },
            { icon: 'fa-fire', value: `${streak}`, label: streak >= 3 ? 'Racha activa' : 'Días seguidos', gradient: 'from-orange-500/10 to-red-500/10', color: streak >= 3 ? '#EF4444' : '#94A3B8' },
          ].map((item, i) => (
            <div key={i} className="group bg-white rounded-xl border border-slate-200/60 shadow-sm p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <Icon name={item.icon} className="text-xl mx-auto mb-1.5 group-hover:scale-110 transition-transform duration-200" style={{ color: item.color }} />
              <p className="text-lg font-bold font-montserrat tracking-tight" style={{ color: item.color }}>{item.value}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 border-b border-slate-200/40 bg-white">
          <div className="flex gap-1">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all duration-200 flex items-center gap-2 active:scale-95 ${
                  activeTab === tab.key ? 'bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white shadow-sm' : 'text-slate-500 hover:text-[#004B63] hover:bg-slate-50 border border-transparent'
                }`}>
                <Icon name={tab.icon} className={`text-[10px] ${activeTab === tab.key ? 'text-white' : 'text-[#004B63]'}`} />{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[45vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'modules' && (
            <div className="p-5 space-y-2.5">
              <div className="flex items-center gap-2 mb-1 px-0.5">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#004B63] to-[#00BCD4]" />
                <p className="text-[10px] font-bold text-[#004B63] uppercase tracking-[0.15em]">Progreso por Módulo</p>
                <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 to-transparent" />
              </div>
              {MODULE_RESOURCES.map(cfg => (
                <ModuleProgressCard key={cfg.id} moduleId={cfg.id} title={cfg.title} icon={cfg.icon}
                  score={calculateModuleScore(cfg.id, cfg, completedVideos, completedInfographics, completedExams, challengeScores, completedModules)}
                  config={cfg} completedVideos={completedVideos} completedInfographics={completedInfographics}
                  completedExams={completedExams} challengeScores={challengeScores} completedModules={completedModules} />
              ))}
            </div>
          )}

          {activeTab === 'activities' && (
            <div>
              <div className="px-6 py-3 border-b border-slate-200/40 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-[#004B63] uppercase tracking-wider mr-0.5">Filtrar:</span>
                  {FILTER_OPTIONS.map(({ key, label, icon }) => (
                    <button key={key} onClick={() => setFilter(key)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                        filter === key ? 'bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}><Icon name={icon} className="text-[9px]" />{label}</button>
                  ))}
                </div>
              </div>
              {filteredActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-5 shadow-inner">
                    <Icon name="fa-clock" className="text-slate-400 text-3xl" />
                  </div>
                  <p className="text-base font-bold text-slate-700 font-montserrat">Sin actividades registradas</p>
                  <p className="text-xs text-slate-400 text-center mt-1.5 max-w-xs leading-relaxed">Tus actividades aparecerán aquí al completar exámenes, desafíos y recursos del curso</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {sortedDates.map(date => (
                    <div key={date} className="px-6 py-4 hover:bg-[#004B63]/[0.02] transition-colors">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#004B63] to-[#00BCD4]" />
                        <p className="text-[11px] font-bold text-[#004B63] uppercase tracking-wider">{formatDate(date)}</p>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/10 to-transparent" />
                      </div>
                      <div className="space-y-2">
                        {groupedByDate[date].map(activity => {
                          const config = ACTIVITY_CONFIG[activity.activity_type] || ACTIVITY_CONFIG.resource;
                          const moduleName = MODULE_NAMES[activity.module_id] || `Módulo ${activity.module_id}`;
                          return (
                            <div key={activity.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/40 shadow-sm hover:shadow-md hover:border-slate-300/50 hover:-translate-y-0.5 transition-all duration-200 group">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                <Icon name={config.icon} className="text-sm" style={{ color: config.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{activity.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-medium text-slate-400">{moduleName}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="text-[10px] text-slate-400">{formatTimeAgo(activity.completed_at)}</span>
                                </div>
                              </div>
                              {activity.score ? (
                                <div className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                                  activity.score >= 80 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm shadow-emerald-500/5' : 'bg-[#004B63]/5 text-[#004B63] border border-[#004B63]/10'
                                }`}>{activity.score}%</div>
                              ) : (
                                <div className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-100">{config.label}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4 px-0.5">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#004B63] to-[#00BCD4]" />
                <p className="text-[10px] font-bold text-[#004B63] uppercase tracking-[0.15em]">Resumen de Recursos</p>
                <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 to-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: 'fa-play-circle', label: 'Videos', value: `${totalVideos}/${totalVideosTarget}`, sub: 'completados', gradient: 'from-[#004B63]/10 to-[#00BCD4]/10', color: '#004B63', pct: totalVideosTarget > 0 ? Math.round(totalVideos / totalVideosTarget * 100) : 0 },
                  { icon: 'fa-file-image', label: 'Infografías', value: `${totalInfographics}/${totalInfographicsTarget}`, sub: 'completadas', gradient: 'from-[#00BCD4]/10 to-[#00BCD4]/20', color: '#00BCD4', pct: totalInfographicsTarget > 0 ? Math.round(totalInfographics / totalInfographicsTarget * 100) : 0 },
                  { icon: 'fa-file-alt', label: 'Exámenes', value: `${totalExams}/5`, sub: 'aprobados', gradient: 'from-[#00BCD4]/10 to-[#00BCD4]/20', color: '#00BCD4', pct: Math.round(totalExams / 5 * 100) },
                  { icon: 'fa-trophy', label: 'Desafíos', value: `${totalChallenges}/5`, sub: 'completados', gradient: 'from-amber-500/10 to-amber-600/10', color: '#F59E0B', pct: Math.round(totalChallenges / 5 * 100) },
                ].map((item, i) => (
                  <div key={i} className="group bg-white rounded-xl border border-slate-200/40 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <Icon name={item.icon} className="text-sm" style={{ color: item.color }} />
                      </div>
                      <span className="text-xs font-bold text-slate-400">{item.pct}%</span>
                    </div>
                    <p className="text-2xl font-bold font-montserrat tracking-tight" style={{ color: item.color }}>{item.value}</p>
                    <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 mt-1.5">{item.sub}</p>
                  </div>
                ))}
              </div>

              {/* XP & Level card */}
              <div className="mb-5 bg-white rounded-xl border border-slate-200/40 shadow-sm p-5 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD166]/10 to-[#F59E0B]/10 flex items-center justify-center">
                      <Icon name="fa-trophy" className="text-[#F59E0B] text-sm" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#004B63] uppercase tracking-wider">Nivel {level}</h3>
                      <p className="text-[10px] text-slate-400">{xp} XP acumulados</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-[#F59E0B] font-montserrat tracking-tight">{Math.round(levelProgress)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#FFD166] to-[#F59E0B] transition-all duration-700 ease-out" style={{ width: `${Math.min(levelProgress, 100)}%` }} />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-medium text-slate-400">
                  <span>{xp} XP</span>
                  <span>Siguiente nivel: {xpForNext} XP</span>
                </div>
              </div>

              {/* Ritmo de Aprendizaje */}
              <div className="mb-5 bg-white rounded-xl border border-slate-200/40 shadow-sm p-5 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-4 px-0.5">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#00BCD4] to-[#004B63]" />
                  <p className="text-[10px] font-bold text-[#004B63] uppercase tracking-[0.15em]">Ritmo de Aprendizaje</p>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#00BCD4]/20 to-transparent" />
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 rounded-xl bg-gradient-to-b from-[#00BCD4]/5 to-transparent border border-[#00BCD4]/10">
                    <div className="text-xl font-bold text-[#00BCD4]">{lessonsPerDay > 0 ? lessonsPerDay.toFixed(1) : '—'}</div>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">Lecciones/día</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-b from-[#004B63]/5 to-transparent border border-[#004B63]/10">
                    <div className="text-xl font-bold text-[#004B63]">{daysSinceStart}</div>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">Días activo</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-b from-emerald-500/5 to-transparent border border-emerald-500/10">
                    <div className="text-xl font-bold text-emerald-600">{estimatedDaysRemaining > 0 && estimatedDaysRemaining < 999 ? estimatedDaysRemaining : '—'}</div>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">Días restantes</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-b from-[#FFD166]/5 to-transparent border border-[#FFD166]/10">
                    <div className="text-xl font-bold text-[#F59E0B]">{Math.round((totalLessonsCompleted / Math.max(totalLessonsCount, 1)) * 100)}%</div>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">Completado</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-emerald-400 transition-all duration-700 ease-out" style={{ width: `${Math.min((totalLessonsCompleted / Math.max(totalLessonsCount, 1)) * 100, 100)}%` }} />
                </div>
              </div>

              {/* Badges section */}
              {badges && badges.length > 0 && (
                <div className="mb-5 bg-white rounded-xl border border-slate-200/40 shadow-sm p-5 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2 mb-4 px-0.5">
                    <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#FFD166] to-[#F59E0B]" />
                    <p className="text-[10px] font-bold text-[#004B63] uppercase tracking-[0.15em]">Logros y Medallas</p>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#FFD166]/20 to-transparent" />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {badges.map(badgeId => {
                      const info = BADGE_INFO?.[badgeId] || { icon: 'fa-star', label: badgeId, desc: '', color: '#94A3B8' };
                      return (
                        <div key={badgeId} className="group bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200/40 shadow-sm p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD166]/10 to-[#F59E0B]/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                            <Icon name={info.icon} className="text-sm" style={{ color: info.color }} />
                          </div>
                          <p className="text-[10px] font-bold text-slate-700 leading-tight">{info.label}</p>
                          <p className="text-[8px] text-slate-400 mt-0.5">{info.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-5 bg-white rounded-xl border border-slate-200/40 shadow-sm p-5 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-4 px-0.5">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#004B63] to-[#00BCD4]" />
                  <p className="text-[10px] font-bold text-[#004B63] uppercase tracking-[0.15em]">Puntaje por Módulo</p>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 to-transparent" />
                </div>
                <div className="space-y-2.5">
                  {moduleScores.map(mod => {
                    const barColor = mod.score >= 80 ? 'from-emerald-500 to-emerald-400' : mod.score >= 60 ? 'from-amber-500 to-amber-400' : 'from-slate-400 to-slate-300';
                    return (
                      <div key={mod.id} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                          <Icon name={mod.icon} className="text-[10px] text-[#004B63]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[11px] font-semibold text-slate-700 truncate">{mod.title}</span>
                            <span className={`text-[10px] font-bold flex-shrink-0 ml-2 ${mod.score >= 80 ? 'text-emerald-600' : mod.score >= 60 ? 'text-amber-600' : 'text-slate-500'}`}>{Math.round(mod.score)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`} style={{ width: `${Math.round(mod.score)}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 bg-white rounded-xl border border-slate-200/40 shadow-sm p-5 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
                      <Icon name="fa-tachometer-alt" className="text-[#004B63] text-sm" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#004B63] uppercase tracking-wider">Progreso Global</h3>
                      <p className="text-[10px] text-slate-400">{totalVideos + totalInfographics + totalExams + totalChallenges + completedCount}/{totalItems} recursos completados</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-[#004B63] font-montserrat tracking-tight">{Math.round(courseProgress || 0)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] transition-all duration-1000 ease-out shadow-sm" style={{ width: `${Math.min(courseProgress || 0, 100)}%` }} />
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-slate-100 text-[10px] font-medium text-slate-400">
                  <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#004B63]" />{completedCount}/5 módulos</span>
                  <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#00BCD4]" />{totalVideos}/{totalVideosTarget} videos</span>
                  <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{totalExams + totalChallenges}/10 eval.</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 px-1">
                <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500' : syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
                <span className="text-[10px] font-medium text-slate-400">{syncStatus === 'synced' ? 'Datos sincronizados' : syncStatus === 'syncing' ? 'Sincronizando...' : syncStatus === 'offline' ? 'Modo offline' : 'Datos locales'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:8px}.custom-scrollbar::-webkit-scrollbar-thumb:hover{background:#94A3B8}`}</style>
    </div>
  );
};

export default ActivityHistory;
