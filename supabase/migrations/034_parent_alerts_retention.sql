-- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'parent_alerts') THEN
    -- ============================================================================
    -- Migration 034 — GDPR Parent Alerts Retention & Archiving
--
    -- Implements automatic archiving of parent alerts older than 90 days
    -- for GDPR compliance (data retention policies).
--
    -- Features:
    --   - parent_alerts_archive table for soft-delete pattern
    --   - archive_old_alerts() function runs daily via pg_cron
    --   - Maintains audit trail while reducing active table size
    --   - Supports data subject access requests (DSAR)
    -- ============================================================================

BEGIN;

    -- Create parent_alerts_archive table (soft delete pattern)
    -- Stores archived alerts for historical records without permanently deleting
CREATE TABLE IF NOT EXISTS parent_alerts_archive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_alert_id UUID NOT NULL UNIQUE,
  parent_user_id TEXT NOT NULL,
  student_user_id TEXT NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  archived_at TIMESTAMPTZ DEFAULT NOW(),
  archive_reason VARCHAR(100) DEFAULT 'retention_policy',
  CONSTRAINT fk_archive_parent_student FOREIGN KEY (parent_user_id, student_user_id)
    REFERENCES parent_student_links(parent_user_id, student_user_id) ON DELETE CASCADE
);

    -- Create indexes for archive queries
CREATE INDEX IF NOT EXISTS idx_parent_alerts_archive_archived ON parent_alerts_archive(archived_at DESC);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_archive_parent ON parent_alerts_archive(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_archive_student ON parent_alerts_archive(student_user_id);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_archive_created ON parent_alerts_archive(created_at DESC);

    -- Add archived_at column to parent_alerts for tracking soft deletes
ALTER TABLE parent_alerts ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_parent_alerts_archived ON parent_alerts(archived_at)
  WHERE archived_at IS NULL;

    -- Add archive_reason for audit trail
ALTER TABLE parent_alerts ADD COLUMN IF NOT EXISTS archive_reason VARCHAR(100) DEFAULT NULL;

    -- Create function to archive old alerts (>90 days old)
CREATE OR REPLACE FUNCTION archive_old_alerts()
RETURNS TABLE(archived_count INTEGER) AS $$
DECLARE
  v_archived_count INTEGER := 0;
BEGIN
  -- Archive alerts older than 90 days
  WITH alerts_to_archive AS (
    SELECT id, original_alert_id, parent_user_id, student_user_id,
           alert_type, title, body, data, read_at, created_at, updated_at
    FROM parent_alerts
    WHERE archived_at IS NULL
      AND created_at < NOW() - INTERVAL '90 days'
    LIMIT 10000 -- Batch processing to avoid locking issues
  ),
  archived AS (
    INSERT INTO parent_alerts_archive
      (original_alert_id, parent_user_id, student_user_id, alert_type,
       title, body, data, read_at, created_at, updated_at, archive_reason)
    SELECT id, parent_user_id, student_user_id, alert_type,
           title, body, data, read_at, created_at, updated_at, 'retention_policy'
    FROM alerts_to_archive
    RETURNING original_alert_id
  ),
  marked_archived AS (
    UPDATE parent_alerts
    SET archived_at = NOW(), archive_reason = 'retention_policy'
    WHERE id IN (SELECT original_alert_id FROM archived)
    RETURNING id
  )
  SELECT COUNT(*)::INTEGER INTO v_archived_count FROM marked_archived;

  -- Log archiving activity
  RAISE NOTICE 'Archive job: archived % alerts', v_archived_count;

  RETURN QUERY SELECT v_archived_count;
END;
$$ LANGUAGE plpgsql;

    -- Enable pg_cron extension if available (requires pg_cron installed on Supabase)
    -- This creates a daily scheduled job to run archive_old_alerts()
    -- Note: In local development, this may require manual execution or a separate scheduler
DO $$
BEGIN
  -- Try to create the cron job; if pg_cron is not available, this will be silently ignored
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    -- Delete existing job if it exists
    SELECT cron.unschedule('archive-parent-alerts-daily');

    -- Schedule daily archiving at 2 AM UTC
    PERFORM cron.schedule(
      'archive-parent-alerts-daily',
      '0 2 * * *', -- Every day at 2 AM UTC
      'SELECT archive_old_alerts()'
    );

    RAISE NOTICE 'Scheduled daily archive job for parent_alerts';
  ELSE
    RAISE NOTICE 'pg_cron extension not available; manual scheduling required';
  END IF;
END $$;

    -- Function to restore an archived alert (for DSAR requests)
CREATE OR REPLACE FUNCTION restore_archived_alert(alert_id UUID)
RETURNS TABLE(restored_id UUID, restored_at TIMESTAMPTZ) AS $$
DECLARE
  v_alert_id UUID;
BEGIN
  -- Find and restore from archive
  SELECT original_alert_id INTO v_alert_id
  FROM parent_alerts_archive
  WHERE original_alert_id = alert_id;

  IF v_alert_id IS NULL THEN
    RAISE EXCEPTION 'Archived alert not found: %', alert_id;
  END IF;

  -- Mark as restored in parent_alerts
  UPDATE parent_alerts
  SET archived_at = NULL, archive_reason = 'restored_from_archive'
  WHERE id = v_alert_id;

  RETURN QUERY SELECT v_alert_id, NOW();
END;
$$ LANGUAGE plpgsql;

    -- RLS Policies for archive table
ALTER TABLE parent_alerts_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents read own archived alerts"
  ON parent_alerts_archive FOR SELECT
  USING (auth.uid()::TEXT = parent_user_id);

CREATE POLICY "Service role manage archived alerts"
  ON parent_alerts_archive FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

    -- Audit log for archiving operations
CREATE TABLE IF NOT EXISTS archive_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation VARCHAR(50) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  parent_user_id TEXT,
  student_user_id TEXT,
  details JSONB DEFAULT '{}'::JSONB,
  performed_by TEXT,
  performed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_archive_audit_log_performed ON archive_audit_log(performed_at DESC);
CREATE INDEX IF NOT EXISTS idx_archive_audit_log_operation ON archive_audit_log(operation);

    -- Function to log archiving operations
CREATE OR REPLACE FUNCTION log_archive_operation(
  p_operation VARCHAR(50),
  p_table_name VARCHAR(100),
  p_record_id UUID,
  p_parent_user_id TEXT,
  p_student_user_id TEXT,
  p_details JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO archive_audit_log
    (operation, table_name, record_id, parent_user_id, student_user_id, details, performed_by)
  VALUES
    (p_operation, p_table_name, p_record_id, p_parent_user_id, p_student_user_id, p_details, auth.uid()::TEXT)
  RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql;

    -- Trigger to log archiving
CREATE OR REPLACE FUNCTION trigger_log_alert_archived()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.archived_at IS NOT NULL AND OLD.archived_at IS NULL THEN
    PERFORM log_archive_operation(
      'archive',
      'parent_alerts',
      NEW.id,
      NEW.parent_user_id,
      NEW.student_user_id,
      jsonb_build_object('reason', NEW.archive_reason, 'alert_type', NEW.alert_type)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER parent_alerts_archived_trigger
AFTER UPDATE ON parent_alerts
FOR EACH ROW
EXECUTE FUNCTION trigger_log_alert_archived();

COMMIT;
  END IF;
END
$$;
