# Valerio Avatar Premium - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescribir ValerioAvatar.jsx con un avatar premium de estilo realista (profesor 40 años, barba, pelo ondulado) usando SVG + Framer Motion.

**Architecture:** SVG declarativo con gradientes radiales/lineales para iluminación 3D, filtros SVG para glow/sombras, y Framer Motion para animaciones (respirar, balanceo, parpadeo, boca hablando, puntos de pensamiento, pulso de escucha, partículas).

**Tech Stack:** React, Framer Motion, SVG

---

## File Structure

- **Modify:** `edutechlife-frontend/src/components/ValerioAvatar.jsx` (reemplazar completamente)

---

### Task 1: Setup y estructura base del SVG

**Files:**
- Modify: `edutechlife-frontend/src/components/ValerioAvatar.jsx:1-176`

- [ ] **Step 1: Definir imports y constants**

```jsx
import { useEffect, useRef, useCallback } from 'react'
import { motion, useAnimation, useMotionValue } from 'framer-motion'
import { speakTextConversational, stopSpeech } from '../utils/speech'

const STATE_COLORS = {
  idle: { r: '0,75,99' },      // #004B63
  listening: { r: '16,185,129' }, // #10B981
  thinking: { r: '139,92,246' },  // #8B5CF6
  speaking: { r: '14,165,233' },  // #0EA5E9
}

const MOUTH_PATHS = [
  'M88,92 Q94,88 100,90 Q106,88 112,92',  // idle
  'M88,92 Q94,90 100,92 Q106,90 112,92',  // listening
  'M92,92 Q100,88 108,92',                 // thinking
  'M86,90 Q94,86 100,88 Q106,86 114,90',  // speaking wide
  'M88,92 Q94,90 100,92 Q106,90 112,92',  // speaking narrow
  'M88,91 Q94,89 100,91 Q106,89 112,91',  // speaking medium
]
```

- [ ] **Step 2: Crear componente con hooks básicos**

```jsx
const ValerioAvatar = ({ state = 'idle', size = 80, enable3DTilt = true }) => {
  const svgRef = useRef(null)
  const animRef = useRef(null)
  const stateRef = useRef(state)
  stateRef.current = state
  
  const blink = useRef({ next: Date.now() + 2000 + Math.random() * 3000, phase: 'open' })
  const sac = useRef({ x: 0, y: 0, next: Date.now() + 300 + Math.random() * 400 })
  const pho = useRef({ idx: 0, next: Date.now() + 100 })
  const tilt = useRef({ x: 0, y: 0 })
  const ptr = useRef({ x: 0, y: 0 })
  
  const colors = STATE_COLORS[state] || STATE_COLORS.idle
  const blinkCtrl = useAnimation()
  const breathY = useMotionValue(0)
  const swayX = useMotionValue(0)
  const sacX = useMotionValue(0)
  const sacY = useMotionValue(0)
```

- [ ] **Step 3: Verificar que el archivo compila**

Run: `cd edutechlife-frontend && npm run build 2>&1 | head -20`
Expected: Build exitoso sin errores de sintaxis

---

### Task 2: Efecto de respirar y balanceo (breath + sway)

**Files:**
- Modify: `edutechlife-frontend/src/components/ValerioAvatar.jsx:24-47`

- [ ] **Step 1: Implementar useEffect para breath/sway/blink**

