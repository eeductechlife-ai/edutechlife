# Valerio Orb Button — 3D Tech Sphere

## Problem
Current ValerioFloatingButton is a standard gradient button with sparkles icon. Lacks the visual impact expected of a modern AI chat assistant.

## Goal
Transform into a high-impact 3D tech orb with:
- 3D sphere illusion via CSS radial gradients
- Rotating conic energy ring
- Orbiting particle dots
- Floating levitation animation
- Mouse-tracking hover tilt
- Pulsing chat icon center
- Premium glassmorphism tooltip

## Approach
Pure CSS 3D (no external dependencies). Use radial gradients for sphere illusion, conic gradients for energy ring, CSS keyframes for orbital particles, Framer Motion for interactivity.

## Layout
```
.mount-wrapper (AnimatePresence — entry animation)
  .tooltip (glassmorphism, absolute above)
  .tilt-wrapper (motion.div — mouse tracking rotateX/Y, floating)
    .particles (×7, CSS orbit keyframes)
    .energy-ring (conic gradient, CSS spin)
    .orb-button (button — click handler)
      .glow (hover blur)
      .orb-body (radial gradient 3D)
      .specular (light reflection)
      .rim-light (bottom glow)
      .icon (fa-comment-dots, pulsing)
      .online-dot (green indicator)
```

## Animations
| Element | Technique |
|---------|-----------|
| Entry | Spring scale 0.5→1, opacity 0→1 |
| Floating | Framer Motion y: [0, -6, 0], 3s infinite |
| Hover tilt | useMotionValue + useSpring, rotateX/Y bound to mouse |
| Energy ring | CSS @keyframes spin, 3s linear infinite |
| Particles | CSS @keyframes orbit, varying durations/delays |
| Icon pulse | Framer Motion scale [1, 1.12, 1], 2s infinite |
| Hover glow | opacity transition on blur element |

## Files
- Modify: `src/components/IALab/ValerioFloatingButton.jsx`
