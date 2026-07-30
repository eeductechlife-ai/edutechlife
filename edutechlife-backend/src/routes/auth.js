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
    tokenUrl: 'https://graph.instagram.com/v18.0/oauth/access_token',
    userUrl: 'https://graph.facebook.com/v18.0/me',
  },
};

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
      return res.status(400).json({
        error: authError.message || 'Failed to create user',
      });
    }

    const userId = authData.user.id;

    // Create user record in users table
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: userId, // Use Supabase Auth user ID
          clerk_id: userId, // Backward compatibility
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
      ])
      .select();

    if (dbError) {
      console.error('User record creation error:', dbError);
      // Continue anyway - auth user was created
    }

    req.log.info('User registered', {
      userId,
      email,
      platform,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: userId,
        email,
        first_name,
        last_name,
        username,
      },
      access_token: authData.session?.access_token || null,
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

    const state = crypto.randomBytes(32).toString('hex');
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
  try {
    const { code, state, error, provider } = req.query;

    if (error) {
      return res.redirect(`/login?error=oauth_${error}`);
    }

    if (!code || !state || !provider) {
      return res.redirect('/login?error=invalid_oauth_response');
    }

    const clientId = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_ID`];
    const clientSecret = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_SECRET`];

    if (!clientId || !clientSecret) {
      return res.redirect('/login?error=oauth_not_configured');
    }

    const callbackUrl = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/callback`;

    // Exchange authorization code for access token
    const tokenUrl = OAUTH_PROVIDERS[provider].tokenUrl;
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return res.redirect('/login?error=token_exchange_failed');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user info from OAuth provider
    const userUrl = OAUTH_PROVIDERS[provider].userUrl;
    const userResponse = await fetch(userUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok) {
      console.error('User fetch failed:', await userResponse.text());
      return res.redirect('/login?error=user_fetch_failed');
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

    // Check if user exists in Supabase
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', oauthEmail)
      .single();

    let userId;
    if (existingUser) {
      userId = existingUser.id;
      // Update existing user
      await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
        })
        .eq('id', userId);
    } else {
      // Create new user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: oauthEmail,
        user_metadata: {
          provider,
          first_name: firstName,
          last_name: lastName,
        },
        email_confirm: true,
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        return res.redirect('/login?error=user_creation_failed');
      }

      userId = authData.user.id;

      // Create user record in users table
      await supabase.from('users').insert([
        {
          id: userId,
          clerk_id: userId,
          email: oauthEmail,
          first_name: firstName || null,
          last_name: lastName || null,
          username: oauthEmail.split('@')[0],
          user_type: 'adult',
          platform: 'ialab',
          age_range: '18+',
          registration_source: `oauth_${provider}`,
        },
      ]);
    }

    // Generate JWT token - create a temporary password and sign in
    const tempPassword = crypto.randomBytes(16).toString('hex');

    // Update or create user with temp password
    if (existingUser) {
      await supabase.auth.admin.updateUserById(userId, {
        password: tempPassword,
      });
    }

    // Sign in with email/password to get JWT
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: oauthEmail,
      password: tempPassword,
    });

    if (signInError || !signInData?.session) {
      console.error('Sign in error:', signInError);
      return res.redirect('/login?error=signin_failed');
    }

    const sessionToken = signInData.session.access_token;

    req.log.info('OAuth login successful', {
      userId,
      email: oauthEmail,
      provider,
    });

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/callback?token=${encodeURIComponent(sessionToken)}&email=${encodeURIComponent(oauthEmail)}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error('OAuth callback error:', err);
    req.log.error('OAuth callback error', { error: err.message });
    res.redirect('/login?error=oauth_failed');
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
