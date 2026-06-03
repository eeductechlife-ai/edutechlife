# iLAB Código/Mantenibilidad — Design Spec

**Goal:** Subir Código/Mantenibilidad de 7.8 → 8.8 mediante JSDoc types, PropTypes masivos, component splitting, ESLint CI y +20 tests.

**Principio rector:** Sin alterar funcionalidad ni características. Solo mejora estructural y de tipos.

---

## Fase Q1: JSDoc Types en Archivos Core

### Archivos a modificar (~15):
- `src/store/ialabStore.js` — `@typedef Module`, `@typedef Streak`, `@typedef Badge`
- `src/hooks/IALab/*.js` — `@param` + `@returns` en cada hook
- `src/hooks/useDeviceType.js` — `@typedef DeviceInfo`
- `src/components/IALab/shared/*.jsx` (13) — `@param {Object} props`
- `src/components/IALab/IALab.jsx` — `@typedef` para módulos y progreso
- `src/i18n/I18nProvider.jsx` — `@typedef TranslationFunction`

### Patrón JSDoc:
```js
/**
 * @typedef {Object} Module
 * @property {string} id
 * @property {string} title
 * @property {'locked'|'available'|'completed'} status
 */
```

---

## Fase Q2: PropTypes Masivos

### Script: `scripts/add-proptypes.mjs`
- Escanea cada JSX, extrae props desestructuradas, genera PropTypes.
- Tipos iniciales: `PropTypes.any` + refinamiento manual posterior.
- Afecta ~150 archivos de 194.

### Post-proceso manual (~30 archivos clave):
- Modales, shared components, store hooks.

---

## Fase Q3: Component Splitting

| Archivo | Líneas | Acción |
|---|---|---|
| `IALab.jsx` | 520 | Extraer `ModuleView`, `MobileLayout`, `DesktopLayout` |
| `IALabForumSection.jsx` | 519 | Extraer lógica de filtros a `useForumFilters` hook |
| `QueEsPrompt_OVA_Original.jsx` | 529 | Seccionar en `OVASections/` |
| `ResourceViewerModal/index.jsx` | 476 | Extraer `useOVAResolver` hook |
| `IALabForumOptimized.jsx` | 496 | Separar list/detail views |

---

## Fase Q4: ESLint CI

### Nuevo `.github/workflows/lint.yml`
- Corre en push + PR
- `npx eslint src/ --max-warnings 50`

---

## Fase Q5: Tests Core

### Archivos nuevos:
1. `src/components/IALab/__tests__/ialabStore.test.jsx` — 5 tests
2. `src/components/IALab/__tests__/TouchableIcon.test.jsx` — 3 tests
3. `src/components/IALab/__tests__/EmptyState.test.jsx` — 3 tests
4. `src/components/IALab/__tests__/SectionErrorBoundary.test.jsx` — 3 tests
5. `src/components/IALab/__tests__/ToastNotification.test.jsx` — 3 tests
6. `src/components/IALab/__tests__/useDeviceType.test.jsx` — 3 tests

Total: 20 tests
