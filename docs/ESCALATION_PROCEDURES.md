# Incident Escalation & Response Procedures

Complete runbooks and escalation procedures for handling incidents by severity level.

## Table of Contents

1. [Severity Classification](#severity-classification)
2. [P0 - Critical (System Down)](#p0---critical-system-down)
3. [P1 - High (Major Feature Broken)](#p1---high-major-feature-broken)
4. [P2 - Medium (Degradation)](#p2---medium-degradation)
5. [P3 - Low (Minor Issues)](#p3---low-minor-issues)
6. [Post-Incident Review](#post-incident-review)

---

## Severity Classification

### Quick Decision Tree

```
Is the platform completely down (users cannot login)?
├─ YES → P0
└─ NO
   ├─ Can users not access their primary product (IALab or SmartBoard)?
   │  ├─ YES → P1
   │  └─ NO
   │     ├─ Can users access the product but with major feature broken?
   │     │  ├─ YES → P1
   │     │  └─ NO
   │     │     ├─ Is performance severely degraded (>50% slower)?
   │     │     │  ├─ YES → P2
   │     │     │  └─ NO → P3
   │     ├─ Are parents unable to receive critical alerts?
   │     │  ├─ YES → P1
   │     │  └─ NO → P2
```

### Severity Levels

| Level | Impact | Examples | Response Time | Owner |
|-------|--------|----------|----------------|-------|
| **P0** | System Down (0 users) | Auth broken, database down, all APIs failing | <5 min | On-call + Lead |
| **P1** | Major Feature Broken (>10% users) | Student can't access course, parent can't see child activity, payment processing down | <30 min | Assigned + Lead |
| **P2** | Significant Degradation (>5% impact) | Slow dashboards, search not working, notifications delayed | <2 hours | Assigned eng |
| **P3** | Minor Issue (<5% impact) | Typo, UI glitch, rare edge case | Next business day | Assigned eng |

---

## P0 - Critical (System Down)

### Activation Criteria

Any one of:
- [ ] Users cannot log in to any product
- [ ] Core database is down or corrupted
- [ ] Backend APIs responding with 5xx errors (>50% requests)
- [ ] All parent alert notifications failing
- [ ] Payment processing is down
- [ ] All student sessions timing out

### Response Procedure

**Immediate Actions (0-5 minutes)**

```
1. Acknowledge incident in #alerts
   Message: "P0 INCIDENT: [Brief description]"
   
2. Page on-call engineer
   If you're not the on-call, use PagerDuty/call directly
   
3. Join incident bridge
   Start Zoom: https://[company].zoom.us/my/incident-bridge
   Share link in #alerts
   
4. Gather facts
   □ When did it start? (check logs for timestamp)
   □ What's the error? (check Sentry, backend logs)
   □ How many users affected? (check active sessions)
   □ Was there a recent deployment? (check GitHub/Vercel)
   □ Database status? (check Supabase dashboard)
```

**Investigation (5-15 minutes)**

Choose one path based on symptoms:

**Path A: Backend Error (5xx errors)**
```
1. SSH into backend: ssh render-backend
2. Check logs: tail -n 100 /var/log/backend.log | grep ERROR
3. Check recent deployments: git log --oneline -5
4. Check database: psql -c "SELECT COUNT(*) FROM users;"
5. Check API response: curl -v https://api.edutechlife.co/health
```

**Path B: Database Issue**
```
1. Go to Supabase dashboard: https://app.supabase.com/
2. Check connection status in Settings → Database
3. Check active connections: SELECT * FROM pg_stat_activity;
4. Check query performance: SELECT * FROM pg_stat_statements LIMIT 10;
5. If corrupted: Contact Supabase support immediately
```

**Path C: Frontend Issue (SPA not loading)**
```
1. Check Vercel deployment: https://vercel.com/projects/edutechlife-frontend
2. Check if latest deploy succeeded
3. Check CDN status (Vercel edge)
4. Clear browser cache and test in incognito
5. Check if JavaScript bundle is loading (inspect Network tab)
```

**Path D: Third-party Service Down**
```
1. Check if Clerk auth is down: status.clerk.com
2. Check if Stripe is down: stripe.status.io
3. Check if Google Cloud is down: https://status.cloud.google.com
4. Check if AWS/Vercel is down: https://status.aws.amazon.com
```

**Mitigation Options (15-20 minutes)**

Based on root cause:

**Option 1: Immediate Rollback**
```bash
# If caused by recent deployment:
cd /edutechlife-backend
git revert [bad-commit-hash]
git push origin main

# Check deployment status
vercel --prod status

# Wait for rollback to complete (typically 5 min)
curl https://api.edutechlife.co/health
```

**Option 2: Database Recovery**
```
If corrupted data:
1. Contact Supabase support for recovery
2. Activate backup from last 6 hours
3. Restore to point-in-time backup

If connection pool exhausted:
1. Increase connection limit in Supabase settings
2. Kill long-running queries:
   SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
   WHERE state = 'idle' AND query_start < NOW() - INTERVAL '30 minutes';
```

**Option 3: Failover to Standby**
```
If primary is down and standby exists:
1. Update DNS to point to standby backend
2. Run database replication check
3. Verify all services are responding
```

**Option 4: Emergency Maintenance Mode**
```
If cannot resolve in <30 min:
1. Deploy maintenance page to Vercel
2. Post status update on status page
3. Notify customers via email
4. Keep working on fix in parallel

Maintenance page location:
/edutechlife-frontend/public/maintenance.html
```

### Communication

**Every 5 minutes during incident:**
- [ ] Post update to #alerts: "Still investigating, no ETA yet"
- [ ] Update Slack status with incident duration
- [ ] Keep incident bridge Zoom open

**When identified:**
- [ ] Post root cause to #alerts
- [ ] Estimated time to fix
- [ ] Expected user impact

**When fixed:**
- [ ] Post "P0 RESOLVED" in #alerts
- [ ] Include:
  - Root cause (one sentence)
  - Time to recovery
  - Impact summary
  - Next steps (monitoring, postmortem)

**Example Communication**:
```
🚨 P0 INCIDENT: Auth service failing
- Started: 2024-08-15 14:23 UTC
- Cause: Database connection pool exhausted
- Impact: Users cannot login (100% of traffic affected)
- ETA: 20 minutes to fix
- Status: Scaling connection pool

Will post update every 5 minutes.
```

### Escalation Chain

| Level | Time | Action |
|-------|------|--------|
| On-call | 0-5 min | Investigating |
| Lead | 10 min | Join incident call if not resolved |
| CTO/Founder | 20 min | Join if still not fixed |
| External Support | 30 min | Contact Vercel/Supabase if infrastructure issue |

### Post-Incident

- [ ] Update incident tracking in Sentry
- [ ] Create GitHub issue with "P0-incident" label
- [ ] Schedule postmortem within 24 hours
- [ ] Document root cause and prevention steps

---

## P1 - High (Major Feature Broken)

### Activation Criteria

Any one of:
- [ ] Students cannot access lessons/courses in IALab
- [ ] Parents cannot see child activity in SmartBoard
- [ ] Payment transactions are failing
- [ ] Crisis alerts not being sent to parents
- [ ] Teacher/admin cannot access critical dashboards
- [ ] Significant performance degradation (>2s load time)

### Response Procedure

**Step 1: Triage (5 minutes)**

```
□ Verify issue is reproducible
□ Check if it's specific to one product/user or widespread
□ Gather error details:
  - Browser console errors
  - Network tab 4xx/5xx errors
  - Sentry error reports
  - Backend logs for patterns
□ Create GitHub issue with "urgent" label
□ Notify engineering lead in #dev channel
```

**Step 2: Root Cause Analysis (15 minutes)**

Use appropriate path:

**Frontend Issue**
```
1. Check browser DevTools Console for errors
2. Check Network tab for failed API calls
3. Check Sentry for frontend errors: sentry.io/organizations/edutechlife
4. Check which endpoint is failing
5. Verify latest deployment status
```

**Backend Issue**
```
1. Check backend logs for errors in target endpoint
2. Check database query performance
3. Verify database connectivity
4. Check recent code changes to affected route
5. Check if it's a third-party API issue (Google TTS, DeepSeek, etc.)
```

**Database Issue**
```
1. Run query performance check
2. Look for missing indexes
3. Check table row counts
4. Check if specific users/institutions affected
```

**Step 3: Fix Implementation (30-60 minutes)**

Create GitHub branch and PR:
```bash
git checkout -b fix/p1-issue-description
# Make fix
git commit -m "fix(p1): brief description"
git push origin fix/p1-issue-description
# Open PR immediately, tag lead for review
gh pr create --draft --assignee @lead --label "urgent"
```

**Step 4: Testing & Deployment**

```bash
□ Run full test suite: npm test
□ Test in staging environment first
□ Get code review approval (<15 min for P1)
□ Deploy to production
□ Verify fix in production
□ Monitor error rate for 10 minutes
```

**Step 5: Notification**

Post to #alerts:
```
P1 FIXED: [Issue description]
- Root cause: [Brief explanation]
- Fix deployed at: [time]
- Monitoring: [What to watch for next 30 min]
```

### Escalation Chain

| Time | Action |
|------|--------|
| 0-5 min | On-call engineer investigating |
| 5-15 min | Notify engineering lead |
| 15-30 min | Lead joins to help if blocked |
| >30 min | Escalate to CTO for priority |

---

## P2 - Medium (Degradation)

### Activation Criteria

Any one of:
- [ ] Feature partially working but with delays (>2s)
- [ ] Some users affected (5-25%) but product still usable
- [ ] Performance degradation causing user friction
- [ ] Search/filtering significantly slower
- [ ] Export/report generation very slow

### Response Procedure

**Step 1: Log & Assign (within 1 hour)**

```
□ Create GitHub issue with label "bug"
□ Gather reproduction steps
□ Note affected user count
□ Determine priority within P2:
  - P2-Critical: >20% users affected
  - P2-Normal: 5-20% affected
  - P2-Low: <5% affected
□ Assign to available engineer
```

**Step 2: Analysis (2 hours)**

```
□ Reproduce issue locally
□ Identify performance bottleneck (use browser DevTools/Lighthouse)
□ Check database query performance
□ Identify root cause
□ Estimate fix effort
```

**Step 3: Implementation**

- If quick fix (<1 hour): Fix immediately and deploy
- If complex fix (>1 hour): Schedule for next sprint, add workaround if possible
- If workaround exists: Deploy workaround immediately

**Step 4: Monitoring**

- [ ] Monitor metrics for 30 minutes after fix
- [ ] Add monitoring/alerting to prevent recurrence
- [ ] Update metrics in weekly review

---

## P3 - Low (Minor Issues)

### Activation Criteria

- [ ] Typos or minor UI issues
- [ ] Rare edge cases affecting <5% of users
- [ ] Non-critical functionality broken
- [ ] Documentation gaps

### Response Procedure

**Step 1: Create Issue**
```
□ Create GitHub issue with label "bug"
□ Add to backlog
□ No immediate action needed
```

**Step 2: Schedule Fix**
- Add to next sprint backlog
- No rush to fix
- Can be combined with other work

---

## Post-Incident Review

### Immediate (within 24 hours)

**For P0/P1 incidents:**

1. **Incident Summary Document**
   - Timeline of events
   - Root cause
   - How it was discovered
   - Resolution steps taken

2. **Create GitHub Issue** with template:
   ```markdown
   # [P0/P1] Incident: [Description]
   
   ## Timeline
   - 14:23: Issue started
   - 14:28: Identified
   - 14:35: Fixed
   - 14:40: Confirmed resolved
   
   ## Root Cause
   [What caused the issue]
   
   ## Prevention
   [How to prevent in future]
   
   ## Action Items
   - [ ] Add monitoring/alerting
   - [ ] Add test coverage
   - [ ] Documentation update
   ```

### Follow-up (within 72 hours)

**Postmortem Meeting**
- 30 minutes with involved engineers
- Review what worked, what didn't
- Assign owner for prevention work
- Update runbook based on learnings

**Prevention Implementation**
- Add monitoring alert if it would have caught this
- Add test case if preventable by tests
- Document known issues in runbook
- Update escalation procedures

### Metrics Tracking

**Monthly Incident Report**:
| Metric | Target | This Month |
|--------|--------|------------|
| P0 Count | 0-1 | __ |
| P1 Count | <3 | __ |
| Avg MTTR (P0) | <30 min | __ |
| Avg MTTR (P1) | <2 hours | __ |
| MTTF (Mean Time To Failure) | >14 days | __ |

---

## Escalation Contact Matrix

| Role | Name | Phone | Slack | Availability |
|------|------|-------|-------|--------------|
| On-Call | [Current] | [#] | @oncall | 24/7 |
| Engineering Lead | [Name] | [#] | @lead | 09:00-18:00 |
| Backend Lead | [Name] | [#] | @backend | 09:00-18:00 |
| Frontend Lead | [Name] | [#] | @frontend | 09:00-18:00 |
| CTO | [Name] | [#] | @cto | 09:00-20:00 |
| Founder | [Name] | [#] | @founder | Urgent only |

---

## Tools & Resources

- **Sentry Dashboard**: https://sentry.io/organizations/edutechlife/
- **Vercel Dashboard**: https://vercel.com/projects/edutechlife-frontend
- **Render Backend**: https://render.com/dashboard
- **Supabase Console**: https://app.supabase.com/
- **Status Page**: [Internal link]
- **Incident Bridge**: https://[company].zoom.us/my/incident-bridge

---

## Appendix: Common Issues & Solutions

### "Users cannot login"

```
1. Check Clerk auth service status: status.clerk.com
2. Verify Clerk API keys in backend: grep CLERK_SECRET_KEY .env
3. Check Supabase JWT issues: Look for JWT validation errors in logs
4. Test auth endpoint: curl -X POST https://api.edutechlife.co/auth/login

If Clerk is down:
- Cannot fix on our end, wait for Clerk recovery
- Post status update
- Consider temporary bypass (not recommended)
```

### "Database connection pool exhausted"

```
1. Check active connections in Supabase:
   SELECT COUNT(*) FROM pg_stat_activity;
   
2. Increase pool size in Supabase settings
3. Kill idle connections:
   SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
   WHERE state = 'idle';
   
4. Restart backend service to reset connection pool
```

### "Memory leak causing OOM (out of memory)"

```
1. Restart backend service immediately (P0 mitigation)
2. Enable memory profiling: NODE_OPTIONS=--max-old-space-size=4096
3. Investigate in logs for memory leak patterns
4. Deploy fix
5. Monitor memory usage
```

### "Too many open database connections"

```
See: Database connection pool exhausted (above)
Additional: Check for:
- Long-running queries not closing connections
- Connection leak in code (not calling disconnect)
- Tests not cleaning up connections
```

### "API response time spikes"

```
1. Check if it's a specific endpoint: cloudflare analytics
2. Check database query performance
3. Check if third-party API is slow (Google TTS, DeepSeek)
4. Increase caching if applicable
5. Optimize slow query with indexes
```
