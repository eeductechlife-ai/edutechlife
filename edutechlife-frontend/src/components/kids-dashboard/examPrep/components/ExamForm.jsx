import { memo } from "react";
import { motion } from "framer-motion";
import { subjects, inpCls, gdCls } from "../examUtils";
import { useTranslation } from "../../../../i18n/I18nProvider";

const ExamForm = memo(({ n, sN, s, sS, d, sD, g, sG, onAdd }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5"
    >
      <div>
        <label className="text-sm font-semibold text-[#004B63] mb-1.5 block">
          {t("kid.exam.name_label")}
        </label>
        <input
          type="text"
          value={n}
          onChange={(e) => sN(e.target.value)}
          placeholder={t("kid.exam.name_placeholder")}
          className={inpCls}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-[#004B63] mb-2 block">
          {t("kid.exam.subject_label")}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {subjects.map((sb) => (
            <motion.button
              key={sb.v}
              onClick={() => sS(sb.v)}
              className={`p-2.5 rounded-xl border-2 transition-all text-xs sm:text-sm ${sb.v === s ? "border-[#4DA8C4] bg-[#4DA8C4]/10 text-[#004B63] font-semibold" : "border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]/30"}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-1">{sb.i}</span>
              {t(`kid.exam.subject_${sb.v}`)}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-[#004B63] mb-1.5 block">
            {t("kid.exam.date_label")}
          </label>
          <input
            type="date"
            value={d}
            onChange={(e) => sD(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className={inpCls}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#004B63] mb-1.5 block">
            {t("kid.exam.desired_grade_label")}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={g}
              onChange={(e) => sG(Number(e.target.value))}
              className="flex-1 accent-[#4DA8C4]"
            />
            <span className="text-lg font-black text-[#4DA8C4] min-w-[3ch] text-center">
              {g}
            </span>
          </div>
        </div>
      </div>
      <motion.button
        onClick={onAdd}
        disabled={!n.trim() || !d}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${gdCls} w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {t("kid.exam.add_exam")}
      </motion.button>
    </motion.div>
  );
});

ExamForm.displayName = "ExamForm";
export default ExamForm;
