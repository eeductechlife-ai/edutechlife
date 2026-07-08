import { motion } from "framer-motion";
import { useParticlePhysics } from "../../hooks/useParticlePhysics";
import "./particles.css";

const sizeMap = {
  small: "w-3 h-3",    // 12px (antes 8px)
  medium: "w-4 h-4",   // 16px (antes 12px)
  large: "w-5 h-5",    // 20px (antes 16px)
};

/**
 * Componente de partícula individual con animaciones 3D
 * @param {number} index - Índice único para seed reproducible
 * @param {string} color - Color hexadecimal (#RRGGBB)
 * @param {string} size - Tamaño: 'small' | 'medium' | 'large'
 */
export const Particle = ({ index, color = "#4DA8C4", size = "medium" }) => {
  const physics = useParticlePhysics(index);

  const glowColor = `${color}99`; // Alpha 60%
  const brightGlowColor = `${color}FF`; // Alpha 100%

  // Posición inicial dispersa aleatoria
  const initialX = Math.sin(index * 12.9898) * 100; // -100 a 100 vw
  const initialY = Math.cos(index * 78.233) * 100;  // -100 a 100 vh

  return (
    <motion.div
      className={`${sizeMap[size]} rounded-full particle pointer-events-none absolute`}
      style={{
        background: color,
        left: `${initialX}%`,
        top: `${initialY}%`,
        boxShadow: `0 0 30px ${glowColor}, 0 0 15px ${color}66`,
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
