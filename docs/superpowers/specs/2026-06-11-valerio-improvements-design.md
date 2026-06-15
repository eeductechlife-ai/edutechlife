# Valerio Improvements — Smart Fallback + Memory + Knowledge Expansion

## Scope
Address Valerio's 3 highest-impact limitations without modifying existing functionality.

---

## Área 1 — Smart Fallback System

### Problem
`generateFallbackResponse()` in `valerioPrompts.js` produces generic, module-unaware responses. 10s timeout is hardcoded with no retry. 3-paragraph cap is too rigid.

### Solution

**New file:** `src/hooks/IALab/useValerioFallback.js`

#### Fallback Content by Module

```js
const FALLBACK_CONTENT = {
  1: {
    explanation: [
      { trigger: 'prompt', q: '¿Qué es un prompt?', a: '...' },
      { trigger: 'RTF', q: '¿Cómo funciona el método RTF?', a: '...' },
    ],
    examples: [],
    tips: [],
    encouragement: [],
  },
  2: {},
  3: {},
  4: {},
  5: {},
}
```

#### smartFallback(input, moduleId, studentContext)
1. Detect intent via keyword matching (pregunta / duda / frustración / práctica)
2. Match against `FALLBACK_CONTENT[moduleId]`
3. If no match, use module-aware generic with student name + level
4. Apply emotional tone variant if frustration detected

#### Timeout Improvement (in valerioPrompts.js)
- Attempt 1: 10s → Attempt 2: 8s → smartFallback()

#### Paragraph Limit
- Change from fixed 3 to `Math.min(paragraphs, level === 'advanced' ? 5 : 3)`

### Files changed
- `src/hooks/IALab/useValerioFallback.js` — NEW
- `src/components/IALab/IALabValerioPanel/valerioPrompts.js` — MODIFY (import + use smartFallback, adjust timeout/paragraphs)

---

## Área 2 — Session Memory

### Problem
Conversation stored as flat JSON in localStorage (`ialab_valerio_conversation`). No cross-session context. Valerio doesn't remember previous conversations.

### Solution

**New file:** `src/services/valerioMemory.js`

#### Data Structure
```js
{
  sessions: [
    {
      id: 'session_1718000000',
      moduleId: 2,
      date: '2026-06-10',
      summary: 'Preguntó sobre function calling, mostró frustración con APIs',
      messageCount: 12,
      topics: ['function calling', 'APIs'],
      userMood: 'frustrado',
    },
  ],
  currentSession: {
    messages: [
      { role: 'user', text: '...', timestamp: 1718000000 },
      { role: 'assistant', text: '...', timestamp: 1718000001 },
    ],
    startedAt: 1718000000,
  },
}
```

#### Flows

**finalizeSession()** — called on panel close + unmount:
- Generate simple summary (rule-based, no AI): extract first ~10 words of user's first message, scan for emotion keywords, count messages
- Push to `sessions[]`, cap at 20 most recent
- Clear `currentSession.messages`

**injectSessionContext(moduleId)** — called on panel open:
- If previous sessions exist for `moduleId`, return: *"En la sesión anterior el estudiante preguntó sobre [topics]. Mostró [mood]."*
- Otherwise return empty string

**buildValerioSystemPrompt()** — add session context to system prompt.

### Files changed
- `src/services/valerioMemory.js` — NEW
- `src/components/IALab/IALabValerioPanel/valerioPrompts.js` — MODIFY (injectSessionContext)
- `src/components/IALab/IALabValerioPanel/index.jsx` — MODIFY (finalizeSession on close/unmount)

---

## Área 3 — Knowledge Expansion (Q&A Bank)

### Problem
Valerio only knows iLAB course content. General AI questions (LLM, fine-tuning, RAG) rely solely on DeepSeek API.

### Solution

**New file:** `src/data/valerioKnowledgeBase.js`

#### Structure
```js
export const GENERAL_QA = {
  'llm': {
    keywords: ['llm', 'modelo de lenguaje', 'lenguaje', 'gpt', 'large language'],
    question: '¿Qué es un LLM?',
    answer: 'Un LLM (Large Language Model) es...',
    relatedModule: 1,
  },
  // 15-20 entries covering: ML, ChatGPT, fine-tuning, embeddings, RAG, tokens,
  //   temperature, sesgos, alucinaciones, prompt engineering, grounding, etc.
}
```

#### Knowledge Resolution Pipeline (replaces direct DeepSeek call)
```
User input
  → match GENERAL_QA keywords? → answer from Q&A bank
  → no match → DeepSeek API (10s timeout, 1 retry at 8s)
  → API fails → fuzzy match GENERAL_QA → answer
  → no fuzzy match → smartFallback()
```

### Files changed
- `src/data/valerioKnowledgeBase.js` — NEW
- `src/components/IALab/IALabValerioPanel/valerioPrompts.js` — MODIFY (integrate pipeline)

---

## Files Summary

| File | Status | Purpose |
|------|--------|---------|
| `src/hooks/IALab/useValerioFallback.js` | NEW | Smart fallback with module-aware content + tone detection |
| `src/services/valerioMemory.js` | NEW | Session persistence, summarization, context injection |
| `src/data/valerioKnowledgeBase.js` | NEW | 15-20 general AI Q&A pairs |
| `src/components/IALab/IALabValerioPanel/valerioPrompts.js` | MODIFY | Integrate all 3 new systems |
| `src/components/IALab/IALabValerioPanel/index.jsx` | MODIFY | Session lifecycle hooks |

## Non-Goals
- No changes to UI layout or ValerioAvatar
- No changes to DeepSeek API integration (only timeout/retry)
- No changes to existing conversation flow logic
- No visual redesign of the panel
