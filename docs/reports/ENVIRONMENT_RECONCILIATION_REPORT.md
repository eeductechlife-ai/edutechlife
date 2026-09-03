# ENVIRONMENT RECONCILIATION REPORT

**Date:** 2026-09-01  
**Branch:** `recovery/foundation-phase-a`  
**HEAD:** `56143be6`  
**Auditor:** Claude Opus  
**Constraint:** READ-ONLY — no tables created, no migrations run, no data changed, no production changes

---

## 1. GATE DETERMINATION

### **Answer: `DIFFERENT_ENVIRONMENT`**

The current audit is examining **PRODUCTION** (`srirrwpgswlnuqfgtule`).  
The prior "staging validated" evidence references **STAGING** (`dxirtihrpnlnxkxpmkmx`).  
These are **two different Supabase projects**. The schema gaps are expected — production never had migrations 000-059 applied.

---

## 2. ENVIRONMENT IDENTIFICATION

| Signal | Current Local Dev | Prior Staging Claims |
|--------|-------------------|---------------------|
| **Supabase project ref** | `srirrwpgswlnuqfgtule` | `dxirtihrpnlnxkxpmkmx` |
| **Environment type** | PRODUCTION | STAGING (CI-only) |
| **How connected** | `.env` files (frontend + backend) | CI env vars in GitHub Actions |
| **Migrations applied** | Partial (hand-built schema) | Full 000-059 via `supabase db push` |
| **Schema status** | 13 SmartBoard tables exist | 17/17 SCHEMA_OK (58+ total tables) |

### Evidence chain:
- Frontend `supabase.js` reads `VITE_SUPABASE_URL` → resolves to `srirrwpgswlnuqfgtule`
- Backend `.env` contains `SUPABASE_URL` → resolves to `srirrwpgswlnuqfgtule`
- `STAGING_DEPLOYMENT_REPORT.md` line 35: Production = `srirrwpgswlnuqfgtule`
- `STAGING_VERIFICATION_REPORT.md` line 48: Production = `srirrwpgswlnuqfgtule`
- Student avatar URLs contain `srirrwpgswlnuqfgtule` in their storage bucket path

---

## 3. PRIOR EVIDENCE ANALYSIS

### Documents that reference STAGING (`dxirtihrpnlnxkxpmkmx`):

| Document | Date | Claims | CI Run |
|----------|------|--------|--------|
| `STAGING_DEPLOYMENT_REPORT.md` | 2026-08-29 | Staging created, 000-059 applied, SCHEMA_OK 17/17 | `33267431885` |
| `GOLDEN_USER_JOURNEY_REPORT.md` | 2026-08-29 | 15/20 journey steps pass on staging, mastery math exact | `33273674218` |
| `SCHEMA_DRIFT_REPORT.md` | 2026-08-29 | Code ↔ migrations aligned; prod has 5 tables missing → 059 needed | (probe) |
| `SMARTBOARD_SCHEMA_SNAPSHOT.md` | 2026-08-29 | 58+ tables expected from fresh 000-059 | (analysis) |
| `SMARTBOARD_MIGRATION_INVENTORY.md` | 2026-08-29 | 14 migrations FIXED, 2 NEW (000, 059) | (analysis) |

### Documents that contradict staging existence:

| Document | Date | Claims |
|----------|------|--------|
| `STAGING_VERIFICATION_REPORT.md` | 2026-08-29 | "Staging BLOCKED (sin Docker)" |

### Reconciliation of contradiction:

The `STAGING_VERIFICATION_REPORT.md` was written to describe the **local** staging capability (requires Docker/Postgres for `supabase db push` locally). The `STAGING_DEPLOYMENT_REPORT.md` documents a **CI-based** staging that was created and tested entirely within GitHub Actions runners. Both are accurate — local staging was blocked, but CI staging worked.

**Key insight:** The CI-based staging (`dxirtihrpnlnxkxpmkmx`) exists as a Supabase project but is only accessible via staging credentials that live in GitHub Actions secrets. The local dev environment has no reference to staging credentials — it only has production credentials in `.env`.

---

## 4. MIGRATION STATUS

### Local migration files: 51 files (000-061)
### Migrations applied to PRODUCTION: Partial (hand-built)

| Migration Range | Applied to Production? | Applied to Staging (CI)? |
|----------------|----------------------|------------------------|
| 000 (baseline) | N/A (hand-built equivalent) | ✅ via `supabase db push` |
| 003-010 | Partial (some hand-created) | ✅ |
| 011 (smartboard core) | Partial (students/streaks/vak yes; sessions/points/conversations/achievements no) | ✅ |
| 020-032 | Partial (ALTERs on existing tables) | ✅ |
| 033-038 | ❌ Not applied | ✅ |
| 039-051 | Partial (some columns hand-added) | ✅ |
| 052-058 (SmartBoard 3.0) | ✅ Applied | ✅ |
| 059 (reconcile) | ❌ Not applied | ✅ |
| 060-061 | ❌ Not applied | Not confirmed |

