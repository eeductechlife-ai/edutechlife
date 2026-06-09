# IALab Dashboard — Hero Glass 3D Depth

## Objetivo
Rediseñar el hero principal del IALabDashboard (estado InProgress) con glassmorphism 3D, orbes animados, anillo SVG timer, stats con stagger y datos explicados. Mantener colores petroleum/corporate, iconos existentes, sin nuevas dependencias.

## Cambios

### 1. Background con orbes glass
- linear-gradient(135deg, #004B63, #003549, #00BCD4)
- 3 orbes flotantes (position absolute, blur-3xl) con animation float orb 6-10s
- Shine sweep overlay: gradient linear 105deg, background-position 4s infinite

### 2. Progress bar
- Header con icono graduación + label "Progreso del curso" + badge % pill
- Track 4px con fill gradient (corporate → white) + dot brillante al final (shadow glow)

### 3. Action icon con glow ring
- Icono CTA existente con translateY [0,-3,0] 3s infinite
- Glow ring: border 2px corporate/30 + pulse-ring 2s infinite
- whileHover: scale(1.2) rotateY(20deg)

### 4. Timer como SVG circular
- Reemplazar badge inline por SVG ring (viewBox 0 0 48 48, r=22)
- bg-ring: stroke white/08, progress-ring: stroke corporate/70 stroke-linecap round
- stroke-dasharray 138.23 con dashoffset dinámico según idlePct
- Timer text centrado: icono clock + segundos

### 5. Stats como glass bubbles
- Cada stat: glass bg (rgba white/08) + backdrop-blur(16px) + border white/06
- stagger-in animation: 0.4s fadeInUp con delay escalonado (0, 0.08s, 0.16s)
- whileHover: translateY(-3px) scale(1.03) + shadow
- Iconos con bg tint: XP (corporate/15), Streak (petroleum/20), Score (white/08)
- Descripciones: "Tu experiencia acumulada", "Días consecutivos", "Exámenes completados"

### 6. Hover del hero
- whileHover: scale(1.012) rotateY(1.8deg) spring stiffness 350 damping 16
- whileTap: scale(0.98)
- perspective: 800 (ya existe)
- Enhanced shadow: 0 30px 80px petroleum/40

### 7. Estados no-progress y completed
- Mantener estructura actual con las mismas mejoras de stats (glass bubbles + stagger + descripciones)
- No-progress: rocket flotante + stats explicadas
- Completed: trophy flotante + stats explicadas

## Colores
- Petroleum #004B63, Corporate #00BCD4, Blanco #fff
- Glass: rgba(255,255,255,0.08) bg, rgba(255,255,255,0.06) border
- Stats XP icon: corporate/15 bg, corporate text
- Stats Streak icon: petroleum/20 bg, petroleum text
- Stats Score icon: white/08 bg, white text
- Timer ring: corporate/70 stroke
- Sin emerald/amber/orange/teal

## Archivos a modificar
- `src/components/IALab/IALabDashboard.jsx` — solo el hero del InProgress state (líneas 319-375)
