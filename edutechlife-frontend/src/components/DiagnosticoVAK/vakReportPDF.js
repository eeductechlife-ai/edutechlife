import { BRAND } from "./vakReport";

/**
 * Dibuja el informe de la familia como PDF vectorial con jsPDF: texto real
 * (nítido y seleccionable), cortes de página controlados y un archivo liviano
 * para enviarlo por correo. No toca el DOM: recibe el informe ya armado
 * (`buildVakReport`) y las imágenes como data URLs opcionales.
 */

const PAGE_W = 210;
const PAGE_H = 297;
const M = 16; // margen lateral
const CONTENT_W = PAGE_W - M * 2;
const FOOTER_Y = PAGE_H - 12;
const BOTTOM = FOOTER_Y - 8; // último punto útil antes del pie
const PT = 0.3528; // mm por punto tipográfico

// Reto de la semana: turquesa de marca, distinto del color del estilo.
const WARM = {
  bg: "#F0FAFC",
  line: "#B6E3EC",
  title: "#0E7490",
  text: "#0F3B4F",
};

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
/** Mezcla un color con blanco (amount 0 = color, 1 = blanco). */
const tint = (hex, amount) => {
  const [r, g, b] = rgb(hex);
  const mix = (c) => Math.round(c + (255 - c) * amount);
  return `#${[mix(r), mix(g), mix(b)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
};
/** Mezcla dos colores (t = 0 → a, t = 1 → b). */
const blend = (a, b, t) => {
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  const mix = (x, y) => Math.round(x + (y - x) * t);
  return `#${[mix(r1, r2), mix(g1, g2), mix(b1, b2)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
};

