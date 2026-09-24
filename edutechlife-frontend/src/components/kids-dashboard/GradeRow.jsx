import { memo } from "react";
import { motion } from "framer-motion";
import { gradeColor, gradeEmoji, getAvgScore } from "./gradeUtils";

const PeriodInput = ({ label, value, onChange }) => (
  <label className="flex flex-col items-center gap-0.5 min-w-0">
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
      aria-label={`Nota ${label}`}
      className="w-full min-w-0 h-11 text-center text-base font-bold border-2 rounded-lg outline-none"
      style={{
        color: value != null ? gradeColor(Number(value)) : "#94A3B8",
        borderColor:
          value != null ? gradeColor(Number(value)) + "40" : "#E2E8F0",
      }}
    />
  </label>
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
          className="flex-1 text-sm text-[#1E293B] font-semibold bg-transparent border-none outline-none min-w-0"
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
          className="w-9 h-9 -mr-1 flex items-center justify-center rounded-lg text-red-300 hover:text-red-500 hover:bg-red-50 transition-colors text-sm flex-shrink-0"
          aria-label="Eliminar materia"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {["p1", "p2", "p3", "p4"].map((p, i) => (
          <PeriodInput
            key={p}
            label={`P${i + 1}`}
            value={grade[p]}
            onChange={(val) => onUpdate(grade.id, p, val)}
          />
        ))}
        <div className="flex flex-col items-center gap-0.5 min-w-0">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase">
            Prom
          </span>
          <span
            className="w-full h-11 flex items-center justify-center text-base font-black rounded-lg"
            style={{
              color: avg > 0 ? "#fff" : "#94A3B8",
              background: avg > 0 ? gradeColor(avg) : "#F1F5F9",
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
