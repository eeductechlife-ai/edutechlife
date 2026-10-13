import { useCallback, useState } from "react";
import { submitLead } from "../services/leads";

/**
 * Estado de envío de un formulario de leads: perfil obligatorio («Soy…»),
 * autorización de datos (Ley 1581), envío al backend y error real. `submit`
 * devuelve true solo si el lead quedó guardado; el formulario muestra
 * «enviado» únicamente en ese caso.
 */
export default function useLeadSubmit(fuente) {
  const [perfil, setPerfil] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorCode, setErrorCode] = useState(null);

  const submit = useCallback(
    async (datos, form) => {
      if (!perfil) {
        setErrorCode("perfil");
        return false;
      }
      if (!consent) {
        setErrorCode("consentimiento");
        return false;
      }
      setStatus("sending");
      setErrorCode(null);
      try {
        await submitLead({
          ...datos,
          perfil,
          fuente,
          autorizacion_datos: true,
          sitio_web: form?.elements?.sitio_web?.value || "",
        });
        setStatus("sent");
        return true;
      } catch (err) {
        setStatus("error");
        setErrorCode(err?.code || "servidor");
        return false;
      }
    },
    [perfil, consent, fuente],
  );

  const reset = useCallback(() => {
    setPerfil("");
    setConsent(false);
    setStatus("idle");
    setErrorCode(null);
  }, []);

  return {
    perfil,
    setPerfil,
    consent,
    setConsent,
    status,
    errorCode,
    submit,
    reset,
    sending: status === "sending",
  };
}
