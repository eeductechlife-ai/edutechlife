/* eslint-disable react/no-unknown-property -- fetchpriority (React 18 no lo reconoce) */
import { motion } from "framer-motion";

const BRAIN_SRC = "/images/hero/icons/brain-teal-hq.png";
const MASK = {
  WebkitMaskImage: `url(${BRAIN_SRC})`,
  maskImage: `url(${BRAIN_SRC})`,
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
};

// Red neuronal dentro de la silueta del cerebro (coordenadas en viewBox 100×100).
const NODES = [
  [24, 44],
  [33, 30],
  [45, 24],
  [58, 22],
  [70, 28],
  [79, 40],
  [72, 52],
  [60, 46],
  [48, 40],
  [36, 50],
  [28, 62],
  [42, 62],
  [55, 60],
  [67, 64],
  [80, 58],
  [50, 72],
];
const LINKS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 0],
  [1, 8],
  [2, 8],
  [3, 7],
  [4, 7],
  [9, 10],
  [10, 11],
  [11, 12],
  [12, 13],
  [13, 14],
  [14, 6],
  [11, 9],
  [12, 7],
  [15, 11],
  [15, 12],
  [15, 13],
  [8, 12],
];

/**
 * Cerebro central en alta resolución con acabado premium: brillo especular,
 * destello de luz que lo recorre y una red neuronal que pulsa dentro de su
 * silueta (máscara con la propia imagen). `tilt` = rotateY (motion value).
 */
export const BrainCore = ({ tilt }) => (
  <motion.div
    className="relative w-full [transform-style:preserve-3d]"
    style={{ rotateY: tilt }}
  >
    <img
      src={BRAIN_SRC}
      alt=""
      decoding="async"
      fetchpriority="high"
      className="relative w-full [filter:drop-shadow(0_0_26px_rgba(102,204,204,0.55))_drop-shadow(0_32px_36px_rgba(0,75,99,0.45))]"
    />

    {/* Brillo especular y volumen */}
    <span
      aria-hidden="true"
      className="absolute inset-0 mix-blend-soft-light"
      style={{
        ...MASK,
        background:
          "radial-gradient(60% 45% at 32% 22%, rgba(255,255,255,0.95), transparent 60%), radial-gradient(70% 60% at 70% 90%, rgba(0,55,74,0.45), transparent 70%)",
      }}
    />

    {/* Red neuronal */}
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full mix-blend-screen"
      style={MASK}
    >
      {LINKS.map(([a, b], i) => (
        <line
          key={`${a}-${b}`}
          x1={NODES[a][0]}
          y1={NODES[a][1]}
          x2={NODES[b][0]}
          y2={NODES[b][1]}
          stroke="rgba(230,255,255,0.75)"
          strokeWidth="0.45"
          strokeDasharray="2 3"
          className="hero-motion"
          style={{ animation: `hero-dash ${3 + (i % 4)}s linear infinite` }}
        />
      ))}
      {NODES.map(([x, y], i) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={i % 4 === 0 ? 1.4 : 0.9}
          fill="#ffffff"
          className="hero-motion"
          style={{
            animation: `hero-node 2.4s ease-in-out ${(i % 6) * 0.35}s infinite`,
            filter: "drop-shadow(0 0 1.5px #66CCCC)",
          }}
        />
      ))}
    </svg>

    {/* Destello de luz que recorre el cerebro */}
    <span
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={MASK}
    >
      <span
        className="hero-motion absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/55 to-transparent"
        style={{ animation: "hero-sweep 5.5s ease-in-out 1.2s infinite" }}
      />
    </span>
  </motion.div>
);
