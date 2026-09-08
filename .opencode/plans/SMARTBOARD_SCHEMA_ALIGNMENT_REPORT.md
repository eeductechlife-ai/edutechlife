# SMARTBOARD SCHEMA ALIGNMENT REPORT — FASE B

**Fecha:** 2026-08-29
**Rama:** `recovery/foundation-phase-a`
**Precedente:** FASE A = VERIFIED (con excepción documentada de rotación)
**Método:** FASE → IMPLEMENTACIÓN → TEST → EVIDENCIA → GATE

---

## 1. PROBLEMA

6+ columnas/tablas inexistentes consultadas por los motores SmartBoard → pérdida silenciosa de contexto (Dani, Parent Insights, Early Warning, Badges, weekly-report) y datos. Verificado con sondeo read-only a producción (service key) + migraciones.

## 2. VERDAD DE PRODUCCIÓN (sondeo 2026-08-29)

| Referencia del código | Realidad en prod | Resolución |
|---|---|---|
| `mastery_score`, `attempts`, `last_updated` | `mastery_level`, `practice_count`, `updated_at` (+ `last_score`) | ✅ alineado (4 motores + frontend) |
| `dani_memory.memory_data` | columnas tipadas (`communication_style`, `strengths`, …) | ✅ alineado (daniOrchestrator, parentInsights) |
| `learning_plans.plan_data` | `plan_json` (y `generated_at`, **sin** `created_at`) | ✅ alineado |
| `schedule_slots` | `timetable_slots` (vía `student_timetable`, `day_of_week` SMALLINT 1-7) | ✅ alineado + resolución por timetable activa |
| `activity_sessions` | `sessions` (columna `duration_minutes`, no `duration`) | ✅ alineado |
| `students.school_name` | `school` | ✅ alineado |
| `learning_streaks.longest_streak` | `best_streak` | ✅ alineado |
| Tablas `sessions`, `points_history`, `crisis_alerts`, `conversations`, `achievements` | **no existen aún en prod** | ⚠️ FASE C (conciliación idempotente) |
| Tablas analytics (`user_sessions`, `lesson_attempts`, `parent_dashboard_views`, `feature_usage`) | no existen | ⚠️ FASE C/D (crear o eliminar stub) |

## 3. ARCHIVOS MODIFICADOS (backend)

| Archivo | Cambio |
|---|---|
| `services/daniOrchestrator.js` | profile `school`; mastery `mastery_level/updated_at`; memory columnas tipadas (mapeo camelCase); plan `plan_json`; schedule via `student_timetable`→`timetable_slots` + `day_of_week` int; prompt con nuevos campos |
| `services/parentInsights.js` | mastery/practice_count/updated_at; memory tipada; plan_json; `sessions` real; helpers puros exportados para test |
| `services/earlyWarning.js` | `mastery_level`, `updated_at`, `practice_count` en detectores |
| `services/badgeEngine.js` | `mastery_level` en criterio por materia |
| `services/adaptiveLearning.js` | `school`, `duration_minutes`, `best_streak` |
| `services/competencyMastery.js` | log observable en batch (B.8) |
| `routes/smartboard.js` | weekly-report resuelve `auth_id→students.id` antes de `getStudentMastery`; plan-save ya no silencia errores; `routeLogger` con fallback |
| `__tests__/boot/schema-contract.test.js` | **NUEVO** (B.9) |
| `__tests__/boot/golden-data-flow.test.js` | **NUEVO** (B.10) |
| `__tests__/services/daniOrchestrator.test.js` | **NUEVO** (B.13) |
| `__tests__/services/parentInsights.test.js` | **NUEVO** (B.14 parcial) |
| `__tests__/routes/smartboard.test.js` | fix mocks (weekly-report 3 llamadas; wellbeing por tabla) |

## 4. ARCHIVOS MODIFICADOS (frontend)

| Archivo | Cambio |
|---|---|
| `hooks/useAdaptiveEngine.js` | `sb_auth_token`→`sessionStorage.auth_token`; errores observables (console.error) |
| `hooks/useCompetencyTracking.js` | token corregido |
| `context/useSmartBoardActions.js` | token corregido |
| `context/SmartBoardKidsContext.jsx` | token corregido (missions con auth real) |
| `hooks/useSkillPassport.js` | `mastery_score`→`mastery_level`, `last_updated`→`last_practiced_at` |

## 5. TESTS EJECUTADOS

| Suite | Resultado |
|---|---|
| Backend `npm test` | **VERIFIED — 33/33 suites · 331/331 tests** |
| Frontend (archivos tocados) | **VERIFIED — useSkillPassport 5/5, useAdaptiveEngine 4/4, context/hooks 45/47** |
| Backend `npm run lint` | **VERIFIED — 0 errores, 97 warnings** |
| Boot + sintaxis | **VERIFIED — `BOOT_OK`, `SYNTAX_OK`** |

**Frontend fallos preexistentes (no causados por FASE B, ya documentados en FASE A):** `useAdminAuth.test.js` (`jest is not defined` — migración Jest→Vitest incompleta) y 2 tests de `useSmartBoardSync` (debounce). → FASE G.

## 6. INFRA DE TEST: hallazgo

