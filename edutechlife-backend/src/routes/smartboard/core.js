const { Router } = require('express');
const supabase = require('../../db/supabase');
const { requireAuth } = require('../../middleware/auth');
const { requireVerifiedParentalConsent } = require('../../middleware/parentalConsent');
const { assertAuthIdAccess } = require('../../middleware/ownership');
const { buildWeeklySummary, renderWeeklyEmail, aggregateMasterySummary } = require('../../services/weeklyReport');
const { sendEmail } = require('../../services/emailService');
const { getStudentMastery } = require('../../services/competencyMastery');

const routeLogger = (req) => req.log || console;
const router = Router();

/**
 * GET /api/smartboard/data/:userId
 * Obtener datos del SmartBoard para un usuario
 */
router.get('/data/:userId', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const { userId } = req.params;

  const access = await assertAuthIdAccess(req, userId);
  if (!access.ok) {
    routeLogger(req).warn('[access-denied]', { requestId: req.id, userId: req.userId, resource: `smartboard_data:${userId}`, reason: access.reason });
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
 * GET /api/smartboard/progress/:userId
 * Obtener progreso del estudiante en SmartBoard
 */
router.get('/progress/:userId', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const { userId } = req.params;

  const access = await assertAuthIdAccess(req, userId);
  if (!access.ok) {
    routeLogger(req).warn('[access-denied]', { requestId: req.id, userId: req.userId, resource: `smartboard_progress:${userId}`, reason: access.reason });
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
 * POST /api/smartboard/weekly-report
 * Genera y envía por email el reporte semanal del hijo al padre
 */
router.post('/weekly-report', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const userId = req.userId;
  const { studentName, preview = false } = req.body || {};

  // Resolver students.id a partir del auth uid: los motores normalizados
  // (mastery, planes, memoria) están keyed por students.id.
  async function resolveStudentIdByAuthId(authId) {
    const { data } = await supabase
      .from('students')
      .select('id')
      .eq('auth_id', authId)
      .maybeSingle();
    return data?.id || null;
  }

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

    // 1b. Mastery data from adaptive engine (optional — non-blocking)
    let masterySummary = null;
    try {
      const studentId = await resolveStudentIdByAuthId(userId);
      if (!studentId) {
        routeLogger(req).warn('Weekly report: no students row for auth user', { userId });
      } else {
        const masteryRows = await getStudentMastery(studentId);
        if (masteryRows.length > 0) {
          masterySummary = aggregateMasterySummary(masteryRows);
        }
      }
    } catch (masteryErr) {
      routeLogger(req).error('Weekly report: mastery data unavailable', { error: masteryErr.message });
    }

    // Modo preview: útil para el frontend sin disparar correo
    if (preview) {
      return res.status(200).json({ summary, mastery: masterySummary });
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
      mastery: masterySummary,
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
      mastery: masterySummary,
    });
  } catch (e) {
    console.error('Error generando reporte semanal:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/smartboard/wellbeing-status
 * Estado agregado de bienestar del hijo para el padre (no expone contenido sensible)
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

router.get('/user-role', requireAuth, async (req, res) => {
  try {
    const { data: link } = await supabase
      .from('parent_student_links')
      .select('parent_user_id')
      .eq('parent_user_id', req.userId)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    return res.json({ role: link ? 'parent' : 'student' });
  } catch (e) {
    return res.status(500).json({ error: 'Error determining role' });
  }
});

/**
 * POST /api/smartboard/timetable
 * Creates or replaces the student's active timetable and all its slots atomically.
 */
router.post('/timetable', requireAuth, async (req, res) => {
  const userId = req.userId;
  const { meta = {}, slots = [] } = req.body || {};

  if (!Array.isArray(slots)) {
    return res.status(400).json({ error: 'slots must be an array' });
  }

  try {
    // 1. Resolve student
    const { data: studentRow, error: studentErr } = await supabase
      .from('students')
      .select('id')
      .eq('auth_id', userId)
      .maybeSingle();

    let studentId = studentRow?.id;

    if (studentErr && studentErr.code !== 'PGRST116') throw studentErr;

    if (!studentId) {
      // Create student row if missing
      const { data: newStudent, error: createErr } = await supabase
        .from('students')
        .upsert({ auth_id: userId, name: 'Estudiante', age: 13 }, { onConflict: 'auth_id' })
        .select('id')
        .single();
      if (createErr) throw createErr;
      studentId = newStudent.id;
    }

    // 2. Deactivate old timetables
    await supabase
      .from('student_timetable')
      .update({ is_active: false })
      .eq('student_id', studentId)
      .eq('is_active', true);

    // 3. Create new timetable header
    const { data: ttRow, error: ttErr } = await supabase
      .from('student_timetable')
      .insert({
        student_id: studentId,
        is_active: true,
        school_name: meta.school_name || null,
        term_label: meta.term_label || null,
        source: meta.source || 'scan',
      })
      .select('id')
      .single();

    if (ttErr) throw ttErr;
    const timetableId = ttRow.id;

    // 4. Insert slots
    let savedSlots = [];
    if (slots.length > 0) {
      const rows = slots.map((s) => ({
        timetable_id: timetableId,
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
        subject: s.subject,
        subject_label: s.subject_label || s.subject,
        teacher: s.teacher || null,
        room: s.room || null,
        color: s.color || null,
        notes: s.notes || null,
      }));

      const { data: insertedSlots, error: slotsErr } = await supabase
        .from('timetable_slots')
        .insert(rows)
        .select('*');

      if (slotsErr) throw slotsErr;
      savedSlots = insertedSlots || [];
    }

    return res.json({ timetableId, slotsCount: savedSlots.length, slots: savedSlots });
  } catch (e) {
    console.error('[timetable POST] Error:', e.message);
    return res.status(500).json({ error: e.message || 'Error guardando horario' });
  }
});

module.exports = router;
