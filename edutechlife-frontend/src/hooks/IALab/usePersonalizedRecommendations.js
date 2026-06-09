import { useMemo } from 'react';
import { useIALabStore } from '../../store/ialabStore';
import { ALL_LESSONS, BADGE_INFO } from '../../data/ialab';
import { calcModuleScore } from '../../utils/ialab';
import { WEIGHTS } from '../../constants/ialab';

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

export default function usePersonalizedRecommendations() {
  const streak = useIALabStore(s => s.streak);
  const lastActivityDate = useIALabStore(s => s.lastActivityDate);
  const badges = useIALabStore(s => s.badges);
  const getLevel = useIALabStore(s => s.getLevel);
  const getLevelProgress = useIALabStore(s => s.getLevelProgress);
  const getXpForNextLevel = useIALabStore(s => s.getXpForNextLevel);
  const getTotalPoints = useIALabStore(s => s.getTotalPoints);
  const moduleProgress = useIALabStore(s => s.moduleProgress);
  const getDaysSinceStart = useIALabStore(s => s.getDaysSinceStart);
  const completedModules = useIALabStore(s => s.completedModules);
  const completedVideos = useIALabStore(s => s.completedVideos);
  const completedExams = useIALabStore(s => s.completedExams);
  const completedInfographics = useIALabStore(s => s.completedInfographics);
  const challengeScores = useIALabStore(s => s.challengeScores);
  const courseProgress = useIALabStore(s => s.courseProgress);
  const getWeeklyXP = useIALabStore(s => s.getWeeklyXP);
  const getDetailedRecommendations = useIALabStore(s => s.getDetailedRecommendations);
  const forumPostCount = useIALabStore(s => s.forumPostCount);
  const lessonProgress = useIALabStore(s => s.lessonProgress);

  const completedCount = completedModules?.length || 0;
  const totalExams = Object.values(completedExams || {}).filter(s => s > 0).length;
  const totalChallenges = Object.values(challengeScores || {}).filter(s => s > 0).length;
  const totalLessonsCompleted = lessonProgress
    ? Object.values(lessonProgress).reduce((sum, mod) => sum + Object.values(mod).filter(s => s === 'completed').length, 0)
    : 0;
  const daysSinceStart = getDaysSinceStart();
  const lessonsPerDay = daysSinceStart > 0 ? (totalLessonsCompleted / daysSinceStart) : 0;
  const totalLessonsCount = ALL_LESSONS ? Object.values(ALL_LESSONS).reduce((sum, arr) => sum + arr.length, 0) : 0;
  const remainingLessons = totalLessonsCount - totalLessonsCompleted;
  const estimatedDaysRemaining = lessonsPerDay > 0 ? Math.ceil(remainingLessons / lessonsPerDay) : 0;

  const modulesPerDay = daysSinceStart > 0 ? completedCount / daysSinceStart : 0;
  const remainingModules = 5 - completedCount;
  const modsForecastDays = modulesPerDay > 0 ? Math.ceil(remainingModules / modulesPerDay) : null;

  const weightedDays = modsForecastDays !== null
    ? Math.round((estimatedDaysRemaining + modsForecastDays * 7) / 2)
    : estimatedDaysRemaining;

  const completionForecast = weightedDays > 0
    ? {
        estimatedDate: new Date(Date.now() + weightedDays * 86400000),
        daysRemaining: weightedDays,
        pace: weightedDays <= 15 ? 'fast' : weightedDays <= 45 ? 'moderate' : 'slow',
        conservative: weightedDays > 15 ? Math.ceil(weightedDays * 1.4) : Math.ceil(weightedDays * 1.2),
        optimistic: Math.ceil(weightedDays * 0.6),
      }
    : null;

  const recommendations = getDetailedRecommendations();

  const moduleScores = [1, 2, 3, 4, 5].map(id => {
    const config = MODULE_RESOURCES.find(r => r.id === id) || MODULE_RESOURCES[0];
    const moduleVideos = (completedVideos || []).filter(v => v.startsWith(`m${id}`)).length;
    const moduleInfographics = (completedInfographics || []).filter(i => i.startsWith(`i${id}`)).length;
    const totalResources = config.videos + config.infographics;
    const exam = completedExams?.[id] || 0;
    const challenge = challengeScores?.[id] || 0;

    const fallbackScore = calcModuleScore({
      exam: exam >= 80,
      examEarned: (exam / 100) * WEIGHTS.exam,
      challenge: challenge >= 80,
      challengeEarned: (challenge / 100) * WEIGHTS.challenge,
      resourcesCompleted: totalResources > 0 && (moduleVideos + moduleInfographics) / totalResources >= 0.8,
      community: (completedModules || []).includes(id),
    });

    return {
      id,
      title: MODULE_NAMES[id],
      score: moduleProgress?.[id]?.currentScore ?? Math.round(fallbackScore),
      icon: MODULE_ICONS[id],
      examScore: completedExams?.[id] || 0,
      challengeScore: challengeScores?.[id] || 0,
    };
  });
  const weakestModule = [...moduleScores].sort((a, b) => a.score - b.score)[0];

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

  return useMemo(() => {
    const recs = [];

    moduleScores.forEach(mod => {
      if (mod.score < 80) {
        const cfg = MODULE_RESOURCES.find(m => m.id === mod.id);
        const pendingVideos = (cfg?.videos || 0) - completedVideos.filter(v => v.startsWith(`m${mod.id}`)).length;
        const pendingInfographics = (cfg?.infographics || 0) - completedInfographics.filter(i => i.startsWith(`i${mod.id}`)).length;
        const reasons = [];
        if (pendingVideos > 0) reasons.push(`${pendingVideos} videos`);
        if (pendingInfographics > 0) reasons.push(`${pendingInfographics} infografías`);
        if (!mod.examScore || mod.examScore < 80) reasons.push('examen pendiente');
        if (!mod.challengeScore || mod.challengeScore < 80) reasons.push('desafío pendiente');
        recs.push({
          id: `module_${mod.id}_score`,
          type: 'module_score',
          urgency: mod.id === weakestModule?.id ? 'high' : 'medium',
          icon: 'fa-cubes',
          title: `Módulo ${mod.id}: ${mod.title}`,
          text: `Te falta completar el módulo (${mod.score}%). Pendiente${reasons.length > 1 ? 's' : ''}: ${reasons.join(', ')}.`,
          action: { label: 'Ir al módulo', moduleId: mod.id },
          moduleId: mod.id,
        });
      }
    });

    if (totalExams < 2) {
      recs.push({
        id: 'exams_low',
        type: 'exams',
        urgency: 'high',
        icon: 'fa-file-alt',
        title: 'Exámenes pendientes',
        text: `Llevas solo ${totalExams}/5 exámenes aprobados. Cada examen completo suma hasta 100 XP. Prioriza los módulos con lecciones terminadas.`,
      });
    }

    if (totalChallenges < 2) {
      recs.push({
        id: 'challenges_low',
        type: 'challenges',
        urgency: 'medium',
        icon: 'fa-trophy',
        title: 'Desafíos sin completar',
        text: `Has completado ${totalChallenges}/5 desafíos. Cada desafío otorga 200 XP y mejora tu promedio general.`,
      });
    }

    if (lessonsPerDay < 0.8 && daysSinceStart > 5) {
      recs.push({
        id: 'slow_pace',
        type: 'pace',
        urgency: 'medium',
        icon: 'fa-gauge-high',
        title: 'Ritmo de estudio bajo',
        text: `Llevas ${lessonsPerDay.toFixed(1)} lecciones/día. Intenta al menos 20 minutos diarios para mantener el avance. Con 1 lección/día terminarías en ${estimatedDaysRemaining > 0 ? estimatedDaysRemaining : '~30'} días.`,
      });
    }

    if (streak === 0 && lastActivityDate) {
      const daysSince = Math.floor((Date.now() - new Date(lastActivityDate).getTime()) / 86400000);
      if (daysSince >= 1) {
        recs.push({
          id: 'streak_lost',
          type: 'streak',
          urgency: 'high',
          icon: 'fa-fire',
          title: 'Racha perdida',
          text: `Han pasado ${daysSince} día${daysSince > 1 ? 's' : ''} desde tu última actividad. Vuelve hoy para recuperar la consistencia y no perder tu progreso.`,
        });
      }
    }

    if (courseProgress < 30) {
      recs.push({
        id: 'progress_low',
        type: 'progress',
        urgency: 'medium',
        icon: 'fa-chart-line',
        title: 'Progreso general bajo',
        text: `Llevas ${Math.round(courseProgress)}% del curso. Identifica el módulo donde tengas más lecciones disponibles y empieza por ahí para avanzar rápido.`,
      });
    }

    if ((forumPostCount || 0) === 0 && completedModules.length >= 1) {
      recs.push({
        id: 'community',
        type: 'community',
        urgency: 'low',
        icon: 'fa-comments',
        title: 'Participación en comunidad',
        text: 'Aún no has participado en los foros. Compartir tus dudas y experiencias refuerza el aprendizaje y te conecta con otros estudiantes.',
      });
    }

    if (nextBadge) {
      recs.push({
        id: 'next_badge',
        type: 'badge',
        urgency: 'low',
        icon: 'fa-award',
        title: `Siguiente medalla: ${nextBadge.title || ''}`,
        text: `Te falta${nextBadge.current > 0 ? ` ${nextBadge.target - nextBadge.current}` : ''} para obtener "${nextBadge.title || nextBadge.badgeId}". Sigue avanzando para desbloquearla.`,
      });
    }

    recommendations.forEach(r => {
      if (!recs.some(ex => ex.moduleId === r.moduleId && ex.type === r.type)) {
        recs.push({
          id: `engine_${recs.length}`,
          type: r.type,
          urgency: r.urgency || 'medium',
          icon: r.type === 'exam' ? 'fa-file-alt' : r.type === 'challenge' ? 'fa-trophy' : 'fa-book-open',
          title: r.moduleName ? `${r.moduleName}` : 'Recomendación',
          text: r.text,
          action: r.moduleId ? { label: 'Ir al módulo', moduleId: r.moduleId } : null,
          moduleId: r.moduleId,
        });
      }
    });

    return { high: recs.filter(r => r.urgency === 'high'), medium: recs.filter(r => r.urgency === 'medium'), low: recs.filter(r => r.urgency === 'low'), completionForecast };
  }, [
    moduleScores, weakestModule,
    totalExams, totalChallenges, lessonsPerDay, daysSinceStart, estimatedDaysRemaining,
    streak, lastActivityDate, courseProgress, forumPostCount, completedModules,
    nextBadge, recommendations, completedVideos, completedInfographics, completionForecast,
  ]);
}
