# Fase 4 — Calidad SaaS

**Goal:** Elevar calidad SaaS de 7.5→9.0/10 sin alterar funcionalidad existente.
**Constraint:** Todos los cambios son puramente aditivos — nuevas configs, dependencias, archivos. No se modifica lógica existente de negocio, componentes, o rutas.

## A. Monitoreo — Sentry (additivo)

### Dependencias
- `@sentry/react` — React SDK para error tracking + performance
- `@sentry/vite-plugin` — Source maps upload en build

### Integración `main.jsx`
- Bloque nuevo `Sentry.init({...})` después de imports, antes de ReactDOM.render
- Sin DSN real configurado → Sentry no se activa (no envía nada, no rompe nada)
- `tracesSampleRate: 0` por defecto (se activa vía `.env.production`)
- `replaysSessionSampleRate: 0`, `replaysOnErrorSampleRate: 0`

### Variables de entorno
| Variable | Default | Producción |
|----------|---------|------------|
| `VITE_SENTRY_DSN` | (vacío) | DSN real |
| `VITE_SENTRY_TRACES_RATE` | `0` | `0.1` |
| `VITE_SENTRY_REPLAYS_RATE` | `0` | `0` |

### Source maps en build
- Se generan solo si `VITE_SENTRY_DSN` está definida (via `@sentry/vite-plugin`)
- Sin DSN → build idéntico al actual (source maps false)
- En producción con DSN → suben a Sentry, no se sirven al cliente

## B. Performance Budget (aditivo)

### `vite.config.js`
- `build.chunkSizeWarningLimit: 250` (warning, no error — baja de 1500 a 250)
- `build.reportCompressedSize: true` (información útil, no rompe nada)

### `lighthouserc.js` (archivo nuevo, raíz del frontend)
- Configuración LHCI para CI pipeline
- Umbrales: performance ≥ 70, accessibility ≥ 90, SEO ≥ 80
- Sin pipeline CI activo → no afecta builds locales

## C. Testing — Smoke Tests (additivo)

### Nuevos tests de integración
- `src/tests/integration/` — archivos nuevos
- Smoke tests para flujos críticos sin mockear:
  - Renderizado del header con botón login + dropdown (2 opciones)
  - Renderizado de páginas públicas (landing, login)
  - Navegación entre rutas públicas
- Sin mockear Clerk/Supabase — pruebas de render estático

### No se modifica
- Tests existentes (`src/tests/a11y/`, `src/components/IALab/__tests__/`)
- Config de vitest
- Cobertura o thresholds existentes

## D. Exclusiones (para no alterar funcionamiento)
- ❌ No modificar routing existente
- ❌ No modificar ClerkProvider ni sus props
- ❌ No modificar componentes de layout
- ❌ No modificar lógica de negocio en hooks o servicios
- ❌ No agregar feature flags, rate limiting, API versioning (requieren cambios funcionales)

## Riesgos y mitigaciones
| Riesgo | Mitigación |
|--------|------------|
| Sentry init falla si DSN inválido | Sin DSN no se init; try/catch alrededor de init |
| @sentry/vite-plugin rompe build | Solo activo si VITE_SENTRY_DSN definida; sin variable es no-op |
| Tests nuevos flaky (dependencias externas) | Solo render estático, sin fetch real |
| chunkSizeWarningLimit ruidoso | Solo warning, no error de build. Ajustable si hay falsos positivos |
