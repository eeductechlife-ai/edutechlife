# DevOps Quick Start Guide

Fast setup guide for observability, CI/CD gates, and production monitoring.

## 5-Minute Setup

### 1. Create Sentry Projects (2 min)

1. Go to https://sentry.io and sign up
2. Create project: **edutechlife-frontend** (React)
3. Create project: **edutechlife-backend** (Node.js)
4. Copy DSNs for both projects

### 2. Create PostHog Project (1 min)

1. Go to https://app.posthog.com
2. Create project: **edutechlife**
3. Copy API key

### 3. Add Environment Variables (1 min)

**Frontend** (Vercel dashboard):
```
VITE_SENTRY_DSN = https://...
VITE_POSTHOG_KEY = phc_...
```

**Backend** (Render dashboard):
```
SENTRY_DSN = https://...
```

### 4. Verify Setup (1 min)

- Push a test commit to `develop`
- Check GitHub Actions passes
- Check Sentry receives errors
- Check PostHog tracks events

---

## Key Files Created

| File | Purpose | Status |
|------|---------|--------|
| `.github/workflows/security-scan.yml` | Snyk, OWASP, CodeQL security scanning | ✅ Ready |
| `.github/workflows/deploy-staging.yml` | Auto-deploy to staging | ✅ Ready |
| `.lighthouserc.json` | Lighthouse CI configuration | ✅ Ready |
| `src/config/sentry.client.js` | Frontend Sentry config | ✅ Ready |
| `src/config/posthog.config.js` | Analytics configuration | ✅ Ready |
| `docs/MONITORING_SETUP.md` | Complete monitoring guide | ✅ Ready |
| `docs/DASHBOARDS_SETUP.md` | Dashboard creation guide | ✅ Ready |
| `docs/DATABASE_MONITORING.md` | PostgreSQL optimization | ✅ Ready |
| `docs/BACKEND_MONITORING.md` | Backend Sentry setup | ✅ Ready |
| `docs/GITHUB_BRANCH_PROTECTION.md` | CI/CD gates configuration | ✅ Ready |

---

## CI/CD Gates Overview

### GitHub Actions Workflows

```
.github/workflows/
├── ci.yml                 ← Main CI workflow (lint, test, build)
├── security-scan.yml      ← Security scanning (Snyk, OWASP)
├── deploy.yml             ← Production deployment
└── deploy-staging.yml     ← Staging auto-deploy
```

### Required Status Checks for `main`

```
✅ ci/smoke           (5m)   - Fast build check
✅ ci/lint            (8m)   - Linting + type check
✅ ci/test            (15m)  - Unit tests
✅ ci/backend         (15m)  - Backend tests
✅ ci/lighthouse      (10m)  - Performance gate (score ≥90)
✅ ci/security        (5m)   - npm audit + Snyk
```

### Optional Status Checks

```
⚠️  ci/e2e             (10m)  - E2E tests (can fail)
ℹ️  ci/coverage        (10m)  - Coverage report (info only)
⚠️  ci/budget          (8m)   - Bundle size check
```

---

## Monitoring Stack

### Frontend Monitoring

```
React App (browser)
    ↓
┌────────────────────────────┐
│   Sentry (@sentry/react)   │ → Error tracking + performance
│   PostHog (posthog-js)     │ → Analytics + feature flags
│   Core Web Vitals          │ → LCP, FID, CLS tracking
│   Lighthouse CI            │ → Performance testing
└────────────────────────────┘
    ↓
GitHub Actions → Vercel → Production
```

### Backend Monitoring

```
Node.js API (Express)
    ↓
┌────────────────────────────┐
│   Sentry (@sentry/node)    │ → Error tracking + performance
│   pg_stat_statements       │ → Query performance
│   Health check endpoints   │ → Uptime monitoring
│   Response time tracking   │ → API latency
└────────────────────────────┘
    ↓
GitHub Actions → Render → Production
```

### Database Monitoring

```
PostgreSQL (Supabase)
    ↓
┌────────────────────────────┐
│   Slow query logging       │ → Identify slow queries
│   Connection pooling       │ → Monitor connections
│   Index statistics         │ → Query optimization
│   Backup monitoring        │ → Data protection
└────────────────────────────┘
    ↓
Supabase Dashboard → Automated backups
```

---

## Typical Deployment Flow

### 1. Development

```bash
git checkout -b feat/new-feature
# Make changes
git commit -am "feat: add new feature"
git push origin feat/new-feature
```

### 2. GitHub Actions CI

```
Create PR
    ↓
Run CI workflow
├─ smoke (5m)      ✅ Build succeeds
├─ lint (8m)       ✅ No linting errors
├─ test (15m)      ✅ All tests pass
├─ backend (15m)   ✅ Backend tests pass
├─ lighthouse (10m) ✅ Score ≥90
└─ security (5m)   ✅ No critical vulnerabilities
    ↓
All checks pass
    ↓
Request code review
    ↓
Merge to main
```

