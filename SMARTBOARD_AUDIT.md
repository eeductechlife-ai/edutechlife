# SMARTBOARD 3.0 — Auditoría Técnica (FASE 0)

> Fecha: 2026-08-26 · Auditor: Claude (verificado contra el árbol de código real)
> Premisa del brief: *"el producto sigue pareciendo una plataforma con tarjetas"*.
> **Hallazgo principal: FALSO en su mayoría.** ~80% de la arquitectura P0 de SmartBoard 3.0
> **ya está implementada y viva** en el código. El trabajo restante es de **cobertura,
> instrumentación y QA**, no de construcción desde cero.

---

## 1. Estado actual (arquitectura real)

| Capa | Tecnología | Verificado en |
|---|---|---|
| Frontend | React 18 + Vite 5 + Zustand + Tailwind + Framer Motion | `edutechlife-frontend/` |
| Backend | Node/Express | `edutechlife-backend/src/routes/` |
| BD | Supabase PostgreSQL + RLS | `useSmartBoardSupabase.ts`, migraciones |
| Auth | JWT (sessionStorage `auth_token`) + consentimiento parental | `ParentalConsentBlocker`, `requireVerifiedParentalConsent` |
| IA | DeepSeek vía `callDeepseekSmartboard()` → `/api/smartboard/ai` | capa server-side, nunca UI→proveedor |
| Analítica | PostHog vía `lib/analytics.track()` | `config/posthog.config.js` |

**Ruta real del dashboard del estudiante:** `SmartBoardKidsDashboard.jsx` →
`CinematicContent.jsx` (renderiza tabs con `DashboardErrorBoundary` por tab) →
tab `inicio` = `RutaAprendizaje` + `HeroSection` + `MisionDelDia` + `FutureExplorer` (edad≥10) + `PointsRewardsSystem`.

**Ruta del panel de padres:** `SmartBoardParentDashboard.jsx` (ruta separada, login por rol `parent`).

---

## 2. Mapa CURRENT → TARGET (los 87 puntos del brief)

### ✅ YA IMPLEMENTADO (conservar / evolucionar)

| # Brief | Módulo pedido | Implementación real |
|---|---|---|
| 6, 39 | Design System centralizado | `kids-dashboard/ui/`: `Button, Card, ProgressBar, Badge, MetricCard, AlertCard, DaniMessage, RecommendationCard` + `index.js` |
| 8 | Hero "Tu ruta de aprendizaje" | `HeroSection.jsx` (534 líneas) + `RutaAprendizaje.jsx` |
| 9, 10 | NextBestAction / "¿Qué hago hoy?" | `WhatDoIDoToday.jsx` (selector 5/10/20/30 min) wired en HeroSection vía `useAdaptiveEngine` |
| 13 | Adaptive Learning Engine | **Backend `services/adaptiveLearning`** + endpoints `/adaptive/{state,next-action,daily-plan,weekly-plan,mastery,warnings}` + hook `useAdaptiveEngine.js` |
| 12 | Learning Graph / competencias | `useCompetencyTracking.js`, endpoints `/adaptive/mastery` |
| 15 | Mi Plan (diario/semanal) | `fetchDailyPlan` / `fetchWeeklyPlan`, `improvementPlan/`, `PersonalizedPlan.jsx` |
| 16–20 | Dani contextual + memoria | `daniTutorChat/`, `useDaniMemory.js`, `buildMemoryInjection` (inyecta perfil, objetivos, fortalezas, dificultades) |
| 21, 22 | Early Warning + Semáforo | `useEarlyWarnings.js`, `AcademicSemaphore.jsx`, endpoint `/adaptive/warnings` |
| 23–26 | Parent Intelligence + reportes | `SmartBoardParentDashboard.jsx` (6 secciones), `useParentInsights.js`, `WeeklyReportCard`, `GradeReportCard` |
| 27 | Calificaciones inteligentes | `GradeScanner.jsx` + `useGradeScanner.js` + `GradeAnalysisPlan.jsx` (tendencia, plan, acción) |
| 28 | Horario inteligente | `schedule/`, `useTimetable`, `useExamReminders` |
| 29, 30 | Gamification / Misiones | `PointsRewardsSystem`, `MissionsView`, `MisionDelDia`, rachas (`streak`) |
| 31, 32 | Pasaporte de competencias / badges | `SkillPassport.jsx` + `useSkillPassport` (vive en `ProgressDashboard`) |
| 33, 34 | Mi Futuro / Future Missions | `FutureExplorer.jsx` (usa intereses + `passport`) |
| 37 | UX por edad | `useAgeAdaptiveDesign.ts`, `AgeAdaptive{Analytics,OralExam,PointsRewards}.jsx`, `ageGroup` early/middle/senior |
| 45, 46 | Seguridad menores + AI safety | `ParentalConsentBlocker`, `SmartBoardConsentGate`, `requireVerifiedParentalConsent`, `CrisisResourcesModal` |
| 47 | IA desacoplada | `callDeepseekSmartboard()` — UI nunca llama al proveedor directo |
| 53 | Feedback 😊😐😣 | `OralExamResults.jsx` (implementado esta sesión) |
| 58–60 | Onboarding momento-WOW | `OnboardingWizard.jsx` (grado→objetivo→VAK→horario→notas) + `OnboardingGuide` |

