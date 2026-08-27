import { memo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Flame, Gem, Home, Bell } from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";
import { CATEGORIES, TOP_BAR_LABELS } from "../kidsDashboardConfig";
import { SB_GRADIENTS, glow } from "../smartboardTheme";
import UserMenu from "../UserMenu";
import SmartBoardNotificationPanel from "./SmartBoardNotificationPanel";
import { useNotification } from "../../../context/NotificationContext";

const TopBar = memo(
  ({
    activeTab,
    darkMode,
    streak,
    totalPoints,
    authToken,
    studentName,
    onTabChange,
    onLogout,
  }) => {
    const { t } = useTranslation();
    const { unreadCount } = useNotification();
    const [notifOpen, setNotifOpen] = useState(false);
    const bellRef = useRef(null);
    const activeCat = CATEGORIES.find((c) => c.tabs.includes(activeTab));
    const ActiveIcon = activeCat?.Icon || Home;

    return (
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`backdrop-blur-xl border-b px-4 py-3 md:p-4 flex items-center justify-between z-20 transition-colors duration-500 ${
          darkMode
            ? "bg-[#1E293B]/80 border-[#334155]/50"
            : "bg-white/80 border-[#E2E8F0]/50"
        }`}
      >
        {activeTab !== "inicio" && (
          <div className="flex items-center gap-3 min-w-0">
            <motion.span
              key={activeCat?.id}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 14 }}
              className="w-11 h-11 md:w-10 md:h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
              style={{
                background: activeCat?.gradient || SB_GRADIENTS.brand,
                boxShadow: `${glow(activeCat?.glowColor || "#00B4D8", 0.4)}, inset 0 1px 0 rgba(255,255,255,0.35)`,
              }}
            >
              <ActiveIcon
                className="w-6 md:w-[21px] h-6 md:h-[21px]"
                strokeWidth={2.3}
              />
            </motion.span>
            <div className="leading-tight truncate">
              <span
                className={`block text-[11px] md:text-[10px] font-black uppercase tracking-[0.14em] mb-1 ${darkMode ? "text-[#5C7386]" : "text-[#93A6B2]"}`}
              >
                {activeCat?.label}
              </span>
              <h1
                className={`text-lg md:text-xl font-black tracking-tight transition-colors duration-500 truncate ${darkMode ? "text-white" : "text-[#00303F]"}`}
              >
                {TOP_BAR_LABELS[activeTab] || activeTab}
              </h1>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          <motion.div
            className="hidden sm:flex px-3 md:px-2.5 py-2 md:py-1.5 rounded-2xl items-center gap-2 transition-colors duration-500"
            style={{
              background: darkMode
                ? "linear-gradient(135deg, rgba(251,133,0,0.18), rgba(255,209,102,0.12))"
                : "linear-gradient(135deg, rgba(251,133,0,0.12), rgba(255,209,102,0.10))",
            }}
            whileHover={{ scale: 1.03, y: -1 }}
            title={t("smartboard.streak_title")}
          >
            <span
              className="w-8 h-8 md:w-7 md:h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #FB8500, #F3722C)",
              }}
            >
              <Flame className="w-5 md:w-4 h-5 md:h-4" strokeWidth={2.4} />
            </span>
            <span className="leading-tight">
              <span className="block text-base md:text-sm font-black text-[#FB8500] tabular-nums">
                {streak?.current ?? 0}
              </span>
              <span
                className={`block text-[10px] md:text-[9px] font-semibold ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
              >
                {t("smartboard.days")}
              </span>
            </span>
          </motion.div>

          <motion.div
            className="flex px-3 md:px-2.5 py-2 md:py-1.5 rounded-2xl items-center gap-2 transition-colors duration-500"
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
              className="w-8 h-8 md:w-7 md:h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ background: SB_GRADIENTS.brand }}
            >
              <Gem className="w-5 md:w-4 h-5 md:h-4" strokeWidth={2.4} />
            </span>
            <span className="leading-tight">
              <span
                className={`block text-base md:text-sm font-black tabular-nums ${darkMode ? "text-white" : "text-[#00303F]"}`}
              >
                {(totalPoints ?? 0).toLocaleString()}
              </span>
              <span
                className={`block text-[10px] md:text-[9px] font-semibold ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
              >
                {t("smartboard.points_display")}
              </span>
            </span>
          </motion.div>

          {/* Notification bell — surfaces SmartBoard domain notifications (§42) */}
          <div className="relative">
            <button
              ref={bellRef}
              onClick={() => setNotifOpen((v) => !v)}
              aria-label={t("smartboard.notifications") || "Notificaciones"}
              aria-haspopup="true"
              aria-expanded={notifOpen}
              className={`relative flex items-center justify-center w-11 h-11 md:w-10 md:h-10 rounded-2xl transition-colors ${
                darkMode
                  ? "bg-[#334155]/40 hover:bg-[#334155]/70 text-[#E2F0FF]"
                  : "bg-[#EEF4F8] hover:bg-[#DCE8EF] text-[#00303F]"
              }`}
            >
              <Bell
                className="w-5 md:w-[19px] h-5 md:h-[19px]"
                strokeWidth={2.3}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-[#EF476F] rounded-full border-2 border-white px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            <SmartBoardNotificationPanel
              isOpen={notifOpen}
              onClose={() => setNotifOpen(false)}
              triggerRef={bellRef}
              darkMode={darkMode}
              onNavigateTab={onTabChange}
            />
          </div>

          {authToken && (
            <UserMenu
              authToken={authToken}
              studentName={studentName}
              darkMode={darkMode}
              onTabChange={onTabChange}
              onLogout={onLogout}
            />
          )}
        </div>
      </motion.header>
    );
  },
);

TopBar.displayName = "TopBar";

export default TopBar;
