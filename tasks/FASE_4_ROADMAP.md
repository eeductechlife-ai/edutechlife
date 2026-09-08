# Fase 4 Roadmap — Recommended Sequence

**Date:** 2026-09-05  
**Previous:** Fase 3 Complete & Live ✅  
**Status:** Planning optimal work order

---

## Dependency Analysis

### What Fase 3 Enabled
- ✅ `sessions` table → real-time student activity
- ✅ `academic_context` table → subject progress tracking
- ✅ `achievements` table → badge system
- ✅ `crisis_alerts` table → already existed, now queryable
- ✅ Database triggers → auto-consistency

### Fase 4 Feature Dependencies

```
                        Fase 3 Data Ready
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    Parent Notifications  Teacher Dashboard  Valeria Analytics
      (sessions)          (sessions +        (sessions +
     (crisis_alerts)       academic_context)  academic_context)
            │                │                │
            └────────────────┼────────────────┘
                             │
                    IALab UX Polish
                    (independent)
```

---

## Recommended Sequence

### **Phase 4.1: Parent Notifications** (2-3 days) 🥇 **START HERE**

**Why First:**
- ✅ Highest safety impact (crisis alerts → immediate parent notification)
- ✅ Lowest dependency complexity (only `crisis_alerts` + email service)
- ✅ Fastest to market (quick win, measurable value)
- ✅ Sets template for other notifications (Teacher Dashboard, Analytics)

**What's needed:**
```
Backend:
  - Query `crisis_alerts` table (already exists)
  - Trigger email/push on new crisis alert
  - Track notification delivery status

Frontend:
  - Notification preferences UI (opt-in/opt-out)
  - Notification history view

Database:
  - `notification_logs` table (tracks sent notifications)
  - `parent_preferences` table (email/push/sms channels)
```

**User journey:**
1. Parent receives email: "Alert: Your child needs help in Math"
2. Clicks link → Dashboard shows early warning details
3. Marks as reviewed → System stops repeating alert

**Estimated scope:** 8-10 tasks

---

### **Phase 4.2: Teacher Dashboard** (3-4 days) 🥈 **THEN THIS**

**Why Second:**
- ✅ Depends on Fase 3 data (`sessions` + `academic_context`)
- ✅ Builds on Parent Notifications template (reuse notification patterns)
- ✅ High value for daily engagement tracking
- ✅ Natural progression (parent insights → teacher insights)

**What's needed:**
```
Backend:
  - Query `sessions` per teacher's students
  - Calculate engagement metrics (% time, subjects, streaks)
  - Query `academic_context` for performance levels
  - API endpoints for dashboard data

Frontend:
  - Dashboard grid (student cards, engagement %age)
  - Trend charts (time spent, performance over time)
  - Filter/sort by subject, performance level
  - Click-through to student detail view

Database:
  - `teacher_students` junction table (who teaches whom)
  - View for aggregated metrics
```

**User journey:**
1. Teacher logs in → Sees all their students on dashboard
2. Color-coded by performance (red/yellow/green)
3. Clicks student → Sees session history + subject breakdown
4. Can send notification to parent from here

**Estimated scope:** 10-12 tasks

---

### **Phase 4.3: Valeria Analytics** (3-4 days) 🥉 **THEN THIS**

**Why Third:**
- ✅ Depends on Fase 3 data (institutional-level aggregation)
- ✅ Builds on Teacher Dashboard patterns (reuse charting, filtering)
- ✅ Strategic reporting (admins, institutional partners)
- ✅ Less time-critical than parent/teacher features

**What's needed:**
```
Backend:
  - Aggregate queries: total sessions/day, avg performance by subject
  - Cohort analysis (grade level, age group)
  - Trend analysis (weekly/monthly growth)
  - Export to CSV/PDF

Frontend:
  - Valeria character as dashboard host
  - Key metrics summary cards
  - Interactive charts (Recharts: line, bar, pie)
  - Filters (date range, institution, grade level)
  - Export controls

Database:
  - Materialized views for fast aggregation (optional)
  - Institution metadata (name, contact, students_count)
```

