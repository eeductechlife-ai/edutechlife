import { memo, forwardRef, useId } from "react";
import {
  FONT,
  THEMES,
  mix,
  wrap,
  fit,
  paletteColor,
  TextLines,
  Defs,
  Paper,
  Footer,
  gradUrl,
  shadowUrl,
} from "./imageKit";

const W = 540;
const PAD = 24;
const FORMAT_LABEL = {
  pasos: "INFOGRAFÍA",
  datos: "EN CIFRAS",
  comparacion: "COMPARACIÓN",
};

function headerLayout(data) {
  const longTitle = wrap(data.titulo, 20).length > 2;
  const titleSize = longTitle ? 30 : 38;
  const titleStep = longTitle ? 34 : 42;
  const titleLines = longTitle
    ? fit(data.titulo, 26, 4)
    : wrap(data.titulo, 20);
  const subLines = fit(data.subtitulo, 40, 3);
  const h = 104 + titleLines.length * titleStep + subLines.length * 27;
  return { titleSize, titleStep, titleLines, subLines, h };
}

function Header({ id, main, hd, label }) {
  const { titleSize, titleStep, titleLines, subLines, h } = hd;
  return (
    <g>
      <path
        d={`M 0 32 a 32 32 0 0 1 32 -32 h ${W - 64} a 32 32 0 0 1 32 32 v ${h - 32} h ${-W} z`}
        fill={gradUrl(id, main)}
      />
      <circle cx={W - 40} cy="30" r="100" fill="#FFFFFF" opacity="0.12" />
      <circle cx={W - 120} cy={h - 10} r="46" fill="#FFFFFF" opacity="0.08" />
      <rect
        x={PAD}
        y="30"
        width="170"
        height="32"
        rx="16"
        fill="#FFFFFF"
        opacity="0.22"
      />
      <text
        x={PAD + 85}
        y="52"
        fontSize="15"
        fontWeight="900"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="2.5"
        fontFamily={FONT}
      >
        {label}
      </text>
      <TextLines
        lines={titleLines}
        x={PAD}
        y={104}
        size={titleSize}
        weight={900}
        fill="#FFFFFF"
        anchor="start"
        gap={titleStep / titleSize}
      />
      <TextLines
        lines={subLines}
        x={PAD}
        y={104 + titleLines.length * titleStep + 6}
        size={21}
        weight={700}
        fill="#FFFFFF"
        anchor="start"
        gap={27 / 21}
      />
    </g>
  );
}

function factLayout(data) {
  const lines = data.dato ? fit(data.dato, 34, 6) : [];
  return { lines, h: lines.length ? 86 + lines.length * 27 : 0 };
}

function FactBox({ id, y, fact, theme }) {
  if (!fact.h) return null;
  const bg = theme.id === "noche" ? "#3A2A12" : "#FFF7E6";
  const ink = theme.id === "noche" ? "#FDE7C4" : "#7C2D12";
  return (
    <g>
      <g filter={shadowUrl(id)}>
        <rect
          x={PAD}
          y={y}
          width={W - PAD * 2}
          height={fact.h}
          rx="22"
          fill={bg}
        />
      </g>
      <rect
        x={PAD}
        y={y}
        width={W - PAD * 2}
        height={fact.h}
        rx="22"
        fill="none"
        stroke="#FB8500"
        strokeWidth="3"
        strokeDasharray="10 8"
      />
      <circle cx={PAD + 40} cy={y + 38} r="22" fill="#FB8500" />
      <text
        x={PAD + 40}
        y={y + 47}
        fontSize="24"
        textAnchor="middle"
        fontFamily={FONT}
      >
        💡
      </text>
      <text
        x={PAD + 74}
        y={y + 46}
        fontSize="22"
        fontWeight="900"
        fill={theme.id === "noche" ? "#FFB703" : "#C2410C"}
        fontFamily={FONT}
      >
        ¿Sabías que…?
      </text>
      <TextLines
        lines={fact.lines}
        x={PAD + 24}
        y={y + 90}
        size={21}
        weight={700}
        fill={ink}
        anchor="start"
        gap={27 / 21}
      />
    </g>
  );
}

