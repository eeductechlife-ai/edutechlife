# AUDIT.md — SmartBoard 3.0 Technical Audit
> Sprint 0 · Fecha: 2026-08-25

---

## 1. Stack Actual

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 5 + Zustand + Tailwind CSS + Framer Motion |
| Backend | Node.js + Express (Render) |
| Base de datos | Supabase PostgreSQL + RLS |
| Auth | Clerk (JWT) + parental consent custom flow |
| IA | DeepSeek (`deepseek-chat`) vía backend proxy |
| TTS | Google TTS (voz de Dani) |
| Pagos | Stripe |
| Analytics | PostHog (configurado, sin instrumentar SmartBoard) |
| Deploy frontend | Vercel (integración Git directa) |
| Deploy backend | Render (webhook) |

---

## 2. Árbol de Archivos — kids-dashboard

```
kids-dashboard/                              (133 archivos totales)
├── SmartBoardKidsDashboard.jsx        413 L  ← shell principal, 13 tabs
├── HeroSection.jsx                    519 L
├── GradeScanner.jsx                 1,355 L  ← MONOLITO ⚠️
├── OralExamSimulator.jsx              968 L  ← candidato a split
├── FlashcardSystem.jsx/               879 L  ← candidato a split
├── SmartBoardAnalytics.jsx            495 L
├── ExamPrep.jsx                       498 L
├── DaniTutorChat.jsx                  494 L
├── PointsRewardsSystem.jsx            415 L
├── AgeAdaptiveAnalytics.jsx           400 L
├── PersonalizedPlan.jsx               334 L
├── OnboardingWizard.jsx               312 L
├── VAKDiagnosticEnhanced.jsx          288 L
├── ImprovementPlan.jsx                287 L
├── ProgressDashboard.jsx              248 L
├── MisionDelDia.jsx                   213 L
├── AgeAdaptiveOralExam.jsx            322 L
│
├── daniTutorChat/                       ← módulo bien estructurado
│   ├── useDaniSendMessage.js          385 L
│   ├── useDaniChat.js                 259 L
│   ├── useDaniWelcome.js              120 L
│   ├── DaniVoiceController.js          46 L
│   ├── components/  (5 componentes)
│   └── styles/      (4 CSS files)
│
├── smartBoardProgress/
│   ├── ProgressDashboard.jsx          248 L
│   ├── gamificationData.js            115 L
│   └── components/ (4 componentes)
│
├── schedule/        (editor + scanner + vista semanal)
├── examPrep/        (lista + detalle + hook)
├── flashcardSystem/ (deck + importer + multiplayer stub)
├── improvementPlan/ (plan + hook)
├── onboarding/      (wizard)
├── profile/         (grade selector)
├── news/            (tech feed)
└── smartBookReader/ (reader + controles)
```

**12 archivos de tests** distribuidos en sub-módulos.

---

## 3. Rutas Frontend

| Path | Componente | Auth |
|------|-----------|------|
| `/smartboard` | SmartBoardLandingPage | No |
| `/smartboard/consent` | SmartBoardConsentGate | No |
| `/smartboard/login` | SmartBoardLoginRedirect | No |
| `/smartboard/app` | SmartBoardKidsDashboard | Sí (rol `smartboard`) |
| `/smartboard/padres` | SmartBoardParentDashboard | Sí (rol `smartboard`) |
| `/smartboard/estadisticas` | SmartBoardStatsPage | Sí |
| `/sign-up/smartboard` | SmartBoardSignUpPage | No |
| `/conoce-smartboard` | SmartBoardInfoPage | No |

Todas las rutas protegidas usan `<RoleProtectedRoute requiredRole="smartboard">`.

---

## 4. Modelo de Datos Actual

### Tablas Supabase (SmartBoard scope)

| Tabla | Propósito |
|-------|-----------|
| `students` | Perfil base: grado, calificaciones JSON, avatar, auth_id |
| `points_history` | Entradas de XP ganados |
| `vak_results` | Resultado del diagnóstico VAK |
| `sessions` | Inicio/fin de sesión por visita |
| `learning_streaks` | Racha actual y mejor racha |
| `achievements` | Logros desbloqueados |
| `smartboard_settings` | Preferencias UI (dark mode, etc.) |
| `smartboard_kids_data` | Blob JSON legado — leído por parent dashboard ⚠️ |
| `activity_log` | Log detallado de eventos de actividad |
| `student_timetable` | Cabecera de horario escolar |
| `timetable_slots` | Slots individuales de clase |
| `student_exams` | Exámenes próximos |
| `push_subscriptions` | Tokens de notificación push |
| `conversations` | Historial conversacional de Nico |
| `parent_consents` | Consentimiento parental |
| `parent_student_links` | Relación padre↔estudiante |
| `crisis_alerts` | Incidentes de detección de crisis |

