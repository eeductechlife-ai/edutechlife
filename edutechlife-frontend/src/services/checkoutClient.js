import { API_BASE_URL } from "../config/api";
import { readAuthIdentity } from "../hooks/useAuthIdentity";
const API_BASE = API_BASE_URL;

/**
 * Inicia el pago de un plan en pesos con Wompi (PSE, Nequi, tarjeta).
 * Devuelve { url } para redirigir. Si el backend responde con error, lo lanza
 * con el mensaje que envía el backend.
 */
export async function startCheckout(planId) {
  const token = await getAuthToken();
  if (!token) throw new Error("No autenticado");

  const res = await fetch(`${API_BASE}/api/payments/wompi/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ planId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error de conexión" }));
    throw new Error(err.error || "Error al iniciar el pago");
  }

  return res.json();
}

async function getAuthToken() {
  if (typeof window === "undefined") return null;

  // La app autentica con Supabase: el token vive en sessionStorage (auth_token).
  try {
    const supabaseToken = sessionStorage.getItem("auth_token");
    if (supabaseToken) return supabaseToken;
  } catch {
    /* localStorage no disponible */
  }

  // Respaldo: token recuperado de la sesión de Supabase (antes Clerk).
  try {
    return readAuthIdentity().token || null;
  } catch {
    return null;
  }
}
