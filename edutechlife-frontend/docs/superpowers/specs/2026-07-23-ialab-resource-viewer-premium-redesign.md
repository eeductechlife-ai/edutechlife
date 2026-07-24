# IALab ResourceViewerModal — Premium Visual Redesign

## Objective
Upgrade the entire ResourceViewerModal (shell + all 6 sub-viewers) to match the premium visual language established in the IALab Contenido redesign and existing premium modals, without altering any functionality or data flow.

## Design Read
Full-screen resource viewer for educational content (videos, documents, images, interactives, PDFs, OVAs). Students spend significant time here — visual quality must match the premium-educational design system (petroleum/corporate gradient + glass + double-bezel architecture).

## Dials
- DESIGN_VARIANCE: 5
- MOTION_INTENSITY: 5
- VISUAL_DENSITY: 5

## Files Modified

### 1. `ResourceViewerModal/index.jsx` — Modal Shell (primary)

**Outer shell — double-bezel architecture:**
- Outer wrapper: `p-[1.5px] rounded-[2rem] bg-gradient-to-b from-petroleum/20 via-petroleum/10 to-corporate/5 relative overflow-hidden`
- Inner card: `rounded-[calc(2rem-1.5px)] bg-white dark:bg-slate-800 flex flex-col h-full overflow-hidden`
- Decorative blur orbs: top-right (`w-40 h-40 blur-3xl from-petroleum/8 to-corporate/5 pointer-events-none`) + bottom-left (`w-40 h-40 blur-3xl from-petroleum/6 to-corporate/5 pointer-events-none`) at outer level
- Top gradient accent bar: `absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum to-corporate rounded-t-[calc(2rem-1.5px)]` (inside inner card)

**Header — white clean:**
- Remove `TrafficLightControls` component entirely (delete import)
- Remove `useFullscreen` for modal (no longer exposing fullscreen toggle from header)
- Background: `bg-white dark:bg-slate-800 border-b border-slate-200/60 dark:border-slate-700/60 px-4 sm:px-6 py-4`
- Resource icon: `w-12 h-12 rounded-2xl bg-gradient-to-br from-petroleum to-corporate shadow-sm flex items-center justify-center flex-shrink-0` with white icon
- Breadcrumbs: `text-slate-400 dark:text-slate-500 mb-1` (better contrast on white)
- Title: `text-petroleum dark:text-white font-bold tracking-tight text-lg sm:text-xl truncate`
- Metadata: `text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1`
- Close button: `w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-petroleum hover:border-petroleum/30 hover:bg-petroleum/5 transition-all duration-200 flex-shrink-0`

**Resource icon map — extract ternary chain:**
```js
const RESOURCE_ICONS = {
  video: 'fa-video',
  document: 'fa-file-lines',
  documento: 'fa-file-lines',
  image: 'fa-image',
  imagen: 'fa-image',
  interactive: 'fa-puzzle-piece',
  interactivo: 'fa-puzzle-piece',
  pdf: 'fa-file-pdf',
  'pdf-thumbnail': 'fa-file-pdf',
  ova: 'fa-brain',
  'ova-thumbnail': 'fa-brain',
  ova_interactive: 'fa-brain',
};
```

**Footer — premium buttons:**
- Notes toggle:
  - Active: `bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm`
  - Inactive: `border border-slate-200 dark:border-slate-600 text-petroleum/70 hover:bg-petroleum/5 hover:text-petroleum transition-all duration-200`
- Navigation buttons (prev/next):
  - `rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-petroleum/70 hover:border-corporate/30 hover:bg-petroleum/5 hover:shadow-sm transition-all duration-200`
  - Disabled: `text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40`
- Counter badge: `bg-gradient-to-br from-petroleum/10 to-corporate/10 rounded-full px-4 py-1.5 font-bold text-petroleum shadow-sm`
- "Mark as Viewed" button: gradient `from-petroleum to-corporate` with `hover:shadow-lg hover:shadow-petroleum/20` and `whileHover={{ scale: prefersReducedMotion ? 1 : 1.03 }}` spring
- "Completed" badge: `bg-gradient-to-r from-emerald-50 to-emerald-100/80 dark:from-emerald-900/20 dark:to-emerald-800/10 border border-emerald-200/50 dark:border-emerald-700/30 text-emerald-700 dark:text-emerald-400 rounded-xl shadow-sm`
- Hint badges (video/pdf hints): `bg-gradient-to-r from-corporate/5 to-corporate/10 border border-corporate/20 dark:border-corporate/30 text-corporate backdrop-blur-sm rounded-xl`

