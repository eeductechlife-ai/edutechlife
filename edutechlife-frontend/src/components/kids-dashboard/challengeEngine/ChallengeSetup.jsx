import { memo, useState, useCallback } from "react";
import { motion } from "framer-motion";

const EXPLORE_GRADIENT =
  "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)";

const SUBJECT_META = {
  math: { color: "#FB8500", short: "MAT" },
  science: { color: "#06D6A0", short: "CIE" },
  language: { color: "#9D4EDD", short: "LEN" },
  social: { color: "#EF476F", short: "SOC" },
  tech: { color: "#118AB2", short: "TEC" },
  english: { color: "#FFD166", short: "ING" },
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

const SpinWheel = memo(({ subjects, onLand }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [landedIdx, setLandedIdx] = useState(null);

  const N = subjects.length;
  const deg = 360 / N;
  const cx = 120,
    cy = 120,
    r = 108,
    textR = 70;

  const spin = useCallback(() => {
    if (isSpinning) return;
    const targetIdx = Math.floor(Math.random() * N);
    const targetCenter = (targetIdx + 0.5) * deg;
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
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-60 h-60">
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
            transition: isSpinning
              ? "transform 3.2s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
          }}
        >
          <svg viewBox="0 0 240 240" className="w-full h-full">
            {subjects.map((s, i) => {
              const meta = SUBJECT_META[s.id] || {
                color: "#9D4EDD",
                short: "?",
              };
              const midDeg = (i + 0.5) * deg;
              const tp = polarToCart(cx, cy, textR, midDeg);
              return (
                <g key={s.id}>
                  <path
                    d={sectorPath(cx, cy, r, i * deg, (i + 1) * deg)}
                    fill={meta.color}
                    stroke="white"
                    strokeWidth="2.5"
                  />
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white shadow-xl border-4 border-[#E2E8F0] text-[8px] font-black text-[#1E293B] tracking-widest flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
        >
          {isSpinning ? "⏳" : "GIRAR"}
        </button>
      </div>

      {/* Landing indicator */}
      {landedIdx !== null && !isSpinning ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="flex items-center gap-3 px-5 py-2.5 rounded-2xl font-bold text-white shadow-lg"
          style={{
            background:
              SUBJECT_META[subjects[landedIdx]?.id]?.color || "#9D4EDD",
          }}
        >
          <span className="text-xl">{subjects[landedIdx]?.emoji}</span>
          <span className="text-sm">{subjects[landedIdx]?.label}</span>
          <span>✓</span>
        </motion.div>
      ) : (
        !isSpinning && (
          <p className="text-xs text-[#94A3B8] font-medium">
            Toca GIRAR para elegir tu categoría
          </p>
        )
      )}

      {isSpinning && (
        <p className="text-xs text-[#9D4EDD] font-bold animate-pulse">
          ¡Girando la ruleta…!
        </p>
      )}
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
    const subjectColor = subject
      ? SUBJECT_META[subject.id]?.color || "#9D4EDD"
      : "#9D4EDD";

    return (
      <div className="space-y-5">
        {/* Spinning wheel */}
        <div className={`rounded-2xl p-5 border backdrop-blur-xl ${cardBg}`}>
          <h3 className={`text-sm font-bold mb-4 text-center ${textPrimary}`}>
            🎡 Gira la ruleta para elegir categoría
          </h3>
          <SpinWheel subjects={subjects} onLand={handleLand} />
        </div>

        {/* Difficulty */}
        <div className={`rounded-2xl p-5 border backdrop-blur-xl ${cardBg}`}>
          <h3 className={`text-sm font-bold mb-3 ${textPrimary}`}>
            ⚡ Nivel de dificultad
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {difficulties.map((d) => {
              const sel = difficulty?.id === d.id;
              return (
                <motion.button
                  key={d.id}
                  onClick={() => setDifficulty(d)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    sel
                      ? "text-white border-transparent shadow-md"
                      : darkMode
                        ? "bg-[#334155]/50 border-[#475569] text-white hover:border-[#9D4EDD]"
                        : "bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B] hover:border-[#9D4EDD]"
                  }`}
                  style={sel ? { background: EXPLORE_GRADIENT } : {}}
                >
                  <div className="text-xl mb-1">{d.emoji}</div>
                  <div className="text-xs font-bold">{d.label}</div>
                  <div
                    className={`text-[10px] mt-0.5 ${sel ? "text-white/80" : textSecondary}`}
                  >
                    {d.questions} pregs · {d.xp} XP
                  </div>
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
          ) : (
            `🚀 Iniciar Reto${subject ? ` de ${subject.label}` : ""}`
          )}
        </motion.button>
      </div>
    );
  },
);

ChallengeSetup.displayName = "ChallengeSetup";
export default ChallengeSetup;
