# SaaS Premium Transformation Roadmap

**Goal:** Elevate Edutechlife from functional MVP to premium SaaS platform without altering existing functionality.

**Priority: Performance & Bundle Optimization** (Phase 1)

## Phase 0 — Audit Snapshot (Current State)

| Dimension | Current | Target | Priority |
|-----------|---------|--------|----------|
| **Dist Size** | 53MB | <10MB | P0 |
| **Largest JS** | index-1g5serUb.js 566KB | <200KB | P0 |
| **CSS** | index-BNcgzhnP.css 486KB | <100KB | P0 |
| **Video (public/)** | dashboard.mp4 21MB + smarboard.mov 18MB + smarboard.mp4 2.9MB | <5MB total | P0 |
| **pdf-vendor chunk** | 1.3MB, loaded eagerly | lazy-loaded | P0 |
| **png images (public/)** | VALERIO.png 328K + valeria.png 428K | WebP/AVIF | P1 |
| **Charts** | recharts 412KB (80% app doesn't use) | lazy or swap | P1 |
| **Core Web Vitals** | Not measured | LCP<2.5s, FID<100ms, CLS<0.1 | P1 |
| **Performance Budget** | None | CI-enforced | P1 |
| **Lighthouse CI** | None | 90+ all categories | P2 |

---

## Phase 1 — Low-Hanging Fruit (Day 1)

These are safe, mechanical changes with immediate impact.

### 1.1 Remove / Compress Public Videos

**Current:** 42MB in `/public` served on every page load.

- `dashboard.mp4` (21MB) — compress to HEVC/h.264 at 720p (~3MB)
- `smarboard.mov` (18MB) — uncompressed MOV; delete if unused, or convert to h.264 MP4 (~2MB)
- `smarboard.mp4` (2.9MB) — compress to 720p (~1.5MB)

**Save:** ~35MB (66% of total dist)
**File:** Manual — `ffmpeg` commands, then replace files in `/public`

### 1.2 Lazy-Load pdf-vendor (1.3MB)

**Current:** `html2pdf.js` + `jspdf` in a single eager chunk.

**Action:** Wrap imports in dynamic `import()` for PDF-related components. Only load when user triggers PDF export.

**File candidates:** Components that call `html2pdf()` — needs grep for usage.

**Save:** 1.3MB off initial load (not always true; depends on route)  
**Priority:** P0 — this is the single biggest JS saving with zero code risk.

### 1.3 Convert PNGs to WebP

- `VALERIO.png` 328K → WebP ~80K
- `valeria.png` 428K → WebP ~100K
- `ialab-demo-poster.png` ??? → WebP

**Save:** ~576K
**Files:** Replace in `/public`, update `src` references in JSX.

### 1.4 Investigate 486KB CSS

**Action:** Run `purgecss` on build output, check if unused Tailwind classes are stripped. If not, configure `tailwind.config.js` `content` paths more aggressively.

**Save:** Potentially 200-300KB

---

## Phase 2 — Bundle Re-Architecture (Day 2-3)

### 2.1 Switch Minifier: esbuild → terser

**Current:** `minify: 'esbuild'` in vite.config.js  
**Effect:** Terser achieves 8-12% smaller output at the cost of slower build.

```diff
- minify: 'esbuild',
+ minify: 'terser',
+ terserOptions: { compress: { drop_console: true, drop_debugger: true } },
```

**Install:** `npm install -D terser`

### 2.2 Improve manualChunks Strategy

**Current chunks and sizes:**
- `react-vendor` 143KB (React + React-DOM)
- `animation-vendor` 229KB (framer-motion + lucide-react + canvas-confetti)
- `charts-vendor` 412KB (recharts)
- `pdf-vendor` 1.3MB (html2pdf.js + jspdf)
- `supabase-vendor` 208KB

**Proposed strategy:**
- Keep `react-vendor` (critical path)
- Keep `animation-vendor` (critical for UI)
- Lazy-load `pdf-vendor` (only on PDF routes)
- Split `charts-vendor`: only load recharts on dashboard/ialab routes OR replace with lightweight `lightweight-charts`
- Merge locales: `es` 244KB + `en` 231KB = 475KB — load only user locale, not both

### 2.3 Enable Brotli in Production

Vite + Express: add `compression` middleware with brotli support.

```bash
npm install compression
```

```js
// backend: add compression middleware
import compression from 'compression';
app.use(compression({ brotli: { enabled: true, quality: 11 } }));
```

**Effect:** Brotli reduces JS size ~22% over gzip.

### 2.4 CSS Code Splitting

**Current:** `index-BNcgzhnP.css` 486KB — all CSS in one file.

**Action:** Verify `cssCodeSplit: true` is working (already set). Check if route-level CSS splitting needs `import('./Component.css')` pattern for heavy components.

---

## Phase 3 — Monitoring & CI (Day 3-4)

### 3.1 Performance Budget (CI Enforcement)

Add to `vite.config.js`:

```js
build: {
  chunkSizeWarningLimit: 200, // down from 1500
  rollupOptions: {
    output: {
      manualChunks: { ... }
    }
  }
}
```

Add to CI pipeline (`ci.yml`): a `performance-budget` job that fails if:
- Any JS chunk >250KB
- Total JS >1.5MB
- Total CSS >100KB
- Any image >200KB

### 3.2 Lighthouse CI

Set up `lhci` to run on every PR:

```bash
npm install -D @lhci/cli
```

```js
// lighthouserc.js
module.exports = {
  ci: {
    collect: { url: ['http://localhost:4173'], startServerCommand: 'npm run preview' },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }]
      }
    }
  }
};
```

### 3.3 Sentry Error Tracking + Performance

```bash
npm install @sentry/react @sentry/vite-plugin
```

```js
// main.jsx
import * as Sentry from '@sentry/react';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1,
});
```

---

## Phase 4 — Image Pipeline & UX (Day 4-5)

### 4.1 Image Pipeline

Build step that auto-converts PNGs to WebP + AVIF:

```json
// package.json scripts
"optimize:images": "sharp public/**/*.png -o public/ --format webp"
```

Use `<picture>` elements for fallback:

```jsx
<picture>
  <source srcSet="/images/valeria.avif" type="image/avif" />
  <source srcSet="/images/valeria.webp" type="image/webp" />
  <img src="/images/valeria.png" alt="Valeria" loading="lazy" />
</picture>
```

### 4.2 Skeleton Screens

Add skeleton loading states for:
- Dashboard (charts + cards)
- IALab (evaluation modal, quiz modal)
- SmartBoard (kids dashboard)
- Diagnosis VAK (result cards)

Use Tailwind `animate-pulse` or framer-motion for shimmer effect.

### 4.3 Route-Level Code Splitting

React Router lazy routes:

```jsx
const IALab = lazy(() => import('./pages/IALab'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SmartBoard = lazy(() => import('./pages/SmartBoard'));
```

Check current router to see if already lazy — if not, this is the single biggest improvement for initial load time.

---

## Savings Summary

| Action | Est. Saving | Cumulative |
|--------|------------|------------|
| Compress videos | ~35MB | 53 → 18MB |
| Lazy pdf-vendor | 1.3MB off initial | 18 → 16.7MB |
| WebP images | ~0.5MB | 16.7 → 16.2MB |
| Terser minify | ~2MB | 16.2 → 14.2MB |
| Brotli (on wire) | ~3MB | 14.2 → 11.2MB |
| CSS purging | ~200KB | 11.2 → 11.0MB |
| Route splitting | ~3MB off initial | **~8MB initial load** |

**Target:** Prod build <10MB on disk, initial JS payload <1.5MB, Lighthouse 90+

---

## Future Phases (after Performance)

| Phase | Focus | Est. Impact |
|-------|-------|-------------|
| **5** | SEO & Discovery | Organic traffic 3x+ |
| **6** | Code Quality (24 oversized files) | Maintainability |
| **7** | Premium UX (skeletons, micro-animations, a11y) | Conversion + Retention |
| **8** | DevOps (error tracking, preview envs) | Developer velocity |
| **9** | a11y Deep Dive (100+ tests, keyboard nav) | Accessibility score |
| **10** | Marketing Site Redesign | Brand perception |

---

## Implementation Order

```
Day 1:  Phase 1 (videos, pdf-vendor, PNGs, CSS)
Day 2:  Phase 2 (terser, chunks, brotli, CSS split)
Day 3:  Phase 3 (CI budget, Lighthouse, Sentry)
Day 4:  Phase 4 (image pipeline, skeletons, route-split)
Day 5+: Validation & Fixes
```
