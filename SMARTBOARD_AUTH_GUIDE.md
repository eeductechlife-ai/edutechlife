# SmartBoard Authentication Guide

## Implementación: Native Supabase Auth (Sin Clerk)

Este documento describe la implementación del sistema de autenticación nativo para SmartBoard usando Supabase Auth en lugar de Clerk.

## ✅ Componentes Implementados

### Backend (`edutechlife-backend`)

#### Servicio de Autenticación (`src/services/authService.js`)
- **`signUp()`** - Crear usuario con email + password
  - Crea cuenta en Supabase Auth
  - Crea fila de perfil en tabla `users`
  - Retorna datos de usuario y token

- **`signIn()`** - Iniciar sesión
  - Autentica con email + password
  - Retorna JWT token + refresh token
  - Crea perfil si no existe

- **`refreshSession()`** - Renovar token expirado
  - Usa refresh token para obtener nuevo access token
  - Mantiene sesión activa

- **`signOut()`** - Cerrar sesión
  - Invalida sesión en Supabase Auth
  - Limpia tokens del servidor

#### Rutas de API (`src/routes/auth.js`)
```
POST /api/auth/signup   - Crear cuenta
POST /api/auth/login    - Iniciar sesión
POST /api/auth/logout   - Cerrar sesión
POST /api/auth/refresh  - Refrescar token
```

**Cambios realizados:**
- Eliminadas rutas duplicadas que causaban conflictos 404
- Rutas ahora delegan a `authService` limpiamente
- Manejo de errores mejorado con mensajes en español

#### Migración Database (`supabase/migrations/022_native_auth_clerk_id_nullable.sql`)
```sql
-- Permite que clerk_id sea NULL para usuarios de auth nativo
ALTER TABLE users
ALTER COLUMN clerk_id DROP NOT NULL;
```

#### Seed Script (`src/scripts/seed-test-user.js`)
Crea usuario de prueba para desarrollo:
```bash
npm run seed:test-user
# Crea: smartboard@test.co / SmartBoard@2026
```

### Frontend (`edutechlife-frontend`)

#### Página de Login/Signup (`src/pages/SmartBoardLogin.jsx`)
- Interfaz profesional con gradiente azul
- Tabs: "Iniciar Sesión" | "Crear Cuenta"
- Validación de cliente (passwords 6+ caracteres)
- Mensajes de error/éxito con animaciones
- Diseño responsive + Framer Motion

#### Hook de Autenticación (`src/hooks/useSupabaseAuth.js`)
```javascript
const { user, profile, loading, error, isSignedIn, signUp, signIn, signOut } = useSupabaseAuth()
```
- Maneja estado de autenticación global
- Almacena tokens en `localStorage`
- Escucha cambios de sesión de Supabase
- Dynamic imports para evitar circular deps

#### Contexto (`src/context/AuthContext.jsx`)
```javascript
const auth = useAuth() // Dentro de cualquier componente
```
- Proveedor para toda la aplicación
- Wrappea root en `main.jsx`

#### Rutas Protegidas (`src/components/ProtectedRoute.jsx`)
```javascript
<RoleProtectedRoute requiredRole="smartboard">
  <SmartBoardDashboard />
</RoleProtectedRoute>
```
- Redirige a `/smartboard/login` si no autenticado
- Soporta roles específicos

#### Rutas (`src/routes/index.jsx`)
```
/smartboard/login        - Página login/signup (pública)
/smartboard/app          - Dashboard (protegida, requiere role="smartboard")
```

## 🔧 Configuración

### Variables de Entorno

**Backend** (`.env`)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
VITE_API_BASE_URL=http://localhost:3001  (para desarrollo local)
```

**Frontend** (`.env` o `.env.local`)
```
VITE_API_BASE_URL=http://localhost:3001  (en desarrollo)
# Producción usa https://edutechlife-backend.onrender.com
```

### Instalación Local

```bash
# 1. Backend
cd edutechlife-backend
npm install
npm start  # Escucha en puerto 3001

# 2. Frontend
cd edutechlife-frontend
npm install
npm run dev  # Escucha en puerto 5175
```

## 🔐 Flujo de Autenticación

### Sign Up
1. Usuario llena formulario en `/smartboard/login`
2. Frontend POST a `/api/auth/signup` con email, password, username
3. Backend crea usuario en Supabase Auth
4. Backend crea fila de perfil en tabla `users`
5. Frontend recibe confirmación y muestra login
6. Usuario debe confirmar email (Supabase automático)

### Sign In
1. Usuario ingresa email + password
2. Frontend POST a `/api/auth/login`
3. Backend valida credenciales con Supabase Auth
4. Backend retorna JWT token + refresh token + profile
5. Frontend almacena tokens en localStorage
6. Frontend redirige a `/smartboard/app`

### Token Refresh
1. Frontend detecta token expirado (401 response)
2. Frontend POST a `/api/auth/refresh` con refresh token
3. Backend obtiene nuevo access token
4. Frontend almacena nuevo token y reintencha request original

## ⚠️ Limitaciones Conocidas

### Supabase Auth Rate Limit
- **Problema:** Supabase Auth tiene límite ~1 signup cada 5+ minutos
- **Impacto:** No se pueden crear múltiples cuentas en rápida sucesión
- **Solución:** 
  1. Usar seed script para crear usuarios de prueba
  2. Esperar entre intentos de signup
  3. Ajustar configuración en Supabase dashboard (si es posible)

### Requisitos
- Node.js 18+
- npm 9+
- Proyecto Supabase activo

## 📝 Testing

### Usuarios de Prueba

**Admin (después de seed):**
```
Email: smartboard@test.co
Password: SmartBoard@2026
Username: smartboardtest
```

### Comandos Útiles

```bash
# Crear usuario de prueba
node edutechlife-backend/src/scripts/seed-test-user.js

# Ver logs del backend
tail -f /tmp/backend.log

# Probar endpoint de login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"smartboard@test.co","password":"SmartBoard@2026"}'

# Probar endpoint de signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123456","username":"testuser","firstName":"Test","lastName":"User"}'
```

## 🚀 Próximos Pasos

1. **Configurar rate limit de Supabase**
   - Aumentar límite o deshabilitar en desarrollo
   - Contactar Supabase support si es necesario

2. **Implementar confirmación de email**
   - Link de confirmación en email
   - Resend verification email

3. **Agregar recuperación de contraseña**
   - Usar `/api/auth/reset-password` existente
   - Implementar flow de reset en UI

4. **Integrar con perfil de estudiante**
   - VAK diagnosis
   - School/Grade info
   - Preferences

5. **Analytics y Monitoring**
   - Eventos de auth (signup, login, logout)
   - Errores de autenticación
   - Métricas de adopción

## 📚 Referencias

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase JWT](https://supabase.com/docs/guides/auth/auth-helpers/auth-helpers-js)
- [SmartBoard API Endpoints](../docs/smartboard-api.md)

## 👤 Autor

Implementado por Claude Code con Supabase Auth nativo (sin Clerk).

Último update: Agosto 4, 2026
