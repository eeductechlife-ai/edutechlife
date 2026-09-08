# SmartBoard 3.0 — Master Product Truth

> Fecha: 2026-09-01
> Branch: recovery/foundation-phase-a
> Autor: Auditoría automatizada (3 agentes: backend, frontend, infraestructura)
> Modo: FASE 0 — Product Truth Freeze (solo lectura, sin modificaciones)

---

## 1. Identidad del Producto

SmartBoard es la plataforma de aprendizaje gamificada para niños de EdutechLife. Combina un tutor de IA (Dani), diagnóstico de estilo de aprendizaje (VAK), motor adaptativo, sistema de puntos y misiones, y un dashboard parental — todo diseñado para menores de edad bajo regulaciones COPPA/Habeas Data Colombia.

**Stack técnico verificado:**
- Frontend: React 18 + Vite 5 + Zustand + TanStack Query
- Backend: Node.js + Express + Supabase PostgreSQL
- IA: DeepSeek API (deepseek-chat)
- Auth: Supabase Auth (migrado de Clerk)
- Deploy: Vercel (frontend) + Render (backend)
- DB: Supabase PostgreSQL con RLS (project `srirrwpgswlnuqfgtule`)

---

## 2. Estado Cuantitativo

| Métrica | Valor |
|---------|-------|
| Endpoints backend | 30 |
| Endpoints con auth | 28/30 |
| Endpoints con tests de ruta | 5/30 (17%) |
| Tests backend totales | 345 |
| Tests SmartBoard | 128 |
| Migraciones SQL | 56 archivos (000-062) |
| Tablas SmartBoard-relevant | ~30 |
| Componentes React SmartBoard | ~50+ |
| Hooks Supabase (frontend) | 13 |
| Release gates PASS | 0/8 |
| Release gates PARTIAL | 7/8 |
| Release gates NOT STARTED | 1/8 |

---

## 3. Lo Que Funciona (Verificado)

### Funcionalidad Core Implementada + Testeada

1. **Autenticación Supabase** — middleware requireAuth en 28/30 endpoints, tokens via sessionStorage
2. **Perfil de estudiante** — CRUD completo con 15 tests, avatar upload
3. **Diagnóstico VAK** — 3 páginas, mutation a DB + students.vak_style update
4. **Sistema de puntos** — addPoints con optimistic update + rollback, 5 fuentes de puntos reales
5. **RLS/IDOR protection** — assertAuthIdAccess + requireStudentAccess, migraciones 060+062, 8 tests
6. **Consentimiento parental (backend)** — 27 tests, email verification, parent_student_links
7. **GDPR data deletion** — DELETE endpoint borra 8 tablas, 3 tests
8. **Weekly report (email)** — POST con preview mode, 10 tests
9. **Safety gateway** — validateInput (2000 chars, forbidden patterns), sanitizeOutput, crisis detection

### Funcionalidad Implementada Sin Tests de Ruta

10. **Dani 2.0 chat** — SSE streaming, orquestación completa, persistencia, memory — pero 0 tests de ruta
11. **Adaptive learning** — 5 endpoints, priority engine, mastery tracking — pero 0 tests de ruta
12. **Early warnings** — 5 detectores — pero 0 tests de ruta
13. **Gamification 2.0** — missions + badges engine — pero 0 tests de ruta
14. **Parent intelligence** — insight cards, learning graph — pero 0 tests de ruta

---

## 4. Lo Que NO Funciona (Defectos Verificados)

### Defectos Críticos (afectan seguridad o integridad de datos de menores)

| # | Defecto | Severidad | Evidencia |
|---|---------|-----------|-----------|
| D1 | **Rate limit ausente en /dani/chat** | CRITICAL | deepseekLimiter solo en /chat legacy; /dani/chat sin protección. Un menor o atacante puede hacer requests ilimitados a DeepSeek API | 
| D2 | **Rate limit ausente en /ai** | HIGH | POST /ai sin rate limit; client controla full messages array |
| D3 | **ParentalConsentBlocker NO bloquea** | CRITICAL | Click "Comenzar a trabajar" siempre permite acceso independientemente del verification_status del backend |
| D4 | **Fail-open consent middleware** | HIGH | requireVerifiedParentalConsent permite acceso cuando DB está caída o tabla no existe |
| D5 | **Roles basados en localStorage** | HIGH | `user_role` en localStorage determina acceso a flujos parent/student; trivialmente manipulable via DevTools |

### Defectos de Integridad de Datos

