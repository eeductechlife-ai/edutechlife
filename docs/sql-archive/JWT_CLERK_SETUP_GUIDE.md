# Configuración JWT de Clerk para Supabase

## Opción B: Configuración Completa para Producción

### Paso 1: Clerk Dashboard - Crear JWT Template

1. Ir a [Clerk Dashboard](https://dashboard.clerk.com)
2. Seleccionar tu proyecto
3. Ir a **JWT Templates** (en el sidebar)
4. Click en **Add template**
5. Configurar:
   - **Name**: `supabase` (debe ser exactamente este nombre)
   - **Issuer**: `clerk`
   - **Subject**: `{{user.id}}`
   - **Audience**: `supabase`

6. En **Claims**, agregar:
   ```json
   {
     "sub": "{{user.id}}",
     "role": "authenticated"
   }
   ```

7. Click en **Save**

### Paso 2: Clerk Dashboard - Obtener JWT Signing Key

1. Ir a **JWT Templates** → `supabase`
2. Click en **Get signing key** o **View public key**
3. Copiar la **Public Key** (formato PEM)

### Paso 3: Supabase Dashboard - Configurar JWT Externo

1. Ir a [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleccionar tu proyecto
3. Ir a **Project Settings** → **API**
4. En **JWT Settings**:
   - **Enable JWT verification**: ✅ ON
   - **JWT Verification Type**: `JWKS` (recomendado) o `Manual`
   - Si **Manual**:
     - **JWT Secret**: pegar la clave pública de Clerk
   - Si **JWKS**:
     - **JWKS URL**: `https://<TU_CLERK_FRONTEND_API>.clerk.accounts.dev/.well-known/jwks.json`

### Paso 4: Verificar que el JWT Template funciona

En Clerk Dashboard, usar la herramienta **Debug JWT** para verificar que el template genera tokens válidos.

### Paso 5: Aplicar políticas RLS seguras

Ejecutar en Supabase SQL Editor:
```sql
-- Archivo: sql/rls_secure_user_progress.sql
```

### Paso 6: Verificar en la consola del navegador

1. Abrir la app en desarrollo
2. Verificar en la consola:
   ```
   🔑 Token JWT obtenido de Clerk:
      - Longitud: XXX
      - Primeros 50 chars: eyJ...
      - ¿Es JWT válido? Sí (empieza con eyJ)
   ✅ Cliente Supabase configurado con JWT de Clerk (fetch personalizado)
   ```

3. Si dice `No se pudo obtener token JWT de Clerk`, el template no está configurado correctamente.

---

## Troubleshooting

### Error: "No se pudo obtener token JWT de Clerk"

**Causa:** El template `supabase` no existe en Clerk Dashboard.

**Solución:** Crear el template JWT como se indica en el Paso 1.

### Error: "JWT invalid" en Supabase

**Causa:** Supabase no reconoce la firma del JWT de Clerk.

**Solución:** Verificar que la clave pública de Clerk está correctamente configurada en Supabase (Paso 3).

### Error: "RLS policy violation"

**Causa:** Las políticas RLS están usando `auth.uid()` pero el JWT de Clerk usa `user_id` como claim.

**Solución:** Verificar que el claim `sub` en el JWT de Clerk es el user ID de Clerk (`user_3CSZ...`).

---

## Comparación Opción A vs Opción B

| Característica | Opción A (Permissivo) | Opción B (Seguro) |
|----------------|----------------------|-------------------|
| Autenticación | Anon key | JWT de Clerk |
| SELECT | `true` (cualquiera) | `auth.uid() = user_id` |
| INSERT | `true` (cualquiera) | `auth.uid() = user_id` |
| UPDATE | `true` (cualquiera) | `auth.uid() = user_id` |
| DELETE | `true` (cualquiera) | `auth.uid() = user_id` |
| Uso recomendado | Desarrollo | Producción |
