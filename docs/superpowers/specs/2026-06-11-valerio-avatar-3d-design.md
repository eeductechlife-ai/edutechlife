# ValerioAvatar 3D Ilusionista Premium — Design Doc

## Resumen
Reescribir `ValerioAvatar.jsx` para convertir el avatar 2D en un avatar 3D ilusionista con capas de profundidad, animación corporal independiente, partículas ambientales, lip-sync avanzado y parallax 3D. Cero nuevas dependencias.

## Arquitectura
Canvas único donde se renderizan 3 capas compositadas en orden Z:

```
Layer 0 (Fondo)    — Gradiente + partículas lentas       parallax * 0.3
Layer 1 (Avatar)   — VALERIO.png + animación corporal     parallax * 0.6
Layer 2 (Frente)   — Glow + anillos + partículas rápidas  parallax * 1.0
```

Cada capa recibe un offset de parallax distinto basado en posición del mouse para crear profundidad 3D real.

## Estado
```
idle       → cyan, movimiento lento
listening  → verde, partículas suaves
thinking   → violeta, ojos mirando arriba, partículas circulares
speaking   → azul, boca activa, partículas rápidas
```

## Animaciones

### Corporales
- **Cabeza:** sway ±2° en seno compuesto (t*0.5 + t*1.3)
- **Cuerpo:** sway ±0.8° desfasado (t*0.3 + 1)
- **Hombros:** suben/bajan al respirar (t*0.8), offset 2px
- **Micro-sway:** 4 ondas superpuestas con amplitudes y frecuencias distintas

### Boca (6 fonemas)
| Fonema | Forma | Uso |
|--------|-------|-----|
| reposo | línea recta | idle, entre palabras |
| abierta | elipse grande | vocales A, E |
| ancha | elipse ancha plana | E, I |
| redonda | círculo | O, U |
| sonrisa | curva hacia arriba | transiciones |
| mandíbula | elipse abajo | consonantes fuertes |
Transición aleatoria entre fonemas cada 80-150ms al hablar.

### Ojos
- **Iris** sigue mouse con factor 0.15 (máximo ±4px)
- **Pupila** se dilata: idle=0.35, thinking=0.45, speaking=0.30
- **Párpado** blink con easing cúbico, a veces medio-blink
- **Brillo** de córnea (punto blanco semitransparente)

### Partículas (20-25)
- Posición inicial aleatoria en un radio de 0.5×-1.5× del avatar
- Velocidad: lenta (idle) → rápida (speaking)
- Tamaño: 2-6px
- Opacidad: 0.08-0.4 según estado
- Color: basado en `STATE_COLORS`
- En speaking: orbitan más rápido, brillan más, a veces "explotan" desde el centro

### Contenedor (Framer Motion)
- Entrada: `spring` con stiffness 200, damping 20
- Flotación suave: `y: [0, -2, 0]` loop 4s
- Rotación micro: `rotate: [-0.5, 0.5]` loop 6s

## Props
```jsx
state, size, enable3DTilt // igual que antes
```

## Dependencias
- Sin cambios en `package.json`
- Sin Three.js, sin Spline, sin WebGL
- Canvas 2D + Framer Motion (ya existe)

## Rendimiento
- `requestAnimationFrame` con `willChange: transform` en canvas
- Partículas: máximo 25, recicladas
- Imagen: precargada una vez, cacheada
- Optimización: evitar `save/restore` excesivos
