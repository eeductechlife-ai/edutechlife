import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { Card, Badge, MetricCard, ProgressBar } from "../ui";
import { SB_COLORS } from "../smartboardTheme";

// Maps onboarding parentGoal ids → readable labels (brief §11 objetivos)
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

/**
 * SmartProfile — pantalla de perfil dinámico consolidado (brief §11).
 * Reúne identidad, objetivo, intereses, estilo de aprendizaje, fortalezas,
 * dificultades y progreso por materia desde el contexto + memoria de Dani.
 * No usa VAK como clasificación rígida: es una señal más dentro del perfil.
 */
const SmartProfile = memo(function SmartProfile({ onTabChange }) {
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

  // Derive strengths / weaknesses from graded subjects (data-driven, not hardcoded)
  const { strong, weak } = useMemo(() => {
    const graded = (subjectsWithGrades || []).filter(
      (s) => typeof s.gradeScore === "number" && s.gradeScore > 0,
    );
    const sorted = [...graded].sort((a, b) => b.gradeScore - a.gradeScore);
    return { strong: sorted.slice(0, 3), weak: sorted.slice(-3).reverse() };
  }, [subjectsWithGrades]);

  const textMain = dm ? "#F0F6FF" : SB_COLORS.deep;
  const textMuted = dm ? SB_COLORS.textMutedDark : SB_COLORS.textMutedLight;

  const goalLabel = profile.parentGoal ? GOAL_LABELS[profile.parentGoal] : null;
  const interests = Array.isArray(profile.interests) ? profile.interests : [];

  // Study habits — days active in the last 7 days + a friendly consistency read
  const weekActiveDays = useMemo(() => {
    const log = Array.isArray(streakLog) ? streakLog : [];
    const weekAgo = Date.now() - 7 * 86400000;
    const days = new Set(
      log
        .filter(
          (e) =>
            e?.date && new Date(e.timestamp || e.date).getTime() >= weekAgo,
        )
        .map((e) => e.date),
    );
    return days.size;
  }, [streakLog]);

  const consistency =
    weekActiveDays >= 5
      ? "Excelente"
      : weekActiveDays >= 3
        ? "Buena"
        : weekActiveDays >= 1
          ? "En progreso"
          : "Sin actividad";

  // Recent activity — last points-earning events, newest first
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
    const d = Math.round(h / 24);
    return `hace ${d} d`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Identity header */}
      <Card variant="glass" dark={dm} padding="lg">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: SB_COLORS.primary + "22" }}
            aria-hidden="true"
          >
            🧑‍🎓
          </div>
          <div className="min-w-0">
            <h2
              className="text-xl font-black truncate"
              style={{ color: textMain }}
            >
              {studentName}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {studentAge != null && (
                <Badge color="primary" size="sm" label={`${studentAge} años`} />
              )}
              {gradeLevel && (
                <Badge color="violet" size="sm" label={`Grado ${gradeLevel}`} />
              )}
              {schoolName && (
                <Badge color="gray" size="sm" icon="🏫" label={schoolName} />
              )}
              {city && <Badge color="gray" size="sm" icon="📍" label={city} />}
            </div>
          </div>
        </div>
      </Card>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricCard
          title="Puntos"
          value={totalPoints ?? 0}
          icon="⭐"
          color={SB_COLORS.gold}
          dark={dm}
        />
        <MetricCard
          title="Racha"
          value={streak?.current ?? 0}
          unit="días"
          icon="🔥"
          color={SB_COLORS.danger}
          dark={dm}
        />
        <MetricCard
          title="Mejor racha"
          value={streak?.longest ?? 0}
          unit="días"
          icon="🏆"
          color={SB_COLORS.primary}
          dark={dm}
        />
      </div>

      {/* Hábitos de estudio */}
      <Card dark={dm}>
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-2"
          style={{ color: textMuted }}
        >
          📅 Hábitos de estudio
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-2xl font-black" style={{ color: textMain }}>
              {weekActiveDays}
              <span className="text-sm font-bold">/7</span>
            </p>
            <p className="text-[11px]" style={{ color: textMuted }}>
              días esta semana
            </p>
          </div>
          <div>
            <p className="text-2xl font-black" style={{ color: textMain }}>
              {totalActiveMinutes ?? 0}
            </p>
            <p className="text-[11px]" style={{ color: textMuted }}>
              min activos
            </p>
          </div>
          <div>
            <Badge
              color={
                weekActiveDays >= 5
                  ? "success"
                  : weekActiveDays >= 3
                    ? "primary"
                    : "warning"
              }
              size="sm"
              label={consistency}
              style={{ marginTop: "0.4rem" }}
            />
            <p className="text-[11px] mt-1" style={{ color: textMuted }}>
              constancia
            </p>
          </div>
        </div>
      </Card>

      {/* Objetivo */}
      {goalLabel && (
        <Card dark={dm}>
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: textMuted }}
          >
            Objetivo
          </p>
          <p className="text-lg font-bold" style={{ color: textMain }}>
            {goalLabel}
          </p>
        </Card>
      )}

      {/* Intereses */}
      {interests.length > 0 && (
        <Card dark={dm}>
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: textMuted }}
          >
            Intereses
          </p>
          <div className="flex flex-wrap gap-1.5">
            {interests.map((id) => (
              <Badge
                key={id}
                color="primary"
                size="sm"
                label={INTEREST_LABELS[id] || id}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Estilo de aprendizaje (VAK como señal complementaria) */}
      {vakStyle && (
        <Card dark={dm}>
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: textMuted }}
          >
            Cómo aprende mejor
          </p>
          <p className="text-lg font-bold" style={{ color: textMain }}>
            {VAK_LABELS[vakStyle] || vakStyle}
          </p>
          <p className="text-xs mt-1" style={{ color: textMuted }}>
            Es una señal, no una etiqueta fija: Dani la usa para adaptar sus
            explicaciones.
          </p>
        </Card>
      )}

      {/* Fortalezas y a reforzar */}
      {(strong.length > 0 || weak.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {strong.length > 0 && (
            <Card dark={dm}>
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: textMuted }}
              >
                💪 Fortalezas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {strong.map((s) => (
                  <Badge
                    key={s.id}
                    color="success"
                    size="sm"
                    icon={s.icon}
                    label={`${s.name} ${s.gradeScore?.toFixed(1)}`}
                  />
                ))}
              </div>
            </Card>
          )}
          {weak.length > 0 && (
            <Card dark={dm}>
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: textMuted }}
              >
                🎯 A reforzar
              </p>
              <div className="flex flex-wrap gap-1.5">
                {weak.map((s) => (
                  <Badge
                    key={s.id}
                    color="warning"
                    size="sm"
                    icon={s.icon}
                    label={`${s.name} ${s.gradeScore?.toFixed(1)}`}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Calificaciones inteligentes — score + tendencia + siguiente acción (§27) */}
      {(subjectsWithGrades || []).length > 0 && (
        <Card dark={dm}>
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: textMuted }}
          >
            📊 Calificaciones inteligentes
          </p>
          <div className="space-y-3">
            {subjectsWithGrades.slice(0, 8).map((s) => {
              const score =
                typeof s.gradeScore === "number" ? s.gradeScore : null;
              const weak = score != null && score < 3.5;
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
                          className="text-sm font-black tabular-nums"
                          style={{ color: textMain }}
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
                          title="Tendencia entre períodos"
                        >
                          {trendGlyph} {t.delta > 0 ? "+" : ""}
                          {t.delta.toFixed(1)}
                        </span>
                      )}
                    </span>
                  </div>
                  <ProgressBar
                    value={s.progress ?? 0}
                    color={s.color || SB_COLORS.primary}
                    dark={dm}
                  />
                  {weak && (
                    <button
                      onClick={() => onTabChange?.("oral")}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition-colors"
                      style={{
                        color: SB_COLORS.amber,
                        background: `${SB_COLORS.amber}18`,
                      }}
                    >
                      💪 Reforzar con Dani →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Actividad reciente */}
      {recentActivity.length > 0 && (
        <Card dark={dm}>
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: textMuted }}
          >
            🕑 Actividad reciente
          </p>
          <ul className="space-y-1.5">
            {recentActivity.map((e, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="truncate" style={{ color: textMain }}>
                  {e.reason}
                </span>
                <span className="flex items-center gap-2 flex-shrink-0">
                  {typeof e.points === "number" && (
                    <span
                      className="font-bold tabular-nums"
                      style={{
                        color:
                          e.points >= 0 ? SB_COLORS.success : SB_COLORS.danger,
                      }}
                    >
                      {e.points >= 0 ? "+" : ""}
                      {e.points}
                    </span>
                  )}
                  <span className="text-[11px]" style={{ color: textMuted }}>
                    {relTime(e.timestamp)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </motion.div>
  );
});

export default SmartProfile;
