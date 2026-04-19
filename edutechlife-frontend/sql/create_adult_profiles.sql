-- ============================================
-- CREAR TABLA ADULT_PROFILES
-- Para adultos de IALAB (18+ años)
-- ============================================

-- Verificar si la tabla adult_profiles existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'adult_profiles'
  ) THEN
    -- Crear tabla adult_profiles
    CREATE TABLE adult_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      profession TEXT,
      company TEXT,
      job_title TEXT,
      years_experience INTEGER CHECK (years_experience >= 0),
      education_level TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      -- Índices para mejor performance
      UNIQUE(profile_id)
    );
    
    RAISE NOTICE '✅ Tabla adult_profiles creada';
  ELSE
    RAISE NOTICE '📊 Tabla adult_profiles ya existe';
  END IF;
END $$;

-- Habilitar RLS
ALTER TABLE adult_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para adult_profiles
DO $$
BEGIN
  -- Política de selección: usuarios pueden ver solo su propio perfil de adulto
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'adult_profiles_select_policy' 
    AND tablename = 'adult_profiles'
  ) THEN
    CREATE POLICY "adult_profiles_select_policy" ON adult_profiles
    FOR SELECT USING (
      auth.uid() IN (
        SELECT id FROM profiles WHERE id = adult_profiles.profile_id
      )
    );
    RAISE NOTICE '✅ Política SELECT para adult_profiles creada';
  END IF;
  
  -- Política de inserción: usuarios solo pueden crear su propio perfil de adulto
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'adult_profiles_insert_policy' 
    AND tablename = 'adult_profiles'
  ) THEN
    CREATE POLICY "adult_profiles_insert_policy" ON adult_profiles
    FOR INSERT WITH CHECK (
      auth.uid() IN (
        SELECT id FROM profiles WHERE id = adult_profiles.profile_id
      )
    );
    RAISE NOTICE '✅ Política INSERT para adult_profiles creada';
  END IF;
  
  -- Política de actualización: usuarios solo pueden actualizar su propio perfil de adulto
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'adult_profiles_update_policy' 
    AND tablename = 'adult_profiles'
  ) THEN
    CREATE POLICY "adult_profiles_update_policy" ON adult_profiles
    FOR UPDATE USING (
      auth.uid() IN (
        SELECT id FROM profiles WHERE id = adult_profiles.profile_id
      )
    );
    RAISE NOTICE '✅ Política UPDATE para adult_profiles creada';
  END IF;
  
  -- Política de eliminación: usuarios solo pueden eliminar su propio perfil de adulto
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'adult_profiles_delete_policy' 
    AND tablename = 'adult_profiles'
  ) THEN
    CREATE POLICY "adult_profiles_delete_policy" ON adult_profiles
    FOR DELETE USING (
      auth.uid() IN (
        SELECT id FROM profiles WHERE id = adult_profiles.profile_id
      )
    );
    RAISE NOTICE '✅ Política DELETE para adult_profiles creada';
  END IF;
END $$;