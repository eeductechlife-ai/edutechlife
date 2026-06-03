# Valerio Premium Redesign — Botón Flotante + Modal

**Fecha:** 2026-06-03
**Skill:** frontend-design + ui-ux-pro-max + brainstorming
**Estado:** Spec aprobado para implementación

---

## 1. Visión General

Rediseñar el botón flotante de Valerio y el modal del panel completo para que sea más profesional, impactante, rápido y emocional para los estudiantes de IALab. **No se modifica ninguna función existente** (processUserInput, callDeepseek, speakTextConversational, etc.) — solo la capa UI/UX.

---

## 2. Principios de Diseño

- **Coach, no asistente:** Calidez humana, no fría tecnología
- **Identidad Valerio:** Monograma "V" como símbolo de marca
- **Velocidad percibida:** Feedback visual instantáneo (<50ms), aunque la API tarde
- **Estado vivo:** El botón y panel reflejan en tiempo real qué hace Valerio
- **Consistencia IALab:** Gradiente petróleo→corporate, glassmorphism, organic shapes

---

## 3. Arquitectura de Archivos (sin crear nuevos)

| Archivo | Rol | Cambios |
|---------|-----|---------|
| `ValerioFloatingButton.jsx` | Botón flotante | Rediseño completo |
| `IALabValerioPanel/index.jsx` | Lógica del panel | Solo flujo de speed UX (parallel execution) |
| `ValerioPanelHeader.jsx` | Header del panel | Avatar + greeting + status |
| `ValerioQuickActions.jsx` | Acciones rápidas | Glassmorphism cards |
| `ValerioConversationArea.jsx` | Área de chat | Typewriter + burbujas premium |
| `ValerioChatInput.jsx` | Input de texto | Diseño integrado |
| `ValerioClearConfirm.jsx` | Confirmación | Sin cambios |
| `speech.js` | TTS | Eliminar health check, priorizar native speech |
| `IALab.css` | Estilos | Nuevas animaciones @keyframes |

---

## 4. Botón Flotante (ValerioFloatingButton.jsx)

### Especificación Visual

```
fixed bottom-6 right-6 z-50

2. Tooltip (card glassmorphism, max-w 240px)

1. Botón: w-14 h-14 lg:w-16 lg:h-16
   rounded-2xl
   bg-gradient-to-br from-petroleum to-corporate
   shadow-2xl shadow-corporate/25

   Contenido interno:
   - "V" bold text-white text-2xl drop-shadow-lg
   - Anillo SVG exterior con estado:
     - idle: stroke-emerald-400, pulso lento (2s cycle)
     - thinking: stroke-purple-400, rotación continua
     - speaking: stroke-cyan-400, onda expansiva

   Hover: scale-110 + shadow-corporate/50 + glow backdrop-blur
   Active: scale-90

   Status dot (esquina inferior derecha):
   - w-3 h-3 rounded-full ring-2 ring-white
   - idle: bg-emerald-400 + animate-ping
   - thinking: bg-purple-400 + animate-pulse
   - speaking: bg-cyan-400 + animate-pulse (rápido)

   Glow backdrop:
   - absolute -inset-2 bg-gradient-to-r from-cyan-400/20 to-corporate/30
   - rounded-full blur-2xl opacity-0 group-hover:opacity-100
```

### Comportamiento de Estados

| Estado | Anillo | Status Dot | Tooltip |
|--------|--------|------------|---------|
| `idle` | Stroke emerald 2px, pulso 2s | Ping verde | "Habla con Valerio" |
| `thinking` | Stroke purple 2px, rotate 1.5s | Pulse morado | "Valerio está pensando..." |
| `speaking` | Stroke cyan 2px, onda vibrante | Pulse rápido cyan | "Valerio está hablando..." |

### Props

```jsx
ValerioFloatingButton.propTypes = {
  onClick: PropTypes.func,
  t: PropTypes.func,
  valerioState: PropTypes.oneOf(['idle', 'thinking', 'speaking', 'listening']),
}
```

---

## 5. Modal — Header (ValerioPanelHeader.jsx)

### Layout

