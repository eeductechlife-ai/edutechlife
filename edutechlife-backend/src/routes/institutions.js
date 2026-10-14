const { Router } = require('express');
const supabase = require('../db/supabase');
const { requireAdmin } = require('../middleware/adminAuth');
const { requireAuth } = require('../middleware/auth');
const { assertStudentAccess } = require('../middleware/ownership');
const {
  generateCode,
  joinSchoolWithCode,
  getSchoolOverview,
} = require('../services/schoolService');

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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Dar Premium a estudiantes o nombrar rectores: solo admin (no content_creator).
function requireFullAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Solo administradores' });
  next();
}

/**
 * POST /api/institutions/join
 * Padre (o el propio estudiante): liga al estudiante a su colegio con el
 * código que entregó el colegio. Body: { studentId, code }.
 */
router.post('/join', requireAuth, async (req, res) => {
  const { studentId, code } = req.body || {};
  if (!studentId || !UUID_RE.test(String(studentId))) {
    return res.status(400).json({ error: 'studentId requerido' });
  }
  if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Código requerido' });

  // El panel de padres guarda a veces el auth_id del niño en vez de students.id.
  const { data: student } = await supabase
    .from('students')
    .select('id')
    .or(`id.eq.${studentId},auth_id.eq.${studentId}`)
    .limit(1)
    .maybeSingle();
  if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

  const access = await assertStudentAccess(req, student.id);
  if (!access.ok) {
    return res.status(access.status === 404 ? 404 : 403).json({ error: 'No autorizado para este estudiante' });
  }

  const result = await joinSchoolWithCode({ studentId: access.studentId, code });
  if (result.error) return res.status(result.status).json({ error: result.error });
  res.json(result);
});

/**
 * GET /api/institutions/my/overview
 * Rector o docente: resumen agregado de su colegio por grupo.
 */
router.get('/my/overview', requireAuth, async (req, res) => {
  const result = await getSchoolOverview(req.userId);
  if (result.error) return res.status(result.status).json({ error: result.error });
  res.json(result);
});

/**
 * POST /api/institutions/:id/codes
 * Admin: crea un código de colegio. Body: { grupo?, max_uses, expires_at? }.
 */
router.post('/:id/codes', requireAdmin, requireFullAdmin, async (req, res) => {
  const { id } = req.params;
  const { grupo, max_uses: maxUses, expires_at: expiresAt } = req.body || {};
  if (!UUID_RE.test(id)) return res.status(400).json({ error: 'id no válido' });
  if (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > 5000) {
    return res.status(400).json({ error: 'max_uses debe ser un entero entre 1 y 5000' });
  }
  if (grupo != null && (typeof grupo !== 'string' || grupo.trim().length > 40)) {
    return res.status(400).json({ error: 'grupo no válido' });
  }
  if (expiresAt != null && Number.isNaN(Date.parse(expiresAt))) {
    return res.status(400).json({ error: 'expires_at no es una fecha' });
  }

  const { data, error } = await supabase
    .from('institution_codes')
    .insert({
      code: generateCode(),
      institution_id: id,
      grupo: grupo ? grupo.trim() : null,
      max_uses: maxUses,
      expires_at: expiresAt || null,
    })
    .select('code, grupo, max_uses, uses, expires_at')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * POST /api/institutions/:id/members
 * Admin: nombra rector o docente a un usuario. Body: { user_id, rol }.
 */
router.post('/:id/members', requireAdmin, requireFullAdmin, async (req, res) => {
  const { id } = req.params;
  const { user_id: userId, rol } = req.body || {};
  if (!UUID_RE.test(id) || !UUID_RE.test(String(userId || ''))) {
    return res.status(400).json({ error: 'id y user_id deben ser UUID' });
  }
  if (!['rector', 'docente'].includes(rol)) {
    return res.status(400).json({ error: "rol debe ser 'rector' o 'docente'" });
  }

  const { error } = await supabase
    .from('institution_members')
    .upsert({ institution_id: id, user_id: userId, rol }, { onConflict: 'institution_id,user_id' });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ institution_id: id, user_id: userId, rol });
});

module.exports = router;
