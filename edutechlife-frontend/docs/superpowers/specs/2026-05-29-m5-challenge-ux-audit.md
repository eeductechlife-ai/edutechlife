# M5 Challenge UX Audit & Redesign: Analista Ético IA

## Rating
**Current: 6/10** → **Target: 9/10**

## Problems Found

| # | Problem | Severity |
|---|---------|----------|
| 1 | Step 1: bias selection without justification (no analysis, only selection) | Critical |
| 2 | Steps disconnected — data doesn't flow between them | Critical |
| 3 | Step 2: 1 textarea for all affected groups (no per-group analysis) | High |
| 4 | Step 3: 1500 chars of protocol writing, disconnected from biases found | Critical |
| 5 | Evaluation purely length-based | High |
| 6 | No module resource integration (videos, PDFs, OVAs) | Medium |
| 7 | No ProgressStepper between steps | Medium |
| 8 | Pipeline stage selection is global, not per-bias | Medium |
| 9 | No severity/priority ranking of biases found | Medium |
| 10 | No connection between causes and biases in Step 2 | High |

## Design: Analista Ético IA

### Concept
The student acts as an **AI Ethics Analyst** investigating a real bias case. Progression: **Investigate → Assess → Remediate**. Data flows between steps — biases found in Step 1 are referenced in Step 2 and Step 3.

---

### Step 1: "Fase Forense — Identifica y Justifica"

**Structure:**
1. **Case study** (same as current)
2. **Bias selection** (4 toggles) + per-bias:
   - **Justification text** (100-150 chars): "What evidence in the case indicates this bias?"
   - **Pipeline stage** (per-bias dropdown, not global): data / training / deployment / monitoring
3. **Severity ranking**: mark the 2 most severe biases (rank 1 and 2)

**Interaction types:** Toggle + textarea per bias (max 4 × 150 = 600 chars) + per-bias dropdown + ranking

**Resources for this step:** Video "Sesgos en IA: Explicación y Ejemplos"

**Data model:**
```js
{
  biases: [
    { index: 0, justification: "...", pipeline: "data", severity: 1 },
    { index: 2, justification: "...", pipeline: "training", severity: 2 }
  ] // selected biases only, len 1-4
}
```

### Step 2: "Evaluación de Impacto"

**Structure:**
1. **Per-group impact** (3 small textareas, 150 chars each):
   - Candidates: specific consequences
   - Company: risks and liability
   - Society: broader implications
2. **Root causes** (expandable cards, same as current) but enhanced:
   - Shows pre-filled **case evidence** quote for each cause
   - Student **connects each cause to biases** from Step 1 (multi-select chips of bias names)
3. **Severity matrix** (3 groups × 4 causes, click Low/Med/High per cell)

**Interaction types:** 3 small textareas (450 chars total) + chip select for bias connection + 12-cell matrix

**Resources for this step:** PDF "Manual de Privacidad en IA", OVA "Simulador: Evaluación de Riesgos"

**Data model:**
```js
{
  impact: {
    candidates: "...",
    company: "...",
    society: "..."
  },
  rootCauses: {
    technical: { justification: "...", biasIndexes: [0, 2] },
    data: { justification: "...", biasIndexes: [2] },
    human: { justification: "...", biasIndexes: [0] },
    process: { justification: "...", biasIndexes: [] }
  },
  severityMatrix: {
    "candidates-technical": "high",
    "candidates-data": "medium",
    // ... 12 cells total
  }
}
```

### Step 3: "Plan de Remediación"

**Structure:**
1. **Principles** (4 toggles) + per-principle:
   - Relevance dropdown: "Why does this principle apply to this case?" (3-4 options like "Protege a candidatos", "Garantiza equidad del sistema", etc.)
2. **Actions per bias** — for each bias identified in Step 1:
   - Propose 1 specific measure (200 chars) that addresses that exact bias
   - Classify as Prevention / Mitigation / Monitoring (dropdown)
3. **Timeline**: assign each measure to Short-term / Medium-term / Long-term

**Interaction types:** 4 toggles + 4 relevance picks + 4 small textareas (800 chars total) + 4 classifications + 4 timeline picks

**Resources for this step:** OVA "Laboratorio: Dilemas Éticos", PDF "Código de Ética para Uso de IA"

**Data model:**
```js
{
  principles: [
    { id: "transparency", relevance: "protege_candidatos" },
    { id: "privacy", relevance: "garantiza_equidad" }
  ],
  actions: [
    { biasIndex: 0, measure: "...", type: "prevention", timeline: "short" },
    { biasIndex: 2, measure: "...", type: "mitigation", timeline: "medium" }
  ] // 1 per bias found in Step 1
}
```

## Cross-Cutting Changes

| Change | File(s) |
|--------|---------|
| Add ProgressStepper | EthicsStep1/2/3.jsx + shared/ProgressStepper.jsx (exists) |
| Update i18n keys | es.json, en.json |
| Update evaluation logic | useIALabEvaluation.js (MODULE_CONFIG[5].localEvaluate) |
| Update fallbackExercises data structure | useIALabEvaluation.js |
| Add resource pills per step | EthicsStep1/2/3.jsx |
| Premium design (gradients, glassmorphism) | All 3 step files |

## Files to Modify

1. `src/components/IALab/challenges/module5/EthicsStep1.jsx` — rewrite
2. `src/components/IALab/challenges/module5/EthicsStep2.jsx` — rewrite
3. `src/components/IALab/challenges/module5/EthicsStep3.jsx` — rewrite
4. `src/hooks/IALab/useIALabEvaluation.js` — update MODULE_CONFIG[5]
5. `src/i18n/es.json` — update m5 challenge keys
6. `src/i18n/en.json` — update m5 challenge keys
