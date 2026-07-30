import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import UserDropdownMenuSimplified from '../UserDropdownMenuSimplified';
import NotificationPanel from '../NotificationPanel';
import { useIALabUIContext } from '../../context/IALabContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/I18nProvider';
import LocaleSwitcher from '../LocaleSwitcher';
import { useNotification } from '../../context/NotificationContext';
import { useCourseReminders } from '../../hooks/useCourseReminders';
import { useBrowserNotifications } from '../../hooks/useBrowserNotifications';
import useForumNotifications from '../../hooks/IALab/forum/useForumNotifications';
import GlobalSearchBar from './GlobalSearchBar';
import { getBadgeInfo } from '../../data/ialab';

const IALabHeader = () => {
  const { t, locale } = useTranslation();
  const BADGE_INFO = getBadgeInfo(locale);
  const { onBack, courseCompleted, setShowCertificateModal } = useIALabUIContext();
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
      badgeIds.forEach(id => {
        const info = badgeInfo?.[id];
        if (!info) return;
        createNotification({
          type: 'success',
          title: `🏅 ${info.label}`,
          message: info.desc,
          metadata: { badge: id, type: 'badge' }
        });
      });
    };
    window.addEventListener('ialab:badgesAwarded', handleBadges);
    return () => window.removeEventListener('ialab:badgesAwarded', handleBadges);
  }, [createNotification, locale]);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 w-full shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate rounded-xl flex items-center justify-center shadow-sm shadow-petroleum/15">
          <Icon name="fa-flask-vial" className="text-white text-sm" aria-hidden="true" />
        </div>
        {courseCompleted ? (
          <button
            onClick={() => setShowCertificateModal(true)}
            className="text-lg font-bold text-petroleum tracking-tight truncate hover:text-corporate transition-colors duration-200 flex items-center gap-2 group"
            title={t('ialab.certificate_title')}
          >
            <span>{t('ialab.course_title')}</span>
            <Icon name="fa-award" className="text-[#FFD166] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true" />
          </button>
        ) : (
          <h2 className="text-lg font-bold text-petroleum tracking-tight truncate">{t('ialab.course_title')}</h2>
        )}
      </div>

      {/* Barra de búsqueda global */}
      <div className="hidden md:flex items-center gap-3">
        <GlobalSearchBar />
      </div>

      <div className="flex items-center gap-4">
        <LocaleSwitcher />
        {/* Campana de notificaciones */}
        <div className="relative">
          <button
            ref={notifTriggerRef}
            onClick={() => setNotifOpen(!notifOpen)}
            className={`relative flex items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-xl border bg-white transition-all duration-200 group ${
              notifOpen
                ? 'border-petroleum/30 shadow-sm bg-gradient-to-br from-petroleum/5 to-corporate/5'
                : 'border-transparent hover:border-petroleum/20 hover:shadow-sm hover:bg-slate-50'
            }`}
            aria-label={t('ialab.notifications_aria')}
            aria-haspopup="dialog"
            aria-expanded={notifOpen}
            data-tour="tour-notificaciones"
          >
            <Icon
              name="fa-bell"
              aria-hidden="true"
              className={`text-lg transition-all duration-200 ${
                notifOpen
                  ? 'text-corporate'
                  : totalUnread > 0
                    ? 'text-petroleum'
                    : 'text-corporate group-hover:text-petroleum'
              }`}
            />
            {totalUnread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[11px] font-bold text-white bg-gradient-to-r from-petroleum to-corporate rounded-full border-2 border-white px-1 shadow-sm">
                {totalUnread > 999 ? '999+' : totalUnread}
              </span>
            )}
            {forumUnreadCount > 0 && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 ring-1 ring-white shadow-sm" title={t('header.notifications_forum', { count: forumUnreadCount })} />
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
          className={`relative flex items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-xl border transition-all duration-200 group ${isDarkMode ? 'bg-amber-400/10 border-amber-400/30' : 'border-transparent hover:border-petroleum/20 hover:shadow-sm hover:bg-slate-50'}`}
          aria-label={isDarkMode ? t('header.light_mode') : t('header.dark_mode')}
        >
          <Icon name={isDarkMode ? 'fa-sun' : 'fa-moon'} className={`text-lg transition-all duration-200 ${isDarkMode ? 'text-amber-400' : 'text-corporate group-hover:text-petroleum'}`} aria-hidden="true" />
        </button>
        <UserDropdownMenuSimplified
          onNavigate={(view) => {
            if (view === 'landing') {
              onBack && onBack();
            } else if (view === 'certificados') {
              setShowCertificateModal(true);
            }
          }}
        />
      </div>
    </header>
  );
};

export default React.memo(IALabHeader);