| # | Defecto | Severidad | Evidencia |
|---|---------|-----------|-----------|
| D6 | **Streaks no se persisten a DB** | MEDIUM | Frontend computa localmente pero NO escribe a learning_streaks; se pierden al cambiar dispositivo |
| D7 | **Achievements no se escriben a DB** | MEDIUM | Tabla achievements existe, useAchievements lee, pero NADA escribe. Logros efímeros |
| D8 | **UI muestra puntos inexistentes** | MEDIUM | "+200 por completar materia" y "+150 por racha diaria" se muestran pero NO están implementados |
| D9 | **Rewards 3/6 sin efecto** | LOW | Día Libre, Curso IA Básico, Certificado VAK deducen puntos sin implementación |
| D10 | **Student grades LS-only** | LOW | Grades escaneadas se pierden al cambiar dispositivo; sin endpoint dedicado |
| D11 | **Onboarding LS-only** | LOW | Se repite al cambiar dispositivo |
| D12 | **Dual persistence inconsistencies** | MEDIUM | localStorage y DB pueden divergir bajo condiciones de red inestable |

### Defectos de Cobertura

| # | Defecto | Severidad | Evidencia |
|---|---------|-----------|-----------|
| D13 | **25/30 endpoints sin tests de ruta** | HIGH | Solo 5 endpoints tienen route-level tests |
| D14 | **0 tests de sync persistencia** | MEDIUM | useSmartBoardPersistence sin tests directos |
| D15 | **0 tests de crisis flow** | MEDIUM | /chat/stream crisis detection sin tests |
| D16 | **0 tests de email service** | LOW | emailService.js sin tests directos |

---

## 5. Deuda Técnica Estructural

| # | Deuda | Impacto |
|---|-------|---------|
| T1 | **7 createClient() separados** en backend (smartboard.js, daniOrchestrator, etc.) — sin connection pooling | Performance + resource leaks |
| T2 | **Cada hook Supabase resuelve students.id** desde auth_id — extra round-trip sin cache | N+1 queries en cada operación |
| T3 | **smartboard_kids_data blob** redundante con tablas granulares | Dos fuentes de verdad para mismos datos |
| T4 | **Auth gate inconsistente** — /smartboard usa component check, /smartboard/app usa RoleProtectedRoute | Posible bypass en rutas no protegidas |
| T5 | **Token en sessionStorage** — se pierde al cerrar pestaña | UX: usuario re-autentica en cada sesión |
| T6 | **CD pipeline nunca completó** — migrate-db 12/12 fallidas | Migraciones se aplican manualmente |
| T7 | **Achievements vs Badges** — dos sistemas de logros paralelos sin integración | Confusión UX, datos fragmentados |
| T8 | **Consent token sin expiración enforced** — token generado sin TTL verificado | Tokens de consentimiento inmortales |

---

## 6. Tablas Schema-Only (No Implementadas)

Migraciones crearon estas tablas pero ningún endpoint las usa:

| Tabla | Migración | Propósito |
|-------|-----------|-----------|
| leaderboards, leaderboard_snapshots | 036 | Multiplayer |
| competition_events, competition_participants | 036 | Competencias |
| student_risk_scores, predictive_alerts | 037 | Analytics predictivo |
| learning_gap_predictions | 037 | Gap analysis |
| parent_dani_conversations | 038 | Chat padre-Dani |
| conversation_messages, conversation_summaries | 038 | Mensajes padre-Dani |
| feedback_log | 057 | Self-report emocional |
| parent_dashboards | 011 | Dashboard padre (legacy) |
| student_tasks | 011 | Tareas (legacy) |

---

## 7. Arquitectura de Persistencia

```
┌─────────────────────────────────────────────┐
│              BROWSER (Student)               │
│                                              │
│  localStorage ──→ saveData() ──→ Supabase DB │
│  (inmediato)     (debounced)    (persistente) │
│                                              │
│  Entidades dual:                             │
│    points, sessions, streaks,                │
│    dani_memory, improvement_plan,            │
│    vak_results, student profile              │
│                                              │
│  Entidades LS-only:                          │
│    onboarding, grades, dashboard sessions    │
│                                              │
│  Entidades DB-only:                          │
│    timetable, competency_mastery,            │
│    early_warnings, badges, parent_consents   │
└─────────────────────────────────────────────┘
```

**Dirección de sync**: DB overwrites LS on load. LS → DB via saveData() debounced.
**Gap principal**: Streaks y achievements NO se sincronizan de LS a DB.

---

## 8. Mapa de Endpoints (30 totales)

### Con tests de ruta (5)
| Endpoint | Tests | Middleware |
|----------|-------|-----------|
| GET/PUT /student-profile | 15 | requireAuth |
| POST /student-profile/avatar | incl. above | requireAuth |
| POST/GET consent endpoints | 27 | requireAuth (parcial) |
| DELETE /delete-user-data | 3 | requireAuth |
| POST /weekly-report | 10 | requireAuth |

