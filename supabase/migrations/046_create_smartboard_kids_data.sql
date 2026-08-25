-- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'IF') THEN
    -- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'smartboard_kids_data') THEN
    -- ============================================================================
    -- Migration 046 — Create smartboard_kids_data table
--
    -- Problem: Endpoints /api/smartboard/data/:userId, /api/smartboard/progress/:userId,
    -- and /api/smartboard/weekly-report reference the smartboard_kids_data table
    -- that does not exist in the Supabase migrations. This causes HTTP 500 errors
    -- in production when these endpoints are called.
--
    -- The table was manually created in production but never migrated via code.
    -- This migration creates it with proper schema, RLS, and indexes.
--
    -- Schema: Stores the complete SmartBoard state blob per student (ages 6-16)
    -- - user_id: Auth user ID (TEXT for compatibility with auth.uid()::TEXT)
    -- - data: JSONB blob containing:
    --   * totalPoints: integer
    --   * streak: integer (consecutive days active)
    --   * completedMissions: string[] (mission IDs)
    --   * subjectProgress: object { [subject]: { timeSpent, sessionsCompleted } }
    --   * totalActiveMinutes: integer (cumulative study time)
    --   * vakResult: string | null (visual/auditory/kinesthetic)
    -- ============================================================================

BEGIN;

    -- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS smartboard_kids_data (
  user_id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{
    "totalPoints": 0,
    "streak": 0,
    "completedMissions": [],
    "subjectProgress": {},
    "totalActiveMinutes": 0,
    "vakResult": null
  }'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

    -- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_smartboard_kids_data_created_at
  ON smartboard_kids_data(created_at);

CREATE INDEX IF NOT EXISTS idx_smartboard_kids_data_updated_at
  ON smartboard_kids_data(updated_at);

    -- Enable RLS
ALTER TABLE smartboard_kids_data ENABLE ROW LEVEL SECURITY;

    -- RLS Policies

    -- Students can read their own data
DROP POLICY IF EXISTS "Students read own smartboard data" ON smartboard_kids_data;
CREATE POLICY "Students read own smartboard data"
  ON smartboard_kids_data FOR SELECT
  USING (auth.uid()::TEXT = user_id);

    -- Students can insert their own data (first sync)
DROP POLICY IF EXISTS "Students insert own smartboard data" ON smartboard_kids_data;
CREATE POLICY "Students insert own smartboard data"
  ON smartboard_kids_data FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);

    -- Students can update their own data (sync updates)
DROP POLICY IF EXISTS "Students update own smartboard data" ON smartboard_kids_data;
CREATE POLICY "Students update own smartboard data"
  ON smartboard_kids_data FOR UPDATE
  USING (auth.uid()::TEXT = user_id)
  WITH CHECK (auth.uid()::TEXT = user_id);

    -- Service role (backend) can do anything for sync/migration scenarios
DROP POLICY IF EXISTS "Service role manage smartboard data" ON smartboard_kids_data;
CREATE POLICY "Service role manage smartboard data"
  ON smartboard_kids_data FOR ALL
  USING (true)
  WITH CHECK (true);

    -- Parents can read their child's data if linked
DROP POLICY IF EXISTS "Parents read child smartboard data" ON smartboard_kids_data;
CREATE POLICY "Parents read child smartboard data"
  ON smartboard_kids_data FOR SELECT
  USING (
    -- Parent linked to this student
    EXISTS (
      SELECT 1 FROM parent_student_links psl
      WHERE psl.parent_user_id = auth.uid()::TEXT
        AND psl.student_user_id = smartboard_kids_data.user_id
        AND psl.is_active = true
    )
  );

COMMIT;
  END IF;
END
$$;
  END IF;
END
$$;
