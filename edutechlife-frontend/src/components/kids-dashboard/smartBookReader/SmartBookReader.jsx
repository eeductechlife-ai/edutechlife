import { motion, AnimatePresence } from "framer-motion";
import { useBookReader } from "./useBookReader";
import { useTranslation } from "../../../i18n/I18nProvider";
import { BookDisplay } from "./components/BookPage";
import { UploadZone, StepBar, HistoryItem } from "./components/BookControls";

const SmartBookReader = () => {
  const {
    darkMode,
    mode,
    text,
    setText,
    step,
    book,
    view,
    setView,
    error,
    process,
    history,
    reset,
  } = useBookReader();
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div>
        <h3
          className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#004B63]"}`}
        >
          {t("kid.smartbook.title")}
        </h3>
        <p
          className={`text-sm ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
        >
          {t("kid.smartbook.subtitle")}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {mode === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div>
              <label
                className={`text-sm font-semibold mb-2 block ${darkMode ? "text-white" : "text-[#004B63]"}`}
              >
                {t("kid.smartbook.paste_text")}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("kid.smartbook.textarea_placeholder")}
                rows={5}
                className={`w-full p-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] ${darkMode ? "bg-[#1E293B] border-[#334155] text-white placeholder-[#64748B]" : "bg-white border-[#E2E8F0] text-[#334155] placeholder-[#94A3B8]"}`}
              />
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => process(text)}
                disabled={!text.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${text.trim() ? "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white shadow-md hover:shadow-lg" : darkMode ? "bg-[#334155] text-[#64748B]" : "bg-[#E2E8F0] text-[#94A3B8]"}`}
              >
                {t("kid.smartbook.analyze")}
              </motion.button>
              <span
                className={`text-xs font-semibold ${darkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
              >
                {t("kid.smartbook.or")}
              </span>
              <div className="flex-1">
                <UploadZone onUpload={process} busy={false} />
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">
                {error}
              </p>
            )}
          </motion.div>
        )}

        {mode === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-8 rounded-2xl border text-center backdrop-blur-xl ${darkMode ? "bg-[#0F172A]/90 border-[#334155]" : "bg-white/90 border-[#E2E8F0]"}`}
          >
            <StepBar step={step} />
            <div className="w-full max-w-xs h-2 bg-[#E2E8F0] rounded-full mx-auto overflow-hidden mt-4">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p
              className={`text-xs mt-3 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
            >
              {step === 0
                ? t("kid.smartbook.step_extracting")
                : step === 1
                  ? t("kid.smartbook.step_analyzing")
                  : t("kid.smartbook.step_organizing")}
            </p>
          </motion.div>
        )}

        {mode === "result" && book && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BookDisplay book={book} dark={darkMode} />
            <motion.button
              onClick={reset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-3 w-full py-2.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg"
            >
              {t("kid.smartbook.create_another")}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setView(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <BookDisplay book={view} dark={false} />
              <button
                onClick={() => setView(null)}
                className="mt-2 w-full py-2 text-sm text-white/80 hover:text-white text-center"
              >
                {t("kid.smartbook.close")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h4
          className={`text-sm font-bold mb-3 ${darkMode ? "text-white" : "text-[#004B63]"}`}
        >
          {t("kid.smartbook.history", { count: history.length })}
        </h4>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-5xl mb-3 block">📚</span>
            <p
              className={`text-sm font-semibold ${darkMode ? "text-white" : "text-[#004B63]"}`}
            >
              {t("kid.smartbook.empty_title")}
            </p>
            <p
              className={`text-xs mt-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
            >
              {t("kid.smartbook.empty_desc")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {history.map((b, i) => (
              <HistoryItem
                key={b.id}
                book={b}
                i={i}
                dark={darkMode}
                onSelect={setView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

SmartBookReader.displayName = "SmartBookReader";
export { SmartBookReader };
export default SmartBookReader;
