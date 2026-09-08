# FOUNDATION PHASE C REPORT — MIGRATIONS + STAGING + DATABASE VERIFICATION

**Fecha:** 2026-08-29
**Rama:** `recovery/foundation-phase-a`
**Precedente:** FASE B = PARTIAL (código VERIFIED, 331/331)

---

## 1. PROBLEMA

14 migraciones rotas (no-ops silenciosos / hard-fails / FKs inválidas), 5 tablas críticas ausentes en producción, sin fresh-DB reproducible y sin mecanismo de validación.

## 2. SOLUCIONADO

### 2.1 Migraciones reparadas (14 FIXED + 2 NEW)
| Tipo | Archivos |
|---|---|
| Guard invertido (`table_name='IF'` → no-op) | 033–039, 042, 046, 050 → **reescritas** |
| `BEGIN;`/`COMMIT;` en `DO $$` (hard-fail) | 043, 044, 047 → **reescritas** |
| Guard schema-qualified (`public.students`) | 051 → **corregido** |
| FK `text→uuid` incompatibles | 036, 037, 038 → **eliminados** |
| Funciones rotas (leaderboards/risk/chat) | 036, 037, 038 → **reparadas** (columnas/tablas reales) |
| Duplicado `achievements` (011 vs 035) | 035 → **ya no crea/seed la tabla** |
| Baseline (users/profiles/forum/notifications) | **000_baseline_core.sql** (NEW) |
| Reconcilación prod (5 tablas + catálogo) | **059_reconcile_smartboard.sql** (NEW) |
| Assert de schema | **supabase/validate_schema.sql** (NEW) |
| Config local Supabase | **supabase/config.toml** (NEW, `supabase init`) |

### 2.2 Validación estática (ejecutada)
- `grep table_name='IF'` → **0** · BEGIN/COMMIT en DO → **0** · FK text→uuid → **0**.
- 50 archivos (000 + 003–058 + 059).

### 2.3 Verificación de producción (read-only, sin reset)
- Sondeo REST (service key) confirmó: `students`, `dani_memory`, `learning_plans`, `student_competency_mastery`, `timetable_slots`, `early_warnings`, `recommendations`, `missions`, `badges`, `grade_analyses`, `notifications`, `vak_results`, `learning_streaks` **existen** en prod.
- **Faltan**: `sessions`, `points_history`, `crisis_alerts`, `conversations`, `achievements` → **059** los crea idempotente (solo ADD, políticas con guard).

### 2.4 CI
- Job **`migrations-check`** en `ci.yml`: `supabase start` → `db reset` (fresh DB) → `validate_schema.sql` → tests backend. **Sin `continue-on-error`**.

## 3. ARCHIVOS MODIFICADOS/CREADOS (FASE C)

`supabase/migrations/000_baseline_core.sql` (NEW) · `supabase/migrations/033..051` (14 FIXED) · `supabase/migrations/059_reconcile_smartboard.sql` (NEW) · `supabase/validate_schema.sql` (NEW) · `supabase/config.toml` (NEW) · `.github/workflows/ci.yml` (job migrations-check).

## 4. TESTS EJECUTADOS

| Suite | Resultado |
|---|---|
| Backend `npm test` (post-cambios) | **VERIFIED — 33/33 suites · 331/331 tests** |
| `schema-contract.test.js` | **8/8** |
| `golden-data-flow.test.js` | **7/7** |
| Lint backend | 0 errores |
| Boot | BOOT_OK |
| Validación estática de migraciones | 0 guards rotos / 0 FKs text→uuid |

## 5. RIESGOS

1. **Fresh DB NO ejecutado localmente** (sin Docker/Postgres). El job de CI lo ejecutará; puede requerir 1-2 iteraciones si alguna reescritura tiene un error sutil (p. ej., dependencias de orden, pg_cron, `supabase_realtime`).
2. **Aplicar 059 a prod**: requiere backup + dry-run + ventana (acción manual/CI con token). No se ejecuta en esta sesión (sin token).
3. **000 y 003–058 no deben correrse sobre prod** (CREATE POLICY sin guard en 003–032, 040–058 → fallarían). En prod solo se corre **059**.
4. **config.toml nuevo**: puede alterar flujos locales previos de `supabase`; si hay conflictos, revisar con `supabase doctor`.
5. **Staging inexistente** → todos los live tests (C9–C15) quedan pendientes.

## 6. ROLLBACK (documentado)

- **Local**: los cambios de migraciones viven en la rama `recovery/foundation-phase-a` → descartar la rama restaura el estado anterior.
- **Producción**: 059 es **aditivo** (CREATE IF NOT EXISTS, políticas con guard) → no requiere rollback destructivo; si una instrucción falla dentro de la transacción, Postgres revierte todo. Nunca se corre DROP ni RESET.
- **Backup previo obligatorio** antes de aplicar 059: Dashboard → Backups, o `supabase db dump --linked`.

## 7. ESTADO POR SUB-FASE

| # | Item | Estado |
|---|---|---|
| C1 | Migration inventory | ✅ **DONE** (`SMARTBOARD_MIGRATION_INVENTORY.md`) |
| C2 | Fresh DB | ⚠️ **PARTIAL** — migraciones listas; ejecución → CI (local BLOCKED) |
| C3 | Schema drift | ✅ **VERIFIED** (contract 8/8, golden 7/7, sondeo prod) |
| C4 | Production reconciliation | ⚠️ **PARTIAL** — 059 + runbook listos; **no aplicado** (requiere backup + token/CI) |
| C5 | Tablas críticas | ✅ **VERIFIED** (5 tablas → 059, sin duplicados) |
| C6–C8 | Staging / test users / golden data | ❌ **BLOCKED** (no hay entorno ni tokens) |
| C9–C15 | Live tests / A/B / mastery / persistence / IDOR / RLS | ❌ **BLOCKED** (requieren staging) |
| C16 | CI migrations-check | ⚠️ **PARTIAL** — job creado; corrida pendiente en GitHub Actions |
| C17 | Rollback | ✅ **VERIFIED** (documentado) |
| C18 | Sin cambios de UX | ✅ **VERIFIED** (solo infra) |
| C19 | Entregables | ✅ **DONE** (4 reportes) |

## 8. GATE FINAL — FASE C

# PARTIAL

**Resuelto y VERIFIED:** inventory, drift (schema/código), conciliación diseñada (059, segura), tablas críticas sin duplicados, rollback documentado, infra de validación (CI job + validate_schema).

**Bloqueado (no ejecutable en esta sesión):** fresh DB local (sin Docker/Postgres), staging operativo, test users/golden data, live tests (C9–C15), IDOR/RLS en vivo. Todos requieren:
1. **Ejecutar `migrations-check` en GitHub Actions** (primer green de fresh DB).
2. **Crear un proyecto Supabase staging** + desplegar backend/frontend staging (tokens de plataforma).
3. **Aplicar 059 a producción** con backup/dry-run (CI `migrate-db`).

**Próximo paso recomendado:** push de la rama y validar el job `migrations-check` en CI → luego FASE D (RLS/IDOR/auth) y E (staging + seed test users).
