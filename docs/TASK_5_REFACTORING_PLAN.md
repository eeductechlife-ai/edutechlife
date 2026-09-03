# Task 5: Monolith Refactoring — Detailed Implementation Plan

**Initiative #13: Break up large route files into domain-focused modules**

Date: Sep 3, 2026  
Status: Plan ready for next session execution

---

## Problem Statement

Current route file sizes exceed best practices:
- `smartboard.js`: 2,139 lines (⚠️ CRITICAL)
- `auth.js`: 1,012 lines (⚠️ HIGH)
- Others: <300 lines (✅ OK)

**Impact:** Hard to maintain, test, and reason about. Related routes spread across file.

**Solution:** Split into domain-focused subdirectories with <300 lines per file.

---

## Refactoring Plan: smartboard.js (2,139 → 8 files)

### Directory Structure

```
edutechlife-backend/src/routes/
├── smartboard.js (legacy, will be deprecated)
└── smartboard/
    ├── index.js (40 lines) — re-export all routers
    ├── chat.js (143 lines) — AI chat & Dani
    ├── parental-consent.js (270 lines) — Consent workflow
    ├── student-profile.js (320 lines) — Profile management
    ├── progress.js (220 lines) — Progress & grades
    ├── adaptive.js (180 lines) — Learning engine
    ├── parent-insights.js (90 lines) — Parent dashboard
    ├── gamification.js (90 lines) — Missions & badges
    └── core.js (220 lines) — Core endpoints
```

### File Mappings

#### 1. chat.js (lines 144–340 in original)
**Routes:**
- `POST /chat` — Chat endpoint
- `POST /chat/stream` — Streaming responses
- `POST /ai` — AI requests
- `POST /dani/chat` — Dani tutor chat
- `GET /dani/history` — Chat history

**Dependencies:** supabase, deepseek client, daniOrchestrator

**Implementation notes:**
- Extract routes 144-203, 204-343, 1512-1551, 1595-1762
- Import helpers from utils/api
- Re-export as `chatRoutes`

#### 2. parental-consent.js (lines 417–686 in original)
**Routes:**
- `POST /parental-consent` — Create consent request
- `POST /parental-consent/verify` — Verify with token
- `GET /parental-consent/status` — Check status
- `GET /parental-consent/verify` — Email link verification

**Dependencies:** supabase, email service, crypto

**Implementation notes:**
- Extract routes 417-478, 509-537, 545-578, 586-686
- Includes HTML email verification page
- Re-export as `parentalConsentRoutes`

#### 3. student-profile.js (lines 968–1256 in original)
**Routes:**
- `GET /student-profile` — Get profile
- `PUT /student-profile` — Update profile
- `POST /student-profile/avatar` — Upload avatar
- `DELETE /delete-user-data` — Data deletion

**Dependencies:** supabase, file storage

**Implementation notes:**
- Extract routes 968-1064, 1065-1189, 1190-1256, 889-967
- Avatar upload logic
- GDPR compliance (data deletion)
- Re-export as `studentProfileRoutes`

#### 4. progress.js (lines 1257–1470 in original)
**Routes:**
- `GET /student-progress` — Get progress
- `POST /student-progress` — Update progress
- `GET /student-grades` — Get grades
- `POST /student-grades` — Update grades
- `GET /improvement-plan` — Get plan
- `PUT /improvement-plan` — Update plan

**Dependencies:** supabase, analytics

**Implementation notes:**
- Extract routes 1257-1297, 1298-1346, 1347-1392, 1393-1441, 1442-1470, 1471-1511
- Grade calculation logic
- Re-export as `progressRoutes`

#### 5. adaptive.js (lines 1763–1864 in original)
**Routes:**
- `GET /adaptive/state` — Student state
- `GET /adaptive/next-action` — Next recommendation
- `POST /adaptive/daily-plan` — Daily plan
- `POST /adaptive/weekly-plan` — Weekly plan
- `POST /adaptive/recommendations` — All recommendations
- `GET /adaptive/mastery` — Mastery levels
- `POST /adaptive/mastery` — Update mastery
- `GET /adaptive/warnings` — Early warnings
- `POST /adaptive/warnings/:id/resolve` — Resolve warning

**Dependencies:** adaptiveLearning service, competencyMastery service

**Implementation notes:**
- Extract routes 1763-1827, 1790-1808, 1809-1827, 1828-1849, 1850-1863, 1864-1897, 1933-1977, 1949-1977
- Learning engine integration
- Re-export as `adaptiveRoutes`

#### 6. parent-insights.js (lines 1898–1933 in original)
**Routes:**
- `GET /parent/insights` — Parent insights
- `GET /parent/learning-graph` — Learning graph summary

**Dependencies:** parentInsights service, learningGraph

**Implementation notes:**
- Extract routes 1898-1913, 1914-1932
- Parent dashboard data
- Re-export as `parentInsightsRoutes`

#### 7. gamification.js (lines 1979–2019 in original)
**Routes:**
- `GET /gamification/missions` — Get missions
- `POST /gamification/activity` — Log activity
- `GET /gamification/badges` — Get badges

**Dependencies:** missionEngine, badgeEngine

**Implementation notes:**
- Extract routes 1979-1992, 1993-2006, 2007-2019
- Gamification services
- Re-export as `gamificationRoutes`

