# Phase 5: Team Operations & Coordination Guide

Complete infrastructure for EdutechLife team operations, daily standups, incident response, deployment management, and metrics tracking.

## Quick Navigation

- **[Team Dashboard](./TEAM_DASHBOARD.md)** — Daily standup, weekly review, monthly review procedures
- **[Escalation Procedures](./ESCALATION_PROCEDURES.md)** — P0/P1/P2/P3 incident response runbooks
- **[Release Management](./RELEASE_MANAGEMENT.md)** — Deployment checklist, staging validation, rollback procedures
- **[Metrics & Analytics](#metrics--analytics)** — DAU/WAU/MAU tracking, feature adoption, team velocity
- **[Communication Protocols](#communication-protocols)** — Slack channels, escalation paths, on-call rotation

---

## Overview

Phase 5 implements infrastructure for team operations without any user-facing changes. The focus is on:

1. **Daily Operations**: Structured standups, incident tracking, blocker resolution
2. **Weekly Review**: Velocity tracking, QA metrics, risk assessment, backlog grooming
3. **Monthly Review**: Financial impact, product roadmap, team development, customer feedback
4. **Incident Management**: P0-P3 severity classification, escalation paths, postmortem procedures
5. **Deployment Safety**: Pre-deployment checklist, staging validation, rollback procedures, monitoring
6. **Team Metrics**: User engagement (DAU/WAU/MAU), feature adoption, retention cohorts
7. **Automated Dashboards**: Real-time visibility into application health and user behavior

---

## Components Delivered

### Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| `TEAM_DASHBOARD.md` | Daily/weekly/monthly standup checklists and metrics | All team |
| `ESCALATION_PROCEDURES.md` | Incident response runbooks by severity | Dev team + leadership |
| `RELEASE_MANAGEMENT.md` | Deployment safety procedures and checklists | Dev team + devops |
| `OPERATIONS_GUIDE.md` | This file — overview and entry point | All team |

### Backend Infrastructure

| Component | Location | Purpose |
|-----------|----------|---------|
| Metrics Service | `edutechlife-backend/src/services/metricsService.js` | Calculate engagement metrics from Supabase |
| Metrics API | `edutechlife-backend/src/routes/metrics.js` | REST endpoints for fetching metrics data |
| Route Registration | `edutechlife-backend/src/app.js` | Mounted at `/api/admin/metrics` |

### Frontend Components

| Component | Location | Purpose |
|-----------|----------|---------|
| SmartBoardMetrics | `edutechlife-frontend/src/components/adminDashboard/components/SmartBoardMetrics.jsx` | Display DAU/WAU/MAU, feature adoption, learning metrics |

---

## Metrics & Analytics

### What We Track

**User Engagement**:
- Daily Active Users (DAU) — Users with activity in last 24h
- Weekly Active Users (WAU) — Users with activity in last 7 days
- Monthly Active Users (MAU) — Users with activity in last 30 days
- Retention cohorts — Day 1, 7, 30 retention rates

**Learning Metrics**:
- Lesson completion rate — % of lessons completed
- Average session duration — Minutes per session
- Parent engagement rate — % of parents viewing child progress

**Feature Adoption**:
- Valerio Voice Assistant — % users using AI tutor feature
- Crisis Alert Notifications — % parents receiving alerts
- Parent Dashboard — % parents accessing student info
- VAK Diagnostics — % students completing learning style assessment

**Product Breakdown**:
- IALab metrics — AI literacy training platform usage
- SmartBoard metrics — Kids gamified learning platform usage

### API Endpoints

All endpoints require admin authentication and are mounted at `/api/admin/metrics`:

#### GET /engagement
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://api.edutechlife.co/api/admin/metrics/engagement?days=30"
```

Returns comprehensive engagement metrics object (see DEMO_METRICS in SmartBoardMetrics.jsx)

#### GET /active-users
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://api.edutechlife.co/api/admin/metrics/active-users?period=day"
```

Returns: `{ count: number, period: string, timestamp: string }`

#### GET /completion-rate
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://api.edutechlife.co/api/admin/metrics/completion-rate?days=30"
```

Returns: `{ completion_rate: number, period_days: number }`

#### GET /feature-adoption
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://api.edutechlife.co/api/admin/metrics/feature-adoption?feature=valerio_tts&days=30"
```

Returns: `{ feature: string, adoption_rate: number, active_users: number, total_users: number }`

#### GET /retention
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://api.edutechlife.co/api/admin/metrics/retention?days=7&period=30"
```

Returns: `{ retention_rate: number, days_after: number, period_days: number }`

#### GET /health
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://api.edutechlife.co/api/admin/metrics/health"
```

Returns system health metrics (uptime, error rate, latency, database connections)

#### POST /track-event
```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"event_name":"feature_used","user_id":"123","properties":{"feature":"valerio_tts"}}' \
  "https://api.edutechlife.co/api/admin/metrics/track-event"
```

Tracks custom analytics events (integrated with PostHog in production)

### Viewing Metrics

**In Development/Staging**:
- SmartBoardMetrics component uses demo data by default
- Set `dataSource="real"` to fetch from API
- Requires admin token in Authorization header

**In Production**:
- Access via Admin Dashboard (Valeria panel)
- Metrics automatically refresh every 5 minutes
- Historical data available via PostHog for trends

---

## Communication Protocols

### Slack Channels

| Channel | Purpose | Members |
|---------|---------|---------|
| #standup | Daily 9 AM standup notes | All team |
| #alerts | P0/P1 incidents and critical events | All team + on-call |
| #dev | General development discussion | Dev team |
| #deployments | Release notifications and deployment status | Dev + ops |
| #customer-issues | User-facing bugs and support items | Product + dev lead |

### Daily Standup (9:00 AM)

**Format**: 15-minute synchronous meeting or async Slack update

**Each person reports** (5 min max):
1. Yesterday's completed work
2. Today's plan
3. Blockers or dependencies

**Post-standup**: Action items logged in GitHub project board

**See**: [TEAM_DASHBOARD.md](./TEAM_DASHBOARD.md#morning-standup-checklist)

### Incident Escalation

**P0 (Critical)**: Immediate action
- Notify on-call engineer via phone/PagerDuty
- Post to #alerts
- Start incident bridge call (Zoom)
- Response time: <5 min to acknowledge

**P1 (High)**: Urgent
- Notify engineering lead in #dev
- Create GitHub issue with "urgent" label
- Response time: <30 min

**P2 (Medium)**: Timely
- Post to #dev for visibility
- Create GitHub issue with "bug" label
- Response time: <2 hours

**P3 (Low)**: Standard
- Create GitHub issue for backlog
- Triage next business day

**See**: [ESCALATION_PROCEDURES.md](./ESCALATION_PROCEDURES.md#severity-classification)

### On-Call Rotation

**Weekly rotation** (Monday-Sunday)
- Primary on-call: First responder for all P0/P1 incidents
- Backup on-call: Takes over if primary unreachable

**Responsibilities**:
- [ ] Monitor #alerts channel 24/7
- [ ] Respond to P0 within 5 minutes
- [ ] Document all incidents
- [ ] Handoff to next on-call at end of week

**See**: [TEAM_DASHBOARD.md](./TEAM_DASHBOARD.md#on-call-rotation)

---

## Deployment Process

### Release Schedule

- **Regular Releases**: Every 1-2 weeks on Tuesday 2 PM UTC
- **Hotfix Releases**: As needed for P0/P1 issues
- **Major Releases**: Monthly with 1-week testing window

### Deployment Phases

1. **Planning** (1 week before) — Feature sign-off, test planning
2. **Code Freeze** (3 days before) — Only hotfixes merged
3. **Staging Testing** (72 hours before) — Full QA validation
4. **Pre-Deployment** (24 hours before) — Final checks
5. **Deployment** (T-0) — Database → Backend → Frontend
6. **Validation** (T+30 min) — Verify all systems responding
7. **Monitoring** (4-24 hours) — Watch for errors and performance issues

**See**: [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md)

### Deployment Checklist

**Pre-deployment** (24 hours before):
- [ ] All PRs merged and CI passing
- [ ] Build succeeds locally and in CI
- [ ] No new console warnings/errors
- [ ] Database migrations tested in staging
- [ ] Environment variables configured
- [ ] Feature flags set correctly

**Deployment** (T-0):
- [ ] Database migrations deployed
- [ ] Backend deployed and verified
- [ ] Frontend deployed and verified
- [ ] Health checks passing

**Post-deployment** (Every 5 min for 30 min):
- [ ] Error rate <1%
- [ ] API latency p95 <500ms
- [ ] No spike in support tickets
- [ ] Key user flows working

**See**: [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md#deployment-checklist)

### Rollback Procedure

**When to rollback**:
- Error rate >10% (5x normal)
- API latency p95 >5 seconds
- Database corrupt or unreachable
- Critical feature completely broken
- Payment processing failing

**Rollback steps**:
1. Lead approves rollback decision
2. Promote previous Vercel build for frontend
3. Revert backend commit (1-2 min)
4. Verify system health
5. Post incident report to #alerts

**Rollback time**: <15 minutes total

**See**: [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md#rollback-procedures)

---

## Incident Response

### Quick Decision Tree

Is the platform completely down (users cannot login)?
- YES → P0 (System Down)
- NO: Can users not access their primary product?
  - YES → P1 (Major Feature Broken)
  - NO: Is performance severely degraded (>50% slower)?
    - YES → P2 (Degradation)
    - NO → P3 (Minor Issue)

### P0 Response Checklist

```
1. Acknowledge incident in #alerts (in <5 min)
2. Page on-call engineer
3. Join incident bridge (Zoom)
4. Gather facts (when, what, who affected)
5. Investigate (follow one of 4 paths based on symptoms)
6. Implement fix or rollback
7. Verify system recovered
8. Post resolution to #alerts
9. Schedule postmortem within 24 hours
```

**See**: [ESCALATION_PROCEDURES.md](./ESCALATION_PROCEDURES.md#p0---critical-system-down)

### Postmortem Process

After every P0/P1:
1. Document incident timeline and root cause
2. Schedule 30-min postmortem meeting within 24 hours
3. Identify prevention measures
4. Assign owner for follow-up work
5. Update runbooks based on learnings

**See**: [ESCALATION_PROCEDURES.md](./ESCALATION_PROCEDURES.md#post-incident-review)

---

## Weekly Review

**Time**: Friday 4 PM (45 minutes)

**Metrics Reviewed**:
- Story points completed this week
- PRs merged and bugs fixed
- Test coverage maintained (>75% target)
- Incident count and MTTR
- DAU/WAU/MAU trending
- Feature adoption rates
- User feedback themes

**Outputs**:
- Team health assessment (morale, workload, blockers)
- Risk register updated
- Next week's priorities finalized
- Backlog grooming complete

**See**: [TEAM_DASHBOARD.md](./TEAM_DASHBOARD.md#weekly-review)

---

## Monthly Review

**Time**: Last Friday of month (90 minutes)

**Reports**:
- Achievements and launches this month
- User metrics deep dive (MAU, DAU, retention, churn)
- Technical health report (uptime, incidents, tech debt)
- Product roadmap progress
- Customer feedback themes
- Team development and growth

**Decisions**:
- Roadmap adjustments for next month
- Hiring needs identified
- Training/development planned
- Key risks identified and mitigated

**See**: [TEAM_DASHBOARD.md](./TEAM_DASHBOARD.md#monthly-review)

---

## Implementation Checklist

### Setup (Week 1)

- [ ] Read all Phase 5 documentation (TEAM_DASHBOARD, ESCALATION, RELEASE)
- [ ] Configure Slack channels (#standup, #alerts, #deployments, #dev, #customer-issues)
- [ ] Set up on-call rotation schedule
- [ ] Create incident bridge Zoom link
- [ ] Brief team on incident response procedures

### Dashboards (Week 2)

- [ ] Deploy SmartBoardMetrics component to admin dashboard
- [ ] Test metrics API endpoints against staging database
- [ ] Configure demo data for testing
- [ ] Create monitoring dashboard in Sentry/PostHog
- [ ] Set up alerting rules for critical thresholds

### Processes (Week 3)

- [ ] Conduct first team standup with checklist
- [ ] Hold first weekly review meeting
- [ ] Test incident response procedure (fire drill)
- [ ] Test deployment procedure in staging
- [ ] Document any local adaptations

### Monitoring (Week 4)

- [ ] Deploy metrics to production
- [ ] Verify metrics data collection working
- [ ] Establish baseline metrics for comparison
- [ ] Configure alerts for anomalies
- [ ] Set up automated weekly metrics report

---

## Tools & Resources

### Communication
- Slack: Team messaging and notifications
- Zoom: Incident bridge and video meetings
- GitHub: Issue tracking and PR reviews

### Monitoring & Analytics
- Sentry: Error tracking and performance monitoring (https://sentry.io/)
- PostHog: Product analytics and funnels (https://posthog.com/)
- Vercel: Frontend deployment and monitoring (https://vercel.com/)
- Render: Backend deployment and logs (https://render.com/)

### Incident Management
- PagerDuty: On-call rotation (optional, can use Slack)
- StatusPage: Customer status updates (https://www.statuspage.io/)

### Project Management
- GitHub Projects: Sprint planning and task tracking
- Jira: Can be used if team prefers (optional)

---

## FAQ

### Q: What if the on-call engineer doesn't respond to a P0 incident?

A: Escalate immediately:
1. Call the on-call engineer (use contact matrix in ESCALATION_PROCEDURES.md)
2. If unreachable after 2 min, page backup on-call
3. If still unreachable, call engineering lead
4. Do not delay waiting for response

### Q: Can we deploy on Friday?

A: Avoid Friday deployments after 5 PM (no team availability for incidents). Tuesday 2 PM is the standard slot. Urgent hotfixes can be deployed any time, but still use the checklist.

### Q: How do we handle disagreement during incident response?

A: On-call engineer has decision authority during active incident. Discuss and align after incident is resolved in postmortem.

### Q: What if metrics API is down?

A: SmartBoardMetrics component falls back to demo data automatically. No impact to team operations.

### Q: Who should attend the weekly review?

A: Engineering lead, backend lead, frontend lead, product manager. Async updates acceptable if real-time meeting not possible.

### Q: How do we track team velocity?

A: Use GitHub Projects velocity chart. Story points completed per week should be consistent (±20% target).

---

## Next Steps

1. **Read** the three main documents:
   - [TEAM_DASHBOARD.md](./TEAM_DASHBOARD.md) — Daily/weekly/monthly checklists
   - [ESCALATION_PROCEDURES.md](./ESCALATION_PROCEDURES.md) — Incident response runbooks
   - [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md) — Deployment procedures

2. **Configure** team infrastructure:
   - Slack channels and notifications
   - On-call rotation schedule
   - Incident bridge setup

3. **Run** first standup using TEAM_DASHBOARD checklist

4. **Deploy** metrics infrastructure (backend service, routes, component)

5. **Test** incident response with fire drill (without real incident)

6. **Schedule** first weekly review meeting

---

## Document Versions

| Document | Version | Last Updated |
|----------|---------|--------------|
| TEAM_DASHBOARD.md | 1.0 | 2024-08-15 |
| ESCALATION_PROCEDURES.md | 1.0 | 2024-08-15 |
| RELEASE_MANAGEMENT.md | 1.0 | 2024-08-15 |
| OPERATIONS_GUIDE.md | 1.0 | 2024-08-15 |

---

## Contact & Support

For questions about Phase 5 operations infrastructure:
- **Team Operations**: Post in #dev Slack channel
- **Incident Response**: See ESCALATION_PROCEDURES.md for on-call contact info
- **Deployment Issues**: See RELEASE_MANAGEMENT.md troubleshooting section

---

## Related Documentation

- [Auth & Billing Architecture](./auth_billing_separation.md)
- [Dashboard Setup Guide](./DASHBOARDS_SETUP.md)
- [Monitoring Setup](./MONITORING_SETUP.md)
- [Database Monitoring](./DATABASE_MONITORING.md)
- [Backend Monitoring](./BACKEND_MONITORING.md)
