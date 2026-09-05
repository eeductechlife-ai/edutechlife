-- Migration 071: Admin RBAC — RLS policies for admin_activity_log
-- Idempotent: safe to run multiple times

-- Create admin_activity_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  target_type TEXT,
  target_id   TEXT,
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Only admins (app_metadata.role = 'admin') can read/write the log
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admin_activity_log'
      AND policyname = 'admin_activity_log_admin_only'
  ) THEN
    CREATE POLICY admin_activity_log_admin_only
      ON admin_activity_log
      FOR ALL
      USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'content_creator')
      )
      WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'content_creator')
      );
  END IF;
END $$;

-- Index for quick admin lookups
CREATE INDEX IF NOT EXISTS admin_activity_log_admin_id_idx ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS admin_activity_log_created_at_idx ON admin_activity_log(created_at DESC);
