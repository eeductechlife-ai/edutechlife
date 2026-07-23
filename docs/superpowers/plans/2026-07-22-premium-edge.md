# Premium Edge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Elevate UI/UX with consistent micro-interactions, SEO asset generation, and entrance animations on LandingPage sections that lack them.

**Architecture:** All changes are additive — new CSS classes on existing elements, new static assets generated from SVGs, and framer-motion wrappers on sections that currently use vanilla IntersectionObserver or no entrance animation.

**Tech Stack:** Vite 5 + React 18 + framer-motion 12 + Tailwind CSS + macOS CLI tools (rsvg-convert, sips)

**Key codebase facts:**
- `card-clay-white` (tokens.css:587) already has `hover: translateY(-4px) scale(1.01)` + custom box-shadow
- `active:scale-[0.98]` / `active:scale-[0.97]` patterns already used across 50+ locations
- AIToolsSection, Ecosystem, Metodo already have full framer-motion entrance + hover animations
- Esencia uses vanilla IntersectionObserver + CSS transitions (no framer-motion)
- Aliados uses CSS marquee with group-hover (no framer-motion)
- sitemap writes to `dist/` via generate-sitemap.mjs (runs in `npm run build`)
- `favicon.svg` exists in public/ but no `.ico` fallback
- `og-image.svg` / `og-image-en.svg` exist but no `.png` fallbacks

---

### Task 1: Sitemap — write also to public/

**Files:**
- Modify: `scripts/generate-sitemap.mjs:58-59`

- [ ] **Step 1: Add public/ output to sitemap script**

Change the output to write to both `dist/` and `public/`:

```js
const distOut = join(__dirname, '../dist/sitemap.xml')
writeFileSync(distOut, xml)
console.log(`[sitemap] ✅ ${distOut}`)

const publicOut = join(__dirname, '../public/sitemap.xml')
writeFileSync(publicOut, xml)
console.log(`[sitemap] ✅ ${publicOut}`)
```

- [ ] **Step 2: Verify**

Run: `node scripts/generate-sitemap.mjs`
Expected: two `[sitemap] ✅` lines, file exists in both `dist/` and `public/`

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-sitemap.mjs public/sitemap.xml
git commit -m "feat(seo): sitemap output to both dist/ and public/"
```

---

### Task 2: Generate OG image PNG + favicon.ico from SVGs

**Files:**
- Create: `public/og-image.png` (1200×630, from `public/og-image.svg`)
- Create: `public/og-image-en.png` (1200×630, from `public/og-image-en.svg`)
- Create: `public/favicon.ico` (32×32, from `public/favicon.svg`)

Available tools: `rsvg-convert` (SVG→PNG), `sips` (PNG→ICO), `npx sharp-cli`

- [ ] **Step 1: Generate OG images (SVG→PNG)** at 1200×630px

```bash
rsvg-convert -w 1200 -h 630 -o public/og-image.png public/og-image.svg
rsvg-convert -w 1200 -h 630 -o public/og-image-en.png public/og-image-en.svg
```

Expected output: two new PNG files at 1200×630

- [ ] **Step 2: Generate favicon.ico** — convert SVG→32px PNG via rsvg-convert, then batch to ICO

```bash
# SVG → 32px PNG
rsvg-convert -w 32 -h 32 -o /tmp/favicon-32.png public/favicon.svg

# PNG → ICO via ImageMagick (if available) or copy PNG as favicon
# On macOS without ImageMagick, modern browsers accept PNG favicons
cp /tmp/favicon-32.png public/favicon-32x32.png
# Also create apple touch icon
rsvg-convert -w 180 -h 180 -o public/apple-touch-icon.png public/favicon.svg
```

Note: Modern browsers prefer PNG favicons over ICO. We'll provide `favicon-32x32.png` + `apple-touch-icon.png` and update the HTML link if needed.

- [ ] **Step 3: Commit**

```bash
git add public/og-image.png public/og-image-en.png public/favicon-32x32.png public/apple-touch-icon.png
git commit -m "feat(seo): generate OG PNGs and favicon fallbacks from SVGs"
```

---

### Task 3: Add micro-interaction classes to LandingPage sections

**Files:**
- Modify: `src/components/Esencia.jsx` (value cards + carousel buttons)
- Modify: `src/components/Aliados.jsx` (marquee cards)
- Modify: `src/components/Metodo.jsx` (step cards if missing active:scale)

Codebase patterns already established:
- `active:scale-[0.98]` on secondary buttons
- `active:scale-[0.97]` on primary action buttons
- `transition-all duration-300` on interactive elements
- `hover:shadow-lg` on cards

- [ ] **Step 1: Add active:scale to Esencia value cards** (lines 72-86)

```jsx
// Line 74 — add active:scale-[0.98]
<div
    key={index}
    className="group card-clay-white p-3 md:p-4 text-center relative overflow-hidden active:scale-[0.98]"
