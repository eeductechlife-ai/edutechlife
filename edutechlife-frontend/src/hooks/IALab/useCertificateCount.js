import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

/**
 * Cuenta de certificados emitidos, para prueba social real.
 *
 * Devuelve `null` mientras carga o si no se puede leer (RLS/errores), y el
 * número real cuando la consulta funciona. Los consumidores deben ocultar la
 * cifra si es null en vez de mostrar un número inventado.
 */
export function useCertificateCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { count: total, error } = await supabase
          .from("certificates")
          .select("id", { count: "exact", head: true });
        if (!cancelled && !error && typeof total === "number") {
          setCount(total);
        }
      } catch {
        /* sin datos: se mantiene null */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}

export default useCertificateCount;
