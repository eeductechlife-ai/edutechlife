# OVA Content Quality Improvement Plan

**Date:** 2026-07-26  
**Goal:** Execute 8 approved improvements across all 10 IALab OVA modules without altering existing functionality  
**Method:** All changes additive — new data fields, new render branches, new components  

---

## Overview of 8 Improvements

| # | Improvement | Impact | Complexity | Files Changed |
|---|-------------|--------|------------|---------------|
| 1 | Learning Objectives | All 10 OVAs benefit | Low | 20 data files + OVAIntro.jsx + 13 wrappers |
| 2 | Further Reading Links | All 10 OVAs benefit | Low | 20 data files + render in notebooks |
| 3 | Module Context Map | OVANotebookBase OVAs (4) | Medium | OVANotebookBase.jsx + 10 data files |
| 4 | Extra Quiz Questions | 4 OVAs need more | Medium | 4 data file pairs + QuizScreen.jsx |
| 5 | Pricing Section | 2 OVAs | Medium | 4 data files + component render |
| 6 | Integration Exercise | New end-of-module component | High | NEW component + ResourceViewerModal |
| 7 | Fix Redundancy | notebookLab + notebookSim | Low | 4 data files (subtitles) |
| 8 | Fix English Translations | ~15 visible keys | Low | en.json |

---

## File-by-File Implementation

### 1. Learning Objectives — Add `learningObjectives[]` + render in OVAIntro

**Data layer:** Each OVA `.es.js`/`.en.js` gets `learningObjectives: [3-4 strings]`

Files to modify (20 data files):
- `src/data/ova/biasLab.es.jsx` + `biasLab.en.jsx`
- `src/data/ova/riskSim.es.js` + `riskSim.en.js`
- `src/data/ova/chatGPTTools.es.js` + `chatGPTTools.en.js`
- `src/data/ova/ethicalDilemmas.es.js` + `ethicalDilemmas.en.js`
- `src/data/ova/practicalCases.es.js` + `practicalCases.en.js`
- `src/data/ova/ecosystemGuide.es.js` + `ecosystemGuide.en.js`
- `src/data/ova/notebookLab.es.js` + `notebookLab.en.js`
- `src/data/ova/notebookSim.es.js` + `notebookSim.en.js`
- `src/data/ova/podcastGuide.es.jsx` + `podcastGuide.en.jsx`
- `src/data/ova/podcastStudio.es.js` + `podcastStudio.en.js`