// Numbered steps joined by a dotted timeline (processes, how-it-works).
function StepsBody({ id, data, theme, main, top }) {
  let y = top;
  const timelineX = PAD + 46;
  const blocks = data.bloques.map((b, i) => {
    const c = paletteColor(theme, i, main);
    const titleL = fit(b.titulo, 23, 2);
    const textL = fit(b.texto, 31, 6);
    const h = Math.max(112, 44 + titleL.length * 30 + textL.length * 27);
    const block = { b, i, y, h, titleL, textL, c };
    y += h + 20;
    return block;
  });
  const el = (
    <g>
      {blocks.length > 1 && (
        <line
          x1={timelineX}
          y1={blocks[0].y + 50}
          x2={timelineX}
          y2={blocks[blocks.length - 1].y + 50}
          stroke={mix(theme.muted, theme.paper, 0.6)}
          strokeWidth="4"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
      )}
      {blocks.map(({ b, i, y: by, h, titleL, textL, c }) => (
        <g key={i}>
          <g filter={shadowUrl(id)}>
            <rect
              x={PAD}
              y={by}
              width={W - PAD * 2}
              height={h}
              rx="22"
              fill={theme.soft(c)}
            />
          </g>
          <rect
            x={PAD}
            y={by}
            width={W - PAD * 2}
            height={h}
            rx="22"
            fill="none"
            stroke={mix(c, theme.card, 0.4)}
            strokeWidth="2"
          />
          <circle
            cx={timelineX}
            cy={by + 50}
            r="34"
            fill={theme.card}
            stroke={c}
            strokeWidth="4"
          />
          <text
            x={timelineX}
            y={by + 62}
            fontSize="32"
            textAnchor="middle"
            fontFamily={FONT}
          >
            {b.emoji}
          </text>
          <circle
            cx={timelineX - 24}
            cy={by + 22}
            r="14"
            fill={c}
            stroke={theme.card}
            strokeWidth="3"
          />
          <text
            x={timelineX - 24}
            y={by + 28}
            fontSize="15"
            fontWeight="900"
            fill="#FFFFFF"
            textAnchor="middle"
            fontFamily={FONT}
          >
            {i + 1}
          </text>
          <TextLines
            lines={titleL}
            x={PAD + 100}
            y={by + 40}
            size={25}
            weight={900}
            fill={c}
            anchor="start"
            gap={30 / 25}
          />
          <TextLines
            lines={textL}
            x={PAD + 100}
            y={by + 40 + titleL.length * 30 + 4}
            size={21}
            weight={600}
            fill={theme.ink}
            anchor="start"
            gap={27 / 21}
          />
        </g>
      ))}
    </g>
  );
  return { el, bottom: y, colors: blocks.map((b) => b.c) };
}

// Big-number cards (statistics, quantities, dates).
function DataBody({ id, data, theme, main, top }) {
  let y = top;
  const NUM_W = 132;
  const blocks = data.bloques.map((b, i) => {
    const c = paletteColor(theme, i, main);
    const cifra = b.cifra || String(i + 1);
    const numLines = fit(cifra, 7, 2);
    const numSize = numLines.length > 1 || cifra.length > 5 ? 28 : 38;
    const titleL = fit(b.titulo, 20, 2);
    const textL = fit(b.texto, 27, 6);
    const h = Math.max(124, 40 + titleL.length * 30 + textL.length * 27);
    const block = { b, i, y, h, titleL, textL, c, numLines, numSize };
    y += h + 18;
    return block;
  });
  const el = (
    <g>
      {blocks.map(({ b, i, y: by, h, titleL, textL, c, numLines, numSize }) => (
        <g key={i}>
          <g filter={shadowUrl(id)}>
            <rect
              x={PAD}
              y={by}
              width={W - PAD * 2}
              height={h}
              rx="22"
              fill={theme.card}
            />
          </g>
          <path
            d={`M ${PAD} ${by + 22} a 22 22 0 0 1 22 -22 h ${NUM_W - 22} v ${h} h ${-(NUM_W - 22)} a 22 22 0 0 1 -22 -22 z`}
            fill={gradUrl(id, c)}
          />
          <TextLines
            lines={numLines}
            x={PAD + NUM_W / 2}
            y={
              by +
              h / 2 -
              ((numLines.length - 1) * numSize * 1.05) / 2 +
              numSize / 3
            }
            size={numSize}
            weight={900}
            fill="#FFFFFF"
            gap={1.05}
          />
          <text
            x={W - PAD - 24}
            y={by + 38}
            fontSize="26"
            textAnchor="middle"
            fontFamily={FONT}
          >
            {b.emoji}
          </text>
          <TextLines
            lines={titleL}
            x={PAD + NUM_W + 18}
            y={by + 38}
            size={24}
            weight={900}
            fill={c}
            anchor="start"
            gap={30 / 24}
          />
          <TextLines
            lines={textL}
            x={PAD + NUM_W + 18}
            y={by + 38 + titleL.length * 30 + 4}
            size={21}
            weight={600}
            fill={theme.ink}
            anchor="start"
            gap={27 / 21}
          />
          <rect
            x={PAD}
            y={by}
            width={W - PAD * 2}
            height={h}
            rx="22"
            fill="none"
            stroke={mix(c, theme.card, 0.45)}
            strokeWidth="2"
          />
        </g>
      ))}
    </g>
  );
  return { el, bottom: y, colors: blocks.map((b) => b.c) };
}

