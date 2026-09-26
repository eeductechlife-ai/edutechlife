import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { API_BASE_URL as API_BASE } from "../../config/api";

const SEEN_KEY = "ingenia_parent_notice_seen";
const AUTO_HIDE_MS = 6000;

/**
 * Aviso informativo (no bloqueante): pide en segundo plano el consentimiento
 * parental y, solo si de verdad quedó enviado al padre, se lo cuenta al
 * estudiante una vez por sesión.
 */
const ParentalNoticeBar = () => {
  const { token, isLoaded, isSignedIn } = useAuthIdentity();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !token) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {}

    let cancelled = false;
    // Idempotent: resolves the parent's email server-side and only sends once.
    fetch(`${API_BASE}/api/ingenia/parental-consent/request`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || data?.verification_status !== "pending") return;
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        setVisible(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, token]);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
    return () => clearTimeout(id);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="fixed left-3 right-3 top-[calc(env(safe-area-inset-top,0px)+12px)] z-[70] mx-auto max-w-md flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#004B63] text-white text-[13px] font-semibold shadow-lg"
          role="status"
          aria-live="polite"
        >
          <span className="flex items-center gap-2 text-white">
            <span aria-hidden="true">🔔</span>
            Les contamos a tus papás que ya estás en IngenIA.
          </span>
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Cerrar aviso"
            className="flex-shrink-0 w-8 h-8 -mr-1 inline-flex items-center justify-center text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-full"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ParentalNoticeBar;
