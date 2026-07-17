# Code Quality & Refactoring — Design Document

## Goal

Resolver los 5 issues estructurales del proyecto **sin alterar funcionalidad**:
1. Archivos >500 líneas (SRP violation)
2. ESLint warnings/errors masivos
3. TypeScript errors
4. Backend sin ESLint ni TypeScript
5. Barrel exports faltantes

## Enfoque General

**Filosofía:** Refactorización puramente mecánica. No se cambia lógica de negocio, no se modifican firmas de funciones exportadas, no se alteran rutas de import existentes. Cada cambio preserva el output exacto del código.

**Estrategia de Split:** Extraer funciones/data a archivos nuevos, importarlos en el original, verificar con tests y build. Cada archivo grande se convierte en un directorio con barrel export (`index.js`) que re-exporta lo mismo que antes.

**Verificación post-cambio (cada archivo):**
```bash
npm test              # Tests pasan
npx eslint src/...    # Sin nuevos errores
npm run build          # Build exits 0
```

---

## Phase 1: Archivos >500 líneas (24 files)

### 1.1 ActivityHistory.jsx (1,202 líneas)
**Estructura actual:** 1 componente monolítico con sub-componentes inline + hooks inline + configs.

**Plan:**
```
src/components/activityHistory/
├── index.js              ← barrel: re-exporta ActivityHistory
├── ActivityHistory.jsx   ← componente principal (~300 líneas)
├── ActivityFilters.jsx   ← filtros extraídos (~50 líneas)
├── ActivityList.jsx      ← lista de actividades (~100 líneas)
├── ActivityStats.jsx     ← estadísticas (~80 líneas)
├── ActivityTimeline.jsx  ← timeline (~150 líneas)
├── hooks/
│   ├── index.js
│   └── useActivityFilter.js  ← lógica de filtros extraída
└── activityConfig.js     ← configs que ya existen
```
**Riesgo:** Bajo — los sub-componentes ya son casi independientes.

### 1.2 SmartBoardKidsContext.jsx (1,011 líneas)
**Estructura actual:** Context + localStorage helpers + lógica de dashboard.

**Plan:**
```
src/context/SmartBoardKids/
├── index.js
├── SmartBoardKidsContext.jsx  ← solo el Context + Provider (~300 líneas)
├── useSmartBoardData.js       ← hook de datos extraído (~200)
├── localStorage.js            ← helpers de storage (~60)
├── smartBoardReducer.js       ← lógica de estado (~200)
└── types.js                   ← constantes y tipos (~50)
```
**Riesgo:** Medio — asegurar que el Provider exporta exactamente el mismo valor de contexto.

### 1.3 useIALabEvaluation/moduleConfig.js (967 líneas)
**Estructura actual:** Configuración de módulos — data pura (objetos, arrays). Sin lógica.

**Plan:**
```
src/hooks/IALab/useIALabEvaluation/moduleConfig/
├── index.js          ← barrel que re-exporta todo
├── modules.js        ← definiciones de módulos (~200)
├── questions.js      ← preguntas (~300)
├── exercises.js      ← ejercicios (~200)
├── scoring.js        ← puntuaciones (~150)
└── validation.js     ← validaciones (~100)
```
**Riesgo:** Muy bajo — es data pura, split mecánico.

### 1.4 documentStyles.js (937 líneas)
**Estructura actual:** Estilos JS para documentos VAK — objetos de estilo.

**Plan:** Split por sección de documento:
```
src/components/DiagnosticoVAK/screens/documentStyles/
├── index.js
├── base.js           ← estilos base
├── header.js         ← estilos de encabezado
├── sections.js       ← estilos por sección
└── colors.js         ← paleta de colores
```
**Riesgo:** Muy bajo — data pura.

### 1.5 contentEs.js (830) / contentEn.js (773)
**Estructura actual:** Constantes de contenido — data pura.
**Decisión:** DEJAR como están. Son data dumps, no lógica. El ESLint rule `max-lines` se ajustará a `max-lines: 500` con `skipComments: true` para ignorar archivos de data.

### 1.6 nativeSpeech.js (729 líneas)
**Estructura actual:** Funciones de speech synthesis + recognition.

