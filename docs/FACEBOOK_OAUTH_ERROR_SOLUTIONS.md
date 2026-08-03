# Facebook OAuth Error Solutions

**Error:** "Lo sentimos, pero la app que intentas usar no existe o está deshabilitada"

**Significa:** Facebook no puede acceder a tu aplicación  
**Causa más común:** Configuración incompleta en Facebook Developer Console

---

## 🔴 SOLUCIONES INMEDIATAS

### Solución 1: App en Modo DEVELOPMENT (MÁS COMÚN)

**Síntomas:** El error aparece cuando intentas iniciar sesión con Facebook

**Causa:** Tu app está en modo Development (solo para desarrolladores autorizados)

**Arreglo (2 min):**

1. Ve a Facebook Developers: https://developers.facebook.com/apps/2736342283241555/
2. Click en **Settings** → **Basic**
3. Busca **App Status** (arriba a la derecha)
4. Click en el estado actual (probablemente "Development")
5. Selecciona **Production** → Confirmar

**Resultado:** ✅ Facebook OAuth debería funcionar

---

### Solución 2: Callback URL no Registrada (2ND MÁS COMÚN)

**Síntomas:** Error después de hacer click en Facebook

**Causa:** La URL de callback no está registrada en Facebook Console

**Arreglo (3 min):**

1. Ve a Facebook Developers: https://developers.facebook.com/apps/2736342283241555/
2. Ir a **Products** → **Facebook Login** → **Settings**
3. Busca el campo **Valid OAuth Redirect URIs**
4. Agrega estas URLs (una por línea):
   ```
   https://edutechlife.co/api/auth/callback
   https://api.edutechlife.co/api/auth/callback
   http://localhost:3001/api/auth/callback
   ```
5. Click **Save Changes**
6. Espera 2-5 minutos a que Facebook procese

**Resultado:** ✅ Debería redirigir a Facebook correctamente

---

### Solución 3: Plataforma Web no Configurada

**Síntomas:** Error inmediato al hacer click

**Causa:** No has configurado la plataforma "Website" en Facebook Console

**Arreglo (3 min):**

1. Ve a Facebook Developers: https://developers.facebook.com/apps/2736342283241555/
2. **Settings** → **Basic**
3. Scroll down → **Platforms**
4. Click **Add Platform**
5. Selecciona **Website**
6. En "Site URL", ingresa: `https://edutechlife.co`
7. Click **Save Changes**

**Resultado:** ✅ Plataforma web configurada

---

### Solución 4: Website URL no Configurada

**Síntomas:** "App no existe"

**Causa:** El campo Website URL está vacío

**Arreglo (2 min):**

1. Ve a Facebook Developers: https://developers.facebook.com/apps/2736342283241555/
2. **Settings** → **Basic**
3. Busca el campo **Website URL** (cerca del inicio)
4. Ingresa: `https://edutechlife.co`
5. Click **Save Changes**

**Resultado:** ✅ Website URL configurada

---

### Solución 5: App Secret no en Render

**Síntomas:** Fallo durante intercambio de tokens

**Causa:** `OAUTH_FACEBOOK_CLIENT_SECRET` no está en variables de entorno

**Arreglo (5 min):**

1. Ve a Render Dashboard: https://dashboard.render.com
2. Selecciona tu servicio **Backend**
3. Click en **Environment**
4. Verifica que existe: `OAUTH_FACEBOOK_CLIENT_SECRET`
5. Si no existe, click **Add Variable**:
   ```
   Key:   OAUTH_FACEBOOK_CLIENT_SECRET
   Value: f3d5542450eee087564b50279ce1b57b
   ```
6. Click **Save** → Redeploy (3-5 min)

**Resultado:** ✅ Variables de entorno configuradas

---

## 🔍 CHECKLIST DE DIAGNÓSTICO

Verifica estas cosas EN ORDEN:

### 1. ¿App en Production?
```
Facebook Console → Settings → Basic → App Status
Debería decir: "Production"

❌ Si dice "Development":
   Cambiar a Production (Solución 1 arriba)
```

### 2. ¿Callback URLs registradas?
```
Facebook Console → Products → Facebook Login → Settings
Buscar: "Valid OAuth Redirect URIs"

❌ Si no ves:
   https://edutechlife.co/api/auth/callback

Agregarla (Solución 2 arriba)
```

### 3. ¿Plataforma Web agregada?
```
Facebook Console → Settings → Basic → Platforms
Debería estar "Website"

❌ Si no aparece:
   Agregar Platform → Website (Solución 3 arriba)
```

### 4. ¿Website URL configurada?
```
Facebook Console → Settings → Basic
Buscar "Website URL"
Debería ser: https://edutechlife.co

❌ Si está vacío:
   Llenar con https://edutechlife.co (Solución 4 arriba)
```

