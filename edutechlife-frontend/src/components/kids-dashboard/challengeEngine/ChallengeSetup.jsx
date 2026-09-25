import { memo, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

const EXPLORE_GRADIENT =
  "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)";

const SUBJECT_META = {
  math: { color: "#FB8500", short: "MAT" },
  science: { color: "#06D6A0", short: "CIE" },
  language: { color: "#9D4EDD", short: "LEN" },
  social: { color: "#EF476F", short: "SOC" },
  english: { color: "#FFD166", short: "ING" },
  chemistry: { color: "#E76F51", short: "QUI" },
  physics: { color: "#2A9D8F", short: "FIS" },
  informatics: { color: "#118AB2", short: "INF" },
  philosophy: { color: "#6D4C94", short: "FIL" },
};

function polarToCart(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function sectorPath(cx, cy, r, startDeg, endDeg) {
  const s = polarToCart(cx, cy, r, startDeg);
  const e = polarToCart(cx, cy, r, endDeg);
  return `M ${cx} ${cy} L ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 0 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)} Z`;
}

const SpinWheel = memo(({ subjects, onLand, selectedId }) => {
  const N = subjects.length;
  const deg = 360 / N;
  const selectedIdx = subjects.findIndex((s) => s.id === selectedId);
  const [rotation, setRotation] = useState(() =>
    selectedIdx >= 0 ? (360 - (selectedIdx + 0.5) * deg + 360) % 360 : 0,
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [landedIdx, setLandedIdx] = useState(
    selectedIdx >= 0 ? selectedIdx : null,
  );
  const [turning, setTurning] = useState(false);

  // A subject picked from the buttons below turns the wheel to it (short
  // turn), so the wheel always shows the current choice.
  useEffect(() => {
    if (isSpinning || selectedIdx < 0 || selectedIdx === landedIdx) return;
    const target = (360 - (selectedIdx + 0.5) * deg + 360) % 360;
    setRotation((rot) => {
      const cur = ((rot % 360) + 360) % 360;
      let delta = (target - cur + 360) % 360;
      if (delta > 180) delta -= 360;
      return rot + delta;
    });
    setLandedIdx(selectedIdx);
    setTurning(true);
    const t = setTimeout(() => setTurning(false), 450);
    return () => clearTimeout(t);
  }, [selectedIdx, deg, isSpinning, landedIdx]);

  const cx = 100,
    cy = 100,
    r = 90,
    textR = 58;
  const wheelTransition = isSpinning
    ? "transform 3.2s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
    : turning
      ? "transform 0.4s ease-out"
      : "none";

  const spin = useCallback(() => {
    if (isSpinning) return;
    const targetIdx = Math.floor(Math.random() * N);
    // Para que el puntero (12 o'clock) quede sobre el centro del sector targetIdx,
    // la rotación normalizada debe ser (360 - centro_del_sector) % 360 porque
    // al rotar el SVG en sentido horario por R, el punto que estaba en ángulo α
    // se desplaza a α+R; para que α+R=0 (puntero), R = -α = 360-α.
    const targetCenter = (360 - (targetIdx + 0.5) * deg + 360) % 360;
    const currentNorm = ((rotation % 360) + 360) % 360;
    const delta = (targetCenter - currentNorm + 360) % 360;
    const extraSpins = (4 + Math.floor(Math.random() * 2)) * 360;
    const newRotation = rotation + delta + extraSpins;

    setRotation(newRotation);
    setIsSpinning(true);
    setLandedIdx(null);

    setTimeout(() => {
      setIsSpinning(false);
      setLandedIdx(targetIdx);
      onLand(subjects[targetIdx]);
    }, 3300);
  }, [rotation, isSpinning, N, deg, subjects, onLand]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-52 h-52 sm:w-56 sm:h-56">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 -mt-1">
          <svg width="18" height="20">
            <polygon points="9,0 0,18 18,18" fill="#1E293B" />
          </svg>
        </div>

        {/* Spinning wheel */}
        <div
          className="w-full h-full rounded-full shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: wheelTransition,
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {subjects.map((s, i) => {
              const meta = {
                color: s.color || SUBJECT_META[s.id]?.color || "#9D4EDD",
                short:
                  SUBJECT_META[s.id]?.short ||
                  s.label.slice(0, 3).toUpperCase(),
              };
              const midDeg = (i + 0.5) * deg;
              const tp = polarToCart(cx, cy, textR, midDeg);
              return (
                <g
                  key={s.id}
                  role="button"
                  tabIndex={isSpinning ? -1 : 0}
                  aria-label={`Elegir ${s.label}`}
                  aria-pressed={i === landedIdx}
                  onClick={() => !isSpinning && onLand(s)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    !isSpinning &&
                    onLand(s)
                  }
                  className="cursor-pointer outline-none"
                  opacity={
                    landedIdx === null || isSpinning || i === landedIdx
                      ? 1
                      : 0.55
                  }
                  style={{ transition: "opacity 0.3s" }}
                >
                  <path
                    d={sectorPath(cx, cy, r, i * deg, (i + 1) * deg)}
                    fill={meta.color}
                    stroke="white"
                    strokeWidth="2.5"
                  />
                  {/* Counter-rotated with the same timing, so the emoji and
                      label stay upright wherever the slice ends up. */}
                  <g
                    style={{
                      transform: `rotate(${-rotation}deg)`,
                      transformOrigin: `${tp.x}px ${tp.y}px`,
                      transformBox: "view-box",
                      transition: wheelTransition,
                    }}
                  >
                    <text
                      x={tp.x}
                      y={tp.y - 6}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="22"
                    >
                      {s.emoji}
                    </text>
                    <text
                      x={tp.x}
                      y={tp.y + 12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="7"
                      fontWeight="bold"
                      fill="white"
                    >
                      {meta.short}
                    </text>
                  </g>
                </g>
              );
            })}
            {/* Outer ring */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="white"
              strokeWidth="3"
            />
          </svg>
        </div>

        {/* GIRAR button — fixed center */}
        <button
          onClick={spin}
          disabled={isSpinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white shadow-xl border-4 border-[#E2E8F0] text-[10px] font-black text-[#1E293B] tracking-wider flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
        >
          {isSpinning ? "⏳" : "GIRAR"}
        </button>
      </div>

      {/* One line says what is chosen; the slices themselves are the buttons
          (tap one to pick it, or GIRAR to let luck choose). */}
      <p
        className={`h-5 ${
          isSpinning
            ? "text-sm font-black text-[#9D4EDD] animate-pulse"
            : landedIdx === null
              ? "text-xs font-bold text-[#94A3B8]"
              : "text-sm font-black"
        }`}
        style={
          !isSpinning && landedIdx !== null
            ? { color: subjects[landedIdx]?.color }
            : undefined
        }
        aria-live="polite"
      >
        {isSpinning
          ? "¡Girando la ruleta…!"
          : landedIdx === null
            ? "👆 Toca una materia o GIRAR 🎲"
            : `✓ ${subjects[landedIdx]?.emoji} ${subjects[landedIdx]?.label}`}
      </p>
    </div>
  );
});

SpinWheel.displayName = "SpinWheel";

const ChallengeSetup = memo(
  ({
    subject,
    setSubject,
    difficulty,
    setDifficulty,
    onStart,
    loading,
    error,
    darkMode,
    subjects,
    difficulties,
  }) => {
    const handleLand = useCallback((s) => setSubject(s), [setSubject]);

    const cardBg = darkMode
      ? "bg-[#1E293B]/80 border-[#334155]/50"
      : "bg-white/80 border-[#E2E8F0]/50";
    const textPrimary = darkMode ? "text-white" : "text-[#1E293B]";
    const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
    const subjectColor = subject?.color || "#9D4EDD";

    return (
      <div className="space-y-3 sm:space-y-5">
        <div
          className={`rounded-2xl p-3.5 sm:p-5 border backdrop-blur-xl space-y-3 ${cardBg}`}
        >
          <h3 className={`text-sm sm:text-base font-black ${textPrimary}`}>
            1. Elige tu materia
          </h3>
          <SpinWheel
            subjects={subjects}
            onLand={handleLand}
            selectedId={subject?.id}
          />
        </div>

        <div
          className={`rounded-2xl p-3.5 sm:p-5 border backdrop-blur-xl ${cardBg}`}
        >
          <h3
            className={`text-sm sm:text-base font-black mb-2 sm:mb-3 ${textPrimary}`}
          >
            2. ¿Qué tan difícil?
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {difficulties.map((d) => {
              const sel = difficulty?.id === d.id;
              return (
                <motion.button
                  key={d.id}
                  onClick={() => setDifficulty(d)}
                  aria-pressed={sel}
                  whileTap={{ scale: 0.97 }}
                  className={`!flex flex-col !items-center !justify-start gap-0.5 px-1.5 py-2.5 rounded-xl border-2 text-center transition-all ${
                    sel
                      ? "text-white border-transparent shadow-md"
                      : darkMode
                        ? "bg-[#334155]/50 border-[#475569] text-white hover:border-[#9D4EDD]"
                        : "bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B] hover:border-[#9D4EDD]"
                  }`}
                  style={sel ? { background: EXPLORE_GRADIENT } : {}}
                >
                  <span className="text-2xl leading-none" aria-hidden="true">
                    {d.emoji}
                  </span>
                  <span className="text-xs font-bold leading-tight">
                    {d.label}
                  </span>
                  <span
                    className={`text-[10px] leading-tight ${sel ? "text-white/85" : textSecondary}`}
                  >
                    {d.hint ? `${d.hint} · ` : ""}
                    {d.questions} preguntas
                  </span>
                  <span
                    className={`text-[10px] font-black ${sel ? "text-white" : "text-[#9D4EDD]"}`}
                  >
                    +{d.xp} XP
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <motion.button
          onClick={onStart}
          disabled={!subject || !difficulty || loading}
          whileHover={{ scale: subject && difficulty ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${
            subject && difficulty && !loading
              ? "text-white shadow-lg hover:shadow-xl"
              : darkMode
                ? "bg-[#334155] text-[#64748B] cursor-not-allowed"
                : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
          }`}
          style={
            subject && difficulty && !loading
              ? {
                  background: `linear-gradient(135deg, ${subjectColor} 0%, #9D4EDD 100%)`,
                }
              : {}
          }
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⏳
              </motion.span>
              Generando preguntas...
            </span>
          ) : subject ? (
            "🚀 ¡Empezar reto!"
          ) : (
            "👆 Primero elige una materia"
          )}
        </motion.button>
      </div>
    );
  },
);

ChallengeSetup.displayName = "ChallengeSetup";
export default ChallengeSetup;
