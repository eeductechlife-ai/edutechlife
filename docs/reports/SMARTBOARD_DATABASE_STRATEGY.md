# SmartBoard Database Strategy

**Date:** 2026-09-01  
**Branch:** `recovery/foundation-phase-a`  
**Constraint:** NO tables created, NO migrations executed, NO production changes

---

## 1. Table Inventory (SmartBoard-relevant)

### Legend
- **S** = Exists in STAGING (`dxirtihrpnlnxkxpmkmx`)
- **P** = Exists in PRODUCTION (`srirrwpgswlnuqfgtule`)
- **M** = Migration file exists
- **C** = Service consumer(s) exist in code

| # | Table | S | P | M | C | Classification |
|---|-------|---|---|---|---|---------------|
| 1 | students | ✅ | ✅ | 011 | 6 services, routes, frontend | CORE |
| 2 | student_competency_mastery | ✅ | ✅ | 053 | 5 services | CORE |
| 3 | dani_memory | ✅ | ✅ | 052 | 2 services, frontend | CORE |
| 4 | learning_plans | ✅ | ✅ | 052 | 3 services | CORE |
| 5 | learning_streaks | ✅ | ✅ | 011 | 4 services | CORE |
| 6 | early_warnings | ✅ | ✅ | 052 | 1 service | CORE |
| 7 | competencies | ✅ | ✅ | 053 | (FK target) | CORE |
| 8 | learning_content | ✅ | ✅ | 055 | 1 service | CORE |
| 9 | recommendations | ✅ | ✅ | 056 | 1 service | CORE |
| 10 | missions | ✅ | ✅ | 054 | 1 service, frontend | CORE |
| 11 | student_missions | ✅ | ✅ | 054 | 2 services | CORE |
| 12 | badges | ✅ | ✅ | 054 | 1 service | CORE |
| 13 | student_badges | ✅ | ✅ | 054 | 1 service | CORE |
| 14 | grade_analyses | ✅ | ✅ | 039 | 1 service | CORE |
| 15 | student_timetable | ✅ | ✅ | 042 | 1 service | CORE |
| 16 | timetable_slots | ✅ | ✅ | 042 | 1 service | CORE |
| 17 | parent_student_links | ✅ | ✅* | 023 | 2 services, routes | CORE |
| 18 | sessions | ✅ | ❌ | 011/059 | 2 services, frontend | CORE |
| 19 | parent_consents | ✅ | ❌ | 008 | routes | CORE |
| 20 | crisis_alerts | ✅ | ❌ | 009/059 | routes | CORE |
| 21 | points_history | ✅ | ❌ | 011/059 | 2 services | SUPPORT |
| 22 | conversations | ✅ | ❌ | 011/059 | — | SUPPORT |
| 23 | academic_context | ✅ | ❌ | 059 | (triggers) | SUPPORT |
| 24 | achievements | ✅ | ❌ | 011/059 | 1 service | SUPPORT |
| 25 | student_achievements | ✅ | ❌ | 035/059 | 2 services | SUPPORT |
| 26 | achievement_stats | ✅ | ❌ | 035/059 | 1 service | SUPPORT |
| 27 | achievement_categories | ✅ | ❌ | 035/059 | (FK target) | SUPPORT |
| 28 | smartboard_kids_data | ✅ | ✅* | 046 | routes | SUPPORT |
| 29 | parent_alerts | ✅ | ❌ | 033 | 1 service | SUPPORT |
| 30 | rewards | ✅ | ? | 058 | frontend | SUPPORT |
| 31 | student_rewards | ✅ | ? | 058 | frontend | SUPPORT |
| 32 | feedback_log | ✅ | ? | 057 | — | SUPPORT |
| 33 | avatars | ? | ❌ | none | routes | SUPPORT |
| 34 | student_risk_scores | ✅ | ❌ | 037 | 2 services | SUPPORT |
| 35 | predictive_alerts | ✅ | ❌ | 037 | 1 service | SUPPORT |
| 36 | learning_gap_predictions | ✅ | ❌ | 037 | 1 service | SUPPORT |
| 37 | alert_actions | ✅ | ❌ | 037 | 1 service | SUPPORT |
| 38 | parent_dani_conversations | ✅ | ❌ | 038 | 1 service | SUPPORT |
| 39 | conversation_messages | ✅ | ❌ | 038 | 1 service | SUPPORT |
| 40 | conversation_summaries | ✅ | ❌ | 038 | 1 service | SUPPORT |
| 41 | leaderboards | ✅ | ❌ | 036 | 2 services | OPTIONAL |
| 42 | competition_events | ✅ | ❌ | 036 | 1 service | OPTIONAL |
| 43 | competition_participants | ✅ | ❌ | 036 | 1 service | OPTIONAL |
| 44 | student_competition_stats | ✅ | ❌ | 036 | 1 service | OPTIONAL |
| 45 | feature_usage | ❌ | ❌ | none | metricsService | EXPERIMENTAL |
| 46 | lesson_attempts | ❌ | ❌ | none | metricsService | EXPERIMENTAL |
| 47 | user_sessions | ❌ | ❌ | none | metricsService | EXPERIMENTAL |
| 48 | missions_completed | ❌ | ❌ | none | achievementService | EXPERIMENTAL |

