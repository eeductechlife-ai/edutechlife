-- Migration 080: Extend parents table for entity-based parent accounts
-- The parents table already exists (id, auth_id, email, name, phone, created_at, updated_at).
-- This migration adds entity fields and RLS so parents can register with their real email.
-- The legacy alias system (local+padre@domain in authService.js) remains active.

ALTER TABLE parents
  ADD COLUMN IF NOT EXISTS student_id         UUID REFERENCES students(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS student_auth_id    UUID,
  ADD COLUMN IF NOT EXISTS invitation_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS verified_at        TIMESTAMPTZ;

ALTER TABLE parents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parent reads own record"      ON parents;
DROP POLICY IF EXISTS "Parent updates own record"    ON parents;
DROP POLICY IF EXISTS "Service role manages parents" ON parents;

CREATE POLICY "Parent reads own record"
  ON parents FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Parent updates own record"
  ON parents FOR UPDATE
  USING (auth.uid() = auth_id);

CREATE POLICY "Service role manages parents"
  ON parents FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_parents_student_id      ON parents(student_id);
CREATE INDEX IF NOT EXISTS idx_parents_student_auth_id ON parents(student_auth_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_parents_auth_id  ON parents(auth_id);
