# Valerio Panel Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert Valerio from a blocking modal to a persistent side panel that stays open while interacting with the dashboard and auto-closes when video/OVA modals open.

**Architecture:** Remove ValerioPanel from IALabModals FocusTrapModal → render directly in IALab.jsx as a fixed right-side panel with no backdrop/focus-trap. Add `immersiveModalOpen` flag to Zustand `uiSlice` for auto-close coordination. Sync modal states in TopicResourcesModal and ModuleOverviewCard via useEffect.

**Tech Stack:** React, Zustand, Tailwind CSS, Framer Motion

---

### Task 1: Add `immersiveModalOpen` to uiSlice

**Files:**
- Modify: `src/store/slices/uiSlice.js`

- [ ] **Add immersive modal state**

```js
export const createUiSlice = (set, get) => ({
  showProfileDropdown: false,
  setShowProfileDropdown: (v) => set({ showProfileDropdown: v }),
  showEvaluationTooltip: false,
  setShowEvaluationTooltip: (v) => set({ showEvaluationTooltip: v }),
  isMarkingComplete: false,
  setIsMarkingComplete: (v) => set({ isMarkingComplete: v }),
  isSubmittingQuiz: false,
  setIsSubmittingQuiz: (v) => set({ isSubmittingQuiz: v }),
  isQuizValid: false,
  setIsQuizValid: (v) => set({ isQuizValid: v }),

  showBadgeGallery: false,
  setShowBadgeGallery: (v) => set({ showBadgeGallery: v }),

  showLeaderboard: false,
  setShowLeaderboard: (v) => set({ showLeaderboard: v }),

  immersiveModalOpen: false,
  setImmersiveModalOpen: (v) => set({ immersiveModalOpen: v }),
});
```

---

### Task 2: Update IALabValerioPanel/index.jsx — change layout from modal to side panel

**Files:**
- Modify: `src/components/IALab/IALabValerioPanel/index.jsx` (lines 447-475)

- [ ] **Replace loading state layout** (lines 449-458)

Old:
```jsx
if (!currentModule) {
    return (
      <div className="fixed inset-0 z-[90] flex items-end justify-end">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md h-[90vh] bg-white rounded-t-2xl shadow-2xl flex flex-col items-center justify-center p-8 z-10">
          <div className="w-12 h-12 border-2 border-petroleum/30 border-t-petroleum rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-medium">{t('ialab.valerio.loading')}</p>
        </div>
      </div>
    );
  }
```

New:
```jsx
if (!currentModule) {
    return (
      <div className="fixed right-0 top-0 bottom-0 z-[90] flex flex-col">
        <div className="relative w-[380px] max-md:w-[85vw] h-full bg-white shadow-2xl flex flex-col items-center justify-center p-8 z-10">
          <div className="w-12 h-12 border-2 border-petroleum/30 border-t-petroleum rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-medium">{t('ialab.valerio.loading')}</p>
        </div>
      </div>
    );
  }
```

- [ ] **Replace main panel layout** (lines 461-475)

Old:
```jsx
<SectionErrorBoundary name="ValerioPanel">
    <div ref={focusTrapRef} className="fixed inset-0 z-[90] flex items-end justify-end" role="dialog" aria-modal="true" aria-label={t('ialab.valerio.panel_aria')} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}>
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-label={t('ialab.valerio.close_aria')}
      />

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.4 }}
        onDragEnd={(_, info) => { if (info.offset.y > 80) onClose(); }}
        className="relative w-full max-w-md h-[90vh] landscape:md:h-dvh bg-white rounded-t-2xl shadow-2xl flex flex-col z-10"
        role="document"
        style={{ willChange: 'transform' }}
      >
```

New:
```jsx
<SectionErrorBoundary name="ValerioPanel">
    <div className="fixed right-0 top-0 bottom-0 z-[90] flex flex-col" role="dialog" aria-label={t('ialab.valerio.panel_aria')} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-[380px] max-md:w-[85vw] h-full bg-white shadow-2xl flex flex-col z-10"
        role="document"
        style={{ willChange: 'transform' }}
      >
```

- [ ] **Remove focus-trap ref import** — find and remove `const focusTrapRef = useFocusTrap(isOpen);` (line 445)

