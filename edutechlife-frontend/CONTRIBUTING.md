# Contributing

## Branching

- `main` — producción
- `develop` — integración
- `feature/*`, `fix/*`, `docs/*`

## Commits

Conventional commits: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `perf:`, `ci:`, `chore:`

## Before PR

- [ ] `npm run lint` — 0 errors
- [ ] `npm test` — all passing
- [ ] `npm run build` — success
- [ ] No console.log, no .bak files

## Code Style

- 500 lines max per file
- Functional components + hooks
- JSDoc for public component props
- Tests co-located in `__tests__/`
