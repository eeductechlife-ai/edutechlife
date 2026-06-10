# IALab Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate DailyPlan, LocaleSwitcher, dark mode toggle, Breadcrumbs, TabPills, and conditional "Continúa tu aprendizaje" into IALabDashboard.

**Architecture:** Single file modification to `IALabDashboard.jsx`. Reuses existing components (`DailyPlan`, `LocaleSwitcher`, `Breadcrumbs`, `TabPills`). No new routes, no new components.

**Tech Stack:** React 18, Framer Motion, Tailwind CSS, Clerk Auth, Zustand store, react-router-dom v6

---

### Task 1: Add imports + state to IALabDashboard

**Files:**
- Modify: `src/components/IALab/IALabDashboard.jsx:1-15`

- [ ] **Step 1: Add new imports**

Insert after existing imports (line 9):

```jsx
import LocaleSwitcher from '../LocaleSwitcher';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumbs from './Breadcrumbs';
import TabPills from './shared/TabPills';
```

- [ ] **Step 2: Add new state variables**

After line 91 (`const animRef = useRef(null)`), add:

```jsx
const [viewSection, setViewSection] = useState(null);
const [isSearchOpen, setIsSearchOpen] = useState(false);
```

- [ ] **Step 3: Add useTheme + fileInputRef**

After `const { getTimeTrackingStats } = useActivityTracker();` (line 93), add:

```jsx
const { isDarkMode, toggleDarkMode } = useTheme();
```

---

### Task 2: Add DailyPlan + GlobalSearchBar lazy imports

**Files:**
- Modify: `src/components/IALab/IALabDashboard.jsx:1-15`

- [ ] **Step 1: Add lazy imports after existing lazy components**

Add near the top imports section:

```jsx
const DailyPlan = lazy(() => import('./DailyPlan'));
```

`GlobalSearchBar` is already a direct import at `./GlobalSearchBar` — check if it exists. If not, add:

```jsx
import GlobalSearchBar from './GlobalSearchBar';
```

---

### Task 3: Add local handleGlobalAction + navigate helpers

**Files:**
- Modify: `src/components/IALab/IALabDashboard.jsx` (after `doNavigate` definition, around line 142)

- [ ] **Step 1: Add handleGlobalAction callback**

```jsx
const handleGlobalAction = useCallback((action) => {
  switch (action) {
    case 'OPEN_EVALUATION':
    case 'OPEN_CHALLENGE':
    case 'OPEN_QUIZ':
      navigate(`/ialab/${activeModuleId}`);
      break;
    case 'SHOW_CERTIFICATE':
      navigate('/ialab/certificate');
      break;
    default:
      break;
  }
}, [navigate, activeModuleId]);
```

---

### Task 4: Add action bar to no-progress state

**Files:**
- Modify: `src/components/IALab/IALabDashboard.jsx:181-227`

- [ ] **Step 1: Wrap the no-progress state content with top action bar**

Replace the opening section of the no-progress return:

```jsx
  if (hasNoProgress) {
    return (
      <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-6">
        <BgPattern />
        {/* Top action bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate rounded-xl flex items-center justify-center shadow-sm shadow-petroleum/15">
              <Icon name="fa-brain" className="text-white text-sm" aria-hidden="true" />
            </div>
            <h1 className="text-lg font-bold text-petroleum dark:text-petroleum tracking-tight">IALab</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center p-2 rounded-xl border border-transparent hover:border-petroleum/20 hover:shadow-sm transition-all duration-200"
              aria-label={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              <Icon name={isDarkMode ? 'fa-sun' : 'fa-moon'} className={`text-lg ${isDarkMode ? 'text-amber-400' : 'text-corporate'}`} />
            </button>
            <LocaleSwitcher />
          </div>
        </div>
        {/* Hero */}
```

- [ ] **Step 2: Remove "route.continue_learning" subtitle**

Replace line 183 where it shows `<p>{t('route.continue_learning')}</p>` — just remove it.

The original line was:
```jsx
<h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate">IALab</h1><p className="text-sm text-slate-500 dark:text-slate-400 -mt-3">{t('route.continue_learning')}</p>
```

