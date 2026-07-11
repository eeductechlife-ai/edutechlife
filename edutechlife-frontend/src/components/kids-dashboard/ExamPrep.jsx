import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { analyzeDocumentText } from "../../utils/api";
import { extractDocumentText } from "../../utils/documentParser";

const subjects = [
  { v: "matematicas", l: "Matemáticas", i: "🔢" },
  { v: "lenguaje", l: "Lenguaje", i: "📖" },
  { v: "ciencias", l: "Ciencias", i: "🔬" },
  { v: "historia", l: "Historia", i: "🏛️" },
  { v: "ingles", l: "Inglés", i: "🌎" },
  { v: "arte", l: "Arte", i: "🎨" },
];
const daysLeft = (d) =>
  Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));
const badgeCls = (d) =>
  d > 30
    ? "text-green-600 bg-green-50 border-green-200"
    : d >= 14
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : d >= 7
        ? "text-orange-600 bg-orange-50 border-orange-200"
        : "text-red-600 bg-red-50 border-red-200";
const badgeEmj = (d) => (d > 30 ? "🌱" : d >= 14 ? "📝" : d >= 7 ? "⚡" : "🔥");
const getTips = (vak) => {
  const style = vak?.predominantStyle || "visual";
  const map = {
    visual: [
      "Crea mapas mentales con colores",
      "Usa tarjetas visuales",
      "Dibuja diagramas",
    ],
    auditivo: [
      "Graba tus apuntes y escúchalos",
      "Explica en voz alta",
      "Usa rimas para recordar",
    ],
    kinestesico: [
      "Haz ejercicios prácticos",
      "Construye modelos",
      "Camina mientras repasas",
    ],
  };
  return (map[style] || map.visual).slice(0, 2);
};
const sbj = (val) => subjects.find((s) => s.v === val);
const inpCls =
  "w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#004B63] placeholder:text-[#94A3B8] text-sm focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 bg-[#F8FAFC]";
const gdCls =
  "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all";

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
        {subjects.map((s) => (
          <motion.button
            key={s.v}
            onClick={() => sS(s.v)}
            className={`p-2.5 rounded-xl border-2 transition-all text-sm ${s === s.v ? "border-[#4DA8C4] bg-[#4DA8C4]/10 text-[#004B63] font-semibold" : "border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]/30"}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-1">{s.i}</span>
            {s.l}
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
          onClick={(e) => {
            e.stopPropagation();
            onDelete(exam.id);
          }}
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

const MaterialUploader = memo(({ examId, onMaterialUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);

  const handleFile = useCallback(
    async (file) => {
      setUploading(true);
      try {
        const text = await extractDocumentText(file);
        const analysis = await analyzeDocumentText(text, file.name, "General");
        onMaterialUploaded(examId, { fileName: file.name, ...analysis });
      } catch (e) {
        console.warn("Upload failed:", e);
      }
      setUploading(false);
    },
    [examId, onMaterialUploaded],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${drag ? "border-[#4DA8C4] bg-[#4DA8C4]/10 scale-[1.02]" : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#4DA8C4]/50"}`}
      onDragEnter={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}
    >
      <input
        type="file"
        accept=".pdf,.txt,.png,.jpg,.jpeg"
        onChange={(e) => {
          const f = e.target.files[0];
          if (f) handleFile(f);
        }}
        className="hidden"
        id={`upload-${examId}`}
      />
      <label htmlFor={`upload-${examId}`} className="cursor-pointer block">
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <motion.div
              className="w-5 h-5 border-2 border-[#4DA8C4] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-sm text-[#64748B]">
              Analizando material...
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">📄</span>
            <span className="text-sm text-[#64748B]">
              Sube apuntes, PDF o foto para generar plan de estudio IA
            </span>
          </div>
        )}
      </label>
    </motion.div>
  );
});

