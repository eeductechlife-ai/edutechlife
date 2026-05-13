# Plan: Optimización de Movimiento de Bolas 3D

## Diagnóstico

### Componentes con bolas/partículas animadas

| Componente | Archivo | Estado |
|---|---|---|
| **FloatingParticles** (uso principal) | `FloatingParticles.jsx` | ✅ Activo en Landing + Loading |
| **Loading inline float-3d** (5 bolas) | `LoadingScreen.jsx` | ✅ Activo en Loading |
| **bg-orb** (3 orbes grandes) | `index.css` | ✅ Activo en Loading |
| **NeuralOracle** (3D orbiting) | `3D/NeuralOracle.jsx` | ❌ Dead code (nunca importado) |
| **ParticlesOrb** (3D sphere) | `ParticlesOrb.jsx` | ❌ Dead code (nunca importado) |
| **NeuroEntorno float-3d** | `NeuroEntorno.jsx` | 🔶 Página separada |
| **DiagnosticoVAK orbs/particles** | `DiagnosticoVAK.jsx` + `.css` | 🔶 Página separada |

### Bugs Críticos

1. **`FloatingParticles.jsx`**: `Math.random()` en `animate.x / animate.y` se re-evalúa en CADA render
2. **`NeuralOracle.jsx`**: `Math.random()` en `OrbitingBola` transition.duration se re-evalúa en cada render

---

## Archivos y Ediciones Específicas

### 1. `src/components/FloatingParticles.jsx` — Prioridad #1

**BUG FIX + OPTIMIZACIÓN COMPLETA**

| Línea | Cambio | Antes | Después | Razón |
|---|---|---|---|---|
| 14-15 | Spring mass/peso | `stiffness:1, damping:120, mass:20` | `stiffness:1, damping:140, mass:35` | Más inercia = movimiento ultralento hiperrealista |
| 36-37 | Guardar micro-offset en data | (no existía) | `microOffsetX: Math.random() * 2 - 1` | FIX: evita re-evaluación de Math.random() en render |
| 40-41 | Duración ciclos | `240-420s` (4-7 min) | `360-600s` (6-10 min) | Ciclos más largos = movimiento más lento |
| 43-44 | Parallax factor (más sutil) | `0.005-0.05` | `0.003-0.033` | Parallax más leve para hiperrealismo |
| 44 | Opacidad base reducida | `0.15 / 0.3` | `0.12 / 0.25` | Más sutileza visual |
| 93-96 | Micro-movimiento | `Math.random()*4-2` (máx 4px, bug) | `data.microOffsetX/Y` (máx 2px, fijo) | FIX bug + reducción de movimiento |
| 97-99 | Variación opacidad/scale | `0.9-1.1x / 1-1.015x` | `0.95-1.05x / 1-1.008x` | Pulsación más sutil |
| 99-101 | Transiciones más lentas | `60/80s` | `80/100s` | Animaciones más lentas |

### 2. `src/components/LoadingScreen.jsx` — Prioridad #1

| Línea | Cambio | Antes | Después |
|---|---|---|---|
| 50 | FloatingParticles count | `count={55}` | `count={24}` |
| 53 | float-3d bola 1 | `6s` | `22s` |
| 54 | float-3d bola 2 | `8s` | `28s` |
| 55 | float-3d bola 3 | `7s` | `25s` |
| 56 | float-3d bola 4 | `9s` | `30s` |
| 57 | float-3d bola 5 | `6s` | `20s` |

### 3. `src/index.css` — Prioridad #1

| Línea | Selector/Prop | Antes | Después |
|---|---|---|---|
| 8441 | `.bg-orb.orb-1` animation-duration | `8s` | `22s` |
| 8451 | `.bg-orb.orb-2` animation-duration | `10s` | `28s` |
| 8462 | `.bg-orb.orb-3` animation-duration | `6s` | `18s` |

### 4. `src/components/3D/NeuralOracle.jsx` — Prioridad #2

**BUG FIX + SLOW DOWN**

| Línea | Cambio | Antes | Después |
|---|---|---|---|
| 12 | Orbit duration (BUG FIX) | `Math.random() * 20 + 30` | Valores fijos duros: primera orbita `60`, segunda `75`, tercera `90` |
| 18 | Contra-rotación (BUG FIX) | `Math.random() * 20 + 30` | Mismo valor fijo que su orbita contenedora |
| 74-91 | Ring orbit speeds | `18s / 28s / 22s` | `45s / 60s / 50s` |
| 50-53 | Core breathing | `duration: 6, scale: [1,1.05,1]` | `duration: 15, scale: [1,1.03,1]` |
| 60-62 | Internal pulsing light | `duration: 3` | `duration: 8` |

### 5. `src/components/ParticlesOrb.jsx` — Prioridad #2

| Línea | Cambio | Antes | Después |
|---|---|---|---|
| 57 | Mouse lerp | `0.05` | `0.015` |
| 88 | Background glow pulse | `4s` | `12s` |
| 97 | Rotation influence | `targetRef.current.x * 20` | `targetRef.current.x * 10` |
| 30-31 | Float animation duration | `4 + Math.random() * 4` | `20 + Math.random() * 20` |
| 31 | Rotación interna | (sin usar) | Se aplica rotación lenta al contenedor |

### 6. `src/components/DiagnosticoVAK/DiagnosticoVAK.css` — Prioridad #3

| Línea | Selector | Antes | Después |
|---|---|---|---|
| 2400 | `.animate-float-3d` | `6s` | `20s` |
| 2388 | `.animate-orb-1` | `15s` | `35s` |
| 2392 | `.animate-orb-2` | `18s` | `40s` |
| 2396 | `.animate-orb-3` | `12s` | `30s` |

### 7. `src/components/DiagnosticoVAK/DiagnosticoVAK.jsx` — Prioridad #3

| Línea | Cambio | Antes | Después |
|---|---|---|---|
| 2284 | 20 particles float-3d inline durations | `8 + Math.random() * 4` | `20 + Math.random() * 15` |
| 2304 | 20 particles remove `blur-sm` | `bg-gradient-to-br... blur-sm` | Sin blur (ya removido) |

---

## Resumen de Valores Finales de FloatingParticles

**Después de editar `FloatingParticles.jsx`:**

```jsx
const springX = useSpring(mouseX, { stiffness: 1, damping: 140, mass: 35 });
const springY = useSpring(mouseY, { stiffness: 1, damping: 140, mass: 35 });

const particle = {
  durationX: Math.random() * 240 + 360,  // 6-10 min
  durationY: Math.random() * 240 + 360,  // 6-10 min
  delay: Math.random() * -240,
  microOffsetX: Math.random() * 2 - 1,   // max 1px (fijo)
  microOffsetY: Math.random() * 2 - 1,   // max 1px (fijo)
  parallaxFactor: isBackground ? 0.003 : 0.008,  // reducido
  opacityBase: isBackground ? 0.12 : 0.25,       // reducido
};

// En animate:
animate={{
  opacity: [base*0.95, base*1.05, base*0.95],
  scale: [1, 1.008, 1],
  x: [0, data.microOffsetX, 0],
  y: [0, data.microOffsetY, 0],
}}
transition={{
  opacity: { duration: 80, ... },
  scale: { duration: 100, ... },
  x: { duration: data.durationX, ... },     // 6-10 min
  y: { duration: data.durationY, ... },     // 6-10 min
}}
```
