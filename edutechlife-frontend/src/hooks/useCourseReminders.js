import { useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/react';
import { useNotification } from '../context/NotificationContext';
import { useProgressContext } from '../context/ProgressContext';

const MODULE_NAMES = {
  1: 'Ingenieria de Prompts',
  2: 'Potencia ChatGPT',
  3: 'Rastreo Profundo',
  4: 'Inmersion NotebookLM',
  5: 'Proyecto Disruptivo',
};

const REMINDER_DAYS = 2;
const STORAGE_KEY = 'ialab_last_reminder_check';
const LAST_NOTIFIED_ABSENCE = 'ialab_last_notified_absence';
const NOTIFIED_EXAMS_KEY = 'ialab_notified_exams';

export const useCourseReminders = () => {
  const { user } = useUser();
  const { createNotification } = useNotification();
  const { completedModules, completedExams, courseProgress } = useProgressContext();
  const hasCheckedRef = useRef(false);

  const getNextModule = useCallback((completedMods) => {
    return [1, 2, 3, 4, 5].find(m => !completedMods.includes(m));
  }, []);

  const getLastViewedTopic = useCallback(() => {
    try {
      const raw = localStorage.getItem('ialab_last_viewed_topic');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const checkInactivity = useCallback(async () => {
    if (!user?.id) return;

    const now = new Date();
    const lastCheck = localStorage.getItem(STORAGE_KEY);
    
    if (lastCheck) {
      const hoursSinceCheck = (now - new Date(lastCheck)) / (1000 * 60 * 60);
      if (hoursSinceCheck < 24) return;
    }

    if (completedModules.length >= 5) return;

    const lastActivity = localStorage.getItem('ialab_last_activity_date');
    if (!lastActivity) {
      localStorage.setItem('ialab_last_activity_date', now.toISOString());
      return;
    }

    const daysSince = (now - new Date(lastActivity)) / (1000 * 60 * 60 * 24);
    if (daysSince < REMINDER_DAYS) return;

    const daysFloor = Math.floor(daysSince);
    const lastNotifiedDays = parseInt(localStorage.getItem(LAST_NOTIFIED_ABSENCE) || '0');

    if (daysFloor <= lastNotifiedDays) return;

    const nextModule = getNextModule(completedModules);
    if (!nextModule) return;

    const moduleName = MODULE_NAMES[nextModule] || `Modulo ${nextModule}`;
    const lastTopic = getLastViewedTopic();

    let title, message;

    const topicContext = lastTopic
      ? `Tu ultima clase fue: "${lastTopic.resourceTitle}" en ${lastTopic.moduleName}.`
      : '';

    if (daysFloor >= 7) {
      title = '¡Te extranamos!';
      message = `Han pasado ${daysFloor} dias sin estudiar. ${topicContext} ${moduleName} te esta esperando. ¡Vuelve y continua tu progreso!`;
    } else if (daysFloor >= 4) {
      title = '¡No te pierdas!';
      message = `${daysFloor} dias sin avanzar. ${topicContext} Retoma ${moduleName} y sigue aprendiendo.`;
    } else {
      title = '¡Vuelve a aprender!';
      message = `${daysFloor} dias sin estudiar. ${topicContext} Continua con: ${moduleName}`;
    }

    await createNotification({
      type: 'lesson_reminder',
      title,
      message,
      metadata: { moduleId: nextModule, daysInactive: daysFloor },
    });

    localStorage.setItem(LAST_NOTIFIED_ABSENCE, daysFloor.toString());
    localStorage.setItem(STORAGE_KEY, now.toISOString());
  }, [user?.id, completedModules, createNotification, getNextModule, getLastViewedTopic]);

  const checkPendingExams = useCallback(async () => {
    if (!user?.id) return;

    const now = new Date();
    const lastCheck = localStorage.getItem(STORAGE_KEY);
    if (lastCheck) {
      const hoursSinceCheck = (now - new Date(lastCheck)) / (1000 * 60 * 60);
      if (hoursSinceCheck < 24) return;
    }

    const notifiedExamsStr = localStorage.getItem(NOTIFIED_EXAMS_KEY) || '[]';
    let notifiedExams;
    try {
      notifiedExams = JSON.parse(notifiedExamsStr);
    } catch {
      notifiedExams = [];
    }

    const incompleteExams = [1, 2, 3, 4, 5].filter(m => {
      const examScore = completedExams[m];
      const isApproved = typeof examScore === 'number' ? examScore >= 80 : !!examScore;
      return !isApproved && m <= completedModules.length + 1;
    });

    for (const modId of incompleteExams) {
      if (notifiedExams.includes(modId)) continue;

      const moduleName = MODULE_NAMES[modId] || `Modulo ${modId}`;

      await createNotification({
        type: 'exam_reminder',
        title: 'Desafio pendiente',
        message: `Tienes el desafio de ${moduleName} sin completar. ¡No lo dejes para despues!`,
        metadata: { moduleId: modId },
      });

      notifiedExams.push(modId);
    }

    if (notifiedExams.length > 0) {
      localStorage.setItem(NOTIFIED_EXAMS_KEY, JSON.stringify(notifiedExams));
    }
  }, [user?.id, completedModules, completedExams, createNotification]);

  useEffect(() => {
    if (!user?.id || hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    checkInactivity();
    checkPendingExams();
  }, [user?.id, checkInactivity, checkPendingExams]);

  useEffect(() => {
    if (!user?.id || !hasCheckedRef.current) return;

    const timer = setTimeout(() => {
      checkInactivity();
    }, 5000);

    return () => clearTimeout(timer);
  }, [courseProgress, completedModules, user?.id, checkInactivity]);

  return { checkInactivity, checkPendingExams };
};
