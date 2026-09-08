# SMARTBOARD SCHEMA CONTRACT

**Fecha:** 2026-08-29
**Rama:** `recovery/foundation-phase-a`
**Fuente de verdad del contrato:** migraciones `supabase/migrations` (011, 042, 052–058) **+ sondeo de producción** (REST read-only con service key, 2026-08-29).
**Regla:** UNA fuente de verdad por entidad. LocalStorage/JSON blobs **nunca** como fuente crítica.

> Estado de tablas en PRODUCCIÓN: `sessions`, `points_history`, `crisis_alerts`, `conversations`, `achievements` **no existen aún** en el esquema remoto (base construida a mano). El código ya apunta a los nombres canónicos (que existen en migraciones). **FASE C** debe crearlas mediante migración de conciliación.

---

## 1. MASTERY

| Campo | Valor |
|---|---|
| **Source of truth** | `student_competency_mastery` |
| **Columnas (tipos)** | `id` uuid · `student_id` uuid FK→students · `competency_id` text FK→competencies · `mastery_level` numeric(4,3) 0..1 · `practice_count` int · `last_score` numeric(4,3) · `last_practiced_at` timestamptz · `updated_at` timestamptz · UNIQUE(student_id, competency_id) |
| **Writer** | Backend: `competencyMastery.updateCompetencyMastery` / `batchUpdateMastery` (media móvil ponderada 0.7/0.3) vía POST `/api/smartboard/adaptive/mastery` |
| **Readers** | `daniOrchestrator` (áreas de refuerzo), `parentInsights` (insights), `earlyWarning` (performance_drop/repeated_errors), `badgeEngine` (badges por materia), `adaptiveLearning` (estado), frontend `useSkillPassport` (vía backend), frontend `useCompetencyTracking` (escritura vía backend) |
| **Auth ownership** | RLS: `mastery_own_select`/`mastery_own_upsert` (estudiante sobre sus filas); backend con service-role |
| **Persistence** | DB (normalizada). Sin localStorage |
| **Frontend consumer** | `useSkillPassport.js` (lee `mastery_level`, `last_practiced_at`), `useCompetencyTracking.js` (escribe score) |
| **Backend consumer** | `competencyMastery.js` (write), 5 motores (read) |
| **Columna antigua (prohibida)** | `mastery_score`, `attempts`, `last_updated` |

## 2. DANI MEMORY

| Campo | Valor |
|---|---|
| **Source of truth** | `dani_memory` (1 fila por estudiante, UNIQUE(student_id)) |
| **Columnas (tipos)** | `id` · `student_id` uuid FK · `communication_style` text CHECK('shy'/'direct'/'playful'/'curious') · `strengths` text[] · `weaknesses` text[] · `interests` text[] · `frequent_errors` text[] · `pending_topics` text[] · `last_mood` text · `last_updated` timestamptz · `created_at` |
| **Writer** | Frontend `useDaniMemory.js` (upsert directo a columnas tipadas, debounce 2s) |
| **Readers** | Backend `daniOrchestrator` y `parentInsights` (mapeo a camelCase) |
| **Auth ownership** | RLS: estudiante sobre su fila (052) |
| **Persistence** | DB. Chat history de Dani: pendiente de tabla (blob/localStorage hoy) — FASE F |
| **Frontend consumer** | `useDaniMemory.js` (escribe), `useSmartBoardActions.js` (contexto local) |
| **Backend consumer** | `daniOrchestrator.js`, `parentInsights.js` |
| **Columna antigua (prohibida)** | `memory_data` (no existe) |

## 3. LEARNING PLANS

| Campo | Valor |
|---|---|
| **Source of truth** | `learning_plans` |
| **Columnas (tipos)** | `id` · `student_id` uuid FK · `type` text CHECK('daily'/'weekly'/'monthly') · `plan_json` jsonb · `generated_at` timestamptz · `expires_at` timestamptz · `is_active` bool |
| **Writer** | Backend `adaptiveLearning.saveLearningPlan` (POST `/adaptive/daily-plan` y `/weekly-plan`) |
| **Readers** | `daniOrchestrator` (plan de hoy), `parentInsights` (insight focus), dashboard (vía `/adaptive/*`) |
| **Auth ownership** | RLS: estudiante lee su plan; service-role escribe (052) |
| **Persistence** | DB `plan_json`. ⚠️ El plan de mejora generado por IA en frontend (`useImprovementPlan`) vive en localStorage → migrar a DB (FASE F) |
| **Frontend consumer** | `useAdaptiveEngine.js` (genera vía backend), `useImprovementPlan.js` (localStorage hoy) |
| **Backend consumer** | `adaptiveLearning.js` (write), `daniOrchestrator.js`, `parentInsights.js` |
| **Columna antigua (prohibida)** | `plan_data`; **ojo:** no existe `created_at` en la tabla (usar `generated_at`) |

## 4. SESSIONS

