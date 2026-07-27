import { useEffect } from "react";

export function useVisualViewport(ref, key) {
  useEffect(() => {
    const el = typeof ref === "function" ? null : ref?.current;
    if (!el || !window.visualViewport) return;

    const handler = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      el.style.height = `${vv.height}px`;
    };

    window.visualViewport.addEventListener("resize", handler);
    window.visualViewport.addEventListener("scroll", handler);
    handler();

    return () => {
      window.visualViewport.removeEventListener("resize", handler);
      window.visualViewport.removeEventListener("scroll", handler);
    };
  }, [ref, key]);
}
