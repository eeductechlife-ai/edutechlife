# IALab — Plan de Mejoras (Sin alterar funcionamiento)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refinar calidad interna del curso "Introducción a la IA Generativa" sin alterar funcionalidad visible ni agregar secciones nuevas

**Architecture:** Mejoras agrupadas por tipo (código muerto, rendimiento, consistencia, mantenibilidad). Cada tarea es autónoma, sin dependencias entre sí. Se ejecutan en orden de prioridad ALTA → MEDIA → BAJA.

**Tech Stack:** React 18, Tailwind CSS, Zustand, Framer Motion, Vite, Playwright

---

### Task 1: Eliminar código muerto en OVANotebookLab y OVANotebookSimulator

**Files:**
- Modify: `src/components/IALab/OVANotebookLab.jsx`
- Modify: `src/components/IALab/OVANotebookSimulator.jsx`

#### 1.1 — Eliminar variable `locale` no usada

- [ ] **En OVANotebookLab.jsx line 34**, cambiar:
```jsx
const { t, locale } = useTranslation();
```
a:
```jsx
const { t } = useTranslation();
```

- [ ] **En OVANotebookSimulator.jsx line 34**, cambiar:
```jsx
const { t, locale } = useTranslation();
```
a:
```jsx
const { t } = useTranslation();
```

#### 1.2 — Eliminar `certCompletedRef` no usado

- [ ] **En OVANotebookLab.jsx line 37**, eliminar:
```jsx
const certCompletedRef = useRef(false);
```

- [ ] **En OVANotebookSimulator.jsx line 37**, eliminar:
```jsx
const certCompletedRef = useRef(false);
```

#### 1.3 — Eliminar imports de lucide-react no usados

- [ ] **En OVANotebookLab.jsx lines 5-6**, eliminar `BookOpen` y `Check` de la lista de imports de lucide-react

- [ ] **En OVANotebookSimulator.jsx lines 5-6**, eliminar `Check` de la lista de imports de lucide-react

#### 1.4 — Verificar build

Ejecutar: `npm run build`
Esperado: exit 0, sin warnings nuevos

---

### Task 2: Eliminar doble requestAnimationFrame en IALab.jsx

**Files:**
- Modify: `src/components/IALab/IALab.jsx:167-175`

#### 2.1 — Simplificar scrollToTop

- [ ] **Reemplazar lines 167-175** de:
```jsx
useEffect(() => {
    const forceScrollToTop = () => {
        const mainEl = document.querySelector('main');
        if (mainEl) {
            mainEl.scrollTop = 0;
            requestAnimationFrame(() => {
                mainEl.scrollTop = 0;
            });
        }
    };
    forceScrollToTop();
    window.addEventListener('popstate', forceScrollToTop);
    return () => window.removeEventListener('popstate', forceScrollToTop);
}, []);
```
a:
```jsx
useEffect(() => {
    const forceScrollToTop = () => {
        requestAnimationFrame(() => {
            const mainEl = document.querySelector('main');
            if (mainEl) mainEl.scrollTop = 0;
        });
    };
    forceScrollToTop();
    window.addEventListener('popstate', forceScrollToTop);
    return () => window.removeEventListener('popstate', forceScrollToTop);
}, []);
```

#### 2.2 — Verificar build

Ejecutar: `npm run build`
Esperado: exit 0

---

### Task 3: Reemplazar console.warn/console.error en producción (componentes IALab)

**Files:**
- Modify: `src/components/IALab/IALabValerioPanel/index.jsx:221,223`
- Modify: `src/components/IALab/IALabEvaluationModalPremium.jsx:39,79,93`
- Modify: `src/components/IALab/LeaderboardModal.jsx:69`
- Modify: `src/components/IALab/StreakDetailsModal.jsx:137`
- Modify: `src/components/IALab/IALabForumOptimized.jsx:96,109`
- Modify: `src/components/IALab/IALabQuizModal/index.jsx:152`

**Patrón:** En producción, los console.warn/error muestran información técnica al usuario en la consola del navegador. Sin valor para el usuario final.

#### 3.1 — Reemplazar en IALabValerioPanel/index.jsx

- [ ] **Linea 221**: Cambiar `console.warn('Timeout conversando con DeepSeek:', error);`
  por `if (import.meta.env.DEV) console.warn('Timeout conversando con DeepSeek:', error);`

- [ ] **Linea 223**: Cambiar `console.warn('DeepSeek API no disponible:', error);`
  por `if (import.meta.env.DEV) console.warn('DeepSeek API no disponible:', error);`

#### 3.2 — Reemplazar en IALabEvaluationModalPremium.jsx

- [ ] **Linea 39**: Cambiar `console.warn('Error no crítico al guardar progreso:', error);`
  por `if (import.meta.env.DEV) console.warn('Error no crítico al guardar progreso:', error);`

- [ ] **Linea 79**: Cambiar `console.warn('Error al refrescar progreso:', e);`
  por `if (import.meta.env.DEV) console.warn('Error al refrescar progreso:', e);`

