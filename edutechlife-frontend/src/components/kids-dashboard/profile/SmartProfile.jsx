import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { ProgressBar } from "../ui";
import { SB_COLORS, SB_GRADIENTS } from "../smartboardTheme";

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
  matematicas: "🔢 Matemáticas",
  ciencias: "🔬 Ciencias",
  tecnologia: "💻 Tecnología",
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

// Small section label
const SectionLabel = ({ children, dm }) => (
  <p
    className="text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"
    style={{ color: dm ? "#FB8500" : "#D97706" }}
  >
    {children}
  </p>
);

// Themed card
const ProfileCard = ({ children, dm, className = "" }) => (
  <div
    className={`rounded-2xl p-5 ${className}`}
    style={{
      background: dm ? "#1A2744" : "#ffffff",
      border: `1px solid ${dm ? "#243152" : "#F1F5F9"}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}
  >
    {children}
  </div>
);

const SmartProfile = memo(function SmartProfile({ onTabChange, onExpandVak }) {
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
  } = useSmartBoardKids();

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
  const city = useMemo(() => {
    try {
      return localStorage.getItem("sb_student_city") || "";
    } catch {
      return "";
    }
  }, []);

  const vakStyle = vakResult?.predominantStyle || vakResult?.dominant || null;

  const { strong, weak } = useMemo(() => {
    const graded = (subjectsWithGrades || []).filter(
      (s) => typeof s.gradeScore === "number" && s.gradeScore > 0,
    );
    const sorted = [...graded].sort((a, b) => b.gradeScore - a.gradeScore);
    return { strong: sorted.slice(0, 3), weak: sorted.slice(-3).reverse() };
  }, [subjectsWithGrades]);

  const textMain = dm ? "#F0F6FF" : "#1E293B";
  const textMuted = dm ? "#94A3B8" : "#64748B";
  const cardBg = dm ? "#1A2744" : "#ffffff";
  const cardBorder = dm ? "#243152" : "#F1F5F9";

  const goalLabel = profile.parentGoal ? GOAL_LABELS[profile.parentGoal] : null;
  const interests = Array.isArray(profile.interests) ? profile.interests : [];

  // Week activity dots — last 7 days
  const weekDots = useMemo(() => {
    const log = Array.isArray(streakLog) ? streakLog : [];
    const activeDates = new Set(log.map((e) => e.date));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split("T")[0];
      const isToday = i === 6;
      return { key, active: activeDates.has(key), isToday };
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
      .slice(-6)
      .reverse();
  }, [pointsHistory]);

  const relTime = (ts) => {
    if (!ts) return "";
    const diff = Date.now() - new Date(ts).getTime();
    const min = Math.round(diff / 60000);
    if (min < 1) return "ahora";
    if (min < 60) return `hace ${min} min`;
    const h = Math.round(min / 60);
    if (h < 24) return `hace ${h} h`;
    return `hace ${Math.round(h / 24)} d`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* ── Header banner ─────────────────────────────────── */}
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{
          background: PROGRESS_GRADIENT,
          boxShadow: `0 8px 24px ${PROGRESS_GLOW}30`,
        }}
      >
        {/* Top row */}
        <div className="p-5 pb-4 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md"
            style={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            🧑‍🎓
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-white truncate">
              {studentName}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {gradeLevel && (
                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.22)",
                    color: "white",
                  }}
                >
                  Grado {gradeLevel}
                </span>
              )}
              {studentAge != null && (
                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    color: "white",
                  }}
                >
                  {studentAge} años
                </span>
              )}
              {schoolName && (
                <span
                  className="text-[11px] px-2.5 py-0.5 rounded-full text-white/80"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  🏫 {schoolName}
                </span>
              )}
              {city && (
                <span
                  className="text-[11px] px-2.5 py-0.5 rounded-full text-white/80"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  📍 {city}
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
              className="py-3 text-center border-r last:border-r-0"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              <p className="text-lg font-black text-white">
                {icon} {value}
              </p>
              <p className="text-[11px] text-white/65">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Hábitos de estudio ──────────────────────────── */}
      <ProfileCard dm={dm}>
        <SectionLabel dm={dm}>📅 Hábitos de estudio esta semana</SectionLabel>
        {/* 7-dot week tracker */}
        <div className="flex justify-between items-center mb-3">
          {weekDots.map(({ key, active, isToday }) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: active
                    ? PROGRESS_GRADIENT
                    : dm
                      ? "#243152"
                      : "#F1F5F9",
                  border: isToday
                    ? `2px solid #FB8500`
                    : "2px solid transparent",
                  boxShadow: active ? `0 2px 8px ${PROGRESS_GLOW}40` : "none",
                }}
                whileHover={{ scale: 1.15 }}
              >
                {active ? (
                  <span className="text-white text-xs font-bold">✓</span>
                ) : (
                  <span className="text-[10px]" style={{ color: textMuted }}>
                    {new Date(key).getDate()}
                  </span>
                )}
              </motion.div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: textMuted }}>
            <span className="font-black text-lg" style={{ color: textMain }}>
              {weekActiveDays}
            </span>
            <span style={{ color: textMuted }}>/7 días activos</span>
          </span>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: "rgba(251,133,0,0.10)", color: "#FB8500" }}
          >
            {consistency}
          </span>
        </div>
        {totalActiveMinutes > 0 && (
          <p className="text-xs mt-2" style={{ color: textMuted }}>
            ⏱ {totalActiveMinutes} min activos en total
          </p>
        )}
      </ProfileCard>

      {/* ── Objetivo ──────────────────────────────────────── */}
      {goalLabel && (
        <div
          className="rounded-2xl px-5 py-4 flex items-center gap-3"
          style={{
            background: "rgba(251,133,0,0.08)",
            border: "1px solid rgba(251,133,0,0.18)",
          }}
        >
          <div className="text-2xl">{goalLabel.split(" ")[0]}</div>
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "#D97706" }}
            >
              Mi objetivo
            </p>
            <p className="text-sm font-bold mt-0.5" style={{ color: textMain }}>
              {goalLabel.replace(/^[^\s]+\s/, "")}
            </p>
          </div>
        </div>
      )}

      {/* ── Mi estilo de aprendizaje ──────────────────────── */}
      <ProfileCard dm={dm}>
        <SectionLabel dm={dm}>🧠 Mi estilo de aprendizaje</SectionLabel>
        {vakStyle ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "rgba(251,133,0,0.10)" }}
              >
                {vakStyle === "visual"
                  ? "👁️"
                  : vakStyle === "auditivo" || vakStyle === "auditory"
                    ? "👂"
                    : "✋"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-black" style={{ color: textMain }}>
                  {VAK_LABELS[vakStyle] || vakStyle}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: textMuted }}>
                  Señal adaptativa — Dani ajusta sus explicaciones según esto.
                </p>
              </div>
            </div>
            {onExpandVak && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onExpandVak}
                  className="flex-1 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
                  style={{
                    background: "rgba(251,133,0,0.10)",
                    border: "1px solid rgba(251,133,0,0.20)",
                    color: "#D97706",
                  }}
                >
                  📋 Ver mi Plan de Aprendizaje
                </button>
                <button
                  type="button"
                  onClick={onExpandVak}
                  className="text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors"
                  style={{
                    border: `1px solid ${dm ? "#243152" : "#E2E8F0"}`,
                    color: textMuted,
                  }}
                  title="Repetir diagnóstico VAK"
                >
                  Repetir →
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={onExpandVak}
            className="w-full py-4 rounded-xl flex flex-col items-center gap-2 transition-colors hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "rgba(251,133,0,0.08)",
              border: "1.5px dashed rgba(251,133,0,0.35)",
            }}
          >
            <span className="text-3xl">🧠</span>
            <span className="text-sm font-bold" style={{ color: textMain }}>
              Descubrir mi estilo de aprendizaje
            </span>
            <span className="text-xs" style={{ color: textMuted }}>
              5 min · Personaliza tu experiencia con Dani
            </span>
          </button>
        )}
      </ProfileCard>

      {/* ── Intereses ─────────────────────────────────────── */}
      {interests.length > 0 && (
        <ProfileCard dm={dm}>
          <SectionLabel dm={dm}>💡 Intereses</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {interests.map((id) => (
              <span
                key={id}
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
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
        </ProfileCard>
      )}

      {/* ── Fortalezas / A reforzar ───────────────────────── */}
      {(strong.length > 0 || weak.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {strong.length > 0 && (
            <ProfileCard dm={dm}>
              <SectionLabel dm={dm}>💪 Fortalezas</SectionLabel>
              <div className="space-y-2">
                {strong.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl px-3 py-2"
                    style={{
                      background: "rgba(6,214,160,0.08)",
                      border: "1px solid rgba(6,214,160,0.18)",
                    }}
                  >
                    <span
                      className="text-xs font-semibold"
                      style={{ color: dm ? "#6EE7B7" : "#047857" }}
                    >
                      {s.icon} {s.name}
                    </span>
                    <span
                      className="text-xs font-black tabular-nums"
                      style={{ color: "#06D6A0" }}
                    >
                      {s.gradeScore?.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </ProfileCard>
          )}
          {weak.length > 0 && (
            <ProfileCard dm={dm}>
              <SectionLabel dm={dm}>🎯 A reforzar</SectionLabel>
              <div className="space-y-2">
                {weak.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl px-3 py-2"
                    style={{
                      background: "rgba(251,133,0,0.07)",
                      border: "1px solid rgba(251,133,0,0.18)",
                    }}
                  >
                    <span
                      className="text-xs font-semibold"
                      style={{ color: dm ? "#FCD34D" : "#92400E" }}
                    >
                      {s.icon} {s.name}
                    </span>
                    <span
                      className="text-xs font-black tabular-nums"
                      style={{ color: "#FB8500" }}
                    >
                      {s.gradeScore?.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </ProfileCard>
          )}
        </div>
      )}

      {/* ── Calificaciones inteligentes ───────────────────── */}
      {(subjectsWithGrades || []).length > 0 && (
        <ProfileCard dm={dm}>
          <SectionLabel dm={dm}>📊 Calificaciones inteligentes</SectionLabel>
          <div className="space-y-3">
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
              const trendGlyph =
                t?.dir === "up" ? "↑" : t?.dir === "down" ? "↓" : "→";
              return (
                <div key={s.id}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className="text-sm font-semibold truncate"
                      style={{ color: textMain }}
                    >
                      {s.icon || "📘"} {s.name}
                    </span>
                    <span className="flex items-center gap-2 flex-shrink-0">
                      {score != null && (
                        <span
                          className="text-sm font-black tabular-nums px-2 py-0.5 rounded-lg"
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
                          className="text-xs font-bold tabular-nums px-1.5 py-0.5 rounded-md"
                          style={{
                            color: trendColor,
                            background: `${trendColor}1a`,
                          }}
                        >
                          {trendGlyph} {t.delta > 0 ? "+" : ""}
                          {t.delta.toFixed(1)}
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
                    <motion.button
                      onClick={() => onTabChange?.("oral")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-lg transition-colors"
                      style={{
                        color: "#FB8500",
                        background: "rgba(251,133,0,0.10)",
                        border: "1px solid rgba(251,133,0,0.18)",
                      }}
                    >
                      💬 Reforzar con Dani →
                    </motion.button>
                  )}
                </div>
              );
            })}
          </div>
        </ProfileCard>
      )}

      {/* ── Actividad reciente ────────────────────────────── */}
      {recentActivity.length > 0 && (
        <ProfileCard dm={dm}>
          <SectionLabel dm={dm}>🕑 Actividad reciente</SectionLabel>
          <ul className="space-y-2">
            {recentActivity.map((e, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 py-2 border-b last:border-b-0"
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
                <span className="flex items-center gap-2 flex-shrink-0">
                  {typeof e.points === "number" && (
                    <span
                      className="text-xs font-black tabular-nums"
                      style={{
                        color: e.points >= 0 ? "#FB8500" : SB_COLORS.danger,
                      }}
                    >
                      {e.points >= 0 ? "+" : ""}
                      {e.points}
                    </span>
                  )}
                  <span className="text-[10px]" style={{ color: textMuted }}>
                    {relTime(e.timestamp)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </ProfileCard>
      )}
    </motion.div>
  );
});

export default SmartProfile;
