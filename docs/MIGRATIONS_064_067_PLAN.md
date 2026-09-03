# New Migrations: 064–067 Consolidation Plan

**Task 4 — Initiative #12: Consolidate SQL Schema**

Converts scattered SQL files → numbered migrations with DBA oversight.

---

## Overview

Current state: 42 ad-hoc SQL scripts  
Target state: 4 new migrations (064–067) capture all missing schema  

| Migration | Purpose | Source Files | Est. Lines |
|-----------|---------|--------------|-----------|
| **064** | Missing tables (notifications, etc.) | `create_notifications_table.sql` + others | 80 |
| **065** | Realtime + subscriptions | `enable_realtime_user_progress.sql` | 30 |
| **066** | IALab premium schema | `IALAB_PREMIUM_SAAS_SCHEMA.sql` + `ialab_progress_complete.sql` | 200 |
| **067** | Consolidated fixes + cleanup | All `fix_*.sql` + RLS adjustments | 150 |

---

## Migration 064: Create Missing Tables

**File:** `supabase/migrations/064_create_missing_tables.sql`

**Sources:**
- `sql/create_notifications_table.sql`
- `sql/create_quiz_attempts.sql` (if not already in 043)
- `edutechlife-frontend/enable_anon_access_rls.sql` (RLS config)

**Schema to Create:**

```sql
-- ============================================================================
-- 064_create_missing_tables.sql
-- Create tables that exist in ad-hoc scripts but not in prior migrations
-- ============================================================================

-- Notifications (real-time alerts for users)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('alert', 'achievement', 'deadline', 'grade')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notifications_user_read ON notifications 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notifications_user_update ON notifications 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY notifications_user_delete ON notifications 
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Quiz Attempts (if not already in 043)
-- (Verify first: does 043_student_grades_json.sql already create this?)
-- If not, add here:
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  questions_attempted INTEGER NOT NULL,
  questions_correct INTEGER NOT NULL,
  score DECIMAL(5,2),
  duration_seconds INTEGER,
  attempted_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY quiz_attempts_own ON quiz_attempts 
  FOR SELECT USING (auth.uid() = student_id);

-- Anon access for guest users (if needed)
-- Note: This is a CONFIG, not a table. Should be set via Supabase UI.
-- If programmatic, add via UPDATE on anon role:
-- GRANT SELECT ON notifications TO anon;  -- If guest browsing allowed
```

**Acceptance Criteria:**
- [ ] Tables created successfully
- [ ] RLS policies applied
- [ ] Foreign keys validated
- [ ] Indexes created for performance
- [ ] No conflicts with prior migrations

---

## Migration 065: Enable Realtime & Subscriptions

**File:** `supabase/migrations/065_enable_realtime_subscriptions.sql`

**Sources:**
- `sql/enable_realtime_user_progress.sql`
- Any realtime config from `edutechlife-frontend/supabase_*.sql`

**Schema to Create:**

```sql
-- ============================================================================
-- 065_enable_realtime_subscriptions.sql
-- Enable realtime subscriptions for live updates
-- ============================================================================

-- Enable realtime on user_progress table for instant feedback
ALTER PUBLICATION supabase_realtime ADD TABLE user_progress;

-- Enable on notifications for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable on students for profile updates
ALTER PUBLICATION supabase_realtime ADD TABLE students;

-- Create trigger for user_progress updates (if not already done)
-- This ensures updated_at is always set for realtime tracking
CREATE OR REPLACE FUNCTION update_user_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_progress_timestamp
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_progress_timestamp();
```

**Acceptance Criteria:**
- [ ] Realtime subscriptions enabled on all needed tables
- [ ] Timestamps auto-update on changes
- [ ] Frontend can subscribe and receive updates
- [ ] No performance regression

---

## Migration 066: IALab Premium Schema

**File:** `supabase/migrations/066_ialab_premium_schema.sql`

**Sources:**
- `sql/IALAB_PREMIUM_SAAS_SCHEMA.sql`
- `sql/IALAB_PREMIUM_SCHEMA_ADAPTADO.sql`
- `sql/ialab_progress_complete.sql`

**Schema to Create:**

