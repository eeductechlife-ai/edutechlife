# Valerio Panel Redesign — Persistent Side Panel

## Problem
Valerio opens as a modal overlay (`FocusTrapModal` + backdrop + `fixed inset-0`) that blocks dashboard interaction. Users cannot work on the dashboard while chatting with Valerio.

## Goal
Change Valerio from a blocking modal to a persistent side panel that:
- Stays open while the user interacts with the dashboard
- Is toggled by the existing floating button
- Auto-closes when video or OVA immersive modals open
- Never blocks dashboard interaction (no backdrop, no focus trap)

## Changes

### 1. `IALabValerioPanel/index.jsx` — Layout
- Remove `fixed inset-0 z-[90]` → `fixed right-0 top-0 h-full w-[380px] max-md:w-[85vw] z-[90]`
- Remove backdrop div (`absolute inset-0 bg-black/20 backdrop-blur-sm`)

- Panel enters from right with a slide animation (keep existing Framer Motion)

### 2. `IALabModals.jsx` — Remove Valerio rendering
- Remove `<FocusTrapModal isOpen={showValerioPanel}>...</FocusTrapModal>` block
- Remove `showValerioPanel` from destructured props (line 39)

### 3. `IALab.jsx` — Render ValerioPanel directly
- Import `IALabValerioPanel` (lazy)
- Render `<IALabValerioPanel isOpen={showValerioPanel} onClose={() => setShowValerioPanel(false)} />` after the `<main>` content
- Keep `<ValerioFloatingButton>` as toggle
- Add `useEffect` to watch `immersiveModalOpen` store flag → `setShowValerioPanel(false)`

### 4. Store (`ialabStore`) — Immersive modal flag
- Add `immersiveModalOpen: boolean` (default `false`)
- Add `setImmersiveModalOpen(val: boolean)` action
- `TopicResourcesModal.jsx`: add `useEffect` that syncs `viewerModalOpen || ovaModalOpen || immersivePdfModalOpen` → `useIALabStore.getState().setImmersiveModalOpen(...)`
- `ModuleOverviewCard.jsx`: add `useEffect` that syncs `viewerModalOpen` → `useIALabStore.getState().setImmersiveModalOpen(...)`

### 5. No changes needed
- `ValerioFloatingButton.jsx` — stays as-is
- `IALabValerioPanel/*` (header, conversation, input, etc.) — no functional changes
- `FocusTrapModal` component — stays for other modals

## Store Changes

In `ialabStore` (likely `persistenceSlice.js` or a UI slice):

```js
immersiveModalOpen: false,
setImmersiveModalOpen: (val) => set({ immersiveModalOpen: val }),
```

## Auto-close Flow

```
1. User is in dashboard, Valerio panel open
2. User clicks a resource that opens ResourceViewerModal
3. TopicResourcesModal calls useIALabStore.getState().setImmersiveModalOpen(true)
4. useEffect in IALab.jsx detects change → setShowValerioPanel(false)
5. User closes video/OVA modal
6. TopicResourcesModal calls setImmersiveModalOpen(false)
7. Valerio is closed; user can reopen with floating button
```

## Files Modified
- `src/components/IALab/IALabValerioPanel/index.jsx`
- `src/components/IALab/IALabModals.jsx`
- `src/components/IALab/IALab.jsx`
- `src/store/ialabStore` (whichever slice handles UI state)
- `src/components/IALab/TopicResourcesModal.jsx`
- `src/components/IALab/ModuleOverviewCard.jsx` (if it directly opens video/OVA)
