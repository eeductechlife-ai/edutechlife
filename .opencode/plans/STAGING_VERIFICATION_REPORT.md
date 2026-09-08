# STAGING VERIFICATION REPORT

**Fecha:** 2026-08-29

## Estado: **BLOCKED** (requiere entorno + tokens que no están disponibles localmente)

## 1. Qué se intentó

| Elemento | Intento | Resultado |
|---|---|---|
| Postgres local (fresh DB) | `brew install postgresql@16` | **BLOCKED** — falla por falta de Xcode Command Line Tools; no hay Docker |
| Docker | `docker info` | **BLOCKED** — Docker no está instalado |
| Supabase CLI local | `supabase start` | **BLOCKED** — requiere Docker |
| Fresh DB vía CI | Job `migrations-check` agregado a `ci.yml` | **PENDIENTE** — se ejecuta en GitHub Actions (ubuntu + Docker); es el mecanismo de verificación definitivo |

## 2. Por qué no se pudo crear el entorno staging

- **Sin Docker ni Postgres local**: no se puede ejecutar `supabase start`/`db reset` en esta máquina.
- **Sin tokens de plataforma** (`SUPABASE_ACCESS_TOKEN`, `VERCEL_TOKEN`, `RENDER_DEPLOY_HOOK` no presentes en env local): no se pueden crear proyectos Supabase staging, ni desplegar frontend/backend staging.
- **Sin credenciales de test**: crear STUDENT_A/B/PARENT_A/B + golden data requiere una instancia Supabase con auth real; la de producción está fuera de límites (no crear datos de prueba en prod).

## 3. Lo que SÍ se entregó para desbloquear staging

| Entregable | Ubicación | Propósito |
|---|---|---|
| Migraciones reparadas + baseline | `supabase/migrations/000` + 14 FIXED | Fresh DB reproducible |
| Reconcilación segura | `supabase/migrations/059_reconcile_smartboard.sql` | Crear tablas faltantes en prod sin reset |
| `supabase/config.toml` | `supabase/config.toml` | Necesario para `supabase start` (local/CI) |
| `supabase/validate_schema.sql` | `supabase/validate_schema.sql` | Assert de schema (32 tablas + 16 columnas) |
| Job CI `migrations-check` | `.github/workflows/ci.yml` | Fresh DB + migrations + validación + tests, **sin continue-on-error** |

## 4. Runbook para staging (cuando haya entorno)

1. **Fresh DB**: `supabase start` (Docker) → `supabase db reset` → `psql ... -f supabase/validate_schema.sql`.
2. **Staging Supabase**: crear proyecto staging → `supabase link` → `supabase db push` (o aplicar 000–059 en orden) → correr `validate_schema.sql`.
3. **Test users** (script propuesto en FASE E): crear auth users con `supabase.auth.admin.createUser`:
   - STUDENT_A (12, 7.º, matemáticas débil), STUDENT_B (12, 7.º, matemáticas fuerte), PARENT_A (padre de A), PARENT_B (padre de B) — datos ficticios (ley 1581/COPPA).
   - Seed golden data: mastery bajo en `student_competency_mastery` para A, alto para B.
4. **Backend staging**: apuntar `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` al proyecto staging; verificar boot + `npm test`.
5. **Live tests (C9–C15)**: ejecutar contra staging real (login → profile → competency → rec → plan → activity → mastery → Dani → parent), IDOR (A no lee a B; PARENT_A no lee a B), RLS (SELECT/INSERT/UPDATE/DELETE por rol), persistence (logout/login).

## 5. Entorno actual por capa

| Capa | LOCAL | STAGING | PRODUCTION |
|---|---|---|---|
| Frontend | Rama feature (no deployado) | — (no existe) | Vercel `edutechlife.co` (build:fast) |
| Backend | Boot OK (env unificado, FASE A) | — | Render `edutechlife-backend.onrender.com` (health 200) |
| Supabase | BLOCKED (sin Docker) | — (no existe) | Proyecto `srirrwpgswlnuqfgtule` (5 tablas faltantes → 059) |
| Migraciones | 000–059 escritas, sin ejecutar | — | Hand-built; 059 pendiente |
| Tests | 331/331 backend | — | n/a |
