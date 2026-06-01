# Plan de Mejora: Performance, Seguridad y Mantenibilidad — IALab

**Fecha:** 2026-05-31
**Objetivo:** Subir Performance 7.5→8.5, Seguridad 7.5→8.5, Mantenibilidad 7.0→8.5
**Restricción:** Sin nuevas secciones, sin nuevos botones, sin alterar funcionalidad existente

---

## SPRINT 1: Performance — Bundle Size & Code Splitting

### Task 1.1: Fix manualChunks en vite.config.js

**Problema:** El chunk `react-vendor` tiene solo 76 bytes porque `manualChunks` con array no resuelve correctamente. React/ReactDOM terminan dentro del bundle principal de 584KB.

**Archivo:** `vite.config.js` (línea 90-91)

**Cambio:** Reemplazar array estático por función resolver-based:

```js
manualChunks(id) {
  if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
    return 'react-vendor';
  }
  if (id.includes('node_modules/framer-motion/') || id.includes('node_modules/lucide-react/') || id.includes('node_modules/canvas-confetti/')) {
    return 'animation-vendor';
  }
  if (id.includes('node_modules/recharts/')) {
    return 'charts-vendor';
  }
  if (id.includes('node_modules/html2pdf.js/') || id.includes('node_modules/jspdf/')) {
    return 'pdf-vendor';
  }
}
```

**Verificación:** `npm run build` → revisar que `react-vendor` contenga ~120KB y que `index-*.js` se reduzca de 584KB a ~460KB.

---

### Task 1.2: Lazy-load componentes pesados en IALab.jsx

**Problema:** IALab.jsx importa 30+ componentes estáticamente. Solo 1 (IALabForumOptimized) usa lazy().

**Archivo:** `src/components/IALab/IALab.jsx` (líneas 15-56)

**Cambio:** Convertir a lazy() los componentes que no están visibles inmediatamente al montar:

| Componente | Líneas | ¿Está en viewport inicial? | lazy? |
|-----------|--------|---------------------------|-------|
| ModuleOverviewCard | 637 | No (scroll) | ✅ Sí |
| RecommendationsPanel | 112 | No (scroll) | ✅ Sí |
| DailyChallenges | ~100 | No (scroll) | ✅ Sí |
| ModuleActions | ~150 | No (scroll) | ✅ Sí |
| ToolTutorAccordion | ~200 | No (scroll) | ✅ Sí |
| IALabTour | ~150 | Solo 1 vez | ✅ Sí |
| AchievementToast | ~80 | Condicional | ✅ Sí |

**NO lazy (siempre visibles):** IALabSidebar, IALabHeader, Breadcrumbs, OfflineBanner, ValerioFloatingButton, GlobalSearchBar, MobileMenuOverlay, TabPills, AnimatedSection, A11yProvider, IALabModuleHeader, ModuleInfoSection, IALabModals, TuRutaDeHoy.

```jsx
const ModuleOverviewCard = lazy(() => import('./ModuleOverviewCard'));
const RecommendationsPanel = lazy(() => import('./RecommendationsPanel'));
const DailyChallenges = lazy(() => import('./DailyChallenges'));
const ModuleActions = lazy(() => import('./ModuleActions'));
const ToolTutorAccordion = lazy(() => import('./ToolTutorAccordion'));
const IALabTour = lazy(() => import('./IALabTour'));
const AchievementToast = lazy(() => import('./AchievementToast'));
```

**Verificación:** `npm run build` → chunk `IALab-*.js` debe reducirse de 224KB a ~160KB. Nuevos chunks aparecen para cada componente lazy.

---

### Task 1.3: Eliminar `import React` innecesario

**Problema:** 30+ componentes usan `import React` que es innecesario con Vite + `jsxRuntime: "automatic"`.

**Archivos:** Buscar y eliminar en todos los .jsx/.js bajo `src/components/IALab/` y `src/hooks/IALab/`.

```bash
# Buscar archivos con 'import React' que no usen React.* (createContext, etc.)
grep -rl "^import React" src/components/IALab/ src/hooks/IALab/
```

**Cambio:** Eliminar la línea en cada archivo que solo la usa para JSX.

**Verificación:** `npm test` + `npm run build` — no debe cambiar nada funcional.

