import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { useActivityTracker } from "../hooks/useActivityTracker";
import { useTranslation } from "../i18n/I18nProvider";
import { useIALabStore } from "../store/ialabStore";
import usePersonalizedRecommendations from "../hooks/IALab/usePersonalizedRecommendations";
import { ALL_LESSONS, modules, BADGE_INFO } from "../data/ialab";
import { Icon } from "../utils/iconMapping.jsx";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import useFocusTrap from "../hooks/useFocusTrap";
import { getUnifiedSessionStats } from "../hooks/useSessionTracker";
import { supabase } from "../lib/supabase";
import ResourceBadge from "../components/ui/ResourceBadge";
import SectionHeader from "../components/ui/SectionHeader";
import ModuleProgressCard from "../components/IALab/ModuleProgressCard";

import {
  ACTIVITY_CONFIG,
  MODULE_NAMES,
  MODULE_ICONS,
  MODULE_RESOURCES,
  TABS,
  FILTER_OPTIONS,
} from "./activityHistory/activityConfig";
import {
  formatTimeAgo,
  formatDate,
  calculateModuleScore,
} from "./activityHistory/activityUtils";
import { exportProgressPDF } from "./activityHistory/activityPDFGenerator";
import {
  SectionLine,
  AccordionSection,
} from "./activityHistory/components/ActivityAccordion";
import { ActivityList } from "./activityHistory/components/ActivityList";
import {
  StudyTimeChart,
  ActivityDistributionChart,
} from "./activityHistory/components/StatsCharts";
import { RecommendationsList } from "./activityHistory/components/RecommendationsList";
import { StatsCards } from "./activityHistory/components/StatsCards";

