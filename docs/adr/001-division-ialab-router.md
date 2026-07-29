# ADR-001: División de ialab.js en router directory

**Fecha:** 2026-07-29
**Estado:** Aceptado

## Contexto
`src/routes/ialab.js` tenía 627 líneas, excediendo el límite de 500 del proyecto. Agrupaba 11 endpoints en un solo archivo: prompts, modules, progress, templates, resources, evaluate.

## Decisión
Dividir en `src/routes/ialab/` con archivos por responsabilidad:
- `prompts.js` — POST /prompts (generación MasterPrompt)
- `evaluate.js` — POST /evaluate-prompt (evaluación local)
- `resources.js` — GET /resources (recursos estáticos + DB)
- `index.js` — mount point, mantiene modules/templates/progress

## Consecuencias
- Positivas: cada archivo <200 líneas, más fácil testear y modificar
- Negativas: los tests de ialab.test.js necesitan que el mount en app.js (`app.use('/api/ialab', ialabRoutes)`) resuelva al directorio
- Los imports existentes en app.js no cambian gracias a la resolución automática de directorios de Node.js
