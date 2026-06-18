export function generateVAKPDF(studentData, score) {
  return import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pw = 210;
    const m = 20;
    let y = m;

    doc.setFillColor(0, 75, 99);
    doc.rect(0, 0, pw, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Diagnostico VAK', pw / 2, 28, { align: 'center' });

    y = 55;
    doc.setTextColor(0, 75, 99);
    doc.setFontSize(13);
    doc.text(`Estudiante: ${studentData.name}`, m, y);
    y += 8;
    doc.text(`Edad: ${studentData.age} anos`, m, y);
    y += 8;
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, m, y);

    y += 15;
    doc.setDrawColor(77, 168, 196);
    doc.setLineWidth(0.5);

    for (const [style, meta] of Object.entries({
      visual: { label: 'Visual', color: [77, 168, 196] },
      auditivo: { label: 'Auditivo', color: [0, 75, 99] },
      kinestesico: { label: 'Kinesico', color: [102, 204, 204] },
    })) {
      const data = score.intervals[style];
      if (!data) continue;

      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.text(meta.label, m, y + 4);

      const barMax = pw - 2 * m - 80;
      const barW = Math.max(2, (data.score / 100) * barMax);

      doc.setFillColor(...meta.color);
      doc.roundedRect(m + 55, y, barW, 7, 2, 2, 'F');

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`${data.score} (IC: ${data.ci95.lower}-${data.ci95.upper})`, m + 60 + barW, y + 5);

      y += 12;
    }

    if (score.meanAlpha !== null) {
      y += 8;
      doc.setFontSize(11);
      doc.setTextColor(0, 75, 99);
      doc.text(`Confiabilidad: alpha = ${score.meanAlpha.toFixed(2)}`, m, y);
    }

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generado por Edutechlife VAK Diagnostic', pw / 2, 290, { align: 'center' });

    doc.save('diagnostico-vak.pdf');
    return doc;
  });
}