export function drawVakReport(jsPDF, report, assets = {}) {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
  });
  const mainStyle = report.styles.find((s) => s.key === report.main);
  const balanced = report.tie === "three";
  const accent = mainStyle.fill;
  const accentInk = mainStyle.ink;
  let y = 0;

  // ---------- primitivas ----------
  const fill = (hex) => doc.setFillColor(...rgb(hex));
  const stroke = (hex) => doc.setDrawColor(...rgb(hex));
  const color = (hex) => doc.setTextColor(...rgb(hex));
  const font = (size, weight = "normal") => {
    doc.setFont("helvetica", weight);
    doc.setFontSize(size);
  };
  const lineH = (size, leading = 1.45) => size * PT * leading;
  const wrap = (text, width) => doc.splitTextToSize(String(text), width);
  const textBlock = (lines, x, top, size, leading = 1.45) => {
    // `top` es el borde superior del bloque; jsPDF escribe sobre la línea base.
    lines.forEach((ln, i) =>
      doc.text(ln, x, top + size * PT * 0.8 + i * lineH(size, leading)),
    );
    return lines.length * lineH(size, leading);
  };
  // jsPDF no cuenta el espaciado entre letras al alinear: se calcula aquí.
  const spaced = (label, x, base, cs, align = "left") => {
    const w = doc.getTextWidth(label) + (label.length - 1) * cs;
    const left = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
    doc.text(label, left, base, { charSpace: cs });
    return w;
  };
  const eyebrow = (label, x, top, hex = BRAND.teal) => {
    font(7.5, "bold");
    color(hex);
    spaced(label.toUpperCase(), x, top + 2.6, 0.6);
  };

  const newPage = () => {
    doc.addPage();
    y = M;
    // Encabezado corto de las páginas interiores.
    if (assets.logo)
      doc.addImage(assets.logo, "PNG", M, y, 38, 5, undefined, "FAST");
    font(8, "bold");
    color(BRAND.muted);
    doc.text(`Mapa de aprendizaje de ${report.name}`, PAGE_W - M, y + 3.8, {
      align: "right",
    });
    stroke(BRAND.line);
    doc.setLineWidth(0.3);
    doc.line(M, y + 9, PAGE_W - M, y + 9);
    y += 16;
  };
  const ensure = (h) => {
    if (y + h > BOTTOM) newPage();
  };

  const sectionTitle = (title, hex = BRAND.navy) => {
    ensure(14);
    fill(accent);
    doc.roundedRect(M, y + 0.6, 1.4, 5.2, 0.7, 0.7, "F");
    font(13, "bold");
    color(hex);
    doc.text(title, M + 4.5, y + 5);
    y += 10;
  };

  // Anillo de la mezcla: un sector por estilo, en el orden del informe.
  const donut = (cx, cy, r, thick, bg) => {
    const total = report.styles.reduce((s, st) => s + st.pct, 0) || 1;
    let a0 = -Math.PI / 2;
    report.styles.forEach((st) => {
      if (!st.pct) return;
      const a1 = a0 + (st.pct / total) * Math.PI * 2;
      const steps = Math.max(6, Math.ceil(((a1 - a0) / (Math.PI * 2)) * 90));
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const a = a0 + ((a1 - a0) * i) / steps;
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
      for (let i = steps; i >= 0; i--) {
        const a = a0 + ((a1 - a0) * i) / steps;
        pts.push([
          cx + Math.cos(a) * (r - thick),
          cy + Math.sin(a) * (r - thick),
        ]);
      }
      const deltas = pts
        .slice(1)
        .map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]);
      fill(st.fill);
      doc.lines(deltas, pts[0][0], pts[0][1], [1, 1], "F", true);
      a0 = a1;
    });
    // Separadores finos entre sectores para que se lean como piezas.
    stroke(bg);
    doc.setLineWidth(0.9);
    a0 = -Math.PI / 2;
    report.styles.forEach((st) => {
      if (!st.pct || st.pct === total) return;
      doc.line(
        cx + Math.cos(a0) * (r - thick - 0.5),
        cy + Math.sin(a0) * (r - thick - 0.5),
        cx + Math.cos(a0) * (r + 0.5),
        cy + Math.sin(a0) * (r + 0.5),
      );
      a0 += (st.pct / total) * Math.PI * 2;
    });
  };

  // ================= PÁGINA 1 =================
  // Franja superior de marca.
  fill(BRAND.teal);
  doc.rect(0, 0, PAGE_W, 2.2, "F");

  y = 12;
  if (assets.logo)
    doc.addImage(assets.logo, "PNG", M, y, 53.5, 7, undefined, "FAST");
  else {
    font(14, "bold");
    color(BRAND.navy);
    doc.text("Edutechlife", M, y + 5.5);
  }
  font(7.5, "bold");
  color(BRAND.teal);
  spaced("INFORME PARA LA FAMILIA", PAGE_W - M, y + 2.8, 0.6, "right");
  font(9);
  color(BRAND.muted);
  doc.text(report.dateLabel, PAGE_W - M, y + 7.4, { align: "right" });
  y += 15;

  // ---------- portada ----------
  const heroH = 66;
  const heroTop = y;
  fill(BRAND.navy);
  doc.roundedRect(M, heroTop, CONTENT_W, heroH, 6, 6, "F");
  // Círculos decorativos recortados a la tarjeta.
  doc.saveGraphicsState();
  doc.roundedRect(M, heroTop, CONTENT_W, heroH, 6, 6, null);
  doc.clip();
  doc.discardPath();
  fill(blend(BRAND.navy, BRAND.teal, 0.18));
  doc.circle(PAGE_W - M - 8, heroTop + 4, 34, "F");
  fill(blend(BRAND.navy, BRAND.teal, 0.1));
  doc.circle(M + 18, heroTop + heroH + 10, 26, "F");
  doc.restoreGraphicsState();

  const hx = M + 10;
  eyebrow("Mapa de aprendizaje", hx, heroTop + 9, tint(BRAND.teal, 0.25));
  // El nombre completo siempre cabe: se reduce la letra antes que cortarlo.
  let nameSize = 28;
  font(nameSize, "bold");
  while (nameSize > 16 && doc.getTextWidth(report.name) > 100)
    font(--nameSize, "bold");
  color("#FFFFFF");
  doc.text(wrap(report.name, 100)[0], hx, heroTop + 23);
  font(9.5);
  color(tint(BRAND.navy, 0.62));
  doc.text(`${report.age} años  ·  ${report.dateLabel}`, hx, heroTop + 29.5);

  font(14, "bold");
  color("#FFFFFF");
  const headLines = wrap(report.headline, 100).slice(0, 2);
  textBlock(headLines, hx, heroTop + 34, 14, 1.25);

  // Etiqueta del perfil.
  font(9, "bold");
  const pill = report.profileLabel.toUpperCase();
  const pillW = doc.getTextWidth(pill) + (pill.length - 1) * 0.35 + 10;
  const pillTop = heroTop + heroH - 15;
  fill(accent);
  doc.roundedRect(hx, pillTop, pillW, 8, 4, 4, "F");
  color(BRAND.navy);
  spaced(pill, hx + 5, pillTop + 5.4, 0.35);

  // Anillo con la mezcla.
  const cx = PAGE_W - M - 34;
  const cy = heroTop + heroH / 2;
  fill(blend(BRAND.navy, "#FFFFFF", 0.08));
  doc.circle(cx, cy, 26, "F");
  donut(cx, cy, 24, 6.5, BRAND.navy);
  font(balanced ? 13 : 22, "bold");
  color("#FFFFFF");
  doc.text(
    balanced ? "3 formas" : `${mainStyle.pct}%`,
    cx,
    cy + (balanced ? 1 : 2.2),
    { align: "center" },
  );
  font(7.5, "bold");
  color(tint(BRAND.navy, 0.62));
  spaced(
    (balanced ? "Por igual" : mainStyle.label).toUpperCase(),
    cx,
    cy + 7.6,
    0.4,
    "center",
  );

  y = heroTop + heroH + 8;

  // ---------- mezcla ----------
  sectionTitle("Su mezcla de hoy");
  const gap = 5;
  const cardW = (CONTENT_W - gap * 2) / 3;
  const cardH = 33;
  report.styles.forEach((st, i) => {
    const x = M + i * (cardW + gap);
    fill(tint(st.fill, 0.9));
    stroke(st.isMain ? st.fill : tint(st.fill, 0.7));
    doc.setLineWidth(st.isMain ? 0.6 : 0.3);
    doc.roundedRect(x, y, cardW, cardH, 4, 4, "FD");
    font(9, "bold");
    color(st.ink);
    doc.text(st.label, x + 5, y + 7);
    if (st.isMain || st.isSecond) {
      font(6.5, "bold");
      const tag = st.isMain ? "PRINCIPAL" : "TAMBIÉN";
      const tw = doc.getTextWidth(tag) + 4;
      fill(st.ink);
      doc.roundedRect(x + cardW - tw - 4, y + 3.4, tw, 4.8, 2.4, 2.4, "F");
      color("#FFFFFF");
      doc.text(tag, x + cardW - tw / 2 - 4, y + 6.7, { align: "center" });
    }
    font(22, "bold");
    color(st.ink);
    doc.text(`${st.pct}%`, x + 5, y + 18);
    fill("#FFFFFF");
    doc.roundedRect(x + 5, y + 21.5, cardW - 10, 2.2, 1.1, 1.1, "F");
    if (st.pct > 0) {
      fill(st.fill);
      doc.roundedRect(
        x + 5,
        y + 21.5,
        Math.max(2.2, ((cardW - 10) * st.pct) / 100),
        2.2,
        1.1,
        1.1,
        "F",
      );
    }
    font(7.5);
    color(BRAND.muted);
    doc.text(st.meaning, x + 5, y + 29);
  });
  y += cardH + 7;

  // ---------- lectura ----------
  sectionTitle("Lo que muestran sus respuestas");
  font(10.5);
  const sumLines = wrap(report.summary, CONTENT_W - 12);
  font(8.5, "italic");
  const noteLines = wrap(report.summaryNote, CONTENT_W - 12);
  const readH =
    sumLines.length * lineH(10.5) + noteLines.length * lineH(8.5) + 12;
  ensure(readH);
  fill(BRAND.paper);
  doc.roundedRect(M, y, CONTENT_W, readH, 4, 4, "F");
  fill(BRAND.teal);
  doc.rect(M, y + 4, 1.2, readH - 8, "F");
  font(10.5);
  color(BRAND.ink);
  let ry = y + 5;
  ry += textBlock(sumLines, M + 7, ry, 10.5);
  font(8.5, "italic");
  color(BRAND.muted);
  textBlock(noteLines, M + 7, ry + 1.5, 8.5);
  y += readH + 6;

  // ---------- superpoder y reto ----------
  const halfW = (CONTENT_W - gap) / 2;
  font(10.5, "bold");
  const spLines = wrap(report.superpower, halfW - 12);
  font(10);
  const chLines = wrap(report.challenge, halfW - 12);
  const duoH =
    Math.max(spLines.length * lineH(10.5), chLines.length * lineH(10)) + 19;
  ensure(duoH);
  fill(tint(accent, 0.86));
  doc.roundedRect(M, y, halfW, duoH, 4, 4, "F");
  eyebrow("Su superpoder", M + 6, y + 6, accentInk);
  font(10.5, "bold");
  color(BRAND.navy);
  textBlock(spLines, M + 6, y + 12, 10.5);

  const rx = M + halfW + gap;
  fill(WARM.bg);
  stroke(WARM.line);
  doc.setLineWidth(0.3);
  doc.roundedRect(rx, y, halfW, duoH, 4, 4, "FD");
  eyebrow("Reto de esta semana", rx + 6, y + 6, WARM.title);
  font(10);
  color(WARM.text);
  textBlock(chLines, rx + 6, y + 12, 10);
  y += duoH + 7;

  // ---------- estrategias ----------
  sectionTitle("Estrategias para estudiar");
  const colW = (CONTENT_W - gap) / 2;
  const half = Math.ceil(report.strategies.length / 2);
  const rows = Math.max(half, report.strategies.length - half);
  ensure(rows * 9);
  report.strategies.forEach((s, i) => {
    const col = i < half ? 0 : 1;
    const row = col ? i - half : i;
    const x = M + col * (colW + gap);
    const top = y + row * 9;
    fill(accent);
    doc.circle(x + 3, top + 3, 3, "F");
    font(8, "bold");
    color(BRAND.navy);
    doc.text(String(i + 1), x + 3, top + 4.1, { align: "center" });
    font(10);
    color(BRAND.ink);
    doc.text(wrap(s, colW - 10)[0], x + 9, top + 4.2);
  });
  y += rows * 9 + 4;

  // ================= PÁGINA 2 =================
  newPage();

  // ---------- recomendaciones ----------
  sectionTitle("Recomendaciones para la familia");
  report.parentTips.forEach((tip, i) => {
    font(10);
    const lines = wrap(tip, CONTENT_W - 12);
    const h = lines.length * lineH(10) + 3.5;
    ensure(h);
    fill(tint(accent, 0.82));
    doc.circle(M + 3, y + 2.5, 3, "F");
    font(8, "bold");
    color(accentInk);
    doc.text(String(i + 1), M + 3, y + 3.6, { align: "center" });
    font(10);
    color(BRAND.ink);
    textBlock(lines, M + 9, y + 0.3, 10);
    y += h;
  });
  y += 4;

  // ---------- plan de la semana ----------
  sectionTitle("Plan para esta semana");
  const stepW = (CONTENT_W - gap * 3) / 4;
  font(8.5);
  const stepLines = report.weekPlan.map((st) => wrap(st.text, stepW - 8));
  const stepH =
    Math.max(...stepLines.map((l) => l.length)) * lineH(8.5, 1.4) + 17;
  ensure(stepH);
  report.weekPlan.forEach((st, i) => {
    const x = M + i * (stepW + gap);
    const last = i === report.weekPlan.length - 1;
    fill(last ? BRAND.navy : "#FFFFFF");
    stroke(last ? BRAND.navy : BRAND.line);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, stepW, stepH, 4, 4, "FD");
    fill(last ? BRAND.teal : tint(accent, 0.8));
    doc.roundedRect(x + 4, y + 4, 16, 5.6, 2.8, 2.8, "F");
    font(7.5, "bold");
    color(last ? "#FFFFFF" : accentInk);
    doc.text(st.day.toUpperCase(), x + 12, y + 7.8, { align: "center" });
    font(8.5);
    color(last ? "#FFFFFF" : BRAND.ink);
    textBlock(stepLines[i], x + 4, y + 13, 8.5, 1.4);
  });
  y += stepH + 7;

  // ---------- nota de Valeria ----------
  const paras = report.valeriaNote.split("\n\n").filter(Boolean);
  font(9.5);
  const paraLines = paras.map((p) => wrap(p, CONTENT_W - 14));
  const noteH =
    paraLines.reduce((h, l) => h + l.length * lineH(9.5, 1.38) + 1.8, 0) + 23;
  ensure(noteH);
  fill(tint(BRAND.teal, 0.9));
  doc.roundedRect(M, y, CONTENT_W, noteH, 5, 5, "F");
  const avX = M + 11;
  const avY = y + 10.5;
  fill("#FFFFFF");
  doc.circle(avX, avY, 6.2, "F");
  if (assets.avatar) {
    doc.saveGraphicsState();
    doc.circle(avX, avY, 5.6, null);
    doc.clip();
    doc.discardPath();
    doc.addImage(
      assets.avatar,
      "PNG",
      avX - 5.8,
      avY - 5.6,
      11.6,
      11.2,
      undefined,
      "FAST",
    );
    doc.restoreGraphicsState();
  } else {
    font(11, "bold");
    color(BRAND.teal);
    doc.text("V", avX, avY + 1.4, { align: "center" });
  }
  font(11, "bold");
  color(BRAND.navy);
  doc.text("Valeria", M + 21, y + 9.6);
  font(8);
  color(BRAND.muted);
  doc.text("Guía de aprendizaje con IA de Edutechlife", M + 21, y + 13.8);
  let ny = y + 21;
  font(9.5);
  color(BRAND.ink);
  paraLines.forEach((l) => {
    ny += textBlock(l, M + 7, ny, 9.5, 1.38) + 1.8;
  });
  y += noteH + 6;

  // ---------- IngenIA + aviso ----------
  font(8);
  const discLines = wrap(report.disclaimer, CONTENT_W - (assets.qr ? 44 : 12));
  const ctaH = Math.max(32, discLines.length * lineH(8) + 22);
  ensure(ctaH);
  stroke(BRAND.line);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, CONTENT_W, ctaH, 4, 4, "S");
  eyebrow("Qué mide y qué no", M + 6, y + 6);
  font(8);
  color(BRAND.muted);
  const dh = textBlock(discLines, M + 6, y + 11, 8);
  font(9, "bold");
  color(BRAND.navy);
  doc.text(
    "Practica a tu manera en IngenIA: edutechlife.co/conoce-ingenia",
    M + 6,
    y + 11 + dh + 5,
  );
  if (assets.qr)
    doc.addImage(
      assets.qr,
      "PNG",
      PAGE_W - M - 30,
      y + (ctaH - 26) / 2,
      26,
      26,
      undefined,
      "FAST",
    );

  // ---------- pie en todas las páginas ----------
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    stroke(BRAND.line);
    doc.setLineWidth(0.3);
    doc.line(M, FOOTER_Y - 4, PAGE_W - M, FOOTER_Y - 4);
    font(7.5);
    color(BRAND.muted);
    doc.text("Edutechlife · ADN de Aprendizaje · edutechlife.co", M, FOOTER_Y);
    doc.text(
      `Documento personal · Página ${p} de ${pages}`,
      PAGE_W - M,
      FOOTER_Y,
      { align: "right" },
    );
  }

  doc.setProperties({
    title: `Mapa de aprendizaje de ${report.name}`,
    subject: "ADN de Aprendizaje · Informe para la familia",
    author: "Edutechlife",
    creator: "Edutechlife",
  });
  return doc;
}
