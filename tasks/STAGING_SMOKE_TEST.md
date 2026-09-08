# Fase 3 Staging Smoke Test — Ready to Execute

**Date:** 2026-09-05  
**Status:** Code pushed to main, ready for staging validation  
**Commits:** d82d55bf through 16031def (6 commits, 450+ LOC)

---

## Pre-Test Checklist

- [x] All code committed to main
- [x] Main branch pushed to GitHub
- [x] Tests passing locally (28/28)
- [x] Build passing (npm run build)
- [x] ESLint clean (0 errors, 0 warnings)
- [x] Production Supabase has migration 059 applied
- [x] Staging Supabase ready (separate project: `dxirtihrpnlnxkxpmkmx`)

---

## Staging Deployment Steps

### Step 1: Verify Vercel Auto-Deploy (Staging)

**Expected:** Vercel watches main branch and auto-deploys.

```bash
# Check Vercel deployment status
# Go to: https://vercel.com/eeductechlife-ai/edutechlife-frontend/deployments
# Should see: Deploy from main branch in progress or complete
```

**Expected outcome:** Build completes in ~3 minutes  
**Acceptance:** Green checkmark ✅ on Vercel dashboard

---

### Step 2: Create Test Student on Staging Supabase

**Login to Supabase staging project:**
- Project ID: `dxirtihrpnlnxkxpmkmx`
- Go to SQL Editor

**Run this query:**

```sql
-- Create auth user (mock)
INSERT INTO users (email, user_type, auth_id) 
VALUES ('fase3-test@staging.local', 'student', 'test-auth-' || floor(random() * 1000000)::text)
RETURNING id, auth_id;

-- Note the user.id and auth_id from result above
-- Then insert student record:
INSERT INTO students (auth_id, name, age, email, subscription_tier, language)
VALUES (
  '<use-auth_id-from-above>',
  'Test Fase 3 Student',
  12,
  'fase3-test@staging.local',
  'free',
  'es'
)
RETURNING id AS student_id;

-- Note the student_id for all tests below
```

**Expected outcome:** Student record created  
**Acceptance:** Have `student_id` ready for remaining tests

---

### Step 3: Test Session Lifecycle (2 min)

**On staging frontend (Vercel preview URL):**

1. **Log in as test student**
   - Email: `fase3-test@staging.local`
   - Password: (contact backend team for test credentials)

2. **Navigate to SmartBoard**
   - URL: `https://staging-frontend/smartboard/kids-dashboard`

3. **Verify session created in DB**
   - Run in Supabase SQL Editor:
   ```sql
   SELECT * FROM sessions 
   WHERE student_id = '<student_id>'
   ORDER BY start_time DESC 
   LIMIT 1;
   ```
   - **Expected:** 1 row with:
     - `start_time` = NOW (within last minute)
     - `end_time` = NULL
     - `type` = 'dashboard'
     - `subject` = 'dashboard'

4. **Close SmartBoard / navigate away**

5. **Verify session ended**
   - Run same query again
   - **Expected:** `end_time` ≠ NULL, `duration_minutes` > 0

**✅ PASS if:** Session appears and ends correctly

---

### Step 4: Test Academic Context Sync (3 min)

**Back on staging frontend:**

1. **Click on a subject** (e.g., Matemáticas)
2. **Spend 5+ minutes** on lessons/activities
3. **Run Supabase query:**
   ```sql
   SELECT * FROM academic_context 
   WHERE student_id = '<student_id>' 
   AND subject = 'Matemáticas';
   ```

**Expected:** Row exists with:
- `lessons_completed` > 0
- `average_score` >= 0
- `performance_level` in ('beginner', 'intermediate', 'advanced')

**✅ PASS if:** Row auto-populated (triggered by useUpsertAcademicContext on subject time change)

---

### Step 5: Test Achievements Display (2 min)

**Manually seed achievements in staging DB:**

```sql
INSERT INTO achievements (
  student_id, 
  achievement_type, 
  title, 
  description, 
  points_awarded, 
  earned_at,
  badge_url,
  is_milestone
)
VALUES 
  ('<student_id>', 'test_badge_1', 'Prueba Exitosa', 'Test de Fase 3', 50, NOW(), NULL, false),
  ('<student_id>', 'test_badge_2', 'Más Pruebas', 'Segundo test', 75, NOW(), NULL, false);
```

**On staging frontend:**

