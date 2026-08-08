import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../i18n/I18nProvider";

const gd = "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]";
const gd2 = "bg-gradient-to-r from-[#004B63] to-[#4DA8C4]";
const dc = (dm, light, dark) => (dm ? dark : light);

const diffStyle = {
  básico: { bg: "#2ECC71", labelKey: "kid.scanner.diff_basic" },
  intermedio: { bg: "#E67E22", labelKey: "kid.scanner.diff_intermediate" },
  avanzado: { bg: "#9B59B6", labelKey: "kid.scanner.diff_advanced" },
};

/**
 * Vista de resultado del Escáner de Estudio: muestra el resumen
 * generado por la IA (tipo profesor) de forma profesional.
 */
const ScannerSummaryResult = memo(
  ({ summary, img, subjectLabel: sl, darkMode: dm, onAskDani, onReset }) => {
    const { t } = useTranslation();
    return (
      <motion.div
        key="result"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-5"
      >
        <div
          className={`rounded-2xl border overflow-hidden shadow-md ${dm ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
        >
          <div className={`${gd2} p-5 text-white`}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-white/70 text-xs uppercase tracking-wide mb-1">
                  {sl
                    ? t("kid.scanner.teacher_summary_subject", { subject: sl })
                    : t("kid.scanner.teacher_summary")}
                </p>
                <h4 className="font-bold text-lg leading-tight">
                  {summary.title}
                </h4>
              </div>
              {summary.difficulty && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap shrink-0"
                  style={{
                    backgroundColor:
                      diffStyle[summary.difficulty]?.bg || "#4DA8C4",
                  }}
                >
                  {diffStyle[summary.difficulty]?.labelKey
                    ? t(diffStyle[summary.difficulty].labelKey)
                    : summary.difficulty}
                </span>
              )}
            </div>
          </div>

          <div className="p-5 space-y-5">
            {img && (
              <img
                src={img}
                alt={t("kid.scanner.material_alt")}
                className="w-full max-h-56 object-contain rounded-xl border border-[#E2E8F0] shadow-sm"
              />
            )}

            {summary.overview && (
              <div>
                <p
                  className={`text-sm font-bold mb-2 ${dc(dm, "text-[#004B63]", "text-[#66CCCC]")}`}
                >
                  {t("kid.scanner.overview")}
                </p>
                <p
                  className={`text-sm leading-relaxed ${dc(dm, "text-[#475569]", "text-[#CBD5E1]")}`}
                >
                  {summary.overview}
                </p>
              </div>
            )}

            {summary.keyConcepts.length > 0 && (
              <div>
                <p
                  className={`text-sm font-bold mb-3 ${dc(dm, "text-[#004B63]", "text-[#66CCCC]")}`}
                >
                  {t("kid.scanner.key_concepts")}
                </p>
                <div className="space-y-3">
                  {summary.keyConcepts.map((c, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border ${dm ? "bg-[#0F172A] border-[#334155]" : "bg-[#F8FAFC] border-[#E2E8F0]"}`}
                    >
                      <p className="text-sm font-semibold text-[#4DA8C4] mb-1">
                        {c.term}
                      </p>
                      <p
                        className={`text-sm leading-relaxed ${dc(dm, "text-[#475569]", "text-[#CBD5E1]")}`}
                      >
                        {c.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {summary.learningPoints.length > 0 && (
              <div>
                <p
                  className={`text-sm font-bold mb-3 ${dc(dm, "text-[#004B63]", "text-[#66CCCC]")}`}
                >
                  {t("kid.scanner.remember")}
                </p>
                <ul className="space-y-2">
                  {summary.learningPoints.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#2ECC71] mt-0.5 shrink-0">✓</span>
                      <span
                        className={`text-sm leading-relaxed ${dc(dm, "text-[#475569]", "text-[#CBD5E1]")}`}
                      >
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {summary.example && (
              <div
                className={`p-4 rounded-xl border-l-4 ${dm ? "bg-[#0F172A] border-[#66CCCC]" : "bg-[#F0FDF4] border-[#2ECC71]"}`}
              >
                <p
                  className={`text-sm font-bold mb-1 ${dc(dm, "text-[#004B63]", "text-[#66CCCC]")}`}
                >
                  {t("kid.scanner.example")}
                </p>
                <p
                  className={`text-sm leading-relaxed ${dc(dm, "text-[#475569]", "text-[#CBD5E1]")}`}
                >
                  {summary.example}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onAskDani}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-4 ${gd} text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2`}
          >
            {t("kid.scanner.ask_dani")}
          </motion.button>
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-4 bg-white border-2 border-[#E2E8F0] text-[#64748B] rounded-2xl font-bold shadow-sm hover:border-[#4DA8C4]/30"
          >
            {t("kid.scanner.new")}
          </motion.button>
        </div>
      </motion.div>
    );
  },
);

ScannerSummaryResult.displayName = "ScannerSummaryResult";
export default ScannerSummaryResult;
