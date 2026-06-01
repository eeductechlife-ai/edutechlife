# iLAB Premium Improvement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform iLAB from a 7.9/10 professional platform into a 9.5+/10 world-class premium SaaS learning platform

**Architecture:** 10 dimensions evaluated → concrete tasks per dimension, ordered by impact. Each dimension includes current score, target score, implementation phases, and specific file-level changes.

**Tech Stack:** React 18, Vite, Tailwind CSS, Framer Motion, Zustand, Clerk, Supabase, Radix UI, canvas-confetti, pdfjs-dist

---

## Priority Matrix

| Priority | Dimensión | Actual → Meta | Esfuerzo | Impacto |
|----------|-----------|:------------:|:--------:|:-------:|
| 🔴 P0 | Testing | 4.0 → 8.5 | Alta | Crítico |
| 🔴 P0 | Accesibilidad | 6.4 → 9.5 | Media | Crítico |
| 🔴 P0 | Calidad Código | 6.5 → 9.0 | Alta | Crítico |
| 🟡 P1 | Arquitectura SaaS | 7.0 → 9.0 | Alta | Alto |
| 🟡 P1 | Rendimiento | 7.0 → 9.0 | Media | Alto |
| 🟢 P2 | Experiencia Estudiante | 8.0 → 9.5 | Alta | Alto |
| 🟢 P2 | Mobile UX | 7.0 → 9.0 | Media | Alto |
| 🔵 P3 | Diseño Visual | 8.5 → 9.5 | Baja | Medio |
| 🔵 P3 | Gamificación | 9.0 → 9.8 | Baja | Medio |
| ⚪ P4 | Animación & Movimiento | 9.5 → 9.9 | Baja | Bajo |

**Total: 10 dimensiones, ~120 tareas**

---

## Dimensión 1: Testing — 4.0 → 8.5

### Problemas detectados
- Solo 22 tests para ~187 archivos fuente (~12% coverage)
- Tests mínimos ("renders without crashing")
- Sin tests de integración ni E2E
- Storybook configurado pero sin stories
- Sin cobertura en hooks, store, modales críticos

### Fase 1: Infraestructura de Testing (Sprint 1)

- [ ] **1.1: Configurar Vitest con cobertura**

```bash
npm install -D @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom msw
```

**Archivo:** `vitest.config.ts` (crear)

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        statements: 50,
        branches: 40,
        functions: 50,
        lines: 50,
      },
      exclude: [
        'src/**/*.stories.*',
        'src/**/*.demo.*',
        'src/**/*.docs.*',
        'src/components/IALab/challenges/**',
        'src/components/IALab/OVA*/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **1.2: Crear setup de testing**

**Archivo:** `src/test-setup.ts` (crear)

```ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
    aside: 'aside',
    main: 'main',
    header: 'header',
    nav: 'nav',
    section: 'section',
    article: 'article',
    p: 'p',
    ul: 'ul',
    li: 'li',
  },
  AnimatePresence: ({ children }) => children,
  useReducedMotion: () => false,
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

- [ ] **1.3: Agregar script de coverage a package.json**

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:ui": "vitest --ui"
}
```

### Fase 2: Tests Unitarios — Core (Sprint 1-2)

- [ ] **2.1: Test del Zustand store (todas las slices)**

**Archivo:** `src/components/IALab/__tests__/useIALabStore.test.jsx`

```jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { useIALabStore } from '../hooks/IALab/useIALabStore';

describe('IALabStore - Persistence Slice', () => {
  beforeEach(() => {
    useIALabStore.setState({ lessonProgress: {} });
  });

  it('should track lesson progress', () => {
    const store = useIALabStore.getState();
    store.setLessonProgress('mod-1', 'lesson-1', 'completed');
    const state = useIALabStore.getState();
    expect(state.lessonProgress['mod-1']?.['lesson-1']).toBe('completed');
  });

  it('should calculate module completion percentage', () => {
    const store = useIALabStore.getState();
    store.setLessonProgress('mod-1', 'lesson-1', 'completed');
    store.setLessonProgress('mod-1', 'lesson-2', 'completed');
    store.setLessonProgress('mod-1', 'lesson-3', 'pending');
    const mod1Lessons = 3;
    const completed = Object.values(
      useIALabStore.getState().lessonProgress['mod-1'] || {}
    ).filter(v => v === 'completed').length;
    expect(completed / mod1Lessons).toBeCloseTo(0.666, 1);
  });
});

describe('IALabStore - Gamification Slice', () => {
  it('should add XP and track level', () => {
    useIALabStore.setState({ xp: 0, level: 1 });
    const store = useIALabStore.getState();
    store.addXP(50);
    expect(useIALabStore.getState().xp).toBe(50);
  });

  it('should level up at threshold', () => {
    useIALabStore.setState({ xp: 0, level: 1 });
    const store = useIALabStore.getState();
    store.addXP(200); // level up at 100
    const state = useIALabStore.getState();
    expect(state.level).toBeGreaterThanOrEqual(2);
  });

  it('should track streak days', () => {
    const store = useIALabStore.getState();
    store.updateStreak();
    expect(useIALabStore.getState().streak).toBeGreaterThanOrEqual(0);
  });
});

describe('IALabStore - Active Module', () => {
  it('should set active module', () => {
    const store = useIALabStore.getState();
    store.setActiveMod(3);
    expect(useIALabStore.getState().activeMod).toBe(3);
  });
});
```

- [ ] **2.2: Test del A11yProvider**

**Archivo:** `src/components/IALab/__tests__/A11yProvider.test.jsx`

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { A11yProvider, useA11y } from '../A11yProvider';

function TestComponent() {
  const { announce } = useA11y();
  return (
    <button onClick={() => announce('Test announcement')}>
      Announce
    </button>
  );
}

describe('A11yProvider', () => {
  it('should render skip link', () => {
    render(<A11yProvider><div>content</div></A11yProvider>);
    expect(screen.getByText(/saltar/i)).toBeInTheDocument();
  });

  it('should provide announce function', async () => {
    const user = userEvent.setup();
    render(
      <A11yProvider>
        <TestComponent />
      </A11yProvider>
    );
    await user.click(screen.getByText('Announce'));
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
  });

  it('should move focus to main content', async () => {
    render(
      <A11yProvider>
        <main id="main-content" tabIndex={-1}>Content</main>
      </A11yProvider>
    );
    const skipLink = screen.getByText(/saltar/i);
    await userEvent.click(skipLink);
    expect(document.activeElement).toBe(screen.getByText('Content'));
  });
});
```

- [ ] **2.3: Test del GlobalSearchBar**

**Archivo:** `src/components/IALab/__tests__/GlobalSearchBar.test.jsx`

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlobalSearchBar } from '../GlobalSearchBar';

describe('GlobalSearchBar', () => {
  it('should toggle with Cmd+K shortcut', async () => {
    const user = userEvent.setup();
    render(<GlobalSearchBar />);
    await user.keyboard('{Meta>}k{/Meta}');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should show search results', async () => {
    const user = userEvent.setup();
    render(<GlobalSearchBar />);
    await user.keyboard('{Meta>}k{/Meta}');
    const input = screen.getByRole('combobox');
    await user.type(input, 'prompt');
    // Wait for debounced search
    await new Promise(r => setTimeout(r, 300));
    // Results should appear
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('should close on Escape', async () => {
    const user = userEvent.setup();
    render(<GlobalSearchBar />);
    await user.keyboard('{Meta>}k{/Meta}');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
```

### Fase 3: Tests de Integración (Sprint 2-3)

- [ ] **3.1: Test del quiz flow completo**

**Archivo:** `src/components/IALab/__tests__/IALabQuizModal.test.jsx`

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IALabQuizModal } from '../IALabQuizModal';

// Mock dependencies
vi.mock('../hooks/IALab/useIALabStore', () => ({
  useIALabStore: (selector) => selector?.({
    activeMod: 2,
    quizAnswers: {},
    setQuizAnswer: vi.fn(),
    isPracticeMode: false,
  }) ?? {},
}));

vi.mock('react-router-dom', () => ({
  useParams: () => ({ moduleId: '2' }),
}));

