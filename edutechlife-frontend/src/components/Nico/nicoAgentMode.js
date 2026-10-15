/**
 * Modo del agente Nico. Con VITE_NICO_SERVER_AGENT=true el prompt y las reglas
 * viven en el servidor (/api/agents/nico/stream) y el navegador solo manda la
 * conversación. Apagado por defecto: hasta activarlo, Nico funciona como antes.
 */
export const NICO_SERVER_AGENT_PATH = "/api/agents/nico/stream";

export function nicoUsesServerAgent() {
  return import.meta.env.VITE_NICO_SERVER_AGENT === "true";
}
