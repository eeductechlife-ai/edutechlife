const supabase = require('../../db/supabase');

const OAUTH_PROVIDERS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v21.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v21.0/oauth/access_token',
    userUrl: 'https://graph.facebook.com/v21.0/me',
  },
};

/**
 * Look up a Supabase Auth user by email using server-side filtering.
 * Avoids fetching all users — safe above 1000 registrations.
 * @returns {Promise<object|null>} auth user or null
 */
async function findAuthUserByEmail(email) {
  const normalized = email.toLowerCase();
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 10,
    filter: normalized,
  });
  if (error) throw error;
  return data?.users?.find(u => u.email?.toLowerCase() === normalized) ?? null;
}

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

module.exports = { OAUTH_PROVIDERS, findAuthUserByEmail, ensureProfileRow, resolveEmailFromIdentifier };