Replace with just the h1 (no subtitle).

- [ ] **Step 3: Add DailyPlan after hero in no-progress state**

After the closing `</section>` of the hero (around line 224), add:

```jsx
        {/* Daily Plan */}
        <Suspense fallback={<div className="h-12 bg-slate-100 rounded-xl animate-pulse" />}>
          <SectionErrorBoundary name="DailyPlan">
            <DailyPlan onAction={handleGlobalAction} isLoading={false} />
          </SectionErrorBoundary>
        </Suspense>
```

Don't forget to add `SectionErrorBoundary` import if not already there.

- [ ] **Step 4: Add Breadcrumbs + TabPills after DailyPlan**

After the DailyPlan section:

```jsx
        {/* Breadcrumbs */}
        <Breadcrumbs
          segments={[
            { label: t('ialab.breadcrumb_home') },
            { label: t('dashboard.course_title') },
          ]}
          size="text-[10px] md:text-xs"
        />
```

---

### Task 5: Add action bar + DailyPlan to in-progress state

**Files:**
- Modify: `src/components/IALab/IALabDashboard.jsx` (around line 358-544)

- [ ] **Step 1: Add top action bar to in-progress state**

Right after the opening div + BgPattern (line 361-362), replace:

```jsx
      <h1 className="text-2xl sm:text-3xl font-black text-petroleum">{t('dashboard.course_title')}</h1>
      <p className="text-sm text-slate-500 -mt-3">{t('dashboard.continue_learning')}</p>
```

With:

```jsx
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate rounded-xl flex items-center justify-center shadow-sm shadow-petroleum/15">
            <Icon name="fa-brain" className="text-white text-sm" aria-hidden="true" />
          </div>
          <h1 className="text-lg font-bold text-petroleum dark:text-petroleum tracking-tight">IALab</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center p-2 rounded-xl border border-transparent hover:border-petroleum/20 hover:shadow-sm transition-all duration-200"
            aria-label={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            <Icon name={isDarkMode ? 'fa-sun' : 'fa-moon'} className={`text-lg ${isDarkMode ? 'text-amber-400' : 'text-corporate'}`} />
          </button>
          <LocaleSwitcher />
        </div>
      </div>
      {/* Conditionally show subtitle only when xp > 0 */}
      {(xp > 0 || stats.completed > 0) && (
        <p className="text-sm text-slate-500 -mt-3">{t('dashboard.continue_learning')}</p>
      )}
```

- [ ] **Step 2: Add DailyPlan + Breadcrumbs after hero in in-progress state**

After the hero section `</section>` closing tag (around line 452), add:

```jsx
        {/* Daily Plan */}
        <Suspense fallback={<div className="h-12 bg-slate-100 rounded-xl animate-pulse" />}>
          <SectionErrorBoundary name="DailyPlan">
            <DailyPlan onAction={handleGlobalAction} isLoading={false} />
          </SectionErrorBoundary>
        </Suspense>

        {/* Breadcrumbs */}
        <Breadcrumbs
          segments={[
            { label: t('ialab.breadcrumb_home'), onClick: () => {} },
            { label: moduleTitles[activeModuleId] || t('dashboard.course_title') },
          ]}
          size="text-[10px] md:text-xs"
        />
```

---

### Task 6: Add action bar + DailyPlan to completed state

**Files:**
- Modify: `src/components/IALab/IALabDashboard.jsx:228-356`

- [ ] **Step 1: Same as Task 5 Step 1 for completed state**

Replace the title section (line 230):
```jsx
<h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate">IALab</h1><p className="text-sm text-slate-500 dark:text-slate-400 -mt-3">{t('route.continue_learning')}</p>
```

With the action bar same as Task 5 Step 1. Keep `route.continue_learning` subtitle since course is completed.

- [ ] **Step 2: Add DailyPlan + Breadcrumbs after hero in completed state**

Same as Task 5 Step 2.

---

### Task 7: Verify build

**Files:**
- Run: `npm run build` (or `npm run lint` / check for errors)

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | head -30
```

Expected: Build succeeds.
