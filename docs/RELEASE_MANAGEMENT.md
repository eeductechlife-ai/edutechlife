# Release Management & Deployment Guide

Complete procedures for planning, testing, deploying, and rolling back releases.

## Table of Contents

1. [Release Planning](#release-planning)
2. [Deployment Checklist](#deployment-checklist)
3. [Staging Validation](#staging-validation)
4. [Production Deployment](#production-deployment)
5. [Post-Deployment Monitoring](#post-deployment-monitoring)
6. [Rollback Procedures](#rollback-procedures)
7. [Release Notes](#release-notes)

---

## Release Planning

### Release Cadence

- **Frequency**: Every 1-2 weeks
- **Regular release**: Tuesday 2 PM UTC
- **Hotfix releases**: As needed for P0/P1 issues
- **Major releases**: Monthly with 1-week testing window

### Planning Phase (1 week before release)

**Monday: Release Planning Meeting**

```
Attendees: Lead, Product, Backend Lead, Frontend Lead
Duration: 30 minutes

1. Review completed PRs since last release
2. Identify features ready for production
3. Identify any known issues
4. Get sign-off from product on feature list
5. Create GitHub Milestone for release
```

**Checklist:**
- [ ] All target PRs reviewed and approved
- [ ] All target features documented
- [ ] Staging environment ready
- [ ] Release notes template created
- [ ] Deployment plan documented

### Code Freeze (3 days before release)

**Friday before release Tuesday**:

```
- No new features merged (hotfixes only)
- Only bug fixes allowed
- All PRs must have lead approval
- Create release branch: release/v[VERSION]
```

---

## Deployment Checklist

### Pre-Deployment (Monday)

**24 hours before planned release:**

#### Frontend Checklist

```
□ All PRs merged to main
□ All CI checks passing (GitHub Actions)
□ Build succeeds locally: npm run build
□ No console warnings or errors: npm run build 2>&1 | grep -i warn
□ Lighthouse score maintained or improved
□ No new bundle size warnings
□ Environment variables documented in .env.example
□ Feature flags set correctly for this release
```

**Command sequence:**
```bash
git fetch origin
git checkout main
git pull origin main
npm install
npm run build
npm run test
npm run lint
```

#### Backend Checklist

```
□ All PRs merged to main
□ All CI tests passing
□ Build succeeds: npm run build (if applicable)
□ Linting passes: npm run lint
□ No new dependencies added (or approved)
□ Database migrations reviewed and tested
□ API endpoints documented
□ Environment variables updated in secrets
□ Rate limiting configured
```

**Command sequence:**
```bash
git fetch origin
git checkout main
git pull origin main
npm install
npm test
npm run lint
npm run db:validate (if applicable)
```

#### Database Checklist

```
□ New migrations written in /supabase/migrations
□ Migrations tested against staging database
□ No destructive changes without backup
□ Rollback plan documented for each migration
□ Schema changes reviewed by lead
□ Performance impact assessed for large tables
□ Data validation queries prepared
```

**Migration checklist:**
```sql
-- Before deployment:
-- 1. Verify migration is backward-compatible
-- 2. Check row count of affected tables
-- 3. Verify indexes exist for queries
-- 4. Test migration time on production-size data
-- 5. Have rollback plan (previous migration number)
```

#### Infrastructure Checklist

```
□ Staging database has fresh production data
□ Backend secrets updated in Render
□ Frontend environment variables updated in Vercel
□ CDN cache cleared if needed
□ SSL certificates valid
□ Rate limits reviewed
□ Monitoring/alerts configured
□ Capacity planning reviewed (CPU, memory, bandwidth)
```

### Staging Validation (72 hours before release)

**Full testing in staging environment (Friday before Tuesday release):**

See [Staging Validation](#staging-validation) section below.

---

## Staging Validation

### Staging Environment Setup

**Refresh staging data:**
```bash
# Production data is NOT used in staging
# Use sanitized/anonymized dataset

# Update staging database from production schema
supabase db push --linked --include-migrations

# Seed test data
psql -h staging.db -U postgres -d edutechlife_staging -f /scripts/seed-staging.sql
```

### QA Validation Checklist

**Tester performs following tests:**

#### IALab Product
```
[ ] Login: Can user login via email/password
[ ] Login: Can user login via Google OAuth
[ ] Login: Can user login via Facebook OAuth
[ ] Dashboard: Courses load and display correctly
[ ] Dashboard: Progress bars show accurate data
[ ] Lesson: Can open lesson content
[ ] Lesson: Valerio TTS works (voice output)
[ ] Lesson: Can submit answers
[ ] Lesson: Progress tracked correctly
[ ] Lesson: Alerts send to parents on crisis keywords
[ ] Assessment: VAK diagnostic quiz runs
[ ] Assessment: Results display correctly
[ ] Metrics: Dashboard KPIs match expected values
```

#### SmartBoard Product
```
[ ] Parent login works
[ ] Parent can see child's progress
[ ] Parent receives alerts for crisis keywords
[ ] Student can access games/lessons
[ ] Student progress synchronized
[ ] Chat/communication features work
[ ] Notifications display correctly
[ ] Reports generate without errors
```

#### Admin Dashboard
```
[ ] Admin login works
[ ] KPIs display correct values
[ ] Institution filter works
[ ] Student data loads correctly
[ ] Analytics show accurate metrics
[ ] Export functionality works
[ ] No JavaScript errors in console
```

#### Cross-Product
```
[ ] Payment processing works
[ ] Email notifications send
[ ] API response times acceptable (<500ms)
[ ] Database performance acceptable
[ ] No 5xx errors in Sentry
[ ] Memory usage stable
[ ] CPU usage normal
```

### Performance Testing

**Lighthouse audit:**
```bash
npm run lighthouse
# Target: 
# - Performance: >85
# - Accessibility: >90
# - Best Practices: >85
# - SEO: >90
```

**Load testing (if deployment has significant changes):**
```bash
# Simulate 100 concurrent users
# Run for 5 minutes
# Monitor backend CPU, memory, database connections
# Target: <1s p95 latency, <1% error rate
```

### Security Validation

```
□ No secrets in code or logs
□ No SQL injection vulnerabilities
□ No XSS vulnerabilities in user-facing UI
□ Authentication still working correctly
□ CORS headers correct
□ Rate limiting active
□ No new security warnings from npm audit
```

**Run security scan:**
```bash
npm audit
npm audit --production
npm audit --prod --json > security-report.json
```

### Sign-off

**QA Lead signs off:**
```
After all tests pass:
[ ] QA Lead approval in GitHub issue comment
[ ] Note any known issues
[ ] Note any deferred improvements
[ ] Staging is ready for production deployment
```

---

## Production Deployment

### Deployment Window

**Scheduled Release Time: Tuesday 2 PM UTC**

**Rationale:**
- Morning support availability in all timezones
- If issues arise, 6 hours to work on fix before EOD
- Avoid Friday deployments (no support over weekend)
- Avoid deployments after 5 PM (no team availability)

### Pre-Deployment (T-30 minutes)

```
[ ] Final check of all CI systems green
[ ] All team ready in #deployments channel
[ ] Incident bridge link posted
[ ] On-call engineer on standby
[ ] Monitoring dashboards open (Sentry, PostHog, Vercel, Render)
[ ] Rollback plan reviewed and ready
```

### Backend Deployment (T-0)

**Step 1: Deploy database migrations**

```bash
cd edutechlife-backend
git checkout main
git pull origin main

# Deploy migrations to production
supabase db push --linked

# Verify migrations ran:
supabase db list migrations --linked
# All migrations should show ✓ status
```

**Step 2: Deploy backend service**

```bash
# If using Render automatic deployment:
git push origin main
# Wait for Render to detect push and deploy automatically
# Verify deployment in Render dashboard

# If manual deployment:
vercel deploy --prod --token $VERCEL_TOKEN
```

**Step 3: Verify backend health**

```bash
# Test health endpoint
curl https://api.edutechlife.co/health
# Expected: 200 OK

# Check for errors
curl https://api.edutechlife.co/health | jq .

# Wait 2 minutes, check backend logs
# Should be processing requests without errors
```

### Frontend Deployment (T+5 minutes)

**Step 1: Build and deploy**

```bash
cd edutechlife-frontend
git checkout main
git pull origin main

# Build
npm run build

# Deploy to Vercel (automatic via GitHub integration)
# OR manual: vercel deploy --prod --token $VERCEL_TOKEN
```

**Step 2: Verify frontend loads**

```bash
# Test staging first
curl https://staging.edutechlife.co

# Test production
curl https://edutechlife.co

# Test in browser (incognito to bypass cache)
# Try login flow
# Try core functionality
```

### Rollback Decision Point (T+15 minutes)

**Monitor for issues:**
- [ ] Sentry error rate normal (<1%)
- [ ] API response times normal (<500ms p95)
- [ ] No spike in user complaints
- [ ] Server resources normal (CPU <70%, memory <80%)

**If any critical issue detected:**
- Go to [Rollback Procedures](#rollback-procedures)

**If all looks good:**
- Continue to [Post-Deployment Monitoring](#post-deployment-monitoring)

---

## Post-Deployment Monitoring

### Immediate Monitoring (0-30 minutes after deployment)

**Every 5 minutes, check:**

```
□ Error rate in Sentry: Should be <1%
□ P95 API latency: Should be <500ms
□ Backend CPU usage: Should be <70%
□ Backend memory: Should be <80%
□ Database connections: Should be stable
□ No spike in customer complaints (#customer-issues)
```

**Commands to run:**

```bash
# Check backend logs for errors
# Go to Render dashboard → Logs

# Check frontend errors
# Go to Sentry → Issues (frontend)

# Check API metrics
# Vercel Analytics or PostHog

# Check database health
# Supabase dashboard → Database
```

**Post status updates every 10 minutes:**
```
#deployments channel:
✅ [Time] Deployment progressing well
- Error rate: 0.2% (normal)
- API latency p95: 340ms (normal)
- No critical issues detected
- Will continue monitoring for 1 hour
```

### Extended Monitoring (30 min - 4 hours after deployment)

**Every 30 minutes, verify:**

```
□ Sentry shows no new error patterns
□ Key user flows still working (spot check)
□ Performance metrics stable
□ Database query performance normal
□ No spike in support tickets
```

### Production Validation (4-24 hours after deployment)

**Next business day morning:**

```
□ Run key user flows again (spot check)
□ Review overnight logs for any errors
□ Check user feedback in support channels
□ Verify feature works as intended
□ Check analytics for expected behavior changes
```

**If issues found:**
- Document in GitHub issue
- Decide: quick hotfix or rollback?
- If rollback needed, execute [Rollback Procedures](#rollback-procedures)
- If hotfix needed, create emergency fix

### Monitoring Dashboard Setup

**Create permanent dashboard with alerts:**

**PostHog Dashboard**:
```
1. Create insight: "Deployment Health - v[VERSION]"
2. Metrics to track:
   - DAU (should match or increase)
   - Feature adoption (new features showing usage)
   - Error funnel (where users dropping off)
   - Session length (should be normal)
   - Completion rates (should be normal or better)
```

**Sentry Alerts**:
```
Create alert rule:
IF error_rate > 5% THEN notify #alerts
IF latency_p95 > 2000ms THEN notify #dev
IF new_release has >50 unique errors THEN notify @lead
```

**Vercel Monitoring**:
```
Track:
- Deployment status: green
- Web vitals: LCP <2.5s, FID <100ms, CLS <0.1
- Average response time
- Error rate
```

---

## Rollback Procedures

### When to Rollback

**Automatic rollback if:**
- [ ] Sentry shows error rate >10% (5x normal)
- [ ] API latency p95 >5 seconds (10x normal)
- [ ] Database becoming corrupted or unreachable
- [ ] Critical user feature completely broken
- [ ] Payment processing failing
- [ ] Authentication broken

**Do NOT rollback if:**
- Minor UI bug (fix in hotfix instead)
- Typo in text (fix in hotfix instead)
- Single user affected (investigate before rollback)
- Performance slightly worse (investigate before rollback)

### Rollback Decision

**Lead makes decision (consensus with on-call):**
```
1. Confirm issue was introduced in this deployment
   - Check when error rate spiked
   - Verify error didn't exist in previous version
   
2. Evaluate fix time vs rollback time
   - Quick fix (<15 min)? → Fix it instead
   - Complex issue? → Rollback
   
3. If rollback approved → Proceed to execution
```

### Backend Rollback

**Step 1: Identify previous good version**

```bash
git log --oneline main
# Look for last known good commit

# Or check Render deployment history
# Find last successful deployment
```

**Step 2: Revert bad commit**

```bash
git revert [bad-commit-hash]
git push origin main

# Wait for Render to auto-deploy
# Verify in Render dashboard: should show new deployment starting
```

**Step 3: Verify rollback complete**

```bash
# Test API
curl https://api.edutechlife.co/health

# Check Render logs for any errors
# Should see "Deployment successful"

# Wait 2 minutes, then check error rate dropped
```

### Database Rollback (if migration was bad)

**Step 1: Identify previous migration**

```bash
supabase db list migrations --linked
# Look for last ✓ (successful) migration before the bad one
```

**Step 2: Run rollback**

```bash
# Get the migration before the bad one
PREV_MIGRATION="002_add_vak_diagnostics.sql"

# Note: Supabase doesn't have automatic rollback
# Must manually revert using migration:

# Create new migration that undoes the bad one
supabase migration new rollback_bad_migration

# Write SQL to undo the change:
# If migration added column: ALTER TABLE x DROP COLUMN y;
# If migration added table: DROP TABLE x;
# etc.

supabase db push --linked
```

**Step 3: Verify database state**

```bash
# Connect to production database
psql -h prod.db -U postgres -d edutechlife_prod

# Verify schema matches expected state
\d table_name
# Check columns, indexes exist

# Run validation queries
SELECT COUNT(*) FROM table_name;
# Should match expected row count
```

### Frontend Rollback

**Step 1: Identify previous build**

```bash
# Go to Vercel dashboard
# Projects → edutechlife-frontend → Deployments

# Click on deployment before current
# Note the build hash or timestamp
```

**Step 2: Promote previous deployment**

```bash
# Option 1 (Vercel UI):
1. Go to previous deployment
2. Click "..." menu
3. Select "Promote to production"

# Option 2 (CLI):
vercel rollback --yes --token $VERCEL_TOKEN
```

**Step 3: Verify previous version running**

```bash
# Visit https://edutechlife.co
# Should show previous build

# Clear browser cache (Ctrl+Shift+Delete)
# Test key functionality
# Should work like previous version
```

### Communication During Rollback

**Immediate message to #deployments:**
```
🔄 ROLLBACK IN PROGRESS
- Issue: [What went wrong]
- Rolling back to previous version
- ETA: 10 minutes to complete
- Will post update when done
```

**When rollback complete:**
```
✅ ROLLBACK COMPLETE
- Rolled back to version [HASH]
- System stable
- Starting investigation into failed deployment
- Will post incident report within 24 hours
```

---

## Release Notes

### Release Notes Format

**Location**: `/RELEASES.md` or GitHub Release

**Template:**
```markdown
# v[X.Y.Z] - [Date]

## Features
- [Feature] - [Brief description]
- [Feature] - [Brief description]

## Improvements
- [Improvement] - [Brief description]
- [Bug fix] - [Description]

## Breaking Changes
- [If any, describe what changed and how to migrate]

## Migration Guide
If database changes:
- [Step 1]
- [Step 2]

## Deployment Notes
- No downtime expected
- OR: Expect 15 minutes downtime during deployment
- Database migration time: ~5 minutes for X table

## Known Issues
- [If any, describe workaround]
```

### Example Release Notes

```markdown
# v2.5.0 - August 15, 2024

## Features
- ✨ Valerio TTS queue optimization - faster voice responses
- ✨ Smart crisis alert severity classification
- ✨ Parent dashboard real-time notifications

## Improvements
- 🚀 30% faster dashboard load time (optimized queries)
- 🐛 Fixed VAK diagnostic scoring edge case
- 📊 Improved admin analytics accuracy

## Deployment Notes
- No downtime expected
- Database migration adds 1 new index (~30 sec)
- Recommend validation in staging first

## Migration Steps
1. Deploy database migrations: `supabase db push --linked`
2. Deploy backend: `git push origin main`
3. Deploy frontend: automatic via Vercel
4. Verify all services healthy
```

---

## Deployment Automation

### GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run lint

  database-migrate:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npx supabase db push --linked --token ${{ secrets.SUPABASE_ACCESS_TOKEN }}

  deploy-backend:
    needs: database-migrate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          npx vercel deploy --prod \
            --token ${{ secrets.VERCEL_TOKEN }} \
            --scope ${{ secrets.VERCEL_ORG_ID }}

  smoke-test:
    needs: [deploy-backend, deploy-frontend]
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -f ${{ secrets.SMOKE_TEST_FRONTEND_URL }}/health
          curl -f ${{ secrets.SMOKE_TEST_BACKEND_URL }}/health
```

---

## Rollback Reference Matrix

| Component | Rollback Time | Risk | Steps |
|-----------|--------------|------|-------|
| Frontend | <5 min | Very low | Promote previous Vercel build |
| Backend API | <10 min | Low | Revert commit, push to main |
| Database | >30 min | Medium | Create rollback migration, run |
| All Services | <15 min | Medium | Rollback frontend, backend, verify |

---

## Quick Reference Checklist

**48 hours before**: [ ] Code freeze begins
**24 hours before**: [ ] All pre-deployment checks passed
**T-30 min**: [ ] Team on standby, monitoring ready
**T-0**: [ ] Database migrations deployed
**T+5**: [ ] Backend deployed and verified
**T+10**: [ ] Frontend deployed
**T+15**: [ ] Decision point: proceed or rollback
**T+30**: [ ] Extended monitoring begins
**T+4h**: [ ] Declare deployment successful
**T+24h**: [ ] Production validation complete

---

## Resources

- **Vercel Dashboard**: https://vercel.com/projects/edutechlife-frontend
- **Render Backend**: https://render.com/dashboard
- **Supabase Console**: https://app.supabase.com/
- **GitHub Actions**: https://github.com/edutech-life/edutechlife/actions
- **Sentry**: https://sentry.io/organizations/edutechlife/
- **Status Page**: [Link]
