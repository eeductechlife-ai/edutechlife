# SMARTBOARD 3.0 — MASTER REALITY AUDIT

**Fecha:** 2026-08-29
**Rama:** `feature/smartboard-3.0` (working tree clean)
**Alcance:** edutechlife-frontend (1342 src), edutechlife-backend, supabase/migrations (003–058), sql/ (16 scripts), e2e/, CI/CD, tests (ejecutados en vivo)
**Metodología:** 4 agentes de exploración (frontend, backend, DB, tests/deploy) + verificación manual de hallazgos críticos (env vars, token, RLS, migraciones)

> Nota: escrito en `.opencode/plans/` por restricción de permisos de escritura del entorno. Mover a la raíz del repo si se desea (SMARTBOARD_REALITY_AUDIT.md).

---

## VEREDICTO

# ⛔ BLOCKED

**Ningún feature de SmartBoard 3.0 alcanza el criterio VERIFIED.**
Criterio VERIFIED = frontend + backend + database + persistencia + flujo real + prueba ejecutada + resultado verificable.
**No existe ni una sola prueba ejecutada contra un backend vivo.** El backend no arranca localmente, la CI está en rojo, y el E2E usa un token falso.

---

## 1. RESUMEN EJECUTIVO

El producto tiene **infraestructura real** (Express + Supabase + DeepSeek) y **lógica real parcial** (mastery, adaptive, missions, Dani LLM), pero está roto en 4 capas simultáneas:

1. **Boot**: el backend no inicia con su propio `.env` (`SUPABASE_SERVICE_ROLE_KEY` vs `SUPABASE_SERVICE_KEY` — split-brain de nombres, 8 servicios afectados). 9/28 suites de test fallan determinísticamente.
2. **Persistencia**: la fuente de verdad es un blob JSONB (`smartboard_kids_data`) escrito por el frontend (localStorage-first), mientras los motores leen tablas normalizadas alimentadas por rutas de código *diferentes* → doble fuente de verdad y skew de datos.
3. **Schema-vs-código**: 6+ columnas/tablas consultadas por los motores no existen en el esquema → los motores fallan **en silencio** (Dani pierde memoria/mastery/plan, Early Warning no dispara, badges de mastery nunca se desbloquean, insights de padres ≈ vacíos).
4. **Migraciones**: 10 migraciones son no-ops silenciosos, 3 fallan duro, ~27 tablas nunca fueron creadas por el pipeline. La base remota se construyó a mano y quedó desalineada.

Además: **falla de seguridad crítica** (RLS abierta + IDOR), **5 routers muertos**, **frontend que llama endpoints que no existen** (404), y **CI/CD nunca verde**.

---

## 2. AUDITORÍA SMARTBOARD CORE — CLASIFICACIÓN DE LOS 22 MÓDULOS

