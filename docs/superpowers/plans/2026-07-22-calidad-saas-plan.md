# Fase 4 — Calidad SaaS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevar calidad SaaS de 7.5→9.0/10 sin alterar funcionalidad existente. Todos los cambios son aditivos.

**Architecture:** Lo que ya existe (Sentry, lighthouserc, CI, chunkSizeWarningLimit) se deja intacto. Se agregan smoke tests de integración + mejoras menores de configuración.

**Tech Stack:** Vitest + @testing-library/react + jsdom

**Estado actual (pre-Fase 4):**
| Componente | Estado |
|---|---|
| `@sentry/react` instalado + `Sentry.init()` en main.jsx | ✅ |
| `chunkSizeWarningLimit: 250` en vite.config.js | ✅ |
| `lighthouserc.js` con thresholds (perf≥70, a11y≥80, SEO≥80) | ✅ |
| `.github/workflows/test.yml` con CI build+test | ✅ |
| `scripts/check-budget.mjs` | ✅ |
| `reportCompressedSize` en vite.config.js | ⚠️ `false` → `true` |
| Smoke tests de integración (header, landing, navegación) | ❌ |
| Sentry tracesSampleRate configurable vía env var | ❌ |

---

### Task 1: Smoke Tests — Header + Login Dropdown

**Files:**
- Create: `src/tests/integration/header.test.jsx`

- [ ] **Step 1: Create the header smoke test**

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { I18nProvider } from '../../i18n/I18nProvider'
import HeaderFluidIsland from '../../components/layout/HeaderFluidIsland'

vi.mock('../../i18n/I18nProvider', () => ({
  I18nProvider: ({ children }) => <>{children}</>,
  useTranslation: () => ({ t: (key) => key }),
}))

vi.mock('@clerk/react', () => ({
  useAuth: () => ({ isSignedIn: false }),
  useUser: () => ({ user: null }),
}))

describe('HeaderFluidIsland — login dropdown', () => {
  it('renders login button with 2 options', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nProvider>
          <HeaderFluidIsland />
        </I18nProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('nav.login')).toBeTruthy()

    fireEvent.click(screen.getByText('nav.login'))

    expect(screen.getByText('iLab Academic')).toBeTruthy()
    expect(screen.getByText('SmartBoard')).toBeTruthy()
  })

  it('hides dropdown on route pathname change', () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/']}>
        <I18nProvider>
          <HeaderFluidIsland />
        </I18nProvider>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('nav.login'))
    expect(screen.getByText('iLab Academic')).toBeTruthy()

    rerender(
      <MemoryRouter initialEntries={['/some-other-route']}>
        <I18nProvider>
          <HeaderFluidIsland />
        </I18nProvider>
      </MemoryRouter>
    )

    expect(screen.queryByText('iLab Academic')).toBeNull()
  })

  it('returns null on ialab route', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/ialab']}>
        <I18nProvider>
          <HeaderFluidIsland />
        </I18nProvider>
      </MemoryRouter>
    )

    expect(container.innerHTML).toBe('')
  })

  it('returns null on smartboard route', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/smartboard']}>
        <I18nProvider>
          <HeaderFluidIsland />
        </I18nProvider>
      </MemoryRouter>
    )

    expect(container.innerHTML).toBe('')
  })
})
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx vitest run src/tests/integration/header.test.jsx`
Expected: 4 tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/tests/integration/header.test.jsx
git commit -m "test: add header smoke tests with login dropdown validation"
```

---

### Task 2: Smoke Tests — ContactModal

**Files:**
- Create: `src/tests/integration/contact-modal.test.jsx`

- [ ] **Step 1: Create the ContactModal smoke test**

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ContactModal from '../../components/ContactModal'

vi.mock('../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (key) => key }),
}))

describe('ContactModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <ContactModal isOpen={false} onClose={() => {}} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders modal content when open', () => {
    render(<ContactModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('nav.contact')).toBeTruthy()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<ContactModal isOpen={true} onClose={onClose} />)
    const closeButtons = screen.getAllByRole('button')
    fireEvent.click(closeButtons[0])
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx vitest run src/tests/integration/contact-modal.test.jsx`
Expected: 3 tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/tests/integration/contact-modal.test.jsx
git commit -m "test: add ContactModal smoke tests"
```

---

### Task 3: Improve Sentry Config (env-driven)

**Files:**
- Modify: `src/main.jsx:17-24`

- [ ] **Step 1: Update Sentry.init to use env vars for sample rates**

```jsx
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_RATE) || 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    environment: import.meta.env.MODE,
  })
}
```

- [ ] **Step 2: Run tests to ensure nothing broke**

Run: `npx vitest run`
Expected: All existing tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/main.jsx
git commit -m "feat: make Sentry sample rates configurable via env vars"
```

---

### Task 4: Enable reportCompressedSize

**Files:**
- Modify: `vite.config.js:194-198`

- [ ] **Step 1: Change reportCompressedSize from false to true**

```diff
    chunkSizeWarningLimit: 250,
    sourcemap: false,
-    reportCompressedSize: false,
+    reportCompressedSize: true,
```

- [ ] **Step 2: Verify build still works**

Run: `npm run build:fast`
Expected: Build succeeds, shows compressed sizes in output

- [ ] **Step 3: Commit**

```bash
git add vite.config.js
git commit -m "chore: enable reportCompressedSize in build config"
```

---

### Task 5: Update test:smoke to include integration tests

**Files:**
- Modify: `package.json:24`

- [ ] **Step 1: Add integration path to test:smoke script**

```diff
-    "test:smoke": "vitest run src/store/__tests__/ src/components/IALab/__tests__/ src/components/IALab/IALabValerioPanel/__tests__/ src/components/IALab/IALabQuizModal/__tests__/ src/components/DiagnosticoVAK/__tests__/ src/components/Nico/__tests__/ src/components/kids-dashboard/dani/__tests__/ src/components/__tests__/ src/services/__tests__/ src/utils/__tests__/ src/tests/a11y/ src/components/IALab/PDFThumbnail.test.jsx",
+    "test:smoke": "vitest run src/store/__tests__/ src/components/IALab/__tests__/ src/components/IALab/IALabValerioPanel/__tests__/ src/components/IALab/IALabQuizModal/__tests__/ src/components/DiagnosticoVAK/__tests__/ src/components/Nico/__tests__/ src/components/kids-dashboard/dani/__tests__/ src/components/__tests__/ src/services/__tests__/ src/utils/__tests__/ src/tests/a11y/ src/tests/integration/ src/components/IALab/PDFThumbnail.test.jsx",
```

- [ ] **Step 2: Run smoke tests to verify**

Run: `npm run test:smoke`
Expected: All tests PASS, including new integration tests

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add integration tests to smoke suite"
```

---

## Spec Coverage

| Spec Requirement | Task |
|---|---|
| A. Sentry init + env DSN | ✅ Preexistente + Task 3 (env-driven rates) |
| A. Sentry replays disabled | Task 3 |
| B. chunkSizeWarningLimit 250 | ✅ Preexistente |
| B. reportCompressedSize true | Task 4 |
| B. lighthouserc.js | ✅ Preexistente |
| C. Smoke tests (header, dropdown) | Task 1 |
| C. Smoke tests (ContactModal) | Task 2 |
| C. Sin modificar tests existentes | ✅ Tasks 1-2 crean archivos nuevos |
| D. Exclusiones respetadas | ✅ Tasks 3-4 modifican solo config/env, no lógica de negocio |

## Execution Handoff

Two options after user approval:
- **Subagent-Driven**: Agente fresco por task + revisión entre tasks
- **Inline**: Ejecución directa con checkpoints
