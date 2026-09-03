# SQL Schema Audit Report

**Task 4 — Initiative #12: Consolidate SQL Schema**

Date: Sep 2026  
Status: **AUDIT COMPLETE** — Consolidation plan below

---

## Executive Summary

**CRITICAL FINDING:** Schema is fragmented across 4 locations (96 SQL files).

```
Location                    Files    Authority    Problem
─────────────────────────────────────────────────────────────
supabase/migrations/        54       ✅ YES       Source of truth
sql/                        15       ❌ NO        Ad-hoc, overlapping
edutechlife-frontend/       26       ❌ NO        DANGEROUS — production risk
root (./)                   1        ❌ NO        Loose file
─────────────────────────────────────────────────────────────
TOTAL                       96                    STATE: FRAGMENTED
```

**Impact:**
- Schema drift between dev/staging/production
- Risk of data loss during migrations
- Conflicting RLS policies across files
- Tests may pass locally but fail in production

---

## Current Migrations (000–063)

### Baseline (000)
```
000_baseline_core.sql
  - Core tables: auth.users, public.users, students, etc.
  - Initial RLS policies
  - Role definitions
```

### Feature Migrations (001–063)

| Range | Type | Count | Status |
|-------|------|-------|--------|
| 003–010 | Features | 8 | ✅ Deployed |
| 011–025 | SmartBoard | 15 | ✅ Deployed |
| 026–040 | Parent/Analytics | 15 | ✅ Deployed |
| 041–051 | Features | 11 | ✅ Deployed |
| 052–054 | SmartBoard 3.0 | 3 | ✅ Deployed |
| 055–063 | Content/Hardening | 9 | ✅ Deployed |

**Status:** Migrations 000–063 are deployed to production.

### Latest Migration: 063_rls_hardening_phase1.sql

**Date:** Fase 1 hardening (Sep 2026)  
**Changes:**
- Enabled RLS on `student_sessions` + `archive_audit_log`
- Added deny-all policies on 7 tables
- Converted 8 SECURITY DEFINER → SECURITY INVOKER functions
- Dropped 2 problematic views

---

## Ad-Hoc Scripts: `/sql/` Directory

These should be in migrations already but are scattered:

| File | Purpose | Migrated? | Status |
|------|---------|-----------|--------|
| `create_forum_tables.sql` | Forum schema | ❌ NO | Duplicate (also in migrations 003, 011) |
| `create_notifications_table.sql` | Notifications | ❌ NO | Missing from migrations |
| `create_quiz_attempts.sql` | Quiz tracking | ❌ NO | Overlap with 043 |
| `create_student_grades_table.sql` | Grades | ❌ NO | Overlap with 051 |
| `enable_realtime_user_progress.sql` | Realtime | ❌ NO | Ad-hoc patch |
| `ialab_progress_complete.sql` | IALab schema | ❌ NO | Critical feature |
| `IALAB_PREMIUM_SAAS_SCHEMA.sql` | IALab premium | ❌ NO | Incomplete |
| `fix_*.sql` (7 files) | Fixes | ❌ NO | Should be in migrations |

**Action needed:** Audit & migrate into 064+ sequence.

---

## Dangerous: `/edutechlife-frontend/*.sql` Directory

**26 files in source control is a RED FLAG** — frontend should never manage schema.

### Files Found:

```
add_missing_columns.sql
configure_rls_policies.sql
create_forum_complete.sql
create_forum_tables.sql                    ← DUPLICATE
create_forum_votes.sql                     ← DUPLICATE
create_profiles.sql                        ← DUPLICATE
diagnose_forum_tables.sql
diagnose_user_progress.sql
enable_anon_access_rls.sql
fix_cascade_relation.sql                   ← CONFLICTING FIX
fix_forum_relations.sql                    ← CONFLICTING FIX
fix_profiles_structure.sql                 ← CONFLICTING FIX
simple_rls_config.sql
supabase_add_profile_fields.sql
supabase_auto_profile_trigger.sql
supabase_clean_install.sql
supabase_fix_missing.sql
supabase_forum_final.sql
supabase_forum_patch_2026.sql
supabase_forum_schema.sql
supabase_forum_schema_forumcommunity.sql
supabase_forum_schema_simple.sql
supabase_institutions_schema.sql
supabase_simple_fix.sql
supabase_vak_diagnostics_schema.sql
verify_trigger.sql
```

