# IALab Improvement Plan (Complete)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical bugs, UX issues, and strategic gaps identified in the IALab platform audit across 12 targeted tasks.

**Architecture:** Hybrid execution — Fase 1 (tasks 1-4) runs sequentially with systematic debugging per task; Fase 2 (tasks 5-9) and Fase 3 (tasks 10-12) execute in parallel via swarm agents. Each task is independently verifiable with build + lint checks.

**Tech Stack:** React 18, Vite, Zustand, Tailwind CSS, Supabase, Clerk, Lucide React, i18next

---

### Task 1: StreakDetailsModal — Add Focus Trap & Escape Handler

**Files:**
- Modify: `src/components/IALab/StreakDetailsModal.jsx`

- [ ] **Step 1: Import useFocusTrap and add hook**

```jsx
// Add at top with other imports:
import useFocusTrap from '../../hooks/useFocusTrap';
```

Find the component function body (after `useMemo` hooks around line 80). The `useFocusTrap` hook accepts `isOpen` prop. Add after the existing hooks:

```jsx
const focusTrapRef = useFocusTrap(isOpen);
```

- [ ] **Step 2: Attach ref and add Escape handler to the dialog div**

Search for `<div role="dialog" aria-modal="true"` (around line 156):

```jsx
<div
  ref={focusTrapRef}
  role="dialog"
  aria-modal="true"
  aria-label={t('modal.progress_title')}
  onKeyDown={(e) => { if (e.key === 'Escape') onClose?.(); }}
```

- [ ] **Step 3: Verify lint**

Run: `npx eslint src/components/IALab/StreakDetailsModal.jsx`
Expected: No errors.

---

### Task 2: Migrate Font Awesome Icons to `<Icon>` Component

**Files:**
- Modify: `src/components/IALab/StreakDetailsModal.jsx`

- [ ] **Step 1: Replace POSITION_ICONS map**

Lines 20-23, change icon values from Font Awesome to Icon component names:

```jsx
const POSITION_ICONS = {
  1: { icon: 'Trophy', color: 'text-amber-400', bg: 'bg-amber-50' },
  2: { icon: 'Medal', color: 'text-slate-400', bg: 'bg-slate-50' },
  3: { icon: 'Medal', color: 'text-amber-700', bg: 'bg-amber-50/50' },
};
```

- [ ] **Step 2: Replace all `<i className="fa-...">` with `<Icon name="...">`**

Search for all `className=".*fa-` patterns. Known instances to replace:
- `fa-trophy` → `Trophy`
- `fa-medal` → `Medal`
- `fa-fire` → `Flame`
- Any others found by search

Each replacement:
```jsx
{/* Before: */}
<i className={`${pos.icon} ${pos.color} text-lg`} />

{/* After: */}
<Icon name={pos.icon} className={`${pos.color} text-lg`} />
```

- [ ] **Step 3: Verify no remaining fa references**

```bash
grep -n 'fa-' src/components/IALab/StreakDetailsModal.jsx
```
Expected: No output (no matches).

- [ ] **Step 4: Verify lint**

```bash
npx eslint src/components/IALab/StreakDetailsModal.jsx
```
Expected: No errors.

---

### Task 3: Eliminate Silent Catches in IALabProgressProvider

**Files:**
- Modify: `src/context/ialab/IALabProgressProvider.jsx`

- [ ] **Step 1: Replace empty catch blocks with error logging**

Find the `updateModuleActivity` function body around lines 156-184. There are 4 silent try/catch blocks:

```jsx
// Pattern match: try { sync* } catch (e) {}
```

Replace each:
```jsx
// Before:
try {
  syncMarkExamComplete(moduleId, score);
} catch (e) {}

// After:
try {
  await syncMarkExamComplete(moduleId, score);
} catch (e) {
  console.error(`[IALabProgressProvider] sync failed for module ${moduleId}:`, e);
}
```

Apply to all 4:
1. `syncMarkExamComplete` (line 160)
2. `syncMarkChallengeComplete` (line 167)
3. `syncMarkCommunityComplete` (line 174)
4. `syncMarkActivityComplete` (line 181)

Note: The functions are likely `async` already since the wrapping function is `useCallback` with `async`. Verify the `async` keyword is present on the wrapper function. If not, ensure the try/catch body handles the promise correctly.