| # | Feature | Estado | Evidencia (verificación) |
|---|---|---|---|
| 1 | Smart Profile | **PARTIAL** | GET/PUT `/api/smartboard/student-profile` real (`routes/smartboard.js:944,1041`). Auto-creación hardcodea `age: 12`. Vista deriva de contexto/localStorage, no de la API |
| 2 | VAK Diagnostic | **PARTIAL (MOCK lógica)** | 20 preguntas hardcoded (`VAKDiagnosticEnhanced.jsx:12-133`), conteo client-side; resultado SÍ persiste a `vak_results` (`useSmartBoardSupabase.ts:263`). Sin backend: no hay endpoint ni cómputo |
| 3 | Learning Graph | **PARTIAL → roto** | Kids: checklist estática hardcoded (`RutaAprendizaje.jsx:5-16`, `hasPlan = false`). Parent: `/parent/learning-graph` lee columna inexistente `mastery_score` → siempre `[]` |
| 4 | Competencies | **REAL (parcial)** | Tabla `competencies` seed 053 (90 filas MEN Colombia). `student_competency_mastery` real. Lectura desde frontend sin auth (bug token) |
| 5 | Mastery | **REAL (cálculo)** | `competencyMastery.js:39-69` — media móvil ponderada 0.7/0.3, persiste a `mastery_level` (coincide con schema). Consumidores rotos |
| 6 | Adaptive Engine | **PARTIAL** | `adaptiveLearning.js` rule-based real, pero 3 de 5 inputs (`sessions`, `learning_streaks`, `grade_analyses`) vienen de rutas frontend distintas → skew |
| 7 | Recommendations | **REAL (adaptive) / MOCK (VAK)** | `/adaptive/recommendations` lee `learning_content` y persiste a `recommendations` (056). `VAK_RECOMMENDATIONS` estática en `smartBoardData.js:122` |
| 8 | Learning Plans | **PARTIAL** | Write real a `learning_plans.plan_json` (052). Lectores (`daniOrchestrator.js:70`, `parentInsights.js:44`) consultan `plan_data` (no existe) → siempre null. Frontend: `useImprovementPlan.js` persiste SOLO a localStorage |
| 9 | Next Best Action | **REAL** | `/adaptive/next-action` rule-based (`adaptiveLearning.js:336`) + reglas locales (`adaptiveNextStep.js`) |
| 10 | Dani AI Assistant | **PARTIAL** | LLM DeepSeek real (`deepseek.js`), prompt con contexto DB, streaming SSE, guard anti-inyección (`smartboard.js:132`). Pero 4 de 8 bloques de contexto muertos (mastery/memory/plan/schedule). Crisis = regex de keywords |
| 11 | Dani Memory | **PARTIAL** | Frontend upserta `dani_memory` (real, `useDaniMemory.js`); backend la lee con columna inexistente `memory_data` y **nunca la escribe** (052 usa columnas tipadas). Chat history: SOLO localStorage, sin tabla |
| 12 | Gamification | **PARTIAL (MOCK)** | Puntos → `points_history` vía frontend directo (optimista). Catálogo de recompensas estático (`gamificationData.js`). `learning_streaks` solo lectura. Backend: nada escribe puntos |
| 13 | Missions | **PARTIAL** | `missionEngine.js` real + catálogo seed 054. Frontend: fallback a `DEFAULT_MISSIONS` estáticas porque pide sin auth (token `sb_auth_token` nunca seteado) |
| 14 | Badges | **PARTIAL** | `badgeEngine.js` real; criterio de mastery consulta `mastery_score` (no existe) → nunca se desbloquea por mastery |
| 15 | Challenges | **PARTIAL (frontend-only)** | `useChallengeEngine.js` — generación IA real + scoring local → XP/emoción a Supabase. CERO backend |
| 16 | Early Warning | **PARTIAL → casi muerto** | 2 de 4 detectores consultan columnas inexistentes (`mastery_score`, `attempts`) → nunca disparan. Heartbeat: frontend llama `/api/smartboard/heartbeat` que NO EXISTE → detector de inactividad da falsos positivos |
| 17 | Parent Dashboard | **PARTIAL** | UI rica (1034 líneas), Supabase realtime, datos reales del blob. Insights engine con columnas rotas → solo "habito" puede dispararse. Wellbeing/crisis real |
| 18 | Parent Insights | **PARTIAL** | `/parent/insights` lee `mastery_score`, `plan_data`, `memory_data`, `activity_sessions` — todos inexistentes → ≈ vacío |
| 19 | Future Explorer | **MOCK** | `AREAS` hardcoded (`FutureExplorer.jsx:6-77`); scores derivan de mastery real. Sin backend |
| 20 | Skill Passport | **PARTIAL** | UI real; lee `/adaptive/mastery` + `gamification/badges`; sin endpoint backend propio; nivel calculado en cliente |
| 21 | Notifications | **PARTIAL** | Supabase `notifications` real + realtime + fallback localStorage. Backend `parentAlertsService.js` completo pero **nunca montado ni llamado** |
| 22 | Analytics | **STUB** | `metricsService.js` lee tablas inexistentes (`user_sessions`, `feature_usage`, `parent_dashboard_views`, `lesson_attempts`) → todo 0; splits hardcoded 0.65/0.35; router `metrics.js` NO montado → 404 en `/api/admin/metrics/*`. Frontend: `SmartBoardStatsPage` localStorage-only |

