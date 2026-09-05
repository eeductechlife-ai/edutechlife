# SmartBoard 3.0 Roadmap — Next Steps

**Date:** 2026-09-01  
**Branch:** `recovery/foundation-phase-a`  
**Constraint:** ANALYSIS ONLY — this is a plan, not an execution

---

## Status: READY_FOR_IMPLEMENTATION (with decisions)

The Learning Brain architecture is solid. The mastery algorithm is verified. The adaptive engine differentiates students correctly. The core is implemented. What remains is:
1. Infrastructure reconciliation (schema)
2. Security hardening (RLS/IDOR)
3. Content library (4 items → 50+)
4. Data persistence cleanup (localStorage → DB)
5. Decisions on deferred features

---

## P0 — Must complete before Beta MVP (max 10 actions)

| # | Action | Type | Scope | Dependencies | Est. |
|---|--------|------|-------|-------------|------|
| P0.1 | **Apply migration 059** to production (sessions, points_history, crisis_alerts, conversations, achievements, academic_context) | Infrastructure | DB | Backup + dry-run on clone | 1 day |
| P0.2 | **Apply migration 008** to production (parent_consents) | Infrastructure | DB | Backup | 0.5 day |
| P0.3 | **Fix IDOR vulnerability**: implement `requireStudentAccess` middleware in smartboard.js routes | Security | Backend | None | 1 day |
| P0.4 | **Tighten RLS**: replace permissive policies (041/049) with own-row policies on students and vak_results | Security | DB | Test on staging first | 1 day |
| P0.5 | **Migrate improvement plans** from localStorage to `learning_plans` table | Data integrity | Frontend | None | 0.5 day |
| P0.6 | **Migrate Dani chat history** from localStorage to DB (new table or `conversations`) | Data integrity | Frontend + DB | Migration 059 (conversations) | 1 day |
| P0.7 | **Populate content library**: 50+ items across 6 subjects, 5 grade ranges, multiple types | Content | DB seed | Content creation (human) | 3-5 days |
| P0.8 | **Configure DeepSeek API key** in production/staging environment | Infrastructure | Config | API key procurement | 0.5 day |
| P0.9 | **Fix registration page 404s**: diagnose console errors on `/smartboard` → `/sign-up/smartboard` | Bug fix | Frontend | None | 0.5 day |
| P0.10 | **Remove or substantiate "2,500+ familias" claim** on /conoce-smartboard | Integrity | Frontend | Marketing decision | 0.5 day |

**Total P0 estimated effort: ~10-12 days**

---

## P1 — Complete for Beta launch

| # | Action | Type | Scope | Est. |
|---|--------|------|-------|------|
| P1.1 | Apply migrations 033-034 (parent_alerts system) | Infrastructure | DB | 0.5 day |
| P1.2 | Create test student credentials (2 students, 2 parents) for QA | Testing | DB | 0.5 day |
| P1.3 | End-to-end Golden Journey on production (replicate staging 15/20) | Verification | Full stack | 1 day |
| P1.4 | Fix `study_groups` RLS policies (current_user never matches) | Security | DB | 0.5 day |
| P1.5 | Fix admin RLS (raw_user_meta_data is editable) | Security | DB | 0.5 day |
| P1.6 | Implement `earlyWarning` detector #4 (low_completion) | Feature | Backend | 0.5 day |
| P1.7 | Age-differentiated UI: at minimum, font size / color theme by age bracket | UX | Frontend | 1-2 days |
| P1.8 | Session tracking: migrate `useSessionTracker` from localStorage to `sessions` table | Data integrity | Frontend | P0.1 |
| P1.9 | Parent consent flow: end-to-end test (request → verify → gate) | Verification | Full stack | 1 day |
| P1.10 | Deploy staging frontend (Vercel project with staging env vars) | Infrastructure | DevOps | 0.5 day |

**Total P1 estimated effort: ~7-8 days**

---

## P2 — Post-Beta enhancements

| # | Action | Type | Est. |
|---|--------|------|------|
| P2.1 | Apply migrations 037 (predictions system) — when enough data exists | Infrastructure | 1 day |
| P2.2 | Apply migrations 038 (parent chat system) | Infrastructure | 1 day |
| P2.3 | Apply migrations 036 (multiplayer) — when 50+ students active | Infrastructure | 1 day |
| P2.4 | Implement achievement catalog (merge with or replace badgeEngine) | Feature | 2 days |
| P2.5 | Replace metricsService stub with PostHog or Supabase analytics | Analytics | 2 days |
| P2.6 | Content Management System (Admin CMS) for learning_content | Feature | 5+ days |
| P2.7 | Growth Timeline visualization (mastery over time) | Feature | 2 days |
| P2.8 | Future Explorer (career path suggestions based on mastery) | Feature | 3 days |
| P2.9 | Multi-language content (English + Spanish) | Content | 3 days |
| P2.10 | Parent-Dani conversational chat | Feature | 3 days |

