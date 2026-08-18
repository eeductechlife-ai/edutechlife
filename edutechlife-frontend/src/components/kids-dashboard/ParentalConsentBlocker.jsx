import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthIdentity, signOutUser } from "../../hooks/useAuthIdentity";
import SmartBoardLoadingSkeleton from "./SmartBoardLoadingSkeleton";
import { API_BASE_URL as API_BASE } from "../../config/api";

/**
 * Puerta de entrada de SmartBoard.
 * - Si el backend confirma verification_status === 'verified' → acceso directo.
 * - En cualquier otro caso (error, pendiente, requerido) → pantalla
 *   "Comenzar a trabajar" que inicia sesión y notifica a padres en tiempo real.
 */
const ParentalConsentBlocker = ({ children }) => {
  const { token, isLoaded, isSignedIn } = useAuthIdentity();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [isStarting, setIsStarting] = useState(false);
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
    const data = await fetchStatus();
    if (data?.verification_status === "verified") {
      setStatus("open");
    } else {
      setStatus("start");
    }
  }, [fetchStatus]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate("/sign-up/smartboard", { replace: true });
      return;
    }
    if (!token) return;

    checkGate();

    pollRef.current = setInterval(() => {
      fetchStatus().then((data) => {
        if (data?.verification_status === "verified") setStatus("open");
      });
    }, 10000);

    return () => clearInterval(pollRef.current);
  }, [isLoaded, isSignedIn, token, checkGate, fetchStatus, navigate]);

  const handleLogout = useCallback(() => {
    signOutUser("/", navigate);
  }, [navigate]);

  const handleStartWork = async () => {
    setIsStarting(true);
    try {
      const { supabase } = await import("../../lib/supabase");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        supabase
          .channel(`parent-updates-${user.id}`)
          .send({
            type: "broadcast",
            event: "student_session",
            payload: {
              type: "session_started",
              student_id: user.id,
              start_time: new Date().toISOString(),
            },
          })
          .catch(() => {});
      }
    } catch {
      // Fail silently — no bloquear al estudiante
    }
    setStatus("open");
  };

  if (status === "loading") {
    return (
      <div className="bg-[#F8FAFC] min-h-screen">
        <SmartBoardLoadingSkeleton darkMode={false} />
      </div>
    );
  }

  if (status === "open") return children;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0077B6] via-[#00B4D8] to-[#48CAE4] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-3xl">
          🚀
        </div>

        <h1 className="text-2xl font-black text-[#004B63] mb-2">
          ¡Bienvenido a SmartBoard!
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed mb-8">
          Tus padres verán tu progreso en tiempo real mientras trabajas. ¡Haz
          clic para comenzar!
        </p>

        <button
          onClick={handleStartWork}
          disabled={isStarting}
          className="min-h-[52px] w-full rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white font-bold text-lg py-3 px-4 hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isStarting ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Iniciando...
            </>
          ) : (
            <>▶ Comenzar a trabajar</>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="min-h-[44px] mt-4 w-full rounded-xl bg-transparent text-slate-400 font-medium py-2 px-4 hover:bg-slate-100 transition-colors text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default ParentalConsentBlocker;