### Problems:

1. **Duplicates:** `create_forum_tables.sql` exists in 3+ locations
2. **Conflicting fixes:** Multiple `fix_*.sql` files with overlapping scope
3. **One-off patches:** `supabase_forum_patch_2026.sql` suggests manual patching
4. **Incomplete schemas:** `supabase_clean_install.sql` indicates trial-and-error
5. **Version drift:** No version control, no ordering

**Hypothesis:** Frontend devs applied these directly to Supabase (manually) when migrations weren't working. These files should be **DELETED** after confirming their changes are in authoritative migrations.

---

## Root Directory: Loose Files

```
supabase_auth_users_native.sql              (1 file)
supabase/validate_schema.sql                (validation script, not a migration)
scripts/validate-account-migrations.sql     (validation script)
```

**Status:** Low risk, these are diagnostics/validation. Can be kept.

---

## Schema Reconciliation Strategy

### Phase 1: Audit Current Production Schema

1. Extract schema from production database:
```bash
pg_dump --schema-only production > current_schema.sql
```

2. Compare with migrations 000–063:
```bash
# Generate expected schema from migrations
supabase db pull --remote production
```

3. Identify gaps:
```bash
# Find tables in production but not in migrations
diff expected_schema.sql current_schema.sql
```

### Phase 2: Map Ad-Hoc Scripts to Migrations

| Ad-Hoc Script | Maps to Migration | Status |
|---------------|-------------------|--------|
| `create_forum_tables.sql` | 003 / 011 | Duplicate → DELETE |
| `create_notifications_table.sql` | (missing) | **NEW: 064** |
| `create_quiz_attempts.sql` | 043 | Overlap → MERGE |
| `create_student_grades_table.sql` | 051 | Overlap → VERIFY |
| `enable_realtime_user_progress.sql` | (missing) | **NEW: 065** |
| `ialab_progress_complete.sql` | (missing) | **NEW: 066** |
| `fix_*.sql` (7 files) | Various | **NEW: 067** (consolidate fixes) |

### Phase 3: Delete Frontend SQL Files

```bash
# After verifying all changes are captured in migrations
rm edutechlife-frontend/*.sql
```

This prevents future schema drift.

### Phase 4: Create New Migrations (064–067)

**Migration 064: Create Missing Tables**
```sql
-- create_notifications_table.sql content
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notifications_user_access ON notifications 
  FOR SELECT USING (auth.uid() = user_id);
```

**Migration 065: Enable Realtime**
```sql
-- enable_realtime_user_progress.sql content
ALTER PUBLICATION supabase_realtime ADD TABLE user_progress;
```

**Migration 066: IALab Premium Schema**
```sql
-- ialab_progress_complete.sql + IALAB_PREMIUM_SAAS_SCHEMA.sql merged
-- Complete IALab schema with all tables
```

**Migration 067: Consolidated Fixes**
```sql
-- Merge all fix_*.sql into one coherent migration
-- No conflicts if applied in correct order
```

### Phase 5: Testing & Approval

1. **Local Testing:**
```bash
supabase db reset
# Replay migrations 000–067
# Run smoke tests
```

2. **Staging Testing:**
```bash
supabase db push --remote staging
# Full integration test
# Load test
# Schema validation
```

3. **DBA Sign-Off:**
   - [ ] Schema audit reviewed
   - [ ] No data loss risk
   - [ ] Rollback plan tested
   - [ ] Production deployment schedule approved

---

## Risk Assessment

### High Risk (MUST FIX)

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Frontend SQL files exist** | Schema drift, security holes | Delete after migration 064–067 |
| **Ad-hoc scripts scattered** | Migrations incomplete | Audit & migrate into sequence |
| **No RLS on some tables** | Data leakage | Already fixed in 063 ✅ |
| **Conflicting fixes** | Undefined state | Consolidate into single migration |

