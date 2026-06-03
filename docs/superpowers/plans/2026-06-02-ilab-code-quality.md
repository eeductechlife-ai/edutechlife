# iLAB Código/Mantenibilidad — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Subir Código/Mantenibilidad de 7.8 → 8.8 (JSDoc types, PropTypes, component split, ESLint CI, +20 tests)

**Architecture:** 5 fases independientes (Q1-Q5). Fase Q2 (PropTypes script) se ejecuta en paralelo con Q1, Q3-Q5.

**Tech Stack:** React 18, Vitest, ESLint v9, JSDoc

---

## File Structure

**Create:**
- `scripts/add-proptypes.mjs` — generador PropTypes automático
- `.github/workflows/lint.yml` — ESLint CI
- `src/components/IALab/__tests__/ialabStore.test.jsx`
- `src/components/IALab/__tests__/TouchableIcon.test.jsx`
- `src/components/IALab/__tests__/EmptyState.test.jsx`
- `src/components/IALab/__tests__/SectionErrorBoundary.test.jsx`
- `src/components/IALab/__tests__/ToastNotification.test.jsx`
- `src/components/IALab/__tests__/useDeviceType.test.jsx`

**Modify:**
- ~15 archivos core (JSDoc types)
- ~150 archivos JSX (PropTypes vía script)
- 5 archivos grandes (component split)
- `.eslintrc.cjs` (actualizar si necesario)

---

### Task 1: JSDoc Types — Store + Hooks

**Files:**
- Modify: `src/store/ialabStore.js`
- Modify: `src/hooks/IALab/useIALabForum.js`
- Modify: `src/hooks/useDeviceType.js`

- [ ] **Step 1: Añadir JSDoc typedefs a ialabStore.js**

Al inicio del archivo (después de imports), añadir:

```js
/**
 * @typedef {Object} Module
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'locked'|'available'|'completed'} status
 * @property {number} progress
 * @property {number} score
 */

/**
 * @typedef {Object} Streak
 * @property {number} current
 * @property {number} best
 * @property {boolean} atRisk
 * @property {number} freezes
 */

/**
 * @typedef {Object} Badge
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {boolean} earned
 * @property {string} [earnedAt]
 */

/**
 * @typedef {Object} IALabState
 * @property {Module[]} modules
 * @property {number} activeModule
 * @property {Streak} streak
 * @property {Badge[]} badges
 * @property {string[]} completions
 * @property {boolean} loading
 * @property {string|null} error
 */
```

Luego añadir `@returns {IALabState}` a la función principal del store y `@param` a cada action.

- [ ] **Step 2: Añadir JSDoc a useDeviceType.js**

Leer el archivo y añadir:

```js
/**
 * @typedef {Object} DeviceInfo
 * @property {boolean} isMobile
 * @property {boolean} isTablet
 * @property {boolean} isDesktop
 */

/**
 * Hook que detecta el tipo de dispositivo vía matchMedia.
 * @returns {DeviceInfo}
 */
export function useDeviceType() {
```

- [ ] **Step 3: Añadir JSDoc a useIALabForum.js**

Leer el archivo y añadir `@param` y `@returns` a las funciones exportadas.

- [ ] **Step 4: Commit**

```bash
git add src/store/ialabStore.js src/hooks/IALab/useIALabForum.js src/hooks/useDeviceType.js
git commit -m "docs(jsdoc): add type definitions to store and core hooks"
```

---

### Task 2: JSDoc Types — Shared Components

**Files:**
- Modify: `src/components/IALab/shared/AnimatedSection.jsx`
- Modify: `src/components/IALab/shared/EmptyState.jsx`
- Modify: `src/components/IALab/shared/LoadingSpinner.jsx`
- Modify: `src/components/IALab/shared/MobileHeader.jsx`
- Modify: `src/components/IALab/shared/OVAValerioBar.jsx`
- Modify: `src/components/IALab/shared/SkipLink.jsx`
- Modify: `src/components/IALab/shared/TabPills.jsx`
- Modify: `src/components/IALab/shared/ToastNotification.jsx`
- Modify: `src/components/IALab/shared/TouchableIcon.jsx`

