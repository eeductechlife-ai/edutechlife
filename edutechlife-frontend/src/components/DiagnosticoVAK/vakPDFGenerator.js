import { STYLE_MAP } from "./vakStyles";

export async function generatePDF({ diagnosis, t, setError, setPdfLoading }) {
  if (!diagnosis) {
    setError(t("vak.ui.pdf_error_no_data"));
    return;
  }

  const el = document.getElementById("document-preview-content");
  if (!el) {
    setError(t("vak.ui.pdf_error_internal"));
    return;
  }

  const contentLength = el.innerHTML.length;
  if (!contentLength || contentLength < 100) {
    setError(t("vak.ui.pdf_error_empty"));
    return;
  }

  if (!diagnosis.styleDetails) {
    const recoveredStyle = STYLE_MAP[diagnosis.predominantStyle];
    if (recoveredStyle) {
      Object.assign(diagnosis, { styleDetails: recoveredStyle });
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  setPdfLoading(true);

  const fileName = `Diagnostico_VAK_${(diagnosis.studentName || "estudiante").replace(/\s+/g, "_")}_${diagnosis.date || new Date().toISOString().split("T")[0]}`;
  const opt = {
    margin: [15, 15, 15, 15],
    filename: `${fileName}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 3,
      width: 794,
      useCORS: true,
      letterRendering: true,
      logging: false,
      backgroundColor: "#ffffff",
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  try {
    const { default: html2pdf } = await import("html2pdf.js");
    await html2pdf().set(opt).from(el).save();
  } catch (e) {
    console.error("Error al generar PDF:", e);
    setError(
      t("vak.ui.pdf_generic_error", {
        message: e.message || "Error desconocido",
      }),
    );
  } finally {
    setPdfLoading(false);
  }
}