// Two columns side by side with a "VS" badge and a shared-traits box.
function CompareBody({ id, data, theme, main, top }) {
  const { izquierda, derecha, semejanzas } = data.comparacion;
  const colW = (W - PAD * 2 - 18) / 2;
  const sides = [izquierda, derecha].map((s, i) => {
    const c = paletteColor(theme, i * 3, main);
    const titleL = fit(s.titulo, 13, 2);
    const pts = s.puntos.map((p) => fit(p, 19, 4));
    const headH = 64 + titleL.length * 26;
    const listH =
      pts.reduce((h, l) => h + l.length * 24, 0) +
      10 * Math.max(0, pts.length - 1);
    return { s, c, titleL, pts, headH, h: headH + 26 + listH + 20 };
  });
  const colH = Math.max(sides[0].h, sides[1].h);
  const simLines = (semejanzas || []).map((p) => fit(p, 34, 3));
  const simH = simLines.length
    ? 64 +
      simLines.reduce((h, l) => h + l.length * 25, 0) +
      8 * (simLines.length - 1)
    : 0;
  const simY = top + colH + 22;
  const sameColor = paletteColor(theme, 2, main);

  const el = (
    <g>
      {sides.map((sd, i) => {
        const x = PAD + i * (colW + 18);
        let py = top + sd.headH + 34;
        return (
          <g key={i}>
            <g filter={shadowUrl(id)}>
              <rect
                x={x}
                y={top}
                width={colW}
                height={colH}
                rx="22"
                fill={theme.card}
              />
            </g>
            <path
              d={`M ${x} ${top + 22} a 22 22 0 0 1 22 -22 h ${colW - 44} a 22 22 0 0 1 22 22 v ${sd.headH - 22} h ${-colW} z`}
              fill={gradUrl(id, sd.c)}
            />
            <text
              x={x + colW / 2}
              y={top + 44}
              fontSize="32"
              textAnchor="middle"
              fontFamily={FONT}
            >
              {sd.s.emoji}
            </text>
            <TextLines
              lines={sd.titleL}
              x={x + colW / 2}
              y={top + 78}
              size={22}
              weight={900}
              fill="#FFFFFF"
              gap={26 / 22}
            />
            {sd.pts.map((lines, j) => {
              const ty = py;
              py += lines.length * 24 + 10;
              return (
                <g key={j}>
                  <circle cx={x + 20} cy={ty - 7} r="5" fill={sd.c} />
                  <TextLines
                    lines={lines}
                    x={x + 32}
                    y={ty}
                    size={19}
                    weight={600}
                    fill={theme.ink}
                    anchor="start"
                    gap={24 / 19}
                  />
                </g>
              );
            })}
            <rect
              x={x}
              y={top}
              width={colW}
              height={colH}
              rx="22"
              fill="none"
              stroke={mix(sd.c, theme.card, 0.45)}
              strokeWidth="2"
            />
          </g>
        );
      })}
      <circle
        cx={W / 2}
        cy={top + sides[0].headH / 2 + 4}
        r="24"
        fill={theme.card}
        stroke={mix(theme.muted, theme.card, 0.5)}
        strokeWidth="3"
      />
      <text
        x={W / 2}
        y={top + sides[0].headH / 2 + 11}
        fontSize="18"
        fontWeight="900"
        fill={theme.ink}
        textAnchor="middle"
        fontFamily={FONT}
      >
        VS
      </text>
      {simH > 0 && (
        <g>
          <g filter={shadowUrl(id)}>
            <rect
              x={PAD}
              y={simY}
              width={W - PAD * 2}
              height={simH}
              rx="22"
              fill={theme.soft(sameColor)}
            />
          </g>
          <text
            x={PAD + 22}
            y={simY + 40}
            fontSize="22"
            fontWeight="900"
            fill={sameColor}
            fontFamily={FONT}
          >
            🤝 En qué se parecen
          </text>
          {(() => {
            let sy = simY + 74;
            return simLines.map((lines, j) => {
              const ty = sy;
              sy += lines.length * 25 + 8;
              return (
                <g key={j}>
                  <circle cx={PAD + 28} cy={ty - 7} r="5" fill={sameColor} />
                  <TextLines
                    lines={lines}
                    x={PAD + 42}
                    y={ty}
                    size={20}
                    weight={600}
                    fill={theme.ink}
                    anchor="start"
                    gap={25 / 20}
                  />
                </g>
              );
            });
          })()}
        </g>
      )}
    </g>
  );
  return {
    el,
    bottom: simH ? simY + simH + 20 : top + colH + 20,
    colors: [...sides.map((s) => s.c), sameColor],
  };
}

