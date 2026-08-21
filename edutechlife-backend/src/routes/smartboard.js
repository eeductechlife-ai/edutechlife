const { Router } = require('express');
const crypto = require('crypto');
const supabase = require('../db/supabase');
const { chat, chatStream, validateMessages } = require('../services/deepseek');
const { requireAuth } = require('../middleware/auth');
const { requireVerifiedParentalConsent } = require('../middleware/parentalConsent');
const { detectCrisis } = require('../services/crisisDetection');
const { sendCrisisAlert, logCrisisIncident, sendEmail, sendConsentVerificationEmail } = require('../services/emailService');
const { buildWeeklySummary, renderWeeklyEmail } = require('../services/weeklyReport');

const router = Router();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const DANI_SYSTEM_PROMPT = `Eres Dani, un tutor virtual amigable para estudiantes de 8 a 16 años.

Personalidad:
- Nombre: Dani
- Tono: cálido, motivador y paciente
- Usa emojis ocasionalmente para hacer la experiencia más divertida 🎉
- Habla siempre en español

Reglas importantes:
- Guía a los estudiantes con preguntas en lugar de dar respuestas directas
- Ayuda a desarrollar pensamiento crítico y habilidades de resolución de problemas
- Mantén un lenguaje apropiado para la edad del estudiante
- Sé paciente y alentador, celebra los pequeños logros
- Si el estudiante se frustra, ofrece pistas en lugar de soluciones
- Promueve un ambiente de aprendizaje positivo y sin juzgamiento`;

/**
 * @swagger
 * /api/smartboard/data/{userId}:
 *   get:
 *     summary: Obtener datos del SmartBoard para un usuario
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Datos del SmartBoard
 *       404:
 *         description: Datos no encontrados
 *       500:
 *         description: Error del servidor
 */
