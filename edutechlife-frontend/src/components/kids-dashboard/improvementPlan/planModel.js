// One plan shape for the whole dashboard ("Mi Plan"), whether it comes from
// the 4-week generator or from the grade analysis in Notas. Everything the AI
// sends goes through here, so a half-answered response can never crash the
// view with `undefined.map`.

const str = (v) => (typeof v === "string" ? v.trim() : "");
const list = (v) => (Array.isArray(v) ? v : []);

const TIPOS = ["visual", "auditivo", "kinestesico", "lectura"];

function normalizeActivity(a) {
  if (typeof a === "string")
    return a.trim() ? { titulo: a.trim(), done: false } : null;
  const titulo = str(a?.titulo || a?.title || a?.nombre);
  if (!titulo) return null;
  const tipo = str(a.tipo).toLowerCase();
  return {
    titulo,
    duracion: str(a.duracion || a.duration),
    tipo: TIPOS.includes(tipo) ? tipo : "",
    done: a.done === true,
  };
}

/** Validates any plan-like object; null when there is nothing to show. */
export function normalizePlan(raw) {
  const weeks = list(raw?.weeks)
    .map((w, i) => ({
      week: Number(w?.week) || i + 1,
      title: str(w?.title),
      focus: str(w?.focus),
      danTip: str(w?.danTip || w?.daniTip),
      activities: list(w?.activities)
        .map(normalizeActivity)
        .filter(Boolean)
        .slice(0, 5),
    }))
    .filter((w) => w.activities.length)
    .slice(0, 6)
    .map((w, i) => ({ ...w, week: i + 1 }));
  if (!weeks.length) return null;
  return {
    weeks,
    topActions: list(raw?.topActions).map(str).filter(Boolean).slice(0, 3),
    weakSubjects: list(raw?.weakSubjects).map(str).filter(Boolean).slice(0, 3),
    source: raw?.source === "notas" ? "notas" : "plan",
    generatedAt: Number(raw?.generatedAt) || Date.now(),
  };
}

/** The grade analysis (Notas → "Analizar") already proposes weeks: turn them
 *  into a trackable "Mi Plan" so the kid gets one plan, not two. */
export function planFromAnalysis(analysis) {
  return normalizePlan({
    weeks: list(analysis?.studyPlan).map((w) => ({
      week: w?.week,
      title: str(w?.focus) ? `Enfócate en ${str(w.focus)}` : "",
      focus: w?.focus,
      danTip: w?.daniTip,
      activities: w?.activities,
    })),
    topActions: analysis?.topActions,
    weakSubjects: list(analysis?.weaknesses).map((w) => w?.subject),
    source: "notas",
  });
}
