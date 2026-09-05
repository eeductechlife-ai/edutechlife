-- Migration 070: prompt_templates table for IALab template system
-- Source: edutechlife-backend/sql/create_prompt_templates.sql (standalone → numbered migration)
-- Idempotent: safe to run multiple times

CREATE TABLE IF NOT EXISTS public.prompt_templates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT NOT NULL,
  name         TEXT NOT NULL,
  data         JSONB DEFAULT '{}',
  category     TEXT DEFAULT 'general',
  difficulty   TEXT DEFAULT 'intermediate',
  usage_count  INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'prompt_templates' AND policyname = 'prompt_templates_owner_select'
  ) THEN
    CREATE POLICY prompt_templates_owner_select ON public.prompt_templates
      FOR SELECT USING (auth.uid()::text = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'prompt_templates' AND policyname = 'prompt_templates_owner_insert'
  ) THEN
    CREATE POLICY prompt_templates_owner_insert ON public.prompt_templates
      FOR INSERT WITH CHECK (auth.uid()::text = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'prompt_templates' AND policyname = 'prompt_templates_owner_update'
  ) THEN
    CREATE POLICY prompt_templates_owner_update ON public.prompt_templates
      FOR UPDATE USING (auth.uid()::text = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'prompt_templates' AND policyname = 'prompt_templates_owner_delete'
  ) THEN
    CREATE POLICY prompt_templates_owner_delete ON public.prompt_templates
      FOR DELETE USING (auth.uid()::text = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS prompt_templates_user_id_idx ON public.prompt_templates(user_id);
CREATE INDEX IF NOT EXISTS prompt_templates_category_idx ON public.prompt_templates(category);
