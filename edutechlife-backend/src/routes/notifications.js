/**
 * Notifications API Routes
 * Handles parent notification endpoints
 * POST /api/notifications/send-crisis-alert - Manually trigger crisis alert notification
 * GET /api/notifications/history - Fetch parent's notification history
 * GET /api/notifications/preferences - Fetch parent preferences
 * POST /api/notifications/preferences - Update parent preferences
 */

const { Router } = require('express');
const { createClient } = require('@supabase/supabase-js');
const { requireAuth } = require('../middleware/auth');
const notificationService = require('../services/NotificationService');

const router = Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
);

/**
 * POST /api/notifications/send-crisis-alert
 * Manually trigger a crisis alert notification for a parent
 * Admin-only endpoint (for testing or manual triggers)
 *
 * @swagger
 * /api/notifications/send-crisis-alert:
 *   post:
 *     summary: Enviar alerta de crisis a padre
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               crisisAlertId:
 *                 type: integer
 *                 description: ID of the crisis alert (BIGINT from crisis_alerts table)
 *             required:
 *               - crisisAlertId
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 notification:
 *                   type: object
 *       400:
 *         description: Bad request (missing crisisAlertId)
 *       403:
 *         description: Unauthorized (not admin)
 *       500:
 *         description: Server error
 */
