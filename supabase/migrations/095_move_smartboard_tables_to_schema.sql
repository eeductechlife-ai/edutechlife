-- ============================================================================
-- 095_move_smartboard_tables_to_schema.sql
--
-- Tercera y última pasada de la separación por producto: los datos de
-- SmartBoard pasan al schema `smartboard`, dejando la identidad compartida en
-- `public`. Con esto cada producto queda en su propio schema:
--
--   public      → auth.users, public.users, profiles (+ vistas de compatibilidad)
--   ialab       → curso, progreso, lecciones, foro, certificados
--   smartboard  → niños, padres, planes, misiones, insignias, analíticas
--
-- Verificado en código: NINGUNA de estas tablas la usa IALab (0 referencias).
-- Los consumidores (servicios de SmartBoard, middleware de ownership,
-- notificaciones, predicciones, multi-jugador y los hooks del panel) siguen
-- funcionando a través de las vistas de compatibilidad con `security_invoker`.
--
-- Mismo mecanismo que 093/094. Las claves foráneas se mantienen (apuntan a la
-- tabla, no al esquema), y `learning_streaks` ya está en `smartboard` (094), así
-- que su FK a `students` queda dentro del mismo schema.
-- ============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS smartboard;

DO $$
DECLARE r text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
      EXECUTE format('GRANT USAGE ON SCHEMA smartboard TO %I', r);
    END IF;
  END LOOP;
END $$;

-- ── 1. Mover tablas + vistas de compatibilidad ─────────────────────────────
DO $$
DECLARE
  t text;
  r text;
  sb_tables text[] := ARRAY[
    -- niños y padres
    'students', 'parents', 'parent_student_links', 'parent_consents',
    'parent_preferences', 'parent_alerts', 'parent_alerts_archive',
    'parent_contact_info', 'parent_dashboard_views', 'parent_dani_conversations',
    -- datos del estudiante
    'student_risk_scores', 'student_rewards', 'student_exams',
    'student_achievements', 'student_timetable', 'student_missions',
    'student_badges', 'student_sessions', 'student_competency_mastery',
    'student_competition_stats',
    -- plan de estudios y gamificación
    'timetable_slots', 'missions', 'badges', 'smartboard_kids_data',
    'grade_analyses', 'lesson_attempts',
    -- analítica/predicción
    'improvement_plans', 'early_warnings', 'predictive_alerts'
  ];
BEGIN
  FOREACH t IN ARRAY sb_tables LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = t AND table_type = 'BASE TABLE'
    ) THEN
      EXECUTE format('ALTER TABLE public.%I SET SCHEMA smartboard', t);
      RAISE NOTICE 'movida a smartboard: %', t;
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'smartboard' AND table_name = t AND table_type = 'BASE TABLE'
    ) THEN
      EXECUTE format(
        'CREATE OR REPLACE VIEW public.%I WITH (security_invoker = on) AS SELECT * FROM smartboard.%I',
        t, t
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

-- ── 2. search_path de las funciones que referencian estas tablas ───────────
-- Se generan dos grupos para no depender de una lista de firmas:
--   a) funciones que mencionan tablas de SmartBoard → smartboard, public
--   b) las que además mencionan tablas de IALab → ialab, smartboard, public
DO $$
DECLARE
  r record;
  sb_re text := 'students|parents|parent_|student_|timetable|missions|badges|smartboard_kids_data|grade_analyses|lesson_attempts|improvement_plans|early_warnings|predictive_alerts|learning_streaks';
  ialab_re text := 'user_progress|certificates|module_|forum_';
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig,
           (pg_get_functiondef(p.oid) ~* ialab_re) AS toca_ialab
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prokind = 'f'
      AND pg_get_functiondef(p.oid) ~* sb_re
  LOOP
    IF r.toca_ialab THEN
      EXECUTE format('ALTER FUNCTION %s SET search_path = ialab, smartboard, public', r.sig);
    ELSE
      EXECUTE format('ALTER FUNCTION %s SET search_path = smartboard, public', r.sig);
    END IF;
    RAISE NOTICE 'search_path fijado: %', r.sig;
  END LOOP;
END $$;

COMMIT;
