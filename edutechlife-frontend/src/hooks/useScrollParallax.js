import { useState, useEffect } from "react";

/**
 * Hook para parallax suave en scroll
 * Retorna: scrollY (valor normalizado 0-100)
 * Cada partícula usará esto diferente basado en su tamaño
 */
export const useScrollParallax = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calcular altura total scrolleable
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;

      // Normalizar: 0-100 (como porcentaje)
      const scrollPercent =
        scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

      setScrollY(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
};
