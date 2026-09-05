# SmartBoard Learning Brain Architecture

**Date:** 2026-09-01  
**Branch:** `recovery/foundation-phase-a`  
**Status:** ANALYSIS ONLY — no code modifications

---

## 1. Learning Brain Overview

The Learning Brain is the data-driven intelligence layer of SmartBoard 3.0. It answers six questions for every student, every session:

| # | Question | Component | Status |
|---|----------|-----------|--------|
| 1 | What does the student need? | Smart Priority (E5) | IMPLEMENTED |
| 2 | What should the student do now? | Next Best Action + Daily Plan | IMPLEMENTED |
| 3 | Why? | Explainable Recommendations | IMPLEMENTED |
| 4 | How does the system adapt? | Mastery Evolution (0.7/0.3) + Content Engine | IMPLEMENTED |
| 5 | How does Dani help? | DaniOrchestrator (contextual prompt) | IMPLEMENTED |
| 6 | How does the parent understand? | Parent Insights + Early Warning | IMPLEMENTED |

---

## 2. Data Flow Pipeline

```
 STUDENT ACTION
     │
     ▼
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  PROFILE     │     │  LEARNING GRAPH  │     │  DANI MEMORY     │
│  students    │────▶│  competencies    │────▶│  dani_memory     │
│  grade/age   │     │  mastery (0-1)   │     │  style/mood      │
│  school/VAK  │     │  practice_count  │     │  interests       │
└─────────────┘     └────────┬────────┘     └────────┬─────────┘
                             │                        │
                    ┌────────▼────────┐              │
                    │  SMART PRIORITY  │◀─────────────┘
                    │  (E5 engine)     │
                    │  learning_need   │
                    │  engagement_need │
                    │  confidence      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │ RECOMMEND  │  │ NEXT BEST  │  │ DAILY PLAN │
     │ content    │  │ ACTION     │  │ activities │
     │ (persist)  │  │ (explain)  │  │ (schedule) │
     └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
           │               │               │
           └───────────────┼───────────────┘
                           ▼
              ┌────────────────────────┐
              │     DANI ORCHESTRATOR   │
              │  system prompt builder  │
              │  age policy · pedagogy  │
              │  mastery · schedule     │
              └────────────┬───────────┘
                           │
                    ┌──────▼──────┐
                    │  AI SAFETY   │
                    │  GATEWAY     │
                    │  input/output│
                    │  moderation  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  DeepSeek   │
                    │  LLM call   │
                    └──────┬──────┘
                           │
              ┌────────────▼────────────┐
              │    RESULT PROCESSING     │
              │  mastery update (0.7/0.3)│
              │  streak update           │
              │  mission progress        │
              │  badge check             │
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │    MONITORING LAYER      │
              │  Early Warning (5 rules) │
              │  Parent Insights (cards) │
              │  Crisis Detection        │
              └─────────────────────────┘
```

---

## 3. Component Detail

### 3.1 Profile (`students` table)
- **Source of truth:** `students` table (Supabase)
- **Key fields:** `id`, `grade_level`, `country_code`, `school`, `age`, `name`, `vak_style`
- **Consumers:** adaptiveLearning, daniOrchestrator, parentInsights, all frontend hooks
- **Status:** ✅ EXISTS in production

### 3.2 Learning Graph (`competencies` + `student_competency_mastery`)
- **Source of truth:** `student_competency_mastery` (per-student, per-competency)
- **Competency ID format:** `{country}_{subject}_{gradeRange}_{index}` (e.g., `co_matematicas_6-7_1`)
- **Mastery algorithm:** Weighted moving average: `new = old * 0.7 + score * 0.3`
- **Range:** 0.0 to 1.0, rounded to 3 decimals
- **Writer:** `competencyMastery.updateCompetencyMastery()` (backend only)
- **Readers:** adaptiveLearning, daniOrchestrator, earlyWarning, badgeEngine, parentInsights
- **Frontend:** `useSkillPassport` (read), `useCompetencyTracking` (write via backend API)
- **Verified:** Golden Journey confirmed exact 0.7/0.3 math (0.365 → 0.4355 → 0.5512 → 0.656)
- **Status:** ✅ EXISTS in production

### 3.3 Smart Priority (E5 engine in `adaptiveLearning.js`)
- **Algorithm:** Separates LEARNING NEED from ENGAGEMENT NEED
  - If min mastery < 0.4 → LEARNING wins (practice weakest competency)
  - If no deficit but low activity → ENGAGEMENT wins (motivation/streak)
  - If neither → STRENGTH wins (challenge/transfer)
