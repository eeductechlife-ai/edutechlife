-- ============================================================================
-- 094_move_certificates_forum_streaks.sql
--
-- Segunda pasada de la separación por producto, según la propiedad real de
-- cada tabla (verificada en el código):
--
--   * `certificates` y `forum_posts` son de IALab (el curso certifica y tiene
--     foro; SmartBoard no genera certificados ni foro). Sus lectores
--     compartidos (modal de certificados, perfil público) siguen funcionando a
--     través de la vista de compatibilidad.
--   * `learning_streaks` lo usa SmartBoard (13 referencias: badgeEngine,
--     adaptiveLearning, earlyWarning, achievementService, parentChatService,
--     useSmartBoardSupabase, …) y NO lo usa IALab (0 referencias; la racha del
--     curso vive en su propio store/RPC). Está VACÍA en producción (0 filas),
--     así que moverla es inocuo. Va a `smartboard` para dejar las dos rachas
--     independientes: si IALab necesita persistir racha en tabla, le
--     corresponderá `ialab.*`.
--
-- Mismo mecanismo que la 093 (vistas de compatibilidad con
-- `security_invoker = on`), así que el cliente sigue igual.
--
-- Importante: las funciones que referencian estas tablas ya tenían
-- `search_path = ialab, public` (093). Como `learning_streaks` pasa a
-- `smartboard`, aquí se re-fija el search_path de todas las funciones que
-- mencionan las tablas movidas a `ialab, smartboard, public` para que resuelvan
-- cualquiera de los dos schemas.
-- ============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS ialab;
CREATE SCHEMA IF NOT EXISTS smartboard;

DO $$
DECLARE r text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
      EXECUTE format('GRANT USAGE ON SCHEMA ialab TO %I', r);
      EXECUTE format('GRANT USAGE ON SCHEMA smartboard TO %I', r);
    END IF;
  END LOOP;
END $$;

-- ── 1. Mover tablas + vistas de compatibilidad ─────────────────────────────
DO $$
DECLARE
  i int;
  t text;
  r text;
  destino text;
  movimientos text[][] := ARRAY[
    ['ialab', 'certificates'],
    ['ialab', 'forum_posts'],
    ['smartboard', 'learning_streaks']
  ];
BEGIN
  FOR i IN 1..array_length(movimientos, 1) LOOP
    destino := movimientos[i][1];
    t       := movimientos[i][2];

    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = t AND table_type = 'BASE TABLE'
    ) THEN
      EXECUTE format('ALTER TABLE public.%I SET SCHEMA %I', t, destino);
      RAISE NOTICE 'movida a %: %', destino, t;
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = destino AND table_name = t AND table_type = 'BASE TABLE'
    ) THEN
      EXECUTE format(
        'CREATE OR REPLACE VIEW public.%I WITH (security_invoker = on) AS SELECT * FROM %I.%I',
        t, destino, t
      );
      FOREACH r IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
          EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO %I', t, r);
        END IF;
      END LOOP;
      RAISE NOTICE 'vista de compatibilidad creada: public.%', t;
    END IF;
  END LOOP;
END $$;

-- ── 2. search_path de las funciones del curso/comunidad ────────────────────
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
    EXECUTE format('ALTER FUNCTION %s SET search_path = ialab, smartboard, public', r.sig);
    RAISE NOTICE 'search_path fijado: %', r.sig;
  END LOOP;
END $$;

COMMIT;
