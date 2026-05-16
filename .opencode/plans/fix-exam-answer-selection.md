# Plan: Fix Examen - No permite seleccionar respuestas

## Bug encontrado

**Archivo**: `src/store/ialabStore.js` — Línea 499

**Causa raíz**: El setter `setQuizAnswers` en el store Zustand no maneja funciones updater.

### Explicación

En `src/hooks/IALab/useIALabQuiz.js`, la función `updateQuizAnswer` (línea 385-390) hace:

```js
const updateQuizAnswer = useCallback((questionId, answer) => {
    setQuizAnswers(prev => ({       // ← pasa una FUNCIÓN
      ...prev,
      [questionId]: answer
    }));
}, [setQuizAnswers]);
```

Pero el store define:

```js
setQuizAnswers: (v) => set({ quizAnswers: v }),  // ← set() recibe { quizAnswers: fn }
```

Zustand NO ejecuta funciones cuando se pasan como valores de propiedades en `set({ key: fn })`. Solo ejecuta funciones cuando se pasan directamente a `set(fn)`. Por lo tanto, `quizAnswers` se convierte en la **función misma** en lugar del resultado de ejecutarla.

**Consecuencia**: `quizAnswers` es una función → `quizAnswers[questionId]` es `undefined` → `handleSelectAnswer` nunca actualiza correctamente → la respuesta no se guarda → el botón "Siguiente" se queda deshabilitado.

## Solución

### Archivo: `src/store/ialabStore.js` — Línea 499

**Actual**: `setQuizAnswers: (v) => set({ quizAnswers: v })`

**Nuevo**: 
```js
setQuizAnswers: (v) => set((state) => ({ 
  quizAnswers: typeof v === 'function' ? v(state.quizAnswers) : v 
})),
```

Este cambio permite que `setQuizAnswers` acepte tanto valores planos como funciones updater (similar a `useState` de React):
- Si `v` es función: la ejecuta con `state.quizAnswers` actual y usa el resultado
- Si `v` es valor plano: lo usa directamente

### Archivos afectados

| Archivo | Línea | Cambio |
|---------|-------|--------|
| `src/store/ialabStore.js` | 499 | Agregar soporte para función updater en `setQuizAnswers` |

### Funcionalidad preservada

- ✅ Las respuestas se guardan correctamente en quizAnswers
- ✅ El botón "Siguiente" se habilita al seleccionar respuesta
- ✅ La navegación entre preguntas funciona
- ✅ El envío del examen calcula respuestas correctamente
- ✅ Los intentos diarios y puntajes se mantienen intactos
