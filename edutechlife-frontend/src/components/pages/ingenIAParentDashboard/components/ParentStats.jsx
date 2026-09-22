import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";

export const StatCard = ({ icon, label, value, color, subtitle }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <span className="text-sm text-[#64748B]">{label}</span>
    </div>
    <p className="text-2xl font-black text-[#004B63]">{value}</p>
    {subtitle && <p className="text-xs text-[#94A3B8] mt-1">{subtitle}</p>}
  </motion.div>
);

// Compute weekly stats from history array
function computeWeeklyStats(history) {
  const now = Date.now();
  const DAY = 86400000;
  const thisWeekStart = now - 7 * DAY;
  const lastWeekStart = now - 14 * DAY;

  let thisPoints = 0,
    thisSessions = 0;
  let lastPoints = 0,
    lastSessions = 0;

  history.forEach((e) => {
    const ts = new Date(e.timestamp).getTime();
    if (ts >= thisWeekStart) {
      thisPoints += e.points || 0;
      thisSessions++;
    } else if (ts >= lastWeekStart) {
      lastPoints += e.points || 0;
      lastSessions++;
    }
  });

  const pointsTrend =
    lastPoints === 0
      ? thisPoints > 0
        ? 100
        : 0
      : Math.round(((thisPoints - lastPoints) / lastPoints) * 100);
  const sessionsTrend =
    lastSessions === 0
      ? thisSessions > 0
        ? 100
        : 0
      : Math.round(((thisSessions - lastSessions) / lastSessions) * 100);

  return {
    thisPoints,
    thisSessions,
    lastPoints,
    lastSessions,
    pointsTrend,
    sessionsTrend,
  };
}

