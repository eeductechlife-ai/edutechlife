# IALab Progress Persistence Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix student progress that resets to 0% after page refresh, and auto-mark OVA "Comienzos de la IA" as seen when certificate screen appears.

**Architecture:** 4 independent fixes — (1) Zustand persist config, (2) initial state, (3) sync restoration from localStorage, (4) OVA auto-complete. No new files. No function signatures changed.

**Tech Stack:** React + Zustand + localStorage + Supabase

---

### Task 1: Add `viewedResources` to initial module progress

**Files:**
- Modify: `src/constants/ialab.js:37-43`

- [ ] **Add `viewedResources` and `resourcesPct` to `INITIAL_MODULE_PROGRESS`**

```javascript
// Before:
export const INITIAL_MODULE_PROGRESS = {
  1: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true },
  2: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
  3: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
  4: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
  5: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
};

// After:
export const INITIAL_MODULE_PROGRESS = {
  1: { exam: false, challenge: false, resourcesCompleted: false, resourcesPct: 0, viewedResources: [], community: false, currentScore: 0, isUnlocked: true },
  2: { exam: false, challenge: false, resourcesCompleted: false, resourcesPct: 0, viewedResources: [], community: false, currentScore: 0, isUnlocked: false },
  3: { exam: false, challenge: false, resourcesCompleted: false, resourcesPct: 0, viewedResources: [], community: false, currentScore: 0, isUnlocked: false },
  4: { exam: false, challenge: false, resourcesCompleted: false, resourcesPct: 0, viewedResources: [], community: false, currentScore: 0, isUnlocked: false },
  5: { exam: false, challenge: false, resourcesCompleted: false, resourcesPct: 0, viewedResources: [], community: false, currentScore: 0, isUnlocked: false },
};
```

- [ ] **Verify**

Run: `node -e "const { INITIAL_MODULE_PROGRESS } = require('./src/constants/ialab.js');"` if possible, or visually confirm no syntax errors.

- [ ] **Commit**

```bash
git add src/constants/ialab.js
git commit -m "fix(ialab): add viewedResources and resourcesPct to INITIAL_MODULE_PROGRESS"
```

---

### Task 2: Persist `moduleProgress` via Zustand middleware

**Files:**
- Modify: `src/store/ialabStore.js:339-354`

- [ ] **Add `moduleProgress` and progress fields to Zustand `partialize`**

```javascript
// Before:
partialize: (state) => ({
  xp: state.xp,
  streak: state.streak,
  lastActivityDate: state.lastActivityDate,
  startDate: state.startDate,
  badges: state.badges,
  badgesDates: state.badgesDates,
  forumPostCount: state.forumPostCount,
  forumCommentCount: state.forumCommentCount,
  lessonProgress: state.lessonProgress,
  checkpointAnswers: state.checkpointAnswers,
}),

// After:
partialize: (state) => ({
  // Gamification
  xp: state.xp,
  streak: state.streak,
  lastActivityDate: state.lastActivityDate,
  startDate: state.startDate,
  badges: state.badges,
  badgesDates: state.badgesDates,
  forumPostCount: state.forumPostCount,
  forumCommentCount: state.forumCommentCount,
  lessonProgress: state.lessonProgress,
  checkpointAnswers: state.checkpointAnswers,
  // Progress tracking (was missing — caused 0% on refresh)
  moduleProgress: state.moduleProgress,
  completedModules: state.completedModules,
  courseProgress: state.courseProgress,
  completedExams: state.completedExams,
  completedVideos: state.completedVideos,
  completedInfographics: state.completedInfographics,
  completedActivities: state.completedActivities,
  challengeScores: state.challengeScores,
}),
```

This ensures that after page refresh, Zustand rehydrates `moduleProgress` (including all `viewedResources` arrays) from localStorage automatically.

- [ ] **Verify no syntax errors**

```bash
npx eslint src/store/ialabStore.js --quiet || echo "OK"
```

- [ ] **Commit**

```bash
git add src/store/ialabStore.js
git commit -m "fix(ialab): persist moduleProgress and progress state via Zustand partialize"
```

---

### Task 3: Rebuild `moduleProgress` in `syncFromPersistence` for legacy data

