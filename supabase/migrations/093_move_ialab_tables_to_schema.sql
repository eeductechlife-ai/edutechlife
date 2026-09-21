-- ============================================================================
-- 093_move_ialab_tables_to_schema.sql
--
-- Mueve los DATOS de IALab al schema `ialab` (creado en la 092), dejando la
-- identidad compartida en `public` (auth.users, public.users, profiles).
--
-- Por qué es seguro y reversible:
--   * ALTER TABLE ... SET SCHEMA es metadata-only: instantáneo y sin copiar
--     datos. Revertir = SET SCHEMA public.
--   * Los GRANTS de cada tabla viajan con ella y los roles ya tienen USAGE
--     sobre el schema (092), así que PostgREST sigue viendo las tablas.
--   * Las funciones del curso referencian las tablas SIN calificar
--     (verificado: calculate_module_score usa `FROM user_progress`), por lo
--     que no hay que reescribir cuerpos: basta con poner `ialab` primero en su
--     search_path (bloque final, generado desde el catálogo).
--
-- Requisito de despliegue: exponer el schema `ialab` en la Data API
-- (Dashboard → Integrations → Data API → Exposed schemas) y desplegar en el
-- mismo release el cambio de cliente que usa .schema('ialab') para las tablas
-- de IALab. Los RPC (mark_resource_viewed, calculate_module_score, …) siguen
-- en `public` y no requieren cambios en el cliente.
-- ============================================================================

BEGIN;

-- ── 0. Schema destino (idempotente: no depende del orden con la 092) ────────
CREATE SCHEMA IF NOT EXISTS ialab;

-- Los roles de la API existen en Supabase; se conceden sólo si están presentes
-- (así la migración también corre en un Postgres sin esos roles, p. ej. en un
-- dry-run local o en CI).
DO $$
DECLARE r text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
      EXECUTE format('GRANT USAGE ON SCHEMA ialab TO %I', r);
    END IF;
  END LOOP;
END $$;

-- ── 1. Mover tablas de IALab (idempotente: sólo si siguen en public) ────────
DO $$
DECLARE
  t text;
  -- Solo tablas cuyo uso es EXCLUSIVO de IALab (verificado por grep en el
  -- código): el curso, su progreso, sus lecciones y su foro.
  -- Quedan FUERA a propósito, porque el código de SmartBoard también las usa:
  --   learning_streaks (gamificación), certificates y forum_posts (perfil/
  --   métricas) y lesson_attempts. Se moverán en una segunda pasada cuando sus
  --   consumidores se actualicen.
  ialab_tables text[] := ARRAY[
    'module_content', 'module_lessons', 'module_topics', 'module_resources',
    'user_progress', 'user_video_progress', 'user_exams', 'user_activities',
    'lesson_answers', 'lesson_answer_votes', 'lesson_questions',
    'forum_comments', 'forum_votes', 'forum_profiles', 'forum_notifications'
  ];
BEGIN
  FOREACH t IN ARRAY ialab_tables LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = t
    ) THEN
      EXECUTE format('ALTER TABLE public.%I SET SCHEMA ialab', t);
      RAISE NOTICE 'movida a ialab: %', t;
    END IF;
  END LOOP;
END $$;

-- ── 2. Las funciones del curso deben resolver las tablas en `ialab` ─────────
-- Se genera desde el catálogo para no depender de una lista hardcodeada de
-- firmas: cualquier función de public que mencione estas tablas recibe
-- `search_path = ialab, public` (public se mantiene para el resto de objetos).
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
