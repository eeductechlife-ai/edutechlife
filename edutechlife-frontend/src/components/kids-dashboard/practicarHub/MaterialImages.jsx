import { memo, forwardRef } from "react";

const PALETTE = [
  "#FB8500",
  "#9D4EDD",
  "#06D6A0",
  "#EF476F",
  "#118AB2",
  "#E9A800",
];
const FONT = "'Nunito','Open Sans',system-ui,sans-serif";

function wrap(text, maxChars) {
  const words = String(text || "")
    .split(/\s+/)
    .filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = `${cur} ${w}`.trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function TextLines({
  lines,
  x,
  y,
  size,
  weight = 700,
  fill,
  anchor = "middle",
  gap = 1.25,
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      textAnchor={anchor}
      fontFamily={FONT}
    >
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : size * gap}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

// Phone layout: topic on top, one full-width coloured branch per idea, so the
// text stays readable when the image is only ~300 px wide.
function MindMapTree({ data, color, svgRef }) {
  const W = 520;
  const PAD = 24;
  const centerLines = wrap(data.centro || "Tema", 18).slice(0, 2);
  const headH = 70 + centerLines.length * 36;
  let y = headH + 36;
  const nodes = data.ramas.map((r, i) => {
    const ideaLines = wrap(`${r.emoji} ${r.idea}`, 24).slice(0, 2);
    const detailLines = r.detalles
      .flatMap((d) => wrap(`• ${d}`, 34))
      .slice(0, 6);
    const h = 34 + ideaLines.length * 32 + detailLines.length * 28 + 14;
    const c =
      PALETTE[i % PALETTE.length] === color
        ? PALETTE[(i + 1) % PALETTE.length]
        : PALETTE[i % PALETTE.length];
    const node = { y, h, ideaLines, detailLines, c };
    y += h + 22;
    return node;
  });
  const H = y + 4;
  const spineX = PAD + 16;
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Mapa mental: ${data.centro}`}
      className="w-full h-auto"
    >
      <rect width={W} height={H} rx="28" fill="#FFFDF7" />
      <rect
        x={PAD}
        y={PAD}
        width={W - PAD * 2}
        height={headH - PAD}
        rx="26"
        fill={color}
      />
      <TextLines
        lines={centerLines}
        x={W / 2}
        y={PAD + 48}
        size={34}
        weight={900}
        fill="#fff"
        gap={1.1}
      />
      <line
        x1={spineX}
        y1={headH}
        x2={spineX}
        y2={nodes.length ? nodes[nodes.length - 1].y + 30 : headH}
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />
      {nodes.map((nd, i) => (
        <g key={i}>
          <path
            d={`M ${spineX} ${nd.y + 26} H ${PAD + 44}`}
            stroke={nd.c}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle
            cx={spineX}
            cy={nd.y + 26}
            r="11"
            fill={nd.c}
            stroke="#fff"
            strokeWidth="4"
          />
          <rect
            x={PAD + 44}
            y={nd.y}
            width={W - PAD * 2 - 44}
            height={nd.h}
            rx="20"
            fill="#fff"
            stroke={nd.c}
            strokeWidth="4"
          />
          <TextLines
            lines={nd.ideaLines}
            x={PAD + 62}
            y={nd.y + 36}
            size={27}
            weight={900}
            fill={nd.c}
            anchor="start"
          />
          <TextLines
            lines={nd.detailLines}
            x={PAD + 62}
            y={nd.y + 36 + nd.ideaLines.length * 32 + 4}
            size={22}
            weight={600}
            fill="#334155"
            anchor="start"
          />
        </g>
      ))}
    </svg>
  );
}

export const MindMapImage = memo(
  forwardRef(function MindMapImage({ data, color, layout = "radial" }, ref) {
    if (layout === "tree")
      return <MindMapTree data={data} color={color} svgRef={ref} />;
    return <MindMapRadial data={data} color={color} svgRef={ref} />;
  }),
);

// Radial mind map: topic in the centre, one coloured branch per idea.
function MindMapRadial({ data, color, svgRef: ref }) {
  const W = 800;
  const H = 800;
  const cx = W / 2;
  const cy = H / 2;
  const n = data.ramas.length;
  const R = 255;
  const BOX_W = 230;

  const nodes = data.ramas.map((r, i) => {
    const angle = (-90 + (360 / n) * i) * (Math.PI / 180);
    const detailLines = r.detalles
      .flatMap((d) => wrap(`• ${d}`, 26))
      .slice(0, 6);
    const ideaLines = wrap(`${r.emoji} ${r.idea}`, 18).slice(0, 2);
    const boxH = 30 + ideaLines.length * 26 + detailLines.length * 21;
    const nx = cx + R * Math.cos(angle);
    const ny = cy + R * Math.sin(angle);
    const x = Math.min(Math.max(nx - BOX_W / 2, 12), W - BOX_W - 12);
    const y = Math.min(Math.max(ny - boxH / 2, 12), H - boxH - 12);
    return {
      r,
      c:
        PALETTE[i % PALETTE.length] === color
          ? PALETTE[(i + 1) % PALETTE.length]
          : PALETTE[i % PALETTE.length],
      x,
      y,
      boxH,
      ideaLines,
      detailLines,
      nx,
      ny,
    };
  });
  const centerLines = wrap(data.centro || "Tema", 14).slice(0, 3);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Mapa mental: ${data.centro}`}
      className="w-full h-auto"
    >
      <rect width={W} height={H} rx="32" fill="#FFFDF7" />
      {nodes.map((nd, i) => (
        <path
          key={`l${i}`}
          d={`M ${cx} ${cy} Q ${(cx + nd.nx) / 2 + (nd.ny - cy) * 0.15} ${(cy + nd.ny) / 2 - (nd.nx - cx) * 0.15} ${nd.x + BOX_W / 2} ${nd.y + nd.boxH / 2}`}
          stroke={nd.c}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
      ))}
      <circle cx={cx} cy={cy} r="112" fill={color} />
      <circle
        cx={cx}
        cy={cy}
        r="112"
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeDasharray="4 10"
      />
      <TextLines
        lines={centerLines}
        x={cx}
        y={cy - ((centerLines.length - 1) * 30) / 2 + 10}
        size={30}
        weight={900}
        fill="#fff"
      />
      {nodes.map((nd, i) => (
        <g key={`n${i}`}>
          <rect
            x={nd.x}
            y={nd.y}
            width={BOX_W}
            height={nd.boxH}
            rx="20"
            fill="#fff"
            stroke={nd.c}
            strokeWidth="5"
          />
          <rect
            x={nd.x}
            y={nd.y}
            width={BOX_W}
            height={20 + nd.ideaLines.length * 26}
            rx="20"
            fill={nd.c}
          />
          <rect
            x={nd.x}
            y={nd.y + 12 + nd.ideaLines.length * 26}
            width={BOX_W}
            height="10"
            fill={nd.c}
          />
          <TextLines
            lines={nd.ideaLines}
            x={nd.x + BOX_W / 2}
            y={nd.y + 30}
            size={21}
            weight={900}
            fill="#fff"
          />
          <TextLines
            lines={nd.detailLines}
            x={nd.x + 14}
            y={nd.y + 30 + nd.ideaLines.length * 26 + 10}
            size={16}
            weight={600}
            fill="#334155"
            anchor="start"
          />
        </g>
      ))}
    </svg>
  );
}