- [ ] **Step 1: Leer y añadir JSDoc a cada shared component**

Para cada archivo, leerlo y añadir `@param {Object} props` con propiedades tipadas. Ejemplo:

```js
/**
 * @param {Object} props
 * @param {import('react').ReactNode} [props.children]
 * @param {string} [props.className]
 */
export function AnimatedSection({ children, className }) {
```

- [ ] **Step 2: Commit**

```bash
git add src/components/IALab/shared/
git commit -m "docs(jsdoc): add prop types to all shared components"
```

---

### Task 3: PropTypes Automation Script

**Files:**
- Create: `scripts/add-proptypes.mjs`

- [ ] **Step 1: Crear script de generación de PropTypes**

```js
#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IALAB_DIR = path.resolve(__dirname, '../src/components/IALab');
const EXTENSIONS = ['.jsx'];

function extractProps(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Skip files that already have PropTypes
  if (content.includes('.propTypes =') || content.includes('PropTypes.')) return null;

  // Find function declarations with destructured props
  // Matches: export function Component({ prop1, prop2 }) or function Component({ prop1 })
  // Matches: const Component = ({ prop1 }) => or export const Component = ({ prop1 }) =>
  const propRegex = /(?:export\s+)?(?:function|const)\s+(\w+)\s*[=:]\s*(?:\(?\s*\{([^}]*)\}\s*\)?)?\s*(?:=>|{)/g;
  let match;
  let componentName = null;
  let props = [];

  while ((match = propRegex.exec(content)) !== null) {
    // First capture group is the function name
    const name = match[1];
    // Second capture group contains the destructured props
    const propStr = match[2];
    if (propStr && /^[A-Z]/.test(name)) {
      componentName = name;
      props = propStr.split(',')
        .map(p => p.trim().split(':')[0].split('=')[0].trim().split(' ')[0].trim())
        .filter(p => p && p !== '' && p !== '...props' && !p.startsWith('...'));
      break;
    }
  }
  // Also try default exports
  if (!componentName) {
    const defaultRegex = /export\s+default\s+function\s+(\w+)\s*\(\s*\{([^}]*)\}\s*\)/;
    const defaultMatch = defaultRegex.exec(content);
    if (defaultMatch) {
      componentName = defaultMatch[1];
      props = defaultMatch[2].split(',')
        .map(p => p.trim().split(':')[0].split('=')[0].trim().split(' ')[0].trim())
        .filter(p => p && p !== '' && p !== '...props' && !p.startsWith('...'));
    }
  }

  if (!componentName || props.length === 0) return null;
  return { componentName, props };
}

function generatePropTypes(componentName, props) {
  const propLines = props.map(p => `  ${p}: PropTypes.any`).join(',\n');
  return `
${componentName}.propTypes = {
${propLines},
};
`;
}

function processFile(filePath) {
  const result = extractProps(filePath);
  if (!result) return false;

  const { componentName, props } = result;
  const content = fs.readFileSync(filePath, 'utf-8');

  // Don't add if only has built-in props like children, className
  const builtIns = ['children', 'className', 'style', 'key', 'ref'];
  const customProps = props.filter(p => !builtIns.includes(p));
  if (customProps.length === 0) return false;

  const needsImport = !content.includes("import PropTypes from 'prop-types'") &&
                      !content.includes('require("prop-types")');

  let modified = content;
  if (needsImport) {
    // Add import after last react import
    const importRegex = /^(import\s+.*?['"]react['"]\s*)/m;
    const reactImport = modified.match(importRegex);
    if (reactImport) {
      modified = modified.replace(reactImport[0], `${reactImport[0]}\nimport PropTypes from 'prop-types';`);
    } else {
      modified = `import PropTypes from 'prop-types';\n${modified}`;
    }
  }

  const propTypesBlock = generatePropTypes(componentName, customProps);

  // Insert before export default or at end of file
  const exportRegex = /(export\s+default\s+\w+)/;
  const exportMatch = modified.match(exportRegex);
  if (exportMatch) {
    modified = modified.replace(exportMatch[0], `${propTypesBlock}\n${exportMatch[0]}`);
  } else {
    // Insert before last line
    const lines = modified.split('\n');
    lines.splice(lines.length - 1, 0, propTypesBlock);
    modified = lines.join('\n');
  }

  fs.writeFileSync(filePath, modified, 'utf-8');
  return true;
}

// Walk through IALAB directory
function walkDir(dir) {
  let count = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !file.name.startsWith('__') && file.name !== 'node_modules') {
      count += walkDir(fullPath);
    } else if (file.isFile() && EXTENSIONS.includes(path.extname(file.name))) {
      if (processFile(fullPath)) {
        console.log(`✓ ${path.relative(IALAB_DIR, fullPath)}`);
        count++;
      }
    }
  }
  return count;
}

const total = walkDir(IALAB_DIR);
console.log(`\n✅ PropTypes added to ${total} files`);
```

