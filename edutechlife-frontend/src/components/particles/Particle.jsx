import { motion } from "framer-motion";
import { useParticlePhysics } from "../../hooks/useParticlePhysics";
import "./particles.css";

const sizeMap = {
  small: "w-2 h-2",
  medium: "w-3 h-3",
  large: "w-4 h-4",
};

/**
 * Componente de partícula individual con animaciones 3D
 * @param {number} index - Índice único para seed reproducible
 * @param {string} color - Color hexadecimal (#RRGGBB)
 * @param {string} size - Tamaño: 'small' | 'medium' | 'large'
 */
export const Particle = ({ index, color = "#4DA8C4", size = "medium" }) => {
  const physics = useParticlePhysics(index);

  const glowColor = `${color}66`; // Alpha 40%
  const brightGlowColor = `${color}CC`; // Alpha 80%

  return (
    <motion.div
      className={`${sizeMap[size]} rounded-full particle pointer-events-none`}
      style={{
        background: color,
        boxShadow: `0 0 20px ${glowColor}, 0 0 10px ${color}33`,
      }}
      animate={{
        y: [0, -physics.y.amplitude, 0],
        x: [0, physics.x.amplitude, -physics.x.amplitude, 0],
        rotate: [0, 360],
      }}
      transition={{
        y: {
          duration: physics.y.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: physics.y.delay,
        },
        x: {
          duration: physics.x.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: physics.x.delay,
        },
        rotate: {
          duration: physics.rotate.duration,
          repeat: Infinity,
          ease: "linear",
          delay: physics.rotate.delay,
        },
      }}
      whileHover={{
        scale: 1.2,
        boxShadow: `0 0 40px ${brightGlowColor}, 0 0 20px ${glowColor}`,
        filter: "brightness(1.3)",
      }}
      initial={{ opacity: physics.opacity }}
      animate={{ opacity: physics.opacity }}
    />
  );
};

Particle.displayName = "Particle";