**Ausentes** (requeridos para SmartBoard 3.0):

| Tabla faltante | Para qué |
|----------------|---------|
| `competencies` | Learning Graph |
| `student_competency_mastery` | Dominio por competencia |
| `learning_plans` | Planes adaptativos persistentes |
| `missions` | Catálogo de misiones dinámico |
| `badges` | Micro-credenciales verificables |
| `early_warnings` | Alertas tempranas |
| `dani_memory` | Memoria persistente de Dani en DB |
| `skill_passport` | Pasaporte de competencias |
| `feedback_log` | Feedback emocional post-actividad |

---

## 5. Integración de IA — Estado Actual

### Proveedor
**DeepSeek** (`deepseek-chat`, `api.deepseek.com`) — todo pasa por backend proxy.

### Dos patrones de llamada

**Dani streaming (autenticado, con consentimiento parental):**
- Frontend → `callDaniChatStream()` → `POST /api/smartboard/chat/stream`
- Guards: `requireAuth` + `requireVerifiedParentalConsent`
- Backend: `detectCrisis()` + SSE stream

**Deepseek general (no streaming):**
- Frontend → `callDeepseek()` → `POST /api/chat`
- Usado por: OralExamSimulator, StudyPodcast, ImprovementPlan
- **⚠️ No aplica middleware de consentimiento parental**

### Arquitectura actual de prompt de Dani

```
Base prompt (PROMPT_DANI_EXPERTO o PROMPT_TUTOR_TAREAS)
  + Memory injection (de localStorage <memoria> tags)
  + Communication style adaptation
  + Socratic mode (si activo)
  + Student context block (VAK, grado, XP, racha, materias)
  + Schedule context (clases hoy, próxima clase, exámenes)
  + Document context (si subió archivo)
  + Emotional/crisis routing
  + Chat history (últimos 15 mensajes)
  + User message
```

Memoria de Dani: **localStorage solamente** — se pierde al limpiar caché o cambiar dispositivo.

---

## 6. Gamificación — Estado Actual

| Elemento | Estado |
|----------|--------|
| XP / Puntos | ✅ Funciona — tabla `points_history` |
| Niveles (5) | ✅ Thresholds en context |
| Rachas diarias | ✅ Tabla `learning_streaks` |
| Misiones diarias | ✅ Determinísticas por fecha, 2-3 por día |
| Recompensas cosméticas | ✅ 6 ítems hardcodeados (500–3000 pts) |
| Badges/logros UI | ⚠️ Tabla `achievements` existe, sin writeback visible |
| Misiones dinámicas | ❌ Ausente |
| Leaderboard | ❌ Ausente |
| Multiplayer | ❌ Stub sin integrar (`multiplayerFlashcards.js`) |
| Skill Passport | ❌ Ausente |
| Micro-credenciales | ❌ Ausente |

---

## 7. Analytics — Estado Actual

- **PostHog** configurado globalmente (`posthog.config.js`) con Web Vitals.
- **Cero** eventos de PostHog dentro de `kids-dashboard/`.
- `useActivityTracker.js` escribe en `activity_log` Supabase — datos comportamentales existen.
- No hay dashboards internos de métricas de aprendizaje.
- No hay funnel de activación/retención instrumentado.

---

## 8. Seguridad para Menores — Estado Actual

| Control | Estado |
|---------|--------|
| Consentimiento parental (email) | ✅ Flujo completo |
| Role-gated routes | ✅ `requiredRole="smartboard"` |
| Crisis detection en Dani stream | ✅ Backend detecta + alerta |
| AISafetyGateway independiente | ❌ Ausente |
| Filtros de contenido en `/api/chat` | ❌ Ausente para llamadas no-streaming |
| Control parental granular | ❌ Ausente |
| Eliminación de datos (GDPR) | ✅ Endpoint `DELETE /api/smartboard/delete-user-data` |
| Feature flags por edad | ❌ Ausente |

---

## 9. Deuda Técnica Identificada

