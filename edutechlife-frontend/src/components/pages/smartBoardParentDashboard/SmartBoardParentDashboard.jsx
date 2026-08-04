import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthIdentity } from "../../../hooks/useAuthIdentity";
import { useParentDashboardRealtime } from "../../../hooks/useParentDashboardRealtime";
import {
  ArrowLeft,
  Brain,
  Trophy,
  Award,
  Clock,
  TrendingUp,
  Zap,
  BarChart3,
} from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";
import SEO from "../../SEO";
import { createSupabaseClient } from "../../../lib/supabase";
import { LivePresenceBar, ActivityLog } from "./components/ParentControls";
import {
  StatCard,
  PointsChart,
  SubjectProgress,
} from "./components/ParentStats";
import ParentChildrenList from "./components/ParentChildrenList";
import WeeklyReportCard from "./components/WeeklyReportCard";
import WellbeingCard from "./components/WellbeingCard";

const STORAGE_PREFIX = "edutechlife";

const loadData = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const LEVELS = [
  { min: 5000, name: "Maestro", emoji: "🏆", color: "#FFD166" },
  { min: 2500, name: "Experto", emoji: "⭐", color: "#4DA8C4" },
  { min: 1000, name: "Avanzado", emoji: "📚", color: "#66CCCC" },
  { min: 500, name: "Intermedio", emoji: "🌟", color: "#B2D8E5" },
  { min: 0, name: "Principiante", emoji: "🌱", color: "#66CCCC" },
];

const SmartBoardParentDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Identidad desde Supabase: useAuth() era de Clerk y ya ni siquiera se importaba.
  const { userId, token: authToken, isLoaded } = useAuthIdentity();

  const [data, setData] = useState({
    points: 0,
    history: [],
    vakResult: null,
    minutes: 0,
    missions: [],
    subjects: [],
    events: [],
    streak: { current: 0, longest: 0, lastActive: null },
    sessions: [],
  });
  const [liveActivities, setLiveActivities] = useState([]);
  const [newActivityPulse, setNewActivityPulse] = useState(false);

  // Realtime subscriptions for live data
  const { studentStatus, liveSessions, livePoints, isConnected } =
    useParentDashboardRealtime(userId, authToken);

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      navigate("/login");
      return;
    }

    const suffix = `_${userId}`;

    const loadParentData = () => {
      const points = parseInt(
        localStorage.getItem(`${STORAGE_PREFIX}_points${suffix}`) || "0",
        10,
      );
      const history =
        loadData(`${STORAGE_PREFIX}_points_history${suffix}`) || [];
      const vakResult = loadData(`${STORAGE_PREFIX}_vak${suffix}`);
      const minutes = parseInt(
        localStorage.getItem(`${STORAGE_PREFIX}_minutes${suffix}`) || "0",
        10,
      );
      const missions = loadData(`${STORAGE_PREFIX}_missions${suffix}`) || [];
      const subjects = loadData(`${STORAGE_PREFIX}_subjects${suffix}`) || [];
      const events = loadData(`${STORAGE_PREFIX}_calendar${suffix}`) || [];
      const streak = loadData(`${STORAGE_PREFIX}_streak${suffix}`) || {
        current: 0,
        longest: 0,
        lastActive: null,
      };
      const sessions = loadData(`${STORAGE_PREFIX}_sessions${suffix}`) || [];
      return {
        points,
        history,
        vakResult,
        minutes,
        missions,
        subjects,
        events,
        streak,
        sessions,
      };
    };

    const update = () => setData(loadParentData());
    update();

    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [userId, isLoaded, navigate]);

  useEffect(() => {
    if (!isLoaded || !userId || !authToken) return;

    let channel;
    let supabaseClient;

    const setupRealtime = async () => {
      try {
        supabaseClient = createSupabaseClient(authToken);

        channel = supabaseClient
          .channel("parent-activity-live")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "activity_log",
              filter: `user_id=eq.${userId}`,
            },
            (payload) => {
              const activity = payload.new;
              setLiveActivities((prev) => {
                const updated = [activity, ...prev];
                return updated.slice(0, 10);
              });
              setNewActivityPulse(true);
              setTimeout(() => setNewActivityPulse(false), 2000);
            },
          )
          .subscribe();
      } catch (err) {
        console.warn("[ParentDashboard] Realtime not available:", err.message);
      }
    };

    setupRealtime();

    return () => {
      if (channel && supabaseClient) {
        supabaseClient.removeChannel(channel);
      }
    };
  }, [isLoaded, userId, authToken]);

  // Update live sessions and points from realtime subscriptions
  useEffect(() => {
    if (liveSessions.length > 0 || livePoints.length > 0) {
      setData((prev) => {
        const updatedData = { ...prev };

        // Update sessions with live data
        if (liveSessions.length > 0) {
          updatedData.sessions = liveSessions;
        }

        // Update points history with live data
        if (livePoints.length > 0) {
          const newPoints = livePoints.reduce(
            (sum, entry) => sum + entry.points,
            0,
          );
          updatedData.points = (prev.points || 0) + newPoints;
          updatedData.history = [...livePoints, ...(prev.history || [])].slice(
            0,
            100,
          );
        }

        return updatedData;
      });
    }
  }, [liveSessions, livePoints]);

  const level =
    LEVELS.find((l) => data.points >= l.min) || LEVELS[LEVELS.length - 1];
  const completedMissions = data.missions.filter((m) => m.completed).length;
  const totalMissions = data.missions.length;
  const averageProgress =
    data.subjects.length > 0
      ? Math.round(
          data.subjects.reduce((s, sub) => s + sub.progress, 0) /
            data.subjects.length,
        )
      : 0;

  const kpiVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const kpiItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <>
      <SEO
        title={t("seo.smartboard_parents.title")}
        description={t("seo.smartboard_parents.desc")}
      />
      <div className="min-h-screen bg-[#F8FAFC] border-t-4 border-[#004B63]">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate("/smartboard")}
              className="flex items-center gap-2 text-[#64748B] hover:text-[#004B63] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t("smartboard.back_dashboard")}
              </span>
            </button>
            <h1 className="text-3xl font-black text-[#004B63]">
              {t("smartboard.parent_panel")}
            </h1>
            <p className="text-[#64748B] mt-1">{t("smartboard.parent_desc")}</p>
          </motion.div>

          {/* Bienestar como pilar de confianza (Track D) */}
          <WellbeingCard authToken={authToken} />

          {/* Reporte semanal por correo (Track A) */}
          <WeeklyReportCard
            authToken={authToken}
            studentName={data.vakResult?.studentName}
          />

          {/* Live Presence */}
          <div className="mb-6">
            <LivePresenceBar
              streak={data.streak}
              sessions={data.sessions}
              totalActiveMinutes={data.minutes}
              studentStatus={studentStatus}
              liveSessions={liveSessions}
            />
          </div>

          {/* KPI Cards */}
          <motion.div
            variants={kpiVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
          >
            {[
              {
                icon: <Trophy className="w-5 h-5 text-[#FFD166]" />,
                label: "Puntos",
                value: data.points.toLocaleString(),
                color: "#FFD166",
                subtitle: `${level.emoji} ${level.name}`,
              },
              {
                icon: <Award className="w-5 h-5 text-[#4DA8C4]" />,
                label: "Misiones",
                value: `${completedMissions}/${totalMissions}`,
                color: "#4DA8C4",
                subtitle: `${totalMissions - completedMissions} pendientes`,
              },
              {
                icon: <Clock className="w-5 h-5 text-[#66CCCC]" />,
                label: "Tiempo activo",
                value: `${data.minutes} min`,
                color: "#66CCCC",
                subtitle: `${Math.floor(data.minutes / 60)}h totales`,
              },
              {
                icon: (
                  <TrendingUp
                    className="w-5 h-5"
                    style={{ color: "#B2D8E5" }}
                  />
                ),
                label: "Progreso",
                value: `${averageProgress}%`,
                color: "#B2D8E5",
                subtitle: "Promedio",
              },
              {
                icon: <Zap className="w-5 h-5 text-[#FF6B9D]" />,
                label: "Racha",
                value: `${data.streak?.current || 0} 🔥`,
                color: "#FF6B9D",
                subtitle:
                  data.streak?.current > 0
                    ? `Máx: ${data.streak.longest}`
                    : "Sin racha",
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-[#A855F7]" />,
                label: "Materias",
                value: `${data.subjects.filter((s) => s.progress > 0).length}/${data.subjects.length}`,
                color: "#A855F7",
                subtitle: "Activas",
              },
            ].map((stat, i) => (
              <motion.div key={i} variants={kpiItemVariants}>
                <StatCard {...stat} />
              </motion.div>
            ))}
          </motion.div>

          {/* VAK Profile */}
          {data.vakResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#4DA8C4]/10 to-[#66CCCC]/10 rounded-xl p-5 border border-[#4DA8C4]/20 mb-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-5 h-5 text-[#4DA8C4]" />
                <h3 className="font-bold text-[#004B63]">
                  {t("smartboard.vak_profile")}
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(data.vakResult.scores || {}).map(
                  ([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#64748B] capitalize">{key}</span>
                        <span className="font-bold text-[#004B63]">
                          {value}%
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
                            width: `${value}%`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
              {data.vakResult.predominantStyle && (
                <p className="text-sm text-[#4DA8C4] mt-3 font-semibold">
                  {t("smartboard.predominant_style", {
                    style: data.vakResult.predominantStyle,
                  })}
                </p>
              )}
            </motion.div>
          )}

          {/* Analytics + Activity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <PointsChart history={data.history} />
            <SubjectProgress subjects={data.subjects} />
          </div>

          {/* Activity + Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
            <ActivityLog
              history={data.history}
              streak={data.streak}
              subjects={data.subjects}
              liveActivities={liveActivities}
              newActivityPulse={newActivityPulse}
            />
            <ParentChildrenList sessions={data.sessions} events={data.events} />
          </div>

          <div className="text-center mt-8">
            <p className="text-xs text-[#94A3B8]">
              {t("smartboard.auto_update")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SmartBoardParentDashboard;
