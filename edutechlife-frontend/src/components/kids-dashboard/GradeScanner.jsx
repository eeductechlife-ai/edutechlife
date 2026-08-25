import { useState, useCallback, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { callDeepseek } from "../../utils/api";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";
import { getSubjectEmoji, createSubject } from "../../config/subjectMappings";
import { useStudentGradesPersistence } from "../../hooks/useStudentGradesPersistence";
import { createSupabaseClient } from "../../lib/supabase";

// Default subjects with translations
const DEFAULT_SUBJECTS = [
  "matematicas",
  "lenguaje",
  "ciencias",
  "sociales",
  "ingles",
  "arte",
  "educacion_fisica",
  "tecnologia",
];

// Get subjects: dynamically from extractedSubjects or defaults
const getSubjects = (t, extractedSubjects = null) => {
  // If we have extracted subjects from OCR/PDF, use them
  if (extractedSubjects && Array.isArray(extractedSubjects)) {
    return extractedSubjects.map((name) => createSubject(name));
  }

  // Otherwise, use default subjects with translations
  return DEFAULT_SUBJECTS.map((key) => ({
    v: key,
    l: t(`kid.grades.subject_${key}`),
    i: getSubjectEmoji(t(`kid.grades.subject_${key}`)),
  }));
};

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
// Returns average of entered periods (supports 4-period format and legacy single score)
const getAvgScore = (g) => {
  const vals = [g.p1, g.p2, g.p3, g.p4].filter(
    (v) => v != null && !isNaN(Number(v)),
  );
  if (vals.length) return vals.reduce((a, b) => a + Number(b), 0) / vals.length;
  return Number(g.score) || 0;
};

const PeriodInput = ({ label, value, onChange }) => (
  <div className="flex flex-col items-center gap-0.5">
    <span className="text-[10px] font-bold text-[#94A3B8] uppercase">
      {label}
    </span>
    <input
      type="text"
      inputMode="decimal"
      placeholder="—"
      value={value != null ? value : ""}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        const raw = e.target.value.replace(",", ".");
        if (raw === "" || raw === "-") {
          onChange(null);
          return;
        }
        const n = parseFloat(raw);
        if (!isNaN(n) && n >= 0 && n <= 5) onChange(n);
      }}
      className="w-14 text-center text-sm font-bold border-2 rounded-lg outline-none p-1"
      style={{
        color: value != null ? gradeColor(Number(value)) : "#94A3B8",
        borderColor:
          value != null ? gradeColor(Number(value)) + "40" : "#E2E8F0",
      }}
    />
  </div>
);

