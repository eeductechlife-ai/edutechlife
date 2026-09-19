-- ============================================================================
-- 088_fix_handle_new_user_profile_insert.sql
--
-- Arregla el registro de usuarios nuevos.
-- Síntoma: POST /api/auth/signup responde 400
--          {"error":"Auth signup failed: Database error creating new user"}
--
-- Causa raíz (verificada contra el esquema real de producción):
--   El trigger `on_auth_user_created` (AFTER INSERT ON auth.users) ejecuta
--   `public.handle_new_user()`, cuya versión "update_auto_profile_trigger"
--   intenta insertar en objetos que NO existen en producción:
--     - public.student_profiles   (tabla inexistente)
--     - public.adult_profiles     (tabla inexistente)
--     - public.profiles.user_type (columna inexistente)
--   Al fallar el INSERT del trigger, Supabase aborta la creación del usuario
--   en auth.users y devuelve el mensaje genérico "Database error creating
--   new user". La tabla `profiles` sí existe y solo exige `id`.
--
-- Fix: redefinir `handle_new_user()` para escribir únicamente en `profiles`
--   con columnas existentes, como SECURITY DEFINER y con `search_path` fijo
--   (patrón correcto para triggers sobre auth.users). Idempotente y sin
--   cambios de comportamiento funcional para el resto de la app.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name, role, phone, avatar_url, created_at, updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Recrea el trigger apuntando a la función corregida (idempotente).
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
