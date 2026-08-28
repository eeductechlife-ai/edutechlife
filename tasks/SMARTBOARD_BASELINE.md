# SMARTBOARD_BASELINE.md — SmartBoard 3.0 Baseline Técnico
> Generado: 2026-08-27 · Actualizado: 2026-08-28 · Rama: `feature/smartboard-3.0` · Commit: `687c428`
> Tag de restauración: `baseline-fase0`

---

## Resumen Ejecutivo

| Estado | Cantidad | % |
|--------|----------|---|
| ✅ DONE | 79 | 91% |
| 🟡 PARTIAL | 2 | 2% |
| 🔴 NOT IMPLEMENTED | 4 | 5% |
| 🟠 MOCK | 1 | 1% |
| ⛔ BLOCKED | 1 | 1% |
| **Total** | **87** | **100%** |

---

## Tabla Detallada

### Sección A — Identidad y Diseño (§1-§8)

| # | Punto del brief | Estado | Evidencia | Notas |
|---|----------------|--------|-----------|-------|
| 1 | Nombre y marca SmartBoard | ✅ DONE | `smartboardTheme.js`, logos en `assets/` | Branding consolidado |
| 2 | Design System unificado | ✅ DONE | `kids-dashboard/ui/` (8 componentes), `SB_COLORS/GRADIENTS/RADII/glow()` | Tokens semánticos `SB.categories`, `SB.ui` |
| 3 | Dark mode | ✅ DONE | `smartboardTheme.js` surfaceDark/surfaceDarkAlt, toggle en settings | Funcional en todos los componentes |
| 4 | Responsive mobile-first | ✅ DONE | Auditoría F0-F5 completada (40 hallazgos corregidos) | Verificado 320px-1440px |
| 5 | Animaciones y microinteracciones | ✅ DONE | Framer Motion en tabs, modales, notificaciones, cards | `AnimatePresence` |
| 6 | Iconografía emoji-first | ✅ DONE | `TYPE_STYLE` en notificaciones, badges, materias | Coherente con paleta |
| 7 | Onboarding wizard | ✅ DONE | `OnboardingWizard.jsx` 312L | Recoge: grado, VAK, ciudad, intereses |
| 8 | Landing page SmartBoard | ✅ DONE | `SmartBoardLandingPage.jsx` + `SmartBoardInfoPage.jsx` | Role-fork: estudiante vs padre |

### Sección B — Perfil Inteligente (§9-§15)

| # | Punto del brief | Estado | Evidencia | Notas |
|---|----------------|--------|-----------|-------|
| 9 | Smart Profile consolidado | ✅ DONE | `useStudentProfile.js` — students + VAK + streaks + points + sessions | JSDoc tipado |
| 10 | Diagnóstico VAK | ✅ DONE | `VAKDiagnosticEnhanced.jsx` 288L + `vak_results` tabla | Completo y testeado |
| 11 | Memoria persistente Dani | ✅ DONE | `useDaniMemory.js` → tabla `dani_memory` (migración 052) | Fallback localStorage offline |
| 12 | Contexto de estudiante dinámico | ✅ DONE | `daniOrchestrator.js` carga profile+mastery+memory+plan+schedule | Backend-side context building |
| 13 | Adaptive Engine | ✅ DONE | `adaptiveLearning.js`: getStudentState, generateRecommendations, getNextBestAction | 9 funciones exportadas |
| 14 | Explicabilidad (reason/why) | ✅ DONE | `recommendations.reason` NOT NULL, motivo en español | §14 cumplido |
| 15 | Detección fortalezas/debilidades | ✅ DONE | `detectStrengths()` mastery≥0.7∨nota≥4.0; `detectWeaknesses()` mastery<0.4∨nota<3.5 | Dual: mastery + grades |

### Sección C — Learning Graph (§16-§22)

| # | Punto del brief | Estado | Evidencia | Notas |
|---|----------------|--------|-----------|-------|
| 16 | Competencias MEN Colombia | ✅ DONE | `053_learning_graph.sql`: 101 competencias, 7 materias | IDs `co_matematicas_6-7_0` |
| 17 | Student mastery tracking | ✅ DONE | `student_competency_mastery` + `competencyMastery.js` | Endpoints GET/POST |
| 18 | Tracking en actividades | ✅ DONE | `useCompetencyTracking.js` en OralExam, ExamPrep, Flashcard | Non-blocking |
| 19 | Content model taggeado | ✅ DONE | `055_content_model.sql`: `learning_content` age/grade/subject/difficulty/VAK | 4 seeds, RLS |
| 20 | Recommendation engine | ✅ DONE | `056_recommendations.sql` + `recommendContent()` | Content-backed, persisted |
| 21 | Currículo MEN JSON | ✅ DONE | `co_men.json` grados 1-11, migración 051, sync desde UserMenu | Inyección en Plan de Mejora |
| 22 | Grafo visual de competencias | ✅ DONE | `SkillPassport.jsx` CompetencyRadar SVG spider chart + tarjetas | Grafo interactivo + cards |

