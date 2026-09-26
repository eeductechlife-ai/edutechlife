import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthIdentity, signOutUser } from "../../../hooks/useAuthIdentity";
import { useParentDashboardRealtime } from "../../../hooks/useParentDashboardRealtime";
import { useParentStudentData } from "../../../hooks/useParentStudentData";
import { useParentInsights } from "../../../hooks/useParentInsights";
import { useEarlyWarnings } from "../../../hooks/useEarlyWarnings";
import { useStudentProfileIngenIA } from "../../../hooks/useStudentProfileIngenIA";
import {
  Trophy,
  Clock,
  TrendingUp,
  Brain,
  Award,
  LogOut,
  LayoutDashboard,
  Activity,
  Heart,
  Star,
  BookMarked,
  Wifi,
  WifiOff,
  Menu,
  X,
  CheckCircle,
  Sparkles,
  Shield,
  Lightbulb,
} from "lucide-react";
import SEO from "../../SEO";
import IngenIALogo from "../../brand/IngenIALogo";
import { useTranslation } from "../../../i18n/I18nProvider";
import { createSupabaseClient } from "../../../lib/supabase";
import { LivePresenceBar, ActivityLog } from "./components/ParentControls";
import {
  StatCard,
  PointsChart,
  SubjectProgress,
  WeeklySummary,
} from "./components/ParentStats";
import WeeklyReportCard from "./components/WeeklyReportCard";
import WellbeingCard from "./components/WellbeingCard";
import ParentResources from "./components/ParentResources";
import ParentRecommendations from "./components/ParentRecommendations";
import GradeReportCard from "./components/GradeReportCard";
import ParentalControlsPanel from "./components/ParentalControlsPanel";
import { mergeRealtimePoints } from "./mergeRealtime";
import { track } from "../../../lib/analytics";
import { EVENTS } from "../../../lib/analyticsEvents";

const InternalMetricsDashboard = lazy(
  () => import("../../kids-dashboard/InternalMetricsDashboard"),
);

const LEVELS = [
  { min: 5000, nameKey: "parent_dashboard.level_maestro", emoji: "🏆" },
  { min: 2500, nameKey: "parent_dashboard.level_experto", emoji: "⭐" },
  { min: 1000, nameKey: "parent_dashboard.level_avanzado", emoji: "📚" },
  { min: 500, nameKey: "parent_dashboard.level_intermedio", emoji: "🌟" },
  { min: 0, nameKey: "parent_dashboard.level_principiante", emoji: "🌱" },
];

const FEATURES = [
  { icon: "🤖", textKey: "parent_dashboard.feature_1" },
  { icon: "🧠", textKey: "parent_dashboard.feature_2" },
  { icon: "🎯", textKey: "parent_dashboard.feature_3" },
  { icon: "🛡️", textKey: "parent_dashboard.feature_4" },
  { icon: "📊", textKey: "parent_dashboard.feature_5" },
  { icon: "📧", textKey: "parent_dashboard.feature_6" },
];

const NAV = [
  {
    id: "inicio",
    labelKey: "parent_dashboard.nav_inicio",
    Icon: LayoutDashboard,
  },
  {
    id: "progreso",
    labelKey: "parent_dashboard.nav_progreso",
    Icon: TrendingUp,
  },
  {
    id: "recomendaciones",
    labelKey: "parent_dashboard.nav_recomendaciones",
    Icon: Lightbulb,
  },
  { id: "plan", labelKey: "parent_dashboard.nav_plan", Icon: Star },
  {
    id: "controles",
    labelKey: "parent_dashboard.nav_controles",
    Icon: Shield,
  },
];

const getWellness = (streak, completionRate, minutes, t) => {
  let s = 0;
  if (streak >= 5) s += 3;
  else if (streak >= 2) s += 2;
  else if (streak >= 1) s += 1;
  if (completionRate >= 0.7) s += 3;
  else if (completionRate >= 0.4) s += 2;
  else if (completionRate > 0) s += 1;
  if (minutes >= 120) s += 2;
  else if (minutes >= 30) s += 1;
  if (s >= 6)
    return {
      tier: "excelente",
      label: t("parent_dashboard.wellness_excelente"),
      color: "#16A34A",
      bg: "#F0FDF4",
      border: "#BBF7D0",
      emoji: "😊",
      tip: t("parent_dashboard.wellness_excelente_tip"),
    };
  if (s >= 3)
    return {
      tier: "bien",
      label: t("parent_dashboard.wellness_bien"),
      color: "#D97706",
      bg: "#FFFBEB",
      border: "#FDE68A",
      emoji: "🙂",
      tip: t("parent_dashboard.wellness_bien_tip"),
    };
  if (s >= 1)
    return {
      tier: "regular",
      label: t("parent_dashboard.wellness_regular"),
      color: "#EA580C",
      bg: "#FFF7ED",
      border: "#FED7AA",
      emoji: "😐",
      tip: t("parent_dashboard.wellness_regular_tip"),
    };
  return {
    tier: "sin_actividad",
    label: t("parent_dashboard.wellness_sin_actividad"),
    color: "#64748B",
    bg: "#F8FAFC",
    border: "#E2E8F0",
    emoji: "💤",
    tip: t("parent_dashboard.wellness_sin_actividad_tip"),
  };
};

