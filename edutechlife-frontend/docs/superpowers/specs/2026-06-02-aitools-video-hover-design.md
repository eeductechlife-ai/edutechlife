# AI Lab Academic — Video on Hover

**Date:** 2026-06-02
**Status:** Draft
**Designer:** Lead Agent

## Problem

The "Herramientas de Élite" bento grid on the landing page (`AIToolsSection.jsx`) shows the AI Lab Academic card as a static info card (icon, name, badges, description, CTA button). We want it to **show an iLab dashboard video on hover** without removing any existing content.

## Context

- **Section:** `AIToolsSection.jsx` — "Herramientas de Élite" landing page section, bento grid `grid-cols-1 md:grid-cols-3 gap-6`
- **Card:** `ai-lab-academic` — first card, `col-span-1 md:col-span-2`, `card-clay-dark` variant
- **Video:** `/dashboard.mp4` (21.7 MB, same as used by `HeroIpad.jsx` at `/ialab-academic`)
- **Approach chosen:** "Content fades out → video plays full-card" (Approach A)

## Architecture

### File Changes

Only `AIToolsSection.jsx` is modified. No new components.

### State Machine

```
┌─────────────────────────────────────────────────┐
│  Default (no hover)                             │
│  ┌─────────────────────────────────────────┐   │
│  │ 🚀 icon   AI Lab Academic               │   │
│  │           [ACADEMIC] [CERTIFIED]        │   │
│  │           Description text...            │   │
│  │           [Comenzar Curso →]             │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
               ↓ mouseEnter (fade 200ms)
┌─────────────────────────────────────────────────┐
│  Hover Active                                   │
│  ┌─────────────────────────────────────────┐   │
│  │     ▸ ▸ Dashboard video ▸ ▸            │   │
│  │     playing full-card object-cover       │   │
│  │                                         │   │
│  │            [Comenzar Curso →]           │   │
│  │         (overlay flotante sobre video)   │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
               ↑ mouseLeave (fade 200ms)
                    back to Default
```

### Key Implementation Details

| Concern | Decision |
|---------|----------|
| Transition engine | `AnimatePresence` + `mode="wait"` (framer-motion) |
| Content → Video | Fade out 200ms, fade in 300ms |
| Video → Content | Fade out 200ms, fade in 300ms |
| `<video>` load | Lazy — not mounted until first hover |
| `<video>` src | `/dashboard.mp4` + `/dashboard.mov` fallback (same as HeroIpad) |
| `<video>` props | `muted loop playsInline preload="metadata"` |
| Poster fallback | `/images/ialab-demo-poster.png` |
| Play trigger | `onMouseEnter` calls `videoRef.current.play()` |
| Pause trigger | `onMouseLeave` calls `videoRef.current.pause()` + `currentTime = 0` |
| Video fill | `object-cover w-full h-full absolute inset-0` |
| CTA hover overlay | Absolute-positioned semi-transparent "Comenzar Curso" button over video |
| Mobile/touch (< `md:` breakpoint) | Always shows content + button, no hover behavior (touch events disabled) |
| `prefers-reduced-motion` | Skip fade animation — instant swap |

### CTA Button Behavior

- **Default state:** Existing button at bottom of card (`mt-auto pt-6`)
- **Hover state:** The button is duplicated as an overlay `<div>` with semi-transparent background (`bg-petroleum/70 backdrop-blur-sm`), centered or bottom-aligned over the video, so the user can click to navigate without leaving the hover zone
- **Both states:** `onClick` → `navigate('/ialab-academic')` (unchanged)

### Interaction Flow (Code)

```jsx
const [isHovered, setIsHovered] = useState(false);
const videoRef = useRef(null);
const prefersReducedMotion = useReducedMotion();

const handleMouseEnter = useCallback(() => {
  setIsHovered(true);
}, []);

const handleMouseLeave = useCallback(() => {
  setIsHovered(false);
  if (videoRef.current) {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }
}, []);
```

### Responsive Breakpoints

- **`md:` and up** (`≥768px`): Hover interaction active
- **Below `md:`** (`<768px`): No hover behavior. Always show static content + CTA button. Detected via `window.matchMedia('(min-width: 768px)')` in a `useEffect`, stored in `isDesktop` state. When `!isDesktop`, always render default content.

## Edge Cases

| Case | Handling |
|------|----------|
| Video fails to load | `<video onError>` hides the video element; `isVideoError` state falls back to static content |
| Extremely fast hover in/out | The `useRef` + `currentTime = 0` ensures clean state; `AnimatePresence` handles rapid mount/unmount gracefully |
| Tab focus (keyboard) | `<div>` has `tabIndex={0}` + `onFocus`/`onBlur` triggers hover behavior for keyboard users |
| Screen reader | `aria-label="AI Lab Academic — Ver video del dashboard"` on the container; `role="button"` |
| Touch + desktop hybrid (e.g. Surface) | First tap activates hover (video plays), second tap "Comenzar Curso" navigates |
| Reduced motion | `AnimatePresence` with `AnimatePresence mode="wait"` is still used, but `initial={{ opacity: 1 }}` skips the fade transition — content/video swap instantly |

## Future Considerations

- If more tool cards need video capability, extract a reusable `VideoHoverCard` component
- The video could be replaced by a YouTube embed if the business prefers hosting externally
