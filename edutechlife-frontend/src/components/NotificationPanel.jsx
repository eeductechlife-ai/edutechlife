import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { useTranslation } from "../i18n/I18nProvider";
import { Icon } from "../utils/iconMapping.jsx";
import useBrowserNotifications from "../hooks/useBrowserNotifications";

const NOTIFICATION_CONFIG = {
  lesson_reminder: { icon: "fa-book", variant: "emphasis" },
  exam_reminder: { icon: "fa-file-alt", variant: "primary" },
  module_complete: { icon: "fa-check-circle", variant: "emphasis" },
  certificate_earned: { icon: "fa-award", variant: "emphasis" },
  course_update: { icon: "fa-info-circle", variant: "primary" },
  general: { icon: "fa-bell", variant: "primary" },
};

const TYPE_LABEL_KEYS = {
  lesson_reminder: "notification.type_lesson_reminder",
  exam_reminder: "notification.type_exam_reminder",
  module_complete: "notification.type_module_complete",
  certificate_earned: "notification.type_certificate_earned",
  course_update: "notification.type_course_update",
  general: "notification.type_general",
};

const getIconColorClass = (variant) =>
  variant === "emphasis"
    ? "text-[var(--theme-emphasis)]"
    : "text-[var(--theme-primary)]";

const getBadgeBgClass = (variant) =>
  variant === "emphasis"
    ? "from-[var(--theme-emphasis)]/10 to-[var(--theme-primary)]/10"
    : "from-[var(--theme-primary)]/10 to-[var(--theme-primary)]/20";

const formatTimeAgo = (date, t, locale) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 1) return t("notification.time_just_now");
  if (diffMin < 60) return t("notification.time_ago_min", { count: diffMin });
  if (diffHrs < 24) return t("notification.time_ago_h", { count: diffHrs });
  if (diffDays < 7) return t("notification.time_ago_d", { count: diffDays });
  return then.toLocaleDateString(
    { en: "en-US", pt: "pt-BR", es: "es-CO" }[locale] || "es-CO",
    { day: "numeric", month: "short" },
  );
};

const ROUTE_MAP = {
  lesson_reminder: (m) => `/ialab/${m?.moduleId || 1}`,
  exam_reminder: (m) => `/ialab/${m?.moduleId || 1}`,
  module_complete: (m) => `/ialab/${m?.moduleId || 1}`,
  certificate_earned: () => "#certificate",
  course_update: () => "/ialab",
  general: (m) => (m?.moduleId ? `/ialab/${m.moduleId}` : "/ialab"),
};

