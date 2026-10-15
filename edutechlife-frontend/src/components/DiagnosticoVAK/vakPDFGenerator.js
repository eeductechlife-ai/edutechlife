import { buildVakReport } from "./vakReport";
import { INGENIA_QR_URL } from "./vakHelpers";

// Un PDF real con contenido pesa mucho más que esto; por debajo es una hoja vacía.
const MIN_PDF_BYTES = 2048;

/** Carga una imagen del sitio y la reduce a `width` px para que el PDF pese poco. */
const loadImage = (src, width) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const scale = Math.min(1, width / img.naturalWidth);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        canvas
          .getContext("2d")
          .drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(null);
      }
    };
    // Sin la imagen el informe sale igual, con texto en su lugar.
    img.onerror = () => resolve(null);
    img.src = src;
  });

let assetsPromise = null;
const loadAssets = () => {
  if (!assetsPromise) {
    assetsPromise = Promise.all([
      loadImage("/images/logo-edutechlife-email.png", 520),
      loadImage("/valeria.webp", 160),
      import("qrcode")
        .then(({ default: QRCode }) =>
          QRCode.toDataURL(INGENIA_QR_URL, { width: 240, margin: 1 }),
        )
        .catch(() => null),
    ]).then(([logo, avatar, qr]) => ({ logo, avatar, qr }));
  }
  return assetsPromise;
};

/**
 * Arma el informe como PDF vectorial (texto real, 2 páginas A4).
 * Lo usan la descarga y el envío por correo, así los dos son el mismo archivo.
 */
export async function buildInformeDoc({ diagnosis, parentName }) {
  const report = buildVakReport(diagnosis, {
    parentName,
    date: diagnosis?.date,
  });
  if (!report) throw new Error("No hay resultado para armar el informe.");
  const [{ jsPDF }, { drawVakReport }, assets] = await Promise.all([
    import("jspdf"),
    import("./vakReportPDF"),
    loadAssets(),
  ]);
  return { doc: drawVakReport(jsPDF, report, assets), report };
}

const fileNameFor = (report) =>
  `Mapa_de_aprendizaje_${report.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;

export async function generatePDF({
  diagnosis,
  parentName,
  t,
  setError,
  setPdfLoading,
}) {
  if (!diagnosis) {
    setError(t("vak.ui.pdf_error_no_data"));
    return;
  }
  setPdfLoading(true);
  try {
    const { doc, report } = await buildInformeDoc({ diagnosis, parentName });
    doc.save(fileNameFor(report));
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

/** Genera el informe como Blob PDF para enviarlo por correo (no lo descarga). */
export async function generarInformePDF({ diagnosis, parentName } = {}) {
  const { doc } = await buildInformeDoc({ diagnosis, parentName });
  const blob = doc.output("blob");
  if (blob.size < MIN_PDF_BYTES) {
    throw new Error("No se pudo generar el informe. Intenta de nuevo.");
  }
  return blob;
}