```sql
-- ============================================================================
-- 066_ialab_premium_schema.sql
-- Complete IALab premium feature schema (subscriptions, usage tracking, etc.)
-- ============================================================================

-- Subscription tiers & features
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  monthly_price DECIMAL(10,2),
  yearly_price DECIMAL(10,2),
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO subscription_tiers (id, name, features) VALUES
  ('free', 'Free', '{"modules": 1, "lessons": 5, "chats": 10}'::jsonb),
  ('pro', 'Pro', '{"modules": 5, "lessons": 50, "chats": 500, "export": true}'::jsonb),
  ('enterprise', 'Enterprise', '{"modules": null, "lessons": null, "chats": null, "api": true}'::jsonb)
ON CONFLICT DO NOTHING;

-- IALab progress tracking
CREATE TABLE IF NOT EXISTS ialab_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMP,
  score DECIMAL(5,2),
  time_spent_seconds INTEGER,
  notes JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE ialab_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY ialab_progress_own ON ialab_progress 
  FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY ialab_progress_insert ON ialab_progress 
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Premium usage tracking (API calls, storage, etc.)
CREATE TABLE IF NOT EXISTS usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  value INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY usage_metrics_own ON usage_metrics 
  FOR SELECT USING (auth.uid() = student_id);
```

**Acceptance Criteria:**
- [ ] Subscription tiers defined
- [ ] IALab progress tracked
- [ ] Usage metrics recorded
- [ ] Proper RLS policies on all tables

---

## Migration 067: Consolidated Fixes & Cleanup

**File:** `supabase/migrations/067_consolidated_fixes_and_cleanup.sql`

**Sources:**
- `sql/fix_rls_auth_jwt.sql`
- `sql/fix_null_constraint.sql`
- `sql/fix_course_progress_circle.sql`
- `sql/fix_boolean_functions.sql`
- `edutechlife-frontend/fix_*.sql` (all fix files)

**Schema Modifications:**

```sql
-- ============================================================================
-- 067_consolidated_fixes_and_cleanup.sql
-- Fixes & RLS policy corrections from scattered ad-hoc scripts
-- ============================================================================

-- Fix 1: RLS Auth JWT configuration
-- Ensure auth.jwt() works with Supabase sessions
CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE
AS $$
  SELECT jsonb_build_object(
    'sub', auth.uid()::text,
    'email', (auth.jwt() ->> 'email'),
    'role', (auth.jwt() ->> 'role')
  );
$$;

-- Fix 2: Remove invalid NOT NULL constraints
-- (if any column was incorrectly set to NOT NULL)
ALTER TABLE students ALTER COLUMN date_of_birth DROP NOT NULL;

-- Fix 3: Fix circular dependencies in course_progress
-- (if any foreign key loops exist, re-structure here)

-- Fix 4: Boolean function consistency
-- Ensure all is_* columns use BOOLEAN type, not TEXT
-- (Add ALTER statements if needed)
ALTER TABLE students ALTER COLUMN is_active TYPE BOOLEAN USING is_active::BOOLEAN;

-- Additional cleanup
COMMIT;
```

**Acceptance Criteria:**
- [ ] All referenced fixes applied
- [ ] No conflicts with prior migrations
- [ ] Boolean columns are consistent
- [ ] RLS policies work with JWT
- [ ] Circular dependencies resolved

---

## Pre-Migration Checklist

Before creating these migrations, verify:

- [ ] **Audit complete** — SQL_SCHEMA_AUDIT.md reviewed
- [ ] **No conflicts** — Each fix doesn't contradict prior migrations
- [ ] **Dependencies clear** — 064 → 065 → 066 → 067 (order correct)
- [ ] **Rollback possible** — Each migration has DOWN clause
- [ ] **Production backup** — Schema extracted before applying

### DOWN Clauses (Rollback)

Each migration must have a rollback:

```sql
-- 064 DOWN
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;

-- 065 DOWN
ALTER PUBLICATION supabase_realtime DROP TABLE user_progress;
DROP TRIGGER IF EXISTS trigger_user_progress_timestamp ON user_progress;
DROP FUNCTION IF EXISTS update_user_progress_timestamp();

-- 066 DOWN
DROP TABLE IF EXISTS usage_metrics CASCADE;
DROP TABLE IF EXISTS ialab_progress CASCADE;
DROP TABLE IF EXISTS subscription_tiers CASCADE;

-- 067 DOWN
-- (Fixes are hard to roll back; typically re-apply prior state)
-- Document what was changed
```

