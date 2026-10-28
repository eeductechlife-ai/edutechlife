import { motion } from "framer-motion";
import { Icon } from "../../utils/iconMapping";

export const StreakCircle = ({
  filled,
  label,
  isToday,
  index,
  prefersReducedMotion,
}) => (
  <motion.div
    initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
    animate={{
      scale: 1,
      opacity: 1,
      transition: prefersReducedMotion
        ? {}
        : {
            delay: 0.3 + index * 0.06,
            type: "spring",
            stiffness: 300,
            damping: 15,
          },
    }}
    className="relative flex flex-col items-center gap-0.5"
  >
    <motion.div
      animate={
        !prefersReducedMotion && filled && isToday
          ? { scale: [1, 1.15, 1] }
          : filled
            ? { scale: 1 }
            : { scale: 0.9 }
      }
      transition={
        prefersReducedMotion
          ? {}
          : {
              repeat: filled && isToday ? Infinity : 0,
              duration: 2,
              ease: "easeInOut",
            }
      }
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
        filled
          ? "bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] shadow-md shadow-[var(--theme-emphasis)]/30"
          : "bg-slate-100 border border-slate-200"
      }`}
    >
      {filled && (
        <motion.div
          initial={prefersReducedMotion ? {} : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  delay: 0.4 + index * 0.06,
                  type: "spring",
                  stiffness: 400,
                  damping: 12,
                }
          }
        >
          <Icon name="fa-check" className="text-white text-[10px]" />
        </motion.div>
      )}
    </motion.div>
    <span
      className={`text-[10px] font-medium ${filled ? "text-slate-600" : "text-slate-400"}`}
    >
      {label}
    </span>
  </motion.div>
);
