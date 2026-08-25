import { useState } from "react";
import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import {
  GRADE_OPTIONS,
  COUNTRY_OPTIONS,
} from "../../../data/curriculum/curriculumHelper";

const LEVEL_COLORS = {
  "Básica Primaria": {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
  },
  "Básica Secundaria": {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
  },
  "Media Vocacional": {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
  },
};

export default function GradeSelector({ onSave, compact = false }) {
  const { gradeLevel, setGradeLevel, countryCode, setCountryCode, darkMode } =
    useSmartBoardKids();

  const [localGrade, setLocalGrade] = useState(gradeLevel ?? "");
  const [localCountry, setLocalCountry] = useState(countryCode ?? "CO");
  const [saved, setSaved] = useState(false);

  const selectedOption = GRADE_OPTIONS.find((o) => o.value === localGrade);

  function handleSave() {
    if (!localGrade) return;
    setGradeLevel(localGrade);
    setCountryCode(localCountry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSave?.({ gradeLevel: localGrade, countryCode: localCountry });
  }

  // Compact: tap a grade → auto-saves immediately, no button needed
  if (compact) {
    function handleTap(value) {
      setLocalGrade(value);
      setGradeLevel(value);
      setCountryCode("CO");
      setSaved(true);
      onSave?.({ gradeLevel: value, countryCode: "CO" });
    }

    if (saved) {
      return (
        <span className="text-xs font-semibold text-[#06D6A0]">
          ✓ Grado {localGrade}° registrado
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1.5">
        {GRADE_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => handleTap(o.value)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all hover:scale-105 active:scale-95 ${
              darkMode
                ? "border-gray-600 text-gray-300 hover:border-[#0096C7] hover:text-[#0096C7] bg-gray-800"
                : "border-gray-200 text-gray-600 hover:border-[#0096C7] hover:text-[#0096C7] bg-white"
            }`}
          >
            {o.value}°
          </button>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 border space-y-4 ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-100 shadow-sm"
      }`}
    >
      <div>
        <h3
          className={`font-bold text-base mb-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          🏫 Tu grado y país
        </h3>
        <p
          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Dani usará el currículo oficial de tu país para personalizar tu plan
          de estudio.
        </p>
      </div>

      {/* Country */}
      <div>
        <label
          className={`text-xs font-semibold mb-1.5 block ${darkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          País
        </label>
        <div className="flex flex-wrap gap-2">
          {COUNTRY_OPTIONS.map((c) => (
            <button
              key={c.value}
              onClick={() => setLocalCountry(c.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                localCountry === c.value
                  ? "border-[#0096C7] bg-[#0096C7]/10 text-[#0096C7] font-semibold"
                  : darkMode
                    ? "border-gray-600 text-gray-400 hover:border-gray-400"
                    : "border-gray-200 text-gray-500 hover:border-gray-400"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grade grid */}
      <div>
        <label
          className={`text-xs font-semibold mb-1.5 block ${darkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          Grado escolar
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
          {GRADE_OPTIONS.map((o) => {
            const colors = LEVEL_COLORS[o.level] ?? {
              bg: "bg-gray-100",
              text: "text-gray-600",
            };
            const isSelected = localGrade === o.value;
            return (
              <button
                key={o.value}
                onClick={() => setLocalGrade(o.value)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "border-[#0096C7] bg-[#0096C7] text-white shadow-md scale-105"
                    : `${colors.bg} ${colors.text} border-transparent hover:border-[#0096C7]/40`
                }`}
              >
                <span
                  className={`font-bold text-sm leading-none ${isSelected ? "text-white" : ""}`}
                >
                  {o.value}°
                </span>
                <span
                  className={`text-[10px] mt-0.5 leading-tight ${isSelected ? "text-white/80" : "opacity-70"}`}
                >
                  {o.level.replace("Básica ", "").replace(" Vocacional", "")}
                </span>
              </button>
            );
          })}
        </div>
        {selectedOption && (
          <p
            className={`text-xs mt-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            {selectedOption.label} · {selectedOption.level}
          </p>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={!localGrade}
        className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
          saved
            ? "bg-green-500 text-white"
            : localGrade
              ? "bg-[#0096C7] hover:bg-[#0077B6] text-white shadow-md active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {saved ? "✓ Perfil actualizado" : "Guardar mi grado"}
      </button>
    </motion.div>
  );
}
