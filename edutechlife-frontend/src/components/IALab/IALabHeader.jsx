import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../../utils/iconMapping.jsx";
import UserDropdownMenuSimplified from "../UserDropdownMenuSimplified";
import NotificationPanel from "../NotificationPanel";
import { useIALabUIContext } from "../../context/IALabContext";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "../../i18n/I18nProvider";
import LocaleSwitcher from "../LocaleSwitcher";
import { useNotification } from "../../context/NotificationContext";
import { useCourseReminders } from "../../hooks/useCourseReminders";
import { useBrowserNotifications } from "../../hooks/useBrowserNotifications";
import useForumNotifications from "../../hooks/IALab/forum/useForumNotifications";
import GlobalSearchBar from "./GlobalSearchBar";
import { getBadgeInfo } from "../../data/ialab";

const IALabHeader = () => {
  const { t, locale } = useTranslation();
  const BADGE_INFO = getBadgeInfo(locale);
  const { onBack, courseCompleted, setShowCertificateModal } =
    useIALabUIContext();
  const { unreadCount, createNotification } = useNotification();
  const { unreadCount: forumUnreadCount } = useForumNotifications();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifTriggerRef = useRef(null);
  const totalUnread = unreadCount + forumUnreadCount;
  // Activar recordatorios de curso al montar
  useCourseReminders();

  // Notificaciones del navegador (push)
  useBrowserNotifications();

  // Notificación al ganar insignias
  useEffect(() => {
    const badgeInfo = getBadgeInfo(locale);
    const handleBadges = (e) => {
      const badgeIds = e.detail?.badges || [];
      badgeIds.forEach((id) => {
        const info = badgeInfo?.[id];
        if (!info) return;
        createNotification({
          type: "success",
          title: `🏅 ${info.label}`,
          message: info.desc,
          metadata: { badge: id, type: "badge" },
        });
      });
    };
    window.addEventListener("ialab:badgesAwarded", handleBadges);
    return () =>
      window.removeEventListener("ialab:badgesAwarded", handleBadges);
  }, [createNotification, locale]);

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-5 lg:px-6 bg-[var(--theme-surface)] border-b theme-border w-full shadow-sm">
      <div className="flex items-center gap-3 group rounded-xl text-left">
        <div className="w-9 h-9 theme-bg-primary rounded-xl flex items-center justify-center shadow-sm theme-shadow-primary-15">
          <Icon
            name="fa-flask-vial"
            className="text-white text-sm"
            aria-hidden="true"
          />
        </div>
        {courseCompleted ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setShowCertificateModal(true);
            }}
            className="text-lg font-bold theme-text tracking-tight truncate hover:theme-text-primary transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            title={t("ialab.certificate_title")}
          >
            <span>{t("ialab.course_title")}</span>
            <Icon
              name="fa-award"
              className="text-[#FFD166] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-hidden="true"
            />
          </span>
        ) : (
          <h2 className="text-lg font-bold theme-text tracking-tight truncate">
            {t("ialab.course_title")}
          </h2>
        )}
      </div>

      {/* Barra de búsqueda global */}
      <div className="hidden md:flex items-center gap-3">
        <GlobalSearchBar />
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <LocaleSwitcher />
        {/* Campana de notificaciones */}
        <div className="relative">
          <button
            ref={notifTriggerRef}
            onClick={() => setNotifOpen(!notifOpen)}
            className={`relative flex items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-xl border bg-[var(--theme-surface)] transition-all duration-200 group ${
              notifOpen
                ? "theme-border-primary-30 shadow-sm theme-bg-primary-5"
                : "border-transparent hover:theme-border-primary-20 hover:shadow-sm hover:theme-bg-primary-5"
            }`}
            aria-label={t("ialab.notifications_aria")}
            aria-haspopup="dialog"
            aria-expanded={notifOpen}
            data-tour="tour-notificaciones"
          >
            <Icon
              name="fa-bell"
              aria-hidden="true"
              className={`text-lg transition-all duration-200 ${
                notifOpen || totalUnread > 0
                  ? "theme-text-primary"
                  : "theme-text-muted group-hover:theme-text-primary"
              }`}
            />
            {totalUnread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[11px] font-bold text-white theme-bg-primary rounded-full border-2 border-white px-1 shadow-sm">
                {totalUnread > 999 ? "999+" : totalUnread}
              </span>
            )}
            {forumUnreadCount > 0 && (
              <span
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 ring-1 ring-white shadow-sm"
                title={t("header.notifications_forum", {
                  count: forumUnreadCount,
                })}
              />
            )}
          </button>

          <NotificationPanel
            isOpen={notifOpen}
            onClose={() => setNotifOpen(false)}
            triggerRef={notifTriggerRef}
            forumUnreadCount={forumUnreadCount}
          />
        </div>

        <button
          onClick={toggleDarkMode}
          className={`relative flex items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-xl border transition-all duration-200 group ${isDarkMode ? "bg-amber-400/10 border-amber-400/30" : "border-transparent hover:theme-border-primary-20 hover:shadow-sm hover:theme-bg-primary-5"}`}
          aria-label={
            isDarkMode ? t("header.light_mode") : t("header.dark_mode")
          }
        >
          <Icon
            name={isDarkMode ? "fa-sun" : "fa-moon"}
            className={`text-lg transition-all duration-200 ${isDarkMode ? "text-amber-400" : "theme-text-muted group-hover:theme-text-primary"}`}
            aria-hidden="true"
          />
        </button>
        <UserDropdownMenuSimplified
          onNavigate={(view) => {
            if (view === "landing") {
              onBack && onBack();
            } else if (view === "certificados") {
              setShowCertificateModal(true);
            }
          }}
        />
      </div>
    </header>
  );
};

export default React.memo(IALabHeader);
