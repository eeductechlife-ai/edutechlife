import { memo } from "react";
import { motion } from "framer-motion";
import { Flame, Gem } from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";
import { CATEGORIES, TOP_BAR_LABELS } from "../kidsDashboardConfig";
import { SB_GRADIENTS, glow } from "../smartboardTheme";
import UserMenu from "../UserMenu";

const TopBar = memo(
  ({ activeTab, darkMode, streak, totalPoints, authToken, studentName }) => {
    const { t } = useTranslation();
    const activeCat = CATEGORIES.find((c) => c.tabs.includes(activeTab));
    const ActiveIcon = activeCat?.Icon || Bot;

    return (
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`backdrop-blur-xl border-b p-4 flex items-center justify-between z-20 transition-colors duration-500 ${
          darkMode
            ? "bg-[#1E293B]/80 border-[#334155]/50"
            : "bg-white/80 border-[#E2E8F0]/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <motion.span
            key={activeCat?.id}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 14 }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
            style={{
              background: activeCat?.gradient || SB_GRADIENTS.brand,
              boxShadow: `${glow(activeCat?.glowColor || "#00B4D8", 0.4)}, inset 0 1px 0 rgba(255,255,255,0.35)`,
            }}
          >
            <ActiveIcon className="w-[21px] h-[21px]" strokeWidth={2.3} />
          </motion.span>
          <div className="leading-none">
            <span
              className={`block text-[10px] font-black uppercase tracking-[0.14em] mb-0.5 ${darkMode ? "text-[#5C7386]" : "text-[#93A6B2]"}`}
            >
              {activeCat?.label}
            </span>
            <h1
              className={`text-xl font-black tracking-tight transition-colors duration-500 ${darkMode ? "text-white" : "text-[#00303F]"}`}
            >
              {TOP_BAR_LABELS[activeTab] || activeTab}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            className="hidden sm:flex px-2.5 py-1.5 rounded-2xl items-center gap-2 transition-colors duration-500"
            style={{
              background: darkMode
                ? "linear-gradient(135deg, rgba(251,133,0,0.18), rgba(255,209,102,0.12))"
                : "linear-gradient(135deg, rgba(251,133,0,0.12), rgba(255,209,102,0.10))",
            }}
            whileHover={{ scale: 1.03, y: -1 }}
            title={t("smartboard.streak_title")}
          >
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
              style={{
                background: "linear-gradient(135deg, #FB8500, #F3722C)",
              }}
            >
              <Flame className="w-4 h-4" strokeWidth={2.4} />
            </span>
            <span className="leading-none">
              <span className="block text-sm font-black text-[#FB8500] tabular-nums">
                {streak.current}
              </span>
              <span
                className={`block text-[9px] font-semibold ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
              >
                {t("smartboard.days")}
              </span>
            </span>
          </motion.div>

          <motion.div
            className="flex px-2.5 py-1.5 rounded-2xl items-center gap-2 transition-colors duration-500"
            style={{
              background: darkMode
                ? "linear-gradient(135deg, rgba(0,150,199,0.20), rgba(72,202,228,0.12))"
                : "linear-gradient(135deg, rgba(0,150,199,0.12), rgba(72,202,228,0.10))",
            }}
            whileHover={{ scale: 1.03, y: -1 }}
            aria-live="polite"
            aria-atomic="true"
          >
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
              style={{ background: SB_GRADIENTS.brand }}
            >
              <Gem className="w-4 h-4" strokeWidth={2.4} />
            </span>
            <span className="leading-none">
              <span
                className={`block text-sm font-black tabular-nums ${darkMode ? "text-white" : "text-[#00303F]"}`}
              >
                {totalPoints.toLocaleString()}
              </span>
              <span
                className={`block text-[9px] font-semibold ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
              >
                {t("smartboard.points_display")}
              </span>
            </span>
          </motion.div>

          {authToken && (
            <UserMenu authToken={authToken} studentName={studentName} />
          )}
        </div>
      </motion.header>
    );
  },
);

TopBar.displayName = "TopBar";

export default TopBar;
