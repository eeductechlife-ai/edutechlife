import { memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";
import { track } from "../../lib/analytics";
import { EVENTS } from "../../lib/analyticsEvents";

const DaniFAB = memo(
  ({ isDaniOpen, onDaniOpen, darkMode, unreadCount = 0 }) => {
    const { t } = useTranslation();

    const handleClick = useCallback(() => {
      if (!isDaniOpen) {
        track(EVENTS.DANI_CHAT_STARTED, { source: "fab" });
        onDaniOpen();
      }
    }, [isDaniOpen, onDaniOpen]);

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      },
      [handleClick],
    );

    const badgeContent = useMemo(() => {
      if (unreadCount === 0) return null;
      return unreadCount > 99 ? "99+" : unreadCount;
    }, [unreadCount]);

    return (
      <motion.button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isDaniOpen}
        aria-label={t("smartboard.dani_fab_aria") || "Chat con Dani"}
        aria-pressed={isDaniOpen}
        role="button"
        tabIndex={0}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full
        flex items-center justify-center shadow-lg
        transition-all duration-200 disabled:opacity-80
        ${
          darkMode
            ? "bg-gradient-to-br from-[#4DA8C4] to-[#06B6D4] hover:shadow-xl hover:shadow-[#4DA8C4]/40"
            : "bg-gradient-to-br from-[#00B4D8] to-[#0096C7] hover:shadow-xl hover:shadow-[#00B4D8]/40"
        }
        md:bottom-8 md:right-8
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-offset-2
        ${
          darkMode
            ? "focus:ring-[#4DA8C4]/50 focus:ring-offset-[#0F172A]"
            : "focus:ring-[#00B4D8]/50 focus:ring-offset-[#F8FAFC]"
        }
      `}
        whileHover={!isDaniOpen ? { scale: 1.1 } : {}}
        whileTap={!isDaniOpen ? { scale: 0.95 } : {}}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* Icon Container */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={isDaniOpen ? { rotate: 0 } : {}}
            whileHover={!isDaniOpen ? { rotate: [0, -10, 10, -10, 0] } : {}}
            transition={{ duration: 1.2 }}
            className="text-white"
          >
            <Bot className="w-6 h-6 stroke-[2.5]" />
          </motion.div>

          {/* Badge - Notificaciones no leídas */}
          {badgeContent && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5
              bg-red-500 text-white text-xs font-bold rounded-full
              flex items-center justify-center
              shadow-lg"
            >
              {badgeContent}
            </motion.span>
          )}
        </div>

        {/* Pulse ring para atención (sin abrir) */}
        {!isDaniOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{ scale: [1, 1.2], opacity: [1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-hidden="true"
          />
        )}
      </motion.button>
    );
  },
);

DaniFAB.displayName = "DaniFAB";

export default DaniFAB;
