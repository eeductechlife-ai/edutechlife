import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HabeasDataModal from "./HabeasDataModal";
import MoodSelector from "../components/MoodSelector";
import { AGE_MIN, AGE_MAX } from "../useDiagnosticoVAK/constants";

const AGES = Array.from(
  { length: AGE_MAX - AGE_MIN + 1 },
  (_, i) => AGE_MIN + i,
);

export default function renderCalibration({
  t,
  studentName,
  setStudentName,
  studentAge,
  setStudentAge,
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
  const ready =
    studentName.trim() && studentAge && studentMood && habeasDataAccepted;

  return (
    <div className="flex items-start justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-[#004B63]">
            {t("vak.ui.tell_me_about_you")}
          </h1>
          <p className="text-sm text-[#004B63]/70 leading-relaxed mt-1">
            {t("vak.ui.fill_data_personalize")}
          </p>
        </div>

        <div className="mb-5">
          <label
            htmlFor="vak-name"
            className="text-sm font-bold text-[#004B63] mb-2 block"
          >
            {t("vak.ui.your_name_label")}
          </label>
          <input
            id="vak-name"
            type="text"
            value={studentName}
            maxLength={30}
            autoComplete="off"
            onChange={(e) => setStudentName(e.target.value)}
            placeholder={t("vak.ui.your_name_placeholder")}
            className="w-full rounded-2xl border-2 border-[#B2D8E5] bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/40 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/40 focus:border-[#4DA8C4]"
          />
        </div>

        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="text-sm font-bold text-[#004B63] mb-2 p-0">
            {t("vak.ui.your_age_label")}
          </legend>
          <div
            className="grid grid-cols-5 sm:grid-cols-9 gap-2"
            role="radiogroup"
          >
            {AGES.map((age) => {
              const selected = String(age) === String(studentAge);
              return (
                <button
                  key={age}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setStudentAge(String(age))}
                  className={`min-h-[48px] rounded-xl border-2 text-lg font-extrabold transition-colors ${
                    selected
                      ? "bg-[#004B63] border-[#004B63] text-white"
                      : "bg-white border-[#B2D8E5] text-[#004B63] hover:border-[#4DA8C4]"
                  }`}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="text-sm font-bold text-[#004B63] mb-2 p-0">
            {t("vak.ui.how_feel_today")}
          </legend>
          <MoodSelector
            studentMood={studentMood}
            onSelect={handleMoodSelect}
            t={t}
          />
          <div className="min-h-[3.25rem] mt-3" aria-live="polite">
            {showMoodFeedback && (
              <p className="!m-0 p-3 bg-[#E6F4F1] rounded-2xl text-sm text-[#004B63] font-medium leading-relaxed">
                {moodFeedbackText}
              </p>
            )}
          </div>
        </fieldset>

        <div className="mb-6 flex items-start gap-3 bg-[#F0FDFF] border border-[#B2D8E5] rounded-2xl p-4">
          <input
            id="vak-consent"
            type="checkbox"
            checked={habeasDataAccepted}
            onChange={(e) => setHabeasDataAccepted(e.target.checked)}
            className="w-6 h-6 mt-0.5 shrink-0 rounded-md cursor-pointer accent-[#004B63]"
          />
          <div className="text-left">
            <label
              htmlFor="vak-consent"
              className="text-sm text-[#004B63] leading-relaxed cursor-pointer"
            >
              {t("vak.ui.accept_data_policy")}
            </label>
            <button
              type="button"
              onClick={() => setShowHabeasModal(true)}
              className="block text-sm text-[#0B7285] font-semibold underline mt-1 min-h-[32px]"
            >
              {t("vak.ui.view_habeas_data")}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={submitCalibration}
          disabled={!ready}
          className={`w-full min-h-[56px] rounded-2xl px-6 text-lg font-bold flex items-center justify-center gap-2 transition-colors ${
            ready
              ? "bg-[#004B63] text-white shadow-lg hover:bg-[#003B4F]"
              : "bg-[#D6E1E3] text-[#004B63]/60 cursor-not-allowed"
          }`}
        >
          {t("vak.ui.start_test_btn")}
          <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
        </button>
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
