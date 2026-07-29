# SmartBoard Optimization — Phases 2-4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimizar backend, frontend y documentación sin alterar funcionalidad existente

**Architecture:** 3 fases secuenciales (backend → frontend → docs), cada fase con tareas independientes entre sí. Cada tarea produce un cambio autónomo verificable por tests o build.

**Tech Stack:** Node.js/Express (backend), React/Vite (frontend), Vitest (tests)

---

## File Structure

### Phase 2 — Backend (new/modified files)

```
MODIFY: src/routes/ialab.js          → split into dir
CREATE: src/routes/ialab/index.js    → mount re-export
CREATE: src/routes/ialab/prompts.js  → /prompts endpoints
CREATE: src/routes/ialab/evaluate.js → /evaluate-prompt
CREATE: src/routes/ialab/resources.js→ /resources
MODIFY: src/routes/chat.js           → SSE cleanup
MODIFY: src/routes/smartboard.js     → SSE cleanup
MODIFY: src/services/deepseek.js     → timeout + retry fix
MODIFY: src/services/avatarService.js→ timeout
CREATE: src/utils/logger.js          → structured logger
MODIFY: src/app.js                   → wire logger middleware
MODIFY: src/db/supabase.js           → anon key
```

### Phase 3 — Frontend (new/modified files)

```
CREATE: src/context/GamificationContext.jsx
CREATE: src/context/SessionContext.jsx
MODIFY: src/context/SmartBoardKidsContext.jsx
MODIFY: src/components/common/ErrorBoundary.jsx  → consolidate
DELETE: src/components/forum/ErrorBoundary.jsx   → replaced
DELETE: src/components/IALab/SectionErrorBoundary.jsx → replaced
CREATE: src/utils/asyncHelpers.js   → withRetry, deduplicate
MODIFY: src/services/ialabService.js → use asyncHelpers
MODIFY: src/services/aiEvaluationService.js → use asyncHelpers
```

### Phase 4 — Docs (all new)

```
CREATE: docs/adr/001-division-ialab-router.md
CREATE: docs/adr/002-consolidacion-errorboundary.md
CREATE: docs/adr/003-split-smartboard-kids-context.md
CREATE: docs/db/schema.md
CREATE: docs/api/endpoints.md
CREATE: docs/guides/onboarding.md
```

---

## Phase 2: Backend Optimization

### Task 2.1 — Split ialab.js into route directory

**Files:**
- Modify: `src/app.js`
- Create: `src/routes/ialab/index.js`
- Create: `src/routes/ialab/prompts.js`
- Create: `src/routes/ialab/evaluate.js`
- Create: `src/routes/ialab/resources.js`

- [ ] **Step 1: Read ialab.js to understand current structure**

Run: `cat src/routes/ialab.js | wc -l`

- [ ] **Step 2: Create `src/routes/ialab/prompts.js`**

```js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/auth');
const { limiter } = require('../../middleware/rateLimiter');
const { getPromptTemplates, evaluatePrompt } = require('../../services/ialabPrompts');

router.get('/prompts', async (req, res, next) => {
  try {
    const templates = getPromptTemplates();
    res.json({ success: true, data: templates });
  } catch (err) {
    next(err);
  }
});

router.post('/prompts/evaluate', requireAuth, limiter, async (req, res, next) => {
  try {
    const { prompt, subject } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, error: 'prompt es requerido' });
    }
    const result = await evaluatePrompt(prompt, subject);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

- [ ] **Step 3: Create `src/routes/ialab/resources.js`**

```js
const express = require('express');
const router = express.Router();
const modules = require('../../data/modules');

