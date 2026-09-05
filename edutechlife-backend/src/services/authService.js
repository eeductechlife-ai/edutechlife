const supabase = require('../db/supabase');
const { createSessionClient } = require('../db/sessionClient');
const mfaService = require('./mfaService');

/**
 * Sign up a new user with email + password
 * Creates auth.users entry + users profile
 */
async function signUp({ email, password, username, firstName, lastName, userType = 'student', accountType = 'ialab' }) {
  if (!email || !password) {
    throw new Error('Email and password required');
  }

  if (password.length < 10) {
    throw new Error('Password must be at least 10 characters');
  }

  try {
    // 1. Create auth user via Supabase Admin API (bypasses email rate limit)
    // email_confirm: true auto-confirms so user can login immediately
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username: username || email.split('@')[0],
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (authError) {
      // Detect existing account and produce a friendlier message
      const msg = (authError.message || '').toLowerCase();
      if (msg.includes('already') || msg.includes('exists') || msg.includes('registered')) {
        throw new Error('Este correo ya está registrado. Inicia sesión.');
      }
      throw new Error(`Auth signup failed: ${authError.message}`);
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error('Failed to create auth user');
    }

    // 2. Create user profile (use userId as clerk_id for native auth)
    // Service-role client bypasses RLS
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email,
          username: username || email.split('@')[0],
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
          account_type: accountType,
          clerk_id: userId,
        },
      ])
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation failed:', profileError);
      // If profile already exists (rare), still consider signup a success
      if (profileError.message.includes('duplicate')) {
        return {
          user: { id: userId, email, username, firstName, lastName, userType },
          message: 'Cuenta creada exitosamente.',
        };
      }
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    // 3. Sign in the new user to return a session token immediately
    // Use a throwaway client: signInWithPassword saves a session on the client,
    // which would poison the shared service client (role=authenticated + RLS).
    const { data: signInData } = await createSessionClient().auth.signInWithPassword({
      email,
      password,
    });

    return {
      user: {
        id: userId,
        email,
        username: profileData.username,
        firstName,
        lastName,
        userType,
      },
      token: signInData?.session?.access_token || null,
      refreshToken: signInData?.session?.refresh_token || null,
      message: 'Cuenta creada exitosamente. Ya puedes iniciar sesión.',
    };
  } catch (e) {
    console.error('signUp error:', e.message);
    throw e;
  }
}

/**
 * Sign in user with email + password
 * Returns session token + user info
 */
async function signIn({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password required');
  }

  try {
    // Sign in via Supabase Auth (throwaway client — never pin a session on the
    // shared service client)
    const { data: authData, error: authError } = await createSessionClient().auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.status === 400) {
        throw new Error('Invalid email or password');
      }
      throw new Error(`Sign in failed: ${authError.message}`);
    }

    const session = authData.session;
    if (!session) {
      throw new Error('No session created');
    }

    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    let userProfile = profileData;
    if (profileError) {
      console.warn('Profile fetch failed:', profileError.message);
      // Auth succeeded but profile missing — create minimal one (service-role client bypasses RLS)
      const { data: createdProfile, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            username: email.split('@')[0],
            user_type: 'student',
            account_type: 'ialab',
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Profile creation failed:', insertError.message);
        // Continue anyway with minimal data
        userProfile = {
          username: email.split('@')[0],
          user_type: 'student',
        };
      } else {
        userProfile = createdProfile;
      }
    }

    const userType = userProfile?.user_type || 'student';

    // MFA gate: if the user has MFA enabled, store session tokens and return a challenge.
    if (mfaService.requiresMfa(userType) && userProfile?.mfa_enabled) {
      // Stash the real tokens temporarily so verify-login can retrieve them.
      await supabase
        .from('users')
        .update({
          mfa_session_token: session.access_token,
          mfa_session_refresh: session.refresh_token,
        })
        .eq('id', authData.user.id);

      const challengeToken = await mfaService.issueChallengeToken(authData.user.id);
      return { requires_mfa: true, mfa_challenge_token: challengeToken };
    }

    return {
      token: session.access_token,
      refreshToken: session.refresh_token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username: userProfile?.username || email.split('@')[0],
        firstName: userProfile?.first_name,
        lastName: userProfile?.last_name,
        userType,
      },
    };
  } catch (e) {
    console.error('signIn error:', e.message);
    throw e;
  }
}

/**
 * Refresh access token using refresh token
 */
async function refreshSession(refreshToken) {
  if (!refreshToken) {
    throw new Error('Refresh token required');
  }

  try {
    // Use a throwaway client — refreshSession pins the user session on the
    // client it runs on; pinning it on the shared service client would make
    // every subsequent data query send the user JWT (role=authenticated, RLS
    // applies), breaking profile lookups with PGRST116.
    const { data: authData, error: authError } = await createSessionClient().auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (authError) {
      throw new Error(`Refresh failed: ${authError.message}`);
    }

    const session = authData.session;
    if (!session) {
      throw new Error('No new session created');
    }

    return {
      token: session.access_token,
      refreshToken: session.refresh_token,
    };
  } catch (e) {
    console.error('refreshSession error:', e.message);
    throw e;
  }
}

/**
 * Sign out user (invalidate tokens)
 */
