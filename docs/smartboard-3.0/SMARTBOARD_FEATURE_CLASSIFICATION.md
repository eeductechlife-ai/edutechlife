# SmartBoard 3.0 — Feature Classification

> Snapshot: 2026-09-01 | Branch: recovery/foundation-phase-a
> Criterio: código inspeccionado + tests + schema + browser verification

## Clasificación

| Categoría | Significado |
|-----------|-------------|
| **CORE** | Funcionalidad esencial para el producto mínimo viable |
| **SUPPORT** | Infraestructura que habilita features CORE |
| **OPTIONAL** | Funcionalidad implementada pero no crítica para lanzamiento |
| **DEFERRED** | Diseñado/parcialmente implementado, no listo para producción |
| **EXPERIMENTAL** | Implementado pero sin validación con datos reales |
| **LEGACY** | Código activo que será reemplazado |
| **DEPRECATE** | Código que debe eliminarse |

---

## CORE

### C1. Autenticación Supabase
- **Estado**: Implementado + testeado backend
- **Evidencia**: `auth.js` middleware, `useSupabaseAuth.js` hook, migración 022 (Clerk→Supabase)
- **Endpoints**: requireAuth en 28/30 endpoints
- **Tests**: middleware auth testeado indirectamente en 47 route tests
- **Riesgo**: Token en sessionStorage (se pierde al cerrar pestaña)

### C2. Perfil de Estudiante (CRUD)
- **Estado**: Implementado + testeado backend + testeado browser
- **Evidencia**: GET/PUT `/student-profile`, POST `/student-profile/avatar`
- **Tests**: 15 tests (campos, upsert, avatar, validación)
- **Tablas**: `students` (age, grade, school, vak_style, avatar_url)

### C3. Dani 2.0 — Chat Orquestado con IA
- **Estado**: Implementado, testeado parcialmente (solo buildSystemPrompt)
- **Evidencia**: POST `/dani/chat` (SSE), GET `/dani/history`
- **Tests**: 9 tests en daniOrchestrator.test.js (prompt building only), 0 route tests
- **Pipeline**: validateInput → detectEmotionalState → loadStudentContext → buildOrchestratorPrompt → chatStream → sanitizeOutput → persist
- **Tablas**: `conversations` (write), `dani_memory`, `student_competency_mastery`, `learning_plans` (read)
- **Externo**: DeepSeek API (deepseek-chat, streaming, temp=0.7, max_tokens=800)
- **Riesgo**: 0 tests de ruta; no rate limit en /dani/chat

### C4. Diagnóstico VAK
- **Estado**: Implementado + testeado backend + testeado browser
- **Evidencia**: useSetVAKResult mutation, 3 páginas VAK (/vak, /vak-simple, /vak-premium)
- **Tests**: VAK hook testeado via Supabase mutations
- **Tablas**: `vak_results` (write), `students.vak_style` (update)

### C5. Sistema de Puntos
- **Estado**: Implementado + testeado backend
- **Evidencia**: addPoints con optimistic update + rollback, useAddPoints mutation
- **Tests**: cubierto indirectamente en route tests
- **Tablas**: `points_history` (write)
- **Fuentes de puntos verificadas**: minuto activo (+1), upload actividad (+50), análisis Dani (+100), VAK (+300), misión (variable)
- **Riesgo**: "+200 por completar materia" y "+150 por racha diaria" se muestran en UI pero NO están implementados

### C6. Consentimiento Parental (COPPA/Habeas Data)
- **Estado**: Implementado + testeado backend + testeado browser
- **Evidencia**: POST/GET consent endpoints, verificación por email, HTML page
- **Tests**: 27 tests (smartboard.test.js + parental-consent.test.js)
- **Tablas**: `parent_consents`
- **Riesgo**: ParentalConsentBlocker en frontend NO es bloqueante real — click "Comenzar a trabajar" siempre permite acceso

### C7. Persistencia de Datos (localStorage + Supabase Sync)
- **Estado**: Implementado
- **Evidencia**: useSmartBoardPersistence, saveData() debounced, smartboard_kids_data blob
- **Tests**: 0 tests directos de sync
- **Riesgo**: Dual persistence (localStorage + DB) con merge logic complejo; posibles inconsistencias