```
sticky top-0 bg-gradient-to-r from-petroleum to-corporate text-white
p-6 rounded-t-2xl
z-10 shadow-sm (en scroll)

Fila 1:
  [Avatar 64px]  |  Valerio (bold, text-xl)
                  |  Módulo actual (opacity-90, text-sm)
                  |  [Close X] (hover: bg-white/10)

Fila 2:
  ● Status dot  |  Status label  |  Separador  |  ⊞ Nivel badge
```

### Greeting Inteligente

- **Primera vez:** "¡Hola, [nombre]! Bienvenido a IALab 🎉"
- **Returning:** "¡Hola de nuevo, [nombre]! ¿Seguimos con [módulo]?"
- **Sin nombre:** "¡Hola! ¿En qué te ayudo hoy?"

### Avatar

El avatar (ValerioAvatar.jsx) se mantiene igual — solo se **agranda a 64px** y se le añade **glow animado** según estado.

---

## 6. Modal — Quick Actions (ValerioQuickActions.jsx)

### De plano a glassmorphism

```jsx
// Actual (plano):
bg-slate-50 hover:bg-slate-100 rounded-xl

// Nuevo (glassmorphism):
bg-white/70 backdrop-blur-md border border-slate-200/50
hover:bg-white/90 hover:shadow-md hover:border-slate-300
active:scale-[0.97] transition-all duration-200
```

### Layout

```
Título: "ACCIONES RÁPIDAS" (text-xs font-semibold uppercase tracking-wider text-slate-400)

Grid 2×2 gap-3:

┌──────────────────────┐  ┌──────────────────────┐
│ Icon 40×40 (gradient)│  │ Icon 40×40 (gradient)│
│ Label bold (text-sm)  │  │ Label bold (text-sm)  │
│ Subtítulo opcional    │  │ Subtítulo opcional    │
└──────────────────────┘  └──────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│ ...                  │  │ ...                  │
└──────────────────────┘  └──────────────────────┘
```

### Icon Container

Cada icono en un contenedor 40×40 con gradiente `from-petroleum/10 to-corporate/10 rounded-xl`.

---

## 7. Modal — Conversación (ValerioConversationArea.jsx)

### Burbujas de Mensaje

**Valerio (left):**
```
bg-white border border-slate-200 shadow-sm rounded-2xl
border-l-4 border-l-corporate (barra gradiente izquierda)
max-w-[80%]
```

**Usuario (right):**
```
bg-gradient-to-r from-petroleum to-corporate text-white rounded-2xl
max-w-[80%]
```

### Typewriter Effect (NUEVO componente inline)

Cuando Valerio está respondiendo, el texto aparece caracter por caracter:

```
ValerioMessageBubble → content se renderiza con:
  - Si no es el último mensaje de Valerio → texto completo (render normal)
  - Si es el último mensaje → Typewriter con cursor parpadeante
```

**Velocidad:** 30ms por caracter (ajustable)

**Estados:**
- **Escribiendo:** Texto parcial + cursor `|` parpadeante
- **Completo:** Texto completo, cursor desaparece

### Thinking Indicator

```
bg-white border border-slate-200 rounded-2xl p-4 max-w-[80%]

[V]  ● ● ●
     (animación bounce secuencial, no fade)

Dots: w-2.5 h-2.5 rounded-full bg-purple-500
       stagger 0.2s, bounce animation (scale 1→0.5→1)
```

### Empty State

Se mantiene igual — funciona bien.

---

## 8. Modal — Chat Input (ValerioChatInput.jsx)

### Barra de Input Integrada

```
┌─────────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐    │
│  │ Escribe tu mensaje...              │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│  Enter → enviar  Shift+Enter → salto       │
│  [🎤]  [🗑️]                                │
└─────────────────────────────────────────────┘
```

### Detalles

- **Textarea:** bg-white border-slate-200 focus:ring-2 focus:ring-corporate
- **Micrófono:** Fondo corporate/10 cuando inactivo, corporate sólido cuando activo (nunca rojo)
- **Send button:** Gradiente petróleo→corporate, siempre visible, deshabilitado con opacity
- **Clear:** Solo visible si hay mensajes, hover:text-red-500

