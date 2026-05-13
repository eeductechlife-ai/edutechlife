# 🔧 FIX: Notificaciones No Funcionan

## Problema Raíz

La tabla `notifications` en Supabase tiene `user_id` definido como **UUID**, pero **Clerk usa TEXT** para los user IDs (ejemplo: `user_2abc123...`).

**Consecuencia:** TODOS los INSERTs fallan silenciosamente con error `22P02` (invalid input syntax for type uuid).

## Solución en 2 Pasos

### Paso 1: Ejecutar SQL en Supabase

1. Ir a **Supabase Dashboard** → **SQL Editor**
2. Copiar y ejecutar el contenido de: `sql/fix_notifications_clerk.sql`
3. Verificar en la output que `user_id` ahora es de tipo `text`

Este SQL hace:
- ✅ Cambia `user_id` de UUID a TEXT
- ✅ Elimina la foreign key a `auth.users`
- ✅ Elimina políticas viejas (usaban `auth.uid()`)
- ✅ Crea nuevas políticas compatibles con Clerk JWT

### Paso 2: Verificar en el Frontend

1. Iniciar la app: `npm run dev`
2. Abrir la consola del navegador (F12)
3. Hacer clic en el botón **🧪** junto a la campana de notificaciones
4. Debería aparecer un alert: `✅ Notificación creada exitosamente`
5. Hacer clic en la campana - la notificación de prueba debe aparecer

## Verificación Adicional

### Comprobar en Supabase que las notificaciones se guardan:

```sql
SELECT id, user_id, type, title, created_at 
FROM notifications 
ORDER BY created_at DESC 
LIMIT 10;
```

### Comprobar políticas activas:

```sql
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'notifications';
```

Debe mostrar 5 políticas: select, insert, update, delete, service_role

## Si Sigue Sin Funcionar

### Verificar en consola del navegador:

```javascript
// Test directo desde la consola
const { data, error } = await supabase
  .from('notifications')
  .insert({
    user_id: 'test_user_123',
    type: 'general',
    title: 'Test',
    message: 'Test message'
  })
  .select()
  .single();

console.log('Data:', data);
console.log('Error:', error);
```

- Si `error.code === '22P02'` → El columna sigue siendo UUID (re-ejecutar SQL)
- Si `error.code === '42P01'` → La tabla no existe
- Si `data` tiene contenido → ✅ Funciona

### Verificar RLS está habilitado:

```sql
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'notifications';
```

Debe mostrar `relrowsecurity = true`

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `sql/create_notifications_table.sql` | user_id TEXT + políticas Clerk |
| `sql/fix_notifications_clerk.sql` | Migración para tabla existente |
| `src/context/NotificationContext.jsx` | Fallback ampliado (22P02, 23503, uuid errors) |
| `src/context/IALabContext.jsx` | Debug logs en createNotification |
| `src/components/IALab/IALabHeader.jsx` | Botón de prueba 🧪 |

## Limpiar Después de Verificar

Una vez confirmado que funciona, eliminar el botón de prueba en `IALabHeader.jsx`:
- Líneas 46-52: eliminar el `<button>` con `onClick={testNotification}`
- Líneas 20-33: eliminar la función `testNotification`
