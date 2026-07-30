# Configuración de OAuth para Google y Facebook

Este documento explica cómo configurar Google y Facebook OAuth para permitir que los usuarios se registren usando sus cuentas de Google o Facebook en IALab.

## Variables de Entorno Necesarias

Agregar las siguientes variables a tu archivo `.env` en el backend:

```bash
# Google OAuth
OAUTH_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
OAUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
OAUTH_FACEBOOK_CLIENT_ID=your-facebook-app-id
OAUTH_FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# URLs
BACKEND_URL=http://localhost:3001  # o tu URL de producción
FRONTEND_URL=http://localhost:5174  # o tu URL de producción
```

## Configuración de Google OAuth

### 1. Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ (OAuth 2.0)

### 2. Crear credenciales OAuth

1. Ve a **APIs & Services** → **Credentials**
2. Haz clic en **Create Credentials** → **OAuth client ID**
3. Selecciona **Web application**
4. Agrega URIs autorizados:
   - `http://localhost:3001` (desarrollo)
   - `https://tu-dominio.com` (producción)
   - Redirect URI: `http://localhost:3001/api/auth/callback` (desarrollo)
   - Redirect URI: `https://tu-dominio.com/api/auth/callback` (producción)

### 3. Copiar credenciales

- Copia el **Client ID** y **Client Secret**
- Agrégalos a tu archivo `.env`:
  ```bash
  OAUTH_GOOGLE_CLIENT_ID=your-client-id
  OAUTH_GOOGLE_CLIENT_SECRET=your-client-secret
  ```

## Configuración de Facebook OAuth

### 1. Crear una app en Meta Developer

1. Ve a [Meta for Developers](https://developers.facebook.com)
2. Crea una nueva aplicación (tipo: Consumer)
3. Agrega el producto **Facebook Login**

### 2. Configurar Facebook Login

1. Ve a **Settings** → **Basic**
   - Copia el **App ID** (client ID)
   - Copia la **App Secret** (client secret)

2. Ve a **Facebook Login** → **Settings**
   - Valid OAuth Redirect URIs:
     - `http://localhost:3001/api/auth/callback` (desarrollo)
     - `https://tu-dominio.com/api/auth/callback` (producción)

### 3. Copiar credenciales

- Agrégalas a tu archivo `.env`:
  ```bash
  OAUTH_FACEBOOK_CLIENT_ID=your-app-id
  OAUTH_FACEBOOK_CLIENT_SECRET=your-app-secret
  ```

## Flujo de Autenticación OAuth

```
Frontend                    Backend                OAuth Provider
   |                          |                         |
   |--- Click "Google" -----→ |                         |
   |                          |--- Request Auth ----→   |
   |                          |                    ←---  |
   |  ←---- Redirect URL ---  |                   Code  |
   |                                                      |
   |  User clicks in Google popup, gets redirected back |
   |                                                      |
   |---- code & state -------→ |                         |
   |                          |--- Exchange Token ---→   |
   |                          |                    ←---  |
   |                          |               Access Token
   |                          |--- Get User Info -→      |
   |                          |                    ←---  |
   |                          |            User data     |
   |                          |                          |
   |                          | (Create/Update User)     |
   |                          | in Supabase              |
   |                          |                          |
   |  ←-- Redirect + Token -- |                         |
   |                                                     |
   | Save token, Redirect to /ialab                     |
```

## Testing en Desarrollo

1. Inicia el servidor frontend y backend:
   ```bash
   # Terminal 1: Backend
   cd edutechlife-backend
   npm run dev

   # Terminal 2: Frontend
   cd edutechlife-frontend
   npm run dev
   ```

2. Navega a `http://localhost:5174/sign-up/ialab`

3. Haz clic en "Google" o "Facebook"

4. Autoriza la aplicación

5. Serás redirigido a `/auth/callback` que procesará la autenticación

6. Si todo funciona, serás redirigido a `/ialab`

## Troubleshooting

### Error: "OAuth provider not configured"

**Solución**: Verifica que las variables de entorno están configuradas correctamente en tu `.env`

### Error: "Invalid redirect URI"

**Solución**: Asegúrate que la redirect URI registrada en Google/Facebook coincide exactamente con:
- `http://localhost:3001/api/auth/callback` (desarrollo)
- `https://tu-dominio.com/api/auth/callback` (producción)

### Error: "Token exchange failed"

**Solución**: 
- Verifica que el `client_id` y `client_secret` son correctos
- Asegúrate que el código de autorización no ha expirado
- Revisa los logs del backend para más detalles

### Error: "User fetch failed"

**Solución**:
- El access token puede haber expirado
- Verifica que la API de Google/Facebook está habilitada

## URLs Importantes

- Google Cloud Console: https://console.cloud.google.com
- Meta for Developers: https://developers.facebook.com
- OAuth 2.0 Playground: https://developers.google.com/oauthplayground

## Endpoints OAuth

- `GET /api/auth/oauth/google` - Inicia flujo de Google OAuth
- `GET /api/auth/oauth/facebook` - Inicia flujo de Facebook OAuth
- `GET /api/auth/callback` - Maneja la respuesta de OAuth (callback)

## Seguridad

- Nunca expongas tu `CLIENT_SECRET` en el navegador o repositorio
- Usa HTTPS en producción
- Implementa PKCE para mayor seguridad
- Valida el `state` CSRF en el callback
