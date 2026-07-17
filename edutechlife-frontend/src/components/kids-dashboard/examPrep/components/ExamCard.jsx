import { memo } from "react";
import { motion } from "framer-motion";
import { daysLeft, badgeCls, badgeEmj, sbj } from "../examUtils";

const ExamCard = memo(({ e: exam, i, onView, onDelete }) => {
  const d = daysLeft(exam.date);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{sbj(exam.subject)?.i || "📚"}</span>
          <div>
            <h4 className="font-bold text-[#004B63] text-sm leading-tight">
              {exam.name}
            </h4>
            <p className="text-xs text-[#64748B]">
              {sbj(exam.subject)?.l || exam.subject}
            </p>
          </div>
        </div>
        <motion.button
          onClick={(e) => { e.stopPropagation(); onDelete(exam.id); }}
          whileHover={{ scale: 1.1 }}
          className="text-[#94A3B8] hover:text-red-400 text-lg leading-none"
        >
          ×
        </motion.button>
      </div>
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${badgeCls(d)}`}
      >
        <span>{badgeEmj(d)}</span>
        <span>{d === 0 ? "¡Hoy!" : d === 1 ? "1 día" : `${d} días`}</span>
      </div>
      {d < 14 && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          className="mt-3 h-1 rounded-full bg-red-100 overflow-hidden"
        >
          <motion.div
            className="h-full bg-red-400"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      )}
      <motion.button
        onClick={() => onView(exam)}
        whileHover={{ scale: 1.02 }}
        className="mt-3 w-full text-xs text-[#4DA8C4] font-semibold py-1.5 rounded-lg hover:bg-[#4DA8C4]/5 transition-colors"
      >
        Ver detalle →
      </motion.button>
    </motion.div>
  );
});

ExamCard.displayName = "ExamCard";
export default ExamCard;
