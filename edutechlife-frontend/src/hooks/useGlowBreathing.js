import { useState, useEffect } from "react";

/**
 * Hook para glow breathing animation
 * Retorna: { glowIntensity, glowColor }
 * Anima en ciclo continuo 0-100
 */
export const useGlowBreathing = (baseColor = "#4DA8C4") => {
  const [glowIntensity, setGlowIntensity] = useState(0.5);

  useEffect(() => {
    let animationFrame;
    let time = 0;

    const animate = () => {
      time += 0.02;
      // Sine wave para efecto breathing suave (0-1)
      const intensity = (Math.sin(time) + 1) / 2;
      setGlowIntensity(intensity);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Generar color hex con alpha basado en intensidad
  const hexIntensity = Math.round(glowIntensity * 255)
    .toString(16)
    .padStart(2, "0");

  return {
    glowIntensity,
    glowColor: `${baseColor}${hexIntensity}`,
  };
};