```jsx
useEffect(() => {
  let active = true
  const animate = () => {
    if (!active) return
    const t = Date.now() * 0.001
    
    // Breath: gentle Y oscillation
    breathY.set(Math.sin(t * 2.1) * 2 + Math.sin(t * 4.3) * 0.5)
    
    // Sway: subtle X movement
    swayX.set(Math.sin(t * 0.7) * 1 + Math.sin(t * 1.3) * 0.5)
    
    // Saccadic eye movement
    if (Date.now() > sac.current.next) {
      sac.current.x = (Math.random() - 0.5) * 2
      sac.current.y = (Math.random() - 0.5) * 1
      sac.current.next = Date.now() + 200 + Math.random() * 300
    }
    
    // Speaking mouth index
    const currentState = stateRef.current
    if (currentState === 'speaking' && Date.now() > pho.current.next) {
      pho.current.idx = Math.floor(Math.random() * MOUTH_PATHS.length)
      pho.current.next = Date.now() + 80 + Math.random() * 70
    }
    
    sacX.set(sac.current.x)
    sacY.set(sac.current.y)
    
    // Blink logic
    if (Date.now() > blink.current.next && blink.current.phase === 'open') {
      blink.current.phase = 'closing'
      blinkCtrl.start({ scaleY: 0 }, { duration: 0.06, ease: 'easeIn' }).then(() => {
        blinkCtrl.start({ scaleY: 1 }, { type: 'spring', stiffness: 500, damping: 18 })
      })
      blink.current.next = Date.now() + 60
    } else if (Date.now() > blink.current.next && blink.current.phase === 'closing') {
      blink.current.phase = 'open'
      blink.current.next = Date.now() + 2000 + Math.random() * 4000
    }
    
    animRef.current = requestAnimationFrame(animate)
  }
  
  animRef.current = requestAnimationFrame(animate)
  return () => {
    active = false
    if (animRef.current) cancelAnimationFrame(animRef.current)
  }
}, [blinkCtrl, breathY, swayX, sacX, sacY])
```

- [ ] **Step 2: Verificar que el archivo compila**

Run: `cd edutechlife-frontend && npm run build 2>&1 | head -20`
Expected: Build exitoso

---

### Task 3: speak() y window exports

**Files:**
- Modify: `edutechlife-frontend/src/components/ValerioAvatar.jsx:49-58`

- [ ] **Step 1: Implementar speak callback y window exports**

```jsx
const speak = useCallback((text) => {
  if (!text) return
  const cleanText = text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/```/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[_*~]/g, '')
    .trim()
  if (cleanText) speakTextConversational(cleanText, 'valerio', () => {})
}, [])

useEffect(() => {
  window.valerioSpeak = speak
  window.__valerioStateRef = stateRef
  return () => {
    delete window.valerioSpeak
    delete window.__valerioStateRef
    stopSpeech()
  }
}, [speak])
```

- [ ] **Step 2: Verificar que el archivo compila**

Run: `cd edutechlife-frontend && npm run build 2>&1 | head -20`
Expected: Build exitoso

---

### Task 4: SVG defs (gradientes y filtros)

**Files:**
- Modify: `edutechlife-frontend/src/components/ValerioAvatar.jsx` (dentro del return)

- [ ] **Step 1: Agregar sección defs con todos los gradientes y filtros**

```jsx
return (
  <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    style={{ perspective: '800px', display: 'inline-flex', lineHeight: 0 }}>
    <motion.svg ref={svgRef} viewBox="0 0 200 200" width={size} height={size}
      style={{ borderRadius: '50%', transition: 'transform .06s ease-out', cursor: 'pointer',
        filter: `drop-shadow(0 4px 24px rgba(${colors.r},.2))` }}
      onPointerMove={(e) => {
        if (!enable3DTilt) return
        const rect = svgRef.current.getBoundingClientRect()
        const nx = (e.clientX - rect.left) / rect.width
        const ny = (e.clientY - rect.top) / rect.height
        tilt.current.x = ((ny - 0.5) * 2) * -12
        tilt.current.y = ((nx - 0.5) * 2) * 12
        ptr.current.x = (nx - 0.5) * 2
        ptr.current.y = (ny - 0.5) * 2
        svgRef.current.style.transform = `rotateX(${tilt.current.x}deg) rotateY(${tilt.current.y}deg)`
      }}
      onPointerLeave={() => {
        if (!enable3DTilt) return
        tilt.current = { x: 0, y: 0 }
        ptr.current = { x: 0, y: 0 }
        svgRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)'
      }}>
      <defs>
        {/* Skin gradient */}
        <radialGradient id="skin" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#EDCBA5"/>
          <stop offset="45%" stopColor="#D4A574"/>
          <stop offset="100%" stopColor="#B8896A"/>
        </radialGradient>
        
        {/* Hair gradient */}
        <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A3723"/>
          <stop offset="40%" stopColor="#3D2E20"/>
          <stop offset="100%" stopColor="#2C1810"/>
        </linearGradient>
        
        {/* Iris gradient with limbal ring */}
        <radialGradient id="iris" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#8B7355"/>
          <stop offset="60%" stopColor="#6B5038"/>
          <stop offset="90%" stopColor="#3D2E20"/>
          <stop offset="100%" stopColor="#1A1A1A"/>
        </radialGradient>
        
        {/* Blush gradient */}
        <radialGradient id="blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8ADA0" stopOpacity=".15"/>
          <stop offset="100%" stopColor="#E8ADA0" stopOpacity="0"/>
        </radialGradient>
        
        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Shadow filter */}
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity=".12"/>
        </filter>
      </defs>
