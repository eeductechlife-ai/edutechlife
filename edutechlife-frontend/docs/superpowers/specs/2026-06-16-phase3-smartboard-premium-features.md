# Phase 3 — SmartBoard Kids Dashboard: Premium AI Features

**Date:** 2026-06-16
**Status:** Approved Design
**Target:** Edutechlife SmartBoard Kids Dashboard

## Overview

Elevate SmartBoard beyond competitor Astra AI by adding 5 feature families: Oral Exam Simulator, Curriculum Alignment COL, Collaborative Study, Multi-modal Dani Responses, and Advanced Analytics. All frontend-only, leveraging existing infrastructure (DeepSeek API, Recharts, framer-motion, localStorage).

## 1. Oral Exam Simulator

**New tab:** `🧪 Oral`

Dani acts as oral examiner. Flow:
1. Select subject → choose difficulty (easy/medium/hard)
2. Dani generates 4 questions per round via DeepSeek: 3 multiple-choice + 1 open
3. Multiple-choice: 4 options, tap to answer, instant feedback with explanation
4. Open question: student types response, Dani evaluates via DeepSeek, gives qualitative feedback
5. Score accumulated per session with success/fail animations
6. End-of-round summary: grade, strengths, improvement areas
7. Optional TTS reads questions aloud

**Key decisions:**
- Question diversity enforced via DeepSeek prompt: `Genera 4 preguntas de {materia} nivel {dificultad}. 3 opción múltiple con 4 opciones, 1 pregunta abierta. Formato JSON.`
- No audio recording — student types open answers
- Results persist to localStorage (`edutechlife_oral_sessions`) for analytics

## 2. Curriculum Alignment COL

**New tab:** `📋 Currículo`

Local JSON file (`curriculo_col.json`) containing Colombian MEN DBA taxonomy for grades 1-11:
- Mathematics, Spanish, Natural Sciences, Social Studies, English, Technology, Arts, Physical Education
- Each grade → subject → competencies → DBA statements → topics
- UI shows DBA cards with status: ✅ (mastered via quiz/VAK), 🔄 (in progress), ⬜ (pending)
- Dani uses this framework via context injection: `Basado en el DBA de matemáticas grado 6: {dba_text}`
- DeepSeek generates lesson plans, activities, and assessments grounded in this structure

**Hybrid architecture:**
- JSON file = authoritative skeleton (accuracy, zero-cost)
- DeepSeek API = content generation engine (dynamic, personalized)

## 3. Collaborative Study

**Two features, no backend:**

### 3a. Shared Flashcards
- Each deck auto-generates a 6-char share code (e.g., `F3K7M9`)
- "Share" button copies code to clipboard
- "Import" dialog accepts code → reads deck from localStorage
- Shared decks stored under `edutechlife_shared_decks`
- Cross-session: decks survive refresh

### 3b. Local Multiplayer Quiz
- Button "2 Jugadores" on FlashcardSystem
- Split-screen: Player 1 top, Player 2 bottom
- Alternating turns, same question set
- Individual scores tracked, winner declared at end

## 4. Multi-modal Dani Responses

**Inline inside DaniTutorChat:**

### 4a. Charts (Recharts)
- When Dani returns numeric data (scores, trends, comparisons), render a mini chart
- Detection: response contains structured data like `{"chart": "bar", "data": [...]}`
- Supported types: bar chart (comparisons), pie chart (distributions), line chart (trends)
- Uses Recharts responsive containers with framer-motion entrance animations

### 4b. YouTube Embeds
- When Dani suggests a video, render inline iframe with lazy loading
- Dani prompt: `Si es relevante, incluye un video de YouTube en formato: {"video": {"title": "...", "url": "https://youtube.com/watch?v=..."}}`
- Whitelist: only youtube.com domains allowed
- Show thumbnail + title before user clicks to load

**Implementation:**
- Two new message types in chat history: `{ type: 'chart', data: {...} }` and `{ type: 'video', data: {...} }`
- Rendered as special blocks between text messages
- Mood detection continues working with multi-modal messages

## 5. Advanced Analytics

**New tab:** `📈 Analítica` (Premium only)

Five metrics, all from existing localStorage data:

| Metric | Visualization | Data Source |
|--------|--------------|-------------|
| Learning velocity | Bar chart (student vs average) | quiz scores / study time |
| Subject heatmap | 6×N color grid (green→red) | VAK results + quiz per subject |
| Performance prediction | Line chart with trend projection | historical exam/quiz scores |
| Time vs results | Scatter plot | study sessions (duration + score) |
| Streak per subject | Individual streak counters | daily activity timestamps |

**Premium gate applied** — only `subscriptionTier === 'premium'` can access. Free users see upgrade prompt.

## Files Changed

| File | Change |
|------|--------|
| `src/components/kids-dashboard/SmartBoardKidsDashboard.jsx` | Add 3 new tabs (oral, currículo, analítica), lazy imports |
| `src/components/kids-dashboard/OralExamSimulator.jsx` | NEW — full exam flow |
| `src/components/kids-dashboard/CurriculumView.jsx` | NEW — DBA browser + status |
| `src/data/curriculo_col.json` | NEW — DBA taxonomy data |
| `src/components/kids-dashboard/FlashcardSystem.jsx` | Add share/import + multiplayer mode |
| `src/components/kids-dashboard/DaniTutorChat.jsx` | Add multi-modal rendering (chart + video blocks) |
| `src/components/kids-dashboard/SmartBoardAnalytics.jsx` | NEW — 5-metric analytics dashboard |
| `src/utils/api.js` | Add `callDeepseek` with JSON mode helper if needed |

## Implementation Order

1. Curriculum COL JSON + tab (foundation for oral exam + analytics)
2. Oral Exam Simulator (highest impact, uses curriculum)
3. Multi-modal Dani (charts + YouTube)
4. Collaborative study (flashcard share + multiplayer)
5. Advanced Analytics (consumes all previous data)

## Dependencies

- Recharts (already in package.json)
- framer-motion (already in package.json)
- DeepSeek API via `/api/chat` (already wired up)
- Web Speech API (already used by Dani)
- No new npm packages required
