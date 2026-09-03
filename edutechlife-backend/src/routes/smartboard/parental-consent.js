const { Router } = require('express');
const crypto = require('crypto');
const supabase = require('../../db/supabase');
const { requireAuth } = require('../../middleware/auth');
const { sendConsentVerificationEmail } = require('../../services/emailService');

const router = Router();

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

module.exports = router;
