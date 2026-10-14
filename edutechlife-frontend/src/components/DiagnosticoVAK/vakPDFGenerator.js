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

  const fileName = `Mi_mapa_de_aprendizaje_${(diagnosis.studentName || "estudiante").replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}`;
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

/**
 * Genera el informe como Blob PDF para enviarlo por correo (no lo descarga).
 * Usa la vista previa ya en pantalla. Escala y calidad más bajas que la descarga
 * para mantenerlo bajo el límite de 2 MB del envío.
 */
// Un PDF real con contenido pesa mucho más que esto; por debajo es una hoja vacía.
const MIN_PDF_BYTES = 2048;

export async function generarInformePDF() {
  const el = document.getElementById("document-preview-content");
  if (!el || el.innerHTML.length < 100) {
    throw new Error("Abre la vista previa del informe antes de enviarlo.");
  }
  // Si el contenido no se ve (animación de entrada o panel oculto), html2canvas sale en blanco.
  if (el.getBoundingClientRect().height === 0) {
    throw new Error("La vista previa aún no está visible. Espera un momento e intenta de nuevo.");
  }
  const { default: html2pdf } = await import("html2pdf.js");
  const blob = await html2pdf()
    .set({
      margin: [15, 15, 15, 15],
      image: { type: "jpeg", quality: 0.9 },
      html2canvas: {
        scale: 2,
        width: 794,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(el)
    .outputPdf("blob");
  if (blob.size < MIN_PDF_BYTES) {
    throw new Error("No se pudo generar el informe. Intenta de nuevo.");
  }
  return blob;
}
