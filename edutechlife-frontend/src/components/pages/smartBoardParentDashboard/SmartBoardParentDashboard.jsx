import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthIdentity, signOutUser } from "../../../hooks/useAuthIdentity";
import { useParentDashboardRealtime } from "../../../hooks/useParentDashboardRealtime";
import { useParentStudentData } from "../../../hooks/useParentStudentData";
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
} from "lucide-react";
import SEO from "../../SEO";
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
import { mergeRealtimePoints } from "./mergeRealtime";

const LEVELS = [
  { min: 5000, name: "Maestro", emoji: "🏆" },
  { min: 2500, name: "Experto", emoji: "⭐" },
  { min: 1000, name: "Avanzado", emoji: "📚" },
  { min: 500, name: "Intermedio", emoji: "🌟" },
  { min: 0, name: "Principiante", emoji: "🌱" },
];

const FEATURES = [
  { icon: "🤖", text: "Tutor IA Dani — disponible 24/7" },
  { icon: "🧠", text: "Diagnóstico VAK — cómo aprende tu hijo/a" },
  { icon: "🎯", text: "Misiones gamificadas diarias" },
  { icon: "🛡️", text: "Monitoreo de bienestar emocional con IA" },
  { icon: "📊", text: "Dashboard exclusivo para padres" },
  { icon: "📧", text: "Reportes semanales por correo" },
];

const NAV = [
  { id: "resumen", label: "Resumen", Icon: LayoutDashboard },
  { id: "actividad", label: "Actividad", Icon: Activity },
  { id: "progreso", label: "Progreso", Icon: TrendingUp },
  { id: "bienestar", label: "Bienestar", Icon: Heart },
  { id: "recursos", label: "Recursos", Icon: BookMarked },
  { id: "plan", label: "Mi Plan", Icon: Star },
];

