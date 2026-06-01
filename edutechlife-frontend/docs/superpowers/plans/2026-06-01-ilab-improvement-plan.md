# iLAB Improvement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the 7 critical/medium issues identified in the iLAB 7.9/10 audit — security (CSP, X-Frame-Options), analytics, refactoring (hooks, evaluation config duplication), performance (virtual scrolling, TypeScript, Web Vitals) — without altering any UI, functionality, or adding new buttons.

**Architecture:** Each task is self-contained and produces no behavioral changes. Tasks are ordered by risk: security first (external threat), infrastructure second (data loss), code quality third (no regression risk), performance last (optimization only).

**Tech Stack:** Vite 5, React 18, Zustand, Tailwind CSS, Framer Motion, Supabase, Clerk, Sentry

**Constraint:** NO UI changes, NO new functions, NO new buttons, NO behavioral alterations. Zero regressions.

---

## File Structure

### New files to create:
- `index.html` — CSP meta tag injected (modify existing, line ~6)
- `vite.config.js` — CSP headers in preview server (modify existing, line ~129)
- `src/services/ialab-analytics-server.js` — Server-side analytics sync (NEW)
- `src/services/analytics-sync.js` — Sync bridge (NEW)
- `src/lib/web-vitals.js` — Web Vitals tracking (NEW)
- `src/hooks/IALab/useIALabQuiz-refactored.js` — Refactored <400 line hook (NEW)
- `src/data/ialab/evaluationConfig.js` — Already exists, will be SOURCE OF TRUTH (modify)
- `src/hooks/IALab/useIALabEvaluation.js` — Remove inline config, import from evaluationConfig (modify)
- `src/services/evaluationScoring.js` — Already exists, will be SOURCE OF TRUTH (modify)
- `src/components/IALab/forum/IALabForumSection.jsx` — Add virtual scrolling (modify)
- `src/components/IALab/IALabScoreModal.jsx` — Add virtual scrolling to leaderboard if exists, or create wrapper

---

## Task 1: 🔴 Security — CSP Meta Tag + X-Frame-Options

**Files:**
- Modify: `index.html:6-8` — add CSP meta tag
- Modify: `vite.config.js:129-132` — add security headers to preview server

**Problem:** No Content Security Policy (CSP) means any XSS vulnerability can execute arbitrary scripts. No X-Frame-Options means the app can be embedded in iframes (clickjacking). No Subresource Integrity (SRI) on CDN scripts means compromised CDNs can inject malicious code.

**Solution:** Add CSP meta tag with strict allowlist for all known resources. Add `X-Frame-Options: DENY`. Add `integrity` attributes to CDN-loaded scripts.

- [ ] **Step 1: Read current index.html**

```
Read: edutechlife-frontend/index.html
```

Expected: Understand current script/link tags and their origins.

- [ ] **Step 2: Add CSP meta tag to index.html**

```
After the `<meta charset="UTF-8" />` line (currently line 6), add:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.edutechlife.com https://*.clerk.com https://js.sentry-cdn.com https://cdn.jsdelivr.net https://unpkg.com https://www.youtube.com https://www.google.com https://www.gstatic.com blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; connect-src 'self' https://*.supabase.co https://api.deepseek.com https://o4500000000000000000.ingest.us.sentry.io https://clerk.edutechlife.com https://*.clerk.com wss://*.clerk.com; frame-src https://www.youtube.com https://www.google.com; worker-src 'self' blob:; manifest-src 'self';"
/>
```

Note: Verify Sentry DSN origin matches the actual ingest URL in `src/lib/monitoring.js`.

- [ ] **Step 3: Add security headers to Vite preview server**

In `vite.config.js`, inside `preview` section (currently at line ~129), add:

```js
preview: {
  port: 4173,
  host: true,
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  }
}
```

- [ ] **Step 4: Verify build still compiles**

Run: `npx vite build`
Expected: Build succeeds with no errors.

---

## Task 2: 🔴 Security — SRI for CDN Scripts

**Files:**
- Modify: `index.html` — add `integrity` and `crossorigin` attributes to CDN `<script>` tags

