# Configuración de Emails de Confirmación en Clerk

## Problema Actual
Los usuarios se registran pero no reciben emails de confirmación.

## Solución
Configurar templates de email en el dashboard de Clerk.

## Pasos para Configurar Clerk

### 1. Acceder al Dashboard de Clerk
1. Ve a [dashboard.clerk.com](https://dashboard.clerk.com)
2. Inicia sesión con tus credenciales
3. Selecciona tu aplicación "EdutechLife"

### 2. Configurar Email Templates
En el sidebar izquierdo:
1. Ve a **"Email & SMS"** → **"Email Templates"**
2. Configura los siguientes templates:

#### Template: "Sign-up"
- **Asunto**: `Confirma tu cuenta en EdutechLife`
- **Contenido**:
```
¡Bienvenido a EdutechLife!

Hola {{user.firstName}},

Gracias por registrarte en EdutechLife. Para comenzar a usar tu cuenta, por favor confirma tu dirección de email haciendo clic en el siguiente enlace:

{{url}}

Este enlace expirará en 24 horas.

Si no te registraste en EdutechLife, puedes ignorar este email.

Saludos,
El equipo de EdutechLife
```

#### Template: "Sign-in"
- **Asunto**: `Inicia sesión en EdutechLife`
- **Contenido**:
```
Inicio de sesión en EdutechLife

Hola {{user.firstName}},

Hemos recibido una solicitud para iniciar sesión en tu cuenta de EdutechLife.

Haz clic en el siguiente enlace para iniciar sesión:

{{url}}

Este enlace expirará en 15 minutos.

Si no solicitaste iniciar sesión, por favor ignora este email.

Saludos,
El equipo de EdutechLife
```

### 3. Configurar From Address
1. Ve a **"Email & SMS"** → **"Sender Addresses"**
2. Agrega o verifica una dirección de email:
   - **Email**: `noreply@edutechlife.co` (o tu dominio)
   - **Nombre**: `EdutechLife`
3. Verifica la dirección de email siguiendo las instrucciones

### 4. Configurar Dominio de Email
1. Ve a **"Email & SMS"** → **"Email Settings"**
2. Configura:
   - **From Name**: `EdutechLife`
   - **Reply-to address**: `soporte@edutechlife.co`
   - **Custom domain** (opcional): Configura tu dominio para emails

### 5. Configurar URLs de Redirección
1. Ve a **"Sessions"** → **"Redirect URLs"**
2. Agrega las siguientes URLs:
   - `https://edutechlife.co/auth/callback` (producción)
   - `http://localhost:5174/auth/callback` (desarrollo)
   - `https://edutechlife.co/dashboard` (after sign-in)
   - `https://edutechlife.co/` (after sign-out)

### 6. Verificar Configuración de JWT (Opcional)
Si estás usando JWT templates con Supabase:
1. Ve a **"Sessions"** → **"JWT Templates"**
2. Verifica que el template `supabase-jwt` esté configurado
3. Los claims deben incluir:
   ```json
   {
     "https://supabase.com/jwt/claims": {
       "x-hasura-default-role": "authenticated",
       "x-hasura-allowed-roles": ["authenticated", "anon"],
       "x-hasura-user-id": "{{user.id}}"
     }
   }
   ```

## Testing
1. **Registra un usuario de prueba** en tu aplicación
2. **Revisa la bandeja de entrada** del email usado
3. **Verifica que el email llegue** y que los enlaces funcionen
4. **Prueba el flujo completo**: Registro → Email → Confirmación → Login

## Solución de Problemas

### Emails no llegan
1. **Revisa la carpeta de spam**
2. **Verifica la configuración de DNS** (SPF, DKIM, DMARC)
3. **Revisa los logs de Clerk** en el dashboard
4. **Prueba con un email diferente** (Gmail, Outlook, etc.)

### Enlaces no funcionan
1. **Verifica las URLs de redirección** en Clerk
2. **Asegúrate que tu aplicación maneje** `/auth/callback`
3. **Prueba en modo incógnito** para evitar problemas de caché

### Usuarios no se crean en Supabase
1. **Ejecuta el script SQL** `supabase_auto_profile_trigger.sql`
2. **Verifica que el trigger** `on_auth_user_created` exista
3. **Revisa los logs de Supabase** en el dashboard

## Configuración Automática (API)
Si prefieres configurar programáticamente:

```bash
# Instalar CLI de Clerk
npm install -g @clerk/clerk

# Configurar
clerk login
clerk templates create sign-up --subject "Confirma tu cuenta" --body "template.html"
```

## Recursos
- [Documentación de Clerk - Email Templates](https://clerk.com/docs/email-templates)
- [Guía de Configuración de Email](https://clerk.com/docs/email-configuration)
- [Soporte de Clerk](https://clerk.com/docs/support)

## Notas Importantes
1. **Los emails pueden tardar** unos minutos en llegar
2. **Clerk tiene límites** en el plan gratuito (1000 emails/mes)
3. **Configura un dominio personalizado** para mejor deliverability
4. **Monitorea los bounce rates** en el dashboard de Clerk

Una vez configurado, los usuarios deberían recibir emails de confirmación automáticamente al registrarse.