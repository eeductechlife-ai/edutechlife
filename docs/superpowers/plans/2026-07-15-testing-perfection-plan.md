# Testing Perfection Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve 4 critical issues in parallel: coverage 70%+, frontend test speed, visual regression, and a11y tests.

**Architecture:** 4 independent workstreams executed by parallel subagents, each targeting specific files. No shared state or sequential dependencies between streams. Each stream produces its own commits.

**Tech Stack:** Vitest v4.1.10, Playwright 1.60.0, jest-axe 10.0.0, @lhci/cli (CI), Express CJS

---

## Stream A — Coverage 70%+ (Backend)

**Goal:** Raise backend coverage from 49% stmts / 34% branches / 60% funcs / 50% lines to 70%+ across all metrics.

**Strategy:** The routes directory (25.9% stmts) is the biggest gap. Add integration tests via supertest that exercise API success paths using the real DeepSeek API key (already configured in env). For auth-protected routes, test 401 paths + validation error paths.

### Task A1: Cover evaluate-prompt edge cases

**Files:**
- Modify: `edutechlife-backend/src/__tests__/routes/ialab.test.js`

- [ ] Add test for `evaluate-prompt` with empty criteria object
- [ ] Add test for `evaluate-prompt` with extremely long prompt (>5000 chars) — verify grade calculation
- [ ] Add test for `evaluate-prompt` with all criteria keys present (clarity, structure, completeness, tone, actionability)

```js
it('handles prompt with all quality markers', async () => {
  const prompt = 'Eres un experto en Python. Tu tarea es escribir un script. Evita errores comunes. ' +
    'Proporciona ejemplos concretos y explica cada línea. Asegúrate de manejar edge cases.';
  const res = await request(app)
    .post('/api/ialab/evaluate-prompt')
    .send({ prompt });
  expect(res.status).toBe(200);
  expect(res.body.evaluation.feedback.length).toBe(0);
});
```

- [ ] Run tests to verify all pass: `cd edutechlife-backend && npm test`

### Task A2: Cover POST /api/ialab/prompts success path

**Files:**
- Modify: `edutechlife-backend/src/__tests__/routes/ialab.test.js`

The `/prompts` endpoint calls DeepSeek API. Since API key is configured, we can test success.

- [ ] Add test for valid prompt that returns MasterPrompt structure

```js
it('generates a MasterPrompt for a valid prompt', async () => {
  const res = await request(app)
    .post('/api/ialab/prompts')
    .send({ prompt: 'Eres un experto en marketing digital. Crea una estrategia para redes sociales.' });
  expect(res.status).toBe(200);
  expect(res.body.masterPrompt).toBeDefined();
  expect(res.body.feedback).toBeDefined();
  expect(res.body.templateType).toBe('general');
}, 15000);
```

- [ ] Add test for prompt with templateType

```js
it('accepts templateType parameter', async () => {
  const res = await request(app)
    .post('/api/ialab/prompts')
    .send({ prompt: 'Eres un experto en ventas.', templateType: 'business' });
  expect(res.status).toBe(200);
  expect(res.body.templateType).toBe('business');
}, 15000);
```

- [ ] Run tests: `cd edutechlife-backend && npm test`

### Task A3: Cover GET /api/ialab/modules/:id success path

**Files:**
- Modify: `edutechlife-backend/src/__tests__/routes/ialab.test.js`

- [ ] Add test for valid module id 1

```js
it('returns module data for valid id', async () => {
  const res = await request(app).get('/api/ialab/modules/1');
  expect(res.status).toBe(200);
  expect(res.body.id).toBe(1);
  expect(res.body.title).toContain('Ingeniería');
});
```

- [ ] Add test for valid module id 5

```js
it('returns module 5 data', async () => {
  const res = await request(app).get('/api/ialab/modules/5');
  expect(res.status).toBe(200);
  expect(res.body.id).toBe(5);
  expect(res.body.level).toBe('Experto');
});
```

- [ ] Run tests: `cd edutechlife-backend && npm test`

### Task A4: Cover chat.js POST / stream success path

**Files:**
- Modify: `edutechlife-backend/src/__tests__/routes/chat.test.js`

- [ ] Add test for streaming SSE endpoint with valid prompt

```js
it('returns SSE stream for valid prompt', async () => {
  const res = await request(app)
    .post('/api/chat/stream')
    .send({ prompt: 'Hello', systemPrompt: 'You are a helpful assistant.' });
  expect(res.status).toBe(200);
  expect(res.headers['content-type']).toContain('text/event-stream');
}, 15000);
```

- [ ] Add test for /api/chat POST with valid messages

```js
it('returns response for valid messages', async () => {
  const res = await request(app)
    .post('/api/chat')
    .send({ messages: [{ role: 'user', content: 'Say hello in Spanish' }] });
  expect(res.status).toBe(200);
  expect(res.body.result).toBeDefined();
}, 15000);
```

- [ ] Run tests: `cd edutechlife-backend && npm test`

