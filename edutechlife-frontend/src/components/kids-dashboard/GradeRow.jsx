import { memo, useState } from "react";
import { motion } from "framer-motion";
import {
  gradeColor,
  gradeTextColor,
  gradeChipTextColor,
  gradeEmoji,
  getAvgScore,
} from "./gradeUtils";
import { readableTextOn, ensureContrast } from "../../utils/contrast";
import { useIngenIAKidsSafe } from "../../context/IngenIAKidsContext";

function periodTrend(grade) {
  const vals = ["p1", "p2", "p3", "p4"]
    .map((k) =>
      grade[k] != null && !isNaN(Number(grade[k])) ? Number(grade[k]) : null,
    )
    .filter((v) => v != null);
  if (vals.length < 2) return null;
  const delta =
    Math.round((vals[vals.length - 1] - vals[vals.length - 2]) * 10) / 10;
  return { delta, dir: delta > 0.05 ? "up" : delta < -0.05 ? "down" : "flat" };
}

export const NOTE_RANGE_MESSAGE = "Escribe una nota entre 1,0 y 5,0";

// Escala MEN: 1.0–5.0. Antes un valor fuera de rango se descartaba sin
// avisar y el campo parecía ignorar lo escrito. Ahora se muestra un mensaje y
// al salir del campo vuelve a la última nota válida.
const PeriodInput = ({ label, value, onChange, onInvalid, dm }) => {
  const [draft, setDraft] = useState(null);
  const shown = draft != null ? draft : value != null ? String(value) : "";
  return (
    <label className="flex flex-col items-center gap-0.5 min-w-0">
      <span
        className={`text-xs font-bold uppercase ${dm ? "text-[#94A3B8]" : "text-[#64748B]"}`}
      >
        {label}
      </span>
      <input
        type="text"
        inputMode="decimal"
        placeholder="—"
        value={shown}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const typed = e.target.value;
          setDraft(typed);
          const text = typed.trim().replace(",", ".");
          if (text === "") {
            onInvalid?.("");
            onChange(null);
            return;
          }
          const n = Number(text);
          if (Number.isNaN(n) || n < 1 || n > 5) {
            onInvalid?.(NOTE_RANGE_MESSAGE);
            return;
          }
          onInvalid?.("");
          onChange(n);
        }}
        onBlur={() => {
          setDraft(null);
          onInvalid?.("");
        }}
        aria-label={`Nota ${label}`}
        className="w-full min-w-0 h-11 text-center text-base font-bold border-2 rounded-lg outline-none"
        style={{
          background: dm ? "#0F172A" : undefined,
          color:
            value != null
              ? dm
                ? ensureContrast(gradeColor(Number(value)), "#0F172A")
                : gradeTextColor(Number(value))
              : dm
                ? "#94A3B8"
                : "#64748B",
          borderColor:
            value != null
              ? gradeColor(Number(value)) + "40"
              : dm
                ? "#334155"
                : "#E2E8F0",
        }}
      />
    </label>
  );
};

const GradeRow = memo(({ grade, subjects, onUpdate, onRemove }) => {
  const avg = getAvgScore(grade);
  const trend = periodTrend(grade);
  const dropping = trend?.dir === "down" && avg > 0 && avg < 3.5;
  const [noteError, setNoteError] = useState("");
  const dm = !!useIngenIAKidsSafe()?.darkMode;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`p-3 rounded-xl shadow-sm space-y-2 ${dm ? "bg-[#1E293B]" : "bg-white"}`}
      style={{
        border: dropping
          ? "1.5px solid rgba(239,71,111,0.5)"
          : `1px solid ${dm ? "#334155" : "#E2E8F0"}`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg w-8 text-center flex-shrink-0">
          {subjects.find((s) => s.v === grade.subject)?.i || "📚"}
        </span>
        <select
          value={grade.subject}
          onChange={(e) => onUpdate(grade.id, "subject", e.target.value)}
          aria-label="Materia"
          className={`flex-1 text-sm font-semibold bg-transparent border-none outline-none min-w-0 ${dm ? "text-white" : "text-[#1E293B]"}`}
          style={{ colorScheme: dm ? "dark" : "light" }}
        >
          {subjects.map((s) => (
            <option key={s.v} value={s.v}>
              {s.l}
            </option>
          ))}
        </select>
        {avg > 0 && (
          <span
            className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1"
            style={{
              backgroundColor: gradeColor(avg) + "20",
              color: dm
                ? ensureContrast(gradeColor(avg), "#1E293B")
                : gradeChipTextColor(avg),
            }}
          >
            {gradeEmoji(avg)} {avg.toFixed(1)}
            {trend && trend.dir !== "flat" && (
              <span
                className="font-black"
                style={{
                  color: dm
                    ? trend.dir === "up"
                      ? "#34D399"
                      : "#F87171"
                    : trend.dir === "up"
                      ? "#0A7854"
                      : "#B91C1C",
                }}
              >
                {trend.dir === "up" ? "↑" : "↓"}
              </span>
            )}
          </span>
        )}
        <button
          onClick={() => onRemove(grade.id)}
          className={`w-9 h-9 -mr-1 flex items-center justify-center rounded-lg transition-colors text-sm flex-shrink-0 ${dm ? "text-red-300 hover:text-red-200 hover:bg-white/5" : "text-red-600 hover:text-red-800 hover:bg-red-50"}`}
          aria-label="Eliminar materia"
        >
          ✕
        </button>
      </div>
      {dropping && (
        <div
          className={`flex items-center gap-1.5 text-xs font-bold ${dm ? "text-[#FCA5A5]" : "text-[#B91C1C]"}`}
        >
          ⚠️ La nota bajó en el último periodo — ¡practica para recuperarla!
        </div>
      )}
      <div className="grid grid-cols-5 gap-1.5">
        {["p1", "p2", "p3", "p4"].map((p, i) => (
          <PeriodInput
            key={p}
            label={`P${i + 1}`}
            value={grade[p]}
            onChange={(val) => onUpdate(grade.id, p, val)}
            onInvalid={setNoteError}
            dm={dm}
          />
        ))}
        <div className="flex flex-col items-center gap-0.5 min-w-0">
          <span
            className={`text-xs font-bold uppercase ${dm ? "text-[#94A3B8]" : "text-[#64748B]"}`}
          >
            Prom
          </span>
          <span
            className="w-full h-11 flex items-center justify-center text-base font-black rounded-lg"
            style={{
              color:
                avg > 0
                  ? readableTextOn(gradeColor(avg))
                  : dm
                    ? "#94A3B8"
                    : "#64748B",
              background:
                avg > 0 ? gradeColor(avg) : dm ? "#0F172A" : "#F1F5F9",
            }}
          >
            {avg > 0 ? avg.toFixed(1) : "—"}
          </span>
        </div>
      </div>
      {noteError && (
        <p
          role="alert"
          className={`!m-0 text-xs font-bold ${dm ? "text-[#FCA5A5]" : "text-[#B91C1C]"}`}
        >
          {noteError}
        </p>
      )}
    </motion.div>
  );
});

GradeRow.displayName = "GradeRow";
export default GradeRow;
