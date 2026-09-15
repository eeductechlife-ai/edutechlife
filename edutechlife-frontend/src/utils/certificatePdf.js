/**
 * Generación del diploma oficial de Edutechlife (A4 apaisado, 297x210 mm).
 *
 * El módulo es puro: recibe una instancia de jsPDF, los textos ya traducidos y
 * las imágenes ya resueltas como data URL. Así el trazado se puede verificar
 * fuera del navegador y el componente React sólo se ocupa de la interfaz.
 */

// ---------------------------------------------------------------------------
// Constantes de marca y geometría
// ---------------------------------------------------------------------------

export const PAGE = { W: 297, H: 210 };

export const COLORS = {
  navy: [10, 48, 73],
  teal: [0, 75, 99],
  cyan: [0, 168, 198],
  gold: [176, 141, 62],
  goldLight: [212, 181, 106],
  ink: [30, 41, 59],
  muted: [100, 116, 139],
  hairline: [222, 230, 238],
  paper: [255, 255, 255],
  // Tintes del fondo de seguridad: deliberadamente casi imperceptibles para
  // que la roseta nunca compita con el texto (no dependen de la opacidad).
  guillocheGold: [244, 237, 222],
  guillocheCyan: [234, 244, 247],
};

export const VERIFY_BASE_URL = 'https://edutechlife.co/verificar';

/**
 * Entidades que avalan el programa. `logo` es la ruta pública del archivo; si
 * no existe, se dibuja un bloque tipográfico en su lugar (nunca un marcador
 * con iniciales de colores).
 */
export const INSTITUTIONS = [
  { id: 'mintic', name: 'MinTIC', full: 'Ministerio TIC', logo: '/images/certificate/logo-mintic.png' },
  { id: 'manizales', name: 'Alcaldía de Manizales', full: 'Alcaldía de Manizales', logo: '/images/certificate/logo-alcaldia-manizales.png' },
  { id: 'edutechlife', name: 'Edutechlife', full: 'Edutechlife', logo: '/images/logo-edutechlife.webp' },
];

export const buildVerifyUrl = (certNumber) => `${VERIFY_BASE_URL}/${encodeURIComponent(certNumber)}`;

// ---------------------------------------------------------------------------
// Utilidades de trazado
// ---------------------------------------------------------------------------

const setFill = (doc, [r, g, b]) => doc.setFillColor(r, g, b);
const setStroke = (doc, [r, g, b]) => doc.setDrawColor(r, g, b);
const setText = (doc, [r, g, b]) => doc.setTextColor(r, g, b);

/** Aplica opacidad si el build de jsPDF expone GState; si no, sigue opaco. */
const withOpacity = (doc, value, draw) => {
  const supported = typeof doc.setGState === 'function' && typeof doc.GState === 'function';
  if (supported) doc.setGState(new doc.GState({ opacity: value }));
  try {
    draw();
  } finally {
    if (supported) doc.setGState(new doc.GState({ opacity: 1 }));
  }
};

/** Escribe texto con espaciado entre letras y restaura el valor previo. */
const spacedText = (doc, text, x, y, charSpace, options = {}) => {
  const canSpace = typeof doc.setCharSpace === 'function';
  if (canSpace) doc.setCharSpace(charSpace);
  doc.text(text, x, y, options);
  if (canSpace) doc.setCharSpace(0);
};

/** Ancho real del texto teniendo en cuenta el espaciado entre letras. */
const measure = (doc, text, charSpace = 0) =>
  doc.getTextWidth(text) + charSpace * Math.max(text.length - 1, 0) * 0.352778;

/**
 * Reduce el cuerpo hasta que el texto quepa en `maxWidth`.
 * Evita que un nombre largo se salga del diploma.
 */
export const fitFontSize = (doc, text, maxWidth, maxSize, minSize = 12) => {
  let size = maxSize;
  doc.setFontSize(size);
  while (size > minSize && doc.getTextWidth(text) > maxWidth) {
    size -= 0.5;
    doc.setFontSize(size);
  }
  return size;
};