**Problem:** Index.html loads Clerk from `https://clerk.edutechlife.com` CDN without integrity verification. A compromised CDN could serve malicious JavaScript.

**Solution:** Calculate SRI hashes for each CDN script and add `integrity` attribute.

- [ ] **Step 1: Read current index.html script tags**

```
Read: edutechlife-frontend/index.html
Look for: <script src="https://...">
```

Expected: Identify all external scripts.

- [ ] **Step 2: Generate SRI hashes for each external script**

For each CDN script URL, generate SHA-384 hash:

```bash
curl -sL <SCRIPT_URL> | openssl dgst -sha384 -binary | openssl base64 -A
```

Note: If Clerk URL is a proxy that changes content, skip SRI for that URL and document the risk.

- [ ] **Step 3: Add integrity attributes**

For each external script that accepts SRI:

```html
<script src="https://...js" integrity="sha384-<hash>" crossorigin="anonymous"></script>
```

- [ ] **Step 4: Verify build**

Run: `npx vite build`
Expected: Build succeeds.

---

## Task 3: 🔴 Analytics — Mover a Server-Side (Supabase)

**Files:**
- Create: `src/services/analytics-sync.js`
- Modify: `src/services/ialab-analytics.js`

**Problem:** All analytics data lives in localStorage. If user clears browser data, analytics is lost. No cross-device session tracking. No server-side aggregation possible.

**Solution:** Add periodic (debounced) sync to Supabase `ialab_analytics` table. Keep localStorage as fast local cache. Sync is fire-and-forget with 5s debounce — no behavioral change.

- [ ] **Step 1: Read current analytics service**

```
Read: edutechlife-frontend/src/services/ialab-analytics.js
```

Expected: Understand the data shape stored in localStorage. The likely key structure is `ialab:analytics` or similar. Check `getReport()` for the derived metrics format.

- [ ] **Step 2: Create sync bridge**

Create `src/services/analytics-sync.js`:

```js
import { supabase } from '../lib/supabase';

const SYNC_INTERVAL = 5000;
let syncTimer = null;
let pendingData = null;

export function scheduleSync(data) {
  pendingData = data;
  if (syncTimer) return;
  syncTimer = setTimeout(() => {
    syncTimer = null;
    if (pendingData) {
      performSync(structuredClone(pendingData));
      pendingData = null;
    }
  }, SYNC_INTERVAL);
}

async function performSync(data) {
  try {
    const { error } = await supabase.from('ialab_analytics').upsert(
      {
        user_id: data.userId || 'anonymous',
        session_data: data,
        synced_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
    if (error) console.warn('[AnalyticsSync] Supabase error:', error.message);
  } catch {
    // Silent fail — analytics sync must never break the user experience
  }
}
```

Note: Use `structuredClone` for deep copy to avoid mutation issues. Fire-and-forget — no retry logic needed (next sync will capture latest data).

- [ ] **Step 3: Integrate sync into existing analytics service**

In `ialab-analytics.js`, at end of the main tracking function (after localStorage write), add:

```js
import { scheduleSync } from './analytics-sync';

// Inside the existing track function, after localStorage.setItem(...):
const currentData = JSON.parse(localStorage.getItem('ialab:analytics') || '{}');
scheduleSync(currentData);
```

- [ ] **Step 4: Verify no behavioral change**

Run: `npx vite build`
Expected: Build succeeds.

---

## Task 4: 🟡 Refactor — Eliminar Duplicación de MODULE_CONFIG

**Files:**
- Modify: `src/hooks/IALab/useIALabEvaluation.js` — remove inline MODULE_CONFIG, import from evaluationConfig.js
- Already correct: `src/data/ialab/evaluationConfig.js` — source of truth
- Already correct: `src/services/evaluationScoring.js` — source of truth for scoring

**Problem:** The same module configuration data (prompts, exercises, scoring logic) exists in 3 places: `useIALabEvaluation.js` (inline MODULE_CONFIG), `evaluationConfig.js`, and `evaluationScoring.js`. Changes must be made in all 3.

