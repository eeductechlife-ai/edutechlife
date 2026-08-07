import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { motion } from "framer-motion";
import { useActivityTracker } from "../hooks/useActivityTracker";
import { useTranslation } from "../i18n/I18nProvider";
import { useIALabStore } from "../store/ialabStore";
import usePersonalizedRecommendations from "../hooks/IALab/usePersonalizedRecommendations";
import { ALL_LESSONS, BADGE_INFO } from "../data/ialab";
import { Icon } from "../utils/iconMapping.jsx";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import useFocusTrap from "../hooks/useFocusTrap";
import { getUnifiedSessionStats } from "../hooks/useSessionTracker";
import { supabase } from "../lib/supabase";

import SectionHeader from "../components/ui/SectionHeader";
import ModuleProgressCard from "../components/IALab/ModuleProgressCard";
import ReviewScheduler from "../components/IALab/ReviewScheduler";
const StudyCalendarSection = lazy(() =>
  import("../components/IALab/StudyCalendarSection"),
);

import {
  MODULE_NAMES,
  MODULE_ICONS,
  MODULE_RESOURCES,
  TABS,
} from "./activityHistory/activityConfig";
import { calculateModuleScore } from "./activityHistory/activityUtils";
import { computeActivitiesData, computeMonthlyData, computeActivityDistribution, computeNextBadge } from "./activityHistory/activityHistoryData";
import { exportProgressPDF } from "./activityHistory/activityPDFGenerator";

import { ActivityList } from "./activityHistory/components/ActivityList";
import { RecommendationsList } from "./activityHistory/components/RecommendationsList";
import { StatsCards } from "./activityHistory/components/StatsCards";
import { ActivityStatsTab } from "./activityHistory/components/ActivityStatsTab";
import { ActivityHistoryHeader } from "./activityHistory/components/ActivityHistoryHeader";

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

  const activitiesData = useMemo(() => computeActivitiesData({
    activities, completedExams, challengeScores, completedModules,
    completedVideos, completedInfographics, lessonProgress, forumPostCount, forumCommentCount,
  }), [
    activities, completedExams, challengeScores, completedModules,
    completedVideos, completedInfographics, lessonProgress, forumPostCount, forumCommentCount,
  ]);

  const monthlyData = useMemo(() => computeMonthlyData(sessionStats, timeRange), [sessionStats, timeRange]);

  const activityDistribution = useMemo(() => computeActivityDistribution(activities), [activities]);

  const completedCount = completedModules?.length || 0;
  const totalExams = Object.values(completedExams || {}).filter((s) => s > 0).length;
  const totalChallenges = Object.values(challengeScores || {}).filter((s) => s > 0).length;
  const totalVideos = completedVideos?.length || 0;
  const totalInfographics = completedInfographics?.length || 0;
  const totalVideosTarget = MODULE_RESOURCES.reduce((s, m) => s + m.videos, 0);
  const totalInfographicsTarget = MODULE_RESOURCES.reduce((s, m) => s + m.infographics, 0);
  const totalLessonsCompleted = lessonProgress
    ? Object.values(lessonProgress).reduce((sum, mod) => sum + Object.values(mod).filter((s) => s === "completed").length, 0)
    : 0;
  const totalLessonsCount = ALL_LESSONS ? Object.values(ALL_LESSONS).reduce((sum, arr) => sum + arr.length, 0) : 0;
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
  const lessonsPerDay = daysSinceStart > 0 ? totalLessonsCompleted / daysSinceStart : 0;
  const remainingLessons = totalLessonsCount - totalLessonsCompleted;
  const estDays = lessonsPerDay > 0 ? Math.ceil(remainingLessons / lessonsPerDay) : 0;
  const estimatedEndDate = estDays > 0 && estDays < 999
    ? new Date(Date.now() + estDays * 86400000).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
    : null;

  const weeklyXP = getWeeklyXP();

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

  const moduleScores = [1, 2, 3, 4, 5].map((id) => {
    const cfg = MODULE_RESOURCES.find((r) => r.id === id) || MODULE_RESOURCES[0]
    const score = moduleProgress?.[id]?.currentScore ?? Math.round(calculateModuleScore(id, cfg, completedVideos, completedInfographics, completedExams, challengeScores, completedModules))
    return { id, title: MODULE_NAMES[id], score, icon: MODULE_ICONS[id], examScore: completedExams?.[id] || 0, challengeScore: challengeScores?.[id] || 0, dominance: getDominanceLabel(id) }
  })
  const weakestModule = [...moduleScores].sort((a, b) => a.score - b.score)[0];
  const totalPoints = getTotalPoints();
  const getStreakMessage = () => {
    if (streak >= 30) return t("streak.tier_imparable");
    if (streak >= 7) return t("streak.tier_encendida");
    if (streak >= 3) return t("streak.tier_activa");
    return t("streak.study_today");
  };

  const nextBadge = useMemo(() => computeNextBadge(badges, totalLessonsCompleted, streak, completedCount), [badges, totalLessonsCompleted, streak, completedCount]);

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
        <ActivityHistoryHeader
          t={t}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          onClose={onClose}
          handleExportPDF={handleExportPDF}
          pdfLoading={pdfLoading}
          totalLessonsCompleted={totalLessonsCompleted}
          totalLessonsCount={totalLessonsCount}
          xp={xp}
          level={level}
          streak={streak}
          TABS={TABS}
        />

        <StatsCards cards={statsCards} t={t} />

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
                <Icon name={tab.icon} className={`text-[10px] ${activeTab === tab.key ? "text-white" : "text-petroleum"}`} />
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className={`overflow-y-auto modal-scrollable ${isExpanded ? "max-h-[calc(100vh-280px)]" : "max-h-[55vh] md:max-h-[45vh]"}`}>
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
            <ActivityStatsTab
              t={t}
              monthlyData={monthlyData}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              studyHours={studyHours}
              studyMins={studyMins}
              activityDistribution={activityDistribution}
              moduleScores={moduleScores}
              courseProgress={courseProgress}
              completedCount={completedCount}
              totalVideosCount={totalVideos}
              totalVideosTarget={totalVideosTarget}
              totalInfographicsCount={totalInfographics}
              totalInfographicsTarget={totalInfographicsTarget}
              totalExamsCount={totalExams}
              totalChallengesCount={totalChallenges}
              sessionStats={sessionStats}
              liveSeconds={liveSeconds}
              effectiveTodayMinutes={effectiveTodayMinutes}
              daysActive={daysActive}
              streak={streak}
              getStreakMessage={getStreakMessage}
              syncStatus={syncStatus}
              accordionSections={accordionSections}
              toggleAccordion={toggleAccordion}
              badges={badges}
              BADGE_INFO={BADGE_INFO}
              nextBadge={nextBadge}
              xp={xp}
              level={level}
              weeklyXP={weeklyXP}
              totalLessonsCompleted={totalLessonsCompleted}
              totalLessonsCount={totalLessonsCount}
              lastActivityTime={lastActivityTime}
              effectiveAllMinutes={effectiveAllMinutes}
            />
          )}

          {activeTab === "review" && (
            <div className="p-3 sm:p-5 space-y-2.5">
              <SectionHeader title={t("activity.tab.review")} />
              <ReviewScheduler maxUpcoming={5} />
              <Suspense fallback={null}>
                <StudyCalendarSection />
              </Suspense>
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