```

- [ ] **Step 2: Verificar que el archivo compila**

Run: `cd edutechlife-frontend && npm run build 2>&1 | head -20`
Expected: Build exitoso

---

### Task 5: Hair (pelo con volumen)

**Files:**
- Modify: `edutechlife-frontend/src/components/ValerioAvatar.jsx`

- [ ] **Step 1: Agregar pelo trasero y capas de volumen**

```jsx
      {/* Hair back layer */}
      <path d="M55,45 C45,25 50,10 70,8 C85,6 115,6 130,8 C150,10 155,25 145,45 C140,35 125,25 105,22 C90,20 70,20 60,28 C55,32 52,40 55,45Z" fill="url(#hair)" filter="url(#shadow)"/>
      
      {/* Hair side layers (volume) */}
      <path d="M52,42 C48,55 47,70 50,80 C48,75 46,65 48,55Z" fill="url(#hair)"/>
      <path d="M148,42 C152,55 153,70 150,80 C152,75 154,65 152,55Z" fill="url(#hair)"/>
      
      {/* Hair shine */}
      <path d="M65,20 C75,15 125,15 135,20 C125,18 75,18 65,20Z" fill="rgba(90,55,35,.25)"/>
```

- [ ] **Step 2: Verificar que el archivo compila**

Run: `cd edutechlife-frontend && npm run build 2>&1 | head -20`
Expected: Build exitoso

---

### Task 6: Ears, neck, shirt collar

**Files:**
- Modify: `edutechlife-frontend/src/components/ValerioAvatar.jsx`

- [ ] **Step 1: Agregar orejas, cuello y collar**

```jsx
      {/* Ears */}
      <ellipse cx="52" cy="58" rx="8" ry="12" fill="url(#skin)"/>
      <ellipse cx="148" cy="58" rx="8" ry="12" fill="url(#skin)"/>
      <ellipse cx="52" cy="58" rx="5" ry="8" fill="rgba(184,137,106,.3)"/>
      <ellipse cx="148" cy="58" rx="5" ry="8" fill="rgba(184,137,106,.3)"/>
      
      {/* Neck */}
      <path d="M82,105 C80,115 78,128 80,138 L120,138 C122,128 120,115 118,105Z" fill="url(#skin)"/>
      <ellipse cx="100" cy="120" rx="14" ry="4" fill="rgba(0,0,0,.06)"/>
      
      {/* Shirt collar (no tie) */}
      <path d="M75,130 C78,125 85,118 100,115 C115,118 122,125 125,130 L130,145 L70,145Z" fill="#004B63"/>
      <path d="M88,125 L95,118 L100,120 L105,118 L112,125" fill="none" stroke="#00BCD4" stroke-width="1" opacity=".4"/>