### 3. Auto Deploy to Production

```
Merge to main
    ↓
Deploy workflow runs
├─ migrate-db      ✅ Database migrations
├─ frontend        ✅ Deploy to Vercel
├─ backend         ✅ Deploy to Render
└─ smoke-test      ✅ Health checks pass
    ↓
Production updated
    ↓
Sentry tracks any new errors
PostHog tracks user activity
```

### 4. Staging Environment

```
Push to staging branch
    ↓
Run reduced CI (smoke, lint, test only)
    ↓
Auto-deploy to staging
    ↓
Run smoke tests
    ↓
Staging URL ready for QA
```

---

## Daily Operations

### Morning Standup Checks (5 min)

```bash
# 1. Check error rate
Sentry: https://sentry.io/organizations/[org]/issues/

# 2. Check uptime
Status: https://status.edutechlife.co

# 3. Check analytics
PostHog: https://app.posthog.com/insights

# 4. Check deployments
GitHub: https://github.com/edutechlife/edutechlife/actions
```

### Weekly Monitoring Review (15 min)

**Monday 10 AM**:

1. **Sentry Issues** (5 min)
   - [ ] Review unresolved errors
   - [ ] Triage new errors (P0/P1/P2)
   - [ ] Close resolved errors
   - [ ] Check performance trends

2. **Performance Metrics** (5 min)
   - [ ] Check Core Web Vitals
   - [ ] Review Lighthouse scores
   - [ ] Check API latency (p95 < 1s)
   - [ ] Review slow queries

3. **Analytics** (5 min)
   - [ ] Check DAU/MAU trends
   - [ ] Review conversion funnels
   - [ ] Check retention cohorts
   - [ ] Identify feature adoption

### Monthly Operational Review (30 min)

**First Wednesday of month 9 AM**:

1. **Infrastructure Health** (10 min)
   - [ ] Uptime report (target 99.9%)
   - [ ] Database performance review
   - [ ] Index optimization
   - [ ] Backup verification

2. **Security** (10 min)
   - [ ] Review security scan results
   - [ ] Check for vulnerabilities
   - [ ] Review access logs
   - [ ] Update dependencies

3. **Cost Analysis** (10 min)
   - [ ] Review cloud spending
   - [ ] Optimize resources
   - [ ] Identify cost-saving opportunities
   - [ ] Plan capacity

---

## Alert Channels

### Slack Notifications

**#alerts** (Critical P0 - Page oncall)
- Error rate > 5%
- Payment system down
- Auth/login broken
- Database unreachable

**#monitoring** (High P1 - Slack notification)
- Error rate > 2%
- Latency spike (p95 > 1s)
- Database slow queries
- Memory/CPU high

**#dev-alerts** (Medium P2 - Dev team)
- Warnings from tests
- Coverage drops
- Bundle size increase
- Lint warnings

**#deployments** (Info - Team notification)
- Deployment started
- Deployment succeeded
- Deployment failed
- Database migration complete

---

## Emergency Procedures

### Production Error Spike

1. **Alert received** in #alerts
2. **Assess impact**:
   - Check error rate
   - Check affected users
   - Check error type
3. **Determine severity**:
   - Auth down? P0 (page oncall)
   - Payments down? P0
   - Feature broken? P1
   - UI bug? P2
4. **Respond**:
   - Check Sentry for root cause
   - Check recent deployments
   - Rollback if needed
   - Notify team
5. **Resolve**:
   - Fix code
   - Test in staging
   - Deploy fix
   - Verify in production
6. **Postmortem**:
   - Document what happened
   - Add test case to prevent
   - Update monitoring

### Database Performance Degradation

1. **Alert**: Slow queries detected (p95 > 2s)
2. **Investigate**:
   - Check slow query log
   - Run EXPLAIN ANALYZE
   - Check index usage
3. **Fix**:
   - Add missing indexes
   - Optimize query
   - Update statistics (ANALYZE)
4. **Verify**:
   - Re-run EXPLAIN ANALYZE
   - Test with load
   - Monitor for 1 hour
5. **Document**:
   - Log what changed
   - Add to monitoring dashboard

### Deployment Failure

1. **Check logs** in GitHub Actions
2. **Identify issue**:
   - Test failure?
   - Build failure?
   - Deploy failure?
3. **Fix locally**:
   - Reproduce issue
   - Fix code
   - Run tests
4. **Re-deploy**:
   - Merge fix to main
   - Let CI/CD run
   - Verify in production

---

## Monitoring Dashboards

### Essential Dashboards (Setup First)

**Dashboard 1: Real-Time Status**
- HTTP requests (trend)
- Error rate (gauge)
- API latency p95 (gauge)
- Database connections (gauge)

**Dashboard 2: Performance**
- LCP trend (line)
- FID trend (line)
- CLS trend (line)
- Lighthouse score (gauge)

