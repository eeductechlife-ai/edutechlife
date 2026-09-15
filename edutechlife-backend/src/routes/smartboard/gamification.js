const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { requireStudentAccess } = require('../../middleware/ownership');
const { getStudentMissions, recordActivity } = require('../../services/missionEngine');
const { checkAndUnlockBadges, getStudentBadges } = require('../../services/badgeEngine');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY,
);

const router = Router();

// GET /api/smartboard/gamification/missions?studentId=uuid
router.get('/gamification/missions', requireAuth, requireStudentAccess, async (req, res) => {
  const { studentId } = req.query;
  if (!studentId) return res.status(400).json({ error: 'studentId requerido' });
  try {
    const missions = await getStudentMissions(studentId);
    res.json({ missions });
  } catch (e) {
    console.error('[MissionEngine]', e.message);
    res.status(500).json({ error: 'Error obteniendo misiones' });
  }
});

// POST /api/smartboard/gamification/activity
// Body: { studentId, activityType, meta? }
router.post('/gamification/activity', requireAuth, requireStudentAccess, async (req, res) => {
  const { studentId, activityType, meta = {} } = req.body;
  if (!studentId || !activityType) return res.status(400).json({ error: 'studentId y activityType requeridos' });
  try {
    await recordActivity(studentId, activityType, meta);
    const newBadges = await checkAndUnlockBadges(studentId);
    res.json({ ok: true, newBadges });
  } catch (e) {
    console.error('[Gamification Activity]', e.message);
    res.status(500).json({ error: 'Error registrando actividad' });
  }
});

// GET /api/smartboard/gamification/badges?studentId=uuid
router.get('/gamification/badges', requireAuth, requireStudentAccess, async (req, res) => {
  const { studentId } = req.query;
  if (!studentId) return res.status(400).json({ error: 'studentId requerido' });
  try {
    const badges = await getStudentBadges(studentId);
    res.json({ badges });
  } catch (e) {
    console.error('[BadgeEngine]', e.message);
    res.status(500).json({ error: 'Error obteniendo badges' });
  }
});

// GET /api/smartboard/league/current
// Returns the student's league ranking for the current week.
router.get('/league/current', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    // Resolve student id from auth_id
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('auth_id', userId)
      .maybeSingle();
    const studentId = student?.id || userId;

    // Current ISO week start (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay() || 7; // Sunday = 7
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek + 1);
    weekStart.setHours(0, 0, 0, 0);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const { data } = await supabase
      .from('league_rankings')
      .select('league_tier, week_start, week_end, xp_earned, rank')
      .eq('user_id', studentId)
      .eq('week_start', weekStartStr)
      .maybeSingle();

    res.json(data || { league_tier: 'bronze', week_start: weekStartStr, xp_earned: 0, rank: null });
  } catch (e) {
    console.error('[League]', e.message);
    res.status(500).json({ error: 'Error obteniendo liga' });
  }
});

module.exports = router;