### Sin tests de ruta (25)
| Área | Endpoints | Middleware |
|------|-----------|-----------|
| Data access | GET /data/:userId, GET /progress/:userId | assertAuthIdAccess |
| Dani 2.0 | POST /dani/chat, GET /dani/history | requireAuth |
| Legacy AI | POST /chat, POST /chat/stream, POST /ai | requireAuth (sin rate limit en /ai) |
| Adaptive | GET state, next-action, daily-plan, weekly-plan, recommendations | requireAuth |
| Mastery | GET/POST /adaptive/mastery | requireAuth |
| Warnings | GET /adaptive/warnings, POST .../resolve | requireAuth |
| Gamification | GET missions, POST activity, GET badges | requireAuth |
| Parent | GET wellbeing-status, parent/insights, parent/learning-graph | requireAuth |
| Timetable | (via Supabase REST, no Express endpoints) | RLS |

---

## 9. Estado de CI/CD

### CI (GitHub Actions)
- **13 jobs** configurados
- **Smoke tests**: PASS (frontend + backend)
- **Unit tests**: PASS (345 tests)
- **Build**: PASS

### CD (deploy.yml)
- **migrate-db**: BLOCKED (12/12 fallidas históricamente; rama con fix sin fusionar)
- **deploy-backend**: Depende de migrate-db (nunca ejecuta)
- **deploy-frontend**: Vercel integración Git (funciona, independiente del pipeline)
- **smoke-test**: Nunca ejecuta (depende de deploy-backend)

**Realidad**: Producción se despliega via Vercel Git integration (frontend) y Render auto-deploy (backend). Las migraciones se aplican manualmente.

---

## 10. QA Test Data (Configurado en Producción)

| Rol | Email | Auth ID |
|-----|-------|---------|
| Student 1 | carlos.prueba@edutechlife.test | a7551fba-5ad3-417e-bae8-120c8462044e |
| Parent 1 | eeductechlife2+padre@gmail.com | eb2233b9-2183-43d7-bd8b-512fc04c165d |
| Student 2 | eeductechlife2@gmail.com | 6b800126-429f-436d-a1ce-6669e0a3a0a1 |
| Parent 2 | nuevousuario2026+padre@edutechlife.co | eaa18206-30e2-47ae-b023-808ff29fef49 |

Links activos: Parent1→Student1, Parent2→Student2. Consent records verificados.

---

## VEREDICTO FINAL

### El producto NO está listo para piloto.

**Resumen cuantitativo:**
- 0/8 release gates en PASS
- 5 defectos críticos o altos de seguridad (D1-D5)
- 7 defectos de integridad de datos (D6-D12)
- 83% de endpoints sin tests de ruta (25/30)
- 8 items de deuda técnica estructural
- 9 tablas creadas en migraciones sin implementación

### Prioridades para llegar a piloto (en orden)

**P0 — Seguridad (bloquean piloto):**
1. Aplicar deepseekLimiter a /dani/chat y /ai
2. Hacer ParentalConsentBlocker realmente bloqueante (no bypasseable)
3. Cambiar fail-open a fail-closed en requireVerifiedParentalConsent
4. Mover determinación de rol de localStorage a token/DB

**P1 — Integridad de datos:**
5. Implementar write de streaks a DB desde frontend
6. Implementar write de achievements a DB o unificar con badges
7. Remover claims de puntos no implementados de la UI (+200, +150)

**P2 — Cobertura de tests:**
8. Tests de ruta para /dani/chat y /dani/history
9. Tests de ruta para endpoints adaptativos (5)
10. Tests de ruta para parent intelligence (2)

**P3 — Infraestructura:**
11. Arreglar CD pipeline (migrate-db)
12. Crear staging environment completo
13. Ejecutar golden journey e2e manual
14. Ejecutar consent flow e2e con email real

### Lo que SÍ está bien

El producto tiene una base sólida:
- RLS hardening completo en tablas SmartBoard (migraciones 060+062)
- Backend IDOR protection con middleware robusto y testeado
- Safety gateway para menores (input/output sanitization + crisis detection)
- Dani 2.0 con orquestación completa (contexto, emoción, memoria, persistencia)
- Adaptive learning engine con 87 competencias MEN Colombia
- Responsive audit completo con 40+ correcciones (F0-F5)
- 345 tests backend, 128 específicos de SmartBoard
- Consentimiento parental implementado en backend con 27 tests

**La arquitectura es correcta. Las capas de seguridad backend son sólidas. Los defectos son remediables — ninguno requiere rediseño arquitectónico.** El camino a piloto requiere ~2-3 sprints de hardening enfocado en los 14 items listados arriba.

---

*Este documento es una fotografía técnica verificable del producto al 2026-09-01. No es una descripción optimista. Cada afirmación está respaldada por inspección de código, tests, migraciones y schema.*

**Documentos complementarios:**
- [SMARTBOARD_FEATURE_CLASSIFICATION.md](./SMARTBOARD_FEATURE_CLASSIFICATION.md) — Clasificación de cada feature
- [SMARTBOARD_SOURCE_OF_TRUTH.md](./SMARTBOARD_SOURCE_OF_TRUTH.md) — Fuente canónica por entidad
- [SMARTBOARD_RELEASE_GATE_STATUS.md](./SMARTBOARD_RELEASE_GATE_STATUS.md) — Estado de cada release gate
