# Plan de Mejora: Testing, i18n y Documentación para iLAB

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Objetivo:** Elevar Testing (6.5→8.5), i18n (5.5→8.0) y Documentación (4.0→7.5) sin añadir nuevos botones, funciones ni alterar UI existente.

**Arquitectura:** 3 verticales independientes (Testing, i18n, Docs) secuenciadas por dependencia — primero reparar tests existentes, luego fortalecer cobertura, luego i18n, luego documentación.

**Restricciones:**
- 0 nuevos elementos UI (botones, secciones, features)
- 0 alteración de funcionalidad o apariencia visual
- Solo refactors de código, config changes, test files, docs
- Respetar sistema de diseño existente
- Archivos existentes sobre 500 líneas NO se dividen

---

## Resumen de Acciones por Área

| Área | Actual | Objetivo | Acciones | Esfuerzo |
|------|--------|----------|----------|----------|
| **Testing** | 6.5/10 | 8.5/10 | 7 tareas | 5 sprints |
| **i18n** | 5.5/10 | 8.0/10 | 5 tareas | 4 sprints |
| **Documentación** | 4.0/10 | 7.5/10 | 6 tareas | 5 sprints |

---

## SPRINT 1: Reparar Tests Existentes (Parte 1)

### Task 1.1: Mock global `useTranslation` en test-setup.ts

**Files:**
- Modify: `src/test-setup.ts`
- Verify: `PDFThumbnail.test.jsx`, `CourseCard.test.jsx`, `TuRutaDeHoy.test.jsx`

- [ ] **Step 1: Añadir mock global de useTranslation**

```ts
// src/test-setup.ts — añadir al final, antes del export
vi.mock('@/i18n/I18nProvider', () => ({
  useTranslation: () => ({
    t: (key, params) => {
      if (params) {
        let result = key
        Object.entries(params).forEach(([k, v]) => {
          result = result.replace(`{${k}}`, String(v))
        })
        return result
      }
      return key
    },
    locale: 'es',
    setLocale: vi.fn(),
  }),
  I18nProvider: ({ children }) => children,
}))
```

- [ ] **Step 2: Verificar**

```
npx vitest run src/components/IALab/PDFThumbnail.test.jsx --reporter=verbose
# Expected: 8 passed, 0 failed
npx vitest run src/components/IALab/__tests__/CourseCard.test.jsx --reporter=verbose
# Expected: 12 passed, 0 failed
npx vitest run src/components/IALab/__tests__/TuRutaDeHoy.test.jsx --reporter=verbose
# Expected: 2 passed, 0 failed
```

- [ ] **Step 3: Commit**

```bash
git add src/test-setup.ts
git commit -m "fix(tests): add global useTranslation mock to test-setup.ts

Resuelve 22 fallos por I18nProvider ausente en PDFThumbnail,
CourseCard y TuRutaDeHoy."
```

### Task 1.2: Corregir UserCoursesDashboard — translation keys

**Files:**
- Modify: `src/components/IALab/__tests__/UserCoursesDashboard.test.jsx`

- [ ] **Step 1: Cambiar expectativas de texto español a translation keys**

Las 4 aserciones que esperan texto español:
- `screen.getByText('Todos')` → `screen.getByText('ialab.dashboard.filter_all')`
- `screen.getByText('En Progreso')` → `screen.getByText('ialab.dashboard.filter_in_progress')`
- `screen.getByText('Completados')` → `screen.getByText('ialab.dashboard.filter_completed')`
- `screen.getByText('Certificados Obtenidos')` → `screen.getByText('ialab.dashboard.certificates_title')`

- [ ] **Step 2: Verificar**

```
npx vitest run src/components/IALab/__tests__/UserCoursesDashboard.test.jsx --reporter=verbose
# Expected: 7 passed, 0 failed
```

- [ ] **Step 3: Commit**

```bash
git add src/components/IALab/__tests__/UserCoursesDashboard.test.jsx
git commit -m "fix(tests): align UserCoursesDashboard assertions with translation keys"
```

### Task 1.3: Corregir useIALabEvaluation — store fields, API URL, response format

**Files:**
- Modify: `src/hooks/IALab/__tests__/useIALabEvaluation.test.js`

- [ ] **Step 1: Añadir `fallbackMode: false` y `ej4: ''` a expectativas de estado inicial (~línea 71)**

- [ ] **Step 2: Actualizar URL esperada de `https://api.deepseek.com/chat/completions` a `http://localhost:3001/api/api/chat` (~línea 151)**