### Resumen por estado

| Estado | Features |
|---|---|
| VERIFIED | **NINGUNO** |
| REAL (con reservas) | Competencies, Mastery, Recommendations, Next Best Action, Missions |
| PARTIAL | Profile, VAK(persistencia), Learning Graph, Adaptive, Plans, Dani, Dani Memory, Gamification, Badges, Challenges, Early Warning, Parent Dashboard, Parent Insights, Skill Passport, Notifications |
| MOCK | VAK (lógica), Recommendations VAK, Future Explorer, Gamification catalog, Learning Graph kids |
| NOT_IMPLEMENTED | Challenges backend, Dani chat history en DB, Skill Passport backend, heartbeat, report, VAK backend, Analytics backend |

---

## 3. AUDITORÍA DE INTEGRACIÓN (cadena principal)

```
Profile → Graph → Adaptive → Recommendation → Plan → Activity → Result → Mastery → Dani → Parent
```

| Paso | Endpoint | Tablas | Estado de la cadena |
|---|---|---|---|
| Profile | GET/PUT `/student-profile` | `students` | ✅ real |
| Graph | GET `/competencies` | síntesis de IDs; graph nunca la consulta | ⚠️ desconectado |
| Adaptive state | GET `/adaptive/state` | `students`, `student_competency_mastery`, `sessions`, `learning_streaks`, `grade_analyses` | ⚠️ 3/5 inputs escritos por rutas frontend distintas |
| Recommendation | POST `/adaptive/recommendations` | `learning_content` → `recommendations` | ✅ real |
| Plan | POST `/daily-plan` | `learning_plans.plan_json` | ⚠️ write real; lectores usan `plan_data` → invisibles para Dani/padres |
| Activity | POST `/gamification/activity` | `student_missions`, `student_badges` | ✅ real (sin auth por bug token) |
| Result → Mastery | POST `/adaptive/mastery` | `student_competency_mastery` | ✅ real |
| Mastery → Dani | POST `/dani/chat` | mastery(columna rota), memory(columna rota, nunca escrita), plans(columna rota), `schedule_slots`(tabla inexistente) | ❌ solo profile+schedule llegan al prompt |
| Mastery → Parent | `/parent/insights`, `/learning-graph`, `/weekly-report` | columnas rotas + `activity_sessions` (inexistente) | ❌ insights ≈ vacíos; weekly-report pasa auth uid en vez de student id (`smartboard.js:704`) |
| Wellbeing | GET `/wellbeing-status` | `crisis_alerts` | ✅ real |

**Puntos de ruptura:** 4 (contexto Dani), 3 (insights padres), 2 (detectores early warning), 1 (badges mastery). Todo falla **en silencio** (`.catch()` + `data: []`), por eso el producto parece funcionar.

---

## 4. PRODUCCIÓN VS DESARROLLO

| Capa | Código local | Supabase remoto | Producción |
|---|---|---|---|
| Frontend | Rama `feature/smartboard-3.0` (5 commits sin push) | — | Vercel Git integration (edutechlife.co), build `build:fast` → **sin prerender ni sitemap** |
| Backend | No arranca con `.env` propio | — | Render `edutechlife-backend.onrender.com` (hook; el workflow que lo dispara nunca corre: depende de `migrate-db` que falla 12/12) |
| Migraciones | 003–058 (49 archivos) | Aplicadas a mano (scripts sueltos de `sql/`) | `deploy.yml migrate-db` **nunca verde** (12/12), `continue-on-error: true` |
| Base de datos | Definida en migraciones (parcialmente rotas) | Construida a mano, desalineada (el propio 046 lo admite: "manually created in production but never migrated") | Idem |
| Rutas en prod | 35 rutas `/api/smartboard/*` + auth + chat + ialab | — | 5 routers NO montados (metrics, multiplayer, parentChat, predictions, achievements) → 404 |
| CI/CD | `.github/workflows/ci.yml` + `deploy.yml` | — | **Nunca completó una corrida exitosa.** Todos los jobs fallan o crashean |
| Tests | 136 frontend / 28 backend | — | CI en rojo (ver §7) |

