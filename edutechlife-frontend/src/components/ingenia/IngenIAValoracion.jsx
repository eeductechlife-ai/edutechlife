import { useTranslation } from "../../i18n/I18nProvider";
import IngenIALeadForm from "./IngenIALeadForm";

/**
 * Bloque «Valoración gratis de 20 minutos» para el plan personalizado.
 * Usa el mismo formulario corto del hero, con la fuente ingenia_valoracion.
 */
export default function IngenIAValoracion() {
  const { t } = useTranslation();
  return (
    <section
      id="valoracion"
      aria-labelledby="ingenia-val-titulo"
      className="mx-auto max-w-3xl scroll-mt-20 px-4 py-8"
    >
      <div className="rounded-3xl border border-[#7B2FF7]/10 bg-[#F7F5FF] p-6 sm:p-8">
        <h3
          id="ingenia-val-titulo"
          className="text-xl font-black text-[#170B33]"
        >
          {t("ingenia.val_title")}
        </h3>
        <p className="mt-2 text-sm text-[#4C4566]">{t("ingenia.val_desc")}</p>
        <div className="mt-5">
          <IngenIALeadForm fuente="ingenia_valoracion" idPrefix="val" />
        </div>
      </div>
    </section>
  );
}
