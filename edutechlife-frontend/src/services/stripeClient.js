import { API_BASE_URL } from "../config/api";
const API_BASE = API_BASE_URL;

export async function getPlans() {
  const res = await fetch(`${API_BASE}/api/stripe/plans`);
  if (!res.ok) throw new Error("Error al obtener planes");
  const data = await res.json();
  return data.plans;
}

export async function createCheckoutSession(planId) {
  const token = await getAuthToken();
  if (!token) throw new Error("No autenticado");

  const res = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ planId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error de conexión" }));
    throw new Error(err.error || "Error al crear sesión de pago");
  }

  return res.json();
}

async function getAuthToken() {
  if (typeof window === "undefined") return null;

  // La app autentica con Supabase: el token vive en sessionStorage (auth_token).
  // Clerk quedó como fallback por compatibilidad con sesiones antiguas.
  try {
    const supabaseToken = sessionStorage.getItem("auth_token");
    if (supabaseToken) return supabaseToken;
  } catch {
    /* localStorage no disponible */
  }

  if (window.Clerk?.session) {
    try {
      return await window.Clerk.session.getToken();
    } catch {
      return null;
    }
  }

  return null;
}
