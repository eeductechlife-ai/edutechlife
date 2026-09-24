import { memo, useState, useCallback, useRef, useEffect } from "react";
import { X, Loader2, Camera, Upload, FileText } from "lucide-react";
import {
  generateStudySummary,
  generateStudySummaryFromImage,
} from "../../../services/documentSummaryAI";
import ScannerSummaryResult from "../ScannerSummaryResult";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { logPractice } from "./practicarProgress";

const FILE_ACCEPT = "image/*,application/pdf,text/plain,.pdf,.docx,.txt";
const MAX_MB = 15;

const DocumentScanner = memo(({ grade, subjectLabel, onClose, darkMode }) => {
  const { setDocumentForDani } = useIngenIAKids();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cameraRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(
        `El archivo pesa más de ${MAX_MB} MB. Prueba con uno más liviano.`,
      );
      return;
    }
    setFile(f);
    setSummary(null);
    setError("");
    setPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
  }, []);

  const scan = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const g = `${grade || 5}`;
      const result = file.type.startsWith("image/")
        ? await generateStudySummaryFromImage(file, "", g)
        : await generateStudySummary(file, "", g);
      setSummary(result);
      logPractice({ type: "escaneo", subject: subjectLabel || null });
    } catch {
      setError(
        "No pudimos leer el documento. Intenta con una foto más nítida o con otro archivo.",
      );
    } finally {
      setLoading(false);
    }
  }, [file, grade, subjectLabel]);

  const askDani = useCallback(() => {
    setDocumentForDani?.({
      type: "document_summary",
      subject: subjectLabel,
      title: summary?.title || "Mi documento",
      summary: `El estudiante escaneó material de ${subjectLabel || "estudio"}${
        summary?.title ? ` sobre "${summary.title}"` : ""
      }. Ya tiene un resumen y quiere profundizar o resolver dudas.`,
      hasImage: !!preview,
      studySummary: summary || null,
    });
    window.dispatchEvent(new CustomEvent("smartboard:open-dani"));
  }, [setDocumentForDani, subjectLabel, summary, preview]);

  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setSummary(null);
    setError("");
  }, []);

  const card = darkMode
    ? "bg-[#1E293B] border-[#334155]"
    : "bg-white border-[#E2E8F0]";
  const text = darkMode ? "text-white" : "text-[#1E293B]";
  const sub = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const idle = darkMode
    ? "bg-[#0F172A] border-[#334155] text-white"
    : "bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B]";

  return (
    <section
      aria-label="Escanear documento"
      className={`rounded-2xl border p-4 sm:p-5 space-y-4 ${card}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={`font-bold text-base ${text}`}>Escanear mi apunte</h3>
          <p className={`text-xs mt-0.5 ${sub}`}>
            Toma una foto de tu cuaderno, taller o libro. La IA encuentra el
            tema y te lo explica.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className={`w-11 h-11 -mr-2 -mt-2 flex items-center justify-center rounded-xl shrink-0 ${sub} hover:bg-black/5`}
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {!file && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl text-white font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, #FB8500 0%, #FFB703 100%)",
            }}
          >
            <Camera className="w-7 h-7" aria-hidden="true" />
            Tomar foto
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed font-bold text-sm ${idle}`}
          >
            <Upload className="w-7 h-7 opacity-70" aria-hidden="true" />
            Subir archivo
            <span className={`text-[10px] font-medium ${sub}`}>
              Foto, PDF, Word o TXT
            </span>
          </button>
        </div>
      )}

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={fileRef}
        type="file"
        accept={FILE_ACCEPT}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {file && !summary && (
        <div
          className={`rounded-2xl border p-3 flex items-center gap-3 ${idle}`}
        >
          {preview ? (
            <img
              src={preview}
              alt="Vista previa del documento"
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
          ) : (
            <span className="w-16 h-16 rounded-xl flex items-center justify-center bg-[#FB8500]/10 shrink-0">
              <FileText className="w-7 h-7 text-[#FB8500]" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold truncate">{file.name}</p>
            <button
              type="button"
              onClick={reset}
              className={`text-xs underline ${sub}`}
            >
              Cambiar archivo
            </button>
          </div>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="text-xs text-red-500 bg-red-500/10 px-3 py-2 rounded-xl"
        >
          {error}
        </p>
      )}

      {file && !summary && (
        <button
          type="button"
          onClick={scan}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #FB8500 0%, #9D4EDD 100%)",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Leyendo tu documento…
            </span>
          ) : (
            "🔍 Explicarme este tema"
          )}
        </button>
      )}

      {summary && (
        <ScannerSummaryResult
          summary={summary}
          img={preview}
          subjectLabel={subjectLabel}
          darkMode={darkMode}
          onAskDani={askDani}
          onReset={reset}
        />
      )}
    </section>
  );
});

DocumentScanner.displayName = "DocumentScanner";
export default DocumentScanner;