export const WeeklySummary = ({ history, streak }) => {
  const { t } = useTranslation();

  const stats = useMemo(() => computeWeeklyStats(history), [history]);

  const TrendBadge = ({ value }) => {
    if (value === 0) return null;
    const up = value > 0;
    return (
      <span
        className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1.5"
        style={{
          background: up ? "#F0FDF4" : "#FFF7ED",
          color: up ? "#16A34A" : "#C2410C",
        }}
      >
        {up ? "↑" : "↓"} {Math.abs(value)}%
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#004B63]">
          {t("prog.weekly_title")}
        </h3>
        {stats.lastPoints > 0 && (
          <span className="text-[10px] text-[#94A3B8]">
            {t("prog.vs_last_week")}
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {/* Puntos esta semana */}
        <div className="text-center">
          <p className="text-2xl font-black text-[#004B63] leading-none">
            {stats.thisPoints}
            <TrendBadge value={stats.pointsTrend} />
          </p>
          <p className="text-[10px] text-[#94A3B8] mt-1">
            {t("prog.points_this_week")}
          </p>
        </div>
        {/* Sesiones */}
        <div className="text-center">
          <p className="text-2xl font-black text-[#004B63] leading-none">
            {stats.thisSessions}
            <TrendBadge value={stats.sessionsTrend} />
          </p>
          <p className="text-[10px] text-[#94A3B8] mt-1">
            {t("prog.sessions_this_week")}
          </p>
        </div>
        {/* Racha */}
        <div className="text-center">
          <p className="text-2xl font-black text-[#004B63] leading-none">
            {streak?.current || 0} 🔥
          </p>
          <p className="text-[10px] text-[#94A3B8] mt-1">
            {t("prog.streak_label")}
          </p>
        </div>
      </div>

      {/* Barra de actividad de la semana — 7 días */}
      {(() => {
        const now = Date.now();
        const DAY = 86400000;
        const days = Array.from({ length: 7 }, (_, i) => {
          const start = now - (6 - i) * DAY;
          const end = start + DAY;
          const pts = history
            .filter((e) => {
              const ts = new Date(e.timestamp).getTime();
              return ts >= start && ts < end;
            })
            .reduce((s, e) => s + (e.points || 0), 0);
          const label = new Date(start)
            .toLocaleDateString("es-ES", { weekday: "short" })
            .slice(0, 2);
          return { pts, label };
        });
        const maxPts = Math.max(...days.map((d) => d.pts), 1);
        const hasActivity = days.some((d) => d.pts > 0);
        if (!hasActivity) return null;
        return (
          <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
            <p className="text-[10px] text-[#94A3B8] mb-2">
              {t("prog.activity_7days")}
            </p>
            <div className="flex items-end gap-1.5 h-10">
              {days.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-0.5"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${Math.max((d.pts / maxPts) * 100, d.pts > 0 ? 15 : 0)}%`,
                    }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="w-full rounded-t-sm"
                    style={{
                      backgroundColor:
                        i === 6 ? "#004B63" : d.pts > 0 ? "#4DA8C4" : "#E2E8F0",
                      minHeight: d.pts > 0 ? 4 : 2,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {days.map((d, i) => (
                <span
                  key={i}
                  className="text-[8px] text-[#CBD5E1] flex-1 text-center"
                >
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export const PointsChart = ({ history }) => {
  const { t } = useTranslation();
  const chartData = useMemo(() => {
    const daily = {};
    history.forEach((entry) => {
      const date = new Date(entry.timestamp).toLocaleDateString("es-ES");
      daily[date] = (daily[date] || 0) + entry.points;
    });
    return Object.entries(daily)
      .slice(-14)
      .map(([date, points]) => ({ date, points }));
  }, [history]);

  if (chartData.length === 0) return null;

  const maxPoints = Math.max(...chartData.map((d) => d.points), 1);
  const totalPoints = chartData.reduce((s, d) => s + d.points, 0);
  const bestDay = chartData.reduce(
    (best, d) => (d.points > best.points ? d : best),
    chartData[0],
  );

  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-[#004B63]">
          {t("smartboard.chart_last_14")}
        </h3>
        <span className="text-xs font-bold text-[#4DA8C4]">
          +{totalPoints} pts
        </span>
      </div>
      {bestDay && bestDay.points > 0 && (
        <p className="text-[10px] text-[#94A3B8] mb-3">
          {t("parent_dashboard.chart_best_day", {
            date: bestDay.date.slice(0, 5),
            pts: bestDay.points,
          })}
        </p>
      )}
      <div className="flex items-end gap-1.5 h-28">
        {chartData.map((day, i) => {
          const pct = (day.points / maxPoints) * 100;
          const isToday = i === chartData.length - 1;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              {day.points > 0 && (
                <span
                  className="text-[8px] font-bold leading-none"
                  style={{ color: isToday ? "#004B63" : "#94A3B8" }}
                >
                  {day.points}
                </span>
              )}
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height: `${Math.max(pct, day.points > 0 ? 8 : 2)}%`,
                }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                className="w-full rounded-t-md"
                style={{
                  backgroundColor: isToday
                    ? "#004B63"
                    : day.points > 0
                      ? "#4DA8C4"
                      : "#E2E8F0",
                  minHeight: day.points > 0 ? 4 : 2,
                  maxHeight: "100%",
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1.5">
        {chartData
          .filter((_, i) => i % 4 === 0 || i === chartData.length - 1)
          .map((day, i) => (
            <span key={i} className="text-[9px] text-[#94A3B8]">
              {day.date.slice(0, 5)}
            </span>
          ))}
      </div>
    </div>
  );
};

export const SubjectProgress = ({ subjects }) => {
  const { t } = useTranslation();

  const sorted = useMemo(
    () => [...subjects].sort((a, b) => b.progress - a.progress),
    [subjects],
  );

  if (subjects.length === 0) return null;

  const getStatus = (progress) => {
    if (progress >= 75)
      return { label: t("prog.status_great"), dot: "#22c55e" };
    if (progress >= 40)
      return { label: t("prog.status_advancing"), dot: "#4DA8C4" };
    if (progress > 0)
      return { label: t("prog.status_starting"), dot: "#f59e0b" };
    return { label: t("prog.status_not_started"), dot: "#E2E8F0" };
  };

  const notStartedCount = sorted.filter((s) => s.progress === 0).length;

  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#004B63]">
          {t("parent_dashboard.progress_by_subject")}
        </h3>
        {notStartedCount > 0 && notStartedCount === sorted.length && (
          <span className="text-[10px] text-[#94A3B8]">
            {t("prog.all_pending")}
          </span>
        )}
      </div>
      <div className="space-y-4">
        {sorted.map((sub) => {
          const status = getStatus(sub.progress);
          const isNotStarted = sub.progress === 0;
          return (
            <div key={sub.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: status.dot }}
                  />
                  <span className="text-xs text-[#475569] truncate">
                    {sub.icon} {sub.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-[10px] text-[#94A3B8]">
                    {status.label}
                  </span>
                  {!isNotStarted && (
                    <span className="text-xs font-bold text-[#004B63] w-8 text-right">
                      {sub.progress}%
                    </span>
                  )}
                </div>
              </div>
              {isNotStarted ? (
                <p className="text-[11px] text-[#94A3B8] italic mt-0.5 leading-snug">
                  {t("prog.not_started_hint")}
                </p>
              ) : (
                <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: sub.color || "#4DA8C4" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(sub.progress, 3)}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
