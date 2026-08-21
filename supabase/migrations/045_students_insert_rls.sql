-- ============================================================================
-- Migration 045 — Allow authenticated users to INSERT their own student row
--
-- Problem: students table had SELECT + UPDATE policies for authenticated users
-- but NO INSERT policy. This blocked self-registration from the frontend.
-- The backend (service_role) could still insert, but only if SUPABASE_SERVICE_KEY
-- is set in Render env vars. This policy adds a safe fallback.
--
-- Security: auth.uid() = auth_id ensures users can only insert their OWN row.
-- ============================================================================

BEGIN;

-- Allow authenticated users to insert their own student row
-- (auth.uid() must equal auth_id — users can't create rows for others)
CREATE POLICY IF NOT EXISTS "Students insert own profile"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_id);

COMMIT;