// ---------------------------------------------------------------------------
// Piezas del diploma
// ---------------------------------------------------------------------------

/** Marco grabado: doble filete dorado con escuadras en las esquinas. */
const drawFrame = (doc) => {
  const { W, H } = PAGE;

  setFill(doc, COLORS.paper);
  doc.rect(0, 0, W, H, 'F');

  setStroke(doc, COLORS.gold);
  doc.setLineWidth(1.4);
  doc.rect(9, 9, W - 18, H - 18, 'S');

  setStroke(doc, COLORS.goldLight);
  doc.setLineWidth(0.3);
  doc.rect(12, 12, W - 24, H - 24, 'S');

  // Escuadras en navy sobre el filete interior.
  const arm = 13;
  setStroke(doc, COLORS.navy);
  doc.setLineWidth(1.1);
  const corners = [
    [12, 12, 1, 1],
    [W - 12, 12, -1, 1],
    [12, H - 12, 1, -1],
    [W - 12, H - 12, -1, -1],
  ];
  corners.forEach(([x, y, dx, dy]) => {
    doc.line(x, y, x + arm * dx, y);
    doc.line(x, y, x, y + arm * dy);
  });
};

/**
 * Roseta de seguridad. Se dibuja con tintes muy claros para que funcione como
 * textura de fondo incluso si el visor ignora la opacidad.
 */
const drawGuilloche = (doc, cx, cy) => {
  withOpacity(doc, 0.55, () => {
    setStroke(doc, COLORS.guillocheGold);
    doc.setLineWidth(0.18);
    for (let i = 0; i < 7; i += 1) {
      doc.circle(cx, cy, 20 + i * 5.5, 'S');
    }
    setStroke(doc, COLORS.guillocheCyan);
    doc.setLineWidth(0.15);
    for (let i = 0; i < 14; i += 1) {
      const a = (i / 14) * Math.PI * 2;
      doc.circle(cx + Math.cos(a) * 30, cy + Math.sin(a) * 30, 16, 'S');
    }
  });
};

/** Filete ornamental: línea — rombo — línea. */
const drawOrnament = (doc, cx, y, halfWidth) => {
  setStroke(doc, COLORS.goldLight);
  doc.setLineWidth(0.5);
  doc.line(cx - halfWidth, y, cx - 5, y);
  doc.line(cx + 5, y, cx + halfWidth, y);

  setFill(doc, COLORS.gold);
  doc.triangle(cx, y - 2.2, cx - 2.2, y, cx, y + 2.2, 'F');
  doc.triangle(cx, y - 2.2, cx + 2.2, y, cx, y + 2.2, 'F');
};

/**
 * Banda de entidades avaladoras. Usa el logo real cuando está disponible y,
 * si falta, un bloque tipográfico con filete dorado.
 */
const drawInstitutions = (doc, images, top) => {
  const { W } = PAGE;
  const slot = 74;
  const boxH = 13;
  const startX = W / 2 - (INSTITUTIONS.length * slot) / 2;

  INSTITUTIONS.forEach((inst, i) => {
    const cx = startX + i * slot + slot / 2;
    const image = images?.[inst.id];

    if (image?.dataUrl) {
      const ratio = image.width / image.height;
      let h = boxH;
      let w = h * ratio;
      const maxW = slot - 14;
      if (w > maxW) {
        w = maxW;
        h = w / ratio;
      }
      doc.addImage(image.dataUrl, 'PNG', cx - w / 2, top + (boxH - h) / 2, w, h);
    } else {
      // Bloque tipográfico: los filetes se ajustan al ancho real del texto.
      const label = inst.full.toUpperCase();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      const half = Math.min(measure(doc, label, 0.6) / 2 + 2, slot / 2 - 5);

      setStroke(doc, COLORS.goldLight);
      doc.setLineWidth(0.4);
      doc.line(cx - half, top + 2, cx + half, top + 2);

      setText(doc, COLORS.navy);
      spacedText(doc, label, cx, top + 8.5, 0.6, { align: 'center' });

      doc.setLineWidth(0.4);
      doc.line(cx - half, top + 11.5, cx + half, top + 11.5);
    }

    if (i < INSTITUTIONS.length - 1) {
      setStroke(doc, COLORS.hairline);
      doc.setLineWidth(0.3);
      doc.line(cx + slot / 2, top + 1, cx + slot / 2, top + boxH - 1);
    }
  });

  return top + boxH;
};

