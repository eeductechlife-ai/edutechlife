# SmartBoard 3.0 — Plan de Implementación
> Basado en AUDIT.md · 2026-08-25
> Filosofía: "Cada estudiante tiene una ruta. SmartBoard descubre la suya."

---

## Principios de Ejecución

1. **Un módulo completo a la vez** — no capas horizontales.
2. **Leer antes de tocar** — siempre inspeccionar el archivo completo antes de editar.
3. **No eliminar funcionalidad existente** sin justificación técnica documentada.
4. **Cada sprint termina con** tests pasando + UI verificada + sin regresiones.
5. **Definition of Done**: limpio + responsive + accesible + seguro + testeado + conectado a analytics.

---

## Mapa de Dependencias

```
Sprint 0: AUDIT.md (DONE)
    ↓
Sprint 1: Design System + Feature Flags + Schema DB base
    ↓
Sprint 2: Smart Profile (extiende students + onboarding)
    ↓
Sprint 3: Learning Graph (nuevas tablas competencies/mastery)
    ↓
Sprint 4: Adaptive Engine (usa Learning Graph + Smart Profile)
    ↓
Sprint 5: Mi Plan + "¿Qué hago hoy?" (usa Adaptive Engine)
    ↓
Sprint 6: Dani 2.0 (usa Smart Profile + Learning Graph + AISafetyGateway)
    ↓
Sprint 7: Parent Intelligence (usa Smart Profile + Early Warning)
    ↓
Sprint 8: Early Warning System (usa Learning Graph + Activity Log)
    ↓
Sprint 9: Gamification 2.0 (usa Learning Graph + Missions dinámicas)
    ↓
Sprint 10: Skill Passport (usa competencias + badges)
    ↓
Sprint 11: Future Explorer (usa Smart Profile + Skill Passport)
    ↓
Sprint 12: Analytics + QA full
```

---

## Sprint 0 — Auditoría ✅

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
