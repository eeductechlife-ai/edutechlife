// Respuesta del paso 2 del desafío (Módulo 5): pedido + resultado real de Claude + revisión.
// Se guarda como JSON { pedido, resultado, revision: [bool, bool, bool] }.
// Un texto plano (formato anterior) se trata como solo pedido, sin evidencia.
export const BRIEF_REVIEW_COUNT = 3;

const EMPTY = {
  pedido: "",
  resultado: "",
  revision: Array(BRIEF_REVIEW_COUNT).fill(false),
};

export function parseBriefEvidence(raw) {
  if (!raw) return { ...EMPTY, legacy: false };
  const text = String(raw).trim();
  if (text.startsWith("{")) {
    try {
      const data = JSON.parse(text);
      if (data && typeof data === "object" && "pedido" in data) {
        const revision = Array.isArray(data.revision)
          ? data.revision.slice(0, BRIEF_REVIEW_COUNT)
          : [];
        return {
          pedido: String(data.pedido || ""),
          resultado: String(data.resultado || ""),
          revision: Array.from(
            { length: BRIEF_REVIEW_COUNT },
            (_, i) => revision[i] === true,
          ),
          legacy: false,
        };
      }
    } catch {
      /* texto que parece JSON pero no lo es: se trata como pedido */
    }
  }
  return { ...EMPTY, pedido: raw, legacy: true };
}

export function encodeBriefEvidence({
  pedido = "",
  resultado = "",
  revision = [],
}) {
  return JSON.stringify({
    pedido,
    resultado,
    revision: Array.from(
      { length: BRIEF_REVIEW_COUNT },
      (_, i) => revision[i] === true,
    ),
  });
}
