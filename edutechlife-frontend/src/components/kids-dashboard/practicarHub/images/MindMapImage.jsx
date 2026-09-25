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
  radialUrl,
  shadowUrl,
} from "./imageKit";

const STEP = 24;
const GAP = 8;

const detailsHeight = (blocks) =>
  blocks.reduce((h, l) => h + l.length * STEP, 0) +
  GAP * Math.max(0, blocks.length - 1);

function makeNode(r, i, main, theme, ideaChars, detailChars) {
  const c = paletteColor(theme, i, main);
  const ideaLines = fit(r.idea, ideaChars, 3);
  const blocks = r.detalles.map((d) => fit(d, detailChars, 3));
  const headH = Math.max(64, 26 + ideaLines.length * 27);
  const h = headH + 24 + detailsHeight(blocks);
  return { c, ideaLines, blocks, headH, h, emoji: r.emoji };
}

function DetailList({ blocks, x, y, color, theme }) {
  let cy = y;
  return blocks.map((lines, i) => {
    const top = cy;
    cy += lines.length * STEP + GAP;
    return (
      <g key={i}>
        <circle cx={x + 5} cy={top - 7} r="5" fill={color} />
        <TextLines
          lines={lines}
          x={x + 18}
          y={top}
          size={19}
          weight={600}
          fill={theme.muted}
          anchor="start"
          gap={STEP / 19}
        />
      </g>
    );
  });
}

// Branch card: gradient header with an emoji badge, dotted detail list below.
function BranchCard({ id, x, y, w, node, theme }) {
  const { c, ideaLines, blocks, headH, h, emoji } = node;
  return (
    <g filter={shadowUrl(id)}>
      <rect x={x} y={y} width={w} height={h} rx="22" fill={theme.card} />
      <path
        d={`M ${x} ${y + 22} a 22 22 0 0 1 22 -22 h ${w - 44} a 22 22 0 0 1 22 22 v ${headH - 22} h ${-w} z`}
        fill={gradUrl(id, c)}
      />
      <circle
        cx={x + 34}
        cy={y + headH / 2}
        r="22"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <text
        x={x + 34}
        y={y + headH / 2 + 9}
        fontSize="25"
        textAnchor="middle"
        fontFamily={FONT}
      >
        {emoji}
      </text>
      <TextLines
        lines={ideaLines}
        x={x + 66}
        y={y + headH / 2 - ((ideaLines.length - 1) * 27) / 2 + 8}
        size={23}
        weight={900}
        fill="#FFFFFF"
        anchor="start"
        gap={27 / 23}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="22"
        fill="none"
        stroke={mix(c, theme.card, 0.45)}
        strokeWidth="2"
      />
      <DetailList
        blocks={blocks}
        x={x + 18}
        y={y + headH + 30}
        color={c}
        theme={theme}
      />
    </g>
  );
}

