# FOUNDATION PHASE A — VERIFICATION

**Fecha:** 2026-08-29
**Rama:** `recovery/foundation-phase-a`
**Checkpoint:** `feature/smartboard-3.0` @ `7653a9d`
**Precedente:** `FOUNDATION_PHASE_A_REPORT.md` (estado DONE local)

---

## 1. SECURITY CREDENTIAL ROTATION — estado

**Clave comprometida:** service-role key de Supabase (proyecto `srirrwpgswlnuqfgtule`), encontrada en `~/.claude/settings.local.json` (repo `.claude/settings.local.json`).

### Scan de copias (sin imprimir valores)

| Destino | Resultado |
|---|---|
| git tracked files | **NINGUNA** |
| repo (excl. node_modules/.git) | 4 worktrees: `scripts/configure-supabase-jwt.js`, `scripts/execute-sql-now.js` (x6) + `settings.local.json` (x2) + `edutechlife-backend/.env` (correcto) |
| `~/.claude` / opencode config | ninguna (el archivo real es `.claude/settings.local.json` del repo) |
| shell history (`~/.zsh_history`, `~/.bash_history`) | **ninguna** |
| `/tmp` | **ninguna** |
| docs / logs / test snapshots | **ninguna** |

### Limpieza ejecutada (LOCAL)
- **6 scripts** en worktrees (`configure-supabase-jwt.js`, `execute-sql-now.js` x 4 worktrees): key hardcodeada → `process.env.SUPABASE_SERVICE_ROLE_KEY || ''`. Sintaxis validada (`node -c` OK en los 8).
- **3 `settings.local.json`** (repo + worktrees `competent-bun`, `gracious-mccarthy`): key → `ROTATED_KEY_PLACEHOLDER`.
- **Re-scan post-limpieza:** `NONE in tracked files` · `NONE in repo files (except .env)`.
### ROTACIÓN — DECISIÓN DEL EQUIPO (2026-08-29): NO SE ROTA, RIESGO ACEPTADO

El equipo decidió **mantener la key actual** y no ejecutar el Roll ahora. Las copias en texto plano fueron eliminadas, pero la key sigue siendo la misma válida que estuvo expuesta. **Riesgo aceptado y documentado** (no bloqueante). La rotación queda como **tarea pendiente prioritaria** y debe ejecutarse lo antes posible.

**Qué cambia si se rota (cuando se haga):**
1. Dashboard → project `srirrwpgswlnuqfgtule` → Settings → API Keys → service_role → **Roll** (mata la vieja, genera nueva con `iat` de hoy y fingerprint distinto a `77eab01c3d4720e8`).
2. Pega la key nueva en: (a) `edutechlife-backend/.env` (`SUPABASE_SERVICE_ROLE_KEY` **y** alias `SUPABASE_SERVICE_KEY`, ambas con el mismo valor), (b) **Render** (`SUPABASE_SERVICE_ROLE_KEY`, y reemplazar/borrar `SUPABASE_SERVICE_KEY` si existe), (c) redeploy de Render.
3. Verificar `curl https://edutechlife-backend.onrender.com/api/health` → 200.
4. Avisar para re-scan + cierre definitivo.

**Riesgo de rotar:** invalida la key actual → llamadas del backend caen hasta propagar la nueva a Render (ventana de minutos). **Rollback:** no existe "un-roll"; mitigación = propagar la nueva de inmediato (Render primero).

---

## 2. PRODUCTION CONFIG GATE — Render

| Evidencia | Resultado |
|---|---|
| Backend prod `GET /api/health` | **HTTP 200** `{"status":"ok","uptime":42739s,"deepseekConfigured":true}` |
| Inferencia env var | El código desplegado es el **viejo** (sin fallback legacy) y aun así bootea → **Render YA define `SUPABASE_SERVICE_ROLE_KEY`** (si no, los 8 servicios crashearían al arrancar) → `VERIFIED` |
| Fallback legacy | Documentado como **transición**; se eliminará cuando IALab (proyecto separado) migre al canónico. Fecha propuesta: cierre de FASE B. Condición: IALab sin lecturas de `SUPABASE_SERVICE_KEY`. |

---

## 3. PRODUCTION HEALTH CHECK (sin cambios destructivos)

