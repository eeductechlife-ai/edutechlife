-- ============================================================================
-- Prueba de la migración 115 (endurecer funciones SECURITY DEFINER).
-- Uso (base desechable, nunca producción), desde la raíz del repo:
--   createdb fn_test && psql -v ON_ERROR_STOP=1 -d fn_test -f supabase/tests/endurecer_funciones.test.sql
-- ============================================================================
\set ON_ERROR_STOP 1
\set QUIET 1

DO $$ BEGIN
  CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')::uuid $$;
GRANT USAGE ON SCHEMA auth, public TO anon, authenticated, service_role;
CREATE SCHEMA ialab;
GRANT USAGE ON SCHEMA ialab TO anon, authenticated, service_role;

-- Estado de producción: tablas
CREATE TABLE ialab.user_progress (
  id bigserial PRIMARY KEY, user_id text NOT NULL, module_id int, activity_type text, is_completed boolean
);
CREATE TABLE public.users (id uuid PRIMARY KEY, institution_id uuid);
CREATE TABLE public.peer_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id text NOT NULL DEFAULT 'ialab-ia-generativa',
  module_id int NOT NULL,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  due_at timestamptz, created_at timestamptz DEFAULT now(),
  CHECK (reviewer_id <> reviewee_id),
  UNIQUE (module_id, reviewer_id, reviewee_id)
);

-- Estado de producción: funciones tal como están hoy (sin search_path, con EXECUTE a PUBLIC)
CREATE FUNCTION public.get_user_rank(p_user_id text) RETURNS TABLE(rank bigint) LANGUAGE plpgsql AS $$ BEGIN RETURN QUERY SELECT 1::bigint; END $$;
CREATE FUNCTION public.get_top_leaderboard(p_limit integer DEFAULT 10) RETURNS TABLE(rank bigint) LANGUAGE plpgsql AS $$ BEGIN RETURN QUERY SELECT 1::bigint; END $$;
CREATE FUNCTION public.update_profiles_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NEW; END $$;
CREATE FUNCTION public.update_smartboard_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NEW; END $$;
CREATE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NEW; END $$;
CREATE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NEW; END $$;
CREATE FUNCTION public.set_cert_number() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NEW; END $$;
CREATE FUNCTION public.get_my_institution_id() RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
  AS $$ SELECT institution_id FROM public.users WHERE id = auth.uid(); $$;

CREATE FUNCTION public.assign_peer_reviews(p_course_id text, p_module_id integer, p_due_at timestamptz DEFAULT NULL)
 RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'ialab', 'smartboard', 'public' AS $function$
DECLARE inserted INT := 0; rec RECORD; candidates UUID[];
BEGIN
  SELECT array_agg(DISTINCT user_id::uuid) INTO candidates FROM user_progress
   WHERE module_id = p_module_id AND activity_type = 'module' AND is_completed = true
     AND user_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
  IF candidates IS NULL OR array_length(candidates, 1) < 2 THEN RETURN 0; END IF;
  FOR rec IN SELECT unnest(candidates) AS uid LOOP
    DECLARE target UUID;
    BEGIN
      SELECT uid2 INTO target FROM unnest(candidates) AS uid2 WHERE uid2 <> rec.uid ORDER BY random() LIMIT 1;
      IF target IS NOT NULL THEN
        INSERT INTO peer_assignments (course_id, module_id, reviewer_id, reviewee_id, due_at)
        VALUES (p_course_id, p_module_id, rec.uid, target, p_due_at)
        ON CONFLICT (module_id, reviewer_id, reviewee_id) DO NOTHING;
        inserted := inserted + 1;
      END IF;
    END;
  END LOOP;
  RETURN inserted;
END; $function$;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON ialab.user_progress TO authenticated;

-- Datos: U1, U2, U3 completaron el módulo 1; U4 no.
INSERT INTO auth.users VALUES
  ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-333333333333'), ('44444444-4444-4444-4444-444444444444');
INSERT INTO ialab.user_progress (user_id, module_id, activity_type, is_completed) VALUES
  ('11111111-1111-1111-1111-111111111111', 1, 'module', true),
  ('22222222-2222-2222-2222-222222222222', 1, 'module', true),
  ('33333333-3333-3333-3333-333333333333', 1, 'module', true),
  ('44444444-4444-4444-4444-444444444444', 1, 'lesson', false);

