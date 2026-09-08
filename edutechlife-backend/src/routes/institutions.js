const { Router } = require('express');
const supabase = require('../db/supabase');
const { requireAdmin } = require('../middleware/adminAuth');
const { requireAuth } = require('../middleware/auth');

const router = Router();

/**
 * GET /api/institutions
 * Admin: list all institutions with member counts.
 */
router.get('/', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('institutions')
    .select('id, name, slug, country, plan_type, is_active, created_at')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * POST /api/institutions
 * Admin: create a new institution.
 */
router.post('/', requireAdmin, async (req, res) => {
  const { name, slug, country = 'CO', plan_type = 'free', contact_email } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'name es requerido' });
  }
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: 'slug debe contener solo letras minúsculas, números y guiones' });
  }

  const { data, error } = await supabase
    .from('institutions')
    .insert({ name: name.trim(), slug, country, plan_type, contact_email: contact_email || null })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'El slug ya existe' });
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

/**
 * PATCH /api/institutions/:id/assign-user
 * Admin: assign an authenticated user to an institution.
 */
router.patch('/:id/assign-user', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body || {};

  if (!user_id) return res.status(400).json({ error: 'user_id es requerido' });

  const { error } = await supabase
    .from('users')
    .update({ institution_id: id })
    .eq('id', user_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Usuario asignado a institución', institution_id: id, user_id });
});

/**
 * GET /api/institutions/my
 * Authenticated user: returns own institution data.
 */
router.get('/my', requireAuth, async (req, res) => {
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('institution_id')
    .eq('id', req.userId)
    .single();

  if (userErr || !user?.institution_id) {
    return res.json({ institution: null });
  }

  const { data, error } = await supabase
    .from('institutions')
    .select('id, name, slug, country, plan_type')
    .eq('id', user.institution_id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ institution: data });
});

module.exports = router;
