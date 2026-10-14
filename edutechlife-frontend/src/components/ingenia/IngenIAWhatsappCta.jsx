import { useTranslation } from "../../i18n/I18nProvider";
import { Icon } from "../../utils/iconMapping.jsx";

// Número de contacto de Nico (+57 323 836 5517), el mismo de los demás botones de WhatsApp.
const NICO_WHATSAPP = "573238365517";

/** Enlace a WhatsApp con el mensaje ya escrito. Sin formulario: no pide datos. */
export const whatsappNicoUrl = (mensaje) =>
  `https://wa.me/${NICO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

export default function IngenIAWhatsappCta() {
  const { t } = useTranslation();
  return (
    <section
      aria-labelledby="ingenia-wa-titulo"
      className="mx-auto max-w-3xl px-4 py-6"
    >
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#7B2FF7]/10 bg-white p-6 text-center shadow-sm sm:flex-row sm:text-left">
        <div className="flex-1">
          <h3
            id="ingenia-wa-titulo"
            className="text-lg font-black text-[#170B33]"
          >
            {t("ingenia.wa_title")}
          </h3>
          <p className="mt-1 text-sm text-[#4C4566]">{t("ingenia.wa_desc")}</p>
        </div>
        <a
          href={whatsappNicoUrl(t("ingenia.wa_message"))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Icon name="fa-whatsapp" className="text-base" />
          {t("ingenia.wa_btn")}
        </a>
      </div>
    </section>
  );
}
