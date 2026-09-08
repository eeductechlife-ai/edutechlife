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