---

## SPRINT 2: Performance — Memoización y Re-renders

### Task 2.1: React.memo + useCallback en IALabSynthesizer.jsx

**Problema:** 723 líneas, 0 useCallback, 0 React.memo, 4 inline arrow functions en render que crean nuevos closures cada vez.

**Archivo:** `src/components/IALab/IALabSynthesizer.jsx`

**Cambios:**
1. Envolver el componente con `React.memo()` en la exportación
2. Envolver handlers con `useCallback`:
   - `handleOptimize` (línea 54)
   - `handleKeyDown` (línea 64)
   - `handleNewGeneration` (línea 72)
   - `handleSuggestionClick` (línea 78)
3. Reemplazar inline arrow functions en `.map()` por funciones nombradas o memoizadas

**Verificación:** `npm test` + revisar que no haya regresiones funcionales.

---

### Task 2.2: React.memo + useCallback en IALabForumSection.jsx

**Problema:** 651 líneas, 0 useCallback, 0 React.memo.

**Archivo:** `src/components/IALab/IALabForumSection.jsx`

**Cambios:**
1. Envolver con `React.memo()`
2. Envolver handlers principales con `useCallback`
3. Reemplazar `{[1, 2, 3].map(...)}` inline por constante fuera del render

**Verificación:** `npm test`

---

### Task 2.3: useCallback en IALabForumOptimized.jsx

**Problema:** 496 líneas, 0 useCallback, 0 React.memo.

**Archivo:** `src/components/IALab/IALabForumOptimized.jsx`

**Cambios:**
1. Envolver con `React.memo()`
2. Envolver handlers con `useCallback`

**Verificación:** `npm test`

---

### Task 2.4: useCallback en IALabEvaluationResults.jsx

**Problema:** 560 líneas, sin useCallback/React.memo.

**Archivo:** `src/components/IALab/IALabEvaluationResults.jsx`

**Cambios:**
1. Envolver con `React.memo()`
2. Envolver handlers con `useCallback`

**Verificación:** `npm test`

---

## SPRINT 3: Performance — Data Layer y Estilos

### Task 3.1: Extraer inline styles de Footer (postergado)

**Problema:** Footer.jsx tiene 277 inline `style={{}}` objects que se recrean en cada render.

**Archivo:** `src/components/Footer.jsx`

**Nota:** Footer no es parte de IALab, pero impacta el bundle general. Las 277 instancias están distribuidas en sus 1,561 líneas.

**Cambio:** Extraer los 10 estilos más repetidos a constantes fuera del componente:
```jsx
const SECTION_STYLE = { background: '#1a1a2e', position: 'relative' };
const LINK_STYLE = { color: '#00b4d8', textDecoration: 'none' };
```

**Verificación:** `npm test` + `npm run build` — sin cambios funcionales.

---

### Task 3.2: Namespace CSS para evitar colisiones con Tailwind

**Problema:** `IALab.css` (212 líneas) usa nombres `.animate-*` que chocan con Tailwind.

**Archivo:** `src/components/IALab/IALab.css`

**Cambio:** Renombrar clases `.animate-*` a `.ialab-animate-*`:
- `.animate-fade-in` → `.ialab-animate-fade-in`
- `.animate-shimmer-pulse` → `.ialab-animate-shimmer-pulse`
- `.animate-in` → `.ialab-animate-in`
- `.button-pulse` → `.ialab-button-pulse`

**Verificación:** `npm test` — si algún test referencia estas clases, actualizar.

---

## SPRINT 4: Seguridad — Crítico

### Task 4.1: Agregar Content Security Policy (CSP)

**Problema:** Sin CSP, la app no tiene defensa contra XSS.

**Archivo:** `index.html`

**Cambio:** Agregar `<meta>` CSP tag:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://clerk.edutechlife.com https://accounts.clerk.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://*.supabase.co https://*.clerk.com;
  font-src 'self';
  frame-src 'self' https://www.youtube.com;