const Sidebar = ({
  parentName,
  studentEmail,
  studentDisplayName,
  activeSection,
  onSection,
  onLogout,
  mobileOpen,
  onCloseMobile,
  studentOnline,
}) => {
  const { t } = useTranslation();
  return (
    <motion.aside
      initial={false}
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#004B63] flex flex-col transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex`}
    >
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-1">
              <IngenIALogo
                variant="wordmark"
                tone="dark"
                height={28}
                title="IngenIA"
              />
            </h1>
            <span className="text-[#4DA8C4] text-xs font-semibold tracking-wide">
              {t("parent_dashboard.panel_title")}
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4DA8C4]/30 flex items-center justify-center text-white font-black text-base flex-shrink-0">
            {parentName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {parentName}
            </p>
            <p className="text-[#4DA8C4] text-xs">
              {t("parent_dashboard.parent_role")}
            </p>
          </div>
        </div>
        {(studentEmail || studentDisplayName) && (
          <div className="mt-3 bg-white/8 rounded-lg px-3 py-2">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
              {t("parent_dashboard.monitoring")}
            </p>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${studentOnline ? "bg-emerald-400 animate-pulse" : "bg-white/25"}`}
              />
              <p
                className="text-xs font-semibold truncate"
                style={{
                  color: studentOnline ? "#34d399" : "rgba(255,255,255,0.85)",
                }}
              >
                {studentDisplayName || studentEmail.split("@")[0]}
              </p>
            </div>
            {studentOnline && (
              <p className="text-[10px] text-emerald-400 mt-0.5">
                {t("parent_dashboard.studying_now")}
              </p>
            )}
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ id, labelKey, Icon }) => (
          <button
            key={id}
            onClick={() => {
              onSection(id);
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === id ? "bg-white/15 text-white" : "text-white/55 hover:bg-white/8 hover:text-white"}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {t(labelKey)}
            {activeSection === id && (
              <motion.div
                layoutId="nav-dot"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4DA8C4]"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 text-sm transition-all"
        >
          <LogOut className="w-4 h-4" /> {t("parent_dashboard.logout")}
        </button>
      </div>
    </motion.aside>
  );
};

const IngenIAParentDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId, token: authToken, isLoaded } = useAuthIdentity();
  const [activeSection, setActiveSection] = useState("inicio");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMoreInicio, setShowMoreInicio] = useState(false);
  const [liveActivities, setLiveActivities] = useState([]);
  const [newActivityPulse, setNewActivityPulse] = useState(false);

  const isParent = true;
  const studentEmail = localStorage.getItem("student_email") || "";
  const studentId = localStorage.getItem("student_id") || "";
  const parentName =
    localStorage.getItem("parent_name") ||
    t("parent_dashboard.parent_fallback");

  const { data: supabaseData, source: dataSource } = useParentStudentData(
    studentId || userId,
    authToken,
  );
  const [data, setData] = useState(supabaseData);
  const liveAppliedRef = useRef(false);

  const { studentStatus, liveSessions, livePoints, isConnected } =
    useParentDashboardRealtime(userId, studentId || userId, authToken);

  const { insights, learningGraph, fetchInsights } = useParentInsights();
  const { warnings, fetchWarnings, resolveWarning } = useEarlyWarnings();
  const { profile: studentProfile } = useStudentProfileIngenIA(authToken);

  // studentStatus is StudentOnlineStatus[] — check if child's entry is online
  const studentOnline = Array.isArray(studentStatus)
    ? studentStatus.some(
        (s) => s.auth_id === (studentId || userId) && s.is_online,
      )
    : false;

  useEffect(() => {
    if (isLoaded && !userId && !isParent) navigate("/ingenia/login");
  }, [isLoaded, userId, isParent, navigate]);

  // parent_report_viewed — fires once when the parent dashboard mounts
  useEffect(() => {
    track(EVENTS.PARENT_REPORT_VIEWED, {});
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchInsights(studentId);
      fetchWarnings(studentId);
    }
  }, [studentId, fetchInsights, fetchWarnings]);

  // Keep local state in sync with the hook (Supabase or localStorage fallback).
  // Do NOT clobber realtime-merged data once live events have been applied.
  useEffect(() => {
    if (!liveAppliedRef.current) setData(supabaseData);
  }, [supabaseData]);

  useEffect(() => {
    if (!isLoaded || !userId || !authToken) return;
    let channel, client;
    const setup = async () => {
      try {
        client = createSupabaseClient(authToken);
        channel = client
          .channel("parent-activity-live")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "activity_log",
              filter: `user_id=eq.${userId}`,
            },
            (p) => {
              setLiveActivities((prev) => [p.new, ...prev].slice(0, 10));
              setNewActivityPulse(true);
              setTimeout(() => setNewActivityPulse(false), 2000);
            },
          )
          .subscribe();
      } catch (e) {
        console.warn("[ParentDashboard] Realtime:", e.message);
      }
    };
    setup();
    return () => {
      if (channel && client) client.removeChannel(channel);
    };
  }, [isLoaded, userId, authToken]);

  useEffect(() => {
    if (!liveSessions.length && !livePoints.length) return;
    liveAppliedRef.current = true;
    setData((prev) => {
      const merged = mergeRealtimePoints(prev, livePoints);
      return {
        ...prev,
        sessions: liveSessions.length ? liveSessions : prev.sessions,
        points: merged.points,
        history: merged.history,
      };
    });
  }, [liveSessions, livePoints]);

  const handleLogout = () => {
    [
      "auth_token",
      "refresh_token",
      "user_role",
      "student_email",
      "student_id",
      "parent_name",
    ].forEach((k) => localStorage.removeItem(k));
    // signOutUser dispara el evento auth:signout (sincroniza otras pestañas)
    // y navega al login.
    signOutUser("/ingenia/login", navigate);
  };

  const level =
    LEVELS.find((l) => data.points >= l.min) || LEVELS[LEVELS.length - 1];
  const completed = data.missions.filter((m) => m.completed).length;
  const total = data.missions.length;
  const completionRate = total > 0 ? completed / total : 0;
  const avgProgress = data.subjects.length
    ? Math.round(
        data.subjects.reduce((s, sub) => s + sub.progress, 0) /
          data.subjects.length,
      )
    : 0;
  const studyHours = +(data.minutes / 60).toFixed(1);
  const wellness = getWellness(
    data.streak?.current || 0,
    completionRate,
    data.minutes,
    t,
  );

  const sortedSubjects = [...data.subjects].sort(
    (a, b) => b.progress - a.progress,
  );
  const bestSubject = sortedSubjects.length > 0 ? sortedSubjects[0] : null;
  const worstSubject =
    sortedSubjects.length > 1
      ? sortedSubjects[sortedSubjects.length - 1]
      : null;

  const semaphorePhrase = (() => {
    const parts = [];
    if (completionRate > 0)
      parts.push(
        t("parent_dashboard.semaphore_phrase_tasks", {
          pct: Math.round(completionRate * 100),
        }),
      );
    else if (total > 0)
      parts.push(t("parent_dashboard.semaphore_phrase_notasks"));
    if (studyHours >= 0.5)
      parts.push(
        t("parent_dashboard.semaphore_phrase_hours", { hours: studyHours }),
      );
    else if (data.minutes > 0)
      parts.push(
        t("parent_dashboard.semaphore_phrase_minutes", {
          minutes: data.minutes,
        }),
      );
    const streakDays = data.streak?.current || 0;
    if (streakDays > 1)
      parts.push(
        t("parent_dashboard.semaphore_phrase_streaks", { days: streakDays }),
      );
    else if (streakDays === 1)
      parts.push(t("parent_dashboard.semaphore_phrase_streak"));
    return parts.length
      ? parts.join(" · ")
      : t("parent_dashboard.semaphore_no_data");
  })();

  const TRAFFIC = {
    excelente: {
      dots: [true, false, false],
      dotColors: ["#22c55e", "#e5e7eb", "#e5e7eb"],
    },
    bien: {
      dots: [false, true, false],
      dotColors: ["#e5e7eb", "#f59e0b", "#e5e7eb"],
    },
    regular: {
      dots: [false, false, true],
      dotColors: ["#e5e7eb", "#e5e7eb", "#f97316"],
    },
    sin_actividad: {
      dots: [false, false, true],
      dotColors: ["#e5e7eb", "#e5e7eb", "#ef4444"],
    },
  };
  const traffic = TRAFFIC[wellness.tier] || TRAFFIC.sin_actividad;

  // ── Sprint 2: contexto racha, última actividad, celebración ──────────────────
  const streakDays = data.streak?.current || 0;
  const streakContext = (() => {
    if (streakDays >= 7)
      return { emoji: "🔥", key: "streak_ctx_7", vars: { days: streakDays } };
    if (streakDays >= 5)
      return { emoji: "💪", key: "streak_ctx_5", vars: { days: streakDays } };
    if (streakDays >= 3)
      return { emoji: "✨", key: "streak_ctx_3", vars: { days: streakDays } };
    if (streakDays === 2) return { emoji: "📈", key: "streak_ctx_2", vars: {} };
    if (streakDays === 1) return { emoji: "🌱", key: "streak_ctx_1", vars: {} };
    return { emoji: "💡", key: "streak_ctx_0", vars: {} };
  })();

  const lastActivity = (() => {
    if (!data.history || data.history.length === 0) return null;
    const sorted = [...data.history].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    );
    const last = sorted[0];
    const daysDiff = Math.floor(
      (Date.now() - new Date(last.timestamp)) / 86400000,
    );
    if (daysDiff > 3) return null; // no mostrar si fue hace más de 3 días
    return { ...last, daysDiff };
  })();

  const bestSubjectWithProgress = sortedSubjects.find((s) => s.progress > 0);
  const isCelebration =
    streakDays >= 7 ||
    data.streak?.longest >= 7 ||
    (bestSubjectWithProgress && bestSubjectWithProgress.progress >= 100);
  const celebrationReason = isCelebration
    ? streakDays >= 7
      ? "streak"
      : bestSubjectWithProgress?.progress >= 100
        ? "module"
        : "streak_best"
    : null;

  const parentActions = (() => {
    const actions = [];
    const tier = wellness.tier;
    const streak = data.streak?.current || 0;
    const notStarted = data.subjects.filter((s) => s.progress === 0);
    const nearDone = data.subjects.find(
      (s) => s.progress >= 60 && s.progress < 95,
    );
    const name = null; // resolved after studentFirst — filled below

    if (tier === "sin_actividad") {
      actions.push({
        icon: "📱",
        bg: "#EFF6FF",
        titleKey: "role.inactive_title",
        bodyKey: "role.inactive_body",
        vars: {},
      });
    } else if (tier === "regular") {
      actions.push({
        icon: "🤝",
        bg: "#FFF7ED",
        titleKey: "role.regular_title",
        bodyKey: "role.regular_body",
        vars: {},
      });
    } else if (tier === "excelente") {
      actions.push({
        icon: "🏆",
        bg: "#F0FDF4",
        titleKey: "role.great_title",
        bodyKey: "role.great_body",
        vars: {},
      });
    }
    if (notStarted.length > 0) {
      actions.push({
        icon: "📚",
        bg: "#FFFBEB",
        titleKey: "role.explore_subject_title",
        bodyKey: "role.explore_subject_body",
        vars: { subject: notStarted[0].name },
      });
    }
    if (streak >= 7) {
      actions.push({
        icon: "🔥",
        bg: "#FFF7ED",
        titleKey: "role.streak_celebrate_title",
        bodyKey: "role.streak_celebrate_body",
        vars: { days: streak },
      });
    } else if (streak >= 3) {
      actions.push({
        icon: "🔥",
        bg: "#FFF7ED",
        titleKey: "role.streak_title",
        bodyKey: "role.streak_body",
        vars: { days: streak },
      });
    }
    if (nearDone) {
      actions.push({
        icon: "🎯",
        bg: "#EFF6FF",
        titleKey: "role.milestone_title",
        bodyKey: "role.milestone_body",
        vars: { subject: nearDone.name, pct: nearDone.progress },
      });
    }
    if (completionRate === 0 && actions.length < 2) {
      actions.push({
        icon: "📋",
        bg: "#F8FAFC",
        titleKey: "role.nomissions_title",
        bodyKey: "role.nomissions_body",
        vars: {},
      });
    }
    return actions.slice(0, 3);
  })();

  const studentStoredName =
    studentProfile?.name || localStorage.getItem("student_name") || "";
  const studentFirst = studentStoredName
    ? studentStoredName.split(" ")[0]
    : studentEmail
      ? studentEmail.split("@")[0]
      : t("parent_dashboard.your_child");
  const activeNav = NAV.find((n) => n.id === activeSection);

  if (!isParent && isLoaded && !userId) return null;

  return (
    <>
      <SEO
        title={t("parent_dashboard.seo_title")}
        description={t("parent_dashboard.seo_desc")}
      />
      <div className="flex h-screen bg-[#F1F5F9] overflow-hidden">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <Sidebar
          parentName={parentName}
          studentEmail={studentEmail}
          studentDisplayName={studentFirst}
          activeSection={activeSection}
          onSection={setActiveSection}
          onLogout={handleLogout}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          studentOnline={studentOnline}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-[#64748B] hover:text-[#004B63]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-[#004B63] text-sm">
                {activeNav ? t(activeNav.labelKey) : ""}
              </h2>
              <p className="text-[#94A3B8] text-xs">
                {t("parent_dashboard.header_greeting", {
                  name: parentName.split(" ")[0],
                  student: studentFirst,
                })}
              </p>
            </div>
            {studentOnline && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t("parent_dashboard.student_studying", {
                  name: studentFirst,
                })}
              </div>
            )}
            <div
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${isConnected ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}
              title={
                isConnected
                  ? t("parent_dashboard.live")
                  : t("parent_dashboard.offline")
              }
            >
              {isConnected ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              <span className="hidden sm:inline">
                {isConnected
                  ? t("parent_dashboard.live")
                  : t("parent_dashboard.offline")}
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === "inicio" && (
                  <div className="space-y-4">
                    {/* BANNER DE CELEBRACIÓN */}
                    {isCelebration && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-xl p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">🎉</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-amber-800 text-sm leading-tight">
                              {celebrationReason === "module"
                                ? t("celebrate.module_title", {
                                    name: studentFirst,
                                  })
                                : t("celebrate.streak_title", {
                                    days: streakDays,
                                  })}
                            </p>
                            <p className="text-xs text-amber-700 mt-1 leading-snug">
                              {celebrationReason === "module"
                                ? t("celebrate.module_body", {
                                    name: studentFirst,
                                  })
                                : t("celebrate.streak_body", {
                                    name: studentFirst,
                                  })}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full flex-shrink-0">
                            {t("celebrate.cta")}
                          </span>
                        </div>
                      </motion.div>
                    )}
                    {/* SEMÁFORO SEMANAL */}
                    <div
                      className="rounded-xl p-5 border"
                      style={{
                        background: wellness.bg,
                        borderColor: wellness.border,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Semáforo visual */}
                        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 p-2 rounded-lg bg-white/60">
                          {traffic.dotColors.map((c, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full transition-all"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        {/* Texto principal */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-black text-base leading-tight"
                            style={{ color: wellness.color }}
                          >
                            {t(`parent_dashboard.semaphore_${wellness.tier}`, {
                              name: studentFirst,
                            })}
                          </p>
                          <p className="text-xs mt-1.5 text-[#64748B] leading-relaxed">
                            {semaphorePhrase}
                          </p>
                        </div>
                        {/* Racha + contexto */}
                        <div className="flex-shrink-0 pl-2 border-l border-white/40 text-right min-w-[72px]">
                          <p className="text-2xl font-black text-[#004B63]">
                            {streakDays} 🔥
                          </p>
                          <p className="text-[10px] text-[#94A3B8] leading-tight">
                            {t("parent_dashboard.streak_days_consecutive")}
                          </p>
                          <p
                            className="text-[10px] font-semibold mt-1 leading-tight"
                            style={{ color: wellness.color }}
                          >
                            {streakContext.emoji}{" "}
                            {t(streakContext.key, streakContext.vars)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tu rol esta semana */}
                    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
                      <div className="mb-4">
                        <h3 className="font-bold text-[#004B63] flex items-center gap-2">
                          <span>👨‍👩‍👧</span> {t("role.section_title")}
                        </h3>
                        <p className="text-xs text-[#94A3B8] mt-0.5">
                          {t("role.section_subtitle", { name: studentFirst })}
                        </p>
                      </div>
                      {parentActions.length === 0 ? (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F0FDF4] border border-emerald-100">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-sm flex-shrink-0">
                            🌟
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#004B63]">
                              {t("role.no_actions")}
                            </p>
                            <p className="text-xs text-[#64748B] mt-0.5">
                              {t("role.no_actions_body", {
                                name: studentFirst,
                              })}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {parentActions.map((action, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.07 }}
                              className="flex items-start gap-3 p-3 rounded-lg border border-[#E2E8F0]"
                              style={{ backgroundColor: action.bg }}
                            >
                              <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center text-sm flex-shrink-0 shadow-sm">
                                {action.icon}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#004B63] leading-tight">
                                  {t(action.titleKey, {
                                    ...action.vars,
                                    name: studentFirst,
                                  })}
                                </p>
                                <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                                  {t(action.bodyKey, {
                                    ...action.vars,
                                    name: studentFirst,
                                  })}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Última actividad */}
                    {lastActivity && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD]"
                      >
                        <span className="text-lg flex-shrink-0">📖</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#0369A1]">
                            {lastActivity.daysDiff === 0
                              ? t("lastact.today")
                              : lastActivity.daysDiff === 1
                                ? t("lastact.yesterday")
                                : t("lastact.days_ago", {
                                    days: lastActivity.daysDiff,
                                  })}
                          </p>
                          <p className="text-[11px] text-[#64748B] mt-0.5">
                            {t("lastact.points", { pts: lastActivity.points })}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Mejor materia / Necesita atención */}
                    {bestSubject &&
                      worstSubject &&
                      bestSubject !== worstSubject && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1">
                              {t("parent_dashboard.best_subject")}
                            </p>
                            <p className="text-sm font-semibold text-emerald-900 truncate">
                              {bestSubject.name ||
                                bestSubject.title ||
                                bestSubject.subject}
                            </p>
                            <p className="text-xs text-emerald-600 mt-0.5">
                              {bestSubject.progress > 0
                                ? t("parent_dashboard.subject_pct", {
                                    pct: bestSubject.progress,
                                  })
                                : t("parent_dashboard.subject_not_started")}
                            </p>
                          </div>
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1">
                              {t("parent_dashboard.needs_attention")}
                            </p>
                            <p className="text-sm font-semibold text-amber-900 truncate">
                              {worstSubject.name ||
                                worstSubject.title ||
                                worstSubject.subject}
                            </p>
                            <p className="text-xs text-amber-600 mt-0.5">
                              {worstSubject.progress === 0
                                ? t("parent_dashboard.subject_not_started")
                                : t("parent_dashboard.subject_pct", {
                                    pct: worstSubject.progress,
                                  })}
                            </p>
                          </div>
                        </div>
                      )}

                    {/* ── "Ver más" mobile: Alertas + Insights + Qué hacer hoy ── */}
                    {/* En desktop siempre visible; en mobile colapsado por defecto */}
                    <div className="md:hidden">
                      <button
                        onClick={() => setShowMoreInicio((v) => !v)}
                        className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-sm font-semibold text-[#004B63]"
                      >
                        <span>
                          {showMoreInicio
                            ? t("parent_dashboard.show_less")
                            : t("parent_dashboard.show_more_details")}
                        </span>
                        <span
                          className={`transition-transform duration-200 ${showMoreInicio ? "rotate-180" : ""}`}
                        >
                          ▾
                        </span>
                      </button>
                    </div>

                    <div
                      className={`${showMoreInicio ? "block" : "hidden"} md:block space-y-3`}
                    >
                      {/* Early Warnings */}
                      {warnings.filter(
                        (w) => w.severity === "high" || w.severity === "medium",
                      ).length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest">
                            {t("parent_dashboard.learning_alerts")}
                          </p>
                          {warnings
                            .filter((w) => w.severity !== "low")
                            .map((w) => (
                              <div
                                key={w.id}
                                className={`rounded-xl border p-3 flex items-start gap-3 ${w.severity === "high" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}
                              >
                                <span className="text-lg flex-shrink-0">
                                  {w.severity === "high" ? "🔴" : "🟡"}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm font-bold ${w.severity === "high" ? "text-red-800" : "text-amber-800"}`}
                                  >
                                    {w.type === "inactivity"
                                      ? t("parent_dashboard.warning_inactivity")
                                      : w.type === "performance_drop"
                                        ? t(
                                            "parent_dashboard.warning_performance_drop",
                                          )
                                        : w.type === "repeated_errors"
                                          ? t(
                                              "parent_dashboard.warning_repeated_errors",
                                            )
                                          : t(
                                              "parent_dashboard.warning_streak_broken",
                                            )}
                                  </p>
                                  <p className="text-xs mt-0.5 text-gray-600">
                                    {w.recommendation}
                                  </p>
                                </div>
                                <button
                                  onClick={() => resolveWarning(w.id)}
                                  className="text-xs text-gray-400 hover:text-gray-600 flex-shrink-0"
                                  aria-label="Marcar como resuelta"
                                >
                                  ✓
                                </button>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Parent Intelligence Insights */}
                      {insights.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest">
                            Inteligencia Parental
                          </p>
                          {insights.map((ins, i) => {
                            const bg =
                              ins.severity === "success"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                : ins.severity === "warning"
                                  ? "bg-amber-50 border-amber-200 text-amber-800"
                                  : ins.severity === "alert"
                                    ? "bg-red-50 border-red-200 text-red-800"
                                    : "bg-blue-50 border-blue-200 text-blue-800";
                            return (
                              <div
                                key={i}
                                className={`rounded-xl border p-3 flex items-start gap-3 ${bg}`}
                                role="status"
                              >
                                <span className="text-lg flex-shrink-0">
                                  {ins.type === "progress"
                                    ? "🌟"
                                    : ins.type === "risk"
                                      ? "⚠️"
                                      : ins.type === "habit"
                                        ? "📅"
                                        : ins.type === "emotional"
                                          ? "💙"
                                          : "🎯"}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold">
                                    {ins.title}
                                  </p>
                                  <p className="text-xs mt-0.5 opacity-80">
                                    {ins.body}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* ¿Qué hacer hoy? */}
                      <div className="bg-gradient-to-r from-[#004B63]/5 to-[#4DA8C4]/5 rounded-xl border border-[#4DA8C4]/20 p-5">
                        <h3 className="font-bold text-[#004B63] mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#4DA8C4]" />
                          {t("parent_dashboard.what_today")}
                        </h3>
                        <div className="space-y-2">
                          {wellness.label ===
                          t("parent_dashboard.wellness_sin_actividad") ? (
                            <p className="text-sm text-[#64748B]">
                              {t("parent_dashboard.action_encourage_start", {
                                name: studentFirst,
                              })}
                            </p>
                          ) : completionRate < 0.5 ? (
                            <p className="text-sm text-[#64748B]">
                              {t("parent_dashboard.action_check_missions", {
                                name: studentFirst,
                              })}
                            </p>
                          ) : avgProgress < 30 ? (
                            <p className="text-sm text-[#64748B]">
                              {t("parent_dashboard.action_explore_subjects", {
                                name: studentFirst,
                              })}
                            </p>
                          ) : (
                            <p className="text-sm text-[#64748B]">
                              {t("parent_dashboard.action_keep_going", {
                                name: studentFirst,
                              })}
                            </p>
                          )}
                          <a
                            href={`https://wa.me/573001234567?text=${encodeURIComponent(t("parent_dashboard.whatsapp_msg", { student: studentFirst, points: data.points, streak: data.streak?.current || 0 }))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1da851] transition-colors"
                          >
                            <span>💬</span>
                            {t("parent_dashboard.contact_coach")}
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* end show-more block */}
                  </div>
                )}

                {activeSection === "actividad" && (
                  <div className="space-y-5">
                    <LivePresenceBar
                      streak={data.streak}
                      sessions={data.sessions}
                      totalActiveMinutes={data.minutes}
                      studentStatus={studentStatus}
                      liveSessions={liveSessions}
                    />
                    <ActivityLog
                      history={data.history}
                      streak={data.streak}
                      subjects={data.subjects}
                      liveActivities={liveActivities}
                      newActivityPulse={newActivityPulse}
                    />
                  </div>
                )}

                {activeSection === "progreso" && (
                  <div className="space-y-4">
                    {/* 0. Resumen narrativo de la semana */}
                    {(() => {
                      const now = Date.now();
                      const DAY = 86400000;
                      const weekHistory = (data.history || []).filter(
                        (e) => now - new Date(e.timestamp).getTime() < 7 * DAY,
                      );
                      const weekSessions = weekHistory.length;
                      const weekPoints = weekHistory.reduce(
                        (s, e) => s + (e.points || 0),
                        0,
                      );
                      const activeDays = new Set(
                        weekHistory.map((e) =>
                          new Date(e.timestamp).toDateString(),
                        ),
                      ).size;
                      const bestSubjectName =
                        [...data.subjects]
                          .sort((a, b) => b.progress - a.progress)
                          .find((s) => s.progress > 0)?.name || null;

                      let narrativeKey, narrativeVars;
                      if (weekSessions === 0) {
                        narrativeKey = "summary.no_activity";
                        narrativeVars = { name: studentFirst };
                      } else if (
                        wellness.tier === "excelente" &&
                        streakDays >= 3
                      ) {
                        narrativeKey = "summary.exc_streak";
                        narrativeVars = {
                          name: studentFirst,
                          days: activeDays,
                          pts: weekPoints,
                          streak: streakDays,
                        };
                      } else if (wellness.tier === "excelente") {
                        narrativeKey = "summary.exc_no_streak";
                        narrativeVars = {
                          name: studentFirst,
                          days: activeDays,
                          pts: weekPoints,
                        };
                      } else if (wellness.tier === "bien") {
                        narrativeKey = "summary.bien";
                        narrativeVars = {
                          name: studentFirst,
                          days: activeDays,
                          pts: weekPoints,
                        };
                      } else {
                        narrativeKey = "summary.regular";
                        narrativeVars = {
                          name: studentFirst,
                          days: activeDays,
                        };
                      }

                      return (
                        <div className="bg-gradient-to-br from-[#004B63]/6 to-[#4DA8C4]/4 rounded-xl p-4 border border-[#4DA8C4]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">📋</span>
                            <span className="text-[10px] font-bold text-[#004B63] uppercase tracking-widest">
                              {t("summary.card_title")}
                            </span>
                          </div>
                          <p className="text-sm text-[#1E3A4A] leading-relaxed">
                            {t(narrativeKey, narrativeVars)}
                          </p>
                          {bestSubjectName && weekSessions > 0 && (
                            <p className="text-xs text-[#4DA8C4] mt-2 font-medium">
                              {t("summary.best_subject", {
                                subject: bestSubjectName,
                              })}
                            </p>
                          )}
                          <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-[#004B63]/10">
                            {[
                              {
                                label: t("summary.stat_days"),
                                value: activeDays,
                              },
                              {
                                label: t("summary.stat_sessions"),
                                value: weekSessions,
                              },
                              {
                                label: t("summary.stat_points"),
                                value: weekPoints,
                              },
                            ].map((s, i) => (
                              <div key={i} className="text-center">
                                <p className="text-lg font-black text-[#004B63]">
                                  {s.value}
                                </p>
                                <p className="text-[10px] text-[#94A3B8] leading-tight">
                                  {s.label}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* 1. Resumen semanal con tendencia */}
                    <WeeklySummary
                      history={data.history}
                      streak={data.streak}
                    />

                    {/* 2. Todas las materias con etiquetas claras */}
                    <SubjectProgress subjects={data.subjects} />

                    {/* 3. Gráfica 14 días — detalle opcional */}
                    <PointsChart history={data.history} />

                    {/* 4. Estilo de aprendizaje VAK — al fondo para referencia */}
                    {data.vakResult && (
                      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="w-5 h-5 text-[#4DA8C4]" />
                          <h3 className="font-bold text-[#004B63] text-sm">
                            {t("parent_dashboard.how_learns", {
                              name: studentFirst,
                            })}
                          </h3>
                        </div>
                        <p className="text-xs text-[#94A3B8] mb-4">
                          {t("parent_dashboard.vak_predominant")}{" "}
                          <strong className="text-[#4DA8C4]">
                            {data.vakResult.predominantStyle}
                          </strong>
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                          {Object.entries(data.vakResult.scores || {}).map(
                            ([key, val]) => (
                              <div key={key}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-[#64748B] capitalize">
                                    {key}
                                  </span>
                                  <span className="font-bold text-[#004B63]">
                                    {val}%
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                      backgroundColor:
                                        key === "visual"
                                          ? "#4DA8C4"
                                          : key === "auditivo"
                                            ? "#66CCCC"
                                            : "#FFD166",
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${val}%` }}
                                    transition={{ duration: 1 }}
                                  />
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSection === "bienestar_disabled" && (
                  <div className="space-y-5">
                    <WellbeingCard authToken={authToken} />

                    {/* Pulso emocional detallado */}
                    <div
                      className="rounded-xl p-5 border"
                      style={{
                        background: wellness.bg,
                        borderColor: wellness.border,
                      }}
                    >
                      <h3 className="font-bold text-[#004B63] mb-4 flex items-center gap-2">
                        <span className="text-xl">{wellness.emoji}</span>{" "}
                        {t("parent_dashboard.emotional_pulse", {
                          name: studentFirst,
                        })}
                      </h3>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                          {
                            value: `${data.streak?.current || 0}🔥`,
                            label: t("parent_dashboard.current_streak"),
                          },
                          {
                            value: `${Math.round(completionRate * 100)}%`,
                            label: t("parent_dashboard.missions_done"),
                          },
                          {
                            value: `${studyHours}h`,
                            label: t("parent_dashboard.time_studied"),
                          },
                        ].map((s, i) => (
                          <div
                            key={i}
                            className="bg-white/70 rounded-lg p-3 text-center"
                          >
                            <p className="text-xl font-black text-[#004B63]">
                              {s.value}
                            </p>
                            <p className="text-xs text-[#64748B] mt-0.5">
                              {s.label}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <p className="text-xs font-semibold text-[#004B63] mb-1">
                          {t("parent_dashboard.tip_for_you", {
                            name: parentName.split(" ")[0],
                          })}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: wellness.color }}
                        >
                          {wellness.tip}
                        </p>
                      </div>
                    </div>

                    {/* Hábitos de estudio */}
                    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
                      <h3 className="font-bold text-[#004B63] mb-4">
                        {t("parent_dashboard.study_habits")}
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            icon: "📅",
                            title: t("parent_dashboard.longest_streak"),
                            desc: t("parent_dashboard.longest_streak_desc", {
                              days: data.streak?.longest || 0,
                            }),
                          },
                          {
                            icon: "⏱️",
                            title: t("parent_dashboard.total_time_invested"),
                            desc: t("parent_dashboard.total_time_desc", {
                              minutes: data.minutes,
                              hours: studyHours,
                            }),
                          },
                          {
                            icon: "📚",
                            title: t("parent_dashboard.subjects_with_progress"),
                            desc: t("parent_dashboard.subjects_of", {
                              count: data.subjects.filter((s) => s.progress > 0)
                                .length,
                              total: data.subjects.length,
                            }),
                          },
                          ...(data.vakResult
                            ? [
                                {
                                  icon: "🧠",
                                  title: t("parent_dashboard.learns_best", {
                                    name: studentFirst,
                                  }),
                                  desc:
                                    data.vakResult.predominantStyle === "visual"
                                      ? t("parent_dashboard.vak_visual_style")
                                      : data.vakResult.predominantStyle ===
                                          "auditivo"
                                        ? t(
                                            "parent_dashboard.vak_auditivo_style",
                                          )
                                        : t(
                                            "parent_dashboard.vak_kinestesico_style",
                                          ),
                                },
                              ]
                            : []),
                        ].map((h, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#4DA8C4]/10 flex items-center justify-center text-sm flex-shrink-0">
                              {h.icon}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#004B63]">
                                {h.title}
                              </p>
                              <p className="text-xs text-[#64748B]">{h.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "recursos_disabled" && (
                  <ParentResources
                    vakStyle={data.vakResult?.predominantStyle}
                    parentFirstName={parentName.split(" ")[0]}
                  />
                )}

                {activeSection === "recomendaciones" && (
                  <ParentRecommendations
                    streak={data.streak?.current || 0}
                    completionRate={completionRate}
                    avgProgress={avgProgress}
                    wellness={wellness}
                    vakResult={data.vakResult}
                    subjects={data.subjects}
                    studyHours={studyHours}
                    minutes={data.minutes}
                    studentFirst={studentFirst}
                  />
                )}

                {activeSection === "plan" && (
                  <div className="space-y-5">
                    {/* ROI hero — lo que el padre pagó y recibió */}
                    <div className="bg-gradient-to-br from-[#004B63] to-[#0077B6] rounded-xl p-6 text-white">
                      <h3 className="font-black text-xl mb-0.5">
                        {t("parent_dashboard.achieved_title", {
                          name: studentFirst,
                        })}
                      </h3>
                      <p className="text-white/60 text-sm mb-5">
                        {t("parent_dashboard.achieved_subtitle")}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          {
                            emoji: "⭐",
                            value:
                              data.points > 0
                                ? data.points.toLocaleString()
                                : "–",
                            label: t("parent_dashboard.points_earned"),
                            sub:
                              data.points === 0
                                ? t("parent_dashboard.roi_pending")
                                : null,
                          },
                          {
                            emoji: "⏱️",
                            value:
                              studyHours >= 0.1
                                ? `${studyHours}h`
                                : `${data.minutes || 0}m`,
                            label: t("parent_dashboard.study_hours"),
                            sub: null,
                          },
                          {
                            emoji: "🔥",
                            value: `${streakDays}d`,
                            label: t(
                              "parent_dashboard.streak_days_consecutive",
                            ),
                            sub:
                              data.streak?.longest > streakDays
                                ? t("parent_dashboard.roi_best_streak", {
                                    days: data.streak.longest,
                                  })
                                : null,
                          },
                          {
                            emoji: "📚",
                            value:
                              data.subjects.length > 0
                                ? `${data.subjects.filter((s) => s.progress > 0).length}/${data.subjects.length}`
                                : "–",
                            label: t("parent_dashboard.advanced_subjects"),
                            sub: null,
                          },
                        ].map((stat, i) => (
                          <div
                            key={i}
                            className="bg-white/10 rounded-xl p-4 text-center"
                          >
                            <p className="text-2xl mb-1">{stat.emoji}</p>
                            <p className="text-2xl font-black">{stat.value}</p>
                            <p className="text-xs text-white/60 mt-0.5">
                              {stat.label}
                            </p>
                            {stat.sub && (
                              <p className="text-[10px] text-white/40 mt-0.5">
                                {stat.sub}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reorder on mobile: Informe first, Features+Weekly after */}
                    <div className="flex flex-col gap-5">
                      {/* Informe académico — order-1 mobile, order-3 desktop */}
                      <div className="order-1 md:order-3">
                        <h3 className="font-bold text-[#004B63] mb-3 flex items-center gap-2">
                          <span>📊</span> Informe académico — Análisis de notas
                        </h3>
                        <GradeReportCard
                          authToken={authToken}
                          studentId={studentId || userId}
                        />
                      </div>

                      {/* Features list — order-2 mobile, order-1 desktop */}
                      <div className="order-2 md:order-1 bg-white rounded-xl p-5 border border-[#E2E8F0]">
                        <h3 className="font-bold text-[#004B63] mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#4DA8C4]" />{" "}
                          {t("parent_dashboard.subscription_includes")}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {FEATURES.map((f, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg"
                            >
                              <span className="text-xl">{f.icon}</span>
                              <span className="text-sm text-[#334155] flex-1">
                                {t(f.textKey)}
                              </span>
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* WeeklyReportCard — order-3 mobile, order-2 desktop */}
                      <div className="order-3 md:order-2">
                        <WeeklyReportCard
                          authToken={authToken}
                          studentName={data.vakResult?.studentName}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "controles" && (
                  <ParentalControlsPanel
                    authToken={authToken}
                    studentId={studentId || userId}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Bottom nav for mobile */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E2E8F0] flex items-center justify-around px-2 pb-safe"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      >
        {NAV.map(({ id, labelKey, Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveSection(id);
              setMobileOpen(false);
            }}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg transition-all min-w-0 flex-1 ${activeSection === id ? "text-[#004B63]" : "text-[#94A3B8]"}`}
          >
            <Icon
              className={`w-5 h-5 flex-shrink-0 ${activeSection === id ? "text-[#4DA8C4]" : ""}`}
            />
            <span className="text-[9px] font-medium truncate w-full text-center leading-tight">
              {t(labelKey)}
            </span>
            {activeSection === id && (
              <motion.div
                layoutId="mobile-nav-dot"
                className="w-1 h-1 rounded-full bg-[#4DA8C4]"
              />
            )}
          </button>
        ))}
      </nav>
    </>
  );
};

export default IngenIAParentDashboard;
