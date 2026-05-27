/**
 * gamificationSlice — XP, streak, badges, levels, activity tracking
 *
 * Estado: xp, streak, lastActivityDate, startDate, badges,
 *         forumPostCount, forumCommentCount
 *
 * Cross-slice calls:
 *   - persistGamificationState() (persistenceSlice) — en addXp, recordActivity, awardBadge
 *   - get().lessonProgress y get().completedModules — en checkAndAwardBadges
 *
 * Side effects: localStorage persist via persistGamificationState(),
 *   window.dispatchEvent('ialab:badgesAwarded')
 */
import { LS_KEYS } from '@/constants/ialab';
import { ls } from '@/utils/ialab';
import { BADGE_INFO } from '@/data/ialab';

export const createGamificationSlice = (set, get) => ({
  xp: 0,
  streak: 0,
  lastActivityDate: null,
  startDate: (() => {
    const stored = ls.get(LS_KEYS.START_DATE);
    if (stored) return stored;
    const now = new Date().toISOString();
    try { localStorage.setItem(LS_KEYS.START_DATE, JSON.stringify(now)); } catch {}
    return now;
  })(),
  badges: [],
  badgesDates: {},
  forumPostCount: 0,
  forumCommentCount: 0,

  addXp: (amount) => {
    const safe = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;
    set((state) => ({ xp: state.xp + safe }));
    get().persistGamificationState();
  },

  recordActivity: () => {
    const { lastActivityDate, streak } = get();
    const now = new Date();
    const todayDateStr = now.toDateString();
    const lastDateStr = lastActivityDate ? new Date(lastActivityDate).toDateString() : null;
    if (lastDateStr === todayDateStr) {
      set({ lastActivityDate: now.toISOString() });
      get().persistGamificationState();
      return true;
    }
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = lastDateStr === yesterday ? streak + 1 : 1;
    set({ streak: newStreak, lastActivityDate: now.toISOString() });
    get().persistGamificationState();
    if (newStreak === 3) get().addXp(50);
    if (newStreak === 7) get().addXp(100);
    if (newStreak === 30) get().addXp(500);
    get().checkAndAwardBadges();
    return true;
  },

  isStreakAtRisk: () => {
    const { lastActivityDate } = get();
    if (!lastActivityDate) return true;
    const todayStr = new Date().toDateString();
    return new Date(lastActivityDate).toDateString() !== todayStr;
  },

  getDaysSinceStart: () => {
    const start = get().startDate;
    if (!start) return 1;
    const diff = Date.now() - new Date(start).getTime();
    return Math.max(1, Math.floor(diff / 86400000));
  },

  awardBadge: (badgeId) => {
    const state = get();
    if (state.badges.includes(badgeId)) return state;
    const now = new Date().toISOString();
    set({
      badges: [...state.badges, badgeId],
      badgesDates: { ...state.badgesDates, [badgeId]: now },
    });
    get().persistGamificationState();
  },

  checkAndAwardBadges: () => {
    const state = get();
    const totalLessonsCompleted = Object.values(state.lessonProgress)
      .reduce((sum, mod) => sum + Object.values(mod).filter(s => s === 'completed').length, 0);
    const totalModulesCompleted = state.completedModules.length;
    const newBadges = [];

    if (totalLessonsCompleted >= 1 && !state.badges.includes('first_lesson')) newBadges.push('first_lesson');
    if (totalLessonsCompleted >= 5 && !state.badges.includes('five_lessons')) newBadges.push('five_lessons');
    if (totalLessonsCompleted >= 15 && !state.badges.includes('all_lessons')) newBadges.push('all_lessons');
    if (state.streak >= 3 && !state.badges.includes('streak_3')) newBadges.push('streak_3');
    if (state.streak >= 7 && !state.badges.includes('streak_7')) newBadges.push('streak_7');
    if (totalModulesCompleted >= 1 && !state.badges.includes('first_module')) newBadges.push('first_module');
    if (totalModulesCompleted >= 3 && !state.badges.includes('three_modules')) newBadges.push('three_modules');
    if (totalModulesCompleted >= 5 && !state.badges.includes('all_modules')) newBadges.push('all_modules');

    if (newBadges.length > 0) {
      const now = new Date().toISOString();
      const newDates = {};
      newBadges.forEach(id => { newDates[id] = now; });
      set({
        badges: [...state.badges, ...newBadges],
        badgesDates: { ...state.badgesDates, ...newDates },
      });
      get().persistGamificationState();
      window.dispatchEvent(new CustomEvent('ialab:badgesAwarded', { detail: { badges: newBadges } }));
    }
  },

  getLevel: () => Math.floor(Math.sqrt(get().xp / 100)) + 1,

  getXpForNextLevel: () => {
    const level = get().getLevel();
    return level * level * 100;
  },

  getLevelProgress: () => {
    const xp = get().xp;
    const level = get().getLevel();
    if (level <= 1) return (xp / 100) * 100;
    const currentLevelXp = (level - 1) * (level - 1) * 100;
    const nextLevelXp = level * level * 100;
    return ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  },

  getUserBadges: () => {
    const state = get();
    return state.badges.map(id => {
      const info = BADGE_INFO[id];
      return info ? { id, ...info, dateEarned: state.badgesDates[id] || null } : null;
    }).filter(Boolean);
  },

  getBadgesSummary: () => {
    const state = get();
    return {
      total: Object.keys(BADGE_INFO).length,
      earned: state.badges.length,
      recent: state.badges.slice(-3).reverse().map(id => {
        const info = BADGE_INFO[id];
        return info ? { id, ...info, dateEarned: state.badgesDates[id] || null } : null;
      }).filter(Boolean),
    };
  },
});
