import { motion } from "framer-motion";
import { useParticlePhysics } from "../../hooks/useParticlePhysics";
import { useMouseTracking } from "../../hooks/useMouseTracking";
import { useScrollParallax } from "../../hooks/useScrollParallax";
import { useGlowBreathing } from "../../hooks/useGlowBreathing";
import "./particles.css";

const sizeMap = {
  small: "w-3 h-3", // 12px (antes 8px)
  medium: "w-4 h-4", // 16px (antes 12px)
  large: "w-5 h-5", // 20px (antes 16px)
};

/**
 * Componente de partícula individual con animaciones 3D
 * @param {number} index - Índice único para seed reproducible
 * @param {string} color - Color hexadecimal (#RRGGBB)
 * @param {string} size - Tamaño: 'small' | 'medium' | 'large'
 */
export const Particle = ({
  index,
  color = "#4DA8C4",
  size = "medium",
  sizeCategory = "medium",
}) => {
  const physics = useParticlePhysics(index);
  const { mouseX, mouseY, isInside } = useMouseTracking();
  const scrollY = useScrollParallax();
  const { glowIntensity, glowColor } = useGlowBreathing(color);

  // ===== FASE 3: DEPTH EFFECT =====
  const zIndex = Math.floor((index / 45) * 100);
  const depthOffset = (zIndex / 100 - 0.5) * 50; // -25 a 25
  const depthBlur = Math.max(0, depthOffset / 10); // 0 a 2.5px
  const depthOpacityModifier = Math.max(0.3, 1 - Math.abs(depthOffset) / 200);

  // ===== FASE 3: ORBIT MOTION =====
  const hasOrbit = index % 5 === 0;
  const orbitCenters = [
    { x: 20, y: 30 },
    { x: 80, y: 25 },
    { x: 50, y: 70 },
  ];
  const orbitCenter = hasOrbit ? orbitCenters[index % 3] : null;
  const orbitRadius = 80; // px
  const orbitAngle = (index * 360) / 45; // Distribuir ángulos

  // Aumentar opacidad para bolas más grandes
  const sizeOpacityBoost = {
    small: 1,
    medium: 1.1,
    large: 1.3, // Bolas grandes 30% más opacas
  };

  const finalOpacity = Math.min(
    physics.opacity * sizeOpacityBoost[sizeCategory] * depthOpacityModifier,
    1,
  );

  // Parallax multiplier por tamaño (small: 0.3x, medium: 0.5x, large: 0.7x)
  const parallaxMap = { small: 0.3, medium: 0.5, large: 0.7 };
  const parallaxOffset = (scrollY / 100) * 50 * parallaxMap[sizeCategory];

  // Mouse attraction (si está dentro del viewport)
  // Normalizar posición del mouse a ±15px (rango de atracción suave)
  const mouseAttraction = isInside
    ? {
        x: (mouseX - 0.5) * 30, // ±15px
        y: (mouseY - 0.5) * 30, // ±15px
      }
    : { x: 0, y: 0 };

  // Glow base color con alpha
  const baseGlowColor = `${color}99`; // Alpha 60%
  const brightGlowColor = `${color}FF`; // Alpha 100%

  // Posición inicial dispersa aleatoria
  const initialX = Math.sin(index * 12.9898) * 100; // -100 a 100 vw
  const initialY = Math.cos(index * 78.233) * 100; // -100 a 100 vh

  // Glow dinamico con breathing
  const dynamicGlowSize = 20 + glowIntensity * 30; // 20-50px
  const dynamicBoxShadow = `0 0 ${dynamicGlowSize}px ${glowColor}, 0 0 15px ${color}66`;

  // ===== ANIMACIONES COMBINADAS FASE 3 =====
  const animateProps = hasOrbit
    ? {
        // Órbita circular alrededor del centro
        x: Array.from(
          { length: 5 },
          (_, i) =>
            orbitCenter.x +
            Math.cos(((orbitAngle + i * 90) * Math.PI) / 180) * orbitRadius,
        ),
        y: Array.from(
          { length: 5 },
          (_, i) =>
            orbitCenter.y +
            Math.sin(((orbitAngle + i * 90) * Math.PI) / 180) * orbitRadius,
        ),
        rotateX: [0, 10, -10, 0],
        rotateY: [0, 15, -15, 0],
        rotate: [0, 360],
        opacity: finalOpacity,
      }
    : {
        // Movimiento normal + 3D rotations
        y: [
          mouseAttraction.y,
          -physics.y.amplitude + parallaxOffset + mouseAttraction.y,
          mouseAttraction.y,
        ],
        x: [
          mouseAttraction.x,
          physics.x.amplitude + mouseAttraction.x,
          -physics.x.amplitude + mouseAttraction.x,
          mouseAttraction.x,
        ],
        rotateX: [0, 10, -10, 0],
        rotateY: [0, 15, -15, 0],
        rotate: [0, 360],
        opacity: finalOpacity,
      };

  // ===== TRANSICIONES COMBINADAS FASE 3 =====
  const transitionProps = hasOrbit
    ? {
        x: { duration: 8, repeat: Infinity, ease: "linear" },
        y: { duration: 8, repeat: Infinity, ease: "linear" },
        rotateX: { duration: 15, repeat: Infinity, ease: "easeInOut" },
        rotateY: { duration: 18, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
        opacity: { duration: 8, repeat: Infinity, ease: "linear" },
      }
    : {
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
        rotateX: { duration: 15, repeat: Infinity, ease: "easeInOut" },
        rotateY: { duration: 18, repeat: Infinity, ease: "easeInOut" },
      };

  return (
    <motion.div
      className={`${sizeMap[size]} rounded-full particle pointer-events-none absolute`}
      style={{
        background: color,
        left: `${initialX}%`,
        top: `${initialY}%`,
        boxShadow: dynamicBoxShadow,
        zIndex: hasOrbit ? 50 : zIndex,
        filter: `blur(${depthBlur}px)`,
        perspective: "1000px",
      }}
      animate={animateProps}
      transition={transitionProps}
      whileHover={{
        scale: 1.3,
        boxShadow: `0 0 60px ${brightGlowColor}, 0 0 30px ${color}99`,
        filter: `brightness(${1 + (zIndex / 100) * 0.5}) blur(0px)`,
      }}
      initial={{ opacity: finalOpacity }}
    />
  );
};

Particle.displayName = "Particle";