/** Sello circular doble anillo con texto centrado. */
const drawSeal = (doc, cx, cy, strings) => {
  setFill(doc, COLORS.gold);
  doc.circle(cx, cy, 16.5, 'F');
  setFill(doc, COLORS.navy);
  doc.circle(cx, cy, 14.5, 'F');
  setStroke(doc, COLORS.goldLight);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, 12.4, 'S');

  // El texto se ajusta al diámetro útil del anillo interior (24 mm).
  doc.setFont('helvetica', 'bold');
  const topSpace = 0.3;
  let topSize = 6;
  doc.setFontSize(topSize);
  while (topSize > 4 && measure(doc, strings.sealTop, topSpace) > 14) {
    topSize -= 0.25;
    doc.setFontSize(topSize);
  }
  setText(doc, COLORS.goldLight);
  spacedText(doc, strings.sealTop, cx, cy - 4.4, topSpace, { align: 'center' });

  setStroke(doc, COLORS.goldLight);
  doc.setLineWidth(0.3);
  doc.line(cx - 8, cy - 2.2, cx + 8, cy - 2.2);

  doc.setFontSize(7.5);
  setText(doc, COLORS.paper);
  spacedText(doc, 'EDUTECHLIFE', cx, cy + 1.6, 0.4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  setText(doc, COLORS.goldLight);
  doc.text(strings.sealBottom, cx, cy + 6.4, { align: 'center' });
};

/** Código QR a partir de la matriz de módulos entregada por el llamador. */
const drawQr = (doc, matrix, x, y, size) => {
  if (!matrix?.length) return;
  const count = matrix.length;
  const cell = size / count;

  setFill(doc, COLORS.paper);
  doc.rect(x - 2, y - 2, size + 4, size + 4, 'F');
  setStroke(doc, COLORS.hairline);
  doc.setLineWidth(0.3);
  doc.rect(x - 2, y - 2, size + 4, size + 4, 'S');

  setFill(doc, COLORS.navy);
  for (let r = 0; r < count; r += 1) {
    for (let c = 0; c < count; c += 1) {
      if (matrix[r][c]) {
        // +0.02 evita hairlines blancas entre celdas al imprimir.
        doc.rect(x + c * cell, y + r * cell, cell + 0.02, cell + 0.02, 'F');
      }
    }
  }
};

