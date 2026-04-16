# CONFIGURAR SUPABASE JWT CON CLERK - PASOS INMEDIATOS

## PREREQUISITOS COMPLETADOS
✅ Template ID actualizado: `jtmp_3CIqFjJN9WJsV1qPT5VTW09gA7e`
✅ SQL adaptado listo para ejecutar
✅ Service Role Key configurado

## PASOS A SEGUIR (EJECUTAR EN ORDEN)

### 1. EJECUTAR SQL EN SUPABASE (AHORA MISMO)
**URL:** https://supabase.com/dashboard/project/srirrwpgswlnuqfgtule
1. Ir a **SQL Editor**
2. Copiar TODO el contenido de `IALAB_PREMIUM_SCHEMA_ADAPTADO.sql`
3. Pegar en editor
4. Hacer clic en **"Run"**
5. Verificar que no hay errores (debería mostrar "✅ Schema IALab Premium SaaS actualizado exitosamente")

### 2. OBTENER JWKS URL DE CLERK
**URL:** https://dashboard.clerk.com
1. Tu app → **API Keys** → **Advanced**
2. Buscar **"JSON Web Key Set (JWKS) URL"**
3. Copiar URL (ejemplo: `https://your-app.clerk.accounts.dev/.well-known/jwks.json`)
4. **Guardar** para siguiente paso

### 3. CONFIGURAR SUPABASE JWT SETTINGS
**URL:** https://supabase.com/dashboard/project/srirrwpgswlnuqfgtule
1. Ir a **Authentication** → **Settings**
2. Ir a sección **JWT Settings**
3. Agregar nuevo JWT issuer:
   - **Issuer:** `clerk`
   - **JWKS URL:** [Pegar URL de paso 2]
   - **Algorithm:** `RS256`
   - **JWT Claim:** `iss`
4. Guardar cambios

### 4. VERIFICAR INTEGRACIÓN
**Script de verificación:**
```bash
cd edutechlife-frontend
node scripts/quick-test.js
```

### 5. PROBAR FLUJO COMPLETO
1. Iniciar aplicación: `npm run dev`
2. Login con Clerk
3. Verificar que JWT se genera correctamente
4. Probar acceso a tablas Supabase con RLS

## VERIFICACIÓN RÁPIDA DESPUÉS DE EJECUTAR SQL

En Supabase SQL Editor, ejecutar:
```sql
SELECT * FROM verify_ialab_schema();
```

**Resultado esperado:**
```
table_name       | row_count | has_rls | index_count
-----------------+-----------+---------+------------
profiles         | X         | true    | X
course_progress  | 0         | true    | 2
certificates     | 0         | true    | 2
quiz_attempts    | 0         | true    | 3
student_sessions | X         | true    | 2
```

## SOLUCIÓN DE PROBLEMAS COMUNES

### ❌ Error: "JWT invalid signature"
- Verificar que JWKS URL es correcta
- Asegurar que algoritmo es RS256
- Verificar que Template ID en código coincide con Clerk

### ❌ Error: "RLS policy violation"
- Ejecutar SQL completo (no parcial)
- Verificar que políticas RLS se crearon
- Revisar `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`

### ❌ Error: "Table doesn't exist"
- SQL no se ejecutó completamente
- Ejecutar SQL adaptado de nuevo
- Verificar en Table Editor que existen las 5 tablas

## CONTACTOS RÁPIDOS
- **Supabase Project:** srirrwpgswlnuqfgtule
- **Clerk Template ID:** jtmp_3CIqFjJN9WJsV1qPT5VTW09gA7e
- **Service Role Key:** Ya configurado en .env.local
- **Archivo SQL:** `IALAB_PREMIUM_SCHEMA_ADAPTADO.sql`

**¡EJECUTA EL SQL AHORA Y AVÍSAME CUANDO TERMINES!**