const StudyPlanCard = memo(({ material }) => {
  if (!material) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-gradient-to-br from-[#4DA8C4]/5 to-[#66CCCC]/10 border border-[#4DA8C4]/20 space-y-3"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">📋</span>
        <h4 className="text-sm font-bold text-[#004B63]">Plan de Estudio IA</h4>
        <span className="text-[10px] text-[#64748B] ml-auto">
          {material.fileName}
        </span>
      </div>
      {material.strengths?.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-[#66CCCC] uppercase tracking-wider mb-1">
            Fortalezas
          </p>
          <div className="flex flex-wrap gap-1">
            {material.strengths.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] rounded-full border border-green-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {material.improvements?.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-[#FF6B9D] uppercase tracking-wider mb-1">
            Por mejorar
          </p>
          <div className="flex flex-wrap gap-1">
            {material.improvements.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] rounded-full border border-red-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {material.tutoringQuestions?.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-[#4DA8C4] uppercase tracking-wider mb-1">
            Preguntas guía
          </p>
          <ul className="space-y-1">
            {material.tutoringQuestions.slice(0, 3).map((q, i) => (
              <li
                key={i}
                className="text-xs text-[#64748B] flex items-start gap-2"
              >
                <span className="text-[#4DA8C4]">•</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
});

const ExamDetail = memo(
  ({
    e: exam,
    tips,
    materials,
    onDelete,
    onBack,
    onAskDani,
    onUploadMaterial,
  }) => {
    const d = daysLeft(exam.date);
    const p = Math.min(exam.studyProgress || 0, 100);
    const si = sbj(exam.subject);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm"
      >
        <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <motion.button
              onClick={onBack}
              whileHover={{ x: -3 }}
              className="text-white/80 hover:text-white text-sm"
            >
              ← Volver
            </motion.button>
            <motion.button
              onClick={() => onDelete(exam.id)}
              whileHover={{ scale: 1.1 }}
              className="text-white/60 hover:text-red-300 text-lg"
            >
              ×
            </motion.button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{si?.i || "📚"}</span>
            <div>
              <h3 className="font-bold text-lg">{exam.name}</h3>
              <p className="text-white/70 text-sm">
                {si?.l} • Meta: {exam.desiredGrade}/100
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-5">
          <div className="text-center">
            <span
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-lg font-black ${badgeCls(d)}`}
            >
              <span className="text-2xl">{badgeEmj(d)}</span>
              {d === 0
                ? "¡El examen es hoy!"
                : d === 1
                  ? "¡Mañana!"
                  : `${d} días restantes`}
            </span>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-semibold text-[#004B63]">
                Progreso de estudio
              </span>
              <span className="font-black text-[#4DA8C4]">{p}%</span>
            </div>
            <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${p}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              Meta: {exam.desiredGrade}/100
            </p>
          </div>
          {tips.length > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/10 border border-[#4DA8C4]/20">
              <h4 className="text-sm font-bold text-[#004B63] mb-2">
                💡 Tips de estudio
              </h4>
              <ul className="space-y-1.5">
                {tips.map((tip, i) => (
                  <li
                    key={i}
                    className="text-xs text-[#64748B] flex items-start gap-2"
                  >
                    <span className="text-[#4DA8C4] mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {materials?.length > 0 &&
            materials.map((m, i) => <StudyPlanCard key={i} material={m} />)}
          <MaterialUploader
            examId={exam.id}
            onMaterialUploaded={onUploadMaterial}
          />
          <motion.button
            onClick={onAskDani}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${gdCls} w-full py-3 flex items-center justify-center gap-2`}
          >
            🤖 Preguntar a Dani sobre este examen
          </motion.button>
        </div>
      </motion.div>
    );
  },
);

const MATERIALS_LS = "edutechlife_exam_materials";

const ExamPrep = memo(() => {
  const {
    vakResult,
    setDocumentForDani,
    exams,
    setExams,
    examMaterials,
    setExamMaterials,
  } = useSmartBoardKids();
  const [mode, setMode] = useState("list");
  const [detailId, setDetailId] = useState(null);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("matematicas");
  const [date, setDate] = useState("");
  const [grade, setGrade] = useState(70);

  const addExam = useCallback(() => {
    if (!name.trim() || !date) return;
    setExams((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.trim(),
        subject,
        date,
        desiredGrade: Math.min(100, Math.max(0, grade)),
        studyProgress: 0,
        createdAt: new Date().toISOString(),
      },
    ]);
    setName("");
    setDate("");
    setGrade(70);
    setMode("list");
  }, [name, subject, date, grade]);

  const deleteExam = useCallback(
    (id) => {
      setExams((prev) => prev.filter((e) => e.id !== id));
      setExamMaterials((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (detailId === id) {
        setMode("list");
        setDetailId(null);
      }
    },
    [detailId, setExamMaterials],
  );

  const handleUploadMaterial = useCallback(
    (examId, analysis) => {
      setExamMaterials((prev) => ({
        ...prev,
        [examId]: [
          ...(prev[examId] || []),
          { ...analysis, uploadedAt: new Date().toISOString() },
        ],
      }));
    },
    [setExamMaterials],
  );

  const sorted = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  const detailExam = exams.find((e) => e.id === detailId);
  const tips = detailExam ? getTips(vakResult) : [];
  const detailMaterials = detailId ? examMaterials[detailId] || [] : [];

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
            {sorted.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sorted.map((exam, i) => (
                  <ExamCard
                    key={exam.id}
                    e={exam}
                    i={i}
                    onView={(e) => {
                      setDetailId(e.id);
                      setMode("detail");
                    }}
                    onDelete={deleteExam}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <span className="text-6xl mb-4 block">📅</span>
                <p className="text-[#64748B] font-semibold">
                  No tienes exámenes registrados
                </p>
                <p className="text-sm text-[#94A3B8] mt-1">
                  ¡Agrega tu primer examen para ver la cuenta regresiva!
                </p>
              </motion.div>
            )}
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
