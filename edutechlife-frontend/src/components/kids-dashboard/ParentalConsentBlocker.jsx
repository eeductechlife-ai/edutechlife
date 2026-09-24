import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import IngenIALoadingSkeleton from "./IngenIALoadingSkeleton";
import { supabase } from "../../lib/supabase";
import { API_BASE_URL as API_BASE } from "../../config/api";
import { track } from "../../lib/analytics";
import { EVENTS } from "../../lib/analyticsEvents";

/**
 * Puerta de entrada de SmartBoard.
 *
 * Decisión de producto (2026-09): el estudiante nunca espera aprobación en
 * vivo de sus padres para trabajar. El consentimiento parental verificado
 * (Ley 1581/2012, COPPA) sigue solicitándose una sola vez por email; mientras
 * se verifica, el estudiante entra directo y el padre recibe notificación de
 * cada sesión en tiempo real (canal `parent-updates-<studentId>`, igual que
 * SmartBoardConsentGate). Si nunca se ha solicitado consentimiento, se
 * dispara la solicitud una vez en segundo plano, sin bloquear la pantalla.
 */
const ParentalConsentBlocker = ({ children }) => {
  const { token, userId, isLoaded, isSignedIn } = useAuthIdentity();
  const navigate = useNavigate();
  const notifiedRef = useRef(false);

  const notifyParentSessionStart = useCallback(() => {
    if (!userId || notifiedRef.current) return;
    notifiedRef.current = true;
    try {
      supabase
        .channel(`parent-updates-${userId}`)
        .send({
          type: "broadcast",
          event: "student_session",
          payload: {
            type: "session_started",
            student_id: userId,
            start_time: new Date().toISOString(),
          },
        })
        .catch(() => {});
    } catch {
      // No bloquea el acceso del estudiante si el broadcast falla.
    }
  }, [userId]);

  const ensureConsentRequested = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/smartboard/parental-consent/status`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data?.verification_status === "verified") {
        track(EVENTS.CONSENT_COMPLETED, { studentId: userId });
      }
      if (data?.verification_status === "none") {
        // Dispara la solicitud una sola vez, en segundo plano. No bloquea
        // ni espera respuesta: es solo el inicio del trámite legal único.
        fetch(`${API_BASE}/api/smartboard/parental-consent/request`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    } catch {
      // Best-effort: si falla, no impacta el acceso del estudiante.
    }
  }, [token]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate("/sign-up/smartboard", { replace: true });
      return;
    }
    notifyParentSessionStart();
    ensureConsentRequested();
  }, [
    isLoaded,
    isSignedIn,
    navigate,
    notifyParentSessionStart,
    ensureConsentRequested,
  ]);

  const ready = isLoaded && isSignedIn;

  if (!ready) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen">
        <IngenIALoadingSkeleton darkMode={false} />
      </div>
    );
  }

  return children;
};

export default ParentalConsentBlocker;
