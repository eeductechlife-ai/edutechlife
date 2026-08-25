-- Idempotent: Drop broken VAK sync trigger — only if it exists
DO $$
BEGIN
  DROP TRIGGER IF EXISTS trg_sync_vak_on_insert ON vak_results;
  DROP FUNCTION IF EXISTS sync_vak_to_student_profile();
END
$$;
