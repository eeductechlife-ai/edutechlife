# SCHEMA DRIFT REPORT

**Fecha:** 2026-08-29
**Comparación:** CÓDIGO (servicios SmartBoard) vs MIGRACIONES (000–059) vs PRODUCCIÓN (sondeo read-only REST con service key).
**Resultado:** la alineación de FASE B corrigió el código; las migraciones ahora generan el schema esperado; producción se reconcilia con 059.

## 1. CÓDIGO vs MIGRACIONES (después de FASE B + FASE C)

| Referencia de código | Migración | Estado |
|---|---|---|
| `student_competency_mastery.mastery_level/practice_count/updated_at` | 053 | ✅ alineado |
| `dani_memory.communication_style/strengths/interests/...` | 052 | ✅ alineado |
| `learning_plans.plan_json` (+ `generated_at`) | 052 | ✅ alineado |
| `timetable_slots.day_of_week` (SMALLINT 1-7) | 042 (FIXED) | ✅ alineado |
| `sessions.duration_minutes` | 011 | ✅ alineado |
| `students.school` / `grade_level` / `country_code` | 000/021/040/051 (FIXED) | ✅ alineado |
| `learning_streaks.best_streak` | 011 | ✅ alineado |
| Tablas de analytics (`user_sessions`, `lesson_attempts`, `parent_dashboard_views`, `feature_usage`) | **no existen en migraciones** | ⚠️ stub `metricsService` — decisión pendiente (FASE D: crear o eliminar) |

## 2. MIGRACIONES vs PRODUCCIÓN (sondeo 2026-08-29)

| Objeto | Migración | Prod real | Estado |
|---|---|---|---|
| students (+school/grade/vak_style/grades_json/progress_json/grade_level/country_code) | 011/021/040/043/044/051 | ✅ existe | OK |
| dani_memory (tipada) | 052 | ✅ existe | OK |
| learning_plans (plan_json) | 052 | ✅ existe | OK |
| student_competency_mastery (mastery_level) | 053 | ✅ existe | OK |
| competencies / learning_content / recommendations | 053/055/056 | ✅ existen | OK |
| missions / student_missions / badges / student_badges | 054 | ✅ existen | OK |
| timetable_slots / student_timetable (day_of_week) | 042 | ✅ existen | OK |
| early_warnings | 052 | ✅ existe | OK |
| parent_student_links (parent_user_id/student_user_id) | 023 | ✅ existe (sin columna `id`) | OK |
| grade_analyses | 039 | ✅ existe | OK |
| notifications | 000 (baseline) | ✅ existe | OK |
| vak_results / learning_streaks | 011 | ✅ existen | OK |
| **sessions** | 011 | ❌ **FALTA** | → 059 |
| **points_history** | 011 | ❌ **FALTA** | → 059 |
| **conversations** | 011 | ❌ **FALTA** | → 059 |
| **achievements** | 011 | ❌ **FALTA** | → 059 |
| **crisis_alerts** | 009 | ❌ **FALTA** | → 059 |
| parent_alerts / archive / achievements catalog / leaderboards / predictions / parent_chat / improvement_plans | 033-038/050 | ❌ faltan | → 059 (o 033-038 en fresh) |
| `schedule_slots`, `activity_sessions`, `mastery_score`, `plan_data`, `memory_data` | — | ❌ no existen (y ya no se referencian) | ✅ eliminado del código |

## 3. DRIFT RESUELTO vs PENDIENTE

**Resuelto (FASE B):** 100% de las referencias de código a columnas/tablas inexistentes (verificado por `schema-contract.test.js` 8/8 y `golden-data-flow.test.js` 7/7).

**Resuelto (FASE C):** 14 migraciones rotas reescritas; baseline 000 (users/profiles/forum/notifications); 059 reconcilia prod sin reset.

**Pendiente:**
- Tablas de analytics del stub (`user_sessions`, etc.): no existen en migraciones ni prod → decisión en FASE D (crear con schema real o eliminar el stub de `metricsService`).
- RLS permisiva (041/049) y políticas `current_user` (010) → FASE D.
- **Validación de fresh DB en CI** (job `migrations-check`) — requiere ejecución en GitHub Actions (Docker); local BLOCKED (sin Docker/Postgres).

## 4. VERIFICACIÓN

- `schema-contract.test.js`: **8/8** (columnas/tablas del código vs contrato).
- `golden-data-flow.test.js`: **7/7** (una fuente de verdad por entidad).
- `supabase/validate_schema.sql`: assert de 32 tablas + 16 columnas críticas (se ejecuta en CI).
- Sondeo prod: confirmó existencia real de 20+ objetos y los 5 faltantes que crea 059.
