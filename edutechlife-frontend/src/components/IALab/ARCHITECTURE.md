# Component Architecture — IALab

## Jerarquía de Componentes

```
AILabPage.jsx (wrapper, lazy load)
│
└── IALab.jsx (827 lines) — entry point, layout shell, auth guard
    │
    ├── [CONTEXT] IALabProvider (810 lines)
    │   ├── ProgressContext — datos de progreso persistido
    │   ├── IALabContext — ~170 selectores del store
    │   └── useActivityTracker — tracking de actividad
    │
    ├── IALabHeader (125 lines)
    │   ├── Navigation, notifications, search bar
    │   ├── Certificate button, XP display
    │   └── GlobalSearchBar (208 lines)
    │
    ├── IALabSidebar (544 lines)
    │   ├── Module navigation (5 modules)
    │   ├── Recursos adicionales (4 bloques)
    │   ├── Module completion status
    │   └── IALabMobileMenu (responsive)
    │
    ├── Main Content Area
    │   ├── IALabModuleHeader — current module info
    │   ├── ModuleOverviewCard — module summary card
    │   ├── TuRutaDeHoy (208 lines) — daily route dashboard
    │   ├── RecommendationsPanel (112 lines) — AI recommendations
    │   ├── Breadcrumbs — navigation breadcrumb
    │   ├── ModuleActions — exam/challenge buttons
    │   ├── ToolTutorAccordion — lesson accordion
    │   ├── IALabModuleRoadmap (98 lines) — module progress roadmap
    │   └── IALabForumOptimized — forum (lazy loaded)
    │
    └── Lazy-loaded Modals
        ├── IALabQuizModal (697 lines)
        ├── IALabEvaluationModal
        ├── IALabEvaluationModalPremium
        ├── IALabValerioPanel — AI coach
        ├── ExamResultViewer / ChallengeResultViewer
        ├── ResourceViewerModal (1029 lines)
        │   └── OVA components (lazy): BuildGPT, IntroPrompt, ChatGPTTools,
        │       NotebookLab, EcosystemGuide, Etica, BiasLab, RiskSimulator,
        │       PodcastStudio, NotebookPodcastGuide, NotebookSimulator
        └── Certificate modal / Activity History
```

## Patrones de acceso al store

| Patrón | Dónde se usa | Cuándo usarlo |
|--------|-------------|---------------|
| `useIALabContext().valor` | Componentes de UI | **RECOMENDADO** — lectura reactiva estándar |
| `useIALabStore(s => s.valor)` | Hooks, context | Cuando necesitas un selector granular específico |
| `useIALabStore.getState().metodo()` | Hooks, event handlers | Fire-and-forget, operaciones sin re-render |
| `useIALabStore()` → destructure | useSidebarState | **EVITAR** — re-renderiza en cualquier cambio |

## Lazy Loading

| Componente | Estrategia | Trigger |
|-----------|------------|---------|
| IALab.jsx | `lazy()` en route | Navegación a /ialab/:moduleId |
| IALabQuizModal | `lazy()` + Suspense | Click en "Examen" |
| IALabEvaluationModal | `lazy()` + Suspense | Click en "Evaluación" |
| IALabValerioPanel | `lazy()` + Suspense | Click en coach IA |
| ResourceViewerModal | `lazy()` + Suspense | Click en recurso |
| OVA components | `lazy()` en ResourceViewer | Click en OVA específica |
| IALabForumOptimized | `lazy()` + preload | Al hacer hover en tab foro |

## Convenciones de naming

- **Archivos:** PascalCase (IALabHeader.jsx)
- **Componentes:** PascalCase (export function IALabHeader)
- **Constantes:** UPPER_SNAKE_CASE (SECTION_DATA)
- **Hooks:** camelCase con 'use' (useSidebarState)
- **Archivos de test:** ComponentName.test.jsx

## Reglas de arquitectura (objetivo)
1. **NO** llamar al store directo desde componentes — usar IALabContext
2. **NO** usar `<style>` tags — usar Tailwind classes o CSS modules
3. **NO** mutar datos — siempre inmutabilidad
4. **TODO** componente >400 líneas debe dividirse en subcomponentes
5. **TODO** lógica de negocio >50 líneas debe ir en un hook
6. **TODO** dato estático >10 líneas debe ir en constants/

## Problemas conocidos
1. IALabSidebar renderiza DOM duplicado (collapsed + expanded)
2. ResourceViewerModal (1029 líneas) es un god component
3. 12 componentes OVA usan `<style>` tags inline
4. 12 componentes OVA sin dark mode
5. IALab.jsx tiene side-effect en render (setActiveMod)
