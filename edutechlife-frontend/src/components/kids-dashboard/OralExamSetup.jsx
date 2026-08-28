import { memo } from "react";
import { motion } from "framer-motion";
import { dc } from "./oralExamUtils";
import { useTranslation } from "../../i18n/I18nProvider";

const OralExamSetup = memo(
  ({
    dm,
    hasDeck,
    subject,
    difficulty,
    chatLoading,
    SUBJECTS,
    DIFFICULTIES,
    setSubject,
    setDifficulty,
    startConversation,
    onTabChange,
  }) => {
    const { t } = useTranslation();
    return (
      <motion.div
        key="setup"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        {!hasDeck && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700">
            💡 <strong>{t("oral.tip_label")}</strong> {t("oral.tip_desc")}
            <button
              onClick={() => onTabChange?.("flashcards")}
              className="ml-1 font-bold underline"
            >
              {t("oral.go_flashcards")}
            </button>
          </div>
        )}

        <div>
          <p
            className={`text-sm font-semibold mb-3 ${dc(dm, "text-[#004B63]", "text-white")}`}
          >
            {t("oral.pick_subject")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SUBJECTS.map((s) => (
              <motion.button
                key={s.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSubject(s)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  subject?.id === s.id
                    ? "border-[#4DA8C4] bg-[#4DA8C4]/5"
                    : dc(
                        dm,
                        "border-[#334155] bg-[#1E293B]",
                        "border-[#E2E8F0] bg-white",
                      )
                }`}
              >
                <span className="text-3xl block mb-1">{s.icon}</span>
                <p
                  className={`text-xs font-bold ${dc(dm, "text-white", "text-[#004B63]")}`}
                >
                  {s.label}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {subject && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p
              className={`text-sm font-semibold mb-3 ${dc(dm, "text-[#004B63]", "text-white")}`}
            >
              {t("oral.select_difficulty")}
            </p>
            <div className="flex gap-3">
              {DIFFICULTIES.map((d) => (
                <motion.button
                  key={d.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 p-4 rounded-2xl border-2 text-center transition-all ${
                    difficulty?.id === d.id
                      ? "border-[#4DA8C4] bg-[#4DA8C4]/5"
                      : dc(
                          dm,
                          "border-[#334155] bg-[#1E293B]",
                          "border-[#E2E8F0] bg-white",
                        )
                  }`}
                >
                  <span className="text-2xl block mb-1">{d.icon}</span>
                  <p
                    className={`text-xs font-bold ${dc(dm, "text-white", "text-[#004B63]")}`}
                  >
                    {d.label}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {subject && difficulty && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startConversation}
            disabled={chatLoading}
            className="w-full py-4 bg-gradient-to-r from-[#FF6B9D] to-[#A855F7] text-white rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {chatLoading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                {t("oral.generating_questions")}
              </>
            ) : (
              <>
                <span className="text-xl">🗣️</span> {t("oral.talk_with_dani")}
              </>
            )}
          </motion.button>
        )}
      </motion.div>
    );
  },
);

OralExamSetup.displayName = "OralExamSetup";
export default OralExamSetup;
