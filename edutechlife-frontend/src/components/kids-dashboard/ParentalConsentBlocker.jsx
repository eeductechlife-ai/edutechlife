import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthIdentity, signOutUser } from "../../hooks/useAuthIdentity";
import SmartBoardHabeasDataModal from "./SmartBoardHabeasDataModal";
import SmartBoardLoadingSkeleton from "./SmartBoardLoadingSkeleton";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "https://edutechlife-backend.onrender.com";

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
  const pollRef = useRef(null);

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
    if (!status) {
      setState({ status: "open", age: null, pendingEmail: null });
      return;
    }

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

    // Mientras esté pendiente, refresca cada 30s por si el padre ya verificó.
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      fetchStatus().then((status) => {
        if (status?.verification_status === "verified") {
          setState({ status: "open", age: null, pendingEmail: null });
        }
      });
    }, 30000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isLoaded, isSignedIn, token, checkGate, fetchStatus]);

  const handleLogout = useCallback(() => {
    signOutUser("/", navigate);
  }, [navigate]);

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
                ? "Enviando..."
                : resendState === "sent"
                  ? "Correo reenviado ✓"
                  : "Reenviar correo de confirmación"}
            </button>
            <button
              onClick={() => {
                checkGate();
                setResendState(null);
              }}
              className="min-h-[44px] w-full rounded-xl bg-[#E6F4F8] text-[#004B63] font-semibold py-3 px-4 hover:bg-[#d3eaf1] transition-colors"
            >
              Ya confirmó mi acudiente
            </button>
            {resendState === "error" && (
              <p className="text-xs text-red-500">
                No pudimos reenviar el correo. Intenta de nuevo.
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
