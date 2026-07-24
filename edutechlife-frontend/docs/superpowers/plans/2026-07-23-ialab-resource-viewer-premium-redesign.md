# ResourceViewerModal Premium Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade ResourceViewerModal and all 6 sub-viewers to match IALab premium visual language (double-bezel, corporate palette, gradient icons, spring physics, modern close button).

**Architecture:** The modal shell (`index.jsx`) wraps content-specific viewers via a switch statement. Changes are purely visual — no data flow or logic changes. Work bottom-up: first viewers (recolor), then shell (header, footer, outer structure).

**Tech Stack:** React 18, framer-motion 12, Tailwind CSS, YT IFrame API

---

### Task 1: VideoViewer — Recolor cyan to corporate palette

**Files:**
- Modify: `src/components/IALab/ResourceViewerModal/VideoViewer.jsx`

- [ ] **Replace all `#00BCD4` cyan references with corporate palette**

Changes (7 locations):

1. Progress bar fill — `bg-gradient-to-r from-[#00BCD4] to-[#4DA8C4]` -> `bg-gradient-to-r from-petroleum to-corporate`
2. Scrubber dot — `bg-[#00BCD4]` -> `bg-corporate`
3. Play button hover — `hover:text-[#00BCD4]` -> `hover:text-corporate`
4. Speed dropdown bg — `bg-[#0A1729]` -> `bg-slate-900`
5. Speed active option — `bg-[#00BCD4]/20 text-[#00BCD4]` -> `bg-corporate/20 text-corporate`
6. Captions active — `text-[#00BCD4]` -> `text-corporate`
7. Volume slider — `accent-[#00BCD4]` -> `accent-corporate`

Verify: `grep -n '#00BCD4'` in this file returns no matches.

---

### Task 2: DocumentViewer — Header alignment

**Files:**
- Modify: `src/components/IALab/ResourceViewerModal/DocumentViewer.jsx`

- [ ] **Upgrade icon container to premium gradient**

Change icon container: `w-10 h-10 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10` -> `w-12 h-12 rounded-2xl bg-gradient-to-br from-petroleum to-corporate shadow-sm`

- [ ] **Update icon color to white**

Change icon: `text-petroleum w-5 h-5` -> `text-white w-5 h-5`

- [ ] **Wrap download button in motion.div with spring hover**

Add `import { motion } from 'framer-motion';`. Wrap download `<a>` with `<motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>`.

---

### Task 3: ImageViewer — Header alignment

**Files:**
- Modify: `src/components/IALab/ResourceViewerModal/ImageViewer.jsx`

- [ ] **Upgrade icon container**

Icon container: `w-10 h-10 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10` -> `w-12 h-12 rounded-2xl bg-gradient-to-br from-petroleum to-corporate shadow-sm`
Icon: `text-petroleum w-5 h-5` -> `text-white w-5 h-5`

- [ ] **Add spring hover to download button**

Add `motion` import. Wrap download `<a>` with `<motion.div whileHover={{ scale: 1.03 }}>`.

- [ ] **Update loading spinner colors**

Loading spinner: `border-petroleum/25 border-t-[#004B63]` -> `border-petroleum/20 border-t-petroleum`

---

### Task 4: InteractiveViewer — Color alignment

**Files:**
- Modify: `src/components/IALab/ResourceViewerModal/InteractiveViewer.jsx`

- [ ] **Replace cyan spinner**

Spinner: `text-[#06B6D4]` -> `text-corporate`

- [ ] **Update "Real time" badge**

Badge: `bg-emerald-100 text-emerald-700 rounded` -> `bg-gradient-to-r from-emerald-50 to-emerald-100/80 border border-emerald-200/50 text-emerald-700 rounded-lg`

- [ ] **Update simulation card border**

Card border: `border border-petroleum/25` -> `border border-slate-200/60`

---

### Task 5: PDFThumbnailViewer — Button upgrade

**Files:**
- Modify: `src/components/IALab/ResourceViewerModal/PDFThumbnailViewer.jsx`

- [ ] **Upgrade "Open in new tab" button**