const GradeRow = memo(({ grade, subjects, onUpdate, onRemove }) => {
  const avg = getAvgScore(grade);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-2"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg w-8 text-center flex-shrink-0">
          {subjects.find((s) => s.v === grade.subject)?.i || "📚"}
        </span>
        <select
          value={grade.subject}
          onChange={(e) => onUpdate(grade.id, "subject", e.target.value)}
          className="flex-1 text-sm text-[#004B63] font-semibold bg-transparent border-none outline-none min-w-0"
        >
          {subjects.map((s) => (
            <option key={s.v} value={s.v}>
              {s.l}
            </option>
          ))}
        </select>
        {avg > 0 && (
          <span
            className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: gradeColor(avg) + "20",
              color: gradeColor(avg),
            }}
          >
            {gradeEmoji(avg)} {avg.toFixed(1)}
          </span>
        )}
        <button
          onClick={() => onRemove(grade.id)}
          className="text-red-300 hover:text-red-500 transition-colors text-sm px-1 flex-shrink-0"
          aria-label="Eliminar materia"
        >
          ✕
        </button>
      </div>
      <div className="flex gap-2 pl-10">
        {["p1", "p2", "p3", "p4"].map((p, i) => (
          <PeriodInput
            key={p}
            label={`P${i + 1}`}
            value={grade[p]}
            onChange={(val) => onUpdate(grade.id, p, val)}
          />
        ))}
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-0.5 justify-end">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase">
            Prom
          </span>
          <span
            className="w-14 text-center text-sm font-black border-2 rounded-lg p-1"
            style={{
              color: avg > 0 ? gradeColor(avg) : "#94A3B8",
              borderColor: avg > 0 ? gradeColor(avg) + "40" : "#E2E8F0",
            }}
          >
            {avg > 0 ? avg.toFixed(1) : "—"}
          </span>
        </div>
      </div>
    </motion.div>
  );
});
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
  const { grades: persistedGrades, saveGrades } = useStudentGradesPersistence();

  // Support dynamic subjects extracted from documents.
  // Initialize from existing grades so OCR subject names survive navigation.
  const [extractedSubjectNames, setExtractedSubjectNames] = useState(() => {
    const initGrades = persistedGrades?.length
      ? persistedGrades
      : studentGrades?.length
        ? studentGrades
        : null;
    if (!initGrades) return null;
    const names = initGrades.map((g) => g.subject).filter(Boolean);
    const hasNonDefault = names.some((n) => !DEFAULT_SUBJECTS.includes(n));
    return hasNonDefault ? [...new Set(names)] : null;
  });
  const SUBJECTS = getSubjects(t, extractedSubjectNames);

  // Use persisted grades from hook, fall back to context, then empty list (no defaults on first load)
  const [grades, setGrades] = useState(() => {
    if (persistedGrades?.length) return persistedGrades;
    if (studentGrades?.length) return studentGrades;
    return []; // start empty — auto-load from Supabase history via loadHistory
  });
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [scanMode, setScanMode] = useState("manual"); // "manual" | "image"
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const fileRef = useRef(null);
  const initializedFromHistory = useRef(false);
  // Guard: prevents auto-save from overwriting persisted data with blank defaults
  const hasUserModified = useRef(false);
  const startedWithDefaults = useRef(!studentGrades.length);
  const isPdf =
    imgFile?.type === "application/pdf" ||
    imgFile?.name?.toLowerCase().endsWith(".pdf");

  const loadHistory = useCallback(async () => {
    const token = sessionStorage.getItem("auth_token");
    if (!token || !userId) return;
    try {
      const sb = createSupabaseClient(token);
      const { data } = await sb
        .from("grade_analyses")
        .select("id, grades, avg_score, plan, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (data?.length) {
        setHistory(data);
        // Auto-load latest grades on first mount only when started with defaults
        const latest = data[0];
        if (
          !initializedFromHistory.current &&
          startedWithDefaults.current &&
          latest.grades?.length > 0
        ) {
          initializedFromHistory.current = true;
          // Normalize: support both legacy { subject, score } and new { subject, p1..p4 }
          const latestGrades = latest.grades.map((g) => ({
            id: uid(),
            subject: g.subject,
            p1:
              g.p1 != null
                ? Number(g.p1)
                : g.p2 == null &&
                    g.p3 == null &&
                    g.p4 == null &&
                    g.score != null
                  ? Number(g.score)
                  : null,
            p2: g.p2 != null ? Number(g.p2) : null,
            p3: g.p3 != null ? Number(g.p3) : null,
            p4: g.p4 != null ? Number(g.p4) : null,
          }));
          setGrades(latestGrades);
          const subjectNames = [
            ...new Set(latestGrades.map((g) => g.subject).filter(Boolean)),
          ];
          if (subjectNames.length > 0) setExtractedSubjectNames(subjectNames);
        }
      }
    } catch {}
  }, [userId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Keep context in sync (lightweight — no localStorage write here to avoid overwriting persisted data)
  useEffect(() => {
    if (grades?.length) setStudentGrades(grades);
  }, [grades, setStudentGrades]);

  // Cleanup blob URLs on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (imgPreview) {
        URL.revokeObjectURL(imgPreview);
      }
    };
  }, [imgPreview]);

  const saveAnalysis = useCallback(
    async (planData, gradeData) => {
      const token = sessionStorage.getItem("auth_token");
      if (!token || !userId) return;
      try {
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

  const addRow = () => {
    hasUserModified.current = true;
    setGrades((prev) => [
      ...prev,
      {
        id: uid(),
        subject: "matematicas",
        p1: null,
        p2: null,
        p3: null,
        p4: null,
      },
    ]);
  };

  const updateGrade = useCallback((id, field, val) => {
    hasUserModified.current = true;
    setGrades((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: val } : g)),
    );
  }, []);

  const removeGrade = useCallback((id) => {
    hasUserModified.current = true;
    setGrades((prev) => prev.filter((g) => g.id !== id));
  }, []);

  // Explicit save: localStorage + Supabase (grade_analyses row with plan=null)
  const handleSave = useCallback(async () => {
    if (!grades.length) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const gradeData = grades.map((g) => ({
        subject: g.subject,
        p1: g.p1 ?? null,
        p2: g.p2 ?? null,
        p3: g.p3 ?? null,
        p4: g.p4 ?? null,
        score: getAvgScore(g),
      }));
      saveGrades(gradeData);
      setStudentGrades(grades);
      await saveAnalysis(null, gradeData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // saveAnalysis already swallows errors; localStorage always saved
    } finally {
      setSaving(false);
    }
  }, [grades, saveGrades, setStudentGrades, saveAnalysis]);

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

        const GRADE_PROMPT = (
          text,
        ) => `Eres un extractor de notas de boletines escolares colombianos.

BOLETÍN:
"${text.slice(0, 4500)}"

TAREA: Extraer las notas de CADA PERÍODO (P1, P2, P3, P4) por asignatura, exactamente como aparecen.

REGLAS:
- Extrae UNA entrada por asignatura (sin duplicados)
- Si el boletín tiene columnas P1/P2/P3/P4 (o Período 1, Período 2, etc.), extrae cada una por separado
- Si una columna de período no existe o está vacía → usa null para ese período
- Si solo hay una nota sin indicar período, ponla en p1
- El nombre de la asignatura exactamente como aparece en el boletín
- Convierte porcentajes: 100%=5.0, 90%=4.5, 85%=4.25, 80%=4.0, 75%=3.75, 70%=3.5, 60%=3.0
- NO incluyas una columna "DEFINITIVA" o "PROMEDIO FINAL" — eso lo calculamos nosotros

RESPONDE SOLO con este JSON (sin markdown, sin texto adicional):
{
  "grades": [
    {"subject": "NOMBRE EXACTO MATERIA", "p1": 4.2, "p2": 3.8, "p3": null, "p4": null},
    {"subject": "NOMBRE EXACTO MATERIA 2", "p1": 3.5, "p2": 4.0, "p3": null, "p4": null}
  ]
}

Si no encuentras notas: {"grades": []}`;

        if (isPdfFile) {
          // PDFs: extract text locally then parse with AI
          const { parsePDF } = await import("../../utils/documentParser");
          const text = await parsePDF(f);
          if (text) {
            const res = await callDeepseek(
              [{ role: "user", content: GRADE_PROMPT(text) }],
              { temperature: 0.05, maxTokens: 1500, isJson: true },
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
            const res = await callDeepseek(
              [{ role: "user", content: GRADE_PROMPT(text) }],
              { temperature: 0.05, maxTokens: 1500, isJson: true },
            );
            const parsed = typeof res === "string" ? JSON.parse(res) : res;
            extractedGrades = parsed?.grades || [];
          }
        }

        if (extractedGrades.length > 0) {
          // Deduplicate: keep last occurrence per subject (final grade wins over period grades)
          const seen = new Map();
          extractedGrades.forEach((g) => {
            if (g.subject && typeof g.subject === "string") {
              seen.set(g.subject.toUpperCase().trim(), g);
            }
          });
          extractedGrades = [...seen.values()];

          // Extract unique subject names for dynamic subject list
          const subjectNames = extractedGrades
            .map((g) => g.subject)
            .filter((s) => s && typeof s === "string");

          hasUserModified.current = true;
          // Use per-period values extracted by AI; fall back: if only legacy `score`, put in p1
          setGrades(
            extractedGrades.map((g) => ({
              id: uid(),
              subject: g.subject,
              p1:
                g.p1 != null
                  ? Number(g.p1)
                  : g.p2 == null && g.p3 == null && g.p4 == null
                    ? g.score != null
                      ? Number(g.score)
                      : null
                    : null,
              p2: g.p2 != null ? Number(g.p2) : null,
              p3: g.p3 != null ? Number(g.p3) : null,
              p4: g.p4 != null ? Number(g.p4) : null,
            })),
          );
          // Update extracted subjects to populate SUBJECTS dynamically
          if (subjectNames.length > 0) {
            setExtractedSubjectNames(subjectNames);
          }
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

    const getLabel = (g) =>
      SUBJECTS.find((x) => x.v === g.subject)?.l || g.subject;
    const avgScore = (
      grades.reduce((s, g) => s + getAvgScore(g), 0) / grades.length
    ).toFixed(1);
    const failing = grades.filter((g) => getAvgScore(g) < 3.0);
    const toImprove = grades.filter(
      (g) => getAvgScore(g) >= 3.0 && getAvgScore(g) < 4.0,
    );
    const strong = grades.filter((g) => getAvgScore(g) >= 4.0);
    const weakCount = Math.min(failing.length + toImprove.length, 5);
    const planWeeks = Math.min(Math.max(weakCount, 2), 4);

    const fmt = (arr) =>
      arr
        .sort((a, b) => getAvgScore(a) - getAvgScore(b))
        .map((g) => `${getLabel(g)} (${getAvgScore(g).toFixed(1)}/5)`)
        .join(", ") || "ninguna";

    const vakStyle = vakResult?.dominant || "visual";

    const prompt = `Eres Dani, tutora IA de EdutechLife para Colombia.
Estilo de aprendizaje VAK: ${vakStyle}.

CALIFICACIONES (escala 1.0–5.0, aprobatorio ≥ 3.0):
- Promedio: ${avgScore}/5 | Total: ${grades.length} asignaturas
- FUERTES (≥ 4.0): ${fmt(strong)}
- A MEJORAR (3.0–3.9): ${fmt(toImprove)}
- REPROBADAS (< 3.0): ${fmt(failing)}

Genera un JSON con DOS secciones: una para el ESTUDIANTE (corta y motivadora) y otra para los PADRES (completa y detallada).

Responde SOLO con JSON válido (sin markdown):
{
  "overall": "Mensaje CORTO para el estudiante: máx 2 frases, tutéalo, menciona su promedio de forma positiva, sé directo y motivador",
  "motivation": "Frase final poderosa y corta de Dani al estudiante (1 frase, tutéalo)",
  "strengths": ["emoji Materia (nota)", "emoji Materia (nota)"],
  "topActions": ["La acción MÁS urgente para la materia más baja", "Segunda acción clave", "Tercera acción"],
  "weaknesses": [
    {
      "subject": "nombre exacto",
      "score": 2.8,
      "emoji": "emoji materia",
      "why": "razón en 1 frase sencilla (para el estudiante)",
      "vakTip": "consejo práctico estilo ${vakStyle} (1 frase)",
      "steamLink": "conexión con el mundo real (1 frase)",
      "actions": ["acción 1", "acción 2", "acción 3"]
    }
  ],
  "studyPlan": [
    {
      "week": 1,
      "focus": "materia prioritaria",
      "activities": ["actividad 1", "actividad 2", "actividad 3"],
      "daniTip": "consejo de Dani para esa semana"
    }
  ],
  "parentReport": {
    "summary": "Párrafo formal (3-4 frases) para los padres: rendimiento general, fortalezas y áreas críticas. Menciona el promedio ${avgScore}/5 y si hay materias reprobadas.",
    "concerns": ["Preocupación académica concreta 1 si aplica", "Preocupación 2"],
    "recommendations": ["Recomendación a los padres 1 (apoyo en casa)", "Recomendación 2 (hábitos de estudio)", "Recomendación 3"],
    "followUp": "Sugerencia específica de seguimiento para los padres (cuándo revisar, cómo apoyar)"
  }
}

REGLAS:
- overall + motivation: MUY CORTOS, energéticos, para niños 6-16 años
- weaknesses: máx ${weakCount}, de menor a mayor nota
- studyPlan: ${planWeeks} semanas
- parentReport: formal, completo, sin emojis, en tercera persona o dirigido a los padres
- topActions: las 3 acciones más importantes de las materias más bajas`;

    try {
      const res = await callDeepseek([{ role: "user", content: prompt }], {
        temperature: 0.7,
        maxTokens: 2500,
        isJson: true,
      });
      const parsed = typeof res === "string" ? JSON.parse(res) : res;
      setPlan(parsed);
      setStudentGrades(grades);
      addPoints?.(50);
      const gradeData = grades.map((g) => ({
        subject: g.subject,
        p1: g.p1 ?? null,
        p2: g.p2 ?? null,
        p3: g.p3 ?? null,
        p4: g.p4 ?? null,
        score: getAvgScore(g),
      }));
      saveGrades(gradeData);
      saveAnalysis(parsed, gradeData);
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
    saveGrades,
  ]);

  const avg = grades.length
    ? (grades.reduce((s, g) => s + getAvgScore(g), 0) / grades.length).toFixed(
        1,
      )
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

      {/* Period legend */}
      <div className="flex items-center gap-3 px-1 text-xs text-[#94A3B8]">
        <span className="font-semibold text-[#64748B]">Períodos:</span>
        {["P1", "P2", "P3", "P4"].map((p) => (
          <span key={p} className="font-mono font-bold">
            {p}
          </span>
        ))}
        <span className="ml-auto font-semibold">
          Prom = promedio períodos ingresados
        </span>
      </div>

      {/* Manual grade entry */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#004B63]">
            📋 {t("kid.grades.my_notes")}{" "}
            {grades.length > 0 && Number(avg) > 0 && (
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
        {grades.length === 0 && (
          <div className="py-8 text-center space-y-2">
            <span className="text-4xl block">📚</span>
            <p className="text-sm text-[#64748B]">
              Agrega tus materias y escribe la nota de cada período
            </p>
            <button
              onClick={addRow}
              className="mt-2 px-4 py-2 rounded-xl bg-[#4DA8C4] text-white text-sm font-bold shadow-sm hover:bg-[#3d97b3] transition-colors"
            >
              + Agregar primera materia
            </button>
          </div>
        )}
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

      {/* Guardar button */}
      <motion.button
        onClick={handleSave}
        disabled={saving || grades.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-2xl font-black text-white shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
        }}
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            />
            Guardando...
          </span>
        ) : (
          "💾 Guardar calificaciones"
        )}
      </motion.button>

      {/* Save success banner */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-semibold"
          >
            <span>✅</span> Calificaciones guardadas correctamente
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="border border-[#E2E8F0] rounded-2xl overflow-visible">
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
                <div key={h.id} className="px-4 py-3 bg-white space-y-2">
                  <div className="flex items-center justify-between">
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

                  {/* Individual grades from analysis */}
                  {h.grades && h.grades.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 pt-1">
                      {h.grades.map((g, idx) => {
                        const subject = SUBJECTS.find((s) => s.v === g.subject);
                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg text-xs font-semibold text-center"
                            title={`${subject?.l || g.subject}: ${g.score}/5`}
                            style={{
                              backgroundColor: gradeColor(g.score) + "15",
                              color: gradeColor(g.score),
                              border: `1px solid ${gradeColor(g.score)}30`,
                            }}
                          >
                            <span className="text-sm">
                              {subject?.i || getSubjectEmoji(g.subject || "")}
                            </span>
                            <span>{g.score}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {h.plan?.overall && (
                    <p className="text-xs text-[#374151] line-clamp-2 pt-1">
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
            {/* ── SECCIÓN ESTUDIANTE ── */}
            {/* Dani card: corta y motivadora */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#0077B6] text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <span className="font-bold">{t("kid.grades.dani_says")}</span>
                </div>
                <button
                  onClick={() => setPlan(null)}
                  className="text-white/60 hover:text-white text-xs underline"
                >
                  Nuevo análisis
                </button>
              </div>
              <p className="text-sm leading-relaxed">{plan.overall}</p>
              {plan.motivation && (
                <p className="text-sm font-bold text-[#FFD166]">
                  💫 {plan.motivation}
                </p>
              )}
            </div>

            {/* Fortalezas */}
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

            {/* Acciones urgentes (vista estudiante — compacta) */}
            {plan.topActions?.length > 0 && (
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                <p className="font-bold text-orange-700 mb-2">
                  ⚡ Lo que debes hacer YA
                </p>
                <div className="space-y-1.5">
                  {plan.topActions.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-orange-800"
                    >
                      <span className="font-black text-orange-500 mt-0.5">
                        {i + 1}.
                      </span>
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── INFORME COMPLETO (Plan de estudio detallado) ── */}
            <details className="group">
              <summary className="cursor-pointer flex items-center justify-between p-4 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] font-bold text-[#004B63] text-sm select-none">
                <span>📋 Ver plan de estudio completo</span>
                <span className="text-[#64748B] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-2 space-y-3">
                {/* Materias a mejorar con detalle */}
                {plan.weaknesses?.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-bold text-[#004B63] px-1">
                      {t("kid.grades.to_improve")}
                    </p>
                    {plan.weaknesses.map((w, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-white border-2 border-orange-200 shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[#004B63] flex items-center gap-1.5">
                            <span>{w.emoji || getSubjectEmoji(w.subject)}</span>
                            {w.subject}
                          </span>
                          <span
                            className="px-2 py-1 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: gradeColor(w.score) }}
                          >
                            {w.score}/5
                          </span>
                        </div>
                        <p className="text-sm text-[#374151]">{w.why}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
                            <p className="text-xs font-bold text-purple-600 mb-1">
                              👁️ VAK
                            </p>
                            <p className="text-xs text-purple-700">
                              {w.vakTip}
                            </p>
                          </div>
                          <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-100">
                            <p className="text-xs font-bold text-cyan-600 mb-1">
                              🔬 STEAM
                            </p>
                            <p className="text-xs text-cyan-700">
                              {w.steamLink}
                            </p>
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

                {/* Plan semana a semana */}
                {plan.studyPlan?.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-bold text-[#004B63] px-1">
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
              </div>
            </details>

            {/* Aviso: el informe completo para padres está disponible en el dashboard de padres */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-xs text-[#64748B]">
              <span>👨‍👩‍👧</span>
              <span>
                El informe completo para tus padres está disponible en su panel
                de seguimiento.
              </span>
            </div>

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