---

## 5. MOCK DATA (búsqueda hardcoded/dummy/fake/placeholder)

| Ubicación | Qué se simula | Crítico |
|---|---|---|
| `smartBoardData.js:1-170` | DEFAULT_NEWS, DEFAULT_MISSIONS, DEFAULT_SUBJECTS, VAK_RECOMMENDATIONS | SÍ (missions/recs default en prod) |
| `useSmartBoardActions.js:39` + 3 más | Token fantasma `sb_auth_token` → peticiones sin auth → fallbacks estáticos | **SÍ — crítico** |
| `VAKDiagnosticEnhanced.jsx:12-133` | 20 preguntas VAK | Parcial (contenido pedagógico) |
| `RutaAprendizaje.jsx:5-16` | Checklist de ruta de aprendizaje | SÍ (Learning Graph kids) |
| `FutureExplorer.jsx:6-77` | Áreas de carrera | Parcial |
| `gamificationData.js` | Catálogo de recompensas | Menor |
| `smartBoardDashboard/useStudentProgress.js:16-36` | Legacy dashboard 100% demo (XP 1250, level 3, streak 7) — **aún enrutado en `/smartboard/app`** | SÍ (producción expone demo data) |
| `useValerioFallback.js` | Respuestas IA canned (IALab) | SÍ (IALab) |
| `ialab/evaluate.js:60-101` | Evaluación = heurística regex (tone: 8 hardcoded), sin LLM | SÍ (IALab) |
| `metrics.js:236-243` | `/health` = 99.9/0.2/350/15 hardcoded | Menor |
| `predictionService.js:20-28` | Defaults "healthy" si no hay datos | SÍ (riesgo enmascarado) |
| `newsData.js:19` | fallbackNews | Menor |
| Stripe webhook | Ack 200 si no hay key | Menor |

---

## 6. PRUEBAS SOLICITADAS (procedimiento §6–§10)

**Resultado: NO EJECUTABLES en el estado actual.** Esto es un hallazgo de la auditoría:

| Test | Estado | Bloqueante |
|---|---|---|
| E2E (2 estudiantes A/B, comparar profile/rec/plan/Dani) | ⛔ No ejecutable | Backend no arranca (`SUPABASE_SERVICE_ROLE_KEY`); E2E usa token falso `e2e.fake.token` sin backend vivo; no hay seed de 2 estudiantes; los spec requieren servidor Vite + backend real |
| Adaptation (mastery bajo→medio→alto) | ⛔ No ejecutable | Mismo bloqueo + los motores leen columnas inexistentes (el cambio de mastery ni se vería en Dani/insights) |
| Parent (dashboard/insight/alert) | ⛔ No ejecutable | Insights engine roto por columnas; sin backend vivo |
| Persistence (modificar→logout→login) | ⛔ No ejecutable | Sin entorno vivo; la persistencia real no se puede verificar sin sesión real |
| Visual (6 screenshots) | ⛔ No ejecutable | Snapshots existentes son `*-chromium-darwin.png` (CI Linux fallaría); sin backend vivo las páginas muestran fallbacks |

**Implicación:** no existe actualmente ningún flujo cuya verificación E2E sea posible. Antes de cualquier fase de test, hay que reparar: (1) env var del backend, (2) boot local, (3) migraciones, (4) un entorno de staging con datos semilla.

---

## 7. BUGS CRÍTICOS (P0/P1)