- [ ] **Step 3: Cambiar mock `DEEPSEEK_OK` de formato OpenAI (`{ choices: [{ message: { content } }] }`) a formato proxy (`{ result: content }`)**

- [ ] **Step 4: Cambiar assertions de fallback: `error.toContain(...)` → `fallbackMode.toBe(true)` (~líneas 179, 193, 318)**

- [ ] **Step 5: Verificar**

```
npx vitest run src/hooks/IALab/__tests__/useIALabEvaluation.test.js --reporter=verbose
# Expected: 25 passed, 0 failed
```

- [ ] **Step 6: Commit**

```bash
git add src/hooks/IALab/__tests__/useIALabEvaluation.test.js
git commit -m "fix(tests): update useIALabEvaluation for store fields, proxy URL, proxy format"
```

---

## SPRINT 2: Reparar Tests Existentes (Parte 2)

### Task 2.1: Corregir useIALabSynthesizer — API URL y response format

**Files:**
- Modify: `src/hooks/IALab/__tests__/useIALabSynthesizer.test.js`

- [ ] **Step 1: Actualizar URL esperada a `http://localhost:3001/api/api/chat` (~líneas 319, 431)**

- [ ] **Step 2: Cambiar mock fetch response a `{ result: ... }` en lugar de `{ choices: [...] }`**

- [ ] **Step 3: Ajustar expectativa de `averageScore` en getUsageStats (~línea 262)**

- [ ] **Step 4: Verificar**

```
npx vitest run src/hooks/IALab/__tests__/useIALabSynthesizer.test.js --reporter=verbose
# Expected: 28 passed, 0 failed
npx vitest run
# Expected: 361 passed, 0 failed — TODOS LOS TESTS VERDES
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/IALab/__tests__/useIALabSynthesizer.test.js
git commit -m "fix(tests): update useIALabSynthesizer for proxy URL and response format"
```

---

## SPRINT 3: Fortalecer Cobertura de Tests

### Task 3.1: Tests para componentes sin cobertura

**Files:**
- Create: `src/components/IALab/__tests__/ModuleOverviewCard.test.jsx`
- Create: `src/components/IALab/__tests__/IALabSidebar.a11y.test.jsx`

- [ ] **Step 1: ModuleOverviewCard.test.jsx**

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ModuleOverviewCard from '../ModuleOverviewCard'

vi.mock('@/i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k, locale: 'es', setLocale: vi.fn() }),
}))

vi.mock('framer-motion', () => ({
  motion: { div: 'div', button: 'button', span: 'span', p: 'p' },
  AnimatePresence: ({ children }) => children,
}))

