import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";

const gradeColor = (score) => {
  if (score >= 4.5) return "#22C55E";
  if (score >= 4.0) return "#84CC16";
  if (score >= 3.5) return "#EAB308";
  if (score >= 3.0) return "#F97316";
  return "#EF4444";
};

export function getMasteryState(progress) {
  const p = Number(progress) || 0;
  if (p < 30)
    return {
      key: "recovery",
      label: "Recuperación",
      emoji: "🆘",
      color: "#EF4444",
      bg: "#FEF2F2",
    };
  if (p < 60)
    return {
      key: "practice",
      label: "Práctica",
      emoji: "📖",
      color: "#F59E0B",
      bg: "#FFFBEB",
    };
  if (p < 80)
    return {
      key: "mastery",
      label: "Dominio",
      emoji: "⭐",
      color: "#10B981",
      bg: "#ECFDF5",
    };
  return {
    key: "transfer",
    label: "Transferencia",
    emoji: "🚀",
    color: "#7C3AED",
    bg: "#F5F3FF",
  };
}

const SubjectsView = memo(function SubjectsView({ subjects, onTabChange }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black tracking-tight text-[#00303F]">
        {t("smartboard.subjects_view_title")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject, index) => {
          const hasGrade = subject.gradeScore !== undefined;
          const barColor = hasGrade
            ? gradeColor(subject.gradeScore)
            : subject.color;

          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-[0_10px_30px_-18px_rgba(0,48,63,0.35)] hover:shadow-[0_18px_40px_-18px_rgba(0,48,63,0.4)] transition-all"
            >
              {(() => {
                const ms = getMasteryState(subject.progress);
                return (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                        style={{
                          background: `linear-gradient(135deg, ${subject.color}26, ${subject.color}14)`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5)`,
                        }}
                      >
                        {subject.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#00303F] truncate">
                          {subject.name}
                        </h4>
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
                          style={{ backgroundColor: ms.bg, color: ms.color }}
                        >
                          {ms.emoji} {ms.label}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-[#EDF3F7] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${barColor}, ${barColor}bb)`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {hasGrade ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#93A6B2]">
                          Nota boletín
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#93A6B2]">
                          {t("smartboard.progress")}
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        {hasGrade && (
                          <span
                            className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: barColor }}
                          >
                            {subject.gradeScore.toFixed(1)}/5
                          </span>
                        )}
                        <span
                          className="text-sm font-black tabular-nums"
                          style={{ color: barColor }}
                        >
                          {subject.progress}%
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default SubjectsView;
