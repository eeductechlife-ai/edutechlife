# Fase 2 — Estabilización y Escalabilidad — Task Checklist
> Actualizado: 2026-09-03
> Estado: Fase 1 completada (100%). Fase 2 listo para iniciar.
> Gate: Fase 3 bloqueado hasta consolidar SQL (#12)

---

## Legend
- [ ] Pending
- [~] In progress
- [x] Completed
- [!] BLOCKER — do first

---

## Fase 2 Overview

**Dependencies:** Fase 1 ✅ (8/8 initiatives, 0 P0/P1 findings)  
**Duration:** 1–3 months  
**Teams:** Backend (Render), Frontend (Vercel), Database (Supabase), DevOps (CI/CD)  
**Success:** 10k+ users, <500ms response time, schema unified, CI/CD gates in place

---

## Phase 2.1: Foundation (Initiatives #9–#11)

### Task 1: Fix OAuth Scalability (Initiative #9)

Status: [~] In progress (already implemented in prior session — verify branch)

- [x] Helper function `findAuthUserByEmail()` created with server-side filter parameter
- [ ] Verify 3 occurrences of `listUsers({perPage:1000})` are replaced in current branch
- [ ] Unit tests: `npm test -- auth.test.js` passes
- [ ] Integration test: OAuth flow with 100+ mock users in staging
- [ ] Manual verification: login with test accounts, no "Could not retrieve user" errors
- [ ] Load test: lookup <200ms at 10k+ user scale

### Task 2: Deploy Backend to Always-On Infrastructure (Initiative #10)

Status: [ ] Pending

- [ ] Create Render Starter instance
- [ ] Link GitHub repository for continuous deployment
- [ ] Configure health check endpoint (`GET /health`) to return 200 OK within 2s
- [ ] Replicate all env vars from Vercel to Render dashboard
- [ ] Verify backend response time <500ms (no cold starts)
- [ ] Check Render deployment logs: no crashes on startup
- [ ] Update frontend `.env` to point `VITE_API_URL` to Render backend
- [ ] Smoke test: `/api/auth/session` responds <500ms from frontend
- [ ] Errors captured in Sentry

### Task 3: Implement Redis State Layer (Initiative #11)

Status: [ ] Pending

- [ ] Create `edutechlife-backend/src/lib/redis.js` — Upstash Redis client initialization
- [ ] Create session middleware to read/write `user:<userId>` keys with 24h TTL
- [ ] Migrate rate-limit counters (vision, auth) to Redis
- [ ] Document cache key namespace: `user:*`, `ratelimit:*`, `session:*`
- [ ] Implement graceful fallback (circuit breaker pattern)
- [ ] Unit tests: `npm test -- redis.test.js` (connection, get, set, ttl)
- [ ] Integration test: rate limiter uses Redis, resets correctly
- [ ] Manual: restart backend, verify session persists
- [ ] Load test: Redis latency <50ms at 1000 concurrent connections

### Checkpoint: After Phase 2.1 (Tasks 1–3)

- [ ] OAuth tests pass (`npm test -- auth.test.js`)
- [ ] Backend health check succeeds on Render
- [ ] Redis connection test passes
- [ ] Frontend integration test: login flow works end-to-end
- [ ] No new errors in Sentry; error rate <0.1%
- [ ] **GATE:** Human review required before proceeding to #12

---

## Phase 2.2: Schema Consolidation (Initiative #12)

### Task 4: Audit and Consolidate SQL Schema (Initiative #12)

Status: [ ] Pending — **CRITICAL BLOCKER**

- [ ] Audit: locate all SQL sources (supabase/migrations/, frontend *.sql, hand-deployed production)
- [ ] Migrate standalone .sql files → numbered migrations (065–070)
- [ ] Create `MIGRATIONS.md` documenting schema changelog
- [ ] Each migration includes UP + DOWN clause
- [ ] All migrations apply successfully on local Supabase instance
- [ ] Migrations apply to staging database without errors
- [ ] Manual: connect to staging DB, verify all tables/columns/functions exist
- [ ] Generate schema audit report (tables, columns, RLS policies, functions)
- [ ] Diff report: `supabase db diff` shows no unaccounted changes
- [ ] **CRITICAL GATE:** Production DBA approves schema before ANY production deploy

### Checkpoint: After Phase 2.2 (Task 4)

- [ ] All migrations pass locally and on staging
- [ ] Schema audit report generated and reviewed
- [ ] **GATE UNLOCKED:** Fase 3 and Fase 4 can now proceed
- [ ] **CRITICAL:** Human review & DBA approval required before production deploy

---

## Phase 2.3: Refactoring & Features (Initiatives #13–#14)

### Task 5: Refactor Monolithic Routes (Initiative #13)

Status: [ ] Pending

- [ ] Split `edutechlife-backend/src/routes/auth.js` → `routes/auth/register.js`, `routes/auth/login.js`, `routes/auth/logout.js`
- [ ] Split `edutechlife-backend/src/routes/smartboard.js` → `routes/smartboard/grades.js`, `routes/smartboard/curriculum.js`, `routes/smartboard/analytics.js`
- [ ] Update `routes/index.js` with new re-exports
- [ ] Verify no regression: all endpoints still work, tests pass
- [ ] Code duplication reduced by >10% (lint report before/after)
- [ ] Enforce max file size: each route file <300 lines (ESLint rule)
- [ ] ESLint: file size limits pass, no circular imports
- [ ] Tests: `npm test -- routes/` passes
- [ ] Smoke test: login, smartboard, TTS endpoints respond correctly

### Task 6: Implement Admin Dashboard Backend (Initiative #14)

Status: [ ] Pending

- [ ] Create `edutechlife-backend/src/routes/admin.js` (~150 lines)
- [ ] Create `edutechlife-backend/src/middleware/adminAuth.js` (~40 lines)
- [ ] Implement `POST /api/admin/login` — accepts admin credentials, returns JWT with `role: admin`
- [ ] Implement `GET /api/admin/users` — paginated list, admin only, RLS enforced
- [ ] Implement `GET /api/admin/analytics/students` — aggregated performance metrics
- [ ] Implement `GET /api/admin/health` — uptime, error rate, DB latency
- [ ] Add admin JWT verification middleware (403 Forbidden for non-admin)
- [ ] Log all admin actions to `admin_activity_log` table
- [ ] Rate limit: 1000 req/hr per admin
- [ ] Create migration `071_admin_rbac.sql` (~60 lines, RLS policies)
- [ ] Unit tests: `npm test -- admin.test.js` (auth, authorization, validation)
- [ ] Integration test: login as admin, fetch users, verify RLS
- [ ] Security review: admin endpoints do not expose sensitive data (PII, raw logs)

### Checkpoint: After Phase 2.3 (Tasks 5–6)

- [ ] ESLint passes on refactored routes
- [ ] All tests pass; no regressions
- [ ] Admin endpoints live and tested
- [ ] Security review complete

---

## Phase 2.4: Polish & Hardening (Initiatives #15–#16)

### Task 7: Repository Hygiene (Initiative #15)

Status: [ ] Pending

- [ ] Remove dead code: `edutechlife-backend/scripts/legacy-*`, `edutechlife-frontend/old-components/`
- [ ] Update `.gitignore`: add `.env.local`, `*.log`, `dist/`, `build/`, remove obsolete patterns
- [ ] Reorganize docs: `docs/auth/`, `docs/api/`, `docs/deployment/`, `docs/troubleshooting/`
- [ ] Update `README.md` with architecture overview and links to docs
- [ ] Consolidate config files (if multiple tsconfigs/eslintrc, pick one)
- [ ] Verify git history clean: no credentials or large binaries (git rev-list audit)
- [ ] `git status` shows no unexpected files after clean build
- [ ] ESLint passes; no unused imports
- [ ] Manual code review: team approves file removals

### Task 8: Harden CI/CD Pipeline (Initiative #16)

Status: [ ] Pending

- [ ] Create/update `.github/workflows/test.yml` — unit tests, lint, type-check on all PRs
- [ ] Create/update `.github/workflows/deploy.yml` — smoke tests, staging deploy, production gate
- [ ] Require staging deployment before production approval (no direct main → production)
- [ ] Block merge if: (a) tests fail, (b) coverage <80%, (c) ESLint errors, (d) TypeScript errors
- [ ] Require manual approval for production deployment (GitHub environment protection)
- [ ] Create `.github/workflows/rollback.yml` — manual rollback capability
- [ ] Create `.github/CODEOWNERS` — define production deploy approvers
- [ ] Capture deployment logs in S3 or similar (audit trail)
- [ ] Verify: test PR with failing test — merge button disabled
- [ ] Verify: test PR with ESLint error — lint check fails
- [ ] Verify: merge PR — staging succeeds, production needs manual approval
- [ ] Verify: rollback workflow restores previous deployment

### Checkpoint: After Phase 2.4 (Tasks 7–8)

- [ ] ESLint/TypeScript pass on entire codebase
- [ ] Test suite passes; coverage >80%
- [ ] Docs reorganized and readable
- [ ] CI/CD pipeline enforces quality gates
- [ ] Repository clean; no dead code
- [ ] **GATE:** Human review required — Fase 2 complete

---

## Phase 2 Final Validation

### Pre-Production Checklist

- [ ] All 8 initiatives (#9–#16) complete and tested
- [ ] OAuth tests pass (`npm test -- auth.test.js`)
- [ ] Backend responds <500ms average (no cold starts)
- [ ] Redis state persists across restarts
- [ ] Schema unified in `supabase/migrations/` (no more hand-deployed SQL)
- [ ] CI/CD pipeline enforces test + lint gates
- [ ] Admin API endpoints live (frontend in Fase 3)
- [ ] 0 critical security findings in final audit
- [ ] Smoke tests pass on staging and production-like environment
- [ ] Documentation complete: ARCHITECTURE.md, DEPLOYMENT.md, API.md

### Success Metrics

- [ ] OAuth login works at 10k+ users
- [ ] Backend response time <500ms average
- [ ] Redis latency <50ms, connection uptime >99.5%
- [ ] Schema audit green light from DBA
- [ ] All tests pass; coverage ≥80%
- [ ] Deployment can complete in <5 minutes
- [ ] Rollback available and tested
- [ ] Zero P0/P1 security findings
- [ ] Team confidence: "Platform ready to handle 10x growth"

---

## Dependencies & Gates

**Blocker:** Fase 3 & 4 cannot start until Task 4 (#12) is complete  
**Before Production:** Task 4 must have DBA approval  
**Approval Gate:** Task 8 must be done before first production deploy  

---

*Fase 2 Checklist — 8 initiatives, ~40 subtasks*  
*Architecture: Render (always-on) + Vercel (frontend) + Supabase (unified schema) + Upstash (Redis)*  
*Start: 2026-09-03 | Target: 2026-11-03 (1 month optimistic, 3 months realistic)*

### 🔴 CRÍTICO — Fix de seguridad ✅

- [x] Identificar handler de `POST /api/chat` → `edutechlife-backend/src/routes/chat.js`
- [x] Crear `POST /api/smartboard/ai` con `requireAuth + requireVerifiedParentalConsent` en `smartboard.js`
- [x] Crear `callDeepseekSmartboard()` en `utils/api.js` — siempre incluye JWT, llama endpoint protegido
- [x] Migrar 7 componentes SmartBoard: OralExamSimulator, StudyPodcast, useImprovementPlan, GradeScanner, ExamPrep, useBookReader, ScheduleScanner
- [x] Documentar en `SECURITY.md`
- [ ] Escribir test: llamada sin consent → 403 (pendiente — Sprint 12)

### Feature Flags ✅

- [x] Agregar `FEATURE_FLAGS` a `kidsDashboardConfig.js`
- [x] Crear `src/hooks/useFeatureFlag.js`
- [ ] Envolver módulos 3.0 con el hook (se hace en cada sprint al implementar el módulo)

### Design System ✅

- [x] Crear `src/components/kids-dashboard/ui/`
- [x] `Button.jsx` (variants: primary, secondary, ghost, danger; sizes: sm, md, lg; loading)
- [x] `Card.jsx` (variants: default, glass, colored)
- [x] `ProgressBar.jsx` (value, max, color, label, animated, ARIA)
- [x] `Badge.jsx` (7 colores, icon, 3 sizes)
- [x] `MetricCard.jsx` (title, value, unit, trend, icon, color, dark)
- [x] `AlertCard.jsx` (severity: green/yellow/red, title, message, action)
- [x] `DaniMessage.jsx` (text, mood, streaming, cursor animado)
- [x] `RecommendationCard.jsx` (title, reason, action, duration, difficulty, subject)
- [x] `ui/index.js` exporta todo
- [ ] Integrar en al menos 3 componentes existentes (Sprint 2)

### Tokens Visuales ✅

- [x] Agregar aliases semánticos `SB.categories` y `SB.ui` a `smartboardTheme.js`
- [x] Build pasa sin errores

### Migrations DB ✅

- [x] `052_smartboard3_base_tables.sql`: dani_memory, early_warnings, learning_plans, feature_flags
- [ ] Aplicar en staging y verificar (requiere acceso Supabase CLI)

---

## Sprint 2 — Smart Profile ✅ COMPLETADO

- [x] Crear `src/hooks/useStudentProfile.js` — consolida: students + vak_results + learning_streaks + points_history + sessions + activity_log
- [x] Definir tipo `StudentProfile` (JSDoc en useStudentProfile.js)
- [ ] Integrar `useStudentProfile()` en `UserMenu.jsx`
- [ ] Integrar `useStudentProfile()` en `HeroSection.jsx`
- [x] Migrar memoria de Dani de localStorage a tabla `dani_memory`
- [x] Crear `src/hooks/useDaniMemory.js` (lee/escribe DB, fallback localStorage offline)
- [x] Conectar `useDaniMemory` en `SmartBoardKidsContext.jsx`
- [x] Extender `OnboardingWizard.jsx` para recoger: ciudad, colegio, intereses (ciudad→localStorage, intereses→daniMemory)
- [x] Extender `updateDaniMemory` action para aceptar `interests` array
- [ ] Test: onboarding completo → `students` table tiene perfil completo
- [ ] Test: Dani recuerda contexto en segunda sesión desde otro dispositivo

---

## Sprint 3 — Learning Graph ✅ COMPLETADO

- [x] Crear migration: tabla `competencies` (`supabase/migrations/053_learning_graph.sql`)
- [x] Crear migration: tabla `student_competency_mastery` (idem)
- [x] Seed: 101 competencias MEN Colombia — Matemáticas, Ciencias, Lenguaje, Sociales, Inglés, Tecnología, Economía
- [x] Competencias mapeadas desde `curriculumHelper` / `co_men.json` — IDs tipo `co_matematicas_6-7_0`
- [x] Crear `edutechlife-backend/src/services/competencyMastery.js` — `updateCompetencyMastery`, `batchUpdateMastery`, `getStudentMastery`, `getCompetencyIdsForSubject`
- [x] Endpoints backend: `GET /api/smartboard/adaptive/mastery`, `POST /api/smartboard/adaptive/mastery`, `GET /api/smartboard/competencies`
- [x] Crear `src/hooks/useCompetencyTracking.js` — `trackActivity({ subject, score })` no-blocking
- [x] Integrar `trackActivity` en `OralExamSimulator.jsx` al completar examen oral
- [x] Integrar `trackActivity` en `ExamPrep.jsx` (DeckQuiz) al completar quiz de mazo
- [x] Integrar `trackActivity` en `FlashcardSystem.jsx` (useEffect on done)
- [ ] Test: completar examen oral → mastery actualizado en DB (Sprint 12)
- [ ] Verificar: ningún hardcodeo de competencias en componentes UI

---

## Sprint 4 — Adaptive Engine ✅ COMPLETADO

- [x] Crear `edutechlife-backend/src/services/adaptiveLearning.js`
- [x] Implementar `getStudentState(studentId)` — agrega mastery, grades, sessions, streak
- [x] Implementar `detectStrengths(mastery, gradeMap)` — mastery ≥0.7 o nota ≥4.0
- [x] Implementar `detectWeaknesses(mastery, gradeMap)` — mastery <0.4 o nota <3.5
- [x] Implementar `detectRisks({ activeDays, streak, weaknesses })`
- [x] Implementar `generateRecommendations(state)` — hasta 4, con campo `reason` en español
- [x] Implementar `getNextBestAction(state)` — motivo legible en lenguaje natural
- [x] Implementar `generateDailyPlan(state, minutes)` — variantes 5/10/20/30/60 min
- [x] Implementar `generateWeeklyPlan(state)` — 5 días lun-vie
- [x] Implementar `saveLearningPlan(studentId, plan)` — desactiva plan anterior, inserta nuevo
- [x] Endpoint `GET /api/smartboard/adaptive/state`
- [x] Endpoint `GET /api/smartboard/adaptive/next-action`
- [x] Endpoint `POST /api/smartboard/adaptive/daily-plan`
- [x] Endpoint `POST /api/smartboard/adaptive/weekly-plan`
- [x] Crear `src/hooks/useAdaptiveEngine.js` — fetchNextAction, fetchDailyPlan, fetchWeeklyPlan
- [ ] Tests unitarios `adaptiveLearning.js` (Sprint 12)
- [ ] Test integración: `getNextBestAction` retorna acción con motivo legible (Sprint 12)

---

## Sprint 5 — Mi Plan + ¿Qué Hago Hoy? ✅ COMPLETADO

- [x] Agregar `useAdaptiveEngine` a `HeroSection.jsx` — carga nextAction al montar
- [x] Crear `WhatDoIDoToday.jsx` — widget compacto con: acción, motivo, selector 5/10/20/30m, botón Ir →
- [x] Integrar `WhatDoIDoToday` en HeroSection — visible sin scroll en mobile
- [x] Crear `AcademicSemaphore.jsx` — semáforo 🟢🟡🔴 por materia (mastery o nota), accesible (role=status, aria-label)
- [ ] Integrar `AcademicSemaphore` en tab de calificaciones (pendiente — depende del tab)
- [ ] Extender `PersonalizedPlan.jsx` para consumir plan adaptativo (Sprint siguiente)
- [ ] Test: semáforo cambia color al cambiar mastery en DB (Sprint 12)

---

## Sprint 6 — Dani 2.0 ✅ COMPLETADO

- [x] Crear `edutechlife-backend/src/services/aiSafetyGateway.js` — input validation, age policy, emotional detection, output sanitization
- [x] Crear `edutechlife-backend/src/services/daniOrchestrator.js` — carga contexto desde DB (profile, mastery, memory, plan, schedule), construye system prompt con ciclo pedagógico
- [x] Nuevo endpoint `POST /api/smartboard/dani/chat` — acepta `{ message, studentId, socraticMode, documentContext, history }`, orquesta contexto, streama con SSE
- [x] Agregar `callDaniOrchestrator()` a `utils/api.js`
- [x] Migrar `useDaniSendMessage.js` al nuevo endpoint — contexto construido en backend, frontend solo envía mensaje + studentId
- [x] Ciclo pedagógico en system prompt: pregunta → pista → explicación → ejemplo → verificación → retroalimentación
- [x] Detección emocional: confusión, frustración, dominio, dependencia excesiva (backend + frontend metadata)
- [x] Edad/grado: `getAgePolicy()` ajusta vocabulario y longitud de respuesta
- [ ] Test: AISafetyGateway bloquea prompt inapropiado (Sprint 12)
- [ ] Test: Dani modo Socrático no resuelve directamente (Sprint 12)

---

## Sprint 7 — Parent Intelligence ✅ COMPLETADO

- [x] Crear `edutechlife-backend/src/services/parentInsights.js` — generateParentInsights() + buildLearningGraphSummary()
- [x] 5 tipos de insights: progress, risk, focus, habit, emotional — leen de students + student_competency_mastery + dani_memory + learning_plans + activity_sessions
- [x] Endpoints: `GET /api/smartboard/parent/insights` y `GET /api/smartboard/parent/learning-graph`
- [x] Crear `useParentInsights.js` hook — fetchInsights(studentId), non-blocking
- [x] Integrar insights en SmartBoardParentDashboard — sección "resumen", con iconos y colores por severity
- [ ] Extender weekly-report con mastery data (pendiente — requiere ajustar buildWeeklySummary)
- [ ] Test: insight contiene evidencia real del estudiante (Sprint 12)

---

## Sprint 8 — Early Warning System ✅ COMPLETADO

- [x] Crear `edutechlife-backend/src/services/earlyWarning.js` — 4 detectores activos
- [x] Detector 1: inactividad — learning_streaks.last_activity_date > 3 días
- [x] Detector 2: caída de rendimiento — mastery bajó > 20% vs semana anterior
- [x] Detector 3: errores repetitivos — mastery < 0.3 con ≥ 3 intentos
- [x] Detector 4: racha rota — current_streak = 0 con historial existente
- [x] Tabla `early_warnings` ya existía en migration 052 — se usa directamente
- [x] Endpoints: `GET /api/smartboard/adaptive/warnings` + `POST /adaptive/warnings/:id/resolve`
- [x] Crear `useEarlyWarnings.js` hook — fetchWarnings, resolveWarning
- [x] Alertas 🔴🟡 en parent dashboard — seccion "resumen", con botón de resolución
- [ ] Detector 4 (abandono actividad): requiere activity_log con estado iniciado/completado (pendiente Sprint 12)
- [ ] Test: falsos positivos (Sprint 12)

---

## Sprint 9 — Gamification 2.0 ✅ COMPLETADO

- [x] Migración 054: tablas `missions`, `student_missions`, `badges`, `student_badges` con RLS
- [x] Seed: 7 misiones base (daily/weekly/exploration/competency) + 5 badges
- [x] Crear `missionEngine.js` — getStudentMissions(), recordActivity()
- [x] Crear `badgeEngine.js` — checkAndUnlockBadges(), getStudentBadges()
- [x] Endpoints: `GET /gamification/missions`, `POST /gamification/activity`, `GET /gamification/badges`
- [x] Feedback emocional 😊😐😣 en OralExamSimulator.jsx — resultados
- [x] Feedback emocional en FlashcardResults.jsx — resultados
- [x] Feedback emocional en ExamPrep.jsx (DeckQuiz) — resultados
- [ ] Conectar MisionDelDia.jsx a misiones dinámicas de DB (requires Zustand action, Sprint siguiente)
- [ ] Guardar feedback emocional en activity_log (Sprint 12 — tabla no existe aún)
- [ ] Tests (Sprint 12)

---

## Sprint 10 — Skill Passport ✅ COMPLETADO

- [x] Crear hook `useSkillPassport()` — lee `student_competency_mastery`, formatea para UI
- [x] Crear componente `SkillPassport.jsx` — vista de todas las competencias
- [x] UI: tarjeta por competencia con nivel (Explorador → Experto), barra de progreso, color por nivel
- [x] Mostrar badges desbloqueados y preview de badges bloqueados
- [x] Integrar SkillPassport en tab Progreso (ProgressDashboard.jsx — después de AcademicFeedback)
- [ ] Test: completar actividad → nivel en Skill Passport actualiza (Sprint 12)

---

## Sprint 11 — Future Explorer ✅ COMPLETADO

- [x] `studentAge` ya disponible en contexto SmartBoardKids
- [x] Crear componente `FutureExplorer.jsx` — solo para edad ≥ 10 (condicional)
- [x] 7 áreas de exploración vocacional: Ciencias & Salud, Tecnología & IA, Arte & Diseño, Negocios & Liderazgo, Humanidades & Derecho, Idiomas & Culturas, Matemáticas & Ingeniería
- [x] Conectar áreas con fortalezas del Skill Passport — barras de progreso por competencia, badge "Tu fortaleza" en área top
- [x] Lenguaje no-determinista: "Podrías explorar…" / "Tu perfil muestra afinidad con…"
- [x] Tap en área → drawer con descripción detallada (modal accesible)
- [x] Integrado en tab "inicio" con InViewSection condicional (age ≥ 10)
- [ ] Test: FutureExplorer no visible para estudiantes < 10 años (Sprint 12)
- [ ] Test: áreas con mayor mastery muestran badge "Tu fortaleza" (Sprint 12)

---

## Sprint 12 — Analytics + QA

- [ ] Instrumentar PostHog: `user_registered`
- [ ] Instrumentar PostHog: `profile_completed`
- [ ] Instrumentar PostHog: `diagnostic_started` / `diagnostic_completed`
- [ ] Instrumentar PostHog: `mission_started` / `mission_completed`
- [x] Instrumentar PostHog: `dani_opened` — DaniTutorChat.jsx
- [x] Instrumentar PostHog: `dani_message_sent` — useDaniSendMessage.js
- [ ] Instrumentar PostHog: `activity_started` / `activity_completed`
- [x] Instrumentar PostHog: `competency_updated` — useCompetencyTracking.js
- [x] Instrumentar PostHog: `plan_generated` (daily + weekly) — useAdaptiveEngine.js
- [ ] Instrumentar PostHog: `parent_report_viewed`
- [ ] Instrumentar PostHog: `alert_generated`
- [ ] Instrumentar PostHog: `badge_unlocked`
- [ ] Instrumentar PostHog: `subscription_started` / `subscription_cancelled`
- [ ] Crear dashboard interno: métricas de activación, engagement, retención
- [ ] QA responsive Sprint 1–5: mobile + tablet + desktop
- [ ] QA responsive Sprint 6–11: mobile + tablet + desktop
- [ ] QA accessibility: ARIA labels, contraste de color
- [ ] Split `GradeScanner.jsx` → `GradeScannerCamera.jsx` + `GradeScannerOCR.jsx` + `GradeHistory.jsx`
- [ ] Split `OralExamSimulator.jsx` → separar lógica de generación de preguntas del estado de sesión
- [ ] Split `FlashcardSystem.jsx` → separar deck management de session logic
- [ ] Verificar: todos los archivos < 500 líneas
- [ ] Regression tests full suite: `npm test` pasa sin errores
- [ ] `npm run build` sin warnings
- [ ] Documentar en `ANALYTICS.md`

---

## Deuda Técnica — Pendiente (no bloqueante)

- [ ] Migrar `conversations` Supabase de Nico → también usada por Dani (desambiguar)
- [ ] Eliminar blob `smartboard_kids_data` cuando parent dashboard esté 100% migrado
- [ ] Integrar stub `multiplayerFlashcards.js` o eliminar si no está en roadmap
- [ ] Agregar error boundaries en cada tab de `SmartBoardKidsDashboard.jsx`
- [ ] Unificar los dos system prompts de Dani (backend `/api/chat` vs frontend constants)

---

*Total de tareas: ~130 items · Sprints: 12 · Duración estimada: ~14 semanas*
