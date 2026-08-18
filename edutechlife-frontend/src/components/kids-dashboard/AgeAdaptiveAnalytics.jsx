/**
 * AGE-ADAPTIVE SMARTBOARD ANALYTICS
 * =================================
 *
 * Renders SmartBoardAnalytics with visual optimization for three age groups:
 * - Primary (6-9): Colorful charts, emoji indicators, large labels
 * - Intermediate (10-13): Balanced charts, moderate colors, clear data
 * - Secondary (14-16): Sophisticated visualizations, professional colors, detailed metrics
 *
 * Automatically adapts chart density, color palette, and information depth.
 */

import { memo, useMemo } from "react";
import {
  getPalette,
  SIZING_SCALE,
  TYPOGRAPHY_PRESETS,
} from "../../styles/color-palettes";
import SmartBoardAnalytics from "./SmartBoardAnalytics";

/**
 * Determine age group from student age
 */
function getAgeGroup(age) {
  if (age >= 14) return "secondary";
  if (age >= 10) return "intermediate";
  return "primary";
}

/**
 * Age-Adaptive Wrapper for SmartBoardAnalytics
 */
const AgeAdaptiveAnalytics = memo(({ studentAge = 10, darkMode = false }) => {
  const ageGroup = useMemo(() => getAgeGroup(studentAge), [studentAge]);
  const palette = useMemo(
    () => getPalette(ageGroup, darkMode),
    [ageGroup, darkMode],
  );
  const sizing = useMemo(() => SIZING_SCALE[ageGroup], [ageGroup]);
  const typography = useMemo(() => TYPOGRAPHY_PRESETS[ageGroup], [ageGroup]);

  // Chart height varies by age group (primary = more whitespace)
  const chartHeight = useMemo(() => {
    switch (ageGroup) {
      case "primary":
        return 220;
      case "intermediate":
        return 180;
      default:
        return 160;
    }
  }, [ageGroup]);

  const wrapperStyle = useMemo(
    () => ({
      "--color-primary": palette.colors.primary,
      "--color-secondary": palette.colors.secondary,
      "--color-accent": palette.colors.accent,
      "--color-success": palette.colors.success,
      "--color-text": palette.colors.text,
      "--icon-size": `${sizing.iconSize}px`,
      "--border-radius": `${sizing.borderRadius}px`,
      "--chart-height": `${chartHeight}px`,
      "--font-family": typography.fontFamily,
      "--font-size-md": typography.fontSize.md,
      "--font-size-lg": typography.fontSize.lg,
      "--line-height": typography.lineHeight,
      fontSize: typography.fontSize.md,
      fontFamily: typography.fontFamily,
    }),
    [palette, sizing, typography, chartHeight],
  );

  return (
    <div
      style={wrapperStyle}
      className={`age-adaptive-analytics-${ageGroup} ${darkMode ? "dark" : "light"}`}
    >
      <style>{`
        /* PRIMARY (6-9): Bright, Playful Charts */
        .age-adaptive-analytics-primary .metric-card {
          border: 3px solid var(--color-primary);
          border-radius: calc(var(--border-radius) * 1.2);
          padding: 20px;
          background: white;
          box-shadow: 0 8px 16px rgba(255, 107, 107, 0.1);
        }

        .age-adaptive-analytics-primary .metric-title {
          font-size: calc(var(--font-size-lg) * 1.1);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 12px;
        }

        .age-adaptive-analytics-primary .chart-container {
          height: var(--chart-height);
          margin: 16px 0;
        }

        .age-adaptive-analytics-primary .chart-label {
          font-size: calc(var(--font-size-md) * 0.9);
          font-weight: 600;
        }

        .age-adaptive-analytics-primary .metric-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border-radius: calc(var(--border-radius) * 0.8);
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          color: white;
          font-size: calc(var(--font-size-lg) * 1.2);
          font-weight: 800;
          box-shadow: 0 6px 12px rgba(255, 107, 107, 0.2);
        }

        .age-adaptive-analytics-primary .metric-icon {
          font-size: calc(var(--icon-size) * 0.8);
          margin-bottom: 8px;
        }

        .age-adaptive-analytics-primary .progress-bar {
          height: 12px;
          border-radius: 6px;
          background: #E5E7EB;
          overflow: hidden;
        }

        .age-adaptive-analytics-primary .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
          border-radius: 6px;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* INTERMEDIATE (10-13): Balanced Charts */
        .age-adaptive-analytics-intermediate .metric-card {
          border: 2px solid var(--color-primary);
          border-radius: var(--border-radius);
          padding: 16px;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 136, 204, 0.08);
        }

        .age-adaptive-analytics-intermediate .metric-title {
          font-size: var(--font-size-lg);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 10px;
        }

        .age-adaptive-analytics-intermediate .chart-container {
          height: var(--chart-height);
          margin: 12px 0;
        }

        .age-adaptive-analytics-intermediate .chart-label {
          font-size: var(--font-size-md);
          font-weight: 600;
        }

        .age-adaptive-analytics-intermediate .metric-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 14px;
          border-radius: calc(var(--border-radius) * 0.9);
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          color: white;
          font-size: var(--font-size-lg);
          font-weight: 700;
          box-shadow: 0 4px 8px rgba(0, 136, 204, 0.12);
        }

        .age-adaptive-analytics-intermediate .metric-icon {
          font-size: var(--icon-size);
          margin-bottom: 6px;
        }

        .age-adaptive-analytics-intermediate .progress-bar {
          height: 8px;
          border-radius: 4px;
          background: #E5E7EB;
          overflow: hidden;
        }

        .age-adaptive-analytics-intermediate .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
          border-radius: 4px;
          transition: width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* SECONDARY (14-16): Professional Charts */
        .age-adaptive-analytics-secondary .metric-card {
          border: 1px solid var(--color-primary);
          border-radius: calc(var(--border-radius) * 0.9);
          padding: 14px;
          background: white;
          box-shadow: 0 2px 6px rgba(15, 118, 110, 0.06);
        }

        .age-adaptive-analytics-secondary .metric-title {
          font-size: var(--font-size-md);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .age-adaptive-analytics-secondary .chart-container {
          height: var(--chart-height);
          margin: 10px 0;
        }

        .age-adaptive-analytics-secondary .chart-label {
          font-size: calc(var(--font-size-md) * 0.9);
          font-weight: 500;
          color: #6B7280;
        }

        .age-adaptive-analytics-secondary .metric-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border-radius: calc(var(--border-radius) * 0.85);
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          color: white;
          font-size: calc(var(--font-size-md) * 1.1);
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(15, 118, 110, 0.08);
        }

        .age-adaptive-analytics-secondary .metric-icon {
          font-size: calc(var(--icon-size) * 0.9);
          margin-bottom: 4px;
        }

        .age-adaptive-analytics-secondary .progress-bar {
          height: 6px;
          border-radius: 3px;
          background: #E5E7EB;
          overflow: hidden;
        }

        .age-adaptive-analytics-secondary .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
          border-radius: 3px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Shared Styles */
        .age-adaptive-analytics-primary .empty-state,
        .age-adaptive-analytics-intermediate .empty-state,
        .age-adaptive-analytics-secondary .empty-state {
          text-align: center;
          padding: 40px 20px;
          border-radius: var(--border-radius);
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          background-size: 200% 200%;
          color: white;
        }

        .age-adaptive-analytics-primary .empty-icon {
          font-size: 80px;
          margin-bottom: 16px;
          animation: bounce-playful 2s infinite;
        }

        .age-adaptive-analytics-intermediate .empty-icon {
          font-size: 60px;
          margin-bottom: 12px;
        }

        .age-adaptive-analytics-secondary .empty-icon {
          font-size: 48px;
          margin-bottom: 8px;
        }

        /* Chart Responsiveness */
        .age-adaptive-analytics-primary .recharts-wrapper {
          width: 100% !important;
        }

        .age-adaptive-analytics-intermediate .recharts-wrapper {
          width: 100% !important;
        }

        .age-adaptive-analytics-secondary .recharts-wrapper {
          width: 100% !important;
        }

        /* Dark Mode Adjustments */
        .age-adaptive-analytics-primary.dark .metric-card {
          background: #1F2937;
          border-color: #FF6B6B;
        }

        .age-adaptive-analytics-intermediate.dark .metric-card {
          background: #1F2937;
          border-color: #0088CC;
        }

        .age-adaptive-analytics-secondary.dark .metric-card {
          background: #111827;
          border-color: #0F766E;
        }

        /* Accessibility: High Contrast */
        @media (prefers-contrast: more) {
          .age-adaptive-analytics-primary .metric-card {
            border-width: 4px;
          }

          .age-adaptive-analytics-intermediate .metric-card {
            border-width: 3px;
          }

          .age-adaptive-analytics-secondary .metric-card {
            border-width: 2px;
          }
        }

        /* Accessibility: Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .age-adaptive-analytics-primary .progress-fill,
          .age-adaptive-analytics-intermediate .progress-fill,
          .age-adaptive-analytics-secondary .progress-fill,
          .age-adaptive-analytics-primary .empty-icon {
            animation: none;
          }
        }

        /* Responsive: Tablet */
        @media (max-width: 768px) {
          .age-adaptive-analytics-primary .metric-card {
            padding: 16px;
          }

          .age-adaptive-analytics-intermediate .metric-card {
            padding: 14px;
          }

          .age-adaptive-analytics-secondary .metric-card {
            padding: 12px;
          }
        }

        /* Responsive: Mobile */
        @media (max-width: 480px) {
          .age-adaptive-analytics-primary .chart-container {
            height: 180px;
          }

          .age-adaptive-analytics-intermediate .chart-container {
            height: 140px;
          }

          .age-adaptive-analytics-secondary .chart-container {
            height: 120px;
          }

          .age-adaptive-analytics-primary .metric-stat {
            padding: 12px;
            font-size: calc(var(--font-size-lg) * 0.9);
          }

          .age-adaptive-analytics-intermediate .metric-stat {
            padding: 10px;
            font-size: var(--font-size-md);
          }

          .age-adaptive-analytics-secondary .metric-stat {
            padding: 8px;
            font-size: calc(var(--font-size-md) * 0.9);
          }
        }

        /* Animations */
        @keyframes bounce-playful {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }
      `}</style>

      <SmartBoardAnalytics />
    </div>
  );
});

AgeAdaptiveAnalytics.displayName = "AgeAdaptiveAnalytics";

export default AgeAdaptiveAnalytics;
