# CTA único “Siguiente paso” + Plan del día en una sola sección (opción C)

**Goal:** Unificar el CTA “¡Empieza aquí!” y el “Plan del día” en **una sola sección** con **un único botón** que ejecuta el siguiente paso pendiente (guiado).

**Architecture:** Helper puro `buildDailyPlan()` produce una lista ordenada de pasos; el `DailyPlan` renderiza un header-CTA (un botón) y, debajo, el plan en modo lectura (colapsado). Se reutiliza la lógica existente de recomendaciones y acciones.

**Tech Stack:** React, zustand, framer-motion, i18n (es/en/pt), vitest.

## Cambios
- `dailyPlan/buildDailyPlan.js` (nuevo): pasos ordenados + `currentIndex`/`current`/`total`.
- `dailyPlan/DailyPlanHeader.jsx`: ahora es el **CTA** (“Siguiente paso · Paso k de N” + 1 botón).
- `dailyPlan/DailyPlanStep.jsx`: fila **de solo lectura** (sin botón).
- `DailyPlan.jsx`: sección única (CTA + “Ver plan (N)” colapsable).
- `IALab.jsx`: elimina la tarjeta “¡Empieza aquí!”; pasa `onGoContent` y `currentLessonTitle` al plan.
- i18n: `ialab.next_step.title|progress|current|pending`, `ialab.daily_plan.view_plan`.

## Reglas de orden
1. Racha en riesgo · 2. Examen pendiente · 3. Empezar módulo · 4. Reto diario · 5. Recomendaciones (máx 2) · 6. Continuar/Explorar.

## Verificación
`npx vitest run src/components/IALab/dailyPlan` (10/10), `ModuleFlow` (4/4), ESLint 0 errores, `build:fast`.
