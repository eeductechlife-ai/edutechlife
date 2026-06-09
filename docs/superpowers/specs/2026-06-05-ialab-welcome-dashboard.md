# IALab Welcome Dashboard

## Goal
Replace the current `/ialab` page with a Welcome Dashboard showing the student's progress across all 5 modules, with a clear "continue where you left off" CTA and a pending-task checklist.

## Route Architecture

```
/ialab          → IALabDashboard (new)
/ialab/:moduleId → AILabPage (existing, unchanged)
```

The current single route `ialab/:moduleId?` splits into a parent Route group:
```jsx
<Route path="ialab">
  <Route index element={<IALabDashboard />} />
  <Route path=":moduleId" element={<AILabPage />} />
</Route>
```

## Sections (1-5 confirmed)

| # | Section | Data Source | States |
|---|---------|-------------|--------|
| 1 | **Progress Bar** — "Módulo X de 5 • N%" | `getModuleProgress()` from Zustand `progressSlice` | loading / empty (no progress) / partial / complete |
| 2 | **Stats Cards** — XP total, racha, score promedio, módulos completados | `totalXp` from store, `completedModules` count, computed avg | loading / zero-state / populated |
| 3 | **Module Timeline** — 5 modules listed vertically with status icons (✅/▶/🔒), score badges, "Continuar" button per unlocked module | `modules` array from store, `completedExams`, `challengeScores` | loading / all locked / mixed / all complete |
| 4 | **CTA "Continuar donde lo dejaste"** — large button navigating to `/ialab/{firstIncompleteModule}` | computed from store's `moduleProgress` | hidden when all complete (show "🎉 Completaste IALab") |
| 5 | **Pending Checklist** — tasks for the active module: "Ver videos", "Completar quiz", "Pasar desafío" | `currentModule` data, `resourceProgress`, `examResults`, `challengeResults` | hidden on completed modules, shows relevant incomplete tasks |

## Component Tree

```
IALabDashboard (page-level, fetches data)
├── ProgressBarSection (section 1)
├── StatsCards (section 2)
│   └── StatCard (reusable, icon + label + value)
├── ModuleTimeline (section 3)
│   └── TimelineItem (per module, status icon + score + CTA)
├── ContinueCTA (section 4)
└── PendingChecklist (section 5)
    └── ChecklistItem (per pending task)
```

## Data Flow

1. `IALabDashboard` reads from `useIALabStore` (Zustand) via `progressSlice`
2. All data is already loaded by `IALabProgressProvider` (from Phase 1)
3. Computed values (first incomplete module, avg score, streak) derived inline with `useMemo`
4. No new API calls needed — purely presentational over existing store

## Error / Edge Cases

- **Loading**: Show `<PageLoader>` while `isLoadingProgress` is true
- **No progress**: Empty state — "¡Bienvenido a IALab! Comienza con el Módulo 1"
- **All complete**: Show congratulations state with CTA to explore other courses
- **Store unavailable**: Graceful fallback — "No pudimos cargar tu progreso. Intenta recargar."
- **Mobile**: Section 2 (StatsCards) wraps to 2-column grid; Timeline respects small screen

## Non-Goals

- Dashboard does NOT replace module-level learning (`/ialab/:moduleId`)
- Dashboard does NOT make new API/DB calls
- Dashboard does NOT modify existing store or IALab behavior
- No certificate UI (deferred to Phase 2 item 3)
