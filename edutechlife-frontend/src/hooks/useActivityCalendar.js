import { useMemo } from 'react';

export function useActivityCalendar(calendarYear) {
  return useMemo(() => {
    const sessions = JSON.parse(localStorage.getItem('ialab_session_log') || '[]');
    const map = {};
    sessions.forEach(s => {
      const d = new Date(s.completed_at).toDateString();
      map[d] = (map[d] || 0) + (s.duration_seconds || 0);
    });
    const weeks = [];
    const startDate = new Date(calendarYear, 0, 1);
    const endDate = new Date(calendarYear, 11, 31);
    let cursor = new Date(startDate);
    while (cursor <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dStr = cursor.toDateString();
        const secs = map[dStr] || 0;
        week.push({ date: new Date(cursor), mins: Math.round(secs / 60), level: secs === 0 ? 0 : secs < 300 ? 1 : secs < 900 ? 2 : secs < 1800 ? 3 : 4 });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }
    const totalActive = Object.keys(map).filter(d => new Date(d) <= new Date()).length;
    const currentStreak = (() => {
      let streak = 0;
      const d = new Date();
      while (map[d.toDateString()]) { streak++; d.setDate(d.getDate() - 1); }
      return streak;
    })();
    return { weeks, totalActive, currentStreak, totalSessions: sessions.length };
  }, [calendarYear]);
}
