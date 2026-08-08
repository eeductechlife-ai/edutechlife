import { memo } from "react";
import { motion } from "framer-motion";
import ExamCard from "./ExamCard";
import { useTranslation } from "../../../../i18n/I18nProvider";

const ExamList = memo(({ exams, onView, onDelete }) => {
  const { t } = useTranslation();
  if (exams.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <span className="text-6xl mb-4 block">📅</span>
        <p className="text-[#64748B] font-semibold">
          {t("kid.exam.empty_title")}
        </p>
        <p className="text-sm text-[#94A3B8] mt-1">
          {t("kid.exam.empty_hint")}
        </p>
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
        />
      ))}
    </div>
  );
});

ExamList.displayName = "ExamList";
export default ExamList;