">
```

**Verificación:** Cargar la app en navegador, abrir consola → sin errores de CSP.

---

### Task 4.2: Sanitizar dangerouslySetInnerHTML con DOMPurify

**Problema:** `AIPanel.jsx` usa `dangerouslySetInnerHTML` con fallback no sanitizado cuando `window.marked` no existe.

**Archivo:** `src/components/AIPanel.jsx` (línea 263)

**Cambio:** Siempre aplicar DOMPurify.sanitize(), sin importar si `window.marked` existe:

```jsx
// Antes:
window.marked ? DOMPurify.sanitize(window.marked.parse(displayedRes)) : displayedRes

// Después:
const sanitized = window.marked
  ? DOMPurify.sanitize(window.marked.parse(displayedRes))
  : DOMPurify.sanitize(displayedRes)
```

Análogamente en la línea 167-184 (PDF generation vía innerHTML):
```jsx
// Antes:
container.innerHTML = window.marked.parse(res);

// Después:
if (window.marked) {
  container.innerHTML = DOMPurify.sanitize(window.marked.parse(res));
} else {
  container.innerHTML = DOMPurify.sanitize(res);
}
```

**Verificación:** `npm test` + revisar que `dompurify` esté en `package.json`.

---

### Task 4.3: Agregar marked y dompurify a package.json

**Problema:** `dompurify` se importa en `AIPanel.jsx` pero no está en `package.json`. `marked` se usa vía `window.marked` (CDN) sin estar en dependencias.

**Archivos:** `package.json`, `AIPanel.jsx`

**Cambio:**
```bash
npm install marked dompurify
```

Luego en `AIPanel.jsx`:
```jsx
import { marked } from 'marked';
// ... en vez de window.marked.parse(), usar:
marked.parse(res)
```

**Verificación:** `npm run build` + revisar que no aparezcan errores de módulo faltante.

---

### Task 4.4: Sanitizar input de foro

**Problema:** Los posts y comentarios del foro se guardan sin sanitización. `useIALabForum.js` inserta `title`, `content`, `tags` directamente.

**Archivo:** `src/hooks/IALab/useIALabForum.js`

**Cambio:** Agregar sanitización antes de enviar a Supabase:

```jsx
import DOMPurify from 'dompurify';

// Antes de insertar:
const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: ['b', 'i', 'u', 'a', 'p', 'br'] });
const sanitizedTitle = DOMPurify.sanitize(title, { ALLOWED_TAGS: [] });
```

**Verificación:** `npm test`

---

### Task 4.5: Rate limiting en envío de foro

**Problema:** Sin rate limiting, un bot puede spamear el foro.

**Archivo:** `src/components/IALab/forum/IALabForumCreatePost.jsx`

**Cambio:** Agregar debounce + cooldown:

```jsx
const [lastSubmit, setLastSubmit] = useState(0);
const COOLDOWN_MS = 5000;