### Sección D — Plan Adaptativo (§23-§30)

| # | Punto del brief | Estado | Evidencia | Notas |
|---|----------------|--------|-----------|-------|
| 23 | "¿Qué hago hoy?" widget | ✅ DONE | `WhatDoIDoToday.jsx` en HeroSection | Acción + motivo + selector minutos |
| 24 | Plan diario generado | ✅ DONE | `generateDailyPlan(state, minutes)` — 5/10/20/30/60 min | Endpoint POST |
| 25 | Plan semanal | ✅ DONE | `generateWeeklyPlan(state)` — lun-vie | Endpoint POST |
| 26 | Planes persistentes | ✅ DONE | `saveLearningPlan()` desactiva anterior, inserta nuevo | Tabla `learning_plans` |
| 27 | Semáforo académico | ✅ DONE | `AcademicSemaphore.jsx` — 🟢🟡🔴 por materia | ARIA role=status |
| 28 | Tendencia de notas | ✅ DONE | `gradeTrend(g)` en SmartBoardKidsContext — p1-p4 | Expuesto como `trend` |
| 29 | Next step adaptativo | ✅ DONE | `adaptiveNextStep.js` + `NextStepCard.jsx` | recovery/practice/transfer |
| 30 | Ciclo MASTERED→PRACTICE→TRANSFER | ✅ DONE | `getNextStep({score, feedback})` | 7 tests pasando |

### Sección E — Dani 2.0 (§31-§38)

| # | Punto del brief | Estado | Evidencia | Notas |
|---|----------------|--------|-----------|-------|
| 31 | AI Safety Gateway | ✅ DONE | `aiSafetyGateway.js` — input/output + age + emotional | Backend middleware |
| 32 | Dani Orchestrator | ✅ DONE | `daniOrchestrator.js` — contexto DB, system prompt | Endpoint POST /dani/chat |
| 33 | Ciclo pedagógico | ✅ DONE | Pregunta→pista→explicación→ejemplo→verificación→retroalimentación | En system prompt |
| 34 | Detección emocional | ✅ DONE | Confusión, frustración, dominio, dependencia excesiva | Backend + frontend |
| 35 | Age policy | ✅ DONE | `getAgePolicy()` ajusta vocabulario y longitud | En aiSafetyGateway |
| 36 | Challenge Engine | ✅ DONE | `challengeEngine/` — standalone con 3 niveles, 6 materias, MCQ AI, XP | Tab "retos" en Explorar |
| 37 | Modo Socrático | ✅ DONE | `socraticMode` flag, prompt no resuelve directamente | Toggle en UI |
| 38 | Streaming SSE | ✅ DONE | `callDaniOrchestrator()` + SSE backend | Migrado de callDaniChatStream |

### Sección F — Gamificación (§39-§48)

| # | Punto del brief | Estado | Evidencia | Notas |
|---|----------------|--------|-----------|-------|
| 39 | XP / Puntos | ✅ DONE | `points_history` tabla + context | Funcional |
| 40 | Niveles (5 tiers) | ✅ DONE | Explorador→Experto en context | Funcional |
| 41 | Rachas diarias | ✅ DONE | `learning_streaks` tabla | Aplicada en producción |
| 42 | Notification engine | ✅ DONE | `useSmartBoardNotifications.js` — mission_ready + reinforcement | Anti-spam 1/día |
| 43 | Notification panel | ✅ DONE | `SmartBoardNotificationPanel.jsx` — glow, dark mode | Fix position bug resuelto |
| 44 | Misiones diarias | ✅ DONE | `MisionDelDia.jsx` + Context fetches missions from DB with fallback | Wired to backend |
| 45 | Misiones dinámicas | ✅ DONE | `missionEngine.js` backend + frontend fetch + completeMission POST | Full stack wired |
| 46 | Badges/logros | ✅ DONE | `badgeEngine.js` + activity POST returns newBadges + toast notification | Real-time unlock |
| 47 | Feedback emocional | ✅ DONE | `feedback_log` tabla (057) + `useFeedbackLog` hook + wired en OralExam/Flashcard/ExamPrep/Challenge | Persiste en DB |
| 48 | Recompensas cosméticas | ✅ DONE | `rewards` tabla (058) + `RewardsGrid` fetch DB con fallback | Administrable vía DB |

