/**
 * AGE-ADAPTIVE ORAL EXAM SIMULATOR
 * ================================
 *
 * Renders OralExamSimulator with visual optimization for three age groups:
 * - Primary (6-9): Dani as large animated mascot, bright colors, emoji feedback
 * - Intermediate (10-13): Dani as engaged mentor, moderate colors, friendly feedback
 * - Secondary (14-16): Dani as professional tutor, sophisticated colors, analytical feedback
 *
 * Automatically adapts difficulty, UI size, and interaction style based on student age.
 */

import { memo, useMemo } from "react";
import {
  getPalette,
  SIZING_SCALE,
  TYPOGRAPHY_PRESETS,
} from "../../styles/color-palettes";
import OralExamSimulator from "./OralExamSimulator";

/**
 * Determine age group from student age
 */
function getAgeGroup(age) {
  if (age >= 14) return "secondary";
  if (age >= 10) return "intermediate";
  return "primary";
}

/**
 * Age-Adaptive Wrapper for OralExamSimulator
 */
const AgeAdaptiveOralExam = memo(
  ({ studentAge = 10, darkMode = false, onTabChange }) => {
    const ageGroup = useMemo(() => getAgeGroup(studentAge), [studentAge]);
    const palette = useMemo(
      () => getPalette(ageGroup, darkMode),
      [ageGroup, darkMode],
    );
    const sizing = useMemo(() => SIZING_SCALE[ageGroup], [ageGroup]);
    const typography = useMemo(() => TYPOGRAPHY_PRESETS[ageGroup], [ageGroup]);

    // Dani mascot size varies by age group
    const daniSize = useMemo(() => {
      switch (ageGroup) {
        case "primary":
          return 120; // Large animated mascot
        case "intermediate":
          return 80; // Moderate presence
        default:
          return 60; // Small, professional
      }
    }, [ageGroup]);

    const wrapperStyle = useMemo(
      () => ({
        "--color-primary": palette.colors.primary,
        "--color-secondary": palette.colors.secondary,
        "--color-accent": palette.colors.accent,
        "--color-success": palette.colors.success,
        "--color-error": palette.colors.error,
        "--color-text": palette.colors.text,
        "--icon-size": `${sizing.iconSize}px`,
        "--button-size": `${sizing.touchTarget}px`,
        "--border-radius": `${sizing.borderRadius}px`,
        "--dani-size": `${daniSize}px`,
        "--font-family": typography.fontFamily,
        "--font-size-md": typography.fontSize.md,
        "--font-size-lg": typography.fontSize.lg,
        "--line-height": typography.lineHeight,
        fontSize: typography.fontSize.md,
        fontFamily: typography.fontFamily,
      }),
      [palette, sizing, typography, daniSize],
    );

    return (
      <div
        style={wrapperStyle}
        className={`age-adaptive-oral-exam-${ageGroup} ${darkMode ? "dark" : "light"}`}
      >
        <style>{`
        /* PRIMARY (6-9): Large, Playful */
        .age-adaptive-oral-exam-primary {
          --button-animation: cubic-bezier(0.34, 1.56, 0.64, 1);
          --dani-animation: bounce-playful 3s infinite;
        }

        .age-adaptive-oral-exam-primary .dani-mascot {
          width: var(--dani-size);
          height: var(--dani-size);
          font-size: calc(var(--dani-size) * 0.7);
          animation: var(--dani-animation);
        }

        .age-adaptive-oral-exam-primary .question-card {
          border: 3px solid var(--color-primary);
          border-radius: calc(var(--border-radius) * 1.2);
          padding: 24px;
          min-height: 200px;
          box-shadow: 0 8px 16px rgba(255, 107, 107, 0.15);
        }

        .age-adaptive-oral-exam-primary .option-button {
          min-height: var(--button-size);
          border-radius: calc(var(--border-radius) * 1);
          font-size: calc(var(--font-size-md) * 1.1);
          padding: 16px 20px;
          transition: all 0.3s var(--button-animation);
        }

        .age-adaptive-oral-exam-primary .option-button:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 8px 16px rgba(255, 107, 107, 0.25);
        }

        .age-adaptive-oral-exam-primary .feedback-message {
          font-size: calc(var(--font-size-md) * 1.2);
          padding: 20px;
          border-radius: calc(var(--border-radius) * 1);
          animation: slide-in 0.3s ease-out;
        }

        .age-adaptive-oral-exam-primary .result-score {
          font-size: calc(var(--font-size-lg) * 2);
          font-weight: 900;
        }

        /* INTERMEDIATE (10-13): Balanced */
        .age-adaptive-oral-exam-intermediate {
          --button-animation: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          --dani-animation: subtle-bob 4s ease-in-out infinite;
        }

        .age-adaptive-oral-exam-intermediate .dani-mascot {
          width: var(--dani-size);
          height: var(--dani-size);
          font-size: calc(var(--dani-size) * 0.7);
          animation: var(--dani-animation);
        }

        .age-adaptive-oral-exam-intermediate .question-card {
          border: 2px solid var(--color-primary);
          border-radius: var(--border-radius);
          padding: 20px;
          min-height: 180px;
          box-shadow: 0 4px 12px rgba(0, 136, 204, 0.12);
        }

        .age-adaptive-oral-exam-intermediate .option-button {
          min-height: 44px;
          border-radius: calc(var(--border-radius) * 0.9);
          font-size: var(--font-size-md);
          padding: 12px 16px;
          transition: all 0.25s var(--button-animation);
        }

        .age-adaptive-oral-exam-intermediate .option-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 136, 204, 0.15);
        }

        .age-adaptive-oral-exam-intermediate .feedback-message {
          font-size: var(--font-size-md);
          padding: 16px;
          border-radius: calc(var(--border-radius) * 0.9);
          animation: fade-in 0.4s ease-out;
        }

        .age-adaptive-oral-exam-intermediate .result-score {
          font-size: calc(var(--font-size-lg) * 1.6);
          font-weight: 800;
        }

        /* SECONDARY (14-16): Professional */
        .age-adaptive-oral-exam-secondary {
          --button-animation: cubic-bezier(0.4, 0, 0.2, 1);
          --dani-animation: none;
        }

        .age-adaptive-oral-exam-secondary .dani-mascot {
          width: var(--dani-size);
          height: var(--dani-size);
          font-size: calc(var(--dani-size) * 0.7);
          opacity: 0.85;
        }

        .age-adaptive-oral-exam-secondary .question-card {
          border: 1px solid var(--color-primary);
          border-radius: calc(var(--border-radius) * 0.9);
          padding: 18px;
          min-height: 160px;
          box-shadow: 0 2px 8px rgba(15, 118, 110, 0.08);
        }

        .age-adaptive-oral-exam-secondary .option-button {
          min-height: 40px;
          border-radius: calc(var(--border-radius) * 0.8);
          font-size: calc(var(--font-size-md) * 0.95);
          padding: 10px 14px;
          transition: all 0.2s var(--button-animation);
        }

        .age-adaptive-oral-exam-secondary .option-button:hover {
          opacity: 0.9;
          box-shadow: 0 2px 6px rgba(15, 118, 110, 0.1);
        }

        .age-adaptive-oral-exam-secondary .feedback-message {
          font-size: var(--font-size-md);
          padding: 14px;
          border-radius: calc(var(--border-radius) * 0.8);
          animation: none;
        }

        .age-adaptive-oral-exam-secondary .result-score {
          font-size: calc(var(--font-size-lg) * 1.4);
          font-weight: 700;
        }

        /* Shared Animations */
        @keyframes bounce-playful {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.05); }
        }

        @keyframes subtle-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Accessibility: Focus states */
        .age-adaptive-oral-exam-primary button:focus,
        .age-adaptive-oral-exam-intermediate button:focus,
        .age-adaptive-oral-exam-secondary button:focus {
          outline: 3px solid var(--color-primary);
          outline-offset: 2px;
        }

        /* Accessibility: High contrast mode */
        @media (prefers-contrast: more) {
          .age-adaptive-oral-exam-primary .question-card,
          .age-adaptive-oral-exam-intermediate .question-card,
          .age-adaptive-oral-exam-secondary .question-card {
            border-width: 2px;
          }
        }

        /* Accessibility: Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .age-adaptive-oral-exam-primary .dani-mascot,
          .age-adaptive-oral-exam-intermediate .dani-mascot,
          .age-adaptive-oral-exam-primary .option-button:hover,
          .age-adaptive-oral-exam-intermediate .option-button:hover,
          .age-adaptive-oral-exam-primary .feedback-message,
          .age-adaptive-oral-exam-intermediate .feedback-message {
            animation: none;
            transition: none;
          }
        }

        /* Responsive: Mobile adjustments */
        @media (max-width: 768px) {
          .age-adaptive-oral-exam-primary .question-card {
            padding: 18px;
            min-height: 160px;
          }

          .age-adaptive-oral-exam-intermediate .question-card {
            padding: 16px;
            min-height: 140px;
          }

          .age-adaptive-oral-exam-secondary .question-card {
            padding: 14px;
            min-height: 120px;
          }
        }

        @media (max-width: 480px) {
          .age-adaptive-oral-exam-primary .dani-mascot {
            width: 100px;
            height: 100px;
          }

          .age-adaptive-oral-exam-intermediate .dani-mascot {
            width: 70px;
            height: 70px;
          }

          .age-adaptive-oral-exam-secondary .dani-mascot {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>

        <OralExamSimulator onTabChange={onTabChange} />
      </div>
    );
  },
);

AgeAdaptiveOralExam.displayName = "AgeAdaptiveOralExam";

export default AgeAdaptiveOralExam;
