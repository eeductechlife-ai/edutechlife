import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.7.284/pdf.worker.min.mjs`;

export async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text.trim();
}

export function parseTXT(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Error al leer el archivo TXT'));
    reader.readAsText(file);
  });
}

export async function parseImage(file) {
  const Tesseract = await import('tesseract.js');
  const { data: { text } } = await Tesseract.recognize(file, 'spa', {
    logger: () => {},
  });
  return text.trim();
}

export async function extractDocumentText(file) {
  const type = file.type || '';
  const name = file.name.toLowerCase();

  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    const text = await parsePDF(file);
    if (!text) throw new Error('No se pudo extraer texto del PDF');
    return text;
  }

  if (type === 'text/plain' || name.endsWith('.txt')) {
    return await parseTXT(file);
  }

  if (type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(name)) {
    const text = await parseImage(file);
    if (!text) throw new Error('No se pudo extraer texto de la imagen');
    return text;
  }

  throw new Error('Formato de archivo no soportado. Usa PDF, TXT, JPG o PNG.');
}

export function getFileIcon(fileName) {
  const name = fileName.toLowerCase();
  if (name.endsWith('.pdf')) return '📄';
  if (name.endsWith('.txt')) return '📝';
  if (/\.(jpg|jpeg|png)$/i.test(name)) return '🖼️';
  return '📁';
}
