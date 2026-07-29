# Daily Plan Redesign

> **Goal:** Redesign the DailyPlan component to show max 3 items as premium cards integrated with IALab visual style, with bilingual support (ES/EN).

**Architecture:** Reduce MAX_ITEMS from 6 to 3; redesign the accordion toggle + item list into a compact card-based layout with gradient header, progress bar, and action-oriented cards per item. Selection logic prioritizes 1 daily challenge + top recommendations.

**Tech Stack:** React, Framer Motion, Tailwind CSS, IALab design tokens (petroleum/corporate palette).

---

## Changes

### 1. DailyPlan.jsx

**MAX_ITEMS** → 3 (was 6)

**Header redesign:**
- Gradient background (petroleum → corporate) with icon + title + pending count badge
- Progress bar showing courseProgress %
- Remove the "next suggested action" section (was lines 249-282)
- Remove morning streak specific visual treatment (simplify challenge rendering)

**Item rendering** (3 cards):
Each item rendered as a `motion.div` card with:
- Rounded-2xl border with hover effect
- Left accent bar matching urgency color
- Icon circle (w-10 h-10) with gradient background for challenges, petroleum/corporate tint for recommendations
- Title (text-sm font-bold), description (text-xs text-slate-500)
- Action button (CTA) or complete button for challenges
- XP badge for challenges
- Urgency badge for recommendations
- Responsive: adjusts padding on mobile

**Selection logic** (replaces current mergedItems):
```js
function selectTop3(activeChallenges, recsHigh, recsMedium) {
  const items = [];
  // Slot 1: first pending daily challenge
  const dc = activeChallenges.sort((a,b) => a.id === 'dc-1' ? -1 : 1);
  if (dc.length > 0) items.push({ ...dc[0], type: 'challenge' });
  // Slot 2: first high-urgency recommendation
  if (items.length < 3 && recsHigh.length > 0) {
    items.push({ ...recsHigh[0], type: 'recommendation' });
  }
  // Slot 3: second high or first medium
  if (items.length < 3 && recsHigh.length > 1) {
    items.push({ ...recsHigh[1], type: 'recommendation' });
  } else if (items.length < 3 && recsMedium.length > 0) {
    items.push({ ...recsMedium[0], type: 'recommendation' });
  }
  return items;
}
```

**Removed:**
- `nextAction` section (was "Siguiente acción sugerida")
- `URGENCY_CONFIG` → simplified to a smaller inline mapping
- `isMorningStreak` special treatment
- `MAX_ITEMS` constant → inline 3
- `pendingCount` computation simplified

### 2. Files

| Action | File |
|--------|------|
| Modify | `src/components/IALab/DailyPlan.jsx` |
| No change | `src/hooks/IALab/usePersonalizedRecommendations.js` |
| No change | `src/components/IALab/constants/dailyChallenges.js` |

### 3. States

| State | Behavior |
|-------|----------|
| Loading | Skeleton (3 animated placeholders) — keep existing |
| Empty (no items) | Simplified empty state with icon + message |
| Normal | Header + 1-3 cards |
| All complete | Cards show completed state (opacity-50, checkmark) |

### 4. Edge cases

- 0 challenges + 0 recommendations → show empty state
- 1 item only → center it, no empty space
- All challenges completed + recs exist → show only recs
- Challenge completed after render → card grays out, CTA disappears
- Very long titles → truncate with `truncate`

### 5. i18n — No new keys needed

All keys already exist in `ialab.daily_plan.*` and `ialab.daily_challenges.*` namespaces. Only visual/structure changes.

### 6. Testing

- Existing tests in `__tests__/IALabDashboard.test.jsx` should still pass since we only modify the component, not its inputs.
- Visual: verify 3 cards max render at all screen sizes.

## Self-Review

- [x] No placeholders or TBD
- [x] Spec matches user requirements (3 items, premium cards, IALab style)
- [x] Scope is focused (single component)
- [x] No contradictions
- [x] All edge cases considered
