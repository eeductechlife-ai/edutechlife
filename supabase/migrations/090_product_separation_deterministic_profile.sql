-- ============================================================================
-- 090_product_separation_deterministic_profile.sql
--
-- Objetivo: que una cuenta nazca SIEMPRE con su fila de perfil y con su
-- producto etiquetado correctamente (IALab vs SmartBoard), sin depender de que
-- el backend pueda INSERTAR en public.users.
--
-- Contexto verificado en producción (2026-09-21):
--   * public.users tiene RLS habilitado y su única política que cubre INSERT
--     ("Service role can manage users", FOR ALL TO public) exige
--     current_setting('role') = 'postgres', que NO es el rol de las peticiones
--     PostgREST. Es decir: hoy nadie puede insertar perfiles por la API.
--   * El trigger on_auth_user_created → public.handle_new_user() (SECURITY
--     DEFINER) escribe en public.profiles, pero NO en public.users.
--   * Síntoma: POST /api/auth/signup con accountType='smartboard' responde
--     400 "Profile creation failed: new row violates row-level security
--     policy for table \"users\"" (IALab funciona por una casualidad del
--     entorno; cualquier cambio de clave lo rompe).
--   * Metadatos mezclados: las cuentas SmartBoard quedan con
--     platform='ialab' y registration_source='ialab_signup'.
--
-- Estrategia (aditiva e idempotente, no borra ni mueve datos):
--   1. handle_new_user() crea/actualiza también la fila en public.users,
--      tomando el producto de raw_user_meta_data (account_type/platform),
--      con username único garantizado.
--   2. Políticas de red para service_role (el backend sigue pudiendo
--      insertar/actualizar perfiles aunque el trigger no existiera).
--   3. Backfill de platform/registration_source/account_type de lo ya creado.
--   4. Vista de reporte v_users_by_product.
--
-- La separación de ACCESO (guards por producto en API/rutas) va en la
-- migración posterior; esta solo hace determinista la identidad y los datos.
-- ============================================================================

BEGIN;

-- ── 1. handle_new_user: perfil universal + fila de producto ─────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email    text := lower(coalesce(NEW.email, ''));
  v_meta     jsonb := coalesce(NEW.raw_user_meta_data, '{}'::jsonb);
  v_product  text := CASE
                       WHEN lower(coalesce(v_meta->>'account_type', '')) = 'smartboard'
                         THEN 'smartboard'
                       ELSE 'ialab'
                     END;
  v_base     text;
  v_username text;
BEGIN
  -- 1a. Perfil universal (comportamiento de la migración 088, intacto).
  INSERT INTO public.profiles (
    id, email, full_name, role, phone, avatar_url, created_at, updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(v_meta->>'full_name', v_meta->>'name', split_part(v_email, '@', 1)),
    COALESCE(v_meta->>'role', 'student'),
    COALESCE(v_meta->>'phone', ''),
    v_meta->>'avatar_url',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email      = EXCLUDED.email,
    full_name  = EXCLUDED.full_name,
    role       = EXCLUDED.role,
    phone      = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();

  -- 1b. Fila de producto en public.users (idempotente).
  --     Los usernames son únicos: si el deseado está tomado se sufija con
  --     dígitos, igual que hace el backend, para no romper el alta.
  v_base := nullif(
              regexp_replace(
                lower(coalesce(v_meta->>'username', split_part(v_email, '@', 1))),
                '[^a-z0-9._-]', '', 'g'
              ),
              ''
            );
  v_base := coalesce(v_base, 'user');
  v_username := left(v_base, 40);

  IF EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.username = v_username AND u.id <> NEW.id
  ) THEN
    v_username := left(v_base, 34) || floor(random() * 9000 + 1000)::int::text;
  END IF;

  INSERT INTO public.users (
    id, clerk_id, email, username, first_name, last_name,
    user_type, account_type, platform, registration_source
  )
  VALUES (
    NEW.id,
    NEW.id,
    v_email,
    v_username,
    nullif(v_meta->>'first_name', ''),
    nullif(v_meta->>'last_name', ''),
    'student',
    v_product,
    v_product,
    CASE WHEN v_product = 'smartboard'
         THEN 'smartboard_signup'
         ELSE 'ialab_signup'
    END
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- ── 2. Redes de seguridad para el backend (service_role) ────────────────────
DROP POLICY IF EXISTS "users_insert_service_role" ON public.users;
CREATE POLICY "users_insert_service_role"
  ON public.users FOR INSERT TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "users_update_service_role" ON public.users;
CREATE POLICY "users_update_service_role"
  ON public.users FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

-- ── 3. Backfill de producto (no destructivo) ────────────────────────────────
-- 3a. SmartBoard = cuentas con perfil de estudiante (por auth_id).
UPDATE public.users u
SET account_type = 'smartboard'
WHERE u.account_type IS NULL
  AND EXISTS (SELECT 1 FROM public.students s WHERE s.auth_id = u.id);

-- 3b. El resto son IALab (comportamiento histórico).
UPDATE public.users
SET account_type = 'ialab'
WHERE account_type IS NULL;

-- 3c. Metadatos coherentes con el producto.
UPDATE public.users
SET platform = 'smartboard',
    registration_source = CASE
      WHEN registration_source IS NULL OR registration_source = 'ialab_signup'
        THEN 'smartboard_signup'
      ELSE registration_source
    END
WHERE account_type = 'smartboard'
  AND (platform IS DISTINCT FROM 'smartboard'
       OR registration_source = 'ialab_signup');

UPDATE public.users
SET platform = 'ialab'
WHERE platform IS NULL;

-- ── 4. Vista de reporte por producto ────────────────────────────────────────
CREATE OR REPLACE VIEW public.v_users_by_product AS
SELECT
  coalesce(account_type, 'sin_definir')                    AS product,
  coalesce(platform, 'sin_definir')                        AS platform,
  coalesce(registration_source, 'sin_definir')             AS registration_source,
  count(*)                                                 AS total,
  count(*) FILTER (WHERE created_at > now() - interval '30 days') AS ultimos_30_dias
FROM public.users
GROUP BY 1, 2, 3;

COMMIT;
