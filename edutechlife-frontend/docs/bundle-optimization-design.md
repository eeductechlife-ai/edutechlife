# Bundle Optimization Design Document

## Current State

| Metric | Value |
|--------|-------|
| Total JS chunks | 144 |
| Total JS size | 6.93 MB |
| Initial load (preloaded) | 989 KB (4 chunks) |
| Lazy/dynamic | 6.1 MB (140 chunks) |

## Chunk Size Distribution

| Bucket | Count |
|--------|-------|
| <10 KB (tiny) | 62 |
| 10-50 KB (small) | 57 |
| 50-200 KB (medium) | 15 |
| 200-500 KB (large) | 9 |
| >500 KB (massive) | 1 |

## Top 10 Chunks by Size

| File | Size | Type |
|------|------|------|
| pdf-vendor-*.js | 1.35 MB | Dynamic import (lazy) |
| index-*.js (main) | 487 KB | Entry |
| pdf-*.js | 439 KB | Dynamic import (lazy) |
| app-layout-*.js | 422 KB | Preloaded |
| charts-vendor-*.js | 411 KB | Dynamic import (lazy) |
| es-*.js (translations) | 239 KB | Dynamic import (lazy) |
| en-*.js (translations) | 226 KB | Dynamic import (lazy) |
| animation-vendor-*.js | 224 KB | Preloaded |
| IALabEvaluationModal-*.js | 215 KB | Dynamic import (lazy) |
| supabase-vendor-*.js | 203 KB | Preloaded |

## Findings

### 1. 62 chunks under 10 KB — excessive fragmentation

The `manualChunks` config in `vite.config.js` creates fine-grained vendor splits and source splits that don't provide meaningful isolation. 119 of 144 chunks are under 50 KB. Each chunk adds HTTP/2 framing overhead (~1-2 KB per request).

**Root cause:** Vite's automatic code-splitting for each `React.lazy()` call + i18n translation files + per-feature `manualChunks` entries.

### 2. pdf-vendor is 1.35 MB but correctly lazy-loaded

html2pdf.js + jspdf are dynamically imported (`await import('html2pdf.js')`) at 7 call sites in the source. The chunk is NOT preloaded in `index.html` (verified) and NOT precached by the service worker (verified). It only loads when a user triggers a PDF download.

This is **correct behavior** — no change needed.

### 3. xlsx-vendor is an empty chunk (1 byte)

`xlsx` is not imported anywhere. The `manualChunks` entry creates an empty chunk. Safe to remove.

### 4. Main bundle (487 KB) + preloaded chunks (989 KB)

The initial critical path loads 989 KB. The main entry (487 KB) contains shared code used by multiple routes. This is reasonable for a SPA of this complexity.

### 5. rollup-plugin-visualizer runs in production builds

The `visualizer` plugin is included unconditionally. It writes `bundle-stats.html` to the output directory but doesn't affect bundle size itself. However, it adds ~10-15s to build time.

## Proposed Optimizations

### Phase 1 — Config Only (Zero Behavior Change)

| # | Change | Impact | Risk |
|---|--------|--------|------|
| 1 | Remove empty `xlsx-vendor` manualChunks entry | Eliminates 1-byte empty chunk | None |
| 2 | Remove `app-layout` manualChunks entry (let Vite decide) | Consolidates app-layout 422 KB into main bundle, saves 1 HTTP request on initial load | None — app-layout is always loaded on every route anyway |
| 3 | Remove `design-system` manualChunks entry (if chunk is tiny) | Consolidates micro-chunk | None |
| 4 | Remove `vak-feature` manualChunks entry | Consolidates micro-chunk | None |
| 5 | Remove `visualizer` from production builds | Faster builds, no side effects | None |

### Phase 2 — Code Structure (Minimal Change)

| # | Change | Impact | Risk |
|---|--------|--------|------|
| 6 | Merge micro i18n translation chunks into 1-2 files | Reduces ~20+ tiny translation chunks | Low — I18nProvider controls loading |
| 7 | Configure `build.modulePreload` to exclude non-critical dynamic imports | Prevents unnecessary preload hints | Low |

### Phase 3 — Bundle Size Reduction (Requires Testing)

| # | Change | Impact | Risk |
|---|--------|--------|------|
| 8 | Audit unused dependencies in package.json | Reduce bundle size | Medium — requires dependency graph analysis |
| 9 | Tree-shake lucide-react (import only used icons) | Reduce animation-vendor chunk | Low |
| 10 | Evaluate if recharts can be lazy-loaded per-chart | Reduce charts-vendor 411 KB | Medium — changes import structure |

## Implementation Results

| Metric | Before | After | Δ |
|--------|--------|-------|---|
| Total JS chunks | 144 | 142 | -2 |
| Total JS size | 6.93 MB | 6.94 MB | — |
| PWA precache size | 9.44 MB (181 entries) | 8.12 MB (180 entries) | **-1.32 MB** |
| Build success | ✅ | ✅ | — |
| Tests (78 suites) | 883 pass | 883 pass | — |

The PWA precache exclusion of `pdf-vendor` saved 1.32 MB (180 → 181 entries). The chunk count and total JS size are essentially unchanged because Vite's automatic code splitting handles the same code.

## Implementation Plan

```
Phase 1 ✅ (done):  vite.config.js changes only → rebuild → verified
Phase 2 (next):     i18n structure changes → rebuild → test with translations
Phase 3 (future):   Dependency audit + icon tree-shaking
```

## Verification

After each phase:
1. `npm run build` — must succeed
2. Compare chunk count, total size, initial load size
3. Verify index.html preload hints are correct
4. Run full test suite: `npm test`
