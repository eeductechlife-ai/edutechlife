const crypto = require('crypto');
const { Router } = require('express');
const supabase = require('../../db/supabase');
const { OAUTH_PROVIDERS, findAuthUserByEmail, ensureProfileRow } = require('./helpers');

const router = Router();

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
      authUser = await findAuthUserByEmail(normalizedEmail);
    } catch (e) {
      console.error('findAuthUserByEmail failed:', e.message);
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
        // User already exists — try to get them again
        if (authError.message?.includes('email_exists')) {
          console.warn('User already exists, retrieving ID:', normalizedEmail);
          try {
            const existingUser = await findAuthUserByEmail(normalizedEmail);
            if (existingUser?.id) {
              userId = existingUser.id;
            } else {
              console.error('Could not retrieve existing user:', normalizedEmail);
              return res.redirect(`${frontendUrl}/login?error=user_creation_failed`);
            }
          } catch (retryErr) {
            console.error('findAuthUserByEmail (retry) failed:', retryErr.message);
            return res.redirect(`${frontendUrl}/login?error=user_creation_failed`);
          }
        } else {
          console.error('Auth creation error:', authError);
          return res.redirect(`${frontendUrl}/login?error=user_creation_failed`);
        }
      } else {
        userId = authData.user.id;
      }
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
    const refreshToken = signInData.session.refresh_token;

    req.log.info('OAuth login successful', {
      userId,
      email: normalizedEmail,
      provider,
    });

    // Render a secure form that POSTs tokens to the frontend (no tokens in URL)
    // This approach: tokens are sent in POST body, never exposed in history/logs/Referer
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Autenticando...</title>
          <script>
            // Auto-submit form immediately to POST tokens securely
            window.onload = function() {
              document.getElementById('oauth-form').submit();
            };
          </script>
        </head>
        <body style="background: #004B63; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; height: 100vh;">
          <form id="oauth-form" method="POST" action="${frontendUrl}/auth/exchange-token" style="display: none;">
            <input type="hidden" name="token" value="${sessionToken}">
            <input type="hidden" name="refreshToken" value="${refreshToken}">
            <input type="hidden" name="email" value="${normalizedEmail}">
          </form>
          <div style="text-align: center;">
            <div style="width: 48px; height: 48px; border: 4px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; margin: 0 auto 16px; animation: spin 1s linear infinite;"></div>
            <p style="color: white; font-size: 18px; margin: 0; font-family: system-ui;">Procesando autenticación...</p>
          </div>
          <style>
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        </body>
      </html>
    `;
    res.set('Content-Type', 'text/html');
    res.send(html);
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
          const authUser = await findAuthUserByEmail(demoEmail).catch((e) => {
            console.error('findAuthUserByEmail failed:', e.message);
            return null;
          });

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

    // Generate magic link for session (same approach as OAuth callback)
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: demoEmail,
    });

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('Demo generate link error:', linkError);
      return res.status(400).json({ error: 'Failed to create session' });
    }

    // Verify OTP to get session
    const { data: signInData, error: signInError } = await supabase.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: 'email',
    });

    if (signInError || !signInData?.session) {
      console.error('Demo signin error:', signInError);
      return res.status(400).json({ error: 'Failed to create session' });
    }

    req.log.info('Demo OAuth login', { userId, email: demoEmail, provider });

    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/callback?token=${encodeURIComponent(signInData.session.access_token)}&refreshToken=${encodeURIComponent(signInData.session.refresh_token)}&email=${encodeURIComponent(demoEmail)}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error('Demo OAuth error:', err);
    res.status(500).json({ error: 'Demo OAuth failed' });
  }
});

/**
 * POST /api/auth/exchange-token
 * Exchange OAuth tokens (POSTed securely from the OAuth callback page) for cookies.
 * This endpoint:
 * - Receives tokens via POST (not URL), avoiding exposure in history/logs
 * - Sets HttpOnly, Secure, SameSite cookies
 * - Redirects to frontend callback (no tokens in URL)
 */
router.post('/exchange-token', (req, res) => {
  try {
    const { token, refreshToken, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({ error: 'Missing token or email' });
    }

    const expiresIn = 3600; // 1 hour
    const refreshExpiresIn = 7 * 24 * 60 * 60; // 7 days

    // Set tokens as HttpOnly, Secure, SameSite cookies
    // These are safe: never appear in URL, history, logs, or Referer headers
    const setCookieHeaders = [
      `sb-access-token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${expiresIn}${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`,
      `sb-refresh-token=${refreshToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${refreshExpiresIn}${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`,
    ];

    res.setHeader('Set-Cookie', setCookieHeaders);

    // Redirect to frontend callback (no tokens exposed)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/callback?email=${encodeURIComponent(email)}`;
    res.redirect(302, redirectUrl);
  } catch (err) {
    console.error('Token exchange error:', err);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

module.exports = router;