### Production was built by hand:
The production database was NOT created via migrations. It was constructed manually using SQL scripts from `sql/` and `edutechlife-frontend/*.sql`. This means:
- Some tables exist with slightly different schemas than migrations define
- `parent_student_links` exists but without an `id` column (migration 023 adds one)
- SmartBoard 3.0 tables (052-058) were applied because they're purely additive
- Reconciliation migration 059 was never applied — it creates 9 tables missing from production

---

## 5. TABLE RECONCILIATION

### Tables in PRODUCTION vs STAGING (17 critical SmartBoard tables)

| Table | In PRODUCTION? | In STAGING? | Notes |
|-------|---------------|-------------|-------|
| students | ✅ | ✅ | Production hand-built; staging from migration 011 |
| dani_memory | ✅ | ✅ | Both from migration 052 |
| early_warnings | ✅ | ✅ | Both from migration 052 |
| learning_plans | ✅ | ✅ | Both from migration 052 |
| learning_streaks | ✅ | ✅ | Production hand-built; staging from 011 |
| student_competency_mastery | ✅ | ✅ | Both from migration 053 |
| student_missions | ✅ | ✅ | Both from migration 054 |
| student_badges | ✅ | ✅ | Both from migration 054 |
| grade_analyses | ✅ | ✅ | Both from migration 039 |
| learning_content | ✅ | ✅ | Both from migration 055 |
| student_timetable | ✅ | ✅ | Both from migration 042 |
| timetable_slots | ✅ | ✅ | Both from migration 042 |
| parent_student_links | ✅* | ✅ | *Prod: hand-built, no `id` column |
| sessions | ❌ | ✅ | Created by 011/059 |
| points_history | ❌ | ✅ | Created by 011/059 |
| crisis_alerts | ❌ | ✅ | Created by 009/059 |
| parent_consents | ❌ | ✅ | Created by 008 |

**STAGING: 17/17 ✅** — all critical tables exist (confirmed by CI run `33267431885`)  
**PRODUCTION: 13/17** — 4 critical tables missing (sessions, points_history, crisis_alerts, parent_consents)

---

## 6. EXISTING STUDENT DATA CLASSIFICATION

### Student found in production:
- **Email:** nuevousuario2026@edutechlife.co
- **Auth ID:** 07cd9cef-...
- **Profile:** age 13, grade 7B, VAK kinesthetic, country CO
- **Data in SmartBoard tables:** Zero rows in all data tables
- **Classification:** **REAL PRODUCTION USER** — registered on production, not synthetic test data

### Students in staging (from GOLDEN_USER_JOURNEY_REPORT):
- STUDENT_A: `a1b3585c...`, email `.test`, "Staging School", synthetic
- STUDENT_B: `b6dc85a2...`, email `.test`, synthetic
- PARENT_A, PARENT_B: synthetic
- **Classification:** **SYNTHETIC TEST USERS** — created by CI for golden journey testing

---

## 7. ENVIRONMENT DRIFT DOCUMENTATION

```
┌─────────────────────────────────────────────────────────────┐
│                    ENVIRONMENT MAP                           │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│   LOCAL     │   STAGING   │  PRODUCTION │   CODE           │
│   (dev)     │   (CI-only) │  (live)     │   (migrations)   │
├─────────────┼─────────────┼─────────────┼──────────────────┤
│ Points to   │ Project     │ Project     │ 51 migration     │
│ PRODUCTION  │ dxirtihr... │ srirrwpg... │ files (000-061)  │
│ srirrwpg... │             │             │                  │
├─────────────┼─────────────┼─────────────┼──────────────────┤
│ 13 SB       │ 17/17 SB    │ 13 SB       │ 58+ tables       │
│ tables      │ tables      │ tables      │ defined          │
├─────────────┼─────────────┼─────────────┼──────────────────┤
│ No staging  │ Accessible  │ Hand-built  │ 14 FIXED,        │
│ credentials │ only via CI │ schema      │ 2 NEW            │
│ locally     │ secrets     │             │                  │
└─────────────┴─────────────┴─────────────┴──────────────────┘

DRIFT:
  LOCAL ≠ STAGING   (different Supabase projects)
  LOCAL = PRODUCTION (same project, same credentials)
  STAGING ≠ PRODUCTION (different projects, different schemas)
  CODE > PRODUCTION  (migrations define more tables than exist)
  CODE = STAGING     (migrations fully applied in CI)
```

---

## 8. ROOT CAUSE — WHY EVIDENCE DOESN'T MATCH

### The question: 
*"Prior evidence says SCHEMA_OK 17/17. Current audit finds 26 tables missing. Why?"*

### The answer:
**They audited different databases.**

1. Prior evidence (2026-08-29) ran against **STAGING** project `dxirtihrpnlnxkxpmkmx` in GitHub Actions CI. Migrations 000-059 were applied via `supabase db push`. All 17 critical tables were created. The golden user journey ran 15/20 steps successfully.