```

- [ ] **Step 2: Verificar que el archivo compila**

Run: `cd edutechlife-frontend && npm run build 2>&1 | head -20`
Expected: Build exitoso

---

### Task 7: Face shape y 3D lighting zones

**Files:**
- Modify: `edutechlife-frontend/src/components/ValerioAvatar.jsx`

- [ ] **Step 1: Agregar forma de cara bezier y zonas de iluminación 3D**

```jsx
      {/* Face shape (bezier, not ellipse) */}
      <path d="M60,50 C55,60 52,75 55,90 C58,100 65,108 80,112 C90,114 110,114 120,112 C135,108 142,100 145,90 C148,75 145,60 140,50 C135,42 120,38 100,38 C80,38 65,42 60,50Z" fill="url(#skin)" filter="url(#shadow)"/>
      
      {/* 3D face lighting (8 zones) */}
      <ellipse cx="100" cy="48" rx="20" ry="12" fill="rgba(255,255,255,.08)"/>   {/* Forehead highlight */}
      <ellipse cx="70" cy="75" rx="12" ry="8" fill="rgba(0,0,0,.04)"/>            {/* Left cheek shadow */}
      <ellipse cx="130" cy="75" rx="12" ry="8" fill="rgba(0,0,0,.04)"/>           {/* Right cheek shadow */}
      <ellipse cx="100" cy="65" rx="6" ry="15" fill="rgba(255,255,255,.06)"/>     {/* Nose bridge */}
      <ellipse cx="82" cy="62" rx="10" ry="4" fill="rgba(255,255,255,.04)"/>      {/* Under-eye left */}
      <ellipse cx="118" cy="62" rx="10" ry="4" fill="rgba(255,255,255,.04)"/>     {/* Under-eye right */}
      <path d="M65,95 C75,105 125,105 135,95 C130,100 70,100 65,95Z" fill="rgba(0,0,0,.04)"/> {/* Jaw shadow */}
      <ellipse cx="100" cy="108" rx="8" ry="4" fill="rgba(255,255,255,.05)"/>     {/* Chin highlight */}
```

- [ ] **Step 2: Verificar que el archivo compila**

Run: `cd edutechlife-frontend && npm run build 2>&1 | head -20`
Expected: Build exitoso

---

### Task 8: Eyes (ojos con detalles)

**Files:**
- Modify: `edutechlife-frontend/src/components/ValerioAvatar.jsx`

- [ ] **Step 1: Agregar ojos con esclera, iris, pupila, reflejos, párpado**

```jsx
      {/* Left eye */}
      <g>
        <motion.g animate={blinkCtrl} style={{ originX: '82px', originY: '60px' }}>
          <ellipse cx="82" cy="60" rx="12" ry="8" fill="#F8F4EE"/>
          <circle cx={82 + ptr.current.x * 1.5 + sac.current.x * 0.3} cy={60 + ptr.current.y * 1 + sac.current.y * 0.3} r="5.5" fill="url(#iris)"/>
          <circle cx={82 + ptr.current.x * 1.5 + sac.current.x * 0.3} cy={60 + ptr.current.y * 1 + sac.current.y * 0.3} r="2.8" fill="#1A1A1A"/>
          <circle cx={80 + ptr.current.x * 1.5 + sac.current.x * 0.3} cy={58 + ptr.current.y * 1 + sac.current.y * 0.3} r="1.8" fill="rgba(255,255,255,.85)"/>
          <circle cx={84 + ptr.current.x * 1.5 + sac.current.x * 0.3} cy={61 + ptr.current.y * 1 + sac.current.y * 0.3} r="0.8" fill="rgba(255,255,255,.4)"/>
        </motion.g>
        <path d="M70,55 Q82,50 94,55" fill="none" stroke="rgba(60,40,25,.15)" strokeWidth="1"/>
        <path d="M72,65 Q82,68 92,65" fill="none" stroke="rgba(60,40,25,.1)" strokeWidth="0.5"/>
      </g>
      
      {/* Right eye */}
      <g>
        <motion.g animate={blinkCtrl} style={{ originX: '118px', originY: '60px' }}>
          <ellipse cx="118" cy="60" rx="12" ry="8" fill="#F8F4EE"/>
          <circle cx={118 + ptr.current.x * 1.5 + sac.current.x * 0.3} cy={60 + ptr.current.y * 1 + sac.current.y * 0.3} r="5.5" fill="url(#iris)"/>
          <circle cx={118 + ptr.current.x * 1.5 + sac.current.x * 0.3} cy={60 + ptr.current.y * 1 + sac.current.y * 0.3} r="2.8" fill="#1A1A1A"/>
          <circle cx={116 + ptr.current.x * 1.5 + sac.current.x * 0.3} cy={58 + ptr.current.y * 1 + sac.current.y * 0.3} r="1.8" fill="rgba(255,255,255,.85)"/>
          <circle cx={120 + ptr.current.x * 1.5 + sac.current.x * 0.3} cy={61 + ptr.current.y * 1 + sac.current.y * 0.3} r="0.8" fill="rgba(255,255,255,.4)"/>
        </motion.g>
        <path d="M106,55 Q118,50 130,55" fill="none" stroke="rgba(60,40,25,.15)" strokeWidth="1"/>
        <path d="M108,65 Q118,68 128,65" fill="none" stroke="rgba(60,40,25,.1)" strokeWidth="0.5"/>
      </g>