- [ ] **Linea 93**: Cambiar `console.error('Error procesando resultado del desafío:', error);`
  por `if (import.meta.env.DEV) console.error('Error procesando resultado del desafío:', error);`

#### 3.3 — Reemplazar en LeaderboardModal.jsx

- [ ] **Linea 69**: Cambiar `console.error('Error fetching leaderboard:', err);`
  por `if (import.meta.env.DEV) console.error('Error fetching leaderboard:', err);`

#### 3.4 — Reemplazar en StreakDetailsModal.jsx

- [ ] **Linea 137**: Cambiar `console.error('Error fetching leaderboard:', err);`
  por `if (import.meta.env.DEV) console.error('Error fetching leaderboard:', err);`

#### 3.5 — Reemplazar en IALabForumOptimized.jsx

- [ ] **Linea 96**: Cambiar `console.error('Error al crear post:', err);`
  por `if (import.meta.env.DEV) console.error('Error al crear post:', err);`

- [ ] **Linea 109**: Cambiar `console.error('Error al enviar mensaje:', err);`
  por `if (import.meta.env.DEV) console.error('Error al enviar mensaje:', err);`

#### 3.6 — Reemplazar en IALabQuizModal/index.jsx

- [ ] **Linea 152**: Cambiar `console.error('Error sincronizando examen:', error);`
  por `if (import.meta.env.DEV) console.error('Error sincronizando examen:', error);`

#### 3.7 — Verificar build

Ejecutar: `npm run build`
Esperado: exit 0, sin warnings

---

### Task 4: Eliminar webpackChunkName comments (sin efecto en Vite)

**Files:**
- Modify: `src/components/IALab/ResourceViewerModal/ovaComponents.jsx:4-17`

#### 4.1 — Limpiar 14 comentarios legacy

- [ ] **Reemplazar lineas 4-17** para eliminar `/* webpackChunkName: "..." */` de cada lazy import.
  Cambiar de:
```jsx
const OVAChatGPTTools = lazy(() => import(/* webpackChunkName: "ova-chatgpttools" */ '../OVAChatGPTTools.jsx'));
```
a:
```jsx
const OVAChatGPTTools = lazy(() => import('../OVAChatGPTTools.jsx'));
```
  Aplicar a los 14 imports (OVAChatGPTTools, OVAEcosystemGuide, OVABuildGPT, OVAEtica, OVAIntroPrompt, OVANotebookLab, OVANotebookSimulator, OVANotebookPodcastGuide, OVAPodcastStudio, OVABiasLab, OVARiskSimulator, OVAEthicalDilemmas, OvaEdutechlife, OVAPracticalCases).

#### 4.2 — Verificar build

Ejecutar: `npm run build`
Esperado: exit 0, chunks generados correctamente

---

### Task 5: Agregar dark mode a componentes shared faltantes

**Files:**
- Modify: `src/components/IALab/shared/LoadingSpinner.jsx`
- Modify: `src/components/IALab/shared/EmptyState.jsx`
- Modify: `src/components/IALab/shared/AnimatedSection.jsx`

#### 5.1 — LoadingSpinner.jsx

- [ ] **Agregar variantes dark:**
  - `text-slate-500` → `text-slate-500 dark:text-slate-400`
  - `border-petroleum/30 border-t-petroleum` → `border-petroleum/30 dark:border-petroleum/50 border-t-petroleum dark:border-t-corporate`

#### 5.2 — EmptyState.jsx

- [ ] **Agregar variantes dark:**
  - `bg-slate-100` → `bg-slate-100 dark:bg-slate-800`
  - `text-slate-400` → `text-slate-400 dark:text-slate-500`
  - `text-slate-700` → `text-slate-700 dark:text-slate-200`
  - `text-slate-500` → `text-slate-500 dark:text-slate-400`

#### 5.3 — AnimatedSection.jsx (skeleton)

- [ ] **Agregar variante dark** al skeleton default:
  - `bg-slate-100` → `bg-slate-100 dark:bg-slate-700`

#### 5.4 — Verificar build

Ejecutar: `npm run build`
Esperado: exit 0

---

### Task 6: Unificar OVANotebookLab y OVANotebookSimulator (~90% duplicados)

**Files:**
- Create: `src/components/IALab/OVANotebookBase.jsx`
- Modify: `src/components/IALab/OVANotebookLab.jsx`
- Modify: `src/components/IALab/OVANotebookSimulator.jsx`

**⚠️ RIESGO ALTO — SOLO SI HAY TIEMPO Y TESTS E2E CONFIRMADOS ⚠️**

#### 6.1 — Crear OVANotebookBase.jsx

- [ ] Copiar el código compartido de OVANotebookLab.jsx a un nuevo archivo `OVANotebookBase.jsx` que acepte props:
  - `dataSource` — objeto con `contentScreens, questionsData`
  - `translationPrefix` — string (`'ova.notebooklab'` o `'ova.notebooksim'`)
  - `onComplete, onClose` — callbacks estándar
  - `imageLayoutClass` — opcional, default `'lg:h-auto lg:flex-grow'`

