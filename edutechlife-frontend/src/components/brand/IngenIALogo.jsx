import { memo, useId } from "react";
import { WORDMARK, ICON } from "./ingeniaLogoData";

// ==========================================
// IngenIA logo (approved Sept 2026): navy «Ingen» + gradient «IA»,
// with a spark as the tittle of the I of IA. Pure SVG, no font needed.
// ==========================================

const NAVY = "#0B1D3A";
const AMBER = "#FFB547";
const GRAD_LIGHT = ["#00C2E0", "#4361EE", "#7B2FF7"];
const GRAD_DARK = ["#6FF0FF", "#7C9BFF", "#B08BFF"];

// tone → [«Ingen» fill, gradient stops or null (mono), byline color]
const TONES = {
  light: [NAVY, GRAD_LIGHT, "#3E5468"],
  dark: ["#FFFFFF", GRAD_DARK, "#CFE3F2"],
  "mono-navy": [NAVY, null, NAVY],
  "mono-white": ["#FFFFFF", null, "#FFFFFF"],
};

const Stops = ({ colors }) =>
  colors.map((c, i) => (
    <stop key={c} offset={i / (colors.length - 1)} stopColor={c} />
  ));

/**
 * @param {"full"|"wordmark"|"icon"} variant  full = wordmark + «BY EDUTECHLIFE»; icon = «IA» + spark on a navy tile
 * @param {"light"|"dark"|"mono-navy"|"mono-white"} tone  light = for light backgrounds, dark = for dark ones (ignored by icon)
 * @param {number} height  rendered height in px (width follows the viewBox)
 * @param {string} title   accessible label; pass "" when the brand name is already read nearby
 */
const IngenIALogo = memo(
  ({
    variant = "full",
    tone = "light",
    height = 40,
    title = "IngenIA by Edutechlife",
    className = "",
  }) => {
    const u = `ingl${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
    const a11y = title
      ? { role: "img", "aria-label": title }
      : { "aria-hidden": true, focusable: "false" };

    if (variant === "icon") {
      const [x1, x2] = ICON.iaX;
      const [sx1, sy1, sx2, sy2] = ICON.sparkBox;
      return (
        <svg
          viewBox={`0 0 ${ICON.size} ${ICON.size}`}
          width={height}
          height={height}
          className={className}
          {...a11y}
        >
          <defs>
            <linearGradient
              id={`${u}ia`}
              gradientUnits="userSpaceOnUse"
              x1={x1}
              y1="0"
              x2={x2}
              y2="0"
            >
              <Stops colors={GRAD_DARK} />
            </linearGradient>
            <linearGradient
              id={`${u}sp`}
              gradientUnits="userSpaceOnUse"
              x1={sx1}
              y1={sy1}
              x2={sx2}
              y2={sy2}
            >
              <Stops colors={GRAD_DARK.slice(0, 2)} />
            </linearGradient>
          </defs>
          <rect
            width={ICON.size}
            height={ICON.size}
            rx={ICON.size * 0.23}
            fill={NAVY}
          />
          <path d={ICON.ia} fill={`url(#${u}ia)`} />
          <path d={ICON.spark} fill={`url(#${u}sp)`} />
          <path d={ICON.amber} fill={AMBER} />
        </svg>
      );
    }

    const [solid, grad, byline] = TONES[tone] || TONES.light;
    const full = variant === "full";
    const vbH = full ? WORDMARK.heightFull : WORDMARK.heightWord;
    const [x1, x2] = WORDMARK.iaX;
    const [sx1, sy1, sx2, sy2] = WORDMARK.sparkBox;

    return (
      <svg
        viewBox={`0 0 ${WORDMARK.width} ${vbH}`}
        height={height}
        width={Math.round((height * WORDMARK.width) / vbH)}
        className={className}
        {...a11y}
      >
        {grad && (
          <defs>
            <linearGradient
              id={`${u}ia`}
              gradientUnits="userSpaceOnUse"
              x1={x1}
              y1="0"
              x2={x2}
              y2="0"
            >
              <Stops colors={grad} />
            </linearGradient>
            <linearGradient
              id={`${u}sp`}
              gradientUnits="userSpaceOnUse"
              x1={sx1}
              y1={sy1}
              x2={sx2}
              y2={sy2}
            >
              <Stops colors={grad.slice(0, 2)} />
            </linearGradient>
          </defs>
        )}
        <path d={WORDMARK.ingen} fill={solid} />
        <path d={WORDMARK.ia} fill={grad ? `url(#${u}ia)` : solid} />
        <path d={WORDMARK.spark} fill={grad ? `url(#${u}sp)` : solid} />
        {grad && <path d={WORDMARK.amber} fill={AMBER} />}
        {full && <path d={WORDMARK.byline} fill={byline} opacity={0.78} />}
      </svg>
    );
  },
);

IngenIALogo.displayName = "IngenIALogo";

export default IngenIALogo;