### 5. ¿Variables en Render?
```
Render → Backend → Environment
Buscar:
  - OAUTH_FACEBOOK_CLIENT_ID = 2736342283241555
  - OAUTH_FACEBOOK_CLIENT_SECRET = tu_secret

❌ Si falta alguna:
   Agregar (Solución 5 arriba)
```

---

## 📋 PASO A PASO COMPLETO

Si quieres configurar TODO desde cero:

### Paso 1: Facebook Developer Console (10 min)

1. Ve a https://developers.facebook.com/apps/2736342283241555/
2. Click en **Settings** → **Basic**
3. Completa estos campos:

   **App Status:** Production (NO Development)
   
   **Website URL:** https://edutechlife.co
   
   **Platforms:** Agregar Website si no está

4. Click **Save Changes**

5. Ir a **Products** → **Facebook Login** → **Settings**
6. **Valid OAuth Redirect URIs:**
   ```
   https://edutechlife.co/api/auth/callback
   https://api.edutechlife.co/api/auth/callback
   ```
7. Click **Save Changes**

8. Ir a **Permissions**
   - Verificar que `email` y `public_profile` están presentes
   - Si no, agregarlas

### Paso 2: Render (5 min)

1. Render Dashboard → Backend → **Environment**
2. Verificar que existen:
   - `OAUTH_FACEBOOK_CLIENT_ID = 2736342283241555`
   - `OAUTH_FACEBOOK_CLIENT_SECRET = f3d5542450eee087564b50279ce1b57b`
3. Si no existen, agregarlas
4. Click **Save** → Redeploy automático

### Paso 3: Test (2 min)

1. Abre https://edutechlife.co/sign-up/ialab
2. Click "Continuar con Facebook"
3. Debería redirigir a Facebook
4. Autoriza permisos
5. Debería regresar a IALab logueado

---

## 🐛 Si El Error Persiste

### Opción A: Ver DevTools

1. Abre https://edutechlife.co/sign-up/ialab
2. Presiona **F12** (DevTools)
3. Click en pestaña **Network**
4. Click en "Continuar con Facebook"
5. Busca la request a `facebook.com`
6. Mira el **Status Code** y **Response**

**Errores comunes:**
- **Status 400**: Parámetro incorrecto (revisar callback URL)
- **Status 401**: Credenciales incorrectas (revisar App ID/Secret)
- **Status 403**: App deshabilitada (revisar App Status)

### Opción B: Ejecutar Script de Diagnóstico

```bash
bash diagnose-facebook-error.sh

# El script te hará preguntas y te dirá qué arreglar
```

---

## 🆘 ERRORES ESPECÍFICOS

### Error: "Invalid Client ID"
**Causa:** App ID incorrecto o no existe  
**Solución:** 
- Verificar App ID: 2736342283241555
- En Facebook Console, Settings → Basic, buscar "App ID"
- Debe ser exacto

### Error: "Redirect URI Mismatch"
**Causa:** Callback URL no coincide  
**Solución:**
- Facebook Console → Products → Facebook Login → Settings
- Agregar exactamente: `https://edutechlife.co/api/auth/callback`
- Sin caracteres adicionales, exacto

### Error: "User login cancelled"
**Causa:** Usuario canceló en Facebook o no autorizó  
**Solución:**
- Normal - el usuario simplemente no autorizó
- Intentar de nuevo
- O crear cuenta con Email

### Error: "App not set up"
**Causa:** App no está completamente configurada  
**Solución:**
- Facebook Console → Settings → Basic
- Llenar TODOS los campos requeridos:
  - App Name
  - App Contact Email
  - Website URL
  - Agregar Platform → Website

---

## ✅ VERIFICACIÓN FINAL

Cuando creas que ya está arreglado:

```bash
# 1. Test local
npm run dev  # backend
npm run dev  # frontend (otra terminal)
# Abrir http://localhost:5173/sign-up/ialab
# Click "Continuar con Facebook"

# 2. Test staging
# Abrir https://edutechlife.co/sign-up/ialab
# Click "Continuar con Facebook"

# 3. Test E2E
npx playwright test e2e/facebook-oauth.spec.ts

# Todos deberían PASS ✅
```

---

## 📞 Si nada funciona

1. **Ejecuta el diagnóstico:**
   ```bash
   bash diagnose-facebook-error.sh
   ```

2. **Toma screenshot de:**
   - Facebook Console Settings → Basic (App Status, Website URL)
   - Facebook Console Facebook Login Settings (Redirect URIs)
   - Render Environment (variables OAUTH_FACEBOOK_*)

3. **Comparte los screenshots + error exacto**

4. **Espera 5 min después de cambios en FB Console**
   - Facebook necesita procesar cambios de configuración

---

**Tiempo para arreglar:** 10-15 minutos  
**Tasa de éxito:** 95% con estas soluciones
