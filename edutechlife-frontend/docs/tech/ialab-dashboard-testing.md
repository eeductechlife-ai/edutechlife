# IALab Dashboard — Testing Guide

## Running Tests

```bash
npm test              # Single run (vitest run)
npm run test:watch    # Watch mode (if configured)
```

Vitest is configured in `vite.config.js` with `environment: 'jsdom'`, `globals: true`, and includes `src/**/*.{test,spec}.{js,jsx}`.

## Test Location

- Dashboard tests: `src/components/IALab/__tests__/`
- Store tests: `src/store/__tests__/`
- Hook tests: `src/hooks/IALab/__tests__/`

Convention: `ComponentName.test.jsx`

## Test Coverage

### CourseCard (`CourseCard.test.jsx`)
- Renders course title, description, duration, rating, feature tags
- Status badge colors match course status (`active`, `coming-soon`, `maintenance`)
- Progress bar renders when `status === 'active' && progress > 0`
- CTA button navigates to `course.route` when `isSignedIn` is true
- CTA button navigates to `/login?returnTo=/ialab` when `isSignedIn` is false
- Animated border gradient on hover

### UserCoursesDashboard (`UserCoursesDashboard.test.jsx`)
- Stats row displays XP, level, streak from store
- Filter tabs render all three options (Todos, En Progreso, Completados)
- Filtering by "En Progreso" shows only active courses with progress 1–99%
- Filtering by "Completados" shows only courses at 100%
- "Todos" shows all courses
- Empty state with icon and message when no courses match filter
- Certificate section appears when `ia-generativa` progress >= 80%
- Certificate section hidden when progress < 80%
- Certificate button dispatches CustomEvent `ialab:viewCertificate`

### XPProgressBar (`XPProgressBar.test.jsx`)
- Renders current XP and level
- Zero state (0 XP) displays correctly
- Progress bar width matches XP percentage

### StreakBadge (`StreakBadge.test.jsx`)
- Displays streak count
- Shows day indicators (last 7 days)
- Empty/zero streak renders without error

### BadgeCard (`BadgeCard.test.jsx`)
- Shows badge icon and name
- Locked badge displays grayscale/lock state
- Unlocked badge displays full color and "Obtenido" label

## Mocking Strategy

| Dependency | Mock |
|------------|------|
| `react-router-dom` | `vi.mock('react-router-dom')` → mock `useNavigate` returning `vi.fn()` |
| `useTranslation` | Mock returning `{ t: (key) => key }` (identity function) |
| `useIALabStore` | Use `useIALabStore.setState()` with test-specific state in `beforeEach` |
| `framer-motion` | `vi.mock('framer-motion')` → `motion` components as plain `div` with `children` + `className` passthrough; `AnimatePresence` as `React.Fragment` |
| `Icon` component | Mock returning `<span data-testid="icon-{name}" />` or a simple span |
| `window.dispatchEvent` | Spy with `vi.spyOn(window, 'dispatchEvent')` to assert CustomEvent |

## Testing Patterns

```jsx
// Store reset between tests
beforeEach(() => {
  useIALabStore.setState(useIALabStore.getInitialState());
});

// Framer-motion mock
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));
```

## Gotchas

1. **`AnimatePresence` mode="wait"** — mock must render children directly, or the filtered list may not appear.
2. **`whileHover`/`whileTap`** — these are framer-motion props; the mock must spread unknown props or they'll appear as DOM attributes.
3. **`beforeEach` store reset** — essential to avoid test pollution; always call `useIALabStore.setState(useIALabStore.getInitialState())`.
4. **`ja-generativa` progress derivation** — depends on `xp` divided by 5000. Set `xp` to at least 4000 in test state to test certificate section.