### 🟡 PARCIAL (existe pero incompleto)

| # Brief | Qué falta |
|---|---|
| 43 | **Analítica de aprendizaje/producto.** Solo 4/17 eventos instrumentados (`competency_updated`, `dani_opened`, `dani_message_sent`, `plan_generated`). Faltan 13. |
| 49 | **Feature flags declarados pero muertos.** `FEATURE_FLAGS` existe en `kidsDashboardConfig.js` (todos `false`) y `useFeatureFlag.js` — pero **ningún componente los consume**. Los módulos 3.0 se renderizan incondicionalmente (por eso ya son visibles). |
| 11 | Smart Profile: perfil dinámico existe en `daniMemory.studentProfile` pero no hay una pantalla `/profile` consolidada (solo `profile/GradeSelector.jsx`). |
| 42 | NotificationEngine: hay `useExamReminders` (recordatorios de examen) pero no un motor de notificaciones unificado estudiante/padre. |

### 🔴 NO IMPLEMENTADO (P2 / fuera del alcance de código inmediato)

| # Brief | Nota |
|---|---|
| 50, 51 | Admin/CMS para materias/competencias/actividades — no existe panel de contenido. |
| 54–57 | Modo recuperación / profundización / MASTERED→PRACTICE→TRANSFER explícito — la lógica de mastery existe en backend pero sin estos modos formales. |
| 7–11, 26–36 (comercial) | Mercado, CAC, campañas — **no es código**, es go-to-market. |

---

## 3. Problemas encontrados

- **Producto:** la percepción de "plataforma con tarjetas" viene de que el tab `inicio` apila componentes; la *lógica* adaptativa ya existe pero compite visualmente con cards estáticas (PointsRewards al mismo nivel que la ruta).
- **UX:** jerarquía del `inicio` — NextBestAction/Ruta deberían dominar sobre métricas.
- **Datos/Analítica:** 13 eventos del punto 43 sin instrumentar → no se puede medir el embudo (registro→diagnóstico→misión→reporte al padre).
- **Arquitectura:** `FEATURE_FLAGS` es andamiaje muerto — o se cablea o se elimina para no confundir.
- **Seguridad:** correcta (consentimiento parental + IA server-side). Sin hallazgos críticos.
- **Performance:** bundles grandes (>250 kB varios chunks) — ya hay lazy-loading por tab.

---

## 4. Clasificación de funcionalidades existentes

- **Conservar:** design system `ui/`, adaptive engine, Dani + memoria, parent dashboard, consentimiento.
- **Evolucionar:** jerarquía visual del `inicio` (dar protagonismo a Ruta/NextBestAction).
- **Reemplazar:** nada crítico.
- **Eliminar:** `FEATURE_FLAGS` muerto (o cablearlo).
- **Integrar:** instrumentación de analítica en el loop existente.

---

## 5. Recomendación de ejecución (realista)

El brief pide "no construir las 40 features de golpe; primero diagnóstico". Diagnóstico
entregado. Dado que P0 ya existe, el mayor valor **no es más código nuevo**, sino:

1. **P1 — Instrumentar los 13 eventos de analítica faltantes** (punto 43/44). Contenido, bajo riesgo, medible.
2. **P1 — Decidir feature flags:** cablearlos (gating real por usuario desde Supabase) o eliminarlos.
3. **Evolución UX del `inicio`:** subir Ruta + NextBestAction, bajar métricas (punto 40).
4. **P2 — Smart Profile screen, NotificationEngine unificado, Admin/CMS** (esfuerzo mayor, planificar aparte).

