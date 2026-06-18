# SmartBoard Kids Dashboard — Rediseño Minimalista

**Date:** 2026-06-16
**Status:** Approved Design
**Target:** `SmartBoardKidsDashboard.jsx`

## Problem

19 tabs en navegación lateral + 16 en bottom bar móvil = sobrecarga cognitiva para niños de 6-16 años. Sin jerarquía visual, todos los items parecen igual de importantes.

## Solution

Agrupar 19 secciones en 5 categorías colapsables. Sidebar escritorio con 5 grupos + sus hijos expandibles. Bottom bar móvil con 5 tabs fijas (sin scroll horizontal).

## Architecture

### Category Map

```js
const CATEGORY_MAP = {
  // Home — always single item
  inicio: 'home',
  // Learn
  materias: 'learn', curriculo: 'learn', libros: 'learn', podcast: 'learn',
  // Practice
  examenes: 'practice', flashcards: 'practice', oral: 'practice', escaner: 'practice',
  // Progress
  vak: 'progress', progreso: 'progress', analitica: 'progress', calendario: 'progress',
  // Explore
  misiones: 'explore', actividades: 'explore', noticias: 'explore',
};
```

### Category Definitions

```js
const CATEGORIES = [
  { id: 'home',    icon: '🏠', label: 'Inicio',    color: '#4DA8C4', tabs: ['inicio'], premium: false },
  { id: 'learn',   icon: '📚', label: 'Aprender',  color: '#66CCCC', tabs: ['materias', 'curriculo', 'libros', 'podcast'], premium: false },
  { id: 'practice',icon: '✏️', label: 'Practicar', color: '#FF6B9D', tabs: ['examenes', 'flashcards', 'oral', 'escaner'], premium: false },
  { id: 'progress',icon: '📊', label: 'Progreso',  color: '#FFD166', tabs: ['vak', 'progreso', 'analitica', 'calendario'], premium: false },
  { id: 'explore', icon: '🎮', label: 'Explorar',  color: '#A855F7', tabs: ['misiones', 'actividades', 'noticias'], premium: false },
];
```

### Premium tabs handling
- `libros` is premium within `learn` category
- `analitica` is premium within `progress` category
- `noticias` is premium within `explore` category
- `padres` stays as external link button

### Desktop Sidebar

```
┌─────────────────┐
│ Logo + Name     │
│ 🔥 5 · 💎 1,250 │
├─────────────────┤
│ 🏠 Inicio      │ ← active tab
├─────────────────┤
│ 📚 Aprender    │ ← expanded
│  → Materias    │   ← active sub-tab
│  → Currículo   │
│  → Libros 📖🔒│   ← premium locked
│  → Podcast     │
├─────────────────┤
│ ✏️ Practicar   │ ← collapsed
├─────────────────┤
│ 📊 Progreso    │ ← collapsed
├─────────────────┤
│ 🎮 Explorar    │ ← collapsed
├─────────────────┤
│                 │
│ 👨‍👩‍👧 Padres    │ ← external link
└─────────────────┘
```

### Mobile Bottom Bar

5 fixed tabs, no scroll:
```
┌────┬────┬────┬────┬────┐
│ 🏠 │ 📚 │ ✏️ │ 📊 │ 🎮 │
│ Ini│ Apr│ Pra│ Pro│ Exp│
└────┴────┴────┴────┴────┘
```

## Color System

| Category | Color | Hex | Usage |
|----------|-------|-----|-------|
| Inicio | Cyan | `#4DA8C4` | Primary brand |
| Aprender | Green | `#66CCCC` | Growth, learning |
| Practicar | Pink | `#FF6B9D` | Energy, action |
| Progreso | Yellow | `#FFD166` | Achievements |
| Explorar | Purple | `#A855F7` | Discovery |

Each category's color tints its sub-tab icons and active indicators.

## Touch Targets

- Desktop sidebar items: min 48px height
- Mobile bottom bar: min 56×48px per tab
- Sub-tab items: min 44px height

## Animations

- Category expand/collapse: 250ms ease-out, max-height transition
- Sub-tab slide-down: opacity + translateY(0 → -4px → 0)
- Active tab indicator: spring-based layoutId transition
- Respect `prefers-reduced-motion`: disable all category animations

## Age Adaptation

- **6-9 años**: Larger icons (28px), hide category labels on sidebar, show only icons
- **10-12 años**: Standard icon (24px) + label
- **13-16 años**: Standard icon (20px) + bold label, denser layout

Determined by student profile/grade from context (grade ≤ 5 = child mode).

## Data Flow

No changes to context or state management. Only `PremiumSidebar` and `MobileBottomBar` components are refactored. A `CATEGORY_MAP` and `CATEGORIES` constants are extracted. `activeTab` continues to drive which section renders in `CinematicContent`.

## Files Changed

| File | Change |
|------|--------|
| `src/components/kids-dashboard/SmartBoardKidsDashboard.jsx` | Refactor PremiumSidebar (collapsible categories), MobileBottomBar (5 tabs), add CATEGORY_MAP/CATEGORIES constants, age adaptation |
