import { jsPDF } from "jspdf";

/**
 * Generate a progress PDF report for a student
 * @param {Object} studentData - Student data including name, grade, school, progress, badges
 * @returns {Promise<void>}
 */
export async function generateProgressPDF(studentData) {
  const {
    name = "Estudiante",
    grade = "6",
    school = "Escuela",
    totalPoints = 0,
    completedModules = [],
    unlockedBadges = [],
    attendanceDays = 0,
    darkMode = false,
  } = studentData;

  // Create PDF
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Colors
  const colors = {
    primary: "#4DA8C4",
    secondary: "#FFD166",
    accent: "#FF6B9D",
    text: darkMode ? "#E2F0FF" : "#004B63",
    lightText: darkMode ? "#94A3B8" : "#64748B",
    bg: darkMode ? "#0F172A" : "#F8FAFC",
  };

  // Helper functions
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const setColor = (hex) => {
    const rgb = hexToRgb(hex);
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
  };

  const setFillColor = (hex) => {
    const rgb = hexToRgb(hex);
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
  };

  // Page 1: Header & Summary
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Set background
  if (!darkMode) {
    setFillColor("#F8FAFC");
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  }

  // Header: Student Name & Info
  doc.setFontSize(24);
  setColor(colors.primary);
  doc.text("REPORTE DE PROGRESO ACADÉMICO", margin, 30);

  doc.setFontSize(16);
  setColor(colors.text);
  doc.text(`Estudiante: ${name}`, margin, 45);

  doc.setFontSize(11);
  setColor(colors.lightText);
  doc.text(`Grado: ${grade}`, margin, 53);
  doc.text(`Institución: ${school}`, margin, 60);

  // Date
  const date = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(9);
  doc.text(`Fecha: ${date}`, margin, 67);

  // Divider
  setFillColor(colors.primary);
  doc.rect(margin, 72, pageWidth - 2 * margin, 0.5, "F");

  // Summary Stats
  doc.setFontSize(12);
  setColor(colors.text);
  doc.text("RESUMEN DE DESEMPEÑO", margin, 85);

  const statBoxes = [
    { label: "Puntos Totales", value: totalPoints, icon: "⭐" },
    { label: "Módulos Completados", value: completedModules.length, icon: "✓" },
    {
      label: "Insignias Desbloqueadas",
      value: unlockedBadges.length,
      icon: "🏅",
    },
    { label: "Días de Asistencia", value: attendanceDays, icon: "📅" },
  ];

  let yPos = 95;
  const boxWidth = (pageWidth - 2 * margin - 6) / 2;

  for (let i = 0; i < statBoxes.length; i++) {
    const box = statBoxes[i];
    const xPos = margin + (i % 2) * (boxWidth + 6);

    if (i > 0 && i % 2 === 0) {
      yPos += 28;
    }

    // Box background
    setFillColor(colors.primary);
    doc.rect(xPos, yPos, boxWidth, 22, "F");

    // Box content
    setColor("#FFFFFF");
    doc.setFontSize(14);
    doc.text(`${box.icon}`, xPos + 8, yPos + 14);

    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text(`${box.value}`, xPos + boxWidth - 10, yPos + 14, {
      align: "right",
    });

    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    setColor("#FFFFFF");
    doc.text(box.label, xPos + 8, yPos + 20);
  }

  // Page 2: Detailed Modules
  if (completedModules.length > 0) {
    doc.addPage();

    doc.setFontSize(16);
    setColor(colors.text);
    doc.text("MÓDULOS COMPLETADOS", margin, 30);

    let moduleY = 45;

    completedModules.forEach((module, idx) => {
      // Module name
      doc.setFontSize(12);
      setColor(colors.primary);
      doc.text(`${idx + 1}. ${module.name || "Módulo"}`, margin, moduleY);

      // Progress bar
      const progress = module.progress || 100;
      const barWidth = pageWidth - 2 * margin;
      const barHeight = 4;

      // Background bar
      setFillColor("#E0E0E0");
      doc.rect(margin, moduleY + 5, barWidth, barHeight, "F");

      // Progress bar
      const progressColor =
        progress === 100
          ? colors.secondary
          : progress >= 75
            ? colors.primary
            : colors.accent;
      setFillColor(progressColor);
      doc.rect(
        margin,
        moduleY + 5,
        (barWidth * progress) / 100,
        barHeight,
        "F",
      );

      // Progress text
      doc.setFontSize(9);
      setColor(colors.lightText);
      doc.text(`${progress}% completado`, margin + barWidth + 5, moduleY + 8);

      moduleY += 18;

      // Check for page break
      if (moduleY > pageHeight - 30) {
        doc.addPage();
        moduleY = 30;
      }
    });
  }

  // Page for Badges
  if (unlockedBadges.length > 0) {
    doc.addPage();

    doc.setFontSize(16);
    setColor(colors.text);
    doc.text("INSIGNIAS DESBLOQUEADAS", margin, 30);

    let badgeY = 45;
    let badgesPerRow = 3;
    const badgeBoxWidth = (pageWidth - 2 * margin - 2 * 4) / badgesPerRow;
    let badgeInRow = 0;

    unlockedBadges.forEach((badge, idx) => {
      const xPos = margin + badgeInRow * (badgeBoxWidth + 4);

      // Badge box
      setFillColor(colors.secondary);
      doc.rect(xPos, badgeY, badgeBoxWidth, badgeBoxWidth + 10, "F");

      // Badge icon/emoji (if applicable)
      doc.setFontSize(24);
      setColor("#FFFFFF");
      doc.text(badge.icon || "🏅", xPos + badgeBoxWidth / 2, badgeY + 15, {
        align: "center",
      });

      // Badge name
      doc.setFontSize(8);
      setColor("#FFFFFF");
      doc.setFont(undefined, "bold");
      doc.text(badge.name || "Badge", xPos + 2, badgeY + badgeBoxWidth + 6, {
        maxWidth: badgeBoxWidth - 4,
        align: "center",
      });

      badgeInRow++;

      if (badgeInRow >= badgesPerRow) {
        badgeInRow = 0;
        badgeY += badgeBoxWidth + 14;

        if (badgeY > pageHeight - 40) {
          doc.addPage();
          badgeY = 30;
        }
      }
    });
  }

  // Final Page: Certificate
  doc.addPage();

  // Decorative border
  const borderMargin = 15;
  setFillColor(colors.primary);
  doc.rect(
    borderMargin,
    borderMargin,
    pageWidth - 2 * borderMargin,
    pageHeight - 2 * borderMargin,
    "S",
  );

  // Certificate title
  doc.setFontSize(28);
  setColor(colors.primary);
  doc.setFont(undefined, "bold");
  doc.text("CERTIFICADO DE ASISTENCIA", pageWidth / 2, 50, { align: "center" });

  // Certificate text
  doc.setFontSize(14);
  setColor(colors.text);
  doc.setFont(undefined, "normal");
  doc.text("Se otorga este certificado a", pageWidth / 2, 70, {
    align: "center",
  });

  doc.setFontSize(20);
  setColor(colors.accent);
  doc.setFont(undefined, "bold");
  doc.text(name, pageWidth / 2, 85, { align: "center" });

  doc.setFontSize(12);
  setColor(colors.text);
  doc.setFont(undefined, "normal");
  doc.text(
    `Por haber completado ${attendanceDays} días de aprendizaje exitoso`,
    pageWidth / 2,
    100,
    { align: "center", maxWidth: pageWidth - 40 },
  );

  // Stats in certificate
  doc.setFontSize(11);
  setColor(colors.lightText);
  doc.text(`Total de puntos obtenidos: ${totalPoints}`, pageWidth / 2, 120, {
    align: "center",
  });
  doc.text(
    `Módulos completados: ${completedModules.length}`,
    pageWidth / 2,
    128,
    {
      align: "center",
    },
  );
  doc.text(
    `Insignias desbloqueadas: ${unlockedBadges.length}`,
    pageWidth / 2,
    136,
    {
      align: "center",
    },
  );

  // Signature line
  const lineY = 155;
  setFillColor(colors.lightText);
  doc.line(40, lineY, 90, lineY);
  doc.line(pageWidth - 90, lineY, pageWidth - 40, lineY);

  doc.setFontSize(9);
  setColor(colors.lightText);
  doc.text("Firma del Estudiante", 50, lineY + 8, { align: "center" });
  doc.text("Firma del Instituto", pageWidth - 50, lineY + 8, {
    align: "center",
  });

  // Date and seal
  doc.setFontSize(10);
  setColor(colors.lightText);
  doc.text(`${date}`, pageWidth / 2, 175, { align: "center" });

  // Download
  const fileName = `Reporte_Progreso_${name}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
}

/**
 * Simple wrapper to call generateProgressPDF
 * @param {Object} studentData
 */
export const downloadProgressPDF = (studentData) => {
  generateProgressPDF(studentData);
};

export default generateProgressPDF;