- [ ] **Step 2: Ejecutar el script**

```bash
node scripts/add-proptypes.mjs
```

- [ ] **Step 3: Verificar build no roto**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add scripts/add-proptypes.mjs src/components/IALab/
git commit -m "feat(types): add PropTypes to all iLAB components via automated script"
```

---

### Task 4: Component Splitting — Top 5 Archivos

**Files:**
- Modify: `src/components/IALab/IALab.jsx` (520 → split)
- Create: `src/components/IALab/layout/ModuleView.jsx` (extraído de IALab.jsx)
- Create: `src/components/IALab/layout/MobileLayout.jsx`
- Create: `src/components/IALab/layout/DesktopLayout.jsx`
- Modify: `src/components/IALab/IALabForumSection.jsx` (519 → extraer hooks)
- Modify: `src/components/IALab/ResourceViewerModal/index.jsx` (476 → extraer hook)
- Create: `src/components/IALab/hooks/useForumFilters.js`
- Create: `src/components/IALab/hooks/useOVAResolver.js`

- [ ] **Step 1: Extraer useForumFilters hook de IALabForumSection.jsx**

Crear `src/components/IALab/hooks/useForumFilters.js`:

```js
import { useState, useMemo } from 'react';

/**
 * Hook para manejo de filtros del foro
 * @param {Object[]} posts
 * @returns {{
 *   filteredPosts: Object[],
 *   searchQuery: string,
 *   setSearchQuery: (q: string) => void,
 *   activeFilter: string,
 *   setActiveFilter: (f: string) => void,
 *   activeTag: string|null,
 *   setActiveTag: (t: string|null) => void,
 * }}
 */
export function useForumFilters(posts) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTag, setActiveTag] = useState(null);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q)
      );
    }
    if (activeFilter === 'popular') {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    if (activeTag) {
      result = result.filter(p => p.tags?.includes(activeTag));
    }
    return result;
  }, [posts, searchQuery, activeFilter, activeTag]);

  return { filteredPosts, searchQuery, setSearchQuery, activeFilter, setActiveFilter, activeTag, setActiveTag };
}
```

Luego en `IALabForumSection.jsx`, reemplazar la lógica de filtros inline por `import { useForumFilters } from './hooks/useForumFilters'`.

- [ ] **Step 2: Extraer useOVAResolver hook de ResourceViewerModal/index.jsx**

Crear `src/components/IALab/hooks/useOVAResolver.js`:

```js
import { lazy } from 'react';

const OVA_MAP = {
  'bias-lab': lazy(() => import('../OVABiasLab')),
  'chatgpt-tools': lazy(() => import('../OVAChatGPTTools')),
  'notebook-lab': lazy(() => import('../OVANotebookLab')),
  'prompt-original': lazy(() => import('../QueEsPrompt_OVA_Original')),
  'ethics': lazy(() => import('../OVAEtica')),
  'podcast-studio': lazy(() => import('../OVAPodcastStudio')),
  'notebook-simulator': lazy(() => import('../OVANotebookSimulator')),
  'risk-simulator': lazy(() => import('../OVARiskSimulator')),
  'build-gpt': lazy(() => import('../OVABuildGPT')),
  'notebook-podcast-guide': lazy(() => import('../OVANotebookPodcastGuide')),
  'gemini-quiz': lazy(() => import('../ova/OvaGeminiQuiz')),
};

