import { memo, useId } from "react";
import "./daniCharacter.css";

// ==========================================
// Dani — IngenIA's AI tutor (brand character v3)
// Sleek companion for ages 6–16: LED eyes, voice-equalizer mouth, headset.
// Pure SVG + CSS animations (blink, talking equalizer, thinking glance).
// ==========================================

const EQ_BARS = [0, 1, 2, 3, 4, 5, 6];

/**
 * @param {number}  size      rendered width in px (height follows the viewBox)
 * @param {boolean} body      include the floating torso (default: head only)
 * @param {"happy"|"thinking"|"celebrating"} mood
 * @param {boolean} talking   animate the equalizer mouth (e.g. while TTS plays)
 * @param {boolean} animated  enable idle animations (blink, glow)
 * @param {string}  title     accessible label; omit for decorative use
 */
const DaniCharacter = memo(
  ({
    size = 48,
    body = false,
    mood = "happy",
    talking = false,
    animated = true,
    title,
    className = "",
  }) => {
    const u = `dani${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
    const vb = body ? "20 60 560 560" : "40 70 520 400";
    const height = body ? size : Math.round((size * 400) / 520);

    const eyes =
      mood === "celebrating" ? (
        <>
          <path
            d="M200 250 Q235 214 270 250"
            stroke={`url(#${u}led)`}
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M330 250 Q365 214 400 250"
            stroke={`url(#${u}led)`}
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <g className="dani-eyes">
          <rect
            x="196"
            y="227"
            width="78"
            height="22"
            rx="11"
            fill={`url(#${u}led)`}
            transform="rotate(-4 235 238)"
          />
          <rect
            x="326"
            y="227"
            width="78"
            height="22"
            rx="11"
            fill={`url(#${u}led)`}
            transform="rotate(4 365 238)"
          />
        </g>
      );

    const mouth = talking ? (
      <g className="dani-eq">
        {EQ_BARS.map((i) => {
          const h = 16 + 30 * (1 - Math.abs(i - 3) / 4);
          return (
            <rect
              key={i}
              className="dani-eq-bar"
              style={{
                animationDelay: `${(i % 4) * 0.11 + (i > 3 ? 0.05 : 0)}s`,
              }}
              x={258 + i * 14}
              y={312 - h / 2}
              width="8"
              height={h}
              rx="4"
              fill={`url(#${u}led)`}
            />
          );
        })}
      </g>
    ) : (
      <path
        d="M270 306 Q300 322 330 306"
        stroke={`url(#${u}led)`}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    );

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={height}
        viewBox={vb}
        className={`dani-character ${animated ? "is-animated" : ""} ${talking ? "is-talking" : ""} ${mood === "thinking" ? "is-thinking" : ""} ${className}`}
        role={title ? "img" : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : true}
        focusable="false"
      >
        <defs>
          <linearGradient id={`${u}shell`} x1=".15" y1="0" x2=".85" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset=".55" stopColor="#EDF6FA" />
            <stop offset="1" stopColor="#BFD9E6" />
          </linearGradient>
          <radialGradient id={`${u}shade`} cx=".3" cy=".2" r="1">
            <stop offset=".5" stopColor="#0B2A55" stopOpacity="0" />
            <stop offset="1" stopColor="#0B2A55" stopOpacity=".25" />
          </radialGradient>
          <linearGradient id={`${u}visor`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#132F5E" />
            <stop offset="1" stopColor="#050E22" />
          </linearGradient>
          <linearGradient id={`${u}vrim`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#00C2E0" />
            <stop offset=".5" stopColor="#4361EE" />
            <stop offset="1" stopColor="#7B2FF7" />
          </linearGradient>
          <linearGradient id={`${u}led`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9FF8FF" />
            <stop offset="1" stopColor="#2FD9F5" />
          </linearGradient>
          <linearGradient id={`${u}head`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1B2B4F" />
            <stop offset="1" stopColor="#0B1630" />
          </linearGradient>
          <linearGradient id={`${u}cup`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2B3F72" />
            <stop offset="1" stopColor="#0E1A38" />
          </linearGradient>
          <filter id={`${u}b8`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id={`${u}b16`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>

        {body && (
          <g>
            <ellipse
              cx="300"
              cy="586"
              rx="120"
              ry="14"
              fill="#00C2E0"
              opacity=".4"
              filter={`url(#${u}b8)`}
            />
            <rect
              x="262"
              y="410"
              width="76"
              height="46"
              rx="14"
              fill={`url(#${u}head)`}
            />
            <path
              d="M190 456 Q300 424 410 456 Q432 520 404 552 Q300 584 196 552 Q168 520 190 456 Z"
              fill={`url(#${u}shell)`}
              stroke="#BDEFF8"
              strokeWidth="3"
            />
            <path
              d="M190 456 Q300 424 410 456 Q432 520 404 552 Q300 584 196 552 Q168 520 190 456 Z"
              fill={`url(#${u}shade)`}
            />
            <path
              d="M232 470 Q300 452 368 470 Q378 508 360 530 Q300 548 240 530 Q222 508 232 470 Z"
              fill={`url(#${u}visor)`}
            />
            <path
              d="M300 482 L306 498 L322 504 L306 510 L300 526 L294 510 L278 504 L294 498 Z"
              fill="#6FF0FF"
            />
          </g>
        )}

        <g>
          <rect
            x="112"
            y="118"
            width="376"
            height="318"
            rx="120"
            fill="#020A1C"
            opacity=".35"
            filter={`url(#${u}b16)`}
          />
          <path
            d="M122 250 Q124 96 300 92 Q476 96 478 250"
            stroke={`url(#${u}head)`}
            strokeWidth="22"
            fill="none"
            strokeLinecap="round"
          />
          <rect
            x="112"
            y="104"
            width="376"
            height="318"
            rx="120"
            fill={`url(#${u}shell)`}
            stroke="#BDEFF8"
            strokeWidth="3"
          />
          <rect
            x="112"
            y="104"
            width="376"
            height="318"
            rx="120"
            fill={`url(#${u}shade)`}
          />
          <path
            d="M160 140 Q230 112 320 114"
            stroke="#fff"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            opacity=".95"
          />
          <rect
            className="dani-strip"
            x="262"
            y="112"
            width="76"
            height="8"
            rx="4"
            fill="#6FF0FF"
          />
          <rect
            x="142"
            y="164"
            width="316"
            height="206"
            rx="86"
            fill={`url(#${u}visor)`}
          />
          <rect
            x="142"
            y="164"
            width="316"
            height="206"
            rx="86"
            fill="none"
            stroke={`url(#${u}vrim)`}
            strokeWidth="6"
          />
          <path
            d="M176 196 Q220 176 282 176"
            stroke="#fff"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            opacity=".18"
          />
          <g className="dani-face">
            <g filter={`url(#${u}b8)`} opacity=".7">
              {eyes}
              {mouth}
            </g>
            {eyes}
            {mouth}
          </g>
          <rect
            x="84"
            y="196"
            width="62"
            height="132"
            rx="24"
            fill={`url(#${u}cup)`}
          />
          <rect
            x="454"
            y="196"
            width="62"
            height="132"
            rx="24"
            fill={`url(#${u}cup)`}
          />
          <rect
            x="94"
            y="226"
            width="8"
            height="72"
            rx="4"
            fill={`url(#${u}vrim)`}
          />
          <rect
            x="498"
            y="226"
            width="8"
            height="72"
            rx="4"
            fill={`url(#${u}vrim)`}
          />
          <path
            d="M112 318 Q126 384 214 388"
            stroke={`url(#${u}head)`}
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
          <rect
            x="208"
            y="378"
            width="30"
            height="20"
            rx="10"
            fill={`url(#${u}cup)`}
          />
          <circle className="dani-mic" cx="230" cy="388" r="5" fill="#6FF0FF" />
        </g>
      </svg>
    );
  },
);

DaniCharacter.displayName = "DaniCharacter";

export default DaniCharacter;
