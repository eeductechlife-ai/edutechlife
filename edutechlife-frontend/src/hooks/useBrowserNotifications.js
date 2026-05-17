import { useEffect, useRef, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';

const STORAGE_KEY = 'ialab_browser_notif_permission';
const LAST_NOTIFIED_KEY = 'ialab_last_browser_notif_id';
const PERMISSION_REQUESTED_KEY = 'ialab_push_permission_requested';

const NOTIFICATION_ICONS = {
  certificate_earned: '/favicon.ico',
  module_complete: '/favicon.ico',
  course_update: '/favicon.ico',
  lesson_reminder: '/favicon.ico',
  exam_reminder: '/favicon.ico',
  general: '/favicon.ico',
};

const IMPORTANT_TYPES = ['module_complete', 'certificate_earned'];

export const useBrowserNotifications = () => {
  const { notifications } = useNotification();
  const notifiedIdsRef = useRef(new Set());
  const permissionRequestedRef = useRef(false);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('[BROWSER_NOTIF] Notificaciones no soportadas en este navegador');
      return false;
    }

    if (Notification.permission === 'granted') {
      localStorage.setItem(STORAGE_KEY, 'granted');
      localStorage.setItem(PERMISSION_REQUESTED_KEY, 'true');
      permissionRequestedRef.current = true;
      return true;
    }

    if (Notification.permission === 'denied') {
      localStorage.setItem(STORAGE_KEY, 'denied');
      localStorage.setItem(PERMISSION_REQUESTED_KEY, 'true');
      permissionRequestedRef.current = true;
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      localStorage.setItem(STORAGE_KEY, permission);
      localStorage.setItem(PERMISSION_REQUESTED_KEY, 'true');
      permissionRequestedRef.current = true;
      return permission === 'granted';
    } catch (err) {
      console.error('[BROWSER_NOTIF] Error solicitando permiso:', err);
      return false;
    }
  }, []);

  const sendBrowserNotification = useCallback((title, body, options = {}) => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      const notification = new Notification(title, {
        body,
        icon: options.icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: options.tag || `ialab_${Date.now()}`,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        data: options.data || {},
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.onClick) options.onClick();
      };

      setTimeout(() => notification.close(), 8000);
    } catch (err) {
      console.error('[BROWSER_NOTIF] Error enviando:', err);
    }
  }, []);

  // Solicitar permiso solo cuando llega una notificacion importante
  useEffect(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') return;

    const alreadyRequested = localStorage.getItem(PERMISSION_REQUESTED_KEY);
    if (alreadyRequested === 'true') return;
    if (permissionRequestedRef.current) return;

    if (notifications.length === 0) return;

    const hasImportant = notifications.some(n => IMPORTANT_TYPES.includes(n.type) && !n.is_read);
    if (!hasImportant) return;

    permissionRequestedRef.current = true;
    requestPermission();
  }, [notifications, requestPermission]);

  // Enviar push cuando llega una nueva notificacion no leida
  useEffect(() => {
    if (notifications.length === 0) return;

    const latest = notifications[0];
    if (latest.is_read) return;
    if (notifiedIdsRef.current.has(latest.id)) return;

    const lastNotifiedId = localStorage.getItem(LAST_NOTIFIED_KEY);
    if (lastNotifiedId === latest.id) return;

    sendBrowserNotification(latest.title, latest.message, {
      icon: NOTIFICATION_ICONS[latest.type] || '/favicon.ico',
      tag: `notif_${latest.id}`,
      data: { type: latest.type, id: latest.id },
      onClick: () => {
        window.focus();
      },
    });

    notifiedIdsRef.current.add(latest.id);
    localStorage.setItem(LAST_NOTIFIED_KEY, latest.id);

    if (notifiedIdsRef.current.size > 100) {
      notifiedIdsRef.current.clear();
    }
  }, [notifications, sendBrowserNotification]);

  return {
    requestPermission,
    sendBrowserNotification,
    permission: typeof Notification !== 'undefined' ? Notification.permission : 'unknown',
    supported: 'Notification' in window,
  };
};

export default useBrowserNotifications;