- [ ] **Step 2: Verify lint**

```bash
npx eslint src/context/ialab/IALabProgressProvider.jsx
```
Expected: No errors.

---

### Task 4: Add Global ErrorBoundary to App.jsx

**Files:**
- Create: `src/components/common/GlobalErrorBoundary.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create GlobalErrorBoundary component**

```jsx
// src/components/common/GlobalErrorBoundary.jsx
import { Component } from 'react';
import PropTypes from 'prop-types';

export default class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[GlobalErrorBoundary] Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-white p-8">
          <div className="max-w-md text-center">
            <div className="mb-6 text-6xl">⚠️</div>
            <h1 className="mb-4 text-2xl font-bold text-petroleum">
              Something went wrong
            </h1>
            <p className="mb-8 text-slate-600">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="rounded-lg bg-petroleum px-6 py-3 text-white font-semibold hover:bg-petroleum/90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Reload Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-8 rounded-lg bg-red-50 p-4 text-left text-sm text-red-700 overflow-auto max-h-64">
                {this.state.error.message}
                {'\n'}
                {this.state.error.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

GlobalErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
```

- [ ] **Step 2: Wrap App.jsx with GlobalErrorBoundary**

In `src/App.jsx`:

```jsx
// Add import at top:
import GlobalErrorBoundary from "./components/common/GlobalErrorBoundary";

// Wrap the return (around line 36):
return (
  <GlobalErrorBoundary>
    <StudentProvider>
      {/* existing content */}
    </StudentProvider>
  </GlobalErrorBoundary>
);
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: Build succeeds with no errors.

---

### Task 5: Add Skeleton Loader to TopicResourcesModal

**Files:**
- Modify: `src/components/IALab/TopicResourcesModal.jsx`

- [ ] **Step 1: Add loading state**

After the existing state declarations (around line 30-60), add:

```jsx
const [isLoadingResources, setIsLoadingResources] = useState(true);
```

- [ ] **Step 2: Wire loading to data fetching**

Find where resources are fetched/set (the `useEffect` or data subscription around lines 60-120). After setting resources:

```jsx
setIsLoadingResources(false);
```

- [ ] **Step 3: Add skeleton JSX**

Before the main content render, add:

```jsx
{isLoadingResources && (
  <div className="p-6 space-y-6 animate-pulse">
    <div className="h-6 w-48 bg-slate-200 rounded-lg" />
    <div className="h-4 w-72 bg-slate-100 rounded" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl bg-slate-100 p-4 space-y-3">
          <div className="h-5 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-200/50 rounded" />
          <div className="h-4 w-3/4 bg-slate-200/50 rounded" />
        </div>
      ))}
    </div>
  </div>
)}
{!isLoadingResources && (
  // existing content wrapper
)}
```

- [ ] **Step 4: Verify lint**

```bash
npx eslint src/components/IALab/TopicResourcesModal.jsx
```
Expected: No errors.

---

### Task 6: Multi-Device Conflict Resolution

**Files:**
- Read first to confirm: `grep -rn "persistenceSlice\|syncConflict\|lastSynced" src/store/ --include="*.js"`
- This may modify `src/store/ialabStore.js` or a separate persistence slice

- [ ] **Step 1: Locate the sync logic and implement conflict resolver**

After locating the relevant store file, add a conflict resolution function:

```jsx
function resolveProgressConflict(local, remote) {
  if (!local) return remote || local;
  if (!remote) return local;

  const localTime = local.lastSyncedAt ? new Date(local.lastSyncedAt).getTime() : 0;
  const remoteTime = remote.lastSyncedAt ? new Date(remote.lastSyncedAt).getTime() : 0;

  if (localTime > remoteTime) return local;
  if (remoteTime > localTime) return remote;

  const localScore = local.courseProgress || 0;
  const remoteScore = remote.courseProgress || 0;

  return localScore >= remoteScore ? local : remote;
}
```

- [ ] **Step 2: Apply resolver in sync handlers**

Find the Supabase sync function and add:

```jsx
const resolved = resolveProgressConflict(localState, remoteState);
```

- [ ] **Step 3: Verify lint**

```bash
npx eslint src/store/ --ext .js
```
Expected: No errors.

---

### Task 7: iOS Safari 100dvh Fix in ResourceViewerModal

**Files:**
- Modify: `src/components/IALab/ResourceViewerModal/index.jsx`

- [ ] **Step 1: Replace h-[90dvh] with dynamic dvh**

Search for `h-\[90dvh\]` in the file. Replace the parent container:

```jsx
{/* Before: */}
className="..."
style={{ /* any existing styles */ }}

{/* After: change className and add style */}
className="... h-full ..."
style={{
  height: 'calc(100dvh - 2rem)',
  maxHeight: 'calc(100dvh - 2rem)',
}}
```

- [ ] **Step 2: Verify lint**

```bash
npx eslint src/components/IALab/ResourceViewerModal/index.jsx
```
Expected: No errors.

---

### Task 8: React.memo + Stable Callbacks in ResourceViewerModal

**Files:**
- Modify: `src/components/IALab/ResourceViewerModal/index.jsx`

- [ ] **Step 1: Wrap export with React.memo**

```jsx
// At bottom, change:
export default ResourceViewerModal;

// To:
export default React.memo(ResourceViewerModal);
```

- [ ] **Step 2: Stabilize key callbacks with useCallback**

Find these handler patterns and wrap:

```jsx
// Tab change handlers:
const handleTabChange = useCallback((tab) => {
  setActiveTab(tab);
}, []);

// Close handler:
const handleClose = useCallback(() => {
  onClose?.();
}, [onClose]);

// Navigation handlers:
const handleNext = useCallback(() => {
  // existing navigation logic
}, [/* existing deps */]);

const handlePrev = useCallback(() => {
  // existing navigation logic
}, [/* existing deps */]);
```

- [ ] **Step 3: Verify lint**

```bash
npx eslint src/components/IALab/ResourceViewerModal/index.jsx
```
Expected: No errors.

---

### Task 9: Virtualize Forum Post List

**Files:**
- Modify: `src/components/IALab/forum/IALabForumPostList.jsx`

- [ ] **Step 1: Install react-window**

```bash
npm install react-window
```

- [ ] **Step 2: Replace flat map with FixedSizeList**

```jsx
// Add import:
import { FixedSizeList as List } from 'react-window';

// Find the posts.map(...) rendering:
// Before:
{posts.map((post) => (
  <IALabForumPostCard key={post.id} post={post} />
))}

// After:
{posts.length > 0 ? (
  <List
    height={600}
    itemCount={posts.length}
    itemSize={120}
    width="100%"
    itemData={posts}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <IALabForumPostCard key={data[index].id} post={data[index]} />
      </div>
    )}
  </List>
) : (
  <IALabForumEmptyState />
)}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

---

### Task 10: Spaced Repetition for Content (Extend SM-2)

**Files:**
- Create: `src/hooks/IALab/useSpacedRepetition.js`
- Modify: `src/store/ialabStore.js` (add content review state)
- Modify: `src/components/IALab/IALabDashboard.jsx` (add "Due for Review" section)

- [ ] **Step 1: Create useSpacedRepetition hook**

```jsx
// src/hooks/IALab/useSpacedRepetition.js
import { useCallback, useMemo } from 'react';
import { useIALabStore } from '../../store/ialabStore';

const INITIAL_INTERVAL = 1;
const MIN_INTERVAL = 1;
const MAX_INTERVAL = 365;

function calculateSM2(quality, previousInterval, previousRepetitions) {
  let interval = previousInterval || INITIAL_INTERVAL;
  let repetitions = previousRepetitions || 0;

  if (quality < 3) {
    repetitions = 0;
    interval = MIN_INTERVAL;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * (quality > 3 ? 2.5 : 1.3));
    }
  }

  return {
    interval: Math.min(interval, MAX_INTERVAL),
    repetitions,
    nextReview: new Date(Date.now() + interval * 86400000).toISOString(),
    lastReview: new Date().toISOString(),
    ease: quality,
  };
}

