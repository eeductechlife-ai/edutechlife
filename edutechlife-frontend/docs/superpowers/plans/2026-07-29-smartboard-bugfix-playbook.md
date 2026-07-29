# SmartBoard Bugfix Playbook

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Fix 10 critical/medium bugs across SmartBoard without changing any IALab, OVA, or non-SmartBoard code.

**Architecture:** Targeted one-file fixes. No refactoring, no new features. Each task is isolated to 1-2 files with a single root cause.

**Constraint:** ONLY touch files under `src/components/kids-dashboard/`, `src/context/`, `src/hooks/`. Never touch IALab, OVA, i18n, or resources.

---

### Task 1: Fix `addDaniMessage` stripping `type`/`data` from chart/video messages

**Root cause:** `useSmartBoardActions.js:41-54` stores only `{ role, text, timestamp }`. When `useDaniChat.js:432-446` calls `addDaniMessage({ role: "assistant", type: "chart", data: chartData })`, the `type` and `data` fields are discarded. `DaniChatMessages` checks `msg.type === "chart"` but it's never true.

**Files:**
- Modify: `edutechlife-frontend/src/context/useSmartBoardActions.js:41-54`

**Fix:** Spread the entire message object into the stored message instead of cherry-picking fields.

```js
addDaniMessage: useCallback((message) => {
  const msg = {
    role: message.role,
    text: message.text || message.content || '',
    type: message.type || 'text',
    data: message.data || null,
    id: message.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    timestamp: new Date().toISOString(),
  };
  setDaniChatHistory(prev => [...prev, msg]);
}, [setDaniChatHistory]),
```

- [ ] Edit `useSmartBoardActions.js` to preserve `type`, `data`, `id` in `addDaniMessage`
- [ ] Build: `npx vite build` — expect 0 errors
- [ ] Commit

---

### Task 2: Fix wrong localStorage keys in `buildRichWelcome`

**Root cause:** `useDaniChat.js:121,142` reads `edutechlife_missions` and `edutechlife_subjects` without userId suffix. Actual keys stored by `SmartBoardKidsContext:274-303` are `edutechlife_missions_{userId}` and `edutechlife_subjects_{userId}`.

**Files:**
- Modify: `edutechlife-frontend/src/components/kids-dashboard/daniTutorChat/useDaniChat.js`

**Fix:** Use `getLocalStorage` with userId suffix, matching the keys used in `SmartBoardKidsContext`.

```js
const storedMissions = getLocalStorage(`missions_${userId}`, []);
const storedSubjects = getLocalStorage(`subjects_${userId}`, []);
```

Also add `userId` as a parameter passed to `buildRichWelcome`.

- [ ] Read `useDaniChat.js` around lines 100-150 to find `buildRichWelcome`
- [ ] Fix localStorage key lookups to include userId
- [ ] Build — expect 0 errors
- [ ] Commit

---

### Task 3: Fix streak rendering `[object Object]` in SmartBoardAnalytics

**Root cause:** `SmartBoardAnalytics.jsx:454` renders `{streak || 0}`. The `streak` value from context is an object `{ current, longest, lastActive }`, always truthy, so React renders `[object Object]`.

**Files:**
- Modify: `edutechlife-frontend/src/components/kids-dashboard/SmartBoardAnalytics.jsx`

**Fix:** Read `streak.current` instead of `streak`.

```jsx
<p className={`text-lg font-black ...`}>
  {streak?.current || 0}
</p>
```

- [ ] Edit line 454 to use `streak?.current || 0`
- [ ] Build — expect 0 errors
- [ ] Commit

---

### Task 4: Fix sync indicator unreachable (dead code in SmartBoardKidsDashboard)

**Root cause:** `SmartBoardKidsDashboard.jsx:112` has `if (!dataLoaded || syncLoading)` which returns skeleton EVEN when `dataLoaded` is true but `syncLoading` is still truthy. This makes the sync spinner at line 148 permanently unreachable.

**Files:**
- Modify: `edutechlife-frontend/src/components/kids-dashboard/SmartBoardKidsDashboard.jsx`

**Fix:** Change the loading gate to only show skeleton on first load, not on background syncs.

```jsx
if (!dataLoaded) {
  return (
    <div className={`${darkMode ? "bg-[#0F172A]" : "bg-[#F8FAFC]"}`}>
      <SmartBoardLoadingSkeleton darkMode={darkMode} />
    </div>
  );
}
```

- [ ] Remove `|| syncLoading` from the loading gate condition
- [ ] Build — expect 0 errors
- [ ] Commit

