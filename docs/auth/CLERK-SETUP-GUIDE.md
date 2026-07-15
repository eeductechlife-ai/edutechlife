# Configuración de Clerk Dashboard - Solución Registro

## Problema Resuelto
El registro en WelcomeScreen se quedaba esperando un código de verificación que nunca llegaba al correo, y el usuario no aparecía en el dashboard de Clerk.

## Causas Raíz
1. Email Verification activado en Clerk
2. Publishable Key truncada en `.env`
3. No existía webhook para sincronizar Clerk → Supabase

---

## Paso 1: Verificar/Corregir API Keys en .env

**Archivo:** `edutechlife-frontend/.env`

Ir a [Clerk Dashboard → API Keys](https://dashboard.clerk.com/last-active?path=api-keys) y copiar las keys completas:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...KEY_COMPLETA
CLERK_SECRET_KEY=sk_test_...KEY_COMPLETA
```

**Importante:** La publishable key actual termina en `JA` y parece truncada. Debe ser más larga.

---

## Paso 2: Desactivar Email Verification

1. Ir a **Clerk Dashboard**
2. Click en **User & Authentication** en el menú lateral
3. Click en **Email, Phone, Username**
4. En la sección **Email verification**, desactivar el toggle **"Require email verification before creating an account"**
5. Click en **Save**

Esto permite que los usuarios se registren inmediatamente sin esperar un código de verificación por email.

---

## Paso 3: Deploy de Supabase Edge Function

### 3.1 Instalar Supabase CLI (si no está instalado)
```bash
npm install -g supabase
```

### 3.2 Deploy de la función
```bash
cd /Users/home/Desktop/edutechlife
npx supabase functions deploy clerk-webhook --project-ref srirrwpgswlnuqfgtule
```

### 3.3 Configurar variables de entorno en Supabase

Ir a [Supabase Dashboard → Settings → Edge Functions](https://supabase.com/dashboard/project/srirrwpgswlnuqfgtule/settings/functions)

Agregar las siguientes variables:

| Variable | Valor |
|----------|-------|
| `SUPABASE_URL` | `https://srirrwpgswlnuqfgtule.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | La Service Role Key de Supabase (se encuentra en Settings → API) |
| `CLERK_WEBHOOK_SECRET` | `whsec_...` (se obtiene después de crear el webhook en Clerk, Paso 4) |

---

## Paso 4: Configurar Webhook en Clerk Dashboard

1. Ir a **Clerk Dashboard**
2. Click en **Webhooks** en el menú lateral
3. Click en **Add Endpoint**
4. Configurar:
   - **Endpoint URL:** `https://srirrwpgswlnuqfgtule.supabase.co/functions/v1/clerk-webhook`
   - **Events:** Seleccionar solo `user.created`
5. Click en **Create**
6. Copiar el **Signing Secret** que aparece (empieza con `whsec_`)
7. Guardar este secret como `CLERK_WEBHOOK_SECRET` en las variables de entorno de Supabase (Paso 3.3)

---

## Verificación

### Probar registro:
1. Ir a `/login?action=signup`
2. Registrar un nuevo usuario con email válido
3. Verificar que:
   - ✅ No se pide código de verificación
   - ✅ El usuario aparece en Clerk Dashboard → Users
   - ✅ El perfil se crea en Supabase (tabla `profiles`)
   - ✅ Redirige a `/ialab` después del registro

### Probar webhook:
En Clerk Dashboard → Webhooks → tu endpoint → ver logs. Debe mostrar:
```
✅ 201 - Profile created
```

### Probar sync fallback:
Abrir consola del navegador y buscar:
```
Profile synced to Supabase: user_xxx...
```

---

## Estructura de Archivos Modificados/Creados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `supabase/functions/clerk-webhook/index.ts` | Nuevo | Edge Function para sincronizar Clerk → Supabase |
| `edutechlife-frontend/src/context/AuthContext.jsx` | Modificado | Sync fallback al detectar clerkUser |
| `edutechlife-frontend/.env.example` | Modificado | Variables de Clerk documentadas |
