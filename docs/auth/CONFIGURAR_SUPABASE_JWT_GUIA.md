# ⚙️ CONFIGURAR SUPABASE JWT SETTINGS - GUÍA VISUAL

## 📋 INFORMACIÓN REQUERIDA

**JWKS URL de Clerk:** `https://api.clerk.com/v1/jwks` (o tu URL específica)  
**Issuer:** `clerk.edutechlife.com` (o tu dominio Clerk)  
**Audience:** `supabase`

## 🚀 PASO 1: ACCEDER A SUPABASE DASHBOARD

1. **Abre:** https://app.supabase.com/project/srirrwpgswlnuqfgtule
2. **Inicia sesión** con tus credenciales
3. **Verifica** que estás en el proyecto correcto: `srirrwpgswlnuqfgtule`

## 🚀 PASO 2: NAVEGAR A JWT SETTINGS

### Ruta:
```
Dashboard → Authentication → Providers → JWT Settings
```

### Navegación visual:
```
┌─────────────────────────────────────────────┐
│ Supabase Dashboard                         │
├─────────────────────────────────────────────┤
│ [ ] Project Overview                       │
│ [ ] Table Editor                           │
│ [ ] SQL Editor                             │
│ [X] Authentication  ← Haz clic aquí       │
│     [ ] Users                              │
│     [ ] Policies                           │
│     [X] Providers  ← Luego aquí           │
│         [ ] Email                          │
│         [ ] Phone                          │
│         [X] JWT Settings  ← Finalmente aquí│
└─────────────────────────────────────────────┘
```

## 🚀 PASO 3: CONFIGURAR CUSTOM JWT

### Pantalla de configuración:
```
┌─────────────────────────────────────────────┐
│           JWT Settings                     │
├─────────────────────────────────────────────┤
│ [ ] Enable Custom JWT (Habilitar)          │
│                                             │
│ JWKS URL*:                                 │
│ https://api.clerk.com/v1/jwks              │
│                                             │
│ Issuer*:                                   │
│ clerk.edutechlife.com                      │
│                                             │
│ Audience:                                  │
│ supabase                                   │
│                                             │
│ [ ] Save Changes (Guardar)                 │
└─────────────────────────────────────────────┘
```

### Configuración detallada:

1. **Habilita "Enable Custom JWT"** (checkbox)
2. **JWKS URL:** Pega el JWKS URL de Clerk
   - Formato: `https://api.clerk.com/v1/jwks`
   - O la URL específica que te dio Clerk
3. **Issuer:** `clerk.edutechlife.com`
   - Puede ser cualquier string, pero debe coincidir con lo configurado en Clerk
4. **Audience:** `supabase` (opcional, pero recomendado)
5. **Haz clic en "Save Changes"**

## 🚀 PASO 4: VERIFICAR CONFIGURACIÓN

### Verificación en Supabase:
1. **Recarga** la página
2. **Verifica** que "Enable Custom JWT" sigue habilitado
3. **Los campos** deberían mostrar los valores guardados

### Test con SQL (opcional):
```sql
-- Verificar que auth.jwt() funciona
SELECT 
  current_setting('request.jwt.claims', true)::json as jwt_claims,
  auth.jwt() as auth_jwt;
```

## 🚀 PASO 5: TESTEAR INTEGRACIÓN COMPLETA

### Script de testing:
```bash
cd /Users/home/Desktop/edutechlife
node scripts/quick-test.js
```

**Resultado esperado:** Score 100%

### Test manual en aplicación:
1. **Inicia la aplicación:**
   ```bash
   cd edutechlife-frontend
   npm run dev
   ```
2. **Abre** http://localhost:5174
3. **Inicia sesión** con Clerk
4. **Verifica en consola del navegador:**
   ```
   ✅ Integración premium verificada exitosamente
   ✅ Token JWT obtenido de Clerk
   ```

## 🚨 SOLUCIÓN DE PROBLEMAS