**User journey:**
1. Admin opens Valeria dashboard
2. Sees institution overview (1000 sessions this week, +15% vs last week)
3. Drills into subject breakdown
4. Exports report for stakeholders

**Estimated scope:** 10-12 tasks

---

### **Phase 4.4: IALab UX Polish** (1-2 weeks) ⭐ **PARALLEL OR LAST**

**Why Last (or Parallel):**
- ✅ Independent of Fase 3/4 data features (pure UI improvement)
- ✅ Can happen in parallel if resources available
- ✅ Lower deadline pressure (nice-to-have vs must-have)
- ✅ 12-task sprint (substantial scope)

**What's needed:**
```
Frontend:
  - Responsive design improvements (mobile, tablet)
  - Accessibility audit & fixes (a11y, keyboard nav)
  - Dark mode polish
  - Component library refactoring
  - Animation/transitions (Framer Motion)
  - Error state designs

Backend:
  - None (UI-only work)

Database:
  - Optional: User preferences table (theme, language)
```

**Examples:**
- Dani chat interface polish (response formatting, streaming)
- Module/lesson navigation (breadcrumbs, progress bar)
- Better error messages (not just "Error occurred")
- Dark mode across all pages

**Estimated scope:** 12 tasks

---

## Timeline & Resource Plan

### Option A: Sequential (Recommended)
```
Week 1:  Fase 4.1 Parent Notifications (Mon-Wed)  ✅ Done
         Fase 4.2 Teacher Dashboard prep (Thu)     
Week 2:  Fase 4.2 Teacher Dashboard (Mon-Tue)     ✅ Done
         Fase 4.3 Valeria Analytics prep (Wed)    
Week 3:  Fase 4.3 Valeria Analytics (Mon-Tue)     ✅ Done
         Fase 4.4 IALab UX Polish begins (Wed)   
Week 4:  Fase 4.4 IALab UX Polish (Mon-Fri)       ✅ Done

Total: 4 weeks for all 4 features
```

### Option B: Parallel (If Resources Available)
```
Week 1:  Fase 4.1 Parent Notifications            ✅ Done
         + Fase 4.4 IALab UX Polish (team A + B) 
Week 2:  Fase 4.2 Teacher Dashboard               ✅ Done
         + Fase 4.4 IALab UX Polish (team A + B) 
Week 3:  Fase 4.3 Valeria Analytics               ✅ Done
         + Fase 4.4 IALab UX Polish (team A + B) 
Week 4:  Final polish & monitoring

Total: 3-4 weeks for all 4 features
```

---

## Dependency Chain Breakdown

### Fase 4.1: Parent Notifications
- ✅ `crisis_alerts` table ready (Fase 3)
- ⏳ Email service (SendGrid, Mailgun, or backend SMTP)
- ⏳ Push notification service (Firebase Cloud Messaging, OneSignal)
- 🆕 `notification_logs` table (to track sent notifications)

**Blockers:** None (email service can be any provider)

### Fase 4.2: Teacher Dashboard
- ✅ `sessions` table ready (Fase 3)
- ✅ `academic_context` table ready (Fase 3)
- ⏳ Charting library (Recharts or Chart.js)
- 🆕 `teacher_students` junction table (RBAC mapping)

**Blockers:** Need to know teacher-student relationships (ask product/ops)

### Fase 4.3: Valeria Analytics
- ✅ `sessions` table ready (Fase 3)
- ✅ `academic_context` table ready (Fase 3)
- ⏳ Charting library (shared with Teacher Dashboard)
- 🆕 Institution metadata table (optional optimization)

**Blockers:** Need institution data structure (ask product)

### Fase 4.4: IALab UX Polish
- ✅ All frontend components already exist
- ⏳ Design/UX review (optional, can reuse existing)
- No database changes needed

**Blockers:** None

---

## Critical Path

The fastest route to delivering all value:

```
1. Parent Notifications (critical for safety)      ← START HERE
   ↓
2. Teacher Dashboard (enables engagement tracking)
   ↓
3. Valeria Analytics (enables strategic decisions)
   ↓
4. IALab UX Polish (nice-to-have, can overlap)
```

**Why this order:**
1. **Parent Notifications first** → Immediate safety value, unblocks other features
2. **Teacher Dashboard second** → Uses same infrastructure, natural next step
3. **Valeria Analytics third** → Builds on Teacher Dashboard patterns
4. **IALab UX last** → Can happen in parallel, doesn't block other features

---

## Resource Requirements

### Team Composition (Estimated)
| Role | Phase 4.1 | 4.2 | 4.3 | 4.4 | Total |
|------|-----------|-----|-----|-----|-------|
| Backend | 1.5 days | 2 days | 1.5 days | — | 5 days |
| Frontend | 1 day | 2 days | 1.5 days | 5 days | 9.5 days |
| Database | 0.5 days | 0.5 days | 0.5 days | — | 1.5 days |
| **Total** | **3 days** | **4.5 days** | **3.5 days** | **5 days** | **16 days** |

---

## Success Criteria (Per Phase)

### Fase 4.1: Parent Notifications ✅
- [ ] Parent receives email on crisis alert within 2 min
- [ ] Notification includes student name + alert type + action link
- [ ] Parent can opt out of notifications
- [ ] Notification log tracks delivery + open rate
- [ ] Works with production email service

### Fase 4.2: Teacher Dashboard ✅
- [ ] Teacher sees all students (filtered by assigned class)
- [ ] Dashboard shows: sessions/week, avg performance, subjects studied
- [ ] Color coding: red (needs help), yellow (okay), green (strong)
- [ ] Click student → See session history + subject breakdown
- [ ] Can send notification to parent from student detail view
- [ ] Performance under 2s for 50+ students

### Fase 4.3: Valeria Analytics ✅
- [ ] Admin sees institution overview: total sessions, avg performance
- [ ] Charts show trends (weekly/monthly)
- [ ] Filters work: date range, grade level, subject
- [ ] Export to PDF/CSV works
- [ ] Performance under 3s for 1000+ rows

### Fase 4.4: IALab UX Polish ✅
- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] Dark mode works across all pages
- [ ] a11y score > 90 (Lighthouse)
- [ ] No console errors in browser DevTools
- [ ] Animation performance smooth (60 FPS)

---

## Recommendation

**Start with Phase 4.1: Parent Notifications**

**Why:**
1. ✅ Highest impact (student safety)
2. ✅ Fastest delivery (2-3 days)
3. ✅ Lowest complexity (crisis_alerts already in DB)
4. ✅ Sets foundation for other notifications
5. ✅ Quick win for stakeholder confidence

**Next:** Once Phase 4.1 is live, proceed to Phase 4.2 (Teacher Dashboard).

---

## Questions for Product/Ops Team

Before starting Fase 4.1:
1. **Email provider:** Which service? (SendGrid, Mailgun, AWS SES, in-house SMTP?)
2. **Notification channels:** Email only, or also push/SMS?
3. **Crisis alert rules:** What triggers an alert? (Custom fields in `crisis_alerts` table?)

Before starting Fase 4.2:
1. **Teacher-student mapping:** How are assignments stored? (existing table or new?)
2. **Class/cohort structure:** How do we define "teacher's students"?

Before starting Fase 4.3:
1. **Institution data:** Do we have institution table? (for multi-tenant analytics)
2. **Export formats:** PDF only, or also CSV, Excel?

---

## Next Action

**Approve this sequence?**
- ✅ Fase 4.1 → Parent Notifications (start immediately)
- ✅ Fase 4.2 → Teacher Dashboard (after 4.1)
- ✅ Fase 4.3 → Valeria Analytics (after 4.2)
- ✅ Fase 4.4 → IALab UX Polish (parallel or last)

**Or request different order?**

---

**Status:** Roadmap ready. Awaiting approval to begin Phase 4.1.