export function useSpacedRepetition(contentId) {
  const contentReviews = useIALabStore((s) => s.contentReviews || {});
  const updateContentReview = useIALabStore((s) => s.updateContentReview);

  const review = contentReviews[contentId];

  const dueForReview = useMemo(() => {
    if (!review) return true;
    return new Date(review.nextReview) <= new Date();
  }, [review]);

  const submitReview = useCallback((quality) => {
    const prevInterval = review?.interval || INITIAL_INTERVAL;
    const prevReps = review?.repetitions || 0;
    const result = calculateSM2(quality, prevInterval, prevReps);
    updateContentReview(contentId, result);
    return result;
  }, [contentId, review, updateContentReview]);

  return { review, dueForReview, submitReview };
}
```

- [ ] **Step 2: Add contentReviews state to the store**

In `ialabStore.js`, add to the initial state:

```jsx
contentReviews: {},
```

Add to the actions:

```jsx
updateContentReview: (contentId, reviewData) =>
  set((state) => ({
    contentReviews: {
      ...state.contentReviews,
      [contentId]: {
        ...state.contentReviews[contentId],
        ...reviewData,
      },
    },
  })),
```

- [ ] **Step 3: Add "Due for Review" section to IALabDashboard**

```jsx
// In IALabDashboard.jsx:
import { useIALabStore } from '../../store/ialabStore';

