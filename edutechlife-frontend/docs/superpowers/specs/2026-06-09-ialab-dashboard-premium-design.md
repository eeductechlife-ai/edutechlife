# IALabDashboard — Rediseño Premium (Opción B)

> **Fecha:** 2026-06-09
> **Contexto:** El dashboard actual en `/ialab` (ruta "Continúa tu aprendizaje") tiene información valiosa pero diseño plano, fatiga visual, y jerarquía poco clara. Se rediseña para ser minimalista, premium, con animaciones 3D framer-motion, manteniendo toda la información del estudiante.

---

## 1. Arquitectura de Layout (Opción B)

### Jerarquía Vertical (de arriba a abajo)

```
┌─────────────────────────────────────────────────────┐
│  Hero Continue (full-width gradient)                 │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Progress bar                      45%          │ │
│  │  [▶] Continuar Módulo 2: ChatGPT          [8s] │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐                    │ │
│  │  │ XP   │ │Racha │ │Score │  ← glassmorphism  │ │
│  │  │1,250 │ │  5   │ │ 72%  │    flotante        │ │
│  │  └──────┘ └──────┘ └──────┘                    │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Tabs: [📦 Tu Progreso (2/5)] [📊 Actividad]         │
│                                                       │
│  ┌ M1: Prompt Engineering ✔       85%  [Revisar] ──┐ │
│  │ M2: ChatGPT ████████░░░         45%  [Continuar] │ │
│  │ M3: Deep Search 🔒 Bloqueado                     │ │
│  │ M4: Voice AI 🔒 Bloqueado                        │ │
│  │ M5: IA Ética 🔒 Bloqueado                        │ │
│  └──────────────────────────────────────────────────┘ │
│                                                       │
│  [Tab Actividad: gráfico semanal, forecast, stats]    │
└─────────────────────────────────────────────────────┘
```

### Cambios clave respecto a la versión actual

| Aspecto | Actual | Rediseño |
|---------|--------|----------|
| Stats | Sección separada debajo del hero | Burbujas glassmorphism **integradas dentro del hero** |
| Hero | Click en toda la card navega | Card completa es clickeable + cada módulo activo también |
| Timer | Barra de progreso abajo | Contador "Auto en 8s" integrado como badge |
| Module rows | 3 líneas de texto (título, barra, scores) | Compacto: icono + título + barra + score + botón |
| Grado de animación | Solo iconos con hover simple | 3D spring: rotateY, perspective, translateZ, stagger |
| Tabs | Fondo gris con píldoras | Botones grandes con gradient activo y spring scale |
| Diseño general | Plano, muchas separaciones | Glassmorphism, gradientes, sombras profundas |

---

## 2. Estados del Dashboard

### A. Sin progreso (nuevo usuario)
- Hero sin stats (solo icono rocket + "Comienza Módulo 1")
- Stats en 0 con glassmorphism más tenue
- MiniStat igual pero valores en 0

### B. Curso completado
- Hero con icono trophy flotante + gradiente corporate→petroleum
- Stats flotantes con valores completos
- Módulos todos en estado "Revisar"
- Tab Actividad con datos completos

### C. En progreso (principal)
- Como se describe en la arquitectura arriba
- Timer auto-redirección activo (10s → 8s)

---

## 3. Animaciones 3D (framer-motion)

### Hero card
- `whileHover`: `scale(1.015) rotateY(1.5deg) perspective(800px) translateZ(4px)`
- `whileTap`: `scale(0.98)`
- `transition`: `type: 'spring', stiffness: 350, damping: 16`
- Decoración: 2 círculos blur desplazados

### Icono CTA del hero
- `whileHover`: `scale(1.25) rotateY(20deg) perspective(400px) translateZ(10px)`
- `transition`: `type: 'spring', stiffness: 400, damping: 10`
- `animate`: `y: [0, -3, 0]` (flotación continua, duración 3s, repeat Infinity)

### Stats flotantes (glassmorphism)
- `whileHover`: `translateY(-6px) scale(1.05)` + aumentar opacidad del fondo
- `transition`: `type: 'spring', stiffness: 350, damping: 14`
- CSS: `backdrop-filter: blur(12px)`, borde sutil `rgba(255,255,255,0.06)`

### Tabs (píldoras)
- `whileHover`: `scale(1.03)`
- `whileTap`: `scale(0.95)`
- `transition`: `type: 'spring', stiffness: 500, damping: 14`
- Tab activo: gradient petroleum→corporate + sombra
- Tab inactivo: fondo `rgba(241,245,249,0.8)` → hover a `#e2e8f0`