// Vertical poster sized for phones: title band, one block per key idea, fun fact.
export const InfographicImage = memo(
  forwardRef(function InfographicImage({ data, color }, ref) {
    const W = 520;
    const PAD = 22;
    const titleLines = wrap(data.titulo, 20).slice(0, 2);
    const subLines = wrap(data.subtitulo, 38).slice(0, 2);
    const headerH = 96 + titleLines.length * 40 + subLines.length * 26;
    let y = headerH + 22;
    const blocks = data.bloques.map((b, i) => {
      const titleL = wrap(b.titulo, 22).slice(0, 2);
      const textL = wrap(b.texto, 30).slice(0, 5);
      const h = 38 + titleL.length * 30 + textL.length * 27;
      const block = {
        b,
        i,
        y,
        h,
        titleL,
        textL,
        c: PALETTE[i % PALETTE.length],
      };
      y += h + 16;
      return block;
    });
    const factLines = data.dato
      ? wrap(`¿Sabías que…? ${data.dato}`, 36).slice(0, 5)
      : [];
    const factH = factLines.length ? 40 + factLines.length * 27 : 0;
    const H = y + factH + (factH ? 22 : 6);

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Infografía: ${data.titulo}`}
        className="w-full h-auto"
      >
        <rect width={W} height={H} rx="28" fill="#F8FAFC" />
        <rect width={W} height={headerH} rx="28" fill={color} />
        <rect y={headerH - 28} width={W} height="28" fill={color} />
        <circle cx={W - 50} cy="50" r="90" fill="#fff" opacity="0.12" />
        <text
          x={PAD}
          y="52"
          fontSize="20"
          fontWeight="800"
          fill="#fff"
          opacity="0.85"
          fontFamily={FONT}
        >
          INFOGRAFÍA
        </text>
        <TextLines
          lines={titleLines}
          x={PAD}
          y={96}
          size={36}
          weight={900}
          fill="#fff"
          anchor="start"
          gap={1.1}
        />
        <TextLines
          lines={subLines}
          x={PAD}
          y={96 + titleLines.length * 40 + 4}
          size={21}
          weight={600}
          fill="#fff"
          anchor="start"
        />
        {blocks.map(({ b, i, y: by, h, titleL, textL, c }) => (
          <g key={i}>
            <rect
              x={PAD}
              y={by}
              width={W - PAD * 2}
              height={h}
              rx="20"
              fill="#fff"
              stroke={c}
              strokeWidth="4"
            />
            <rect x={PAD} y={by} width="12" height={h} rx="6" fill={c} />
            <circle cx={PAD + 52} cy={by + 44} r="28" fill={c} opacity="0.15" />
            <text
              x={PAD + 52}
              y={by + 55}
              fontSize="30"
              textAnchor="middle"
              fontFamily={FONT}
            >
              {b.emoji}
            </text>
            <TextLines
              lines={titleL}
              x={PAD + 94}
              y={by + 40}
              size={26}
              weight={900}
              fill={c}
              anchor="start"
            />
            <TextLines
              lines={textL}
              x={PAD + 94}
              y={by + 40 + titleL.length * 30 + 4}
              size={22}
              weight={600}
              fill="#334155"
              anchor="start"
            />
          </g>
        ))}
        {factH > 0 && (
          <g>
            <rect
              x={PAD}
              y={y}
              width={W - PAD * 2}
              height={factH}
              rx="20"
              fill="#FFF7E6"
              stroke="#FB8500"
              strokeWidth="3"
              strokeDasharray="10 8"
            />
            <TextLines
              lines={factLines}
              x={W / 2}
              y={y + 36}
              size={21}
              weight={800}
              fill="#9A3412"
            />
          </g>
        )}
      </svg>
    );
  }),
);

// Rasterises an on-screen SVG to PNG and triggers a download.
export async function downloadSvgAsPng(svgEl, fileName) {
  const vb = svgEl.viewBox.baseVal;
  const scale = 2;
  const xml = new XMLSerializer().serializeToString(svgEl);
  const url = URL.createObjectURL(
    new Blob([xml], { type: "image/svg+xml;charset=utf-8" }),
  );
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = vb.width * scale;
    canvas.height = vb.height * scale;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${fileName}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  } finally {
    URL.revokeObjectURL(url);
  }
}
