import { motion } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const LessonObjectives = ({
  objectives = [],
  completed = [],
  variant = "start",
}) => {
  const { t } = useTranslation();
  if (!objectives || objectives.length === 0) return null;

  const isStart = variant === "start";

  return (
    <motion.div
      className={`border rounded-lg p-3.5 md:p-4 ${
        isStart
          ? "bg-gradient-to-r from-petroleum/5 to-corporate/5 dark:from-petroleum/10 dark:to-corporate/10 border-petroleum/20"
          : "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-start gap-2.5">
        <Icon
          name={isStart ? "fa-bullseye" : "fa-circle-check"}
          className={`text-base flex-shrink-0 mt-0.5 ${isStart ? "text-petroleum" : "text-green-600"}`}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-bold mb-2 ${isStart ? "text-petroleum" : "text-green-700 dark:text-green-400"}`}
          >
            {isStart
              ? t("ialab.objectives_learn")
              : t("ialab.objectives_verified")}
          </h3>
          <ul className="space-y-1.5">
            {objectives.map((obj, idx) => {
              const done = completed.includes(idx);
              return (
                <motion.li
                  key={idx}
                  variants={itemVariants}
                  className="flex items-start gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300"
                >
                  {done ? (
                    <Icon
                      name="fa-check"
                      className="text-green-600 flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span
                    className={
                      done
                        ? "line-through text-slate-400 dark:text-slate-500"
                        : ""
                    }
                  >
                    {obj}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default LessonObjectives;
