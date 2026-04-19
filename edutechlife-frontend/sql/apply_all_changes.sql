-- ============================================
-- SCRIPT COMPLETO PARA APLICAR CAMBIOS EN BASE DE DATOS
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Agregar campo user_type a profiles
\i sql/add_user_type_to_profiles.sql

-- 2. Crear tabla student_profiles
\i sql/create_student_profiles.sql

-- 3. Crear tabla adult_profiles
\i sql/create_adult_profiles.sql

-- 4. Actualizar trigger automático
\i sql/update_auto_profile_trigger.sql

-- Verificar cambios
SELECT 
  'profiles' as table_name,
  COUNT(*) as row_count,
  STRING_AGG(DISTINCT user_type, ', ') as user_types
FROM profiles
UNION ALL
SELECT 
  'student_profiles' as table_name,
  COUNT(*) as row_count,
  '' as user_types
FROM student_profiles
UNION ALL
SELECT 
  'adult_profiles' as table_name,
  COUNT(*) as row_count,
  '' as user_types
FROM adult_profiles
ORDER BY table_name;