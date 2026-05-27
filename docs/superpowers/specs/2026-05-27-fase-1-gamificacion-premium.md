# Fase 1 — Gamificación Premium

## Objetivo

Rediseñar los componentes de gamificación de IALab con:
- Diseño visual premium (Soft UI Evolution + brand corporativo)
- Animaciones Framer Motion (springs, staggered entrance, celebration effects)
- Datos reales desde `useIALabStore` (Zustand)
- Nuevo Leaderboard + notificaciones de logro

## Componentes

### 1. StreakBadge (`StreakBadge.jsx`)
**Estado actual:** Funcional, useReducedMotion(), corporate colors, conectado a store.
**Mejoras:**
- Animación spring entrance al montar (`stiffness: 300, damping: 24`)
- Scale pulse + contador animado cuando streak cambia (vía `useEffect` + `useAnimate`)
- Borde gradient (#004B63 → #00BCD4) para estado activo, ambar para at-risk
- Tooltip animado con detalles de racha en hover
- `animate-bounce` suprimido si `prefers-reduced-motion`

### 2. BadgeCard (`BadgeCard.jsx`)
**Estado actual:** Funcional, useReducedMotion(), grid de badges.
**Mejoras:**
- Staggered entrance (50ms delay por card, container variants)
- Earned: glassmorphism ligero (`bg-white/80 backdrop-blur`), glow gradient en hover
- Locked: grayscale + overlay locked icon
- Flip/reveal animation al obtener badge (vía `AnimatePresence` + `layout`)
- Conectar a store: `getUserBadges()` para datos reales, badge dinámico

### 3. CourseCompletionSection (`CourseCompletionSection.jsx`)
**Estado actual:** Funcional, useReducedMotion().
**Mejoras:**
- Progress bar gradient animado (`useTransform` basado en progreso)
- `useAnimate()` secuencial: progress bar fill → checkmark scale → celebration message
- Particle burst con 8-12 partículas al 100% (solo si no reduced-motion)
- Datos reales desde store: `modules`, progreso por módulo
- Estadísticas: módulos completados, XP ganado, tiempo estimado

### 4. Leaderboard (nuevo componente)
**Archivo nuevo:** `Leaderboard.jsx` en `components/IALab/`
- Top 5 usuarios: avatar, nombre, nivel, XP, racha
- Highlight al usuario actual (borde #00BCD4)
- Animación de posiciones con `LayoutGroup`
- Fallback: datos mock si no hay multiusuario real
- Responsive: scroll horizontal en mobile

### 5. Notificaciones de logro (nuevo hook + componente)
**Archivos nuevos:** `useAchievementNotifications.js`, `AchievementToast.jsx`
- Toast no obstructivo (esquina inferior derecha, auto-dismiss 4s)
- Eventos: badge earned, level up, streak milestone (7/14/30 días)
- Integración con store via `subscribe` callback al mount
- `AnimatePresence` para entrada/salida del toast
- Stack de hasta 3 toasts visibles

## Diseño Visual

### Colores
- Base corporativa: `#004B63` (petróleo), `#00BCD4` (cyan)
- Streak activo: `#10B981` (green-500)
- Streak at-risk: `#F59E0B` (amber-500)
- Badge locked: `#94A3B8` (slate-400)
- Background cards: `bg-white` con shadow sutil
- Texto: `#334155` (slate-700) body, `#0F172A` (slate-900) headings

### Efectos
- Shadows suaves multi-capa (Soft UI Evolution)
- Border-radius: 12-16px cards, 8px badges, 999px pills
- Gradientes: `from-[#004B63] to-[#00BCD4]` para elementos premium
- Transiciones: 200-300ms, ease-out para entering, ease-in para exiting
- Springs físicos para interacciones (press, hover)

## Datos

### Store (`gamificationSlice.js`)
- `xp`, `streak`, `level` + `getLevel()`, `getLevelProgress()`
- `getUserBadges()`, `getBadgesSummary()`
- `modules` con progreso individual

### Nuevas conexiones
- BadgeCard: usa `getUserBadges()` en tiempo real
- CourseCompletionSection: usa `modules` + `xp` para stats
- Leaderboard: hook `useLeaderboard()` con placeholder API
- Notifications: subscribe a cambios de `xp`/`streak`/`badges`

## Archivos a modificar/crear

### Modificar
- `src/components/IALab/StreakBadge.jsx` — animaciones, tooltip
- `src/components/IALab/BadgeCard.jsx` — staggered entrance, glassmorphism, datos reales
- `src/components/IALab/CourseCompletionSection.jsx` — progress bar animado, particle burst

### Crear
- `src/components/IALab/Leaderboard.jsx` — tabla de posiciones
- `src/components/IALab/Leaderboard.css` — estilos (o Tailwind)
- `src/components/IALab/AchievementToast.jsx` — notificación toast
- `src/hooks/useAchievementNotifications.js` — lógica de eventos
- `src/components/IALab/IALabSidebar/LeaderboardSection.jsx` — contenedor para sidebar (si aplica)

## Criterios de éxito
- Build pasa sin errores (`npx vite build`)
- Animaciones respetan `prefers-reduced-motion`
- BadgeCard muestra datos reales del store (no hardcodeados)
- Toast de notificación aparece al cumplir logro
- Leaderboard muestra top 5 con avatar y stats
- Todos los componentes responsive (375px → 1440px)
