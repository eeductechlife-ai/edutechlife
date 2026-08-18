# 🎓 IALab Pedagogical UX Sprint
## Implementación Pedagógica para Estudiantes 6-16 Años

**Sprint Duration:** 4 semanas (foundation → components → patterns → testing)  
**Start Date:** 2026-08-15  
**Branch:** `pedagogical-ux` (merge to `main` after verification)  
**Status:** 🚀 ACTIVO — 4 equipos en paralelo  

---

## 📊 Sprint Tracker

### Foundation (COMPLETO ✅)
- [x] useAgeAdaptiveDesign hook (3 age groups: elementary/middle/secondary)
- [x] WCAG 2.1 AA accessibility CSS (focus, contrast, touch targets)
- [x] Color tokens verified (4.5:1+ contrast for light & dark modes)
- [x] Branch setup (`pedagogical-ux`)
- [x] Coordinator activated (4 teams orchestrated)

### Week 1: Components & Accessibility (EN PROGRESO 🚀)

#### Team 1: UI Engineering
**Task:** Adaptive components (age-scaled sizing)  
**Target:** 10-15 base components  
**Deadline:** 3 días  
**Priority Components:**
- [ ] Button (adaptive touch targets: 56px/48px/44px per age)
- [ ] Input (adaptive font size + label)
- [ ] Card (adaptive spacing + border-radius)
- [ ] Header (adaptive logo size + navigation)
- [ ] Sidebar (adaptive widths + icon sizing)
- [ ] Modal (adaptive padding + font sizing)
- [ ] Badge (adaptive sizing for achievements)
- [ ] Tab Navigation (adaptive spacing)
- [ ] Checkbox/Radio (adaptive sizes)
- [ ] Dropdown (adaptive hit areas)

**Definition of Done:**
- ✅ Uses `useAgeAdaptiveDesign()` hook
- ✅ Responsive (mobile 320px, tablet 768px, desktop 1440px)
- ✅ Dark mode support
- ✅ No console errors
- ✅ Tests green (0 regressions)

**PR Branch:** `feature/adaptive-components-phase-1`  
**Merge Frequency:** Daily to `pedagogical-ux`

#### Team 2: Accessibility Hardening
**Task:** WCAG 2.1 AA audit + fixes  
**Target:** 20-30 components audited  
**Deadline:** 4 días  
**Focus Areas:**
- [ ] Keyboard navigation (Tab, Escape, Enter all work)
- [ ] Focus visible indicators (outline 3px + offset)
- [ ] ARIA labels (all interactive elements)
- [ ] Touch targets (≥44px on mobile)
- [ ] Color contrast (4.5:1+ verified)
- [ ] Screen reader compatibility
- [ ] Form labels (each input has <label>)
- [ ] Skip links (accessibility)

**Deliverables:**
- Issues list (20-30 findings with severity)
- Auto-generated PRs with fixes
- Contrast verification report

**PR Branch:** `feature/a11y-hardening-phase-1`  
**Merge Frequency:** As fixes ready

#### Team 3: Performance Optimization
**Task:** Core Web Vitals baseline + optimizations  
**Target:** LCP <2.5s, INP <200ms, CLS <0.1  
**Deadline:** 3 días  
**Measurement Points:**
- [ ] LCP baseline (Largest Contentful Paint)
- [ ] INP baseline (Interaction to Next Paint)
- [ ] CLS baseline (Cumulative Layout Shift)
- [ ] Bundle size (JS + CSS)
- [ ] Image optimization
- [ ] Animation performance (60fps)

**Optimizations:**
- [ ] Lazy loading (lessons, resources)
- [ ] Code splitting (separate chunks per feature)
- [ ] Animation GPU acceleration (transform, opacity only)
- [ ] Respect prefers-reduced-motion

**PR Branch:** `feature/performance-phase-1`  
**Deliverable:** Before/after metrics report

#### Team 4: Pedagogy Patterns
**Task:** Learning-focused UI patterns  
**Target:** 5 new components  
**Deadline:** 4 días  
**Components to Build:**
- [ ] LessonLayout (progressive disclosure, one-at-a-time)
- [ ] FocusedQuizModal (quiz without distractions)
- [ ] ProgressCheckpoints (visual motivation)
- [ ] AchievementAnimation (celebration animation)
- [ ] HintSystem (progressive help)

**Design Principles:**
- ✅ Minimize cognitive load (one concept per screen)
- ✅ Progressive disclosure (details hidden by default)
- ✅ Visual motivation (badges, progress bars)
- ✅ Age-appropriate complexity
- ✅ No dark patterns (no dark UI tricks)

**PR Branch:** `feature/pedagogy-patterns-phase-1`  
**Merge Frequency:** As components complete

---

## 🎯 Success Criteria

### Week 1 Checkpoint
- [ ] 10+ adaptive components deployed
- [ ] 0 WCAG 2.1 AA violations
- [ ] Core Web Vitals <2.5s LCP
- [ ] 5 pedagogy components working
- [ ] All tests passing (0 regressions)
- [ ] Keyboard navigation 100% functional

