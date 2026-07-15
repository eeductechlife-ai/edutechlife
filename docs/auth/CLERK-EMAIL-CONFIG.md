# Configuración de Email Verification en Clerk

## Estado Actual: ✅ Email Verification ACTIVADO

El email verification está activado correctamente. Ahora necesitas configurar el envío de emails para que los códigos lleguen.

---

## PASO 1: Verificar la Publishable Key

La key actual en `.env` es:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_c3RhYmxlLW1pbmstNzEuY2xlcmsuYWNjb3VudHMuZGV2JA
```

**Verificación:** Esta key parece correcta. El formato `pk_test_<base64>` es válido.

Para confirmar que funciona, verifica en [Clerk Dashboard → API Keys](https://dashboard.clerk.com/last-active?path=api-keys) que esta sea la publishable key correcta.

---

## PASO 2: Configurar Email Delivery en Clerk

### 2.1 Verificar configuración actual

1. Ir a **Clerk Dashboard** → **Business** → **Emails**
2. Verificar el **From address**:
   - Debería mostrar algo como `your-app@stable-mink-71.clerk.accounts.dev`
3. Hacer click en **Send test email** para probar

### 2.2 Si los emails no llegan

**Causa más común:** Los emails de Clerk van a spam porque se envían desde un dominio genérico `clerk.accounts.dev`.

**Soluciones:**

#### Opción A: Configurar dominio personalizado (Recomendado)

1. **Clerk Dashboard** → **Business** → **Emails**
2. Click en **Connect your domain**
3. Agregar tu dominio: `edutechlife.co`
4. Clerk te dará records DNS para agregar en tu proveedor de dominio (Cloudflare, GoDaddy, etc.):
   - **SPF record** (TXT)
   - **DKIM record** (CNAME)
   - **DMARC record** (TXT)

#### Opción B: Usar SendGrid o Resend

1. Crear cuenta en [Resend.com](https://resend.com) (gratis 3,000 emails/mes)
2. Verificar tu dominio en Resend
3. Copiar la **API Key** de Resend
4. **Clerk Dashboard** → **Business** → **Emails** → **Custom email provider**
5. Seleccionar **Resend** y pegar la API Key

---

## PASO 3: Configurar Webhook para Sincronización

### 3.1 Deploy de Edge Function

```bash
cd /Users/home/Desktop/edutechlife
npx supabase functions deploy clerk-webhook --project-ref srirrwpgswlnuqfgtule
```

### 3.2 Configurar Webhook en Clerk

1. **Clerk Dashboard** → **Webhooks** → **Add Endpoint**
2. **Endpoint URL:** `https://srirrwpgswlnuqfgtule.supabase.co/functions/v1/clerk-webhook`
3. **Eventos:**
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `session.created`
4. Copiar el **Signing Secret** (`whsec_...`)

### 3.3 Guardar variables en Supabase

**Supabase Dashboard** → **Settings** → **Edge Functions**:

| Variable | Valor |
|----------|-------|
| `CLERK_WEBHOOK_SECRET` | `whsec_...` (del paso 3.2) |
| `SUPABASE_URL` | `https://srirrwpgswlnuqfgtule.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Tu service role key de Supabase |

---

## PASO 4: Probar el Flujo Completo

1. Ir a `http://localhost:5173/login?action=signup`
2. Registrar nuevo usuario con email real
3. Verificar:
   - ✅ Recibes código de verificación en el email
   - ✅ Ingresas el código en Clerk
   - ✅ Redirige a `/ialab`
   - ✅ Usuario aparece en Clerk Dashboard → Users
   - ✅ Perfil se crea en Supabase (tabla `profiles`)

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| **Email no llega** | Revisar spam, configurar dominio personalizado, o usar Resend/SendGrid |
| **Email va a spam** | Configurar SPF, DKIM, DMARC en DNS |
| **Usuario no aparece en Clerk** | Verificar publishable key en .env |
| **Perfil no se crea en Supabase** | Verificar webhook está activo, revisar logs de Edge Function |
| **Error de CORS en webhook** | Verificar URL del endpoint en Clerk |

---

## Logs de Verificación

### Clerk Dashboard → Logs
Verifica los logs de Clerk para ver si los emails se envían correctamente.

### Supabase Logs
```bash
npx supabase functions serve --project-ref srirrwpgswlnuqfgtule
```

### Browser Console
Buscar estos mensajes:
```
Profile synced to Supabase: user_xxx...
Profile email verified: user_xxx...
```
