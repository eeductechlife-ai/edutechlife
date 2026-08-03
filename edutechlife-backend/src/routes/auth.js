const express = require('express');
const crypto = require('crypto');
const supabase = require('../db/supabase');

const router = express.Router();

const OAUTH_PROVIDERS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userUrl: 'https://graph.facebook.com/v18.0/me',
  },
};

/**
 * Ensure the account has a row in the `users` profile table.
 *
 * Supabase Auth is the source of truth for identity; this table only holds the
 * profile. Historically an insert failure here left accounts with no profile
 * row, which then broke OAuth sign-in, so this is idempotent, self-healing and
 * never throws: a missing profile must not stop anyone from signing in.
 *
 * @returns {Promise<object|null>} the profile row, or null if it could not be created
 */
async function ensureProfileRow(userId, email, extra = {}) {
  const normalizedEmail = String(email || '').toLowerCase();
  if (!normalizedEmail) return null;

  try {
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existing) return existing;

    // Usernames are unique; fall back to a suffixed one rather than failing.
    const base = (extra.username || normalizedEmail.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '')
      .slice(0, 40) || 'user';

    let username = base;
    const { data: taken } = await supabase
      .from('users')
      .select('id')
      .eq('username', base)
      .maybeSingle();
    if (taken) username = `${base}${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: inserted, error } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          clerk_id: userId,
          email: normalizedEmail,
          first_name: extra.first_name || null,
          last_name: extra.last_name || null,
          username,
          phone_number: extra.phone_number || null,
          user_type: extra.user_type || 'adult',
          platform: extra.platform || 'ialab',
          age_range: extra.age_range || '18+',
          registration_source: extra.registration_source || 'ialab_signup',
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      console.error('ensureProfileRow insert failed:', error.message);
      return null;
    }
    return inserted;
  } catch (err) {
    console.error('ensureProfileRow unexpected error:', err.message);
    return null;
  }
}

/**
 * Resolve a login identifier (email OR username) to the account email.
 * Supabase authenticates by email only, so a username has to be translated
 * into its email before we can sign in.
 */
async function resolveEmailFromIdentifier(identifier) {
  const value = String(identifier || '').trim();
  if (!value) return null;
  if (value.includes('@')) return value.toLowerCase();

  try {
    const { data } = await supabase
      .from('users')
      .select('email')
      .ilike('username', value)
      .maybeSingle();
    return data?.email ? data.email.toLowerCase() : null;
  } catch (err) {
    console.error('resolveEmailFromIdentifier failed:', err.message);
    return null;
  }
}

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
router.post('/sync-user', async (req, res) => {
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

    // Validate required fields
    if (!clerk_id || !email) {
      return res.status(400).json({
        error: 'Missing required fields: clerk_id and email',
      });
    }

    // Insert or update user in Supabase
    const { data, error } = await supabase
      .from('users')
      .insert(
        [
          {
            clerk_id,
            email,
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
        details: error.message,
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
      message: err.message,
    });
  }
});

/**
 * POST /api/auth/register
 * Register a new user directly (Supabase Auth + users table)
 *
 * Body:
 * {
 *   email: string (required)
 *   password: string (required)
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
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      username,
      phone_number,
      user_type,
      platform,
      age_range,
      registration_source,
    } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields: email and password',
      });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin
      .createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
      });

    if (authError) {
      console.error('Auth creation error:', authError);
      // Handle duplicate email specifically
      const msg = (authError.message || '').toLowerCase();
      if (msg.includes('already') || msg.includes('registered') || msg.includes('exists')) {
        return res.status(409).json({
          error: 'email_already_registered',
          message: 'Este correo ya está registrado. Por favor, inicia sesión.',
        });
      }
      return res.status(400).json({
        error: 'signup_failed',
        message: authError.message || 'Failed to create user',
      });
    }

    const userId = authData.user.id;

    // Persist the profile row in Supabase.
    const profile = await ensureProfileRow(userId, email, {
      first_name,
      last_name,
      username,
      phone_number,
      user_type,
      platform,
      age_range,
      registration_source,
    });

    // Sign the new user straight in so registration lands them in IALab
    // instead of bouncing them back to the login screen.
    let accessToken = authData.session?.access_token || null;
    if (!accessToken) {
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email: String(email).toLowerCase(),
        password,
      });
      accessToken = signInData?.session?.access_token || null;
    }

    req.log.info('User registered', {
      userId,
      email,
      platform,
      profileCreated: !!profile,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: userId,
        email,
        first_name,
        last_name,
        username: profile?.username || username,
      },
      access_token: accessToken,
    });
  } catch (err) {
    console.error('Register error:', err);
    req.log.error('Unexpected error in auth register', { error: err.message });

    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

/**
 * POST /api/auth/login
 * Log in a user with email + password (Supabase Auth)
 *
 * Body: { email: string (required), password: string (required) }
 * Returns: { success, token, email, user }
 */
router.post('/login', async (req, res) => {
  try {
    // `email` may carry either an email address or a username.
    const { email: identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        error: 'missing_fields',
        message: 'Correo o usuario y contraseña son requeridos.',
      });
    }

    const email = await resolveEmailFromIdentifier(identifier);

    if (!email) {
      // Unknown username. Same generic answer as a wrong password so we do not
      // leak which accounts exist.
      return res.status(401).json({
        error: 'invalid_credentials',
        message: 'Correo o contraseña incorrectos.',
      });
    }

    // Authenticate against Supabase Auth
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !signInData?.session) {
      const msg = (signInError?.message || '').toLowerCase();
      // Distinguish unconfirmed email from wrong credentials
      if (msg.includes('confirm')) {
        return res.status(403).json({
          error: 'email_not_confirmed',
          message: 'Debes confirmar tu correo antes de iniciar sesión.',
        });
      }

      // If the account was created through OAuth it has no password set,
      // so password sign-in can never succeed. Tell the user which button to use.
      try {
        const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const authUser = list?.users?.find(
          (u) => (u.email || '').toLowerCase() === email
        );
        const oauthProvider = authUser?.user_metadata?.provider;
        if (authUser && oauthProvider) {
          return res.status(409).json({
            error: 'oauth_account',
            provider: oauthProvider,
            message: `Esta cuenta se creó con ${oauthProvider}. Inicia sesión con ese botón, o restablece tu contraseña.`,
          });
        }
      } catch (e) {
        /* non-blocking: fall through to generic error */
      }

      return res.status(401).json({
        error: 'invalid_credentials',
        message: 'Correo o contraseña incorrectos.',
      });
    }

    // Self-heal: older accounts may have no profile row.
    const profile = await ensureProfileRow(signInData.user.id, email, {
      first_name: signInData.user.user_metadata?.first_name,
      last_name: signInData.user.user_metadata?.last_name,
      registration_source: 'backfill_login',
    });

    req.log.info('User logged in', { email });

    res.json({
      success: true,
      token: signInData.session.access_token,
      email,
      user: profile || null,
    });
  } catch (err) {
    console.error('Login error:', err);
    req.log.error('Unexpected error in auth login', { error: err.message });
    res.status(500).json({
      error: 'internal_error',
      message: 'Error interno del servidor.',
    });
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

/**
 * GET /api/auth/user/:clerk_id
 * Get user data from Supabase by Clerk ID
 */
router.get('/user/:clerk_id', async (req, res) => {
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

    res.json(data);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: err.message,
    });
  }
});

/**
 * GET /api/auth/oauth/:provider
 * Initiate OAuth login flow
 *
 * Query params:
 * - provider: 'google' or 'facebook'
 * - redirect_uri: where to redirect after OAuth
 */
router.get('/oauth/:provider', (req, res) => {
  try {
    const { provider } = req.params;
    const { redirect_uri } = req.query;

    if (!OAUTH_PROVIDERS[provider]) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    const clientId = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_ID`];
    const clientSecret = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_SECRET`];

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: `OAuth provider ${provider} not configured`,
      });
    }

    // Encode provider in state to identify it in callback
    const state = `${provider}:${crypto.randomBytes(24).toString('hex')}`;
    const scope = provider === 'google'
      ? 'openid email profile'
      : 'email public_profile';

    const callbackUrl = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/callback`;

    const authUrl = new URL(OAUTH_PROVIDERS[provider].authUrl);
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', callbackUrl);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('state', state);

    if (provider === 'google') {
      authUrl.searchParams.append('access_type', 'offline');
      authUrl.searchParams.append('prompt', 'consent');
    }

    // Redirect directly to OAuth provider
    res.redirect(authUrl.toString());
  } catch (err) {
    console.error('OAuth initiate error:', err);
    req.log.error('OAuth initiate error', { provider: req.params.provider, error: err.message });
    res.status(500).json({
      error: 'OAuth initialization failed',
      message: err.message,
    });
  }
});

