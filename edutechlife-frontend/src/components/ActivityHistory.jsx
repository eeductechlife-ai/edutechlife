import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useActivityTracker } from '../hooks/useActivityTracker';
import { useIALabStore } from '../store/ialabStore';
import usePersonalizedRecommendations from '../hooks/IALab/usePersonalizedRecommendations';
import { ALL_LESSONS, modules, BADGE_INFO } from '../data/ialab';
import { Icon } from '../utils/iconMapping.jsx';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import useFocusTrap from '../hooks/useFocusTrap';
import { getUnifiedSessionStats } from '../hooks/useSessionTracker';
import { supabase } from '../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import ResourceBadge from '../components/ui/ResourceBadge';
import SectionHeader from '../components/ui/SectionHeader';
import ModuleProgressCard from '../components/IALab/ModuleProgressCard';

const ACTIVITY_CONFIG = {
  video: { icon: 'fa-play-circle', label: 'Video', color: 'var(--color-petroleum)' },
  infographic: { icon: 'fa-file-image', label: 'Infografía', color: 'var(--color-petroleum)' },
  exam: { icon: 'fa-file-alt', label: 'Examen', color: 'var(--color-corporate)' },
  challenge: { icon: 'fa-trophy', label: 'Desafío', color: '#10B981' },
  resource: { icon: 'fa-book', label: 'Recurso', color: '#F59E0B' },
  community: { icon: 'fa-comments', label: 'Comunidad', color: 'var(--color-petroleum)' },
  lesson: { icon: 'fa-check-circle', label: 'Lección', color: '#10B981' },
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

const TABS = [
  { key: 'modules', icon: 'fa-cubes', label: 'Módulos y Notas' },
  { key: 'activities', icon: 'fa-list', label: 'Actividades' },
  { key: 'stats', icon: 'fa-chart-bar', label: 'Estadísticas' },
  { key: 'recommendations', icon: 'fa-lightbulb', label: 'Recomendaciones' },
];

const FILTER_OPTIONS = [
  { key: 'all', label: 'Todo', icon: 'fa-list' },
  { key: 'exam', label: 'Exámenes', icon: 'fa-file-alt' },
  { key: 'challenge', label: 'Desafíos', icon: 'fa-trophy' },
  { key: 'video', label: 'Videos', icon: 'fa-play-circle' },
  { key: 'lesson', label: 'Lecciones', icon: 'fa-check-circle' },
  { key: 'community', label: 'Comunidad', icon: 'fa-comments' },
];

const ActivityHistory = ({ isOpen, onClose }) => {
  const { activities } = useActivityTracker();
  const lessonProgress = useIALabStore(s => s.lessonProgress);
  const xp = useIALabStore(s => s.xp);
  const streak = useIALabStore(s => s.streak);
  const lastActivityDate = useIALabStore(s => s.lastActivityDate);
  const badges = useIALabStore(s => s.badges);
  const getLevel = useIALabStore(s => s.getLevel);
  const getXpForNextLevel = useIALabStore(s => s.getXpForNextLevel);
  const getLevelProgress = useIALabStore(s => s.getLevelProgress);
  const getTotalPoints = useIALabStore(s => s.getTotalPoints);
  const calculateModuleScore = useIALabStore(s => s.calculateModuleScore);
  const moduleProgress = useIALabStore(s => s.moduleProgress);
  const getDaysSinceStart = useIALabStore(s => s.getDaysSinceStart);
  const completedModules = useIALabStore(s => s.completedModules);
  const completedVideos = useIALabStore(s => s.completedVideos);
  const completedExams = useIALabStore(s => s.completedExams);
  const completedInfographics = useIALabStore(s => s.completedInfographics);
  const challengeScores = useIALabStore(s => s.challengeScores);
  const courseProgress = useIALabStore(s => s.courseProgress);
  const syncStatus = useIALabStore(s => s.syncStatus);
  const userId = useIALabStore(s => s.userId);
  const getWeeklyXP = useIALabStore(s => s.getWeeklyXP);
  const getDetailedRecommendations = useIALabStore(s => s.getDetailedRecommendations);
  const forumPostCount = useIALabStore(s => s.forumPostCount);
  const forumCommentCount = useIALabStore(s => s.forumCommentCount);
  const [activeTab, setActiveTab] = useState('modules');
  const [filter, setFilter] = useState('all');
  const [sessionStats, setSessionStats] = useState({ todayMinutes: 0, allMinutes: 0, sessionCount: 0, daysActive: 0 });
  const [timeRange, setTimeRange] = useState('7d');
  const [accordionSections, setAccordionSections] = useState({ estudio: true, progreso: true, logros: false });
  const [isExpanded, setIsExpanded] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const panelRef = useRef(null);
  const focusTrapRef = useFocusTrap(isOpen);
  const liveStartRef = useRef(null);
  const intervalRef = useRef(null);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) onClose(); };
      document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isOpen, onClose]);

  const refreshStats = useCallback(async () => {
    try {
      const res = userId ? await getUnifiedSessionStats(supabase, userId) : null;
      if (res) {
        setSessionStats(res.stats);
      } else {
        const local = JSON.parse(localStorage.getItem('ialab_session_log') || '[]');
        const today = new Date().toDateString();
        const todaySessions = local.filter(s => new Date(s.completed_at).toDateString() === today);
        setSessionStats({
          todayMinutes: todaySessions.reduce((sum, s) => sum + Math.min(s.duration_seconds || 0, 21600), 0) / 60,
          allMinutes: local.reduce((sum, s) => sum + Math.min(s.duration_seconds || 0, 21600), 0) / 60,
          sessionCount: local.length,
          daysActive: new Set(local.map(s => new Date(s.completed_at).toDateString())).size,
        });
      }
    } catch {
      // Silently fall back to existing stats
    }
  }, [userId]);

  useEffect(() => {
    if (!isOpen) return;
    liveStartRef.current = Date.now();
    refreshStats();
    intervalRef.current = setInterval(refreshStats, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      liveStartRef.current = null;
    };
  }, [isOpen, refreshStats]);

  const activitiesData = useMemo(() => {
    const trackedActivities = activities || [];
    const trackedKey = new Set(trackedActivities.map(a => `${a.activity_type}_${a.module_id}`));
    const examActs = Object.entries(completedExams || {}).filter(([_, s]) => s > 0).filter(([mid]) => !trackedKey.has(`exam_${mid}`)).map(([mid, score]) => ({
      id: `exam_${mid}`, module_id: parseInt(mid), activity_type: 'exam',
      title: `Examen ${MODULE_NAMES[mid] || `Módulo ${mid}`}`, score,
      completed_at: trackedActivities.find(a => a.activity_type === 'exam' && a.module_id === parseInt(mid))?.completed_at || new Date().toISOString(),
    }));
    const challengeActs = Object.entries(challengeScores || {}).filter(([_, s]) => s > 0).filter(([mid]) => !trackedKey.has(`challenge_${mid}`)).map(([mid, score]) => ({
      id: `challenge_${mid}`, module_id: parseInt(mid), activity_type: 'challenge',
      title: `Desafío ${MODULE_NAMES[mid] || `Módulo ${mid}`}`, score,
      completed_at: trackedActivities.find(a => a.activity_type === 'challenge' && a.module_id === parseInt(mid))?.completed_at || new Date().toISOString(),
    }));
    const moduleActs = (completedModules || []).filter(m => !examActs.some(e => e.module_id === m) && !challengeActs.some(c => c.module_id === m) && !trackedKey.has(`resource_${m}`)).map(mid => ({
      id: `module_${mid}`, module_id: mid, activity_type: 'resource',
      title: `${MODULE_NAMES[mid] || `Módulo ${mid}`} Completado`,
      score: Math.round(calculateModuleScore(mid, MODULE_RESOURCES.find(r => r.id === mid) || MODULE_RESOURCES[0], completedVideos, completedInfographics, completedExams, challengeScores, completedModules) || 80),
      completed_at: trackedActivities.find(a => a.module_id === mid)?.completed_at || new Date().toISOString(),
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
            completed_at: trackedActivities.find(a => a.activity_type === 'lesson' && a.module_id === moduleId)?.completed_at || new Date().toISOString(),
          });
        });
      });
    }
    const communityActs = [];
    const totalForum = (forumPostCount || 0) + (forumCommentCount || 0);
    if (totalForum > 0 && !trackedKey.has('community_0')) {
      communityActs.push({
        id: `community_0`, module_id: 0, activity_type: 'community',
        title: `${totalForum} aporte${totalForum > 1 ? 's' : ''} en la comunidad`,
        score: 100,
        completed_at: new Date().toISOString(),
      });
    }
    const all = [...trackedActivities, ...examActs, ...challengeActs, ...moduleActs, ...lessonActs, ...communityActs];
    const seen = new Set();
    return all.filter(a => { const k = `${a.activity_type}_${a.module_id}_${a.id}_${trackedKey.has(`${a.activity_type}_${a.module_id}`) ? 'real' : 'synth'}`; if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
  }, [activities, completedExams, challengeScores, completedModules, completedVideos, completedInfographics, lessonProgress, forumPostCount, forumCommentCount]);

  const weeklyData = useMemo(() => {
    const days = [];
    const now = new Date();
    const sessions = JSON.parse(localStorage.getItem('ialab_session_log') || '[]');
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toDateString();
      const daySessions = sessions.filter(s => new Date(s.completed_at).toDateString() === dStr);
      const mins = Math.round(daySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60);
      const maxMins = Math.max(...[7,14,21,28,35].map(j => {
        const ref = new Date(now); ref.setDate(ref.getDate() - j);
        const refStr = ref.toDateString();
        return sessions.filter(s => new Date(s.completed_at).toDateString() === refStr).reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;
      }), 1);
      days.push({ label: d.toLocaleDateString('es-ES', { weekday: 'short' }), mins, pct: Math.min(100, (mins / Math.max(maxMins, 1)) * 100) });
    }
    return days;
  }, [sessionStats]);

  const monthlyData = useMemo(() => {
    const days = [];
    const now = new Date();
    const sessions = JSON.parse(localStorage.getItem('ialab_session_log') || '[]');
    const range = timeRange === '30d' ? 29 : timeRange === 'all' ? 89 : 6;
    for (let i = range; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toDateString();
      const daySessions = sessions.filter(s => new Date(s.completed_at).toDateString() === dStr);
      const mins = Math.round(daySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60);
      days.push({ label: d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }), mins, fullDate: d });
    }
    return days;
  }, [sessionStats, timeRange]);

  const activityDistribution = useMemo(() => {
    const counts = { video: 0, exam: 0, challenge: 0, lesson: 0, community: 0, resource: 0 };
    (activities || []).forEach(a => { if (counts[a.activity_type] !== undefined) counts[a.activity_type]++; });
    const colors = { video: '#004B63', exam: '#00BCD4', challenge: '#10B981', lesson: '#F59E0B', community: '#8B5CF6', resource: '#94A3B8' };
    const labels = { video: 'Videos', exam: 'Exámenes', challenge: 'Desafíos', lesson: 'Lecciones', community: 'Comunidad', resource: 'Recursos' };
    const total = Object.values(counts).reduce((s, v) => s + v, 0);
    return Object.entries(counts).filter(([_, v]) => v > 0).map(([k, v]) => ({
      name: labels[k], value: v, pct: total > 0 ? Math.round(v / total * 100) : 0, color: colors[k], key: k,
    }));
  }, [activities]);

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
  const liveSeconds = liveStartRef.current ? Math.round((Date.now() - liveStartRef.current) / 1000) : 0;
  const liveMinutes = Math.min(liveSeconds / 60, 360);
  const effectiveAllMinutes = sessionStats.allMinutes + liveMinutes;
  const effectiveTodayMinutes = sessionStats.todayMinutes + liveMinutes;
  const daysActive = Math.max(streak || 1, sessionStats.daysActive || 1);
  const totalStudyMinutes = effectiveAllMinutes;
  const studyHours = Math.floor(totalStudyMinutes / 60);
  const studyMins = Math.round(totalStudyMinutes % 60);
  const lessonsPerDay = daysSinceStart > 0 ? (totalLessonsCompleted / daysSinceStart) : 0;
  const remainingLessons = totalLessonsCount - totalLessonsCompleted;
  const estimatedDaysRemaining = lessonsPerDay > 0 ? Math.ceil(remainingLessons / lessonsPerDay) : 0;
  const estimatedEndDate = estimatedDaysRemaining > 0 && estimatedDaysRemaining < 999
    ? new Date(Date.now() + estimatedDaysRemaining * 86400000).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const weeklyXP = getWeeklyXP();
  const recommendations = getDetailedRecommendations();

  const lastActivityTime = lastActivityDate ? (() => {
    const d = new Date(lastActivityDate);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return `Hoy a las ${d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    const yesterday = new Date(now - 86400000);
    if (d.toDateString() === yesterday.toDateString()) return `Ayer a las ${d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  })() : null;

  const getDominanceLabel = (modId) => {
    try {
      return useIALabStore.getState().getModuleDominanceLevel(modId);
    } catch { return null; }
  };

  const moduleScores = [1, 2, 3, 4, 5].map(id => ({
    id,
    title: MODULE_NAMES[id],
    score: moduleProgress?.[id]?.currentScore ?? Math.round(calculateModuleScore(id, MODULE_RESOURCES.find(r => r.id === id) || MODULE_RESOURCES[0], completedVideos, completedInfographics, completedExams, challengeScores, completedModules)),
    icon: MODULE_ICONS[id],
    examScore: completedExams?.[id] || 0,
    challengeScore: challengeScores?.[id] || 0,
    dominance: getDominanceLabel(id),
  }));
  const weakestModule = [...moduleScores].sort((a, b) => a.score - b.score)[0];
  const totalItems = totalVideosTarget + totalInfographicsTarget + 5 + 5 + 5 + totalLessonsCount;
  const totalPoints = getTotalPoints();
  const getStreakMessage = () => {
    if (streak >= 30) return 'Legendario';
    if (streak >= 7) return 'Imparable';
    if (streak >= 3) return 'Buena racha';
    return 'Sigue practicando';
  };

  const nextBadge = useMemo(() => {
    const earned = new Set(badges || []);
    const allBadges = [
      { id: 'first_lesson', check: () => totalLessonsCompleted >= 1, current: totalLessonsCompleted, target: 1 },
      { id: 'five_lessons', check: () => totalLessonsCompleted >= 5, current: totalLessonsCompleted, target: 5 },
      { id: 'all_lessons', check: () => totalLessonsCompleted >= 15, current: totalLessonsCompleted, target: 15 },
      { id: 'streak_3', check: () => streak >= 3, current: streak, target: 3 },
      { id: 'streak_7', check: () => streak >= 7, current: streak, target: 7 },
      { id: 'first_module', check: () => completedCount >= 1, current: completedCount, target: 1 },
      { id: 'three_modules', check: () => completedCount >= 3, current: completedCount, target: 3 },
      { id: 'all_modules', check: () => completedCount >= 5, current: completedCount, target: 5 },
    ];
    const next = allBadges.find(b => !earned.has(b.id) && b.current > 0);
    if (!next) return null;
    const info = BADGE_INFO?.[next.id];
    if (!info) return null;
    return { ...info, badgeId: next.id, current: Math.min(next.current, next.target), target: next.target };
  }, [badges, totalLessonsCompleted, streak, completedCount]);

  const personalizedRecs = usePersonalizedRecommendations();

  if (!isOpen) return null;

  const filteredActivities = activitiesData.filter(a => filter === 'all' || a.activity_type === filter);
  const groupedByDate = {};
  filteredActivities.forEach(a => {
    const date = new Date(a.completed_at).toDateString();
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(a);
  });
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

  const exportProgressPDF = async () => {
    setPdfLoading(true);
    try {
      const jsPDF = (await import('jspdf')).default;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const PW = 210, PH = 297, ML = 14, MR = 14, MT = 22, MB = 14;
      const CW = PW - ML - MR;
      const CP = [0, 75, 99], CC = [0, 188, 212], CG = [100, 116, 139], CD = [30, 41, 59];
      let cy = MT;
      const pageCount = () => doc.internal.getNumberOfPages();
      let currentPage = 1;

      const addFooter = () => {
        const pn = pageCount();
        doc.setFontSize(7);
        doc.setTextColor(...CG);
        doc.text('Edutechlife · Mi Historial de Aprendizaje', ML, PH - MB);
        doc.text(`Página ${pn}`, PW - MR, PH - MB, { align: 'right' });
        doc.setDrawColor(...CP);
        doc.setLineWidth(0.2);
        doc.line(ML, PH - MB - 3, PW - MR, PH - MB - 3);
      };

      const drawHeader = () => {
        currentPage = pageCount();
        doc.setFillColor(...CP);
        doc.rect(0, 0, PW, 17, 'F');
        doc.setFillColor(...CC);
        doc.rect(0, 17, PW, 0.4, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text('EDUTECHLIFE', ML, 11);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.text(new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }), PW - MR, 11, { align: 'right' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(220, 250, 255);
        doc.text('Mi Historial de Aprendizaje', ML, 15.5);
        cy = 22;
      };

      const checkPage = (mm) => {
        if (cy + mm > PH - MB - 12) {
          addFooter();
          doc.addPage();
          drawHeader();
        }
      };

      const sectionTitle = (text) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...CP);
        doc.text(text, ML, cy);
        doc.setFillColor(...CC);
        doc.rect(ML, cy + 1, 28, 0.3, 'F');
        cy += 6.5;
      };

      const tableRow = (cols, y, header) => {
        if (header) {
          doc.setFillColor(...CP);
          doc.rect(ML, y - 3.5, CW, 5, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6.5);
          doc.setTextColor(255, 255, 255);
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6.5);
          doc.setTextColor(...CD);
        }
        let x = ML + 1.5;
        cols.forEach(([text, w]) => {
          doc.text(String(text).slice(0, Math.floor(w / 1.6)), x, y, { align: 'left' });
          x += w;
        });
        if (header) doc.setDrawColor(...CC);
        else doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.15);
        doc.line(ML, y + 1.5, PW - MR, y + 1.5);
        return y + 5;
      };

      const progressBar = (pct, y, color) => {
        doc.setFillColor(226, 232, 240);
        doc.roundedRect(ML, y, CW, 2, 0.5, 0.5, 'F');
        doc.setFillColor(...color);
        const w = Math.max(2, (CW * Math.min(pct, 100)) / 100);
        doc.roundedRect(ML, y, w, 2, 0.5, 0.5, 'F');
      };

      // ===== PAGE 1 =====
      drawHeader();

      // -- Resumen General --
      sectionTitle('Resumen General');
      checkPage(25);

      const cards = [
        { label: 'PROGRESO', val: `${Math.round(courseProgress)}%` },
        { label: 'NIVEL', val: String(level) },
        { label: 'XP TOTAL', val: String(xp) },
        { label: 'RACHA', val: `${streak}d` },
        { label: 'LECCIONES', val: `${totalLessonsCompleted}/${totalLessonsCount}` },
      ];
      const cw = (CW - 8) / 5;
      cards.forEach((c, i) => {
        const cx = ML + i * (cw + 2);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(cx, cy - 1, cw, 11, 0.8, 0.8, 'F');
        doc.setDrawColor(...CC);
        doc.setLineWidth(0.15);
        doc.roundedRect(cx, cy - 1, cw, 11, 0.8, 0.8, 'S');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);
        doc.setTextColor(...CG);
        doc.text(c.label, cx + 1.5, cy + 2.5);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...CP);
        doc.text(c.val, cx + 1.5, cy + 8.5);
      });
      cy += 14;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...CD);
      doc.text(`Sesiones: ${sessionStats.sessionCount} · Días activo: ${daysActive} · Tiempo estudio: ${studyHours}h ${studyMins}m · Inicio: hace ${daysSinceStart || 0} días${estimatedEndDate ? ` · Final estimado: ${estimatedEndDate}` : ''}`, ML, cy);
      cy += 8;

      // -- Progreso por Módulo --
      sectionTitle('Progreso por Módulo');
      const mCols = [['Módulo', 42], ['Puntaje', 14], ['Examen', 14], ['Desafío', 14], ['Estado', 22], ['', CW - 42 - 14 - 14 - 14 - 22]];
      cy = tableRow(mCols, cy, true);

      moduleScores.forEach((mod, i) => {
        checkPage(8);
        const passed = mod.score >= 80;
        const state = completedModules.includes(mod.id) ? '✓ Completado' : '○ En curso';
        const stripe = i % 2 === 1;
        if (stripe) {
          doc.setFillColor(248, 250, 252);
          doc.rect(ML, cy - 3.5, CW, 5.5, 'F');
        }
        cy = tableRow([
          [mod.title, 42], [`${mod.score}%`, 14], [`${mod.examScore}%`, 14],
          [`${mod.challengeScore}%`, 14], [state, 22],
        ], cy, false);
        const barC = passed ? [16, 185, 129] : mod.score >= 60 ? [245, 158, 11] : [148, 163, 184];
        progressBar(mod.score, cy - 0.5, barC);
        cy += 1.5;
      });
      cy += 4;

      // -- Lecciones por Módulo --
      checkPage(20);
      sectionTitle('Progreso de Lecciones');
      const lCols = [['Módulo', 42], ['Completadas', 22], ['Total', 14], ['Avance', CW - 42 - 22 - 14]];
      cy = tableRow(lCols, cy, true);
      MODULE_RESOURCES.forEach((cfg, i) => {
        const modLess = lessonProgress?.[cfg.id] || {};
        const done = Object.values(modLess).filter(s => s === 'completed').length;
        const total = ALL_LESSONS?.[cfg.id]?.length || 0;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        const stripe = i % 2 === 1;
        if (stripe) {
          doc.setFillColor(248, 250, 252);
          doc.rect(ML, cy - 3.5, CW, 5.5, 'F');
        }
        cy = tableRow([[cfg.title, 42], [String(done), 22], [String(total), 14]], cy, false);
        const lBarC = pct >= 80 ? [16, 185, 129] : pct >= 50 ? [245, 158, 11] : [148, 163, 184];
        progressBar(pct, cy - 0.5, lBarC);
        cy += 1.5;
      });
      cy += 4;
      addFooter();

      // ===== PAGE 2 =====
      doc.addPage();
      drawHeader();

      // -- Actividades Recientes --
      sectionTitle('Actividades Recientes');
      const aCols = [['Actividad', 55], ['Módulo', 50], ['Puntaje', 13], ['Fecha', CW - 55 - 50 - 13]];
      cy = tableRow(aCols, cy, true);

      const topActs = activitiesData.slice(0, 30);
      if (topActs.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...CG);
        doc.text('No hay actividades registradas aún.', ML, cy + 4);
        cy += 8;
      } else {
        topActs.forEach((act, i) => {
          checkPage(5);
          const mn = MODULE_NAMES[act.module_id] || `Módulo ${act.module_id}`;
          const ds = act.completed_at ? new Date(act.completed_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
          const stripe = i % 2 === 1;
          if (stripe) {
            doc.setFillColor(248, 250, 252);
            doc.rect(ML, cy - 3.5, CW, 5, 'F');
          }
          cy = tableRow([
            [act.title.slice(0, 42), 55],
            [mn.slice(0, 35), 50],
            [act.score ? `${act.score}%` : '✓', 13],
            [ds, CW - 55 - 50 - 13],
          ], cy, false);
        });
      }
      cy += 6;

      // -- Estadísticas --
      checkPage(35);
      sectionTitle('Resumen de Recursos');
      const sCols = [['Recurso', 40], ['Valor', 30], ['Avance', CW - 40 - 30]];
      cy = tableRow(sCols, cy, true);
      const statsR = [
        ['Videos', `${totalVideos}/${totalVideosTarget}`, totalVideosTarget > 0 ? totalVideos / totalVideosTarget : 0],
        ['Infografías', `${totalInfographics}/${totalInfographicsTarget}`, totalInfographicsTarget > 0 ? totalInfographics / totalInfographicsTarget : 0],
        ['Exámenes', `${totalExams}/5`, totalExams / 5],
        ['Desafíos', `${totalChallenges}/5`, totalChallenges / 5],
        ['Foro (posts)', String(forumPostCount || 0), 0],
        ['Foro (comentarios)', String(forumCommentCount || 0), 0],
        ['Badges', String(badges?.length || 0), 0],
      ];
      statsR.forEach(([label, val, pct], i) => {
        const stripe = i % 2 === 1;
        if (stripe) {
          doc.setFillColor(248, 250, 252);
          doc.rect(ML, cy - 3.5, CW, 5, 'F');
        }
        cy = tableRow([[label, 40], [String(val), 30]], cy, false);
        if (pct > 0) {
          const sbC = pct >= 0.8 ? [16, 185, 129] : pct >= 0.5 ? [245, 158, 11] : [148, 163, 184];
          progressBar(pct * 100, cy - 0.5, sbC);
        }
        cy += 1.5;
      });
      cy += 4;

      // -- Recomendación --
      if (weakestModule && weakestModule.score < 80) {
        checkPage(12);
        sectionTitle('Recomendación');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...CD);
        doc.text(`Tu módulo con menor rendimiento es "${weakestModule.title}" (${weakestModule.score}%).`, ML, cy);
        cy += 4;
        doc.text('Enfócate en repasar los videos, infografías y completar el examen y desafío pendientes para mejorar tu promedio general.', ML, cy, { maxWidth: CW });
        cy += 6;
      }

      // -- XP & Nivel --
      checkPage(12);
      sectionTitle('XP y Nivel');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...CD);
      doc.text(`Nivel actual: ${level} · XP total: ${xp}`, ML, cy);
      cy += 4;
      const xpPct = getLevelProgress ? getLevelProgress() : 50;
      const nextLvl = getXpForNextLevel ? getXpForNextLevel() : 0;
      doc.text(`Progreso al siguiente nivel: ${Math.round(xpPct)}% (${xp}/${nextLvl > 0 ? nextLvl : '—'} XP)`, ML, cy);
      cy += 4;
      progressBar(xpPct, cy, CP);
      cy += 6;

      addFooter();
      doc.save(`historial_ialab_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  const AccordionSection = React.memo(({ id, title, icon, children }) => {
    const isOpen = accordionSections[id] ?? true;
    return (
      <div className="mb-4 bg-white rounded-xl border border-slate-200/40 shadow-sm overflow-hidden">
        <button
          onClick={() => setAccordionSections(prev => ({ ...prev, [id]: !prev[id] }))}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50/50 transition-colors"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5">
            {icon && <Icon name={icon} className="text-petroleum text-sm" />}
            <h3 className="text-xs font-bold text-petroleum uppercase tracking-wider">{title}</h3>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon name="fa-chevron-down" className="text-slate-400 text-[10px]" />
          </motion.div>
        </button>
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="p-4 sm:p-5 pt-0">
            {children}
          </div>
        </motion.div>
      </div>
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      role="dialog"
      aria-modal="true"
      aria-label="Mi Historial de Aprendizaje"
      aria-describedby="activity-history-desc"
      className={`fixed inset-0 z-[1050] flex items-start justify-center bg-black/50 transition-all duration-300 ${isExpanded ? 'p-0' : 'pt-16 sm:pt-20 px-2 sm:px-4'}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        ref={(el) => { panelRef.current = el; focusTrapRef.current = el; }} className={`bg-white shadow-[0_8px_32px_rgba(0,75,99,0.12)] w-full overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-w-none max-h-screen rounded-none' : 'rounded-2xl max-w-5xl max-h-[80vh]'
      }`}>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-sm ring-1 ring-white/10">
              <Icon name="fa-clock" className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg font-montserrat tracking-tight">Mi Historial de Aprendizaje</h1>
              <p className="text-white/60 text-xs">Progreso sincronizado · {totalLessonsCompleted}/{totalLessonsCount} lecciones · {xp} XP</p>
              <span id="activity-history-desc" className="sr-only">
                Panel con tu progreso en el curso IALab. {totalLessonsCompleted} de {totalLessonsCount} lecciones completadas, nivel {level}, {xp} XP acumulados, racha de {streak} días. Contiene {TABS.length} secciones: {TABS.map(t => t.label).join(', ')}.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <button onClick={exportProgressPDF} disabled={pdfLoading} className="min-w-[36px] min-h-[36px] w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 active:scale-90 ring-1 ring-white/10 disabled:opacity-50" aria-label="Exportar PDF">
              <Icon name={pdfLoading ? 'fa-spinner' : 'fa-file-pdf'} className={`text-white text-xs ${pdfLoading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setIsExpanded(v => !v)} className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 active:scale-90 ring-1 ring-white/10" aria-label={isExpanded ? 'Contraer pantalla' : 'Expandir pantalla'}>
              <Icon name={isExpanded ? 'fa-compress' : 'fa-expand'} className="text-white text-sm" />
            </button>
            <button onClick={onClose} className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 active:scale-90 ring-1 ring-white/10" aria-label="Cerrar historial">
              <Icon name="fa-times" className="text-white text-sm" />
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-b from-petroleum/[0.02] to-white border-b border-slate-200/40">
          {[
            { icon: 'fa-chart-line', value: `${Math.round(courseProgress || 0)}%`, label: 'Progreso', color: 'text-petroleum' },
            { icon: 'fa-trophy', value: `Nv.${level}`, label: `${xp} XP`, color: 'text-warning' },
            { icon: 'fa-check-circle', value: `${totalLessonsCompleted}/${totalLessonsCount}`, label: 'Lecciones', color: 'text-success' },
            { icon: 'fa-fire', value: `${streak}d`, label: getStreakMessage(), color: streak >= 3 ? 'text-orange-500' : 'text-slate-400' },
            { icon: 'fa-clock', value: lastActivityTime || '—', label: 'Última conexión', color: 'text-petroleum', small: true },
          ].map((item, i) => (
            <div key={i} className={`group bg-white rounded-xl border border-slate-200/60 shadow-sm p-2 sm:p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${item.small ? 'col-span-2 sm:col-span-1' : ''}`}>
              <Icon name={item.icon} className={`text-lg sm:text-xl mx-auto mb-1 group-hover:scale-110 transition-transform duration-200 ${item.color}`} />
              <p className={`text-base sm:text-lg font-bold font-montserrat tracking-tight ${item.color} ${item.small ? 'text-xs sm:text-sm truncate' : ''}`}>{item.value}</p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6 pt-3 border-b border-slate-200/40 bg-white">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-4 min-h-[44px] text-xs font-bold rounded-t-lg transition-all duration-200 flex items-center gap-2 active:scale-95 flex-shrink-0 ${
                  activeTab === tab.key ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm border border-transparent' : 'text-slate-500 hover:text-petroleum hover:bg-slate-50 border border-transparent'
                }`}>
                <Icon name={tab.icon} className={`text-[10px] ${activeTab === tab.key ? 'text-white' : 'text-petroleum'}`} />{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={`overflow-y-auto modal-scrollable ${isExpanded ? 'max-h-[calc(100vh-280px)]' : 'max-h-[55vh] md:max-h-[45vh]'}`}>
          {activeTab === 'modules' && (
            <div className="p-3 sm:p-5 space-y-2.5">
              <SectionHeader title="Progreso por Módulo" />
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
              <div className="px-4 sm:px-6 py-3 border-b border-slate-200/40 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-petroleum uppercase tracking-wider mr-0.5">Filtrar:</span>
                  {FILTER_OPTIONS.map(({ key, label, icon }) => (
                    <button key={key} onClick={() => setFilter(key)}
                      className={`px-3 min-h-[44px] text-[10px] font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                        filter === key ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
                    <div key={date} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-petroleum/[0.02] transition-colors">
                      <div className="flex items-center gap-2.5 mb-3">
                        <SectionLine />
                        <p className="text-[11px] font-bold text-petroleum uppercase tracking-wider">{formatDate(date)}</p>
                        <div className="flex-1 h-px bg-gradient-to-r from-petroleum/10 to-transparent" />
                      </div>
                      <div className="space-y-2">
                        {groupedByDate[date].map(activity => {
                          const config = ACTIVITY_CONFIG[activity.activity_type] || ACTIVITY_CONFIG.resource;
                          const moduleName = MODULE_NAMES[activity.module_id] || `Módulo ${activity.module_id}`;
                          return (
                            <div key={activity.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/40 shadow-sm hover:shadow-md hover:border-slate-300/50 hover:-translate-y-0.5 transition-all duration-200 group">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}
                                style={{ background: `linear-gradient(135deg, ${config.color}15, ${config.color}08)` }}>
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
                                  activity.score >= 80 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm shadow-emerald-500/5' : 'bg-petroleum/5 text-petroleum border border-petroleum/10'
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
            <div className="p-3 sm:p-5 space-y-4">

              <div className="bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate rounded-xl shadow-lg p-5 sm:p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
                    <Icon name="fa-chart-line" className="text-sm text-white" />
                  </div>
                  <h2 className="text-sm font-bold font-montserrat tracking-wide text-white/90">Resumen Ejecutivo</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">XP Total</p>
                    <p className="text-xl font-bold font-montserrat tracking-tight mt-0.5">{xp}</p>
                    <p className="text-[10px] text-white/70 mt-0.5">Nivel {level}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">Meta Semanal</p>
                    <p className="text-xl font-bold font-montserrat tracking-tight mt-0.5">{weeklyXP.weekly}/{weeklyXP.weeklyTarget}</p>
                    <div className="mt-1.5 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${weeklyXP.weeklyPct}%` }} />
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">Tiempo Estudio</p>
                    <p className="text-xl font-bold font-montserrat tracking-tight mt-0.5">{sessionStats.sessionCount > 0 || liveSeconds >= 30 ? `${studyHours}h ${studyMins}m` : '—'}</p>
                    <p className="text-[10px] text-white/70 mt-0.5">{daysActive} días activo</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">Progreso Curso</p>
                    <p className="text-xl font-bold font-montserrat tracking-tight mt-0.5">{Math.round(courseProgress || 0)}%</p>
                    <div className="mt-1.5 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-300 transition-all duration-500" style={{ width: `${Math.min(courseProgress || 0, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/40 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                      <Icon name="fa-tachometer-alt" className="text-petroleum text-sm" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-petroleum uppercase tracking-wider">Progreso Global</h3>
                      <p className="text-[10px] text-slate-400">{totalVideos + totalInfographics + totalExams + totalChallenges + completedCount}/{totalItems} recursos completados</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-petroleum font-montserrat tracking-tight">{Math.round(courseProgress || 0)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full rounded-full bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate transition-all duration-1000 ease-out shadow-sm" style={{ width: `${Math.min(courseProgress || 0, 100)}%` }} />
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-slate-100 text-[10px] font-medium text-slate-400">
                  <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-petroleum" />{completedCount}/5 módulos</span>
                  <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-corporate" />{totalVideos}/{totalVideosTarget} videos</span>
                  <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{totalExams + totalChallenges}/10 eval.</span>
                </div>
              </div>

              <AccordionSection id="estudio" title="Tiempo de Estudio" icon="fa-clock">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                  <div className="text-center p-3 rounded-xl bg-gradient-to-b from-petroleum/5 to-transparent border border-petroleum/10">
                    <div className="text-xl font-bold text-petroleum">{sessionStats.sessionCount > 0 || liveSeconds >= 30 ? `${studyHours}h ${studyMins}m` : '—'}</div>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">Tiempo total</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-b from-corporate/5 to-transparent border border-corporate/10">
                    <div className="text-xl font-bold text-corporate">{sessionStats.sessionCount}</div>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">Sesiones</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-b from-emerald-500/5 to-transparent border border-emerald-500/10">
                    <div className="text-xl font-bold text-emerald-600">{daysActive}</div>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">Días activo</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-b from-amber-500/5 to-transparent border border-amber-500/10">
                    <div className="text-xl font-bold text-amber-600">{sessionStats.sessionCount > 0 || liveSeconds >= 30 ? `${Math.round(effectiveTodayMinutes)} min` : '—'}</div>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">Hoy</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1">
                      {['7d', '30d', 'all'].map(r => (
                        <button key={r} onClick={() => setTimeRange(r)}
                          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all duration-200 ${
                            timeRange === r ? 'bg-petroleum text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}>
                          {r === '7d' ? '7 días' : r === '30d' ? '30 días' : 'Todo'}
                        </button>
                      ))}
                    </div>
                    <span className="text-[9px] text-slate-400">{studyHours}h {studyMins}m total</span>
                  </div>
                  <div className="h-32 sm:h-40" role="img" aria-label={`Gráfico de tiempo de estudio: ${monthlyData.filter(d => d.mins > 0).length} días con actividad. Total: ${studyHours}h ${studyMins}m.`}>
                    {monthlyData.length > 0 && monthlyData.some(d => d.mins > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                          <XAxis dataKey="label" tick={{ fontSize: 8, fill: '#94A3B8' }} interval="preserveStartEnd" />
                          <YAxis hide domain={[0, 'dataMax']} />
                          <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                            formatter={(value) => [`${value} min`, 'Tiempo']}
                            labelFormatter={(label) => label}
                          />
                          <Bar dataKey="mins" radius={[3, 3, 0, 0]} maxBarSize={timeRange === '7d' ? 32 : 12}>
                            {monthlyData.map((entry, idx) => (
                              <Cell key={idx} fill={entry.mins > 0 ? '#004B63' : '#F1F5F9'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-xs text-slate-400">Aún no hay datos de tiempo. Comienza a estudiar para ver tu progreso.</p>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionSection>

              <AccordionSection id="progreso" title="Progreso y Rendimiento" icon="fa-chart-bar">
                {activityDistribution.length > 1 && (
                  <div className="mb-5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Actividad por Tipo</h4>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-36 h-36 flex-shrink-0" role="img" aria-label={`Distribución de actividades: ${activityDistribution.map(a => `${a.name} ${a.pct}%`).join(', ')}`}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={activityDistribution} cx="50%" cy="50%" innerRadius={28} outerRadius={52} paddingAngle={2} dataKey="value">
                              {activityDistribution.map((entry, idx) => (
                                <Cell key={idx} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E2E8F0' }}
                              formatter={(value, name, props) => [`${value} (${props.payload.pct}%)`, props.payload.name]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-2 w-full">
                        {activityDistribution.map(item => (
                          <div key={item.key} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-semibold text-slate-700 truncate">{item.name}</p>
                              <div className="flex items-center gap-1">
                                <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                                </div>
                                <span className="text-[9px] font-bold text-slate-500">{item.pct}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Puntaje por Módulo</h4>
                  <div className="space-y-2.5">
                    {moduleScores.map(mod => {
                      const barColor = mod.score >= 80 ? 'from-emerald-500 to-emerald-400' : mod.score >= 60 ? 'from-amber-500 to-amber-400' : 'from-slate-400 to-slate-300';
                      return (
                        <div key={mod.id} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center flex-shrink-0">
                            <Icon name={mod.icon} className="text-[10px] text-petroleum" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[11px] font-semibold text-slate-700 truncate">{mod.title}</span>
                              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                {mod.examScore > 0 && (
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
                                    mod.examScore >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                                  }`}>E:{mod.examScore}%</span>
                                )}
                                {mod.challengeScore > 0 && (
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
                                    mod.challengeScore >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                                  }`}>D:{mod.challengeScore}%</span>
                                )}
                                {mod.dominance && (
                                  <span className={`text-[8px] font-bold px-1.5 py-[1px] rounded-md border ${mod.dominance.bg} ${mod.dominance.color}`}>{mod.dominance.label}</span>
                                )}
                                <span className={`text-[10px] font-bold ${mod.score >= 80 ? 'text-emerald-600' : mod.score >= 60 ? 'text-amber-600' : 'text-slate-500'}`}>{Math.round(mod.score)}%</span>
                              </div>
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
              </AccordionSection>

              <AccordionSection id="logros" title="Logros y Medallas" icon="fa-star">
                {badges && badges.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                      {badges.map(badgeId => {
                        const info = BADGE_INFO?.[badgeId] || { icon: 'fa-star', label: badgeId, desc: '', color: '#94A3B8' };
                        return (
                          <div key={badgeId} className="group bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200/40 shadow-sm p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/10 to-amber-500/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                              <Icon name={info.icon} className="text-sm" style={{ color: info.color }} />
                            </div>
                            <p className="text-[10px] font-bold text-slate-700 leading-tight">{info.label}</p>
                            <p className="text-[8px] text-slate-400 mt-0.5">{info.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                    {nextBadge && (
                      <div className="pt-3 border-t border-slate-100/80">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center opacity-60 flex-shrink-0">
                              <Icon name={nextBadge.icon} className="text-[10px] text-slate-500" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 leading-tight">Siguiente: {nextBadge.label}</p>
                              <p className="text-[8px] text-slate-400">{nextBadge.desc}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{nextBadge.current}/{nextBadge.target}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-slate-300 to-slate-400 transition-all duration-500" style={{ width: `${(nextBadge.current / nextBadge.target) * 100}%` }} />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">Aún no has obtenido medallas. ¡Sigue avanzando para desbloquear logros!</p>
                )}
              </AccordionSection>

              <div className="flex items-center justify-end gap-2 px-1">
                <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500' : syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
                <span className="text-[10px] font-medium text-slate-400">{syncStatus === 'synced' ? 'Datos sincronizados' : syncStatus === 'syncing' ? 'Sincronizando...' : syncStatus === 'offline' ? 'Modo offline' : 'Datos locales'}</span>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="p-3 sm:p-5">
              {personalizedRecs.high.length === 0 && personalizedRecs.medium.length === 0 && personalizedRecs.low.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-5 shadow-inner">
                    <Icon name="fa-check-circle" className="text-emerald-500 text-3xl" />
                  </div>
                  <p className="text-base font-bold text-slate-700 font-montserrat">¡Todo al día!</p>
                  <p className="text-xs text-slate-400 text-center mt-1.5 max-w-xs leading-relaxed">No hay recomendaciones pendientes. Sigue así y continúa avanzando en tu curso.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {personalizedRecs.high.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-3 px-0.5">
                        <div className="w-4 h-4 rounded bg-rose-100 flex items-center justify-center">
                          <Icon name="fa-flag" className="text-[8px] text-rose-600" />
                        </div>
                        <p className="text-[10px] font-bold text-rose-700 uppercase tracking-[0.15em]">Prioritarias</p>
                        <div className="flex-1 h-px bg-gradient-to-r from-rose-200 to-transparent" />
                      </div>
                      <div className="space-y-2">
                        {personalizedRecs.high.map((rec, i) => (
                          <motion.div
                            key={rec.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.2 }}
                            className="group bg-white rounded-xl border border-rose-200/60 shadow-sm p-4 hover:shadow-md hover:border-rose-300/50 hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Icon name={rec.icon} className="text-sm text-rose-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800">{rec.title}</p>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rec.text}</p>
                              </div>
                            </div>
                            {rec.action && (
                              <div className="mt-3 flex justify-end">
                                <button className="px-4 py-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors active:scale-95">
                                  <Icon name="fa-arrow-right" className="text-[9px] mr-1" />{rec.action.label}
                                </button>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {personalizedRecs.medium.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-3 px-0.5">
                        <div className="w-4 h-4 rounded bg-amber-100 flex items-center justify-center">
                          <Icon name="fa-list" className="text-[8px] text-amber-600" />
                        </div>
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.15em]">Sugerencias</p>
                        <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
                      </div>
                      <div className="space-y-2">
                        {personalizedRecs.medium.map((rec, i) => (
                          <motion.div
                            key={rec.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.2 }}
                            className="group bg-white rounded-xl border border-amber-200/40 shadow-sm p-4 hover:shadow-md hover:border-amber-300/50 hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Icon name={rec.icon} className="text-sm text-amber-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800">{rec.title}</p>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rec.text}</p>
                              </div>
                            </div>
                            {rec.action && (
                              <div className="mt-3 flex justify-end">
                                <button className="px-4 py-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors active:scale-95">
                                  <Icon name="fa-arrow-right" className="text-[9px] mr-1" />{rec.action.label}
                                </button>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {personalizedRecs.low.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-3 px-0.5">
                        <div className="w-4 h-4 rounded bg-sky-100 flex items-center justify-center">
                          <Icon name="fa-lightbulb" className="text-[8px] text-sky-600" />
                        </div>
                        <p className="text-[10px] font-bold text-sky-700 uppercase tracking-[0.15em]">Tips</p>
                        <div className="flex-1 h-px bg-gradient-to-r from-sky-200 to-transparent" />
                      </div>
                      <div className="space-y-2">
                        {personalizedRecs.low.map((rec, i) => (
                          <motion.div
                            key={rec.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03, duration: 0.2 }}
                            className="group bg-white rounded-xl border border-sky-200/40 shadow-sm p-4 hover:shadow-md hover:border-sky-300/50 hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Icon name={rec.icon} className="text-sm text-sky-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800">{rec.title}</p>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rec.text}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActivityHistory;
