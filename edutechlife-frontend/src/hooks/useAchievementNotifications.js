import { useEffect, useCallback, useState, useRef } from 'react';
import { useTranslation } from '../i18n/I18nProvider';
import { useSoundEffects } from './IALab/useSoundEffects';
import { BADGE_INFO } from '../data/ialab';

const NOTIFICATION_DURATION = 4000;

export function useAchievementNotifications(store) {
  const { t } = useTranslation();
  const { playSound } = useSoundEffects();
  const [toasts, setToasts] = useState([]);
  const lastNotifiedLevelRef = useRef(null);

  const addToast = useCallback((type, title, description, icon) => {
    const id = Date.now() + Math.random();
    playSound('achievement');
    setToasts(prev => {
      if (prev.some(t => t.type === type && t.title === title)) return prev;
      const next = [...prev, { id, type, title, description, icon }];
      return next.slice(-3);
    });
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, NOTIFICATION_DURATION);
  }, [playSound]);

  useEffect(() => {
    if (!store) return;
    let prevLevel = store.getState().getLevel();
    let prevStreak = store.getState().streak;
    let prevBadgesCount = store.getState().badges.length;

    const unsub = store.subscribe((state) => {
      const newLevel = state.getLevel();
      if (newLevel > prevLevel && lastNotifiedLevelRef.current !== newLevel) {
        lastNotifiedLevelRef.current = newLevel;
        addToast('level_up', t('achievement.level_up_title', { level: newLevel }), t('achievement.level_up_desc', { level: newLevel }), 'fa-arrow-up');
      }
      prevLevel = newLevel;

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