/** Línea de firma con nombre y cargo. */
const drawSignature = (doc, cx, y, signature) => {
  setStroke(doc, COLORS.navy);
  doc.setLineWidth(0.4);
  doc.line(cx - 28, y, cx + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setText(doc, COLORS.navy);
  doc.text(signature.name, cx, y + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  setText(doc, COLORS.muted);
  doc.text(signature.role, cx, y + 9.5, { align: 'center' });
};

/** Bloque etiqueta + valor de la fila de metadatos. */
const drawMeta = (doc, cx, y, label, value, mono = false) => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  setText(doc, COLORS.muted);
  spacedText(doc, label.toUpperCase(), cx, y, 0.5, { align: 'center' });

  doc.setFont(mono ? 'courier' : 'helvetica', 'bold');
  doc.setFontSize(9.5);
  setText(doc, COLORS.navy);
  doc.text(value, cx, y + 5.5, { align: 'center' });
};

// ---------------------------------------------------------------------------
// Composición
// ---------------------------------------------------------------------------

/**
 * Dibuja el diploma completo sobre `doc`.
 *
 * @param {object} doc      Instancia de jsPDF en A4 apaisado.
 * @param {object} options  Datos del certificado, textos e imágenes.
 */
export const drawCertificate = (doc, options) => {
  const {
    studentName,
    certNumber,
    issuedDate,
    courseName,
    verifyUrl,
    qrMatrix,
    images = {},
    signatures = [],
    strings,
  } = options;

  const { W } = PAGE;
  const CX = W / 2;

  drawFrame(doc);
  drawGuilloche(doc, CX, 95);

  // --- Encabezado institucional -------------------------------------------
  // El rótulo encabeza la banda: primero se enuncia el aval, luego las marcas.
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  setText(doc, COLORS.muted);
  spacedText(doc, strings.endorsement.toUpperCase(), CX, 21, 0.7, { align: 'center' });

  drawInstitutions(doc, images, 25);

  // --- Título --------------------------------------------------------------
  const titleText = strings.title.toUpperCase();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  setText(doc, COLORS.gold);
  spacedText(doc, titleText, CX, 52, 2.6, { align: 'center' });

  drawOrnament(doc, CX, 57.5, measure(doc, titleText, 2.6) / 2);

  // Nombre del curso (permite dos líneas).
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  setText(doc, COLORS.navy);
  const courseLines = doc.splitTextToSize(courseName, 210);
  courseLines.slice(0, 2).forEach((line, i) => {
    doc.text(line, CX, 69 + i * 7.5, { align: 'center' });
  });
  const afterCourse = 69 + Math.min(courseLines.length, 2) * 7.5;

  // --- Destinatario --------------------------------------------------------
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setText(doc, COLORS.muted);
  doc.text(strings.awardedTo, CX, afterCourse + 6, { align: 'center' });

  const nameY = afterCourse + 22;
  doc.setFont('helvetica', 'bold');
  const nameSize = fitFontSize(doc, studentName, 200, 30, 14);
  setText(doc, COLORS.navy);
  doc.text(studentName, CX, nameY, { align: 'center' });

  const nameWidth = Math.max(doc.getTextWidth(studentName) + 24, 90);
  setStroke(doc, COLORS.gold);
  doc.setLineWidth(0.6);
  doc.line(CX - nameWidth / 2, nameY + 5, CX + nameWidth / 2, nameY + 5);
  doc.setFontSize(nameSize); // deja el tamaño coherente con lo dibujado

  // --- Cuerpo --------------------------------------------------------------
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  setText(doc, COLORS.ink);
  const bodyLines = doc.splitTextToSize(strings.body, 195);
  bodyLines.slice(0, 3).forEach((line, i) => {
    doc.text(line, CX, nameY + 15 + i * 6, { align: 'center' });
  });

  // --- Separador -----------------------------------------------------------
  setStroke(doc, COLORS.hairline);
  doc.setLineWidth(0.3);
  doc.line(30, 131, W - 30, 131);

  // --- Zona de validación --------------------------------------------------
  drawQr(doc, qrMatrix, 31, 141, 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  setText(doc, COLORS.muted);
  doc.text(strings.scanToVerify, 43, 169.5, { align: 'center' });

  if (signatures[0]) drawSignature(doc, 122, 157, signatures[0]);
  if (signatures[1]) drawSignature(doc, 196, 157, signatures[1]);

  drawSeal(doc, 255, 155, strings);

  // --- Metadatos -----------------------------------------------------------
  setStroke(doc, COLORS.hairline);
  doc.setLineWidth(0.3);
  doc.line(30, 176, W - 30, 176);

  drawMeta(doc, 78, 183, strings.issueDate, issuedDate);
  drawMeta(doc, 148.5, 183, strings.certNumber, certNumber, true);
  drawMeta(doc, 219, 183, strings.modality, strings.modalityValue);

  // --- Pie -----------------------------------------------------------------
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  setText(doc, COLORS.muted);
  doc.text(strings.footer, CX, 193.5, { align: 'center' });

  doc.setFont('courier', 'normal');
  doc.setFontSize(6);
  setText(doc, COLORS.teal);
  doc.text(verifyUrl, CX, 197.5, { align: 'center' });

  return doc;
};

export default drawCertificate;