**Locale selector .js files** — each needs to re-export the new `learningObjectives` field:
- `src/data/ova/riskSim.js` — add to destructured exports
- `src/data/ova/chatGPTTools.js` — add to destructured exports
- (biasLab doesn't need — it reads from contentData directly)
- (notebookLab, notebookSim, practicalCases, ethicalDilemmas, ecosystemGuide, podcastGuide, podcastStudio — check if they need it)

**Component layer:**
- `src/components/IALab/shared/OVAIntro.jsx` — add optional `objectives` prop (array of strings), render as animated list between description and start button
- **All OVA components that use OVAIntro** — pass `learningObjectives` as prop:
  - `OVANotebookBase.jsx` (used by notebookLab, notebookSim, podcastGuide, podcastStudio)
  - `OVARiskSimulator.jsx` (pass from imported `gameData` companion)
  - `OVAChatGPTTools.jsx` (pass from `tools` companion)
  - `OVAEthicalDilemmas.jsx` (pass from dilemmas companion)
  - `OVAPracticalCases.jsx` (pass from challenges companion)
  - `OVAEcosystemGuide.jsx` (pass from infographicData companion)
  - `OVABiasLab.jsx` (read from contentData)
  - `OvaEdutechlife.jsx` (hardcoded or from i18n)
  - `OVABuildGPT/index.jsx` (hardcoded or from i18n)

### 2. Further Reading — Add `furtherReading[]` + render

**Data layer:** Same 20 files. Add `furtherReading: [{title, url}, ...]` (2-3 links each)

**Render:** Inside OVANotebookBase: add a `furtherReading` section after results screen (before footer). For other OVAs: add as collapsible section at bottom of content area.

### 3. Module Context Map — OVANotebookBase.jsx

**Data:** Add `moduleContext: {position, total, family}` to each OVA's locale selector .js

**Render:** In OVANotebookBase's intro screen (in OVAIntro or just before start button), show a horizontal stepper with 3+ dots representing the module's position in the curriculum. Current module highlighted, others dimmed.

### 4. Extra Quiz Questions

| OVA | Current | Target | Files |
|-----|---------|--------|-------|
| chatGPTTools | 5 | 7 | chatGPTTools.es.js + .en.js |
| riskSim (gameData) | 3 | 5 | riskSim.es.js + .en.js |
| OvaEdutechlife (ovaData.js) | 3 | 5 | components/IALab/ova/ovaData.js |
| OVABuildGPT (QuizScreen) | 4 | 6 | components/IALab/OVABuildGPT/screens/QuizScreen.jsx |

New content for each in the plan notes above (see full content in consideration).

### 5. Pricing Section

**ecosystemGuide.es.js:** Add `pricingSection: { free: {title, features[]}, plus: {title, features[]} }`

**notebookLab.es.js:** Same, comparing NotebookLM Free vs Plus

Render as 2-column card comparison card using existing `GLASS_CARD` styles.

### 6. Integration Exercise

**New file:** `src/components/IALab/shared/IntegrationExercise.jsx`
- Receives `scenario` and `reflectionQuestions` as props
- Renders a card with the scenario + 3 reflection prompts (text area)
- No scoring, purely reflective
- "Marcar como completado" button

**Modified:**
- `src/components/IALab/ResourceViewerModal/index.jsx` — after autoComplete fires, show a "Ejercicio de Integración" button that opens IntegrationExercise as an overlay

**Data:** Add `integrationExercise: {scenario, questions[]}` to .es.js/.en.js data files

### 7. Fix Redundancy — Lab vs Sim

**notebookLab.es.js** screen 0 subtitle change:
```
"Comprender qué es NotebookLM, cómo funciona y por qué es revolucionario"
→ "Exploración guiada de NotebookLM: crea tu primer cuaderno con documentos propios"
```

**notebookSim.es.js** screen 0 subtitle change:
```
"Calidad sobre cantidad en tu investigación"
→ "Simulación práctica de curación de fuentes y análisis documental con IA"
```

### 8. Fix English Translations

Search en.json for ~15 most visible OVA-related keys with Spanish text or grammar errors. Fix in place.

---

## Implementation Order

| Step | Change | Est. Files | Est. Time |
|------|--------|------------|-----------|
| 7 | Fix Redundancy (subtitle edits) | 4 | 5 min |
| 1 | Learning Objectives (data + OVAIntro) | 22 | 30 min |
| 2 | Further Reading (data + render) | 22 | 20 min |
| 4 | Extra Quiz (data + QuizScreen) | 6 | 15 min |
| 3 | Module Context Map (OVANotebookBase) | 12 | 20 min |
| 5 | Pricing Section (2 OVAs) | 5 | 15 min |
| 6 | Integration Exercise (new component) | 13 | 25 min |
| 8 | Fix English Translations | 1 | 10 min |

Total: ~85 files changed, ~2.5 hours

---

## Build Verification

After EACH step:
```bash
npx vite build --logLevel error
```

If build fails, fix immediately before proceeding. No exceptions.

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| OVAIntro optional prop breaks nothing | Low | New prop is optional, defaults to [] |
| English .en.js files out of sync | Low | Edit both simultaneously in same task |
| .js locale selector misses re-export | Low | Verify imports after each addition |
| JSX in .js files fails build | Low | Only .jsx files contain JSX |
