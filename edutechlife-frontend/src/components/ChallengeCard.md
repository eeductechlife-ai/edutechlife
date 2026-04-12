# ChallengeCard Component

## Overview
`ChallengeCard` es un componente premium reutilizable para mostrar desafíos del curso con diseño SaaS premium tipo Linear/Stripe. Incluye optimizaciones por plataforma, soporte dark/light mode automático, e integración con Supabase para carga de progreso del usuario.

## Características Principales

### 🎨 **Diseño Premium**
- Glassmorphism con efectos visuales avanzados
- Tipografía jerárquica mejorada
- Botones grandes (60px) con efectos hover y sombras pronunciadas
- Skeleton loading con gradientes
- Sistema de colores corporativos (#004B63 petroleum, #00BCD4 corporate)

### 📱 **Optimizaciones por Plataforma**
- Detección automática de iOS, Android, Desktop
- Optimizaciones específicas para dispositivos táctiles
- Ajustes de rendimiento para HiDPI displays
- Clases CSS específicas por plataforma

### 🌙 **Dark/Light Mode**
- Soporte automático usando `dark:` prefix de Tailwind
- Colores adaptativos para todos los elementos
- Skeleton loading optimizado para ambos modos
- Transiciones suaves entre modos

### 🔄 **Estados Dinámicos**
- Loading state (skeleton premium)
- Starting state (spinner de preparación)
- Completed state (diseño de éxito)
- Disabled state (opacidad y cursor)

### 📊 **Integración con Supabase**
- Carga real de progreso del usuario
- Guardado automático de estado completado
- Estados sincronizados con backend

## Uso Básico

```jsx
import ChallengeCard, { MinimalChallengeCard, ChallengeStatsCard } from './ChallengeCard';

// Componente principal
<ChallengeCard
  title="Desafío del Curso"
  description="Aplica lo aprendido en un reto práctico"
  challengeText="Crea un prompt para resolver un problema complejo de tu industria."
  estimatedTime="45 min"
  isLoading={false}
  isCompleted={false}
  isStarting={false}
  isDisabled={false}
  onStartChallenge={() => console.log('Iniciar desafío')}
  onViewSolution={() => console.log('Ver solución')}
  onReviewCompleted={() => console.log('Revisar completado')}
  onRetryChallenge={() => console.log('Reintentar')}
/>

// Variante minimalista (para listas)
<MinimalChallengeCard
  title="Desafío Rápido"
  challengeText="Texto breve del desafío"
  isCompleted={true}
  onClick={() => console.log('Click')}
/>

// Variante de estadísticas (para dashboards)
<ChallengeStatsCard
  totalChallenges={10}
  completedChallenges={7}
  averageTime="45 min"
/>
```

## Props

### ChallengeCard Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | string | "Desafío del Curso" | Título del desafío |
| `description` | string | "Aplica lo aprendido en un reto práctico" | Descripción breve |
| `challengeText` | string | "Crea un prompt para resolver..." | Texto del desafío |
| `estimatedTime` | string | "45 min" | Tiempo estimado |
| `isLoading` | boolean | false | Muestra skeleton loading |
| `isCompleted` | boolean | false | Estado completado |
| `isStarting` | boolean | false | Estado de inicio (muestra spinner) |
| `isDisabled` | boolean | false | Deshabilita botones |
| `onStartChallenge` | function | - | Handler para iniciar desafío |
| `onViewSolution` | function | - | Handler para ver solución |
| `onReviewCompleted` | function | - | Handler para revisar completado |
| `onRetryChallenge` | function | - | Handler para reintentar |
| `className` | string | "" | Clases CSS adicionales |
| `style` | object | {} | Estilos inline adicionales |

### MinimalChallengeCard Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `title` | string | Título del desafío |
| `challengeText` | string | Texto del desafío |
| `isCompleted` | boolean | Estado completado |
| `onClick` | function | Handler de click |

### ChallengeStatsCard Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `totalChallenges` | number | 0 | Total de desafíos |
| `completedChallenges` | number | 0 | Desafíos completados |
| `averageTime` | string | "45 min" | Tiempo promedio |

## Sistema de Colores

El componente usa los tokens de color definidos en `tailwind.config.js`:

### Colores Corporativos
- `petroleum` (#004B63) - Color principal
- `corporate` (#00BCD4) - Color de acento
- `warning` (#F59E0B) - Gradiente naranja
- `success` (#10B981) - Estado completado

### Colores Semánticos
- `text-main`, `text-sub`, `text-light`, `text-dark`
- `border-light`, `border-dark`
- `bg-card`, `bg-card-dark`

## Optimizaciones por Plataforma

### iOS
- `-webkit-backdrop-filter` para glassmorphism
- Optimizaciones de touch y scroll
- Ajustes de tipografía para legibilidad

### Android
- `backdrop-filter` estándar
- Optimizaciones de rendimiento
- Mejoras de animaciones

### Desktop
- Efectos hover avanzados
- Sombras más pronunciadas
- Mejor rendimiento de animaciones

### Dispositivos Táctiles
- `touch-manipulation` para mejor UX
- Botones más grandes
- Feedback táctil optimizado

## Integración con Supabase

El componente está diseñado para integrarse con las funciones existentes en `/src/lib/progress.js`:

```jsx
// Ejemplo de integración en IALab.jsx
useEffect(() => {
  const loadProgress = async () => {
    const progress = await getProgress(moduleId);
    setIsChallengeCompleted(progress?.status === 'COMPLETE_CHALLENGE');
  };
  loadProgress();
}, []);

const handleButtonClick = async () => {
  await saveProgress({
    moduleId,
    status: 'COMPLETE_CHALLENGE',
    data: { completedAt: new Date().toISOString() }
  });
  setIsChallengeCompleted(true);
};
```

## Estructura del Componente

```
ChallengeCard/
├── Header Premium
│   ├── Icono con gradiente
│   ├── Título jerárquico
│   └── Badge de estado
├── Contenedor Glassmorphism
│   ├── Badge de tiempo/estado
│   ├── Texto del desafío
│   └── Metadatos adicionales
├── Botones Premium
│   ├── Botón principal (gradiente naranja)
│   ├── Botón secundario (borde turquesa)
│   └── Estados: loading, starting, disabled
└── Footer con Estadísticas
    ├── Dificultad e impacto
    └── Indicador de plataforma (dev only)
```

## Variantes

### `MinimalChallengeCard`
- Para listas y dashboards
- Diseño compacto
- Estados visuales simples

### `ChallengeStatsCard`
- Para dashboards de progreso
- Barra de progreso con gradiente
- Estadísticas numéricas

## Mejores Prácticas

1. **Siempre usar handlers** - Proporcionar funciones para todos los eventos
2. **Manejar estados loading** - Mostrar skeleton durante carga de datos
3. **Optimizar para mobile** - El componente ya incluye optimizaciones
4. **Usar tokens de color** - Mantener consistencia con el sistema de diseño
5. **Testear en diferentes dispositivos** - Verificar optimizaciones por plataforma

## Dependencias

- `PlatformOptimizedCard` - Wrapper para optimizaciones
- `usePlatformDetection` - Hook para detección de plataforma
- `Icon` - Sistema de iconos
- Tailwind CSS con configuración extendida

## Archivos Relacionados

- `/src/components/IALab.jsx` - Uso principal del componente
- `/src/components/PlatformOptimizedCard.jsx` - Wrapper de optimizaciones
- `/src/hooks/usePlatformDetection.js` - Detección de plataforma
- `/src/lib/progress.js` - Integración con Supabase
- `/tailwind.config.js` - Sistema de colores