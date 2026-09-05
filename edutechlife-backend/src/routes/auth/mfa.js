const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const mfaService = require('../../services/mfaService');
const supabase = require('../../db/supabase');

const router = Router();

/**
 * POST /api/auth/mfa/enroll
 * Generates a TOTP secret and QR code for the authenticated user.
 * Only admin/parent/educator roles can enroll.
 */
router.post('/mfa/enroll', requireAuth, async (req, res) => {
  try {
    const result = await mfaService.enroll(req.userId, req.userEmail);
    res.json({ qrDataUrl: result.qrDataUrl, otpauth: result.otpauth });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * POST /api/auth/mfa/verify-setup
 * Confirms MFA enrollment by verifying the first TOTP code.
 * Body: { code }
 */
router.post('/mfa/verify-setup', requireAuth, async (req, res) => {
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ error: 'Se requiere el código MFA.' });

  try {
    await mfaService.verifySetup(req.userId, String(code).trim());
    res.json({ ok: true, message: 'MFA activado correctamente.' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * POST /api/auth/mfa/verify-login
 * Exchanges a challenge token + TOTP code for the real JWT.
 * Body: { mfa_challenge_token, code }
 */
router.post('/mfa/verify-login', async (req, res) => {
  const { mfa_challenge_token, code } = req.body || {};
  if (!mfa_challenge_token || !code) {
    return res.status(400).json({ error: 'Se requieren el token de desafío y el código MFA.' });
  }

  try {
    const userId = await mfaService.verifyLoginChallenge(mfa_challenge_token, String(code).trim());

    // Fetch stored session tokens (saved in signIn() while MFA was pending)
    const { data: row } = await supabase
      .from('users')
      .select('email, username, first_name, last_name, user_type, mfa_session_token, mfa_session_refresh')
      .eq('id', userId)
      .single();

    if (!row?.mfa_session_token) {
      return res.status(401).json({ error: 'Sesión expirada. Inicia sesión de nuevo.' });
    }

    // Clear stored session tokens (single use)
    await supabase
      .from('users')
      .update({ mfa_session_token: null, mfa_session_refresh: null })
      .eq('id', userId);

    res.json({
      token: row.mfa_session_token,
      refreshToken: row.mfa_session_refresh,
      user: {
        id: userId,
        email: row.email,
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
        userType: row.user_type,
      },
    });
  } catch (e) {
    const status = e.message.includes('expiró') ? 401 : 400;
    res.status(status).json({ error: e.message });
  }
});

/**
 * POST /api/auth/mfa/disable
 * Disables MFA for the authenticated user.
 */
router.post('/mfa/disable', requireAuth, async (req, res) => {
  try {
    await mfaService.disable(req.userId);
    res.json({ ok: true, message: 'MFA desactivado.' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * GET /api/auth/mfa/status
 * Returns whether MFA is enabled for the authenticated user.
 */
router.get('/mfa/status', requireAuth, async (req, res) => {
  try {
    const { data } = await supabase
      .from('users')
      .select('mfa_enabled, user_type')
      .eq('id', req.userId)
      .single();
    res.json({
      mfa_enabled: data?.mfa_enabled || false,
      mfa_required: mfaService.requiresMfa(data?.user_type),
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