> Conclusión: SmartBoard **ya es** un sistema de acompañamiento adaptativo, no una plataforma de tarjetas.
> La transformación 3.0 está en gran parte hecha; el trabajo pendiente es de **medición, jerarquía visual y CMS**.

---

## 6. FASE 1–2 IMPLEMENTADAS (2026-08-26)

Se ejecutaron los 4 slices aprobados por el usuario ("todo"). Cada uno verificado con build + navegador.

### Slice 1 — Analítica: 13 eventos faltantes (§43/44)
- **Nuevo:** `src/lib/analyticsEvents.js` — catálogo central `LEARNING_EVENTS` / `PRODUCT_EVENTS` (fuente única).
- **Instrumentado:**
  - `user_registered` → `SmartBoardSignUpPage.jsx` (parent-register OK)
  - `profile_completed` → `OnboardingWizard.jsx` (onboarding done)
  - `diagnostic_started` / `diagnostic_completed` → `VAKDiagnosticEnhanced.jsx`
  - `mission_started` → `MissionsView.jsx`; `mission_completed` / `badge_unlocked` → `useSmartBoardActions.js`
  - `activity_started` / `activity_completed` → `OralExamSimulator.jsx`
  - `parent_report_viewed` → `SmartBoardParentDashboard.jsx` (mount)
  - `alert_generated` → `useEarlyWarnings.js`
  - `subscription_started` / `subscription_cancelled` → `routes/index.jsx`
- **Comportamiento nuevo:** el embudo registro→perfil→diagnóstico→misión→actividad→reporte-al-padre queda medible en PostHog.

### Slice 2 — Jerarquía UX del `inicio` (§40)
- **`CinematicContent.jsx`:** reordenado tab `inicio` → **HeroSection (saludo + progreso + NextBestAction) primero**, luego RutaAprendizaje, MisionDelDia, FutureExplorer, métricas al final.
- **BEFORE:** RutaAprendizaje encabezaba, Hero segundo. **AFTER:** Hero (con "¿Qué hago hoy?") protagoniza.

### Slice 3 — Feature flags funcionales (§49)
- **`useFeatureFlag.js`:** ahora resuelve override por `localStorage` (`sb_flag_<name>`) > config → rollout progresivo / QA sin redeploy. Nuevo export `isFeatureEnabled()`.
- **`kidsDashboardConfig.js`:** flags de módulos ya lanzados = `true` (adaptive_engine, skill_passport, future_explorer, early_warning); no construidos = `false`.
- **Consumidor real:** `CinematicContent.jsx` gate de FutureExplorer en `isFeatureEnabled("future_explorer")` (default true → sin regresión, pero el flag ya vive).

### Slice 4 — Smart Profile screen (§11)
- **Nuevo:** `src/components/kids-dashboard/profile/SmartProfile.jsx` — perfil dinámico consolidado con el design system `ui/` (Card/Badge/MetricCard/ProgressBar).
- **Datos (no hardcodeados):** identidad (nombre/edad/grado/colegio/ciudad), métricas (puntos/racha), objetivo (parentGoal), intereses, estilo VAK como *señal complementaria*, fortalezas/dificultades **derivadas de notas reales**, progreso por materia.
- **Navegación:** nueva pestaña `perfil` → whitelist (`SmartBoardKidsDashboard.jsx` ×2), renderer (`CinematicContent.jsx`), categoría "Progreso" + labels (`kidsDashboardConfig.js`).
- **Ruta:** `/smartboard?tab=perfil`.
- **Verificado en navegador:** TopBar "Mi Perfil", subnav Progreso activa, tarjeta de identidad + métricas + fortalezas (Ed. Religiosa 5.0…) + a-reforzar (Historia 4.0…) + 8 barras de progreso. Screenshot capturado. 0 errores JS.
- **Enriquecido (2ª iteración):** sección **📅 Hábitos de estudio** (días activos/7 desde `streakLog`, min activos, badge de constancia) y **🕑 Actividad reciente** (últimas 6 entradas de `pointsHistory` con puntos + tiempo relativo). Verificado en navegador: `2/7 días`, `108 min`, "En progreso", lista de actividad. Cubre §11 completo (hábitos + historial).

