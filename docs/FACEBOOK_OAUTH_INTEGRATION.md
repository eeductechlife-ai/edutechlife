# Facebook OAuth Login Integration Guide

**Objetivo:** Permitir que estudiantes ingresen a IALab con su cuenta de Facebook.

**Estado:** Infraestructura backend lista, solo falta configurar credenciales.

---

## 📋 Credenciales Que Tienes

```
App ID:        2736342283241555
App Secret:    f3d5542450eee087564b50279ce1b57b
```

---

## ⚙️ PASO 1: Configurar Variables de Entorno

### En Backend (Render)

1. Ve a **Render Dashboard** → Tu servicio backend
2. Click en **Environment** → **Add Environment Variable**

Agrega dos variables:

```
OAUTH_FACEBOOK_CLIENT_ID=2736342283241555
OAUTH_FACEBOOK_CLIENT_SECRET=f3d5542450eee087564b50279ce1b57b
```

3. Redeploy automático (Render debería detectar cambios en .env)

### En Local Development (si testeas localmente)

Edita `.env.local` en backend:

```bash
# Backend OAuth Configuration
OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
OAUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret
OAUTH_FACEBOOK_CLIENT_ID=2736342283241555
OAUTH_FACEBOOK_CLIENT_SECRET=f3d5542450eee087564b50279ce1b57b
```

---

## ⚙️ PASO 2: Configurar Callback URL en Facebook Developer Console

### En Facebook Developers (https://developers.facebook.com/)

1. **Ir a tu aplicación**
   - Abre https://developers.facebook.com/apps/2736342283241555/
   - Click en tu app

2. **Ir a Settings → Basic** (ya hecho probablemente)
   - Verifica App ID y App Secret
   - Nota los valores (ya los tienes)

3. **Agregar plataforma Web**
   - Ir a **Settings → Basic**
   - Scroll down → Click **Add Platform**
   - Selecciona **Website**
   - URL del sitio: `https://edutechlife.co` (o dominio staging)

4. **Configurar Callback URL**
   - Ir a **Products → Facebook Login → Settings**
   - En **Valid OAuth Redirect URIs**, agrega:
     ```
     https://edutechlife.co/api/auth/callback
     http://localhost:3001/api/auth/callback  (para desarrollo local)
     ```
   - Click **Save Changes**

5. **Permisos requeridos**
   - Ir a **Permisos**
   - Verificar que tienes:
     - `email` ✓
     - `public_profile` ✓
   - Si no están, agregarlos

---

## 🔧 PASO 3: Verificar Configuración en Frontend (Ya lista)

El frontend ya tiene botón de Facebook. Verificar en:

**Archivo:** `edutechlife-frontend/src/components/SupabaseSignUpForm.jsx`

```jsx
// Ya existe este código:
<button
  type="button"
  onClick={() => handleOAuthSignUp("facebook")}
  className="w-full px-6 py-3 bg-white border-2 border-gray-200..."
>
  <svg>...</svg>
  Continuar con Facebook
</button>
```

✅ **No requiere cambios** (el botón ya está listo)

---

## 🧪 PASO 4: Probar Localmente (Opcional)

### Setup para desarrollo local

1. **Backend con variables:**
   ```bash
   cd edutechlife-backend
   # Editar .env con tus credenciales
   OAUTH_FACEBOOK_CLIENT_ID=2736342283241555
   OAUTH_FACEBOOK_CLIENT_SECRET=f3d5542450eee087564b50279ce1b57b
   BACKEND_URL=http://localhost:3001
   ```

2. **Iniciar backend:**
   ```bash
   npm run dev
   # Debería escuchar en http://localhost:3001
   ```

3. **Iniciar frontend:**
   ```bash
   cd edutechlife-frontend
   npm run dev
   # Abre http://localhost:5173
   ```

4. **Test login:**
   - Click en "Continuar con Facebook"
   - Debería redirigir a Facebook
   - Después de autorizar, debería volver a IALab logueado

### Troubleshooting Local

| Error | Causa | Solución |
|-------|-------|----------|
| "OAuth provider facebook not configured" | Variables no definidas en .env | Verificar OAUTH_FACEBOOK_CLIENT_ID y SECRET |
| "Redirect URL mismatch" | URL no registrada en Facebook App | Agregar http://localhost:3001/api/auth/callback |
| "HTTPS required" | Facebook requiere HTTPS en producción | Local puede usar HTTP, prod debe ser HTTPS |

---

## 🚀 PASO 5: Desplegar a Producción

### En Render (Después de configurar variables)

1. **Actualizar variables en Render Console**
   - Backend → Environment
   - OAUTH_FACEBOOK_CLIENT_ID=2736342283241555
   - OAUTH_FACEBOOK_CLIENT_SECRET=f3d5542450eee087564b50279ce1b57b
   - Guardar

2. **Render redeploy automático**
   - Debería iniciar redeploy
   - Esperar ~3-5 min

3. **Verificar en logging**
   ```bash
   # Ver logs en Render
   Render Dashboard → Logs
   Buscar: "OAuth initiate" (debería ver requests)
   ```