#### 6.2 — Simplificar OVANotebookLab.jsx

- [ ] Reemplazar todo el contenido por:
```jsx
import OVANotebookBase from './OVANotebookBase';
import { contentScreens, questionsData } from '../../data/ova/notebookLab';

const OVANotebookLab = (props) => (
  <OVANotebookBase
    {...props}
    dataSource={{ contentScreens, questionsData }}
    translationPrefix="ova.notebooklab"
  />
);
export default OVANotebookLab;
```

#### 6.3 — Simplificar OVANotebookSimulator.jsx

- [ ] Reemplazar todo el contenido por:
```jsx
import OVANotebookBase from './OVANotebookBase';
import { contentScreens, questionsData } from '../../data/ova/notebookSim';

const OVANotebookSimulator = (props) => (
  <OVANotebookBase
    {...props}
    dataSource={{ contentScreens, questionsData }}
    translationPrefix="ova.notebooksim"
    imageLayoutClass="lg:min-h-[300px]"
  />
);
export default OVANotebookSimulator;
```

#### 6.4 — Verificar build

Ejecutar: `npm run build`
Esperado: exit 0

---

### Task 7: Eliminar doble punto y coma `;;` en imports PropTypes

**Files:** ~76 archivos .jsx en `src/components/IALab/`

#### 7.1 — Reemplazar globalmente

- [ ] Ejecutar:
```bash
find src/components/IALab/ -name "*.jsx" -exec sed -i '' "s/import PropTypes from 'prop-types';;/import PropTypes from 'prop-types';/g" {} +
```

#### 7.2 — Verificar

- [ ] Confirmar que no quedan ocurrencias:
```bash
grep -r "import PropTypes from 'prop-types';;" src/components/IALab/ --include="*.jsx" | wc -l
```
Esperado: 0

#### 7.3 — Verificar build

Ejecutar: `npm run build`
Esperado: exit 0

---

### Task 8: Migrar estilos inline a Tailwind (prioridad ALTA)

**Files prioritarios:**
- Modify: `src/components/IALab/PromptFeedback.jsx`
- Modify: `src/components/IALab/ReadingModeOverlay.jsx`
- Modify: `src/components/IALab/TopicResourcesModal.jsx`

#### 8.1 — PromptFeedback.jsx

- [ ] Migrar `style={{ color: cfg.color }}` → usar `style` solo para color dinámico (justificado, mantener)
- [ ] Migrar `style={{ animationDelay: ... }}` → mantener (dinámico necesario)
- [ ] Migrar `boxShadow` inline → clase `shadow-lg` donde sea fijo

#### 8.2 — ReadingModeOverlay.jsx

- [ ] Migrar colores de tema inline → usar clases `dark:` de Tailwind

#### 8.3 — TopicResourcesModal.jsx

- [ ] Linea 172: Migrar `style={{ boxShadow: '...' }}` → clases `shadow-xl`

#### 8.4 — Verificar build

Ejecutar: `npm run build`
Esperado: exit 0

---

### Task 9: Agregar React.memo a componentes candidatos

**Files:**
- Modify: `src/components/IALab/Breadcrumbs.jsx`

#### 9.1 — Breadcrumbs.jsx

- [ ] Envolver export:
```jsx
export default memo(Breadcrumbs);
```

#### 9.2 — Verificar build

Ejecutar: `npm run build`
Esperado: exit 0

---

### Task 10: Corregir path de import en IALabForumOptimized.jsx

**Files:**
- Modify: `src/components/IALab/IALabForumOptimized.jsx:11`

#### 10.1 — Simplificar path

- [ ] Cambiar:
```jsx
import IALabForumOptimizedInput from '../IALab/forum/IALabForumOptimizedInput';
```
a:
```jsx
import IALabForumOptimizedInput from './forum/IALabForumOptimizedInput';
```

#### 10.2 — Verificar build

Ejecutar: `npm run build`
Esperado: exit 0

---

### Resumen de prioridades

| # | Tarea | Prioridad | Esfuerzo | Dependencias |
|---|-------|-----------|:--------:|:------------:|
| 1 | Código muerto OVAs | 🔴 ALTA | 15min | Ninguna |
| 2 | Doble rAF scrollToTop | 🔴 ALTA | 5min | Ninguna |
| 3 | console.* en producción | 🔴 ALTA | 20min | Ninguna |
| 4 | webpackChunkName legacy | 🟡 MEDIA | 5min | Ninguna |
| 5 | Dark mode shared components | 🟡 MEDIA | 15min | Ninguna |
| 6 | Unificar OVANotebookLab/Simulator | 🟡 MEDIA | 1h | Tests E2E |
| 7 | Doble ;; PropTypes | 🟢 BAJA | 2min | Ninguna |
| 8 | Estilos inline a Tailwind | 🟢 BAJA | 2h | Ninguna |
| 9 | React.memo Breadcrumbs | 🟢 BAJA | 5min | Ninguna |
| 10 | Path import forum | 🟢 BAJA | 2min | Ninguna |