#### 8. core.js (lines 57–143, 2020–2100 in original)
**Routes:**
- `GET /data/:userId` — SmartBoard data
- `GET /progress/:userId` — Progress data
- `GET /wellbeing-status` — Wellbeing
- `POST /weekly-report` — Weekly report
- `GET /competencies` — List competencies
- `GET /user-role` — User role
- `POST /timetable` — Timetable

**Dependencies:** supabase, analytics

**Implementation notes:**
- Extract core data endpoints
- General SmartBoard functions
- Re-export as `coreRoutes`

#### 9. index.js (NEW)
```javascript
/**
 * smartboard/index.js — Route aggregator
 * Centralizes all SmartBoard routes from submodules
 */

const express = require('express');
const router = express.Router();

// Import all route handlers
const { chatRoutes } = require('./chat');
const { parentalConsentRoutes } = require('./parental-consent');
const { studentProfileRoutes } = require('./student-profile');
const { progressRoutes } = require('./progress');
const { adaptiveRoutes } = require('./adaptive');
const { parentInsightsRoutes } = require('./parent-insights');
const { gamificationRoutes } = require('./gamification');
const { coreRoutes } = require('./core');

// Mount all routes
router.use(chatRoutes);
router.use(parentalConsentRoutes);
router.use(studentProfileRoutes);
router.use(progressRoutes);
router.use(adaptiveRoutes);
router.use(parentInsightsRoutes);
router.use(gamificationRoutes);
router.use(coreRoutes);

module.exports = router;
```

---

## Implementation Checklist

### Phase 1: Create Structure (Session 5)
- [ ] Create `routes/smartboard/` directory
- [ ] Create `index.js` (router aggregator)
- [ ] Create empty placeholder files (chat.js, parental-consent.js, etc.)

### Phase 2: Extract Routes (Session 5-6)
- [ ] Extract chat.js (143 lines, ~1 hour)
- [ ] Extract parental-consent.js (270 lines, ~2 hours)
- [ ] Extract student-profile.js (320 lines, ~2 hours)
- [ ] Extract progress.js (220 lines, ~1.5 hours)

### Phase 3: Extract Routes Continued (Session 6)
- [ ] Extract adaptive.js (180 lines, ~1.5 hours)
- [ ] Extract parent-insights.js (90 lines, ~45 min)
- [ ] Extract gamification.js (90 lines, ~45 min)
- [ ] Extract core.js (220 lines, ~1.5 hours)

### Phase 4: Integration & Testing (Session 6)
- [ ] Update `app.js` to import from `smartboard/` instead of `smartboard.js`
- [ ] Remove old `smartboard.js` file
- [ ] Run tests: `npm test -- smartboard`
- [ ] Smoke test all routes
- [ ] Verify no regressions

---

## Acceptance Criteria

- [ ] No `smartboard.js` file exceeds 300 lines
- [ ] No `auth.js` file exceeds 300 lines
- [ ] Each module has single responsibility (one domain)
- [ ] All tests pass: `npm test`
- [ ] All routes respond correctly
- [ ] No code duplication between modules
- [ ] README or comments explain module structure
- [ ] Imports/exports clean and clear

---

## Testing Strategy

### Unit Tests
```bash
npm test -- smartboard
npm test -- auth
```

### Smoke Tests
```bash
# Test each endpoint
curl http://localhost:3000/api/smartboard/data/user123
curl http://localhost:3000/api/smartboard/student-profile
curl http://localhost:3000/api/smartboard/adaptive/state
```

### Integration Tests
```bash
# Full flow: login → profile → progress → adaptive
npm test -- routes/smartboard
npm test -- routes/auth
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Import path breaks | Medium | High | Test all routes immediately |
| Circular dependency | Low | High | Audit imports before integration |
| Missing dependencies | Medium | Medium | Extract with full context |
| Regression in functionality | Medium | High | Comprehensive smoke tests |

---

## Time Estimate

**Total for smartboard.js refactoring:** 8-10 hours  
**Breakdown:**
- Setup: 30 min
- Extract & split: 5-6 hours
- Testing & fixes: 2-3 hours
- Final cleanup: 30 min

**Realistic timeline:** 2 sessions (Session 5-6)

---

## After smartboard.js: auth.js Refactoring

Similar process for `auth.js` (1,012 lines):

```
auth/
├── index.js — router aggregator
├── register.js (200 lines) — User registration
├── login.js (250 lines) — Login flow
├── oauth.js (280 lines) — OAuth integration
├── password.js (130 lines) — Password reset
└── verification.js (110 lines) — Email verification
```

**Estimated time:** 6-8 hours (similar complexity)

---

## Code Quality Gates

After refactoring, verify:
- [ ] ESLint: 0 errors
- [ ] No circular imports: `npm run build`
- [ ] All tests pass: `npm test`
- [ ] File sizes: each <300 lines
- [ ] Code duplication check: `npm run duplicate-check` (if available)
- [ ] Documentation: README explaining module structure

---

## Ready for Session 5

This plan is complete and ready to execute. No prior work needed — just follow the checklist sequentially.

**Start with:** Phase 1 (create directory structure) — takes 30 min, unblocks the real work.

---

*Plan created: Sep 3, 2026 | Ready to execute: Session 5 | Estimated completion: Session 6*