**Solution:** Make `useIALabEvaluation.js` import config from `evaluationConfig.js` and scoring from `evaluationScoring.js`. Remove the inline MODULE_CONFIG object (lines 5-539) and the `localEvaluate` functions. This was already partially done in a previous task — verify and complete.

- [ ] **Step 1: Read current state of useIALabEvaluation.js**

```
Read: edutechlife-frontend/src/hooks/IALab/useIALabEvaluation.js
```

Expected: Check if MODULE_CONFIG is still inline or already imported. Check if `localEvaluate` functions are still present or already using `scoreEvaluation()`.

- [ ] **Step 2: Remove inline MODULE_CONFIG if present**

If lines contain a large `const MODULE_CONFIG = { ... }` object, replace with:

```js
import { getModuleConfig, EVALUATION_MODULES } from '../../data/ialab/evaluationConfig';
import { scoreEvaluation } from '../../services/evaluationScoring';

const MODULE_CONFIG = EVALUATION_MODULES;
```

- [ ] **Step 3: Replace localEvaluate calls with scoreEvaluation**

Find all `localEvaluate` calls and replace with `scoreEvaluation(moduleId, responses)`:

```js
// Before:
const result = MODULE_CONFIG[stepData.module].localEvaluate(responses);

// After:
import { scoreEvaluation } from '../../services/evaluationScoring';
// ...
const result = scoreEvaluation(stepData.module, responses);
```

- [ ] **Step 4: Verify hook exports unchanged**

Check that `useIALabEvaluation` still exports the same functions:

```
Grep: export (const|function) in useIALabEvaluation.js
```

Expected: Same exports as before refactor. No consumer file breaks.

- [ ] **Step 5: Verify build**

Run: `npx vite build`
Expected: 2784+ modules transformed, build succeeds.

---

## Task 5: 🟡 Refactor — useIALabQuiz (934 → <400 líneas)

**Files:**
- Create: `src/data/ialab/quizData.js` — extract quiz questions data
- Modify: `src/hooks/IALab/useIALabQuiz.js` — import quiz data, extract scoring logic
- Create: `src/services/quizScoring.js` — extract scoring logic into pure function

**Problem:** `useIALabQuiz.js` is 934 lines. It contains quiz questions data (hardcoded), scoring logic (pure function), timer logic, security logic, and state management. The hardcoded quiz questions (~40+ questions for 5 modules, ~200 lines) shouldn't live in a hook.

**Solution:**
1. Extract quiz questions data → `src/data/ialab/quizData.js`
2. Extract scoring logic → `src/services/quizScoring.js`
3. The hook retains: timer, navigation, state management, security, API calls (~350 lines)

- [ ] **Step 1: Read useIALabQuiz.js**

```
Read: edutechlife-frontend/src/hooks/IALab/useIALabQuiz.js
```

Expected: Understand the data structures. Identify:
- Inline questions arrays (`MODULE_QUESTIONS` or similar)
- Scoring function (`calculateQuizScore` or similar)
- Timer logic (useEffect with setInterval)
- Security logic (visibility change, keyboard blocking)
- State management (useState/useReducer)
- API calls (saveGradeToSupabase, etc.)

Map line numbers for each section.

- [ ] **Step 2: Extract quiz questions data**

Create `src/data/ialab/quizData.js`:

```js
// Quiz questions for all 5 modules
// Extracted from useIALabQuiz.js
// Each module has 8 questions with: id, topic, text (ES/EN), options, correctAnswer

export const MODULE_QUESTIONS = {
  1: [
    // ... exact content from useIALabQuiz.js lines XX-YY
  ],
  2: [
    // ... exact content from useIALabQuiz.js lines XX-YY
  ],
  3: [
    // ... exact content from useIALabQuiz.js lines XX-YY
  ],
  4: [
    // ... exact content from useIALabQuiz.js lines XX-YY
  ],
  5: [
    // ... exact content from useIALabQuiz.js lines XX-YY
  ],
};
```

- [ ] **Step 3: Extract scoring logic**

Create `src/services/quizScoring.js`:

