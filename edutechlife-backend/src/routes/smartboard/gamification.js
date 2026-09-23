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

// ── League XP writer ───────────────────────────────────────────────────────────

const XP_BY_ACTIVITY = {
  complete_mission: 50,
  mission_completed: 50,
  flashcard_session: 30,
  flashcard_completed: 30,
  oral_exam: 40,
  oral_exam_completed: 40,
  challenge: 60,
  challenge_completed: 60,
  vak_diagnostic: 25,
  diagnostic_completed: 25,
  view_content: 10,
  content_completed: 10,
  dani_message: 5,
  dani_chat: 5,
};

function getISOWeekStart() {
  const now = new Date();
  const day = now.getDay() || 7;
  const d = new Date(now);
  d.setDate(now.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

function getISOWeekEnd() {
  const now = new Date();
  const day = now.getDay() || 7;
  const d = new Date(now);
  d.setDate(now.getDate() - day + 7);
  d.setHours(23, 59, 59, 999);
  return d.toISOString().split('T')[0];
}

async function updateLeagueXP(studentId, activityType) {
  const xp = XP_BY_ACTIVITY[activityType?.toLowerCase()] || 10;
  const weekStart = getISOWeekStart();
  const weekEnd = getISOWeekEnd();

  const { data: existing } = await supabase
    .from('league_rankings')
    .select('id, xp_earned')
    .eq('user_id', studentId)
    .eq('week_start', weekStart)
    .maybeSingle();

  if (existing) {
    const newXP = (existing.xp_earned || 0) + xp;
    const tier = xpToTier(newXP);
    await supabase
      .from('league_rankings')
      .update({ xp_earned: newXP, league_tier: tier, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  } else {
    await supabase.from('league_rankings').insert({
      user_id: studentId,
      week_start: weekStart,
      week_end: weekEnd,
      xp_earned: xp,
      league_tier: 'bronze',
    });
  }

  // Recompute ranks for this week (approximate — counts rows with more XP + 1)
  const { count } = await supabase
    .from('league_rankings')
    .select('id', { count: 'exact', head: true })
    .eq('week_start', weekStart)
    .gt('xp_earned', (existing?.xp_earned || 0) + xp);

  const rank = (count || 0) + 1;
  await supabase
    .from('league_rankings')
    .update({ rank })
    .eq('user_id', studentId)
    .eq('week_start', weekStart);
}

function xpToTier(xp) {
  if (xp >= 1500) return 'diamond';
  if (xp >= 700) return 'gold';
  if (xp >= 300) return 'silver';
  return 'bronze';
}

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
    updateLeagueXP(studentId, activityType).catch((err) =>
      console.error('[LeagueXP]', err.message),
    );
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
