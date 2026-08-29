-- ============================================================================
-- validate_schema.sql — verificación del schema tras aplicar las migraciones.
-- Uso (CI / staging):
--   psql "$DB_URL" -v ON_ERROR_STOP=1 -f supabase/validate_schema.sql
-- Falla (RAISE EXCEPTION) si falta alguna tabla o columna crítica de SmartBoard.
-- ============================================================================

DO $$
DECLARE
  missing_tables  TEXT[] := '{}';
  missing_columns TEXT[] := '{}';
  t TEXT;
  c RECORD;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'students','sessions','points_history','crisis_alerts','conversations','achievements',
    'dani_memory','learning_plans','early_warnings','student_competency_mastery','competencies',
    'learning_content','recommendations','missions','student_missions','badges','student_badges',
    'student_timetable','timetable_slots','student_exams','smartboard_kids_data','grade_analyses',
    'improvement_plans','parent_alerts','parent_student_links','notifications','feedback_log',
    'parent_consents','vak_results','learning_streaks','academic_context','parent_dashboards'
  ] LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
      missing_tables := missing_tables || t;
    END IF;
  END LOOP;

  FOR c IN SELECT * FROM (VALUES
    ('student_competency_mastery','mastery_level'),('student_competency_mastery','practice_count'),
    ('student_competency_mastery','updated_at'),
    ('learning_plans','plan_json'),('dani_memory','communication_style'),('dani_memory','strengths'),
    ('timetable_slots','day_of_week'),('sessions','duration_minutes'),
    ('students','school'),('students','grade'),('students','grade_level'),('students','country_code'),
    ('learning_streaks','best_streak'),('early_warnings','evidence_json'),
    ('grade_analyses','student_user_id'),('smartboard_kids_data','user_id')
  ) AS v(tbl, col) LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = c.tbl AND column_name = c.col) THEN
      missing_columns := missing_columns || (c.tbl || '.' || c.col);
    END IF;
  END LOOP;

  IF array_length(missing_tables, 1) > 0 OR array_length(missing_columns, 1) > 0 THEN
    RAISE EXCEPTION 'SCHEMA_INCOMPLETE missing_tables=% missing_columns=%', missing_tables, missing_columns;
  END IF;

  RAISE NOTICE 'SCHEMA_OK: todas las tablas y columnas críticas existen';
END $$;
