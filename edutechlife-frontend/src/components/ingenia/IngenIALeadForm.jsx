import { useEffect, useRef, useState } from "react";
import { useTranslation } from "../../i18n/I18nProvider";
import useLeadSubmit from "../../hooks/useLeadSubmit";
import LeadConsent from "../leads/LeadConsent";
import LeadProfileSelect from "../leads/LeadProfileSelect";

// Solo adultos: el formulario lo llena un padre, madre o docente, nunca el niño.
const PERFILES_ADULTOS = ["padre", "docente", "colegio", "empresa", "otro"];

const LABEL = "mb-1 block text-xs font-bold text-[#170B33]";
const INPUT =
  "w-full rounded-xl border-2 border-[#7B2FF7]/15 bg-white px-4 py-2.5 text-sm text-[#170B33] outline-none transition-all focus:border-[#7B2FF7] focus:ring-2 focus:ring-[#7B2FF7]/20";

/**
 * Formulario corto de captación de IngenIA: nombre, correo o WhatsApp, perfil y
 * autorización de datos (Ley 1581). Envía con src/services/leads.js y la fuente
 * que recibe; si el envío falla muestra el error real, no «enviado».
 */
export default function IngenIALeadForm({ fuente, idPrefix = "ingenia-lead" }) {
  const { t } = useTranslation();
  const lead = useLeadSubmit(fuente);
  const nombreRef = useRef(null);
  const [campos, setCampos] = useState({ nombre: "", contacto: "" });
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    nombreRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contacto = campos.contacto.trim();
    // Si escribe un @ es correo; si no, es el número de WhatsApp.
    const medio = contacto.includes("@")
      ? { email: contacto }
      : { telefono: contacto };
    const ok = await lead.submit(
      { nombre: campos.nombre.trim(), ...medio },
      e.currentTarget,
    );
    if (ok) setEnviado(true);
  };

  if (enviado) {
    return (
      <div
        role="status"
        className="w-full max-w-sm rounded-2xl bg-[#F7F5FF] p-5 text-left"
      >
        <p className="text-base font-black text-[#170B33]">
          {t("ingenia.lead_sent_title")}
        </p>
        <p className="mt-1 text-sm text-[#4C4566]">
          {t("ingenia.lead_sent_desc")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-3 text-left"
    >
      <p className="text-xs leading-snug text-[#4C4566]">
        {t("ingenia.lead_child_notice")}
      </p>
      <div>
        <label htmlFor={`${idPrefix}-nombre`} className={LABEL}>
          {t("ingenia.lead_name_label")}
        </label>
        <input
          ref={nombreRef}
          id={`${idPrefix}-nombre`}
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
      </div>
      <div>
        <label htmlFor={`${idPrefix}-contacto`} className={LABEL}>
          {t("ingenia.lead_contact_label")}
        </label>
        <input
          id={`${idPrefix}-contacto`}
          name="contacto"
          type="text"
          required
          maxLength={254}
          autoComplete="email"
          value={campos.contacto}
          onChange={(e) => setCampos({ ...campos, contacto: e.target.value })}
          className={INPUT}
        />
      </div>
      <LeadProfileSelect
        id={`${idPrefix}-perfil`}
        lead={lead}
        opciones={PERFILES_ADULTOS}
        labelClassName={LABEL}
        selectClassName={INPUT}
      />
      <LeadConsent id={`${idPrefix}-consent`} lead={lead} />
      <button
        type="submit"
        disabled={lead.sending}
        className="w-full rounded-full bg-gradient-to-r from-[#7B2FF7] to-[#4361EE] px-6 py-3 text-sm font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-60"
      >
        {lead.sending ? t("leadForm.sending") : t("ingenia.lead_submit")}
      </button>
    </form>
  );
}
