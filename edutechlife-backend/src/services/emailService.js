/**
 * Email Service
 * Handles sending emails via Resend or fallback service
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'alerts@edutechlife.com';

/**
 * Sends an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text content
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
async function sendEmail(to, subject, html, text) {
  if (!to) {
    return { success: false, error: 'Recipient email is required' };
  }

  // Log email sending attempt
  console.log(`[Email] Sending to: ${to}, Subject: ${subject}`);

  try {
    // If Resend is configured, use it
    if (RESEND_API_KEY) {
      return await sendViaResend(to, subject, html, text);
    }

    // Fallback: Log to console (development)
    console.log(`[Email Fallback] Email would be sent to: ${to}`);
    console.log(`[Email Fallback] Subject: ${subject}`);
    console.log(`[Email Fallback] HTML:\n${html}`);

    return {
      success: true,
      messageId: `fallback-${Date.now()}`,
      mode: 'fallback_console_logging'
    };
  } catch (error) {
    console.error('[Email Error]', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends email via Resend API
 */
async function sendViaResend(to, subject, html, text) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Resend Error]', response.status, error);
      return { success: false, error: `Resend API error: ${response.status}` };
    }

    const data = await response.json();
    console.log('[Resend Success]', data);

    return {
      success: true,
      messageId: data.id,
      mode: 'resend'
    };
  } catch (error) {
    console.error('[Resend Exception]', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends crisis alert email to parent
 */
async function sendCrisisAlert(parentEmail, studentName, studentAge, detectedContent, crisisLevel) {
  const { formatCrisisAlertEmail } = require('./crisisDetection');
  const emailContent = formatCrisisAlertEmail(studentName, studentAge, detectedContent, parentEmail);

  return await sendEmail(
    parentEmail,
    emailContent.subject,
    emailContent.html,
    emailContent.text
  );
}

/**
 * Logs crisis incident to database
 */
async function logCrisisIncident(supabase, studentId, studentAge, detectedContent, crisisLevel, parentEmail) {  try {
    const { data, error } = await supabase
      .from('crisis_alerts')
      .insert([
        {
          student_id: studentId,
          student_age: studentAge,
          detected_content: detectedContent,
          crisis_level: crisisLevel,
          parent_email: parentEmail,
          alert_sent: true,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('[CrisisLog Error]', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('[CrisisLog Exception]', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envía el email de verificación de consentimiento parental (COPPA / Ley 1581).
 * El enlace contiene un token de un solo uso que marca el consentimiento como
 * verificado y habilita el registro de la cuenta de padre.
 */
async function sendConsentVerificationEmail({ parentEmail, studentAge, token }) {
  const verifyUrl = `https://edutechlife.co/api/smartboard/parental-consent/verify?token=${token}`;
  const html = `
    <p>Recibimos una solicitud de consentimiento para un estudiante de SmartBoard (edad: ${studentAge}).</p>
    <p>Para activar la cuenta, verifica tu consentimiento:</p>
    <p><a href="${verifyUrl}">Verificar consentimiento</a></p>
    <p>Este enlace es de un solo uso. Si no reconoces esta solicitud, ignora este correo.</p>
  `;
  return sendEmail(
    parentEmail,
    'Verifica el consentimiento parental de SmartBoard',
    html,
    `Verifica tu consentimiento en: ${verifyUrl}`
  );
}

module.exports = {
  sendEmail,
  sendCrisisAlert,
  logCrisisIncident,
  sendConsentVerificationEmail
};
