-- ============================================
-- AGREGAR CAMPO user_type A TABLA PROFILES
-- ============================================

-- Verificar si la columna user_type existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'user_type'
  ) THEN
    -- Agregar columna user_type
    ALTER TABLE profiles ADD COLUMN user_type TEXT;
    
    -- Actualizar valores existentes basados en el rol
    UPDATE profiles 
    SET user_type = CASE 
      WHEN role = 'smartboard' THEN 'student'
      WHEN role = 'ialab' THEN 'adult'
      WHEN role = 'admin' THEN 'adult'
      ELSE 'adult'
    END;
    
    -- Hacer la columna NOT NULL después de actualizar
    ALTER TABLE profiles ALTER COLUMN user_type SET NOT NULL;
    
    RAISE NOTICE '✅ Columna user_type agregada a profiles';
  ELSE
    RAISE NOTICE '📊 Columna user_type ya existe en profiles';
  END IF;
END $$;