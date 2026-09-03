-- ============================================================================
-- 065_enable_realtime_subscriptions.sql
-- Enable Supabase Realtime on live-update tables and add updated_at triggers.
-- Depends on: 064 (user_progress must exist before enabling realtime on it).
-- ============================================================================

-- Enable realtime on live-update tables.
-- ADD TABLE is idempotent for already-included tables in Postgres 15+; on older
-- versions it raises a harmless "already a member" error caught by the DO block.
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- ── updated_at auto-trigger for user_progress ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER trg_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