// Phone layout: topic on top, one full-width branch per idea hanging from a
// spine, so the text stays readable when the image is ~300 px wide.
function MindMapTree({ data, main, theme, svgRef }) {
  const id = useId().replace(/:/g, "");
  const W = 540;
  const PAD = 24;
  const centerLines = fit(data.centro || "Tema", 20, 3);
  const headH = 66 + centerLines.length * 38;
  let y = PAD + headH + 34;
  const nodes = data.ramas.map((r, i) => {
    const n = makeNode(r, i, main, theme, 21, 34);
    const node = { ...n, y };
    y += n.h + 22;
    return node;
  });
  const H = y + 30;
  const spineX = PAD + 18;
  const cardX = PAD + 46;
  const cardW = W - cardX - PAD;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Mapa mental: ${data.centro}`}
      className="w-full h-auto"
    >
      <Defs id={id} colors={[main, ...nodes.map((n) => n.c)]} theme={theme} />
      <Paper id={id} W={W} H={H} theme={theme} />
      <g filter={shadowUrl(id)}>
        <rect
          x={PAD}
          y={PAD}
          width={W - PAD * 2}
          height={headH}
          rx="26"
          fill={gradUrl(id, main)}
        />
      </g>
      <circle
        cx={W - PAD - 40}
        cy={PAD + 26}
        r="54"
        fill="#FFFFFF"
        opacity="0.12"
      />
      <text
        x={W / 2}
        y={PAD + 36}
        fontSize="15"
        fontWeight="900"
        fill="#FFFFFF"
        opacity="0.85"
        textAnchor="middle"
        letterSpacing="3"
        fontFamily={FONT}
      >
        🧠 MAPA MENTAL
      </text>
      <TextLines
        lines={centerLines}
        x={W / 2}
        y={PAD + 78}
        size={33}
        weight={900}
        fill="#FFFFFF"
        gap={1.15}
      />
      <line
        x1={spineX}
        y1={PAD + headH}
        x2={spineX}
        y2={nodes.length ? nodes[nodes.length - 1].y + 32 : PAD + headH}
        stroke={mix(main, theme.paper, 0.3)}
        strokeWidth="8"
        strokeLinecap="round"
      />
      {nodes.map((nd, i) => (
        <g key={i}>
          <path
            d={`M ${spineX} ${nd.y + 32} H ${cardX}`}
            stroke={nd.c}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle
            cx={spineX}
            cy={nd.y + 32}
            r="11"
            fill={nd.c}
            stroke={theme.paper}
            strokeWidth="4"
          />
          <BranchCard
            id={id}
            x={cardX}
            y={nd.y}
            w={cardW}
            node={nd}
            theme={theme}
          />
        </g>
      ))}
      <Footer W={W} y={H - 12} theme={theme} />
    </svg>
  );
}

// Wide layout: topic in the centre, branches alternating left and right in
// two stacked columns so cards never overlap, whatever their count.
function MindMapSides({ data, main, theme, svgRef }) {
  const id = useId().replace(/:/g, "");
  const W = 1040;
  const PAD = 26;
  const BOX_W = 320;
  const COL_GAP = 24;
  const R = 132;
  const cx = W / 2;

  const cols = { left: [], right: [] };
  data.ramas.forEach((r, i) => {
    (i % 2 === 0 ? cols.right : cols.left).push(
      makeNode(r, i, main, theme, 19, 30),
    );
  });
  const colH = (list) =>
    list.reduce((sum, n) => sum + n.h, 0) +
    COL_GAP * Math.max(0, list.length - 1);
  const H =
    Math.max(colH(cols.left), colH(cols.right), R * 2 + 60) + PAD * 2 + 30;
  const cy = (H - 30) / 2;
  const place = (list, x) => {
    let y = (H - 30 - colH(list)) / 2;
    return list.map((n) => {
      const node = { ...n, x, y };
      y += n.h + COL_GAP;
      return node;
    });
  };
  const nodes = [
    ...place(cols.right, W - PAD - BOX_W),
    ...place(cols.left, PAD),
  ];
  const longCenter = wrap(data.centro || "Tema", 14).length > 4;
  const centerSize = longCenter ? 22 : 28;
  const centerLines = longCenter
    ? fit(data.centro, 17, 6)
    : wrap(data.centro || "Tema", 14);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Mapa mental: ${data.centro}`}
      className="w-full h-auto"
    >
      <Defs id={id} colors={[main, ...nodes.map((n) => n.c)]} theme={theme} />
      <Paper id={id} W={W} H={H} theme={theme} />
      {nodes.map((nd, i) => {
        const right = nd.x > cx;
        const sx = cx + (right ? R - 4 : -R + 4);
        const ex = right ? nd.x : nd.x + BOX_W;
        const ey = nd.y + nd.headH / 2;
        const mx = (sx + ex) / 2;
        return (
          <path
            key={`l${i}`}
            d={`M ${sx} ${cy} C ${mx} ${cy}, ${mx} ${ey}, ${ex} ${ey}`}
            stroke={nd.c}
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={R + 16} fill={mix(main, theme.paper, 0.78)} />
      <g filter={shadowUrl(id)}>
        <circle cx={cx} cy={cy} r={R} fill={radialUrl(id, main)} />
      </g>
      <circle
        cx={cx}
        cy={cy}
        r={R - 12}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeDasharray="3 9"
        opacity="0.7"
      />
      <text
        x={cx}
        y={cy - R + 40}
        fontSize="14"
        fontWeight="900"
        fill="#FFFFFF"
        opacity="0.85"
        textAnchor="middle"
        letterSpacing="3"
        fontFamily={FONT}
      >
        MAPA MENTAL
      </text>
      <TextLines
        lines={centerLines}
        x={cx}
        y={
          cy -
          ((centerLines.length - 1) * centerSize * 1.15) / 2 +
          centerSize / 3 +
          8
        }
        size={centerSize}
        weight={900}
        fill="#FFFFFF"
        gap={1.15}
      />
      {nodes.map((nd, i) => (
        <BranchCard
          key={`n${i}`}
          id={id}
          x={nd.x}
          y={nd.y}
          w={BOX_W}
          node={nd}
          theme={theme}
        />
      ))}
      <Footer W={W} y={H - 14} theme={theme} />
    </svg>
  );
}

export const MindMapImage = memo(
  forwardRef(function MindMapImage(
    { data, color, layout = "radial", themeId = "colorido" },
    ref,
  ) {
    const theme = THEMES[themeId] || THEMES.colorido;
    const main = theme.main(color);
    const Layout = layout === "tree" ? MindMapTree : MindMapSides;
    return <Layout data={data} main={main} theme={theme} svgRef={ref} />;
  }),
);