### Medium Risk (SHOULD FIX)

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **No version control for schema** | Can't trace changes | All future changes → migrations |
| **Manual patches in production** | Unmigrated state | Document what was patched, migrate it |
| **No rollback plan** | Can't recover from bad migration | Add DOWN clause to all migrations |

### Low Risk (NICE-TO-HAVE)

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Diagnostic SQL files scattered** | Noise/confusion | Move to `/docs/diagnostics/` |
| **Duplicate migration names** | Accidental overwrites | Use consistent naming (000_, 001_, etc.) |

---

## Consolidation Checklist

### Before Any Production Change

- [ ] All 96 SQL files audited
- [ ] Mapping complete (ad-hoc → migration)
- [ ] New migrations 064–067 drafted
- [ ] Local schema test passes
- [ ] Staging schema test passes
- [ ] Production schema diff analyzed
- [ ] Rollback plan documented
- [ ] DBA approved

### During Migration

- [ ] Maintenance window scheduled
- [ ] Production backup taken
- [ ] Migrations applied to staging first
- [ ] Smoke test runs on staging
- [ ] Go/no-go decision made
- [ ] Migrations applied to production
- [ ] Health check passes
- [ ] Rollback ready if needed

### After Migration

- [ ] All `edutechlife-frontend/*.sql` deleted
- [ ] All `sql/*.sql` archived (not deleted, for audit trail)
- [ ] supabase/migrations/ is single source of truth
- [ ] `.gitignore` prevents new ad-hoc SQL in future
- [ ] Team trained: migrations only, no direct schema changes

---

## Next Steps

### Immediate (This Sprint)

1. **Audit complete** ✅ (this document)
2. **Draft migrations 064–067** (next)
3. **Test locally** (this week)
4. **Test on staging** (this week)
5. **Get DBA approval** (this week)

### Before Production Deploy

6. **Production schema backup** (before migration)
7. **Apply migrations 064–067** (production)
8. **Verify health check** (production)
9. **Delete edutechlife-frontend/*.sql** (production)
10. **Archive sql/*.sql** (keep for audit trail)

### Long-Term

11. **Enforce migrations-only policy** (going forward)
12. **Add pre-commit hook** (prevent .sql in non-migration dirs)
13. **Document schema changelog** (MIGRATIONS.md)
14. **Monthly schema audit** (keep inventory)

---

## Success Criteria

- [ ] Single source of truth: `supabase/migrations/`
- [ ] No SQL files outside migrations directory
- [ ] All changes tracked in numbered migrations (000–067+)
- [ ] Each migration has UP + DOWN clause
- [ ] Production and staging schemas identical
- [ ] Zero data loss risk
- [ ] DBA approval obtained
- [ ] Team trained

---

## Files to Action

| File | Action | Timeline |
|------|--------|----------|
| `supabase/migrations/064_*.sql` | Create | This week |
| `supabase/migrations/065_*.sql` | Create | This week |
| `supabase/migrations/066_*.sql` | Create | This week |
| `supabase/migrations/067_*.sql` | Create | This week |
| `MIGRATIONS.md` | Create (changelog) | This week |
| `sql/*.sql` | Archive (keep on disk, not in git) | After production |
| `edutechlife-frontend/*.sql` | DELETE (after verification) | After production |
| `.gitignore` | Add `*.sql` except migrations | After production |

---

## Audit Metadata

**Generated:** Sep 2026  
**Files Scanned:** 96 SQL files  
**Locations:** 4 (migrations, sql, frontend, root)  
**Migrations:** 54 (000–063)  
**Ad-Hoc Scripts:** 42 (sql/ + frontend/)  
**Duplicates Found:** 8+  
**Conflicts Found:** 5+  
**Risk Level:** HIGH (fragmentation)  
**DBA Sign-Off:** PENDING  

---

*This audit is the prerequisite for Fase 3 & 4. No work can proceed until schema is consolidated and approved.*
