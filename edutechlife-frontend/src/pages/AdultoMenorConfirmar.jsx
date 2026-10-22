import { useState } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import { API_BASE_URL as API_BASE } from "../config/api";
import { useAuthIdentity } from "../hooks/useAuthIdentity";

// Debe coincidir con VERSION_AUTORIZACION_VIGENTE del backend
// (services/activacionAdulto.js). Si cambia el texto, cambia la versión en ambos.
// TEXTO PENDIENTE DE REVISIÓN LEGAL.
const VERSION_AUTORIZACION = "adulto-menor-v1-2026-10-20";

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
  const [estado, setEstado] = useState("esperando");
  const [mensaje, setMensaje] = useState("");
  const [aceptaAutorizacion, setAceptaAutorizacion] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // El adulto debe marcar la autorización antes de activar: nunca se confirma
  // sola al cargar la página (decisión del CEO, 2026-10-15).
  const confirmar = async () => {
    if (!aceptaAutorizacion || enviando) return;
    setEnviando(true);
    setEstado("cargando");
    try {
      const res = await fetch(`${API_BASE}/api/auth/adulto-menor/confirmar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sesion}`,
        },
        body: JSON.stringify({
          token,
          aceptaAutorizacion: true,
          versionAutorizacion: VERSION_AUTORIZACION,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setEstado("ok");
      } else {
        setEstado("error");
        setMensaje(MENSAJES[data.motivo] || data.error || MENSAJES.invalido);
      }
    } catch {
      setEstado("error");
      setMensaje("No pudimos confirmar el vínculo. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

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

        {estado === "esperando" && isSignedIn && token && (
          <div className="flex flex-col gap-4">
            <p className="text-sm">
              Tu hijo o hija quiere usar IngenIA. Al confirmar, su cuenta queda
              activada una sola vez y podrá usar todas las herramientas de su
              plan sin volver a pedirte permiso. Cada vez que inicie sesión te
              enviaremos un aviso.
            </p>
            <label className="flex gap-3 text-sm items-start">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 shrink-0"
                checked={aceptaAutorizacion}
                onChange={(e) => setAceptaAutorizacion(e.target.checked)}
              />
              <span>
                Soy mayor de 18 años y padre, madre o acudiente de este
                estudiante. Autorizo el tratamiento de sus datos personales en
                IngenIA según la{" "}
                <a
                  href="https://edutechlife.co/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  política de privacidad
                </a>
                .
              </span>
            </label>
            <button
              type="button"
              onClick={confirmar}
              disabled={!aceptaAutorizacion || enviando}
              className="bg-[#004B63] text-white py-2.5 rounded-lg font-semibold disabled:opacity-50"
            >
              Confirmar y activar
            </button>
          </div>
        )}

        {estado === "cargando" && (
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