**Files:**
- Modify: `src/store/slices/persistenceSlice.js`
- Modify: `src/constants/ialab.js` (add RESOURCE_MODULE_MAP)

**Context:** Users who already viewed resources before this fix have data in `ialab_viewed_resources` localStorage key, but `moduleProgress` was never persisted. This task adds a one-time migration in `syncFromPersistence` that reads that flat list and rebuilds `moduleProgress` per module.

- [ ] **Add `RESOURCE_MODULE_MAP` to `constants/ialab.js`**

Add after `INITIAL_MODULE_PROGRESS`:

```javascript
/** @type {Record<string, number>} */
export const RESOURCE_MODULE_MAP = {
  // Module 1: Ingeniería de Prompts
  'intro-video-1': 1, 'intro-ova-1': 1,
  'prompt-video-1': 1, 'prompt-guide-1': 1, 'prompt-ova-html-1': 1,
  'chatgpt-video-1': 1, 'chatgpt-guide-modulo2': 1, 'chatgpt-ova-ecosystem': 1,
  'workflow-pdf-modulo2': 1, 'workflow-ova-herramientas': 1,
  'gpts-guide-1': 1, 'gpts-ova-1': 1,
  // Module 2: Potencia ChatGPT / Deep Research
  'gemini-video-1': 2, 'gemini-guide-1': 2, 'gemini-ova-1': 2,
  'workspace-video-1': 2, 'workspace-template-1': 2, 'workspace-ova-1': 2,
  'gemini-cases-video-1': 2, 'gemini-cases-guide-1': 2, 'gemini-cases-ova-1': 2,
  // Module 3: NotebookLM
  'notebooklm-video-1': 3, 'notebooklm-guide-1': 3, 'notebooklm-ova-1': 3,
  'notebook-summary-video-1': 3, 'notebook-summary-template-1': 3, 'notebook-summary-ova-1': 3,
  'notebook-audio-video-1': 3, 'notebook-audio-guide-1': 3, 'notebook-audio-ova-1': 3,
  // Module 4: Ética y bias
  'bias-video-1': 4, 'bias-guide-1': 4, 'bias-ova-1': 4,
  'privacy-video-1': 4, 'privacy-guide-1': 4, 'privacy-ova-1': 4,
  'ethics-video-1': 4, 'ethics-ova-1': 4,
  // Module 5: (add resources here when module 5 resources are defined)
};
```

- [ ] **Add migration logic at the end of `syncFromPersistence` in `persistenceSlice.js`**

Import `RESOURCE_MODULE_MAP`, `MODULE_RESOURCE_COUNTS`, and `calcModuleScore`:

```javascript
// At top of file — add to existing imports:
import { LS_KEYS, INITIAL_MODULE_PROGRESS, MODULE_RESOURCE_COUNTS, RESOURCE_MODULE_MAP } from '@/constants/ialab';
import { ls, calcModuleScore } from '@/utils/ialab';
```

Add at the END of the `syncFromPersistence` function body (before the closing `})`), after the existing `set({...})` call:

```javascript
// -------------------------------------------------------
// LEGACY MIGRATION: Rebuild moduleProgress.viewedResources
// from flat ialab_viewed_resources list (pre-persistence era)
// -------------------------------------------------------
const currentModuleProgress = get().moduleProgress;
const hasAnyViewed = Object.values(currentModuleProgress).some(
  m => (m.viewedResources?.length || 0) > 0
);
if (!hasAnyViewed) {
  const flatViewed = get().getViewedResources();
  if (Array.isArray(flatViewed) && flatViewed.length > 0) {
    const rebuiltProgress = JSON.parse(JSON.stringify(INITIAL_MODULE_PROGRESS));
    const completedMods = get().completedModules || [];

    flatViewed.forEach(id => {
      const modId = RESOURCE_MODULE_MAP[id];
      if (modId && rebuiltProgress[modId]) {
        if (!rebuiltProgress[modId].viewedResources.includes(id)) {
          rebuiltProgress[modId].viewedResources.push(id);
        }
      }
    });

    Object.entries(rebuiltProgress).forEach(([modId, mod]) => {
      const mid = Number(modId);
      const viewed = mod.viewedResources || [];
      const total = MODULE_RESOURCE_COUNTS[mid] || 8;
      const pct = Math.round((viewed.length / total) * 100);
      mod.resourcesPct = pct;
      mod.resourcesCompleted = completedMods.includes(mid) || viewed.length >= total;
      mod.currentScore = calcModuleScore(mod);
    });

    set({ moduleProgress: rebuiltProgress });
  }
}
```

