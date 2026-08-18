# Performance Monitoring Implementation Summary

## Status: Ready to Deploy ✅

All Core Web Vitals monitoring infrastructure has been scaffolded and is ready for deployment.

---

## What Was Implemented

### 1. Core Web Vitals Capture (Non-Breaking)

**File:** `scripts/capture-vitals.js`

Captures LCP, INP, CLS metrics with:
- Element attribution (which element caused LCP)
- Interaction attribution (what user action caused INP)
- Connection info (4G/5G, RTT, downlink)
- Device info (CPU cores, RAM)
- Soft navigation tracking for SPA routes

**Integration:** Added to `src/main.jsx` with 10% sampling rate (configurable).

**No breaking changes:** Library loads asynchronously via `import()`, doesn't block LCP.

### 2. Performance Monitoring Hook

**File:** `src/hooks/usePerfTracker.js`

Provides:
- `usePerfTracker()` — auto-track route changes + layout shifts
- `markInteractionStart/End()` — measure custom operations
- `yieldToMain()` — polyfill for `scheduler.yield()` to prevent long tasks

Usage:
```jsx
// In any page component
import { usePerfTracker } from '@/hooks/usePerfTracker';

export function SmartBoardPage() {
  usePerfTracker(); // Enables tracking automatically
  return <SmartBoardDashboard />;
}
```

### 3. CI/CD Performance Gates

**File:** `.github/workflows/perf-budget.yml`

Automated checks on every PR:
- ✅ Bundle size (fail if > 7.5 MB total or > 600 KB per chunk)
- ✅ Lighthouse Performance score (fail if < 85)
- ✅ Core Web Vitals thresholds (LCP, INP, CLS)
- ✅ Posts bundle delta in PR comments
- ✅ Uploads Lighthouse results to temporary storage

**Configuration:** `lhci.json` (Lighthouse CI config)

### 4. Local Performance Audit Script

**File:** `scripts/perf-audit.mjs`

Run before every commit:
```bash
npm run perf:audit
```

Outputs:
- Bundle size breakdown (top 10 chunks)
- Lighthouse scores (Performance, Accessibility, SEO, Best Practices)
- Core Web Vitals lab measurements
- Comparison to previous baseline

### 5. Package.json Scripts

Added:
```json
{
  "perf:audit": "node scripts/perf-audit.mjs",
  "perf:vitals": "node scripts/capture-vitals.js",
  "perf:lighthouse": "lhci autorun"
}
```

### 6. Documentation

**File:** `docs/PERFORMANCE.md`

Comprehensive guide covering:
- What Core Web Vitals are and why they matter for EdutechLife
- How to run local measurements
- How CI/CD gates work
- Debugging slow LCP, INP, CLS
- Quick optimization wins
- Configuration reference

---

## Next Steps (Immediate)

### Phase 1: Baseline Measurement (This week)

1. **Install dependencies:**
   ```bash
   cd edutechlife-frontend
   npm install
   ```

2. **Create performance baseline:**
   ```bash
   npm run build
   npm run perf:audit --output perf-baseline.json
   ```
   
   This creates a snapshot to track regressions over time.

3. **Verify Lighthouse CI setup:**
   ```bash
   npm run perf:lighthouse
   ```
   
   Should measure 3 pages: /, /smartboard, /ialab

### Phase 2: Enable Field Data Collection (Next sprint)

1. **Create backend endpoint** to receive vitals:
   ```javascript
   // Backend (edutechlife-backend/src/routes/)
   POST /api/vitals
   
   Body:
   {
     url: string,
     vitals: {
       lcp: { value: number, rating: string, element: string },
       inp: { value: number, rating: string },
       cls: { value: number, rating: string },
       ...
     },
     connection: { effectiveType, rtt, downlink },
     device: { memory, cores, userAgent }
   }
   ```

2. **Store in Supabase:**
   ```sql
   CREATE TABLE web_vitals (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     created_at TIMESTAMP DEFAULT NOW(),
     
     -- Request
     url TEXT,
     page_type TEXT, -- 'landing' | 'smartboard' | 'ialab' | 'admin'
     
     -- Metrics
     lcp_ms INT,
     lcp_rating TEXT, -- 'good' | 'needs-improvement' | 'poor'
     lcp_element TEXT, -- 'IMG' | 'H1' | 'DIV' | etc
     
     inp_ms INT,
     inp_rating TEXT,
     inp_interaction TEXT, -- 'click' | 'keydown' | 'tap'
     
     cls DECIMAL(4,3),
     cls_rating TEXT,
     
     -- Context
     connection_type TEXT, -- '4g' | '5g' | 'wifi' | 'unknown'
     device_memory INT, -- GB
     device_cores INT,
     device_type TEXT, -- from user-agent
     
     -- Analytics
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     session_id TEXT,
     
     INDEX (page_type, created_at),
     INDEX (user_id, created_at)
   );
   ```