const ActivityHistory = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { activities } = useActivityTracker();
  const lessonProgress = useIALabStore((s) => s.lessonProgress);
  const xp = useIALabStore((s) => s.xp);
  const streak = useIALabStore((s) => s.streak);
  const lastActivityDate = useIALabStore((s) => s.lastActivityDate);
  const badges = useIALabStore((s) => s.badges);
  const getLevel = useIALabStore((s) => s.getLevel);
  const getXpForNextLevel = useIALabStore((s) => s.getXpForNextLevel);
  const getLevelProgress = useIALabStore((s) => s.getLevelProgress);
  const getTotalPoints = useIALabStore((s) => s.getTotalPoints);
  const moduleProgress = useIALabStore((s) => s.moduleProgress);
  const getDaysSinceStart = useIALabStore((s) => s.getDaysSinceStart);
  const completedModules = useIALabStore((s) => s.completedModules);
  const completedVideos = useIALabStore((s) => s.completedVideos);
  const completedExams = useIALabStore((s) => s.completedExams);
  const completedInfographics = useIALabStore((s) => s.completedInfographics);
  const challengeScores = useIALabStore((s) => s.challengeScores);
  const courseProgress = useIALabStore((s) => s.courseProgress);
  const syncStatus = useIALabStore((s) => s.syncStatus);
  const userId = useIALabStore((s) => s.userId);
  const getWeeklyXP = useIALabStore((s) => s.getWeeklyXP);
  const getDetailedRecommendations = useIALabStore(
    (s) => s.getDetailedRecommendations,
  );
  const forumPostCount = useIALabStore((s) => s.forumPostCount);
  const forumCommentCount = useIALabStore((s) => s.forumCommentCount);
  const [activeTab, setActiveTab] = useState("modules");
  const [filter, setFilter] = useState("all");
  const [sessionStats, setSessionStats] = useState({
    todayMinutes: 0,
    allMinutes: 0,
    sessionCount: 0,
    daysActive: 0,
  });
  const [timeRange, setTimeRange] = useState("7d");
  const [accordionSections, setAccordionSections] = useState({
    estudio: true,
    progreso: true,
    logros: false,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const panelRef = useRef(null);
  const focusTrapRef = useFocusTrap(isOpen);
  const liveStartRef = useRef(null);
  const intervalRef = useRef(null);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [isOpen, onClose]);

  const refreshStats = useCallback(async () => {
    try {
      const res = userId
        ? await getUnifiedSessionStats(supabase, userId)
        : null;
      if (res) {
        setSessionStats(res.stats);
      } else {
        const local = JSON.parse(
          localStorage.getItem("ialab_session_log") || "[]",
        );
        const today = new Date().toDateString();
        const todaySessions = local.filter(
          (s) => new Date(s.completed_at).toDateString() === today,
        );
        setSessionStats({
          todayMinutes:
            todaySessions.reduce(
              (sum, s) => sum + Math.min(s.duration_seconds || 0, 21600),
              0,
            ) / 60,
          allMinutes:
            local.reduce(
              (sum, s) => sum + Math.min(s.duration_seconds || 0, 21600),
              0,
            ) / 60,
          sessionCount: local.length,
          daysActive: new Set(
            local.map((s) => new Date(s.completed_at).toDateString()),
          ).size,
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
    const trackedKey = new Set(
      trackedActivities.map((a) => `${a.activity_type}_${a.module_id}`),
    );
    const examActs = Object.entries(completedExams || {})
      .filter(([_, s]) => s > 0)
      .filter(([mid]) => !trackedKey.has(`exam_${mid}`))
      .map(([mid, score]) => ({
        id: `exam_${mid}`,
        module_id: parseInt(mid),
        activity_type: "exam",
        title: `Examen ${MODULE_NAMES[mid] || `Módulo ${mid}`}`,
        score,
        completed_at:
          trackedActivities.find(
            (a) => a.activity_type === "exam" && a.module_id === parseInt(mid),
          )?.completed_at || new Date().toISOString(),
      }));
    const challengeActs = Object.entries(challengeScores || {})
      .filter(([_, s]) => s > 0)
      .filter(([mid]) => !trackedKey.has(`challenge_${mid}`))
      .map(([mid, score]) => ({
        id: `challenge_${mid}`,
        module_id: parseInt(mid),
        activity_type: "challenge",
        title: `Desafío ${MODULE_NAMES[mid] || `Módulo ${mid}`}`,
        score,
        completed_at:
          trackedActivities.find(
            (a) =>
              a.activity_type === "challenge" && a.module_id === parseInt(mid),
          )?.completed_at || new Date().toISOString(),
      }));
    const moduleActs = (completedModules || [])
      .filter(
        (m) =>
          !examActs.some((e) => e.module_id === m) &&
          !challengeActs.some((c) => c.module_id === m) &&
          !trackedKey.has(`resource_${m}`),
      )
      .map((mid) => ({
        id: `module_${mid}`,
        module_id: mid,
        activity_type: "resource",
        title: `${MODULE_NAMES[mid] || `Módulo ${mid}`} Completado`,
        score: Math.round(
          calculateModuleScore(
            mid,
            MODULE_RESOURCES.find((r) => r.id === mid) || MODULE_RESOURCES[0],
            completedVideos,
            completedInfographics,
            completedExams,
            challengeScores,
            completedModules,
          ) || 80,
        ),
        completed_at:
          trackedActivities.find((a) => a.module_id === mid)?.completed_at ||
          new Date().toISOString(),
      }));
    const lessonActs = [];
    if (lessonProgress) {
      Object.entries(lessonProgress).forEach(([mid, lessons]) => {
        const moduleId = parseInt(mid);
        const moduleLessons = ALL_LESSONS?.[moduleId] || [];
        Object.entries(lessons).forEach(([lid, status]) => {
          if (status !== "completed") return;
          const lesson = moduleLessons.find((l) => l.id === parseInt(lid));
          if (!lesson) return;
          lessonActs.push({
            id: `lesson_${mid}_${lid}`,
            module_id: moduleId,
            activity_type: "lesson",
            title: lesson.title,
            score: 100,
            completed_at:
              trackedActivities.find(
                (a) => a.activity_type === "lesson" && a.module_id === moduleId,
              )?.completed_at || new Date().toISOString(),
          });
        });
      });
    }
    const communityActs = [];
    const totalForum = (forumPostCount || 0) + (forumCommentCount || 0);
    if (totalForum > 0 && !trackedKey.has("community_0")) {
      communityActs.push({
        id: `community_0`,
        module_id: 0,
        activity_type: "community",
        title: `${totalForum} aporte${totalForum > 1 ? "s" : ""} en la comunidad`,
        score: 100,
        completed_at: new Date().toISOString(),
      });
    }
    const all = [
      ...trackedActivities,
      ...examActs,
      ...challengeActs,
      ...moduleActs,
      ...lessonActs,
      ...communityActs,
    ];
    const seen = new Set();
    return all
      .filter((a) => {
        const k = `${a.activity_type}_${a.module_id}_${a.id}_${trackedKey.has(`${a.activity_type}_${a.module_id}`) ? "real" : "synth"}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
  }, [
    activities,
    completedExams,
    challengeScores,
    completedModules,
    completedVideos,
    completedInfographics,
    lessonProgress,
    forumPostCount,
    forumCommentCount,
  ]);

  const weeklyData = useMemo(() => {
    const days = [];
    const now = new Date();
    const sessions = JSON.parse(
      localStorage.getItem("ialab_session_log") || "[]",
    );
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toDateString();
      const daySessions = sessions.filter(
        (s) => new Date(s.completed_at).toDateString() === dStr,
      );
      const mins = Math.round(
        daySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60,
      );
      const maxMins = Math.max(
        ...[7, 14, 21, 28, 35].map((j) => {
          const ref = new Date(now);
          ref.setDate(ref.getDate() - j);
          const refStr = ref.toDateString();
          return (
            sessions
              .filter((s) => new Date(s.completed_at).toDateString() === refStr)
              .reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60
          );
        }),
        1,
      );
      days.push({
        label: d.toLocaleDateString("es-ES", { weekday: "short" }),
        mins,
        pct: Math.min(100, (mins / Math.max(maxMins, 1)) * 100),
      });
    }
    return days;
  }, [sessionStats]);

  const monthlyData = useMemo(() => {
    const days = [];
    const now = new Date();
    const sessions = JSON.parse(
      localStorage.getItem("ialab_session_log") || "[]",
    );
    const range = timeRange === "30d" ? 29 : timeRange === "all" ? 89 : 6;
    for (let i = range; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toDateString();
      const daySessions = sessions.filter(
        (s) => new Date(s.completed_at).toDateString() === dStr,
      );
      const mins = Math.round(
        daySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60,
      );
      days.push({
        label: d.toLocaleDateString("es-ES", {
          weekday: "short",
          day: "numeric",
        }),
        mins,
        fullDate: d,
      });
    }
    return days;
  }, [sessionStats, timeRange]);

  const activityDistribution = useMemo(() => {
    const counts = {
      video: 0,
      exam: 0,
      challenge: 0,
      lesson: 0,
      community: 0,
      resource: 0,
    };
    (activities || []).forEach((a) => {
      if (counts[a.activity_type] !== undefined) counts[a.activity_type]++;
    });
    const colors = {
      video: "#004B63",
      exam: "#00BCD4",
      challenge: "#10B981",
      lesson: "#F59E0B",
      community: "#8B5CF6",
      resource: "#94A3B8",
    };
    const labels = {
      video: t("activity.filter.video"),
      exam: t("activity.filter.exam"),
      challenge: t("activity.filter.challenge"),
      lesson: t("activity.filter.lesson"),
      community: t("activity.filter.community"),
      resource: t("activity.config.resource"),
    };
    const total = Object.values(counts).reduce((s, v) => s + v, 0);
    return Object.entries(counts)
      .filter(([_, v]) => v > 0)
      .map(([k, v]) => ({
        name: labels[k],
        value: v,
        pct: total > 0 ? Math.round((v / total) * 100) : 0,
        color: colors[k],
        key: k,
      }));
  }, [activities]);

  const completedCount = completedModules?.length || 0;
  const totalExams = Object.values(completedExams || {}).filter(
    (s) => s > 0,
  ).length;
  const totalChallenges = Object.values(challengeScores || {}).filter(
    (s) => s > 0,
  ).length;
  const totalVideos = completedVideos?.length || 0;
  const totalInfographics = completedInfographics?.length || 0;
  const totalVideosTarget = MODULE_RESOURCES.reduce((s, m) => s + m.videos, 0);
  const totalInfographicsTarget = MODULE_RESOURCES.reduce(
    (s, m) => s + m.infographics,
    0,
  );
  const totalLessonsCompleted = lessonProgress
    ? Object.values(lessonProgress).reduce(
        (sum, mod) =>
          sum + Object.values(mod).filter((s) => s === "completed").length,
        0,
      )
    : 0;
  const totalLessonsCount = ALL_LESSONS
    ? Object.values(ALL_LESSONS).reduce((sum, arr) => sum + arr.length, 0)
    : 0;
  const level = getLevel();
  const levelProgress = getLevelProgress();
  const xpForNext = getXpForNextLevel();
  const daysSinceStart = getDaysSinceStart();
  const liveSeconds = liveStartRef.current
    ? Math.round((Date.now() - liveStartRef.current) / 1000)
    : 0;
  const liveMinutes = Math.min(liveSeconds / 60, 360);
  const effectiveAllMinutes = sessionStats.allMinutes + liveMinutes;
  const effectiveTodayMinutes = sessionStats.todayMinutes + liveMinutes;
  const daysActive = Math.max(streak || 1, sessionStats.daysActive || 1);
  const totalStudyMinutes = effectiveAllMinutes;
  const studyHours = Math.floor(totalStudyMinutes / 60);
  const studyMins = Math.round(totalStudyMinutes % 60);
  const lessonsPerDay =
    daysSinceStart > 0 ? totalLessonsCompleted / daysSinceStart : 0;
  const remainingLessons = totalLessonsCount - totalLessonsCompleted;
  const estimatedDaysRemaining =
    lessonsPerDay > 0 ? Math.ceil(remainingLessons / lessonsPerDay) : 0;
  const estimatedEndDate =
    estimatedDaysRemaining > 0 && estimatedDaysRemaining < 999
      ? new Date(
          Date.now() + estimatedDaysRemaining * 86400000,
        ).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

  const weeklyXP = getWeeklyXP();
  const recommendations = getDetailedRecommendations();

  const lastActivityTime = lastActivityDate
    ? (() => {
        const d = new Date(lastActivityDate);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        if (isToday)
          return `${t("activity.stats.today")} ${d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
        const yesterday = new Date(now - 86400000);
        if (d.toDateString() === yesterday.toDateString())
          return `${t("activity.time.days", { days: 1 })} ${d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
        return d.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
      })()
    : null;

  const getDominanceLabel = (modId) => {
    try {
      return useIALabStore.getState().getModuleDominanceLevel(modId);
    } catch {
      return null;
    }
  };

  const moduleScores = [1, 2, 3, 4, 5].map((id) => ({
    id,
    title: MODULE_NAMES[id],
    score:
      moduleProgress?.[id]?.currentScore ??
      Math.round(
        calculateModuleScore(
          id,
          MODULE_RESOURCES.find((r) => r.id === id) || MODULE_RESOURCES[0],
          completedVideos,
          completedInfographics,
          completedExams,
          challengeScores,
          completedModules,
        ),
      ),
    icon: MODULE_ICONS[id],
    examScore: completedExams?.[id] || 0,
    challengeScore: challengeScores?.[id] || 0,
    dominance: getDominanceLabel(id),
  }));
  const weakestModule = [...moduleScores].sort((a, b) => a.score - b.score)[0];
  const totalItems =
    totalVideosTarget + totalInfographicsTarget + 5 + 5 + 5 + totalLessonsCount;
  const totalPoints = getTotalPoints();
  const getStreakMessage = () => {
    if (streak >= 30) return t("streak.tier_imparable");
    if (streak >= 7) return t("streak.tier_encendida");
    if (streak >= 3) return t("streak.tier_activa");
    return t("streak.study_today");
  };

  const nextBadge = useMemo(() => {
    const earned = new Set(badges || []);
    const allBadges = [
      {
        id: "first_lesson",
        check: () => totalLessonsCompleted >= 1,
        current: totalLessonsCompleted,
        target: 1,
      },
      {
        id: "five_lessons",
        check: () => totalLessonsCompleted >= 5,
        current: totalLessonsCompleted,
        target: 5,
      },
      {
        id: "all_lessons",
        check: () => totalLessonsCompleted >= 15,
        current: totalLessonsCompleted,
        target: 15,
      },
      { id: "streak_3", check: () => streak >= 3, current: streak, target: 3 },
      { id: "streak_7", check: () => streak >= 7, current: streak, target: 7 },
      {
        id: "first_module",
        check: () => completedCount >= 1,
        current: completedCount,
        target: 1,
      },
      {
        id: "three_modules",
        check: () => completedCount >= 3,
        current: completedCount,
        target: 3,
      },
      {
        id: "all_modules",
        check: () => completedCount >= 5,
        current: completedCount,
        target: 5,
      },
    ];
    const next = allBadges.find((b) => !earned.has(b.id) && b.current > 0);
    if (!next) return null;
    const info = BADGE_INFO?.[next.id];
    if (!info) return null;
    return {
      ...info,
      badgeId: next.id,
      current: Math.min(next.current, next.target),
      target: next.target,
    };
  }, [badges, totalLessonsCompleted, streak, completedCount]);

  const personalizedRecs = usePersonalizedRecommendations();

  if (!isOpen) return null;

  const filteredActivities = activitiesData.filter(
    (a) => filter === "all" || a.activity_type === filter,
  );
  const groupedByDate = {};
  filteredActivities.forEach((a) => {
    const date = new Date(a.completed_at).toDateString();
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(a);
  });
  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      await exportProgressPDF({
        t,
        courseProgress,
        level,
        xp,
        streak,
        totalLessonsCompleted,
        totalLessonsCount,
        sessionStats,
        daysActive,
        studyHours,
        studyMins,
        daysSinceStart,
        estimatedEndDate,
        moduleScores,
        completedModules,
        lessonProgress,
        MODULE_RESOURCES,
        ALL_LESSONS,
        activitiesData,
        totalVideos,
        totalVideosTarget,
        totalInfographics,
        totalInfographicsTarget,
        totalExams,
        totalChallenges,
        forumPostCount,
        forumCommentCount,
        badges,
        weakestModule,
        getLevelProgress,
        getXpForNextLevel,
        MODULE_NAMES,
      });
    } catch (err) {
      console.error("Error generando PDF:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  const toggleAccordion = (id) => {
    setAccordionSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const statsCards = [
    {
      icon: "fa-chart-line",
      value: `${Math.round(courseProgress || 0)}%`,
      labelKey: "activity.stats.progress",
      color: "text-petroleum",
    },
    {
      icon: "fa-trophy",
      value: `Nv.${level}`,
      label: `${xp} XP`,
      color: "text-warning",
    },
    {
      icon: "fa-check-circle",
      value: `${totalLessonsCompleted}/${totalLessonsCount}`,
      labelKey: "activity.stats.lessons",
      color: "text-success",
    },
    {
      icon: "fa-fire",
      value: `${streak}d`,
      label: getStreakMessage(),
      color: streak >= 3 ? "text-orange-500" : "text-slate-400",
    },
    {
      icon: "fa-clock",
      value: lastActivityTime || "—",
      labelKey: "activity.stats.last_connection",
      color: "text-petroleum",
      small: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      role="dialog"
      aria-modal="true"
      aria-label={t("activity.title")}
      aria-describedby="activity-history-desc"
      className={`fixed inset-0 z-[1050] flex items-start justify-center bg-black/50 transition-all duration-300 ${isExpanded ? "p-0" : "pt-16 sm:pt-20 px-2 sm:px-4"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        ref={(el) => {
          panelRef.current = el;
          focusTrapRef.current = el;
        }}
        className={`bg-white shadow-[0_8px_32px_rgba(0,75,99,0.12)] w-full overflow-hidden transition-all duration-300 ${
          isExpanded
            ? "max-w-none max-h-screen rounded-none"
            : "rounded-2xl max-w-5xl max-h-[80vh]"
        }`}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-sm ring-1 ring-white/10">
              <Icon name="fa-clock" className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg font-montserrat tracking-tight">
                {t("activity.title")}
              </h1>
              <p className="text-white/60 text-xs">
                {t("activity.stats.progress")} · {totalLessonsCompleted}/
                {totalLessonsCount} {t("activity.stats.lessons").toLowerCase()}{" "}
                · {xp} XP
              </p>
              <span id="activity-history-desc" className="sr-only">
                {t("activity.aria_description", {
                  lessonsCompleted: totalLessonsCompleted,
                  lessonsTotal: totalLessonsCount,
                  level,
                  xp,
                  streak,
                  tabs: TABS.length,
                  tabLabels: TABS.map((tab) => t(tab.labelKey)).join(", "),
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={handleExportPDF}
              disabled={pdfLoading}
              className="min-w-[36px] min-h-[36px] w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 active:scale-90 ring-1 ring-white/10 disabled:opacity-50"
              aria-label={t("activity.export_aria")}
            >
              <Icon
                name={pdfLoading ? "fa-spinner" : "fa-file-pdf"}
                className={`text-white text-xs ${pdfLoading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 active:scale-90 ring-1 ring-white/10"
              aria-label={
                isExpanded
                  ? t("activity.collapse_aria")
                  : t("activity.expand_aria")
              }
            >
              <Icon
                name={isExpanded ? "fa-compress" : "fa-expand"}
                className="text-white text-sm"
              />
            </button>
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 active:scale-90 ring-1 ring-white/10"
              aria-label={t("activity.close_aria")}
            >
              <Icon name="fa-times" className="text-white text-sm" />
            </button>
          </div>
        </div>

        <StatsCards cards={statsCards} t={t} />

        {/* Tabs */}
        <div className="px-4 sm:px-6 pt-3 border-b border-slate-200/40 bg-white">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-4 min-h-[44px] text-xs font-bold rounded-t-lg transition-all duration-200 flex items-center gap-2 active:scale-95 flex-shrink-0 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm border border-transparent"
                    : "text-slate-500 hover:text-petroleum hover:bg-slate-50 border border-transparent"
                }`}
              >
                <Icon
                  name={tab.icon}
                  className={`text-[10px] ${activeTab === tab.key ? "text-white" : "text-petroleum"}`}
                />
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div
          className={`overflow-y-auto modal-scrollable ${isExpanded ? "max-h-[calc(100vh-280px)]" : "max-h-[55vh] md:max-h-[45vh]"}`}
        >
          {activeTab === "modules" && (
            <div className="p-3 sm:p-5 space-y-2.5">
              <SectionHeader title={t("activity.pdf.section_modules")} />
              {MODULE_RESOURCES.map((cfg) => (
                <ModuleProgressCard
                  key={cfg.id}
                  moduleId={cfg.id}
                  title={cfg.title}
                  icon={cfg.icon}
                  score={calculateModuleScore(
                    cfg.id,
                    cfg,
                    completedVideos,
                    completedInfographics,
                    completedExams,
                    challengeScores,
                    completedModules,
                  )}
                  config={cfg}
                  completedVideos={completedVideos}
                  completedInfographics={completedInfographics}
                  completedExams={completedExams}
                  challengeScores={challengeScores}
                  completedModules={completedModules}
                />
              ))}
            </div>
          )}

          {activeTab === "activities" && (
            <ActivityList
              filteredActivities={filteredActivities}
              sortedDates={sortedDates}
              groupedByDate={groupedByDate}
              filter={filter}
              setFilter={setFilter}
              t={t}
            />
          )}

          {activeTab === "stats" && (
            <div className="p-3 sm:p-5 space-y-4">
              <div className="bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate rounded-xl shadow-lg p-5 sm:p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
                    <Icon name="fa-chart-line" className="text-sm text-white" />
                  </div>
                  <h2 className="text-sm font-bold font-montserrat tracking-wide text-white/90">
                    {t("activity.stats.executive_summary")}
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">
                      XP {t("activity.stats.total_label")}
                    </p>
                    <p className="text-xl font-bold font-montserrat tracking-tight mt-0.5">
                      {xp}
                    </p>
                    <p className="text-[10px] text-white/70 mt-0.5">
                      Nivel {level}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">
                      {t("activity.stats.weekly_xp")}
                    </p>
                    <p className="text-xl font-bold font-montserrat tracking-tight mt-0.5">
                      {weeklyXP.weekly}/{weeklyXP.weeklyTarget}
                    </p>
                    <div className="mt-1.5 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{ width: `${weeklyXP.weeklyPct}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">
                      {t("activity.stats.study_time")}
                    </p>
                    <p className="text-xl font-bold font-montserrat tracking-tight mt-0.5">
                      {sessionStats.sessionCount > 0 || liveSeconds >= 30
                        ? `${studyHours}h ${studyMins}m`
                        : "—"}
                    </p>
                    <p className="text-[10px] text-white/70 mt-0.5">
                      {t("activity.stats.active_days", { days: daysActive })}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">
                      {t("activity.stats.course_progress")}
                    </p>
                    <p className="text-xl font-bold font-montserrat tracking-tight mt-0.5">
                      {Math.round(courseProgress || 0)}%
                    </p>
                    <div className="mt-1.5 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-300 transition-all duration-500"
                        style={{
                          width: `${Math.min(courseProgress || 0, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/40 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                      <Icon
                        name="fa-tachometer-alt"
                        className="text-petroleum text-sm"
                      />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-petroleum uppercase tracking-wider">
                        {t("activity.stats.global_progress")}
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        {t("activity.progress_label", {
                          completed:
                            totalVideos +
                            totalInfographics +
                            totalExams +
                            totalChallenges +
                            completedCount,
                          total: totalItems,
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-petroleum font-montserrat tracking-tight">
                    {Math.round(courseProgress || 0)}%
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: `${Math.min(courseProgress || 0, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-slate-100 text-[10px] font-medium text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-petroleum" />
                    {t("activity.modules_completed", { count: completedCount })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-corporate" />
                    {t("activity.videos_completed", {
                      count: totalVideos,
                      target: totalVideosTarget,
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("activity.evaluations_completed", {
                      count: totalExams + totalChallenges,
                    })}
                  </span>
                </div>
              </div>

              <AccordionSection
                id="estudio"
                title={t("activity.stats.study_time")}
                icon="fa-clock"
                isOpen={accordionSections.estudio}
                onToggle={() => toggleAccordion("estudio")}
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                  <div className="text-center p-3 rounded-xl bg-gradient-to-b from-petroleum/5 to-transparent border border-petroleum/10">
                    <div className="text-xl font-bold text-petroleum">
                      {sessionStats.sessionCount > 0 || liveSeconds >= 30
                        ? `${studyHours}h ${studyMins}m`
                        : "—"}
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">
                      {t("activity.stats.total_time_label")}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-b from-corporate/5 to-transparent border border-corporate/10">
                    <div className="text-xl font-bold text-corporate">
                      {sessionStats.sessionCount}
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">
                      {t("activity.stats.sessions_label")}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-b from-emerald-500/5 to-transparent border border-emerald-500/10">
                    <div className="text-xl font-bold text-emerald-600">
                      {daysActive}
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">
                      {t("activity.stats.days_active")}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-b from-amber-500/5 to-transparent border border-amber-500/10">
                    <div className="text-xl font-bold text-amber-600">
                      {sessionStats.sessionCount > 0 || liveSeconds >= 30
                        ? `${Math.round(effectiveTodayMinutes)} min`
                        : "—"}
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">
                      {t("activity.stats.today")}
                    </p>
                  </div>
                </div>
                <StudyTimeChart
                  monthlyData={monthlyData}
                  timeRange={timeRange}
                  studyHours={studyHours}
                  studyMins={studyMins}
                  t={t}
                />
              </AccordionSection>

              <AccordionSection
                id="progreso"
                title={t("activity.stats.global_progress")}
                icon="fa-chart-bar"
                isOpen={accordionSections.progreso}
                onToggle={() => toggleAccordion("progreso")}
              >
                <ActivityDistributionChart
                  activityDistribution={activityDistribution}
                  t={t}
                />

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    {t("activity.stats.by_module")}
                  </h4>
                  <div className="space-y-2.5">
                    {moduleScores.map((mod) => {
                      const barColor =
                        mod.score >= 80
                          ? "from-emerald-500 to-emerald-400"
                          : mod.score >= 60
                            ? "from-amber-500 to-amber-400"
                            : "from-slate-400 to-slate-300";
                      return (
                        <div key={mod.id} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center flex-shrink-0">
                            <Icon
                              name={mod.icon}
                              className="text-[10px] text-petroleum"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[11px] font-semibold text-slate-700 truncate">
                                {mod.title}
                              </span>
                              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                {mod.examScore > 0 && (
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
                                      mod.examScore >= 80
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                        : "bg-amber-50 text-amber-600 border-amber-200"
                                    }`}
                                  >
                                    E:{mod.examScore}%
                                  </span>
                                )}
                                {mod.challengeScore > 0 && (
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
                                      mod.challengeScore >= 80
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                        : "bg-amber-50 text-amber-600 border-amber-200"
                                    }`}
                                  >
                                    D:{mod.challengeScore}%
                                  </span>
                                )}
                                {mod.dominance && (
                                  <span
                                    className={`text-[8px] font-bold px-1.5 py-[1px] rounded-md border ${mod.dominance.bg} ${mod.dominance.color}`}
                                  >
                                    {mod.dominance.label}
                                  </span>
                                )}
                                <span
                                  className={`text-[10px] font-bold ${mod.score >= 80 ? "text-emerald-600" : mod.score >= 60 ? "text-amber-600" : "text-slate-500"}`}
                                >
                                  {Math.round(mod.score)}%
                                </span>
                              </div>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                                style={{ width: `${Math.round(mod.score)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AccordionSection>

              <AccordionSection
                id="logros"
                title={t("activity.stats.achievements")}
                icon="fa-star"
                isOpen={accordionSections.logros}
                onToggle={() => toggleAccordion("logros")}
              >
                {badges && badges.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                      {badges.map((badgeId) => {
                        const info = BADGE_INFO?.[badgeId] || {
                          icon: "fa-star",
                          label: badgeId,
                          desc: "",
                          color: "#94A3B8",
                        };
                        return (
                          <div
                            key={badgeId}
                            className="group bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200/40 shadow-sm p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/10 to-amber-500/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                              <Icon
                                name={info.icon}
                                className="text-sm"
                                style={{ color: info.color }}
                              />
                            </div>
                            <p className="text-[10px] font-bold text-slate-700 leading-tight">
                              {info.label}
                            </p>
                            <p className="text-[8px] text-slate-400 mt-0.5">
                              {info.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    {nextBadge && (
                      <div className="pt-3 border-t border-slate-100/80">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center opacity-60 flex-shrink-0">
                              <Icon
                                name={nextBadge.icon}
                                className="text-[10px] text-slate-500"
                              />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 leading-tight">
                                {t("activity.stats.next_badge")}{" "}
                                {nextBadge.label}
                              </p>
                              <p className="text-[8px] text-slate-400">
                                {nextBadge.desc}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">
                            {nextBadge.current}/{nextBadge.target}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-slate-300 to-slate-400 transition-all duration-500"
                            style={{
                              width: `${(nextBadge.current / nextBadge.target) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">
                    {t("activity.stats.no_badges")}
                  </p>
                )}
              </AccordionSection>

              <div className="flex items-center justify-end gap-2 px-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${syncStatus === "synced" ? "bg-emerald-500" : syncStatus === "syncing" ? "bg-amber-500 animate-pulse" : "bg-slate-400"}`}
                />
                <span className="text-[10px] font-medium text-slate-400">
                  {syncStatus === "synced"
                    ? t("activity.stats.sync_synced")
                    : syncStatus === "syncing"
                      ? t("activity.stats.sync_syncing")
                      : syncStatus === "offline"
                        ? t("activity.stats.sync_offline")
                        : t("activity.stats.sync_local")}
                </span>
              </div>
            </div>
          )}

          {activeTab === "recommendations" && (
            <RecommendationsList personalizedRecs={personalizedRecs} t={t} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActivityHistory;