Button: `bg-petroleum/10 hover:bg-petroleum/12 rounded-md` -> `border border-slate-200 hover:bg-petroleum/5 hover:border-corporate/30 rounded-xl`

- [ ] **Add backdrop-blur to scroll badge**

Append `backdrop-blur-sm` to scroll-to-end badge className.

---

### Task 6: OVAViewer — Minimal consistency

**Files:**
- Modify: `src/components/IALab/ResourceViewerModal/OVAViewer.jsx`

- [ ] **Ensure consistent rounded-2xl on iframe container** (already present on line 19). Loading fallback already uses petroleum colors. No changes needed.

---

### Task 7: Modal Shell (index.jsx) — Outer double-bezel + header cleanup

**Files:**
- Modify: `src/components/IALab/ResourceViewerModal/index.jsx`

- [ ] **Add double-bezel outer shell**

Wrap the existing `<motion.div>` with a double-bezel outer `<div>`:

Outer: `p-[1.5px] rounded-[2rem] bg-gradient-to-b from-petroleum/20 via-petroleum/10 to-corporate/5 relative overflow-hidden shadow-[0_20px_25px_-5px_rgba(0,75,99,0.18)]`

Add blur orbs inside outer: top-right + bottom-left `w-48 h-48 blur-3xl pointer-events-none`

Inner motion.div: remove `shadow-xl shadow-petroleum/20`, add `relative z-10 bg-white dark:bg-slate-800 rounded-[calc(2rem-1.5px)] flex flex-col h-full overflow-hidden`

Move sizing (`max-w-6xl`, `h-[90dvh]`, `max-h-[900px]`, `mx-2`) to outer div.

Add top accent bar inside inner: `absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum to-corporate rounded-t-[calc(2rem-1.5px)] z-10`

- [ ] **Remove TrafficLightControls and useFullscreen**

Delete the `<TrafficLightControls ... />` JSX block. Remove import for TrafficLightControls. Remove `useFullscreen` import and usage.

Add premium close button:
```jsx
<button onClick={handleClose} className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-petroleum hover:border-petroleum/30 hover:bg-petroleum/5 transition-all duration-200 flex-shrink-0" aria-label={t('ialab.viewer_modal.close_aria')}>
  <Icon name="fa-times" className="w-4 h-4" />
</button>
```

- [ ] **Replace resource icon ternary chain with config map**

Add RESOURCE_ICONS config object. Replace 7-line ternary chain with `RESOURCE_ICONS[resource.type] || 'fa-file'`.

- [ ] **Upgrade header to white clean background**

Header gradient -> white bg with `border-b border-slate-200/60`. Icon container -> `w-12 h-12 rounded-2xl bg-gradient-to-br from-petroleum to-corporate shadow-sm`. Breadcrumbs -> `text-slate-400`. Title -> `text-petroleum`. Metadata -> `text-slate-500`.

---

### Task 8: Modal Shell — Footer + Notes premium

- [ ] **Upgrade footer borders and buttons**

Footer border-top: `border-slate-200/60`. Notes button: active -> gradient, inactive -> border-slate-200. Nav buttons: border-slate-200, hover:border-corporate/30. Counter: gradient rounded-full. "Mark as Viewed": wrap with motion.button + spring scale. "Completed": gradient emerald badge. Hint badges: gradient corporate + backdrop-blur.

- [ ] **Upgrade notes section**

Divider: `border-slate-200/60`. Textarea: `border-slate-200 focus:ring-2 focus:ring-petroleum/20`. Save status: pill badge gradient.

---

### Task 9: Build verification

- [ ] **Build and verify**

Run `npx vite build`. Expected: no errors.

Verify no `#00BCD4` or `#06B6D4` remain: `grep -rn '00BCD4\|06B6D4' src/components/IALab/ResourceViewerModal/` = 0 matches.

Verify TrafficLightControls removed: `grep 'TrafficLightControls' src/components/IALab/ResourceViewerModal/index.jsx` = 0 matches.

Verify useFullscreen removed: `grep 'useFullscreen' src/components/IALab/ResourceViewerModal/index.jsx` = 0 matches.