- **Inputs:** masteryRows (per-competency), behavior (activeDaysLast14, streak)
- **Outputs:** `{ winning, goal, weakestSubject, minMastery, urgency, confidence }`
- **Goal stages:** recovery (<0.3) → practice (<0.6) → mastery (<0.8) → transfer (≥0.8)
- **Status:** ✅ IMPLEMENTED, verified in Golden Journey (differentiation A≠B)

### 3.4 Recommendations (`adaptiveLearning.recommendContent()`)
- **Process:**
  1. Identify weaknesses (mastery < 0.4) → fetch easy content from `learning_content`
  2. Identify strengths (mastery ≥ 0.7) → fetch challenge content
  3. Fallback chain: related → prerequisite → diagnostic → exploration (never empty)
  4. Persist to `recommendations` table
- **Content query:** Filters by subject, difficulty, age, is_active
- **Tables:** `learning_content` (read), `recommendations` (write)
- **Status:** ✅ IMPLEMENTED (content library has 4 seed items — thin)

### 3.5 Daily/Weekly Plan (`adaptiveLearning.saveLearningPlan()`)
- **Source of truth:** `learning_plans` table (`plan_json` JSONB)
- **Types:** daily, weekly, monthly
- **Generated from:** Smart Priority + recommendations + schedule context
- **Consumer:** daniOrchestrator (today's plan summary in Dani prompt)
- **Status:** ✅ EXISTS in production

### 3.6 Activity & Sessions
- **Source of truth (intended):** `sessions` table
- **Fields:** student_id, subject, duration_minutes, type, points_earned, content_id
- **Writer:** Frontend `useSmartBoardSupabase` (direct insert)
- **Consumers:** adaptiveLearning (recent sessions), parentInsights (session history)
- **Status:** ❌ TABLE MISSING from production (exists in staging via migration 059)

### 3.7 Dani Orchestrator (`daniOrchestrator.js`)
- **Context loaded per request (parallel):**
  - Student profile (grade, age, school)
  - Competency mastery (weakest first, limit 30)
  - Dani memory (communication style, interests, mood, pending topics)
  - Active learning plan
  - Today's schedule (timetable slots by day of week)
- **System prompt construction:**
  - Base identity (Dani, tutora virtual)
  - Age policy (6 / 7-9 / 10-11 / 12-14 / 15-16 brackets)
  - Communication style adaptation (shy/direct/playful/curious)
  - Student interests (for real-world examples)
  - Mastery-driven weak areas
  - Pending topics from memory
  - Emotional state handling (frustrated → extra patient)
  - Today's schedule and active plan
  - Document context (ephemeral, for grade analysis)
  - Pedagogical cycle (ALWAYS: ask→hint→explain→example→verify→feedback)
  - Socratic mode (optional: respond only with questions)
- **Safety:** aiSafetyGateway pipeline (input validation, content moderation, age policy, output validation)
- **Crisis:** crisisDetection (keyword-based, Spanish + English, high/medium risk)
- **Status:** ✅ IMPLEMENTED (requires DeepSeek API key at runtime)

### 3.8 Dani Memory (`dani_memory` table)
- **Source of truth:** `dani_memory` (1 row per student, UNIQUE)
- **Fields:** communication_style (shy/direct/playful/curious), strengths[], weaknesses[], interests[], frequent_errors[], pending_topics[], last_mood
- **Writer:** Frontend `useDaniMemory` (direct Supabase upsert, debounce 2s)
- **Readers:** daniOrchestrator (prompt context), parentInsights
- **Status:** ✅ EXISTS in production

### 3.9 Early Warning (`earlyWarning.js`)
- **5 detectors:**
  1. **Inactivity** — last_activity > 3 days → medium; > 7 days → high
  2. **Performance drop** — avg mastery dropped > 20% vs 7 days ago
  3. **Repeated errors** — mastery < 0.3 after ≥ 3 attempts in same competency
  4. **Low completion** — NOT YET IMPLEMENTED (needs activity_log)
  5. **Streak breaks** — current_streak = 0 AND total_days_active > 5
- **Output:** Upserts to `early_warnings` table (one unresolved per student+type)
- **Tables:** learning_streaks, student_competency_mastery, early_warnings
- **Status:** ✅ IMPLEMENTED (4/5 detectors active)

### 3.10 Parent Intelligence (`parentInsights.js`)
- **Insight types generated:**
  1. **Progress** — best subject mastery ≥ 60%
  2. **Risk** — weakest subject mastery < 40%
  3. **Focus** — plan activity or recommended next step
  4. **Mood** — emotional state from dani_memory
  5. **Activity** — session frequency and duration
- **Output:** Array of InsightCards `{ type, title, body, severity, actionLabel }`
- **Tables:** students, student_competency_mastery, dani_memory, learning_plans, sessions
- **Status:** ✅ IMPLEMENTED (sessions table missing → partial data)

### 3.11 Gamification Layer
- **Missions** (`missionEngine.js`): Daily/weekly/exploration from missions catalog. Auto-seed if student has < 2 active. Progress tracked in `student_missions`.
- **Badges** (`badgeEngine.js`): Awarded based on mastery thresholds, streak achievements, mission completions. Tracked in `student_badges`.
- **Points** (`points_history`): ❌ TABLE MISSING — blocks achievement scoring
- **Rewards** (`rewards`, `student_rewards`): Seed data exists; frontend references table.
- **Status:** Missions/Badges ✅ READY | Points/Achievements ❌ BLOCKED

---

## 4. Source of Truth Matrix

| Data Entity | Source of Truth | Duplicates Found | Risk |
|------------|----------------|------------------|------|
| Student profile | `students` table | None | LOW |
| Mastery levels | `student_competency_mastery` | None | LOW |
| Dani memory | `dani_memory` table | None | LOW |
| Learning plans | `learning_plans` table | `useImprovementPlan` → localStorage | MEDIUM |
| Sessions | `sessions` table (intended) | `useSessionTracker` → localStorage `ialab_session_log` | HIGH |
| Progress (IALab) | `usePersistentProgress` → Supabase + localStorage fallback | 8+ localStorage keys | MEDIUM |
| Chat history | NOT PERSISTED to DB | `useDaniChat` → localStorage | HIGH |
| Onboarding state | localStorage | `OnboardingWizard.jsx` | LOW |
| Grade scan data | localStorage | `useGradeScanner.js` | LOW |
| Flashcard imports | localStorage | `FlashcardImporter.jsx` | LOW |
| Improvement plan | localStorage only | `useImprovementPlan.js` | HIGH |

### localStorage Dependencies in SmartBoard (12 files):
1. `useDaniChat.js` — chat history (should be DB)
2. `useDaniWelcome.js` — welcome flag (acceptable)
3. `useImprovementPlan.js` — AI-generated plan (should be `learning_plans`)
4. `useGradeScanner.js` — scan results (ephemeral, acceptable)
5. `HeroSection.jsx` — UI preference (acceptable)
6. `SmartBoardKidsDashboard.jsx` — dashboard state (acceptable)
7. `PremiumSidebar.jsx` — collapse state (acceptable)
8. `kidsDashboardConfig.js` — config (acceptable)
9. `OnboardingWizard.jsx` — onboarding progress (acceptable)
10. `SmartProfile.jsx` — profile cache (acceptable)
11. `OralExamSimulator.jsx` — exam state (should be sessions)
12. `FlashcardImporter.jsx` — import data (ephemeral, acceptable)

**Critical localStorage → DB migrations needed:** Dani chat history, improvement plans, session data

---

## 5. Intelligence Layers

```
Layer 0: DATA COLLECTION    → profile, grades, sessions, mastery scores
Layer 1: PATTERN DETECTION  → Smart Priority (learning vs engagement vs strength)
Layer 2: CONTENT MATCHING   → RecommendationEngine (real content from library)
Layer 3: PLANNING          → Daily/Weekly plans with activities
Layer 4: INTERACTION       → Dani (contextual AI tutor, age-appropriate)
Layer 5: MONITORING        → Early Warning (5 detectors), Parent Insights (5 types)
Layer 6: SAFETY            → AI Safety Gateway (input/output), Crisis Detection
```

---

## 6. Verified Behaviors (from Golden Journey, staging)

| Behavior | Evidence | Exactness |
|----------|----------|-----------|
| Mastery 0.7/0.3 weighted average | 0.35→0.365→0.4355→0.5512→0.656 | **EXACT** |
| Student differentiation (A≠B) | 5/5 signals different (math, sci, recs, plan, nba) | **CONFIRMED** |
| Smart Priority learning > engagement | A (math 42%) → practice math; B (math 85%) → engagement | **CONFIRMED** |
| Persistence across sessions | Logout→login: mastery 0.656 preserved | **CONFIRMED** |
| Parent insights data-driven | insights ["progress","focus"] from real mastery | **CONFIRMED** |
| Age-appropriate Dani | Age policy injected into system prompt | **IMPLEMENTED** |

---

## 7. Architecture Health

| Aspect | Grade | Notes |
|--------|-------|-------|
| Data normalization | A | Single source per entity, no split-brain |
| Mastery algorithm | A | Mathematically verified, well-documented |
| Adaptive logic | A | Smart Priority separates concerns cleanly |
| Content model | C | Only 4 seed items — needs real curriculum content |
| Safety pipeline | B+ | Input/output moderation + crisis detection; no audit trail |
| Persistence | C | 3 critical data types still in localStorage |
| Parent intelligence | B | Works but partial without sessions table |
| Gamification | B- | Missions/badges work; points/achievements blocked |

---

*Analysis only — no code modifications.*
