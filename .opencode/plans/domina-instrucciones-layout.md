# Plan: Modify "Domina las Instrucciones" Topic Buttons

## Changes to make:

### File: `edutechlife-frontend/src/components/IALab/ModuleOverviewCard.jsx`

**Line 86-109: Topics Grid**

1. Change grid from 2 columns to 1 column:
   - `grid grid-cols-2 gap-2` → `grid grid-cols-1 gap-3`

2. Increase button size:
   - Padding: `px-3 py-2` → `px-4 py-3`
   - Text size: `text-sm` → `text-base`
   - Dot size: `w-2 h-2` → `w-2.5 h-2.5`
   - Gap: `gap-1.5` → `gap-2`
   - Hover scale: `scale: 1.05` → `scale: 1.02` (less aggressive for larger buttons)
   - Tap scale: `scale: 0.95` → `scale: 0.98`
