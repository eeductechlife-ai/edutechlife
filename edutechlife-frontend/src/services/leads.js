/**
 * Servicio único de leads: todos los formularios públicos envían aquí.
 * POST /api/leads en el backend (guarda en Supabase y avisa al equipo).
 * Añade la página, el referrer y los UTM de la visita.
 */
import { API_BASE_URL } from "../config/api";

const FIRST_TOUCH_KEY = "edutechlife_first_touch";
const SESSION_TOUCH_KEY = "edutechlife_session_touch";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"];

const leer = (storage, key) => {
  try {
    return JSON.parse(storage.getItem(key) || "null");
  } catch {
    return null;
  }
};

/** Al cargar la app: guarda la visita que trae UTM (primera y de esta sesión). */
export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const touch = {};
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) touch[k] = v.slice(0, 150);
    });
    if (Object.keys(touch).length === 0) return;
    touch.referrer = document.referrer.slice(0, 500) || null;
    touch.landing = window.location.pathname;
    touch.fecha = new Date().toISOString();
    sessionStorage.setItem(SESSION_TOUCH_KEY, JSON.stringify(touch));
    if (!localStorage.getItem(FIRST_TOUCH_KEY)) {
      localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(touch));
    }
  } catch {
    /* almacenamiento bloqueado (modo privado): se envía sin UTM */
  }
}

export function getAttribution() {
  const touch =
    leer(sessionStorage, SESSION_TOUCH_KEY) ||
    leer(localStorage, FIRST_TOUCH_KEY) ||
    {};
  return {
    pagina: window.location.pathname,
    referrer: document.referrer || touch.referrer || null,
    utm_source: touch.utm_source || null,
    utm_medium: touch.utm_medium || null,
    utm_campaign: touch.utm_campaign || null,
  };
}

export class LeadSubmitError extends Error {
  constructor(code) {
    super(`No se pudo enviar el lead (${code})`);
    this.name = "LeadSubmitError";
    this.code = code; // red | limite | invalido | servidor
  }
}

export async function submitLead(datos) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...datos, ...getAttribution() }),
    });
  } catch {
    throw new LeadSubmitError("red");
  }
  if (res.ok) return true;
  if (res.status === 429) throw new LeadSubmitError("limite");
  if (res.status === 400) throw new LeadSubmitError("invalido");
  throw new LeadSubmitError("servidor");
}
