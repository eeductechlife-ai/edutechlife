import { useState } from "react";

const SPONSORS = [
  { name: "Colciencias", initials: "CO", color: [0, 102, 179] },
  { name: "MinTIC", initials: "MT", color: [0, 153, 51] },
  { name: "Edutechlife", initials: "EL", color: [0, 75, 99] },
];

const useCertificatePDF = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async ({
    displayName,
    displayCertNumber,
    displayDate,
    courseName,
    courseFullName,
    t,
  }) => {
    setIsDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, "F");

      for (let x = 0; x < W; x++) {
        const ratio = x / W;
        const g = Math.round(75 + (188 - 75) * ratio);
        const b = Math.round(99 + (212 - 99) * ratio);
        doc.setFillColor(0, g, b);
        doc.rect(x, 0, 1, 18, "F");
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(t("certificate.edutechlife"), 15, 12);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("www.edutechlife.com", W - 15, 12, { align: "right" });

      doc.setDrawColor(255, 209, 102);
      doc.setLineWidth(2);
      doc.rect(10, 22, W - 20, H - 34, "S");
      doc.setLineWidth(0.5);
      doc.rect(13, 25, W - 26, H - 40, "S");

      [
        [13, 25],
        [W - 13, 25],
        [13, H - 15],
        [W - 13, H - 15],
      ].forEach(([cx, cy]) => {
        doc.setFillColor(255, 209, 102);
        doc.circle(cx, cy, 2.5, "F");
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(120);
      doc.setTextColor(0, 75, 99, 0.03);
      doc.text("E", W / 2, H / 2 + 20, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(36);
      doc.setTextColor(0, 75, 99);
      doc.text(t("certificate.title_pdf"), W / 2, 50, { align: "center" });
      doc.setDrawColor(0, 188, 212);
      doc.setLineWidth(0.8);
      doc.line(W / 2 - 30, 54, W / 2 + 30, 54);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.setTextColor(100, 116, 139);
      doc.text(courseFullName, W / 2, 63, { align: "center" });

      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text(t("certificate.awarded_to"), W / 2, 78, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(0, 75, 99);
      doc.text(displayName, W / 2, 93, { align: "center" });

      const nameW = doc.getTextWidth(displayName);
      doc.setDrawColor(0, 75, 99);
      doc.setLineWidth(0.5);
      doc.line(W / 2 - nameW / 2 - 5, 97, W / 2 + nameW / 2 + 5, 97);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text(t("certificate.completed_course"), W / 2, 108, {
        align: "center",
      });
      doc.text(
        t("certificate.outstanding_performance", { course: courseName }),
        W / 2,
        115,
        { align: "center" },
      );

      const sealX = W / 2 + 70;
      const sealY = 95;
      doc.setDrawColor(255, 209, 102);
      doc.setFillColor(255, 209, 102);
      doc.circle(sealX, sealY, 18, "F");
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(1);
      doc.circle(sealX, sealY, 16, "S");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(0, 75, 99);
      doc.text(t("certificate.verified_seal"), sealX, sealY - 2, {
        align: "center",
      });
      doc.text(t("certificate.edutechlife"), sealX, sealY + 4, {
        align: "center",
      });

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(25, 128, W - 25, 128);

      const footerY = 138;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);

      doc.text(t("certificate.issue_date_pdf"), W / 2 - 45, footerY, {
        align: "center",
      });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 75, 99);
      doc.text(displayDate, W / 2 - 45, footerY + 6, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(t("certificate.cert_number_pdf"), W / 2, footerY, {
        align: "center",
      });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 75, 99);
      doc.text(displayCertNumber, W / 2, footerY + 6, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(t("certificate.verified_pdf"), W / 2 + 45, footerY, {
        align: "center",
      });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 75, 99);
      doc.text(t("certificate.edutechlife"), W / 2 + 45, footerY + 6, {
        align: "center",
      });

      const sponsorY = footerY + 18;
      const sponsorStartX = W / 2 - (SPONSORS.length * 20) / 2;
      SPONSORS.forEach((s, i) => {
        const cx = sponsorStartX + i * 20 + 10;
        doc.setFillColor(s.color[0], s.color[1], s.color[2]);
        doc.circle(cx, sponsorY, 7, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(5);
        doc.setTextColor(255, 255, 255);
        doc.text(s.initials, cx, sponsorY + 1.5, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(4.5);
        doc.setTextColor(148, 163, 184);
        doc.text(s.name, cx, sponsorY + 10, { align: "center" });
      });

      for (let x = 0; x < W; x++) {
        const ratio = x / W;
        const g = Math.round(75 + (188 - 75) * ratio);
        const b = Math.round(99 + (212 - 99) * ratio);
        doc.setFillColor(0, g, b);
        doc.rect(x, H - 12, 1, 12, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(t("certificate.footer_pdf"), W / 2, H - 4, { align: "center" });

      doc.save(
        `${t("certificate.filename_prefix")}_${courseName.replace(/\s+/g, "_")}_${displayName.replace(/\s+/g, "_")}.pdf`,
      );
    } catch (err) {
      if (import.meta.env.DEV) console.error("Error generating PDF:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, handleDownloadPDF };
};

export default useCertificatePDF;
