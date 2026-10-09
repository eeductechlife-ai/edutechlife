import { useMemo, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const EASE = [0.22, 0.61, 0.36, 1];

// PRNG con semilla: la red sale idéntica en cada render y en el servidor
const seeded = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Red neuronal en viewBox 100×100: nodos repartidos en la elipse que ocupa
 * el cerebro, cada uno unido a sus vecinos más cercanos con curvas suaves.
 * La silueta exacta la recorta la máscara con la propia imagen.
 */
function buildNetwork(count = 46, neighbours = 3) {
  const rand = seeded(20261008);
  const nodes = [];
  while (nodes.length < count) {
    const x = 10 + rand() * 80;
    const y = 14 + rand() * 66;
    const dx = (x - 50) / 41;
    const dy = (y - 46) / 33;
    if (dx * dx + dy * dy <= 1) nodes.push([x, y]);
  }

  const seen = new Set();
  const links = [];
  nodes.forEach(([x, y], i) => {
    nodes
      .map(([nx, ny], j) => ({ j, d: (nx - x) ** 2 + (ny - y) ** 2 }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, neighbours)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        const [x2, y2] = nodes[j];
        // Curva: punto de control desplazado en perpendicular
        const bend = (rand() - 0.5) * 8;
        const cx = (x + x2) / 2 + (y2 - y) * 0.15 + bend;
        const cy = (y + y2) / 2 - (x2 - x) * 0.15 + bend;
        links.push({
          key,
          d: `M${x} ${y} Q${cx.toFixed(2)} ${cy.toFixed(2)} ${x2} ${y2}`,
        });
      });
  });

  // Impulsos: un subconjunto de conexiones con su propio ritmo
  const pulses = links
    .filter((_, i) => i % 3 === 0)
    .map((link, i) => ({
      ...link,
      dur: 1.6 + rand() * 1.8,
      begin: rand() * 3,
      big: i % 4 === 0,
    }));

  return { nodes, links, pulses };
}

// Regiones en % de la imagen (el cerebro mira a la izquierda: frontal a la
// izquierda, cerebelo abajo a la derecha). En cada ráfaga la activación
// recorre este orden, como una resonancia funcional.
const REGIONS = [
  { x: 22, y: 42, r: 24 }, // frontal
  { x: 42, y: 20, r: 20 }, // motora
  { x: 62, y: 24, r: 22 }, // parietal
  { x: 85, y: 42, r: 20 }, // occipital
  { x: 55, y: 60, r: 22 }, // temporal
  { x: 76, y: 76, r: 16 }, // cerebelo
];
const BURST_EVERY = 7.3; // s
const BURST_LENGTH = 2.6; // s
const WAVE_STEP = 0.3; // s entre una región y la siguiente
const WAVE_WIDTH = 0.38; // s, ancho de la activación de cada región

// Resorte lento para que el cerebro siga al cursor con peso, sin nervio
const FOLLOW = { stiffness: 55, damping: 18, mass: 1.1 };

// Suma de senos con periodos que no coinciden: el movimiento nunca se repite
// igual, así que no se percibe un bucle.
const wave = (s, parts) =>
  parts.reduce(
    (sum, [freq, phase, weight]) => sum + Math.sin(s * freq + phase) * weight,
    0,
  );

/**
 * Cerebro realista con actividad neuronal:
 * - flota y respira con movimiento orgánico (nunca un ciclo fijo);
 * - se inclina levemente hacia el cursor y un reflejo de luz recorre su
 *   superficie, lo que da volumen sin voltear la imagen plana;
 * - la actividad tiene reposo y ráfagas de "pensamiento" cada pocos segundos,
 *   en las que se encienden las señales y la luz interior.
 * `playing` = false lo deja en reposo (slide oculto, pausa o reducir movimiento).
 * `pointer` = { mx, my } en -0.5…0.5 (Hero.jsx).
 */