/**
 * Resuelve un componente OVA por su ID
 * @param {string} ovaId
 * @returns {import('react').LazyExoticComponent<import('react').ComponentType>|null}
 */
export function resolveOVA(ovaId) {
  return OVA_MAP[ovaId] || null;
}

/**
 * Lista de IDs de OVA disponibles
 * @returns {string[]}
 */
export function getOVAIds() {
  return Object.keys(OVA_MAP);
}
```

Luego en `ResourceViewerModal/index.jsx`, reemplazar los lazy imports inline y el switch/resolver por `import { resolveOVA } from '../hooks/useOVAResolver'`.

- [ ] **Step 3: Extraer layout components de IALab.jsx**

Crear `src/components/IALab/layout/ModuleView.jsx`:
Extraer toda la sección de renderizado de módulos activos (la lógica entre el sidebar y el main content).

Crear `src/components/IALab/layout/MobileLayout.jsx`:
Extraer la lógica de renderizado mobile (header mobile + overlay menú).

Crear `src/components/IALab/layout/DesktopLayout.jsx`:
Extraer la lógica de renderizado desktop (sidebar + main content).

En `IALab.jsx`, reemplazar las secciones extraídas por imports a los nuevos componentes layout.

- [ ] **Step 4: Verificar build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/IALab/
git commit -m "refactor: split large components - forum filters, OVA resolver, layout views"
```

---

### Task 5: ESLint CI Workflow

**Files:**
- Create: `.github/workflows/lint.yml`

- [ ] **Step 1: Crear workflow ESLint CI**

```yaml
name: Lint

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx eslint src/ --max-warnings 50
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/lint.yml
git commit -m "ci: add ESLint workflow with max 50 warnings"
```

---

### Task 5: Tests — Store + Hooks

**Files:**
- Create: `src/components/IALab/__tests__/ialabStore.test.jsx`
- Create: `src/components/IALab/__tests__/useDeviceType.test.jsx`

- [ ] **Step 1: Crear ialabStore.test.jsx**

```jsx
import { describe, it, expect, beforeEach } from 'vitest';

// We test the store logic directly without rendering
describe('IALab Store', () => {
  let store;

  beforeEach(async () => {
    // Dynamic import to get fresh store each test
    const mod = await import('../../../store/ialabStore');
    store = mod.useIALabStore;
  });

  it('should have initial state with empty modules', () => {
    const state = store.getState();
    expect(state.modules).toEqual([]);
    expect(state.activeModule).toBe(0);
    expect(state.streak).toBeDefined();
    expect(typeof state.getLevel).toBe('function');
  });

  it('should set active module', () => {
    store.getState().setActiveModule(2);
    expect(store.getState().activeModule).toBe(2);
  });

  it('should complete a module and increase streak', () => {
    const initialStreak = store.getState().streak.current;
    store.getState().completeModule('mod1');
    expect(store.getState().completions).toContain('mod1');
  });

  it('getBadgesSummary should return array', () => {
    const badges = store.getState().getBadgesSummary();
    expect(Array.isArray(badges)).toBe(true);
  });

  it('getLevel should return valid level', () => {
    const level = store.getState().getLevel();
    expect(typeof level).toBe('number');
    expect(level).toBeGreaterThanOrEqual(1);
  });
});
```

- [ ] **Step 2: Crear useDeviceType.test.jsx**

```jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeviceType } from '../../../hooks/useDeviceType';

describe('useDeviceType', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
  });

  it('should detect mobile viewport (<768px)', () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));
    const { result } = renderHook(() => useDeviceType());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should detect desktop viewport (>=1024px)', () => {
    window.innerWidth = 1440;
    window.dispatchEvent(new Event('resize'));
    const { result } = renderHook(() => useDeviceType());
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });

  it('should detect tablet viewport (768-1023px)', () => {
    window.innerWidth = 800;
    window.dispatchEvent(new Event('resize'));
    const { result } = renderHook(() => useDeviceType());
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });
});
```

