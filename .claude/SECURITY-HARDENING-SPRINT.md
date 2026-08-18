# 🔐 Security Hardening Sprint — OAuth + npm Vulnerabilities
## Urgent Fix Before Pedagogical UX Launch

**Sprint Start:** 2026-08-15  
**Estimated Duration:** 2-3 days  
**Status:** 🚀 ACTIVE  
**Branch:** `security/*` → merge to `main` (NOT pedagogical-ux)  

---

## 🚨 Critical Issues (Must Fix Today)

### 1. OAuth Tokens in URL Query String
**Severity:** 🔴 CRITICAL  
**File:** `edutechlife-backend/src/routes/auth.js:569`  
**Problem:** Access token + refresh token exposed in URL
```javascript
// VULNERABLE:
res.redirect(`${frontendUrl}/auth/callback?token=${sessionToken}&refreshToken=${refreshToken}`);

// FIXED:
res.cookie('auth_token', sessionToken, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 3600000 });
res.redirect(`${frontendUrl}/auth/callback?status=success`);
```
**Impact:** Tokens visible in browser history, HTTP referrer, server logs  
**PR Branch:** `security/oauth-token-exposure`  
**Status:** [x] ✅ IMPLEMENTED
**Commit:** `c7d4d6f` (backend) + `e9b06bc` (frontend)
**Details:**
- Backend: httpOnly, Secure, SameSite cookies set on both `/callback` and `/oauth-demo`
- Frontend: OAuthCallbackHandler updated to read status param instead of tokens from URL
- Supabase client auto-restores session from cookies

### 2. State Parameter Not Validated (CSRF)
**Severity:** 🔴 CRITICAL  
**File:** `edutechlife-backend/src/routes/auth.js:446`  
**Problem:** State only split by provider, no nonce validation
```javascript
// VULNERABLE:
const provider = state.split(':')[0];  // Ignores nonce!

// FIXED:
const stateData = await oauthStateStore.validateState(state);
if (!stateData) return res.redirect(`${frontendUrl}/login?error=invalid_oauth_state`);
// Single-use, TTL=5min, server-side validation
```
**Impact:** CSRF attack possibility  
**Status:** [x] ✅ IMPLEMENTED
**Details:**
- Server-side oauthStateStore with Redis/in-memory fallback
- Each state generated with 24-byte random + provider
- Single-use (deleted after validation)
- TTL: 5 minutes (sufficient for OAuth flow)

### 3. Facebook Access Token in URL
**Severity:** 🔴 CRITICAL  
**File:** `edutechlife-backend/src/routes/auth.js:496`  
**Problem:** Token passed in query string instead of Authorization header
```javascript
// VULNERABLE:
const userUrl = `${url}?fields=id,name,email&access_token=${accessToken}`;

// FIXED:
const userUrl = `${url}?fields=id,name,email`;
const userResponse = await fetch(userUrl, {
  headers: { Authorization: `Bearer ${accessToken}` }
});
```
**Impact:** Token leaks in proxy/CDN logs, referrer headers  
**Status:** [x] ✅ IMPLEMENTED
**Commit:** `c7d4d6f`
**Details:**
- Both Google and Facebook now consistently use Authorization header
- Facebook fields param moved from URL query to consistent headers approach

---

## 🔴 High Priority Issues (Fix Tomorrow)

### 4. Open Redirect Protection
**Severity:** 🟠 HIGH  
**File:** `edutechlife-backend/src/routes/auth.js:383`  
**Status:** [ ] TODO
**PR Branch:** `security/redirect-protection`

### 5. npm Vulnerabilities
**Severity:** 🟠 HIGH  
**Status:** [x] ✅ IMPLEMENTED
**Commits:** `f849d2e` (backend) + `0d19d9d` (frontend)

**Fixes Applied:**
- **Backend:** uuid 9.0.1 → 11.1.1, tar 7.5.7 → 7.5.22
- **Frontend:** npm audit fix (12 packages updated, 47 → 38 vulns)

**Remaining High-Severity Vulnerabilities (Development Only):**
- decompress (Zip Slip) — transitive of prerenderer build tool
- esbuild/vite (CSRF in dev server) — dev dependencies, not production
- xlsx (Prototype Pollution) — library limitation, no fix available
- brace-expansion, braces — transitive of build tools

**Assessment:**
- Runtime dependencies: ✅ Current & secure
- Development dependencies: Remaining vulnerabilities non-exploitable in production
- Build tools can be made optional or replaced if needed