---

### Task 5: Fix subscription downgrade never reverts to "basic"

**Root cause:** `useSmartBoardPersistence.js:210-211` has `if (merged.subscriptionTier === "premium") setSubscriptionTier("premium")`. It never sets "basic", so expired premium users remain premium forever.

**Files:**
- Modify: `edutechlife-frontend/src/context/useSmartBoardPersistence.js:210-211`

**Fix:** Always set the subscription tier from merged data, not only on premium.

```js
setSubscriptionTier(merged.subscriptionTier === "premium" ? "premium" : "basic");
```

- [ ] Edit line 210-211 to handle both premium and basic
- [ ] Build — expect 0 errors
- [ ] Commit

---

### Task 6: Fix NaN propagation from unvalidated `addPoints`

**Root cause:** `useSmartBoardActions.js:8-15` has no type check on `points`. Callers passing `undefined` (e.g., `mission.xp` missing at line 27, `reward.cost` missing at line 33) produce `NaN` in `totalPoints` which cascades to all downstream consumers.

**Files:**
- Modify: `edutechlife-frontend/src/context/useSmartBoardActions.js`

**Fix:** Add input validation in `addPoints` and safe fallbacks in callers.

```js
addPoints: useCallback((points, reason) => {
  const safePoints = Math.max(0, parseInt(points, 10) || 0);
  if (safePoints === 0) return;
  setTotalPoints(prev => prev + safePoints);
  ...
}, [setTotalPoints, setPointsHistory]),
```

Also fix `completeMission` and `unlockReward` to guard their point values:

```js
addPoints(mission.xp || 0, `Misión: ${mission.title || 'completada'}`);
addPoints(-(reward.cost || 0), `Desbloqueo: ${reward.name || 'recompensa'}`);
```

- [ ] Add input validation in `addPoints` (parseInt + fallback)
- [ ] Add safe fallbacks in `completeMission` and `unlockReward`
- [ ] Build — expect 0 errors
- [ ] Commit

---

### Task 7: Fix timeout leak in `useSmartBoardStats` refresh callback

**Root cause:** `useSmartBoardStats.js:221-226` creates `setTimeout` in `refresh()` but the returned cleanup is ignored when called from interval (line 233) and storage event (line 230). Timeouts fire on unmounted component.

**Files:**
- Modify: `edutechlife-frontend/src/hooks/useSmartBoardStats.js`

**Fix:** Use a ref to track mounted state and clear timeout on unmount.

```js
const refreshTimeoutRef = useRef(null);

const refresh = useCallback(() => {
  setIsLive(true);
  if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
  refreshTimeoutRef.current = setTimeout(() => {
    if (!mountedRef.current) return;
    setIsLive(false);
  }, 3000);
}, []);

useEffect(() => {
  return () => {
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
  };
}, []);
```

- [ ] Read `useSmartBoardStats.js` fully
- [ ] Add ref-based timeout tracking and cleanup
- [ ] Build — expect 0 errors
- [ ] Commit

---

### Task 8: Fix missing null guards in GamificationContext and SessionContext

**Root cause:** `GamificationContext.jsx:14` and `SessionContext.jsx:13` call `useContext(SmartBoardKidsContext)` which returns `undefined` if used outside `SmartBoardKidsProvider`. Then `ctx.totalPoints` throws "Cannot read properties of undefined".

**Files:**
- Modify: `edutechlife-frontend/src/context/GamificationContext.jsx`
- Modify: `edutechlife-frontend/src/context/SessionContext.jsx`

**Fix:** Add null check with fallback defaults.

```jsx
// GamificationContext.jsx
const ctx = useContext(SmartBoardKidsContext);
if (!ctx) {
  return { totalPoints: 0, streak: { current: 0 }, ... };
}
```

```jsx
// SessionContext.jsx
const ctx = useContext(SmartBoardKidsContext);
if (!ctx) {
  return { sessions: [], totalActiveMinutes: 0, ... };
}
```

- [ ] Edit `GamificationContext.jsx` — add null guard with fallback
- [ ] Edit `SessionContext.jsx` — add null guard with fallback
- [ ] Build — expect 0 errors
- [ ] Commit

---

### Task 9: Fix effect ordering race condition in Dani reminder

**Root cause:** `SmartBoardKidsDashboard.jsx:57-67` and `69-77` are two useEffect blocks depending on `[isDaniOpen]`. Effect at line 57 (reminder logic) reads `lastDani` BEFORE the effect at line 69 writes the updated close timestamp, because effects run in definition order.

