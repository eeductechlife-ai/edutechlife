// Shared building blocks for the study images (mind maps, infographics):
// text wrapping, colour themes, SVG defs and PNG export.

export const FONT =
  "'Nunito','Arial Rounded MT Bold','Segoe UI',system-ui,sans-serif";

export const THEMES = {
  colorido: {
    id: "colorido",
    label: "Colorido",
    emoji: "🌈",
    paper: "#FFFCF5",
    dots: "#E7DFCC",
    card: "#FFFFFF",
    ink: "#1E293B",
    muted: "#475569",
    footer: "#94A3B8",
    palette: ["#FB8500", "#9D4EDD", "#06D6A0", "#EF476F", "#118AB2", "#E9A800"],
    soft: (c) => mix(c, "#FFFFFF", 0.92),
    main: (c) => c,
  },
  pastel: {
    id: "pastel",
    label: "Pastel",
    emoji: "🍬",
    paper: "#FDF8FF",
    dots: "#EADCF5",
    card: "#FFFFFF",
    ink: "#3B3355",
    muted: "#5B5470",
    footer: "#A99BC0",
    palette: ["#F4A261", "#B388EB", "#4FBFAE", "#F28DB2", "#6BB6E0", "#E0B64A"],
    soft: (c) => mix(c, "#FFFFFF", 0.88),
    main: (c) => mix(c, "#FFFFFF", 0.25),
  },
  noche: {
    id: "noche",
    label: "Noche",
    emoji: "🌙",
    paper: "#0F172A",
    dots: "#1E2A44",
    card: "#1E293B",
    ink: "#F1F5F9",
    muted: "#CBD5E1",
    footer: "#64748B",
    palette: ["#FFB703", "#C77DFF", "#2EE6A8", "#FF5C8A", "#4CC9F0", "#FFD166"],
    soft: (c) => mix(c, "#1E293B", 0.82),
    main: (c) => c,
  },
};

export const THEME_LIST = Object.values(THEMES);

export function mix(hex, target, amount) {
  const a = parseInt(hex.slice(1), 16);
  const b = parseInt(target.slice(1), 16);
  const ch = (shift) => {
    const x = (a >> shift) & 255;
    const y = (b >> shift) & 255;
    return Math.round(x + (y - x) * amount);
  };
  return `#${((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1)}`;
}

export function wrap(text, maxChars) {
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

// Wraps and caps the line count; the last kept line gets "…" so nothing
// disappears silently when the AI writes more than fits.
export function fit(text, maxChars, maxLines) {
  const lines = wrap(text, maxChars);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[\s.,;:]+$/, "")}…`;
  return kept;
}

// Picks the n-th palette colour, skipping the one used for the subject.
export function paletteColor(theme, i, subjectColor) {
  const p = theme.palette;
  const c = p[i % p.length];
  return c === subjectColor ? p[(i + 1) % p.length] : c;
}

export function TextLines({
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

export const gradUrl = (id, c) => `url(#${id}-g${c.slice(1)})`;
export const radialUrl = (id, c) => `url(#${id}-r${c.slice(1)})`;
export const shadowUrl = (id) => `url(#${id}-shadow)`;

// Dotted paper, soft shadow and one linear + radial gradient per colour used.
export function Defs({ id, colors, theme }) {
  const unique = [...new Set(colors)];
  const light = "#FFFFFF";
  return (
    <defs>
      <pattern
        id={`${id}-dots`}
        width="22"
        height="22"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="2" cy="2" r="1.6" fill={theme.dots} />
      </pattern>
      <filter id={`${id}-shadow`} x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow
          dx="0"
          dy="5"
          stdDeviation="6"
          floodColor="#000000"
          floodOpacity={theme.id === "noche" ? 0.4 : 0.13}
        />
      </filter>
      {unique.map((c) => (
        <linearGradient
          key={c}
          id={`${id}-g${c.slice(1)}`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor={c} />
          <stop offset="100%" stopColor={mix(c, light, 0.35)} />
        </linearGradient>
      ))}
      {unique.map((c) => (
        <radialGradient
          key={`r${c}`}
          id={`${id}-r${c.slice(1)}`}
          cx="35%"
          cy="30%"
          r="75%"
        >
          <stop offset="0%" stopColor={mix(c, light, 0.35)} />
          <stop offset="100%" stopColor={c} />
        </radialGradient>
      ))}
    </defs>
  );
}

export function Paper({ id, W, H, theme }) {
  return (
    <>
      <rect width={W} height={H} rx="32" fill={theme.paper} />
      <rect width={W} height={H} rx="32" fill={`url(#${id}-dots)`} />
    </>
  );
}

export function Footer({ W, y, theme }) {
  return (
    <text
      x={W - 28}
      y={y}
      fontSize="15"
      fontWeight="800"
      fill={theme.footer}
      textAnchor="end"
      fontFamily={FONT}
    >
      Hecho con IngenIA · Edutechlife
    </text>
  );
}

// Rasterises an on-screen SVG to PNG (3× for print-quality sharpness), then
// shares it on phones or downloads it elsewhere.
export async function downloadSvgAsPng(svgEl, fileName) {
  const vb = svgEl.viewBox.baseVal;
  const scale = Math.min(3, 8000 / Math.max(vb.width, vb.height));
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
    canvas.width = Math.round(vb.width * scale);
    canvas.height = Math.round(vb.height * scale);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    const file = new File([blob], `${fileName}.png`, { type: "image/png" });
    // Phones: the share sheet offers "Save image" / WhatsApp; iOS ignores <a download>.
    if (
      navigator.canShare?.({ files: [file] }) &&
      window.matchMedia?.("(pointer: coarse)").matches
    ) {
      try {
        await navigator.share({ files: [file], title: fileName });
        return "shared";
      } catch (e) {
        if (e?.name === "AbortError") return "cancelled";
      }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    return "downloaded";
  } finally {
    URL.revokeObjectURL(url);
  }
}
