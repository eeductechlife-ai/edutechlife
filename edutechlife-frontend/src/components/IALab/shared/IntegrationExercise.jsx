import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import { Lightbulb, ChevronDown, CheckCircle } from "lucide-react";

export default function IntegrationExercise({ scenario, questions }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (completed) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
        <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
          <CheckCircle size={18} />
          {t("ialab.integration.done")}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-corporate/20 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-corporate/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-corporate/10 text-corporate flex items-center justify-center">
            <Lightbulb size={16} />
          </div>
          <span className="text-sm font-semibold text-petroleum dark:text-slate-100">
            {t("ialab.integration.title")}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {scenario}
              </p>
              {questions && questions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-petroleum dark:text-slate-100 uppercase tracking-wider">
                    {t("ialab.integration.reflect")}
                  </p>
                  {questions.map((q, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700"
                    >
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                        {i + 1}.
                      </span>
                      <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                        {q}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setCompleted(true)}
                className="px-5 py-2 bg-corporate text-white text-sm font-semibold rounded-xl hover:bg-petroleum transition-colors"
              >
                {t("ialab.integration.mark_done")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

IntegrationExercise.propTypes = {
  scenario: PropTypes.string.isRequired,
  questions: PropTypes.arrayOf(PropTypes.string),
};
