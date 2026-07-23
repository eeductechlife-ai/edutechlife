# Audit Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 7 issues found in the exhaustive audit, raising project score from 7.8→8.5+ without breaking any existing functionality.

**Architecture:** All changes are strictly additive or surgical — modifying only the problematic lines while keeping every existing behavior intact. Each task is self-contained, testable independently.

**Golden rule:** NEVER alter component logic, routes, Clerk config, i18n keys, Supabase queries, or any working feature. Only fix infra/config issues.

---

### Task 1: Fix CI workflow gitignore

**Files:**
- Modify: `/Users/home/Desktop/edutechlife/.gitignore:33`

The root `.gitignore` has `.github/workflows/ci.yml` on line 33, which means the CI workflow file won't be present on fresh clones.

- [ ] **Step 1: Read and edit .gitignore**

Remove line 33 (`.github/workflows/ci.yml`) from the file.

- [ ] **Step 2: Verify**

```bash
git check-ignore .github/workflows/ci.yml
```
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add .gitignore && git commit -m "fix: un-ignore CI workflow in root .gitignore"
```

---

### Task 2: Remove repomix-output.xml from tracking

**Files:**
- Remove from git: `edutechlife-frontend/repomix-output.xml`

Already in `.gitignore` but was committed before being added.

- [ ] **Step 1: Remove from git tracking**

```bash
cd edutechlife-frontend && git rm --cached repomix-output.xml
```

- [ ] **Step 2: Verify**

```bash
git ls-files repomix-output.xml
```
Expected: no output

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove repomix-output.xml from git tracking (full source dump)"
```

---

### Task 3: Fix absolute path in vite.config.js

**Files:**
- Modify: `edutechlife-frontend/vite.config.js:216`

- [ ] **Step 1: Read and edit**

Change line 216 from:
```js
'@solana/web3.js': '/Users/home/Desktop/edutechlife/edutechlife-frontend/src/solana-stub.js'
```
To:
```js
'@solana/web3.js': path.resolve(__dirname, './src/solana-stub.js')
```

- [ ] **Step 2: Verify build**

```bash
cd edutechlife-frontend && npm run build:fast
```
Expected: build succeeds

- [ ] **Step 3: Commit**

```bash
git add vite.config.js && git commit -m "fix: use path.resolve instead of absolute filesystem path in vite alias"
```

---

### Task 4: Consolidate font loading

**Files:**
- Modify: `edutechlife-frontend/index.html:23`
- Modify: `edutechlife-frontend/src/index.css:1`

Current: Inter + Geist loaded TWICE (in index.html AND index.css). Montserrat only in HTML. JetBrains Mono only in CSS.

- [ ] **Step 1: Add JetBrains Mono to index.html**

Change line 23 to:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700;800;900&family=Geist:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Remove duplicate font import from index.css**

Replace line 1 with:
```css
/* Fonts loaded via index.html -- see <link> tag */
```

- [ ] **Step 3: Verify build**

```bash
cd edutechlife-frontend && npm run build:fast
```

- [ ] **Step 4: Commit**

```bash
git add index.html src/index.css && git commit -m "perf: consolidate font loading -- remove duplicate Google Fonts import"
```

---

### Task 5: Consolidate CSS imports (26 → 7)

**Files:**
- Create: `edutechlife-frontend/src/styles/core.css`
- Create: `edutechlife-frontend/src/styles/components.css`
- Create: `edutechlife-frontend/src/styles/effects.css`
- Modify: `edutechlife-frontend/src/index.css`

- [ ] **Step 1: Create styles/core.css**

```css
/* Core styles -- base, accessibility, performance, utilities */
@import "./base.css";
@import "./accessibility.css";
@import "./performance.css";
@import "./utilities.css";
@import "./platform-optimizations.css";
```

- [ ] **Step 2: Create styles/components.css**

