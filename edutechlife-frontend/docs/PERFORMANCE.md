# Performance Monitoring & Optimization Guide

This guide explains how to measure, monitor, and improve Core Web Vitals for EdutechLife SmartBoard.

## Core Web Vitals (CWV)

Three metrics measure real-world user experience:

| Metric | Good | Needs Work | Poor | Measures |
|--------|------|-----------|------|----------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5-4s | > 4s | When main content loads |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200-500ms | > 500ms | How fast UI responds to input |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1-0.25 | > 0.25 | Visual stability (unexpected movement) |

### Why CWV Matter for EdutechLife

- **Students aged 6–16** often use cellular/WiFi on mobile devices
- **LatAm regions** have slower average connection speeds (2-4G)
- **CLS on mobile** causes accidental taps (e.g., clicking wrong mission)
- **INP > 200ms** feels slow and frustrates users

---

## Monitoring Setup

### 1. Local Measurement (Before Commit)

**Run Lighthouse audit locally:**
```bash
npm run build
npm run perf:audit
```

Output:
- Bundle size report
- Lighthouse Performance score (85+ is "good")
- Core Web Vitals lab scores (from Lighthouse)
- Comparison to baseline

**Compare to baseline over time:**
```bash
npm run perf:audit -- --compare perf-baseline.json --output perf-report.json
```

### 2. CI/CD Enforcement (GitHub Actions)

**PR checks automatically:**
- ✅ Fail if bundle size > 7.5 MB total or > 600 KB per chunk
- ✅ Fail if Performance score < 85
- ✅ Fail if LCP > 2500ms or INP > 200ms or CLS > 0.1
- ✅ Post bundle delta in PR comment

**Triggered on:**
- Pull requests modifying `src/**`, `vite.config.js`, or `package.json`
- Pushes to `main`

See `.github/workflows/perf-budget.yml` for configuration.

### 3. Production Monitoring (Field Data)

**Core Web Vitals tracking:**

The app automatically captures CWV for 10% of users (configurable):

```javascript
// src/main.jsx
captureWebVitals({
  sampleRate: 0.1,           // 10% sampling
  endpoint: '/api/vitals',   // POST to backend
  onReport: (vitals) => {    // Optional callback
    console.log(vitals);
  }
});
```

**Captured metrics:**
- LCP value + element causing it (hero image, heading, etc.)
- INP value + interaction type (click, tap, etc.)
- CLS value + sources (which elements shifted)
- Device info (4G/5G, CPU cores, RAM)
- Connection speed (simulated)

**Backend endpoint** should accept:
```json
{
  "url": "/smartboard/inicio",
  "vitals": {
    "lcp": { "value": 2100, "rating": "good", "element": "IMG" },
    "inp": { "value": 150, "rating": "good", "interaction": "click" },
    "cls": { "value": 0.05, "rating": "good" }
  },
  "connection": { "effectiveType": "4g", "rtt": 50 },
  "device": { "memory": 8, "cores": 8 }
}
```

Store in Supabase `web_vitals` table for analytics.

---

## Performance Optimization

### Quick Wins (1–2 hours)

- [ ] Remove blur effects from background gradients (high paint cost on mobile)
- [ ] Fix AnimatePresence layout shift on tab transitions (reserve fixed height)
- [ ] Add `preconnect` links for Supabase, DeepSeek APIs in `public/index.html`
- [ ] Ensure route chunks are lazy-loaded (verify in `src/routes/index.jsx`)

### Medium Effort (Sprint work)

- [ ] Audit and add `loading="lazy"` to SmartBoard images
- [ ] Add `srcset` + `sizes` for responsive images
- [ ] Move heavy vendor code (charts, PDFs) to separate chunks
- [ ] Test on low-end device emulation (Nexus 5, 4× slowdown)

### Long-term (Roadmap)

- [ ] Integrate CrUX API to track field metrics over time
- [ ] Set up performance budgets per route (SmartBoard, IALab, etc.)
- [ ] Implement soft navigation tracking for SPA route changes
- [ ] Add Long Animation Frames (LoAF) attribution for INP debugging

---

## Debugging Performance Issues

### LCP is slow (> 2.5s)

**Likely causes:**
1. Hero image loading late → add `fetchpriority="high"` + `preload`
2. JavaScript blocking render → code-split routes, defer non-critical JS
3. Slow server → check TTFB (should be < 800ms); use CDN

