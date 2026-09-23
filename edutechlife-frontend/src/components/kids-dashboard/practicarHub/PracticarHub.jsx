import { memo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Gamepad2,
  FileText,
  Camera,
  ChevronRight,
  X,
  Upload,
  Loader2,
  Sparkles,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { callDeepseekSmartboard } from "../../../utils/api";
import {
  generateStudySummary,
  generateStudySummaryFromImage,
} from "../../../services/documentSummaryAI";
import ScannerSummaryResult from "../ScannerSummaryResult";

// ── paleta de materias ────────────────────────────────────────────────────────

const SUBJECT_META = {
  matematicas: { emoji: "🔢", color: "#FB8500", label: "Matemáticas" },
  lenguaje: { emoji: "📖", color: "#9D4EDD", label: "Lenguaje" },
  ciencias: { emoji: "🔬", color: "#06D6A0", label: "Ciencias" },
  ciencias_naturales: { emoji: "🔬", color: "#06D6A0", label: "Ciencias" },
  sociales: { emoji: "🌍", color: "#EF476F", label: "Sociales" },
  ciencias_sociales: { emoji: "🌍", color: "#EF476F", label: "Sociales" },
  ingles: { emoji: "🇬🇧", color: "#FFD166", label: "Inglés" },
  quimica: { emoji: "⚗️", color: "#E76F51", label: "Química" },
  fisica: { emoji: "⚡", color: "#2A9D8F", label: "Física" },
  informatica: { emoji: "💻", color: "#118AB2", label: "Informática" },
  filosofia: { emoji: "🦉", color: "#6D4C94", label: "Filosofía" },
};

const ACCEPT =
  "image/*,application/pdf,text/plain,.pdf,.docx,.txt,.jpg,.jpeg,.png";
const isImage = (f) => !!f && f.type.startsWith("image/");

// ── Generador de contenido ───────────────────────────────────────────────────

const CONTENT_TYPES = [
  {
    id: "resumen",
    label: "Resumen",
    emoji: "📄",
    desc: "Explicación clara del tema",
  },
  {
    id: "mapa",
    label: "Mapa conceptual",
    emoji: "🗺️",
    desc: "Ideas conectadas en texto",
  },
  {
    id: "ejercicios",
    label: "Ejercicios",
    emoji: "✏️",
    desc: "Practica con problemas",
  },
  {
    id: "video",
    label: "Videos recomendados",
    emoji: "🎬",
    desc: "Links y títulos de YouTube",
  },
];

function ContentGenerator({ weakSubjects, grade, onClose, darkMode }) {
  const [selectedSubject, setSelectedSubject] = useState(
    weakSubjects[0]?.id || "",
  );
  const [customTopic, setCustomTopic] = useState("");
  const [contentType, setContentType] = useState("resumen");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = useCallback(async () => {
    if (!selectedSubject) return;
    setLoading(true);
    setError("");
    setResult(null);
    const topic = customTopic.trim() || selectedSubject;
    const meta =
      SUBJECT_META[selectedSubject] || SUBJECT_META[selectedSubject] || {};
    const label = meta.label || selectedSubject;
    const typeLabel =
      CONTENT_TYPES.find((c) => c.id === contentType)?.label || contentType;

    const messages = [
      {
        role: "system",
        content: `Eres un tutor educativo para estudiantes colombianos de grado ${grade || 5}.
Genera ${typeLabel} sobre el tema indicado, en español, con lenguaje claro y adecuado para la edad.
${
  contentType === "video"
    ? `Lista 4-6 videos reales de YouTube educativos en español sobre ese tema. Para cada uno: Título, canal y breve descripción del contenido. No inventes URLs.`
    : contentType === "mapa"
      ? `Crea un mapa conceptual en texto con emojis y jerarquías claras usando guiones e indentación.`
      : contentType === "ejercicios"
        ? `Crea 5 ejercicios prácticos con sus respuestas al final.`
        : `Escribe un resumen claro de máximo 400 palabras con los conceptos clave resaltados en negritas.`
}
Formato Markdown. Sin tablas HTML.`,
      },
      {
        role: "user",
        content: `Genera ${typeLabel} sobre: "${topic}" (materia: ${label}, grado ${grade || 5})`,
      },
    ];

    try {
      const raw = await callDeepseekSmartboard(messages, {
        isJson: false,
        temperature: 0.7,
        maxTokens: 1200,
      });
      setResult(
        typeof raw === "string"
          ? raw
          : raw?.content || raw?.choices?.[0]?.message?.content || "",
      );
    } catch (e) {
      setError("Error al generar el contenido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, customTopic, contentType, grade]);

  const card = darkMode
    ? "bg-[#1E293B] border-[#334155]"
    : "bg-white border-[#E2E8F0]";
  const text = darkMode ? "text-white" : "text-[#1E293B]";
  const sub = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  return (
    <div className={`rounded-2xl border p-5 space-y-4 ${card}`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-bold text-base ${text}`}>
          ✨ Generar contenido de estudio
        </h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg ${sub} hover:opacity-70`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Selector de materia */}
      <div>
        <p className={`text-xs font-semibold mb-2 ${sub}`}>
          Materia a reforzar
        </p>
        <div className="flex flex-wrap gap-2">
          {weakSubjects.map((s) => {
            const m = SUBJECT_META[s.id] || {};
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  selectedSubject === s.id
                    ? "text-white border-transparent"
                    : darkMode
                      ? "bg-[#334155] border-[#475569] text-white"
                      : "bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B]"
                }`}
                style={
                  selectedSubject === s.id
                    ? { background: m.color || "#9D4EDD" }
                    : {}
                }
              >
                {m.emoji} {m.label || s.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tema personalizado */}
      <input
        value={customTopic}
        onChange={(e) => setCustomTopic(e.target.value)}
        placeholder="Tema específico (ej: fracciones, fotosíntesis…)"
        className={`w-full px-3 py-2 rounded-xl border text-sm outline-none focus:border-[#9D4EDD] ${
          darkMode
            ? "bg-[#0F172A] border-[#334155] text-white placeholder-[#64748B]"
            : "bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B] placeholder-[#94A3B8]"
        }`}
      />

      {/* Tipo de contenido */}
      <div>
        <p className={`text-xs font-semibold mb-2 ${sub}`}>Tipo de contenido</p>
        <div className="grid grid-cols-2 gap-2">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.id}
              onClick={() => setContentType(ct.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs transition-all ${
                contentType === ct.id
                  ? "bg-[#9D4EDD] border-[#9D4EDD] text-white"
                  : darkMode
                    ? "bg-[#334155] border-[#475569] text-white"
                    : "bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B]"
              }`}
            >
              <span className="text-base">{ct.emoji}</span>
              <span className="font-semibold">{ct.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-xl">
          {error}
        </p>
      )}

      <button
        onClick={generate}
        disabled={loading || !selectedSubject}
        className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all ${
          loading || !selectedSubject
            ? "opacity-40 cursor-not-allowed bg-[#9D4EDD]"
            : "bg-[#9D4EDD] hover:bg-[#7B2FF7]"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generando...
          </span>
        ) : (
          "✨ Generar"
        )}
      </button>

      {result && (
        <div
          className={`p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto ${
            darkMode
              ? "bg-[#0F172A] border-[#334155] text-[#CBD5E1]"
              : "bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B]"
          }`}
        >
          {result}
        </div>
      )}
    </div>
  );
}

// ── Escáner de documento ─────────────────────────────────────────────────────

function DocumentScanner({ grade, onClose, darkMode }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f) return;
    setFile(f);
    setSummary(null);
    setError("");
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }, []);

  const scan = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setSummary(null);
    try {
      let result;
      if (isImage(file)) {
        result = await generateStudySummaryFromImage(file, "", `${grade || 5}`);
      } else {
        result = await generateStudySummary(file, "", `${grade || 5}`);
      }
      setSummary(result);
    } catch {
      setError("No se pudo procesar el documento. Intenta con otro archivo.");
    } finally {
      setLoading(false);
    }
  }, [file, grade]);

  const card = darkMode
    ? "bg-[#1E293B] border-[#334155]"
    : "bg-white border-[#E2E8F0]";
  const text = darkMode ? "text-white" : "text-[#1E293B]";
  const sub = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  return (
    <div className={`rounded-2xl border p-5 space-y-4 ${card}`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-bold text-base ${text}`}>📷 Escanear documento</h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg ${sub} hover:opacity-70`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className={`text-xs ${sub}`}>
        Sube una foto de tu apunte, taller o página del libro. La IA extrae el
        tema y genera un resumen de aprendizaje.
      </p>

      {/* Dropzone */}
      <button
        onClick={() => fileRef.current?.click()}
        className={`w-full rounded-2xl border-2 border-dashed py-8 flex flex-col items-center gap-2 transition-colors ${
          darkMode
            ? "border-[#334155] hover:border-[#9D4EDD] text-[#94A3B8]"
            : "border-[#E2E8F0] hover:border-[#9D4EDD] text-[#64748B]"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="max-h-36 rounded-xl object-contain"
          />
        ) : (
          <>
            <Upload className="w-8 h-8 opacity-50" />
            <span className="text-sm font-medium">
              {file ? file.name : "Toca para subir foto o documento"}
            </span>
            <span className="text-xs opacity-60">JPG, PNG, PDF, DOCX, TXT</span>
          </>
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-xl">
          {error}
        </p>
      )}

      {file && !summary && (
        <button
          onClick={scan}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm text-white bg-[#9D4EDD] hover:bg-[#7B2FF7] disabled:opacity-50 transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analizando documento…
            </span>
          ) : (
            "🔍 Analizar y aprender"
          )}
        </button>
      )}

      {summary && (
        <ScannerSummaryResult
          summary={summary}
          fileName={file?.name}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

// ── Banner de temas débiles ──────────────────────────────────────────────────

function WeakTopicsBanner({ weakSubjects, studentName, darkMode }) {
  if (!weakSubjects.length) return null;
  const bg = darkMode
    ? "bg-amber-900/20 border-amber-500/30"
    : "bg-amber-50 border-amber-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 ${bg}`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
            {studentName ? `${studentName}, ` : ""}estos temas necesitan
            refuerzo
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {weakSubjects.map((s) => {
              const m = SUBJECT_META[s.id] || {};
              return (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-white"
                  style={{ background: m.color || "#EF476F" }}
                >
                  {m.emoji} {m.label || s.id}
                  {s.grade != null && (
                    <span className="opacity-80 ml-0.5">({s.grade})</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Tarjetas de acción principales ───────────────────────────────────────────

function ActionCard({
  icon: Icon,
  emoji,
  title,
  desc,
  color,
  gradient,
  onClick,
  badge,
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col items-start gap-3 p-5 rounded-2xl text-white text-left w-full overflow-hidden shadow-lg"
      style={{ background: gradient }}
    >
      {badge && (
        <span className="absolute top-3 right-3 text-[10px] font-black bg-white/25 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <span className="text-3xl">{emoji}</span>
      <div>
        <p className="font-black text-sm leading-tight">{title}</p>
        <p className="text-[11px] opacity-80 mt-0.5 leading-snug">{desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 opacity-70 self-end mt-auto" />
    </motion.button>
  );
}

// ── Hub principal ────────────────────────────────────────────────────────────

const PracticarHub = memo(({ onTabChange, darkMode }) => {
  const { supabaseQueries, subjectsWithGrades, studentAge } = useIngenIAKids();
  const studentData = supabaseQueries?.studentData?.data;
  const studentName = studentData?.name?.split(" ")[0] || "";
  const grade = studentData?.grade;

  // Temas débiles: nota < 3.5 o progress < 50
  const weakSubjects = (subjectsWithGrades || [])
    .filter(
      (s) =>
        (s.grade != null && parseFloat(s.grade) < 3.5) ||
        (s.progress != null && s.progress < 50),
    )
    .slice(0, 5)
    .map((s) => ({
      id: s.id || s.subject,
      grade: s.grade,
    }));

  // Si no hay datos de notas, sugerimos los primeros 3 temas como "práctica general"
  const practiceSubjects = weakSubjects.length
    ? weakSubjects
    : (subjectsWithGrades || []).slice(0, 3).map((s) => ({
        id: s.id || s.subject,
        grade: null,
      }));

  const [activePanel, setActivePanel] = useState(null); // 'generator' | 'scanner'

  const card = darkMode
    ? "bg-[#1E293B]/80 border-[#334155]/50"
    : "bg-white/80 border-[#E2E8F0]/50";
  const textPrimary = darkMode ? "text-white" : "text-[#1E293B]";
  const textSub = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  return (
    <div className="space-y-5 pb-24 md:pb-6">
      {/* ── Encabezado de bienvenida ── */}
      <div className={`rounded-2xl border p-5 backdrop-blur-xl ${card}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h2 className={`font-black text-base ${textPrimary}`}>
              {studentName ? `¡Hola, ${studentName}!` : "¡Hora de practicar!"}
            </h2>
            <p className={`text-xs mt-0.5 ${textSub}`}>
              Elige cómo quieres reforzar tus conocimientos hoy.
            </p>
          </div>
        </div>
      </div>

      {/* ── Banner de temas débiles ── */}
      {weakSubjects.length > 0 && (
        <WeakTopicsBanner
          weakSubjects={weakSubjects}
          studentName={studentName}
          darkMode={darkMode}
        />
      )}

      {/* ── Panel activo (generador o escáner) ── */}
      <AnimatePresence mode="wait">
        {activePanel === "generator" && (
          <motion.div
            key="generator"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ContentGenerator
              weakSubjects={
                practiceSubjects.length
                  ? practiceSubjects
                  : [{ id: "matematicas" }]
              }
              grade={grade}
              onClose={() => setActivePanel(null)}
              darkMode={darkMode}
            />
          </motion.div>
        )}
        {activePanel === "scanner" && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <DocumentScanner
              grade={grade}
              onClose={() => setActivePanel(null)}
              darkMode={darkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Grid de herramientas (2×2) ── */}
      <div>
        <h3
          className={`text-xs font-bold mb-3 uppercase tracking-wide ${textSub}`}
        >
          Herramientas de práctica
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <ActionCard
            emoji="🃏"
            title="EduCards"
            desc="Flashcards inteligentes. Aprende y repasa con IA."
            gradient="linear-gradient(135deg, #06D6A0 0%, #1B9AAA 55%, #118AB2 100%)"
            onClick={() => {
              setActivePanel(null);
              onTabChange("flashcards");
            }}
          />
          <ActionCard
            emoji="🎮"
            title="Retos Inteligentes"
            desc="Preguntas de tu grado. Gana XP y sube de nivel."
            gradient="linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)"
            badge="🔥 DBA"
            onClick={() => {
              setActivePanel(null);
              onTabChange("retos");
            }}
          />
          <ActionCard
            emoji="✨"
            title="Generar contenido"
            desc="Resumen, mapa conceptual, ejercicios o videos del tema."
            gradient="linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)"
            onClick={() =>
              setActivePanel(activePanel === "generator" ? null : "generator")
            }
          />
          <ActionCard
            emoji="📷"
            title="Escanear documento"
            desc="Sube tu apunte o libro y la IA lo convierte en aprendizaje."
            gradient="linear-gradient(135deg, #FB8500 0%, #FFB703 55%, #FFD166 100%)"
            onClick={() =>
              setActivePanel(activePanel === "scanner" ? null : "scanner")
            }
          />
        </div>
      </div>

      {/* ── Progreso rápido ── */}
      {weakSubjects.length > 0 && (
        <div className={`rounded-2xl border p-4 backdrop-blur-xl ${card}`}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#9D4EDD]" />
            <p className={`text-xs font-bold ${textPrimary}`}>
              Áreas a fortalecer
            </p>
          </div>
          <div className="space-y-2">
            {weakSubjects.slice(0, 4).map((s) => {
              const m = SUBJECT_META[s.id] || {};
              const pct =
                s.grade != null
                  ? Math.min((parseFloat(s.grade) / 5) * 100, 100)
                  : 45;
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-sm w-5 shrink-0">
                    {m.emoji || "📚"}
                  </span>
                  <p
                    className={`text-xs font-medium flex-1 truncate ${textPrimary}`}
                  >
                    {m.label || s.id}
                  </p>
                  <div className="w-24 h-1.5 rounded-full bg-[#E2E8F0] dark:bg-[#334155] overflow-hidden shrink-0">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: m.color || "#9D4EDD",
                      }}
                    />
                  </div>
                  {s.grade != null && (
                    <span
                      className={`text-[10px] font-bold w-6 text-right ${
                        parseFloat(s.grade) < 3
                          ? "text-red-400"
                          : "text-amber-500"
                      }`}
                    >
                      {parseFloat(s.grade).toFixed(1)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tip motivacional ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`rounded-2xl border p-4 text-center backdrop-blur-xl ${card}`}
      >
        <p className={`text-xs ${textSub} leading-relaxed`}>
          <Sparkles className="inline w-3.5 h-3.5 mr-1 text-[#9D4EDD]" />
          <strong>Consejo del día:</strong> Practicar 15 minutos al día es más
          efectivo que estudiar 2 horas el día antes del examen. ¡Tú puedes!
        </p>
      </motion.div>
    </div>
  );
});

PracticarHub.displayName = "PracticarHub";
export default PracticarHub;
