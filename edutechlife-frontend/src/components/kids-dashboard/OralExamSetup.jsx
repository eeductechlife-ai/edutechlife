import { memo } from "react";
import { motion } from "framer-motion";
import { dc } from "./oralExamUtils";
import { useTranslation } from "../../i18n/I18nProvider";

const PRACTICE_GRADIENT =
  "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)";
const PRACTICE_GLOW = "#EF476F";

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

    // Token shortcuts
    const textPrimary = dc(dm, "text-[#004B63]", "text-[#E2F0FF]");
    const textSecondary = dc(dm, "text-[#64748B]", "text-[#94A3B8]");
    const cardBg = dc(dm, "bg-white", "bg-[#1E293B]");
    const cardBorder = dc(dm, "border-[#E2E8F0]", "border-[#2A3A54]/60");

    return (
      <motion.div
        key="setup"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-5"
      >
        {/* Tip banner */}
        {!hasDeck && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl flex items-start gap-2.5"
            style={{
              background: dc(
                dm,
                "rgba(239,71,111,0.06)",
                "rgba(239,71,111,0.10)",
              ),
              border: "1px solid rgba(239,71,111,0.20)",
            }}
          >
            <span className="text-base flex-shrink-0">💡</span>
            <p className={`text-xs leading-relaxed ${textSecondary}`}>
              <strong className={textPrimary}>{t("oral.tip_label")}</strong>{" "}
              {t("oral.tip_desc")}{" "}
              <button
                onClick={() => onTabChange?.("flashcards")}
                className="font-bold underline"
                style={{ color: "#EF476F" }}
              >
                {t("oral.go_flashcards")} →
              </button>
            </p>
          </motion.div>
        )}

        {/* Subject picker */}
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-wider mb-3 ${textSecondary}`}
          >
            {t("oral.pick_subject")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {SUBJECTS.map((s) => {
              const isActive = subject?.id === s.id;
              return (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSubject(s)}
                  className={`p-4 rounded-2xl text-center transition-all ${cardBg}`}
                  style={{
                    border: isActive
                      ? `2px solid ${s.color}`
                      : `1px solid ${dc(dm, "#E2E8F0", "#2A3A54")}`,
                    boxShadow: isActive ? `0 4px 16px ${s.color}30` : "none",
                    background: isActive
                      ? dc(dm, `${s.color}0D`, `${s.color}18`)
                      : dc(dm, "#ffffff", "#1E293B"),
                  }}
                >
                  <span className="text-3xl block mb-1.5">{s.icon}</span>
                  <p
                    className="text-xs font-bold"
                    style={{
                      color: isActive ? s.color : dc(dm, "#004B63", "#E2F0FF"),
                    }}
                  >
                    {s.label}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Difficulty picker */}
        {subject && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wider mb-3 ${textSecondary}`}
            >
              {t("oral.select_difficulty")}
            </p>
            <div className="flex gap-2.5">
              {DIFFICULTIES.map((d) => {
                const isActive = difficulty?.id === d.id;
                return (
                  <motion.button
                    key={d.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDifficulty(d)}
                    className="flex-1 p-4 rounded-2xl text-center transition-all"
                    style={{
                      border: isActive
                        ? `2px solid ${d.color}`
                        : `1px solid ${dc(dm, "#E2E8F0", "#2A3A54")}`,
                      background: isActive
                        ? dc(dm, `${d.color}10`, `${d.color}18`)
                        : dc(dm, "#ffffff", "#1E293B"),
                      boxShadow: isActive ? `0 4px 12px ${d.color}28` : "none",
                    }}
                  >
                    <span className="text-2xl block mb-1.5">{d.icon}</span>
                    <p
                      className="text-xs font-bold"
                      style={{
                        color: isActive
                          ? d.color
                          : dc(dm, "#004B63", "#E2F0FF"),
                      }}
                    >
                      {d.label}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        {subject && difficulty && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startConversation}
            disabled={chatLoading}
            className="w-full py-4 text-white rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-50"
            style={{
              background: PRACTICE_GRADIENT,
              boxShadow: `0 8px 24px ${PRACTICE_GLOW}35`,
            }}
          >
            {chatLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                {t("oral.generating_questions")}
              </>
            ) : (
              <>
                <span className="text-xl">🗣️</span>
                {t("oral.talk_with_dani")}
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
