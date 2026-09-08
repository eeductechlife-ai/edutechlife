-- Migration 076: Reconcile schema_migrations — registrar migraciones aplicadas
-- out-of-band que no quedaron en el registro de Supabase.
-- Todas las tablas/columnas/políticas ya existen en producción.

INSERT INTO supabase_migrations.schema_migrations (version, name) VALUES
  ('035', 'achievements_system'),
  ('041', 'students_vak_results_rls_policy'),
  ('042', 'student_timetable'),
  ('045', 'students_insert_rls'),
  ('046', 'create_smartboard_kids_data'),
  ('047', 'fix_students_age_constraint'),
  ('048', 'drop_broken_vak_sync_trigger'),
  ('049', 'fix_rls_to_authenticated'),
  ('051', 'students_grade_country'),
  ('061', 'users_user_type'),
  ('068', 'avatars_storage_bucket'),
  ('070', 'prompt_templates'),
  ('072', 'metrics_tables'),
  ('073', 'mfa_totp')
ON CONFLICT (version) DO NOTHING;
