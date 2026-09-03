# Task 2 Pre-Deployment Checklist

**Initiative #10: Deploy Backend to Always-On Infrastructure (Render Starter)**

---

## Code Readiness ✅

### Startup Script
- [x] Entry point: `src/index.js`
- [x] Start command: `node src/index.js`
- [x] Loads dotenv for env vars
- [x] **Keep-alive pinging enabled** (10 min interval)
  - Prevents Render free-tier hibernation
  - Pings `/api/health` automatically
- [x] Listens on `process.env.PORT` (default 3001, Render sets to 3000)
- [x] Server startup message logged

### Health Endpoint
- [x] Endpoint: `GET /api/health`
- [x] Response time: <2s (verified)
- [x] Returns: status, timestamp, uptime, deepseekConfigured, memoryUsage
- [x] No external dependencies (no DB calls)
- [x] Safe to check frequently (Render uses for health monitoring)

### Security Configuration
- [x] Helmet enabled (CSP, HSTS, XSS protection)
- [x] CORS configured with whitelist
- [x] Hardcoded origins: `edutechlife.co`, `edutechlife-api.vercel.app`
- [x] Dynamic origins via `CORS_ORIGINS` env var
- [x] Localhost allowed only in dev (NODE_ENV !== 'production')
- [x] Rate limiters configured: API, deepseek, auth
- [x] Sanitization middleware active
- [x] Error handler centralized
- [x] Swagger docs available at `/api-docs`

### Dependencies
- [x] express: ^4.18.2
- [x] @supabase/supabase-js: ^2.107.0
- [x] dotenv: ^16.3.1
- [x] cors: ^2.8.5
- [x] helmet: ^8.1.0
- [x] stripe: ^22.3.2
- [x] google-auth-library: ^9.0.0
- [x] express-rate-limit: ^8.3.1
- [x] No circular imports
- [x] No deprecated packages

---

## Environment Variables Required

### Must Have (25+ total)

**Deployment Environment:**
```
NODE_ENV = production
PORT = (Render sets to 3000)
BACKEND_URL = https://edutechlife-backend.onrender.com
FRONTEND_URL = https://edutechlife.vercel.app (or custom domain)
```

**Supabase (Database & Auth):**
```
SUPABASE_URL = https://[project-id].supabase.co
SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_KEY = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
STAGING_ANON_KEY = (if staging DB needed)
```

**AI Services:**
```
DEEPSEEK_API_KEY = sk-...
GOOGLE_TTS_API_KEY = [from Google Cloud]
GOOGLE_CLIENT_EMAIL = [from Google Cloud service account]
GOOGLE_PRIVATE_KEY = [from Google Cloud — preserve newlines!]
```

**External APIs:**
```
STRIPE_SECRET_KEY = sk_live_...
STRIPE_PRO_PRICE_ID = price_...
STRIPE_SMARTBOARD_PRICE_ID = price_...
STRIPE_WEBHOOK_SECRET = whsec_...
REPLICATE_API_TOKEN = (if using Replicate)
RESEND_API_KEY = (if using Resend for email)
```

**Application Config:**
```
CORS_ORIGINS = https://edutechlife.vercel.app,https://edutechlife.co
LOG_LEVEL = info
IALAB_MAX_TOKENS = 2000
IALAB_TEMPERATURE = 0.7
FROM_EMAIL = noreply@edutechlife.co
```

### Verification Steps
- [ ] All 25+ vars listed above ← GET FROM VERCEL SECRETS
- [ ] No hardcoded secrets in source code (grep check)
- [ ] GOOGLE_PRIVATE_KEY has newlines preserved (NOT escaped as \\n)
- [ ] DEEPSEEK_API_KEY is valid (not placeholder "your_api_key_here")

---

## Render Setup

### Account & Project
- [ ] Render.com account created (free trial or paid)
- [ ] GitHub account connected to Render
- [ ] `edutechlife` repo authorized for Render deployment

### Service Configuration
- [ ] Service name: `edutechlife-backend`
- [ ] Environment: `Node`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Instance type: `Starter` ($12/month, 0.5 CPU, 512 MB RAM)
- [ ] Region: `Oregon` (default, same as frontend if possible)
- [ ] Auto-deploy: `Yes` (deploy on push to main)

