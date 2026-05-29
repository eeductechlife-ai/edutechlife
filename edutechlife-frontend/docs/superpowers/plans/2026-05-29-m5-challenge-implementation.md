# M5 Challenge (Ética IA) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Redesign M5 challenge from 6/10 to 9/10 with Analista Ético IA concept

**Architecture:** 3 step components + shared ProgressStepper + i18n + evaluation config

**Tech Stack:** React, Framer Motion, Tailwind CSS, AutoGrowTextarea

---

### Task 1: Rewrite EthicsStep1

**Files:**
- Rewrite: `src/components/IALab/challenges/module5/EthicsStep1.jsx`
- Update: `src/i18n/es.json` (add m5 step1 keys)
- Update: `src/i18n/en.json` (add m5 step1 keys)

Features: bias selection + justification per bias (100-150 chars), per-bias pipeline dropdown, severity ranking (1st/2nd), ProgressStepper, resource pills.

### Task 2: Rewrite EthicsStep2

**Files:**
- Rewrite: `src/components/IALab/challenges/module5/EthicsStep2.jsx`
- Update: i18n files

Features: per-group impact (3 × 150 char textareas), root causes with bias connection chips, severity matrix (3 groups × 4 causes), ProgressStepper, resource pills.

### Task 3: Rewrite EthicsStep3

**Files:**
- Rewrite: `src/components/IALab/challenges/module5/EthicsStep3.jsx`
- Update: i18n files

Features: principles + relevance dropdown, per-bias action measures (200 chars each), classification (prevention/mitigation/monitoring), timeline (short/medium/long), ProgressStepper, resource pills.

### Task 4: Update useIALabEvaluation

**Files:**
- Modify: `src/hooks/IALab/useIALabEvaluation.js` (MODULE_CONFIG[5])

Update fallbackExercises data structure and localEvaluate to match new response format.