const handleSubmit = useCallback(async () => {
  const now = Date.now();
  if (now - lastSubmit < COOLDOWN_MS) return;
  setLastSubmit(now);
  // ... submit logic
}, [lastSubmit]);
```

Análogamente en componentes de comentarios.

**Verificación:** `npm test`

---

## SPRINT 5: Seguridad — Data & Auth

### Task 5.1: Agregar .env y .env.local a .gitignore

**Problema:** `.env` y `.env.local` están commiteados con claves reales.

**Archivo:** `.gitignore`

**Cambio:** Verificar que existan:
```
.env
.env.local
.env.*.local
```

Luego remover del tracking:
```bash
git rm --cached .env .env.local
```

**Verificación:** `git status` — archivos ya no trackeados.

---

### Task 5.2: Remover fallback hardcodeado de supabase.js

**Problema:** `src/lib/supabase.js` tiene valores hardcodeados como fallback.

**Archivo:** `src/lib/supabase.js` (líneas 4-5)

**Cambio:** Eliminar los fallbacks hardcodeados. Si la variable de entorno no existe, lanzar error en lugar de usar valor default inseguro:

```jsx
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
```

**Verificación:** `npm test`

---

## SPRINT 6: Mantenibilidad — Documentación

### Task 6.1: Actualizar ARCHITECTURE.md (3 archivos)

**Problema:** Los 3 ARCHITECTURE.md están severamente desactualizados.

**Archivos:**
- `src/components/IALab/ARCHITECTURE.md`
- `src/hooks/IALab/ARCHITECTURE.md`
- `src/store/ARCHITECTURE.md`

**Cambios requeridos:**

**`src/components/IALab/ARCHITECTURE.md`:**
- Eliminar referencias a `IALabVistaPrincipal.jsx` y `SharedComponents.jsx` (no existen)
- Actualizar línea ResourceViewerModal: 476 en vez de 1029
- Actualizar IALabQuizModal: 411 en vez de 697
- Eliminar regla #1 (NO store directo) — 29 componentes la violan, es la práctica real
- Agregar regla: "Componentes acceden al store directamente con selectores granulares. IALabContext existe como wrapper para casos específicos."
- Agregar barrel export info: `shared/`, `forum/` tienen index.js. IALab root NO tiene barrel export.

**`src/hooks/IALab/ARCHITECTURE.md`:**
- Actualizar useIALabEvaluation: 788 en vez de 417
- Actualizar useIALabQuiz: 353 en vez de 934
- Actualizar cobertura de tests: antes "solo 1/11 con tests", ahora "11/15 con tests"
- Agregar hooks sin tests: useCelebrationEffects, useIdlePause, usePullToRefresh, useSoundEffects, useSwipeNavigation

**`src/store/ARCHITECTURE.md`:**
- Actualizar de "6 slices" a "10 slices"
- Listar los 10: certificate, evaluation, gamification, lesson, navigation, persistence, progress, seguridad, synthesizer, ui
- Actualizar líneas de cada slice

**Verificación:** `npm test` (solo docs, no afecta tests)

---

### Task 6.2: Crear barrel export raíz para IALab

**Problema:** No hay `src/components/IALab/index.js`, cada import requiere ruta exacta.

**Archivo:** Crear `src/components/IALab/index.js`

**Contenido:**
```jsx
// Componentes principales
export { default as IALab } from './IALab';
export { default as IALabSidebar } from './IALabSidebar';
export { default as IALabHeader } from './IALabHeader';
export { default as IALabModals } from './IALabModals';
export { default as ModuleOverviewCard } from './ModuleOverviewCard';
export { default as Breadcrumbs } from './Breadcrumbs';
export { default as GlobalSearchBar } from './GlobalSearchBar';
export { default as TuRutaDeHoy } from './TuRutaDeHoy';
export { default as RecommendationsPanel } from './RecommendationsPanel';
export { default as DailyChallenges } from './DailyChallenges';
export { default as ModuleActions } from './ModuleActions';
export { default as IALabModuleHeader } from './IALabModuleHeader';
export { default as ModuleInfoSection } from './ModuleInfoSection';
export { default as ToolTutorAccordion } from './ToolTutorAccordion';
export { default as IALabTour } from './IALabTour';
export { default as AchievementToast } from './AchievementToast';
export { default as OfflineBanner } from './OfflineBanner';
export { default as ValerioFloatingButton } from './ValerioFloatingButton';
export { default as A11yProvider } from './A11yProvider';
export { default as IALabSkeleton } from './IALabSkeleton';

// Submódulos
export * from './shared';
export * from './forum';
export { IALabEvaluationModal } from './IALabEvaluationModal';
export { IALabQuizModal } from './IALabQuizModal';
export { IALabValerioPanel } from './IALabValerioPanel';
export { ResourceViewerModal } from './ResourceViewerModal';
```

**Verificación:** `npm test` + `npm run build`

---

## SPRINT 7: Mantenibilidad — Dead Code & Consistencia

### Task 7.1: Eliminar .bak file

**Archivo:** `src/components/IALab/IALabValerioPanel.jsx.bak`

**Acción:** `git rm src/components/IALab/IALabValerioPanel.jsx.bak`

**Verificación:** `npm test`

---

### Task 7.2: Tests para hooks sin cobertura

**Problema:** 5 hooks en IALab no tienen tests.

**Archivos a crear:**
- `src/hooks/IALab/__tests__/useCelebrationEffects.test.js`
- `src/hooks/IALab/__tests__/useIdlePause.test.js`
- `src/hooks/IALab/__tests__/usePullToRefresh.test.js`
- `src/hooks/IALab/__tests__/useSoundEffects.test.js`
- `src/hooks/IALab/__tests__/useSwipeNavigation.test.js`

**Patrón para cada test:**
```jsx
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useIdlePause from '../useIdlePause';

