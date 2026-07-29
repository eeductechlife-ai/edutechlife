**Date:** 2026-07-29
**Status:** Draft
**Goal:** Optimizar backend, frontend y documentación de la plataforma SmartBoard sin alterar funcionalidad existente.

---

## Current State

### Backend
- `src/routes/ialab.js` — 627 líneas (excede límite 500)
- SSE streams sin cleanup en desconexión del cliente
- Llamadas externas sin timeout (DeepSeek, Replicate)
- `fetchWithRetry` reintenta errores 4xx
- Sin logging estructurado (todo `console.log`/`console.error`)
- Sin cache en respuestas GET
- Supabase usa service_role key en cliente

### Frontend
- `SmartBoardKidsContext` — 494 líneas, 1 efecto con 40 dependencias, 30+ localStorage writes por ciclo
- 4 implementaciones de ErrorBoundary (common, forum, IALab)
- Servicios REST sin retry ni deduplicación de requests
- Componentes kids-dashboard sin memo consistente

### Docs
- Sin ADRs, sin API reference, sin schema DB, sin onboarding guide

---

## Target Structure

### Fase 2 — Backend Optimization (7 items)

```
src/routes/ialab/
├── index.js          ← mount, re-export (10 lines)
├── prompts.js        ← /prompts endpoints (extracted from ialab.js)
├── evaluate.js       ← /evaluate-prompt (extracted)
└── resources.js      ← /resources (extracted)

src/utils/
└── logger.js         ← structured logging (info/warn/error/debug, JSON, requestId)
```

**2.1** Dividir `ialab.js` en `src/routes/ialab/` (4 archivos, cada uno <200 líneas)
**2.2** SSE cleanup: `req.on('close')` en `chat.js` y `smartboard.js`
**2.3** Timeout: `AbortController` en `deepseek.js` (30s) y `avatarService.js` (120s)
**2.4** `fetchWithRetry`: solo reintentar `status >= 500`
**2.5** Logger: middleware injecta `requestId`, rutas usan `logger.info/warn/error`
**2.6** Cache GET: ETag headers en módulos, planes, resources
**2.7** Supabase: reemplazar service key por anon key + RLS

### Fase 3 — Frontend Optimization (5 items)

**3.1** Dividir SmartBoardKidsContext:
- `GamificationContext` — puntos, racha, niveles, logros
- `SessionContext` — sesiones, calendario, streakLog
- `SmartBoardKidsContext` — orquestador fino (chat, VAK, misc)

**3.2** `AppErrorBoundary` unificado:
- Sentry `captureException`
- i18n via `useTranslation`
- Fallback configurable (full-screen vs inline)
- Botón retry + "Recargar página"

**3.3** Wrapper `withRetry(fn, { attempts: 3, backoff: 'exponential' })` y `deduplicate(fn, { key })` en servicios

**3.4** Batch localStorage: agrupar writes en 1 `setItem` por tick

**3.5** `React.memo` en componentes list/card de kids-dashboard sin memo

### Fase 4 — Documentation (4 items)

```
docs/adr/
├── 001-division-ialab-router.md
├── 002-consolidacion-errorboundary.md
├── 003-split-smartboard-kids-context.md

docs/db/
└── schema.md

docs/api/
└── endpoints.md

docs/guides/
└── onboarding.md
```

---

## Approach

Each item is independent enough to implement one-by-one, testing after each change. Order within each phase follows dependency chain (e.g., context split must happen before memo audit on kids-dashboard components).

### Risk Mitigation
- No behavioral changes — pure refactoring
- Tests pass before/after each item (CI gate)
- Backward compatible localStorage prefix preserved
- No new dependencies

### Verification
- Backend: `npm test` (173 tests → must stay 173)
- Frontend: `npx vite build` (0 errors)
- Docs: `ls` verification of new files
