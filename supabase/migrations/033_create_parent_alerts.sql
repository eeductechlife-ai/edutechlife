-- ============================================================================
-- Migration 033 — Parent Alerts Real-time Notification System
--
-- Creates parent_alerts table for real-time notifications to parents about:
--   - Crisis: Detected suicidal ideation → immediate red alert
--   - Achievement: Student unlocked badge → notification
--   - Milestone: Student completed module → notification
--   - Offline: Student disconnected >30 min → optional alert
--   - Unusual: Abnormal point spending → alert
--
-- RLS: Parent can only see alerts about their linked children.
-- Triggers: Crisis alerts, achievement unlocks, module completions auto-generate rows.
-- ============================================================================

BEGIN;

-- Create parent_alerts table
CREATE TABLE IF NOT EXISTS parent_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id TEXT NOT NULL,
  student_user_id TEXT NOT NULL,
  alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('crisis', 'achievement', 'milestone', 'offline', 'unusual_activity')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_parent_student_link FOREIGN KEY (parent_user_id, student_user_id)
    REFERENCES parent_student_links(parent_user_id, student_user_id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_parent_alerts_parent ON parent_alerts(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_student ON parent_alerts(student_user_id);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_created ON parent_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_type ON parent_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_read ON parent_alerts(read_at);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_parent_read ON parent_alerts(parent_user_id, read_at);

-- Enable RLS
ALTER TABLE parent_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Parents can only see alerts about their own children
CREATE POLICY "Parents read own alerts"
  ON parent_alerts FOR SELECT
  USING (auth.uid()::TEXT = parent_user_id);

-- Parents can mark their own alerts as read
CREATE POLICY "Parents update own alerts"
  ON parent_alerts FOR UPDATE
  USING (auth.uid()::TEXT = parent_user_id)
  WITH CHECK (auth.uid()::TEXT = parent_user_id);

-- Parents can delete their own alerts
CREATE POLICY "Parents delete own alerts"
  ON parent_alerts FOR DELETE
  USING (auth.uid()::TEXT = parent_user_id);

-- Service role (backend) can manage all alerts
CREATE POLICY "Service role manage alerts"
  ON parent_alerts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMIT;