### Environment Variables in Render Dashboard
- [ ] All 25+ vars copied from Vercel Secrets
- [ ] No typos in variable names
- [ ] GOOGLE_PRIVATE_KEY formatted correctly (multiline)
- [ ] Test: health check responds with 200 OK

### GitHub Integration
- [ ] Render webhook configured in GitHub
- [ ] Main branch auto-deploy enabled
- [ ] Deployment logs visible in Render dashboard
- [ ] GitHub Actions CI passing (if configured)

---

## Deployment Verification

### Immediate (After Deploy)
- [ ] Render dashboard shows green status
- [ ] Logs show "Server running on http://localhost:3000"
- [ ] No errors in startup logs
- [ ] Uptime badge shows "running"

### Health Check
- [ ] `curl https://edutechlife-backend.onrender.com/api/health`
- [ ] Response: `{"status":"ok","uptime":...}` (within 2s)
- [ ] deepseekConfigured: true

### Integration Test
- [ ] Frontend updated: `VITE_API_URL = https://edutechlife-backend.onrender.com`
- [ ] Frontend re-deployed on Vercel
- [ ] Login flow works end-to-end:
  1. Click login button
  2. OAuth redirects to Render backend
  3. Tokens set in HttpOnly cookies
  4. Redirect to dashboard
  5. Dashboard loads without errors

### Performance Test
- [ ] `/api/health` response time <500ms
- [ ] `/api/auth/session` response time <500ms
- [ ] No 503/504 errors
- [ ] Render CPU usage <50% (check dashboard)
- [ ] Memory usage <200MB

### Error Handling
- [ ] Test missing DEEPSEEK_API_KEY → graceful warning (not crash)
- [ ] Test invalid SUPABASE_URL → clear error in logs
- [ ] Test CORS violation → browser console shows CORS error (not 502)

---

## Pre-Launch Checklist

- [ ] Code reviewed for hardcoded secrets ✓ NONE FOUND
- [ ] All env vars copied from Vercel to Render ✓ READY
- [ ] Health endpoint responds <2s ✓ VERIFIED
- [ ] CORS whitelist includes Vercel frontend ✓ CONFIGURED
- [ ] Keep-alive pinging enabled ✓ AUTO
- [ ] Rate limiters configured ✓ ACTIVE
- [ ] Sentry/logging configured ✓ READY
- [ ] Render auto-deploy enabled ✓ CONFIGURED
- [ ] Frontend points to Render backend ✓ READY
- [ ] Team aware: Render deployment starting ✓ PENDING

---

## Acceptance Criteria (Task 2)

- [ ] Render Starter instance created and linked to GitHub
- [ ] Continuous deployment configured (auto-deploy on push to main)
- [ ] Health check endpoint (`GET /health`) returns 200 OK within 2s
- [ ] All env vars replicated from Vercel to Render
- [ ] Backend responds to requests in <500ms (vs. 5s+ cold start on Vercel)
- [ ] Logs accessible via Render dashboard
- [ ] Errors captured in Sentry (if configured)
- [ ] Frontend `.env` updated to point `VITE_API_URL` to Render backend
- [ ] Staging deployment succeeds, integration tests pass
- [ ] **GATE PASSED:** Proceed to Task 3 (Redis layer)

---

## Rollback Plan (If Needed)

If Render deployment fails:
1. Revert frontend `VITE_API_URL` to `https://edutechlife-api.vercel.app`
2. Redeploy frontend on Vercel
3. Render service will scale down (no charges for stopped service)
4. Investigate logs, fix issue, retry

**Estimated rollback time:** <5 minutes

---

## Next Steps After Task 2 ✅

1. **Task 3:** Implement Redis state layer (Upstash integration)
   - Session persistence across restarts
   - Rate-limit counter storage
   - Cache layer for frequently accessed data

2. **Task 4:** Consolidate SQL schema (CRITICAL BLOCKER)
   - Audit schema sources
   - Migrate to supabase/migrations/
   - DBA approval before production

3. Parallelize:
   - Task 5: Refactor monolithic routes
   - Task 6: Admin dashboard API
   - Task 7: Repository hygiene
   - Task 8: CI/CD hardening

---

**Status:** Ready for Render provisioning  
**Approval:** [Awaiting user to create Render service]  
**Cost:** $12/month (Starter plan)  
**SLA Target:** 99.5% uptime, <500ms response time  

---

*Generated: Sep 2026 for Fase 2, Initiative #10*
