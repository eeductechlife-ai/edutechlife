# SmartBoard Service → DB Dependency Map

**Date:** 2026-09-01  
**Branch:** `recovery/foundation-phase-a`  
**Method:** `grep .from()` across backend services, routes, and frontend hooks  
**Environment audited:** PRODUCTION (`srirrwpgswlnuqfgtule`)

---

## 1. Service → Table Matrix

### Backend Services (`edutechlife-backend/src/services/`)

| Service | Tables Referenced | Tables Exist in Prod? |
|---------|-------------------|----------------------|
| **adaptiveLearning.js** | students ✅, sessions ❌, learning_streaks ✅, student_competency_mastery ✅, learning_plans ✅, learning_content ✅, recommendations ✅, grade_analyses ✅ | 7/8 |
| **competencyMastery.js** | student_competency_mastery ✅ | 1/1 |
| **daniOrchestrator.js** | students ✅, dani_memory ✅, learning_plans ✅, student_competency_mastery ✅, student_timetable ✅, timetable_slots ✅ | 6/6 |
| **earlyWarning.js** | early_warnings ✅, learning_streaks ✅, student_competency_mastery ✅ | 3/3 |
| **parentInsights.js** | students ✅, sessions ❌, dani_memory ✅, learning_plans ✅, student_competency_mastery ✅ | 4/5 |
| **missionEngine.js** | missions ✅, student_missions ✅ | 2/2 |
| **badgeEngine.js** | badges ✅, student_badges ✅, student_missions ✅, student_competency_mastery ✅, learning_streaks ✅ | 5/5 |
| **predictionService.js** | parent_student_links ✅*, student_risk_scores ❌, predictive_alerts ❌, learning_gap_predictions ❌, alert_actions ❌ | 1/5 |
| **parentAlertsService.js** | parent_alerts ❌ | 0/1 |
| **parentChatService.js** | students ✅, points_history ❌, learning_streaks ✅, student_risk_scores ❌, student_achievements ❌, parent_dani_conversations ❌, conversation_messages ❌, conversation_summaries ❌ | 2/8 |
| **metricsService.js** | users ✅, feature_usage ❌†, lesson_attempts ❌†, user_sessions ❌†, parent_dashboard_views ❌† | 1/5 |
| **multiplayerService.js** | leaderboards ❌, competition_events ❌, competition_participants ❌, student_competition_stats ❌ | 0/4 |
| **achievementService.js** | achievements ❌, student_achievements ❌, achievement_stats ❌, points_history ❌, learning_streaks ✅, leaderboards ❌, missions_completed ❌ | 1/7 |
| **aiSafetyGateway.js** | *(no DB queries)* | n/a |
| **crisisDetection.js** | *(no DB queries — logic only)* | n/a |
| **weeklyReport.js** | *(no DB queries — logic only)* | n/a |

\* parent_student_links exists but was hand-created (no `id` column)  
† No migration exists — stub service

### Backend Routes (`edutechlife-backend/src/routes/smartboard.js`)

| Table Referenced | Exists? | Used For |
|-----------------|---------|----------|
| students | ✅ | Profile, data, progress |
| users | ✅ | Auth lookup |
| parent_consents | ❌ | Consent flow |
| parent_student_links | ✅* | Parent-child verification |
| smartboard_kids_data | ✅* | Kids dashboard data |
| avatars | ❌ | Avatar uploads |
| crisis_alerts | ❌ | Crisis reporting |
| early_warnings | ✅ | Warning system |

### Frontend Hooks (`edutechlife-frontend/src/hooks/smartboard/`)

| Table Referenced | Exists? | Used For |
|-----------------|---------|----------|
| students | ✅ | Student data |
| sessions | ❌ | Session tracking |
| missions | ✅ | Mission display |
| rewards | ✅ | Reward display |
| student_sessions | ❌ | Session history |

---

## 2. Table Classification

### CORE — Required for basic SmartBoard operation
| Table | Migration | Service(s) | Status |
|-------|-----------|------------|--------|
| sessions | 011/059 | adaptiveLearning, parentInsights, frontend | ❌ Missing |
| parent_consents | 008 | smartboard.js consent routes | ❌ Missing |
| points_history | 011/059 | parentChatService, achievementService | ❌ Missing |
| conversations | 011/059 | (session-related) | ❌ Missing |
| crisis_alerts | 009/059 | smartboard.js routes | ❌ Missing |
| academic_context | 011/059 | (session triggers) | ❌ Missing |

### SUPPORT — Enhance features, not blocking basic flow
| Table | Migration | Service(s) | Status |
|-------|-----------|------------|--------|
| achievements | 011/059 | achievementService | ❌ Missing |
| student_achievements | 035/059 | parentChatService, achievementService | ❌ Missing |
| achievement_stats | 035/059 | achievementService | ❌ Missing |
| achievement_categories | 035/059 | (schema support) | ❌ Missing |
| parent_alerts | 033 | parentAlertsService | ❌ Missing |
| avatars | none | smartboard.js routes | ❌ Missing |

### SUPPORT — Predictions subsystem (migration 037)
| Table | Service(s) | Status |
|-------|------------|--------|
| student_risk_scores | predictionService, parentChatService | ❌ Missing |
| predictive_alerts | predictionService | ❌ Missing |
| learning_gap_predictions | predictionService | ❌ Missing |
| alert_actions | predictionService | ❌ Missing |

### SUPPORT — Parent chat subsystem (migration 038)
| Table | Service(s) | Status |
|-------|------------|--------|
| parent_dani_conversations | parentChatService | ❌ Missing |
| conversation_messages | parentChatService | ❌ Missing |
| conversation_summaries | parentChatService | ❌ Missing |

### SUPPORT — Multiplayer/competitive (migration 036)
| Table | Service(s) | Status |
|-------|------------|--------|
| leaderboards | multiplayerService, achievementService | ❌ Missing |
| competition_events | multiplayerService | ❌ Missing |
| competition_participants | multiplayerService | ❌ Missing |
| student_competition_stats | multiplayerService | ❌ Missing |

### EXPERIMENTAL — Stub service, no migration exists
| Table | Service | Status |
|-------|---------|--------|
| feature_usage | metricsService | ❌ No migration |
| lesson_attempts | metricsService | ❌ No migration |
| user_sessions | metricsService | ❌ No migration |
| parent_dashboard_views | metricsService | ❌ No migration |
| missions_completed | achievementService | ❌ No migration |

### IALAB — Not SmartBoard tables
*(None of the missing tables are IALab-specific)*

### DEAD — Not referenced in current code
*(None identified — all missing tables have at least one service reference)*

---

## 3. Impact by Service Readiness

| Service | Readiness | Blocking Tables |
|---------|-----------|-----------------|
| daniOrchestrator | **READY** (6/6 tables exist) | None |
| competencyMastery | **READY** (1/1) | None |
| earlyWarning | **READY** (3/3) | None |
| missionEngine | **READY** (2/2) | None |
| badgeEngine | **READY** (5/5) | None |
| adaptiveLearning | **PARTIAL** (7/8) | sessions |
| parentInsights | **PARTIAL** (4/5) | sessions |
| predictionService | **BLOCKED** (1/5) | 4 tables (migration 037) |
| parentAlertsService | **BLOCKED** (0/1) | parent_alerts (migration 033) |
| parentChatService | **BLOCKED** (2/8) | 6 tables (migrations 036-038) |
| metricsService | **BLOCKED** (1/5) | 4 tables (no migration) |
| multiplayerService | **BLOCKED** (0/4) | 4 tables (migration 036) |
| achievementService | **BLOCKED** (1/7) | 6 tables (migrations 035/059) |
