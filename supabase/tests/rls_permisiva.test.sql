-- ============================================================================
-- Prueba de las migraciones 113 y 114 (re-auditoría S2: RLS permisiva).
--
-- Reproduce en un Postgres vacío el estado verificado en producción el
-- 2026-10-20 (políticas USING (true) y privilegios completos para anon),
-- comprueba la exposición, aplica 113 y 114 (114 dos veces: debe poder
-- repetirse) y verifica qué puede hacer cada rol después.
--
-- Uso (desde la raíz del repo, contra una base desechable, nunca producción):
--   createdb rls_test && psql -v ON_ERROR_STOP=1 -d rls_test -f supabase/tests/rls_permisiva.test.sql
-- Si termina sin ERROR, todas las comprobaciones pasaron.
-- ============================================================================

\set ON_ERROR_STOP 1
\set QUIET 1

-- ── Entorno mínimo de Supabase ──────────────────────────────────────────────
DO $$ BEGIN
  CREATE ROLE anon NOLOGIN;
  CREATE ROLE authenticated NOLOGIN;
  CREATE ROLE service_role NOLOGIN BYPASSRLS;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')::uuid
$$;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

CREATE SCHEMA smartboard;
CREATE TABLE smartboard.parents (id uuid PRIMARY KEY, auth_id uuid);
GRANT USAGE ON SCHEMA smartboard TO anon, authenticated, service_role;
GRANT SELECT ON smartboard.parents TO anon, authenticated, service_role;

CREATE TABLE public.parent_student_links (
  parent_user_id text, student_user_id text, is_active boolean DEFAULT true
);
GRANT SELECT ON public.parent_student_links TO anon, authenticated, service_role;

-- ── Tablas con el estado abierto de producción ──────────────────────────────
CREATE TABLE public.profiles (
  id text PRIMARY KEY, full_name text, email text, phone text, role text,
  avatar_url text, security_violations int DEFAULT 0, updated_at timestamptz
);
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id text NOT NULL,
  module_id int, activity_type text, title text
);
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id text NOT NULL,
  title text, is_read boolean DEFAULT false
);
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id text NOT NULL, score int
);
CREATE TABLE public.notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), parent_id uuid NOT NULL, status text
);

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.profiles, public.activity_log, public.notifications,
             public.quiz_attempts, public.notification_logs
  TO anon, authenticated, service_role;

CREATE POLICY "Allow anon to read profiles"   ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow anon to insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon to update profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Allow anon to delete profiles" ON public.profiles FOR DELETE USING (true);

CREATE POLICY "Enable all for authenticated users" ON public.activity_log FOR ALL USING (true);

CREATE POLICY "Enable all for authenticated users" ON public.notifications FOR ALL USING (true);
CREATE POLICY notifications_select_own ON public.notifications FOR SELECT USING ((auth.uid())::text = user_id);
CREATE POLICY notifications_insert_own ON public.notifications FOR INSERT WITH CHECK ((auth.uid())::text = user_id);
CREATE POLICY notifications_update_own ON public.notifications FOR UPDATE USING ((auth.uid())::text = user_id);
CREATE POLICY notifications_delete_own ON public.notifications FOR DELETE USING ((auth.uid())::text = user_id);

CREATE POLICY quiz_all_policy    ON public.quiz_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY quiz_insert_policy ON public.quiz_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY quiz_attempts_own        ON public.quiz_attempts FOR SELECT USING ((auth.uid())::text = user_id);
CREATE POLICY quiz_attempts_insert_own ON public.quiz_attempts FOR INSERT WITH CHECK ((auth.uid())::text = user_id);

CREATE POLICY notification_logs_service_insert ON public.notification_logs FOR INSERT WITH CHECK (true);
CREATE POLICY notification_logs_service_update ON public.notification_logs FOR UPDATE USING (true);
CREATE POLICY notification_logs_select_own ON public.notification_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM smartboard.parents p WHERE p.id = notification_logs.parent_id AND p.auth_id = auth.uid())
);

