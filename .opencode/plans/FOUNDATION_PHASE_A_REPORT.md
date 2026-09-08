# FOUNDATION PHASE A REPORT — BOOT & ENV

**Fecha:** 2026-08-29
**Rama:** `recovery/foundation-phase-a` (checkpoint desde `feature/smartboard-3.0` @ `7653a9d`)
**Ámbito:** Backend / LOCAL. Sin cambios a producción (ver §Riesgos).
**Método:** FASE → IMPLEMENTACIÓN → TEST → EVIDENCIA → GATE

---

## 1. PROBLEMA ORIGINAL

**Split-brain de variables de entorno Supabase** en `edutechlife-backend`:

| Nombre | Quién lo usa |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | 8 servicios SmartBoard (`adaptiveLearning`, `badgeEngine`, `missionEngine`, `earlyWarning`, `parentInsights`, `daniOrchestrator`, `competencyMastery`, `metricsService`) |
| `SUPABASE_SERVICE_KEY` | `db/supabase.js`, `db/sessionClient.js`, 4 archivos IALab, `test-setup.js`, `.env`, docs, `verify-keys.sh` |

**Consecuencia:** con el `.env` (que solo definía `SUPABASE_SERVICE_KEY`), los 8 servicios llamaban `createClient(url, undefined)` al cargar el módulo → **el backend no arrancaba** (`supabaseKey is required`). **9/28 suites de test fallaban** determinísticamente. Husky bloqueaba commits.

**Evidencia previa (verificada):**
```
$ node -e "require('./src/app')"  →  APP LOAD FAILED: supabaseKey is required
$ npm test  →  9 failed suites / 145 passed
```

---

## 2. SOLUCIÓN

**Convención única elegida: `SUPABASE_SERVICE_ROLE_KEY`** (nombre estándar de Supabase; mayoritario en el repo — 8 servicios, scripts root, docs, Edge Function `clerk-webhook`).

Para **no romper producción durante la transición**, se mantiene un **fallback transitorio** a `SUPABASE_SERVICE_KEY` en la capa de datos compartida y en los 8 servicios SmartBoard. El nombre legacy solo permanece en IALab (proyecto separado, intacto por instrucción) y como alias en `.env`.

```
resolución de clave (capa SmartBoard/infra):
  process.env.SUPABASE_SERVICE_ROLE_KEY   ← canónico (primario)
    || process.env.SUPABASE_SERVICE_KEY   ← legacy (transitorio, para IALab/Render)
```

---

## 3. ARCHIVOS MODIFICADOS

