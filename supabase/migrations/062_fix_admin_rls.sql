-- ============================================================================
-- Migration 062 — Fix admin RLS policies (P1.5)
--
-- Replaces vulnerable admin policies that used raw_user_meta_data (editable
-- by users) or auth.jwt()->>'role' (never equals 'admin') with service_role
-- policies. Admin access goes through the backend which uses service_role.
-- ============================================================================

DROP POLICY IF EXISTS "Admins can view crisis alerts" ON crisis_alerts;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'crisis_alerts' AND policyname = 'Service role manage crisis alerts') THEN
    CREATE POLICY "Service role manage crisis alerts" ON crisis_alerts FOR ALL
      TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DROP POLICY IF EXISTS "smartboard_admin_all" ON smartboard_kids_data;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'smartboard_kids_data' AND policyname = 'Service role manage smartboard data') THEN
    CREATE POLICY "Service role manage smartboard data" ON smartboard_kids_data FOR ALL
      TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
