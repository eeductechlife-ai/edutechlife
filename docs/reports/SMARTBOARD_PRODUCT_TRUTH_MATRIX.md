# SmartBoard Product Truth Matrix

**Date:** 2026-09-01  
**Branch:** `recovery/foundation-phase-a`  
**Constraint:** ANALYSIS ONLY — no modifications

---

## 1. Product Core Classification

### CORE — Essential for SmartBoard value proposition
| Feature | Question Answered | Evidence |
|---------|-------------------|----------|
| Student Profile | Who is the student? | `students` table: grade, age, school, VAK, country |
| Competency Mastery | What does the student know? | `student_competency_mastery`: 0.7/0.3 weighted average, verified exact |
| Smart Priority (E5) | What should the student do NOW? | `adaptiveLearning.computeSmartboardPriority()`: learning > engagement > strength |
| Next Best Action | What is the single best next step? | `adaptiveLearning.getNextBestAction()`: explainable, data-driven |
| Content Recommendations | What specific content helps? | `adaptiveLearning.recommendContent()`: matched by subject, difficulty, age |
| Daily/Weekly Plan | What's the structured path? | `learning_plans` table with `plan_json` |
| Dani AI Tutor | How does the AI help? | `daniOrchestrator`: contextual prompt from profile + mastery + memory + schedule |
| AI Safety Gateway | Is the AI interaction safe? | `aiSafetyGateway`: input/output moderation, age policy |
| Crisis Detection | Is the student in danger? | `crisisDetection`: keyword-based, Spanish + English, high/medium risk |
| Early Warning | Is the student at risk academically? | `earlyWarning`: 5 rule-based detectors |
| Parent Insights | How does the parent understand? | `parentInsights`: structured insight cards (progress, risk, focus, mood, activity) |
| Parental Consent | Is the minor authorized? | `parent_consents` table + consent gate routes |
| Dani Memory | How does Dani remember? | `dani_memory`: communication style, interests, mood, pending topics |

### SUPPORT — Enhances experience, not required for core value
| Feature | Purpose | Status |
|---------|---------|--------|
| Missions (daily/weekly) | Gamification engagement | READY |
| Badges | Achievement rewards | READY |
| Points system | Scoring | BLOCKED (table missing) |
| Parent alerts | Push notifications to parents | BLOCKED (table missing) |
| Timetable/Schedule | Schedule awareness for Dani | READY |
| Grade scanner | OCR grade upload | READY (frontend only) |
| Flashcards | Study tool | READY (frontend only) |
| Exam prep | Practice exams | READY (frontend only) |
| Book reader | Reading tool | READY (frontend only) |
| Improvement plan | AI-generated study plan | PARTIAL (localStorage only) |

### OPTIONAL — Nice to have, defer for MVP
| Feature | Purpose | Status |
|---------|---------|--------|
| Multiplayer/leaderboards | Competition | NOT READY (0 tables, 0 users) |
| Predictions (ML) | Churn/risk prediction | NOT READY (needs months of data) |
| Parent-Dani chat | Conversational parent interface | NOT READY (tables missing) |
| Achievement catalog | Extended gamification | NOT READY (duplicate of badges) |

