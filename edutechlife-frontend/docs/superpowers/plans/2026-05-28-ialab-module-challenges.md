# IALab Module Challenges Implementation Plan

> **Goal:** Replace generic challenge with unique per-module challenges (ChatGPT, Gemini, NotebookLM, Ethics) with Valerio narration and bilingual support.

> **Architecture:** Config-driven `useIALabEvaluation(moduleId, locale)` mapping each module to its own DeepSeek generators/evaluators/fallbacks. Modal routes steps dynamically. New `ValerioChallengeIntro` as shared step 0.

> **Tech Stack:** React + DeepSeek API + VoiceReader + Tailwind + i18n

---

### Task 1: Module Evaluation Config System

**Files:**
- Modify: `src/hooks/IALab/useIALabEvaluation.js`

- [ ] Add MODULE_EVALUATION_CONFIG with per-module generators, evaluators, fallbacks
- [ ] Change hook signature to `(moduleId = 1, locale = 'es')`
- [ ] Define DeepSeek prompts for M2-M5 generation
- [ ] Define DeepSeek prompts for M2-M5 evaluation
- [ ] Define bilingual fallback exercises for M2-M5

### Task 2: ValerioChallengeIntro Component

**Files:**
- Create: `src/components/IALab/challenges/challengeIntro/ValerioChallengeIntro.jsx`

- [ ] Create component with Valerio avatar + VoiceReader + bilingual intro texts + Start button

### Task 3: IALabEvaluationModal - Module Routing

**Files:**
- Modify: `src/components/IALab/IALabEvaluationModal.jsx`
- Modify: `src/components/IALab/IALabEvaluationModalPremium.jsx`

- [ ] Accept moduleId, render VCI as step 0, route steps by (moduleId, stepIndex)
- [ ] Adjust progress indicator per module

### Task 4: M2 ChatGPT Steps

**Files:**
- Create: `src/components/IALab/challenges/module2/ChatGPTStep1.jsx`
- Create: `src/components/IALab/challenges/module2/ChatGPTStep2.jsx`
- Create: `src/components/IALab/challenges/module2/ChatGPTStep3.jsx`

- [ ] Step 1: Analyze use case (MCQ + justification textarea)
- [ ] Step 2: Design GPT config (instructions + knowledge + capabilities)
- [ ] Step 3: Configure function calling (schema editor)

### Task 5: M3 Gemini Steps

**Files:**
- Create: `src/components/IALab/challenges/module3/GeminiStep1.jsx`
- Create: `src/components/IALab/challenges/module3/GeminiStep2.jsx`
- Create: `src/components/IALab/challenges/module3/GeminiStep3.jsx`
- Create: `src/components/IALab/challenges/module3/GeminiStep4.jsx`

- [ ] Step 1: Research question (topic selection + sub-questions)
- [ ] Step 2: Multimodal sources (gallery + key data extraction)
- [ ] Step 3: Fact-checking (claim categorization + reasoning)
- [ ] Step 4: Professional report (structured editor)

### Task 6: M4 NotebookLM Steps

**Files:**
- Create: `src/components/IALab/challenges/module4/NotebookStep1.jsx`
- Create: `src/components/IALab/challenges/module4/NotebookStep2.jsx`
- Create: `src/components/IALab/challenges/module4/NotebookStep3.jsx`

- [ ] Step 1: Curate sources (document selection + insight extraction)
- [ ] Step 2: Synthesize documents (connection map + synthesis paragraph)
- [ ] Step 3: Audio script (structured podcast script template)

### Task 7: M5 Ethics Steps

**Files:**
- Create: `src/components/IALab/challenges/module5/EthicsStep1.jsx`
- Create: `src/components/IALab/challenges/module5/EthicsStep2.jsx`
- Create: `src/components/IALab/challenges/module5/EthicsStep3.jsx`

- [ ] Step 1: Identify biases (case study + bias type MCQ + pipeline stage)
- [ ] Step 2: Impact analysis (impact textarea + root cause checkboxes)
- [ ] Step 3: Ethical protocol (principles + prevention + mitigation + monitoring)

### Task 8: i18n Keys

**Files:**
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/es.json`

- [ ] Add M2 challenge keys (~25 keys)
- [ ] Add M3 challenge keys (~30 keys)
- [ ] Add M4 challenge keys (~25 keys)
- [ ] Add M5 challenge keys (~25 keys)
- [ ] Add Valerio intro keys (~8 keys)

### Task 9: ModuleOverviewCard Integration

**Files:**
- Modify: `src/components/IALab/ModuleOverviewCard.jsx`

- [ ] Ensure moduleId is passed correctly to challenge modal
- [ ] Verify per-module challenge status tracking
