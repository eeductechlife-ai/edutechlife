# RLS + IDOR — LIVE REPORT (STAGING REAL) — ACTUALIZADO FASE D

**Fecha:** 2026-08-29 (FASE D aplicada)
**Entorno:** Supabase staging `dxirtihrpnlnxkxpmkmx` + migraciones 000–060 + middleware `requireStudentAccess`.
**Run CI:** `33276207535` — **SECURITY LIVE 17/17 PASSED**.
**Estado previo (antes de FASE D):** vulnerabilidades confirmadas (200 / 2 filas). **Estado actual: CORREGIDO Y VERIFICADO.**

## 1. IDOR (staging real, post-fix)

| Intento | Token | Recurso | Antes | Ahora | Esperado | Result |
|---|---|---|---|---|---|---|
| A → B | STUDENT_A | `GET /adaptive/mastery?studentId={B}` | 200 | **403** | 403 | ✅ |
| B → A | STUDENT_B | `GET /adaptive/mastery?studentId={A}` | 200 | **403** | 403 | ✅ |
| PA → B | PARENT_A | `GET /parent/insights?studentId={B}` | 200 | **403** | 403 | ✅ |
| PB → A | PARENT_B | `GET /parent/insights?studentId={A}` | 200 | **403** | 403 | ✅ |
| IDOR write A→B | STUDENT_A | `POST /adaptive/mastery {studentId:B}` | 200 | **403** | 403 | ✅ |

## 2. RLS (staging real, post-fix)

| Rol | Query | Antes | Ahora | Esperado | Result |
|---|---|---|---|---|---|
| anon | `GET /rest/v1/students` | 0 (ya bloqueado) | **0** | 0 | ✅ |
| authenticated (STUDENT_A) | `GET /rest/v1/students` | **2 filas** | **1 fila** | 1 (propia) | ✅ |
| authenticated (STUDENT_B) | `GET /rest/v1/students` | **2 filas** | **1 fila** | 1 (propia) | ✅ |

## 3. Qué lo corrigió

- **Migración 060** (`supabase/migrations/060_fix_rls_ownership.sql`): eliminó las políticas permisivas `"Enable all for authenticated users"` de 041/049 (students, vak_results) y de 042 (timetable/slots/exams); creó políticas **own-row** + `TO service_role`.
- **Middleware `requireStudentAccess`** aplicado a las 16 rutas `/adaptive/*`, `/parent/*`, `/gamification/*` (+ ownership inline en `warnings/:id/resolve`). El backend resuelve `students.id → auth_id` y verifica estudiante-propio o vínculo de padre; caso contrario **403** con log `[access-denied]` (requestId, userId, resource, reason; sin secrets).

## 4. Conclusión

- **IDOR: VERIFIED** (5 casos 403 en staging real).
- **RLS: VERIFIED** (own-row confirmada: anon 0, autenticado 1 fila propia).
- Ownership impuesto en **backend + DB** (doble barrera); la UI no define ownership.
