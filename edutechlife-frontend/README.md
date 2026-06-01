# Edutechlife Frontend

Plataforma educativa impulsada por IA.

## Stack

React 18 + Vite 5 | Zustand 5 (10 slices) | Clerk + Supabase | React Router 7 | Tailwind 3 + CSS custom properties | Framer Motion 12 | Vitest + Testing Library

## Estructura

```
src/
├── components/IALab/    — Core educativo (~106 componentes)
├── hooks/               — 28 hooks generales + 17 IALab
├── store/               — Zustand store (10 slices)
├── i18n/                — es.json + en.json (3.2k keys)
├── design-system/       — Design tokens CSS
├── routes/              — React Router lazy routes
└── utils/               — Utilidades
```

## Scripts

| Comando               | Descripción                          |
|-----------------------|--------------------------------------|
| `npm run dev`         | Iniciar servidor de desarrollo       |
| `npm run build`       | Build para producción                |
| `npm test`            | Ejecutar tests unitarios             |
| `npm run test:coverage` | Tests con cobertura                |
| `npm run test:e2e`    | Tests end-to-end (Playwright)        |
| `npm run lint`        | Linter                               |
| `npm run storybook`   | Storybook (puerto 6006)              |