| Check | Resultado |
|---|---|
| Backend reachable | **HTTP 200** (`/api/health`) |
| Auth SmartBoard (sin token) | **HTTP 401** en `/api/smartboard/data/:id` y `/student-profile` → auth enforced |
| Ruta reciente `/adaptive/state` | **HTTP 404** → producción corre código anterior (deploy no actualizado; pipeline roto, FASE G) |
| Frontend prod `edutechlife.co` | **HTTP 200** (tras redirect 308 normal) |
| Supabase DB | **HTTP 200** `GET /rest/v1/competencies?limit=1` con anon key → DB reachable, tabla `competencies` existe, RLS público funciona |

---

## 4. RE-RUN TESTS / BUILD / LINT

| Check | Resultado | Evidencia |
|---|---|---|
| `npm test` | **VERIFIED** | 29/29 suites · **301/301 tests** |
| Boot backend | **VERIFIED** | `BOOT_OK` (`require('dotenv').config(); require('./src/app')`) |
| Sintaxis | **VERIFIED** | `node -c src/index.js` → OK |
| `verify-keys.sh` | **VERIFIED** | `EXIT=0` · ALL CHECKS PASSED |
| Lint | **VERIFIED** | `0 errores, 97 warnings` (fix: globals de vitest en `eslint.config.mjs` para `src/routes/__tests__/*`) |

---

## 5. SECURITY VERIFICATION

| Check | Estado |
|---|---|
| Secrets tracked | **VERIFIED** (ninguna key en git-tracked) |
| Secrets in source | **VERIFIED** (worktrees limpiados; única copia restante = `.env` gitignored) |
| Secrets in docs | **VERIFIED** (docs con placeholders `eyJ...`) |
| Secrets in test snapshots | **VERIFIED** (ninguna; `storybook-static` contiene solo la **anon key**, pública por diseño) |
| Secrets in logs | **VERIFIED** (ninguna en `/tmp`, shell history, reports) |
| `load-test-heartbeat.js` mockToken | Falso (99 chars, payload no-JSON) → no es credencial |

**Nota:** la anon key en el bundle de storybook es pública por diseño (no es un leak). Recomendación: gitignorear `playwright-report/` (está trackeado).

---

## 6. MATRIZ LOCAL / STAGING / PRODUCTION

| Elemento | LOCAL | STAGING | PRODUCTION |
|---|---|---|---|
| Boot | **VERIFIED** (`BOOT_OK`) | **N/A** (no existe) | **VERIFIED** (health 200, uptime 12h) |
| Env | **VERIFIED** (canónico + alias) | N/A | **VERIFIED** (inferido: boot del código viejo) |
| Auth | **VERIFIED** (middleware tests 401/403) | N/A | **VERIFIED** (401 reales en rutas) |
| DB | **PARTIAL** (tests con mocks; conexión real solo vía anon REST) | N/A | **VERIFIED** (REST 200, `competencies` existe) |
| Tests | **VERIFIED** (301/301) | N/A | N/A (no se ejecutan en prod) |

---

## 7. GATE — FASE A

| # | Criterio | Estado |
|---|---|---|
| 1 | Backend local funciona | ✅ VERIFIED |
| 2 | Backend producción funciona | ✅ VERIFIED |
| 3 | Nueva service-role key activa | ⚠️ **EXCEPCIÓN DOCUMENTADA** — decisión del equipo: no se rota; riesgo aceptado |
| 4 | Antigua key retirada | ⚠️ **EXCEPCIÓN DOCUMENTADA** — sigue vigente por decisión del equipo |
| 5 | Secrets limpios | ✅ VERIFIED (copias planas eliminadas; `.env` es la ubicación correcta) |
| 6 | Tests passing | ✅ VERIFIED (301/301) |
| 7 | Build passing | ✅ VERIFIED (sintaxis + boot) |
| 8 | Lint passing | ✅ VERIFIED (0 errores) |
| 9 | Health check passing | ✅ VERIFIED |
| 10 | Rollback disponible | ✅ VERIFIED (rama `recovery/foundation-phase-a`) |

---

## ESTADO FINAL

# VERIFIED (con excepción documentada)

FASE A = **VERIFIED**. 8/10 criterios sin reservas; los 2 restantes (rotación de la service-role key) se aceptan como **riesgo conocido por decisión del equipo** (excepción documentada en §1). La rotación queda como **tarea pendiente prioritaria** y debe ejecutarse antes de un release.

**Tarea pendiente (no bloqueante para FASE B):**
- [ ] Rotar service-role key en Dashboard Supabase y propagar a `.env` + Render (instrucciones en §1).