**Notes section:**
- Divider: `border-t border-slate-200/60 dark:border-slate-700/60`
- Textarea: `border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-petroleum/20 focus:border-corporate`
- Save status: badge `bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-full px-2 py-0.5 text-xs`

### 2. `VideoViewer.jsx` — Recolor to Corporate Palette

All `#00BCD4` (cyan) references replaced with corporate palette:

| Location | Old | New |
|----------|-----|-----|
| Progress bar fill gradient | `from-[#00BCD4] to-[#4DA8C4]` | `from-petroleum to-corporate` |
| Scrubber dot fill | `bg-[#00BCD4]` | `bg-corporate` |
| Play button hover color | `hover:text-[#00BCD4]` | `hover:text-corporate` |
| Speed active bg + text | `bg-[#00BCD4]/20 text-[#00BCD4]` | `bg-corporate/20 text-corporate` |
| Captions active color | `text-[#00BCD4]` | `text-corporate` |
| Speed dropdown bg | `bg-[#0A1729]` | `bg-slate-900` |
| Volume slider accent | `accent-[#00BCD4]` | `accent-corporate` |

Class-only changes. No structural/functional modifications.

### 3. `DocumentViewer.jsx` — Header Alignment

- Icon container: `w-10 h-10 rounded-lg` → `w-12 h-12 rounded-2xl bg-gradient-to-br from-petroleum to-corporate shadow-sm` (premium gradient, not just tint)
- Download button: wrap in `motion.button` with `whileHover={{ scale: prefersReducedMotion ? 1 : 1.03 }}`
- "Scroll to end" badge: add `backdrop-blur-sm`

### 4. `ImageViewer.jsx` — Header Alignment

- Icon container: `w-10 h-10 rounded-lg` → `w-12 h-12 rounded-2xl bg-gradient-to-br from-petroleum to-corporate shadow-sm`
- Download button: same spring hover pattern
- Loading spinner: use petroleum colors: `border-petroleum/30 border-t-petroleum`

### 5. `InteractiveViewer.jsx` — Color Alignment

- Spinner: replace `text-[#06B6D4]` with `text-corporate`
- Bolt icon container: ensure `rounded-2xl` consistency (currently `rounded-2xl` — ok)
- "Real time" badge: flat `bg-emerald-100 text-emerald-700 rounded` → `bg-gradient-to-r from-emerald-50 to-emerald-100/80 border border-emerald-200/50 text-emerald-700 rounded-lg`
- Simulation card border: `border border-petroleum/25` → `border border-slate-200/60`

### 6. `PDFThumbnailViewer.jsx` — Button Upgrade

- "Open in new tab" button: `bg-petroleum/10 hover:bg-petroleum/12` → `border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-petroleum/5 hover:border-corporate/30 transition-all`
- "Scroll to end" badge: add `backdrop-blur-sm`
- Error state download/retry buttons: align with premium gradient style (already consistent)

### 7. `OVAViewer.jsx` — Minimal

- Iframe container: ensure consistent `rounded-2xl overflow-hidden`
- Loading fallback: use petroleum-colored spinner

## What is NOT Changed
- All props, handlers, data flow (isOpen, onClose, resource, resourceType, onMarkAsViewed, etc.)
- Video player logic (YT API integration, seek blocking, keyboard shortcuts, captions)
- Auto-complete logic (scroll tracking, elapsed time, forced complete)
- Error handling and error boundaries
- Accessibility attributes (role, aria-modal, aria-label, focus trap)
- Keyboard navigation (Escape to close)
- Resource notes hook (useResourceNotes)
- OVA rendering (ovaComponents, renderOVAById)
- Any i18n keys or translation logic

## Design Principles Applied
| Skill | Principle |
|-------|-----------|
| high-end-visual-design | Double-bezel architecture, color calibration (petroleum/corporate), tinted shadows |
| design-taste-frontend | Shape consistency (rounded-2xl), eliminate TrafficLightControls legacy, gradient icon containers |
| framer-motion-animator | Spring physics on buttons, reduced motion support |
| frontend-design | Brand consistency (#004B63, #4DA8C4), removal of non-brand colors (#00BCD4, #06B6D4) |

## Verification
- `npx vite build` must succeed with no errors
- All resource types must display correctly: video, document, image, interactive, pdf, ova
- Video playback, captions, speed controls must work unchanged
- Auto-complete timers/document-scroll must work unchanged
- All aria-labels and keyboard navigation preserved
- Close button works, OVA fullscreen toggle works
- Notes textarea saves/loads correctly
- Resource navigation (prev/next) works
