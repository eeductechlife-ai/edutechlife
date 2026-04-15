-- ============================================
-- FIX CRÍTICO: Corregir estructura de tabla profiles
-- Para resolver error "Database error saving new user"
-- ============================================

-- ============================================
-- PARTE 1: AGREGAR COLUMNAS FALTANTES
-- ============================================

-- 1.1. Agregar columna EMAIL (CRÍTICA - falta en trigger)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
    RAISE NOTICE '✅ Columna EMAIL agregada (CRÍTICA para trigger)';
  ELSE
    RAISE NOTICE '📊 Columna EMAIL ya existe';
  END IF;
END $$;

-- 1.2. Agregar columna FULL_NAME (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name TEXT;
    RAISE NOTICE '✅ Columna full_name agregada';
    
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
    RAISE NOTICE '📊 Columna full_name ya existe';
  END IF;
END $$;

-- 1.3. Agregar columna PHONE (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone TEXT;
    RAISE NOTICE '✅ Columna phone agregada';
  ELSE
    RAISE NOTICE '📊 Columna phone ya existe';
  END IF;
END $$;

-- 1.4. Agregar columnas opcionales para compatibilidad futura
DO $$
BEGIN
  -- plain_password (para contraseñas generadas)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'plain_password'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plain_password TEXT;
    RAISE NOTICE '✅ Columna plain_password agregada (opcional)';
  END IF;
  
  -- user_count (para tracking de usuarios)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'user_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN user_count INTEGER;
    RAISE NOTICE '✅ Columna user_count agregada (opcional)';
  END IF;
END $$;

-- ============================================
-- PARTE 2: ACTUALIZAR TRIGGER handle_new_user
-- Para que use la estructura CORRECTA de la tabla
-- ============================================

-- 2.1. Verificar si existe la función handle_new_user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user' 
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Crear función que se ejecuta cuando se crea un usuario en auth.users
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Insertar en la tabla profiles usando datos del usuario
      -- NOTA: Ahora usa columnas que SÍ EXISTEN en la tabla
      INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        phone,
        avatar_url,
        created_at,
        updated_at
      )
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
          NEW.raw_user_meta_data->>'full_name',
          NEW.raw_user_meta_data->>'name',
          SPLIT_PART(NEW.email, '@', 1)
        ),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        updated_at = NOW();
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
    RAISE NOTICE '✅ Función handle_new_user creada (estructura corregida)';
  ELSE
    -- Si ya existe, actualizarla para usar estructura correcta
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Insertar en la tabla profiles usando datos del usuario
      INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        phone,
        avatar_url,
        created_at,
        updated_at
      )
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
          NEW.raw_user_meta_data->>'full_name',
          NEW.raw_user_meta_data->>'name',
          SPLIT_PART(NEW.email, '@', 1)
        ),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        updated_at = NOW();
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
    RAISE NOTICE '✅ Función handle_new_user ACTUALIZADA (estructura corregida)';
  END IF;
END $$;

-- 2.2. Verificar si existe el trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    -- Crear trigger que se activa después de insertar en auth.users
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    
    RAISE NOTICE '✅ Trigger on_auth_user_created creado';
  ELSE
    RAISE NOTICE '📊 Trigger on_auth_user_created ya existe';
  END IF;
END $$;

-- ============================================
-- PARTE 3: VERIFICAR ESTRUCTURA ACTUAL
-- ============================================

-- 3.1. Mostrar estructura actual de la tabla
SELECT '🎯 ESTRUCTURA ACTUAL DE LA TABLA PROFILES' AS verification_title;

SELECT 
  column_name, 
  data_type,
  is_nullable,
  CASE 
    WHEN column_name IN ('email', 'full_name', 'phone') THEN '🌟 CRÍTICO'
    WHEN column_name IN ('plain_password', 'user_count') THEN '📋 OPCIONAL'
    ELSE '📋 EXISTENTE'
  END as estado,
  CASE 
    WHEN column_name = 'email' AND EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'email'
    ) THEN '✅ PRESENTE'
    WHEN column_name = 'email' THEN '❌ FALTANTE'
    WHEN column_name = 'full_name' AND EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'full_name'
    ) THEN '✅ PRESENTE'
    WHEN column_name = 'full_name' THEN '❌ FALTANTE'
    WHEN column_name = 'phone' AND EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'phone'
    ) THEN '✅ PRESENTE'
    WHEN column_name = 'phone' THEN '❌ FALTANTE'
    ELSE '✅'
  END as status
