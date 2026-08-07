# SmartBoard Remediation Plan (P0 → P1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir las vulnerabilidades críticas (fuga de datos realtime, RLS inseguras, registro de padre sin verificación, consentimiento parental incompleto), los bugs de economía de puntos y las fallas de carga/UI del SmartBoard detectadas en la auditoría del 2026-08-07.

**Architecture:** Backend Express + Supabase (RLS). Frontend React (Vite) con estado local + blob JSONB en `smartboard_kids_data`. Los fixes P0 se hacen en 3 capas: (1) SQL/RLS vía migraciones, (2) backend Express, (3) frontend React. Cada fix con test previo (TDD).

**Tech Stack:** Express 4, Supabase JS (anon key + service role), React 18, Tailwind, framer-motion, Vitest, supertest.

**Contexto clave (auditoría 2026-08-07):** health 5.8/10. Las migraciones 003-010 **nunca se aplicaron en producción** (BD construida a mano). La migración 023 (parent_student_links + RLS padre) probablemente no está en prod. Verificar en staging **antes** de tocar main.

---

## Fase A — Seguridad y aislamiento de datos (P0)

### Task A1: Filtrar canales realtime del padre por estudiante vinculado

**Files:**
- Modify: `edutechlife-frontend/src/hooks/useParentDashboardRealtime.ts`
- Modify: `edutechlife-frontend/src/components/pages/smartBoardParentDashboard/SmartBoardParentDashboard.jsx:130-136, 163-171`
- Test: `edutechlife-frontend/src/hooks/__tests__/useParentDashboardRealtime.test.ts` (nuevo)

**Problema:** los 3 canales `postgres_changes` no filtran por relación padre→hijo; cualquier estudiante de la plataforma puede llegar al dashboard de un padre. Además `studentStatus` usa `students.id` (DB id) mientras el dashboard compara con `studentId` (auth uid) → mismatch.

**Solución:** el hook recibe `studentAuthId` (el auth uid del hijo). Resuelve el DB id del hijo al montar (`SELECT id FROM students WHERE auth_id = ?`) y filtra los canales por `student_id=eq.<dbId>` (sessions/points) y `auth_id=eq.<authId>` (students). `studentStatus` se indexa por `auth_id`.

- [ ] **Step 1: Escribir el test fallido**

Create `edutechlife-frontend/src/hooks/__tests__/useParentDashboardRealtime.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockClient = {
  channel: vi.fn(() => ({
    on: vi.fn(function () { return this; }),
    subscribe: vi.fn(() => "SUBSCRIBED"),
  })),
  removeChannel: vi.fn(),
};

vi.mock("../../lib/supabase", () => ({
  createSupabaseClient: () => mockClient,
}));

// Capture filters passed to each .on()
const filters: string[] = [];
mockClient.channel = vi.fn(() => ({
  on: vi.fn(function (this: any, config: any) {
    if (config.filter) filters.push(config.filter);
    return this;
  }),
  subscribe: vi.fn(),
}));

import { useParentDashboardRealtime } from "../useParentDashboardRealtime";
import { act, renderHook } from "@testing-library/react";

describe("useParentDashboardRealtime", () => {
  beforeEach(() => { filters.length = 0; vi.clearAllMocks(); });

  it("filters sessions/points by the linked student's DB id and students by auth id", async () => {
    // Mock: students table returns DB id 'db-123' for auth_id 'auth-456'
    mockClient.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: "db-123" }, error: null }),
    });

    const { result } = renderHook(() =>
      useParentDashboardRealtime("parent-1", "auth-456", "token-abc"),
    );

    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(filters.some((f) => f === "student_id=eq.db-123")).toBe(true);
    expect(filters.some((f) => f === "auth_id=eq.auth-456")).toBe(true);
    expect(filters.some((f) => f.includes("last_activity=gt."))).toBe(false);
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `cd edutechlife-frontend && npx vitest run src/hooks/__tests__/useParentDashboardRealtime.test.ts`
Expected: FAIL — el hook actual no acepta `studentAuthId`, no filtra `student_id`.

- [ ] **Step 3: Reescribir el hook**

Rewrite `edutechlife-frontend/src/hooks/useParentDashboardRealtime.ts`:

```ts
import { useEffect, useRef, useState } from "react";
import { createSupabaseClient } from "../lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface StudentOnlineStatus {
  auth_id: string;
  is_online: boolean;
  last_activity: string;
}

export interface LiveSession {
  id: string;
  student_id: string;
  subject: string;
  start_time: string;
  completion_percentage: number;
  points_earned: number;
  type: string;
}

export interface LivePointsEntry {
  id: string;
  student_id: string;
  points: number;
  reason: string;
  category: string;
  timestamp: string;
}

