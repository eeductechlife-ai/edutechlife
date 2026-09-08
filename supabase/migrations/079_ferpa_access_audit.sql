-- Migration 079: FERPA access audit log (#26)
-- Registers who accessed educational records, required for FERPA compliance.
-- Covers: third-party service access, admin access, and data export requests.

CREATE TABLE IF NOT EXISTS public.ferpa_access_log (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        TEXT,                        -- auth.uid() of the requester (null = unauthenticated)
  target_user_id TEXT,                        -- whose educational record was accessed
  endpoint       TEXT NOT NULL,
  method         TEXT NOT NULL DEFAULT 'GET',
  ip_address     TEXT,
  requestor_type TEXT NOT NULL DEFAULT 'internal'
                   CHECK (requestor_type IN ('internal', 'admin', 'export', 'api_key')),
  data_category  TEXT NOT NULL DEFAULT 'educational_record'
                   CHECK (data_category IN ('educational_record', 'profile', 'assessment', 'behavioral', 'export')),
  accessed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ferpa_access_log ENABLE ROW LEVEL SECURITY;

-- Only service_role and admins can read audit logs (never expose to regular users)
CREATE POLICY "Service role manages ferpa_access_log"
  ON public.ferpa_access_log
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_ferpa_access_target ON public.ferpa_access_log (target_user_id, accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_ferpa_access_requestor ON public.ferpa_access_log (user_id, accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_ferpa_access_date ON public.ferpa_access_log (accessed_at DESC);
