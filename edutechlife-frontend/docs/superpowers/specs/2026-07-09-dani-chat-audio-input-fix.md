# Dani Chat — Fix de Audio TTS y Enfoque del Input

**Fecha:** 2026-07-09
**Feature:** Dani Tutor Chat (SmartBoard Kids)
**Tags:** audio, tts, input, focus, ux

## Objetivo

Corregir 2 problemas reportados en el chat de Dani: (1) el audio TTS no se escucha y (2) el cuadro de texto aparece pero no se puede escribir. Sin alterar la funcionalidad existente.

## Diagnóstico

### Problema 1: Audio TTS no se reproduce

3 causas raíz:

1. **`isSpeakingRef.current`** (DaniTutorChat.jsx:954) — Durante streaming, solo la PRIMERA oración se reproduce. Las que llegan mientras `isSpeakingRef.current = true` se descartan silenciosamente.

2. **`isSpeaking` module-level flag** (speech.js:222) — `speakTextConversational()` mata la reproducción anterior con `stopSpeech()` al inicio si `isSpeaking` es `true`. Cadenas rápidas de oraciones se cancelan entre sí.

3. **Errores silenciosos** — `catch {}` y `console.warn` ocultan todas las fallas de TTS. El usuario nunca recibe feedback.

### Problema 2: Input de texto no se puede escribir

1. **`useFocusTrap`** (useFocusTrap.js:19) — Enfoca `focusable[0]` (primer elemento focusable del modal: botón de voz en el header). El `autoFocus` del input se ejecuta pero el focus trap lo sobreescribe inmediatamente después del mount.

2. **`onKeyPress` deprecated** — La prop `onKeyPress` está obsoleta en React. Debe reemplazarse por `onKeyDown`.

## Solución

### 1. Sistema de Audio — Cola FIFO

Reemplazar el flag `isSpeaking` por una cola de reproducción en `speech.js`:

```
speechQueue: [{text, profile, overrides, onEnd, onPermissionError}]
```

**Flujo:**
- `speakTextConversational()` → `enqueueSpeech()` (agrega a la cola)
- Si no hay reproducción activa → `processQueue()` (toma el primero de la cola y lo reproduce)
- Al terminar una oración (`onEnd`) → `processQueue()` (toma el siguiente)
- `stopSpeech()` → `clearQueue()` (vacía la cola + detiene audio actual)
- Si el usuario envía un nuevo mensaje mientras Dani habla → `clearQueue()` (intencional)

**Cambios en speech.js:**

| Línea actual | Cambio |
|-------------|--------|
| `let isSpeaking = false` | `let speechQueue = []` |
| `if (isSpeaking) { stopSpeech() }` | Eliminar — ahora `enqueueSpeech()` maneja la concurrencia |
| `isSpeaking = true` | Reemplazar por lógica de cola |
| `cleanup()` | `cleanup()` → llama `processQueue()` si hay más elementos |
| `catch {}` | `catch (error) { notifyTtsError(error) }` + estado `error` en status bar |

### 2. Indicador Visual de Audio — AudioStatusBar

Nuevo componente en el header del chat con 4 estados:

| Estado | Visual | Comportamiento |
|--------|--------|---------------|
| `idle` | Icono de altavoz gris | Sin reproducción |
| `playing` | 3 barras bouncing (ecualizador) + tooltip "Dani está hablando..." | Animación CSS con delay escalonado |
| `blocked` | Altavoz muteado rojo + tooltip "Chrome bloqueó el audio. Toca para activar" | Click → `retrySpeech()` |
| `error` | Icono rojo con `!` + tooltip "No se pudo reproducir el audio" | Auto-limpia a los 5s |

Estados gestionados por `audioStatus` state en DaniTutorChat, sincronizado con eventos de speech.js.

### 3. Fix del Focus Trap

Agregar soporte para `data-autofocus` en `useFocusTrap.js`:

```js
const autoFocusEl = el.querySelector('[data-autofocus]');
if (autoFocusEl) {
  autoFocusEl.focus();
} else if (focusable.length > 0) {
  focusable[0].focus();
}
```

En DaniTutorChat.jsx, agregar `data-autofocus` al input:
```jsx
<input data-autofocus type="text" ... />
```

### 4. Reemplazar onKeyPress por onKeyDown

```jsx
// Antes
onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputText)}
// Después
onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage(inputText)}
```

### 5. Actualizar isSpeakingRef en DaniTutorChat

Reemplazar la lógica de `isSpeakingRef.current` por la nueva cola. Ya no se necesita el guard `!isSpeakingRef.current` porque la cola maneja la concurrencia. El `voiceEnabled && sentence.length >= 8` se mantiene, pero sin bloquear por `isSpeakingRef`.

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `src/utils/speech.js` | Cola FIFO, error handling visible, `processQueue()`, `clearQueue()` |
| `src/hooks/useFocusTrap.js` | Soporte `data-autofocus` |
| `src/components/kids-dashboard/DaniTutorChat.jsx` | `data-autofocus`, `onKeyDown`, eliminar `isSpeakingRef`, `AudioStatusBar`, estados de audio |

## No Modificados

- `SmartBoardKidsContext.jsx`
- `api.js`, `smartboardSync.js`
- Otros componentes que usan `speakTextConversational`
- `speechRecognition.js`, `speech.js.bak`

## Edge Cases

| Situación | Comportamiento |
|-----------|---------------|
| Sin conexión | TTS backend falla → fallback `speechSynthesis` → si no hay voces, status `error` |
| Autoplay bloqueado | Status `blocked` → botón "Activar audio" → `retrySpeech()` |
| Streaming rápido | Cola FIFO reproduce secuencialmente sin saltos |
| Nuevo mensaje del usuario | `clearQueue()` + `stopSpeech()` (intencional: nueva interacción) |
| Sin datos de voz | Status `error` 5s, el usuario lee el texto normalmente |