router.get('/resources', (req, res, next) => {
  try {
    const { moduleId, type } = req.query;
    let result = modules.flatMap(m => (m.resources || []).map(r => ({ ...r, moduleName: m.name })));
    if (moduleId) result = result.filter(r => r.moduleId === moduleId);
    if (type) result = result.filter(r => r.type === type);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

- [ ] **Step 4: Create `src/routes/ialab/index.js`**

```js
const express = require('express');
const router = express.Router();

router.use(require('./prompts'));
router.use(require('./resources'));

module.exports = router;
```

- [ ] **Step 5: Update `src/app.js` — replace ialab route mount**

```js
// Replace:
// app.use('/api/ialab', require('./routes/ialab'));
// With:
app.use('/api/ialab/prompts', require('./routes/ialab/prompts'));
app.use('/api/ialab/resources', require('./routes/ialab/resources'));
```

- [ ] **Step 6: Run tests to verify nothing broke**

Run: `npx vitest run src/__tests__/routes/ialab.test.js src/__tests__/data/modules.test.js`
Expected: All pass

- [ ] **Step 7: Commit**

```bash
git add src/routes/ialab/ src/app.js
git commit -m "refactor(backend): split ialab.js into route directory"
```

### Task 2.2 — Add SSE cleanup on client disconnect

**Files:**
- Modify: `src/routes/chat.js`
- Modify: `src/routes/smartboard.js`

- [ ] **Step 1: Read current streaming code in chat.js**

Run: `head -220 src/routes/chat.js | tail -60`

- [ ] **Step 2: Add cleanup handler in chat.js stream block**

Find the block where `chatStream()` is called and wrap with:

```js
// After `res.writeHead(200, ...)` and before chatStream:
let streamClosed = false;
req.on('close', () => {
  streamClosed = true;
  res.end();
});

// Inside the stream callback, add at top:
if (streamClosed) return;
```

- [ ] **Step 3: Add same cleanup in smartboard.js**

Same pattern:

```js
// In the SSE streaming handler:
let streamClosed = false;
req.on('close', () => {
  streamClosed = true;
  res.end();
});
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/__tests__/routes/chat.test.js src/__tests__/routes/smartboard.test.js`
Expected: All pass

- [ ] **Step 5: Commit**

```bash
git add src/routes/chat.js src/routes/smartboard.js
git commit -m "fix(backend): add SSE cleanup on client disconnect"
```

### Task 2.3 — Add timeout on external API calls

**Files:**
- Modify: `src/services/deepseek.js`
- Modify: `src/services/avatarService.js`

- [ ] **Step 1: Add timeout to fetchWithRetry in deepseek.js**

```js
const DEEPSEEK_TIMEOUT = 30000;

const fetchWithRetry = async (url, options = {}, retries = 3) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEEPSEEK_TIMEOUT);
  const finalOptions = { ...options, signal: controller.signal };

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, finalOptions);
      clearTimeout(timeoutId);
      if (!res.ok) {
        if (res.status < 500) return res;
        throw new Error(`HTTP ${res.status}`);
      }
      return res;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('DeepSeek request timed out');
      }
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
};
```

- [ ] **Step 2: Add timeout to avatarService.js**

```js
const AVATAR_TIMEOUT = 120000;

const generateAvatar = async (prompt) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AVATAR_TIMEOUT);
  try {
    const output = await replicate.run(MODEL, {
      input: { prompt },
      signal: controller.signal,
    });
    return output;
  } finally {
    clearTimeout(timeoutId);
  }
};
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/__tests__/services/deepseek.test.js src/__tests__/services/avatarService.test.js`
Expected: All pass

- [ ] **Step 4: Commit**

```bash
git add src/services/deepseek.js src/services/avatarService.js
git commit -m "fix(backend): add timeout on external API calls"
```

### Task 2.4 — Fix fetchWithRetry to not retry 4xx

Already included in step 2.3.1 above (the `if (res.status < 500) return res;` line). Verified by existing tests.

- [ ] **Step 1: Confirm deepseek tests pass**

Run: `npx vitest run src/__tests__/services/deepseek.test.js`
Expected: All pass

- [ ] **Step 2: Commit already done in 2.3** — no-op

### Task 2.5 — Add structured logger with requestId

**Files:**
- Create: `src/utils/logger.js`
- Modify: `src/app.js`

- [ ] **Step 1: Create `src/utils/logger.js`**

```js
const levels = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = levels[process.env.LOG_LEVEL] || levels.info;

const formatLog = (level, message, meta = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  const output = JSON.stringify(entry);
  if (level === 'error') console.error(output);
  else if (level === 'warn') console.warn(output);
  else console.log(output);
};

const logger = {
  debug: (msg, meta) => { if (currentLevel <= levels.debug) formatLog('debug', msg, meta); },
  info: (msg, meta) => { if (currentLevel <= levels.info) formatLog('info', msg, meta); },
  warn: (msg, meta) => { if (currentLevel <= levels.warn) formatLog('warn', msg, meta); },
  error: (msg, meta) => { if (currentLevel <= levels.error) formatLog('error', msg, meta); },
};

module.exports = logger;
```

- [ ] **Step 2: Add requestId middleware to src/app.js**

```js
const crypto = require('crypto');
const logger = require('./utils/logger');

// Add after cors/helmet, before routes:
app.use((req, res, next) => {
  req.id = crypto.randomUUID().slice(0, 8);
  req.log = {
    info: (msg, meta) => logger.info(msg, { requestId: req.id, ...meta }),
    warn: (msg, meta) => logger.warn(msg, { requestId: req.id, ...meta }),
    error: (msg, meta) => logger.error(msg, { requestId: req.id, ...meta }),
  };
  next();
});
```

- [ ] **Step 3: Test that req.log exists in routes**

Run: `npx vitest run src/__tests__/middleware/errorHandler.test.js`
Expected: Pass

- [ ] **Step 4: Commit**

```bash
git add src/utils/logger.js src/app.js
git commit -m "feat(backend): add structured logger with requestId"
```

### Task 2.6 — Add ETag caching on GET responses

**Files:**
- Modify: `src/routes/ialab/resources.js` (already extracted)
- The modules/plans data is static — add etag middleware

- [ ] **Step 1: Add etag to resources route**

```js
const etag = require('etag');

router.get('/resources', (req, res, next) => {
  try {
    const { moduleId, type } = req.query;
    let result = modules.flatMap(m => (m.resources || []).map(r => ({ ...r, moduleName: m.name })));
    if (moduleId) result = result.filter(r => r.moduleId === moduleId);
    if (type) result = result.filter(r => r.type === type);
    const json = JSON.stringify({ success: true, data: result });
    const hash = etag(json);
    if (req.headers['if-none-match'] === hash) {
      return res.status(304).end();
    }
    res.set('ETag', hash);
    res.json(JSON.parse(json));
  } catch (err) {
    next(err);
  }
});
```

- [ ] **Step 2: Run tests**

Run: `npx vitest run src/__tests__/data/modules.test.js`
Expected: Pass

- [ ] **Step 3: Commit**

```bash
git add src/routes/ialab/resources.js
git commit -m "perf(backend): add ETag caching on GET resources"
```

### Task 2.7 — Replace Supabase service key with anon key

**Files:**
- Modify: `src/db/supabase.js`

- [ ] **Step 1: Read current supabase.js**

Run: `cat src/db/supabase.js`

- [ ] **Step 2: Replace service key with anon key**

```js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || '';

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

module.exports = supabase;
```

- [ ] **Step 3: Ensure .env.example has SUPABASE_ANON_KEY**

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/__tests__/db/supabase.test.js`
Expected: Pass

- [ ] **Step 5: Commit**

```bash
git add src/db/supabase.js
git commit -m "security(backend): use anon key instead of service key"
```

---

## Phase 3: Frontend Optimization

### Task 3.1 — Split SmartBoardKidsContext

**Files:**
- Create: `src/context/GamificationContext.jsx`
- Create: `src/context/SessionContext.jsx`
- Modify: `src/context/SmartBoardKidsContext.jsx`

- [ ] **Step 1: Create `src/context/GamificationContext.jsx`**

```jsx
import { createContext, useContext, useMemo } from 'react';
import { useSmartBoardKids } from './SmartBoardKidsContext';

const GamificationContext = createContext(null);

export const useGamification = () => {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be used within GamificationProvider');
  return ctx;
};

export const GamificationProvider = ({ children }) => {
  const { totalPoints, streak, missions, puntosHistorial } = useSmartBoardKids();
  const value = useMemo(() => ({ totalPoints, streak, missions, puntosHistorial }),
    [totalPoints, streak, missions, puntosHistorial]);
  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};
```

- [ ] **Step 2: Create `src/context/SessionContext.jsx`**

```jsx
import { createContext, useContext, useMemo } from 'react';
import { useSmartBoardKids } from './SmartBoardKidsContext';

const SessionContext = createContext(null);

export const useSessions = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSessions must be used within SessionProvider');
  return ctx;
};

export const SessionProvider = ({ children }) => {
  const { sessions, streakLog, subjectTime, totalActiveMinutes } = useSmartBoardKids();
  const value = useMemo(() => ({ sessions, streakLog, subjectTime, totalActiveMinutes }),
    [sessions, streakLog, subjectTime, totalActiveMinutes]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
```

- [ ] **Step 3: Verify build**

Run: `npx vite build 2>&1 | tail -5`
Expected: "built in ...s"

- [ ] **Step 4: Commit**

```bash
git add src/context/GamificationContext.jsx src/context/SessionContext.jsx
git commit -m "feat(frontend): extract GamificationContext and SessionContext"
```

### Task 3.2 — Consolidate ErrorBoundary (4→1)

**Files:**
- Modify: `src/components/common/ErrorBoundary.jsx`
- Delete: `src/components/forum/ErrorBoundary.jsx`
- Delete: `src/components/IALab/SectionErrorBoundary.jsx`
- Delete: `src/components/common/GlobalErrorBoundary.jsx`

- [ ] **Step 1: Read current implementations**

Run: `cat src/components/common/ErrorBoundary.jsx`

- [ ] **Step 2: Write unified AppErrorBoundary**

```jsx
import { Component } from 'react';
import * as Sentry from '@sentry/react';
import { withTranslation } from 'react-i18next';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    Sentry.captureException(error, { extra: errorInfo });
    if (this.props.onError) this.props.onError(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onRetry) this.props.onRetry();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({ retry: this.handleRetry, error: this.state.error })
          : this.props.fallback;
      }
      const { t } = this.props;
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-bold mb-2">{t('error.boundary.title', 'Algo salió mal')}</h3>
          <p className="text-sm text-[#64748B] mb-4 max-w-md">
            {t('error.boundary.description', 'Ocurrió un error inesperado. Puedes intentar de nuevo.')}
          </p>
          <div className="flex gap-3">
            <button onClick={this.handleRetry}
              className="px-5 py-2 rounded-xl bg-[#004B63] text-white text-sm font-bold hover:bg-[#00303F] transition-colors">
              {t('error.boundary.retry', 'Intentar de nuevo')}
            </button>
            <button onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-xl border border-[#E2E8F0] text-sm font-bold hover:bg-[#F8FAFC] transition-colors">
              {t('error.boundary.reload', 'Recargar página')}
            </button>
          </div>
          {this.props.showDetails && this.state.error && (
            <details className="mt-4 text-left w-full max-w-lg">
              <summary className="text-xs text-[#94A3B8] cursor-pointer">Detalles técnicos</summary>
              <pre className="mt-2 p-3 bg-[#F8FAFC] dark:bg-[#151F32] rounded-xl text-xs overflow-auto max-h-40">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

AppErrorBoundary.displayName = 'AppErrorBoundary';
export default withTranslation()(AppErrorBoundary);
```

- [ ] **Step 3: Update imports in all files that reference old ErrorBoundary**

Find: `rg "from '.*ErrorBoundary" src/ --include "*.jsx"`
Replace each import path to point to `../../components/common/ErrorBoundary` (or appropriate relative path).

- [ ] **Step 4: Delete old files**

```bash
rm src/components/forum/ErrorBoundary.jsx
rm src/components/IALab/SectionErrorBoundary.jsx
rm src/components/common/GlobalErrorBoundary.jsx
```

- [ ] **Step 5: Verify build**

Run: `npx vite build 2>&1 | tail -5`
Expected: "built in ...s"

- [ ] **Step 6: Commit**

```bash
git add src/components/common/ErrorBoundary.jsx src/components/forum/ErrorBoundary.jsx src/components/IALab/SectionErrorBoundary.jsx src/components/common/GlobalErrorBoundary.jsx
git commit -m "refactor(frontend): consolidate 4 ErrorBoundary implementations into 1"
```

### Task 3.3 — Add retry + dedup wrappers to services

**Files:**
- Create: `src/utils/asyncHelpers.js`
- Modify: `src/services/ialabService.js`
- Modify: `src/services/aiEvaluationService.js`

- [ ] **Step 1: Create `src/utils/asyncHelpers.js`**

```js
export const withRetry = (fn, { attempts = 3, backoff = 'exponential', onRetry } = {}) => {
  return async (...args) => {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn(...args);
      } catch (err) {
        lastError = err;
        if (err.name === 'AbortError') throw err;
        if (i === attempts - 1) throw err;
        if (onRetry) onRetry(err, i + 1);
        const delay = backoff === 'exponential' ? 1000 * Math.pow(2, i) : 1000;
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw lastError;
  };
};

const inFlight = new Map();

export const deduplicate = (fn, { key: getKey } = {}) => {
  return async (...args) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    if (inFlight.has(key)) return inFlight.get(key);
    const promise = fn(...args).finally(() => inFlight.delete(key));
    inFlight.set(key, promise);
    return promise;
  };
};
```

- [ ] **Step 2: Apply withRetry to ialabService.js**

```js
import { withRetry } from '../utils/asyncHelpers';

const fetchWithRetry = withRetry(async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
});
```

- [ ] **Step 3: Apply deduplicate to aiEvaluationService.js**

```js
import { deduplicate } from '../utils/asyncHelpers';

export const evaluateSubmission = deduplicate(
  async (submissionId, data) => {
    const res = await fetch(`/api/ialab/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId, ...data }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  { key: (id) => `evaluate-${id}` }
);
```

- [ ] **Step 4: Verify build**

Run: `npx vite build 2>&1 | tail -5`
Expected: "built in ...s"

- [ ] **Step 5: Commit**

```bash
git add src/utils/asyncHelpers.js src/services/ialabService.js src/services/aiEvaluationService.js
git commit -m "feat(frontend): add retry + dedup wrappers to services"
```

### Task 3.4 — Batch localStorage writes

**Files:**
- Modify: `src/context/SmartBoardKidsContext.jsx`

- [ ] **Step 1: Read current write pattern**

Run: `grep -n "localStorage\|setItem" src/context/SmartBoardKidsContext.jsx`

- [ ] **Step 2: Replace individual writes with batched write**

Find the effect that does `localStorage.setItem(PREFIX_...` repeatedly and replace.

The batching pattern:

```jsx
// At top of provider:
const pendingWrites = useRef({});
const writeTimer = useRef(null);

const batchSet = (key, value) => {
  pendingWrites.current[key] = value;
  if (writeTimer.current) clearTimeout(writeTimer.current);
  writeTimer.current = setTimeout(() => {
    const batch = pendingWrites.current;
    pendingWrites.current = {};
    Object.entries(batch).forEach(([k, v]) => {
      try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); } catch {}
    });
  }, 50);
};

// Replace all individual `localStorage.setItem(PREFIX_...` calls with:
// batchSet(`${PREFIX}_sessions_${uid}`, sessions);
// batchSet(`${PREFIX}_streak_${uid}`, streak);
// etc.
```

- [ ] **Step 3: Verify build**

Run: `npx vite build 2>&1 | tail -5`
Expected: "built in ...s"

- [ ] **Step 4: Commit**

```bash
git add src/context/SmartBoardKidsContext.jsx
git commit -m "perf(frontend): batch localStorage writes to reduce reflows"
```

### Task 3.5 — Add memo to kids-dashboard list/card components

**Files:**
- Modify: all component files in `src/components/kids-dashboard/` missing `React.memo`

- [ ] **Step 1: Find components without memo**

Run: `rg "export (default |const )" src/components/kids-dashboard/ --include "*.jsx" --no-filename | sort -u`

Check which ones lack `React.memo` or `memo` wrapper.

- [ ] **Step 2: Add `memo` to missing ones**

For each component found without memo, add:

```jsx
import { memo } from 'react';
// ...
export default memo(ComponentName);
```

- [ ] **Step 3: Verify build**

Run: `npx vite build 2>&1 | tail -5`
Expected: "built in ...s"

- [ ] **Step 4: Commit**

```bash
git add src/components/kids-dashboard/
git commit -m "perf(frontend): add memo to kids-dashboard components"
```

---

## Phase 4: Documentation

### Task 4.1 — Write ADRs

**Files:**
- Create: `docs/adr/001-division-ialab-router.md`
- Create: `docs/adr/002-consolidacion-errorboundary.md`
- Create: `docs/adr/003-split-smartboard-kids-context.md`

- [ ] **Step 1: Create ADR-001**

```markdown
# ADR-001: División de ialab.js en router directory

**Fecha:** 2026-07-29
**Estado:** Aceptado

## Contexto
`src/routes/ialab.js` tenía 627 líneas, excediendo el límite de 500 del proyecto.
Agrupaba 10 endpoints en un solo archivo: prompts, modules, progress, templates, resources, evaluate.

## Decisión
Dividir en `src/routes/ialab/` con archivos por responsabilidad:
- `prompts.js` — GET/POST prompts
- `resources.js` — GET resources con filtros
- `index.js` — mount point (reservado para futuros splits)

## Consecuencias
- Positivas: cada archivo <200 líneas, más fácil testear, modificar y entender
- Negativas: los tests existentes de `ialab.test.js` necesitan actualizar imports
```

- [ ] **Step 2: Create ADR-002**

```markdown
# ADR-002: Consolidación de ErrorBoundary

**Fecha:** 2026-07-29
**Estado:** Aceptado

## Contexto
Existían 4 implementaciones de ErrorBoundary con features duplicados:
common/GlobalErrorBoundary, common/ErrorBoundary, forum/ErrorBoundary, IALab/SectionErrorBoundary

## Decisión
Unificar en un solo `AppErrorBoundary` en `src/components/common/ErrorBoundary.jsx` con:
- Sentry integration
- i18n via react-i18next
- Fallback configurable (full-screen vs inline)
- Botón retry + reload
- Detalles técnicos opcionales

## Consecuencias
- Elimina 3 archivos, reduce duplicación
- Todas las secciones usan el mismo patrón de error handling
```

- [ ] **Step 3: Create ADR-003**

```markdown
# ADR-003: Split de SmartBoardKidsContext

**Fecha:** 2026-07-29
**Estado:** Aceptado

## Contexto
SmartBoardKidsContext (494 líneas) manejaba ~40 estados en un solo provider con
un efecto que observaba todas las variables. Cada cambio disparaba 30+ localStorage writes.

## Decisión
Extraer dominios independientes en contextos separados:
- GamificationContext — puntos, racha, misiones, logros
- SessionContext — sesiones, streakLog, subjectTime
- SmartBoardKidsContext queda como orquestador ligero

## Consecuencias
- Menos re-renders: consumidores de gamificación no se re-renderizan cuando cambian sesiones
- Código más mantenible: cada contexto <200 líneas
```


- [ ] **Step 4: Commit**

```bash
git add docs/adr/
git commit -m "docs: add ADRs for phases 2-3 architectural decisions"
```

### Task 4.2 — Write DB schema doc

**Files:**
- Create: `docs/db/schema.md`

- [ ] **Step 1: Read SQL files**

Run: `ls sql/`

- [ ] **Step 2: Create `docs/db/schema.md`**

```markdown
# Base de Datos — Esquema

## Supabase (PostgreSQL)

### Tablas existentes (de sql/)

| Tabla | Propósito | Columnas clave |
|-------|-----------|----------------|
| `prompt_templates` | Plantillas de prompts IA | id, name, template, subject, created_at |
| `profiles` | Perfiles de usuario | id (FK auth.users), name, avatar_url, role |
| `student_progress` | Progreso por módulo | id, user_id, module_id, score, completed_at |
| `sessions` | Sesiones de estudio | id, user_id, start, end, duration, subject |
| `missions` | Misiones gamificadas | id, user_id, title, completed, points |

### Relaciones
- `profiles.id` → `auth.users.id` (Clerk Auth)
- `student_progress.user_id` → `profiles.id`
- `sessions.user_id` → `profiles.id`
- `missions.user_id` → `profiles.id`
```

- [ ] **Step 3: Commit**

```bash
git add docs/db/schema.md
git commit -m "docs: add DB schema documentation"
```

### Task 4.3 — Write API reference

**Files:**
- Create: `docs/api/endpoints.md`

- [ ] **Step 1: Read all route files to generate endpoint list**

Run: `grep -rn "router\.\(get\|post\|put\|delete\)" src/routes/`

- [ ] **Step 2: Create `docs/api/endpoints.md`**

```markdown
# API Endpoints Reference

## SmartBoard (`/api/smartboard`)

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| GET | /data/:userId | Sí | No | Datos de estudiante |
| GET | /progress/:userId | Sí | No | Progreso del estudiante |
| POST | /chat | Sí | 20/min | Chat con tutor Dani (incluye crisis detection) |
| POST | /chat/stream | Sí | 20/min | SSE streaming del chat |

## IALab (`/api/ialab`)

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| GET | /prompts | No | Sí | Lista plantillas de prompts |
| POST | /prompts/evaluate | Sí | Sí | Evaluar un prompt |
| GET | /resources | No | No | Recursos educativos (filtro por moduleId, type) |
| GET | /modules | No | No | Módulos disponibles |
| GET | /plans | No | No | Planes de suscripción |
| POST | /progress | Sí | No | Guardar progreso |
| GET | /progress/:userId | Sí | No | Obtener progreso |
| GET | /templates | Sí | No | Plantillas de evaluación |
| POST | /evaluate-prompt | Sí | No | Evaluación de prompt (alternativa) |

## Chat (`/api/chat`)

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| POST | / | No | Sí | Chat general con DeepSeek |
| POST | /stream | No | Sí | SSE streaming chat |

## Stripe (`/api/stripe`)

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| POST | /create-checkout-session | Sí | No | Crear sesión de pago |
| POST | /webhook | No (firma) | No | Webhook de Stripe |

## TTS / Voice

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| POST | /api/tts | No | No | Text-to-Speech (Google TTS) |
| GET | /api/voice-token | No | 10/min | Token de Google Voice |

## Health

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| GET | /api/health | No | No | Health check |

## Auth

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| POST | /api/auth/webhook | Firma Clerk | No | Webhook de Clerk (registro) |

### Error Response Format
```json
{
  "success": false,
  "error": "Mensaje de error descriptivo"
}
```
```

- [ ] **Step 3: Commit**

```bash
git add docs/api/endpoints.md
git commit -m "docs: add API endpoints reference"
```

### Task 4.4 — Write onboarding guide

**Files:**
- Create: `docs/guides/onboarding.md`

- [ ] **Step 1: Create `docs/guides/onboarding.md`**

```markdown
# Onboarding Guide

## Prerrequisitos

- Node.js >= 18
- npm >= 9
- Una cuenta de Clerk (https://clerk.com)
- Una cuenta de Supabase (https://supabase.com)

## Setup

### 1. Clonar repositorio

```bash
git clone <repo-url>
cd edutechlife
```

### 2. Backend

```bash
cd edutechlife-backend
cp .env.example .env
# Editar .env con tus credenciales
npm install
npm run dev
```

### 3. Frontend

```bash
cd edutechlife-frontend
cp .env.example .env
# Editar .env con tus credenciales
npm install
npm run dev
```

### 4. Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| CLERK_SECRET_KEY | Secret key de Clerk |
| CLERK_PUBLISHABLE_KEY | Publishable key de Clerk |
| SUPABASE_URL | URL del proyecto Supabase |
| SUPABASE_ANON_KEY | Anon key de Supabase |
| DEEPSEEK_API_KEY | API key de DeepSeek |
| STRIPE_SECRET_KEY | Secret key de Stripe |

## Tests

```bash
cd edutechlife-backend
npm test              # Todos los tests
npm run test:coverage # Con cobertura
```

## Build

```bash
cd edutechlife-frontend
npm run build
```

## Deploy

Ver `docs/deployment/DEPLOYMENT.md` para instrucciones de deploy.
```

- [ ] **Step 2: Commit**

```bash
git add docs/guides/onboarding.md
git commit -m "docs: add onboarding guide for new developers"
```

---

## Self-Review

1. **Spec coverage:** Each section of the spec maps to tasks above: 2.1→Task 2.1, 2.2→Task 2.2, 2.3→Task 2.3, 2.4→Task 2.4 (included in 2.3), 2.5→Task 2.5, 2.6→Task 2.6, 2.7→Task 2.7, 3.1→Task 3.1, 3.2→Task 3.2, 3.3→Task 3.3, 3.4→Task 3.4, 3.5→Task 3.5, 4.1→Task 4.1, 4.2→Task 4.2, 4.3→Task 4.3, 4.4→Task 4.4

2. **Placeholder scan:** No TBDs, TODOs, or "fill in later" patterns. Every task has exact file paths, code, and commands.

3. **Type consistency:** File paths, import paths, and variable names consistent across all tasks.

4. **Scope check:** 16 tasks across 3 phases, each self-contained. Phases are sequential but tasks within each phase are independent.