| # | Deuda | Severidad |
|---|-------|-----------|
| 1 | `GradeScanner.jsx` 1,355 líneas — monolito con camera, OCR, history, edición | Alta |
| 2 | Patrón dual de datos: blob `smartboard_kids_data` vs tablas normalizadas | Alta |
| 3 | Memoria de Dani en localStorage — sin persistencia en DB | Alta |
| 4 | `callDeepseek()` general no aplica consent middleware | Alta ⚠️ |
| 5 | Cero instrumentación PostHog en SmartBoard | Media |
| 6 | Dos system prompts de Dani divergentes (backend vs frontend) | Media |
| 7 | `schedule/index.jsx` es 1 línea — refactor incompleto | Baja |
| 8 | `multiplayerFlashcards.js` — stub sin integrar | Baja |
| 9 | Sin error boundaries en contenido de tabs individuales | Media |
| 10 | Recompensas cosméticas hardcodeadas, sin catálogo dinámico | Media |

---

## 10. Componentes: Reutilizar vs Reemplazar

### Reutilizar sin cambios
- `SmartBoardKidsContext` + hooks — base sólida
- `daniTutorChat/` completo — bien estructurado, funciona
- `VAKDiagnosticEnhanced.jsx` — completo y testeado
- `MisionDelDia.jsx` — limpio y aditivo
- `gamificationData.js` — funciones utilitarias limpias
- `OnboardingWizard.jsx` — funcional
- `useSmartBoardSupabase.ts` — buena capa de acceso normalizada
- `useTimetable.js` — CRUD completo
- Backend `smartboard.js` routes — comprensivo y testeado

### Refactorizar (split)
- `GradeScanner.jsx` → `GradeScannerCamera` + `GradeScannerOCR` + `GradeHistory`
- `FlashcardSystem.jsx` → separar deck management de session logic
- `OralExamSimulator.jsx` → separar question generation de session state

### Extender sustancialmente
- `ImprovementPlan` + `PersonalizedPlan` → `AdaptiveLearningEngine` persistente
- `PointsRewardsSystem.jsx` → agregar writeback de achievements, catálogo dinámico
- `SmartBoardAnalytics.jsx` → instrumentar PostHog, métricas de aprendizaje reales
- Sistema de memoria de Dani → migrar localStorage → Supabase `dani_memory`
- Parent dashboard → migrar de blob `smartboard_kids_data` a tablas normalizadas

---

## 11. Arquitectura Actual vs Propuesta

### Actual (SmartBoard 2.x)
```
UI Tabs
  → SmartBoardKidsContext (estado local)
  → callDeepseek() / callDaniChatStream()
  → Backend Express
  → DeepSeek API
  → Supabase (tablas dispersas + blob legado)
```

### Propuesta (SmartBoard 3.0)
```
UI (Design System unificado)
  → SmartBoardKidsContext (mejorado)
  → AdaptiveLearningEngine (nuevo servicio)
    → StudentProfile (dinámico)
    → LearningGraph (competencias → habilidades)
    → getNextBestAction()
    → generateDailyPlan()
  → Dani Orchestrator (mejorado)
    → StudentContext builder
    → AISafetyGateway (nuevo)
    → DeepSeek (stream)
    → DaniMemory en DB
  → EarlyWarningEngine (nuevo)
  → GamificationEngine (extendido)
    → MissionEngine + BadgeEngine + SkillPassport
  → NotificationEngine (nuevo)
  → Analytics (PostHog instrumentado)
  → Supabase (schema extendido, sin blob legado)
```

---

## 12. Riesgos de Migración

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| Migración blob → tablas normalizadas rompe parent dashboard | Alta | Alto | Mantener blob en sync durante transición |
| Memoria Dani localStorage → DB pierde datos de usuarios activos | Media | Medio | Migración one-time al primer login |
| Consentimiento parental no cubre nueva endpoint `/api/chat` | Alta | Alto | Aplicar consent middleware inmediatamente |
| Nuevas tablas de schema no aplicadas en producción | Media | Alto | Aplicar migrations vía Supabase CLI en staging primero |
| Feature Flags ausentes → imposible rollout progresivo | Alta | Medio | Implementar en Sprint 1 antes de nuevos módulos |

---

## 13. Funcionalidades Actuales a Reutilizar en 3.0

✅ Dani streaming chat completo  
✅ VAK diagnostic  
✅ Oral exam simulator (base)  
✅ Flashcard system (base)  
✅ Grade scanner (tras split)  
✅ Schedule editor + timetable CRUD  
✅ Exam prep tracker  
✅ Parental consent flow  
✅ Crisis detection  
✅ Points/XP/streaks engine  
✅ Daily missions (MisionDelDia)  
✅ Progress dashboard  
✅ Onboarding wizard  
✅ Parent dashboard (tras migración de data source)  
✅ Smart book reader  
✅ Tech news feed  
✅ Age-adaptive rendering patterns  

---

*Próximo paso: Sprint 1 — Design System + arquitectura base. Ver `tasks/plan.md`.*
