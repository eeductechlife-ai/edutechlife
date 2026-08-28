import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthIdentity, signOutUser } from "../../../hooks/useAuthIdentity";
import { useParentDashboardRealtime } from "../../../hooks/useParentDashboardRealtime";
import { useParentStudentData } from "../../../hooks/useParentStudentData";
import { useParentInsights } from "../../../hooks/useParentInsights";
import { useEarlyWarnings } from "../../../hooks/useEarlyWarnings";
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
  Database,
  Shield,
  ChevronDown,
} from "lucide-react";
import SEO from "../../SEO";
import { useTranslation } from "../../../i18n/I18nProvider";
import { createSupabaseClient } from "../../../lib/supabase";
import { LivePresenceBar, ActivityLog } from "./components/ParentControls";
import {
  StatCard,
  PointsChart,
  SubjectProgress,
} from "./components/ParentStats";
import WeeklyReportCard from "./components/WeeklyReportCard";
import WellbeingCard from "./components/WellbeingCard";
import ParentResources from "./components/ParentResources";
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
    id: "resumen",
    labelKey: "parent_dashboard.nav_resumen",
    Icon: LayoutDashboard,
  },
  {
    id: "actividad",
    labelKey: "parent_dashboard.nav_actividad",
    Icon: Activity,
  },
  {
    id: "progreso",
    labelKey: "parent_dashboard.nav_progreso",
    Icon: TrendingUp,
  },
  { id: "bienestar", labelKey: "parent_dashboard.nav_bienestar", Icon: Heart },
  {
    id: "recursos",
    labelKey: "parent_dashboard.nav_recursos",
    Icon: BookMarked,
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
      label: t("parent_dashboard.wellness_excelente"),
      color: "#16A34A",
      bg: "#F0FDF4",
      border: "#BBF7D0",
      emoji: "😊",
      tip: t("parent_dashboard.wellness_excelente_tip"),
    };
  if (s >= 3)
    return {
      label: t("parent_dashboard.wellness_bien"),
      color: "#D97706",
      bg: "#FFFBEB",
      border: "#FDE68A",
      emoji: "🙂",
      tip: t("parent_dashboard.wellness_bien_tip"),
    };
  if (s >= 1)
    return {
      label: t("parent_dashboard.wellness_regular"),
      color: "#EA580C",
      bg: "#FFF7ED",
      border: "#FED7AA",
      emoji: "😐",
      tip: t("parent_dashboard.wellness_regular_tip"),
    };
  return {
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
            <h1 className="text-white font-black text-lg leading-tight">
              SmartBoard
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
        {studentEmail && (
          <div className="mt-3 bg-white/8 rounded-lg px-3 py-2">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
              {t("parent_dashboard.monitoring")}
            </p>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${studentOnline ? "bg-emerald-400 animate-pulse" : "bg-white/25"}`}
              />
              <p
                className="text-xs font-medium truncate"
                style={{
                  color: studentOnline ? "#34d399" : "rgba(255,255,255,0.6)",
                }}
              >
                {studentOnline
                  ? t("parent_dashboard.studying_now")
                  : studentEmail.split("@")[0]}
              </p>
            </div>
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

const SmartBoardParentDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId, token: authToken, isLoaded } = useAuthIdentity();
  const [activeSection, setActiveSection] = useState("resumen");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [liveActivities, setLiveActivities] = useState([]);
  const [newActivityPulse, setNewActivityPulse] = useState(false);
  const [metricsOpen, setMetricsOpen] = useState(false);

  const isParent = localStorage.getItem("user_role") === "parent";
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

  // studentStatus is StudentOnlineStatus[] — check if child's entry is online
  const studentOnline = Array.isArray(studentStatus)
    ? studentStatus.some(
        (s) => s.auth_id === (studentId || userId) && s.is_online,
      )
    : false;

  useEffect(() => {
    if (isLoaded && !userId && !isParent) navigate("/smartboard/login");
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
    signOutUser("/smartboard/login", navigate);
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
  const studentFirst = studentEmail
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
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                dataSource === "backend"
                  ? "bg-emerald-50 text-emerald-700"
                  : dataSource === "supabase"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-100 text-gray-500"
              }`}
              title={
                dataSource === "backend"
                  ? t("parent_dashboard.source_backend")
                  : dataSource === "supabase"
                    ? t("parent_dashboard.source_supabase")
                    : t("parent_dashboard.source_local")
              }
            >
              <Database className="w-3 h-3" />
              {dataSource === "backend"
                ? t("parent_dashboard.live")
                : dataSource === "supabase"
                  ? t("parent_dashboard.cloud")
                  : t("parent_dashboard.local")}
            </div>
            <div
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${isConnected ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}
            >
              {isConnected ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              {isConnected
                ? t("parent_dashboard.live")
                : t("parent_dashboard.offline")}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === "resumen" && (
                  <div className="space-y-5">
                    {/* Wellness pulse — lo más importante para un padre */}
                    <div
                      className="rounded-xl p-4 border flex items-center gap-4"
                      style={{
                        background: wellness.bg,
                        borderColor: wellness.border,
                      }}
                    >
                      <span className="text-4xl flex-shrink-0">
                        {wellness.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-bold text-sm"
                          style={{ color: wellness.color }}
                        >
                          {t("parent_dashboard.student_status", {
                            name: studentFirst,
                          })}{" "}
                          <span className="capitalize">{wellness.label}</span>
                        </p>
                        <p
                          className="text-xs mt-0.5 opacity-80"
                          style={{ color: wellness.color }}
                        >
                          {wellness.tip}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 hidden sm:block">
                        <p className="text-2xl font-black text-[#004B63]">
                          {data.streak?.current || 0} 🔥
                        </p>
                        <p className="text-xs text-[#94A3B8]">
                          {t("parent_dashboard.streak_days_consecutive")}
                        </p>
                      </div>
                    </div>

                    {/* 4 KPIs — claros, sin ruido */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <StatCard
                        icon={<Trophy className="w-4 h-4" />}
                        label={t("parent_dashboard.points_earned")}
                        value={data.points.toLocaleString()}
                        color="#FFD166"
                        subtitle={`${level.emoji} ${t(level.nameKey)}`}
                      />
                      <StatCard
                        icon={<Clock className="w-4 h-4" />}
                        label={t("parent_dashboard.study_hours")}
                        value={`${studyHours}h`}
                        color="#4DA8C4"
                        subtitle={t("parent_dashboard.minutes_total_label", {
                          minutes: data.minutes,
                        })}
                      />
                      <StatCard
                        icon={<Award className="w-4 h-4" />}
                        label={t("parent_dashboard.missions")}
                        value={`${completed}/${total}`}
                        color="#66CCCC"
                        subtitle={t("parent_dashboard.missions_completed_pct", {
                          pct: Math.round(completionRate * 100),
                        })}
                      />
                      <StatCard
                        icon={<TrendingUp className="w-4 h-4" />}
                        label={t("parent_dashboard.avg_progress")}
                        value={`${avgProgress}%`}
                        color="#B2D8E5"
                        subtitle={t("parent_dashboard.subjects_count", {
                          count: data.subjects.length,
                        })}
                      />
                    </div>

                    {/* Early Warnings */}
                    {warnings.filter(
                      (w) => w.severity === "high" || w.severity === "medium",
                    ).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest">
                          Alertas de Aprendizaje
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
                                    ? "Inactividad detectada"
                                    : w.type === "performance_drop"
                                      ? "Caída de rendimiento"
                                      : w.type === "repeated_errors"
                                        ? "Errores repetitivos"
                                        : "Racha interrumpida"}
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
                                <p className="text-sm font-bold">{ins.title}</p>
                                <p className="text-xs mt-0.5 opacity-80">
                                  {ins.body}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <PointsChart history={data.history} />
                      <SubjectProgress subjects={data.subjects} />
                    </div>
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
                  <div className="space-y-5">
                    {data.vakResult && (
                      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="w-5 h-5 text-[#4DA8C4]" />
                          <h3 className="font-bold text-[#004B63]">
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
                                <div className="flex justify-between text-sm mb-1">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <SubjectProgress subjects={data.subjects} />
                      <PointsChart history={data.history} />
                    </div>
                  </div>
                )}

                {activeSection === "bienestar" && (
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

                {activeSection === "recursos" && (
                  <ParentResources
                    vakStyle={data.vakResult?.predominantStyle}
                    parentFirstName={parentName.split(" ")[0]}
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
                            value: data.points.toLocaleString(),
                            label: t("parent_dashboard.points_earned"),
                          },
                          {
                            emoji: "⏱️",
                            value: `${studyHours}h`,
                            label: t("parent_dashboard.study_hours"),
                          },
                          {
                            emoji: "✅",
                            value: completed,
                            label: t("parent_dashboard.missions_completed"),
                          },
                          {
                            emoji: "📚",
                            value: data.subjects.filter((s) => s.progress > 0)
                              .length,
                            label: t("parent_dashboard.advanced_subjects"),
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
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
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

                    <WeeklyReportCard
                      authToken={authToken}
                      studentName={data.vakResult?.studentName}
                    />

                    {/* Informe de notas y plan académico de Dani */}
                    <div>
                      <h3 className="font-bold text-[#004B63] mb-3 flex items-center gap-2">
                        <span>📊</span> Informe académico — Análisis de notas
                      </h3>
                      <GradeReportCard
                        authToken={authToken}
                        studentId={studentId || userId}
                      />
                    </div>

                    {/* Internal Metrics — collapsible admin panel */}
                    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
                      <button
                        onClick={() => setMetricsOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F8FAFC] transition-colors"
                      >
                        <span className="flex items-center gap-2 text-sm font-bold text-[#004B63]">
                          <Activity className="w-4 h-4 text-[#4DA8C4]" />
                          Internal Metrics
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${metricsOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {metricsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5">
                              <Suspense
                                fallback={
                                  <div className="text-center py-8 text-sm text-[#94A3B8]">
                                    Cargando...
                                  </div>
                                }
                              >
                                <InternalMetricsDashboard
                                  authToken={authToken}
                                />
                              </Suspense>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
    </>
  );
};

export default SmartBoardParentDashboard;
