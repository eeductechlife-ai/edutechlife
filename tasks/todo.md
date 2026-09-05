# SmartBoard Fase 3 — Task List

## Fase 1: Sessions lifecycle

- [ ] **Task 1**: Insertar sesión en DB al entrar a SmartBoard + cerrarla al salir
  - `SmartBoardKidsContext.jsx` — llamar `sessionCreateMutation.mutate()` + agregar `useSessionEnd` mutation
  - `useSmartBoardSupabase.ts` — nuevo `useSessionEnd` mutation
- [ ] **Task 2**: Exponer `createSessionWithSupabase` en contexto + llamarla al cambiar materia
  - `SmartBoardKidsContext.jsx` — agregar al `value` object
  - `SmartBoardDashboard.jsx` — llamar en cambio de tab

### Checkpoint 1
- [ ] `vite build` en verde
- [ ] Tabla `sessions` tiene filas reales en prod

## Fase 2: academic_context

- [ ] **Task 3**: `useUpsertAcademicContext` hook + wiring en `trackSubjectTime`
  - `useSmartBoardSupabase.ts` — nuevo mutation con debounce
  - `SmartBoardKidsContext.jsx` — llamar en `trackSubjectTime`

## Fase 3: Achievements UI

- [ ] **Task 4**: `RewardsGrid` fusiona logros DB con locales
  - `RewardsGrid.jsx` — leer `achievementsQuery.data` del contexto
  - `SmartBoardKidsContext.jsx` — exponer achievements en value (revisar si ya está)

### Checkpoint 2 (Final)
- [ ] `npm test` — todos los tests pasan
- [ ] `vite build` en verde
- [ ] Tabla `sessions` tiene filas
- [ ] Tabla `academic_context` tiene filas
- [ ] `RewardsGrid` muestra logros de DB
