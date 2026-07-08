# Tortuga Report — SmartBoard KidsDashboard Fix

**Date:** 2026-07-06  
**Agent:** Tortuga (via Claude Code)  
**Vault:** `tortuga/vault/2026-07-06-1439`

## Summary

Fixed 7 issues across 5 files in the SmartBoard KidsDashboard to make all buttons 100% functional.

## Files Modified

### 1. SmartBoardKidsDashboard.jsx (CAUSA RAÍZ)
- **Sidebar category onClick**: Changed from `toggleCategory(cat.id)` (only expand/collapse) to `toggleCategory(cat.id); onTabChange(cat.tabs[0])` — now navigates to the first tab of each category
- **Home category tabs**: Removed `if (cat.id === 'home') return null` — "Inicio" tab now visible and clickable
- **Remaining emojis → Icon**: `🔒→fa-lock`, `⭐→fa-star`, `👨‍👩‍👧→fa-users`, `🚪→fa-sign-out-alt`
- **`padres` case**: Added explicit `return null` (was falling through to `default`)
- **`puntos`**: Added to `CATEGORY_MAP`, `CATEGORY_TAB_LABELS`, `TOP_BAR_LABELS`, URL allowlist

### 2. SmartBoardAnalytics.jsx
- **Bug fix**: `streak` is object `{current, longest}` → rendered as `[object Object]`. Changed to `(typeof streak === 'object' ? streak.current : streak) || 0`
- **Bug fix**: `MetricCard` now accepts `className` prop (was silently dropped)

### 3. OralExamSimulator.jsx
- **Bug fix**: Removed per-question XP award (was double-counting: 10 immediate + 10 at end = 20 per correct)
- **Bug fix**: Icon className preserved sizing (`w-5 h-5 block mx-auto` instead of `block mx-auto`)
- **Bug fix**: Added user-visible error message on API failure (was silent)

### 4. FlashcardSystem.jsx
- **Bug fix**: Stats now save accumulated session correct/incorrect counts instead of only last card

### 5. NewsTechFeed.jsx
- Note: `expandedNews` state unused but not breaking — left as-is

## Recovery
```bash
git checkout tortuga/vault/2026-07-06-1439
```
