-- ============================================
-- CREAR TABLA STUDENT_PROFILES
-- Para estudiantes de SmartBoard (8-16 años)
-- ============================================

-- Verificar si la tabla student_profiles existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'student_profiles'
  ) THEN
    -- Crear tabla student_profiles
    CREATE TABLE student_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      age INTEGER CHECK (age BETWEEN 8 AND 16),
      school TEXT,
      grade TEXT,
      tutor_name TEXT,
      tutor_email TEXT,
      tutor_phone TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      -- Índices para mejor performance
      UNIQUE(profile_id)
    );
    
    RAISE NOTICE '✅ Tabla student_profiles creada';
  ELSE
    RAISE NOTICE '📊 Tabla student_profiles ya existe';
  END IF;
END $$;

-- Habilitar RLS
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para student_profiles
DO $$
BEGIN
  -- Política de selección: usuarios pueden ver solo su propio perfil de estudiante
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'student_profiles_select_policy' 
    AND tablename = 'student_profiles'
  ) THEN
    CREATE POLICY "student_profiles_select_policy" ON student_profiles
    FOR SELECT USING (
      auth.uid() IN (
        SELECT id FROM profiles WHERE id = student_profiles.profile_id
      )
    );
    RAISE NOTICE '✅ Política SELECT para student_profiles creada';
  END IF;
  
  -- Política de inserción: usuarios solo pueden crear su propio perfil de estudiante
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'student_profiles_insert_policy' 
    AND tablename = 'student_profiles'
  ) THEN
    CREATE POLICY "student_profiles_insert_policy" ON student_profiles
    FOR INSERT WITH CHECK (
      auth.uid() IN (
        SELECT id FROM profiles WHERE id = student_profiles.profile_id
      )
    );
    RAISE NOTICE '✅ Política INSERT para student_profiles creada';
  END IF;
  
  -- Política de actualización: usuarios solo pueden actualizar su propio perfil de estudiante
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'student_profiles_update_policy' 
    AND tablename = 'student_profiles'
  ) THEN
    CREATE POLICY "student_profiles_update_policy" ON student_profiles
    FOR UPDATE USING (
      auth.uid() IN (
        SELECT id FROM profiles WHERE id = student_profiles.profile_id
      )
    );
    RAISE NOTICE '✅ Política UPDATE para student_profiles creada';
  END IF;
  
  -- Política de eliminación: usuarios solo pueden eliminar su propio perfil de estudiante
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'student_profiles_delete_policy' 
    AND tablename = 'student_profiles'
  ) THEN
    CREATE POLICY "student_profiles_delete_policy" ON student_profiles
    FOR DELETE USING (
      auth.uid() IN (
        SELECT id FROM profiles WHERE id = student_profiles.profile_id
      )
    );
    RAISE NOTICE '✅ Política DELETE para student_profiles creada';
  END IF;
END $$;