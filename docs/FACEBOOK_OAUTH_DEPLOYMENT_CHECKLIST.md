# Facebook OAuth Deployment Checklist

**Estado:** Implementación de Facebook OAuth lista para activar  
**Fecha:** 3 de agosto de 2026  
**Responsable:** Team DevOps/Backend

---

## 📋 PRE-REQUISITOS

- [ ] Tienes App ID de Facebook: `2736342283241555`
- [ ] Tienes App Secret de Facebook: `f3d5542450eee087564b50279ce1b57b`
- [ ] Acceso a Render Dashboard
- [ ] Acceso a Facebook Developer Console
- [ ] Dominio de producción: `edutechlife.co` (o subdominio)

---

## 🔧 FASE 1: CONFIGURACIÓN LOCAL (5 min)

### Paso 1.1: Verificar que el código está listo

```bash
# Navegar al proyecto
cd /Users/home/Desktop/edutechlife

# Ejecutar script de verificación
bash scripts/verify-facebook-oauth.sh
```

**Esperado:**
```
✓ Auth.js soporta Facebook
✓ URL de token correcta
✓ Botón Facebook implementado
✓ Google OAuth intacto
```

### Paso 1.2: Configurar variables locales (para test local)

```bash
# Ejecutar script de setup
bash scripts/setup-facebook-oauth.sh

# Seleccionar:
# 1) Local (development)
# Ingresar:
# - App ID: 2736342283241555
# - App Secret: f3d5542450eee087564b50279ce1b57b
```

**Resultado:** Variables agregadas a `.env.local`

### Paso 1.3: Test local (opcional)

```bash
# Terminal 1: Backend
cd edutechlife-backend
npm run dev

# Terminal 2: Frontend
cd edutechlife-frontend
npm run dev

# Abrir http://localhost:5173/sign-up/ialab
# Click en "Continuar con Facebook"
# Debería redirigir a Facebook (o error si no autorizas)
```

---

## 🚀 FASE 2: CONFIGURACIÓN EN RENDER (10 min)

### Paso 2.1: Agregar variables de entorno

1. **Ve a Render Dashboard:** https://dashboard.render.com
2. **Selecciona tu servicio backend**
3. **Click en "Environment"**
4. **Click en "Add Environment Variable"**

Agrega Variable 1:
```
Key:   OAUTH_FACEBOOK_CLIENT_ID
Value: 2736342283241555
```

Agrega Variable 2:
```
Key:   OAUTH_FACEBOOK_CLIENT_SECRET
Value: f3d5542450eee087564b50279ce1b57b
```

5. **Click en "Save"**
6. Render redeploy automático (3-5 min)

**Verificación:**
```bash
# Render → Logs → Filter
# Buscar: "OAuth"
# Debería ver logs sin errores de configuración
```

---

## 🔑 FASE 3: CONFIGURACIÓN EN FACEBOOK CONSOLE (10 min)

### Paso 3.1: Registrar Callback URLs

1. **Ve a Facebook Developers:** https://developers.facebook.com/apps/2736342283241555/
2. **Ir a "Products" → "Facebook Login" → "Settings"**
3. **Busca "Valid OAuth Redirect URIs"**
4. **Agregar URLs (una por línea):**

```
https://edutechlife.co/api/auth/callback
https://api.edutechlife.co/api/auth/callback
http://localhost:3001/api/auth/callback
```

5. **Click "Save Changes"**

### Paso 3.2: Verificar Permisos

1. **Ir a "Permisos" (Permissions)**
2. **Verificar que tienes:**
   - ✅ `email`
   - ✅ `public_profile`
3. Si faltan, agregarlas

### Paso 3.3: Verificar App Status

1. **Ir a "Settings" → "Basic"**
2. **App Status:** Debería estar en **Producción** (si es live)
3. **App ID visible:** `2736342283241555`
4. **App Secret guardado:** `f3d5542450eee087564b50279ce1b57b`

---

## ✅ FASE 4: PRUEBAS EN STAGING (10 min)

### Paso 4.1: Test de endpoint OAuth

```bash
curl -X GET "https://api.edutechlife.co/api/auth/oauth/facebook?redirect_uri=https://edutechlife.co/auth/callback" \
  -w "\nStatus: %{http_code}\n"

# Esperado: 302 (redirect a Facebook)
```

### Paso 4.2: Test en navegador (staging)

1. Abre: `https://edutechlife.co/sign-up/ialab`
2. Click en "Continuar con Facebook"
3. Debería redirigir a Facebook
4. Autorizar permisos
5. Debería regresar a IALab logueado
6. Verificar usuario creado en Supabase

### Paso 4.3: Verificar usuario en Supabase

```sql
-- En Supabase SQL Editor
SELECT id, email, first_name, last_name, registration_source 
FROM users 
WHERE registration_source = 'ialab_signup' 
ORDER BY created_at DESC 
LIMIT 5;

-- Debería ver usuarios nuevos con email de Facebook
```

### Paso 4.4: Verificar que no rompe usuarios existentes

- [ ] Login con Email/Password sigue funcionando
- [ ] Login con Google sigue funcionando
- [ ] Usuarios existentes pueden acceder a su cuenta

---

## 🧪 FASE 5: TESTING AUTOMATIZADO (5 min)

```bash
# Ejecutar E2E tests de Facebook OAuth
npx playwright test e2e/facebook-oauth.spec.ts

# Resultado esperado: 10/10 tests pass
```

