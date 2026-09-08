const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  getStudentState,
  getNextBestAction,
  generateRecommendations,
  generateDailyPlan,
  generateWeeklyPlan,
} = require('../services/adaptiveLearning');

const router = Router();

/**
 * GET /api/smartboard/recommendations
 * Returns the next best action and top content recommendations for the
 * authenticated student. Powered by adaptiveLearning.js.
 *
 * Response: { nextBestAction, recommendations: [...], studentState: {...} }
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const studentId = req.userId;

    const [state, nextBestAction, recommendations] = await Promise.all([
      getStudentState(studentId),
      getNextBestAction(studentId),
      generateRecommendations(studentId),
    ]);

    res.json({
      studentId,
      nextBestAction,
      recommendations,
      studentState: {
        strengths: state?.strengths ?? [],
        weaknesses: state?.weaknesses ?? [],
        risks: state?.risks ?? [],
        streak: state?.streak ?? 0,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[recommendations] error:', err.message);
    res.status(500).json({ error: 'No se pudieron generar recomendaciones' });
  }
});

/**
 * GET /api/smartboard/recommendations/plan/daily
 * Returns a daily learning plan for the authenticated student.
 */
router.get('/plan/daily', requireAuth, async (req, res) => {
  try {
    const plan = await generateDailyPlan(req.userId);
    res.json({ plan, generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[recommendations/plan/daily] error:', err.message);
    res.status(500).json({ error: 'No se pudo generar el plan diario' });
  }
});

/**
 * GET /api/smartboard/recommendations/plan/weekly
 * Returns a weekly learning plan for the authenticated student.
 */
router.get('/plan/weekly', requireAuth, async (req, res) => {
  try {
    const plan = await generateWeeklyPlan(req.userId);
    res.json({ plan, generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[recommendations/plan/weekly] error:', err.message);
    res.status(500).json({ error: 'No se pudo generar el plan semanal' });
  }
});

module.exports = router;
