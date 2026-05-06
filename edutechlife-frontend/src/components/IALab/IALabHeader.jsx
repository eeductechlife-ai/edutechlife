import React, { useState } from 'react';
import { Bell } from 'lucide-react';
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
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex items-center justify-center p-2 bg-transparent hover:opacity-80 transition-opacity rounded-lg"
            aria-label="Notificaciones"
          >
            <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-[#004B63]' : 'text-[#06B6D4]'}`} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-full border-2 border-white px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
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
