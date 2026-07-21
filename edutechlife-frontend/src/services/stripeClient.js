const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getPlans() {
  const res = await fetch(`${API_BASE}/api/stripe/plans`);
  if (!res.ok) throw new Error('Error al obtener planes');
  const data = await res.json();
  return data.plans;
}

export async function createCheckoutSession(planId) {
  const token = await getAuthToken();
  if (!token) throw new Error('No autenticado');

  const res = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ planId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error de conexión' }));
    throw new Error(err.error || 'Error al crear sesión de pago');
  }

  return res.json();
}

async function getAuthToken() {
  if (typeof window !== 'undefined' && window.Clerk?.session) {
    try {
      return await window.Clerk.session.getToken();
    } catch {
      return null;
    }
  }
  return null;
}
