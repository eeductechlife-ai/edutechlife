import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthIdentity, signOutUser } from "../../hooks/useAuthIdentity";
import SmartBoardHabeasDataModal from "./SmartBoardHabeasDataModal";
import SmartBoardLoadingSkeleton from "./SmartBoardLoadingSkeleton";
import { API_BASE_URL as API_BASE } from "../../config/api";

const MINOR_MAX_AGE = 18;

/**
 * Puerta de entrada de la SmartBoard: bloquea el dashboard mientras un
 * menor no tenga consentimiento parental verificado (COPPA / Ley 1581).
 *
 * Estados:
 *   loading   → skeleton
 *   open      → renderiza el dashboard (consentimiento verificado, adulto,
 *               o sin edad registrada — fallback adulto por defecto)
 *   pending   → pantalla "esperando verificación del padre" (re-envío)
 *   required  → pantalla de solicitud de consentimiento (modal Habeas Data)
 *
 * Fail-open deliberado: si el backend no responde, se deja entrar para no
 * dejar a los niños sin su herramienta de estudio por un fallo de red.
 */
const ParentalConsentBlocker = ({ children }) => {
  const { token, isLoaded, isSignedIn } = useAuthIdentity();
  const navigate = useNavigate();
  const [state, setState] = useState({
    status: "loading", // loading | open | pending | required
    age: null,
    pendingEmail: null,
  });
  const [resendState, setResendState] = useState(null); // null | sending | sent | error
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null); // Countdown 24h en segundos
  const pollRef = useRef(null);
  const countdownRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    if (!token) return null;
    try {
      const res = await fetch(
        `${API_BASE}/api/smartboard/parental-consent/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }, [token]);

  const checkGate = useCallback(async () => {
    const status = await fetchStatus();

    // SECURITY: Bloqueo estricto si backend no responde o error.
    // No hacer fail-open — el consentimiento es OBLIGATORIO para menores.
    if (!status) {
      console.warn(
        "[ParentalConsentBlocker] Backend error - blocking access until verified",
      );
      setState({ status: "required", age: null, pendingEmail: null });
      return;
    }

    // ÚNICA puerta de entrada: verification_status === 'verified'
    if (status.verification_status === "verified") {
      setState({ status: "open", age: status.student_age, pendingEmail: null });
      return;
    }

    let age = status.student_age ?? null;
    if (age === null) {
      try {
        const res = await fetch(`${API_BASE}/api/smartboard/student-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const profile = await res.json();
          age = profile.age ?? null;
        }
      } catch {
        // Sin perfil consultable — el fallback adulto decide abajo.
      }
    }

    if (age !== null && Number(age) < MINOR_MAX_AGE) {
      // Menor de edad: requiere consentimiento verificado
      console.log(
        `[ParentalConsentBlocker] Student age ${age} - consentimiento status: ${status.verification_status}`,
      );
      setState({
        status:
          status.verification_status === "pending" ? "pending" : "required",
        age: Number(age),
        pendingEmail: status.pending_email || null,
      });
      return;
    }

    setState({ status: "open", age, pendingEmail: null });
  }, [fetchStatus, token]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !token) return undefined;
    checkGate();

    // Mientras esté pendiente, refresca cada 10s por si el padre ya verificó.
    // UX mejorada: validación más rápida sin saturar el backend.
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      fetchStatus().then((status) => {
        if (status?.verification_status === "verified") {
          console.log(
            "[ParentalConsentBlocker] Padre verificó - abriendo acceso",
          );
          setState({ status: "open", age: null, pendingEmail: null });
        }
      });
    }, 10000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isLoaded, isSignedIn, token, checkGate, fetchStatus]);

  // Countdown 24h cuando el status es "pending"
  useEffect(() => {
    if (state.status !== "pending") {
      if (countdownRef.current) clearInterval(countdownRef.current);
      setTimeRemaining(null);
      return;
    }

    // Iniciar countdown en 24h = 86400 segundos
    setTimeRemaining(86400);

    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          console.warn(
            "[ParentalConsentBlocker] Token de consentimiento expirado",
          );
          // Opcionalmente: forzar re-request
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [state.status]);

  const handleLogout = useCallback(() => {
    signOutUser("/", navigate);
  }, [navigate]);

  const formatTimeRemaining = (seconds) => {
    if (!seconds) return null;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const handleResend = async () => {
    if (!token || !state.pendingEmail || state.age === null) return;
    setResendState("sending");
    try {
      const res = await fetch(`${API_BASE}/api/smartboard/parental-consent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parentEmail: state.pendingEmail,
          studentAge: state.age,
          timestamp: new Date().toISOString(),
        }),
      });
      setResendState(res.ok ? "sent" : "error");
    } catch {
      setResendState("error");
    }
  };

  const handleRequestConsent = async (data) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/smartboard/parental-consent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parentEmail: data.parentEmail,
          studentAge: state.age,
          timestamp: new Date().toISOString(),
        }),
      });
      setShowModal(false);
      setState((prev) => ({
        ...prev,
        status: res.ok ? "pending" : "required",
        pendingEmail: data.parentEmail,
      }));
      if (!res.ok) setResendState("error");
    } catch {
      setShowModal(false);
      setResendState("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.status === "loading") {
    return (
      <div className="bg-[#F8FAFC] min-h-screen">
        <SmartBoardLoadingSkeleton darkMode={false} />
      </div>
    );
  }

  if (state.status === "open") return children;

  const isPending = state.status === "pending";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E6F4F8] flex items-center justify-center text-3xl">
          {isPending ? "⏳" : "👨‍👩‍👧"}
        </div>

        <h1 className="text-xl font-bold text-[#004B63] mb-2">
          {isPending
            ? "Esperando la confirmación de tu acudiente"
            : "Necesitamos el permiso de tu acudiente"}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {isPending ? (
            <>
              Le enviamos un correo de confirmación a{" "}
              <strong className="break-all">{state.pendingEmail}</strong>.
              Cuando tu acudiente confirme el enlace, podrás entrar. Esto
              protege tus datos según la ley (COPPA / Ley 1581).
              <br />
              <span className="text-xs text-slate-500 mt-2 block">
                Enlace válido por:{" "}
                <strong>
                  {formatTimeRemaining(timeRemaining) || "Expirado"}
                </strong>
              </span>
            </>
          ) : (
            <>
              Por ser menor de 18 años, tu acudiente debe autorizar tu acceso a
              la SmartBoard. Solicita el permiso y te enviaremos el correo de
              confirmación.
            </>
          )}
        </p>

        {isPending ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleResend}
              disabled={resendState === "sending"}
              className="min-h-[44px] w-full rounded-xl bg-[#004B63] text-white font-semibold py-3 px-4 hover:bg-[#00394D] transition-colors disabled:opacity-60"
            >
              {resendState === "sending"
                ? "Reenviando..."
                : resendState === "sent"
                  ? "✓ Correo reenviado"
                  : "Reenviar correo a mi acudiente"}
            </button>
            <button
              onClick={() => {
                console.log(
                  "[ParentalConsentBlocker] Verificando consentimiento nuevamente...",
                );
                checkGate();
                setResendState(null);
              }}
              disabled={resendState === "sending"}
              className="min-h-[44px] w-full rounded-xl bg-[#E6F4F8] text-[#004B63] font-semibold py-3 px-4 hover:bg-[#d3eaf1] transition-colors disabled:opacity-60"
            >
              {resendState === "sending"
                ? "Verificando..."
                : "✓ Mi acudiente ya confirmó"}
            </button>
            {resendState === "error" && (
              <p className="text-xs text-red-500">
                No pudimos procesar tu solicitud. Intenta de nuevo en unos
                momentos.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="min-h-[44px] w-full rounded-xl bg-[#FB8500] text-white font-semibold py-3 px-4 hover:bg-[#e07600] transition-colors"
            >
              Solicitar permiso de mi acudiente
            </button>
            {resendState === "error" && (
              <p className="text-xs text-red-500">
                No se pudo registrar el consentimiento. Intenta de nuevo.
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="min-h-[44px] mt-6 w-full rounded-xl bg-transparent text-slate-500 font-medium py-2 px-4 hover:bg-slate-100 transition-colors text-sm"
        >
          Cerrar sesión
        </button>
      </div>

      {showModal && (
        <SmartBoardHabeasDataModal
          studentAge={state.age}
          onClose={() => setShowModal(false)}
          onAccept={handleRequestConsent}
        />
      )}

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="text-white text-center">
            <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin mx-auto mb-4"></div>
            <p>Guardando consentimiento...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentalConsentBlocker;
