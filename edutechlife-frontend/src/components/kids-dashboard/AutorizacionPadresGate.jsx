import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { API_BASE_URL as API_BASE } from "../../config/api";
import IngenIALoadingSkeleton from "./IngenIALoadingSkeleton";

const MENSAJE_ENVIADO =
  "Enviamos un correo a tu papá o mamá. El enlace dura 72 horas.";
const MENSAJE_SIN_VINCULO =
  "No encontramos un padre o madre vinculado a tu cuenta. Pídele a tu familia que se registre con este correo.";

/**
 * Puerta de IngenIA para estudiantes sin autorización de padre/madre.
 * Solo restringe si el backend responde restringido (CONSENTIMIENTO_PADRES
 * encendida y cuenta nueva). Con la variable apagada, o si no se puede
 * consultar el estado, muestra el dashboard como antes; el backend sigue
 * aplicando la restricción en la API.
 */
const AutorizacionPadresGate = ({ children }) => {
  const { token, isLoaded, isSignedIn } = useAuthIdentity();
  const [estado, setEstado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [pidiendo, setPidiendo] = useState(false);
  const autoPedidoRef = useRef(false);

  const pedirAutorizacion = async () => {
    setPidiendo(true);
    try {
      const res = await fetch(`${API_BASE}/api/ingenia/authorization/request`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.ok ? await res.json() : null;
      if (data?.estado === "pendiente") {
        setMensaje(MENSAJE_ENVIADO);
      } else if (data?.estado === "sin_vinculo") {
        setMensaje(MENSAJE_SIN_VINCULO);
      } else {
        setMensaje(
          "No pudimos enviar la solicitud. Intenta de nuevo en unos minutos.",
        );
      }
      setEstado((prev) =>
        prev ? { ...prev, estado: data?.estado || prev.estado } : prev,
      );
    } catch {
      setMensaje(
        "No pudimos enviar la solicitud. Intenta de nuevo en unos minutos.",
      );
    } finally {
      setPidiendo(false);
    }
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !token) return undefined;
    let cancelado = false;

    fetch(`${API_BASE}/api/ingenia/authorization/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelado) setEstado(data || { restringido: false });
      })
      .catch(() => {
        if (!cancelado) setEstado({ restringido: false });
      });

    return () => {
      cancelado = true;
    };
  }, [isLoaded, isSignedIn, token]);

  // Primera vez que el estudiante ve la pantalla: se pide la autorización una sola
  // vez (la referencia evita reintentos en bucle si la solicitud falla).
  useEffect(() => {
    if (
      estado?.restringido &&
      estado.estado === "sin_solicitud" &&
      !autoPedidoRef.current
    ) {
      autoPedidoRef.current = true;
      pedirAutorizacion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  if (!estado) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen">
        <IngenIALoadingSkeleton darkMode={false} />
      </div>
    );
  }

  if (!estado.restringido) return children;

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-10">
      <section
        aria-labelledby="autorizacion-padres-titulo"
        className="max-w-lg w-full bg-white rounded-2xl shadow-sm p-6 sm:p-8 text-center"
      >
        <h1
          id="autorizacion-padres-titulo"
          className="text-xl font-bold text-[#072F46] mb-3"
        >
          Tu papá o mamá debe autorizar tu acceso
        </h1>
        <p className="text-slate-600 leading-relaxed mb-6">
          Para proteger tus datos, un adulto de tu familia debe autorizar tu
          cuenta. Mientras tanto, puedes hacer tu diagnóstico VAK.
        </p>

        {mensaje && (
          <p
            role="status"
            className="text-sm text-[#004B63] bg-[#E6F4F8] rounded-lg p-3 mb-6"
          >
            {mensaje}
          </p>
        )}

        {estado.estado === "sin_vinculo" && !mensaje && (
          <p className="text-sm text-slate-600 mb-6">{MENSAJE_SIN_VINCULO}</p>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/vak"
            className="inline-flex items-center justify-center min-h-[44px] rounded-lg bg-[#004B63] px-6 py-3 font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#199DB9]"
          >
            Hacer mi diagnóstico VAK
          </Link>
          {estado.estado !== "sin_vinculo" && (
            <button
              type="button"
              onClick={pedirAutorizacion}
              disabled={pidiendo}
              className="min-h-[44px] rounded-lg border border-[#004B63] px-6 py-3 font-semibold text-[#004B63] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#199DB9]"
            >
              Volver a enviar la solicitud a mi papá o mamá
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default AutorizacionPadresGate;
