# Fase 5 — Performance SaaS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimizar performance de carga con skeleton screens, mejorar optimize-images, agregar performance budget en CI. Sin alterar funcionalidad existente.

**Architecture:** Componentes aditivos + cambios de configuración mínimos. Skeleton components reutilizables con `animate-pulse` de Tailwind. Sin modificar lógica de negocio, providers, routing, o Clerk.

**Tech Stack:** React 18 + Tailwind CSS + Vitest

**Estado actual (pre-Fase 5):**
- ✅ Videos: 4.7MB total (ya comprimidos)
- ✅ PNG→WebP: Script + webps generados
- ✅ Routes: Todas lazy-loaded con Suspense
- ✅ Backend: compression middleware con brotli activo
- ✅ Terser + manualChunks configurados
- ❌ Skeleton screens: No existen
- ❌ optimize-images: Solo PNG, sin byte counting
- ❌ Performance budget CI: No activo

---

### Task 1: Skeleton base component

**Files:**
- Create: `src/components/ui/Skeleton.jsx`

- [ ] **Step 1: Create the Skeleton base component**

```jsx
export default function Skeleton({ width, height, rounded = 'lg', className = '' }) {
  const roundedMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-slate-700 ${roundedMap[rounded] || roundedMap.lg} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}
```

- [ ] **Step 2: Create test for Skeleton**

Create `src/components/ui/Skeleton.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Skeleton from './Skeleton'

describe('Skeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<Skeleton />)
    const el = container.firstChild
    expect(el).toBeTruthy()
    expect(el.className).toContain('animate-pulse')
    expect(el.className).toContain('rounded-lg')
  })

  it('applies custom width and height', () => {
    const { container } = render(<Skeleton width="200px" height="100px" />)
    const el = container.firstChild
    expect(el.style.width).toBe('200px')
    expect(el.style.height).toBe('100px')
  })

  it('applies rounded variant', () => {
    const { container } = render(<Skeleton rounded="full" />)
    expect(container.firstChild.className).toContain('rounded-full')
  })
})
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/components/ui/Skeleton.test.jsx --reporter=verbose`
Expected: 3 tests PASS

- [ ] **Step 4: Commit**

```bash
git -C /Users/home/Desktop/edutechlife add edutechlife-frontend/src/components/ui/Skeleton.jsx edutechlife-frontend/src/components/ui/Skeleton.test.jsx
git -C /Users/home/Desktop/edutechlife commit -m "feat: add Skeleton base component with animate-pulse"
```

---

### Task 2: DashboardSkeleton

**Files:**
- Create: `src/components/skeletons/DashboardSkeleton.jsx`

- [ ] **Step 1: Create DashboardSkeleton**

```jsx
import Skeleton from '../ui/Skeleton'

export default function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6" aria-label="Loading dashboard">
      {/* KPIs row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} height="100px" rounded="xl" />
        ))}
      </div>
      {/* Chart area */}
      <Skeleton height="300px" rounded="xl" />
      {/* Activity list */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height="60px" rounded="lg" />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/home/Desktop/edutechlife add edutechlife-frontend/src/components/skeletons/DashboardSkeleton.jsx
git -C /Users/home/Desktop/edutechlife commit -m "feat: add DashboardSkeleton component"
```

---

### Task 3: IALabSkeleton

**Files:**
- Create: `src/components/skeletons/IALabSkeleton.jsx`

- [ ] **Step 1: Create IALabSkeleton**

```jsx
import Skeleton from '../ui/Skeleton'

export default function IALabSkeleton() {
  return (
    <div className="p-6 space-y-6" aria-label="Loading IALab">
      {/* Course modules header */}
      <Skeleton height="48px" width="300px" rounded="lg" />
      {/* Module cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3 p-4 border rounded-xl">
            <Skeleton height="24px" width="60%" rounded="md" />
            <Skeleton height="80px" rounded="lg" />
            <Skeleton height="32px" rounded="full" />
          </div>
        ))}
      </div>
      {/* Progress section */}
      <Skeleton height="16px" rounded="full" />
      <Skeleton height="120px" rounded="xl" />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/home/Desktop/edutechlife add edutechlife-frontend/src/components/skeletons/IALabSkeleton.jsx
git -C /Users/home/Desktop/edutechlife commit -m "feat: add IALabSkeleton component"
```

