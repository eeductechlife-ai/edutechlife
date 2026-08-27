import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../../../context/NotificationContext";
import { SB_COLORS, SB_GRADIENTS, SB_RADII, glow } from "../smartboardTheme";

/**
 * SmartBoardNotificationPanel — notification dropdown styled with the SmartBoard
 * design system (gradients, glow, chunky radii, emoji icons, dark mode). Reads
 * the shared NotificationContext store; on click it routes SmartBoard
 * notifications to the right tab via onNavigateTab (no IALab routes).
 */

// type → emoji + accent color, drawn from the SmartBoard palette
const TYPE_STYLE = {
  smartboard_mission: {
    emoji: "🎯",
    color: SB_COLORS.amber,
    grad: SB_GRADIENTS.progress,
  },
  smartboard_reinforcement: {
    emoji: "💡",
    color: SB_COLORS.warning,
    grad: SB_GRADIENTS.gold,
  },
  exam_reminder: {
    emoji: "📝",
    color: SB_COLORS.coral,
    grad: SB_GRADIENTS.practice,
  },
  lesson_reminder: {
    emoji: "📚",
    color: SB_COLORS.primary,
    grad: SB_GRADIENTS.brand,
  },
  module_complete: {
    emoji: "✅",
    color: SB_COLORS.mint,
    grad: SB_GRADIENTS.learn,
  },
  certificate_earned: {
    emoji: "🏆",
    color: SB_COLORS.gold,
    grad: SB_GRADIENTS.gold,
  },
  achievement: { emoji: "🏆", color: SB_COLORS.gold, grad: SB_GRADIENTS.gold },
  course_update: {
    emoji: "📣",
    color: SB_COLORS.violet,
    grad: SB_GRADIENTS.explore,
  },
  general: { emoji: "🔔", color: SB_COLORS.primary, grad: SB_GRADIENTS.brand },
};

// The badge already shows the type emoji, so drop a leading emoji from the title
// to avoid the doubled-emoji look ("🎯 🎯 Tu misión…").
function stripLeadingEmoji(text = "") {
  return (
    text.replace(/^\s*(?:\p{Extended_Pictographic}️?‍?)+\s*/u, "").trim() || text
  );
}

function timeAgo(date) {
  const diffMin = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const h = Math.floor(diffMin / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `hace ${d} d`;
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}

const SmartBoardNotificationPanel = ({
  isOpen,
  onClose,
  triggerRef,
  darkMode = false,
  onNavigateTab,
}) => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications,
  } = useNotification();
  const panelRef = useRef(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Close on outside click and on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onClick = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !(triggerRef?.current && triggerRef.current.contains(e.target))
      ) {
        onClose();
      }
    };
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose, triggerRef]);

  const handleClearAll = () => {
    if (confirmClear) {
      clearAllNotifications();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const surface = darkMode ? SB_COLORS.surfaceDark : SB_COLORS.surfaceLight;
  const surfaceAlt = darkMode ? SB_COLORS.surfaceDarkAlt : "#F4F9FC";
  const border = darkMode ? SB_COLORS.borderDark : SB_COLORS.borderLight;
  const textMain = darkMode ? "#F0F6FF" : SB_COLORS.deep;
  const textMuted = darkMode
    ? SB_COLORS.textMutedDark
    : SB_COLORS.textMutedLight;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ type: "spring", damping: 22, stiffness: 320 }}
          role="region"
          aria-label="Notificaciones"
          className="absolute right-1 sm:right-2 top-full mt-2 z-[1000] w-[20rem] max-w-[calc(100vw-1.5rem)] overflow-hidden"
          style={{
            background: surface,
            borderRadius: SB_RADII.lg,
            border: `1px solid ${border}`,
            boxShadow: glow(SB_COLORS.primary, 0.28),
          }}
        >
          {/* Header — SmartBoard brand gradient */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{
              background: SB_GRADIENTS.brand,
              boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">
                🔔
              </span>
              <h3 className="text-white font-black text-sm tracking-tight">
                Notificaciones
              </h3>
              {unreadCount > 0 && (
                <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} nueva{unreadCount === 1 ? "" : "s"}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="text-white/70 hover:text-white transition-colors w-7 h-7 rounded-xl hover:bg-white/15 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Quick actions */}
          {notifications.length > 0 && (
            <div
              className="px-3 py-2 flex items-center justify-between"
              style={{
                background: surfaceAlt,
                borderBottom: `1px solid ${border}`,
              }}
            >
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-lg transition-colors disabled:opacity-40"
                style={{ color: SB_COLORS.primary }}
              >
                ✓ Marcar leídas
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors"
                style={
                  confirmClear
                    ? { color: "#fff", background: SB_COLORS.danger }
                    : { color: SB_COLORS.danger }
                }
              >
                🗑 {confirmClear ? "¿Seguro?" : "Limpiar"}
              </button>
            </div>
          )}

          {/* List */}
          <div className="max-h-[24rem] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 gap-3">
                <div
                  className="w-8 h-8 rounded-full animate-spin"
                  style={{
                    border: `3px solid ${border}`,
                    borderTopColor: SB_COLORS.primary,
                  }}
                />
                <p className="text-xs" style={{ color: textMuted }}>
                  Cargando…
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-2">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-1"
                  style={{ background: `${SB_COLORS.primary}18` }}
                  aria-hidden="true"
                >
                  🎉
                </div>
                <p className="text-sm font-bold" style={{ color: textMain }}>
                  ¡Estás al día!
                </p>
                <p className="text-xs" style={{ color: textMuted }}>
                  Aquí verás tus misiones, recordatorios y logros.
                </p>
              </div>
            ) : (
              <ul>
                {notifications.map((n) => {
                  const s = TYPE_STYLE[n.type] || TYPE_STYLE.general;
                  const tab = n.metadata?.tab;
                  return (
                    <li key={n.id}>
                      <div
                        role={tab ? "button" : undefined}
                        tabIndex={tab ? 0 : undefined}
                        onClick={() => {
                          if (!n.is_read) markAsRead(n.id);
                          if (tab && onNavigateTab) {
                            onNavigateTab(tab);
                            onClose();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (tab && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault();
                            if (!n.is_read) markAsRead(n.id);
                            onNavigateTab?.(tab);
                            onClose();
                          }
                        }}
                        className={`group relative px-3.5 py-3 flex gap-3 transition-colors ${tab ? "cursor-pointer" : ""}`}
                        style={{
                          borderBottom: `1px solid ${border}`,
                          background: n.is_read
                            ? "transparent"
                            : `${s.color}0F`,
                        }}
                      >
                        {/* Emoji badge with category gradient ring */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                          style={{
                            background: s.grad,
                            boxShadow: glow(s.color, 0.35),
                          }}
                          aria-hidden="true"
                        >
                          {s.emoji}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className="text-[13px] leading-snug"
                              style={{
                                color: textMain,
                                fontWeight: n.is_read ? 600 : 800,
                              }}
                            >
                              {stripLeadingEmoji(n.title)}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(n.id);
                              }}
                              aria-label="Descartar notificación"
                              className="opacity-0 group-hover:opacity-100 focus:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                              style={{ color: textMuted }}
                            >
                              ✕
                            </button>
                          </div>
                          <p
                            className="text-[12px] mt-0.5 leading-snug"
                            style={{ color: textMuted }}
                          >
                            {n.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span
                              className="text-[10px]"
                              style={{ color: textMuted }}
                            >
                              {timeAgo(n.created_at)}
                            </span>
                            {!n.is_read && (
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: s.color }}
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartBoardNotificationPanel;
