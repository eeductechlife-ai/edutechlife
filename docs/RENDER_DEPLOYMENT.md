# Render Backend Deployment Guide

**Task 2 — Initiative #10: Deploy Backend to Always-On Infrastructure**

> Migrate from Vercel serverless to Render Starter for persistent backend operation.

---

## Overview

**Current State:** Backend on Vercel (HTTP-only, ~5s cold starts)  
**Target State:** Backend on Render Starter (always-on Node.js, <500ms response)

**Benefits:**
- Eliminates 5s+ cold-start latency
- Enables persistent connections, WebSocket, long-polling
- Prepares for background jobs and scheduled tasks
- Cheaper than equivalent serverless at scale

---

## Prerequisites

- [ ] Render.com account (free tier or Starter plan, ~$12/month)
- [ ] GitHub personal access token with `repo` scope (for CI/CD)
- [ ] Access to current Vercel secrets (to copy to Render)
- [ ] Backend code is in public/private GitHub repo

---

## Step-by-Step Deployment

### 1. Create Render Service

1. Log in to [render.com](https://render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository (`edutechlife`)
4. Configure:
   - **Name:** `edutechlife-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build` (if build script exists, else `npm install`)
   - **Start Command:** `npm start`
   - **Instance Type:** `Starter` ($12/month, 0.5 CPU, 512 MB RAM)

### 2. Set Environment Variables in Render Dashboard

Copy ALL of these from Vercel Secrets. Render dashboard → **Environment**:

**Core:**
```
NODE_ENV = production
PORT = 3000
BACKEND_URL = https://edutechlife-backend.onrender.com
FRONTEND_URL = https://edutechlife.vercel.app
```

**Supabase:**
```
SUPABASE_URL = [from Vercel]
SUPABASE_ANON_KEY = [from Vercel]
SUPABASE_SERVICE_KEY = [from Vercel]
SUPABASE_SERVICE_ROLE_KEY = [from Vercel]
STAGING_ANON_KEY = [from Vercel — if exists]
```

**AI & External Services:**
```
DEEPSEEK_API_KEY = [from Vercel]
GOOGLE_TTS_API_KEY = [from Vercel]
GOOGLE_CLIENT_EMAIL = [from Vercel]
GOOGLE_PRIVATE_KEY = [from Vercel — preserve newlines!]
REPLICATE_API_TOKEN = [from Vercel — if exists]
IALAB_MAX_TOKENS = 2000
IALAB_TEMPERATURE = 0.7
```

**Payments & Communication:**
```
STRIPE_SECRET_KEY = [from Vercel]
STRIPE_PRO_PRICE_ID = [from Vercel]
STRIPE_SMARTBOARD_PRICE_ID = [from Vercel]
STRIPE_WEBHOOK_SECRET = [from Vercel]
RESEND_API_KEY = [from Vercel — if exists]
FROM_EMAIL = noreply@edutechlife.co
```

**CORS & Security:**
```
CORS_ORIGINS = https://edutechlife.vercel.app,https://edutechlife.co
LOG_LEVEL = info
```

### 3. Configure CORS in Backend

Update `edutechlife-backend/src/app.js` CORS whitelist:

```javascript
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.CORS_ORIGINS || '')
      .split(',')
      .map(o => o.trim());
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
};
```

**Current safe list:**
- `https://edutechlife.vercel.app` (production frontend)
- `https://edutechlife.co` (custom domain, when live)
- `http://localhost:5174` (development only, if NODE_ENV !== 'production')

### 4. Enable Auto-Deployment

In Render dashboard:
1. Go to **Settings** → **Deploy** → **Auto-Deploy**
2. Set to **Yes** (deploy on every push to `main`)
3. Connect webhook to GitHub

### 5. Verify Health Check

After deployment:
1. Go to Render dashboard → **Logs**
2. Wait for "Server started on port 3000" message
3. Ping health endpoint:

```bash
curl https://edutechlife-backend.onrender.com/api/health
```

Expected response (within 2 seconds):
```json
{
  "status": "ok",
  "timestamp": "2026-09-03T14:30:00.000Z",
  "uptime": 45.23,
  "deepseekConfigured": true,
  "memoryUsage": "120MB"
}
```

### 6. Update Frontend to Use Render Backend

In `edutechlife-frontend/.env` (and Vercel):
```
VITE_API_URL = https://edutechlife-backend.onrender.com
```

Redeploy frontend on Vercel.

### 7. Test Integration

From browser (frontend):
```javascript
// Open DevTools console
fetch('/api/health', { credentials: 'include' })
  .then(r => r.json())
  .then(data => console.log('✅ Backend alive:', data))
```

Or test specific endpoint:
```bash
curl -H "Cookie: sb-access-token=..." \
  https://edutechlife-backend.onrender.com/api/auth/session
```

---

## Acceptance Criteria Checklist

- [ ] Render service created and linked to GitHub
- [ ] All 25+ environment variables copied from Vercel to Render
- [ ] Auto-deployment from main branch configured
- [ ] Health check endpoint responds 200 OK within 2s
- [ ] Backend response time <500ms average (tested with 10+ requests)
- [ ] Logs accessible via Render dashboard
- [ ] Errors captured in Sentry (if configured)
- [ ] Frontend `.env` updated to point to Render backend
- [ ] Smoke test: login flow works end-to-end
- [ ] No 503/504 errors on health check

---

## Monitoring & Alerts

**Render Dashboard:**
- **Metrics** tab: CPU, memory, request count
- **Logs** tab: real-time application output
- Set up email alerts for crashes (Settings → Alerts)

**Sentry Integration** (if available):
- Backend errors auto-captured and routed to Sentry
- Set up alerts for error rate threshold

---

## Troubleshooting

### Issue: "Build failed"
- Check that `npm install` succeeds locally
- Verify Node version matches (14+)
- Check `package.json` has valid `start` script

### Issue: "502 Bad Gateway" after deploy
- Check Render logs for startup errors
- Verify DEEPSEEK_API_KEY and SUPABASE_URL are set
- Wait 2 minutes—Render may still be starting

### Issue: CORS errors from frontend
- Update `CORS_ORIGINS` env var in Render dashboard
- Redeploy to apply changes
- Verify frontend is sending requests to new Render URL

### Issue: Health check timeout (>2s)
- Check Render CPU/memory usage (Metrics tab)
- If high, upgrade to Starter+ plan
- Check database connection latency (Supabase dashboard)

---

## Cost Estimate

- **Render Starter:** $12/month (0.5 CPU, 512 MB RAM)
- **Supabase:** Included in existing plan
- **Upstash Redis** (for Task 3): ~$10/month for serverless tier

**Total:** ~$22/month for always-on backend + Redis state

---

## Next Steps (After Task 2)

1. **Task 3:** Implement Redis state layer (Upstash integration)
2. **Task 4:** Consolidate SQL schema on staging database
3. Monitor Render metrics weekly; scale up if needed

---

**Rendered:** Sep 2026  
**Status:** Ready for deployment  
**Approval:** [Awaiting DevOps/Backend lead sign-off]
