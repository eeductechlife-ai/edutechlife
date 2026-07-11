# SmartBoard Analítica — Rediseño con Datos Reales

**Fecha:** 2026-07-09
**Audiencia:** Estudiante 8-16 años (gamificación tipo videojuego)
**Feature:** Premium (detrás de subscriptionTier === 'premium')

## Objetivo

Reemplazar los 5 charts con datos mock (`Math.random()`) de SmartBoardAnalytics por visualizaciones con datos reales del `SmartBoardKidsContext`, y añadir nuevas cards de analítica. Sin llamadas API adicionales — todo se computa localmente desde el contexto existente.

## Arquitectura

### Árbol de Componentes

```
SmartBoardAnalytics (layout + container)
├── SummaryStrip
├── StudySpeedCard
├── SubjectHeatmap
├── PointsProjection
├── TimeDistribution
├── EffortVsResult
├── StreakConsistency
└── AchievementFeed
```

Cada sub-componente recibe solo los datos que necesita vía props. Toda la computación de métricas derivadas se hace con `useMemo` dentro del contenedor `SmartBoardAnalytics`.

### Data Flow

| Card | Datos del Contexto | Cálculo |
|------|-------------------|---------|
| **SummaryStrip** | `totalPoints`, `totalActiveMinutes`, `streak`, `missions` | Puntos esta semana, minutos hoy, racha actual, misiones completadas |
| **StudySpeed** | `sessions` | Agrupar sesiones por día (últimos 14), sumar duración |
| **SubjectHeatmap** | `subjectTime`, `sessions[].subject` | Matriz materia × día de semana con intensidad |
| **PointsProjection** | `pointsHistory` | Trend lineal últimos 30 días + proyección a 14 días |
| **TimeDistribution** | `subjectTime`, `subjects[].color` | Donut/Anillo con tiempo por materia + colores |
| **EffortVsResult** | `sessions`, `pointsHistory` | Correlación minutos de estudio vs puntos ganados ese día |
| **StreakConsistency** | `streak`, `streakLog`, `totalActiveMinutes` | Días activos últimos 30, hora más productiva, promedio diario |
| **AchievementFeed** | `pointsHistory`, `missions`, `unlockedRewards` | Timeline: "Desbloqueaste Tema Oscuro", "Completaste misión: X" |

### Dependencias

- `recharts` (ya instalado) — para BarChart, LineChart, PieChart, ScatterChart
- `framer-motion` (ya instalado) — para animaciones de entrada
- `lucide-react` (ya instalado) — iconos
- `useSmartBoardKids()` — acceso a datos

## Diseño Visual

### Estilo Gamificado

- **SummaryStrip**: Banner "Esta Semana" con 4 métricas grandes: `🔥 Días activos`, `💎 Puntos ganados`, `⏱ Minutos estudiados`, `✅ Misiones`
- **Rarity Colors**: Inspirado en videojuegos — thresholds de logro con colores:
  - Común: `#94A3B8` (slate)
  - Poco común: `#4ADE80` (green)
  - Raro: `#60A5FA` (blue)
  - Épico: `#A78BFA` (purple)
  - Legendario: `#FBBF24` (gold)
- **Tooltips**: Mensajes motivacionales ("¡Súper racha!", "¡Sigue así!") en vez de tooltips técnicos
- **Empty states**: "¡Empieza a estudiar para ver tus estadísticas!" con icono animado
- **Consistencia**: glassmorphism (`backdrop-blur-xl`), `rounded-2xl`, `shadow-sm`, igual que SmartBoardProgress

### Cards Específicas

1. **SummaryStrip**: Banner horizontal, 4 stat cards en fila con icono + número grande + label pequeño
2. **StudySpeedCard**: `recharts BarChart`, responsive, tooltip motivacional, gradiente cyan→petróleo
3. **SubjectHeatmap**: Grid CSS 6 materias × 7 días, intensidad de color por minutos, tooltip con materia + minutos
4. **PointsProjection**: `recharts LineChart`, línea sólida (historial) + línea punteada (proyección), meta marcada con estrella
5. **TimeDistribution**: `recharts PieChart` tipo donut, labels externos con %, colores de materias
6. **EffortVsResult**: `recharts ScatterChart`, eje X = minutos, eje Y = puntos, línea de tendencia
7. **StreakConsistency**: Tarjetas con racha actual/máxima + "hora pico" + promedio diario + mini calendar de 30 días
8. **AchievementFeed**: Timeline vertical con iconos, scroll hasta 20 eventos

### Animaciones

- Stagger children con `framer-motion` (delay 0.07s entre cards)
- Barras y líneas con spring animation
- Tooltips con `whileHover`
- Empty states con floating animation

## Premium UX

- Sin cambios en el gating: `{isPremium ? <SmartBoardAnalytics /> : <PremiumGate />}`
- Error boundary ya existe: `DashboardErrorBoundary message="Error al cargar analytics"`
- Loading: `Suspense` con `SectionFallback` (ya existe)

## Edge Cases & Estados

| Estado | Comportamiento |
|--------|---------------|
| Sin datos (nuevo usuario) | Empty state motivacional, no charts vacíos |
| Sesión única | Charts se adaptan a 1 data point |
| Sin conexión | Datos desde localStorage, charts funcionales |
| Dark mode | Variables CSS condicionales (mismo patrón que SmartBoardProgress) |
| Pantalla pequeña | Grid responsive: 1 columna en mobile |

## Testing

- Cada sub-componente renderiza con datos mock predecibles (no `Math.random()`)
- Estados vacío, carga, error, y datos normales cubiertos
- Sin regresiones en SmartBoardProgress ni otras secciones del dashboard