### Module rows
- `whileHover`: `translateX(6px) scale(1.01)` + sombra elevada
- `transition`: `type: 'spring', stiffness: 300, damping: 16`
- Fila activa (módulo actual): borde izquierdo 3px gradient + sombra corporate

### Iconos de módulos
- `whileHover`: `scale(1.2) rotateY(15deg)` (o `rotateZ(8deg)` para el activo)
- `transition`: `type: 'spring', stiffness: 400, damping: 10`

### Botones de acción (Continuar / Revisar)
- `whileHover`: `scale(1.08)` + sombra glow
- `whileTap`: `scale(0.92)`
- `transition`: `type: 'spring', stiffness: 500, damping: 12`
- Botón "Continuar": gradient petroleum→corporate + `box-shadow` corporate glow
- Botón "Revisar": fondo `#f1f5f9` → hover `#e2e8f0`

### Stagger entrance (al montar el dashboard)
- Module rows aparecen secuencialmente: `initial: { opacity: 0, x: -15 }`, `animate: { opacity: 1, x: 0 }`
- Delay: `index * 0.06`, duration: `0.3`, ease: `easeOut`

### Floating decorative
- Icono rocket/trophy en estados A/B: `animate: { y: [0, -4, 0] }`, duración 3.5s, repeat Infinity

---

## 4. Información a Mantener (sin pérdida de datos)

| Dato | Fuente | Ubicación en UI |
|------|--------|-----------------|
| XP total | `useIALabStore(s => s.xp)` | Stats flotante #1 |
| Racha (streak) | `useIALabStore(s => s.streak)` | Stats flotante #2 |
| Score promedio | `stats.avgScore` (useMemo) | Stats flotante #3 |
| Progreso del curso % | `useIALabStore(s => s.courseProgress)` | Barra en hero |
| Módulos (M1-M5) | `useIALabStore(s => s.moduleProgress)` | Module rows |
| Score por módulo | `moduleProgress[currentScore]` | Barra + número en cada row |
| Examen por módulo | `completedExams[id]` | Solo en módulos completados |
| Challenge por módulo | `challengeScores[id]` | Solo en módulos completados |
| Suggested action | `getNextSuggestedAction()` | Hero CTA label |
| Module titles | `getModules(locale)` | Module rows |
| Weekly data | `useMemo` con startDate + xp | Tab Actividad (gráfico) |
| Completion forecast | `usePersonalizedRecommendations()` | Tab Actividad (card) |
| Time tracking | `useActivityTracker().getTimeTrackingStats()` | Tab Actividad (stats) |

---

## 5. Navegación Funcional

| Elemento | Acción |
|----------|--------|
| Hero completo (click/tap) | Navigate a suggestedAction.moduleId o /ialab/1 |
| Botón "Continuar" en módulo activo | Navigate a `/ialab/{moduleId}` |
| Botón "Revisar" en módulo completado | Navigate a `/ialab/{moduleId}` |
| Timer auto-redirección (10s inactividad) | Navigate a suggestedAction.moduleId |
| Clic en tab "Tu Progreso" | Muestra module rows |
| Clic en tab "Actividad" | Muestra gráficos + forecast + stats |
| Icono CTA del hero | Animación flotante, al hacer click navega |

---

## 6. Restricciones Técnicas

- **Sin nuevas dependencias**: framer-motion 12 ya instalado
- **Colores exclusivos**: petroleum (#004B63), corporate (#00BCD4) — sin emerald/amber/orange
- **Colores de módulos**: `{1: '#4DA8C4', 2: '#66CCCC', 3: '#B2D8E5', 4: '#004B63', 5: '#FFD166'}`
- **Stack**: React 18 + Zustand 5 + Recharts 3 + Tailwind 3.4 + framer-motion 12
- **Tamaño objetivo**: < 550 líneas en IALabDashboard.jsx
- **Iconos**: Usar `<Icon name="fa-*">` del mapping existente (iconMapping.jsx)
- **i18n**: Usar `useTranslation()` + keys existentes en es.json/en.json

---

## 7. Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/IALab/IALabDashboard.jsx` | Rediseño completo: hero + stats flotantes + tabs + module rows + animaciones 3D |
| `src/i18n/es.json` | Posibles nuevas keys para labels del hero |
| `src/i18n/en.json` | Posibles nuevas keys para labels del hero |

---

## 8. No Incluir en Este Rediseño

- ✗ Nuevas secciones o páginas
- ✗ Cambios en la lógica del store (getNextSuggestedAction, moduleProgress, etc.)
- ✗ Nuevos hooks o servicios
- ✗ Modificaciones a IALab.jsx, IALabHeader, IALabSidebar u otros componentes
- ✗ Migración de datos