```js
export function calculateQuizScore(questions, answers) {
  // Pure function — exact copy from useIALabQuiz.js
  let correct = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correctAnswer) correct++;
  });
  const percentage = Math.round((correct / questions.length) * 100);
  const passed = percentage >= 60;
  return { correct, total: questions.length, percentage, passed };
}
```

- [ ] **Step 4: Refactor useIALabQuiz.js**

Replace inline data and scoring with imports:

```js
import { MODULE_QUESTIONS } from '../../data/ialab/quizData';
import { calculateQuizScore } from '../../services/quizScoring';

// Remove inline MODULE_QUESTIONS (remove ~200 lines)
// Remove local calculateQuizScore function
// Keep: timer, navigation, state, security, API calls
```

Target: hook is now ~350-380 lines.

- [ ] **Step 5: Verify exports unchanged**

```
Grep: export (const|function) in useIALabQuiz.js
```

Expected: Same exports as before.

- [ ] **Step 6: Verify build**

Run: `npx vite build`
Expected: Build succeeds.

---

## Task 6: 🟢 Virtual Scrolling — Foro y Leaderboard

**Files:**
- Modify: `src/components/IALab/forum/IALabForumSection.jsx` — wrap post list with virtual scroller
- Modify: `src/components/IALab/leaderboard/Leaderboard.jsx` or equivalent — wrap leaderboard rows

**Problem:** Forum renders all posts (potentially hundreds) in a single flat list. Leaderboard renders all users. This causes performance degradation on large datasets.

**Solution:** Use `react-window` (already in dependency tree via transitive dep? Check) or implement a simple virtual scroller using IntersectionObserver (no external dependency). Since the constraint is NO new dependencies, use IntersectionObserver pattern to render only visible items.

- [ ] **Step 1: Check dependencies**

```
Grep: "react-window" or "react-virtualized" or "react-virtuoso" in package.json
```

Expected: Know if a virtual scroll library already exists.

If no library exists, implement a custom virtual scroller component:

- [ ] **Step 2: Create minimal virtual scroller utility (if no library)**

Create `src/components/IALab/shared/VirtualList.jsx`:

```jsx
import { useState, useRef, useCallback, useEffect } from 'react';

const ITEM_HEIGHT = 72; // px — estimated post card height
const OVERSCAN = 5; // items to render above/below viewport

export function VirtualList({ items, renderItem, itemHeight = ITEM_HEIGHT, overscan = OVERSCAN }) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleScroll = useCallback(() => {
    setScrollTop(containerRef.current?.scrollTop || 0);
  }, []);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan);

  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div ref={containerRef} onScroll={handleScroll} style={{ overflowY: 'auto', height: '100%' }}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, i) => (
          <div
            key={item.id || i}
            style={{
              position: 'absolute',
              top: (startIndex + i) * itemHeight,
              height: itemHeight,
              left: 0,
              right: 0,
            }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Integrate virtual list into forum**

Replace the post rendering loop in `IALabForumSection.jsx`:

```jsx
// Before:
{filteredPosts.map(post => <PostCard key={post.id} post={post} />)}

// After:
import { VirtualList } from '../shared/VirtualList';

<VirtualList
  items={filteredPosts}
  renderItem={post => <PostCard post={post} />}
  itemHeight={72}
