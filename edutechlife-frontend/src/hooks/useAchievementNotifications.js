import { useEffect, useCallback, useState } from 'react';
import { useTranslation } from '../i18n/I18nProvider';
import { BADGE_INFO } from '../data/ialab';

const NOTIFICATION_DURATION = 4000;

export function useAchievementNotifications(store) {
  const { t } = useTranslation();
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, description, icon) => {
    const id = Date.now() + Math.random();
    setToasts(prev => {
      const next = [...prev, { id, type, title, description, icon }];
      return next.slice(-3);
    });
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, NOTIFICATION_DURATION);
  }, []);

  useEffect(() => {
    if (!store) return;
    let prevXp = store.getState().xp;
    let prevStreak = store.getState().streak;
    let prevBadgesCount = store.getState().badges.length;

    const unsub = store.subscribe((state) => {
      if (state.xp > prevXp + 50) {
        const level = state.getLevel();
        addToast('level_up', t('achievement.level_up_title', { level }), t('achievement.level_up_desc', { level }), 'fa-arrow-up');
      }
      prevXp = state.xp;

      if (state.badges.length > prevBadgesCount) {
        const diff = state.badges.slice(prevBadgesCount - state.badges.length);
        diff.forEach(id => {
          const info = BADGE_INFO[id];
          addToast('badge', t('achievement.new_badge'), info ? info.label : id, 'fa-trophy');
        });
      }
      prevBadgesCount = state.badges.length;

      if (state.streak > prevStreak && [3, 7, 14, 30].includes(state.streak)) {
        addToast('streak', t('achievement.streak_title', { count: state.streak }), t('achievement.streak_desc'), 'fa-fire');
      }
      prevStreak = state.streak;
    });

    return unsub;
  }, [store, addToast]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, removeToast };
}
