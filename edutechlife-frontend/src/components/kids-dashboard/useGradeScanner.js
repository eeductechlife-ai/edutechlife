import { useState, useCallback, useRef, useEffect } from "react";
import { callDeepseekSmartboard } from "../../utils/api";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";
import { useStudentGradesPersistence } from "../../hooks/useStudentGradesPersistence";
import {
  sbFetch,
  DEFAULT_SUBJECTS,
  getSubjects,
  getAvgScore,
  uid,
  normalizeGradeStr,
} from "./gradeUtils";

export function useGradeScanner() {
  const {
    studentGrades,
    setStudentGrades,
    setGradeLevel,
    vakResult,
    addPoints,
    setDocumentForDani,
    userId,
  } = useSmartBoardKids();
  const { t } = useTranslation();
  const { grades: persistedGrades, saveGrades } = useStudentGradesPersistence();

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

  const [grades, setGrades] = useState(() => {
    if (persistedGrades?.length) return persistedGrades;
    if (studentGrades?.length) return studentGrades;
    return [];
  });
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [scanMode, setScanMode] = useState("manual");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const fileRef = useRef(null);
  const initializedFromHistory = useRef(false);
  const hasUserModified = useRef(false);
  const startedWithDefaults = useRef(!studentGrades.length);
  const isPdf =
    imgFile?.type === "application/pdf" ||
    imgFile?.name?.toLowerCase().endsWith(".pdf");

  const GRADES_LS_KEY = userId ? `edutechlife_grades_${userId}` : null;

  const persistLocalGrades = useCallback(
    (gradeData) => {
      if (GRADES_LS_KEY) {
        localStorage.setItem(GRADES_LS_KEY, JSON.stringify(gradeData));
      }
    },
    [GRADES_LS_KEY],
  );

  const loadHistory = useCallback(async () => {
    if (!userId) return;
    if (GRADES_LS_KEY) {
      try {
        const stored = localStorage.getItem(GRADES_LS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (
            parsed?.length &&
            !initializedFromHistory.current &&
            startedWithDefaults.current
          ) {
            initializedFromHistory.current = true;
            const restored = parsed.map((g) => ({ id: uid(), ...g }));
            setGrades(restored);
            const names = [
              ...new Set(restored.map((g) => g.subject).filter(Boolean)),
            ];
            if (names.length) setExtractedSubjectNames(names);
          }
        }
      } catch {}
    }
    const token = sessionStorage.getItem("auth_token");
    if (!token) return;
    try {
      const data = await sbFetch(
        `grade_analyses?student_user_id=eq.${userId}&select=id,grades,avg_score,plan,created_at&order=created_at.desc&limit=5`,
      );
      if (Array.isArray(data) && data.length) {
        setHistory(data);
        const latest = data[0];
        if (
          !initializedFromHistory.current &&
          startedWithDefaults.current &&
          latest.grades?.length > 0
        ) {
          initializedFromHistory.current = true;
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
          persistLocalGrades(
            latestGrades.map((g) => ({
              subject: g.subject,
              p1: g.p1,
              p2: g.p2,
              p3: g.p3,
              p4: g.p4,
              score: getAvgScore(g),
            })),
          );
          const names = [
            ...new Set(latestGrades.map((g) => g.subject).filter(Boolean)),
          ];
          if (names.length) setExtractedSubjectNames(names);
        }
      }
    } catch {}
  }, [userId, GRADES_LS_KEY, persistLocalGrades]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (persistedGrades?.length && !hasUserModified.current && !grades.length) {
      const restored = persistedGrades.map((g) =>
        g.id ? g : { id: uid(), ...g },
      );
      setGrades(restored);
      const names = [
        ...new Set(restored.map((r) => r.subject).filter(Boolean)),
      ];
      if (names.length) setExtractedSubjectNames(names);
    }
  }, [persistedGrades]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (grades?.length) setStudentGrades(grades);
  }, [grades, setStudentGrades]);

  useEffect(() => {
    return () => {
      if (imgPreview) URL.revokeObjectURL(imgPreview);
    };
  }, [imgPreview]);

  const saveAnalysis = useCallback(
    async (planData, gradeData) => {
      if (!userId) return;
      const avg = gradeData.length
        ? gradeData.reduce((s, g) => s + g.score, 0) / gradeData.length
        : 0;
      try {
        await sbFetch("grade_analyses", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            student_user_id: userId,
            grades: gradeData,
            plan: planData,
            avg_score: parseFloat(avg.toFixed(1)),
            vak_style: vakResult?.dominant || null,
          }),
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
      persistLocalGrades(gradeData);
      saveGrades(gradeData);
      setStudentGrades(grades);
      await saveAnalysis(null, gradeData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
    } finally {
      setSaving(false);
    }
  }, [grades, saveGrades, setStudentGrades, saveAnalysis, persistLocalGrades]);

  const GRADE_PROMPT = (
    text,
  ) => `Eres un extractor de notas de boletines escolares colombianos.

BOLETÍN:
"${text.slice(0, 4500)}"

TAREA: Extraer las notas de CADA PERÍODO (P1, P2, P3, P4) por asignatura y el grado escolar del estudiante.

REGLAS:
- Extrae UNA entrada por asignatura (sin duplicados)
- Si el boletín tiene columnas P1/P2/P3/P4 (o Período 1, Período 2, etc.), extrae cada una por separado
- Si una columna de período no existe o está vacía → usa null para ese período
- Si solo hay una nota sin indicar período, ponla en p1
- El nombre de la asignatura exactamente como aparece en el boletín
- Convierte porcentajes: 100%=5.0, 90%=4.5, 85%=4.25, 80%=4.0, 75%=3.75, 70%=3.5, 60%=3.0
- NO incluyas una columna "DEFINITIVA" o "PROMEDIO FINAL"
- grade_level: busca el grado en el encabezado del boletín. Si no aparece, usa null

RESPONDE SOLO con este JSON (sin markdown, sin texto adicional):
{"grade_level":"SÉPTIMO","grades":[{"subject":"NOMBRE EXACTO","p1":4.2,"p2":3.8,"p3":null,"p4":null}]}

Si no encuentras notas: {"grade_level":null,"grades":[]}`;

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
        let detectedGradeLevel = null;
        if (isPdfFile) {
          const { parsePDF } = await import("../../utils/documentParser");
          const text = await parsePDF(f);
          if (text) {
            const res = await callDeepseekSmartboard(
              [{ role: "user", content: GRADE_PROMPT(text) }],
              { temperature: 0.05, maxTokens: 1500, isJson: true },
            );
            const parsed = typeof res === "string" ? JSON.parse(res) : res;
            extractedGrades = parsed?.grades || [];
            detectedGradeLevel = parsed?.grade_level ?? null;
          }
        } else {
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
            const res = await callDeepseekSmartboard(
              [{ role: "user", content: GRADE_PROMPT(text) }],
              { temperature: 0.05, maxTokens: 1500, isJson: true },
            );
            const parsed = typeof res === "string" ? JSON.parse(res) : res;
            extractedGrades = parsed?.grades || [];
            detectedGradeLevel = parsed?.grade_level ?? null;
          }
        }
        if (detectedGradeLevel) {
          const gradeNum = normalizeGradeStr(detectedGradeLevel);
          if (gradeNum) setGradeLevel?.(gradeNum);
        }
        if (extractedGrades.length > 0) {
          const seen = new Map();
          extractedGrades.forEach((g) => {
            if (g.subject && typeof g.subject === "string")
              seen.set(g.subject.toUpperCase().trim(), g);
          });
          extractedGrades = [...seen.values()];
          const subjectNames = extractedGrades
            .map((g) => g.subject)
            .filter((s) => s && typeof s === "string");
          hasUserModified.current = true;
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
          if (subjectNames.length > 0) setExtractedSubjectNames(subjectNames);
          setScanMode("manual");
          setError("");
        } else {
          setScanMode("manual");
          setError(t("kid.grades.error_no_grades"));
        }
      } catch (e) {
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
    [t, setGradeLevel],
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

Responde SOLO con JSON válido (sin markdown):
{"overall":"Mensaje CORTO al estudiante: máx 2 frases, tutéalo, motivador","motivation":"Frase final de Dani al estudiante (1 frase)","strengths":["emoji Materia (nota)"],"topActions":["Acción urgente 1","Acción 2","Acción 3"],"weaknesses":[{"subject":"nombre","score":2.8,"emoji":"emoji","why":"razón en 1 frase","vakTip":"consejo ${vakStyle} (1 frase)","steamLink":"conexión mundo real (1 frase)","actions":["acción 1","acción 2","acción 3"]}],"studyPlan":[{"week":1,"focus":"materia","activities":["actividad 1","actividad 2","actividad 3"],"daniTip":"consejo de Dani"}],"parentReport":{"summary":"Párrafo formal 3-4 frases para los padres. Promedio ${avgScore}/5.","concerns":["Preocupación 1"],"recommendations":["Recomendación 1","Recomendación 2","Recomendación 3"],"followUp":"Sugerencia de seguimiento"}}

REGLAS: overall+motivation MUY CORTOS para niños 6-16; weaknesses máx ${weakCount}; studyPlan ${planWeeks} semanas; parentReport formal sin emojis.`;
    try {
      const res = await callDeepseekSmartboard(
        [{ role: "user", content: prompt }],
        {
          temperature: 0.7,
          maxTokens: 2500,
          isJson: true,
        },
      );
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
      persistLocalGrades(gradeData);
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
    persistLocalGrades,
  ]);

  const avg = grades.length
    ? (grades.reduce((s, g) => s + getAvgScore(g), 0) / grades.length).toFixed(
        1,
      )
    : 0;

  const gradeMap = grades.reduce((acc, g) => {
    const score = getAvgScore(g);
    if (score > 0) acc[g.subject] = score;
    return acc;
  }, {});

  return {
    SUBJECTS,
    grades,
    scanning,
    saving,
    saveSuccess,
    plan,
    setPlan,
    error,
    scanMode,
    setScanMode,
    imgFile,
    setImgFile,
    imgPreview,
    setImgPreview,
    extracting,
    history,
    showHistory,
    setShowHistory,
    fileRef,
    isPdf,
    avg,
    gradeMap,
    addRow,
    updateGrade,
    removeGrade,
    handleSave,
    handleImageFile,
    analyze,
    setDocumentForDani,
  };
}
