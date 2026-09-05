# Plan: SmartBoard Fase 3 — Activación real de tablas

**Fecha:** 2026-09-05  
**Rama:** `recovery/foundation-phase-a`  
**Scope:** Cerrar los 3 gaps reales entre esquema DB y UI activa.

---

## Auditoría de estado real

| Tabla | Write | Read | Estado |
|-------|-------|------|--------|
| `points_history` | ✅ `addPointsWithSupabase` → mutación | ✅ `usePointsHistory` → `pointsHistory` state | **CONECTADA** |
| `conversations` | ✅ Dani stream fire-and-forget | ✅ `GET /dani/history` → `daniChatHistory` | **CONECTADA** |
| `crisis_alerts` | ✅ `logCrisisIncident` en crisis detection | ✅ `/wellbeing-status` para padres | **CONECTADA** |
| `achievements` | ✅ `syncAchievementMutation` en contexto | ✅ `useAchievements` → `achievementsQuery` | **PARCIAL** — UI no usa query |
| `learning_streaks` | ✅ `upsertStreakMutation` en contexto | ✅ `useLearningStreaks` → `setStreak()` | **CONECTADA** |
| `sessions` | ❌ Nunca escribe a la tabla | ✅ `useSessionsData` → `setSessions()` | **GAP REAL** |
| `academic_context` | ❌ Nunca escribe a la tabla | `useAcademicContext` existe sin usar | **GAP REAL** |
| `student_achievements` | ❌ No conectada | — | Baja prioridad |
| `achievement_categories` | Seed data en migration | — | Solo catálogo |

**Conclusión:** 3 gaps reales a cerrar. El resto ya funciona.

---

## Grafo de dependencias

```
students(id)          ← FK base de todas las tablas
    │
    ├── sessions          ← GAP 1 (nada escribe)
    │       │
    │       └── points_history.related_session_id (FK opcional)
    │
    ├── academic_context  ← GAP 2 (nada escribe)
    │
    └── achievements      ← GAP 3 (UI no lee DB)
            │
            └── student_achievements (baja prioridad)
```

---

## Arquitectura de decisiones

1. **Sessions — write directo a Supabase desde frontend** (igual que points/achievements). No necesita endpoint backend. RLS: `service_role` bypassa, `authenticated` puede insertar sus propios registros.
2. **academic_context — upsert por materia** cuando cambia `subjectTime`. Se agrega `useUpsertAcademicContext` a `useSmartBoardSupabase.ts`. Trigger: `trackSubjectTime` en contexto.
3. **achievements UI — fusionar local + DB** en `RewardsGrid`. No reemplazar — fusionar para no romper recompensas locales.

---

## Tareas

### Fase 1: Sessions lifecycle (GAP 1)

#### Task 1: Insertar sesión al entrar a SmartBoard

**Descripción:** Cuando `SmartBoardKidsProvider` monta y `dataLoaded` es true, crear un registro en `sessions` con `start_time = now()`. Guardar el `id` devuelto en `currentSessionRef`. Al desmontar, actualizar ese registro con `end_time` y `duration_minutes`.

**Archivos:**
- `edutechlife-frontend/src/context/SmartBoardKidsContext.jsx` — añadir llamada a `sessionCreateMutation.mutate()` en el `useEffect` de session tracking (línea ~512) y exponer `createSessionWithSupabase` en el `value` object.
- `edutechlife-frontend/src/hooks/useSmartBoardSupabase.ts` — agregar `useSessionEnd` mutation (PATCH `sessions` por id con `end_time`, `duration_minutes`).

**Acceptance criteria:**
- [ ] Entrar a SmartBoard crea un registro en `sessions` con `start_time` y `type = 'dashboard'`
- [ ] Al salir de SmartBoard, el registro se actualiza con `end_time` y `duration_minutes`
- [ ] `useSessionsData` retorna esas sesiones y `SessionLog` las muestra

**Verification:**
- [ ] `vite build` sin errores
- [ ] En Supabase Table Editor → `sessions` aparece 1+ registro después de visitar SmartBoard
- [ ] `SessionLog` muestra las sesiones reales

**Dependencies:** Ninguna  
**Files:** 2  
**Scope:** Small

---

#### Task 2: Exponer `createSessionWithSupabase` en contexto + llamarla al cambiar sujeto

**Descripción:** Cuando el estudiante abre una tab de materia (p. ej. Matemáticas), llamar `createSession` con el `subject`. Esto permite trackear qué materia estudia cada sesión.

