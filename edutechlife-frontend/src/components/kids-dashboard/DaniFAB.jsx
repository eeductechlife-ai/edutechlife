import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import DaniCharacter from "./dani/DaniCharacter";
import { useTranslation } from "../../i18n/I18nProvider";
import { track } from "../../lib/analytics";
import { EVENTS } from "../../lib/analyticsEvents";

const DaniFAB = memo(
  ({
    isDaniOpen,
    onDaniOpen,
    darkMode,
    unreadCount = 0,
    avatarAnimado = false,
  }) => {
    const { t } = useTranslation();

    const handleClick = useCallback(() => {
      if (!isDaniOpen) {
        track(EVENTS.DANI_OPENED, { source: "fab" });
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

    // Web-chat style greeting bubble: shows once per session, a few seconds after load.
    const [showHint, setShowHint] = useState(false);
    useEffect(() => {
      if (isDaniOpen) {
        setShowHint(false);
        return undefined;
      }
      let seen = false;
      try {
        seen = sessionStorage.getItem("dani_fab_hint_seen") === "1";
      } catch {
        seen = false;
      }
      if (seen) return undefined;
      const show = setTimeout(() => {
        setShowHint(true);
        try {
          sessionStorage.setItem("dani_fab_hint_seen", "1");
        } catch {
          /* storage unavailable */
        }
      }, 3500);
      const hide = setTimeout(() => setShowHint(false), 13500);
      return () => {
        clearTimeout(show);
        clearTimeout(hide);
      };
    }, [isDaniOpen]);

    const openFromHint = useCallback(() => {
      setShowHint(false);
      if (!isDaniOpen) {
        track(EVENTS.DANI_OPENED, { source: "fab_hint" });
        track(EVENTS.DANI_CHAT_STARTED, { source: "fab_hint" });
        onDaniOpen();
      }
    }, [isDaniOpen, onDaniOpen]);

    const badgeContent = useMemo(() => {
      if (unreadCount === 0) return null;
      return unreadCount > 99 ? "99+" : unreadCount;
    }, [unreadCount]);

    return (
      <>
        <AnimatePresence>
          {showHint && !isDaniOpen && (
            <motion.div
              key="dani-hint"
              initial={{ opacity: 0, x: 16, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.95 }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              className={`fixed z-40 right-[5.5rem] md:right-[7.5rem] max-w-[230px] rounded-2xl rounded-br-md px-4 py-3 pr-9 shadow-xl border ${
                darkMode
                  ? "bg-[#12305A] border-[#1E3558] text-white"
                  : "bg-white border-[#DCE6EE] text-[#081A33]"
              }`}
              style={{
                bottom: "calc(env(safe-area-inset-bottom, 0px) + 6.25rem)",
              }}
              role="status"
            >
              <button
                type="button"
                onClick={openFromHint}
                className="flex flex-col items-start text-left focus:outline-none"
              >
                <span className="block text-sm font-bold leading-snug">
                  ¡Hola! Soy Dani 👋
                </span>
                <span
                  className={`block text-xs mt-0.5 ${darkMode ? "text-white/75" : "text-[#4F6476]"}`}
                >
                  ¿Te ayudo con tu tarea?
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowHint(false)}
                aria-label="Cerrar saludo de Dani"
                className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${darkMode ? "text-white/60 hover:bg-white/10" : "text-[#4F6476] hover:bg-[#EEF4F8]"}`}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={isDaniOpen}
          aria-label={t("smartboard.dani_fab_aria") || "Chat con Dani"}
          aria-pressed={isDaniOpen}
          role="button"
          tabIndex={0}
          className={`fixed right-4 md:right-8 z-40 w-16 h-16 rounded-full
        flex items-center justify-center shadow-lg
        transition-all duration-200 disabled:opacity-80
        bg-[radial-gradient(circle_at_35%_30%,#1E3F73_0%,#0B1D3A_72%)]
        ring-2 ring-[#6FF0FF]/60 hover:shadow-xl hover:shadow-[#00C2E0]/40
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-offset-2
        ${
          darkMode
            ? "focus:ring-[#4DA8C4]/50 focus:ring-offset-[#0F172A]"
            : "focus:ring-[#00B4D8]/50 focus:ring-offset-[#F8FAFC]"
        }
      `}
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)" }}
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
              whileHover={!isDaniOpen ? { rotate: [0, -8, 8, -8, 0] } : {}}
              transition={{ duration: 1.2 }}
            >
              <DaniCharacter size={54} />
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

          {/* Avatar Animado: arco iris pulsante cuando está desbloqueado */}
          {avatarAnimado && !isDaniOpen && (
            <motion.div
              className="absolute -inset-1.5 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #FF6B9D, #FFD166, #66CCCC, #4DA8C4, #9D4EDD, #FF6B9D)",
              }}
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity },
              }}
              aria-hidden="true"
            />
          )}
        </motion.button>
      </>
    );
  },
);

DaniFAB.displayName = "DaniFAB";

export default DaniFAB;