### P0 — Seguridad y disponibilidad
1. **RLS abierta**: `students` y `vak_results` con `FOR ALL TO authenticated USING(true)` (migración 049) — cualquier usuario autenticado lee/modifica/borra **todos** los estudiantes (datos de menores). Contradice 025/026.
2. **IDOR generalizado**: `/adaptive/*`, `/parent/*`, `/gamification/*` aceptan `studentId` arbitrario sin verificar ownership, ejecutando con service-role (RLS bypaseado).
3. **Admin por `user_metadata.role`**: campo editable por el propio usuario (`middleware/adminAuth.js`) → escalación de privilegios. Debe ser `app_metadata`.
4. **Backend no arranca**: split-brain `SUPABASE_SERVICE_ROLE_KEY` vs `SUPABASE_SERVICE_KEY` (8 servicios). Husky bloquea commits.
5. **Consent parental fail-open**: cualquier error de DB → consentimiento asumido (válido para usuarios adultos; peligroso si la query falla para menores).

### P0 — Corrección de producto
6. **6+ columnas/tablas inexistentes consultadas**: `mastery_score` (debe ser `mastery_level`), `attempts` (`practice_count`), `last_updated` (`updated_at`), `dani_memory.memory_data` (columnas tipadas), `learning_plans.plan_data` (`plan_json`), `schedule_slots` (`timetable_slots`), `activity_sessions`, `user_sessions`, `feature_usage`, `lesson_attempts`, `parent_dashboard_views`, `missions_completed`. → Early Warning, badges-mastery, insights, contexto Dani: **muertos en silencio**.
7. **Migraciones corruptas**: 10 no-ops (033–039, 042, 046, 050 — guard contra tabla `'IF'`), 3 fallos duros (043/044/047 — `BEGIN;` en DO block), 1 no-op (051). ~27 tablas nunca creadas por pipeline.
8. **Token fantasma**: `sb_auth_token` nunca escrito → missions/badges/adaptive/mastery sin auth → fallbacks estáticos en producción.
9. **Frontend → endpoints inexistentes**: POST `/api/smartboard/heartbeat` (falsos positivos de inactividad), POST `/api/smartboard/report` (flags perdidos), GET `/api/admin/metrics/engagement` (404).
10. **5 routers nunca montados**: metrics, multiplayer, parentChat, predictions, achievements — features completas pero muertas.

### P1
11. `/smartboard` (kids dashboard) **público** — sin `RoleProtectedRoute`; solo el consent gate lo protege. Además el gate falla abierto ante errores.
12. Dos dashboards en producción: `/smartboard/app` = 100% demo data, `/smartboard` = nuevo. El legacy expone data falsa.
13. Weekly report pasa `auth.uid()` donde espera `students.id` → sección mastery siempre vacía.
14. `phase2-critical-fixes.test.js` prueba componentes que no existen (Redis, heartbeat limiter).
15. Tests: 17/23 servicios backend sin tests; frontend `test:smoke` crashea ("Worker exited unexpectedly"); colección rota (QuickActions importa componente borrado; quizCardRender lee `/tmp/real_cards.json`).
16. Dev proxy → URL obsoleta `edutechlife-api.vercel.app` (`vite.config.js:157`).
17. CI: e2e falla por snapshots darwin-only; coverage 70% inalcanzable con suites rotas; smoke test = 2 curls sin aserciones funcionales.
18. `learning_streaks`/`achievements`: frontend solo lee, nunca escribe.
19. Chat history de Dani y improvement plans: **solo localStorage** — se pierden con el dispositivo.
20. Vercel build usa `build:fast` → prerender y sitemap nunca corren en producción.

---

## 8. DEUDA TÉCNICA