```

- [ ] **Step 2: Verificar que el archivo compila**

Run: `cd edutechlife-frontend && npm run build 2>&1 | head -20`
Expected: Build exitoso

---

### Task 9: Eyebrows, nose, mouth

**Files:**
- Modify: `edutechlife-frontend/src/components/ValerioAvatar.jsx`

- [ ] **Step 1: Agregar cejas, nariz y boca**

```jsx
      {/* Eyebrows */}
      <motion.path d="M68,48 Q75,44 88,47" fill="none" stroke="#3D2E20" strokeWidth="2.5" strokeLinecap="round"
        animate={{ d: state === 'thinking' ? 'M68,46 Q75,42 88,45' : state === 'listening' ? 'M68,46 Q75,43 88,46' : 'M68,48 Q75,44 88,47' }}/>
      <motion.path d="M112,47 Q125,44 132,48" fill="none" stroke="#3D2E20" strokeWidth="2.5" strokeLinecap="round"
        animate={{ d: state === 'thinking' ? 'M112,45 Q125,42 132,46' : state === 'listening' ? 'M112,45 Q125,43 132,46' : 'M112,47 Q125,44 132,48' }}/>
      
      {/* Nose */}
      <path d="M100,55 Q98,70 95,80 Q100,84 105,80 Q102,70 100,55" fill="none" stroke="rgba(160,120,85,.25)" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="95" cy="82" rx="2.5" ry="1.5" fill="rgba(160,120,85,.12)"/>
      <ellipse cx="105" cy="82" rx="2.5" ry="1.5" fill="rgba(160,120,85,.12)"/>
      
      {/* Mouth */}
      <motion.path d={MOUTH_PATHS[state === 'speaking' ? pho.current.idx : state === 'listening' ? 1 : state === 'thinking' ? 2 : 0]} 
        fill="none" stroke={state === 'listening' ? '#C97B6D' : '#B86556'} strokeWidth="1.8" strokeLinecap="round"
        animate={{ d: MOUTH_PATHS[state === 'speaking' ? pho.current.idx : state === 'listening' ? 1 : state === 'thinking' ? 2 : 0] }}
        transition={{ duration: 0.08, ease: 'easeOut' }}/>
      
      {/* Lip highlight */}
      <ellipse cx="100" cy="89" rx="6" ry="2" fill="rgba(255,255,255,.06)"/>
