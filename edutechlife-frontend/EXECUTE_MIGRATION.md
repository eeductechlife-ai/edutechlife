# 🚀 EJECUTAR MIGRACIÓN SQL PARA SUPABASE

## 📋 INSTRUCCIONES PARA EJECUTAR LA MIGRACIÓN

### **PASO 1: Acceder a la consola SQL de Supabase**

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto: `srirrwpgswlnuqfgtule`
3. En el menú lateral, haz clic en **"SQL Editor"**
4. Haz clic en **"New query"** para crear una nueva consulta

### **PASO 2: Copiar y pegar el script de migración**

Copia TODO el contenido del archivo `supabase_add_profile_fields.sql` y pégalo en el editor SQL:

```sql
-- ============================================
-- MIGRACIÓN: Agregar campos full_name y phone a tabla profiles
-- Para compatibilidad con UserProfileSmartCard
-- ============================================

-- 1. Verificar y agregar columna full_name si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name TEXT;
    RAISE NOTICE '✅ Columna full_name agregada a tabla profiles';
    
    -- Copiar datos de display_name a full_name si existe
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'display_name'
    ) THEN
      UPDATE profiles SET full_name = display_name WHERE full_name IS NULL;
      RAISE NOTICE '✅ Datos copiados de display_name a full_name';
    END IF;
  ELSE
    RAISE NOTICE '📊 Columna full_name ya existe en tabla profiles';
  END IF;
END $$;

-- 2. Verificar y agregar columna phone si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone TEXT;
    RAISE NOTICE '✅ Columna phone agregada a tabla profiles';
  ELSE
    RAISE NOTICE '📊 Columna phone ya existe en tabla profiles';
  END IF;
END $$;

-- 3. Verificar y agregar columna phone_number (alias) si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone_number TEXT;
    RAISE NOTICE '✅ Columna phone_number agregada a tabla profiles';
    
    -- Copiar datos de phone a phone_number si existe
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'phone'
    ) THEN
      UPDATE profiles SET phone_number = phone WHERE phone_number IS NULL;
      RAISE NOTICE '✅ Datos copiados de phone a phone_number';
    END IF;
  ELSE
    RAISE NOTICE '📊 Columna phone_number ya existe en tabla profiles';
  END IF;
END $$;

-- 4. Actualizar trigger para incluir nuevos campos
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Verificar estructura final
SELECT '🎯 ESTRUCTURA ACTUALIZADA DE PROFILES' AS status;
SELECT 
  column_name, 
  data_type,
  is_nullable,
  CASE 
    WHEN column_name IN ('full_name', 'phone', 'phone_number') THEN '🌟 NUEVO'
    ELSE '📋 EXISTENTE'
  END as estado
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY 
  CASE 
    WHEN column_name IN ('full_name', 'phone', 'phone_number') THEN 0
    ELSE 1
  END,
  ordinal_position;

-- 6. Mostrar datos de ejemplo
SELECT '📊 DATOS DE EJEMPLO (primeros 3 registros)' AS sample_title;
SELECT 
  id,
  full_name,
  phone,
  phone_number,
  role,
  created_at::date as creado
FROM profiles 
ORDER BY created_at DESC 
LIMIT 3;

-- 7. Contar perfiles con datos completos
SELECT '📈 ESTADÍSTICAS DE DATOS' AS stats_title;
SELECT 
  COUNT(*) as total_profiles,
  COUNT(full_name) as con_nombre,
  COUNT(phone) as con_telefono,
  ROUND(COUNT(full_name) * 100.0 / NULLIF(COUNT(*), 0), 1) as porcentaje_nombre,
  ROUND(COUNT(phone) * 100.0 / NULLIF(COUNT(*), 0), 1) as porcentaje_telefono
FROM profiles;

-- 8. Instrucciones para desarrollo
SELECT '🚀 INSTRUCCIONES PARA DESARROLLO' AS dev_instructions;
SELECT '1. Ejecuta este script en la consola SQL de Supabase' AS step;
SELECT '2. Verifica que las columnas se hayan creado correctamente' AS step;
SELECT '3. Prueba la interfaz de edición inline en UserProfileSmartCard' AS step;
SELECT '4. Monitorea la consola del navegador para errores' AS step;
SELECT '5. Para testing, puedes actualizar manualmente:' AS step;
SELECT '   UPDATE profiles SET full_name = ''Nombre Test'', phone = ''3001234567'' WHERE id = ''user-id'';' AS example;

-- 9. Script de rollback (por si acaso)
SELECT '🔄 SCRIPT DE ROLLBACK (opcional)' AS rollback_title;
SELECT '-- Para revertir cambios:' AS rollback_step;
SELECT '-- ALTER TABLE profiles DROP COLUMN IF EXISTS full_name;' AS rollback_sql;
SELECT '-- ALTER TABLE profiles DROP COLUMN IF EXISTS phone;' AS rollback_sql;
SELECT '-- ALTER TABLE profiles DROP COLUMN IF EXISTS phone_number;' AS rollback_sql;
```

### **PASO 3: Ejecutar el script**

1. Haz clic en el botón **"Run"** (o presiona `Cmd/Ctrl + Enter`)
2. Espera a que se complete la ejecución (debería tomar menos de 5 segundos)
3. Revisa los resultados en la pestaña **"Results"**

### **PASO 4: Verificar que la migración fue exitosa**

Deberías ver en los resultados:

1. **Mensajes de éxito** para cada columna creada
2. **Estructura actualizada** de la tabla `profiles`
3. **Datos de ejemplo** de los primeros 3 perfiles
4. **Estadísticas** de datos completos

### **PASO 5: Probar la funcionalidad**

1. **Reinicia** la aplicación de desarrollo (`npm run dev`)
2. **Inicia sesión** con Clerk
3. **Haz clic en tu avatar** (esquina superior derecha)
4. **Selecciona "Mi Perfil"**
5. **Verifica que:**
   - El perfil se carga sin errores
   - Puedes ver tu nombre y teléfono (si existen)
   - Puedes editar los campos haciendo clic en el ícono de lápiz
   - Las validaciones funcionan correctamente

## 🔧 SOLUCIÓN DE PROBLEMAS

### **Si ves errores al ejecutar el script:**

1. **Error de permisos**: Asegúrate de estar usando una cuenta con permisos de administrador
2. **Error de sintaxis**: Copia exactamente el script sin modificaciones
3. **Error de conexión**: Verifica que estés en el proyecto correcto de Supabase

### **Si el perfil sigue sin cargar:**

1. **Verifica la consola del navegador** (F12 > Console)
2. **Busca errores** relacionados con `full_name` o `phone`
3. **Prueba manualmente** en la consola SQL:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'profiles' 
   AND column_name IN ('full_name', 'phone', 'display_name');
   ```

### **Si necesitas ayuda adicional:**

1. **Consulta el archivo** `USER_PROFILE_IMPLEMENTATION.md`
2. **Revisa los logs** en la consola de Supabase
3. **Prueba el script de test**: `testProfileIntegration.js`

## 📞 SOPORTE

Si encuentras problemas después de ejecutar la migración:

1. **Revisa** que las credenciales de Supabase en `.env` sean correctas
2. **Verifica** que Clerk esté configurado correctamente
3. **Contacta** al equipo de desarrollo si el problema persiste

---

**🎯 ¡La migración es esencial para que UserProfileSmartCard funcione correctamente!**