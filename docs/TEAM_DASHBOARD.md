# Team Dashboard & Operations Guide

Complete operations guide for EdutechLife team coordination, daily standups, and performance tracking.

## Table of Contents

1. [Daily Operations](#daily-operations)
2. [Weekly Review](#weekly-review)
3. [Monthly Review](#monthly-review)
4. [Team Metrics](#team-metrics)
5. [Communication Protocols](#communication-protocols)

---

## Daily Operations

### Morning Standup Checklist

**Time**: 09:00 AM (UTC-5 Colombia Time)
**Duration**: 15 minutes
**Participants**: All development team members

#### Pre-Standup (Admin)
- [ ] Check overnight alerts in Sentry and backend logs
- [ ] Review any critical GitHub issues created after 5 PM
- [ ] Check parent alert queue for unresolved P0/P1 cases
- [ ] Verify staging environment health
- [ ] Pull latest metrics from PostHog

#### Standup Format (5 min per person)

Each team member reports:

1. **Yesterday's Completed**
   - Feature/bug completed
   - Tests added
   - Deployment made

2. **Today's Plan**
   - Main task focus
   - Dependencies needed
   - Expected blockers

3. **Blockers**
   - Technical issues
   - External dependencies
   - Team needs

**Example Standup Report**:
```
IALab Frontend Lead:
- Yesterday: Completed Valerio TTS queue optimization (PR #342)
- Today: Integrating voice feedback UI component, need backend metrics endpoint
- Blocker: Waiting on parent alerts service response format clarification
```

#### Post-Standup (Admin)
- [ ] Log action items in GitHub project board
- [ ] Create GitHub issues for blockers
- [ ] Assign owners and due dates
- [ ] Update team status page

### Active Incidents Tracking

**Real-time During Day**:
- Monitor `#alerts` Slack channel
- Check Sentry dashboard for spike in errors
- Track parent alert resolution time (target: <2h for P0)
- Monitor backend memory/CPU usage

**Metrics to Track**:
| Metric | Target | Action |
|--------|--------|--------|
| Error rate | <1% | Alert if >5% |
| API latency p95 | <500ms | Alert if >2s |
| Student login success | >99% | Alert if <98% |
| Parent alerts resolved | <2h | Escalate if >4h |
| Uptime | >99.9% | Post-incident review if <99% |

### End-of-Day Checklist (Lead/On-Call)

- [ ] Review unresolved issues from standup
- [ ] Close completed GitHub issues
- [ ] Update PR review status
- [ ] Check if any deployment needed for tomorrow
- [ ] Document any on-call incidents
- [ ] Prepare staging environment for next day

---

## Weekly Review

**Time**: Friday 4 PM
**Duration**: 45 minutes
**Attendees**: Lead, backend lead, frontend lead, product manager

### Weekly Metrics Report

#### Engineering Velocity

```
Week of [DATE]
Total Story Points Completed: ___
PRs Merged: ___
Bugs Fixed: ___
Features Shipped: ___
```

**Breakdown by Module**:
- IALab: ___ points
- SmartBoard: ___ points
- Admin/Operations: ___ points
- Infrastructure: ___ points

#### Quality Metrics

| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| Test Coverage | __% | __% | ↑/↓ |
| Bug Escape Rate | __% | __% | ↑/↓ |
| Code Review Time | __ hrs | __ hrs | ↑/↓ |
| Incident Count | __ | __ | ↑/↓ |

#### User Engagement (from PostHog)

| Metric | Value | Target |
|--------|-------|--------|
| DAU (IALab) | __ | 500+ |
| DAU (SmartBoard) | __ | 200+ |
| Feature Adoption Rate | __% | 60%+ |
| Parent Engagement | __% | 70%+ |
| Lesson Completion Rate | __% | 75%+ |

#### Deployment Summary

```
Staging Deployments: __
Production Deployments: __
Rollbacks: __
Deployment Success Rate: __%
Average Deployment Time: __ mins
```

**List of PRs Merged**:
- [ ] PR #___ - [Feature/Bug] - [Owner]
- [ ] PR #___ - [Feature/Bug] - [Owner]
- [ ] PR #___ - [Feature/Bug] - [Owner]

### Backlog Grooming

- [ ] Review and prioritize top 10 issues
- [ ] Update story point estimates
- [ ] Identify blockers or dependencies
- [ ] Plan for next sprint

### Risk Assessment

**Current Risks**:
1. [Risk] - Impact: [High/Med/Low] - Mitigation: [Action]
2. [Risk] - Impact: [High/Med/Low] - Mitigation: [Action]
3. [Risk] - Impact: [High/Med/Low] - Mitigation: [Action]

### Team Health

- **Morale**: 1-5 scale ___
- **Workload**: 1-5 scale (1=light, 5=overloaded) ___
- **Blockers**: [List any team-wide issues]
- **Celebrations**: [Wins to celebrate]

---

## Monthly Review

**Time**: Last Friday of month, 3 PM
**Duration**: 90 minutes
**Attendees**: Full team + leadership

### Monthly Performance Summary

#### Key Achievements
- [Feature/Launch] - Impact: [What it enables]
- [Bug Fix] - Affects [# users/systems]
- [Performance] - Improvement: [% or metric]

#### Financial Impact (if applicable)
- Estimated revenue from new features: $___
- Cost savings from optimizations: $___
- Cost of infrastructure: $___

### User Metrics Deep Dive

**Overall Growth**:
```
Last Month    This Month    Growth %
MAU: ___      MAU: ___      ___%
DAU: ___      DAU: ___      ___%
Paying: ___   Paying: ___   ___%
```

**By Product**:
- **IALab**: [Usage trends, completion rates, engagement]
- **SmartBoard**: [Usage trends, parent engagement, learning outcomes]
- **Admin Dashboard**: [Institution adoption, data accuracy]

**Cohort Analysis**:
- New users retention (Day 7): ___%
- New users retention (Day 30): ___%
- Churn rate: ___%

### Technical Health Report

| Category | Status | Trend |
|----------|--------|-------|
| System Uptime | __% | ↑/↓ |
| Incident Count | __ | ↑/↓ |
| MTTR (Mean Time to Resolution) | __ hrs | ↑/↓ |
| Security Vulnerabilities | __ | ↑/↓ |
| Tech Debt Score | __ | ↑/↓ |

**Incident Postmortems**:
- [Incident] - Root Cause: [Cause] - Action Items: [List]

### Product Roadmap Review

- [ ] Current quarter progress: ____%
- [ ] On-track features: [List]
- [ ] At-risk features: [List]
- [ ] Proposed adjustments: [List]

### Team Development

- **Training/Learning**: [Courses taken, skills acquired]
- **Promotions/Changes**: [Team changes]
- **Hiring Needs**: [Roles to fill]

### Customer Feedback Summary

- **NPS Score**: ___
- **Top Requests**: [Feature requests from users]
- **Top Complaints**: [Issues from customer feedback]
- **Response Actions**: [What we're doing about feedback]

---

## Team Metrics

### Automated Dashboards

All metrics are automatically collected and available in PostHog:

**URL**: [Your PostHog project URL]

**Key Insights to Monitor**:
1. Daily Active Users (DAU) by product
2. Feature adoption (% using specific features)
3. User journey funnels
4. Retention cohorts

### Engineering Metrics

**Velocity Tracking**:
- Track in: GitHub Projects board
- Measure: Story points per week
- Target: Consistent velocity within ±20%

**Code Quality**:
- Test coverage: Target 75%+
- Code review time: Target <24h
- Deployment frequency: Target 1-2x per week

**Incident Metrics**:
- MTTR (Mean Time to Resolution): Target <4 hours
- MTTF (Mean Time to Failure): Target >30 days
- Incident severity distribution: Mostly P3-P4

### Business Metrics

**Acquisition**:
- New institutions/students per week
- Trial-to-paid conversion rate
- Customer acquisition cost

**Retention**:
- Monthly churn rate
- Feature usage frequency
- NPS (Net Promoter Score)

**Monetization**:
- MRR (Monthly Recurring Revenue)
- ARPU (Average Revenue Per User)
- Upgrade rate (freemium → premium)

---

## Communication Protocols

### Slack Channels

| Channel | Purpose | Members |
|---------|---------|---------|
| #standup | Daily 9 AM | All team |
| #alerts | P0/P1 incidents | All team + on-call |
| #dev | General development | Dev team |
| #deployments | Release notifications | Dev + ops |
| #customer-issues | User-facing bugs | Product + dev lead |

### Escalation Paths

**By Severity**:

**P0 (Critical - System Down)**
1. Immediate: Notify on-call engineer
2. Message: `#alerts` channel with status page
3. Action: Start incident response (see ESCALATION_PROCEDURES.md)
4. Owner: On-call engineer

**P1 (High - Major Feature Broken)**
1. Within 30 min: Notify engineering lead
2. Create: GitHub issue with `urgent` label
3. Action: Investigate and implement fix
4. Owner: Assigned engineer

**P2 (Medium - Feature Partially Broken)**
1. Within 2 hours: Notify product team
2. Create: GitHub issue with `bug` label
3. Action: Plan fix in next 2-week sprint
4. Owner: Assigned to sprint

**P3 (Low - Minor Issues)**
1. Next business day: Triage and prioritize
2. Create: GitHub issue for backlog
3. Action: Address in future sprint
4. Owner: Backlog priority queue

### On-Call Rotation

**Schedule**: Weekly rotation (Monday-Sunday)
**Primary**: Main on-call engineer
**Backup**: Secondary on-call

**On-Call Responsibilities**:
- [ ] Monitor `#alerts` channel
- [ ] First responder for P0/P1 incidents
- [ ] Own incident documentation
- [ ] Handoff to next on-call at end of week

**On-Call Handoff**:
- [ ] Current on-call creates handoff meeting
- [ ] Review any active incidents
- [ ] Share any known issues or gotchas
- [ ] New on-call confirms readiness

### Decision-Making Framework

**Technical Decisions** (>3 days work):
1. Create design doc in GitHub discussions
2. Tag affected team members
3. Wait for 24h feedback period
4. Document decision in PR

**Feature Decisions** (>2 weeks work):
1. Product spec document
2. Engineering review meeting
3. Timeline and resource estimates
4. Decision in leadership team

**Emergency Decisions** (Production outage):
1. On-call makes immediate decision
2. Implement fix or rollback
3. Notify leadership via Slack
4. Postmortem within 24 hours

---

## Resources

- **GitHub Project Board**: [Link]
- **Sentry Dashboard**: [Link]
- **PostHog Analytics**: [Link]
- **Status Page**: [Link]
- **Deployment Guide**: See RELEASE_MANAGEMENT.md
- **Incident Response**: See ESCALATION_PROCEDURES.md