```

- [ ] **Step 2: Verificar que el archivo compila**

Run: `cd edutechlife-frontend && npm run build 2>&1 | head -20`
Expected: Build exitoso

---

### Task 10: Beard, blush, bubble, glow, particles

**Files:**
- Modify: `edutechlife-frontend/src/components/ValerioAvatar.jsx`

- [ ] **Step 1: Agregar barba, rubor, burbuja, glow y partículas**

```jsx
      {/* Beard (multiple layers for texture) */}
      <path d="M65,85 C68,95 75,105 85,110 C92,113 108,113 115,110 C125,105 132,95 135,85 C130,90 120,95 100,95 C80,95 70,90 65,85Z" fill="rgba(74,56,40,.12)"/>
      <path d="M75,88 C78,92 82,95 88,97" fill="none" stroke="rgba(74,56,40,.08)" strokeWidth="0.8"/>
      <path d="M125,88 C122,92 118,95 112,97" fill="none" stroke="rgba(74,56,40,.08)" strokeWidth="0.8"/>
      <path d="M85,95 C90,100 95,103 100,105" fill="none" stroke="rgba(74,56,40,.06)" strokeWidth="0.6"/>
      <path d="M115,95 C110,100 105,103 100,105" fill="none" stroke="rgba(74,56,40,.06)" strokeWidth="0.6"/>
      
      {/* Blush */}
      <ellipse cx="75" cy="80" rx="10" ry="6" fill="url(#blush)" opacity={state === 'listening' ? 0.15 : state === 'speaking' ? 0.12 : 0.08}/>
      <ellipse cx="125" cy="80" rx="10" ry="6" fill="url(#blush)" opacity={state === 'listening' ? 0.15 : state === 'speaking' ? 0.12 : 0.08}/>
      
      {/* Background glow (state-dependent) */}
      <circle cx="100" cy="100" r="98" fill={`rgba(${colors.r},.08)`} filter="url(#glow)"/>
      
      {/* Glass bubble border */}
      <circle cx="100" cy="100" r="92" fill="none" stroke={`rgba(${colors.r},.3)`} strokeWidth="2.5"/>
      
      {/* Glass bubble reflection */}
      <ellipse cx="75" cy="65" rx="35" ry="20" fill="rgba(255,255,255,.12)" transform="rotate(-20 75 65)"/>
      
      {/* Particles */}
      {Array.from({ length: 10 }, (_, i) => {
        const angle = i * 0.628 + Date.now() * 0.0003
        const dist = 0.35 + Math.random() * 0.5
        const px = Math.cos(angle) * dist * 80 + 100
        const py = Math.sin(angle) * dist * 80 + 100
        const opacity = state === 'speaking' ? 0.2 : state === 'idle' ? 0.06 : 0.1
        return (
          <motion.circle key={i} cx={px} cy={py} r={1 + Math.random() * 2}
            fill={`rgba(${colors.r},${opacity})`}
            animate={{ cx: [px, px + Math.cos(angle + 1) * 15], cy: [py, py + Math.sin(angle + 1) * 15] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}/>
        )
      })}
    </motion.svg>
  </motion.div>
)
}

export default ValerioAvatar
```

- [ ] **Step 2: Verificar que el archivo compila**

Run: `cd edutechlife-frontend && npm run build 2>&1 | head -20`
Expected: Build exitoso

---

### Task 11: Testing completo

**Files:**
- Modify: `edutechlife-frontend/src/components/ValerioAvatar.jsx`

- [ ] **Step 1: Verificar que el avatar se renderiza correctamente**

Run: `cd edutechlife-frontend && npm run build 2>&1 | tail -5`
Expected: Build exitoso con "✓ built in"

- [ ] **Step 2: Verificar que no hay errores de ESLint**

Run: `cd edutechlife-frontend && npx eslint src/components/ValerioAvatar.jsx 2>&1 | head -20`
Expected: Sin errores críticos

- [ ] **Step 3: Verificar que el archivo tiene ~250-300 líneas**

Run: `wc -l edutechlife-frontend/src/components/ValerioAvatar.jsx`
Expected: ~250-300 líneas

- [ ] **Step 4: Verificar que los exports son correctos**

Run: `grep -n "export default" edutechlife-frontend/src/components/ValerioAvatar.jsx`
Expected: `export default ValerioAvatar`

- [ ] **Step 5: Verificar que window.valerioSpeak se exporta**

Run: `grep -n "window.valerioSpeak" edutechlife-frontend/src/components/ValerioAvatar.jsx`
Expected: `window.valerioSpeak = speak`

---

### Task 12: Commit final

**Files:**
- Modify: `edutechlife-frontend/src/components/ValerioAvatar.jsx`

- [ ] **Step 1: Hacer commit del cambio**

```bash
cd edutechlife-frontend && git add src/components/ValerioAvatar.jsx && git commit -m "feat: premium realistic avatar with beard, 3D lighting, and Framer Motion animations"
```

- [ ] **Step 2: Verificar que el commit se hizo**

Run: `cd edutechlife-frontend && git log --oneline -1`
Expected: Commit con mensaje "feat: premium realistic avatar..."
