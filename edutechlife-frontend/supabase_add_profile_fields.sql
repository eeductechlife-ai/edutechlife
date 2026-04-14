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