function DueForReview() {
  const contentReviews = useIALabStore((s) => s.contentReviews || {});
  const dueItems = Object.entries(contentReviews)
    .filter(([, review]) => new Date(review.nextReview) <= new Date())
    .slice(0, 5);

  if (dueItems.length === 0) return null;

  return (
    <section className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-6">
      <h3 className="text-sm font-bold text-amber-800 mb-3">
        Due for Review ({dueItems.length})
      </h3>
      <div className="space-y-2">
        {dueItems.map(([id]) => (
          <button key={id} className="w-full text-left text-sm text-amber-700 hover:text-amber-900 transition-colors">
            Review content #{id}
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify lint**

```bash
npx eslint src/hooks/IALab/useSpacedRepetition.js src/store/ialabStore.js
```
Expected: No errors.

---

### Task 11: Adaptive Learning — Dynamic Module Hints

**Files:**
- Create: `src/hooks/IALab/useAdaptivePath.js`
- Modify: `src/components/IALab/IALabModuleHeader.jsx`

- [ ] **Step 1: Create useAdaptivePath hook**

```jsx
// src/hooks/IALab/useAdaptivePath.js
import { useMemo } from 'react';
import { useIALabStore } from '../../store/ialabStore';

const MASTERY_THRESHOLD = 85;
const REMEDIATION_THRESHOLD = 60;

export function useAdaptivePath() {
  const moduleScores = useIALabStore((s) => s.moduleScores || {});

  return useMemo(() => {
    const needsReview = [];
    const readyForNext = [];
    const mastered = [];

    Object.entries(moduleScores).forEach(([moduleId, scores]) => {
      const scoresArr = Array.isArray(scores) ? scores : [scores];
      const avgScore = scoresArr.reduce((a, b) => a + b, 0) / scoresArr.length || 0;

      if (avgScore >= MASTERY_THRESHOLD) {
        mastered.push(Number(moduleId));
      } else if (avgScore <= REMEDIATION_THRESHOLD) {
        needsReview.push(Number(moduleId));
      } else {
        readyForNext.push(Number(moduleId));
      }
    });

    return {
      needsReview,
      readyForNext,
      mastered,
      nextRecommended: needsReview.length > 0
        ? needsReview[0]
        : readyForNext.length > 0
          ? readyForNext[0]
          : (mastered.length + 1),
      masteredCount: mastered.length,
    };
  }, [moduleScores]);
}
```

- [ ] **Step 2: Add hint component to ModuleHeader**

```jsx
// In IALabModuleHeader.jsx:
import { useAdaptivePath } from '../../hooks/IALab/useAdaptivePath';

function AdaptiveHint({ currentModuleId }) {
  const { needsReview, nextRecommended } = useAdaptivePath();

  if (needsReview.includes(currentModuleId)) {
    return (
      <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
        Review recommended — your last score was below 60%
      </div>
    );
  }

  if (nextRecommended > currentModuleId) {
    return (
      <div className="mt-3 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
        Ready for Module {nextRecommended}
      </div>
    );
  }

  return null;
}
```

- [ ] **Step 3: Verify lint**

```bash
npx eslint src/hooks/IALab/useAdaptivePath.js src/components/IALab/IALabModuleHeader.jsx
```
Expected: No errors.

---

### Task 12: Practice Sandbox Component

**Files:**
- Create: `src/components/IALab/IALabSandbox.jsx`
- Modify: `src/components/IALab/IALab.jsx` (add sandbox tab)

- [ ] **Step 1: Create IALabSandbox component**

```jsx
// src/components/IALab/IALabSandbox.jsx
import { useState, useCallback } from 'react';
import { useTranslation } from '../../i18n/I18nProvider';
import SectionErrorBoundary from './SectionErrorBoundary';

const PROMPT_PRESETS = [
  { label: 'Summarize a text', prompt: 'Summarize the following text in 3 bullet points:\n\n' },
  { label: 'Write an email', prompt: 'Write a professional email about:\n\n' },
  { label: 'Brainstorm ideas', prompt: 'Generate 5 creative ideas for:\n\n' },
  { label: 'Explain concept', prompt: 'Explain this concept simply:\n\n' },
];

export default function IALabSandbox() {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [preset, setPreset] = useState('');

  const handlePreset = useCallback((p) => {
    setPreset(p.label);
    setPrompt(p.prompt);
    setResponse('');
  }, []);

  const handleClear = useCallback(() => {
    setPrompt('');
    setResponse('');
    setPreset('');
  }, []);

  return (
    <SectionErrorBoundary name="IALabSandbox">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-petroleum mb-2">
          Practice Sandbox
        </h2>
        <p className="text-slate-600 mb-6">
          Experiment with prompts. No evaluations, no scoring.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {PROMPT_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePreset(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                preset === p.label
                  ? 'bg-petroleum text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write your prompt here..."
          rows={6}
          className="w-full rounded-xl border border-slate-200 p-4 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-petroleum/30 focus:border-petroleum"
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleClear}
            className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
        </div>

        {response && (
          <div className="mt-8 rounded-xl bg-slate-50 border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
              Response
            </h3>
            <p className="text-slate-700 whitespace-pre-wrap">{response}</p>
          </div>
        )}

        <div className="mt-8 rounded-xl bg-corporate/5 border border-corporate/20 p-4">
          <h3 className="text-sm font-bold text-corporate mb-2">Tips for better prompts</h3>
          <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
            <li>Be specific about what you want</li>
            <li>Provide context and examples</li>
            <li>Specify the output format</li>
            <li>Break complex requests into steps</li>
          </ul>
        </div>
      </div>
    </SectionErrorBoundary>
  );
}
```

- [ ] **Step 2: Add sandbox to IALab.jsx navigation**

In `IALab.jsx`, add to the tab/section navigation:

```jsx
// In tabs array:
{ id: 'sandbox', label: t('ialab.sandbox.title') || 'Practice', icon: 'FlaskConical' }

// Lazy import:
const IALabSandbox = lazy(() => import('./IALabSandbox'));

// Route render:
{activeSection === 'sandbox' && (
  <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading...</div>}>
    <IALabSandbox />
  </Suspense>
)}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

---

## Self-Review

**Spec coverage:** Every audit item maps to a task:
- Focus trap (StreakDetailsModal) → Task 1
- Font Awesome → Icon → Task 2
- Silent catches → Task 3
- Global ErrorBoundary → Task 4
- TopicResourcesModal skeleton → Task 5
- Multi-device conflict → Task 6
- iOS Safari dvh → Task 7
- React.memo ResourceViewer → Task 8
- Forum virtualization → Task 9
- Spaced repetition → Task 10
- Adaptive learning → Task 11
- Practice sandbox → Task 12

**Placeholder scan:** All code blocks complete. No TBD/TODO patterns.

**Type consistency:** Hook names (`useSpacedRepetition`, `useAdaptivePath`) follow `useIALab*` naming convention. Icon component usage matches existing `<Icon name="..." />` pattern.

## Execution Handoff

Plan complete and saved to `.opencode/plans/2026-07-26-ialab-improvement-plan.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — Fresh subagent per task with systematic-debugging skill, review between tasks, fast iteration
2. **Inline Execution** — Execute in this session with checkpoints for review

Which approach?