**Archivos:**
- `edutechlife-frontend/src/context/SmartBoardKidsContext.jsx` — exponer `createSessionWithSupabase` en `value` (ya está definida, solo falta exponerla).
- `edutechlife-frontend/src/components/smartBoardDashboard/SmartBoardDashboard.jsx` — llamar `createSession(subject)` cuando cambia la tab activa.

**Acceptance criteria:**
- [ ] `createSession` expuesto en contexto
- [ ] Al cambiar de tab de materia, `sessions` recibe un registro con `subject` poblado

**Verification:**
- [ ] TypeScript/ESLint sin errores (`npx eslint src/...`)
- [ ] Registro en `sessions` con `subject !== null`

**Dependencies:** Task 1  
**Files:** 2  
**Scope:** Small

---

### Checkpoint 1
- [ ] `vite build` en verde
- [ ] Tabla `sessions` tiene filas reales en Supabase prod

---

### Fase 2: academic_context (GAP 2)

#### Task 3: `useUpsertAcademicContext` hook + llamarlo desde contexto

**Descripción:** Agregar `useUpsertAcademicContext` a `useSmartBoardSupabase.ts` que hace upsert en `academic_context` por `(student_id, subject)`. En `SmartBoardKidsContext.jsx`, llamarlo dentro de `trackSubjectTime` para que cada minuto estudiado actualice `total_points` y el `performance_level` de esa materia.

**Archivos:**
- `edutechlife-frontend/src/hooks/useSmartBoardSupabase.ts` — nuevo mutation `useUpsertAcademicContext`
- `edutechlife-frontend/src/context/SmartBoardKidsContext.jsx` — llamar en `trackSubjectTime` o en efecto que observa `subjectTime`

**Acceptance criteria:**
- [ ] Estudiar 1+ minuto en una materia crea/actualiza fila en `academic_context`
- [ ] `lessons_completed` incrementa cuando se completa una actividad
- [ ] `useAcademicContext` hook retorna datos reales

**Verification:**
- [ ] `vite build` en verde
- [ ] Tabla `academic_context` muestra filas después de usar SmartBoard

**Dependencies:** Task 1  
**Files:** 2  
**Scope:** Small

---

### Fase 3: Achievements UI usa DB (GAP 3)

#### Task 4: `RewardsGrid` fusiona logros locales con `achievementsQuery`

**Descripción:** `RewardsGrid` actualmente muestra `unlockedRewards` (estado local). `achievementsQuery.data` ya se carga desde DB pero no se muestra. Fusionar: DB achievements como fuente primaria, `unlockedRewards` locales como fallback/complemento.

**Archivos:**
- `edutechlife-frontend/src/components/kids-dashboard/smartBoardProgress/components/RewardsGrid.jsx` — leer `achievementsQuery.data` del contexto y fusionar con props locales
- `edutechlife-frontend/src/context/SmartBoardKidsContext.jsx` — exponer `achievementsQuery.data` en value (ya está en `value._queries.achievements`)

**Acceptance criteria:**
- [ ] `RewardsGrid` muestra logros de DB cuando existen
- [ ] Si DB está vacía, muestra `unlockedRewards` locales (sin romper comportamiento actual)
- [ ] Sin regresión en UI de recompensas

**Verification:**
- [ ] `vite build` en verde
- [ ] Con al menos 1 achievement en DB, `RewardsGrid` lo muestra
- [ ] Sin achievements en DB, el grid no queda vacío (fallback local)

**Dependencies:** Task 1 (achievements se crean via `syncAchievementMutation`)  
**Files:** 2  
**Scope:** Small

---

### Checkpoint 2 (Final)
- [ ] `npm test` — todos los tests pasan
- [ ] `vite build` en verde
- [ ] Tabla `sessions` tiene filas
- [ ] Tabla `academic_context` tiene filas
- [ ] `RewardsGrid` muestra logros de DB

---

## Riesgos

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| RLS bloquea INSERT en `sessions` desde cliente | Alto | Verificar políticas en migration 059; si falla, agregar endpoint backend |
| `useEffect` de session duplica registros en StrictMode | Medio | Usar `ref` de guardián (`sessionCreatedRef`) |
| `trackSubjectTime` se llama muy frecuente → muchos upserts | Bajo | Debounce 5s en `useUpsertAcademicContext` |
| `RewardsGrid` merge duplica recompensas | Bajo | Dedup por `achievement_type` |

---

## Fuera de scope (Fase 4+)

- `student_achievements` table (catálogo separado)
- Backend session endpoints (si RLS directo funciona, no se necesita)
- Real-time Supabase subscriptions (suscripción a cambios en vivo)
- Parent Early Warning push notifications