### En Facebook Console

1. **Agregar URL de callback producción**
   - Facebook Developers → Tu App → Settings
   - Valid OAuth Redirect URIs:
     - `https://api.edutechlife.co/api/auth/callback` (si usa subdominio)
     - O `https://edutechlife.co/api/auth/callback` (si es dominio raíz)

2. **Cambiar modo de App (si aplica)**
   - Ir a Settings → Basic
   - App Status: **Producción** (si aplica)

---

## ✅ Verificación Post-Integración

### 1. Endpoint disponible

```bash
curl -X GET "http://localhost:3001/api/auth/oauth/facebook" \
  -G --data-urlencode "redirect_uri=http://localhost:3001/callback"

# Debería redirigir a https://www.facebook.com/v18.0/dialog/oauth?...
```

### 2. Botón funciona

1. Ir a `http://localhost:5173/sign-up/ialab` (o URL de signup)
2. Hacer click en "Continuar con Facebook"
3. Debería redirigir a Facebook (o mostrar error si no autorizas)

### 3. Callback maneja respuesta

Después de autorizar en Facebook:
- Debería redirigir a `/api/auth/callback?code=...&state=...`
- Backend intercambia `code` por `access_token`
- Backend obtiene info de usuario (email, nombre)
- Crea o actualiza usuario en Supabase
- Redirige a IALab logueado

### 4. Usuario creado en Supabase

```sql
-- En Supabase SQL editor, verificar:
SELECT * FROM users 
WHERE email = 'tu.email@facebook.com'
LIMIT 1;

-- Debería tener:
-- - id: UUID generado
-- - email: tu email de Facebook
-- - first_name / last_name: datos de Facebook
-- - registration_source: 'ialab_signup'
```

---

## 🔒 Seguridad: CSRF Protection

El código incluye protección CSRF con `state`:

```javascript
// Backend genera state único:
const state = `facebook:${crypto.randomBytes(24).toString('hex')}`;

// En callback, verifica que state coincida:
const provider = state.split(':')[0];
if (provider !== 'facebook') { /* error */ }
```

✅ **Ya está implementado** (no requiere cambios)

---

## 📊 Flujo Completo

```
Usuario                Frontend             Backend              Facebook
   │                     │                    │                    │
   ├─ Click Facebook ────>│                    │                    │
   │                     ├─ GET /oauth/fb ───>│                    │
   │                     │                    ├─ Generate state ───│
   │                     │<───────────── Redirect to Facebook ──────>│
   │                     │                                          User
   │                     │<────────── Allow/Deny on Facebook ────────│
   │                     │<────── Redirect with code + state ────────│
   │                     ├─ GET /callback ───>│                    │
   │                     │                    ├─ Verify state      
   │                     │                    ├─ Exchange code ───>│
   │                     │                    │<─ Access token ────│
   │                     │                    ├─ Fetch user info ->│
   │                     │                    │<─ Email, name ─────│
   │                     │                    ├─ Create user (Supabase)
   │                     │<───── Redirect to /ialab + jwt ─────────│
   │<──────────────────────────────────────────────────────────────│
   │  Logueado en IALab
```

---

## 🐛 Debugging

### Ver request en Render logs

```bash
# Render dashboard → Logs → Filter
# Buscar: "OAuth"

# Ejemplo de logs esperados:
[INFO] OAuth initiate: provider=facebook, state=facebook:abc123...
[INFO] Token exchange: facebook, access_token=ABC123...
[INFO] User fetched: email=user@example.com, name=User Name
[INFO] User profile created: id=uuid, email=user@example.com
```

### Errores comunes

| Error | Solución |
|-------|----------|
| `invalid_client` | Verifica App ID y Secret en Render |
| `redirect_uri_mismatch` | Agrega URL en Facebook Console |
| `Invalid OAuth state` | Limpia cookies, intenta de nuevo |
| `User fetch failed` | Verifica que app tiene permisos email + public_profile |

---

## 📝 Resumen de Cambios

**Archivos que NO requieren cambios:**
- ✅ Backend OAuth code (ya soporta Facebook)
- ✅ Frontend buttons (ya existen)
- ✅ Login flow (integrado)

**Solo requiere:**
1. ✏️ Agregar 2 variables en Render
2. ✏️ Agregar callback URL en Facebook Console
3. ✅ Test en staging/producción

---

## 📞 Support

Si algo no funciona:

1. **Verificar logs en Render**
   - Backend → Logs → Search "OAuth"

2. **Verificar variables en Render**
   - Backend → Environment → Check OAUTH_FACEBOOK_*

3. **Verificar Facebook App**
   - https://developers.facebook.com/apps/2736342283241555/
   - Settings → Basic (credenciales)
   - Products → Facebook Login → Settings (redirect URI)

4. **Test local**
   - npm run dev (frontend)
   - npm run dev (backend con .env)
   - Click botón Facebook → autorizar

---

**Tiempo de setup:** 15-20 minutos  
**Riesgo de regresión:** Muy bajo (aditivo, no rompe OAuth existente)  
**Impacto en usuarios:** Solo aparece botón nuevo, logins existentes intactos
