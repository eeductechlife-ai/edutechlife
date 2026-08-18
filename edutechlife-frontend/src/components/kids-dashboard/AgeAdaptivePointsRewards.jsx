/**
 * AGE-ADAPTIVE POINTS & REWARDS SYSTEM
 * ====================================
 *
 * Renders PointsRewardsSystem with visual optimization for three age groups:
 * - Primary (6-9): Bright colors, large badges, bouncy animations
 * - Intermediate (10-13): Balanced design, smooth transitions
 * - Secondary (14-16): Professional, minimal design
 *
 * Automatically selects design based on student age/profile.
 */

import { memo, useMemo } from "react";
import {
  getPalette,
  SIZING_SCALE,
  TYPOGRAPHY_PRESETS,
} from "../../styles/color-palettes";
import PointsRewardsSystem from "./PointsRewardsSystem";

/**
 * Determine age group from student age
 * @param age - Student age in years
 * @returns 'primary' | 'intermediate' | 'secondary'
 */
function getAgeGroup(age) {
  if (age >= 14) return "secondary";
  if (age >= 10) return "intermediate";
  return "primary";
}

/**
 * Age-Adaptive Wrapper for PointsRewardsSystem
 */
const AgeAdaptivePointsRewards = memo(
  ({ studentAge = 10, darkMode = false }) => {
    const ageGroup = useMemo(() => getAgeGroup(studentAge), [studentAge]);
    const palette = useMemo(
      () => getPalette(ageGroup, darkMode),
      [ageGroup, darkMode],
    );
    const sizing = useMemo(() => SIZING_SCALE[ageGroup], [ageGroup]);
    const typography = useMemo(() => TYPOGRAPHY_PRESETS[ageGroup], [ageGroup]);

    // Apply age-group styling via CSS custom properties
    const wrapperStyle = useMemo(
      () => ({
        "--color-primary": palette.colors.primary,
        "--color-secondary": palette.colors.secondary,
        "--color-accent": palette.colors.accent,
        "--color-success": palette.colors.success,
        "--color-text": palette.colors.text,
        "--icon-size": `${sizing.iconSize}px`,
        "--badge-size": `${sizing.iconSize * 1.3}px`,
        "--touch-target": `${sizing.touchTarget}px`,
        "--border-radius": `${sizing.borderRadius}px`,
        "--font-family": typography.fontFamily,
        "--font-size-md": typography.fontSize.md,
        "--font-size-lg": typography.fontSize.lg,
        "--line-height": typography.lineHeight,
        fontSize: typography.fontSize.md,
        fontFamily: typography.fontFamily,
        lineHeight: typography.lineHeight,
      }),
      [palette, sizing, typography],
    );

    return (
      <div
        style={wrapperStyle}
        className={`age-adaptive-points-rewards-${ageGroup} ${darkMode ? "dark" : "light"}`}
      >
        <style>{`
        /* Age Group: PRIMARY (6-9) */
        .age-adaptive-points-rewards-primary {
          --badge-animation: bounce-playful 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }

        .age-adaptive-points-rewards-primary .RewardCard {
          border: var(--border-radius) solid var(--color-primary);
          border-radius: calc(var(--border-radius) * 1.2);
          min-height: 180px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .age-adaptive-points-rewards-primary .RewardCard:hover {
          transform: translateY(-8px) scale(1.08);
          box-shadow: 0 12px 24px rgba(255, 107, 107, 0.25);
        }

        .age-adaptive-points-rewards-primary .badge-reward {
          width: var(--badge-size);
          height: var(--badge-size);
          font-size: calc(var(--badge-size) * 0.6);
          animation: bounce-playful 2s infinite;
        }

        .age-adaptive-points-rewards-primary .tab-button {
          min-height: var(--touch-target);
          font-size: calc(var(--font-size-md) * 1.1);
          padding: 12px 20px;
          font-weight: 700;
        }

        .age-adaptive-points-rewards-primary .points-display {
          font-size: calc(var(--font-size-lg) * 1.25);
          font-weight: 800;
        }

        /* Age Group: INTERMEDIATE (10-13) */
        .age-adaptive-points-rewards-intermediate {
          --badge-animation: none;
        }

        .age-adaptive-points-rewards-intermediate .RewardCard {
          border: 2px solid var(--color-primary);
          border-radius: var(--border-radius);
          min-height: 160px;
          transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .age-adaptive-points-rewards-intermediate .RewardCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 136, 204, 0.15);
        }

        .age-adaptive-points-rewards-intermediate .badge-reward {
          width: 52px;
          height: 52px;
          font-size: 24px;
        }

        .age-adaptive-points-rewards-intermediate .tab-button {
          min-height: 44px;
          font-size: var(--font-size-md);
          padding: 10px 16px;
          font-weight: 600;
        }

        .age-adaptive-points-rewards-intermediate .points-display {
          font-size: var(--font-size-lg);
          font-weight: 700;
        }

        /* Age Group: SECONDARY (14-16) */
        .age-adaptive-points-rewards-secondary {
          --badge-animation: none;
        }

        .age-adaptive-points-rewards-secondary .RewardCard {
          border: 1px solid var(--color-primary);
          border-radius: calc(var(--border-radius) * 0.8);
          min-height: 140px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .age-adaptive-points-rewards-secondary .RewardCard:hover {
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.1);
          opacity: 0.95;
        }

        .age-adaptive-points-rewards-secondary .badge-reward {
          width: 44px;
          height: 44px;
          font-size: 20px;
        }

        .age-adaptive-points-rewards-secondary .tab-button {
          min-height: 40px;
          font-size: calc(var(--font-size-md) * 0.9);
          padding: 8px 14px;
          font-weight: 500;
        }

        .age-adaptive-points-rewards-secondary .points-display {
          font-size: var(--font-size-md);
          font-weight: 600;
        }

        /* Shared animations */
        @keyframes bounce-playful {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* Accessibility: Focus states */
        .age-adaptive-points-rewards-primary button:focus,
        .age-adaptive-points-rewards-intermediate button:focus,
        .age-adaptive-points-rewards-secondary button:focus {
          outline: 3px solid var(--color-primary);
          outline-offset: 2px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .age-adaptive-points-rewards-primary .RewardCard {
            min-height: 160px;
          }

          .age-adaptive-points-rewards-intermediate .RewardCard {
            min-height: 140px;
          }

          .age-adaptive-points-rewards-secondary .RewardCard {
            min-height: 120px;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .age-adaptive-points-rewards-primary .badge-reward,
          .age-adaptive-points-rewards-primary .RewardCard:hover {
            animation: none;
            transform: none;
          }
        }
      `}</style>

        <PointsRewardsSystem />
      </div>
    );
  },
);

AgeAdaptivePointsRewards.displayName = "AgeAdaptivePointsRewards";

export default AgeAdaptivePointsRewards;
