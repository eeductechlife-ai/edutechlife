# SmartBoard 3.0 — Task Backlog
> Actualizado: 2026-08-25
> Estado: Sprint 0 completado. Sprint 1 listo para iniciar.

---

## Leyenda
- [ ] Pendiente
- [~] En progreso
- [x] Completado
- [!] BLOQUEANTE — hacer primero

---

## Sprint 0 — Auditoría ✅

- [x] Inspeccionar todo el repositorio kids-dashboard
- [x] Identificar stack, frontend, backend, DB, auth, IA
- [x] Inventariar todos los componentes existentes
- [x] Mapear rutas y APIs
- [x] Detectar deuda técnica
- [x] Crear `AUDIT.md`
- [x] Crear `tasks/plan.md`
- [x] Crear `tasks/todo.md`

---

## Sprint 1 — Design System + Arquitectura Base ✅ COMPLETADO

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
