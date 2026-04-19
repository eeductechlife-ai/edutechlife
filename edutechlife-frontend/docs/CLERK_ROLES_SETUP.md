# Configuración de Roles en Clerk Dashboard

## Introducción

La plataforma Edutechlife ahora usa Clerk como único proveedor de identidad con Role-Based Routing basado en `user.publicMetadata.role`. Este documento explica cómo configurar roles para usuarios existentes y nuevos.

## Roles Disponibles

| Rol | Ruta | Descripción |
|-----|------|-------------|
| `ialab` | `/ialab` | Usuarios del Laboratorio de IA (default) |
| `smartboard` | `/smartboard` | Estudiantes/usuarios de SmartBoard |
| `admin` | `/admin` | Administradores del sistema |

## Configuración en Clerk Dashboard

### 1. Acceder al Dashboard de Clerk
1. Visitar [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Seleccionar la aplicación "Edutechlife"
3. Ir a la sección "Users"

### 2. Asignar Roles a Usuarios Existentes

**Método A: Individualmente**
1. Hacer clic en un usuario
2. Ir a la pestaña "Metadata"
3. Agregar/editar `publicMetadata`:
```json
{
  "role": "ialab"  // o "smartboard", "admin"
}
```

**Método B: Masivamente (API)**
```bash
# Obtener lista de usuarios
curl -X GET "https://api.clerk.com/v1/users" \
  -H "Authorization: Bearer sk_live_..."

# Actualizar metadata de usuario específico
curl -X PATCH "https://api.clerk.com/v1/users/{user_id}" \
  -H "Authorization: Bearer sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "public_metadata": {
      "role": "smartboard"
    }
  }'
```

### 3. Configurar Roles por Defecto para Nuevos Usuarios

**Opción A: Webhooks (Recomendado)**
1. Ir a "Webhooks" en Clerk Dashboard
2. Crear webhook para `user.created`
3. Configurar endpoint que asigne rol por defecto:
```javascript
// Ejemplo de webhook handler
app.post('/clerk-webhook', async (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'user.created') {
    const userId = data.id;
    
    // Asignar rol por defecto basado en email o metadata
    const role = determineDefaultRole(data);
    
    // Actualizar usuario en Clerk
    await clerk.users.updateUser(userId, {
      publicMetadata: { role }
    });
  }
  
  res.json({ received: true });
});
```

**Opción B: JWT Templates (Para integración con Supabase)**
1. Ir a "JWT Templates" en Clerk Dashboard
2. Editar template "supabase"
3. Agregar claim personalizado:
```json
{
  "role": "{{user.public_metadata.role || 'ialab'}}"
}
```

## Migración de Usuarios Existentes

### Usuarios de SmartBoard (autenticación hardcoded)
1. Los usuarios que usaban `usuario: 123 / contraseña: 123` deben:
   - Crear cuenta en Clerk
   - Ser asignados con rol `smartboard`
   - Acceder a `/smartboard` después del login

### Usuarios de Admin Dashboard
1. Los administradores existentes deben:
   - Crear cuenta en Clerk
   - Ser asignados con rol `admin`
   - Acceder a `/admin` después del login

### Usuarios de IA Lab
1. Todos los usuarios nuevos sin rol explícito serán redirigidos a `/ialab` por defecto

## Testing de Roles

### 1. Verificación en Desarrollo
```javascript
// En consola del navegador
console.log('Rol del usuario:', user.publicMetadata?.role);

// Logs en desarrollo
// ⚠️ Usuario sin rol explícito, usando default: ialab
```

### 2. Testing de Redirección
1. Usuario con rol `smartboard` → debe redirigir a `/smartboard`
2. Usuario con rol `admin` → debe redirigir a `/admin`
3. Usuario sin rol → debe redirigir a `/ialab` con warning

### 3. Protección Cruzada
- Usuario `ialab` intentando acceder a `/admin` → redirige a `/ialab`
- Usuario `smartboard` intentando acceder a `/ialab` → redirige a `/smartboard`

## Solución de Problemas

### Problema: Usuario redirigido incorrectamente
**Solución:**
1. Verificar `publicMetadata.role` en Clerk Dashboard
2. Verificar logs de redirección en consola
3. Asegurar que `RoleProtectedRoute` esté funcionando

### Problema: Usuario sin rol asignado
**Solución:**
1. Asignar rol en Clerk Dashboard
2. Si es nuevo usuario, configurar webhook para asignación automática

### Problema: Error de autenticación
**Solución:**
1. Verificar que Clerk esté configurado correctamente
2. Verificar JWT template "supabase"
3. Verificar integración con Supabase

## Monitoreo

### Logs Recomendados
```javascript
// En desarrollo, ver warnings de roles no definidos
console.warn('⚠️ Usuario sin rol explícito...');

// En producción, monitorear redirecciones
analytics.track('auth_redirect', {
  userId,
  fromRole,
  toRoute,
  timestamp
});
```

### Métricas a Seguir
1. % de usuarios con rol definido
2. Tasa de redirección exitosa
3. Errores de acceso no autorizado
4. Tiempo de login a redirección

## Consideraciones de Seguridad

### 1. Validación de Roles
- Los roles solo pueden ser asignados desde Clerk Dashboard o API
- No hay forma de que usuarios modifiquen su propio rol
- Los roles son verificados en cada request a rutas protegidas

### 2. Escalabilidad
- Sistema diseñado para agregar nuevos roles fácilmente
- Solo modificar `routeMap` en `RoleProtectedRoute.jsx` y `auth-router.jsx`
- Mantener consistencia entre frontend y metadata de usuarios

### 3. Backup y Recovery
- Exportar regularmente metadata de usuarios desde Clerk
- Tener script de restauración de roles
- Documentar mapeo de usuarios a roles