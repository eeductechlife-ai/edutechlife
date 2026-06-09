CREATE TABLE IF NOT EXISTS public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  category TEXT DEFAULT 'general',
  difficulty TEXT DEFAULT 'intermediate',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates" ON public.prompt_templates
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own templates" ON public.prompt_templates
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own templates" ON public.prompt_templates
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own templates" ON public.prompt_templates
  FOR DELETE USING (auth.uid()::text = user_id);
