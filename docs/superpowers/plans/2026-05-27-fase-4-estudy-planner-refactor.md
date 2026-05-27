# Fase 4 — StudyPlannerModal Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor StudyPlannerModal to vertical layout with enhanced monthly calendar, remove calendar section from ActivityHistory, fix duplicate header icons.

**Architecture:** Three independent edits: (1) refactor useActivityCalendar hook to support month-level queries, (2) refactor StudyPlannerModal layout + calendar, (3) remove calendar from ActivityHistory. Straightforward surgical changes — no new components needed.

**Tech Stack:** React 19, Tailwind CSS, localStorage session logs

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/hooks/useActivityCalendar.js` | Modify | Add optional `month` param for monthly data |
| `src/components/IALab/StudyPlannerModal.jsx` | Modify | Vertical layout, month navigation, stats, header icon fix |
| `src/components/ActivityHistory.jsx` | Modify | Remove import, state, and calendar section |

---

### Task 1: Refactor useActivityCalendar Hook (Add Month Support)

**Files:**
- Modify: `src/hooks/useActivityCalendar.js`

- [ ] **Step 1: Add month parameter and monthly filtering**

Current hook only accepts `calendarYear`. Add optional `month` param (0-11). When `month` is provided, filter sessions to that specific month and return month-scoped stats.

```javascript
import { useMemo } from 'react';

