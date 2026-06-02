# DailyPlan: Fusión de Recomendaciones + Desafíos Diarios

## Resumen

Unificar los componentes `RecommendationsPanel` y `DailyChallenges` en un solo componente `DailyPlan` que muestra hasta 8 items priorizados en un acordeón colapsable.

## Arquitectura

```
IALab.jsx
 └── SectionErrorBoundary
      └── DailyPlan (nuevo, reemplaza RecommendationsPanel + DailyChallenges)
           ├── usePersonalizedRecommendations()  ← recomendaciones dinámicas
           ├── useLocalStorage                    ← desafíos completados
           ├── DAILY_CHALLENGES                   ← 5 desafíos estáticos
           └── mergePrioritized(8)                ← algoritmo de fusión
```

## Algoritmo de Priorización

Los items se ordenan por prioridad y se cortan en 8:

```
P1: Desafíos NO completados (hasta 5)
P2: Recomendaciones high urgency (hasta 3)
P3: Recomendaciones medium urgency (hasta 2)
P4: Recomendaciones low urgency (hasta 1)
---
Corte total: max 8 items
```

Si hay menos de 5 desafíos activos, el espacio sobrante se distribuye a recomendaciones.

## Interfaz de Item

```typescript
interface DailyPlanItem {
  id: string;
  type: 'challenge' | 'recommendation';
  priority: number;          // 1-4 (P1-P4)
  icon: string;              // lucide icon name
  title: string;
  description: string;
  xpReward?: number;         // solo challenges
  completed?: boolean;       // solo challenges
  action?: {
    label: string;
    handler: () => void;
  };
  urgency?: 'high' | 'medium' | 'low';
}
```

## Props

```jsx
<DailyPlan onAction={handleGlobalAction} isLoading={isLoadingProgress} />
```

## Estados

| Estado | Visual |
|--------|--------|
| Loading | 3 skeleton cards con pulse animation |
| Empty (0 items) | Icono check + "¡Al día!" + "Vuelve mañana" |
| Normal (1-8 items) | Lista priorizada completa |
| Overflow (>8) | Corte en 8, items restantes no mostrados |

## Diseño Visual por Tipo

- **Desafío activo:** borde amber-200, icono trofeo, badge "+50 XP", botón "Completar"
- **Desafío completado:** tachado, check verde, opacity reducida, badge "+50 XP ✓"
- **Recomendación high:** borde rose-200/60, badge "Prioritario"
- **Recomendación medium:** borde amber-200/40, badge "Sugerencia"
- **Recomendación low:** borde sky-200/40, badge "Para después"

Cada card usa el mismo patrón de IALab:
- `bg-white rounded-xl border shadow-sm hover:shadow-md hover:-translate-y-0.5`
- Icono en gradiente `from-petroleum/10 to-corporate/10`
- Clases dark mode: `dark:bg-slate-800 dark:border-slate-700`

## Funcionalidad Conservada

| Feature | Origen | DailyPlan |
|---------|--------|-----------|
| Navegar a módulo vía onAction | RecommendationsPanel | `rec.type === 'exams'` → `OPEN_EVALUATION`, etc. |
| Completar desafío + XP | DailyChallenges | `addXp(xpReward)` + localStorage persist |
| Colapsar/expandir | Ambos | `useState(false)` + AnimatePresence |
| Loading skeleton | RecommendationsPanel | 3 cards pulse |
| Conteo pendiente en header | RecommendationsPanel | `desafíosActivos + recsHighCount` |

## Archivos

### Crear
- `src/components/IALab/DailyPlan.jsx` — componente fusionado (~200 líneas)

### Modificar
- `src/components/IALab/IALab.jsx` — reemplazar imports + render de ambos componentes

### Mantener (no eliminar)
- `RecommendationsPanel.jsx` — mantener como respaldo
- `DailyChallenges.jsx` — mantener como respaldo
- `src/components/IALab/constants/dailyChallenges.js` — data de desafíos (reutilizada)
- `src/hooks/IALab/usePersonalizedRecommendations.js` — hook de recs (reutilizado)

## No Incluido (Out of Scope)

- TuRutaDeHoy: permanece separado, siempre visible, no colapsable
- IALabChallengeSection: maneja desafíos premium por módulo (no tocar)
- Modales de examen/desafío: sin cambios
