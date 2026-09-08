/**
 * Admin Routes
 * All routes are protected by requireAdmin middleware
 */

const express = require('express');
const { requireAdmin } = require('../middleware/adminAuth');
const supabase = require('../db/supabase');

const router = express.Router();

/**
 * GET /api/admin/auth/me
 * Returns current authenticated admin user info
 */
router.get('/auth/me', requireAdmin, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
    isAdmin: req.user.role === 'admin',
    isContentCreator: req.user.role === 'content_creator',
  });
});

/**
 * GET /api/admin/users?page=1&perPage=50&search=email@example.com
 *
 * Lists users with server-side pagination. Uses Supabase admin.listUsers
 * which paginates correctly above 1 000 registrations (issue #9).
 * Optional `search` param filters by email substring on the DB side.
 *
 * Response: { users: [...], total: number, page: number, perPage: number, hasMore: boolean }
 */
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const perPage = Math.min(100, Math.max(1, parseInt(req.query.perPage) || 50));
    const search = (req.query.search || '').trim().toLowerCase();

    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
      ...(search ? { filter: search } : {}),
    });

    if (error) {
      console.error('[admin/users] listUsers error:', error.message);
      return res.status(500).json({ error: 'Failed to list users' });
    }

    const users = (data?.users || []).map((u) => ({
      id: u.id,
      email: u.email,
      role: u.app_metadata?.role || null,
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at,
      emailConfirmed: !!u.email_confirmed_at,
    }));

    res.json({
      users,
      total: data?.total ?? users.length,
      page,
      perPage,
      hasMore: users.length === perPage,
    });
  } catch (err) {
    console.error('[admin/users] unexpected error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/admin/users/:userId/role
 * Body: { role: 'admin' | 'content_creator' | null }
 * Sets app_metadata.role for a user.
 */
router.patch('/users/:userId/role', requireAdmin, async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const VALID_ROLES = ['admin', 'content_creator', null];
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Invalid role. Allowed: ${VALID_ROLES.filter(Boolean).join(', ')} or null` });
  }

  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role: role ?? undefined },
    });

    if (error) {
      console.error('[admin/users/role] updateUserById error:', error.message);
      return res.status(500).json({ error: 'Failed to update user role' });
    }

    res.json({
      id: data.user.id,
      email: data.user.email,
      role: data.user.app_metadata?.role || null,
    });
  } catch (err) {
    console.error('[admin/users/role] unexpected error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/admin/analytics/students
 * Aggregated performance metrics across all students.
 * Returns top-level stats: total students, avg mastery, at-risk count.
 */
router.get('/analytics/students', requireAdmin, async (req, res) => {
  try {
    const { data: students, error: sErr } = await supabase
      .from('students')
      .select('id, grade', { count: 'exact' });

    if (sErr) return res.status(500).json({ error: 'Failed to fetch students' });

    const { data: mastery } = await supabase
      .from('student_competency_mastery')
      .select('mastery_level');

    const levels = (mastery || []).map((r) => Number(r.mastery_level) || 0);
    const avgMastery = levels.length ? levels.reduce((a, b) => a + b, 0) / levels.length : 0;
    const atRisk = levels.filter((l) => l < 0.4).length;

    res.json({
      totalStudents: students?.length ?? 0,
      avgMastery: Math.round(avgMastery * 100) / 100,
      atRiskCount: atRisk,
      dataPoints: levels.length,
    });
  } catch (err) {
    console.error('[admin/analytics/students] error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/admin/analytics/smartboard
 * Institutional SmartBoard metrics for Valeria Analytics (Fase 4.3).
 * Aggregates sessions + academic_context + crisis_alerts + learning_streaks.
 *
 * Query params:
 *   days (int, default 30) — rolling window for trend calculations
 *
 * Response:
 *   overview: { totalSessions, activeLast7Days, avgSessionMinutes, atRiskCount }
 *   subjectPerformance: [{ subject, avgScore, sessionCount, performanceLevels }]
 *   dailySessions: [{ date, count, totalMinutes }]  — last `days` days
 *   streakDistribution: { noStreak, short, medium, long }
 *   achievementRate: { earned, possible, rate }
 */
router.get('/analytics/smartboard', requireAdmin, async (req, res) => {
  try {
    const days = Math.min(90, Math.max(7, parseInt(req.query.days) || 30));
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const since7d = new Date(Date.now() - 7 * 86400000).toISOString();

    const [
      { data: sessions },
      { data: academic },
      { data: crisisAlerts },
      { data: streaks },
      { data: achievements },
    ] = await Promise.all([
      supabase.from('sessions').select('student_id, start_time, duration_minutes, subject').gte('start_time', since),
      supabase.from('academic_context').select('student_id, subject, average_score, performance_level'),
      supabase.from('crisis_alerts').select('student_id, crisis_level').eq('alert_sent', false),
      supabase.from('learning_streaks').select('student_id, current_streak'),
      supabase.from('student_achievements').select('student_id, earned_at').gte('earned_at', since),
    ]);

    const sessionList = sessions || [];
    const academicList = academic || [];
    const crisisList = crisisAlerts || [];
    const streakList = streaks || [];
    const achievementList = achievements || [];

    // Active students in last 7 days
    const activeStudentIds = new Set(
      sessionList.filter((s) => s.start_time >= since7d).map((s) => s.student_id)
    );

    // Overview
    const totalMinutes = sessionList.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const overview = {
      totalSessions: sessionList.length,
      activeLast7Days: activeStudentIds.size,
      avgSessionMinutes: sessionList.length ? Math.round(totalMinutes / sessionList.length) : 0,
      atRiskCount: crisisList.length,
      totalMinutes,
    };

    // Subject performance from academic_context
    const bySubject = {};
    for (const row of academicList) {
      if (!row.subject) continue;
      if (!bySubject[row.subject]) bySubject[row.subject] = { scores: [], levels: {}, sessions: 0 };
      bySubject[row.subject].scores.push(row.average_score || 0);
      const lvl = row.performance_level || 'unknown';
      bySubject[row.subject].levels[lvl] = (bySubject[row.subject].levels[lvl] || 0) + 1;
    }
    for (const s of sessionList) {
      if (s.subject && bySubject[s.subject]) bySubject[s.subject].sessions++;
    }
    const subjectPerformance = Object.entries(bySubject).map(([subject, data]) => ({
      subject,
      avgScore: data.scores.length ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length) : 0,
      sessionCount: data.sessions,
      performanceLevels: data.levels,
    })).sort((a, b) => b.sessionCount - a.sessionCount);

    // Daily sessions grouped by date
    const dailyMap = {};
    for (const s of sessionList) {
      const date = s.start_time ? s.start_time.slice(0, 10) : null;
      if (!date) continue;
      if (!dailyMap[date]) dailyMap[date] = { count: 0, totalMinutes: 0 };
      dailyMap[date].count++;
      dailyMap[date].totalMinutes += s.duration_minutes || 0;
    }
    const dailySessions = Object.entries(dailyMap)
      .map(([date, d]) => ({ date, count: d.count, totalMinutes: d.totalMinutes }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Streak distribution
    const streakDistribution = { noStreak: 0, short: 0, medium: 0, long: 0 };
    for (const s of streakList) {
      const streak = s.current_streak || 0;
      if (streak === 0) streakDistribution.noStreak++;
      else if (streak <= 3) streakDistribution.short++;
      else if (streak <= 14) streakDistribution.medium++;
      else streakDistribution.long++;
    }

    // Achievement rate
    const uniqueEarners = new Set(achievementList.map((a) => a.student_id)).size;
    const achievementRate = {
      totalEarned: achievementList.length,
      uniqueStudents: uniqueEarners,
      avgPerActiveStudent: activeStudentIds.size
        ? Math.round((achievementList.length / activeStudentIds.size) * 10) / 10
        : 0,
    };

    res.json({
      overview,
      subjectPerformance,
      dailySessions,
      streakDistribution,
      achievementRate,
      meta: { days, since, generatedAt: new Date().toISOString() },
    });
  } catch (err) {
    console.error('[admin/analytics/smartboard] error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/admin/health
 * Backend health for admin dashboard: uptime, memory, DB connectivity.
 */
router.get('/health', requireAdmin, async (req, res) => {
  const start = Date.now();
  let dbOk = false;
  let dbLatencyMs = null;

  try {
    const t0 = Date.now();
    const { error } = await supabase.from('users').select('id').limit(1);
    dbLatencyMs = Date.now() - t0;
    dbOk = !error;
  } catch { /* db unreachable */ }

  const mem = process.memoryUsage();
  res.json({
    status: dbOk ? 'ok' : 'degraded',
    uptimeSeconds: Math.floor(process.uptime()),
    dbLatencyMs,
    dbOk,
    responseMs: Date.now() - start,
    memory: {
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
    },
  });
});

/**
 * GET /api/admin/educator/students
 * Per-student performance data for the educator dashboard.
 * Joins sessions + academic_context + learning_streaks + crisis_alerts.
 * Returns one row per student with engagement + progress metrics.
 */
router.get('/educator/students', requireAdmin, async (req, res) => {
  try {
    // Fetch all students with their latest session and academic context
    const { data: students, error: sErr } = await supabase
      .from('students')
      .select('id, name, grade, email, created_at')
      .order('name');

    if (sErr) return res.status(500).json({ error: 'Failed to fetch students' });
    if (!students?.length) return res.json({ students: [], summary: {} });

    const studentIds = students.map((s) => s.id);

    // Fetch latest session per student (most recent activity)
    const { data: sessions } = await supabase
      .from('sessions')
      .select('student_id, start_time, end_time, duration_minutes, subject')
      .in('student_id', studentIds)
      .order('start_time', { ascending: false });

    // Fetch academic context (performance per subject)
    const { data: academicCtx } = await supabase
      .from('academic_context')
      .select('student_id, subject, average_score, performance_level, lessons_completed')
      .in('student_id', studentIds);

    // Fetch learning streaks
    const { data: streaks } = await supabase
      .from('learning_streaks')
      .select('student_id, current_streak, longest_streak')
      .in('student_id', studentIds);

    // Fetch unresolved crisis alerts (at-risk flag)
    const { data: crisisAlerts } = await supabase
      .from('crisis_alerts')
      .select('student_id, crisis_level')
      .in('student_id', studentIds)
      .eq('alert_sent', false);

    // Build per-student aggregated metrics
    const enriched = students.map((student) => {
      const studentSessions = (sessions || []).filter((s) => s.student_id === student.id);
      const studentCtx = (academicCtx || []).filter((a) => a.student_id === student.id);
      const studentStreak = (streaks || []).find((s) => s.student_id === student.id);
      const studentCrisis = (crisisAlerts || []).filter((c) => c.student_id === student.id);

      const latestSession = studentSessions[0] || null;
      const totalMinutes = studentSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
      const avgScore = studentCtx.length
        ? studentCtx.reduce((sum, c) => sum + (c.average_score || 0), 0) / studentCtx.length
        : 0;

      const subjectBreakdown = studentCtx.map((c) => ({
        subject: c.subject,
        average_score: c.average_score,
        performance_level: c.performance_level,
        lessons_completed: c.lessons_completed,
      }));

      // Progress % based on average score across all subjects
      const progress = Math.round(avgScore);

      return {
        id: student.id,
        name: student.name,
        grade: student.grade || 'Sin grado',
        email: student.email,
        streak: studentStreak?.current_streak || 0,
        progress,
        totalMinutes,
        totalSessions: studentSessions.length,
        lastActive: latestSession?.start_time || null,
        subjects: subjectBreakdown,
        needsAttention: studentCrisis.length > 0 || progress < 50,
        atRiskLevel: studentCrisis.length > 0
          ? studentCrisis[0].crisis_level || 'medium'
          : null,
      };
    });

    // Class-level summary
    const summary = {
      totalStudents: enriched.length,
      activeStudents: enriched.filter((s) => s.totalSessions > 0).length,
      averageProgress: enriched.length
        ? Math.round(enriched.reduce((sum, s) => sum + s.progress, 0) / enriched.length)
        : 0,
      needingAttention: enriched.filter((s) => s.needsAttention).length,
    };

    res.json({ students: enriched, summary });
  } catch (err) {
    console.error('[admin/educator/students] error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
