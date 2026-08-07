# Phase 4: Performance Deep-Dive Strategy

## Current State Analysis (Post Phase 3)

### Bundle Breakdown (After Phase 3 Optimizations)

| Asset | Size (gzip) | Status | Notes |
|-------|-------------|--------|-------|
| jspdf.es.min | 121.51 KB | ✅ Lazy | Certificate generation (IALab) |
| html2pdf | 218.60 KB | ✅ Lazy | HTML→PDF conversion (ConsultoriaB2B, AIPanel, etc.) |
| animation-vendor | 63.83 KB | ⚠️ Always | Framer Motion + Lottie (196 KB raw) |
| charts-vendor | 110.89 KB | ⚠️ Always | Chart library (397 KB raw) |
| es.json | 86.77 KB | ✅ Lazy | Spanish translations |
| pt.json | 87.22 KB | ✅ Lazy | Portuguese translations |
| en.json | 80.89 KB | ✅ Lazy | English translations |
| index (main) | 124.42 KB | 🔴 Always | App core |

### Performance Profile Post-Phase 3

**Route: /ialab (Dashboard)**
- Initial parse time: **~300ms** (down from ~1.2s)
- Dashboard render: **~400ms**
- WelcomeTour display: **~300ms** (down from ~1200ms)
- First Contentful Paint: **~2.0s** (target: <2.5s ✅)
- Largest Contentful Paint: **~2.3s** (target: <2.5s ✅)

**Route: /consultoria (PDF download)**
- html2pdf lazy load on demand: **~150-200ms** (non-blocking)
- PDF generation: **2-3s** (user-initiated, acceptable)

## Phase 4 Optimization Candidates

### Priority 1: Animation Vendor Lazy-Load (Quick Win)
**Effort:** 2-3 hours | **Savings:** ~60 KB gzipped | **Impact:** Medium

**Analysis:**
- `animation-vendor` (196 KB raw, 63 KB gzipped) contains Framer Motion + Lottie
- Used only in specific routes: IALabDashboard, SmartBoard, landing hero
- Currently bundled in main chunk, loaded even in routes like /consultoria (text-only)

**Implementation:**
```javascript
// Before: Static import
import { motion } from "framer-motion";

// After: Lazy import wrapper
const MotionComponent = lazy(async () => {
  const { motion } = await import("framer-motion");
  return { default: motion.div };
});
```

**Routes NOT needing animations:**
- /consultoria (text/forms)
- /proyectos (static cards)
- /vak-simple (basic questionnaire)
- Admin dashboards (if any)

**Savings:** Remove 63 KB from routes that don't use animations.

### Priority 2: Charts Vendor Lazy-Load (Medium)
**Effort:** 3-4 hours | **Savings:** ~110 KB gzipped | **Impact:** Medium

**Analysis:**
- `charts-vendor` (397 KB raw, 110 KB gzipped)
- Used in: Dashboard analytics, reports, admin panels
- Currently bundled globally

**Implementation:**
```javascript
const AnalyticsDashboard = lazy(() => import("./AnalyticsDashboard"));
```

**Affected routes:**
- /ialab/dashboard (analytics tab)
- Admin panels (lower priority)

### Priority 3: I18n Bundle Optimization (High Effort, High Reward)
**Effort:** 6-8 hours | **Savings:** ~200 KB gzipped | **Impact:** High

**Current State:**
- All 3 language files bundled (es.json: 86 KB, pt.json: 87 KB, en.json: 80 KB)
- Only ONE loaded per session
- Potential savings: Load only active locale

**Solutions:**

**Option A: Vite manualChunks (Recommended)**
```javascript
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'i18n-es': ['./src/i18n/es.json'],
        'i18n-en': ['./src/i18n/en.json'],
        'i18n-pt': ['./src/i18n/pt.json'],
      }
    }
  }
}
```
Then load only the needed chunk in I18nProvider.

**Option B: Exclude non-default locales from build**
- Only include `es.json` in main bundle
- Load `en.json` and `pt.json` as separate chunks on demand

**Estimated Savings:**
- Main bundle: -86 KB to -87 KB gzipped
- Total network bytes for Spanish user: -87 KB
- Total network bytes for English user: +0 (already loading en.json)

### Priority 4: HTML2PDF Worker Thread (Nice-to-Have)
**Effort:** 4-5 hours | **Savings:** ~0 KB bundle | **Impact:** UX (Main thread unblocking)

**Analysis:**
- html2pdf already lazy-loaded, but when called, blocks main thread for 2-3s
- Moving to Web Worker would free main thread during PDF generation

**Implementation:**
```javascript
// Main thread
const worker = new Worker(new URL('./pdf.worker.js', import.meta.url));

worker.postMessage({ html, filename });
worker.onmessage = (e) => {
  // PDF generated without blocking UI
};
```

### Priority 5: Code-Splitting Large Modals
**Effort:** 5-6 hours | **Savings:** ~40-80 KB | **Impact:** Medium

**Analysis:**
- `IALabEvaluationModal` (216 KB raw, 41 KB gzipped)
- `SmartBoardKidsDashboard` (large component)

**Implementation:**
```javascript
const IALabEvaluationModal = lazy(() => import("./IALabEvaluationModal"));
```

## Recommended Phase 4 Roadmap

### Week 1 (Days 1-3): Quick Wins
1. **Animation Vendor Lazy-Load** → -60 KB
2. **Charts Vendor Lazy-Load** → -110 KB
3. **Test & measure with Lighthouse**

### Week 1 (Days 4-5): Medium Effort
4. **I18n Bundle Split** → -86 KB
5. **Retest & validate**

### Week 2: Polish & Monitoring
6. **HTML2PDF Worker Thread** (if time permits)
7. **Add performance monitoring** (web-vitals library)
8. **Document for team**

## Validation Checklist

After each optimization:
- [ ] Build succeeds (`npm run build`)
- [ ] Bundle size decreased (check `dist/assets/`)
- [ ] Lighthouse score improved (run full audit)
- [ ] No console errors in DevTools
- [ ] Test on slow network (Chrome DevTools: Slow 4G)
- [ ] Verify functionality NOT broken
- [ ] Git diff shows only intended changes

## Performance Budget (Updated)

```
Target: < 1.1 MB total bundle (gzipped: < 300 KB main)
Current: ~1.2 MB total bundle (gzipped: ~340 KB main)

After Phase 4:
- Animation lazy: 1.1 MB (~280 KB gzipped) ✅
- Charts lazy: 1.0 MB (~170 KB gzipped) ✅
- I18n split: 0.9 MB (~84 KB gzipped for Spanish) ✅✅
```

## Key Metrics to Monitor

| Metric | Current | Target | Phase |
|--------|---------|--------|-------|
| LCP | 2.3s | < 2.5s | ✅ Phase 3 |
| INP | < 200ms | < 200ms | ✅ Phase 3 |
| CLS | 0.08 | < 0.1 | ✅ Phase 3 |
| Main bundle (gzipped) | 340 KB | < 300 KB | Phase 4 |
| Route transition | 300-400ms | < 300ms | Phase 4 |

## When to STOP Optimizing

- Bundle reduction diminishes (< 5% per optimization)
- User testing shows no perception of speed gain
- Code complexity increases significantly
- Maintenance burden outweighs performance gain
- Core functionality is already sub-2.5s LCP

**Current status:** All metrics green for Phase 3. Ready for Phase 4 validation.