**Plan:**
```
src/utils/speech/
├── index.js
├── nativeSpeech.js       ← síntesis de voz (~250)
├── speechRecognition.js  ← reconocimiento (~200)
├── speechUtils.js        ← utilidades (~100)
└── voiceConfig.js        ← configuraciones (~80)
```
**Riesgo:** Medio — pruebas con Web Speech API no existen, verificar con build.

### 1.7–1.24 Resto de archivos (500–650 líneas cada uno)
Aplicar mismo patrón: identificar responsabilidades, extraer, barrel export.

**Lista completa priorizada:**
| Priority | File | Lines | Strategy |
|----------|------|-------|----------|
| P0 | ActivityHistory.jsx | 1,202 | Split componente |
| P0 | SmartBoardKidsContext.jsx | 1,011 | Split context |
| P0 | moduleConfig.js | 967 | Split data |
| P0 | documentStyles.js | 937 | Split data |
| P0 | nativeSpeech.js | 729 | Split util |
| P1 | useNicoSendMessage.js | 703 | Split hook+utils |
| P1 | IALabTour.jsx | 672 | Split tour steps |
| P1 | resourcesEs.js / resourcesEn.js | 683/659 | Data — dejar |
| P1 | SmartBoardDashboard.jsx | 647 | Split sub-components |
| P1 | useIALabProgress.js | 634 | Split by concern |
| P1 | useSmartBoardSync.js | 635 | Split by concern |
| P1 | IALabQuizModal/index.jsx | 617 | Ya es directorio |
| P1 | DailyPlan.jsx | 595 | Split component |
| P1 | AdminDashboard.jsx | 587 | Split sub-components |
| P2 | ActivityView.jsx | 567 | Ya parcial |
| P2 | DiagnosticoVAK.jsx | 409 | ✅ Ya refactorizado |
| P2 | Otros <550 | 500-550 | Evaluar caso por caso |

---

## Phase 2: ESLint — 2,364 warnings + 21 errors

### 2.1 Causa raíz
El ESLint rule `max-lines: 400` genera ~1,400 warnings de los 2,364 totales (~60%). Los archivos de data pura (contentEs.js, resourcesEn.js, etc.) nunca bajarán de 400 líneas.

### 2.2 Acciones

**A) Ajustar config de ESLint (sin alterar funcionalidad):**
```js
// eslint.config.js
rules: {
  'max-lines': ['warn', {
    max: 500,                // 400 → 500 (data files)
    skipBlankLines: true,
    skipComments: true
  }],
}
```
Impacto: Elimina ~800 warnings de archivos de data que no se deben dividir.

**B) Agregar override para archivos de data:**
```js
overrides: [
  {
    files: ['**/constants/**', '**/data/**', '**/*Config.js', '**/*Data.js'],
    rules: { 'max-lines': 'off' }
  }
]
```
Impacto: Archivos como contentEs.js (830), resourcesEn.js (683) dejan de generar warnings.

**C) Fix automático:**
```bash
npx eslint src/ --fix
```
Esto corrige automáticamente:
- `no-unused-vars` (con prefijo `_` ya ignorado)
- `no-duplicate-imports`
- `react/jsx-key` (cuando tiene key estática)
- `prettier/prettier` (formateo)

Impacto estimado: ~300 warnings corregidos automáticamente.

**D) Errores (21):**
Todos son de `react/jsx-no-target-blank` (target="_blank" sin rel="noreferrer").
Solución: `npx eslint src/ --fix --rule 'react/jsx-no-target-blank': 'error'` + agregar `rel="noreferrer"` automáticamente.
Impacto: 21 errors → 0.

**E) Warnings manuales restantes (~1,200):**
- `react/prop-types`: ~400 — agregar PropTypes o PropTypes definitions
- `react-hooks/exhaustive-deps`: ~350 — agregar dependencias faltantes
- `no-undef`: ~200 — agregar imports faltantes o eslint-enable
- `no-console`: ~150 — cambiar console.log por console.warn/error
- `no-unused-vars`: ~100 — eliminar variables no usadas

Orden de ejecución: exhaustiveness-deps first (pueden esconder bugs), luego prop-types, luego el resto.