### C8. RLS / IDOR Protection
- **Estado**: Implementado + testeado backend
- **Evidencia**: assertAuthIdAccess, requireStudentAccess, migraciones 025/026/060/062
- **Tests**: 7 tests en ownership.test.js + 1 test 403 en smartboard.test.js
- **Tablas afectadas**: todas las SmartBoard tables con own-row + service_role policies

---

## SUPPORT

### S1. Parent-Student Links
- **Estado**: Implementado
- **Evidencia**: `parent_student_links` tabla, assertAuthIdAccess verifica vínculos
- **Tests**: cubierto en ownership.test.js (parent access, unlinked parent deny)
- **Datos QA**: 2 pares padre-estudiante configurados en producción

### S2. Crisis Detection & Alerting
- **Estado**: Implementado
- **Evidencia**: crisisDetection.js, logCrisisIncident, email via Resend
- **Tests**: 0 tests de ruta (crisis flow in /chat/stream no testeado)
- **Tablas**: `crisis_alerts` (write)
- **Riesgo**: endpoint /chat/stream tiene crisis detection pero 0 tests

### S3. Rate Limiting
- **Estado**: Parcialmente implementado
- **Evidencia**: rateLimiter.js — apiLimiter (100/15min), deepseekLimiter (20/min)
- **Tests**: 6 tests de configuración
- **GAP CRÍTICO**: deepseekLimiter solo aplica a /chat legacy, NO a /dani/chat ni /ai

### S4. Safety Gateway (Input/Output Sanitization)
- **Estado**: Implementado
- **Evidencia**: aiSafetyGateway.js — validateInput (2000 chars, forbidden patterns), sanitizeOutput (URLs stripped, numbers masked)
- **Tests**: testeado indirectamente via daniOrchestrator tests

### S5. Email Service
- **Estado**: Implementado
- **Evidencia**: emailService.js via Resend — crisis alerts, consent verification, weekly report
- **Tests**: 0 tests directos del servicio de email

### S6. GDPR/COPPA Data Deletion
- **Estado**: Implementado + testeado backend
- **Evidencia**: DELETE `/delete-user-data` — borra 8 tablas
- **Tests**: 3 tests (success, tolerates missing tables, 500 on real error)

---

## OPTIONAL

### O1. Horario Escolar (Timetable)
- **Estado**: Implementado (server-only data)
- **Evidencia**: useTimetable hook, tablas student_timetable/timetable_slots/student_exams
- **Tests**: 0 tests de ruta
- **Tablas**: 3 tablas con RLS own-row (060)

### O2. Plan de Mejora (Improvement Plan)
- **Estado**: Implementado + persistencia servidor
- **Evidencia**: GET/PUT `/improvement-plan`, useImprovementPlan hook
- **Tests**: 0 tests de ruta
- **Tablas**: `learning_plans` (via improvement_plans alias)

### O3. Weekly Report (Email to Parents)
- **Estado**: Implementado + testeado backend
- **Evidencia**: POST `/weekly-report` con preview mode
- **Tests**: 10 tests (route + pure functions)

### O4. Wellbeing Status (Parent Dashboard)
- **Estado**: Implementado + testeado backend
- **Evidencia**: GET `/wellbeing-status` — aggregated crisis alerts
- **Tests**: 3 tests (calm, attention, table missing)

### O5. Grade Scanner
- **Estado**: Implementado (frontend component + DB table)
- **Evidencia**: GradeScanner component, `grade_analyses` tabla, `students.grades_json`
- **Tests**: 0
- **Riesgo**: Grades en localStorage only, no server persistence dedicada

### O6. Tienda de Recompensas
- **Estado**: Parcialmente implementado
- **Evidencia**: PointsRewardsSystem.jsx — 6 rewards definidos
- **Funcional**: Solo 3/6 (dark mode, avatar animado, fondo galaxia) tienen efecto real
- **No funcional**: Día Libre, Curso IA Básico, Certificado VAK — deducen puntos pero no tienen implementación

### O7. Flashcards / Exam Prep / SmartBook Reader
- **Estado**: Implementado (frontend components, synced via blob)
- **Evidencia**: flashcardSystem/, examPrep/, smartBookReader/ directories
- **Tests**: 0
- **Persistencia**: localStorage + saveData() blob sync

---

## EXPERIMENTAL

### E1. Adaptive Learning Engine
- **Estado**: Implementado, sin validación con datos reales
- **Evidencia**: 5 endpoints (state, next-action, daily-plan, weekly-plan, recommendations)
- **Tests**: 5 tests en adaptiveLearningPriority.test.js (priority logic only)
- **Tests de ruta**: 0
- **Tablas**: student_competency_mastery, sessions, learning_streaks, learning_content, recommendations
- **Riesgo**: Mastery formula (old*0.7 + new*0.3) no validada con estudiantes reales

