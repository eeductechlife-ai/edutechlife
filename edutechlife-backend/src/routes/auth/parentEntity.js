const { Router } = require('express');
const supabase = require('../../db/supabase');

const router = Router();

/**
 * POST /api/auth/parent-entity/register
 *
 * Registers a parent as a first-class entity (table `parents`) with their own
 * real email address — no alias trick. The legacy `+padre` alias system in
 * authService.js remains active for existing accounts; this endpoint is for
 * new registrations and will eventually replace the alias approach.
 *
 * Body: { parentEmail, parentPassword, parentName, studentEmail, invitationToken }
 */
router.post('/parent-entity/register', async (req, res) => {
  const { parentEmail, parentPassword, parentName, studentEmail, invitationToken } = req.body;

  if (!parentEmail || !parentPassword || !studentEmail || !invitationToken) {
    return res.status(400).json({
      error: 'parentEmail, parentPassword, studentEmail e invitationToken son requeridos',
    });
  }
  if (parentPassword.length < 10) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 10 caracteres' });
  }

  const normalizedParentEmail = String(parentEmail).toLowerCase().trim();
  const normalizedStudentEmail = String(studentEmail).toLowerCase().trim();

  try {
    // 1. Find student record
    const { data: studentProfile, error: sErr } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedStudentEmail)
      .maybeSingle();

    if (sErr || !studentProfile?.id) {
      return res.status(404).json({ error: 'No existe una cuenta de estudiante con ese correo' });
    }

    // 2. Validate invitation token against a verified parental consent
    const { data: consent } = await supabase
      .from('parent_consents')
      .select('verification_status')
      .eq('student_id', studentProfile.id)
      .eq('verification_token', invitationToken)
      .maybeSingle();

    if (!consent || consent.verification_status !== 'verified') {
      return res.status(403).json({
        error: 'El código de invitación no es válido o el consentimiento no está verificado',
      });
    }

    // 3. Check if parent email already exists in parents table
    const { data: existing } = await supabase
      .from('parents')
      .select('id')
      .eq('email', normalizedParentEmail)
      .maybeSingle();


    if (existing) {
      return res.status(409).json({
        error: 'Ya existe una cuenta de padre con ese correo. Inicia sesión.',
      });
    }

    // 4. Create Supabase auth user with the real parent email
    const [firstName, ...rest] = (parentName || 'Padre/Madre').split(' ');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: normalizedParentEmail,
      password: parentPassword,
      email_confirm: true,
      user_metadata: {
        role: 'parent',
        student_email: normalizedStudentEmail,
        student_id: studentProfile.id,
        first_name: firstName,
        last_name: rest.join(' ') || '',
      },
    });

    if (authError) {
      const msg = (authError.message || '').toLowerCase();
      if (msg.includes('already') || msg.includes('exists')) {
        return res.status(409).json({ error: 'Ya existe una cuenta con ese correo.' });
      }
      return res.status(500).json({ error: `Error al crear cuenta: ${authError.message}` });
    }

    const authUserId = authData.user?.id;
    if (!authUserId) return res.status(500).json({ error: 'Error al crear cuenta' });

    // 5. Insert into parents entity table (uses existing column names: auth_id, name)
    const { error: parentInsertErr } = await supabase.from('parents').insert({
      auth_id: authUserId,
      email: normalizedParentEmail,
      name: parentName || null,
      student_id: studentProfile.id,
      student_auth_id: null,
      verified_at: new Date().toISOString(),
    });

    if (parentInsertErr) {
      // Rollback auth user creation on DB failure
      await supabase.auth.admin.deleteUser(authUserId).catch(() => {});
      return res.status(500).json({ error: 'Error al registrar perfil de padre' });
    }

    return res.status(201).json({
      message: 'Cuenta de padre creada exitosamente',
      email: normalizedParentEmail,
    });
  } catch (err) {
    console.error('[parent-entity/register] error:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
