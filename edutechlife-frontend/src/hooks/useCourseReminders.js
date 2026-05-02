import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/react';
import { useNotification } from '../context/NotificationContext';
import { supabase } from '../lib/supabase';

const MODULE_NAMES = {
  1: 'Fundamentos de IA',
  2: 'Prompt Engineering',
  3: 'Herramientas de IA',
  4: 'Ética y Seguridad',
  5: 'Proyecto Final',
};

const REMINDER_DAYS = 3;
const STORAGE_KEY = 'ialab_last_reminder_check';

export const useCourseReminders = () => {
  const { user } = useUser();
  const { createNotification } = useNotification();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (!user?.id || hasCheckedRef.current) return;

    checkReminders();
  }, [user?.id]);

  const checkReminders = async () => {
    if (!user?.id) return;

    const lastCheck = localStorage.getItem(STORAGE_KEY);
    const now = new Date();

    if (lastCheck) {
      const lastCheckDate = new Date(lastCheck);
      const hoursSince = (now - lastCheckDate) / (1000 * 60 * 60);
      if (hoursSince < 24) return;
    }

    try {
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('module_id, activity_type, is_completed, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const completedLessons = (progress || []).filter((p) => p.is_completed);
      const incompleteLessons = (progress || []).filter((p) => !p.is_completed);

      if (completedLessons.length === 0 && incompleteLessons.length === 0) return;

      const lastCompleted = completedLessons[0];
      if (lastCompleted?.completed_at) {
        const daysSinceLastActivity = (now - new Date(lastCompleted.completed_at)) / (1000 * 60 * 60 * 24);

        if (daysSinceLastActivity >= REMINDER_DAYS && incompleteLessons.length > 0) {
          const nextLesson = incompleteLessons[0];
          const moduleName = MODULE_NAMES[nextLesson.module_id] || `Módulo ${nextLesson.module_id}`;

          await createNotification({
            type: 'lesson_reminder',
            title: '¡Sigue aprendiendo!',
            message: `Llevas ${Math.floor(daysSinceLastActivity)} días sin estudiar. Continúa con: ${moduleName}`,
            metadata: { moduleId: nextLesson.module_id, daysInactive: Math.floor(daysSinceLastActivity) },
          });
        }
      }

      const pendingExams = (progress || []).filter(
        (p) => p.content_type === 'exam' && !p.is_completed
      );

      if (pendingExams.length > 0) {
        const examModule = pendingExams[0];
        const moduleName = MODULE_NAMES[examModule.module_id] || `Módulo ${examModule.module_id}`;

        await createNotification({
          type: 'exam_reminder',
          title: 'Examen pendiente',
          message: `Tienes el examen de ${moduleName} sin completar. ¡No lo dejes para después!`,
          metadata: { moduleId: examModule.module_id },
        });
      }
    } catch (err) {
      console.error('Error checking course reminders:', err.message);
    } finally {
      localStorage.setItem(STORAGE_KEY, now.toISOString());
      hasCheckedRef.current = true;
    }
  };

  return { checkReminders };
};