const getWellness = (streak, completionRate, minutes) => {
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
      label: "Excelente",
      color: "#16A34A",
      bg: "#F0FDF4",
      border: "#BBF7D0",
      emoji: "😊",
      tip: "¡Tu hijo/a está muy motivado/a! Felicítale por su constancia.",
    };
  if (s >= 3)
    return {
      label: "Bien",
      color: "#D97706",
      bg: "#FFFBEB",
      border: "#FDE68A",
      emoji: "🙂",
      tip: "Va bien. Pregúntale cómo le va en sus materias favoritas.",
    };
  if (s >= 1)
    return {
      label: "Regular",
      color: "#EA580C",
      bg: "#FFF7ED",
      border: "#FED7AA",
      emoji: "😐",
      tip: "Podría necesitar un empujón. Anímale a completar una misión hoy.",
    };
  return {
    label: "Sin actividad reciente",
    color: "#64748B",
    bg: "#F8FAFC",
    border: "#E2E8F0",
    emoji: "💤",
    tip: "No hay actividad reciente. Recuérdale que Dani le espera en SmartBoard.",
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
}) => (
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
            Panel de Padres
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
          <p className="text-[#4DA8C4] text-xs">Padre / Madre</p>
        </div>
      </div>
      {studentEmail && (
        <div className="mt-3 bg-white/8 rounded-lg px-3 py-2">
          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
            Monitoreando
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
                ? "Estudiando ahora ✨"
                : studentEmail.split("@")[0]}
            </p>
          </div>
        </div>
      )}
    </div>

    <nav className="flex-1 p-3 space-y-0.5">
      {NAV.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => {
            onSection(id);
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === id ? "bg-white/15 text-white" : "text-white/55 hover:bg-white/8 hover:text-white"}`}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          {label}
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
        <LogOut className="w-4 h-4" /> Cerrar Sesión
      </button>
    </div>
  </motion.aside>
);

const SmartBoardParentDashboard = () => {
  const navigate = useNavigate();
  const { userId, token: authToken, isLoaded } = useAuthIdentity();
  const [activeSection, setActiveSection] = useState("resumen");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [liveActivities, setLiveActivities] = useState([]);
  const [newActivityPulse, setNewActivityPulse] = useState(false);

  const isParent = localStorage.getItem("user_role") === "parent";
  const studentEmail = localStorage.getItem("student_email") || "";
  const studentId = localStorage.getItem("student_id") || "";
  const parentName = localStorage.getItem("parent_name") || "Padre/Madre";

  const { data: supabaseData, source: dataSource } = useParentStudentData(
    studentId || userId,
    authToken,
  );
  const [data, setData] = useState(supabaseData);
  const liveAppliedRef = useRef(false);

  const { studentStatus, liveSessions, livePoints, isConnected } =
    useParentDashboardRealtime(userId, studentId || userId, authToken);

  // studentStatus is StudentOnlineStatus[] — check if child's entry is online
  const studentOnline = Array.isArray(studentStatus)
    ? studentStatus.some(
        (s) => s.auth_id === (studentId || userId) && s.is_online,
      )
    : false;

  useEffect(() => {
    if (isLoaded && !userId && !isParent) navigate("/smartboard/login");
  }, [isLoaded, userId, isParent, navigate]);

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
  );
  const studentFirst = studentEmail ? studentEmail.split("@")[0] : "tu hijo/a";

  if (!isParent && isLoaded && !userId) return null;

  return (
    <>
      <SEO
        title="Panel de Padres · SmartBoard"
        description="Monitorea el progreso y bienestar de tu hijo en SmartBoard EdutechLife"
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
                {NAV.find((n) => n.id === activeSection)?.label}
              </h2>
              <p className="text-[#94A3B8] text-xs">
                Hola, {parentName.split(" ")[0]} · Monitoreando a {studentFirst}
              </p>
            </div>
            {studentOnline && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {studentFirst} está estudiando
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
                  ? "Datos en vivo desde el servidor"
                  : dataSource === "supabase"
                    ? "Datos en tiempo real desde la nube"
                    : "Datos locales de este dispositivo"
              }
            >
              <Database className="w-3 h-3" />
              {dataSource === "backend"
                ? "En vivo"
                : dataSource === "supabase"
                  ? "Nube"
                  : "Local"}
            </div>
            <div
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${isConnected ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}
            >
              {isConnected ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              {isConnected ? "En vivo" : "Offline"}
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
                          {studentFirst} está:{" "}
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
                        <p className="text-xs text-[#94A3B8]">días seguidos</p>
                      </div>
                    </div>

                    {/* 4 KPIs — claros, sin ruido */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <StatCard
                        icon={<Trophy className="w-4 h-4" />}
                        label="Puntos ganados"
                        value={data.points.toLocaleString()}
                        color="#FFD166"
                        subtitle={`${level.emoji} ${level.name}`}
                      />
                      <StatCard
                        icon={<Clock className="w-4 h-4" />}
                        label="Horas de estudio"
                        value={`${studyHours}h`}
                        color="#4DA8C4"
                        subtitle={`${data.minutes} min totales`}
                      />
                      <StatCard
                        icon={<Award className="w-4 h-4" />}
                        label="Misiones"
                        value={`${completed}/${total}`}
                        color="#66CCCC"
                        subtitle={`${Math.round(completionRate * 100)}% completadas`}
                      />
                      <StatCard
                        icon={<TrendingUp className="w-4 h-4" />}
                        label="Progreso promedio"
                        value={`${avgProgress}%`}
                        color="#B2D8E5"
                        subtitle={`${data.subjects.length} materias`}
                      />
                    </div>

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
                            Cómo aprende {studentFirst}
                          </h3>
                        </div>
                        <p className="text-xs text-[#94A3B8] mb-4">
                          Diagnóstico VAK — estilo predominante:{" "}
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
                        <span className="text-xl">{wellness.emoji}</span> Pulso
                        emocional de {studentFirst}
                      </h3>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                          {
                            value: `${data.streak?.current || 0}🔥`,
                            label: "Racha actual",
                          },
                          {
                            value: `${Math.round(completionRate * 100)}%`,
                            label: "Misiones hechas",
                          },
                          {
                            value: `${studyHours}h`,
                            label: "Tiempo estudiado",
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
                          💡 Tip para ti, {parentName.split(" ")[0]}
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
                        Hábitos de estudio
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            icon: "📅",
                            title: "Racha más larga",
                            desc: `${data.streak?.longest || 0} días consecutivos de estudio`,
                          },
                          {
                            icon: "⏱️",
                            title: "Tiempo total invertido",
                            desc: `${data.minutes} min (${studyHours}h) de aprendizaje activo`,
                          },
                          {
                            icon: "📚",
                            title: "Materias con avance",
                            desc: `${data.subjects.filter((s) => s.progress > 0).length} de ${data.subjects.length} materias`,
                          },
                          ...(data.vakResult
                            ? [
                                {
                                  icon: "🧠",
                                  title: `${studentFirst} aprende mejor de forma`,
                                  desc: `${data.vakResult.predominantStyle === "visual" ? "visual — comparte videos y diagramas" : data.vakResult.predominantStyle === "auditivo" ? "auditiva — prueba podcasts y explicaciones orales" : "kinestésica — apoya con ejercicios y proyectos prácticos"}`,
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
                        Lo que ha logrado {studentFirst}
                      </h3>
                      <p className="text-white/60 text-sm mb-5">
                        con SmartBoard · tu inversión en acción
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          {
                            emoji: "⭐",
                            value: data.points.toLocaleString(),
                            label: "Puntos ganados",
                          },
                          {
                            emoji: "⏱️",
                            value: `${studyHours}h`,
                            label: "Horas de estudio",
                          },
                          {
                            emoji: "✅",
                            value: completed,
                            label: "Misiones completadas",
                          },
                          {
                            emoji: "📚",
                            value: data.subjects.filter((s) => s.progress > 0)
                              .length,
                            label: "Materias avanzadas",
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
                        <Sparkles className="w-4 h-4 text-[#4DA8C4]" /> Tu
                        suscripción SmartBoard incluye
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {FEATURES.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg"
                          >
                            <span className="text-xl">{f.icon}</span>
                            <span className="text-sm text-[#334155] flex-1">
                              {f.text}
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
                  </div>
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
