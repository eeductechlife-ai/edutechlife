# Plan: Dar Vida a Valerio — Avatar Animado 3D Premium

## Visión General

Transformar Valerio de una imagen PNG estática a un avatar vivo con animación 3D,
movimiento de boca al hablar, parpadeo, respiración y efectos visuales premium.

**Arquitectura:** Canvas 2D + CSS 3D transforms + Framer Motion
- Canvas dibuja la imagen real de VALERIO.png con overlays animados (boca, ojos)
- CSS 3D transforms (perspective, rotateX, rotateY) crean ilusión 3D
- Framer Motion maneja entradas, gestos y transiciones de estado
- Sin dependencias externas nuevas (todo existe en el proyecto)

---

## Fase 1: ValerioAvatar Animado (Canvas + Imagen Real)

**Archivo:** `src/components/ValerioAvatar.jsx` (reescritura)

### 1.1 Carga de imagen en Canvas (línea base)

| Tarea | Detalle |
|-------|---------|
| Cargar `/VALERIO.png` con `new Image()` | Caché del navegador, se reusa tras primera carga |
| Dibujar imagen escalada al centro del canvas | `ctx.drawImage(img, dx, dy, dWidth, dHeight)` con `cover` |
| Aplicar máscara circular | `ctx.beginPath() + ctx.arc() + ctx.clip()` |
| Mantener dimensiones | Canvas = `size × size` (prop `size`), imagen centrada |

### 1.2 Sistema de capas de animación

```
┌──────────────────────────────────┐
│  Capa 1: Imagen VALERIO.png      │ ← base estática
│  Capa 2: Overlay de color (glow)  │ ← según estado (idle/listen/think/speak)
│  Capa 3: Boca animada             │ ← elipse que se abre/cierra
│  Capa 4: Ojos con parpadeo        │ ← párpados que bajan cada 3-5s
│  Capa 5: Partículas ambientales   │ ← puntos flotantes sutiles
│  Capa 6: Anillo de pulso          │ ← círculo expansivo según estado
└──────────────────────────────────┘
```

### 1.3 Estados y animaciones

