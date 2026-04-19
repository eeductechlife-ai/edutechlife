-- ============================================
-- ACTUALIZAR TRIGGER AUTOMÁTICO PARA MANEJAR TIPOS DE USUARIO
-- ============================================

-- 1. Actualizar función handle_new_user para incluir user_type
DO $$
BEGIN
  -- Eliminar función existente si existe
  DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
  
  -- Crear nueva función actualizada
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  DECLARE
    user_role TEXT;
    user_type TEXT;
    profile_record RECORD;
  BEGIN
    -- Determinar rol y tipo de usuario
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
    user_type := CASE 
      WHEN user_role = 'smartboard' THEN 'student'
      WHEN user_role = 'ialab' THEN 'adult'
      WHEN user_role = 'admin' THEN 'adult'
      ELSE 'adult'
    END;
    
    -- Insertar en la tabla profiles
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      role,
      user_type,
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
      user_role,
      user_type,
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      user_type = EXCLUDED.user_type,
      phone = EXCLUDED.phone,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = NOW()
    RETURNING * INTO profile_record;
    
    -- Insertar en tabla específica según tipo de usuario
    IF user_type = 'student' THEN
      -- Insertar en student_profiles
      INSERT INTO public.student_profiles (
        profile_id,
        age,
        school,
        grade,
        tutor_name,
        tutor_email,
        tutor_phone,
        created_at,
        updated_at
      )
      VALUES (
        profile_record.id,
        NULLIF(NEW.raw_user_meta_data->>'age', '')::INTEGER,
        COALESCE(NEW.raw_user_meta_data->>'school', ''),
        COALESCE(NEW.raw_user_meta_data->>'grade', ''),
        COALESCE(NEW.raw_user_meta_data->>'tutor_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'tutor_email', ''),
        COALESCE(NEW.raw_user_meta_data->>'tutor_phone', ''),
        NOW(),
        NOW()
      )
      ON CONFLICT (profile_id) DO UPDATE SET
        age = EXCLUDED.age,
        school = EXCLUDED.school,
        grade = EXCLUDED.grade,
        tutor_name = EXCLUDED.tutor_name,
        tutor_email = EXCLUDED.tutor_email,
        tutor_phone = EXCLUDED.tutor_phone,
        updated_at = NOW();
        
    ELSIF user_type = 'adult' THEN
      -- Insertar en adult_profiles
      INSERT INTO public.adult_profiles (
        profile_id,
        profession,
        company,
        job_title,
        years_experience,
        education_level,
        created_at,
        updated_at
      )
      VALUES (
        profile_record.id,
        COALESCE(NEW.raw_user_meta_data->>'profession', ''),
        COALESCE(NEW.raw_user_meta_data->>'company', ''),
        COALESCE(NEW.raw_user_meta_data->>'job_title', ''),
        NULLIF(NEW.raw_user_meta_data->>'years_experience', '')::INTEGER,
        COALESCE(NEW.raw_user_meta_data->>'education_level', ''),
        NOW(),
        NOW()
      )
      ON CONFLICT (profile_id) DO UPDATE SET
        profession = EXCLUDED.profession,
        company = EXCLUDED.company,
        job_title = EXCLUDED.job_title,
        years_experience = EXCLUDED.years_experience,
        education_level = EXCLUDED.education_level,
        updated_at = NOW();
    END IF;
    
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  RAISE NOTICE '✅ Función handle_new_user actualizada para manejar tipos de usuario';
END $$;

-- 2. Verificar y recrear el trigger si es necesario
DO $$
BEGIN
  -- Eliminar trigger existente si existe
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  
  -- Crear nuevo trigger
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    
  RAISE NOTICE '✅ Trigger on_auth_user_created recreado';
END $$;