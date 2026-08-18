# Monitoring Dashboards Setup Guide

Complete guide for setting up and accessing monitoring dashboards for EdutechLife.

## Table of Contents

1. [Sentry Dashboard](#sentry-dashboard)
2. [PostHog Analytics](#posthog-analytics)
3. [GitHub Actions CI/CD](#github-actions-cicd)
4. [Vercel Performance](#vercel-performance)
5. [Status Page](#status-page)
6. [Slack Integrations](#slack-integrations)

---

## Sentry Dashboard

### Access

- **URL**: https://sentry.io/organizations/[org-slug]/issues/
- **Projects**:
  - Frontend: https://sentry.io/organizations/[org]/projects/edutechlife-frontend/
  - Backend: https://sentry.io/organizations/[org]/projects/edutechlife-backend/

### Key Views

#### 1. Issues Dashboard
Shows all errors grouped by type.

**Access**: Main sidebar → Issues

**Metrics**:
- Total errors (24h, 7d, 30d)
- Error frequency trends
- Most affected users
- Error resolution status

**Actions**:
- Click error to view full trace
- Resolve/ignore errors
- Assign to team members
- Add to release notes

#### 2. Performance Monitoring
Tracks API response times and database queries.

**Access**: Main sidebar → Performance

**Metrics**:
- P50, P95, P99 latencies
- Slow transaction identification
- Endpoint breakdown
- Performance trends

**Alerts**:
- Alert when p95 > 1s
- Alert when error rate > 5%

#### 3. Release Tracking
Monitor errors by release version.

**Access**: Main sidebar → Releases

**Features**:
- See when errors started
- Rollback tracking
- Deployment notes
- Health percentage by version

#### 4. Custom Alerts
Set up alert rules for critical issues.

**Access**: Settings → Alerts → Create Alert Rule

**Example Alert**:
```
IF error rate > 5% THEN notify @oncall on Slack
IF latency p95 > 2s THEN notify #devops
```

### Sentry Integration

#### Slack Integration

1. Go to Settings → Integrations → Slack
2. Click Install
3. Select workspace and channel
4. Configure alert rules to post to Slack

**Recommended Channels**:
- `#alerts`: Critical errors (P0)
- `#monitoring`: Performance issues (P1-P2)
- `#dev`: Lower priority errors (P3)

#### GitHub Integration

1. Go to Settings → Integrations → GitHub
2. Authorize GitHub organization
3. Link repositories to projects
4. Auto-create GitHub issues for errors

---

## PostHog Analytics

### Access

- **URL**: https://app.posthog.com/projects/[project-id]

### Key Dashboards

#### 1. Insights Dashboard
Real-time analytics on user behavior.

**Key Metrics**:
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session duration
- Feature adoption rates

**Create Custom Insight**:
1. Click "Insights" in left sidebar
2. Click "+ New insight"
3. Select visualization type:
   - Trend (line chart)
   - Funnel (conversion steps)
   - Paths (user journeys)
   - Retention (cohort analysis)
   - Lifecycle (user stages)

#### 2. Conversion Funnels

**Setup Step-by-Step**:

1. Create funnel: "Free Trial → Signup → Upgrade"
   - Step 1: User visits landing page
   - Step 2: Clicks "Start Free Trial"
   - Step 3: Completes signup
   - Step 4: Upgrades to premium

2. View conversion rates:
   - Free Trial → Signup: 45%
   - Signup → Upgrade: 35%
   - Overall: 15.75%

3. Create alert if conversion < 40%

**Example Funnel Configuration**:
```javascript
// Track funnel events
posthog.capture('funnel_start', { step: 'landing' });
posthog.capture('funnel_step_1', { step: 'trial_started' });
posthog.capture('funnel_step_2', { step: 'signup_complete' });
posthog.capture('funnel_step_3', { step: 'upgrade_complete' });
```

#### 3. Feature Flags & A/B Testing

**Setup Feature Flag**:

1. Click "Feature flags" in left sidebar
2. Click "+ New flag"
3. Name: `feature_new_dashboard`
4. Conditions:
   - Target: 50% of users
   - OR: specific user segments
5. Rollout percentage: Start at 10%, increase to 100%

**Usage in Code**:
```javascript
import { useFeatureFlagVariantKey } from 'posthog-js/react'

function MyComponent() {
  const variant = useFeatureFlagVariantKey('feature_new_dashboard')
  
  if (variant === 'control') {
    return <OldDashboard />
  } else if (variant === 'test') {
    return <NewDashboard />
  }
}
```

#### 4. Retention Cohorts

Analyze which user cohorts stay engaged.

**Setup**:
1. Click "Retention" in sidebar
2. Select start event: "User signed up"
3. Select return event: "Viewed course"
4. View by: "Week", "Day", or "Month"

**Interpretation**:
- Week 0: 100% (starting cohort)
- Week 1: 45% (45% of users returned)
- Week 2: 32% (32% still active)
- Week 4: 18% (18% long-term retained)

### Dashboards to Create

#### Dashboard 1: Executive Overview
- DAU/MAU trends (chart)
- Conversion funnel (funnel)
- Top features (bar chart)
- Retention by cohort (table)

#### Dashboard 2: IALab Product Metrics
- Module completion rates (funnel)
- Quiz performance (average score by module)
- Video watch time (bar chart)
- User engagement by module (table)

#### Dashboard 3: SmartBoard Engagement
- Daily active learners (trend)
- Games played (bar chart)
- Average session duration (KPI)
- User retention (retention chart)

#### Dashboard 4: Premium Tier Analysis
- Free vs Premium retention (comparison)
- Feature usage by plan (bar chart)
- Upgrade conversion (funnel)
- Churn rate by cohort (retention)

### Alerts in PostHog

**Alert Types**:

1. **Insight Alerts**:
   - If DAU < 100 → notify #alerts
   - If conversion funnel < 20% → notify #product
   - If churn rate > 10% → page oncall

2. **Trend Alerts**:
   - If metric ↓ 20% from yesterday → notify
   - If metric ↑ 50% from baseline → investigate

**Setup**:
1. Open any insight
2. Click "Set up an alert"
3. Choose threshold and notification channel
4. Test alert

---

## GitHub Actions CI/CD

### Access

- **URL**: https://github.com/edutechlife/edutechlife/actions

### Key Workflows

#### CI Workflow Status

**Location**: `.github/workflows/ci.yml`

**Jobs**:
1. `smoke` - Fast build (5m) - MUST PASS
2. `lint` - Linting (8m) - MUST PASS
3. `test` - Unit tests (15m) - MUST PASS
4. `backend` - Backend tests (15m) - MUST PASS
5. `e2e` - E2E tests (10m) - WARN on fail
6. `lighthouse` - Performance (10m) - MUST PASS
7. `security` - Audit (5m) - WARN on fail
8. `coverage` - Coverage report (10m) - INFO only

**Branch Protection Rules**:

Set in Settings → Branches → Add rule for `main`:
```
✅ Require status checks to pass:
  - ci/smoke
  - ci/lint
  - ci/test
  - ci/backend
  - ci/lighthouse
  - ci/security

⚠️ Optional checks:
  - ci/e2e
  - ci/coverage
```

#### Security Scan Workflow

**Location**: `.github/workflows/security-scan.yml`

**Jobs**:
- `snyk-frontend` - Dependency scanning
- `snyk-backend` - Backend dependencies
- `owasp-deps` - OWASP check
- `npm-audit` - Strict audit
- `secrets-scan` - TruffleHog
- `codeql` - Code analysis

**Reports**:
1. Snyk: https://app.snyk.io/projects
2. OWASP: Check artifacts in Actions run
3. CodeQL: https://github.com/edutechlife/edutechlife/security/code-scanning

#### Deploy Workflow

**Location**: `.github/workflows/deploy.yml`

**Flow**:
```
┌─────────────────────┐
│   migrate-db        │
│  (Supabase CLI)     │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ↓             ↓
┌────────┐   ┌──────────┐
│frontend│   │backend   │
│(Vercel)│   │(Render)  │
└────────┘   └──────────┘
    │             │
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │smoke-test   │
    │(curl checks)│
    └─────────────┘
```

### CI/CD Dashboard Setup

**Create GitHub Project**:

1. Go to Projects → New project
2. Name: "CI/CD Pipeline"
3. Add views:
   - **Table**: All runs
   - **Board**: Status (Queued → Running → Passed/Failed)
   - **Roadmap**: Deployment timeline

**Track**:
- Build times (target < 10m)
- Test coverage (target 75%+)
- Deployment frequency (target 2+ per day)
- Mean time to recovery (target < 1h)

---

## Vercel Performance

### Access

- **Frontend Dashboard**: https://vercel.com/dashboard/edutechlife-frontend
- **Staging Dashboard**: https://vercel.com/dashboard/edutechlife-staging

### Key Metrics

#### Web Vitals

**View**:
1. Go to project
2. Click "Analytics"
3. View Core Web Vitals tab

**Thresholds**:
- LCP: Good < 2.5s, Needs Work > 4s
- FID: Good < 100ms, Needs Work > 300ms
- CLS: Good < 0.1, Needs Work > 0.25

#### Deployments

**Monitor**:
1. Click "Deployments" tab
2. View build time trends
3. See deployment frequency
4. Check preview URLs

#### Real-Time Analytics

**Setup**:
1. Go to project settings
2. Enable "Web Analytics"
3. View dashboard at https://vercel.com/analytics/[project-id]

---

## Status Page

### Setup (Using Statuspage.io or Similar)

1. Create account at https://www.statuspage.io
2. Create components:
   - Frontend
   - Backend API
   - Database
   - Payment Processing

3. Configure monitoring:
   ```bash
   # Automated health checks
   - Frontend: https://edutechlife.co (every 1 min)
   - Backend: https://api.edutechlife.co/health (every 1 min)
   - Database: Supabase status page
   - Payments: Stripe status page
   ```

### Public Status Page

- **URL**: https://status.edutechlife.co
- **Features**:
  - Real-time status
  - Incident history
  - Scheduled maintenance
  - Subscribe to updates

### Status Page Integration

**Slack Integration**:
1. Go to Integrations → Slack
2. Add to #alerts channel
3. Receive notifications on incidents

**Email Notifications**:
- Subscribers notified on status changes
- Custom escalation alerts

---

## Slack Integrations

### Channel Setup

Create these channels:
```
#alerts          - Critical issues (P0)
#monitoring      - Performance issues (P1-P2)
#deployments     - Deployment notifications
#devops          - Infrastructure alerts
#dev-alerts      - Development team alerts
#security        - Security scanning results
```

### Integrations by Service

#### Sentry → Slack

1. **Setup**:
   ```
   Sentry → Settings → Integrations → Slack → Install
   ```

2. **Alert Rules**:
   ```
   Error rate > 5% → #alerts
   Latency p95 > 1s → #monitoring
   New release errors → #devops
   ```

#### PostHog → Slack

1. **Setup**:
   ```
   PostHog → Settings → Webhooks → Add Slack webhook
   ```

2. **Alerts**:
   ```
   DAU < 100 → #monitoring
   Conversion funnel < 30% → #alerts
   Churn rate anomaly → #alerts
   ```

#### GitHub Actions → Slack

1. **Setup**:
   ```yaml
   - name: Slack Notification
     uses: slackapi/slack-github-action@v1
     with:
       webhook-url: ${{ secrets.SLACK_WEBHOOK_DEVOPS }}
   ```

2. **Workflows**:
   - Deploy started → #deployments
   - Deploy succeeded → #deployments
   - Deploy failed → #alerts

#### StatusPage → Slack

1. **Setup**:
   ```
   StatusPage → Integrations → Slack
   ```

2. **Incidents**:
   - Incident created → #alerts
   - Incident resolved → #monitoring

### Slack Workflow Examples

**On Deploy Success**:
```
Post to #deployments:
✅ Production deployment successful
Commit: ${{ github.sha }}
Branch: ${{ github.ref }}
Deployed: ${{ github.event.head_commit.timestamp }}
```

**On Error Spike**:
```
Post to #alerts:
⚠️ Error rate spike detected
Current: 15 errors/min (was 2 errors/min)
Affected: Payment API endpoint
Action: Check Sentry for details
```

**On Performance Issue**:
```
Post to #monitoring:
📊 Performance degradation detected
Metric: Latency p95
Current: 2.3s (threshold: 1.0s)
Impact: 1200+ users
```

---

## Setting Up Your First Dashboard

### Quick Start (30 minutes)

1. **Sentry Setup** (5 min):
   - Create account
   - Create 2 projects (frontend, backend)
   - Copy DSNs
   - Add to `.env`

2. **PostHog Setup** (5 min):
   - Create account
   - Create project
   - Copy API key
   - Add to `.env`

3. **GitHub Integration** (10 min):
   - Connect Sentry & GitHub
   - Set branch protection rules
   - Configure status checks

4. **Slack Integration** (10 min):
   - Connect Sentry → Slack
   - Connect PostHog → Slack
   - Create alert channels

### Verification Checklist

- [ ] Sentry receiving errors from frontend
- [ ] Sentry receiving errors from backend
- [ ] PostHog tracking page views
- [ ] PostHog tracking custom events
- [ ] Lighthouse scores visible in CI
- [ ] GitHub branch protection working
- [ ] Slack notifications arriving
- [ ] Status page updated automatically

---

## Troubleshooting

### No Errors in Sentry
1. Check DSN is set correctly
2. Check network requests in DevTools
3. Trigger test error: `Sentry.captureException(new Error('test'))`
4. Check Sentry project settings

### PostHog Not Tracking
1. Check API key is correct
2. Check `initAnalytics()` is called
3. Verify network calls: DevTools → Network
4. Check PostHog project settings

### CI Gates Failing
1. Run tests locally: `npm test`
2. Check coverage: `npm run test:coverage`
3. Fix linting: `npm run lint:fix`
4. Verify types: `npm run typecheck`

### Lighthouse Scores Low
1. Check bundle size: `npm run build`
2. Check unused dependencies
3. Lazy load non-critical routes
4. Optimize images

---

## Quick Links

- **Sentry**: https://sentry.io
- **PostHog**: https://app.posthog.com
- **GitHub**: https://github.com/edutechlife/edutechlife/actions
- **Vercel**: https://vercel.com/dashboard
- **Statuspage**: https://www.statuspage.io

---

## Support

For help:
1. Check service documentation
2. Open GitHub issue
3. Contact DevOps team
4. Check #devops Slack channel
