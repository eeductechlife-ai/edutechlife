# Fase 3 SmartBoard — Deployment Readiness Guide

**Date:** 2026-09-05  
**Status:** Ready for Staging Smoke Test → Production Deployment  
**Commits:** `d82d55bf` (implementation) + `cde04077` (security fixes)

---

## Pre-Deployment Checklist

### Code & Build
- [x] All 4 Fase 3 tasks implemented (sessions, academic_context, achievements, UI)
- [x] Build passes (`npm run build` clean)
- [x] 1427 tests passing
- [x] ESLint + Prettier auto-fixed
- [x] Security audit complete (3 IDOR/race/path bugs fixed)
- [x] TypeScript types complete
- [x] RLS policies verified in migration 059

### Database (Production: `srirrwpgswlnuqfgtule`)
- [x] Migration 073 applied (MFA TOTP columns)
- [x] Migration 059 applied (9 SmartBoard tables + RLS)
- [x] All tables exist with correct schema
- [x] RLS policies enforce student ownership
- [x] Triggers functional (update_last_activity, award_achievement, etc.)

### Environment
- [x] `SUPABASE_SERVICE_ROLE_KEY` configured in Render backend
- [ ] **TODO:** Verify in Render dashboard (confirm not using legacy `SUPABASE_SERVICE_KEY`)
- [x] Supabase JWT auth working (verified in build)
- [x] Frontend env vars pointing to production Supabase project

### Infrastructure
- [x] Staging Supabase (`dxirtihrpnlnxkxpmkmx`) available for smoke tests
- [x] Production Supabase (`srirrwpgswlnuqfgtule`) schema synced
- [x] Render backend can reach production Supabase
- [x] Vercel frontend can reach production Supabase

---

## Deployment Strategy

### Phase 1: Staging Validation (Today, 1-2 hours)

**Goal:** Verify Fase 3 works end-to-end on staging before production push.

**Steps:**

1. **Deploy to staging frontend (Vercel preview branch)**
   ```bash
   git push origin recovery/foundation-phase-a  # or create PR
   Vercel auto-deploys on push
   Wait for build to complete (~3min)
   ```

2. **Create test student on staging Supabase**
   ```bash
   # Via Supabase SQL Editor on dxirtihrpnlnxkxpmkmx
   INSERT INTO users (email, user_type) VALUES ('test-fase3@staging.local', 'student');
   -- Copy user.id
   INSERT INTO students (auth_id, name, age) VALUES ('<user.id>', 'Test Fase 3', 10);
   ```

3. **Smoke test session lifecycle on staging**
   - Open staging frontend as test student
   - Open SmartBoard
   - Check Supabase SQL Editor: `SELECT * FROM sessions WHERE student_id = '<student_id>' ORDER BY start_time DESC LIMIT 1`
   - Verify: `start_time` exists, `end_time` is NULL
   - Close SmartBoard
   - Refresh query: `end_time` ≠ NULL, `duration_minutes` > 0
   - **✅ PASS if:** Session appears and ends correctly

4. **Smoke test academic context sync**
   - As test student, open a subject (e.g., Matemáticas)
   - Spend 5+ minutes on it
   - Query: `SELECT * FROM academic_context WHERE student_id = '<student_id>' AND subject = 'Matemáticas'`
   - Verify: `lessons_completed > 0`, `average_score >= 0`
   - **✅ PASS if:** Row exists and auto-populated

5. **Smoke test achievements display**
   - Seed 2-3 achievements in staging DB:
     ```sql
     INSERT INTO achievements (student_id, achievement_type, title, points_awarded, earned_at)
     VALUES ('<student_id>', 'test_badge_1', 'Test Badge 1', 100, NOW());
     ```
   - Reload SmartBoard
   - Look for "Logros Desbloqueados" section in RewardsGrid
   - Verify: Achievement badge visible with title
   - **✅ PASS if:** Achievements appear in UI

6. **Smoke test RLS isolation (critical security)**
   - Create second test student on staging
   - As Student A: Verify you see only your sessions/achievements
   - Attempt (frontend) to access Student B's session via query parameter or hack
   - Verify: Blocked by RLS at DB level (Supabase error)
   - **✅ PASS if:** No cross-student access possible

7. **Performance baseline**
   - Create 50 sessions rapidly (script)
   - Measure: Time to create all 50, verify no duplicates
   - Baseline: < 5 seconds, no errors
   - **✅ PASS if:** < 5sec and 50 rows created

8. **Error recovery**
   - Disable Supabase temporarily (network kill)
   - Open SmartBoard (should fail gracefully, no crash)
   - Re-enable Supabase
   - Verify: Session retry and eventually syncs
   - **✅ PASS if:** No app crash, retry works

---

### Phase 2: Production Deployment (After staging ✅)

**Goal:** Deploy to production once staging validates all scenarios.

**Steps:**

1. **Backup production Supabase**
   ```bash
   # Supabase Dashboard → Backups → Request backup
   # Wait for backup to complete (usually < 5min)
   ```

