-- Migration 072: IALab analytics/metrics tables
-- Referenced in edutechlife-backend/src/services/metricsService.js
-- Idempotent: safe to run multiple times

-- User session tracking
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at     TIMESTAMPTZ,
  duration_ms  INTEGER,
  platform     TEXT DEFAULT 'ialab',
  metadata     JSONB DEFAULT '{}'
);

-- Lesson completion attempts
CREATE TABLE IF NOT EXISTS public.lesson_attempts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id    TEXT NOT NULL,
  module_id    INTEGER,
  score        NUMERIC(5, 2),
  completed    BOOLEAN DEFAULT false,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Feature usage counters
CREATE TABLE IF NOT EXISTS public.feature_usage (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature    TEXT NOT NULL,
  count      INTEGER DEFAULT 1,
  last_used  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Parent dashboard view tracking
CREATE TABLE IF NOT EXISTS public.parent_dashboard_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id  UUID,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  section     TEXT
);

-- Enable RLS on all metrics tables
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_dashboard_views ENABLE ROW LEVEL SECURITY;

-- RLS: users see only their own rows
DO $$
DECLARE
  policy_defs TEXT[][] := ARRAY[
    ['user_sessions',         'user_sessions_own',           'user_id = auth.uid()'],
    ['lesson_attempts',       'lesson_attempts_own',          'user_id = auth.uid()'],
    ['feature_usage',         'feature_usage_own',            'user_id = auth.uid()'],
    ['parent_dashboard_views','parent_dashboard_views_own',   'parent_id = auth.uid()']
  ];
  r TEXT[];
BEGIN
  FOREACH r SLICE 1 IN ARRAY policy_defs LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = r[1] AND policyname = r[2]
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL USING (%s)',
        r[2], r[1], r[3]
      );
    END IF;
  END LOOP;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx          ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS lesson_attempts_user_id_idx        ON public.lesson_attempts(user_id);
CREATE INDEX IF NOT EXISTS lesson_attempts_lesson_id_idx      ON public.lesson_attempts(lesson_id);
CREATE INDEX IF NOT EXISTS feature_usage_user_id_feature_idx  ON public.feature_usage(user_id, feature);
CREATE INDEX IF NOT EXISTS parent_dashboard_views_parent_idx  ON public.parent_dashboard_views(parent_id);
