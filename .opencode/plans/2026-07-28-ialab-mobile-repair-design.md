# iALab Mobile Repair — Design Document

**Date**: 2026-07-28
**Status**: Approved for implementation
**Scope**: Full mobile responsiveness and bugfix pass for iALab platform

## Summary

17 issues identified in the iALab mobile version. This plan covers all critical bugs,
UI/UX problems, and translation errors to make the platform fully functional on cell phones.

---

## 1. Bug Fixes — Mobile Menu Callbacks

### Problem
Three mobile menu buttons do nothing because their `onClick` callbacks are `undefined`:
- **"Mi Historial de Aprendizaje"** (`onOpenHistory`)
- **"Ayuda"** (`onOpenHelp`)

These callbacks are never defined in `IALab.jsx` nor passed to `MobileMenuOverlay`.

### Solution

**File: `IALab.jsx`** — Add two callback functions:
```jsx
const handleOpenHistory = () => {
  closeMobileMenu();
  useIALabStore.getState().setShowHistoryModal(true);
};

const handleOpenHelp = () => {
  closeMobileMenu();
  useIALabStore.getState().setShowHelpModal(true);
};
```

**File: `IALab.jsx`** — Pass them to `<MobileMenuOverlay>`:
```jsx
<MobileMenuOverlay
  ...
  handleOpenHistory={handleOpenHistory}
  handleOpenHelp={handleOpenHelp}
/>
```

**File: `MobileMenuOverlay.jsx`** — Already has `handleOpenHistory` and `handleOpenHelp` in props. No change needed.

**File: `IALabModals.jsx`** — `ActivityHistory` (via `showHistoryModal`) and `SettingsSupportModal` (via `showHelpModal`) already exist as lazy-loaded modals. No change needed.

**Result**: Both buttons now trigger the correct modals.

---

## 2. LocaleSwitcher in MobileHeader

### Problem
`LocaleSwitcher` is only in `IALabHeader`, which is `hidden md:block`. Mobile users cannot change language.

### Solution

**File: `IALabHeader.jsx`** — Extract the LocaleSwitcher into a reusable component (`src/components/IALab/LocaleSwitcher.jsx`).

**File: `MobileHeader.jsx`** — Add the LocaleSwitcher button between the title and the search button.

Layout on mobile:
```
[iALab]  [ES|EN]  [🔍]  [☰]
```

The switcher will be a compact button (`w-10 h-10 rounded-full border`) showing current locale code ("ES" or "EN") that toggles via `useTranslation().setLocale()`.

---

## 3. MobileInfoBar — Gap Fix

### Problem
`flex flex-col gap-5` creates 20px gap between user name and module progress text.

### Solution
**File: `MobileInfoBar.jsx`** — Change:
- `gap-5` → remove gap, use tighter spacing
- `py-3` → `py-2` (reduce vertical padding)
- Ensure progress badge is right-aligned and doesn't wrap

---

## 4. Video Controls — Touch Support

### Problem
- `onMouseMove` only — controls invisible on touch devices
- Button sizes 28-32px violate touch target minimum (44px)

### Solution
**File: `VideoViewer.jsx`**:

1. **Touch support**: Add `onTouchStart` to the container that shows controls + sets a 4s auto-hide timer:
```jsx
const handleInteraction = () => {
  setShowControls(true);
  if (hideTimer.current) clearTimeout(hideTimer.current);
  hideTimer.current = setTimeout(() => setShowControls(false), 4000);
};
```
Bind to both `onMouseMove` and `onTouchStart` on the container.

2. **Touch targets**: Increase button sizes from `w-7 h-7` / `w-8 h-8` to `w-11 h-11 min-w-[44px] min-h-[44px]`.

3. **Progress bar**: Increase `h-1` → `h-2` for easier touch interaction.

4. **Play overlay**: Keep but add touch handler that toggles play.

---

## 5. ResourceViewerModal — Mobile Optimization

### Problem
Modal has `max-w-6xl`, gradient border (`rounded-[2rem]`), inefficient header stacking on mobile.

### Solution
**File: `ResourceViewerModal/index.jsx`**:

On mobile (`< sm`):
- Remove gradient border (`p-[1.5px] bg-gradient-to-b...`) → simple flat border
- `max-w-6xl` → `max-w-full`
- `p-2 sm:p-4` → `p-0 sm:p-4` (edge-to-edge on mobile)
- Header: stack breadcrumb above title; close button fixed top-right
- Previous/Next buttons: keep text as `hidden sm:inline` (already implemented)

---

## 6. Translation Fix + Minor Improvements

### 6a. Undermenu Label
**File: `es.json:647`**: `"UNDRMENU"` → `"MENÚ"`

### 6b. Swipe Navigation vs Scroll Conflict
**File: `useSwipeNavigation.js`**: Add flag to check if user was scrolling vertically before triggering swipe. Currently has a 1.5x slope check — improve by also checking `touchStartY` movement before deciding.

### 6c. TabPills Font Size
**File: `TabPills.jsx:41`**: `text-[11px]` → `text-xs` (12px) on mobile for better readability.

---

## Files Modified

| File | Changes |
|------|---------|
| `src/components/IALab/IALab.jsx` | Add `handleOpenHistory`, `handleOpenHelp` callbacks; pass to MobileMenuOverlay |
| `src/components/IALab/shared/MobileHeader.jsx` | Add LocaleSwitcher button |
| `src/components/IALab/shared/MobileInfoBar.jsx` | Fix gap, reduce padding |
| `src/components/IALab/ResourceViewerModal/VideoViewer.jsx` | Touch controls, 44px buttons |
| `src/components/IALab/ResourceViewerModal/index.jsx` | Mobile responsive modal |
| `src/components/IALab/shared/TabPills.jsx` | Larger text on mobile |
| `src/hooks/IALab/useSwipeNavigation.js` | Better scroll conflict detection |
| `src/i18n/es.json` | Fix "UNDRMENU" → "MENÚ" |
| `src/components/IALab/LocaleSwitcher.jsx` | **NEW** — extracted component |

## Architecture

No architectural changes. All fixes are:
- Additive (new callbacks, new component extraction)
- Configuration (CSS class tweaks, translation text)
- Reactive (touch handlers alongside mouse handlers)

## Success Criteria

1. ✅ "Mi Historial de Aprendizaje" button opens ActivityHistory modal on mobile
2. ✅ "Ayuda" button opens SettingsSupportModal on mobile  
3. ✅ Language switcher visible and functional in MobileHeader
4. ✅ MobileInfoBar shows no excessive gap; layout is compact
5. ✅ Video controls appear on touch and buttons are ≥44px
6. ✅ ResourceViewerModal fills screen edge-to-edge on mobile
7. ✅ Translation shows "MENÚ" instead of "UNDRMENU"
8. ✅ Swipe navigation doesn't interfere with vertical scrolling
9. ✅ Tab pill text is readable on small screens