```css
/* Component library -- glassmorphism, hero, nav, sections, pages, chatbot, cards */
@import "./components.css";
@import "./glassmorphism.css";
@import "./glassmorphism-extras.css";
@import "./hero.css";
@import "./stats.css";
@import "./nav-footer.css";
@import "./sections.css";
@import "./pages.css";
@import "./chatbot.css";
@import "./utilities-extras.css";
```

- [ ] **Step 3: Create styles/effects.css**

```css
/* Effects & animations */
@import "./animations.css";
@import "./keyframes.css";
@import "./effects-gaming.css";
@import "./typography-cleanup.css";
@import "./marquee.css";
@import "./loading.css";
```

- [ ] **Step 4: Update index.css**

Replace all 26 imports with:
```css
@import "./design-system/tokens.css";
@import "./styles/tokens.css";
@import "./components/DiagnosticoVAK/DiagnosticoVAK.css";
@import "./components/IALab/IALab.css";
@import "./styles/core.css";
@import "./styles/components.css";
@import "./styles/effects.css";
```

- [ ] **Step 5: Verify build + tests**

```bash
cd edutechlife-frontend && npm run build:fast && npm test
```
Expected: build succeeds, all tests pass

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/styles/core.css src/styles/components.css src/styles/effects.css && git commit -m "perf: consolidate 26 CSS imports into 7 logical groups"
```

---

### Task 6: Write backend health endpoint test

**Files:**
- Create: `edutechlife-backend/src/routes/health.test.js`

- [ ] **Step 1: Read the existing test-setup.js and health route**

Read `edutechlife-backend/src/test-setup.js` and `edutechlife-backend/src/routes/health.js` to understand the patterns.

- [ ] **Step 2: Create health.test.js**

```js
import { describe, it, expect } from 'vitest';

describe('Health route', () => {
  it('exports a router function', async () => {
    const mod = await import('./health.js');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
```

- [ ] **Step 3: Run test**

```bash
cd edutechlife-backend && npx vitest run src/routes/health.test.js
```
Expected: test passes

- [ ] **Step 4: Commit**

```bash
git add src/routes/health.test.js && git commit -m "test(backend): add health endpoint module load test"
```

---

### Task 7: Add backend README

**Files:**
- Create: `edutechlife-backend/README.md`

- [ ] **Step 1: Create README.md**

```markdown
# EdutechLife Backend

Express.js API server for the EdutechLife platform.

## Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Auth:** Clerk JWT verification
- **Database:** Supabase (PostgreSQL)
- **AI:** DeepSeek API
- **Payments:** Stripe
- **Deploy:** Render / Vercel

## Quick Start

```bash
cp .env.example .env
# Fill in env vars: Clerk, Supabase, DeepSeek, Stripe
npm install
npm run dev
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm test` | Run vitest |
| `npm run test:coverage` | With coverage |
| `npm run lint` | ESLint |

## Project Structure

```
src/
├── app.js           # Express app (middleware, routes, CORS, helmet)
├── index.js         # Entry point
├── routes/          # health, chat, ialab, smartboard, voice, tts, stripe
├── middleware/      # auth, rateLimiter, sanitize, errorHandler, stripeWebhook
├── services/        # stripe, deepseek, avatarService
├── controllers/     # Route handlers
├── db/              # Database utilities
├── data/            # Static data (plans, modules)
└── docs/            # Swagger config
```

## API Endpoints

| Route | Auth | Description |
|-------|------|-------------|
| `GET /api/health` | No | Health check |
| `POST /api/chat` | No | DeepSeek AI chat |
| `GET /api/ialab/*` | Yes | IALab content & progress |
| `GET /api/smartboard/*` | Yes | SmartBoard data & progress |
| `POST /api/stripe/*` | Varies | Stripe checkout & webhook |
| `POST /api/voice` | No | Voice processing |
| `POST /api/tts` | No | Text-to-speech |
```

- [ ] **Step 2: Commit**

```bash
git add README.md && git commit -m "docs: add backend README with setup and API overview"
```