2. **Deploy to production**
   ```bash
   # Vercel: Select main branch (auto-deploy on merge)
   # Or manually deploy if needed
   git checkout main && git merge recovery/foundation-phase-a
   git push origin main
   # Vercel deploys automatically
   ```

3. **Run smoke tests on production** (same as staging)
   - Create prod test student
   - Verify session lifecycle, academic_context, achievements, RLS
   - Measure performance baseline
   - Error recovery test

4. **Monitor production logs** (first 24 hours)
   - Check backend logs for session creation errors
   - Monitor Supabase query performance (watch for slow writes)
   - Alert if: >1% error rate, session creation latency > 500ms

---

## Rollback Plan (If Issues Found)

**If staging smoke test fails:**
1. Do NOT deploy to production
2. Check the failing scenario (from checklist above)
3. File bug + prioritize fix
4. Re-test on staging after fix

**If production issues detected (after deployment):**
1. **Soft rollback (no data loss):**
   - Disable session creation: Set `sessionCreateMutation.mutate()` to no-op
   - Revert code, redeploy frontend
   - Existing sessions/achievements remain in DB (safe)

2. **Hard rollback (if data corruption):**
   - Use Supabase backup from before deployment
   - Restore database point-in-time
   - Re-investigate root cause

---

## Production Monitoring (First 48 hours)

**Metrics to watch:**

| Metric | Threshold | Action |
|--------|-----------|--------|
| Session creation latency | > 500ms | Investigate Supabase query performance |
| Session end errors | > 1% | Check RLS or IDOR issues |
| Duplicate sessions per student | > 0 | Check StrictMode guard / race condition |
| Duplicate achievements | > 0 | Check upsert dedup logic |
| RLS violations (403 errors) | > 0 | Verify policies are enforced |
| Backend error rate | > 1% | Check logs for service_role key issues |

**Setup monitoring:**
- Backend logs: Monitor `/api/smartboard/` endpoints for session errors
- Supabase: Check Query Performance tab for slow writes
- Sentry/Error tracking: Set up if available
- Manual spot-checks: Every 2 hours, verify a student's sessions/achievements in prod DB

---

## What Happens at Each Phase Boundary

### End of Staging
- ✅ All smoke tests pass
- ✅ No cross-student access violations
- ✅ Performance baseline established
- ✅ Error recovery verified

**→ Proceed to Production**

### End of Deployment
- ✅ Frontend deployed to Vercel
- ✅ Smoke tests pass on production
- ✅ Monitoring armed
- ✅ Rollback plan ready

**→ Fase 3 Live in Production**

### End of 48h Monitoring
- ✅ No critical errors
- ✅ Session/achievement data growing normally
- ✅ Performance stable

**→ Fase 3 Declared Production-Ready**

---

## Known Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| StrictMode double-mount | Test [1.2] verifies; `isSessionInitializedRef` guard prevents |
| IDOR on session end | Fixed in commit `cde04077`; useSessionEnd checks `student_id` |
| Achievement dedup spiral | Upsert `onConflict` logic; test [3.2] stress tests 100 syncs |
| RLS bypass | Migration 059 policies verified; test [4.1] confirms |
| Trigger latency (1-3s) | Tests retry with exponential backoff; acceptable for analytics |

---

## Handoff Checklist (For Ops/DevOps)

- [ ] Supabase backup created pre-deployment
- [ ] Monitoring dashboards configured
- [ ] Rollback runbook posted to team Slack
- [ ] On-call engineer aware of Fase 3 deployment
- [ ] Post-deployment smoke test script ready
- [ ] 48h monitoring schedule assigned

---

## Success Criteria (Fase 3 Complete)

- ✅ Students' sessions tracked in real-time
- ✅ Subject progress synced per subject
- ✅ Achievements visible in UI
- ✅ RLS enforced (no cross-student access)
- ✅ 48-hour production monitoring shows stability
- ✅ No data corruption or duplicates

**Estimated Timeline:**
- Staging validation: 1–2 hours
- Production deployment: 15 minutes
- 48h monitoring: Passive (background)
- **Total:** ~2 hours active work + 48h monitoring

---

## Next Steps (After Fase 3 Live)

1. **Fase 4 Options:**
   - IALab UX 12-task sprint
   - Parent notifications (crisis_alerts → email/push)
   - Analytics dashboard (Valeria)

2. **Post-Deployment:**
   - Monitor production for 48h
   - Collect user feedback
   - Fix any edge cases discovered

3. **Retrospective:**
   - What went well? (RLS policies, React Query integration)
   - What was hard? (StrictMode guard, trigger latency)
   - Lessons for next phase?

---

## Contact & Support

- **DevOps:** For Supabase backup/restore questions
- **Backend Team:** For `SUPABASE_SERVICE_ROLE_KEY` configuration
- **Frontend Team:** For Vercel deployment issues
- **On-Call:** For production incidents

**Escalation Path:** Engineer → Tech Lead → Ops Lead

---

**Status:** Ready for staging validation. Proceed when smoke test agent completes.
