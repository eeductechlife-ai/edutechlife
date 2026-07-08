import { useMemo } from "react";
import { Particle } from "./particles/Particle";

const COLORS = ["#4DA8C4", "#66CCCC", "#004B63", "#B2D8E5"];

/**
 * FloatingParticles - Sistema modular de partículas 3D flotantes
 * Fase 1: Arquitectura base con Particle component y useParticlePhysics hook
 *
 * @param {number} count - Número de partículas a renderizar (default: 45)
 * @param {string[]} colors - Array de colores hex para las partículas
 * @param {string} className - Clases CSS adicionales
 */
const FloatingParticles = ({ count = 45, className = "", colors = COLORS }) => {
  // Generar configuración de partículas usando índices como seed
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        // Distribuir tamaños de forma determinística:
        // 0-14: small, 15-29: medium, 30-44: large
        size: ["small", "medium", "large"][Math.floor(i / 15) % 3],
      })),
    [count, colors],
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
        />
      ))}
    </div>
  );
};

FloatingParticles.displayName = "FloatingParticles";

export default FloatingParticles;
