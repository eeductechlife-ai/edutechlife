-- ============================================================================
-- Migration 047 — Fix students.age CHECK constraint
--
-- Problem: students table has CHECK (age >= 6 AND age <= 16) but the backend
-- endpoints accept ages 5-25 (see /api/smartboard/student-profile PUT, line 1011).
-- This creates a validation mismatch: the API accepts 5-25 but DB rejects anything
-- outside 6-16, causing INSERT/UPDATE failures for edge cases.
--
-- Solution: Alter the constraint to match backend expectations: age >= 5 AND age <= 25
-- This allows:
-- - Ages 5-6 for very early readers
-- - Ages 6-16 for primary SmartBoard users
-- - Ages 17-25 for older students / premium IALab users
-- ============================================================================

BEGIN;

-- Drop the old constraint
ALTER TABLE students
DROP CONSTRAINT IF EXISTS "age >= 6 AND age <= 16";

-- Add the new constraint with expanded range
ALTER TABLE students
ADD CONSTRAINT "age >= 5 AND age <= 25" CHECK (age >= 5 AND age <= 25);

-- Log the change
SELECT 'students.age constraint updated: 6-16 → 5-25 ✓' AS migration_result;

COMMIT;
