import { useState, useEffect } from "react";

/**
 * Hook para tracking suave del mouse
 * Retorna: { mouseX, mouseY, isInside }
 * mouseX/Y: 0-1 (posición normalizada)
 * isInside: boolean (mouse dentro de viewport)
 */
export const useMouseTracking = () => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isInside, setIsInside] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalizar: 0 = izquierda/arriba, 1 = derecha/abajo
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePos({ x, y });
      setIsInside(true);
    };

    const handleMouseLeave = () => {
      setIsInside(false);
      // Volver al centro
      setMousePos({ x: 0.5, y: 0.5 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return { mouseX: mousePos.x, mouseY: mousePos.y, isInside };
};