- **Doble fuente de verdad**: blob `smartboard_kids_data` (localStorage-first, frontend) vs tablas normalizadas (motores backend). Elegir una y migrar.
- **Schema duplicado/conflictivo**: `achievements` (011 vs 035), `users` (Clerk-era vs native), `quiz_attempts` (4 definiciones), `certificates`, forum (003 vs loose scripts).
- **Tablas sin FK**: `push_subscriptions`, `league_rankings`, `valerio_academic_memory`, `smartboard_kids_data`, `notifications`, cluster `module_*`, `sessions.content_id` UUID suelto, `study_groups.module_id` suelto.
- **Migrations con huecos**: 001–002, 012–019 ausentes; 003+ asumen tablas base que no crea nadie.
- **`study_groups`**: políticas usan `current_user` (rol, nunca un user id) → updates/borrados de owner siempre denegados; insert con `WITH CHECK(true)`.
- **`users` policy rota**: `auth.uid()::text = clerk_id` nunca matchea (UUID vs `user_xxx`).
- **Servicios muertos**: `avatarService` (Replicate) y `emailTemplates.js` sin ruta que los llame.
- **`computeAllRiskScores`** RPC existe pero nada lo agenda → `student_risk_scores` vacío → predicciones devuelven "healthy" hardcoded.
- **Logout no-op** (`auth.js:892`).
- **Funciones DB rotas**: 036/037 consultan `points_history.user_id` (columna es `student_id`), `learning_sessions`/`student_streaks` (no existen).
- **Age constraint**: 047 apunta a constraint inexistente; el CHECK 6–16 de 011 sigue vigente.
- **Sin `render.yaml`/Dockerfile**: deploy del backend solo por hook manual.
- **`.env.example`** backend sin vars de Supabase; `.env` con nombre incorrecto.
- **E2E `facebook-oauth.spec.ts`** huérfano (puerto 5173, sin config).
- **`supabase/.temp/linked-project.json`** commiteado.
- **Archivo `.bak`** (`speech.js.bak`) con URLs legacy.

---

## 9. PROBLEMAS UX

- Fallos silenciosos en toda la cadena: el usuario ve vacíos/defaults sin saber que el backend falló (`useAdaptiveEngine` traga errores).
- Missions/badges caen a defaults estáticos → los usuarios ven contenido genérico idéntico para todos.
- Legacy dashboard con datos demo en `/smartboard/app` — confusión si algo lo enruta.
- Learning Graph del niño = checklist estática con "Fase 2" como placeholder permanente (`hasPlan = false`).
- Dani parece coherente pero ignora memoria/mastery/plan reales → respuestas genéricas.
- Sin feedback de error en heartbeat/report (fetch con catch `{}`).

---

## 10. PROBLEMAS PEDAGÓGICOS

- **Early Warning no dispara**: el sistema no detecta caídas de rendimiento ni errores repetidos (columnas rotas) → promesa central del producto incumplida.
- **VAK scoring client-side** con 20 preguntas fijas y recomendaciones estáticas → no hay adaptación real por perfil de aprendizaje.
- **Mastery** se actualiza solo por POST del frontend (sin auth), sin fuentes múltiples ni recalibración por sesiones/grades → el valor no es confiable.
- **Plan de mejora en localStorage** → se pierde; el estudiante no tiene continuidad entre dispositivos.
- **Sin feedback pedagógico del resultado al plan**: activity → result → mastery → recompute del plan: la cadena está cortada en los lectores.
- **Dani**: contexto pedagógico real (mastery, memoria, plan) vacío → la tutoría se aplica a un contexto ciego.
- **Badges por mastery nunca se otorgan** → gamificación no premia el progreso real.
- **Predicción de riesgo** devuelve siempre "healthy" → falsa sensación de seguridad en padres.

---

## 11. OPORTUNIDADES DE MARKETING (desde evidencia real)

- **Propuesta única existente**: Dani 2.0 con memoria estructurada + guardas de edad + detección de crisis + email a padres — es diferenciador real, casi sin competencia local. Promocionable hoy.
- **Skill Passport con competencies MEN Colombia** (90 competencies seed) — alineado con currículo oficial; fuerte para venta B2B/B2G.
- **Future Explorer** conecta mastery real con carreras — historia de producto atractiva (contenido estático a mejorar).
- **Parent dashboard con realtime y bienestar** — argumento de retención pagada.
- **Datos verificables**: la plataforma SÍ persiste puntos, misiones, badges, VAK, grades — se pueden crear reportes de progreso reales para marketing educativo.
- **Riesgo de marketing**: hasta reparar Early Warning/insights, NO prometer "detección temprana" ni "adaptación en tiempo real" — hoy sería falsa publicidad.

---

## 12. SCORE (0–10)

