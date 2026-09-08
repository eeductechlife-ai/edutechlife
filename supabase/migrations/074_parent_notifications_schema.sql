-- ============================================================================
-- 074_parent_notifications_schema.sql
-- Create tables for parent notifications system (Fase 4.1)
-- Tables: parents, parent_preferences, notification_logs
-- ============================================================================

-- ── 1. PARENTS TABLE ──────────────────────────────────────────────────────
-- Link parent user (auth.users) to their student(s)
-- This table is the bridge between auth.users (parent) and students
CREATE TABLE IF NOT EXISTS public.parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parents_auth_id ON public.parents(auth_id);
CREATE INDEX IF NOT EXISTS idx_parents_email ON public.parents(email);

ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

-- RLS: Parents can only read their own record
DROP POLICY IF EXISTS "parents_select_own" ON public.parents;
CREATE POLICY "parents_select_own" ON public.parents
  FOR SELECT USING (auth.uid() = auth_id);

DROP POLICY IF EXISTS "parents_update_own" ON public.parents;
CREATE POLICY "parents_update_own" ON public.parents
  FOR UPDATE USING (auth.uid() = auth_id);

-- ── 2. PARENT_PREFERENCES TABLE ───────────────────────────────────────────
-- User preferences for notification channels and frequency
-- One record per parent (UNIQUE parent_id constraint)
CREATE TABLE IF NOT EXISTS public.parent_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL UNIQUE REFERENCES public.parents(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  alert_frequency VARCHAR(20) DEFAULT 'immediate' CHECK (
    alert_frequency IN ('immediate', 'daily', 'weekly')
  ),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parent_preferences_parent_id ON public.parent_preferences(parent_id);

ALTER TABLE public.parent_preferences ENABLE ROW LEVEL SECURITY;

-- RLS: Parents can only read/update their own preferences
DROP POLICY IF EXISTS "parent_preferences_select_own" ON public.parent_preferences;
CREATE POLICY "parent_preferences_select_own" ON public.parent_preferences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parents p
      WHERE p.id = parent_id AND p.auth_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "parent_preferences_update_own" ON public.parent_preferences;
CREATE POLICY "parent_preferences_update_own" ON public.parent_preferences
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.parents p
      WHERE p.id = parent_id AND p.auth_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "parent_preferences_insert_own" ON public.parent_preferences;
CREATE POLICY "parent_preferences_insert_own" ON public.parent_preferences
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.parents p
      WHERE p.id = parent_id AND p.auth_id = auth.uid()
    )
  );

-- ── 3. NOTIFICATION_LOGS TABLE ────────────────────────────────────────────
-- Track all notification send attempts (email, push, sms)
-- Used for delivery tracking, analytics, and debugging
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
  crisis_alert_id BIGINT NOT NULL REFERENCES public.crisis_alerts(id) ON DELETE CASCADE,
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'push', 'sms')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed', 'bounced', 'opened')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivery_timestamp TIMESTAMPTZ,
  open_timestamp TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, crisis_alert_id, channel)
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_parent_id ON public.notification_logs(parent_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_sent_at ON public.notification_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_crisis_alert_id ON public.notification_logs(crisis_alert_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON public.notification_logs(status);

ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS: Parents can only read their own notification logs
DROP POLICY IF EXISTS "notification_logs_select_own" ON public.notification_logs;
CREATE POLICY "notification_logs_select_own" ON public.notification_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parents p
      WHERE p.id = parent_id AND p.auth_id = auth.uid()
    )
  );

-- Service role can insert/update logs
DROP POLICY IF EXISTS "notification_logs_service_insert" ON public.notification_logs;
CREATE POLICY "notification_logs_service_insert" ON public.notification_logs
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "notification_logs_service_update" ON public.notification_logs;
CREATE POLICY "notification_logs_service_update" ON public.notification_logs
  FOR UPDATE USING (true);

-- ── 4. VIEW: parent_contact_info ──────────────────────────────────────────
-- Simplify fetching parent email/phone and notification preferences
CREATE OR REPLACE VIEW public.parent_contact_info AS
SELECT
  p.id AS parent_id,
  p.auth_id,
  p.email,
  p.phone,
  p.name,
  COALESCE(pp.email_enabled, true) AS email_enabled,
  COALESCE(pp.push_enabled, true) AS push_enabled,
  COALESCE(pp.sms_enabled, false) AS sms_enabled,
  COALESCE(pp.alert_frequency, 'immediate') AS alert_frequency,
  pp.id AS preferences_id
FROM public.parents p
LEFT JOIN public.parent_preferences pp ON p.id = pp.parent_id;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
-- Already created above per table, but explicitly listed for clarity:
-- - idx_parents_auth_id (auth lookup)
-- - idx_parents_email (email lookup for notifications)
-- - idx_parent_preferences_parent_id (preferences fetch)
-- - idx_notification_logs_parent_id (parent's notification history)
-- - idx_notification_logs_sent_at (time-range queries)
-- - idx_notification_logs_crisis_alert_id (alert correlation)
-- - idx_notification_logs_status (delivery monitoring)
-- ============================================================================
