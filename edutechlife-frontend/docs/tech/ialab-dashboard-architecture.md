# IALab Dashboard — Architecture Document

## Overview

The IALab Dashboard (`UserCoursesDashboard`) is a user-facing course catalog embedded inside a shadcn/ui Dialog, launched from `UserDropdownMenuPremium` ("Mis Cursos y Certificados"). It displays enrolled courses, progress, gamification stats (XP, level, streak), and certificates — all rendered client-side without backend API calls.

## Component Tree

```
UserDropdownMenuPremium
  └── Dialog (Mis Cursos y Certificados)
        └── UserCoursesDashboard
              ├── StatsRow (XP / Level / Streak)
              ├── FilterTabs (All / In Progress / Completed)
              ├── CourseCard[] (grid)
              │     ├── Status badge (bg gradient, badge text)
              │     ├── Duration + rating + feature tags
              │     ├── Progress bar (if status=active && progress>0)
              │     ├── Description (line-clamp-2)
              │     └── CTA button → navigate(course.route)
              └── CertificateSection (if progress >= 80%)
                    ├── Course title + completion %
                    └── "Ver Certificado" → CustomEvent('ialab:viewCertificate')
```

## Data Flow

| Data | Source | Consumer |
|------|--------|----------|
| Gamification (xp, level, streak) | `useIALabStore` — `gamificationSlice` | StatsRow |
| Course metadata (8 courses) | `landingPageData.js` — `courses` array | CourseCard grid |
| Course progress | Derived from store XP (for `ia-generativa`), static `progress` field for others | ProgressBar, CertificateSection |
| Filter state | Local `useState('all')` | FilterTabs → filtered course list |
| Certificate trigger | `window.dispatchEvent(new CustomEvent('ialab:viewCertificate'))` | Upstream certificate modal |

## Store Slices (Zustand)

### `gamificationSlice`
- **State:** `xp`, `streak`, `lastActivityDate`, `badges`, `forumPostCount`, `forumCommentCount`, `startDate`
- **Methods:** `addXp()`, `recordActivity()`, `checkAndAwardBadges()`, `getLevel()`

### `progressSlice`
- **State:** `moduleProgress`, `completedModules`, `courseProgress`, `completedExams`, `isLoadingProgress`, `syncStatus`, `userId`, `userRole`
- **Methods:** `updateModuleActivity()`, `markResourceAsViewed()`, `calculateModuleScore()`, `checkCourseCompletion()`

### `certificateSlice`
- **State:** certificate modal/generation state
- **Methods:** certificate display and download logic

## Key Decisions

1. **Modal from UserDropdownMenuPremium** — no new navigation button; reuses existing user menu entry point.
2. **Reuses existing CourseCard** — the same card from `CourseCatalog.jsx` is imported directly with `isSignedIn` forced to `true`.
3. **Progress derived from store data** — `ia-generativa` course progress is calculated as `Math.min(Math.round((storeXp / 5000) * 100), 100)`. Other courses use static `progress` from `landingPageData.js`.
4. **Certificate view via CustomEvent** — `ialab:viewCertificate` is dispatched on `window` and caught upstream in the parent component chain to open the certificate modal.
5. **No backend API calls** — all data comes from the Zustand store and local constants. No Supabase, no REST endpoints.
6. **Filter state is local** — `useState` in `UserCoursesDashboard` rather than lifted to store, since it's purely presentational.

## File Locations

| File | Path |
|------|------|
| Dashboard component | `src/components/IALab/UserCoursesDashboard.jsx` |
| Course card | `src/components/IALab/CourseCard.jsx` |
| Course metadata | `src/components/IALab/data/landingPageData.js` |
| Zustand store | `src/store/ialabStore.js` |
| Gamification slice | `src/store/slices/gamificationSlice.js` |
| Progress slice | `src/store/slices/progressSlice.js` |
| Certificate slice | `src/store/slices/certificateSlice.js` |
| Store architecture | `src/store/ARCHITECTURE.md` |
| Parent menu | `src/components/UserDropdownMenuPremium.jsx` |

## Dependencies

- **React 18** — component rendering
- **framer-motion** — `motion.div`, `AnimatePresence`, spring animations on CourseCard
- **Zustand** — state management (`useIALabStore`)
- **shadcn/ui Dialog** — modal container from UserDropdownMenuPremium
- **Tailwind CSS** — all styling via utility classes
- **lucide-react** (via `Icon` mapping) — icon system
- **react-router-dom** — `useNavigate` for course CTA buttons
- **i18n** — `useTranslation` for labelled text (XP, level, streak labels)

## Error Boundaries

There is no error boundary specific to `UserCoursesDashboard`. It relies on the parent `UserDropdownMenuPremium`'s error handling and React's default error boundary behavior. If the component throws, the dialog closes.

## Accessibility

- Filter tabs are `<button>` elements with visible focus states via Tailwind `transition-all`.
- CourseCard CTA buttons have visible hover/focus styles.
- Stats display uses semantic `<p>` elements with appropriate text sizing.
- No `aria-*` attributes are explicitly added; improvements would require labeling the filter tabpanel and progress bars.

## i18n

Labels use `useTranslation()` from `src/i18n/I18nProvider`:
- `streak.xp` — XP label
- `streak.level` — Level label
- `streak.days` — Streak label
- `leaderboard.empty` — Empty state message

Course titles, descriptions, and feature tags are hardcoded in Spanish in `landingPageData.js`.
