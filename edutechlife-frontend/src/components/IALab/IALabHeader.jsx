import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import UserDropdownMenuSimplified from '../UserDropdownMenuSimplified';
import NotificationPanel from '../NotificationPanel';
import { useIALabUIContext } from '../../context/IALabContext';
import { useTranslation } from '../../i18n/I18nProvider';
import LocaleSwitcher from '../LocaleSwitcher';
import { useNotification } from '../../context/NotificationContext';
import { useCourseReminders } from '../../hooks/useCourseReminders';
import { useBrowserNotifications } from '../../hooks/useBrowserNotifications';
import useForumNotifications from '../../hooks/IALab/forum/useForumNotifications';
import GlobalSearchBar from './GlobalSearchBar';
import { BADGE_INFO } from '../../data/ialab';

const IALabHeader = () => {
  const { t } = useTranslation();
  const { onBack, courseCompleted, setShowCertificateModal } = useIALabUIContext();
  const { unreadCount, createNotification } = useNotification();
  const { unreadCount: forumUnreadCount } = useForumNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifTriggerRef = useRef(null);
  const totalUnread = unreadCount + forumUnreadCount;

  // Activar recordatorios de curso al montar
  useCourseReminders();
  
  // Notificaciones del navegador (push)
  useBrowserNotifications();

  // Notificación al ganar insignias
  useEffect(() => {
    const handleBadges = (e) => {
      const badgeIds = e.detail?.badges || [];
      badgeIds.forEach(id => {
        const info = BADGE_INFO?.[id];
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
  }, [createNotification]);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 w-full shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate rounded-xl flex items-center justify-center shadow-sm shadow-petroleum/15">
          <Icon name="fa-flask-vial" className="text-white text-sm" />
        </div>
        {courseCompleted ? (
          <button
            onClick={() => setShowCertificateModal(true)}
            className="text-lg font-bold text-petroleum dark:text-petroleum tracking-tight truncate hover:text-corporate transition-colors duration-200 flex items-center gap-2 group"
            title={t('ialab.certificate_title')}
          >
            <span>{t('ialab.course_title')}</span>
            <Icon name="fa-award" className="text-[#FFD166] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        ) : (
          <h1 className="text-lg font-bold text-petroleum dark:text-petroleum tracking-tight truncate">{t('ialab.course_title')}</h1>
        )}
      </div>

      {/* Barra de búsqueda global e idioma */}
      <div className="hidden md:flex items-center gap-3">
        <GlobalSearchBar />
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
        <LocaleSwitcher />
      </div>

      <div className="flex items-center gap-4">
        {/* Campana de notificaciones */}
        <div className="relative">
          <button
            ref={notifTriggerRef}
            onClick={() => setNotifOpen(!notifOpen)}
            className={`relative flex items-center justify-center p-2 rounded-xl border bg-white dark:bg-slate-800 transition-all duration-200 group ${
              notifOpen
                ? 'border-petroleum/30 dark:border-petroleum/40 shadow-sm bg-gradient-to-br from-petroleum/5 to-corporate/5'
                : 'border-transparent hover:border-petroleum/20 dark:hover:border-petroleum/40 hover:shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            aria-label={t('ialab.notifications_aria')}
            data-tour="tour-notificaciones"
          >
            <Icon
              name="fa-bell"
              className={`text-lg transition-all duration-200 ${
                notifOpen
                  ? 'text-corporate'
                  : totalUnread > 0
                    ? 'text-petroleum dark:text-corporate'
                    : 'text-corporate group-hover:text-petroleum'
              }`}
            />
            {totalUnread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[11px] font-bold text-white bg-gradient-to-r from-petroleum to-corporate rounded-full border-2 border-white px-1 shadow-sm">
                {totalUnread > 999 ? '999+' : totalUnread}
              </span>
            )}
            {forumUnreadCount > 0 && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 ring-1 ring-white dark:ring-slate-800 shadow-sm" title={`${forumUnreadCount} notificaciones del foro`} />
            )}
          </button>

          <NotificationPanel
            isOpen={notifOpen}
            onClose={() => setNotifOpen(false)}
            triggerRef={notifTriggerRef}
            forumUnreadCount={forumUnreadCount}
          />
        </div>

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
