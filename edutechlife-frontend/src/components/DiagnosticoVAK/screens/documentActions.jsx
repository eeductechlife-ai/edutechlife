import { ArrowLeft, Download, Home } from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";

const DocumentActions = ({ generatePDF, pdfLoading, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
      <button
        type="button"
        onClick={generatePDF}
        disabled={pdfLoading}
        aria-busy={pdfLoading}
        className="min-h-[56px] rounded-2xl bg-[#072F46] px-8 text-base font-bold text-white shadow-[0_14px_30px_-14px_rgba(7,47,70,0.8)] hover:bg-[#0B3A55] disabled:opacity-70 flex items-center justify-center gap-2.5 transition-colors"
      >
        {pdfLoading ? (
          <>
            <span
              className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin"
              aria-hidden="true"
            />
            {t("vak.ui.generating_pdf")}
          </>
        ) : (
          <>
            <Download size={20} strokeWidth={2.4} aria-hidden="true" />
            {t("vak.ui.download_pdf_btn")}
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="min-h-[56px] rounded-2xl border-2 border-[#072F46] bg-white px-8 text-base font-bold text-[#072F46] hover:bg-[#F1F5F9] flex items-center justify-center gap-2.5 transition-colors"
      >
        <ArrowLeft size={20} strokeWidth={2.4} aria-hidden="true" />
        {t("vak.ui.back_to_results")}
      </button>

      <a
        href="/"
        className="min-h-[44px] text-sm font-semibold text-[#004B63]/60 hover:text-[#199DB9] flex items-center justify-center gap-2 transition-colors"
      >
        <Home size={16} strokeWidth={2.2} aria-hidden="true" />
        {t("vak.ui.go_home")}
      </a>
    </div>
  );
};

export default DocumentActions;
