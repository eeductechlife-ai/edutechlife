# IALab Dashboard Redesign — Home Route

## Problem

The IALab dashboard (`/ialab`) currently lacks:
- Daily Plan integration (exists only inside module view at `/ialab/:moduleId`)
- Language switcher (ES/EN) and dark mode toggle (exist only in `IALabHeader`)
- Proper handling of "Continúa tu aprendizaje" — should only show when student has active progress/points

## Scope

Single file changes to `IALabDashboard.jsx` + daily plan import. No new components. No new route definitions.

## Design

### Section 1 — Top Action Bar

Add to the top of every dashboard state:

```
[🧪 IALab]    [🔍 Search] [🌐 ES] [🌙] [Avatar] [X close]
```

Implementation:
- Reuse `LocaleSwitcher` from `../LocaleSwitcher.jsx` (already has globe icon + ES/EN label)
- Reuse dark mode toggle via `useTheme()` hook (same pattern as `IALabHeader.jsx`)
- Reuse `GlobalSearchBar` from `./GlobalSearchBar.jsx` (already exists, used in IALabHeader)
- User avatar from `useUser()` (Clerk) + file input for custom avatar (already exists in dashboard hero)

### Section 2 — Hero (Progress)

Keep the existing 3-state structure (no-progress / in-progress / completed) but:

- **Remove "Continúa tu aprendizaje"** subtitle from all states when XP === 0 and no modules completed
- In **no-progress** state: replace course-specific subtitle with generic welcome (`dashboard.welcome_title` / `dashboard.welcome_desc`)
- In **in-progress** state: the existing subtitle `dashboard.continue_learning` stays BUT only when `xp > 0` or `stats.completed > 0`
- In **completed** state: `route.continue_learning` stays (already earned the right)

Condition: `showContinueLearning = xp > 0 || stats.completed > 0`

### Section 3 — Daily Plan

Integrate the existing `DailyPlan` component between the hero section and the tabs.

```
[🎯 Plan de Día ▼]        [3 pendientes]
  • Desafío matutino              ✓ +10 XP
  • Repasar contenido M2          [→ Ir]
  • Ver actividad nueva           [→ Ir]
```

Implementation:
- Import `DailyPlan` (lazy, same as `IALab.jsx` line 32)
- Render inside `SectionErrorBoundary` after hero section
- Props: `onAction={handleGlobalAction} isLoading={isLoadingProgress}`
- `handleGlobalAction` already exists in `IALab.jsx` — reuse pattern, create local handler in dashboard for: OPEN_EVALUATION, OPEN_CHALLENGE, OPEN_QUIZ, SHOW_CERTIFICATE
- DailyPlan navigation actions that open modules should call `navigate(/ialab/${moduleId})` 
- In **no-progress** state: DailyPlan shows empty state (challenges + recs will be empty)
- In **completed** state: DailyPlan shows empty state (all challenges completed)

### Section 4 — Breadcrumbs + Content Tabs

Add the existing `Breadcrumbs` and `TabPills` to the dashboard so users can navigate content without going into the module view.

```
Inicio / Ingeniería de Prompts
───────────────────────────────────────
[Todo] [Objetivos] [Contenido] [Actividades] [Herramientas]
```

Implementation:
- Import `Breadcrumbs` from `./Breadcrumbs.jsx`
- Import `TabPills` from `./shared/TabPills.jsx`
- `viewSection` state + `setViewSection` (same as `IALab.jsx` line 96)
- When no module selected / no progress: breadcrumbs show just "Inicio"
- When progress exists: breadcrumbs show the first incomplete module title
- Tab pills filter the section below (content/activities/tools)
- Tabs render **skeleton** versions of the module content sections:
  - `ModuleInfoSection` for "Objetivos"
  - `ModuleOverviewCard` for "Contenido" 
  - `ModuleActions` for "Actividades"
  - `ToolTutorAccordion` for "Herramientas"
  - These are the same components used in `IALab.jsx` — they already work with the active module

### Section 5 — Modules + Activity Tabs (existing, unchanged)

```
[📚 Tu Progreso] [📊 Actividad]     ← existing tabs
  M1: Ingeniería de Prompts  [75%] ▶
  M2: ChatGPT                [🔒]   ← lock icon
  M3: Deep Research          [🔒]
  M4: NotebookLM             [🔒]
  M5: Proyecto Final         [🔒]
```

- Keep exact existing rendering
- `ModuleRow` component unchanged
- Activity trends tab unchanged

## Files Changed

| File | Change |
|------|--------|
| `src/components/IALab/IALabDashboard.jsx` | Add DailyPlan, LocaleSwitcher, dark mode, breadcrumbs, TabPills, conditional "continue learning" |
| `src/components/IALab/IALab.jsx` | No changes needed (DailyPlan stays here too) |

## Non-Goals

- No route changes
- No new components
- No changes to module content components (ModuleInfoSection, ModuleOverviewCard, etc.)
- No changes to IALabTour (out of scope for this spec)
- No i18n key changes (all keys already exist)

## Risks

- DailyPlan navigation actions (`OPEN_EVALUATION`, `OPEN_CHALLENGE`) need a local handler on the dashboard since dashboard is outside `IALabContent`'s modal system. Solution: navigate to `/ialab/${moduleId}` and let the IALab component handle the modal via URL params or dispatch a custom event.
- TabPills + Breadcrumbs on the dashboard would need module content components which are already used in IALab.jsx — they depend on `useIALabProgressContext()` which IS available at the dashboard level via the store (`useIALabStore`).