---

## 📋 Medium Priority Issues (Fix This Sprint)

| # | Issue | File | Status |
|---|-------|------|--------|
| 6 | Rate limiting disabled in dev | rateLimiter.js | [ ] TODO |
| 7 | Weak CSRF state | auth.js | [ ] TODO |
| 8 | Demo endpoint weak security | auth.js | [ ] TODO |
| 9 | Partial XSS in sanitization | sanitize.js | [ ] TODO |
| 10 | Verbose error messages | auth.js | [ ] TODO |

---

## ✅ Implementation Checklist

### Day 1 (Today) — Critical OAuth Fixes
- [x] Fix OAuth token exposure (httpOnly cookies) — `c7d4d6f`, `e9b06bc`
- [x] Fix state validation (server-side check) — Already implemented
- [x] Fix Facebook token header — `c7d4d6f`
- [x] Backend implementation complete
- [ ] QA test: Google OAuth login flow
- [ ] QA test: Facebook OAuth login flow
- [ ] QA test: Tokens NOT in browser history/referrer
- [ ] Merge to `main` when QA passes

### Day 2 (Completed) — High Priority + npm
- [x] Fix open redirect protection — Already implemented (ALLOWED_REDIRECT_HOSTS)
- [x] npm audit fix (uuid + tar + 12 frontend packages) — `f849d2e`, `0d19d9d`
- [x] Backend builds without errors
- [x] Frontend builds without errors
- [ ] Full integration test (end-to-end auth flows) — Next: QA phase

### Day 3 (Optional) — Medium Priority + Verification
- [ ] Rate limiting in dev environments
- [ ] Demo endpoint security
- [ ] Sanitization bypasses
- [ ] Final security audit verification

---

## 🧪 QA Checklist (Before Merging Each PR)

- [ ] Code review completed (security-focused)
- [ ] Unit tests pass
- [ ] Integration tests pass (auth flows)
- [ ] Manual testing:
  - [ ] Google OAuth login works
  - [ ] Facebook OAuth login works
  - [ ] Tokens NOT in browser history
  - [ ] Tokens NOT in referrer headers
  - [ ] State validation rejects invalid values
  - [ ] Redirect protection rejects invalid URLs
- [ ] npm audit shows 0 HIGH/CRITICAL
- [ ] Load test (1000 auth requests/min)

---

## 🔄 Merge Strategy

**Branch → PR → Review → Merge to main:**
```
security/oauth-token-exposure → PR #X → Review → Merge to main
security/state-validation → PR #X → Review → Merge to main
security/facebook-token-header → PR #X → Review → Merge to main
security/redirect-protection → PR #X → Review → Merge to main
security/npm-vulnerabilities → PR #X → Review → Merge to main
```

**After all merged to main:**
```
main (with security fixes)
  ↓
pedagogical-ux (resumes from secure main)
```

---

## 📞 Escalation

**Blocker?** → SendMessage to "security-hardening-lead"
- Include: issue, why blocked, suggested approach
- Priority: respond within 1 hour

---

## 🎯 Success Criteria

✅ Sprint complete when:
- All 3 CRITICAL fixes merged to `main`
- All HIGH fixes merged to `main`
- npm audit: 0 HIGH/CRITICAL vulnerabilities
- End-to-end auth tests passing
- Staging environment verified
- `pedagogical-ux` can safely resume from secure `main`

---

## 📊 Status Tracking

| Fix | Start | PR Ready | Merged | Verified |
|-----|-------|----------|--------|----------|
| 1. Token exposure | [ ] | [ ] | [ ] | [ ] |
| 2. State validation | [ ] | [ ] | [ ] | [ ] |
| 3. FB token header | [ ] | [ ] | [ ] | [ ] |
| 4. Redirect protect | [ ] | [ ] | [ ] | [ ] |
| 5. npm fixes | [ ] | [ ] | [ ] | [ ] |

---

## 📋 Documents

- **Detailed Audit Report:** Provided in security audit
- **Remediation Guide:** In audit (code examples)
- **Test Cases:** To be created in QA phase
- **Deployment Plan:** After all fixes verified

---

**Last Updated:** 2026-08-15 (Sprint Start)  
**Next Update:** Daily status sync  
**Contact:** Security Hardening Lead

🔒 **Priority: CRITICAL — Security Before Features**
