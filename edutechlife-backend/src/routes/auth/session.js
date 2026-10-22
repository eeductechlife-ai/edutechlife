const { Router } = require('express');
const supabase = require('../../db/supabase');
const authService = require('../../services/authService');
const { resolveEmailFromIdentifier } = require('./helpers');
const { avisarInicioSesionMenor } = require('../../services/avisoPadreLogin');
const adultoObligatorio = require('../../services/adultoObligatorio');

const router = Router();

/**
 * POST /api/auth/parent-register
 * RETIRADO (auditoría S10, 2026-10-22): ya no se crean cuentas de padre con el
 * alias «+padre» del correo del estudiante. El padre se registra desde la
 * invitación que llega a su correo (ver /api/auth/adulto-menor/registrar).
 * Las cuentas de padre que ya existen siguen entrando por /parent-login.
 */
router.post('/parent-register', (req, res) => {
  res.status(410).json({
    error:
      'El registro de padres con alias ya no está disponible. Revisa tu correo: ahí llega la invitación de tu hijo/a para crear tu cuenta de padre, madre o acudiente.',
    motivo: 'alias_retirado',
  });
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
  const { email, password, username, firstName, lastName, accountType, edad, rangoEdad, adulto } = req.body || {};

  // Solo se aceptan los dos productos; cualquier otro valor cae en 'ialab'
  // (comportamiento histórico) para no romper clientes existentes.
  const safeAccountType = accountType === 'smartboard' ? 'smartboard' : 'ialab';

  // IngenIA: la edad es la real que escribe el estudiante (6 a 16, el mismo
  // rango que la tabla students). Antes se guardaba un 12 fijo.
  let edadIngenia = null;
  if (safeAccountType === 'smartboard') {
    try {
      edadIngenia = adultoObligatorio.validarEdadIngenia(edad);
    } catch (e) {
      return res.status(e.status || 400).json({ error: e.message });
    }
  }

  // Adulto obligatorio (ADULTO_OBLIGATORIO): se valida ANTES de crear la cuenta,
  // así un menor sin adulto válido no deja cuenta ni correo.
  let adultoDelMenor = null;
  if (adultoObligatorio.estaActivo()) {
    const menor = adultoObligatorio.esMenor({ edad: edadIngenia, rangoEdad });
    if (menor === null) {
      return res.status(400).json({ error: 'Indica tu edad para crear la cuenta' });
    }
    try {
      adultoDelMenor = adultoObligatorio.validarAdulto({ menor, correoEstudiante: email, adulto });
    } catch (e) {
      return res.status(e.status || 400).json({ error: e.message });
    }
  }

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

    // IngenIA students need a row in `students` so that timetable,
    // sessions, and other IngenIA features can reference it via students.auth_id.
    if (safeAccountType === 'smartboard' && result.user?.id) {
      const studentName =
        [firstName, lastName].filter(Boolean).join(' ').trim() ||
        username ||
        String(email).split('@')[0];
      const { error: studentErr } = await supabase
        .from('students')
        .insert([{ auth_id: result.user.id, name: studentName, age: edadIngenia, email }])
        .select()
        .maybeSingle();
      if (studentErr && !studentErr.message?.includes('duplicate')) {
        console.error('Auto-create student profile failed:', studentErr.message);
      }
    }

    // Menor con adulto válido: se marca la cuenta y se invita al adulto.
    // Un fallo aquí no deshace el alta (la cuenta ya existe): se registra y se
    // informa en la respuesta para reenviar la invitación.
    if (adultoDelMenor && result.user?.id) {
      try {
        await adultoObligatorio.marcarMenorConAdulto(result.user.id);
        await adultoObligatorio.crearInvitacion({
          estudianteId: result.user.id,
          correo: adultoDelMenor.correo,
          nombre: adultoDelMenor.nombre,
        });
        result.adultoInvitado = true;
      } catch (invitacionError) {
        console.error('[adulto-obligatorio] invitación fallida:', invitacionError.message);
        result.adultoInvitado = false;
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

    // Best-effort: ensure IngenIA students have a row in `students` so the
    // timetable and other IngenIA features work. Handles accounts created
    // before the signup route started auto-creating this row.
    if (result.user?.id) {
      // Aviso al padre si el niño es menor (máximo uno cada 24 h). No se espera
      // y nunca lanza: el inicio de sesión no depende del correo.
      avisarInicioSesionMenor(result.user.id).catch(() => {});

      (async () => {
        try {
          const { data: profile } = await supabase
            .from('users')
            .select('first_name, last_name, username, account_type, user_type')
            .eq('id', result.user.id)
            .maybeSingle();
          // Los padres de IngenIA también son account_type 'smartboard', pero
          // no son estudiantes: no se les crea fila en students.
          if (profile?.account_type === 'smartboard' && profile?.user_type !== 'parent') {
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
