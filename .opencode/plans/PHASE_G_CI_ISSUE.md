# PHASE_G_CI_ISSUE — `package-lock.json` / `esbuild@0.28.2`

**Fecha:** 2026-08-29
**Estado:** ANALIZADO — **NO corregido** (condición 14: requiere valorar dependencias).

---

## 1. Síntoma (CI `Smoke Test`)

```
npm error Missing: esbuild@0.28.2 from lock file
npm error Missing: @esbuild/aix-ppc64@0.28.2 ... (todas las plataformas)
```
El job `Smoke Test` falla en `npm ci` antes de correr cualquier test.

## 2. Causa raíz (verificada localmente)

Conflicto de dependencias entre el **vite de producción** y el **vite interno de vitest**:

| Paquete | Versión en lock | Requiere |
|---|---|---|
| `vite` (top-level, dev) | `5.4.21` (pinned) | `esbuild ^0.21.3` |
| `vitest` (dev) | `4.1.10` | `vite ^6.0.0 || ^7.0.0 || ^8.0.0` |
| `vite@8.1.4` (anidado bajo `vitest/node_modules`) | — | `esbuild ^0.27.0 || ^0.28.0` |

- npm instaló `vite@8.1.4` **anidado** para vitest, que exige `esbuild@0.28.x`.
- El lockfile tiene `esbuild@0.21.5` **deduped** (satisfecho para vite 5.4.21) y **no contiene** `esbuild@0.28.2` ni las platform binaries.
- `npm ci` (limpio) recalcula el árbol → detecta que falta `esbuild@0.28.2` → aborta.
- El `node_modules` LOCAL también está inconsistente: `npm ls esbuild` → `ELSPROBLEMS / invalid: esbuild@0.21.5` (espera `^0.27.0 || ^0.28.0`).

**En una frase:** `vitest ^4.1.5` (caret) resolvió a vitest 4.1.10 → vite 8 → esbuild 0.28, pero el lockfile se generó cuando el árbol resolvía a esbuild 0.21.5 (vite 5). El lock quedó **obsoleto/inconsistente** frente a la resolución actual.

## 3. Solución mínima (recomendada, no ejecutada)

| Opción | Cambio | package.json | Riesgo |
|---|---|---|---|
| **A. Regenerar lockfile** (`npm install --package-lock-only`) | `package-lock.json` gana `esbuild@0.28.2` + `@esbuild/*` (anidados bajo `vitest/node_modules/vite`) | **sin cambios** | Lock churn moderado (transitivas); local requerirá reinstall de node_modules; smoke pasará `npm ci`, pero `test:smoke` puede aún fallar por tests rotos preexistentes (FASE G ya trackeada) |
| B. Pinear `vitest` a `^3.2.x` (compatible con vite 5) | `package.json` + lock | **cambia** vitest | Cambio de dependencia importante (condición 14 lo desaconseja ahora) |
| C. Subir `vite` top-level a ^8 | `package.json` + lock | **cambia** vite | Major bump, alto riesgo (build, plugins, blank screen Vercel histórico) |

**Recomendación:** opción **A** en el momento de FASE G: regenerar el lockfile y validar en CI. No tocar vite/vitest en package.json.

## 4. Archivos afectados

- `edutechlife-frontend/package-lock.json` (único cambio necesario).
- `edutechlife-frontend/node_modules` (local, reinstall).
- No se modifican: `package.json`, código fuente, backend, migraciones.

## 5. Riesgo

- **Bajo para producción**: el build usa `vite 5.4.21` pinned; regenerar el lock no cambia la resolución de producción salvo versiones transitivas menores.
- **Medio para CI**: tras el fix, `npm ci` pasará; `test:smoke`/`npm test` del frontend pueden seguir en rojo por los fallos preexistentes documentados en FASE A (collection errors `QuickActions`, `quizCardRender /tmp`, suites rotas) → FASE G los resuelve.
- **Lock churn**: revisar el diff del lock antes de commitear (debe agregar esbuild 0.28 + plataformas, idealmente poco más).

## 6. Verificación del fix (cuando se ejecute)

1. `cd edutechlife-frontend && npm install --package-lock-only`
2. Revisar `git diff --stat package-lock.json` (esperado: +esbuild 0.28.2 + @esbuild/*).
3. `npm ci` (limpio) → debe pasar.
4. `npm run test:smoke` → reportar estado (puede seguir fallando por tests preexistentes).
5. Re-correr CI.

## 7. NO ejecutado (por protocolo)

El fix **no se aplica en esta sesión**: `npm install` modificaría el lockfile (dependencias transitivas). Se ejecutará en FASE G con aprobación.
