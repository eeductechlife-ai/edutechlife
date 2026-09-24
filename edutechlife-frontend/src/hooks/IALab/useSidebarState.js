import { useState, useEffect, useRef } from "react";
import { useIALabStore } from "../../store/ialabStore";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

/**
 * Estado del sidebar de IALab.
 *
 * El colapso vive en el store (compartido con el atajo del header) y se fuerza
 * colapsado por debajo de 1024px. `isMobile` (<768px) se usa para que los
 * consumidores ajusten su comportamiento.
 *
 * Nota: antes este hook también gestionaba "secciones colapsables" legacy
 * (SECTION_DATA/MODULE_DATA) que el sidebar ya no usa; se eliminó ese código
 * muerto y sus datos.
 */
export function useSidebarState() {
  const isCollapsed = useIALabStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useIALabStore((s) => s.setSidebarCollapsed);
  const toggleSidebar = useIALabStore((s) => s.toggleSidebarCollapsed);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.innerWidth < MOBILE_BREAKPOINT
      : false,
  );
  const debounceRef = useRef(null);

  useEffect(() => {
    const checkViewport = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const w = window.innerWidth;
        setIsMobile(w < MOBILE_BREAKPOINT);
        if (w < TABLET_BREAKPOINT) setSidebarCollapsed(true);
      }, 100);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => {
      window.removeEventListener("resize", checkViewport);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [setSidebarCollapsed]);

  return { isCollapsed, toggleSidebar, isMobile };
}

export default useSidebarState;
