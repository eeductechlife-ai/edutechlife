-- ============================================================================
-- Migration 045 — Drop broken vak_results → students sync trigger
--
-- Problem: The trigger sync_vak_to_student_profile (created in migration 011)
-- attempts to UPDATE students.vak_result_json whenever a row is inserted into
-- vak_results. However:
--
-- 1. Migration 040 added a separate vak_style column to students for normalized
--    storage of the VAK result, making the blob approach redundant.
--
-- 2. The column vak_result_json was never properly migrated to production:
--    production databases have a manual schema that diverges from migrations.
--    Migration 040 explicitly documents: "does not exist in production".
--
-- 3. Every INSERT into vak_results potentially fails silently when the trigger
--    tries to update a non-existent or misaligned column, causing data loss
--    and confusing error logs.
--
-- Solution: Drop the trigger and its function. VAK results are accessed via
-- the normalized vak_results table directly, or synced to students.vak_style
-- via application logic (not a trigger).
--
-- Impact: VAK results will no longer auto-sync to students.vak_result_json
-- (which doesn't exist in production anyway). Frontend/backend must read from
-- vak_results table or students.vak_style column instead.
-- ============================================================================

BEGIN;

-- Drop the trigger
DROP TRIGGER IF EXISTS trg_sync_vak_on_insert ON vak_results;

-- Drop the function (it's only used by the trigger)
DROP FUNCTION IF EXISTS sync_vak_to_student_profile();

-- Log completion
SELECT 'Trigger trg_sync_vak_on_insert and function sync_vak_to_student_profile dropped ✓' AS migration_result;

COMMIT;
