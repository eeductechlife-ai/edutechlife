import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { API_BASE_URL as API_BASE } from "../../config/api";

/**
 * Aviso informativo (no bloqueante) para el padre/madre.
 * - Consulta el estado de consentimiento parental en segundo plano.
 * - Si aún no hay consentimiento, muestra un banner suave y envía
 *   la notificación al padre automáticamente (solo una vez).
 * - El estudiante entra al dashboard sin restricciones.
 */
const ParentalNoticeBar = () => {
  const { token, isLoaded, isSignedIn } = useAuthIdentity();
  const [visible, setVisible] = useState(false);
  const notified = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !token) return;

    const check = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/smartboard/parental-consent/status`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data?.verification_status !== "verified") {
          setVisible(true);
          if (!notified.current) {
            notified.current = true;
            fetch(`${API_BASE}/api/smartboard/parental-consent`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ notify: true }),
            }).catch(() => {});
          }
        }
      } catch {}
    };

    check();
  }, [isLoaded, isSignedIn, token]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-between gap-3 px-4 py-2 bg-[#004B63] text-white text-[12px] font-medium shadow-md"
          role="status"
          aria-live="polite"
        >
          <span className="flex items-center gap-2">
            <span aria-hidden="true">🔔</span>
            Hemos avisado a tus padres que ya estás en SmartBoard.
          </span>
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Cerrar aviso"
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ParentalNoticeBar;
