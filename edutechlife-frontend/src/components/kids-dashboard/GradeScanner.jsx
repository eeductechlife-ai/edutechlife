import { useState, useCallback, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { callDeepseek } from "../../utils/api";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";

const getSubjects = (t) => [
  { v: "matematicas", l: t("kid.grades.subject_matematicas"), i: "🔢" },
  { v: "lenguaje", l: t("kid.grades.subject_lenguaje"), i: "📖" },
  { v: "ciencias", l: t("kid.grades.subject_ciencias"), i: "🔬" },
  { v: "sociales", l: t("kid.grades.subject_sociales"), i: "🌍" },
  { v: "ingles", l: t("kid.grades.subject_ingles"), i: "🇬🇧" },
  { v: "arte", l: t("kid.grades.subject_arte"), i: "🎨" },
  {
    v: "educacion_fisica",
    l: t("kid.grades.subject_educacion_fisica"),
    i: "⚽",
  },
  { v: "tecnologia", l: t("kid.grades.subject_tecnologia"), i: "💻" },
];

const gradeColor = (n) => {
  if (n >= 4.5) return "#22C55E";
  if (n >= 3.5) return "#EAB308";
  if (n >= 3.0) return "#F97316";
  return "#EF4444";
};
const gradeEmoji = (n) => {
  if (n >= 4.5) return "🌟";
  if (n >= 3.5) return "✅";
  if (n >= 3.0) return "⚠️";
  return "🔴";
};

const GradeRow = memo(({ grade, subjects, onUpdate, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 10 }}
    className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm"
  >
    <span className="text-lg w-8 text-center">
      {subjects.find((s) => s.v === grade.subject)?.i || "📚"}
    </span>
    <select
      value={grade.subject}
      onChange={(e) => onUpdate(grade.id, "subject", e.target.value)}
      className="flex-1 text-sm text-[#004B63] font-semibold bg-transparent border-none outline-none"
    >
      {subjects.map((s) => (
        <option key={s.v} value={s.v}>
          {s.l}
        </option>
      ))}
    </select>
    <div className="flex items-center gap-1">
      <input
        type="number"
        min="0"
        max="5"
        step="0.1"
        value={grade.score}
        onFocus={(e) => e.target.select()}
        onChange={(e) =>
          onUpdate(grade.id, "score", parseFloat(e.target.value) || 0)
        }
        className="w-16 text-center text-lg font-black border-2 rounded-lg outline-none p-1"
        style={{
          color: gradeColor(grade.score),
          borderColor: gradeColor(grade.score) + "40",
        }}
      />
      <span className="text-sm text-[#64748B]">/5</span>
    </div>
    <span className="text-lg">{gradeEmoji(grade.score)}</span>
    <button
      onClick={() => onRemove(grade.id)}
      className="text-red-300 hover:text-red-500 transition-colors text-sm px-1"
    >
      ✕
    </button>
  </motion.div>
));
GradeRow.displayName = "GradeRow";

const uid = () => Math.random().toString(36).slice(2, 8);