async function signOut(userId) {
  try {
    // Sign out all sessions for this user
    const { error } = await supabase.auth.admin.signOut(userId);

    if (error) {
      console.error('Supabase signOut error:', error.message);
      // Doesn't throw — logout is best-effort
    }

    return { message: 'Signed out successfully' };
  } catch (e) {
    console.error('signOut error:', e.message);
    // Still return success — client will clear tokens
    return { message: 'Signed out' };
  }
}

/**
 * Build the internal parent email alias for a given student email.
 * Parent: juan@gmail.com → juan+padre@gmail.com
 */
function buildParentEmail(studentEmail) {
  const [local, domain] = String(studentEmail || '').toLowerCase().split('@');
  if (!local || !domain) throw new Error('Email inválido');
  return `${local}+padre@${domain}`;
}

/**
 * Register a parent account linked to an existing student email.
 * The parent uses the same email as the student but a different password.
 * Internally we store the parent as `local+padre@domain`.
 */
async function signUpParent({ studentEmail, parentPassword, parentName, invitationToken }) {
  if (!studentEmail || !parentPassword) {
    throw new Error('El correo del estudiante y la contraseña son requeridos');
  }
  if (parentPassword.length < 10) {
    throw new Error('La contraseña debe tener al menos 10 caracteres');
  }
  if (!invitationToken) {
    throw new Error('Se requiere el código de invitación que genera el estudiante desde su cuenta');
  }

  const normalizedStudentEmail = String(studentEmail).toLowerCase().trim();
  const parentAuthEmail = buildParentEmail(normalizedStudentEmail);
  const [firstName, ...rest] = (parentName || 'Padre/Madre').split(' ');
  const lastName = rest.join(' ') || '';

  // Find the student's ID
  const { data: studentProfile } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedStudentEmail)
    .maybeSingle();
  if (!studentProfile?.id) {
    throw new Error('No existe una cuenta de estudiante con ese correo');
  }

  // Validate the invitation token against a VERIFIED parental consent.
  // The consent is created by the student's flow (POST /parental-consent) and
  // verified by email (POST /parental-consent/verify) before any parent
  // account can be created.
  const { data: consent } = await supabase
    .from('parent_consents')
    .select('verification_status')
    .eq('student_id', studentProfile.id)
    .eq('verification_token', invitationToken)
    .maybeSingle();
  if (!consent || consent.verification_status !== 'verified') {
    throw new Error('El código de invitación no es válido o el consentimiento no está verificado');
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: parentAuthEmail,
    password: parentPassword,
    email_confirm: true,
    user_metadata: {
      role: 'parent',
      student_email: normalizedStudentEmail,
      student_id: studentProfile.id,
      first_name: firstName,
      last_name: lastName,
    },
  });

  if (authError) {
    const msg = (authError.message || '').toLowerCase();
    if (msg.includes('already') || msg.includes('exists')) {
      throw new Error('Ya existe una cuenta de padre para este correo. Inicia sesión.');
    }
    throw new Error(`Error al crear cuenta: ${authError.message}`);
  }

  const userId = authData.user?.id;
  if (!userId) throw new Error('Error al crear cuenta');

  await supabase
    .from('users')
    .insert([{
      id: userId,
      email: parentAuthEmail,
      first_name: firstName,
      last_name: lastName,
      username: `padre_${normalizedStudentEmail.split('@')[0]}`,
      user_type: 'parent',
      clerk_id: userId,
      platform: 'smartboard',
    }])
    .select()
    .maybeSingle();

  // Link parent → student from the backend (service_role), never from the client.
  await supabase
    .from('parent_student_links')
    .upsert(
      {
        parent_user_id: userId,
        student_user_id: studentProfile.id,
        is_active: true,
      },
      { onConflict: 'parent_user_id,student_user_id' },
    );

  return { message: 'Cuenta de padre creada exitosamente. Ya puedes iniciar sesión.' };
}

/**
 * Sign in a parent using the student's email + parent password.
 * Returns a token with role=parent and the student's email for data lookup.
 */
async function signInParent({ studentEmail, parentPassword }) {
  if (!studentEmail || !parentPassword) {
    throw new Error('El correo del estudiante y la contraseña son requeridos');
  }

  const normalizedStudentEmail = String(studentEmail).toLowerCase().trim();
  const parentAuthEmail = buildParentEmail(normalizedStudentEmail);

  const { data: authData, error: authError } = await createSessionClient().auth.signInWithPassword({
    email: parentAuthEmail,
    password: parentPassword,
  });

  if (authError) {
    if (authError.status === 400) {
      throw new Error('Contraseña incorrecta o cuenta de padre no registrada para este correo');
    }
    throw new Error(`Error al iniciar sesión: ${authError.message}`);
  }

  const session = authData.session;
  if (!session) throw new Error('No se pudo crear la sesión');

  const meta = authData.user?.user_metadata || {};

  return {
    token: session.access_token,
    refreshToken: session.refresh_token,
    user: {
      id: authData.user.id,
      email: normalizedStudentEmail,
      role: 'parent',
      studentEmail: meta.student_email || normalizedStudentEmail,
      studentId: meta.student_id || null,
      firstName: meta.first_name || 'Padre',
      lastName: meta.last_name || '',
      userType: 'parent',
    },
  };
}

module.exports = {
  signUp,
  signIn,
  signUpParent,
  signInParent,
  refreshSession,
  signOut,
};
