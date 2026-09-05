# Implementation Plan: Fase 2 — Estabilización y Escalabilidad

## Overview

Fase 2 transforms EdutechLife from a security-hardened prototype to a production-grade platform capable of handling real user growth. The phase focuses on four pillars: (1) OAuth scalability beyond 1,000 users, (2) backend resilience via always-on infrastructure and Redis state, (3) SQL schema consolidation to unblock Fase 3/4, and (4) CI/CD hardening to prevent regressions.

**Duration:** 1–3 months  
**Teams:** Backend (Render), Frontend (Vercel), Database (Supabase), DevOps (CI/CD)  
**Gate:** All P0/P1 initiatives closed before Fase 3 begins; Fase 4 blocked on #12 (SQL consolidation)

---

## Architecture Decisions

- **Backend Resilience:** Migrate from Vercel serverless (HTTP-only) to Render Starter (always-on Node.js). Eliminates cold starts; unblocks WebSocket/long-polling, persistent connections, background jobs.
  
- **State Persistence:** Adopt Upstash Redis (serverless PostgreSQL-compatible API) for session state, rate-limit counters, and transient data. Supabase PostgreSQL reserved for durable entity storage only.

- **Schema Authority:** Consolidate 3 separate schema sources (supabase/migrations/, edutechlife-frontend/*.sql, hand-deployed production) into single `supabase/migrations/` directory with enforced testing on staging before production.

- **Dependency Isolation:** Keep #9 (listUsers fix) independent so it can ship immediately; #10–#11 can parallelize; #12 is a gate for #13–#16.

---

## Phase 2.1: Foundation (Initiatives #9–#11)

These initiatives establish a resilient baseline. Each is a complete vertical slice: implementation + testing + deployment verification.

### Task 1: Fix OAuth Scalability (Initiative #9)

**Description:**  
Replace `listUsers({perPage:1000})` calls in auth.js with `findAuthUserByEmail(email)` helper using server-side filtering. Current implementation fails silently when user count exceeds 1,000; this task ensures OAuth login works at any scale.

**Acceptance criteria:**
- [ ] Helper function `findAuthUserByEmail()` exists and uses `filter` parameter
- [ ] 3 occurrences of `listUsers({perPage:1000})` replaced with helper call
- [ ] OAuth callback test passes with 100+ mock users in Supabase
- [ ] Endpoint returns user lookup in <200ms average
- [ ] Fallback gracefully if listUsers fails (logs error, returns 503)

**Verification:**
- [ ] Unit tests: `npm test -- auth.test.js` — helper tests with various email formats
- [ ] Integration test: OAuth flow with 5,000+ mock users in staging
- [ ] Manual: Login with test accounts, verify no "Could not retrieve user" errors
- [ ] Load test: listUsers lookup time remains <200ms at 10k+ user scale

**Dependencies:** None

**Files likely touched:**
- `edutechlife-backend/src/routes/auth.js` (+15 lines, –10 lines)
- `edutechlife-backend/src/__tests__/routes/auth.test.js` (+30 lines)

**Estimated scope:** Small (1–2 files, focused function replacement)

**Risk:** Already implemented in prior session; verify it's in current branch and tests pass.

---

### Task 2: Deploy Backend to Always-On Infrastructure (Initiative #10)

**Description:**  
Provision Render Starter plan, configure health checks, set up environment secrets, and deploy backend there. Eliminates cold-start latency (currently ~5s on Vercel serverless), enables persistent connections, and prepares for background jobs.

**Acceptance criteria:**
- [ ] Render Starter instance created and linked to GitHub repository
- [ ] Continuous deployment configured (auto-deploy on push to main)
- [ ] Health check endpoint (`GET /health`) returns `200 OK` within 2s
- [ ] All env vars replicated from Vercel secrets to Render dashboard
- [ ] Backend responds to requests in <500ms (vs. 5s+ cold start on Vercel)
- [ ] Logs accessible via Render dashboard; errors captured in Sentry

**Verification:**
- [ ] Ping `https://<render-url>/health` — expect 200 OK
- [ ] Smoke test: call `/api/auth/session` from frontend, expect <500ms response
- [ ] Check Render deployment log: no crashes on startup
- [ ] Frontend `.env` updated to point VITE_API_URL to Render backend
- [ ] Staging deployment succeeds, integration tests pass

**Dependencies:** Task 1 (OAuth must be fixed before going always-on)

**Files likely touched:**
- `.env.example` (+2 lines: RENDER_URL)
- `edutechlife-frontend/.env` (update VITE_API_URL)
- `.github/workflows/` (if auto-deploy config needed)
- `edutechlife-backend/src/app.js` (+health route if missing)

**Estimated scope:** Small (mostly config; <1 file code change)

**Risk:** Render secrets must match Vercel; coordinate with team to avoid env-var mismatch.

---

### Task 3: Implement Redis State Layer (Initiative #11)

**Description:**  
Add Upstash Redis client, create session middleware to store/retrieve user state, and replace in-memory caches with Redis. Enables horizontal scaling and persistent state across server restarts.

**Acceptance criteria:**
- [ ] Upstash Redis connection initialized in `edutechlife-backend/src/lib/redis.js`
- [ ] Session middleware reads/writes `user:<userId>` keys with 24h TTL
- [ ] Rate-limit counters migrated to Redis (vision limiter, auth limiter)
- [ ] Cache key namespace documented: `user:*`, `ratelimit:*`, `session:*`
- [ ] Redis connection fails gracefully (falls back to in-memory or returns error)
- [ ] Performance: read/write operations <50ms average latency

**Verification:**
- [ ] Unit tests: `npm test -- redis.test.js` — connection, get, set, ttl
- [ ] Integration test: Rate limiter uses Redis counters, resets correctly
- [ ] Manual: Restart backend, verify session persists (Redis key still exists)
- [ ] Load test: Redis latency <50ms at 1000 concurrent connections

**Dependencies:** Task 2 (Render backend must be always-on to benefit from state persistence)

**Files likely touched:**
- `edutechlife-backend/src/lib/redis.js` (new, ~50 lines)
- `edutechlife-backend/src/middleware/rateLimiter.js` (+15 lines to integrate Redis)
- `edutechlife-backend/src/middleware/session.js` (new or updated, ~40 lines)
- `edutechlife-backend/src/__tests__/lib/redis.test.js` (new, ~60 lines)

**Estimated scope:** Medium (3–4 files, new middleware layer)

**Risk:** Upstash API credentials must be kept secret; use Render dashboard to inject UPSTASH_REDIS_URL.

---

## Checkpoint: After Phase 2.1 (Tasks 1–3)

- [ ] OAuth tests pass (`npm test -- auth.test.js`)
- [ ] Backend health check succeeds on Render (`curl https://<render>/health`)
- [ ] Redis connection test passes (`npm test -- redis.test.js`)
- [ ] Frontend integration test: login flow works end-to-end
- [ ] No new errors in Sentry; error rate <0.1%
- [ ] **Human review required:** Proceed to #12 (SQL consolidation) only after verification

---

## Phase 2.2: Schema Consolidation (Initiative #12)

This is a **critical blocker** for Phases 3 and 4. All subsequent work depends on a single, authoritative schema source.

### Task 4: Audit and Consolidate SQL Schema (Initiative #12)

**Description:**  
Identify all SQL sources of truth (supabase/migrations/, frontend *.sql files, hand-deployed production), merge into `supabase/migrations/` with version numbering, and test against staging database. Eliminates schema drift.

**Acceptance criteria:**
- [ ] All standalone .sql files (edutechlife-frontend/*.sql) migrated to numbered migrations (065–070)
- [ ] Migration numbering is sequential and documented in `MIGRATIONS.md`
- [ ] Each migration has a rollback (DOWN clause)
- [ ] All migrations apply successfully on local Supabase instance
- [ ] Migrations apply to staging database without errors
- [ ] Schema audit report generated (tables, columns, RLS policies, functions)
- [ ] No conflicts between migrations and production schema (diff is empty or documented)

**Verification:**
- [ ] Local: `supabase db reset && npm run test:smoke` — all tests pass
- [ ] Staging: `supabase db push --remote staging` — succeeds, health check passes
- [ ] Manual: Connect to staging DB, verify all tables/columns/functions exist
- [ ] Diff report: `supabase db diff` shows no unaccounted changes
- [ ] **Critical gate:** Production DBA approves schema before ANY production deploy

**Dependencies:** Tasks 1–3 (foundation stable; schema is tested against working backend)

**Files likely touched:**
- `supabase/migrations/065_*.sql` through `supabase/migrations/070_*.sql` (new, ~200 lines total)
- `MIGRATIONS.md` (new, ~50 lines, documents schema changelog)
- `supabase/config.toml` (if migration order changed)
- Schema audit report saved to `docs/schema-audit-2026-09.md` (generated)

**Estimated scope:** Large (8+ files if including docs; schema work is complex)

**Risk:** **CRITICAL.** Production schema mismatch could cause data loss. Require staging validation + DBA sign-off before merging.

---

## Checkpoint: After Phase 2.2 (Task 4)

- [ ] All migrations pass locally and on staging
- [ ] Schema audit report generated and reviewed
- [ ] **GATE UNLOCKED:** Fase 3 and Fase 4 can now proceed
- [ ] **Human review & DBA approval required before production deploy**

---

## Phase 2.3: Refactoring & Features (Initiatives #13–#14)

With schema consolidated, we can refactor safely and add new features.

### Task 5: Refactor Monolithic Routes (Initiative #13)

**Description:**  
Break up large route files (`auth.js`, `smartboard.js`, `tts.js`) into smaller, focused modules by domain (users, grades, lessons, exams). Each route is testable independently.

**Acceptance criteria:**
- [ ] `edutechlife-backend/src/routes/auth.js` split into `routes/auth/register.js`, `routes/auth/login.js`, `routes/auth/logout.js`
- [ ] `edutechlife-backend/src/routes/smartboard.js` split into `routes/smartboard/grades.js`, `routes/smartboard/curriculum.js`, `routes/smartboard/analytics.js`
- [ ] All route modules re-exported from `routes/index.js`
- [ ] No regression: existing endpoints still work, tests pass
- [ ] Code duplication reduced by >10% (lint report before/after)
- [ ] Each route file <300 lines (enforced in lint config)

**Verification:**
- [ ] ESLint: file size limits pass; no circular imports
- [ ] Tests: `npm test -- routes/` — all tests pass
- [ ] Smoke test: login, smartboard, TTS endpoints respond correctly
- [ ] Manual: Check that no endpoint behavior changed

**Dependencies:** Task 4 (schema stable; safe to refactor without hitting schema bugs)

**Files likely touched:**
- `edutechlife-backend/src/routes/` (split 3–4 large files into 10–12 smaller files, ~–20 lines via deduplication)
- `edutechlife-backend/src/routes/index.js` (updated re-exports, ~+20 lines)
- `.eslintrc.json` (add max-lines rule, +2 lines)

**Estimated scope:** Large (8+ files, refactoring work)

**Risk:** Refactoring can introduce regressions. Comprehensive test coverage required.

---

### Task 6: Implement Admin Dashboard Backend (Initiative #14)

**Description:**  
Add admin-only API endpoints for user analytics, student performance, and system health. Backend only; frontend dashboard is Fase 3 scope.

**Acceptance criteria:**
- [ ] `POST /api/admin/login` endpoint accepts admin credentials, returns JWT with `role: admin`
- [ ] `GET /api/admin/users` returns paginated list of users (admin only, RLS enforced)
- [ ] `GET /api/admin/analytics/students` returns aggregated student performance metrics
- [ ] `GET /api/admin/health` returns backend health status (uptime, error rate, DB latency)
- [ ] Admin JWT verified in middleware; non-admin requests return 403 Forbidden
- [ ] All admin endpoints logged to audit table `admin_activity_log`
- [ ] Rate limit: 1000 req/hr per admin (higher than user limit)

**Verification:**
- [ ] Unit tests: `npm test -- admin.test.js` — auth, authorization, data validation
- [ ] Integration test: Login as admin, fetch users, verify RLS applied
- [ ] Manual: Test with non-admin token, expect 403 Forbidden
- [ ] Security review: Admin endpoints do not expose sensitive data (PII, raw logs)

**Dependencies:** Task 4 (schema stable; RLS policies in place for admin table)

**Files likely touched:**
- `edutechlife-backend/src/routes/admin.js` (new, ~150 lines)
- `edutechlife-backend/src/middleware/adminAuth.js` (new, ~40 lines)
- `supabase/migrations/071_admin_rbac.sql` (new, ~60 lines, RLS policies)
- `edutechlife-backend/src/__tests__/routes/admin.test.js` (new, ~100 lines)

**Estimated scope:** Medium (4 files, feature-complete but backend-only)

**Risk:** Admin endpoints are high-value targets for attackers. Require security review before shipping.

---

## Phase 2.4: Polish & Hardening (Initiatives #15–#16)

Final phase: clean up technical debt and harden CI/CD.

### Task 7: Repository Hygiene (Initiative #15)

**Description:**  
Remove dead code, consolidate configuration, organize docs into standardized structure, and clean up `.gitignore`.

**Acceptance criteria:**
- [ ] Remove unused files/folders: `edutechlife-backend/scripts/legacy-*`, `edutechlife-frontend/old-components/`
- [ ] `.gitignore` updated: add `.env.local`, `*.log`, `dist/`, `build/`, remove obsolete patterns
- [ ] Docs reorganized: `docs/auth/`, `docs/api/`, `docs/deployment/`, `docs/troubleshooting/`
- [ ] README.md updated with architecture overview and links to docs
- [ ] Configuration files consolidated (if multiple tsconfigs/eslintrc, pick one)
- [ ] Git history cleaned: no credentials or large binaries in history (verify with `git rev-list`)

**Verification:**
- [ ] `git status` shows no unexpected files after clean build
- [ ] Docs build without errors (if using MkDocs or similar)
- [ ] ESLint passes; no unused imports (use `eslint-plugin-unused-imports`)
- [ ] Manual review: team approves file removals

**Dependencies:** None (can parallelize with Task 5–6)

**Files likely touched:**
- `edutechlife-backend/scripts/` (cleanup, –50 lines or more)
- `edutechlife-frontend/src/components/` (remove `old-components/` folder)
- `.gitignore` (+5–10 lines)
- `README.md` (+30 lines)
- `docs/` (reorganization, new structure)

**Estimated scope:** Medium (5+ files, mostly deletions and docs)

**Risk:** Ensure no active code is accidentally deleted; code review required.

---

### Task 8: Harden CI/CD Pipeline (Initiative #16)

**Description:**  
Add test gates, lint gates, and deploy approval steps to GitHub Actions. Prevent broken code from reaching production.

**Acceptance criteria:**
- [ ] `.github/workflows/test.yml` runs on all PRs: unit tests, lint, type-check
- [ ] `.github/workflows/deploy.yml` runs on merge to main: smoke tests, staging deploy, production gate
- [ ] Staging deployment required before production approval (no direct main → production)
- [ ] Pull request blocks merge if: (a) tests fail, (b) coverage <80%, (c) ESLint errors, (d) TypeScript errors
- [ ] Production deployment requires manual approval (GitHub environment protection rules)
- [ ] Deployment logs captured in S3 or similar (for audit trail)
- [ ] Rollback workflow added (manual, `github-workflow-rollback.yml`)

**Verification:**
- [ ] Create a test PR with failing test — merge button is disabled
- [ ] Create a test PR with ESLint error — lint check fails visibly
- [ ] Merge a PR — staging deployment succeeds, manual approval required for production
- [ ] Manual: Trigger rollback workflow, verify previous deployment restored

**Dependencies:** None (can parallelize with Task 7; based on existing CI structure)

**Files likely touched:**
- `.github/workflows/test.yml` (new or updated, ~60 lines)
- `.github/workflows/deploy.yml` (updated, +30 lines for staging gate)
- `.github/workflows/rollback.yml` (new, ~40 lines)
- `.github/CODEOWNERS` (new, defines who approves production deploys)

**Estimated scope:** Medium (3 files, workflow YAML)

**Risk:** Overly strict gates can slow development; balance safety with velocity. Start with test gates, add approval gates after team agrees.

---

## Checkpoint: After Phase 2.4 (Tasks 7–8)

- [ ] ESLint/TypeScript pass on entire codebase
- [ ] Test suite passes; coverage >80%
- [ ] Docs reorganized and readable
- [ ] CI/CD pipeline enforces quality gates
- [ ] Repository is clean; no dead code
- [ ] **Human review required:** Fase 2 complete; ready for Fase 3 planning

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Render cold boot >2s** | High | Use persistent connection + health checks; monitor Render metrics weekly |
| **Redis connection failures** | Medium | Implement circuit breaker; fallback to in-memory cache (degraded mode) |
| **Schema migration locks production DB** | Critical | Test all migrations on staging first; schedule maintenance window; DBA sign-off required |
| **Admin endpoints leak sensitive data** | Critical | Security review before shipping; audit RLS policies; log all admin access |
| **CI/CD gates block releases** | Medium | Start permissive, tighten over time; team agreement on coverage thresholds |
| **Refactoring introduces regressions** | Medium | Comprehensive test coverage (>80%); smoke tests on all routes; code review |
| **Upstash API costs spike** | Low | Monitor Redis usage; set max connections; implement rate limiting |

---

## Open Questions

1. **Admin credentials:** Where should admin users be created/stored? In Supabase auth or separate admin table?
2. **Staging database:** Should staging be a full copy of production schema, or a minimal test schema?
3. **Deployment approval:** Who approves production deploys? Should there be a rotation (weekly on-call)?
4. **Monitoring:** Which metrics are critical? (e.g., error rate, latency, DB query time)
5. **Backwards compatibility:** During refactoring, can we introduce breaking API changes, or must all endpoints remain backward-compatible?

---

## Success Criteria for Fase 2

- [ ] All 8 initiatives (#9–#16) shipped to production
- [ ] OAuth login works at 10k+ users
- [ ] Backend response time <500ms average (no cold starts)
- [ ] State persists across server restarts (Redis verified)
- [ ] Schema unified in supabase/migrations/; no more hand-deployed SQL
- [ ] CI/CD pipeline enforces test + lint gates
- [ ] Admin dashboard API endpoints live (frontend comes in Fase 3)
- [ ] 0 critical security findings in post-hardening audit
- [ ] Team confidence: "Platform can handle 10x growth without re-architecting"

---

*Plan compiled for EdutechLife Fase 2 (Sep 2026)*  
*Architecture: Render (backend) + Vercel (frontend) + Supabase (data) + Upstash (state)*  
*Gate: Fase 3 blocked until #12 (SQL consolidation) complete*

**Estado:** COMPLETADO  
**Entregables:** `AUDIT.md`

---

## Sprint 1 — Design System + Arquitectura Base

**Objetivo:** Crear la infraestructura visual y técnica que usarán todos los sprints siguientes.  
**Duración estimada:** 1 semana

### Tareas

#### 1.1 — Fix de Seguridad Inmediato (BLOQUEANTE)
Aplicar middleware de consentimiento parental al endpoint `/api/chat` general que usan OralExamSimulator, StudyPodcast e ImprovementPlan.

**Archivos:**
- `edutechlife-backend/src/routes/chat.js` (o donde esté `/api/chat`)
- Agregar `requireVerifiedParentalConsent` middleware

**Criterio de aceptación:** Ninguna llamada a DeepSeek desde SmartBoard puede ocurrir sin consentimiento verificado.

**Verificación:** Test de integración: llamar `/api/chat` sin consent → debe rechazar 403.

---

#### 1.2 — Feature Flags
Crear sistema simple de feature flags para poder habilitar/deshabilitar módulos por usuario o grupo.

**Implementación:** Objeto de configuración en `kidsDashboardConfig.js` + hook `useFeatureFlag(flagName)`.

**Flags iniciales:**
```js
FEATURE_FLAGS = {
  adaptive_engine: false,
  skill_passport: false,
  future_explorer: false,
  parent_intelligence_v2: false,
  early_warning: false,
  gamification_v2: false,
}
```

**Criterio de aceptación:** Un cambio en el flag muestra/oculta el módulo sin romper el resto.

---

#### 1.3 — Design System — Componentes Base
Crear `src/components/kids-dashboard/ui/` con componentes reutilizables:

| Componente | Props clave |
|-----------|------------|
| `Button` | variant (primary/secondary/ghost), size, disabled, loading |
| `Card` | variant (default/glass/colored), padding |
| `ProgressBar` | value, max, color, label, animated |
| `Badge` | color, icon, label, size |
| `MetricCard` | title, value, trend, icon, color |
| `AlertCard` | severity (green/yellow/red), title, message, action |
| `DaniMessage` | text, mood, streaming |
| `RecommendationCard` | title, reason, action, duration |

**Criterio de aceptación:** Storybook o tests visuales. Componentes usados en al menos un lugar real.

**Verificación:** `npm run build` sin errores + review visual en mobile y desktop.

---

#### 1.4 — Tokens Visuales Centralizados
Mover colores, tipografía y espaciados hardcodeados en SmartBoardKidsDashboard y HeroSection a `smartboardTheme.js` (ya existe, extender).

**Criterio de aceptación:** Sin valores de color hardcodeados (`#0096C7`, etc.) fuera de `smartboardTheme.js`.

---

#### 1.5 — Migrations DB — Sprint 1
Crear migration en `supabase/migrations/` para las tablas que todos los sprints necesitan:

```sql
-- feature_flags (por usuario, override del config)
-- dani_memory (persistencia DB de memoria de Dani)
-- early_warnings (Sprint 8, schema vacío ahora)
```

**Criterio de aceptación:** Migration aplica en staging sin errores. Tablas visibles en Supabase.

---

**Checkpoint Sprint 1:**
- [ ] `/api/chat` protegido con consent middleware
- [ ] Feature flags funcionando
- [ ] 8 componentes UI base creados y usados
- [ ] Tokens visuales centralizados
- [ ] Migrations aplicadas

---

## Sprint 2 — Smart Profile

**Objetivo:** Crear un perfil dinámico del estudiante que consolide toda la información dispersa.  
**Duración estimada:** 1 semana

### Tareas

#### 2.1 — Unificar datos del estudiante
Crear hook `useStudentProfile()` que consolide datos de:
- `students` table (grado, calificaciones, avatar)
- `vak_results` (estilo VAK)
- `learning_streaks` (racha)
- `points_history` (XP total, nivel)
- `sessions` (última sesión, frecuencia)
- `activity_log` (comportamiento reciente)

Retornar un objeto `StudentProfile` con:
```js
{
  identity: { name, age, grade, school, city },
  academic: { subjects, grades, strengths, weaknesses },
  preferences: { vak, interactionStyle, formats },
  behavior: { frequency, avgSessionDuration, lastSession, consistency },
  goals: { academic, habits, skills },
  state: { overallProgress, competencyMastery, risks }
}
```

**Archivos a crear:**
- `src/hooks/useStudentProfile.js`
- `src/types/StudentProfile.ts` (si hay TypeScript en el proyecto)

**Criterio de aceptación:** Hook retorna datos completos sin llamadas duplicadas. UserMenu y HeroSection lo consumen.

---

#### 2.2 — Migrar memoria de Dani a DB
Crear tabla `dani_memory` y migrar desde localStorage.

**Schema:**
```sql
dani_memory (
  id, student_id, 
  communication_style, strengths[], weaknesses[], 
  interests[], frequent_errors[], pending_topics[],
  last_mood, last_updated
)
```

**Hook:** `useDaniMemory()` — lee/escribe DB, fallback a localStorage si offline.

**Criterio de aceptación:** Dani recuerda contexto entre sesiones y dispositivos.

---

#### 2.3 — Completar onboarding con SmartProfile
Extender `OnboardingWizard.jsx` para recoger: ciudad, colegio, objetivos del estudiante, intereses iniciales.

**Criterio de aceptación:** Al terminar onboarding, `students` table tiene perfil completo. VAK se puede hacer desde onboarding.

---

**Checkpoint Sprint 2:**
- [ ] `useStudentProfile()` retorna datos unificados
- [ ] Dani memory persiste en DB
- [ ] Onboarding recoge perfil completo

---

## Sprint 3 — Learning Graph

**Objetivo:** Crear el modelo de datos curricular: Subject → Area → Competency → Skill → Activity.  
**Duración estimada:** 1 semana

### Tareas

#### 3.1 — Migrations DB
```sql
competencies (id, subject, area, name, description, grade_range)
student_competency_mastery (
  id, student_id, competency_id,
  mastery_level, trend, evidence_count,
  last_practiced_at, attempt_count, frequent_errors[]
)
```

#### 3.2 — Seed de competencias base
Poblar `competencies` con el currículo MEN Colombia (ya existe en `curriculumHelper` — extraer a DB).

Materias iniciales: Matemáticas, Ciencias, Lenguaje, Sociales, Inglés, Tecnología.

#### 3.3 — Conectar actividades a competencias
Agregar campo `competency_ids[]` a: OralExamSimulator, FlashcardSystem, ExamPrep.

Cuando una actividad termina → `updateCompetencyMastery(competencyId, score)`.

**Criterio de aceptación:** Completar un examen oral actualiza el nivel de dominio de la competencia relacionada en DB.

---

**Checkpoint Sprint 3:**
- [ ] Schema learning graph en producción
- [ ] Competencias base pobladas
- [ ] Al menos 3 actividades conectan a competencias

---

## Sprint 4 — Adaptive Learning Engine

**Objetivo:** Crear el servicio central que genera recomendaciones y planes adaptativos.  
**Duración estimada:** 1.5 semanas

### Tareas

#### 4.1 — Backend: AdaptiveLearningEngine service
Crear `edutechlife-backend/src/services/adaptiveLearning.js`:

```js
// Funciones a implementar:
getStudentState(studentId)          // lee perfil + mastery + behavior
calculateMastery(studentId, subject) // promedio ponderado por competencias
detectStrengths(mastery)            // competencias con mastery > 0.7
detectWeaknesses(mastery)           // competencias con mastery < 0.4
detectRisks(mastery, activity_log)  // caída + inactividad + errores repetitivos
generateRecommendations(state)      // array de NextBestAction con motivo
getNextBestAction(state)            // la #1 recomendación con motivo explicado
generateDailyPlan(state, minutes)   // plan para 5/10/20/30 minutos
generateWeeklyPlan(state)           // plan semanal con materias + actividades
updateLearningPlan(studentId, plan) // guarda en tabla learning_plans
```

Cada recomendación incluye `reason: string` explicando el motivo.

#### 4.2 — API endpoints
```
GET  /api/smartboard/adaptive/state
GET  /api/smartboard/adaptive/next-action
POST /api/smartboard/adaptive/daily-plan    { minutes: 5|10|20|30 }
POST /api/smartboard/adaptive/weekly-plan
```

#### 4.3 — Frontend hook
`useAdaptiveEngine()` — consume los endpoints, cachea en contexto, expone `nextBestAction`, `dailyPlan`, `weeklyPlan`.

**Criterio de aceptación:**
- `getNextBestAction()` retorna una acción con motivo legible basado en datos reales del estudiante.
- `generateDailyPlan(20)` retorna un plan de 20 minutos con actividades y tiempos.

**Verificación:** Test de integración con estudiante de datos ficticios.

---

**Checkpoint Sprint 4:**
- [ ] AdaptiveLearningEngine service completo con tests unitarios
- [ ] 4 endpoints API funcionando
- [ ] `useAdaptiveEngine()` hook retorna datos reales

---

## Sprint 5 — Mi Plan + "¿Qué Hago Hoy?"

**Objetivo:** Hacer de "Mi Plan" el centro de la experiencia con Next Best Action prominente.  
**Duración estimada:** 1 semana

### Tareas

#### 5.1 — CTA "¿Qué Hago Hoy?" en HeroSection
Reemplazar HeroSection actual con CTA prominente que consume `useAdaptiveEngine()`.

Mostrar:
- Objetivo del día
- Actividades (con tiempo estimado + dificultad)
- Motivo de la recomendación de Dani
- Progreso de hoy

Selector de tiempo disponible: 5 / 10 / 20 / 30 minutos → regenera plan.

#### 5.2 — Tab "Mi Plan" extendido
Extender `PersonalizedPlan.jsx` + `ImprovementPlan.jsx` para mostrar plan adaptativo real (de Sprint 4) en lugar de plan estático de DeepSeek.

Vistas: Hoy / Esta semana / Este mes.

Cada ítem del plan: competencia → actividad → tiempo → dificultad → motivo → CTA directa.

#### 5.3 — Semáforo Académico
Agregar componente `AcademicSemaphore` en tab de calificaciones:
- 🟢 Dominado (mastery > 0.7)
- 🟡 Atención (mastery 0.4–0.7)
- 🔴 Prioridad (mastery < 0.4)

Basado en datos de `student_competency_mastery`, no solo en notas.

**Criterio de aceptación:** El estudiante ve en la pantalla de inicio exactamente qué hacer hoy y por qué.

**Verificación:** Screenshot de HeroSection con datos reales, verificar en mobile.

---

**Checkpoint Sprint 5:**
- [ ] CTA "¿Qué Hago Hoy?" visible y funcional
- [ ] Mi Plan muestra plan adaptativo, no estático
- [ ] Semáforo académico visible en calificaciones

---

## Sprint 6 — Dani 2.0

**Objetivo:** Dani recibe contexto estructurado completo y tiene memoria persistente. AISafetyGateway independiente.  
**Duración estimada:** 1.5 semanas

### Tareas

#### 6.1 — AISafetyGateway
Crear `edutechlife-backend/src/services/aiSafetyGateway.js`:

Pipeline:
```
Input → validation → moderation → age/context policy
      → prompt construction → AI model
      → response validation → output moderation → user
```

Independiente del proveedor (no DeepSeek-specific).

#### 6.2 — Dani Orchestrator mejorado
Mover la construcción de contexto de `useDaniSendMessage.js` (frontend) a `DaniOrchestrator` backend service.

El frontend solo envía: `{ message, studentId }`.  
El backend construye: perfil completo + Learning Graph mastery + plan actual + historial relevante.

#### 6.3 — Migrar memoria de Dani a DB (si no se hizo en Sprint 2)
Ver tarea 2.2.

#### 6.4 — Comportamiento pedagógico explícito
Agregar al system prompt de Dani instrucciones claras sobre el ciclo:
1. Pregunta → 2. Pista → 3. Explicación → 4. Ejemplo → 5. Verificación → 6. Retroalimentación

Agregar detección de: confusión, frustración, dominio, dependencia excesiva.

**Criterio de aceptación:**
- Dani nunca resuelve ejercicios directamente en modo Socrático.
- AISafetyGateway bloquea contenido inapropiado.
- Contexto completo del estudiante llega al prompt sin construcción en frontend.

---

**Checkpoint Sprint 6:**
- [ ] AISafetyGateway funcional con pipeline completo
- [ ] Construcción de contexto movida a backend
- [ ] Dani memory persiste en DB

---

## Sprint 7 — Parent Intelligence

**Objetivo:** Experiencia de padres: QUÉ pasa + POR QUÉ + QUÉ puede hacer el padre.  
**Duración estimada:** 1 semana

### Tareas

#### 7.1 — Migrar parent dashboard de blob a tablas normalizadas
Reemplazar lectura de `smartboard_kids_data` JSON blob por datos de tablas normalizadas.

Mantener blob en sync durante transición.

#### 7.2 — Parent Insights engine
Backend: `generateParentInsights(studentId)` — produce 3-5 insights accionables:
- Progreso reciente
- Área de foco recomendada
- Hábito destacado
- Riesgo detectado (si aplica)
- Acción sugerida para el padre

Ejemplo: *"Esta semana Juan practicó 4 días. Su dominio en ecuaciones aumentó 15%. Actualmente necesita reforzar resolución de problemas. Recomendamos una conversación breve sobre cómo se siente con Matemáticas."*

#### 7.3 — Weekly Report automático
Extender el endpoint `/api/smartboard/weekly-report` para incluir datos del Learning Graph.
Generar versión estudiante y versión padre.

#### 7.4 — Calificaciones Inteligentes en parent view
Mostrar: nota + tendencia (↑↓) + competencia relacionada + posible causa + siguiente acción.

**Criterio de aceptación:** Un padre puede entender el estado académico de su hijo en menos de 30 segundos.

---

**Checkpoint Sprint 7:**
- [ ] Parent dashboard sin blob legado
- [ ] 3-5 insights accionables generados
- [ ] Weekly report incluye datos de competencias

---

## Sprint 8 — Early Warning System

**Objetivo:** Detectar riesgos antes de que se conviertan en problemas.  
**Duración estimada:** 1 semana

### Tareas

#### 8.1 — EarlyWarningEngine service
Backend: `edutechlife-backend/src/services/earlyWarning.js`

Detectar (umbrales conservadores, evitar ruido):
- Inactividad: sin sesión en X días según comportamiento base
- Caída de rendimiento: mastery bajó > 20% en una semana
- Errores repetitivos: mismo error en 3+ intentos
- Abandono de actividad: iniciadas > completadas ratio < 0.3
- Baja consistencia: racha rota 3+ veces en 2 semanas

Generar: `{ severity, type, evidence, recommendation, created_at }`

#### 8.2 — Tabla `early_warnings` y endpoint
```sql
early_warnings (id, student_id, severity, type, evidence_json, recommendation, resolved_at)
```
`GET /api/smartboard/adaptive/warnings`

#### 8.3 — UI en parent dashboard + admin
Mostrar alertas con badge de severidad. Solo mostrar si persiste más de 48h (evitar falsos positivos).

**Criterio de aceptación:** Una alerta se genera cuando hay evidencia real, no por cualquier pequeño cambio.

---

**Checkpoint Sprint 8:**
- [ ] EarlyWarningEngine con al menos 5 detectores
- [ ] Alertas visibles en parent dashboard
- [ ] 0 falsos positivos en prueba con datos de estudiante activo

---

## Sprint 9 — Gamification 2.0

**Objetivo:** Gamificación que recompensa competencias demostradas, no solo cantidad.  
**Duración estimada:** 1 semana

### Tareas

#### 9.1 — MissionEngine dinámico
Reemplazar misiones hardcodeadas por catálogo dinámico en DB:

```sql
missions (id, type, title, description, objective_type, target_competency_id, 
          difficulty, duration_minutes, xp_reward, age_min, age_max, grade_range)
student_missions (id, student_id, mission_id, status, started_at, completed_at, progress)
```

Tipos: diaria, semanal, especial, exploración, competencia.

#### 9.2 — BadgeEngine
Tabla `badges` + `student_badges`. Criterios claros de desbloqueo por competencia demostrada.

Badges iniciales:
- Explorador de IA
- Pensador Lógico
- Científico Junior
- Creador Digital
- Comunicador

#### 9.3 — Feedback emocional post-actividad
Agregar al final de OralExamSimulator, FlashcardSystem y ExamPrep:
```
¿Cómo estuvo? 😊 Fácil  😐 Normal  😣 Difícil
```

Combinar con rendimiento para detectar calibración (fácil pero bajo score = revisar).

**Criterio de aceptación:** Completar una actividad ligada a una competencia puede desbloquear un badge. Misiones son generadas según el perfil del estudiante.

---

**Checkpoint Sprint 9:**
- [ ] Misiones dinámicas desde DB, adaptadas al estudiante
- [ ] Al menos 5 badges con criterios de desbloqueo
- [ ] Feedback emocional en 3 actividades

---

## Sprint 10 — Skill Passport

**Objetivo:** Pasaporte de competencias verificables dentro de la plataforma.  
**Duración estimada:** 0.5 semanas

### Tareas

#### 10.1 — UI Skill Passport
Nuevo tab o sección: "Mi Pasaporte SmartBoard".

Mostrar competencias con nivel (Explorador → Experto) y badges desbloqueados:
- Pensamiento Crítico
- Matemáticas
- Ciencia
- Tecnología / IA
- Comunicación
- Creatividad

Visual: tarjeta por competencia con nivel de dominio, última práctica, tendencia.

#### 10.2 — Conectar con Learning Graph
`useSkillPassport()` — lee `student_competency_mastery` y formatea para UI del pasaporte.

**Criterio de aceptación:** El estudiante puede ver todas sus competencias con niveles actualizados en tiempo real.

---

**Checkpoint Sprint 10:**
- [ ] Skill Passport visible y navegable
- [ ] Competencias conectadas a datos reales de mastery

---

## Sprint 11 — Future Explorer

**Objetivo:** Módulo de exploración vocacional para 10–16 años basado en perfil real.  
**Duración estimada:** 1 semana

### Tareas

#### 11.1 — FutureExplorer component
Solo visible para edad ≥ 10. Nuevo tab en categoría "Explorar".

Mostrar áreas de exploración basadas en fortalezas del Skill Passport:
- IA & Tecnología
- Ciencias & Salud
- Diseño & Creatividad
- Negocios & Emprendimiento
- Medio Ambiente & Sostenibilidad
- Comunicación & Cultura
- Ingeniería & Construcción

Lenguaje: *"Podrías explorar..."* / *"Tu perfil muestra afinidad con..."*

#### 11.2 — Cada área → misión de exploración
Al hacer clic en un área → se genera una misión de exploración relacionada.

#### 11.3 — Content metadata
Asegurarse que cada contenido en "Explora" y "Tech & IA" tenga metadata:
`{ age_min, age_max, grade, subject, competency_id, difficulty, duration, type }`

Esto permite recomendación automática.

**Criterio de aceptación:**
- No predice profesiones como destino definitivo.
- Solo aparece para estudiantes ≥ 10 años.
- Las áreas mostradas corresponden a fortalezas reales del perfil.

---

**Checkpoint Sprint 11:**
- [ ] FutureExplorer visible para edad ≥ 10
- [ ] Áreas correlacionan con Skill Passport real
- [ ] Cada área genera misión de exploración

---

## Sprint 12 — Analytics + QA Full

**Objetivo:** Instrumentación completa + QA end-to-end.  
**Duración estimada:** 1.5 semanas

### Tareas

#### 12.1 — PostHog instrumentation
Agregar eventos en todos los módulos (ver lista completa en spec sección 35).

Eventos prioritarios:
```
diagnostic_completed, mission_completed, dani_message_sent,
activity_completed, competency_updated, plan_generated,
parent_report_viewed, alert_generated, badge_unlocked
```

#### 12.2 — Analytics dashboard interno
Panel admin con métricas de: activación, engagement, retención, uso de Dani, uso de padres.

#### 12.3 — QA completo por módulo
Para cada módulo: unit tests + integration tests + responsive check (mobile/tablet/desktop) + accessibility (ARIA, contraste) + regression tests.

#### 12.4 — Split de monolitos pendientes
- `GradeScanner.jsx` → 3 componentes
- `OralExamSimulator.jsx` → split logic/UI
- `FlashcardSystem.jsx` → split deck/session

**Criterio de aceptación:** 0 módulos sin instrumentación PostHog. Build pasa. Sin regresiones visuales.

---

**Checkpoint Sprint 12 = Release Ready:**
- [ ] Todos los eventos de analytics instrumentados
- [ ] QA aprobado en mobile + desktop + tablet
- [ ] Todos los monolitos divididos (< 500 líneas)
- [ ] Documentación completa

---

## Documentación Obligatoria (por sprint)

| Doc | Sprint |
|-----|--------|
| `AUDIT.md` | 0 ✅ |
| `ARCHITECTURE.md` | 1 |
| `PRODUCT_LOGIC.md` | 4 |
| `LEARNING_ENGINE.md` | 4 |
| `DANI.md` | 6 |
| `PARENT_INTELLIGENCE.md` | 7 |
| `GAMIFICATION.md` | 9 |
| `ANALYTICS.md` | 12 |
| `SECURITY.md` | 1 (por el fix crítico) |
| `ROADMAP.md` | 0 → este archivo |

---

*Ver `tasks/todo.md` para el backlog de tareas en formato ejecutable.*
