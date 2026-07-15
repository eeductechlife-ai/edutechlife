import { motion } from "framer-motion";
import { ArrowRight, Download, Rocket } from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";

const DocumentActions = ({ generatePDF, pdfLoading, onBack }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring" }}
      className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10"
    >
      <motion.button
        whileHover={{ scale: 1.08, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={generatePDF}
        disabled={pdfLoading}
        className="relative bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 overflow-hidden group"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        {pdfLoading ? (
          <>
            <div className="relative z-10 w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
            <span className="relative z-10 text-base font-semibold">
              {t("vak.ui.generating_pdf")}
            </span>
          </>
        ) : (
          <>
            <Download size={20} strokeWidth={2} className="relative z-10" />
            <span className="relative z-10 text-base font-semibold">
              {t("vak.ui.download_pdf_btn")}
            </span>
          </>
        )}
        <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-r from-[#4DA8C4]/30 to-[#66CCCC]/30 blur-md rounded-full"></div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.08, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="relative bg-white border-2 border-[#004B63] text-[#004B63] rounded-full px-8 py-4 flex items-center gap-3 overflow-hidden group"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#004B63]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        <ArrowRight size={20} strokeWidth={2} className="relative z-10" />
        <span className="relative z-10 text-base font-semibold">
          {t("vak.ui.back_to_results")}
        </span>
        <div className="absolute -bottom-2 left-4 right-4 h-4 bg-[#004B63]/10 blur-md rounded-full"></div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => (window.location.href = "/")}
        className="text-[#004B63]/50 hover:text-[#4DA8C4] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <Rocket size={16} strokeWidth={2} />
        <span>{t("vak.ui.go_home")}</span>
      </motion.button>
    </motion.div>
  );
};

export default DocumentActions;
