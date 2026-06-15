# Valerio Improvements Implementation Plan

**Goal:** Upgrade Valerio with smart fallback, session memory, and knowledge expansion — without emotional detection, focused purely on course knowledge and helping students.

**Architecture:** 3 new files (fallback hook, memory service, Q&A bank) + modifications to valerioPrompts.js and panel index.jsx. All additive except prompt refinements.

**Tech Stack:** React hooks, localStorage, DeepSeek API

---

### Task 1: Knowledge Base (Q&A)

**Files:**
- Create: `src/data/valerioKnowledgeBase.js`

- [ ] Create Q&A bank with 15-20 general AI concept entries structured by keywords.

### Task 2: Smart Fallback

**Files:**
- Create: `src/hooks/IALab/useValerioFallback.js`

- [ ] Create fallback content by module + smartFallback() function (no emotional detection).

### Task 3: Session Memory

**Files:**
- Create: `src/services/valerioMemory.js`

- [ ] Create session manager with finalizeSession + injectSessionContext.

### Task 4: Update System Prompt

**Files:**
- Modify: `src/components/IALab/IALabValerioPanel/valerioPrompts.js`

- [ ] Remove emotional detection from system prompt
- [ ] Integrate Q&A bank into knowledge pipeline
- [ ] Add 5-paragraph limit for advanced level

### Task 5: Integrate in Panel

**Files:**
- Modify: `src/components/IALab/IALabValerioPanel/index.jsx`

- [ ] Add retry logic (10s → 8s → fallback)
- [ ] Add session memory lifecycle (finalize on close)
- [ ] Integrate fallback + knowledge base pipeline
