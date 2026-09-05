import { memo } from "react";
import { motion } from "framer-motion";
import {
  subjects,
  inpCls,
  PRACTICE_GRADIENT,
  PRACTICE_GLOW,
} from "../examUtils";
import { useTranslation } from "../../../../i18n/I18nProvider";

const ExamForm = memo(({ n, sN, s, sS, d, sD, g, sG, onAdd, dm = false }) => {
  const { t } = useTranslation();

  const cardBg = dm ? "#1A2744" : "#ffffff";
  const cardBorder = dm ? "#243152" : "#F1F5F9";
  const textPrimary = dm ? "#E2F0FF" : "#1E293B";
  const textSecondary = dm ? "#94A3B8" : "#64748B";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-2xl p-6 space-y-5"
      style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
    >
      {/* Nombre */}
      <div>
        <label
          className="text-sm font-bold mb-1.5 block"
          style={{ color: textPrimary }}
        >
          {t("kid.exam.name_label")}
        </label>
        <input
          type="text"
          value={n}
          onChange={(e) => sN(e.target.value)}
          placeholder={t("kid.exam.name_placeholder")}
          className={inpCls}
          style={
            dm
              ? {
                  background: "#141E35",
                  color: "#E2F0FF",
                  borderColor: "#243152",
                }
              : undefined
          }
        />
      </div>

      {/* Materia */}
      <div>
        <label
          className="text-sm font-bold mb-2 block"
          style={{ color: textPrimary }}
        >
          {t("kid.exam.subject_label")}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {subjects.map((sb) => {
            const isActive = sb.v === s;
            return (
              <motion.button
                key={sb.v}
                onClick={() => sS(sb.v)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="p-2.5 rounded-xl text-xs sm:text-sm transition-all font-medium"
                style={{
                  border: isActive
                    ? "2px solid #EF476F"
                    : `1.5px solid ${cardBorder}`,
                  background: isActive
                    ? "rgba(239,71,111,0.08)"
                    : dm
                      ? "rgba(255,255,255,0.03)"
                      : "#F8FAFC",
                  color: isActive ? "#EF476F" : textSecondary,
                  fontWeight: isActive ? 700 : 500,
                  boxShadow: isActive
                    ? "0 2px 10px rgba(239,71,111,0.15)"
                    : "none",
                }}
              >
                <span className="mr-1">{sb.i}</span>
                {t(`kid.exam.subject_${sb.v}`)}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Fecha + nota deseada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            className="text-sm font-bold mb-1.5 block"
            style={{ color: textPrimary }}
          >
            {t("kid.exam.date_label")}
          </label>
          <input
            type="date"
            value={d}
            onChange={(e) => sD(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className={inpCls}
            style={
              dm
                ? {
                    background: "#141E35",
                    color: "#E2F0FF",
                    borderColor: "#243152",
                  }
                : undefined
            }
          />
        </div>
        <div>
          <label
            className="text-sm font-bold mb-1.5 block"
            style={{ color: textPrimary }}
          >
            {t("kid.exam.desired_grade_label")}
          </label>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="range"
              min="0"
              max="100"
              value={g}
              onChange={(e) => sG(Number(e.target.value))}
              className="flex-1"
              style={{ accentColor: "#EF476F" }}
            />
            <span
              className="text-xl font-black min-w-[3ch] text-center"
              style={{ color: "#EF476F" }}
            >
              {g}
            </span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <motion.button
        onClick={onAdd}
        disabled={!n.trim() || !d}
        whileHover={{
          scale: 1.02,
          boxShadow: `0 10px 28px ${PRACTICE_GLOW}35`,
        }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        style={{ background: PRACTICE_GRADIENT }}
      >
        📅 {t("kid.exam.add_exam")}
      </motion.button>
    </motion.div>
  );
});

ExamForm.displayName = "ExamForm";
export default ExamForm;