>
```

- [ ] **Step 2: Add active:scale to Esencia carousel buttons** (lines 167, 174)

```jsx
// Line 168
className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-[0.9]"

// Line 175 — same change
className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-[0.9]"
```

- [ ] **Step 3: Add active:scale to Aliados marquee cards** (lines 73-97)

```jsx
// Line 75 — add active:scale-[0.98]
className="group flex-shrink-0 badge-clay bg-white/60 backdrop-blur-md p-2.5 flex items-center gap-2.5 active:scale-[0.98]"
```

- [ ] **Step 4: Verify nothing broken**

Run: `npm run build:fast` (should compile without errors)

- [ ] **Step 5: Commit**

```bash
git add src/components/Esencia.jsx src/components/Aliados.jsx
git commit -m "feat(ux): add active:scale micro-interactions to Esencia and Aliados"
```

---

### Task 4: Add entrance animations to Esencia (framer-motion whileInView)

**Files:**
- Modify: `src/components/Esencia.jsx`

Current state: Uses vanilla IntersectionObserver + CSS class toggle for fade-in. Replace with framer-motion `whileInView` on the container divs. Import `useReducedMotion` to respect accessibility.

- [ ] **Step 1: Update imports**

```jsx
// Line 1-2 — update
import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
```

Remove `useState`, `useEffect` imports (no longer needed for visibility tracking).

- [ ] **Step 2: Add motion wrapper around the values section** (lines 69-89)

Replace:
```jsx
<div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {values.map((value, index) => (
```

With:
```jsx
<motion.div
    initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {values.map((value, index) => (
```

Close the `motion.div` after the inner grid div closes (before line 90).

- [ ] **Step 3: Add motion wrapper around the mission/vision/carousel section** (lines 91-183)

Replace:
```jsx
<div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
```

With:
```jsx
<motion.div
    initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
    className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10"
>
```

And close `</motion.div>` after the carousel closes (before line 183 `</div>`).

Note: Keep the className inline on the motion.div — don't use a separate wrapper div.

- [ ] **Step 4: Remove unused state and effects**

Remove:
```jsx
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        },
        { threshold: 0.1 }
    );
    const section = document.getElementById('esencia');
    if (section) observer.observe(section);
    return () => observer.disconnect();
}, []);
```

Also remove the `isVisible` conditional classes from the title section (line 57):
```jsx
// Line 57 — replace
<div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
// With:
<motion.div
    initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="text-center mb-8"
>
```

Close `</motion.div>` after the subtitle `<p>` (line 66).

- [ ] **Step 5: Verify**

Run: `npm run build:fast`
Expected: build succeeds, no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/Esencia.jsx
git commit -m "feat(ux): framer-motion whileInView entrance animations on Esencia"
```

---

### Task 5: Add entrance animation to Aliados (framer-motion whileInView)

**Files:**
- Modify: `src/components/Aliados.jsx`

Current state: No framer-motion at all. CSS marquee animation on cards, static header.

- [ ] **Step 1: Add framer-motion import**

```jsx
// Line 1 — update
import { memo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
```

Remove `useState` from import (keep `useRef` for marquee ref).

- [ ] **Step 2: Add useReducedMotion hook** after the `const { t }` line

```jsx
const prefersReducedMotion = useReducedMotion();
```

- [ ] **Step 3: Wrap header with motion.div** (lines 38-52)

```jsx
<motion.div
    initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="text-center mb-10"
>
    {/* existing header content — badge, h2 */}
</motion.div>
```

- [ ] **Step 4: Wrap marquee section with motion.div** (lines 54-101)

```jsx
<motion.div
    initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    className="relative"
>
    {/* existing marquee content */}
</motion.div>
```

- [ ] **Step 5: Remove unused `useState` import**

Change:
```jsx
import { memo, useState, useRef } from 'react';
```
To:
```jsx
import { memo, useRef } from 'react';
```

Also remove the `isPaused` state and the `onMouseEnter/onMouseLeave` handlers if they use it... wait, no. `isPaused` is still used by the marquee. So `useState` stays.

Actually `isPaused` is used with `useState`. Let me keep `useState` but add `motion`:

```jsx
import { memo, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
```

- [ ] **Step 6: Verify**

Run: `npm run build:fast`
Expected: build succeeds, no errors

- [ ] **Step 7: Commit**

```bash
git add src/components/Aliados.jsx
git commit -m "feat(ux): framer-motion whileInView entrance animations on Aliados"
```
