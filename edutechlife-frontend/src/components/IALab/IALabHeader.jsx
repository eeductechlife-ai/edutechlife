import React, { useState, useRef } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import UserDropdownMenuSimplified from '../UserDropdownMenuSimplified';
import NotificationPanel from '../NotificationPanel';
import { useIALabContext } from '../../context/IALabContext';
import { useNotification } from '../../context/NotificationContext';
import { useCourseReminders } from '../../hooks/useCourseReminders';
import { useBrowserNotifications } from '../../hooks/useBrowserNotifications';
import useForumNotifications from '../../hooks/IALab/forum/useForumNotifications';
import GlobalSearchBar from './GlobalSearchBar';

const IALabHeader = () => {
  const { onBack, courseCompleted, setShowCertificateModal } = useIALabContext();
  const { unreadCount, createNotification } = useNotification();
  const { unreadCount: forumUnreadCount } = useForumNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifTriggerRef = useRef(null);
  const totalUnread = unreadCount + forumUnreadCount;

  // Activar recordatorios de curso al montar
  useCourseReminders();
  
  // Notificaciones del navegador (push)
  useBrowserNotifications();

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
            title="Ver certificado"
          >
            <span>Introducción a la I.A Generativa</span>
            <Icon name="fa-award" className="text-[#FFD166] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        ) : (
          <h1 className="text-lg font-bold text-petroleum dark:text-petroleum tracking-tight truncate">Introducción a la I.A Generativa</h1>
        )}
      </div>

      {/* Barra de búsqueda global */}
      <div className="hidden md:block">
        <GlobalSearchBar />
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
            aria-label="Notificaciones"
            data-tour="tour-notificaciones"
          >
            <Icon
              name="fa-bell"
              className={`text-lg transition-all duration-200 ${
                notifOpen
                  ? 'text-corporate'
                  : totalUnread > 0
                    ? 'text-petroleum dark:text-[#66CCCC]'
                    : 'text-corporate group-hover:text-petroleum'
              }`}
            />
            {totalUnread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-gradient-to-r from-petroleum to-corporate rounded-full border-2 border-white px-1 shadow-sm">
                {totalUnread > 99 ? '99+' : totalUnread}
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

export default IALabHeader;