| Campo | Valor |
|---|---|
| **Source of truth** | `sessions` ⚠️ **NO existe aún en prod** (FASE C la crea) |
| **Columnas (tipos)** | `id` · `student_id` uuid FK · `start_time`/`end_time` timestamptz · `subject` text CHECK · `points_earned` int · `type` text CHECK('lesson'/'game'/'quiz'/'free_practice'/'challenge') · `duration_minutes` int · `content_id` uuid · `completion_percentage` int · `notes` text · `created_at`/`updated_at` |
| **Writer** | Frontend directo (`useSmartBoardSupabase.ts` INSERT + `SmartBoardConsentGate`); backend aún no escribe (FASE F) |
| **Readers** | `adaptiveLearning.fetchRecentSessions` (`subject, duration_minutes, created_at`), `parentInsights` (hábito: `created_at, duration_minutes, subject`) |
| **Auth ownership** | RLS: estudiante sobre sus sesiones (011) |
| **Persistence** | DB (normalizada). El blob `sessions` del frontend es un dataset distinto (tracking local) → debe converger |
| **Frontend consumer** | `useSmartBoardSupabase.ts`, `useSessionCreate` |
| **Backend consumer** | `adaptiveLearning.js`, `parentInsights.js` |
| **Tabla antigua (prohibida)** | `activity_sessions`; columna `duration` → `duration_minutes` |

## 5. SCHEDULE

| Campo | Valor |
|---|---|
| **Source of truth** | `student_timetable` (1 activa) → `timetable_slots` |
| **Columnas (tipos)** | `student_timetable`: `id`, `student_id` FK, `school_name`, `term_label`, `term_start/term_end`, `timezone`, `source`, `is_active`. `timetable_slots`: `id`, `timetable_id` FK, `day_of_week` SMALLINT 1..7 (**Mon=1…Sun=7**), `start_time`/`end_time` TIME, `subject`, `subject_label`, `teacher`, `room`, `color`, `notes` |
| **Writer** | Frontend `useTimetable.js` (directo Supabase) |
| **Readers** | `daniOrchestrator.fetchTodaySchedule` (via timetable activa + slots por `day_of_week`) |
| **Auth ownership** | RLS permisiva (042) — revisar en FASE D |
| **Persistence** | DB |
| **Frontend consumer** | `useTimetable.js` |
| **Backend consumer** | `daniOrchestrator.js` |
| **Tabla antigua (prohibida)** | `schedule_slots` |

## 6. GRADES

| Campo | Valor |
|---|---|
| **Source of truth** | `grade_analyses` (JSONB por análisis) |
| **Columnas (tipos)** | `id`, `student_user_id` (auth uid), `grades` jsonb `[{subject, score}]`, `created_at` |
| **Writer** | Frontend `useGradeScanner.js` (POST directo `grade_analyses`) + `POST /api/smartboard/student-grades` |
| **Readers** | `adaptiveLearning.fetchGrades` (resuelve auth_id → `grade_analyses.student_user_id`) |
| **Auth ownership** | RLS propio (039); backend con service-role |
| **Persistence** | DB (JSONB) + backup local en `students.grades_json` |
| **Frontend consumer** | `useGradeScanner.js`, `useStudentGradesPersistence.js` |
| **Backend consumer** | `adaptiveLearning.js` |

## 7. MISSIONS

| Campo | Valor |
|---|---|
| **Source of truth** | `missions` (catálogo) + `student_missions` (progreso) |
| **Columnas (tipos)** | `missions`: `id`, `key`, `type` ('daily'/'weekly'/'exploration'/'competency'), `title`, `description`, `icon`, `xp_reward`, `criteria_json`, `is_active`. `student_missions`: `id`, `student_id` FK, `mission_id` FK, `progress`, `target`, `completed`, `completed_at`, `expires_at`, UNIQUE(student_id, mission_id) |
| **Writer** | Backend `missionEngine.js` (seed + `recordActivity`) |
| **Readers** | `missionEngine.getStudentMissions`, `badgeEngine` (embedded), frontend (vía `/gamification/missions`) |
| **Auth ownership** | RLS: estudiante sobre sus misiones (054); `missions` lectura pública |
| **Persistence** | DB. ⚠️ Frontend cae a `DEFAULT_MISSIONS` estáticos si la llamada falla (fix auth aplicado) |
| **Frontend consumer** | `SmartBoardKidsContext.jsx` (GET misiones con token corregido) |
| **Backend consumer** | `missionEngine.js`, `badgeEngine.js` |

## 8. BADGES

| Campo | Valor |
|---|---|
| **Source of truth** | `badges` (catálogo) + `student_badges` (desbloqueos) |
| **Columnas (tipos)** | `badges`: `id`, `key`, `name`, `description`, `icon`, `criteria_json`, `is_active`. `student_badges`: `id`, `student_id` FK, `badge_id` FK, `unlocked_at`, `evidence_json`, UNIQUE(student_id, badge_id) |
| **Writer** | Backend `badgeEngine.checkAndUnlockBadges` |
| **Readers** | frontend `useSkillPassport` (vía `/gamification/badges`) |
| **Auth ownership** | RLS: estudiante sobre sus badges (054); catálogo público |
| **Persistence** | DB |
| **Frontend consumer** | `useSkillPassport.js` |
| **Backend consumer** | `badgeEngine.js` |
| **Nota** | Criterio por mastery usa `mastery_level` (corregido) |

