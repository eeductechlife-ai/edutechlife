import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subjects, inpCls, gdCls } from "./examUtils";
import useExamPrep from "./useExamPrep";
import ExamList from "./components/ExamList";
import ExamDetail from "./components/ExamDetail";

const ExamForm = memo(({ n, sN, s, sS, d, sD, g, sG, onAdd }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5"
  >
    <div>
      <label className="text-sm font-semibold text-[#004B63] mb-1.5 block">
        Nombre del examen
      </label>
      <input
        type="text"
        value={n}
        onChange={(e) => sN(e.target.value)}
        placeholder="Ej: Examen final de álgebra"
        className={inpCls}
      />
    </div>
    <div>
      <label className="text-sm font-semibold text-[#004B63] mb-2 block">
        Materia
      </label>
      <div className="grid grid-cols-3 gap-2">
        {subjects.map((sb) => (
          <motion.button
            key={sb.v}
            onClick={() => sS(sb.v)}
            className={`p-2.5 rounded-xl border-2 transition-all text-sm ${sb.v === s ? "border-[#4DA8C4] bg-[#4DA8C4]/10 text-[#004B63] font-semibold" : "border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]/30"}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-1">{sb.i}</span>
            {sb.l}
          </motion.button>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-semibold text-[#004B63] mb-1.5 block">
          Fecha del examen
        </label>
        <input
          type="date"
          value={d}
          onChange={(e) => sD(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className={inpCls}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-[#004B63] mb-1.5 block">
          Nota deseada (0-100)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            value={g}
            onChange={(e) => sG(Number(e.target.value))}
            className="flex-1 accent-[#4DA8C4]"
          />
          <span className="text-lg font-black text-[#4DA8C4] min-w-[3ch] text-center">
            {g}
          </span>
        </div>
      </div>
    </div>
    <motion.button
      onClick={onAdd}
      disabled={!n.trim() || !d}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${gdCls} w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      ➕ Agregar Examen
    </motion.button>
  </motion.div>
));

const ExamPrep = memo(() => {
  const {
    mode, setMode,
    detailId, setDetailId,
    name, setName,
    subject, setSubject,
    date, setDate,
    grade, setGrade,
    addExam,
    deleteExam,
    handleUploadMaterial,
    sorted,
    detailExam,
    tips,
    detailMaterials,
    setDocumentForDani,
  } = useExamPrep();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h3 className="text-lg font-bold text-[#004B63]">📝 Exámenes</h3>
        {mode === "form" ? (
          <motion.button
            onClick={() => setMode("list")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-3 py-1.5 text-sm rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
          >
            Cancelar
          </motion.button>
        ) : (
          <motion.button
            onClick={() => {
              setMode("form");
              setDetailId(null);
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 8px 20px rgba(77,168,196,0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-1.5 text-sm rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-semibold shadow-md"
          >
            + Nuevo
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === "form" && (
          <ExamForm
            key="form"
            n={name}
            sN={setName}
            s={subject}
            sS={setSubject}
            d={date}
            sD={setDate}
            g={grade}
            sG={setGrade}
            onAdd={addExam}
          />
        )}

        {mode === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ExamList
              exams={sorted}
              onView={(e) => {
                setDetailId(e.id);
                setMode("detail");
              }}
              onDelete={deleteExam}
            />
          </motion.div>
        )}

        {mode === "detail" && detailExam && (
          <ExamDetail
            key="detail"
            e={detailExam}
            tips={tips}
            materials={detailMaterials}
            onDelete={deleteExam}
            onBack={() => {
              setMode("list");
              setDetailId(null);
            }}
            onAskDani={() => {
              setDocumentForDani({
                type: "exam_prep",
                exam: detailExam,
                tips,
                materials: detailMaterials,
              });
              const btn = document.getElementById("openDaniChat");
              if (btn) btn.click();
            }}
            onUploadMaterial={handleUploadMaterial}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

ExamPrep.displayName = "ExamPrep";
export { ExamPrep };
export default ExamPrep;
