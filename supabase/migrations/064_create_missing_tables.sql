-- ============================================================================
-- 064_create_missing_tables.sql
-- Create tables that existed in ad-hoc scripts but not in prior migrations.
-- All statements are idempotent (IF NOT EXISTS / DROP IF EXISTS).
-- ============================================================================

-- ── user_progress (IALab — referenced by progressController.js) ──────────────
CREATE TABLE IF NOT EXISTS public.user_progress (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id           INTEGER NOT NULL,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed           BOOLEAN DEFAULT false,
  last_accessed       TIMESTAMPTZ DEFAULT now(),
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_progress_select_own" ON public.user_progress;
CREATE POLICY "user_progress_select_own" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_progress_insert_own" ON public.user_progress;
CREATE POLICY "user_progress_insert_own" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_progress_update_own" ON public.user_progress;
CREATE POLICY "user_progress_update_own" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_user    ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module  ON public.user_progress(module_id);

-- ── quiz_attempts ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id              TEXT NOT NULL,
  questions_attempted  INTEGER NOT NULL DEFAULT 0,
  questions_correct    INTEGER NOT NULL DEFAULT 0,
  score                DECIMAL(5,2),
  duration_seconds     INTEGER,
  attempted_at         TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_attempts_own" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_own" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "quiz_attempts_insert_own" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_insert_own" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON public.quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz    ON public.quiz_attempts(quiz_id);

-- ── notifications RLS hardening (table already created in 000_baseline_core) ─
-- Drop and recreate policies with current_user → auth.uid() to align with rest.
DROP POLICY IF EXISTS "Users can view own notifications"   ON public.notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS notifications_user_read              ON public.notifications;
DROP POLICY IF EXISTS notifications_user_update            ON public.notifications;
DROP POLICY IF EXISTS notifications_user_delete            ON public.notifications;
DROP POLICY IF EXISTS "notifications_select_own"           ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert_own"           ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_own"           ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete_own"           ON public.notifications;

-- Cast to text to tolerate user_id columns that are TEXT instead of UUID (schema drift).
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "notifications_insert_own" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (auth.uid()::text = user_id::text);
