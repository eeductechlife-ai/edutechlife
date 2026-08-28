import { memo } from "react";
import { motion } from "framer-motion";
import { gradeColor, gradeEmoji, getAvgScore } from "./gradeUtils";

const PeriodInput = ({ label, value, onChange }) => (
  <div className="flex flex-col items-center gap-0.5">
    <span className="text-[10px] font-bold text-[#94A3B8] uppercase">
      {label}
    </span>
    <input
      type="text"
      inputMode="decimal"
      placeholder="—"
      value={value != null ? value : ""}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        const raw = e.target.value.replace(",", ".");
        if (raw === "" || raw === "-") {
          onChange(null);
          return;
        }
        const n = parseFloat(raw);
        if (!isNaN(n) && n >= 0 && n <= 5) onChange(n);
      }}
      className="w-14 text-center text-sm font-bold border-2 rounded-lg outline-none p-1"
      style={{
        color: value != null ? gradeColor(Number(value)) : "#94A3B8",
        borderColor:
          value != null ? gradeColor(Number(value)) + "40" : "#E2E8F0",
      }}
    />
  </div>
);

const GradeRow = memo(({ grade, subjects, onUpdate, onRemove }) => {
  const avg = getAvgScore(grade);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-2"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg w-8 text-center flex-shrink-0">
          {subjects.find((s) => s.v === grade.subject)?.i || "📚"}
        </span>
        <select
          value={grade.subject}
          onChange={(e) => onUpdate(grade.id, "subject", e.target.value)}
          className="flex-1 text-sm text-[#004B63] font-semibold bg-transparent border-none outline-none min-w-0"
        >
          {subjects.map((s) => (
            <option key={s.v} value={s.v}>
              {s.l}
            </option>
          ))}
        </select>
        {avg > 0 && (
          <span
            className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: gradeColor(avg) + "20",
              color: gradeColor(avg),
            }}
          >
            {gradeEmoji(avg)} {avg.toFixed(1)}
          </span>
        )}
        <button
          onClick={() => onRemove(grade.id)}
          className="text-red-300 hover:text-red-500 transition-colors text-sm px-1 flex-shrink-0"
          aria-label="Eliminar materia"
        >
          ✕
        </button>
      </div>
      <div className="flex gap-2 pl-10">
        {["p1", "p2", "p3", "p4"].map((p, i) => (
          <PeriodInput
            key={p}
            label={`P${i + 1}`}
            value={grade[p]}
            onChange={(val) => onUpdate(grade.id, p, val)}
          />
        ))}
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-0.5 justify-end">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase">
            Prom
          </span>
          <span
            className="w-14 text-center text-sm font-black border-2 rounded-lg p-1"
            style={{
              color: avg > 0 ? gradeColor(avg) : "#94A3B8",
              borderColor: avg > 0 ? gradeColor(avg) + "40" : "#E2E8F0",
            }}
          >
            {avg > 0 ? avg.toFixed(1) : "—"}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

GradeRow.displayName = "GradeRow";
export default GradeRow;