export const NeuralBrain = ({ src, playing, pointer }) => {
  const net = useMemo(() => buildNetwork(), []);
  const mask = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
  };

  const clock = useRef(0);
  const regionRefs = useRef([]);
  const floatY = useMotionValue(0);
  const floatRotate = useMotionValue(0);
  const breathe = useMotionValue(1);
  const activity = useMotionValue(0.45);

  useAnimationFrame((_, delta) => {
    if (!playing) return;
    clock.current += Math.min(delta, 64) / 1000;
    const s = clock.current;
    floatY.set(
      wave(s, [
        [0.55, 0, 0.6],
        [0.23, 1.3, 0.4],
      ]) * 9,
    );
    floatRotate.set(
      wave(s, [
        [0.31, 0.7, 0.9],
        [0.17, 0, 0.5],
      ]),
    );
    breathe.set(
      1 +
        wave(s, [
          [0.42, 0, 0.008],
          [0.19, 2, 0.006],
        ]),
    );
    // Reposo con murmullo + ráfaga de pensamiento cada 7,3 s
    const murmur =
      0.3 +
      0.1 *
        wave(s, [
          [0.9, 0, 0.5],
          [1.7, 1, 0.5],
        ]);
    const phase = s % BURST_EVERY;
    const burst =
      phase < BURST_LENGTH
        ? Math.sin((Math.PI * phase) / BURST_LENGTH) ** 2
        : 0;
    activity.set(Math.min(1, murmur + burst * 0.7));
    // Onda de activación: cada región alcanza su pico WAVE_STEP s después de la anterior
    regionRefs.current.forEach((el, i) => {
      if (!el) return;
      const peak = 0.25 + i * WAVE_STEP;
      const lit = Math.exp(-((phase - peak) ** 2) / (2 * WAVE_WIDTH ** 2));
      el.style.opacity = (0.04 + lit * 0.96).toFixed(3);
    });
  });

  const restX = useMotionValue(0);
  const restY = useMotionValue(0);
  const mx = pointer?.mx ?? restX;
  const my = pointer?.my ?? restY;
  const tiltY = useSpring(
    useTransform(mx, (v) => v * 12),
    FOLLOW,
  );
  const tiltX = useSpring(
    useTransform(my, (v) => v * -9),
    FOLLOW,
  );
  const lightX = useSpring(
    useTransform(mx, (v) => 50 + v * 80),
    FOLLOW,
  );
  const lightY = useSpring(
    useTransform(my, (v) => 38 + v * 70),
    FOLLOW,
  );
  const sheen = useMotionTemplate`radial-gradient(34% 30% at ${lightX}% ${lightY}%, rgba(255,255,255,0.6), rgba(255,255,255,0) 72%)`;

  const glowOpacity = useTransform(activity, (a) => 0.12 + a * 0.8);
  const signalOpacity = useTransform(activity, (a) => 0.2 + a * 0.8);

  return (
    // Entrada: aparece desde un leve desenfoque
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, scale: 0.96, filter: "blur(14px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <motion.div
        className="relative w-full [transform-style:preserve-3d]"
        style={{ rotateX: tiltX, rotateY: tiltY }}
      >
        <motion.div
          className="relative w-full"
          style={{ y: floatY, rotate: floatRotate, scale: breathe }}
        >
          <img
            src={src}
            alt=""
            decoding="async"
            className="relative block w-full [filter:drop-shadow(0_24px_34px_rgba(0,75,99,0.26))]"
          />

          {/* Luz interior: sube con cada ráfaga de actividad */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 mix-blend-screen"
            style={{
              ...mask,
              opacity: glowOpacity,
              background:
                "radial-gradient(44% 40% at 48% 52%, rgba(102,204,204,0.9), rgba(0,151,167,0.35) 55%, transparent 78%)",
            }}
          />

          {/* Activación regional: la onda de pensamiento que recorre los lóbulos */}
          {REGIONS.map(({ x, y, r }, i) => (
            <span
              key={`${x}-${y}`}
              ref={(el) => (regionRefs.current[i] = el)}
              aria-hidden="true"
              className="absolute inset-0 mix-blend-screen"
              style={{
                ...mask,
                opacity: 0.04,
                background: `radial-gradient(${r}% ${r * 1.15}% at ${x}% ${y}%, rgba(214,255,255,0.95), rgba(102,204,204,0.6) 38%, rgba(0,151,167,0.18) 66%, transparent 100%)`,
              }}
            />
          ))}

          {/* Reflejo que sigue al cursor sobre la superficie */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 mix-blend-soft-light"
            style={{ ...mask, background: sheen }}
          />

          {/* Actividad neuronal */}
          <motion.svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full mix-blend-screen"
            style={{ ...mask, opacity: signalOpacity }}
          >
            <defs>
              <radialGradient id="neural-spark">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#B8F4F4" />
                <stop offset="100%" stopColor="#66CCCC" stopOpacity="0" />
              </radialGradient>
            </defs>

            {net.links.map(({ key, d }) => (
              <path
                key={key}
                d={d}
                fill="none"
                stroke="#9FF0F2"
                strokeOpacity="0.12"
                strokeWidth="0.2"
                strokeLinecap="round"
              />
            ))}

            {net.nodes.map(([x, y], i) => (
              <circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r={i % 5 === 0 ? 0.6 : 0.38}
                fill="#F2FFFF"
                className={playing ? "hero-motion" : undefined}
                style={
                  playing
                    ? {
                        transformBox: "fill-box",
                        transformOrigin: "center",
                        filter: "drop-shadow(0 0 0.7px #66CCCC)",
                        animation: `neural-flash ${3 + (i % 5) * 0.7}s ease-out ${((i * 0.37) % 4).toFixed(2)}s infinite`,
                      }
                    : { opacity: 0.5 }
                }
              />
            ))}

            {/* Señales: destello con estela que recorre la conexión */}
            {playing &&
              net.pulses.map(({ key, d, dur, begin }) => (
                <path
                  key={`t-${key}`}
                  d={d}
                  pathLength="100"
                  fill="none"
                  stroke="#E6FFFF"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeDasharray="7 93"
                  className="hero-motion"
                  style={{
                    filter:
                      "drop-shadow(0 0 0.8px #66CCCC) drop-shadow(0 0 1.6px #0097A7)",
                    animation: `neural-signal ${dur.toFixed(2)}s cubic-bezier(0.4,0,0.2,1) ${begin.toFixed(2)}s infinite`,
                  }}
                />
              ))}

            {playing &&
              net.pulses.map(({ key, d, dur, begin, big }) => (
                <circle
                  key={`p-${key}`}
                  r={big ? 1.1 : 0.7}
                  fill="url(#neural-spark)"
                >
                  <animateMotion
                    dur={`${dur.toFixed(2)}s`}
                    begin={`${begin.toFixed(2)}s`}
                    repeatCount="indefinite"
                    path={d}
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1"
                  />
                </circle>
              ))}
          </motion.svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
