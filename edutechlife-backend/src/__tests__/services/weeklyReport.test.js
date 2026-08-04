const { buildWeeklySummary, renderWeeklyEmail } = require('../../services/weeklyReport');

const NOW = new Date('2026-08-03T12:00:00Z');
const dayAgo = (n) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

describe('buildWeeklySummary', () => {
  it('handles an empty blob without throwing', () => {
    const s = buildWeeklySummary({}, { now: NOW });
    expect(s.pointsThisWeek).toBe(0);
    expect(s.activeDays).toBe(0);
    expect(s.hasActivity).toBe(false);
    expect(s.topSubjects).toEqual([]);
  });

  it('sums only points from the last 7 days', () => {
    const kidData = {
      totalPoints: 500,
      pointsHistory: [
        { points: 50, timestamp: dayAgo(1) }, // in week
        { points: 30, timestamp: dayAgo(3) }, // in week
        { points: 999, timestamp: dayAgo(20) }, // too old
      ],
    };
    const s = buildWeeklySummary(kidData, { now: NOW });
    expect(s.pointsThisWeek).toBe(80);
    expect(s.totalPoints).toBe(500);
    expect(s.hasActivity).toBe(true);
  });

  it('counts distinct active days across points and sessions', () => {
    const kidData = {
      pointsHistory: [
        { points: 10, timestamp: dayAgo(1) },
        { points: 10, timestamp: dayAgo(1) }, // same day -> counts once
      ],
      sessions: [{ start_time: dayAgo(2) }],
    };
    const s = buildWeeklySummary(kidData, { now: NOW });
    expect(s.activeDays).toBe(2);
  });

  it('normalizes streak object and number forms', () => {
    expect(buildWeeklySummary({ streak: 5 }, { now: NOW }).streakCurrent).toBe(5);
    expect(
      buildWeeklySummary({ streak: { current: 9, longest: 12 } }, { now: NOW }).streakCurrent,
    ).toBe(9);
  });

  it('returns top 3 subjects sorted by progress', () => {
    const s = buildWeeklySummary(
      { subjectProgress: { math: 80, art: 20, science: 60, history: 90 } },
      { now: NOW },
    );
    expect(s.topSubjects.map((x) => x.name)).toEqual(['history', 'math', 'science']);
  });
});

describe('renderWeeklyEmail', () => {
  it('produces subject, html and text; escapes student name', () => {
    const summary = buildWeeklySummary(
      { totalPoints: 100, pointsHistory: [{ points: 40, timestamp: dayAgo(1) }] },
      { now: NOW },
    );
    const email = renderWeeklyEmail(summary, { studentName: '<b>Ana</b>' });
    expect(email.subject).toContain('Ana');
    expect(email.html).toContain('&lt;b&gt;Ana&lt;/b&gt;'); // escaped
    expect(email.html).not.toContain('<b>Ana</b>');
    expect(email.text).toContain('Puntos esta semana: 40');
  });

  it('uses the re-engagement subject when there is no activity', () => {
    const summary = buildWeeklySummary({}, { now: NOW });
    const email = renderWeeklyEmail(summary, { studentName: 'Leo' });
    expect(email.subject).toContain('te espera');
  });
});
