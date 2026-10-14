import { API_BASE_URL } from "../config/api";
import { readAuthIdentity } from "../hooks/useAuthIdentity";
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

/**
 * Inicia el pago de un plan: primero Wompi (pesos, PSE, Nequi, tarjeta) y, si
 * el backend responde que Wompi no está configurado (503) o el plan no es en
 * pesos, cae a Stripe. Devuelve { url } para redirigir.
 */
export async function startCheckout(planId) {
  const token = await getAuthToken();
  if (!token) throw new Error("No autenticado");

  try {
    const res = await fetch(`${API_BASE}/api/payments/wompi/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.url) return data;
    }
  } catch {
    /* sin conexión con Wompi: se intenta Stripe */
  }

  return createCheckoutSession(planId);
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