\* Hand-created, may differ from migration schema

---

## 2. Production Reconciliation Strategy

### Phase R1: Backup (PREREQUISITE)
```
1. pg_dump full production schema + data
2. Store backup with timestamp in secure location
3. Verify backup restores cleanly to isolated instance
```

### Phase R2: Staging Verification
```
1. Confirm staging project dxirtihrpnlnxkxpmkmx is still accessible
2. Verify 17/17 critical tables exist
3. Run schema validation (validate_schema.sql)
4. Verify Golden Journey still passes on staging
```

### Phase R3: Production Diff
```
1. Export production schema (pg_dump --schema-only)
2. Export staging schema (pg_dump --schema-only)
3. Diff: identify tables, columns, constraints, RLS policies
4. Document every difference in MIGRATION_DIFF_PLAN.md
```

### Phase R4: Migration Plan (ordered by dependency)
```
Batch 1 — CORE tables (migration 059 + 008):
  sessions, points_history, crisis_alerts, conversations,
  achievements, academic_context, parent_consents
  (+ achievement_categories, student_achievements, achievement_stats)

Batch 2 — SUPPORT tables (migrations 033-035):
  parent_alerts, parent_alerts_archive

Batch 3 — PREDICTION tables (migration 037):
  student_risk_scores, predictive_alerts, learning_gap_predictions,
  alert_actions, prediction_metrics

Batch 4 — PARENT CHAT tables (migration 038):
  parent_dani_conversations, conversation_messages,
  conversation_summaries, dani_response_templates

Batch 5 — OPTIONAL tables (migration 036):
  leaderboards, competition_events, competition_participants,
  student_competition_stats
```

### Phase R5: Dry-Run
```
1. Create a production CLONE (Supabase branch or manual copy)
2. Apply Batch 1 on clone
3. Run backend tests against clone
4. Verify routes work
5. Apply remaining batches incrementally
6. Full test suite on clone
```

### Phase R6: Production Migration
```
1. Schedule maintenance window
2. Disable deploy pipeline
3. Take fresh backup
4. Apply Batch 1 (CORE — most critical)
5. Verify with smoke tests
6. Apply remaining batches
7. Run full verification
8. Re-enable deploy pipeline
```

### Phase R7: Verification
```
1. schema-contract.test.js: 8/8
2. golden-data-flow.test.js: 7/7
3. validate_schema.sql: 32 tables + 16 columns
4. Backend tests: 345 pass
5. Frontend build: success
6. Manual smoke test: login → profile → mastery → plan → Dani
```

### Phase R8: Rollback Plan
```
1. If Batch N fails → revert that batch's DDL
2. If data corruption → restore from Phase R1 backup
3. If cascading failure → full restore + rollback deploy
4. Rollback window: 24 hours after migration
```

---

## 3. Table Priority for MVP

### P0 — Must exist for Beta MVP (Batch 1)
| Table | Why |
|-------|-----|
| sessions | adaptiveLearning, parentInsights need session data |
| parent_consents | Legal requirement for minors — consent gate |
| crisis_alerts | Safety requirement — crisis detection storage |
| points_history | Gamification scoring |
| academic_context | Session triggers |
| achievements + categories + stats + student_achievements | Achievement display |
| conversations | Session conversations |

### P1 — Needed for full parent experience (Batches 2-3)
| Table | Why |
|-------|-----|
| parent_alerts | Parent notification system |
| student_risk_scores + predictive_alerts | Prediction dashboard |
| learning_gap_predictions + alert_actions | Risk remediation |

### P2 — Enhancement features (Batches 4-5)
| Table | Why |
|-------|-----|
| parent_dani_conversations + messages + summaries | Parent-Dani chat |
| leaderboards + competition tables | Competitive features |

### DEFER — No migration, needs design decision
| Table | Decision Needed |
|-------|----------------|
| feature_usage, lesson_attempts, user_sessions | Create migration for metricsService OR adopt PostHog |
| missions_completed | Create migration OR derive from student_missions |
| avatars | Create migration OR use Supabase Storage directly |

---

## 4. RLS Security Status

| Category | State | Action Required |
|----------|-------|-----------------|
| Student own-row policies | ✅ 20+ tables | None |
| Parent-link policies | ✅ smartboard_kids_data, parent_alerts | None |
| Admin policies | ⚠️ Uses `raw_user_meta_data` | FASE D: fix to role-based |
| Permissive policies (041/049) | ⚠️ `TO authenticated` on students, vak_results | FASE D: tighten to own-row |
| Study group policies (010) | ⚠️ Uses `current_user` (never matches) | FASE D: fix or remove |
| Service-role policies | ✅ Where needed | None |
| IDOR protection | ❌ Missing `requireStudentAccess` middleware | FASE D: implement |

---

## 5. Schema Drift Risks

| Risk | Mitigation |
|------|------------|
| Production hand-built ≠ migration-defined | Phase R3 diff + Phase R5 dry-run |
| `parent_student_links` missing `id` column | Migration 023 adds it; verify on dry-run |
| RLS permissive policies | FASE D after schema reconciliation |
| `current_user` policies (study groups) | Dead code — remove or fix in FASE D |
| metricsService references non-existent tables | Design decision: create or refactor |

---

*Analysis only — no tables created, no migrations executed, no production changes.*
