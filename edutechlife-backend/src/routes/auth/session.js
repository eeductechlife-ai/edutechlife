const { Router } = require('express');
const supabase = require('../../db/supabase');
const authService = require('../../services/authService');
const { resolveEmailFromIdentifier } = require('./helpers');

const router = Router();

/**
 * POST /api/auth/parent-register
 * Crea una cuenta de padre vinculada al email del estudiante.
 * El padre usa el mismo email pero diferente contraseña.
 */
router.post('/parent-register', async (req, res) => {
  const { studentEmail, parentPassword, parentName, invitationToken } = req.body || {};
  try {
    const result = await authService.signUpParent({ studentEmail, parentPassword, parentName, invitationToken });
    res.status(201).json(result);
  } catch (e) {
    console.error('Parent register error:', e.message);
    res.status(400).json({ error: e.message });
  }
});

/**
 * POST /api/auth/parent-login
 * Inicia sesión como padre usando el email del estudiante + contraseña del padre.
 */
router.post('/parent-login', async (req, res) => {
  const { studentEmail, parentPassword } = req.body || {};
  try {
    const result = await authService.signInParent({ studentEmail, parentPassword });
    res.json(result);
  } catch (e) {
    console.error('Parent login error:', e.message);
    const status = e.message.includes('Contraseña incorrecta') ? 401 : 400;
    res.status(status).json({ error: e.message });
  }
});

/**
 * POST /api/auth/signup
 * Crear nuevo usuario con email + contraseña
 */
router.post('/signup', async (req, res) => {
  const { email, password, username, firstName, lastName, accountType } = req.body || {};

  // Solo se aceptan los dos productos; cualquier otro valor cae en 'ialab'
  // (comportamiento histórico) para no romper clientes existentes.
  const safeAccountType = accountType === 'smartboard' ? 'smartboard' : 'ialab';

  try {
    const result = await authService.signUp({
      email,
      password,
      username,
      firstName,
      lastName,
      userType: 'student',
      accountType: safeAccountType,
    });

    // SmartBoard students need a row in `students` so that timetable,
    // sessions, and other SmartBoard features can reference it via students.auth_id.
    if (safeAccountType === 'smartboard' && result.user?.id) {
      const studentName =
        [firstName, lastName].filter(Boolean).join(' ').trim() ||
        username ||
        String(email).split('@')[0];
      const { error: studentErr } = await supabase
        .from('students')
        .insert([{ auth_id: result.user.id, name: studentName, age: 12, email }])
        .select()
        .maybeSingle();
      if (studentErr && !studentErr.message?.includes('duplicate')) {
        console.error('Auto-create student profile failed:', studentErr.message);
      }
    }

    res.status(201).json(result);
  } catch (e) {
    console.error('Signup error:', e.message);
    const statusCode = e.message.includes('Email') ? 400 : 400;
    res.status(statusCode).json({ error: e.message });
  }
});

/**
 * POST /api/auth/login
 * Iniciar sesión con email + contraseña
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  try {
    // Accepts email OR username — resolve username to email first.
    const resolvedEmail = await resolveEmailFromIdentifier(email);
    if (!resolvedEmail) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const result = await authService.signIn({ email: resolvedEmail, password });

    // Best-effort: ensure SmartBoard students have a row in `students` so the
    // timetable and other SmartBoard features work. Handles accounts created
    // before the signup route started auto-creating this row.
    if (result.user?.id) {
      (async () => {
        try {
          const { data: profile } = await supabase
            .from('users')
            .select('first_name, last_name, username, account_type')
            .eq('id', result.user.id)
            .maybeSingle();
          if (profile?.account_type === 'smartboard') {
            const { data: existing } = await supabase
              .from('students')
              .select('id')
              .eq('auth_id', result.user.id)
              .maybeSingle();
            if (!existing) {
              const studentName =
                [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() ||
                profile.username ||
                resolvedEmail.split('@')[0];
              await supabase
                .from('students')
                .insert([{ auth_id: result.user.id, name: studentName, age: 12, email: resolvedEmail }]);
            }
          }
        } catch (e) {
          console.error('ensure-student-profile on login failed:', e.message);
        }
      })();
    }

    res.json(result);
  } catch (e) {
    console.error('Login error:', e.message);
    const statusCode = e.message.includes('Invalid') ? 401 : 400;
    res.status(statusCode).json({ error: e.message });
  }
});

/**
 * POST /api/auth/logout
 * Cerrar sesión
 */
router.post('/logout', (req, res) => {
  // Client clears tokens from localStorage; backend is best-effort
  // (Supabase sessions are managed client-side)
  res.json({ message: 'Logged out successfully' });
});

/**
 * POST /api/auth/refresh
 * Refrescar token de acceso
 */
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body || {};

  try {
    const result = await authService.refreshSession(refreshToken);
    res.json(result);
  } catch (e) {
    console.error('Refresh error:', e.message);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

/**
 * POST /api/auth/reset-password
 * Send a password reset email so the user can set/recover their password.
 * Useful for accounts created through OAuth, which have no password.
 *
 * Body: { email: string (required) }
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { email: identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({
        error: 'missing_fields',
        message: 'El correo o usuario es requerido.',
      });
    }

    // Accepts an email or a username, same as /login.
    const email = await resolveEmailFromIdentifier(identifier);

    if (email) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${frontendUrl}/auth/reset-password`,
      });
      if (error) console.error('Reset password error:', error);
    }

    // Always return success: never reveal whether an email is registered.
    res.json({
      success: true,
      message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({
      error: 'internal_error',
      message: 'Error interno del servidor.',
    });
  }
});

module.exports = router;
