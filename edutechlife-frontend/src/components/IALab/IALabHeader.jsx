import React, { useState, useRef } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import UserDropdownMenuSimplified from '../UserDropdownMenuSimplified';
import NotificationPanel from '../NotificationPanel';
import { useIALabContext } from '../../context/IALabContext';
import { useNotification } from '../../context/NotificationContext';
import { useCourseReminders } from '../../hooks/useCourseReminders';
import { useBrowserNotifications } from '../../hooks/useBrowserNotifications';

const IALabHeader = () => {
  const { onBack, courseCompleted, setShowCertificateModal } = useIALabContext();
  const { unreadCount, createNotification } = useNotification();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifTriggerRef = useRef(null);

  // Activar recordatorios de curso al montar
  useCourseReminders();
  
  // Notificaciones del navegador (push)
  useBrowserNotifications();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 w-full shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-xl flex items-center justify-center shadow-sm shadow-[#004B63]/15">
          <Icon name="fa-flask-vial" className="text-white text-sm" />
        </div>
        {courseCompleted ? (
          <button
            onClick={() => setShowCertificateModal(true)}
            className="text-lg font-bold text-[#004B63] tracking-tight truncate hover:text-[#00BCD4] transition-colors duration-200 flex items-center gap-2 group"
            title="Ver certificado"
          >
            <span>Introducción a la I.A Generativa</span>
            <Icon name="fa-award" className="text-[#FFD166] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        ) : (
          <h1 className="text-lg font-bold text-[#004B63] tracking-tight truncate">Introducción a la I.A Generativa</h1>
        )}
      </div>
      <div className="flex items-center gap-4">
        {/* Campana de notificaciones */}
        <div className="relative">
          <button
            ref={notifTriggerRef}
            onClick={() => setNotifOpen(!notifOpen)}
            className={`relative flex items-center justify-center p-2 rounded-xl border bg-white transition-all duration-200 group ${
              notifOpen
                ? 'border-[#004B63]/30 shadow-sm bg-gradient-to-br from-[#004B63]/5 to-[#00BCD4]/5'
                : 'border-transparent hover:border-[#004B63]/20 hover:shadow-sm hover:bg-slate-50'
            }`}
            aria-label="Notificaciones"
          >
            <Icon
              name="fa-bell"
              className={`text-lg transition-all duration-200 ${
                notifOpen
                  ? 'text-[#00BCD4]'
                  : unreadCount > 0
                    ? 'text-[#004B63]'
                    : 'text-[#00BCD4] group-hover:text-[#004B63]'
              }`}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-full border-2 border-white px-1 shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationPanel
            isOpen={notifOpen}
            onClose={() => setNotifOpen(false)}
            triggerRef={notifTriggerRef}
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