CREATE SCHEMA prueba;
GRANT USAGE ON SCHEMA prueba TO anon, authenticated, service_role;
CREATE FUNCTION prueba.igual(real_ anyelement, esperado anyelement, que text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF real_ IS DISTINCT FROM esperado THEN RAISE EXCEPTION 'FALLO [%]: se obtuvo %, se esperaba %', que, real_, esperado; END IF;
  RAISE NOTICE 'ok  %', que;
END $$;
CREATE FUNCTION prueba.denegado(q text, que text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  BEGIN EXECUTE q; EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'ok  % (denegado)', que; RETURN; END;
  RAISE EXCEPTION 'FALLO [%]: debió ser denegado', que;
END $$;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA prueba TO anon, authenticated, service_role;

\set QUIET 0
\echo '== ANTES: el problema existe =='
SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"44444444-4444-4444-4444-444444444444"}', false);
SELECT prueba.igual(public.assign_peer_reviews('c', 1), 3, 'U4, que NO completó el módulo, crea 3 asignaciones');
RESET ROLE;
SELECT prueba.igual((SELECT count(*)::int FROM public.peer_assignments), 3, 'quedaron 3 filas');
SET ROLE anon;
SELECT prueba.igual(public.assign_peer_reviews('c', 1), 3, 'anon también podía llamarla (llamada repetida: 3)');
RESET ROLE;
SELECT prueba.igual((SELECT count(*)::int FROM pg_proc WHERE proname = 'get_user_rank' AND proconfig IS NULL), 1, 'get_user_rank sin search_path');
DELETE FROM public.peer_assignments;

\echo '== Aplicar 115 (dos veces: debe ser idempotente) =='
\set QUIET 1
\i supabase/migrations/115_endurecer_funciones.sql
\i supabase/migrations/115_endurecer_funciones.sql
\set QUIET 0

\echo '== DESPUÉS: search_path fijo =='
SELECT prueba.igual((SELECT count(*)::int FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public' AND p.proname IN ('get_user_rank','update_profiles_updated_at','get_top_leaderboard',
    'update_smartboard_updated_at','update_updated_at_column','set_updated_at','set_cert_number')
    AND coalesce(p.proconfig::text, '') LIKE '%search_path=public%'), 7, 'las 7 funciones tienen search_path=public');

\echo '== DESPUÉS: get_my_institution_id =='
SELECT prueba.igual(has_function_privilege('anon', 'public.get_my_institution_id()', 'EXECUTE'), false, 'anon ya no la ejecuta');
SELECT prueba.igual(has_function_privilege('authenticated', 'public.get_my_institution_id()', 'EXECUTE'), true, 'authenticated la conserva');
SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111"}', false);
SELECT prueba.igual(public.get_my_institution_id(), NULL::uuid, 'authenticated la usa sin error');
RESET ROLE;

\echo '== DESPUÉS: assign_peer_reviews =='
SELECT prueba.denegado($$SET ROLE anon; SELECT public.assign_peer_reviews('c', 1)$$, 'anon no puede ejecutarla');
RESET ROLE;
SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"44444444-4444-4444-4444-444444444444"}', false);
SELECT prueba.igual(public.assign_peer_reviews('c', 1), 0, 'U4 (no completó) no crea nada');
RESET ROLE;
SELECT prueba.igual((SELECT count(*)::int FROM public.peer_assignments), 0, 'sin filas tras la llamada de U4');
SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111"}', false);
SELECT prueba.igual(public.assign_peer_reviews('c', 1), 3, 'U1 (completó) crea 3 asignaciones');
SELECT prueba.igual(public.assign_peer_reviews('c', 1), 0, 'U1 otra vez: 0 nuevas (no se duplican)');
RESET ROLE;
SELECT prueba.igual((SELECT count(*)::int FROM public.peer_assignments), 3, 'siguen 3 filas');
SELECT prueba.igual((SELECT count(DISTINCT reviewer_id)::int FROM public.peer_assignments), 3, 'cada completador revisa a uno');
SELECT prueba.igual((SELECT count(*)::int FROM public.peer_assignments WHERE reviewer_id = reviewee_id), 0, 'nadie se revisa a sí mismo');

\echo '== DESPUÉS: el servidor (sin sesión de usuario) sigue pudiendo =='
INSERT INTO ialab.user_progress (user_id, module_id, activity_type, is_completed) VALUES
  ('11111111-1111-1111-1111-111111111111', 2, 'module', true),
  ('22222222-2222-2222-2222-222222222222', 2, 'module', true);
SET ROLE service_role;
SELECT prueba.igual(public.assign_peer_reviews('c', 2), 2, 'service_role asigna en el módulo 2');
RESET ROLE;

\echo '== TODAS LAS COMPROBACIONES PASARON =='
