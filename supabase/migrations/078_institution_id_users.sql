-- Migration 078: Add institution_id FK to users + tenant-scoped RLS (#23)
-- Establishes the multi-tenant boundary: every user optionally belongs to one institution.
-- RLS on users is tightened: institution members can see each other within the same tenant.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_institution ON public.users (institution_id) WHERE institution_id IS NOT NULL;

-- Admins within an institution can list all members of their tenant
-- (subject to existing role-based policies on the admin routes).
-- Individual users keep their existing "own row" policy; institution scoping
-- is enforced at the service layer via the admin routes + requireInstitutionAdmin check.
-- The policy below allows institution members to read the member list (needed for admin dashboard).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'users' AND policyname = 'Institution members read own tenant'
  ) THEN
    CREATE POLICY "Institution members read own tenant"
      ON public.users
      FOR SELECT TO authenticated
      USING (
        institution_id IS NOT NULL
        AND institution_id = (
          SELECT institution_id FROM public.users u2
          WHERE u2.id = auth.uid()
        )
      );
  END IF;
END $$;