### Problema 1: "Invalid JWKS URL"
**Solución:**
- Verifica que el JWKS URL sea exactamente el de Clerk
- Asegúrate de que Clerk JWT Template esté configurado con RS256
- Prueba el JWKS URL en el navegador: `https://api.clerk.com/v1/jwks`

### Problema 2: "JWT verification failed"
**Solución:**
- Verifica que el **Issuer** en Supabase coincida con lo configurado en Clerk
- Asegúrate de que el **Audience** sea `supabase` en ambos lados
- Verifica que el token no haya expirado (default: 1 hora)

### Problema 3: `auth.uid()` retorna null
**Solución:**
- Verifica que el claim `sub` en Clerk esté configurado como `{{user.id}}`
- Testea el token manualmente:
  ```javascript
  // En consola del navegador
  const token = await window.Clerk.session.getToken({
    template: '5d74d508-85ee-4a7c-9d50-87005f9b8a90'
  });
  console.log('Token:', token);
  
  // Decodificar
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Payload:', payload);
  console.log('sub claim:', payload.sub);
  ```

### Problema 4: RLS no funciona
**Solución:**
- Verifica que las tablas tengan RLS habilitado:
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'course_progress', 'certificates', 'quiz_attempts', 'student_sessions');
  ```
- Verifica políticas RLS:
  ```sql
  SELECT * FROM pg_policies WHERE schemaname = 'public';
  ```

## ✅ CHECKLIST FINAL

### Configuración Supabase:
- [ ] **Custom JWT habilitado**
- [ ] **JWKS URL** correcto (de Clerk)
- [ ] **Issuer** configurado (`clerk.edutechlife.com`)
- [ ] **Audience** configurado (`supabase`)
- [ ] **Cambios guardados**

### Integración funcionando:
- [ ] **SQL ejecutado** (tablas creadas)
- [ ] **RLS habilitado** en tablas
- [ ] **Índices creados**
- [ ] **Funciones SQL** instaladas

### Testing:
- [ ] **Script quick-test** pasa con 100%
- [ ] **Aplicación** inicia sin errores
- [ ] **Login Clerk** funciona
- [ ] **Token JWT** se obtiene correctamente
- [ ] `auth.uid()` funciona en queries

## 🎯 PRÓXIMOS PASOS DESPUÉS DE CONFIGURAR

### 1. Testear operaciones del curso:
```javascript
// Usando el cliente premium
const { supabase: premiumSupabase, userId } = usePremiumSupabase();

// Guardar progreso
await premiumSupabase.from('course_progress').upsert({
  user_id: userId,
  module_id: 1,
  lesson_id: 1,
  is_completed: true,
  score: 95
});

// Obtener progreso
const { data } = await premiumSupabase
  .from('course_progress')
  .select('*')
  .eq('user_id', userId);
```

### 2. Verificar dashboard admin:
```sql
-- En Supabase SQL Editor
SELECT * FROM admin_active_users;
SELECT * FROM admin_course_stats;
```

### 3. Configurar webhooks (opcional):
- Clerk → Supabase para sincronización automática
- Notificaciones de certificados
- Analytics de aprendizaje

## 📞 SOPORTE SUPABASE

### Documentación oficial:
- **Custom JWT:** https://supabase.com/docs/guides/auth/custom-jwt
- **JWKS:** https://supabase.com/docs/guides/auth/jwks
- **RLS:** https://supabase.com/docs/guides/auth/row-level-security

### Contacto soporte:
- **Email:** support@supabase.com
- **Discord:** https://discord.com/invite/supabase
- **Foro:** https://github.com/orgs/supabase/discussions

## ⏱️ TIEMPO ESTIMADO

- **Configurar Supabase JWT:** 5-10 minutos
- **Verificación y testing:** 5-10 minutos
- **Total:** < 20 minutos

---

**🎉 ¡CONFIGURACIÓN COMPLETA! AHORA TIENES INTEGRACIÓN PREMIUM CLERK + SUPABASE FUNCIONANDO.**