## 9. POINTS

| Campo | Valor |
|---|---|
| **Source of truth** | `points_history` ⚠️ **NO existe aún en prod** (FASE C) |
| **Columnas (tipos)** | `id`, `student_id` FK, `points` int (≠0), `reason`, `category` CHECK, `related_session_id` FK, `timestamp`, `metadata` jsonb |
| **Writer** | Frontend `useSmartBoardSupabase.ts` (INSERT directo, optimista) |
| **Readers** | frontend `useTotalPoints`, parent dashboard |
| **Auth ownership** | RLS: estudiante lee; service-role inserta (011) |
| **Persistence** | DB. Total en blob/localStorage como cache (no fuente) |
| **Frontend consumer** | `useSmartBoardSupabase.ts`, `useSmartBoardStats.js` |
| **Backend consumer** | ninguno aún (FASE F) |

## 10. NOTIFICATIONS

| Campo | Valor |
|---|---|
| **Source of truth** | `notifications` (definida en `sql/create_notifications_table.sql`) |
| **Columnas (tipos)** | id, user_id, type, title, body, read, created_at (schema loose) |
| **Writer** | Frontend `NotificationContext.jsx` (INSERT/UPDATE/DELETE + fallback localStorage `ialab_notifications`) |
| **Readers** | Frontend panel (`SmartBoardNotificationPanel`) |
| **Auth ownership** | RLS own-row |
| **Persistence** | DB + fallback localStorage (cache) |
| **Frontend consumer** | `NotificationContext.jsx`, `useSmartBoardNotifications.js` |
| **Backend consumer** | `parentAlertsService.js` (completo, **sin montar** — FASE D/P9) |

## 11. PARENT INSIGHTS

| Campo | Valor |
|---|---|
| **Source of truth** | Derivado: `student_competency_mastery` + `dani_memory` + `learning_plans` + `sessions` + `students` |
| **Writer** | — (cálculo) |
| **Readers** | GET `/api/smartboard/parent/insights`, `/parent/learning-graph` |
| **Auth ownership** | RLS del estudiante; endpoints requieren consent (⚠️ ownership del `studentId` sin verificar → FASE D) |
| **Persistence** | — (derivado en vivo) |
| **Frontend consumer** | `useParentInsights.js` |
| **Backend consumer** | `parentInsights.js` |

## 12. EARLY WARNINGS

| Campo | Valor |
|---|---|
| **Source of truth** | `early_warnings` |
| **Columnas (tipos)** | `id`, `student_id` FK, `severity` CHECK('low'/'medium'/'high'), `type` CHECK, `evidence_json` jsonb, `recommendation`, `resolved_at`, `created_at` |
| **Writer** | Backend `earlyWarning.js` (detectores: inactivity, performance_drop, repeated_errors, streak_breaks) |
| **Readers** | GET `/api/smartboard/adaptive/warnings`, frontend `useEarlyWarnings.js` |
| **Auth ownership** | RLS: estudiante lee (052) |
| **Persistence** | DB. Inputs: `learning_streaks`, `student_competency_mastery` (columnas corregidas) |
| **Frontend consumer** | `useEarlyWarnings.js` |
| **Backend consumer** | `earlyWarning.js` |

## 13. STUDENT PROFILE

| Campo | Valor |
|---|---|
| **Source of truth** | `students` |
| **Columnas (tipos)** | `id`, `auth_id` FK auth.users, `name`, `age` (5-25), `email`, `vak_result_json` jsonb, `subscription_tier`, `parent_email`, `parent_verified`, `language`, `avatar_url`, `bio`, `school`, `grade`, `vak_style`, `grade_level`, `country_code`, `grades_json` jsonb, `progress_json` jsonb, `last_activity`, `is_active` |
| **Writer** | Backend GET/PUT `/api/smartboard/student-profile` (+ avatar) |
| **Readers** | Motores (profile), frontend (`useStudentProfileSmartBoard`) |
| **Auth ownership** | RLS own-row (011) — ⚠️ política permisiva `FOR ALL` en prod (041/049) → FASE D |
| **Persistence** | DB. Cache local `student_name/age/grade` (no fuente) |
| **Frontend consumer** | `useStudentProfileSmartBoard.js`, `SmartProfile.jsx` |
| **Backend consumer** | `daniOrchestrator`, `parentInsights`, `adaptiveLearning`, `weekly-report` (resolve auth_id→id) |
| **Columnas inexistentes (corregidas)** | `school_name` (→ `school`) |

---

## Tablas planificadas que faltan en PRODUCCIÓN (FASE C)

`sessions` · `points_history` · `crisis_alerts` · `conversations` · `achievements` — existen en migraciones; el código ya las usa con nombres/columnas correctos. **FASE C** las crea en el esquema remoto (migración de conciliación idempotente, sin reset).

## Tablas de analytics del stub (metrics)

`user_sessions`, `lesson_attempts`, `parent_dashboard_views`, `feature_usage` — referenciadas por `metricsService` (stub); **no existen**. Decisión: FASE C las crea o se elimina el stub (FASE D/P9).