export function useActivityCalendar(calendarYear, month) {
  return useMemo(() => {
    const sessions = JSON.parse(localStorage.getItem('ialab_session_log') || '[]');
    const map = {};

    const isMonthly = month !== undefined && month !== null;

    sessions.forEach(s => {
      const d = new Date(s.completed_at);
      if (isMonthly && (d.getFullYear() !== calendarYear || d.getMonth() !== month)) return;
      const dStr = d.toDateString();
      map[dStr] = (map[dStr] || 0) + (s.duration_seconds || 0);
    });

    const weeks = [];
    const startDate = new Date(calendarYear, isMonthly ? month : 0, 1);
    const endDate = isMonthly
      ? new Date(calendarYear, month + 1, 0)
      : new Date(calendarYear, 11, 31);
    let cursor = new Date(startDate);

    while (cursor <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dStr = cursor.toDateString();
        const secs = map[dStr] || 0;
        week.push({
          date: new Date(cursor),
          mins: Math.round(secs / 60),
          level: secs === 0 ? 0 : secs < 300 ? 1 : secs < 900 ? 2 : secs < 1800 ? 3 : 4,
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    const totalActive = Object.keys(map).filter(d => new Date(d) <= new Date()).length;
    const currentStreak = (() => {
      let streak = 0;
      const d = new Date();
      while (map[d.toDateString()]) { streak++; d.setDate(d.getDate() - 1); }
      return streak;
    })();

    return { weeks, totalActive, currentStreak, totalSessions: sessions.length };
  }, [calendarYear, month]);
}
```

- [ ] **Step 2: Verify hook still works for ActivityHistory (annual)**

The hook is backward-compatible: calling `useActivityCalendar(2026)` without `month` returns the full year data as before.

---

### Task 2: Refactor StudyPlannerModal — Vertical Layout + Calendar Upgrade

**Files:**
- Modify: `src/components/IALab/StudyPlannerModal.jsx`

- [ ] **Step 1: Add month navigation state and calendar data**

After line 117 (`const calendar = buildCalendar();`), add:

```javascript
const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
const [calYear, setCalYear] = useState(() => new Date().getFullYear());
const monthlyCalendar = useActivityCalendar(calYear, calMonth);

const goToPrevMonth = () => {
  if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
  else setCalMonth(m => m - 1);
};

const goToNextMonth = () => {
  if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
  else setCalMonth(m => m + 1);
};
```

And add the import at the top:

```javascript
import { useActivityCalendar } from '../../hooks/useActivityCalendar';
```

- [ ] **Step 2: Fix header — remove fa-book, keep fa-calendar only**

Change lines 250-254 from:
```jsx
<div className="flex items-center gap-1">
  <Icon name="fa-book" className="text-petroleum text-sm" />
  <Icon name="fa-calendar" className="text-petroleum text-sm" />
</div>
```
To:
```jsx
<Icon name="fa-calendar" className="text-petroleum text-sm" />
```

- [ ] **Step 3: Change layout from horizontal to vertical**

Change line 269 from:
```jsx
<div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
```
To:
```jsx
<div className="flex flex-col gap-5">
```

- [ ] **Step 4: Expand notes section to full width, taller textarea**

Change line 271 from:
```jsx
<div className="flex-1 min-w-0">
```
To:
```jsx
<div>
```

Change line 300 (textarea height) from:
```jsx
className="w-full h-[6.8rem] sm:h-[120px] p-3 rounded-xl ..."
```
To:
```jsx
className="w-full h-[8.5rem] p-3 rounded-xl ..."
```

- [ ] **Step 5: Expand calendar section — full width, month nav, stats bar**

Replace line 306:
```jsx
<div className="w-full sm:w-56 sm:min-w-[200px]">
```
To:
```jsx
<div>
```

Replace the calendar container and header (lines 307-311):
```jsx
<div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs font-bold text-petroleum dark:text-petroleum">{calendar.label}</span>
    <span className="text-[10px] text-amber-500 font-semibold">🔥 {streak}d</span>
  </div>
```
To:
```jsx
<div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-1">
      <button onClick={goToPrevMonth} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 transition-all">‹</button>
      <span className="text-xs font-bold text-petroleum dark:text-petroleum w-28 text-center">{calendar.label}</span>
      <button onClick={goToNextMonth} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 transition-all">›</button>
    </div>
    <span className="text-[10px] text-amber-500 font-semibold">🔥 {streak}d</span>
  </div>
```

- [ ] **Step 6: Add stats bar after calendar grid, before day notes**

After line 343 (the closing `</div>` of the calendar grid), replace lines 340-343:
```jsx
<div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
  <span className="text-[9px] text-slate-500 dark:text-slate-400">Días pasados</span>
  <span className="text-[9px] text-amber-500 font-semibold">{streak} días seguidos</span>
</div>
```
To:
```jsx
<div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-500">
  <span>{monthlyCalendar.totalActive} días activos</span>
  <span>{monthlyCalendar.totalSessions} sesiones</span>
  <span className="text-amber-500 font-semibold">🔥 {streak}d</span>
</div>
```

- [ ] **Step 7: Update the modal title aria-label to reflect new structure**

Change line 246 from:
```jsx
role="dialog" aria-modal="true" aria-label="Plan de Estudio"
```
To keep as is (no change needed — "Plan de Estudio" is still correct).

- [ ] **Step 8: Verify build**

Run: `cd edutechlife-frontend && npx react-scripts build 2>&1 | tail -20`
Expected: Build compiles successfully with no errors.

---

### Task 3: Remove Calendar Section from ActivityHistory

**Files:**
- Modify: `src/components/ActivityHistory.jsx`

- [ ] **Step 1: Remove useActivityCalendar import**

Remove line 15:
```javascript
import { useActivityCalendar } from '../hooks/useActivityCalendar';
```

- [ ] **Step 2: Remove calendarYear state**

Remove line 120:
```javascript
const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
```

- [ ] **Step 3: Remove calendario from accordionSections defaults**

Change line 121 from:
```javascript
const [accordionSections, setAccordionSections] = useState({ estudio: true, progreso: true, logros: false, calendario: false });
```
To:
```javascript
const [accordionSections, setAccordionSections] = useState({ estudio: true, progreso: true, logros: false });
```

- [ ] **Step 4: Remove calendarData computation**

Remove line 273:
```javascript
const calendarData = useActivityCalendar(calendarYear);
```

- [ ] **Step 5: Remove entire calendario AccordionSection**

Remove lines 1218-1256 (the entire `AccordionSection id="calendario"` block including its closing tag).

- [ ] **Step 6: Build check**

Run: `cd edutechlife-frontend && npx react-scripts build 2>&1 | tail -20`
Expected: Build compiles successfully. If any unused import warnings appear for `motion` or other imports, that's acceptable (they are used elsewhere in the file).

---

## Self-Review Checklist

- [x] **Spec coverage:** Task 1 implements month-level hook. Task 2 covers: header icon fix, vertical layout, taller textarea, month navigation, stats bar. Task 3 removes all calendar traces from ActivityHistory.
- [x] **No placeholders:** Every code change is written out with exact before/after.
- [x] **Type consistency:** `useActivityCalendar(year, month)` signature matches across all usages.
