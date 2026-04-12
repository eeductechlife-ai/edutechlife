-- ============================================
-- CREAR/ACTUALIZAR TABLA PROFILES
-- Para compatibilidad con el foro de Edutechlife
-- ============================================

-- Verificar si la tabla profiles existe
DO $$
BEGIN
  -- Verificar si la tabla existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) THEN
    -- Crear tabla si no existe
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      display_name TEXT,
      avatar_url TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    RAISE NOTICE '✅ Tabla profiles creada';
  ELSE
    RAISE NOTICE '📊 Tabla profiles ya existe';
    
    -- Verificar y agregar columnas faltantes
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'display_name'
    ) THEN
      ALTER TABLE profiles ADD COLUMN display_name TEXT;
      RAISE NOTICE '✅ Columna display_name agregada';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'avatar_url'
    ) THEN
      ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
      RAISE NOTICE '✅ Columna avatar_url agregada';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'role'
    ) THEN
      ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
      RAISE NOTICE '✅ Columna role agregada';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'updated_at'
    ) THEN
      ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      RAISE NOTICE '✅ Columna updated_at agregada';
    END IF;
  END IF;
END $$;

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
DO $$
BEGIN
  -- Política de selección: usuarios pueden ver todos los perfiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'profiles_select_policy' 
    AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (auth.role() = 'authenticated');
    RAISE NOTICE '✅ Política SELECT creada';
  END IF;
  
  -- Política de inserción: usuarios solo pueden crear su propio perfil
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'profiles_insert_policy' 
    AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
    RAISE NOTICE '✅ Política INSERT creada';
  END IF;
  
  -- Política de actualización: usuarios solo pueden actualizar su propio perfil
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'profiles_update_policy' 
    AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (auth.uid() = id);
    RAISE NOTICE '✅ Política UPDATE creada';
  END IF;
END $$;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profiles_updated_at();
    RAISE NOTICE '✅ Trigger para updated_at creado';
  END IF;
END $$;

-- Verificar estructura final
SELECT '🎯 ESTRUCTURA FINAL DE PROFILES' AS status;
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Contar perfiles existentes
SELECT COUNT(*) AS total_profiles FROM profiles;

-- Instrucciones
SELECT '🚀 SIGUIENTES PASOS:' AS instructions;
SELECT '1. Si hay 0 perfiles, registra un usuario en la aplicación' AS step;
SELECT '2. Los perfiles se crearán automáticamente al registrarse' AS step;
SELECT '3. Para testing, puedes insertar manualmente:' AS step;
SELECT '   INSERT INTO profiles (id, display_name) VALUES (''user-id'', ''Nombre Usuario'');' AS substep;