| Estado | Boca | Ojos | Glow | Partículas | Anillo |
|--------|------|------|------|------------|--------|
| **idle** | Cerrada | Parpadeo cada 4s | Cyan suave (#4DA8C4 10%) | 3 partículas lentas | No |
| **listening** | Semi-abierta | Abiertos | Verde esmeralda (#10B981 20%) | 5 partículas | Sí, pulso verde |
| **thinking** | Cerrada | Semi-cerrados, mirando arriba | Púrpura (#8B5CF6 20%) | 6 partículasórbita | Sí, pulso lila |
| **speaking** | Abriendo/cerrando con ritmo de habla | Abiertos | Cyan brillante (#0EA5E9 30%) | 8 partículas activas | Sí, pulso rápido |

### 1.4 Animación de boca (speaking)

```
src/components/ValerioAvatar.jsx

drawMouth(ctx, cx, cy, time, state):
  if state === 'idle':
    → línea recta (boca cerrada)
  if state === 'listening':
    → elipse pequeña fija (semi-abierta)
  if state === 'thinking':
    → línea recta (boca cerrada)
  if state === 'speaking':
    → elipse que varía:
        ancho  = size * 0.12 + sin(time * 12) * size * 0.04
        alto   = size * 0.04 + abs(sin(time * 10)) * size * 0.05
        forma  = arco (feliz) o elipse (neutral) alternando
        ritmo  = 10-14 Hz (simula habla natural)
```

### 1.5 Parpadeo de ojos

```
blinkInterval = 3000 + random(2000)  // cada 3-5 segundos
blinkDuration = 100ms                // duración del parpadeo

drawEyes(ctx, cx, cy, time, state, isBlinking):
  if isBlinking:
    → dibujar párpados cerrados (líneas horizontales)
  else:
    → dibujar ojos abiertos (círculos pequeños)
    → en estado 'thinking', pupilas mirando arriba
```

### 1.6 Efecto 3D con CSS

```jsx
// El contenedor del canvas tiene perspectiva 3D
<div style={{
  perspective: '800px',
  transformStyle: 'preserve-3d',
}}>
  <canvas
    ref={canvasRef}
    style={{
      transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      transformStyle: 'preserve-3d',
      transition: 'transform 0.1s ease-out',
      borderRadius: '50%',
      boxShadow: '0 8px 32px rgba(0,75,99,0.3)',
    }}
  />
</div>
```

### 1.7 Pointer tilt (efecto 3D follow)

```
onPointerMove(event):
  rect = canvas.getBoundingClientRect()
  cx = rect.left + rect.width / 2
  cy = rect.top + rect.height / 2
  tiltX = (event.clientY - cy) / 15   // rango -5 a +5 grados
  tiltY = (event.clientX - cx) / 15   // rango -5 a +5 grados
  aplicar a canvas.style.transform

onPointerLeave():
  tiltX = 0, tiltY = 0  // reset suave con transition
```

### 1.8 Partículas ambientales

```
ORBITAL_PARTICLES = [
  { size: 2, orbit: 40, duration: 4, delay: 0, color: '#00BCD4' },
  { size: 1.5, orbit: 48, duration: 5, delay: 0.5, color: '#4DA8C4' },
  { size: 2, orbit: 35, duration: 3.5, delay: 1, color: '#00BCD4' },
  { size: 1.5, orbit: 50, duration: 4.5, delay: 1.5, color: '#004B63' },
  { size: 2, orbit: 42, duration: 3.8, delay: 2, color: '#4DA8C4' },
]

drawParticle(ctx, cx, cy, time, particle, index):
  angle = time * (2π / particle.duration) + particle.delay
  px = cx + cos(angle) * particle.orbit
  py = cy + sin(angle) * particle.orbit
  alpha = 0.3 + sin(time * 2 + index) * 0.15
  ctx.beginPath()
  ctx.arc(px, py, particle.size, 0, 2π)
  ctx.fillStyle = rgba(particle.color, alpha)
  ctx.fill()
```

### 1.9 Props del componente

```jsx
ValerioAvatar.propTypes = {
  state: PropTypes.oneOf(['idle', 'listening', 'thinking', 'speaking']),
  size: PropTypes.number,           // default 80
  onStateChange: PropTypes.func,
  enable3DTilt: PropTypes.bool,     // default true (false en floating button small)
  enableParticles: PropTypes.bool,  // default true
  enableBlink: PropTypes.bool,      // default true
}
```

---

## Fase 2: Floating Button con Avatar Vivo

**Archivo:** `src/components/IALab/ValerioFloatingButton.jsx` (modificación)

### 2.1 Reemplazar img estática por ValerioAvatar animado

```jsx
// Antes:
<img src="/VALERIO.png" alt="Valerio" className="w-full h-full object-cover" />

// Después:
<ValerioAvatar
  state={valerioState}
  size={isLarge ? 80 : 64}
  enable3DTilt={true}
  enableParticles={true}
  enableBlink={true}
/>
```

### 2.2 Conectar estado de habla

```jsx
// Escuchar el estado global de Valerio (via window.valerioSpeak o contexto)
const [valerioState, setValerioState] = useState('idle')

useEffect(() => {
  window.__valerioStateCallback = setValerioState
  return () => { delete window.__valerioStateCallback }
}, [])
```

### 2.3 Mejorar tooltip

- Tooltip aparece con delay de 1s (no inmediato)
- Tooltip se oculta al hacer clic
- Agregar micro-interacción: tooltip entra con spring

### 2.4 Mantener indicador online + glow de vida

- Indicador verde con ping (se mantiene)
- Glow radial detrás del avatar (se mantiene)
- Agregar anillo de pulso que cambia según estado

---

## Fase 3: Integración en Panel Header

**Archivo:** `src/components/IALab/IALabValerioPanel/ValerioPanelHeader.jsx` (modificación)

### 3.1 Usar nuevo ValerioAvatar en header

Ya usa `ValerioAvatar` — solo necesita pasar las nuevas props:

```jsx
<ValerioAvatar
  state={valerioState}
  size={48}
  onStateChange={setValerioState}
  enable3DTilt={true}
  enableParticles={true}
  enableBlink={true}
/>
```

### 3.2 Estado en tiempo real

ValerioPanelHeader ya recibe `valerioState` del panel padre. El panel padre
actualiza el estado cuando `speakTextConversational` se ejecuta. Esto ya
funciona — solo asegurar que el nuevo Avatar lo use correctamente.

---

## Fase 4: Optimización y QA

### 4.1 Performance

| Técnica | Implementación |
|---------|---------------|
| `requestAnimationFrame` | Solo dibujar cuando hay cambios visibles |
| `renderOnDemand` | Pausar animación cuando el componente no está en viewport (IntersectionObserver) |
| `willChange: transform` | GPU acceleration para tilt 3D |
| Memoización | `React.memo` en ValerioAvatar para evitar re-renders |
| Tamaño canvas | No exceder 200×200 para floating button (resolución nativa de 80×80) |

### 4.2 Reduced Motion

```jsx
const prefersReducedMotion = useReducedMotion()

useEffect(() => {
  if (prefersReducedMotion) {
    // Desactivar partículas, parpadeo, pulso
    // Mantener solo boca al hablar (esencial)
  }
}, [prefersReducedMotion])
```

### 4.3 Touch devices

- En dispositivos táctiles el tilt 3D se desactiva (no hay hover)
- Touch feedback: escala al presionar
- Partículas se reducen un 50%

---

## Resumen de Archivos

| Archivo | Acción | Líneas estimadas |
|---------|--------|-----------------|
| `src/components/ValerioAvatar.jsx` | **Reescribir** (~290 → ~400) | +110 |
| `src/components/IALab/ValerioFloatingButton.jsx` | **Modificar** (~110 → ~130) | +20 |
| `src/components/IALab/IALabValerioPanel/ValerioPanelHeader.jsx` | **Modificar** (~70 → ~75) | +5 |
| `src/components/IALab/IALabValerioPanel/index.jsx` | **Modificar** (opcional) | ~+10 |
| `public/VALERIO.png` | **Sin cambios** (usado como está) | — |

**Total:** ~145 líneas nuevas, 0 nuevas dependencias.

---

## Orden de Implementación

```
Día 1: Fase 1 (ValerioAvatar canvas + imagen + capas)
  └─ 1.1 Carga y dibujo de imagen
  └─ 1.3 Estados y glows
  └─ 1.4 Boca animada
  └─ 1.5 Parpadeo

Día 2: Fase 1 (efectos + 3D)
  └─ 1.6 Efecto 3D CSS
  └─ 1.7 Pointer tilt
  └─ 1.8 Partículas
  └─ 4.2 Reduced motion support

Día 3: Fases 2-4 (integración + QA)
  └─ 2.1 Floating button con avatar vivo
  └─ 2.2 Conexión estado de habla
  └─ 3.1 Panel header actualizado
  └─ 4.1 Performance
  └─ 4.3 Touch devices
```
