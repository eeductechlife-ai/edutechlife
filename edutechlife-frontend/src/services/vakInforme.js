/**
 * Envío del resumen del diagnóstico VAK al correo del adulto (POST /api/vak/informe).
 * Solo viajan el adulto y el estilo dominante/secundario: nunca el nombre del niño.
 * Si el envío falla lanza un Error con el texto real que devuelve el backend.
 */
import { API_BASE_URL } from "../config/api";

export async function enviarInformeVak(datos) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/vak/informe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
  } catch {
    throw new Error("No hay conexión. Revisa tu internet e intenta de nuevo.");
  }
  if (res.ok) return true;
  const data = await res.json().catch(() => ({}));
  throw new Error(
    data.error ||
      "No pudimos enviar el informe. Intenta de nuevo en unos minutos.",
  );
}