---

### Task 4: SmartBoardSkeleton

**Files:**
- Create: `src/components/skeletons/SmartBoardSkeleton.jsx`

- [ ] **Step 1: Create SmartBoardSkeleton**

```jsx
import Skeleton from '../ui/Skeleton'

export default function SmartBoardSkeleton() {
  return (
    <div className="p-6 space-y-6" aria-label="Loading SmartBoard">
      {/* Hero area */}
      <Skeleton height="200px" rounded="2xl" />
      {/* Activity cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton height="120px" rounded="xl" />
            <Skeleton height="16px" width="70%" rounded="md" />
          </div>
        ))}
      </div>
      {/* Bottom section */}
      <Skeleton height="160px" rounded="xl" />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/home/Desktop/edutechlife add edutechlife-frontend/src/components/skeletons/SmartBoardSkeleton.jsx
git -C /Users/home/Desktop/edutechlife commit -m "feat: add SmartBoardSkeleton component"
```

---

### Task 5: VAKSkeleton

**Files:**
- Create: `src/components/skeletons/VAKSkeleton.jsx`

- [ ] **Step 1: Create VAKSkeleton**

```jsx
import Skeleton from '../ui/Skeleton'

export default function VAKSkeleton() {
  return (
    <div className="p-6 space-y-6" aria-label="Loading VAK Diagnosis">
      {/* Title */}
      <Skeleton height="36px" width="280px" rounded="lg" />
      {/* Question card */}
      <div className="space-y-4 p-6 border rounded-xl">
        <Skeleton height="24px" width="80%" rounded="md" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height="48px" rounded="lg" />
          ))}
        </div>
      </div>
      {/* Progress bar */}
      <Skeleton height="8px" rounded="full" />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/home/Desktop/edutechlife add edutechlife-frontend/src/components/skeletons/VAKSkeleton.jsx
git -C /Users/home/Desktop/edutechlife commit -m "feat: add VAKSkeleton component"
```

---

### Task 6: Wire skeletons into Suspense boundaries

**Files:**
- Modify: `src/routes/index.jsx`

- [ ] **Step 1: Add imports for skeleton components**

After the existing lazy imports, add:

```jsx
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton'
import IALabSkeleton from '../components/skeletons/IALabSkeleton'
import SmartBoardSkeleton from '../components/skeletons/SmartBoardSkeleton'
import VAKSkeleton from '../components/skeletons/VAKSkeleton'
```

- [ ] **Step 2: Replace Suspense fallbacks in route definitions**

Find the Suspense wrapper for each route and set the appropriate skeleton as fallback. For example:

```jsx
<Route path="/dashboard" element={
  <Suspense fallback={<DashboardSkeleton />}>
    <Dashboard />
  </Suspense>
} />
```

The specific route paths need to be matched from existing route definitions. Read `src/routes/index.jsx` to find each Suspense boundary and replace generic fallbacks with the appropriate skeleton.

- [ ] **Step 3: Run tests to verify nothing broke**

Run: `npx vitest run src/tests/integration/ --reporter=verbose`
Expected: All 9 integration tests still PASS

- [ ] **Step 4: Build to verify no compilation errors**

Run: `npx vite build --mode development --minify false 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git -C /Users/home/Desktop/edutechlife add edutechlife-frontend/src/routes/index.jsx
git -C /Users/home/Desktop/edutechlife commit -m "feat: wire skeleton screens into Suspense boundaries"
```

---

### Task 7: Improve optimize-images script

**Files:**
- Modify: `scripts/optimize-images.mjs`

- [ ] **Step 1: Read current script**

```bash
cat /Users/home/Desktop/edutechlife/edutechlife-frontend/scripts/optimize-images.mjs
```

- [ ] **Step 2: Add JPG support and byte counting**

Update the script to include JPG/JPEG files and print bytes saved:

```js
import { execSync } from 'child_process'
import { readdirSync, statSync, existsSync } from 'fs'
import { join, extname } from 'path'

const PUBLIC = join(import.meta.dirname, '../public')
const QUALITY = 85

const images = []
let totalOriginalBytes = 0
let totalWebpBytes = 0

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fp = join(dir, entry.name)
    if (entry.isDirectory()) walk(fp)
    else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) images.push(fp)
  }
}

walk(PUBLIC)

let converted = 0
let skipped = 0

for (const img of images) {
  const ext = extname(img)
  const webp = img.replace(ext, '.webp')
  const originalSize = statSync(img).size
  totalOriginalBytes += originalSize

  if (existsSync(webp) && statSync(webp).mtimeMs > statSync(img).mtimeMs) {
    skipped++
    totalWebpBytes += statSync(webp).size
    continue
  }

  try {
    execSync(`cwebp -q ${QUALITY} "${img}" -o "${webp}"`, { stdio: 'pipe' })
    const webpSize = statSync(webp).size
    totalWebpBytes += webpSize
    const saved = ((originalSize - webpSize) / originalSize * 100).toFixed(1)
    console.log(`  ✔ ${extname(img).slice(1)} → webp  ${saved}% saved  (${(originalSize / 1024).toFixed(1)}KB → ${(webpSize / 1024).toFixed(1)}KB)`)
    converted++
  } catch (err) {
    console.error(`  ✘ Failed: ${img} — ${err.message}`)
  }
}

const totalSaved = ((totalOriginalBytes - totalWebpBytes) / totalOriginalBytes * 100).toFixed(1)
console.log(`\nDone: ${converted} converted, ${skipped} skipped (up to date)`)
console.log(`Total: ${(totalOriginalBytes / 1024 / 1024).toFixed(2)}MB → ${(totalWebpBytes / 1024 / 1024).toFixed(2)}MB  (${totalSaved}% saved)`)
```

- [ ] **Step 3: Test the script**

Run: `node scripts/optimize-images.mjs`
Expected: Script runs without errors, shows conversion stats

- [ ] **Step 4: Commit**

```bash
git -C /Users/home/Desktop/edutechlife add edutechlife-frontend/scripts/optimize-images.mjs
git -C /Users/home/Desktop/edutechlife commit -m "feat: add JPG support and byte counting to optimize-images"
```

---

### Task 8: Performance budget in CI

**Files:**
- Modify: `.github/workflows/test.yml`

- [ ] **Step 1: Add performance budget step after build**

```yaml
      - name: Performance Budget
        working-directory: ./edutechlife-frontend
        run: node scripts/check-budget.mjs
        env:
          VITE_CLERK_PUBLISHABLE_KEY: ${{ secrets.VITE_CLERK_PUBLISHABLE_KEY }}
```

Add this step right after the `Build` step in `test.yml`.

- [ ] **Step 2: Verify `check-budget.mjs` exists and works**

```bash
cat /Users/home/Desktop/edutechlife/edutechlife-frontend/scripts/check-budget.mjs
node /Users/home/Desktop/edutechlife/edutechlife-frontend/scripts/check-budget.mjs 2>&1
```

Expected: Script runs (may report budget exceeded but should not crash)

- [ ] **Step 3: Commit**

```bash
git -C /Users/home/Desktop/edutechlife add edutechlife-frontend/.github/workflows/test.yml
git -C /Users/home/Desktop/edutechlife commit -m "ci: add performance budget check to CI pipeline"
```

---

## Spec Coverage

| Spec Requirement | Task |
|---|---|
| A. CSS Purge (investigation) | ✅ Task 6 build verifies CSS compiles |
| A. optimize-images JPG + bytes | Task 7 |
| A. Video compression | ✅ Ya comprimidos |
| B. Skeleton base component | Task 1 |
| B. DashboardSkeleton | Task 2 |
| B. IALabSkeleton | Task 3 |
| B. SmartBoardSkeleton | Task 4 |
| B. VAKSkeleton | Task 5 |
| B. Wire into Suspense | Task 6 |
| C. Brotli backend | ✅ Ya existe |
| C. Performance budget CI | Task 8 |
| D. Exclusiones respetadas | ✅ Tasks 1-5 crean archivos nuevos; Task 6-8 modifican solo config/routes |

## Execution Handoff

Two options after user approval:
- **Subagent-Driven (recommended)**: Fresh subagent per task + two-stage review
- **Inline Execution**: Direct execution with checkpoints