---

## 9. Speed UX — Pipeline de Percepción

### Flujo Actual (lento)

```
Click → API call (5-10s) → Fallback gen → Health check (3s) → TTS fallbacks (5) → Native speech
                                                                                    ↑ 10-18s total
```

### Flujo Nuevo (instantáneo)

```
Click → [Paralelo instantáneo]
          ├── Mostrar "Analizando..." + skeleton (0ms)
          ├── API call DeepSeek (5s timeout, única llamada)
          └── Fallback pre-generado listo en <1μs

       → Typewriter empieza a escribir (300ms)
       → Native speech empieza inmediatamente
       → Si API responde a tiempo → reemplaza texto seamless
```

### Cambios en index.jsx

```jsx
// 1. Eliminar Promise.race de 10s (api.js ya tiene 5s)
// 2. Eliminar __testBackend en speech.js
// 3. Priorizar native speech sobre Google TTS
// 4. Instabuffer: mostrar feedback visual antes de cualquier async
```

### Cambios en speech.js

```jsx
// ELIMINAR:
// - __testBackend() health check (añade 3s innecesarios)
// - VOICE_FALLBACKS loop completo (5 llamadas fallidas)
// - speakTextConversational: intento de Google TTS backend

// MANTENER solo:
// - Native speech (speechSynthesis) como ruta PRIMARIA
// - Perfiles de voz para selección de voz correcta
// - stopSpeech, safety timeout
```

---

## 10. Animaciones y Transiciones

| Elemento | Animación | Duración | Trigger |
|----------|-----------|----------|---------|
| Botón entrada | Spring opacity+y+scale | 500ms | Mount |
| Botón hover | Scale 1.1 + glow | 300ms | Hover |
| Botón press | Scale 0.9 | 100ms | Click |
| Anillo idle | Pulse (scale+opacity) | 2s cycle | idle state |
| Anillo thinking | Rotate | 1.5s cycle | thinking state |
| Anillo speaking | Vibrate wave | ciclo audio | speaking state |
| Modal entrada | Slide-up + scale spring | 400ms | Open |
| Modal salida | Slide-down + fade | 250ms | Close |
| Quick actions hover | Scale 1.02 + shadow | 200ms | Hover |
| Thinking dots | Stagger bounce | 0.2s stagger | Processing |
| Typewriter | Char appear 30ms | variable | New Valerio msg |
| Burbuja entrada | Fade + slide-up | 300ms | New message |
| Status dot | Ping (idle) / Pulse (thinking/speaking) | variable | State change |

### Reduced Motion

Todas las animaciones respetan `prefers-reduced-motion` via `@media (prefers-reduced-motion: reduce)` — se desactivan animaciones decorativas, se mantienen funcionales.

---

## 11. No-Change Contract (Funciones NO modificadas)

| Función | Archivo | Razón |
|---------|---------|-------|
| `processUserInput` | index.jsx | Lógica principal — solo se cambia timing de UI |
| `handleQuickAction` | index.jsx | Solo dispatch |
| `handleSendMessage` | index.jsx | Solo dispatch |
| `generateFallbackResponse` | index.jsx | Lógica de fallback |
| `buildValerioSystemPrompt` | index.jsx | Construcción de prompt |
| `callDeepseek` | api.js | API call |
| `useValerioVoice` | useValerioVoice.js | Voice recognition |
| `speakTextConversational` | speech.js | Firma se mantiene, solo se optimiza internamente |
| `stopSpeech` | speech.js | Utilidad |
| `useFocusTrap` | hooks/ | Utilidad |

---

## 12. Checklist Pre-Entrega (ui-ux-pro-max)

- [ ] No emojis como iconos estructurales (solo SVG)
- [ ] Touch targets ≥44×44px (botón 56-60px ✅)
- [ ] Micro-interacciones 150-300ms
- [ ] Contraste texto ≥4.5:1
- [ ] Focus rings visibles en todos los interactivos
- [ ] Reduced-motion soportado
- [ ] Estados deshabilitados claros
- [ ] Animaciones solo con transform/opacity
- [ ] Botón y modal responsive (mobile + tablet + desktop)
