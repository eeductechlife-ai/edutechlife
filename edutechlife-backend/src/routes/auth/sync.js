const { Router } = require('express');
const supabase = require('../../db/supabase');
const { requireAuth } = require('../../middleware/auth');

const router = Router();

/**
 * POST /api/auth/sync-user
 * Sync a newly registered Clerk user to Supabase
 *
 * Body:
 * {
 *   clerk_id: string (required)
 *   email: string (required)
 *   first_name: string
 *   last_name: string
 *   username: string
 *   phone_number: string
 *   user_type: string
 *   platform: string
 *   age_range: string
 *   registration_source: string
 * }
 */
router.post('/sync-user', requireAuth, async (req, res) => {
  try {
    const {
      clerk_id,
      email,
      first_name,
      last_name,
      username,
      phone_number,
      user_type,
      platform,
      age_range,
      registration_source,
    } = req.body;

    // El identity proviene del token validado (requireAuth). Rechazamos
    // cualquier intento de auto-omitir el auth indicando un clerk_id/email
    // que no corresponda a la sesión.
    if (!email && !req.userEmail) {
      return res.status(400).json({
        error: 'Missing required fields: clerk_id and email',
      });
    }

    const effectiveEmail = String(email || req.userEmail).toLowerCase();
    if (req.userEmail && effectiveEmail !== String(req.userEmail).toLowerCase()) {
      return res.status(403).json({
        error: 'Email does not match the authenticated session',
      });
    }
    if (clerk_id && req.userId && clerk_id !== req.userId) {
      return res.status(403).json({
        error: 'clerk_id does not match the authenticated session',
      });
    }

    // Insert or update user in Supabase
    const { data, error } = await supabase
      .from('users')
      .insert(
        [
          {
            clerk_id: clerk_id || req.userId,
            email: effectiveEmail,
            first_name: first_name || null,
            last_name: last_name || null,
            username: username || null,
            phone_number: phone_number || null,
            user_type: user_type || 'adult',
            platform: platform || 'ialab',
            age_range: age_range || '18+',
            registration_source: registration_source || 'ialab_signup',
          },
        ],
        { onConflict: 'clerk_id' } // If user already exists, skip (or update)
      )
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({
        error: 'Failed to sync user to Supabase',
      });
    }

    req.log.info('User synced to Supabase', {
      clerk_id,
      email,
      rows_affected: data?.length || 0,
    });

    res.status(201).json({
      success: true,
      message: 'User synced successfully',
      user: data?.[0] || null,
    });
  } catch (err) {
    console.error('Auth sync error:', err);
    req.log.error('Unexpected error in auth sync', { error: err.message });

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/auth/user/:clerk_id
 * Get user data from Supabase by Clerk ID
 *
 * Autenticado y con ownership: solo se puede leer el propio registro.
 */
router.get('/user/:clerk_id', requireAuth, async (req, res) => {
  try {
    const { clerk_id } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerk_id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'User not found' });
      }
      throw error;
    }

    // Ownership: la identidad hoy es el Supabase uid del JWT; el registro
    // legacy se vincula por email. Nadie debe leer perfiles ajenos.
    const normalized = (s) => String(s || '').toLowerCase();
    if (
      (!req.userEmail || normalized(data.email) !== normalized(req.userEmail)) &&
      data.clerk_id !== req.userId
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(data);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      error: 'Failed to fetch user',
    });
  }
});

module.exports = router;
