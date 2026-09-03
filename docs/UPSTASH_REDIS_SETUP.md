# Upstash Redis Setup Guide

**Task 3 — Initiative #11: Implement Redis State Layer**

> Serverless Redis for session persistence, rate-limit counters, and transient state.

---

## Overview

**Upstash** is a serverless Redis service (no infrastructure to manage).

**Benefits:**
- Pay-per-request (cheap at low volume)
- Auto-scaling
- Global edge locations
- Compatible with standard Redis client libraries

**Use Cases in EdutechLife:**
- Session storage (`user:<userId>` — 24h TTL)
- Rate-limit counters (`ratelimit:*` — 1h TTL)
- Transient data caching (`cache:*` — configurable TTL)

---

## Step 1: Create Upstash Account & Database

1. Go to [upstash.com](https://upstash.com)
2. Sign up (free tier available: 10k requests/day, 256 MB storage)
3. Create a **Redis Database**
   - Region: `us-east-1` (or closest to your backend)
   - Type: **Serverless Redis**
4. Copy **UPSTASH_REDIS_URL**

Example format:
```
redis://default:abc123xyz@abc123-upstash.upstash.io:6379
```

---

## Step 2: Set Environment Variable

### In Vercel (Frontend can't use Redis, but Render backend will)

Skip this if frontend doesn't need Redis.

### In Render Dashboard (Backend)

1. Go to **Settings** → **Environment**
2. Add new variable:
   - **Key:** `UPSTASH_REDIS_URL`
   - **Value:** (paste the full Redis URL from Upstash)
3. Save and redeploy

### Locally (for testing)

Add to `.env`:
```
UPSTASH_REDIS_URL=redis://default:YOUR_PASSWORD@YOUR_HOST:6379
```

---

## Step 3: Verify Connection

### Backend Health Check

Once deployed to Render:

```bash
curl https://edutechlife-backend.onrender.com/api/health
```

Look for `"redis": "connected"` in the startup logs.

### Local Testing

```bash
npm test -- redis.test.js
```

Expected output:
```
✓ Redis Client (3 tests)
  ✓ should connect to Redis
  ✓ should ping Redis
  ✓ should set and get a value
  ...
```

---

## Step 4: Usage in Backend Code

### Set User Session

```javascript
const { setUserSession } = require('./middleware/session');

// After login
await setUserSession(userId, {
  email: user.email,
  role: user.role,
  lastActivity: Date.now(),
  // ... any other data
});
```

### Get User Session

```javascript
const { getUserSession } = require('./middleware/session');

const session = await getUserSession(userId);
if (session) {
  console.log(session.email, session.role);
}
```

### Via Express Middleware

```javascript
// Middleware already attached to req.session
router.post('/api/protected', requireAuth, async (req, res) => {
  // Set session
  await req.session.set({ lastPage: '/dashboard' });

  // Get session
  const currentSession = await req.session.get();

  // Update session
  await req.session.update({ lastActivity: Date.now() });

  // Clear session (logout)
  await req.session.clear();
});
```

### Direct Redis Access

```javascript
const redis = require('./lib/redis');

// Set with TTL
await redis.set('cache:key', { data: 'value' }, 3600);

// Get
const data = await redis.get('cache:key');

// Increment counter (for rate limiting)
const count = await redis.incr('ratelimit:user123', 1, 60);

// Delete
await redis.del('cache:key');

// Check TTL
const remaining = await redis.ttl('cache:key');
```

---

## Namespace Convention

Use these prefixes to organize Redis keys:

| Prefix | TTL | Usage |
|--------|-----|-------|
| `user:` | 24h | Session data: `user:<userId>` |
| `ratelimit:` | 1h | Rate limit counters: `ratelimit:<endpoint>:<id>` |
| `session:` | 7d | Session tokens: `session:<sessionId>` |
| `cache:` | Custom | Transient data: `cache:<key>` |

Example keys:
```
user:550e8400-e29b-41d4-a716-446655440000
ratelimit:vision:550e8400-e29b-41d4-a716-446655440000
session:abc123def456
cache:student-profile-550e8400-e29b-41d4-a716-446655440000
```

---

## Monitoring & Debugging

### Upstash Dashboard

1. Log in to [console.upstash.com](https://console.upstash.com)
2. Click your database
3. View:
   - **Stats** → request count, command breakdown
   - **Monitor** → real-time command log
   - **Data Browser** → inspect keys and values

### Backend Logs (Render)

```bash
# Check Render logs for Redis errors
# Render Dashboard → Logs
```

Example good logs:
```
[info] Redis connected (Upstash)
[info] Redis client initialized
```

Example fallback logs (if Redis down):
```
[warn] UPSTASH_REDIS_URL not set. Redis features will be disabled.
[debug] Redis unavailable, skipping set: { key: 'user:xyz' }
```

---

## Cost Estimate

**Upstash Free Tier:**
- 10,000 requests/day
- 256 MB storage
- $0

**Pay-as-you-go (if exceeding free):**
- $0.20 per 100k requests
- $0.25 per GB/month storage

**EdutechLife Expected Usage:**
- Sessions: ~100 active users × 24 requests/day = 2,400 requests/day ✓ (under free tier)
- Rate limits: ~1,000 requests/day ✓
- Caching: ~500 requests/day ✓

**Total: ~4,000 requests/day — well under free tier (10k)**

---

## Graceful Degradation

If Redis is unavailable:

1. **Backend still works** (logs warning, continues)
2. **No session persistence** (data stored in-memory, lost on restart)
3. **Rate limits still active** (in-memory only, per-instance)
4. **No cascade failures** (timeout: 5s, then fallback)

Example logs:
```
[warn] UPSTASH_REDIS_URL not set. Redis features will be disabled.
[warn] Redis connection error: connect ECONNREFUSED
```

Backend continues normally; just without Redis benefits.

---

## Troubleshooting

### Issue: "Connection refused"
- Verify UPSTASH_REDIS_URL is correct
- Check Upstash dashboard: database running?
- Wait 2 minutes after creating database (initialization)

### Issue: "AUTH failed"
- Copy URL from Upstash, not from env var (if env var corrupted)
- Verify no trailing spaces in URL

### Issue: "Redis timeout"
- Check Render → Upstash network connectivity (usually fine)
- Verify Upstash database not paused (inactive 30 days = pause)

### Issue: "Redis memory full"
- Check Upstash Monitor for hot keys
- Implement key expiry consistently (all keys should have TTL)
- Upgrade to paid tier if needed

---

## Next Steps After Task 3 ✅

1. **Task 4:** Consolidate SQL schema
   - Audit Supabase migrations
   - Unify sources
   - DBA approval

2. **Task 5–8:** Parallelize
   - Refactor monolithic routes
   - Admin dashboard API
   - Repository hygiene
   - CI/CD hardening

---

## Acceptance Criteria

- [ ] Upstash database created, UPSTASH_REDIS_URL copied
- [ ] Redis client (`src/lib/redis.js`) implemented and tested
- [ ] Session middleware (`src/middleware/session.js`) integrated
- [ ] Redis initialized on backend startup
- [ ] Health check shows "redis: connected"
- [ ] Tests pass: `npm test -- redis.test.js`
- [ ] Manual test: set/get session data persists across restarts
- [ ] Load test: latency <50ms at 100 concurrent operations
- [ ] Graceful fallback if Redis unavailable
- [ ] Documentation complete

---

**Status:** Implementation ready, awaiting Upstash provisioning  
**Cost:** Free tier ($0 for typical usage)  
**SLA:** 99.99% uptime (Upstash guarantee)  

---

*Generated: Sep 2026 for Fase 2, Initiative #11*
