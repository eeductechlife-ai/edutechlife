import { memo } from "react";
import { motion } from "framer-motion";
import ExamCard from "./ExamCard";
import { PRACTICE_GRADIENT } from "../examUtils";
import { useTranslation } from "../../../../i18n/I18nProvider";

const ExamList = memo(({ exams, onView, onDelete, dm = false }) => {
  const { t } = useTranslation();

  if (exams.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-14 gap-4"
      >
        {/* Ilustración vacío */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-md"
          style={{
            background: "rgba(239,71,111,0.08)",
            border: "1.5px solid rgba(239,71,111,0.15)",
          }}
        >
          📅
        </div>
        <div className="text-center">
          <p
            className="font-bold text-base"
            style={{ color: dm ? "#E2F0FF" : "#1E293B" }}
          >
            {t("kid.exam.empty_title")}
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: dm ? "#94A3B8" : "#64748B" }}
          >
            {t("kid.exam.empty_hint")}
          </p>
        </div>
        {/* Tip motivacional */}
        <div
          className="mt-2 px-4 py-3 rounded-2xl text-center max-w-xs"
          style={{
            background: "rgba(239,71,111,0.06)",
            border: "1px solid rgba(239,71,111,0.14)",
          }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: dm ? "#94A3B8" : "#64748B" }}
          >
            💡 Agrega tu próximo examen y Dani te ayudará a prepararte con
            tiempo.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {exams.map((exam, i) => (
        <ExamCard
          key={exam.id}
          e={exam}
          i={i}
          onView={onView}
          onDelete={onDelete}
          dm={dm}
        />
      ))}
    </div>
  );
});

ExamList.displayName = "ExamList";
export default ExamList;
