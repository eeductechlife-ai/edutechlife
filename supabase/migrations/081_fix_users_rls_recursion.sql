-- Migration 081: Fix infinite recursion in users RLS policy
-- The "Institution members read own tenant" policy queries public.users
-- inside its own USING clause, triggering the same policy recursively.
-- Fix: use a SECURITY DEFINER function to bypass RLS on the self-lookup.

CREATE OR REPLACE FUNCTION public.get_my_institution_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT institution_id FROM public.users WHERE id = auth.uid();
$$;

DROP POLICY IF EXISTS "Institution members read own tenant" ON public.users;

CREATE POLICY "Institution members read own tenant"
  ON public.users
  FOR SELECT TO authenticated
  USING (
    institution_id IS NOT NULL
    AND institution_id = public.get_my_institution_id()
  );

-- Allow authenticated users to update their own row
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
