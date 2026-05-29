# Fase 5: Refactor Tipográfico y Espaciado del MainContent (IALab)

## Problemática

El MainContent del IALab presentaba inconsistencias tipográficas entre secciones y falta de espaciado entre componentes modulares.

### Tipografía — 4 patrones distintos en títulos de sección

| Componente | Antes | Después |
|---|---|---|
| RecommendationsPanel h4 | `text-[11px] font-semibold text-slate-500 uppercase tracking-wider` | `text-xs font-bold text-petroleum uppercase tracking-wider` |
| ModuleInfoSection h3 | `text-sm font-bold text-petroleum uppercase tracking-wider` | `text-xs font-bold text-petroleum uppercase tracking-wider` |
| ModuleActions h3 | `text-sm font-bold text-petroleum leading-tight` | `text-xs font-bold text-petroleum uppercase tracking-wider` |

Todos unificados a: **`text-xs font-bold text-petroleum uppercase tracking-wider`**

### Espaciado — 0 gap entre secciones dentro del inner div

Las secciones IALabModuleHeader → ModuleInfoSection → ModuleOverviewCard → ModuleActions se renderizan simultáneamente (cuando `viewSection === null`) sin espaciado vertical. Solo ModuleOverviewCard tenía `mb-4` como parche inconsistente.

### Cambios aplicados

| Archivo | Línea | Cambio |
|---|---|---|
| `RecommendationsPanel.jsx` | 78 | `text-[11px] font-semibold text-slate-500` → patrón unificado |
| `ModuleInfoSection.jsx` | 83 | `text-sm` → `text-xs` (mismo patrón) |
| `ModuleActions.jsx` | 141 | `text-sm font-bold text-petroleum leading-tight` → patrón unificado con uppercase |
| `IALab.jsx` | 477 | `<div>` → `<div className="flex flex-col gap-5">` |
| `ModuleOverviewCard.jsx` | 209 | Eliminado `mb-4` (redundante con gap-5) |

### Sistema de Jerarquía Tipográfica

| Rol | Patrón |
|---|---|
| Section titles (Recomendaciones, Objetivo, Actividades) | `text-xs font-bold text-petroleum uppercase tracking-wider` |
| Sub-section labels (Lo que aprenderás) | `text-xs font-semibold text-slate-500 uppercase tracking-wider` |
| Body text (descripciones, items) | `text-sm text-slate-600 dark:text-slate-300` |
| Secondary text (metadatos, counts) | `text-xs text-slate-500 dark:text-slate-400` |

### Principios de diseño aplicados

- **Consistencia**: Todos los títulos de sección comparten mismo tamaño, peso, color y transformación
- **Espaciado uniforme**: `gap-5` (20px) entre todas las secciones del MainContent, mismo valor que el layout exterior
- **Sin parches**: Eliminado `mb-4` inline de ModuleOverviewCard
- **Sin cambios funcionales**: Solo clases CSS modificadas, sin alterar lógica de negocio
