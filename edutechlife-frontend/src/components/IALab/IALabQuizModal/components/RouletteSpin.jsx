import { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";

const SPIN_MS = 4500;
// Tras aterrizar, el número se queda visible este tiempo antes de revelar la
// pregunta (si no, el examen reemplaza la rueda al instante y no se lee).
const HOLD_MS = 2000;
const HOLD_MS_REDUCED = 500;

// Paleta de marca: petróleo → cian, con tonos intermedios para dar profundidad.
const WHEEL_TONES = ["#003d52", "#004b63", "#0a6c86", "#259eb5", "#00bcd4"];

/**
 * RouletteSpin — "Gira la ruleta" para descubrir la siguiente pregunta del reto.
 * Experiencia premium: rueda con profundidad (rim metálico + disco segmentado +
 * hub de cristal), mesh de marca, y una coreografía de giro con anticipación,
 * desaceleración ("mass") y pop del número al aterrizar. Al detenerse revela la
 * pregunta sorteada (que luego aplica feedback verde/rojo).
 */
export default function RouletteSpin({ total = 10, resultNumber = 1, onReveal }) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [display, setDisplay] = useState(null);
  const [landed, setLanded] = useState(false);

  const spinTimer = useRef(null);
  const tickTimer = useRef(null);
  const revealTimer = useRef(null);
  const finishedRef = useRef(false);

  useEffect(
    () => () => {
      if (spinTimer.current) clearTimeout(spinTimer.current);
      if (tickTimer.current) clearInterval(tickTimer.current);
      if (revealTimer.current) clearTimeout(revealTimer.current);
    },
    [],
  );

  const segments = Math.max(2, total);
  const segmentAngle = 360 / segments;
  const target = ((resultNumber - 1) % segments + segments) % segments;

  const wheelBackground = useMemo(() => {
    const stops = [];
    for (let i = 0; i < segments; i++) {
      const c = WHEEL_TONES[i % WHEEL_TONES.length];
      stops.push(`${c} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`);
    }
    return `conic-gradient(from ${-segmentAngle / 2}deg, ${stops.join(", ")})`;
  }, [segments, segmentAngle]);

  const dividerBackground = useMemo(() => {
    const stops = [];
    for (let i = 0; i < segments; i++) {
      const a = i * segmentAngle - 0.35;
      stops.push(
        `transparent ${a}deg, rgba(255,255,255,0.22) ${a}deg ${a + 0.7}deg, transparent ${a + 0.7}deg`,
      );
    }
    return `conic-gradient(from ${-segmentAngle / 2}deg, ${stops.join(", ")})`;
  }, [segments, segmentAngle]);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (tickTimer.current) clearInterval(tickTimer.current);
    tickTimer.current = null;
    setDisplay(resultNumber);
    setSpinning(false);
    setLanded(true);
    // Deja ver el número que cayó antes de revelar la pregunta.
    revealTimer.current = setTimeout(
      () => onReveal?.(),
      reduce ? HOLD_MS_REDUCED : HOLD_MS,
    );
  };

  const handleSpin = () => {
    if (spinning) return;
    setLanded(false);
    setSpinning(true);
    setDisplay(null);
    finishedRef.current = false;

    if (reduce) {
      setDisplay(resultNumber);
      spinTimer.current = setTimeout(finish, 150);
      return;
    }

    const turns = 5 + Math.floor(Math.random() * 2);
    setRotation((prev) => {
      const normalized = ((prev % 360) + 360) % 360;
      const targetAngle = -(target * segmentAngle);
      const delta =
        ((targetAngle - normalized) % 360 + 360) % 360 + turns * 360;
      return prev + delta;
    });

    tickTimer.current = setInterval(
      () => setDisplay(1 + Math.floor(Math.random() * segments)),
      85,
    );
    spinTimer.current = setTimeout(finish, SPIN_MS);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-10 px-4 select-none">
      {/* Mesh de marca */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]"
      >
        <div
          className="absolute -top-16 -left-10 w-56 h-56 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(0,188,212,0.35), transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-20 -right-12 w-64 h-64 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(0,75,99,0.35), transparent 70%)",
          }}
        />
      </div>

      {/* Eyebrow */}
      <span className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.25em] font-semibold text-[var(--theme-emphasis)] dark:text-[#4DA8C4] ring-1 ring-[var(--theme-emphasis)]/15 bg-white/60 dark:bg-white/5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]" />
        {t("ialab.quiz.roulette_label")}
      </span>

      {/* Double-Bezel: shell + core */}
      <div className="relative z-10 rounded-[2.5rem] bg-white/60 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 p-2.5 shadow-[0_30px_60px_-30px_rgba(0,75,99,0.55)]">
        <div className="relative rounded-[calc(2.5rem-0.625rem)] bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]">
          <div className="relative w-[16rem] h-[16rem] sm:w-72 sm:h-72">
            {/* Halo */}
            <motion.span
              aria-hidden="true"
              className="absolute -inset-4 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,188,212,0.45), rgba(0,75,99,0.12) 60%, transparent 72%)",
              }}
              animate={
                spinning && !reduce ? { opacity: [0.4, 0.85, 0.4] } : { opacity: landed ? 0.8 : 0.5 }
              }
              transition={{
                duration: spinning ? 1.3 : 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Rim metálico */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 210deg, #eef4f7, #ffffff 18%, #c9dbe3 46%, #ffffff 74%, #eef4f7)",
                boxShadow:
                  "inset 0 2px 6px rgba(255,255,255,0.95), inset 0 -8px 16px rgba(0,75,99,0.22), 0 20px 40px -14px rgba(0,75,99,0.55)",
              }}
            />

            {/* Disco giratorio */}
            <motion.div
              className="absolute inset-[12px] rounded-full overflow-hidden"
              style={{ background: wheelBackground }}
              animate={{ rotate: rotation }}
              transition={{
                duration: reduce ? 0 : SPIN_MS / 1000,
                ease: [0.12, 0.74, 0.14, 1],
              }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: dividerBackground }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow:
                    "inset 0 0 44px rgba(0,0,0,0.38), inset 0 2px 3px rgba(255,255,255,0.25)",
                }}
              />
              {Array.from({ length: segments }).map((_, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 text-white font-bold tabular-nums"
                  style={{
                    fontSize: segments > 12 ? 11 : 15,
                    textShadow: "0 1px 2px rgba(0,0,0,0.45)",
                    transform: `translate(-50%, -50%) rotate(${i * segmentAngle}deg) translateY(-${segments > 12 ? 33 : 37}%)`,
                  }}
                >
                  {i + 1}
                </span>
              ))}
            </motion.div>

            {/* Destellos de marca */}
            {!reduce &&
              [
                { top: "6%", left: "18%", d: 0 },
                { top: "14%", left: "80%", d: 0.6 },
                { top: "82%", left: "12%", d: 1.1 },
                { top: "78%", left: "86%", d: 1.6 },
              ].map((s, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className="absolute w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]"
                  style={{ top: s.top, left: s.left }}
                  animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 0.6] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: s.d,
                    ease: "easeInOut",
                  }}
                />
              ))}

            {/* Pointer */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 -top-1 -translate-x-1/2 z-20"
              style={{ filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.3))" }}
            >
              <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
                <path
                  d="M13 30 2 8.5A13 13 0 0 1 24 8.5L13 30Z"
                  fill="url(#roulette-pointer)"
                />
                <defs>
                  <linearGradient
                    id="roulette-pointer"
                    x1="2"
                    y1="2"
                    x2="24"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#00bcd4" />
                    <stop offset="1" stopColor="#004b63" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Hub de cristal */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative w-[7.5rem] h-[7.5rem] rounded-full flex flex-col items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 30% 25%, #0a6c86, #004b63 72%)",
                  boxShadow:
                    "0 12px 28px rgba(0,75,99,0.5), inset 0 2px 5px rgba(255,255,255,0.4), inset 0 -10px 20px rgba(0,0,0,0.38)",
                }}
                animate={
                  landed && !reduce ? { scale: [0.92, 1.06, 1] } : { scale: 1 }
                }
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(255,255,255,0.28), transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%, rgba(255,255,255,0.2))",
                  }}
                />
                <span className="relative text-[9px] font-semibold uppercase tracking-[0.2em] text-white/65 leading-none">
                  {t("ialab.quiz.number_label")}
                </span>
                <span
                  className="relative text-4xl sm:text-5xl font-black text-white tabular-nums leading-none mt-1"
                  aria-live="polite"
                >
                  {display ?? "?"}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Resultado (durante la pausa) */}
      {landed && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          className="relative z-10 mt-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-white"
          style={{
            background:
              "linear-gradient(120deg, var(--theme-emphasis), var(--theme-primary))",
            boxShadow: "0 14px 28px -10px rgba(0,188,212,0.8)",
          }}
          aria-live="polite"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          {t("ialab.quiz.number_result", { n: resultNumber })}
        </motion.div>
      )}

      {/* Mensaje */}
      <p
        className="relative z-10 mt-3 text-sm theme-text-muted max-w-xs text-center"
        aria-live="polite"
      >
        {landed
          ? t("ialab.quiz.landed", { n: resultNumber })
          : t("ialab.quiz.spin_hint")}
      </p>

      {/* CTA "button-in-button" */}
      <motion.button
        type="button"
        onClick={handleSpin}
        disabled={spinning}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        className="group relative z-10 mt-5 inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full text-white font-semibold overflow-hidden shadow-[0_18px_34px_-12px_rgba(0,188,212,0.75)] disabled:opacity-70 disabled:cursor-wait"
        style={{
          background:
            "linear-gradient(120deg, var(--theme-emphasis), var(--theme-primary))",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          }}
        />
        <span className="relative">{t("ialab.quiz.spin")}</span>
        <span className="relative w-9 h-9 rounded-full bg-white/15 ring-1 ring-white/25 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <motion.span
            className="inline-flex"
            animate={
              spinning && !reduce ? { rotate: 360 } : { rotate: 0 }
            }
            transition={{
              duration: 1,
              repeat: spinning ? Infinity : 0,
              ease: "linear",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 2v4M12 2l3 3" />
            </svg>
          </motion.span>
        </span>
      </motion.button>
    </div>
  );
}

RouletteSpin.propTypes = {
  total: PropTypes.number,
  resultNumber: PropTypes.number,
  onReveal: PropTypes.func,
};
