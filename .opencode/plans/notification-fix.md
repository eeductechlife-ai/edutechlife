# Plan: Corregir Sistema de Notificaciones

## Problemas Identificados

1. **Notificaciones de hitos (25/50/75/100%)** - Deben eliminarse según requerimiento
2. **useCourseReminders.js línea 118-119** - Usa `completedExams[m]` como booleano, ahora es numérico (score)
3. **Notificación de certificación** - Falta cuando completa Módulo 5 + 80% curso
4. **NotificationContext.jsx** - Sin fallback si Supabase falla (tabla no existe)

## Cambios Requeridos

### 1. `IALabContext.jsx` - Eliminar hitos, agregar certificación

**Ubicación:** Líneas 511-549 (useEffect de hitos 25%, 50%, 75%, 100%)

**Eliminar completamente** el useEffect que notifica hitos de progreso porcentual.

**Reemplazar con** (después de `checkCourseCompletion`):

```javascript
// Notificar cuando el estudiante completa y certifica el curso
const hasNotifiedCertificationRef = React.useRef(false);

useEffect(() => {
  if (!user?.id) return;
  if (hasNotifiedCertificationRef.current) return;

  const isFullyComplete = checkCourseCompletion();
  
  if (isFullyComplete) {
    hasNotifiedCertificationRef.current = true;
    createNotification({
      type: 'certificate_earned',
      title: '🎓 ¡Curso Completado y Certificado!',
      message: `Felicitaciones, has aprobado los 5 modulos con ${Math.round(courseProgress)}% de progreso general. Tu certificado ya esta disponible para descargar.`,
      metadata: { progress: courseProgress, allModulesApproved: true },
    });
  }
}, [courseCompleted, courseProgress, user?.id, createNotification, checkCourseCompletion]);
```

**Mantener intactos:**
- `module_complete` en `updateModuleActivity` (líneas 408-416) ✅ - Ya funciona correctamente
- Notificación al entrar a nuevo módulo (líneas 551-584) ✅

### 2. `useCourseReminders.js` - Fix completedExams numérico

**Ubicación:** Líneas 118-120

**Cambiar:**
```javascript
// ANTES (incorrecto - trata como booleano):
const incompleteExams = [1, 2, 3, 4, 5].filter(
  m => !completedExams[m] && m <= completedModules.length + 1
);

// DESPUES (correcto - verifica score >= 80):
const incompleteExams = [1, 2, 3, 4, 5].filter(m => {
  const score = completedExams[m];
  const isApproved = typeof score === 'number' ? score >= 80 : !!score;
  return !isApproved && m <= completedModules.length + 1;
});
```

### 3. `NotificationContext.jsx` - Agregar fallback localStorage

**Ubicación:** `createNotification` función (líneas 165-194)

**Agregar fallback** cuando la tabla no existe (error 42P01):

```javascript
const createNotification = async ({ type, title, message, metadata = {} }) => {
  if (!user?.id) return;

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({ user_id: user.id, type, title, message, metadata })
      .select()
      .single();

    if (error) {
      if (error.code === '42P01') {
        // FALLBACK: localStorage cuando tabla no existe
        console.warn('[NOTIFICATIONS] Table missing, using localStorage');
        const localNotif = {
          id: `local_${Date.now()}`,
          user_id: user.id,
          type, title, message, metadata,
          is_read: false,
          created_at: new Date().toISOString(),
        };
        const local = JSON.parse(localStorage.getItem('ialab_notifications') || '[]');
        local.unshift(localNotif);
        localStorage.setItem('ialab_notifications', JSON.stringify(local.slice(0, 50)));
        setNotifications(prev => [localNotif, ...prev]);
        return localNotif;
      }
      throw error;
    }
    return data;
  } catch (err) {
    console.error('[NOTIFICATIONS] Error creating:', err.message);
    return null;
  }
};
```

**Agregar carga de localStorage en `fetchNotifications`:**

```javascript
// Después de la verificación de error 42P01 (línea 28-31):
if (error?.code === '42P01') {
  console.warn('[NOTIFICATIONS] Table missing, loading from localStorage');
  const local = JSON.parse(localStorage.getItem('ialab_notifications') || '[]');
  setNotifications(local);
  return;
}
```

## Resumen de Notificaciones Activas (Final)

| Tipo | Trigger | Condición |
|------|---------|-----------|
| `module_complete` | Módulo aprobado | Score >= 80% en el módulo (examen o challenge) |
| `lesson_reminder` | Inactividad | 2+ días sin estudiar |
| `exam_reminder` | Examen pendiente | Módulo avanzado pero examen no aprobado (score < 80) |
| `certificate_earned` | Curso completado | 5 módulos aprobados + 80% progreso general |

## Archivos a Modificar

1. `/edutechlife-frontend/src/context/IALabContext.jsx`
   - Eliminar useEffect de hitos (líneas 511-549)
   - Agregar useEffect de certificación

2. `/edutechlife-frontend/src/hooks/useCourseReminders.js`
   - Fix línea 118-120 para manejar scores numéricos

3. `/edutechlife-frontend/src/context/NotificationContext.jsx`
   - Agregar fallback localStorage en createNotification
   - Agregar carga localStorage en fetchNotifications

## Riesgos

- **localStorage fallback:** Las notificaciones no se sincronizan entre dispositivos, pero garantizan que el estudiante vea algo si Supabase falla
- **Ref certificación:** `hasNotifiedCertificationRef` se resetea al recargar página, pero `checkCourseCompletion` ya está basado en estado persistente, así que la notificación podría duplicarse. **Solución:** Agregar flag en localStorage `ialab_notified_certification`
