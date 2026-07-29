# ADR-002: Consolidación de ErrorBoundary (4→1 + re-export)

**Fecha:** 2026-07-29
**Estado:** Aceptado

## Contexto
Existían 5 implementaciones de ErrorBoundary: common/ErrorBoundary, common/GlobalErrorBoundary, forum/ErrorBoundary, IALab/SectionErrorBoundary, DashboardErrorBoundary. Cada una con features duplicados y comportamiento inconsistente.

## Decisión
Unificar la lógica base en `common/ErrorBoundary.jsx` con soporte para:
- Variante inline (default) y fullscreen
- Botón retry (con remountKey) + reload
- Detalles técnicos colapsables (showDetails o NODE_ENV=development)
- Fallback personalizable (componente o función render prop)

Los archivos existentes se mantienen como re-exports para no romper 26+ imports:
- `IALab/SectionErrorBoundary.jsx` — wrapper con i18n (withTranslation)
- `forum/ErrorBoundary.jsx` — re-export directo
- `GlobalErrorBoundary.jsx` — eliminado, App.jsx usa AppErrorBoundary variant="fullscreen"
- `DashboardErrorBoundary.jsx` — se mantiene independiente (estilo kids-dashboard único)

## Consecuencias
- Código base reducido ~200 líneas
- Sin cambios en los 26+ archivos que importan ErrorBoundary
- Nuevos componentes usan common/ErrorBoundary directamente
