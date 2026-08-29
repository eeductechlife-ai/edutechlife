-- ============================================================================
-- Migration 034 — GDPR Parent Alerts Retention & Archiving
-- Idempotente: CREATE IF NOT EXISTS + políticas/triggers con guard.
-- ============================================================================

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

CREATE INDEX IF NOT EXISTS idx_parent_alerts_archive_archived ON parent_alerts_archive(archived_at DESC);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_archive_parent ON parent_alerts_archive(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_archive_student ON parent_alerts_archive(student_user_id);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_archive_created ON parent_alerts_archive(created_at DESC);

ALTER TABLE parent_alerts ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_parent_alerts_archived ON parent_alerts(archived_at) WHERE archived_at IS NULL;
ALTER TABLE parent_alerts ADD COLUMN IF NOT EXISTS archive_reason VARCHAR(100) DEFAULT NULL;

-- Función de archivado (>90 días)
CREATE OR REPLACE FUNCTION archive_old_alerts()
RETURNS TABLE(archived_count INTEGER) AS $$
DECLARE
  v_archived_count INTEGER := 0;
BEGIN
  WITH alerts_to_archive AS (
    SELECT id, parent_user_id, student_user_id,
           alert_type, title, body, data, read_at, created_at, updated_at
    FROM parent_alerts
    WHERE archived_at IS NULL AND created_at < NOW() - INTERVAL '90 days'
    LIMIT 10000
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

  RAISE NOTICE 'Archive job: archived % alerts', v_archived_count;
  RETURN QUERY SELECT v_archived_count;
END;
$$ LANGUAGE plpgsql;

-- Scheduler opcional con pg_cron (idempotente; no falla si no está instalado)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'archive-parent-alerts-daily') THEN
      PERFORM cron.unschedule('archive-parent-alerts-daily');
    END IF;
    PERFORM cron.schedule('archive-parent-alerts-daily', '0 2 * * *', 'SELECT archive_old_alerts()');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION restore_archived_alert(alert_id UUID)
RETURNS TABLE(restored_id UUID, restored_at TIMESTAMPTZ) AS $$
DECLARE
  v_alert_id UUID;
BEGIN
  SELECT original_alert_id INTO v_alert_id
  FROM parent_alerts_archive WHERE original_alert_id = alert_id;

  IF v_alert_id IS NULL THEN
    RAISE EXCEPTION 'Archived alert not found: %', alert_id;
  END IF;

  UPDATE parent_alerts
  SET archived_at = NULL, archive_reason = 'restored_from_archive'
  WHERE id = v_alert_id;

  RETURN QUERY SELECT v_alert_id, NOW();
END;
$$ LANGUAGE plpgsql;

ALTER TABLE parent_alerts_archive ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parent_alerts_archive' AND policyname = 'Parents read own archived alerts') THEN
    CREATE POLICY "Parents read own archived alerts" ON parent_alerts_archive FOR SELECT
      USING (auth.uid()::TEXT = parent_user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parent_alerts_archive' AND policyname = 'Service role manage archived alerts') THEN
    CREATE POLICY "Service role manage archived alerts" ON parent_alerts_archive FOR ALL
      TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

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

CREATE OR REPLACE FUNCTION trigger_log_alert_archived()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.archived_at IS NOT NULL AND OLD.archived_at IS NULL THEN
    PERFORM log_archive_operation(
      'archive', 'parent_alerts', NEW.id, NEW.parent_user_id, NEW.student_user_id,
      jsonb_build_object('reason', NEW.archive_reason, 'alert_type', NEW.alert_type)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS parent_alerts_archived_trigger ON parent_alerts;
CREATE TRIGGER parent_alerts_archived_trigger
  AFTER UPDATE ON parent_alerts
  FOR EACH ROW EXECUTE FUNCTION trigger_log_alert_archived();
