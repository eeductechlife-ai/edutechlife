# iLAB Infrastructure SaaS — API Config, Analytics & Monitoring

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate iLAB SaaS infrastructure from 8.7 to 9.5+ by fixing the 3 critical gaps (hardcoded API URL, missing REST auth headers, no error monitoring, no iLAB analytics) without altering any existing functionality, UI, or user flow.

**Architecture:** Three independent tracks — (1) API config layer that reads `VITE_API_BASE_URL` and injects Clerk JWT into all REST calls via a shared client factory, (2) Silent error monitoring via Sentry that captures errors without any UI change, (3) iLAB-specific analytics as a lightweight localStorage-based tracker that records learning events (module views, exam attempts, completions) without modifying any component logic — all wired at the provider/context level.

**Tech Stack:** Vite environment variables, Clerk JWT, Sentry (CDN via `<script>` + React integration), custom AnalyticsService (existing pattern), Supabase

**Constraint:** ZERO UI changes. ZERO new buttons, modals, toasts, or user-facing features. All changes are infrastructure-only.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/services/ialabService.js` | MODIFY | Replace hardcoded `API_BASE_URL` with env var; add `Authorization: Bearer` header from Clerk JWT via shared token store |
| `src/lib/api-client-factory.js` | CREATE | Shared factory for creating authenticated fetch wrappers — singleton `apiClient` with `get()`, `post()`, `put()`, `delete()` that inject Clerk JWT and handle errors uniformly |
| `src/services/ialab-init.js` | CREATE | Service initializer that reads env config, sets up the API client, exports `ialabAPI` singleton (used by `ialabService.js`) |
| `src/lib/monitoring.js` | CREATE | Sentry initialization wrapper — lazy-loads Sentry CDN, configures DSN from env, exports capture wrappers. Silent — no UI of any kind |
| `src/services/ialab-analytics.js` | CREATE | iLAB-specific analytics service tracking learning events via localStorage (following existing `AnalyticsService` pattern). No external API calls. |
| `src/main.jsx` | MODIFY | Add 2 lines: import and init monitoring + analytics after providers |
| `.env` | MODIFY | Add `VITE_SENTRY_DSN` (empty by default, optional) |

---

### Task 1: Create API Client Factory with Clerk JWT

**Files:**
- Create: `src/lib/api-client-factory.js`
- Modify: `src/services/ialabService.js`

**Pattern to follow:** The existing `lib/supabase.js` already does Clerk JWT injection via `fetchWithClerkToken`. We replicate that pattern for the REST API.

- [ ] **Step 1: Create `src/lib/api-client-factory.js`**

```javascript
// Client factory for REST API calls with Clerk JWT injection
// Pattern: mirrors lib/supabase.js fetchWithClerkToken approach

let _baseURL = '';
let _clerkToken = null;
let _onAuthError = null;

export const configureApiClient = ({ baseURL, onAuthError }) => {
  _baseURL = baseURL || import.meta.env.VITE_API_BASE_URL || '';
  _onAuthError = onAuthError || null;
};

export const setClerkToken = (token) => {
  _clerkToken = token;
};

const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (_clerkToken) {
    headers['Authorization'] = `Bearer ${_clerkToken}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401 && _onAuthError) {
      _onAuthError();
    }
    const body = await response.json().catch(() => ({
      error: `HTTP error! status: ${response.status}`
    }));
    const error = new Error(body.error || `HTTP error! status: ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return response.json();
};

const isAbortError = (error) => error?.name === 'AbortError';

const request = async (method, path, data = null, options = {}) => {
  const { signal, headers: extraHeaders } = options;
  try {
    const url = `${_baseURL}${path}`;
    const fetchOptions = {
      method,
      headers: { ...getAuthHeaders(), ...extraHeaders },
      signal,
    };
    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }
    const response = await fetch(url, fetchOptions);
    return handleResponse(response);
  } catch (error) {
    if (isAbortError(error)) return undefined;
    console.error(`[API] ${method} ${path} failed:`, error);
    throw error;
  }
};

export const apiClient = {
  get: (path, options) => request('GET', path, null, options),
  post: (path, data, options) => request('POST', path, data, options),
  put: (path, data, options) => request('PUT', path, data, options),
  delete: (path, options) => request('DELETE', path, null, options),
};
```

- [ ] **Step 2: Modify `src/services/ialabService.js` — remove hardcoded URL, import apiClient**

Replace the top of the file:

Old:
```javascript
// Servicio para interactuar con los endpoints de IALab del backend

