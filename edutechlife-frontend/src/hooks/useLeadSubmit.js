import { useCallback, useState } from "react";
import { submitLead } from "../services/leads";

/**
 * Estado de envío de un formulario de leads: autorización de datos (Ley 1581),
 * envío al backend y error real. `submit` devuelve true solo si el lead quedó
 * guardado; el formulario muestra «enviado» únicamente en ese caso.
 */
export default function useLeadSubmit(fuente) {
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorCode, setErrorCode] = useState(null);

  const submit = useCallback(
    async (datos, form) => {
      if (!consent) {
        setErrorCode("consentimiento");
        return false;
      }
      setStatus("sending");
      setErrorCode(null);
      try {
        await submitLead({
          ...datos,
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
    [consent, fuente],
  );

  const reset = useCallback(() => {
    setConsent(false);
    setStatus("idle");
    setErrorCode(null);
  }, []);

  return {
    consent,
    setConsent,
    status,
    errorCode,
    submit,
    reset,
    sending: status === "sending",
  };
}
