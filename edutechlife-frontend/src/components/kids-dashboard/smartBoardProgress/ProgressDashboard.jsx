import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useTranslation } from "../../../i18n/I18nProvider";
import { getLevel, container, item } from "./gamificationData";
import RewardsGrid from "./components/RewardsGrid";
import SkillPassport from "../SkillPassport";

const PROGRESS_GRADIENT =
  "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)";

const SectionLabel = ({ emoji, title, darkMode }) => (
  <div className="flex items-center gap-2 px-1">
    <span className="text-base">{emoji}</span>
    <span
      className={`text-xs font-black uppercase tracking-widest ${darkMode ? "text-[#94A3B8]" : "text-[#93A6B2]"}`}
    >
      {title}
    </span>
    <div
      className={`flex-1 h-px ${darkMode ? "bg-[#334155]" : "bg-[#E2E8F0]"}`}
    />
  </div>
);

const SmartBoardProgress = ({ onTabChange }) => {
  const { t } = useTranslation();
  const { totalPoints, streak, unlockedRewards, darkMode } =
    useSmartBoardKids();
  const level = getLevel(totalPoints);

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Header banner */}
        <div
          className="relative rounded-2xl overflow-hidden p-5"
          style={{ background: PROGRESS_GRADIENT }}
        >
          <div className="relative z-10 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: "rgba(255,255,255,0.25)" }}
            >
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <h3 className="text-xl font-black text-white drop-shadow-sm">
                Mi Progreso
              </h3>
              <p className="text-xs text-white/80">
                Dominio · Racha · Recompensas
              </p>
            </div>
          </div>
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
            style={{
              background: "rgba(255,255,255,0.4)",
              transform: "translate(30%,-30%)",
            }}
          />
        </div>

        {/* ── 1. Mastery visual ── */}
        <SectionLabel
          emoji="⭐"
          title="Dominio por materia"
          darkMode={darkMode}
        />
        <SkillPassport />

        {/* ── 2. Racha ── */}
        <SectionLabel emoji="🔥" title="Racha y nivel" darkMode={darkMode} />
        <motion.div
          variants={item}
          className={`rounded-2xl p-5 border transition-colors duration-500 ${
            darkMode
              ? "bg-[#1E293B]/80 border-[#334155]/50"
              : "bg-white/80 border-[#E2E8F0]/50"
          } backdrop-blur-xl`}
        >
          {/* Streak row */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="text-3xl font-black text-[#FF8E53]">
                🔥 {streak.current}{" "}
                <span className="text-lg">{t("smartboard.days")}</span>
              </div>
              <div
                className={`text-xs mt-0.5 ${darkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
              >
                {streak.current > 0
                  ? t("smartboard.record", { days: streak.longest })
                  : t("smartboard.start_today")}
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${darkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
              >
                Mejor racha
              </div>
              <div className="text-xl font-black text-[#F3722C]">
                🏆 {streak.longest} {t("smartboard.days")}
              </div>
            </div>
          </div>

          {/* Level bar */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{level.icon}</span>
              <span
                className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#1E293B]"}`}
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
              className="h-full rounded-full"
              style={{ background: PROGRESS_GRADIENT }}
              initial={{ width: 0 }}
              animate={{ width: `${level.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* ── 3. Recompensas ── */}
        <SectionLabel emoji="🎁" title="Recompensas" darkMode={darkMode} />
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
