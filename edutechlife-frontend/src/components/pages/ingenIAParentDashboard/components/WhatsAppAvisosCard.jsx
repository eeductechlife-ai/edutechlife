import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Check, Loader2, MessageCircle } from "lucide-react";
import { API_BASE_URL } from "../../../../config/api";

/**
 * WhatsAppAvisosCard
 * El padre recibe por WhatsApp un aviso cada vez que su hijo/a se conecta a
 * IngenIA y un informe semanal. Para activarlo acepta, da su número y lo
 * VERIFICA con un código que llega a ese WhatsApp (si no, un número mal escrito
 * o ajeno recibiría el nombre de un menor). Puede elegir qué avisos recibir y
 * darse de baja cuando quiera.
 *
 * Solo se muestra si el servidor tiene WhatsApp configurado. Falla en silencio:
 * nunca bloquea el resto del panel.
 *
 * Los textos están solo en español, sin pasar por i18n, y el texto de
 * consentimiento está pendiente de revisión legal (la versión debe coincidir
 * con la que devuelve el servidor).
 */

const MOTIVOS = {
  falta_aceptacion: "Marca la casilla para aceptar recibir los avisos.",
  telefono_invalido:
    "Escribe un número de WhatsApp válido, con indicativo (por ejemplo +57 300 111 2233).",
  no_es_padre:
    "Solo un padre, madre o acudiente vinculado puede activar los avisos.",
  espera: "Espera un minuto antes de pedir otro código.",
  no_se_pudo_enviar:
    "No pudimos enviar el código a ese número. Revísalo e intenta de nuevo.",
  codigo_incorrecto: "El código no es correcto.",
  codigo_vencido: "El código venció. Pide uno nuevo.",
  demasiados_intentos: "Demasiados intentos. Pide un código nuevo.",
  sin_solicitud: "Primero pide un código.",
  version_invalida: "El texto de autorización cambió. Recarga la página.",
  no_disponible: "Los avisos por WhatsApp aún no están disponibles.",
};

const textoDeError = (datos, estado) =>
  MOTIVOS[datos?.motivo] ||
  (estado === 429
    ? "Demasiados intentos. Espera un momento e intenta de nuevo."
    : null) ||
  "No pudimos completar la operación. Intenta de nuevo.";