### EXPERIMENTAL — Stub code, no infrastructure
| Feature | Service | Status |
|---------|---------|--------|
| Admin metrics (DAU/WAU) | metricsService | STUB (tables don't exist) |
| Oral exam simulator | OralExamSimulator.jsx | FRONTEND ONLY |

### LEGACY — None identified
No SmartBoard features identified as legacy. All code references active tables.

### DEPRECATE — Candidates for removal
| Feature | Reason |
|---------|--------|
| `achievementService.js` (if badges kept) | Redundant with badgeEngine |
| `metricsService.js` (if PostHog adopted) | Stub with no tables |

---

## 2. Source of Truth (Section 6)

| Data Entity | Canonical Source | Duplicates | Status |
|------------|-----------------|------------|--------|
| Student identity | `students` table | None | ✅ CLEAN |
| Mastery levels | `student_competency_mastery` | None | ✅ CLEAN |
| Learning plans | `learning_plans` table | `useImprovementPlan` → localStorage | ⚠️ DUAL |
| Dani memory | `dani_memory` table | None | ✅ CLEAN |
| Sessions | `sessions` table (intended) | `useSessionTracker` → localStorage | ⚠️ DUAL |
| Dani chat history | NOT IN DB | `useDaniChat` → localStorage | ❌ NO DB |
| Recommendations | `recommendations` table | None | ✅ CLEAN |
| Missions | `student_missions` table | None | ✅ CLEAN |
| Points | `points_history` table (intended) | None | ❌ TABLE MISSING |
| Badges | `student_badges` table | None | ✅ CLEAN |
| Parent alerts | `early_warnings` table | None | ✅ CLEAN |
| Parent insights | Generated (not stored) | None | ✅ CLEAN |
| Competency catalog | `competencies` table (seeded) | None | ✅ CLEAN |
| Content catalog | `learning_content` table | None | ✅ CLEAN (thin) |

---

## 3. Content Intelligence (Section 7)

### Current State of `learning_content`
| Metric | Value |
|--------|-------|
| Total items | 4 (seed data from migration 055) |
| Subjects covered | 3 (matemáticas, lenguaje, tecnología) |
| Subjects missing | 3 (ciencias_naturales, ciencias_sociales, inglés) |
| Grade coverage | 6-7 only (6 of 11 grades uncovered) |
| Content types used | 3 of 8 (video, challenge, article) |
| Content types unused | 5 (exercise, quiz, podcast, game, reading) |
| VAK coverage | 3/3 (visual, auditivo, kinestesico) |
| Competency links | 4/4 items linked to competencies |

### Content Schema Quality
| Field | Coverage | Notes |
|-------|----------|-------|
| id (stable key) | ✅ | Format: `{country}_{subject}_{range}_{area}_{type}_{index}` |
| title | ✅ | Spanish, descriptive |
| type | ✅ | 8-option enum |
| subject | ✅ | Normalized key |
| competency_id | ✅ | FK to competencies table |
| age_min/max | ✅ | Filters by student age |
| difficulty (1-5) | ✅ | Used by recommendation engine |
| duration_min | ✅ | Used in plan generation |
| learning_objective | ✅ | Displayed in recommendations |
| vak_style | ✅ | Visual/auditivo/kinestesico |
| url | ❌ | No external resources linked |
| body (JSONB) | ❌ | Empty for all items |

### Golden Content Library Definition
For SmartBoard 3.0 Beta MVP, the minimum viable content library requires:

| Subject | Grade Ranges | Min Items | Types |
|---------|-------------|-----------|-------|
| Matemáticas | 1-3, 4-5, 6-7, 8-9, 10-11 | 10 | video, exercise, challenge |
| Lenguaje | 1-3, 4-5, 6-7, 8-9, 10-11 | 10 | article, exercise, quiz |
| Ciencias Naturales | 1-3, 4-5, 6-7, 8-9, 10-11 | 10 | video, exercise, reading |
| Ciencias Sociales | 4-5, 6-7, 8-9, 10-11 | 8 | article, reading, quiz |
| Inglés | 1-3, 4-5, 6-7, 8-9 | 8 | exercise, game, quiz |
| Tecnología | 6-7, 8-9, 10-11 | 6 | challenge, exercise |
| **Total minimum** | | **52** | |

**Current: 4 items. Gap: 48 items minimum.**

---

## 4. Differentiation Analysis (Section 8)

| Feature | Category | Evidence | Wording |
|---------|----------|----------|---------|
| **Smart Priority (E5)** | DIFFERENTIATOR | Separates learning need vs engagement need using min-mastery threshold. Verified: Student A (math weak) → practice math; Student B (math strong) → engagement. Algorithm documented, Golden Journey confirmed. | "SmartBoard identifies whether your child needs to learn something new or stay motivated, and prioritizes accordingly." |
| **Adaptive Path** | DIFFERENTIATOR | Weighted moving average mastery (0.7/0.3) drives plan generation. Four goal stages: recovery → practice → mastery → transfer. Verified exact math in Golden Journey. | "Learning paths adapt based on demonstrated mastery, not just time spent." |
| **Dani Contextual Tutor** | DIFFERENTIATOR | System prompt assembled from 8 data sources (profile, mastery, memory, plan, schedule, mood, interests, document). Age-appropriate policies. Pedagogical cycle enforced. | "Dani understands your child's strengths, schedule, and learning style to provide personalized tutoring." |
| **Parent Intelligence** | POTENTIAL DIFFERENTIATOR | 5 insight types from real data. Works today but limited without sessions table. No competitor comparison done. | "Parents receive data-driven insights about their child's academic progress." |
| **Early Warning** | POTENTIAL DIFFERENTIATOR | 5 rule-based detectors (inactivity, performance drop, repeated errors, streak breaks). Works immediately on real-time data. No ML required. | "Academic risk signals are detected automatically and communicated to parents." |
| **Growth Timeline** | NOT READY | No implementation found. Mastery history exists in `updated_at` but no visualization of progress over time. | DO NOT CLAIM |
| **Skill Passport** | POTENTIAL DIFFERENTIATOR | `useSkillPassport` hook reads mastery by competency. Competency catalog seeded from MEN Colombia curriculum (grades 1-11). | "Competency tracking aligned with Colombia's national curriculum standards." |
| **Future Explorer** | NOT READY | No implementation found in code. | DO NOT CLAIM |
| **Crisis Detection** | COMMODITY | Keyword-based detection (Spanish + English). Standard practice for children's educational platforms. Necessary but not differentiating. | Required safety feature — not a marketing point. |
| **AI Safety Gateway** | COMMODITY | Input/output moderation. Standard for children's AI interactions. | Required safety feature — not a marketing point. |
| **Gamification (missions/badges)** | COMMODITY | Standard daily/weekly mission system with XP rewards and badge unlocks. Similar to Duolingo, Khan Academy Kids. | Standard engagement feature. |

---

## 5. Age Segment Analysis (Section 10)

### Age Brackets (from aiSafetyGateway.getAgePolicy)

| Age | Policy | Max Response | Language Level |
|-----|--------|-------------|----------------|
| < 7 | Muy simple | 2 sentences | Very simple words, emojis |
| 7-9 | Simple | 3 sentences | Simple and clear, real-world examples |
| 10-11 | Accessible | 4 sentences | Basic academic terms with explanation |
| 12-14 | Standard | No limit specified | Academic terms, structured responses |
| 15-16 | Advanced | No limit specified | Technical vocabulary acceptable |

### Experience Evaluation by Segment

| Aspect | 6-8 | 9-12 | 13-16 |
|--------|-----|------|-------|
| **Visual** | ⚠️ Single UI for all ages | ⚠️ Same dashboard | ✅ Appropriate |
| **Navigation** | ⚠️ Complex menu structure | ⚠️ Many options | ✅ Manageable |
| **Language** | ✅ Dani adapts via age policy | ✅ Dani adapts | ✅ Dani adapts |
| **Difficulty** | ⚠️ Content library too thin (4 items) | ⚠️ Same issue | ⚠️ Same issue |
| **Gamification** | ✅ Missions/badges age-neutral | ✅ Appropriate | ⚠️ May feel childish |
| **Dani behavior** | ✅ Short, emoji-friendly | ✅ Clear, example-based | ✅ Academic |
| **Parent comm** | ✅ Insight cards age-neutral | ✅ Same | ✅ Same |

### Key Gaps:
1. **No visual age differentiation** — same dashboard for 6-year-old and 16-year-old
2. **Content library covers only grades 6-7** — younger and older students get no content
3. **Navigation complexity** — sidebar with many options may overwhelm young children
4. **Gamification doesn't scale** — missions are identical regardless of age

---

## 6. Marketing Claims Audit (Section 14)

| Claim | Technical Evidence | Product Evidence | Allowed Wording |
|-------|-------------------|------------------|-----------------|
| "AI personalizada" | Dani prompt assembled from 8 context sources | Golden Journey: different responses for A vs B | ✅ "Tutoría con IA que se adapta al perfil, nivel y horario de cada estudiante" |
| "Aprendizaje adaptativo" | Smart Priority (E5) + mastery 0.7/0.3 + recommendations | Golden Journey: differentiation confirmed 5/5 signals | ✅ "Rutas de aprendizaje que se adaptan según el dominio demostrado" |
| "2,500+ familias" | Claim on /conoce-smartboard | No evidence in database (1 student found) | ❌ REMOVE or clarify as IALab+SmartBoard combined |
| "Coaches expertos" | Claim on /conoce-smartboard | No human coaching feature in SmartBoard code | ❌ REMOVE unless referring to external service |
| "Reportes en tiempo real" | Parent Insights generates cards from DB | Works but partial (no sessions table) | ⚠️ "Reportes basados en datos del progreso académico" (remove "tiempo real" until sessions exist) |
| "Confiado por familias" | Social proof on landing | No verification system, no testimonials | ⚠️ Generic — acceptable but unsubstantiated |
| "Detección temprana" | earlyWarning 5 detectors | 4/5 implemented, works on real-time data | ✅ "Detección automática de señales de riesgo académico" |
| "Currículo MEN Colombia" | competencies seeded from MEN grades 1-11 | Migration 053 seeds competencies | ✅ "Competencias alineadas con los estándares del MEN" |

---

## 7. Release Gates (Section 13)

| Gate | Description | Status | Blockers |
|------|-------------|--------|----------|
| **GATE 1: Infrastructure** | Schema reconciled, sessions table exists, consent table exists | ❌ BLOCKED | Migration 059 + 008 not applied to production |
| **GATE 2: Security** | RLS tightened, IDOR fixed, permissive policies removed | ❌ BLOCKED | FASE D not started |
| **GATE 3: Learning Brain** | Mastery, Smart Priority, Recommendations verified end-to-end | ✅ PASSED (staging) | Re-verify on production after Gate 1 |
| **GATE 4: Dani** | Contextual prompts, age policy, safety gateway, crisis detection | ⚠️ PARTIAL | DeepSeek API key needed; chat history not persisted |
| **GATE 5: Parent** | Parent Insights, Early Warning, Consent flow verified | ⚠️ PARTIAL | parent_consents table missing; sessions data missing |
| **GATE 6: Browser** | All routes load, no 404/500, console clean | ⚠️ PARTIAL | Registration page has 404s; protected routes need auth |
| **GATE 7: Visual** | Responsive (mobile/tablet/desktop), dark mode, touch targets | ✅ PASSED | Phase 13-14 verified |
| **GATE 8: Pilot** | 5+ real students, 3+ parents, 7 days of usage data | ❌ NOT STARTED | Requires all previous gates |

---

## 8. Browser Experience Observations (Section 9)

| Page | Issue | Type | Severity |
|------|-------|------|----------|
| `/smartboard` | Redirects to `/sign-up/smartboard` — skeleton loads with multiple 404 errors on console | confusing flow | MEDIUM |
| `/smartboard/app` | Redirects to `/login` (correct for unauth) | expected redirect | LOW |
| `/conoce-smartboard` | Loads correctly: hero, value prop, social proof. Back arrow (←) overlaps text on mobile scroll. | minor UI | LOW |
| `/conoce-smartboard` | Claims "2,500+ familias" — not verified in DB | fake data | HIGH |
| `/admin/login` | Loads correctly, clean form | — | — |
| `/smartboard/app` (auth'd) | Cannot test — no test credentials | untestable | MEDIUM |
| All SmartBoard pages | No age-differentiated UI — same layout for age 6 and age 16 | design gap | MEDIUM |

---

*Analysis only — no modifications of any kind.*
