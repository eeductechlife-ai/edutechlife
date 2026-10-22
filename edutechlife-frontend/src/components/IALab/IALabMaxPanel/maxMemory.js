// Memoria de Max por usuario: el servidor guarda un resumen corto cada 6 turnos.
// Solo para usuarios con sesión; sin sesión (401) no pasa nada y Max sigue igual.
import { API_BASE_URL } from "../../../config/api";

const authHeaders = () => {
  let token = null;
  try {
    token = sessionStorage.getItem("auth_token");
  } catch {
    /* sin acceso a storage */
  }
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/** Resumen guardado para este usuario, o "" si no hay o no hay sesión. */
export async function fetchMaxMemorySummary() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/agents/max/memory`, {
      headers: authHeaders(),
    });
    if (!res.ok) return "";
    const data = await res.json();
    return typeof data.summary === "string" ? data.summary : "";
  } catch {
    return "";
  }
}

/** Reporta el último intercambio. Los últimos 6 mensajes bastan para el resumen. */
export async function reportMaxTurns(messages) {
  try {
    const turns = (messages || []).slice(-6).map((m) => ({
      role: m.type === "user" ? "user" : "assistant",
      content: String(m.content ?? ""),
    }));
    await fetch(`${API_BASE_URL}/api/agents/max/memory/turns`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ messages: turns }),
    });
  } catch {
    /* la memoria es un extra: si falla, Max sigue funcionando */
  }
}

/** Borra la memoria del usuario (derecho de supresión). */
export async function clearMaxMemory() {
  const res = await fetch(`${API_BASE_URL}/api/agents/max/memory`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("No pudimos borrar la memoria.");
}