### E2. Competency Mastery (Learning Graph)
- **Estado**: Implementado
- **Evidencia**: GET/POST `/adaptive/mastery`, 87 competencias MEN Colombia seeded
- **Tests**: 0 tests de ruta
- **Riesgo**: Competencias seeded pero no validadas curricularmente

### E3. Parent Intelligence
- **Estado**: Implementado
- **Evidencia**: GET `/parent/insights`, GET `/parent/learning-graph`
- **Tests**: 6 tests de helpers puros (parentInsights.test.js)
- **Tests de ruta**: 0
- **Genera**: 3-5 insight cards (progress, risk, focus, habit, emotional)

### E4. Early Warning System
- **Estado**: Implementado (5 detectores)
- **Evidencia**: earlyWarning.js, GET `/adaptive/warnings`, POST `.../resolve`
- **Tests**: 0 tests de ruta
- **Detectores**: inactivity (3d), performance_drop (20%), repeated_errors, low_completion (40%), streak_breaks

### E5. Gamification 2.0 (Missions + Badges)
- **Estado**: Implementado (server-side engine)
- **Evidencia**: GET missions, POST activity, GET badges — missionEngine.js, badgeEngine.js
- **Tests**: 0 tests de ruta
- **Tablas**: missions, student_missions, badges, student_badges
- **Riesgo**: Completion conditions no se auto-detectan — requieren llamada explícita desde frontend

---

## LEGACY

### L1. Chat Legacy (/chat, /chat/stream)
- **Estado**: Activo, reemplazado conceptualmente por Dani 2.0 (/dani/chat)
- **Evidencia**: POST `/chat` (non-streaming), POST `/chat/stream` (SSE)
- **Tests**: 3 tests de validación en /chat
- **Diferencia vs Dani 2.0**: sin contexto de estudiante, sin persistencia, sin orquestación
- **Recomendación**: Deprecar cuando Dani 2.0 esté completamente verificado

### L2. AI General (/ai)
- **Estado**: Activo, usado por OralExam, Podcast, ImprovementPlan
- **Evidencia**: POST `/ai` — stateless, configurable temp/maxTokens
- **Tests**: 0
- **Riesgo**: Client controls full messages array — sin restricción de contenido

### L3. Achievements (useSmartBoardStats computed)
- **Estado**: Activo pero inconsistente
- **Evidencia**: Achievements computados client-side en useSmartBoardStats; tabla `achievements` existe y se lee, pero NADA escribe a ella desde frontend
- **Recomendación**: Unificar con badges de Gamification 2.0 o persistir a DB

---

## DEFERRED

### D1. Multiplayer/Leaderboards
- **Estado**: Schema creado (migración 036), no implementado en backend/frontend
- **Tablas**: leaderboards, leaderboard_snapshots, competition_events, competition_participants

### D2. Predictive Analytics
- **Estado**: Schema creado (migración 037), no implementado
- **Tablas**: student_risk_scores, predictive_alerts, learning_gap_predictions

### D3. Parent-Dani Chat
- **Estado**: Schema creado (migración 038), no implementado
- **Tablas**: parent_dani_conversations, conversation_messages, conversation_summaries

### D4. Feedback Log (Emotional Self-Report)
- **Estado**: Schema creado (migración 057), no implementado en frontend
- **Tabla**: feedback_log

### D5. Staging Frontend Deploy
- **Estado**: Pendiente — requiere proyecto Vercel separado con env vars de staging

---

## DEPRECATE

### X1. Políticas RLS con `current_user`
- **Estado**: Persisten en study_groups (migración 010)
- **Acción**: No son SmartBoard pero representan deuda técnica

### X2. `smartboard_kids_data` blob
- **Estado**: Activo pero redundante con tablas granulares
- **Acción**: Migrar lectura de parent dashboard a tablas específicas, luego deprecar blob

### X3. `parent_dashboards` tabla
- **Estado**: Creada en migración 011, no usada por ningún endpoint actual
- **Acción**: Confirmar que no se usa y eliminar

### X4. `student_tasks` tabla
- **Estado**: Creada en migración 011, sin endpoints que la usen
- **Acción**: Confirmar y eliminar
