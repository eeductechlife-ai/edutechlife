# Monitoring & Observability Setup

Complete guide for monitoring infrastructure, CI/CD gates, and observability for EdutechLife SmartBoard.

## Table of Contents

1. [Overview](#overview)
2. [Error Tracking (Sentry)](#error-tracking-sentry)
3. [Analytics (PostHog)](#analytics-posthog)
4. [Performance Monitoring](#performance-monitoring)
5. [CI/CD Gates](#cicd-gates)
6. [Staging Environment](#staging-environment)
7. [Alerting Rules](#alerting-rules)
8. [Dashboards](#dashboards)
9. [Database Monitoring](#database-monitoring)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The monitoring stack consists of:

- **Error Tracking**: Sentry (JavaScript + backend)
- **Analytics**: PostHog (events, feature flags, session recording)
- **Performance**: Core Web Vitals, Lighthouse CI, bundle size tracking
- **Security**: Snyk, OWASP Dependency Check, CodeQL, TruffleHog
- **Quality Gates**: Test coverage (75%+), type checking, linting

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────┬──────────────┬──────────────┐         │
│  │    Sentry    │    PostHog    │  Core Web    │         │
│  │   (Errors)   │   (Analytics) │   Vitals     │         │
│  └──────────────┴──────────────┴──────────────┘         │
└─────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │ GitHub Actions│
                    │  CI/CD Gates  │
                    └───────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Backend (Node.js/Express)                   │
│  ┌──────────────┬──────────────┬──────────────┐         │
│  │    Sentry    │  PostgreSQL   │  Response    │         │
│  │   (Errors)   │  Slow Query   │   Times      │         │
│  └──────────────┴──────────────┴──────────────┘         │
└─────────────────────────────────────────────────────────┘
```

---

## Error Tracking (Sentry)

### Setup

1. **Create Sentry Projects**:
   - Go to https://sentry.io
   - Create two projects:
     - `edutechlife-frontend` (React)
     - `edutechlife-backend` (Node.js)

2. **Get DSNs**:
   - Frontend DSN: `https://[key]@[org].ingest.sentry.io/[project-id]`
   - Backend DSN: `https://[key]@[org].ingest.sentry.io/[backend-project-id]`

3. **Add Environment Variables**:

   **Frontend (.env.local, .env.production)**:
   ```env
   VITE_SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[frontend-project-id]
   VITE_SENTRY_TRACES_RATE=0.05
   VITE_SENTRY_REPLAYS_ERROR_RATE=1
   VITE_SENTRY_REPLAYS_RATE=0
   VITE_ENVIRONMENT=production
   VITE_APP_VERSION=1.0.0
   ```

   **Backend (.env, .env.production)**:
   ```env
   SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[backend-project-id]
   SENTRY_TRACES_SAMPLE_RATE=0.05
   SENTRY_ENVIRONMENT=production
   ```

### Frontend Implementation

The frontend Sentry is initialized lazily in `main.jsx` to avoid blocking LCP:

```javascript
// main.jsx - Lazy initialization
if (import.meta.env.VITE_SENTRY_DSN) {
  const initSentry = () =>
    import("@sentry/react").then(({ init, browserTracingIntegration }) => {
      init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [browserTracingIntegration()],
        tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_RATE) || 0,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 1,
        environment: import.meta.env.MODE,
      });
    });
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initSentry, { timeout: 3000 });
  } else {
    setTimeout(initSentry, 2000);
  }
}
```

### Backend Implementation

```javascript
// server.js or src/index.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({
      request: true,
      serverName: false,
    }),
  ],
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.05),
  environment: process.env.NODE_ENV,
});

const app = express();

// Sentry middleware (early in middleware stack)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// ... your routes ...

// Error handler (last in middleware stack)
app.use(Sentry.Handlers.errorHandler());
```

### Usage

**Frontend**:
```javascript
import { captureError, setSentryUser, addSentryContext } from '@/config/sentry.client';

// Capture errors
try {
  // some code
} catch (error) {
  captureError(error, { component: 'Dashboard' });
}

// Set user context
setSentryUser(userId, userEmail);

// Add custom context
addSentryContext('auth', {
  provider: 'clerk',
  plan: 'premium',
});
```

**Backend**:
```javascript
import * as Sentry from "@sentry/node";

// Capture errors
try {
  // database query
} catch (error) {
  Sentry.captureException(error);
}

// Add context
Sentry.setContext('database', {
  query: 'SELECT * FROM users',
  duration: 123,
});
```

### Sentry Dashboard

- **URL**: https://sentry.io/organizations/[org]/issues/
- **Key Metrics**:
  - Error rate
  - Error frequency by tag
  - Error resolution status
  - Performance trends

---

## Analytics (PostHog)

### Setup

1. **Create PostHog Project**:
   - Go to https://app.posthog.com
   - Create project `EdutechLife`
   - Copy API key

2. **Add Environment Variables**:

   **Frontend (.env.local, .env.production)**:
   ```env
   VITE_POSTHOG_KEY=[your-posthog-api-key]
   VITE_POSTHOG_HOST=https://app.posthog.com
   ```

### Frontend Implementation

PostHog is initialized in `src/lib/analytics.js`:

```javascript
export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

  if (!key) return;

  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: host,
      capture_pageview: false,
      loaded: (ph) => { /* ready */ },
    });
  });
}
```

### Events Tracking

Key events to track:

1. **User Engagement**:
   - Page views (route changes)
   - Module accessed
   - Quiz completed
   - Video watched
   - Document downloaded

2. **Conversion**:
   - Free trial started
   - Subscription activated
   - Payment successful
   - User upgraded plan

3. **Feature Usage**:
   - IALab module started
   - SmartBoard game played
   - Valerio chatbot used
   - Admin dashboard accessed

Example:

```javascript
import { track } from '@/lib/analytics';

// Event tracking
track('Quiz Completed', {
  quizId: '123',
  module: 'Literacy',
  score: 85,
  duration_ms: 300000,
  userType: 'premium',
});

// Feature usage
track('IALab Module Accessed', {
  moduleId: 'blockchain',
  userPlan: 'premium',
});
```

### PostHog Dashboard

- **URL**: https://app.posthog.com
- **Dashboards**:
  - User Engagement (DAU, MAU, retention)
  - Conversion Funnel (signup → payment)
  - Feature Usage (by module, by plan)
  - Cohort Analysis (by plan, by region)

---

## Performance Monitoring

### Core Web Vitals

Tracked via PostHog and Sentry:

1. **Largest Contentful Paint (LCP)**: < 2.5s
2. **First Input Delay (FID) / Interaction to Next Paint (INP)**: < 100ms
3. **Cumulative Layout Shift (CLS)**: < 0.1

### Monitoring Implementation

**Frontend** (`src/utils/vitals.js`):

```javascript
import { getCLS, getFID, getLCP, getTTFB } from 'web-vitals';
import { track } from '@/lib/analytics';

export function initWebVitals() {
  // LCP
  getLCP((metric) => {
    track('Core Web Vital: LCP', {
      value: metric.value,
      rating: metric.rating,
    });
    if (metric.rating !== 'good') {
      console.warn('LCP is poor:', metric.value);
    }
  });

  // CLS
  getCLS((metric) => {
    track('Core Web Vital: CLS', {
      value: metric.value,
      rating: metric.rating,
    });
  });

  // INP (Interaction to Next Paint)
  getFID((metric) => {
    track('Core Web Vital: INP', {
      value: metric.value,
      rating: metric.rating,
    });
  });

  // TTFB
  getTTFB((metric) => {
    track('Core Web Vital: TTFB', {
      value: metric.value,
      rating: metric.rating,
    });
  });
}
```

### Lighthouse CI

Configured via `.lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 1,
      "staticDistDir": "./dist"
    },
    "upload": {
      "target": "temporary-public-storage"
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.90 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.90 }],
        "categories:seo": ["error", { "minScore": 0.90 }]
      }
    }
  }
}
```

### Bundle Size Monitoring

Tracked in `scripts/check-budget.mjs`:

```javascript
// Target bundle sizes
const budgets = {
  js: 500_000,    // 500KB
  css: 100_000,   // 100KB
  vendor: 300_000, // 300KB
};
```

---

## CI/CD Gates

### Gate Structure

All gates run on push to `main`, `develop`, and on PRs:

1. **Fast Gates** (< 5 min):
   - Smoke test
   - Build

2. **Quality Gates** (5-15 min):
   - Linting
   - Type checking
   - Unit tests
   - Coverage (75%+)

3. **Performance Gates** (10-15 min):
   - Lighthouse CI (score ≥ 90)
   - Bundle size check (< 500KB JS)
   - E2E tests

4. **Security Gates** (5-30 min):
   - npm audit
   - Snyk scan
   - OWASP dependency check
   - CodeQL analysis
   - Secrets scan

### CI Workflow (`.github/workflows/ci.yml`)

**Jobs**:
- `smoke`: Fast build check (5 min)
- `lint`: ESLint + TypeScript (8 min)
- `test`: Unit tests (15 min)
- `coverage`: Coverage report
- `security`: npm audit
- `e2e`: Playwright tests (10 min)
- `lighthouse`: Lighthouse CI (10 min)
- `budget`: Bundle size check (8 min)
- `backend`: Backend tests + lint

**Gate Rules**:
```yaml
# PR must pass ALL gates before merging
status-checks:
  - ci/smoke
  - ci/lint
  - ci/test
  - ci/coverage
  - ci/security
  - ci/e2e
  - ci/lighthouse
  - ci/budget
  - ci/backend
```

### Coverage Requirements

**Frontend**:
- Overall: 75%+
- Critical paths: 85%+
- Components: 70%+

**Backend**:
- Overall: 70%+
- API endpoints: 80%+
- Database queries: 75%+

### Security Scan Workflow (`.github/workflows/security-scan.yml`)

**Jobs**:
- `snyk-frontend`: Dependency vulnerabilities
- `snyk-backend`: Dependency vulnerabilities
- `owasp-deps`: OWASP dependency check
- `npm-audit`: npm audit strict
- `secrets-scan`: TruffleHog secrets
- `codeql`: CodeQL analysis
- `security-report`: Summary report

---

## Staging Environment

### Setup

1. **Create Staging Branch**:
   ```bash
   git checkout -b staging
   git push origin staging
   ```

2. **Configure GitHub Branch Protection**:
   - Go to Settings → Branches
   - Add rule for `staging`
   - Require status checks (same as main)
   - Require reviews before merge

3. **Deploy Staging Automatically**:

   Create `.github/workflows/deploy-staging.yml`:
   ```yaml
   name: Deploy Staging
   on:
     push:
       branches: [staging]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - run: npm ci
         - run: npm run build
         - run: |
             npx vercel deploy \
               --token=${{ secrets.VERCEL_TOKEN }} \
               --scope=${{ secrets.VERCEL_ORG_ID }} \
               --yes
           env:
             VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_STAGING }}
   ```

4. **Manual QA Checklist**:

   Before promoting to production, verify:

   - [ ] All features work on staging URL
   - [ ] Analytics events are tracked correctly
   - [ ] Sentry captures errors properly
   - [ ] Lighthouse score ≥ 90
   - [ ] No console errors
   - [ ] Mobile responsive (375px, 768px, 1024px)
   - [ ] Auth flow works (signup, login, logout)
   - [ ] Payment flow works (test card)
   - [ ] API calls complete successfully
   - [ ] Database queries perform well (< 100ms)
   - [ ] No security warnings from console

---

## Alerting Rules

### Sentry Alerts

**Critical (P0)**: Page oncall immediately
- Error rate > 5% (100+ errors/min)
- 500-level errors spike > 2x
- Auth/payment errors (any count)

**High (P1)**: Slack alert to #alerts
- Error rate > 2% (20+ errors/min)
- Performance degradation (p95 latency 2x normal)
- Database connection pool exhausted

**Medium (P2)**: Slack #dev-alerts
- Error rate > 1% (10+ errors/min)
- Slow queries detected
- Memory leaks suspected

### PostHog Alerts

**Conversion Funnel**:
- Signup completion < 60% → Slack alert
- Payment completion < 70% → Slack alert
- Module completion < 50% → Slack alert

**Retention**:
- D7 retention < 30% → Slack alert
- D30 retention < 10% → Slack alert

### Infrastructure Alerts

**Uptime**:
- Downtime > 5 min → Page oncall
- Response time p95 > 1s → Slack alert
- API error rate > 1% → Slack alert

**Database**:
- Connections > 80% of pool → Slack alert
- Slow queries (> 1s) → Log alert
- Replication lag > 10s → Page oncall

---

## Dashboards

### Public Dashboards

1. **Status Page**: https://status.edutechlife.co
   - Uptime (target 99.9%)
   - Response times
   - Incident history

2. **Analytics Dashboard**: PostHog
   - DAU/MAU trends
   - Conversion metrics
   - Feature usage
   - Retention cohorts

3. **Error Tracking**: Sentry
   - Error volume by module
   - Top errors by frequency
   - Resolution timeline
   - Error trends

### Internal Dashboards

1. **CI/CD Dashboard**: GitHub Actions
   - Build times
   - Test coverage
   - Failed gates
   - Deployment frequency

2. **Performance Dashboard**: Vercel + PostHog
   - Core Web Vitals
   - Lighthouse scores
   - Bundle size trends
   - Build times

3. **Security Dashboard**: GitHub Security
   - Dependency vulnerabilities
   - Code scanning alerts
   - Secret scanning results
   - SAST findings

---

## Database Monitoring

### PostgreSQL Slow Query Log

Configure in Supabase dashboard:

```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 100; -- 100ms threshold
SELECT pg_reload_conf();

-- View slow queries
SELECT * FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 20;
```

### Query Performance Monitoring

1. **Identify Slow Queries**:
   ```sql
   SELECT query, calls, total_time, mean_time
   FROM pg_stat_statements
   WHERE mean_time > 100
   ORDER BY mean_time DESC;
   ```

2. **Add Indexes**:
   ```sql
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_courses_user_id ON courses(user_id);
   CREATE INDEX idx_progress_user_course ON progress(user_id, course_id);
   ```

3. **Monitor Indexes**:
   ```sql
   SELECT schemaname, tablename, indexname
   FROM pg_indexes
   ORDER BY tablename, indexname;
   ```

### Connection Pool Monitoring

```javascript
// Backend (src/db.js)
const pool = new Pool({
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  Sentry.captureException(err);
});

// Monitor pool status
setInterval(() => {
  console.log(`Pool stats: ${pool.totalCount} total, ${pool.idleCount} idle`);
}, 60000);
```

---

## Troubleshooting

### Sentry Not Capturing Errors

1. **Check DSN**: Verify `VITE_SENTRY_DSN` is set correctly
2. **Check Sample Rate**: Ensure `VITE_SENTRY_TRACES_RATE` > 0
3. **Check Network**: Verify sentry.io is accessible (no CSP issues)
4. **Check Console**: Look for initialization errors

### PostHog Not Tracking Events

1. **Check API Key**: Verify `VITE_POSTHOG_KEY` is set
2. **Check Network**: Verify app.posthog.com is accessible
3. **Check Initialization**: Call `initAnalytics()` in AnalyticsProvider
4. **Check Events**: Use browser DevTools to inspect network calls

### CI/CD Gates Failing

1. **Coverage**: Run `npm run test:coverage` locally
2. **Linting**: Run `npm run lint:all` to find issues
3. **Type Checking**: Run `npm run typecheck` to find type errors
4. **Lighthouse**: Run locally with `npm run build && npx @lhci/cli@latest autorun`

### Performance Issues

1. **LCP > 2.5s**:
   - Check bundle size: `npm run build -- --logLevel error`
   - Check critical resources: DevTools Network tab
   - Lazy load non-critical components

2. **CLS > 0.1**:
   - Check layout shifts: DevTools Layout Shift trace
   - Use CSS `contain: layout` on dynamic content
   - Reserve space for ads/images

3. **Slow Queries** (> 100ms):
   - Check slow query log in PostgreSQL
   - Add missing indexes
   - Optimize complex joins

---

## Quick Reference

### Environment Variables

**Frontend**:
```env
VITE_SENTRY_DSN=
VITE_SENTRY_TRACES_RATE=0.05
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=https://app.posthog.com
VITE_ENVIRONMENT=production
VITE_APP_VERSION=1.0.0
```

**Backend**:
```env
SENTRY_DSN=
SENTRY_TRACES_SAMPLE_RATE=0.05
SENTRY_ENVIRONMENT=production
```

### Commands

```bash
# Test locally
npm run test:all

# Build and check budget
npm run build && npm run check-budget

# Run Lighthouse locally
npx @lhci/cli@latest autorun

# Check coverage
npm run test:coverage

# Type check
npm run typecheck

# Lint
npm run lint:all
```

### Links

- **Sentry**: https://sentry.io
- **PostHog**: https://app.posthog.com
- **GitHub Actions**: https://github.com/edutechlife/edutechlife/actions
- **Vercel**: https://vercel.com/dashboard
- **Render**: https://dashboard.render.com
- **Supabase**: https://app.supabase.com

---

## Support

For questions or issues:
1. Check [Sentry Docs](https://docs.sentry.io)
2. Check [PostHog Docs](https://posthog.com/docs)
3. Open an issue in the repo
4. Contact DevOps team