router.get('/data/:userId', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const { userId } = req.params;

  if (req.userId !== userId) {
    return res.status(403).json({ error: 'Acceso denegado — no puedes acceder a datos de otro usuario' });
  }

  try {
    const { data, error } = await supabase
      .from('smartboard_kids_data')
      .select('data')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Data not found for this user' });
      }
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: 'Data not found for this user' });
    }

    res.json(data.data);
  } catch (e) {
    console.error('Error fetching smartboard data:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/smartboard/chat:
 *   post:
 *     summary: Enviar mensaje al tutor virtual Dani
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [system, user, assistant]
 *                     content:
 *                       type: string
 *               context:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta del tutor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
/**
 * El system prompt de Dani lo fija exclusivamente el servidor. Los mensajes
 * del cliente que intenten enviar role:'system' se reescriben a 'user' para
 * que no puedan pisar ni eliminar la personalidad del tutor.
 */
function sanitizeClientMessages(messages) {
  return (messages || []).map((m) =>
    m.role === 'system' ? { role: 'user', content: m.content } : m,
  );
}

router.post('/chat', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const { messages, context } = req.body;

  const validationError = validateMessages(messages);
  if (validationError) return res.status(400).json({ error: validationError });

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const systemPrompt = context
    ? `${DANI_SYSTEM_PROMPT}\n\nContexto actual:\n${context}`
    : DANI_SYSTEM_PROMPT;

  const msgs = [
    { role: 'system', content: systemPrompt },
    ...sanitizeClientMessages(messages),
  ];

  try {
    const data = await chat(DEEPSEEK_API_KEY, { messages: msgs });
    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'No response from API' });

    res.json({ result: text });
  } catch (e) {
    console.error('Error calling Dani AI:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/smartboard/chat/stream:
 *   post:
 *     summary: Enviar mensaje al tutor virtual Dani con streaming
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *               context:
 *                 type: string
 *     responses:
 *       200:
 *         description: Streaming de respuesta del tutor
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/chat/stream', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const { messages, context, language = 'es' } = req.body;
  const userId = req.userId;

  const validationError = validateMessages(messages);
  if (validationError) return res.status(400).json({ error: validationError });

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  // Extract latest user message for crisis detection
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

  // Detect crisis indicators
  const crisisDetection = detectCrisis(lastUserMessage, language);

  let streamClosed = false;
  req.on('close', () => {
    streamClosed = true;
    res.end();
  });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // If high-risk crisis detected, handle escalation
  if (crisisDetection.level === 'high') {
    try {
      // Get parent email from parent_consents table
      const { data: consentData, error: consentError } = await supabase
        .from('parent_consents')
        .select('parent_email, student_age')
        .eq('student_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (consentData && consentData.parent_email) {
        // Send crisis alert to parent
        const emailResult = await sendCrisisAlert(
          consentData.parent_email,
          'Estudiante', // Would come from user metadata
          consentData.student_age,
          lastUserMessage,
          'high'
        );

        // Log incident to database
        await logCrisisIncident(
          supabase,
          userId,
          consentData.student_age,
          lastUserMessage,
          'high',
          consentData.parent_email
        );

        console.log('[Crisis Escalation] Email sent:', emailResult);
      }
    } catch (e) {
      console.error('[Crisis Escalation Error]', e);
      // Don't fail the chat request if escalation fails
    }
  }

  const systemPrompt = context
    ? `${DANI_SYSTEM_PROMPT}\n\nContexto actual:\n${context}`
    : DANI_SYSTEM_PROMPT;

  const msgs = [
    { role: 'system', content: systemPrompt },
    ...sanitizeClientMessages(messages),
  ];

  try {
    await chatStream(DEEPSEEK_API_KEY, { messages: msgs }, (chunk) => {
      if (streamClosed) return;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    if (streamClosed) return;
    if (crisisDetection.level !== 'none') {
      res.write(`data: ${JSON.stringify({ crisisAlert: crisisDetection.level })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (e) {
    if (streamClosed) return;
    console.error('Error calling Dani AI (stream):', e);
    res.write(`data: ${JSON.stringify({ error: 'Error generando respuesta' })}\n\n`);
    res.end();
  }
});

/**
 * @swagger
 * /api/smartboard/progress/{userId}:
 *   get:
 *     summary: Obtener progreso del estudiante en SmartBoard
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Progreso del estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPoints:
 *                   type: integer
 *                 streak:
 *                   type: integer
 *                 completedMissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 subjectProgress:
 *                   type: object
 *                 totalActiveMinutes:
 *                   type: integer
 *                 vakResult:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Progreso no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/progress/:userId', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const { userId } = req.params;

  if (req.userId !== userId) {
    return res.status(403).json({ error: 'Acceso denegado — no puedes acceder a datos de otro usuario' });
  }

  try {
    const { data, error } = await supabase
      .from('smartboard_kids_data')
      .select('data')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Data not found for this user' });
      }
      throw error;
    }

    if (!data || !data.data) {
      return res.status(404).json({ error: 'Data not found for this user' });
    }

    const kidData = data.data;

    res.json({
      totalPoints: kidData.totalPoints ?? 0,
      streak: kidData.streak ?? 0,
      completedMissions: kidData.completedMissions ?? [],
      subjectProgress: kidData.subjectProgress ?? {},
      totalActiveMinutes: kidData.totalActiveMinutes ?? 0,
      vakResult: kidData.vakResult ?? null,
    });
  } catch (e) {
    console.error('Error fetching smartboard progress:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/smartboard/parental-consent:
 *   post:
 *     summary: Registrar consentimiento parental para menores
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentEmail:
 *                 type: string
 *               studentAge:
 *                 type: integer
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Consentimiento registrado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/parental-consent', requireAuth, async (req, res) => {
  const { parentEmail, studentAge, timestamp } = req.body;
  const userId = req.userId;

  if (!parentEmail || studentAge === undefined || studentAge === null) {
    return res.status(400).json({ error: 'parentEmail and studentAge are required' });
  }

  const age = Number(studentAge);
  if (!Number.isInteger(age) || age < 5 || age >= 18) {
    return res.status(400).json({ error: 'studentAge must be an integer and, por ser un consentimiento de menor de edad, ser menor de 18' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(parentEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const verificationToken = crypto.randomBytes(24).toString('hex');

  try {
    const { data, error } = await supabase
      .from('parent_consents')
      .insert([
        {
          student_id: userId,
          parent_email: parentEmail,
          student_age: age,
          consent_timestamp: timestamp || new Date().toISOString(),
          verification_status: 'pending',
          verification_token: verificationToken,
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting parental consent:', error);
      return res.status(500).json({ error: 'Failed to save parental consent' });
    }

    // Enviar email de verificación al padre con el token de un solo uso.
    try {
      await sendConsentVerificationEmail({
        parentEmail,
        studentAge: age,
        token: verificationToken,
      });
    } catch (emailError) {
      console.error('Error sending consent verification email:', emailError.message);
    }

    // No exponer el verification_token al cliente; solo el estado.
    res.status(201).json({
      message: 'Parental consent registered successfully. Verification email sent.',
      data: { id: data[0].id, verification_status: 'pending' }
    });
  } catch (e) {
    console.error('Error processing parental consent:', e);
    res.status(500).json({ error: 'Failed to process parental consent' });
  }
});

/**
 * @swagger
 * /api/smartboard/parental-consent/verify:
 *   post:
 *     summary: Verifica el consentimiento parental con el token enviado por email
 *     description: >
 *       Marca verification_status='verified' para el consentimiento cuyo
 *       verification_token coincide. Es el paso que habilita el registro del
 *       padre (POST /api/auth/parent-register).
 *     tags: [SmartBoard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Consentimiento verificado
 *       400:
 *         description: Token inválido
 *       404:
 *         description: Token no encontrado o ya utilizado
 *       500:
 *         description: Error del servidor
 */
router.post('/parental-consent/verify', async (req, res) => {
  const { token } = req.body || {};
  if (!token || typeof token !== 'string' || token.length < 16) {
    return res.status(400).json({ error: 'Token inválido' });
  }

  try {
    const { data, error } = await supabase
      .from('parent_consents')
      .update({
        verification_status: 'verified',
        verified_at: new Date().toISOString(),
      })
      .eq('verification_token', token)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Token no encontrado o ya utilizado' });

    res.json({
      message: 'Consentimiento verificado. Ya puedes crear tu cuenta de padre.',
      verification_status: data.verification_status,
    });
  } catch (e) {
    console.error('Error verifying parental consent:', e);
    res.status(500).json({ error: 'Error al verificar el consentimiento' });
  }
});

/**
 * GET /api/smartboard/parental-consent/status
 * Estado del consentimiento parental del menor autenticado.
 * Usado por la puerta de entrada de la SmartBoard para bloquear el
 * acceso mientras el consentimiento no esté verificado.
 */
router.get('/parental-consent/status', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parent_consents')
      .select('verification_status, student_age, parent_email')
      .eq('student_id', req.userId)
      .order('consent_timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    // La tabla parent_consents puede no existir (PGRST205 / 42P01 en despliegues
    // sin la migración): se trata como "sin consentimiento aún", no como error.
    if (error && error.code !== 'PGRST205' && error.code !== '42P01') throw error;

    if (!data || error) {
      return res.json({
        verification_status: 'none',
        student_age: null,
        pending_email: null,
      });
    }

    res.json({
      verification_status: data.verification_status,
      student_age: data.student_age,
      pending_email: data.verification_status === 'pending'
        ? (data.parent_email || null)
        : null,
    });
  } catch (e) {
    console.error('Error reading parental consent status:', e);
    res.status(500).json({ error: 'Error al consultar el consentimiento' });
  }
});

/**
 * GET /api/smartboard/parental-consent/verify?token=...
 * Verificación del consentimiento desde el enlace del email (clicable).
 * El token se consume una sola vez: cuando ya consta como verificado se
 * muestra el estado actual en lugar de fallar.
 */
router.get('/parental-consent/verify', async (req, res) => {
  const { token } = req.query || {};
  if (!token || typeof token !== 'string' || token.length < 16) {
    return res.status(400).json({ error: 'Token inválido' });
  }

  const page = (title, body) =>
    `<!doctype html><html lang="es"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<title>${title}</title></head>` +
    `<body style="margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f1f5f9;color:#0f172a;display:flex;min-height:100vh;align-items:center;justify-content:center">` +
    `<div style="max-width:520px;margin:24px;padding:40px;background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(2,44,66,.08);text-align:center">` +
    `<div style="width:56px;height:56px;border-radius:50%;background:#e6f4f8;color:#004B63;font-size:28px;line-height:56px;margin:0 auto 16px">✓</div>` +
    `<h1 style="font-size:20px;margin:0 0 8px">${title}</h1>` +
    `<p style="color:#475569;margin:0 0 24px;line-height:1.5">${body}</p>` +
    `<a href="https://edutechlife.co" style="display:inline-block;background:#004B63;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600">Ir a Edutechlife</a>` +
    `</div></body></html>`;

  try {
    const { data: existing, error: fetchError } = await supabase
      .from('parent_consents')
      .select('verification_status, verified_at')
      .eq('verification_token', token)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing && existing.verification_status === 'verified') {
      return res.status(200)
        .set('Content-Type', 'text/html; charset=utf-8')
        .send(page(
          'Consentimiento ya verificado',
          'El consentimiento parental ya había sido confirmado anteriormente. No es necesario hacer nada más.'
        ));
    }

    const { data, error } = await supabase
      .from('parent_consents')
      .update({
        verification_status: 'verified',
        verified_at: new Date().toISOString(),
      })
      .eq('verification_token', token)
      .eq('verification_status', 'pending')
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404)
        .set('Content-Type', 'text/html; charset=utf-8')
        .send(page(
          'Enlace no válido',
          'Este enlace de verificación no existe o ya fue utilizado. Solicita uno nuevo desde la SmartBoard.'
        ));
    }

    res.status(200)
      .set('Content-Type', 'text/html; charset=utf-8')
      .send(page(
        'Consentimiento verificado',
        'Gracias. El acceso de tu hijo/a a la SmartBoard ha quedado habilitado.'
      ));
  } catch (e) {
    console.error('Error verifying parental consent (GET):', e);
    res.status(500).json({ error: 'Error al verificar el consentimiento' });
  }
});

/**
 * @swagger
 * /api/smartboard/weekly-report:
 *   post:
 *     summary: Genera y envía por email el reporte semanal del hijo al padre
 *     description: >
 *       Lee los datos del estudiante autenticado desde Supabase, arma un resumen
 *       semanal (puntos, días activos, racha, materias) y lo envía al email del
 *       padre registrado en el consentimiento parental. La identidad viene del token.
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentName:
 *                 type: string
 *               preview:
 *                 type: boolean
 *                 description: Si es true, devuelve el resumen sin enviar email
 *     responses:
 *       200:
 *         description: Reporte enviado (o preview generado)
 *       404:
 *         description: Sin datos o sin email de padre registrado
 *       500:
 *         description: Error del servidor
 */
router.post('/weekly-report', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const userId = req.userId;
  const { studentName, preview = false } = req.body || {};

  try {
    // 1. Datos del niño desde el blob ya sincronizado en Supabase
    const { data: row, error: dataError } = await supabase
      .from('smartboard_kids_data')
      .select('data')
      .eq('user_id', userId)
      .single();

    if (dataError) {
      if (dataError.code === 'PGRST116') {
        return res.status(404).json({ error: 'No hay datos para este usuario todavía' });
      }
      throw dataError;
    }

    const summary = buildWeeklySummary(row?.data || {});

    // Modo preview: útil para el frontend sin disparar correo
    if (preview) {
      return res.status(200).json({ summary });
    }

    // 2. Email del padre desde el consentimiento parental
    const { data: consent, error: consentError } = await supabase
      .from('parent_consents')
      .select('parent_email')
      .eq('student_id', userId)
      .order('consent_timestamp', { ascending: false })
      .limit(1)
      .single();

    if (consentError || !consent?.parent_email) {
      return res.status(404).json({
        error: 'No hay email de padre registrado. Completa el consentimiento parental primero.',
        summary,
      });
    }

    // 3. Render + envío (sendEmail cae a log en dev si no hay Resend)
    const email = renderWeeklyEmail(summary, {
      studentName,
      dashboardUrl: 'https://edutechlife.co/smartboard',
    });

    const sent = await sendEmail(
      consent.parent_email,
      email.subject,
      email.html,
      email.text,
    );

    if (!sent.success) {
      return res.status(500).json({ error: 'No se pudo enviar el reporte', detail: sent.error });
    }

    return res.status(200).json({
      message: 'Reporte semanal enviado al padre',
      to: consent.parent_email,
      mode: sent.mode,
      summary,
    });
  } catch (e) {
    console.error('Error generando reporte semanal:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/smartboard/wellbeing-status:
 *   get:
 *     summary: Estado agregado de bienestar del hijo para el padre (no expone contenido sensible)
 *     description: >
 *       Devuelve una señal de confianza para el padre: si el acompañamiento de
 *       bienestar está activo y si hubo alertas recientes. NUNCA devuelve el
 *       contenido detectado, solo el conteo agregado. Identidad desde el token.
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de bienestar
 *       500:
 *         description: Error del servidor
 */
router.get('/wellbeing-status', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const userId = req.userId;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    // Get student IDs linked to this parent
    const { data: links, error: linksError } = await supabase
      .from('parent_student_links')
      .select('student_user_id')
      .eq('parent_user_id', userId);

    if (linksError && linksError.code !== '42P01' && linksError.code !== 'PGRST205') {
      throw linksError;
    }

    const studentIds = (Array.isArray(links) ? links : []).map(l => l.student_user_id);
    if (!studentIds || studentIds.length === 0) {
      return res.status(200).json({
        monitoring: true,
        recentAlerts: 0,
        highAlerts: 0,
        lastAlertAt: null,
        status: 'calm',
      });
    }

    // Query crisis alerts for all linked students
    const { data, error } = await supabase
      .from('crisis_alerts')
      .select('crisis_level, created_at')
      .in('student_id', studentIds)
      .gte('created_at', weekAgo);

    // La tabla puede no existir en algún entorno: el acompañamiento sigue "activo".
    // 42P01 = undefined_table (Postgres crudo); PGRST205 = tabla ausente del
    // schema cache (lo que devuelve PostgREST/Supabase en la práctica).
    if (error && error.code !== '42P01' && error.code !== 'PGRST205') {
      throw error;
    }

    const alerts = Array.isArray(data) ? data : [];
    const recentAlerts = alerts.length;
    const highAlerts = alerts.filter((a) => a.crisis_level === 'high').length;
    const lastAlertAt = alerts
      .map((a) => a.created_at)
      .sort()
      .pop() || null;

    return res.status(200).json({
      // El acompañamiento de bienestar por IA siempre está activo.
      monitoring: true,
      recentAlerts,   // conteo agregado, sin contenido
      highAlerts,
      lastAlertAt,
      // Mensaje listo para mostrar al padre
      status: highAlerts > 0 ? 'attention' : 'calm',
    });
  } catch (e) {
    console.error('Error obteniendo estado de bienestar:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/smartboard/delete-user-data:
 *   delete:
 *     summary: Eliminar todos los datos personales del usuario autenticado (GDPR-K / COPPA / Habeas Data)
 *     description: >
 *       Ejerce el derecho de supresión. Borra de forma permanente todos los datos del
 *       estudiante autenticado en Supabase. La identidad se toma del token, no del body,
 *       para impedir que un usuario borre datos de otro.
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos eliminados correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.delete('/delete-user-data', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  // La identidad SIEMPRE viene del token verificado, nunca del body (evita IDOR).
  const userId = req.userId;

  // Tablas keyed por auth id. Borrar la fila de `students` cascadea las 10 tablas
  // normalizadas (sessions, points_history, vak_results, etc.). Las tablas auxiliares
  // se borran explícitamente porque no cuelgan de students(id).
  const deletions = [
    { table: 'smartboard_kids_data', column: 'user_id' },
    { table: 'parent_consents', column: 'student_id' },
    { table: 'crisis_alerts', column: 'student_id' },
    { table: 'activity_log', column: 'user_id' },
    { table: 'students', column: 'auth_id' }, // cascada a tablas hijas
    { table: 'users', column: 'id' },
    { table: 'parent_student_links', column: 'student_user_id' },
    { table: 'parent_student_links', column: 'parent_user_id' },
  ];

  const results = {};
  let hadFatalError = false;

  for (const { table, column } of deletions) {
    try {
      const { error } = await supabase.from(table).delete().eq(column, userId);

      if (error) {
        // 42P01 = la tabla no existe en este entorno: es tolerable, se omite.
        if (error.code === '42P01') {
          results[table] = 'skipped (table not present)';
          continue;
        }
        results[table] = `error: ${error.message}`;
        hadFatalError = true;
        console.error(`[delete-user-data] Error borrando ${table}:`, error.message);
      } else {
        results[table] = 'deleted';
      }
    } catch (e) {
      results[table] = `error: ${e.message}`;
      hadFatalError = true;
      console.error(`[delete-user-data] Excepción borrando ${table}:`, e.message);
    }
  }

  if (hadFatalError) {
    return res.status(500).json({
      error: 'No se pudieron eliminar todos los datos. Intenta de nuevo o contacta soporte.',
      results,
    });
  }

  console.log(`[delete-user-data] Datos eliminados para usuario ${userId}`);
  return res.status(200).json({
    message: 'Todos tus datos han sido eliminados permanentemente.',
    results,
  });
});

/**
 * @swagger
 * /api/smartboard/student-profile:
 *   get:
 *     summary: Obtener perfil del estudiante (edad, VAK, colegio, grado)
 *     description: >
 *       Lee el perfil del estudiante autenticado desde la tabla students.
 *       Devuelve: age, VAK style, school, grade. La identidad viene del token.
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del estudiante
 *       404:
 *         description: Perfil no encontrado
 *       500:
 *         description: Error del servidor
 */
const STUDENT_PROFILE_FIELDS = 'id, name, age, vak_style, school, grade, avatar_url, email';

router.get('/student-profile', requireAuth, async (req, res) => {
  const userId = req.userId;

  try {
    const { data, error } = await supabase
      .from('students')
      .select(STUDENT_PROFILE_FIELDS)
      .eq('auth_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return createStudentProfile(res, userId, req.userEmail);
      }
      throw error;
    }

    if (!data) {
      return createStudentProfile(res, userId, req.userEmail);
    }

    res.json(serializeStudentProfile(data));
  } catch (e) {
    console.error('Error fetching student profile:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

function serializeStudentProfile(data) {
  return {
    studentId: data.id || null,
    name: data.name || null,
    age: data.age || null,
    vakStyle: data.vak_style || null,
    school: data.school || null,
    grade: data.grade || null,
    avatarUrl: data.avatar_url || null,
  };
}

async function createStudentProfile(res, userId, email) {
  const safeName = email ? email.split('@')[0] : 'Estudiante';
  const { data, error } = await supabase
    .from('students')
    .upsert(
      {
        auth_id: userId,
        name: safeName,
        email: email || null,
      },
      { onConflict: 'auth_id' },
    )
    .select(STUDENT_PROFILE_FIELDS)
    .single();

  if (error) {
    console.error('Error creating student profile:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.json(serializeStudentProfile(data));
}

/**
 * @swagger
 * /api/smartboard/student-profile:
 *   put:
 *     summary: Actualizar perfil del estudiante (edad, VAK, colegio, grado)
 *     description: >
 *       Actualiza los datos del estudiante autenticado en la tabla students.
 *       Campos: age, vakStyle, school, grade. La identidad viene del token.
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: integer
 *               vakStyle:
 *                 type: string
 *               school:
 *                 type: string
 *               grade:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.put('/student-profile', requireAuth, async (req, res) => {
  const userId = req.userId;
  const { name, age, vakStyle, school, grade, avatarUrl } = req.body || {};

  // Validación básica
  if (age !== undefined && (typeof age !== 'number' || age < 5 || age > 25)) {
    return res.status(400).json({ error: 'age debe ser un número entre 5 y 25' });
  }

  if (name !== undefined && (typeof name !== 'string' || !name.trim() || name.trim().length > 80)) {
    return res.status(400).json({ error: 'name debe ser un string de 1 a 80 caracteres' });
  }

  if (avatarUrl !== undefined && avatarUrl !== null && typeof avatarUrl !== 'string') {
    return res.status(400).json({ error: 'avatarUrl debe ser un string o null' });
  }

  if (vakStyle !== undefined) {
    const VAK_STYLES = ['visual', 'auditivo', 'kinestesico', 'auditory', 'kinesthetic'];
    if (typeof vakStyle !== 'string' || !VAK_STYLES.includes(vakStyle)) {
      return res.status(400).json({ error: 'vakStyle debe ser visual, auditivo o kinestésico' });
    }
  }

  if (school && typeof school !== 'string') {
    return res.status(400).json({ error: 'school debe ser un string' });
  }

  if (grade && typeof grade !== 'string') {
    return res.status(400).json({ error: 'grade debe ser un string' });
  }

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (age !== undefined) updateData.age = age;
    if (school !== undefined) updateData.school = school;
    if (grade !== undefined) updateData.grade = grade;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
    // vak_style column added by migration 040; include only if the value is provided
    if (vakStyle !== undefined) updateData.vak_style = vakStyle;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    const doUpdate = async (fields) => {
      let result = await supabase
        .from('students')
        .update(fields)
        .eq('auth_id', userId)
        .select(STUDENT_PROFILE_FIELDS)
        .single();

      // Row not found → upsert (first save for this user)
      if (result.error && result.error.code === 'PGRST116') {
        result = await supabase
          .from('students')
          .upsert(
            {
              auth_id: userId,
              name: fields.name || (req.userEmail ? req.userEmail.split('@')[0] : 'Estudiante'),
              email: req.userEmail || null,
              ...fields,
            },
            { onConflict: 'auth_id' },
          )
          .select(STUDENT_PROFILE_FIELDS)
          .single();
      }
      return result;
    };

    let result = await doUpdate(updateData);

    // If vak_style column doesn't exist yet (migration 040 pending), retry without it
    if (result.error && result.error.message && result.error.message.includes('vak_style')) {
      const { vak_style, ...fieldsWithoutVak } = updateData; // eslint-disable-line no-unused-vars
      if (Object.keys(fieldsWithoutVak).length > 0) {
        result = await doUpdate(fieldsWithoutVak);
      }
    }

    if (result.error) {
      throw result.error;
    }

    res.json({
      message: 'Perfil actualizado correctamente',
      profile: serializeStudentProfile(result.data),
    });
  } catch (e) {
    console.error('Error updating student profile:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/smartboard/student-profile/avatar:
 *   post:
 *     summary: Subir foto de perfil del estudiante a Supabase Storage
 *     description: >
 *       Recibe la imagen como data URL base64 (PNG/JPEG/WebP, máx. 2MB),
 *       la guarda en el bucket 'avatars' y actualiza students.avatar_url.
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Foto subida y avatar_url actualizado
 *       400:
 *         description: dataUrl inválido o demasiado grande
 *       500:
 *         description: Error del servidor
 */
router.post('/student-profile/avatar', requireAuth, async (req, res) => {
  const userId = req.userId;
  const { dataUrl } = req.body || {};

  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return res.status(400).json({ error: 'dataUrl debe ser una imagen base64 (data:image/...)' });
  }

  const headerMatch = dataUrl.match(/^data:(image\/(png|jpeg|webp));base64,/);
  if (!headerMatch) {
    return res.status(400).json({ error: 'Formato de imagen no soportado (usa PNG, JPEG o WebP)' });
  }

  const base64Data = dataUrl.split(',')[1] || '';
  const imageBuffer = Buffer.from(base64Data, 'base64');

  if (imageBuffer.length === 0) {
    return res.status(400).json({ error: 'La imagen está vacía' });
  }

  if (imageBuffer.length > 2 * 1024 * 1024) {
    return res.status(400).json({ error: 'La imagen supera el máximo de 2MB' });
  }

  const extensions = { png: 'png', jpeg: 'jpg', webp: 'webp' };
  const ext = extensions[headerMatch[2]];

  try {
    const fileName = `student-avatars/${userId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, imageBuffer, {
        contentType: headerMatch[1],
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Supabase upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('students')
      .update({ avatar_url: publicUrlData.publicUrl })
      .eq('auth_id', userId);

    if (updateError) {
      throw updateError;
    }

    res.json({ avatarUrl: publicUrlData.publicUrl });
  } catch (e) {
    console.error('Error uploading student avatar:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET/POST /api/smartboard/student-progress
 * Load or save subject progress (subjectTime, sessions) to students.progress_json.
 * Fallback for SmartBoard progress tracking when localStorage is lost.
 */
router.get('/student-progress', requireAuth, async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { data: student } = await supabase
      .from('students')
      .select('id, progress_json')
      .eq('auth_id', userId)
      .maybeSingle();

    if (!student) {
      // Create student profile if missing
      const { data: profile } = await supabase
        .from('users')
        .select('first_name, last_name, username, email')
        .eq('id', userId)
        .maybeSingle();

      const studentName =
        [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim() ||
        profile?.username ||
        (profile?.email ? profile.email.split('@')[0] : 'Estudiante');

      const { data: created } = await supabase
        .from('students')
        .insert([{ auth_id: userId, name: studentName, age: 12, email: profile?.email }])
        .select('id, progress_json')
        .single();

      return res.json({ subjectTime: {}, sessions: [] });
    }

    const progress = student.progress_json || {};
    res.json({ subjectTime: progress.subjectTime || {}, sessions: progress.sessions || [] });
  } catch (e) {
    console.error('student-progress get error:', e.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/student-progress', requireAuth, async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { subjectTime, sessions } = req.body || {};

  try {
    // Ensure student exists
    const { data: existing } = await supabase
      .from('students')
      .select('id')
      .eq('auth_id', userId)
      .maybeSingle();

    const studentId = existing?.id || (
      await supabase
        .from('students')
        .insert([{ auth_id: userId, name: 'Estudiante', age: 12 }])
        .select('id')
        .single()
    ).data?.id;

    if (!studentId) {
      return res.status(500).json({ error: 'Could not create student profile' });
    }

    // Update progress_json
    const { error: updateErr } = await supabase
      .from('students')
      .update({ progress_json: { subjectTime, sessions } })
      .eq('id', studentId);

    if (updateErr) {
      console.error('student-progress update error:', updateErr.message);
      return res.status(500).json({ error: updateErr.message });
    }

    res.json({ success: true });
  } catch (e) {
    console.error('student-progress post error:', e.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

/**
 * GET/POST /api/smartboard/student-grades
 * Load or save student grades (calificaciones) to students.grades_json (JSONB).
 * Fallback for GradeScanner when localStorage is lost or across devices.
 */
router.get('/student-grades', requireAuth, async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // 1. Get or create student profile (same logic as /student-profile)
    let student = await supabase
      .from('students')
      .select('id, grades_json')
      .eq('auth_id', userId)
      .maybeSingle();

    if (!student.data) {
      const { data: profile } = await supabase
        .from('users')
        .select('first_name, last_name, username, email')
        .eq('id', userId)
        .maybeSingle();

      const studentName =
        [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim() ||
        profile?.username ||
        (profile?.email ? profile.email.split('@')[0] : 'Estudiante');

      const { data: created, error: createErr } = await supabase
        .from('students')
        .insert([{ auth_id: userId, name: studentName, age: 12, email: profile?.email }])
        .select('id, grades_json')
        .single();

      if (createErr && !createErr.message?.includes('duplicate')) {
        console.error('student create error:', createErr.message);
        return res.status(500).json({ error: createErr.message });
      }

      student = { data: created || (await supabase.from('students').select('id, grades_json').eq('auth_id', userId).maybeSingle()).data };
    }

    const grades = student.data?.grades_json || [];
    res.json({ grades });
  } catch (e) {
    console.error('student-grades get error:', e.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/student-grades', requireAuth, async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { grades } = req.body || {};
  if (!Array.isArray(grades)) {
    return res.status(400).json({ error: 'grades must be an array' });
  }

  try {
    // Ensure student exists first
    const { data: existing } = await supabase
      .from('students')
      .select('id')
      .eq('auth_id', userId)
      .maybeSingle();

    const studentId = existing?.id || (
      await supabase
        .from('students')
        .insert([{ auth_id: userId, name: 'Estudiante', age: 12 }])
        .select('id')
        .single()
    ).data?.id;

    if (!studentId) {
      return res.status(500).json({ error: 'Could not create student profile' });
    }

    // Update grades_json column
    const { error: updateErr } = await supabase
      .from('students')
      .update({ grades_json: grades })
      .eq('id', studentId);

    if (updateErr) {
      console.error('student-grades update error:', updateErr.message);
      return res.status(500).json({ error: updateErr.message });
    }

    res.json({ success: true, grades });
  } catch (e) {
    console.error('student-grades post error:', e.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