- [ ] **Run linter on changed files**

```bash
npx eslint src/store/slices/persistenceSlice.js --quiet || echo "OK"
```

- [ ] **Commit**

```bash
git add src/store/slices/persistenceSlice.js src/constants/ialab.js
git commit -m "fix(ialab): rebuild moduleProgress from legacy localStorage in syncFromPersistence"
```

---

### Task 4: Auto-mark OVA as seen when certificate screen renders

**Files:**
- Modify: `src/components/IALab/OVAEtica.jsx`

**Context:** Currently, `CertificateScreen` shows a manual "Mark Complete" button. The student must click it to trigger `onComplete`. The requirement: when the result/certificate modal appears (after quiz), the OVA should auto-mark as completed without manual click.

- [ ] **Add auto-complete `useEffect` in `OVAEtica.jsx`**

```javascript
// Add import at top:
import React, { useState, useEffect, useRef, useMemo } from 'react';

// Add this useEffect after the `useRef` lines (after line 311):
useEffect(() => {
  if (screen === 'certificate' && !certCompletedRef.current) {
    certCompletedRef.current = true;
    onComplete?.();
  }
}, [screen, onComplete]);
```

`certCompletedRef.current` is initialized as `false` on line 311. The effect fires when `screen` becomes `'certificate'`, sets the ref to `true` (prevents double-fire), and calls `onComplete?.()`.

Now the student completes the quiz → screen changes to `'certificate'` → `useEffect` fires → `onComplete()` is called → parent (`ResourceViewerModal`) handles `handleAutoComplete()` → `markResourceAsViewed()` → progress saved.

The manual button is no longer needed but can remain as a visual indicator or be removed.

- [ ] **Optionally hide manual button (visual cleanup)**

Keep the button but make it non-functional since auto-complete already fired:

```javascript
// line 287 change:
showMarkButton={false} // Always hide since auto-complete handles it
// or keep as is — button won't show because certCompletedRef.current is already true
```

With the ref set to `true` at effect time, `showMarkButton={!certCompletedRef.current}` evaluates to `false`, so the button auto-hides.

- [ ] **Verify component logic**

Read `OVAEtica.jsx:308-436` to confirm the flow:
1. Quiz screen (m6) → user answers → `QuizScreen.onNext` fires → `setScreen('certificate')`
2. `screen === 'certificate'` triggers the new `useEffect`
3. `onComplete?.()` propagates to `ResourceViewerModal/index.jsx` → `handleAutoComplete` → `handleMarkAsViewed`

- [ ] **Commit**

```bash
git add src/components/IALab/OVAEtica.jsx
git commit -m "feat(ialab): auto-mark OVA completado al mostrar pantalla de certificado"
```

---

### Verification

- [ ] **Test progress persistence**
  1. Open OVA "Comienzos de la IA" in Module 1
  2. Complete the quiz → certificate screen appears → OVA auto-marks as seen (Task 4)
  3. Verify `moduleProgress[1].viewedResources` includes `'intro-ova-1'` in Zustand DevTools
  4. Refresh the page
  5. Verify `moduleProgress[1].viewedResources` still includes `'intro-ova-1'` (Task 2)
  6. Verify progress % is correct

- [ ] **Test multiple resources**
  1. View other resources across different modules
  2. Refresh and verify all viewed resources persist
  3. Verify `resourcesPct` and `resourcesCompleted` are recalculated correctly

- [ ] **Test legacy migration**
  1. Clear `ialab-store` from localStorage (simulate pre-fix state)
  2. Set `ialab_viewed_resources` with `['intro-ova-1', 'prompt-video-1']`
  3. Open IALab page
  4. Verify `syncFromPersistence` migration rebuilds `moduleProgress` (Task 3)
  5. Verify viewed resources appear correctly

- [ ] **Run existing tests**

```bash
npm test -- --testPathPattern=progressSlice || npm test src/store/__tests__/progressSlice.test.js
```