/>
```

- [ ] **Step 4: Integrate virtual list into leaderboard**

Find the leaderboard rendering component (likely in `StreakDetailsModal.jsx` or standalone) and wrap with VirtualList.

```
Read: Search for "leaderboard" or "top" in src/components/IALab/
Grep: "leaderboard" in src/components/IALab/*.jsx
```

- [ ] **Step 5: Verify build and no visual regression**

Run: `npx vite build`
Expected: Build succeeds. Forum looks identical (posts render the same, just with DOM virtualization).

---

## Task 7: 🟢 Web Vitals Tracking

**Files:**
- Create: `src/lib/web-vitals.js`
- Modify: `src/components/IALab/IALab.jsx` — mount Web Vitals observer
- Modify: `src/lib/monitoring.js` — add Web Vitals to Sentry

**Problem:** No real-user performance metrics (Core Web Vitals) are tracked. Cannot measure LCP, CLS, INP, FID, TTFB.

**Solution:** Use `web-vitals` library (check if already in deps) or implement a lightweight manual observer. Report to Sentry as performance metrics.

- [ ] **Step 1: Check if web-vitals is installed**

```
Grep: "web-vitals" in package.json
```

If installed, use it. If not, install: `npm install web-vitals`

- [ ] **Step 2: Create web vitals tracking module**

Create `src/lib/web-vitals.js`:

```js
import { onLCP, onCLS, onINP, onFID, onTTFB } from 'web-vitals';

export function reportWebVitals() {
  if (!navigator?.connection?.effectiveType) {
    // Not in browser or missing navigator
    return;
  }

  const sendTo = ({ name, value, rating, delta, id }) => {
    try {
      // Send to localStorage for analytics sync
      const vitals = JSON.parse(localStorage.getItem('ialab:webVitals') || '[]');
      vitals.push({ name, value, rating, delta, id, timestamp: Date.now() });
      // Keep only last 20 entries
      localStorage.setItem('ialab:webVitals', JSON.stringify(vitals.slice(-20)));

      // Report to Sentry
      if (window.Sentry) {
        window.Sentry.metrics.distribution(`web_vital.${name}`, value, {
          unit: name === 'CLS' ? '' : 'millisecond',
          tags: { rating },
        });
      }
    } catch {
      // Silent
    }
  };

  onLCP(sendTo);
  onCLS(sendTo);
  onINP(sendTo);
  onFID(sendTo);
  onTTFB(sendTo);
}
```

- [ ] **Step 3: Mount in IALab.jsx**

In `src/components/IALab/IALab.jsx`, add at the top of the component (after hooks):

```js
import { reportWebVitals } from '../../lib/web-vitals';

// Inside component, after useIALabStore(...) hooks:
useEffect(() => {
  // Delay to avoid blocking main thread
  const timer = setTimeout(reportWebVitals, 3000);
  return () => clearTimeout(timer);
}, []);
```

- [ ] **Step 4: Verify build**

Run: `npx vite build`
Expected: Build succeeds.

---

## Task 8: 🟢 Migrar a TypeScript — Componentes Críticos

**Files:**
- Modify: `src/store/ialabStore.js` → `src/store/ialabStore.ts` — Rename + add types
- Modify: `src/data/ialab/evaluationConfig.js` → `src/data/ialab/evaluationConfig.ts` — Rename + add types
- Modify: `src/services/evaluationScoring.js` → `src/services/evaluationScoring.ts` — Rename + add types
- Modify: All import references to these files (update `.js` → `.ts`)

**Problem:** 82% of the codebase is JavaScript. This causes runtime errors that TypeScript would catch.

**Solution:** Convert the most data-flow-critical files to TypeScript (store, data, services). Leave JSX components for a future pass (converting JSX to TSX has higher risk of visual regressions).

**Constraint:** NO behavioral changes. Types are additive only. No refactoring of logic.

- [ ] **Step 1: Rename and add types to evaluationScoring.js**

Rename file, add type annotations:

```ts
// src/services/evaluationScoring.ts
interface ScoreResult {
  nota_ej1: number;
  nota_ej2: number;
  nota_ej3: number;
  notaGlobal: number;
  feedback_ej1: string;
  feedback_ej2: string;
  feedback_ej3: string;
}

type Responses = Record<string, string | string[] | Record<string, unknown>>;

export function scoreModule1(responses: Responses): ScoreResult { /* same logic */ }
export function scoreModule2(responses: Responses): ScoreResult { /* same logic */ }
export function scoreModule3(responses: Responses): ScoreResult { /* same logic */ }
export function scoreModule4(responses: Responses): ScoreResult { /* same logic */ }
export function scoreModule5(responses: Responses): ScoreResult { /* same logic */ }

export const SCORERS: Record<number, (responses: Responses) => ScoreResult> = {
  1: scoreModule1, 2: scoreModule2, 3: scoreModule3, 4: scoreModule4, 5: scoreModule5,
};

