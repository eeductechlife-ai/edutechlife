import { useState } from "react";
import { useTranslation } from "../../i18n/I18nProvider";
import { enviarInformeVak } from "../../services/vakInforme";
import LeadConsent from "../leads/LeadConsent";
import LeadProfileSelect from "../leads/LeadProfileSelect";
import { generarInformePDF } from "./vakPDFGenerator";

// Solo adultos: el informe se envía a quien acompaña al niño, nunca al niño.
const PERFILES_ADULTOS = ["padre", "docente", "colegio", "empresa", "otro"];
const MAX_PDF_BYTES = 2 * 1024 * 1024;

const LABEL = "mt-2 block text-sm font-semibold text-[#004B63]";
const INPUT =
  "mt-1 w-full rounded-xl border-2 border-[#B2D8E5] bg-white px-4 py-2.5 text-base text-[#004B63] focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/40 focus:border-[#4DA8C4]";

const blobABase64 = (blob) =>
  new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(String(lector.result).split(",")[1] || "");
    lector.onerror = () => reject(new Error("No pudimos leer el informe."));
    lector.readAsDataURL(blob);
  });

/**
 * Envía el informe PDF (generado en el navegador) como adjunto al correo del adulto.
 * No pide datos del niño. Vive junto a la vista previa, donde existe el PDF.
 * `nombreInicial` es el nombre que el adulto ya escribió en la pantalla de resultado.
 * `nombreEstudiante` solo viaja en el correo; el backend no lo guarda.
 * `diagnosis` es el resultado con el que se arma el PDF (el mismo de la descarga).
 */
export default function VakEnviarInforme({
  nombreInicial = "",
  nombreEstudiante = "",
  diagnosis = null,
} = {}) {
  const { t } = useTranslation();
  const [campos, setCampos] = useState({
    nombre: String(nombreInicial || "")
      .trim()
      .slice(0, 120),
    email: "",
  });
  const [perfil, setPerfil] = useState("");
  const [consent, setConsent] = useState(false);
  const [estado, setEstado] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Sin autorización no se genera ni se envía nada (no depende solo de `required`).
    if (!consent) {
      setEstado("error");
      setErrorMsg(t("leadForm.error_consentimiento"));
      return;
    }
    setEstado("sending");
    setErrorMsg("");
    try {
      const pdf = await generarInformePDF({
        diagnosis,
        parentName: nombreInicial,
      });
      if (pdf.size > MAX_PDF_BYTES) {
        throw new Error(
          "El informe pesa más de 2 MB. Intenta de nuevo o escríbenos por WhatsApp.",
        );
      }
      const pdf_base64 = await blobABase64(pdf);
      await enviarInformeVak({
        nombre: campos.nombre.trim(),
        email: campos.email.trim(),
        perfil,
        nombre_estudiante: String(nombreEstudiante || "")
          .trim()
          .slice(0, 60),
        pdf_base64,
        autorizacion_datos: true,
        sitio_web: e.currentTarget?.elements?.sitio_web?.value || "",
      });
      setEstado("sent");
    } catch (err) {
      setEstado("error");
      setErrorMsg(err.message);
    }
  };

  if (estado === "sent") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-[#B2D8E5] bg-white p-4"
      >
        <p className="!m-0 text-base font-bold text-[#004B63]">
          {t("vak.informe.sent_title")}
        </p>
        <p className="!m-0 mt-1 text-sm text-[#004B63]/80">
          {t("vak.informe.sent_desc")}
        </p>
      </div>
    );
  }

  // LeadConsent muestra sus propios errores por código; aquí se muestra el texto real.
  const lead = { consent, setConsent, errorCode: null };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#B2D8E5] bg-white p-4 space-y-1"
    >
      <h2 className="!m-0 text-base font-bold text-[#004B63]">
        {t("vak.informe.title")}
      </h2>
      <p className="!m-0 text-xs text-[#004B63]/70">{t("vak.informe.desc")}</p>

      <label htmlFor="vak-informe-nombre" className={LABEL}>
        {t("vak.informe.name_label")}
      </label>
      <input
        id="vak-informe-nombre"
        name="nombre"
        type="text"
        required
        minLength={2}
        maxLength={120}
        autoComplete="name"
        value={campos.nombre}
        onChange={(e) => setCampos({ ...campos, nombre: e.target.value })}
        className={INPUT}
      />

      <label htmlFor="vak-informe-email" className={LABEL}>
        {t("vak.informe.email_label")}
      </label>
      <input
        id="vak-informe-email"
        name="email"
        type="email"
        required
        maxLength={254}
        autoComplete="email"
        value={campos.email}
        onChange={(e) => setCampos({ ...campos, email: e.target.value })}
        className={INPUT}
      />

      <div className="pt-2">
        <LeadProfileSelect
          id="vak-informe-perfil"
          lead={{ perfil, setPerfil }}
          opciones={PERFILES_ADULTOS}
          labelClassName={LABEL}
          selectClassName={INPUT}
        />
      </div>

      <div className="pt-2">
        <LeadConsent id="vak-informe-consent" lead={lead} />
      </div>

      {estado === "error" && (
        <p role="alert" className="!m-0 pt-2 text-sm font-medium text-red-600">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "sending"}
        className="mt-3 w-full min-h-[48px] rounded-xl bg-[#004B63] text-sm font-bold text-white disabled:opacity-60"
      >
        {estado === "sending" ? t("leadForm.sending") : t("vak.informe.submit")}
      </button>
    </form>
  );
}