const NotificationPanel = ({
  isOpen,
  onClose,
  triggerRef,
  forumUnreadCount = 0,
}) => {
  const navigate = useNavigate();
  const { t, locale } = useTranslation();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications,
    preferences,
    updatePreferences,
  } = useNotification();
  const { subscribeToPush, syncPushSubscription } = useBrowserNotifications();
  const panelRef = useRef(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (!panelRef.current) return;

      const isInsidePanel = panelRef.current.contains(e.target);
      const isTriggerClick =
        triggerRef?.current && triggerRef.current.contains(e.target);

      if (!isInsidePanel && !isTriggerClick) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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

  if (!isOpen) return null;

  const notificationCount = notifications.length;

  return (
    <div
      className="absolute right-0 top-full mt-2 z-[1000] w-80 animate-in fade-in-0 zoom-in-95 duration-200"
      ref={panelRef}
    >
      <div className="bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] shadow-lg overflow-hidden">
        {/* Header */}
        <div className="theme-bg-emphasis px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="fa-bell" className="text-white text-sm" />
            <h3 className="text-white font-bold text-sm">
              {t("notification.panel_title")}
            </h3>
            {unreadCount > 0 && (
              <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {t("notification.unread_count", { count: unreadCount })}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label={t("notification.close_aria")}
          >
            <Icon name="fa-xmark" className="text-sm" />
          </button>
        </div>

        {/* Acciones rápidas */}
        {unreadCount > 0 && (
          <div className="px-3 py-2 bg-[var(--theme-surface-2)] border-b border-[var(--theme-border)] flex items-center justify-between">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--theme-emphasis)] hover:text-[var(--theme-primary)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--theme-emphasis)]/5"
            >
              <Icon name="fa-check-double" className="text-[10px]" />
              {t("notification.mark_all_read")}
            </button>
            {notificationCount > 0 && (
              <button
                onClick={handleClearAll}
                className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors px-2 py-1 rounded-md ${
                  confirmClear
                    ? "text-white bg-rose-500 hover:bg-rose-600"
                    : "text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                }`}
              >
                <Icon name="fa-trash-can" className="text-[10px]" />
                {confirmClear
                  ? t("notification.confirm_clear")
                  : t("notification.clear_all")}
              </button>
            )}
          </div>
        )}

        {/* Push toggle */}
        <div className="px-3 py-2 border-b border-[var(--theme-border)] bg-[var(--theme-surface-2)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold theme-text-muted uppercase tracking-wider">
              Notif. push
            </span>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (preferences.push && Notification.permission === "granted") {
                  updatePreferences({ ...preferences, push: false });
                } else {
                  const perm = await Notification.requestPermission();
                  if (perm === "granted") {
                    const sub = await subscribeToPush();
                    if (sub) await syncPushSubscription(sub);
                    updatePreferences({ ...preferences, push: true });
                  }
                }
              }}
              className={`relative w-9 h-5 rounded-full transition-colors ${preferences.push && Notification.permission === "granted" ? "bg-[var(--theme-emphasis)]" : "bg-slate-300 dark:bg-slate-600"}`}
              aria-label="Toggle push notifications"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${preferences.push && Notification.permission === "granted" ? "translate-x-4" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--theme-emphasis)] border-t-transparent animate-spin mb-3" />
              <p className="text-xs theme-text-muted">
                {t("notification.loading")}
              </p>
            </div>
          ) : notificationCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--theme-emphasis)]/10 to-[var(--theme-primary)]/10 flex items-center justify-center mb-3">
                <Icon name="fa-bell" className="text-[var(--theme-emphasis)] text-lg" />
              </div>
              <p className="text-sm font-semibold theme-text">
                {t("notification.empty_title")}
              </p>
              <p className="text-xs theme-text-muted text-center mt-1">
                {t("notification.empty_desc")}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--theme-border)]">
              {notifications.map((notif) => {
                const config =
                  NOTIFICATION_CONFIG[notif.type] ||
                  NOTIFICATION_CONFIG.general;
                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.is_read) markAsRead(notif.id);
                      if (!notif.id?.startsWith("local_")) {
                        const metadata = notif.metadata || {};
                        const routeFn =
                          ROUTE_MAP[notif.type] || ROUTE_MAP.general;
                        const route = routeFn(metadata);
                        if (route && !route.startsWith("#")) {
                          navigate(route);
                          onClose();
                        }
                      }
                    }}
                    className={`relative group px-4 py-3 transition-colors hover:bg-[var(--theme-surface-2)] cursor-pointer ${!notif.is_read ? "bg-[var(--theme-emphasis)]/[0.03]" : ""}`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getBadgeBgClass(config.variant)} flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <Icon
                          name={config.icon}
                          className={`text-sm ${getIconColorClass(config.variant)}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs leading-tight theme-text ${!notif.is_read ? "font-bold" : "font-medium"}`}
                            >
                              {notif.title}
                            </p>
                            <p className="text-[11px] theme-text-muted mt-0.5 leading-snug">
                              {notif.message}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(notif.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 theme-text-muted hover:text-rose-500 transition-all flex-shrink-0 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20"
                            aria-label={t("notification.delete_aria")}
                          >
                            <Icon name="fa-xmark" className="text-xs" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] theme-text-muted">
                            {formatTimeAgo(notif.created_at, t, locale)}
                          </span>
                          {!notif.is_read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Enlace a notificaciones del foro */}
          {forumUnreadCount > 0 && (
            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("ialab:switchTab", { detail: "comunidad" }),
                );
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-[var(--theme-emphasis)]/[0.03] border-t border-[var(--theme-border)] text-xs font-medium text-[var(--theme-emphasis)] hover:bg-[var(--theme-emphasis)]/[0.06] transition-colors"
            >
              <Icon name="fa-comments" className="text-[var(--theme-primary)] text-xs" />
              <span>
                {t("notification.forum_count", { count: forumUnreadCount })}
              </span>
              <Icon
                name="fa-arrow-right"
                className="text-[var(--theme-primary)] text-[10px] ml-auto"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
