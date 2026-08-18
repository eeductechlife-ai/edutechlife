const { Router } = require('express');
const { requireAuth, requireVerifiedParentalConsent } = require('../middleware/auth');
const predictionService = require('../services/predictionService');

const router = Router();

/**
 * GET /api/predictions/risk-score/:userId
 * Get risk score for a student (parent or student view)
 */
router.get('/risk-score/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Students can see their own risk score
    // Parents can see their linked students' risk scores (check via parent_student_links)
    if (req.userId !== userId) {
      // TODO: Verify parent-student link
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const riskScore = await predictionService.getStudentRiskScore(userId);
    res.json(riskScore);
  } catch (e) {
    console.error('Error fetching risk score:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/predictions/alerts
 * Get all alerts for authenticated parent
 */
router.get('/alerts', requireAuth, async (req, res) => {
  try {
    const parentId = req.userId;
    const { status, limit, offset } = req.query;

    const alerts = await predictionService.getParentAlerts(parentId, {
      status: status || 'unread',
      limit: parseInt(limit) || 50,
      offset: parseInt(offset) || 0,
    });

    res.json({
      alerts,
      count: alerts.length,
    });
  } catch (e) {
    console.error('Error fetching parent alerts:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/predictions/alerts/:studentId
 * Get alerts for a specific student
 */
router.get('/alerts/:studentId', requireAuth, async (req, res) => {
  try {
    const parentId = req.userId;
    const { studentId } = req.params;
    const { limit = 20 } = req.query;

    // TODO: Verify parent-student link
    const alerts = await predictionService.getStudentAlerts(
      parentId,
      studentId,
      parseInt(limit) || 20
    );

    res.json({ alerts, count: alerts.length });
  } catch (e) {
    console.error('Error fetching student alerts:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * POST /api/predictions/alerts
 * Create a new alert (parent action)
 */
router.post('/alerts', requireAuth, async (req, res) => {
  try {
    const parentId = req.userId;
    const { studentId, type, severity, title, message, recommendation } = req.body || {};

    if (!studentId || !type || !title || !message) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: studentId, type, title, message',
      });
    }

    // TODO: Verify parent-student link
    const alert = await predictionService.createAlert(parentId, studentId, {
      type,
      severity: severity || 'medium',
      title,
      message,
      recommendation,
    });

    res.status(201).json({ alert });
  } catch (e) {
    console.error('Error creating alert:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * PUT /api/predictions/alerts/:alertId/read
 * Mark an alert as read
 */
router.put('/alerts/:alertId/read', requireAuth, async (req, res) => {
  try {
    const parentId = req.userId;
    const { alertId } = req.params;

    const alert = await predictionService.markAlertAsRead(alertId, parentId);
    res.json({ alert, success: true });
  } catch (e) {
    console.error('Error marking alert as read:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * POST /api/predictions/alerts/:alertId/action
 * Record an action taken on an alert
 */
router.post('/alerts/:alertId/action', requireAuth, async (req, res) => {
  try {
    const parentId = req.userId;
    const { alertId } = req.params;
    const { actionType, description } = req.body || {};

    if (!actionType) {
      return res.status(400).json({ error: 'actionType es requerido' });
    }

    const action = await predictionService.recordAlertAction(
      alertId,
      parentId,
      actionType,
      description
    );

    res.json({ action, success: true });
  } catch (e) {
    console.error('Error recording alert action:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/predictions/learning-gaps/:studentId
 * Get learning gap predictions for a student
 */
router.get('/learning-gaps/:studentId', requireAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 10 } = req.query;

    // Verify access (student or parent)
    if (req.userId !== studentId) {
      // TODO: Verify parent-student link
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const gaps = await predictionService.getLearningGaps(
      studentId,
      parseInt(limit) || 10
    );

    res.json({ gaps, count: gaps.length });
  } catch (e) {
    console.error('Error fetching learning gaps:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * POST /api/predictions/learning-gaps/:studentId
 * Create or update a learning gap prediction
 */
router.post('/learning-gaps/:studentId', requireAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subject, gapType, confidence, resource, priority } = req.body || {};

    if (req.userId !== studentId) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    if (!subject || !gapType) {
      return res.status(400).json({ error: 'subject y gapType son requeridos' });
    }

    const gap = await predictionService.createLearningGap(studentId, subject, {
      gapType,
      confidence: confidence || 75,
      resource,
      priority: priority || 'medium',
    });

    res.status(201).json({ gap });
  } catch (e) {
    console.error('Error creating learning gap:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/predictions/dashboard
 * Get parent dashboard summary
 */
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const parentId = req.userId;
    const summary = await predictionService.getParentDashboardSummary(parentId);
    res.json(summary);
  } catch (e) {
    console.error('Error fetching dashboard summary:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/predictions/alert-suggestions/:studentId
 * Get suggested alerts for a student (based on risk scores)
 */
router.get('/alert-suggestions/:studentId', requireAuth, async (req, res) => {
  try {
    const { studentId } = req.params;

    // Verify access
    if (req.userId !== studentId) {
      // TODO: Verify parent-student link
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const suggestions = await predictionService.getAlertSuggestions(studentId);
    res.json({ suggestions, count: suggestions.length });
  } catch (e) {
    console.error('Error fetching alert suggestions:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
