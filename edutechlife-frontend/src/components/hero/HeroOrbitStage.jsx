import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { BrainCore } from "./BrainCore";

const ICON_DIR = "/images/hero/icons";
// Íconos 3D Fluent (Microsoft, licencia MIT) que orbitan alrededor del cerebro.
const ORBIT_ICONS = ["cap", "laptop", "bulb", "robot", "rocket", "trophy"];

const SPRING = { stiffness: 90, damping: 20, mass: 0.8 };
const TAU = Math.PI * 2;

/**
 * Órbita 3D del slide principal: un cerebro turquesa (la IA de Edutechlife)
 * con íconos 3D girando alrededor en un plano inclinado. Los de atrás pasan
 * detrás del cerebro, más pequeños y desenfocados; los de adelante, encima.
 * El cursor inclina la órbita y el scroll la abre. Solo DOM + CSS: funciona
 * igual en escritorio, tablet y móvil.
 */
export const HeroOrbitStage = ({ isActive, running, reducedMotion, stage }) => {
  const { mx, my, scroll } = stage;
  const wrapRef = useRef(null);
  const ringRef = useRef(null);
  const itemRefs = useRef([]);
  const angleRef = useRef(0.35);

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
        const turn = -Math.cos(a) * 16;
        node.style.transform = `translate3d(${x}px, ${y + bob}px, 0) translate(-50%, -50%) perspective(700px) rotateY(${turn}deg) scale(${0.55 + near * 0.45}) rotate(${spin}deg)`;
        node.style.zIndex = depth > 0 ? "30" : "10";
        node.style.opacity = `${0.6 + near * 0.4}`;
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
            <BrainCore tilt={brainTilt} />
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

      {/* Íconos 3D en órbita, en colores de marca, con sombra de contacto */}
      {ORBIT_ICONS.map((name, i) => (
        <div
          key={name}
          ref={(el) => (itemRefs.current[i] = el)}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[60%] w-[16%] will-change-transform"
        >
          <span className="absolute left-1/2 top-[96%] h-[12%] w-[62%] -translate-x-1/2 rounded-[50%] bg-[#004B63]/25 blur-[6px]" />
          <img
            src={`${ICON_DIR}/${name}-brand.png`}
            alt=""
            decoding="async"
            className="relative w-full drop-shadow-[0_16px_18px_rgba(0,55,74,0.35)]"
          />
        </div>
      ))}
    </div>
  );
};
