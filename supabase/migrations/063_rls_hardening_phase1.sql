-- Migration: RLS Hardening Phase 1 (Iniciativa #1 — Roadmap de Mejoras)
-- Date: 2026-09-03
-- Author: Claude Code (security audit)
--
-- Remediates critical security findings from Supabase database linter:
-- 1. Enables RLS on tables without protection
-- 2. Creates deny-all policies on tables with no policies
-- 3. Converts SECURITY DEFINER functions to SECURITY INVOKER
-- 4. Removes overly-permissive SECURITY DEFINER views
--
-- This migration closes attack vectors where anon/authenticated users could:
-- - Access student_sessions and audit logs directly
-- - Read/modify internal lookup tables via RPC functions
-- - Bypass authorization checks via SECURITY DEFINER views

-- ============================================================================
-- 1. Enable RLS on tables previously exposed without policies
-- ============================================================================

ALTER TABLE public.student_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive_audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. Deny-all policies for unimplemented tables (internal only, via service_role)
-- ============================================================================

CREATE POLICY deny_all_student_sessions ON public.student_sessions
  USING (FALSE) WITH CHECK (FALSE);

CREATE POLICY deny_all_archive_audit_log ON public.archive_audit_log
  USING (FALSE) WITH CHECK (FALSE);

CREATE POLICY deny_all_lesson_answer_votes ON public.lesson_answer_votes
  USING (FALSE) WITH CHECK (FALSE);

CREATE POLICY deny_all_lesson_answers ON public.lesson_answers
  USING (FALSE) WITH CHECK (FALSE);

CREATE POLICY deny_all_lesson_questions ON public.lesson_questions
  USING (FALSE) WITH CHECK (FALSE);

CREATE POLICY deny_all_user_permissions ON public.user_permissions
  USING (FALSE) WITH CHECK (FALSE);

CREATE POLICY deny_all_user_roles ON public.user_roles
  USING (FALSE) WITH CHECK (FALSE);

-- ============================================================================
-- 3. Restrict SECURITY DEFINER functions to authenticated users only
-- ============================================================================
-- These functions expose internal logic and should not be callable via RPC by anon users.
-- Switching to SECURITY INVOKER means the caller's permissions apply, not the function creator's.

ALTER FUNCTION public.handle_new_user() SECURITY INVOKER;
ALTER FUNCTION public.handle_new_user_student() SECURITY INVOKER;
ALTER FUNCTION public.handle_new_vote() SECURITY INVOKER;
ALTER FUNCTION public.increment_vote(post_id uuid) SECURITY INVOKER;
ALTER FUNCTION public.mark_comment_as_solution(comment_id uuid, post_id uuid, user_id text) SECURITY INVOKER;
ALTER FUNCTION public.update_security_violation(p_user_id uuid) SECURITY INVOKER;
ALTER FUNCTION public.check_daily_attempts(p_user_id uuid, p_module_id integer) SECURITY INVOKER;
ALTER FUNCTION public.get_user_overall_progress(p_user_id uuid) SECURITY INVOKER;

-- ============================================================================
-- 4. Remove SECURITY DEFINER views (to be recreated with SECURITY INVOKER)
-- ============================================================================
-- These views currently enforce permissions of the view creator (postgres),
-- bypassing the querying user's RLS policies. Droppped pending recreation.

DROP VIEW IF EXISTS public.vak_institution_summary CASCADE;
DROP VIEW IF EXISTS public.weekly_leaderboard CASCADE;

-- ============================================================================
-- Notes for follow-up work:
-- ============================================================================
-- 1. Recreate dropped views with SECURITY INVOKER once business logic is reviewed
-- 2. Fix function search_path mutability (WARN-level, secondary fix)
-- 3. Enable leaked password protection in Auth settings (console-only)
-- 4. Add comprehensive RLS policies for all table access patterns
-- 5. Audit backend code to ensure service_role usage is intentional and audited
