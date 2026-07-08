/**
 * Hook que genera física reproducible de movimiento para partículas
 * Usa el índice como seed para garantizar consistencia
 * @param {number} index - Índice único de la partícula
 * @returns {Object} Propiedades de movimiento: y, x, rotate, opacity
 */
export const useParticlePhysics = (index) => {
  // Usar índice como seed para reproducibilidad
  const seed = Math.sin(index * 12.9898) * 43758.5453;
  const frac = seed - Math.floor(seed);

  // Amplitudes y duraciones para movimiento Y (vertical)
  const yAmplitude = Math.abs(frac * 30) + 15; // 15-45px
  const yDuration = Math.abs(frac * 6) + 4; // 4-10s

  // Amplitudes y duraciones para movimiento X (horizontal)
  const xAmplitude = Math.abs(frac * 20) + 10; // 10-30px
  const xDuration = Math.abs(frac * 4) + 5; // 5-9s

  // Duración para rotación
  const rotateDuration = Math.abs(frac * 8) + 8; // 8-16s

  // Delay escalonado (cada 50ms)
  const delay = (index * 50) / 1000;

  // Opacidad base con variación (más visible)
  const baseOpacity = 0.4 + Math.abs(frac * 0.4); // 0.4 a 0.8

  return {
    y: {
      amplitude: yAmplitude,
      duration: yDuration,
      delay,
    },
    x: {
      amplitude: xAmplitude,
      duration: xDuration,
      delay,
    },
    rotate: {
      duration: rotateDuration,
      delay,
    },
    opacity: baseOpacity,
  };
};