FROM (VALUES 
  ('id', 'UUID', 'NO', 'PRIMARY KEY'),
  ('email', 'TEXT', 'YES', 'CRÍTICO para trigger'),
  ('full_name', 'TEXT', 'YES', 'CRÍTICO para trigger'),
  ('display_name', 'TEXT', 'YES', 'Compatibilidad'),
  ('phone', 'TEXT', 'YES', 'CRÍTICO para trigger'),
  ('avatar_url', 'TEXT', 'YES', 'Opcional'),
  ('role', 'TEXT', 'YES', 'Default: student'),
  ('plain_password', 'TEXT', 'YES', 'Opcional'),
  ('user_count', 'INTEGER', 'YES', 'Opcional'),
  ('created_at', 'TIMESTAMP', 'YES', 'Automático'),
  ('updated_at', 'TIMESTAMP', 'YES', 'Automático')
) AS expected(col_name, col_type, col_nullable, col_desc)
ORDER BY 
  CASE 
    WHEN col_name IN ('email', 'full_name', 'phone') THEN 0
    WHEN col_name IN ('id', 'role', 'avatar_url') THEN 1
    ELSE 2
  END;

-- 3.2. Verificar función handle_new_user
SELECT '🔧 VERIFICACIÓN DE FUNCIÓN handle_new_user' AS function_check;

SELECT 
  'handle_new_user function' AS item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'handle_new_user' 
      AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN '✅ PRESENTE'
    ELSE '❌ AUSENTE'
  END AS status;

-- 3.3. Verificar trigger on_auth_user_created
SELECT 
  'on_auth_user_created trigger' AS item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = 'on_auth_user_created'
    ) THEN '✅ PRESENTE'
    ELSE '❌ AUSENTE'
  END AS status;

-- ============================================
-- PARTE 4: DATOS DE EJEMPLO Y ESTADÍSTICAS
-- ============================================

-- 4.1. Mostrar datos de ejemplo
SELECT '📊 DATOS DE EJEMPLO (primeros 5 registros)' AS sample_title;
SELECT 
  id,
  email,
  full_name,
  display_name,
  phone,
  role,
  created_at::date as creado
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- 4.2. Estadísticas de datos
SELECT '📈 ESTADÍSTICAS DE DATOS' AS stats_title;
SELECT 
  COUNT(*) as total_profiles,
  COUNT(email) as con_email,
  COUNT(full_name) as con_nombre_completo,
  COUNT(phone) as con_telefono,
  ROUND(COUNT(email) * 100.0 / NULLIF(COUNT(*), 0), 1) as porcentaje_email,
  ROUND(COUNT(full_name) * 100.0 / NULLIF(COUNT(*), 0), 1) as porcentaje_nombre,
  ROUND(COUNT(phone) * 100.0 / NULLIF(COUNT(*), 0), 1) as porcentaje_telefono
FROM profiles;

-- ============================================
-- PARTE 5: INSTRUCCIONES PARA EJECUTAR
-- ============================================

SELECT '🚀 INSTRUCCIONES PARA EJECUTAR' AS instructions_title;
SELECT '1. Ejecuta este script COMPLETO en la consola SQL de Supabase' AS step;
SELECT '2. Verifica que NO haya errores en la ejecución' AS step;
SELECT '3. Los mensajes deben mostrar "✅" para cada operación exitosa' AS step;
SELECT '4. La tabla "ESTRUCTURA ACTUAL" debe mostrar todas las columnas como "✅ PRESENTE"' AS step;
SELECT '5. Prueba registrando un nuevo usuario en la aplicación' AS step;
SELECT '6. Verifica que NO aparezca el error "Database error saving new user"' AS step;
SELECT '7. Confirma que se crea automáticamente un registro en la tabla profiles' AS step;

-- ============================================
-- PARTE 6: SCRIPT DE ROLLBACK (por si acaso)
-- ============================================

SELECT '🔄 SCRIPT DE ROLLBACK (opcional)' AS rollback_title;
SELECT '-- Para revertir cambios (solo si es necesario):' AS rollback_step;
SELECT 'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;' AS rollback_sql;
SELECT 'DROP FUNCTION IF EXISTS public.handle_new_user;' AS rollback_sql;
SELECT '-- NOTA: No revertimos las columnas agregadas para mantener compatibilidad' AS rollback_note;

-- ============================================
-- PARTE 7: DIAGNÓSTICO DEL ERROR ORIGINAL
-- ============================================

SELECT '🔍 DIAGNÓSTICO DEL ERROR ORIGINAL' AS diagnosis_title;
SELECT 'Error: "Database error saving new user"' AS error_message;
SELECT 'Causa: El trigger handle_new_user() intentaba insertar en columnas que NO EXISTÍAN en la tabla profiles' AS cause;
SELECT 'Columnas faltantes: email, full_name, phone' AS missing_columns;
SELECT 'Solución: Este script agrega las columnas faltantes y actualiza el trigger para usar estructura correcta' AS solution;
SELECT 'Estado después de ejecutar: El registro de usuarios debería funcionar sin errores' AS expected_result;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
SELECT '🎉 SCRIPT COMPLETADO - LISTO PARA EJECUTAR 🎉' AS final_status;