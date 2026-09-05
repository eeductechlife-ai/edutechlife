/**
 * Adaptive next-step logic — the MASTERED → PRACTICE → TRANSFER cycle (brief §54–57).
 *
 * Turns an activity result (score + optional self-reported difficulty) into a
 * concrete pedagogical next step, so the student never repeats the same thing
 * blindly (recovery on struggle, transfer on mastery). Pure function — no I/O,
 * fully unit-testable.
 *
 * @param {{ score?: number, feedback?: 'easy'|'ok'|'hard'|null }} input
 *   score: 0–100 (activity grade). feedback: student's 😊/😐/😣 self-report.
 * @returns {{ mode, emoji, title, why, cta, tab }}
 */
export const NEXT_STEP_MODES = {
  RECOVERY: "recovery",
  PRACTICE: "practice",
  TRANSFER: "transfer",
};

// Shared visual language per mode (SmartBoard palette) so every activity's
// next-step card looks consistent.
export const MODE_STYLE = {
  recovery: {
    grad: "linear-gradient(135deg,#FFB703,#FB8500)",
    ring: "#FB8500",
  },
  practice: {
    grad: "linear-gradient(135deg,#0096C7,#48CAE4)",
    ring: "#0096C7",
  },
  transfer: {
    grad: "linear-gradient(135deg,#06D6A0,#118AB2)",
    ring: "#06D6A0",
  },
};

export function getNextStep({ score = 0, feedback = null } = {}) {
  const s = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const struggled = s < 60 || feedback === "hard";
  const easyMastery = s >= 80 && feedback === "easy";

  if (struggled) {
    return {
      mode: NEXT_STEP_MODES.RECOVERY,
      emoji: "🧩",
      title: "Repasemos con calma",
      why:
        s < 60
          ? `Sacaste ${s}%. Vale la pena reforzar este tema antes de seguir.`
          : "Sentiste que fue difícil. Dani te lo explica de otra forma.",
      cta: "Pedirle un ejemplo más simple a Dani",
      tab: "oral",
    };
  }

  if (easyMastery) {
    return {
      mode: NEXT_STEP_MODES.TRANSFER,
      emoji: "🚀",
      title: "¡Lo dominaste! Sube de nivel",
      why: `${s}% y lo sentiste fácil. Es hora de un reto que lo aplique de verdad.`,
      cta: "Ir a un reto más avanzado",
      tab: "examenes",
    };
  }

  return {
    mode: NEXT_STEP_MODES.PRACTICE,
    emoji: "💪",
    title: "Vas bien — asegurémoslo",
    why: `${s}%. Una práctica más y este tema queda firme.`,
    cta: "Practicar una vez más",
    tab: null,
  };
}
