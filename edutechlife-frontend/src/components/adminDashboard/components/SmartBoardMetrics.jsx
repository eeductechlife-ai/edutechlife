import React from "react";
import {
  TrendingUp,
  Users,
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Award,
  Flame,
  RefreshCw,
} from "lucide-react";

/**
 * SmartBoardMetrics — Fase 4.3 Valeria Analytics
 * Receives real data from useAdminAnalytics (sessions + academic_context + crisis_alerts).
 * Falls back to demo values when analytics.isLoading or no data yet.
 */
const SmartBoardMetrics = ({ analytics }) => {
  const {
    overview,
    subjectPerformance,
    dailySessions,
    streakDistribution,
    achievementRate,
    meta,
    isLoading,
    isError,
    refetch,
  } = analytics || {};

  if (isLoading) return <MetricsLoadingSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertTriangle className="w-10 h-10 text-amber-400" />
        <p className="text-[#B2D8E5]">Error al cargar analíticas SmartBoard</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4DA8C4]/20 text-[#4DA8C4] hover:bg-[#4DA8C4]/30 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Reintentar
        </button>
      </div>
    );
  }

  const ov = overview || {};
  const subjects = subjectPerformance || [];
  const daily = dailySessions || [];
  const streaks = streakDistribution || {};
  const achieve = achievementRate || {};

  const totalStreakStudents =
    (streaks.noStreak || 0) +
    (streaks.short || 0) +
    (streaks.medium || 0) +
    (streaks.long || 0);

  return (
    <div className="space-y-8">
      {/* Overview KPIs */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#4DA8C4]" />
          Resumen SmartBoard — últimos {meta?.days ?? 30} días
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            label="Sesiones Totales"
            value={ov.totalSessions?.toLocaleString("es-CO") ?? "0"}
            subtext="Sesiones de aprendizaje registradas"
            icon={Activity}
            color="#4DA8C4"
            bgColor="rgba(77, 168, 196, 0.15)"
          />
          <MetricCard
            label="Estudiantes Activos"
            value={ov.activeLast7Days?.toLocaleString("es-CO") ?? "0"}
            subtext="Sesión en los últimos 7 días"
            icon={Users}
            color="#66CCCC"
            bgColor="rgba(102, 204, 204, 0.15)"
          />
          <MetricCard
            label="Duración Promedio"
            value={`${ov.avgSessionMinutes ?? 0}m`}
            subtext="Por sesión de aprendizaje"
            icon={Clock}
            color="#FFD166"
            bgColor="rgba(255, 209, 102, 0.15)"
          />
          <MetricCard
            label="Alertas Activas"
            value={ov.atRiskCount?.toLocaleString("es-CO") ?? "0"}
            subtext="Crisis alerts sin resolver"
            icon={AlertTriangle}
            color="#FF6B9D"
            bgColor="rgba(255, 107, 157, 0.15)"
            alert={ov.atRiskCount > 0}
          />
        </div>
      </div>

      {/* Subject Performance */}
      {subjects.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#66CCCC]" />
            Rendimiento por Materia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.slice(0, 6).map((subj) => (
              <SubjectCard key={subj.subject} subject={subj} />
            ))}
          </div>
        </div>
      )}

      {/* Daily Sessions Trend */}
      {daily.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FFD166]" />
            Sesiones Diarias (últimos {Math.min(daily.length, 30)} días)
          </h2>
          <div
            className="rounded-2xl p-6 border border-[#004B63]/30"
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 75, 99, 0.4) 0%, rgba(11, 15, 25, 0.9) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <DailySessionsChart daily={daily.slice(-30)} />
          </div>
        </div>
      )}

      {/* Streaks + Achievements side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Streak Distribution */}
        <div
          className="rounded-2xl p-6 border border-[#004B63]/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 75, 99, 0.4) 0%, rgba(11, 15, 25, 0.9) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Distribución de Rachas
          </h3>
          <div className="space-y-3">
            <StreakRow
              label="Sin racha"
              count={streaks.noStreak ?? 0}
              total={totalStreakStudents}
              color="bg-gray-500/40"
            />
            <StreakRow
              label="Corta (1–3 días)"
              count={streaks.short ?? 0}
              total={totalStreakStudents}
              color="bg-blue-500/40"
            />
            <StreakRow
              label="Media (4–14 días)"
              count={streaks.medium ?? 0}
              total={totalStreakStudents}
              color="bg-orange-500/40"
            />
            <StreakRow
              label="Larga (15+ días)"
              count={streaks.long ?? 0}
              total={totalStreakStudents}
              color="bg-green-500/40"
            />
          </div>
        </div>

        {/* Achievement Rate */}
        <div
          className="rounded-2xl p-6 border border-[#004B63]/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 75, 99, 0.4) 0%, rgba(11, 15, 25, 0.9) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Logros Desbloqueados
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#B2D8E5]">Total logros</span>
              <span className="text-2xl font-bold text-white">
                {achieve.totalEarned?.toLocaleString("es-CO") ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#B2D8E5]">
                Estudiantes con logros
              </span>
              <span className="text-2xl font-bold text-[#66CCCC]">
                {achieve.uniqueStudents?.toLocaleString("es-CO") ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#B2D8E5]">
                Promedio / estudiante activo
              </span>
              <span className="text-2xl font-bold text-[#FFD166]">
                {achieve.avgPerActiveStudent ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-[#B2D8E5]/60 text-center pt-2">
        Generado:{" "}
        {meta?.generatedAt
          ? new Date(meta.generatedAt).toLocaleString("es-CO")
          : "—"}
        {" · "}Fuente: sessions + academic_context + crisis_alerts +
        learning_streaks
      </div>
    </div>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────

const MetricCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  color,
  bgColor,
  alert,
}) => (
  <div
    className="relative overflow-hidden rounded-2xl p-6 border transition-colors"
    style={{
      background:
        "linear-gradient(135deg, rgba(0, 75, 99, 0.4) 0%, rgba(11, 15, 25, 0.9) 100%)",
      backdropFilter: "blur(20px)",
      borderColor: alert ? "rgba(255,107,157,0.5)" : "rgba(0,75,99,0.3)",
    }}
  >
    <div
      className="absolute top-0 right-0 w-28 h-28 opacity-10"
      style={{ background: color, borderRadius: "0 0 0 100%" }}
    />
    <div className="relative">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: bgColor }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h3 className="text-sm text-[#B2D8E5] mb-1">{label}</h3>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-[#7A8FA3]">{subtext}</div>
    </div>
  </div>
);

const SubjectCard = ({ subject }) => {
  const pct = Math.min(100, subject.avgScore || 0);
  const barColor = pct >= 70 ? "#66CCCC" : pct >= 50 ? "#FFD166" : "#FF6B9D";
  return (
    <div
      className="rounded-2xl p-5 border border-[#004B63]/30"
      style={{
        background:
          "linear-gradient(135deg, rgba(0, 75, 99, 0.3) 0%, rgba(11, 15, 25, 0.9) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white capitalize">
          {subject.subject}
        </h3>
        <span className="text-sm font-bold" style={{ color: barColor }}>
          {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#0B0F19] overflow-hidden mb-3">
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <div className="flex justify-between text-xs text-[#7A8FA3]">
        <span>{subject.sessionCount} sesiones</span>
        <span>
          {Object.entries(subject.performanceLevels || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([lvl, n]) => `${n} ${lvl}`)
            .join(" · ")}
        </span>
      </div>
    </div>
  );
};

const DailySessionsChart = ({ daily }) => {
  const maxCount = Math.max(...daily.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-24 overflow-x-auto pb-2">
      {daily.map((day) => {
        const pct = Math.round((day.count / maxCount) * 100);
        return (
          <div
            key={day.date}
            className="flex flex-col items-center gap-1 min-w-[20px] flex-1"
          >
            <div
              className="w-full rounded-t-sm bg-gradient-to-t from-[#4DA8C4] to-[#66CCCC] opacity-80 hover:opacity-100 transition-opacity"
              style={{ height: `${Math.max(4, pct)}%` }}
              title={`${day.date}: ${day.count} sesiones`}
            />
            {daily.length <= 14 && (
              <span className="text-[8px] text-[#7A8FA3] rotate-45 origin-left">
                {day.date.slice(5)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const StreakRow = ({ label, count, total, color }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-[#B2D8E5]">{label}</span>
        <span className="text-sm font-semibold text-white">
          {count} <span className="text-[#7A8FA3] font-normal">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#0B0F19] overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const MetricsLoadingSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-32 rounded-2xl bg-gradient-to-r from-[#004B63]/30 to-transparent"
        />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="h-40 rounded-2xl bg-gradient-to-r from-[#004B63]/30 to-transparent"
        />
      ))}
    </div>
  </div>
);

export default SmartBoardMetrics;