2. Current audit (2026-09-01) runs against **PRODUCTION** project `srirrwpgswlnuqfgtule` because that's what the local `.env` files point to. Production was hand-built and never had migrations applied. Only 13 of the 17 critical SmartBoard tables exist.

3. The 26 "missing" tables were never missing from staging — they were missing from **production**, which is a known state documented in `SCHEMA_DRIFT_REPORT.md` section 2.

### Contributing factors:
- No local `.env.staging` or `.env.local` file with staging credentials
- Staging project was created and validated exclusively within CI runners
- `STAGING_VERIFICATION_REPORT.md` describes local staging as "BLOCKED" without clarifying that CI staging exists — creating an apparent contradiction
- The SmartBoard 3.0 finalization session started by auditing the local environment, which defaults to production

---

## 9. TABLE CLASSIFICATION (26 missing from production)

### CORE — 6 tables (block basic SmartBoard operation)
| Table | Migration | Referenced By |
|-------|-----------|---------------|
| sessions | 011/059 | adaptiveLearning, parentInsights, frontend |
| parent_consents | 008 | smartboard.js consent routes |
| points_history | 011/059 | parentChatService, achievementService |
| conversations | 011/059 | (session lifecycle) |
| crisis_alerts | 009/059 | smartboard.js crisis routes |
| academic_context | 011/059 | (session triggers in 059) |

### SUPPORT — 11 tables (enhance features, don't block core)
| Table | Migration | Category |
|-------|-----------|----------|
| achievements | 011/059 | Gamification |
| student_achievements | 035/059 | Gamification |
| achievement_stats | 035/059 | Gamification |
| achievement_categories | 035/059 | Gamification |
| parent_alerts | 033 | Parent notifications |
| avatars | none | Profile |
| student_risk_scores | 037 | Predictions |
| predictive_alerts | 037 | Predictions |
| learning_gap_predictions | 037 | Predictions |
| alert_actions | 037 | Predictions |
| parent_dani_conversations | 038 | Parent chat |

### SUPPORT — 5 tables (multiplayer/competitive)
| Table | Migration | Referenced By |
|-------|-----------|---------------|
| leaderboards | 036 | multiplayerService, achievementService |
| competition_events | 036 | multiplayerService |
| competition_participants | 036 | multiplayerService |
| student_competition_stats | 036 | multiplayerService |
| conversation_messages | 038 | parentChatService |
| conversation_summaries | 038 | parentChatService |

### EXPERIMENTAL — 4 tables (stub service, no migration)
| Table | Service | Decision Needed |
|-------|---------|-----------------|
| feature_usage | metricsService | Create migration or remove stub |
| lesson_attempts | metricsService | Create migration or remove stub |
| user_sessions | metricsService | Create migration or remove stub |
| missions_completed | achievementService | Create migration or remove stub |

### IALAB — 0 tables
None of the missing tables are IALab-specific.

### DEAD — 0 tables
All missing tables have at least one active service reference.

### UNKNOWN — 0 tables
All tables classified.

---

## 10. RECOMMENDATIONS (no action taken — diagnosis only)

### Immediate (before any SmartBoard phase resumes):

1. **Decide which environment to audit**: If the goal is to validate SmartBoard for production, audit production (`srirrwpgswlnuqfgtule`). If the goal is to validate the migration-built schema, connect to staging (`dxirtihrpnlnxkxpmkmx`) — but that requires staging credentials from GitHub Actions secrets.

2. **Do not assume staging evidence applies to production**: The 17/17 SCHEMA_OK and 15/20 Golden Journey results are valid — but only for the staging project. Production has a different schema state.

3. **Migration 059 is the production unblock**: Applying migration 059 to production would create 9 of the 26 missing tables (sessions, points_history, crisis_alerts, conversations, achievements, academic_context, achievement_categories, student_achievements, achievement_stats). This requires explicit authorization per project rules.

### Before production migration:

4. **Validate 059 on staging first**: The staging project already has 059 applied successfully. But verify it's still accessible and the schema matches expectations.

5. **Remaining 17 tables**: After 059, tables from migrations 008, 033-038 would still be missing. These create parent_consents, parent_alerts, predictions, parent_chat, and multiplayer subsystems.

6. **4 experimental tables**: metricsService references tables with no migration. Decision needed: create migrations or remove the stub.

---

## 11. SUMMARY

| Question | Answer |
|----------|--------|
| Are we auditing the same staging that was validated? | **NO** |
| What are we auditing? | PRODUCTION (`srirrwpgswlnuqfgtule`) |
| What was validated before? | STAGING (`dxirtihrpnlnxkxpmkmx`) — CI-only |
| Why the schema gap? | Production was hand-built; staging had all migrations applied |
| Is the prior evidence valid? | **YES** — valid for staging, not for production |
| Is the prior evidence fraudulent? | **NO** — it accurately describes a different environment |
| Gate for SmartBoard phases? | **BLOCKED** — must decide: target staging or fix production first |
| Any IALab impact? | **NONE** — no IALab tables or code involved |

---

*Report generated 2026-09-01. Read-only analysis — zero modifications made to any database, table, migration, or production system.*
