import { API_BASE_URL } from "../config/api";

// El backend en el plan gratuito de Render se duerme tras 15 min sin tráfico y
// tarda 30-50 s en despertar. Se le avisa en cuanto el estudiante llega a una
// pantalla que lo va a necesitar (login, registro, curso), para que esté listo
// cuando pulse el botón. Una sola vez por sesión del navegador.
let warmed = false;

export const warmBackend = () => {
  if (warmed || typeof window === "undefined" || import.meta.env.DEV) return;
  warmed = true;
  try {
    fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      cache: "no-store",
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* sin red: el respaldo directo con Supabase se encarga */
  }
};

export default warmBackend;
