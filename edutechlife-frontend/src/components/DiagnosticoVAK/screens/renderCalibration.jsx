import { motion } from "framer-motion";
import { User, ArrowRight } from "lucide-react";
import HabeasDataModal from "./HabeasDataModal";
import MoodSelector from "../components/MoodSelector";

export default function renderCalibration({
  t,
  studentName,
  setStudentName,
  studentAge,
  setStudentAge,
  ageError,
  setAgeError,
  studentMood,
  habeasDataAccepted,
  setHabeasDataAccepted,
  showHabeasModal,
  setShowHabeasModal,
  showMoodFeedback,
  moodFeedbackText,
  handleMoodSelect,
  submitCalibration,
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-[#66CCCC]/10 to-[#4DA8C4]/5 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md text-center relative z-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center shadow-lg mb-4">
            <User size={32} strokeWidth={2} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#004B63] text-center">
            {t("vak.ui.tell_me_about_you")}
          </h1>
          <p className="text-sm text-[#004B63]/70 leading-relaxed mt-2">
            {t("vak.ui.fill_data_personalize")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4"
        >
          <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block text-left">
            {t("vak.ui.your_name_label")}
          </label>
          <div className="relative">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder={t("vak.ui.your_name_placeholder")}
              className="w-full rounded-2xl border-2 border-[#B2D8E5]/50 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4] transition-all shadow-md"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block text-left">
            {t("vak.ui.your_age_label")}
          </label>
          <div className="relative">
            <input
              type="number"
              min="6"
              max="17"
              value={studentAge}
              onChange={(e) => {
                setStudentAge(e.target.value);
                const val = parseInt(e.target.value);
                setAgeError(
                  e.target.value.length > 0 &&
                    (isNaN(val) || val < 6 || val > 17),
                );
              }}
              placeholder={t("vak.ui.your_age_placeholder")}
              className={`w-full rounded-2xl border-2 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 transition-all shadow-md ${
                ageError
                  ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                  : "border-[#B2D8E5]/50 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4]"
              }`}
            />
          </div>
          {ageError && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <span>⚠</span>
              <span>{t("vak.ui.error_age_range")}</span>
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-3 block text-left">
            {t("vak.ui.how_feel_today")}
          </label>
          <MoodSelector
            studentMood={studentMood}
            onSelect={handleMoodSelect}
            t={t}
          />

          {showMoodFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-[#4DA8C4]/10 rounded-2xl border border-[#4DA8C4]/20"
            >
              <p className="text-sm text-[#004B63] font-medium leading-relaxed">
                {moodFeedbackText}
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-start gap-3 bg-[#B2D8E5]/20 rounded-2xl p-4">
            <input
              type="checkbox"
              checked={habeasDataAccepted}
              onChange={(e) => setHabeasDataAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded-md border-2 border-[#4DA8C4] text-[#4DA8C4] focus:ring-[#4DA8C4] cursor-pointer accent-[#4DA8C4]"
            />
            <div className="text-left">
              <p className="text-xs text-[#004B63]/80 leading-relaxed">
                {t("vak.ui.accept_data_policy")}
              </p>
              <button
                onClick={() => setShowHabeasModal(true)}
                className="text-xs text-[#4DA8C4] font-medium hover:underline mt-1"
              >
                {t("vak.ui.view_habeas_data")}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <motion.button
            whileHover={
              studentName.trim() &&
              studentAge &&
              studentMood &&
              habeasDataAccepted
                ? { scale: 1.02 }
                : {}
            }
            whileTap={
              studentName.trim() &&
              studentAge &&
              studentMood &&
              habeasDataAccepted
                ? { scale: 0.98 }
                : {}
            }
            onClick={submitCalibration}
            disabled={
              !studentName.trim() ||
              !studentAge ||
              !studentMood ||
              !habeasDataAccepted
            }
            className={`w-full rounded-2xl py-4 px-6 shadow-xl transition-all ${
              studentName.trim() &&
              studentAge &&
              studentMood &&
              habeasDataAccepted
                ? "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:shadow-2xl"
                : "bg-[#B2D8E5] cursor-not-allowed"
            }`}
          >
            <span
              className={`text-lg font-bold flex items-center justify-center gap-2 ${
                studentName.trim() &&
                studentAge &&
                studentMood &&
                habeasDataAccepted
                  ? "text-white"
                  : "text-[#004B63]/50"
              }`}
            >
              {t("vak.ui.start_test_btn")}
              <ArrowRight size={20} strokeWidth={2} />
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {showHabeasModal && (
        <HabeasDataModal
          onClose={() => setShowHabeasModal(false)}
          onAccept={() => {
            setHabeasDataAccepted(true);
            setShowHabeasModal(false);
          }}
        />
      )}
    </div>
  );
}
