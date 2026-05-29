# M3 Gemini Challenge — UX Audit & Improvement Plan

**Date:** 2026-05-29
**Scope:** Module 3 (Gemini), 4 steps
**Rating:** 3.8/10

---

## Executive Summary

Module 3 challenges have functional structure (topic selection, source analysis, fact-checking, report writing) but suffer from critical UX gaps: **no thematic continuity between steps**, **zero formative feedback during the challenge**, and **shared components not used**. The student selects a research topic in Step 1 that disappears in Steps 2-4. There are no validation hints, progress indicators, or examples to guide the student.

---

## Problems Found

### P1 (CRITICAL): No thematic continuity between steps
- Student's research topic selected in Step 1 is not shown in Steps 2-4
- Unlike M2's CaseContextBanner ("Building for: Marketing Agency"), M3 loses context
- **Fix:** Add ResearchContextBanner showing "Investigando: [tema]" across all steps

### P2 (CRITICAL): Zero formative feedback
- No validation during steps, student doesn't know if they're on track
- No progress tracking within steps (e.g., "3 of 5 claims classified")
- **Fix:** Add StepFeedback, intra-step progress, validation indicators, inline tips

### P3 (CRITICAL): Shared components not used
- AutoGrowTextarea exists in `shared/` — not used (fixed rows instead)
- StepFeedback exists in `shared/` — not used
- ExampleToggle exists in `shared/` — not used
- **Fix:** Import and use all existing shared components

### P4 (HIGH): Step 3 (Fact-Checking) lacks verdict overview
- No summary of how many claims are verified / questionable / unverifiable
- Students can't gauge their progress at a glance
- **Fix:** Add VerdictSummaryBar — live stats bar showing verdict distribution

### P5 (HIGH): Textareas with fixed height
- `rows={3}`, `rows={2}`, `rows={5}` in all steps
- On mobile, fixed-height textareas dominate the viewport
- **Fix:** Replace all raw `<textarea>` with `<AutoGrowTextarea>`

### P6 (HIGH): No character count or limits
- Student has no idea how much to write
- No visual feedback on input length
- **Fix:** Add character counter with visual progress ring/bar

### P7 (MEDIUM): No example/reference content
- Students may not know what a good research question looks like
- No model answers to guide them
- **Fix:** Add ExampleToggle per step with contextual examples

### P8 (MEDIUM): Instructional guidance too generic
- Placeholders are functional but don't teach the student
- No callout boxes explaining the methodology
- **Fix:** Add "How to do this step" instructional callout per step

### P9 (LOW): No micro-interactions or animations
- Framer Motion available in project but unused
- Step transitions feel flat
- **Fix:** Add entrance animations, completion celebrations

---

## Proposed Architecture Changes

### Data Flow (Before)
```
Step1: select topic → form state → JSON.stringify({topic, mainQuestion, subQuestions})
Step2: exercise.fuentes → source analysis → JSON.stringify({sources})
Step3: exercise.afirmaciones → claim verdicts → JSON.stringify({claims})
Step4: exercise.informeTemplate → section content → JSON.stringify({sections})
```
No data flows between steps.

### Data Flow (After)
```
Step1: select topic → form state → JSON.stringify({topic, mainQuestion, subQuestions})
        → topic + mainQuestion extracted and passed to Steps 2-4
Step2: ResearchContextBanner reads topic from Step 1 response
        → source evaluation progress tracked
Step3: ResearchContextBanner reads topic from Step 1 response
        → VerdictSummaryBar renders live stats
        → claim classification progress tracked
Step4: ResearchContextBanner reads topic + mainQuestion
        → section completion tracking
        → content preview when collapsed
```

### Components

**New:**
- `ResearchContextBanner.jsx` — Shows "Investigando: [topic]" + current step, shared across all steps
- `VerdictSummaryBar.jsx` — Live visualization of verified / questionable / unverifiable counts

**Existing shared (use, not modify):**
- `AutoGrowTextarea` — Replace all raw textareas
- `StepFeedback` — Per-step completion + hints
- `ExampleToggle` — Contextual examples per field

### Modified Components
- `GeminiStep1.jsx` — AutoGrowTextarea, character counter, validation, instructional callout, ExampleToggle, StepFeedback
- `GeminiStep2.jsx` — ResearchContextBanner, AutoGrowTextarea, source evaluation counter, ExampleToggle, StepFeedback
- `GeminiStep3.jsx` — ResearchContextBanner, VerdictSummaryBar, AutoGrowTextarea, claim progress, ExampleToggle, StepFeedback
- `GeminiStep4.jsx` — ResearchContextBanner, AutoGrowTextarea, character counter per section, collapsible preview, ExampleToggle, StepFeedback
- `IALabEvaluationModal.jsx` — Parse topic from step 1 response, pass to steps 2-4