const BODIES = { pasos: StepsBody, datos: DataBody, comparacion: CompareBody };

function conclusionLayout(conclusion) {
  if (!conclusion) return { lines: [], h: 0 };
  const lines = fit(conclusion, 40, 3);
  return { lines, h: lines.length ? 20 + lines.length * 24 + 20 : 0 };
}

function ConclusionBanner({ main, theme, y, layout }) {
  if (!layout.h) return null;
  return (
    <g>
      <rect
        x={PAD}
        y={y}
        width={W - PAD * 2}
        height={layout.h}
        rx="20"
        fill={mix(main, theme.paper, 0.88)}
        stroke={mix(main, theme.paper, 0.6)}
        strokeWidth="2"
      />
      <text
        x={PAD + 18}
        y={y + 22}
        fontSize="17"
        fontWeight="900"
        fill={main}
        fontFamily={FONT}
      >
        🎯 Lo más importante:
      </text>
      <TextLines
        lines={layout.lines}
        x={PAD + 18}
        y={y + 44}
        size={18}
        weight={700}
        fill={theme.ink}
        anchor="start"
        gap={24 / 18}
      />
    </g>
  );
}

export const InfographicImage = memo(
  forwardRef(function InfographicImage(
    { data, color, themeId = "colorido" },
    ref,
  ) {
    const id = useId().replace(/:/g, "");
    const theme = THEMES[themeId] || THEMES.colorido;
    const main = theme.main(color);
    const formato =
      data.formato === "comparacion" && !data.comparacion
        ? "pasos"
        : BODIES[data.formato]
          ? data.formato
          : "pasos";
    const hd = headerLayout(data);
    const body = BODIES[formato]({ id, data, theme, main, top: hd.h + 30 });
    const fact = factLayout(data);
    const factY = body.bottom + 6;
    const concl = conclusionLayout(data.conclusion);
    const conclY = factY + fact.h + (fact.h ? 28 : 6);
    const H = conclY + concl.h + (concl.h ? 28 : 24);

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Infografía: ${data.titulo}`}
        className="w-full h-auto"
      >
        <Defs
          id={id}
          colors={[main, ...body.colors, "#FB8500"]}
          theme={theme}
        />
        <Paper id={id} W={W} H={H} theme={theme} />
        <Header id={id} main={main} hd={hd} label={FORMAT_LABEL[formato]} />
        {body.el}
        <FactBox id={id} y={factY} fact={fact} theme={theme} />
        <ConclusionBanner main={main} theme={theme} y={conclY} layout={concl} />
        <Footer W={W} y={H - 16} theme={theme} />
      </svg>
    );
  }),
);
