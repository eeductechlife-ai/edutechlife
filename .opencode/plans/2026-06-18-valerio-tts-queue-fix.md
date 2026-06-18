# Valerio TTS — Queue Fix & Timeout Enhancement

**Date:** 2026-06-18  
**Status:** Approved for implementation

## Problem

Valerio solo reproduce en audio la **primera oración** de cada respuesta. El resto del texto se queda en silencio.

## Root Cause

En `IALabValerioPanel/index.jsx`, las 4 llamadas a `speakTextConversational` pasan el callback como **3er argumento** (`overrides`) en vez del **4to** (`onEndCallback`). `overrides` nunca se usa en el cuerpo de la función, y `onEndCallback` queda `undefined`. Tras la primera oración el callback nunca se ejecuta, `ttsPlayingRef.current` queda `true` para siempre, y la cola se traba.

## Changes

### index.jsx (4 líneas)

| Línea | Cambio |
|-------|--------|
| 68 | `speakTextConversational(..., 'valerio', callback)` → `speakTextConversational(..., 'valerio', {}, callback)` |
| 197 | Agregar `{}` como 3er arg |
| 210 | Agregar `{}` como 3er arg |
| 323 | Agregar `{}` como 3er arg |

### speech.js (2 líneas)

| Línea | Actual → Nuevo |
|-------|----------------|
| 444 | `AbortSignal.timeout(20000)` → `35000` |
| 255 | `safetyTimeout 30000` → `60000` |

## Success Criteria

- [ ] Todas las oraciones de la respuesta se reproducen secuencialmente
- [ ] `npm test` — 698 tests pasan
- [ ] `npm run build` — build exitoso
