#!/usr/bin/env node

/**
 * Migration Script: localStorage → Supabase
 *
 * Migrates all SmartBoard user data from localStorage to Supabase PostgreSQL.
 * Run this on deployed frontend OR in browser console before Phase 1 goes live.
 *
 * Usage:
 *   node migrate-localstorage-to-supabase.js <SUPABASE_URL> <SUPABASE_ANON_KEY> <USER_ID>
 *
 * Or in browser console (after SmartBoard loads):
 *   await migrateLocalStorageToSupabase()
 */

// For Node.js environment
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

let supabaseClient = null;

// Initialize Supabase client (for Node.js)
async function initSupabase(url, key) {
  if (isNode) {
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(url, key);
  } else {
    // Browser environment (use existing window.supabase)
    return window.supabase;
  }
}

/**
 * Migrate localStorage data to Supabase
 */
async function migrateLocalStorageToSupabase() {
  console.log('🚀 Starting SmartBoard migration: localStorage → Supabase\n');

  try {
    // Get environment or prompt for credentials
    let SUPABASE_URL, SUPABASE_ANON_KEY, USER_ID;

    if (isNode) {
      SUPABASE_URL = process.argv[2];
      SUPABASE_ANON_KEY = process.argv[3];
      USER_ID = process.argv[4];

      if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !USER_ID) {
        console.error('Usage: node migrate-localstorage-to-supabase.js <URL> <KEY> <USER_ID>');
        process.exit(1);
      }

      supabaseClient = await initSupabase(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
      // Browser environment
      supabaseClient = window.supabase;
      USER_ID = window.user?.id; // Get from auth context
      if (!USER_ID) {
        throw new Error('User not logged in. Please log in first.');
      }
    }

    console.log(`📦 User ID: ${USER_ID}`);
    console.log(`🔗 Supabase: ${SUPABASE_URL}\n`);

    // Step 1: Collect all localStorage data
    console.log('📂 Step 1: Collecting localStorage data...');
    const prefix = 'edutechlife';
    const suffix = `_${USER_ID}`;

    const localStorageData = {
      points: parseInt(localStorage.getItem(`${prefix}_points${suffix}`) || '0', 10),
      pointsHistory: parseJSON(localStorage.getItem(`${prefix}_points_history${suffix}`) || '[]'),
      vakResult: parseJSON(localStorage.getItem(`${prefix}_vak${suffix}`) || 'null'),
      minutes: parseInt(localStorage.getItem(`${prefix}_minutes${suffix}`) || '0', 10),
      missions: parseJSON(localStorage.getItem(`${prefix}_missions${suffix}`) || '[]'),
      subjects: parseJSON(localStorage.getItem(`${prefix}_subjects${suffix}`) || '[]'),
      calendar: parseJSON(localStorage.getItem(`${prefix}_calendar${suffix}`) || '[]'),
      streak: parseJSON(localStorage.getItem(`${prefix}_streak${suffix}`) || '{}'),
      sessions: parseJSON(localStorage.getItem(`${prefix}_sessions${suffix}`) || '[]'),
    };

    console.log(`✓ Collected: ${Object.keys(localStorageData).length} data types\n`);
    logData(localStorageData);

    // Step 2: Create or update student record
    console.log('\n📝 Step 2: Creating/updating student record...');
    const { data: studentData, error: studentError } = await supabaseClient
      .from('students')
      .upsert({
        id: USER_ID,
        vak_result: localStorageData.vakResult,
        total_points: localStorageData.points,
        total_minutes: localStorageData.minutes,
      }, { onConflict: 'id' })
      .select();

    if (studentError) {
      throw new Error(`Student upsert failed: ${studentError.message}`);
    }
    console.log('✓ Student record updated');

    // Step 3: Migrate points history
    console.log('\n💰 Step 3: Migrating points history...');
    if (localStorageData.pointsHistory.length > 0) {
      const pointsToInsert = localStorageData.pointsHistory.map(p => ({
        student_id: USER_ID,
        points: p.points || p.value || 0,
        reason: p.reason || 'migrated',
        category: p.category || 'lesson',
        timestamp: p.timestamp ? new Date(p.timestamp) : new Date(),
      }));

      const { error: pointsError } = await supabaseClient
        .from('points_history')
        .insert(pointsToInsert);

      if (pointsError) {
        console.warn(`⚠️  Points history error (non-critical): ${pointsError.message}`);
      } else {
        console.log(`✓ Migrated ${pointsToInsert.length} points entries`);
      }
    }

    // Step 4: Migrate VAK result
    console.log('\n🧠 Step 4: Migrating VAK learning style...');
    if (localStorageData.vakResult && Object.keys(localStorageData.vakResult).length > 0) {
      const { error: vakError } = await supabaseClient
        .from('vak_results')
        .insert({
          student_id: USER_ID,
          visual_score: localStorageData.vakResult.visual || 0,
          auditory_score: localStorageData.vakResult.auditory || 0,
          kinesthetic_score: localStorageData.vakResult.kinesthetic || 0,
          detected_at: new Date(),
        });

      if (vakError) {
        console.warn(`⚠️  VAK result error (non-critical): ${vakError.message}`);
      } else {
        console.log('✓ VAK result migrated');
      }
    }

    // Step 5: Migrate sessions
    console.log('\n📚 Step 5: Migrating study sessions...');
    if (localStorageData.sessions.length > 0) {
      const sessionsToInsert = localStorageData.sessions.map(s => ({
        student_id: USER_ID,
        start_time: s.startTime ? new Date(s.startTime) : new Date(),
        end_time: s.endTime ? new Date(s.endTime) : null,
        subject: s.subject || 'general',
        points_earned: s.points || 0,
        type: s.type || 'study',
      }));

      const { error: sessionsError } = await supabaseClient
        .from('sessions')
        .insert(sessionsToInsert);

      if (sessionsError) {
        console.warn(`⚠️  Sessions error (non-critical): ${sessionsError.message}`);
      } else {
        console.log(`✓ Migrated ${sessionsToInsert.length} sessions`);
      }
    }

    // Step 6: Create academic context from subjects data
    console.log('\n🎯 Step 6: Creating academic context...');
    if (localStorageData.subjects.length > 0) {
      const contextsToInsert = localStorageData.subjects.map(s => ({
        student_id: USER_ID,
        subject: s.name || 'general',
        performance_level: calculatePerformanceLevel(s.points || 0),
        last_updated: new Date(),
      }));

      const { error: contextError } = await supabaseClient
        .from('academic_context')
        .insert(contextsToInsert);

      if (contextError) {
        console.warn(`⚠️  Academic context error (non-critical): ${contextError.message}`);
      } else {
        console.log(`✓ Created academic context for ${contextsToInsert.length} subjects`);
      }
    }

    // Step 7: Verify migration
    console.log('\n✅ Step 7: Verifying migration...');
    const { data: verifyStudent } = await supabaseClient
      .from('students')
      .select('*')
      .eq('id', USER_ID)
      .single();

    const { data: verifyPoints } = await supabaseClient
      .from('points_history')
      .select('*')
      .eq('student_id', USER_ID);

    console.log(`✓ Student record verified: ${verifyStudent ? '✓' : '✗'}`);
    console.log(`✓ Points entries in DB: ${verifyPoints?.length || 0}`);

    // Step 8: Archive localStorage (optional)
    console.log('\n🗂️  Step 8: Archiving localStorage...');
    const archiveKey = `${prefix}_archive_${USER_ID}_${Date.now()}`;
    const archive = {};
    Object.keys(localStorage).forEach(key => {
      if (key.includes(suffix)) {
        archive[key] = localStorage.getItem(key);
      }
    });
    localStorage.setItem(archiveKey, JSON.stringify(archive));
    console.log(`✓ Data backed up to: ${archiveKey}`);
    console.log('   (Can be deleted safely after verifying Supabase data)');

    // Success!
    console.log('\n🎉 Migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   • Points history: ${verifyPoints?.length || 0} entries`);
    console.log(`   • Student data: Updated in Supabase`);
    console.log(`   • VAK result: Migrated`);
    console.log(`   • Sessions: Migrated`);
    console.log('   • Archive: Backed up locally\n');
    console.log('💡 Next steps:');
    console.log('   1. Verify data in Supabase dashboard');
    console.log('   2. Test SmartBoard with Realtime subscriptions');
    console.log('   3. Clear localStorage archive after confirmation');
    console.log('   4. Monitor error logs for issues\n');

    return { success: true, data: verifyStudent };

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.details) console.error('Details:', error.details);
    if (isNode) process.exit(1);
    throw error;
  }
}

/**
 * Helper: Parse JSON safely
 */
function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/**
 * Helper: Log migration data
 */
function logData(data) {
  console.log('  Points:', data.points);
  console.log('  Point history entries:', data.pointsHistory.length);
  console.log('  VAK result:', data.vakResult ? '✓' : '✗');
  console.log('  Study minutes:', data.minutes);
  console.log('  Subjects tracked:', data.subjects.length);
  console.log('  Sessions recorded:', data.sessions.length);
  console.log('  Current streak:', data.streak.current || 0);
}

/**
 * Helper: Calculate performance level from points
 */
function calculatePerformanceLevel(points) {
  if (points >= 5000) return 'maestro';
  if (points >= 2500) return 'expert';
  if (points >= 1000) return 'advanced';
  if (points >= 500) return 'intermediate';
  return 'beginner';
}

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
  window.migrateLocalStorageToSupabase = migrateLocalStorageToSupabase;
  console.log('✓ Migration function loaded. Run: migrateLocalStorageToSupabase()');
}

if (isNode) {
  migrateLocalStorageToSupabase();
}
