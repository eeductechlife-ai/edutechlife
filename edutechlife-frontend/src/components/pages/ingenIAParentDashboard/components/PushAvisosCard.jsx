import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Bell, Check, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../../../../config/api";
import { useTranslation } from "../../../../i18n/I18nProvider";

/**
 * PushAvisosCard
 * El padre activa los avisos en su celular: "tu hijo/a está activo en
 * IngenIA". Pide el permiso del navegador, se suscribe con la clave pública
 * del servidor y envía la suscripción al backend. No bloquea nada.
 */

const soportaPush = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

const TIEMPO_MAX_SW_MS = 8000;

/** Convierte la clave pública VAPID (base64url) al formato que pide PushManager. */
function claveAUint8(base64url) {
  const relleno = "=".repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + relleno).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

/** Registro del service worker listo, o error si no llega a estarlo a tiempo. */
function registroListo() {
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise((_, rechazar) =>
      setTimeout(
        () =>
          rechazar(
            new Error("El service worker no está listo. Recarga la página."),
          ),
        TIEMPO_MAX_SW_MS,
      ),
    ),
  ]);
}

const PushAvisosCard = ({ authToken }) => {
  const { t } = useTranslation();
  // cargando | activando | activado | desactivado | bloqueado | no_soportado | error
  const [estado, setEstado] = useState("cargando");
  const [detalle, setDetalle] = useState("");

  useEffect(() => {
    let cancelado = false;
    (async () => {
      if (!soportaPush()) {
        if (!cancelado) setEstado("no_soportado");
        return;
      }
      if (Notification.permission === "denied") {
        if (!cancelado) setEstado("bloqueado");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        const sub = reg ? await reg.pushManager.getSubscription() : null;
        if (!cancelado) {
          setEstado(
            sub && Notification.permission === "granted"
              ? "activado"
              : "desactivado",
          );
        }
      } catch {
        if (!cancelado) setEstado("desactivado");
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  const activar = async () => {
    setDetalle("");
    if (!authToken) {
      setEstado("error");
      setDetalle(t("push_padres.no_auth"));
      return;
    }
    setEstado("activando");
    try {
      const permiso = await Notification.requestPermission();
      if (permiso === "denied") {
        setEstado("bloqueado");
        return;
      }
      if (permiso !== "granted") {
        setEstado("desactivado");
        setDetalle(t("push_padres.permission_pending"));
        return;
      }

      const resClave = await fetch(
        `${API_BASE_URL}/api/notifications/push/public-key`,
      );
      const datosClave = await resClave.json().catch(() => ({}));
      if (!resClave.ok || !datosClave.publicKey) {
        throw new Error(datosClave.error || `HTTP ${resClave.status}`);
      }

      const reg = await registroListo();
      const sub =
        (await reg.pushManager.getSubscription()) ||
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: claveAUint8(datosClave.publicKey),
        }));

      const res = await fetch(
        `${API_BASE_URL}/api/notifications/push/subscribe`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subscription: sub.toJSON() }),
        },
      );
      const datos = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(datos.error || `HTTP ${res.status}`);

      setEstado("activado");
    } catch (e) {
      setEstado("error");
      setDetalle(`${t("push_padres.error_prefix")} ${e?.message || ""}`.trim());
    }
  };

  const activando = estado === "activando";

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 mb-6">
      <h3 className="font-bold text-base text-[#004B63] flex items-center gap-2">
        <Bell className="w-4 h-4" aria-hidden="true" />
        {t("push_padres.title")}
      </h3>
      <p className="text-sm text-[#475569] mt-1">{t("push_padres.desc")}</p>

      {estado === "activado" ? (
        <p className="text-sm text-emerald-700 mt-3 flex items-center gap-2">
          <Check className="w-4 h-4" aria-hidden="true" />
          {t("push_padres.status_on")}
        </p>
      ) : estado === "no_soportado" ? (
        <p className="text-sm text-[#475569] mt-3">
          {t("push_padres.status_unsupported")}
        </p>
      ) : estado === "bloqueado" ? (
        <p className="text-sm text-amber-700 mt-3">
          {t("push_padres.status_blocked")}
        </p>
      ) : estado === "cargando" ? null : (
        <>
          <p className="text-sm text-[#475569] mt-3">
            {t("push_padres.status_off")}
          </p>
          <button
            type="button"
            onClick={activar}
            disabled={activando}
            className="mt-3 inline-flex items-center gap-2 bg-[#004B63] text-white font-bold text-sm px-4 py-2.5 rounded-lg disabled:opacity-60"
          >
            {activando && (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            )}
            {activando ? t("push_padres.activating") : t("push_padres.button")}
          </button>
        </>
      )}

      {estado === "error" && detalle && (
        <p role="alert" className="text-sm text-red-700 mt-2">
          {detalle}
        </p>
      )}
      {estado !== "error" && detalle && (
        <p className="text-sm text-[#475569] mt-2">{detalle}</p>
      )}
    </div>
  );
};

PushAvisosCard.propTypes = {
  authToken: PropTypes.string,
};

export default PushAvisosCard;
