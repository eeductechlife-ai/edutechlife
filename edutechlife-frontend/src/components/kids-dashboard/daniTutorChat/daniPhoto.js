import { API_BASE_URL } from "../../../config/api";

const MAX_SIDE = 1600;
const QUALITY = 0.85;
const MAX_INPUT_MB = 20;

// Phone photos are 3–10 MB; the API accepts ~4 MB. 1600 px keeps text legible.
export async function compressPhoto(file) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Eso no parece una foto. Elige una imagen.");
  }
  if (file.size > MAX_INPUT_MB * 1024 * 1024) {
    throw new Error("La foto es muy pesada. Prueba con otra.");
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", QUALITY);
}

/**
 * Reads the homework statement from a photo.
 * @returns {Promise<string>} transcribed text ("" when nothing legible)
 */
export async function readHomeworkPhoto(file, { token, signal } = {}) {
  if (!token)
    throw new Error("Tu sesión se cerró. Vuelve a iniciar sesión para seguir.");
  const imageBase64 = await compressPhoto(file);
  const res = await fetch(`${API_BASE_URL}/api/ingenia/dani/photo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ imageBase64 }),
    signal,
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403)
      throw new Error(
        "Tu sesión se cerró. Vuelve a iniciar sesión para seguir.",
      );
    if (res.status === 429)
      throw new Error("Enviaste muchas fotos seguidas. Espera un minuto.");
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || "No pude leer la foto. Intenta de nuevo.");
  }
  const { text } = await res.json();
  return (text || "").trim();
}

export function photoPrefill(text) {
  return `Esta es mi tarea (la leí de una foto):\n${text}\n\n¿Me ayudas a entenderla?`;
}
