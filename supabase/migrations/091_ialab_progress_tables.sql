-- ============================================================================
-- 091_ialab_progress_tables.sql
--
-- Objetivo: dejar de perder progreso de IALab por recurso/examen/actividad.
--
-- Contexto verificado (2026-09-21):
--   El frontend escribe en `user_video_progress`, `user_exams` y
--   `user_activities` (src/lib/progress/{videoProgress,examProgress,
--   activityProgress}.js) pero esas tablas NO existen en producción: cada
--   guardado falla con un error capturado y se pierde en silencio. Solo
--   persiste el agregado de `user_progress` (657 filas hoy).
--
-- Contrato tomado del propio código:
--   * user_video_progress: user_id, module_id, video_id, completed,
--     updated_at + onConflict (user_id, module_id, video_id).
--   * user_exams: user_id, module_id, score, max_score, passed, answers,
--     submitted_at.
--   * user_activities: user_id, module_id, submission, submitted_at.
--
-- RLS: mismo patrón que la migración 064 (fila propia). user_id se guarda como
-- texto (el cliente pasa el id como string) y se compara con auth.uid()::text.
-- Aditiva e idempotente: no toca ninguna tabla existente.
-- ============================================================================

BEGIN;

-- ── user_video_progress ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_video_progress (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    text        NOT NULL,
  module_id  integer     NOT NULL,
  video_id   text        NOT NULL,
  completed  boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id, video_id)
);

CREATE INDEX IF NOT EXISTS idx_user_video_progress_user ON public.user_video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_video_progress_module ON public.user_video_progress(user_id, module_id);

ALTER TABLE public.user_video_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_video_progress_select_own" ON public.user_video_progress;
CREATE POLICY "user_video_progress_select_own" ON public.user_video_progress
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "user_video_progress_insert_own" ON public.user_video_progress;
CREATE POLICY "user_video_progress_insert_own" ON public.user_video_progress
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "user_video_progress_update_own" ON public.user_video_progress;
CREATE POLICY "user_video_progress_update_own" ON public.user_video_progress
  FOR UPDATE USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- ── user_exams ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_exams (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      text        NOT NULL,
  module_id    integer     NOT NULL,
  score        numeric     NOT NULL,
  max_score    numeric     NOT NULL,
  passed       boolean     NOT NULL DEFAULT false,
  answers      jsonb       NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_exams_user_module ON public.user_exams(user_id, module_id);

ALTER TABLE public.user_exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_exams_select_own" ON public.user_exams;
CREATE POLICY "user_exams_select_own" ON public.user_exams
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "user_exams_insert_own" ON public.user_exams;
CREATE POLICY "user_exams_insert_own" ON public.user_exams
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- ── user_activities ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_activities (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      text        NOT NULL,
  module_id    integer     NOT NULL,
  submission   jsonb       NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_activities_user_module ON public.user_activities(user_id, module_id);

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_activities_select_own" ON public.user_activities;
CREATE POLICY "user_activities_select_own" ON public.user_activities
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "user_activities_insert_own" ON public.user_activities;
CREATE POLICY "user_activities_insert_own" ON public.user_activities
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

COMMIT;