const WhatsAppAvisosCard = ({ authToken }) => {
  // cargando | oculta | inactivo | verificando | activo
  const [vista, setVista] = useState("cargando");
  const [versionTexto, setVersionTexto] = useState("");
  const [prefs, setPrefs] = useState(null);
  const [telefono, setTelefono] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [cambiandoNumero, setCambiandoNumero] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");

  const llamar = useCallback(
    async (metodo, ruta, cuerpo) => {
      const res = await fetch(
        `${API_BASE_URL}/api/ingenia/padre/whatsapp${ruta}`,
        {
          method: metodo,
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: cuerpo ? JSON.stringify(cuerpo) : undefined,
        },
      );
      const datos = await res.json().catch(() => ({}));
      return { ok: res.ok, estado: res.status, datos };
    },
    [authToken],
  );

  const aplicar = useCallback((preferencias) => {
    setPrefs(preferencias);
    setVista(
      preferencias.activo
        ? "activo"
        : preferencias.verificacionPendiente
          ? "verificando"
          : "inactivo",
    );
  }, []);

  useEffect(() => {
    if (!authToken) return undefined;
    let cancelado = false;
    (async () => {
      try {
        const { ok, datos } = await llamar("GET", "");
        if (cancelado) return;
        if (!ok || !datos.disponible) {
          setVista("oculta");
          return;
        }
        setVersionTexto(datos.versionTexto);
        aplicar(datos.preferencias);
      } catch {
        if (!cancelado) setVista("oculta");
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [authToken, llamar, aplicar]);

  const ejecutar = async (accion) => {
    setError("");
    setOcupado(true);
    try {
      await accion();
    } catch {
      setError("No pudimos conectar con el servidor. Intenta de nuevo.");
    } finally {
      setOcupado(false);
    }
  };

  const pedirCodigo = () =>
    ejecutar(async () => {
      const { ok, estado, datos } = await llamar("POST", "/codigo", {
        telefono,
        acepta,
        version: versionTexto,
      });
      if (!ok) return setError(textoDeError(datos, estado));
      setCodigo("");
      setCambiandoNumero(false);
      setVista("verificando");
    });

  const confirmar = () =>
    ejecutar(async () => {
      const { ok, estado, datos } = await llamar("POST", "/confirmar", {
        codigo,
      });
      if (!ok) return setError(textoDeError(datos, estado));
      setCodigo("");
      setTelefono("");
      setAcepta(false);
      aplicar(datos.preferencias);
    });

  const cambiarAviso = (campo, valor) =>
    ejecutar(async () => {
      const { ok, estado, datos } = await llamar("PUT", "", { [campo]: valor });
      if (!ok) return setError(textoDeError(datos, estado));
      aplicar(datos.preferencias);
    });

  const desactivar = () =>
    ejecutar(async () => {
      const { ok, estado, datos } = await llamar("DELETE", "");
      if (!ok) return setError(textoDeError(datos, estado));
      setCambiandoNumero(false);
      aplicar(datos.preferencias);
    });

  if (vista === "oculta") return null;

  const mostrarFormulario = vista === "inactivo" || cambiandoNumero;

  return (
    <div
      className="bg-white rounded-xl border border-[#E2E8F0] p-5 mb-6"
      data-testid="whatsapp-avisos-card"
    >
      <h3 className="font-bold text-base text-[#004B63] flex items-center gap-2">
        <MessageCircle className="w-4 h-4" aria-hidden="true" />
        Avisos por WhatsApp
      </h3>
      <p className="text-sm text-[#475569] mt-1">
        Recibe un mensaje cada vez que tu hijo/a se conecte a IngenIA y un
        informe semanal de su actividad.
      </p>

      {vista === "cargando" && (
        <p className="text-sm text-[#475569] mt-3 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          Cargando…
        </p>
      )}

      {vista === "activo" && !cambiandoNumero && (
        <div className="mt-3 flex flex-col gap-3">
          <p className="text-sm text-emerald-700 flex items-center gap-2">
            <Check className="w-4 h-4" aria-hidden="true" />
            Activos en el WhatsApp {prefs?.telefonoVisible}
          </p>
          <label className="flex items-center gap-3 text-sm text-[#334155]">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={prefs?.avisoConexion}
              disabled={ocupado}
              onChange={(e) => cambiarAviso("avisoConexion", e.target.checked)}
            />
            Avisarme cuando mi hijo/a se conecte
          </label>
          <label className="flex items-center gap-3 text-sm text-[#334155]">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={prefs?.informeSemanal}
              disabled={ocupado}
              onChange={(e) => cambiarAviso("informeSemanal", e.target.checked)}
            />
            Enviarme el informe semanal
          </label>
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              className="text-sm text-[#004B63] underline min-h-[44px]"
              onClick={() => setCambiandoNumero(true)}
            >
              Cambiar número
            </button>
            <button
              type="button"
              className="text-sm text-red-700 underline min-h-[44px]"
              disabled={ocupado}
              onClick={desactivar}
            >
              Desactivar los avisos
            </button>
          </div>
        </div>
      )}

      {mostrarFormulario && vista !== "cargando" && vista !== "verificando" && (
        <div className="mt-3 flex flex-col gap-3">
          <label className="text-sm text-[#334155] flex flex-col gap-1">
            Tu número de WhatsApp
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+57 300 111 2233"
              className="border border-[#CBD5E1] rounded-lg px-3 py-2 text-base"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </label>
          <label className="flex gap-3 text-sm text-[#334155] items-start">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 shrink-0"
              checked={acepta}
              onChange={(e) => setAcepta(e.target.checked)}
            />
            <span>
              Acepto recibir por WhatsApp los avisos de conexión y el informe
              semanal de mi hijo/a. Los mensajes llevan solo su nombre de pila,
              la hora y cifras de la semana. Puedo desactivarlos cuando quiera.
            </span>
          </label>
          <div className="flex gap-3 items-center flex-wrap">
            <button
              type="button"
              className="bg-[#004B63] text-white py-2.5 px-5 rounded-lg font-semibold disabled:opacity-50 min-h-[44px]"
              disabled={!acepta || !telefono.trim() || ocupado}
              onClick={pedirCodigo}
            >
              Enviarme un código
            </button>
            {cambiandoNumero && (
              <button
                type="button"
                className="text-sm text-[#004B63] underline min-h-[44px]"
                onClick={() => {
                  setCambiandoNumero(false);
                  setError("");
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}

      {vista === "verificando" && (
        <div className="mt-3 flex flex-col gap-3">
          <p className="text-sm text-[#334155]">
            Te enviamos un código por WhatsApp. Escríbelo aquí para confirmar
            que el número es tuyo. Vence en 10 minutos.
          </p>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            aria-label="Código de verificación"
            placeholder="123456"
            className="border border-[#CBD5E1] rounded-lg px-3 py-2 text-base tracking-widest w-40"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
          />
          <div className="flex gap-3 items-center flex-wrap">
            <button
              type="button"
              className="bg-[#004B63] text-white py-2.5 px-5 rounded-lg font-semibold disabled:opacity-50 min-h-[44px]"
              disabled={codigo.length !== 6 || ocupado}
              onClick={confirmar}
            >
              Confirmar
            </button>
            <button
              type="button"
              className="text-sm text-[#004B63] underline min-h-[44px]"
              onClick={() => {
                setVista("inactivo");
                setError("");
              }}
            >
              Usar otro número
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-700 mt-3" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

WhatsAppAvisosCard.propTypes = {
  authToken: PropTypes.string,
};

export default WhatsAppAvisosCard;