---

### Task 3: Remove ValerioPanel from IALabModals

**Files:**
- Modify: `src/components/IALab/IALabModals.jsx`

- [ ] **Remove ValerioPanel lazy import** (line 11)

Remove:
```js
const IALabValerioPanel = lazy(() => import('./IALabValerioPanel'));
```

- [ ] **Remove ValerioPanel rendering block** (lines 78-89)

Remove:
```jsx
<FocusTrapModal isOpen={showValerioPanel}>
{showValerioPanel && (
    <SectionErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <IALabValerioPanel
          isOpen={showValerioPanel}
          onClose={() => handleGlobalAction('CLOSE_VALERIO')}
        />
      </Suspense>
    </SectionErrorBoundary>
)}
</FocusTrapModal>
```

- [ ] **Remove showValerioPanel from destructured props** (line 39)

Remove `showValerioPanel,` from the destructuring.

- [ ] **Remove showValerioPanel from propTypes** (line 215)

Remove `showValerioPanel: PropTypes.any,`

---

### Task 4: Render ValerioPanel directly in IALab.jsx + auto-close

**Files:**
- Modify: `src/components/IALab/IALab.jsx`

- [ ] **Add IALabValerioPanel lazy import** (after existing lazy imports, around line 35)

```js
const IALabValerioPanel = lazy(() => import('./IALabValerioPanel'));
```

- [ ] **Add auto-close useEffect** (after the existing useEffects, around line 200)

```js
const immersiveModalOpen = useIALabStore(s => s.immersiveModalOpen);
useEffect(() => {
  if (immersiveModalOpen) setShowValerioPanel(false);
}, [immersiveModalOpen]);
```

- [ ] **Render IALabValerioPanel after ValerioFloatingButton** (around line 485)

```jsx
{showValerioPanel && (
  <IALabValerioPanel
    isOpen={showValerioPanel}
    onClose={() => setShowValerioPanel(false)}
  />
)}
```

- [ ] **Remove showValerioPanel prop from <IALabModals>** (line 461)

Remove `showValerioPanel={showValerioPanel}` from the `<IALabModals` JSX.

---

### Task 5: Sync immersive modal flag in TopicResourcesModal

**Files:**
- Modify: `src/components/IALab/TopicResourcesModal.jsx`

- [ ] **Add useEffect + import** (at top imports, add `useIALabStore` if not already imported; add useEffect import at top)

```js
import { useIALabStore } from '../../store/ialabStore';
```

- [ ] **Add sync effect** (after existing state/useEffect declarations, around line 50)

```js
useEffect(() => {
  useIALabStore.getState().setImmersiveModalOpen(viewerModalOpen || ovaModalOpen || immersivePdfModalOpen);
}, [viewerModalOpen, ovaModalOpen, immersivePdfModalOpen]);
```

---

### Task 6: Sync immersive modal flag in ModuleOverviewCard

**Files:**
- Modify: `src/components/IALab/ModuleOverviewCard.jsx`

- [ ] **Add import** (if not already present)

```js
import { useIALabStore } from '../../store/ialabStore';
```

- [ ] **Add sync effect** (after existing state declarations, around line 50)

```js
const immersiveModalOpen = useIALabStore(s => s.immersiveModalOpen);
useEffect(() => {
  if (viewerModalOpen && !immersiveModalOpen) {
    useIALabStore.getState().setImmersiveModalOpen(true);
  } else if (!viewerModalOpen && immersiveModalOpen) {
    useIALabStore.getState().setImmersiveModalOpen(false);
  }
}, [viewerModalOpen, immersiveModalOpen]);
```

---

### Task 7: Verify no regressions

- [ ] **Build check**

Run: `npm run build` (or `npm run lint` if build not available)
Expected: No errors

- [ ] **Manual checks**
  - ValerioFloatingButton is visible and toggles panel
  - Panel opens as right-side drawer (no backdrop, no focus trap)
  - Dashboard is interactive while panel is open
  - Opening a video/OVA resource auto-closes Valerio
  - Closing the modal does NOT reopen Valerio
  - Other modals (exam, quiz, leaderboard) still work correctly
  - Mobile: panel takes 85vw width