**Tests que valida:**
- Facebook button visible
- OAuth endpoint accessible
- Callback endpoint exists
- Google OAuth no roto
- Email signup no roto
- UI mantiene branding IALab
- Responsivo en mobile

---

## 📊 FASE 6: MONITOREO POST-DESPLIEGUE (Continuo)

### Logging

```bash
# Render Dashboard → Logs
# Buscar keywords:
# - "OAuth initiate"     → Request exitoso
# - "Token exchange"     → Intercambio de código
# - "User fetch"         → Obtención de datos Facebook
# - "User profile created" → Usuario creado en Supabase

# Errores a buscar:
# - "not configured" → Variables no están
# - "redirect_uri_mismatch" → URL no registrada en Facebook
# - "Invalid OAuth state" → CSRF error
```

### Métricas en PostHog

```
Events a monitorear:
- signup_method: facebook
- oauth_provider: facebook
- oauth_error: <error_type>

Alertas:
- Si oauth_error rate > 5% en 1 hora
- Si signup_method:facebook = 0 en 24h
```

### Sentry

```
Buscar:
- Errors con "OAuth"
- Errors con "facebook"
- 429/500 en /api/auth/callback
```

---

## 🚨 TROUBLESHOOTING

### Error: "Invalid Client ID"
**Causa:** Variables no configuradas en Render  
**Solución:**
1. Ve a Render Dashboard → Environment
2. Verifica OAUTH_FACEBOOK_CLIENT_ID
3. Resave → Redeploy

### Error: "Redirect URI Mismatch"
**Causa:** URL no registrada en Facebook Console  
**Solución:**
1. Facebook Developers Console
2. Products → Facebook Login → Settings
3. Agregar URL exacta en Valid OAuth Redirect URIs
4. Save Changes

### Error: "Invalid OAuth State"
**Causa:** CSRF protection falló  
**Solución:**
1. Limpiar cookies del navegador
2. Intentar de nuevo
3. Si persiste: revisar logs en Render

### Error: "User Fetch Failed"
**Causa:** Permisos incorrectos en Facebook App  
**Solución:**
1. Facebook Developers → Permissions
2. Verificar `email` + `public_profile`
3. Si no están, agregarlas

### Facebook Login redirige a blank page
**Causa:** Callback URL no válida  
**Solución:**
1. Verificar que callback URL está en Facebook Console
2. Verificar que BACKEND_URL está bien en Render
3. Verificar que certificado HTTPS es válido

---

## 📈 ROLLBACK PLAN

Si algo sale mal:

### Opción 1: Disable Facebook OAuth (Rápido - 2 min)
```bash
# Render → Environment
# Comentar o borrar:
# OAUTH_FACEBOOK_CLIENT_ID
# OAUTH_FACEBOOK_CLIENT_SECRET
# Save → Redeploy

# Resultado: Botón Facebook sigue visible pero da error
# Usuario puede seguir usando Email/Google
```

### Opción 2: Remover botón temporalmente (5 min)
```bash
# Editar: edutechlife-frontend/src/components/SupabaseSignUpForm.jsx
# Comentar las líneas con Facebook button (line ~393-406)
# npm run build
# Deploy

# Resultado: Botón desaparece, usuarios no afectados
```

### Opción 3: Revert completo (10 min)
```bash
# Git revert commit de Facebook OAuth
git revert 2d5ddc8

# Push → Render redeploy
# Resultado: Código vuelve a estado anterior
```

---

## ✅ SIGNOFF CHECKLIST

### Pre-Deployment
- [ ] Código verificado: `verify-facebook-oauth.sh` pass
- [ ] Variables en Render configuradas
- [ ] Callback URLs en Facebook Console
- [ ] Permisos en Facebook Console OK
- [ ] Test local exitoso
- [ ] E2E tests pass: 10/10

### Post-Deployment
- [ ] Render redeploy completado (3-5 min)
- [ ] Login test en staging: exitoso
- [ ] Usuario creado en Supabase
- [ ] No rompe usuarios existentes
- [ ] Logs sin errores de OAuth
- [ ] PostHog monitoreo activo
- [ ] Sentry alertas configuradas

### 24h Monitoring
- [ ] Chequear error rate en Sentry
- [ ] Chequear analytics en PostHog
- [ ] Verificar que usuarios nuevos pueden loguear
- [ ] Revisar feedback de usuarios
- [ ] Escalate si issues

---

## 📞 Contacto & Escalation

**Si hay problemas:**

1. **Verificar logs:** Render → Logs → "OAuth"
2. **Verificar config:** Render → Environment → OAUTH_FACEBOOK_*
3. **Verificar Facebook Console:** Callback URLs + Permisos
4. **Ejecutar verify script:** `bash verify-facebook-oauth.sh`
5. **Si no se resuelve:** Activar rollback (opción 1-3 arriba)

---

## 📝 Documentos de Referencia

- `docs/FACEBOOK_OAUTH_INTEGRATION.md` — Setup detallado
- `e2e/facebook-oauth.spec.ts` — Tests automatizados
- `scripts/setup-facebook-oauth.sh` — Setup asistido
- `scripts/verify-facebook-oauth.sh` — Verificación

---

**Tiempo total de implementación:** 30-40 minutos  
**Riesgo:** Bajo (aditivo, no rompe usuarios existentes)  
**Rollback:** Posible en <10 min
