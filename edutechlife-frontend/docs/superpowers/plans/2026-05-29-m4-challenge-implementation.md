# M4 Challenge (NotebookLM) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Redesign M4 challenge from 4/10 to 9/10 with NotebookLM Simulator concept

**Architecture:** 3 step components + shared ProgressStepper + i18n + evaluation config

**Tech Stack:** React, Framer Motion, Tailwind CSS, AutoGrowTextarea

---

### Task 1: Update ProgressStepper for custom steps

**Files:**
- Modify: `src/components/IALab/challenges/shared/ProgressStepper.jsx`

Make STEPS accept override via `steps` prop while keeping M2 as default.

### Task 2: Rewrite NotebookStep1

**Files:**
- Rewrite: `src/components/IALab/challenges/module4/NotebookStep1.jsx`
- Update: `src/i18n/es.json` (add m4 step1 keys)
- Update: `src/i18n/en.json` (add m4 step1 keys)

Features: selection (6-8 sources → pick 4), ranking (order 1-4), classification (match to category), short insight (150 chars max), ProgressStepper, resource pills.

### Task 3: Rewrite NotebookStep2

**Files:**
- Rewrite: `src/components/IALab/challenges/module4/NotebookStep2.jsx`
- Update: i18n files

Features: quote extraction, comparison table (3 rows × 4 columns), synthesis sentence (1 line), ProgressStepper, resource pills.

### Task 4: Rewrite NotebookStep3

**Files:**
- Rewrite: `src/components/IALab/challenges/module4/NotebookStep3.jsx`
- Update: i18n files

Features: gap-fill script (4 short fields), 2 MCQ questions, script preview, ProgressStepper, resource pills.

### Task 5: Update useIALabEvaluation

**Files:**
- Modify: `src/hooks/IALab/useIALabEvaluation.js` (MODULE_CONFIG[4])

Update fallbackExercises data structure and localEvaluate to match new response format.
