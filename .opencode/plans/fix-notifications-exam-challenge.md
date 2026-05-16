# Plan: Corrección de Notificaciones de Examen y Desafío

## Problema

Cuando un estudiante completa un examen o desafío, la notificación que recibe dice "Aprobaste con X%" pero el valor X corresponde a la **nota general del módulo** (promedio ponderado de todas las actividades), no a la nota específica del examen o desafío. Esto causa confusión cuando el estudiante reprobó el examen/desafío pero la notificación muestra una calificación diferente.

## Causa Raíz

En `IALabContext.jsx:117-138`, la función `updateModuleActivity` envía una notificación cuando `justCompleted = true` (el módulo alcanzó ≥80% de nota general). El mensaje usa `result.newScore` que es el **promedio ponderado del módulo**, no la nota del examen/desafío específico.

```js
message: `¡Felicitaciones! Aprobaste con ${result.newScore}% de calificacion.`
```

Además, no existe una notificación específica para cuando se completa un examen o desafío individual.

## Archivos a Modificar

### 1. `IALabContext.jsx` — Mejorar mensaje de notificación de módulo completado

**Líneas 122-127**: Cambiar el mensaje para que sea claro que se refiere al módulo completo:

**Actual:**
```js
title: `✅ ${moduleName} Completado`,
message: `¡Felicitaciones! Aprobaste con ${result.newScore}% de calificacion. ${moduleId < 5 ? 'El siguiente modulo ya esta desbloqueado.' : '¡Has completado todos los modulos!'}`,
```

**Nuevo:**
```js
title: `✅ ${moduleName} Completado`,
message: `¡Felicitaciones! Completaste el módulo con ${result.newScore}% de nota general. ${moduleId < 5 ? 'El siguiente modulo ya esta desbloqueado.' : '¡Has completado todos los modulos!'}`,
```

### 2. `useIALabQuiz.js` — Agregar notificación específica del examen

**En `submitQuiz` (líneas 321-382)**: Después de guardar el resultado, agregar una notificación con la nota REAL del examen.

Agregar después de `setIsTimerRunning(false)` (antes del return):
```js
// Notificar resultado del examen
const { createNotification } = await import('../../context/NotificationContext');
try {
    const notifContext = useIALabContext();
    // La notificación se maneja mejor desde el modal
} catch (e) {}
```

**Mejor enfoque**: La notificación puede manejarse desde `IALabQuizModal.jsx` en `handleSubmit` después de que `submitQuiz` se completa exitosamente. Podemos usar el NotificationContext directamente.

### 3. `IALabQuizModal.jsx` — Notificación de resultado del examen

En el componente, importar `useNotification` y agregar notificación después de `submitQuiz`:

```js
const { createNotification } = useNotification();

const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const submitResult = await submitQuiz();
    setIsSubmitting(false);
    
    if (submitResult?.success && submitResult?.result) {
        // Notificar resultado del examen
        createNotification({
            type: submitResult.result.passed ? 'success' : 'warning',
            title: submitResult.result.passed ? '📝 Examen Aprobado' : '📝 Examen No Aprobado',
            message: `Tu nota en el examen del Módulo ${activeMod} fue ${submitResult.result.score}%. ${submitResult.result.passed ? '¡Buen trabajo!' : 'Necesitas 80% para aprobar. Revisa los temas y vuelve a intentarlo.'}`,
            metadata: { moduleId: activeMod, score: submitResult.result.score, type: 'exam' }
        });
    }
};
```

### 4. `IALabEvaluationModalPremium.jsx` — Notificación de resultado del desafío

En `handleComplete`, después de procesar el resultado, agregar notificación:

```js
const passed = score >= 80;

// Notificar resultado del desafío
createNotification({
    type: passed ? 'success' : 'warning', 
    title: passed ? '🏆 Desafío Aprobado' : '🏆 Desafío No Aprobado',
    message: `Tu nota en el desafío del Módulo ${activeMod} fue ${score}%. ${passed ? '¡Excelente trabajo!' : 'Necesitas 80% para aprobar. Revisa el feedback y vuelve a intentarlo.'}`,
    metadata: { moduleId: activeMod, score, type: 'challenge' }
});
```

**Nota**: `createNotification` debe importarse desde `useNotification`:
```js
import { useNotification } from '../../context/NotificationContext';
```

## Resumen de cambios

| Archivo | Cambio | Propósito |
|---------|--------|-----------|
| `IALabContext.jsx:125` | Cambiar mensaje de "Aprobaste con X%" a "Completaste el módulo con X%" | Evitar confusión entre nota del módulo vs examen |
| `IALabQuizModal.jsx` | Agregar `createNotification` en `handleSubmit` | Notificar resultado REAL del examen |
| `IALabEvaluationModalPremium.jsx` | Agregar `createNotification` en `handleComplete` | Notificar resultado REAL del desafío |

## Funcionalidad preservada

- ✅ La notificación de módulo completado sigue funcionando (solo cambia el texto)
- ✅ La nota mostrada en la notificación del examen es la REAL del examen
- ✅ La nota mostrada en la notificación del desafío es la REAL del desafío
- ✅ No se altera el cálculo de notas ni el progreso del módulo
- ✅ Estudiantes reciben información clara y correcta sobre cada actividad