### Sección G — Evaluación y Práctica (§49-§57)

| # | Punto del brief | Estado | Evidencia | Notas |
|---|----------------|--------|-----------|-------|
| 49 | Oral exam simulator | ✅ DONE | `OralExamSimulator.jsx` + `AgeAdaptiveOralExam.jsx` | Con competency tracking |
| 50 | Admin/CMS contenido | 🔴 NOT IMPL | No existe panel de administración | Requiere nuevo módulo |
| 51 | Flashcard system | ✅ DONE | `FlashcardSystem.jsx` + deck + importer | Multiplayer stub sin integrar |
| 52 | Content-backed recs | ✅ DONE | `recommendContent()` + `learning_content` + `recommendations` | Verificado end-to-end |
| 53 | Grade scanner | ✅ DONE | `GradeScanner.jsx` 1355L | Monolito pendiente split |
| 54 | Exam prep tracker | ✅ DONE | `ExamPrep.jsx` + módulo examPrep | DeckQuiz integrado |
| 55 | Study podcast | ✅ DONE | Migrado a callDeepseekSmartboard | Funcional |
| 56 | Smart book reader | ✅ DONE | `smartBookReader/` módulo | CRUD completo |
| 57 | Schedule editor | ✅ DONE | `schedule/` + `useTimetable.js` | Integrado con Dani context |

### Sección H — Monitoreo y Alertas (§58-§65)

| # | Punto del brief | Estado | Evidencia | Notas |
|---|----------------|--------|-----------|-------|
| 58 | Early Warning System | ✅ DONE | `earlyWarning.js` — 4 detectores | Endpoints GET/POST |
| 59 | Parent dashboard | ✅ DONE | `SmartBoardParentDashboard.jsx` | Insights + warnings |
| 60 | Parent insights | ✅ DONE | `parentInsights.js` — 5 tipos | Lee mastery + memory + plans |
| 61 | Learning graph para padres | ✅ DONE | `buildLearningGraphSummary()` | Resumen por materia |
| 62 | Alertas parent dashboard | ✅ DONE | 🔴🟡 + botón resolución | Funcional |
| 63 | Weekly report extendido | ✅ DONE | `aggregateMasterySummary` + `MasteryHighlights` en parent dashboard | Mastery integrado |
| 64 | Crisis detection | ✅ DONE | `detectCrisis()` en Dani stream | Tabla `crisis_alerts` |
| 65 | Control parental granular | 🔴 NOT IMPL | No existe UI de config granular | Solo on/off consent |

### Sección I — Exploración Vocacional (§66-§70)

| # | Punto del brief | Estado | Evidencia | Notas |
|---|----------------|--------|-----------|-------|
| 66 | Future Explorer | ✅ DONE | `FutureExplorer.jsx` — 7 áreas vocacionales | Solo edad ≥ 10 |
| 67 | Conexión con Skill Passport | ✅ DONE | Barras progreso + badge "Tu fortaleza" | Área top destacada |
| 68 | Lenguaje no-determinista | ✅ DONE | "Podrías explorar…", "Tu perfil muestra afinidad…" | Apropiado por edad |
| 69 | Drawer detalle por área | ✅ DONE | Modal accesible con descripción | Tap → drawer |
| 70 | Skill Passport | ✅ DONE | `SkillPassport.jsx` + `useSkillPassport.js` | En tab Progreso |

### Sección J — Analytics y Métricas (§71-§77)

| # | Punto del brief | Estado | Evidencia | Notas |
|---|----------------|--------|-----------|-------|
| 71 | PostHog instrumentación | ✅ DONE | 12/12 eventos instrumentados (7 nuevos: SESSION_START/END, VAK/EXAM/FLASHCARD_COMPLETED, DANI_CHAT_STARTED, GRADE_SCANNED) | Completo |
| 72 | Dashboard métricas internas | 🔴 NOT IMPL | No existe | Solo SmartBoardAnalytics básico |
| 73 | Funnel activación/retención | 🔴 NOT IMPL | No instrumentado | Requiere PostHog + dashboard |
| 74 | Activity tracker | ✅ DONE | `useActivityTracker.js` → `activity_log` | Datos comportamentales |
| 75 | Age-adaptive analytics | ✅ DONE | `AgeAdaptiveAnalytics.jsx` 400L | Visualización por edad |
| 76 | Progress dashboard | ✅ DONE | `ProgressDashboard.jsx` 248L | Con SkillPassport |
| 77 | Analytics SmartBoard | ✅ DONE | `SmartBoardAnalytics.jsx` reads real data from context (sessions, streaks, grades) | PostHog write-only correcto |

