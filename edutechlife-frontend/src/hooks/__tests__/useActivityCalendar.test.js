import { renderHook } from '@testing-library/react';
import { useActivityCalendar } from '../useActivityCalendar';

function makeSession(year, month, day, secs) {
  return { completed_at: new Date(year, month, day).toISOString(), duration_seconds: secs };
}

beforeEach(() => localStorage.clear());

describe('useActivityCalendar', () => {
  test('returns empty weeks for year with no sessions', () => {
    const { result } = renderHook(() => useActivityCalendar(2025, 0));
    expect(result.current.weeks.length).toBeGreaterThanOrEqual(4);
    expect(result.current.totalSessions).toBe(0);
    expect(result.current.totalActive).toBe(0);
    expect(result.current.currentStreak).toBe(0);
  });

  test('returns all sessions when month is undefined', () => {
    localStorage.setItem('ialab_session_log', JSON.stringify([
      makeSession(2025, 0, 5, 600),
      makeSession(2025, 1, 10, 300),
    ]));
    const { result } = renderHook(() => useActivityCalendar(2025, undefined));
    expect(result.current.totalSessions).toBe(2);
  });

  test('filters sessions to specific month', () => {
    localStorage.setItem('ialab_session_log', JSON.stringify([
      makeSession(2025, 0, 5, 600),
      makeSession(2025, 1, 10, 300),
    ]));
    const { result } = renderHook(() => useActivityCalendar(2025, 0));
    expect(result.current.totalSessions).toBe(2);
    expect(result.current.totalActive).toBe(1);
  });

  test('computes activity levels correctly', () => {
    localStorage.setItem('ialab_session_log', JSON.stringify([
      makeSession(2025, 0, 1, 0),
      makeSession(2025, 0, 2, 120),
      makeSession(2025, 0, 3, 600),
      makeSession(2025, 0, 4, 1200),
      makeSession(2025, 0, 5, 3600),
    ]));
    const { result } = renderHook(() => useActivityCalendar(2025, 0));
    const allDays = result.current.weeks.flat();
    expect(allDays.find(d => d.date.getDate() === 1)?.level).toBe(0);
    expect(allDays.find(d => d.date.getDate() === 2)?.level).toBe(1);
    expect(allDays.find(d => d.date.getDate() === 3)?.level).toBe(2);
    expect(allDays.find(d => d.date.getDate() === 4)?.level).toBe(3);
    expect(allDays.find(d => d.date.getDate() === 5)?.level).toBe(4);
  });

  test('computes minutes from seconds', () => {
    localStorage.setItem('ialab_session_log', JSON.stringify([
      makeSession(2025, 0, 1, 150),
    ]));
    const { result } = renderHook(() => useActivityCalendar(2025, 0));
    const day = result.current.weeks.flat().find(d => d.date.getDate() === 1);
    expect(day?.mins).toBe(3);
  });

  test('aggregates multiple sessions on same day', () => {
    localStorage.setItem('ialab_session_log', JSON.stringify([
      makeSession(2025, 0, 1, 600),
      makeSession(2025, 0, 1, 300),
    ]));
    const { result } = renderHook(() => useActivityCalendar(2025, 0));
    const day = result.current.weeks.flat().find(d => d.date.getDate() === 1);
    expect(day?.mins).toBe(15);
    expect(day?.level).toBe(3);
  });

  test('totalActive counts only days with activity', () => {
    localStorage.setItem('ialab_session_log', JSON.stringify([
      makeSession(2025, 0, 1, 600),
      makeSession(2025, 0, 15, 300),
    ]));
    const { result } = renderHook(() => useActivityCalendar(2025, 0));
    expect(result.current.totalActive).toBe(2);
  });

  test('currentStreak is 0 with no recent activity', () => {
    localStorage.setItem('ialab_session_log', JSON.stringify([
      makeSession(2020, 0, 1, 600),
    ]));
    const { result } = renderHook(() => useActivityCalendar(2025, undefined));
    expect(result.current.currentStreak).toBe(0);
  });

  test('returns 0 totalSessions with empty localStorage', () => {
    const { result } = renderHook(() => useActivityCalendar(2025, 0));
    expect(result.current.totalSessions).toBe(0);
    expect(result.current.weeks.length).toBeGreaterThan(0);
  });

  test('weeks array contains 7 days per week', () => {
    localStorage.setItem('ialab_session_log', JSON.stringify([
      makeSession(2025, 0, 1, 600),
    ]));
    const { result } = renderHook(() => useActivityCalendar(2025, 0));
    result.current.weeks.forEach(week => {
      expect(week.length).toBe(7);
    });
  });

  test('day objects have correct structure', () => {
    localStorage.setItem('ialab_session_log', JSON.stringify([
      makeSession(2025, 0, 1, 600),
    ]));
    const { result } = renderHook(() => useActivityCalendar(2025, 0));
    const day = result.current.weeks.flat()[0];
    expect(day).toHaveProperty('date');
    expect(day).toHaveProperty('mins');
    expect(day).toHaveProperty('level');
    expect(day.date).toBeInstanceOf(Date);
  });
});
