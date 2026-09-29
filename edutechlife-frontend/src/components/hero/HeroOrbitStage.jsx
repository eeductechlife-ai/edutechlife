import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

const ICON_DIR = "/images/hero/icons";
// Íconos 3D Fluent (Microsoft, licencia MIT) que orbitan alrededor del cerebro.
const ORBIT_ICONS = ["cap", "laptop", "bulb", "robot", "rocket", "trophy"];

const SPRING = { stiffness: 90, damping: 20, mass: 0.8 };
const GLASS =
  "rounded-2xl bg-white/90 shadow-[0_22px_45px_-20px_rgba(0,55,74,0.55)] ring-1 ring-white backdrop-blur-xl";
const TAU = Math.PI * 2;

/** Capa con parallax del puntero (`depth`) y separación al hacer scroll (`out`). */
const useDepthLayer = ({ mx, my }, spread, [depthX, depthY], [outX, outY]) => ({
  x: useSpring(
    useTransform([mx, spread], ([x, s]) => x * depthX + s * outX),
    SPRING,
  ),
  y: useSpring(
    useTransform([my, spread], ([y, s]) => y * depthY + s * outY),
    SPRING,
  ),
});

/**
 * Órbita 3D del slide principal: un cerebro turquesa (la IA de Edutechlife)
 * con íconos 3D girando alrededor en un plano inclinado. Los de atrás pasan
 * detrás del cerebro, más pequeños y desenfocados; los de adelante, encima.
 * El cursor inclina la órbita y el scroll la abre. Solo DOM + CSS: funciona
 * igual en escritorio, tablet y móvil.
 */