**Dashboard 3: Business Metrics**
- DAU trend (area)
- Conversion funnel (funnel)
- Retention cohort (table)
- Revenue (gauge)

**Dashboard 4: Infrastructure**
- Uptime % (gauge)
- Deployment frequency (bar)
- Build time trend (line)
- Test coverage (gauge)

### Creating Dashboards

All guides linked below show step-by-step setup.

---

## Troubleshooting Quick Fixes

### Tests Failing in CI

```bash
# 1. Run locally to reproduce
npm test

# 2. Check for flaky tests
npm test -- --repeat 3

# 3. Look for environment-specific issues
# Check .env.test or mock setup

# 4. Update snapshots if needed
npm test -- -u
```

### Lighthouse Score Dropping

```bash
# 1. Run locally
npm run build
npx @lhci/cli@latest autorun

# 2. Check what changed
git diff dist/

# 3. Optimize images
npm run optimize-images

# 4. Check bundle size
npm run check-budget
```

### High Error Rate in Production

```bash
# 1. Check Sentry dashboard
# → Filter by release to find which deploy introduced error

# 2. Check recent commits
git log main --oneline | head -5

# 3. Rollback if needed
git revert [commit-sha]
git push origin main

# 4. Deploy fix
# Once CI passes, auto-deploys
```

---

## Key Contacts

| Role | Slack | Escalation |
|------|-------|-----------|
| DevOps Lead | @devops-lead | Page oncall (P0 only) |
| Backend Lead | @backend-lead | @devops-lead |
| Frontend Lead | @frontend-lead | @devops-lead |
| Security Lead | @security-lead | @devops-lead |
| Oncall | Rotates weekly | AWS support |

---

## Documentation Reference

| Topic | Document |
|-------|----------|
| Complete Monitoring Setup | [MONITORING_SETUP.md](./MONITORING_SETUP.md) |
| Dashboard Creation | [DASHBOARDS_SETUP.md](./DASHBOARDS_SETUP.md) |
| Backend Monitoring | [BACKEND_MONITORING.md](./BACKEND_MONITORING.md) |
| Database Optimization | [DATABASE_MONITORING.md](./DATABASE_MONITORING.md) |
| Branch Protection Rules | [GITHUB_BRANCH_PROTECTION.md](./GITHUB_BRANCH_PROTECTION.md) |

---

## CI/CD Gates Checklist

### Initial Setup (1 hour)

- [ ] Add Sentry DSNs to GitHub secrets
- [ ] Add PostHog API key to Vercel/Render
- [ ] Create status checks for main branch
- [ ] Add CODEOWNERS file
- [ ] Set up Slack integrations
- [ ] Test a PR workflow

### Ongoing (Each Sprint)

- [ ] Review failed CI runs
- [ ] Update performance budgets as needed
- [ ] Review coverage trends
- [ ] Audit security scan results
- [ ] Update branch protection rules if needed

### Monthly (First Monday)

- [ ] Review deployment frequency
- [ ] Analyze error trends
- [ ] Review performance metrics
- [ ] Plan optimization work
- [ ] Update runbooks

---

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Test Coverage | 75%+ | ? |
| CI Pass Rate | 95%+ | ? |
| Deployment Success | 99%+ | ? |
| Uptime | 99.9% | ? |
| Error Rate | < 1% | ? |
| Latency p95 | < 1s | ? |
| LCP | < 2.5s | ? |
| Lighthouse Score | ≥ 90 | ? |

---

## Next Steps

1. **Today**:
   - [ ] Set up Sentry accounts
   - [ ] Set up PostHog account
   - [ ] Add environment variables

2. **This Week**:
   - [ ] Deploy security-scan.yml workflow
   - [ ] Deploy staging workflow
   - [ ] Create GitHub branch protection rules
   - [ ] Set up Slack notifications

3. **Next Week**:
   - [ ] Create monitoring dashboards
   - [ ] Set up alert rules
   - [ ] Run first monitoring drill
   - [ ] Document runbooks

---

## Resources

### Tools
- **Sentry**: https://sentry.io
- **PostHog**: https://app.posthog.com
- **GitHub Actions**: https://github.com/edutechlife/edutechlife/actions
- **Vercel**: https://vercel.com/dashboard
- **Render**: https://dashboard.render.com

### Documentation
- **Sentry Docs**: https://docs.sentry.io
- **PostHog Docs**: https://posthog.com/docs
- **GitHub Actions**: https://docs.github.com/en/actions
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse

---

## Support

**Questions?**
1. Check relevant documentation file
2. Search GitHub issues
3. Ask in #devops Slack channel
4. Contact DevOps lead

**Found a bug?**
1. Describe issue
2. Provide reproduction steps
3. Attach logs/screenshots
4. Open GitHub issue

---

**Last Updated**: 2026-08-15
**Version**: 1.0.0
**Maintained By**: DevOps Team