export default memo(function GradeScanner({ onTabChange }) {
  const {
    studentGrades,
    setStudentGrades,
    vakResult,
    addPoints,
    setDocumentForDani,
    userId,
  } = useSmartBoardKids();
  const { t } = useTranslation();
  const SUBJECTS = getSubjects(t);
  const [grades, setGrades] = useState(
    studentGrades.length
      ? studentGrades
      : SUBJECTS.slice(0, 5).map((s) => ({
          id: uid(),
          subject: s.v,
          score: 3.5,
        })),
  );
  const [scanning, setScanning] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [scanMode, setScanMode] = useState("manual"); // "manual" | "image"
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const fileRef = useRef(null);
  const isPdf =
    imgFile?.type === "application/pdf" ||
    imgFile?.name?.toLowerCase().endsWith(".pdf");

  const loadHistory = useCallback(async () => {
    const token = sessionStorage.getItem("auth_token");
    if (!token || !userId) return;
    try {
      const { createSupabaseClient } = await import("../../lib/supabase");
      const sb = createSupabaseClient(token);
      const { data } = await sb
        .from("grade_analyses")
        .select("id, grades, avg_score, plan, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (data?.length) setHistory(data);
    } catch {}
  }, [userId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const saveAnalysis = useCallback(
    async (planData, gradeData) => {
      const token = sessionStorage.getItem("auth_token");
      if (!token || !userId) return;
      try {
        const { createSupabaseClient } = await import("../../lib/supabase");
        const sb = createSupabaseClient(token);
        const avg = gradeData.length
          ? gradeData.reduce((s, g) => s + g.score, 0) / gradeData.length
          : 0;
        await sb.from("grade_analyses").insert({
          student_user_id: userId,
          grades: gradeData,
          plan: planData,
          avg_score: parseFloat(avg.toFixed(1)),
          vak_style: vakResult?.dominant || null,
        });
        await loadHistory();
      } catch {}
    },
    [userId, vakResult, loadHistory],
  );

  const addRow = () =>
    setGrades((prev) => [
      ...prev,
      { id: uid(), subject: "matematicas", score: 3.5 },
    ]);

  const updateGrade = useCallback((id, field, val) => {
    setGrades((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: val } : g)),
    );
  }, []);

  const removeGrade = useCallback(
    (id) => setGrades((prev) => prev.filter((g) => g.id !== id)),
    [],
  );

  const handleImageFile = useCallback(
    async (f) => {
      if (!f) return;
      setImgFile(f);
      setImgPreview(URL.createObjectURL(f));
      setExtracting(true);
      setError("");

      const isPdfFile =
        f.type === "application/pdf" || f.name?.toLowerCase().endsWith(".pdf");

      try {
        let extractedGrades = [];

        if (isPdfFile) {
          // PDFs: extract text locally (no CDN needed) then parse with AI
          const { parsePDF } = await import("../../utils/documentParser");
          const text = await parsePDF(f);
          if (text) {
            const prompt = `Texto de un boletín colombiano (escala 1.0-5.0):
"${text.slice(0, 2500)}"
Extrae TODAS las calificaciones. Usa solo estos nombres: matematicas, lenguaje, ciencias, sociales, ingles, arte, educacion_fisica, tecnologia.
Responde SOLO JSON: {"grades": [{"subject": "matematicas", "score": 4.2}]}
Si no hay notas: {"grades": []}`;
            const res = await callDeepseek(
              [{ role: "user", content: prompt }],
              { temperature: 0.1, maxTokens: 500, isJson: true },
            );
            const parsed = typeof res === "string" ? JSON.parse(res) : res;
            extractedGrades = parsed?.grades || [];
          }
        } else {
          // Images: OCR via backend Google Vision API, then structure with DeepSeek
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(f);
          });
          const { API_BASE_URL } = await import("../../config/api");
          const token = sessionStorage.getItem("auth_token");
          const resp = await fetch(
            `${API_BASE_URL}/api/smartboard/scan-image`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ imageBase64: base64 }),
            },
          );
          if (!resp.ok) {
            const errBody = await resp.json().catch(() => null);
            const err = new Error(errBody?.error || `HTTP ${resp.status}`);
            err.status = resp.status;
            throw err;
          }
          const { text } = await resp.json();

          if (text && text.trim().length > 10) {
            const prompt = `Texto OCR de un boletín colombiano (escala 1.0-5.0):
"${text.slice(0, 2500)}"
Extrae TODAS las calificaciones. Usa solo estos nombres: matematicas, lenguaje, ciencias, sociales, ingles, arte, educacion_fisica, tecnologia.
Responde SOLO JSON: {"grades": [{"subject": "matematicas", "score": 4.2}]}
Si no hay notas claras: {"grades": []}`;
            const res = await callDeepseek(
              [{ role: "user", content: prompt }],
              { temperature: 0.1, maxTokens: 500, isJson: true },
            );
            const parsed = typeof res === "string" ? JSON.parse(res) : res;
            extractedGrades = parsed?.grades || [];
          }
        }

        if (extractedGrades.length > 0) {
          setGrades(extractedGrades.map((g) => ({ id: uid(), ...g })));
          setScanMode("manual");
          setError("");
        } else {
          setScanMode("manual");
          setError(t("kid.grades.error_no_grades"));
        }
      } catch (e) {
        // Keep image visible so user can see their boletín as reference
        if (e.status === 402) {
          setError(
            "⚠️ Sin saldo de IA. Mira tu boletín arriba e ingresa tus notas abajo manualmente.",
          );
        } else {
          setError(
            "📸 Imagen cargada. Mirá tu boletín arriba e ingresá tus notas abajo — Dani las analizará.",
          );
        }
      } finally {
        setExtracting(false);
      }
    },
    [t],
  );

  const analyze = useCallback(async () => {
    if (grades.length === 0) return;
    setScanning(true);
    setError("");
    setPlan(null);

    const gradeList = grades
      .map((g) => {
        const s = SUBJECTS.find((x) => x.v === g.subject);
        return `${s?.l || g.subject}: ${g.score}/5`;
      })
      .join(", ");

    const vakStyle = vakResult
      ? `Estilo de aprendizaje VAK del estudiante: ${vakResult.dominant || "visual"}.`
      : "";

    const prompt = `Eres Dani, tutora IA educativa de EdutechLife para Colombia. ${vakStyle}

El estudiante tiene estas calificaciones: ${gradeList}

Analiza y responde SOLO con JSON:
{
  "overall": "frase motivadora corta sobre el desempeño general",
  "strengths": ["materia fuerte 1 con emoji", "materia fuerte 2"],
  "weaknesses": [
    {
      "subject": "nombre materia",
      "score": 3.0,
      "why": "por qué puede estar fallando (1 frase)",
      "vakTip": "consejo específico según estilo VAK",
      "steamLink": "cómo conectar con STEAM (1 frase)",
      "actions": ["acción concreta 1", "acción concreta 2", "acción concreta 3"]
    }
  ],
  "studyPlan": [
    {
      "week": 1,
      "focus": "materia prioritaria",
      "activities": ["actividad 1", "actividad 2"],
      "daniTip": "consejo de Dani para esa semana"
    },
    {
      "week": 2,
      "focus": "materia 2",
      "activities": ["actividad 1", "actividad 2"],
      "daniTip": "consejo semana 2"
    }
  ],
  "motivation": "mensaje motivador final de Dani al estudiante"
}`;

    try {
      const res = await callDeepseek([{ role: "user", content: prompt }], {
        temperature: 0.7,
        maxTokens: 1800,
        isJson: true,
      });
      const parsed = typeof res === "string" ? JSON.parse(res) : res;
      setPlan(parsed);
      setStudentGrades(grades);
      addPoints?.(50);
      saveAnalysis(parsed, grades);
    } catch (e) {
      const msg = e.message || "";
      if (msg.includes("402") || msg.toLowerCase().includes("saldo")) {
        setError(
          "⚠️ El servicio de IA no tiene saldo. Por favor recarga tu cuenta DeepSeek.",
        );
      } else {
        setError(t("kid.grades.error_analyze"));
      }
    } finally {
      setScanning(false);
    }
  }, [
    grades,
    vakResult,
    setStudentGrades,
    addPoints,
    SUBJECTS,
    t,
    saveAnalysis,
  ]);

  const avg = grades.length
    ? (grades.reduce((s, g) => s + g.score, 0) / grades.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FB8500] to-[#FFD166] flex items-center justify-center shadow-md">
          <span className="text-xl">📊</span>
        </div>
        <div>
          <h3 className="text-lg font-black text-[#004B63]">
            {t("kid.grades.title")}
          </h3>
          <p className="text-xs text-[#64748B]">{t("kid.grades.subtitle")}</p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 p-1 bg-[#F1F5F9] rounded-xl">
        {[
          { id: "manual", label: t("kid.grades.tab_manual") },
          { id: "image", label: t("kid.grades.tab_image") },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setScanMode(m.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              scanMode === m.id
                ? "bg-white text-[#004B63] shadow-sm"
                : "text-[#64748B]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Image scan mode */}
      <AnimatePresence mode="wait">
        {scanMode === "image" && (
          <motion.div
            key="img-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleImageFile(e.target.files[0])
              }
            />
            {imgPreview ? (
              <div className="relative">
                {isPdf ? (
                  <div className="w-full py-5 px-4 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] flex items-center gap-3">
                    <span className="text-3xl">📄</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#004B63] text-sm truncate">
                        {imgFile.name}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {(imgFile.size / 1024).toFixed(0)} KB · PDF
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={imgPreview}
                    alt="boletín"
                    className="w-full max-h-48 object-contain rounded-xl border border-[#E2E8F0]"
                  />
                )}
                <button
                  onClick={() => {
                    setImgFile(null);
                    setImgPreview(null);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-red-400 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-10 border-2 border-dashed border-[#4DA8C4]/40 rounded-2xl text-center space-y-2 hover:border-[#4DA8C4] transition-colors"
              >
                <span className="text-4xl block">📷</span>
                <p className="text-sm font-semibold text-[#004B63]">
                  {t("kid.grades.upload_boletin")}
                </p>
                <p className="text-xs text-[#64748B]">
                  {t("kid.grades.boletin_hint")}
                </p>
              </button>
            )}
            {extracting && (
              <div className="flex items-center gap-2 text-sm text-[#4DA8C4]">
                <motion.div
                  className="w-4 h-4 border-2 border-[#4DA8C4] border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    ease: "linear",
                  }}
                />
                {t("kid.grades.extracting")}
              </div>
            )}
            {error && (
              <p className="text-sm text-orange-500 bg-orange-50 rounded-xl p-3">
                {error}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual grade entry */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#004B63]">
            📋 {t("kid.grades.my_notes")}{" "}
            {grades.length > 0 && (
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs font-black"
                style={{
                  backgroundColor: gradeColor(Number(avg)) + "20",
                  color: gradeColor(Number(avg)),
                }}
              >
                {t("kid.grades.average", { avg })}
              </span>
            )}
          </p>
          <button
            onClick={addRow}
            className="text-xs text-[#4DA8C4] font-semibold hover:underline"
          >
            {t("kid.grades.add_subject")}
          </button>
        </div>
        <AnimatePresence>
          {grades.map((g) => (
            <GradeRow
              key={g.id}
              grade={g}
              subjects={SUBJECTS}
              onUpdate={updateGrade}
              onRemove={removeGrade}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Analyze button */}
      <motion.button
        onClick={analyze}
        disabled={scanning || grades.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl font-black text-white shadow-lg text-base disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #FB8500 0%, #FFD166 100%)",
        }}
      >
        {scanning ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            />
            {t("kid.grades.analyzing")}
          </span>
        ) : (
          t("kid.grades.analyze_btn")
        )}
      </motion.button>

      {error && scanMode !== "image" && (
        <p
          className={`text-sm text-center rounded-xl p-3 ${
            error.startsWith("⚠️")
              ? "text-orange-600 bg-orange-50"
              : "text-red-500"
          }`}
        >
          {error}
        </p>
      )}

      {/* History — past analyses */}
      {history.length > 0 && !plan && (
        <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#004B63] hover:bg-[#F8FAFC] transition-colors"
          >
            <span>📚 Historial de análisis ({history.length})</span>
            <span className="text-[#64748B]">{showHistory ? "▲" : "▼"}</span>
          </button>
          {showHistory && (
            <div className="divide-y divide-[#F1F5F9]">
              {history.map((h) => (
                <div key={h.id} className="px-4 py-3 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#64748B]">
                      {new Date(h.created_at).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: gradeColor(Number(h.avg_score)) + "20",
                        color: gradeColor(Number(h.avg_score)),
                      }}
                    >
                      {gradeEmoji(Number(h.avg_score))} {h.avg_score}/5
                    </span>
                  </div>
                  {h.plan?.overall && (
                    <p className="text-xs text-[#374151] line-clamp-2">
                      {h.plan.overall}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Plan result */}
      <AnimatePresence>
        {plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Overall + motivation */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#0077B6] text-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <span className="font-bold">{t("kid.grades.dani_says")}</span>
              </div>
              <p className="text-sm leading-relaxed">{plan.overall}</p>
            </div>

            {/* Strengths */}
            {plan.strengths?.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="font-bold text-emerald-700 mb-2">
                  {t("kid.grades.strengths")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {plan.strengths.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses with VAK + STEAM */}
            {plan.weaknesses?.length > 0 && (
              <div className="space-y-3">
                <p className="font-bold text-[#004B63]">
                  {t("kid.grades.to_improve")}
                </p>
                {plan.weaknesses.map((w, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white border-2 border-orange-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-[#004B63]">
                        {w.subject}
                      </span>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: gradeColor(w.score) }}
                      >
                        {w.score}/5
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B]">{w.why}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
                        <p className="text-xs font-bold text-purple-600 mb-1">
                          👁️ VAK
                        </p>
                        <p className="text-xs text-purple-700">{w.vakTip}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-100">
                        <p className="text-xs font-bold text-cyan-600 mb-1">
                          🔬 STEAM
                        </p>
                        <p className="text-xs text-cyan-700">{w.steamLink}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {w.actions?.map((a, j) => (
                        <div
                          key={j}
                          className="flex items-start gap-2 text-xs text-[#374151]"
                        >
                          <span className="text-orange-400 mt-0.5">→</span>
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Study plan weeks */}
            {plan.studyPlan?.length > 0 && (
              <div className="space-y-3">
                <p className="font-bold text-[#004B63]">
                  {t("kid.grades.study_plan")}
                </p>
                {plan.studyPlan.map((week, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-full bg-[#4DA8C4] text-white text-xs font-black flex items-center justify-center">
                        {week.week}
                      </span>
                      <span className="font-bold text-[#004B63] text-sm">
                        {t("kid.grades.week", {
                          week: week.week,
                          focus: week.focus,
                        })}
                      </span>
                    </div>
                    <ul className="space-y-1 mb-2">
                      {week.activities?.map((a, j) => (
                        <li
                          key={j}
                          className="text-xs text-[#374151] flex items-start gap-1.5"
                        >
                          <span className="text-[#4DA8C4]">•</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-1.5 text-xs text-[#4DA8C4] bg-[#4DA8C4]/10 rounded-lg p-2">
                      <span>🤖</span>
                      <span>{week.daniTip}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Motivation */}
            {plan.motivation && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EF476F]/10 to-[#FF6B9D]/10 border border-[#EF476F]/20 text-center">
                <p className="text-sm text-[#004B63] font-semibold leading-relaxed">
                  💫 {plan.motivation}
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="grid grid-cols-1 gap-3">
              <motion.button
                onClick={() => {
                  setDocumentForDani?.({
                    title: t("kid.grades.doc_title"),
                    subject: t("kid.grades.doc_subject"),
                    summary:
                      `${plan.overall || ""} ${plan.motivation || ""}`.trim(),
                    strengths: plan.strengths || [],
                    improvements: (plan.weaknesses || []).map(
                      (w) => `${w.subject}: ${w.why || ""}`,
                    ),
                    score: Math.round(
                      (grades.reduce((s, g) => s + g.score, 0) /
                        Math.max(grades.length, 1)) *
                        20,
                    ),
                    difficulty: "personalizado",
                    tutoringQuestions: (plan.weaknesses || [])
                      .slice(0, 4)
                      .map(
                        (w) =>
                          `¿Cómo te está yendo en ${w.subject}? ¿Qué te parece más difícil?`,
                      ),
                  });
                  window.dispatchEvent(new CustomEvent("smartboard:open-dani"));
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-2xl font-bold text-white text-sm shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #4DA8C4 0%, #66CCCC 100%)",
                }}
              >
                {t("kid.grades.talk_about_plan")}
              </motion.button>
              <motion.button
                onClick={() => onTabChange?.("flashcards")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-2xl font-bold text-white text-sm shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #EF476F 0%, #FF6B9D 100%)",
                }}
              >
                {t("kid.grades.go_flashcards")}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
