const express = require('express');
const supabase = require('../db/supabase');

const router = express.Router();

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

module.exports = router;
