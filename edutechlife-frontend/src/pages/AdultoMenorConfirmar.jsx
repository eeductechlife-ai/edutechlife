import { useEffect, useState } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import { API_BASE_URL as API_BASE } from "../config/api";
import { useAuthIdentity } from "../hooks/useAuthIdentity";

const MENSAJES = {
  invalido: "Este enlace no es válido.",
  vencida: "Este enlace venció. Pide al menor que registre de nuevo su cuenta.",
  usada: "Este enlace ya fue usado. Tu vínculo ya está registrado.",
  correo_no_coincide: "Inicia sesión con el correo al que llegó la invitación.",
};

/**
 * Página a la que llega el padre, madre o acudiente desde el correo de
 * invitación. Debe tener sesión con el correo invitado; el servidor valida
 * el token, el correo y que el enlace no se haya usado ni vencido.
 *
 * Idioma: los textos están solo en español, sin pasar por i18n. Son texto
 * legal pendiente de revisión por el CEO y cumplimiento; traducir a en/pt
 * después de esa revisión.
 */
const AdultoMenorConfirmar = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  const token = params.get("token") || "";
  const { token: sesion, isLoaded, isSignedIn } = useAuthIdentity();
  const [estado, setEstado] = useState("cargando");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !sesion || !token) return;
    let cancelado = false;
    fetch(`${API_BASE}/api/auth/adulto-menor/confirmar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesion}`,
      },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (cancelado) return;
        if (res.ok) {
          setEstado("ok");
        } else {
          setEstado("error");
          setMensaje(MENSAJES[data.motivo] || data.error || MENSAJES.invalido);
        }
      })
      .catch(() => {
        if (cancelado) return;
        setEstado("error");
        setMensaje("No pudimos confirmar el vínculo. Intenta de nuevo.");
      });
    return () => {
      cancelado = true;
    };
  }, [isLoaded, isSignedIn, sesion, token]);

  const volver = `${location.pathname}${location.search}`;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#F4F9FB]">
      <section className="w-full max-w-md bg-white rounded-2xl shadow p-6 text-[#00374A]">
        <h1 className="text-xl font-semibold mb-3">
          Confirmar vínculo como padre, madre o acudiente
        </h1>

        {isLoaded && !isSignedIn && (
          <>
            <p className="mb-4 text-sm">
              Para confirmar, inicia sesión o crea tu cuenta de adulto con el
              correo al que llegó la invitación.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to={`/login?returnTo=${encodeURIComponent(volver)}`}
                className="text-center bg-[#004B63] text-white py-2.5 rounded-lg font-semibold"
              >
                Iniciar sesión
              </Link>
              <Link
                to={`/sign-up/ialab?returnTo=${encodeURIComponent(volver)}`}
                className="text-center border border-[#004B63] text-[#004B63] py-2.5 rounded-lg font-semibold"
              >
                Crear cuenta de adulto
              </Link>
            </div>
          </>
        )}

        {isLoaded && isSignedIn && !token && (
          <p className="text-sm text-red-700" role="alert">
            {MENSAJES.invalido}
          </p>
        )}

        {estado === "cargando" && isSignedIn && token && (
          <p className="text-sm">Confirmando el vínculo…</p>
        )}

        {estado === "ok" && (
          <p className="text-sm" role="status">
            Listo. Quedaste vinculado como padre, madre o acudiente de tu
            estudiante.
          </p>
        )}

        {estado === "error" && (
          <p className="text-sm text-red-700" role="alert">
            {mensaje}
          </p>
        )}
      </section>
    </main>
  );
};

export default AdultoMenorConfirmar;
