import { useEffect, useRef } from "react";

// Segundos que una noticia debe quedar abierta para que cuente como leída.
// Antes los puntos se daban al abrirla, y 15 clics daban 225 puntos sin leer nada.
export const MIN_READ_MS = 15000;

/**
 * Llama a `onEarn(article)` cuando la noticia abierta lleva `minMs` abierta y
 * todavía no estaba leída. Cerrarla antes no da nada.
 */
export function useReadReward(
  openArticle,
  readIds,
  onEarn,
  minMs = MIN_READ_MS,
) {
  const latest = useRef({ readIds, onEarn });
  latest.current = { readIds, onEarn };

  const id = openArticle?.id;
  useEffect(() => {
    if (!openArticle || latest.current.readIds.includes(id)) return undefined;
    const timer = setTimeout(() => {
      if (!latest.current.readIds.includes(id))
        latest.current.onEarn(openArticle);
    }, minMs);
    return () => clearTimeout(timer);
    // Solo reinicia el reloj al abrir otra noticia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, minMs]);
}