export const HeroOrbitStage = ({
  isActive,
  running,
  reducedMotion,
  stage,
  stats,
  statsRef,
  t,
}) => {
  const { mx, my, scroll } = stage;
  const wrapRef = useRef(null);
  const ringRef = useRef(null);
  const itemRefs = useRef([]);
  const angleRef = useRef(0.35);

  const spread = useTransform(scroll, [0, 0.5], [0, 1], { clamp: true });
  const brainX = useSpring(
    useTransform(mx, (x) => x * 22),
    SPRING,
  );
  const brainY = useSpring(
    useTransform(my, (y) => y * 14),
    SPRING,
  );
  const brainTilt = useSpring(
    useTransform(mx, (x) => x * 16),
    SPRING,
  );
  const chip = useDepthLayer(stage, spread, [-30, -20], [-60, -50]);
  const card = useDepthLayer(stage, spread, [-26, -18], [50, 40]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;
    const n = ORBIT_ICONS.length;
    let raf;
    let last = performance.now();

    const place = (now) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const w = wrap.clientWidth;
      const px = mx.get();
      const py = my.get();
      const open = scroll.get();
      angleRef.current += dt * 0.00016 * (1 + Math.abs(px) * 1.6);

      const rx = w * (0.44 + open * 0.1);
      const ry = w * (0.15 + py * 0.05 + open * 0.05);
      const tilt = px * 0.22;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      if (ringRef.current) {
        ringRef.current.style.width = `${rx * 2}px`;
        ringRef.current.style.height = `${ry * 2}px`;
        ringRef.current.style.transform = `translate(-50%, -50%) rotate(${tilt}rad)`;
      }

      itemRefs.current.forEach((node, i) => {
        if (!node) return;
        const a = angleRef.current + (i / n) * TAU;
        const ex = Math.cos(a) * rx;
        const ey = Math.sin(a) * ry;
        const x = ex * cosT - ey * sinT;
        const y = ex * sinT + ey * cosT;
        const depth = Math.sin(a); // -1 atrás … 1 adelante
        const near = (depth + 1) / 2;
        const bob = reducedMotion
          ? 0
          : Math.sin(now * 0.0016 + i * 1.7) * w * 0.012;
        const spin = reducedMotion ? 0 : Math.sin(now * 0.0011 + i) * 6;
        // La tarjeta gira en perspectiva siguiendo la órbita (de frente adelante, de canto en los lados).
        const turn = -Math.cos(a) * 38;
        node.style.transform = `translate3d(${x}px, ${y + bob}px, 0) translate(-50%, -50%) perspective(600px) rotateY(${turn}deg) rotateX(${8 - depth * 6}deg) scale(${0.58 + near * 0.42}) rotate(${spin}deg)`;
        node.style.zIndex = depth > 0 ? "30" : "10";
        node.style.opacity = `${0.5 + near * 0.5}`;
        node.style.filter =
          depth < -0.25
            ? `blur(${((-depth - 0.25) * 2).toFixed(2)}px)`
            : "none";
      });
    };

    place(last);
    if (reducedMotion || !(isActive && running)) return undefined;
    const loop = (now) => {
      place(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isActive, running, reducedMotion, mx, my, scroll]);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-[5/4] w-full max-w-[min(600px,calc(100dvh-15rem))] sm:aspect-square"
    >
      {/* Aura y pedestal de vidrio */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[44%] aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(102,204,204,0.55),rgba(0,151,167,0.15)_55%,transparent_72%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[64%] h-[10%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95),rgba(178,216,229,0.6)_55%,transparent_75%)] shadow-[0_0_40px_rgba(0,151,167,0.35)]"
      />

      {/* Plano de la órbita */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="absolute left-1/2 top-[60%] rounded-[50%] border border-[#0097A7]/35 shadow-[0_0_24px_rgba(0,151,167,0.25),inset_0_0_24px_rgba(102,204,204,0.25)]"
      />

      {/* Cerebro central */}
      <motion.div
        className="absolute left-1/2 top-[42%] z-20 w-[44%] [perspective:800px]"
        style={{ x: brainX, y: brainY }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div
            className="hero-motion"
            style={{ animation: "hero-float 6s ease-in-out infinite" }}
          >
            <motion.img
              src={`${ICON_DIR}/brain-teal.png`}
              alt=""
              decoding="async"
              fetchpriority="high"
              className="w-full drop-shadow-[0_30px_40px_rgba(0,75,99,0.45)]"
              style={{ rotateY: brainTilt }}
            />
          </div>
          {[12, 30, 52, 70, 86].map((left, i) => (
            <span
              key={left}
              aria-hidden="true"
              className="hero-motion absolute bottom-[10%] h-1.5 w-1.5 rounded-full bg-[#66CCCC] shadow-[0_0_10px_#66CCCC]"
              style={{
                left: `${left}%`,
                animation: `hero-rise ${3 + i * 0.6}s ease-in ${i * 0.7}s infinite`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Íconos en órbita: ícono 3D en color de marca sobre tarjeta de vidrio */}
      {ORBIT_ICONS.map((name, i) => (
        <div
          key={name}
          ref={(el) => (itemRefs.current[i] = el)}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[60%] w-[18%] will-change-transform"
        >
          <div className="relative aspect-square rounded-[28%] p-[15%]">
            <span className="absolute inset-0 rounded-[28%] bg-[linear-gradient(145deg,rgba(255,255,255,0.97),rgba(230,247,248,0.75)_45%,rgba(178,216,229,0.6))] shadow-[0_22px_34px_-14px_rgba(0,55,74,0.55),inset_0_1px_0_rgba(255,255,255,1),inset_0_-10px_22px_rgba(0,151,167,0.2)] ring-1 ring-white/90" />
            <span className="absolute inset-x-[10%] top-[5%] h-[32%] rounded-[40%] bg-gradient-to-b from-white/85 to-transparent" />
            <img
              src={`${ICON_DIR}/${name}-brand.png`}
              alt=""
              decoding="async"
              className="relative w-full drop-shadow-[0_10px_12px_rgba(0,55,74,0.4)]"
            />
          </div>
        </div>
      ))}

      <motion.div
        className={`absolute left-0 top-[4%] z-40 flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 ${GLASS}`}
        style={chip}
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0097A7] text-white">
          <Sparkles size={18} aria-hidden="true" />
        </span>
        <span className="max-w-[170px] text-[13px] font-bold leading-snug text-petroleum-dark">
          {t("hero.scene_chip")}
        </span>
      </motion.div>

      <motion.div
        ref={statsRef}
        className={`absolute bottom-0 right-0 z-40 hidden gap-5 px-4 py-3 sm:flex sm:gap-7 sm:px-5 sm:py-3.5 ${GLASS}`}
        style={card}
      >
        <div>
          <div className="font-display text-2xl font-extrabold tracking-tight text-petroleum-dark sm:text-3xl">
            {stats.students.toLocaleString()}+
          </div>
          <div className="text-xs text-slate-600">
            {t("hero.stat_estudiantes")}
          </div>
        </div>
        <div className="w-px bg-petroleum/15" aria-hidden="true" />
        <div>
          <div className="font-display text-2xl font-extrabold tracking-tight text-petroleum-dark sm:text-3xl">
            {stats.years}+
          </div>
          <div className="text-xs text-slate-600">
            {t("hero.stat_anios_experiencia")}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
