# Plan: Reconstrucción del Sistema de Examen en IALab

## Diagnóstico

El sistema actual tiene **8 capas de persistencia** que compiten entre sí:
Zustand Store → IALabContext → ProgressContext → usePersistentProgress → localStorage → Supabase → syncFromPersistence con debounce → Reactive Selectors

Tanta complejidad causa que el dato se pierda en algún eslabón de la cadena.

## Nueva Arquitectura (Simplificada)

**Fuente única de verdad**: `localStorage` con clave `ialab_completed_exams`

**Flujo**:
```
Examen completado
  → localStorage.setItem('ialab_completed_exams', {...})
  → window.dispatchEvent('ialab:examCompleted')
  → IALabContent re-render (estado examRefreshKey++)
  → ModuleActions lee localStorage + contexto → ActionCard verde/rojo
```

## Archivos a modificar

### 1. `src/hooks/IALab/useIALabQuiz.js` — Simplificar submitQuiz

**Eliminar**: Las 3 líneas redundantes de persistencia (store + localStorage + markExamComplete)
**Mantener**: Solo el cálculo y retorno del resultado
**Agregar**: Nada — la persistencia se maneja en IALabQuizModal

```js
const submitQuiz = useCallback(async () => {
    try {
      const result = calculateQuizScore(quizAnswers);
      setQuizScore(result.score);
      setQuizPassed(result.passed);
      setQuizResult(result);
      setShowScoreResult(true);
      
      // Ya no llamamos updateModuleActivity ni markExamComplete aquí
      // La persistencia se maneja en el handleSubmit del modal
      
      // Guardar intentos para tracking
      const attempt = { ... };
      const updatedAttempts = [...quizAttempts, attempt];
      setQuizAttempts(updatedAttempts);
      useIALabStore.getState().storageSet(`quizAttempts_${activeMod}`, updatedAttempts);
      setIsTimerRunning(false);
      
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message, result };
    }
}, [...]);
```

### 2. `src/components/IALab/IALabQuizModal.jsx` — Punto ÚNICO de persistencia

**handleSubmit** — Simplificar a un solo bloque de guardado:

```js
const handleSubmit = async () => {
    setIsSubmitting(true);
    const submitResult = await submitQuiz();
    setIsSubmitting(false);
    
    if (submitResult?.result) {
      const { score, passed } = submitResult.result;
      
      // ===== ÚNICO PUNTO DE PERSISTENCIA =====
      // 1. Actualizar Zustand store (para el progreso del módulo)
      useIALabStore.getState().updateModuleActivity(activeMod, 'exam', passed, score);
      
      // 2. Guardar en localStorage (fuente única de verdad para UI)
      try {
        const key = 'ialab_completed_exams';
        const current = JSON.parse(localStorage.getItem(key) || '{}');
        current[activeMod] = score;
        localStorage.setItem(key, JSON.stringify(current));
      } catch(e) {}
      
      // 3. Disparar evento global para forzar re-render de ModuleActions
      window.dispatchEvent(new CustomEvent('ialab:examCompleted', { 
        detail: { moduleId: activeMod, score, passed } 
      }));
      
      // 4. Notificación
      createNotification({...});
    }
};
```

**Resultado en el modal** — Ya existente, se mantiene:
- Score circular (verde ≥80%, rojo <80%)
- Correctas/Incorrectas
- Barra de progreso
- Feedback de áreas de mejora (ya implementado)
- Botón "Volver al módulo"
- Botón "Reintentar examen" si falló (ya implementado)

### 3. `src/components/IALab/IALab.jsx` — Eliminar celebración del módulo

**Eliminar** el banner `showModuleCelebration` (líneas 326-345):
```jsx
{/* ELIMINAR: BANNER CELEBRATORIO */}
{showModuleCelebration && (
  <motion.div ...>
    ¡Módulo completado!
  </motion.div>
)}
```

**Mantener** el event listener `examRefreshKey` (ya implementado) para forzar refresco.

### 4. `src/components/IALab/ModuleActions.jsx` — Leer de localStorage como fallback

Agregar `useEffect` que escuche el evento `ialab:examCompleted` y fuerce re-lectura:

```jsx
const [localExamScores, setLocalExamScores] = useState(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('ialab_completed_exams') || '{}');
    return saved;
  } catch { return {}; }
});

useEffect(() => {
  const handler = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('ialab_completed_exams') || '{}');
      setLocalExamScores(saved);
    } catch(e) {}
  };
  window.addEventListener('ialab:examCompleted', handler);
  return () => window.removeEventListener('ialab:examCompleted', handler);
}, []);

// Usar el valor más reciente: contexto primero, localStorage como fallback
const effectiveExamScore = completedExams?.[activeMod] ?? localExamScores[activeMod];
```

Y usar `effectiveExamScore` en lugar de `completedExams?.[activeMod]` para el ActionCard.

### 5. El botón `handleExam` — Ya funciona correctamente

```jsx
const handleExam = () => {
  if (completedExams?.[activeMod]) {   // o effectiveExamScore
    onAction?.('SHOW_EXAM_RESULT');
  } else {
    onAction?.('OPEN_QUIZ');
  }
};
```

Mantener igual.

## Resumen de cambios

| Archivo | Acción | Líneas afectadas |
|---------|--------|-----------------|
| `useIALabQuiz.js` | Eliminar `updateModuleActivity` + `markExamComplete` del try | 326-334 |
| `IALabQuizModal.jsx` | Unificar persistencia en `handleSubmit` | 132-158 |
| `IALab.jsx` | Eliminar banner `showModuleCelebration` | 326-345 |
| `ModuleActions.jsx` | Agregar `localExamScores` state + event listener | ~60-90 |

## Funcionalidad final

| Escenario | Comportamiento |
|-----------|---------------|
| Examen aprobado (≥80%) | ActionCard verde, checkmark, "85% - Aprobado" |
| Examen reprobado (<80%) | ActionCard rojo, xmark, "55% - Reprobado", botón reintentar |
| Recargar página | ActionCard mantiene el color (lee de localStorage) |
| 3 intentos agotados | Botón reintentar deshabilitado, mensaje "Has agotado tus intentos" |
| Cooldown 12h | Mensaje "Espera Xh para intentar de nuevo" |
| Modal resultado | Score circular + feedback de mejora + botones |
| Sin celebración | No hay banner de módulo completado |