describe('useIdlePause', () => {
  it('starts as not paused', () => {
    const { result } = renderHook(() => useIdlePause());
    expect(result.current.isPaused).toBe(false);
  });

  it('pauses after timeout', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useIdlePause({ timeout: 1000 }));
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.isPaused).toBe(true);
    vi.useRealTimers();
  });
});
```

**Verificación:** `npm test` — deben aparecer 5 nuevos test files con al menos 2-3 tests cada uno.

---

### Task 7.3: Tests para store slices faltantes

**Problema:** 6 de 10 slices tienen tests. Faltan: certificateSlice, gamificationSlice, lessonSlice, seguridadSlice, synthesizerSlice, uiSlice.

**Archivos a crear:**
- `src/store/__tests__/gamificationSlice.test.js`
- `src/store/__tests__/lessonSlice.test.js`
- `src/store/__tests__/certificateSlice.test.js`
- `src/store/__tests__/seguridadSlice.test.js`
- `src/store/__tests__/synthesizerSlice.test.js`
- `src/store/__tests__/uiSlice.test.js`

**Verificación:** `npx vitest run src/store/__tests__/`

---

### Task 7.4: Eliminar import React redundante

**Problema:** `import React from 'react'` es innecesario con automatic JSX runtime.

**Archivos:** ~30+ archivos en `src/components/IALab/` y `src/hooks/IALab/`.

**Acción:** Eliminar la línea `import React from 'react';` de cada archivo que solo la usa para JSX (no para `React.memo`, `React.createContext`, `React.lazy`, etc.).

**Excepciones:** Archivos que usan `React.memo()` o `React.lazy()` — cambiar a named imports:
```jsx
import { memo, lazy } from 'react';
```

**Verificación:** `npm test` + `npm run build`

---

## SPRINT 8: Mantenibilidad — Componentes Grandes

### Task 8.1: Refactor IALabForumSection.jsx (651 → <400 líneas)

**Problema:** 651 líneas con múltiples responsabilidades.

**Archivo:** `src/components/IALab/IALabForumSection.jsx`

**Extraer a sub-componentes:**
- `ForumStats` — estadísticas del foro (líneas ~50)
- `ForumTagFilter` — filtro de tags (líneas ~30)
- `ForumPostList` — lista de posts (líneas ~80)

**NO agregar nuevos componentes visuales** — solo dividir el archivo existente en partes más pequeñas, manteniendo la misma UI exacta.

**Verificación:** `npm test` + comparar visualmente que la UI no cambie.

---

### Task 8.2: Refactor IALabSynthesizer.jsx (723 → <500 líneas)

**Problema:** 723 líneas con UI + lógica DeepSeek + API calls.

**Archivo:** `src/components/IALab/IALabSynthesizer.jsx`

**Extraer:**
- `PromptInput` — input + botón optimizar
- `GenerationHistory` — historial de generaciones
- `SuggestionPanel` — panel de sugerencias

**Verificación:** `npm test`

---

### Task 8.3: Refactor IALabEvaluationResults.jsx (560 → <400 líneas)

**Problema:** 560 líneas.

**Archivo:** `src/components/IALab/IALabEvaluationResults.jsx`

**Extraer:**
- `ScoreBreakdown` — desglose de puntuación
- `FeedbackPanel` — panel de feedback del AI
- `ResultsNavigation` — navegación entre resultados

**Verificación:** `npm test`

---

## Validación Final

```bash
# 1. Tests
npm test

# 2. Build
npm run build

# 3. Verificar chunks (react-vendor debe ser ~120KB, no 76 bytes)
ls -lh dist/assets/ | grep react-vendor

# 4. Verificar bundle size del main index
ls -lh dist/assets/index-*.js

# 5. Contar tests
npx vitest run --reporter=default | grep "Tests"
```

---

## Scores Proyectados

| Categoría | Antes | Después | Δ |
|-----------|:-----:|:-------:|:-:|
| Performance | 7.5 | 8.5 | +1.0 |
| Seguridad | 7.5 | 8.5 | +1.0 |
| Mantenibilidad | 7.0 | 8.5 | +1.5 |
| IALab General | 8.5 | 9.0 | +0.5 |