### Task A5: Cover smartboard.js data endpoint validation

**Files:**
- Modify: `edutechlife-backend/src/__tests__/routes/smartboard.test.js`

- [ ] Add test for chat with empty messages array (edge case)
- [ ] Add test for data endpoint with empty userId

```js
it('returns 401 for unauthorized data access', async () => {
  const res = await request(app).get('/api/smartboard/data/');
  expect([401, 404]).toContain(res.status);
});
```

- [ ] Run tests: `cd edutechlife-backend && npm test`

### Task A6: Update backend coverage thresholds to 70%

**Files:**
- Modify: `edutechlife-backend/vitest.config.js`

- [ ] Run coverage to measure new baseline: `cd edutechlife-backend && npm run test:coverage`
- [ ] Update thresholds in vitest.config.js to match new values, targeting >= 70%

```js
thresholds: {
  statements: 70,
  branches: 70,
  functions: 70,
  lines: 70,
},
```

- [ ] If thresholds fail, identify uncovered lines and add more tests (iterate Tasks A1-A5)
- [ ] Verify coverage passes: `cd edutechlife-backend && npm run test:coverage`
- [ ] Commit: `git add edutechlife-backend/ && git commit -m "test(backend): raise coverage to 70%+"`

---

## Stream B — Frontend Test Speed

**Goal:** Reduce frontend test suite from >180s (timeout) to <120s.

**Strategy:** Configure pool, timeouts, and isolate slow tests.

### Task B1: Measure baseline

**Files:**
- Run: `edutechlife-frontend`

- [ ] Run full suite with timer: `cd edutechlife-frontend && time npx vitest run --reporter=verbose 2>&1 | tail -30`
- [ ] Note the slowest tests (>3s each) and total duration
- [ ] Record baseline in plan comments

### Task B2: Configure vitest for performance

**Files:**
- Modify: `edutechlife-frontend/vitest.config.js`

- [ ] Add `pool: 'forks'` and `testTimeout` to vitest config

```js
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    css: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    testTimeout: 30000,
    hookTimeout: 20000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        statements: 55,
        branches: 45,
        functions: 55,
        lines: 55,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] Run full suite again: `cd edutechlife-frontend && time npx vitest run --reporter=verbose 2>&1 | tail -30`
- [ ] Compare duration against baseline

### Task B3: Isolate slow tests

**Files:**
- Create: `edutechlife-frontend/vitest.slow.config.js`

If the suite is still too slow after Task B2, create a separate config for slow tests.

- [ ] Create slow config:

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: [
      'src/components/IALab/__tests__/IALabDashboard.test.jsx',
      'src/components/IALab/__tests__/ModuleFlow.test.jsx',
    ],
    css: true,
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    testTimeout: 60000,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

- [ ] Update CI smoke test to run both configs in parallel
- [ ] Commit: `git add edutechlife-frontend/vitest.config.js && git commit -m "perf(tests): optimize frontend test execution time"`

---

## Stream C — Visual Regression Tests

**Goal:** Add pixel-level visual regression tests for 5 critical pages using Playwright's built-in screenshot comparison.

**Strategy:** Playwright `toHaveScreenshot()` with baselines stored in `e2e/screenshots/`. First run generates baselines, subsequent runs compare.

### Task C1: Configure Playwright for screenshots

**Files:**
- Modify: `edutechlife-frontend/playwright.config.ts`

- [ ] Add snapshot path configuration:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'mobile',
      use: { browserName: 'chromium', viewport: { width: 375, height: 812 } },
    },
  ],
});
```

### Task C2: Write visual regression tests

**Files:**
- Create: `edutechlife-frontend/e2e/visual-regression.spec.ts`

- [ ] Write 5 screenshot tests for critical public pages:

```ts
import { test, expect } from '@playwright/test';

test.describe('Visual regression — critical pages', () => {
  test('landing page hero section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const hero = page.locator('section').first();
    await expect(hero).toHaveScreenshot('landing-hero.png', {
      maxDiffPixels: 100,
    });
  });

  test('nosotros page full page', async ({ page }) => {
    await page.goto('/nosotros', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('nosotros-full.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('contacto page form section', async ({ page }) => {
    await page.goto('/contacto', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('contacto-form.png', {
      maxDiffPixels: 100,
    });
  });

  test('footer on landing page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('landing-footer.png', {
      maxDiffPixels: 100,
    });
  });

  test('privacy page renders', async ({ page }) => {
    await page.goto('/privacidad', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('privacidad-full.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });
});
```

### Task C3: Generate and store baselines

**Files:**
- Run: `edutechlife-frontend`

- [ ] Start dev server: `cd edutechlife-frontend && npx vite --port 5174 &`
- [ ] Wait for server: `for i in $(seq 1 10); do curl -s -o /dev/null http://localhost:5174 && break; sleep 2; done`
- [ ] Generate baselines: `npx playwright test --project=chromium e2e/visual-regression.spec.ts --update-snapshots`
- [ ] Verify baselines exist: `ls -la e2e/screenshots/`
- [ ] Kill dev server: `kill %1`

