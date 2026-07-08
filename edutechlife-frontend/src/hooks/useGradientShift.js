import { useState, useEffect } from "react";

/**
 * useGradientShift - Hook para animar gradiente de colores continuamente
 * Crea un efecto de desplazamiento del gradiente
 */
export const useGradientShift = (
  colors = ["#004B63", "#4DA8C4", "#66CCCC"],
  speed = 50, // milisegundos entre updates
) => {
  const [gradientPosition, setGradientPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition((prev) => (prev + 1) % 100);
    }, speed);

    return () => clearInterval(interval);
  }, [speed]);

  // Crear gradiente lineal con los colores
  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;
  const backgroundPosition = `${gradientPosition}%`;
  const backgroundSize = "200% 100%"; // Tamaño para que el shift sea visible

  return {
    gradient,
    backgroundPosition,
    backgroundSize,
    gradientPosition,
  };
};
