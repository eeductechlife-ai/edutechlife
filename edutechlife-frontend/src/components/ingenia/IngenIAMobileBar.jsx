import { useTranslation } from "../../i18n/I18nProvider";
import { Icon } from "../../utils/iconMapping.jsx";
import { whatsappNicoUrl } from "./IngenIAWhatsappCta";

/**
 * Barra fija inferior solo para móvil (md:hidden): probar gratis (lleva al hero)
 * y WhatsApp de Nico.
 */
export default function IngenIAMobileBar({ onProbar }) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-[#7B2FF7]/10 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(23,11,51,0.08)] backdrop-blur md:hidden">
      <button
        type="button"
        onClick={onProbar}
        className="flex-1 rounded-full bg-gradient-to-r from-[#7B2FF7] to-[#4361EE] px-4 py-3 text-sm font-bold text-white shadow-md"
      >
        {t("ingenia.mobile_try")}
      </button>
      <a
        href={whatsappNicoUrl(t("ingenia.wa_message"))}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-md"
      >
        <Icon name="fa-whatsapp" className="text-base" />
        {t("ingenia.mobile_wa")}
      </a>
    </div>
  );
}
