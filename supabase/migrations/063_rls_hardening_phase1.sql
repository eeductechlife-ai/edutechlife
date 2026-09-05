-- Migration: RLS Hardening Phase 1 (Iniciativa #1 — Roadmap de Mejoras)
-- Date: 2026-09-03
--
-- Remediates critical security findings from Supabase database linter.
-- All statements are conditional (DO $$ IF EXISTS) to tolerate schema drift
-- between environments (staging may not have all tables that production has).

-- ── 1. Enable RLS on tables previously exposed without policies ───────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_sessions') THEN
    ALTER TABLE public.student_sessions ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='student_sessions' AND policyname='deny_all_student_sessions') THEN
      CREATE POLICY deny_all_student_sessions ON public.student_sessions USING (FALSE) WITH CHECK (FALSE);
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='archive_audit_log') THEN
    ALTER TABLE public.archive_audit_log ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='archive_audit_log' AND policyname='deny_all_archive_audit_log') THEN
      CREATE POLICY deny_all_archive_audit_log ON public.archive_audit_log USING (FALSE) WITH CHECK (FALSE);
    END IF;
  END IF;
END $$;

-- ── 2. Deny-all policies for unimplemented tables ─────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='lesson_answer_votes') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='lesson_answer_votes' AND policyname='deny_all_lesson_answer_votes') THEN
      CREATE POLICY deny_all_lesson_answer_votes ON public.lesson_answer_votes USING (FALSE) WITH CHECK (FALSE);
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='lesson_answers') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='lesson_answers' AND policyname='deny_all_lesson_answers') THEN
      CREATE POLICY deny_all_lesson_answers ON public.lesson_answers USING (FALSE) WITH CHECK (FALSE);
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='lesson_questions') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='lesson_questions' AND policyname='deny_all_lesson_questions') THEN
      CREATE POLICY deny_all_lesson_questions ON public.lesson_questions USING (FALSE) WITH CHECK (FALSE);
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_permissions') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_permissions' AND policyname='deny_all_user_permissions') THEN
      CREATE POLICY deny_all_user_permissions ON public.user_permissions USING (FALSE) WITH CHECK (FALSE);
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_roles') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='deny_all_user_roles') THEN
      CREATE POLICY deny_all_user_roles ON public.user_roles USING (FALSE) WITH CHECK (FALSE);
    END IF;
  END IF;
END $$;

-- ── 3. SECURITY DEFINER → INVOKER ────────────────────────────────────────────
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='handle_new_user') THEN ALTER FUNCTION public.handle_new_user() SECURITY INVOKER; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='handle_new_user_student') THEN ALTER FUNCTION public.handle_new_user_student() SECURITY INVOKER; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='handle_new_vote') THEN ALTER FUNCTION public.handle_new_vote() SECURITY INVOKER; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='increment_vote') THEN ALTER FUNCTION public.increment_vote(post_id uuid) SECURITY INVOKER; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='mark_comment_as_solution') THEN ALTER FUNCTION public.mark_comment_as_solution(comment_id uuid, post_id uuid, user_id text) SECURITY INVOKER; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='update_security_violation') THEN ALTER FUNCTION public.update_security_violation(p_user_id uuid) SECURITY INVOKER; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='check_daily_attempts') THEN ALTER FUNCTION public.check_daily_attempts(p_user_id uuid, p_module_id integer) SECURITY INVOKER; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='get_user_overall_progress') THEN ALTER FUNCTION public.get_user_overall_progress(p_user_id uuid) SECURITY INVOKER; END IF; END $$;

-- ── 4. Remove SECURITY DEFINER views ─────────────────────────────────────────
DROP VIEW IF EXISTS public.vak_institution_summary CASCADE;
DROP VIEW IF EXISTS public.weekly_leaderboard CASCADE;
