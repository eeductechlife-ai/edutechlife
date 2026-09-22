import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, LogOut, Moon, Sun } from "lucide-react";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { useStudentProfileIngenIA } from "../../../hooks/useStudentProfileIngenIA";
import { ProgressBar } from "../ui";
import { SB_COLORS, SB_GRADIENTS, glow } from "../ingenIATheme";
import EditProfileModal from "../EditProfileModal";

const PROGRESS_GRADIENT = SB_GRADIENTS.progress;
const PROGRESS_GLOW = "#FB8500";

const GOAL_LABELS = {
  mejorar_notas: "📈 Mejorar notas",
  mejorar_habitos: "📅 Mejorar hábitos",
  recuperar_materia: "🔄 Recuperar materia",
  preparar_examenes: "📝 Preparar exámenes",
  aprender_ia: "🤖 Aprender con IA",
  acompanar: "🤝 Acompañar de lejos",
};

const INTEREST_LABELS = {
  matematicas: "🔢 Mates",
  ciencias: "🔬 Ciencias",
  tecnologia: "💻 Tech",
  arte: "🎨 Arte",
  musica: "🎵 Música",
  deporte: "⚽ Deporte",
  lectura: "📚 Lectura",
  historia: "🌍 Historia",
};

const VAK_LABELS = {
  visual: "👁️ Visual",
  auditivo: "👂 Auditivo",
  kinestesico: "✋ Kinestésico",
  auditory: "👂 Auditivo",
  kinesthetic: "✋ Kinestésico",
};

const TABS = [
  { id: "resumen", label: "📊 Resumen" },
  { id: "materias", label: "📚 Materias" },
  { id: "cuenta", label: "⚙️ Cuenta" },
];

const SectionLabel = ({ children, dm }) => (
  <p
    className="text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"
    style={{ color: dm ? "#FB8500" : "#D97706" }}
  >
    {children}
  </p>
);

