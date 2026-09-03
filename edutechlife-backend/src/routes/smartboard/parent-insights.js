const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { requireVerifiedParentalConsent } = require('../../middleware/parentalConsent');
const { requireStudentAccess } = require('../../middleware/ownership');
const { generateParentInsights, buildLearningGraphSummary } = require('../../services/parentInsights');

const router = Router();

/**
 * GET /api/smartboard/parent/insights?studentId=uuid
 * Returns 3-5 actionable insights for the parent from the Learning Graph.
 */
router.get('/parent/insights', requireAuth, requireStudentAccess, requireVerifiedParentalConsent, async (req, res) => {
  const { studentId } = req.query;
  if (!studentId) return res.status(400).json({ error: 'studentId requerido' });
  try {
    const insights = await generateParentInsights(studentId);
    res.json({ insights });
  } catch (e) {
    console.error('[Parent Insights]', e.message);
    res.status(500).json({ error: 'Error generando insights' });
  }
});

/**
 * GET /api/smartboard/parent/learning-graph?studentId=uuid
 * Returns mastery-by-subject summary for parent dashboard.
 */
router.get('/parent/learning-graph', requireAuth, requireStudentAccess, requireVerifiedParentalConsent, async (req, res) => {
  const { studentId } = req.query;
  if (!studentId) return res.status(400).json({ error: 'studentId requerido' });
  try {
    const summary = await buildLearningGraphSummary(studentId);
    res.json({ summary });
  } catch (e) {
    console.error('[Learning Graph Summary]', e.message);
    res.status(500).json({ error: 'Error generando resumen' });
  }
});

module.exports = router;