| Archivo | Cambio |
|---|---|
| `edutechlife-backend/src/db/supabase.js` | lee canónico como primario + fallback legacy/anon |
| `edutechlife-backend/src/db/sessionClient.js` | lee canónico como primario + fallback legacy |
| `edutechlife-backend/src/services/adaptiveLearning.js` | fallback legacy en `createClient` |
| `edutechlife-backend/src/services/badgeEngine.js` | idem |
| `edutechlife-backend/src/services/missionEngine.js` | idem |
| `edutechlife-backend/src/services/earlyWarning.js` | idem |
| `edutechlife-backend/src/services/parentInsights.js` | idem |
| `edutechlife-backend/src/services/daniOrchestrator.js` | idem |
| `edutechlife-backend/src/services/competencyMastery.js` | idem |
| `edutechlife-backend/src/services/metricsService.js` | idem |
| `edutechlife-backend/src/test-setup.js` | define canónico (+ legacy para tests IALab intactos) |
| `edutechlife-backend/.env` | `SUPABASE_SERVICE_ROLE_KEY` canónica + alias legacy (archivo gitignored, sin riesgo de commit) |
| `edutechlife-backend/.env.example` | **agregadas** `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (+ nota alias) |
| `edutechlife-backend/src/__tests__/db/supabase.test.js` | env var → canónico |
| `edutechlife-backend/src/__tests__/routes/smartboard.test.js` | fix mock `wellbeing-status` (test latente, ver §4) |
| `edutechlife-backend/src/__tests__/boot/env-consistency.test.js` | **NUEVO** — test de regresión de consistencia |
| `verify-keys.sh` | check canónico + STRIPE opcional + fix bug `set -e` con `((i++))` |
| `SETUP_INSTRUCTIONS.md` | docs → canónico |
| `SMARTBOARD_AUTH_GUIDE.md` | docs → canónico |

**No tocados (proyecto separado):** `routes/ialab/*`, `controllers/ialab/*`, `__tests__/routes/ialab.test.js`.

---

## 4. TESTS

### Nuevo test de regresión: `src/__tests__/boot/env-consistency.test.js`
Verifica estáticamente (falla si el drift regresa):
- los 8 servicios SmartBoard contienen `SUPABASE_SERVICE_ROLE_KEY`;
- `db/supabase.js` y `db/sessionClient.js` usan el canónico como **primera** opción (índice < legacy);
- `test-setup.js` define el canónico;
- `.env.example` documenta `SUPABASE_URL` y el canónico.

### Fix de test latente (`smartboard.test.js` — wellbeing-status)
Suite que **nunca corrió** (crasheaba en import por el bug de env). El mock no resolvía `parent_student_links` → la ruta devolvía `calm` por la rama temprana. Se corrigió el mock con `mockImplementation` por tabla (links → alertas). **No se cambió lógica de la ruta.**

### Resultado ejecutado
| Antes | Después |
|---|---|
| 9 failed suites / 145 passed | **29/29 suites, 301/301 tests passed** |

`$ npm test` → `Test Files 29 passed (29) · Tests 301 passed (301)`

---

## 5. BUILD / BOOT

| Check | Resultado | Evidencia |
|---|---|---|
| Sintaxis | **VERIFIED** | `node -c src/index.js` → `SYNTAX_OK` |
| Boot con `.env` (dotenv, como `index.js`) | **VERIFIED** | `require('dotenv').config(); require('./src/app')` → `BOOT_OK` |
| Boot sin crash de `supabaseKey is required` | **VERIFIED** | idem (antes: `APP LOAD FAILED`) |
| `verify-keys.sh` | **VERIFIED** | `EXIT=0` — `Results: 6 passed, 0 failed · ALL CHECKS PASSED` |
| `.env` no rastreado | **VERIFIED** | `git ls-files` sin `.env` |
| CI sin inconsistencias env | **VERIFIED** | grep en `.github/workflows/*` → 0 referencias a ambos nombres |

**Nota lint:** `npm run lint` tiene **6 errores preexistentes** en `src/routes/__tests__/admin.test.js` (faltan globals de vitest en la config ESLint). No vienen de esta fase y el job `backend` de CI no ejecuta lint (solo `node -c` + `npm test`). Queda documentado como pendiente (se resuelve en FASE G).

---

## 6. EVIDENCIA (LOCAL)

1. `BOOT_OK` — backend arranca con `.env` local.
2. `301/301` tests passed — suites antes rotas ahora corren (incluye wellbeing-status, dani, adaptive, mission, badge, early-warning, parent-insights, metrics).
3. `verify-keys.sh` → `ALL CHECKS PASSED` (incluye `SUPABASE_SERVICE_ROLE_KEY is set`).
4. Consistencia residual: `SUPABASE_SERVICE_KEY` solo queda en (a) fallback transitorio explícito, (b) IALab intacto, (c) alias en `.env`/`.env.example`.

**STAGING:** no aplica (no existe entorno staging configurado en esta fase).
**PRODUCTION:** sin cambios por código. Acción manual pendiente del equipo: **agregar `SUPABASE_SERVICE_ROLE_KEY` en el dashboard de Render** (el fallback legacy garantiza que el backend actual no se rompa durante la transición).

---

## 7. RIESGOS

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Render aún solo tenga `SUPABASE_SERVICE_KEY` | Media | Fallback legacy en los 8 servicios + db layer → boot garantizado con cualquier nombre |
| Aliasing de secretos en `.env` (dos claves iguales) | Baja | Transitorio; `.env` gitignored; se elimina al migrar IALab |
| Fresh-install no verificado en CI | Media | Cubierto en FASE G (job `migrations-check`/`backend` en CI con `npm ci` limpio) |
| Test de regresión solo estático | Baja | Complementado por boot real + suite completa |
| **Secreto real en `~/.claude/settings.local.json`** (service-role key en reglas Bash) | **Alta** | **Acción recomendada**: rotar la service-role key y eliminar el secreto de ese archivo. No reproducido ni commiteado aquí |

---

## 8. ROLLBACK

- Rama checkpoint `recovery/foundation-phase-a` creada desde `feature/smartboard-3.0` @ `7653a9d`.
- Rollback = `git checkout feature/smartboard-3.0` (descarta rama) — el árbol original está intacto en HEAD.
- `.env` no versionado → sin riesgo de revertir secretos.
- Ninguna migración remota ni deploy tocado.

---

## 9. ESTADO

# DONE ✅

Todos los criterios del GATE de FASE A verificados con evidencia ejecutada:

| # | Criterio | Estado |
|---|---|---|
| 1 | Backend arranca localmente | **VERIFIED** (`BOOT_OK`) |
| 2 | Arranca con configuración documentada | **VERIFIED** (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` documentados en `.env.example`) |
| 3 | Nombre de variable unificado | **VERIFIED** (canónico primario en SmartBoard + infra; legacy = fallback/IAlab) |
| 4 | `.env.example` actualizado | **VERIFIED** |
| 5 | Tests pasan | **VERIFIED** (301/301) |
| 6 | Build/boot pasa | **VERIFIED** (sintaxis + boot) |
| 7 | Sin secretos hardcodeados | **VERIFIED** (`.env` gitignored) |
| 8 | verify-keys funciona | **VERIFIED** (EXIT=0, ALL CHECKS PASSED) |
| 9 | CI sin inconsistencias env | **VERIFIED** (0 referencias en workflows) |
| 10 | Documentación actualizada | **VERIFIED** |

**Pendientes no bloqueantes (registrados):**
- [ ] Render: setear `SUPABASE_SERVICE_ROLE_KEY` (acción manual de producción).
- [ ] Rotar service-role key + limpiar `.claude/settings.local.json` (seguridad).
- [ ] 6 errores de lint preexistentes en `admin.test.js` (→ FASE G).
- [ ] Fresh-install completo en CI (→ FASE G).