/**
 * GET /api/auth/callback
 * OAuth callback handler
 *
 * Query params:
 * - code: OAuth authorization code
 * - state: CSRF protection state
 * - provider: oauth provider (google/facebook)
 * - error: Error from provider
 */
router.get('/callback', async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://edutechlife.co';
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`${frontendUrl}/login?error=oauth_${error}`);
    }

    if (!code || !state) {
      return res.redirect(`${frontendUrl}/login?error=invalid_oauth_response`);
    }

    // Extract provider from state (format: "provider:randomHex")
    const provider = state.split(':')[0];
    if (!provider || !OAUTH_PROVIDERS[provider]) {
      return res.redirect(`${frontendUrl}/login?error=invalid_oauth_state`);
    }

    const clientId = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_ID`];
    const clientSecret = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_SECRET`];

    if (!clientId || !clientSecret) {
      return res.redirect(`${frontendUrl}/login?error=oauth_not_configured`);
    }

    const callbackUrl = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/callback`;

    // Exchange authorization code for access token
    // Google/Facebook require form-urlencoded, not JSON
    const tokenUrl = OAUTH_PROVIDERS[provider].tokenUrl;
    const tokenParams = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
      grant_type: 'authorization_code',
    });
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error('Token exchange failed:', errText);
      return res.redirect(`${frontendUrl}/login?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user info from OAuth provider
    // Facebook needs specific fields param; Google returns them by default
    const userUrl = provider === 'facebook'
      ? `${OAUTH_PROVIDERS[provider].userUrl}?fields=id,name,email&access_token=${accessToken}`
      : OAUTH_PROVIDERS[provider].userUrl;
    const userResponse = await fetch(userUrl, {
      headers: provider === 'google' ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    if (!userResponse.ok) {
      console.error('User fetch failed:', await userResponse.text());
      return res.redirect(`${frontendUrl}/login?error=user_fetch_failed`);
    }

    const userData = await userResponse.json();

    // Map OAuth provider user data to Supabase schema
    const oauthEmail = provider === 'google' ? userData.email : userData.email;
    const oauthName = provider === 'google'
      ? userData.name || ''
      : userData.name || '';

    const [firstName, lastName] = oauthName.split(' ').length > 1
      ? oauthName.split(' ')
      : [oauthName, ''];

    // Supabase Auth is the source of truth for whether the account exists.
    // (Looking only at the `users` table breaks sign-in for anyone who exists
    // in Auth but has no profile row: createUser then fails with `email_exists`.)
    const normalizedEmail = String(oauthEmail || '').toLowerCase();
    if (!normalizedEmail) {
      console.error('OAuth provider returned no email', { provider });
      return res.redirect(`${frontendUrl}/login?error=no_email_from_provider`);
    }

    let authUser = null;
    try {
      const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      authUser = list?.users?.find(
        (u) => (u.email || '').toLowerCase() === normalizedEmail
      ) || null;
    } catch (e) {
      console.error('listUsers failed:', e.message);
    }

    let userId;
    if (authUser) {
      userId = authUser.id;
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        user_metadata: {
          provider,
          first_name: firstName,
          last_name: lastName,
        },
        email_confirm: true,
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        return res.redirect(`${frontendUrl}/login?error=user_creation_failed`);
      }

      userId = authData.user.id;
    }

    // Ensure a profile row exists for this account (idempotent, never blocking).
    await ensureProfileRow(userId, normalizedEmail, {
      first_name: firstName,
      last_name: lastName,
      registration_source: `oauth_${provider}`,
    });

    // Obtain a session WITHOUT touching the user's password.
    // (The previous approach overwrote the password with a random one on every
    // OAuth login, which locked users out of email+password sign-in.)
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
    });

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('Generate link error:', linkError);
      return res.redirect(`${frontendUrl}/login?error=signin_failed`);
    }

    const { data: signInData, error: signInError } = await supabase.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: 'email',
    });

    if (signInError || !signInData?.session) {
      console.error('Sign in error:', signInError);
      return res.redirect(`${frontendUrl}/login?error=signin_failed`);
    }

    const sessionToken = signInData.session.access_token;

    req.log.info('OAuth login successful', {
      userId,
      email: normalizedEmail,
      provider,
    });

    // Redirect to frontend with token
    const redirectUrl = `${frontendUrl}/auth/callback?token=${encodeURIComponent(sessionToken)}&email=${encodeURIComponent(normalizedEmail)}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error('OAuth callback error:', err);
    req.log.error('OAuth callback error', { error: err.message });
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
});

/**
 * GET /api/auth/oauth/demo/:provider
 * Demo OAuth endpoint for testing without real OAuth credentials
 *
 * Demo users:
 * - google-demo: demo.user@google.com
 * - facebook-demo: demo.user@facebook.com
 */
router.get('/oauth-demo/:provider', async (req, res) => {
  try {
    const { provider } = req.params;

    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Demo endpoint not available in production' });
    }

    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    // Create demo user data
    const demoEmail = `demo.user@${provider}.com`;
    const demoName = `Demo User ${provider}`;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', demoEmail)
      .single();

    let userId;
    if (existingUser) {
      userId = existingUser.id;
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } else {
      // Create new demo user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: demoEmail,
        password: crypto.randomBytes(16).toString('hex'),
        user_metadata: { provider, first_name: 'Demo', last_name: 'User' },
        email_confirm: true,
      });

      if (authError) {
        // If user already exists in Auth but not in users table, just get the user
        if (authError.code === 'email_exists') {
          // Get the user from auth by email - we'll need to fetch it differently
          // For now, create a record in users table if it doesn't exist
          const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
          const authUser = authUsers?.users?.find(u => u.email === demoEmail);

          if (authUser) {
            userId = authUser.id;
            // Try to insert into users table, but don't fail if it already exists
            await supabase.from('users').insert([
              {
                id: userId,
                clerk_id: userId,
                email: demoEmail,
                first_name: 'Demo',
                last_name: `User (${provider})`,
                username: `demo-${provider}-user`,
                user_type: 'adult',
                platform: 'ialab',
                age_range: '18+',
                registration_source: `oauth_demo_${provider}`,
              },
            ]);
            // Ignore if user already exists in table
          } else {
            console.error('Demo user creation error:', authError);
            return res.status(400).json({ error: 'Failed to create demo user' });
          }
        } else {
          console.error('Demo user creation error:', authError);
          return res.status(400).json({ error: 'Failed to create demo user' });
        }
      } else {
        userId = authData.user.id;

        await supabase.from('users').insert([
          {
            id: userId,
            clerk_id: userId,
            email: demoEmail,
            first_name: 'Demo',
            last_name: `User (${provider})`,
            username: `demo-${provider}-user`,
            user_type: 'adult',
            platform: 'ialab',
            age_range: '18+',
            registration_source: `oauth_demo_${provider}`,
          },
        ]);
      }
    }

    // Generate JWT using temporary password
    const tempPassword = crypto.randomBytes(16).toString('hex');

    // Update user with temp password
    await supabase.auth.admin.updateUserById(userId, {
      password: tempPassword,
    });

    // Sign in to get JWT
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: tempPassword,
    });

    if (signInError || !signInData?.session) {
      console.error('Demo signin error:', signInError);
      return res.status(400).json({ error: 'Failed to create session' });
    }

    req.log.info('Demo OAuth login', { userId, email: demoEmail, provider });

    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/callback?token=${encodeURIComponent(signInData.session.access_token)}&email=${encodeURIComponent(demoEmail)}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error('Demo OAuth error:', err);
    res.status(500).json({ error: 'Demo OAuth failed', message: err.message });
  }
});

module.exports = router;