-- ── Datos: estudiante A, estudiante B y un padre P de A ─────────────────────
INSERT INTO auth.users VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc');
INSERT INTO smartboard.parents VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc');
INSERT INTO public.profiles (id, full_name, email, phone, role) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ana', 'ana@ejemplo.co', '3001', 'student'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Beto', 'beto@ejemplo.co', '3002', 'student');
INSERT INTO public.activity_log (user_id, title) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1'), ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a2'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b1');
INSERT INTO public.notifications (user_id, title) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'na'), ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'nb');
INSERT INTO public.quiz_attempts (user_id, score) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 80), ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 70);
INSERT INTO public.parent_student_links VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', true);
INSERT INTO public.notification_logs (parent_id, status) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'sent');

-- ── Ayudas de prueba (se ejecutan con los permisos de quien llama) ──────────
CREATE SCHEMA prueba;
GRANT USAGE ON SCHEMA prueba TO anon, authenticated, service_role;

CREATE FUNCTION prueba.afectadas(q text) RETURNS bigint LANGUAGE plpgsql AS $$
DECLARE n bigint;
BEGIN
  IF q ~* '^\s*select' THEN
    EXECUTE 'SELECT count(*) FROM (' || q || ') s' INTO n;
  ELSE
    EXECUTE q;
    GET DIAGNOSTICS n = ROW_COUNT;
  END IF;
  RETURN n;
END $$;

