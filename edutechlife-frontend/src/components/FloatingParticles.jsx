import { useMemo, useEffect, useState } from "react";
import { Particle } from "./particles/Particle";

const COLORS = ["#4DA8C4", "#66CCCC", "#004B63", "#B2D8E5"];

/**
 * FloatingParticles - Sistema modular de partículas 3D flotantes
 * Fase 4: Optimización mobile + orbital deshabilitado en móvil
 *
 * @param {number} count - Número de partículas a renderizar (default: 45, móvil: 25)
 * @param {string[]} colors - Array de colores hex para las partículas
 * @param {string} className - Clases CSS adicionales
 * @param {boolean} orbital - Activar/desactivar órbita (default: true en desktop, false en móvil)
 */
const FloatingParticles = ({
  count = 45,
  className = "",
  colors = COLORS,
  orbital = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar si es móvil en el cliente
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Ajustar count y orbital para móvil
  const finalCount = isMobile ? 25 : count;
  const finalOrbital = isMobile ? false : orbital;

  // Generar configuración de partículas usando índices como seed
  const particles = useMemo(
    () =>
      Array.from({ length: finalCount }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        // Distribuir tamaños de forma determinística:
        // Móvil: menos variedad para performance
        size: isMobile
          ? i < 10
            ? "small"
            : i < 18
              ? "medium"
              : "large"
          : ["small", "medium", "large"][Math.floor(i / 15) % 3],
      })),
    [finalCount, colors, isMobile],
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          index={particle.id}
          color={particle.color}
          size={particle.size}
          sizeCategory={particle.size}
          orbital={finalOrbital}
          totalParticles={finalCount}
        />
      ))}
    </div>
  );
};

FloatingParticles.displayName = "FloatingParticles";

export default FloatingParticles;