### Overall Sprint (Week 4)
- [ ] 20+ components updated with adaptive sizing
- [ ] WCAG 2.1 AA compliance audit: 100% pass
- [ ] Core Web Vitals: LCP <2.5s, INP <200ms, CLS <0.1
- [ ] Pedagogy patterns adopted in 5+ main flows
- [ ] Dark mode fully functional (verified contrast)
- [ ] Mobile (375px), Tablet (768px), Desktop (1440px) all working
- [ ] 0 regressions (all existing tests pass)
- [ ] Keyboard navigation: Tab/Enter/Escape all working

---

## 👥 Team Coordination

### Daily Standups (15 min)
- **Time:** 10:00 AM UTC (or TBD)
- **Attendees:** All 4 team leads + coordinator
- **Topics:**
  - What's done
  - Blockers
  - Dependencies on other teams
  - Merge status

### Merge Strategy
```
feature/adaptive-components-phase-1  ─┐
feature/a11y-hardening-phase-1       ─┼─→ pedagogical-ux (daily merges)
feature/performance-phase-1          ─┤
feature/pedagogy-patterns-phase-1    ─┘

pedagogical-ux → main (when all 4 teams complete)
```

### Communication
- **Quick updates:** SendMessage in conversation
- **Blockers:** Alert coordinator immediately (SendMessage)
- **Dependencies:** Notify dependent team via SendMessage
- **PRs:** Min 1 review from pedagogy expert before merge

---

## 🔧 Technical Setup

### Branch Management
```bash
# Local dev
git checkout pedagogical-ux
git pull origin pedagogical-ux

# Team feature branches (created by team leads)
git checkout -b feature/adaptive-components-phase-1
git checkout -b feature/a11y-hardening-phase-1
git checkout -b feature/performance-phase-1
git checkout -b feature/pedagogy-patterns-phase-1

# Daily merge to coordinator branch
git checkout pedagogical-ux
git merge --no-ff feature/adaptive-components-phase-1
git push origin pedagogical-ux
```

### Testing Before Merge
```bash
npm run build              # No build errors
npm test                   # All tests pass
npm run lint              # 0 lint warnings (pedantic)
npm run a11y:audit        # Accessibility check
npm run perf:vitals       # Core Web Vitals baseline
```

### Pre-Merge Checklist
- [ ] Tests passing (0 failures)
- [ ] No console errors
- [ ] No new a11y violations
- [ ] Dark mode working
- [ ] Mobile (375px), tablet (768px), desktop (1440px) verified
- [ ] Keyboard navigation tested
- [ ] Code reviewed by peer

---

## 📁 Key Files

### Foundation (Ready)
- `edutechlife-frontend/src/hooks/useAgeAdaptiveDesign.ts` — Age-adaptive tokens
- `edutechlife-frontend/src/styles/accessibility-wcag-2.1-aa.css` — WCAG compliance

### Components to Update
- `Button.jsx`, `Input.jsx`, `Card.jsx` — Base UI
- `Header.jsx`, `Sidebar.jsx` — Layout
- `Modal.jsx`, `Dialog.jsx` — Modals
- `Badge.jsx`, `ProgressBar.jsx` — Feedback

### New Components to Create
- `LessonLayout.jsx` — Progressive disclosure
- `FocusedQuizModal.jsx` — Quiz flow
- `ProgressCheckpoints.jsx` — Learning progress
- `AchievementAnimation.jsx` — Gamification
- `HintSystem.jsx` — Help system

---

## 🚀 Team Assignments

### Team 1: UI Engineering
- **Lead:** [UI Engineer name]
- **Members:** 2-3 frontend developers
- **Slack Channel:** #ui-engineering-phase-1

### Team 2: Accessibility
- **Lead:** [A11y Auditor name]
- **Members:** 1-2 accessibility specialists
- **Slack Channel:** #accessibility-phase-1

### Team 3: Performance
- **Lead:** [Performance Lead name]
- **Members:** 1-2 performance engineers
- **Slack Channel:** #performance-phase-1

### Team 4: Pedagogy
- **Lead:** [Product Designer name]
- **Members:** 1-2 product/design
- **Slack Channel:** #pedagogy-patterns-phase-1

---

## 📞 Escalation

**Blocker?** → SendMessage to "main" with:
- What's blocked
- Why (dependency, unknown, bug, etc.)
- Estimated impact (person-days lost)
- Suggested solution

**Urgent decision needed?** → Notify coordinator immediately

---

## 🎓 Philosophy

**This sprint is about educational quality, not features.**

- ✅ Focus on learning experience (not monetization)
- ✅ Accessibility first (WCAG 2.1 AA non-negotiable)
- ✅ Pedagogy-driven design (reduce cognitive load)
- ✅ Age-appropriate UI (6yo ≠ 16yo)
- ✅ No dark patterns (keep kids engaged ethically)
- ✅ Backward compatible (existing features keep working)

**Success = Students learn better + with less friction + safely + accessibly.**

---

## 📋 Weekly Reporting Template

### Week 1 Report
```
**Completed:**
- [ ] X components updated
- [ ] Y a11y issues fixed
- [ ] Z perf optimizations done

**In Progress:**
- Component X (ETA: 2 days)
- Feature Y (ETA: 3 days)

**Blockers:**
- None / [list with impact]

**Metrics:**
- Test pass rate: X%
- WCAG violations: Y
- LCP: Z ms
```

---

**Last Updated:** 2026-08-15  
**Next Review:** Daily (coordinator syncs)  
**Status:** 🚀 ACTIVE — 4 teams rolling