**Files:**
- Modify: `edutechlife-frontend/src/components/kids-dashboard/SmartBoardKidsDashboard.jsx`

**Fix:** Merge both effects into one to ensure correct execution order.

```jsx
useEffect(() => {
  if (isDaniOpen) {
    setShowDaniReminder(false);
    localStorage.removeItem("edutechlife_last_dani_close");
  } else {
    const lastDani = parseInt(localStorage.getItem("edutechlife_last_dani_close") || "0", 10);
    if (lastDani > 0 && Date.now() - lastDani > 300000 && Date.now() - lastDani < 3600000) {
      const timer = setTimeout(() => setShowDaniReminder(true), 5000);
      return () => clearTimeout(timer);
    }
    localStorage.setItem("edutechlife_last_dani_close", Date.now().toString());
  }
}, [isDaniOpen]);
```

- [ ] Merge both useEffect blocks into one
- [ ] Build — expect 0 errors
- [ ] Commit

---

### Task 10: Fix massive sync dependency array triggering unnecessary full saves

**Root cause:** `SmartBoardKidsContext.jsx:340-371` lists 30+ dependencies that trigger ALL state keys to be written to localStorage (lines 274-303) and Supabase (lines 306-339) on every minor change.

**Files:**
- Modify: `edutechlife-frontend/src/context/SmartBoardKidsContext.jsx`

**Fix:** Use refs for localStorage writes to decouple them from effect deps. Keep the Supabase save with a more selective dependency list.

```jsx
const prevValuesRef = useRef({});

useEffect(() => {
  const current = {
    daniChatHistory, studentMoodHistory, academicTopics,
    conversationCount, studentAge, totalPoints, pointsHistory,
    unlockedRewards, totalActiveMinutes, sessions, streak,
    streakLog, daniMemory, subjectTime, calendarEvents, readNews,
    missions, subjects, uploadedActivities, analyzedActivities,
    darkMode, avatarAnimado, fondoGalaxia, subscriptionTier,
    flashcardDecks, exams, examMaterials, smartBookHistory,
    planCompletedActivities,
  };

  // Only write changed keys to localStorage
  Object.entries(current).forEach(([key, val]) => {
    if (prevValuesRef.current[key] !== val) {
      setLocalStorage(`${key}_${userId}`, val);
    }
  });
  prevValuesRef.current = current;

  // Debounced Supabase save (only when major data changes)
  if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
  syncTimeoutRef.current = setTimeout(() => {
    saveData(current);
  }, 2000);
}, [userId, dataLoaded]);
```

Actually, this is complex and risky to change without thorough testing. **Simplify:** Just reduce the dependency array to only include keys that meaningfully change:

```jsx
  }, [
    userId,
    totalPoints,
    sessions,
    streak,
    calendarEvents,
    missions,
    subjects,
    darkMode,
    subscriptionTier,
  ]);
```

This drops 20+ deps that change trivially (like `daniChatHistory` on every keystroke in the input, or `flashcardDecks` which rarely changes). The write loop still writes all keys to localStorage, but the effect fires less often.

- [ ] Reduce the dependency array to meaningful keys only
- [ ] Build — expect 0 errors
- [ ] Commit
- [ ] Verify: run `npx vitest run` in backend (unaffected) and confirm build passes

---

## Summary

| # | Task | Severity | Files Changed | Lines Changed |
|---|------|----------|---------------|---------------|
| 1 | Fix `addDaniMessage` stripping type/data | HIGH | 1 | ~10 |
| 2 | Fix wrong localStorage keys in welcome | HIGH | 1 | ~5 |
| 3 | Fix streak `[object Object]` | HIGH | 1 | ~1 |
| 4 | Fix unreachable sync indicator | MEDIUM | 1 | ~1 |
| 5 | Fix subscription never reverts to basic | MEDIUM | 1 | ~1 |
| 6 | Fix NaN propagation from addPoints | MEDIUM | 1 | ~10 |
| 7 | Fix timeout leak in useSmartBoardStats | MEDIUM | 1 | ~15 |
| 8 | Fix null guards in Gamification/SessionContext | MEDIUM | 2 | ~8 |
| 9 | Fix Dani reminder race condition | MEDIUM | 1 | ~15 |
| 10 | Fix massive sync dep array | MEDIUM | 1 | ~5 |

**Total: 10 files modified, ~71 lines changed. No new files created. No IALab/OVA/i18n touched.**