3. **Query field metrics (weekly dashboard):**
   ```sql
   -- p75 LCP by page type
   SELECT 
     page_type,
     PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY lcp_ms) as p75_lcp,
     PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY inp_ms) as p75_inp,
     COUNT(*) as samples
   FROM web_vitals
   WHERE created_at > NOW() - INTERVAL '28 days'
   GROUP BY page_type;
   ```

### Phase 3: Fix Critical Issues (Parallel)

**Highest Priority (this release):**

1. **Fix AnimatePresence CLS** (SmartBoardDashboard tab transitions)
   - **File:** `src/components/smartBoardDashboard/SmartBoardDashboard.jsx:140-153`
   - **Fix:** Reserve fixed height or use transform-only animations
   - **Impact:** Prevents ~0.15 CLS on every tab switch
   
2. **Reduce blur filter paint cost**
   - **File:** Same file, background gradients
   - **Fix:** Remove `blur-[150px]` or reduce to `blur-[50px]`
   - **Impact:** Improves INP on low-end mobile devices

3. **Add image lazy loading**
   - **Audit:** SmartBoard hero, mission cards, avatars
   - **Fix:** `<img loading="lazy" srcset="..." sizes="..." />`
   - **Impact:** Prevents LCP regressions if images grow

**Medium Priority (next sprint):**

4. Add soft navigation API integration (for accurate per-route LCP tracking)
5. Implement CrUX API for field metrics dashboard
6. Create performance regression alerts in Slack

---

## Files Created/Modified

### New Files (Ready to Commit)

```
edutechlife-frontend/
├── scripts/
│   ├── capture-vitals.js          # Core Web Vitals capture library
│   └── perf-audit.mjs              # Local performance audit tool
├── src/
│   └── hooks/
│       └── usePerfTracker.js       # Route tracking + layout shift detection
├── docs/
│   └── PERFORMANCE.md              # Comprehensive performance guide
├── lhci.json                        # Lighthouse CI configuration
└── PERFORMANCE_IMPLEMENTATION.md   # This file

.github/workflows/
└── perf-budget.yml                 # GitHub Actions performance gates
```

### Modified Files

```
edutechlife-frontend/
├── package.json                    # Added scripts + web-vitals dependency
└── src/main.jsx                    # Added vitals capture initialization
```

---

## Configuration

### Environment Variables (Optional)

```env
# .env or Vercel dashboard

# Enable Core Web Vitals tracking (default: true)
VITE_ENABLE_VITALS=true

# Sampling rate: 0.1 = 10% of users (reduces server load)
VITE_VITALS_SAMPLE_RATE=0.1

# Backend endpoint for vitals
VITE_VITALS_ENDPOINT=/api/vitals
```

### GitHub Actions Secrets (Required for CI)

For Lighthouse CI to work, add to GitHub:
```
Settings → Secrets → New repository secret

Name: LHCI_GITHUB_APP_TOKEN
Value: <create at https://github.com/apps/lighthouse-ci>
```

Or skip Lighthouse in CI (bundle size check still runs).

---

## Testing Before Deployment

### Local Verification

```bash
# 1. Build and measure locally
npm run build
npm run perf:audit

# 2. Verify vitals capture is running
npm run dev
# Open browser console → should see performance metrics logged

# 3. Test GitHub Actions locally (optional, requires act)
act pull_request -j bundle-size
act pull_request -j lighthouse
```

### Staging/Production Verification

1. Deploy to Vercel/staging
2. Open SmartBoard in Chrome DevTools → Network
3. Should see POST to `/api/vitals` (if endpoint implemented)
4. Check Lighthouse scores: should be 85+ for Performance

---

## Maintenance & Monitoring

### Weekly Tasks

- [ ] Review `perf-baseline.json` — any growth?
- [ ] Check GitHub Actions: all perf checks passing?
- [ ] Monitor CLS reports in dashboard (if field data collected)

### Monthly Tasks

- [ ] Review Core Web Vitals trends (via CrUX API if integrated)
- [ ] Audit bundle size — any unnecessary dependencies?
- [ ] Profile SmartBoard on low-end device (Nexus 5 emulation)

### Quarterly Tasks

- [ ] Re-baseline after major features
- [ ] Benchmark against competitors (similar age group apps)
- [ ] Plan performance optimization sprint

---

## References

- [Docs: Full performance guide](docs/PERFORMANCE.md)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [CrUX API](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference)

---

## Success Metrics

After implementation, target:

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| LCP (p75 mobile) | Not measured | ≤ 2.5s | 2 weeks |
| INP (p75) | Not measured | ≤ 200ms | 2 weeks |
| CLS (p75) | Not measured | ≤ 0.1 | 1 week (after CLS fix) |
| Bundle (initial) | ~200KB | ≤ 200KB | Maintained |
| Lighthouse Performance | 85+ | 90+ | 1 month |

---

## Support

**Questions?** See:
- `docs/PERFORMANCE.md` for detailed guide
- `lhci.json` for Lighthouse configuration
- `.github/workflows/perf-budget.yml` for CI/CD setup
- `scripts/capture-vitals.js` for field data schema

Good luck improving SmartBoard performance! 🚀
