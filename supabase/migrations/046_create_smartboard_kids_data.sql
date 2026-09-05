-- ============================================================================
-- Migration 046 — smartboard_kids_data (blob de estado, cache del frontend)
-- Idempotente: CREATE IF NOT EXISTS + políticas con DROP/CREATE (ya idempotente).
-- ============================================================================

CREATE TABLE IF NOT EXISTS smartboard_kids_data (
  user_id TEXT PRIMARY KEY,
  platform TEXT DEFAULT 'smartboard',
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

CREATE INDEX IF NOT EXISTS idx_smartboard_kids_data_created_at ON smartboard_kids_data(created_at);
CREATE INDEX IF NOT EXISTS idx_smartboard_kids_data_updated_at ON smartboard_kids_data(updated_at);

ALTER TABLE smartboard_kids_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students read own smartboard data" ON smartboard_kids_data;
CREATE POLICY "Students read own smartboard data"
  ON smartboard_kids_data FOR SELECT
  USING (auth.uid()::TEXT = user_id);

DROP POLICY IF EXISTS "Students insert own smartboard data" ON smartboard_kids_data;
CREATE POLICY "Students insert own smartboard data"
  ON smartboard_kids_data FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);

DROP POLICY IF EXISTS "Students update own smartboard data" ON smartboard_kids_data;
CREATE POLICY "Students update own smartboard data"
  ON smartboard_kids_data FOR UPDATE
  USING (auth.uid()::TEXT = user_id)
  WITH CHECK (auth.uid()::TEXT = user_id);

DROP POLICY IF EXISTS "Service role manage smartboard data" ON smartboard_kids_data;
CREATE POLICY "Service role manage smartboard data"
  ON smartboard_kids_data FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Parents read child smartboard data" ON smartboard_kids_data;
CREATE POLICY "Parents read child smartboard data"
  ON smartboard_kids_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_student_links psl
      WHERE psl.parent_user_id = auth.uid()::TEXT
        AND psl.student_user_id = smartboard_kids_data.user_id
        AND psl.is_active = true
    )
  );