### Verificación global
- `vite build` ✅ 74s, 255 entradas (SmartProfile como chunk lazy).
- ESLint ✅ 0 errores (solo warnings preexistentes).
- Navegador ✅ SmartProfile visible y navegable; solo errores 401 de backend (entorno de prueba, ajeno a estos cambios).

### Slice 5 — NotificationEngine: triggers de dominio (§42)
- **Auditoría:** la infra de notificaciones **ya existía** (`NotificationContext` con Supabase+localStorage, `NotificationPanel`, `useExamReminders`, `useAchievementNotifications`). No se duplicó.
- **Nuevo:** `src/hooks/useSmartBoardNotifications.js` — genera triggers de dominio SmartBoard con **dedup diario (anti-spam §42)**, gate en `userId` y stamp **solo tras creación exitosa** (reintenta si la auth no está lista):
  - *Misión del día lista* → "🎯 Tu misión de hoy está lista" (si hay misión incompleta).
  - *Oportunidad de refuerzo* → "💡 …necesita atención" (materia con nota < 3.5) + `track(alert_generated)`.
- **Superficie visible (nuevo):** campana en el TopBar de niños (`components/TopBar.jsx`) con `unreadCount` real de `useNotification()` → abre el `NotificationPanel` existente. Antes el dashboard de niños **no tenía campana**.
- **Cableado:** `useSmartBoardNotifications()` en `SmartBoardKidsDashboard.jsx` (junto a `useExamReminders`, dentro del `NotificationProvider`).
- **Bug encontrado y arreglado (causa raíz):** al probar en navegador, la notificación no persistía. El diagnóstico con logs reveló que `createNotification` (compartido) llamaba a `supabase.insert()` **sin timeout**; con Supabase inaccesible en el entorno de prueba, la promesa **quedaba colgada para siempre** → `inFlight` bloqueado, notificación perdida. Afectaba a **todos** los productores (exam reminders, achievements, SmartBoard).
- **Fix (`NotificationContext.jsx`):** `createNotification` ahora hace `Promise.race([insert, timeout(5s)])` con **fallback a localStorage** en timeout, error de RLS, o excepción inesperada (helper `saveLocalNotification`) → nunca cuelga ni pierde una notificación.
- **Verificado en navegador (post-fix):** campana con badge `2`, panel muestra **"🎯 Tu misión de hoy está lista" · Hace 1 min**. Stamp de dedup escrito. End-to-end funcionando.

### Slice 6 — Rediseño visual del panel (design system SmartBoard)
- **Nuevo:** `components/SmartBoardNotificationPanel.jsx` — reemplaza al `NotificationPanel` de IALab (que traía colores petroleum/corporate, iconos FontAwesome y rutas `/ialab`). Usa el design system SmartBoard (`smartboardTheme.js`): header con **gradiente brand**, badges de emoji con **gradiente de categoría + glow** por tipo (🎯 misión→ámbar, 💡 refuerzo→gold, 📝 examen→coral, 📚 lección→teal, 🏆 logro→gold…), radios chunky, **dark-mode aware**, animación Framer, estados vacío/carga, accesible (role/aria/teclado/Esc).
- **Enrutado real:** click en una notificación con `metadata.tab` navega a la pestaña SmartBoard vía `onNavigateTab` (no rutas IALab).
- **Fix de merge local/remoto (`NotificationContext.jsx`):** `fetchNotifications` ahora fusiona las notificaciones `local_` (fallback localStorage) con las remotas — antes el fetch de Supabase las descartaba.
- **Pulido:** se elimina el emoji inicial duplicado del título (el badge ya lo lleva) con `stripLeadingEmoji`.
- **Verificado en navegador:** panel on-brand con badges de categoría distintos, jerarquía limpia, sin emoji duplicado. Wired en `TopBar.jsx` con `darkMode` + `onNavigateTab`.

### Slice 6b — Bug de posicionamiento (causa raíz real)
- **Síntoma:** el panel "no se ajustaba bien" — deformaba el TopBar (altura 534px en vez de 78px) y la campana se salía de su fila.
- **Diagnóstico (medición DOM):** el panel tenía la clase `absolute` pero su `position` computado era `relative`. Culpable: regla global `styles/a11y.css` → `[role="dialog"] { position: relative }`. El panel usaba `role="dialog"`, así que la regla lo sacaba del posicionamiento absoluto → entraba al flujo e inflaba el contenedor de la campana (320×509) y el TopBar.
- **Fix:** `role="dialog"` → **`role="region"`** (semánticamente correcto: es una región etiquetada, no un modal que atrapa foco) → evita la regla a11y sin pelear especificidad. Añadido `aria-haspopup`/`aria-expanded` a la campana.
- **Verificado (medición post-fix):** `panelPosition: absolute`, `topbarHeight: 78`, `bellWrap: 44×48`. TopBar en una fila correcta, panel flotando como dropdown dentro del viewport.

