# IALab Contenido Section — Premium Visual Redesign

## Objective
Upgrade the "Contenido" section of IALab (ModuleOverviewCard, ModuleTopicAccordion, ModuleHeaderSection, ModuleBookmarkFilter) to match the premium visual language of the rest of the IALab platform (ToolTutorAccordion, ModuleInfoSection, Sidebar) without altering any functionality or data flow.

## Design Read
Educational content section for students. Premium-educational visual language leaning into the existing IALab design system (petroleum/corporate gradient + glass + doppelrand architecture).

## Dials
- DESIGN_VARIANCE: 6
- MOTION_INTENSITY: 6
- VISUAL_DENSITY: 5

## Files Modified

### 1. `ModuleTopicAccordion.jsx` — Topic Accordion Buttons
**Lines ~70-150** — Structural change

- Enclose each `motion.button` in a double-bezel outer shell (`p-[1.5px] rounded-2xl bg-gradient-to-b`)
- Add decorative blur orbs in background corners
- Replace `border-l-4` left accent with top gradient bar (`h-1.5 rounded-t-2xl bg-gradient-to-r`)
- Icon: upgrade from raw icon to `w-12 h-12 rounded-2xl bg-gradient-to-br` container
- Chevron: `group-hover:scale-110 group-hover:bg-petroleum/15`
- Premium shadows: `hover:shadow-lg hover:shadow-petroleum/5`
- Transitions: `duration-300` with spring physics for interactions

### 2. `ModuleTopicAccordion.jsx` — Resource Items
**Lines ~197-317** — Structural change

- Nested card with `relative overflow-hidden` + inner glow gradient on hover
- Icon container: `w-9 h-9 rounded-xl bg-gradient-to-br from-petroleum/10 to-corporate/10` with hover darkening
- "Start here" badge: `bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm`
- Bookmark icon: always visible with `text-slate-300` base, `group-hover/res:text-amber-400`
- Staggered entry: `staggerChildren: 0.03` with `x: -8` variant
- Hover: `x: 3` with spring physics (300, 24)

### 3. `ModuleTopicAccordion.jsx` — Filter Pills
**Lines ~173-196** — Class change only

- Active: `bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm hover:shadow-md`
- Inactive: `bg-slate-100/80 hover:bg-slate-200/80 hover:text-slate-700`

### 4. `ModuleTopicAccordion.jsx` — Progress Bar
**Lines ~320-350** — Class change

- Gradient fill with subtle shimmer animation
- Animated width transition on mount

### 5. `ModuleHeaderSection.jsx`
**Lines ~13-52** — Additive changes

- Eyebrow pill badge above title: `rounded-full bg-gradient-to-r from-petroleum/10 to-corporate/10 text-[10px] uppercase`
- Duration badge: `bg-gradient-to-br from-petroleum/10 to-corporate/5 border border-petroleum/10`
- See more/less: chevron icon with rotation animation + hover translate-y

### 6. `ModuleBookmarkFilter.jsx`
**Lines ~1-67** — Visual alignment

- Apply nested card pattern to bookmark items
- Hover translate-x on resource items
- Icon container gradient

### 7. `ModuleOverviewCard.jsx`
**Lines ~332** — Wrapper only

- Outer double-bezel shell (`p-[1.5px] rounded-[2rem] bg-gradient-to-b`)

## Design Principles Applied

| Skill | Principle |
|-------|-----------|
| high-end-visual-design | Double-bezel architecture, button-in-button trailing icon, fluid spring physics |
| design-taste-frontend | Shape consistency lock (all rounded-2xl), color calibration (petroleum/corporate), tinted shadows |
| framer-motion-animator | Staggered children, spring physics, reduced motion support, GPU-safe properties |
| frontend-design | Branding consistency (#004B63, #4DA8C4), empty space correction, `items-start` |

## What is NOT Changed
- Props, handlers, onClick, data flow (i18n, locale, resourcesByTopic)
- isResourceLocked, toggleBookmark, viewedIds, bookmarkedIds
- Sequential unlocking logic, admin bypass
- data-testid, aria-label, aria-expanded, roles, keyboard navigation
- AnimatePresence, exit animations
- getResourcesForTopic, getResourceTypesForTopic, countResourcesByType
- Existing shimmer-pulse animation

## Verification
- `npx vite build` must succeed with no errors
- All functionality (accordion expand/collapse, resource viewing, bookmarking, progress tracking) must work unchanged
- All aria-labels and keyboard navigation preserved
