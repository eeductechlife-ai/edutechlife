import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";

const getSubjects = (t) => [
  {
    value: "matematicas",
    label: t("kid.activity.subject_matematicas"),
    icon: "🔢",
  },
  { value: "lenguaje", label: t("kid.activity.subject_lenguaje"), icon: "📖" },
  { value: "ciencias", label: t("kid.activity.subject_ciencias"), icon: "🔬" },
  { value: "sociales", label: t("kid.activity.subject_sociales"), icon: "🌍" },
  { value: "ingles", label: t("kid.activity.subject_ingles"), icon: "🇺🇸" },
  { value: "arte", label: t("kid.activity.subject_arte"), icon: "🎨" },
];

const UploadForm = memo(({ subject, onSubjectChange }) => {
  const { t } = useTranslation();
  const subjects = getSubjects(t);
  return (
    <div className="mt-4">
      <label className="text-sm font-semibold text-[#004B63] mb-2 block">
        {t("kid.activity.subject_label")}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {subjects.map((subj) => (
          <motion.button
            key={subj.value}
            onClick={() => onSubjectChange(subj.value)}
            className={`p-3 rounded-xl border-2 transition-all text-sm ${
              subject === subj.value
                ? "border-[#4DA8C4] bg-[#4DA8C4]/10 text-[#004B63] font-semibold"
                : "border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]/30"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-1">{subj.icon}</span>
            {subj.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
});

UploadForm.displayName = "UploadForm";

export default UploadForm;
