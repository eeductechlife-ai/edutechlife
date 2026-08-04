// Z-index hierarchy para Dani FAB
export const DANI_Z_INDEX = {
  fab: 40, // Floating button (always visible)
  modal: 50, // Modal backdrop/content (when open)
  reminder: 50, // Proactive reminder (same as modal)
  backdrop: 60, // Ensure modal is on top
};

// Breakpoints para responsive design
export const DANI_BREAKPOINTS = {
  mobile: 640, // sm
  tablet: 768, // md
  desktop: 1024, // lg
};

// Animación presets
export const DANI_ANIMATIONS = {
  fab: {
    scale: { initial: 0, animate: 1, exit: 0 },
    duration: 0.3,
  },
  pulse: {
    scale: [1, 1.2],
    opacity: [1, 0],
    duration: 2,
  },
};
