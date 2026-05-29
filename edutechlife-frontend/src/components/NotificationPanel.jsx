import React, { useRef, useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useTranslation } from '../i18n/I18nProvider';
import { Icon } from '../utils/iconMapping.jsx';

const NOTIFICATION_CONFIG = {
  lesson_reminder: { icon: 'fa-book', color: '#004B63' },
  exam_reminder: { icon: 'fa-file-alt', color: '#00BCD4' },
  module_complete: { icon: 'fa-check-circle', color: '#004B63' },
  certificate_earned: { icon: 'fa-award', color: '#004B63' },
  course_update: { icon: 'fa-info-circle', color: '#00BCD4' },
  general: { icon: 'fa-bell', color: '#00BCD4' },
};

const TYPE_LABEL_KEYS = {
  lesson_reminder: 'notification.type_lesson_reminder',
  exam_reminder: 'notification.type_exam_reminder',
  module_complete: 'notification.type_module_complete',
  certificate_earned: 'notification.type_certificate_earned',
  course_update: 'notification.type_course_update',
  general: 'notification.type_general',
};

const getIconColorClass = (color) => {
  return color === '#004B63' ? 'text-[#004B63]' : 'text-[#00BCD4]';
};

const getBadgeBgClass = (color) => {
  return color === '#004B63'
    ? 'from-[#004B63]/10 to-[#00BCD4]/10'
    : 'from-[#00BCD4]/10 to-[#00BCD4]/20';
};

const formatTimeAgo = (date, t, locale) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 1) return t('notification.time_just_now');
  if (diffMin < 60) return t('notification.time_ago_min', { count: diffMin });
  if (diffHrs < 24) return t('notification.time_ago_h', { count: diffHrs });
  if (diffDays < 7) return t('notification.time_ago_d', { count: diffDays });
  return then.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-CO', { day: 'numeric', month: 'short' });
};

const NotificationPanel = ({ isOpen, onClose, triggerRef, forumUnreadCount = 0 }) => {
  const { t, locale } = useTranslation();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, dismissNotification, clearAllNotifications } = useNotification();
  const panelRef = useRef(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (!panelRef.current) return;

      const isInsidePanel = panelRef.current.contains(e.target);
      const isTriggerClick = triggerRef?.current && triggerRef.current.contains(e.target);

      if (!isInsidePanel && !isTriggerClick) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#004B63] to-[#00BCD4] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="fa-bell" className="text-white text-sm" />
            <h3 className="text-white font-bold text-sm">{t('notification.panel_title')}</h3>
            {unreadCount > 0 && (
              <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {t('notification.unread_count', { count: unreadCount })}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10" aria-label={t('notification.close_aria')}>
            <Icon name="fa-xmark" className="text-sm" />
          </button>
        </div>

        {/* Acciones rápidas */}
        {unreadCount > 0 && (
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-[10px] font-semibold text-[#004B63] hover:text-[#00BCD4] transition-colors px-2 py-1 rounded-md hover:bg-[#004B63]/5"
            >
              <Icon name="fa-check-double" className="text-[10px]" />
              {t('notification.mark_all_read')}
            </button>
            {notificationCount > 0 && (
              <button
                onClick={handleClearAll}
                className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors px-2 py-1 rounded-md ${
                  confirmClear
                    ? 'text-white bg-rose-500 hover:bg-rose-600'
                    : 'text-rose-500 hover:text-rose-600 hover:bg-rose-50'
                }`}
              >
                <Icon name="fa-trash-can" className="text-[10px]" />
                {confirmClear ? t('notification.confirm_clear') : t('notification.clear_all')}
              </button>
            )}
          </div>
        )}

        {/* Lista de notificaciones */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-8 h-8 rounded-full border-2 border-[#004B63] border-t-transparent animate-spin mb-3" />
              <p className="text-xs text-slate-500">{t('notification.loading')}</p>
            </div>
          ) : notificationCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center mb-3">
                <Icon name="fa-bell" className="text-[#004B63] text-lg" />
              </div>
              <p className="text-sm font-semibold text-slate-600">{t('notification.empty_title')}</p>
              <p className="text-xs text-slate-400 text-center mt-1">
                {t('notification.empty_desc')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => {
                const config = NOTIFICATION_CONFIG[notif.type] || NOTIFICATION_CONFIG.general;
                return (
                  <div
                    key={notif.id}
                    className={`relative group px-4 py-3 transition-colors hover:bg-slate-50/50 ${!notif.is_read ? 'bg-[#004B63]/[0.02]' : ''}`}
                  >
                    <div className="flex gap-3">
                      {/* Icono - Single color IALab */}
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getBadgeBgClass(config.color)} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon name={config.icon} className={`text-sm ${getIconColorClass(config.color)}`} />
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-tight ${!notif.is_read ? 'font-bold text-slate-800' : 'font-medium text-slate-700'}`}>
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                              {notif.message}
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all flex-shrink-0 rounded-md hover:bg-rose-50"
                            aria-label={t('notification.delete_aria')}
                          >
                            <Icon name="fa-xmark" className="text-xs" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-slate-400">{formatTimeAgo(notif.created_at, t, locale)}</span>
                          {!notif.is_read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00BCD4]" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botón para marcar como leída */}
                    {!notif.is_read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="absolute inset-0 z-10"
                        aria-label={t('notification.mark_read_aria')}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Enlace a notificaciones del foro */}
          {forumUnreadCount > 0 && (
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('ialab:switchTab', { detail: 'comunidad' }));
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-petroleum/[0.03] to-corporate/[0.03] border-t border-slate-200/60 text-xs font-medium text-petroleum hover:from-petroleum/[0.06] hover:to-corporate/[0.06] transition-colors"
            >
              <Icon name="fa-comments" className="text-corporate text-xs" />
              <span>
                {t('notification.forum_count', { count: forumUnreadCount })}
              </span>
              <Icon name="fa-arrow-right" className="text-corporate text-[10px] ml-auto" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;