import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'ialab_study_reminder';

const DEFAULTS = {
  enabled: false,
  intervalMinutes: 60,
};

function loadReminder() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function persistReminder(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const NOTIFICATION_BODY = {
  en: 'Time to review your AI concepts! Keep your streak alive.',
  es: '¡Hora de repasar tus conceptos de IA! Mantén tu racha activa.',
};

export function useStudyReminder(locale = 'es') {
  const [config, setConfig] = useState(loadReminder);
  const [permission, setPermission] = useState(Notification.permission);
  const intervalRef = useRef(null);
  const lastNotifiedRef = useRef(null);

  useEffect(() => {
    persistReminder(config);
  }, [config]);

  useEffect(() => {
    if (config.enabled && permission === 'granted') {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const cooldown = config.intervalMinutes * 60 * 1000;
        if (!lastNotifiedRef.current || (now - lastNotifiedRef.current) >= cooldown) {
          try {
            const n = new Notification('iLAB Study Reminder', {
              body: NOTIFICATION_BODY[locale] || NOTIFICATION_BODY.es,
              icon: '/favicon.ico',
              tag: 'ialab-study-reminder',
            });
            setTimeout(() => n.close(), 10000);
            lastNotifiedRef.current = now;
          } catch {}
        }
      }, 60000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [config.enabled, config.intervalMinutes, permission, locale]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'denied';
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch {
      return 'denied';
    }
  }, []);

  const toggle = useCallback(() => {
    setConfig(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const setIntervalMinutes = useCallback((minutes) => {
    setConfig(prev => ({ ...prev, intervalMinutes: Math.max(15, Math.min(480, minutes)) }));
  }, []);

  const enable = useCallback(async () => {
    if (permission !== 'granted') {
      const result = await requestPermission();
      if (result !== 'granted') return false;
    }
    setConfig(prev => ({ ...prev, enabled: true }));
    return true;
  }, [permission, requestPermission]);

  const disable = useCallback(() => {
    setConfig(prev => ({ ...prev, enabled: false }));
  }, []);

  return {
    enabled: config.enabled,
    intervalMinutes: config.intervalMinutes,
    permission,
    toggle,
    setIntervalMinutes,
    enable,
    disable,
    requestPermission,
  };
}