| Dimensión | Score | Justificación |
|---|---|---|
| **Product** | 4 | Visión clara, 22 features mapeadas, pero 0 VERIFIED |
| **UX** | 4 | UI rica y pulida; fallos silenciosos y defaults genéricos la degradan |
| **UI** | 7 | Diseño cuidado (framer-motion, a11y trabajada, dashboards completos) |
| **Learning** | 3 | VAK/plan/mastery no cierran el ciclo pedagógico |
| **AI** | 5 | DeepSeek real + orquestador Dani real; contexto roto limita la calidad |
| **Adaptive** | 2 | Motor rule-based real pero inputs skew y columnas rotas; sin prueba E2E |
| **Parent** | 4 | UI fuerte; insights casi vacíos |
| **Gamification** | 4 | Misiones/badges/puntos reales; catálogos estáticos; badges-mastery muertos |
| **Analytics** | 1 | Tablas inexistentes, router sin montar, splits hardcoded |
| **Security** | 1 | RLS abierta + IDOR + admin por metadata editable + consent fail-open |
| **Differentiation** | 6 | Dani 2.0, Passport MEN, wellbeing: genuinamente diferenciadores |
| **Commercial Readiness** | 1 | CI roja, backend sin boot local, migraciones rotas, sin E2E, deploy manual |

**Promedio: 3.5/10**

---

## 13. REQUISITOS PARA DESBLOQUEAR (orden sugerido)

1. **Fix env**: unificar `SUPABASE_SERVICE_ROLE_KEY`/`SUPABASE_SERVICE_KEY`; verificar boot local + 28/28 suites backend.
2. **Fix migraciones**: corregir guards (Bug A), `BEGIN/COMMIT` en DO blocks (Bug B), schema-qualified guard (Bug C); validar en staging con `supabase db push` antes de tocar main (evitar repetir el desastre del workflow).
3. **Fix RLS/IDOR**: revertir 049 (FOR ALL), ownership checks en los endpoints `/adaptive/*`, `/parent/*`, `/gamification/*`; admin desde `app_metadata`.
4. **Fix schema-vs-código**: alinear las 6+ columnas (mastery_level, plan_json, dani_memory tipada, timetable_slots) o los motores.
5. **Fix token**: escribir `sb_auth_token` o unificar el helper de auth (sessionStorage).
6. **Montar routers muertos o eliminar**: metrics, predictions, achievements, parentChat, multiplayer.
7. **Entorno de staging**: seed de 2 estudiantes A/B + backend vivo → recién entonces ejecutar E2E, Adaptation, Parent, Persistence y Visual tests (procedimiento §6–§10).
8. **CI verde** antes de cualquier feature nueva.

---

## ANEXO — Evidencia clave (file:line)

- `edutechlife-backend/src/services/daniOrchestrator.js:17` — `SUPABASE_SERVICE_ROLE_KEY` (8 servicios)
- `edutechlife-backend/src/test-setup.js:2` — `SUPABASE_SERVICE_KEY` (mismatch)
- `supabase/migrations/049_fix_rls_to_authenticated.sql:6-13` — `FOR ALL TO authenticated USING(true)`
- `supabase/migrations/042_student_timetable.sql:4` — guard `table_name = 'IF'` + `BEGIN;` en DO block
- `edutechlife-frontend/src/context/SmartBoardKidsContext.jsx:418` — `sb_auth_token` (nunca escrito)
- `edutechlife-backend/src/services/badgeEngine.js:18` — `mastery_score` (inexistente)
- `edutechlife-backend/src/services/earlyWarning.js:54,89` — `mastery_score`/`attempts`
- `edutechlife-backend/src/services/parentInsights.js:33,44,49` — `mastery_score`/`plan_data`/`activity_sessions`
- `edutechlife-backend/src/app.js:120-129` — routers montados (5 no montados)
- `edutechlife-frontend/src/hooks/useAdaptiveEngine.js:9` — token fantasma
- `edutechlife-frontend/src/components/kids-dashboard/RutaAprendizaje.jsx:71` — `hasPlan = false`
- `.github/workflows/deploy.yml` — `continue-on-error: true` en migrate-db