El mock global `vi.mock('@supabase/supabase-js')` en `src/test-setup.js` **no aplica** (verificado: `vi.isMockFunction` = false). Los servicios que crean su propio cliente (`competencyMastery`, `daniOrchestrator`, etc.) hacen llamadas de red reales en tests (→ "fetch failed" cuando no hay entorno). Los tests existentes pasan porque esas llamadas están dentro de try/catch o no se ejercitan. **Impacto:** los tests B.10–B.14 de nivel servicio (flujo vivo, Dani completo, parent e2e) NO son ejecutables en unit — requieren staging o arreglar el mock global (FASE G).

## 7. ESTADO POR SUB-FASE

| Sub | Descripción | Estado |
|---|---|---|
| B.0 | Schema Contract | ✅ **DONE** (`SMARTBOARD_SCHEMA_CONTRACT.md`) |
| B.1 | Mastery (mastery_level/practice_count/updated_at) | ✅ **VERIFIED** (contract + golden-flow + dani tests) |
| B.2 | Dani Memory (columnas tipadas, read/write/persistencia) | ✅ **VERIFIED** (código) / persistencia viva → staging |
| B.3 | Learning Plans (plan_json; localStorage dependency) | ✅ **VERIFIED** (schema) / migración localStorage→DB → FASE F |
| B.4 | Schedule (timetable_slots + day_of_week) | ✅ **VERIFIED** |
| B.5 | Sessions (sessions, no activity_sessions) | ✅ **VERIFIED** (schema) / tabla falta en prod → FASE C |
| B.6 | Weekly Report (auth_id→students.id) | ✅ **VERIFIED** (route + test) |
| B.7 | Frontend auth (sb_auth_token→sessionStorage) | ✅ **VERIFIED** (grep 0 + tests) |
| B.8 | Silent failure (plan save, batch mastery, adaptive) | ✅ **VERIFIED** (logs observables; sin `.catch(()=>{})` críticos) |
| B.9 | schema-contract.test.js | ✅ **VERIFIED** (8/8) |
| B.10 | Golden data flow | ✅ **VERIFIED** (contract-level) / vivo → staging |
| B.11 | Persistence logout/login | ⚠️ **PARTIAL** — requiere entorno vivo (staging); diseño asegurado por fuente de verdad única |
| B.12 | Dos estudiantes A/B | ⚠️ **PARTIAL** — requiere staging + seed (script propuesto en FASE E) |
| B.13 | Dani recibe profile/mastery/memory/plan/schedule | ✅ **VERIFIED** (buildSystemPrompt 9/9 con los 5 bloques) / vivo → staging |
| B.14 | Parent (activity→mastery→insight; risk→warning→alert) | ⚠️ **PARTIAL** — helpers verificados; flujo vivo → staging |
| B.15 | Regression (tests/build/lint/boot) | ✅ **VERIFIED** |
| B.16 | Producción | ✅ sin cambios de producción (solo código); migraciones pendientes → FASE C |

## 8. RIESGOS

- **Tablas ausentes en prod** (`sessions`, `points_history`, `crisis_alerts`, `conversations`, `achievements`): el código ya apunta a nombres correctos, pero los motores seguirán devolviendo vacío hasta que FASE C cree las tablas. **No rompe boot** (los servicios usan service-role; las queries fallan → datos vacíos, no crash).
- **Dani/schedule**: `timetable_slots`/`student_timetable` existen en prod (sondeo 200) → schedule real disponible ya.
- **IDOR sin resolver** (studentId arbitrario en 16 rutas) — FASE D (fuera de alcance de B).
- **RLS permisiva** en `students`/`vak_results` (041/049) — FASE D.
- **Mock global de supabase roto** en tests → B.10–B.14 vivos requieren FASE G o staging.
- **Plan de mejora frontend** en localStorage (`useImprovementPlan`) — FASE F (endpoint de persistencia).

## 9. LO QUE SIGUE ROTO (tracked)

1. Tablas `sessions`, `points_history`, `crisis_alerts`, `conversations`, `achievements` ausentes en prod → **FASE C**.
2. Migraciones 033–051 rotas (no-ops/fallos) → **FASE C**.
3. IDOR + RLS + admin auth + `requireStudentAccess` → **FASE D**.
4. `parentAlertsService` sin montar; heartbeat/report endpoints faltantes → **FASE D/F**.
5. `useImprovementPlan` localStorage-only → **FASE F**.
6. Mock global supabase roto + fallos frontend preexistentes (useAdminAuth, smartboardSync) → **FASE G**.
7. CI/CD rojo → **FASE G**.
8. Rotación de service-role key (riesgo aceptado) → pendiente del equipo.

## 10. ESTADO FINAL

# PARTIAL

**Código-side FASE B = VERIFIED** (todas las sub-fases de schema/código/test ejecutables). La fase queda **PARTIAL** porque B.11 (persistencia logout/login), B.12 (dos estudiantes), y el flujo vivo de B.10/B.13/B.14 requieren un **entorno staging** (con las tablas de FASE C creadas y un backend vivo) que aún no existe.

**Para FASE C:** migrations reconciliadas + fresh-DB reproducible + tablas faltantes creadas en staging/prod → luego E2E de B.11/B.12.
