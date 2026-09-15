import { useEffect } from "react";

// Si el estudiante no interactúa por este tiempo y el sidebar está expandido,
// se colapsa solo para darle más espacio al contenido. Cualquier interacción
// reinicia el contador.
export const SIDEBAR_AUTO_COLLAPSE_MS = 2 * 60 * 1000;

const MIN_DESKTOP_WIDTH = 1024;

const INTERACTION_EVENTS = [
  "pointerdown",
  "pointermove",
  "keydown",
  "wheel",
  "touchstart",
  "scroll",
];

export function useSidebarAutoCollapse({
  isCollapsed,
  onCollapse,
  delayMs = SIDEBAR_AUTO_COLLAPSE_MS,
}) {
  useEffect(() => {
    if (isCollapsed) return; // ya cerrado: no hay nada que colapsar
    if (typeof window !== "undefined" && window.innerWidth < MIN_DESKTOP_WIDTH)
      return;

    let idleTimer = null;
    const scheduleCollapse = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(onCollapse, delayMs);
    };

    scheduleCollapse();
    const reset = () => scheduleCollapse();
    INTERACTION_EVENTS.forEach((e) =>
      window.addEventListener(e, reset, { passive: true }),
    );

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [isCollapsed, onCollapse, delayMs]);
}

export default useSidebarAutoCollapse;
