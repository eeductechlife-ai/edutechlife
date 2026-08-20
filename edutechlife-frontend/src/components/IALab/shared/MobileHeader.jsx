import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping";
import { useTranslation } from "../../../i18n/I18nProvider";
import LocaleSwitcher from "../../LocaleSwitcher";
import NotificationPanel from "../../NotificationPanel";
import { useNotification } from "../../../context/NotificationContext";
import useForumNotifications from "../../../hooks/IALab/forum/useForumNotifications";

const MobileHeader = ({
  onOpenMobileMenu,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  isSearchOpen,
}) => {
  const { t } = useTranslation();
  const { unreadCount } = useNotification();
  const { unreadCount: forumUnreadCount } = useForumNotifications();
  const totalUnread = unreadCount + forumUnreadCount;
  const [notifOpen, setNotifOpen] = useState(false);
  const notifTriggerRef = useRef(null);

  return (
    <div
      role="banner"
      onTouchStart={(e) => e.stopPropagation()}
      className="md:hidden fixed top-0 left-0 right-0 h-16 landscape:h-12 bg-white dark:bg-slate-800 z-50 flex items-center justify-between px-4 landscape:px-3 border-b border-slate-200 dark:border-slate-700 pt-[var(--safe-area-top)]"
    >
      <h1 className="text-2xl font-bold text-[var(--theme-emphasis)] dark:text-[var(--theme-emphasis)] tracking-tight">
        {t("ialab.title")}
      </h1>
      <div className="flex items-center gap-1.5">
        <LocaleSwitcher />

        {/* Campana de notificaciones en móvil */}
        <div className="relative">
          <button
            ref={notifTriggerRef}
            onClick={() => setNotifOpen((v) => !v)}
            className="relative h-11 w-11 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/50"
            aria-label={t("ialab.notif_mobile_aria")}
            aria-haspopup="dialog"
            aria-expanded={notifOpen}
          >
            <Icon name="fa-bell" className={`w-4 h-4 ${totalUnread > 0 ? "text-[var(--theme-emphasis)] dark:text-[var(--theme-primary)]" : ""}`} aria-hidden="true" />
            {totalUnread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 text-[10px] font-bold text-white bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] rounded-full border-2 border-white dark:border-slate-800 px-0.5 shadow-sm">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
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
          onClick={() => setIsSearchOpen(true)}
          className="h-11 w-11 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/50"
          aria-label={t("ialab.search_aria")}
        >
          <Icon name="fa-search" className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          onClick={onOpenMobileMenu}
          className="h-11 w-11 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/50"
          aria-label={t("ialab.menu_aria")}
          aria-controls="ialab-mobile-menu"
          aria-expanded="false"
          data-tour="tour-undermenu-mobile"
        >
          <svg
            className="w-6 h-6 text-[var(--theme-emphasis)] dark:text-[var(--theme-primary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

MobileHeader.displayName = "MobileHeader";

MobileHeader.propTypes = {
  onOpenMobileMenu: PropTypes.func,
  setIsSearchOpen: PropTypes.func,
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
  isSearchOpen: PropTypes.bool,
};

export default MobileHeader;
export { MobileHeader };