**Debug:**
```javascript
// Chrome DevTools → Performance tab
// Look for: "Largest Contentful Paint" marker
// See which element is LCP; check Network tab for its load time
```

### INP is slow (> 200ms)

**Likely causes:**
1. Long script blocking input → use `scheduler.yield()` in loops
2. Heavy component re-renders → profile with DevTools
3. Third-party script (analytics, chat) → defer or lazy-load

**Debug:**
```javascript
// Chrome DevTools → Interactions
// See which interaction took longest; check Main Thread Activity
// Run performance trace: Ctrl+Shift+J → Performance → Record
```

### CLS is high (> 0.1)

**Likely causes:**
1. Uncontained animated layout changes (AnimatePresence)
2. Ad/iframe loading (not present in SmartBoard)
3. Web font swap → set `font-display: swap` in CSS

**Debug:**
```javascript
// Chrome DevTools → Performance → look for "Layout Shift" entries
// Hover to see which elements shifted
// Check order of network requests
```

### Bundle size growing

**Steps:**
1. Run `npm run build && npm run perf:audit`
2. Open `dist/bundle-stats.html` in browser
3. Look for: duplicated packages, large vendors, unused code
4. Use Webpack Analyzer: `BUILD_ANALYZE=true npm run build`

---

## Configuration

### Environment Variables

```env
# Enable Core Web Vitals tracking (default: enabled)
VITE_ENABLE_VITALS=true

# Sentry (for error + performance tracking)
VITE_SENTRY_DSN=https://...@sentry.io/...
VITE_SENTRY_TRACES_RATE=0.1

# Backend vitals endpoint
VITE_VITALS_ENDPOINT=/api/vitals
```

### Bundle Budgets

Edit `scripts/check-budget.mjs`:
```javascript
const BUDGET = {
  maxTotalJS: 7.5 * 1024 * 1024,      // 7.5 MB (all JS)
  maxChunkJS: 600 * 1024,              // 600 KB (per chunk)
  maxTotalCSS: 600 * 1024,             // 600 KB (all CSS)
};
```

Recommended targets:
- **Initial bundle** (LandingPage + shell): 150–200 KB gzipped
- **Route chunks**: 100–300 KB gzipped each
- **Vendor chunks**: 200–500 KB gzipped each

### Lighthouse Assertions

Edit `lhci.json` to adjust thresholds:
```json
{
  "assertions": {
    "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
    "interaction-to-next-paint": ["error", { "maxNumericValue": 200 }],
    "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
    "categories:performance": ["error", { "minScore": 0.85 }]
  }
}
```

---

## Scripts Reference

```bash
# Measure performance locally (Lighthouse + bundle analysis)
npm run perf:audit

# Compare to baseline (must provide baseline.json)
npm run perf:audit -- --compare baseline.json --output report.json

# Check bundle size only
npm run check-budget

# Run Lighthouse CI manually
npm run perf:lighthouse

# Enable bundle visualizer
BUILD_ANALYZE=true npm run build
# Open dist/bundle-stats.html
```

---

## Testing Performance Changes

**Before deploying a change:**

1. Build locally:
   ```bash
   npm run build
   npm run perf:audit
   ```

2. Check bundle delta (should be < 5%):
   ```bash
   npm run perf:audit -- --compare perf-baseline.json
   ```

3. Test on mobile emulation (DevTools):
   - Throttle to "Slow 4G"
   - Emulate Pixel 5 (typical student device)
   - Measure LCP, INP, CLS in Performance tab

4. Verify on low-end device if possible:
   - Android phone on cellular
   - Compare metrics before/after change

---

## Resources

- [Web Vitals Guide](https://web.dev/vitals/)
- [Lighthouse Docs](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals Best Practices](https://web.dev/performance/)
- [React Performance Tips](https://react.dev/reference/react/useMemo)
- [CrUX API Docs](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference)

---

## Q&A

**Q: How often should we measure performance?**
A: Weekly before release, every PR for build size, continuously in production (field metrics).

**Q: Why is LCP measured at 2.5s and not 1.0s?**
A: 2.5s is the p75 threshold on 4G networks for good UX. 1.0s is ideal but unrealistic on mobile.

**Q: Can we disable Core Web Vitals tracking?**
A: Yes, set `VITE_ENABLE_VITALS=false`. Recommended: keep at 10% sampling rate instead of disabling.

**Q: Why do Lighthouse scores differ from real-world (field) metrics?**
A: Lighthouse runs on a single fast desktop run. Field metrics are real users on diverse devices/networks. Always trust field data more.
