# SECURITY PHASE D REPORT — AUTHORIZATION + RLS (STAGING VERIFIED)

**Fecha:** 2026-08-29
**Rama:** `recovery/foundation-phase-a`
**Entorno:** STAGING real (Supabase `dxirtihrpnlnxkxpmkmx` + migraciones 000–060 + middleware en backend).
**Run CI:** `33276207535` — job `Golden User Journey + Security Live` **SUCCESS** (journey 19/20 + security 17/17).

---

## 1. AUTHORIZATION MODEL (D1)

```
USER (auth.uid)
 ├─ role student  → students.auth_id = auth.uid  → acceso a SU PROPIA fila y datos derivados
 ├─ role parent   → parent_student_links(parent_user_id=uid, student_user_id=auth_uid_del_hijo, is_active=true)
 ├─ role admin    → app_metadata.role ∈ {admin, content_creator}
 └─ service_role  → backend (bypasea RLS)
```

| Relación | Verificado por | Nivel |
|---|---|---|
| student ownership | middleware `requireStudentAccess` + RLS own-row | backend + DB |
| parent-child ownership | `requireStudentAccess` (parent_student_links) | backend |
| admin | `requireAdmin` (app_metadata) | backend |
| content_creator | `requireAdmin` (app_metadata) | backend |
| service_role | Supabase service key (solo backend) | backend |

**Regla:** la UI **nunca define ownership**; envía `studentId` y el backend verifica; la DB (RLS) impone como segunda barrera.

## 2. IMPLEMENTADO

| Cambio | Archivo |
|---|---|
| Middleware `requireStudentAccess` (estudiante propio + padre vinculado; 403/404; logging `[access-denied]` con requestId/userId/resource/reason) | `src/middleware/ownership.js` |
| Aplicado a **15 rutas** + ownership inline en `warnings/:id/resolve` | `src/routes/smartboard.js` |
| `adminAuth`: token verificado con `supabase.auth.getUser(token)`; rol SOLO desde `app_metadata` (cierra escalación por `user_metadata` editable) | `src/middleware/adminAuth.js` |
| **Migración 060** RLS: elimina 041/049/042 permisivas; own-row + service en students/vak_results/timetable/slots/exams | `supabase/migrations/060_fix_rls_ownership.sql` |
| Tests unitarios del middleware (7) + admin (4) | `src/__tests__/middleware/ownership.test.js`, `admin.test.js` |
| Script live de seguridad (17 checks) | `src/scripts/security-live-test.js` |

## 3. EVIDENCIA — MATRIZ LIVE (staging real, run 33276207535)

| Actor | Resource | Expected | Actual | Result |
|---|---|---|---|---|
| STUDENT_A | login | token | token | ✅ |
| STUDENT_B | login | token | token | ✅ |
| PARENT_A | login | token | token | ✅ |
| PARENT_B | login | token | token | ✅ |
| ADMIN | login | token | token | ✅ |
| STUDENT_A | su mastery | 200 | 200 | ✅ |
| PARENT_A | Student A insights | 200 | 200 | ✅ |
| PARENT_B | Student B insights | 200 | 200 | ✅ |
| ADMIN | `/api/admin/auth/me` | 200 | 200 | ✅ |
| **STUDENT_A → STUDENT_B** | `GET /adaptive/mastery?studentId=B` | **403** | **403** | ✅ |
| **STUDENT_B → STUDENT_A** | `GET /adaptive/mastery?studentId=A` | **403** | **403** | ✅ |
| **PARENT_A → STUDENT_B** | `GET /parent/insights?studentId=B` | **403** | **403** | ✅ |
| **PARENT_B → STUDENT_A** | `GET /parent/insights?studentId=A` | **403** | **403** | ✅ |
| **IDOR write A→B** | `POST /adaptive/mastery {studentId:B}` | **403** | **403** | ✅ |
| **anon** | `GET /rest/v1/students` | 0 filas | **0** | ✅ |
| **STUDENT_A (auth)** | `GET /rest/v1/students` | 1 fila (propia) | **1** | ✅ |
| **STUDENT_B (auth)** | `GET /rest/v1/students` | 1 fila (propia) | **1** | ✅ |

## 4. GOLDEN JOURNEY (regresión funcional post-seguridad)

**19/20** (único no-✓: **Dani BLOCKED** por `DEEPSEEK_API_KEY` faltante — no es fallo de código). IDOR y RLS del journey ahora **pasan**.

## 5. CRITERIO DE ÉXITO FASE D

| Criterio | Estado |
|---|---|
| Student A no puede leer B | ✅ 403 |
| Student B no puede leer A | ✅ 403 |
| Parent A no puede leer B | ✅ 403 |
| Parent B no puede leer A | ✅ 403 |
| Parent A sí puede leer A | ✅ 200 |
| Parent B sí puede leer B | ✅ 200 |
| authenticated no lee estudiantes arbitrarios | ✅ 1 fila propia (RLS own-row) |
| API ownership verified | ✅ 16 rutas con `requireStudentAccess` + tests |
| RLS verified | ✅ 060 aplicada (staging + fresh DB 000-060) |
| IDOR verified | ✅ 5 casos 403 |
| auth verified | ✅ 5 logins + admin `/me` 200 |
| no secrets exposed | ✅ keys enmascaradas por GitHub; tests sin secrets en output |
| regression tests passing | ✅ backend **340/340** · lint 0 · migrations-check (000-060) green · staging-setup green · staging-journey green |

## 6. ESTADO FINAL

# VERIFIED ✅ (FASE D)

Security para **Student / Parent / Admin** verificada contra staging real. Bloqueos residuales que NO son de FASE D:
- `DEEPSEEK_API_KEY` (GitHub Actions) → Dani contextual (fase de features/verificación Dani).
- Persistencia de Dani memory / early-warning escenario forzado → requieren el secret + FASE E.
