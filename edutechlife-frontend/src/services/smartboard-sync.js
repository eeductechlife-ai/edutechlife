/**
 * SmartBoard Data Sync Layer
 *
 * Abstracts data persistence behind a unified interface.
 * Currently uses localStorage; swap implementations to use Supabase/API
 * by replacing the storage functions below without changing callers.
 */

const PREFIX = 'edutechlife';

const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

export const createSyncAdapter = (userId = 'student') => ({
  points: {
    get: () => parseInt(localStorage.getItem(`${PREFIX}_points_${userId}`) || '0', 10),
    set: (points) => storage.set(`${PREFIX}_points_${userId}`, points),
  },
  pointsHistory: {
    get: () => storage.get(`${PREFIX}_points_history_${userId}`) || [],
    set: (history) => storage.set(`${PREFIX}_points_history_${userId}`, history),
  },
  vakResult: {
    get: () => storage.get(`${PREFIX}_vak_${userId}`),
    set: (result) => storage.set(`${PREFIX}_vak_${userId}`, result),
  },
  calendar: {
    get: () => storage.get(`${PREFIX}_calendar_${userId}`) || [],
    set: (events) => storage.set(`${PREFIX}_calendar_${userId}`, events),
  },
  rewards: {
    get: () => storage.get(`${PREFIX}_rewards_${userId}`) || [],
    set: (rewards) => storage.set(`${PREFIX}_rewards_${userId}`, rewards),
  },
  sessions: {
    get: () => storage.get(`${PREFIX}_sessions_${userId}`) || [],
    set: (sessions) => storage.set(`${PREFIX}_sessions_${userId}`, sessions),
  },
  streak: {
    get: () => storage.get(`${PREFIX}_streak_${userId}`) || { current: 0, longest: 0, lastActive: null },
    set: (streak) => storage.set(`${PREFIX}_streak_${userId}`, streak),
  },
  subjectTime: {
    get: () => storage.get(`${PREFIX}_subject_time_${userId}`) || {},
    set: (time) => storage.set(`${PREFIX}_subject_time_${userId}`, time),
  },
  minutes: {
    get: () => parseInt(localStorage.getItem(`${PREFIX}_minutes_${userId}`) || '0', 10),
    set: (minutes) => storage.set(`${PREFIX}_minutes_${userId}`, minutes),
  },
  missions: {
    get: () => storage.get(`${PREFIX}_missions`) || [],
    set: (missions) => storage.set(`${PREFIX}_missions`, missions),
  },
  subjects: {
    get: () => storage.get(`${PREFIX}_subjects`) || [],
    set: (subjects) => storage.set(`${PREFIX}_subjects`, subjects),
  },
  activities: {
    get: () => storage.get(`${PREFIX}_activities_${userId}`) || [],
    set: (activities) => storage.set(`${PREFIX}_activities_${userId}`, activities),
  },
  daniChat: {
    get: () => storage.get(`${PREFIX}_dani_chat_${userId}`) || [],
    set: (chat) => storage.set(`${PREFIX}_dani_chat_${userId}`, chat),
  },
  readNews: {
    get: () => storage.get(`${PREFIX}_read_news_${userId}`) || [],
    set: (ids) => storage.set(`${PREFIX}_read_news_${userId}`, ids),
  },
  planCompleted: {
    get: () => storage.get(`${PREFIX}_plan_completed`) || [],
    set: (ids) => storage.set(`${PREFIX}_plan_completed`, ids),
  },
  darkMode: {
    get: () => localStorage.getItem(`${PREFIX}_dark_mode_${userId}`) === 'true',
    set: (value) => storage.set(`${PREFIX}_dark_mode_${userId}`, value),
  },
  avatarAnimado: {
    get: () => localStorage.getItem(`${PREFIX}_avatar_animado_${userId}`) === 'true',
    set: (value) => storage.set(`${PREFIX}_avatar_animado_${userId}`, value),
  },
  fondoGalaxia: {
    get: () => localStorage.getItem(`${PREFIX}_fondo_galaxia_${userId}`) === 'true',
    set: (value) => storage.set(`${PREFIX}_fondo_galaxia_${userId}`, value),
  },
  clear: () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(`${PREFIX}_`));
    keys.forEach(k => localStorage.removeItem(k));
  },
});
