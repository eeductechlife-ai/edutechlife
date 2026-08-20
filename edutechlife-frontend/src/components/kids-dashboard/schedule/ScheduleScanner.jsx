import { useCallback, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { callDeepseek } from "../../../utils/api";
import { API_BASE_URL } from "../../../config/api";
import { coerceSlot } from "./timetableUtils";

const ACCEPT = "image/*,application/pdf,.pdf,.jpg,.jpeg,.png";

const buildUserPrompt = (rawText) => `
${rawText.slice(0, 4500)}

Extrae los bloques de clase. Responde SOLO con JSON:
{"school_name":null,"term_label":null,"slots":[{"day_of_week":1,"start_time":"07:00","end_time":"08:00","subject":"Matemáticas"}]}

- day_of_week: 1=Mon...7=Sun
- time: HH:MM
- Si no hay datos: {"slots":[]}
`;

// OCR via backend (Google Vision) — same pattern as GradeScanner
const ocrImageViaBackend = async (file) => {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const token = sessionStorage.getItem("auth_token");
  const resp = await fetch(`${API_BASE_URL}/api/smartboard/scan-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ imageBase64: base64 }),
  });
  if (!resp.ok) {
    const body = await resp.json().catch(() => null);
    throw Object.assign(new Error(body?.error || `HTTP ${resp.status}`), {
      status: resp.status,
    });
  }
  const { text } = await resp.json();
  return text || "";
};

const ScheduleScanner = memo(({ onExtracted, onCancel }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [stage, setStage] = useState("idle"); // idle | reading | analyzing
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const camRef = useRef(null);
  const docRef = useRef(null);

  const isPdf =
    file?.type === "application/pdf" ||
    file?.name?.toLowerCase().endsWith(".pdf");

  const handleFile = useCallback((f) => {
    if (!f) return;
    setError("");
    setFile(f);
    if (f.type.startsWith("image/")) {
      const r = new FileReader();
      r.onload = (e) => setPreview(e.target.result);
      r.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }, []);

  const analyze = useCallback(async () => {
    if (!file) return;
    setError("");
    setStage("reading");
    setProgress(15);
    try {
      let text = "";

      try {
        if (isPdf) {
          // PDF: extract text locally (pdfjs-dist is browser-safe)
          const { parsePDF } = await import("../../../utils/documentParser");
          text = await parsePDF(file);
        } else {
          // Image: OCR via backend (Google Vision) — no tesseract in browser
          text = await ocrImageViaBackend(file);
        }
      } catch (ocrError) {
        console.error("[ScheduleScanner] OCR error:", ocrError?.message);
        throw new Error(
          `Error al leer ${isPdf ? "PDF" : "imagen"}: ${ocrError?.message || "Error desconocido"}`,
        );
      }

      if (!text || text.trim().length < 10) {
        throw new Error(
          `Sin texto legible. ${isPdf ? "PDF vacío o corrupto" : "Foto muy borrosa"}. Intenta de nuevo.`,
        );
      }


      setProgress(55);
      setStage("analyzing");

      const res = await callDeepseek(
        [{ role: "user", content: buildUserPrompt(text) }],
        { isJson: true, temperature: 0.05, maxTokens: 3000 },
      );

      // Second-pass parsing (same as GradeScanner) in case parseJsonResult returned a string
      const result = typeof res === "string" ? JSON.parse(res) : res;

      const rawSlots = Array.isArray(result?.slots) ? result.slots : [];
      const slots = rawSlots.map(coerceSlot).filter(Boolean);

      if (!slots.length) {
        throw new Error(
          "La IA no encontró bloques válidos. Revisa que el horario sea legible o edita manualmente.",
        );
      }

      setProgress(100);
      onExtracted({
        school_name: result?.school_name || null,
        term_label: result?.term_label || null,
        slots,
      });
    } catch (e) {
      console.error("[ScheduleScanner] Error:", e?.message, e?.raw);
      if (e?.status === 402) {
        setError(
          "⚠️ Sin saldo de IA. Toma una foto del horario e ingrésalo manualmente.",
        );
      } else if (e?.message?.includes("JSON")) {
        setError(
          "⚠️ La IA no devolvió formato válido. Intenta de nuevo o ingresa manualmente.",
        );
      } else {
        setError(
          e?.message || "No se pudo analizar el horario. Intenta de nuevo.",
        );
      }
      setStage("idle");
      setProgress(0);
    }
  }, [file, isPdf, onExtracted]);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setError("");
    setStage("idle");
    setProgress(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm"
    >
      <header className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center text-xl shadow">
          📅
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[#004B63]">
            Escanea tu horario
          </h3>
          <p className="text-xs text-[#64748B]">
            Toma una foto del horario del colegio o sube el PDF. Podrás revisar
            y corregir antes de guardar.
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-[#64748B] hover:text-[#004B63] px-2 py-1 rounded-lg"
            aria-label="Cancelar"
          >
            ✕
          </button>
        )}
      </header>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex gap-2">
          <span aria-hidden>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {stage === "idle" && !file && (
          <motion.div
            key="pick"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <button
              type="button"
              onClick={() => camRef.current?.click()}
              className="p-6 rounded-2xl border-2 border-dashed border-[#4DA8C4]/50 hover:border-[#4DA8C4] transition-colors bg-[#F0F9FB] text-left"
            >
              <div className="text-3xl mb-2">📸</div>
              <div className="font-semibold text-[#004B63]">Tomar foto</div>
              <div className="text-xs text-[#64748B]">
                Usa la cámara del dispositivo
              </div>
            </button>
            <button
              type="button"
              onClick={() => docRef.current?.click()}
              className="p-6 rounded-2xl border-2 border-dashed border-[#66CCCC]/60 hover:border-[#66CCCC] transition-colors bg-[#F0FBFB] text-left"
            >
              <div className="text-3xl mb-2">📄</div>
              <div className="font-semibold text-[#004B63]">Subir archivo</div>
              <div className="text-xs text-[#64748B]">
                Foto o PDF (máx 10 MB)
              </div>
            </button>
          </motion.div>
        )}

        {stage === "idle" && file && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {isPdf ? (
              <div className="w-full py-5 px-4 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] flex items-center gap-3">
                <span className="text-3xl">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#004B63] text-sm truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {(file.size / 1024).toFixed(0)} KB · PDF
                  </p>
                </div>
              </div>
            ) : preview ? (
              <img
                src={preview}
                alt="Preview horario"
                className="w-full max-h-72 object-contain rounded-xl border border-[#E2E8F0]"
              />
            ) : (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#64748B]">
                {file.name} — {(file.size / 1024).toFixed(0)} KB
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={analyze}
                className="flex-1 min-w-[8rem] px-4 py-3 rounded-xl bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-semibold shadow hover:shadow-md transition-shadow"
              >
                Analizar horario
              </button>
              <button
                type="button"
                onClick={reset}
                className="px-4 py-3 rounded-xl border-2 border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Cambiar archivo
              </button>
            </div>
          </motion.div>
        )}

        {(stage === "reading" || stage === "analyzing") && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-xl bg-[#F0F9FB] border border-[#4DA8C4]/30 space-y-3"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-[#004B63]">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                🔄
              </motion.span>
              {stage === "reading"
                ? "Leyendo el archivo…"
                : "Detectando materias y horas…"}
            </div>
            <div className="w-full h-2 rounded-full bg-white overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={camRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={docRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </motion.div>
  );
});

ScheduleScanner.displayName = "ScheduleScanner";
export default ScheduleScanner;