describe('IALabQuizModal - Integration', () => {
  it('should render quiz questions', async () => {
    render(<IALabQuizModal isOpen={true} onClose={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText(/pregunta/i)).toBeInTheDocument();
    });
  });

  it('should navigate between questions', async () => {
    const user = userEvent.setup();
    render(<IALabQuizModal isOpen={true} onClose={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText(/pregunta/i)).toBeInTheDocument();
    });
    const nextBtn = screen.getByRole('button', { name: /siguiente/i });
    await user.click(nextBtn);
    expect(screen.getByText(/pregunta 2/i)).toBeInTheDocument();
  });

  it('should show timer', () => {
    render(<IALabQuizModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('should show confirmation dialog on submit', async () => {
    const user = userEvent.setup();
    render(<IALabQuizModal isOpen={true} onClose={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText(/entregar/i)).toBeInTheDocument();
    });
    await user.click(screen.getByText(/entregar/i));
    expect(screen.getByText(/confirmar/i)).toBeInTheDocument();
  });
});
```

- [ ] **3.2: Test del flow de módulos (sidebar + contenido)**

**Archivo:** `src/components/IALab/__tests__/ModuleFlow.test.jsx`

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { IALab } from '../IALab';

// Mock complex dependencies
vi.mock('../IALabModals', () => ({
  default: () => null,
}));

describe('Module Navigation Flow', () => {
  it('should render module 1 by default', () => {
    render(
      <MemoryRouter initialEntries={['/ialab/1']}>
        <IALab />
      </MemoryRouter>
    );
    expect(screen.getByText(/módulo 1/i)).toBeInTheDocument();
  });

  it('should navigate to module 2 via sidebar', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/ialab/1']}>
        <IALab />
      </MemoryRouter>
    );
    await user.click(screen.getByText(/módulo 2/i));
    expect(screen.getByText(/módulo 2/i)).toBeInTheDocument();
  });
});
```

### Fase 4: Test E2E (Sprint 3-4)

- [ ] **4.1: Configurar Playwright**

```bash
npm install -D @playwright/test
npx playwright install
```

**Archivo:** `playwright.config.ts`

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
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 375, height: 812 } } },
  ],
});
```

- [ ] **4.2: E2E test — student complete module flow**

**Archivo:** `e2e/module-completion.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test.describe('Module Completion Flow', () => {
  test('student can navigate and complete a module quiz', async ({ page }) => {
    await page.goto('/ialab/1');
    await expect(page.locator('text=Módulo 1')).toBeVisible();
    
    // Open quiz
    await page.click('text=Examen');
    await expect(page.locator('role=timer')).toBeVisible();
    
    // Answer all questions
    const questions = page.locator('[role=radiogroup]');
    const count = await questions.count();
    for (let i = 0; i < count; i++) {
      await questions.nth(i).locator('input[type=radio]').first().check();
      if (i < count - 1) {
        await page.click('text=Siguiente');
      }
    }
    
    // Submit
    await page.click('text=Entregar');
    await page.click('text=Confirmar');
    
    // See results
    await expect(page.locator('text=Resultados')).toBeVisible();
  });
});
```

- [ ] **4.3: Agregar CI workflow**

**Archivo:** `.github/workflows/test.yml`

```yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test:coverage
      - run: npx playwright install
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage
          path: coverage/
