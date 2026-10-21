-- ============================================================================
-- Prueba de la migración 116 (avisos a padres por WhatsApp).
-- Comprueba que la base misma impide lo que no debe pasar, sin depender del
-- código del backend: activar un número sin verificar, guardar un teléfono mal
-- formado, enviar dos veces lo mismo y que un cliente lea estas tablas.
-- Uso (base desechable, nunca producción), desde la raíz del repo:
--   createdb wa_test && psql -v ON_ERROR_STOP=1 -d wa_test -f supabase/tests/avisos_padres_whatsapp.test.sql
-- ============================================================================
\set ON_ERROR_STOP 1
\set QUIET 1

DO $$ BEGIN
  CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY);
GRANT USAGE ON SCHEMA auth, public TO anon, authenticated, service_role;
INSERT INTO auth.users VALUES ('22222222-2222-4222-8222-222222222222');

\i supabase/migrations/116_avisos_padres_whatsapp.sql
\i supabase/migrations/116_avisos_padres_whatsapp.sql

CREATE SCHEMA prueba;
GRANT USAGE ON SCHEMA prueba TO anon, authenticated, service_role;
-- Ejecuta una sentencia y espera un error con ese SQLSTATE.
CREATE FUNCTION prueba.rechaza(q text, codigo text, que text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  BEGIN EXECUTE q; EXCEPTION WHEN OTHERS THEN
    IF SQLSTATE = codigo THEN RAISE NOTICE 'ok  % (%)', que, codigo; RETURN; END IF;
    RAISE EXCEPTION 'FALLO [%]: error % en vez de %: %', que, SQLSTATE, codigo, SQLERRM;
  END;
  RAISE EXCEPTION 'FALLO [%]: debió fallar', que;
END $$;
CREATE FUNCTION prueba.acepta(q text, que text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN EXECUTE q; RAISE NOTICE 'ok  %', que; END $$;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA prueba TO anon, authenticated, service_role;

\set QUIET 0
\echo '== whatsapp_padres: nada se activa sin verificar =='
SELECT prueba.acepta($$INSERT INTO public.whatsapp_padres (parent_user_id) VALUES ('22222222-2222-4222-8222-222222222222')$$, 'una fila sin activar se puede crear (verificación en curso)');
SELECT prueba.rechaza($$UPDATE public.whatsapp_padres SET activo = true$$, '23514', 'no se activa sin número verificado, verificación ni consentimiento');
SELECT prueba.rechaza($$UPDATE public.whatsapp_padres SET activo = true, telefono = '+573001112233'$$, '23514', 'no se activa con número pero sin verificar');
SELECT prueba.rechaza($$UPDATE public.whatsapp_padres SET activo = true, telefono = '+573001112233', verificado_at = now()$$, '23514', 'no se activa sin consentimiento');
SELECT prueba.acepta($$UPDATE public.whatsapp_padres SET activo = true, telefono = '+573001112233', verificado_at = now(), opt_in_at = now(), opt_in_version = 'v1'$$, 'se activa con número verificado y consentimiento');
SELECT prueba.rechaza($$UPDATE public.whatsapp_padres SET telefono = '3001112233'$$, '23514', 'el teléfono debe estar en formato internacional');
SELECT prueba.rechaza($$UPDATE public.whatsapp_padres SET telefono = '+0123456789'$$, '23514', 'el teléfono no puede empezar por 0');
SELECT prueba.rechaza($$UPDATE public.whatsapp_padres SET telefono_pendiente = 'no-es-un-numero'$$, '23514', 'el número pendiente también se valida');
SELECT prueba.rechaza($$INSERT INTO public.whatsapp_padres (parent_user_id) VALUES ('99999999-9999-4999-8999-999999999999')$$, '23503', 'el padre debe existir en auth.users');

\echo '== avisos_padres_envios: una sola vez por padre, niño, canal y referencia =='
SELECT prueba.acepta($$INSERT INTO public.avisos_padres_envios (tipo, canal, parent_user_id, student_id, referencia) VALUES ('conexion','whatsapp','22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','100')$$, 'primer envío');
SELECT prueba.rechaza($$INSERT INTO public.avisos_padres_envios (tipo, canal, parent_user_id, student_id, referencia) VALUES ('conexion','whatsapp','22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','100')$$, '23505', 'el mismo envío no se repite');
SELECT prueba.acepta($$INSERT INTO public.avisos_padres_envios (tipo, canal, parent_user_id, student_id, referencia) VALUES ('conexion','whatsapp','22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','101')$$, 'otra ventana de tiempo sí se envía');
SELECT prueba.acepta($$INSERT INTO public.avisos_padres_envios (tipo, canal, parent_user_id, student_id, referencia) VALUES ('conexion','correo','22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','100')$$, 'otro canal sí se envía');
SELECT prueba.acepta($$INSERT INTO public.avisos_padres_envios (tipo, canal, parent_user_id, student_id, referencia) VALUES ('conexion','whatsapp','22222222-2222-4222-8222-222222222222','44444444-4444-4444-8444-444444444444','100')$$, 'otro niño sí se envía');
SELECT prueba.rechaza($$INSERT INTO public.avisos_padres_envios (tipo, canal, parent_user_id, student_id, referencia) VALUES ('otro','whatsapp','22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','1')$$, '23514', 'solo hay tipos conexion y semanal');
SELECT prueba.rechaza($$INSERT INTO public.avisos_padres_envios (tipo, canal, parent_user_id, student_id, referencia) VALUES ('semanal','sms','22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','1')$$, '23514', 'solo hay canales whatsapp y correo');

\echo '== solo el backend accede a estas tablas =='
SET ROLE anon;
SELECT prueba.rechaza($$SELECT * FROM public.whatsapp_padres$$, '42501', 'anon no lee whatsapp_padres');
SELECT prueba.rechaza($$SELECT * FROM public.avisos_padres_envios$$, '42501', 'anon no lee avisos_padres_envios');
RESET ROLE;
SET ROLE authenticated;
SELECT prueba.rechaza($$SELECT * FROM public.whatsapp_padres$$, '42501', 'un usuario con sesión no lee whatsapp_padres (ni los teléfonos de otros padres)');
SELECT prueba.rechaza($$UPDATE public.whatsapp_padres SET activo = true$$, '42501', 'un usuario con sesión no se activa a sí mismo saltándose la verificación');
SELECT prueba.rechaza($$INSERT INTO public.avisos_padres_envios (tipo, canal, parent_user_id, student_id, referencia) VALUES ('conexion','whatsapp','22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','7')$$, '42501', 'un usuario con sesión no escribe envíos');
RESET ROLE;
SET ROLE service_role;
SELECT prueba.acepta($$SELECT count(*) FROM public.whatsapp_padres$$, 'el backend (service_role) sí lee');
SELECT prueba.acepta($$UPDATE public.whatsapp_padres SET aviso_conexion = false$$, 'el backend sí escribe');
RESET ROLE;

\echo '== borrar al padre borra su consentimiento =='
DELETE FROM auth.users WHERE id = '22222222-2222-4222-8222-222222222222';
SELECT CASE WHEN (SELECT count(*) FROM public.whatsapp_padres) = 0 THEN 'ok  se borra el consentimiento con el padre'
            ELSE (SELECT 'FALLO'::text FROM (SELECT 1/0) x) END AS resultado;

\echo '== TODAS LAS COMPROBACIONES PASARON =='