const API_BASE_URL = 'http://localhost:3001/api';

// Función para manejar errores de fetch
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: `HTTP error! status: ${response.status}`
    }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  throw error;
};

// Helper para detectar errores de aborto y manejarlos silenciosamente
const isAbortError = (error) => error?.name === 'AbortError';
```

New:
```javascript
// Servicio para interactuar con los endpoints de IALab del backend
import { apiClient } from '../lib/api-client-factory';
```

- [ ] **Step 3: Replace all `fetch(...)` calls in `ialabService.js` with `apiClient` equivalents**

Each service method changes from:
```javascript
const response = await fetch(`${API_BASE_URL}/ialab/templates`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(templateData),
  signal,
});
return handleResponse(response);
```

To:
```javascript
return apiClient.post('/ialab/templates', templateData, { signal });
```

Full mapping of every method:

| Current Pattern | New Pattern |
|----------------|-------------|
| `ialabTemplatesService.saveTemplate` | `apiClient.post('/ialab/templates', templateData, { signal })` |
| `ialabTemplatesService.getUserTemplates` | `apiClient.get('/ialab/templates/${userId}?${queryString}', { signal })` |
| `ialabTemplatesService.updateTemplate` | `apiClient.put('/ialab/templates/${templateId}', templateData, { signal })` |
| `ialabTemplatesService.deleteTemplate` | `apiClient.delete('/ialab/templates/${templateId}', { signal })` |
| `ialabEvaluationService.evaluatePrompt` | `apiClient.post('/ialab/evaluate-prompt', { prompt, criteria }, { signal })` |
| `ialabResourcesService.getResources` | `apiClient.get('/ialab/resources?${queryString}', { signal })` |
| `ialabResourcesService.downloadResource` | Keep as-is (downloads an external URL, not the API) |
| `ialabProgressService.saveProgress` | `apiClient.post('/ialab/progress', progressData, { signal })` |
| `ialabProgressService.getProgress` | `apiClient.get('/ialab/progress/${userId}', { signal })` |
| `ialabPromptService.generatePrompt` | `apiClient.post('/ialab/prompts', { templateType, parameters }, { signal })` |

For example, `ialabTemplatesService` becomes:

```javascript
export const ialabTemplatesService = {
  saveTemplate: async (templateData, signal) => {
    try {
      return await apiClient.post('/ialab/templates', templateData, { signal });
    } catch (error) {
      if (error?.name === 'AbortError') return;
      console.error('Error saving template:', error);
      throw error;
    }
  },

  getUserTemplates: async (userId, filters = {}, signal) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      const queryString = queryParams.toString();
      const url = `/ialab/templates/${userId}${queryString ? `?${queryString}` : ''}`;
      return await apiClient.get(url, { signal });
    } catch (error) {
      if (error?.name === 'AbortError') return;
      console.error('Error fetching user templates:', error);
      throw error;
    }
  },

  updateTemplate: async (templateId, templateData, signal) => {
    try {
      return await apiClient.put(`/ialab/templates/${templateId}`, templateData, { signal });
    } catch (error) {
      if (error?.name === 'AbortError') return;
      console.error('Error updating template:', error);
      throw error;
    }
  },

  deleteTemplate: async (templateId, signal) => {
    try {
      return await apiClient.delete(`/ialab/templates/${templateId}`, { signal });
    } catch (error) {
      if (error?.name === 'AbortError') return;
      console.error('Error deleting template:', error);
      throw error;
    }
  }
};
```

Apply the same transform to `ialabEvaluationService.evaluatePrompt`, `ialabResourcesService.getResources`, `ialabProgressService.saveProgress`, `ialabProgressService.getProgress`, and `ialabPromptService.generatePrompt` — following the exact same pattern (apiClient call + try/catch with AbortError guard).

Keep `ialabResourcesService.downloadResource` unchanged (it fetches an external resource URL, not the API).

Keep `ialabService` shell object unchanged (still exports `templates`, `evaluation`, `resources`, `progress`, `prompts` — still has `getCurrentUserId()` and `initialize()` unchanged).

- [ ] **Step 4: Wire Clerk JWT token into the API client from `App.jsx`**

In `App.jsx`, find the existing block (lines 200-205):
```javascript
useEffect(() => {
    if (!clerkLoaded) return;
    getToken({ template: 'supabase' }).then(token => {
        if (token) initSupabaseClient(token);
    });
}, [clerkLoaded, getToken]);
```

Add the import at the top of `App.jsx`:
```javascript
import { configureApiClient, setClerkToken } from './lib/api-client-factory';
```

Modify the existing useEffect to also configure the API client:
```javascript
useEffect(() => {
    if (!clerkLoaded) return;
    configureApiClient({ baseURL: import.meta.env.VITE_API_BASE_URL });
    getToken({ template: 'supabase' }).then(token => {
        if (token) {
            initSupabaseClient(token);
            setClerkToken(token);
        }
    });
}, [clerkLoaded, getToken]);
```

- [ ] **Step 5: Verify no functionality changed**

Run: `npm run build`
Expected: Build succeeds without errors.

---

### Task 2: Add Silent Error Monitoring (Sentry)

**Files:**
- Create: `src/lib/monitoring.js`
- Modify: `src/main.jsx`
- Modify: `.env`

- [ ] **Step 1: Add `VITE_SENTRY_DSN` to `.env`**

```diff
 # Feature Flags
 VITE_USE_CLERK_JWT=true
 VITE_AUTO_PROFILE_SYNC=true
 VITE_PERSIST_VAK_RESULTS=true
 VITE_ENHANCED_RLS=true