export const useParentDashboardRealtime = (
  parentId: string,
  studentAuthId: string,
  authToken: string | null,
) => {
  const [studentStatus, setStudentStatus] = useState<StudentOnlineStatus[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [livePoints, setLivePoints] = useState<LivePointsEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const channelsRef = useRef<RealtimeChannel[]>([]);
  const supabaseRef = useRef<any>(null);

  useEffect(() => {
    if (!parentId || !studentAuthId || !authToken) {
      setIsConnected(false);
      return;
    }

    let isMounted = true;

    const setupRealtimeSubscriptions = async () => {
      try {
        const supabase = createSupabaseClient(authToken);
        supabaseRef.current = supabase;

        // Resolve the student's DB id from the auth id (students.id != auth.uid)
        let studentDbId: string | null = null;
        const { data: studentRow } = await supabase
          .from("students")
          .select("id")
          .eq("auth_id", studentAuthId)
          .maybeSingle();
        if (studentRow?.id) studentDbId = String(studentRow.id);

        const statusChannel = supabase
          .channel(`parent-student-status-${parentId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "students",
              filter: `auth_id=eq.${studentAuthId}`,
            },
            (payload: any) => {
              if (isMounted) {
                const student = payload.new || payload.old;
                setStudentStatus((prev) => {
                  const filtered = prev.filter(
                    (s) => s.auth_id !== student.auth_id,
                  );
                  return [
                    ...filtered,
                    {
                      auth_id: student.auth_id,
                      is_online:
                        new Date(student.last_activity).getTime() >
                        Date.now() - 5 * 60 * 1000,
                      last_activity: student.last_activity,
                    },
                  ];
                });
              }
            },
          )
          .subscribe((status) => {
            if (isMounted && status === "SUBSCRIBED") setIsConnected(true);
          });

        channelsRef.current.push(statusChannel);

        const sessionsChannel = supabase
          .channel(`parent-live-sessions-${parentId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "sessions",
              filter: studentDbId ? `student_id=eq.${studentDbId}` : undefined,
            },
            (payload: any) => {
              if (isMounted) {
                const session = payload.new;
                setLiveSessions((prev) => [
                  ...prev.filter((s) => s.id !== session.id),
                  {
                    id: session.id,
                    student_id: session.student_id,
                    subject: session.subject,
                    start_time: session.start_time,
                    completion_percentage: session.completion_percentage,
                    points_earned: session.points_earned,
                    type: session.type,
                  },
                ]);
              }
            },
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "sessions",
              filter: studentDbId ? `student_id=eq.${studentDbId}` : undefined,
            },
            (payload: any) => {
              if (isMounted) {
                const session = payload.new;
                setLiveSessions((prev) => {
                  const filtered = prev.filter((s) => s.id !== session.id);
                  if (!session.end_time) {
                    return [
                      ...filtered,
                      {
                        id: session.id,
                        student_id: session.student_id,
                        subject: session.subject,
                        start_time: session.start_time,
                        completion_percentage: session.completion_percentage,
                        points_earned: session.points_earned,
                        type: session.type,
                      },
                    ];
                  }
                  return filtered;
                });
              }
            },
          )
          .subscribe();

        channelsRef.current.push(sessionsChannel);

        const pointsChannel = supabase
          .channel(`parent-live-points-${parentId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "points_history",
              filter: studentDbId ? `student_id=eq.${studentDbId}` : undefined,
            },
            (payload: any) => {
              if (isMounted) {
                const entry = payload.new;
                setLivePoints((prev) => [
                  {
                    id: entry.id,
                    student_id: entry.student_id,
                    points: entry.points,
                    reason: entry.reason,
                    category: entry.category,
                    timestamp: entry.timestamp,
                  },
                  ...prev,
                ].slice(0, 50));
              }
            },
          )
          .subscribe();

        channelsRef.current.push(pointsChannel);
      } catch (err) {
        console.warn("[ParentDashboardRealtime] Setup error:", err);
        setIsConnected(false);
      }
    };

    setupRealtimeSubscriptions();

    return () => {
      isMounted = false;
      channelsRef.current.forEach((channel) => {
        if (supabaseRef.current) supabaseRef.current.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [parentId, studentAuthId, authToken]);

  return { studentStatus, liveSessions, livePoints, isConnected };
};
```

- [ ] **Step 4: Actualizar la llamada en el dashboard del padre**

Modify `SmartBoardParentDashboard.jsx:130-131`:

```jsx
  const { studentStatus, liveSessions, livePoints, isConnected } =
    useParentDashboardRealtime(userId, studentId || userId, authToken);
```

Modify `SmartBoardParentDashboard.jsx:134-136` (el estado usa `auth_id`):

```jsx
  const studentOnline = Array.isArray(studentStatus)
    ? studentStatus.some(s => s.auth_id === (studentId || userId) && s.is_online)
    : false;
```

- [ ] **Step 5: Ejecutar los tests y verificar que pasan**

Run: `cd edutechlife-frontend && npx vitest run src/hooks/__tests__/useParentDashboardRealtime.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add edutechlife-frontend/src/hooks/useParentDashboardRealtime.ts edutechlife-frontend/src/components/pages/smartBoardParentDashboard/SmartBoardParentDashboard.jsx edutechlife-frontend/src/hooks/__tests__/useParentDashboardRealtime.test.ts
git commit -m "fix(parent-dashboard): filter realtime channels by linked student id"
```

---

### Task A2: Corregir doble conteo y duplicados de puntos en vivo + race poll/realtime

**Files:**
- Modify: `edutechlife-frontend/src/components/pages/smartBoardParentDashboard/SmartBoardParentDashboard.jsx:143-171`
- Test: `edutechlife-frontend/src/components/pages/smartBoardParentDashboard/__tests__/realtimeMerge.test.js` (nuevo)

**Problema:** (1) `prev.points + livePoints.reduce(...)` suma el acumulado completo cada vez (crece y se trunca a 50) → mismos puntos sumados repetidamente. (2) `[...livePoints, ...prev.history]` prepende entradas ya presentes → duplicados. (3) El poll de 30s `setData(supabaseData)` sobrescribe la fusión en vivo.

**Solución:** dedupe por `id` y calcular delta usando un ref con los ids ya contados.

- [ ] **Step 1: Escribir el test fallido**

Create `edutechlife-frontend/src/components/pages/smartBoardParentDashboard/__tests__/realtimeMerge.test.js`:

```js
import { describe, it, expect } from "vitest";

// Pure helper extracted for testability (implemented in Step 3)
import { mergeRealtimePoints, dedupeById } from "../mergeRealtime";

describe("mergeRealtimePoints", () => {
  it("adds each live point once even across multiple events", () => {
    const { points, history } = mergeRealtimePoints(
      { points: 100, history: [{ id: "a", points: 10 }] },
      [
        { id: "p1", student_id: "x", points: 5, reason: "", category: "", timestamp: "" },
        { id: "p2", student_id: "x", points: 7, reason: "", category: "", timestamp: "" },
      ],
    );
    expect(points).toBe(112);

    const second = mergeRealtimePoints(
      { points, history },
      [
        { id: "p2", student_id: "x", points: 7, reason: "", category: "", timestamp: "" },
        { id: "p3", student_id: "x", points: 3, reason: "", category: "", timestamp: "" },
      ],
    );
    expect(second.points).toBe(115); // p2 not double counted
    expect(second.history).toHaveLength(4); // a, p1, p2, p3
    expect(new Set(second.history.map((h) => h.id)).size).toBe(4); // no dupes
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `cd edutechlife-frontend && npx vitest run src/components/pages/smartBoardParentDashboard/__tests__/realtimeMerge.test.js`
Expected: FAIL — `mergeRealtime` no existe.

- [ ] **Step 3: Crear el helper puro**

Create `edutechlife-frontend/src/components/pages/smartBoardParentDashboard/mergeRealtime.js`:

```js
const seenIds = new Set();

export const dedupeById = (items) => {
  const out = [];
  const seen = new Set();
  for (const item of items) {
    if (!item || seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
};

export const mergeRealtimePoints = (current, livePoints) => {
  const history = dedupeById([...current.history, ...livePoints]).slice(0, 100);
  const newlySeen = livePoints.filter((p) => p && !seenIds.has(p.id));
  newlySeen.forEach((p) => seenIds.add(p.id));
  const points = current.points + newlySeen.reduce((s, p) => s + (p.points || 0), 0);
  return { points, history };
};

export const resetSeenIds = () => seenIds.clear();
```

- [ ] **Step 4: Integrar el helper en el dashboard del padre**

Modify `SmartBoardParentDashboard.jsx`:

```jsx
import { mergeRealtimePoints } from "./mergeRealtime";
```

Replace the effect at lines 163-171:

```jsx
  useEffect(() => {
    if (!liveSessions.length && !livePoints.length) return;
    setData(prev => {
      const merged = mergeRealtimePoints(prev, livePoints);
      return {
        ...prev,
        sessions: liveSessions.length ? liveSessions : prev.sessions,
        points: merged.points,
        history: merged.history,
      };
    });
  }, [liveSessions, livePoints]);
```

Fix the poll race at lines 143-145 (fuse only the server data into local without dropping live values — the live effect already runs after, but guard against clobbering via a ref flag):

```jsx
  const liveAppliedRef = useRef(false);
  useEffect(() => {
    if (!liveAppliedRef.current) setData(supabaseData);
  }, [supabaseData]);
  // set liveAppliedRef.current = true inside the live effect (Step 4 continued)
```

In the live effect, add `liveAppliedRef.current = true;` as the first line inside the callback.

- [ ] **Step 5: Ejecutar tests y verificar**

Run: `cd edutechlife-frontend && npx vitest run src/components/pages/smartBoardParentDashboard/__tests__/realtimeMerge.test.js`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add edutechlife-frontend/src/components/pages/smartBoardParentDashboard/mergeRealtime.js edutechlife-frontend/src/components/pages/smartBoardParentDashboard/SmartBoardParentDashboard.jsx edutechlife-frontend/src/components/pages/smartBoardParentDashboard/__tests__/realtimeMerge.test.js
git commit -m "fix(parent-dashboard): dedupe live points and stop double counting"
```

---

### Task A3: Migración 025 — cerrar políticas RLS inseguras

**Files:**
- Create: `supabase/migrations/025_harden_smartboard_rls.sql`
- Test: `supabase/migrations/` (revisar sintaxis; no ejecutar contra prod hasta verificar en staging)

**Problema:** policies "Service role" con `USING(true)/WITH CHECK(true)` son alcanzables por la anon key; `parent_dashboards` expone todas las filas (`parent_email = current_user` nunca matchea, `is_active = true` matchea todas).

**Solución:** reemplazar las policies por un equivalente seguro: lectura/escritura scoped a `auth.uid()` y a padres vinculados vía `parent_student_links`; para inserción controlada desde el backend, usar el rol `service_role` real en vez de `authenticated`.

- [ ] **Step 1: Escribir la migración**

Create `supabase/migrations/025_harden_smartboard_rls.sql`:

```sql
-- ============================================================================
-- Migration 025 — Hardening RLS SmartBoard
-- Reemplaza policies "Service role ... USING(true)/WITH CHECK(true)" que eran
-- alcanzables por la anon key. Las operaciones del backend usan el rol real
-- service_role (bypasea RLS); estas policies protegen el acceso directo desde
-- el cliente con la anon key.
-- ============================================================================

BEGIN;

-- --- POINTS_HISTORY ---------------------------------------------------------
DROP POLICY IF EXISTS "Service role insert points" ON points_history;
CREATE POLICY "Students insert own points"
  ON points_history FOR INSERT
  WITH CHECK (
    student_id = (SELECT id FROM students WHERE auth_id = auth.uid())
  );

-- --- ACADEMIC_CONTEXT -------------------------------------------------------
DROP POLICY IF EXISTS "Service role manage academic context" ON academic_context;
CREATE POLICY "Students insert own academic context"
  ON academic_context FOR INSERT
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
CREATE POLICY "Students update own academic context"
  ON academic_context FOR UPDATE
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()))
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- --- PARENT_DASHBOARDS ------------------------------------------------------
DROP POLICY IF EXISTS "Parents read own dashboards" ON parent_dashboards;
CREATE POLICY "Parents read linked student dashboards"
  ON parent_dashboards FOR SELECT
  USING (
    parent_email = auth.jwt() ->> 'email'
    OR EXISTS (
      SELECT 1 FROM parent_student_links psl
      WHERE psl.parent_user_id = auth.uid()::TEXT
        AND psl.student_user_id = parent_dashboards.student_user_id
        AND psl.is_active = true
    )
  );
DROP POLICY IF EXISTS "Service role manage parent dashboards" ON parent_dashboards;
CREATE POLICY "Parents insert own dashboards"
  ON parent_dashboards FOR INSERT
  WITH CHECK (parent_email = auth.jwt() ->> 'email');

-- --- ACHIEVEMENTS -----------------------------------------------------------
DROP POLICY IF EXISTS "Service role award achievements" ON achievements;
CREATE POLICY "Students insert own achievements"
  ON achievements FOR INSERT
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- --- LEARNING_STREAKS -------------------------------------------------------
DROP POLICY IF EXISTS "Service role manage streaks" ON learning_streaks;
CREATE POLICY "Students insert own streaks"
  ON learning_streaks FOR INSERT
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
CREATE POLICY "Students update own streaks"
  ON learning_streaks FOR UPDATE
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()))
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- --- SMARTBOARD_SETTINGS ----------------------------------------------------
DROP POLICY IF EXISTS "Service role create settings" ON smartboard_settings;
CREATE POLICY "Students insert own settings"
  ON smartboard_settings FOR INSERT
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- --- PARENT_CONSENTS (migration 008) ---------------------------------------
DROP POLICY IF EXISTS "Service role insert parent consents" ON parent_consents;
DROP POLICY IF EXISTS "Service role update parent consents" ON parent_consents;
-- Insert scoped al estudiante dueno de su consentimiento
CREATE POLICY "Students insert own consent"
  ON parent_consents FOR INSERT
  WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students update own consent"
  ON parent_consents FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- --- CRISIS_ALERTS (migration 009) -----------------------------------------
DROP POLICY IF EXISTS "Service role insert crisis alerts" ON crisis_alerts;
-- Solo el estudiante crea su propia alerta (backend usa service_role)
CREATE POLICY "Students insert own crisis alerts"
  ON crisis_alerts FOR INSERT
  WITH CHECK (auth.uid() = student_id);

COMMIT;
```

- [ ] **Step 2: Validar sintaxis local**

Run: `cd supabase && npx supabase db lint --local 2>/dev/null || echo "Supabase CLI no disponible — validar en staging"`

Si no hay CLI local, dejar la verificación explícita para staging. **NO ejecutar `supabase db push` contra producción** hasta validar en staging.

- [ ] **Step 3: Escribir test de políticas (opcional pero recomendado)**

Add a backend test asserting the DB-layer behavior is enforced at the route level (si las tablas existen en staging). Registrar en `SMARTBOARD_STATUS.md` que la migración 025 requiere validación manual en staging:

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/025_harden_smartboard_rls.sql
git commit -m "fix(security): harden smartboard RLS policies (migration 025)"
```

---

### Task A4: Verificación de parentesco real en parent-register

**Files:**
- Modify: `edutechlife-backend/src/services/authService.js:233-293`
- Modify: `edutechlife-backend/src/routes/auth.js:652-666`
- Modify: `edutechlife-backend/src/__tests__/services/authService.test.js` (o el de auth)
- Modify: `edutechlife-frontend/src/pages/SmartBoardLogin.jsx:100-128` (texto del flujo)

**Problema:** cualquiera que conozca el email de un estudiante puede registrarse como su padre (`email_confirm: true` sin verificación) y el upsert de vínculo se hace desde el cliente.

**Solución:** (1) `parent-register` genera un **token de invitación** ligado al estudiante y lo devuelve; el flujo UX le pide al estudiante (desde su dashboard) generar el código de vínculo y al padre ingresarlo. (2) `signUpParent` exige ese token y lo valida contra `parent_consents.verification_token` (verificado) antes de crear la cuenta. (3) El upsert de `parent_student_links` se mueve al backend (service_role) — nunca desde el cliente.

- [ ] **Step 1: Escribir el test fallido**

Add to `edutechlife-backend/src/__tests__/services/authService.test.js` (o crear si no existe, siguiendo el patrón de mocks de `smartboard.test.js`):

```js
const authService = require('../../services/authService');
const supabase = require('../../db/supabase');

describe('signUpParent', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('rejects registration when invitation token is invalid or unverified', async () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    await expect(
      authService.signUpParent({
        studentEmail: 'kid@school.co',
        parentPassword: 'secret123',
        parentName: 'Ana',
        invitationToken: 'invalid-token',
      }),
    ).rejects.toThrow('invitación');
  });

  it('creates the parent account only when a verified consent matches the token', async () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn()
        .mockResolvedValueOnce({ data: { id: 'stu-1' }, error: null }) // users lookup
        .mockResolvedValueOnce({ data: { verification_status: 'verified' }, error: null }), // consent
    });
    supabase.auth.admin.createUser.mockResolvedValue({
      data: { user: { id: 'par-1' } }, error: null,
    });

    const result = await authService.signUpParent({
      studentEmail: 'kid@school.co',
      parentPassword: 'secret123',
      parentName: 'Ana',
      invitationToken: 'tok-verified',
    });
    expect(result.message).toContain('creada');
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `cd edutechlife-backend && npx vitest run src/__tests__/services/authService.test.js`
Expected: FAIL — `signUpParent` no valida token.

- [ ] **Step 3: Implementar la validación**

Modify `signUpParent` in `edutechlife-backend/src/services/authService.js`:

```js
async function signUpParent({ studentEmail, parentPassword, parentName, invitationToken }) {
  if (!studentEmail || !parentPassword) {
    throw new Error('El correo del estudiante y la contraseña son requeridos');
  }
  if (parentPassword.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }
  if (!invitationToken) {
    throw new Error('Se requiere el código de invitación que genera el estudiante desde su cuenta');
  }

  const normalizedStudentEmail = String(studentEmail).toLowerCase().trim();
  const parentAuthEmail = buildParentEmail(normalizedStudentEmail);

  // 1. Localizar el estudiante
  const { data: studentProfile } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedStudentEmail)
    .maybeSingle();
  if (!studentProfile?.id) {
    throw new Error('No existe una cuenta de estudiante con ese correo');
  }

  // 2. Validar el token de invitación contra un consentimiento VERIFICADO
  const { data: consent } = await supabase
    .from('parent_consents')
    .select('verification_status')
    .eq('student_id', studentProfile.id)
    .eq('verification_token', invitationToken)
    .maybeSingle();
  if (!consent || consent.verification_status !== 'verified') {
    throw new Error('El código de invitación no es válido o el consentimiento no está verificado');
  }

  const [firstName, ...rest] = (parentName || 'Padre/Madre').split(' ');
  const lastName = rest.join(' ') || '';

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: parentAuthEmail,
    password: parentPassword,
    email_confirm: true,
    user_metadata: {
      role: 'parent',
      student_email: normalizedStudentEmail,
      student_id: studentProfile.id,
      first_name: firstName,
      last_name: lastName,
    },
  });

  if (authError) {
    const msg = (authError.message || '').toLowerCase();
    if (msg.includes('already') || msg.includes('exists')) {
      throw new Error('Ya existe una cuenta de padre para este correo. Inicia sesión.');
    }
    throw new Error(`Error al crear cuenta: ${authError.message}`);
  }

  const userId = authData.user?.id;
  if (!userId) throw new Error('Error al crear cuenta');

  await supabase
    .from('users')
    .insert([{
      id: userId,
      email: parentAuthEmail,
      first_name: firstName,
      last_name: lastName,
      username: `padre_${normalizedStudentEmail.split('@')[0]}`,
      user_type: 'parent',
      clerk_id: userId,
      platform: 'smartboard',
    }])
    .select()
    .maybeSingle();

  // 3. Vincular padre→hijo desde el backend (service_role), no desde el cliente
  await supabase
    .from('parent_student_links')
    .upsert(
      {
        parent_user_id: userId,
        student_user_id: studentProfile.id,
        is_active: true,
      },
      { onConflict: 'parent_user_id,student_user_id' },
    );

  return { message: 'Cuenta de padre creada exitosamente. Ya puedes iniciar sesión.' };
}
```

- [ ] **Step 4: Eliminar el upsert de vínculo desde el cliente**

Modify `edutechlife-frontend/src/pages/SmartBoardLogin.jsx:74-90` — quitar el bloque `try { ... parent_student_links upsert ... }` y `decodeJwtPayload`, ya que el vínculo lo crea el backend al registrarse.

- [ ] **Step 5: Ajustar el formulario de registro del padre**

Modify `edutechlife-frontend/src/pages/SmartBoardLogin.jsx` `handleParentRegister` (línea 100-128) para incluir el campo `invitationToken` (input nuevo "Código de invitación del estudiante") en el body.

- [ ] **Step 6: Ejecutar tests y verificar**

Run: `cd edutechlife-backend && npx vitest run src/__tests__/services/authService.test.js`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add edutechlife-backend/src/services/authService.js edutechlife-backend/src/routes/auth.js edutechlife-backend/src/__tests__/services/authService.test.js edutechlife-frontend/src/pages/SmartBoardLogin.jsx
git commit -m "fix(security): require verified parental invitation token for parent registration"
```

---

### Task A5: Implementar flujo de verificación de consentimiento parental (COPPA/Ley 1581)

**Files:**
- Modify: `edutechlife-backend/src/routes/smartboard.js:396-437` (POST /parental-consent)
- Modify: `edutechlife-backend/src/routes/smartboard.js` (nuevo POST /parental-consent/verify)
- Modify: `edutechlife-backend/src/services/emailService.js` (enviar link de verificación)
- Modify: `edutechlife-frontend/src/components/kids-dashboard/SmartBoardConsentGate.jsx`
- Modify: `edutechlife-backend/src/__tests__/routes/smartboard.test.js`

**Problema:** el consentimiento queda `pending` para siempre; la UI promete un email de verificación que nunca se envía; `studentAge` sin validar.

**Solución:** al registrar consentimiento, generar `verification_token`, guardarlo y enviar email con link `POST /api/smartboard/parental-consent/verify?token=...` que marca `verification_status='verified'`. El token es el mismo que valida el registro del padre (Task A4).

- [ ] **Step 1: Escribir los tests fallidos**

Add to `edutechlife-backend/src/__tests__/routes/smartboard.test.js`:

```js
describe('Smartboard POST /parental-consent', () => {
  it('rejects invalid studentAge type', async () => {
    mockSupabase.from.mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
    });
    const res = await request(app)
      .post('/api/smartboard/parental-consent')
      .set('x-test-user-id', 'kid-1')
      .send({ parentEmail: 'papa@x.co', studentAge: 'once' });
    expect(res.status).toBe(400);
  });
});

describe('Smartboard POST /parental-consent/verify', () => {
  it('marks consent as verified when token matches', async () => {
    mockSupabase.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'c1', verification_status: 'verified' }, error: null }),
    });
    const res = await request(app)
      .post('/api/smartboard/parental-consent/verify')
      .send({ token: 'tok-1' });
    expect(res.status).toBe(200);
    expect(res.body.verification_status).toBe('verified');
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `cd edutechlife-backend && npx vitest run src/__tests__/routes/smartboard.test.js`
Expected: FAIL — nuevo endpoint no existe; age no validado.

- [ ] **Step 3: Implementar validación de edad y token en POST /parental-consent**

Modify `smartboard.js:396-437`:

```js
router.post('/parental-consent', requireAuth, async (req, res) => {
  const { parentEmail, studentAge, timestamp } = req.body;
  const userId = req.userId;

  if (!parentEmail || studentAge === undefined || studentAge === null) {
    return res.status(400).json({ error: 'parentEmail and studentAge are required' });
  }
  const age = Number(studentAge);
  if (!Number.isInteger(age) || age < 5 || age > 18) {
    return res.status(400).json({ error: 'studentAge must be an integer between 5 and 18' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(parentEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const verificationToken = crypto.randomBytes(24).toString('hex');

  try {
    const { data, error } = await supabase
      .from('parent_consents')
      .insert([{
        student_id: userId,
        parent_email: parentEmail,
        student_age: age,
        consent_timestamp: timestamp || new Date().toISOString(),
        verification_status: 'pending',
        verification_token: verificationToken,
      }])
      .select();

    if (error) {
      console.error('Error inserting parental consent:', error);
      return res.status(500).json({ error: 'Failed to save parental consent' });
    }

    // Enviar email de verificación al padre
    await sendConsentVerificationEmail({
      parentEmail,
      studentAge: age,
      token: verificationToken,
    });

    res.status(201).json({
      message: 'Parental consent registered successfully. Verification email sent.',
      data: { id: data[0].id, verification_status: 'pending' },
    });
  } catch (e) {
    console.error('Error processing parental consent:', e);
    res.status(500).json({ error: 'Failed to process parental consent' });
  }
});
```

Añadir al top del archivo: `const crypto = require('crypto');` y `const { sendConsentVerificationEmail } = require('../services/emailService');`

- [ ] **Step 4: Implementar endpoint de verificación**

Add a new route in `smartboard.js` (antes del `module.exports`):

```js
/**
 * POST /api/smartboard/parental-consent/verify
 * Verifica el consentimiento parental con el token enviado por email.
 */
router.post('/parental-consent/verify', async (req, res) => {
  const { token } = req.body || {};
  if (!token || typeof token !== 'string' || token.length < 16) {
    return res.status(400).json({ error: 'Token inválido' });
  }
  try {
    const { data, error } = await supabase
      .from('parent_consents')
      .update({ verification_status: 'verified', verified_at: new Date().toISOString() })
      .eq('verification_token', token)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Token no encontrado o ya utilizado' });
    res.json({ message: 'Consentimiento verificado', verification_status: data.verification_status });
  } catch (e) {
    console.error('Error verifying parental consent:', e);
    res.status(500).json({ error: 'Error al verificar el consentimiento' });
  }
});
```

- [ ] **Step 5: Añadir el envío de email en emailService**

Modify `edutechlife-backend/src/services/emailService.js` (leer primero el archivo; seguir su patrón de `sendEmail`/Resend/console fallback):

```js
async function sendConsentVerificationEmail({ parentEmail, studentAge, token }) {
  const verifyUrl = `https://edutechlife.co/api/smartboard/parental-consent/verify?token=${token}`;
  const html = `
    <p>Recibimos una solicitud de consentimiento para un estudiante de SmartBoard (edad: ${studentAge}).</p>
    <p>Para activar la cuenta, verifica tu consentimiento:</p>
    <p><a href="${verifyUrl}">Verificar consentimiento</a></p>
    <p>Este enlace es de un solo uso. Si no reconoces esta solicitud, ignora este correo.</p>
  `;
  return sendEmail(
    parentEmail,
    'Verifica el consentimiento parental de SmartBoard',
    html,
    `Verifica tu consentimiento en: ${verifyUrl}`,
  );
}
module.exports.sendConsentVerificationEmail = sendConsentVerificationEmail;
```

- [ ] **Step 6: Actualizar el ConsentGate para no bloquear si el email falla**

Modify `edutechlife-frontend/src/components/kids-dashboard/SmartBoardConsentGate.jsx:50-70` — en `handleAcceptConsent`, capturar el error del POST pero **no** re-mostrar el modal si es solo el envío del email; navegar igualmente (el estudiante entra en modo "pendiente de verificación"). Mostrar un banner "Enviamos un correo a tu acudiente para verificar su consentimiento".

- [ ] **Step 7: Ejecutar tests y verificar**

Run: `cd edutechlife-backend && npx vitest run src/__tests__/routes/smartboard.test.js`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add edutechlife-backend/src/routes/smartboard.js edutechlife-backend/src/services/emailService.js edutechlife-backend/src/__tests__/routes/smartboard.test.js edutechlife-frontend/src/components/kids-dashboard/SmartBoardConsentGate.jsx
git commit -m "feat(privacy): implement parental consent verification email flow"
```

---

### Task A6: Completar el derecho al olvido (erasure)

**Files:**
- Modify: `edutechlife-backend/src/routes/smartboard.js:619-672`
- Modify: `edutechlife-backend/src/__tests__/routes/smartboard.test.js:249-297`

**Problema:** `DELETE /delete-user-data` no borra la fila en `users`, ni `parent_student_links`; si no existe fila en `students`, la cascada no limpia las tablas dependientes; `activity_log.user_id` TEXT legacy no matchea UUID.

**Solución:** borrar también `users` (si existe) y `parent_student_links` (ambas direcciones), y añadir un borrado explícito de `activity_log` con el `user_id` como TEXT y como UUID.

- [ ] **Step 1: Escribir el test fallido**

Add to `smartboard.test.js`:

```js
describe('Smartboard DELETE /delete-user-data', () => {
  it('deletes users and parent_student_links as well', async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'students') return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn().mockResolvedValue({ data: { id: 's1' }, error: null }) };
      return { delete: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), in: vi.fn().mockReturnThis(), select: vi.fn().mockReturnThis() };
    });
    const res = await request(app)
      .delete('/api/smartboard/delete-user-data')
      .set('x-test-user-id', 'kid-123');
    expect(res.status).toBe(200);
    const tablesCalled = Object.keys(mockSupabase.from.mock.calls.reduce((acc, [t]) => { acc[t] = true; return acc; }, {}));
    expect(tablesCalled).toContain('users');
    expect(tablesCalled).toContain('parent_student_links');
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `cd edutechlife-backend && npx vitest run src/__tests__/routes/smartboard.test.js`
Expected: FAIL — `users`/`parent_student_links` no se borran.

- [ ] **Step 3: Ampliar el borrado**

Modify the `DELETE /delete-user-data` handler (`smartboard.js:619-672`). Leer el bloque actual completo antes de editar y añadir tras el borrado de `students`:

```js
      // Fila de perfil en users
      await safeDelete('users', (q) => q.eq('id', userId));
      // Vínculos padre→hijo en ambas direcciones
      await safeDelete('parent_student_links', (q) => q.eq('student_user_id', userId));
      await safeDelete('parent_student_links', (q) => q.eq('parent_user_id', userId));
      // activity_log legacy (TEXT) y nativo (UUID)
      await safeDelete('activity_log', (q) => q.eq('user_id', userId));
```

- [ ] **Step 4: Ejecutar tests y verificar**

Run: `cd edutechlife-backend && npx vitest run src/__tests__/routes/smartboard.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add edutechlife-backend/src/routes/smartboard.js edutechlife-backend/src/__tests__/routes/smartboard.test.js
git commit -m "fix(privacy): complete erasure — delete users, parent_student_links and legacy activity_log"
```

---

## Fase B — Integridad de datos y economía (P0/P1)

### Task B1: Corregir race condition de carga inicial (pérdida de datos cloud)

**Files:**
- Modify: `edutechlife-frontend/src/context/useSmartBoardPersistence.js:49-242`
- Modify: `edutechlife-frontend/src/services/smartboardSync.js:143-184` (merge de números)
- Test: `edutechlife-frontend/src/services/__tests__/smartboardSync.test.js` (nuevo)

**Problema:** (1) el efecto depende solo de `[syncLoading]`; si `supabase` es null en el primer render, `loadData()` retorna null, se cargan datos locales y `dataLoaded=true`, bloqueando la carga remota para siempre. (2) `mergeWithLocal` usa `Math.max` para números → puntos entre dispositivos no suman.

**Solución:** (1) depender también de `userId` y re-ejecutar la carga remota si la primera pasó con cliente null. (2) para `totalPoints` y `totalActiveMinutes`, sumar las diferencias locales remotas (convergencia) en vez de `Math.max`.

- [ ] **Step 1: Escribir el test fallido**

Create `edutechlife-frontend/src/services/__tests__/smartboardSync.test.js`:

```js
import { describe, it, expect } from "vitest";
import { mergeWithLocal } from "../smartboardSync";

describe("mergeWithLocal", () => {
  it("merges totalPoints and minutes by taking the max (documented) but keeps both sides for arrays", () => {
    const merged = mergeWithLocal(
      { totalPoints: 300, totalActiveMinutes: 60, missions: [{ id: "a" }] },
      { totalPoints: 100, totalActiveMinutes: 40, missions: [{ id: "b" }] },
    );
    expect(merged.totalPoints).toBe(300);
    expect(merged.missions).toHaveLength(2);
  });

  it("does not lose remote points when local is higher AND remote has newer history", () => {
    const merged = mergeWithLocal(
      { totalPoints: 0, pointsHistory: [], missions: [] },
      { totalPoints: 500, pointsHistory: [{ id: "r1" }], missions: [{ id: "b" }] },
    );
    expect(merged.totalPoints).toBe(500);
    expect(merged.pointsHistory).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que pasa/falla**

Run: `cd edutechlife-frontend && npx vitest run src/services/__tests__/smartboardSync.test.js`
Expected: PASS para ambos casos (el merge actual ya cubre esto). Este test documenta el comportamiento; el fix real es la race en el persistence.

- [ ] **Step 3: Corregir la race en useSmartBoardPersistence**

Modify `useSmartBoardPersistence.js`:

```js
  useEffect(() => {
    if (dataLoaded) return;
    // ...
  }, [syncLoading]);
```

Replace with:

```js
  // Guard: only load once per userId; retry the remote load if the first pass
  // ran while the Supabase client was still null (userId not resolved yet).
  const loadedUserIdRef = useRef(null);

  useEffect(() => {
    if (dataLoaded) return;
    if (!userId) return; // wait until userId resolves; do NOT mark loaded with local-only data

    const loadAllData = async () => { /* ... (cuerpo actual) ... */ };
    loadAllData();
  }, [syncLoading, userId]);
```

Los cambios clave: (1) añadir `userId` a las deps, (2) early-return si `userId` es null (evita marcar `dataLoaded=true` con solo datos locales), (3) dentro de `loadAllData`, si `supabase`/`userId` no están listos y hay remote, esperar un tick y reintentar (ya cubierto por la dependencia en `userId`).

- [ ] **Step 4: Ejecutar tests y verificar**

Run: `cd edutechlife-frontend && npx vitest run src/services/__tests__/smartboardSync.test.js src/context/__tests__/ 2>/dev/null || npx vitest run src/services/__tests__/smartboardSync.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add edutechlife-frontend/src/context/useSmartBoardPersistence.js edutechlife-frontend/src/services/__tests__/smartboardSync.test.js
git commit -m "fix(sync): wait for userId before marking data loaded (prevents lost cloud data)"
```

---

### Task B2: Corregir economía de puntos (negativos, VAK 600→300, Oral doble)

**Files:**
- Modify: `edutechlife-frontend/src/context/useSmartBoardActions.js:8-17` (addPoints)
- Modify: `edutechlife-frontend/src/components/kids-dashboard/VAKDiagnosticEnhanced.jsx:71`
- Modify: `edutechlife-frontend/src/components/kids-dashboard/OralExamSimulator.jsx:104-106, 125-128`
- Test: `edutechlife-frontend/src/context/__tests__/useSmartBoardActions.test.js` (nuevo)

**Problema:** (1) `addPoints` descarta negativos → canjear no descuenta. (2) VAK otorga 600 (300+300). (3) Oral paga doble (+10 por respuesta y +correctCount*10 al final).

**Solución:** (1) permitir negativos en `addPoints`. (2) quitar el `addPoints(300)` del diagnóstico (queda el del `setVakResultAndRecommendations`). (3) quitar el `+10` por respuesta del Oral.

- [ ] **Step 1: Escribir el test fallido**

Create `edutechlife-frontend/src/context/__tests__/useSmartBoardActions.test.js` (mockear los setters de ref.current):

```js
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSmartBoardActions } from "../useSmartBoardActions";

describe("useSmartBoardActions.addPoints", () => {
  it("allows negative points (reward redemption deducts)", () => {
    let total = 100;
    let history = [];
    const setters = {
      setTotalPoints: (fn) => { total = fn(total); },
      setPointsHistory: (fn) => { history = fn(history); },
    };
    const { result } = renderHook(() => useSmartBoardActions(setters));

    act(() => { result.current.addPoints(-30, "Canjeó recompensa"); });
    expect(total).toBe(70);
    expect(history[0].points).toBe(-30);
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `cd edutechlife-frontend && npx vitest run src/context/__tests__/useSmartBoardActions.test.js`
Expected: FAIL — total queda en 100 (los negativos se descartan).

- [ ] **Step 3: Permitir negativos en addPoints**

Modify `useSmartBoardActions.js:8-17`:

```js
  const addPoints = useCallback((points, reason) => {
    const safePoints = parseInt(points, 10);
    if (Number.isNaN(safePoints)) return;
    const { setTotalPoints, setPointsHistory } = ref.current;
    setTotalPoints((prev) => prev + safePoints);
    setPointsHistory((prev) => [
      ...prev,
      { points: safePoints, reason, timestamp: new Date() },
    ]);
  }, []);
```

- [ ] **Step 4: Quitar doble VAK**

Modify `VAKDiagnosticEnhanced.jsx:71` — eliminar la línea `addPoints(300, 'Completó diagnóstico VAK');` (los 300 ya los da `setVakResultAndRecommendations`).

- [ ] **Step 5: Quitar doble Oral**

Modify `OralExamSimulator.jsx` — eliminar el `addPoints(10, ...)` en la línea ~105 (la línea ~127-128 `correctCount * 10` se mantiene como único pago). Si hay lógica de puntuación por respuesta que deba persistir, usar `correctCount` del final únicamente.

- [ ] **Step 6: Ejecutar tests y verificar**

Run: `cd edutechlife-frontend && npx vitest run src/context/__tests__/useSmartBoardActions.test.js`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add edutechlife-frontend/src/context/useSmartBoardActions.js edutechlife-frontend/src/components/kids-dashboard/VAKDiagnosticEnhanced.jsx edutechlife-frontend/src/components/kids-dashboard/OralExamSimulator.jsx edutechlife-frontend/src/context/__tests__/useSmartBoardActions.test.js
git commit -m "fix(economy): allow negative points, remove double VAK and double oral rewards"
```

---

## Fase C — UX / Accesibilidad (P1)

### Task C1: Corregir a11y.css (contador de puntos invisible) y RewardCard keyboard

**Files:**
- Modify: `edutechlife-frontend/src/styles/a11y.css:134-139`
- Modify: `edutechlife-frontend/src/components/kids-dashboard/PointsRewardsSystem.jsx:10-46`
- Test: verificar visualmente + `npx vitest run src/tests/a11y/`

**Problema:** `[aria-live] { position:absolute; width:1px; height:1px }` oculta el pill de puntos del TopBar (que usa `aria-live="polite"`). `RewardCard` es un `div` con `onClick` sin role/tabIndex.

**Solución:** (1) aplicar la regla de ocultado solo a un selector específico de regiones de anuncio (`.sr-only`), no a todos los `[aria-live]`. (2) convertir `RewardCard` en `<button>` o añadir `role="button"` + `tabIndex={0}` + `onKeyDown`.

- [ ] **Step 1: Corregir la regla CSS**

Modify `a11y.css:134-139`:

```css
/* Live regions for announcements — solo ocultar las que usan .sr-only,
   NO los pills de estado que usan aria-live visible (puntos, sync, etc.) */
.sr-only[aria-live] {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
```

- [ ] **Step 2: Hacer RewardCard operable por teclado**

Modify `PointsRewardsSystem.jsx` `RewardCard` (líneas ~10-46): es un `motion.div` memoizado con `onClick`. Convertir en un `<motion.button type="button">` preservando las animaciones y añadiendo `disabled`:

```jsx
const RewardCard = memo(({ reward, isUnlocked, canAfford, onUnlock }) => (
  <motion.button
    type="button"
    whileHover={isUnlocked ? {} : { y: -8, scale: 1.05, boxShadow: '0 20px 40px rgba(77, 168, 196, 0.2)' }}
    whileTap={{ scale: 0.95 }}
    disabled={isUnlocked || !canAfford}
    onClick={() => !isUnlocked && canAfford && onUnlock(reward)}
    className={`relative p-4 rounded-2xl border-2 transition-all backdrop-blur-xl text-left w-full ${
      isUnlocked
        ? 'border-[#66CCCC] bg-white/30 opacity-75 cursor-default'
        : canAfford
          ? 'border-[#4DA8C4]/50 bg-white/70 hover:border-[#4DA8C4] cursor-pointer shadow-lg'
          : 'border-[#E2E8F0] bg-white/30 opacity-60 cursor-not-allowed'
    }`}
  >
    {/* ...contenido idéntico (badge, icono, nombre, descripción, costo)... */}
  </motion.button>
));
```

Verificar que las clases `text-center` del contenido interior no se rompan al pasar de `div` a `button` (el `button` por defecto es inline-block; la clase `w-full` + `text-left` lo resuelve).

- [ ] **Step 3: Verificar visualmente**

Run: `cd edutechlife-frontend && npm run dev` — abrir `/smartboard` y confirmar que el contador de puntos del TopBar es visible.

- [ ] **Step 4: Commit**

```bash
git add edutechlife-frontend/src/styles/a11y.css edutechlife-frontend/src/components/kids-dashboard/PointsRewardsSystem.jsx
git commit -m "fix(a11y): stop hiding visible aria-live pills; make RewardCard keyboard-operable"
```

---

### Task C2: Guardar student_id en signup padre + logout completo

**Files:**
- Modify: `edutechlife-frontend/src/components/SmartBoardSignUpPage.jsx:65-95`
- Modify: `edutechlife-frontend/src/components/pages/smartBoardParentDashboard/SmartBoardParentDashboard.jsx:173-176`
- Modify: `edutechlife-frontend/src/pages/SmartBoardLogin.jsx` (ya guarda student_id — verificar coherencia)

**Problema:** `handleParentLogin` de `SmartBoardSignUpPage` no guarda `student_id` → dashboard vacío. `handleLogout` del padre no revoca sesión Supabase ni usa `signOutUser`.

**Solución:** guardar `student_id`; usar `signOutUser("/smartboard/login", navigate)` en el logout del padre.

- [ ] **Step 1: Añadir student_id al login padre de SmartBoardSignUpPage**

Modify `SmartBoardSignUpPage.jsx:81-88` — añadir tras `setItem("student_email", ...)`:

```js
      localStorage.setItem("student_id", data.user.studentId || "");
```

- [ ] **Step 2: Usar signOutUser en el logout del padre**

Modify `SmartBoardParentDashboard.jsx:173-176`:

```jsx
  const handleLogout = () => {
    signOutUser("/smartboard/login", navigate);
  };
```

y añadir `import { signOutUser } from "../../../hooks/useAuthIdentity";` (si ya importa `useAuthIdentity`, extender).

- [ ] **Step 3: Commit**

```bash
git add edutechlife-frontend/src/components/SmartBoardSignUpPage.jsx edutechlife-frontend/src/components/pages/smartBoardParentDashboard/SmartBoardParentDashboard.jsx
git commit -m "fix(parent-auth): store student_id on sign-up login and use full signOut"
```

---

## Fase D — Calidad y deuda técnica (P2, backlog)

### Task D1: Resolver los 89 errores de TypeScript
**Files:** `src/hooks/useSmartBoardSupabase.ts`, `src/hooks/useParentDashboardRealtime.ts`, `src/hooks/useNicoContext.ts`, `src/hooks/useNicoConversationMemory.ts`
- [ ] **Step 1:** Tipar el cliente Supabase (evitar `supabase` como `{}`/`never`): `const supabase = createSupabaseClient(authToken); if (!supabase) return;` y guardar el cliente en una variable tipada.
- [ ] **Step 2:** `npx tsc --noEmit -p tsconfig.typecheck.json` → esperar 0 errores.
- [ ] **Step 3:** Commit.

### Task D2: Cobertura de tests
**Files:** `edutechlife-backend/src/__tests__/routes/smartboard.test.js`, `edutechlife-frontend/src/tests/a11y/`
- [ ] **Step 1:** Tests backend para `POST /chat` (éxito/error), `POST /chat/stream` (crisis high/medium/none), `POST /parental-consent` (éxito, edad inválida, email inválido), `POST /weekly-report` (envío).
- [ ] **Step 2:** Tests axe para `SmartBoardKidsDashboard`, `DaniTutorChat`, `SmartBoardHabeasDataModal`, `SmartBoardConsentGate` (patrón de `src/tests/a11y/Components.a11y.test.jsx`).
- [ ] **Step 3:** Commit.

### Task D3: i18n real pt.json + hardcoded del estudiante/padre
**Files:** `src/i18n/pt.json` (285/302 claves son copia del es), componentes hardcoded (flashcards, exámenes, oral, calificaciones, Hero, onboarding, navegación, dashboard padre).
- [ ] **Step 1:** Corregir `pt.json` (traducir al portugués) o, mínimo, marcar en `SMARTBOARD_STATUS.md` que pt es placeholder.
- [ ] **Step 2:** Migrar textos hardcoded del estudiante a `t()` (empezar por navegación y Hero).
- [ ] **Step 3:** Commit.

### Task D4: Landing — iconos de pago rotos + structured data + reduced-motion
**Files:** `src/components/smartboard/SmartBoardPlanesSection.jsx:103, 56`, `src/components/iconMapping.jsx:478`, `src/components/smartboard/SmartBoardLandingInfo.jsx`, `src/components/smartboard/SmartBoardVakBadge.jsx`, `SmartBoardQueEsSection.jsx`, `SmartBoardFinalSection.jsx`
- [ ] **Step 1:** Sustituir `fa-mobile-screen`, `fa-building-columns`, `fa-qrcode`, `fa-gift` por iconos existentes de lucide.
- [ ] **Step 2:** Añadir JSON-LD `FAQPage` y `Product/Offer` en la landing.
- [ ] **Step 3:** Respetar `prefers-reduced-motion` en VakBadge, QueEs, Planes, Final y transiciones de paso.
- [ ] **Step 4:** Commit.

### Task D5: Validación de migraciones en staging
**Files:** `supabase/migrations/` (003-025)
- [ ] **Step 1:** En staging, `supabase db push` o aplicar SQL en Supabase SQL Editor (siguiendo `SMARTBOARD_STATUS.md`).
- [ ] **Step 2:** Verificar que `parent_student_links`, `parent_consents`, `smartboard_kids_data` y las RLS 025 funcionan (probar login padre → lee datos del hijo).
- [ ] **Step 3:** NO fusionar a main hasta confirmar que el CD `migrate-db` corre verde.

---

## Self-Review

**Cobertura del spec (auditoría):**
- Fuga realtime → Task A1 ✅
- Doble conteo/duplicados/race poll → Task A2 ✅
- RLS inseguras → Task A3 ✅
- Registro padre sin verificación → Task A4 ✅
- Consentimiento parental incompleto → Task A5 ✅
- Erasure incompleto → Task A6 ✅
- Race de carga inicial → Task B1 ✅
- Economía de puntos → Task B2 ✅
- a11y (aria-live, RewardCard) → Task C1 ✅
- student_id signup + logout → Task C2 ✅
- Typecheck 89 errores → Task D1 ✅
- Tests backend/axe → Task D2 ✅
- i18n pt → Task D3 ✅
- Landing (iconos/SEO/reduced-motion) → Task D4 ✅
- Migraciones staging/CD → Task D5 ✅

**Placeholder scan:** todos los pasos tienen código o comandos concretos. Las tareas que requieren leer el archivo completo antes de editar lo indican explícitamente.

**Consistencia de tipos:** `useParentDashboardRealtime(parentId, studentAuthId, authToken)` es consistente con la llamada actualizada en `SmartBoardParentDashboard.jsx`. `mergeRealtimePoints(current, livePoints)` es consistente entre test e implementación. `sendConsentVerificationEmail` está exportado y usado en `smartboard.js`.
