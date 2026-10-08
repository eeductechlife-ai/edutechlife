const { Router } = require('express');
const supabase = require('../../db/supabase');
const { requireAuth } = require('../../middleware/auth');

const router = Router();

/**
 * GET/POST /api/ingenia/student-progress
 * Load or save subject progress (subjectTime, sessions) to students.progress_json.
 * Fallback for IngenIA progress tracking when localStorage is lost.
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

/**
 * Guarda una columna JSON del estudiante en UNA escritura. Antes cada guardado
 * hacía SELECT (¿existe?), a veces INSERT y luego UPDATE: hasta tres viajes a la
 * base por acción del estudiante. Ahora se actualiza directamente por auth_id y
 * solo si no había fila se crea, ya con el dato incluido.
 */
async function saveStudentJson(userId, column, value) {
  const { data: updated, error: updateErr } = await supabase
    .from('students')
    .update({ [column]: value })
    .eq('auth_id', userId)
    .select('id');
  if (updateErr) return { error: updateErr.message };
  if (Array.isArray(updated) && updated.length > 0) return { ok: true };

  const { data: created } = await supabase
    .from('students')
    .insert([{ auth_id: userId, name: 'Estudiante', age: 12, [column]: value }])
    .select('id')
    .single();
  if (!created?.id) return { error: 'Could not create student profile' };
  return { ok: true };
}

router.post('/student-progress', requireAuth, async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { subjectTime, sessions } = req.body || {};

  try {
    const saved = await saveStudentJson(userId, 'progress_json', { subjectTime, sessions });
    if (saved.error) {
      console.error('student-progress save error:', saved.error);
      return res.status(500).json({ error: saved.error });
    }
    res.json({ success: true });
  } catch (e) {
    console.error('student-progress post error:', e.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

/**
 * GET/POST /api/ingenia/student-grades
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
    const saved = await saveStudentJson(userId, 'grades_json', grades);
    if (saved.error) {
      console.error('student-grades save error:', saved.error);
      return res.status(500).json({ error: saved.error });
    }
    res.json({ success: true, grades });
  } catch (e) {
    console.error('student-grades post error:', e.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── Improvement Plan persistence (localStorage → learning_plans) ──────────────

router.get('/improvement-plan', requireAuth, async (req, res) => {
  try {
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('auth_id', req.userId)
      .maybeSingle();

    if (!student) return res.json({ plan: null, needsDiagnostic: true, currentFocus: null });

    const { data: plan, error } = await supabase
      .from('learning_plans')
      .select('plan_json')
      .eq('student_id', student.id)
      .eq('type', 'monthly')
      .eq('is_active', true)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== '42P01' && error.code !== 'PGRST205') throw error;

    res.json({
      plan: plan?.plan_json || null,
      needsDiagnostic: !plan?.plan_json,
      currentFocus: plan?.plan_json?.currentFocus || null,
    });
  } catch (e) {
    console.error('Error loading improvement plan:', e.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.put('/improvement-plan', requireAuth, async (req, res) => {
  const { plan } = req.body;
  if (!plan?.weeks) return res.status(400).json({ error: 'Plan inválido' });

  try {
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('auth_id', req.userId)
      .maybeSingle();

    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

    await supabase
      .from('learning_plans')
      .update({ is_active: false })
      .eq('student_id', student.id)
      .eq('type', 'monthly');

    const { error } = await supabase
      .from('learning_plans')
      .insert({
        student_id: student.id,
        type: 'monthly',
        plan_json: plan,
        is_active: true,
      });

    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error('Error saving improvement plan:', e.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
