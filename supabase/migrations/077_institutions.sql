-- Migration 077: Institutions table — base for multi-tenant isolation (#23)

CREATE TABLE IF NOT EXISTS public.institutions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  country     TEXT NOT NULL DEFAULT 'CO',
  plan_type   TEXT NOT NULL DEFAULT 'free'
                CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  contact_email TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- Only service_role (admins) can manage institutions
CREATE POLICY "Service role manages institutions"
  ON public.institutions
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Read policy for authenticated users added in migration 078 (after institution_id column exists on users)

CREATE INDEX IF NOT EXISTS idx_institutions_slug ON public.institutions (slug);
CREATE INDEX IF NOT EXISTS idx_institutions_plan ON public.institutions (plan_type) WHERE is_active;