### 2.3 Backend — ESLint setup
**Estado actual:** Sin ESLint, sin tsconfig.
**Acción:**
```bash
npm init @eslint/config  # o copiar config del frontend adaptada a Node
```
Reglas backend:
```js
env: { node: true, es2022: true },
rules: {
  'no-console': 'off',        // Backend usa console.log para logs
  'max-lines': ['warn', { max: 400, skipBlankLines: true }],
}
```

---

## Phase 3: TypeScript — 9 errors

### 3.1 Diagnóstico
Todos en `src/test-setup.ts`:
- 6 × `'any' type from external library` (vi.mock return types)
- 3 × `Cannot find name 'global'` (globalThis en entorno jsdom)

### 3.2 Solución
Crear `src/types/test.d.ts`:
```ts
// Vitest global types
import 'vitest/globals';

// Mock return types
type MockFactory<T> = () => T;
declare function vi: typeof import('vitest').vi;
```

O más simple: agregar `/// <reference types="vitest/globals" />` al inicio de test-setup.ts y marcar los `any` con `// eslint-disable-next-line @typescript-eslint/no-explicit-any`.

---

## Phase 4: Barrel exports (index files)

### 4.1 Diagnóstico
Ya hay **43 index files** en frontend y **1** en backend.
Directorios sin barrel export identificados:
```
src/components/activityHistory/          ← se crea en Phase 1.1
src/context/SmartBoardKids/              ← se crea en Phase 1.2
src/components/IALab/dashboard/          ← falta index.js
src/components/IALab/quiz/               ← falta index.js
src/hooks/IALab/forum/                   ← ya tiene algunos
src/utils/speech/                        ← se crea en Phase 1.6
```

### 4.2 Criterio
Todo directorio con 2+ archivos de código debe tener `index.js`/`index.ts` que re-exporte sus exports públicos. Los directorios de testing (`__tests__`) no necesitan barrel.

---

## Phase 5: Verificación Final

### 5.1 Pre-flight check (cada archivo modificado)
```bash
npm test -- --reporter=verbose | grep "FAIL\|PASS"
npx eslint src/path/to/file.jsx --format=compact
npm run build
```

### 5.2 Smoke test completo
```bash
# Backend
cd edutechlife-backend && npm test && npm run test:coverage

# Frontend
cd edutechlife-frontend && npm run test:smoke && npm run build
```

### 5.3 Rollback plan
Si algún cambio rompe funcionalidad:
```bash
git checkout -- <file>
# Reportar y debuggear
```

---

## Principios (NO hacer)

1. **NO** cambiar lógica de negocio
2. **NO** renombrar funciones, componentes o variables exportadas
3. **NO** cambiar firmas de props o parámetros
4. **NO** modificar estilos visuales (CSS, Tailwind, animaciones)
5. **NO** mover archivos que ya tienen imports conocidos — crear barrel y re-exportar
6. **NO** eliminar código aunque parezca no usado (puede ser usado dinámicamente)
7. **NO** cambiar dependencias en package.json
8. **YES** crear directorios nuevos con barrel exports
9. **YES** dividir archivos grandes en módulos más pequeños
10. **YES** agregar tipos TypeScript a test-setup.ts
11. **YES** agregar ESLint al backend

---

## Orden de Ejecución

1. **ESLint config** (ajustar max-lines, agregar overrides) — es rápido y reduce ruido
2. **TypeScript errors** (test-setup.ts + types) — 9 errores, fix simple
3. **Split ActivityHistory.jsx** — el archivo más grande
4. **Split SmartBoardKidsContext.jsx** — segundo más grande
5. **Split moduleConfig.js** — data pura, rápido
6. **Split documentStyles.js** — data pura, rápido
7. **Split nativeSpeech.js** — utilidad
8. **Split useNicoSendMessage.js, IALabTour.jsx, SmartBoardDashboard.jsx** — P1
9. **Resto de archivos P1-P2** — según prioridad
10. **Barrel exports faltantes** — después de splits
11. **ESLint backend** — config + fix
12. **ESLint frontend bulk fix** — `--fix` + manual
13. **Verificación final** — tests + build + coverage
