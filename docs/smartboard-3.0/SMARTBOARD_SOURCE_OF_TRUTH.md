# SmartBoard 3.0 — Source of Truth Map

> Snapshot: 2026-09-01 | Branch: recovery/foundation-phase-a
> Para cada entidad: fuente canónica, duplicados, estado de migración

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| **DB** | Supabase PostgreSQL (source of truth persistente) |
| **LS** | localStorage del navegador |
| **API** | Backend Express endpoint |
| **BLOB** | smartboard_kids_data.data JSONB (sync bulk) |
| **COMPUTED** | Calculado en runtime, no persistido |

---

## Entidades y Fuentes

### 1. Student Profile
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| name, age, grade, school | DB: `students` | LS: `age_`, `grade_`, `school_` | 011, 021, 040, 047, 051 |
| vak_style | DB: `students.vak_style` | LS: `vak_` | 040 |
| avatar_url | DB: `students.avatar_url` | — | 011 |
| auth_id | DB: `students.auth_id` | — | 011 |
| subscription_tier | DB: `students.subscription_tier` | LS: `subscription_tier` | 029 |
| country_code | DB: `students.country_code` | LS: `country_` | 051 |
| grade_level | DB: `students.grade_level` | — | 051 |
| **Sync**: DB → LS en load (DB overwrites LS). LS → DB via saveData() debounced. |

### 2. VAK Results
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| scores, primary_style | DB: `vak_results` | LS: `vak_` | 011 |
| **Sync**: Mutation escribe a DB + LS. Load prefiere DB. |
| **Nota**: `vak_results.user_id` es TEXT (auth_id), NO student_id UUID. RLS usa `user_id = auth.uid()::TEXT`. |

### 3. Points
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| points, reason, category | DB: `points_history` | LS: `points_`, `points_history_` | 011/059 |
| totalPoints | COMPUTED (sum) | LS: `points_` | — |
| **Sync**: Optimistic local + mutation. DB data overwrites LS on load. |

### 4. Conversations (Dani Chat)
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| user_message, ai_response | DB: `conversations` | LS: daniChatHistory in BLOB | 011/059 |
| emotional_context | DB: `conversations.emotional_context` | — | 011 |
| **Sync**: Server persists on each chat (fire-and-forget). History loaded on mount via API. |

### 5. Sessions (Learning Activities)
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| subject, type, points_earned | DB: `sessions` | LS: `sessions_` | 011/059 |
| Dashboard visit sessions | LS ONLY | — | — |
| **Sync**: Learning sessions → DB via useSessionCreate. Dashboard visits → LS only (subject NOT NULL constraint). |
| **Constraint**: subject CHECK IN ('math','language','science','history','art','general'). |

### 6. Streaks
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| current_streak, best_streak | DB: `learning_streaks` | LS: `streak_` | 011 |
| **GAP**: Frontend computa streaks localmente pero NO escribe a DB. DB data overwrites LS on load. |
| **Riesgo**: Si DB está vacía, streaks se pierden al cambiar de dispositivo. |

### 7. Dani Memory
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| communication_style, strengths, etc. | DB: `dani_memory` | LS: `dani_memory_` | 052 |
| **Sync**: LS inmediato, DB debounced (2s). Load prefiere DB, fallback a LS. |

### 8. Improvement Plans
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| plan weeks, activities | DB: `learning_plans` | LS: `improvement_plan_` | 050/052 |
| completed activities | LS: `plan_completed_` | BLOB sync | — |
| **Sync**: Server tried first on load; LS fallback. Saves go to both. |

### 9. Timetable
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| schedule, slots, exams | DB: `student_timetable` + `timetable_slots` + `student_exams` | — | 042 |
| **Sync**: Server-only. No localStorage. Direct Supabase REST calls. |

### 10. Competency Mastery
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| mastery_level, practice_count | DB: `student_competency_mastery` | — | 053 |
| **Sync**: Server-only. Backend reads/writes via service role. |
| **Formula**: new_mastery = old * 0.7 + score * 0.3 |

### 11. Early Warnings
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| type, severity, recommendation | DB: `early_warnings` | — | 052 |
| **Sync**: Server-only. Backend computes and persists. |

### 12. Achievements
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| achievement_type, title | DB: `achievements` | COMPUTED in useSmartBoardStats | 011/059 |
| **GAP CRÍTICO**: DB tabla existe y se lee (useAchievements hook) pero NADA escribe. Frontend computa logros efímeramente. |

### 13. Badges (Gamification 2.0)
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| badges catalog | DB: `badges` | — | 054 |
| student unlocks | DB: `student_badges` | — | 054 |
| **Sync**: Server-only. Backend writes via badgeEngine. |

### 14. Missions
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| mission catalog | DB: `missions` | DEFAULT_MISSIONS (hardcoded) | 054 |
| student progress | DB: `student_missions` | LS: `missions_` | 054 |
| **Sync**: Server loaded on init (replaces defaults). Completion notified to server. |

### 15. Student Grades (Scanned)
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| grades array | LS ONLY: `edutechlife_grades_` | DB: `students.grades_json` (via blob) | 043 |
| **GAP**: No hay endpoint dedicado para grades. Solo se incluye en buildDaniContext. |

### 16. Onboarding State
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| step, complete, welcomed | LS ONLY | — | — |
| **GAP**: Se pierde al limpiar browser o cambiar dispositivo. |

### 17. Parent Consents
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| status, parent_email, token | DB: `parent_consents` | — | 008, 025, 031 |
| **Sync**: Server-only. Frontend reads via API. |
| **FK**: `student_id → auth.users(id)` (NO students.id) |

### 18. Parent-Student Links
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| parent_user_id, student_user_id | DB: `parent_student_links` | — | 023, 026 |
| **PK**: (parent_user_id, student_user_id) composite TEXT |

### 19. Crisis Alerts
| Campo | Canónica | Duplicado | Migración |
|-------|----------|-----------|-----------|
| detected_content, crisis_level | DB: `crisis_alerts` | — | 009, 059, 062 |
| **FK**: `student_id → auth.users(id)` (NO students.id) |

---

## Resumen de Gaps de Sincronización

| # | Gap | Impacto | Severidad |
|---|-----|---------|-----------|
| 1 | Streaks: frontend no escribe a DB | Streaks se pierden al cambiar dispositivo | MEDIUM |
| 2 | Achievements: DB existe pero no se escribe | Logros efímeros, no persistentes | MEDIUM |
| 3 | Student Grades: LS-only sin endpoint dedicado | Grades escaneadas se pierden al cambiar dispositivo | LOW |
| 4 | Onboarding: LS-only | Onboarding se repite al cambiar dispositivo | LOW |
| 5 | Points UI claims no implementados | "+200 materia" y "+150 racha" en UI pero no en código | LOW (UX confusion) |
| 6 | Dual persistence merge conflicts | localStorage y DB pueden divergir bajo condiciones de red | MEDIUM |
