import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import useForumNotifications from '../../../hooks/IALab/forum/useForumNotifications';
import { useTranslation } from '../../../i18n/I18nProvider';

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2);
};

const formatRelativeTime = (dateString, t, locale) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  if (diffMins < 1) return t('ialab.forum.notifications.now');
  if (diffMins < 60) return t('ialab.forum.notifications.min_ago', { mins: diffMins });
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return t('ialab.forum.notifications.hour_ago', { hours: diffHours });
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return t('ialab.forum.notifications.day_ago', { days: diffDays });
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'short' });
};

const NOTIFICATION_ICONS = {
  reply: { icon: 'fa-reply', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  like: { icon: 'fa-heart', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  mention: { icon: 'fa-at', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  system: { icon: 'fa-bell', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  answer: { icon: 'fa-check-circle', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
};

const getNotificationLabel = (type, t) => {
  const labels = {
    reply: t('ialab.forum.notifications.label_reply'),
    like: t('ialab.forum.notifications.label_like'),
    mention: t('ialab.forum.notifications.label_mention'),
    system: t('ialab.forum.notifications.label_system'),
    answer: t('ialab.forum.notifications.label_answer'),
  };
  return labels[type] || t('ialab.forum.notifications.fallback');
};

const IALabForumNotifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useForumNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const { t, locale } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && !triggerRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-petroleum/30 transition-all"
        aria-label={t('ialab.forum.notifications.aria')}
      >
        <Icon name="fa-bell" className={`text-sm transition-colors ${unreadCount > 0 ? 'text-petroleum' : 'text-slate-600'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] text-[8px] font-bold text-white bg-gradient-to-r from-petroleum to-corporate rounded-full border-2 border-white dark:border-slate-800 px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-700">
              <h4 className="text-sm font-bold text-petroleum">{t('ialab.forum.notifications.title')}</h4>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] text-corporate hover:text-petroleum font-medium transition-colors"
                >
                  {t('ialab.forum.notifications.mark_all_read')}
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-2">
                    <Icon name="fa-bell-slash" className="text-slate-600" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('ialab.forum.notifications.empty')}</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {notifications.map((notif) => {
                    const style = NOTIFICATION_ICONS[notif.type] || NOTIFICATION_ICONS.system;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                          !notif.is_read ? 'bg-petroleum/[0.02] dark:bg-petroleum/[0.04]' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon name={style.icon} className={`text-xs ${style.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                            <span className="font-semibold text-slate-800 dark:text-slate-100">
                              {getNotificationLabel(notif.type, t)}
                            </span>
                            {notif.title && `: ${notif.title}`}
                          </p>
                          <span className="text-[10px] text-slate-600">
                            {formatRelativeTime(notif.created_at, t, locale)}
                          </span>
                        </div>
                        {!notif.is_read && (
                          <div className="w-2 h-2 rounded-full bg-corporate flex-shrink-0 mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IALabForumNotifications;