1. **Reload SmartBoard page** (force refresh cache)
2. **Scroll to "Logros Desbloqueados" section** (in RewardsGrid)
3. **Verify badges appear:**
   - "Prueba Exitosa" (50 pts)
   - "Más Pruebas" (75 pts)

**✅ PASS if:** Achievements render in UI with correct titles and points

---

### Step 6: Test RLS Isolation (3 min)

**Create second test student:**

```sql
INSERT INTO users (email, user_type, auth_id) 
VALUES ('fase3-test-2@staging.local', 'student', 'test-auth-' || floor(random() * 1000000)::text)
RETURNING id, auth_id;

INSERT INTO students (auth_id, name, age, email, subscription_tier, language)
VALUES (
  '<use-auth_id>',
  'Test Fase 3 Student 2',
  13,
  'fase3-test-2@staging.local',
  'free',
  'es'
)
RETURNING id AS student_id_2;
```

**Test isolation:**

1. **Log in as Student 1**
2. **Query:** `SELECT COUNT(*) FROM sessions WHERE student_id = '<student_id_1>'`
   - Should see Student 1's sessions
3. **Try to manually query Student 2's data via API** (or URL hack)
   - **Expected:** RLS blocks access (403 error or empty result)

**✅ PASS if:** Student 2's data unreachable by Student 1

---

### Step 7: Performance Baseline (3 min)

**Rapid session creation test:**

```sql
-- Create 50 sessions rapidly
WITH sessions_to_create AS (
  SELECT 
    '<student_id>'::uuid AS student_id,
    'dashboard' AS subject,
    'dashboard' AS type,
    NOW() - (i || ' seconds')::interval AS start_time,
    0 AS completion_percentage,
    0 AS points_earned
  FROM generate_series(1, 50) AS t(i)
)
INSERT INTO sessions (student_id, subject, type, start_time, completion_percentage, points_earned)
SELECT * FROM sessions_to_create
RETURNING id;
```

**Verify:**
- All 50 rows created
- No errors
- Query completed in < 5 seconds
- No duplicate student_ids

**✅ PASS if:** 50 sessions created without errors

---

### Step 8: Error Recovery (2 min)

**Simulate network error:**

1. **Open DevTools (F12) → Network tab**
2. **Set throttling to "Offline"** (or use killswitch)
3. **Try to open SmartBoard**
   - Should handle gracefully (no crash)
   - May show loading or error message
4. **Re-enable network**
5. **Verify SmartBoard recovers** and retries sync

**✅ PASS if:** App doesn't crash, retry works

---

## Pass/Fail Summary

| Test | Expected | Result | Pass? |
|------|----------|--------|-------|
| 3. Session Lifecycle | start_time/end_time recorded | ? | ☐ |
| 4. Academic Context | auto-synced per subject | ? | ☐ |
| 5. Achievements | badges appear in UI | ? | ☐ |
| 6. RLS Isolation | Student 2 blocked from Student 1 data | ? | ☐ |
| 7. Performance | 50 sessions in <5s, no dups | ? | ☐ |
| 8. Error Recovery | No crash on network fail | ? | ☐ |

**Overall Result:**
- [ ] **FAIL** — Issues found, see notes below
- [ ] **PASS** — All tests passed, ready for production

**Notes:** (fill in any issues or observations)

---

## If Tests Fail

1. **Document the failure** (screenshot, error message, query result)
2. **Check logs:**
   - Backend: `RENDER_DEPLOY_HOOK` logs
   - Frontend: Vercel build logs
   - Database: Supabase query performance + trigger logs
3. **File issue + root cause**
4. **Fix locally, re-test on staging**
5. **Only deploy to production once all tests pass**

---

## If All Tests Pass ✅

1. **Backup production Supabase** (via Supabase dashboard)
2. **Merge main to production** (already done — main = production branch)
3. **Monitor production for 48h** (see FASE_3_DEPLOYMENT_GUIDE.md)
4. **Declare Fase 3 production-ready**

---

## Timeline

- Step 1 (Vercel deploy): ~3 min
- Step 2 (Create test student): ~1 min
- Steps 3–8 (Smoke tests): ~18 min
- **Total: ~22 minutes**

---

## Contact & Escalation

- **Vercel build issues:** Frontend team
- **Supabase RLS/query issues:** Database team
- **Session/achievement sync issues:** Backend team (daniOrchestrator.js)
- **On-call:** For production incidents post-deployment

**This document:** `/tasks/STAGING_SMOKE_TEST.md`

---

**Status:** Ready to execute. Proceed when Vercel deployment completes.