- [ ] **Step 3: Ejecutar tests**

```bash
npx vitest run src/components/IALab/__tests__/ialabStore.test.jsx src/components/IALab/__tests__/useDeviceType.test.jsx
```

- [ ] **Step 4: Commit**

```bash
git add src/components/IALab/__tests__/ialabStore.test.jsx src/components/IALab/__tests__/useDeviceType.test.jsx
git commit -m "test: add store and useDeviceType unit tests"
```

---

### Task 6: Tests — Shared Components

**Files:**
- Create: `src/components/IALab/__tests__/TouchableIcon.test.jsx`
- Create: `src/components/IALab/__tests__/EmptyState.test.jsx`
- Create: `src/components/IALab/__tests__/SectionErrorBoundary.test.jsx`
- Create: `src/components/IALab/__tests__/ToastNotification.test.jsx`

- [ ] **Step 1: Crear TouchableIcon.test.jsx**

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TouchableIcon } from '../shared/TouchableIcon';

describe('TouchableIcon', () => {
  it('renders with aria-label', () => {
    render(<TouchableIcon icon="fa-search" label="Buscar" onClick={() => {}} />);
    expect(screen.getByLabelText('Buscar')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<TouchableIcon icon="fa-x" label="Cerrar" onClick={onClick} />);
    fireEvent.click(screen.getByLabelText('Cerrar'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has min 44px touch target classes', () => {
    render(<TouchableIcon icon="fa-search" label="Buscar" onClick={() => {}} />);
    const btn = screen.getByLabelText('Buscar');
    expect(btn.className).toContain('min-w-[44px]');
    expect(btn.className).toContain('min-h-[44px]');
  });
});
```

- [ ] **Step 2: Crear EmptyState.test.jsx**

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../shared/EmptyState';

describe('EmptyState', () => {
  it('renders message', () => {
    render(<EmptyState message="No hay datos" />);
    expect(screen.getByText('No hay datos')).toBeInTheDocument();
  });

  it('renders action button when actionLabel provided', () => {
    const onClick = vi.fn();
    render(<EmptyState message="Vacío" actionLabel="Crear" onAction={onClick} />);
    fireEvent.click(screen.getByText('Crear'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not render button when no actionLabel', () => {
    render(<EmptyState message="Vacío" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
```

- [ ] **Step 3: Crear SectionErrorBoundary.test.jsx**

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionErrorBoundary } from '../SectionErrorBoundary';

describe('SectionErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <SectionErrorBoundary sectionName="test">
        <div>Contenido normal</div>
      </SectionErrorBoundary>
    );
    expect(screen.getByText('Contenido normal')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Crear ToastNotification.test.jsx**

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastNotification } from '../shared/ToastNotification';

describe('ToastNotification', () => {
  it('renders toast message', () => {
    render(<ToastNotification toast={{ message: 'Éxito', type: 'success' }} onDismiss={() => {}} />);
    expect(screen.getByText('Éxito')).toBeInTheDocument();
  });

  it('calls onDismiss when close button clicked', () => {
    const onDismiss = vi.fn();
    render(<ToastNotification toast={{ message: 'Test', type: 'info' }} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('returns null when no toast', () => {
    const { container } = render(<ToastNotification toast={null} onDismiss={() => {}} />);
    expect(container.innerHTML).toBe('');
  });
});
```

- [ ] **Step 5: Ejecutar tests**

```bash
npx vitest run src/components/IALab/__tests__/
```

- [ ] **Step 6: Commit**

```bash
git add src/components/IALab/__tests__/
git commit -m "test: add shared component unit tests (TouchableIcon, EmptyState, ErrorBoundary, Toast)"
```

---

### Task 7: Build Verification

- [ ] **Step 1: Build**

```bash
npm run build
```

- [ ] **Step 2: Ejecutar todos los tests**

```bash
npx vitest run
```

- [ ] **Step 3: Commit final**

```bash
git add -A
git commit -m "chore: code quality improvements complete"
```
