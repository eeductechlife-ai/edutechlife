-- ============================================
-- TRIGGER AUTOMÁTICO: Crear perfil cuando se registra usuario
-- Para resolver problema de datos no guardados en Supabase
-- ============================================

-- 1. Verificar si existe la función handle_new_user
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
        updated_at = NOW();
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
    RAISE NOTICE '✅ Función handle_new_user creada';
  ELSE
    RAISE NOTICE '📊 Función handle_new_user ya existe';
  END IF;
END $$;

-- 2. Verificar si existe el trigger
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

-- 3. Verificar permisos para la función
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- 4. Crear tabla form_submissions si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'form_submissions'
  ) THEN
    CREATE TABLE public.form_submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
      form_type TEXT NOT NULL CHECK (form_type IN ('initial', 'contact', 'enrollment', 'ialab')),
      data JSONB NOT NULL DEFAULT '{}',
      submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Índices para mejor performance
    CREATE INDEX idx_form_submissions_user_id ON public.form_submissions(user_id);
    CREATE INDEX idx_form_submissions_form_type ON public.form_submissions(form_type);
    CREATE INDEX idx_form_submissions_submitted_at ON public.form_submissions(submitted_at DESC);
    
    -- Habilitar RLS (Row Level Security)
    ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
    
    -- Políticas de seguridad
    CREATE POLICY "Users can view their own form submissions" 
      ON public.form_submissions FOR SELECT 
      USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert their own form submissions" 
      ON public.form_submissions FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can update their own form submissions" 
      ON public.form_submissions FOR UPDATE 
      USING (auth.uid() = user_id);
    
    RAISE NOTICE '✅ Tabla form_submissions creada con RLS';
  ELSE
    RAISE NOTICE '📊 Tabla form_submissions ya existe';
  END IF;
END $$;

-- 5. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Aplicar trigger updated_at a form_submissions si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_form_submissions_updated_at'
  ) THEN
    CREATE TRIGGER update_form_submissions_updated_at
      BEFORE UPDATE ON public.form_submissions
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
    
    RAISE NOTICE '✅ Trigger update_form_submissions_updated_at creado';
  ELSE
    RAISE NOTICE '📊 Trigger update_form_submissions_updated_at ya existe';
  END IF;
END $$;

-- 7. Verificar estructura actual
SELECT '🎯 VERIFICACIÓN DE ESTRUCTURA' AS verification_title;

-- Verificar función handle_new_user
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

-- Verificar trigger on_auth_user_created
SELECT 
  'on_auth_user_created trigger' AS item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = 'on_auth_user_created'
    ) THEN '✅ PRESENTE'
    ELSE '❌ AUSENTE'
  END AS status;

-- Verificar tabla form_submissions
SELECT 
  'form_submissions table' AS item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'form_submissions'
    ) THEN '✅ PRESENTE'
    ELSE '❌ AUSENTE'
  END AS status;

-- 8. Instrucciones para ejecutar
SELECT '🚀 INSTRUCCIONES' AS instructions_title;
SELECT '1. Ejecuta este script completo en la consola SQL de Supabase' AS step;
SELECT '2. Verifica que no haya errores' AS step;
SELECT '3. Prueba registrando un nuevo usuario' AS step;
SELECT '4. Verifica que se cree automáticamente en la tabla profiles' AS step;
SELECT '5. Los formularios ahora se guardarán en form_submissions' AS step;

-- 9. Script de prueba
SELECT '🧪 SCRIPT DE PRUEBA (opcional)' AS test_title;
SELECT '-- Para probar manualmente la función:' AS test_step;
SELECT 'SELECT handle_new_user();' AS test_sql;

-- 10. Script de rollback (por si acaso)
SELECT '🔄 SCRIPT DE ROLLBACK (opcional)' AS rollback_title;
SELECT '-- Para revertir cambios:' AS rollback_step;
SELECT 'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;' AS rollback_sql;
SELECT 'DROP FUNCTION IF EXISTS public.handle_new_user;' AS rollback_sql;
SELECT 'DROP TABLE IF EXISTS public.form_submissions CASCADE;' AS rollback_sql;