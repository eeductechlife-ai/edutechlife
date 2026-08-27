import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useTranslation } from "../../../i18n/I18nProvider";
import { getLevel, container, item } from "./gamificationData";
import CalendarMonth from "./components/CalendarMonth";
import PointsHistory from "./components/PointsHistory";
import SessionLog from "./components/SessionLog";
import RewardsGrid from "./components/RewardsGrid";
import AcademicFeedback from "./AcademicFeedback";
import SkillPassport from "../SkillPassport";

const PointsChart = ({ pointsHistory, darkMode }) => {
  const { t } = useTranslation();
  const dailyPoints = useMemo(() => {
    const map = {};
    pointsHistory.forEach((p) => {
      const day = new Date(p.timestamp).toISOString().split("T")[0];
      if (!map[day]) map[day] = 0;
      map[day] += p.points;
    });
    const days = Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
    return days.slice(-14);
  }, [pointsHistory]);

  const maxVal = Math.max(...dailyPoints.map(([, v]) => Math.abs(v)), 1);

  return (
    <motion.div
      variants={item}
      className={`rounded-2xl p-5 border transition-colors duration-500 ${
        darkMode
          ? "bg-[#1E293B]/80 border-[#334155]/50"
          : "bg-white/80 border-[#E2E8F0]/50"
      } backdrop-blur-xl`}
    >
      <h3
        className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-[#004B63]"}`}
      >
        📈 Puntos por día (últimos 14 días)
      </h3>
      <div className="flex items-end gap-1.5 h-32">
        {dailyPoints.map(([day, pts]) => {
          const height = Math.max(
            (Math.abs(pts) / maxVal) * 100,
            pts === 0 ? 0 : 5,
          );
          const isNeg = pts < 0;
          return (
            <div
              key={day}
              className="flex-1 flex flex-col items-center gap-1 group relative"
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  isNeg
                    ? "bg-red-400/60"
                    : "bg-gradient-to-t from-[#66CCCC] to-[#4DA8C4]"
                }`}
                style={{ height: `${height}%`, minHeight: pts === 0 ? 0 : 4 }}
              />
              <span className="text-[8px] text-[#64748B] rotate-45 origin-left whitespace-nowrap">
                {day.slice(5)}
              </span>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#004B63] text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
                {isNeg ? "-" : "+"}
                {Math.abs(pts)} pts
              </div>
            </div>
          );
        })}
      </div>
      {dailyPoints.length === 0 && (
        <p className="text-xs text-[#64748B] text-center py-8">
          {t("smartboard.no_points_data")}
        </p>
      )}
    </motion.div>
  );
};

const SummaryCard = memo(function SummaryCard({
  icon,
  label,
  value,
  sub,
  color,
  delay,
  darkMode,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", damping: 20, stiffness: 300 }}
      className={`flex-1 min-w-[140px] rounded-2xl p-5 border transition-colors duration-500 ${
        darkMode
          ? "bg-[#1E293B]/80 border-[#334155]/50"
          : "bg-white/80 border-[#E2E8F0]/50"
      } backdrop-blur-xl shadow-sm`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-2xl">{icon}</div>
        <span
          className={`text-[11px] font-medium ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
        >
          {label}
        </span>
      </div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      {sub && (
        <div
          className={`text-[10px] mt-0.5 ${darkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
        >
          {sub}
        </div>
      )}
    </motion.div>
  );
});

const SmartBoardProgress = ({ onTabChange }) => {
  const { t } = useTranslation();
  const {
    totalPoints,
    pointsHistory,
    streak,
    streakLog,
    sessions,
    totalActiveMinutes,
    unlockedRewards,
    darkMode,
  } = useSmartBoardKids();

  const level = getLevel(totalPoints);

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto space-y-5"
      >
        <AcademicFeedback onTabChange={onTabChange} />

        <SkillPassport />

        <div className="flex flex-wrap gap-4">
          <SummaryCard
            icon="🔥"
            label={t("smartboard.current_streak")}
            value={`${streak.current} ${t("smartboard.days")}`}
            sub={
              streak.current > 0
                ? t("smartboard.record", { days: streak.longest })
                : t("smartboard.start_today")
            }
            color="text-[#FF8E53]"
            delay={0}
            darkMode={darkMode}
          />
          <SummaryCard
            icon="💎"
            label={t("smartboard.total_points")}
            value={totalPoints.toLocaleString()}
            sub={t("smartboard.transactions", { count: pointsHistory.length })}
            color="text-[#FFD166]"
            delay={0.07}
            darkMode={darkMode}
          />
          <SummaryCard
            icon="⏱"
            label={t("smartboard.active_time_min")}
            value={`${totalActiveMinutes} ${t("smartboard.minutes")}`}
            sub={
              totalActiveMinutes >= 60
                ? `(${(totalActiveMinutes / 60).toFixed(1)} h)`
                : ""
            }
            color="text-[#4DA8C4]"
            delay={0.14}
            darkMode={darkMode}
          />
          <SummaryCard
            icon="🏆"
            label={t("smartboard.best_streak")}
            value={`${streak.longest} ${t("smartboard.days")}`}
            sub={level.name}
            color="text-[#66CCCC]"
            delay={0.21}
            darkMode={darkMode}
          />
        </div>

        <motion.div
          variants={item}
          className={`rounded-2xl p-5 border transition-colors duration-500 ${
            darkMode
              ? "bg-[#1E293B]/80 border-[#334155]/50"
              : "bg-white/80 border-[#E2E8F0]/50"
          } backdrop-blur-xl`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{level.icon}</span>
              <span
                className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#004B63]"}`}
              >
                {t("smartboard.level_name", { name: level.name })}
              </span>
            </div>
            {level.next && (
              <span
                className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
              >
                {t("smartboard.points_progress", {
                  current: totalPoints.toLocaleString(),
                  next: level.next.toLocaleString(),
                })}
              </span>
            )}
          </div>
          <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${level.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CalendarMonth streakLog={streakLog} darkMode={darkMode} />
          <PointsChart pointsHistory={pointsHistory} darkMode={darkMode} />
        </div>

        <PointsHistory pointsHistory={pointsHistory} darkMode={darkMode} />
        <SessionLog sessions={sessions} darkMode={darkMode} />
        <RewardsGrid
          unlockedRewards={unlockedRewards}
          totalPoints={totalPoints}
          darkMode={darkMode}
        />
      </motion.div>
    </div>
  );
};

export default SmartBoardProgress;
