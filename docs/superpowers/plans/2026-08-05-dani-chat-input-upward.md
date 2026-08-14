# Plan: Cuadro de texto de Dani — expansión hacia arriba (sin scroll de la SmartBoard)

**Fecha:** 2026-08-05
**Skills:** writing-plans, systematic-debugging, TDD

## Goal

Cuando el chat de Dani se abre (o llegan mensajes), el contenido de la SmartBoard NO debe
desplazarse ni "expandirse hacia abajo" (espacio blanco en la parte inferior). El scroll debe
quedar confinado al contenedor de mensajes del panel de Dani: los mensajes crecen hacia arriba
dentro del panel y la página de la SmartBoard queda estática. Sin cambios de funcionalidad.

## Root cause (bug)

`useDaniChat.js:141-143`:

```js
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [daniChatHistory]);
```

`scrollIntoView` (default `block: "start"`) recorre TODOS los ancestros scrollables hasta
llevar el objetivo a la vista. `messagesEndRef` vive dentro de:

1. contenedor de mensajes (`flex-1 overflow-y-auto` — scrollable, dentro del panel)
2. panel Dani (`fixed ... overflow-hidden` — NO scrollable)
3. **`CinematicContent` de la SmartBoard (`flex-1 overflow-y-auto` — scrollable)** ← aquí
4. raíz SmartBoard (`h-screen overflow-hidden` — NO scrollable)

Al abrir el chat se agrega el mensaje de bienvenida → cambia `daniChatHistory` → el efecto
dispara `scrollIntoView`. Como el contenedor de mensajes apenas tiene contenido (no puede
scrollear), la propagación sube al contenedor principal de la SmartBoard y **desplaza todo el
contenido de la pestaña hacia abajo**, dejando espacio en blanco en la parte inferior de la
SmartBoard. Reproducción: abrir el chat de Dani con el tab "inicio" activo.

Comportamiento deseado: el área de mensajes debe scrollear internamente (los mensajes nuevos
aparecen al fondo y empujan el contenido hacia arriba), sin tocar los scroll ancestors.

## Fix

### 1. `src/components/kids-dashboard/dani/chatUtils.js` — nuevo util de scroll confinado

```js
// ==========================================
// Utility: Scroll del contenedor de mensajes (confinado, no toca ancestros)
// ==========================================
export function scrollMessagesToBottom(container) {
  if (!container || typeof container.scrollTo !== "function") return;
  container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
}
```

### 2. `src/components/kids-dashboard/daniTutorChat/useDaniChat.js` — usar el util

Reemplazar el efecto actual:

```js
useEffect(() => {
  const endEl = messagesEndRef.current;
  if (!endEl) return;
  scrollMessagesToBottom(endEl.parentElement);
}, [daniChatHistory]);
```

`parentElement` del ref es el div `flex-1 overflow-y-auto p-4 space-y-2` de
`DaniChatMessages.jsx` (el ref está como último hijo, línea 113). Import:
`import { scrollMessagesToBottom } from "../dani/chatUtils";`

### 3. `src/components/kids-dashboard/daniTutorChat/DaniTutorChat.jsx` — autofocus sin scroll

Línea 97: `inputRef.current.focus();` → `inputRef.current.focus({ preventScroll: true });`
Evita que el autofocus al abrir el chat (líneas 92-105) provoque scroll del navegador
(móvil/teclado).

## Tests (TDD)

### A. `dani/__tests__/chatUtils.test.js` — añadir describe para `scrollMessagesToBottom`

1. Llama `scrollTo({ top: scrollHeight, behavior: "smooth" })` con el scrollHeight del
   contenedor.
2. No lanza error y no hace nada si recibe `null`/`undefined`.
3. No llama `scrollIntoView` (solo scrollTo en el contenedor).

### B. Nuevo `daniTutorChat/__tests__/daniMessagesScroll.test.jsx`

Render `DaniChatMessages` con `messagesEndRef` (ref real creado en el test):
1. El padre del `messagesEndRef` es el contenedor scrollable (clase `overflow-y-auto`).
2. Al actualizar `daniChatHistory`, se llama `scrollTo` del contenedor y NO se llama
   `Element.prototype.scrollIntoView`.

## Verification

- `npx vitest run src/components/kids-dashboard/dani/__tests__/chatUtils.test.js src/components/kids-dashboard/daniTutorChat/__tests__/daniMessagesScroll.test.jsx`
- Toda la suite: `npx vitest run` (rápida) + `npm run build:fast`
- Lint: `ESLINT_USE_FLAT_CONFIG=false npx eslint <archivos tocados>` (config `.eslintrc.cjs`)
- Manual: abrir SmartBoard → "Hablar con Dani" → la página NO se mueve; los mensajes
  crecen hacia arriba dentro del panel; cerrar y reabrir sin salto de scroll.

## Risks

- `parentElement` depende de la estructura de `DaniChatMessages`; el test B protege el supuesto.
- `scrollTo` no existe en jsdom sobre elementos reales — usar spies de `vi.fn()` sobre
  instancias de contenedor simulado en test A y spy en el DOM del test B.
- Mínimo impacto: 3 archivos tocados, sin cambios de UI ni de lógica de mensajes.