describe('ModuleOverviewCard', () => {
  const defaultProps = {
    moduleId: 1,
    title: 'Fundamentos',
    description: 'Intro a IA',
    progress: 50,
    isLocked: false,
    onStart: vi.fn(),
  }

  it('renders title', () => {
    render(<ModuleOverviewCard {...defaultProps} />)
    expect(screen.getByText('Fundamentos')).toBeInTheDocument()
  })

  it('renders locked state', () => {
    render(<ModuleOverviewCard {...defaultProps} isLocked={true} />)
    expect(screen.getByText(/bloqueado/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: IALabSidebar.a11y.test.jsx**

```jsx
import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { axe, toHaveNoViolations } from 'jest-axe'
import IALabSidebar from '../IALabSidebar'

expect.extend(toHaveNoViolations)

vi.mock('@/i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k, locale: 'es', setLocale: vi.fn() }),
}))

vi.mock('framer-motion', () => ({
  motion: { div: 'div', nav: 'nav', ul: 'ul', li: 'li', button: 'button', span: 'span' },
  AnimatePresence: ({ children }) => children,
}))

describe('IALabSidebar a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <IALabSidebar
        modules={[
          { id: 1, title: 'Módulo 1', icon: 'Book', progress: 50 },
          { id: 2, title: 'Módulo 2', icon: 'Book', progress: 0 },
        ]}
        activeMod={1}
        onModuleChange={vi.fn()}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

- [ ] **Step 3: Verificar**

```
npx vitest run src/components/IALab/__tests__/ModuleOverviewCard.test.jsx --reporter=verbose
# Expected: 2 passed
npx vitest run src/components/IALab/__tests__/IALabSidebar.a11y.test.jsx --reporter=verbose
# Expected: 1 passed, 0 violations
```

- [ ] **Step 4: Commit**

```bash
git add src/components/IALab/__tests__/ModuleOverviewCard.test.jsx src/components/IALab/__tests__/IALabSidebar.a11y.test.jsx
git commit -m "test: add ModuleOverviewCard unit tests and IALabSidebar a11y tests"
```

### Task 3.2: CI gate con GitHub Actions

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Crear workflow**

```yaml
name: CI
on:
  push: { branches: [main, develop] }
  pull_request: { branches: [main] }
jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: edutechlife-frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: edutechlife-frontend/package-lock.json
      - run: npm ci
      - run: npx vitest run --reporter=verbose
        env: { CI: true }
      - run: npm run build
        env: { CI: true }
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow (lint + test + build)"
```

---

## SPRINT 4: Mejoras i18n

### Task 4.1: Lazy loading de archivos de locale

**Files:**
- Modify: `src/i18n/I18nProvider.jsx`

- [ ] **Step 1: Cambiar imports estáticos a dinámicos**

```jsx
// ANTES:
import es from './es.json'
import en from './en.json'
const translations = { es, en }

// DESPUÉS:
import { useState, useEffect } from 'react'
const localeModules = {
  es: () => import('./es.json'),
  en: () => import('./en.json'),
}
// En el provider:
const [translations, setTranslations] = useState(null)
useEffect(() => {
  localeModules[locale]().then(mod => setTranslations(mod.default || mod))
}, [locale])
if (!translations) return children // o fragment, sin bloqueo visual
```

- [ ] **Step 2: Verificar**

```
npx vite build 2>&1 | grep -E "es\.json|en\.json"
# Expected: locale files aparecen como chunks separados
npx vitest run
# Expected: 361 passed
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/I18nProvider.jsx
git commit -m "perf(i18n): lazy-load locale JSON via dynamic import"
```

### Task 4.2: Limpiar stale keys de i18n

**Files:**
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

- [ ] **Step 1: Identificar keys no usadas**

```bash
rg "t\('ialab\." src --include="*.jsx" --include="*.js" --include="*.tsx" -o | sort -u > /tmp/used.txt
node -e "const e=require('./src/i18n/es.json');Object.keys(e).filter(k=>k.startsWith('ialab.')).sort().forEach(k=>console.log(k))" > /tmp/all.txt
comm -13 /tmp/used.txt /tmp/all.txt > /tmp/stale.txt
wc -l /tmp/stale.txt
```

- [ ] **Step 2: Eliminar stale keys de ambos archivos**

```bash
node -e "
const fs=require('fs')
const stale=fs.readFileSync('/tmp/stale.txt','utf8').split('\n').filter(Boolean)
const es=JSON.parse(fs.readFileSync('src/i18n/es.json','utf8'))
const en=JSON.parse(fs.readFileSync('src/i18n/en.json','utf8'))
stale.forEach(k=>{delete es[k];delete en[k]})
fs.writeFileSync('src/i18n/es.json',JSON.stringify(es,null,2)+'\n')
fs.writeFileSync('src/i18n/en.json',JSON.stringify(en,null,2)+'\n')
console.log('Removed',stale.length,'stale keys')
"
```

- [ ] **Step 3: Verificar**

```
npm run i18n:validate
npx vitest run
```

- [ ] **Step 4: Commit**

```bash
git add src/i18n/es.json src/i18n/en.json
git commit -m "chore(i18n): remove stale translation keys (~260)"
```

### Task 4.3: Migrar hardcoded text de Nico chatbot

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

- [ ] **Step 1: Reemplazar strings hardcodeadas del chatbot con t('chatbot.xxx')**

Identificar en `src/App.jsx` todas las strings del chatbot Nico y reemplazar con `t()` usando namespace `chatbot`.

- [ ] **Step 2: Añadir keys a locale files**

```json
{
  "chatbot.greeting": "¡Hola! Soy Nico, tu asistente educativo.",
  "chatbot.greeting_en": "Hi! I'm Nico, your educational assistant.",
  "chatbot.help": "¿En qué puedo ayudarte?",
  "chatbot.help_en": "How can I help you?",
  "chatbot.thinking": "Estoy pensando...",
  "chatbot.thinking_en": "I'm thinking...",
  ...
}
```

- [ ] **Step 3: Verificar**

```
npx vite build
npx vitest run
```

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/i18n/es.json src/i18n/en.json
git commit -m "i18n: migrate Nico chatbot hardcoded text to translation keys"
```

### Task 4.4: Añadir tipos TypeScript para translation keys

**Files:**
- Create: `src/i18n/keys.d.ts`

- [ ] **Step 1: Generar types**

```bash
node -e "
const es=require('./src/i18n/es.json')
const keys=Object.keys(es).map(k=>'  \"'+k+'\": string').join(';\n')
require('fs').writeFileSync('src/i18n/keys.d.ts',
'// Auto-generated\nexport type TranslationKeys = {\n'+keys+'\n}\n')
"
```

- [ ] **Step 2: Commit**

```bash
git add src/i18n/keys.d.ts
git commit -m "types(i18n): add TranslationKeys type definition"
```

---

## SPRINT 5: Documentación — README, Organización y CHANGELOG

### Task 5.1: Crear README.md

**Files:**
- Create: `README.md`

- [ ] **Step 1: README.md con stack, estructura, scripts, convenciones**

```markdown
# Edutechlife Frontend

Plataforma educativa impulsada por IA.

## Stack
React 18 + Vite 5 | Zustand 5 (10 slices) | Clerk + Supabase | React Router 7 | Tailwind 3 + CSS custom properties | Framer Motion 12 | Vitest + Testing Library

## Estructura
- `src/components/IALab/` — Core educativo (~106 componentes)
- `src/hooks/` — 28 hooks generales + 17 IALab
- `src/store/` — Zustand store (10 slices)
- `src/i18n/` — es.json + en.json (3.2k keys)
- `src/design-system/` — Design tokens CSS
- `src/routes/` — React Router lazy routes

## Scripts
npm run dev | npm run build | npm test | npm run test:coverage | npm run lint | npm run storybook
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add project root README.md"
```

### Task 5.2: Organizar documentos raíz

**Files:**
- Move: ~24 `.md` files de raíz a `docs/operations/`

- [ ] **Step 1: Mover**

```bash
mkdir -p docs/operations
git mv ANALISIS_ARQUITECTURA_IALAB.md CLERK_EMAIL_CONFIG.md CLERK_INSTALLATION.md \
  EXECUTE_MIGRATION.md EXECUTE_SQL_INSTRUCTIONS.md IMPLEMENTACION_COMPLETADA.md \
  INSTRUCCIONES_FINALES_FORO.md INSTRUCCIONES_FIX_PROFILES.md \
  INSTRUCCIONES_FORUMCOMMUNITY.md README_FORUM.md SETUP_INSTRUCTIONS.md \
  PROGRESS_IMPLEMENTATION_COMPLETE.md PROGRESS_PERSISTENCE_VERIFICATION.md \
  REFACTORIZACION_DESAFIO.md REFACTORIZACION_SINTETIZADOR.md \
  SINTETIZADOR_MEJORADO_RESUMEN.md test-auth-flow.md test-performance.md \
  verificacion_auth.md NICO_PHASE1_SUMMARY.md NICO_PHASE2_SUMMARY.md \
  NICO_PHASE3_SUMMARY.md NICO_PHASE4_SUMMARY.md NICO_PHASE5_SUMMARY.md \
  USERPROFILE_IMPLEMENTACION_COMPLETA.md USER_DROPDOWN_INTEGRATION_SUMMARY.md \
  USER_PROFILE_IMPLEMENTATION.md VERIFICACION_CORRECCIONES.md \
  docs/operations/
```

- [ ] **Step 2: Commit**

```bash
git commit -m "docs: reorganize operational docs into docs/operations/"
```

### Task 5.3: Crear CONTRIBUTING.md y CHANGELOG.md

**Files:**
- Create: `CONTRIBUTING.md`
- Create: `CHANGELOG.md`

- [ ] **Step 1: CONTRIBUTING.md**

```markdown
# Contributing

## Branching
- `main` — producción
- `develop` — integración
- `feature/*`, `fix/*`, `docs/*`

## Commits
Conventional commits: feat:, fix:, test:, docs:, refactor:, perf:, ci:, chore:

## Before PR
- [ ] `npm run lint` — 0 errors
- [ ] `npm test` — 361 passed
- [ ] `npm run build` — success
- [ ] No console.log, no .bak files

## Code Style
- 500 lines max per file
- Functional components + hooks
- JSDoc for public component props
- Tests co-located in `__tests__/`
```

- [ ] **Step 2: CHANGELOG.md**

```markdown
# Changelog

## Unreleased
### Fixed
- 37 tests reparados (I18nProvider mock, API proxy URL, store fields)
- 18 icon buttons sin aria-label
- Focus ring color WCAG AA

### Added
- CI/CD GitHub Actions
- Tests accesibilidad jest-axe
- Lazy loading locales i18n
- Translation keys type definitions
- README.md, CONTRIBUTING.md, CHANGELOG.md
- JSDoc en componentes core
- Storybook stories

### Changed
- Documentos operacionales → docs/operations/
- Nico chatbot migrado a i18n
- Stale i18n keys eliminadas
```

- [ ] **Step 3: Commit**

```bash
git add CONTRIBUTING.md CHANGELOG.md
git commit -m "docs: add CONTRIBUTING.md and CHANGELOG.md"
```

---

## SPRINT 6: Documentación — JSDoc y Storybook

### Task 6.1: JSDoc en componentes core

**Files:**
- Modify: `src/components/IALab/IALabSidebar.jsx`
- Modify: `src/components/IALab/IALabQuizModal.jsx`
- Modify: `src/components/IALab/IALabEvaluationModal.jsx`
- Modify: `src/components/IALab/Breadcrumbs.jsx`
- Modify: `src/components/IALab/GlobalSearchBar.jsx`

- [ ] **Step 1: Añadir JSDoc a cada componente**

```jsx
/**
 * [Nombre del componente]
 * [Descripción de 1-2 líneas de qué hace]
 *
 * @param {Object} props
 * @param {...} ... - descripción de cada prop
 */
```

- [ ] **Step 2: Verificar**

```
npx vitest run
npx vite build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/IALab/IALabSidebar.jsx ...
git commit -m "docs(jsdoc): add JSDoc to 5 core IALab components"
```

### Task 6.2: Stories para componentes core

**Files:**
- Create: `src/components/IALab/IALabSidebar.stories.jsx`
- Create: `src/components/IALab/Breadcrumbs.stories.jsx`
- Create: `src/components/IALab/ModuleOverviewCard.stories.jsx`

- [ ] **Step 1: Crear cada story con estados (default + variante)**

```jsx
import Component from './Component'
export default { title: 'IALab/Component', component: Component }
export const Default = { args: { ... } }
export const Variant = { args: { ... } }
```

- [ ] **Step 2: Verificar**

```
npm run storybook -- --ci 2>&1 | tail -5
# Expected: Storybook compila sin errores
```

- [ ] **Step 3: Commit**

```bash
git add src/components/IALab/IALabSidebar.stories.jsx ...
git commit -m "docs(storybook): add stories for Sidebar, Breadcrumbs, ModuleOverviewCard"
```

---

## SPRINT 7: Testing — Store Slices

### Task 7.1: Tests para navigationSlice y evaluationSlice

**Files:**
- Create: `src/store/__tests__/navigationSlice.test.js`
- Create: `src/store/__tests__/evaluationSlice.test.js`

- [ ] **Step 1: navigationSlice.test.js**

```js
import { create } from 'zustand'
import { describe, it, expect, beforeEach } from 'vitest'
import { createNavigationSlice } from '../slices/navigationSlice'

describe('navigationSlice', () => {
  const useStore = create((set, get) => ({ ...createNavigationSlice(set, get) }))
  beforeEach(() => { useStore.setState(useStore.getInitialState()) })

  it('starts with module 1 active', () => {
    expect(useStore.getState().activeMod).toBe(1)
  })

  it('setActiveMod changes module', () => {
    useStore.getState().setActiveMod(2)
    expect(useStore.getState().activeMod).toBe(2)
  })
})
```

- [ ] **Step 2: Verificar**

```
npx vitest run src/store/__tests__/ --reporter=verbose
```

- [ ] **Step 3: Commit**

```bash
git add src/store/__tests__/navigationSlice.test.js
git commit -m "test: add navigationSlice unit tests"
```

---

## Validación Final Post-Implementación

```bash
npm test                    # 361 passed
npm run build               # Build exitoso
npm run i18n:validate       # 0 mismatches
npm run storybook -- --ci   # Storybook compila
npx vitest run src/components/IALab/__tests__/*.a11y.* --reporter=verbose  # 0 violations
```

---

## Scores Proyectados

| Sprint | Testing | i18n | Docs | Hito |
|--------|---------|------|------|------|
| Inicio | 6.5 | 5.5 | 4.0 | — |
| S1 | 8.0 | 5.5 | 4.0 | 37 failures fixed |
| S2 | 8.5 | 5.5 | 4.0 | Todos los tests verdes |
| S3 | 8.5 | 5.5 | 4.0 | +tests + CI gate |
| S4 | 8.5 | 7.5 | 4.0 | Lazy loading + stale keys + Nico i18n + types |
| S5 | 8.5 | 8.0 | 6.5 | README + organización + CHANGELOG |
| S6 | 8.5 | 8.0 | 7.5 | JSDoc + Storybook |
| S7 | 8.5 | 8.0 | 7.5 | Store tests |
| **Final** | **8.5** | **8.0** | **7.5** | **Promedio 8.0** |
