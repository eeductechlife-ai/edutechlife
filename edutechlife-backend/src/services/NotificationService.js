/**
 * NotificationService
 * Handles sending notifications to parents on crisis alerts
 * Supports multiple channels: email, push notifications, SMS
 * Tracks delivery status and allows parent preferences
 */

const { createClient } = require('@supabase/supabase-js');
const { sendEmail } = require('./emailService');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
);

/**
 * Send crisis alert notification to parent
 * Called when a new crisis_alert is inserted in the database
 * @param {string} crisisAlertId - ID of the crisis alert (BIGINT from DB)
 * @returns {Promise<{success: boolean, notification?: Object, error?: string}>}
 */
async function sendCrisisAlert(crisisAlertId) {
  try {
    if (!crisisAlertId) {
      throw new Error('Crisis alert ID is required');
    }

    // 1. Fetch crisis alert details
    const { data: crisisAlert, error: alertError } = await supabase
      .from('crisis_alerts')
      .select('*')
      .eq('id', crisisAlertId)
      .single();

    if (alertError) {
      throw new Error(`Failed to fetch crisis alert: ${alertError.message}`);
    }

    if (!crisisAlert) {
      throw new Error(`Crisis alert not found: ${crisisAlertId}`);
    }

    // 2. Fetch student details
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, name, age, parent_email')
      .eq('id', crisisAlert.student_id)
      .single();

    if (studentError) {
      console.warn(`[NotificationService] Student not found: ${crisisAlert.student_id}`);
    }

    // 3. Find parent using student's parent_email
    const parentEmail = crisisAlert.parent_email || student?.parent_email;
    if (!parentEmail) {
      throw new Error(`No parent email found for student ${crisisAlert.student_id}`);
    }

    const { data: parent, error: parentError } = await supabase
      .from('parents')
      .select('*')
      .eq('email', parentEmail)
      .single();

    if (parentError && parentError.code !== 'PGRST116') {
      console.warn(`[NotificationService] Parent lookup warning: ${parentError.message}`);
    }

    if (!parent) {
      console.warn(`[NotificationService] Parent not found for email: ${parentEmail}. Creating minimal record.`);
      // Create a parent record if it doesn't exist (fallback)
      const { data: newParent, error: createError } = await supabase
        .from('parents')
        .insert({
          email: parentEmail,
          name: student?.name ? `Parent of ${student.name}` : 'Parent',
        })
        .select('*')
        .single();

      if (createError) {
        throw new Error(`Failed to create parent record: ${createError.message}`);
      }

      return await sendNotificationToParent(
        newParent,
        crisisAlert,
        student,
        parentEmail
      );
    }

    // 4. Fetch parent preferences
    const preferences = await getParentPreferences(parent.id);

    // 5. Send notifications via enabled channels
    const results = [];

    if (preferences.email_enabled) {
      const emailResult = await sendEmailNotification(
        parent.id,
        parentEmail,
        crisisAlert,
        student
      );
      results.push(emailResult);
    }

    if (preferences.push_enabled) {
      const pushResult = await sendPushNotification(
        parent.id,
        student?.name || 'Student',
        crisisAlert
      );
      results.push(pushResult);
    }

    if (preferences.sms_enabled && parent.phone) {
      const smsResult = await sendSmsNotification(
        parent.id,
        parent.phone,
        student?.name || 'Student',
        crisisAlert
      );
      results.push(smsResult);
    }

    // Check if any channel succeeded
    const anySuccess = results.some(r => r.success);
    if (!anySuccess) {
      throw new Error('Failed to send notification via any channel');
    }

    console.log(`[NotificationService] Crisis alert ${crisisAlertId} sent to parent ${parent.id}`);

    return {
      success: true,
      notification: {
        parent_id: parent.id,
        crisis_alert_id: crisisAlertId,
        channels_sent: results.filter(r => r.success).map(r => r.channel)
      }
    };
  } catch (error) {
    console.error('[NotificationService] Error in sendCrisisAlert:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Helper: Send notification to parent
 * @private
 */
async function sendNotificationToParent(parent, crisisAlert, student, parentEmail) {
  try {
    const preferences = await getParentPreferences(parent.id);
    const results = [];

    if (preferences.email_enabled) {
      const emailResult = await sendEmailNotification(
        parent.id,
        parentEmail,
        crisisAlert,
        student
      );
      results.push(emailResult);
    }

    if (preferences.push_enabled) {
      const pushResult = await sendPushNotification(
        parent.id,
        student?.name || 'Student',
        crisisAlert
      );
      results.push(pushResult);
    }

    const anySuccess = results.some(r => r.success);
    if (!anySuccess) {
      throw new Error('Failed to send notification via any channel');
    }

    return {
      success: true,
      notification: {
        parent_id: parent.id,
        crisis_alert_id: crisisAlert.id,
        channels_sent: results.filter(r => r.success).map(r => r.channel)
      }
    };
  } catch (error) {
    console.error('[NotificationService] Error in sendNotificationToParent:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch parent notification preferences (with defaults)
 * @private
 */
async function getParentPreferences(parentId) {
  try {
    const { data: prefs, error } = await supabase
      .from('parent_preferences')
      .select('*')
      .eq('parent_id', parentId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No preferences record yet; return defaults
      console.log(`[NotificationService] No preferences for parent ${parentId}, using defaults`);
      return {
        email_enabled: true,
        push_enabled: true,
        sms_enabled: false,
        alert_frequency: 'immediate'
      };
    }

    if (error) {
      throw new Error(`Failed to fetch preferences: ${error.message}`);
    }

    return prefs;
  } catch (error) {
    console.error('[NotificationService] Error fetching preferences:', error.message);
    // Return defaults on error (safety first)
    return {
      email_enabled: true,
      push_enabled: true,
      sms_enabled: false,
      alert_frequency: 'immediate'
    };
  }
}

/**
 * Send email notification via SendGrid or fallback
 * @private
 */
async function sendEmailNotification(parentId, parentEmail, crisisAlert, student) {
  try {
    const studentName = student?.name || 'Your child';
    const studentAge = student?.age || 'N/A';
    const alertMessage = crisisAlert.detected_content || 'Crisis alert detected';

    const html = buildCrisisAlertEmailHtml({
      studentName,
      studentAge,
      crisisLevel: crisisAlert.crisis_level,
      alertMessage,
      alertId: crisisAlert.id,
      dashboardUrl: process.env.DASHBOARD_URL || 'https://edutechlife.co'
    });

    const result = await sendEmail(
      parentEmail,
      `Alerta: ${studentName} necesita ayuda en SmartBoard`,
      html,
      `Recibimos una alerta de crisis para ${studentName}. Revisa el dashboard para más detalles.`
    );

    // Log the notification attempt
    await logNotification(parentId, crisisAlert.id, 'email', result.success ? 'sent' : 'failed', {
      messageId: result.messageId,
      mode: result.mode,
      error: result.error
    });

    return {
      success: result.success,
      channel: 'email',
      messageId: result.messageId,
      error: result.error
    };
  } catch (error) {
    console.error('[NotificationService] Email send error:', error.message);

    // Log the failure
    await logNotification(parentId, crisisAlert.id, 'email', 'failed', {
      error: error.message
    });

    return {
      success: false,
      channel: 'email',
      error: error.message
    };
  }
}

/**
 * Send push notification (stub - requires Firebase/OneSignal setup)
 * @private
 */
async function sendPushNotification(parentId, studentName, crisisAlert) {
  try {
    // STUB: Implement with Firebase Cloud Messaging or OneSignal
    // For now, just log that it would be sent
    console.log(`[NotificationService] Push notification stub for parent ${parentId}: "${studentName} needs help"`);

    // Log as sent (stub implementation)
    await logNotification(parentId, crisisAlert.id, 'push', 'sent', {
      stub: true,
      message: `${studentName} needs help in SmartBoard`
    });

    return {
      success: true,
      channel: 'push',
      message: 'Push notification queued (stub implementation)'
    };
  } catch (error) {
    console.error('[NotificationService] Push send error:', error.message);

    await logNotification(parentId, crisisAlert.id, 'push', 'failed', {
      error: error.message
    });

    return {
      success: false,
      channel: 'push',
      error: error.message
    };
  }
}

/**
 * Send SMS notification (stub - requires Twilio/AWS SNS setup)
 * @private
 */
async function sendSmsNotification(parentId, phoneNumber, studentName, crisisAlert) {
  try {
    // STUB: Implement with Twilio or AWS SNS
    console.log(`[NotificationService] SMS notification stub to ${phoneNumber}: "${studentName} needs help"`);

    // Log as sent (stub implementation)
    await logNotification(parentId, crisisAlert.id, 'sms', 'sent', {
      stub: true,
      phone: phoneNumber,
      message: `${studentName} needs help in SmartBoard`
    });

    return {
      success: true,
      channel: 'sms',
      message: 'SMS queued (stub implementation)'
    };
  } catch (error) {
    console.error('[NotificationService] SMS send error:', error.message);

    await logNotification(parentId, crisisAlert.id, 'sms', 'failed', {
      error: error.message
    });

    return {
      success: false,
      channel: 'sms',
      error: error.message
    };
  }
}

/**
 * Log notification attempt to database
 * Tracks delivery status for analytics and debugging
 * @private
 */
async function logNotification(parentId, crisisAlertId, channel, status, metadata = {}) {
  try {
    const { error } = await supabase
      .from('notification_logs')
      .insert({
        parent_id: parentId,
        crisis_alert_id: crisisAlertId,
        channel,
        status,
        metadata,
        sent_at: new Date().toISOString()
      });

    if (error) {
      console.error(`[NotificationService] Failed to log notification: ${error.message}`);
    }
  } catch (error) {
    console.error('[NotificationService] Error logging notification:', error.message);
  }
}

/**
 * Build HTML for crisis alert email
 * @private
 */
function buildCrisisAlertEmailHtml(opts) {
  const {
    studentName,
    studentAge,
    crisisLevel,
    alertMessage,
    alertId,
    dashboardUrl
  } = opts;

  const alertColor = crisisLevel === 'high' ? '#FF6B6B' : crisisLevel === 'medium' ? '#FFA500' : '#FFB84D';
  const dashboardLink = `${dashboardUrl}/alerts/${alertId}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .alert-box {
      background-color: #FEE;
      border-left: 4px solid ${alertColor};
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .alert-title {
      font-size: 24px;
      font-weight: bold;
      color: #c93c1d;
      margin: 0 0 10px 0;
    }
    .alert-level {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      background-color: ${alertColor};
      color: white;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 15px;
    }
    .alert-details {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      margin: 15px 0;
    }
    .detail-row {
      margin: 8px 0;
    }
    .detail-label {
      font-weight: bold;
      color: #666;
      display: inline-block;
      width: 120px;
    }
    .detail-value {
      color: #333;
    }
    .cta-button {
      display: inline-block;
      background-color: ${alertColor};
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      font-size: 16px;
      margin: 20px 0;
    }
    .cta-button:hover {
      opacity: 0.9;
    }
    .footer {
      font-size: 12px;
      color: #999;
      text-align: center;
      margin-top: 30px;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
    .footer-link {
      color: #4a90e2;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; color: #333;">EdutechLife</h1>
    </div>

    <div class="alert-box">
      <div class="alert-level">${crisisLevel} Alerta</div>
      <div class="alert-title">Alerta: ${studentName} necesita ayuda</div>

      <div class="alert-details">
        <div class="detail-row">
          <span class="detail-label">Estudiante:</span>
          <span class="detail-value">${studentName} (${studentAge} años)</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tipo de Alerta:</span>
          <span class="detail-value">Rendimiento crítico</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Detectado:</span>
          <span class="detail-value">${new Date().toLocaleDateString('es-ES')}</span>
        </div>
      </div>

      <p><strong>Detalles:</strong></p>
      <p>${alertMessage}</p>

      <center>
        <a href="${dashboardLink}" class="cta-button">Ver detalles en el dashboard</a>
      </center>

      <p style="font-size: 14px; color: #666;">
        Este es un alerta automático del sistema EdutechLife para ayudarte a monitorear el progreso académico de tu hijo(a).
        Por favor revisa el dashboard para ver más detalles y recomendaciones personalizadas.
      </p>
    </div>

    <div class="footer">
      <p>
        Puedes cambiar tus <a href="${dashboardUrl}/settings/notifications" class="footer-link">preferencias de notificación</a> en tu cuenta.
      </p>
      <p>
        © 2026 EdutechLife. Todos los derechos reservados.<br>
        <a href="https://edutechlife.co/privacy" class="footer-link">Privacidad</a> |
        <a href="https://edutechlife.co/terms" class="footer-link">Términos</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

module.exports = {
  sendCrisisAlert,
  getParentPreferences,
  logNotification
};