```

---

## Dimensión 2: Accesibilidad — 6.4 → 9.5

### Problemas detectados
- Quiz/Evaluation bloquean Ctrl+C, Ctrl+V, F12, Ctrl+Shift+I (rompe SRs)
- Sin `role="dialog"` + `aria-modal` en modales críticos
- TooltipIcon pasa JSX a `aria-label` (ignorado)
- Tab pills sin `role="tablist"`/`aria-selected`
- AchievementToast sin botón de cerrar
- Sin skip links dentro de modales
- Sin `aria-live` en resultados de búsqueda

### Fase 1: Crítico — Remover Keyboard Shortcut Blocking (Sprint 1)

- [ ] **2.1: Refactor quiz keyboard blocking**

**Archivo:** `src/components/IALab/IALabQuizModal.jsx`

Buscar el bloqueo actual (aprox líneas 100-120):

```jsx
// ANTES — BLOQUEA TODOS LOS SHORTCUTS INCLUYENDO LOS DE SR
useEffect(() => {
  const handleKeyDown = (e) => {
    if (
      e.ctrlKey || e.metaKey
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

Reemplazar con bloqueo selectivo que **NO** afecte shortcuts de accesibilidad:

```jsx
// DESPUÉS — SOLO BLOQUEA COPY/PASTE SELECTIVO, PERMITE SR SHORTCUTS
useEffect(() => {
  const handleKeyDown = (e) => {
    // NUNCA bloquear Ctrl si es combinación con Shift (SR shortcuts)
    if (e.shiftKey && (e.ctrlKey || e.metaKey)) return;

    const blockedCombos = ['c', 'v', 'x'];
    const key = e.key?.toLowerCase();

    // Solo bloquear copy/paste/cut, NO F12, NO Ctrl+U, NO Ctrl+S
    if ((e.ctrlKey || e.metaKey) && blockedCombos.includes(key)) {
      e.preventDefault();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

- [ ] **2.2: Refactor evaluation keyboard blocking (mismo patrón)**

**Archivo:** `src/components/IALab/IALabEvaluationModal.jsx`

Misma transformación. Buscar `e.ctrlKey || e.metaKey` y reemplazar con bloqueo selectivo igual que en 2.1.

### Fase 2: Alto — ARIA en Modales (Sprint 1)

- [ ] **2.3: Agregar role="dialog" + aria-modal al QuizModal**

**Archivo:** `src/components/IALab/IALabQuizModal.jsx`

Buscar el contenedor principal del modal y agregar:

```jsx
// Encontrar el div/elemento raíz del modal
<div
  role="dialog"
  aria-modal="true"
  aria-label={`Examen del módulo ${activeMod}`}
  aria-describedby="quiz-instructions"
>
  {/* contenido existente */}
</div>

// Agregar elemento de instrucciones oculto
<p id="quiz-instructions" className="sr-only">
  Responda todas las preguntas del examen. Use las flechas para navegar entre preguntas.
  Presione Escape para salir del examen.
</p>
```

- [ ] **2.4: Agregar role="dialog" + aria-modal al EvaluationModal**

**Archivo:** `src/components/IALab/IALabEvaluationModal.jsx`

Mismo patrón que 2.3 adaptado al contexto de evaluación.

### Fase 3: Alto — ARIA en Componentes (Sprint 1-2)

- [ ] **2.5: Fix TooltipIcon en IALabSidebar**

**Archivo:** `src/components/IALab/IALabSidebar.jsx`

Buscar:
```jsx
<TooltipIcon 
  aria-label={/* JSX expression */}
>
```

Reemplazar con:
```jsx
<TooltipIcon
  aria-describedby={`tooltip-${uniqueId}`}
>
  <span id={`tooltip-${uniqueId}`} className="sr-only">
    {textContent}
  </span>
```

- [ ] **2.6: Agregar role="tablist" a tab pills**

**Archivo:** `src/components/IALab/IALab.jsx`

Buscar el contenedor de tabs:
```jsx
// ANTES
<div className="flex gap-2">
  <button onClick={() => setActiveTab('all')}>Todos</button>
  <button onClick={() => setActiveTab('objectives')}>Objetivos</button>
</div>

// DESPUÉS
<div role="tablist" aria-label="Secciones del módulo">
  <button
    role="tab"
    aria-selected={activeTab === 'all'}
    aria-controls="panel-all"
    id="tab-all"
    onClick={() => setActiveTab('all')}
  >
    Todos
  </button>
  <button
    role="tab"
    aria-selected={activeTab === 'objectives'}
    aria-controls="panel-objectives"
    id="tab-objectives"
    onClick={() => setActiveTab('objectives')}
  >
    Objetivos
  </button>
</div>

{/* Agregar tab panels */}
<section
  role="tabpanel"
  id="panel-all"
  aria-labelledby="tab-all"
  hidden={activeTab !== 'all'}
>
  {/* contenido */}
</section>
```

- [ ] **2.7: Agregar <nav> a breadcrumbs**

**Archivo:** Buscar el componente Breadcrumbs (probablemente `Breadcrumbs.jsx`)

```jsx
// ANTES
<div className="flex items-center gap-2 text-sm">
  <Link to="/ialab">Inicio</Link>
  <span>/</span>
  <span>Módulo {modId}</span>
</div>

// DESPUÉS
<nav aria-label="Breadcrumb">
  <ol className="flex items-center gap-2 text-sm">
    <li><Link to="/ialab">Inicio</Link></li>
    <li aria-hidden="true">/</li>
    <li aria-current="page">Módulo {modId}</li>
  </ol>
</nav>
```

- [ ] **2.8: Fix AchievementToast — agregar close button**

**Archivo:** `src/components/IALab/AchievementToast.jsx`

```jsx
// ANTES
<div role="status" aria-live="polite" className="...">
  <Icon name="fa-trophy" />
  <span>¡Logro desbloqueado!</span>
</div>

// DESPUÉS
<div role="alert" aria-live="polite" className="...">
  <Icon name="fa-trophy" aria-hidden="true" />
  <span>¡Logro desbloqueado!</span>
  <button
    onClick={onDismiss}
    aria-label="Cerrar notificación"
    className="..."
  >
    <Icon name="fa-times" aria-hidden="true" />
  </button>
</div>
```

- [ ] **2.9: Agregar aria-live a resultados de búsqueda**

**Archivo:** `src/components/IALab/GlobalSearchBar.jsx`

```jsx
// Agregar cerca del contenedor de resultados
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {results.length > 0
    ? `${results.length} resultados encontrados`
    : 'Sin resultados'}
</div>
```

### Fase 4: Medio — Focus Management (Sprint 2)

- [ ] **2.10: Agregar skip link dentro de modales**

**Archivo:** Dentro de `IALabQuizModal.jsx` y `IALabEvaluationModal.jsx`

```jsx
// Al inicio del contenido del modal
<a
  href="#quiz-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-2 focus:rounded"
>
  Saltar al contenido del examen
</a>
<div id="quiz-content">
  {/* contenido */}
</div>
```

- [ ] **2.11: Focus return al cerrar modales**

En todos los modales, guardar el elemento que disparó el modal y devolverle el focus al cerrar:

```jsx
const triggerRef = useRef(null);

const handleOpen = (e) => {
  triggerRef.current = e.currentTarget;
  setIsOpen(true);
};

const handleClose = () => {
  setIsOpen(false);
  // Devolver focus al trigger después de que el modal se cierre
  requestAnimationFrame(() => {
    triggerRef.current?.focus();
  });
};
```

- [ ] **2.12: Agregar aria-live a listas estáticas en sidebar**

**Archivo:** `src/components/IALab/IALabSidebar.jsx`

Remover `aria-live="polite"` de contenedores de lista estáticos. Las listas de módulos no cambian dinámicamente, por lo que `aria-live` causa anuncios innecesarios.

```jsx
// ANTES
<div role="list" aria-live="polite">

// DESPUÉS (solo si los items cambian dinámicamente)
<div role="list" aria-relevant="additions removals">
// Si es estático, quitar aria-live
<div role="list">
```

### Fase 5: Bajo — Contraste y Reduced Motion (Sprint 2)

- [ ] **2.13: Verificar y ajustar contrastes de color**

Ejecutar auditoría de contraste:

```bash
npx axe-core src/components/IALab/*.jsx --exit
```

Puntos a verificar manualmente:
- `#00BCD4` (corporate cyan) sobre blanco: ~1.6:1 — **Falla WCAG AA**. Cambiar a `#0097A7` para texto sobre blanco
- Focus rings `petroleum/40`: verificar que cumplan 3:1 mínimo
- Petroleum `#004B63` sobre blanco: ~6.5:1 — ✅ Pasa

```css
/* En design-system/tokens.css */
--ialab-cyan: #0097A7; /* Cambiado de #00BCD4 para contraste AA */
--ialab-cyan-dark: #007C8A;
--ialab-focus-ring: 0 0 0 3px rgba(0, 151, 167, 0.4); /* Cyan oscuro con 40% opacidad */
```

- [ ] **2.14: Agregar prefers-reduced-motion a animaciones faltantes**

Buscar animaciones en `ModuleOverviewCard.jsx` y `ToolTutorAccordion.jsx` que no respeten la preferencia:

```jsx
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();

// En variantes de animación
const variants = {
  hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 },
  visible: { opacity: 1, y: 0 },
};
```

---

## Dimensión 3: Calidad Código — 6.5 → 9.0

### Problemas detectados
- 0 TypeScript en IALab (solo 1 archivo `.ts`)
- God components: `ResourceViewerModal` (1029 líneas), `IALabQuizModal` (823), `IALabEvaluationModal` (771)
- Side-effect en render (`IALab.jsx:180`)
- Sidebar renderiza DOM duplicado (collapsed + expanded)
- 12 componentes OVA con `<style>` tags inline
- Acceso inconsistente al store (context vs directo)

### Fase 1: TypeScript Migration (Sprint 3-5)

- [ ] **3.1: Configurar TypeScript**

```bash
npm install -D typescript @types/react @types/react-dom @types/node
```

**Archivo:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **3.2: Migrar useIALabStore a TypeScript**

**Archivo:** `src/components/IALab/hooks/IALab/useIALabStore.ts`

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// === Types ===
export type ModuleId = 1 | 2 | 3 | 4 | 5;
export type LessonStatus = 'pending' | 'in_progress' | 'completed';
export type LessonProgress = Record<string, Record<string, LessonStatus>>;

export interface QuizAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
}

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string | null;
  badges: string[];
}

export interface ModalsState {
  isQuizOpen: boolean;
  isEvaluationOpen: boolean;
  isValerioOpen: boolean;
  isResourceViewerOpen: boolean;
}

export interface IALabStore {
  // Active module
  activeMod: ModuleId;
  setActiveMod: (mod: ModuleId) => void;

  // Lesson progress
  lessonProgress: LessonProgress;
  setLessonProgress: (modId: string, lessonId: string, status: LessonStatus) => void;
  
  // Quiz
  quizAnswers: Record<string, QuizAnswer>;
  setQuizAnswer: (questionId: string, answer: QuizAnswer) => void;
  isPracticeMode: boolean;
  togglePracticeMode: () => void;

  // Gamification
  gamification: GamificationState;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  addBadge: (badgeId: string) => void;

  // Modals
  modals: ModalsState;
  openModal: (modal: keyof ModalsState) => void;
  closeModal: (modal: keyof ModalsState) => void;

  // Computed
  getModuleProgress: (modId: ModuleId) => number;
  getLevelProgress: () => number;
}

// === XP Thresholds ===
const XP_PER_LEVEL = 100;

// === Store ===
export const useIALabStore = create<IALabStore>()(
  persist(
    (set, get) => ({
      // Active module
      activeMod: 1,
      setActiveMod: (mod) => set({ activeMod: mod }),

      // Lesson progress
      lessonProgress: {},
      setLessonProgress: (modId, lessonId, status) =>
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [modId]: {
              ...state.lessonProgress[modId],
              [lessonId]: status,
            },
          },
        })),

      // Quiz
      quizAnswers: {},
      setQuizAnswer: (questionId, answer) =>
        set((state) => ({
          quizAnswers: { ...state.quizAnswers, [questionId]: answer },
        })),
      isPracticeMode: false,
      togglePracticeMode: () =>
        set((state) => ({ isPracticeMode: !state.isPracticeMode })),

      // Gamification
      gamification: { xp: 0, level: 1, streak: 0, lastActivityDate: null, badges: [] },
      addXP: (amount) =>
        set((state) => {
          const newXP = state.gamification.xp + amount;
          const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
          return {
            gamification: {
              ...state.gamification,
              xp: newXP,
              level: newLevel,
            },
          };
        }),
      updateStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const lastDate = state.gamification.lastActivityDate;
          const isConsecutive = lastDate === getYesterday(today);
          const newStreak = isConsecutive ? state.gamification.streak + 1 : lastDate === today ? state.gamification.streak : 1;
          return {
            gamification: {
              ...state.gamification,
              streak: newStreak,
              lastActivityDate: today,
            },
          };
        }),
      addBadge: (badgeId) =>
        set((state) => ({
          gamification: {
            ...state.gamification,
            badges: [...new Set([...state.gamification.badges, badgeId])],
          },
        })),

      // Modals
      modals: { isQuizOpen: false, isEvaluationOpen: false, isValerioOpen: false, isResourceViewerOpen: false },
      openModal: (modal) => set((state) => ({ modals: { ...state.modals, [modal]: true } })),
      closeModal: (modal) => set((state) => ({ modals: { ...state.modals, [modal]: false } })),

      // Computed
      getModuleProgress: (modId) => {
        const lessons = Object.values(get().lessonProgress[String(modId)] || {});
        if (lessons.length === 0) return 0;
        return lessons.filter((l) => l === 'completed').length / lessons.length;
      },
      getLevelProgress: () => {
        const { xp } = get().gamification;
        return (xp % XP_PER_LEVEL) / XP_PER_LEVEL;
      },
    }),
    {
      name: 'ialab-store',
      partialize: (state) => ({
        lessonProgress: state.lessonProgress,
        quizAnswers: state.quizAnswers,
        gamification: state.gamification,
      }),
    }
  )
);

function getYesterday(today: string): string {
  const date = new Date(today);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}
```

- [ ] **3.3: Crear barrel exports + tipos globales**

**Archivo:** `src/components/IALab/types/index.ts`

```ts
export type { ModuleId, LessonStatus, LessonProgress, QuizAnswer, GamificationState, IALabStore } from '../hooks/IALab/useIALabStore';

export interface Module {
  id: ModuleId;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'challenge';
  duration: number;
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'ova' | 'document';
  url: string;
  duration: string;
}
```

### Fase 2: Refactor God Components (Sprint 3-4)

- [ ] **3.4: Dividir ResourceViewerModal (1029 → <200 líneas)**

Estrategia: Extraer 4 subcomponentes:

| Archivo | Responsabilidad |
|---------|----------------|
| `ResourceViewerModal/ResourceViewerShell.jsx` | Layout, navigation, close (shell) |
| `ResourceViewerModal/PDFViewer.jsx` | PDF rendering with pdfjs-dist |
| `ResourceViewerModal/VideoViewer.jsx` | Video player with transcript |
| `ResourceViewerModal/OVAViewer.jsx` | OVA component selector + lazy loader |
| `ResourceViewerModal/index.jsx` | Orchestrator (~40 líneas) |

```jsx
// ResourceViewerModal/index.jsx — DESPUÉS (~40 líneas)
import { lazy, Suspense } from 'react';
import { ResourceViewerShell } from './ResourceViewerShell';
import { LoadingSpinner } from '../../shared/LoadingSpinner';

const PDFViewer = lazy(() => import('./PDFViewer'));
const VideoViewer = lazy(() => import('./VideoViewer'));
const OVAViewer = lazy(() => import('./OVAViewer'));

export default function ResourceViewerModal({ resource, onClose }) {
  const viewers = {
    pdf: PDFViewer,
    video: VideoViewer,
    ova: OVAViewer,
  };

  const Viewer = viewers[resource.type] || PDFViewer;

  return (
    <ResourceViewerShell resource={resource} onClose={onClose}>
      <Suspense fallback={<LoadingSpinner />}>
        <Viewer resource={resource} />
      </Suspense>
    </ResourceViewerShell>
  );
}
```

- [ ] **3.5: Dividir IALabQuizModal (823 → <300 líneas)**

Estrategia: Extraer 3 hooks + 3 componentes:

| Archivo | Responsabilidad |
|---------|----------------|
| `IALabQuizModal/hooks/useQuizEngine.js` | Timer, answers, navigation, scoring |
| `IALabQuizModal/hooks/useQuizSecurity.js` | Keyboard blocking, focus trap, visibility detection |
| `IALabQuizModal/components/QuestionRenderer.jsx` | Render question by type |
| `IALabQuizModal/components/QuizTimer.jsx` | Timer display + auto-submit |
| `IALabQuizModal/components/QuizResults.jsx` | Score, review answers |
| `IALabQuizModal/index.jsx` | Orchestrator (~80 líneas) |

- [ ] **3.6: Dividir IALabEvaluationModal (771 → <300 líneas)**

Misma estrategia que 3.5:

| Archivo | Responsabilidad |
|---------|----------------|
| `IALabEvaluationModal/hooks/useEvaluationEngine.js` | Steps, scoring, auto-save |
| `IALabEvaluationModal/hooks/useEvaluationSecurity.js` | Keyboard, watermark, focus trap |
| `IALabEvaluationModal/components/StepRenderer.jsx` | Render step by module |
| `IALabEvaluationModal/components/EvaluationResults.jsx` | Score + feedback |
| `IALabEvaluationModal/index.jsx` | Orchestrator (~60 líneas) |

### Fase 3: Code Quality Fixes (Sprint 2-3)

- [ ] **3.7: Fix side-effect en render (IALab.jsx)**

**Archivo:** `src/components/IALab/IALab.jsx`

Buscar `useEffect` que llama `setActiveMod` y mover para evitar doble render:

```jsx
// ANTES (aproximadamente línea 180)
useEffect(() => {
  const modId = Number(params.moduleId);
  if (modId >= 1 && modId <= 5 && modId !== activeMod) {
    setActiveMod(modId);
  }
}, [params.moduleId]);

// DESPUÉS — Usar useLayoutEffect para sincronizar antes de paint
import { useLayoutEffect } from 'react';

useLayoutEffect(() => {
  const modId = Number(params.moduleId);
  if (modId >= 1 && modId <= 5) {
    useIALabStore.getState().setActiveMod(modId);
  }
}, [params.moduleId]);

// Bonus: prevenir re-render innecesario en el layout
const activeMod = useIALabStore(s => s.activeMod);
```

- [ ] **3.8: Eliminar DOM duplicado en Sidebar**

**Archivo:** `src/components/IALab/IALabSidebar.jsx`

El sidebar renderiza simultáneamente collapsed y expanded con `AnimatePresence` toggle. Refactorizar para renderizar solo un estado:

```jsx
// ANTES — DOM duplicado
<AnimatePresence>
  {isExpanded ? (
    <ExpandedSidebar />  // Siempre en DOM
  ) : (
    <CollapsedSidebar /> // Siempre en DOM
  )}
</AnimatePresence>

// DESPUÉS — Renderizado condicional con layout animation
<motion.div layout className={`${isExpanded ? 'w-64' : 'w-16'}`}>
  {isExpanded ? <ExpandedContent /> : <CollapsedContent />}
</motion.div>
```

- [ ] **3.9: Migrar <style> tags inline de OVAs a CSS modules**

12 componentes OVA usan `<style>` tags. Crear CSS modules compartidos:

```css
/* src/components/IALab/ova-styles.module.css */
.ovaContainer {
  @apply rounded-2xl bg-white border border-slate-200/60 shadow-sm;
}
.ovaTitle {
  @apply text-lg font-bold text-petroleum;
}
.ovaButton {
  @apply px-4 py-2 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white;
}
```

```jsx
// En cada OVA
import styles from '../ova-styles.module.css';

function OVAComponent() {
  return (
    <div className={styles.ovaContainer}>
      <h3 className={styles.ovaTitle}>...</h3>
    </div>
  );
}
```

- [ ] **3.10: Unificar acceso al store (context siempre)**

Agregar enforcer de reglas (ESLint custom rule o runtime check):

```jsx
// shared/useStoreAccess.js
import { useIALabContext } from '../IALab/IALabProvider';

/**
 * Hook unificado para acceso al store.
 * Todos los componentes DEBEN usar este hook en vez de useIALabStore directamente.
 */
export function useStoreAccess() {
  const context = useIALabContext();
  if (!context) {
    throw new Error('useStoreAccess debe usarse dentro de IALabProvider');
  }
  return context;
}
```

Luego agregar ESLint rule:

```bash
npm install -D eslint-plugin-boundaries
```

**Archivo:** `.eslintrc.cjs`

```js
module.exports = {
  plugins: ['boundaries'],
  rules: {
    'boundaries/no-direct-store-access': ['error', {
      store: 'useIALabStore',
      allowedPatterns: ['IALabProvider', 'hooks/'],
    }],
  },
};
```

### Fase 4: ESLint + Prettier Strict (Sprint 2)

- [ ] **3.11: Configurar ESLint estricto**

```bash
npm install -D eslint eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks
```

**Archivo:** `.eslintrc.cjs`

```js
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  rules: {
    'react/prop-types': 'error',
    'react/jsx-no-target-blank': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],
  },
  settings: {
    react: { version: 'detect' },
  },
};
```

- [ ] **3.12: Agregar lint-staged + husky**

```bash
npm install -D husky lint-staged
npx husky init
```

**Archivo:** `.husky/pre-commit`

```bash
npx lint-staged
```

**Archivo:** `package.json` (agregar)

```json
"lint-staged": {
  "src/**/*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "src/**/*.css": [
    "prettier --write"
  ]
}
```

---

## Dimensión 4: Arquitectura SaaS — 7.0 → 9.0

### Problemas detectados
- 5 módulos hardcodeados en `ALL_LESSIONS[1-5]`
- Single-course assumption
- Sin RBAC real
- API URL hardcodeada a `localhost:3001`
- Sin monitoreo ni telemetría
- Sin rate limiting

### Fase 1: Sistema Multi-curso + Multi-módulo (Sprint 4-6)

- [ ] **4.1: Diseñar schema de datos extensible**

```sql
-- Esquema multi-tenant para Supabase
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title JSONB NOT NULL, -- { "es": "Curso IA", "en": "AI Course" }
  description JSONB,
  icon TEXT,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title JSONB NOT NULL,
  description JSONB,
  icon TEXT,
  order_index INTEGER NOT NULL,
  required_xp INTEGER DEFAULT 0,
  estimated_hours DECIMAL(4,1),
  UNIQUE(course_id, order_index)
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title JSONB NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reading', 'video', 'quiz', 'challenge', 'ova')),
  content JSONB,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  UNIQUE(module_id, order_index)
);

CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  course_id UUID REFERENCES courses(id),
  module_id UUID REFERENCES modules(id),
  lesson_id UUID REFERENCES lessons(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  score DECIMAL(5,2),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE user_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);
```

- [ ] **4.2: Crear CourseRepository con factory pattern**

**Archivo:** `src/components/IALab/data/CourseRepository.js`

```js
import { createClient } from '@supabase/supabase-js';

/**
 * CourseRepository — acceso a datos de cursos desde Supabase
 * Factory: createCourseRepository(dbType) devuelve implementación concreta
 */
export class CourseRepository {
  constructor(db) {
    this.db = db;
  }

  async getCourses() {
    const { data, error } = await this.db
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('order_index');
    if (error) throw error;
    return data;
  }

  async getModules(courseId) {
    const { data, error } = await this.db
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');
    if (error) throw error;
    return data;
  }

  async getLessons(moduleId) {
    const { data, error } = await this.db
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index');
    if (error) throw error;
    return data;
  }

  async getUserProgress(userId, courseId) {
    const { data, error } = await this.db
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId);
    if (error) throw error;
    return data;
  }

  async saveProgress({ userId, courseId, moduleId, lessonId, status, score }) {
    const { data, error } = await this.db
      .from('user_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        module_id: moduleId,
        lesson_id: lessonId,
        status,
        score,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      }, {
        onConflict: 'user_id, lesson_id',
      });
    if (error) throw error;
    return data;
  }
}

// Factory
export function createCourseRepository(dbType = 'supabase') {
  if (dbType === 'supabase') {
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    return new CourseRepository(supabase);
  }
  if (dbType === 'local') {
    return new LocalCourseRepository();
  }
  throw new Error(`Unknown db type: ${dbType}`);
}

class LocalCourseRepository {
  constructor() {
    this.progress = JSON.parse(localStorage.getItem('course_progress') || '{}');
  }

  async getCourses() { return COURSES_DATA; }
  async getModules(courseId) { return MODULES_DATA[courseId] || []; }
  async getLessons(moduleId) { return LESSONS_DATA[moduleId] || []; }

  async getUserProgress(userId, courseId) {
    return Object.entries(this.progress).map(([lessonId, status]) => ({
      user_id: userId, lesson_id: lessonId, ...status,
    }));
  }

  async saveProgress({ userId, lessonId, status, score }) {
    this.progress[lessonId] = { status, score, completed_at: new Date().toISOString() };
    localStorage.setItem('course_progress', JSON.stringify(this.progress));
  }
}
```

- [ ] **4.3: Refactor IALab.jsx para usar CourseRepository**

```jsx
// IALab.jsx — cambiar carga de datos
const [courses, setCourses] = useState([]);
const [modules, setModules] = useState([]);
const repo = useMemo(() => createCourseRepository('local'), []);

useEffect(() => {
  repo.getModules('course-1').then(setModules);
}, []);
```

### Fase 2: RBAC + API Gateway (Sprint 4-5)

- [ ] **4.4: Implementar RBAC con Clerk**

```jsx
// hooks/useRBAC.js
import { useClerk } from '@clerk/react';

const ROLES = {
  student: ['read:modules', 'read:content', 'write:quiz'],
  tutor: ['read:modules', 'read:content', 'write:quiz', 'read:progress'],
  admin: ['*'],
};

export function useRBAC() {
  const { user } = useClerk();
  const role = user?.publicMetadata?.role || 'student';
  const permissions = ROLES[role] || ROLES.student;

  return {
    role,
    can: (permission) => permissions.includes(permission) || permissions.includes('*'),
    isAdmin: role === 'admin',
    isTutor: role === 'tutor' || role === 'admin',
  };
}
```

```jsx
// Uso en componentes
import { useRBAC } from '../../hooks/useRBAC';

function ModuleActions({ moduleId }) {
  const { can } = useRBAC();

  return (
    <>
      {can('write:quiz') && <QuizButton moduleId={moduleId} />}
      {can('read:progress') && <ViewProgressButton />}
    </>
  );
}
```

- [ ] **4.5: Mover API URL a env vars**

**Archivo:** `.env` (root)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=https://api.edutechlife.com/v1
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

**Archivo:** `src/config/api.js`

```js
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  timeout: 15000,
  retries: 3,
};
```

### Fase 3: Monitoreo + Telemetría (Sprint 5)

- [ ] **4.6: Agregar monitoreo básico**

```bash
npm install @sentry/react
```

**Archivo:** `src/lib/monitoring.js`

```js
import * as Sentry from '@sentry/react';

export function initMonitoring() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.2,
      replaysSessionSampleRate: 0.1,
      integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    });
  }
}

export function trackError(error, context = {}) {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('[Tracked Error]', error, context);
  }
}

export function trackEvent(name, data = {}) {
  if (import.meta.env.PROD) {
    Sentry.captureEvent({ message: name, extra: data });
  }
}
```

- [ ] **4.7: Crear ErrorBoundary con telemetría**

**Archivo:** `src/components/IALab/SectionErrorBoundary.jsx` (mejorar el existente)

```jsx
import { Component } from 'react';
import { trackError } from '../../lib/monitoring';

export class SectionErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    trackError(error, {
      component: this.props.name || 'Unknown',
      moduleId: this.props.moduleId,
      action: 'render',
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-4 m-4 bg-rose-50 border border-rose-200 rounded-xl">
          <h3 className="text-rose-800 font-semibold">
            Error en {this.props.name || 'sección'}
          </h3>
          <p className="text-rose-600 text-sm mt-1">
            Algo salió mal. El error ha sido reportado.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## Dimensión 5: Rendimiento — 7.0 → 9.0

### Problemas detectados
- `pdfjs-dist` (~20MB), `tesseract.js` (~10MB) inflan bundle
- Bundle analysis no existe
- Sin virtualización de listas largas
- Sin code-splitting granular en OVAs
- Animaciones `box-shadow` (paint-heavy)

### Fase 1: Bundle Optimization (Sprint 2)

- [ ] **5.1: Configurar bundle analyzer**

```bash
npm install -D vite-bundle-analyzer
```

**Archivo:** `vite.config.ts` (modificar)

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { bundleAnalyzer } from 'vite-bundle-analyzer';

export default defineConfig({
  plugins: [
    react(),
    process.env.ANALYZE && bundleAnalyzer(),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-vendor': ['pdfjs-dist'],
          'animation-vendor': ['framer-motion', 'canvas-confetti', 'lottie-web'],
          'ai-vendor': ['tesseract.js'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-avatar'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
```

- [ ] **5.2: Lazy loading de pdfjs-dist**

```jsx
// En lugar de import estático al inicio
const PDFViewer = lazy(() => import('./PDFViewer'));

// PDFViewer.jsx — import dinámico de pdfjs
export default function PDFViewer({ url }) {
  const [pdfjs, setPdfjs] = useState(null);

  useEffect(() => {
    import('pdfjs-dist').then((mod) => {
      mod.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
      setPdfjs(mod);
    });
  }, []);

  if (!pdfjs) return <PDFSkeleton />;
  // render PDF
}
```

- [ ] **5.3: Eliminar animaciones paint-heavy**

Buscar en todo IALab animaciones de `box-shadow` o `width`/`height`:

```jsx
// ANTES — paint-heavy
animate={{ boxShadow: '0 8px 32px rgba(...)' }}

// DESPUÉS — compositor-only
animate={{ opacity: 1, scale: 1 }}
transition={{ opacity: { duration: 0.2 }, scale: { type: 'spring', stiffness: 300 } }}
```

### Fase 2: Virtualización (Sprint 3)

- [ ] **5.4: Virtualizar lista de módulos en sidebar**

```bash
npm install @tanstack/react-virtual
```

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';

function SidebarModuleList({ modules }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: modules.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
  });

  return (
    <div ref={parentRef} className="overflow-y-auto" style={{ height: '400px' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {modules[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Fase 3: Re-render Optimization (Sprint 3)

- [ ] **5.5: Agregar React.memo + useMemo en componentes críticos**

```jsx
// IALabSidebar — prevenir re-render si activeMod no cambió
export const IALabSidebar = React.memo(function IALabSidebar({ modules }) {
  const activeMod = useIALabStore(s => s.activeMod);
  // ...
});

// ModuleOverviewCard — memo por módulo
export const ModuleOverviewCard = React.memo(function ModuleOverviewCard({ moduleId }) {
  // ...
});
```

- [ ] **5.6: Optimizar re-renders en TuRutaDeHoy**

```jsx
// Usar selectores granulares en vez de destructure
// ❌ MAL — re-renderiza en cualquier cambio de store
const { activeMod, progress } = useIALabStore();

// ✅ BIEN — solo re-renderiza cuando activeMod o progress cambian
const activeMod = useIALabStore(s => s.activeMod);
const moduleProgress = useIALabStore(s => s.getModuleProgress(s.activeMod));
```

---

## Dimensión 6: Experiencia Estudiante — 8.0 → 9.5

### Problemas detectados
- FlashcardArena no existe (sin spaced repetition)
- Sin anotaciones inline sobre contenido
- Sin dificultad adaptativa
- Sin notificaciones push
- Sin modo lectura (font size, sepia)
- Sin búsqueda semántica

### Fase 1: FlashcardArena + Spaced Repetition (Sprint 3-4)

- [ ] **6.1: Crear FlashcardArena con algoritmo SM-2**

**Archivo:** `src/components/IALab/FlashcardArena.jsx`

```jsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../shared/Icon';

// Algoritmo SM-2 (SuperMemo)
function calculateNextReview(quality, previousInterval = 1, previousEase = 2.5) {
  let newInterval, newEase;

  if (quality < 3) {
    newInterval = 1; // Repetir mañana
    newEase = previousEase;
  } else {
    if (previousInterval === 1) newInterval = 6;
    else if (previousInterval === 6) newInterval = 16;
    else newInterval = Math.round(previousInterval * previousEase);

    newEase = previousEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  }

  return { interval: newInterval, ease: Math.max(1.3, newEase) };
}

// Datos de ejemplo: términos clave del módulo
const SAMPLE_FLASHCARDS = [
  { id: 'f1', front: '¿Qué es un prompt?', back: 'Instrucción o entrada que se le da a un modelo de IA para generar una respuesta.' },
  { id: 'f2', front: '¿Qué es fine-tuning?', back: 'Proceso de entrenar un modelo pre-entrenado con datos específicos para una tarea concreta.' },
  { id: 'f3', front: '¿Qué es temperatura en un LLM?', back: 'Parámetro que controla la aleatoriedad de las respuestas. Valores bajos (0.1) = más determinista, altos (0.9) = más creativo.' },
  { id: 'f4', front: '¿Qué es RAG?', back: 'Retrieval Augmented Generation — técnica que combina búsqueda en documentos con generación de texto.' },
];

export function FlashcardArena({ moduleId }) {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem(`flashcards-${moduleId}`);
    return saved ? JSON.parse(saved) : SAMPLE_FLASHCARDS.map(c => ({
      ...c,
      interval: 1, ease: 2.5, nextReview: Date.now(),
    }));
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const dueCards = cards.filter(c => c.nextReview <= Date.now());
  const currentCard = dueCards[currentIndex] || cards[currentIndex];

  const handleRate = useCallback((quality) => {
    if (!currentCard) return;

    const { interval, ease } = calculateNextReview(quality, currentCard.interval, currentCard.ease);
    const nextReview = Date.now() + interval * 86400000;

    setCards(prev => prev.map(c =>
      c.id === currentCard.id ? { ...c, interval, ease, nextReview } : c
    ));

    setDirection(1);
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % dueCards.length);

    // Persistir
    setTimeout(() => {
      const updated = cards.map(c =>
        c.id === currentCard.id ? { ...c, interval, ease, nextReview } : c
      );
      localStorage.setItem(`flashcards-${moduleId}`, JSON.stringify(updated));
    }, 100);
  }, [currentCard, cards, moduleId, dueCards.length]);

  const stats = {
    total: cards.length,
    due: dueCards.length,
    studied: cards.filter(c => c.interval > 1).length,
  };

  if (dueCards.length === 0 && stats.studied > 0) {
    return (
      <div className="text-center p-8">
        <Icon name="fa-check-circle" className="text-green-500 text-4xl mb-3" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-slate-800">¡Todo al día!</h3>
        <p className="text-slate-500 mt-1">No hay flashcards para repasar. Vuelve más tarde.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Stats bar */}
      <div className="flex justify-between text-sm text-slate-500 mb-4" role="status" aria-live="polite">
        <span>{stats.total} tarjetas</span>
        <span>{stats.due} para repasar</span>
        <span>{stats.studied} estudiadas</span>
      </div>

      {/* Card */}
      <div className="perspective-1000 h-64 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentCard?.id}
            custom={direction}
            variants={{
              enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="relative w-full h-full preserve-3d"
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? 'Respuesta de la tarjeta' : 'Pregunta de la tarjeta. Presione Enter para ver la respuesta.'}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFlipped(!isFlipped); }}}
          >
            {/* Front */}
            <div className={`absolute inset-0 bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6 flex items-center justify-center backface-hidden ${isFlipped ? 'hidden' : ''}`}>
              <p className="text-lg font-medium text-slate-800 text-center">{currentCard?.front}</p>
            </div>
            {/* Back */}
            <div className={`absolute inset-0 bg-gradient-to-br from-petroleum/5 to-corporate/5 border-2 border-corporate/30 rounded-2xl shadow-sm p-6 flex items-center justify-center backface-hidden rotate-y-180 ${isFlipped ? '' : 'hidden'}`}>
              <p className="text-base text-slate-700 text-center leading-relaxed">{currentCard?.back}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rating buttons — solo visibles cuando está volteada */}
      {isFlipped && (
        <div className="flex justify-center gap-3 mt-6">
          {[
            { label: 'Difícil', quality: 1, className: 'bg-rose-100 text-rose-700 hover:bg-rose-200' },
            { label: 'Regular', quality: 3, className: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
            { label: 'Fácil', quality: 5, className: 'bg-green-100 text-green-700 hover:bg-green-200' },
          ].map((btn) => (
            <button
              key={btn.quality}
              onClick={() => handleRate(btn.quality)}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${btn.className}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-slate-400 mt-4">
        Haz clic en la tarjeta para ver la respuesta
      </p>
    </div>
  );
}

// Agregar estilos 3D necesarios en tokens.css (o inline)
const style = document.createElement('style');
style.textContent = `
  .perspective-1000 { perspective: 1000px; }
  .preserve-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
`;
document.head.appendChild(style);
```

- [ ] **6.2: Integrar FlashcardArena en ToolTutorAccordion**

**Archivo:** `src/components/IALab/ToolTutorAccordion.jsx`

Agregar como herramienta adicional en cada módulo:

```jsx
import { FlashcardArena } from './FlashcardArena';

// Dentro del render de herramientas
{activeSection === 'flashcards' && (
  <div className="p-4">
    <h3 className="text-lg font-semibold text-petroleum mb-4">
      Flashcards — Repaso Espaciado
    </h3>
    <FlashcardArena moduleId={activeMod} />
  </div>
)}
```

### Fase 2: Anotaciones Inline (Sprint 4)

- [ ] **6.3: Crear sistema de anotaciones sobre recursos**

**Archivo:** `src/components/IALab/AnnotationSystem.jsx`

```jsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Permite al estudiante seleccionar texto en recursos y crear anotaciones.
 */
export function AnnotationSystem({ resourceId, children }) {
  const [annotations, setAnnotations] = useState(() => {
    const saved = localStorage.getItem(`annotations-${resourceId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [isSelecting, setIsSelecting] = useState(false);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !isSelecting) return;

    const text = selection.toString().trim();
    if (text.length < 10) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const newAnnotation = {
      id: `ann-${Date.now()}`,
      text,
      color: '#FFD166',
      createdAt: new Date().toISOString(),
      note: '',
    };

    setAnnotations(prev => {
      const updated = [...prev, newAnnotation];
      localStorage.setItem(`annotations-${resourceId}`, JSON.stringify(updated));
      return updated;
    });

    selection.removeAllRanges();
  }, [isSelecting, resourceId]);

  const addNote = useCallback((annId, note) => {
    setAnnotations(prev => {
      const updated = prev.map(a =>
        a.id === annId ? { ...a, note } : a
      );
      localStorage.setItem(`annotations-${resourceId}`, JSON.stringify(updated));
      return updated;
    });
  }, [resourceId]);

  const removeAnnotation = useCallback((annId) => {
    setAnnotations(prev => {
      const updated = prev.filter(a => a.id !== annId);
      localStorage.setItem(`annotations-${resourceId}`, JSON.stringify(updated));
      return updated;
    });
  }, [resourceId]);

  return (
    <div
      onMouseUp={handleTextSelection}
      className="relative"
      role="region"
      aria-label="Área de anotaciones"
    >
      {children}

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-2" role="toolbar" aria-label="Herramientas de anotación">
        <button
          onClick={() => setIsSelecting(!isSelecting)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            isSelecting
              ? 'bg-petroleum text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          aria-pressed={isSelecting}
          aria-label={isSelecting ? 'Desactivar selección de texto' : 'Activar selección de texto para anotar'}
        >
          <Icon name="fa-highlighter" aria-hidden="true" className="mr-1.5" />
          Anotar
        </button>
      </div>

      {/* Annotation list */}
      <AnimatePresence>
        {annotations.map((ann) => (
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg mb-2"
          >
            <blockquote className="text-sm text-slate-700 italic mb-2">
              "{ann.text}"
            </blockquote>
            <textarea
              value={ann.note}
              onChange={(e) => addNote(ann.id, e.target.value)}
              placeholder="Agrega tu nota..."
              className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-petroleum/30"
              rows={2}
              aria-label="Nota de anotación"
            />
            <button
              onClick={() => removeAnnotation(ann.id)}
              className="text-xs text-rose-500 hover:text-rose-700 mt-1"
              aria-label={`Eliminar anotación: ${ann.text}`}
            >
              Eliminar
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {annotations.length > 0 && (
        <p className="text-xs text-slate-400 mt-2" role="status" aria-live="polite">
          {annotations.length} anotaciones
        </p>
      )}
    </div>
  );
}
```

### Fase 3: Modo Lectura + Audio (Sprint 4)

- [ ] **6.4: Agregar modo lectura con ajustes**

```jsx
// hooks/useReadingPreferences.js
import { useState, useCallback } from 'react';

const PREFERENCES_KEY = 'ialab-reading-prefs';

export function useReadingPreferences() {
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem(PREFERENCES_KEY);
    return saved ? JSON.parse(saved) : {
      fontSize: 16,
      fontFamily: 'sans',
      lineHeight: 1.6,
      theme: 'light', // light | sepia | dark
    };
  });

  const updatePref = useCallback((key, value) => {
    setPrefs(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const style = {
    fontSize: `${prefs.fontSize}px`,
    lineHeight: prefs.lineHeight,
    fontFamily: prefs.fontFamily === 'serif' ? 'Georgia, serif' : 
                 prefs.fontFamily === 'mono' ? 'JetBrains Mono, monospace' : 
                 'Open Sans, sans-serif',
    backgroundColor: prefs.theme === 'sepia' ? '#FEFCF3' : 
                    prefs.theme === 'dark' ? '#1E293B' : '#FFFFFF',
    color: prefs.theme === 'dark' ? '#E2E8F0' : '#1E293B',
  };

  return { prefs, updatePref, style };
}
```

### Fase 4: Notificaciones y Recordatorios (Sprint 5)

- [ ] **6.5: Configurar notificaciones push (PWA)**

**Archivo:** `public/sw.js` (mejorar service worker)

```js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: { url: data.url },
    actions: [
      { action: 'open', title: 'Ir al curso' },
      { action: 'close', title: 'Cerrar' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open') {
    clients.openWindow(event.notification.data.url);
  }
});
```

- [ ] **6.6: Crear NotificationService**

```jsx
// services/NotificationService.js
export class NotificationService {
  static async requestPermission() {
    if (!('Notification' in window)) return 'denied';
    return await Notification.requestPermission();
  }

  static async subscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      });
      
      // Guardar suscripción en Supabase
      await fetch(`${API_CONFIG.baseUrl}/push/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  static async notifyStreakAtRisk(streak) {
    if (Notification.permission === 'granted') {
      new Notification('¡Tu racha está en riesgo!', {
        body: `Llevas ${streak} días seguidos. ¡No pierdas tu racha!`,
        icon: '/icon-192.png',
      });
    }
  }

  static async notifyNewModule(moduleName) {
    if (Notification.permission === 'granted') {
      new Notification('Nuevo módulo disponible', {
        body: `El módulo "${moduleName}" está listo para ti.`,
        icon: '/icon-192.png',
      });
    }
  }
}
```

---

## Dimensión 7: Mobile UX — 7.0 → 9.0

### Problemas detectados
- Sidebar aparece en lg (1024px) → debería ser md (768px)
- Sin swipe entre módulos en mobile
- Sin touch gestures específicas (pinch zoom en contenido)
- OVAs sin optimización mobile
- Sin pull-to-refresh

### Fase 1: Sidebar + Layout Mobile (Sprint 1-2)

- [ ] **7.1: Cambiar breakpoint de sidebar a md (768px)**

**Archivo:** `src/components/IALab/IALab.jsx`

```jsx
// ANTES
<aside className="hidden lg:block ...">

// DESPUÉS
<aside className="hidden md:block ...">
```

**Archivo:** `src/components/IALab/IALabSidebar.jsx`

```jsx
// Ajustar animación de ancho para md
<motion.aside
  animate={{ width: isExpanded ? 256 : 64 }}
  className="hidden md:block ..."
>
```

### Fase 2: Touch Gestures (Sprint 2-3)

- [ ] **7.2: Agregar swipe entre módulos en mobile**

```jsx
// hooks/useSwipeNavigation.js
import { useCallback, useRef } from 'react';

export function useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold = 80 }) {
  const touchStart = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;

    // Solo swipe horizontal significativo
    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy) * 2) {
      if (dx > 0) onSwipeRight?.();
      else onSwipeLeft?.();
    }
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return { handleTouchStart, handleTouchEnd };
}
```

- [ ] **7.3: Implementar en IALab.jsx**

```jsx
import { useSwipeNavigation } from './hooks/useSwipeNavigation';

function IALab() {
  const activeMod = useIALabStore(s => s.activeMod);
  const setActiveMod = useIALabStore(s => s.setActiveMod);

  const { handleTouchStart, handleTouchEnd } = useSwipeNavigation({
    onSwipeLeft: () => activeMod < 5 && setActiveMod(activeMod + 1),
    onSwipeRight: () => activeMod > 1 && setActiveMod(activeMod - 1),
    threshold: 80,
  });

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* ... */}
    </div>
  );
}
```

### Fase 3: Pull-to-refresh + Loading (Sprint 3)

- [ ] **7.4: Agregar pull-to-refresh**

```bash
npm install react pull-to-refresh
```

O implementación manual:

```jsx
// hooks/usePullToRefresh.js
import { useState, useCallback, useRef, useEffect } from 'react';

export function usePullToRefresh({ onRefresh, threshold = 80 }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e) => {
    if (containerRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (touchStartY.current) {
      const dy = e.touches[0].clientY - touchStartY.current;
      if (dy > 0) setPullDistance(Math.min(dy * 0.5, 120));
    }
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
    touchStartY.current = 0;
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  return { containerRef, pullDistance, isRefreshing, handleTouchStart, handleTouchMove, handleTouchEnd };
}
```

---

## Dimensión 8: Diseño Visual — 8.5 → 9.5

### Problemas detectados
- Token CSS duplicados en 3 sistemas paralelos
- 5 familias de fuente cargadas
- Sidebar breakpoint incorrecto
- Dark mode toggle enterrado

### Fase 1: Unificación de Sistema de Tokens (Sprint 1)

- [ ] **8.1: Unificar tokens CSS (eliminar duplicación)**

**Archivo:** `src/design-system/tokens.css` (source of truth única)

```css
/* Mantener SOLO este archivo como fuente única */
:root {
  --ialab-petroleum: #004B63;
  --ialab-cyan: #0097A7;  /* Mejorado para contraste AA */
  --ialab-navy: #0D2B5B;
  --ialab-teal: #2596be;
  --ialab-bg: #F8FAFC;
  --ialab-surface: #FFFFFF;
  /* ... resto de tokens */
}
```

**Acción:** Remover duplicados de `index.css` (líneas ~178-679) y del bloque shadcn `@layer base`. Dejar que `tokens.css` importe primero en `index.css`:

```css
/* index.css — solo esto */
@import '../design-system/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **8.2: Reducir a 3 familias de fuente**

Eliminar `Inter` y `Geist` del `index.css`. Mantener:
- `Montserrat` — headings (display)
- `Open Sans` — body (lectura)
- `JetBrains Mono` — código

```css
/* En index.css, remover links a Inter y Geist */
/* Mantener solo: */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Fase 2: UI Polish (Sprint 1-2)

- [ ] **8.3: Mover dark mode toggle al header**

**Archivo:** `src/components/IALab/IALab.jsx`

Mover el toggle desde los tabs (línea ~473) al header:

```jsx
// En IALabHeader.jsx — agregar junto a notificaciones
<button
  onClick={toggleDarkMode}
  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
  aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
>
  <Icon name={isDark ? 'fa-sun' : 'fa-moon'} className="text-slate-600" aria-hidden="true" />
</button>
```

- [ ] **8.4: Agregar empty states ilustrados**

```jsx
// shared/EmptyState.jsx — crear componente reutilizable
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" role="status">
      <div className="w-24 h-24 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
        <Icon name={icon || 'fa-inbox'} className="text-slate-400 text-3xl" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1 max-w-sm">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="mt-4 px-4 py-2 bg-petroleum text-white rounded-xl text-sm font-medium hover:bg-petroleum-dark transition-colors">
          {action.label}
        </button>
      )}
    </div>
  );
}
```

---

## Dimensión 9: Gamificación — 9.0 → 9.8

### Problemas detectados
- Sin sonidos para achievements
- Sin stacking de achievement toasts
- Sin daily challenges/missions
- Sin animación de transición en progreso

### Fase 1: Sonidos + Stacking (Sprint 2)

- [ ] **9.1: Agregar sonidos sutiles a achievements**

```jsx
// useSoundEffects.js
const SOUNDS = {
  badge: '/sounds/achievement.mp3',
  levelUp: '/sounds/level-up.mp3',
  streak: '/sounds/streak.mp3',
  confetti: '/sounds/confetti.mp3',
};

export function useSoundEffects() {
  const playSound = useCallback(async (type) => {
    try {
      const audio = new Audio(SOUNDS[type]);
      audio.volume = 0.3;
      await audio.play();
    } catch {
      // Audio blockeado por el navegador — silencioso
    }
  }, []);

  return { playSound };
}
```

- [ ] **9.2: Agregar stack de achievement toasts**

```jsx
// AchievementToast — ahora soporta cola
export function AchievementToast({ queue = [], onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2" aria-live="polite">
      <AnimatePresence>
        {queue.slice(0, 3).map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`p-4 rounded-2xl shadow-lg border backdrop-blur-sm ${
              toast.type === 'badge' ? 'bg-amber-50 border-amber-200' :
              toast.type === 'levelup' ? 'bg-cyan-50 border-cyan-200' :
              'bg-rose-50 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon name={toast.icon} className="text-2xl" aria-hidden="true" />
              <div>
                <p className="font-semibold text-slate-800">{toast.title}</p>
                <p className="text-sm text-slate-500">{toast.description}</p>
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="ml-auto text-slate-400 hover:text-slate-600"
                aria-label="Cerrar notificación"
              >
                <Icon name="fa-times" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

### Fase 2: Daily Challenges (Sprint 3)

- [ ] **9.3: Crear sistema de daily challenges**

```jsx
// constants/dailyChallenges.js
export const DAILY_CHALLENGES = [
  {
    id: 'dc-1',
    title: 'Racha matutina',
    description: 'Completa una lección antes de las 10 AM',
    xp: 50,
    icon: 'fa-sun',
  },
  {
    id: 'dc-2',
    title: 'Practicante',
    description: 'Responde 10 flashcards correctamente',
    xp: 75,
    icon: 'fa-brain',
  },
  {
    id: 'dc-3',
    title: 'Explorador',
    description: 'Abre 3 recursos diferentes',
    xp: 30,
    icon: 'fa-compass',
  },
  {
    id: 'dc-4',
    title: 'Sin distracciones',
    description: 'Completa un quiz sin cambiar de pestaña',
    xp: 100,
    icon: 'fa-shield',
  },
  {
    id: 'dc-5',
    title: 'Ayudante',
    description: 'Publica una pregunta en el foro',
    xp: 40,
    icon: 'fa-comments',
  },
];
```

---

## Dimensión 10: Animación & Movimiento — 9.5 → 9.9

### Problemas detectados
- Streak badge pulse infinito sin pausa
- Sin animaciones de transición en progres bars
- Sin shared element transitions

### Fase 1: Micro-refinements (Sprint 1)

- [ ] **10.1: Pausar streak pulse cuando el usuario está inactivo**

```jsx
// hooks/useIdlePause.js
import { useState, useEffect } from 'react';

export function useIdlePause(timeout = 60000) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timer;
    const handleActivity = () => {
      setIsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIsIdle(true), timeout);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    handleActivity(); // Iniciar timer

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      clearTimeout(timer);
    };
  }, [timeout]);

  return isIdle;
}
```

```jsx
// En StreakBadge.jsx — pausar animación si idle
const isIdle = useIdlePause();
const shouldReduceMotion = useReducedMotion();

const pulseAnimation = shouldReduceMotion || isIdle
  ? {}
  : { scale: [1, 1.08, 1], transition: { duration: 2, repeat: Infinity } };
```

- [ ] **10.2: Agregar shared element transitions en módulos**

```jsx
// En IALabSidebar.jsx y ModuleOverviewCard.jsx
// Usar layoutId para animaciones compartidas entre sidebar y contenido principal

// Sidebar — módulo activo
<motion.div layoutId={`module-active-${modId}`} className="...">
  {modIcon}
</motion.div>

// Módulo activo en contenido principal
<motion.div layoutId={`module-active-${activeMod}`} className="...">
  {content}
</motion.div>
```

- [ ] **10.3: Agregar animación de llenado en progress bars**

```jsx
// ProgressBar animado
function AnimatedProgressBar({ value, className = '' }) {
  return (
    <div className={`w-full h-2 bg-slate-100 rounded-full overflow-hidden ${className}`} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}
```

---

## Summary: Effort & Timeline

| Sprint | Dimensión | Tareas | Esfuerzo | Impacto |
|--------|-----------|--------|----------|---------|
| **S1** | Accesibilidad (F1-F2) | 2.1-2.6 | 8 tareas | ⭐ Alto |
| **S1** | Diseño Visual (F1) | 8.1-8.3 | 3 tareas | Bajo |
| **S1** | Calidad Código (F4) | 3.11-3.12 | 2 tareas | Medio |
| **S1** | Testing (F1) | 1.1-1.3 | 3 tareas | ⭐ Crítico |
| **S2** | Accesibilidad (F3-F5) | 2.7-2.14 | 8 tareas | ⭐ Alto |
| **S2** | Calidad Código (F3) | 3.7-3.10 | 4 tareas | ⭐ Alto |
| **S2** | Mobile UX (F1) | 7.1 | 1 tarea | Medio |
| **S2** | Gamificación (F1) | 9.1-9.2 | 2 tareas | Bajo |
| **S2** | Animación (F1) | 10.1-10.3 | 3 tareas | Bajo |
| **S2** | Rendimiento (F1) | 5.1-5.3 | 3 tareas | ⭐ Alto |
| **S3** | Calidad Código (F1-F2) | 3.1-3.6 | 6 tareas | ⭐ Crítico |
| **S3** | Testing (F2) | 2.1-2.3 | 3 tareas | ⭐ Crítico |
| **S3** | Experiencia (F1) | 6.1-6.2 | 2 tareas | ⭐ Alto |
| **S3** | Mobile UX (F2-F3) | 7.2-7.4 | 3 tareas | Alto |
| **S3** | Rendimiento (F2-F3) | 5.4-5.6 | 3 tareas | Alto |
| **S4** | Arquitectura (F1-F2) | 4.1-4.5 | 5 tareas | ⭐ Crítico |
| **S4** | Testing (F3) | 3.1-3.2 | 2 tareas | ⭐ Crítico |
| **S4** | Experiencia (F2-F3) | 6.3-6.4 | 2 tareas | Alto |
| **S5** | Arquitectura (F3) | 4.6-4.7 | 2 tareas | ⭐ Alto |
| **S5** | Testing (F4) | 4.1-4.3 | 3 tareas | ⭐ Crítico |
| **S5** | Experiencia (F4) | 6.5-6.6 | 2 tareas | Alto |
| **S5** | Gamificación (F2) | 9.3 | 1 tarea | Medio |

### Proyección de Scores por Sprint

```
Score Actual: 7.9/10
     │
S1 ──┤──► 8.3/10 (Accesibilidad crítica + Testing infra)
S2 ──┤──► 8.6/10 (Code quality + Rendimiento + Mobile)
S3 ──┤──► 8.9/10 (TypeScript migration + Flashcards + Tests)
S4 ──┤──► 9.2/10 (Arquitectura multi-curso + Anotaciones)
S5 ──┤──► 9.5/10 (RBAC + Monitoreo + E2E + Push)
     │
Meta: 9.5/10 🏆
```

### Comandos de verificación por fase

```bash
# Después de cada fase
npm run build                    # Build check
npm run test:coverage            # Coverage check
npx tsc --noEmit                # TypeScript check (post-migration)
npm run lint                     # Lint check
npx playwright test              # E2E check (post-F4)

# Auditoría final
npx axe-core src/components/IALab/*.jsx --exit  # A11y audit
npx lighthouse http://localhost:5173/ialab/1    # Performance audit
npx vite-bundle-analyzer                        # Bundle audit
```

---

*Plan generado: 2026-05-30 | Próxima revisión: post-Sprint 3*
