import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";

const SubjectsView = memo(function SubjectsView({ subjects }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#004B63]">
        {t("smartboard.subjects_view_title")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-5 rounded-xl border border-[#E2E8F0] hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: `${subject.color}20` }}
              >
                {subject.icon}
              </div>
              <h4 className="font-semibold text-[#004B63]">{subject.name}</h4>
            </div>
            <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: subject.color }}
                initial={{ width: 0 }}
                animate={{ width: `${subject.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-[#64748B]">
                {t("smartboard.progress")}
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: subject.color }}
              >
                {subject.progress}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default SubjectsView;