router.post('/send-crisis-alert', requireAuth, async (req, res) => {
  try {
    const { crisisAlertId } = req.body;

    // Validate input
    if (!crisisAlertId) {
      return res.status(400).json({
        success: false,
        error: 'Crisis alert ID is required'
      });
    }

    if (typeof crisisAlertId !== 'number' && !Number.isInteger(Number(crisisAlertId))) {
      return res.status(400).json({
        success: false,
        error: 'Crisis alert ID must be a valid integer'
      });
    }

    req.log.info('Sending crisis alert notification', {
      crisisAlertId,
      userId: req.user?.id || 'unknown'
    });

    // Call notification service
    const result = await notificationService.sendCrisisAlert(crisisAlertId);

    if (!result.success) {
      req.log.error('Failed to send crisis alert', {
        crisisAlertId,
        error: result.error
      });

      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    req.log.info('Crisis alert notification sent', {
      crisisAlertId,
      notification: result.notification
    });

    return res.status(200).json({
      success: true,
      notification: result.notification
    });
  } catch (error) {
    req.log.error('Error in send-crisis-alert endpoint', {
      error: error.message
    });

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/notifications/history
 * Fetch parent's notification delivery history
 * Parents can only see their own history
 *
 * @swagger
 * /api/notifications/history:
 *   get:
 *     summary: Obtener historial de notificaciones del padre
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Notification history retrieved
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/history', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const limit = Math.min(parseInt(req.query.limit || '20'), 100);
    const offset = parseInt(req.query.offset || '0');

    // Find parent record for this user
    const { data: parent, error: parentError } = await supabase
      .from('parents')
      .select('id')
      .eq('auth_id', userId)
      .single();

    if (parentError && parentError.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'Parent profile not found'
      });
    }

    if (parentError) {
      throw new Error(parentError.message);
    }

    // Fetch notification logs
    const { data: logs, error: logsError, count } = await supabase
      .from('notification_logs')
      .select('*, crisis_alerts(id, detected_content, crisis_level, created_at)', { count: 'exact' })
      .eq('parent_id', parent.id)
      .order('sent_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (logsError) {
      throw new Error(logsError.message);
    }

    req.log.info('Notification history fetched', {
      parentId: parent.id,
      count: logs?.length || 0
    });

    return res.status(200).json({
      success: true,
      data: logs || [],
      pagination: {
        limit,
        offset,
        total: count || 0
      }
    });
  } catch (error) {
    req.log.error('Error in notification history endpoint', {
      error: error.message
    });

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/notifications/preferences
 * Fetch parent's notification preferences
 * Parents can only see their own preferences
 *
 * @swagger
 * /api/notifications/preferences:
 *   get:
 *     summary: Obtener preferencias de notificación del padre
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preferences retrieved (returns defaults if not set)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/preferences', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Find parent record
    const { data: parent, error: parentError } = await supabase
      .from('parents')
      .select('id')
      .eq('auth_id', userId)
      .single();

    if (parentError && parentError.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'Parent profile not found'
      });
    }

    if (parentError) {
      throw new Error(parentError.message);
    }

    // Fetch preferences
    const { data: prefs, error: prefsError } = await supabase
      .from('parent_preferences')
      .select('*')
      .eq('parent_id', parent.id)
      .single();

    // If no preferences, return defaults
    if (prefsError && prefsError.code === 'PGRST116') {
      return res.status(200).json({
        success: true,
        preferences: {
          email_enabled: true,
          push_enabled: true,
          sms_enabled: false,
          alert_frequency: 'immediate'
        },
        created: false
      });
    }

    if (prefsError) {
      throw new Error(prefsError.message);
    }

    return res.status(200).json({
      success: true,
      preferences: prefs,
      created: true
    });
  } catch (error) {
    req.log.error('Error in notification preferences endpoint', {
      error: error.message
    });

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/notifications/preferences
 * Update parent's notification preferences
 * Parents can only update their own preferences
 *
 * @swagger
 * /api/notifications/preferences:
 *   post:
 *     summary: Actualizar preferencias de notificación
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_enabled:
 *                 type: boolean
 *               push_enabled:
 *                 type: boolean
 *               sms_enabled:
 *                 type: boolean
 *               alert_frequency:
 *                 type: string
 *                 enum: [immediate, daily, weekly]
 *     responses:
 *       200:
 *         description: Preferences updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/preferences', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { email_enabled, push_enabled, sms_enabled, alert_frequency } = req.body;

    // Validate input
    if (
      (email_enabled !== undefined && typeof email_enabled !== 'boolean') ||
      (push_enabled !== undefined && typeof push_enabled !== 'boolean') ||
      (sms_enabled !== undefined && typeof sms_enabled !== 'boolean') ||
      (alert_frequency !== undefined && !['immediate', 'daily', 'weekly'].includes(alert_frequency))
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid preference values'
      });
    }

    // Find parent record
    const { data: parent, error: parentError } = await supabase
      .from('parents')
      .select('id')
      .eq('auth_id', userId)
      .single();

    if (parentError && parentError.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'Parent profile not found'
      });
    }

    if (parentError) {
      throw new Error(parentError.message);
    }

    // Prepare update object (only include provided fields)
    const updateData = {};
    if (email_enabled !== undefined) updateData.email_enabled = email_enabled;
    if (push_enabled !== undefined) updateData.push_enabled = push_enabled;
    if (sms_enabled !== undefined) updateData.sms_enabled = sms_enabled;
    if (alert_frequency !== undefined) updateData.alert_frequency = alert_frequency;
    updateData.updated_at = new Date().toISOString();

    // Try to update existing preferences
    const { data: updated, error: updateError } = await supabase
      .from('parent_preferences')
      .update(updateData)
      .eq('parent_id', parent.id)
      .select('*')
      .single();

    // If no existing record, insert one
    if (updateError && updateError.code === 'PGRST116') {
      const { data: inserted, error: insertError } = await supabase
        .from('parent_preferences')
        .insert({
          parent_id: parent.id,
          ...updateData
        })
        .select('*')
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      req.log.info('Parent preferences created', {
        parentId: parent.id
      });

      return res.status(200).json({
        success: true,
        preferences: inserted
      });
    }

    if (updateError) {
      throw new Error(updateError.message);
    }

    req.log.info('Parent preferences updated', {
      parentId: parent.id
    });

    return res.status(200).json({
      success: true,
      preferences: updated
    });
  } catch (error) {
    req.log.error('Error in update preferences endpoint', {
      error: error.message
    });

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
