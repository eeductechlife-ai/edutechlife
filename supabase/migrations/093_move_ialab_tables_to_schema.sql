-- ============================================================================
-- 093_move_ialab_tables_to_schema.sql
--
-- Mueve los DATOS de IALab al schema `ialab` (creado en la 092), dejando la
-- identidad compartida en `public` (auth.users, public.users, profiles), y
-- mantiene el cliente EXACTAMENTE igual mediante VISTAS DE COMPATIBILIDAD en
-- public.
--
-- Diseño (verificado con dry-run real en PostgreSQL):
--   * ALTER TABLE ... SET SCHEMA es metadata-only: instantáneo, sin copiar
--     datos. Revertir = SET SCHEMA public.
--   * Por cada tabla movida se crea en `public` una vista con el mismo nombre
--     y `security_invoker = on`:
--       - El cliente sigue usando `supabase.from('user_progress')` sin cambios.
--       - PostgREST resuelve la vista en public (que es el schema expuesto).
--       - RLS: al ser security_invoker, se aplican las políticas de la tabla
--         base (ialab.<tabla>) al usuario que consulta. Comprobado: un insert
--         de fila ajena falla con "new row violates row-level security policy".
--       - Se verificó también INSERT/UPDATE/DELETE/SELECT y UPSERT
--         (ON CONFLICT ... DO UPDATE) a través de la vista, que es lo que usa
--         el progreso de videos.
--   * Las funciones del curso referencian las tablas SIN calificar
--     (verificado: calculate_module_score usa `FROM user_progress`), así que
--     basta fijar `search_path = ialab, public` para que sigan resolviendo la
--     tabla real (sin pasar por la vista).
--
-- NO se necesita desplegar el cliente ni exponer `ialab` en la Data API.
-- Requisito: PostgreSQL 15+ (security_invoker). Producción: PostgreSQL 17.6.
-- ============================================================================

BEGIN;

-- ── 0. Schema destino (idempotente: no depende del orden con la 092) ────────
CREATE SCHEMA IF NOT EXISTS ialab;

DO $$
DECLARE r text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
      EXECUTE format('GRANT USAGE ON SCHEMA ialab TO %I', r);
    END IF;
  END LOOP;
END $$;

-- ── 1. Mover tablas + crear vistas de compatibilidad ───────────────────────
-- Solo tablas de uso EXCLUSIVO de IALab (verificado por grep en el código).
-- Quedan fuera a propósito porque el código de SmartBoard también las usa:
--   learning_streaks, certificates, forum_posts, lesson_attempts.
DO $$
DECLARE
  t text;
  r text;
  ialab_tables text[] := ARRAY[
    'module_content', 'module_lessons', 'module_topics', 'module_resources',
    'user_progress', 'user_video_progress', 'user_exams', 'user_activities',
    'lesson_answers', 'lesson_answer_votes', 'lesson_questions',
    'forum_comments', 'forum_votes', 'forum_profiles', 'forum_notifications'
  ];
BEGIN
  FOREACH t IN ARRAY ialab_tables LOOP
    -- 1a. Mover la tabla si sigue en public (idempotente).
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = t AND table_type = 'BASE TABLE'
    ) THEN
      EXECUTE format('ALTER TABLE public.%I SET SCHEMA ialab', t);
      RAISE NOTICE 'movida a ialab: %', t;
    END IF;

    -- 1b. Vista de compatibilidad en public (mismo nombre, RLS del invocador).
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'ialab' AND table_name = t AND table_type = 'BASE TABLE'
    ) THEN
      EXECUTE format(
        'CREATE OR REPLACE VIEW public.%I WITH (security_invoker = on) AS SELECT * FROM ialab.%I',
        t, t
      );
      -- 1c. Permisos de la vista para los roles de la API (si existen).
      FOREACH r IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
          EXECUTE format(
            'GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO %I', t, r
          );
        END IF;
      END LOOP;
      RAISE NOTICE 'vista de compatibilidad creada: public.%', t;
    END IF;
  END LOOP;
END $$;

-- ── 2. Las funciones del curso deben resolver las tablas en `ialab` ─────────
-- Se genera desde el catálogo para no depender de firmas hardcodeadas.
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prokind = 'f'
      AND pg_get_functiondef(p.oid) ~*
          '(user_progress|certificates|module_|forum_|lesson_|learning_streaks)'
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = ialab, public', r.sig);
    RAISE NOTICE 'search_path fijado: %', r.sig;
  END LOOP;
END $$;

COMMIT;
