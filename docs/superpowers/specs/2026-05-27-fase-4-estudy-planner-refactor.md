# Fase 4 — StudyPlannerModal Refactor + Calendar Unification

## Objetivo

Integrar el calendario de estudio (actualmente en ActivityHistory stats tab) dentro del StudyPlannerModal, eliminar el calendario de ActivityHistory, corregir iconos duplicados y adaptar el layout a vertical.

## Decisiones de Diseño

- **Tipo de calendario**: Mensual mejorado (navegación entre meses)
- **Header**: `fa-calendar` solo (remover `fa-book`)
- **Layout**: Vertical — notas arriba, calendario abajo
- **Stats**: Días activos del mes, racha actual, sesiones del mes
- **ActivityHistory**: Eliminar sección "Calendario de Estudio" del accordion stats

## Layout

```
┌──────────────────────────────────────────────┐
│ [fa-calendar] Plan de Estudio    [PDF] [X]  │
├──────────────────────────────────────────────┤
│  ── Notas por Módulo ────────────────────    │
│  [M1][M2][M3][M4]... (tabs)                 │
│  Título del módulo                123 chars  │
│  ┌────────────────────────────────────────┐  │
│  │  textarea (notas del módulo)          │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ── Calendario de Estudio ──────────────     │
│  ‹ Enero 2026 ›            🔥 5d            │
│  [Dom][Lun][Mar][Mié][Jue][Vie][Sáb]        │
│  [  ][  ][  ][  ][1 ][2 ][3 ]               │
│  [4 ][5 ][6 ][7 ][8 ][9 ][10]               │
│  ...                                         │
│  Días activos: 15  │  Racha: 5d  │  Sesiones: 8  │
│                                              │
│  [si día seleccionado]                       │
│  ┌─ Nota del 15/01 ──── [trash] ─┐          │
│  │ textarea (nota del día)       │          │
│  └───────────────────────────────┘          │
│                                              │
│  [fa-lightbulb] Consejo del día              │
│  Meta: 20 min diarios...                     │
│                                              │
├──────────────────────────────────────────────┤
│ [fa-check] Las notas se guardan  [Cloud]    │
└──────────────────────────────────────────────┘
```

## Cambios en StudyPlannerModal.jsx

1. **Header**: `<Icon name="fa-book"/> + <Icon name="fa-calendar"/>` → solo `<Icon name="fa-calendar"/>`
2. **Layout container**: `flex flex-col sm:flex-row` → `flex flex-col` (remove sm:flex-row)
3. **Notas section**: expand to full width, textarea taller (`h-[10rem]` en lugar de `h-[6.8rem]`)
4. **Calendar section**: se expande a full width, se agrega:
   - Navegación de meses (‹ ›) con estado `calendarMonth` y `calendarYear`
   - Stats: días activos del mes, racha actual, sesiones del mes
   - Datos desde `useActivityCalendar` hook (refactorizado para soportar mes/año)
5. **Day notes**: se mantiene igual pero se reposiciona debajo del calendario

## Cambios en ActivityHistory.jsx

1. Remover `import { useActivityCalendar }` (línea 15)
2. Remover estado `calendarYear` (línea 120)
3. Remover estado `accordionSections` key `calendario` (línea 121)
4. Remover `const calendarData = useActivityCalendar(calendarYear)` (línea 273)
5. Remover sección `AccordionSection id="calendario"` (líneas 1218-1254)

## Cambios en useActivityCalendar.js

Refactorizar para aceptar `year` y opcionalmente `month`:
- Si solo `year`: retorna heatmap anual (uso actual en ActivityHistory — pero ya no se usará allí)
- Si `year + month`: retorna datos para un mes específico (nuevo uso en StudyPlannerModal)

## No Cambia

- Notas por módulo (funcionalidad idéntica)
- Notas por día (click en día → textarea)
- Consejo del día
- Export PDF
- Sync cloud
- Footer con auto-save

## Archivos Afectados

1. `src/components/IALab/StudyPlannerModal.jsx` — refactor mayor
2. `src/components/ActivityHistory.jsx` — remove calendar section
3. `src/hooks/useActivityCalendar.js` — add monthly query support