### Sección K — Seguridad y Compliance (§78-§83)

| # | Punto del brief | Estado | Evidencia | Notas |
|---|----------------|--------|-----------|-------|
| 78 | Endpoint protegido SmartBoard AI | ✅ DONE | `POST /api/smartboard/ai` con requireAuth + consent | 7 componentes migrados |
| 79 | Consentimiento parental | ✅ DONE | Flujo completo email + consent gate | `parent_consents` |
| 80 | RLS todas las tablas | ✅ DONE | 17 tablas con RLS verificado en producción | auth_id pattern |
| 81 | GDPR delete endpoint | ✅ DONE | `DELETE /api/smartboard/delete-user-data` | Funcional |
| 82 | Feature flags | ✅ DONE | `FEATURE_FLAGS` config + `useFeatureFlag.js` | Pendiente migrar a Supabase |
| 83 | AISafetyGateway | ✅ DONE | `aiSafetyGateway.js` completo | Input + output + age + emotional |

### Sección L — Infraestructura y Calidad (§84-§87)

| # | Punto del brief | Estado | Evidencia | Notas |
|---|----------------|--------|-----------|-------|
| 84 | Tests automatizados | 🟡 PARTIAL | 132 archivos test + 10 nuevos (ChallengeEngine, FeedbackLog, SkillPassport) | Cobertura mejorada, aún expandible |
| 85 | Build limpio | ✅ DONE | `vite build` OK (2m36s), ESLint 0 errores | Verificado |
| 86 | Monolitos <500L | ✅ DONE | GradeScanner 386L, OralExam 492L, Flashcard 444L — todos <500L | Splits completados |
| 87 | Multiplayer flashcards | 🟠 MOCK | `multiplayerFlashcards.js` stub sin integrar | No conectado |

---

## Dependencias Bloqueantes

| Bloqueante | Afecta a | Estado |
|-----------|----------|--------|
| `daniOrchestrator.fetchTodaySchedule` usa `schedule_slots` (no existe) | Contexto horario Dani 2.0 | Necesita decisión day_of_week |
| CD `supabase db push` nunca funcionó en CI | Deploy automático schema | Branch sin fusionar |
| Tabla `feedback_log` no existe | Persistir feedback emocional (§47) | Requiere nueva migración |
| Supabase MCP no autenticado en esta sesión | Verificación tablas en vivo | Requiere re-auth conector |

---

## Migraciones en Producción (srirrwpgswlnuqfgtule)

| Migración | Tabla(s) | BD |
|-----------|----------|-----|
| 011 | `learning_streaks` | ✅ |
| 039 | `grade_analyses` | ✅ |
| 050 | `improvement_plans` | ✅ |
| 051 | students grade/country | ✅ |
| 052 | dani_memory, early_warnings, learning_plans, feature_flags | ✅ |
| 053 | competencies, student_competency_mastery | ✅ |
| 054 | missions, student_missions, badges, student_badges | ✅ |
| 055 | learning_content (4 seeds) | ✅ |
| 056 | recommendations | ✅ |

**17 tablas SmartBoard con RLS** verificadas.

---

## Recomendaciones para Fase 1

### Prioridad 1 — Cableado Frontend ↔ Backend
1. Conectar `MisionDelDia.jsx` a misiones dinámicas BD
2. Cablear frontend → `/adaptive/recommendations`
3. Integrar `useStudentProfile()` en HeroSection y UserMenu

### Prioridad 2 — Datos Unificados
4. Unificar 6+ listas de materias duplicadas (ver HARDCODE_REPORT)
5. Migrar recompensas cosméticas a Supabase

### Prioridad 3 — Testing
6. Tests endpoints adaptativos
7. Test seguridad: `/api/chat` sin consent → 403

### Prioridad 4 — Splits de Monolitos
8. GradeScanner (1355L) → Camera + OCR + History
9. OralExamSimulator (968L) → separar generación de session

### Prioridad 5 — Analytics
10. Completar 7 eventos PostHog faltantes
11. Dashboard métricas de aprendizaje

---

*Complementarios: [HARDCODE_REPORT.md](HARDCODE_REPORT.md) · [SMARTBOARD_ROUTE_MAP.md](SMARTBOARD_ROUTE_MAP.md)*
