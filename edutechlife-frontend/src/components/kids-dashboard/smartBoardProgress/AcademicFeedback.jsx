import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";

const semaforo = (nota) => {
  if (nota >= 3.5)
    return { color: "bg-green-500", label: "Aprobado", dot: "🟢" };
  if (nota >= 3.0)
    return { color: "bg-yellow-400", label: "Riesgo", dot: "🟡" };
  return { color: "bg-red-500", label: "Necesita mejorar", dot: "🔴" };
};

const consejo = (avg) => {
  if (avg === null) return null;
  if (avg >= 4.0)
    return "¡Excelente! Sigue así y usa las Educards para mantener tu nivel.";
  if (avg >= 3.0)
    return "Vas bien. Enfócate en las materias en amarillo con sesiones de 20 min.";
  return "¡No te rindas! Habla con Dani para un plan personalizado.";
};

const VAK_LABELS = {
  visual: "Visual",
  auditivo: "Auditivo",
  kinestesico: "Kinestésico",
  auditory: "Auditivo",
  kinesthetic: "Kinestésico",
};

const cardClass = (darkMode) =>
  `rounded-2xl p-5 border transition-colors duration-500 shadow-sm backdrop-blur-xl ${
    darkMode
      ? "bg-[#1E293B]/80 border-[#334155]/50"
      : "bg-white/80 border-[#E2E8F0]/50"
  }`;

const headingClass = (darkMode) =>
  `text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? "text-white" : "text-[#004B63]"}`;

const AcademicFeedback = ({ onTabChange }) => {
  const { studentGrades, vakResult, upcomingExams, darkMode } =
    useSmartBoardKids();

  const gradesArray = useMemo(() => {
    if (!studentGrades) return [];
    const toGrade = (g) => {
      // New 4-period format: average non-null periods
      const vals = [g.p1, g.p2, g.p3, g.p4].filter(
        (v) => v != null && !isNaN(Number(v)),
      );
      if (vals.length)
        return vals.reduce((a, b) => a + Number(b), 0) / vals.length;
      // Legacy formats
      return Number(g.grade ?? g.score ?? g.nota ?? 0);
    };
    if (Array.isArray(studentGrades))
      return studentGrades.map((g) => ({ ...g, grade: toGrade(g) }));
    // Support object shape { subject: grade }
    return Object.entries(studentGrades).map(([subject, grade]) => ({
      subject,
      grade:
        typeof grade === "object"
          ? (grade.grade ?? grade.nota ?? 0)
          : Number(grade),
    }));
  }, [studentGrades]);

  const average = useMemo(() => {
    if (!gradesArray.length) return null;
    const sum = gradesArray.reduce((acc, g) => acc + (g.grade ?? 0), 0);
    return Math.round((sum / gradesArray.length) * 10) / 10;
  }, [gradesArray]);

  const vakStyle = useMemo(() => {
    const raw = vakResult?.predominantStyle ?? vakResult?.dominant ?? null;
    if (!raw) return null;
    return VAK_LABELS[raw.toLowerCase()] ?? raw;
  }, [vakResult]);

  const nextExams = useMemo(() => {
    if (!upcomingExams?.length) return [];
    return upcomingExams.slice(0, 3);
  }, [upcomingExams]);

  const tip = consejo(average);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cardClass(darkMode)}
    >
      <h2 className={headingClass(darkMode)}>📚 Retroalimentación Académica</h2>

      {/* Promedio general */}
      <div className="mb-5">
        <p
          className={`text-[11px] font-medium mb-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
        >
          Promedio general
        </p>
        {average !== null ? (
          <div className="flex items-end gap-2">
            <span
              className={`text-5xl font-black leading-none ${
                average >= 3.5
                  ? "text-green-500"
                  : average >= 3.0
                    ? "text-yellow-400"
                    : "text-red-500"
              }`}
            >
              {average.toFixed(1)}
            </span>
            <span
              className={`text-sm pb-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
            >
              / 5.0
            </span>
          </div>
        ) : (
          <p
            className={`text-sm italic ${darkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
          >
            Aún no tienes calificaciones registradas.
          </p>
        )}
      </div>

      {/* Semáforo de materias */}
      {gradesArray.length > 0 && (
        <div className="mb-5">
          <p
            className={`text-[11px] font-medium mb-2 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
          >
            Materias
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {gradesArray.map((g, i) => {
              const s = semaforo(g.grade);
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                    darkMode ? "bg-[#0F172A]/60" : "bg-[#F8FAFC]"
                  }`}
                >
                  <span
                    className={`text-xs font-medium truncate ${darkMode ? "text-[#CBD5E1]" : "text-[#334155]"}`}
                  >
                    {s.dot} {g.subject}
                  </span>
                  <span
                    className={`text-xs font-bold ml-2 shrink-0 ${
                      g.grade >= 3.5
                        ? "text-green-500"
                        : g.grade >= 3.0
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {g.grade.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Estilo de aprendizaje VAK */}
      <div className="mb-5">
        <p
          className={`text-[11px] font-medium mb-2 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
        >
          Estilo de aprendizaje
        </p>
        {vakStyle ? (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
              darkMode
                ? "bg-[#1E3A5F] text-[#93C5FD]"
                : "bg-[#EFF6FF] text-[#2563EB]"
            }`}
          >
            🧠 {vakStyle}
          </span>
        ) : (
          <button
            onClick={() => onTabChange?.("vak")}
            className="text-xs font-medium text-[#4DA8C4] underline underline-offset-2 hover:text-[#2d8fa8] transition-colors"
          >
            Haz tu diagnóstico VAK →
          </button>
        )}
      </div>

      {/* Próximos exámenes */}
      <div className="mb-5">
        <p
          className={`text-[11px] font-medium mb-2 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
        >
          📅 Próximos exámenes
        </p>
        {nextExams.length > 0 ? (
          <ul className="space-y-1.5">
            {nextExams.map((exam, i) => {
              const date = exam.date
                ? new Date(exam.date).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                  })
                : "Sin fecha";
              const subject = exam.subject ?? exam.materia ?? "Materia";
              return (
                <li
                  key={i}
                  className={`flex items-center justify-between text-xs rounded-lg px-3 py-2 ${
                    darkMode
                      ? "bg-[#0F172A]/60 text-[#CBD5E1]"
                      : "bg-[#F8FAFC] text-[#334155]"
                  }`}
                >
                  <span>{subject}</span>
                  <span
                    className={`font-semibold ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
                  >
                    {date}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p
            className={`text-xs italic ${darkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
          >
            No tienes exámenes próximos registrados.
          </p>
        )}
      </div>

      {/* Consejo personalizado */}
      {tip && (
        <div
          className={`rounded-xl px-4 py-3 text-xs leading-relaxed ${
            darkMode
              ? "bg-[#0F172A]/60 text-[#94A3B8]"
              : "bg-[#F0F9FF] text-[#0369A1]"
          }`}
        >
          💡 {tip}
        </div>
      )}
    </motion.div>
  );
};

export default AcademicFeedback;
