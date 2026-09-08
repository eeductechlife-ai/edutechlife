# STAGING DEPLOYMENT REPORT

**Fecha:** 2026-08-29
**Rama:** `recovery/foundation-phase-a`
**Entorno:** STAGING real (Supabase `dxirtihrpnlnxkxpmkmx` + backend en-runner contra staging).

## 1. Supabase staging (validado)

| Item | Valor |
|---|---|
| Proyecto | `edutechlife-staging` — ref `dxirtihrpnlnxkxpmkmx` (org wxkzggyqvgufiowfiglw, us-east-1) |
| Migraciones | 000 → 059 aplicadas (`supabase db push`, run CI `33267431885`) |
| Schema | **SCHEMA_OK · OK=17 · MISSING=[]** (17 tablas críticas) |
| Correcciones reveladas por el entorno remoto | `--region` requerido en create; `uuid_generate_v4()` → `gen_random_uuid()` (27 reemplazos; pgcrypto no está en search_path de Supabase remoto) |

## 2. Backend staging

| Check | Resultado |
|---|---|
| Boot | ✅ `node src/index.js` en-runner (run CI `33273034491`/`33273674218`) contra staging Supabase |
| Health | ✅ `/api/health` 200 |
| DB | ✅ login/profile/mastery/plan/parent operan contra staging (journey 15/20) |
| Auth | ✅ `/api/auth/login` STUDENT_A → token; PARENT_A → token |
| CORS | ⚠️ `CORS_ORIGINS` env-ready en `app.js`; el frontend staging aún no está desplegado |
| Environment | Separado: `STAGING_SUPABASE_URL`/keys de staging obtenidas en-CI, nunca en transcript |

## 3. Frontend staging

- **No desplegado** en esta sesión: requiere crear un proyecto Vercel staging (`VERCEL_TOKEN` existe) y apuntar `VITE_SUPABASE_URL`/`VITE_API_BASE_URL` a staging. La verificación del journey se hizo a nivel de API (backend) contra staging real.

## 4. Isolation LOCAL != STAGING != PRODUCTION

| Señal | LOCAL | STAGING | PRODUCTION |
|---|---|---|---|
| Supabase ref | local/dev | `dxirtihrpnlnxkxpmkmx` | `srirrwpgswlnuqfgtule` |
| Backend | localhost:3001 | in-runner → staging | edutechlife-backend.onrender.com |
| Keys | local | staging (en-CI) | prod |
| Referencias cruzadas | — | grep verificado: ningún `srirrwpgswlnuqfgtule` en el código de staging | — |

## 5. Secrets (NO se muestran valores)

| Secret | Estado | Plataforma | Usa |
|---|---|---|---|
| `SUPABASE_ACCESS_TOKEN` | ✅ presente | GitHub Actions | crear/linkear proyecto staging |
| `SUPABASE_DB_PASSWORD` | ✅ presente | GitHub Actions | password del proyecto staging (creado con este valor) |
| `VERCEL_TOKEN`, `VERCEL_ORG_ID` | ✅ presente | GitHub Actions | frontend/backend staging (pendiente) |
| **`DEEPSEEK_API_KEY`** | ❌ **FALTA** | GitHub Actions | backend staging → Dani / AI (journey step `Dani A` = 500 "API key no configurada") |
| **`RENDER_API_KEY`** | ❌ **FALTA** | Render | SOLO si se quiere un servicio backend-staging persistente en Render (`RENDER_DEPLOY_HOOK` es de producción y no se toca) |

> Alternativa al backend persistente: el backend se ejecutó y validó en-runner contra staging; para uso continuo se puede desplegar a Vercel (backend tiene `vercel.json` + `api/index.js`) usando `VERCEL_TOKEN`.
