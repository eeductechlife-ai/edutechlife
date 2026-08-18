export async function parsePDF(file) {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.7.284/pdf.worker.min.mjs`;
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text.trim();
}

export function parseTXT(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Error al leer el archivo TXT"));
    reader.readAsText(file);
  });
}

export async function parseDOCX(file) {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return (value || "").trim();
}

export async function parseImage(file) {
  const Tesseract = await import("tesseract.js");
  try {
    // Try Spanish + English — Colombian docs often mix both
    const result = await Tesseract.recognize(file, "spa+eng", {
      logger: () => {},
    });
    return result.data.text.trim();
  } catch {
    // Fallback to Spanish only
    const result = await Tesseract.recognize(file, "spa", { logger: () => {} });
    return result.data.text.trim();
  }
}

export async function extractDocumentText(file) {
  const type = file.type || "";
  const name = file.name.toLowerCase();

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    const text = await parsePDF(file);
    if (!text) throw new Error("No se pudo extraer texto del PDF");
    return text;
  }

  if (type === "text/plain" || name.endsWith(".txt")) {
    return await parseTXT(file);
  }

  if (
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    const text = await parseDOCX(file);
    if (!text) throw new Error("No se pudo extraer texto del documento Word");
    return text;
  }

  if (type.startsWith("image/") || /\.(jpg|jpeg|png)$/i.test(name)) {
    const text = await parseImage(file);
    if (!text) throw new Error("No se pudo extraer texto de la imagen");
    return text;
  }

  throw new Error(
    "Formato de archivo no soportado. Usa PDF, DOCX, TXT, JPG o PNG.",
  );
}

export function getFileIcon(fileName) {
  const name = fileName.toLowerCase();
  if (name.endsWith(".pdf")) return "📄";
  if (name.endsWith(".docx") || name.endsWith(".doc")) return "📘";
  if (name.endsWith(".txt")) return "📝";
  if (/\.(jpg|jpeg|png)$/i.test(name)) return "🖼️";
  return "📁";
}