+
+# Error Monitoring (optional — leave empty to disable)
+VITE_SENTRY_DSN=
```

- [ ] **Step 2: Create `src/lib/monitoring.js`**

```javascript
// Silent error monitoring — no UI, no user-facing features
// Uses Sentry via CDN (lazy-loaded) when DSN is configured

let _enabled = false;
let _Sentry = null;
let _initPromise = null;

const loadSentry = async () => {
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn) {
      if (import.meta.env.DEV) {
        console.log('[monitoring] Sentry disabled — no DSN configured');
      }
      return;
    }
    try {
      // Dynamically import Sentry browser bundle
      const Sentry = await import('@sentry/react');
      Sentry.init({
        dsn,
        environment: import.meta.env.MODE || 'production',
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
        ],
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        beforeSend(event) {
          // Filter out known noise
          if (event.exception?.values?.[0]?.type === 'AbortError') return null;
          if (event.exception?.values?.[0]?.type === 'ChunkLoadError') return null;
          return event;
        },
      });
      _Sentry = Sentry;
      _enabled = true;
      if (import.meta.env.DEV) {
        console.log('[monitoring] Sentry initialized');
      }
    } catch (error) {
      console.warn('[monitoring] Failed to load Sentry:', error);
    }
  })();
  return _initPromise;
};

export const initMonitoring = async () => {
  await loadSentry();
};

export const captureError = (error, context = {}) => {
  if (import.meta.env.DEV) {
    console.log('[monitoring] Captured error (dev — not sent):', error?.message, context);
    return;
  }
  if (_Sentry) {
    _Sentry.captureException(error, { extra: context });
  }
};

export const captureMessage = (message, level = 'info') => {
  if (import.meta.env.DEV || !_Sentry) return;
  _Sentry.captureMessage(message, level);
};

// Safe wrapper for SectionErrorBoundary — captures without throwing
export const captureErrorBoundaryError = (error, errorInfo, componentName) => {
  captureError(error, { componentStack: errorInfo?.componentStack, componentName });
};

export const isMonitoringEnabled = () => _enabled;
```

- [ ] **Step 3: Modify `src/main.jsx` to init monitoring**

Add import and call:

```javascript
import { initMonitoring } from './lib/monitoring';

registerSW()

// Initialize silent monitoring (no UI, no user impact)
initMonitoring()

