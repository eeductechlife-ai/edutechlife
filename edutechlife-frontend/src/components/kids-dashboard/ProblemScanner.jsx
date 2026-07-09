import { useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { getFileIcon } from "../../utils/documentParser";
import { generateStudySummary } from "../../services/documentSummaryAI";
import ScannerSummaryResult from "./ScannerSummaryResult";

const sbj = [
  { v: "matematicas", l: "Matemáticas", i: "🔢" },
  { v: "lenguaje", l: "Lenguaje", i: "📖" },
  { v: "ciencias", l: "Ciencias", i: "🔬" },
  { v: "historia", l: "Historia", i: "🏛️" },
  { v: "ingles", l: "Inglés", i: "🌎" },
  { v: "arte", l: "Arte", i: "🎨" },
];
const ages = [
  { v: "6-8", l: "6-8 años" },
  { v: "9-11", l: "9-11 años" },
  { v: "12-14", l: "12-14 años" },
  { v: "15-17", l: "15-17 años" },
];
const gd = "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]";
const gd2 = "bg-gradient-to-r from-[#004B63] to-[#4DA8C4]";
const dc = (dm, light, dark) => (dm ? dark : light);

const ACCEPT =
  "image/*,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx,.txt,.jpg,.jpeg,.png";
const isImage = (f) => !!f && f.type.startsWith("image/");
const fmtSize = (b) => {
  if (!b) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

const ProblemScanner = memo(() => {
  const { setDocumentForDani, darkMode: dm } = useSmartBoardKids();
  const [mode, setMode] = useState("scan");
  const [img, setImg] = useState(null);
  const [file, setFile] = useState(null);
  const [subj, setSubj] = useState("");
  const [age, setAge] = useState("12-14");
  const [desc, setDesc] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const camRef = useRef(null);
  const docRef = useRef(null);
  const sl = sbj.find((s) => s.v === subj)?.l || subj;

  // Cargar archivo (imagen, PDF o TXT)
  const hf = useCallback((f) => {
    if (!f) return;
    setError("");
    setFile(f);
    if (isImage(f)) {
      const r = new FileReader();
      r.onload = (e) => setImg(e.target.result);
      r.readAsDataURL(f);
    } else {
      setImg(null);
    }
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setImg(null);
    setError("");
  }, []);

  // Procesar: extraer texto + generar resumen tipo profesor
  const analyze = useCallback(async () => {
    if (!file) return;
    setMode("processing");
    setError("");
    setProgress(10);
    setStage("Leyendo tu material...");

    try {
      const { extractDocumentText } =
        await import("../../utils/documentParser");
      setProgress(35);
      const text = await extractDocumentText(file);
      setOcrText(text);
      setProgress(65);
      setStage("El profesor está preparando tu resumen...");

      const result = await generateStudySummary(text, {
        subject: sl,
        ageKey: age,
      });
      setProgress(100);
      setSummary(result);
      setMode("result");
    } catch (e) {
      setError(
        e.message ||
          "No se pudo analizar el material. Intenta con otro archivo o una imagen más clara.",
      );
      setMode("scan");
    }
  }, [file, sl, age]);

  // Enviar a Dani para profundizar
  const askDani = useCallback(() => {
    setDocumentForDani({
      type: "document_summary",
      subject: sl,
      summary: `El estudiante subió material de ${sl || "estudio"}${
        summary?.title ? ` sobre "${summary.title}"` : ""
      }${desc ? `. Nota: ${desc}` : ""}. Ya tiene un resumen y quiere profundizar o resolver dudas.`,
      description: desc,
      hasImage: !!img,
      ocrText: ocrText || null,
      studySummary: summary || null,
    });
    document.getElementById("openDaniChat")?.click();
  }, [sl, desc, img, ocrText, summary, setDocumentForDani]);

  const reset = useCallback(() => {
    setMode("scan");
    setImg(null);
    setFile(null);
    setSubj("");
    setDesc("");
    setOcrText("");
    setSummary(null);
    setProgress(0);
    setStage("");
    setError("");
  }, []);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center text-lg shadow-md">
          📸
        </div>
        <div>
          <h3
            className={`text-lg font-bold ${dc(dm, "text-[#004B63]", "text-[#E2F0FF]")}`}
          >
            Escáner de Estudio
          </h3>
          <p
            className={`text-xs ${dc(dm, "text-[#64748B]", "text-[#94A3B8]")}`}
          >
            Sube una foto, documento o PDF y la IA te dará un resumen como un
            profesor
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === "scan" && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                <span className="text-lg shrink-0">⚠️</span>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                hf(e.dataTransfer.files[0]);
              }}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all backdrop-blur-xl ${
                file
                  ? "border-[#66CCCC] bg-[#66CCCC]/10"
                  : dc(
                      dm,
                      "border-[#E2E8F0]/50 bg-white/70 hover:border-[#4DA8C4]/50",
                      "bg-[#1E293B]/70 border-[#334155] hover:border-[#4DA8C4]/30",
                    )
              }`}
            >
              {file ? (
                isImage(file) ? (
                  <div className="relative">
                    <img
                      src={img}
                      alt="Vista previa"
                      className="w-full max-h-64 object-contain rounded-xl shadow-md"
                    />
                    <motion.button
                      onClick={clearFile}
                      whileHover={{ scale: 1.1 }}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-red-400 text-white rounded-full text-sm font-bold shadow-lg"
                    >
                      ×
                    </motion.button>
                  </div>
                ) : (
                  <div className="relative flex items-center gap-4 p-4 rounded-xl bg-white/80 border border-[#66CCCC]/40">
                    <span className="text-4xl">{getFileIcon(file.name)}</span>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="font-semibold text-[#004B63] truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {fmtSize(file.size)} · Documento listo para analizar
                      </p>
                    </div>
                    <motion.button
                      onClick={clearFile}
                      whileHover={{ scale: 1.1 }}
                      className="w-7 h-7 bg-red-400 text-white rounded-full text-sm font-bold shadow-lg shrink-0"
                    >
                      ×
                    </motion.button>
                  </div>
                )
              ) : (
                <>
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center mx-auto mb-4 shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-3xl">📚</span>
                  </motion.div>
                  <p
                    className={`text-lg font-semibold mb-2 ${dc(dm, "text-[#004B63]", "text-[#E2F0FF]")}`}
                  >
                    Sube tu foto, documento o PDF
                  </p>
                  <p
                    className={`text-sm mb-1 ${dc(dm, "text-[#64748B]", "text-[#94A3B8]")}`}
                  >
                    Arrastra un archivo aquí o usa los botones
                  </p>
                  <p
                    className={`text-xs ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
                  >
                    Formatos: JPG, PNG, PDF, DOCX, TXT
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <motion.button
                onClick={() => camRef.current?.click()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`py-4 ${gd} text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2`}
              >
                <span className="text-xl">📸</span> Tomar foto
              </motion.button>
              <motion.button
                onClick={() => {
                  const i = document.createElement("input");
                  i.type = "file";
                  i.accept = "image/*";
                  i.onchange = (e) => hf(e.target.files[0]);
                  i.click();
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="py-4 bg-white border-2 border-[#4DA8C4] text-[#004B63] rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <span className="text-xl">🖼️</span> Imagen
              </motion.button>
              <motion.button
                onClick={() => docRef.current?.click()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="py-4 bg-white border-2 border-[#66CCCC] text-[#004B63] rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <span className="text-xl">📄</span> Documento
              </motion.button>
            </div>

            <input
              ref={camRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => hf(e.target.files[0])}
              className="hidden"
            />
            <input
              ref={docRef}
              type="file"
              accept={ACCEPT}
              onChange={(e) => hf(e.target.files[0])}
              className="hidden"
            />

            <div>
              <label
                className={`text-sm font-semibold mb-2 block ${dc(dm, "text-[#004B63]", "text-[#E2F0FF]")}`}
              >
                Materia:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sbj.map((s) => (
                  <motion.button
                    key={s.v}
                    onClick={() => setSubj(s.v)}
                    className={`p-3 rounded-xl border-2 transition-all text-sm ${
                      subj === s.v
                        ? "border-[#4DA8C4] bg-[#4DA8C4]/10 text-[#004B63] font-semibold"
                        : dc(
                            dm,
                            "border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]/30",
                            "bg-[#1E293B] border-[#334155] text-[#94A3B8]",
                          )
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="mr-1">{s.i}</span>
                    {s.l}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label
                className={`text-sm font-semibold mb-2 block ${dc(dm, "text-[#004B63]", "text-[#E2F0FF]")}`}
              >
                Nivel del estudiante:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ages.map((a) => (
                  <motion.button
                    key={a.v}
                    onClick={() => setAge(a.v)}
                    className={`p-2 rounded-xl border-2 transition-all text-xs font-semibold ${
                      age === a.v
                        ? "border-[#4DA8C4] bg-[#4DA8C4]/10 text-[#004B63]"
                        : dc(
                            dm,
                            "border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]/30",
                            "bg-[#1E293B] border-[#334155] text-[#94A3B8]",
                          )
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {a.l}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label
                className={`text-sm font-semibold mb-2 block ${dc(dm, "text-[#004B63]", "text-[#E2F0FF]")}`}
              >
                ¿Algo específico que quieras entender? (opcional):
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Ej: No entiendo la parte de las fracciones..."
                rows={2}
                className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:border-[#4DA8C4] placeholder-[#94A3B8] ${
                  dm
                    ? "bg-[#1E293B] border-[#334155] text-[#E2F0FF]"
                    : "bg-[#F8FAFC] border-[#E2E8F0] text-[#004B63]"
                }`}
              />
            </div>

            <motion.button
              onClick={analyze}
              disabled={!file || !subj}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 ${gd2} text-white rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              🧑‍🏫 Generar resumen del profesor
            </motion.button>
          </motion.div>
        )}

        {mode === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center mx-auto mb-6 shadow-xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-4xl">🧑‍🏫</span>
            </motion.div>
            <h4
              className={`text-xl font-bold mb-2 ${dc(dm, "text-[#004B63]", "text-[#E2F0FF]")}`}
            >
              {stage || "Analizando tu material..."}
            </h4>
            <p
              className={`text-sm ${dc(dm, "text-[#64748B]", "text-[#94A3B8]")}`}
            >
              Leyendo el contenido y creando un resumen de calidad para ti
            </p>
            <div className="w-56 h-2 bg-[#E2E8F0] rounded-full mx-auto mt-4 overflow-hidden">
              <motion.div
                className={`h-full ${gd}`}
                initial={{ width: "0%" }}
                animate={{ width: `${Math.max(progress, 10)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {mode === "result" && summary && (
          <ScannerSummaryResult
            summary={summary}
            img={img}
            subjectLabel={sl}
            darkMode={dm}
            onAskDani={askDani}
            onReset={reset}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

ProblemScanner.displayName = "ProblemScanner";
export { ProblemScanner };
export default ProblemScanner;
