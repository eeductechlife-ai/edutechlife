/**
 * Carga de recursos del diploma (logos institucionales y código QR).
 * Separado de `certificatePdf.js` para que el trazado siga siendo puro y
 * verificable fuera del navegador.
 */

import { INSTITUTIONS } from './certificatePdf';

/**
 * Carga una imagen y la devuelve como PNG data URL, reescalada a `maxWidth`.
 * El reescalado es lo que evita que el PDF pese varios MB por incrustar el
 * wordmark original de 2972 px sin comprimir.
 */
export const loadImage = (src, maxWidth = 900) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const scale = Math.min(1, maxWidth / img.naturalWidth);
        const width = Math.max(1, Math.round(img.naturalWidth * scale));
        const height = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        // Fondo blanco: los logos se imprimen sobre papel, no sobre transparencia.
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve({ dataUrl: canvas.toDataURL('image/png'), width, height });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    img.src = src;
  });

/**
 * Resuelve los logos institucionales. Los que falten quedan sin entrada y la
 * banda dibuja su bloque tipográfico de respaldo.
 */
export const loadInstitutionLogos = async (timeoutMs = 3000) => {
  const entries = await Promise.all(
    INSTITUTIONS.map(async (inst) => {
      try {
        const image = await Promise.race([
          loadImage(inst.logo),
          new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs)),
        ]);
        return image ? [inst.id, image] : null;
      } catch {
        return null;
      }
    }),
  );
  return Object.fromEntries(entries.filter(Boolean));
};

/**
 * Convierte una URL en la matriz booleana de módulos del QR.
 * Devuelve `null` si la librería no está disponible, y el diploma se emite
 * igual pero sin código.
 */
export const buildQrMatrix = async (text) => {
  try {
    const { default: qrcode } = await import('qrcode-generator');
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const count = qr.getModuleCount();
    return Array.from({ length: count }, (_, r) =>
      Array.from({ length: count }, (_, c) => qr.isDark(r, c)),
    );
  } catch {
    return null;
  }
};
