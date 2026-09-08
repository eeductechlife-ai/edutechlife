-- Migration 075: Enable RLS on subscription_tiers (Iniciativa #1 — cierre final)
-- subscription_tiers is a public reference table: anyone can read pricing,
-- only service_role (backend) may write.

ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read subscription tiers"
  ON public.subscription_tiers
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role manage subscription tiers"
  ON public.subscription_tiers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
