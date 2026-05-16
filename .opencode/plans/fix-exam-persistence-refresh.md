# Plan: Corrección de Persistencia de Nota de Examen

## Problema

Cuando el estudiante completa un examen y luego recarga la página o vuelve a entrar, la nota del examen se pierde y el ActionCard del examen no cambia de color.

## Causa Raíz

**Doble problema de sincronización:**

### Problema 1: El contexto no reacciona a cambios del store

`IALabContext.jsx` proporciona `completedExams: store.completedExams` en el `contextValue` (línea 526). Este valor se lee durante el render del contexto. Pero el contexto **no usa `useStore`** de Zustand para suscribirse a cambios del store.

Cuando `updateModuleActivity` llama a `store.set({ completedExams: newCompletedExams })`, el store se actualiza PERO IALabContext no se re-renderiza (no está suscrito). El contexto solo se re-renderiza cuando:
- Su propio estado cambia (ej: `setState` para modales)
- `useProgressContext()` dispara un re-render (que a su vez depende de que `markExamComplete` → `updateProgress` haya cambiado `completedExams`)

Si el re-render desde ProgressContext es lento o no ocurre, el contexto queda con valores desactualizados.

### Problema 2: En página de carga, el orden de inicialización

1. IALabContext monta → `store.completedExams` está en estado inicial (vacío `{}`)
2. Progreso se carga desde localStorage → ProgressContext actualiza `completedExams`
3. Sync effect corre → `store.syncFromPersistence({...completedExams})`
4. Store se actualiza con datos correctos
5. **PERO**: IALabContext no se re-renderiza para leer el nuevo valor del store

## Solución

### Archivo: `src/context/IALabContext.jsx`

**Cambio 1**: Agregar un `useEffect` que se suscriba a cambios del store y fuerce re-render cuando `completedExams` cambie.

Agregar después de la declaración de `contextValue`:

```jsx
// Forzar re-render cuando completedExams cambie en el store
const [, forceRender] = useState(0);
useEffect(() => {
  const unsub = useIALabStore.subscribe(
    (state) => state.completedExams,
    () => forceRender(n => n + 1)
  );
  return unsub;
}, []);
```

**Cambio 2**: Leer `completedExams` reactivamente usando `useStore` de Zustand:

```jsx
const storeCompletedExams = useIALabStore((s) => s.completedExams);
```

Y usar `storeCompletedExams` en lugar de `store.completedExams` en el contextValue.

### Alternativa más simple:

Agregar un `useEffect` que sincronice `completedExams` de ProgressContext al store con un estado local para forzar re-render:

```jsx
const [syncedExams, setSyncedExams] = useState({});

useEffect(() => {
  setSyncedExams(store.completedExams);
}, [store.completedExams]);
```

Pero Zustand no expone `completedExams` como reactive store... la mejor opción es usar `useStore`.

## Archivos a modificar

| Archivo | Cambio | Propósito |
|---------|--------|-----------|
| `IALabContext.jsx` | Usar `useIALabStore.subscribe` para forzar re-render en cambios de `completedExams` | Asegurar que el contexto refleje cambios en el store |
| `IALabContext.jsx` | Cambiar `completedExams: store.completedExams` por `completedExams: storeCompletedExams` (reactivo) | Valores actualizados en tiempo real |

## Funcionalidad preservada

- ✅ Examen se guarda en localStorage
- ✅ Examen se carga al recargar página
- ✅ ActionCard cambia de color inmediatamente después del examen
- ✅ ActionCard mantiene el color después de recargar página
- ✅ No se altera el flujo de cálculo de notas ni progreso del módulo