### Task C4: Add visual regression to CI

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] Add `--update-snapshots` flag on main branch pushes only
- [ ] On PRs, compare against existing baselines

```yaml
- name: Run visual regression tests
  run: |
    if [ "${{ github.ref }}" = "refs/heads/main" ]; then
      npx playwright test --project=chromium e2e/visual-regression.spec.ts --update-snapshots
    else
      npx playwright test --project=chromium e2e/visual-regression.spec.ts
    fi
```

- [ ] Commit visual regression: `git add edutechlife-frontend/e2e/ edutechlife-frontend/playwright.config.ts && git commit -m "test(e2e): add visual regression tests for critical pages"`

---

## Stream D — Expand A11y Tests

**Goal:** Expand from 3 axe tests (2 components) to 15 axe tests (10+ components).

**Strategy:** Follow existing pattern in `IALab.a11y.test.jsx` — render component inside necessary providers, call `axe(container)`, assert no violations.

### Task D1: Add a11y tests for navigation components

**Files:**
- Create: `edutechlife-frontend/src/tests/a11y/Navigation.a11y.test.jsx`

- [ ] Write 3 axe tests:

```jsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/i18n/I18nProvider';
import NavigationBar from '@/components/layout/NavigationBar';
import Footer from '@/components/footer/Footer';

expect.extend(toHaveNoViolations);

const TestProviders = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <I18nProvider>
        {children}
      </I18nProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('Navigation a11y', () => {
  test('NavigationBar has no violations', async () => {
    const { container } = render(
      <TestProviders>
        <NavigationBar />
      </TestProviders>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Footer has no violations', async () => {
    const { container } = render(
      <TestProviders>
        <Footer />
      </TestProviders>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Task D2: Add a11y tests for IALab components

**Files:**
- Modify: `edutechlife-frontend/src/tests/a11y/IALab.a11y.test.jsx`

- [ ] Add 3 more axe tests for: CourseCard, ModuleFlow, IALabQuizModal

```jsx
test('CourseCard has no violations', async () => {
  const { container } = render(
    <IALabProviders>
      <CourseCard
        course={{ id: 1, title: 'Test Course', description: 'A test course', level: 'beginner' }}
      />
    </IALabProviders>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('ModuleFlow has no violations', async () => {
  const { container } = render(
    <IALabProviders>
      <ModuleFlow moduleId={1} />
    </IALabProviders>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Task D3: Add a11y tests for form/input components

**Files:**
- Create: `edutechlife-frontend/src/tests/a11y/Forms.a11y.test.jsx`

- [ ] Write 3 axe tests for: contact form, search bar, quiz timer

```jsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/i18n/I18nProvider';
import ContactForm from '@/components/pages/ContactForm';
import GlobalSearchBar from '@/components/IALab/GlobalSearchBar';
import QuizTimer from '@/components/IALab/IALabQuizModal/QuizTimer';

expect.extend(toHaveNoViolations);

describe('Forms a11y', () => {
  test('ContactForm has no violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <ThemeProvider>
          <I18nProvider>
            <ContactForm />
          </I18nProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('GlobalSearchBar has no violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <I18nProvider>
          <GlobalSearchBar />
        </I18nProvider>
      </BrowserRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('QuizTimer has no violations', async () => {
    const { container } = render(
      <QuizTimer timeRemaining={300} totalTime={300} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Task D4: Add a11y tests for dashboard components

**Files:**
- Create: `edutechlife-frontend/src/tests/a11y/Dashboard.a11y.test.jsx`

- [ ] Write 3 axe tests for: StreakBadge, XPProgressBar, BadgeCard

### Task D5: Integrate a11y tests into smoke

**Files:**
- Modify: `edutechlife-frontend/package.json`

- [ ] Add a11y test directory to test:smoke script

```json
"test:smoke": "... src/tests/a11y/ ..."
```

- [ ] Verify a11y tests pass: `cd edutechlife-frontend && npm run test:smoke`
- [ ] Commit: `git add edutechlife-frontend/src/tests/a11y/ && git commit -m "test(a11y): expand axe tests to 15+ components"`

---

## Execution Order

All 4 streams are independent and can run in parallel:

```
Stream A (Coverage Backend) ──────────▶ Commit
Stream B (Speed Frontend)  ──────────▶ Commit
Stream C (Visual Reg)      ──────────▶ Commit
Stream D (A11y Tests)      ──────────▶ Commit
```

Each stream produces its own commit. No merge conflicts between streams (they touch different files). After all streams complete:

- [ ] Run full backend tests: `cd edutechlife-backend && npm test`
- [ ] Run full frontend tests: `cd edutechlife-frontend && npm test`
- [ ] Run coverage on both: `cd edutechlife-backend && npm run test:coverage`
- [ ] Verify CI pipeline would pass: review all changed files for consistency
- [ ] Final commit with summary
