const supabase = require('../db/supabase');

/**
 * Sign up a new user with email + password
 * Creates auth.users entry + users profile
 */
async function signUp({ email, password, username, firstName, lastName, userType = 'student' }) {
  if (!email || !password) {
    throw new Error('Email and password required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  try {
    // 1. Create auth user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(`Auth signup failed: ${authError.message}`);
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error('Failed to create auth user');
    }

    // 2. Create user profile (use userId as clerk_id for native auth)
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
          clerk_id: userId,
        },
      ])
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation failed:', profileError);
      // Auth user created but profile failed — may need manual cleanup
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    return {
      user: {
        id: userId,
        email,
        username: profileData.username,
        firstName,
        lastName,
        userType,
      },
      message: 'Sign up successful. Please check your email to confirm.',
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
    // Sign in via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
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

    if (profileError) {
      console.error('Profile fetch failed:', profileError);
      // Auth succeeded but profile missing — create minimal one
      await supabase.from('users').insert([
        {
          id: authData.user.id,
          email,
          username: email.split('@')[0],
          user_type: 'student',
        },
      ]);
    }

    return {
      token: session.access_token,
      refreshToken: session.refresh_token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username: profileData?.username || email.split('@')[0],
        firstName: profileData?.first_name,
        lastName: profileData?.last_name,
        userType: profileData?.user_type || 'student',
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
    const { data: authData, error: authError } = await supabase.auth.refreshSession({
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

module.exports = {
  signUp,
  signIn,
  refreshSession,
  signOut,
};
