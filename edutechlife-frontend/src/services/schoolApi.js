// Colegios (piloto): el padre liga a su hijo con el código del colegio y el
// rector consulta el resumen de su colegio. Backend: /api/institutions.
import { API_BASE_URL } from "../config/api";

async function request(path, { authToken, method = "GET", body } = {}) {
  if (!authToken) return { ok: false, status: 401, error: null };
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return res.ok
      ? { ok: true, status: res.status, data }
      : { ok: false, status: res.status, error: data.error || null };
  } catch {
    return { ok: false, status: 0, error: null };
  }
}

/** Liga al estudiante con el código del colegio. */
export function joinSchool(authToken, { studentId, code }) {
  return request("/api/institutions/join", {
    authToken,
    method: "POST",
    body: { studentId, code },
  });
}

/** Resumen del colegio para rector o docente. */
export function fetchSchoolOverview(authToken) {
  return request("/api/institutions/my/overview", { authToken });
}