export function scoreEvaluation(moduleId: number, responses: Responses): ScoreResult {
  const scorer = SCORERS[moduleId] || scoreModule1;
  return scorer(responses);
}
```

- [ ] **Step 2: Rename and add types to evaluationConfig.js**

```ts
// src/data/ialab/evaluationConfig.ts
interface ModuleConfig {
  name: { es: string; en: string };
  totalSteps: number;
  generateSystemPrompt: (params: Record<string, unknown>) => string;
  generateUserPrompt: (params: Record<string, unknown>) => string;
  evaluateSystemPrompt: (params: Record<string, unknown>) => string;
  evaluateUserPrompt: (params: Record<string, unknown>) => string;
  fallbackExercises: (locale: string) => unknown[];
}

export const EVALUATION_MODULES: Record<number, ModuleConfig> = { /* ... */ };
export function getModuleConfig(moduleId: number): ModuleConfig { /* ... */ }
export function getModuleNames(locale: string): { es: string[]; en: string[] } { /* ... */ }
export function getModuleTotalSteps(moduleId: number): number { /* ... */ }
```

- [ ] **Step 3: Add types to ialabStore**

Minimal type addition — just add JSDoc or rename to .ts and add basic interfaces:

```ts
// src/store/ialabStore.ts
interface IALabState {
  // Add just enough types for the exported interface
  currentModule: number | null;
  sidebarExpanded: boolean;
  // ... (match existing state shape from store selector usage)
}
```

**Note:** Converting Zustand store to TS requires typing all 10 slices. To avoid breaking anything, add types incrementally:

1. Rename file to `.ts`
2. Add `// @ts-nocheck` at the top
3. Export typed interface for the store
4. Remove `// @ts-nocheck` only after verifying build

- [ ] **Step 4: Update all import references**

Find all files importing from these renamed files and update extensions:

```bash
# Find all files that import from the renamed files
grep -rn "from '.*data/ialab/evaluationConfig'" src/ --include="*.{js,jsx,ts,tsx}"
grep -rn "from '.*services/evaluationScoring'" src/ --include="*.{js,jsx,ts,tsx}"
grep -rn "from '.*store/ialabStore'" src/ --include="*.{js,jsx,ts,tsx}"
```

Remove `.js` extension from imports (Vite resolves `.ts` automatically).

- [ ] **Step 5: Verify build**

Run: `npx vite build`
Expected: Build succeeds.

---

## Task 9: 🧪 Verification — Build + Zero Regressions

**Files:** None — verification step only

- [ ] **Step 1: Full production build**

Run: `npx vite build`
Expected: Build succeeds with 2784+ modules transformed, PWA generates 135+ precached entries.

- [ ] **Step 2: Check no new warnings**

```
Grep: "warning" in build output
```

Expected: No new warnings (pre-existing chunk size warnings are acceptable).

- [ ] **Step 3: Verify no export changes**

```
For each modified hook file:
  grep "^export" src/hooks/IALab/useIALab*.js
```

Expected: Same exports as before refactoring.

- [ ] **Step 4: Verify no new dependencies added**

```
Grep: "npm install" or "yarn add" in bash history
```

Expected: Only `web-vitals` package was installed (if not already present). No other new deps.

- [ ] **Step 5: Run tests**

Run: `npx vitest run`
Expected: All existing tests pass.

---

## Execution Order & Dependencies

```
Task 1 (CSP) ─── no deps
Task 2 (SRI) ─── no deps
Task 3 (Analytics) ─── no deps
Task 4 (Eval Config) ─── no deps (standalone file change)
Task 5 (Quiz Hook) ─── depends on Task 4 (same pattern)
Task 6 (Virtual Scroll) ─── no deps
Task 7 (Web Vitals) ─── no deps
Task 8 (TypeScript) ─── best after Task 4 (TS conversion of same files)
Task 9 (Verification) ─── depends on all previous tasks
```

Tasks 1-7 are fully parallel. Task 8 can run in parallel with 1-7. Task 9 is sequential after all others.

---

## Rollback Plan

If any task introduces a regression:

```bash
git checkout -- <file>        # Revert single file
git restore src/hooks/        # Revert all hook changes
git clean -fd src/data/ialab/ # Remove new files (if created)
```