---

## Beta MVP Definition (Section 12)

### SmartBoard 3.0 Beta MVP demonstrates:

**Student Value:**
- Login → see my mastery across subjects
- Get a personalized daily plan based on my weaknesses
- Talk to Dani who knows my level, mood, and schedule
- Complete missions and earn badges
- Track my streaks and progress

**Parent Value:**
- See insight cards: what's going well, what needs attention
- Receive early warning signals (inactivity, performance drops)
- Consent gate for minor's data access
- Crisis detection (automatic, silent)

**Adaptive Value:**
- Smart Priority: learning need > engagement > strength
- Mastery evolves with 0.7/0.3 weighted average
- Recommendations match content to weakness + difficulty + age
- Plans generated from student state, not generic

**AI Value:**
- Dani assembles context from 8 data sources per request
- Age-appropriate language policy enforced
- Pedagogical cycle (ask → hint → explain → example → verify → feedback)
- Communication style adaptation (shy/direct/playful/curious)
- Safety: content moderation + crisis detection

### What Beta MVP does NOT include:
- Multiplayer/leaderboards
- Prediction/churn scoring
- Parent-Dani chat
- Achievement catalog (badges are sufficient)
- Admin metrics dashboard (use Supabase dashboard)
- Growth Timeline visualization
- Future Explorer
- Multi-age UI differentiation (beyond Dani language)

---

## Service Architecture — Final State (post-P0)

### ACTIVE (13 services)
```
CORE (7):
  adaptiveLearning.js     → Smart Priority, Plans, Recommendations
  competencyMastery.js    → Mastery 0.7/0.3
  daniOrchestrator.js     → Context assembly for AI tutor
  earlyWarning.js         → 5 risk detectors
  parentInsights.js       → Parent insight cards
  aiSafetyGateway.js      → Input/output moderation
  crisisDetection.js      → Crisis keyword detection

GAMIFICATION (3):
  missionEngine.js        → Daily/weekly missions
  badgeEngine.js          → Badge awards
  weeklyReport.js         → Weekly summary generation

PARENT (1):
  parentAlertsService.js  → Parent alert delivery

AUTH (1):
  authService.js          → Authentication
```

### DEFERRED (4 services — kept in code, not activated)
```
  predictionService.js    → Needs months of data
  multiplayerService.js   → Needs critical mass of users
  achievementService.js   → Redundant with badgeEngine
  parentChatService.js    → Parent Insights sufficient for MVP
```

### TO DECIDE (1 service)
```
  metricsService.js       → Replace with PostHog or keep stub?
```

---

## Decisions Required

| # | Decision | Options | Recommendation | Owner |
|---|----------|---------|---------------|-------|
| D1 | Metrics approach | (A) Create 4 tables for metricsService (B) Adopt PostHog (C) Use Supabase dashboard | **(B) PostHog** — free tier covers MVP, no custom tables | Product |
| D2 | Achievement vs Badge | (A) Keep both (B) Merge into badgeEngine (C) Keep achievementService, remove badgeEngine | **(B) Merge** — one system is cleaner | Product |
| D3 | "2,500+ familias" claim | (A) Remove (B) Change to IALab+SmartBoard combined (C) Change to "families in Colombia" | **(A) Remove** — unverifiable | Marketing |
| D4 | Age-differentiated UI | (A) Single UI, Dani-only adaptation (B) 3 themes (6-8, 9-12, 13-16) (C) 2 themes (kids, teens) | **(C) 2 themes** — minimum viable differentiation | Product/UX |
| D5 | Content creation | (A) Manual seed migration (B) Admin CMS first (C) AI-generated content | **(A) Manual seed** for MVP, **(B) CMS** for P2 | Product |
| D6 | Dani chat persistence | (A) New table (B) Use existing `conversations` (C) Keep localStorage | **(B) conversations** — table created by 059, schema fits | Engineering |
| D7 | Production migration timing | (A) Immediate (B) After staging re-verification (C) After backup + dry-run | **(C) Backup + dry-run** — production has real user | Engineering |

---

## Final Status

| Deliverable | State |
|-------------|-------|
| Learning Brain Architecture | **READY_FOR_IMPLEMENTATION** |
| Database Strategy | **NEEDS_DECISION** (D1, D7) |
| Complexity Reduction | **READY_FOR_IMPLEMENTATION** |
| Product Truth Matrix | **READY_FOR_IMPLEMENTATION** |
| Roadmap | **NEEDS_DECISION** (D1-D7) |
| Code modifications | **NONE MADE** |
| DB modifications | **NONE MADE** |
| Production changes | **NONE MADE** |

---

*Plan only — no code modified, no migrations executed, no production changes.*