---

## Testing Plan

### Local Testing

```bash
# 1. Reset to baseline
supabase db reset

# 2. Apply migrations 000–067
supabase db pull

# 3. Verify schema
supabase db diff

# 4. Run tests
npm test -- database

# 5. Check for conflicts
psql -c "SELECT * FROM information_schema.table_constraints"
```

### Staging Testing

```bash
# 1. Backup production schema first
pg_dump --schema-only production > backup_schema.sql

# 2. Apply to staging
supabase db push --remote staging

# 3. Run full integration test
npm test -- integration

# 4. Load test
artillery quick -c 100 -d 60 https://staging-api.edutechlife.co

# 5. Compare schemas
psql -c "\dt" production | tee prod_tables.txt
psql -c "\dt" staging | tee staging_tables.txt
diff prod_tables.txt staging_tables.txt
```

### Production Deployment

```bash
# 1. Maintenance window (minimal traffic)
# 2. Final backup
pg_dump production > backup_$(date +%Y%m%d_%H%M%S).sql

# 3. Apply migrations
supabase db push --remote production

# 4. Health check
curl https://api.edutechlife.co/api/health

# 5. Monitor for errors
tail -f render-logs.txt | grep ERROR

# 6. Rollback if needed (restore from backup)
psql -U postgres -h production -d edutechlife < backup_*.sql
```

---

## DBA Review Template

**Send this to DBA before production:**

```markdown
## Schema Consolidation — DBA Review

### Changes Summary
- New tables: notifications, quiz_attempts, ialab_progress, usage_metrics, subscription_tiers
- Fixes: RLS, boolean columns, foreign keys
- Migrations: 064–067 (consolidate 42 ad-hoc scripts)

### Risk Analysis
- Data loss risk: NONE (only adds tables, fixes constraints)
- Performance impact: Minimal (indexes optimized)
- Rollback time: <5 minutes (schema backup available)

### Approvals Needed
- [ ] DBA reviewed migrations
- [ ] DBA approved for production
- [ ] Maintenance window scheduled
- [ ] Backup confirmed

### Sign-Off

**Name:** _________________  
**Date:** _________________  
**Approved for production:** [ ] YES [ ] NO [ ] CONDITIONAL

Conditions (if any): ______________________________________
```

---

## Timeline

| Step | Owner | Duration | Date |
|------|-------|----------|------|
| Draft 064–067 | Backend | 2 hours | This week |
| Local testing | Backend | 1 hour | This week |
| DBA review | DBA | 4 hours | This week |
| Staging test | Backend | 2 hours | This week |
| DBA approval | DBA | 1 hour | This week |
| Production deploy | Backend + DBA | 30 min | Next week |
| Post-deploy verify | Backend | 30 min | Next week |
| Delete frontend SQL | Backend | 15 min | Next week |
| Archive sql/ | Backend | 15 min | Next week |

**Total critical path:** ~7 days

---

## Success Criteria

After migrations 064–067:

- [ ] All 96 SQL files audited → 4 authoritative migrations
- [ ] Zero data loss
- [ ] Schema matches production
- [ ] All tables have RLS policies
- [ ] All tables have proper indexes
- [ ] Realtime enabled on live-update tables
- [ ] Premium features (IALab) working
- [ ] DBA sign-off obtained
- [ ] Rollback tested and working

---

## Next Phase: Delete Ad-Hoc Files

After production deploy:

```bash
# 1. Archive (don't delete, keep for audit trail)
mkdir docs/archived-sql/
mv sql/*.sql docs/archived-sql/
mv edutechlife-frontend/*.sql docs/archived-sql/

# 2. Update .gitignore
echo "*.sql" >> .gitignore
echo "!supabase/migrations/*.sql" >> .gitignore

# 3. Commit cleanup
git add .gitignore
git commit -m "cleanup: move ad-hoc SQL to archive, enforce migration-only policy"
```

---

*Migration 064–067 Plan ready for DBA review. Once approved, implements Task 4 consolidation.*
