# StudyCalendarSection: Calendario Académico Visual Integrado

## Resumen

Convertir `StudyPlannerModal` (modal oculto en menú) en `StudyCalendarSection` (sección visible en IALab). Añade color-coding por tipo de actividad, deadlines visuales de evaluaciones/challenges pendientes, y se integra como sección permanente junto al DailyPlan.

## Arquitectura

```
IALab.jsx (Main Content Area)
 └── DailyPlan (colapsable, recomendaciones + challenges)
 └── StudyCalendarSection (NUEVA, visible siempre)
      ├── CalendarHeader (navegación mes, streak, resumen)
      ├── CalendarGrid (grid mensual con días)
      │    ├── DayCell (heatmap + dot de tipo actividad + nota marker)
      │    └── DayNotePanel (textarea expandible por día)
      ├── DeadlinesStrip (exámenes/challenges pendientes con fecha)
      ├── WeeklyProgressBar (XP semanal, ya existente)
      └── DailyTip (consejo según racha, ya existente)
```

### Datos
- **Session activity**: `ialab_session_log` (localStorage) — heatmap por minuto
- **Activity types**: `ialab_activity_log` (localStorage/Supabase) — dots por tipo (exam, challenge, video, session)
- **Exámenes pendientes**: `completedExams` del store (módulos sin examen completado)
- **Challenges pendientes**: `challengeScores` del store + classroom data
- **XP/Streak**: `useIALabStore` (getWeeklyXP, streak)
- **Notas diarias**: `ialab_day_notes` (localStorage)
- **Sincronización cloud**: `useStudyNotesSync`

### Nuevas i18n keys
```json
"ialab.study_calendar.deadlines": "Próximos vencimientos",
"ialab.study_calendar.no_deadlines": "¡Todo al día!",
"ialab.study_calendar.pending_exam": "Examen M{módulo} pendiente",
"ialab.study_calendar.pending_challenge": "Desafío M{módulo} pendiente",
"ialab.study_calendar.activity_exam": "E",
"ialab.study_calendar.activity_challenge": "D",
"ialab.study_calendar.activity_video": "V",
"ialab.study_calendar.activity_session": "S",
"ialab.study_calendar.scroll_section": "Calendario Académico"
```

## Cambios por Archivo

### Crear
- `src/components/IALab/StudyCalendarSection.jsx` (~320 líneas)

### Modificar
- `src/components/IALab/IALab.jsx` — import + render StudyCalendarSection tras DailyPlan
- `src/components/IALab/IALabMobileMenu.jsx` — reemplazar modal por scroll-to-section
- `src/i18n/es.json` — añadir nuevas keys
- `src/i18n/en.json` — añadir nuevas keys
- `src/i18n/keys.d.ts` — añadir type definitions

### No modificar
- `StudyPlannerModal.jsx` — mantener para dropdown menus (backward compat)
- `UserDropdownMenuPremium.jsx` — sigue abriendo modal
- `UserDropdownMenuSimplified.jsx` — sigue abriendo modal

## No Incluido (Out of Scope)
- Drag & drop de fechas
- Vista semana independiente
- Planificación futura automática
- Sincronización con Google Calendar
