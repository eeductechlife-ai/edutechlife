const { Router } = require('express');
const supabase = require('../../db/supabase');
const { requireAuth } = require('../../middleware/auth');
const { requireVerifiedParentalConsent } = require('../../middleware/parentalConsent');
const { requireStudentAccess, assertStudentAccess } = require('../../middleware/ownership');
const {
  getStudentState,
  generateRecommendations,
  recommendContent,
  getNextBestAction,
  generateDailyPlan,
  generateWeeklyPlan,
  saveLearningPlan,
} = require('../../services/adaptiveLearning');
const {
  updateCompetencyMastery,
  batchUpdateMastery,
  getStudentMastery,
  getCompetencyIdsForSubject,
} = require('../../services/competencyMastery');
const { runAllDetectors, resolveWarning } = require('../../services/earlyWarning');

const router = Router();

// GET /api/smartboard/adaptive/state?studentId=uuid
router.get('/adaptive/state', requireAuth, requireStudentAccess, async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) return res.status(400).json({ error: 'studentId required' });
    const state = await getStudentState(studentId);
    res.json({ state });
  } catch (e) {
    console.error('[Adaptive state]', e.message);
    res.status(500).json({ error: 'Error getting student state' });
  }
});

// GET /api/smartboard/adaptive/next-action?studentId=uuid
router.get('/adaptive/next-action', requireAuth, requireStudentAccess, async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) return res.status(400).json({ error: 'studentId required' });
    const state = await getStudentState(studentId);
    res.json({ action: getNextBestAction(state), recommendations: generateRecommendations(state) });
  } catch (e) {
    console.error('[Adaptive next-action]', e.message);
    res.status(500).json({ error: 'Error getting next action' });
  }
});

// POST /api/smartboard/adaptive/daily-plan
// Body: { studentId, availableMinutes }
router.post('/adaptive/daily-plan', requireAuth, requireStudentAccess, async (req, res) => {
  try {
    const { studentId, availableMinutes } = req.body;
    if (!studentId) return res.status(400).json({ error: 'studentId required' });
    const mins = Math.min(Math.max(parseInt(availableMinutes, 10) || 20, 5), 60);
    const state = await getStudentState(studentId);
    const plan = generateDailyPlan(state, mins);
    await saveLearningPlan(studentId, plan, 'daily');
    res.json({ plan });
  } catch (e) {
    console.error('[Adaptive daily-plan]', e.message);
    res.status(500).json({ error: 'Error generating daily plan' });
  }
});

// POST /api/smartboard/adaptive/weekly-plan
// Body: { studentId, availableMinutesPerDay }
router.post('/adaptive/weekly-plan', requireAuth, requireStudentAccess, async (req, res) => {
  try {
    const { studentId, availableMinutesPerDay } = req.body;
    if (!studentId) return res.status(400).json({ error: 'studentId required' });
    const mins = Math.min(Math.max(parseInt(availableMinutesPerDay, 10) || 30, 10), 120);
    const state = await getStudentState(studentId);
    const plan = generateWeeklyPlan(state, mins);
    await saveLearningPlan(studentId, plan, 'weekly');
    res.json({ plan });
  } catch (e) {
    console.error('[Adaptive weekly-plan]', e.message);
    res.status(500).json({ error: 'Error generating weekly plan' });
  }
});

router.post('/adaptive/recommendations', requireAuth, requireStudentAccess, async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) return res.status(400).json({ error: 'studentId required' });
    const state = await getStudentState(studentId);
    const { recommendations, persisted } = await recommendContent(studentId, state);
    res.json({ recommendations, persisted });
  } catch (e) {
    console.error('[Adaptive recommendations]', e.message);
    res.status(500).json({ error: 'Error generating recommendations' });
  }
});

// GET /api/smartboard/adaptive/mastery?subject=matematicas
router.get('/adaptive/mastery', requireAuth, requireStudentAccess, async (req, res) => {
  try {
    const { studentId, subject } = req.query;
    if (!studentId) return res.status(400).json({ error: 'studentId required' });
    const records = await getStudentMastery(studentId, subject || undefined);
    res.json({ mastery: records });
  } catch (e) {
    console.error('[Mastery GET]', e.message);
    res.status(500).json({ error: 'Error retrieving mastery data' });
  }
});

// POST /api/smartboard/adaptive/mastery
// Body: { studentId, competencyId, score } OR { studentId, entries: [{competencyId, score}] }
router.post('/adaptive/mastery', requireAuth, requireStudentAccess, requireVerifiedParentalConsent, async (req, res) => {
  try {
    const { studentId, competencyId, score, entries } = req.body;
    if (!studentId) return res.status(400).json({ error: 'studentId required' });

    if (Array.isArray(entries)) {
      if (entries.length === 0) return res.status(400).json({ error: 'entries array empty' });
      if (entries.length > 20) return res.status(400).json({ error: 'max 20 entries per request' });
      const results = await batchUpdateMastery(studentId, entries);
      return res.json({ results });
    }

    if (!competencyId || score === undefined) {
      return res.status(400).json({ error: 'competencyId and score required' });
    }
    if (typeof score !== 'number' || score < 0 || score > 1) {
      return res.status(400).json({ error: 'score must be a number between 0 and 1' });
    }

    const result = await updateCompetencyMastery(studentId, competencyId, score);
    res.json(result);
  } catch (e) {
    console.error('[Mastery POST]', e.message);
    res.status(500).json({ error: 'Error updating mastery' });
  }
});

/**
 * GET /api/smartboard/adaptive/warnings?studentId=uuid
 * Runs all 4 detectors and returns active (unresolved) warnings.
 */
router.get('/adaptive/warnings', requireAuth, requireStudentAccess, requireVerifiedParentalConsent, async (req, res) => {
  const { studentId } = req.query;
  if (!studentId) return res.status(400).json({ error: 'studentId requerido' });
  try {
    const warnings = await runAllDetectors(studentId);
    res.json({ warnings });
  } catch (e) {
    console.error('[EarlyWarning]', e.message);
    res.status(500).json({ error: 'Error ejecutando detectores' });
  }
});

/**
 * POST /api/smartboard/adaptive/warnings/:id/resolve
 * Mark a warning as resolved.
 */
router.post('/adaptive/warnings/:id/resolve', requireAuth, async (req, res) => {
  try {
    const { data: warning } = await supabase
      .from('early_warnings')
      .select('student_id')
      .eq('id', req.params.id)
      .maybeSingle();
    if (!warning) return res.status(404).json({ error: 'Alerta no encontrada' });

    const result = await assertStudentAccess(req, warning.student_id);
    if (!result.ok) {
      if (result.status === 404) return res.status(404).json({ error: 'Estudiante no encontrado' });
      (req.log || console).warn('[access-denied]', {
        requestId: req.id, userId: req.userId, resource: `warning:${req.params.id}`, reason: result.reason,
      });
      return res.status(403).json({ error: 'No autorizado para esta alerta' });
    }

    await resolveWarning(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Error resolviendo alerta' });
  }
});

// GET /api/smartboard/competencies?subject=matematicas&grade=7
router.get('/competencies', requireAuth, async (req, res) => {
  try {
    const { subject, grade } = req.query;
    if (!subject || !grade) return res.status(400).json({ error: 'subject and grade required' });
    const ids = getCompetencyIdsForSubject(subject, parseInt(grade, 10));
    res.json({ competencyIds: ids });
  } catch (e) {
    res.status(500).json({ error: 'Error getting competencies' });
  }
});

module.exports = router;
