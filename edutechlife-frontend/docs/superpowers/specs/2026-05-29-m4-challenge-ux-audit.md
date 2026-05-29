# M4 Challenge UX Audit & Redesign: NotebookLM Simulator

## Rating
**Current: 4/10** → **Target: 9/10**

## Problems Found

| # | Problem | Severity |
|---|---------|----------|
| 1 | 12 textareas total — overload of free writing | Critical |
| 2 | No analysis interactions (rank, match, classify, compare) | Critical |
| 3 | Steps disconnected from each other | High |
| 4 | Evaluation purely length-based | High |
| 5 | No module resource integration (videos, PDFs, OVAs) | Medium |
| 6 | Step 2: 2 generic AI questions with no structure | High |
| 7 | Step 3: Full podcast script from scratch too demanding | High |
| 8 | No ProgressStepper between steps | Medium |
| 9 | No audio/visual previews (ironic for a NotebookLM module) | Medium |
| 10 | Step 1: Only checkbox+textarea, no analytical work | Critical |

## Design: NotebookLM Simulator

### Concept
Each step simulates a real NotebookLM workflow but with guided interactions. Progression: **Select → Organize → Complete**.

---

### Step 1: "Clasifica y Jerarquiza Fuentes"

**Structure:**
1. **Selection (6-8 sources → pick 4)**
2. **Ranking (order by relevance 1-4)** — interactive number buttons or drag
3. **Classification (match each source to a category)** — dropdown or chip selection:
   - "Evidencia científica"
   - "Caso práctico"
   - "Marco teórico"
   - "Dato complementario"
4. **Short insight (1-2 lines per source, ~150 chars max)**

**Interaction types:** Checkbox + ranking + classification dropdown + short text

**Resources for this step:** Video "Primeros Pasos con NotebookLM"

**Evaluation:** Ranking accuracy (40%) + classification correctness (30%) + insight quality (30%)

### Step 2: "Extrae y Compara"

**Structure:**
1. **Quote extraction** — from each selected doc, select/copy 1 key phrase
2. **Comparison table** — 3 rows × 4 columns grid:
   - Rows: "Hallazgo principal", "Implicación práctica", "Limitación"
   - Columns: the 4 selected sources
   - Each cell: short text (80-150 chars)
3. **Synthesis sentence** (1 line, not a paragraph)

**Interaction types:** Copy/paste quote + fill table cells + 1 short text

**Resources for this step:** PDF "Plantillas de Resumen"

**Evaluation:** Quote relevance (30%) + table completeness (40%) + synthesis accuracy (30%)

### Step 3: "Completa el Audio Overview"

**Structure:**
1. **Gap-fill script** — semi-written podcast script with 4 gaps:
   - Hook inicial (1-2 lines)
   - Evidencia clave (2-3 lines)
   - Transición (1 line)
   - Cierre (1-2 lines)
2. **2 MCQ questions** about tone and citation placement
3. **Script preview** with visual "listen" simulation

**Interaction types:** Gap-fill textarea (4 short fields) + 2 multiple choice

**Resources for this step:** Video "Audio Overview" + OVA "Laboratorio: Crea tu Podcast"

**Evaluation:** Gap-fill quality (60%) + MCQ correctness (40%)

---

## Cross-Cutting Changes

| Change | File(s) |
|--------|---------|
| Add ProgressStepper | NotebookStep1/2/3.jsx + shared/ProgressStepper.jsx (exists) |
| Update i18n keys | es.json, en.json |
| Update evaluation logic | useIALabEvaluation.js (MODULE_CONFIG[4].localEvaluate) |
| Update fallbackExercises data structure | useIALabEvaluation.js |
| Add resource pills per step | NotebookStep1/2/3.jsx |
| Premium design (gradients, glassmorphism) | All 3 step files |
| Character count → use ProgressStepper style | All 3 step files |

## Data Model Changes

```js
// Step 1 response
{
  documents: [
    { index: 0, rank: 1, category: "cientifica", insight: "..." },
    { index: 2, rank: 2, category: "practico", insight: "..." },
    { index: 4, rank: 3, category: "teorico", insight: "..." },
    { index: 1, rank: 4, category: "complementario", insight: "..." }
  ]  // length: 4
}

// Step 2 response
{
  quotes: ["...", "...", "...", "..."],  // 1 per document
  table: {
    hallazgo: ["...", "...", "...", "..."],  // 4 sources
    implicacion: ["...", "...", "...", "..."],
    limitacion: ["...", "...", "...", "..."]
  },
  synthesis: "..."
}

// Step 3 response
{
  hooks: ["..."],  // 1 gap
  evidencia: ["..."],  // 1 gap
  transicion: ["..."],  // 1 gap
  cierre: ["..."],  // 1 gap
  quiz: [0, 1]  // indices of correct answers
}
```

## Files to Modify

1. `src/components/IALab/challenges/module4/NotebookStep1.jsx` — rewrite
2. `src/components/IALab/challenges/module4/NotebookStep2.jsx` — rewrite
3. `src/components/IALab/challenges/module4/NotebookStep3.jsx` — rewrite
4. `src/hooks/IALab/useIALabEvaluation.js` — update MODULE_CONFIG[4]
5. `src/i18n/es.json` — update m4 challenge keys
6. `src/i18n/en.json` — update m4 challenge keys
