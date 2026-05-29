# M2 ChatGPT Challenge — UX Audit & Improvement Plan

**Date:** 2026-05-29
**Scope:** Module 2 (ChatGPT Without Limits), 3 steps
**Rating:** 6.1/10

---

## Executive Summary

The Module 2 challenge has solid foundations (AI-generated exercises, visual design, i18n, auto-save, security) but suffers from a critical architectural flaw: **the user's choices in Step 1 have no visible effect on Steps 2-3**. The knowledge files, capabilities, and function parameters are hardcoded and identical regardless of which business case the user selected. Additionally, there is zero formative feedback during the challenge — the user receives no guidance until the final submission.

---

## Problems Found

### P1 (CRITICAL): Step 1 choice disconnected from Steps 2-3
- User selects marketing / support / dev in Step 1
- Step 2 knowledge files and capabilities are the same for all cases
- Step 3 function spec context is AI-generated but doesn't reference the user's choice
- **Fix:** Pass selected case to Steps 2-3, adapt labels/examples/knowledge files dynamically

### P2 (HIGH): No formative feedback during steps
- User doesn't know if they're on the right track until final submission
- Character counter is the only real-time feedback
- **Fix:** Add per-step validation hints, step completion celebration, inline tips

### P3 (HIGH): Step 3 (Function Calling) too abstract
- No JSON schema preview of what the user built
- No example of what a correct function definition looks like
- **Fix:** Add live JSON preview panel, "Show Example" toggle, structure validation

### P4 (MEDIUM): Accessiblity gaps
- Toggle switches lack ARIA roles/attributes
- No `prefers-reduced-motion` support
- Color-only indicators in some places
- **Fix:** Add proper ARIA attributes, reduced-motion media query

### P5 (MEDIUM): Tips are static/generic
- Same tips regardless of case selection
- **Fix:** Dynamic tips based on selected case

### P6 (LOW): No visual continuity banner
- User may forget which case they chose between steps
- **Fix:** Show "pill" badge in Step 2-3 headers: "Building for: Marketing Agency"

### P7 (LOW): Mobile textarea overwhelm
- Large textareas (h-32 to h-48) dominate mobile view
- **Fix:** Auto-grow textareas, cap at reasonable height

---

## Proposed Architecture Changes

### Data Flow (Before)
```
Step1: select case → JSON.stringify({selectedCase, bestCandidate, justification})
Step2: reads exercise.gptConfig (AI-generated, generic)
       → knowledge/capabilities are STATIC arrays
Step3: reads exercise.functionCallSpec (AI-generated, generic)
       → param editor is generic
```

### Data Flow (After)
```
Step1: select case → JSON.stringify({selectedCase, bestCandidate, justification})
       → selectedCase stored in hook state
Step2: KNOWLEDGE_FILES and CAPABILITIES filtered/adapted by selectedCase
       → gptConfig text personalized: "Based on your marketing case..."
       → Dynamic tips for marketing vs dev vs support
Step3: functionCallSpec personalized: "For your support CRM integration..."
       → Live JSON preview panel
       → Dynamic parameter presets per case type
```

### New Components
- `CaseContextBanner.jsx` — shows "Building for: Marketing Agency" pill across steps
- `JsonPreviewPanel.jsx` — live JSON schema preview for Step 3
- `StepFeedback.jsx` — per-step completion celebration + hints
- `ExampleToggle.jsx` — "Show me an example" toggle per field

### Modified Components
- `ChatGPTStep1.jsx` — pass selectedCase up, add validation indicators
- `ChatGPTStep2.jsx` — dynamic knowledge/capabilities, case-adaptive tips
- `ChatGPTStep3.jsx` — live JSON preview, validation, examples
- `IALabEvaluationModal.jsx` — pass selectedCase through steps
- `useIALabEvaluation.js` — store selectedCase in state, pass to evaluator