const Card = ({ children, dm, className = "" }) => (
  <div
    className={`rounded-xl p-4 ${className}`}
    style={{
      background: dm ? "#1A2744" : "#ffffff",
      border: `1px solid ${dm ? "#243152" : "#F1F5F9"}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}
  >
    {children}
  </div>
);

const SmartProfile = memo(function SmartProfile({
  onTabChange,
  onExpandVak,
  onLogout,
}) {
  const {
    studentAge,
    gradeLevel,
    schoolName,
    vakResult,
    daniMemory,
    streak,
    totalPoints,
    subjectsWithGrades,
    pointsHistory,
    streakLog,
    totalActiveMinutes,
    darkMode: dm,
    toggleDarkMode,
  } = useIngenIAKids();

  const [activeTab, setActiveTab] = useState("resumen");
  const [editOpen, setEditOpen] = useState(false);
  const authToken =
    typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null;
  const {
    profile: editProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
  } = useStudentProfileIngenIA(authToken);

  const profile = daniMemory?.studentProfile ?? {};
  const studentName = useMemo(() => {
    try {
      return (
        (localStorage.getItem("student_name") || "").split(" ")[0] ||
        "Estudiante"
      );
    } catch {
      return "Estudiante";
    }
  }, []);

  const vakStyle = vakResult?.predominantStyle || vakResult?.dominant || null;
  const goalLabel = profile.parentGoal ? GOAL_LABELS[profile.parentGoal] : null;
  const interests = Array.isArray(profile.interests) ? profile.interests : [];

  const { strong, weak } = useMemo(() => {
    const graded = (subjectsWithGrades || []).filter(
      (s) => typeof s.gradeScore === "number" && s.gradeScore > 0,
    );
    const sorted = [...graded].sort((a, b) => b.gradeScore - a.gradeScore);
    return { strong: sorted.slice(0, 3), weak: sorted.slice(-3).reverse() };
  }, [subjectsWithGrades]);

  const weekDots = useMemo(() => {
    const log = Array.isArray(streakLog) ? streakLog : [];
    const activeDates = new Set(log.map((e) => e.date));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split("T")[0];
      return { key, active: activeDates.has(key), isToday: i === 6 };
    });
  }, [streakLog]);

  const weekActiveDays = weekDots.filter((d) => d.active).length;
  const consistency =
    weekActiveDays >= 5
      ? "Excelente 🌟"
      : weekActiveDays >= 3
        ? "Buena 👍"
        : weekActiveDays >= 1
          ? "En progreso 💪"
          : "Sin actividad";

  const recentActivity = useMemo(() => {
    const hist = Array.isArray(pointsHistory) ? pointsHistory : [];
    return [...hist]
      .filter((e) => e?.reason)
      .slice(-4)
      .reverse();
  }, [pointsHistory]);

  const relTime = (ts) => {
    if (!ts) return "";
    const diff = Date.now() - new Date(ts).getTime();
    const min = Math.round(diff / 60000);
    if (min < 1) return "ahora";
    if (min < 60) return `hace ${min} min`;
    const h = Math.round(min / 60);
    return h < 24 ? `hace ${h} h` : `hace ${Math.round(h / 24)} d`;
  };

  const textMain = dm ? "#F0F6FF" : "#1E293B";
  const textMuted = dm ? "#94A3B8" : "#64748B";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* ── Header banner ──────────────────────────────── */}
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{
          background: PROGRESS_GRADIENT,
          boxShadow: `0 6px 20px ${PROGRESS_GLOW}28`,
        }}
      >
        <div className="px-4 pt-4 pb-3 flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.22)",
              backdropFilter: "blur(8px)",
            }}
          >
            🧑‍🎓
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-black text-white truncate">
              {studentName}
            </h2>
            <div className="flex flex-wrap items-center gap-1 mt-1">
              {gradeLevel && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Grado {gradeLevel}
                </span>
              )}
              {studentAge != null && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white">
                  {studentAge} años
                </span>
              )}
              {schoolName && (
                <span className="text-[10px] px-2 py-0.5 rounded-full text-white/75 bg-white/10">
                  🏫 {schoolName}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Stats row */}
        <div
          className="grid grid-cols-3 border-t"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
        >
          {[
            {
              icon: "⭐",
              label: "Puntos",
              value: (totalPoints ?? 0).toLocaleString(),
            },
            {
              icon: "🔥",
              label: "Racha",
              value: `${streak?.current ?? 0} días`,
            },
            {
              icon: "🏆",
              label: "Récord",
              value: `${streak?.longest ?? 0} días`,
            },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="py-2.5 text-center border-r last:border-r-0"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              <p className="text-base font-black text-white">
                {icon} {value}
              </p>
              <p className="text-[10px] text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Mini-tab bar ───────────────────────────────── */}
      <div
        className="flex gap-1 p-1 rounded-xl"
        style={{ background: dm ? "#1A2744" : "#F1F5F9" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 text-[11px] font-bold py-2 px-1 rounded-lg transition-all"
            style={
              activeTab === tab.id
                ? {
                    background: dm ? "#243152" : "#ffffff",
                    color: "#FB8500",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                  }
                : { color: textMuted }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ───────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === "resumen" && (
          <motion.div
            key="resumen"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Hábitos esta semana */}
            <Card dm={dm}>
              <SectionLabel dm={dm}>📅 Esta semana</SectionLabel>
              <div className="flex justify-between items-center mb-2">
                {weekDots.map(({ key, active, isToday }) => (
                  <motion.div
                    key={key}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: active
                        ? PROGRESS_GRADIENT
                        : dm
                          ? "#243152"
                          : "#F1F5F9",
                      border: isToday
                        ? "2px solid #FB8500"
                        : "2px solid transparent",
                      boxShadow: active
                        ? `0 2px 8px ${PROGRESS_GLOW}40`
                        : "none",
                    }}
                    whileHover={{ scale: 1.15 }}
                  >
                    {active ? (
                      <span className="text-white text-xs font-bold">✓</span>
                    ) : (
                      <span
                        className="text-[10px]"
                        style={{ color: textMuted }}
                      >
                        {new Date(key).getDate()}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: textMuted }} className="text-xs">
                  <span
                    className="font-black text-base"
                    style={{ color: textMain }}
                  >
                    {weekActiveDays}
                  </span>
                  /7 días
                  {totalActiveMinutes > 0 && (
                    <span className="ml-2">· ⏱ {totalActiveMinutes} min</span>
                  )}
                </span>
                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(251,133,0,0.10)",
                    color: "#FB8500",
                  }}
                >
                  {consistency}
                </span>
              </div>
            </Card>

            {/* Objetivo + VAK en fila */}
            <div className="grid grid-cols-2 gap-2">
              {goalLabel && (
                <div
                  className="rounded-xl px-3 py-3 flex items-start gap-2"
                  style={{
                    background: "rgba(251,133,0,0.08)",
                    border: "1px solid rgba(251,133,0,0.18)",
                  }}
                >
                  <span className="text-xl mt-0.5">
                    {goalLabel.split(" ")[0]}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-[10px] font-bold uppercase tracking-wide"
                      style={{ color: "#D97706" }}
                    >
                      Objetivo
                    </p>
                    <p
                      className="text-xs font-semibold leading-tight mt-0.5"
                      style={{ color: textMain }}
                    >
                      {goalLabel.replace(/^[^\s]+\s/, "")}
                    </p>
                  </div>
                </div>
              )}
              <div
                className="rounded-xl px-3 py-3 flex items-start gap-2"
                style={{
                  background: dm ? "#1A2744" : "#ffffff",
                  border: `1px solid ${dm ? "#243152" : "#F1F5F9"}`,
                }}
              >
                <span className="text-xl mt-0.5">🧠</span>
                <div className="min-w-0">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wide"
                    style={{ color: "#D97706" }}
                  >
                    Estilo
                  </p>
                  {vakStyle ? (
                    <p
                      className="text-xs font-semibold leading-tight mt-0.5"
                      style={{ color: textMain }}
                    >
                      {VAK_LABELS[vakStyle] || vakStyle}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={onExpandVak}
                      className="text-xs font-bold mt-0.5"
                      style={{ color: "#FB8500" }}
                    >
                      Descubrir →
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Intereses (chips horizontales) */}
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {interests.map((id) => (
                  <span
                    key={id}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(251,133,0,0.09)",
                      border: "1px solid rgba(251,133,0,0.18)",
                      color: "#D97706",
                    }}
                  >
                    {INTEREST_LABELS[id] || id}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "materias" && (
          <motion.div
            key="materias"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Fortalezas + A reforzar */}
            {(strong.length > 0 || weak.length > 0) && (
              <div className="grid grid-cols-2 gap-2">
                {strong.length > 0 && (
                  <Card dm={dm}>
                    <SectionLabel dm={dm}>💪 Fuertes</SectionLabel>
                    <div className="space-y-1.5">
                      {strong.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between rounded-lg px-2 py-1.5"
                          style={{
                            background: "rgba(6,214,160,0.08)",
                            border: "1px solid rgba(6,214,160,0.18)",
                          }}
                        >
                          <span
                            className="text-xs font-semibold truncate"
                            style={{ color: dm ? "#6EE7B7" : "#047857" }}
                          >
                            {s.icon} {s.name}
                          </span>
                          <span
                            className="text-xs font-black tabular-nums ml-1 flex-shrink-0"
                            style={{ color: "#06D6A0" }}
                          >
                            {s.gradeScore?.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
                {weak.length > 0 && (
                  <Card dm={dm}>
                    <SectionLabel dm={dm}>🎯 Reforzar</SectionLabel>
                    <div className="space-y-1.5">
                      {weak.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between rounded-lg px-2 py-1.5"
                          style={{
                            background: "rgba(251,133,0,0.07)",
                            border: "1px solid rgba(251,133,0,0.18)",
                          }}
                        >
                          <span
                            className="text-xs font-semibold truncate"
                            style={{ color: dm ? "#FCD34D" : "#92400E" }}
                          >
                            {s.icon} {s.name}
                          </span>
                          <span
                            className="text-xs font-black tabular-nums ml-1 flex-shrink-0"
                            style={{ color: "#FB8500" }}
                          >
                            {s.gradeScore?.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Calificaciones — lista compacta */}
            {(subjectsWithGrades || []).length > 0 && (
              <Card dm={dm}>
                <SectionLabel dm={dm}>📊 Calificaciones</SectionLabel>
                <div className="space-y-2">
                  {subjectsWithGrades.slice(0, 8).map((s) => {
                    const score =
                      typeof s.gradeScore === "number" ? s.gradeScore : null;
                    const isWeak = score != null && score < 3.5;
                    const t = s.trend;
                    const trendColor =
                      t?.dir === "up"
                        ? SB_COLORS.success
                        : t?.dir === "down"
                          ? SB_COLORS.danger
                          : textMuted;
                    return (
                      <div key={s.id}>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs font-semibold flex-1 truncate"
                            style={{ color: textMain }}
                          >
                            {s.icon || "📘"} {s.name}
                          </span>
                          <span className="flex items-center gap-1 flex-shrink-0">
                            {score != null && (
                              <span
                                className="text-xs font-black tabular-nums px-1.5 py-0.5 rounded-md"
                                style={{
                                  color:
                                    score >= 3.5
                                      ? "#06D6A0"
                                      : score >= 3.0
                                        ? "#FB8500"
                                        : "#EF476F",
                                  background:
                                    score >= 3.5
                                      ? "rgba(6,214,160,0.10)"
                                      : score >= 3.0
                                        ? "rgba(251,133,0,0.10)"
                                        : "rgba(239,71,111,0.10)",
                                }}
                              >
                                {score.toFixed(1)}
                              </span>
                            )}
                            {t && (
                              <span
                                className="text-[10px] font-bold"
                                style={{ color: trendColor }}
                              >
                                {t.dir === "up"
                                  ? "↑"
                                  : t.dir === "down"
                                    ? "↓"
                                    : "→"}
                              </span>
                            )}
                          </span>
                        </div>
                        <ProgressBar
                          value={s.progress ?? 0}
                          color={s.color || SB_COLORS.amber}
                          dark={dm}
                        />
                        {isWeak && (
                          <button
                            onClick={() => onTabChange?.("oral")}
                            className="mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
                            style={{
                              color: "#FB8500",
                              background: "rgba(251,133,0,0.10)",
                            }}
                          >
                            💬 Reforzar con Dani →
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Actividad reciente — compacta */}
            {recentActivity.length > 0 && (
              <Card dm={dm}>
                <SectionLabel dm={dm}>🕑 Actividad reciente</SectionLabel>
                <ul className="space-y-1.5">
                  {recentActivity.map((e, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-2 py-1.5 border-b last:border-b-0"
                      style={{ borderColor: dm ? "#243152" : "#F1F5F9" }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            background: e.points >= 0 ? "#FB8500" : "#EF476F",
                          }}
                        />
                        <span
                          className="text-xs truncate"
                          style={{ color: textMain }}
                        >
                          {e.reason}
                        </span>
                      </div>
                      <span className="flex items-center gap-1.5 flex-shrink-0">
                        {typeof e.points === "number" && (
                          <span
                            className="text-xs font-black tabular-nums"
                            style={{
                              color:
                                e.points >= 0 ? "#FB8500" : SB_COLORS.danger,
                            }}
                          >
                            {e.points >= 0 ? "+" : ""}
                            {e.points}
                          </span>
                        )}
                        <span
                          className="text-[10px]"
                          style={{ color: textMuted }}
                        >
                          {relTime(e.timestamp)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === "cuenta" && (
          <motion.div
            key="cuenta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Card dm={dm}>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left"
                  style={{
                    background: SB_GRADIENTS.brand,
                    boxShadow: glow("#00B4D8", 0.25),
                    color: "white",
                  }}
                >
                  <Edit3 className="w-4 h-4 flex-shrink-0" />
                  Editar mi perfil
                </button>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: dm
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,75,99,0.06)",
                    border: `1px solid ${dm ? "#243152" : "#E2E8F0"}`,
                    color: textMain,
                  }}
                >
                  {dm ? (
                    <Sun className="w-4 h-4 flex-shrink-0 text-yellow-400" />
                  ) : (
                    <Moon className="w-4 h-4 flex-shrink-0 text-indigo-500" />
                  )}
                  {dm ? "Modo claro" : "Modo oscuro"}
                </button>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ color: "#EF476F" }}
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Editar Perfil */}
      <AnimatePresence>
        {editOpen && (
          <EditProfileModal
            profile={editProfile}
            studentName={editProfile?.name || "Estudiante"}
            displayName={editProfile?.name || "Estudiante"}
            avatarUrl={editProfile?.avatarUrl}
            updateProfile={updateProfile}
            uploadAvatar={uploadAvatar}
            removeAvatar={removeAvatar}
            onClose={() => setEditOpen(false)}
            onSaveSuccess={() => {}}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default SmartProfile;
