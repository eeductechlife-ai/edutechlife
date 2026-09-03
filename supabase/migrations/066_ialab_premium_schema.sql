-- ============================================================================
-- 066_ialab_premium_schema.sql
-- IALab premium feature schema: subscription tiers, progress tracking, usage.
-- All statements idempotent (IF NOT EXISTS / ON CONFLICT DO NOTHING).
-- ============================================================================

-- ── subscription_tiers ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  monthly_price DECIMAL(10,2),
  yearly_price  DECIMAL(10,2),
  features      JSONB,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.subscription_tiers (id, name, description, monthly_price, yearly_price, features) VALUES
  ('free',       'Free',       'Acceso básico',         0,      0,      '{"modules": 1, "lessons": 5,  "chats": 10}'::jsonb),
  ('pro',        'Pro',        'Acceso completo',       29900,  299000, '{"modules": 5, "lessons": 50, "chats": 500, "export": true}'::jsonb),
  ('enterprise', 'Enterprise', 'Institucional sin límite', null, null,  '{"modules": null, "lessons": null, "chats": null, "api": true}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ── ialab_progress ────────────────────────────────────────────────────────────
-- Granular progress per lesson (complements user_progress which tracks per module).
CREATE TABLE IF NOT EXISTS public.ialab_progress (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id            TEXT NOT NULL,
  lesson_id            TEXT NOT NULL,
  completed_at         TIMESTAMPTZ,
  score                DECIMAL(5,2),
  time_spent_seconds   INTEGER,
  notes                JSONB,
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, module_id, lesson_id)
);

ALTER TABLE public.ialab_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ialab_progress_select_own" ON public.ialab_progress;
CREATE POLICY "ialab_progress_select_own" ON public.ialab_progress
  FOR SELECT USING (auth.uid()::text = student_id::text);

DROP POLICY IF EXISTS "ialab_progress_insert_own" ON public.ialab_progress;
CREATE POLICY "ialab_progress_insert_own" ON public.ialab_progress
  FOR INSERT WITH CHECK (auth.uid()::text = student_id::text);

DROP POLICY IF EXISTS "ialab_progress_update_own" ON public.ialab_progress;
CREATE POLICY "ialab_progress_update_own" ON public.ialab_progress
  FOR UPDATE USING (auth.uid()::text = student_id::text);

CREATE INDEX IF NOT EXISTS idx_ialab_progress_student  ON public.ialab_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_ialab_progress_module   ON public.ialab_progress(module_id);

DROP TRIGGER IF EXISTS trg_ialab_progress_updated_at ON public.ialab_progress;
CREATE TRIGGER trg_ialab_progress_updated_at
  BEFORE UPDATE ON public.ialab_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── usage_metrics ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.usage_metrics (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type  TEXT NOT NULL,
  value        INTEGER NOT NULL DEFAULT 0,
  period_start DATE NOT NULL,
  period_end   DATE NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, metric_type, period_start)
);

ALTER TABLE public.usage_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "usage_metrics_select_own" ON public.usage_metrics;
CREATE POLICY "usage_metrics_select_own" ON public.usage_metrics
  FOR SELECT USING (auth.uid()::text = student_id::text);

CREATE INDEX IF NOT EXISTS idx_usage_metrics_student ON public.usage_metrics(student_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_period  ON public.usage_metrics(student_id, period_start);
