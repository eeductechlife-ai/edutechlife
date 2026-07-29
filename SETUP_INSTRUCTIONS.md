# Instrucciones de Configuración - Registro Clerk + Supabase

## Resumen de Cambios

El sistema de registro ha sido actualizado para:
1. ✅ Usar un formulario personalizado (en lugar del componente fallido de Clerk UI)
2. ✅ Capturar datos adicionales (nombre, apellido, teléfono, username)
3. ✅ Sincronizar usuarios de Clerk → Supabase automáticamente
4. ✅ Mostrar confirmación después del registro

## Arquitectura

```
Usuario → Formulario personalizado
    ↓ (registro en Clerk)
Clerk API (signUp.create)
    ↓ (éxito)
Backend endpoint: POST /api/auth/sync-user
    ↓ (sincronización)
Supabase (tabla: users)
    ↓ (completado)
Mensaje de confirmación → Redirect a /ialab
```

## Pasos de Configuración

### 1. Crear tabla de usuarios en Supabase (REQUERIDO)

**Opción A: SQL directo**
1. Abre tu dashboard de Supabase
2. Vé a SQL Editor
3. Copia y pega el contenido de:
   ```
   edutechlife-backend/sql/001_create_users_table.sql
   ```
4. Haz clic en "Run" para ejecutar

**Opción B: Usar Supabase CLI (si está configurado)**
```bash
supabase db push
```

### 2. Verificar configuración del backend

El archivo `/edutechlife-backend/src/routes/auth.js` contiene:
- `POST /api/auth/sync-user` - Sincroniza usuarios de Clerk a Supabase
- `GET /api/auth/user/:clerk_id` - Obtiene datos del usuario

Las rutas están registradas en `app.js` correctamente.

### 3. Verificar archivo .env del backend

Asegúrate de que tienes estas variables:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key (opcional)
CLERK_SECRET_KEY=your-clerk-secret-key
```

### 4. Variables de entorno del frontend

Asegúrate de que tienes:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key
VITE_API_URL=http://localhost:3001 (desarrollo)
```

## Pruebas

### Test 1: Abrir página de registro
```
http://localhost:5175/sign-up/ialab
```

Deberías ver un formulario con campos:
- Nombre
- Apellido
- Nombre de usuario
- Correo
- Contraseña
- Teléfono (opcional)
- Botón "Registrarse"

### Test 2: Intentar registro (completo)

1. Llena todos los campos
2. Haz clic en "Registrarse"
3. Espera el mensaje: "¡Registro exitoso! Ahora puedes ingresar..."
4. Se redirigirá a `/ialab`

### Test 3: Verificar Supabase

1. Abre tu dashboard de Supabase
2. Vé a SQL Editor
3. Ejecuta:
   ```sql
   SELECT * FROM users ORDER BY created_at DESC LIMIT 1;
   ```
4. Deberías ver el usuario registrado con todos sus datos (incluyendo teléfono)

### Test 4: Verificar logs del backend

En la terminal del backend, deberías ver:
```
INFO: User synced to Supabase {clerk_id: "user_xxx", email: "..."}
```

## Campos en la tabla `users`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único (generado automáticamente) |
| clerk_id | VARCHAR(255) | ID del usuario en Clerk |
| email | VARCHAR(255) | Correo del usuario |
| first_name | VARCHAR(100) | Nombre |
| last_name | VARCHAR(100) | Apellido |
| username | VARCHAR(100) | Nombre de usuario |
| phone_number | VARCHAR(20) | Número de teléfono |
| age_range | VARCHAR(10) | Rango de edad (ej: "18+") |
| user_type | VARCHAR(50) | Tipo de usuario (ej: "adult") |
| platform | VARCHAR(50) | Plataforma (ej: "ialab") |
| registration_source | VARCHAR(100) | Fuente de registro (ej: "ialab_signup") |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

## Archivos Modificados/Creados

### Frontend
- ✅ `/src/components/CustomSignUpForm.jsx` (NUEVO)
- ✅ `/src/components/IALabSignUpPage.jsx` (MODIFICADO)
- ✅ `/src/i18n/es.json` (MODIFICADO - agregadas claves de signup)
- ✅ `/src/i18n/en.json` (MODIFICADO - agregadas claves de signup)

### Backend
- ✅ `/src/routes/auth.js` (NUEVO)
- ✅ `/src/app.js` (MODIFICADO - registradas rutas)
- ✅ `/sql/001_create_users_table.sql` (NUEVO - schema SQL)

## Solución de Problemas

### Error: "Failed to sync user to Supabase"
- Verifica que la tabla `users` existe en Supabase
- Verifica las credenciales de Supabase en .env del backend
- Revisa los logs del backend para más detalles

### Error: "Component renderer did not mount"
Este era el problema anterior con Clerk UI. Ahora está RESUELTO usando un formulario personalizado.

### Error: "Phone number invalid"
El formato de teléfono debe tener al menos 7 caracteres y solo contener: dígitos, espacios, guiones, signos +, paréntesis.
Ejemplos válidos:
- +1 (555) 123-4567
- 555-123-4567
- +34912345678

## Costo

- **Clerk**: Gratis hasta 10k usuarios/mes
- **Supabase**: Gratis hasta 500MB storage
- **Total**: Completamente gratis para MVP

## Próximos Pasos

Después de esta configuración, podrías considerar:
1. Agregar verificación de email obligatoria
2. Enviar email de bienvenida después del registro
3. Agregar confirmación de teléfono (SMS)
4. Agregar más campos de perfil
5. Crear un dashboard de usuarios (para admin)

## Soporte

Si encuentras problemas:
1. Revisa los logs del backend: `npm run dev`
2. Revisa la consola del navegador (Dev Tools)
3. Verifica que todas las variables de entorno están configuradas
4. Prueba la ruta del backend directamente: `curl -X POST http://localhost:3001/api/auth/sync-user`
