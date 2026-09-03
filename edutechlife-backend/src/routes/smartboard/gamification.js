const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { requireStudentAccess } = require('../../middleware/ownership');
const { getStudentMissions, recordActivity } = require('../../services/missionEngine');
const { checkAndUnlockBadges, getStudentBadges } = require('../../services/badgeEngine');

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

module.exports = router;