CREATE FUNCTION prueba.espera(q text, esperado bigint, que text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE n bigint := prueba.afectadas(q);
BEGIN
  IF n IS DISTINCT FROM esperado THEN
    RAISE EXCEPTION 'FALLO [%]: % filas, se esperaban % — %', que, n, esperado, q;
  END IF;
  RAISE NOTICE 'ok  %', que;
END $$;

CREATE FUNCTION prueba.denegado(q text, que text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  BEGIN
    PERFORM prueba.afectadas(q);
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'ok  % (denegado)', que;
    RETURN;
  END;
  RAISE EXCEPTION 'FALLO [%]: debió ser denegado — %', que, q;
END $$;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA prueba TO anon, authenticated, service_role;

\set QUIET 0
\echo '== ANTES: la exposición existe =='
SET ROLE anon;
SELECT prueba.espera('select * from public.profiles', 2, 'anon lee todos los perfiles');
SELECT prueba.espera('delete from public.activity_log where user_id = ''bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb''', 1, 'anon borra actividad ajena');
RESET ROLE;
INSERT INTO public.activity_log (user_id, title) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b1');

\echo '== Aplicar 113 y 114 (114 dos veces) =='
\set QUIET 1
\i supabase/migrations/113_perfiles_publicos.sql
\i supabase/migrations/114_cerrar_rls_permisiva.sql
\i supabase/migrations/114_cerrar_rls_permisiva.sql
\set QUIET 0

\echo '== DESPUÉS: anon (sin sesión) =='
SET ROLE anon;
SELECT prueba.denegado('select * from public.profiles', 'anon lee perfiles');
SELECT prueba.denegado('delete from public.profiles', 'anon borra perfiles');
SELECT prueba.denegado('select * from public.activity_log', 'anon lee actividad');
SELECT prueba.denegado('select * from public.notifications', 'anon lee notificaciones');
SELECT prueba.denegado('select * from public.quiz_attempts', 'anon lee exámenes');
SELECT prueba.denegado('insert into public.notification_logs (parent_id) values (''dddddddd-dddd-dddd-dddd-dddddddddddd'')', 'anon escribe notification_logs');
SELECT prueba.denegado('select * from public.perfiles_publicos(array[''aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa''])', 'anon usa perfiles_publicos');
RESET ROLE;

\echo '== DESPUÉS: estudiante A con sesión =='
SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"}', false);
-- profiles
SELECT prueba.espera('select * from public.profiles', 1, 'A ve solo su perfil');
SELECT prueba.espera('select * from public.profiles where id = ''bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb''', 0, 'A no ve el perfil de B');
SELECT prueba.espera('update public.profiles set phone = ''3999'', updated_at = now() where id = ''aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa''', 1, 'A cambia su teléfono');
SELECT prueba.espera('update public.profiles set phone = ''3999'' where id = ''bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb''', 0, 'A no cambia el teléfono de B');
SELECT prueba.denegado('update public.profiles set role = ''admin'' where id = ''aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa''', 'A se cambia el rol');
SELECT prueba.denegado('update public.profiles set security_violations = 0', 'A borra sus infracciones');
SELECT prueba.denegado('delete from public.profiles', 'A borra perfiles');
SELECT prueba.denegado('insert into public.profiles (id) values (''x'')', 'A crea perfiles');
-- perfiles_publicos: nombre y avatar de otros, sin correo ni teléfono
SELECT prueba.espera('select * from public.perfiles_publicos(array[''aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'',''bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb''])', 2, 'A ve nombre y avatar de A y B');
SELECT prueba.espera('select * from public.perfiles_publicos(array[]::text[])', 0, 'lista vacía');
SELECT prueba.espera($q$select 1 from pg_proc where proname = 'perfiles_publicos' and pg_get_function_result(oid) ~ '(email|phone)'$q$, 0, 'perfiles_publicos no devuelve correo ni teléfono');
-- activity_log
SELECT prueba.espera('select * from public.activity_log', 2, 'A ve solo su actividad');
SELECT prueba.espera('insert into public.activity_log (user_id, title) values (''aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'', ''a3'')', 1, 'A registra su actividad');
SELECT prueba.denegado('insert into public.activity_log (user_id, title) values (''bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'', ''falsa'')', 'A registra actividad a nombre de B');
SELECT prueba.denegado('update public.activity_log set title = ''x''', 'A modifica actividad');
SELECT prueba.denegado('delete from public.activity_log', 'A borra actividad');
-- notifications
SELECT prueba.espera('select * from public.notifications', 1, 'A ve solo sus notificaciones');
SELECT prueba.espera('update public.notifications set is_read = true', 1, 'A marca como leídas solo las suyas');
SELECT prueba.espera('insert into public.notifications (user_id, title) values (''aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'', ''n2'')', 1, 'A crea una notificación propia');
SELECT prueba.denegado('insert into public.notifications (user_id, title) values (''bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'', ''spam'')', 'A crea notificación para B');
SELECT prueba.espera('delete from public.notifications where user_id = ''bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb''', 0, 'A no borra notificaciones de B');
-- quiz_attempts
SELECT prueba.espera('select * from public.quiz_attempts', 1, 'A ve solo sus exámenes');
SELECT prueba.denegado('update public.quiz_attempts set score = 100', 'A cambia notas');
-- notification_logs
SELECT prueba.espera('select * from public.notification_logs', 0, 'A no ve envíos a padres');
SELECT prueba.denegado('insert into public.notification_logs (parent_id) values (''dddddddd-dddd-dddd-dddd-dddddddddddd'')', 'A escribe notification_logs');
RESET ROLE;

\echo '== DESPUÉS: padre P con sesión =='
SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"cccccccc-cccc-cccc-cccc-cccccccccccc"}', false);
SELECT prueba.espera('select * from public.notification_logs', 1, 'P ve sus envíos');
SELECT prueba.espera('select * from public.activity_log', 3, 'P ve la actividad de su hijo A (3 filas)');
SELECT prueba.espera('select * from public.activity_log where user_id = ''bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb''', 0, 'P no ve la actividad de B');
SELECT prueba.denegado('update public.activity_log set title = ''x''', 'P modifica actividad de su hijo');
SELECT prueba.denegado('update public.notification_logs set status = ''x''', 'P modifica envíos');
RESET ROLE;

\echo '== DESPUÉS: backend (service_role) =='
SET ROLE service_role;
SELECT prueba.espera('select * from public.profiles', 2, 'backend ve todos los perfiles');
SELECT prueba.espera('insert into public.notification_logs (parent_id, status) values (''dddddddd-dddd-dddd-dddd-dddddddddddd'', ''sent'')', 1, 'backend registra envíos');
SELECT prueba.espera('update public.notification_logs set status = ''delivered''', 2, 'backend actualiza envíos');
RESET ROLE;

\echo '== TODAS LAS COMPROBACIONES PASARON =='
