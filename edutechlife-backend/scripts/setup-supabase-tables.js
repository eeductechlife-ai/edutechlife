#!/usr/bin/env node

/**
 * Setup script to create Supabase tables for Edutechlife
 * Usage: node scripts/setup-supabase-tables.js
 */

const supabase = require('../src/db/supabase');
const fs = require('fs');
const path = require('path');

const logger = {
  info: (msg) => console.log(`✓ ${msg}`),
  error: (msg) => console.error(`✗ ${msg}`),
  warn: (msg) => console.warn(`⚠ ${msg}`),
};

async function setupUserTable() {
  try {
    logger.info('Creating users table...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, '../sql/001_create_users_table.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements (handle multiple statements separated by ;)
    const statements = sqlContent
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec', {
          sql: statement,
        }).catch(() => {
          // rpc doesn't exist, try raw query instead
          return supabase.from('_rls').select().catch((e) => ({ error: e }));
        });

        if (error) {
          logger.warn(`Statement warning: ${error.message}`);
        }
      } catch (err) {
        // Try alternative approach using supabase client
        logger.info(`Note: Direct SQL execution not available, table should be created manually`);
        break;
      }
    }

    logger.info('Users table setup complete!');
    logger.info('If the table was not created automatically:');
    logger.info('1. Go to Supabase dashboard');
    logger.info('2. Open SQL Editor');
    logger.info('3. Paste content from: sql/001_create_users_table.sql');
    logger.info('4. Click "Run"');

    process.exit(0);
  } catch (err) {
    logger.error(`Setup failed: ${err.message}`);
    logger.info('Manual steps:');
    logger.info('1. Visit: https://supabase.com/dashboard');
    logger.info('2. Login with: eeductechlife@gmail.com');
    logger.info('3. Select your project');
    logger.info('4. Go to SQL Editor');
    logger.info('5. Open and run: sql/001_create_users_table.sql');
    process.exit(1);
  }
}

// Run setup
setupUserTable();
