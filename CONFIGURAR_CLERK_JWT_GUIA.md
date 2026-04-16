# 🔐 CONFIGURAR CLERK JWT TEMPLATE - GUÍA VISUAL

## 📋 INFORMACIÓN DEL TEMPLATE

**Template ID:** `5d74d508-85ee-4a7c-9d50-87005f9b8a90`  
**Nombre:** `Supabase Integration`  
**Algoritmo:** `RS256` (Recomendado) o `HS256`  
**Audience:** `supabase`

## 🚀 PASO 1: ACCEDER A CLERK DASHBOARD

1. **Abre:** https://dashboard.clerk.com
2. **Inicia sesión** con tus credenciales
3. **Selecciona** tu aplicación "Edutechlife"

## 🚀 PASO 2: CREAR JWT TEMPLATE

### Navegación:
1. En el menú lateral, haz clic en **"JWT Templates"**
2. Haz clic en el botón **"New template"**

### Configuración:
```
┌─────────────────────────────────────────────┐
│           Create JWT Template              │
├─────────────────────────────────────────────┤
│ Template ID*: 5d74d508-85ee-4a7c-9d50-87005f9b8a90 │
│ Name*: Supabase Integration                │
│ Algorithm: RS256 (Recommended)             │
│ Signing key: Generate new                  │
│ Audience: supabase                         │
│ Token lifetime: 3600 seconds (1 hour)      │
└─────────────────────────────────────────────┘
```

**Nota:** El **Template ID** DEBE ser exactamente: `5d74d508-85ee-4a7c-9d50-87005f9b8a90`

## 🚀 PASO 3: CONFIGURAR CLAIMS

### Claims requeridos:
```json
{
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "user_metadata": {
    "full_name": "{{user.full_name}}",
    "avatar_url": "{{user.image_url}}"
  },
  "role": "authenticated"
}
```

### Configuración visual en Clerk:
```
┌─────────────────────────────────────────────┐
│           JWT Claims Configuration         │
├─────────────────────────────────────────────┤
│ Add claim:                                 │
│   Key: sub                                 │
│   Value: {{user.id}}                       │
│                                             │
│ Add claim:                                 │
│   Key: email                               │
│   Value: {{user.primary_email_address}}    │
│                                             │
│ Add claim:                                 │
│   Key: user_metadata                       │
│   Value: {                                 │
│     "full_name": "{{user.full_name}}",     │
│     "avatar_url": "{{user.image_url}}"     │
│   }                                        │
│                                             │
│ Add claim:                                 │
│   Key: role                                │
│   Value: authenticated                     │
└─────────────────────────────────────────────┘
```

### Claims avanzados (Opcional pero recomendado):
```json
{
  "https://supabase.com/jwt/claims": {
    "x-hasura-default-role": "authenticated",
    "x-hasura-allowed-roles": ["authenticated", "anon"],
    "x-hasura-user-id": "{{user.id}}",
    "app-metadata": {
      "provider": "clerk",
      "sign_in_provider": "email",
      "role": "{{user.public_metadata.role}}"
    }
  }
}
```

## 🚀 PASO 4: COPIAR JWKS URL

Después de guardar el template:

1. **Busca** la sección **"Signing keys"**
2. **Copia** el **JWKS URL** (se verá como):
   ```
   https://api.clerk.com/v1/jwks
   ```
3. **Guarda** esta URL para el paso siguiente

## 🚀 PASO 5: VERIFICAR CONFIGURACIÓN

### Verificación en Clerk Dashboard:
1. **Ve a** JWT Templates
2. **Haz clic** en tu template "Supabase Integration"
3. **Verifica** que:
   - ✅ Template ID es correcto
   - ✅ Claims están configurados
   - ✅ JWKS URL está disponible

### Test rápido con curl (opcional):
```bash
# Verificar que el JWKS endpoint funciona
curl -s "https://api.clerk.com/v1/jwks" | jq '.'
```

## 🚨 SOLUCIÓN DE PROBLEMAS

### Problema 1: "Template ID already exists"
**Solución:** 
- Usa un Template ID diferente temporalmente
- O elimina el template existente y crea uno nuevo con el ID correcto

### Problema 2: "Invalid claim syntax"
**Solución:**
- Asegúrate de usar comillas dobles `"`
- Verifica que las variables Clerk estén correctas: `{{user.id}}`, no `{user.id}`

### Problema 3: No veo "JWT Templates" en el menú
**Solución:**
- Necesitas permisos de administrador
- O Clerk está en un plan que no incluye JWT Templates (necesitas plan Growth o superior)

### Problema 4: JWKS URL no aparece
**Solución:**
- Usa algoritmo **RS256** (no HS256)
- Genera una nueva signing key
- Espera 1-2 minutos después de crear el template

## ✅ VERIFICACIÓN FINAL

### Checklist:
- [ ] **Template ID:** `5d74d508-85ee-4a7c-9d50-87005f9b8a90`
- [ ] **Nombre:** `Supabase Integration`
- [ ] **Algoritmo:** `RS256`
- [ ] **Audience:** `supabase`
- [ ] **Claims:** `sub`, `email`, `user_metadata`, `role`
- [ ] **JWKS URL:** Copiada y guardada

### Test de integración (después de configurar Supabase JWT):
```javascript
// En consola del navegador (después de login)
await window.Clerk.session.getToken({
  template: '5d74d508-85ee-4a7c-9d50-87005f9b8a90'
});
// Debería retornar un token JWT
```

## 🎯 PRÓXIMOS PASOS

1. **✅ Configurar Supabase JWT Settings** con el JWKS URL
2. **✅ Ejecutar test de verificación:**
   ```bash
   cd /Users/home/Desktop/edutechlife
   node scripts/quick-test.js
   ```
3. **✅ Iniciar aplicación y testear:**
   ```bash
   cd edutechlife-frontend
   npm run dev
   ```

## 📞 SOPORTE CLERK

### Documentación oficial:
- **JWT Templates:** https://clerk.com/docs/authentication/jwt-templates
- **JWKS:** https://clerk.com/docs/authentication/jwks
- **Supabase Integration:** https://clerk.com/docs/integrations/supabase

### Contacto soporte:
- **Email:** support@clerk.com
- **Discord:** https://discord.com/invite/clerk

## ⏱️ TIEMPO ESTIMADO

- **Configurar Clerk JWT:** 5-10 minutos
- **Verificación:** 2-3 minutos
- **Total:** < 15 minutos

---

**🎉 ¡CONFIGURA EL TEMPLATE JWT EN CLERK Y CONTINÚA CON SUPABASE JWT SETTINGS!**