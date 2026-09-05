-- ============================================================================
-- 064_create_missing_tables.sql
-- Add RLS to tables that existed via ad-hoc scripts (user_progress, quiz_attempts,
-- notifications). All three tables already exist in production with user_id TEXT —
-- CREATE TABLE is skipped; only policies are added.
-- Cast to ::text throughout to handle UUID vs TEXT schema drift.
-- ============================================================================

-- ── user_progress: create if missing (CI fresh DB), then enable RLS ──────────
-- In production this table already exists (created via ad-hoc scripts).
-- IF NOT EXISTS ensures CI can run migrations from scratch.
CREATE TABLE IF NOT EXISTS public.user_progress (
  id         BIGSERIAL PRIMARY KEY,
  user_id    TEXT NOT NULL,
  module_id  TEXT,
  progress   INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_progress_select_own" ON public.user_progress;
CREATE POLICY "user_progress_select_own" ON public.user_progress
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "user_progress_insert_own" ON public.user_progress;
CREATE POLICY "user_progress_insert_own" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "user_progress_update_own" ON public.user_progress;
CREATE POLICY "user_progress_update_own" ON public.user_progress
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- ── quiz_attempts: create if missing (CI fresh DB), then enable RLS ──────────
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id         BIGSERIAL PRIMARY KEY,
  user_id    TEXT NOT NULL,
  quiz_id    TEXT,
  score      INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production table has user_id TEXT (not student_id).
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_attempts_own"        ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_insert_own" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_own" ON public.quiz_attempts
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "quiz_attempts_insert_own" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- ── notifications RLS hardening ───────────────────────────────────────────────
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

CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "notifications_insert_own" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (auth.uid()::text = user_id::text);