### Slice 7 — Calificaciones inteligentes (#27)
- **Auditoría:** las notas mostraban solo el número; el brief pide "3.8 ↑+0.3 · siguiente acción".
- **Nuevo (`SmartBoardKidsContext.jsx`):** `gradeTrend(g)` — tendencia período-sobre-período desde P1→P4 (`{delta, dir: up/down/flat}`); adjunta `trend` a cada materia en `subjectsWithGrades` y se expone en el contexto.
- **UI (`profile/SmartProfile.jsx`):** sección "📊 Calificaciones inteligentes" — por materia: nota + **chip de tendencia ↑/↓/→** (verde/coral/gris con delta) + barra de progreso + botón **"💪 Reforzar con Dani →"** (navega a `oral`) para materias débiles (<3.5).
- **Verificado:** `vite build` exit 0, ESLint sin errores, sección renderiza en `?tab=perfil` (confirmado por `get_page_text`), `onTabChange` cableado desde `CinematicContent`. Las tendencias aparecen con ≥2 períodos ingresados; degrada bien sin notas.

### Slice 8 — Modo recuperación / profundización · MASTERED→PRACTICE→TRANSFER (#54–57)
- **Nuevo (`adaptiveNextStep.js`):** función pura `getNextStep({score, feedback})` → devuelve `{mode, emoji, title, why, cta, tab}`:
  - **recovery** (score<60 o "difícil") → "Repasemos con calma" → ejemplo más simple con Dani.
  - **transfer** (score≥80 y "fácil") → "¡Sube de nivel!" → reto avanzado (examenes).
  - **practice** (resto) → "Asegurémoslo" → una práctica más.
- **UI (`OralExamResults.jsx`):** reemplaza el mensaje estático post-examen por una **tarjeta accionable** con color por modo (ámbar/azul/verde), WHAT/WHY y CTA que navega según el modo.
- **Verificado:** `adaptiveNextStep.test.js` — **7/7 tests** (vitest) cubren recuperación por nota baja y por "difícil", transfer solo con dominio+fácil, práctica intermedia, clamp de rangos; `vite build` exit 0; ESLint 0 errores.
- **Alcance:** implementado en **dos actividades** — resultados del **examen oral** (`OralExamResults`) y del **sistema de flashcards** (`FlashcardResults`), compartiendo `getNextStep` + `MODE_STYLE` (sin duplicar). En flashcards los modos mapean a los handlers disponibles (recovery/transfer → Dani, practice → repetir). Falta detección de patrones multi-intento (#54) — parcial.

### Slice 9 — NextStepCard compartido (§39, calidad)
- Extraído `ui/NextStepCard.jsx` (design system) — elimina ~30 líneas de JSX duplicado entre `OralExamResults` y `FlashcardResults`. Ambos lo consumen. Build + 7/7 tests OK.

### Slice 10 — Explora 2.0 (#35): contenido → reto → Dani contextual
- **`news/TechNewsFeed.jsx`:** cada artículo (modal) tiene ahora un botón **"🤖 Rétame con Dani sobre esto →"** que llama `setDocumentForDani({title, subject, summary, tutoringQuestions})` con preguntas de pensamiento crítico + `dispatchEvent("smartboard:open-dani")` — el patrón probado de GradeAnalysisPlan/FlashcardSystem.
- **Verificado en navegador:** botón renderiza en el modal (screenshot + read_page ref_96); el mecanismo `smartboard:open-dani` abre el chat de Dani (`hasChatInput:true`) y su saludo referencia el contexto tech. Build + ESLint 0 errores.
- Convierte lectura pasiva en acción vinculada a competencias (pensamiento crítico, exploración).

### Pendiente (P2 — planificar aparte)
Admin/CMS de contenidos (#50) + modelo de contenidos etiquetados (#51), ChallengeEngine (#36), detección de dificultad multi-intento (#54), gating de feature flags por usuario desde Supabase (#49).