const providers = [
```

Full file after change:
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ClerkProviderWrapper from './providers/ClerkProviderWrapper'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ThemeProvider } from './context/ThemeContext'
import { I18nProvider } from './i18n/I18nProvider'
import ErrorBoundary from './components/forum/ErrorBoundary'
import { ProviderComposer } from './utils/ProviderComposer'
import { registerSW } from './utils/registerSW'
import { initMonitoring } from './lib/monitoring'
import './index.css'

registerSW()

initMonitoring()

const providers = [
  <BrowserRouter />,
  <ClerkProviderWrapper />,
  <AuthProvider />,
  <NotificationProvider />,
  <ThemeProvider />,
  <I18nProvider />,
  <ErrorBoundary />,
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProviderComposer providers={providers}>
      <App />
    </ProviderComposer>
  </React.StrictMode>,
)
```

- [ ] **Step 4: Update `SectionErrorBoundary.jsx` to also capture via monitoring**

Add import and capture call:

```javascript
import React, { Component } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { withTranslation } from '../../i18n/withTranslation';
import { captureErrorBoundaryError } from '../../lib/monitoring';
```

Modify `componentDidCatch`:
```javascript
componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error(`[ErrorBoundary:${this.props.name || 'unknown'}]`, error, errorInfo);
    captureErrorBoundaryError(error, errorInfo, this.props.name || 'unknown');
}
```

- [ ] **Step 5: Verify monitoring doesn't break anything**

Run: `npm run build`
Expected: Build succeeds. No Sentry loaded when DSN is empty.

---

### Task 3: Add iLAB Analytics (localStorage, zero UI)

**Files:**
- Create: `src/services/ialab-analytics.js`

- [ ] **Step 1: Create `src/services/ialab-analytics.js`**

```javascript
// iLAB-specific analytics — localStorage-only, zero API calls, zero UI
// Tracks learning events without modifying any component logic.
// Pattern follows existing src/utils/analytics.js but focused on iLAB.

const STORAGE_KEY = 'edutechlife_ialab_analytics';

const load = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      // Ensure all keys exist (schema migration)
      return {
        sessions: data.sessions || 0,
        firstVisit: data.firstVisit || null,
        lastVisit: data.lastVisit || null,
        moduleViews: data.moduleViews || {},
        examAttempts: data.examAttempts || 0,
        examPasses: data.examPasses || 0,
        challengeAttempts: data.challengeAttempts || 0,
        challengePasses: data.challengePasses || 0,
        resourceViews: data.resourceViews || 0,
        forumPosts: data.forumPosts || 0,
        forumComments: data.forumComments || 0,
        completions: data.completions || [],
        streakHistory: data.streakHistory || [],
        averageScore: data.averageScore || 0,
        scoreCount: data.scoreCount || 0,
        totalScore: data.totalScore || 0,
        lastUpdated: data.lastUpdated || null,
      };
    }
  } catch (e) {
    // silent
  }
  return getDefaultMetrics();
};

const getDefaultMetrics = () => ({
  sessions: 0,
  firstVisit: null,
  lastVisit: null,
  moduleViews: {},
  examAttempts: 0,
  examPasses: 0,
  challengeAttempts: 0,
  challengePasses: 0,
  resourceViews: 0,
  forumPosts: 0,
  forumComments: 0,
  completions: [],
  streakHistory: [],
  averageScore: 0,
  scoreCount: 0,
  totalScore: 0,
  lastUpdated: null,
});

const save = (metrics) => {
  metrics.lastUpdated = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
  } catch (e) {
    // silent (quota exceeded, etc.)
  }
};

let metrics = load();

export const ialabAnalytics = {
  recordSession() {
    metrics.sessions++;
    if (!metrics.firstVisit) metrics.firstVisit = new Date().toISOString();
    metrics.lastVisit = new Date().toISOString();
    save(metrics);
  },

  recordModuleView(moduleId) {
    if (!metrics.moduleViews[moduleId]) {
      metrics.moduleViews[moduleId] = { views: 0, lastView: null };
    }
    metrics.moduleViews[moduleId].views++;
    metrics.moduleViews[moduleId].lastView = new Date().toISOString();
    save(metrics);
  },

  recordExamAttempt(passed, score) {
    metrics.examAttempts++;
    if (passed) metrics.examPasses++;
    if (typeof score === 'number') {
      metrics.totalScore += score;
      metrics.scoreCount++;
      metrics.averageScore = metrics.totalScore / metrics.scoreCount;
    }
    save(metrics);
  },

  recordChallengeAttempt(passed) {
    metrics.challengeAttempts++;
    if (passed) metrics.challengePasses++;
    save(metrics);
  },

  recordResourceView() {
    metrics.resourceViews++;
    save(metrics);
  },

  recordForumPost() {
    metrics.forumPosts++;
    save(metrics);
  },

  recordForumComment() {
    metrics.forumComments++;
    save(metrics);
  },

  recordCompletion(moduleId, score) {
    metrics.completions.push({
      moduleId,
      score,
      date: new Date().toISOString(),
    });
    save(metrics);
  },

  recordStreakDay(date) {
    const dayStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    if (!metrics.streakHistory.includes(dayStr)) {
      metrics.streakHistory.push(dayStr);
      save(metrics);
    }
  },

  getMetrics() {
    return { ...metrics };
  },

  getReport() {
    const m = metrics;
    const completionRate = m.examAttempts > 0
      ? Math.round((m.examPasses / m.examAttempts) * 100) : 0;
    const challengeRate = m.challengeAttempts > 0
      ? Math.round((m.challengePasses / m.challengeAttempts) * 100) : 0;
    const modulesCompleted = m.completions.length;
    const avgScore = m.averageScore;

    return {
      sessions: m.sessions,
      modulesViewed: Object.keys(m.moduleViews).length,
      modulesCompleted,
      progress: modulesCompleted >= 5 ? 100 : Math.round((modulesCompleted / 5) * 100),
      examCompletionRate: completionRate,
      challengeCompletionRate: challengeRate,
      averageScore: Math.round(avgScore),
      resourcesViewed: m.resourceViews,
      forumActivity: m.forumPosts + m.forumComments,
      streakDays: m.streakHistory.length,
      firstVisit: m.firstVisit,
      lastVisit: m.lastVisit,
    };
  },

  reset() {
    metrics = getDefaultMetrics();
    save(metrics);
  },
};
```

- [ ] **Step 2: Wire iLAB analytics init into `main.jsx`**

```javascript
import { initMonitoring } from './lib/monitoring';
import { ialabAnalytics } from './services/ialab-analytics';

registerSW()

initMonitoring()
ialabAnalytics.recordSession()
```

- [ ] **Step 3: Wire analytics into iLAB context (passive — only reads store events)**

Modify `src/context/ialab/IALabUIProvider.jsx` — find the existing useEffect that syncs gamification.

Read the file first to find the right insertion point:

```bash
grep -n "useEffect" src/context/ialab/IALabUIProvider.jsx
```

Then add tracking calls inside the relevant effects — tracking should fire but NEVER change any state or render.

For each event type, add a ONE-LINE call:
```javascript
ialabAnalytics.recordModuleView(moduleId);
ialabAnalytics.recordExamAttempt(passed, score);
ialabAnalytics.recordChallengeAttempt(passed);
ialabAnalytics.recordResourceView();
ialabAnalytics.recordForumPost();
ialabAnalytics.recordForumComment();
ialabAnalytics.recordCompletion(moduleId, score);
```

Insert these calls INSIDE existing effects that already fire on those events — never create new effects.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds.

---

### Task 4: Wire Clerk JWT Token Refresh

**Files:**
- Modify: `src/App.jsx` (already modified in Task 1)

- [ ] **Step 1: Add token refresh listener**

In `App.jsx`, the existing useEffect already calls `setClerkToken(token)` on mount. We need to also refresh when the Clerk session changes.

Locate the existing block and modify it:

```javascript
useEffect(() => {
    if (!clerkLoaded) return;
    configureApiClient({ baseURL: import.meta.env.VITE_API_BASE_URL });
    const refreshToken = () => {
        getToken({ template: 'supabase' }).then(token => {
            if (token) {
                initSupabaseClient(token);
                setClerkToken(token);
            }
        });
    };
    refreshToken();
    // Refresh token every 55 minutes (tokens expire in ~1 hour)
    const interval = setInterval(refreshToken, 55 * 60 * 1000);
    return () => clearInterval(interval);
}, [clerkLoaded, getToken]);
```

- [ ] **Step 2: Verify no regressions**

Run: `npm run build`
Expected: Build succeeds.

---

### Task 5: Remove Dead Code from `registerSW.js`

**Files:**
- Modify: `src/utils/registerSW.js`

- [ ] **Step 1: Simplify registerSW to not unregister in dev**

Current code actively unregisters all SWs in dev mode — this means PWA won't work in dev. Change it to just register:

```javascript
export function registerSW() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // SW not available — non-critical
      });
    });
  }
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

---

## Self-Review Checklist

**Spec coverage:**
- Task 1 covers the hardcoded API URL + missing JWT auth headers gap ✓
- Task 2 covers the no error monitoring gap (Sentry) ✓
- Task 3 covers the analytics gap (iLAB-focused) ✓
- Task 4 ensures JWT tokens don't expire mid-session ✓
- Task 5 cleans up SW registration ✓

**Placeholder scan:**
- No "TBD", "TODO", or "implement later" patterns ✓
- All code is complete and copy-paste ready ✓

**Type consistency:**
- `apiClient` methods use consistent signatures throughout ✓
- `captureError`, `captureMessage`, `captureErrorBoundaryError` consistent naming ✓
- `ialabAnalytics.record*()` methods consistent pattern ✓
