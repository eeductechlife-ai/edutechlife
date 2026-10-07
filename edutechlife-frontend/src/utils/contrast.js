/**
 * Contraste de color (WCAG 2.x). Los colores por materia se usan como fondo de
 * botones y chips; con texto blanco fijo, los amarillos y celestes quedaban
 * entre 2,2:1 y 2,7:1 (el mínimo es 4,5:1).
 */

function hexToRgb(hex) {
  const m = String(hex || "")
    .trim()
    .replace(/^#/, "");
  const full =
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function luminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** Relación de contraste entre dos colores hex (1 a 21), o null si no son hex. */
export function contrastRatio(a, b) {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return null;
  const [hi, lo] = [luminance(ra), luminance(rb)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const WHITE = "#FFFFFF";
const DARK = "#00303F";
const NEAR_BLACK = "#111827";

/**
 * Color de texto legible (≥ 4,5:1) sobre un fondo: blanco si alcanza; si no el
 * azul petróleo oscuro de la marca; y en los tonos medios (rosas, naranjas)
 * donde ninguno llega, casi negro. Con un fondo que no es hex devuelve blanco
 * (el comportamiento de siempre).
 */
export function readableTextOn(background) {
  if (contrastRatio(WHITE, background) == null) return WHITE;
  const candidates = [WHITE, DARK, NEAR_BLACK];
  return (
    candidates.find((c) => contrastRatio(c, background) >= 4.5) ||
    candidates.reduce((best, c) =>
      contrastRatio(c, background) > contrastRatio(best, background) ? c : best,
    )
  );
}
